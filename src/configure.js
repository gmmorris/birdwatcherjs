import birdwatcher, {isBirdwatcher, paintBirdwatcher} from './birdwatcher';

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
 * @param  {Object} birdwatcherOverride Birdwatcher function to use in place of default birdwatcher
 * @param  {String} nameOverride A default name to give any unnamed object
 * @param  {Object} configurationOverride Configuration values to override the defaults for this BirdWatcher
 * @return {Function} Birdwatcher
 */
export default function configure(birdwatcherOverride, nameOverride, configurationOverride) {
  if (!isBirdwatcher(birdwatcherOverride)) {
    configurationOverride = nameOverride;
    nameOverride = birdwatcherOverride;
    birdwatcherOverride = false;
  }
  if (typeof nameOverride !== 'string') {
    configurationOverride = nameOverride;
    nameOverride = false;
  }
  if (typeof configurationOverride !== 'object') {
    configurationOverride = false;
  }
  return paintBirdwatcher((watchedComponent, name, configuration = configurationOverride) => {
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
      return configure(birdwatcherOverride, name, configuration);
    }
    // pass the component, name and config to either the birdwatcherOverride or, if there is none, birdwatcher
    return (birdwatcherOverride || birdwatcher)(watchedComponent, name, configuration);
  });
}
