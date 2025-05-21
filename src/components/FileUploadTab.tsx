import React, { useState, useRef } from "react";

import { FileUp } from "lucide-react";


interface FileUploadPanelProps {
  onFileChange: (file: File | null) => void;
}

const FileUploadPanel: React.FC<FileUploadPanelProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile =
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      onFileChange(droppedFile);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium mb-4">
          Upload a regulation source file.
        </h3>
        {/* <p className="text-sm text-gray-600 mb-2">Choose a file</p> */}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Drag and drop area */}
        <div
          className={`border-2 border-dashed rounded-md p-6 cursor-pointer flex flex-col items-center justify-center min-h-[200px] ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <FileUp className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-center text-sm font-medium">
            Drag and drop file here
          </p>
          <p className="text-center text-sm text-gray-500 mt-1">
            pdf and md files only{" "}
            <span
              className="text-blue-500 cursor-pointer underline text-lg"
              onClick={(e:any) => {
                e.stopPropagation();
                e.preventDefault();
                handleBrowseClick();
              }}
            >
              browse
            </span>
          </p>
        </div>

        {file && (
          <div className="mt-4 p-3 bg-gray-50 rounded flex justify-between items-center">
            <span className="text-sm truncate">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                onFileChange(null);
              }}
              className="text-gray-500 hover:text-red-500"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadPanel;
