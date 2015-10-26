/**
 * @name birdwatcher.js
 * @author Gidi Meir Morris, 2014
 * @version 0.5.1
 *
 * Birdwatcher (Slang) A spy, usually used in the UK.
 *
 */
 (function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.birdwatcher = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    exports.birdwatcher = factory(exports);
  // Finally, as a browser global.
  } else {
    root.birdwatcher = factory(root);
  }

}(this, function(root, undefined) {
  'use strict';

  // Save the previous value of the `birdwatcher` variable.
  var conflictedBirdwatcher = root.birdwatcher;

  /**
   * The top-level namespace
   * @namespace birdwatcherJS. A covert error handling utility for Javascript.
   */
  var brdwtch;

  /***
   * The main birdwatcher method which covertly spies on an object's methods by listening for every
   * error thrown by them.
   * If an error is raised by the method, it is caught and can be dealt with.
   *
   * Based on the Exception handling pattern by Nicholas C. Zakas (MIT Licensed)
   * @link http://www.nczonline.net/blog/2009/04/28/javascript-error-handling-anti-pattern/
   *
   * @param birdwatcheredObj (object) The object we wish to add error handling to.
   * @param config (object, optional) Special configurations to take into account for this particular object
   */
  brdwtch = function(birdwatcheredObj, name, uniqueId, config) {

    if(typeof name === 'object' && name !== null) {
      config = name;
      uniqueId = null;
      name = null;
    } else if(typeof uniqueId === 'object' && uniqueId !== null) {
      config = uniqueId;
      uniqueId = null;
    } else {
      if(typeof uniqueId !== 'string') {
        uniqueId = null;
      }
      if(typeof name !== 'string') {
        uniqueId = null;
      }
    }

    /**
     * Merge the specific configuration for this object with the global birdwatcher configuration
     * so that the birdwatcher handler function has a single config object to use
     */
    config = config || {};
    config = extendTopDown(config, birdwatcherConfig);

    var returnObject;
    if(typeof birdwatcheredObj === 'object' || typeof birdwatcheredObj === 'function') {

      if(typeof birdwatcheredObj === 'function') {
        // If this is a function and not an object then the method doesn't actually have a name
        // If a name is specified as an argument then we can use that to identify the unnamed function

        // functions are wrapped, so we have a new funciton in memory to point to and return
        if(config.watchFunction) {
          // don't wrap a function unless watchFunction is True (which is the default)
          returnObject = createErrorClosure(root, name, uniqueId, '', birdwatcheredObj, config, brdwtch);
        } else {
          // return the original function. This is useful for when we're wrapping the child properties of this function
          // but not the actual function.
          returnObject = birdwatcheredObj;
        }
      } else {
        // objects aren't wrapped, but rather their properties are, so we return a new pointer 'returnObject' which
        // points to the same object in memory
        returnObject = birdwatcheredObj;
      }

      // watch props if config is true or is an object and not forcfully prevented by the config
      if(config.watchProperties === true || (config.watchProperties !== false && typeof birdwatcheredObj === 'object')) {
        // Cycle through the object's properties and find the methods (functions)
        for(var prop in birdwatcheredObj) {
          if(config.watchDeep || birdwatcheredObj.hasOwnProperty(prop)) {
            var method = birdwatcheredObj[prop];
            if(typeof method === "function") {
              /**
               * Create a cloure which will be called instead of the existing method on the birdwatchered object.
               * Usually it will simply add a call for the method and return it's value, as usual.
               * This is a completly covert operation... the object being birdwatchered doesn't even know
               * it has a spy on its ass.
               * This is the Jason Bourne of functions (not to be confused with James Bond
               * who goes around telling everyone who he is and what his favorite drink is.
               * Worst. Spy. Ever.)
               */
              returnObject[prop] = createErrorClosure(birdwatcheredObj, name, uniqueId, prop, method, config, brdwtch);
            }
          }
        }
      }

      return returnObject;
    }
    return false;
  };

  // Current version of the utility.
  brdwtch.VERSION = '0.5.1';

  // The default configuration
  var birdwatcherConfig = {

    /***
     * errorize (boolean) If a watched function throws a non Error should the originally thrown object be wrapped
     * by a custom Error object?
     */
    errorize: true,

    /***
     * onError (function) A callback to be called by the birdwatcher when an error occurs.
     * This is the main tool that birdwatcherJS supplies the user to deal with his error handling.
     * The signature of the callback should have the following parameters:
     * exception (object) An exception object with metadata about the error.
     * methodName (String) The name of the function that raised the error
     * configuration (Object) The birdwatcher configuration for the object which raised the error. Unless a unique configuration was specified when the birdwatcher operation was attached to the object, this will be the birdwatcher's default configuration.
     * birdwatcher (Object) The actual birdwatcher utility.
     * The context callback will be the actual object which raised the error, meaning thatthe keyword 'this' can be used to access it.
     */
    onError: null,

    /**
     * A boolean signifying whether an error should be rethrown after being caught by the birdwatcher.
     * This allows the user to continue with regular error handling in addition to the birdwatcher's operation.
     * This means you can log error and still use them to end failed operations in your business logic.
     * Much like using an indetectable poison to murder a high ranking government official without anyone knowing
     * it wasn't simply an innocent heart attack.
     */
    rethrow: true,
    /***
     * onRethrow (function) A callback to be called by the birdwatcher before rethrowing an error.
     * The signature of the callback should have the following parameters:
     * error (object) The actual Error object which was raised.
     * exception (object) An exception object with metadata about the error.
     * methodName (String) The name of the function that raised the error
     * configuration (Object) The birdwatcher configuration for the object which raised the error. Unless a unique configuration was specified when the birdwatcher operation was attached to the object, this will be the birdwatcher's default configuration.
     * birdwatcher (Object) The actual birdwatcher utility.
     * The context callback will be the actual object which raised the error, meaning thatthe keyword 'this' can be used to access it.
     */
    onRethrow: null,

    /****
     * watchFunctionProperties (boolean, options) Should the properties of the birdwatched object be investigated?
     * This may seem trivial, as watching properties is what Birdwatcher is all about, no? Well, not neceserily.
     * The intent behind Birdwatcher is to wrap all the properties of a regualr JS object, but what about a JS function?
     * A JS function should just be wrapped and returned in it's wraped state to be called manually by the library user
     * But sometime, especially with independant components, you will have a function which acts as a constructor or utility, and on
     * it there will be more JS functions which act a a sort of static method (jQuery is a great example of this, where $ is a function,
     * and calling $("#whatever") with some input returns an object which has it's own methods,  but you can also call "static" jQuery
     * functions, such as $.noConflict(). WHat if we wanted to Birdwatch our $ function but also it's noConflict (and other static functions) function?
     * Thats where watchProperties comes in.
     * If watchProperties is ir's default 'null', then for regular JS Objects we will assume that watchProperties is True, and for JS FUnctions we
     * will assume that watchProperties is False. But, if we have a cse like jQuery, then we wil set watchProperties to true and then both the main
     * function "$" will be watched and it's property functions such as noConflict.
     * Setting True or False will override this default, so setting True will always wrap the properties and False will never wrap properties (which for a regular JS Object
     * taht is basically a NoOp)
     *
     */
    watchProperties: null,

    /***
     * watchDeep (boolean) Should Birdwatcher search for all the functions on an Birdwatched object or just the ones directly on the object instance?
     * This means, in JS terms, should we add a watcher only to function which return True for 'hasOwnProperty' or should we watch it's prototype's functions too?
     * By default we wrap the object's entire behaviour, so we tell it to ignore 'hasOwnProperty' and watch all properties in the prototype chain.
     * By setting this to False we can limit the depth to only this object's direct properties rather than go deeper into the prototype chain.
     */
    watchDeep: true,

    /***
     * Should a function which is sent to Birdwatcher be watched?
     * This seems trivial - if we don't want the funciton watched, then why send it to Birdwatcher in the first place?
     * The reason is that we might want to add a watcher on the Property Functions that this function has but don't want the actual function watched.
     * This configuration is ignored by regular objects, and is only really relevant to function which have other functions as properties on them, otherwise
     * its a NoOp.
     * This configuration is for a very specific use case - when the function we're warpping is used throughout a system and has other references to the original
     * function and we don't have a way of replacing those references. An example of where this would be common is with a module managment system where we wish to add
     * Birdwatching capabilities to a module which is already defined in the module manager, so we can add wrapping to it's static functions but can't replace the
     * reference to the original function stored in the module manager. Ideally this wouldn't happen as the original object would be Birdwatched in the first
     * place, but that isn't always an option.
     */
    watchFunction: true
  };


  /**
   * Get/Set the configuration for the birdwatcher object
   * @param config (object,optional) A configuration object with any of the configuration properties
   * @example
   <code><pre>
   birdwatcher.configuration({
			onError: function(exception,methodName,configuration,birdwatcherObject){
				console.log(exception.message);
			}
		});
   </pre></code>
   */
  brdwtch.configuration = function(config) {
    // If an object param is provided - replace the specific properties
    // it has set in the param with the equivalent property in the config
    if(config && config instanceof Object) {
      // check whether custom configurations have been specified, if so use them instead
      // of the defaults
      for(var key in config) {
        if(birdwatcherConfig.hasOwnProperty(key) && config.hasOwnProperty(key)) {
          birdwatcherConfig[key] = config[key];
        }
      }
    }

    // return the configuration object
    return birdwatcherConfig;

  };

  /**
   * Revert the global window.birdwatcher variable to it's original value and return this birdwatcher object.
   * This allows users to include multiple versions of birdwatcher objects on a single page or another global variable named "birdwatcher".
   * @example
   <code><pre>
   birdwatcher.noConflict();
   </pre></code>
   */
  brdwtch.noConflict = function() {
    root.birdwatcher = conflictedBirdwatcher;
    return this;
  };


  var BirdwatcherError = brdwtch.Error = function(message, originalError, srcObject, srcObjectName, uniqueId, method) {
    this.name = "BirdwatcherError";
    this.error = originalError;
    this.src = {
      src: srcObject,
      name: srcObjectName,
      id: uniqueId,
      method: method
    };
  };
  BirdwatcherError.prototype = Error.prototype;

  /***
   * Extension functions
   */
  brdwtch.addOn = function(configuration) {
    if(isValidAdOnConfig(this, configuration)) {
      this.addOns = this.addOns || initAddOns(this);
      return this.addOns.install(configuration.Name, configuration.init(this));
    }
    return false;
  };

  /***
   * Internal functions
   */

  var createErrorClosure = function(birdwatcheredObj, name, uniqueId, methodName, method, configuration, birdwatcherObject) {

    // pass args through addsOn filters
    if(birdwatcherObject.addOns) {
      // An addons can change the configuration before it is applied to an object
      configuration = birdwatcherObject.addOns.each('configureClosure', configuration, name, uniqueId, methodName, birdwatcheredObj);
      // An addons can wrap the method in any closure it wishes
      method = birdwatcherObject.addOns.each('errorClosure', method, methodName, configuration);
    }

    return function() {
      try {
        return method.apply(this, arguments);
      } catch(o_O) {

        // Check if there is any operation we may actually have to execute, if not, move along
        var noOp = !(configuration.rethrow || typeof configuration.onError === "function");
        if(!noOp) {

          // We need a new accessor so that we can change it when the exception is errorized
          var err = o_O, args = Array.prototype.slice.call(arguments);
          // If the thrown object isn't an Error and the config says we should errorize it
          if(!(o_O instanceof Error) && configuration.errorize) {
            // figure out the message for the error object
            // If a name is specified we opt for a message which is labeled thas: [NAME:METHOD]
            // If a Unique ID is specified as weel then [NAME(UNIQUEID):METHOD]
            // If a unique ID is specified, but no name [(UNIQUEID):METHOD]
            var message = (uniqueId !== null ? "(" + uniqueId + ")" : '');
            message = (name !== null ? name + message : message);
            message = "Error [" + (message !== '' ? message + ":" : "") + methodName + "] ";

            if(typeof o_O === "object" && o_O.hasOwnProperty('message') && typeof o_O.message === 'string') {
              message += o_O.message;
            } else if(typeof o_O === "string") {
              message += o_O;
            }
            err = new BirdwatcherError(message, o_O, birdwatcheredObj, name, uniqueId, methodName);

            // pass args through addsOn filters
            if(birdwatcherObject.addOns) {
              // An addons can make changes to an Error object which is created by the birdwatcher
              err = birdwatcherObject.addOns.each('errorized', err, configuration);
            }
          }

          if(typeof configuration.onError === "function") {
            // call the onError callback in the context of the birdwatcheredObject
            configuration.onError.call(birdwatcheredObj, err, name, uniqueId, methodName, args, configuration, birdwatcherObject);
          }

          // Should we onRethrow the error
          if(configuration.rethrow === true) {
            // if a callback has been specified before the error needs to be rethrown - call it
            if(typeof configuration.onRethrow === 'function') {
              configuration.onRethrow.call(birdwatcheredObj, err, name, uniqueId, methodName, args, configuration, birdwatcherObject);
            }
            if(typeof err === 'object') {
              err.rethrownByBirdwatcher = true;
            }
            throw err;
          }
        }
      }
    };

  };

  /***
   * Borrowed from Underscore++ ( https://github.com/gmmorris/underscorepp ) as I didn't want to make birdwatcher dependant on Underscore++
   * ===========================
   * Merge objects in such a way that the preceding properties take precedence over the following properties.
   * This is similar to Underscore's extend method, but Underscore's extend method would give precedence to the following
   * properties, rather than the preceding ones.
   * @param obj (object) The object to extend
   * @param (objects) An unlimited number of parameters can be provided. Each parameter must be an object and it's properties
   *                  will be added to the first parameter (he object to be extended)
   * @returns {*}
   */
  var extendTopDown = function(obj) {
    /**
     * Cycle through the arguments from second to last and add their properties to
     * the first argument
     */
    for(var idx = 1; idx < arguments.length; idx++) {
      var objFrom = arguments[idx];
      if(typeof objFrom === 'object') {
        for(var prop in objFrom) {
          if(objFrom.hasOwnProperty(prop) && !obj.hasOwnProperty(prop)) {
            if(typeof objFrom[prop] === "function") {
              // use a closure to call the function within the context of the object
              // being extended
              obj[prop] = rebindFunction(objFrom[prop], obj);
            } else if(typeof objFrom[prop] === "object") {
              // if this property is an object, then extend it using this method as well
              obj[prop] = extendTopDown({}, objFrom[prop]);
            } else {
              obj[prop] = objFrom[prop];
            }
          }
        }
      } else {
        throw new Error("Underscore++[extendTopDown method]: All parameters must be Objects, but parameter #" + (idx + 1) + " is of type " + typeof objFrom);
      }
    }
    return obj;
  };


  /***
   * Wrap a function in a closure so that it is executed in a particular context.
   * We use this instead of Function.prototype.bind as that doesn't exist in older browsers
   * @param func (function) The function to rebind
   * @param context (object) The object in whose context the function should be called
   */
  var rebindFunction = function(func, context) {
    return function() {
      return func.apply(context, arguments);
    };
  };

  var validAddOnEvents = [
    // Called when an errorClosure is being created. The configuration object which is about to be used for this closure can now be manipulated
    // and changed by the AddOn
    'configureClosure',
    // Called when an errorClosure is being created. The actual method which is about to be wrapped will be passed to the addOn
    // which will then be expected to return a function which will take the method's place, usually this will be used to wrap the method
    // execution in another closure
    'errorClosure',
    // When an error object is created after an error is caught an AddOn can change that error object and extend it
    'errorized'
  ];
  /***
   * Check wether a specified config object is valid to be installed as a Birdwatcher AddOn
   * @param config
   * @returns {boolean}
   */
  var isValidAdOnConfig = function(birdwatcher, config) {
    if(config &&
      typeof config === 'object' &&
        // check for unique ID
      config.hasOwnProperty('Name') && !(birdwatcher.addOns && birdwatcher.addOns.hasOwnProperty(config.Name)) &&
        // check for init function
      config.hasOwnProperty('init') && typeof config.init === 'function') {
      // check all On event handlers
      if(config.hasOwnProperty('on')) {
        if(!config.on || typeof config.on !== 'object') {
          return false;
        }
        for(var eventName in config.on) {
          if(config.on.hasOwnProperty(eventName) && (typeof config.on[eventName] !== 'function' || indexOf.call(validAddOnEvents, eventName) === -1)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },
  /***
   * Create the AddOns object which will manage any external addOns installed into birdwatcher
   * @param birdwatcher
   */
  initAddOns = function(birdwatcher) {
    var addOns = {}, index = [];
    birdwatcher.addOns = {
      install: function(name, addOn) {
        addOns[name] = addOn;
        index.push(addOn);
        return addOn;
      },
      each: function(event, obj) {
        // args for AddOn event handler is - the object of interest, then any additional args, then the birdwatcher object
        var args = Array.prototype.slice.call(arguments, 1);
        args.push(birdwatcher);
        for(var n = 0; n < index.length; n++) {
          if(index[n].hasOwnProperty('on') && index[n].on.hasOwnProperty(event)) {
            // call On Event handler, passing the object of interest, any additional args supplied, the birdwatcher object  and called in the context of the addOn object
            args[0] = index[n].on[event].apply(index[n], args); // place return val in index of object of interest
          }
        }
        return args[0];
      }
    };
    return birdwatcher.addOns;
  };

  // Array.indexOf to support older browsers
  var indexOf = (function() {
    // Implement ECMA262-5 Array methods if not supported natively
    // borrowed from: http://stackoverflow.com/questions/2790001/fixing-javascript-array-functions-in-internet-explorer-indexof-foreach-etc
    if(!('indexOf' in Array.prototype)) {
      return function(find, i /*opt*/) {
        if(i === undefined) {
          i = 0;
        }
        if(i < 0) {
          i += this.length;
        }
        if(i < 0) {
          i = 0;
        }
        for(var n = this.length; i < n; i++) {
          if(i in this && this[i] === find) {
            return i;
          }
        }
        return -1;
      };
    } else {
      return Array.prototype.indexOf;
    }
  })();

  return brdwtch;
}));
