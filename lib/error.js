'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Sentinal = exports.Sentinal = Symbol('BirdwatcherError');

var isBirdwatcherError = exports.isBirdwatcherError = function isBirdwatcherError(o_O) {
  return o_O && o_O[Sentinal];
};

exports.default = function (message, originalError, srcObject, srcObjectName, method) {
  var err = Error(message);
  err[Sentinal] = 1;
  err.name = 'BirdwatcherError';
  err.error = originalError;
  err.name = {
    src: srcObject,
    name: srcObjectName,
    method: method
  };
  return err;
};