'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var _this2 = this;

  var methodComposer = _configure2.default.apply(undefined, arguments);
  return function (ClassToBirdwatch) {
    var BirdwatchedClass = (function (_ClassToBirdwatch) {
      _inherits(BirdwatchedClass, _ClassToBirdwatch);

      function BirdwatchedClass() {
        _classCallCheck(this, BirdwatchedClass);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BirdwatchedClass).apply(this, arguments));
      }

      return BirdwatchedClass;
    })(ClassToBirdwatch);

    var methodsToWatch = Object.getOwnPropertyNames(ClassToBirdwatch.prototype).filter(_isWatchableProperty.isWatchablePropertyOfConstructor.bind(_this2, ClassToBirdwatch));

    Object.assign(BirdwatchedClass.prototype, methodComposer(_pick2.default.apply(undefined, [ClassToBirdwatch.prototype].concat(_toConsumableArray(methodsToWatch)))));

    return BirdwatchedClass;
  };
};

var _configure = require('./configure');

var _configure2 = _interopRequireDefault(_configure);

var _pick = require('./tools/pick');

var _pick2 = _interopRequireDefault(_pick);

var _isWatchableProperty = require('./tools/isWatchableProperty');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }