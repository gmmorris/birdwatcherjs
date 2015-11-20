import {isWatchablePropertyOfComponent, isWatchablePropertyOfConstructor} from '../../lib/tools/isWatchableProperty';
import {expect} from 'chai';
import assert from 'simple-assert';

describe('isWatchablePropertyOfComponent', () => {
  describe('on an object', () => {
    it('returns true for a writable and configurable property', () => {
      const component = {};
      Object.defineProperty(component, 'myWritableConfigurableProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: () => {}
      });

      assert(isWatchablePropertyOfComponent(component, 'myWritableConfigurableProp'));
    });
    it('returns false for a non function property', () => {
      const component = {};
      Object.defineProperty(component, 'myStringProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: ''
      });
      Object.defineProperty(component, 'myNumericProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: 1
      });
      Object.defineProperty(component, 'myNullProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: null
      });
      Object.defineProperty(component, 'myObjectProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: {}
      });
      Object.defineProperty(component, 'myArrProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: []
      });

      assert(!isWatchablePropertyOfComponent(component, 'myStringProp'));
      assert(!isWatchablePropertyOfComponent(component, 'myNumericProp'));
      assert(!isWatchablePropertyOfComponent(component, 'myNullProp'));
      assert(!isWatchablePropertyOfComponent(component, 'myObjectProp'));
      assert(!isWatchablePropertyOfComponent(component, 'myArrProp'));
    });
    it('returns false for a non writable property', () => {
      const component = {};
      Object.defineProperty(component, 'myInvalidProp', {
        enumerable: false,
        configurable: true,
        writable: false,
        value: () => {}
      });

      assert(!isWatchablePropertyOfComponent(component, 'myInvalidProp'));
    });
    it('returns false for a non configurable property', () => {
      const component = {};
      Object.defineProperty(component, 'myInvalidProp', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: () => {}
      });

      assert(!isWatchablePropertyOfComponent(component, 'myInvalidProp'));
    });
    it('returns false if either consturctor or method are omitted', () => {
      assert(!isWatchablePropertyOfComponent(null, 'myProp'));
    });
    it('returns false if the method is a property on a parent prototype of the constructor', () => {
      assert(!isWatchablePropertyOfComponent({}));
    });
  });
  describe('on a function', () => {
    it('returns true for a writable and configurable property', () => {
      const component = () => {};
      Object.defineProperty(component, 'myWritableConfigurableProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: () => {}
      });

      assert(isWatchablePropertyOfComponent(component, 'myWritableConfigurableProp'));
    });
    it('returns false for a non function property', () => {
      const component = () => {};
      Object.defineProperty(component, 'myStringProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: ''
      });
      Object.defineProperty(component, 'myNumericProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: 1
      });
      Object.defineProperty(component, 'myNullProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: null
      });
      Object.defineProperty(component, 'myObjectProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: {}
      });
      Object.defineProperty(component, 'myArrProp', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: []
      });

      assert(!isWatchablePropertyOfComponent(component, 'myStringProp'));
      assert(!isWatchablePropertyOfComponent(component, 'myNumericProp'));
      assert(!isWatchablePropertyOfComponent(component, 'myNullProp'));
      assert(!isWatchablePropertyOfComponent(component, 'myObjectProp'));
      assert(!isWatchablePropertyOfComponent(component, 'myArrProp'));
    });
    it('returns false for a non writable property', () => {
      const component = () => {};
      Object.defineProperty(component, 'myInvalidProp', {
        enumerable: false,
        configurable: true,
        writable: false,
        value: () => {}
      });

      assert(!isWatchablePropertyOfComponent(component, 'myInvalidProp'));
    });
    it('returns false for a non configurable property', () => {
      const component = () => {};
      Object.defineProperty(component, 'myInvalidProp', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: () => {}
      });

      assert(!isWatchablePropertyOfComponent(component, 'myInvalidProp'));
    });
  });
});

describe('isWatchablePropertyOfConstructor', () => {
  it('returns true for a writable and configurable property', () => {
    class Component {
      doWhatever() {}
    }
    assert(isWatchablePropertyOfConstructor(Component, 'doWhatever'));
  });
  it('returns false for a non writable property', () => {
    class Component {
      constructor() {}
    }
    Object.defineProperty(Component.prototype, 'myInvalidProp', {
      enumerable: false,
      configurable: true,
      writable: false,
      value: () => {}
    });

    assert(!isWatchablePropertyOfComponent(Component, 'myInvalidProp'));
  });
  it('returns false for a non configurable property', () => {
    class Component {
      constructor() {}
    }
    Object.defineProperty(Component.prototype, 'myInvalidProp', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: () => {}
    });

    assert(!isWatchablePropertyOfComponent(Component, 'myInvalidProp'));
  });
  it('returns false if either consturctor or method are omitted', () => {
    assert(!isWatchablePropertyOfComponent(null, 'myInvalidProp'));
  });
  it('returns false if the method is a property on a parent prototype of the constructor', () => {
    assert(!isWatchablePropertyOfComponent(class {}));
  });
});
