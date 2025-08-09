import React, { useState } from 'react';
import { Copy, Download, CheckCircle, Clock, FileText, Mail, Star, ThumbsUp } from 'lucide-react';
import type { GeneratedOutput } from '../App';

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
    <div className="bg-white rounded-lg shadow-card border border-gray-200">
      {/* Header with generation info */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-accent-100 to-primary-100 p-2 rounded-lg">
              <div className="w-5 h-5 bg-accent-500 rounded-full"></div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-navy-500">Generated Rationale</h2>
              <p className="text-sm text-gray-600">Professional decline communication ready</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Generated in {formatGenerationTime(output.generation_time_ms)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm bg-gradient-to-r from-accent-50 to-primary-50 text-accent-700 px-3 py-2 rounded-lg border border-accent-200">
              <ThumbsUp className="h-4 w-4" />
              <span className="font-medium">High Quality</span>
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-3 w-3 fill-current text-accent-500" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('internal')}
            className={`
              relative py-4 px-4 font-medium text-sm whitespace-nowrap rounded-t-lg transition-all duration-200
              ${activeTab === 'internal'
                ? 'text-primary-700 bg-primary-50 border-b-2 border-primary-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Internal Rationale</span>
            </div>
            {activeTab === 'internal' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('external')}
            className={`
              relative py-4 px-4 font-medium text-sm whitespace-nowrap rounded-t-lg transition-all duration-200
              ${activeTab === 'external'
                ? 'text-primary-700 bg-primary-50 border-b-2 border-primary-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>External Reply</span>
            </div>
            {activeTab === 'external' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"></div>
            )}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'internal' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-softblue-100 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-softblue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy-500">Internal Use</div>
                  <div className="text-xs text-gray-600">For NYCT staff & board review</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(output.internal_rationale, 'internal')}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-navy-500 bg-softblue-100 hover:bg-softblue-200 rounded-md transition-all duration-200"
                >
                  {copiedStates.internal ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-success-600" />
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
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-navy-500 bg-softblue-100 hover:bg-softblue-200 rounded-md transition-all duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="prose max-w-none">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-6 border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans leading-relaxed">
                  {output.internal_rationale}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Mail className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy-500 flex items-center space-x-2">
                    <span>External Communication</span>
                    <span className="px-2 py-0.5 bg-warning-100 text-warning-800 rounded-full text-xs font-medium">
                      Review Required
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">For nonprofit applicant</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(output.external_reply, 'external')}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-navy-500 bg-softblue-100 hover:bg-softblue-200 rounded-md transition-all duration-200"
                >
                  {copiedStates.external ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-success-600" />
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
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-navy-500 bg-softblue-100 hover:bg-softblue-200 rounded-md transition-all duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="prose max-w-none">
              <div className="bg-gradient-to-br from-primary-50 to-accent-50/50 rounded-lg p-6 border border-primary-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans leading-relaxed">
                  {output.external_reply}
                </pre>
              </div>
            </div>
            <div className="bg-gradient-to-r from-warning-50 to-warning-100/50 p-4 rounded-lg border border-warning-200">
              <div className="flex items-start space-x-3">
                <div className="bg-warning-100 p-1 rounded-full flex-shrink-0 mt-0.5">
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-warning-900 mb-1">Review Before Sending</h4>
                  <p className="text-xs text-warning-800 leading-relaxed">
                    This is a draft response generated by AI. Please review and personalize as needed before sending to the applicant. Consider adding specific feedback or suggestions that may be helpful for their future applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;