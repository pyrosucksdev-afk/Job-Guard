# JobGuard AI – Backend (Powered by Google Gemini - FREE)

## Final Folder Structure

```
Desktop/
└── JobGuard/
    ├── JobGuardAI/              ← your frontend
    └── jobguard-backend/        ← this backend
        ├── server.js
        ├── package.json
        ├── .env
        └── README.md
```

---

## Step 1 – Get your FREE Gemini API Key (No credit card!)

1. Go to https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

---

## Step 2 – Add your API Key to .env

Open the .env file and replace your_api_key_here:

GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX

---

## Step 3 – Install and Run the backend

Open terminal inside jobguard-backend folder and run:

npm install
node server.js

You should see:
  JobGuard AI Backend
  Running at http://localhost:5000
  Gemini API Key: Loaded

---

## Step 4 – Replace ResultCard in your frontend

Copy the ResultCard.jsx file into:
  JobGuardAI/src/components/ResultCard.jsx
(Replace the old one)

---

## Step 5 – Run both at the same time

Open TWO terminal windows:

Terminal 1 (Backend):
  cd Desktop/JobGuard/jobguard-backend
  node server.js

Terminal 2 (Frontend):
  cd Desktop/JobGuard/JobGuardAI
  npm run dev

Then open http://localhost:5173 and paste any job URL!

---

## What Gemini detects

- Company name, job title, location, salary
- Red flags (fake emails, upfront fees, unrealistic pay)
- Positive signals (known brand, clear requirements)
- Trust Score 0 to 100
- Risk Level: Low / Medium / High
- Recommendation: Apply Safely / Apply with Caution / Avoid
- Full AI summary of the posting

---

## Free Tier Limits (Gemini 1.5 Flash)

- 15 requests per minute
- 1 million tokens per day
- Completely FREE, no credit card needed
