/**
 * useInfiniteScroll Custom Hook
 * 
 * This hook implements infinite scrolling functionality using the Intersection Observer API.
 * It detects when the user scrolls to a "sentinel" element at the bottom of the page
 * and triggers a callback to load more content.
 * 
 * This is commonly used for:
 * - Loading more items when scrolling to the bottom of a list
 * - Pagination without user interaction
 * - "Load more" functionality
 * 
 * @param {Function} callback - Function to call when sentinel comes into view
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold (0-1), default 0.25
 * @returns {React.RefObject} Ref to attach to the sentinel element
 */
import { useEffect, useRef } from "react";

function useInfiniteScroll(callback, options = {}) {
  // Ref to hold the sentinel element (invisible element at bottom of list)
  const sentinelRef = useRef(null);

  useEffect(() => {
    // Don't set up observer if no sentinel ref or callback
    if (!sentinelRef.current || typeof callback !== "function") return;

    // Create IntersectionObserver to detect when sentinel is visible
    const observer = new IntersectionObserver(
      (entries) => {
        // If sentinel is visible in viewport, trigger the callback
        if (entries[0]?.isIntersecting) {
          callback();
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: "0px", // No margin
        threshold: options.threshold ?? 0.25, // Trigger when 25% visible
      }
    );

    // Start observing the sentinel element
    observer.observe(sentinelRef.current);

    // Cleanup: disconnect observer on unmount or when callback/threshold changes
    return () => observer.disconnect();
  }, [callback, options.threshold]);

  // Return the ref to be attached to the sentinel element
  return sentinelRef;
}

export default useInfiniteScroll;
