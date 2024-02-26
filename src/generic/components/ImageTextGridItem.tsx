import { useRef, useState, useLayoutEffect } from "react";
import { pxToRem } from "../../utils/utils";
import "../styles/ImageTextGridItem.scss";

const defaultSize = 10.25; //rem

interface Props {
  image: string;
  text: string;
  isSelected: boolean;
  onAction: () => void;
  useAvailableWidth: boolean;
}

function ImageTextGridItem({
  image,
  text,
  isSelected,
  onAction,
  useAvailableWidth = false,
}: Props) {
  const ref: React.LegacyRef<HTMLDivElement> = useRef(null);
  const [size, setSize] = useState(defaultSize);

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

  return (
    <div
      ref={ref}
      className="image-text-grid-item"
      style={{
        height: `${size}rem`,
        width: `${useAvailableWidth ? "" : `${size}rem`}`,
      }}
      onClick={onAction}
    >
      <img className="image" src={image} />
      <div className="text">{text}</div>
    </div>
  );
}

export default ImageTextGridItem;
