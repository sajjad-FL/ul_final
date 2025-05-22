import { Textarea } from "@heroui/input";

const TextInputTab = ({ register,  isLoading,name }: any) => {
  return (
    <div className="my-2 mt-7">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Enter a regulation source text.
        </h3>
        <Textarea
          id="regulation-text"
          placeholder="Enter the regulation text here..."
          classNames={{
            inputWrapper:
              "min-h-[200px] bg-white text-gray-800 data-[hover=true]:bg-white data-[focus=true]:bg-white focus:ring-0 focus:border-gray-300 border-1 group-data-[focus=true]:bg-white ",
            input:
              "min-h-[200px] bg-white text-gray-800 data-[hover=true]:bg-white data-[focus=true]:bg-white focus:ring-0 focus:border-gray-300 group-data[has-value=true]:text-gray-800 group-data-[has-value=true]:text-gray-800",
          }}
          {...register(name)}
          isDisabled={isLoading}
        />
      </div>
    </div>
  );
};

export default TextInputTab;
