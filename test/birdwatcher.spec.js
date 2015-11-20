import birdwatcher from '../lib/index';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Birdwatcher funciton', () => {
  it('should execute the original function as is', () => {
    function doThat(x,y){
      return x + y;
    }
    let watchedDoThat = birdwatcher(doThat);

    expect(watchedDoThat(3,6)).to.equal(doThat(3,6));
  });
  it('should execute the funciton on an object in the contect of the original object', () => {
    const myObject = {
      x: 5,
      doThat: function (y){
        return this.x + y;
      }
    };

    let myWatchedObject = birdwatcher(myObject);

    expect(myWatchedObject.doThat(6)).to.equal(myObject.doThat(6));
  });
});
