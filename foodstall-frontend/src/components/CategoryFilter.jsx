import React from 'react';

export function CategoryFilter({ categories, selectedCategoryId, onSelectCategory }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="font-bold text-lg mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {/* "All" button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded transition ${
            selectedCategoryId === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All
        </button>

        {/* Category buttons */}
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onSelectCategory(category._id)}
            className={`px-4 py-2 rounded transition ${
              selectedCategoryId === category._id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}