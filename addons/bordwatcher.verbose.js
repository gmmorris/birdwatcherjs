/**
 * Created by gidi on 03/03/2015.
 */
/**
 * @name birdwatcher.verbose.js
 * @author Gidi Meir Morris, 2015
 * @version 0.0.1
 *
 * Birdwatcher Tracing add-on
 *
 */
(function (window, birdwatcher, document, undefined) {
	'use strict';

	if(!birdwatcher || typeof birdwatcher !== 'function'){
		throw new Error("Birdwatcher.Verbose: The Birdwatcher library cannot be located.");
	}

	/**
	 * The top-level namespace
	 * @namespace birdwatcherJS.Verbose . A demo Birdwatcher AddOn to make its operation verbose
	 */
	var brdwtchvrb = {
		// unique ID used by Birdwatcher to ID this AddOn
		Name : "Verbose",
		// the Init function called by Birdwatcher when installing an AddOn
		init: function(birdwatcherObject){
			print("Installing Verbose plugin in the Birdwatcher Object:");
			print(birdwatcherObject);
			// in theory we could create a new object to do whatever we want in this addOn's context, but for this basic addOn there is no need
			return this;
		},
		on : {
			configureClosure : function(configuration, birdwatcheredObj){
				print("Birdwatcher is configuring a closure with the following config:");
				print(configuration);
				if(birdwatcheredObj){
					print("And it is applying it to this object:");
					print(birdwatcheredObj);
				} else {
					print("And it is applying it to an unknown object, so presumably this is an anonymous function:");
				}
				// return config unchanged, no need to do anything to it, we're just verbosing stuff
				return configuration;
			},
			errorClosure : function(method, methodName, configuration){
				print("Birdwatcher is creating an error handling closure for a method called:" + methodName);
				// return config unchanged, no need to do anything to it, we're just verbosing stuff
				return method;
			},
			errorized : function(err, configuration){
				print("Birdwatcher has caught the following error:");
				print(err);
				// return config unchanged, no need to do anything to it, we're just verbosing stuff
				return err;
			}
		}
	};

	// The actual Verbose action :)
	var print = function(message){
		console.log(message);
	};

	// install addon
	birdwatcher.addOn(brdwtchvrb);

})(window,
	// we check if birdwatcher appears on the current context, if not try the window
	(this && this.birdwatcher?this.birdwatcher : window.birdwatcher),
	document);