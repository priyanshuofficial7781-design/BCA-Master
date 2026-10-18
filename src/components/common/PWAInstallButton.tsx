import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Check, Smartphone } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'badge' | 'settings';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'badge',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already installed and running standalone, do not display install trigger
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
          <Check size={14} />
          <span>PWA App Installed</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Ambient guide for desktop Chrome / Edge
      alert?.('To install, click the install icon (desktop computer with down arrow) in your browser address bar.');
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable || isIOS) {
    return (
      <>
        {variant === 'header' ? (
          <button
            onClick={handleInstallClick}
            aria-label="Install BCA Career Planner as an app"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600/30 hover:bg-violet-600/40 border border-violet-500/40 text-violet-200 text-xs font-semibold shadow-sm transition-all active:scale-95 ${className}`}
          >
            <Download size={13} className="text-violet-300 animate-bounce" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        ) : variant === 'settings' ? (
          <button
            onClick={handleInstallClick}
            className={`flex items-center justify-between w-full p-3 rounded-2xl bg-[#1C182A] hover:bg-[#231E35] border border-violet-500/20 text-white text-xs font-medium transition-all ${className}`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center">
                <Smartphone size={16} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Install as Web App</div>
                <div className="text-[11px] text-[#9E99AF]">Offline caching & home screen shortcut</div>
              </div>
            </div>
            <div className="px-3 py-1 rounded-lg bg-violet-600 text-white text-xs font-bold shadow-md">
              Install
            </div>
          </button>
        ) : (
          <button
            onClick={handleInstallClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-900/30 transition-all active:scale-95 ${className}`}
          >
            <Download size={13} />
            <span>Install App</span>
          </button>
        )}

        {/* Guided modal for iOS Safari */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl bg-[#161324] border border-violet-500/30 p-6 shadow-2xl relative text-white">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
              >
                <X size={16} />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center mb-4">
                <Smartphone size={24} />
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">Install on iPhone / iPad</h3>
              <p className="text-xs text-[#AAA5B6] mt-1">
                Run BCA Career Planner in full-screen standalone mode with offline access:
              </p>

              <div className="mt-4 space-y-3 bg-[#0E0C17] p-4 rounded-2xl border border-white/5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    1
                  </div>
                  <div className="text-xs text-white/90">
                    Tap the <strong className="text-violet-300 inline-flex items-center gap-1"><Share2 size={12} /> Share</strong> button in your Safari navigation bar.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    2
                  </div>
                  <div className="text-xs text-white/90">
                    Scroll down and tap <strong className="text-violet-300 inline-flex items-center gap-1"><PlusSquare size={12} /> Add to Home Screen</strong>.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-lg shadow-violet-900/40"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
