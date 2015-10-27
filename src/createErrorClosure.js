import birdwatcherError from './error';

export default function(birdwatcheredObj, name, methodName, method, configuration, birdwatcherObject) {
  // pass args through addsOn filters
  if (birdwatcherObject.addOns) {
    // An addons can change the configuration before it is applied to an object
    configuration = birdwatcherObject.addOns.each('configureClosure', configuration, name, methodName, birdwatcheredObj);
    // An addons can wrap the method in any closure it wishes
    method = birdwatcherObject.addOns.each('errorClosure', method, methodName, configuration);
  }

  return () => {
    try {
      return method.apply(this, arguments);
    } catch (o_O) {
      // Check if there is any operation we may actually have to execute, if not, move along
      const noOp = !(configuration.rethrow || typeof configuration.onError === 'function');
      if (!noOp) {
        // We need a new accessor so that we can change it when the exception is errorized
        let err = o_O;
        // If the thrown object isn't an Error and the config says we should errorize it
        if (!(o_O instanceof Error) && configuration.errorize) {
          // figure out the message for the error object
          // If a name is specified we opt for a message which is labeled thas: [NAME:METHOD]
          let message = `Error [${name}:${methodName}] `;

          if (typeof o_O === 'object' && o_O.hasOwnProperty('message') && typeof o_O.message === 'string') {
            message += o_O.message;
          } else if (typeof o_O === 'string') {
            message += o_O;
          }
          err = birdwatcherError(message, o_O, birdwatcheredObj, name, methodName);

          // pass args through addsOn filters
          if (birdwatcherObject.addOns) {
            // An addons can make changes to an Error object which is created by the birdwatcher
            err = birdwatcherObject.addOns.each('errorized', err, configuration);
          }
        }

        if (typeof configuration.onError === 'function') {
          // call the onError callback in the context of the birdwatcheredObject
          configuration.onError.call(birdwatcheredObj, err, name, methodName, [...arguments], configuration, birdwatcherObject);
        }

        // Should we onRethrow the error
        if (configuration.rethrow === true) {
          // if a callback has been specified before the error needs to be rethrown - call it
          if (typeof configuration.onRethrow === 'function') {
            configuration.onRethrow.call(birdwatcheredObj, err, name, methodName, [...arguments], configuration, birdwatcherObject);
          }
          if (typeof err === 'object') {
            err.rethrownByBirdwatcher = true;
          }
          throw err;
        }
      }
    }
  };
}
