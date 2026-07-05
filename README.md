# 🏡 Casa - The Modern Real Estate Platform

![Casa Banner](https://images.unsplash.com/photo-1560518884-ce5882228a96?auto=format&fit=crop&q=80&w=1200)

Welcome to **Casa**! A fully featured, full-stack Real Estate and Property Booking application built using the MERN stack (MongoDB, Express, React, Node.js) with integrated Payment Gateways and Google Gemini AI.

## ✨ Features

- **🔑 Role-Based Authentication:** Separate accounts for 'Owners' (to list properties) and 'Tenants' (to browse and book).
- **📸 Image Uploads:** Seamlessly upload and manage property thumbnails and gallery images using Multer.
- **💳 Payment Gateway:** Integrated Razorpay checkout for tenants to securely book properties.
- **🤖 Magic AI Descriptions:** Powered by Google Gemini AI (latest `gemini-flash-latest`), owners can auto-generate highly engaging property descriptions with a single click.
- **🔍 Advanced Search & Filters:** Filter properties by Location, Price constraints, and Amenities.
- **📱 Fully Responsive:** Beautiful UI designed to look stunning on both desktop and mobile devices.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, TailwindCSS (for modern styling), React Router, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (using Mongoose).
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`).
- **Payments:** Razorpay Node SDK & Frontend Checkout.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/AV-56/CASA.git
cd CASA
```

### 2. Setup Backend Server
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/casa
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=AIzaSy_your_gemini_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend Client
Open a new terminal window:
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## 🤖 Configuring AI Magic
To enable the "Auto-Generate with AI" feature on the Add Property page:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a new API Key.
3. Paste the generated key into your `server/.env` file under `GEMINI_API_KEY`.
4. Restart your backend server.

---
*Built with ❤️ for a seamless real estate experience.*
