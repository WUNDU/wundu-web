import React, { useState } from 'react';
import { SearchBarProps } from '@/src/types/input';
import { SearchIcon, SettingsIcon } from '@/src/constants/icons';


const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch, onFilterClick }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-row ">
      <div className="flex items-center rounded-xl px-4 py-3 border border-gray-300">
        <SearchIcon className="h-5 w-5 text-gray-400 mr-3" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-red-700 placeholder-gray-400 outline-none"
        />
      </div>
      <div className='flex flex-col flex-1 items-center justify-center '>
        <button
          type="button"
          onClick={onFilterClick}
          className="ml-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <SettingsIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>

    </form>
  );
};

export default SearchBar;