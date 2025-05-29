import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import { SkeletonLoading } from "@/components/SkeletonLoading";
import { getResultData } from "@/services/APIServices";
import Header from "@/components/Header";
import DocumentMetricsOverviewV1 from "@/components/DetailsMetrics";
import TabNavigation from "@/components/TabNavigation";

const DocumentDetails = ({ selected, isLoading: initialLoading }: any) => {
  const [extractionData, setExtractionData] = useState<any>(selected || {});
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading || false);
  const { documentId } = useParams();
  const [filename, setFilename] = useState<string>("");
  const [dataActiveTab, setDataActiveTab] = useState<any>(null);
  const [highlightText, setHighlightText] = useState<string>("");
  const dataTabs = [
    {
      label: "Chemical Extraction",
      value: "chemical_extraction",
      onClick: () => {
        // clearData();
        // clearFileUploadData();
      },
      isFirst: true,
    },
    {
      label: "Text Highlight",
      value: "text_highlight",
      // onClick: () => clearData(),
      isLast: true,
    },
  ];

  const getDataById = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await getResultData(id);

      if (res?.status === 200) {
        const data = res.data?.results || [];

        if (data.length) {
          setFilename(data[0].filename);
        }
        setHighlightText(res?.data?.highlight_text || "");
        setExtractionData(data);
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
    <section className="">
      <Header />
      <div className="w-full mt-2 px-12">
        <div className="mb-2 flex items-center">
          {/* <ChevronLeft className="w-8 h-8 mr-2 cursor-pointer" onClick={() => navigate(-1)} /> */}
        </div>

        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <div className="extraction-data w-full">
            <>
              <div className="my-[30px]">
                <TabNavigation
                  activeTab={dataActiveTab || dataTabs?.[0]?.value}
                  customClass={"mt-3"}
                  innerTabs={true}
                  tabs={dataTabs}
                  onChange={(tab: string) => {
                    setDataActiveTab(tab);
                    // setExtractionData({});
                  }}
                />
              </div>
              {dataActiveTab === null ||
              dataActiveTab === "chemical_extraction" ? (
                extractionData && Object.keys(extractionData)?.length ? (
                  <div className="space-y-6 mt-4">
                    <div className="flex justify-between items-center mt-2">
                      <p>
                        <span className="font-bold">File Name:</span> {filename}
                      </p>
                    </div>

                    {extractionData?.map((each: any) => {
                      return (
                        <DocumentMetricsOverviewV1
                          key={each.list_id}
                          actualChemicals={each.actual_chemicals || []}
                          extractedChemicals={each.extracted_chemicals || []}
                          listId={each.list_id}
                          precision={each.precision}
                          recall={each.recall}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center mx-auto font-bold text-2xl mt-4">
                    No Data Found
                  </p>
                )
              ) : (
                <div className="text-medium">
                  <p className="font-bold text-lg mb-2 mb-2">
                    Highlighted Text
                  </p>

                  {highlightText && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: highlightText || "",
                      }}
                    />
                  )}
                </div>
              )}
            </>
          </div>
        )}
      </div>
    </section>
  );
};

export default DocumentDetails;
