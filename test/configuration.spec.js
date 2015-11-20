import birdwatcher, { configure } from '../lib/index';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Global configuration', () => {
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

  it('should be able to birdwatcher object with multiple functions without interfering', () => {
    const myTrickSpy = sinon.spy();
    const myTrickierSpy = sinon.spy();
    const twoTrickPony = {
      trick: () => {
        myTrickSpy();
      },
      trickier: () => {
        myTrickierSpy();
      }
    };

    birdwatcher(twoTrickPony);

    twoTrickPony.trick();
    expect(myTrickSpy.should.have.been.calledOnce);

    twoTrickPony.trickier();
    expect(myTrickierSpy.should.have.been.calledOnce);
  });

  it('should be able to set a default name for components', () => {
    const onError = sinon.spy();
    const myBirdwatcher = configure('My.Default.Name', {
      watchProperties: true,
      onError: (err, name, config) => {
        expect(name).to.equal('My.Default.Name');
        onError();
      }
    });

    let noInitPony = function() {
      throw new Error('No init for pony');
    };

    noInitPony = myBirdwatcher(noInitPony);

    expect(() => {
      const pony = new noInitPony();
    }).to.throw(Error);

    expect(onError.should.have.been.calledOnce);
  });

  it('should be able to birdwatcher function which has its own function property if watchProperties is true', () => {
    const onError = sinon.spy();
    const myBirdwatcher = configure({
      watchProperties: true,
      onError: () => {
        onError();
      }
    });

    let noInitPony = function() {
      throw new Error('No init for pony');
    };

    noInitPony.staticFunc = () => {
      throw new Error('Oh my god');
    };

    noInitPony = myBirdwatcher(noInitPony);

    expect(() => {
      noInitPony.staticFunc();
    }).to.throw(Error);

    expect(() => {
      const pony = new noInitPony();
    }).to.throw(Error);

    expect(onError.should.have.been.calledTwice);
  });

  it('should be able to birdwatcher function which has its own function property, with property functions when wrapping is set to false', () => {
    const onError = sinon.spy();
    const myBirdwatcher = configure({
      watchProperties: false,
      onError: () => {
        onError();
      }
    });

    let noInitPony = () => {
      throw new Error('No init for pony');
    };
    noInitPony.staticFunc = () => {
      throw new Error('Oh my god');
    };

    noInitPony = myBirdwatcher(noInitPony);

    expect(() => {
      noInitPony.staticFunc();
    }).to.throw(Error);

    expect(() => {
      const pony = new noInitPony();
    }).to.throw(Error);

    expect(onError.should.have.been.calledOnce);
  });

  it('should be able to birdwatcher function which has its own function property, without wrapping property functions by default', () => {
    const onError = sinon.spy();
    const myBirdwatcher = configure({
      watchProperties: null,
      onError: () => {
        onError();
      }
    });

    let noInitPony = () => {
      throw new Error('No init for pony');
    };
    noInitPony.staticFunc = () => {
      throw new Error('Oh my god');
    };

    noInitPony = myBirdwatcher(noInitPony);

    expect(() => {
      noInitPony.staticFunc();
    }).to.throw(Error);

    expect(() => {
      const pony = new noInitPony();
    }).to.throw(Error);

    expect(onError.should.have.been.calledOnce);
  });

  it('should call onError using global config and let error bubble up', () => {
    const onError = sinon.spy();
    const myBirdwatcher = configure({
      onError: () => {
        onError();
      }
    });

    var oneTrickPony = {
      trick: () => {
        throw new Error('OneTrickPony failed');
      }
    };

    myBirdwatcher(oneTrickPony);

    expect(() => {
      oneTrickPony.trick();
    }).to.throw(Error);

    expect(onError.should.have.been.calledOnce);
  });

  it('should call onError using global config for multiple methods and let error bubble up', () => {
    const onError = sinon.spy();
    const msg = 'TwoTrickPony failed';

    const myBirdwatcher = configure({
      onError: onError
    });

    const twoTrickPony = {
      trick: () => {
        throw new Error(`${msg} 1`);
      },
      trickier: () => {
        throw new Error(`${msg} 2`);
      }
    };

    myBirdwatcher(twoTrickPony);

    expect(() => {
      twoTrickPony.trick();
    }).to.throw(Error);

    expect(() => {
      twoTrickPony.trickier();
    }).to.throw(Error);

    expect(onError.should.have.been.calledTwice);
  });

  it('should call onError using global config for multiple methods and prevent error from bubbling up', () => {
    const onError = sinon.spy();
    const msg = 'TwoTrickPony failed';

    const myBirdwatcher = configure({
      rethrow: false,
      onError: () => {
        onError();
      }
    });

    var twoTrickPony = {
      trick: () => {
        throw new Error(`${msg} 1`);
      },
      trickier: () => {
        throw new Error(`${msg} 2`);
      }
    };
    myBirdwatcher(twoTrickPony);

    twoTrickPony.trick();
    twoTrickPony.trickier();
    expect(onError.should.have.been.calledTwice);
  });

  it('should call onError using global config for multiple methods, call prerethrow callback and then let error from bubble up', () => {
    const onError = sinon.spy();
    const onRethrow = sinon.spy();
    const msg = 'TwoTrickPony failed';

    const myBirdwatcher = configure({
      onRethrow: () => {
        onRethrow();
      },
      onError: () => {
        onError();
      }
    });

    var twoTrickPony = {
      trick: () => {
        throw new Error(`${msg} 1`);
      },
      trickier: () => {
        throw new Error(`${msg} 2`);
      }
    };
    myBirdwatcher(twoTrickPony);

    expect(() => {
      twoTrickPony.trick();
    }).to.throw(Error);

    expect(() => {
      twoTrickPony.trickier();
    }).to.throw(Error);

    expect(onError.should.have.been.calledTwice);
    expect(onRethrow.should.have.been.calledTwice);
  });

  it('should call onError using global config for multiple objects', () => {
    const onError = sinon.spy();
    const myBirdwatcher = configure({
      onError: () => {
        onError();
      }
    });

    var twoTrickPony = {
      trick: () => {
        throw new Error();
      },
      trickier: () => {
        throw new Error();
      }
    };
    var oneTrickPony = {
      trick: () => {
        throw new Error();
      }
    };

    myBirdwatcher(oneTrickPony);
    myBirdwatcher(twoTrickPony);

    expect(() => {
      twoTrickPony.trick();
    }).to.throw(Error);

    expect(() => {
      twoTrickPony.trickier();
    }).to.throw(Error);

    expect(() => {
      oneTrickPony.trick();
    }).to.throw(Error);

    expect(onError.should.have.been.calledThrice);
  });
});
