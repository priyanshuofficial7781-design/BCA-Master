import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Maximize2,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  Move,
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export const FloatingPiPPlayer: React.FC = () => {
  const { videoState, closeVideo, setPiP, setActiveTab } = useApp();
  const [isMuted, setIsMuted] = useState(false);

  // Only show if there's an active video and PiP mode is enabled
  if (!videoState.videoId || !videoState.isPiP) {
    return null;
  }

  const handleExpandToTheater = () => {
    soundEffects.playClick();
    setPiP(false);
    setActiveTab('video-lectures');
  };

  const handleClose = () => {
    soundEffects.playClick();
    closeVideo();
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[320px] sm:w-[380px] rounded-2xl bg-[#0F0D1E]/95 border border-[#00F0FF]/40 shadow-[0_15px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(0,240,255,0.25)] backdrop-blur-xl overflow-hidden animate-slideUp transition-all select-none"
      role="region"
      aria-label="Floating Video Player"
    >
      {/* Top Drag & Control Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-[#17142E] to-[#121A30] border-b border-white/10 text-white">
        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
          <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse shrink-0" />
          <p className="text-xs font-bold truncate text-white" title={videoState.title}>
            {videoState.title || 'BCA Video Lecture'}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleExpandToTheater}
            className="p-1.5 rounded-lg text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-colors"
            title="Expand to Full Video Lectures Theater"
          >
            <Maximize2 size={14} />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-500/20 transition-colors"
            title="Close Video"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Responsive Video Container */}
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoState.videoId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
          title={videoState.title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Mini Footer Strip */}
      <div className="px-3 py-1.5 bg-[#090714] border-t border-white/5 flex items-center justify-between text-[11px] text-[#AAA9C6]">
        <span className="truncate max-w-[200px] text-purple-300">
          {videoState.channel || 'University Lecture Series'}
        </span>
        <button
          type="button"
          onClick={handleExpandToTheater}
          className="text-[#00F0FF] hover:underline font-medium text-[10px] flex items-center gap-1"
        >
          <span>Open Notes</span>
          <ExternalLink size={10} />
        </button>
      </div>
    </div>
  );
};
