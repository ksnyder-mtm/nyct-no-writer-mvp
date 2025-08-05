import React, { useState } from 'react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                NYCT No-Writer MVP
              </h1>
            </div>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Metrics</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showMetrics && (
          <div className="mb-8">
            <MetricsPanel />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-blue-600" />
                Upload Proposal
              </h2>
              <FileUpload
                onFileUploaded={setUploadedFile}
                uploadedFile={uploadedFile}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Decline Reason
              </h2>
              <ReasonCodeSelector
                selectedCode={selectedReasonCode}
                onCodeSelect={setSelectedReasonCode}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Staff Note
              </h2>
              <StaffNoteInput
                value={staffNote}
                onChange={setStaffNote}
              />
            </div>

            <GenerateButton
              onClick={handleGenerate}
              isGenerating={isGenerating}
              disabled={!uploadedFile || !selectedReasonCode || !staffNote.trim()}
            />

            {generatedOutput && (
              <button
                onClick={resetForm}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Start New Decline
              </button>
            )}
          </div>

          {/* Output Panel */}
          <div className="space-y-6">
            {generatedOutput ? (
              <OutputPanel output={generatedOutput} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-gray-500">
                    Complete the form on the left and click "Generate" to create your decline rationale.
                  </p>
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