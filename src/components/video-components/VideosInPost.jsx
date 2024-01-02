'use cilent'
import GenericVideo from "./GenericVideo";
import GoogleDriveVideo from "./GoogleDriveVideos";
import YouTubeVideo from "./YouTubeVideos";

const VideosInPost = ({ videosArray }) => {
  return (
    <div className="max-w-[100vw] min-w-[300px] lg:min-h-[300px]">
      {videosArray.map((videoUrl, index) => (
        <div key={index} >
          {(videoUrl.includes('youtube.com') || videoUrl.includes("youtu.be")) ? (
            <YouTubeVideo videoUrl={videoUrl} />
          ) : videoUrl.includes('drive.google.com') ? (
            <GoogleDriveVideo videoUrl={videoUrl} />
          ) : (
            <GenericVideo videoUrl={videoUrl} />
          )}
        </div>
      ))}
    </div>
  );
};

export default VideosInPost;
