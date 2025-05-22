import React from "react";

interface Tab {
  label: string;
  value: string;
  onClick?: () => void;
}

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Tab[];
  customClass: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  tabs,
  customClass,
}) => {
  return (
    <div className={`border-b border-gray-200 ${customClass}`}>
      <nav className="flex -mb-px flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`py-2 border-b-2 font-medium text-sm mr-4 ${
              activeTab === tab.value
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => {
              if (activeTab === tab.value && tab.onClick) {
                tab.onClick();
              }
              setActiveTab(tab.value);
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
