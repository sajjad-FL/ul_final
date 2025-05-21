import { useState } from "react";

import { FileUp, X } from "lucide-react";

const FileUploadTab = ({setFileUploadData}: {setFileUploadData: any}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("file", e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
      setFileUploadData(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="mt-6 space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Upload a regulation source file.
        </p>

        <div className="mb-2">
          <p className="text-sm text-gray-600">Choose a file</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-gray-50
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!uploadedFile ? (
            <>
              <FileUp className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Drag and drop file here
              </p>
              <p className="text-xs text-gray-500">
                Limit 200MB per file • PDF, MD
              </p>
            </>
          ) : (
            <div className="w-full flex items-center justify-between bg-white p-2 border border-gray-200 rounded">
              <div className="flex items-center">
                <div className="mr-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round(uploadedFile.size / 1024)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-right">
          <label className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer">
            Browse files
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

  
    </div>
  );
};

export default FileUploadTab;
