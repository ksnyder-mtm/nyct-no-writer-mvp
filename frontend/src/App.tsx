import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ReasonCodeSelector from './components/ReasonCodeSelector';
import StaffNoteInput from './components/StaffNoteInput';
import GenerateButton from './components/GenerateButton';
import OutputPanel from './components/OutputPanel';
import MetricsPanel from './components/MetricsPanel';
import { Upload, FileText, MessageSquare, Zap, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';

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

  // Calculate current step based on completed fields
  const getProgressStep = () => {
    if (!uploadedFile) return 1;
    if (!selectedReasonCode) return 2;
    if (!staffNote.trim()) return 3;
    if (!generatedOutput) return 4;
    return 5;
  };

  const progressStep = getProgressStep();
  const steps = [
    { id: 1, title: 'Upload Document', icon: Upload, completed: !!uploadedFile },
    { id: 2, title: 'Select Reason', icon: MessageSquare, completed: !!selectedReasonCode },
    { id: 3, title: 'Add Notes', icon: FileText, completed: !!staffNote.trim() },
    { id: 4, title: 'Generate', icon: Zap, completed: !!generatedOutput }
  ];

  return (
    <div className="min-h-screen bg-bgwhite flex flex-col">
      {/* MTM Header */}
      <header className="bg-cream shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <img 
                src="/mtm-logo.png" 
                alt="Meet the Moment" 
                className="h-[60px] w-auto"
              />
              <div className="border-l-2 border-softblue-400 pl-4">
                <h1 className="text-2xl font-bold text-navy-500">NYCT No-Writer</h1>
                <p className="text-gray-600 text-sm">AI-Powered Proposal Review Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-navy-500 bg-softblue-100 rounded-md hover:bg-softblue-200 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow">
        {/* Step Progress Indicator */}
        <div className="mb-6 sm:mb-8" role="navigation" aria-label="Progress indicator">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Step {progressStep} of {steps.length}
            </h2>
            <span className="text-sm text-slate-600" aria-live="polite">
              {Math.round((steps.filter(s => s.completed).length / steps.length) * 100)}% Complete
            </span>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 mb-6 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div 
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 flex-shrink-0 ${
                    step.completed 
                      ? 'bg-accent-100 border-accent-500 text-accent-600'
                      : progressStep === step.id
                      ? 'bg-primary-100 border-primary-500 text-primary-600'
                      : 'bg-softblue-100 border-softblue-400 text-softblue-500'
                  }`}
                  role="progressbar"
                  aria-valuenow={step.completed ? 100 : progressStep === step.id ? 50 : 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${step.title} ${step.completed ? 'completed' : progressStep === step.id ? 'in progress' : 'not started'}`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-colors duration-200 min-w-4 ${
                    step.completed ? 'bg-accent-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-navy-500 mb-2">
              {progressStep <= 4 ? steps[progressStep - 1].title : 'Complete'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              {progressStep === 1 && 'Upload your proposal document to get started'}
              {progressStep === 2 && 'Select the reason for declining this proposal'}
              {progressStep === 3 && 'Add context notes to personalize the response'}
              {progressStep === 4 && 'Generate professional decline documentation'}
              {progressStep === 5 && 'Review and use your generated rationale'}
            </p>
          </div>
        </div>

        {showMetrics && (
          <div className="mb-8">
            <MetricsPanel />
          </div>
        )}

        {/* Single Column Content */}
        <div className="space-y-6 sm:space-y-8">
          {/* Step 1: Upload */}
          {progressStep >= 1 && (
            <section 
              className={`bg-white rounded-lg shadow-card border border-gray-200 p-4 sm:p-6 transition-all duration-300 ${
                progressStep === 1 ? 'ring-2 ring-primary-500 ring-opacity-20' : ''
              }`}
              aria-labelledby="upload-heading"
            >
              <div className="flex items-center mb-4">
                <Upload className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                <h3 id="upload-heading" className="text-base sm:text-lg font-semibold text-navy-500">Upload Proposal Document</h3>
                {uploadedFile && <CheckCircle2 className="h-5 w-5 text-accent-500 ml-auto flex-shrink-0" />}
              </div>
              <FileUpload
                onFileUploaded={setUploadedFile}
                uploadedFile={uploadedFile}
              />
            </section>
          )}

          {/* Step 2: Reason */}
          {progressStep >= 2 && (
            <section 
              className={`bg-white rounded-lg shadow-card border border-gray-200 p-4 sm:p-6 transition-all duration-300 ${
                progressStep === 2 ? 'ring-2 ring-primary-500 ring-opacity-20' : ''
              }`}
              aria-labelledby="reason-heading"
            >
              <div className="flex items-center mb-4">
                <MessageSquare className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                <h3 id="reason-heading" className="text-base sm:text-lg font-semibold text-navy-500">Select Decline Reason</h3>
                {selectedReasonCode && <CheckCircle2 className="h-5 w-5 text-accent-500 ml-auto flex-shrink-0" />}
              </div>
              <ReasonCodeSelector
                selectedCode={selectedReasonCode}
                onCodeSelect={setSelectedReasonCode}
              />
            </section>
          )}

          {/* Step 3: Staff Notes */}
          {progressStep >= 3 && (
            <section 
              className={`bg-white rounded-lg shadow-card border border-gray-200 p-4 sm:p-6 transition-all duration-300 ${
                progressStep === 3 ? 'ring-2 ring-primary-500 ring-opacity-20' : ''
              }`}
              aria-labelledby="notes-heading"
            >
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                <h3 id="notes-heading" className="text-base sm:text-lg font-semibold text-navy-500">Staff Context Notes</h3>
                {staffNote.trim() && <CheckCircle2 className="h-5 w-5 text-accent-500 ml-auto flex-shrink-0" />}
              </div>
              <StaffNoteInput
                value={staffNote}
                onChange={setStaffNote}
              />
            </section>
          )}

          {/* Step 4: Generate */}
          {progressStep >= 4 && (
            <section 
              className={`bg-white rounded-lg shadow-card border border-gray-200 p-4 sm:p-6 transition-all duration-300 ${
                progressStep === 4 ? 'ring-2 ring-primary-500 ring-opacity-20' : ''
              }`}
              aria-labelledby="generate-heading"
            >
              <div className="flex items-center mb-6">
                <Zap className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                <h3 id="generate-heading" className="text-base sm:text-lg font-semibold text-navy-500">Generate Rationale</h3>
              </div>
              <GenerateButton
                onClick={handleGenerate}
                isGenerating={isGenerating}
                disabled={!uploadedFile || !selectedReasonCode || !staffNote.trim()}
              />
            </section>
          )}

          {/* Output */}
          {generatedOutput && (
            <section 
              className="bg-white rounded-lg shadow-card border border-gray-200 p-4 sm:p-6"
              aria-labelledby="output-heading"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-accent-500 mr-2 flex-shrink-0" />
                  <h3 id="output-heading" className="text-base sm:text-lg font-semibold text-navy-500">Generated Rationale</h3>
                </div>
                <button
                  onClick={resetForm}
                  className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-navy-500 bg-softblue-100 rounded-md hover:bg-softblue-200 transition-colors min-h-[44px]"
                  aria-label="Start a new decline process"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Start New Process</span>
                </button>
              </div>
              <OutputPanel output={generatedOutput} />
            </section>
          )}
        </div>
      </main>
      {/* MTM Footer */}
      <footer className="bg-cream text-center py-6 px-4 mt-12">
        <img 
          src="/mtm-logo.png" 
          alt="Meet the Moment" 
          className="h-10 mx-auto mb-2"
        />
        <p className="text-gray-600 text-sm">Prototype by Meet the Moment</p>
      </footer>
    </div>
  );
}

export default App;