'use strict';

var _ = require('lodash-node'),
  colors = require('colors');

module.exports = {
  log(moduleName, prefix) {
    return ((str, colorId) => {
      str = (moduleName? `[${moduleName}] ` : '') + (str && _.isObject(str)? JSON.stringify(str) : str);
      // str = (moduleName? `[${moduleName}] ` : '') + (str && _.isObject(str)? JSON.stringify(str).toString().slice(1, -1) : str);
      console.log((prefix? `[${prefix}] ` : '') + (colorId? colors[colorId](str) : str));
    });
  }
};