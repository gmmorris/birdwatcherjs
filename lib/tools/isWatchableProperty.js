"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isWatchablePropertyOfComponent = isWatchablePropertyOfComponent;
exports.isWatchablePropertyOfConstructor = isWatchablePropertyOfConstructor;
function isWatchablePropertyOfComponent(watchedComponent, methodName) {
  if (!watchedComponent || !methodName) {
    return false;
  }

  var method = watchedComponent[methodName];

  var _ref = Object.getOwnPropertyDescriptor(watchedComponent, methodName) || {};

  var configurable = _ref.configurable;
  var writable = _ref.writable;

  if (method instanceof Function &&
  // we can't change non configurable or writable methods
  configurable && writable) {
    // granted, this syntax is kind of ugly
    return true;
  }
  return false;
}

function isWatchablePropertyOfConstructor(WatchedClass, methodName) {
  if (!WatchedClass || !methodName) {
    return false;
  }

  var proto = WatchedClass.prototype;
  if (proto.hasOwnProperty(methodName)) {
    var method = proto[methodName];

    var _ref2 = Object.getOwnPropertyDescriptor(proto, methodName) || {};

    var configurable = _ref2.configurable;
    var writable = _ref2.writable;

    if (method instanceof Function &&
    // we can't change non configurable or writable methods
    configurable && writable &&
    // touching the constructor won't help us here, as we're modifying an existing instance
    method !== WatchedClass) {
      // granted, this syntax is kind of ugly
      return true;
    }
  }
  return false;
}