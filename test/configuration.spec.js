
var birdwatcher = require('../birdwatcher.js').birdwatcher, expect = require('chai').expect, sinon = require("sinon");

describe('Global configuration', function() {
  beforeEach(function() {
			// reset
			birdwatcher.configuration({
				rethrow: true,
				addStackTrace: false,
				onError: null,
				rethrow: true,
				onRethrow: null
			});
  });

  	it('should be able to birdwatcher object with only one function without interfering', function () {

			var mySpy = sinon.spy();

  		var oneTrickPony = {
  			trick: function(){
					// we can use the actual spy as the oneTrickPony's function because Birdwatcher
					// wraps functions and hence the spys get lost in the closure hierarchy
					mySpy();
				}
  		};

  		birdwatcher(oneTrickPony);

  		oneTrickPony.trick();

      expect(mySpy.should.have.been.calledOnce);
  	});

  	it('should be able to birdwatcher object with multiple functions without interfering', function () {

			var myTrickSpy = sinon.spy(), myTrickierSpy = sinon.spy();
  		var twoTrickPony = {
  			trick: function(){
          myTrickSpy();
        },
  			trickier: function(){
          myTrickierSpy();
        }
  		};
  		birdwatcher(twoTrickPony);

  		twoTrickPony.trick();
      expect(myTrickSpy.should.have.been.calledOnce);

  		twoTrickPony.trickier();
      expect(myTrickierSpy.should.have.been.calledOnce);

  	});

  	it('should be able to birdwatcher function which has its own function property if watchProperties is true', function () {

  		var onError = sinon.spy();

  		birdwatcher.configuration({
  			watchProperties : true,
  			onError: function(){ onError(); }
  		});

  		var noInitPony = function(){
  			throw new Error("No init for pony");
  		};

  		noInitPony.staticFunc = function(){
  			throw new Error("Oh my god");
  		};

  		noInitPony = birdwatcher(noInitPony);

  		expect(function () {
  			noInitPony.staticFunc();
  		}).to.throw(Error);

  		expect(function () {
  			var pony = new noInitPony();
  		}).to.throw(Error);

  		expect(onError.should.have.been.calledTwice);
  	});

  	it('should be able to birdwatcher function which has its own function property, with property functions when wrapping is set to false', function () {

  		var onError = sinon.spy();

  		birdwatcher.configuration({
  			watchProperties : false,
  			onError: function(){ onError(); }
  		});

  		var noInitPony = function(){
  			throw new Error("No init for pony");
  		};
  		noInitPony.staticFunc = function(){
  			throw new Error("Oh my god");
  		};

  		noInitPony = birdwatcher(noInitPony);

  		expect(function () {
  			noInitPony.staticFunc();
  		}).to.throw(Error);

  		expect(function () {
  			var pony = new noInitPony();
  		}).to.throw(Error);

  		expect(onError.should.have.been.calledOnce);
  	});

  	it('should be able to birdwatcher function which has its own function property, without wrapping property functions by default', function () {

      var onError = sinon.spy();

  		birdwatcher.configuration({
  			watchProperties : null,
  			onError: function(){ onError(); }
  		});

  		var noInitPony = function(){
  			throw new Error("No init for pony");
  		};
  		noInitPony.staticFunc = function(){
  			throw new Error("Oh my god");
  		};

  		noInitPony = birdwatcher(noInitPony);

  		expect(function () {
  			noInitPony.staticFunc();
  		}).to.throw(Error);

  		expect(function () {
  			var pony = new noInitPony();
  		}).to.throw(Error);

      expect(onError.should.have.been.calledOnce);

  	});

  	it('should call onError using global config and let error bubble up', function () {

      var onError = sinon.spy();

  		birdwatcher.configuration({
  			onError: function(){ onError(); }
  		});

  		var oneTrickPony = {
  			trick: function () {
  				throw new Error("OneTrickPony failed");
  			}
  		};
  		birdwatcher(oneTrickPony);

  		expect(function () {
  			oneTrickPony.trick();
  		}).to.throw(Error);

      expect(onError.should.have.been.calledOnce);
  	});

  	it('should call onError using global config for multiple methods and let error bubble up', function () {

      var onError = sinon.spy(), msg = "TwoTrickPony failed ";

  		birdwatcher.configuration({
  			onError:onError
  		});

  		var twoTrickPony = {
  			trick: function () {
  				throw new Error(msg + "1");
  			},
  			trickier: function () {
  				throw new Error(msg + "2");
  			}
  		};
  		birdwatcher(twoTrickPony);

  		expect(function () {
  			twoTrickPony.trick();
  		}).to.throw(Error);

  		expect(function () {
  			twoTrickPony.trickier();
  		}).to.throw(Error);

      expect(onError.should.have.been.calledTwice);
  	});

  	it('should call onError using global config for multiple methods and prevent error from bubbling up', function () {

      var onError = sinon.spy(), msg = "TwoTrickPony failed ";

  		birdwatcher.configuration({
  			rethrow: false,
  			onError: function(){ onError(); }
  		});

  		var twoTrickPony = {
  			trick: function () {
  				throw new Error(msg + "1");
  			},
  			trickier: function () {
  				throw new Error(msg + "2");
  			}
  		};
  		birdwatcher(twoTrickPony);

  		twoTrickPony.trick();
  		twoTrickPony.trickier();
      expect(onError.should.have.been.calledTwice);

  	});

  	it('should call onError using global config for multiple methods, call prerethrow callback and then let error from bubble up', function () {

  		var onError = sinon.spy(), onRethrow = sinon.spy(), msg = "TwoTrickPony failed ";

  		birdwatcher.configuration({
  			onRethrow: function(){ onRethrow(); },
  			onError: function(){ onError(); }
  		});

  		var twoTrickPony = {
  			trick: function () {
  				throw new Error(msg + "1");
  			},
  			trickier: function () {
  				throw new Error(msg + "2");
  			}
  		};
  		birdwatcher(twoTrickPony);

  		expect(function () {
  			twoTrickPony.trick();
  		}).to.throw(Error);

  		expect(function () {
  			twoTrickPony.trickier();
  		}).to.throw(Error);

      expect(onError.should.have.been.calledTwice);
      expect(onRethrow.should.have.been.calledTwice);
  	});

  	it('should call onError using global config for multiple objects', function () {
      var onError = sinon.spy();
  		birdwatcher.configuration({
  			onError: function(){ onError(); }
  		});

  		var twoTrickPony = {
  			trick: function () {
  				throw new Error();
  			},
  			trickier: function () {
  				throw new Error();
  			}
  		};
  		var oneTrickPony = {
  			trick: function () {
  				throw new Error();
  			}
  		};

  		birdwatcher(oneTrickPony);
  		birdwatcher(twoTrickPony);

  		expect(function () {
  			twoTrickPony.trick();
  		}).to.throw(Error);
  		expect(function () {
  			twoTrickPony.trickier();
  		}).to.throw(Error);
  		expect(function () {
  			oneTrickPony.trick();
  		}).to.throw(Error);

      expect(onError.should.have.been.calledThrice);
  	});
});
