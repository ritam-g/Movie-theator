import { useEffect, useRef } from "react";

function useInfiniteScroll(callback, options = {}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current || typeof callback !== "function") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callback();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: options.threshold ?? 0.25,
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [callback, options.threshold]);

  return sentinelRef;
}

export default useInfiniteScroll;
