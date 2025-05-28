import clsx from "clsx";
import React from "react";

interface Tab {
  label: string;
  value: string;
  onClick?: () => void;
  isFist?: boolean;
  isLast?: boolean;
}

interface TabNavigationProps {
  activeTab: string;
  onChange: (tab: string) => void;
  tabs: Tab[];
  customClass: string;
  innerTabs?: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  tabs,
  customClass,
  onChange,
  innerTabs = false,
}) => {
  return (
    <div
      className={clsx(
        `border-gray-200 mt-4 mb-4 ${customClass}`,
        !innerTabs && "border-b"
      )}
    >
      <nav className={clsx("flex -mb-px flex-wrap", innerTabs && "gap-0")}>
        {tabs.map((tab:any) => (
          <button
            key={tab.value}
            className={clsx(
              "text-sm font-medium leading-[24px] tracking-[0.025rem] px-2 py-1",
              innerTabs
                ? "border border-[--ul-bg-primary] text-[--ul-bg-primary] rounded-md"
                : "border-b-2",
              activeTab === tab.value
                ? innerTabs
                  ? "bg-[--ul-bg-light] border-[--ul-bg-primary]"
                  : "border-[--ul-bg-primary] text-[--ul-bg-primary]"
                : innerTabs
                  ? ""
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              // Add conditional classes for corner borders
              tab.isFirst && "rounded-md rounded-r-none border-r-0",
              tab.isLast && "rounded-l-none",
            )}
            onClick={() => {
              if (activeTab === tab.value && tab.onClick) {
                tab.onClick();
              }

              onChange(tab.value);
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
