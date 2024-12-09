"use client";
import React, { useState } from "react";

export default function SearchBar ({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter"){
      handleSearch();
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Search Pokémon"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleEnterKey}
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none font-mono focus:ring-2 focus:ring-violet-400 text-black"
      />
      <button
        onClick={handleSearch}
        className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-400 font-mono"
      >
        Search
      </button>
    </div>
  );
};