import { useLayoutEffect, useRef, useState } from "react";
import "../styles/IconButton.scss";
import { pxToRem } from "../../utils/utils";

interface Props {
  title: string;
  icon: string;
  onAction: () => void;
  matchParentHeight?: boolean;
  showBackground?: boolean;
}

const defaultSize = 3; //rem

function IconButton({
  title,
  icon,
  onAction,
  matchParentHeight = false,
  showBackground = true,
}: Props) {
  const ref: React.LegacyRef<HTMLButtonElement> = useRef(null);
  const [size, setSize] = useState(defaultSize);

  useLayoutEffect(() => {
    if (!matchParentHeight) {
      setSize(defaultSize);
      return;
    }
    const domRect = ref.current?.getBoundingClientRect();
    if (domRect) {
      const sizeRem = pxToRem(domRect.height);
      setSize(sizeRem);
    } else {
      console.warn("Icon Button failed to get its dom rect.");
    }
  }, [matchParentHeight]);

  return (
    <button
      type="button"
      title={title}
      ref={ref}
      className="icon-button"
      onClick={onAction}
      style={{
        height: `${matchParentHeight ? "100%" : `${size}rem`}`,
        width: `${size}rem`,
        background: `${showBackground ? "" : "none"}`,
      }}
    >
      <img title={title} className="icon" src={icon} />
    </button>
  );
}

export default IconButton;
