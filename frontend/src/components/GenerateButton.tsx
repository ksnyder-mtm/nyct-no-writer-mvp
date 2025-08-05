import React from 'react';
import { Zap, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isGenerating, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={`
        w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg font-semibold
        transition-all duration-200 transform
        ${disabled || isGenerating
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow-md'
        }
      `}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Generating Professional Rationale...</span>
        </>
      ) : (
        <>
          <Zap className="h-5 w-5" />
          <span>Generate Decline Rationale</span>
        </>
      )}
    </button>
  );
};

export default GenerateButton;