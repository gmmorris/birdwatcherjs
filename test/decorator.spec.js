import {configure} from '../src/birdwatcher';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Birdwatcher decorator', () => {
  it('allows birdwatchign to be attached to all class methods using a decorator', () => {
    const onError = sinon.spy();
    const msg = 'TwoTrickPony failed';

    class twoTrickPony {
      @configure({
        onError: onError
      })
      trick() {
        throw new Error(`${msg} 1`);
      }
      @configure({
        onError: onError
      })
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

    const errorHandler = configure({
      onError: function(component, err, name){
        expect(name).to.equal('twoTrick');
        onError();
      }
    });

    class TwoTrickPony {
      @errorHandler('twoTrick')
      trick() {
        throw new Error(`${msg} 1`);
      }
      @errorHandler('twoTrick')
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
