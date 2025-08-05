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
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add context about why this proposal is being declined. Your notes will help personalize the AI-generated response..."
          aria-label="Staff note input for decline rationale"
          aria-describedby="char-count-info"
          aria-invalid={isOverLimit}
          className={`
            w-full rounded-lg border px-4 py-3 text-sm placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            resize-none transition-all duration-200
            ${isOverLimit 
              ? 'border-red-300 bg-red-50 text-red-900' 
              : value.trim() 
                ? 'border-green-300 bg-green-50/50 text-slate-900' 
                : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400'
            }
          `}
          rows={4}
          maxLength={maxLength + 50}
        />
        
        <div id="char-count-info" className="absolute bottom-3 right-3 text-xs">
          <span className={`
            px-2 py-1 rounded-full
            ${isOverLimit 
              ? 'bg-red-100 text-red-700' 
              : isNearLimit 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-slate-100 text-slate-500'
            }
          `}>
            {remainingChars}
          </span>
        </div>
      </div>
      
      {isOverLimit && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Character limit exceeded</span>
        </div>
      )}
      
      {!value.trim() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-900 mb-2">💡 Writing Tips:</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Be specific about why this doesn't align with NYCT's priorities</li>
            <li>• Mention any organizational or project concerns</li>
            <li>• Keep it concise - the AI will expand your insights professionally</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default StaffNoteInput;