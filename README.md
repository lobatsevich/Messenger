# 💬 Messenger Project (FastAPI Backend)

This repository contains a backend implementation of a real-time messenger system built with **FastAPI, PostgreSQL, and SQLAlchemy**.

The project is a transition from a previous Node.js + Socket.IO prototype into a **clean, scalable backend architecture with proper database design, authentication, and messaging system core**.

---

## 🚀 Project Overview

This is a backend-first messenger system with:

- User authentication (JWT-based)
- Private messaging system
- Group chat support (architecture ready)
- Chat auto-creation for private dialogs
- Message history retrieval
- Read/unread message state
- Last message tracking for chats
- Clean layered architecture (API → Service → Repository → DB)

The system is designed as a foundation for a full real-time messenger (WebSocket layer planned next).

---

## 🧠 Architecture

```

API Layer (FastAPI routes)
↓
Service Layer (business logic)
↓
Repository Layer (database access)
↓
SQLAlchemy Models
↓
PostgreSQL

```

This ensures:
- separation of concerns
- testability
- scalability
- clean domain logic

---

## 🏗️ Project Structure

```

app/
├── api/              # REST API routes
│   ├── auth.py
│   ├── chat.py
│   ├── deps.py
│   ├── messages.py
│   └── pages.py
│
├── services/         # business logic layer
│   ├── chat_service.py
│   ├── message_service.py
│   └── user_service.py
│
├── repositories/     # database access layer
│   ├── chats.py
│   ├── users.py
│   └── messages.py
│
├── database/
│   ├── models/       # SQLAlchemy models
│   ├── database.py   # engine/session/Base
│   └── dependencies.py
│
├── schemas/          # Pydantic DTOs
├── utils/            # JWT, helpers
└── main.py

```

---

## ⚙️ Tech Stack

- **FastAPI**
- **PostgreSQL**
- **SQLAlchemy 2.0**
- **Alembic (migrations)**
- **Pydantic**
- **JWT (python-jose)**
- **bcrypt**

---

## 🔐 Authentication

- User registration with login, username, tag, password
- JWT-based authentication
- Protected routes via dependency injection
- `/auth/login`, `/auth/register`, `/auth/me`

---

## 💬 Messaging System

### Features:

- Send messages in chats
- Private messaging (auto chat creation if not exists)
- Group chat messaging support
- Message history per chat
- Read/unread tracking (`is_read`)
- Message timestamps
- Edited message flag (prepared)

---

## 🧩 Chat System

- Private chats are created automatically between users
- Group chats supported via `is_group` flag
- Chat membership via `chat_members`
- Chat ownership and access validation
- Ready for real-time sync (WebSocket layer planned)

---

## 📊 Database Features

- Relational schema (users, chats, messages, chat_members)
- Foreign keys with CASCADE behavior
- Alembic migrations configured
- Chat enrichment fields:
  - `last_message_id`
  - `last_message_at`

These fields allow efficient chat sorting without heavy joins.

---

## 📡 API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Messages
- `POST /messages/private`
- `POST /messages/chat`
- `GET /messages/history/{chat_id}`
- `POST /messages/{chat_id}/read`

---

## 🧭 Current Status

### ✅ Implemented

- JWT authentication system
- User system
- Chat creation and membership logic
- Private messaging system
- Message history
- Read/unread state
- Database migrations (Alembic)
- Chat last-message tracking fields
- Clean architecture (service/repository separation)

### 🚧 Next Steps

- WebSocket real-time messaging
- Live chat updates
- Typing indicators
- Online/offline presence system
- Chat list endpoint with optimized sorting
- Frontend integration

---

## 🎯 Project Goal

This project is designed to demonstrate:

- Backend architecture design skills
- Real-world messaging system implementation
- Database-driven system design
- Transition from prototype (Node.js) → production-style Python backend
- Readiness for scalable real-time systems

---

## 📌 Notes

This is an actively evolving project.
Current focus: building a production-ready backend foundation for a real-time messenger system.
