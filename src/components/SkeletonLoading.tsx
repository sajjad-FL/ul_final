export const SkeletonLoading = () => {
  return (
    <div className="flex justify-center items-center mt-4 w-full px-6 mt-2">
      <div className="space-y-6 w-full">
        {/* Metrics Skeleton */}
        <div className="border rounded-md p-4 animate-pulse w-full">
          <div className="h-6 w-48 bg-muted rounded mb-6 bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col space-y-2 w-full bg-gray-200 p-3 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-muted rounded-full" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
                <div className="h-6 w-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Chemical Categories Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border rounded-md">
              <div className="p-3 border-b flex items-center space-x-2">
                <div className="h-4 w-4 bg-muted rounded-full bg-gray-200" />
                <div className="h-4 w-32 bg-muted rounded bg-gray-200 w-full" />
              </div>
              <div className="h-72 p-4 space-y-4 overflow-y-auto">
                {[...Array(7)].map((_, idx) => (
                  <div key={idx} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Accordion Skeleton */}
        <div className="border rounded-md animate-pulse">
          <div className="p-4 border-b">
            <div className="h-4 w-32 bg-muted rounded w-48 bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
