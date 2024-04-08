import "../styles/Home.scss";

const appUrl = import.meta.env.DEV
  ? "http://localhost:5173/"
  : "https://spindr.pro/";

function Home() {
  return (
    <div className="home">
      <div>
        <h1>Spindr</h1>
      </div>
      <div>
        <div>Find music you love.</div>
      </div>
      {/* This should change app state rather than unecessarilly loading the app again */}
      <a href={appUrl} className="submit-container">
        <button className="submit" type="submit">
          Launch Spindr
        </button>
      </a>
    </div>
  );
}

export default Home;
