import { FALLBACK_TRAILER_TEXT } from "../../utils/constants";

function extractYoutubeKey(url = "") {
  if (!url) return "";
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/i);
  if (shortMatch?.[1]) return shortMatch[1];
  const fullMatch = url.match(/[?&]v=([^?&]+)/i);
  if (fullMatch?.[1]) return fullMatch[1];
  return "";
}

function TrailerModal({ isOpen, onClose, trailerKey, trailerUrl, title }) {
  if (!isOpen) return null;
  const key = trailerKey || extractYoutubeKey(trailerUrl);

  return (
    <div role="dialog" aria-modal="true" className="modal-backdrop">
      <div className="card" style={{ maxWidth: 900, margin: "2rem auto" }}>
        <div className="card-body">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{title || "Trailer"}</strong>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
          {key ? (
            <iframe
              style={{ width: "100%", height: 450, marginTop: 12, border: 0 }}
              src={`${import.meta.env.VITE_YOUTUBE_EMBED}/${key}`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <p className="empty">{FALLBACK_TRAILER_TEXT}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
