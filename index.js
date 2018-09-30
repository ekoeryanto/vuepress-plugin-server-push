const path = require('path');

const crawl = require('./crawler');
const transform = require('./transformer');

module.exports = (options, context) => {
  const { outDir } = context;
  const { firebase = '', netlify = '' } = options;

  return {
    async generated() {
      if (!firebase || !netlify) return;

      const headers = await crawl({ dest: outDir });

      if (netlify) {
        transform.netlify(headers, path.resolve(outDir, netlify));
      }

      if (firebase) {
        transform.firebase(headers, path.resolve(firebase));
      }
    }
  };
};
