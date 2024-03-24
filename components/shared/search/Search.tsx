"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { useRouter } from "next/router";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState('');
  // const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedSearchQuery = searchInput.replace(/#/g, '%23').replace(/\s/g, '%20');
    try {
      const response = await fetch(`http://localhost:3001/api/question?q=${formattedSearchQuery}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center w-full">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 px-4 py-2 rounded-lg mr-2 w-full"
      />
      <Button type="submit" className="primary-gradient min-h-[50px] px-4 py-2 !text-light-900">
        Search
      </Button>
    </form>
  );
};

export default SearchInput;
