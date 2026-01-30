import { useCallback, useRef } from "react";

interface UseLongPressOptions {
  onShortPress: () => void;
  onLongPress: () => void;
  delay?: number;
}

export function useLongPress({
  onShortPress,
  onLongPress,
  delay = 500,
}: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      firedRef.current = false;
      startPos.current = { x: e.clientX, y: e.clientY };
      timerRef.current = setTimeout(() => {
        firedRef.current = true;
        timerRef.current = null;
        onLongPress();
      }, delay);
    },
    [onLongPress, delay],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!firedRef.current && timerRef.current !== null) {
        clear();
        onShortPress();
      }
      clear();
      startPos.current = null;
    },
    [onShortPress, clear],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPos.current) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      if (dx * dx + dy * dy > 100) {
        clear();
        startPos.current = null;
      }
    },
    [clear],
  );

  const onPointerCancel = useCallback(() => {
    clear();
    startPos.current = null;
  }, [clear]);

  return {
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onPointerCancel,
    onPointerLeave: onPointerCancel,
  };
}
