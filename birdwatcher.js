/**
 * @name birdwatcher.js
 * @author Gidi Meir Morris, 2014
 * @version 0.1
 */
(function (window,document,undefined) {
    'use strict';

    // Save the previous value of the `birdwatcher` variable.
    var conflictedBirdwatcher = window.birdwatcher;

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
     * Based on the Exception handling anti-pattern by Nicholas C. Zakas (MIT Licensed)
     * @link http://www.nczonline.net/blog/2009/04/28/javascript-error-handling-anti-pattern/
     *
     * @param birdwatcheredObj (object) The object we wish to add error handling to.
     * @param config (object, optional) Spetial configurations to take into account for this particular object
     */
    brdwtch = window.birdwatcher = function(birdwatcheredObj,config){
        if (typeof birdwatcheredObj == 'object') {
            /**
             * Merge the specific configuration for this object with the global birdwatcher configuration
             * so that the birdwatcher handler function has a single config object to use
             */
            config = config || {};
            config = extendTopDown(config,birdwatcherConfig);

            // Cycle through the object's properties and find the methods (functions)
            for (var prop in birdwatcheredObj) {
                var method = birdwatcheredObj[prop];
                if (typeof method == "function") {
                    /**
                     * Create a cloure which will be called instead of the existing method on the birdwatchered object.
                     * Usually it will simply add a call for the method and return it's value, as usual.
                     * This is a completly covert operation... the object being birdwatchered doesn't even know
                     * it has a spy on its ass.
                     * This is the Jason Bourne of function (not to be confused with James Bond
                     * who goes around telling everyone who he is and what his favorite drink is.
                     * Worst. Spy. Ever.
                     */
                    birdwatcheredObj[prop] = (function (birdwatcheredObj,methodName, method, configuration, birdwatcherObject) {
                        return function () {
                            try {
                                return method.apply(this, arguments);
                            } catch (o_O) {

                                // Check if there is any operation we may actually have to execute, if not, move along
                                var noOp = !((configuration.rethrow && typeof configuration.onRethrow == 'function') || typeof configuration.onError == "function");
                                if(!noOp) {
                                    if(!(o_O instanceof Error) && configuration.errorize) {
                                        var message = "Error ["+methodName+":] ";
                                        if (typeof o_O == "object" && o_O.hasOwnProperty('message') && typeof o_O.message == 'string') {
                                            message += o_O.message;
                                        } else if (typeof o_O == "string") {
                                            message += o_O;
                                        }
                                        o_O = new BirdwatcherError(message,o_O,birdwatcheredObj,methodName);
                                    }                                    

                                    if(typeof configuration.onError == "function") {
                                        // call the onError callback in the context of the birdwatcheredObject
                                        configuration.onError.call(birdwatcheredObj, o_O,methodName,configuration,birdwatcherObject);
                                    }

                                    // Should we rethrow the error
                                    if (configuration.rethrow === true) {
                                        // if a callback has been specified before the error needs to be rethrown - call it
                                        if (typeof configuration.onRethrow == 'function') {
                                            configuration.onRethrow.call(birdwatcheredObj, o_O,methodName,configuration,birdwatcherObject);
                                        }
                                        throw o_O;
                                    }
                                }
                            }
                        };

                    })(birdwatcheredObj,prop, method, config, brdwtch);
                }
            }
            return true;
        }
        return false;
    };

    // Current version of the utility.
    brdwtch.VERSION = '0.2.0';

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
        rethrow:true,
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
        onRethrow: null
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
    brdwtch.configuration = function(config){
        // If an object param is provided - replace the specific properties
        // it has set in the param with the equivalent property in the config
        if(config && config instanceof Object) {
            // check whether custom configurations have been specified, if so use them instead
            // of the defaults
            for (var key in config) {
                if (birdwatcherConfig.hasOwnProperty(key) && config.hasOwnProperty(key)) {
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
    birdwatcher.noConflict = function () {
        window.birdwatcher = conflictedBirdwatcher;
        return this;
    };

    /***
     * Internal functions
     */

     var BirdwatcherError = function(message,originalError,srcObject,method){
        this.name = "BirdwatcherError";
        this.error = originalError;
        this.target = {
            src:srcObject,
            method:method
        };
     };
     BirdwatcherError.prototype = Error.prototype;

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
})(window,document);