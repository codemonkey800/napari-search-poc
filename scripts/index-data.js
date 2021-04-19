const arg = require('arg');
const { shuffle } = require('lodash');
const Fuse = require('fuse.js');
const FlexSearch = require('flexsearch');
const lunr = require('lunr');
const MiniSearch = require('minisearch');
const { writeFileSync, statSync, mkdirSync, readFileSync } = require('fs');
const { resolve } = require('path');
const { performance } = require('perf_hooks');

const { INDEX_FIELDS, formatTime, options } = require('../shared');

const DATA_LIMIT = 10000;
const REDDIT_DATA_FILE = resolve(__dirname, 'reddit.json');
const ORIGINAL_DATA_FILE = resolve(__dirname, '../public/data.json');

class Indexer {
  loadRedditData() {
    return readFileSync(REDDIT_DATA_FILE, 'utf-8')
      .split('\n')
      .filter(Boolean)
      .reduce((result, json) => {
        const obj = JSON.parse(json);
        result.push(obj);
        return result;
      }, []);
  }

  loadNapariData() {
    return require('./napari.json');
  }

  loadData() {
    let data;

    if (this.dataType === 'napari') {
      data = this.loadNapariData();
    } else if (this.dataType) {
      data = this.loadRedditData();
    } else {
      throw new Error(`unsupported data type: ${this.dataType}`);
    }

    data = shuffle(data);
    data = data.slice(0, DATA_LIMIT);
    data.forEach((entry, index) => {
      entry.id = index;
    });

    this.data = data;
  }

  writeIndex(indexData) {
    if (typeof indexData !== 'string') {
      indexData = JSON.stringify(indexData);
    }

    const dir = resolve(__dirname, `../public/${this.engine}`);
    try {
      statSync(dir);
    } catch (_) {
      mkdirSync(dir);
    }

    const file = resolve(dir, 'index.json');
    writeFileSync(file, indexData);
  }

  indexFlexSearch() {
    const index = new FlexSearch(options.flexSearch);
    index.add(this.data);
    this.writeIndex(index.export());
  }

  indexFuseJS() {
    const index = Fuse.createIndex(INDEX_FIELDS, this.data);
    this.writeIndex(index.toJSON());
  }

  indexLunr() {
    const { data } = this;
    const index = lunr(function lunrSetup() {
      this.ref('id');
      this.metadataWhitelist = ['position'];
      INDEX_FIELDS.forEach(this.field.bind(this));
      data.forEach(this.add.bind(this));
    });

    this.writeIndex(index);
  }

  indexMiniSearch() {
    const index = new MiniSearch(options.miniSearch);

    index.addAll(this.data);
    this.writeIndex(index.toJSON());
  }

  printHelp() {
    console.log(`Usage: node index-data --engine <search engine>`);
    console.log();
    console.log('Search Engines:');
    console.log('  flexsearch');
    console.log('  fusejs');
    console.log('  lunr');
    console.log('  minisearch');
  }

  writeOriginalData() {
    writeFileSync(ORIGINAL_DATA_FILE, JSON.stringify(this.data));
  }

  main() {
    this.engine = process.env.ENGINE || 'flexsearch';
    this.dataType = process.env.DATA_TYPE || 'napari';
    this.loadData();

    const engineHandlers = {
      flexsearch: this.indexFlexSearch,
      fusejs: this.indexFuseJS,
      lunr: this.indexLunr,
      minisearch: this.indexMiniSearch,
    };

    const shouldWriteOriginalData = true;
    if (this.engine) {
      const start = performance.now();
      const handler = engineHandlers[this.engine];

      if (!handler) {
        throw new Error(`invalid engine '${this.engine}'`);
      }

      handler.call(this);
      const end = performance.now();
      console.log(`indexing completed in ${formatTime(end - start)}`);
    } else {
      this.printHelp();
      this.shouldWriteOriginalData = false;
    }

    if (shouldWriteOriginalData) {
      this.writeOriginalData();
    }
  }
}

const indexer = new Indexer();
indexer.main();
