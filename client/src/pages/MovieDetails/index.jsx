import { useParams } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();

  return (
    <section>
      <h1 className="section-title">Movie Details</h1>
      <p className="meta">Movie ID: {id}</p>
      <p className="empty">Detailed TMDB-backed content will be implemented in upcoming step.</p>
    </section>
  );
}

export default MovieDetails;
