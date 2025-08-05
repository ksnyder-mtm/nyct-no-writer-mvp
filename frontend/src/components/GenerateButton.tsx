import React from 'react';
import { Zap, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isGenerating, disabled }) => {
  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className={`absolute -inset-1 rounded-xl transition-all duration-300 ${
        disabled || isGenerating 
          ? 'opacity-0' 
          : 'bg-gradient-to-r from-primary-600 to-accent-500 opacity-20 blur'
      }`}></div>
      
      <button
        onClick={onClick}
        disabled={disabled || isGenerating}
        className={`
          relative w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-lg font-semibold
          transition-all duration-200 transform backdrop-blur-sm
          ${disabled || isGenerating
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 hover:scale-[1.02] active:scale-[0.98] shadow-elevated hover:shadow-xl border border-primary-600'
          }
        `}
      >
        {isGenerating ? (
          <>
            <div className="relative">
              <Loader2 className="h-6 w-6 animate-spin" />
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
            <span>Generating Professional Rationale...</span>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="absolute -inset-1 bg-accent-400/30 rounded-full blur"></div>
              <div className="relative bg-accent-400/20 p-1 rounded-full">
                <Zap className="h-5 w-5" />
              </div>
            </div>
            <span>Generate Decline Rationale</span>
            <div className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              AI-Powered
            </div>
          </>
        )}
      </button>
      
      {/* Progress indicator when generating */}
      {isGenerating && (
        <div className="absolute -bottom-3 left-0 right-0">
          <div className="bg-slate-200 rounded-full h-1 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateButton;