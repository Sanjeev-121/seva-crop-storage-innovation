import os
import io
import json
import re
from typing import List, Optional, Dict, Any
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from openai import OpenAI
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from knowledge_base import retrieve_relevant_knowledge, APP_NAVIGATION_MAP
from tools import get_farmer_storage_sensors, interpret_alert_event

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("WARNING: OPENAI_API_KEY is not set in environment variables.")

client = OpenAI(api_key=api_key)

# Rate limiting to protect API usage
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Seva AI - Smart Farming Companion API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., max_length=2000)

class FarmerContext(BaseModel):
    farmer_id: Optional[str] = None
    name: Optional[str] = None
    location: Optional[str] = None
    registered_crops: Optional[List[str]] = []

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1500)
    language: str = Field(default="auto", pattern="^(auto|en|hi|bn)$")
    history: List[ChatMessage] = Field(default_factory=list)
    farmer_context: Optional[FarmerContext] = None

class ChatResponse(BaseModel):
    reply: str
    detected_language: str
    navigation_action: Optional[Dict[str, str]] = None
    sources: List[str] = []
    timestamp: str

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    language: str = Field(default="en", pattern="^(en|hi|bn)$")

class AlertRequest(BaseModel):
    event_type: str = Field(..., pattern="^(temp_high|humidity_high|power_failure|sensor_offline)$")
    current_val: str
    threshold_val: str
    crop: str
    language: str = Field(default="en", pattern="^(en|hi|bn)$")

# --- Helper Functions ---

def detect_script_language(text: str) -> str:
    """Fast deterministic script check for Bengali and Devanagari (Hindi)."""
    if re.search(r'[\u0980-\u09FF]', text):
        return "bn"
    if re.search(r'[\u0900-\u097F]', text):
        return "hi"
    return "en"

def clean_text_for_speech(text: str) -> str:
    """Strips markdown symbols so TTS reads naturally without saying 'asterisk' or 'hash'."""
    text = re.sub(r'[*#_`~>]', '', text)
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    text = re.sub(r'\n+', '. ', text)
    return text.strip()

def build_system_prompt(language: str, rag_context: str, sensor_data: Dict, farmer_ctx: Optional[FarmerContext]) -> str:
    lang_instruction = {
        "en": "Respond in clear, simple English suitable for Indian farmers.",
        "hi": "Respond in natural, everyday Hindi (Devanagari script) suitable for Indian farmers. Keep standard agricultural terms clear.",
        "bn": "Respond in natural, everyday Bengali (Bengali script) suitable for Indian farmers. Keep standard agricultural terms clear.",
        "auto": "Detect the language of the farmer's latest message (English, Hindi, or Bengali) and respond strictly in that same language."
    }.get(language, "Respond in the user's language.")

    farmer_info = "No logged-in farmer profile provided."
    if farmer_ctx and (farmer_ctx.name or farmer_ctx.location or farmer_ctx.registered_crops):
        farmer_info = (
            f"Farmer Name: {farmer_ctx.name or 'Unknown'}, "
            f"Location: {farmer_ctx.location or 'Not specified'}, "
            f"Registered Crops: {', '.join(farmer_ctx.registered_crops) if farmer_ctx.registered_crops else 'None'}"
        )

    nav_options = "\n".join([f"- Key '{k}': {v['name']} ({v['route']}) -> {v['description']}" for k, v in APP_NAVIGATION_MAP.items()])

    return f"""You are **Seva AI – Your Smart Farming Companion**, an expert agricultural storage assistant built into the Seva Crop Storage application for Indian farmers.

### 1. LANGUAGE & TONE RULES
- {lang_instruction}
- Keep answers concise, practical, step-by-step, and easy to understand when read aloud (voice-friendly).
- Avoid heavy technical jargon or long walls of text. Use short bullet points.

### 2. STRICT SAFETY & ANTI-HALLUCINATION GUARDRAILS
- **NEVER invent** storage facility availability, cold storage names, rental prices/charges, government subsidy amounts, or live sensor readings.
- **Crop Storage Parameters**: Rely ONLY on the VERIFIED KNOWLEDGE BASE below for exact temperatures, humidity, and durations. If exact data is missing, state that honestly and advise consulting a local Krishi Vigyan Kendra (KVK).
- **Sensor Data**: Current sensor status for this farmer: {json.dumps(sensor_data)}. If `has_active_sensors` is false and the farmer asks "Is my crop safe?" or about live temperature, clearly explain that no live IoT sensor is connected to their account right now, and guide them on what to check manually or with the facility operator. Never diagnose crop health from temperature/humidity alone.

### 3. SMART CROP STORAGE DECISION SUPPORT
When a farmer states they have harvested a crop (e.g., "I have 500 kg of potatoes, what should I do?"):
1. Acknowledge the crop and quantity.
2. Check if you know: (a) intended storage duration, (b) their location/district, and (c) access to cold storage vs. farm-level storage. If missing, ask 1-2 short clarifying questions while giving immediate first-step post-harvest advice (sorting, curing/drying).
3. Explain verified storage requirements, major spoilage risks, and practical next steps.
4. Direct them to check verified local facilities and charges in the Seva app rather than guessing prices.

### 4. APPLICATION NAVIGATION INTEGRATION
Available Seva App Pages:
{nav_options}

If the farmer asks how to perform one of these actions in the app, explain briefly and include the exact navigation key in a JSON block at the very end of your response ONLY if navigation applies, like this:
[NAV:find_storage]
(Valid tags: [NAV:find_storage], [NAV:register_crop], [NAV:my_records], [NAV:compare_costs], [NAV:report_issue]). If a feature does not exist in the list above, say so honestly.

### 5. VERIFIED AGRICULTURAL KNOWLEDGE BASE
{rag_context}

### 6. FARMER PROFILE CONTEXT
{farmer_info}
"""

