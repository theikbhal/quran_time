import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { parahs, getDefaultVideoLink } from '../utils/parahData';
import { getLocalDateString } from '../utils/hijriHelper';
import { X, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, Play, Link } from 'lucide-react';

export default function ParahDetailModal() {
  const {
    selectedParahNum,
    setSelectedParahNum,
    progress,
    updateProgress,
    settings,
    updateSettings
  } = useApp();

  // If no Parah is selected, do not render
  if (!selectedParahNum) return null;

  const parah = parahs[selectedParahNum - 1];

  // Helper to fetch latest log for this Parah
  const getLogDetails = () => {
    let latestDate = null;
    let latestLog = null;
    
    for (const [dateStr, log] of Object.entries(progress)) {
      if (log.parah === selectedParahNum) {
        if (!latestLog || new Date(log.timestamp) > new Date(latestLog.timestamp)) {
          latestDate = dateStr;
          latestLog = log;
        }
      }
    }
    
    return {
      dateStr: latestDate || getLocalDateString(new Date()),
      status: latestLog ? latestLog.status : 'no',
      note: latestLog ? latestLog.note : ''
    };
  };

  const { dateStr, status: currentStatus, note: currentNote } = getLogDetails();

  // Local states for notes and custom links
  const [noteText, setNoteText] = useState(currentNote);
  const [customLink, setCustomLink] = useState(settings.customLinks[selectedParahNum] || '');

  // Keep local states in sync when selectedParahNum changes
  useEffect(() => {
    setNoteText(currentNote);
    setCustomLink(settings.customLinks[selectedParahNum] || '');
  }, [selectedParahNum, currentStatus, currentNote, settings.customLinks]);

  const handleStatusChange = (status) => {
    updateProgress(dateStr, selectedParahNum, status, noteText);
  };

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNoteText(val);
    updateProgress(dateStr, selectedParahNum, currentStatus, val);
  };

  const handleCustomLinkChange = (e) => {
    const val = e.target.value;
    setCustomLink(val);
    
    const updatedLinks = { ...settings.customLinks };
    if (val.trim() === '') {
      delete updatedLinks[selectedParahNum];
    } else {
      updatedLinks[selectedParahNum] = val;
    }
    updateSettings({ customLinks: updatedLinks });
  };

  // Navigating Previous / Next
  const handlePrev = () => {
    if (selectedParahNum > 1) {
      setSelectedParahNum(selectedParahNum - 1);
    }
  };

  const handleNext = () => {
    if (selectedParahNum < 30) {
      setSelectedParahNum(selectedParahNum + 1);
    }
  };

  const videoLink = settings.customLinks[selectedParahNum] || getDefaultVideoLink(selectedParahNum);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="premium-card w-full max-w-lg bg-brand-card p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={() => setSelectedParahNum(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-brand-text hover:bg-brand-secondary/40 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4 pr-10">
          <button
            onClick={handlePrev}
            disabled={selectedParahNum === 1}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-text disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          
          <span className="text-xs font-extrabold tracking-widest text-brand-gold uppercase bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            Juz {selectedParahNum} of 30
          </span>
          
          <button
            onClick={handleNext}
            disabled={selectedParahNum === 30}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-text disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Content Info */}
        <div className="text-center space-y-3">
          <span className="text-5xl md:text-6xl font-arabic font-extrabold text-brand-accent block leading-loose drop-shadow-[0_2px_8px_rgba(63,182,138,0.1)] select-all">
            {parah.arabicName}
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-wide text-brand-text font-sans">
            {parah.transliteration}
          </h2>
          
          <div className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-brand-text/80 border border-brand-border rounded-lg px-3.5 py-1.5 bg-brand-secondary/20">
            <span>📖</span>
            <span>{parah.startSurah} {parah.startAyah}</span>
            <span className="text-brand-muted">→</span>
            <span>{parah.endSurah} {parah.endAyah}</span>
          </div>
        </div>

        {/* Status buttons */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">Reading Status</h4>
          
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => handleStatusChange('complete')}
              className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                currentStatus === 'complete'
                  ? 'bg-status-complete/15 border-status-complete text-status-complete shadow-[0_0_10px_rgba(63,182,138,0.1)]'
                  : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
              }`}
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Complete</span>
            </button>

            <button
              onClick={() => handleStatusChange('partial')}
              className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                currentStatus === 'partial'
                  ? 'bg-status-partial/15 border-status-partial text-status-partial shadow-[0_0_10px_rgba(212,160,23,0.1)]'
                  : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>Partial</span>
            </button>

            <button
              onClick={() => handleStatusChange('no')}
              className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                currentStatus === 'no'
                  ? 'bg-status-no/15 border-status-no text-status-no shadow-[0_0_10px_rgba(244,117,117,0.1)]'
                  : 'border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text bg-brand-secondary/20'
              }`}
            >
              <XCircle className="w-4 h-4 shrink-0" />
              <span>Not Yet</span>
            </button>
          </div>
        </div>

        {/* Note Editor */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">Reflections & Notes</h4>
          <textarea
            value={noteText}
            onChange={handleNoteChange}
            placeholder="Write reflections for this Parah..."
            rows={2.5}
            className="w-full bg-brand-secondary/35 border border-brand-border rounded-xl p-3 text-brand-text text-xs focus:outline-none focus:border-brand-accent placeholder-brand-muted resize-none transition-colors"
          />
        </div>

        {/* Links section */}
        <div className="space-y-3.5 border-t border-brand-border pt-4">
          <a
            href={videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-brand-border bg-brand-secondary/30 hover:bg-brand-accent/5 hover:border-brand-accent text-sm font-semibold text-brand-text hover:text-brand-accent transition-all duration-200"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Watch Parah {selectedParahNum} Video</span>
          </a>

          {/* Custom video link override */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-brand-accent" />
              Override Link for this Parah
            </label>
            <input
              type="url"
              value={customLink}
              onChange={handleCustomLinkChange}
              placeholder="Paste custom YouTube link here"
              className="w-full bg-brand-secondary/35 border border-brand-border rounded-lg px-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-accent placeholder-brand-muted/70"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
