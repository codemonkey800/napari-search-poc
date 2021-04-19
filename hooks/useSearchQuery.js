import { useState } from 'react';

import { useSearchIndex } from './useSearchIndex';
import { useDebouncedSearch } from './useDebouncedSearch';

export function useSearchQuery(engine, indexData) {
  const [query, setQuery] = useState('');
  const { indexDiff, indexReady, indexRef } = useSearchIndex(engine, indexData);
  const { results, searchDiff } = useDebouncedSearch({
    engine,
    indexReady,
    indexRef,
    query,
  });

  return {
    results,
    query,
    setQuery,
    searchDiff,
    indexDiff,
  };
}
