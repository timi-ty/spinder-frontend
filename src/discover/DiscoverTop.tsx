import "./DiscoverTop.scss";

interface Props {
  onClickDestinationPicker: () => void;
}

function DiscoverTop({ onClickDestinationPicker }: Props) {
  return (
    <div className="top">
      <button>
        <img className="icon-btn" src="./src/assets/ic_discover_source.png" />
      </button>
      <button>
        <img
          className="icon-btn"
          src="./src/assets/ic_discover_dest.png"
          onClick={onClickDestinationPicker}
        />
      </button>
    </div>
  );
}

export default DiscoverTop;
