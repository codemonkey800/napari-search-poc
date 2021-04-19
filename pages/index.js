import { useState } from 'react';
import { formatTime } from '../shared';
import { useFetchIndex } from '../hooks/useFetchIndex';
import { useSearchQuery } from '../hooks/useSearchQuery';

const SEARCH_ENGINES = {
  flexsearch: 'FlexSearch',
  fusejs: 'Fuse.js',
  lunr: 'Lunr',
  minisearch: 'MiniSearch',
};

export default function Home() {
  const [engine, setEngine] = useState('flexsearch');
  const [state, setState] = useState('loading');
  const { indexData, clearIndex } = useFetchIndex(engine, setState);
  const {
    error,
    searchDiff,
    indexDiff,
    results,
    query,
    setQuery,
  } = useSearchQuery(engine, indexData, state);

  const resultsSubset = results.slice(0, 10);

  return (
    <main>
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="query-field">
          <label>Search Engine:</label>

          <select
            value={engine}
            onChange={(event) => {
              clearIndex();
              setEngine(event.target.value);
            }}
          >
            {Object.entries(SEARCH_ENGINES).map(([key, searchEngine]) => (
              <option key={searchEngine} value={key}>
                {searchEngine}
              </option>
            ))}
          </select>
        </div>

        <div className="query-field">
          <label>Query:</label>
          <input
            placeholder="enter search query..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <p>Error: {error}</p>
        <p>State: {state}</p>
        <p>Index: {formatTime(indexDiff)}</p>
        <p>Search: {formatTime(searchDiff)}</p>
      </form>

      <section>
        <header>
          <h1>
            Search Results: {resultsSubset.length} / {results.length}
          </h1>
        </header>

        <pre>{JSON.stringify(resultsSubset, null, 2)}</pre>

        {/* {resultsSubset.map(({ id, author, body }) => (
          <article key={id}>
            <h1>{author}</h1>
            <p>{body}</p>
          </article>
        ))} */}

        {/* {resultsSubset.map(({ author, name, summary, description }) => (
          <article key={name}>
            <h1>
              {name} - {author}
            </h1>
            <h2>{summary}</h2>
            <pre>{description}</pre>
          </article>
        ))} */}
      </section>
    </main>
  );
}
