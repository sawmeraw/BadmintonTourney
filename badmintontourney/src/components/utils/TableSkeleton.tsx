interface TableSkeletonProps {
  numRows: number;
  numCols: number;
}

const TableSkeleton = ({ numRows, numCols }: TableSkeletonProps) => (
  <div className="animate-pulse my-6">
    <div className="flex justify-between items-center mb-6">
      <div className="h-10 bg-gray-200 rounded-md w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded-md w-32"></div>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      {[...Array(numRows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-between py-2">
          {[...Array(numCols)].map((_, colIndex) => (
            <div
              key={colIndex}
              className={`bg-gray-200 rounded ${
                colIndex === 0 ? "h-11 w-11 rounded-full" : "h-4 w-24"
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default TableSkeleton;
