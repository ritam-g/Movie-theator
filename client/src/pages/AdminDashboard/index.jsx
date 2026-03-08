import { useCallback, useEffect, useMemo, useState } from "react";
import { adminService } from "../../services/adminService";
import { movieService } from "../../services/movieService";

const INITIAL_FORM = {
  title: "",
  posterUrl: "",
  description: "",
  releaseDate: "",
  trailerYoutubeLink: "",
  genre: "",
  category: "movie",
  tmdbId: "",
};

function AdminDashboard() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingMovieId, setEditingMovieId] = useState("");
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMovies = useCallback(async () => {
    try {
      const response = await movieService.getMovies({ source: "local", page: 1 });
      setMovies(response.data?.results || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data?.users || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadMovies();
    loadUsers();
  }, [loadMovies, loadUsers]);

  const onSubmitMovie = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      genre: form.genre
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (editingMovieId) {
        await adminService.updateMovie(editingMovieId, payload);
      } else {
        await adminService.createMovie(payload);
      }
      setForm(INITIAL_FORM);
      setEditingMovieId("");
      await loadMovies();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onEditMovie = (movie) => {
    setEditingMovieId(movie.id);
    setForm({
      title: movie.title || "",
      posterUrl: movie.posterUrl || "",
      description: movie.description || "",
      releaseDate: movie.releaseDate ? String(movie.releaseDate).slice(0, 10) : "",
      trailerYoutubeLink: movie.trailerYoutubeLink || "",
      genre: (movie.genre || []).join(", "),
      category: movie.category || "movie",
      tmdbId: movie.tmdbId || "",
    });
  };

  const onDeleteMovie = async (movieId) => {
    if (!window.confirm("Delete this movie?")) return;
    setLoading(true);
    try {
      await adminService.deleteMovie(movieId);
      await loadMovies();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onToggleBan = async (userId, isBanned) => {
    setLoading(true);
    try {
      await adminService.banUser(userId, !isBanned);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    setLoading(true);
    try {
      await adminService.deleteUser(userId);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const movieSubmitLabel = useMemo(() => (editingMovieId ? "Update Movie" : "Add Movie"), [editingMovieId]);

  return (
    <section>
      <h1 className="section-title">Admin Dashboard</h1>
      {error ? <p className="empty">{error}</p> : null}

      <div className="admin-grid">
        <article className="card">
          <div className="card-body">
            <h2 className="section-title">Movie Manager</h2>
            <form onSubmit={onSubmitMovie}>
              <input
                className="form-control"
                placeholder="Title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
              <input
                className="form-control"
                placeholder="Poster URL"
                value={form.posterUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, posterUrl: event.target.value }))}
              />
              <textarea
                className="form-control"
                placeholder="Description"
                rows={3}
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
              <input
                className="form-control"
                type="date"
                value={form.releaseDate}
                onChange={(event) => setForm((prev) => ({ ...prev, releaseDate: event.target.value }))}
              />
              <input
                className="form-control"
                placeholder="Trailer YouTube Link"
                value={form.trailerYoutubeLink}
                onChange={(event) => setForm((prev) => ({ ...prev, trailerYoutubeLink: event.target.value }))}
              />
              <input
                className="form-control"
                placeholder="Genre (comma separated)"
                value={form.genre}
                onChange={(event) => setForm((prev) => ({ ...prev, genre: event.target.value }))}
              />
              <input
                className="form-control"
                placeholder="TMDB ID"
                value={form.tmdbId}
                onChange={(event) => setForm((prev) => ({ ...prev, tmdbId: event.target.value }))}
              />
              <select
                className="form-control"
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              >
                <option value="movie">Movie</option>
                <option value="tv">TV</option>
                <option value="person">Person</option>
                <option value="custom">Custom</option>
              </select>
              <div className="details-actions">
                <button type="submit" className="primary" disabled={loading}>
                  {loading ? "Saving..." : movieSubmitLabel}
                </button>
                {editingMovieId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMovieId("");
                      setForm(INITIAL_FORM);
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </article>

        <article className="card">
          <div className="card-body">
            <h2 className="section-title">Movies</h2>
            {movies.length === 0 ? (
              <p className="empty">No local movies yet.</p>
            ) : (
              <div className="history-list">
                {movies.map((movie) => (
                  <article key={movie.id} className="history-item">
                    <span>{movie.title}</span>
                    <div className="details-actions">
                      <button type="button" onClick={() => onEditMovie(movie)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => onDeleteMovie(movie.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>

      <article className="card" style={{ marginTop: "1rem" }}>
        <div className="card-body">
          <h2 className="section-title">Users</h2>
          {users.length === 0 ? (
            <p className="empty">No users found.</p>
          ) : (
            <div className="history-list">
              {users.map((user) => (
                <article key={user.id} className="history-item">
                  <span>
                    {user.name} ({user.email})
                  </span>
                  <div className="details-actions">
                    <button type="button" onClick={() => onToggleBan(user.id, user.isBanned)}>
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>
                    <button type="button" onClick={() => onDeleteUser(user.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export default AdminDashboard;
