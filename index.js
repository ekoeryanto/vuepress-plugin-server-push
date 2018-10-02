const path = require('path');
const spg = require('server-push-generator')

const transform = require('./transformer');

module.exports = (options, context) => {
  const { outDir } = context;
  const { firebase = '', netlify = '', ...globby } = options;

  return {
    async generated() {
      if (!firebase || !netlify) return;

      const headers = await spg({ cwd: outDir, ...globby });

      if (netlify) {
        transform.netlify(headers, path.resolve(outDir, netlify));
      }

      if (firebase) {
        transform.firebase(headers, path.resolve(firebase));
      }
    }
  };
};
