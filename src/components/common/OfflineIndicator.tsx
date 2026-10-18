import React, { useEffect, useState } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export const OfflineIndicator: React.FC = () => {
  const {
    isOnline,
    isSyncing,
    syncState,
    pendingCount,
    lastSyncTime,
    triggerManualSync,
    isBackgroundSyncSupported,
  } = useOnlineStatus();

  const [showReconnectedToast, setShowReconnectedToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setShowReconnectedToast(false);
    } else if (wasOffline && isOnline) {
      soundEffects.playSuccess();
      setShowReconnectedToast(true);
      const timer = setTimeout(() => {
        setShowReconnectedToast(false);
        setWasOffline(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // When offline
  if (!isOnline) {
    return (
      <aside
        aria-label="Connectivity Status"
        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#181328]/95 border border-amber-500/50 text-amber-300 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-2xl text-xs font-semibold animate-slideUp select-none"
      >
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <WifiOff size={15} className="text-amber-400 shrink-0" />
        <div className="flex items-center gap-1.5">
          <span>Offline Mode</span>
          <span className="text-amber-200/80 font-normal">
            {pendingCount > 0
              ? `• ${pendingCount} change${pendingCount > 1 ? 's' : ''} queued`
              : '• Local cache active'}
          </span>
        </div>
        <span className="text-[10px] text-amber-200/70 border-l border-amber-500/30 pl-2.5 hidden sm:inline-block">
          SW Background Sync active
        </span>
      </aside>
    );
  }

  // When syncing or just reconnected
  if (showReconnectedToast || isSyncing || syncState === 'synced') {
    return (
      <aside
        aria-label="Connectivity Status"
        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#0D1B1B]/95 border border-emerald-500/50 text-emerald-300 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.25)] backdrop-blur-2xl text-xs font-semibold animate-slideUp select-none"
      >
        {isSyncing ? (
          <>
            <RefreshCw size={14} className="text-emerald-400 animate-spin shrink-0" />
            <div className="flex items-center gap-1.5">
              <span>Service Worker Syncing...</span>
              <span className="text-[10px] text-emerald-400/80 font-mono">
                {pendingCount > 0 ? `(${pendingCount} pending)` : 'reconciling state'}
              </span>
            </div>
          </>
        ) : (
          <>
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <div className="flex items-center gap-1.5">
              <span>Online & Synchronized</span>
              <span className="text-[10px] text-emerald-400/80 font-mono hidden sm:inline">
                {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                triggerManualSync();
              }}
              className="ml-1 p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-300 transition-colors cursor-pointer"
              title="Force re-sync"
            >
              <RefreshCw size={12} />
            </button>
          </>
        )}
      </aside>
    );
  }

  return null;
};
