import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { parahs } from '../utils/parahData';
import { Sun, Moon, Sparkles, Bell, Download, Upload, Trash2, Link, ChevronDown, ChevronUp } from 'lucide-react';

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    resetAllData,
    exportData,
    importData
  } = useApp();

  const fileInputRef = useRef(null);
  
  // Local states
  const [linksExpanded, setLinksExpanded] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Handle browser notifications toggle
  const handleNotificationToggle = async (e) => {
    const checked = e.target.checked;
    
    if (checked) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          updateSettings({ notificationsEnabled: true });
        } else {
          alert('Notification permission was denied. Please enable it in browser settings.');
          updateSettings({ notificationsEnabled: false });
        }
      } else {
        alert('This browser does not support notifications.');
        updateSettings({ notificationsEnabled: false });
      }
    } else {
      updateSettings({ notificationsEnabled: false });
    }
  };

  // Handle custom link changes
  const handleLinkChange = (parahNum, value) => {
    const updatedLinks = { ...settings.customLinks };
    if (value.trim() === '') {
      delete updatedLinks[parahNum];
    } else {
      updatedLinks[parahNum] = value;
    }
    updateSettings({ customLinks: updatedLinks });
  };

  // Handle JSON file import
  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    importData(file, (result) => {
      if (result.success) {
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(''), 3000);
      } else {
        setImportStatus(`Restore failed: ${result.error}`);
        setTimeout(() => setImportStatus(''), 4000);
      }
    });
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    alert('All data has been reset to defaults.');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <h2 className="text-2xl font-bold tracking-wide text-brand-text mb-4 text-center md:text-left">
        Settings & Preferences
      </h2>

      {/* Theme Preference */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] p-5 md:p-6 space-y-4">
        <h3 className="text-sm font-bold tracking-wide uppercase text-brand-text">Aesthetics & Theme</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => updateSettings({ theme: 'light' })}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
              settings.theme === 'light'
                ? 'bg-brand-accent/10 border-brand-accent text-brand-accent shadow-[0_0_12px_rgba(27,107,58,0.1)]'
                : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
            }`}
          >
            <Sun className="w-5 h-5 mb-1.5" />
            <span>Light</span>
          </button>

          <button
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
              settings.theme === 'dark'
                ? 'bg-brand-accent/15 border-brand-accent text-brand-accent shadow-[0_0_12px_rgba(63,182,138,0.15)]'
                : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
            }`}
          >
            <Moon className="w-5 h-5 mb-1.5" />
            <span>Dark</span>
          </button>

          <button
            onClick={() => updateSettings({ theme: 'night' })}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
              settings.theme === 'night'
                ? 'bg-brand-accent/15 border-brand-accent text-brand-accent shadow-[0_0_16px_rgba(124,92,191,0.2)]'
                : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-1.5" />
            <span>Night</span>
          </button>
        </div>
      </section>

      {/* Date and Time Preferences */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] p-5 md:p-6 space-y-4">
        <h3 className="text-sm font-bold tracking-wide uppercase text-brand-text">Schedule & Date Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Today's Parah Calculation Method */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block">Today's Parah Calculation Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'hijri', label: 'Islamic (Hijri) Day' },
                { id: 'gregorian', label: 'English (Gregorian) Day' },
                { id: 'cycle', label: 'Cycle From Start Date' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => updateSettings({ calculationMethod: method.id })}
                  className={`py-2 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    (settings.calculationMethod || 'hijri') === method.id
                      ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-extrabold'
                      : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-brand-muted font-medium mt-1">
              {(settings.calculationMethod || 'hijri') === 'hijri' && "Default: Maps today's Juz directly to the active Hijri month date (e.g. 14 Dhul Hijjah = Juz 14)."}
              {settings.calculationMethod === 'gregorian' && "Maps today's Juz directly to the current English month date, cycling day 31 back to Juz 1."}
              {settings.calculationMethod === 'cycle' && "Cycles sequentially 1 to 30 starting from your chosen custom Start Tracking Date."}
            </p>
          </div>

          {/* Start Date - only shown if 'cycle' is active */}
          {settings.calculationMethod === 'cycle' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Start Tracking Date</label>
              <input
                type="date"
                value={settings.startDate}
                onChange={(e) => updateSettings({ startDate: e.target.value })}
                className="w-full bg-brand-secondary/35 border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors"
              />
              <p className="text-[10px] text-brand-muted font-medium">Affects which Parah is calculated as "Today's Reading".</p>
            </div>
          )}

          {/* Reading Time */}
          <div className={`space-y-1.5 ${settings.calculationMethod !== 'cycle' ? 'md:col-span-2' : ''}`}>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Target Reading Time</label>
            <select
              value={settings.readingTime}
              onChange={(e) => updateSettings({ readingTime: e.target.value })}
              className="w-full bg-brand-secondary/35 border border-brand-border rounded-xl px-3.5 py-2.5 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors cursor-pointer"
            >
              <option value="morning">Morning (Fajr)</option>
              <option value="afternoon">Afternoon (Zuhr)</option>
              <option value="evening">Evening (Asr / Maghrib)</option>
              <option value="night">Night (Isha)</option>
            </select>
          </div>

          {/* Date Format */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block">Date Display Format</label>
            <div className="grid grid-cols-3 gap-2.5">
              {['islamic', 'both', 'gregorian'].map((format) => (
                <button
                  key={format}
                  onClick={() => updateSettings({ dateFormat: format })}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                    settings.dateFormat === format
                      ? 'bg-brand-accent/10 border-brand-accent text-brand-accent font-extrabold'
                      : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notifications Preference */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] p-5 md:p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-brand-secondary border border-brand-border text-brand-accent">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-text tracking-wide uppercase">Reading Reminders</h3>
            <p className="text-xs text-brand-muted font-medium mt-0.5">Receive daily notifications to stay on track.</p>
          </div>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={handleNotificationToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-brand-secondary border border-brand-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-brand-muted peer-checked:after:bg-white after:border-none after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-accent peer-checked:border-brand-accent" />
        </label>
      </section>

      {/* Expandable Custom Links Overrides */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] overflow-hidden">
        <button
          onClick={() => setLinksExpanded(!linksExpanded)}
          className="w-full flex justify-between items-center p-5 md:p-6 cursor-pointer text-left focus:outline-none"
        >
          <div className="flex items-center space-x-3">
            <Link className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-bold tracking-wide uppercase text-brand-text">Custom Video links per Parah</span>
          </div>
          {linksExpanded ? <ChevronUp className="w-5 h-5 text-brand-muted" /> : <ChevronDown className="w-5 h-5 text-brand-muted" />}
        </button>

        {linksExpanded && (
          <div className="p-5 md:p-6 border-t border-brand-border bg-brand-secondary/10 space-y-4">
            <p className="text-xs text-brand-muted font-medium leading-relaxed">
              Add your preferred custom YouTube link for any Parah. If empty, the default Sabeel Quran playlist link is opened.
            </p>
            
            <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2 no-scrollbar">
              {parahs.map((parah) => (
                <div key={parah.number} className="flex items-center space-x-3">
                  <span className="w-12 text-xs font-bold text-brand-muted uppercase shrink-0">
                    Juz {parah.number}
                  </span>
                  <input
                    type="url"
                    value={settings.customLinks[parah.number] || ''}
                    onChange={(e) => handleLinkChange(parah.number, e.target.value)}
                    placeholder={`Default link (Sabeel Quran Juz ${parah.number})`}
                    className="w-full bg-brand-secondary/35 border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-text focus:outline-none focus:border-brand-accent placeholder-brand-muted/70"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Backup and Maintenance */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] p-5 md:p-6 space-y-4">
        <h3 className="text-sm font-bold tracking-wide uppercase text-brand-text">Data Maintenance</h3>
        
        {importStatus && (
          <div className={`p-3 rounded-lg border text-xs font-semibold text-center ${
            importStatus.includes('successfully')
              ? 'bg-status-complete/10 border-status-complete text-status-complete'
              : 'bg-status-no/10 border-status-no text-status-no'
          }`}>
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export */}
          <button
            onClick={exportData}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-brand-border bg-brand-secondary/20 hover:border-brand-accent hover:text-brand-accent text-sm font-semibold transition-all duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Progress (JSON)</span>
          </button>

          {/* Import */}
          <button
            onClick={triggerImport}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-brand-border bg-brand-secondary/20 hover:border-brand-accent hover:text-brand-accent text-sm font-semibold transition-all duration-200 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Import Progress (JSON)</span>
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Reset */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500 text-status-no text-sm font-semibold transition-all duration-200 cursor-pointer sm:col-span-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset All Progress & Settings</span>
            </button>
          ) : (
            <div className="flex flex-col items-center p-4 rounded-xl border border-red-500/50 bg-red-500/5 sm:col-span-2 space-y-3">
              <span className="text-xs font-bold text-status-no uppercase tracking-wide">
                Are you sure? This will delete all your streaks, notes, and custom links!
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-lg bg-brand-secondary text-brand-text border border-brand-border text-xs font-bold cursor-pointer hover:border-brand-text/30"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
