# Relay

> **“No valuable resource should end unused.”**

Relay is a state-of-the-art, AI-powered peer-to-peer resource exchange platform. It enables local communities to barter and trade valuable, pre-owned resources—such as books, coupons, gift cards, tools, electronics, and reusable items—directly with neighbors. By combining intelligent matching, unified local handoffs, and real-time negotiation, Relay turns dormant items into active community value.

---

## 1. Problem Statement
Every household and individual accumulates resources that eventually go unused. Textbooks sit on shelves after a course finishes; high-quality tools are stored in garages for months between DIY projects; gift cards and coupons expire in drawers; and electronics become obsolete before they are ever recycled. At the same time, nearby neighbors are spending hard-earned money to buy these exact same items brand-new. 

Traditional peer-to-peer marketplaces focus heavily on direct sales, which introduces friction around pricing, transaction fees, payment gateways, and shipping logistics. There is a clear gap for a local, cashless swap platform that facilitates direct bartering and collaborative resource sharing.

---

## 2. The Solution
Relay solves the peer-to-peer sharing problem by establishing a cashless, bartering economy. Users display their available items, browse nearby requests, and negotiate local exchanges. The platform provides:

*   **Intelligent Discovery:** Local map overlays and smart category filters matching supply with demand.
*   **Unified Negotiations:** A single, canonical messaging workflow that ties together the target owner, request details, offered resource items, and trade statuses.
*   **Real-time Bartering:** Instant message exchanges with status confirmations and interactive trade cards.
*   **Local Handoffs:** Interactive map coordinates and scheduler tools ensuring safe, physical trades within neighborhood circles.
*   **AI-Enhanced Services:** Intelligent listing analysis that categorizes items, estimates values, and drafts copy automatically using Gemini.

---

## 3. Core Features

### 💻 User Experience & Dashboards
*   **Unified Dashboard:** Displays stats (completed swaps, active negotiations, bookmarks), recent notification alerts, and active nearby requests.
*   **Marketplace & Discovery:** High-fidelity listing grid featuring category sorting (Books, Coupons, Gift Cards, Tools, Electronics, Reusable Resources, Stationery, etc.) and an interactive Map View.
*   **Trade Details:** Full resource overview, dynamic AI-calculated value comparisons, and a visual interface to select barter offers from your own inventory.
*   **Unified Messages Page:** Single, canonical messaging hub with list filtering (All, Ongoing, Completed, Declined) and a responsive detail panel.
*   **Trade Timeline & Statuses:** Visual timeline showing the state of exchange negotiations (Pending, Offer Sent, Accepted, Meeting Scheduled, Handed Off, Completed).
*   **Interactive Handoff Map & Scheduler:** Displays localized meetup points (using Google Maps / MapLibre) and scheduled handoff times directly within the chat timeline.
*   **Public Trader Profiles:** Showcases public trade stats, success rates, average response times, community ratings, and historical barter feedback.
*   **Achievements & Trust Score:** Dynamic reward badges ("Verified Trader", "Fast Responder", etc.) and trust metrics displayed on profiles.

### ⚙️ Backend & Services Integration
*   **Google Gemini AI integration:** Automates listing analysis, draft generation, and simulates helpful responses from offline users in Demo mode.
*   **Google Maps Key API endpoint:** Supplies secure API keys dynamically to render frontend mapping components safely.
*   **Cloudinary Integration:** Automatically uploads, optimizes, and serves images securely.
*   **Socket.IO Presence & Live Messaging:** Tracks online users, emits typing indicators, and broadcasts new messages, session status updates, and trade offers in real-time.
*   **Authentication & Session Management:** Secured with JSON Web Tokens (JWT) and bcrypt password hashing.

---

## 4. Application Workflow

```
[ Discover Resource ]
         ↓
   [ View Trade ]
         ↓
[ Choose Offered Items ]
         ↓
[ Start Negotiation / Send Offer ]
         ↓
[ Real-time Chat & Refine Deal ]
         ↓
  [ Accept Trade ]
         ↓
 [ Schedule Handoff ]
         ↓
[ Meet & Complete Relay ]
         ↓
 [ Leave Review & Feedback ]
```

