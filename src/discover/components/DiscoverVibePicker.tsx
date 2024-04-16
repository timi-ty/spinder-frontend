import styles from "../styles/DiscoverVibePicker.module.css";

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
      className={styles.vibePicker}
      onClick={() => {
        if (pickerStatus === "Found") onClick(); // Can only pick the vibe after it has been found
      }}
    >
      {pickerStatus === "Found" && (
        <div className={styles.foundVibe}>Found a vibe</div>
      )}
      {pickerStatus === "Found" && (
        <div className={styles.vibeName}>#{vibeName}</div>
      )}
      {pickerStatus === "Searching" && (
        <div className={styles.searchOverlay}>Searching for a vibe...</div>
      )}
      {pickerStatus === "Not Found" && (
        <div className={styles.notFound}>Couldn't find a vibe</div>
      )}
    </div>
  );
}

export default DiscoverVibePicker;

export { type VibePickerStatus };
