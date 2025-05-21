
const ChemicalsTable = ({
  items,
  columns,
}: {
  items: any[];
  columns: string[];
}) => {
  console.log('items', items);
  if (items && items.length === 0) {
    return (
      <div className="bg-gray-50 p-3 text-center text-gray-500 flex items-center justify-center">
        No Chemicals
      </div>
    );
  }

  return (
    <table className="min-w-full table-fixed">
      <thead>
        <tr className="bg-gray-50 border-b sticky top-0 min-w-[120px]">
          {columns.map((column, index) => (
            <th
              key={index}
              className="py-2 px-3 text-left text-sm font-medium text-gray-500 border w-[150px]"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items &&
          items.length > 0 &&
          items.map((item, index) => (
            <tr key={index} className="border-b">
              {(Object.values(item) || []).map((elem: any, i: any) => (
                <td
                  key={i}
                  className="py-2 px-3 text-sm text-center border w-[150px]"
                >
                  {elem}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

const ChemicalResultsSection = ({
  chemicalCategories,
}: any) => {
  return (
    <div className='space-y-4 text-gray-800'>
      <div className='grid grid-cols-1 md:grid-cols-1 gap-4 '>
        {chemicalCategories &&
          chemicalCategories.length &&
          chemicalCategories?.map((category: any, index: number) => (
            <div key={index} className='border rounded-md'>
              <div className='p-3 border-b flex items-center'>
                <category.icon className={`${category.color} mr-2`} size={18} />
                <span className='font-medium'>{category.title}</span>
              </div>
              <div className='h-96 overflow-y-auto'>
                <ChemicalsTable
                  items={category?.data || category || []}
                  columns={category?.columns}
                />
              </div>
            </div>
          ))}
      </div>
      {/* More */}
      {/* <Accordion className="border rounded-md text-gray-800">
        <AccordionItem
          className="text-gray-800"
          key="more"
          aria-label="More"
          title="More"
          value="more"
          classNames={{ title: "text-gray-800" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 text-gray-800">
            {additionalCategories &&
              additionalCategories.length &&
              additionalCategories.map((category: any, index: number) => (
                <div key={index} className="border rounded-md">
                  <div className="p-3 border-b flex items-center">
                    <category.icon
                      className={`${category.color} mr-2`}
                      size={18}
                    />
                    <span className="font-medium">{category.title}</span>
                  </div>
                  <div className="h-72 overflow-y-auto">
                    <ChemicalsTable
                      items={category.data || category || []}
                      columns={category.columns}
                      type={category.type}
                    />
                  </div>
                </div>
              ))}
          </div>
        </AccordionItem>
      </Accordion> */}
    </div>
  );
};

export default ChemicalResultsSection;
