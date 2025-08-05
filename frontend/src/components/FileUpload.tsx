import React, { useCallback, useState } from 'react';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';
import type { UploadedFile } from '../App';

interface FileUploadProps {
  onFileUploaded: (file: UploadedFile) => void;
  uploadedFile: UploadedFile | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, uploadedFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setError('');
    setIsUploading(true);

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      setIsUploading(false);
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF and Word documents are allowed.');
      setIsUploading(false);
      return;
    }

    try {
      // For now, create mock upload response since backend isn't deployed yet
      // This simulates the backend response structure
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload time
      
      const mockUploadedFile: UploadedFile = {
        proposal_hash: Math.random().toString(36).substring(7),
        text_content: `Mock extracted text from ${file.name}. This is a sample proposal text that would normally be extracted from the uploaded PDF or Word document. The actual text extraction will work once the backend is deployed with real document processing capabilities.`,
        filename: file.name,
        size: file.size
      };

      onFileUploaded(mockUploadedFile);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    onFileUploaded(null as any);
    setError('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadedFile) {
    return (
      <div className="relative border-2 border-success-200 border-dashed rounded-xl p-6 bg-gradient-to-br from-success-50 to-success-100/50 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-success-400/20 blur"></div>
              <div className="relative bg-success-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <div>
              <p className="font-semibold text-success-900 text-base">{uploadedFile.filename}</p>
              <p className="text-sm text-success-700 flex items-center space-x-2">
                <span>{formatFileSize(uploadedFile.size)}</span>
                <span>•</span>
                <span className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-success-500 rounded-full mr-1.5"></div>
                  Ready for processing
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-2 text-success-600 hover:text-success-800 hover:bg-success-200/60 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group
          ${isDragOver
            ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-primary-100/50 scale-[1.02]'
            : 'border-slate-300 hover:border-primary-300 hover:bg-slate-50/50'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-card'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && document.getElementById('file-input')?.click()}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent rounded-xl pointer-events-none"></div>
        
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="relative z-10 flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600"></div>
              <div className="absolute inset-0 rounded-full bg-primary-100/50 animate-pulse"></div>
            </div>
            <div>
              <p className="text-slate-700 font-medium">Processing your document...</p>
              <p className="text-sm text-slate-500">This may take a few seconds</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-4">
            <div className="relative">
              <div className={`absolute -inset-2 rounded-full transition-all duration-300 ${
                isDragOver ? 'bg-primary-400/20 blur' : 'bg-slate-400/10 blur group-hover:bg-primary-400/10'
              }`}></div>
              <div className={`relative p-3 rounded-full w-fit mx-auto transition-all duration-300 ${
                isDragOver ? 'bg-primary-100' : 'bg-slate-100 group-hover:bg-primary-50'
              }`}>
                <Upload className={`h-8 w-8 transition-colors duration-300 ${
                  isDragOver ? 'text-primary-600' : 'text-slate-500 group-hover:text-primary-500'
                }`} />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900 mb-1">
                Drop your proposal here
              </p>
              <p className="text-slate-600">or click to browse files</p>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                <span>PDF supported</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                <span>Word documents</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                <span>Max 10MB</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-3 text-error-700 bg-gradient-to-r from-error-50 to-error-100/50 p-4 rounded-lg border border-error-200 animate-slide-up">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;