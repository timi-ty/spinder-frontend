import { useRef, useState, useLayoutEffect } from "react";
import { pxToRem } from "../../utils/utils";
import "../styles/IconTextGridItem.scss";

const defaultSize = 10.25; //rem

interface Props {
  icon: string;
  text: string;
  isSelected: boolean;
  onAction: () => void;
  useAvailableWidth: boolean;
}

function IconTextGridItem({
  icon,
  text,
  isSelected,
  onAction,
  useAvailableWidth = false,
}: Props) {
  const ref: React.LegacyRef<HTMLDivElement> = useRef(null);
  const [size, setSize] = useState(defaultSize);

  //Default size is used for width and height but if useAvailbleWidth is true, the available width obtained is set as the height to maintain a square shape.
  useLayoutEffect(() => {
    if (!useAvailableWidth) {
      setSize(defaultSize);
      return;
    }
    const domRect = ref.current?.getBoundingClientRect();
    if (domRect) {
      const sizeRem = pxToRem(domRect.width);
      setSize(sizeRem);
    } else {
      console.warn("Image Text Grid Item failed to get its dom rect.");
    }
  }, [useAvailableWidth]);

  const selected = isSelected ? "selected" : "";

  return (
    <div
      ref={ref}
      className={`icon-text-grid-item ${selected}`}
      style={{
        height: `${size}rem`,
        width: `${useAvailableWidth ? "" : `${size}rem`}`,
      }}
      onClick={onAction}
    >
      <img
        title={text}
        className="icon"
        src={icon}
        onError={(ev) =>
          (ev.currentTarget.src = "src/assets/fallback_square.svg")
        }
      />
      <div className="text">{text}</div>
    </div>
  );
}

export default IconTextGridItem;
