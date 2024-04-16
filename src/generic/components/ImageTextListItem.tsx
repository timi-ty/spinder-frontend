import { useRef, useLayoutEffect, useState } from "react";
import styles from "../styles/ImageTextListItem.module.css";

type ImageType = "Circle" | "Rounded";

interface Props {
  image: string;
  text: string;
  imageType: ImageType;
  isSelected: boolean;
  onClick: () => void;
}

function ImageTextListItem({
  image,
  text,
  imageType,
  isSelected,
  onClick,
}: Props) {
  const detailsContainerRef: React.LegacyRef<HTMLImageElement> = useRef(null);
  const [imageSize, setImageSize] = useState(0);

  useLayoutEffect(() => {
    const continerDomRect =
      detailsContainerRef.current?.getBoundingClientRect();
    if (continerDomRect) {
      setImageSize(continerDomRect.height);
    } else {
      console.warn("List item image failed to get its container dom rect.");
    }
  }, []);

  const clipClass = imageType === "Circle" ? "circle" : "rounded";

  return (
    <div className={styles.ImageTextListItem} onClick={onClick}>
      <div ref={detailsContainerRef} className="details-container">
        <img
          title={text}
          className={`${styles.image} ${clipClass}`}
          src={image}
          onError={(ev) =>
            (ev.currentTarget.src = "/resources/fallback_square.svg")
          }
          style={{
            width: `${imageSize}px`,
          }}
        />
        <div className={styles.text}>{text}</div>
      </div>

      {isSelected && (
        <img
          title="Selected"
          className={styles.checkmark}
          src="/resources/ic_checkmark.svg"
        />
      )}
    </div>
  );
}

export default ImageTextListItem;
