import { useState } from "react";

type SearchResult = {
  title: string;
  content: string;
}

function App(){
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if(!query.trim()) return;

    const res = await fetch(
    `http://localhost:5001/api/search?q=${query}`
    )
    const data = await res.json();
    setResults(data);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>Search</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />

      <button
        onClick={handleSearch}
        style={{ marginLeft: "10px", padding: "8px 12px" }}
      >
        Search
      </button>

      {/* Results */}
      <div style={{ marginTop: "30px" }}>
        {results.length === 0 && <p>No results</p>}

        {results.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px"
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );

}

export default App;
