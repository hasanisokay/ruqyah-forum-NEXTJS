'use cilent'
import { useState, useEffect } from 'react';
const YouTubeVideo = ({ videoUrl }) => {
  const [videoId, setVideoId] = useState(null);
  useEffect(() => {
    const url = new URL(videoUrl);
    const id = url.searchParams.get('v');
    setVideoId(id);
  }, [videoUrl]);

  return <div>
    <object data={`https://www.youtube.com/embed/${videoId}`}
      width='100%' style={{ minHeight: "340px", minWidth: "300px" }} height='100%' >
    </object>
  </div>;
};
export default YouTubeVideo;
