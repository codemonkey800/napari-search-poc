import { useEffect, useRef, useState } from 'react';

import {
  getFlexSearchIndex,
  getFuseJSIndex,
  getLunrIndex,
  getMiniSearchIndex,
} from './indexers';

const engineIndexHandlers = {
  flexsearch: getFlexSearchIndex,
  fusejs: getFuseJSIndex,
  lunr: getLunrIndex,
  minisearch: getMiniSearchIndex,
};

export function useSearchIndex(engine, indexData) {
  const [indexReady, setIndexReady] = useState(false);
  const [indexDiff, setIndexDiff] = useState(0);
  const indexRef = useRef(null);

  useEffect(() => {
    if (!indexData) {
      indexRef.current = null;
      setIndexReady(false);
      return;
    }

    async function setupIndex() {
      const start = performance.now();
      const index = await engineIndexHandlers[engine](indexData);
      console.log('Index ready:', index);
      indexRef.current = index;
      setIndexReady(true);
      const end = performance.now();

      setIndexDiff(end - start);
    }

    setupIndex();
  }, [indexData, engine]);

  return {
    indexDiff,
    indexReady,
    indexRef,
  };
}
