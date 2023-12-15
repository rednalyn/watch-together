import React from 'react';

interface SliderProps {
  searchResults: searchResult[];
}

const VideoSlider: React.FC<SliderProps> = ({ searchResults }) => {
  return (
    <div style={firstDivStyle}>
      <div style={secondDivStyle}>
        {searchResults.map((result, index) => (
          <div key={index} style={thirdDivStyle}>
            <iframe
              src={`https://www.youtube.com/embed/${result.id.videoId}`}
              title={result.snippet.title}
              style={videoStyle}
            ></iframe>
            <p style={pStyle}>
              {result.snippet.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const firstDivStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const secondDivStyle: React.CSSProperties = {
  background: 'black', 
  overflowX: 'scroll', 
  display: 'flex', 
  padding: '20px', 
  whiteSpace: 'nowrap',
  borderRadius: '10px',
};

const thirdDivStyle: React.CSSProperties = {
  marginRight: '10px',
  width: '300px' 
};

const videoStyle: React.CSSProperties = {
  width: '100%',
  height: 'auto',
  borderRadius: '10px'
};

const pStyle: React.CSSProperties = {
  color: 'white',
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

export default VideoSlider;
