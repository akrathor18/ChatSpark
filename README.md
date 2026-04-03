# ChatSpark

A full-stack real-time chat application built with Next.js and Express, featuring WebSocket-based messaging, OAuth authentication, and a feature-based frontend architecture.

---

## Features

- **Real-Time Messaging** — Bidirectional communication via Socket.IO with optimistic UI updates, delivery/read receipts, and typing indicators
- **Authentication** — Multi-provider support (Google, GitHub) via NextAuth.js alongside credential-based auth with JWT; includes password reset flow via email
- **Privacy-Aware Presence System** — Online/offline tracking with per-user privacy controls that enforce reciprocity (users who hide their status don't see others' status)
- **User Profiles** — Public profile pages (`/[username]`), avatar upload via Cloudinary, bio, and username reservation system with history tracking
- **Markdown Chat Rendering** — Messages rendered with full Markdown support and auto-detected syntax highlighting via highlight.js
- **Virtualized Message List** — Efficient rendering of large conversation histories using react-virtuoso
- **Transactional Account Deletion** — Full data cleanup (messages, conversations, memberships) wrapped in MongoDB transactions

## Architecture

### Backend — Service–Controller–Route

The Express server follows a strict layered architecture:

```
Route → Controller → Service → Model
```

- **Routes** define endpoints and attach middleware (auth, file upload)
- **Controllers** handle HTTP concerns — request parsing, response formatting, error responses
- **Services** contain all business logic and database operations
- **Models** define Mongoose schemas with validation, hooks, and instance methods

### Frontend — Feature-Based Modules

The Next.js client uses a modular feature architecture. Each domain (chat, profile, user) is self-contained:

```
features/
├── chat/
│   ├── components/    # Presentational components
│   ├── containers/    # Smart components with business logic
│   ├── hooks/         # Feature-specific hooks
│   ├── services/      # API call layer
│   ├── store/         # Zustand slices
│   └── utils/
└── profile/
    ├── components/
    ├── containers/
    ├── hooks/
    ├── services/
    ├── store/
    └── types/
```

### Real-Time Layer

Socket.IO handlers are organized in a dedicated module with event-based architecture:

| Event | Direction | Description |
|---|---|---|
| `send_message` | Client → Server | Persists message, broadcasts to room + member rooms |
| `receive_message` | Server → Client | Delivers message with `tempId` for optimistic reconciliation |
| `mark_read` | Client → Server | Updates status with reciprocal privacy checks |
| `messages_read` | Server → Client | Notifies sender of read receipts |
| `typing` / `stop_typing` | Bidirectional | Privacy-gated typing indicators |
| `user_online` / `user_offline` | Server → Client | Presence events with multi-socket tracking |

Multi-device support is handled by tracking socket sets per user — a user is only marked offline when their last socket disconnects.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| State Management | Zustand |
| UI Components | Radix UI, shadcn/ui, Tailwind CSS 4 |
| Real-Time | Socket.IO (client + server) |
| Backend | Express 5, TypeScript |
| Database | MongoDB with Mongoose 9 |
| Authentication | NextAuth.js (Google, GitHub), JWT |
| File Storage | Cloudinary via multer |
| Email | Nodemailer |
| Validation | Zod, react-hook-form |

## Project Structure

```
ChatSpark/
├── client/
│   ├── app/
│   │   ├── (auth)/              # Sign-in, sign-up, onboarding, password reset
│   │   ├── (protected)/         # Chat, profile (middleware-guarded)
│   │   ├── (user)/[username]/   # Public profile pages
│   │   └── api/auth/            # NextAuth + token sync routes
│   ├── components/              # Shared UI (auth, theme, shadcn)
│   ├── features/                # Domain modules (chat, profile, user)
│   ├── hooks/                   # Global hooks
│   ├── services/                # Global API services
│   ├── store/                   # Global state (auth, user)
│   └── middleware.ts            # Route protection with multi-cookie auth check
│
└── server/
    └── src/
        ├── config/              # Database, Cloudinary
        ├── controllers/         # Request handlers
        ├── middlewares/         # Auth, error handling, file upload
        ├── models/              # Mongoose schemas
        ├── routes/              # Express route definitions
        ├── services/            # Business logic layer
        ├── socket/              # WebSocket event handlers
        └── utils/               # JWT, email, username validation, errors
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Cloudinary account
- Google and/or GitHub OAuth credentials

### Environment Variables

**Server** (`server/.env`):

```env
MONGO_URI=
JWT_SECRET=
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=http://localhost:3000
```

**Client** (`client/.env`):

```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_ID=
GOOGLE_SECRET=
GITHUB_ID=
GITHUB_SECRET=
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Installation

```bash
# Clone
git clone https://github.com/akrathor18/ChatSpark.git
cd ChatSpark

# Server
cd server
npm install
npm run dev          # Runs on port 5000

# Client (separate terminal)
cd client
npm install
npm run dev          # Runs on port 3000
```

## Engineering Highlights

- **Transactional Data Integrity** — Account deletion uses MongoDB sessions to atomically remove users, messages, conversations, and memberships
- **Privacy Reciprocity** — Online status and read receipts enforce mutual visibility — if you disable a feature, you lose access to it from others
- **Multi-Socket Presence** — Users connecting from multiple devices/tabs are tracked individually; offline is only triggered when the last socket disconnects
- **Optimistic Message Delivery** — Messages render immediately on send with a temporary ID, then reconcile when the server confirms persistence
- **Cookie Race Condition Handling** — OAuth redirect flow includes cache-busting headers and multi-cookie checks to prevent middleware race conditions
- **Username Reservation** — Previous usernames are stored and blocked from reuse by other accounts

## Roadmap

- [ ] End-to-end encryption for direct messages
- [ ] File and image sharing within conversations
- [ ] Group chat administration (roles, permissions, moderation)
- [ ] Message search and conversation filtering
- [ ] Push notifications (web + mobile)
- [ ] Rate limiting and abuse prevention
- [ ] Database indexing and query optimization for large-scale conversations

## Author

**Ashish Kumar**
GitHub: [@akrathor18](https://github.com/akrathor18)

## License

This project is licensed under the ISC License.
