# 📱 Frontend Architecture – AI College Guide Chatbot

## 🚀 Overview

This document describes the frontend structure and design of the **AI College Guide Chatbot**.

The frontend is built using:

* ⚛️ React (Vite)
* 🎨 Tailwind CSS
* 🌐 Axios (API communication)
* 🔄 Component-based architecture

The goal is to maintain a **clean, scalable, and production-ready UI** without overengineering.

---

## 📁 Project Structure

```
frontend/
│
├── src/
│   ├── api/
│   │   └── chatApi.js
│   │
│   ├── components/
│   │   ├── ChatBot.jsx
│   │   ├── InputBox.jsx
│   │   └── Messages.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── package.json
├── package.json
└── vite.config.js
```

---

## 🧠 Core Design Principles

* 🔹 Separation of concerns (UI vs API vs logic)
* 🔹 Minimal but scalable structure
* 🔹 Avoid overengineering
* 🔹 Focus on UX before advanced architecture

---

## 🔌 API Layer

### File: `src/api/chatApi.js`

Handles all backend communication.

```js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api"
});

const MODE = "test"; // "test" or "prod"

export const sendChat = async (message) => {
  const endpoint =
    MODE === "test" ? "/test/delay" : "/chat";

  const res = await API.post(endpoint, { message });
  return res.data;
};
```

### Benefits

* Centralized API handling
* Easy switching between test and production
* Cleaner UI code

---

## 💬 ChatBot Component

### Responsibilities

* Manages chat state
* Handles message sending
* Controls loading and error states
* Auto-scroll behavior

### Key Features

* Prevents multiple simultaneous requests
* Displays typing indicator
* Handles API errors gracefully

---

## 🧾 Messages Component

### Responsibilities

* Displays individual chat messages

### Features

* User vs Bot alignment
* Tailwind-based styling
* Supports multiline text

### Important Fix

```jsx
style={{ whiteSpace: "pre-wrap" }}
```

This ensures:

* Proper newline rendering (`\n`)
* Clean formatted responses

---

## ⌨️ InputBox Component

### Responsibilities

* Handles user input
* Sends messages
* Auto-resizing textarea

### Features

* Enter to send
* Shift + Enter for newline
* Disabled during loading
* Dynamic height adjustment

---

## ⚙️ State Management

Currently using:

```js
useState
```

### State Variables

| State    | Purpose         |
| -------- | --------------- |
| messages | chat history    |
| loading  | API in progress |
| error    | error handling  |

---

## 🔄 Message Flow

```
User Input
   ↓
InputBox
   ↓
ChatBot (sendMessage)
   ↓
API Layer (Axios)
   ↓
Backend
   ↓
Response
   ↓
Messages Render
```

---

## 🧪 Testing Setup

Frontend supports testing via backend mock routes:

| Endpoint     | Purpose              |
| ------------ | -------------------- |
| /test/delay  | simulate latency     |
| /test/error  | simulate failures    |
| /test/slow   | long response        |
| /test/large  | UI stress test       |
| /test/stream | streaming simulation |

---

## 🚫 Current Limitations

* No authentication
* No chat history persistence
* No session management
* No streaming (real-time tokens)
* No markdown rendering

---

## 🔮 Future Improvements

### High Priority

* Context-aware conversations
* Streaming responses (real-time output)

### Medium Priority

* Chat history (per user)
* Authentication system
* Multi-session chats

### Low Priority

* Markdown rendering
* UI polish & animations

---

## ⚠️ Key Engineering Decisions

### ✔ Done

* API abstraction layer
* Controlled request flow (no spamming)
* Clean component separation

### ❌ Avoided (for now)

* Redux / Zustand
* Over-modularization
* Complex state systems

---

## 🧠 Important Learnings

* LLM UX depends heavily on frontend behavior
* Formatting matters (newline handling)
* Async control is critical in chat systems
* Mocking APIs is essential for development

---

## 🎯 Conclusion

The frontend is:

* ✅ Functional
* ✅ Scalable (to an extent)
* ✅ Cleanly structured

It is intentionally kept **simple but extensible**, allowing future upgrades without major rewrites.

---
