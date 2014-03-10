/**
 * @name TEST birdwatcher.js
 * @author Gidi Morris (c) 2014
 * @version 0.0.1
 */


$(document).ready(function () {

    var shouldHaveBeenCalled = function(){
        // simply give an always true test to signify that this function has been called
        ok(true);
    };

    var shouldntHaveBeenCalled = function(){
        // simply give an always false test to signify that this function has been called
        // though it shouldn't have been
        ok(false);
    };


    module("Global configuration", {
        setup: function() {
            // reset
            birdwatcher.configuration({
                rethrow : true,
                addStackTrace: false,
                onError: null,
                rethrow:true,
                onRethrow: null
            });
        },
        teardown: function() {
        }
    });

    test('should be able to birdwatcher object with only one function without interfering', function () {

        var oneTrickPony = {
            trick : function(){
                // make sure the method is called as usual
                ok(true);
            }
        };

        birdwatcher(oneTrickPony);

        oneTrickPony.trick();

        expect(1);

    });

    test('should be able to birdwatcher object with multiple functions without interfering', function () {

        var twoTrickPony = {
            trick : function(){
                // make sure the method is called as usual
                ok(true);
            },
            trickier : function(){
                // make sure the method is called as usual
                ok(true);
            }
        };
        birdwatcher(twoTrickPony);

        twoTrickPony.trick();
        twoTrickPony.trickier();

        expect(2);
    });

    test('should call onError using global config and let error bubble up', function () {

        var msg = "OneTrickPony failed";

        birdwatcher.configuration({
            onError:function(){
                ok(true);
            }
        });

        var oneTrickPony = {
            trick : function(){
                throw new Error(msg);
            }
        };
        birdwatcher(oneTrickPony);

        throws(function(){
            oneTrickPony.trick();
        },msg);

        expect(2);
    });

    test('should call onError using global config for multiple methods and let error bubble up', function () {

        var msg = "TwoTrickPony failed ";

        birdwatcher.configuration({
            onError:function(){
                ok(true);
            }
        });

        var twoTrickPony = {
            trick : function(){
                throw new Error(msg + "1");
            },
            trickier : function(){
                throw new Error(msg + "2");
            }
        };
        birdwatcher(twoTrickPony);

        throws(function(){
            twoTrickPony.trick();
        },msg + "1");

        throws(function(){
            twoTrickPony.trickier();
        },msg + "2");

        expect(4);
    });

    test('should call onError using global config for multiple methods and prevent error from bubbling up', function () {

        var msg = "TwoTrickPony failed ";

        birdwatcher.configuration({
            rethrow:false,
            onError:function(){
                ok(true);
            }
        });

        var twoTrickPony = {
            trick : function(){
                throw new Error(msg + "1");
            },
            trickier : function(){
                throw new Error(msg + "2");
            }
        };
        birdwatcher(twoTrickPony);

        twoTrickPony.trick();
        twoTrickPony.trickier();

        expect(2);
    });

    test('should call onError using global config for multiple methods, call prerethrow callback and then let error from bubble up', function () {

        var msg = "TwoTrickPony failed ";

        birdwatcher.configuration({
            onRethrow:function(){
                ok(true);
            },
            onError:function(){
                ok(true);
            }
        });

        var twoTrickPony = {
            trick : function(){
                throw new Error(msg + "1");
            },
            trickier : function(){
                throw new Error(msg + "2");
            }
        };
        birdwatcher(twoTrickPony);

        throws(function(){
            twoTrickPony.trick();
        },msg + "1");

        throws(function(){
            twoTrickPony.trickier();
        },msg + "2");

        expect(6);
    });

    test('should call onError using global config for multiple objects', function () {

        birdwatcher.configuration({
            onError:function(){
                ok(true);
            }
        });

        var twoTrickPony = {
            trick : function(){
                throw new Error();
            },
            trickier : function(){
                throw new Error();
            }
        };
        var oneTrickPony = {
            trick : function(){
                throw new Error();
            }
        };

        birdwatcher(oneTrickPony);
        birdwatcher(twoTrickPony);

        throws(function(){
            twoTrickPony.trick();
        });

        throws(function(){
            twoTrickPony.trickier();
        });

        throws(function(){
            oneTrickPony.trick();
        });

        expect(6);
    });

    module("Object specific configuration");

    test('should be used for single object', function () {

        birdwatcher.configuration({
            onError:function(){
                ok(false);
            }
        });

        var oneTrickPony = {
            trick : function(){
                throw new Error();
            }
        };

        birdwatcher(oneTrickPony,{
            onError:function(){
                ok(true);
            }
        });

        throws(function(){
            oneTrickPony.trick();
        });

        expect(2);
    });

    test('should be used for single object but default for others', function () {

        birdwatcher.configuration({
            onError:function(exp,name,id, method){
                if(method == "shouldCall") {
                    ok(true);
                } else {
                    ok(false);
                }
            }
        });

        var oneTrickPony = {
            trick : function(){
                throw new Error();
            }
        };

        var secondOneTrickPony = {
            shouldCall : function(){
                throw new Error();
            }
        };

        birdwatcher(oneTrickPony,{
            onError:function(exp,name,id, method){
                if(method == "trick") {
                    ok(true);
                } else {
                    ok(false);
                }
            }
        });

        birdwatcher(secondOneTrickPony);

        throws(function(){
            oneTrickPony.trick();
        });
        throws(function(){
            secondOneTrickPony.shouldCall();
        });

        expect(4);
    });

    test('should bubble errors for all object except the specific one', function () {

        birdwatcher.configuration({
            onRethrow:function(exp,name,id, method){
                ok(true);
            },
            onError:function(exp,name,id, method){
                ok(true);
            }
        });

        var oneTrickPony = {
            trick : function(){
                throw new Error();
            }
        };

        var secondOneTrickPony = {
            shouldCall : function(){
                throw new Error();
            }
        };

        birdwatcher(oneTrickPony,{
            rethrow:false
        });

        birdwatcher(secondOneTrickPony);

        oneTrickPony.trick();
        throws(function(){
            secondOneTrickPony.shouldCall();
        });

        expect(4);
    });

    test('should wrap thrown objects in a custom Error object when configured to errorize', function () {

        birdwatcher.configuration({
            errorize:true,
            rethrow:true,
            onRethrow:false,
            onError:function(exp,name,id, method){
                if(method == "donterrorize") {
                    ok(exp instanceof Error);
                } else if(method == "errorize") {
                    ok(exp instanceof birdwatcher.Error);
                    ok(typeof exp.error == "object");
                    ok(exp.error.isError);
                }
            }
        });

        var oneTrickPony = {
            donterrorize : function(){
                throw new Error();
            }
        };

        var secondOneTrickPony = {
            errorize : function(){
                throw { isError:true };
            }
        };

        birdwatcher(oneTrickPony);        
        birdwatcher(secondOneTrickPony);

        throws(function(){
            oneTrickPony.donterrorize();
        });

        throws(function(){
            secondOneTrickPony.errorize();
        });

        expect(6);
    });

    test('should not wrap thrown objects in a custom Error object when configured not to errorize', function () {

        birdwatcher.configuration({
            errorize:false,
            rethrow:true,
            onRethrow:false,
            onError:function(exp,name,id, method){
                if(method == "originalerror") {
                    ok(exp instanceof Error);
                } else if(method == "donterrorize") {
                    ok(typeof exp == "object");
                    ok(exp.isError);
                }
            }
        });

        var oneTrickPony = {
            originalerror : function(){
                throw new Error();
            }
        };

        var secondOneTrickPony = {
            donterrorize : function(){
                throw { isError:true };
            }
        };

        birdwatcher(oneTrickPony);        
        birdwatcher(secondOneTrickPony);

        throws(function(){
            oneTrickPony.originalerror();
        });

        throws(function(){
            secondOneTrickPony.donterrorize();
        });

        expect(5);
    });

    test('should be work on a function variable', function () {

        birdwatcher.configuration({
            onError:function(){
                ok(true); // should run twice
            }
        });

        var oneTrickPony = {
            trick : function(){
                throw new Error();
            }
        };
		var secondTrickPony = function(){
            throw new Error();			
		};

        oneTrickPony.trick = birdwatcher(oneTrickPony.trick);
        secondTrickPony = birdwatcher(secondTrickPony);

        throws(function(){
            oneTrickPony.trick();
        });

        throws(function(){
            secondTrickPony();
        });
		
        expect(4);
    });
})