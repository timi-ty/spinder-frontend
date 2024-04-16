import {
  useState,
  useLayoutEffect,
  MutableRefObject,
  useMemo,
  useEffect,
} from "react";
import styles from "../styles/SquareImage.module.css";

interface Props {
  image: string;
  title: string;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  circleCrop?: boolean;
  forceIsWidthLimited?: boolean;
  extraClassName?: string;
}

//A tight circle crop image with no space at the edges.
function SquareImage({
  image,
  title,
  containerRef,
  circleCrop = false,
  forceIsWidthLimited = false,
  extraClassName = "",
}: Props) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [size, setSize] = useState(0);
  const [isHeightLimited, setIsHeightLimited] = useState(true);
  const [isWidthLimited, setIsWidthLimited] = useState(true);

  const containerSizeObserver = useMemo(
    () =>
      new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect) {
            setContainerWidth(entry.contentRect.width);
            setContainerHeight(entry.contentRect.height);
          }
        }
      }),
    []
  );

  useEffect(() => {
    if (containerRef.current)
      containerSizeObserver.observe(containerRef.current);
    return () => {
      if (containerRef.current)
        containerSizeObserver.unobserve(containerRef.current);
    };
  });

  useLayoutEffect(() => {
    if (containerWidth > containerHeight && !forceIsWidthLimited) {
      setIsHeightLimited(true);
      setIsWidthLimited(false);
      setSize(containerHeight);
    } else {
      setIsHeightLimited(false);
      setIsWidthLimited(true);
      setSize(containerWidth);
    }
  }, [containerWidth, containerHeight]);

  return (
    <img
      title={title}
      className={`${styles.image} ${extraClassName}`}
      src={image}
      onError={(ev) =>
        (ev.currentTarget.src = "/resources/fallback_square.svg")
      }
      style={{
        height: `${isHeightLimited ? `${containerHeight}px` : `${size}px`}`,
        width: `${isWidthLimited ? `${containerWidth}px` : `${size}px`}`,
        clipPath: `${circleCrop ? "circle()" : ""}`,
      }}
    />
  );
}

export default SquareImage;