1.  **Discover Resource:** Browse the visual Marketplace or interact with markers on the local neighborhood map.
2.  **View Trade:** Inspect description, condition, value, and owner trust stats.
3.  **Start Negotiation / Send Offer:** Select one or more of your own assets to offer and draft an initial trade request.
4.  **Real-time Chat & Refine Deal:** Discuss terms via live chat, adjust offered items, and finalize coordinates.
5.  **Accept Trade:** Either party locks in the exchange, updating the session status.
6.  **Schedule Handoff:** Propose a local meeting spot and time, populated directly onto the mutual Handoff Map.
7.  **Meet & Complete Relay:** Swap items physically and click "Complete Trade" to release resources.
8.  **Leave Review:** Rate the barter partner and provide public trade feedback to update their Trust Score.

---

## 5. Technology Stack

### Frontend
*   **React (v19):** Declarative component-based user interface.
*   **Vite:** Instant server starts and lightning-fast builds.
*   **Framer Motion:** Premium glassmorphic transitions and hover-based micro-animations.
*   **React Router Dom (v7):** Handles SPA route management and priority URL parameter mapping.
*   **Tailwind CSS:** Premium styling utilities and adaptive layouts.

### Backend
*   **Node.js & Express.js:** Fast and scalable backend API routing architecture.
*   **MongoDB Atlas & Mongoose:** Persistent document storage, compound index lookups, and transaction tracking.
*   **Socket.IO (v4):** Event-driven websocket network layer for real-time syncing.
*   **jsonwebtoken & bcryptjs:** JWT payload authentication and secure password hashing.

### External Services
*   **Google Gemini API:** AI-assisted listing generation and mock-bot replies.
*   **Google Maps API:** MapLibre/Google location rendering.
*   **Cloudinary:** Image hosting and performance optimizations.
*   **Resend:** Digital email transaction alerts (configured for transactional notifications).

---

## 6. System Architecture

```
                       +----------------------------------+
                       |          React Frontend          |
                       |       (Vite / Tailwind / WSS)    |
                       +----------------+-----------------+
                                        |
                            HTTP REST   |   WebSocket
                             & JSON     |  (Socket.IO)
                                        v
                       +----------------+-----------------+
                       |         Express Backend          |
                       |      (Node.js / Mongoose)        |
                       +-------+--------+--------+--------+
                               |        |        |
         +---------------------+        |        +---------------------+
         |                              |                              |
         v                              v                              v
+--------+--------+            +--------+--------+            +--------+--------+
|  MongoDB Atlas  |            | Google Gemini   |            | Cloudinary      |
|  (Data Store)   |            | (AI Analytics)  |            | (Image CDN)     |
+-----------------+            +-----------------+            +-----------------+
```

---

## 7. Project Folder Structure

```
Relay/
├── server/                     # Backend Source Code
│   ├── config/                 # DB Connections & Env Configuration
│   ├── controllers/            # API Route Handlers
│   ├── middleware/             # Route Protection & JWT Validation
│   ├── models/                 # Mongoose Database Schemas
│   ├── routes/                 # Express Router Mappings
│   ├── services/               # Gemini AI & Cloudinary Integrations
│   ├── socket/                 # Socket.IO Event Handlers
│   ├── uploads/                # Temporary Upload Target
│   ├── utils/                  # Seeder scripts and helpers
│   └── index.js                # Server entry point
├── src/                        # Frontend React Application
│   ├── components/             # Reusable UI, Map & Trade Components
│   │   ├── map/                # Map components & custom markers
│   │   ├── trade/              # Trade timeline, statuses & row items
│   │   └── ui/                 # Glassmorphic cards & layout blocks
│   ├── context/                # RelayContext and global state manager
│   ├── data/                   # Category constants & Demo Seed data
│   ├── demo/                   # Demo-specific views
│   ├── lib/                    # API client wrapper & auth service
│   ├── pages/                  # SPA Page Views (Dashboard, Messages, etc.)
│   ├── routes/                 # Path definitions & routers
│   ├── utils/                  # String helpers & motion profiles
│   ├── App.css                 # Base overrides
│   ├── App.jsx                 # Routes controller
│   ├── index.css               # Core Tailwind directives
│   └── main.jsx                # React Entrypoint
├── public/                     # Static Public Assets
├── package.json                # Project Dependencies & Build Scripts
└── vite.config.js              # Vite Bundler Settings
```

