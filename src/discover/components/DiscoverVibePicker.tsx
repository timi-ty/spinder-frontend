import "../styles/DiscoverVibePicker.scss";

type VibePickerStatus = "Searching" | "Found" | "Not Found";

interface Props {
  pickerStatus: VibePickerStatus;
  vibeName: string;
  onClick: () => void;
}

function DiscoverVibePicker({
  pickerStatus = "Searching",
  vibeName,
  onClick,
}: Props) {
  return (
    <div
      className="vibe-picker"
      onClick={() => {
        if (pickerStatus === "Found") onClick(); // Can only pick the vibe after it has been found
      }}
    >
      {pickerStatus === "Found" && (
        <div className="found-a-vibe">Found a vibe</div>
      )}
      {pickerStatus === "Found" && <div className="vibe-name">#{vibeName}</div>}
      {pickerStatus === "Searching" && (
        <div className="search-overlay">Searching for a vibe...</div>
      )}
      {pickerStatus === "Not Found" && (
        <div className="not-found">Couldn't find a vibe</div>
      )}
    </div>
  );
}

export default DiscoverVibePicker;

export { type VibePickerStatus };
