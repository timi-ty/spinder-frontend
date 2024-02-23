import { useLayoutEffect, useRef, useState } from "react";
import "../styles/IconButton.scss";
import { pxToRem } from "../../utils/utils";

interface Props {
  icon: string;
  onAction: () => void;
  matchParentHeight?: boolean;
  showBackground?: boolean;
}

const defaultSize = 3; //rem

function IconButton({
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
      title="close"
      ref={ref}
      className="icon-button"
      onClick={onAction}
      style={{
        height: `${matchParentHeight ? "100%" : `${size}rem`}`,
        width: `${size}rem`,
        background: `${showBackground ? "" : "none"}`,
      }}
    >
      <img title="close" className="icon" src={icon} />
    </button>
  );
}

export default IconButton;
