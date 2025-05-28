import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import MetricsOverviewV1 from "@/components/Metrics_v1";
import { SkeletonLoading } from "@/components/SkeletonLoading";
import { getProcessesByVersion } from "@/services/APIServices";

const DocumentDetails = ({ selected, isLoading: initialLoading }: any) => {
  const [extractionData, setExtractionData] = useState<any>(selected || {});
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading || false);
  const { documentId } = useParams();

  const getDataById = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await getProcessesByVersion();
      if (res?.status === 200) {
        const data = res.data || [];
        const matchedDoc = data.find((doc: any) => doc?._id?.$oid === id);
        if (matchedDoc) {
          matchedDoc.filename = matchedDoc.filename?.split("/").pop() || "";
          setExtractionData(matchedDoc);
        } else {
          toast.error("No matching document found.");
        }
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while fetching the data!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      getDataById(documentId);
    }
  }, [documentId]);

  return (
    <div className="w-full mt-2">
      <div className="mb-2 flex items-center">
        {/* <ChevronLeft className="w-8 h-8 mr-2 cursor-pointer" onClick={() => navigate(-1)} /> */}
      </div>

      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <div className="extraction-data w-full">
          {extractionData && Object.keys(extractionData)?.length ? (
            <div className="space-y-6 mt-4">
              <div className="flex justify-between items-center mt-2">
                <p>
                  <span className="font-bold">File Name:</span>{" "}
                  {extractionData.filename}
                </p>
              </div>

              {extractionData.list_ids?.map((listId: any, index: number) => {
                const result = extractionData.result || {};
                return (
                  <MetricsOverviewV1
                    key={listId}
                    actualChemicals={result.actual_chemicals?.[index] || []}
                    actualChemicalsRR={result.actual_chemicals_rr?.[index] || []}
                    extractedChemicals={result.extracted_chemicals?.[index] || []}
                    extractedChemicalsRR={result.extracted_chemicals_rr?.[index] || []}
                    listId={listId}
                    metrics={result.metrics?.[index] || {}}
                    metricsRR={result.metrics_rr?.[index] || {}}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-center mx-auto">No Data Found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentDetails;
