import React, { useState } from 'react';

interface SearchPageProps {
  onSearchComplete: (results: searchResult[]) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onSearchComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/youtubeSearch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchTerm }),
    });


    if (response.ok) {
      const data = await response.json();
      onSearchComplete(data);
    } else {
      console.error('Search failed with status: ' + response.status + ' and message: ' +   response.statusText);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={handleInputChange} 
          placeholder="Enter search term"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchPage;
