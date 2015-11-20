'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configure;

var _birdwatcher = require('./birdwatcher');

var _birdwatcher2 = _interopRequireDefault(_birdwatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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
function configure(birdwatcherOverride, nameOverride, configurationOverride) {
  if (!(0, _birdwatcher.isBirdwatcher)(birdwatcherOverride)) {
    configurationOverride = nameOverride;
    nameOverride = birdwatcherOverride;
    birdwatcherOverride = false;
  }
  if (typeof nameOverride !== 'string') {
    configurationOverride = nameOverride;
    nameOverride = false;
  }
  if ((typeof configurationOverride === 'undefined' ? 'undefined' : _typeof(configurationOverride)) !== 'object') {
    configurationOverride = false;
  }
  return (0, _birdwatcher.paintBirdwatcher)(function (watchedComponent, name) {
    var configuration = arguments.length <= 2 || arguments[2] === undefined ? configurationOverride : arguments[2];

    if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
      configuration = name;
      name = false;
    }
    name = name || nameOverride;
    if (configuration !== configurationOverride) {
      if (!configuration || (typeof configuration === 'undefined' ? 'undefined' : _typeof(configuration)) !== 'object') {
        configuration = configurationOverride;
      } else {
        configuration = Object.assign({}, configurationOverride, configuration);
      }
    }

    if (watchedComponent === null) {
      return configure(birdwatcherOverride, name, configuration);
    }
    // pass the component, name and config to either the birdwatcherOverride or, if there is none, birdwatcher
    return (birdwatcherOverride || _birdwatcher2.default)(watchedComponent, name, configuration);
  });
}