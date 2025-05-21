
interface HighlightedTextProps {
  regulationText: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ regulationText }) => {
  console.log("Regulation Text:", regulationText);
  // These would normally be dynamically generated from the backend
  // const matchedChemicals = ["ABAMECTIN"];
  // const extraChemicals = [
  //   "abamectin", "ABSCISIC ACID", "ACEQUINOCYL", "ACETIC ACID",
  //   "acetic acid", "CH3COOH", "ACETONE", "ACRIFLAVINIUM CHLORIDE", "acriflavinium chloride"
  // ];
  // const missedChemicals: string[] = [];

  // Simple highlighting logic (in a real app, this would be more sophisticated)
  // const renderHighlightedText = () => {
  //   let text = typeof(regulationText) === 'object' ? (regulationText||"").join('\n') : regulationText;
    
  //   // Replace matched chemicals (green background)
  //   matchedChemicals.forEach(chemical => {
  //     text = text.replace(
  //       new RegExp(chemical, 'g'),
  //       `<span class="bg-green-400 px-1 rounded">${chemical}</span>`
  //     );
  //   });
    
  //   // Replace extra chemicals (blue background)
  //   extraChemicals.forEach(chemical => {
  //     // Avoid double highlighting
  //     if (!matchedChemicals.includes(chemical)) {
  //       text = text.replace(
  //         new RegExp(chemical, 'gi'),
  //         `<span class="bg-blue-400 px-1 rounded text-white">${chemical}</span>`
  //       );
  //     }
  //   });
    
  //   // Replace missed chemicals (orange background) - none in this sample
  //   missedChemicals.forEach(chemical => {
  //     text = text.replace(
  //       new RegExp(chemical, 'g'),
  //       `<span class="bg-orange-400 px-1 rounded">${chemical}</span>`
  //     );
  //   });
    
  //   return text;
  // };

  return (
    <div className="space-y-4 text-gray-800">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 mr-2 rounded"></div>
          <span className="text-sm">Matched Chemical</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-400 mr-2 rounded"></div>
          <span className="text-sm">Extra Chemical</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-400 mr-2 rounded"></div>
          <span className="text-sm">Missed Chemical</span>
        </div>
      </div>

      <div 
        className="bg-white border rounded-md p-4 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: regulationText }}
      />
    </div>
  );
};

export default HighlightedText;