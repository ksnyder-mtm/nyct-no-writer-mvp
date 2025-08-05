import React, { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { ReasonCode } from '../App';

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
      const response = await fetch('http://localhost:8000/reason-codes');
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
        <div className="h-12 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-full cursor-pointer rounded-md border bg-white py-3 pl-3 pr-10 text-left shadow-sm
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
          ${selectedCode ? 'border-gray-300' : 'border-red-300'}
        `}
      >
        <span className="block truncate">
          {selectedReasonCode ? (
            <span className="text-gray-900">
              {selectedReasonCode.label}
            </span>
          ) : (
            <span className="text-gray-500">Select a decline reason...</span>
          )}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
            {reasonCodes.map((code) => (
              <li
                key={code.value}
                className={`
                  relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-blue-50
                  ${selectedCode === code.value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}
                `}
                onClick={() => {
                  onCodeSelect(code.value);
                  setIsOpen(false);
                }}
              >
                <span className={`block truncate ${selectedCode === code.value ? 'font-semibold' : 'font-normal'}`}>
                  {code.label}
                </span>
                {selectedCode === code.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                    <Check className="h-5 w-5" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReasonCodeSelector;