import React from 'react';
import { CATEGORIES } from '../utils/constants.js';
import { Search, ArrowUpDown } from 'lucide-react';

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="space-y-4 font-sans-clean">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, director, or cast..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#12111a] text-slate-100 placeholder-slate-500 rounded-lg border border-white/10 focus:border-indigo-400 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="sortSelect" className="text-xs text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            Sort:
          </label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#12111a] text-slate-300 text-xs py-1.5 px-3 rounded-lg border border-white/10 focus:border-indigo-400 focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="title_asc">Title A–Z</option>
            <option value="duration_desc">Runtime</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-white text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
