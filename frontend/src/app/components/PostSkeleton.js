export default function PostSkeleton() {
  return (
    <article className="border-b border-gray-200 py-8 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="mx-2 text-gray-300">•</div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-7 w-3/4 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-4">
        <div className="h-5 w-12 bg-gray-200 rounded"></div>
        <div className="h-5 w-12 bg-gray-200 rounded"></div>
        <div className="h-5 w-12 bg-gray-200 rounded"></div>
      </div>
    </article>
  );
}
