let cachedData = null;
let cachedDataMap = null;

export async function fetchOriginalData() {
  if (!cachedData) {
    const response = await fetch('/data.json');
    cachedData = await response.json();
    cachedDataMap = cachedData.reduce((result, data) => {
      result[data.id] = data;
      return result;
    }, {});
  }

  return { data: cachedData, dataMap: cachedDataMap };
}
