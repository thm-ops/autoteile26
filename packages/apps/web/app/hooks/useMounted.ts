import { useState, useEffect } from 'react';

/**
 * Custom React hook that tracks whether the component has mounted.
 * 
 * This hook is useful for safely accessing browser-specific APIs, such as localStorage
 * or features that depend on the DOM to prevent hydration errors in Next.js.
 * It returns a Boolean value that only becomes true after the initial render.
 *
 * @returns {boolean} - Returns true if the component has mounted, false otherwise.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return mounted;
}
