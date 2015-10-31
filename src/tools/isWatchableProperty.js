
export function isWatchablePropertyOfComponent(watchedComponent, methodName) {
  if (!watchedComponent || !methodName) {
    return false;
  }

  const method = watchedComponent[methodName];
  const {configurable, writable} = Object.getOwnPropertyDescriptor(watchedComponent, methodName) || {};
  if (method instanceof Function &&
      // we can't change non configurable or writable methods
      configurable && writable) {
    // granted, this syntax is kind of ugly
    return true;
  }
  return false;
}

export function isWatchablePropertyOfConstructor(WatchedClass, methodName) {
  if (!WatchedClass || !methodName) {
    return false;
  }

  const proto = WatchedClass.prototype;
  if (proto.hasOwnProperty(methodName)) {
    const method = proto[methodName];
    const {configurable, writable} = Object.getOwnPropertyDescriptor(proto, methodName) || {};
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
