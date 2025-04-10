import { useRef } from 'react';

export function useThrottle(delay = 1000) {
  const lastClick = useRef(0);

  return (callback) => {
    const now = Date.now();
    if (now - lastClick.current > delay) {
      lastClick.current = now;
      callback();
    }
  };
}
