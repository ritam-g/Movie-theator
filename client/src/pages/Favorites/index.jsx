import { useSelector } from "react-redux";
import MovieCard from "../../components/MovieCard";

function Favorites() {
  const favorites = useSelector((state) => state.favorites.items);

  return (
    <section>
      <h1 className="section-title">Favorites</h1>
      {favorites.length === 0 ? (
        <p className="empty">Your favorite list is empty.</p>
      ) : (
        <div className="card-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
