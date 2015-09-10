
var birdwatcher = require('../birdwatcher.js').birdwatcher, expect = require('chai').expect, assert = require('simple-assert'), sinon = require("sinon");

describe('Object specific configuration', function() {
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

	it('should be used for single object', function () {

		var failedSpy = sinon.spy(), mySpy = sinon.spy();

		birdwatcher.configuration({
			onError: function () {
				failedSpy();
			}
		});

		var oneTrickPony = {
			trick: function () {
				throw new Error();
			}
		};

		birdwatcher(oneTrickPony, {
			onError: function () {
				mySpy();
			}
		});

		expect(function () {
			oneTrickPony.trick();
		}).to.throw(Error);

    expect(mySpy.should.have.been.calledOnce);
    expect(failedSpy.should.not.have.been.calledOnce);
	});

	it('should be used for single object but default for others', function () {

		var failedSpy = sinon.spy(), mySpy = sinon.spy(), mySpecificSpy = sinon.spy();

		birdwatcher.configuration({
			onError: function (exp, name, id, method) {
				if (method == "shouldCall") {
					mySpy();
				} else {
					failedSpy();
				}
			}
		});

		var oneTrickPony = {
			trick: function () {
				throw new Error();
			}
		};

		var secondOneTrickPony = {
			shouldCall: function () {
				throw new Error();
			}
		};

		birdwatcher(oneTrickPony, {
			onError: function (exp, name, id, method) {
				if (method == "trick") {
					mySpecificSpy();
				} else {
					failedSpy();
				}
			}
		});

		birdwatcher(secondOneTrickPony);

		expect(function () {
			oneTrickPony.trick();
		}).to.throw(Error);

		expect(function () {
			secondOneTrickPony.shouldCall();
		}).to.throw(Error);

    expect(mySpecificSpy.should.have.been.calledOnce);
    expect(mySpy.should.have.been.calledOnce);
    expect(failedSpy.should.not.have.been.called);
	});

	it('should bubble errors for all object except the specific one', function () {

		var onRethrow = sinon.spy(), onError = sinon.spy();

		birdwatcher.configuration({
			onRethrow: function (exp, name, id, method) {
				onRethrow();
			},
			onError: function (exp, name, id, method) {
				onError();
			}
		});

		var oneTrickPony = {
			trick: function () {
				throw new Error();
			}
		};

		var secondOneTrickPony = {
			shouldCall: function () {
				throw new Error();
			}
		};

		birdwatcher(oneTrickPony, {
			rethrow: false
		});

		birdwatcher(secondOneTrickPony);

		oneTrickPony.trick();

		expect(function () {
			secondOneTrickPony.shouldCall();
		}).to.throw(Error);

    expect(onRethrow.should.have.been.calledOnce);
    expect(onError.should.have.been.calledTwice);
	});

	it('should wrap thrown objects in a custom Error object when configured to errorize', function () {

		var onError = sinon.spy();

		birdwatcher.configuration({
			errorize: true,
			rethrow: true,
			onRethrow: false,
			onError: function (exp, name, id, method) {
				if (method == "donterrorize") {
					assert(exp instanceof Error);
				} else if (method == "errorize") {
					assert(exp instanceof birdwatcher.Error);
					assert(typeof exp.error == "object");
					assert(exp.error.isError);
				} else {
          // shouldn't happen - if it happens fail the test
          assert(false);
        }
        onError();
			}
		});

		var oneTrickPony = {
			donterrorize: function () {
				throw new Error();
			}
		};

		var secondOneTrickPony = {
			errorize: function () {
				throw { isError: true };
			}
		};

		birdwatcher(oneTrickPony);
		birdwatcher(secondOneTrickPony);

		expect(function () {
			oneTrickPony.donterrorize();
		}).to.throw(Error);

		expect(function () {
			secondOneTrickPony.errorize();
		}).to.throw(Error);

    expect(onError.should.have.been.calledTwice);
	});

	it('should not wrap thrown objects in a custom Error object when configured not to errorize', function () {

		var onError = sinon.spy();

		birdwatcher.configuration({
			errorize: false,
			rethrow: true,
			onRethrow: false,
			onError: function (exp, name, id, method) {
				if (method == "originalerror") {
					assert(exp instanceof Error);
				} else if (method == "donterrorize") {
					assert(typeof exp == "object");
					assert(exp.isError);
				}
        onError();
			}
		});

		var oneTrickPony = {
			originalerror: function () {
				throw new Error();
			}
		};

		var CustomError = { isError: true },
      secondOneTrickPony = {
			donterrorize: function () {
				throw CustomError;
			}
		};

		birdwatcher(oneTrickPony);
		birdwatcher(secondOneTrickPony);

		expect(function () {
			oneTrickPony.originalerror();
		}).to.throw(Error);

		expect(function () {
			secondOneTrickPony.donterrorize();
		}).to.throw(CustomError);

    expect(onError.should.have.been.calledTwice);
	});

	it('should be work on a function variable', function () {

		var onError = sinon.spy();

		birdwatcher.configuration({
			onError: function () {
				onError();
			}
		});

		var oneTrickPony = {
			trick: function () {
				throw new Error();
			}
		};
		var secondTrickPony = function () {
			throw new Error();
		};

		oneTrickPony.trick = birdwatcher(oneTrickPony.trick);
		secondTrickPony = birdwatcher(secondTrickPony);

    expect(function () {
    		oneTrickPony.trick();
    }).to.throw(Error);
    expect(function () {
    		secondTrickPony();
    }).to.throw(Error);

    expect(onError.should.have.been.calledTwice);
	});
});
