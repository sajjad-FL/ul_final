import {
  BarChart2,
  Circle,
  SquareCheckBig,
  ChartColumnStacked,
} from "lucide-react";

import ChemicalResultsSection from "./ChemicalResultsSection";

const MetricsOverviewV1 = (props: {
  listId?: string;
  extractedChemicals?: any[];
  actualChemicals?: any[];
  metrics?: any;
  metricsRR?: any;
  actualChemicalsRR?: any[];
  extractedChemicalsRR?: any[];
}) => {
  const {
    listId = "",
    extractedChemicals = [],
    actualChemicals = [],
    metrics = {},
    metricsRR = {},
    actualChemicalsRR = [],
    extractedChemicalsRR = [],
  } = props || {};

  const actualChemicalsCols = Object.keys(actualChemicals?.[0] || {});
  const actualChemicalsRRCols = Object.keys(actualChemicalsRR?.[0] || {});
  const extractedChemicalsCols = Object.keys(extractedChemicals?.[0] || {});
  const extractedChemicalsRRCols = Object.keys(extractedChemicalsRR?.[0] || {});

  return (
    <div>
      <div className="rounded-md">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-gray-800">
          <BarChart2 className="text-purple-500" size={20} />
          List Id: {listId}
        </h2>
      </div>
      <div className="mt-2">
        <div className="mt-2 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 border rounded-md p-4 mt-1">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <SquareCheckBig className="text-green-500 mr-2" size={18} />
                <span className="text-sm font-medium">Cas Precision</span>
              </div>
              <span className="text-2xl font-bold">
                {((metrics?.CAS?.precision || 0) * 100).toFixed(2) || 0} %
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <ChartColumnStacked className="text-blue-500 mr-2" size={18} />
                <span className="text-sm font-medium">Cas Recall</span>
              </div>
              <span className="text-2xl font-bold">
                {((metrics?.CAS?.recall || 0) * 100).toFixed(2) || 0}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-[49%] mt-2">
            <ChemicalResultsSection
              chemicalCategories={[
                {
                  data: extractedChemicals,
                  title: `Cas Extracted Chemicals (${extractedChemicals?.length || 0})`,
                  color: "text-blue-500",
                  icon: Circle,
                  columns: extractedChemicalsCols,
                },
              ]}
            />
          </div>
          <div className="w-[49%] mt-2">
            <ChemicalResultsSection
              chemicalCategories={[
                {
                  data: actualChemicals,
                  title: `Cas Actual Chemicals (${actualChemicals?.length || 0})`,
                  color: "text-orange-500",
                  icon: Circle,
                  columns: actualChemicalsCols,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="mt-2 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 border rounded-md p-4 mt-1">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <SquareCheckBig className="text-green-500 mr-2" size={18} />
                <span className="text-sm font-medium">RR Precision</span>
              </div>
              <span className="text-2xl font-bold">
                {((metricsRR?.CAS?.precision || 0) * 100).toFixed(2) || 0} %
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <ChartColumnStacked className="text-blue-500 mr-2" size={18} />
                <span className="text-sm font-medium">RR Recall</span>
              </div>
              <span className="text-2xl font-bold">
                {((metricsRR?.CAS?.recall || 0) * 100).toFixed(2) || 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-2">
          {/* RR Extracted Chemicals */}
          <div className="mb-4 w-[49%] mt-2">
            <h4 className="text-lg font-semibold mb-2">
              RR Extracted Chemicals
            </h4>
            <ChemicalResultsSection
              chemicalCategories={[
                {
                  data: extractedChemicalsRR,
                  title: `RR Extracted Chemicals (${extractedChemicalsRR?.length || 0})`,
                  color: "text-blue-500",
                  icon: Circle,
                  columns: extractedChemicalsRRCols,
                },
              ]}
            />
          </div>

          {/* RR Actual Chemicals */}
          <div className="mb-4 w-[49%] mt-2">
            <h4 className="text-lg font-semibold mb-2">RR Actual Chemicals</h4>
            <ChemicalResultsSection
              chemicalCategories={[
                {
                  data: actualChemicalsRR,
                  title: `RR Actual Chemicals (${actualChemicalsRR?.length || 0})`,
                  color: "text-orange-500",
                  icon: Circle,
                  columns: actualChemicalsRRCols,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsOverviewV1;
