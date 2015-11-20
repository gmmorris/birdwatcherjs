'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (birdwatcheredObj, name, methodName, method, configuration, birdwatcherObject) {
  var _this = this,
      _arguments = arguments;

  return function () {
    try {
      return method.apply(_this, _arguments);
    } catch (o_O) {
      // Check if there is any operation we may actually have to execute, if not, move along
      var noOp = !(configuration.rethrow || typeof configuration.onError === 'function');
      if (!noOp) {
        // We need a new accessor so that we can change it when the exception is errorized
        var err = o_O;
        // If the thrown object isn't an Error and the config says we should errorize it
        if (!(o_O instanceof Error) && configuration.errorize) {
          // figure out the message for the error object
          // If a name is specified we opt for a message which is labeled thas: [NAME:METHOD]
          var message = 'Error [' + name + ':' + methodName + '] ';

          if ((typeof o_O === 'undefined' ? 'undefined' : _typeof(o_O)) === 'object' && o_O.hasOwnProperty('message') && typeof o_O.message === 'string') {
            message += o_O.message;
          } else if (typeof o_O === 'string') {
            message += o_O;
          }
          err = (0, _error2.default)(message, o_O, birdwatcheredObj, name, methodName);
        }

        if (typeof configuration.onError === 'function') {
          // call the onError callback in the context of the birdwatcheredObject
          configuration.onError.call(birdwatcheredObj, err, name, methodName, [].concat(Array.prototype.slice.call(_arguments)), configuration, birdwatcherObject);
        }

        // Should we onRethrow the error
        if (configuration.rethrow === true) {
          // if a callback has been specified before the error needs to be rethrown - call it
          if (typeof configuration.onRethrow === 'function') {
            configuration.onRethrow.call(birdwatcheredObj, err, name, methodName, [].concat(Array.prototype.slice.call(_arguments)), configuration, birdwatcherObject);
          }
          if ((typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object') {
            err.rethrownByBirdwatcher = true;
          }
          throw err;
        }
      }
    }
  };
};

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }