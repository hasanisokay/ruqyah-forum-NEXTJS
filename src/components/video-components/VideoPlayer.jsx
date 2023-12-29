'use cilent'

const VideoPlayer = ({ embedUrl, thumbnailUrl}) => {
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
