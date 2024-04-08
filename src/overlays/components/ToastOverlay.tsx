import "../styles/ToastOverlay.scss";

interface Props {
  isTopToastShowing: boolean;
  isBottomToastShowing: boolean;
  topToastMessage: string;
  bottomToastMessage: string;
}

function ToastOverlay({
  isTopToastShowing,
  isBottomToastShowing,
  topToastMessage,
  bottomToastMessage,
}: Props) {
  return (
    <div className="toast-overlay">
      <div
        style={{ opacity: `${isTopToastShowing ? "1" : "0"}` }}
        className="message"
      >
        {topToastMessage}
      </div>
      <div
        style={{ opacity: `${isBottomToastShowing ? "1" : "0"}` }}
        className="message"
      >
        {bottomToastMessage}
      </div>
    </div>
  );
}

export default ToastOverlay;
