"use client";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { useEffect, useRef, useState } from "react";

import ChemicalResultsSection from "@/components/ChemicalResultsSection";
import FileUploadTab from "@/components/FileUploadTab";
import HighlightedText from "@/components/HighlightedText";
import MetricsOverview from "@/components/Metrics";
import TabNavigation from "@/components/TabNavigation";
import TextInputTab from "@/components/TextInputTab";
import {
  downloadChemicals,
  getExtractedData,
  uploadFile,
  uploadText,
} from "@/services/APIServices";
import { TagsInput } from "react-tag-input-component";
import { CheckCircle, Circle, Download } from "lucide-react";
const sampleText = `ABAMECTIN
(a) in preparations, for internal use for the treatment of animals, containing 1% or less
of abamectin; or
(b) in gel formulations containing 0.05% or less of abamectin in applicators
containing 50 mg or less of abamectin.
ABSCISIC ACID.
ACEQUINOCYL.
ACETIC ACID (excluding its salts and derivatives) in preparations containing more than 30%
of acetic acid (CH3COOH) except:
(a) when included in Schedule 2 or 6; or
(b) for therapeutic use.
ACETONE except in preparations containing 25% or less of designated solvents.
ACRIFLAVINIUM CHLORIDE in preparations for veterinary use containing 2.5% or less of`;

