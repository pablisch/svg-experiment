const { transform } = require('@svgr/core');
const fs = require('fs');

const svgCode = fs.readFileSync('raw/react.svg', 'utf8');

const svgrConfig = {
  svgoConfig: {
    plugins: [
      { removeViewBox: false },
      { cleanupIDs: false },
      { prefixIds: false },
    ],
  },
};

transform(svgCode, svgrConfig)
  .then(result => {
    console.log(result);
    fs.writeFileSync('comp/react.js', result.code);
  });