import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!city.trim()) return;

    onSearch(city);
    setCity("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 justify-center"
    >
      <input
        type="text"
        placeholder="Search by city, state, or country"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="px-4 py-3 rounded-xl bg-[#f5f5f53b] text-black w-64"
      />

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-xl font-semibold"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