const Index = () => {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [camAdvisorData, setCamAdvisorData] = useState<any>({});
  const [regulationText, setRegulationText] = useState(sampleText);
  const [isListId, setisListId] = useState(false);
  const [fileUploadData, setFileUploadData] = useState<File | null>(null);
  const [listIdsText, setListIdsText] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dataLoadingRef = useRef<any>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const getDataById = async (id: string) => {
    await getExtractedData(id)
      .then((res) => {
        if (res) {
          if (res.status === 200) {
            const data = res?.data || {};
            if (data.status === "completed") {
              const extractionData = data || {};
              extractionData._id = extractionData.id;
              setCamAdvisorData(extractionData);
              setIsLoading(false);
              dataLoadingRef.current && clearInterval(dataLoadingRef.current);
            }
            if (data.status === "failed") {
              setCamAdvisorData({});
              setIsLoading(false);
              dataLoadingRef.current && clearInterval(dataLoadingRef.current);
            }
          }
        } else {
          console.error("Error ooccurred while fetching the data!");
          setError("Error ooccurred while fetching the data!");
          dataLoadingRef.current && clearInterval(dataLoadingRef.current);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Error ooccurred while fetching the data!");
        console.error(err);
        dataLoadingRef.current && clearInterval(dataLoadingRef.current);
      });
  };

  const handleExtractChemicals = async () => {
    if (activeTab === "text" && !regulationText.trim()) {
      setError("Please enter regulation text!");
      return null;
    }
    if (activeTab !== "text" && !fileUploadData) {
      setError("Please upload a file!");
      return null;
    }

    try {
      setError(null);
      setIsLoading(true);

      // Prepare list ID data if needed
      const listIds = isListId ? listIdsText : [];

      if (activeTab === "text") {
        const { data, status } = await uploadText(regulationText, listIds);

        if (status === 200) {
          const textExtractionData = data?.data || {};
          // if (textExtractionData.status === "processing") {
          //   console.log("Processing...");
          //   dataLoadingRef.current = setInterval(() => {
          //     getDataById(textExtractionData._id);
          //   }, 5000);
          // }
          // if (textExtractionData.status === "completed") {
          setCamAdvisorData(textExtractionData);
          setIsLoading(false);
          // }
        }
      } else if (fileUploadData) {
        const { data, status } = await uploadFile(fileUploadData, listIds);

        if (status === 200) {
          const textExtractionData = data?.data || {};
          if (textExtractionData.status === "processing") {
            dataLoadingRef.current = setInterval(() => {
              getDataById(textExtractionData._id);
            }, 5000);
          }
          if (textExtractionData.status === "completed") {
            setCamAdvisorData(textExtractionData);
          }
        }
      }
    } catch (error) {
      console.error("Error extracting chemicals:", error);
      setError("Something went wrong during extraction.");
      dataLoadingRef.current && clearInterval(dataLoadingRef.current);
    } finally {
      // setIsLoading(false);
    }
  };

  const downloadFile = async (id: string) => {
    setDownloadLoading(true);
    try {
      const res: any = await downloadChemicals(id); // Must return Blob
      console.log("res", res.data);
      if (res.status === 200) {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `chemicals_22_${id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // setError("Unexpected response format from the server.");
      }
    } catch (err) {
      console.error("Download failed", err);
      // setError("An error occurred while downloading the file.");
      setDownloadLoading(false);
    } finally {
      setDownloadLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (dataLoadingRef.current) {
        clearInterval(dataLoadingRef.current);
      }
    };
  }, []);

  return (
    <section className="">
      <div className="container mx-auto px-4 py-8 w-full mt-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center w-full">
          CHEMADVISOR
        </h1>

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          clearData={() => {
            setCamAdvisorData({});

            setError(null);
          }}
          clearFileUploadData={() => {
            setFileUploadData(null);
            setListIdsText([]);
            setisListId(false);
          }}
        />

        {activeTab === "text" ? (
          <TextInputTab
            regulationText={regulationText}
            setRegulationText={setRegulationText}
          />
        ) : (
          <FileUploadTab setFileUploadData={setFileUploadData} />
        )}
        { (
          <div className="flex items-center mb-2">
            <Switch
              checked={isListId}
              id="match-list-ids"
              onChange={(e) => {
                setisListId(e.target.checked);
              }}
            />
            <label
              className="ml-2 text-sm font-medium text-gray-700"
              htmlFor="match-list-ids"
            >
              Match List ID's
            </label>
          </div>
        )}

        {isListId && (
          <div className="mt-2">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="list-data"
            >
              List Data
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Enter a list ID's chemicals to filter.
            </p>
            <TagsInput
              value={listIdsText}
              onChange={(ids: string[]) => {
                setListIdsText(ids);
              }}
              name="ids"
              placeHolder="Enter a list ID and press enter"
            />
          </div>
        )}

        <div className="mb-1 mt-4">
          <Button
            className="bg-white  font-semibold py-2 px-4  rounded-md bg-[#8a1721] text-white"
            onPress={() => handleExtractChemicals()}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Extract Chemicals
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center mt-4 w-full">
            <div className="space-y-6 w-full">
              {/* Metrics Skeleton */}
              <div className="border rounded-md p-4 animate-pulse w-full">
                <div className="h-6 w-48 bg-muted rounded mb-6 bg-gray-200" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col space-y-2 w-full bg-gray-200 p-3 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-muted rounded-full" />
                        <div className="h-4 w-24 bg-muted rounded" />
                      </div>
                      <div className="h-6 w-20 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Chemical Categories Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-md">
                    <div className="p-3 border-b flex items-center space-x-2">
                      <div className="h-4 w-4 bg-muted rounded-full bg-gray-200" />
                      <div className="h-4 w-32 bg-muted rounded bg-gray-200 w-full" />
                    </div>
                    <div className="h-72 p-4 space-y-4 overflow-y-auto">
                      {[...Array(7)].map((_, idx) => (
                        <div
                          key={idx}
                          className="h-4 bg-gray-200 rounded w-full"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Accordion Skeleton */}
              <div className="border rounded-md animate-pulse">
                <div className="p-4 border-b">
                  <div className="h-4 w-32 bg-muted rounded w-48 bg-gray-200" />
                </div>
              </div>

              {/* Highlighted Text Skeleton */}
              <div className="border rounded-md p-4 animate-pulse space-y-2">
                <div className="p-4 border-b">
                  <div className="h-4 w-32 bg-muted rounded w-48 bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-white text-center mt-4 font-medium border border-red-200 bg-red-500/90 rounded-md p-2 mt-2">
            {error}
          </div>
        ) : Object.keys(camAdvisorData)?.length ? (
          <div className="space-y-6 mt-4">
            <div className="flex justify-between items-center mt-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Extracted Chemicals
              </h2>
              <Button
                className="bg-white  font-semibold py-2 px-4  rounded-md bg-[#8a1721] text-white"
                onPress={() => {
                  if (camAdvisorData?._id) {
                    downloadFile(camAdvisorData?._id);
                  }
                }}
                startContent={<Download />}
                disabled={downloadLoading}
                isLoading={downloadLoading}
              >
                Download
              </Button>
            </div>
            <MetricsOverview metrics={camAdvisorData?.result?.metrics || {}} />

            <ChemicalResultsSection
              chemicalCategories={[
                {
                  ...camAdvisorData?.result?.common_chemicals,
                  title: "Common Chemicals",
                  color: "text-orange-500",
                  icon: Circle,
                  columns: ["Chemical Name", "Cas Nos"],
                },
                {
                  ...camAdvisorData?.result?.extra_chemicals,
                  title: "Extra Chemicals",
                  color: "text-blue-500",
                  icon: Circle,
                  columns: ["Chemical Name", "Cas Nos"],
                },
                {
                  ...camAdvisorData?.results?.missing_chemicals,
                  title: "Missing Chemicals",
                  color: "text-orange-500",
                  icon: Circle,
                  columns: ["Chemical Name", "Cas Nos"],
                },
              ]}
              additionalCategories={[
                {
                  ...camAdvisorData?.result?.clean_chemicals,
                  title: "Clean Chemicals",
                  color: "text-green-500",
                  icon: CheckCircle,
                  columns: ["Original", "Cleaned"],
                  type: "clean",
                },
                {
                  ...camAdvisorData?.result?.skipped_chemicals,
                  title: "Skipped Chemicals",
                  color: "text-red-500",
                  icon: Circle,
                  columns: ["Chemical Name", "Cas Nos"],
                  type: "skipped",
                },
                {
                  ...camAdvisorData?.result?.not_annotated_chemicals,
                  title: "Annotation Missed Chemicals",

                  color: "text-blue-500",
                  icon: Circle,
                  columns: ["Chemical Name", "Cas Nos"],
                },
              ]}
            />
            <Accordion className="border rounded-md">
              <AccordionItem
                key="highlighted-text"
                classNames={{ title: "text-gray-800" }}
                title="highlighted-text"
                value="highlighted-text"
              >
                <HighlightedText
                  regulationText={
                    camAdvisorData?.result?.highlighted_text || regulationText
                  }
                />
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default Index;
