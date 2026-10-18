import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { Home, Calendar, BookOpen, Compass, MoreHorizontal, Plus } from 'lucide-react';

interface BottomNavProps {
  onOpenMoreMenu: () => void;
  onOpenAddTask?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMoreMenu, onOpenAddTask }) => {
  const { activeTab, setActiveTab } = useApp();

  const isMoreActive = [
    'specializations',
    'projects',
    'placement',
    'analytics',
    'settings',
  ].includes(activeTab);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0A17]/95 backdrop-blur-xl border-t border-purple-500/15 px-3 py-2 pb-safe shadow-[0_-5px_25px_rgba(0,0,0,0.7)]"
    >
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {/* Home */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
            activeTab === 'home'
              ? 'text-white font-medium scale-105'
              : 'text-[#9E99AF] hover:text-purple-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              activeTab === 'home'
                ? 'bg-purple-500/20 text-[#A970FF] shadow-[0_0_12px_rgba(169,112,255,0.4)]'
                : ''
            }`}
          >
            <Home size={20} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* Planner */}
        <button
          type="button"
          onClick={() => setActiveTab('planner')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
            activeTab === 'planner'
              ? 'text-white font-medium scale-105'
              : 'text-[#9E99AF] hover:text-purple-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              activeTab === 'planner'
                ? 'bg-purple-500/20 text-[#A970FF] shadow-[0_0_12px_rgba(169,112,255,0.4)]'
                : ''
            }`}
          >
            <Calendar size={20} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Planner</span>
        </button>

        {/* Elevated Center Glowing + Button from reference Screenshot 4 */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={onOpenAddTask}
            className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#A970FF] to-[#657BFF] text-white flex items-center justify-center shadow-[0_0_20px_rgba(169,112,255,0.6)] border-2 border-[#0C0A17] hover:scale-105 active:scale-95 transition-all"
            aria-label="Add New Task"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
          <span className="text-[10px] mt-1 text-purple-300 font-semibold tracking-tight">Add</span>
        </div>

        {/* Learn */}
        <button
          type="button"
          onClick={() => setActiveTab('learn')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
            activeTab === 'learn'
              ? 'text-white font-medium scale-105'
              : 'text-[#9E99AF] hover:text-purple-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              activeTab === 'learn'
                ? 'bg-purple-500/20 text-[#A970FF] shadow-[0_0_12px_rgba(169,112,255,0.4)]'
                : ''
            }`}
          >
            <BookOpen size={20} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Learn</span>
        </button>

        {/* More */}
        <button
          type="button"
          onClick={onOpenMoreMenu}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
            isMoreActive
              ? 'text-white font-medium scale-105'
              : 'text-[#9E99AF] hover:text-purple-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              isMoreActive
                ? 'bg-purple-500/20 text-[#A970FF] shadow-[0_0_12px_rgba(169,112,255,0.4)]'
                : ''
            }`}
          >
            <MoreHorizontal size={20} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
