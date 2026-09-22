# CivicPulse AI

> **"Turning Citizen Voices into Community Priorities"**  
> *Track 1 Challenge: AI for Digital Public Infrastructure & Governance*  
> *Objective: Aggregate citizen development requests and help identify high-priority civic and infrastructure needs.*

---

## 🏛️ Project Overview

**CivicPulse AI** is an open, accessible digital public infrastructure prototype that enables citizens to report local civic and infrastructure concerns (roads, water, waste, lighting, transit) and translates them into transparent, ranked community priorities for municipal administrators.

---

## 🚀 Phase 1 Working Prototype Features

In Phase 1, CivicPulse AI is built using pure, beginner-friendly web standards (**HTML5, simple direct CSS without variables, and Vanilla JavaScript**) with zero external dependencies, backend databases, or external AI APIs.

### 1. Citizen Request Form
Citizens can report community problems with all critical evaluation parameters:
- **Name (Optional):** Citizens may provide their name or submit anonymously.
- **Location / Area:** Dropdown of municipal administrative wards with an `"Other - Enter Manually"` option that reveals a manual location text input for custom neighborhoods (e.g. Gomti Nagar, Lucknow).
- **Issue Category:** Selection of core municipal services with an `"Other - Specify Issue"` option that reveals a text input for custom categories (e.g. Noise Pollution, Stray Dogs, Illegal Encroachment).
- **Description of the Problem:** Detailed explanation of the issue with real-time character count.
- **Number of People Affected:** Numeric input capturing community impact (e.g. 25, 150, 500 people).
- **Urgency / Severity:** Selection of severity level (*Critical*, *High*, *Medium*, *Low*).
- **Submit Request Button:** Validates all required inputs and triggers instant processing.

### 2. Transparent Rule-Based Priority Engine
Priority is **never assigned randomly** and complaints are **never hard-coded**. A deterministic JavaScript function calculates High, Medium, or Low priority based on objective criteria:
- **Severity Factor:** Critical (40 pts), High (30 pts), Medium (20 pts), Low (10 pts).
- **Population Impact Factor:** >200 citizens (35 pts), 51–200 citizens (25 pts), 11–50 citizens (15 pts), 1–10 citizens (5 pts).
- **Category Hazard Factor:** Essential drinking water / public safety (25 pts), Roads / Waste / Transit (15 pts), Parks / Recreation (5 pts).
- **Priority Thresholds:**
  - **High Priority:** Score &ge; 70 or Critical severity with &ge; 50 people affected.
  - **Medium Priority:** Score 40–69.
  - **Low Priority:** Score &lt; 40.
- **Transparent Rationale:** Every request generates a clear human-readable reason (e.g. *"High priority: Critical severity impacting 350 citizens in Water Supply & Sanitation"*).

### 3. Clear Separation: Demo Data vs. Citizen Submissions
- Baseline demonstration records are explicitly tagged with `isDemo: true` and labeled in the UI with a subtle **`[Demo Data]`** badge.
- When a citizen submits a new request, it is dynamically stored with `isDemo: false` and prominently highlighted with a vibrant blue **`[Citizen Submitted]`** badge.
- A source filter allows filtering by *All Requests*, *Citizen Submitted Only*, or *Demo Data Only*.

### 4. Government Dashboard & Basic Demand Hotspots
Decision-makers have access to real-time intelligence:
- **Total Citizen Requests:** Displays total volume with live vs demo breakdown.
- **High-Priority Requests:** Instant count of critical safety/health emergencies.
- **Most Reported Category:** Identifies the civic domain experiencing peak complaints.
- **Highest Request Area:** Identifies the geographical ward with top volume.
- **🔥 Basic Demand Hotspots Panel:** Lists the top cluster areas with request count, total people affected, top issue category, and urgency indicators (*Critical Need* / *Active Need*).
- **Severity Distribution Bar:** Proportional bar visualizing the percentage breakdown of High, Medium, and Low priorities.

### 5. Priority Issues Dashboard / Table
- Columns: Rank (#), Issue Title & Description, Location, Category, People Affected (👥), Priority Badge, Priority Reason, Source Badge, and Action.
- Interactive live search by keyword, area, category, or ID.
- Detailed modal dialog to inspect full request context, citizen name, and recommended municipal actions.

---

## 📁 Project Structure

```
civicpulseAI/
├── index.html           # Semantic HTML5 single-page application structure
├── css/
│   └── style.css        # Simple, direct CSS (no variables, clean readable colors)
├── js/
│   ├── data.js          # Pre-loaded baseline data (strictly tagged as isDemo: true)
│   └── app.js           # Priority calculation, dynamic storage, filters & dashboard
└── README.md            # Documentation, challenge alignment, and Phase 2 roadmap
```

---

## 💻 How to Run & Test the Complete Flow

1. Open `index.html` in your browser (simply double-click the file in File Explorer).
2. **Step 1:** Scroll to the **Citizen Request Form**.
3. **Step 2:** Fill in:
   - *Name:* "Anita Sharma" (or leave blank for Anonymous)
   - *Location:* Select "Ward 4 - North Sector"
   - *Category:* Select "Water Supply & Sanitation"
   - *People Affected:* Enter "350"
   - *Urgency / Severity:* Select "Critical - Immediate Danger / Health Risk"
   - *Description:* "Contaminated tap water with dark discoloration in Block 4"
4. **Step 3:** Click **"Submit Request"**.
5. **Step 4:** Observe the complete flow:
   - Instant toast notification appears with assigned ID (e.g., `#CP-REQ-7482`).
   - Priority is automatically calculated as **High** with reason: *"High priority: Critical severity impacting 350 citizens in Water Supply & Sanitation."*
   - Request immediately appears at the top of the **Priority Issues Table** with the **`[Citizen Submitted]`** badge.
   - The **Government Dashboard** updates live: Total Requests increments, Live Citizen counter increments, and the **Demand Hotspots** panel updates Ward 4's statistics in real time.
