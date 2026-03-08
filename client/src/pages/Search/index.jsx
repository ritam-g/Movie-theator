import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MovieCard from "../../components/MovieCard";
import Skeleton from "../../components/Skeleton";
import Loader from "../../components/Loader";
import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { clearSearchState, fetchSearchResults } from "../../redux/slices/movieSlice";

function Search() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const { searchResults, searchLoading, searchPage, searchTotalPages } = useSelector((state) => state.movies);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      dispatch(clearSearchState());
      return;
    }

    dispatch(fetchSearchResults({ query: debouncedQuery, page: 1, append: false }));
  }, [dispatch, debouncedQuery]);

  const hasMore = searchPage < searchTotalPages;
  const loadMore = useCallback(() => {
    if (searchLoading || !hasMore || !debouncedQuery.trim()) return;
    dispatch(fetchSearchResults({ query: debouncedQuery, page: searchPage + 1, append: true }));
  }, [dispatch, searchLoading, hasMore, debouncedQuery, searchPage]);

  const sentinelRef = useInfiniteScroll(loadMore, { threshold: 0.2 });

  const message = useMemo(() => {
    if (!debouncedQuery.trim()) return "Search movies, TV shows, and actors";
    if (searchLoading && searchResults.length === 0) return "Searching...";
    if (searchResults.length === 0) return "No results found";
    return `Found ${searchResults.length} result(s)`;
  }, [debouncedQuery, searchLoading, searchResults.length]);

  return (
    <section>
      <h1 className="section-title">Search</h1>
      <input
        className="form-control"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search movies, TV shows, actors..."
      />
      <p className="meta">{message}</p>

      {searchLoading && searchResults.length === 0 ? <Skeleton count={8} /> : null}
      <div className="card-grid">
        {searchResults.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.title}`} movie={movie} />
        ))}
      </div>

      <div ref={sentinelRef} style={{ minHeight: 1, marginTop: 12 }} />
      {searchLoading && searchResults.length > 0 ? <Loader label="Loading more results..." /> : null}
    </section>
  );
}

export default Search;
