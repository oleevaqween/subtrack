# SubTrack — Subscription Tracker

A modern, beautiful web app to track and monitor your subscriptions. Supports multiple currencies (NGN & USD), smart renewal reminders, and consolidated spending projections.

![Light & Dark Mode](https://img.shields.io/badge/theme-light%20%26%20dark-blueviolet)

## Features

- **Track subscriptions** with name, amount, currency, billing cycle, category, and next billing date
- **Dual currency** — add subscriptions in Naira (₦) or Dollars ($)
- **Exchange rate converter** — set your own USD→NGN rate for consolidated projections
- **Smart reminders** — cards glow amber/red as renewal dates approach (configurable per subscription)
- **Dashboard stats** — monthly spend, remaining year projection, full-year total, upcoming renewals
- **Light & Dark mode** — floating toggle, respects system preference
- **Animated active cards** — subtle orbiting light on running subscriptions
- **Quick-add** popular services (Netflix, Spotify, Showmax, MTN Data, etc.)
- **Pause/Resume** subscriptions without deleting
- **Persistent storage** — all data saved in your browser's localStorage

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/subscription-tracker.git
cd subscription-tracker

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will open at `http://localhost:5173` (or the next available port).

## Build for Production

```bash
npm run build
```

The optimized output goes to the `dist/` folder. You can serve it with any static file server:

```bash
npm run preview
```

## Tech Stack

- **React 19** — UI framework
- **Vite** — build tool & dev server
- **Tailwind CSS v4** — utility-first styling
- **date-fns** — date calculations
- **lucide-react** — icons
- **localStorage** — client-side persistence (no backend needed)

## Project Structure

```
subscription-tracker/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── index.css          # Tailwind + theme variables + glow animations
    ├── App.jsx            # Root state & logic
    └── components/
        ├── Header.jsx
        ├── Dashboard.jsx
        ├── SubscriptionList.jsx
        ├── AddSubscription.jsx
        └── ThemeToggle.jsx
```

## License

MIT
