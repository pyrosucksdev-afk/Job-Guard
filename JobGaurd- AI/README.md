# JobGuard AI 🛡️

> Stop Getting Scammed Before You Apply

AI-powered tool that detects fraudulent job postings and returns a Trust Score (0–100).

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

---

## Project Structure

```
src/
  components/
    Header.jsx          # App title + badge
    JobInput.jsx        # URL + description inputs, Analyze button
    ResultCard.jsx      # Trust Score, Risk Level, Red Flags
    History.jsx         # Previously analyzed jobs
    LoadingState.jsx    # Spinner + animated steps
  pages/
    Home.jsx            # Page layout, state management
  App.jsx
  main.jsx
  index.css             # Global styles (CSS variables, dark theme)
```

---

## API Integration

### Endpoint
```
POST http://localhost:5000/analyze-job
```

### Request Body
```json
{
  "job_url": "https://example.com/job/123",
  "job_text": "Full job description text..."
}
```

### Response
```json
{
  "trust_score": 72,
  "risk_level": "Medium",
  "flags": [
    "Generic greeting detected",
    "Suspicious email domain"
  ]
}
```

---

## Trust Score Color Rules

| Score     | Risk Level | Color  |
|-----------|-----------|--------|
| 85 – 100  | Low       | 🟢 Green |
| 50 – 84   | Medium    | 🟡 Yellow |
| 0 – 49    | High      | 🔴 Red  |

---

## Demo Mode

If your backend isn't running, the app automatically falls back to a **mock response** with randomized scores so you can preview the full UI experience. A yellow banner will indicate demo mode.

---

## Tech Stack

- **React 18** (Vite)
- **Axios** for API calls
- **Google Fonts** — Syne, DM Sans, JetBrains Mono
- Pure CSS (no Tailwind needed)
- Zero UI library dependencies
