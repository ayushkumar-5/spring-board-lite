import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  onPriorityFilterChange: (priority: 'all' | 'low' | 'medium' | 'high') => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
}) => {
  return (
    <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Priority Filter */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority:
          </span>
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value as 'all' | 'low' | 'medium' | 'high')}
          className="input py-1 px-2 text-sm max-w-[120px]"
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilters;
