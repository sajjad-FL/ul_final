import MetricsOverviewV1 from "@/components/Metrics_v1";
import { SkeletonLoading } from "@/components/SkeletonLoading";
import { getExtractedData } from "@/services/APIServices";
// import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {  useParams } from "react-router-dom";

const DocumentDetails = () => {
  const [extractionData, setExtractionData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { documentId } = useParams();

//   const navigate = useNavigate();

  const getDataById = async (id: string) => {
    setIsLoading(true);
    await getExtractedData(id)
      .then((res) => {
        if (res) {
          if (res.status === 200) {
            const data = res?.data || {};
            const extractionData = data || {};
            extractionData._id = extractionData.id;
            extractionData.filename =
              extractionData.file_path.split("/").pop() || "";
            setExtractionData(extractionData);
            setIsLoading(false);
          }
        } else {
          console.error("Error ooccurred while fetching the data!");
          toast.error("Error ooccurred while fetching the data!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Error ooccurred while fetching the data!");
        console.error(err);
      });
  };

  useEffect(() => {
    documentId && getDataById(documentId);
  }, [documentId]);

  return (
    <div className="container mx-auto px-2 py-8 w-full mt-2">
      <div className="px-6 mb-2 flex items-center">
        {/* <ChevronLeft className="w-8 h-8 mr-2 cursor-pointer" onClick={() => navigate(-1)} /> */}
        <p className="text-left  font-bold text-2xl">
          Extracted Chemicals
        </p>
      </div>
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <div className="extraction-data">
          {isLoading ? (
            <SkeletonLoading />
          ) : extractionData && Object.keys(extractionData)?.length ? (
            <div className="space-y-6 mt-4 px-6">
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-xl font-medium text-gray-800">
                  File Name - {extractionData.filename}
                </h2>
                {/* <Button
                className="bg-white  font-semibold py-2 px-4  rounded-md bg-[#8a1721] text-white"
                disabled={downloadLoading}
                isLoading={downloadLoading}
                startContent={<Download />}
                onPress={() => {
                  if (camAdvisorData?._id ) {
                    downloadFile(camAdvisorData?._id);
                  }
                }}
              >
                Download
              </Button> */}
              </div>
              {extractionData &&
                extractionData.list_ids &&
                extractionData.list_ids.length &&
                extractionData.list_ids.map((listId: any, index: number) => {
                  const actual_chemicals =
                    extractionData?.result?.actual_chemicals[index] || [];
                  const extracted_chemicals =
                    extractionData?.result?.extracted_chemicals[index] || [];
                  const actual_chemicals_rr =
                    extractionData?.result?.actual_chemicals_rr[index] || [];
                  const extracted_chemicals_rr =
                    extractionData?.result?.extracted_chemicals_rr[index] || [];
                  const metrics = extractionData?.result?.metrics[index] || {};
                  const metricsRR =
                    extractionData?.result?.metrics_rr[index] || {};

                  return (
                    <MetricsOverviewV1
                      key={listId}
                      actualChemicals={actual_chemicals || []}
                      extractedChemicals={extracted_chemicals || []}
                      listId={listId}
                      metrics={metrics}
                      metricsRR={metricsRR}
                      actualChemicalsRR={actual_chemicals_rr || []}
                      extractedChemicalsRR={extracted_chemicals_rr || []}
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
