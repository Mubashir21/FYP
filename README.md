# 🐾 WildTechAlert

[![Live Website](https://img.shields.io/badge/Visit-wildtechalert.com-blue)](https://wildtechalert.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/Mubashir21/FYP)
[![Telegram](https://img.shields.io/badge/Join-Telegram_Channel-0088cc)](https://t.me/+Jr-QLw603DU4YjA1)

An end-to-end wildlife detection and alerting platform that monitors animal presence through connected devices, providing real-time notifications and insights.

## 📋 Overview

WildTechAlert is a comprehensive platform designed to detect and monitor wildlife presence through a network of connected devices. The system provides real-time notifications, media evidence, and analytical insights, helping conservation efforts and wildlife management.

## 🔍 Key Features

- **Real-time Detection**: Instant wildlife presence detection with image/video evidence
- **Automated Alerts**: Customizable notifications via email and Telegram
- **Device Management**: Register and monitor the health of connected sensor devices
- **User Roles**: Admin panel for managing stakeholders and approvals
- **Analytics**: Historical detection data, trends, and insights
- **Secure Authentication**: User management powered by Supabase

## 🏗️ Architecture

- **Frontend**: Next.js application hosted on Vercel
- **Backend**: FastAPI service deployed on Heroku
- **Database**: PostgreSQL via Supabase
- **Notification Services**: Email (Resend API) and Telegram Bot

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+ recommended)
- [Supabase](https://supabase.com/) project
- [Resend API](https://resend.com/) account for email alerts
- Telegram Bot for chat alerts

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload
```

## ⚙️ Environment Configuration

Create `.env` files in both `frontend/` and `backend/` directories based on the provided `.env.example` templates.

Required environment variables:

- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_INVITE_LINK`

## 🔗 Links

- [Live Website](https://wildtechalert.com)
- [GitHub Repository](https://github.com/Mubashir21/FYP)
- [Telegram Channel](https://t.me/+Jr-QLw603DU4YjA1)

## 👨‍💻 Development

Developed by Mubashir Shoukat as a Final Year Project at the University of Nottingham Malaysia.

**Supervisor**: Dr. Tomas Maul

---

© 2025 WildTechAlert | All Rights Reserved
