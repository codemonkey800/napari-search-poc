import { useEffect, useState } from 'react';

export function useFetchIndex(engine, setState) {
  const [indexData, setIndexData] = useState('');

  function clearIndex() {
    setIndexData('');
  }

  useEffect(() => {
    async function fetchIndex() {
      setState(`fetching index for engine ${engine}`);
      const response = await fetch(`/${engine}/index.json`);
      const data = await response.text();
      setIndexData(data);
      setState(`fetched index for engine ${engine}`);
    }

    fetchIndex();
  }, [engine, setState]);

  return { indexData, clearIndex };
}
