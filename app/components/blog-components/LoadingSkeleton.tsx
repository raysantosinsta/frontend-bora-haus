// app/components/blog-components/LoadingSkeleton.tsx
export default function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      <div className="aspect-video bg-gray-700 rounded-2xl mb-8" />
      <div className="h-12 bg-gray-700 rounded w-3/4 mb-4" />
      <div className="h-6 bg-gray-700 rounded w-1/2 mb-6" />
      <div className="h-8 bg-gray-700 rounded w-full mb-4" />
      <div className="h-8 bg-gray-700 rounded w-full mb-4" />
      <div className="h-8 bg-gray-700 rounded w-5/6 mb-4" />
      <div className="flex gap-2 mt-8">
        <div className="h-10 bg-gray-700 rounded w-24" />
        <div className="h-10 bg-gray-700 rounded w-24" />
      </div>
    </div>
  );
}