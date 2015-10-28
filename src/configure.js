import birdwatcher from './birdwatcher';

/**
 * A utility function that returns a BirdWatcher entry point with a predefined default configuration.
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
 * @param  {String} nameOverride A default name to give any unnamed object
 * @param  {Object} configurationOverride Configuration values to override the defaults for this BirdWatcher
 * @return {Function} Birdwatcher
 */
export default function configure(nameOverride, configurationOverride) {
  if (typeof nameOverride === 'object') {
    configurationOverride = nameOverride;
    nameOverride = false;
  }
  return (watchedComponent, name, configuration = configurationOverride) => {
    if (typeof name === 'object') {
      configuration = name;
      name = false;
    }
    name = name || nameOverride;
    if (configuration !== configurationOverride) {
      if (!configuration || typeof configuration !== 'object') {
        configuration = configurationOverride;
      } else {
        configuration = Object.assign({}, configurationOverride, configuration);
      }
    }

    if (watchedComponent === null) {
      return configure(name, configuration);
    }
    return birdwatcher(watchedComponent, name, configuration);
  };
}
