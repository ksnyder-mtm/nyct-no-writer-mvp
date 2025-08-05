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
    <div className="space-y-2">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Briefly explain why you're declining this proposal (your two-sentence summary that will inform the AI rationale)..."
          className={`
            w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            resize-none transition-colors
            ${isOverLimit 
              ? 'border-red-300 bg-red-50' 
              : value.trim() 
                ? 'border-green-300 bg-white' 
                : 'border-gray-300 bg-white'
            }
          `}
          rows={4}
          maxLength={maxLength + 50} // Allow slight overage for better UX
        />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          {isOverLimit && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>Character limit exceeded</span>
            </div>
          )}
          {value.trim() && !isOverLimit && (
            <span className="text-green-600">✓ Ready</span>
          )}
        </div>
        
        <span className={`
          font-medium
          ${isOverLimit 
            ? 'text-red-600' 
            : isNearLimit 
              ? 'text-yellow-600' 
              : 'text-gray-500'
          }
        `}>
          {remainingChars} characters remaining
        </span>
      </div>
      
      <div className="text-xs text-gray-500">
        <p className="mb-1">💡 <strong>Tips for effective staff notes:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Be specific about why this doesn't fit NYCT's priorities</li>
          <li>Mention any alternative funding suggestions if applicable</li>
          <li>Note any organizational capacity concerns</li>
          <li>Keep it concise - the AI will expand your points</li>
        </ul>
      </div>
    </div>
  );
};

export default StaffNoteInput;