import "../styles/DiscoverTop.scss";

interface Props {
  onClickDestinationPicker: () => void;
  onClickSourcePicker: () => void;
}

function DiscoverTop({ onClickDestinationPicker, onClickSourcePicker }: Props) {
  return (
    <div className="top">
      <button onClick={onClickSourcePicker}>
        <img className="icon-btn" src="./src/assets/ic_discover_source.png" />
      </button>
      <button onClick={onClickDestinationPicker}>
        <img className="icon-btn" src="./src/assets/ic_discover_dest.png" />
      </button>
    </div>
  );
}

export default DiscoverTop;
