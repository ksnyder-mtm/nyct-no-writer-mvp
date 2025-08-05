import React, { useState } from 'react';
import { Copy, Download, CheckCircle, Clock, FileText, Mail } from 'lucide-react';
import { GeneratedOutput } from '../App';

interface OutputPanelProps {
  output: GeneratedOutput;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ output }) => {
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [type]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [type]: false });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadAsText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatGenerationTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header with generation info */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Generated Rationale</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Generated in {formatGenerationTime(output.generation_time_ms)}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8 px-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('internal')}
            className={`
              py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap
              ${activeTab === 'internal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Internal Rationale</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('external')}
            className={`
              py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap
              ${activeTab === 'external'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>External Reply</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'internal' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Audience:</span> NYCT staff & board
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(output.internal_rationale, 'internal')}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {copiedStates.internal ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => downloadAsText(output.internal_rationale, 'internal-rationale.txt')}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-md p-4 border">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans leading-relaxed">
                  {output.internal_rationale}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Audience:</span> Nonprofit applicant
                <span className="ml-4 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                  Draft – review before sending
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(output.external_reply, 'external')}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {copiedStates.external ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => downloadAsText(output.external_reply, 'external-reply.txt')}
                  className="inline-flex items-center space-x-1 px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="prose max-w-none">
              <div className="bg-blue-50 rounded-md p-4 border border-blue-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans leading-relaxed">
                  {output.external_reply}
                </pre>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <strong>⚠️ Important:</strong> This is a draft response. Please review and edit as needed before sending to the applicant. Consider adding any specific feedback or suggestions that may be helpful for their future applications.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;