# --- API Endpoints ---

@app.get("/api/ai/health")
def health_check():
    return {"status": "ok", "service": "Seva AI Assistant"}

@app.post("/api/ai/chat", response_model=ChatResponse)
@limiter.limit("30/minute")
async def chat_endpoint(request: Request, body: ChatRequest):
    if not api_key:
        raise HTTPException(status_code=500, detail="Server missing OPENAI_API_KEY configuration.")

    # 1. Determine language
    detected_lang = body.language if body.language != "auto" else detect_script_language(body.message)

    # 2. Retrieve verified agricultural knowledge (RAG)
    rag_context = retrieve_relevant_knowledge(body.message)
    sources = []
    for line in rag_context.splitlines():
        if line.startswith("- Verified Source:"):
            sources.append(line.replace("- Verified Source:", "").strip())

    # 3. Check live sensor/storage context if farmer_id is present
    farmer_id = body.farmer_context.farmer_id if body.farmer_context else "guest"
    sensor_data = get_farmer_storage_sensors(farmer_id or "guest")

    # 4. Construct messages
    system_prompt = build_system_prompt(body.language, rag_context, sensor_data, body.farmer_context)
    messages = [{"role": "system", "content": system_prompt}]
    
    # Keep last 8 turns for context retention without blowing up token limits
    for msg in body.history[-8:]:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": body.message})

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.3, # Low temperature for factual reliability
            max_tokens=600
        )
        raw_reply = completion.choices[0].message.content or ""

        # Extract optional [NAV:key] tag
        nav_action = None
        nav_match = re.search(r'\[NAV:([a-z_]+)\]', raw_reply)
        if nav_match:
            nav_key = nav_match.group(1)
            nav_action = APP_NAVIGATION_MAP.get(nav_key)
            raw_reply = re.sub(r'\[NAV:[a-z_]+\]', '', raw_reply).strip()

        # Re-verify output language if auto was selected
        final_lang = detect_script_language(raw_reply) if body.language == "auto" else body.language

        return ChatResponse(
            reply=raw_reply,
            detected_language=final_lang,
            navigation_action=nav_action,
            sources=list(set(sources)),
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service temporarily unavailable: {str(e)}")

@app.post("/api/ai/stt")
@limiter.limit("20/minute")
async def speech_to_text(
    request: Request,
    audio: UploadFile = File(...),
    language: str = Form(default="auto")
):
    """Converts spoken English, Hindi, or Bengali audio into editable text via Whisper."""
    if not api_key:
        raise HTTPException(status_code=500, detail="Server missing OPENAI_API_KEY.")

    try:
        audio_bytes = await audio.read()
        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file received.")

        file_tuple = (audio.filename or "recording.webm", io.BytesIO(audio_bytes), audio.content_type or "audio/webm")
        
        whisper_kwargs = {
            "model": "whisper-1",
            "file": file_tuple,
            "prompt": "Indian agriculture, crop storage, potato, onion, rice, paddy, wheat, cold storage, आलू, प्याज, ধান, আলু, পেঁয়াজ"
        }
        if language in ["en", "hi", "bn"]:
            whisper_kwargs["language"] = language

        transcript = client.audio.transcriptions.create(**whisper_kwargs)
        text = transcript.text.strip()
        detected = language if language in ["en", "hi", "bn"] else detect_script_language(text)

        return {
            "text": text,
            "detected_language": detected
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Speech recognition failed: {str(e)}")

@app.post("/api/ai/tts")
@limiter.limit("25/minute")
async def text_to_speech(request: Request, body: TTSRequest):
    """Generates natural spoken audio for English, Hindi, and Bengali responses."""
    if not api_key:
        raise HTTPException(status_code=500, detail="Server missing OPENAI_API_KEY.")

    spoken_text = clean_text_for_speech(body.text)
    if not spoken_text:
        raise HTTPException(status_code=400, detail="No speakable text provided.")

    try:
        # 'nova' and 'shimmer' handle multilingual prosody (Hindi/Bengali/English) cleanly
        voice = "nova" if body.language in ["hi", "bn"] else "alloy"
        response = client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=spoken_text[:1500]
        )
        return StreamingResponse(
            io.BytesIO(response.content),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=seva_speech.mp3"}
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Text-to-speech failed: {str(e)}")

@app.post("/api/ai/interpret-alert")
async def alert_endpoint(body: AlertRequest):
    """Translates raw facility/sensor alerts into farmer-friendly warnings in EN/HI/BN."""
    return interpret_alert_event(
        event_type=body.event_type,
        current_val=body.current_val,
        threshold_val=body.threshold_val,
        crop=body.crop,
        language=body.language
    )