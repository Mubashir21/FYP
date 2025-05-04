import os
import requests
from datetime import datetime

async def send_detection_telegram(stakeholders, detection_id, data):
    BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
    CHAT_ID = os.environ["TELEGRAM_CHAT_ID"]

    # Format datetime
    dt = datetime.fromisoformat(data['detected_at'].replace("Z", "+00:00"))
    date_str = dt.strftime("%d %b %Y")   # e.g. 01 May 2025
    time_str = dt.strftime("%H:%M:%S")   # e.g. 14:35:10

    # Format confidence
    audio_conf = round(data.get("confidence_level_audio", 0) * 100)
    camera_conf = round(data.get("confidence_level_camera", 0) * 100)

    # Base message
    message = (
        f"🚨 *Detection Alert* 🚨\n\n"
        f"*Device:* `{data['device_name']}`\n"
        f"*Date:* {date_str}\n"
        f"*Time:* {time_str}\n"
    )

    # Add Audio section if detected
    if data.get("audio_detected"):
        message += (
            f"\n🎤 *Audio Detection*\n"
            f"• Confidence: *{audio_conf}%*\n"
            f"• [🎧 Listen to Audio]({data.get('sound_url', '#')})\n"
        )

    # Add Camera section if detected
    if data.get("camera_detected"):
        message += (
            f"\n📷 *Camera Detection*\n"
            f"• Confidence: *{camera_conf}%*\n"
            f"• [🖼️ View Image]({data.get('image_url', '#')})\n"
        )

    # Send message to Telegram
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False
    }

    response = requests.post(url, json=payload)

    if response.status_code != 200:
        print(f"❌ Failed to send Telegram message: {response.text}")
