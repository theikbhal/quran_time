import React, { createContext, useState, useEffect, useContext } from 'react';
import { getLocalDateString } from '../utils/hijriHelper';

const AppContext = createContext();

const defaultSettings = {
  theme: 'dark', // 'dark' | 'light' | 'night'
  readingTime: 'night', // 'morning' | 'afternoon' | 'evening' | 'night'
  dateFormat: 'both', // 'islamic' | 'both' | 'gregorian'
  startDate: getLocalDateString(new Date()), // YYYY-MM-DD
  notificationsEnabled: false,
  customLinks: {} // maps parah number -> custom URL string
};

export const AppProvider = ({ children }) => {
  // Load settings from localStorage
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('qurantime_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure default settings are merged for backwards compatibility
        return { ...defaultSettings, ...parsed };
      }
    } catch (e) {
      console.error('Error loading settings', e);
    }
    return defaultSettings;
  });

  // Load progress from localStorage
  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem('qurantime_progress');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Error loading progress', e);
      return {};
    }
  });

  // Active page state: 'today' | 'progress' | 'all' | 'settings'
  const [activePage, setActivePage] = useState('today');

  // Currently selected Parah for the details modal (null if closed)
  const [selectedParahNum, setSelectedParahNum] = useState(null);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('qurantime_settings', JSON.stringify(settings));
    
    // Apply theme class to <html> element
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-night');
    root.classList.add(`theme-${settings.theme}`);
  }, [settings]);

  // Sync progress to localStorage
  useEffect(() => {
    localStorage.setItem('qurantime_progress', JSON.stringify(progress));
  }, [progress]);

  // Update a specific settings property
  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Update progress for a specific date
  const updateProgress = (dateStr, parahNum, status, note = '') => {
    setProgress((prev) => {
      const existing = prev[dateStr] || {};
      const updated = {
        ...prev,
        [dateStr]: {
          parah: parahNum,
          status,
          note,
          timestamp: new Date().toISOString()
        }
      };
      
      // If the status is deleted or cleared, we can keep it or delete it.
      // But keeping it allows recording "no" status.
      return updated;
    });
  };

  // Get status of a Parah based on its most recent reading log
  const getParahStatus = (parahNum) => {
    let latestLog = null;
    
    for (const [dateStr, log] of Object.entries(progress)) {
      if (log.parah === parahNum) {
        if (!latestLog || new Date(log.timestamp) > new Date(latestLog.timestamp)) {
          latestLog = log;
        }
      }
    }
    
    return latestLog ? latestLog.status : 'untouched'; // 'complete' | 'partial' | 'no' | 'untouched'
  };

  // Get note of a Parah based on its most recent reading log
  const getParahNote = (parahNum) => {
    let latestLog = null;
    
    for (const [dateStr, log] of Object.entries(progress)) {
      if (log.parah === parahNum) {
        if (!latestLog || new Date(log.timestamp) > new Date(latestLog.timestamp)) {
          latestLog = log;
        }
      }
    }
    
    return latestLog ? latestLog.note : '';
  };

  // Streak calculations
  const getStreaks = () => {
    const todayStr = getLocalDateString(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    
    // Check if today or yesterday is complete
    const isTodayComplete = progress[todayStr]?.status === 'complete';
    const isYesterdayComplete = progress[yesterdayStr]?.status === 'complete';
    
    let currentStreak = 0;
    let checkDate = new Date();
    
    // Determine start date of streak checking
    if (isTodayComplete) {
      // Start checking from today
    } else if (isYesterdayComplete) {
      // Start checking from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Streak is broken/0
      checkDate = null;
    }
    
    if (checkDate) {
      while (true) {
        const dateStr = getLocalDateString(checkDate);
        if (progress[dateStr]?.status === 'complete') {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    
    // Longest streak calculation
    // Sort all dates where progress is 'complete'
    const completedDates = Object.keys(progress)
      .filter((d) => progress[d].status === 'complete')
      .sort();
      
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDateTime = null;
    
    for (const dateStr of completedDates) {
      const curDate = new Date(dateStr);
      curDate.setHours(0,0,0,0);
      
      if (prevDateTime === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.floor((curDate - prevDateTime) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      prevDateTime = curDate;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }
    
    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak)
    };
  };

  // Lifetime unique Parahs completed count
  const getCompletedCount = () => {
    const completedParahs = new Set();
    for (const log of Object.values(progress)) {
      if (log.status === 'complete') {
        completedParahs.add(log.parah);
      }
    }
    return completedParahs.size;
  };

  // Lifetime unique Parahs partial count
  const getPartialCount = () => {
    const partialParahs = new Set();
    // A parah is partial if its latest status is partial
    for (let i = 1; i <= 30; i++) {
      if (getParahStatus(i) === 'partial') {
        partialParahs.add(i);
      }
    }
    return partialParahs.size;
  };

  // Reset all data
  const resetAllData = () => {
    setProgress({});
    setSettings(defaultSettings);
    localStorage.removeItem('qurantime_progress');
    localStorage.removeItem('qurantime_settings');
  };

  // Export progress and settings to JSON file
  const exportData = () => {
    const dataStr = JSON.stringify({ settings, progress }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quran_time_backup_${getLocalDateString(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import progress and settings from JSON file
  const importData = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.settings) {
          setSettings((prev) => ({ ...prev, ...parsed.settings }));
        }
        if (parsed.progress) {
          setProgress((prev) => ({ ...prev, ...parsed.progress }));
        }
        callback({ success: true });
      } catch (err) {
        console.error(err);
        callback({ success: false, error: 'Invalid file format' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        progress,
        activePage,
        setActivePage,
        selectedParahNum,
        setSelectedParahNum,
        updateSettings,
        updateProgress,
        getParahStatus,
        getParahNote,
        getStreaks,
        getCompletedCount,
        getPartialCount,
        resetAllData,
        exportData,
        importData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
