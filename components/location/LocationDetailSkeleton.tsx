export function LocationDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="bg-white rounded-xl ring-1 ring-black/10 p-5">
        <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
        <div className="h-7 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border-l-[3px] border-l-gray-200 ring-1 ring-black/10 p-4"
          >
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl ring-1 ring-black/10 p-5">
              <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-72 mb-5" />
              <div className="h-[220px] bg-gray-100 rounded" />
            </div>
          ))}
          <div className="bg-white rounded-xl ring-1 ring-black/10 p-5">
            <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-48 mb-5" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded mb-2" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl ring-1 ring-black/10 p-5">
            <div className="h-4 bg-gray-200 rounded w-36 mb-4" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-5 bg-gray-100 rounded mb-3" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
