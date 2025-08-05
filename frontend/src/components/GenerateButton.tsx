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
        w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg text-lg font-semibold
        transition-all duration-200 transform
        ${disabled || isGenerating
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
        }
      `}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Generating Rationale...</span>
        </>
      ) : (
        <>
          <Zap className="h-6 w-6" />
          <span>Generate Decline Rationale</span>
        </>
      )}
    </button>
  );
};

export default GenerateButton;