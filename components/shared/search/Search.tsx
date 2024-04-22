import { useState } from "react";
import { useRouter } from "next/router";

const SearchInput = () => {
  const [searchInput, setSearchInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!searchInput.trim()) return;
  
    let query = `?q=${encodeURIComponent(searchInput.trim())}`;
  
    if (tagInput.trim()) {
      const tags = tagInput.trim().split(/\s+/).map(tag => `#${tag}`);
      query += encodeURIComponent(tags.join(' '));
    }
  
    router.push(`/search${query}`);
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
      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        placeholder="Tag..."
        className="border border-gray-300 px-4 py-2 rounded-lg mr-2 w-full"
      />
      <button type="submit" className="primary-gradient min-h-[50px] px-4 py-2 !text-light-900">
        Search
      </button>
    </form>
  );
};

export default SearchInput;