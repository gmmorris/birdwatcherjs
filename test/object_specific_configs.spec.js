import {birdwatcher, configure, isBirdwatcherError} from '../lib/index';
import {expect} from 'chai';
import sinon from 'sinon';
import assert from 'simple-assert';

describe('Object specific configuration', () => {
  it('should be able to birdwatcher object with only one function without interfering', () => {
    const mySpy = sinon.spy();
    const oneTrickPony = {
      trick: () => {
        // we can use the actual spy as the oneTrickPony's function because Birdwatcher
        // wraps functions and hence the spys get lost in the closure hierarchy
        mySpy();
      }
    };

    birdwatcher(oneTrickPony);

    oneTrickPony.trick();

    expect(mySpy.should.have.been.calledOnce);
  });

  it('should be used for single object', () => {
    const failedSpy = sinon.spy();
    const mySpy = sinon.spy();

    const myBirdwatcher = configure({
      onError: () => {
        failedSpy();
      }
    });

    const oneTrickPony = {
      trick: () => {
        throw new Error();
      }
    };

    myBirdwatcher(oneTrickPony, {
      onError: () => {
        mySpy();
      }
    });

    expect(() => {
      oneTrickPony.trick();
    }).to.throw(Error);

    expect(mySpy.should.have.been.calledOnce);
    expect(failedSpy.should.not.have.been.calledOnce);
  });

  it('should be used for single object but default for others', () => {
    const failedSpy = sinon.spy();
    const mySpy = sinon.spy();
    const mySpecificSpy = sinon.spy();

    const myBirdwatcher = configure({
      onError: (exp, name, method) => {
        if (method === 'shouldCall') {
          mySpy();
        } else {
          failedSpy();
        }
      }
    });

    const oneTrickPony = {
      trick: () => {
        throw new Error();
      }
    };

    const secondOneTrickPony = {
      shouldCall: () => {
        throw new Error();
      }
    };

    myBirdwatcher(oneTrickPony, {
      onError: (exp, name, method) => {
        if (method === 'trick') {
          mySpecificSpy();
        } else {
          failedSpy();
        }
      }
    });

    myBirdwatcher(secondOneTrickPony);

    expect(() => {
      oneTrickPony.trick();
    }).to.throw(Error);

    expect(() => {
      secondOneTrickPony.shouldCall();
    }).to.throw(Error);

    expect(mySpecificSpy.should.have.been.calledOnce);
    expect(mySpy.should.have.been.calledOnce);
    expect(failedSpy.should.not.have.been.called);
  });

  it('should bubble errors for all object except the specific one', () => {
    const onRethrow = sinon.spy();
    const onError = sinon.spy();

    const myBirdwatcher = configure({
      onRethrow: () => {
        onRethrow();
      },
      onError: () => {
        onError();
      }
    });

    const oneTrickPony = {
      trick: () => {
        throw new Error();
      }
    };

    const secondOneTrickPony = {
      shouldCall: () => {
        throw new Error();
      }
    };

    myBirdwatcher(oneTrickPony, {
      rethrow: false
    });

    myBirdwatcher(secondOneTrickPony);

    oneTrickPony.trick();

    expect(() => {
      secondOneTrickPony.shouldCall();
    }).to.throw(Error);

    expect(onRethrow.should.have.been.calledOnce);
    expect(onError.should.have.been.calledTwice);
  });

  it('should wrap thrown objects in a custom Error object when configured to errorize', () => {
    const onError = sinon.spy();

    const myBirdwatcher = configure({
      errorize: true,
      rethrow: true,
      onRethrow: false,
      onError: (exp, name, method) => {
        if (method === 'donterrorize') {
          assert(exp instanceof Error);
        } else if (method === 'errorize') {
          assert(isBirdwatcherError(exp));
          assert(exp instanceof Error);
          assert(typeof exp.error === 'object');
          assert(exp.error.isError);
        } else {
          // shouldn't happen - if it happens fail the test
          assert(false);
        }
        onError();
      }
    });

    const oneTrickPony = {
      donterrorize: () => {
        throw new Error();
      }
    };

    const secondOneTrickPony = {
      errorize: () => {
        throw {
          isError: true
        };
      }
    };

    myBirdwatcher(oneTrickPony);
    myBirdwatcher(secondOneTrickPony);

    expect(() => {
      oneTrickPony.donterrorize();
    }).to.throw(Error);

    expect(() => {
      secondOneTrickPony.errorize();
    }).to.throw(Error);

    expect(onError.should.have.been.calledTwice);
  });

  it('should not wrap thrown objects in a custom Error object when configured not to errorize', () => {
    const onError = sinon.spy();

    const myBirdwatcher = configure({
      errorize: false,
      rethrow: true,
      onRethrow: false,
      onError: (exp, name, method) => {
        if (method === 'originalerror') {
          assert(exp instanceof Error);
        } else if (method === 'donterrorize') {
          assert(typeof exp === 'object');
          assert(exp.isError);
        }
        onError();
      }
    });

    const oneTrickPony = {
      originalerror: () => {
        throw new Error();
      }
    };

    const CustomError = {
      isError: true
    };
    const secondOneTrickPony = {
      donterrorize: () => {
        throw CustomError;
      }
    };

    myBirdwatcher(oneTrickPony);
    myBirdwatcher(secondOneTrickPony);

    expect(() => {
      oneTrickPony.originalerror();
    }).to.throw(Error);

    expect(() => {
      secondOneTrickPony.donterrorize();
    }).to.throw(CustomError);

    expect(onError.should.have.been.calledTwice);
  });

  it('should be work on a function constiable', () => {
    const onError = sinon.spy();
    const myBirdwatcher = configure({
      onError: () => {
        onError();
      }
    });

    const oneTrickPony = {
      trick: () => {
        throw new Error();
      }
    };
    let secondTrickPony = () => {
      throw new Error();
    };

    oneTrickPony.trick = myBirdwatcher(oneTrickPony.trick);
    secondTrickPony = myBirdwatcher(secondTrickPony);

    expect(() => {
      oneTrickPony.trick();
    }).to.throw(Error);
    expect(() => {
      secondTrickPony();
    }).to.throw(Error);

    expect(onError.should.have.been.calledTwice);
  });
});
