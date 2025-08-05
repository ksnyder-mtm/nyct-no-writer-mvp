import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ReasonCodeSelector from './components/ReasonCodeSelector';
import StaffNoteInput from './components/StaffNoteInput';
import GenerateButton from './components/GenerateButton';
import OutputPanel from './components/OutputPanel';
import MetricsPanel from './components/MetricsPanel';
import { Upload, FileText, MessageSquare, Zap, BarChart3, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

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
      // Simulate API call delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock rationale based on inputs
      const mockOutput: GeneratedOutput = {
        internal_rationale: `${selectedReasonCode.toUpperCase()} DECLINE RATIONALE

Based on our comprehensive review of the submitted proposal, we have determined that this request does not align with our current funding priorities for this cycle. ${staffNote}

The proposal requests funding for activities that fall within the "${selectedReasonCode}" category, which is outside our approved guidelines for this funding round. While the organization demonstrates commitment to their mission and community impact, the specific program design and implementation approach do not meet our established criteria for strategic impact and long-term sustainability.

Our board has carefully considered this application alongside other proposals in this funding cycle. Given our limited resources and strategic priorities, we must focus on initiatives that directly align with our current funding framework and demonstrate the highest potential for measurable community impact.

We appreciate the time and effort invested in preparing this comprehensive submission and encourage the organization to consider revising their approach to better align with our funding guidelines for future opportunities.`,

        external_reply: `Dear Applicant,

Thank you for your proposal submission to The New York Community Trust. We genuinely appreciate your organization's dedication to serving the community and the considerable time you invested in preparing your application.

After careful review by our program team and board, we have determined that we will not be able to provide funding for this request at this time. This proposal falls under our "${selectedReasonCode.toLowerCase()}" category, which is not within our current funding priorities for this cycle.

We recognize the important work your organization does and encourage you to review our updated funding guidelines on our website. We invite you to consider applying for future opportunities that may better align with your organization's mission and our strategic priorities.

Thank you again for considering The New York Community Trust as a potential partner in your work.

Best regards,
NYCT Program Team`,

        generation_time_ms: 3000
      };

      setGeneratedOutput(mockOutput);
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

  // Calculate progress
  const progress = [
    uploadedFile ? 1 : 0,
    selectedReasonCode ? 1 : 0,
    staffNote.trim() ? 1 : 0,
    generatedOutput ? 1 : 0
  ].reduce((sum, val) => sum + val, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Modern Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-20 blur-lg"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  NYCT No-Writer
                </h1>
                <p className="text-slate-600 font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-1.5 text-amber-500" />
                  AI-Powered Proposal Review Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Progress</h3>
              <span className="text-sm font-medium text-slate-600">{progress}/4 steps completed</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(progress / 4) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: Upload, label: 'Upload', completed: !!uploadedFile },
                { icon: MessageSquare, label: 'Reason', completed: !!selectedReasonCode },
                { icon: FileText, label: 'Notes', completed: !!staffNote.trim() },
                { icon: Zap, label: 'Generate', completed: !!generatedOutput }
              ].map((step) => (
                <div key={step.label} className={`flex items-center space-x-2 p-3 rounded-xl transition-all duration-300 ${
                  step.completed ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                  <span className="font-medium text-sm">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showMetrics && (
          <div className="mb-8 animate-slide-up">
            <MetricsPanel />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100/50 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Sparkles className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">AI-Powered Decline Assistant</h2>
                  <p className="text-slate-600">Professional rationales in 30 seconds</p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Transform proposal reviews into professional decline communications with AI assistance. 
                Generate board-ready rationales and courteous applicant replies that maintain NYCT's 
                professional standards while saving hours of writing time.
              </p>
            </div>

            {/* Step 1: Upload */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 transition-colors duration-300 ${
                  uploadedFile ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {uploadedFile ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-lg font-bold">1</span>}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center">
                    <Upload className="h-6 w-6 mr-2 text-blue-600" />
                    Upload Proposal Document
                  </h3>
                  <p className="text-slate-600">PDF or Word documents up to 10MB</p>
                </div>
              </div>
              <FileUpload
                onFileUploaded={setUploadedFile}
                uploadedFile={uploadedFile}
              />
            </div>

            {/* Step 2: Reason */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 transition-colors duration-300 ${
                  selectedReasonCode ? 'bg-green-100 text-green-600' : 
                  uploadedFile ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {selectedReasonCode ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-lg font-bold">2</span>}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center">
                    <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
                    Select Decline Reason
                  </h3>
                  <p className="text-slate-600">Choose from 8 board-reportable NYCT decline codes</p>
                </div>
              </div>
              <ReasonCodeSelector
                selectedCode={selectedReasonCode}
                onCodeSelect={setSelectedReasonCode}
              />
            </div>

            {/* Step 3: Staff Note */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 transition-colors duration-300 ${
                  staffNote.trim() ? 'bg-green-100 text-green-600' : 
                  selectedReasonCode ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {staffNote.trim() ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-lg font-bold">3</span>}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Staff Context Notes</h3>
                  <p className="text-slate-600">Brief context to personalize the AI-generated rationale</p>
                </div>
              </div>
              <StaffNoteInput
                value={staffNote}
                onChange={setStaffNote}
              />
            </div>

            {/* Generate Button */}
            <div className="space-y-4">
              <GenerateButton
                onClick={handleGenerate}
                isGenerating={isGenerating}
                disabled={!uploadedFile || !selectedReasonCode || !staffNote.trim()}
              />

              {generatedOutput && (
                <button
                  onClick={resetForm}
                  className="w-full px-6 py-3 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-200"
                >
                  <ArrowRight className="h-4 w-4 mr-2 inline" />
                  Start New Decline Process
                </button>
              )}
            </div>
          </div>

          {/* Output Panel */}
          <div className="space-y-6">
            {generatedOutput ? (
              <OutputPanel output={generatedOutput} />
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-12">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 blur-lg"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center">
                      <Zap className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Ready to Generate Professional Rationales
                  </h3>
                  <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
                    Complete the three steps on the left, then click "Generate" to create both 
                    internal board documentation and external applicant communication.
                  </p>
                  <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-amber-800 text-sm font-medium">
                      💡 Pro tip: Be specific in your staff notes for more personalized results
                    </p>
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