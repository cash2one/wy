'use strict';

module.exports = function(name) {
  try {
    delete require.cache[require.resolve(name)];
  } catch (e) { }
  return require(name);
}