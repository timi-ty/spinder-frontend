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
      <div className="close">
        <IconButton
          icon={"/src/assets/ic_close.png"}
          onAction={onClose}
          matchParentHeight
          showBackground={false}
        />
      </div>
      {title}
    </div>
  );
}

export default TitleBar;
