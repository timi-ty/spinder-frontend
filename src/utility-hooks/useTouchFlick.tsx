import { useState, useRef, useCallback, useEffect } from "react";

function useTouchFlick(
  onStartGesture: () => void,
  onFlick: (flickDelta: { dx: number; dy: number }) => void
) {
  const [isFlicking, setIsFlicking] = useState(false);
  const flickDeltaRef = useRef({ dx: 0, dy: 0 });
  const [flickDelta, setFlickDelta] = useState({ dx: 0, dy: 0 });
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [touchCurrentPos, setTouchCurrentPos] = useState({ x: 0, y: 0 });

  const onTouchStart = useCallback((ev: TouchEvent) => {
    setIsFlicking(true);
    const touch = ev.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchCurrentPos({ x: touch.clientX, y: touch.clientY });
    onStartGesture();
    console.log(`Started Touch - x:${touch.clientX}, y:${touch.clientY}`);
  }, []);

  const onTouchMove = useCallback((ev: TouchEvent) => {
    const touch = ev.touches[0];
    setTouchCurrentPos({ x: touch.clientX, y: touch.clientY });
  }, []);

  const onTouchEndWindow = useCallback(() => {
    setIsFlicking(false);
    onFlick(flickDeltaRef.current);
    console.log(
      `Ending Touch Window - x:${flickDeltaRef.current.dx}, y:${flickDeltaRef.current.dy}`
    );
    setFlickDelta({ dx: 0, dy: 0 });
    flickDeltaRef.current = { dx: 0, dy: 0 };
  }, [onFlick]);

  useEffect(() => {
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEndWindow);
    console.log("added listener");

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEndWindow);
      console.log("removed listener");
    };
  }, [onTouchStart, onTouchMove, onTouchEndWindow]);

  useEffect(() => {
    if (!isFlicking) return;
    const deltaX = touchCurrentPos.x - touchStartPos.x;
    const deltaY = touchCurrentPos.y - touchStartPos.y;
    setFlickDelta({ dx: deltaX, dy: deltaY });
    flickDeltaRef.current = { dx: deltaX, dy: deltaY };
  }, [touchStartPos, touchCurrentPos]);

  return flickDelta;
}

export default useTouchFlick;
