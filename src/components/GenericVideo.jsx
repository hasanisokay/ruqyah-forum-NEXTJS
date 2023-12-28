// GenericVideo.js
import React from 'react';
import VideoPlayer from './VideoPlayer';

const GenericVideo = ({ videoUrl }) => {
  return  <video controls width="100%" height="360">
  <source src={videoUrl} type="video/mp4"  />
  Your browser does not support the video tag.
</video>
};

export default GenericVideo;
