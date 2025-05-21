import { CheckCircle, BarChart2, Activity } from "lucide-react";

const MetricsOverview = ({ metrics }: { metrics: any }) => {
  const { Precision = 0, Recall = 0,  } = metrics || {};

  return (
    <div className="border rounded-md p-4">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-gray-800">
        <BarChart2 className="text-purple-500" size={20} />
        Metrics Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-800">
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <CheckCircle className="text-green-500 mr-2" size={18} />
            <span className="text-sm font-medium">Precision</span>
          </div>
          <span className="text-2xl font-bold">{Precision}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <BarChart2 className="text-blue-500 mr-2" size={18} />
            <span className="text-sm font-medium">Recall</span>
          </div>
          <span className="text-2xl font-bold">{Recall}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <Activity className="text-gray-500 mr-2" size={18} />
            <span className="text-sm font-medium">F1 Score</span>
          </div>
          <span className="text-2xl font-bold">{metrics["F1 Score"] || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricsOverview;
