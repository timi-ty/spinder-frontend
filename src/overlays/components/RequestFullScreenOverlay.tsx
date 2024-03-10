import "../styles/RequestFullScreenOverlay.scss";

function swithToFullScreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }
}

function RequestFullScreenOverlay() {
  return (
    <div className="request-full-screen" onClick={swithToFullScreen}>
      <div className="message">
        Tap anywhere to enter full screen and use Spinder!
      </div>
    </div>
  );
}

export default RequestFullScreenOverlay;
