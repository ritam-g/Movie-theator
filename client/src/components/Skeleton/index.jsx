/**
 * Skeleton Component
 * 
 * A loading placeholder component that displays a skeleton animation
 * while content is being fetched. This provides a better UX by showing
 * the layout structure before the actual content loads.
 * 
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton cards to display
 */
function Skeleton({ count = 8 }) {
  return (
    <div className="card-grid">
      {/* Create an array of specified length and render skeleton cards */}
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="card">
          {/* Placeholder for poster image */}
          <div style={{ height: 250, background: "#eef1f5" }} />
          <div className="card-body">
            {/* Placeholder for title */}
            <div style={{ height: 14, background: "#eef1f5", marginBottom: 8 }} />
            {/* Placeholder for year - narrower than title */}
            <div style={{ height: 14, background: "#f3f4f6", width: "60%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
