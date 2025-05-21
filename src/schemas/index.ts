import * as Yup from "yup";

export const textSchema = Yup.object().shape({
  input_data: Yup.string()
    .required("regulation text is required")
    .test(
      "not-only-whitespace",
      "regulation text cannot be just whitespace",
      (value: any) => value && value.trim().length > 0
    ),
 list_data: Yup.array()
    .of(Yup.string().required("List ID is required"))
    .min(1, "atleast one list id is required"),
});
export const fileSchema = Yup.object().shape({
  file: Yup.mixed().required("File is required"),
  list_data: Yup.array()
    .of(Yup.string().required("List ID is required"))
    .min(1, "atleast one list id is required"),
});
