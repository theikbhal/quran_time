# 🕌 Quran Time — Daily Parah Tracker (Web App & PWA)

**Quran Time** is a beautiful, premium, offline-first Quran reading tracker that helps Muslims read and track the entire Quran (30 Parahs / Juz) by reading one Parah per day. 

It is designed with a premium Islamic spiritual aesthetic, featuring geometric lattice background patterns, support for three distinct themes (Light, Dark, and Night), and seamless mobile/desktop responsive design. The app works fully offline (Progressive Web App) with local storage persistence and requires zero backend integrations or user accounts.

---

## 🌟 Key Features

1. **Today's Reading (Home)**
   - Computes the active daily Parah dynamically based on your start date (cycles 1 to 30).
   - Showcases the active Parah in large Arabic Amiri script, transliteration, and Surah ranges.
   - Prominently displays the current **Islamic Hijri date** (using native `Intl` API / Umm al-Qura calendar).
   - Lets you mark the reading progress (*Complete* ✅, *Partial* ⏳, *Not Yet* ❌) and record personal reflections/notes.
   - Launches media resources including Sabeel Quran recitations (opens the specific YouTube video by index) or customized audio/video overrides.
   - Displays a rotating daily supplication (Dua) with English translations and references.

2. **Progress & History**
   - Lifetime stats tracking (Completed count, in-progress count, current streak, longest streak).
   - Lifetime progress bar.
   - **30-Parah Grid**: A color-coded 6x5 matrix showing Juz statuses at a glance. Tap any cell to view details or edit.
   - **Monthly History Calendar**: Displays reading statuses day-by-day. Supports calendar month navigation to view past months.

3. **Juz Catalog**
   - Displays all 30 Juz with their Surah/Ayah limits, current statuses, and quick snippets of your logged notes.

4. **Detailed Modal Overlay**
   - Enables fast edits, custom link overrides per Juz, and sequential navigation (Previous ⟵ / Next ⟶) so you can review and update items without closing the view.

5. **Settings & Preferences**
   - **Theme Selector**: Light ☀️, Dark 🌙 (Default), or Night 🌌 (Sleek deep-space purple).
   - **Target Reading Time**: Morning (Fajr), Afternoon (Zuhr), Evening (Asr/Maghrib), or Night (Isha).
   - **Date Formats**: Islamic only, both, or Gregorian only.
   - **Notification Preference**: Toggles browser-level reading reminders.
   - **Backup & Restore**: Export progress as a JSON file and import backups.
   - **Track Offsets**: Change your starting date to recalculate today's target Juz.
   - **Custom Link Overrides**: A grid table to paste custom recitation/translation links for each of the 30 Juz.

6. **PWA Offline-First Design**
   - Service worker stale-while-revalidate caching.
   - Fast, local, and installs directly to your home screen (on iOS, Android, macOS, Windows).
   - Custom app icon with deep navy backdrop, emerald crescent, gold star, and progress bar.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 19 (scaffolded via Vite)
- **Styling**: Tailwind CSS v4 (native CSS theme definitions + variables)
- **Icons**: Lucide React
- **PWA Assets**: Service worker (`sw.js`) + Manifest (`manifest.json`)
- **Data Persistence**: `localStorage` (keys: `qurantime_settings` and `qurantime_progress`)

---

## 💾 LocalStorage Data Schemas

### Settings Schema (`qurantime_settings`)
```json
{
  "theme": "dark",
  "readingTime": "night",
  "dateFormat": "both",
  "startDate": "2026-06-10",
  "notificationsEnabled": false,
  "customLinks": {
    "1": "https://custom-url-for-juz-1.com",
    "7": "https://custom-url-for-juz-7.com"
  }
}
```

### Progress Logs Schema (`qurantime_progress`)
```json
{
  "2026-06-10": {
    "parah": 1,
    "status": "complete",
    "note": "Read Al-Fatiha and started Al-Baqarah. Felt very peaceful.",
    "timestamp": "2026-06-10T01:24:30.000Z"
  }
}
```

---

## 🚀 Getting Started Locally

### 1. Installation
Install the project dependencies:
```bash
npm install
```

### 2. Running Dev Server
Launch the local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
Build and optimize for hosting:
```bash
npm run build
```
The optimized files will be built inside the `dist/` directory, ready to be deployed to Vercel, Netlify, or GitHub Pages.

---

## 🔗 Deploying to Vercel

This app is a static site and can be deployed to Vercel with zero configuration:
1. Push this repository to GitHub/GitLab.
2. Link the repository to your Vercel account.
3. Vercel will auto-detect Vite and deploy the production bundle immediately.
