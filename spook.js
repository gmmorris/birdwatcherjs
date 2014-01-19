/**
 * @name spook.js
 * @author Gidi Meir Morris, 2014
 * @version 0.1
 */
(function (window,document,undefined) {

    /**
     * The top-level namespace
     * @namespace SpookJS. A covert error handling utility for Javascript.
     */
    var spk;

    /***
     * The main Spook method which covertly spies on an object's methods by listening for every
     * error thrown by them.
     * If an error is raised by the method, it is caught and can be dealt with.
     *
     * Best on the Exception handling anti-pattern by Nicholas C. Zakas (MIT Licensed)
     * @link http://www.nczonline.net/blog/2009/04/28/javascript-error-handling-anti-pattern/
     *
     * @param spookedObj (object) The object we wish to add error handling to.
     * @param config (object, optional) Spetial configurations to take into account for this particular object
     */
    spk = window.Spook = function(spookedObj,config){
        if (typeof spookedObj == 'object') {

            /**
             * Merge the specific configuration for this object with the global Spook configuration
             * so that the Spook handler function has a single config object to use
             */
            config = config || {};
            config = extendTopDown(config,spookConfig);

            // Cycle through the object's properties and find the methods (functions)
            for (var prop in spookedObj) {
                var method = spookedObj[prop];
                if (typeof method == "function") {
                    /**
                     * Create a cloure which will be called instead of the existing method on the spooked object.
                     * Usually it will simply add a call for the method and return it's value, as usual.
                     * This is a completly covert operation... the object being spooked doesn't even know
                     * it has a spy on its ass.
                     * This is the Jason Bourne of function (not to be confused with James Bond
                     * who goes around telling everyone who he is and what his favorite drink is.
                     * Worst. Spy. Ever.
                     */
                    spookedObj[prop] = (function (spookedObj,methodName, method, configuration, spookObject) {
                        return function () {
                            try {
                                return method.apply(this, arguments);
                            } catch (o_O) {

                                var exception = {
                                    message :'The method "' + methodName + '" raised the following error: ',
                                    method  :methodName
                                };

                                if (typeof o_O == 'object') {
                                    if (o_O.hasOwnProperty('message') && typeof o_O.message == 'string') {
                                        exception.message += o_O.message;
                                    }

                                    if(configuration.addStackTrace) {
                                        try {
                                            exception.stack = [];
                                            // Webkit
                                            retrieveStackTrace(exception,'stack');
                                            // FF
                                            retrieveStackTrace(exception,'stacktrace');
                                        } catch (exc) {
                                            // Stack trace retrieval failed, nothing more to do here
                                        }
                                    }

                                } else if (typeof o_O == 'string') {
                                    exception.message += o_O;
                                } else {
                                    exception.message += ' UNKNOWN';
                                }

                                if(typeof configuration.onError == "function") {
                                    // call the onError callback in the context of the spookedObject
                                    configuration.onError.call(spookedObj, exception,methodName,configuration,spookObject);
                                }

                                // Should we rethrow the error
                                if (configuration.rethrow) {
                                    // if a callback has been specified before the error needs to be rethrown - call it
                                    if (typeof configuration.onRethrow == 'function') {
                                        configuration.onRethrow.call(spookedObj, o_O, exception,methodName,configuration,spookObject);
                                    }
                                    throw o_O;
                                }
                            }
                        };

                    })(spookedObj,prop, method, config, this);
                }
            }
            return true;
        }
        return false;
    };

    // Current version of the utility.
    spk.VERSION = '0.1';

    // The default configuration
    var spookConfig = {
        /***
         * rethrow (boolean) Should methods be rethrowed when an error takes place.
         */
        rethrow : true,
        /***
         * addStackTrace (boolean) When an error is raised, should Spook try to include a stack trace on the exception object?
         */
        addStackTrace: false,

        /***
         * onError (function) A callback to be called by the Spook when an error occurs.
         * This is the main tool that SpookJS supplies the user to deal with his error handling.
         * The signature of the callback should have the following parameters:
         * exception (object) An exception object with metadata about the error.
         * methodName (String) The name of the function that raised the error
         * configuration (Object) The spook configuration for the object which raised the error. Unless a unique configuration was specified when the spook operation was attached to the object, this will be the Spook's default configuration.
         * Spook (Object) The actual Spook utility.
         * The context callback will be the actual object which raised the error, meaning thatthe keyword 'this' can be used to access it.
         */
        onError: null,

        /**
         * A boolean signifying whether an error should be rethrown after being caught by the Spook.
         * This allows the user to continue with regular error handling in addition to the spook's operation.
         * This means you can log error and still use them to end failed operations in your business logic.
         * Much like using an indetectable poison to murder a high ranking government official without anyone knowing
         * it wasn't simply an innocent heart attack.
         */
        rethrow:true,
        /***
         * onRethrow (function) A callback to be called by the Spook before rethrowing an error.
         * The signature of the callback should have the following parameters:
         * error (object) The actual Error object which was raised.
         * exception (object) An exception object with metadata about the error.
         * methodName (String) The name of the function that raised the error
         * configuration (Object) The spook configuration for the object which raised the error. Unless a unique configuration was specified when the spook operation was attached to the object, this will be the Spook's default configuration.
         * Spook (Object) The actual Spook utility.
         * The context callback will be the actual object which raised the error, meaning thatthe keyword 'this' can be used to access it.
         */
        onRethrow: null
    };


    /**
     * Get/Set the configuration for the Spook object
     * @param config (object,optional) A configuration object with any of the configuration properties
     * @example
     <code><pre>
        Spook.configuration({
            onError: function(exception,methodName,configuration,spookObject){
                console.log(exception.message);
            }
         });
     </pre></code>
     */
    spk.configuration = function(config){
        // If an object param is provided - replace the specific properties
        // it has set in the param with the equivalent property in the config
        if(config && config instanceof Object) {
            // check whether custom configurations have been specified, if so use them instead
            // of the defaults
            for (var key in config) {
                if (spookConfig.hasOwnProperty(key) && config.hasOwnProperty(key)) {
                    spookConfig[key] = config[key];
                }
            }
        }

        // return the configuration object
        return spookConfig;

    };

    // Save the previous value of the `Spook` variable.
    var conflictedSpook = window.Spook;

    /**
     * Revert the global window.Spook variable to it's original value and return this Spook object.
     * This allows users to include multiple versions of Spook objects on a single page or another global variable named "Spook".
     * @example
     <code><pre>
     Spook.noConflict();
     </pre></code>
     */
    Spook.noConflict = function () {
        window.Spook = conflictedSpook;
        return this;
    };

    /***
     * Internal functions
     */

    /***
     * Borrowed from Underscore++ ( https://github.com/gmmorris/underscorepp ) as I didn't want to make Spook dependant on Underscore++
     * ===========================
     * Merge objects in such a way that the preceding properties take precedence over the following properties.
     * This is similar to Underscore's extend method, but Underscore's extend method would give precedence to the following
     * properties, rather than the preceding ones.
     * @param obj (object) The object to extend
     * @param (objects) An unlimited number of parameters can be provided. Each parameter must be an object and it's properties
     *                  will be added to the first parameter (he object to be extended)
     * @returns {*}
     */
    var extendTopDown = function (obj) {
        /**
         * Cycle through the arguments from second to last and add their properties to
         * the first argument
         */
        for (var idx = 1; idx < arguments.length; idx++) {
            var objFrom = arguments[idx];
            if (typeof objFrom == 'object') {
                for (var prop in objFrom) {
                    if (objFrom.hasOwnProperty(prop) && !obj.hasOwnProperty(prop)) {
                        if(typeof objFrom[prop] == "function") {
                            // use a closure to call the function within the context of the object
                            // being extended
                            obj[prop] = (function(func,context){
                                return function(){
                                    return func.apply(context,arguments);
                                }
                            })(objFrom[prop],obj);
                        } else if(typeof objFrom[prop] == "object") {
                            // if this property is an object, then extend it using this method as well
                            obj[prop] = extendTopDown({},objFrom[prop]);
                        } else {
                            obj[prop] = objFrom[prop];
                        }
                    }
                }
            } else {
                throw new Error("Underscore++[extendTopDown method]: All parameters must be Objects, but parameter #" + (index+1) + " is of type " + typeof objFrom);
            }
        }
        return obj;
    }

    /**
     * Analyze an Error object and try and retrieve a Stack Trace from it.
     * This doesn't always work, as it is browser specific, but can add valuable
     * logging information for analysis and is recommended for important and critical operations
     * @param exp (object) The Error object.
     * @param propName (String) The stack property name (changes from browser to browser)
     */
    var retrieveStackTrace = function (exp,propName) {
        if (o_O.hasOwnProperty(propName)) {
            if (typeof o_O[propName] == 'string') {
                exp.stack.push(o_O[propName]);
            } else if (typeof o_O[propName] == 'function') {
                exp.stack.push(o_O[propName].call());
                if (typeof exp.stack[exp.stack.length - 1] != 'string') {
                    exp.stack.pop();
                }
            }
        }
    };
})(window,document);