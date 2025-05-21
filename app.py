doc_ids = []
    overall_metrics = []
    overall_metrics_rr = []
    matched = []
    missed = []
    extra = []
    matched_rr = []
    missed_rr = []
    extra_rr = []
    for doc_data in config.chemAdvisor_db["documents"].find({"file_path": {"$ne": "", "$exists": True}, "version": selected_version}):
        if "metrics" in doc_data:
            doc_ids.append(doc_data["doc_id"])
            for i, list_id in enumerate(doc_data["list_ids"]):
                if list_id not in overall_metrics:
                    matched.append(len(doc_data['metrics'][i]['CAS']["matched"]))
                    missed.append(len(doc_data['metrics'][i]['CAS']["missed"]))
                    extra.append(len(doc_data['metrics'][i]['CAS']["extra"]))
                    matched_rr.append(len(doc_data['metrics_rr'][i]['CAS']["matched"]))
                    missed_rr.append(len(doc_data['metrics_rr'][i]['CAS']["missed"]))
                    extra_rr.append(len(doc_data['metrics_rr'][i]['CAS']["extra"]))

                    overall_metrics.append({"file_name": doc_data['file_path'].split("/")[-1], "list_id": int(list_id), "precision": str(round(doc_data["metrics"][i]['CAS']['precision']*100, 2))+"%", "recall": str(round(doc_data["metrics"][i]['CAS']['recall']*100, 2))+"%", "extracted_chemicals": len(doc_data["extracted_chemicals"][i]), "actual_chemicals": len(doc_data["actual_chemicals"][i]), "matched": len(doc_data['metrics'][i]['CAS']["matched"]), "extra": len(doc_data['metrics'][i]['CAS']["extra"]), "missing": len(doc_data['metrics'][i]['CAS']["missed"])})
                    overall_metrics_rr.append({"file_name": doc_data['file_path'].split("/")[-1], "list_id": int(list_id), "precision": str(round(doc_data["metrics_rr"][i]['CAS']['precision']*100, 2))+"%", "recall": str(round(doc_data["metrics_rr"][i]['CAS']['recall']*100, 2))+"%", "extracted_chemicals": len(doc_data["extracted_chemicals_rr"][i]), "actual_chemicals": len(doc_data["actual_chemicals_rr"][i]), "matched": len(doc_data['metrics_rr'][i]['CAS']["matched"]), "extra": len(doc_data['metrics_rr'][i]['CAS']["extra"]), "missing": len(doc_data['metrics_rr'][i]['CAS']["missed"])})
    
    cas_precision = sum(matched) / (sum(matched) + sum(extra))
    cas_recall = sum(matched) / (sum(matched) + sum(missed))
    rr_precision = sum(matched_rr) / (sum(matched_rr) + sum(extra_rr))
    rr_recall = sum(matched_rr) / (sum(matched_rr) + sum(missed_rr))

    cas_metrics_json = {"No. of Docs": len(doc_ids), "No. of Lists": len(matched), "Overall Precision CAS": str(round(cas_precision*100, 2))+"%", "Overall Recall CAS": str(round(cas_recall*100, 2))+"%", "Overall Extracted CAS": sum(matched) + sum(extra), "Overall Actual CAS": sum(matched) + sum(missed), "Overall Matched CAS": str(sum(matched)), "Overall Extra CAS": str(sum(extra)), "Overall Missing CAS": str(sum(missed)), }
    rr_metrics_json = {"No. of Docs": len(doc_ids), "No. of Lists": len(matched_rr), "Overall Precision RR": str(round(rr_precision*100, 2))+"%", "Overall Recall RR": str(round(rr_recall*100, 2))+"%",  "Overall Extracted RR": sum(matched_rr) + sum(extra_rr), "Overall Actual RR": sum(matched_rr) + sum(missed_rr), "Overall Matched RR": str(sum(matched_rr)), "Overall Extra RR": str(sum(extra_rr)), "Overall Missing RR": str(sum(missed_rr))}
    
    cas_metrics_df = pd.DataFrame(cas_metrics_json, index=[0])
    rr_metrics_df = pd.DataFrame(rr_metrics_json, index=[0])

    overall_metrics_df = pd.DataFrame(overall_metrics)
    overall_metrics_rr_df = pd.DataFrame(overall_metrics_rr)