---

## 8. Installation and Local Setup

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB Atlas account or running local MongoDB server instance
*   Cloudinary Account (optional, falls back to mock storage if empty)
*   Google Gemini API Key (optional, required for AI listing description helper)

### Setup Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/relay.git
    cd relay
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Copy the sample environment file:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and fill in your local MongoDB connection string and API keys (details in the [Environment Variables](#environment-variables) section below).

4.  **Run in Development Mode:**
    *   **Start the Backend Server (Port 4000):**
        ```bash
        npm run dev:server
        ```
    *   **Start the Frontend Dev Server (Port 5173):**
        ```bash
        npm run dev
        ```

5.  **Open the App:**
    Navigate to `http://localhost:5173/` in your browser.

---

## 9. Environment Variables
To run this project, configure the following variables in your `.env` file:

```env
# Server Port & Mode
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database & Token Authentication
MONGODB_URI=mongodb://127.0.0.1:27017/relay
JWT_SECRET=your_jwt_signing_secret_here

# External Third Party APIs
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Image Storage API
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Alerts Service
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com

# Frontend Endpoint (API Gateway Client)
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## 10. Available Scripts
The following scripts are defined in `package.json` and are available for managing development:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **`npm run dev`** | `vite` | Starts Vite local frontend server (`http://localhost:5173`) with HMR |
| **`npm run dev:server`** | `node server/index.js` | Starts MERN Express backend API server (`http://localhost:4000`) |
| **`npm run build`** | `vite build` | Compiles the React SPA production build inside `/dist` |
| **`npm run lint`** | `eslint src` | Audits the codebase for syntax, style, and code quality violations |
| **`npm run preview`** | `vite preview` | Previews the compiled production build locally |

---

## 11. API Architecture
The backend routes are grouped logically under `/api` prefixes:

| Path Group | Router File | Authentication | Key Endpoint Examples |
| :--- | :--- | :--- | :--- |
| `/api/auth` | `authRoutes.js` | None | `POST /register`, `POST /login`, `POST /refresh` |
| `/api/listings` | `listingRoutes.js` | Mixed | `GET /`, `POST /` (Protected), `POST /analyze` (AI) |
| `/api/profiles` | `profileRoutes.js` | Mixed | `GET /:userId/public`, `POST /feedback` (Protected) |
| `/api/bookmarks` | `bookmarkRoutes.js` | Protected | `GET /:userId`, `POST /:userId`, `DELETE /:userId/:listingId` |
| `/api/notifications` | `notificationRoutes.js` | Protected | `GET /:userId`, `PATCH /mark-all-read` |
| `/api/exchanges` | `exchangeRoutes.js` | Protected | `POST /`, `PATCH /:sessionId/status`, `GET /:sessionId/messages` |
| `/api/auctions` | `auctionRoutes.js` | Mixed | `GET /`, `POST /:auctionId/bid` (Protected) |

---

## 12. Database Models
The MongoDB database uses the following Mongoose schemas defined in `server/models/`:

*   **User:** Stores secure credential hashes, auth provider types (email/google), seed status metadata, and active refresh tokens.
*   **Profile:** Stores user biography, location, coordinate values, success stats, response metrics, and trade achievements.
*   **Listing:** Holds active barter item information: categories, conditions, values, image URLs, and nested trader profile metadata.
*   **ExchangeSession:** Handles trade state between an initiator and a receiver. Persists `sourceType`, `sourceId`, `sourceTitle`, `lookingFor`, selected items, and statuses.
*   **Message:** Stores text and metadata for conversation histories, associated to specific `sessionId` rooms.
*   **Auction:** Tracks time-bound bidding events, opening prices, current bids, and bid histories.
*   **Notification:** Stores community actions (e.g. new trade offers, messages, auction status updates).
*   **Bookmark:** Mappings between user IDs and bookmarked listing IDs.
*   **Category:** Standardized category mappings for clean item filtering.
*   **Achievement:** Defined badges that can be earned by users (e.g. "Verified Trader", "Fast Responder").
*   **Resource:** Tracks custom assets or items registered under a user's inventory.

---

## 13. Realtime Architecture
Relay leverages **Socket.IO** for low-latency live operations:

*   **Online Presence Tracking:** Upon socket connection, users emit `join-user` with their database user ID. The server tracks online user states and broadcasts `user_online` dynamically to display live indicator icons on profiles and conversation lists.
*   **Dedicated Chat Rooms:** Clients join unique rooms named `session:<sessionId>`. Messages sent to `/api/exchanges/:sessionId/messages` are saved to MongoDB and broadcasted only to users connected to that room.
*   **Typing Notifications:** Live typing indicators (`typing_start` / `typing_stop`) are pushed instantly to the counter-party when they focus and edit the message input.
*   **Event Deduplication:** Client-side optimistic messages are generated with client IDs. The Socket.IO message emitter matches message payloads against optimistic IDs, preventing double-message duplication.

---

## 14. Application Security
The platform employs several industry-standard practices to ensure secure operations:

*   **Token-Based Authentication:** Employs stateless access and refresh tokens. API requests are protected using JWT validation in the auth middleware.
*   **Password Hashing:** Uses `bcryptjs` to encrypt raw passwords before committing them to the MongoDB cluster.
*   **Cross-Origin Isolation:** Strict CORS middleware configuration isolates APIs to the specific frontend client URL.
*   **Protected Mongoose IDs:** Backend controllers check `mongoose.Types.ObjectId.isValid` on any user-provided IDs to prevent injection queries or database crash faults.

---

## 15. Screens and User Experience

*   **Landing Page:** Minimalist, glassmorphic overview showcasing the tagline, features, and quick entry into authenticated modes.
*   **Authentication (Sign In / Register / Reset):** Unified, responsive views for managing logins.
*   **Dashboard:** Shows personal activity charts, dynamic notifications, and a feed of local neighborhood requests.
*   **Marketplace:** Provides grid cards with filter selectors, a list search engine, and an interactive spatial Map View.
*   **Trade Details Page:** Features listing descriptions, barter items matching panels, and AI estimation widgets.
*   **Messages:** Desktop-grade chat dashboard with a side panel directory, visual trade chips, quick-action step triggers, and scheduled meetup maps.
*   **Requests Console:** Organizes trade processes into tab lists (Incoming, Outgoing, Ongoing, Completed, Declined) to track barter lifecycles.
*   **Auctions Lobby:** Displays active auctions and timer countdown cards.
*   **Notifications Bell:** Unified drawer listing recent alerts.
*   **Public Trader Profile:** Provides deep-dives into feedback records and trust indicators.
*   **Start Relay Setup:** Wizard for creating listings. Includes Gemini-assisted draft analysis.

---

## 16. Future Improvements
*   **Advanced Resource Valuation Matcher:** Machine learning models that automatically score resource barter matches based on supply demand indices.
*   **Offline Transaction Push Alerts:** Real-time SMS and email updates to notify users when a match is proposed nearby.
*   **Localized Smart Locker Integration:** Integrations with community hubs and physical locker systems to enable drop-offs and pick-ups.
*   **Multi-Region Federated Directories:** Scale database schemas to safely support geographical shards beyond the launching region.

---

## 17. Team
*   **Team Name:** [Your Team Name]
*   **Team Members:** [Member Name 1, Member Name 2]
*   **Institution:** [Your Institution]

---

## 18. License
Licensing terms should be appended here by the project owner. Unless otherwise specified, the codebase remains proprietary.
