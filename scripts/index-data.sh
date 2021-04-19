#!/bin/bash

DIR="$(dirname $0)"
ENGINES=('flexsearch' 'fusejs' 'lunr' 'minisearch')
DATA_TYPE="${DATA_TYPE:-napari}"

echo "Loading data type: ${DATA_TYPE}"

for engine in "${ENGINES[@]}"; do
  echo "Indexing data for $engine"
  DATA_TYPE="${DATA_TYPE}" ENGINE="${engine}" node ${DIR}/index-data
done
