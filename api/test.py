import requests
from dotenv import load_dotenv
import os
from supabase import create_client, Client
import json
import mimetypes

load_dotenv()

# API Details
# base_url = "https://wildtechalert-39e415aada0a.herokuapp.com"
base_url = "http://localhost:5000"
api_key = api_key = os.getenv("API_KEY")
# headers = {"Content-Type": "application/json", "X-API-Key": api_key}


url = f"{base_url}/detect"
# Detection data
payload = {
    "confidence_level_audio": 0.79,
    "confidence_level_camera": 0.69,
    "device_name": "24a",
    "detected_at": "2024-03-26T12:00:00Z",
    "audio_detected": True,
    "camera_detected": True,
    "weather": {"temperature": 25, "humidity": 60}
}

# Files to upload
files = {
    "sound_file": ("elephant-noise.mp3", open("test_files/elephant-noise.mp3", "rb"), "audio/mpeg"),
    "image_file": ("spotted_elephant.jpg", open("test_files/spotted_elephant.jpg", "rb"), "image/jpeg")
}

# Headers
headers = {"x-api-key": api_key}

# Send request
response = requests.post(url, headers=headers, files=files, data={"payload": json.dumps(payload)})

# Print response
print(response.status_code)
# print(response.json())
print(response.text)

# /health Endpoint
# url = f"{base_url}/handshake"
# headers = {"x-api-key": api_key, "x-device-name": "24a"}
# response = requests.post(url, headers=headers)
# print("Handshake:", response.json())

# register endpoint
# url = f"{base_url}/register"
# data = {
#     "device_name": "24a",  # Use a device name that exists in your devices table
#     "registration_code": "REG-A520-CF49"  # Use a valid registration code from your registrations table
# }

# # Send the POST request
# response = requests.post(url, data=data)

# # Print response
# print(f"Status Code: {response.status_code}")
# print(f"Response Body: {response.json()}")