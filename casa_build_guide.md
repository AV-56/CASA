# 🏠 Casa — AI-Integrated Accommodation Platform (Manual Build Guide)

Based on your resume, here's what Casa is:

> A full-stack MERN platform for **listing, searching, and booking PG accommodations** with an **AI-powered chatbot** for property recommendations, **JWT auth**, **role-based access**, and **real-time updates via Socket.io**.

---

## 📋 Credits & Overnight Build — Quick Answer

> **Yes, you'll have enough credits.** Building manually means YOU write the code — you'd only use me for occasional questions/debugging. That's very light usage. An overnight session of 6-8 hours with periodic questions will barely dent your credits. Go for it! 💪

---

## 🎬 What Are Those "Connected Components" in Backend Reels?

Those visuals people show in reels are one or more of these:

| What You See | What It Actually Is | Tool Used |
|---|---|---|
| Boxes connected with arrows (flow) | **System Architecture Diagram** — shows how frontend, backend, database, APIs connect | Excalidraw, draw.io, Eraser.io, FigJam |
| Colorful boxes with HTTP methods | **API Routes visualized in Postman** — collections showing GET/POST/PUT/DELETE | Postman (Collections view) |
| Tables connected with lines | **Database Schema / ERD** — shows MongoDB collections and their relationships | Moon Modeler, dbdiagram.io, MongoDB Compass |
| Terminal-like dark UI with nodes | **Docker containers / Microservices** — showing running services | Docker Desktop, Portainer |
| Flow with colored nodes | **Node-RED / n8n workflows** — visual automation flows | Node-RED, n8n |
| Tree-like component structure | **React Component Tree** — showing parent-child component hierarchy | React DevTools |

**Most commonly in MERN reels, it's either:**
1. **System Architecture Diagram** (made in Excalidraw/draw.io) — FREE
2. **Postman API Collections** — FREE
3. **Database ERD** on dbdiagram.io — FREE

> [!TIP]
> You should make all 3 for Casa. They look great in portfolio demos AND help you understand your own architecture before coding.

---

## 🗂️ Project Folder Structure (Create This First)

```
Casa/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ChatBot.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PropertyList.jsx
│   │   │   ├── PropertyDetail.jsx
│   │   │   ├── Dashboard.jsx        # Owner dashboard
│   │   │   ├── AdminPanel.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── utils/
│   │   │   └── api.js               # Axios instance
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── bookingController.js
│   │   └── chatController.js         # AI chatbot logic
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification
│   │   └── roleMiddleware.js         # Role-based access
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── chatRoutes.js
│   ├── socket/
│   │   └── socketHandler.js          # Socket.io events
│   ├── utils/
│   │   └── openai.js                 # OpenAI API helper
│   ├── .env
│   ├── server.js                     # Entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Step-by-Step Build Order

### Phase 1: Project Setup (~30 min)

#### Step 1 — Initialize Backend
```bash
mkdir Casa && cd Casa
mkdir server && cd server
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken socket.io openai multer
npm install -D nodemon
```

Add to `package.json` scripts:
```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

#### Step 2 — Initialize Frontend
```bash
cd .. 
npx create-vite@latest client -- --template react
cd client
npm install
npm install axios react-router-dom socket.io-client react-icons
npm install -D tailwindcss @tailwindcss/vite
```

Configure Tailwind (in `vite.config.js` and `index.css` — follow Tailwind v4 docs).

