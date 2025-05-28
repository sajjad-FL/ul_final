import React from "react";

const HtmlRenderer = ({
  htmlContent = "<h1>Hello <span style='color: red;'>World</span></h1>",
}) => {
  return (
    <div className="rounded-md mt-2">
      <h2 className="text-lg flex items-center gap-2 mb-6 text-gray-800">
        {/* <BarChart2 className="text-purple-500" size={20} /> */}
        <span className="font-bold">Highlighted Chemicals </span>
      </h2>
      <div dangerouslySetInnerHTML={{ __html: "<h1>Hello <span style='color: red;'>World</span></h1>" }} />;
    </div>
  )
};

export default HtmlRenderer;
