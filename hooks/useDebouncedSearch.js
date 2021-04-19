import { useState } from 'react';
import { useDebounce } from 'react-use';

import {
  searchFlexSearch,
  searchFuseJS,
  searchLunr,
  searchMiniSearch,
} from './search';

const SEARCH_QUERY_DEBOUNCE_TIME_MS = 100;

const engineSearchHandlers = {
  flexsearch: searchFlexSearch,
  fusejs: searchFuseJS,
  lunr: searchLunr,
  minisearch: searchMiniSearch,
};

export function useDebouncedSearch({ engine, indexReady, indexRef, query }) {
  const [results, setResults] = useState([]);
  const [searchDiff, setSearchDiff] = useState(0);

  async function search() {
    if (!query || !indexReady) {
      setResults([]);
      return;
    }

    const start = performance.now();
    const handler = engineSearchHandlers[engine];
    const index = indexRef.current;
    try {
      const searchResults = await handler(query, index);
      setResults(searchResults);
    } catch (err) {
      setResults([]);
      console.error(err);
    }
    const end = performance.now();

    setSearchDiff(end - start);
  }

  useDebounce(search, SEARCH_QUERY_DEBOUNCE_TIME_MS, [
    query,
    indexReady,
    engine,
  ]);

  return { results, searchDiff };
}
