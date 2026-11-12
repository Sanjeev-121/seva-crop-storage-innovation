import React, { useState, useRef, useEffect } from 'react';

const UI_STRINGS = {
  en: {
    title: 'Seva AI',
    subtitle: 'Smart Farming Companion',
    placeholder: 'Ask about crop storage, temperature, or costs...',
    listening: 'Listening... Tap mic to stop',
    transcribing: 'Converting speech to text...',
    reviewSpeech: 'Review or edit your spoken text below, then press Send:',
    thinking: 'Checking agricultural guide...',
    clearConfirm: 'Clear chat history?',
    micError: 'Microphone permission denied or unavailable. Please type your question.',
    welcome:
      'Namaste! I am Seva AI. Ask me in English, Hindi, or Bengali about storing potatoes, onions, rice, wheat, or finding storage facilities.',
    quickPrompts: [
      'How should I store potatoes?',
      'I harvested 500 kg onions, what should I do?',
      'How do I find cold storage?'
    ]
  },
  hi: {
    title: 'सेवा AI (Seva AI)',
    subtitle: 'आपका स्मार्ट कृषि साथी',
    placeholder: 'फसल भंडारण, तापमान या किराए के बारे में पूछें...',
    listening: 'सुन रहा हूँ... रोकने के लिए माइक दबाएँ',
    transcribing: 'आवाज़ को लिखा जा रहा है...',
    reviewSpeech: 'नीचे लिखे गए शब्दों को जाँचें या बदलें, फिर भेजें:',
    thinking: 'कृषि जानकारी देखी जा रही है...',
    clearConfirm: 'चैट इतिहास मिटाएँ?',
    micError: 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया अपना प्रश्न टाइप करें।',
    welcome:
      'नमस्ते! मैं सेवा AI हूँ। आप मुझसे हिंदी, अंग्रेज़ी या बंगाली में आलू, प्याज, धान, गेहूं के भंडारण या कोल्ड स्टोरेज के बारे में पूछ सकते हैं।',
    quickPrompts: [
      'आलू का भंडारण कैसे करें?',
      'मेरे पास 500 किलो प्याज है, क्या करूँ?',
      'कोल्ड स्टोरेज कैसे खोजें?'
    ]
  },
  bn: {
    title: 'সেবা AI (Seva AI)',
    subtitle: 'আপনার স্মার্ট কৃষি সহায়ক',
    placeholder: 'ফসল সংরক্ষণ, তাপমাত্রা বা খরচ সম্পর্কে জিজ্ঞাসা করুন...',
    listening: 'শুনছি... থামাতে মাইক চাপুন',
    transcribing: 'কথা লেখায় রূপান্তর হচ্ছে...',
    reviewSpeech: 'নিচের লেখাটি দেখে প্রয়োজনে ঠিক করুন এবং পাঠান:',
    thinking: 'কৃষি তথ্য যাচাই করা হচ্ছে...',
    clearConfirm: 'কথোপকথন মুছে ফেলবেন?',
    micError: 'মাইক্রোফোনের অনুমতি পাওয়া যায়নি। অনুগ্রহ করে লিখে প্রশ্ন করুন।',
    welcome:
      'নমস্কার! আমি সেবা AI। আলু, পেঁয়াজ, ধান, গম সংরক্ষণ বা হিমঘর (Cold Storage) সম্পর্কে বাংলা, হিন্দি বা ইংরেজিতে জিজ্ঞাসা করুন।',
    quickPrompts: [
      'আলু কীভাবে সংরক্ষণ করব?',
      'আমার ৫০০ কেজি পেঁয়াজ আছে, এখন কী করব?',
      'কাছাকাছি হিমঘর কীভাবে খুঁজব?'
    ]
  }
};

