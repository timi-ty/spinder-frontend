import {
  MutableRefObject,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "../styles/IconButton.module.css";
import { pxToRem } from "../../utils";

interface Props {
  title: string;
  icon: string;
  onAction: () => void;
  matchParentHeight?: boolean;
  showBackground?: boolean;
  className?: string;
}

const defaultSize = 3; //rem

const IconButton = forwardRef(function IconButton(
  {
    title,
    icon,
    onAction,
    matchParentHeight = false,
    showBackground = true,
    className = "",
  }: Props,
  forwardedRef: any
) {
  const ref: MutableRefObject<HTMLButtonElement | null> = useRef(null);
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
    <div
      ref={forwardedRef}
      style={{
        height: `${matchParentHeight ? "100%" : `${size}rem`}`,
        width: `${size}rem`,
      }}
    >
      <button
        type="button"
        title={title}
        ref={ref}
        className={`${styles.iconButton} ${className}`}
        onClick={onAction}
        style={{
          background: `${showBackground ? "" : "none"}`,
        }}
      >
        <img title={title} className={styles.icon} src={icon} />
      </button>
    </div>
  );
});

export default IconButton;
