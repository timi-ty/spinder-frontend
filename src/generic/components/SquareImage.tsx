import {
  useState,
  useLayoutEffect,
  MutableRefObject,
  useMemo,
  useEffect,
} from "react";
import { pxToRem } from "../../utils/utils";
import "../styles/SquareImage.scss";

interface Props {
  image: string;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  circleCrop?: boolean;
}

//A tight circle crop image with no space at the edges.
function SquareImage({ image, containerRef, circleCrop = false }: Props) {
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
    console.log(`Resizing ${contanerWidth}, ${contanerHeight}`);
    if (contanerWidth > contanerHeight) {
      setIsHeightLimited(true);
      setIsWidthLimited(false);
      const sizeRem = pxToRem(contanerHeight);
      setSize(sizeRem);
    } else {
      setIsHeightLimited(false);
      setIsWidthLimited(true);
      const sizeRem = pxToRem(contanerWidth);
      setSize(sizeRem);
    }
  }, [contanerWidth, contanerHeight]);

  return (
    <img
      className="circle-image"
      src={image}
      style={{
        height: `${isHeightLimited ? "100%" : `${size}rem`}`,
        width: `${isWidthLimited ? "100%" : `${size}rem`}`,
        clipPath: `${circleCrop ? "circle()" : ""}`,
      }}
    />
  );
}

export default SquareImage;
