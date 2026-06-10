import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, BarChart3, Home, Settings } from 'lucide-react';

export default function Navigation() {
  const { activePage, setActivePage } = useApp();

  const navItems = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'all', label: 'All Parahs', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-card border-t border-brand-border md:hidden px-4 pb-safe backdrop-blur-md bg-opacity-95">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 ${
                  isActive ? 'text-brand-accent scale-105' : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-semibold tracking-wider uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-64 bg-brand-card border-r border-brand-border z-40 p-6">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-xl">
            🌙
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-brand-text leading-tight">Quran Time</h1>
            <span className="text-xs text-brand-muted font-medium font-arabic">وقت القرآن</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center space-x-3.5 w-full px-4.5 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-accent/10 text-brand-accent font-semibold border-l-4 border-brand-accent'
                    : 'text-brand-muted hover:bg-brand-secondary/40 hover:text-brand-text font-medium border-l-4 border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-center text-xs text-brand-muted mt-auto pt-6 border-t border-brand-border">
          <p>© 2026 Quran Time</p>
          <p className="italic mt-1.5 text-[10px] tracking-wider font-semibold uppercase text-brand-accent">
            One Parah a day. Every day.
          </p>
        </div>
      </aside>
    </>
  );
}
