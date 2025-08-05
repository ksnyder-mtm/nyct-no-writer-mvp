import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ReasonCodeSelector from './components/ReasonCodeSelector';
import StaffNoteInput from './components/StaffNoteInput';
import GenerateButton from './components/GenerateButton';
import OutputPanel from './components/OutputPanel';
import MetricsPanel from './components/MetricsPanel';
import { Upload, FileText, MessageSquare, Zap, BarChart3 } from 'lucide-react';
import { API_URL } from './config';

export interface ReasonCode {
  value: string;
  label: string;
}

export interface GeneratedOutput {
  internal_rationale: string;
  external_reply: string;
  generation_time_ms: number;
}

export interface UploadedFile {
  proposal_hash: string;
  text_content: string;
  filename: string;
  size: number;
}

function App() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedReasonCode, setSelectedReasonCode] = useState<string>('');
  const [staffNote, setStaffNote] = useState<string>('');
  const [generatedOutput, setGeneratedOutput] = useState<GeneratedOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showMetrics, setShowMetrics] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!uploadedFile || !selectedReasonCode || !staffNote.trim()) {
      alert('Please complete all fields before generating.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason_code: selectedReasonCode,
          staff_note: staffNote,
          proposal_text: uploadedFile.text_content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate rationale');
      }

      const output: GeneratedOutput = await response.json();
      setGeneratedOutput(output);
    } catch (error) {
      console.error('Error generating rationale:', error);
      alert('Error generating rationale. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setUploadedFile(null);
    setSelectedReasonCode('');
    setStaffNote('');
    setGeneratedOutput(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-600 to-accent-500 opacity-20 blur"></div>
                <div className="relative bg-primary-500 p-2 rounded-lg">
                  <FileText className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  NYCT No-Writer
                </h1>
                <p className="text-sm text-slate-600 font-medium">
                  Intelligent Decline Rationale Generator
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg hover:bg-white hover:border-slate-300 hover:shadow-card transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showMetrics && (
          <div className="mb-8 animate-slide-up">
            <MetricsPanel />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Step indicator for better UX flow */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Step-by-Step Process
                </span>
              </div>
            </div>

            {/* Step 1: Upload */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-card border border-slate-200/60 p-6 hover:shadow-elevated transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold mr-3">
                  1
                </div>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-primary-600" />
                  Upload Proposal
                </h2>
              </div>
              <FileUpload
                onFileUploaded={setUploadedFile}
                uploadedFile={uploadedFile}
              />
            </div>

            {/* Step 2: Reason */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-card border border-slate-200/60 p-6 hover:shadow-elevated transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold mr-3">
                  2
                </div>
                <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary-600" />
                  Select Decline Reason
                </h2>
              </div>
              <ReasonCodeSelector
                selectedCode={selectedReasonCode}
                onCodeSelect={setSelectedReasonCode}
              />
            </div>

            {/* Step 3: Staff Note */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-card border border-slate-200/60 p-6 hover:shadow-elevated transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold mr-3">
                  3
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add Staff Note
                </h2>
              </div>
              <StaffNoteInput
                value={staffNote}
                onChange={setStaffNote}
              />
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <GenerateButton
                onClick={handleGenerate}
                isGenerating={isGenerating}
                disabled={!uploadedFile || !selectedReasonCode || !staffNote.trim()}
              />
            </div>

            {generatedOutput && (
              <button
                onClick={resetForm}
                className="w-full px-4 py-3 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg hover:bg-white hover:border-slate-300 hover:shadow-card transition-all duration-200"
              >
                Start New Decline Process
              </button>
            )}
          </div>

          {/* Output Panel */}
          <div className="space-y-6">
            {generatedOutput ? (
              <div className="animate-slide-up">
                <OutputPanel output={generatedOutput} />
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-card border border-slate-200/60 p-8">
                <div className="text-center py-12">
                  <div className="relative mb-6">
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary-600/20 to-accent-500/20 blur"></div>
                    <div className="relative bg-gradient-to-r from-primary-100 to-accent-100 p-4 rounded-full w-fit mx-auto">
                      <Zap className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Ready to Generate
                  </h3>
                  <p className="text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Complete all three steps on the left and click "Generate" to create professional decline rationales in seconds.
                  </p>
                  <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mr-2"></div>
                      <span>AI-powered</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-accent-400 rounded-full mr-2"></div>
                      <span>Professional tone</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;