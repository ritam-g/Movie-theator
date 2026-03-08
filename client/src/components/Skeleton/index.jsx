function Skeleton({ count = 8 }) {
  return (
    <div className="card-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="card">
          <div style={{ height: 250, background: "#eef1f5" }} />
          <div className="card-body">
            <div style={{ height: 14, background: "#eef1f5", marginBottom: 8 }} />
            <div style={{ height: 14, background: "#f3f4f6", width: "60%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
