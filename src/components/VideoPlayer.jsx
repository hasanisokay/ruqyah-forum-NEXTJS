// VideoPlayer.js
import React from 'react';

const VideoPlayer = ({ embedUrl, thumbnailUrl, onClick }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${thumbnailUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      {embedUrl && (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default VideoPlayer;
