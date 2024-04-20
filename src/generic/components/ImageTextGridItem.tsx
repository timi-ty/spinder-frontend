import { useRef, useState, useLayoutEffect } from "react";
import { pxToRem } from "../../utils";
import styles from "../styles/ImageTextGridItem.module.css";

const defaultSize = 10.25; //rem

interface Props {
  image: string;
  text: string;
  isSelected: boolean;
  onAction: () => void;
  useAvailableWidth: boolean;
  className?: string;
}

function ImageTextGridItem({
  image,
  text,
  isSelected,
  onAction,
  useAvailableWidth = false,
  className = "",
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

  const selected = isSelected ? styles.selected : "";

  return (
    <div
      ref={ref}
      className={`${styles.imageTextGridItem} ${selected} ${className}`}
      style={{
        height: `${size}rem`,
        width: `${useAvailableWidth ? "" : `${size}rem`}`,
      }}
      onClick={onAction}
    >
      <img
        title={text}
        className={styles.image}
        src={image}
        onError={(ev) =>
          (ev.currentTarget.src = "/resources/fallback_square.svg")
        }
      />
      <div className={styles.text}>{text}</div>
    </div>
  );
}

export default ImageTextGridItem;
