import { useCallback, useEffect, useState } from "react";
import {
  addAudioElementTimeUpdateListener,
  removeAudioElementTimeUpdateListener,
} from "../../client/client.audio";
import styles from "../styles/DiscoverSeeker.module.css";

function DiscoverSeeker() {
  const [seekerProgress, setSeekerProgress] = useState(0);
  const onTimeUpdate = useCallback((audioElement: HTMLAudioElement) => {
    const progress = audioElement.currentTime / audioElement.duration;
    setSeekerProgress(progress * 100); //Ratio to percentage.
  }, []);

  useEffect(() => {
    const handle = addAudioElementTimeUpdateListener(onTimeUpdate);
    return () => {
      removeAudioElementTimeUpdateListener(handle);
    };
  }, []);

  return (
    <div className={styles.seeker}>
      <div
        className={styles.foreground}
        style={{ width: `${seekerProgress}%` }}
      ></div>
    </div>
  );
}

export default DiscoverSeeker;
