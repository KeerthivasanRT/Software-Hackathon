# 🚀 Production Deployment Guide

## BIT Smart Transport Management Portal

This document outlines the step-by-step production deployment process for the **Bannari Amman Institute of Technology (BIT) Smart Transport Management Portal**.

---

## 🏗️ Architecture Summary

- **Frontend**: Next.js (TypeScript, Tailwind CSS, Leaflet) ➔ Deployed on **Vercel**
- **Backend**: Node.js & Express.js (REST API, JWT, Helmet, Morgan) ➔ Deployed on **Render / Railway**
- **Database**: MongoDB Atlas (`bit_transport` Cluster)

---

## 🍃 Step 1: MongoDB Atlas Network Access Configuration

1. Log in to [MongoDB Atlas Console](https://cloud.mongodb.com).
2. Navigate to **Network Access** under the **Security** tab.
3. Click **Add IP Address**.
4. Select **Allow Access from Anywhere** (`0.0.0.0/0`) so Vercel and Render serverless instances can connect.
5. Copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.pmpqqee.mongodb.net/bit_transport?retryWrites=true&w=majority
   ```

---

## ⚙️ Step 2: Backend Deployment on Render

1. Push your codebase to a **GitHub repository**.
2. Go to [Render Dashboard](https://dashboard.render.com) and click **New +** ➔ **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `PORT` = `5000`
   - `MONGO_URI` = `mongodb+srv://keerthivasan:QLuG7sH33gCU7nb@cluster0.pmpqqee.mongodb.net/bit_transport?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET` = `BIT_TRANSPORT_2026`
   - `CLIENT_URL` = `https://your-frontend.vercel.app`
6. Click **Deploy Web Service** and copy your backend URL (e.g. `https://bit-transport-backend.onrender.com`).

---

## 🌐 Step 3: Frontend Deployment on Vercel

1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** ➔ **Project** and import your GitHub repository.
3. Keep the default framework preset: **Next.js**.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = `https://bit-transport-backend.onrender.com` (Your Render URL)
5. Click **Deploy**. Vercel will build and deploy your Next.js application.

---

## 🔄 Step 4: Final Production CORS Handshake

Once both services are live:
1. Go back to Render Dashboard ➔ Environment Variables.
2. Update `CLIENT_URL` to your production Vercel domain (e.g., `https://bit-transport-frontend.vercel.app`).
3. Trigger a redeploy on Render.

---

## 🧪 Local Production Build Testing

To test production build locally before pushing:

### Frontend Test
```bash
npm run build
npm start
```

### Backend Test
```bash
cd backend
npm install
npm start
```
