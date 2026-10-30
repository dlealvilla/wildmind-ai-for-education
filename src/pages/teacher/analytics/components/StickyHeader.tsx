import { ChevronRight, ArrowLeft, Download, StickyNote } from 'lucide-react';
import type { AnalyticsData } from '../mockAnalyticsData';

interface StickyHeaderProps {
  data: AnalyticsData | null;
  onBack: () => void;
  onOpenNotes: () => void;
}

export function StickyHeader({ data, onBack, onOpenNotes }: StickyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#3D2518]/95 backdrop-blur-sm border-b border-[#8B6914]/40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <nav className="flex items-center gap-1 text-sm text-[#A89070] flex-wrap">
              <span className="hover:text-parchment cursor-pointer">Assessments</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-parchment/90">{data?.assessmentTitle || '—'}</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-parchment/90">{data?.studentName || '—'}</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-parchment font-medium">Attempt Analytics</span>
            </nav>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl font-bold text-parchment">
                Attempt Analytics
              </h1>
              <span
                className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-[2px] border border-gold/50 bg-gold/15 text-gold"
                title="Illustrative scores — not computed from this attempt"
              >
                Sample data preview
              </span>
            </div>

            <p className="text-[#A89070] flex items-center gap-2 flex-wrap">
              <span className="text-parchment/80">{data?.assessmentTitle || '—'}</span>
              <span className="text-[#8B6914]">—</span>
              <span className="italic text-[#A89070]">{data?.assessmentQuestion || '—'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-[2px] border border-[#8B6914] bg-[#2C1810] text-parchment hover:border-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Assessment
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-[2px] border border-[#8B6914]/50 bg-[#2C1810]/60 text-[#A89070] cursor-not-allowed"
              disabled
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              type="button"
              onClick={onOpenNotes}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-[2px] bg-gold text-primary-foreground border border-gold hover:brightness-105 transition-colors"
            >
              <StickyNote className="w-4 h-4" />
              Educator Notes
            </button>
          </div>
        </div>
      </div>

      <MetaBar data={data} />
    </header>
  );
}

function MetaBar({ data }: { data: AnalyticsData | null }) {
  const meta = data?.meta;

  const metaItems = [
    { label: 'Prompts', value: meta?.promptCount },
    { label: 'Tokens in', value: meta?.tokensIn?.toLocaleString() },
    { label: 'Tokens out', value: meta?.tokensOut?.toLocaleString() },
    { label: 'Active time', value: meta ? `${meta.activeTimeMinutes} min` : null },
    { label: 'Revision cycles', value: meta?.revisionCycles },
    { label: 'Confidence', value: meta?.confidence },
  ];

  return (
    <div className="bg-[#2C1810]/80 border-t border-[#8B6914]/30">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-6 overflow-x-auto">
          {metaItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-[10px] text-[#A89070] uppercase tracking-wide">
                {item.label}:
              </span>
              <span className="text-sm font-medium text-parchment">
                {item.value ?? '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
