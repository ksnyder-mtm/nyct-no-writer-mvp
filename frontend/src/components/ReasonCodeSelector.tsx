import React, { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { ReasonCode } from '../App';
import { API_URL } from '../config';

interface ReasonCodeSelectorProps {
  selectedCode: string;
  onCodeSelect: (code: string) => void;
}

const ReasonCodeSelector: React.FC<ReasonCodeSelectorProps> = ({ selectedCode, onCodeSelect }) => {
  const [reasonCodes, setReasonCodes] = useState<ReasonCode[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReasonCodes();
  }, []);

  const fetchReasonCodes = async () => {
    try {
      const response = await fetch(`${API_URL}/reason-codes`);
      if (response.ok) {
        const codes = await response.json();
        setReasonCodes(codes);
      }
    } catch (error) {
      console.error('Failed to fetch reason codes:', error);
      // Fallback to hardcoded codes
      setReasonCodes([
        { value: "General Operating Support", label: "General Operating Support" },
        { value: "Endowment", label: "Endowment" },
        { value: "Capital", label: "Capital" },
        { value: "Deficit Financing", label: "Deficit Financing" },
        { value: "Unapproved Program Category", label: "Unapproved Program Category" },
        { value: "Outside Approved Guidelines", label: "Outside Approved Guidelines" },
        { value: "Other Projects Higher Merit", label: "Other Projects Higher Merit" },
        { value: "Other Qualitative (Replace Govt. Funds, Poor Design, Capability Problems, Duplicative Effort, Budget Exhausted)", label: "Other Qualitative" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectedReasonCode = reasonCodes.find(code => code.value === selectedCode);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-slate-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select decline reason"
        className={`
          relative w-full cursor-pointer rounded-lg border bg-white/80 backdrop-blur-sm py-3.5 pl-4 pr-12 text-left shadow-card transition-all duration-200
          focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 hover:shadow-elevated hover:bg-white
          ${selectedCode ? 'border-slate-300' : 'border-warning-300 bg-warning-50/50'}
        `}
      >
        <span className="block truncate">
          {selectedReasonCode ? (
            <span className="text-slate-900 font-medium">
              {selectedReasonCode.label}
            </span>
          ) : (
            <span className="text-slate-500 font-medium">Select a decline reason...</span>
          )}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-all duration-200 ${
              isOpen ? 'rotate-180 text-primary-500' : ''
            }`}
          />
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-full rounded-xl bg-white/95 backdrop-blur-sm shadow-elevated border border-slate-200 animate-slide-up">
            <ul 
              role="listbox" 
              aria-label="Decline reason options"
              className="max-h-64 overflow-auto rounded-xl py-2 text-base focus:outline-none"
            >
            {reasonCodes.map((code) => (
              <li
                key={code.value}
                role="option"
                aria-selected={selectedCode === code.value}
                tabIndex={0}
                className={`
                  relative cursor-pointer select-none py-3 pl-4 pr-12 mx-2 rounded-lg transition-all duration-150
                  hover:bg-primary-50 hover:text-primary-900 focus:bg-primary-50 focus:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                  ${selectedCode === code.value 
                    ? 'bg-primary-100 text-primary-900 font-semibold' 
                    : 'text-slate-900 hover:bg-slate-50'
                  }
                `}
                onClick={() => {
                  onCodeSelect(code.value);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCodeSelect(code.value);
                    setIsOpen(false);
                  } else if (e.key === 'Escape') {
                    setIsOpen(false);
                  }
                }}
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <span className="block text-sm leading-relaxed">
                      {code.label}
                    </span>
                  </div>
                  {selectedCode === code.value && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <div className="bg-primary-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ReasonCodeSelector;