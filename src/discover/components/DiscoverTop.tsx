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
        icon={"/resources/ic_discover_source.svg"}
        onAction={onClickSourcePicker}
        title={"Source"}
        showBackground={false}
      />
      <IconButton
        icon={"/resources/ic_discover_dest.svg"}
        onAction={onClickDestinationPicker}
        title={"Destination"}
        showBackground={false}
      />
    </div>
  );
}

export default DiscoverTop;
