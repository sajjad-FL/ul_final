"use client";

import { Button } from "@heroui/button";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-hook-form";
import toast from "react-hot-toast";
import { TagsInput } from "react-tag-input-component";
import { Select, SelectItem } from "@heroui/select";
import { Circle } from "lucide-react";
import { Switch } from "@heroui/switch";
import { CircularProgress } from "@heroui/progress";
import clsx from "clsx";
import { Chip } from "@heroui/chip";

import DocumentDetails from "./DocumentDetails";

import FileUploadTab from "@/components/FileUploadTab";
import {
  getAllDocument,
  getAllDocumentData,
  getAllDocumentDataByFilename,
  getExtractedData,
  // getVersions,
  uploadFile,
  uploadText,
} from "@/services/APIServices";
import { fileSchema, textSchema } from "@/schemas";
import ReactHookForm, {
  FormMethods,
  getErrorMessage,
} from "@/hooks/ReactHookForm";
import MetricsOverviewV1 from "@/components/Metrics_v1";
import TabNavigation from "@/components/TabNavigation";
import MetricsPanel from "@/components/MetricsPanel";
import ChemicalResultsSection from "@/components/ChemicalResultsSection";
import LoadingSpinner from "@/components/Spinner";
import Header from "@/components/Header";

const Chemadvisor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<any>(null);
  const [homeActiveTab, setHomeActiveTab] = useState<any>(null);
  const [dataActiveTab, setDataActiveTab] = useState<any>(null);
  const [extractionData, setExtractionData] = useState<any>({});
  // const [extractionMetricsData] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  // const [versions] = useState<any[]>(["v1"]);
  const [selectedVersion, setSelectedVersion] = useState<string[]>([]);
  const dataLoadingRef = useRef<any>(null);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [processesData, setProcessesData] = useState<any>({});
  const [documentList, setDocumentList] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>({});
  const [documentLoading, setDocumentLoading] = useState<boolean>(false);
  const [extractingPercentage, setExtractingPercentage] = useState<number>(0);
  const MAX_CHARS = 10000;

  interface CASMetrics {
    matched: string[];
    missed: string[];
    extra: string[];
    precision: number;
    recall: number;
  }

  interface DocData {
    doc_id: string;
    file_path: string;
    list_ids: string[];
    metrics: { CAS: CASMetrics }[];
    metrics_rr: { CAS: CASMetrics }[];
    extracted_chemicals: string[][];
    actual_chemicals: string[][];
    extracted_chemicals_rr: string[][];
    actual_chemicals_rr: string[][];
  }

  interface SummaryMetrics {
    file_name: string;
    list_id: number;
    precision: string;
    recall: string;
    extracted_chemicals: number;
    actual_chemicals: number;
    matched: number;
    extra: number;
    missing: number;
    list_length: number;
    _id: string;
  }

  const textExtract = async (values: any) => {
    toast.success("Chemical Extraction Started");
    setIsLoading(true);
    setError(null);
    try {
      const listIds = (values.list_id && values.list_data) || [];
      const inputData = values.input_data;
      const { data, status }: any = await uploadText(inputData, listIds);

      if (status === 200 && data) {
        const textExtractionData = data || {};

        if (textExtractionData.status === "processing") {
          dataLoadingRef.current = setInterval(() => {
            getDataById(textExtractionData.id);
          }, 10000);
        }
        if (textExtractionData.status === "completed") {
          setExtractionData(textExtractionData);
          if (dataLoadingRef.current) {
            clearInterval(dataLoadingRef.current);
          }
          setExtractingPercentage(0);
          toast.success("Chemical Extraction Completed!");
          setIsLoading(false);
        }
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Something went wrong";

      // setError(errorMsg);
      toast.error(`Chemical Extraction Failed: ${errorMsg}`);
      setIsLoading(false);
      if (dataLoadingRef.current) {
        clearInterval(dataLoadingRef.current);
      }
    } finally {
      // setIsLoading(false);
    }
  };
  const fileExtract = async (values: any) => {
    toast.success("Chemical Extraction Started");
    setIsLoading(true);
    setError(null);
    try {
      const listIds = (values.list_id && values.list_data) || [];
      const fileData = values.file;

      const { data, status } = await uploadFile(fileData, listIds);

      if (status === 200 && data) {
        const textExtractionData = data || {};

        if (textExtractionData.status === "processing") {
          dataLoadingRef.current = setInterval(() => {
            getDataById(textExtractionData.id);
          }, 10000);
        }
        if (textExtractionData.status === "completed") {
          if (dataLoadingRef.current) {
            clearInterval(dataLoadingRef.current);
          }
          setExtractionData(textExtractionData);
          toast.success("Chemical Extraction Completed!");
          setIsLoading(false);
          getMetricsVersionData();
        }
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Something went wrong";

      // setError(errorMsg);
      setIsLoading(false);
      toast.error(`Chemical Extraction Failed: ${errorMsg}`);
      if (dataLoadingRef.current) {
        clearInterval(dataLoadingRef.current);
      }
    } finally {
    }
  };

  const getDataById = async (id: string) => {
    await getExtractedData(id)
      .then((res) => {
        if (res) {
          if (res.status === 200) {
            const data = res?.data || {};

            if (data.status === "completed") {
              const extractionData = data || {};

              getMetricsVersionData();
              extractionData._id = extractionData.id;
              setExtractionData(extractionData);
              setIsLoading(false);
              setExtractingPercentage(0);
              toast.success("Chemical Extraction Completed!");
              dataLoadingRef.current && clearInterval(dataLoadingRef.current);
            } else if (data.status === "processing") {
              const total = data?.documents?.chunks_count || 1;
              const processed = data?.chunks_completed || 0;
              const percentage = Math.round((processed / total) * 100);

              setExtractingPercentage(percentage > 100 ? 100 : percentage);
            }
            if (data.status === "failed") {
              setExtractionData({});
              setIsLoading(false);
              setExtractingPercentage(0);
              dataLoadingRef.current && clearInterval(dataLoadingRef.current);
            }
          }
        } else {
          console.error("Error ooccurred while fetching the data!");
          setError("Error ooccurred while fetching the data!");
          setExtractionData({});
          setIsLoading(false);
          setExtractingPercentage(0);
          dataLoadingRef.current && clearInterval(dataLoadingRef.current);
          // dataLoadingRef.current && clearInterval(dataLoadingRef.current);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setError("Error ooccurred while fetching the data!");
        setExtractionData({});
        setIsLoading(false);
        setExtractingPercentage(0);
        dataLoadingRef.current && clearInterval(dataLoadingRef.current);
      });
  };

  const getMetricsVersionData = async () => {
    setMetricsLoading(true);
    const res = await getAllDocument();
    // let data: DocData[] = res?.data || [];
    console.log(res,"kmbhjhg")
    let data:any = res?.data || [];

    const overallMetrics = data?.overall_metrics || {};
    const withIds = data?.with_list || [];
    const withoutIds = data?.overall_metrics || {};
    setProcessesData({
      overallMetrics,withIds,withoutIds
    })
    // Helper function
   
    setMetricsLoading(false);
  };

  useEffect(() => {
    getMetricsVersionData();
  }, []);

  const clearData = () => {
    // setExtractionData(null);
    // setListIds([]);
  };
  const clearFileUploadData = () => {
    // setExtractionData(null);
  };
  const containerTabs = [
    {
      label: "Home",
      value: "home",
      onClick: () => {
        clearData();
        clearFileUploadData();
      },
    },
    {
      label: "Metrics",
      value: "metrics",
      onClick: () => clearData(),
    },
    // {
    //   label: 'Results',
    //   value: 'results',
    //   onClick: () => {
    //     clearData();
    //     clearFileUploadData();
    //   },
    // },
  ];

  const homeTabs = [
    {
      label: "Text Input",
      value: "text",
      onClick: () => {
        // clearData();
        // clearFileUploadData();
      },
      isFirst: true,
    },
    {
      label: "File Upload",
      value: "file",
      // onClick: () => clearData(),
      isLast: true,
    },
  ];


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

  const extractedChemicalsList =
    extractionData?.result?.extracted_chemicals || [];

  const onDocumentChange = async (id: string, tab: string) => {
    setDocumentLoading(true);
    setSelectedVersion([id]);
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
    const document = await getAllDocumentDataByFilename(id);

    setSelectedDocument(document || {});
    setDocumentLoading(false);
  };
  const onCancelExtraction = () => {
    if (dataLoadingRef.current) {
      clearInterval(dataLoadingRef.current);
      dataLoadingRef.current = null;
    }
    setIsLoading(false);
    setExtractingPercentage(0);
    setExtractionData({});
    toast.error("Chemical Extraction Cancelled!");
  };

  return (
    <section className="">
      <Header />
      <div className=" mx-auto px-16 py-2 w-full mt-2">
        <h1 className="font-normal text-[32px] leading-[1.13] tracking-[-0.09375rem] font-poppins">
          ChemADVISOR
        </h1>

        <TabNavigation
          activeTab={activeTab || containerTabs?.[0]?.value}
          customClass={""}
          tabs={containerTabs}
          onChange={(tab: string) => {
            setActiveTab(tab);
            // setExtractionData({});
          }}
        />

        {activeTab === "home" || activeTab === null ? (
          <div className="my-[30px]">
            <TabNavigation
              activeTab={homeActiveTab || homeTabs?.[0]?.value}
              customClass={"mt-3"}
              innerTabs={true}
              tabs={homeTabs}
              onChange={(tab: string) => {
                setHomeActiveTab(tab);
                // setExtractionData({});
              }}
            />

            {homeActiveTab === "text" || homeActiveTab === null ? (
              <div className="mt-4">
                <ReactHookForm
                  defaultValues={{
                    input_data: "",
                    list_data: [],
                    list_id: false,
                    input_data_length: 0,
                  }}
                  validationSchema={textSchema}
                  onSubmit={(data) => {
                    textExtract(data);
                  }}
                >
                  {({
                    register,
                    formSubmit,
                    setValue,
                    trigger,
                    getValues,
                    formState: { errors },
                  }: FormMethods) => {
                    return (
                      <Form onSubmit={formSubmit}>
                        <div className="flex flex-col items-start w-[40%] mb-2">
                          <textarea
                            className="my-2 mt-7 w-full  min-h-[250px] border-1 border-[#AEAEC031] rounded-md p-4 focus:outline-none focus-visible:outline-none"
                            placeholder="Paste text here..."
                            value={getValues().input_data || ""}
                            onChange={(e) => {
                              let value = e.target.value;
                              let textLength = value.length;

                              setValue("input_data", e.target.value, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              setValue("input_data_length", textLength);
                              trigger("input_data");
                            }}
                          />
                          <div
                            className={clsx(
                              "text-sm mt-1 text-right items-end  w-full",
                              getValues().input_data_length >= MAX_CHARS
                                ? "text-red-500"
                                : "text-[--ul-text-secondary]"
                            )}
                          >
                            {getValues().input_data_length} / {MAX_CHARS}
                          </div>
                          {errors?.input_data &&
                            errors?.input_data?.message && (
                              <span className="error text-red-500 text-sm">
                                {getErrorMessage(errors?.input_data)}
                              </span>
                            )}
                        </div>
                        <Switch
                          defaultSelected
                          classNames={{
                            wrapper:
                              "group-data-[selected=true]:bg-[--ul-bg-primary]",
                          }}
                          size="sm"
                          {...register("list_id")}
                          isSelected={getValues().list_id || false}
                          onValueChange={(check: boolean) => {
                            setValue("list_id", check);
                            trigger("list_id");
                          }}
                        >
                          Match List IDs
                        </Switch>

                        {getValues().list_id && (
                          <div className="mt-2 w-[40%]">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 ">
                              Enter a list ID.
                            </h3>
                            <TagsInput
                              name="list_data"
                              placeHolder="Enter a list ID and press enter"
                              separators={[",", " ", "Enter", "Tab"]}
                              value={getValues().list_data || []}
                              onChange={(ids: string[]) => {
                                setValue("list_data", ids, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                trigger("list_data");
                              }}
                            />
                            {errors?.list_data &&
                              errors?.list_data?.message && (
                                <span className="error text-red-500  text-sm">
                                  {getErrorMessage(errors?.list_data)}
                                </span>
                              )}
                          </div>
                        )}

                        <div className="mb-1 mt-4">
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <Button
                                className="bg-white  font-semibold py-2 px-4  rounded-lg bg-[--ul-bg-primary] text-white"
                                onPress={() => onCancelExtraction()}
                              >
                                Cancel
                              </Button>
                              <CircularProgress
                                aria-label="Loading..."
                                classNames={{
                                  svg: "text-[--ul-bg-primary] w-14 h-14",
                                }}
                                showValueLabel={true}
                                size="lg"
                                value={extractingPercentage || 0}
                              />
                              <span className="text-[--ul-text-primary] font-semibold flex items-center gap-2">
                                <span>Extracting Chemicals</span>{" "}
                                <div className="dot-flashing ml-3 mt-1" />
                              </span>
                            </div>
                          ) : (
                            <Button
                              className="bg-white text-xl font-normal rounded-xl bg-[--ul-bg-primary] text-white font-poppins p-4"
                              disabled={isLoading}
                              isLoading={isLoading}
                              size="md"
                              type="submit"
                            >
                              Extract
                            </Button>
                          )}
                        </div>
                      </Form>
                    );
                  }}
                </ReactHookForm>

               <div className="extraction-data">
                  {error ? (
                    <div className="text-white text-center mt-4 font-medium border border-red-200 bg-red-500/90 rounded-md p-2 mt-2">
                      {error}
                    </div>
                  ) : extractionData && Object.keys(extractionData)?.length ? (
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
                        {
                          dataActiveTab === null || dataActiveTab === 'chemical_extraction' ? <div className="space-y-6 mt-4">
                            <div className="flex justify-between items-center mt-2">
                              <h2 className="text-2xl font-bold text-gray-800">
                                Extracted Chemicals
                              </h2>
                            </div>
                            {extractionData.list_ids &&
                              extractionData.list_ids.length ? (
                              extractionData.list_ids?.map(
                                (listId: any, index: number) => {
                                  const actual_chemicals =
                                   (extractionData?.result?.results || [])[index]?.actual_chemicals || [];;
                                  const extracted_chemicals =
                                    (extractionData?.result?.results || [])[index]?.extracted_chemicals || [];
                                  // const actual_chemicals_rr =
                                  //   (extractionData?.result?.actual_chemicals_rr ||
                                  //     [])?.[index] || [];
                                  // const extracted_chemicals_rr =
                                  //   (extractionData?.result?.extracted_chemicals_rr ||
                                  //     [])?.[index] || [];
                                  const precision =
                                    extractionData?.result?.results?.[index]?.precision || '';
                                  const recall =
                                    extractionData?.result?.results?.[index]?.recall || '';
                                    console.log({precision, recall})
                                  const metricsRR =
                                    extractionData?.result?.metrics_rr?.[index] || {};
                                  console.log({extractionData})
                                  return (
                                    <>
                                      <MetricsOverviewV1
                                        key={listId}
                                        actualChemicals={actual_chemicals}
                                        extractedChemicals={extracted_chemicals}
                                        listId={listId}
                                        // metrics={metrics}
                                        precision={precision}
                                        recall={recall}
                                        metricsRR={metricsRR}
                                      />
                                      {/* <div className="text-medium">
                                        <p className="font-bold text-lg mb-2 mb-2">Highlighted Text</p>

                                        {extractionData?.result?.highlight_text && (
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                extractionData?.result?.highlight_text,
                                            }}
                                          />
                                        )}
                                      </div> */}
                                    </>
                                  );
                                }
                              )
                            ) : (
                              <>
                                <ChemicalResultsSection
                                  chemicalCategories={[
                                    {
                                      data: extractedChemicalsList,
                                      title: `Cas Extracted Chemicals (${extractedChemicalsList?.length || 0})`,
                                      color: "text-blue-500",
                                      icon: Circle,
                                      columns: Object.keys(
                                        extractedChemicalsList?.[0] || {}
                                      ).map((key: string) => {
                                        return {
                                          key,
                                          className: "text-[--ul-text-primary]",
                                          label:
                                            key.charAt(0).toUpperCase() +
                                            key.slice(1),
                                          ...((key.toLowerCase() === "cas" ||
                                            key.toLowerCase() === "synonyms") && {
                                            render: (value: string | string[]) => {
                                              if (
                                                !value ||
                                                (Array.isArray(value) &&
                                                  value.length === 0)
                                              )
                                                return "";

                                              const valuesArray = Array.isArray(value)
                                                ? value
                                                : value.split(/,\s*/).filter(Boolean); // split string into array if needed

                                              return (
                                                <>
                                                  {valuesArray?.map(
                                                    (elem: any): any => (
                                                      <Chip className="mr-2">
                                                        {elem}
                                                      </Chip>
                                                    )
                                                  )}
                                                </>
                                              );
                                            },
                                          }),
                                        };
                                      }),
                                    },
                                  ]}
                                />
                              </>
                            )}
                          </div> : <div className="text-medium">
                            <p className="font-bold text-lg mb-2">Highlighted Text</p>

                            {extractionData?.result?.highlight_text && (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    extractionData?.result?.highlight_text,
                                }}
                              />
                            )}
                          </div>
                        }

                      </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : null}

            {homeActiveTab === "file" ? (
              <>
                <div className="file-upload-section">
                  <ReactHookForm
                    defaultValues={{ list_data: [] }}
                    validationSchema={fileSchema}
                    onSubmit={(data) => {
                      fileExtract(data);
                    }}
                  >
                    {({
                      formSubmit,
                      setValue,
                      trigger,
                      getValues,
                      register,
                      formState: { errors },
                    }: FormMethods) => (
                      <Form onSubmit={formSubmit}>
                        <div className="w-[40%] mt-[45px] mb-[30px]">
                          <FileUploadTab
                            onFileChange={(file: any) => {
                              setValue("file", file, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              trigger("file");
                            }}
                          />
                          {errors?.file && errors?.file?.message && (
                            <span className="error text-red-500 px-6 text-sm">
                              {getErrorMessage(errors.file)}
                            </span>
                          )}
                        </div>

                        <Switch
                          defaultSelected
                          classNames={{
                            wrapper:
                              "group-data-[selected=true]:bg-[--ul-bg-primary]",
                          }}
                          size="sm"
                          {...register("list_id")}
                          isSelected={getValues().list_id || false}
                          onValueChange={(check: boolean) => {
                            setValue("list_id", check);
                            trigger("list_id");
                          }}
                        >
                          Match List IDs
                        </Switch>

                        {getValues().list_id && (
                          <div className="mt-2 w-[40%]">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 ">
                              Enter a list ID.
                            </h3>
                            <TagsInput
                              name="list_data"
                              placeHolder="Enter a list ID and press enter"
                              separators={[",", " ", "Enter", "Tab"]}
                              value={getValues().list_data || []}
                              onChange={(ids: string[]) => {
                                setValue("list_data", ids, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                trigger("list_data");
                              }}
                            />
                            {errors?.list_data &&
                              errors?.list_data?.message && (
                                <span className="error text-red-500  text-sm">
                                  {getErrorMessage(errors?.list_data)}
                                </span>
                              )}
                          </div>
                        )}

                        <div className="mb-1 mt-4">
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <Button
                                className="bg-white  font-semibold py-2 px-4  rounded-lg bg-[--ul-bg-primary] text-white"
                                onPress={() => onCancelExtraction()}
                              >
                                Cancel
                              </Button>
                              <CircularProgress
                                aria-label="Loading..."
                                classNames={{
                                  svg: "text-[--ul-bg-primary] w-14 h-14",
                                }}
                                showValueLabel={true}
                                size="lg"
                                value={extractingPercentage || 0}
                              />
                              <span className="text-[--ul-text-primary] font-semibold flex items-center gap-2">
                                <span>Extracting Chemicals</span>{" "}
                                <div className="dot-flashing ml-3 mt-1" />
                              </span>
                            </div>
                          ) : (
                            <Button
                              className="bg-white text-xl font-normal rounded-xl bg-[--ul-bg-primary] text-white font-poppins p-4"
                              disabled={isLoading}
                              isLoading={isLoading}
                              type="submit"
                            >
                              Extract
                            </Button>
                          )}
                        </div>
                      </Form>
                    )}
                  </ReactHookForm>
                </div>
                <div className="extraction-data">
                  {error ? (
                    <div className="text-white text-center mt-4 font-medium border border-red-200 bg-red-500/90 rounded-md p-2 mt-2">
                      {error}
                    </div>
                  ) : extractionData && Object.keys(extractionData)?.length ? (
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
                        {dataActiveTab === null || dataActiveTab === 'chemical_extraction' ?
                          <div className="space-y-6 mt-4">
                            <div className="flex justify-between items-center mt-2">
                              <h2 className="text-2xl font-bold text-gray-800">
                                Extracted Chemicals
                              </h2>
                            </div>
                            {extractionData.list_ids &&
                              extractionData.list_ids.length ? (
                              extractionData.list_ids.map(
                                (listId: any, index: number) => {
                                  // const actual_chemicals =
                                  //   (extractionData?.result?.actual_chemicals ||
                                  //     [])?.[index] || [];
                                  // const extracted_chemicals =
                                  //   (extractionData?.result?.extracted_chemicals ||
                                  //     [])?.[index] || [];
                                  const actual_chemicals_rr =
                                    (extractionData?.result?.actual_chemicals_rr ||
                                      [])?.[index] || [];
                                  const extracted_chemicals_rr =
                                    (extractionData?.result?.extracted_chemicals_rr ||
                                      [])?.[index] || [];
                                      const actual_chemicals =
                                   (extractionData?.result?.results || [])[index]?.actual_chemicals || [];;
                                  const extracted_chemicals =
                                    (extractionData?.result?.results || [])[index]?.extracted_chemicals || [];
                                  // const metrics =
                                  //   extractionData?.result?.metrics?.[index] || {};
                                  // const metricsRR =
                                  //   extractionData?.result?.metrics_rr?.[index] || {};
                                  const precision =
                                    extractionData?.result?.results?.[index]?.precision || '';
                                  const recall =
                                    extractionData?.result?.results?.[index]?.recall || '';
                                    console.log({precision, recall})
                                  return (
                                    <>
                                      <MetricsOverviewV1
                                        key={listId}
                                        actualChemicals={actual_chemicals || []}
                                        // actualChemicalsRR={actual_chemicals_rr || []}
                                        extractedChemicals={extracted_chemicals || []}
                                        // extractedChemicalsRR={
                                        //   extracted_chemicals_rr || []
                                        // }
                                        listId={listId}
                                        precision={precision}
                                        recall={recall}
                                        // metrics={metrics}
                                        // metricsRR={metricsRR}
                                      />
                                    </>
                                  );
                                }
                              )
                            ) : (
                              <>
                                <ChemicalResultsSection
                                  chemicalCategories={[
                                    {
                                      data: extractedChemicalsList,
                                      title: `Cas Extracted Chemicals (${extractedChemicalsList?.length || 0})`,
                                      color: "text-blue-500",
                                      icon: Circle,
                                      columns: Object.keys(
                                        extractedChemicalsList?.[0] || {}
                                      ).map((key: string) => {
                                        return {
                                          key,
                                          className: "text-[--ul-text-primary]",
                                          label:
                                            key.charAt(0).toUpperCase() +
                                            key.slice(1),
                                          ...((key.toLowerCase() === "cas" ||
                                            key.toLowerCase() === "synonyms") && {
                                            render: (value: string | string[]) => {
                                              if (
                                                !value ||
                                                (Array.isArray(value) &&
                                                  value.length === 0)
                                              )
                                                return "";

                                              const valuesArray = Array.isArray(value)
                                                ? value
                                                : value.split(/,\s*/).filter(Boolean); // split string into array if needed

                                              return (
                                                <>
                                                  {valuesArray?.map(
                                                    (elem: any): any => (
                                                      <Chip className="mr-2">
                                                        {elem}
                                                      </Chip>
                                                    )
                                                  )}
                                                </>
                                              );
                                            },
                                          }),
                                        };
                                      }),
                                    },
                                  ]}
                                />
                              </>
                            )}

                          </div> : <div className="text-medium">
                            <p className="font-bold text-lg mb-2">Highlighted Text</p>

                            {extractionData?.result?.highlight_text && (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    extractionData?.result?.highlight_text,
                                }}
                              />
                            )}
                          </div>}
                      </>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {activeTab === "metrics" ? (
          <>
            <div className="">
              {metricsLoading ? (
                <LoadingSpinner />
              ) : (
                <MetricsPanel
                  proccessData={processesData}
                  onSelect={(id: string, tab: string) =>
                    onDocumentChange(id, tab)
                  }
                />
              )}
            </div>
          </>
        ) : null}

        {activeTab === "results" ? (
          <>
            <div className="mt-12">
              <p className="text-3xl">Documents</p>
              <Select
                className="mb-2 mt-3"
                classNames={{
                  label:
                    "font-medium text-gray-800 absolute top-[2px] left-4 bg-white",
                  trigger:
                    "shadow-none bg-white  data-[hover=true]:bg-white rounded-md border-gray-500 border-1",
                }}
                label="Document"
                labelPlacement="inside"
                placeholder="Select Document"
                selectedKeys={selectedVersion}
                size="md"
                onChange={(e) => {
                  if (e.target.value) {
                    onDocumentChange(e.target.value, activeTab);
                  }
                }}
              >
                {documentList?.map((version) => (
                  <SelectItem key={version._id}>{version.filename}</SelectItem>
                ))}
              </Select>
            </div>

            <DocumentDetails
              isLoading={documentLoading}
              selected={selectedDocument}
            />
          </>
        ) : null}

        {/* <ChemicalTable data={mockChemicalData} columns={columns} /> */}
      </div>

    </section>
  );
};

export default Chemadvisor;
