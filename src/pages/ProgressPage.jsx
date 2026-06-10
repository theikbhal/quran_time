import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { parahs } from '../utils/parahData';
import { getLocalDateString } from '../utils/hijriHelper';
import { ChevronLeft, ChevronRight, Flame, Trophy, CheckCircle2, Clock } from 'lucide-react';

export default function ProgressPage() {
  const {
    progress,
    getParahStatus,
    getStreaks,
    getCompletedCount,
    getPartialCount,
    setSelectedParahNum
  } = useApp();

  const { currentStreak, longestStreak } = getStreaks();
  const completedCount = getCompletedCount();
  const partialCount = getPartialCount();

  // Calendar navigation state (defaults to today's month/year)
  const today = new Date();
  const [calendarDate, setCalendarDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  // Generate calendar days
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week (0-6)

  const calendarDays = [];
  // Placeholders for padding previous month's days
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  // Days of current view month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(year, month, d));
  }

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-status-complete text-white border-status-complete';
      case 'partial':
        return 'bg-status-partial text-white border-status-partial';
      case 'no':
        return 'bg-status-no text-white border-status-no';
      default:
        return 'bg-brand-secondary/40 border-brand-border text-brand-muted';
    }
  };

  const getGridColorClass = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-status-complete/10 border-status-complete/50 text-status-complete hover:bg-status-complete/25';
      case 'partial':
        return 'bg-status-partial/10 border-status-partial/50 text-status-partial hover:bg-status-partial/25';
      case 'no':
        return 'bg-status-no/10 border-status-no/50 text-status-no hover:bg-status-no/25';
      default:
        return 'bg-brand-secondary/25 border-brand-border text-brand-muted hover:border-brand-muted/40 hover:text-brand-text';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold tracking-wide text-brand-text mb-4 text-center md:text-left">
        Progress & History
      </h2>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-brand-card border border-brand-border rounded-[14px] p-4 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-6 h-6 text-status-complete mb-1.5" />
          <span className="text-2xl font-extrabold text-brand-text">{completedCount}</span>
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider mt-0.5">Completed</span>
        </div>
        
        <div className="bg-brand-card border border-brand-border rounded-[14px] p-4 flex flex-col items-center justify-center text-center">
          <Clock className="w-6 h-6 text-status-partial mb-1.5" />
          <span className="text-2xl font-extrabold text-brand-text">{partialCount}</span>
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider mt-0.5">In Progress</span>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-[14px] p-4 flex flex-col items-center justify-center text-center">
          <Flame className="w-6 h-6 text-orange-500 mb-1.5" />
          <span className="text-2xl font-extrabold text-brand-text">{currentStreak}</span>
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider mt-0.5">Active Streak</span>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-[14px] p-4 flex flex-col items-center justify-center text-center">
          <Trophy className="w-6 h-6 text-brand-gold mb-1.5" />
          <span className="text-2xl font-extrabold text-brand-text">{longestStreak}</span>
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider mt-0.5">Longest Streak</span>
        </div>
      </section>

      {/* Lifetime Progress Bar */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] p-5 md:p-6 space-y-3">
        <div className="flex justify-between items-center text-sm font-bold tracking-wider">
          <span className="text-brand-text uppercase">LIFETIME PROGRESS</span>
          <span className="text-brand-accent">{completedCount} / 30 PARAHs ({Math.round((completedCount / 30) * 100)}%)</span>
        </div>
        
        <div className="w-full bg-brand-secondary/40 rounded-full h-3 overflow-hidden border border-brand-border">
          <div
            className="bg-gradient-to-r from-brand-accent to-brand-gold h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / 30) * 100}%` }}
          />
        </div>
      </section>

      {/* 30-Parah Grid */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] p-5 md:p-6 space-y-4">
        <h3 className="text-sm font-bold tracking-wide uppercase text-brand-text">30-Parah Tracker Grid</h3>
        
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
          {parahs.map((parah) => {
            const status = getParahStatus(parah.number);
            return (
              <button
                key={parah.number}
                onClick={() => setSelectedParahNum(parah.number)}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl border p-1 transition-all duration-200 cursor-pointer ${getGridColorClass(
                  status
                )}`}
              >
                <span className="text-sm font-black tracking-tight">{parah.number}</span>
                <span className="text-xs font-arabic font-extrabold truncate max-w-full leading-relaxed mt-0.5 sm:mt-1">
                  {parah.arabicName}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Monthly Calendar View */}
      <section className="bg-brand-card border border-brand-border rounded-[14px] p-5 md:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold tracking-wide uppercase text-brand-text">Monthly Calendar</h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-brand-text hover:bg-brand-secondary/40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-extrabold tracking-wide uppercase text-brand-text px-2 min-w-36 text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-brand-text hover:bg-brand-secondary/40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {/* Days of week headers */}
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-[10px] font-bold text-brand-muted uppercase tracking-wider py-1">
              {day}
            </div>
          ))}
          
          {/* Calendar Day Cells */}
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }
            
            const dateStr = getLocalDateString(date);
            const log = progress[dateStr];
            const status = log ? log.status : 'untouched';
            const isCurrentToday = dateStr === getLocalDateString(new Date());
            
            return (
              <div
                key={dateStr}
                onClick={() => log && setSelectedParahNum(log.parah)}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl border text-[11px] font-bold relative transition-all duration-200 group ${
                  log ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                } ${
                  isCurrentToday 
                    ? 'border-brand-accent ring-1 ring-brand-accent/25' 
                    : 'border-transparent bg-brand-secondary/20'
                }`}
              >
                {/* Status Dot */}
                <div className={`w-1.5 h-1.5 rounded-full mb-1 ${
                  status === 'complete' ? 'bg-status-complete' :
                  status === 'partial' ? 'bg-status-partial' :
                  status === 'no' ? 'bg-status-no' : 'bg-transparent'
                }`} />
                
                <span className={isCurrentToday ? 'text-brand-accent font-extrabold' : 'text-brand-text'}>
                  {date.getDate()}
                </span>

                {/* Micro tooltip on hover showing Parah number if logged */}
                {log && (
                  <span className="absolute -top-6 bg-brand-secondary text-brand-text border border-brand-border text-[9px] px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-10">
                    Juz {log.parah} ({log.status})
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center flex-wrap gap-4 pt-3 border-t border-brand-border text-[10px] font-bold text-brand-muted uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-status-complete" />
            <span>Complete</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-status-partial" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-status-no" />
            <span>Not Yet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-border" />
            <span>Untouched</span>
          </div>
        </div>
      </section>
    </div>
  );
}
