import pick from '../../lib/tools/pick';
import {expect} from 'chai';

describe('pick', () => {
  it('returns an empty object if no source is specified', () => {
    expect(pick()).to.be.empty;
  });
  it('returns an empty object if a non object s specified as source', () => {
    expect(pick(null)).to.be.empty;
    expect(pick(undefined)).to.be.empty;
    expect(pick('')).to.be.empty;
    expect(pick(213)).to.be.empty;
    expect(pick(true)).to.be.empty;
  });
  it('returns an empty object if no keys are specified', () => {
    expect(pick({ key: true })).to.be.empty;
  });
  it('returns an empty object if no keys are pesent on source', () => {
    expect(pick({ key: true }, 'notAKey')).to.be.empty;
  });
  it('returns an object with the specified single key', () => {
    expect(pick({ key: true }, 'key')).to.include.keys('key');
    expect(Object.keys(pick({ key: true }, 'key')).length).to.equal(1);
    expect(pick({ key: true }, 'key').key).to.equal(true);
  });
  it('returns an object with the specified keys', () => {
    expect(pick({ key: true, secondKey: 123 }, 'key', 'secondKey')).to.include.keys('key');
    expect(pick({ key: true, secondKey: 123 }, 'key', 'secondKey')).to.include.keys('secondKey');
    expect(Object.keys(pick({ key: true, secondKey: 123 }, 'key', 'secondKey')).length).to.equal(2);
    expect(pick({ key: true, secondKey: 123 }, 'key', 'secondKey').key).to.equal(true);
    expect(pick({ key: true, secondKey: 123 }, 'key', 'secondKey').secondKey).to.equal(123);
  });
  it('returns an object with the specified keys even if additional keys appear', () => {
    expect(pick({ key: true, thirdKey: 'nope', secondKey: 123 }, 'key', 'secondKey')).to.include.keys('key');
    expect(pick({ key: true, thirdKey: 'nope', secondKey: 123 }, 'key', 'secondKey')).to.include.keys('secondKey');
    expect(Object.keys(pick({ key: true, thirdKey: 'nope', secondKey: 123 }, 'key', 'secondKey')).length).to.equal(2);
    expect(pick({ key: true, secondKey: 123 }, 'key', 'secondKey').key).to.equal(true);
    expect(pick({ key: true, thirdKey: 'nope', secondKey: 123 }, 'key', 'secondKey').secondKey).to.equal(123);
  });
});
