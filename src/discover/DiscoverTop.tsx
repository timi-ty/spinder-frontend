import "./DiscoverTop.scss";

function DiscoverTop() {
  return (
    <div className="top">
      <button>
        <img className="icon-btn" src="./src/assets/ic_discover_source.png" />
      </button>
      <button>
        <img className="icon-btn" src="./src/assets/ic_discover_dest.png" />
      </button>
    </div>
  );
}

export default DiscoverTop;
