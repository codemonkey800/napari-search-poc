const INDEX_FIELDS = ['name', 'summary', 'description', 'author'];
// const INDEX_FIELDS = ['author', 'body'];

module.exports = {
  INDEX_FIELDS,

  formatTime(diff) {
    let unit = 'ms';
    if (diff > 1000) {
      diff /= 1000;
      unit = 's';
    }

    return `${diff.toFixed(2)} ${unit}`;
  },

  options: {
    flexSearch: {
      doc: {
        id: 'id',
        field: INDEX_FIELDS,
      },
    },

    miniSearch: {
      fields: INDEX_FIELDS,
      storeFields: INDEX_FIELDS,
    },
  },
};