// --- Self-Contained Icons (Zero External Icon Library Required) ---
const Icons = {
  Sprout: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  ),
  Mic: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  ),
  MicOff: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
      <path d="M5 10v2a7 7 0 0 0 12 5" />
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  ),
  Send: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  ),
  Volume2: ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  Square: ({ className = 'w-3 h-3' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
      <rect width="16" height="16" x="4" y="4" rx="2" />
    </svg>
  ),
  X: ({ className = 'w-5 h-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  MessageSquare: ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Trash2: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  ArrowRight: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
  Loader2: ({ className = 'w-4 h-4' }) => (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  AlertCircle: ({ className = 'w-4 h-4' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  ),
  CheckCircle2: ({ className = 'w-3.5 h-3.5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
};

export const SevaAssistant = ({
  apiBaseUrl = 'http://localhost:8000',
  farmerProfile,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('auto');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Voice STT States
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechReadyToEdit, setSpeechReadyToEdit] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  // Voice TTS States
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeUiLang = selectedLang === 'auto' ? 'en' : selectedLang;
  const t = UI_STRINGS[activeUiLang];

  // Load saved conversation from localStorage
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('seva_ai_history');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch {
      setMessages([]);
    }
  }, []);

  // Save conversation to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        window.localStorage.setItem('seva_ai_history', JSON.stringify(messages.slice(-30)));
      } catch {
        // Ignore storage quota errors
      }
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // --- Text-to-Speech (TTS) ---
  const stopSpeaking = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
  };

  const speakMessage = async (msg) => {
    if (speakingMsgId === msg.id) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setSpeakingMsgId(msg.id);

    try {
      const res = await fetch(`${apiBaseUrl}/api/ai/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: msg.content,
          language: msg.language || 'en'
        })
      });

      if (!res.ok) throw new Error('TTS API failed');

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        setSpeakingMsgId(null);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setSpeakingMsgId(null);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch {
      // Browser SpeechSynthesis Fallback
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const cleanText = msg.content.replace(/[*#_`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang =
          msg.language === 'hi' ? 'hi-IN' : msg.language === 'bn' ? 'bn-IN' : 'en-IN';
        utterance.onend = () => setSpeakingMsgId(null);
        utterance.onerror = () => setSpeakingMsgId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeakingMsgId(null);
      }
    }
  };

  // --- Speech-to-Text (STT) ---
  const transcribeAudioBlob = async (blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'farmer_voice.webm');
      formData.append('language', selectedLang);

      const res = await fetch(`${apiBaseUrl}/api/ai/stt`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('STT backend error');
      const data = await res.json();

      if (data.text) {
        setInputText(data.text);
        setSpeechReadyToEdit(true);
      }
    } catch {
      setVoiceError('Could not process voice online. Please edit or type your question.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    setVoiceError(null);
    setSpeechReadyToEdit(false);
    stopSpeaking();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setVoiceError(t.micError);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setVoiceError(t.micError);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- Send Chat Message ---
  const handleSend = async (overrideText) => {
    const textToSend = (overrideText !== undefined ? overrideText : inputText).trim();
    if (!textToSend || isLoading) return;

    stopSpeaking();
    setSpeechReadyToEdit(false);
    setVoiceError(null);

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      language: activeUiLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: selectedLang,
          history: updatedHistory.slice(-8).map((m) => ({
            role: m.role,
            content: m.content
          })),
          farmer_context: farmerProfile
            ? {
                farmer_id: farmerProfile.farmerId,
                name: farmerProfile.name,
                location: farmerProfile.location,
                registered_crops: farmerProfile.registeredCrops
              }
            : null
        })
      });

      if (!res.ok) throw new Error('Chat request failed');
      const data = await res.json();

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        language: data.detected_language || activeUiLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
        navigation: data.navigation_action || null
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          activeUiLang === 'hi'
            ? 'क्षमा करें, अभी सर्वर से संपर्क नहीं हो पा रहा है। कृपया थोड़ी देर बाद पुनः प्रयास करें।'
            : activeUiLang === 'bn'
            ? 'দুঃখিত, এই মুহূর্তে সার্ভারের সাথে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
            : 'Sorry, I cannot reach the Seva AI server right now. Please check your connection and try again.',
        language: activeUiLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    stopSpeaking();
    setMessages([]);
    window.localStorage.removeItem('seva_ai_history');
  };

  const handleNavigationClick = (route) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.location.href = route;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Seva AI Assistant"
          className="flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3.5 rounded-full shadow-xl transition-all duration-200 border-2 border-emerald-500/40 cursor-pointer"
        >
          <div className="bg-white/20 p-1.5 rounded-full">
            <Icons.Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <div className="text-left">
            <div className="font-bold text-base leading-tight">Seva AI</div>
            <div className="text-xs text-emerald-100">English • हिन्दी • বাংলা</div>
          </div>
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[420px] h-[82vh] max-h-[680px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-600 p-2 rounded-xl">
                <Icons.Sprout className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-base leading-tight">{t.title}</h2>
                <p className="text-xs text-emerald-200">{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearConversation}
                  title={t.clearConfirm}
                  className="p-2 hover:bg-emerald-700 rounded-lg text-emerald-100 transition cursor-pointer"
                >
                  <Icons.Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                aria-label="Close Assistant"
                className="p-2 hover:bg-emerald-700 rounded-lg text-white transition cursor-pointer"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Language Selector Bar */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-3 py-2 flex items-center justify-between gap-1">
            {[
              { code: 'auto', label: 'Auto' },
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'bn', label: 'বাংলা' }
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang.code)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedLang === lang.code
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-emerald-100 border border-stone-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {/* Welcome Card if empty */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-stone-200 shadow-sm text-stone-800 text-sm leading-relaxed">
                  {t.welcome}
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-stone-500 px-1">Try asking:</p>
                  {t.quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 px-3.5 py-2.5 rounded-xl transition flex items-center justify-between cursor-pointer"
                    >
                      <span>{prompt}</span>
                      <Icons.MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation History */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-none'
                      : msg.isError
                      ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                  }`}
                >
                  {msg.content}

                  {/* Verified Source Badge */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-start gap-1.5 text-[11px] text-emerald-700 font-medium">
                      <Icons.CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Source: {msg.sources.join(', ')}</span>
                    </div>
                  )}

                  {/* App Navigation Action Button */}
                  {msg.navigation && (
                    <button
                      type="button"
                      onClick={() => handleNavigationClick(msg.navigation.route)}
                      className="mt-3 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-between transition cursor-pointer"
                    >
                      <span>Go to {msg.navigation.name}</span>
                      <Icons.ArrowRight className="w-4 h-4 text-emerald-700" />
                    </button>
                  )}
                </div>

                {/* Timestamp & TTS Playback Control */}
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[11px] text-stone-400">{msg.timestamp}</span>
                  {msg.role === 'assistant' && !msg.isError && (
                    <button
                      type="button"
                      onClick={() => speakMessage(msg)}
                      className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition cursor-pointer ${
                        speakingMsgId === msg.id
                          ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <Icons.Square className="w-3 h-3" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Icons.Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Loading / Thinking Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl w-fit">
                <Icons.Loader2 className="w-4 h-4 text-emerald-700" />
                <span>{t.thinking}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Status / Error Banners */}
          {voiceError && (
            <div className="bg-red-50 border-t border-red-200 px-3 py-2 text-xs text-red-700 flex items-center gap-2">
              <Icons.AlertCircle className="w-4 h-4 shrink-0" />
              <span>{voiceError}</span>
            </div>
          )}

          {isRecording && (
            <div className="bg-red-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-pulse">
              <span>{t.listening}</span>
              <button
                type="button"
                onClick={stopRecording}
                className="bg-white text-red-700 px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          {isTranscribing && (
            <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center gap-2">
              <Icons.Loader2 className="w-3.5 h-3.5" />
              <span>{t.transcribing}</span>
            </div>
          )}

          {speechReadyToEdit && !isRecording && !isTranscribing && (
            <div className="bg-emerald-50 border-t border-emerald-200 px-3 py-1.5 text-[11px] text-emerald-800 font-medium">
              {t.reviewSpeech}
            </div>
          )}

          {/* Input Controls */}
          <div className="p-3 bg-white border-t border-stone-200 flex items-end gap-2">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing || isLoading}
              aria-label={isRecording ? 'Stop Recording' : 'Speak Question'}
              className={`p-3 rounded-xl shrink-0 transition shadow-sm cursor-pointer ${
                isRecording
                  ? 'bg-red-600 text-white ring-4 ring-red-200'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
              } disabled:opacity-50`}
            >
              {isRecording ? <Icons.MicOff className="w-5 h-5" /> : <Icons.Mic className="w-5 h-5" />}
            </button>

            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (speechReadyToEdit) setSpeechReadyToEdit(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t.placeholder}
              className="flex-1 resize-none border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 outline-none max-h-24"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading || isRecording}
              aria-label="Send Message"
              className="p-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white rounded-xl shrink-0 transition shadow-sm cursor-pointer"
            >
              <Icons.Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SevaAssistant;