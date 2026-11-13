from typing import Dict, Any, Optional
from datetime import datetime
from knowledge_base import APP_NAVIGATION_MAP

def get_navigation_action(intent_key: str) -> Optional[Dict[str, str]]:
    """Returns frontend navigation payload if user asks how to use an app feature."""
    return APP_NAVIGATION_MAP.get(intent_key)

def get_farmer_storage_sensors(farmer_id: str) -> Dict[str, Any]:
    """
    INTEGRATION HOOK: Replace this body with a real DB query to your sensor/IoT table.
    Currently returns an explicit 'no live hardware connected' state unless data exists,
    strictly obeying the rule: NEVER fabricate sensor readings.
    """
    # Example structure when your teammates connect real IoT/DB data:
    # record = db.query(StorageRecord).filter_by(farmer_id=farmer_id, status="ACTIVE").first()
    # if record and record.latest_sensor:
    #     return { ... }
    
    return {
        "has_active_sensors": False,
        "message": "No live IoT sensor feed is currently linked to this farmer account.",
        "timestamp": datetime.now().isoformat()
    }

def interpret_alert_event(event_type: str, current_val: str, threshold_val: str, crop: str, language: str) -> Dict[str, str]:
    """Generates structured, verified alert explanations for system notifications."""
    alerts = {
        "en": {
            "temp_high": f"Warning! Storage temperature for your {crop} reached {current_val} (safe limit: {threshold_val}). Risk of sprouting or spoilage. Contact the storage operator immediately to inspect the cooling unit.",
            "humidity_high": f"Alert! Humidity for your {crop} is {current_val} (safe limit: {threshold_val}). High moisture increases fungal rot risk. Ensure ventilation or dehumidification is checked.",
            "power_failure": f"Power Outage Alert at your storage facility. Backup generator status needs verification. Monitor chamber temperature closely.",
            "sensor_offline": f"Sensor Disconnected for your {crop} batch. Live readings are paused. Please check with facility staff."
        },
        "hi": {
            "temp_high": f"चेतावनी! आपके {crop} के भंडारण का तापमान {current_val} हो गया है (सुरक्षित सीमा: {threshold_val})। इससे फसल खराब होने या अंकुरित होने का खतरा है। कृपया तुरंत स्टोरेज ऑपरेटर से संपर्क करें और कूलिंग सिस्टम की जाँच करवाएँ।",
            "humidity_high": f"चेतावनी! आपके {crop} के भंडारण में नमी {current_val} तक बढ़ गई है (सुरक्षित सीमा: {threshold_val})। अधिक नमी से सड़न लग सकती है। वेंटिलेशन की जाँच करवाएँ।",
            "power_failure": f"आपके भंडारण केंद्र में बिजली गुल होने की सूचना है। बैकअप जनरेटर की स्थिति की जाँच करवाएँ।",
            "sensor_offline": f"आपके {crop} बैच का सेंसर संपर्क से बाहर है। लाइव डेटा रुका हुआ है। कृपया केंद्र के कर्मचारियों से संपर्क करें।"
        },
        "bn": {
            "temp_high": f"সতর্কতা! আপনার {crop} সংরক্ষণ কেন্দ্রের তাপমাত্রা {current_val}-এ পৌঁছেছে (নিরাপদ সীমা: {threshold_val})। এতে ফসল নষ্ট বা অঙ্কুরিত হওয়ার ঝুঁকি রয়েছে। অনুগ্রহ করে অবিলম্বে স্টোরেজ অপারেটরের সাথে যোগাযোগ করুন এবং কুলিং সিস্টেম পরীক্ষা করান।",
            "humidity_high": f"সতর্কতা! আপনার {crop} সংরক্ষণে আর্দ্রতা {current_val} হয়েছে (নিরাপদ সীমা: {threshold_val})। অতিরিক্ত আর্দ্রতায় পচন ধরতে পারে। বাতাস চলাচলের ব্যবস্থা পরীক্ষা করান।",
            "power_failure": f"আপনার সংরক্ষণ কেন্দ্রে বিদ্যুৎ বিভ্রাট ঘটেছে। ব্যাকআপ জেনারেটর চালু আছে কিনা তা যাচাই করুন।",
            "sensor_offline": f"আপনার {crop} ব্যাচের সেন্সর সংযোগ বিচ্ছিন্ন হয়েছে। লাইভ তথ্য আপাতত বন্ধ আছে। অনুগ্রহ করে স্টোরেজ কর্মীদের সাথে যোগাযোগ করুন।"
        }
    }
    lang_dict = alerts.get(language, alerts["en"])
    return {
        "alert_text": lang_dict.get(event_type, lang_dict["temp_high"]),
        "timestamp": datetime.now().isoformat()
    }