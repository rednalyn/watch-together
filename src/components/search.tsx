import React, { useState } from 'react';
import VideoSlider from './videoSlider'; 


const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<searchResult[]>([]);

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
      setSearchResults(data); 
    } else {
      console.error('Search failed with status: ' + response.status + ' and message: ' + response.statusText);
    }
  };

  return (
    <div style={divStyle}> 
    <h1 style={firstHeaderStyle}>Search for videos here</h1>
    <div style={secondHeaderStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={handleInputChange} 
          placeholder="Enter search term"
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Search</button>
      </form>
      </div>
      <VideoSlider searchResults={searchResults} />
    </div>
  );
};

const divStyle: React.CSSProperties = {
  maxWidth: '800px',
   margin: 'auto'
}

const firstHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center'
}

const secondHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center'
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
  border: '3px solid pink',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  marginRight: '10px'
};

const buttonStyle: React.CSSProperties = {
  padding: '10px',
  cursor: 'pointer'
};

export default SearchPage;
