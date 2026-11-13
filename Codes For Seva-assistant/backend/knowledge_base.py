import re
from typing import List, Dict

# Verified Indian Agricultural Storage Standards (Source: ICAR & NHB)
VERIFIED_CROP_DATA: List[Dict] = [
    {
        "id": "potato",
        "crop": "Potato (आलू / আলু)",
        "keywords": ["potato", "potatoes", "aloo", "alu", "আলু", "आलू"],
        "temp_c": "2°C to 4°C (for seed/table); 10°C to 12°C (for processing/chips to prevent sweetening)",
        "humidity": "90% to 95% RH",
        "duration": "5 to 8 months in cold storage",
        "precautions": "Cure tubers for 10-14 days in shade before cold storage. Sort out bruised, cut, or diseased tubers. Use gunny/jute bags (50 kg capacity) stacked with proper air gaps.",
        "risks": "Chilling injury below 0°C; sweetening (sugar accumulation) below 8°C; sprouting above 12°C; soft rot if wet tubers are stored.",
        "source": "ICAR - Central Potato Research Institute (CPRI) & NHB Guidelines"
    },
    {
        "id": "onion",
        "crop": "Onion (प्याज / পেঁয়াজ)",
        "keywords": ["onion", "onions", "pyaz", "peyaj", "পেঁয়াজ", "प्याज"],
        "temp_c": "25°C to 30°C (ventilated ambient storage) OR 0°C to 2°C (cold storage)",
        "humidity": "65% to 70% RH (CRITICAL: High humidity causes rotting and sprouting)",
        "duration": "3 to 5 months in ventilated structures (Chawl)",
        "precautions": "Field curing for 3-5 days followed by shade curing for 10-15 days until necks are tight and dry. Leave 2-2.5 cm neck above the bulb when cutting tops.",
        "risks": "Black mold and basal rot if humidity exceeds 75%; premature sprouting between 10°C and 20°C.",
        "source": "ICAR - Directorate of Onion and Garlic Research (DOGR)"
    },
    {
        "id": "rice_paddy",
        "crop": "Rice / Paddy (धान / चावल / ধান / চাল)",
        "keywords": ["rice", "paddy", "dhan", "chawal", "ধান", "চাল", "धान", "चावल"],
        "temp_c": "Ambient dry temperature (below 25°C preferred)",
        "humidity": "Below 65% RH; Grain moisture MUST be dried to 12% - 14% before storage",
        "duration": "6 to 12 months in dry godowns/silos",
        "precautions": "Sun-dry paddy thoroughly until grain moisture is under 13%. Clean storage bags/bins and treat empty godowns against weevils. Stack bags on wooden pallets (dunnage), never directly on concrete floors or touching walls.",
        "risks": "Fungal growth (mycotoxins/aflatoxin), heating, and insect infestation (rice weevil, lesser grain borer) if grain moisture is above 14%.",
        "source": "ICAR - National Rice Research Institute (NRRI) & WDRA Standards"
    },
    {
        "id": "wheat",
        "crop": "Wheat (गेहूं / গম)",
        "keywords": ["wheat", "gehu", "gehun", "gom", "গম", "गेहूं"],
        "temp_c": "Ambient cool and dry",
        "humidity": "Below 65% RH; Grain moisture MUST be below 12%",
        "duration": "8 to 12 months",
        "precautions": "Dry grains until hard and biting produces a sharp cracking sound (under 12% moisture). Use airtight metal bins (Pusa bin) or clean jute bags on wooden dunnage. Keep away from damp walls.",
        "risks": "Khapra beetle, rust-red flour beetle, and moisture absorption during monsoon.",
        "source": "ICAR - Indian Institute of Wheat and Barley Research (IIWBR)"
    },
    {
        "id": "tomato",
        "crop": "Tomato (टमाटर / টমেটো)",
        "keywords": ["tomato", "tomatoes", "tamatar", "tometo", "টমেটো", "टमाटर"],
        "temp_c": "12°C to 15°C (Mature green); 8°C to 10°C (Ripe)",
        "humidity": "85% to 90% RH",
        "duration": "1 to 3 weeks (short-term storage only)",
        "precautions": "Harvest at breaker/turning stage for transport and storage. Pre-cool to remove field heat. Pack in ventilated plastic crates, not sacks.",
        "risks": "Chilling injury (pitting, failure to ripen, decay) if stored below 10°C for mature green tomatoes.",
        "source": "National Centre for Cold-chain Development (NCCD)"
    }
]

APP_NAVIGATION_MAP = {
    "find_storage": {
        "route": "/facilities",
        "name": "Find Storage Facilities",
        "description": "Search nearby cold storages and dry warehouses, filter by crop type, and check capacity."
    },
    "register_crop": {
        "route": "/register-crop",
        "name": "Register Harvested Crop",
        "description": "Log your harvested crop quantity, variety, and book storage space."
    },
    "my_records": {
        "route": "/my-storage",
        "name": "My Stored Crop Records",
        "description": "View active storage batches, receipts, live sensor temperatures, and storage history."
    },
    "compare_costs": {
        "route": "/compare",
        "name": "Compare Storage Charges",
        "description": "Compare per-quintal/per-bag monthly rental rates across facilities."
    },
    "report_issue": {
        "route": "/support/report",
        "name": "Report a Storage Problem",
        "description": "Raise an alert or ticket for cooling issues, billing disputes, or damaged stock."
    }
}

def retrieve_relevant_knowledge(query: str) -> str:
    """Retrieves verified crop storage facts matching the user's query."""
    q_lower = query.lower()
    matched = []
    
    for entry in VERIFIED_CROP_DATA:
        if any(kw in q_lower for kw in entry["keywords"]):
            matched.append(
                f"CROP: {entry['crop']}\n"
                f"- Recommended Temperature: {entry['temp_c']}\n"
                f"- Recommended Humidity: {entry['humidity']}\n"
                f"- Safe Storage Duration: {entry['duration']}\n"
                f"- Pre-Storage Precautions: {entry['precautions']}\n"
                f"- Key Risks: {entry['risks']}\n"
                f"- Verified Source: {entry['source']}"
            )
            
    if not matched:
        return (
            "No specific crop entry matched in the verified knowledge base. "
            "If the user asks about a specific crop not listed above (Potato, Onion, Rice/Paddy, Wheat, Tomato), "
            "give general safe post-harvest principles (drying, sorting, clean ventilation) and explicitly state "
            "that exact temperature/humidity figures for that specific crop should be verified with a local Krishi Vigyan Kendra (KVK)."
        )
        
    return "\n\n---\n\n".join(matched)