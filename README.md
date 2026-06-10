# 🕌 Quran Time — Workspace Repository

Welcome to the **Quran Time** repository. This project is organized into a clean, multi-target subfolder structure to support Web/PWA, Chrome Extension, and future Mobile (Android) app builds from a single unified codebase.

---

## 📁 Repository Structure

- **[`website/`](file:///Users/ikbhal/Desktop/projects/quran_time/website/)**: Core React + Vite + Tailwind CSS source code. This compiles to the Web app, PWA, and feeds the Chrome Extension.
- **[`chrome-extension/`](file:///Users/ikbhal/Desktop/projects/quran_time/chrome-extension/)**: Ready-to-load unpacked Chrome Extension popup (Manifest V3).
- **[`android/`](file:///Users/ikbhal/Desktop/projects/quran_time/android/)**: Placeholder and developer instructions for compiling to Android in the future using Ionic Capacitor.
- **[`manifest.extension.json`](file:///Users/ikbhal/Desktop/projects/quran_time/manifest.extension.json)**: Extension manifest overlay.

---

## ⚡ Quick Commands

Run these commands from the root directory:

### 1. Start Local Web Dev Server
```bash
cd website
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Recompile Chrome Extension Output
```bash
cd website
npm run build:extension
```
This builds the site and moves all compiled outputs (configured with relative links) + the manifest directly into the `chrome-extension/` directory.

---

## 🌐 Deploy to Vercel

We have configured a root-level [`vercel.json`](file:///Users/ikbhal/Desktop/projects/quran_time/vercel.json) file that automates the Vercel deployment:
- Vercel will auto-detect the Vite framework.
- It runs the build from the `website/` directory.
- It serves the static page from `website/dist/`.

**To deploy:**
1. Connect this repository to your Vercel Dashboard.
2. Click **Deploy**. No custom build settings or root folder redirects are required!
