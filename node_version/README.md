
### Backend Structure
- `app.js` — application entry point
- `config.js` — server, session, and Socket.IO setup
- `routes/` — HTTP + WebSocket handlers
- `database/` — file-based storage layer

### Frontend Structure
- `socket.js` — real-time communication layer
- `interface.js` — rendering logic
- `frontend.js` — UI state management
- `messages.js` — messaging system
- `users.js` — user management
- `utils.js` — helper functions

---

## 🔄 Real-time System

The application uses **Socket.IO** for real-time communication.

### Client → Server Events
- `send_message`
- `set_room`
- `message_history`
- `search_users`
- `edit_message`
- `delete_message`
- `typing`

### Server → Client Events
- `display_message`
- `chat_list`
- `message_history`
- `user-profile`
- `companion_info`
- `update_user_status`
- `typing`

---

## 🧩 Key Capabilities

- Private chat system (sender ↔ receiver model)
- Real-time message synchronization
- Message lifecycle management (create / edit / delete)
- Live user search
- Profile system with avatar upload
- Session-based authentication
- Dynamic UI rendering without frameworks

---

## 📦 Data Storage

Currently uses **JSON file-based storage** for simplicity:
- Users stored in `/database/users`
- Messages stored in `/database/messages`

⚠️ This is a temporary solution and will be replaced with a relational database.

---

## 🛠 Current Limitations (Known Issues)

- No relational database (currently JSON-based)
- No service layer separation (logic partly in routes)
- Frontend uses manual DOM manipulation
- No centralized state management

---

## 🚧 Future Improvements

This project is actively evolving. Planned upgrades include:

### Backend Migration
- 🔄 Migration from JSON storage → PostgreSQL
- 🧱 Refactor into service-based architecture
- ⚡ Improve scalability and performance

### Python Version (Planned)
A full backend rewrite is planned using:
- FastAPI
- WebSockets
- PostgreSQL
- Async architecture

This will allow:
- Better scalability
- Cleaner architecture
- Improved performance under load

### Frontend Improvements
- Refactor to component-based architecture
- Possible migration to modern framework (React/Vue)
- Better state management

---

## 🎯 Why this project matters

This project demonstrates:

- Real-time system design
- Backend architecture skills
- WebSocket communication
- Session-based authentication
- Full-stack development experience
- Ability to build production-like applications

---

## 📌 Status

🟡 Active development  
🧪 Experimental architecture  
🚀 Preparing for internship applications (backend focus)

---

## 👨‍💻 Author

Built as a learning and portfolio project focused on backend development, real-time systems, and scalable architecture design.

---

## ⭐ Note

This project is not a tutorial clone — it is a custom-built real-time system developed from scratch with continuous improvements and planned migration to a more scalable backend architecture.