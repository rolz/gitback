'use strict';

var _ = require('lodash-node'),
  colors = require('colors');

exports.log = ((moduleName, prefix) => {
  return ((str, colorId) => {
    str = (moduleName? `[${moduleName}] ` : '') + JSON.stringify(str).slice(1, -1);
    console.log((prefix? `[${prefix}] ` : '') + (colorId? colors[colorId](str) : str));
  });
});


