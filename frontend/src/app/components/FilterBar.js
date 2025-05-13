"use client";

export default function FilterBar({ activeFilter, onFilterChange, user }) {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => onFilterChange("recent")}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          activeFilter === "recent"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Most Recent
      </button>
      <button
        onClick={() => onFilterChange("popular")}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          activeFilter === "popular"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Most Popular
      </button>
      {user && (
        <button
          onClick={() => onFilterChange("my-posts")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeFilter === "my-posts"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          My Posts
        </button>
      )}
    </div>
  );
}
