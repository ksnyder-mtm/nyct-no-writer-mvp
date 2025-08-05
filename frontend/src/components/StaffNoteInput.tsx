import React from 'react';
import { AlertCircle } from 'lucide-react';

interface StaffNoteInputProps {
  value: string;
  onChange: (value: string) => void;
}

const StaffNoteInput: React.FC<StaffNoteInputProps> = ({ value, onChange }) => {
  const maxLength = 280;
  const remainingChars = maxLength - value.length;
  const isNearLimit = remainingChars <= 20;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Briefly explain why you're declining this proposal. Your insights will help generate professional rationales..."
          className={`
            w-full rounded-lg border px-4 py-3 text-sm placeholder-slate-400 font-medium
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            resize-none transition-all duration-200 backdrop-blur-sm
            ${isOverLimit 
              ? 'border-error-300 bg-error-50/50 text-error-900' 
              : value.trim() 
                ? 'border-success-300 bg-success-50/30 text-slate-900' 
                : 'border-slate-300 bg-white/80 text-slate-900 hover:border-slate-400'
            }
          `}
          rows={4}
          maxLength={maxLength + 50} // Allow slight overage for better UX
        />
        
        {/* Character count indicator in textarea */}
        <div className="absolute bottom-3 right-3 text-xs font-medium">
          <span className={`
            px-2 py-1 rounded-full
            ${isOverLimit 
              ? 'bg-error-100 text-error-700' 
              : isNearLimit 
                ? 'bg-warning-100 text-warning-700' 
                : 'bg-slate-100 text-slate-500'
            }
          `}>
            {remainingChars}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isOverLimit && (
            <div className="flex items-center space-x-2 text-error-600 bg-error-50 px-3 py-1 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Character limit exceeded</span>
            </div>
          )}
          {value.trim() && !isOverLimit && (
            <div className="flex items-center space-x-2 text-success-600 bg-success-50 px-3 py-1 rounded-lg">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm font-medium">Ready to generate</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-primary-50/50 to-accent-50/50 border border-primary-100 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
            <div className="w-4 h-4 bg-primary-500 rounded-full"></div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Writing Tips for Better Results</h4>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-start">
                <div className="w-1 h-1 bg-primary-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span>Be specific about why this doesn't align with NYCT's priorities</span>
              </li>
              <li className="flex items-start">
                <div className="w-1 h-1 bg-primary-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span>Mention alternative funding sources if applicable</span>
              </li>
              <li className="flex items-start">
                <div className="w-1 h-1 bg-primary-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span>Note any organizational or project concerns</span>
              </li>
              <li className="flex items-start">
                <div className="w-1 h-1 bg-primary-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span>Keep it concise - the AI will expand your insights professionally</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffNoteInput;