import { useRef, useState, useCallback, useEffect } from "react";

function useMouseFlick(
  onStartGesture: () => void,
  onFlick: (flickDelta: { dx: number; dy: number }) => void
) {
  const flickDeltaRef = useRef({ dx: 0, dy: 0 });
  const [flickDelta, setFlickDelta] = useState({ dx: 0, dy: 0 });
  const [isFlicking, setIsFlicking] = useState(false);
  const [mouseStartPos, setMouseStartPos] = useState({ x: 0, y: 0 });
  const [mouseCurrentPos, setMouseCurrentPos] = useState({ x: 0, y: 0 });

  //Don't try to read state from any of these mouse callbacks. They closure the state and we don't want to repeatedly detach and attach the callbacks to keep the closure up to date.
  const onMouseDown = useCallback((ev: MouseEvent) => {
    setIsFlicking(true);
    setMouseStartPos({ x: ev.clientX, y: ev.clientY });
    setMouseCurrentPos({ x: ev.clientX, y: ev.clientY });
    onStartGesture();
  }, []);
  const onMouseUpWindow = useCallback(() => {
    setIsFlicking(false);
    onFlick(flickDeltaRef.current);
    setFlickDelta({ dx: 0, dy: 0 });
    flickDeltaRef.current = { dx: 0, dy: 0 };
  }, [onFlick]);
  const onMouseMove = useCallback((ev: MouseEvent) => {
    setMouseCurrentPos({ x: ev.clientX, y: ev.clientY });
  }, []);
  useEffect(() => {
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUpWindow); //We use window because no element should block finishing the click drag by releasing the mouse.
    window.addEventListener("mousemove", onMouseMove); //We use window because no element should block dragging once it has started.

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUpWindow);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseDown, onMouseUpWindow, onMouseMove]);
  useEffect(() => {
    if (!isFlicking) return;

    const deltaX = mouseCurrentPos.x - mouseStartPos.x;
    const deltaY = mouseCurrentPos.y - mouseStartPos.y;
    setFlickDelta({ dx: deltaX, dy: deltaY });
    flickDeltaRef.current = { dx: deltaX, dy: deltaY };
  }, [mouseStartPos, mouseCurrentPos, isFlicking]);

  return flickDelta;
}

export default useMouseFlick;
