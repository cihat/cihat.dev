export function Spotify({ trackId, width = '100%', height = '352' }) {
  return (
    <div className="spotify-embed-container">
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}`}
        width={width}
        height={height}
        frameBorder="0"
        // allowTransparency="true"
        allow="encrypted-media"
        title="Spotify music player"
      ></iframe>
    </div>
  );
};
