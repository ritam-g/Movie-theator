/**
 * Search Page Component
 * 
 * Allows users to search for movies, TV shows, and actors.
 * Features:
 * - Search input with debouncing (waits for user to stop typing)
 * - Infinite scroll for pagination
 * - Loading states
 * - Results display in card grid
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MovieCard from "../../components/MovieCard";
import Skeleton from "../../components/Skeleton";
import Loader from "../../components/Loader";
import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
// Redux actions
import { clearSearchState, fetchSearchResults } from "../../redux/slices/movieSlice";

function Search() {
  const dispatch = useDispatch();

  // Local search query state
  const [query, setQuery] = useState("");

  // Debounce the search query to avoid too many API calls
  // Only searches after user stops typing for 500ms
  const debouncedQuery = useDebounce(query, 500);

  // Get search results from Redux store
  const { searchResults, searchLoading, searchPage, searchTotalPages } = useSelector((state) => state.movies);

  // Effect to fetch results when debounced query changes
  useEffect(() => {
    // Clear search state if query is empty
    if (!debouncedQuery.trim()) {
      dispatch(clearSearchState());
      return;
    }

    // Fetch search results for first page
    dispatch(fetchSearchResults({ query: debouncedQuery, page: 1, append: false }));
  }, [dispatch, debouncedQuery]);

  // Check if there are more pages to load
  const hasMore = searchPage < searchTotalPages;

  /**
   * Load more results (for infinite scroll)
   */
  const loadMore = useCallback(() => {
    // Don't load if already loading or no more pages or empty query
    if (searchLoading || !hasMore || !debouncedQuery.trim()) return;
    dispatch(fetchSearchResults({ query: debouncedQuery, page: searchPage + 1, append: true }));
  }, [dispatch, searchLoading, hasMore, debouncedQuery, searchPage]);

  // Ref for infinite scroll sentinel element
  const sentinelRef = useInfiniteScroll(loadMore, { threshold: 0.2 });

  /**
   * Generate status message based on current state
   * Shows different messages for: initial, loading, no results, results found
   */
  const message = useMemo(() => {
    if (!debouncedQuery.trim()) return "Search movies, TV shows, and actors";
    if (searchLoading && searchResults.length === 0) return "Searching...";
    if (searchResults.length === 0) return "No results found";
    return `Found ${searchResults.length} result(s)`;
  }, [debouncedQuery, searchLoading, searchResults.length]);

  return (
    <section>
      <h1 className="section-title">Search</h1>

      {/* Search input */}
      <input
        className="form-control"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search movies, TV shows, actors..."
      />

      {/* Status message */}
      <p className="meta">{message}</p>

      {/* Show skeleton on initial load */}
      {searchLoading && searchResults.length === 0 ? <Skeleton count={8} /> : null}

      {/* Results grid */}
      <div className="card-grid">
        {searchResults.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.title}`} movie={movie} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} style={{ minHeight: 1, marginTop: 12 }} />

      {/* Loading more indicator */}
      {searchLoading && searchResults.length > 0 ? <Loader label="Loading more results..." /> : null}
    </section>
  );
}

export default Search;
