export const Sentinal = Symbol('BirdwatcherError');

export const isBirdwatcherError = o_O => {
  return (o_O && o_O[Sentinal]);
};

export default (message, originalError, srcObject, srcObjectName, method) => {
  const err = Error(message);
  err[Sentinal] = 1;
  err.name = 'BirdwatcherError';
  err.error = originalError;
  err.name = {
    src: srcObject,
    name: srcObjectName,
    method: method
  };
  return err;
};
