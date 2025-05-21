import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

// Interface for CAS metrics data
interface CasMetric {
  file_name: string;
  list_id: string;
  precision: string;
  recall: string;
  extracted_chemicals: number;
  actual_chemicals: number;
  matched: number;
  extra: number;
  missing: number;
}

const MetricsPanel = ({ proccessData }: any) => {
  // Sample data for the CAS metrics
  const casMetrics: CasMetric[] = [
    {
      file_name: "EU - Military Common List - Source.pdf.md",
      list_id: "6611",
      precision: "100.0%",
      recall: "99.0%",
      extracted_chemicals: 132,
      actual_chemicals: 134,
      matched: 132,
      extra: 0,
      missing: 2,
    },
    {
      file_name: "EU - Military Common List - Source.pdf.md",
      list_id: "6612",
      precision: "100.0%",
      recall: "97.0%",
      extracted_chemicals: 33,
      actual_chemicals: 34,
      matched: 33,
      extra: 0,
      missing: 1,
    },
    {
      file_name:
        "U.S. - DEA (Drug Enforcement Administration) - Controlled Substances - Source.pdf.md",
      list_id: "811",
      precision: "100.0%",
      recall: "100.0%",
      extracted_chemicals: 15,
      actual_chemicals: 15,
      matched: 15,
      extra: 0,
      missing: 0,
    },
    {
      file_name:
        "U.S. - DEA (Drug Enforcement Administration) - Controlled Substances - Source.pdf.md",
      list_id: "817",
      precision: "99.0%",
      recall: "97.0%",
      extracted_chemicals: 268,
      actual_chemicals: 272,
      matched: 265,
      extra: 3,
      missing: 7,
    },
    {
      file_name: "Odor Thresholds 3rd edition.pdf.md",
      list_id: "470",
      precision: "100.0%",
      recall: "100.0%",
      extracted_chemicals: 1095,
      actual_chemicals: 736,
      matched: 368,
      extra: 0,
      missing: 0,
    },
    {
      file_name: "Canada - CEPA - Source.pdf.md",
      list_id: "523",
      precision: "100.0%",
      recall: "68.0%",
      extracted_chemicals: 117,
      actual_chemicals: 172,
      matched: 116,
      extra: 0,
      missing: 54,
    },
    {
      file_name: "Canada - CEPA - Source.pdf.md",
      list_id: "8665",
      precision: "100.0%",
      recall: "91.0%",
      extracted_chemicals: 53,
      actual_chemicals: 58,
      matched: 53,
      extra: 0,
      missing: 5,
    },
    {
      file_name: "Canada - CEPA - ODS and Halocarbon Alternatives.pdf.md",
      list_id: "1301",
      precision: "100.0%",
      recall: "92.0%",
      extracted_chemicals: 31,
      actual_chemicals: 12,
      matched: 11,
      extra: 0,
      missing: 1,
    },
    {
      file_name: "Canada - CEPA - ODS and Halocarbon Alternatives.pdf.md",
      list_id: "1303",
      precision: "75.0%",
      recall: "64.0%",
      extracted_chemicals: 67,
      actual_chemicals: 42,
      matched: 27,
      extra: 9,
      missing: 15,
    },
    {
      file_name: "Canada - CEPA - ODS and Halocarbon Alternatives.pdf.md",
      list_id: "7597",
      precision: "100%",
      recall: "100%",
      extracted_chemicals: 0,
      actual_chemicals: 0,
      matched: 0,
      extra: 0,
      missing: 0,
    },
  ];

  // Group the CAS metrics by file name to handle rowspan
  const groupedCasMetrics: { [key: string]: CasMetric[] } = {};
  casMetrics.forEach((metric) => {
    if (!groupedCasMetrics[metric.file_name]) {
      groupedCasMetrics[metric.file_name] = [];
    }
    groupedCasMetrics[metric.file_name].push(metric);
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Overall Evaluation Metrics</h2>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">CAS</h2>
        <div className="rounded-md border mb-4 mt-2">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-medium ">No. of Docs</TableHead>
                <TableHead className="font-medium ">No. of Lists</TableHead>
                <TableHead className="font-medium ">
                  Overall Precision CAS
                </TableHead>
                <TableHead className="font-medium ">
                  Overall Recall CAS
                </TableHead>
                <TableHead className="font-medium ">
                  Overall Extracted CAS
                </TableHead>
                <TableHead className="font-medium ">
                  Overall Actual CAS
                </TableHead>
                <TableHead className="font-medium ">
                  Overall Matched CAS
                </TableHead>
                <TableHead className="font-medium ">
                  Overall Extra CAS
                </TableHead>
                <TableHead className="font-medium ">
                  Overall Missing CAS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">
                  {proccessData?.cas_metrics_json?.no_docs || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.cas_metrics_json?.no_of_lists || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.cas_metrics_json?.overall_precision_cas || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.cas_metrics_json?.overall_recall_cas || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.cas_metrics_json?.overall_extracted_cas || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.cas_metrics_json?.overall_actual_cas || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.cas_metrics_json?.overall_matched_cas || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.cas_metrics_json?.overall_extra_cas || 0}
                </TableCell>
                <TableCell className="text-center">
                  {proccessData?.cas_metrics_json?.overall_missing_cas || 0}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="rounded-md border overflow-hidden">
          <Table>
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
              {proccessData &&
                proccessData.overall_metrics &&
                proccessData.overall_metrics.length &&
                proccessData.overall_metrics.map(
                  (metric: any, index: number) => (
                    <TableRow key={`${metric.file_name}-${metric.list_id}`}>
                      {index === 0 && (
                        <TableCell
                          rowSpan={metric.list_length}
                          className="whitespace-nowrap align-top text-red-500 cursor-pointer text-center"
                          onClick={() =>
                            window.open(
                              `/chemadvisor/document/${metric._id}`,
                              "_blank"
                            )
                          }
                        >
                          {metric.file_name}
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
                  )
                )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">RR</h2>
        <div className="rounded-md border mb-4 mt-2">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-medium ">No. of Docs</TableHead>
                <TableHead className="font-medium ">No. of Lists</TableHead>
                <TableHead className="font-medium ">
                  Overall Precision RR
                </TableHead>
                <TableHead className="font-medium ">
                  Overall Recall RR
                </TableHead>
                <TableHead className="font-medium ">
                  Overall Extracted RR
                </TableHead>
                <TableHead className="font-medium ">
                  Overall Actual RR
                </TableHead>
                <TableHead className="font-medium ">
                  Overall Matched RR
                </TableHead>
                <TableHead className="font-medium ">Overall Extra RR</TableHead>
                <TableHead className="font-medium ">
                  Overall Missing RR
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">
                  {proccessData?.rr_metrics_json?.no_docs || 0}
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
        </div>
        <div className="rounded-md border overflow-hidden">
          <Table>
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
              {proccessData &&
                proccessData.overall_metrics_rr &&
                proccessData.overall_metrics_rr.length &&
                proccessData.overall_metrics_rr.map(
                  (metric: any, index: number) => (
                    <TableRow key={`${metric.file_name}-${metric.list_id}`}>
                      {index === 0 && (
                        <TableCell
                          rowSpan={metric.list_length}
                          className="whitespace-nowrap align-top text-red-500 cursor-pointer text-center"
                          onClick={() =>
                            window.open(
                              `/chemadvisor/document/${metric._id}`,
                              "_blank"
                            )
                          }
                        >
                          {metric.file_name}
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
                  )
                )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
