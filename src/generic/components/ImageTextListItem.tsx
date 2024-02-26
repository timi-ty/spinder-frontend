import { useRef, useLayoutEffect, useState } from "react";
import { pxToRem } from "../../utils/utils";
import "../styles/ImageTextListItem.scss";

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
  const imageRef: React.LegacyRef<HTMLImageElement> = useRef(null);
  const [imageSize, setImageSize] = useState(0);

  useLayoutEffect(() => {
    const domRect = imageRef.current?.getBoundingClientRect();
    if (domRect) {
      const sizeRem = pxToRem(domRect.height);
      setImageSize(sizeRem);
    } else {
      console.warn("List item image failed to get its dom rect.");
    }
  }, []);

  const clipClass = imageType === "Circle" ? "circle" : "rounded";

  return (
    <div className="image-text-list-item" onClick={onClick}>
      <img
        ref={imageRef}
        className={`image ${clipClass}`}
        src={image}
        style={{
          width: `${imageSize}rem`,
        }}
      />
      <div className="text">{text}</div>
      {isSelected && (
        <img className="checkmark" src="/src/assets/ic_checkmark.svg" />
      )}
    </div>
  );
}

export default ImageTextListItem;
