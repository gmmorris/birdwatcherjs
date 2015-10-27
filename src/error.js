
  const BirdwatcherError = (message, originalError, srcObject, srcObjectName, method) => {
    this.name = 'BirdwatcherError';
    this.error = originalError;
    this.src = {
      src: srcObject,
      name: srcObjectName,
      method: method
    };
  };
  BirdwatcherError.prototype = Error.prototype;

  export default BirdwatcherError;
