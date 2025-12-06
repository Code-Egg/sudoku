import React from 'react';
import { X, Share2, Download } from 'lucide-react';
import { GeneratedReward } from '../types';

interface RewardModalProps {
  reward: GeneratedReward | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

export const RewardModal: React.FC<RewardModalProps> = ({ reward, isOpen, onClose, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-slate-100">
          <h2 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <span>🎉</span> 恭喜過關！
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center">
          {isLoading ? (
            <div className="space-y-4 w-full">
              <div className="w-full aspect-square bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
                 <span className="text-slate-400 font-medium">正在召喚寶可夢...</span>
              </div>
              <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto animate-pulse"></div>
            </div>
          ) : reward ? (
            <div className="space-y-4 animate-in zoom-in duration-300">
              <div className="relative group">
                <img 
                  src={reward.imageUrl} 
                  alt="Reward" 
                  className="w-full aspect-square object-cover rounded-xl shadow-lg border-4 border-yellow-300"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10"></div>
              </div>
              
              <div>
                <p className="text-xl font-bold text-slate-800">{reward.description}</p>
                <p className="text-sm text-slate-500 mt-1">You got a new partner！</p>
              </div>

              <div className="flex gap-2 justify-center mt-4">
                 <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                    <Download size={16} /> Save
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
                    <Share2 size={16} /> Share
                 </button>
              </div>
            </div>
          ) : (
            <div className="text-rose-500">
              Can not load!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};