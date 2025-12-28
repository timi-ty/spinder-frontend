import styles from "../styles/Home.module.css";

const appUrl = import.meta.env.DEV
  ? "http://127.0.0.1:5173/"
  : "https://spindr.pro/";

function Home() {
  return (
    <div className={styles.home}>
      <img className={styles.logo} src="/resources/spindr-logo.svg"></img>
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
