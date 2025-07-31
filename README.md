# 🛡️ Women Safety Monitoring Dashboard

A **real-time women safety monitoring dashboard** built with **React**, **React-Leaflet**, and **TailwindCSS**, designed to visualize, track, and manage safety-related incidents detected via AI-based CCTV analysis.

---

## 📌 Features

- **📍 Interactive Map with Numbered Markers**  
  Displays all active alerts with custom numbered icons for easy identification.

- **📊 Real-time Alerts Table**  
  Alerts are automatically refreshed every **2 seconds** to simulate real-time updates from a backend.

- **🎯 Fly-to Feature**  
  Clicking a table row or marker zooms directly to the incident location on the map.

- **📈 Severity Levels & Color Coding**  
  Alerts are categorized into:
  - 🔴 **Critical** (>80%)
  - 🟠 **High** (61–80%)
  - 🟡 **Medium** (41–60%)
  - 🟢 **Low** (≤40%)

- **👮 Official Mode**  
  - Officials can **dismiss** alerts or **alert authorities** directly from the UI.
  - A secure **login modal** (dummy logic in this version) unlocks extra functionalities.

- **📜 Slide-up Detailed Alert Panel**  
  Click an alert to view:
  - Location
  - Time
  - Severity level
  - Detailed description
  - Official action buttons

- **📱 Responsive UI**  
  Built with **TailwindCSS** for a clean, mobile-friendly design.

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [TailwindCSS](https://tailwindcss.com/)  
- **Maps:** [React-Leaflet](https://react-leaflet.js.org/), [Leaflet](https://leafletjs.com/)  
- **Icons:** [Lucide React](https://lucide.dev/)  
- **State Management:** React Hooks (`useState`, `useEffect`)  

---

## 📂 Project Structure

```
src/
│
├── components/
│   ├── LoginPage.tsx        # Login modal for official access
│   ├── HamburgerMenu.tsx    # Sidebar menu
│
├── SafetyDashboard.tsx      # Main dashboard component
│
└── index.tsx                # App entry point
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/women-safety-dashboard.git
cd women-safety-dashboard
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run the development server
```bash
npm run dev
```

### 4️⃣ Open in your browser
Navigate to:
```
http://localhost:5173/
```
*(Port may vary depending on your setup.)*

---

## ⚙️ Configuration

Currently, the dashboard uses **dummy alert data** from `fetchAlerts()` in `SafetyDashboard.tsx` for simulation.  
To connect to a **real backend**:
1. Replace the `fetchAlerts()` function with an API call.
2. Ensure the backend returns alert objects in the following format:

```ts
interface Alert {
  id: number;
  lat: number;
  lng: number;
  type: string;
  severity: number; // 0-100
  time: string;
  description: string;
  location: string;
}
```

---

## 📸 Screenshots

| Map View | Table View |
|----------|------------|
| ![Map View](docs/map-view.png) | ![Table View](docs/table-view.png) |

---

## 🔒 Official Mode Actions

When logged in as an **official**:
- **🚨 Alert Authorities:** Notifies emergency services.
- **✓ Mark as Resolved:** Dismisses the alert from the dashboard.
- **🚑 Emergency Response:** Simulates dispatching an emergency team.

---

## 📅 Auto-refresh Behavior

The dashboard **refreshes alerts every 2 seconds** to simulate real-time data updates.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

## 🤝 Contributing

Pull requests are welcome!  
If you have suggestions for improvements, feel free to **open an issue** or **submit a PR**.

---
