import { Clock, Maximize2, Minimize2, Plus, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import type { ConnectionStatus } from '../types/kiosk';

interface KioskHeaderProps {
  connectionStatus: ConnectionStatus;
  idleSecondsLeft: number | null;
  isRestocking: boolean;
  isFullscreen: boolean;
  onRestockAll: () => void;
  onToggleFullscreen: () => void;
}

export function KioskHeader({
  connectionStatus,
  idleSecondsLeft,
  isRestocking,
  isFullscreen,
  onRestockAll,
  onToggleFullscreen,
}: KioskHeaderProps) {
  const showIdleWarning = idleSecondsLeft !== null && idleSecondsLeft <= 15 && idleSecondsLeft > 0;

  return (
    <header className="shrink-0 bg-white border-b border-slate-200 px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 shadow-sm z-10">
      {/* Left: Brand Logo & Live Connection Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Plus className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900 leading-none truncate">
              CareVend PH
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : connectionStatus === 'loading'
                    ? 'bg-slate-100 text-slate-600 border border-slate-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {connectionStatus === 'connected' ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span>Supabase Connected</span>
                </>
              ) : connectionStatus === 'loading' ? (
                <span>Syncing...</span>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600" />
                  <span>Offline Mode</span>
                </>
              )}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 truncate">
            24/7 Health &amp; Hygiene Express
          </p>
        </div>
      </div>

      {/* Right: Idle Warning Pill, Restock All & Fullscreen Toggle */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {showIdleWarning && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm font-bold animate-pulse"
          >
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-mono">Reset in {idleSecondsLeft}s</span>
          </div>
        )}

        <button
          type="button"
          onClick={onRestockAll}
          disabled={isRestocking}
          className="min-h-[48px] min-w-[48px] px-3 sm:px-4 rounded-xl bg-teal-50 hover:bg-teal-100 active:scale-95 transition-transform duration-100 border border-teal-300 text-teal-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
          title="Restock all 9 vending slots to default quantities"
        >
          <RefreshCw className={`w-4 h-4 shrink-0 ${isRestocking ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isRestocking ? 'Restocking...' : 'Restock All'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="min-h-[48px] min-w-[48px] px-3 sm:px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-transform duration-100 border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5"
          title={isFullscreen ? 'Exit Fullscreen Kiosk Mode' : 'Enter Fullscreen Kiosk Mode'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 shrink-0" />
          ) : (
            <Maximize2 className="w-4 h-4 shrink-0" />
          )}
          <span className="hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>
      </div>
    </header>
  );
}
