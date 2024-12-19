import requests
from dotenv import load_dotenv
import os

load_dotenv()

# API Details
base_url = "http://localhost:8000"
api_key = api_key = os.getenv("API_KEY")
headers = {"Content-Type": "application/json", "X-API-Key": api_key}

# /detect Endpoint
url = f"{base_url}/detect"
payload = {
    "confidence_score": 0.85,
    "device_id": 123,
    "timestamp": "2024-12-19T12:34:56Z"
}

response = requests.post(url, headers=headers, json=payload)
print("Response:", response.json())

# /health Endpoint
url = f"{base_url}/health"
response = requests.get(url)
print("Health Check:", response.json())
