# 💬 Messenger Project (Node.js → Python Rewrite)

This repository contains a real-time messenger system that I originally built in **Node.js + Socket.IO**, and am now actively **rewriting in Python using FastAPI + SQLAlchemy + WebSockets** to improve architecture, scalability, and database design.

---

## 🚀 Project Overview

This is a full-stack real-time chat application with:

- User authentication
- Real-time messaging (Socket.IO → WebSockets)
- Profile system with avatars and tags
- Chat history
- User search
- Online/offline status tracking
- Typing indicators

The project is designed as a **learning-to-production transition project**, where I progressively move from a JSON-based Node.js backend to a structured Python backend with a proper database layer.

---

## 🧠 Architecture Evolution

### 🟦 Legacy Version (Node.js)

Located in:
```
node_version/
```

Tech stack:
- Node.js
- Express.js
- Socket.IO
- JSON file storage

Features:
- Basic real-time chat
- File-based storage (users/messages)
- Session-based authentication
- Frontend served via Express

---

### 🟩 Current Version (Python Rewrite)

Located in:
```
app/
```

Tech stack:
- FastAPI
- WebSockets
- SQLAlchemy (planned / in progress)
- PostgreSQL (planned)
- Jinja2 / Static frontend

Planned improvements:
- Proper relational database schema
- Repository-Service architecture
- Scalable WebSocket manager
- Better separation of concerns
- Secure authentication (JWT or session-based)

---

## 🏗️ Current Python Structure

```
app/
├── api/              # REST endpoints
├── websocket/        # real-time communication layer
├── services/         # business logic layer
├── repositories/     # database access layer
├── database/         # models, connection, migrations
├── schemas/          # Pydantic models
├── static/           # frontend (HTML/CSS/JS)
├── utils/            # helpers
└── main.py           # application entry point
```

---

## ⚙️ Setup Instructions

### 1. Clone repository
```bash
git clone https://github.com/your-username/messenger.git
cd messenger
````

---

### 2. Create virtual environment

```bash
python -m venv .venv
```

Activate:

**Windows**

```bash
.venv\Scripts\activate
```

---

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Run server

```bash
uvicorn app.main:app --reload
```

---

## 📌 Environment Variables

Create `.env` in project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/messenger
SECRET_KEY=your_secret_key
DEBUG=True
```

---

## 🔥 Key Features

### 💬 Real-time chat

* Instant messaging via WebSockets
* Message editing / deletion
* Typing indicators

### 👤 User system

* Registration / login
* Profile editing
* Avatars upload
* User search

### 🟢 Presence system

* Online / offline status
* Last seen tracking

---

## 🧭 Project Goal

The goal of this project is not just to build a messenger, but to demonstrate:

* Ability to design backend architecture
* Migration from simple JS backend → structured Python backend
* Understanding of database-driven systems
* Real-time communication systems (WebSockets)
* Clean separation of concerns (API / Service / Repository layers)

---

## 🔄 Migration Status

* [x] Node.js version completed
* [x] Basic Python structure created
* [ ] Database integration
* [ ] Authentication system rewrite
* [ ] WebSocket migration
* [ ] Production-ready deployment setup

---

## 📌 Notes

This project is actively evolving.
The Python version is currently under development and will eventually replace the Node.js implementation as the main backend.