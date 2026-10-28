# TerraVenture - AI Trip Planner & Smart Itinerary

A modern travel intelligence platform based on the **Google Stitch** TerraVenture trip planner module designs (`/Users/krishnashukla/Desktop/stitch_terraventure_trip_planner_module`).

## 🌟 1:1 Pixel-Exact Stitch Screens

The application reproduces the exact layout, typography, SVG paths, interactive widgets, and classes from the Stitch exports:

1. **`TripPlannerView.jsx`** &larr; `terraventure_ai_trip_planner_desktop/code.html`
   - Split 12-column layout (7 cols planner form engine + 5 cols live preview dossier canvas)
   - Dynamic budget slider with `handleBudgetChange` logic & dynamic tier badges
   - Interactive explorer stepper (`incrementGuests`, `decrementGuests`)
   - Destination selector with instant trending city tags
   - Travel vibes & pacing selectors
   - "Synthesize Expedition Itinerary" CTA

2. **`GeneratingItineraryView.jsx`** &larr; `terraventure_ai_generating_itinerary_desktop/code.html`
   - Ambient topographical header panel with warm flare blobs
   - Milestone stepper (Curated, Routing, Hours, Pacing)
   - Live simulated ticker (`ticker-text`) cycling through real synthesis checkpoints
   - Gradient progress rail (`progress-bar-fill`) and percentage counter (`percent-display`)
   - 5 active engine pipelines execution checklist
   - Spatial nodes and daylight forecast radar

3. **`SmartItineraryView.jsx`** &larr; `terraventure_smart_itinerary_view_desktop/code.html`
   - Command header & meta strip (4 Days, 2 Explorers, Comfortable Boutique)
   - Live Budget Tracker (₹14,200 of ₹18,500, 76% utilized, ₹4,300 safety buffer)
   - Day selector pill tabs (Day 1: Old City & Lake Pichola, Day 2: Lakes & Forts, etc.)
   - Route Auto-Optimized Notice banner
   - Timeline stream with rich cards, badges, AI insider advice, and action buttons
   - Companion panels with daylight forecast, aarti timings, and cultural etiquette

4. **`RouteMapBudgetView.jsx`** &larr; `terraventure_route_map_budget_breakdown_desktop/code.html`
   - Top summary & control deck with elevation gain (142m) and walking pace metrics
   - Interactive SVG map canvas with custom gradient glow trajectory paths and floating numbered pins
   - Stop-by-step route inspector
   - Categorized ledger breakdown (42% stays, 22% food, 18% activities, 10% transit, 8% buffer)

5. **`Navbar.jsx` & `Footer.jsx`**
   - Exact Stitch navigation bar (`terrain` logo icon, nav items, search bar, notifications with badge, avatar)
   - Exact 4-column compliance & platform footer

---

## 🏗️ Architecture

```text
ITM_Hackathon/
├── frontend/                 # React.js (JavaScript JSX) + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                  # Exact Stitch Header
│   │   │   ├── TripPlannerView.jsx         # Exact Stitch Planner Screen
│   │   │   ├── GeneratingItineraryView.jsx # Exact Stitch Generating Screen
│   │   │   ├── SmartItineraryView.jsx      # Exact Stitch Itinerary Screen
│   │   │   ├── RouteMapBudgetView.jsx      # Exact Stitch Route & Budget Screen
│   │   │   └── Footer.jsx                  # Exact Stitch Footer
│   │   ├── services/         # api.js
│   │   ├── App.jsx           # Main switcher & router
│   │   ├── index.css         # Stitch base layers & scrollbar reset
│   │   └── main.jsx
│   ├── index.html            # Exact Google Fonts, Material Symbols & Tailwind Config
│   └── tailwind.config.js    # Exact theme extensions
│
├── backend/                  # Python 3 + FastAPI + Uvicorn
│   ├── app/
│   │   ├── api/routes.py     # /api/health, /api/predict, /api/itinerary/generate
│   │   ├── core/config.py
│   │   ├── models/schemas.py
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── run.py
│
├── ml_model/                 # ML Pipeline
│   ├── src/                  # preprocess.py, train.py, predict.py
│   └── models/               # sample_model.json
│
└── start_dev.sh
```

---

## 🚀 Quick Start

### 1. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Run Backend
```bash
cd backend
python3 run.py
```
Open Swagger Docs at **[http://localhost:8000/docs](http://localhost:8000/docs)**.
