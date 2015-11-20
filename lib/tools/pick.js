'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pick;

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/*
* A simply implementation of _.pick
* @param  {Object} source  The object from which we wish to pick properties
* @param  {String} keys  The names of properties to pick
* @return {Object} A new object with the picked properties on it
*/
function pick(source) {
  var pickedObject = {};
  if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) === 'object') {
    for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      keys[_key - 1] = arguments[_key];
    }

    while (keys.length) {
      var key = keys.pop();
      if (source[key] !== void 0) {
        pickedObject[key] = source[key];
      }
    }
  }
  return pickedObject;
}