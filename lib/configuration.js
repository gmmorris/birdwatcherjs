"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  /**
   * errorize (boolean) If a watched function throws a non Error should the originally thrown object be wrapped
   * by a custom Error object?
   */
  errorize: true,

  /**
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

  /**
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

  /**
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

  /**
   * watchDeep (boolean) Should Birdwatcher search for all the functions on an Birdwatched object or just the ones directly on the object instance?
   * This means, in JS terms, should we add a watcher only to function which return True for 'hasOwnProperty' or should we watch it's prototype's functions too?
   * By default we wrap the object's entire behaviour, so we tell it to ignore 'hasOwnProperty' and watch all properties in the prototype chain.
   * By setting this to False we can limit the depth to only this object's direct properties rather than go deeper into the prototype chain.
   */
  watchDeep: true,

  /**
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