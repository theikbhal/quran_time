# Quran Time — Android App (Capacitor)

This folder is reserved for the future Android build of **Quran Time**. 

Since the application is built using standard React and Tailwind CSS, it can be easily wrapped and deployed as a native Android application using **Ionic Capacitor** with 99% code reuse!

## 🚀 Future Integration Steps:

When you are ready to build the Android application:

1. **Install Capacitor CLI and Core**:
   Run this inside the `website/` directory (or workspace root if configured):
   ```bash
   cd website
   npm install @capacitor/core @capacitor/cli
   ```

2. **Initialize Capacitor**:
   ```bash
   npx cap init "Quran Time" "com.qurantime.app" --web-dir=dist
   ```

3. **Install Android Platform Support**:
   ```bash
   npm install @capacitor/android
   npx cap add android
   ```

4. **Sync Code and Assets**:
   Whenever you compile the web project (`npm run build`), synchronize the build outputs with the Android project:
   ```bash
   npm run build
   npx cap sync
   ```

5. **Open in Android Studio**:
   To compile the final `.apk` or `.aab` file:
   ```bash
   npx cap open android
   ```
   This will launch Android Studio, where you can run the app on a simulator or deploy it to a physical device.
