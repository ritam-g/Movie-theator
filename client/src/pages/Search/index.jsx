import { useMemo, useState } from "react";
import useDebounce from "../../hooks/useDebounce";

function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const message = useMemo(() => {
    if (!debouncedQuery) return "Search movies, TV shows, and actors";
    return `Searching for: ${debouncedQuery}`;
  }, [debouncedQuery]);

  return (
    <section>
      <h1 className="section-title">Search</h1>
      <input
        className="form-control"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Type to search..."
      />
      <p className="empty">{message}</p>
    </section>
  );
}

export default Search;
