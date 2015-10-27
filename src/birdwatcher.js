/**
 * @name birdwatcher.js
 * @author Gidi Meir Morris, 2014
 * @version 0.5.1
 *
 * Birdwatcher (Slang) A spy, usually used in the UK.
 *
 */

import defaultConfiguration from './configuration';
import createErrorClosure from './createErrorClosure';

/**
 * The Birdwatcher is a higher order function that wraps a function or an object's functions with error handling
 * to allow better seperation of generic error handling from the specific implementation of a component.
 * If an error is raised by the method, it is caught and can be dealt with.
 *
 * Based on the Exception handling pattern by Nicholas C. Zakas
 * @link http://www.nczonline.net/blog/2009/04/28/javascript-error-handling-anti-pattern/
 *
 * @example:
 *   As a decorator:
 *
 *   import birdwatch from 'birdwatcher';
 *
 *   @birdwatch('SomeComponent', {})
 *   class SomeComponent {
 *     ...
 *   }
 *
 *   As a higher order function:
 *
 *   import connectToStores from 'Connect-to-Stores';
 *
 *   export default birdwatch(SomeComponent, 'SomeComponent', {})
 *
 * @param  {Function} watchedComponent  The object to wrap
 * @param  {String} name  The name this object should be identified as (Should be used for all insatances of this object)
 * @param  {Object} configuration Configuration values to override the defaults for this specific component
 * @return {Function} The original Function wrapped in birdwatching composition, or the original object with it's property functions wrapped
 */
export default function birdwatcher(watchedComponent, name = '', configuration = defaultConfiguration) {
  if (typeof name === 'object') {
    configuration = name;
    name = '';
  }
  // merge custom configuration with default configuration
  let config = configuration;
  if (config && config !== defaultConfiguration) {
    if (typeof configuration !== 'object') {
      config = defaultConfiguration;
    } else {
      config = Object.assign({}, defaultConfiguration, configuration);
    }
  }

  let returnObject;
  if (typeof watchedComponent === 'object' || typeof watchedComponent === 'function') {
    if (typeof watchedComponent === 'function') {
      // If this is a function and not an object then the method doesn't actually have a name
      // If a name is specified as an argument then we can use that to identify the unnamed function

      // functions are wrapped, so we have a new funciton in memory to point to and return
      if (config.watchFunction) {
        // don't wrap a function unless watchFunction is True (which is the default)
        returnObject = createErrorClosure(root, name, '', watchedComponent, config, birdwatcher);
      } else {
        // return the original function. This is useful for when we're wrapping the child properties of this function
        // but not the actual function.
        returnObject = watchedComponent;
      }
    } else {
      // objects aren't wrapped, but rather their properties are, so we return a new pointer 'returnObject' which
      // points to the same object in memory
      returnObject = watchedComponent;
    }

    // watch props if config is true or is an object and not forcfully prevented by the config
    if (config.watchProperties === true || (config.watchProperties !== false && typeof watchedComponent === 'object')) {
      // Cycle through the object's properties and find the methods (functions)
      const keys = (config.watchDeep ? Reflect.ownKeys(watchedComponent) : Object.keys(watchedComponent));
      for (const prop of keys) {
        const method = watchedComponent[prop];
        if (typeof method === 'function') {
          /**
           * Create a cloure which will be called instead of the existing method on the birdwatchered object.
           * Usually it will simply add a call for the method and return it's value, as usual.
           * This is a completly covert operation... the object being birdwatchered doesn't even know
           * it has a spy on its ass.
           * This is the Jason Bourne of functions (not to be confused with James Bond
           * who goes around telling everyone who he is and what his favorite drink is.
           * Worst. Spy. Ever.)
           */
          returnObject[prop] = createErrorClosure(watchedComponent, name, prop, method, config, birdwatcher);
        }
      }
    }

    return returnObject;
  }
  return false;
}

/**
 * A higher order function that returns a configured BirdWatcher object with a predefined default configuration.
 *
 * @example:
 *  // customBirdWatcher.js
 *  import {configure} from 'birdwatcher';
 *
 *  export default configure({
 *    ...
 *  })
 *
 *  // other component file
 *  import {birdwatch} from 'customBirdWatcher';
 *  @birdwatch('SomeComponent')
 *  class SomeComponent {
 *    ...
 *  }
 *
 * @param  {Object} configurationOverride Configuration values to override the defaults for this BirdWatcher
 * @return {Function} Birdwatcher
 */
export function configure(configurationOverride) {
  return (watchedComponent, name, configuration = configurationOverride) => {
    if (typeof name === 'object') {
      configuration = name;
      name = '';
    }
    if (configuration !== configurationOverride) {
      if (!configuration || typeof configuration !== 'object') {
        configuration = configurationOverride;
      } else {
        configuration = Object.assign({}, configurationOverride, configuration);
      }
    }
    return birdwatcher(watchedComponent, name, configuration);
  };
}

export { isBirdwatcherError } from './error';
