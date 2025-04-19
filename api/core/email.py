import os
import uuid
import resend
from datetime import datetime

async def send_detection_email(stakeholders, detection_id, data, supabase=None):
    
    # Set Resend API key
    resend.api_key = os.environ["RESEND_API_KEY"]
    sender_email = os.environ["SENDER_EMAIL"]
    telegram_link = os.environ["TELEGRAM_INVITE_LINK"]
    
    # Get the media URLs from the data
    sound_url = data.get("sound_url")
    image_url = data.get("image_url")
    
    # Determine the alert type properly
    if data.get("audio_detected") and data.get("camera_detected"):
        alert_type = "both"
    elif data.get("audio_detected"):
        alert_type = "audio"
    elif data.get("camera_detected"):
        alert_type = "camera"
    else:
        alert_type = "Unknown"
    
    # Create alert record
    alert_data = {
        "detection_id": detection_id,
        "status": "pending",
        "channel": "email",
        "alert_type": alert_type,
    }
    
    # Insert alert record
    alert_response = supabase.table("alerts").insert(alert_data).execute()
    alert_id = alert_response.data[0]["id"] if alert_response.data else None                                                        
    
    # Update alert status to processing
    supabase.table("alerts").update({"status": "processing"}).eq("id", alert_id).execute()
    
    for stakeholder in stakeholders:
        print(stakeholder)
        recipient_data = {
            "alert_id": alert_id,
            "stakeholder_id": stakeholder["id"],
            "channel": "email",
            "status": "pending",
        }
        recipient_response = supabase.table("alert_recipients").insert(recipient_data).execute()
        if not recipient_response.data:
            print(f"Failed to create alert recipient for stakeholder {stakeholder['id']}")
            continue
        recipient_id = recipient_response.data[0]["id"]

        email_content = [
            "<div style='font-family: Arial, sans-serif; line-height: 1.5; color: #333;'>",
            f"<p>Dear {stakeholder['name']},</p>",
            "<h2 style='color: #e63946;'>🚨 New Detection Alert</h2>",
            "<p>A new detection was recorded. Details are below:</p>",
            "<table style='border-collapse: collapse; margin-top: 10px;'>",
            f"<tr><td style='padding: 6px 12px; font-weight: bold;'>Device:</td><td>{data['device_name']}</td></tr>",
            f"<tr><td style='padding: 6px 12px; font-weight: bold;'>Detected At:</td><td>{data['detected_at']}</td></tr>",
        ]

    
        if data.get("audio_detected"):
            email_content.append(f"<tr><td style='padding: 6px 12px; font-weight: bold;'>Audio:</td><td>Yes (Confidence: {data.get('confidence_level_audio', 'N/A')})</td></tr>")
            if sound_url:
                email_content.append(f"<tr><td style='padding: 6px 12px; font-weight: bold;'>Sound:</td><td><a href=\"{sound_url}\">Click here to listen 🔊</a></td></tr>")

        if data.get("camera_detected"):
            email_content.append(f"<tr><td style='padding: 6px 12px; font-weight: bold;'>Camera:</td><td>Yes (Confidence: {data.get('confidence_level_camera', 'N/A')})</td></tr>")
            if image_url:
                email_content.append(f"<tr><td style='padding: 6px 12px; font-weight: bold;'>Image:</td><td><a href=\"{image_url}\">Click here to view 📸</a></td></tr>")

        email_content.append(f"<tr><td style='padding: 6px 12px; font-weight: bold;'>Telegram:</td><td><a href=\"{telegram_link}\">Join the group 💬</a></td></tr>")

        email_content.append("</table>")
        unsubscribe_url = f"https://api.wildtechalert.com/unsubscribe?id={stakeholder['id']}"

        email_content.append("<hr style='margin: 20px 0;'>")
        email_content.append(f"<p style='font-size: 0.9em;'>Don't want to receive these alerts anymore? <a href='{unsubscribe_url}'>Unsubscribe here</a>.</p>")
        email_content.append("<p style='margin-top: 20px;'>Stay safe and vigilant,</p>")
        email_content.append("<p>The Detection System 🚀</p>")
        email_content.append("</div>")
        email_html = "\n".join(email_content)


        params = {
            "from": sender_email,
            "to": [stakeholder["email"]],
            "subject": f"New {alert_type.capitalize()} Detection from {data['device_name']}",
            "html": email_html,
        }

        try:
            email_response = resend.Emails.send(params)
            if email_response is None:
                error_msg = "Failed to send email: No response from API"
                supabase.table("alert_recipients").update({
                    "status": "failed",
                }).eq("id", recipient_id).execute()
            elif not isinstance(email_response, dict) or "id" not in email_response:
                error_msg = f"Failed to send email: Response missing 'id' or invalid format {email_response}"
                supabase.table("alert_recipients").update({
                    "status": "failed",
                }).eq("id", recipient_id).execute()
            else:
                supabase.table("alert_recipients").update({
                    "status": "sent",
                    "sent_at": datetime.utcnow().isoformat()
                }).eq("id", recipient_id).execute()
        except Exception as e:
            error_msg = f"Email error: {str(e)} (Type: {type(e).__name__})"
            print(f"Error sending email to {stakeholder['email']}: {error_msg}")
            supabase.table("alert_recipients").update({
                "status": "failed",
            }).eq("id", recipient_id).execute()
    
    # Update alert status to completed
    supabase.table("alerts").update({
        "status": "completed",
        "completed_at": datetime.utcnow().isoformat()
    }).eq("id", alert_id).execute()
    
    return alert_id