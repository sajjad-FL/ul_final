import { CheckCircle, BarChart2, Circle } from "lucide-react";

import ChemicalResultsSection from "./ChemicalResultsSection";

const MetricsOverview = (props: {
  listId?: string;
  extractedChemicals?: any[];
  actualChemicals?: any[];
  metrics?: any;
}) => {
  const {
    listId = "",
    extractedChemicals = [],
    actualChemicals = [],
    metrics = {},
  } = props || {};

  const actualChemicalsCols = Object.keys(actualChemicals?.[0] || {});

  return (
    <div>
      <div className="rounded-md">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-gray-800">
          <BarChart2 className="text-purple-500" size={20} />
          List Id: {listId}
        </h2>
      </div>

      <ChemicalResultsSection
        chemicalCategories={[
          {
            data: extractedChemicals,
            title: `Extracted Chemicals (${extractedChemicals?.length || 0})`,
            color: "text-blue-500",
            icon: Circle,
            columns: actualChemicalsCols,
          },
          {
            data: actualChemicals,
            title: `Actual Chemicals (${actualChemicals?.length || 0})`,
            color: "text-orange-500",
            icon: Circle,
            columns: actualChemicalsCols,
          },
        ]}
      />
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-gray-800 mt-4">
        <BarChart2 className="text-purple-500" size={20} />
        Metrics Overview
      </h2>

      {metrics &&
        Object.keys(metrics).length > 0 &&
        Object.keys(metrics).map((key) => {
          return (
            <div className="mt-2 mb-2">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-gray-800">
               {key}:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-800 border rounded-md p-4 mt-1">
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="text-green-500 mr-2" size={18} />
                    <span className="text-sm font-medium">Precision</span>
                  </div>
                  <span className="text-2xl font-bold">{metrics[key].precision}</span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <BarChart2 className="text-blue-500 mr-2" size={18} />
                    <span className="text-sm font-medium">Recall</span>
                  </div>
                  <span className="text-2xl font-bold">{metrics[key]?.recall}</span>
                </div>

               z
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MetricsOverview;
