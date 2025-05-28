import metricsData from '@/data/metricsData';
import ChemicalTable from "./ChemicalTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

// Interface for CAS metrics data

const MetricsPanel = ({ proccessData }: any) => {
  console.log("MetricsPanel proccessData:", {proccessData})
  const processData = metricsData;
  const { overall_metrics = {}, with_list = [] } = processData || {}
    console.log({ processData, overall_metrics });
    const metricsColumns: any[] = [
    {
      key: "filename",
      label: "File Name",
      className: "text-[--ul-text-primary]",
    },
    // {
    //   key: "list_length",
    //   label: "List Length",
    //   className: "text-[--ul-text-primary]",
    // },
    {
      key: "list_id",
      label: "List ID",
      className: "text-[--ul-text-primary]",
    },
    {
      key: "precision",
      label: "Precision",
      className: "text-[--ul-text-primary]",
    },
    {
      key: "recall",
      label: "Recall",
      className: "text-[--ul-text-primary]",
    },
    {
      key: "extracted_chemicals",
      label: "Extracted Chemicals",
      className: "text-[--ul-text-primary]",
    },
    {
      key: "actual_chemicals",
      label: "Actual Chemicals",
      className: "text-[--ul-text-primary]",
    },
    {
      key: "matched_chemicals",
      label: "Matched Chemicals",
      className: "text-[--ul-text-primary]",
    },
    {
      key: "extra_chemicals",
      label: "Extra Chemicals",
      className: "text-[--ul-text-primary]",
    },
    {
      key: "missed_chemicals",
      label: "Missed Chemicals",
      className: "text-[--ul-text-primary]",
    },
  ];
  return (
    <div className="space-y-8 mt-5">
      <div>
        <h2 className="text-3xl font-normal mb-4">Overall Metrics</h2>
      </div>
      <div>
        <h2 className="text-2xl font-normal mb-4">CAS</h2>
        <div className=" border mb-4 mt-2">
          <Table>
            <TableHeader>
              <TableRow className="rounderd">
                <TableHead className="font-medium uppercase">
                  Avg. Precision
                </TableHead>
                <TableHead className="font-medium uppercase">
                  Avg. Recall
                </TableHead>
                <TableHead className="font-medium uppercase">
                  Extracted Chemicals
                </TableHead>
                <TableHead className="font-medium uppercase">
                  Actual Chemicals
                </TableHead>
                <TableHead className="font-medium uppercase">
                  Matched Chemicals
                </TableHead>
                <TableHead className="font-medium uppercase">
                  Missed Chemicals
                </TableHead>
                <TableHead className="font-medium uppercase">
                  Extra Chemicals
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">
                  {overall_metrics?.precision || 0}
                </TableCell>
                <TableCell className="text-center">
                  {overall_metrics?.recall || 0}
                </TableCell>
                <TableCell className="text-center">
                  {overall_metrics?.extracted || 0}
                </TableCell>
                <TableCell className="text-center">
                  {overall_metrics?.actual || 0}
                </TableCell>
                <TableCell className="text-center">
                  {overall_metrics?.matched || 0}
                </TableCell>
                <TableCell className="text-center">
                  {overall_metrics?.missed || 0}
                </TableCell>
                <TableCell className="text-center">
                  {overall_metrics?.extra || 0}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="rounded-md border overflow-hidden">
          <ChemicalTable isMetrics={true} columns={metricsColumns} data ={with_list || [] } className="!h-[600px]"/>
          {/* <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-medium  whitespace-nowrap capitalize">
                  File Name
                </TableHead>
                <TableHead className="font-medium font-bold capitalize">
                  list id
                </TableHead>
                <TableHead className="font-medium capitalize">
                  precision
                </TableHead>
                <TableHead className="font-medium capitalize">recall</TableHead>
                <TableHead className="font-medium capitalize">
                  extracted chemicals
                </TableHead>
                <TableHead className="font-medium capitalize">
                  actual chemicals
                </TableHead>
                <TableHead className="font-medium capitalize">
                  matched
                </TableHead>
                <TableHead className="font-medium capitalize">extra</TableHead>
                <TableHead className="font-medium capitalize">
                  missing
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedCASData &&
                Object.entries(groupedCASData).map(
                  ([fileName, metrics]: [string, any[]]) =>
                    metrics.map((metric: any, index: number) => (
                      <TableRow key={`${metric.file_name}-${metric.list_id}`}>
                        {index === 0 && (
                          <TableCell
                            rowSpan={metrics.length}
                            className="text-red-500 cursor-pointer text-left w-[500px]"
                            onClick={() => onSelect(metric._id, "results")}
                          >
                            {fileName}
                          </TableCell>
                        )}
                        <TableCell className="text-center">
                          {metric.list_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.precision}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.recall}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.extracted_chemicals}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.actual_chemicals}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.matched}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.extra}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.missing}
                        </TableCell>
                      </TableRow>
                    ))
                )}
            </TableBody>
          </Table> */}
        </div>
      </div>
      <div>
        {/* <h2 className="text-2xl font-normal mb-4">RR</h2>
        <div className="border mb-4 mt-2">
          <Table>
            <TableHeader>
              <TableRow className=" hover:bg-slate-50 ">
                <TableHead className="font-medium uppercase">No. of Docs</TableHead>
                <TableHead className="font-medium uppercase">No. of Lists</TableHead>
                <TableHead className="font-medium uppercase">
                  Overall Precision RR
                </TableHead>
                <TableHead className="font-medium uppercase ">
                  Overall Recall RR
                </TableHead>
                <TableHead className="font-medium uppercase">
                  Overall Extracted RR
                </TableHead>
                <TableHead className="font-medium uppercase">
                  Overall Actual RR
                </TableHead>
                <TableHead className="font-medium uppercase">
                  Overall Matched RR
                </TableHead>
                <TableHead className="font-medium uppercase">Overall Extra RR</TableHead>
                <TableHead className="font-medium uppercase">
                  Overall Missing RR
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">
                  {proccessData?.rr_metrics_json?.no_of_docs || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.rr_metrics_json?.no_of_lists || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.rr_metrics_json?.overall_precision_rr || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.rr_metrics_json?.overall_recall_rr || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.rr_metrics_json?.overall_extracted_rr || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.rr_metrics_json?.overall_actual_rr || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.rr_metrics_json?.overall_matched_rr || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.rr_metrics_json?.overall_extra_rr || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.rr_metrics_json?.overall_missing_rr || 0}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div> */}
        {/* <div className="rounded-md border overflow-hidden">
          <ChemicalTable columns={metricsColumns} data ={proccessData?.overall_metrics_rr||[]} className="!h-[600px]"/>
          {/* <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-medium  whitespace-nowrap capitalizee">
                  File Name
                </TableHead>
                <TableHead className="font-medium font-bold capitalize">
                  list id
                </TableHead>
                <TableHead className="font-medium capitalize">
                  precision
                </TableHead>
                <TableHead className="font-medium capitalize">recall</TableHead>
                <TableHead className="font-medium capitalize">
                  extracted chemicals
                </TableHead>
                <TableHead className="font-medium capitalize">
                  actual chemicals
                </TableHead>
                <TableHead className="font-medium capitalize">
                  matched
                </TableHead>
                <TableHead className="font-medium capitalize">extra</TableHead>
                <TableHead className="font-medium capitalize">
                  missing
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedRRData &&
                Object.entries(groupedRRData).map(
                  ([fileName, metrics]: [string, any[]]) =>
                    metrics.map((metric: any, index: number) => (
                      <TableRow key={`${metric.file_name}-${metric.list_id}`}>
                        {index === 0 && (
                          <TableCell
                            rowSpan={metrics.length}
                            className="text-red-500 cursor-pointer text-left w-[500px]"
                            onClick={() => onSelect(metric._id, "results")}
                          >
                            {fileName}
                          </TableCell>
                        )}
                        <TableCell className="text-center">
                          {metric.list_id}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.precision}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.recall}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.extracted_chemicals}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.actual_chemicals}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.matched}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.extra}
                        </TableCell>
                        <TableCell className="text-center">
                          {metric.missing}
                        </TableCell>
                      </TableRow>
                    ))
                )}
            </TableBody>
          </Table> */}
        {/* </div>  */}
      </div>
    </div>
  );
};

export default MetricsPanel;
