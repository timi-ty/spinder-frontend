import {
  useState,
  useLayoutEffect,
  MutableRefObject,
  useMemo,
  useEffect,
} from "react";
import "../styles/SquareImage.scss";

interface Props {
  image: string;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  circleCrop?: boolean;
  forceIsWidthLimited?: boolean;
}

//A tight circle crop image with no space at the edges.
function SquareImage({
  image,
  containerRef,
  circleCrop = false,
  forceIsWidthLimited = false,
}: Props) {
  const [contanerHeight, setContainerHeight] = useState(0);
  const [contanerWidth, setContainerWidth] = useState(0);
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
    if (contanerWidth > contanerHeight && !forceIsWidthLimited) {
      setIsHeightLimited(true);
      setIsWidthLimited(false);
      setSize(contanerHeight);
    } else {
      setIsHeightLimited(false);
      setIsWidthLimited(true);
      setSize(contanerWidth);
    }
  }, [contanerWidth, contanerHeight]);

  return (
    <img
      className="circle-image"
      src={image}
      onError={(ev) =>
        (ev.currentTarget.src = "src/assets/fallback_square.svg")
      }
      style={{
        height: `${isHeightLimited ? "100%" : `${size}px`}`,
        width: `${isWidthLimited ? "100%" : `${size}px`}`,
        clipPath: `${circleCrop ? "circle()" : ""}`,
      }}
    />
  );
}

export default SquareImage;
