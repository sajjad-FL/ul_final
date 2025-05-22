"use client";

import { Button } from "@heroui/button";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-hook-form";
import toast from "react-hot-toast";
import { TagsInput } from "react-tag-input-component";
import { Select, SelectItem } from "@heroui/select";
import { Circle } from "lucide-react";

import DocumentDetails from "./DocumentDetails";

import FileUploadTab from "@/components/FileUploadTab";
import {
  getExtractedData,
  getProcessesByVersion,
  getVersions,
  uploadFile,
  uploadText,
} from "@/services/APIServices";
import { fileSchema, textSchema } from "@/schemas";
import ReactHookForm, {
  FormMethods,
  getErrorMessage,
} from "@/hooks/ReactHookForm";
import TextInputTab from "@/components/TextInputTab";
import { SkeletonLoading } from "@/components/SkeletonLoading";
import MetricsOverviewV1 from "@/components/Metrics_v1";
import TabNavigation from "@/components/TabNavigation";
import MetricsPanel from "@/components/MetricsPanel";
import ChemicalResultsSection from "@/components/ChemicalResultsSection";

const Chemadvisor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<any>(null);
  const [homeActiveTab, setHomeActiveTab] = useState<any>(null);
  const [extractionData, setExtractionData] = useState<any>({});
  const [extractionMetricsData, setExtractionMetricsData] = useState<any>([]);
  const [listIds, setListIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<any[]>(["v1"]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const dataLoadingRef = useRef<any>(null);

  const [processesData, setProcessesData] = useState<any>({});

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
    toast.success("Chemical Extraction Started...");
    setIsLoading(true);
    setError(null);
    try {
      const listIds = values.list_data || [];
      const inputData = values.input_data;
      const { data, status } = await uploadText(inputData, listIds);

      if (status === 200 && data) {
        const textExtractionData = {
          ...data,
        };

        setExtractionData(textExtractionData);
        setIsLoading(false);
        toast.success("Chemical Extraction Completed");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Something went wrong";

      setError(errorMsg);
      toast.error(`Chemical Extraction Failed: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };
  const fileExtract = async (values: any) => {
    toast.success("Chemical Extraction Started...");
    setIsLoading(true);
    setError(null);
    try {
      const listIds = values.list_data || [];
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
          setExtractionData(textExtractionData);
          toast.success("Chemical Extraction Completed!");
          setIsLoading(false);
        }
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Something went wrong";

      setError(errorMsg);
      toast.error(`Chemical Extraction Failed: ${errorMsg}`);
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

              extractionData._id = extractionData.id;
              setExtractionData(extractionData);
              setIsLoading(false);
              dataLoadingRef.current && clearInterval(dataLoadingRef.current);
            }
            if (data.status === "failed") {
              setExtractionData({});
              setIsLoading(false);
              dataLoadingRef.current && clearInterval(dataLoadingRef.current);
            }
          }
        } else {
          console.error("Error ooccurred while fetching the data!");
          setError("Error ooccurred while fetching the data!");
          // dataLoadingRef.current && clearInterval(dataLoadingRef.current);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Error ooccurred while fetching the data!");
        console.error(err);
        // dataLoadingRef.current && clearInterval(dataLoadingRef.current);
      });
  };

  const getMetricsVersionData = async () => {
    const res = await getProcessesByVersion("7y90");
    // let data: DocData[] = res?.data || [];
    let data: DocData[] = res || [];

    // const data: DocData[] = []; // your input data
    const overall_metrics: SummaryMetrics[] = [];
    const overall_metrics_rr: SummaryMetrics[] = [];

    const matched: number[] = [];
    const missed: number[] = [];
    const extra: number[] = [];

    const matched_rr: number[] = [];
    const missed_rr: number[] = [];
    const extra_rr: number[] = [];
    const no_docs = data.length;
    let no_lists = 0;

    data.map((each: any) => {
      let _id = each?._id?.$oid;

      if (each.result?.metrics) {
        const listLength = each.list_ids.length || 1;
        const doc = each.result || {};

        each.list_ids.forEach((list_id: string, i: number) => {
          no_lists++;
          const file_name = each.file_path?.split("/").pop() || "";
          const cas = doc.metrics[i].CAS;
          const cas_rr = doc.metrics_rr[i].CAS;

          matched.push(cas.matched.length);
          missed.push(cas.missed.length);
          extra.push(cas.extra.length);

          matched_rr.push(cas_rr.matched.length);
          missed_rr.push(cas_rr.missed.length);
          extra_rr.push(cas_rr.extra.length);

          overall_metrics.push({
            file_name,
            list_length: listLength,
            list_id: parseInt(list_id),
            precision: `${(cas.precision * 100).toFixed(2)}%`,
            recall: `${(cas.recall * 100).toFixed(2)}%`,
            extracted_chemicals:
              each?.result?.extracted_chemicals[i].length || 0,
            actual_chemicals: each?.result?.actual_chemicals?.[i].length || 0,
            matched: cas.matched.length,
            extra: cas.extra.length,
            missing: cas.missed.length,
            _id,
          });

          overall_metrics_rr.push({
            file_name,
            list_length: listLength,
            list_id: parseInt(list_id),
            precision: `${(cas_rr.precision * 100).toFixed(2)}%`,
            recall: `${(cas_rr.recall * 100).toFixed(2)}%`,
            extracted_chemicals: each?.result?.extracted_chemicals_rr[i].length,
            actual_chemicals: each?.result?.actual_chemicals_rr[i].length,
            matched: cas_rr.matched.length,
            extra: cas_rr.extra.length,
            missing: cas_rr.missed.length,
            _id,
          });
        });
      }

      return each;
    });

    // Helper function
    const sum = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0);

    const safeDivide = (numerator: number, denominator: number): number => {
      return denominator === 0 ? 0 : numerator / denominator;
    };

    const cas_precision = safeDivide(sum(matched), sum(matched) + sum(extra));
    const cas_recall = safeDivide(sum(matched), sum(matched) + sum(missed));
    const rr_precision = safeDivide(
      sum(matched_rr),
      sum(matched_rr) + sum(extra_rr),
    );
    const rr_recall = safeDivide(
      sum(matched_rr),
      sum(matched_rr) + sum(missed_rr),
    );

    const totalMatched = sum(matched);
    const totalExtra = sum(extra);
    const totalMissed = sum(missed);
    const totalMatchedRR = sum(matched_rr);
    const totalExtraRR = sum(extra_rr);
    const totalMissedRR = sum(missed_rr);

    const cas_metrics_json = {
      no_docs: no_docs,
      list_length: matched.length,
      overall_precision_cas: `${(cas_precision * 100).toFixed(2)}%`,
      overall_recall_cas: `${(cas_recall * 100).toFixed(2)}%`,
      overall_extracted_cas: totalMatched + totalExtra,
      overall_actual_cas: totalMatched + totalMissed,
      overall_matched_cas: totalMatched.toString(),
      overall_extra_cas: totalExtra.toString(),
      overall_missing_cas: totalMissed.toString(),
    };

    const rr_metrics_json = {
      no_of_docs: no_docs,
      no_of_lists: matched_rr.length,
      overall_precision_rr: `${(rr_precision * 100).toFixed(2)}%`,
      overall_recall_rr: `${(rr_recall * 100).toFixed(2)}%`,
      overall_extracted_rr: totalMatchedRR + totalExtraRR,
      overall_actual_rr: totalMatchedRR + totalMissedRR,
      overall_matched_rr: totalMatchedRR.toString(),
      overall_extra_rr: totalExtraRR.toString(),
      overall_missing_rr: totalMissedRR.toString(),
    };

    setProcessesData({
      cas_precision,
      cas_recall,
      rr_precision,
      rr_recall,
      matched,
      missed,
      extra,
      matched_rr,
      missed_rr,
      extra_rr,
      overall_metrics,
      overall_metrics_rr,
      no_docs,
      no_lists,
      cas_metrics_json,
      rr_metrics_json,
    });
  };

  useEffect(() => {
    getMetricsVersionData();
  }, []);

  const getVersionData = async () => {
    await getVersions()
      .then((res) => {
        if (res) {
          if (res.status === 200) {
            let data = res?.data || {};

            data = data.map((each: any) => {
              let _id = each?._id?.$oid;

              return {
                ...each,
                _id,
                label: each.version,
                value: _id,
              };
            });
            if (data.length) {
              setSelectedVersion(data[0].value);
              getProcessDataByVersion(data[0]._id);
            }

            setVersions(data);
          }
        } else {
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const getProcessDataByVersion = async (version_id: string) => {
    await getProcessesByVersion(version_id)
      .then((res) => {
        if (res) {
          if (res.status === 200) {
            // let data: DocData[] = res?.data || [];
            let data: DocData[] = extractionMetricsData || [];

            // const data: DocData[] = []; // your input data
            console.log(data);
            const overall_metrics: SummaryMetrics[] = [];
            const overall_metrics_rr: SummaryMetrics[] = [];

            const matched: number[] = [];
            const missed: number[] = [];
            const extra: number[] = [];

            const matched_rr: number[] = [];
            const missed_rr: number[] = [];
            const extra_rr: number[] = [];
            const no_docs = data.length;
            let no_lists = 0;

            data.map((each: any) => {
              console.log({ each });
              let _id = each?._id?.$oid;

              if (each.result?.metrics) {
                const listLength = each.list_ids.length || 1;
                const doc = each.result || {};

                each.list_ids.forEach((list_id: string, i: number) => {
                  no_lists++;
                  const file_name = each.file_path.split("/").pop() || "";
                  const cas = doc.metrics[i].CAS;
                  const cas_rr = doc.metrics_rr[i].CAS;

                  matched.push(cas.matched.length);
                  missed.push(cas.missed.length);
                  extra.push(cas.extra.length);

                  matched_rr.push(cas_rr.matched.length);
                  missed_rr.push(cas_rr.missed.length);
                  extra_rr.push(cas_rr.extra.length);

                  overall_metrics.push({
                    file_name,
                    list_length: listLength,
                    list_id: parseInt(list_id),
                    precision: `${(cas.precision * 100).toFixed(2)}%`,
                    recall: `${(cas.recall * 100).toFixed(2)}%`,
                    extracted_chemicals:
                      each?.result?.extracted_chemicals[i].length || 0,
                    actual_chemicals:
                      each?.result?.actual_chemicals?.[i].length || 0,
                    matched: cas.matched.length,
                    extra: cas.extra.length,
                    missing: cas.missed.length,
                    _id,
                  });

                  overall_metrics_rr.push({
                    file_name,
                    list_length: listLength,
                    list_id: parseInt(list_id),
                    precision: `${(cas_rr.precision * 100).toFixed(2)}%`,
                    recall: `${(cas_rr.recall * 100).toFixed(2)}%`,
                    extracted_chemicals:
                      each?.result?.extracted_chemicals_rr[i].length,
                    actual_chemicals:
                      each?.result?.actual_chemicals_rr[i].length,
                    matched: cas_rr.matched.length,
                    extra: cas_rr.extra.length,
                    missing: cas_rr.missed.length,
                    _id,
                  });
                });
              }

              return each;
            });

            // Helper function
            const sum = (arr: number[]) =>
              arr.reduce((acc, val) => acc + val, 0);

            const safeDivide = (
              numerator: number,
              denominator: number,
            ): number => {
              return denominator === 0 ? 0 : numerator / denominator;
            };

            const cas_precision = safeDivide(
              sum(matched),
              sum(matched) + sum(extra),
            );
            const cas_recall = safeDivide(
              sum(matched),
              sum(matched) + sum(missed),
            );
            const rr_precision = safeDivide(
              sum(matched_rr),
              sum(matched_rr) + sum(extra_rr),
            );
            const rr_recall = safeDivide(
              sum(matched_rr),
              sum(matched_rr) + sum(missed_rr),
            );

            const totalMatched = sum(matched);
            const totalExtra = sum(extra);
            const totalMissed = sum(missed);
            const totalMatchedRR = sum(matched_rr);
            const totalExtraRR = sum(extra_rr);
            const totalMissedRR = sum(missed_rr);

            const cas_metrics_json = {
              no_docs: no_docs,
              list_length: matched.length,
              overall_precision_cas: `${(cas_precision * 100).toFixed(2)}%`,
              overall_recall_cas: `${(cas_recall * 100).toFixed(2)}%`,
              overall_extracted_cas: totalMatched + totalExtra,
              overall_actual_cas: totalMatched + totalMissed,
              overall_matched_cas: totalMatched.toString(),
              overall_extra_cas: totalExtra.toString(),
              overall_missing_cas: totalMissed.toString(),
            };

            const rr_metrics_json = {
              no_of_docs: no_docs,
              no_of_lists: matched_rr.length,
              overall_precision_rr: `${(rr_precision * 100).toFixed(2)}%`,
              overall_recall_rr: `${(rr_recall * 100).toFixed(2)}%`,
              overall_extracted_rr: totalMatchedRR + totalExtraRR,
              overall_actual_rr: totalMatchedRR + totalMissedRR,
              overall_matched_rr: totalMatchedRR.toString(),
              overall_extra_rr: totalExtraRR.toString(),
              overall_missing_rr: totalMissedRR.toString(),
            };

            setProcessesData({
              cas_precision,
              cas_recall,
              rr_precision,
              rr_recall,
              matched,
              missed,
              extra,
              matched_rr,
              missed_rr,
              extra_rr,
              overall_metrics,
              overall_metrics_rr,
              no_docs,
              no_lists,
              cas_metrics_json,
              rr_metrics_json,
            });
          }
        } else {
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getVersionData();
  }, []);
  console.log(extractionData, "extractionData");
  console.log({ activeTab });

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
    //   label: "Results",
    //   value: "results",
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
    },
    {
      label: "File Upload",
      value: "file",
      // onClick: () => clearData(),
    },
  ];

  console.log({ extractionData, listIds });

  const hasListIds = Array.isArray(listIds) && listIds.length > 0;

  const extractedChemicalsList =
    extractionData?.result?.extracted_chemicals || [];

  return (
    <section className="">
      <div className="container mx-auto px-2 py-2 w-full mt-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center w-full">
          chemADVISOR
        </h1>

        <TabNavigation
          activeTab={activeTab || containerTabs?.[0]?.value}
          customClass={""}
          setActiveTab={setActiveTab}
          tabs={containerTabs}
        />

        {activeTab === "home" || activeTab === null ? (
          <>
            <TabNavigation
              activeTab={homeActiveTab || homeTabs?.[0]?.value}
              customClass={"mt-3"}
              setActiveTab={setHomeActiveTab}
              tabs={homeTabs}
            />
            {homeActiveTab === "text" || homeActiveTab === null ? (
              <div>
                <ReactHookForm
                  defaultValues={{ input_data: "", list_data: [] }}
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
                  }: FormMethods) => (
                    <Form onSubmit={formSubmit}>
                      <TextInputTab
                        errors={errors}
                        name="input_data"
                        register={register}
                      />
                      {errors?.input_data && errors?.input_data?.message && (
                        <span className="error text-red-500 px-6 text-sm">
                          {getErrorMessage(errors?.input_data)}
                        </span>
                      )}

                      <div className="mt-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-2 ">
                          Enter a list ID.
                        </h3>
                        <TagsInput
                          name="list_data"
                          placeHolder="Enter a list ID and press enter"
                          separators={[",", " ", "Enter", "Tab"]}
                          value={getValues().list_data || []}
                          onChange={(ids: string[]) => {
                            setListIds(ids);
                            setValue("list_data", ids, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            trigger("list_data");
                          }}
                        />
                        {errors?.list_data && errors?.list_data?.message && (
                          <span className="error text-red-500  text-sm">
                            {getErrorMessage(errors?.list_data)}
                          </span>
                        )}
                      </div>

                      <div className="mb-1 mt-4">
                        <Button
                          className="bg-white  font-semibold py-2 px-4  rounded-md bg-[#8a1721] text-white"
                          disabled={isLoading}
                          isLoading={isLoading}
                          type="submit"
                        >
                          Extract Chemicals
                        </Button>
                      </div>
                    </Form>
                  )}
                </ReactHookForm>

                <div className="extraction-data">
                  {isLoading ? (
                    <SkeletonLoading />
                  ) : error ? (
                    <div className="text-white text-center mt-4 font-medium border border-red-200 bg-red-500/90 rounded-md p-2 mt-2">
                      {error}
                    </div>
                  ) : extractionData && Object.keys(extractionData)?.length ? (
                    <div className="space-y-6 mt-4">
                      <div className="flex justify-between items-center mt-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                          Extracted Chemicals
                        </h2>
                      </div>
                      {hasListIds ? (
                        listIds?.map((listId: any, index: number) => {
                          const actual_chemicals =
                            (extractionData?.result?.actual_chemicals || [])?.[
                              index
                            ] || [];
                          const extracted_chemicals =
                            (extractionData?.result?.extracted_chemicals ||
                              [])?.[index] || [];
                          const actual_chemicals_rr =
                            (extractionData?.result?.actual_chemicals_rr ||
                              [])?.[index] || [];
                          const extracted_chemicals_rr =
                            (extractionData?.result?.extracted_chemicals_rr ||
                              [])?.[index] || [];
                          const metrics =
                            extractionData?.result?.metrics?.[index] || {};
                          const metricsRR =
                            extractionData?.result?.metrics_rr?.[index] || {};

                          return (
                            <MetricsOverviewV1
                              key={listId}
                              actualChemicals={actual_chemicals}
                              actualChemicalsRR={actual_chemicals_rr}
                              extractedChemicals={extracted_chemicals}
                              extractedChemicalsRR={extracted_chemicals_rr}
                              listId={listId}
                              metrics={metrics}
                              metricsRR={metricsRR}
                            />
                          );
                        })
                      ) : (
                        <ChemicalResultsSection
                          chemicalCategories={[
                            {
                              data: extractedChemicalsList,
                              title: `Cas Extracted Chemicals (${extractedChemicalsList?.length || 0})`,
                              color: "text-blue-500",
                              icon: Circle,
                              columns: Object.keys(extractedChemicalsList?.[0]),
                            },
                          ]}
                        />
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : null}

            {homeActiveTab === "file" ? (
              <>
                <div className="file-upload-section border rounded p-4">
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
                      formState: { errors },
                    }: FormMethods) => (
                      <Form onSubmit={formSubmit}>
                        <div className="mb-3">
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

                        <div className="px-6 mt-2">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Enter a list ID.
                          </h3>
                          <TagsInput
                            name="list_data"
                            placeHolder="Enter a list ID and press enter"
                            separators={[",", " ", "Enter", "Tab"]}
                            value={getValues().list_data || []}
                            onChange={(ids: string[]) => {
                              setListIds(ids);
                              setValue("list_data", ids, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              trigger("list_data");
                            }}
                          />
                          {errors?.list_data && errors?.list_data?.message && (
                            <span className="error text-red-500 text-sm">
                              {getErrorMessage(errors.list_data)}
                            </span>
                          )}
                        </div>

                        <div className="mb-1 mt-4 px-6">
                          <Button
                            className="bg-white font-semibold py-2 px-4 rounded-md bg-[rgb(138,23,33)] text-white"
                            disabled={isLoading}
                            isLoading={isLoading}
                            type="submit"
                          >
                            Extract Chemicals
                          </Button>
                        </div>
                      </Form>
                    )}
                  </ReactHookForm>
                </div>
                <div className="extraction-data">
                  {isLoading ? (
                    <SkeletonLoading />
                  ) : error ? (
                    <div className="text-white text-center mt-4 font-medium border border-red-200 bg-red-500/90 rounded-md p-2 mt-2">
                      {error}
                    </div>
                  ) : extractionData && Object.keys(extractionData)?.length ? (
                    <div className="space-y-6 mt-4">
                      <div className="flex justify-between items-center mt-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                          Extracted Chemicals
                        </h2>
                      </div>
                      {hasListIds ? (
                        listIds.map((listId: any, index: number) => {
                          const actual_chemicals =
                            extractionData?.result?.actual_chemicals[index] ||
                            [];
                          const extracted_chemicals =
                            extractionData?.result?.extracted_chemicals[
                              index
                            ] || [];
                          const actual_chemicals_rr =
                            extractionData?.result?.actual_chemicals_rr[
                              index
                            ] || [];
                          const extracted_chemicals_rr =
                            extractionData?.result?.extracted_chemicals_rr[
                              index
                            ] || [];
                          const metrics =
                            extractionData?.result?.metrics[index] || {};
                          const metricsRR =
                            extractionData?.result?.metrics_rr[index] || {};

                          return (
                            <MetricsOverviewV1
                              key={listId}
                              actualChemicals={actual_chemicals || []}
                              actualChemicalsRR={actual_chemicals_rr || []}
                              extractedChemicals={extracted_chemicals || []}
                              extractedChemicalsRR={
                                extracted_chemicals_rr || []
                              }
                              listId={listId}
                              metrics={metrics}
                              metricsRR={metricsRR}
                            />
                          );
                        })
                      ) : (
                        <ChemicalResultsSection
                          chemicalCategories={[
                            {
                              data: extractedChemicalsList,
                              title: `Cas Extracted Chemicals (${extractedChemicalsList?.length || 0})`,
                              color: "text-blue-500",
                              icon: Circle,
                              columns: Object.keys(extractedChemicalsList?.[0]),
                            },
                          ]}
                        />
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : null}
          </>
        ) : null}

        {activeTab === "metrics" ? (
          <>
            <div className="">
              <MetricsPanel proccessData={processesData} />
            </div>
          </>
        ) : null}

        {activeTab === "results" ? (
          <>
            <div className="mt-12">
              <Select
                className="mb-2 mt-3"
                classNames={{
                  label: "font-bold text-gray-800",
                }}
                label="Select  Version"
                labelPlacement="outside"
                placeholder="Select Version"
                size="md"
                value={selectedVersion}
                onChange={(e) => {
                  setSelectedVersion(e.target.value);
                  if (e.target.value) {
                    getProcessDataByVersion(e.target.value);
                  }
                }}
              >
                {versions?.map((version) => (
                  <SelectItem key={version.value}>{version.label}</SelectItem>
                ))}
              </Select>
            </div>

            <DocumentDetails />
          </>
        ) : null}
      </div>
    </section>
  );
};

export default Chemadvisor;
