import { fetchOriginalData } from './shared';

export async function searchFlexSearch(query, index) {
  const searchResults = await index.search({
    query,
  });
  return searchResults;
}

export async function searchFuseJS(query, index) {
  if (!window.data) {
    const { data } = await fetchOriginalData();
    window.data = data;
  }
  return index.search(query);
}

export async function searchLunr(query, index) {
  const { dataMap } = await fetchOriginalData();
  const results = index.search(query);
  results.forEach((result) => {
    result.data = dataMap[result.ref];
  });

  return results;
}

export async function searchMiniSearch(query, index) {
  const { dataMap } = await fetchOriginalData();
  const results = index.search(query, { fuzzy: 0.4 });
  results.forEach((result) => {
    result.data = dataMap[result.id];
  });

  return results;
}
