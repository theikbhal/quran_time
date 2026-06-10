import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocalDateString } from '../utils/hijriHelper';

export interface Settings {
  theme: 'dark' | 'light' | 'night';
  readingTime: string;
  dateFormat: 'islamic' | 'both' | 'gregorian';
  startDate: string;
  notificationsEnabled: boolean;
  customLinks: { [key: number]: string };
  calculationMethod: 'hijri' | 'gregorian' | 'cycle';
}

export interface ProgressLog {
  parah: number;
  status: 'complete' | 'partial' | 'no';
  note: string;
  timestamp: string;
}

export interface ProgressState {
  [dateStr: string]: ProgressLog;
}

interface AppContextProps {
  settings: Settings;
  progress: ProgressState;
  loading: boolean;
  selectedParahNum: number | null;
  setSelectedParahNum: (num: number | null) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  updateProgress: (dateStr: string, parahNum: number, status: 'complete' | 'partial' | 'no', note?: string) => void;
  getParahStatus: (parahNum: number) => 'complete' | 'partial' | 'no' | 'untouched';
  getParahNote: (parahNum: number) => string;
  getStreaks: () => { currentStreak: number; longestStreak: number };
  getCompletedCount: () => number;
  getPartialCount: () => number;
  resetAllData: () => Promise<void>;
  importData: (importedJson: string) => Promise<{ success: boolean; error?: string }>;
  exportDataJson: () => string;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const defaultSettings: Settings = {
  theme: 'dark',
  readingTime: 'night',
  dateFormat: 'both',
  startDate: getLocalDateString(new Date()),
  notificationsEnabled: false,
  customLinks: {},
  calculationMethod: 'hijri'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [progress, setProgress] = useState<ProgressState>({});
  const [loading, setLoading] = useState(true);
  const [selectedParahNum, setSelectedParahNum] = useState<number | null>(null);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('qurantime_settings');
        const storedProgress = await AsyncStorage.getItem('qurantime_progress');
        
        if (storedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
        }
        if (storedProgress) {
          setProgress(JSON.parse(storedProgress));
        }
      } catch (e) {
        console.error('Error loading data from storage', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Sync settings to AsyncStorage (only after loading is complete!)
  useEffect(() => {
    if (loading) return;
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('qurantime_settings', JSON.stringify(settings));
      } catch (e) {
        console.error('Error saving settings', e);
      }
    };
    saveSettings();
  }, [settings, loading]);

  // Sync progress to AsyncStorage (only after loading is complete!)
  useEffect(() => {
    if (loading) return;
    const saveProgress = async () => {
      try {
        await AsyncStorage.setItem('qurantime_progress', JSON.stringify(progress));
      } catch (e) {
        console.error('Error saving progress', e);
      }
    };
    saveProgress();
  }, [progress, loading]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const updateProgress = (
    dateStr: string,
    parahNum: number,
    status: 'complete' | 'partial' | 'no',
    note: string = ''
  ) => {
    setProgress((prev) => ({
      ...prev,
      [dateStr]: {
        parah: parahNum,
        status,
        note,
        timestamp: new Date().toISOString()
      }
    }));
  };

  const getParahStatus = (parahNum: number): 'complete' | 'partial' | 'no' | 'untouched' => {
    let latestLog: ProgressLog | null = null;
    
    for (const log of Object.values(progress)) {
      if (log.parah === parahNum) {
        if (!latestLog || new Date(log.timestamp) > new Date(latestLog.timestamp)) {
          latestLog = log;
        }
      }
    }
    
    return latestLog ? latestLog.status : 'untouched';
  };

  const getParahNote = (parahNum: number): string => {
    let latestLog: ProgressLog | null = null;
    
    for (const log of Object.values(progress)) {
      if (log.parah === parahNum) {
        if (!latestLog || new Date(log.timestamp) > new Date(latestLog.timestamp)) {
          latestLog = log;
        }
      }
    }
    
    return latestLog ? latestLog.note : '';
  };

  const getStreaks = () => {
    const todayStr = getLocalDateString(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    
    const isTodayComplete = progress[todayStr]?.status === 'complete';
    const isYesterdayComplete = progress[yesterdayStr]?.status === 'complete';
    
    let currentStreak = 0;
    let checkDate: Date | null = new Date();
    
    if (isTodayComplete) {
      // Start from today
    } else if (isYesterdayComplete) {
      // Start from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
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
    
    // Longest Streak
    const completedDates = Object.keys(progress)
      .filter((d) => progress[d].status === 'complete')
      .sort();
      
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDateTime: Date | null = null;
    
    for (const dateStr of completedDates) {
      const curDate = new Date(dateStr);
      curDate.setHours(0,0,0,0);
      
      if (prevDateTime === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.floor((curDate.getTime() - prevDateTime.getTime()) / (1000 * 60 * 60 * 24));
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

  const getCompletedCount = (): number => {
    const completedParahs = new Set<number>();
    for (const log of Object.values(progress)) {
      if (log.status === 'complete') {
        completedParahs.add(log.parah);
      }
    }
    return completedParahs.size;
  };

  const getPartialCount = (): number => {
    const partialParahs = new Set<number>();
    for (let i = 1; i <= 30; i++) {
      if (getParahStatus(i) === 'partial') {
        partialParahs.add(i);
      }
    }
    return partialParahs.size;
  };

  const resetAllData = async () => {
    setProgress({});
    setSettings(defaultSettings);
    try {
      await AsyncStorage.removeItem('qurantime_progress');
      await AsyncStorage.removeItem('qurantime_settings');
    } catch (e) {
      console.error('Error removing storage items', e);
    }
  };

  const exportDataJson = (): string => {
    return JSON.stringify({ settings, progress }, null, 2);
  };

  const importData = async (importedJson: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const parsed = JSON.parse(importedJson);
      if (parsed.settings) {
        setSettings((prev) => ({ ...prev, ...parsed.settings }));
      }
      if (parsed.progress) {
        setProgress((prev) => ({ ...prev, ...parsed.progress }));
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Invalid backup file format' };
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        progress,
        loading,
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
        importData,
        exportDataJson
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
