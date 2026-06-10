import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/BottomNav';
import TodayPage from './pages/TodayPage';
import ProgressPage from './pages/ProgressPage';
import AllParahsPage from './pages/AllParahsPage';
import SettingsPage from './pages/SettingsPage';
import ParahDetailModal from './components/ParahDetailModal';

function MainLayout() {
  const { activePage } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'today':
        return <TodayPage />;
      case 'progress':
        return <ProgressPage />;
      case 'all':
        return <AllParahsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <TodayPage />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text islamic-bg transition-colors duration-300">
      {/* Side Navigation (Desktop) & Bottom Navigation (Mobile) */}
      <Navigation />

      {/* Main Workspace Area */}
      <main className="md:pl-64 min-h-screen flex flex-col">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-brand-border bg-brand-card/30 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🕌</span>
            <span className="font-bold tracking-wider text-brand-text">Quran Time</span>
            <span className="text-xs text-brand-accent font-extrabold px-2 py-0.5 rounded-md bg-brand-accent/10 border border-brand-accent/20 select-none">
              Daily Parah Tracker
            </span>
          </div>
          <div className="text-xs text-brand-muted font-bold tracking-wider uppercase">
            One Parah a Day. Every Day.
          </div>
        </header>

        {/* Dynamic Page Component Container */}
        <div className="flex-1 px-4 py-6 md:p-8 pb-24 md:pb-8 max-w-5xl w-full mx-auto">
          {renderActivePage()}
        </div>
      </main>

      {/* Parah Detail Overlay Modal */}
      <ParahDetailModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
