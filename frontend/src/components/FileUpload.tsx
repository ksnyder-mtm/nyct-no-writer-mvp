import React, { useCallback, useState } from 'react';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';
import type { UploadedFile } from '../App';

interface FileUploadProps {
  onFileUploaded: (file: UploadedFile | null) => void;
  uploadedFile: UploadedFile | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, uploadedFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = useCallback(async (file: File) => {
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
  }, [onFileUploaded]);

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
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const clearFile = () => {
    onFileUploaded(null);
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
      <div className="border-2 border-green-200 border-dashed rounded-lg p-4 bg-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">{uploadedFile.filename}</p>
              <p className="text-sm text-green-700">
                {formatFileSize(uploadedFile.size)} • Ready for processing
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-600"></div>
            <div>
              <p className="text-slate-700 font-medium">Processing your document...</p>
              <p className="text-sm text-slate-500">This may take a few seconds</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-3 rounded-full w-fit mx-auto ${
              isDragOver ? 'bg-blue-100' : 'bg-slate-100'
            }`}>
              <Upload className={`h-8 w-8 ${
                isDragOver ? 'text-blue-600' : 'text-slate-500'
              }`} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Drop your proposal here
              </p>
              <p className="text-slate-600 text-sm">or click to browse files</p>
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
              <span>PDF</span>
              <span>•</span>
              <span>Word</span>
              <span>•</span>
              <span>Max 10MB</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;