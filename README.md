# SkillBridge

Repository: https://github.com/nikhilpawdepict-eng/SkillBridge

This document explains how to clone, configure, run, test, and validate SkillBridge on a new computer.

## Gemini AI Setup

The AI Assistant uses Gemini through the Express backend. The Gemini API key is never exposed to the React frontend.

Copy `.env.example` to `.env` if needed, then configure:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/skillbridge
AUTH_SECRET=your-long-random-secret
GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_MODEL=gemini-3.6-flash
```

Create a Gemini key from [Google AI Studio](https://aistudio.google.com/app/apikey). Keep `.env` private and never add the key to React code, a `VITE_` variable, or source control.

# 🎓 SkillBridge — Modern Campus Collaboration & Learning Platform

SkillBridge is an all-in-one engineering college ecosystem connecting freshers, senior mentors, faculty admins, and campus clubs. It integrates academic study materials, industry skill tracks, peer doubt solving, campus club registrations, AI-assisted mentoring, and placement & scholarship roadmaps.

---

## 🌟 Key Highlights

- ☀️ **Light & Medium Formats**: Crisp, high-contrast Light mode and soft, eye-comfort Medium Slate mode with a one-click theme switcher in the top navigation bar.
- 🍃 **MongoDB Compass Ready**: Live data is stored and managed via Mongoose in local MongoDB (`mongodb://127.0.0.1:27017/skillbridge`).
- 📁 **Clean & Modular Backend Architecture**: Separated config, Mongoose models, and Express route handlers (`server/config`, `server/models`, `server/routes`, `server/seed`).
- 🛡️ **Role-Based Access**: Student, Senior Mentor, Club Lead, and Faculty Admin roles with quick demo switching.
- ⚡ **Zero Errors**: Fully type-safe TypeScript codebase, passes `npm run build` and `npm run lint` cleanly.

---

## Complete Local Setup

### 1. Prerequisites

- **Node.js**: v18 or higher; v20+ recommended
- **npm**: included with Node.js
- **MongoDB Community Server**: running at `mongodb://127.0.0.1:27017`
- **Google Gemini API key**: required for the AI Assistant
- **MongoDB Compass**: optional, for viewing database records

Check your installed tools:

```bash
node --version
npm --version
```

### 2. Clone the Repository

```bash
git clone https://github.com/nikhilpawdepict-eng/SkillBridge.git
cd SkillBridge
```

If you downloaded a ZIP file, extract it and open a terminal inside the extracted `SkillBridge` folder.

### 3. Install Dependencies

```powershell
npm install
```

### 4. Create `.env`

