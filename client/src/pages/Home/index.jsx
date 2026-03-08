import { useSelector } from "react-redux";
import MovieCard from "../../components/MovieCard";

function Home() {
  const movies = useSelector((state) => state.movies.trending);

  return (
    <section>
      <h1 className="section-title">Trending Movies</h1>
      {movies.length === 0 ? (
        <p className="empty">No movies loaded yet. API integration comes in next step.</p>
      ) : (
        <div className="card-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
