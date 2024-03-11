import "../styles/TitleBar.scss";
import IconButton from "./IconButton";

interface Props {
  title: string;
  onClose: () => void;
  matchParentHeight?: boolean;
}

const defaultHeight = 3; //rem

function TitleBar({ title, onClose, matchParentHeight = false }: Props) {
  return (
    <div
      className="title-bar"
      style={{
        height: `${matchParentHeight ? "100%" : `${defaultHeight}rem`}`,
      }}
    >
      {/* We're using onClick on the outer div as well to increase the hitbox area */}
      <div className="close" onClick={onClose}>
        <IconButton
          icon={"/resources/ic_close.svg"}
          onAction={onClose}
          matchParentHeight
          showBackground={false}
          title={"Close"}
        />
      </div>
      {title}
    </div>
  );
}

export default TitleBar;