#### Step 3 — Setup MongoDB
- Go to [MongoDB Atlas](https://cloud.mongodb.com) → Create free cluster
- Get connection string
- Create `.env` in `/server`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/casa
JWT_SECRET=your_super_secret_key
OPENAI_API_KEY=sk-your-openai-key
```

---

### Phase 2: Backend Core (~2 hours)

#### Step 4 — Database Connection (`config/db.js`)
```js
const mongoose = require('mongoose');
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
module.exports = connectDB;
```

#### Step 5 — Define Models

**User.js** — Fields: `name`, `email`, `password` (hashed), `role` (tenant/owner/admin), `phone`, `avatar`

**Property.js** — Fields: `title`, `description`, `address`, `city`, `price`, `propertyType` (PG/Flat/Hostel), `amenities[]`, `images[]`, `owner` (ref: User), `availableFrom`, `isAvailable`, `coordinates`

**Booking.js** — Fields: `property` (ref), `tenant` (ref), `checkIn`, `checkOut`, `status` (pending/confirmed/rejected), `totalPrice`

#### Step 6 — Auth System
1. **Register**: Hash password with bcrypt → save user → return JWT
2. **Login**: Find user → compare password → return JWT
3. **Middleware**: Extract token from `Authorization: Bearer <token>` → verify → attach `req.user`
4. **Role Middleware**: Check `req.user.role` against allowed roles

#### Step 7 — Property CRUD
| Route | Method | Access | Description |
|---|---|---|---|
| `/api/properties` | GET | Public | List all (with filters) |
| `/api/properties/:id` | GET | Public | Get single property |
| `/api/properties` | POST | Owner | Create listing |
| `/api/properties/:id` | PUT | Owner | Update own listing |
| `/api/properties/:id` | DELETE | Owner/Admin | Delete listing |

#### Step 8 — Booking System
| Route | Method | Access | Description |
|---|---|---|---|
| `/api/bookings` | POST | Tenant | Create booking request |
| `/api/bookings/my` | GET | Tenant | My bookings |
| `/api/bookings/owner` | GET | Owner | Bookings on my properties |
| `/api/bookings/:id` | PUT | Owner | Accept/Reject booking |

#### Step 9 — Express Server Setup (`server.js`)
```js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Socket.io
require('./socket/socketHandler')(io);

// Start
connectDB().then(() => {
  server.listen(process.env.PORT, () => 
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
```

---

### Phase 3: AI Chatbot (~1.5 hours)

#### Step 10 — OpenAI Integration (`utils/openai.js`)
```js
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getPropertyRecommendation = async (userMessage, properties) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are Casa AI assistant. Help users find PG accommodations. 
        Available properties: ${JSON.stringify(properties.map(p => ({
          title: p.title, city: p.city, price: p.price, 
          type: p.propertyType, amenities: p.amenities
        })))}`
      },
      { role: 'user', content: userMessage }
    ],
  });
  return response.choices[0].message.content;
};

module.exports = { getPropertyRecommendation };
```

#### Step 11 — Chat Route (`routes/chatRoutes.js`)
- POST `/api/chat` → Takes `message` in body → Fetches available properties from DB → Sends to OpenAI with context → Returns AI response

---

### Phase 4: Real-Time with Socket.io (~45 min)

#### Step 12 — Socket Handler (`socket/socketHandler.js`)
```js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room based on userId
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    // Booking notifications
    socket.on('booking-update', (data) => {
      // Notify the property owner or tenant
      io.to(data.recipientId).emit('notification', {
        type: 'booking',
        message: data.message,
        bookingId: data.bookingId
      });
    });

    // New property listed (broadcast)
    socket.on('new-property', (property) => {
      socket.broadcast.emit('property-added', property);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
```

**Use cases for real-time:**
- 🔔 Booking request notification to owner
- ✅ Booking accepted/rejected notification to tenant
- 🏠 New property listed → update property list for all users

---

### Phase 5: Frontend (~3 hours)

#### Step 13 — Auth Context + Protected Routes
- Create `AuthContext` with login/register/logout functions
- Store JWT in localStorage
- `ProtectedRoute` component that checks auth + role

#### Step 14 — Pages (Build in this order)
1. **Login/Register** → Simple forms, connect to auth API
2. **Home** → Hero section + search bar + featured properties
3. **PropertyList** → Grid of `PropertyCard` components with filters (city, price range, type)
4. **PropertyDetail** → Full info, images, amenities, booking button
5. **Dashboard (Owner)** → Add/Edit/Delete listings, view booking requests
6. **Profile** → View/edit user info
7. **AdminPanel** (optional) → Manage all users & properties

#### Step 15 — Key Components
- **Navbar** → Logo, nav links, auth buttons, responsive hamburger
- **PropertyCard** → Image, title, price, location, rating
- **SearchBar** → City, price range, property type filters
- **ChatBot** → Floating button → opens chat modal → sends messages to `/api/chat`
- **BookingForm** → Date picker, total price calculator

#### Step 16 — API Utility (`utils/api.js`)
```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

#### Step 17 — Socket Hook (`hooks/useSocket.js`)
```js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const s = io('http://localhost:5000');
    setSocket(s);
    if (userId) s.emit('join', userId);
    
    s.on('notification', (data) => {
      setNotifications(prev => [...prev, data]);
    });

    return () => s.disconnect();
  }, [userId]);

  return { socket, notifications };
};

export default useSocket;
```

---

### Phase 6: Polish & Deploy (~1 hour)

#### Step 18 — Image Upload
- Use `multer` on backend for property images
- Store in `/uploads` folder or use Cloudinary (free tier)

#### Step 19 — Styling & Responsiveness
- Tailwind CSS for all components
- Mobile-first design
- Dark mode toggle (optional but impressive)

#### Step 20 — Testing with Postman
- Test all API endpoints
- Save as a Postman collection (this is what people show in reels!)

#### Step 21 — Deploy (Optional)
- **Backend**: Render.com (free)
- **Frontend**: Vercel (free)
- **Database**: MongoDB Atlas (free tier)

---

## ⏱️ Time Estimate Summary

| Phase | Time | Priority |
|---|---|---|
| Project Setup | 30 min | 🔴 Must |
| Backend Core (Auth + CRUD) | 2 hours | 🔴 Must |
| AI Chatbot | 1.5 hours | 🟡 High |
| Socket.io Real-time | 45 min | 🟡 High |
| Frontend Pages | 3 hours | 🔴 Must |
| Polish & Deploy | 1 hour | 🟢 Nice to have |
| **Total** | **~8 hours** | — |

---

## 🎯 Pro Tips for Tonight

1. **Build backend first, test with Postman** — Don't touch frontend until all APIs work
2. **Seed data** — Create a `seed.js` script to populate fake properties so you don't manually add them
3. **Git commit after each phase** — Shows commit history for interviews
4. **Take screenshots** — For portfolio/LinkedIn posts
5. **Draw the architecture diagram BEFORE coding** — Use [Excalidraw](https://excalidraw.com) (free, no signup)

> [!IMPORTANT]
> The OpenAI API key costs money (even GPT-3.5-turbo). Budget ~$1-2 for testing. Alternatively, you can mock the AI responses first and add real OpenAI later.

---

Good luck with the overnight build! 🚀 You can ask me questions anytime — you won't run out of credits for Q&A style interactions.
