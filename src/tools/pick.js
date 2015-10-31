/*
* A simply implementation of _.pick
* @param  {Object} source  The object from which we wish to pick properties
* @param  {String} keys  The names of properties to pick
* @return {Object} A new object with the picked properties on it
*/
export default function pick(source, ...keys) {
  const pickedObject = {};
  if (typeof source === 'object') {
    while (keys.length) {
      const key = keys.pop();
      if (source[key] !== void 0) {
        pickedObject[key] = source[key];
      }
    }
  }
  return pickedObject;
}