The real `.env` is not stored in GitHub because it contains secrets. Create it from the safe template.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Set the values in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/skillbridge
AUTH_SECRET=replace-with-a-long-random-secret
GEMINI_API_KEY=replace-with-your-google-gemini-api-key
GEMINI_MODEL=gemini-3.6-flash
```

Create a Gemini key at [Google AI Studio](https://aistudio.google.com/app/apikey). Never commit `.env`, publish it, or put the key in a `VITE_` variable.

### 5. Start MongoDB

Start MongoDB Community Server and confirm it is available at:

```text
mongodb://127.0.0.1:27017
```

MongoDB Compass is optional. SkillBridge creates or seeds the `skillbridge` database when the backend starts.

### 6. Verify Gemini Configuration

Run this before starting the application:

```bash
npm run test:gemini
```

Expected output:

```text
Gemini smoke test passed.
```

### 7. Start the Backend API Server

In terminal 1:

```bash
npm run server
```

> **Output:**
>
> ```
> 🌿 MongoDB Connected successfully: 127.0.0.1/skillbridge
> 📊 View data anytime in MongoDB Compass at: mongodb://127.0.0.1:27017/skillbridge
> ✨ MongoDB collections ready & verified!
> 🚀 SkillBridge Backend Server is LIVE on port 5000 (http://localhost:5000)
> ```

The backend runs at `http://localhost:5000`.

### 8. Start the Frontend Development Server

In terminal 2:

```bash
npm run dev
```

> Open your browser at: **`http://localhost:5173`**

The frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend on port `5000`.

### 9. Test the Application

Open the AI Chatbot page and try:

```text
hi
3+5
Explain binary search
What is SkillBridge?
```

You can also check the backend health endpoint:

```text
http://localhost:5000/api/health
```

### 10. Validate the Project

```bash
npm run build
npm run lint
```

Keep the backend and frontend terminals running while using the application.

### Daily Run Order

After the initial setup, use two terminals from the project directory.

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Troubleshooting

### Gemini configuration error

Run:

```bash
npm run test:gemini
```

If it fails, verify that `.env` is beside `package.json`, contains a real `GEMINI_API_KEY`, uses `GEMINI_MODEL=gemini-3.6-flash`, and that the backend was restarted after changing `.env`.

### MongoDB connection error

Start MongoDB and verify that it is available at:

```text
mongodb://127.0.0.1:27017
```

### Port already in use

The default ports are:

- Backend: `5000`
- Frontend: `5173`

Stop the process using the port, or update `PORT` and the Vite proxy configuration together.

### Frontend API errors

Both terminals must be running. The frontend on port `5173` needs the backend on port `5000` for authentication, database-backed features, and Gemini chat.

### Clean reinstall

If dependencies are corrupted, stop the servers and run:

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

macOS/Linux:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🧭 How to View & Manage Data in MongoDB Compass

1. Open **MongoDB Compass**.
2. Paste the connection string:
   ```text
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. In the database sidebar, select the **`skillbridge`** database.
5. You will see all structured collections:
   - `academicmaterials` — Notes, PYQs, syllabus, Drive links
   - `skillresources` — Industry skill roadmaps (Web Dev, AI/ML, Cloud, Cyber)
   - `clubs` — Campus clubs, leads, and upcoming hackathons/events
   - `clubregistrations` — Student membership applications
   - `doubts` — Student questions, senior replies, upvotes & verification status
   - `placements` — Dream tier company guides, CTC packages, interview tips
   - `scholarships` — Merit, need-based, and women-in-STEM scholarships
   - `users` — Student, mentor, and admin profile data

Any action you perform in the web app (e.g. asking a doubt, uploading notes, applying to a club) immediately creates or updates documents in your MongoDB collections.

---

## 🎨 Theme Formats (Light & Medium)

Switch themes anytime using the pill toggle in the top-right corner of the Navbar:

- **☀️ Light**: Crisp Slate 50 backdrop, pure white glass cards, high-contrast dark slate typography, and vibrant Indigo/Cyan gradients.
- **⛅ Medium**: Soft Slate 100/200 contrast mode designed for prolonged reading and study without eye strain.
- **🌙 Dark**: Night mode for low-light environments.

---

## 📂 Project Architecture

```
SkillBridge/
├── server/                      # Modular Backend
│   ├── config/
│   │   └── db.ts                # MongoDB & Mongoose connection
│   ├── models/                  # Mongoose Schemas & Models
│   │   ├── AcademicMaterial.ts
│   │   ├── Club.ts
│   │   ├── ClubRegistration.ts
│   │   ├── Doubt.ts
│   │   ├── Placement.ts
│   │   ├── Scholarship.ts
│   │   ├── SkillResource.ts
│   │   └── User.ts
│   ├── routes/                  # Express API Route Handlers
│   │   ├── academicRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── clubRoutes.ts
│   │   ├── doubtRoutes.ts
│   │   ├── placementRoutes.ts
│   │   ├── scholarshipRoutes.ts
│   │   └── skillRoutes.ts
│   ├── seed/
│   │   └── seedData.ts          # Automatic MongoDB seeder on startup
│   └── index.ts                 # Express entry point
│
├── src/                         # Frontend Application (React + TypeScript)
│   ├── components/              # Navbar, Footer, Modal, Toast, HeroCanvas
│   ├── context/                 # AuthContext, DataContext (MongoDB synced)
│   ├── data/                    # Initial campus datasets
│   ├── pages/                   # Home, Branch, Clubs, Doubts, AI Chat, Placement, Scholarships
│   ├── services/                # api.ts (Fetch wrappers)
│   ├── types/                   # TypeScript interfaces
│   ├── App.tsx                  # Main app layout
│   └── index.css                # Light & Medium design tokens
│
├── .env                         # Environment variables (PORT, MONGODB_URI)
└── package.json
```

---

## 🛠️ Verification & Build Commands

- **Build Check**: `npm run build` (Ensures 0 TypeScript or Vite bundling errors)
- **Lint Check**: `npm run lint` (Checks with Oxlint)
- **Preview Production Build**: `npm run preview`
