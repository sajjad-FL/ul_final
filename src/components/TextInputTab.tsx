
import { Textarea, } from "@heroui/input";


const TextInputTab = ({ regulationText, setRegulationText }: any) => {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <label
          htmlFor="regulation-text"
          className="text-sm font-medium text-gray-700 mb-2"
        >
          Enter a regulation source text.
        </label>
        <Textarea
          id="regulation-text"
          value={regulationText}
          onChange={(e) => setRegulationText(e.target.value)}
          classNames={{
            inputWrapper:
              "min-h-[300px] bg-white text-gray-800 data-[hover=true]:bg-white data-[focus=true]:bg-white focus:ring-0 focus:border-gray-300 border-1 group-data-[focus=true]:bg-white ",
            input:
              "min-h-[300px] bg-white text-gray-800 data-[hover=true]:bg-white data-[focus=true]:bg-white focus:ring-0 focus:border-gray-300 group-data[has-value=true]:text-gray-800 group-data-[has-value=true]:text-gray-800",
          }}
        />
      </div>
    </div>
  );
};

export default TextInputTab;
