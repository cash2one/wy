'use strict';

const dist = './dist';
const src = './';

module.exports = {
  dist: dist,
  jsPath: `${dist}/js`,
  cssPath: `${dist}/css`,
  jsSourcePath: `${src}/js`,
  lessSourcePath: `${src}/less`,
  autoprefixerBrowsers: [
    'Android >= 2',
    'Chrome >= 20',
    'Firefox >= 24',
    'Explorer >= 9',
    'iOS >= 6',
    'Opera >= 12',
    'Safari >= 6'
  ]
}
