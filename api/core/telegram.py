import os
import requests

async def send_detection_telegram(stakeholders, detection_id, data):
    BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
    CHAT_ID = os.environ["TELEGRAM_CHAT_ID"]

    # Base message
    message = (
        f"🚨 *Detection Alert* 🚨\n\n"
        f"*Device:* {data['device_name']}\n"
        f"*Detected At:* {data['detected_at']}\n"
        # f"*Alert Type:* {data['alert_type']}\n"
    )

    # Add Audio section if detected
    if data.get("audio_detected"):
        message += (
            f"\n🎤 *Audio Detection*\n"
            f"• Confidence: {data.get('confidence_level_audio', 'N/A')}\n"
            f"• [Listen to Audio]({data.get('sound_url', '#')})\n"
        )

    # Add Camera section if detected
    if data.get("camera_detected"):
        message += (
            f"\n📷 *Camera Detection*\n"
            f"• Confidence: {data.get('confidence_level_camera', 'N/A')}\n"
            f"• [View Image]({data.get('image_url', '#')})\n"
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
