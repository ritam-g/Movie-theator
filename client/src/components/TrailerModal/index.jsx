/**
 * TrailerModal Component
 * 
 * A modal dialog component for playing movie trailers.
 * Displays an embedded YouTube iframe when a trailer is available,
 * or shows a fallback message if no trailer exists.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback to close the modal
 * @param {string} props.trailerKey - YouTube video key (optional)
 * @param {string} props.trailerUrl - Full YouTube URL (fallback if no key)
 * @param {string} props.title - Movie title for display
 */
import { FALLBACK_TRAILER_TEXT } from "../../utils/constants";

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - youtu.be/VIDEO_ID
 * - youtube.com/watch?v=VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * 
 * @param {string} url - YouTube URL
 * @returns {string} Video ID or empty string
 */
function extractYoutubeKey(url = "") {
  if (!url) return "";

  // Match short format: youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/i);
  if (shortMatch?.[1]) return shortMatch[1];

  // Match standard format: youtube.com/watch?v=VIDEO_ID
  const fullMatch = url.match(/[?&]v=([^?&]+)/i);
  if (fullMatch?.[1]) return fullMatch[1];

  return "";
}

function TrailerModal({ isOpen, onClose, trailerKey, trailerUrl, title }) {
  // Don't render if modal is closed
  if (!isOpen) return null;

  // Get video key from either direct key or URL
  const key = trailerKey || extractYoutubeKey(trailerUrl);

  return (
    // Modal backdrop
    <div role="dialog" aria-modal="true" className="modal-backdrop">
      <div className="card" style={{ maxWidth: 900, margin: "2rem auto" }}>
        <div className="card-body">
          {/* Header with title and close button */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{title || "Trailer"}</strong>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>

          {/* Show YouTube embed if trailer key exists */}
          {key ? (
            <iframe
              style={{ width: "100%", height: 450, marginTop: 12, border: 0 }}
              src={`${import.meta.env.VITE_YOUTUBE_EMBED}/${key}`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            // Fallback message when no trailer available
            <p className="empty">{FALLBACK_TRAILER_TEXT}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
