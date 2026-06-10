import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { parahs, getDefaultVideoLink, fullQuranVideoLink, fullPlaylistLink } from '../utils/parahData';
import { toHijri, formatHijri, getLocalDateString, getGregorianFormatted, calculateTodayParah } from '../utils/hijriHelper';
import { getDailyDua } from '../utils/duas';
import { Play, FileText, CheckCircle, Clock, XCircle, ExternalLink, Calendar } from 'lucide-react';

export default function TodayPage() {
  const { settings, progress, updateProgress } = useApp();
  
  const todayDateStr = getLocalDateString(new Date());
  const todayParahNum = calculateTodayParah(settings, new Date());
  const todayParah = parahs[todayParahNum - 1];
  
  const todayLog = progress[todayDateStr] || {};
  const currentStatus = todayLog.status || 'no';
  const currentNote = todayLog.note || '';

  const [noteText, setNoteText] = useState(currentNote);
  const [saveStatus, setSaveStatus] = useState('');
  const [dua, setDua] = useState({ arabic: '', english: '', source: '' });

  // Load Daily Dua
  useEffect(() => {
    setDua(getDailyDua());
  }, []);

  // Keep local note state in sync with context updates
  useEffect(() => {
    setNoteText(currentNote);
  }, [currentNote]);

  const handleStatusChange = (status) => {
    updateProgress(todayDateStr, todayParahNum, status, noteText);
    showSaveIndicator('Status updated');
  };

  const handleNoteChange = (e) => {
    const text = e.target.value;
    setNoteText(text);
    // Auto-save to context/localStorage
    updateProgress(todayDateStr, todayParahNum, currentStatus, text);
    showSaveIndicator('Notes saved');
  };

  const showSaveIndicator = (msg) => {
    setSaveStatus(msg);
    setTimeout(() => {
      setSaveStatus('');
    }, 2000);
  };

  // Dates formatting based on settings preference
  const hijriDate = toHijri(new Date());
  const hijriFormatted = formatHijri(hijriDate);
  const gregorianFormatted = getGregorianFormatted(new Date());

  const renderDates = () => {
    const isIslamic = settings.dateFormat === 'islamic';
    const isGregorian = settings.dateFormat === 'gregorian';
    const isBoth = settings.dateFormat === 'both';

    if (isIslamic) {
      return (
        <div className="text-center md:text-left mb-6">
          <h2 className="text-2xl font-bold tracking-wide text-brand-text flex items-center justify-center md:justify-start gap-2">
            <Calendar className="w-5 h-5 text-brand-accent" />
            {hijriFormatted}
          </h2>
          <span className="text-xs text-brand-accent/80 font-semibold uppercase tracking-wider">Islamic Calendar</span>
        </div>
      );
    }

    if (isGregorian) {
      return (
        <div className="text-center md:text-left mb-6">
          <h2 className="text-2xl font-bold tracking-wide text-brand-text flex items-center justify-center md:justify-start gap-2">
            <Calendar className="w-5 h-5 text-brand-accent" />
            {gregorianFormatted}
          </h2>
          <span className="text-xs text-brand-accent/80 font-semibold uppercase tracking-wider">Gregorian Calendar</span>
        </div>
      );
    }

    // Default: both
    return (
      <div className="text-center md:text-left mb-6">
        <h2 className="text-2xl font-bold tracking-wide text-brand-text flex items-center justify-center md:justify-start gap-2">
          <Calendar className="w-5 h-5 text-brand-accent" />
          {hijriFormatted}
        </h2>
        <p className="text-sm text-brand-muted mt-1">{gregorianFormatted}</p>
      </div>
    );
  };

  // Get current active link for today's Parah (custom override vs default)
  const todayVideoLink = settings.customLinks[todayParahNum] || getDefaultVideoLink(todayParahNum);
  const isCustomLinkUsed = !!settings.customLinks[todayParahNum];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Dates */}
      {renderDates()}

      {/* Today's Reading Card */}
      <section className="premium-card p-6 md:p-8 flex flex-col items-center">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20 mb-4">
          Today's Reading
        </span>
        
        <h3 className="text-lg font-semibold text-brand-muted tracking-wide">
          Parah {todayParah.number} of 30
        </h3>
        
        <div className="my-6 text-center select-all">
          <span className="text-5xl md:text-6xl font-arabic font-extrabold text-brand-accent block mb-3 leading-loose drop-shadow-[0_2px_8px_rgba(63,182,138,0.1)]">
            {todayParah.arabicName}
          </span>
          <span className="text-xl md:text-2xl font-bold tracking-wide text-brand-text block font-sans">
            {todayParah.transliteration}
          </span>
        </div>

        <div className="w-full max-w-sm border-t border-b border-brand-border py-3.5 my-2 text-center text-sm md:text-base font-semibold text-brand-text/90 flex justify-center items-center gap-2">
          <span className="text-brand-accent">📖</span>
          <span>{todayParah.startSurah} {todayParah.startAyah}</span>
          <span className="text-brand-muted mx-1">→</span>
          <span>{todayParah.endSurah} {todayParah.endAyah}</span>
        </div>
      </section>

      {/* Reading Status Selector */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] p-5 md:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold tracking-wide uppercase text-brand-text">Reading Status</h4>
          {saveStatus && <span className="text-xs text-brand-accent font-semibold animate-pulse">{saveStatus}</span>}
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleStatusChange('complete')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              currentStatus === 'complete'
                ? 'bg-status-complete/15 border-status-complete text-status-complete shadow-[0_0_12px_rgba(63,182,138,0.15)]'
                : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
            }`}
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Complete</span>
          </button>
          
          <button
            onClick={() => handleStatusChange('partial')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              currentStatus === 'partial'
                ? 'bg-status-partial/15 border-status-partial text-status-partial shadow-[0_0_12px_rgba(212,160,23,0.15)]'
                : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
            }`}
          >
            <Clock className="w-5 h-5 shrink-0" />
            <span>Partial</span>
          </button>
          
          <button
            onClick={() => handleStatusChange('no')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              currentStatus === 'no'
                ? 'bg-status-no/15 border-status-no text-status-no shadow-[0_0_12px_rgba(244,117,117,0.15)]'
                : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
            }`}
          >
            <XCircle className="w-5 h-5 shrink-0" />
            <span>Not Yet</span>
          </button>
        </div>
      </section>

      {/* Reflections / Notes */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] p-5 md:p-6 space-y-3">
        <h4 className="text-sm font-bold tracking-wide uppercase text-brand-text flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-accent" />
          Reflections & Notes
        </h4>
        <textarea
          value={noteText}
          onChange={handleNoteChange}
          placeholder="Write down any notes, thoughts, or reflections on today's reading..."
          rows={3}
          className="w-full bg-brand-secondary/35 border border-brand-border rounded-xl p-3.5 text-brand-text text-sm focus:outline-none focus:border-brand-accent placeholder-brand-muted resize-none transition-colors duration-200"
        />
      </section>

      {/* Media Links Grid */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] p-5 md:p-6 space-y-4">
        <h4 className="text-sm font-bold tracking-wide uppercase text-brand-text">Media Resources</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={todayVideoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl border border-brand-border bg-brand-secondary/20 hover:border-brand-accent hover:bg-brand-accent/5 text-sm font-semibold transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📺</span>
              <div className="text-left">
                <span className="text-brand-text block leading-tight">Watch Today's Parah</span>
                <span className="text-[10px] text-brand-muted font-medium">
                  {isCustomLinkUsed ? 'Custom Link' : 'Sabeel Quran YouTube'}
                </span>
              </div>
            </div>
            <Play className="w-4 h-4 text-brand-accent group-hover:scale-110 transition-transform" />
          </a>

          <a
            href={fullPlaylistLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl border border-brand-border bg-brand-secondary/20 hover:border-brand-accent hover:bg-brand-accent/5 text-sm font-semibold transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎦</span>
              <div className="text-left">
                <span className="text-brand-text block leading-tight">Full Quran Playlist</span>
                <span className="text-[10px] text-brand-muted font-medium">30 Videos Series</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-brand-muted group-hover:text-brand-accent transition-colors" />
          </a>

          <a
            href={fullQuranVideoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl border border-brand-border bg-brand-secondary/20 hover:border-brand-accent hover:bg-brand-accent/5 text-sm font-semibold transition-all duration-200 group sm:col-span-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🕋</span>
              <div className="text-left">
                <span className="text-brand-text block leading-tight">Complete Quran (Single Video)</span>
                <span className="text-[10px] text-brand-muted font-medium">Full 30 Juz Recitation</span>
              </div>
            </div>
            <Play className="w-4 h-4 text-brand-gold group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </section>

      {/* Daily Dua Card */}
      {dua.arabic && (
        <section className="border border-brand-gold/30 rounded-[14px] bg-brand-gold/5 p-5 md:p-6 text-center space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 opacity-5 pointer-events-none select-none">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
          <span className="text-[10px] font-extrabold tracking-widest uppercase text-brand-gold bg-brand-gold/15 px-2.5 py-0.5 rounded-full border border-brand-gold/10 inline-block">
            Daily supplication
          </span>
          <p className="text-2xl md:text-3xl font-arabic font-extrabold text-brand-gold leading-loose pt-2">
            {dua.arabic}
          </p>
          <p className="text-sm font-medium text-brand-text/90 italic max-w-xl mx-auto leading-relaxed">
            "{dua.english}"
          </p>
          <span className="text-xs text-brand-muted font-semibold block">{dua.source}</span>
        </section>
      )}
    </div>
  );
}
