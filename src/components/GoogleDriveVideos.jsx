
import VideoPlayer from './VideoPlayer';

const GoogleDriveVideo = ({ videoUrl }) => {
  // Extract the file ID from the Google Drive URL
  const fileId = videoUrl.match(/[-\w]{25,}/);

  if (!fileId) {
    return null; // Invalid Google Drive URL
  }

  // Google Drive video thumbnail URL (you may need to adjust this)
  const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}`;

  return <VideoPlayer thumbnailUrl={thumbnailUrl} onClick={() => window.open(videoUrl, '_blank')} />;
};

export default GoogleDriveVideo;
