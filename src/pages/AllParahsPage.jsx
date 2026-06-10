import React from 'react';
import { useApp } from '../context/AppContext';
import { parahs } from '../utils/parahData';
import { FileText, ChevronRight } from 'lucide-react';

export default function AllParahsPage() {
  const { getParahStatus, getParahNote, setSelectedParahNum } = useApp();

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-status-complete border-status-complete/20';
      case 'partial':
        return 'bg-status-partial border-status-partial/20';
      case 'no':
        return 'bg-status-no border-status-no/20';
      default:
        return 'bg-brand-border border-transparent';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'partial':
        return 'Partial';
      case 'no':
        return 'Not Yet';
      default:
        return 'Untouched';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center md:text-left mb-6">
        <h2 className="text-2xl font-bold tracking-wide text-brand-text">
          All 30 Parahs
        </h2>
        <p className="text-sm text-brand-muted mt-1">
          Scroll through and tap on any Parah to view details, update reading progress, or add personal reflections.
        </p>
      </div>

      <section className="space-y-3">
        {parahs.map((parah) => {
          const status = getParahStatus(parah.number);
          const note = getParahNote(parah.number);
          const statusColor = getStatusColor(status);
          
          return (
            <button
              key={parah.number}
              onClick={() => setSelectedParahNum(parah.number)}
              className="w-full flex items-center justify-between p-4.5 bg-brand-card border border-brand-border rounded-[14px] interactive-hover text-left cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Status indicator dot */}
                <div 
                  className={`w-3.5 h-3.5 rounded-full shrink-0 border ${statusColor} relative`}
                  title={getStatusText(status)}
                >
                  {status !== 'untouched' && (
                    <span className="absolute inset-0.5 rounded-full bg-white opacity-20" />
                  )}
                </div>

                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-black text-brand-text">
                      Juz {parah.number}
                    </span>
                    <span className="text-xs text-brand-muted font-medium">
                      ({parah.transliteration})
                    </span>
                  </div>

                  <div className="text-xs text-brand-muted font-semibold mt-1 flex items-center gap-1">
                    <span>📖</span>
                    <span className="truncate">
                      {parah.startSurah} {parah.startAyah} → {parah.endSurah} {parah.endAyah}
                    </span>
                  </div>

                  {/* Note preview */}
                  {note && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-brand-accent/90 bg-brand-accent/5 px-2 py-0.5 rounded-md w-fit max-w-full font-medium">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[200px] sm:max-w-xs">{note}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Arabic name display and right arrow */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xl md:text-2xl font-arabic font-extrabold text-brand-accent group-hover:scale-105 transition-transform leading-relaxed text-right min-w-[70px]">
                  {parah.arabicName}
                </span>
                <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-accent transition-colors" />
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
