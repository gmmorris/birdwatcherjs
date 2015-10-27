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
 * @return {Function}
 */
export default function birdwatcher(watchedComponent, name, configuration) {

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
 * @param  {Object} configuration Configuration values to override the defaults for this BirdWatcher
 * @return {Function} Birdwatcher
 */
export function configure(configuration) {

}
