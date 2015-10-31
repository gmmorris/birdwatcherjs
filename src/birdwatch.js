import configure from './configure';
import pick from './tools/pick';
import {isWatchablePropertyOfConstructor} from './tools/isWatchableProperty';

export default function() {
  const methodComposer = configure(...arguments);
  return ClassToBirdwatch => {
    class BirdwatchedClass extends ClassToBirdwatch {
      constructor() {
        super(...arguments);
      }
    }

    const methodsToWatch =
      Object.getOwnPropertyNames(ClassToBirdwatch.prototype)
        .filter(isWatchablePropertyOfConstructor.bind(this, ClassToBirdwatch));

    Object.assign(
      BirdwatchedClass.prototype,
      methodComposer(pick(ClassToBirdwatch.prototype, ...methodsToWatch)));

    return BirdwatchedClass;
  };
}
