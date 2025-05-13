"use client";

import { memo, useCallback } from "react";

const FilterButton = memo(({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "bg-gray-900 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
));

FilterButton.displayName = "FilterButton";

export default function FilterBar({ activeFilter, onFilterChange, user }) {
  const handleRecentClick = useCallback(() => {
    onFilterChange("recent");
  }, [onFilterChange]);

  const handlePopularClick = useCallback(() => {
    onFilterChange("popular");
  }, [onFilterChange]);

  const handleMyPostsClick = useCallback(() => {
    onFilterChange("my-posts");
  }, [onFilterChange]);

  return (
    <div className="flex space-x-4 mb-6">
      <FilterButton
        label="Most Recent"
        isActive={activeFilter === "recent"}
        onClick={handleRecentClick}
      />
      <FilterButton
        label="Most Popular"
        isActive={activeFilter === "popular"}
        onClick={handlePopularClick}
      />
      {user && (
        <FilterButton
          label="My Posts"
          isActive={activeFilter === "my-posts"}
          onClick={handleMyPostsClick}
        />
      )}
    </div>
  );
}
