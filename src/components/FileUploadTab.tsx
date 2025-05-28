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
    <div className="">
      <div className="space-y-4">
        {/* <h3 className="text-sm font-medium mb-4">
          Upload a regulation source file.
        </h3> */}
        {/* <p className="text-sm text-gray-600 mb-2">Choose a file</p> */}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          accept=".pdf,.doc,.docx,.md,.html,.pdf,.docx"
          className="hidden"
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />

        {/* Drag and drop area */}
        <div
          className={`border-2 border-dashed rounded-md p-6 cursor-pointer flex flex-col items-center justify-center min-h-[200px] ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onClick={handleBrowseClick}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <FileUp className="h-6 w-6  mb-4 text-blue-500" />
          <p className="text-center text-sm font-medium">
            <span
              className="text-blue-500 cursor-pointer underline text-lg"
              onClick={(e: any) => {
                e.stopPropagation();
                e.preventDefault();
                handleBrowseClick();
              }}
            >
              File
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-center text-sm text-gray-500 mt-1">
            PDF, DOC, HTML or .XLSX (max. 3MB)
          </p>
        </div>

        {file && (
          <div className="mt-4 p-3 bg-gray-50 rounded flex justify-between items-center">
            <span className="text-sm truncate">{file.name}</span>
            <button
              className="text-gray-500 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                onFileChange(null);
              }}
            >
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadPanel;
