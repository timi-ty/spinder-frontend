import IconButton from "../../generic/components/IconButton";
import "../styles/DiscoverTop.scss";

interface Props {
  onClickSourcePicker: () => void;
  onClickDestinationPicker: () => void;
}

function DiscoverTop({ onClickSourcePicker, onClickDestinationPicker }: Props) {
  return (
    <div className="top">
      <IconButton
        icon={"./src/assets/ic_discover_source.svg"}
        onAction={onClickSourcePicker}
        title={"Source"}
      />
      <IconButton
        icon={"./src/assets/ic_discover_dest.svg"}
        onAction={onClickDestinationPicker}
        title={"Destination"}
      />
    </div>
  );
}

export default DiscoverTop;
