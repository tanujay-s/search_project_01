import { useState, useEffect } from "react";

type SearchResult = {
  id: string;
  score: number;
  title: string;
  url: string;
  snippet: string;
};

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 10;

  const handleSearch = async (pageNumber = 1) => {
    if (!query.trim()) return;

    const res = await fetch(
      `http://localhost:5001/api/search?q=${encodeURIComponent(query)}&page=${pageNumber}&limit=${limit}`
    );

    const data = await res.json();

    setResults(data.results || []);
    setTotalPages(data.totalPages || 0);
    setPage(data.page || 1);
  };

  useEffect(() => {
    if (query) {
      handleSearch(page);
    }
  }, [page]);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>Search</h2>

      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />

      <button
        onClick={() => handleSearch(1)}
        style={{ marginLeft: "10px", padding: "8px 12px" }}
      >
        Search
      </button>

      <div style={{ marginTop: "30px" }}>
        {results.length === 0 && <p>No results</p>}

        {results.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px"
            }}
          >
            <h3>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1a0dab", textDecoration: "none" }}
              >
                {item.title}
              </a>
            </h3>

            <p
              dangerouslySetInnerHTML={{
                __html: item.snippet
              }}
            />

            <small style={{ color: "gray" }}>
              Score: {item.score.toFixed(2)}
            </small>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          <span style={{ margin: "0 10px" }}>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;