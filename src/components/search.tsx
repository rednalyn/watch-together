import React, { useState } from "react";
import VideoSlider from "./videoSlider";

interface SearchPageProps{
  className?: string;
}

export default function SearchPage({className}:SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<searchResult[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFormVisible(true);
    const response = await fetch("/api/youtubeSearch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchTerm }),
    });

    if (response.ok) {
      const data = await response.json();
      setSearchResults(data);
    } else {
      console.error(
        "Search failed with status: " +
          response.status +
          " and message: " +
          response.statusText
      );
    }
  };

  return (
    <div className={`${className}`}>
      <h1 className="flex justify-center">Search for videos here</h1>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="flex justify-center mb-5">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Enter search term"
            className="p-2 text-white"
            style={inputStyle}
          />
          <button
            type="submit"
            className="p-2 cursor-pointer bg-black rounded-r-lg border border-customPinkOpacity03 hover:text-customPink"
          >
            Search
          </button>
        </form>
      </div>
      {isFormVisible && <VideoSlider searchResults={searchResults} />}
    </div>
  );
};


const inputStyle: React.CSSProperties = {

  backgroundColor: "#2b2a2e",

  borderRadius: "10px 0px 0px 10px",
};
