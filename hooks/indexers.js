import FlexSearch from 'flexsearch';
import Fuse from 'fuse.js';
import lunr from 'lunr';
import MiniSearch from 'minisearch';

import { fetchOriginalData } from './shared';
import { INDEX_FIELDS, options } from '../shared';

export function getFlexSearchIndex(indexData) {
  const index = new FlexSearch({
    async: true,
    doc: {
      id: 'id',
      field: INDEX_FIELDS,
    },
  });
  index.import(indexData);

  return index;
}

export async function getFuseJSIndex() {
  const { data } = await fetchOriginalData();
  const fuseOptions = {
    includeScore: true,
    includeMatches: true,
    useExtendedSearch: true,
    keys: INDEX_FIELDS,
  };

  return new Fuse(data, fuseOptions);
}

export async function getLunrIndex() {
  const { data } = await fetchOriginalData();

  return lunr(function lunrSetup() {
    this.ref('id');
    this.metadataWhitelist = ['position'];
    INDEX_FIELDS.forEach(this.field.bind(this));
    data.forEach(this.add.bind(this));
  });
}

export function getMiniSearchIndex(indexData) {
  return MiniSearch.loadJSON(indexData, options.miniSearch);
}
