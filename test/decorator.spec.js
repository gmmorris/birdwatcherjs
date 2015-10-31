import {configure, birdwatch} from '../src/index';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Birdwatcher decorator', () => {
  it('allows birdwatchign to be attached to all class methods using a decorator', () => {
    const onError = sinon.spy();
    const msg = 'TwoTrickPony failed';

    @birdwatch({
      onError: onError
    })
    class TwoTrickPony {
      trick() {
        throw new Error(`${msg} 1`);
      }
      trickier() {
        throw new Error(`${msg} 2`);
      }
    }

    const myTwoTrickPony = new TwoTrickPony();

    expect(() => {
      myTwoTrickPony.trick();
    }).to.throw(Error);

    expect(() => {
      myTwoTrickPony.trickier();
    }).to.throw(Error);

    expect(onError.should.have.been.calledTwice);
  });

  it('allows a custom handler to be defind and used as a decorator', () => {
    const onError = sinon.spy();
    const msg = 'TwoTrickPony failed';
    const methodNames = ['trick', 'trickier'];
    const errorHandler = configure({
      onError: (err, name, methodName) => {
        expect(name).to.equal('twoTrick');
        expect(methodName).to.equal(methodNames.shift());
        onError();
      }
    });

    @birdwatch(errorHandler, 'twoTrick')
    class TwoTrickPony {
      trick() {
        throw new Error(`${msg} 1`);
      }
      trickier() {
        throw new Error(`${msg} 2`);
      }
    }

    const myTwoTrickPony = new TwoTrickPony();

    expect(() => {
      myTwoTrickPony.trick();
    }).to.throw(Error);

    expect(() => {
      myTwoTrickPony.trickier();
    }).to.throw(Error);

    expect(onError.should.have.been.calledTwice);
  });
});
