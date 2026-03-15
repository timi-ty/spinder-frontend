import styles from "../styles/Home.module.css";
import OrbBackdrop from "@/components/ui/orb-backdrop";

const appUrl = import.meta.env.DEV
  ? "http://127.0.0.1:5173/"
  : "https://spindr.pro/";

function Home() {
  return (
    <div className={styles.home}>
      <OrbBackdrop />
      <div className={styles.content}>
        <img className={styles.logo} src="/resources/spindr-logo.svg" />
        <h1 className={styles.title}>Spindr</h1>
        <p className={styles.tagline}>Find music you love.</p>
        <a href={appUrl}>
          <button type="submit">Launch Spindr</button>
        </a>
      </div>
    </div>
  );
}

export default Home;
