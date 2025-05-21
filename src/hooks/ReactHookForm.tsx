import { ReactNode } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ObjectSchema } from "yup";
export type FormMethods = UseFormReturn<any> & { formSubmit: () => void };
interface ReactHookFormProps {
  children: (methods: FormMethods) => ReactNode;
  defaultValues?: any;
  onSubmit: (data: any) => void;
  validationSchema?: ObjectSchema<any>;
}

export const getErrorMessage = (error: any) => {
  if (error?.message) return error.message;
  return null;
};
export const renderErrorMessage = (error: any) => {
  if (error?.message)
    return (
      <div
        data-slot="error-message"
        className="text-sm text-red-500 mt-2"
        id="react-aria6615368800-:r25:"
      >
        {error.message}
      </div>
    );
  return null;
};

const ReactHookForm = ({
  children,
  defaultValues = {},
  onSubmit,
  validationSchema,
}: ReactHookFormProps) => {
  const methods = useForm({
    defaultValues,
    mode: "onChange",
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const formSubmit: any = methods.handleSubmit((data) => {
    onSubmit(data);
  });
  return (
    <FormProvider {...methods}>
      {children({ ...methods, formSubmit })}
    </FormProvider>
  );
};

export default ReactHookForm;
