import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectItem } from "@heroui/select";
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';

interface Column {
  key: string;
  label: string;
  className?: string;
  cellClassName?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ChemicalTableProps {
  data: any[];
  columns: Column[];
  className?: string;
  isMetrics?: boolean;
}

const ChemicalTable: React.FC<ChemicalTableProps> = ({
  data,
  columns = [],
  className = "",
  isMetrics = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();
  const filteredData = useMemo(() => {
    return data;
  }, [data]);

  console.log(data)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const sortedFilteredData = filteredData?.sort((a, b) => {
      if (a.CAS < b.CAS) return -1;
      if (a.CAS > b.CAS) return 1;

      return 0;
    });

    console.log({ sortedFilteredData });

    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  return (
    <div className="w-full space-y-4">
      {/* Table Container */}
      <div
        className={clsx(
          "bg-white rounded-sm shadow-sm border flex flex-col h-[700px]",
          className,
        )}
      >
        {/* Table Scrollable Content */}
        <div className="overflow-auto flex-1">
          <table className="w-full min-w-max">
            <thead className="border-b sticky top-0 bg-white z-10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ""}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData && currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((col) => {
                      console.log({ col, item })
                      return (
                        <td
                          key={col.key}
                          className={`px-4 py-3 text-sm text-gray-700 ${col.cellClassName || ""}`}
                        
                        >
                          {col.render
                            ? col.render(item[col.key], item)
                            : item[col.key]}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <p className="text-center p-4 flex justify-center items-center mx-auto">
                  No Data Found
                </p>
              )}
            </tbody>
          </table>
        </div>

        {/* Fixed Pagination Footer */}
        <div className="px-6 py-3 border-t flex justify-end items-center gap-2">
          <div>
            <span className="text-sm text-gray-700 w-[200px]">
              Rows per page:
            </span>
          </div>
          <div className="">
            <Select
              aria-label="Rows per page"
              classNames={{
                trigger:
                  "shadow-none bg-white w-[75px] data-[hover=true]:bg-white",
              }}
              selectedKeys={[itemsPerPage.toString()]}
              onChange={(e: any) => {
                const newItemsPerPage = parseInt(e.target.value, 10);

                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1); // Reset to first page when items per page changes
              }}
            >
              <SelectItem key={10}>10</SelectItem>
              <SelectItem key={20}>20</SelectItem>
              <SelectItem key={50}>50</SelectItem>
              <SelectItem key={100}>100</SelectItem>
            </Select>
          </div>
          <div className="text-sm text-gray-700">
            {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length}
          </div>
          <div className="flex items-center justify-end gap-6">
            <ChevronLeft
              className={clsx(
                "h-4 w-4 ",
                currentPage === 1 ? "text-gray-300" : "cursor-pointer",
              )}
              onClick={() =>
                currentPage !== 1 && handlePageChange(currentPage - 1)
              }
            />

            <ChevronRight
              className={clsx(
                "h-4 w-4 ",
                currentPage === totalPages ? "text-gray-300" : "cursor-pointer",
              )}
              onClick={() =>
                currentPage !== totalPages && handlePageChange(currentPage + 1)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemicalTable;
