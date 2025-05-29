import { Circle } from 'lucide-react';
import { Chip } from '@heroui/chip';

import ChemicalResultsSection from './ChemicalResultsSection';

const MetricsOverviewV1 = (props: {
  listId?: string;
  extractedChemicals?: any[];
  actualChemicals?: any[];
  metrics?: any;
  metricsRR?: any;
  actualChemicalsRR?: any[];
  extractedChemicalsRR?: any[];
  precision: any;
  recall: any;
}) => {
  const {
    listId = '',
    extractedChemicals = [],
    actualChemicals = [],
    metrics = {},
    metricsRR = {},
    actualChemicalsRR = [],
    extractedChemicalsRR = [],
    precision = 0,
    recall = 0,
  } = props || {};

  const actualChemicalsCols = Object.keys(actualChemicals?.[0] || {}).map(
    (key) => {
      return {
        key,
        className: 'text-[--ul-text-primary]',
        label: key.charAt(0).toUpperCase() + key.slice(1),
        ...((key.toLowerCase() === 'cas' ||
          key.toLowerCase() === 'synonyms') && {
          render: (value: string | string[]) => {
            if (!value || (Array.isArray(value) && value.length === 0))
              return '';

            const valuesArray = Array.isArray(value)
              ? value
              : value.split(/,\s*/).filter(Boolean); // split string into array if needed

            return (
              <>
                {valuesArray?.map((elem: any): any => (
                  <Chip className='mr-2'>{elem}</Chip>
                ))}
              </>
            );
          },
        }),
      };
    }
  );
  const actualChemicalsRRCols = Object.keys(actualChemicalsRR?.[0] || {}).map(
    (key) => {
      return {
        key,
        className: 'text-[--ul-text-primary]',
        label: key.charAt(0).toUpperCase() + key.slice(1),
        ...((key.toLowerCase() === 'cas' ||
          key.toLowerCase() === 'synonyms') && {
          render: (value: string | string[]) => {
            if (!value || (Array.isArray(value) && value.length === 0))
              return '';

            const valuesArray = Array.isArray(value)
              ? value
              : value.split(/,\s*/).filter(Boolean); // split string into array if needed

            return (
              <>
                {valuesArray?.map((elem: any): any => (
                  <Chip className='mr-2'>{elem}</Chip>
                ))}
              </>
            );
          },
        }),
      };
    }
  );
  const extractedChemicalsCols = Object.keys(extractedChemicals?.[0] || {}).map(
    (key) => {
      return {
        key,
        className: 'text-[--ul-text-primary]',
        label: key.charAt(0).toUpperCase() + key.slice(1),
        ...((key.toLowerCase() === 'cas' ||
          key.toLowerCase() === 'synonyms') && {
          render: (value: string | string[]) => {
            if (!value || (Array.isArray(value) && value.length === 0))
              return '';

            const valuesArray = Array.isArray(value)
              ? value
              : value.split(/,\s*/).filter(Boolean); // split string into array if needed

            return (
              <>
                {valuesArray?.map((elem: any): any => (
                  <Chip className='mr-2'>{elem}</Chip>
                ))}
              </>
            );
          },
        }),
      };
    }
  );
  const extractedChemicalsRRCols = Object.keys(
    extractedChemicalsRR?.[0] || {}
  ).map((key) => {
    return {
      key,
      className: 'text-[--ul-text-primary]',
      label: key.charAt(0).toUpperCase() + key.slice(1),
      ...((key.toLowerCase() === 'cas' || key.toLowerCase() === 'synonyms') && {
        render: (value: string | string[]) => {
          if (!value || (Array.isArray(value) && value.length === 0)) return '';

          const valuesArray = Array.isArray(value)
            ? value
            : value.split(/,\s*/).filter(Boolean); // split string into array if needed

          return (
            <>
              {valuesArray?.map((elem: any): any => (
                <Chip className='mr-2'>{elem}</Chip>
              ))}
            </>
          );
        },
      }),
    };
  });

  return (
    <div className='w-full'>
      <div className='rounded-md'>
        <h2 className='text-lg flex items-center gap-2 mb-6 text-gray-800'>
          {/* <BarChart2 className="text-purple-500" size={20} /> */}
          <span className='font-bold'>List ID:</span> {listId}
        </h2>
      </div>
      <div className='mt-2'>
        <div className='mt-2 mb-2'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800   mt-1'>
            <div className='flex flex-col border p-4 shadow-sm rounded-md'>
              <div className='flex items-center mb-2'>
                {/* <SquareCheckBig className="text-green-500 mr-2" size={18} /> */}
                <span className='text-md font-normal'>CAS Precision</span>
              </div>
              <span className='text-4xl font-bold mt-6'>
                {((precision || 0)).toFixed(2) || 0} %
              </span>
            </div>

            <div className='flex flex-col border p-4 shadow-sm rounded-md'>
              <div className='flex items-center mb-2'>
                {/* <ChartColumnStacked className="text-blue-500 mr-2" size={18} /> */}
                <span className='text-md font-normal'>CAS Recall</span>
              </div>
              <span className='text-4xl font-bold mt-6'>
                {((recall || 0)).toFixed(2) || 0}%
              </span>
            </div>
          </div>
        </div>
        <div className='flex justify-between'>
          <div className='w-[49%] mt-2'>
            <ChemicalResultsSection
              chemicalCategories={[
                {
                  data: extractedChemicals,
                  title: `Extracted Chemicals (${extractedChemicals?.length || 0})`,
                  color: 'text-blue-500',
                  icon: Circle,
                  columns: extractedChemicalsCols,
                },
              ]}
            />
          </div>
          <div className='w-[49%] mt-2'>
            <ChemicalResultsSection
              chemicalCategories={[
                {
                  data: actualChemicals,
                  title: `Actual Chemicals (${actualChemicals?.length || 0})`,
                  color: 'text-orange-500',
                  icon: Circle,
                  columns: actualChemicalsCols,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className='mt-2'>
        {/* <div className='mt-2 mb-2'> */}
          {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 p-4 mt-1'>
            <div className='flex flex-col border p-4 shadow-sm rounded-md'>
              <div className='flex items-center mb-2'> */}
                {/* <SquareCheckBig className="text-green-500 mr-2" size={18} /> */}
                {/* <span className='text-md font-normal'>RR Precision</span>
              </div>
              <span className='text-4xl font-bold mt-6'>
                {((metricsRR?.CAS?.precision || 0) * 100).toFixed(2) || 0} %
              </span>
            </div> */}

            {/* <div className='flex flex-col border p-4 shadow-sm rounded-md'>
              <div className='flex items-center mb-2'>
                {/* <ChartColumnStacked className="text-blue-500 mr-2" size={18} /> */}
                {/* <span className='text-md font-normal'>RR Recall</span>
              </div>
              <span className='text-4xl font-bold mt-6'>
                {((metricsRR?.CAS?.recall || 0) * 100).toFixed(2) || 0}%
              </span> */}
            {/* </div> */}
          {/* </div> */}
        {/* </div> */}

        {/* <div className='flex justify-between mt-2'> */}
          {/* RR Extracted Chemicals */}
          {/* <div className='mb-4 w-[49%] mt-2'>
            <ChemicalResultsSection
              chemicalCategories={[
                {
                  data: extractedChemicalsRR,
                  title: `RR Extracted Chemicals (${extractedChemicalsRR?.length || 0})`,
                  color: 'text-blue-500',
                  icon: Circle,
                  columns: extractedChemicalsRRCols,
                },
              ]}
            />
          </div> */}

          {/* RR Actual Chemicals */}
          {/* <div className='mb-4 w-[49%] mt-2'>
            <ChemicalResultsSection
              chemicalCategories={[
                {
                  data: actualChemicalsRR,
                  title: `RR Actual Chemicals (${actualChemicalsRR?.length || 0})`,
                  color: 'text-orange-500',
                  icon: Circle,
                  columns: actualChemicalsRRCols,
                },
              ]}
            />
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default MetricsOverviewV1;
