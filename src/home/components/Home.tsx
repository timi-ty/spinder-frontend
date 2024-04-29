import styles from "../styles/Home.module.css";

const appUrl = import.meta.env.DEV
  ? "http://localhost:5173/"
  : "https://spindr.pro/";

function Home() {
  return (
    <div className={styles.home}>
      <div>
        <h1>Spindr</h1>
      </div>
      <div>
        <div>Find music you love.</div>
      </div>
      {/* This should change app state rather than unecessarilly loading the app again */}
      <a href={appUrl}>
        <button type="submit">Launch Spindr</button>
      </a>
    </div>
  );
}

export default Home;
