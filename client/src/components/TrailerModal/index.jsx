function TrailerModal({ isOpen, onClose, trailerKey, title }) {
  if (!isOpen) return null;

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
          {trailerKey ? (
            <iframe
              style={{ width: "100%", height: 450, marginTop: 12, border: 0 }}
              src={`${import.meta.env.VITE_YOUTUBE_EMBED}/${trailerKey}`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <p className="empty">Trailer for this movie is currently unavailable.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
