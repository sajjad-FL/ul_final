import React from "react";

interface TabNavigationProps {
  activeTab: "text" | "file";
  setActiveTab: (tab: "text" | "file") => void;
  clearData: () => void;
  clearFileUploadData: () => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  clearData,
  clearFileUploadData,
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px">
        <button
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === "text"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          } mr-8`}
          onClick={() => {
            activeTab === "file" && clearData();
            setActiveTab("text");
            clearFileUploadData();
          }}
        >
          Text Input
        </button>
        <button
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === "file"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => {
            activeTab === "text" && clearData();
            setActiveTab("file");
          }}
        >
          File Upload
        </button>
      </nav>
    </div>
  );
};

export default TabNavigation;
