# SubTrack — Subscription Tracker

A modern, beautiful web app to track and monitor your subscriptions. Supports multiple currencies (NGN & USD), smart renewal reminders, real-time sync across devices, and consolidated spending projections.

## Features

- **Track subscriptions** with name, amount, currency, billing cycle, category, and next billing date
- **Dual currency** — add subscriptions in Naira (₦) or Dollars ($)
- **Exchange rate converter** — set your own USD→NGN rate for consolidated projections
- **Smart reminders** — cards glow amber/red as renewal dates approach (configurable per subscription)
- **Dashboard stats** — monthly spend, remaining year projection, full-year total, upcoming renewals
- **Real-time sync** — use a passphrase to sync data across all your devices via Firebase
- **Light & Dark mode** — floating toggle, respects system preference
- **Animated active cards** — subtle orbiting light on running subscriptions
- **Quick-add** popular services (Netflix, Spotify, Showmax, MTN Data, etc.)
- **Pause/Resume** subscriptions without deleting
- **Persistent storage** — localStorage as fallback, Firebase for cross-device sync

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Firebase project (free tier, for cross-device sync)

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/subscription-tracker.git
cd subscription-tracker

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Firebase config (see below)

# 4. Start the dev server
npm run dev
```

## Firebase Setup (for cross-device sync)

1. Go to [Firebase Console](https://console.firebase.google.com) and create a new project
2. In your project, go to **Build → Realtime Database** and create a database
3. Set the database rules to:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

4. Go to **Project Settings → General** and scroll to "Your apps"
5. Click **Add app** → Web, register it, and copy the config values
6. Paste them into your `.env` file:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

7. For Vercel deployment, add these same variables in your Vercel project settings under **Settings → Environment Variables**

> **Without Firebase config**, the app works perfectly in local-only mode (localStorage). The sync panel won't appear until Firebase is configured.

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add your `VITE_FIREBASE_*` environment variables in Vercel project settings
4. Deploy — Vercel auto-deploys on every push to main

## How Sync Works

- Enter a secret passphrase on any device
- The app hashes your passphrase and uses it as your unique data key in Firebase
- All devices with the same passphrase stay in real-time sync
- No accounts, no email, no login — just a passphrase you remember
- **Keep your passphrase secret** — anyone with it can access your data

## Build for Production

```bash
npm run build
```

## Tech Stack

- **React 19** — UI framework
- **Vite** — build tool & dev server
- **Tailwind CSS v4** — utility-first styling
- **Firebase Realtime Database** — cross-device sync
- **date-fns** — date calculations
- **lucide-react** — icons

## Project Structure

```
subscription-tracker/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── index.css
    ├── firebase.js        # Firebase config & sync helpers
    ├── App.jsx
    └── components/
        ├── Header.jsx
        ├── Dashboard.jsx
        ├── SubscriptionList.jsx
        ├── AddSubscription.jsx
        ├── SyncPanel.jsx
        └── ThemeToggle.jsx
```

## License

MIT
