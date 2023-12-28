import React, { useState, useEffect, useRef } from 'react';

const YouTubeVideo = ({ videoUrl }) => {
  const [videoId, setVideoId] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const url = new URL(videoUrl);
    const id = url.searchParams.get('v');
    setVideoId(id);
  }, [videoUrl]);

  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '340px', 
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
        },
      });
    };

    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
      onYouTubeIframeAPIReady();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  return <div id="youtube-player"></div>;
};

export default YouTubeVideo;
