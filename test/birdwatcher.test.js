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

        raises(function(){
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

        raises(function(){
            twoTrickPony.trick();
        },msg + "1");

        raises(function(){
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

        raises(function(){
            twoTrickPony.trick();
        },msg + "1");

        raises(function(){
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

        raises(function(){
            twoTrickPony.trick();
        });

        raises(function(){
            twoTrickPony.trickier();
        });

        raises(function(){
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

        raises(function(){
            oneTrickPony.trick();
        });

        expect(2);
    });

    test('should be used for single object but default for others', function () {

        birdwatcher.configuration({
            onError:function(exp,method){
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
            onError:function(exp,method){
                if(method == "trick") {
                    ok(true);
                } else {
                    ok(false);
                }
            }
        });

        birdwatcher(secondOneTrickPony);

        raises(function(){
            oneTrickPony.trick();
        });
        raises(function(){
            secondOneTrickPony.shouldCall();
        });

        expect(4);
    });

    test('should bubble errors for all object except the specific one', function () {

        birdwatcher.configuration({
            onRethrow:function(exp,method){
                ok(true);
            },
            onError:function(exp,method){
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
        raises(function(){
            secondOneTrickPony.shouldCall();
        });

        expect(4);
    });
})