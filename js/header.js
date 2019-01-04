var _extends = Object.assign || function(b) {
        for (var a = 1; a < arguments.length; a++) {
            var c = arguments[a],
                e;
            for (e in c) Object.prototype.hasOwnProperty.call(c, e) && (b[e] = c[e])
        }
        return b
    },
    _createClass = function() {
        function b(a, b) {
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                d.enumerable = d.enumerable || !1;
                d.configurable = !0;
                "value" in d && (d.writable = !0);
                Object.defineProperty(a, d.key, d)
            }
        }
        return function(a, c, e) {
            c && b(a.prototype, c);
            e && b(a, e);
            return a
        }
    }(),
    _class, _temp;

function _defineProperty(b, a, c) {
    a in b ? Object.defineProperty(b, a, {
        value: c,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : b[a] = c;
    return b
}

function _classCallCheck(b, a) {
    if (!(b instanceof a)) throw new TypeError("Cannot call a class as a function");
}

function _possibleConstructorReturn(b, a) {
    if (!b) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !a || "object" !== typeof a && "function" !== typeof a ? b : a
}

function _inherits(b, a) {
    if ("function" !== typeof a && null !== a) throw new TypeError("Super expression must either be null or a function, not " + typeof a);
    b.prototype = Object.create(a && a.prototype, {
        constructor: {
            value: b,
            enumerable: !1,
            writable: !0,
            configurable: !0
        }
    });
    a && (Object.setPrototypeOf ? Object.setPrototypeOf(b, a) : b.__proto__ = a)
}