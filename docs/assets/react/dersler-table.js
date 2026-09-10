function rf(i, d) {
  for (var u = 0; u < d.length; u++) {
    const h = d[u];
    if (typeof h != "string" && !Array.isArray(h)) {
      for (const w in h)
        if (w !== "default" && !(w in i)) {
          const v = Object.getOwnPropertyDescriptor(h, w);
          v && Object.defineProperty(i, w, v.get ? v : {
            enumerable: !0,
            get: () => h[w]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }));
}
function nf(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var ta = { exports: {} }, $n = {}, ra = { exports: {} }, re = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hc;
function lf() {
  if (hc) return re;
  hc = 1;
  var i = Symbol.for("react.element"), d = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), h = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), v = Symbol.for("react.provider"), g = Symbol.for("react.context"), b = Symbol.for("react.forward_ref"), _ = Symbol.for("react.suspense"), N = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), V = Symbol.iterator;
  function z(m) {
    return m === null || typeof m != "object" ? null : (m = V && m[V] || m["@@iterator"], typeof m == "function" ? m : null);
  }
  var G = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, S = Object.assign, P = {};
  function R(m, C, te) {
    this.props = m, this.context = C, this.refs = P, this.updater = te || G;
  }
  R.prototype.isReactComponent = {}, R.prototype.setState = function(m, C) {
    if (typeof m != "object" && typeof m != "function" && m != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, m, C, "setState");
  }, R.prototype.forceUpdate = function(m) {
    this.updater.enqueueForceUpdate(this, m, "forceUpdate");
  };
  function Z() {
  }
  Z.prototype = R.prototype;
  function W(m, C, te) {
    this.props = m, this.context = C, this.refs = P, this.updater = te || G;
  }
  var $ = W.prototype = new Z();
  $.constructor = W, S($, R.prototype), $.isPureReactComponent = !0;
  var Y = Array.isArray, oe = Object.prototype.hasOwnProperty, J = { current: null }, ye = { key: !0, ref: !0, __self: !0, __source: !0 };
  function we(m, C, te) {
    var ne, ae = {}, se = null, fe = null;
    if (C != null) for (ne in C.ref !== void 0 && (fe = C.ref), C.key !== void 0 && (se = "" + C.key), C) oe.call(C, ne) && !ye.hasOwnProperty(ne) && (ae[ne] = C[ne]);
    var de = arguments.length - 2;
    if (de === 1) ae.children = te;
    else if (1 < de) {
      for (var ke = Array(de), tt = 0; tt < de; tt++) ke[tt] = arguments[tt + 2];
      ae.children = ke;
    }
    if (m && m.defaultProps) for (ne in de = m.defaultProps, de) ae[ne] === void 0 && (ae[ne] = de[ne]);
    return { $$typeof: i, type: m, key: se, ref: fe, props: ae, _owner: J.current };
  }
  function _e(m, C) {
    return { $$typeof: i, type: m.type, key: C, ref: m.ref, props: m.props, _owner: m._owner };
  }
  function Fe(m) {
    return typeof m == "object" && m !== null && m.$$typeof === i;
  }
  function Oe(m) {
    var C = { "=": "=0", ":": "=2" };
    return "$" + m.replace(/[=:]/g, function(te) {
      return C[te];
    });
  }
  var le = /\/+/g;
  function $e(m, C) {
    return typeof m == "object" && m !== null && m.key != null ? Oe("" + m.key) : C.toString(36);
  }
  function Ue(m, C, te, ne, ae) {
    var se = typeof m;
    (se === "undefined" || se === "boolean") && (m = null);
    var fe = !1;
    if (m === null) fe = !0;
    else switch (se) {
      case "string":
      case "number":
        fe = !0;
        break;
      case "object":
        switch (m.$$typeof) {
          case i:
          case d:
            fe = !0;
        }
    }
    if (fe) return fe = m, ae = ae(fe), m = ne === "" ? "." + $e(fe, 0) : ne, Y(ae) ? (te = "", m != null && (te = m.replace(le, "$&/") + "/"), Ue(ae, C, te, "", function(tt) {
      return tt;
    })) : ae != null && (Fe(ae) && (ae = _e(ae, te + (!ae.key || fe && fe.key === ae.key ? "" : ("" + ae.key).replace(le, "$&/") + "/") + m)), C.push(ae)), 1;
    if (fe = 0, ne = ne === "" ? "." : ne + ":", Y(m)) for (var de = 0; de < m.length; de++) {
      se = m[de];
      var ke = ne + $e(se, de);
      fe += Ue(se, C, te, ke, ae);
    }
    else if (ke = z(m), typeof ke == "function") for (m = ke.call(m), de = 0; !(se = m.next()).done; ) se = se.value, ke = ne + $e(se, de++), fe += Ue(se, C, te, ke, ae);
    else if (se === "object") throw C = String(m), Error("Objects are not valid as a React child (found: " + (C === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : C) + "). If you meant to render a collection of children, use an array instead.");
    return fe;
  }
  function et(m, C, te) {
    if (m == null) return m;
    var ne = [], ae = 0;
    return Ue(m, ne, "", "", function(se) {
      return C.call(te, se, ae++);
    }), ne;
  }
  function Me(m) {
    if (m._status === -1) {
      var C = m._result;
      C = C(), C.then(function(te) {
        (m._status === 0 || m._status === -1) && (m._status = 1, m._result = te);
      }, function(te) {
        (m._status === 0 || m._status === -1) && (m._status = 2, m._result = te);
      }), m._status === -1 && (m._status = 0, m._result = C);
    }
    if (m._status === 1) return m._result.default;
    throw m._result;
  }
  var he = { current: null }, I = { transition: null }, B = { ReactCurrentDispatcher: he, ReactCurrentBatchConfig: I, ReactCurrentOwner: J };
  function D() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return re.Children = { map: et, forEach: function(m, C, te) {
    et(m, function() {
      C.apply(this, arguments);
    }, te);
  }, count: function(m) {
    var C = 0;
    return et(m, function() {
      C++;
    }), C;
  }, toArray: function(m) {
    return et(m, function(C) {
      return C;
    }) || [];
  }, only: function(m) {
    if (!Fe(m)) throw Error("React.Children.only expected to receive a single React element child.");
    return m;
  } }, re.Component = R, re.Fragment = u, re.Profiler = w, re.PureComponent = W, re.StrictMode = h, re.Suspense = _, re.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = B, re.act = D, re.cloneElement = function(m, C, te) {
    if (m == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + m + ".");
    var ne = S({}, m.props), ae = m.key, se = m.ref, fe = m._owner;
    if (C != null) {
      if (C.ref !== void 0 && (se = C.ref, fe = J.current), C.key !== void 0 && (ae = "" + C.key), m.type && m.type.defaultProps) var de = m.type.defaultProps;
      for (ke in C) oe.call(C, ke) && !ye.hasOwnProperty(ke) && (ne[ke] = C[ke] === void 0 && de !== void 0 ? de[ke] : C[ke]);
    }
    var ke = arguments.length - 2;
    if (ke === 1) ne.children = te;
    else if (1 < ke) {
      de = Array(ke);
      for (var tt = 0; tt < ke; tt++) de[tt] = arguments[tt + 2];
      ne.children = de;
    }
    return { $$typeof: i, type: m.type, key: ae, ref: se, props: ne, _owner: fe };
  }, re.createContext = function(m) {
    return m = { $$typeof: g, _currentValue: m, _currentValue2: m, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, m.Provider = { $$typeof: v, _context: m }, m.Consumer = m;
  }, re.createElement = we, re.createFactory = function(m) {
    var C = we.bind(null, m);
    return C.type = m, C;
  }, re.createRef = function() {
    return { current: null };
  }, re.forwardRef = function(m) {
    return { $$typeof: b, render: m };
  }, re.isValidElement = Fe, re.lazy = function(m) {
    return { $$typeof: T, _payload: { _status: -1, _result: m }, _init: Me };
  }, re.memo = function(m, C) {
    return { $$typeof: N, type: m, compare: C === void 0 ? null : C };
  }, re.startTransition = function(m) {
    var C = I.transition;
    I.transition = {};
    try {
      m();
    } finally {
      I.transition = C;
    }
  }, re.unstable_act = D, re.useCallback = function(m, C) {
    return he.current.useCallback(m, C);
  }, re.useContext = function(m) {
    return he.current.useContext(m);
  }, re.useDebugValue = function() {
  }, re.useDeferredValue = function(m) {
    return he.current.useDeferredValue(m);
  }, re.useEffect = function(m, C) {
    return he.current.useEffect(m, C);
  }, re.useId = function() {
    return he.current.useId();
  }, re.useImperativeHandle = function(m, C, te) {
    return he.current.useImperativeHandle(m, C, te);
  }, re.useInsertionEffect = function(m, C) {
    return he.current.useInsertionEffect(m, C);
  }, re.useLayoutEffect = function(m, C) {
    return he.current.useLayoutEffect(m, C);
  }, re.useMemo = function(m, C) {
    return he.current.useMemo(m, C);
  }, re.useReducer = function(m, C, te) {
    return he.current.useReducer(m, C, te);
  }, re.useRef = function(m) {
    return he.current.useRef(m);
  }, re.useState = function(m) {
    return he.current.useState(m);
  }, re.useSyncExternalStore = function(m, C, te) {
    return he.current.useSyncExternalStore(m, C, te);
  }, re.useTransition = function() {
    return he.current.useTransition();
  }, re.version = "18.3.1", re;
}
var gc;
function ha() {
  return gc || (gc = 1, ra.exports = lf()), ra.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xc;
function of() {
  if (xc) return $n;
  xc = 1;
  var i = ha(), d = Symbol.for("react.element"), u = Symbol.for("react.fragment"), h = Object.prototype.hasOwnProperty, w = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, v = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(b, _, N) {
    var T, V = {}, z = null, G = null;
    N !== void 0 && (z = "" + N), _.key !== void 0 && (z = "" + _.key), _.ref !== void 0 && (G = _.ref);
    for (T in _) h.call(_, T) && !v.hasOwnProperty(T) && (V[T] = _[T]);
    if (b && b.defaultProps) for (T in _ = b.defaultProps, _) V[T] === void 0 && (V[T] = _[T]);
    return { $$typeof: d, type: b, key: z, ref: G, props: V, _owner: w.current };
  }
  return $n.Fragment = u, $n.jsx = g, $n.jsxs = g, $n;
}
var vc;
function af() {
  return vc || (vc = 1, ta.exports = of()), ta.exports;
}
var s = af(), Q = ha();
const sf = /* @__PURE__ */ nf(Q), uf = /* @__PURE__ */ rf({
  __proto__: null,
  default: sf
}, [Q]);
var no = {}, na = { exports: {} }, Je = {}, la = { exports: {} }, oa = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yc;
function cf() {
  return yc || (yc = 1, (function(i) {
    function d(I, B) {
      var D = I.length;
      I.push(B);
      e: for (; 0 < D; ) {
        var m = D - 1 >>> 1, C = I[m];
        if (0 < w(C, B)) I[m] = B, I[D] = C, D = m;
        else break e;
      }
    }
    function u(I) {
      return I.length === 0 ? null : I[0];
    }
    function h(I) {
      if (I.length === 0) return null;
      var B = I[0], D = I.pop();
      if (D !== B) {
        I[0] = D;
        e: for (var m = 0, C = I.length, te = C >>> 1; m < te; ) {
          var ne = 2 * (m + 1) - 1, ae = I[ne], se = ne + 1, fe = I[se];
          if (0 > w(ae, D)) se < C && 0 > w(fe, ae) ? (I[m] = fe, I[se] = D, m = se) : (I[m] = ae, I[ne] = D, m = ne);
          else if (se < C && 0 > w(fe, D)) I[m] = fe, I[se] = D, m = se;
          else break e;
        }
      }
      return B;
    }
    function w(I, B) {
      var D = I.sortIndex - B.sortIndex;
      return D !== 0 ? D : I.id - B.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var v = performance;
      i.unstable_now = function() {
        return v.now();
      };
    } else {
      var g = Date, b = g.now();
      i.unstable_now = function() {
        return g.now() - b;
      };
    }
    var _ = [], N = [], T = 1, V = null, z = 3, G = !1, S = !1, P = !1, R = typeof setTimeout == "function" ? setTimeout : null, Z = typeof clearTimeout == "function" ? clearTimeout : null, W = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function $(I) {
      for (var B = u(N); B !== null; ) {
        if (B.callback === null) h(N);
        else if (B.startTime <= I) h(N), B.sortIndex = B.expirationTime, d(_, B);
        else break;
        B = u(N);
      }
    }
    function Y(I) {
      if (P = !1, $(I), !S) if (u(_) !== null) S = !0, Me(oe);
      else {
        var B = u(N);
        B !== null && he(Y, B.startTime - I);
      }
    }
    function oe(I, B) {
      S = !1, P && (P = !1, Z(we), we = -1), G = !0;
      var D = z;
      try {
        for ($(B), V = u(_); V !== null && (!(V.expirationTime > B) || I && !Oe()); ) {
          var m = V.callback;
          if (typeof m == "function") {
            V.callback = null, z = V.priorityLevel;
            var C = m(V.expirationTime <= B);
            B = i.unstable_now(), typeof C == "function" ? V.callback = C : V === u(_) && h(_), $(B);
          } else h(_);
          V = u(_);
        }
        if (V !== null) var te = !0;
        else {
          var ne = u(N);
          ne !== null && he(Y, ne.startTime - B), te = !1;
        }
        return te;
      } finally {
        V = null, z = D, G = !1;
      }
    }
    var J = !1, ye = null, we = -1, _e = 5, Fe = -1;
    function Oe() {
      return !(i.unstable_now() - Fe < _e);
    }
    function le() {
      if (ye !== null) {
        var I = i.unstable_now();
        Fe = I;
        var B = !0;
        try {
          B = ye(!0, I);
        } finally {
          B ? $e() : (J = !1, ye = null);
        }
      } else J = !1;
    }
    var $e;
    if (typeof W == "function") $e = function() {
      W(le);
    };
    else if (typeof MessageChannel < "u") {
      var Ue = new MessageChannel(), et = Ue.port2;
      Ue.port1.onmessage = le, $e = function() {
        et.postMessage(null);
      };
    } else $e = function() {
      R(le, 0);
    };
    function Me(I) {
      ye = I, J || (J = !0, $e());
    }
    function he(I, B) {
      we = R(function() {
        I(i.unstable_now());
      }, B);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(I) {
      I.callback = null;
    }, i.unstable_continueExecution = function() {
      S || G || (S = !0, Me(oe));
    }, i.unstable_forceFrameRate = function(I) {
      0 > I || 125 < I ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : _e = 0 < I ? Math.floor(1e3 / I) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return z;
    }, i.unstable_getFirstCallbackNode = function() {
      return u(_);
    }, i.unstable_next = function(I) {
      switch (z) {
        case 1:
        case 2:
        case 3:
          var B = 3;
          break;
        default:
          B = z;
      }
      var D = z;
      z = B;
      try {
        return I();
      } finally {
        z = D;
      }
    }, i.unstable_pauseExecution = function() {
    }, i.unstable_requestPaint = function() {
    }, i.unstable_runWithPriority = function(I, B) {
      switch (I) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          I = 3;
      }
      var D = z;
      z = I;
      try {
        return B();
      } finally {
        z = D;
      }
    }, i.unstable_scheduleCallback = function(I, B, D) {
      var m = i.unstable_now();
      switch (typeof D == "object" && D !== null ? (D = D.delay, D = typeof D == "number" && 0 < D ? m + D : m) : D = m, I) {
        case 1:
          var C = -1;
          break;
        case 2:
          C = 250;
          break;
        case 5:
          C = 1073741823;
          break;
        case 4:
          C = 1e4;
          break;
        default:
          C = 5e3;
      }
      return C = D + C, I = { id: T++, callback: B, priorityLevel: I, startTime: D, expirationTime: C, sortIndex: -1 }, D > m ? (I.sortIndex = D, d(N, I), u(_) === null && I === u(N) && (P ? (Z(we), we = -1) : P = !0, he(Y, D - m))) : (I.sortIndex = C, d(_, I), S || G || (S = !0, Me(oe))), I;
    }, i.unstable_shouldYield = Oe, i.unstable_wrapCallback = function(I) {
      var B = z;
      return function() {
        var D = z;
        z = B;
        try {
          return I.apply(this, arguments);
        } finally {
          z = D;
        }
      };
    };
  })(oa)), oa;
}
var wc;
function df() {
  return wc || (wc = 1, la.exports = cf()), la.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var kc;
function pf() {
  if (kc) return Je;
  kc = 1;
  var i = ha(), d = df();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1; r < arguments.length; r++) t += "&args[]=" + encodeURIComponent(arguments[r]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var h = /* @__PURE__ */ new Set(), w = {};
  function v(e, t) {
    g(e, t), g(e + "Capture", t);
  }
  function g(e, t) {
    for (w[e] = t, e = 0; e < t.length; e++) h.add(t[e]);
  }
  var b = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), _ = Object.prototype.hasOwnProperty, N = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, T = {}, V = {};
  function z(e) {
    return _.call(V, e) ? !0 : _.call(T, e) ? !1 : N.test(e) ? V[e] = !0 : (T[e] = !0, !1);
  }
  function G(e, t, r, n) {
    if (r !== null && r.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return n ? !1 : r !== null ? !r.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function S(e, t, r, n) {
    if (t === null || typeof t > "u" || G(e, t, r, n)) return !0;
    if (n) return !1;
    if (r !== null) switch (r.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
    return !1;
  }
  function P(e, t, r, n, l, o, a) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = n, this.attributeNamespace = l, this.mustUseProperty = r, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = a;
  }
  var R = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    R[e] = new P(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    R[t] = new P(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    R[e] = new P(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    R[e] = new P(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    R[e] = new P(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    R[e] = new P(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    R[e] = new P(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    R[e] = new P(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    R[e] = new P(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var Z = /[\-:]([a-z])/g;
  function W(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      Z,
      W
    );
    R[t] = new P(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(Z, W);
    R[t] = new P(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(Z, W);
    R[t] = new P(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    R[e] = new P(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), R.xlinkHref = new P("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    R[e] = new P(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function $(e, t, r, n) {
    var l = R.hasOwnProperty(t) ? R[t] : null;
    (l !== null ? l.type !== 0 : n || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (S(t, r, l, n) && (r = null), n || l === null ? z(t) && (r === null ? e.removeAttribute(t) : e.setAttribute(t, "" + r)) : l.mustUseProperty ? e[l.propertyName] = r === null ? l.type === 3 ? !1 : "" : r : (t = l.attributeName, n = l.attributeNamespace, r === null ? e.removeAttribute(t) : (l = l.type, r = l === 3 || l === 4 && r === !0 ? "" : "" + r, n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r))));
  }
  var Y = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, oe = Symbol.for("react.element"), J = Symbol.for("react.portal"), ye = Symbol.for("react.fragment"), we = Symbol.for("react.strict_mode"), _e = Symbol.for("react.profiler"), Fe = Symbol.for("react.provider"), Oe = Symbol.for("react.context"), le = Symbol.for("react.forward_ref"), $e = Symbol.for("react.suspense"), Ue = Symbol.for("react.suspense_list"), et = Symbol.for("react.memo"), Me = Symbol.for("react.lazy"), he = Symbol.for("react.offscreen"), I = Symbol.iterator;
  function B(e) {
    return e === null || typeof e != "object" ? null : (e = I && e[I] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var D = Object.assign, m;
  function C(e) {
    if (m === void 0) try {
      throw Error();
    } catch (r) {
      var t = r.stack.trim().match(/\n( *(at )?)/);
      m = t && t[1] || "";
    }
    return `
` + m + e;
  }
  var te = !1;
  function ne(e, t) {
    if (!e || te) return "";
    te = !0;
    var r = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t) if (t = function() {
        throw Error();
      }, Object.defineProperty(t.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(t, []);
        } catch (k) {
          var n = k;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (k) {
          n = k;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (k) {
          n = k;
        }
        e();
      }
    } catch (k) {
      if (k && n && typeof k.stack == "string") {
        for (var l = k.stack.split(`
`), o = n.stack.split(`
`), a = l.length - 1, c = o.length - 1; 1 <= a && 0 <= c && l[a] !== o[c]; ) c--;
        for (; 1 <= a && 0 <= c; a--, c--) if (l[a] !== o[c]) {
          if (a !== 1 || c !== 1)
            do
              if (a--, c--, 0 > c || l[a] !== o[c]) {
                var p = `
` + l[a].replace(" at new ", " at ");
                return e.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", e.displayName)), p;
              }
            while (1 <= a && 0 <= c);
          break;
        }
      }
    } finally {
      te = !1, Error.prepareStackTrace = r;
    }
    return (e = e ? e.displayName || e.name : "") ? C(e) : "";
  }
  function ae(e) {
    switch (e.tag) {
      case 5:
        return C(e.type);
      case 16:
        return C("Lazy");
      case 13:
        return C("Suspense");
      case 19:
        return C("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = ne(e.type, !1), e;
      case 11:
        return e = ne(e.type.render, !1), e;
      case 1:
        return e = ne(e.type, !0), e;
      default:
        return "";
    }
  }
  function se(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ye:
        return "Fragment";
      case J:
        return "Portal";
      case _e:
        return "Profiler";
      case we:
        return "StrictMode";
      case $e:
        return "Suspense";
      case Ue:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Oe:
        return (e.displayName || "Context") + ".Consumer";
      case Fe:
        return (e._context.displayName || "Context") + ".Provider";
      case le:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case et:
        return t = e.displayName || null, t !== null ? t : se(e.type) || "Memo";
      case Me:
        t = e._payload, e = e._init;
        try {
          return se(e(t));
        } catch {
        }
    }
    return null;
  }
  function fe(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return se(t);
      case 8:
        return t === we ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function de(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function ke(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function tt(e) {
    var t = ke(e) ? "checked" : "value", r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), n = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof r < "u" && typeof r.get == "function" && typeof r.set == "function") {
      var l = r.get, o = r.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(a) {
        n = "" + a, o.call(this, a);
      } }), Object.defineProperty(e, t, { enumerable: r.enumerable }), { getValue: function() {
        return n;
      }, setValue: function(a) {
        n = "" + a;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function qn(e) {
    e._valueTracker || (e._valueTracker = tt(e));
  }
  function ka(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var r = t.getValue(), n = "";
    return e && (n = ke(e) ? e.checked ? "true" : "false" : e.value), e = n, e !== r ? (t.setValue(e), !0) : !1;
  }
  function Kn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function ao(e, t) {
    var r = t.checked;
    return D({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: r ?? e._wrapperState.initialChecked });
  }
  function ba(e, t) {
    var r = t.defaultValue == null ? "" : t.defaultValue, n = t.checked != null ? t.checked : t.defaultChecked;
    r = de(t.value != null ? t.value : r), e._wrapperState = { initialChecked: n, initialValue: r, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Sa(e, t) {
    t = t.checked, t != null && $(e, "checked", t, !1);
  }
  function so(e, t) {
    Sa(e, t);
    var r = de(t.value), n = t.type;
    if (r != null) n === "number" ? (r === 0 && e.value === "" || e.value != r) && (e.value = "" + r) : e.value !== "" + r && (e.value = "" + r);
    else if (n === "submit" || n === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? uo(e, t.type, r) : t.hasOwnProperty("defaultValue") && uo(e, t.type, de(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function ja(e, t, r) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var n = t.type;
      if (!(n !== "submit" && n !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, r || t === e.value || (e.value = t), e.defaultValue = t;
    }
    r = e.name, r !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, r !== "" && (e.name = r);
  }
  function uo(e, t, r) {
    (t !== "number" || Kn(e.ownerDocument) !== e) && (r == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + r && (e.defaultValue = "" + r));
  }
  var en = Array.isArray;
  function Cr(e, t, r, n) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < r.length; l++) t["$" + r[l]] = !0;
      for (r = 0; r < e.length; r++) l = t.hasOwnProperty("$" + e[r].value), e[r].selected !== l && (e[r].selected = l), l && n && (e[r].defaultSelected = !0);
    } else {
      for (r = "" + de(r), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === r) {
          e[l].selected = !0, n && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function co(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return D({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Ca(e, t) {
    var r = t.value;
    if (r == null) {
      if (r = t.children, t = t.defaultValue, r != null) {
        if (t != null) throw Error(u(92));
        if (en(r)) {
          if (1 < r.length) throw Error(u(93));
          r = r[0];
        }
        t = r;
      }
      t == null && (t = ""), r = t;
    }
    e._wrapperState = { initialValue: de(r) };
  }
  function Ea(e, t) {
    var r = de(t.value), n = de(t.defaultValue);
    r != null && (r = "" + r, r !== e.value && (e.value = r), t.defaultValue == null && e.defaultValue !== r && (e.defaultValue = r)), n != null && (e.defaultValue = "" + n);
  }
  function Na(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function za(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function po(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? za(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Gn, _a = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, r, n, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, r, n, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Gn = Gn || document.createElement("div"), Gn.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Gn.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function tn(e, t) {
    if (t) {
      var r = e.firstChild;
      if (r && r === e.lastChild && r.nodeType === 3) {
        r.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var rn = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, id = ["Webkit", "ms", "Moz", "O"];
  Object.keys(rn).forEach(function(e) {
    id.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), rn[t] = rn[e];
    });
  });
  function Ma(e, t, r) {
    return t == null || typeof t == "boolean" || t === "" ? "" : r || typeof t != "number" || t === 0 || rn.hasOwnProperty(e) && rn[e] ? ("" + t).trim() : t + "px";
  }
  function Pa(e, t) {
    e = e.style;
    for (var r in t) if (t.hasOwnProperty(r)) {
      var n = r.indexOf("--") === 0, l = Ma(r, t[r], n);
      r === "float" && (r = "cssFloat"), n ? e.setProperty(r, l) : e[r] = l;
    }
  }
  var ad = D({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function fo(e, t) {
    if (t) {
      if (ad[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function mo(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var ho = null;
  function go(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var xo = null, Er = null, Nr = null;
  function La(e) {
    if (e = Cn(e)) {
      if (typeof xo != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = vl(t), xo(e.stateNode, e.type, t));
    }
  }
  function Ta(e) {
    Er ? Nr ? Nr.push(e) : Nr = [e] : Er = e;
  }
  function Ra() {
    if (Er) {
      var e = Er, t = Nr;
      if (Nr = Er = null, La(e), t) for (e = 0; e < t.length; e++) La(t[e]);
    }
  }
  function Ia(e, t) {
    return e(t);
  }
  function Oa() {
  }
  var vo = !1;
  function Da(e, t, r) {
    if (vo) return e(t, r);
    vo = !0;
    try {
      return Ia(e, t, r);
    } finally {
      vo = !1, (Er !== null || Nr !== null) && (Oa(), Ra());
    }
  }
  function nn(e, t) {
    var r = e.stateNode;
    if (r === null) return null;
    var n = vl(r);
    if (n === null) return null;
    r = n[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (n = !n.disabled) || (e = e.type, n = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !n;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (r && typeof r != "function") throw Error(u(231, t, typeof r));
    return r;
  }
  var yo = !1;
  if (b) try {
    var ln = {};
    Object.defineProperty(ln, "passive", { get: function() {
      yo = !0;
    } }), window.addEventListener("test", ln, ln), window.removeEventListener("test", ln, ln);
  } catch {
    yo = !1;
  }
  function sd(e, t, r, n, l, o, a, c, p) {
    var k = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(r, k);
    } catch (E) {
      this.onError(E);
    }
  }
  var on = !1, Yn = null, Xn = !1, wo = null, ud = { onError: function(e) {
    on = !0, Yn = e;
  } };
  function cd(e, t, r, n, l, o, a, c, p) {
    on = !1, Yn = null, sd.apply(ud, arguments);
  }
  function dd(e, t, r, n, l, o, a, c, p) {
    if (cd.apply(this, arguments), on) {
      if (on) {
        var k = Yn;
        on = !1, Yn = null;
      } else throw Error(u(198));
      Xn || (Xn = !0, wo = k);
    }
  }
  function cr(e) {
    var t = e, r = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (r = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? r : null;
  }
  function Aa(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Fa(e) {
    if (cr(e) !== e) throw Error(u(188));
  }
  function pd(e) {
    var t = e.alternate;
    if (!t) {
      if (t = cr(e), t === null) throw Error(u(188));
      return t !== e ? null : e;
    }
    for (var r = e, n = t; ; ) {
      var l = r.return;
      if (l === null) break;
      var o = l.alternate;
      if (o === null) {
        if (n = l.return, n !== null) {
          r = n;
          continue;
        }
        break;
      }
      if (l.child === o.child) {
        for (o = l.child; o; ) {
          if (o === r) return Fa(l), e;
          if (o === n) return Fa(l), t;
          o = o.sibling;
        }
        throw Error(u(188));
      }
      if (r.return !== n.return) r = l, n = o;
      else {
        for (var a = !1, c = l.child; c; ) {
          if (c === r) {
            a = !0, r = l, n = o;
            break;
          }
          if (c === n) {
            a = !0, n = l, r = o;
            break;
          }
          c = c.sibling;
        }
        if (!a) {
          for (c = o.child; c; ) {
            if (c === r) {
              a = !0, r = o, n = l;
              break;
            }
            if (c === n) {
              a = !0, n = o, r = l;
              break;
            }
            c = c.sibling;
          }
          if (!a) throw Error(u(189));
        }
      }
      if (r.alternate !== n) throw Error(u(190));
    }
    if (r.tag !== 3) throw Error(u(188));
    return r.stateNode.current === r ? e : t;
  }
  function $a(e) {
    return e = pd(e), e !== null ? Ua(e) : null;
  }
  function Ua(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Ua(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Ha = d.unstable_scheduleCallback, Va = d.unstable_cancelCallback, fd = d.unstable_shouldYield, md = d.unstable_requestPaint, Ee = d.unstable_now, hd = d.unstable_getCurrentPriorityLevel, ko = d.unstable_ImmediatePriority, Ba = d.unstable_UserBlockingPriority, Zn = d.unstable_NormalPriority, gd = d.unstable_LowPriority, Wa = d.unstable_IdlePriority, Jn = null, kt = null;
  function xd(e) {
    if (kt && typeof kt.onCommitFiberRoot == "function") try {
      kt.onCommitFiberRoot(Jn, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : wd, vd = Math.log, yd = Math.LN2;
  function wd(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (vd(e) / yd | 0) | 0;
  }
  var el = 64, tl = 4194304;
  function an(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function rl(e, t) {
    var r = e.pendingLanes;
    if (r === 0) return 0;
    var n = 0, l = e.suspendedLanes, o = e.pingedLanes, a = r & 268435455;
    if (a !== 0) {
      var c = a & ~l;
      c !== 0 ? n = an(c) : (o &= a, o !== 0 && (n = an(o)));
    } else a = r & ~l, a !== 0 ? n = an(a) : o !== 0 && (n = an(o));
    if (n === 0) return 0;
    if (t !== 0 && t !== n && (t & l) === 0 && (l = n & -n, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((n & 4) !== 0 && (n |= r & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= n; 0 < t; ) r = 31 - pt(t), l = 1 << r, n |= e[r], t &= ~l;
    return n;
  }
  function kd(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function bd(e, t) {
    for (var r = e.suspendedLanes, n = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var a = 31 - pt(o), c = 1 << a, p = l[a];
      p === -1 ? ((c & r) === 0 || (c & n) !== 0) && (l[a] = kd(c, t)) : p <= t && (e.expiredLanes |= c), o &= ~c;
    }
  }
  function bo(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Qa() {
    var e = el;
    return el <<= 1, (el & 4194240) === 0 && (el = 64), e;
  }
  function So(e) {
    for (var t = [], r = 0; 31 > r; r++) t.push(e);
    return t;
  }
  function sn(e, t, r) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - pt(t), e[t] = r;
  }
  function Sd(e, t) {
    var r = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var n = e.eventTimes;
    for (e = e.expirationTimes; 0 < r; ) {
      var l = 31 - pt(r), o = 1 << l;
      t[l] = 0, n[l] = -1, e[l] = -1, r &= ~o;
    }
  }
  function jo(e, t) {
    var r = e.entangledLanes |= t;
    for (e = e.entanglements; r; ) {
      var n = 31 - pt(r), l = 1 << n;
      l & t | e[n] & t && (e[n] |= t), r &= ~l;
    }
  }
  var pe = 0;
  function qa(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Ka, Co, Ga, Ya, Xa, Eo = !1, nl = [], Ut = null, Ht = null, Vt = null, un = /* @__PURE__ */ new Map(), cn = /* @__PURE__ */ new Map(), Bt = [], jd = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Za(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Ut = null;
        break;
      case "dragenter":
      case "dragleave":
        Ht = null;
        break;
      case "mouseover":
      case "mouseout":
        Vt = null;
        break;
      case "pointerover":
      case "pointerout":
        un.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        cn.delete(t.pointerId);
    }
  }
  function dn(e, t, r, n, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: r, eventSystemFlags: n, nativeEvent: o, targetContainers: [l] }, t !== null && (t = Cn(t), t !== null && Co(t)), e) : (e.eventSystemFlags |= n, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Cd(e, t, r, n, l) {
    switch (t) {
      case "focusin":
        return Ut = dn(Ut, e, t, r, n, l), !0;
      case "dragenter":
        return Ht = dn(Ht, e, t, r, n, l), !0;
      case "mouseover":
        return Vt = dn(Vt, e, t, r, n, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return un.set(o, dn(un.get(o) || null, e, t, r, n, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, cn.set(o, dn(cn.get(o) || null, e, t, r, n, l)), !0;
    }
    return !1;
  }
  function Ja(e) {
    var t = dr(e.target);
    if (t !== null) {
      var r = cr(t);
      if (r !== null) {
        if (t = r.tag, t === 13) {
          if (t = Aa(r), t !== null) {
            e.blockedOn = t, Xa(e.priority, function() {
              Ga(r);
            });
            return;
          }
        } else if (t === 3 && r.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = r.tag === 3 ? r.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function ll(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var r = zo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (r === null) {
        r = e.nativeEvent;
        var n = new r.constructor(r.type, r);
        ho = n, r.target.dispatchEvent(n), ho = null;
      } else return t = Cn(r), t !== null && Co(t), e.blockedOn = r, !1;
      t.shift();
    }
    return !0;
  }
  function es(e, t, r) {
    ll(e) && r.delete(t);
  }
  function Ed() {
    Eo = !1, Ut !== null && ll(Ut) && (Ut = null), Ht !== null && ll(Ht) && (Ht = null), Vt !== null && ll(Vt) && (Vt = null), un.forEach(es), cn.forEach(es);
  }
  function pn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Eo || (Eo = !0, d.unstable_scheduleCallback(d.unstable_NormalPriority, Ed)));
  }
  function fn(e) {
    function t(l) {
      return pn(l, e);
    }
    if (0 < nl.length) {
      pn(nl[0], e);
      for (var r = 1; r < nl.length; r++) {
        var n = nl[r];
        n.blockedOn === e && (n.blockedOn = null);
      }
    }
    for (Ut !== null && pn(Ut, e), Ht !== null && pn(Ht, e), Vt !== null && pn(Vt, e), un.forEach(t), cn.forEach(t), r = 0; r < Bt.length; r++) n = Bt[r], n.blockedOn === e && (n.blockedOn = null);
    for (; 0 < Bt.length && (r = Bt[0], r.blockedOn === null); ) Ja(r), r.blockedOn === null && Bt.shift();
  }
  var zr = Y.ReactCurrentBatchConfig, ol = !0;
  function Nd(e, t, r, n) {
    var l = pe, o = zr.transition;
    zr.transition = null;
    try {
      pe = 1, No(e, t, r, n);
    } finally {
      pe = l, zr.transition = o;
    }
  }
  function zd(e, t, r, n) {
    var l = pe, o = zr.transition;
    zr.transition = null;
    try {
      pe = 4, No(e, t, r, n);
    } finally {
      pe = l, zr.transition = o;
    }
  }
  function No(e, t, r, n) {
    if (ol) {
      var l = zo(e, t, r, n);
      if (l === null) Wo(e, t, n, il, r), Za(e, n);
      else if (Cd(l, e, t, r, n)) n.stopPropagation();
      else if (Za(e, n), t & 4 && -1 < jd.indexOf(e)) {
        for (; l !== null; ) {
          var o = Cn(l);
          if (o !== null && Ka(o), o = zo(e, t, r, n), o === null && Wo(e, t, n, il, r), o === l) break;
          l = o;
        }
        l !== null && n.stopPropagation();
      } else Wo(e, t, n, null, r);
    }
  }
  var il = null;
  function zo(e, t, r, n) {
    if (il = null, e = go(n), e = dr(e), e !== null) if (t = cr(e), t === null) e = null;
    else if (r = t.tag, r === 13) {
      if (e = Aa(t), e !== null) return e;
      e = null;
    } else if (r === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return il = e, null;
  }
  function ts(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (hd()) {
          case ko:
            return 1;
          case Ba:
            return 4;
          case Zn:
          case gd:
            return 16;
          case Wa:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Wt = null, _o = null, al = null;
  function rs() {
    if (al) return al;
    var e, t = _o, r = t.length, n, l = "value" in Wt ? Wt.value : Wt.textContent, o = l.length;
    for (e = 0; e < r && t[e] === l[e]; e++) ;
    var a = r - e;
    for (n = 1; n <= a && t[r - n] === l[o - n]; n++) ;
    return al = l.slice(e, 1 < n ? 1 - n : void 0);
  }
  function sl(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function ul() {
    return !0;
  }
  function ns() {
    return !1;
  }
  function rt(e) {
    function t(r, n, l, o, a) {
      this._reactName = r, this._targetInst = l, this.type = n, this.nativeEvent = o, this.target = a, this.currentTarget = null;
      for (var c in e) e.hasOwnProperty(c) && (r = e[c], this[c] = r ? r(o) : o[c]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? ul : ns, this.isPropagationStopped = ns, this;
    }
    return D(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var r = this.nativeEvent;
      r && (r.preventDefault ? r.preventDefault() : typeof r.returnValue != "unknown" && (r.returnValue = !1), this.isDefaultPrevented = ul);
    }, stopPropagation: function() {
      var r = this.nativeEvent;
      r && (r.stopPropagation ? r.stopPropagation() : typeof r.cancelBubble != "unknown" && (r.cancelBubble = !0), this.isPropagationStopped = ul);
    }, persist: function() {
    }, isPersistent: ul }), t;
  }
  var _r = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Mo = rt(_r), mn = D({}, _r, { view: 0, detail: 0 }), _d = rt(mn), Po, Lo, hn, cl = D({}, mn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Ro, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== hn && (hn && e.type === "mousemove" ? (Po = e.screenX - hn.screenX, Lo = e.screenY - hn.screenY) : Lo = Po = 0, hn = e), Po);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : Lo;
  } }), ls = rt(cl), Md = D({}, cl, { dataTransfer: 0 }), Pd = rt(Md), Ld = D({}, mn, { relatedTarget: 0 }), To = rt(Ld), Td = D({}, _r, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Rd = rt(Td), Id = D({}, _r, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Od = rt(Id), Dd = D({}, _r, { data: 0 }), os = rt(Dd), Ad = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Fd = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, $d = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ud(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = $d[e]) ? !!t[e] : !1;
  }
  function Ro() {
    return Ud;
  }
  var Hd = D({}, mn, { key: function(e) {
    if (e.key) {
      var t = Ad[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = sl(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Fd[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Ro, charCode: function(e) {
    return e.type === "keypress" ? sl(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? sl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Vd = rt(Hd), Bd = D({}, cl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), is = rt(Bd), Wd = D({}, mn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Ro }), Qd = rt(Wd), qd = D({}, _r, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Kd = rt(qd), Gd = D({}, cl, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Yd = rt(Gd), Xd = [9, 13, 27, 32], Io = b && "CompositionEvent" in window, gn = null;
  b && "documentMode" in document && (gn = document.documentMode);
  var Zd = b && "TextEvent" in window && !gn, as = b && (!Io || gn && 8 < gn && 11 >= gn), ss = " ", us = !1;
  function cs(e, t) {
    switch (e) {
      case "keyup":
        return Xd.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function ds(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Mr = !1;
  function Jd(e, t) {
    switch (e) {
      case "compositionend":
        return ds(t);
      case "keypress":
        return t.which !== 32 ? null : (us = !0, ss);
      case "textInput":
        return e = t.data, e === ss && us ? null : e;
      default:
        return null;
    }
  }
  function ep(e, t) {
    if (Mr) return e === "compositionend" || !Io && cs(e, t) ? (e = rs(), al = _o = Wt = null, Mr = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return as && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var tp = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function ps(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!tp[e.type] : t === "textarea";
  }
  function fs(e, t, r, n) {
    Ta(n), t = hl(t, "onChange"), 0 < t.length && (r = new Mo("onChange", "change", null, r, n), e.push({ event: r, listeners: t }));
  }
  var xn = null, vn = null;
  function rp(e) {
    Ps(e, 0);
  }
  function dl(e) {
    var t = Ir(e);
    if (ka(t)) return e;
  }
  function np(e, t) {
    if (e === "change") return t;
  }
  var ms = !1;
  if (b) {
    var Oo;
    if (b) {
      var Do = "oninput" in document;
      if (!Do) {
        var hs = document.createElement("div");
        hs.setAttribute("oninput", "return;"), Do = typeof hs.oninput == "function";
      }
      Oo = Do;
    } else Oo = !1;
    ms = Oo && (!document.documentMode || 9 < document.documentMode);
  }
  function gs() {
    xn && (xn.detachEvent("onpropertychange", xs), vn = xn = null);
  }
  function xs(e) {
    if (e.propertyName === "value" && dl(vn)) {
      var t = [];
      fs(t, vn, e, go(e)), Da(rp, t);
    }
  }
  function lp(e, t, r) {
    e === "focusin" ? (gs(), xn = t, vn = r, xn.attachEvent("onpropertychange", xs)) : e === "focusout" && gs();
  }
  function op(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return dl(vn);
  }
  function ip(e, t) {
    if (e === "click") return dl(t);
  }
  function ap(e, t) {
    if (e === "input" || e === "change") return dl(t);
  }
  function sp(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ft = typeof Object.is == "function" ? Object.is : sp;
  function yn(e, t) {
    if (ft(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var r = Object.keys(e), n = Object.keys(t);
    if (r.length !== n.length) return !1;
    for (n = 0; n < r.length; n++) {
      var l = r[n];
      if (!_.call(t, l) || !ft(e[l], t[l])) return !1;
    }
    return !0;
  }
  function vs(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function ys(e, t) {
    var r = vs(e);
    e = 0;
    for (var n; r; ) {
      if (r.nodeType === 3) {
        if (n = e + r.textContent.length, e <= t && n >= t) return { node: r, offset: t - e };
        e = n;
      }
      e: {
        for (; r; ) {
          if (r.nextSibling) {
            r = r.nextSibling;
            break e;
          }
          r = r.parentNode;
        }
        r = void 0;
      }
      r = vs(r);
    }
  }
  function ws(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ws(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ks() {
    for (var e = window, t = Kn(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var r = typeof t.contentWindow.location.href == "string";
      } catch {
        r = !1;
      }
      if (r) e = t.contentWindow;
      else break;
      t = Kn(e.document);
    }
    return t;
  }
  function Ao(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function up(e) {
    var t = ks(), r = e.focusedElem, n = e.selectionRange;
    if (t !== r && r && r.ownerDocument && ws(r.ownerDocument.documentElement, r)) {
      if (n !== null && Ao(r)) {
        if (t = n.start, e = n.end, e === void 0 && (e = t), "selectionStart" in r) r.selectionStart = t, r.selectionEnd = Math.min(e, r.value.length);
        else if (e = (t = r.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = r.textContent.length, o = Math.min(n.start, l);
          n = n.end === void 0 ? o : Math.min(n.end, l), !e.extend && o > n && (l = n, n = o, o = l), l = ys(r, o);
          var a = ys(
            r,
            n
          );
          l && a && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== a.node || e.focusOffset !== a.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), o > n ? (e.addRange(t), e.extend(a.node, a.offset)) : (t.setEnd(a.node, a.offset), e.addRange(t)));
        }
      }
      for (t = [], e = r; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof r.focus == "function" && r.focus(), r = 0; r < t.length; r++) e = t[r], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var cp = b && "documentMode" in document && 11 >= document.documentMode, Pr = null, Fo = null, wn = null, $o = !1;
  function bs(e, t, r) {
    var n = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
    $o || Pr == null || Pr !== Kn(n) || (n = Pr, "selectionStart" in n && Ao(n) ? n = { start: n.selectionStart, end: n.selectionEnd } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = { anchorNode: n.anchorNode, anchorOffset: n.anchorOffset, focusNode: n.focusNode, focusOffset: n.focusOffset }), wn && yn(wn, n) || (wn = n, n = hl(Fo, "onSelect"), 0 < n.length && (t = new Mo("onSelect", "select", null, t, r), e.push({ event: t, listeners: n }), t.target = Pr)));
  }
  function pl(e, t) {
    var r = {};
    return r[e.toLowerCase()] = t.toLowerCase(), r["Webkit" + e] = "webkit" + t, r["Moz" + e] = "moz" + t, r;
  }
  var Lr = { animationend: pl("Animation", "AnimationEnd"), animationiteration: pl("Animation", "AnimationIteration"), animationstart: pl("Animation", "AnimationStart"), transitionend: pl("Transition", "TransitionEnd") }, Uo = {}, Ss = {};
  b && (Ss = document.createElement("div").style, "AnimationEvent" in window || (delete Lr.animationend.animation, delete Lr.animationiteration.animation, delete Lr.animationstart.animation), "TransitionEvent" in window || delete Lr.transitionend.transition);
  function fl(e) {
    if (Uo[e]) return Uo[e];
    if (!Lr[e]) return e;
    var t = Lr[e], r;
    for (r in t) if (t.hasOwnProperty(r) && r in Ss) return Uo[e] = t[r];
    return e;
  }
  var js = fl("animationend"), Cs = fl("animationiteration"), Es = fl("animationstart"), Ns = fl("transitionend"), zs = /* @__PURE__ */ new Map(), _s = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Qt(e, t) {
    zs.set(e, t), v(t, [e]);
  }
  for (var Ho = 0; Ho < _s.length; Ho++) {
    var Vo = _s[Ho], dp = Vo.toLowerCase(), pp = Vo[0].toUpperCase() + Vo.slice(1);
    Qt(dp, "on" + pp);
  }
  Qt(js, "onAnimationEnd"), Qt(Cs, "onAnimationIteration"), Qt(Es, "onAnimationStart"), Qt("dblclick", "onDoubleClick"), Qt("focusin", "onFocus"), Qt("focusout", "onBlur"), Qt(Ns, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), v("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), v("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), v("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), v("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), v("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), v("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var kn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), fp = new Set("cancel close invalid load scroll toggle".split(" ").concat(kn));
  function Ms(e, t, r) {
    var n = e.type || "unknown-event";
    e.currentTarget = r, dd(n, t, void 0, e), e.currentTarget = null;
  }
  function Ps(e, t) {
    t = (t & 4) !== 0;
    for (var r = 0; r < e.length; r++) {
      var n = e[r], l = n.event;
      n = n.listeners;
      e: {
        var o = void 0;
        if (t) for (var a = n.length - 1; 0 <= a; a--) {
          var c = n[a], p = c.instance, k = c.currentTarget;
          if (c = c.listener, p !== o && l.isPropagationStopped()) break e;
          Ms(l, c, k), o = p;
        }
        else for (a = 0; a < n.length; a++) {
          if (c = n[a], p = c.instance, k = c.currentTarget, c = c.listener, p !== o && l.isPropagationStopped()) break e;
          Ms(l, c, k), o = p;
        }
      }
    }
    if (Xn) throw e = wo, Xn = !1, wo = null, e;
  }
  function ge(e, t) {
    var r = t[Xo];
    r === void 0 && (r = t[Xo] = /* @__PURE__ */ new Set());
    var n = e + "__bubble";
    r.has(n) || (Ls(t, e, 2, !1), r.add(n));
  }
  function Bo(e, t, r) {
    var n = 0;
    t && (n |= 4), Ls(r, e, n, t);
  }
  var ml = "_reactListening" + Math.random().toString(36).slice(2);
  function bn(e) {
    if (!e[ml]) {
      e[ml] = !0, h.forEach(function(r) {
        r !== "selectionchange" && (fp.has(r) || Bo(r, !1, e), Bo(r, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ml] || (t[ml] = !0, Bo("selectionchange", !1, t));
    }
  }
  function Ls(e, t, r, n) {
    switch (ts(t)) {
      case 1:
        var l = Nd;
        break;
      case 4:
        l = zd;
        break;
      default:
        l = No;
    }
    r = l.bind(null, t, r, e), l = void 0, !yo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), n ? l !== void 0 ? e.addEventListener(t, r, { capture: !0, passive: l }) : e.addEventListener(t, r, !0) : l !== void 0 ? e.addEventListener(t, r, { passive: l }) : e.addEventListener(t, r, !1);
  }
  function Wo(e, t, r, n, l) {
    var o = n;
    if ((t & 1) === 0 && (t & 2) === 0 && n !== null) e: for (; ; ) {
      if (n === null) return;
      var a = n.tag;
      if (a === 3 || a === 4) {
        var c = n.stateNode.containerInfo;
        if (c === l || c.nodeType === 8 && c.parentNode === l) break;
        if (a === 4) for (a = n.return; a !== null; ) {
          var p = a.tag;
          if ((p === 3 || p === 4) && (p = a.stateNode.containerInfo, p === l || p.nodeType === 8 && p.parentNode === l)) return;
          a = a.return;
        }
        for (; c !== null; ) {
          if (a = dr(c), a === null) return;
          if (p = a.tag, p === 5 || p === 6) {
            n = o = a;
            continue e;
          }
          c = c.parentNode;
        }
      }
      n = n.return;
    }
    Da(function() {
      var k = o, E = go(r), M = [];
      e: {
        var j = zs.get(e);
        if (j !== void 0) {
          var O = Mo, F = e;
          switch (e) {
            case "keypress":
              if (sl(r) === 0) break e;
            case "keydown":
            case "keyup":
              O = Vd;
              break;
            case "focusin":
              F = "focus", O = To;
              break;
            case "focusout":
              F = "blur", O = To;
              break;
            case "beforeblur":
            case "afterblur":
              O = To;
              break;
            case "click":
              if (r.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              O = ls;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              O = Pd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              O = Qd;
              break;
            case js:
            case Cs:
            case Es:
              O = Rd;
              break;
            case Ns:
              O = Kd;
              break;
            case "scroll":
              O = _d;
              break;
            case "wheel":
              O = Yd;
              break;
            case "copy":
            case "cut":
            case "paste":
              O = Od;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              O = is;
          }
          var U = (t & 4) !== 0, Ne = !U && e === "scroll", x = U ? j !== null ? j + "Capture" : null : j;
          U = [];
          for (var f = k, y; f !== null; ) {
            y = f;
            var L = y.stateNode;
            if (y.tag === 5 && L !== null && (y = L, x !== null && (L = nn(f, x), L != null && U.push(Sn(f, L, y)))), Ne) break;
            f = f.return;
          }
          0 < U.length && (j = new O(j, F, null, r, E), M.push({ event: j, listeners: U }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (j = e === "mouseover" || e === "pointerover", O = e === "mouseout" || e === "pointerout", j && r !== ho && (F = r.relatedTarget || r.fromElement) && (dr(F) || F[zt])) break e;
          if ((O || j) && (j = E.window === E ? E : (j = E.ownerDocument) ? j.defaultView || j.parentWindow : window, O ? (F = r.relatedTarget || r.toElement, O = k, F = F ? dr(F) : null, F !== null && (Ne = cr(F), F !== Ne || F.tag !== 5 && F.tag !== 6) && (F = null)) : (O = null, F = k), O !== F)) {
            if (U = ls, L = "onMouseLeave", x = "onMouseEnter", f = "mouse", (e === "pointerout" || e === "pointerover") && (U = is, L = "onPointerLeave", x = "onPointerEnter", f = "pointer"), Ne = O == null ? j : Ir(O), y = F == null ? j : Ir(F), j = new U(L, f + "leave", O, r, E), j.target = Ne, j.relatedTarget = y, L = null, dr(E) === k && (U = new U(x, f + "enter", F, r, E), U.target = y, U.relatedTarget = Ne, L = U), Ne = L, O && F) t: {
              for (U = O, x = F, f = 0, y = U; y; y = Tr(y)) f++;
              for (y = 0, L = x; L; L = Tr(L)) y++;
              for (; 0 < f - y; ) U = Tr(U), f--;
              for (; 0 < y - f; ) x = Tr(x), y--;
              for (; f--; ) {
                if (U === x || x !== null && U === x.alternate) break t;
                U = Tr(U), x = Tr(x);
              }
              U = null;
            }
            else U = null;
            O !== null && Ts(M, j, O, U, !1), F !== null && Ne !== null && Ts(M, Ne, F, U, !0);
          }
        }
        e: {
          if (j = k ? Ir(k) : window, O = j.nodeName && j.nodeName.toLowerCase(), O === "select" || O === "input" && j.type === "file") var H = np;
          else if (ps(j)) if (ms) H = ap;
          else {
            H = op;
            var q = lp;
          }
          else (O = j.nodeName) && O.toLowerCase() === "input" && (j.type === "checkbox" || j.type === "radio") && (H = ip);
          if (H && (H = H(e, k))) {
            fs(M, H, r, E);
            break e;
          }
          q && q(e, j, k), e === "focusout" && (q = j._wrapperState) && q.controlled && j.type === "number" && uo(j, "number", j.value);
        }
        switch (q = k ? Ir(k) : window, e) {
          case "focusin":
            (ps(q) || q.contentEditable === "true") && (Pr = q, Fo = k, wn = null);
            break;
          case "focusout":
            wn = Fo = Pr = null;
            break;
          case "mousedown":
            $o = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            $o = !1, bs(M, r, E);
            break;
          case "selectionchange":
            if (cp) break;
          case "keydown":
          case "keyup":
            bs(M, r, E);
        }
        var K;
        if (Io) e: {
          switch (e) {
            case "compositionstart":
              var X = "onCompositionStart";
              break e;
            case "compositionend":
              X = "onCompositionEnd";
              break e;
            case "compositionupdate":
              X = "onCompositionUpdate";
              break e;
          }
          X = void 0;
        }
        else Mr ? cs(e, r) && (X = "onCompositionEnd") : e === "keydown" && r.keyCode === 229 && (X = "onCompositionStart");
        X && (as && r.locale !== "ko" && (Mr || X !== "onCompositionStart" ? X === "onCompositionEnd" && Mr && (K = rs()) : (Wt = E, _o = "value" in Wt ? Wt.value : Wt.textContent, Mr = !0)), q = hl(k, X), 0 < q.length && (X = new os(X, e, null, r, E), M.push({ event: X, listeners: q }), K ? X.data = K : (K = ds(r), K !== null && (X.data = K)))), (K = Zd ? Jd(e, r) : ep(e, r)) && (k = hl(k, "onBeforeInput"), 0 < k.length && (E = new os("onBeforeInput", "beforeinput", null, r, E), M.push({ event: E, listeners: k }), E.data = K));
      }
      Ps(M, t);
    });
  }
  function Sn(e, t, r) {
    return { instance: e, listener: t, currentTarget: r };
  }
  function hl(e, t) {
    for (var r = t + "Capture", n = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = nn(e, r), o != null && n.unshift(Sn(e, o, l)), o = nn(e, t), o != null && n.push(Sn(e, o, l))), e = e.return;
    }
    return n;
  }
  function Tr(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Ts(e, t, r, n, l) {
    for (var o = t._reactName, a = []; r !== null && r !== n; ) {
      var c = r, p = c.alternate, k = c.stateNode;
      if (p !== null && p === n) break;
      c.tag === 5 && k !== null && (c = k, l ? (p = nn(r, o), p != null && a.unshift(Sn(r, p, c))) : l || (p = nn(r, o), p != null && a.push(Sn(r, p, c)))), r = r.return;
    }
    a.length !== 0 && e.push({ event: t, listeners: a });
  }
  var mp = /\r\n?/g, hp = /\u0000|\uFFFD/g;
  function Rs(e) {
    return (typeof e == "string" ? e : "" + e).replace(mp, `
`).replace(hp, "");
  }
  function gl(e, t, r) {
    if (t = Rs(t), Rs(e) !== t && r) throw Error(u(425));
  }
  function xl() {
  }
  var Qo = null, qo = null;
  function Ko(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Go = typeof setTimeout == "function" ? setTimeout : void 0, gp = typeof clearTimeout == "function" ? clearTimeout : void 0, Is = typeof Promise == "function" ? Promise : void 0, xp = typeof queueMicrotask == "function" ? queueMicrotask : typeof Is < "u" ? function(e) {
    return Is.resolve(null).then(e).catch(vp);
  } : Go;
  function vp(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Yo(e, t) {
    var r = t, n = 0;
    do {
      var l = r.nextSibling;
      if (e.removeChild(r), l && l.nodeType === 8) if (r = l.data, r === "/$") {
        if (n === 0) {
          e.removeChild(l), fn(t);
          return;
        }
        n--;
      } else r !== "$" && r !== "$?" && r !== "$!" || n++;
      r = l;
    } while (r);
    fn(t);
  }
  function qt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function Os(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var r = e.data;
        if (r === "$" || r === "$!" || r === "$?") {
          if (t === 0) return e;
          t--;
        } else r === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Rr = Math.random().toString(36).slice(2), bt = "__reactFiber$" + Rr, jn = "__reactProps$" + Rr, zt = "__reactContainer$" + Rr, Xo = "__reactEvents$" + Rr, yp = "__reactListeners$" + Rr, wp = "__reactHandles$" + Rr;
  function dr(e) {
    var t = e[bt];
    if (t) return t;
    for (var r = e.parentNode; r; ) {
      if (t = r[zt] || r[bt]) {
        if (r = t.alternate, t.child !== null || r !== null && r.child !== null) for (e = Os(e); e !== null; ) {
          if (r = e[bt]) return r;
          e = Os(e);
        }
        return t;
      }
      e = r, r = e.parentNode;
    }
    return null;
  }
  function Cn(e) {
    return e = e[bt] || e[zt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Ir(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(u(33));
  }
  function vl(e) {
    return e[jn] || null;
  }
  var Zo = [], Or = -1;
  function Kt(e) {
    return { current: e };
  }
  function xe(e) {
    0 > Or || (e.current = Zo[Or], Zo[Or] = null, Or--);
  }
  function me(e, t) {
    Or++, Zo[Or] = e.current, e.current = t;
  }
  var Gt = {}, He = Kt(Gt), Ke = Kt(!1), pr = Gt;
  function Dr(e, t) {
    var r = e.type.contextTypes;
    if (!r) return Gt;
    var n = e.stateNode;
    if (n && n.__reactInternalMemoizedUnmaskedChildContext === t) return n.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in r) l[o] = t[o];
    return n && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ge(e) {
    return e = e.childContextTypes, e != null;
  }
  function yl() {
    xe(Ke), xe(He);
  }
  function Ds(e, t, r) {
    if (He.current !== Gt) throw Error(u(168));
    me(He, t), me(Ke, r);
  }
  function As(e, t, r) {
    var n = e.stateNode;
    if (t = t.childContextTypes, typeof n.getChildContext != "function") return r;
    n = n.getChildContext();
    for (var l in n) if (!(l in t)) throw Error(u(108, fe(e) || "Unknown", l));
    return D({}, r, n);
  }
  function wl(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Gt, pr = He.current, me(He, e), me(Ke, Ke.current), !0;
  }
  function Fs(e, t, r) {
    var n = e.stateNode;
    if (!n) throw Error(u(169));
    r ? (e = As(e, t, pr), n.__reactInternalMemoizedMergedChildContext = e, xe(Ke), xe(He), me(He, e)) : xe(Ke), me(Ke, r);
  }
  var _t = null, kl = !1, Jo = !1;
  function $s(e) {
    _t === null ? _t = [e] : _t.push(e);
  }
  function kp(e) {
    kl = !0, $s(e);
  }
  function Yt() {
    if (!Jo && _t !== null) {
      Jo = !0;
      var e = 0, t = pe;
      try {
        var r = _t;
        for (pe = 1; e < r.length; e++) {
          var n = r[e];
          do
            n = n(!0);
          while (n !== null);
        }
        _t = null, kl = !1;
      } catch (l) {
        throw _t !== null && (_t = _t.slice(e + 1)), Ha(ko, Yt), l;
      } finally {
        pe = t, Jo = !1;
      }
    }
    return null;
  }
  var Ar = [], Fr = 0, bl = null, Sl = 0, it = [], at = 0, fr = null, Mt = 1, Pt = "";
  function mr(e, t) {
    Ar[Fr++] = Sl, Ar[Fr++] = bl, bl = e, Sl = t;
  }
  function Us(e, t, r) {
    it[at++] = Mt, it[at++] = Pt, it[at++] = fr, fr = e;
    var n = Mt;
    e = Pt;
    var l = 32 - pt(n) - 1;
    n &= ~(1 << l), r += 1;
    var o = 32 - pt(t) + l;
    if (30 < o) {
      var a = l - l % 5;
      o = (n & (1 << a) - 1).toString(32), n >>= a, l -= a, Mt = 1 << 32 - pt(t) + l | r << l | n, Pt = o + e;
    } else Mt = 1 << o | r << l | n, Pt = e;
  }
  function ei(e) {
    e.return !== null && (mr(e, 1), Us(e, 1, 0));
  }
  function ti(e) {
    for (; e === bl; ) bl = Ar[--Fr], Ar[Fr] = null, Sl = Ar[--Fr], Ar[Fr] = null;
    for (; e === fr; ) fr = it[--at], it[at] = null, Pt = it[--at], it[at] = null, Mt = it[--at], it[at] = null;
  }
  var nt = null, lt = null, be = !1, mt = null;
  function Hs(e, t) {
    var r = dt(5, null, null, 0);
    r.elementType = "DELETED", r.stateNode = t, r.return = e, t = e.deletions, t === null ? (e.deletions = [r], e.flags |= 16) : t.push(r);
  }
  function Vs(e, t) {
    switch (e.tag) {
      case 5:
        var r = e.type;
        return t = t.nodeType !== 1 || r.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, nt = e, lt = qt(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, nt = e, lt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (r = fr !== null ? { id: Mt, overflow: Pt } : null, e.memoizedState = { dehydrated: t, treeContext: r, retryLane: 1073741824 }, r = dt(18, null, null, 0), r.stateNode = t, r.return = e, e.child = r, nt = e, lt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function ri(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function ni(e) {
    if (be) {
      var t = lt;
      if (t) {
        var r = t;
        if (!Vs(e, t)) {
          if (ri(e)) throw Error(u(418));
          t = qt(r.nextSibling);
          var n = nt;
          t && Vs(e, t) ? Hs(n, r) : (e.flags = e.flags & -4097 | 2, be = !1, nt = e);
        }
      } else {
        if (ri(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, be = !1, nt = e;
      }
    }
  }
  function Bs(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    nt = e;
  }
  function jl(e) {
    if (e !== nt) return !1;
    if (!be) return Bs(e), be = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Ko(e.type, e.memoizedProps)), t && (t = lt)) {
      if (ri(e)) throw Ws(), Error(u(418));
      for (; t; ) Hs(e, t), t = qt(t.nextSibling);
    }
    if (Bs(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var r = e.data;
            if (r === "/$") {
              if (t === 0) {
                lt = qt(e.nextSibling);
                break e;
              }
              t--;
            } else r !== "$" && r !== "$!" && r !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        lt = null;
      }
    } else lt = nt ? qt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ws() {
    for (var e = lt; e; ) e = qt(e.nextSibling);
  }
  function $r() {
    lt = nt = null, be = !1;
  }
  function li(e) {
    mt === null ? mt = [e] : mt.push(e);
  }
  var bp = Y.ReactCurrentBatchConfig;
  function En(e, t, r) {
    if (e = r.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (r._owner) {
        if (r = r._owner, r) {
          if (r.tag !== 1) throw Error(u(309));
          var n = r.stateNode;
        }
        if (!n) throw Error(u(147, e));
        var l = n, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(a) {
          var c = l.refs;
          a === null ? delete c[o] : c[o] = a;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(u(284));
      if (!r._owner) throw Error(u(290, e));
    }
    return e;
  }
  function Cl(e, t) {
    throw e = Object.prototype.toString.call(t), Error(u(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Qs(e) {
    var t = e._init;
    return t(e._payload);
  }
  function qs(e) {
    function t(x, f) {
      if (e) {
        var y = x.deletions;
        y === null ? (x.deletions = [f], x.flags |= 16) : y.push(f);
      }
    }
    function r(x, f) {
      if (!e) return null;
      for (; f !== null; ) t(x, f), f = f.sibling;
      return null;
    }
    function n(x, f) {
      for (x = /* @__PURE__ */ new Map(); f !== null; ) f.key !== null ? x.set(f.key, f) : x.set(f.index, f), f = f.sibling;
      return x;
    }
    function l(x, f) {
      return x = lr(x, f), x.index = 0, x.sibling = null, x;
    }
    function o(x, f, y) {
      return x.index = y, e ? (y = x.alternate, y !== null ? (y = y.index, y < f ? (x.flags |= 2, f) : y) : (x.flags |= 2, f)) : (x.flags |= 1048576, f);
    }
    function a(x) {
      return e && x.alternate === null && (x.flags |= 2), x;
    }
    function c(x, f, y, L) {
      return f === null || f.tag !== 6 ? (f = Gi(y, x.mode, L), f.return = x, f) : (f = l(f, y), f.return = x, f);
    }
    function p(x, f, y, L) {
      var H = y.type;
      return H === ye ? E(x, f, y.props.children, L, y.key) : f !== null && (f.elementType === H || typeof H == "object" && H !== null && H.$$typeof === Me && Qs(H) === f.type) ? (L = l(f, y.props), L.ref = En(x, f, y), L.return = x, L) : (L = Gl(y.type, y.key, y.props, null, x.mode, L), L.ref = En(x, f, y), L.return = x, L);
    }
    function k(x, f, y, L) {
      return f === null || f.tag !== 4 || f.stateNode.containerInfo !== y.containerInfo || f.stateNode.implementation !== y.implementation ? (f = Yi(y, x.mode, L), f.return = x, f) : (f = l(f, y.children || []), f.return = x, f);
    }
    function E(x, f, y, L, H) {
      return f === null || f.tag !== 7 ? (f = br(y, x.mode, L, H), f.return = x, f) : (f = l(f, y), f.return = x, f);
    }
    function M(x, f, y) {
      if (typeof f == "string" && f !== "" || typeof f == "number") return f = Gi("" + f, x.mode, y), f.return = x, f;
      if (typeof f == "object" && f !== null) {
        switch (f.$$typeof) {
          case oe:
            return y = Gl(f.type, f.key, f.props, null, x.mode, y), y.ref = En(x, null, f), y.return = x, y;
          case J:
            return f = Yi(f, x.mode, y), f.return = x, f;
          case Me:
            var L = f._init;
            return M(x, L(f._payload), y);
        }
        if (en(f) || B(f)) return f = br(f, x.mode, y, null), f.return = x, f;
        Cl(x, f);
      }
      return null;
    }
    function j(x, f, y, L) {
      var H = f !== null ? f.key : null;
      if (typeof y == "string" && y !== "" || typeof y == "number") return H !== null ? null : c(x, f, "" + y, L);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case oe:
            return y.key === H ? p(x, f, y, L) : null;
          case J:
            return y.key === H ? k(x, f, y, L) : null;
          case Me:
            return H = y._init, j(
              x,
              f,
              H(y._payload),
              L
            );
        }
        if (en(y) || B(y)) return H !== null ? null : E(x, f, y, L, null);
        Cl(x, y);
      }
      return null;
    }
    function O(x, f, y, L, H) {
      if (typeof L == "string" && L !== "" || typeof L == "number") return x = x.get(y) || null, c(f, x, "" + L, H);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case oe:
            return x = x.get(L.key === null ? y : L.key) || null, p(f, x, L, H);
          case J:
            return x = x.get(L.key === null ? y : L.key) || null, k(f, x, L, H);
          case Me:
            var q = L._init;
            return O(x, f, y, q(L._payload), H);
        }
        if (en(L) || B(L)) return x = x.get(y) || null, E(f, x, L, H, null);
        Cl(f, L);
      }
      return null;
    }
    function F(x, f, y, L) {
      for (var H = null, q = null, K = f, X = f = 0, Ie = null; K !== null && X < y.length; X++) {
        K.index > X ? (Ie = K, K = null) : Ie = K.sibling;
        var ue = j(x, K, y[X], L);
        if (ue === null) {
          K === null && (K = Ie);
          break;
        }
        e && K && ue.alternate === null && t(x, K), f = o(ue, f, X), q === null ? H = ue : q.sibling = ue, q = ue, K = Ie;
      }
      if (X === y.length) return r(x, K), be && mr(x, X), H;
      if (K === null) {
        for (; X < y.length; X++) K = M(x, y[X], L), K !== null && (f = o(K, f, X), q === null ? H = K : q.sibling = K, q = K);
        return be && mr(x, X), H;
      }
      for (K = n(x, K); X < y.length; X++) Ie = O(K, x, X, y[X], L), Ie !== null && (e && Ie.alternate !== null && K.delete(Ie.key === null ? X : Ie.key), f = o(Ie, f, X), q === null ? H = Ie : q.sibling = Ie, q = Ie);
      return e && K.forEach(function(or) {
        return t(x, or);
      }), be && mr(x, X), H;
    }
    function U(x, f, y, L) {
      var H = B(y);
      if (typeof H != "function") throw Error(u(150));
      if (y = H.call(y), y == null) throw Error(u(151));
      for (var q = H = null, K = f, X = f = 0, Ie = null, ue = y.next(); K !== null && !ue.done; X++, ue = y.next()) {
        K.index > X ? (Ie = K, K = null) : Ie = K.sibling;
        var or = j(x, K, ue.value, L);
        if (or === null) {
          K === null && (K = Ie);
          break;
        }
        e && K && or.alternate === null && t(x, K), f = o(or, f, X), q === null ? H = or : q.sibling = or, q = or, K = Ie;
      }
      if (ue.done) return r(
        x,
        K
      ), be && mr(x, X), H;
      if (K === null) {
        for (; !ue.done; X++, ue = y.next()) ue = M(x, ue.value, L), ue !== null && (f = o(ue, f, X), q === null ? H = ue : q.sibling = ue, q = ue);
        return be && mr(x, X), H;
      }
      for (K = n(x, K); !ue.done; X++, ue = y.next()) ue = O(K, x, X, ue.value, L), ue !== null && (e && ue.alternate !== null && K.delete(ue.key === null ? X : ue.key), f = o(ue, f, X), q === null ? H = ue : q.sibling = ue, q = ue);
      return e && K.forEach(function(tf) {
        return t(x, tf);
      }), be && mr(x, X), H;
    }
    function Ne(x, f, y, L) {
      if (typeof y == "object" && y !== null && y.type === ye && y.key === null && (y = y.props.children), typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case oe:
            e: {
              for (var H = y.key, q = f; q !== null; ) {
                if (q.key === H) {
                  if (H = y.type, H === ye) {
                    if (q.tag === 7) {
                      r(x, q.sibling), f = l(q, y.props.children), f.return = x, x = f;
                      break e;
                    }
                  } else if (q.elementType === H || typeof H == "object" && H !== null && H.$$typeof === Me && Qs(H) === q.type) {
                    r(x, q.sibling), f = l(q, y.props), f.ref = En(x, q, y), f.return = x, x = f;
                    break e;
                  }
                  r(x, q);
                  break;
                } else t(x, q);
                q = q.sibling;
              }
              y.type === ye ? (f = br(y.props.children, x.mode, L, y.key), f.return = x, x = f) : (L = Gl(y.type, y.key, y.props, null, x.mode, L), L.ref = En(x, f, y), L.return = x, x = L);
            }
            return a(x);
          case J:
            e: {
              for (q = y.key; f !== null; ) {
                if (f.key === q) if (f.tag === 4 && f.stateNode.containerInfo === y.containerInfo && f.stateNode.implementation === y.implementation) {
                  r(x, f.sibling), f = l(f, y.children || []), f.return = x, x = f;
                  break e;
                } else {
                  r(x, f);
                  break;
                }
                else t(x, f);
                f = f.sibling;
              }
              f = Yi(y, x.mode, L), f.return = x, x = f;
            }
            return a(x);
          case Me:
            return q = y._init, Ne(x, f, q(y._payload), L);
        }
        if (en(y)) return F(x, f, y, L);
        if (B(y)) return U(x, f, y, L);
        Cl(x, y);
      }
      return typeof y == "string" && y !== "" || typeof y == "number" ? (y = "" + y, f !== null && f.tag === 6 ? (r(x, f.sibling), f = l(f, y), f.return = x, x = f) : (r(x, f), f = Gi(y, x.mode, L), f.return = x, x = f), a(x)) : r(x, f);
    }
    return Ne;
  }
  var Ur = qs(!0), Ks = qs(!1), El = Kt(null), Nl = null, Hr = null, oi = null;
  function ii() {
    oi = Hr = Nl = null;
  }
  function ai(e) {
    var t = El.current;
    xe(El), e._currentValue = t;
  }
  function si(e, t, r) {
    for (; e !== null; ) {
      var n = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, n !== null && (n.childLanes |= t)) : n !== null && (n.childLanes & t) !== t && (n.childLanes |= t), e === r) break;
      e = e.return;
    }
  }
  function Vr(e, t) {
    Nl = e, oi = Hr = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ye = !0), e.firstContext = null);
  }
  function st(e) {
    var t = e._currentValue;
    if (oi !== e) if (e = { context: e, memoizedValue: t, next: null }, Hr === null) {
      if (Nl === null) throw Error(u(308));
      Hr = e, Nl.dependencies = { lanes: 0, firstContext: e };
    } else Hr = Hr.next = e;
    return t;
  }
  var hr = null;
  function ui(e) {
    hr === null ? hr = [e] : hr.push(e);
  }
  function Gs(e, t, r, n) {
    var l = t.interleaved;
    return l === null ? (r.next = r, ui(t)) : (r.next = l.next, l.next = r), t.interleaved = r, Lt(e, n);
  }
  function Lt(e, t) {
    e.lanes |= t;
    var r = e.alternate;
    for (r !== null && (r.lanes |= t), r = e, e = e.return; e !== null; ) e.childLanes |= t, r = e.alternate, r !== null && (r.childLanes |= t), r = e, e = e.return;
    return r.tag === 3 ? r.stateNode : null;
  }
  var Xt = !1;
  function ci(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Ys(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Tt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Zt(e, t, r) {
    var n = e.updateQueue;
    if (n === null) return null;
    if (n = n.shared, (ie & 2) !== 0) {
      var l = n.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), n.pending = t, Lt(e, r);
    }
    return l = n.interleaved, l === null ? (t.next = t, ui(n)) : (t.next = l.next, l.next = t), n.interleaved = t, Lt(e, r);
  }
  function zl(e, t, r) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (r & 4194240) !== 0)) {
      var n = t.lanes;
      n &= e.pendingLanes, r |= n, t.lanes = r, jo(e, r);
    }
  }
  function Xs(e, t) {
    var r = e.updateQueue, n = e.alternate;
    if (n !== null && (n = n.updateQueue, r === n)) {
      var l = null, o = null;
      if (r = r.firstBaseUpdate, r !== null) {
        do {
          var a = { eventTime: r.eventTime, lane: r.lane, tag: r.tag, payload: r.payload, callback: r.callback, next: null };
          o === null ? l = o = a : o = o.next = a, r = r.next;
        } while (r !== null);
        o === null ? l = o = t : o = o.next = t;
      } else l = o = t;
      r = { baseState: n.baseState, firstBaseUpdate: l, lastBaseUpdate: o, shared: n.shared, effects: n.effects }, e.updateQueue = r;
      return;
    }
    e = r.lastBaseUpdate, e === null ? r.firstBaseUpdate = t : e.next = t, r.lastBaseUpdate = t;
  }
  function _l(e, t, r, n) {
    var l = e.updateQueue;
    Xt = !1;
    var o = l.firstBaseUpdate, a = l.lastBaseUpdate, c = l.shared.pending;
    if (c !== null) {
      l.shared.pending = null;
      var p = c, k = p.next;
      p.next = null, a === null ? o = k : a.next = k, a = p;
      var E = e.alternate;
      E !== null && (E = E.updateQueue, c = E.lastBaseUpdate, c !== a && (c === null ? E.firstBaseUpdate = k : c.next = k, E.lastBaseUpdate = p));
    }
    if (o !== null) {
      var M = l.baseState;
      a = 0, E = k = p = null, c = o;
      do {
        var j = c.lane, O = c.eventTime;
        if ((n & j) === j) {
          E !== null && (E = E.next = {
            eventTime: O,
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null
          });
          e: {
            var F = e, U = c;
            switch (j = t, O = r, U.tag) {
              case 1:
                if (F = U.payload, typeof F == "function") {
                  M = F.call(O, M, j);
                  break e;
                }
                M = F;
                break e;
              case 3:
                F.flags = F.flags & -65537 | 128;
              case 0:
                if (F = U.payload, j = typeof F == "function" ? F.call(O, M, j) : F, j == null) break e;
                M = D({}, M, j);
                break e;
              case 2:
                Xt = !0;
            }
          }
          c.callback !== null && c.lane !== 0 && (e.flags |= 64, j = l.effects, j === null ? l.effects = [c] : j.push(c));
        } else O = { eventTime: O, lane: j, tag: c.tag, payload: c.payload, callback: c.callback, next: null }, E === null ? (k = E = O, p = M) : E = E.next = O, a |= j;
        if (c = c.next, c === null) {
          if (c = l.shared.pending, c === null) break;
          j = c, c = j.next, j.next = null, l.lastBaseUpdate = j, l.shared.pending = null;
        }
      } while (!0);
      if (E === null && (p = M), l.baseState = p, l.firstBaseUpdate = k, l.lastBaseUpdate = E, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          a |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      vr |= a, e.lanes = a, e.memoizedState = M;
    }
  }
  function Zs(e, t, r) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var n = e[t], l = n.callback;
      if (l !== null) {
        if (n.callback = null, n = r, typeof l != "function") throw Error(u(191, l));
        l.call(n);
      }
    }
  }
  var Nn = {}, St = Kt(Nn), zn = Kt(Nn), _n = Kt(Nn);
  function gr(e) {
    if (e === Nn) throw Error(u(174));
    return e;
  }
  function di(e, t) {
    switch (me(_n, t), me(zn, e), me(St, Nn), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : po(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = po(t, e);
    }
    xe(St), me(St, t);
  }
  function Br() {
    xe(St), xe(zn), xe(_n);
  }
  function Js(e) {
    gr(_n.current);
    var t = gr(St.current), r = po(t, e.type);
    t !== r && (me(zn, e), me(St, r));
  }
  function pi(e) {
    zn.current === e && (xe(St), xe(zn));
  }
  var Se = Kt(0);
  function Ml(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var r = t.memoizedState;
        if (r !== null && (r = r.dehydrated, r === null || r.data === "$?" || r.data === "$!")) return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var fi = [];
  function mi() {
    for (var e = 0; e < fi.length; e++) fi[e]._workInProgressVersionPrimary = null;
    fi.length = 0;
  }
  var Pl = Y.ReactCurrentDispatcher, hi = Y.ReactCurrentBatchConfig, xr = 0, je = null, Pe = null, Te = null, Ll = !1, Mn = !1, Pn = 0, Sp = 0;
  function Ve() {
    throw Error(u(321));
  }
  function gi(e, t) {
    if (t === null) return !1;
    for (var r = 0; r < t.length && r < e.length; r++) if (!ft(e[r], t[r])) return !1;
    return !0;
  }
  function xi(e, t, r, n, l, o) {
    if (xr = o, je = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Pl.current = e === null || e.memoizedState === null ? Np : zp, e = r(n, l), Mn) {
      o = 0;
      do {
        if (Mn = !1, Pn = 0, 25 <= o) throw Error(u(301));
        o += 1, Te = Pe = null, t.updateQueue = null, Pl.current = _p, e = r(n, l);
      } while (Mn);
    }
    if (Pl.current = Il, t = Pe !== null && Pe.next !== null, xr = 0, Te = Pe = je = null, Ll = !1, t) throw Error(u(300));
    return e;
  }
  function vi() {
    var e = Pn !== 0;
    return Pn = 0, e;
  }
  function jt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Te === null ? je.memoizedState = Te = e : Te = Te.next = e, Te;
  }
  function ut() {
    if (Pe === null) {
      var e = je.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Pe.next;
    var t = Te === null ? je.memoizedState : Te.next;
    if (t !== null) Te = t, Pe = e;
    else {
      if (e === null) throw Error(u(310));
      Pe = e, e = { memoizedState: Pe.memoizedState, baseState: Pe.baseState, baseQueue: Pe.baseQueue, queue: Pe.queue, next: null }, Te === null ? je.memoizedState = Te = e : Te = Te.next = e;
    }
    return Te;
  }
  function Ln(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function yi(e) {
    var t = ut(), r = t.queue;
    if (r === null) throw Error(u(311));
    r.lastRenderedReducer = e;
    var n = Pe, l = n.baseQueue, o = r.pending;
    if (o !== null) {
      if (l !== null) {
        var a = l.next;
        l.next = o.next, o.next = a;
      }
      n.baseQueue = l = o, r.pending = null;
    }
    if (l !== null) {
      o = l.next, n = n.baseState;
      var c = a = null, p = null, k = o;
      do {
        var E = k.lane;
        if ((xr & E) === E) p !== null && (p = p.next = { lane: 0, action: k.action, hasEagerState: k.hasEagerState, eagerState: k.eagerState, next: null }), n = k.hasEagerState ? k.eagerState : e(n, k.action);
        else {
          var M = {
            lane: E,
            action: k.action,
            hasEagerState: k.hasEagerState,
            eagerState: k.eagerState,
            next: null
          };
          p === null ? (c = p = M, a = n) : p = p.next = M, je.lanes |= E, vr |= E;
        }
        k = k.next;
      } while (k !== null && k !== o);
      p === null ? a = n : p.next = c, ft(n, t.memoizedState) || (Ye = !0), t.memoizedState = n, t.baseState = a, t.baseQueue = p, r.lastRenderedState = n;
    }
    if (e = r.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, je.lanes |= o, vr |= o, l = l.next;
      while (l !== e);
    } else l === null && (r.lanes = 0);
    return [t.memoizedState, r.dispatch];
  }
  function wi(e) {
    var t = ut(), r = t.queue;
    if (r === null) throw Error(u(311));
    r.lastRenderedReducer = e;
    var n = r.dispatch, l = r.pending, o = t.memoizedState;
    if (l !== null) {
      r.pending = null;
      var a = l = l.next;
      do
        o = e(o, a.action), a = a.next;
      while (a !== l);
      ft(o, t.memoizedState) || (Ye = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), r.lastRenderedState = o;
    }
    return [o, n];
  }
  function eu() {
  }
  function tu(e, t) {
    var r = je, n = ut(), l = t(), o = !ft(n.memoizedState, l);
    if (o && (n.memoizedState = l, Ye = !0), n = n.queue, ki(lu.bind(null, r, n, e), [e]), n.getSnapshot !== t || o || Te !== null && Te.memoizedState.tag & 1) {
      if (r.flags |= 2048, Tn(9, nu.bind(null, r, n, l, t), void 0, null), Re === null) throw Error(u(349));
      (xr & 30) !== 0 || ru(r, t, l);
    }
    return l;
  }
  function ru(e, t, r) {
    e.flags |= 16384, e = { getSnapshot: t, value: r }, t = je.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, je.updateQueue = t, t.stores = [e]) : (r = t.stores, r === null ? t.stores = [e] : r.push(e));
  }
  function nu(e, t, r, n) {
    t.value = r, t.getSnapshot = n, ou(t) && iu(e);
  }
  function lu(e, t, r) {
    return r(function() {
      ou(t) && iu(e);
    });
  }
  function ou(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var r = t();
      return !ft(e, r);
    } catch {
      return !0;
    }
  }
  function iu(e) {
    var t = Lt(e, 1);
    t !== null && vt(t, e, 1, -1);
  }
  function au(e) {
    var t = jt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Ln, lastRenderedState: e }, t.queue = e, e = e.dispatch = Ep.bind(null, je, e), [t.memoizedState, e];
  }
  function Tn(e, t, r, n) {
    return e = { tag: e, create: t, destroy: r, deps: n, next: null }, t = je.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, je.updateQueue = t, t.lastEffect = e.next = e) : (r = t.lastEffect, r === null ? t.lastEffect = e.next = e : (n = r.next, r.next = e, e.next = n, t.lastEffect = e)), e;
  }
  function su() {
    return ut().memoizedState;
  }
  function Tl(e, t, r, n) {
    var l = jt();
    je.flags |= e, l.memoizedState = Tn(1 | t, r, void 0, n === void 0 ? null : n);
  }
  function Rl(e, t, r, n) {
    var l = ut();
    n = n === void 0 ? null : n;
    var o = void 0;
    if (Pe !== null) {
      var a = Pe.memoizedState;
      if (o = a.destroy, n !== null && gi(n, a.deps)) {
        l.memoizedState = Tn(t, r, o, n);
        return;
      }
    }
    je.flags |= e, l.memoizedState = Tn(1 | t, r, o, n);
  }
  function uu(e, t) {
    return Tl(8390656, 8, e, t);
  }
  function ki(e, t) {
    return Rl(2048, 8, e, t);
  }
  function cu(e, t) {
    return Rl(4, 2, e, t);
  }
  function du(e, t) {
    return Rl(4, 4, e, t);
  }
  function pu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function fu(e, t, r) {
    return r = r != null ? r.concat([e]) : null, Rl(4, 4, pu.bind(null, t, e), r);
  }
  function bi() {
  }
  function mu(e, t) {
    var r = ut();
    t = t === void 0 ? null : t;
    var n = r.memoizedState;
    return n !== null && t !== null && gi(t, n[1]) ? n[0] : (r.memoizedState = [e, t], e);
  }
  function hu(e, t) {
    var r = ut();
    t = t === void 0 ? null : t;
    var n = r.memoizedState;
    return n !== null && t !== null && gi(t, n[1]) ? n[0] : (e = e(), r.memoizedState = [e, t], e);
  }
  function gu(e, t, r) {
    return (xr & 21) === 0 ? (e.baseState && (e.baseState = !1, Ye = !0), e.memoizedState = r) : (ft(r, t) || (r = Qa(), je.lanes |= r, vr |= r, e.baseState = !0), t);
  }
  function jp(e, t) {
    var r = pe;
    pe = r !== 0 && 4 > r ? r : 4, e(!0);
    var n = hi.transition;
    hi.transition = {};
    try {
      e(!1), t();
    } finally {
      pe = r, hi.transition = n;
    }
  }
  function xu() {
    return ut().memoizedState;
  }
  function Cp(e, t, r) {
    var n = rr(e);
    if (r = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null }, vu(e)) yu(t, r);
    else if (r = Gs(e, t, r, n), r !== null) {
      var l = qe();
      vt(r, e, n, l), wu(r, t, n);
    }
  }
  function Ep(e, t, r) {
    var n = rr(e), l = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null };
    if (vu(e)) yu(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var a = t.lastRenderedState, c = o(a, r);
        if (l.hasEagerState = !0, l.eagerState = c, ft(c, a)) {
          var p = t.interleaved;
          p === null ? (l.next = l, ui(t)) : (l.next = p.next, p.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      r = Gs(e, t, l, n), r !== null && (l = qe(), vt(r, e, n, l), wu(r, t, n));
    }
  }
  function vu(e) {
    var t = e.alternate;
    return e === je || t !== null && t === je;
  }
  function yu(e, t) {
    Mn = Ll = !0;
    var r = e.pending;
    r === null ? t.next = t : (t.next = r.next, r.next = t), e.pending = t;
  }
  function wu(e, t, r) {
    if ((r & 4194240) !== 0) {
      var n = t.lanes;
      n &= e.pendingLanes, r |= n, t.lanes = r, jo(e, r);
    }
  }
  var Il = { readContext: st, useCallback: Ve, useContext: Ve, useEffect: Ve, useImperativeHandle: Ve, useInsertionEffect: Ve, useLayoutEffect: Ve, useMemo: Ve, useReducer: Ve, useRef: Ve, useState: Ve, useDebugValue: Ve, useDeferredValue: Ve, useTransition: Ve, useMutableSource: Ve, useSyncExternalStore: Ve, useId: Ve, unstable_isNewReconciler: !1 }, Np = { readContext: st, useCallback: function(e, t) {
    return jt().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: st, useEffect: uu, useImperativeHandle: function(e, t, r) {
    return r = r != null ? r.concat([e]) : null, Tl(
      4194308,
      4,
      pu.bind(null, t, e),
      r
    );
  }, useLayoutEffect: function(e, t) {
    return Tl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Tl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var r = jt();
    return t = t === void 0 ? null : t, e = e(), r.memoizedState = [e, t], e;
  }, useReducer: function(e, t, r) {
    var n = jt();
    return t = r !== void 0 ? r(t) : t, n.memoizedState = n.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, n.queue = e, e = e.dispatch = Cp.bind(null, je, e), [n.memoizedState, e];
  }, useRef: function(e) {
    var t = jt();
    return e = { current: e }, t.memoizedState = e;
  }, useState: au, useDebugValue: bi, useDeferredValue: function(e) {
    return jt().memoizedState = e;
  }, useTransition: function() {
    var e = au(!1), t = e[0];
    return e = jp.bind(null, e[1]), jt().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, r) {
    var n = je, l = jt();
    if (be) {
      if (r === void 0) throw Error(u(407));
      r = r();
    } else {
      if (r = t(), Re === null) throw Error(u(349));
      (xr & 30) !== 0 || ru(n, t, r);
    }
    l.memoizedState = r;
    var o = { value: r, getSnapshot: t };
    return l.queue = o, uu(lu.bind(
      null,
      n,
      o,
      e
    ), [e]), n.flags |= 2048, Tn(9, nu.bind(null, n, o, r, t), void 0, null), r;
  }, useId: function() {
    var e = jt(), t = Re.identifierPrefix;
    if (be) {
      var r = Pt, n = Mt;
      r = (n & ~(1 << 32 - pt(n) - 1)).toString(32) + r, t = ":" + t + "R" + r, r = Pn++, 0 < r && (t += "H" + r.toString(32)), t += ":";
    } else r = Sp++, t = ":" + t + "r" + r.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, zp = {
    readContext: st,
    useCallback: mu,
    useContext: st,
    useEffect: ki,
    useImperativeHandle: fu,
    useInsertionEffect: cu,
    useLayoutEffect: du,
    useMemo: hu,
    useReducer: yi,
    useRef: su,
    useState: function() {
      return yi(Ln);
    },
    useDebugValue: bi,
    useDeferredValue: function(e) {
      var t = ut();
      return gu(t, Pe.memoizedState, e);
    },
    useTransition: function() {
      var e = yi(Ln)[0], t = ut().memoizedState;
      return [e, t];
    },
    useMutableSource: eu,
    useSyncExternalStore: tu,
    useId: xu,
    unstable_isNewReconciler: !1
  }, _p = { readContext: st, useCallback: mu, useContext: st, useEffect: ki, useImperativeHandle: fu, useInsertionEffect: cu, useLayoutEffect: du, useMemo: hu, useReducer: wi, useRef: su, useState: function() {
    return wi(Ln);
  }, useDebugValue: bi, useDeferredValue: function(e) {
    var t = ut();
    return Pe === null ? t.memoizedState = e : gu(t, Pe.memoizedState, e);
  }, useTransition: function() {
    var e = wi(Ln)[0], t = ut().memoizedState;
    return [e, t];
  }, useMutableSource: eu, useSyncExternalStore: tu, useId: xu, unstable_isNewReconciler: !1 };
  function ht(e, t) {
    if (e && e.defaultProps) {
      t = D({}, t), e = e.defaultProps;
      for (var r in e) t[r] === void 0 && (t[r] = e[r]);
      return t;
    }
    return t;
  }
  function Si(e, t, r, n) {
    t = e.memoizedState, r = r(n, t), r = r == null ? t : D({}, t, r), e.memoizedState = r, e.lanes === 0 && (e.updateQueue.baseState = r);
  }
  var Ol = { isMounted: function(e) {
    return (e = e._reactInternals) ? cr(e) === e : !1;
  }, enqueueSetState: function(e, t, r) {
    e = e._reactInternals;
    var n = qe(), l = rr(e), o = Tt(n, l);
    o.payload = t, r != null && (o.callback = r), t = Zt(e, o, l), t !== null && (vt(t, e, l, n), zl(t, e, l));
  }, enqueueReplaceState: function(e, t, r) {
    e = e._reactInternals;
    var n = qe(), l = rr(e), o = Tt(n, l);
    o.tag = 1, o.payload = t, r != null && (o.callback = r), t = Zt(e, o, l), t !== null && (vt(t, e, l, n), zl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var r = qe(), n = rr(e), l = Tt(r, n);
    l.tag = 2, t != null && (l.callback = t), t = Zt(e, l, n), t !== null && (vt(t, e, n, r), zl(t, e, n));
  } };
  function ku(e, t, r, n, l, o, a) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(n, o, a) : t.prototype && t.prototype.isPureReactComponent ? !yn(r, n) || !yn(l, o) : !0;
  }
  function bu(e, t, r) {
    var n = !1, l = Gt, o = t.contextType;
    return typeof o == "object" && o !== null ? o = st(o) : (l = Ge(t) ? pr : He.current, n = t.contextTypes, o = (n = n != null) ? Dr(e, l) : Gt), t = new t(r, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Ol, e.stateNode = t, t._reactInternals = e, n && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function Su(e, t, r, n) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(r, n), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(r, n), t.state !== e && Ol.enqueueReplaceState(t, t.state, null);
  }
  function ji(e, t, r, n) {
    var l = e.stateNode;
    l.props = r, l.state = e.memoizedState, l.refs = {}, ci(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = st(o) : (o = Ge(t) ? pr : He.current, l.context = Dr(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (Si(e, t, o, r), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Ol.enqueueReplaceState(l, l.state, null), _l(e, r, l, n), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Wr(e, t) {
    try {
      var r = "", n = t;
      do
        r += ae(n), n = n.return;
      while (n);
      var l = r;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function Ci(e, t, r) {
    return { value: e, source: null, stack: r ?? null, digest: t ?? null };
  }
  function Ei(e, t) {
    try {
      console.error(t.value);
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  var Mp = typeof WeakMap == "function" ? WeakMap : Map;
  function ju(e, t, r) {
    r = Tt(-1, r), r.tag = 3, r.payload = { element: null };
    var n = t.value;
    return r.callback = function() {
      Vl || (Vl = !0, Ui = n), Ei(e, t);
    }, r;
  }
  function Cu(e, t, r) {
    r = Tt(-1, r), r.tag = 3;
    var n = e.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var l = t.value;
      r.payload = function() {
        return n(l);
      }, r.callback = function() {
        Ei(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (r.callback = function() {
      Ei(e, t), typeof n != "function" && (er === null ? er = /* @__PURE__ */ new Set([this]) : er.add(this));
      var a = t.stack;
      this.componentDidCatch(t.value, { componentStack: a !== null ? a : "" });
    }), r;
  }
  function Eu(e, t, r) {
    var n = e.pingCache;
    if (n === null) {
      n = e.pingCache = new Mp();
      var l = /* @__PURE__ */ new Set();
      n.set(t, l);
    } else l = n.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), n.set(t, l));
    l.has(r) || (l.add(r), e = Bp.bind(null, e, t, r), t.then(e, e));
  }
  function Nu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function zu(e, t, r, n, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, r.flags |= 131072, r.flags &= -52805, r.tag === 1 && (r.alternate === null ? r.tag = 17 : (t = Tt(-1, 1), t.tag = 2, Zt(r, t, 1))), r.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Pp = Y.ReactCurrentOwner, Ye = !1;
  function Qe(e, t, r, n) {
    t.child = e === null ? Ks(t, null, r, n) : Ur(t, e.child, r, n);
  }
  function _u(e, t, r, n, l) {
    r = r.render;
    var o = t.ref;
    return Vr(t, l), n = xi(e, t, r, n, o, l), r = vi(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (be && r && ei(t), t.flags |= 1, Qe(e, t, n, l), t.child);
  }
  function Mu(e, t, r, n, l) {
    if (e === null) {
      var o = r.type;
      return typeof o == "function" && !Ki(o) && o.defaultProps === void 0 && r.compare === null && r.defaultProps === void 0 ? (t.tag = 15, t.type = o, Pu(e, t, o, n, l)) : (e = Gl(r.type, null, n, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var a = o.memoizedProps;
      if (r = r.compare, r = r !== null ? r : yn, r(a, n) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = lr(o, n), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Pu(e, t, r, n, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (yn(o, n) && e.ref === t.ref) if (Ye = !1, t.pendingProps = n = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ye = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return Ni(e, t, r, n, l);
  }
  function Lu(e, t, r) {
    var n = t.pendingProps, l = n.children, o = e !== null ? e.memoizedState : null;
    if (n.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, me(qr, ot), ot |= r;
    else {
      if ((r & 1073741824) === 0) return e = o !== null ? o.baseLanes | r : r, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, me(qr, ot), ot |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, n = o !== null ? o.baseLanes : r, me(qr, ot), ot |= n;
    }
    else o !== null ? (n = o.baseLanes | r, t.memoizedState = null) : n = r, me(qr, ot), ot |= n;
    return Qe(e, t, l, r), t.child;
  }
  function Tu(e, t) {
    var r = t.ref;
    (e === null && r !== null || e !== null && e.ref !== r) && (t.flags |= 512, t.flags |= 2097152);
  }
  function Ni(e, t, r, n, l) {
    var o = Ge(r) ? pr : He.current;
    return o = Dr(t, o), Vr(t, l), r = xi(e, t, r, n, o, l), n = vi(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (be && n && ei(t), t.flags |= 1, Qe(e, t, r, l), t.child);
  }
  function Ru(e, t, r, n, l) {
    if (Ge(r)) {
      var o = !0;
      wl(t);
    } else o = !1;
    if (Vr(t, l), t.stateNode === null) Al(e, t), bu(t, r, n), ji(t, r, n, l), n = !0;
    else if (e === null) {
      var a = t.stateNode, c = t.memoizedProps;
      a.props = c;
      var p = a.context, k = r.contextType;
      typeof k == "object" && k !== null ? k = st(k) : (k = Ge(r) ? pr : He.current, k = Dr(t, k));
      var E = r.getDerivedStateFromProps, M = typeof E == "function" || typeof a.getSnapshotBeforeUpdate == "function";
      M || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (c !== n || p !== k) && Su(t, a, n, k), Xt = !1;
      var j = t.memoizedState;
      a.state = j, _l(t, n, a, l), p = t.memoizedState, c !== n || j !== p || Ke.current || Xt ? (typeof E == "function" && (Si(t, r, E, n), p = t.memoizedState), (c = Xt || ku(t, r, c, n, j, p, k)) ? (M || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = n, t.memoizedState = p), a.props = n, a.state = p, a.context = k, n = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), n = !1);
    } else {
      a = t.stateNode, Ys(e, t), c = t.memoizedProps, k = t.type === t.elementType ? c : ht(t.type, c), a.props = k, M = t.pendingProps, j = a.context, p = r.contextType, typeof p == "object" && p !== null ? p = st(p) : (p = Ge(r) ? pr : He.current, p = Dr(t, p));
      var O = r.getDerivedStateFromProps;
      (E = typeof O == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (c !== M || j !== p) && Su(t, a, n, p), Xt = !1, j = t.memoizedState, a.state = j, _l(t, n, a, l);
      var F = t.memoizedState;
      c !== M || j !== F || Ke.current || Xt ? (typeof O == "function" && (Si(t, r, O, n), F = t.memoizedState), (k = Xt || ku(t, r, k, n, j, F, p) || !1) ? (E || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(n, F, p), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(n, F, p)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || c === e.memoizedProps && j === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && j === e.memoizedState || (t.flags |= 1024), t.memoizedProps = n, t.memoizedState = F), a.props = n, a.state = F, a.context = p, n = k) : (typeof a.componentDidUpdate != "function" || c === e.memoizedProps && j === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && j === e.memoizedState || (t.flags |= 1024), n = !1);
    }
    return zi(e, t, r, n, o, l);
  }
  function zi(e, t, r, n, l, o) {
    Tu(e, t);
    var a = (t.flags & 128) !== 0;
    if (!n && !a) return l && Fs(t, r, !1), Rt(e, t, o);
    n = t.stateNode, Pp.current = t;
    var c = a && typeof r.getDerivedStateFromError != "function" ? null : n.render();
    return t.flags |= 1, e !== null && a ? (t.child = Ur(t, e.child, null, o), t.child = Ur(t, null, c, o)) : Qe(e, t, c, o), t.memoizedState = n.state, l && Fs(t, r, !0), t.child;
  }
  function Iu(e) {
    var t = e.stateNode;
    t.pendingContext ? Ds(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Ds(e, t.context, !1), di(e, t.containerInfo);
  }
  function Ou(e, t, r, n, l) {
    return $r(), li(l), t.flags |= 256, Qe(e, t, r, n), t.child;
  }
  var _i = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Mi(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Du(e, t, r) {
    var n = t.pendingProps, l = Se.current, o = !1, a = (t.flags & 128) !== 0, c;
    if ((c = a) || (c = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), c ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), me(Se, l & 1), e === null)
      return ni(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (a = n.children, e = n.fallback, o ? (n = t.mode, o = t.child, a = { mode: "hidden", children: a }, (n & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = a) : o = Yl(a, n, 0, null), e = br(e, n, r, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = Mi(r), t.memoizedState = _i, e) : Pi(t, a));
    if (l = e.memoizedState, l !== null && (c = l.dehydrated, c !== null)) return Lp(e, t, a, n, c, l, r);
    if (o) {
      o = n.fallback, a = t.mode, l = e.child, c = l.sibling;
      var p = { mode: "hidden", children: n.children };
      return (a & 1) === 0 && t.child !== l ? (n = t.child, n.childLanes = 0, n.pendingProps = p, t.deletions = null) : (n = lr(l, p), n.subtreeFlags = l.subtreeFlags & 14680064), c !== null ? o = lr(c, o) : (o = br(o, a, r, null), o.flags |= 2), o.return = t, n.return = t, n.sibling = o, t.child = n, n = o, o = t.child, a = e.child.memoizedState, a = a === null ? Mi(r) : { baseLanes: a.baseLanes | r, cachePool: null, transitions: a.transitions }, o.memoizedState = a, o.childLanes = e.childLanes & ~r, t.memoizedState = _i, n;
    }
    return o = e.child, e = o.sibling, n = lr(o, { mode: "visible", children: n.children }), (t.mode & 1) === 0 && (n.lanes = r), n.return = t, n.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = n, t.memoizedState = null, n;
  }
  function Pi(e, t) {
    return t = Yl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Dl(e, t, r, n) {
    return n !== null && li(n), Ur(t, e.child, null, r), e = Pi(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Lp(e, t, r, n, l, o, a) {
    if (r)
      return t.flags & 256 ? (t.flags &= -257, n = Ci(Error(u(422))), Dl(e, t, a, n)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = n.fallback, l = t.mode, n = Yl({ mode: "visible", children: n.children }, l, 0, null), o = br(o, l, a, null), o.flags |= 2, n.return = t, o.return = t, n.sibling = o, t.child = n, (t.mode & 1) !== 0 && Ur(t, e.child, null, a), t.child.memoizedState = Mi(a), t.memoizedState = _i, o);
    if ((t.mode & 1) === 0) return Dl(e, t, a, null);
    if (l.data === "$!") {
      if (n = l.nextSibling && l.nextSibling.dataset, n) var c = n.dgst;
      return n = c, o = Error(u(419)), n = Ci(o, n, void 0), Dl(e, t, a, n);
    }
    if (c = (a & e.childLanes) !== 0, Ye || c) {
      if (n = Re, n !== null) {
        switch (a & -a) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        l = (l & (n.suspendedLanes | a)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Lt(e, l), vt(n, e, l, -1));
      }
      return qi(), n = Ci(Error(u(421))), Dl(e, t, a, n);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Wp.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, lt = qt(l.nextSibling), nt = t, be = !0, mt = null, e !== null && (it[at++] = Mt, it[at++] = Pt, it[at++] = fr, Mt = e.id, Pt = e.overflow, fr = t), t = Pi(t, n.children), t.flags |= 4096, t);
  }
  function Au(e, t, r) {
    e.lanes |= t;
    var n = e.alternate;
    n !== null && (n.lanes |= t), si(e.return, t, r);
  }
  function Li(e, t, r, n, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: n, tail: r, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = n, o.tail = r, o.tailMode = l);
  }
  function Fu(e, t, r) {
    var n = t.pendingProps, l = n.revealOrder, o = n.tail;
    if (Qe(e, t, n.children, r), n = Se.current, (n & 2) !== 0) n = n & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Au(e, r, t);
        else if (e.tag === 19) Au(e, r, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      n &= 1;
    }
    if (me(Se, n), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (r = t.child, l = null; r !== null; ) e = r.alternate, e !== null && Ml(e) === null && (l = r), r = r.sibling;
        r = l, r === null ? (l = t.child, t.child = null) : (l = r.sibling, r.sibling = null), Li(t, !1, l, r, o);
        break;
      case "backwards":
        for (r = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Ml(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = r, r = l, l = e;
        }
        Li(t, !0, r, null, o);
        break;
      case "together":
        Li(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Al(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Rt(e, t, r) {
    if (e !== null && (t.dependencies = e.dependencies), vr |= t.lanes, (r & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, r = lr(e, e.pendingProps), t.child = r, r.return = t; e.sibling !== null; ) e = e.sibling, r = r.sibling = lr(e, e.pendingProps), r.return = t;
      r.sibling = null;
    }
    return t.child;
  }
  function Tp(e, t, r) {
    switch (t.tag) {
      case 3:
        Iu(t), $r();
        break;
      case 5:
        Js(t);
        break;
      case 1:
        Ge(t.type) && wl(t);
        break;
      case 4:
        di(t, t.stateNode.containerInfo);
        break;
      case 10:
        var n = t.type._context, l = t.memoizedProps.value;
        me(El, n._currentValue), n._currentValue = l;
        break;
      case 13:
        if (n = t.memoizedState, n !== null)
          return n.dehydrated !== null ? (me(Se, Se.current & 1), t.flags |= 128, null) : (r & t.child.childLanes) !== 0 ? Du(e, t, r) : (me(Se, Se.current & 1), e = Rt(e, t, r), e !== null ? e.sibling : null);
        me(Se, Se.current & 1);
        break;
      case 19:
        if (n = (r & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (n) return Fu(e, t, r);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), me(Se, Se.current), n) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Lu(e, t, r);
    }
    return Rt(e, t, r);
  }
  var $u, Ti, Uu, Hu;
  $u = function(e, t) {
    for (var r = t.child; r !== null; ) {
      if (r.tag === 5 || r.tag === 6) e.appendChild(r.stateNode);
      else if (r.tag !== 4 && r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === t) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === t) return;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
  }, Ti = function() {
  }, Uu = function(e, t, r, n) {
    var l = e.memoizedProps;
    if (l !== n) {
      e = t.stateNode, gr(St.current);
      var o = null;
      switch (r) {
        case "input":
          l = ao(e, l), n = ao(e, n), o = [];
          break;
        case "select":
          l = D({}, l, { value: void 0 }), n = D({}, n, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = co(e, l), n = co(e, n), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof n.onClick == "function" && (e.onclick = xl);
      }
      fo(r, n);
      var a;
      r = null;
      for (k in l) if (!n.hasOwnProperty(k) && l.hasOwnProperty(k) && l[k] != null) if (k === "style") {
        var c = l[k];
        for (a in c) c.hasOwnProperty(a) && (r || (r = {}), r[a] = "");
      } else k !== "dangerouslySetInnerHTML" && k !== "children" && k !== "suppressContentEditableWarning" && k !== "suppressHydrationWarning" && k !== "autoFocus" && (w.hasOwnProperty(k) ? o || (o = []) : (o = o || []).push(k, null));
      for (k in n) {
        var p = n[k];
        if (c = l != null ? l[k] : void 0, n.hasOwnProperty(k) && p !== c && (p != null || c != null)) if (k === "style") if (c) {
          for (a in c) !c.hasOwnProperty(a) || p && p.hasOwnProperty(a) || (r || (r = {}), r[a] = "");
          for (a in p) p.hasOwnProperty(a) && c[a] !== p[a] && (r || (r = {}), r[a] = p[a]);
        } else r || (o || (o = []), o.push(
          k,
          r
        )), r = p;
        else k === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, c = c ? c.__html : void 0, p != null && c !== p && (o = o || []).push(k, p)) : k === "children" ? typeof p != "string" && typeof p != "number" || (o = o || []).push(k, "" + p) : k !== "suppressContentEditableWarning" && k !== "suppressHydrationWarning" && (w.hasOwnProperty(k) ? (p != null && k === "onScroll" && ge("scroll", e), o || c === p || (o = [])) : (o = o || []).push(k, p));
      }
      r && (o = o || []).push("style", r);
      var k = o;
      (t.updateQueue = k) && (t.flags |= 4);
    }
  }, Hu = function(e, t, r, n) {
    r !== n && (t.flags |= 4);
  };
  function Rn(e, t) {
    if (!be) switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var r = null; t !== null; ) t.alternate !== null && (r = t), t = t.sibling;
        r === null ? e.tail = null : r.sibling = null;
        break;
      case "collapsed":
        r = e.tail;
        for (var n = null; r !== null; ) r.alternate !== null && (n = r), r = r.sibling;
        n === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : n.sibling = null;
    }
  }
  function Be(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, r = 0, n = 0;
    if (t) for (var l = e.child; l !== null; ) r |= l.lanes | l.childLanes, n |= l.subtreeFlags & 14680064, n |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) r |= l.lanes | l.childLanes, n |= l.subtreeFlags, n |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= n, e.childLanes = r, t;
  }
  function Rp(e, t, r) {
    var n = t.pendingProps;
    switch (ti(t), t.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Be(t), null;
      case 1:
        return Ge(t.type) && yl(), Be(t), null;
      case 3:
        return n = t.stateNode, Br(), xe(Ke), xe(He), mi(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (jl(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (Bi(mt), mt = null))), Ti(e, t), Be(t), null;
      case 5:
        pi(t);
        var l = gr(_n.current);
        if (r = t.type, e !== null && t.stateNode != null) Uu(e, t, r, n, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!n) {
            if (t.stateNode === null) throw Error(u(166));
            return Be(t), null;
          }
          if (e = gr(St.current), jl(t)) {
            n = t.stateNode, r = t.type;
            var o = t.memoizedProps;
            switch (n[bt] = t, n[jn] = o, e = (t.mode & 1) !== 0, r) {
              case "dialog":
                ge("cancel", n), ge("close", n);
                break;
              case "iframe":
              case "object":
              case "embed":
                ge("load", n);
                break;
              case "video":
              case "audio":
                for (l = 0; l < kn.length; l++) ge(kn[l], n);
                break;
              case "source":
                ge("error", n);
                break;
              case "img":
              case "image":
              case "link":
                ge(
                  "error",
                  n
                ), ge("load", n);
                break;
              case "details":
                ge("toggle", n);
                break;
              case "input":
                ba(n, o), ge("invalid", n);
                break;
              case "select":
                n._wrapperState = { wasMultiple: !!o.multiple }, ge("invalid", n);
                break;
              case "textarea":
                Ca(n, o), ge("invalid", n);
            }
            fo(r, o), l = null;
            for (var a in o) if (o.hasOwnProperty(a)) {
              var c = o[a];
              a === "children" ? typeof c == "string" ? n.textContent !== c && (o.suppressHydrationWarning !== !0 && gl(n.textContent, c, e), l = ["children", c]) : typeof c == "number" && n.textContent !== "" + c && (o.suppressHydrationWarning !== !0 && gl(
                n.textContent,
                c,
                e
              ), l = ["children", "" + c]) : w.hasOwnProperty(a) && c != null && a === "onScroll" && ge("scroll", n);
            }
            switch (r) {
              case "input":
                qn(n), ja(n, o, !0);
                break;
              case "textarea":
                qn(n), Na(n);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (n.onclick = xl);
            }
            n = l, t.updateQueue = n, n !== null && (t.flags |= 4);
          } else {
            a = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = za(r)), e === "http://www.w3.org/1999/xhtml" ? r === "script" ? (e = a.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof n.is == "string" ? e = a.createElement(r, { is: n.is }) : (e = a.createElement(r), r === "select" && (a = e, n.multiple ? a.multiple = !0 : n.size && (a.size = n.size))) : e = a.createElementNS(e, r), e[bt] = t, e[jn] = n, $u(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (a = mo(r, n), r) {
                case "dialog":
                  ge("cancel", e), ge("close", e), l = n;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  ge("load", e), l = n;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < kn.length; l++) ge(kn[l], e);
                  l = n;
                  break;
                case "source":
                  ge("error", e), l = n;
                  break;
                case "img":
                case "image":
                case "link":
                  ge(
                    "error",
                    e
                  ), ge("load", e), l = n;
                  break;
                case "details":
                  ge("toggle", e), l = n;
                  break;
                case "input":
                  ba(e, n), l = ao(e, n), ge("invalid", e);
                  break;
                case "option":
                  l = n;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!n.multiple }, l = D({}, n, { value: void 0 }), ge("invalid", e);
                  break;
                case "textarea":
                  Ca(e, n), l = co(e, n), ge("invalid", e);
                  break;
                default:
                  l = n;
              }
              fo(r, l), c = l;
              for (o in c) if (c.hasOwnProperty(o)) {
                var p = c[o];
                o === "style" ? Pa(e, p) : o === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, p != null && _a(e, p)) : o === "children" ? typeof p == "string" ? (r !== "textarea" || p !== "") && tn(e, p) : typeof p == "number" && tn(e, "" + p) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (w.hasOwnProperty(o) ? p != null && o === "onScroll" && ge("scroll", e) : p != null && $(e, o, p, a));
              }
              switch (r) {
                case "input":
                  qn(e), ja(e, n, !1);
                  break;
                case "textarea":
                  qn(e), Na(e);
                  break;
                case "option":
                  n.value != null && e.setAttribute("value", "" + de(n.value));
                  break;
                case "select":
                  e.multiple = !!n.multiple, o = n.value, o != null ? Cr(e, !!n.multiple, o, !1) : n.defaultValue != null && Cr(
                    e,
                    !!n.multiple,
                    n.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = xl);
              }
              switch (r) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  n = !!n.autoFocus;
                  break e;
                case "img":
                  n = !0;
                  break e;
                default:
                  n = !1;
              }
            }
            n && (t.flags |= 4);
          }
          t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
        }
        return Be(t), null;
      case 6:
        if (e && t.stateNode != null) Hu(e, t, e.memoizedProps, n);
        else {
          if (typeof n != "string" && t.stateNode === null) throw Error(u(166));
          if (r = gr(_n.current), gr(St.current), jl(t)) {
            if (n = t.stateNode, r = t.memoizedProps, n[bt] = t, (o = n.nodeValue !== r) && (e = nt, e !== null)) switch (e.tag) {
              case 3:
                gl(n.nodeValue, r, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && gl(n.nodeValue, r, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else n = (r.nodeType === 9 ? r : r.ownerDocument).createTextNode(n), n[bt] = t, t.stateNode = n;
        }
        return Be(t), null;
      case 13:
        if (xe(Se), n = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (be && lt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Ws(), $r(), t.flags |= 98560, o = !1;
          else if (o = jl(t), n !== null && n.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(u(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(u(317));
              o[bt] = t;
            } else $r(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Be(t), o = !1;
          } else mt !== null && (Bi(mt), mt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = r, t) : (n = n !== null, n !== (e !== null && e.memoizedState !== null) && n && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Se.current & 1) !== 0 ? Le === 0 && (Le = 3) : qi())), t.updateQueue !== null && (t.flags |= 4), Be(t), null);
      case 4:
        return Br(), Ti(e, t), e === null && bn(t.stateNode.containerInfo), Be(t), null;
      case 10:
        return ai(t.type._context), Be(t), null;
      case 17:
        return Ge(t.type) && yl(), Be(t), null;
      case 19:
        if (xe(Se), o = t.memoizedState, o === null) return Be(t), null;
        if (n = (t.flags & 128) !== 0, a = o.rendering, a === null) if (n) Rn(o, !1);
        else {
          if (Le !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (a = Ml(e), a !== null) {
              for (t.flags |= 128, Rn(o, !1), n = a.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), t.subtreeFlags = 0, n = r, r = t.child; r !== null; ) o = r, e = n, o.flags &= 14680066, a = o.alternate, a === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = a.childLanes, o.lanes = a.lanes, o.child = a.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = a.memoizedProps, o.memoizedState = a.memoizedState, o.updateQueue = a.updateQueue, o.type = a.type, e = a.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), r = r.sibling;
              return me(Se, Se.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && Ee() > Kr && (t.flags |= 128, n = !0, Rn(o, !1), t.lanes = 4194304);
        }
        else {
          if (!n) if (e = Ml(a), e !== null) {
            if (t.flags |= 128, n = !0, r = e.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), Rn(o, !0), o.tail === null && o.tailMode === "hidden" && !a.alternate && !be) return Be(t), null;
          } else 2 * Ee() - o.renderingStartTime > Kr && r !== 1073741824 && (t.flags |= 128, n = !0, Rn(o, !1), t.lanes = 4194304);
          o.isBackwards ? (a.sibling = t.child, t.child = a) : (r = o.last, r !== null ? r.sibling = a : t.child = a, o.last = a);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Ee(), t.sibling = null, r = Se.current, me(Se, n ? r & 1 | 2 : r & 1), t) : (Be(t), null);
      case 22:
      case 23:
        return Qi(), n = t.memoizedState !== null, e !== null && e.memoizedState !== null !== n && (t.flags |= 8192), n && (t.mode & 1) !== 0 ? (ot & 1073741824) !== 0 && (Be(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Be(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function Ip(e, t) {
    switch (ti(t), t.tag) {
      case 1:
        return Ge(t.type) && yl(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Br(), xe(Ke), xe(He), mi(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return pi(t), null;
      case 13:
        if (xe(Se), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(u(340));
          $r();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return xe(Se), null;
      case 4:
        return Br(), null;
      case 10:
        return ai(t.type._context), null;
      case 22:
      case 23:
        return Qi(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Fl = !1, We = !1, Op = typeof WeakSet == "function" ? WeakSet : Set, A = null;
  function Qr(e, t) {
    var r = e.ref;
    if (r !== null) if (typeof r == "function") try {
      r(null);
    } catch (n) {
      Ce(e, t, n);
    }
    else r.current = null;
  }
  function Ri(e, t, r) {
    try {
      r();
    } catch (n) {
      Ce(e, t, n);
    }
  }
  var Vu = !1;
  function Dp(e, t) {
    if (Qo = ol, e = ks(), Ao(e)) {
      if ("selectionStart" in e) var r = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        r = (r = e.ownerDocument) && r.defaultView || window;
        var n = r.getSelection && r.getSelection();
        if (n && n.rangeCount !== 0) {
          r = n.anchorNode;
          var l = n.anchorOffset, o = n.focusNode;
          n = n.focusOffset;
          try {
            r.nodeType, o.nodeType;
          } catch {
            r = null;
            break e;
          }
          var a = 0, c = -1, p = -1, k = 0, E = 0, M = e, j = null;
          t: for (; ; ) {
            for (var O; M !== r || l !== 0 && M.nodeType !== 3 || (c = a + l), M !== o || n !== 0 && M.nodeType !== 3 || (p = a + n), M.nodeType === 3 && (a += M.nodeValue.length), (O = M.firstChild) !== null; )
              j = M, M = O;
            for (; ; ) {
              if (M === e) break t;
              if (j === r && ++k === l && (c = a), j === o && ++E === n && (p = a), (O = M.nextSibling) !== null) break;
              M = j, j = M.parentNode;
            }
            M = O;
          }
          r = c === -1 || p === -1 ? null : { start: c, end: p };
        } else r = null;
      }
      r = r || { start: 0, end: 0 };
    } else r = null;
    for (qo = { focusedElem: e, selectionRange: r }, ol = !1, A = t; A !== null; ) if (t = A, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, A = e;
    else for (; A !== null; ) {
      t = A;
      try {
        var F = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (F !== null) {
              var U = F.memoizedProps, Ne = F.memoizedState, x = t.stateNode, f = x.getSnapshotBeforeUpdate(t.elementType === t.type ? U : ht(t.type, U), Ne);
              x.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          case 3:
            var y = t.stateNode.containerInfo;
            y.nodeType === 1 ? y.textContent = "" : y.nodeType === 9 && y.documentElement && y.removeChild(y.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(u(163));
        }
      } catch (L) {
        Ce(t, t.return, L);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, A = e;
        break;
      }
      A = t.return;
    }
    return F = Vu, Vu = !1, F;
  }
  function In(e, t, r) {
    var n = t.updateQueue;
    if (n = n !== null ? n.lastEffect : null, n !== null) {
      var l = n = n.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && Ri(t, r, o);
        }
        l = l.next;
      } while (l !== n);
    }
  }
  function $l(e, t) {
    if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
      var r = t = t.next;
      do {
        if ((r.tag & e) === e) {
          var n = r.create;
          r.destroy = n();
        }
        r = r.next;
      } while (r !== t);
    }
  }
  function Ii(e) {
    var t = e.ref;
    if (t !== null) {
      var r = e.stateNode;
      switch (e.tag) {
        case 5:
          e = r;
          break;
        default:
          e = r;
      }
      typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function Bu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Bu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[bt], delete t[jn], delete t[Xo], delete t[yp], delete t[wp])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Wu(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Qu(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Wu(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Oi(e, t, r) {
    var n = e.tag;
    if (n === 5 || n === 6) e = e.stateNode, t ? r.nodeType === 8 ? r.parentNode.insertBefore(e, t) : r.insertBefore(e, t) : (r.nodeType === 8 ? (t = r.parentNode, t.insertBefore(e, r)) : (t = r, t.appendChild(e)), r = r._reactRootContainer, r != null || t.onclick !== null || (t.onclick = xl));
    else if (n !== 4 && (e = e.child, e !== null)) for (Oi(e, t, r), e = e.sibling; e !== null; ) Oi(e, t, r), e = e.sibling;
  }
  function Di(e, t, r) {
    var n = e.tag;
    if (n === 5 || n === 6) e = e.stateNode, t ? r.insertBefore(e, t) : r.appendChild(e);
    else if (n !== 4 && (e = e.child, e !== null)) for (Di(e, t, r), e = e.sibling; e !== null; ) Di(e, t, r), e = e.sibling;
  }
  var De = null, gt = !1;
  function Jt(e, t, r) {
    for (r = r.child; r !== null; ) qu(e, t, r), r = r.sibling;
  }
  function qu(e, t, r) {
    if (kt && typeof kt.onCommitFiberUnmount == "function") try {
      kt.onCommitFiberUnmount(Jn, r);
    } catch {
    }
    switch (r.tag) {
      case 5:
        We || Qr(r, t);
      case 6:
        var n = De, l = gt;
        De = null, Jt(e, t, r), De = n, gt = l, De !== null && (gt ? (e = De, r = r.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(r) : e.removeChild(r)) : De.removeChild(r.stateNode));
        break;
      case 18:
        De !== null && (gt ? (e = De, r = r.stateNode, e.nodeType === 8 ? Yo(e.parentNode, r) : e.nodeType === 1 && Yo(e, r), fn(e)) : Yo(De, r.stateNode));
        break;
      case 4:
        n = De, l = gt, De = r.stateNode.containerInfo, gt = !0, Jt(e, t, r), De = n, gt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!We && (n = r.updateQueue, n !== null && (n = n.lastEffect, n !== null))) {
          l = n = n.next;
          do {
            var o = l, a = o.destroy;
            o = o.tag, a !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && Ri(r, t, a), l = l.next;
          } while (l !== n);
        }
        Jt(e, t, r);
        break;
      case 1:
        if (!We && (Qr(r, t), n = r.stateNode, typeof n.componentWillUnmount == "function")) try {
          n.props = r.memoizedProps, n.state = r.memoizedState, n.componentWillUnmount();
        } catch (c) {
          Ce(r, t, c);
        }
        Jt(e, t, r);
        break;
      case 21:
        Jt(e, t, r);
        break;
      case 22:
        r.mode & 1 ? (We = (n = We) || r.memoizedState !== null, Jt(e, t, r), We = n) : Jt(e, t, r);
        break;
      default:
        Jt(e, t, r);
    }
  }
  function Ku(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var r = e.stateNode;
      r === null && (r = e.stateNode = new Op()), t.forEach(function(n) {
        var l = Qp.bind(null, e, n);
        r.has(n) || (r.add(n), n.then(l, l));
      });
    }
  }
  function xt(e, t) {
    var r = t.deletions;
    if (r !== null) for (var n = 0; n < r.length; n++) {
      var l = r[n];
      try {
        var o = e, a = t, c = a;
        e: for (; c !== null; ) {
          switch (c.tag) {
            case 5:
              De = c.stateNode, gt = !1;
              break e;
            case 3:
              De = c.stateNode.containerInfo, gt = !0;
              break e;
            case 4:
              De = c.stateNode.containerInfo, gt = !0;
              break e;
          }
          c = c.return;
        }
        if (De === null) throw Error(u(160));
        qu(o, a, l), De = null, gt = !1;
        var p = l.alternate;
        p !== null && (p.return = null), l.return = null;
      } catch (k) {
        Ce(l, t, k);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Gu(t, e), t = t.sibling;
  }
  function Gu(e, t) {
    var r = e.alternate, n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (xt(t, e), Ct(e), n & 4) {
          try {
            In(3, e, e.return), $l(3, e);
          } catch (U) {
            Ce(e, e.return, U);
          }
          try {
            In(5, e, e.return);
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        break;
      case 1:
        xt(t, e), Ct(e), n & 512 && r !== null && Qr(r, r.return);
        break;
      case 5:
        if (xt(t, e), Ct(e), n & 512 && r !== null && Qr(r, r.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            tn(l, "");
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        if (n & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, a = r !== null ? r.memoizedProps : o, c = e.type, p = e.updateQueue;
          if (e.updateQueue = null, p !== null) try {
            c === "input" && o.type === "radio" && o.name != null && Sa(l, o), mo(c, a);
            var k = mo(c, o);
            for (a = 0; a < p.length; a += 2) {
              var E = p[a], M = p[a + 1];
              E === "style" ? Pa(l, M) : E === "dangerouslySetInnerHTML" ? _a(l, M) : E === "children" ? tn(l, M) : $(l, E, M, k);
            }
            switch (c) {
              case "input":
                so(l, o);
                break;
              case "textarea":
                Ea(l, o);
                break;
              case "select":
                var j = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var O = o.value;
                O != null ? Cr(l, !!o.multiple, O, !1) : j !== !!o.multiple && (o.defaultValue != null ? Cr(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : Cr(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[jn] = o;
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        break;
      case 6:
        if (xt(t, e), Ct(e), n & 4) {
          if (e.stateNode === null) throw Error(u(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        break;
      case 3:
        if (xt(t, e), Ct(e), n & 4 && r !== null && r.memoizedState.isDehydrated) try {
          fn(t.containerInfo);
        } catch (U) {
          Ce(e, e.return, U);
        }
        break;
      case 4:
        xt(t, e), Ct(e);
        break;
      case 13:
        xt(t, e), Ct(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || ($i = Ee())), n & 4 && Ku(e);
        break;
      case 22:
        if (E = r !== null && r.memoizedState !== null, e.mode & 1 ? (We = (k = We) || E, xt(t, e), We = k) : xt(t, e), Ct(e), n & 8192) {
          if (k = e.memoizedState !== null, (e.stateNode.isHidden = k) && !E && (e.mode & 1) !== 0) for (A = e, E = e.child; E !== null; ) {
            for (M = A = E; A !== null; ) {
              switch (j = A, O = j.child, j.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  In(4, j, j.return);
                  break;
                case 1:
                  Qr(j, j.return);
                  var F = j.stateNode;
                  if (typeof F.componentWillUnmount == "function") {
                    n = j, r = j.return;
                    try {
                      t = n, F.props = t.memoizedProps, F.state = t.memoizedState, F.componentWillUnmount();
                    } catch (U) {
                      Ce(n, r, U);
                    }
                  }
                  break;
                case 5:
                  Qr(j, j.return);
                  break;
                case 22:
                  if (j.memoizedState !== null) {
                    Zu(M);
                    continue;
                  }
              }
              O !== null ? (O.return = j, A = O) : Zu(M);
            }
            E = E.sibling;
          }
          e: for (E = null, M = e; ; ) {
            if (M.tag === 5) {
              if (E === null) {
                E = M;
                try {
                  l = M.stateNode, k ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (c = M.stateNode, p = M.memoizedProps.style, a = p != null && p.hasOwnProperty("display") ? p.display : null, c.style.display = Ma("display", a));
                } catch (U) {
                  Ce(e, e.return, U);
                }
              }
            } else if (M.tag === 6) {
              if (E === null) try {
                M.stateNode.nodeValue = k ? "" : M.memoizedProps;
              } catch (U) {
                Ce(e, e.return, U);
              }
            } else if ((M.tag !== 22 && M.tag !== 23 || M.memoizedState === null || M === e) && M.child !== null) {
              M.child.return = M, M = M.child;
              continue;
            }
            if (M === e) break e;
            for (; M.sibling === null; ) {
              if (M.return === null || M.return === e) break e;
              E === M && (E = null), M = M.return;
            }
            E === M && (E = null), M.sibling.return = M.return, M = M.sibling;
          }
        }
        break;
      case 19:
        xt(t, e), Ct(e), n & 4 && Ku(e);
        break;
      case 21:
        break;
      default:
        xt(
          t,
          e
        ), Ct(e);
    }
  }
  function Ct(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var r = e.return; r !== null; ) {
            if (Wu(r)) {
              var n = r;
              break e;
            }
            r = r.return;
          }
          throw Error(u(160));
        }
        switch (n.tag) {
          case 5:
            var l = n.stateNode;
            n.flags & 32 && (tn(l, ""), n.flags &= -33);
            var o = Qu(e);
            Di(e, o, l);
            break;
          case 3:
          case 4:
            var a = n.stateNode.containerInfo, c = Qu(e);
            Oi(e, c, a);
            break;
          default:
            throw Error(u(161));
        }
      } catch (p) {
        Ce(e, e.return, p);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Ap(e, t, r) {
    A = e, Yu(e);
  }
  function Yu(e, t, r) {
    for (var n = (e.mode & 1) !== 0; A !== null; ) {
      var l = A, o = l.child;
      if (l.tag === 22 && n) {
        var a = l.memoizedState !== null || Fl;
        if (!a) {
          var c = l.alternate, p = c !== null && c.memoizedState !== null || We;
          c = Fl;
          var k = We;
          if (Fl = a, (We = p) && !k) for (A = l; A !== null; ) a = A, p = a.child, a.tag === 22 && a.memoizedState !== null ? Ju(l) : p !== null ? (p.return = a, A = p) : Ju(l);
          for (; o !== null; ) A = o, Yu(o), o = o.sibling;
          A = l, Fl = c, We = k;
        }
        Xu(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, A = o) : Xu(e);
    }
  }
  function Xu(e) {
    for (; A !== null; ) {
      var t = A;
      if ((t.flags & 8772) !== 0) {
        var r = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              We || $l(5, t);
              break;
            case 1:
              var n = t.stateNode;
              if (t.flags & 4 && !We) if (r === null) n.componentDidMount();
              else {
                var l = t.elementType === t.type ? r.memoizedProps : ht(t.type, r.memoizedProps);
                n.componentDidUpdate(l, r.memoizedState, n.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && Zs(t, o, n);
              break;
            case 3:
              var a = t.updateQueue;
              if (a !== null) {
                if (r = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    r = t.child.stateNode;
                    break;
                  case 1:
                    r = t.child.stateNode;
                }
                Zs(t, a, r);
              }
              break;
            case 5:
              var c = t.stateNode;
              if (r === null && t.flags & 4) {
                r = c;
                var p = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    p.autoFocus && r.focus();
                    break;
                  case "img":
                    p.src && (r.src = p.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var k = t.alternate;
                if (k !== null) {
                  var E = k.memoizedState;
                  if (E !== null) {
                    var M = E.dehydrated;
                    M !== null && fn(M);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(u(163));
          }
          We || t.flags & 512 && Ii(t);
        } catch (j) {
          Ce(t, t.return, j);
        }
      }
      if (t === e) {
        A = null;
        break;
      }
      if (r = t.sibling, r !== null) {
        r.return = t.return, A = r;
        break;
      }
      A = t.return;
    }
  }
  function Zu(e) {
    for (; A !== null; ) {
      var t = A;
      if (t === e) {
        A = null;
        break;
      }
      var r = t.sibling;
      if (r !== null) {
        r.return = t.return, A = r;
        break;
      }
      A = t.return;
    }
  }
  function Ju(e) {
    for (; A !== null; ) {
      var t = A;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var r = t.return;
            try {
              $l(4, t);
            } catch (p) {
              Ce(t, r, p);
            }
            break;
          case 1:
            var n = t.stateNode;
            if (typeof n.componentDidMount == "function") {
              var l = t.return;
              try {
                n.componentDidMount();
              } catch (p) {
                Ce(t, l, p);
              }
            }
            var o = t.return;
            try {
              Ii(t);
            } catch (p) {
              Ce(t, o, p);
            }
            break;
          case 5:
            var a = t.return;
            try {
              Ii(t);
            } catch (p) {
              Ce(t, a, p);
            }
        }
      } catch (p) {
        Ce(t, t.return, p);
      }
      if (t === e) {
        A = null;
        break;
      }
      var c = t.sibling;
      if (c !== null) {
        c.return = t.return, A = c;
        break;
      }
      A = t.return;
    }
  }
  var Fp = Math.ceil, Ul = Y.ReactCurrentDispatcher, Ai = Y.ReactCurrentOwner, ct = Y.ReactCurrentBatchConfig, ie = 0, Re = null, ze = null, Ae = 0, ot = 0, qr = Kt(0), Le = 0, On = null, vr = 0, Hl = 0, Fi = 0, Dn = null, Xe = null, $i = 0, Kr = 1 / 0, It = null, Vl = !1, Ui = null, er = null, Bl = !1, tr = null, Wl = 0, An = 0, Hi = null, Ql = -1, ql = 0;
  function qe() {
    return (ie & 6) !== 0 ? Ee() : Ql !== -1 ? Ql : Ql = Ee();
  }
  function rr(e) {
    return (e.mode & 1) === 0 ? 1 : (ie & 2) !== 0 && Ae !== 0 ? Ae & -Ae : bp.transition !== null ? (ql === 0 && (ql = Qa()), ql) : (e = pe, e !== 0 || (e = window.event, e = e === void 0 ? 16 : ts(e.type)), e);
  }
  function vt(e, t, r, n) {
    if (50 < An) throw An = 0, Hi = null, Error(u(185));
    sn(e, r, n), ((ie & 2) === 0 || e !== Re) && (e === Re && ((ie & 2) === 0 && (Hl |= r), Le === 4 && nr(e, Ae)), Ze(e, n), r === 1 && ie === 0 && (t.mode & 1) === 0 && (Kr = Ee() + 500, kl && Yt()));
  }
  function Ze(e, t) {
    var r = e.callbackNode;
    bd(e, t);
    var n = rl(e, e === Re ? Ae : 0);
    if (n === 0) r !== null && Va(r), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = n & -n, e.callbackPriority !== t) {
      if (r != null && Va(r), t === 1) e.tag === 0 ? kp(tc.bind(null, e)) : $s(tc.bind(null, e)), xp(function() {
        (ie & 6) === 0 && Yt();
      }), r = null;
      else {
        switch (qa(n)) {
          case 1:
            r = ko;
            break;
          case 4:
            r = Ba;
            break;
          case 16:
            r = Zn;
            break;
          case 536870912:
            r = Wa;
            break;
          default:
            r = Zn;
        }
        r = uc(r, ec.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = r;
    }
  }
  function ec(e, t) {
    if (Ql = -1, ql = 0, (ie & 6) !== 0) throw Error(u(327));
    var r = e.callbackNode;
    if (Gr() && e.callbackNode !== r) return null;
    var n = rl(e, e === Re ? Ae : 0);
    if (n === 0) return null;
    if ((n & 30) !== 0 || (n & e.expiredLanes) !== 0 || t) t = Kl(e, n);
    else {
      t = n;
      var l = ie;
      ie |= 2;
      var o = nc();
      (Re !== e || Ae !== t) && (It = null, Kr = Ee() + 500, wr(e, t));
      do
        try {
          Hp();
          break;
        } catch (c) {
          rc(e, c);
        }
      while (!0);
      ii(), Ul.current = o, ie = l, ze !== null ? t = 0 : (Re = null, Ae = 0, t = Le);
    }
    if (t !== 0) {
      if (t === 2 && (l = bo(e), l !== 0 && (n = l, t = Vi(e, l))), t === 1) throw r = On, wr(e, 0), nr(e, n), Ze(e, Ee()), r;
      if (t === 6) nr(e, n);
      else {
        if (l = e.current.alternate, (n & 30) === 0 && !$p(l) && (t = Kl(e, n), t === 2 && (o = bo(e), o !== 0 && (n = o, t = Vi(e, o))), t === 1)) throw r = On, wr(e, 0), nr(e, n), Ze(e, Ee()), r;
        switch (e.finishedWork = l, e.finishedLanes = n, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            kr(e, Xe, It);
            break;
          case 3:
            if (nr(e, n), (n & 130023424) === n && (t = $i + 500 - Ee(), 10 < t)) {
              if (rl(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & n) !== n) {
                qe(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Go(kr.bind(null, e, Xe, It), t);
              break;
            }
            kr(e, Xe, It);
            break;
          case 4:
            if (nr(e, n), (n & 4194240) === n) break;
            for (t = e.eventTimes, l = -1; 0 < n; ) {
              var a = 31 - pt(n);
              o = 1 << a, a = t[a], a > l && (l = a), n &= ~o;
            }
            if (n = l, n = Ee() - n, n = (120 > n ? 120 : 480 > n ? 480 : 1080 > n ? 1080 : 1920 > n ? 1920 : 3e3 > n ? 3e3 : 4320 > n ? 4320 : 1960 * Fp(n / 1960)) - n, 10 < n) {
              e.timeoutHandle = Go(kr.bind(null, e, Xe, It), n);
              break;
            }
            kr(e, Xe, It);
            break;
          case 5:
            kr(e, Xe, It);
            break;
          default:
            throw Error(u(329));
        }
      }
    }
    return Ze(e, Ee()), e.callbackNode === r ? ec.bind(null, e) : null;
  }
  function Vi(e, t) {
    var r = Dn;
    return e.current.memoizedState.isDehydrated && (wr(e, t).flags |= 256), e = Kl(e, t), e !== 2 && (t = Xe, Xe = r, t !== null && Bi(t)), e;
  }
  function Bi(e) {
    Xe === null ? Xe = e : Xe.push.apply(Xe, e);
  }
  function $p(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var r = t.updateQueue;
        if (r !== null && (r = r.stores, r !== null)) for (var n = 0; n < r.length; n++) {
          var l = r[n], o = l.getSnapshot;
          l = l.value;
          try {
            if (!ft(o(), l)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (r = t.child, t.subtreeFlags & 16384 && r !== null) r.return = t, t = r;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function nr(e, t) {
    for (t &= ~Fi, t &= ~Hl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var r = 31 - pt(t), n = 1 << r;
      e[r] = -1, t &= ~n;
    }
  }
  function tc(e) {
    if ((ie & 6) !== 0) throw Error(u(327));
    Gr();
    var t = rl(e, 0);
    if ((t & 1) === 0) return Ze(e, Ee()), null;
    var r = Kl(e, t);
    if (e.tag !== 0 && r === 2) {
      var n = bo(e);
      n !== 0 && (t = n, r = Vi(e, n));
    }
    if (r === 1) throw r = On, wr(e, 0), nr(e, t), Ze(e, Ee()), r;
    if (r === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, kr(e, Xe, It), Ze(e, Ee()), null;
  }
  function Wi(e, t) {
    var r = ie;
    ie |= 1;
    try {
      return e(t);
    } finally {
      ie = r, ie === 0 && (Kr = Ee() + 500, kl && Yt());
    }
  }
  function yr(e) {
    tr !== null && tr.tag === 0 && (ie & 6) === 0 && Gr();
    var t = ie;
    ie |= 1;
    var r = ct.transition, n = pe;
    try {
      if (ct.transition = null, pe = 1, e) return e();
    } finally {
      pe = n, ct.transition = r, ie = t, (ie & 6) === 0 && Yt();
    }
  }
  function Qi() {
    ot = qr.current, xe(qr);
  }
  function wr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var r = e.timeoutHandle;
    if (r !== -1 && (e.timeoutHandle = -1, gp(r)), ze !== null) for (r = ze.return; r !== null; ) {
      var n = r;
      switch (ti(n), n.tag) {
        case 1:
          n = n.type.childContextTypes, n != null && yl();
          break;
        case 3:
          Br(), xe(Ke), xe(He), mi();
          break;
        case 5:
          pi(n);
          break;
        case 4:
          Br();
          break;
        case 13:
          xe(Se);
          break;
        case 19:
          xe(Se);
          break;
        case 10:
          ai(n.type._context);
          break;
        case 22:
        case 23:
          Qi();
      }
      r = r.return;
    }
    if (Re = e, ze = e = lr(e.current, null), Ae = ot = t, Le = 0, On = null, Fi = Hl = vr = 0, Xe = Dn = null, hr !== null) {
      for (t = 0; t < hr.length; t++) if (r = hr[t], n = r.interleaved, n !== null) {
        r.interleaved = null;
        var l = n.next, o = r.pending;
        if (o !== null) {
          var a = o.next;
          o.next = l, n.next = a;
        }
        r.pending = n;
      }
      hr = null;
    }
    return e;
  }
  function rc(e, t) {
    do {
      var r = ze;
      try {
        if (ii(), Pl.current = Il, Ll) {
          for (var n = je.memoizedState; n !== null; ) {
            var l = n.queue;
            l !== null && (l.pending = null), n = n.next;
          }
          Ll = !1;
        }
        if (xr = 0, Te = Pe = je = null, Mn = !1, Pn = 0, Ai.current = null, r === null || r.return === null) {
          Le = 1, On = t, ze = null;
          break;
        }
        e: {
          var o = e, a = r.return, c = r, p = t;
          if (t = Ae, c.flags |= 32768, p !== null && typeof p == "object" && typeof p.then == "function") {
            var k = p, E = c, M = E.tag;
            if ((E.mode & 1) === 0 && (M === 0 || M === 11 || M === 15)) {
              var j = E.alternate;
              j ? (E.updateQueue = j.updateQueue, E.memoizedState = j.memoizedState, E.lanes = j.lanes) : (E.updateQueue = null, E.memoizedState = null);
            }
            var O = Nu(a);
            if (O !== null) {
              O.flags &= -257, zu(O, a, c, o, t), O.mode & 1 && Eu(o, k, t), t = O, p = k;
              var F = t.updateQueue;
              if (F === null) {
                var U = /* @__PURE__ */ new Set();
                U.add(p), t.updateQueue = U;
              } else F.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                Eu(o, k, t), qi();
                break e;
              }
              p = Error(u(426));
            }
          } else if (be && c.mode & 1) {
            var Ne = Nu(a);
            if (Ne !== null) {
              (Ne.flags & 65536) === 0 && (Ne.flags |= 256), zu(Ne, a, c, o, t), li(Wr(p, c));
              break e;
            }
          }
          o = p = Wr(p, c), Le !== 4 && (Le = 2), Dn === null ? Dn = [o] : Dn.push(o), o = a;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var x = ju(o, p, t);
                Xs(o, x);
                break e;
              case 1:
                c = p;
                var f = o.type, y = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof f.getDerivedStateFromError == "function" || y !== null && typeof y.componentDidCatch == "function" && (er === null || !er.has(y)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var L = Cu(o, c, t);
                  Xs(o, L);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        oc(r);
      } catch (H) {
        t = H, ze === r && r !== null && (ze = r = r.return);
        continue;
      }
      break;
    } while (!0);
  }
  function nc() {
    var e = Ul.current;
    return Ul.current = Il, e === null ? Il : e;
  }
  function qi() {
    (Le === 0 || Le === 3 || Le === 2) && (Le = 4), Re === null || (vr & 268435455) === 0 && (Hl & 268435455) === 0 || nr(Re, Ae);
  }
  function Kl(e, t) {
    var r = ie;
    ie |= 2;
    var n = nc();
    (Re !== e || Ae !== t) && (It = null, wr(e, t));
    do
      try {
        Up();
        break;
      } catch (l) {
        rc(e, l);
      }
    while (!0);
    if (ii(), ie = r, Ul.current = n, ze !== null) throw Error(u(261));
    return Re = null, Ae = 0, Le;
  }
  function Up() {
    for (; ze !== null; ) lc(ze);
  }
  function Hp() {
    for (; ze !== null && !fd(); ) lc(ze);
  }
  function lc(e) {
    var t = sc(e.alternate, e, ot);
    e.memoizedProps = e.pendingProps, t === null ? oc(e) : ze = t, Ai.current = null;
  }
  function oc(e) {
    var t = e;
    do {
      var r = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (r = Rp(r, t, ot), r !== null) {
          ze = r;
          return;
        }
      } else {
        if (r = Ip(r, t), r !== null) {
          r.flags &= 32767, ze = r;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Le = 6, ze = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        ze = t;
        return;
      }
      ze = t = e;
    } while (t !== null);
    Le === 0 && (Le = 5);
  }
  function kr(e, t, r) {
    var n = pe, l = ct.transition;
    try {
      ct.transition = null, pe = 1, Vp(e, t, r, n);
    } finally {
      ct.transition = l, pe = n;
    }
    return null;
  }
  function Vp(e, t, r, n) {
    do
      Gr();
    while (tr !== null);
    if ((ie & 6) !== 0) throw Error(u(327));
    r = e.finishedWork;
    var l = e.finishedLanes;
    if (r === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, r === e.current) throw Error(u(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = r.lanes | r.childLanes;
    if (Sd(e, o), e === Re && (ze = Re = null, Ae = 0), (r.subtreeFlags & 2064) === 0 && (r.flags & 2064) === 0 || Bl || (Bl = !0, uc(Zn, function() {
      return Gr(), null;
    })), o = (r.flags & 15990) !== 0, (r.subtreeFlags & 15990) !== 0 || o) {
      o = ct.transition, ct.transition = null;
      var a = pe;
      pe = 1;
      var c = ie;
      ie |= 4, Ai.current = null, Dp(e, r), Gu(r, e), up(qo), ol = !!Qo, qo = Qo = null, e.current = r, Ap(r), md(), ie = c, pe = a, ct.transition = o;
    } else e.current = r;
    if (Bl && (Bl = !1, tr = e, Wl = l), o = e.pendingLanes, o === 0 && (er = null), xd(r.stateNode), Ze(e, Ee()), t !== null) for (n = e.onRecoverableError, r = 0; r < t.length; r++) l = t[r], n(l.value, { componentStack: l.stack, digest: l.digest });
    if (Vl) throw Vl = !1, e = Ui, Ui = null, e;
    return (Wl & 1) !== 0 && e.tag !== 0 && Gr(), o = e.pendingLanes, (o & 1) !== 0 ? e === Hi ? An++ : (An = 0, Hi = e) : An = 0, Yt(), null;
  }
  function Gr() {
    if (tr !== null) {
      var e = qa(Wl), t = ct.transition, r = pe;
      try {
        if (ct.transition = null, pe = 16 > e ? 16 : e, tr === null) var n = !1;
        else {
          if (e = tr, tr = null, Wl = 0, (ie & 6) !== 0) throw Error(u(331));
          var l = ie;
          for (ie |= 4, A = e.current; A !== null; ) {
            var o = A, a = o.child;
            if ((A.flags & 16) !== 0) {
              var c = o.deletions;
              if (c !== null) {
                for (var p = 0; p < c.length; p++) {
                  var k = c[p];
                  for (A = k; A !== null; ) {
                    var E = A;
                    switch (E.tag) {
                      case 0:
                      case 11:
                      case 15:
                        In(8, E, o);
                    }
                    var M = E.child;
                    if (M !== null) M.return = E, A = M;
                    else for (; A !== null; ) {
                      E = A;
                      var j = E.sibling, O = E.return;
                      if (Bu(E), E === k) {
                        A = null;
                        break;
                      }
                      if (j !== null) {
                        j.return = O, A = j;
                        break;
                      }
                      A = O;
                    }
                  }
                }
                var F = o.alternate;
                if (F !== null) {
                  var U = F.child;
                  if (U !== null) {
                    F.child = null;
                    do {
                      var Ne = U.sibling;
                      U.sibling = null, U = Ne;
                    } while (U !== null);
                  }
                }
                A = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && a !== null) a.return = o, A = a;
            else e: for (; A !== null; ) {
              if (o = A, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  In(9, o, o.return);
              }
              var x = o.sibling;
              if (x !== null) {
                x.return = o.return, A = x;
                break e;
              }
              A = o.return;
            }
          }
          var f = e.current;
          for (A = f; A !== null; ) {
            a = A;
            var y = a.child;
            if ((a.subtreeFlags & 2064) !== 0 && y !== null) y.return = a, A = y;
            else e: for (a = f; A !== null; ) {
              if (c = A, (c.flags & 2048) !== 0) try {
                switch (c.tag) {
                  case 0:
                  case 11:
                  case 15:
                    $l(9, c);
                }
              } catch (H) {
                Ce(c, c.return, H);
              }
              if (c === a) {
                A = null;
                break e;
              }
              var L = c.sibling;
              if (L !== null) {
                L.return = c.return, A = L;
                break e;
              }
              A = c.return;
            }
          }
          if (ie = l, Yt(), kt && typeof kt.onPostCommitFiberRoot == "function") try {
            kt.onPostCommitFiberRoot(Jn, e);
          } catch {
          }
          n = !0;
        }
        return n;
      } finally {
        pe = r, ct.transition = t;
      }
    }
    return !1;
  }
  function ic(e, t, r) {
    t = Wr(r, t), t = ju(e, t, 1), e = Zt(e, t, 1), t = qe(), e !== null && (sn(e, 1, t), Ze(e, t));
  }
  function Ce(e, t, r) {
    if (e.tag === 3) ic(e, e, r);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        ic(t, e, r);
        break;
      } else if (t.tag === 1) {
        var n = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof n.componentDidCatch == "function" && (er === null || !er.has(n))) {
          e = Wr(r, e), e = Cu(t, e, 1), t = Zt(t, e, 1), e = qe(), t !== null && (sn(t, 1, e), Ze(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Bp(e, t, r) {
    var n = e.pingCache;
    n !== null && n.delete(t), t = qe(), e.pingedLanes |= e.suspendedLanes & r, Re === e && (Ae & r) === r && (Le === 4 || Le === 3 && (Ae & 130023424) === Ae && 500 > Ee() - $i ? wr(e, 0) : Fi |= r), Ze(e, t);
  }
  function ac(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = tl, tl <<= 1, (tl & 130023424) === 0 && (tl = 4194304)));
    var r = qe();
    e = Lt(e, t), e !== null && (sn(e, t, r), Ze(e, r));
  }
  function Wp(e) {
    var t = e.memoizedState, r = 0;
    t !== null && (r = t.retryLane), ac(e, r);
  }
  function Qp(e, t) {
    var r = 0;
    switch (e.tag) {
      case 13:
        var n = e.stateNode, l = e.memoizedState;
        l !== null && (r = l.retryLane);
        break;
      case 19:
        n = e.stateNode;
        break;
      default:
        throw Error(u(314));
    }
    n !== null && n.delete(t), ac(e, r);
  }
  var sc;
  sc = function(e, t, r) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ke.current) Ye = !0;
    else {
      if ((e.lanes & r) === 0 && (t.flags & 128) === 0) return Ye = !1, Tp(e, t, r);
      Ye = (e.flags & 131072) !== 0;
    }
    else Ye = !1, be && (t.flags & 1048576) !== 0 && Us(t, Sl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var n = t.type;
        Al(e, t), e = t.pendingProps;
        var l = Dr(t, He.current);
        Vr(t, r), l = xi(null, t, n, e, l, r);
        var o = vi();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ge(n) ? (o = !0, wl(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, ci(t), l.updater = Ol, t.stateNode = l, l._reactInternals = t, ji(t, n, e, r), t = zi(null, t, n, !0, o, r)) : (t.tag = 0, be && o && ei(t), Qe(null, t, l, r), t = t.child), t;
      case 16:
        n = t.elementType;
        e: {
          switch (Al(e, t), e = t.pendingProps, l = n._init, n = l(n._payload), t.type = n, l = t.tag = Kp(n), e = ht(n, e), l) {
            case 0:
              t = Ni(null, t, n, e, r);
              break e;
            case 1:
              t = Ru(null, t, n, e, r);
              break e;
            case 11:
              t = _u(null, t, n, e, r);
              break e;
            case 14:
              t = Mu(null, t, n, ht(n.type, e), r);
              break e;
          }
          throw Error(u(
            306,
            n,
            ""
          ));
        }
        return t;
      case 0:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : ht(n, l), Ni(e, t, n, l, r);
      case 1:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : ht(n, l), Ru(e, t, n, l, r);
      case 3:
        e: {
          if (Iu(t), e === null) throw Error(u(387));
          n = t.pendingProps, o = t.memoizedState, l = o.element, Ys(e, t), _l(t, n, null, r);
          var a = t.memoizedState;
          if (n = a.element, o.isDehydrated) if (o = { element: n, isDehydrated: !1, cache: a.cache, pendingSuspenseBoundaries: a.pendingSuspenseBoundaries, transitions: a.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Wr(Error(u(423)), t), t = Ou(e, t, n, r, l);
            break e;
          } else if (n !== l) {
            l = Wr(Error(u(424)), t), t = Ou(e, t, n, r, l);
            break e;
          } else for (lt = qt(t.stateNode.containerInfo.firstChild), nt = t, be = !0, mt = null, r = Ks(t, null, n, r), t.child = r; r; ) r.flags = r.flags & -3 | 4096, r = r.sibling;
          else {
            if ($r(), n === l) {
              t = Rt(e, t, r);
              break e;
            }
            Qe(e, t, n, r);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Js(t), e === null && ni(t), n = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, a = l.children, Ko(n, l) ? a = null : o !== null && Ko(n, o) && (t.flags |= 32), Tu(e, t), Qe(e, t, a, r), t.child;
      case 6:
        return e === null && ni(t), null;
      case 13:
        return Du(e, t, r);
      case 4:
        return di(t, t.stateNode.containerInfo), n = t.pendingProps, e === null ? t.child = Ur(t, null, n, r) : Qe(e, t, n, r), t.child;
      case 11:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : ht(n, l), _u(e, t, n, l, r);
      case 7:
        return Qe(e, t, t.pendingProps, r), t.child;
      case 8:
        return Qe(e, t, t.pendingProps.children, r), t.child;
      case 12:
        return Qe(e, t, t.pendingProps.children, r), t.child;
      case 10:
        e: {
          if (n = t.type._context, l = t.pendingProps, o = t.memoizedProps, a = l.value, me(El, n._currentValue), n._currentValue = a, o !== null) if (ft(o.value, a)) {
            if (o.children === l.children && !Ke.current) {
              t = Rt(e, t, r);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var c = o.dependencies;
            if (c !== null) {
              a = o.child;
              for (var p = c.firstContext; p !== null; ) {
                if (p.context === n) {
                  if (o.tag === 1) {
                    p = Tt(-1, r & -r), p.tag = 2;
                    var k = o.updateQueue;
                    if (k !== null) {
                      k = k.shared;
                      var E = k.pending;
                      E === null ? p.next = p : (p.next = E.next, E.next = p), k.pending = p;
                    }
                  }
                  o.lanes |= r, p = o.alternate, p !== null && (p.lanes |= r), si(
                    o.return,
                    r,
                    t
                  ), c.lanes |= r;
                  break;
                }
                p = p.next;
              }
            } else if (o.tag === 10) a = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (a = o.return, a === null) throw Error(u(341));
              a.lanes |= r, c = a.alternate, c !== null && (c.lanes |= r), si(a, r, t), a = o.sibling;
            } else a = o.child;
            if (a !== null) a.return = o;
            else for (a = o; a !== null; ) {
              if (a === t) {
                a = null;
                break;
              }
              if (o = a.sibling, o !== null) {
                o.return = a.return, a = o;
                break;
              }
              a = a.return;
            }
            o = a;
          }
          Qe(e, t, l.children, r), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, n = t.pendingProps.children, Vr(t, r), l = st(l), n = n(l), t.flags |= 1, Qe(e, t, n, r), t.child;
      case 14:
        return n = t.type, l = ht(n, t.pendingProps), l = ht(n.type, l), Mu(e, t, n, l, r);
      case 15:
        return Pu(e, t, t.type, t.pendingProps, r);
      case 17:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : ht(n, l), Al(e, t), t.tag = 1, Ge(n) ? (e = !0, wl(t)) : e = !1, Vr(t, r), bu(t, n, l), ji(t, n, l, r), zi(null, t, n, !0, e, r);
      case 19:
        return Fu(e, t, r);
      case 22:
        return Lu(e, t, r);
    }
    throw Error(u(156, t.tag));
  };
  function uc(e, t) {
    return Ha(e, t);
  }
  function qp(e, t, r, n) {
    this.tag = e, this.key = r, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = n, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function dt(e, t, r, n) {
    return new qp(e, t, r, n);
  }
  function Ki(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Kp(e) {
    if (typeof e == "function") return Ki(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === le) return 11;
      if (e === et) return 14;
    }
    return 2;
  }
  function lr(e, t) {
    var r = e.alternate;
    return r === null ? (r = dt(e.tag, t, e.key, e.mode), r.elementType = e.elementType, r.type = e.type, r.stateNode = e.stateNode, r.alternate = e, e.alternate = r) : (r.pendingProps = t, r.type = e.type, r.flags = 0, r.subtreeFlags = 0, r.deletions = null), r.flags = e.flags & 14680064, r.childLanes = e.childLanes, r.lanes = e.lanes, r.child = e.child, r.memoizedProps = e.memoizedProps, r.memoizedState = e.memoizedState, r.updateQueue = e.updateQueue, t = e.dependencies, r.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, r.sibling = e.sibling, r.index = e.index, r.ref = e.ref, r;
  }
  function Gl(e, t, r, n, l, o) {
    var a = 2;
    if (n = e, typeof e == "function") Ki(e) && (a = 1);
    else if (typeof e == "string") a = 5;
    else e: switch (e) {
      case ye:
        return br(r.children, l, o, t);
      case we:
        a = 8, l |= 8;
        break;
      case _e:
        return e = dt(12, r, t, l | 2), e.elementType = _e, e.lanes = o, e;
      case $e:
        return e = dt(13, r, t, l), e.elementType = $e, e.lanes = o, e;
      case Ue:
        return e = dt(19, r, t, l), e.elementType = Ue, e.lanes = o, e;
      case he:
        return Yl(r, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Fe:
            a = 10;
            break e;
          case Oe:
            a = 9;
            break e;
          case le:
            a = 11;
            break e;
          case et:
            a = 14;
            break e;
          case Me:
            a = 16, n = null;
            break e;
        }
        throw Error(u(130, e == null ? e : typeof e, ""));
    }
    return t = dt(a, r, t, l), t.elementType = e, t.type = n, t.lanes = o, t;
  }
  function br(e, t, r, n) {
    return e = dt(7, e, n, t), e.lanes = r, e;
  }
  function Yl(e, t, r, n) {
    return e = dt(22, e, n, t), e.elementType = he, e.lanes = r, e.stateNode = { isHidden: !1 }, e;
  }
  function Gi(e, t, r) {
    return e = dt(6, e, null, t), e.lanes = r, e;
  }
  function Yi(e, t, r) {
    return t = dt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = r, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Gp(e, t, r, n, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = So(0), this.expirationTimes = So(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = So(0), this.identifierPrefix = n, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Xi(e, t, r, n, l, o, a, c, p) {
    return e = new Gp(e, t, r, c, p), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = dt(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: n, isDehydrated: r, cache: null, transitions: null, pendingSuspenseBoundaries: null }, ci(o), e;
  }
  function Yp(e, t, r) {
    var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: J, key: n == null ? null : "" + n, children: e, containerInfo: t, implementation: r };
  }
  function cc(e) {
    if (!e) return Gt;
    e = e._reactInternals;
    e: {
      if (cr(e) !== e || e.tag !== 1) throw Error(u(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ge(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(u(171));
    }
    if (e.tag === 1) {
      var r = e.type;
      if (Ge(r)) return As(e, r, t);
    }
    return t;
  }
  function dc(e, t, r, n, l, o, a, c, p) {
    return e = Xi(r, n, !0, e, l, o, a, c, p), e.context = cc(null), r = e.current, n = qe(), l = rr(r), o = Tt(n, l), o.callback = t ?? null, Zt(r, o, l), e.current.lanes = l, sn(e, l, n), Ze(e, n), e;
  }
  function Xl(e, t, r, n) {
    var l = t.current, o = qe(), a = rr(l);
    return r = cc(r), t.context === null ? t.context = r : t.pendingContext = r, t = Tt(o, a), t.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (t.callback = n), e = Zt(l, t, a), e !== null && (vt(e, l, a, o), zl(e, l, a)), a;
  }
  function Zl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function pc(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var r = e.retryLane;
      e.retryLane = r !== 0 && r < t ? r : t;
    }
  }
  function Zi(e, t) {
    pc(e, t), (e = e.alternate) && pc(e, t);
  }
  function Xp() {
    return null;
  }
  var fc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Ji(e) {
    this._internalRoot = e;
  }
  Jl.prototype.render = Ji.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    Xl(e, t, null, null);
  }, Jl.prototype.unmount = Ji.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      yr(function() {
        Xl(null, e, null, null);
      }), t[zt] = null;
    }
  };
  function Jl(e) {
    this._internalRoot = e;
  }
  Jl.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ya();
      e = { blockedOn: null, target: e, priority: t };
      for (var r = 0; r < Bt.length && t !== 0 && t < Bt[r].priority; r++) ;
      Bt.splice(r, 0, e), r === 0 && Ja(e);
    }
  };
  function ea(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function eo(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function mc() {
  }
  function Zp(e, t, r, n, l) {
    if (l) {
      if (typeof n == "function") {
        var o = n;
        n = function() {
          var k = Zl(a);
          o.call(k);
        };
      }
      var a = dc(t, n, e, 0, null, !1, !1, "", mc);
      return e._reactRootContainer = a, e[zt] = a.current, bn(e.nodeType === 8 ? e.parentNode : e), yr(), a;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof n == "function") {
      var c = n;
      n = function() {
        var k = Zl(p);
        c.call(k);
      };
    }
    var p = Xi(e, 0, !1, null, null, !1, !1, "", mc);
    return e._reactRootContainer = p, e[zt] = p.current, bn(e.nodeType === 8 ? e.parentNode : e), yr(function() {
      Xl(t, p, r, n);
    }), p;
  }
  function to(e, t, r, n, l) {
    var o = r._reactRootContainer;
    if (o) {
      var a = o;
      if (typeof l == "function") {
        var c = l;
        l = function() {
          var p = Zl(a);
          c.call(p);
        };
      }
      Xl(t, a, e, l);
    } else a = Zp(r, t, e, l, n);
    return Zl(a);
  }
  Ka = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var r = an(t.pendingLanes);
          r !== 0 && (jo(t, r | 1), Ze(t, Ee()), (ie & 6) === 0 && (Kr = Ee() + 500, Yt()));
        }
        break;
      case 13:
        yr(function() {
          var n = Lt(e, 1);
          if (n !== null) {
            var l = qe();
            vt(n, e, 1, l);
          }
        }), Zi(e, 1);
    }
  }, Co = function(e) {
    if (e.tag === 13) {
      var t = Lt(e, 134217728);
      if (t !== null) {
        var r = qe();
        vt(t, e, 134217728, r);
      }
      Zi(e, 134217728);
    }
  }, Ga = function(e) {
    if (e.tag === 13) {
      var t = rr(e), r = Lt(e, t);
      if (r !== null) {
        var n = qe();
        vt(r, e, t, n);
      }
      Zi(e, t);
    }
  }, Ya = function() {
    return pe;
  }, Xa = function(e, t) {
    var r = pe;
    try {
      return pe = e, t();
    } finally {
      pe = r;
    }
  }, xo = function(e, t, r) {
    switch (t) {
      case "input":
        if (so(e, r), t = r.name, r.type === "radio" && t != null) {
          for (r = e; r.parentNode; ) r = r.parentNode;
          for (r = r.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < r.length; t++) {
            var n = r[t];
            if (n !== e && n.form === e.form) {
              var l = vl(n);
              if (!l) throw Error(u(90));
              ka(n), so(n, l);
            }
          }
        }
        break;
      case "textarea":
        Ea(e, r);
        break;
      case "select":
        t = r.value, t != null && Cr(e, !!r.multiple, t, !1);
    }
  }, Ia = Wi, Oa = yr;
  var Jp = { usingClientEntryPoint: !1, Events: [Cn, Ir, vl, Ta, Ra, Wi] }, Fn = { findFiberByHostInstance: dr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, ef = { bundleType: Fn.bundleType, version: Fn.version, rendererPackageName: Fn.rendererPackageName, rendererConfig: Fn.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Y.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = $a(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Fn.findFiberByHostInstance || Xp, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ro = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ro.isDisabled && ro.supportsFiber) try {
      Jn = ro.inject(ef), kt = ro;
    } catch {
    }
  }
  return Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Jp, Je.createPortal = function(e, t) {
    var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ea(t)) throw Error(u(200));
    return Yp(e, t, null, r);
  }, Je.createRoot = function(e, t) {
    if (!ea(e)) throw Error(u(299));
    var r = !1, n = "", l = fc;
    return t != null && (t.unstable_strictMode === !0 && (r = !0), t.identifierPrefix !== void 0 && (n = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Xi(e, 1, !1, null, null, r, !1, n, l), e[zt] = t.current, bn(e.nodeType === 8 ? e.parentNode : e), new Ji(t);
  }, Je.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = $a(t), e = e === null ? null : e.stateNode, e;
  }, Je.flushSync = function(e) {
    return yr(e);
  }, Je.hydrate = function(e, t, r) {
    if (!eo(t)) throw Error(u(200));
    return to(null, e, t, !0, r);
  }, Je.hydrateRoot = function(e, t, r) {
    if (!ea(e)) throw Error(u(405));
    var n = r != null && r.hydratedSources || null, l = !1, o = "", a = fc;
    if (r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (a = r.onRecoverableError)), t = dc(t, null, e, 1, r ?? null, l, !1, o, a), e[zt] = t.current, bn(e), n) for (e = 0; e < n.length; e++) r = n[e], l = r._getVersion, l = l(r._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [r, l] : t.mutableSourceEagerHydrationData.push(
      r,
      l
    );
    return new Jl(t);
  }, Je.render = function(e, t, r) {
    if (!eo(t)) throw Error(u(200));
    return to(null, e, t, !1, r);
  }, Je.unmountComponentAtNode = function(e) {
    if (!eo(e)) throw Error(u(40));
    return e._reactRootContainer ? (yr(function() {
      to(null, null, e, !1, function() {
        e._reactRootContainer = null, e[zt] = null;
      });
    }), !0) : !1;
  }, Je.unstable_batchedUpdates = Wi, Je.unstable_renderSubtreeIntoContainer = function(e, t, r, n) {
    if (!eo(r)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return to(e, t, r, !1, n);
  }, Je.version = "18.3.1-next-f1338f8080-20240426", Je;
}
var bc;
function _c() {
  if (bc) return na.exports;
  bc = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (d) {
        console.error(d);
      }
  }
  return i(), na.exports = pf(), na.exports;
}
var Sc;
function ff() {
  if (Sc) return no;
  Sc = 1;
  var i = _c();
  return no.createRoot = i.createRoot, no.hydrateRoot = i.hydrateRoot, no;
}
var Xr = ff(), mf = _c();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hf = (i) => i.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Mc = (...i) => i.filter((d, u, h) => !!d && d.trim() !== "" && h.indexOf(d) === u).join(" ").trim();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var gf = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xf = Q.forwardRef(
  ({
    color: i = "currentColor",
    size: d = 24,
    strokeWidth: u = 2,
    absoluteStrokeWidth: h,
    className: w = "",
    children: v,
    iconNode: g,
    ...b
  }, _) => Q.createElement(
    "svg",
    {
      ref: _,
      ...gf,
      width: d,
      height: d,
      stroke: i,
      strokeWidth: h ? Number(u) * 24 / Number(d) : u,
      className: Mc("lucide", w),
      ...b
    },
    [
      ...g.map(([N, T]) => Q.createElement(N, T)),
      ...Array.isArray(v) ? v : [v]
    ]
  )
);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ce = (i, d) => {
  const u = Q.forwardRef(
    ({ className: h, ...w }, v) => Q.createElement(xf, {
      ref: v,
      iconNode: d,
      className: Mc(`lucide-${hf(i)}`, h),
      ...w
    })
  );
  return u.displayName = `${i}`, u;
};
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vf = ce("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yf = ce("ArrowUpDown", [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wf = ce("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const io = ce("BookOpen", [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const kf = ce("Building2", [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vn = ce("CalendarDays", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bf = ce("CalendarRange", [
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M17 14h-6", key: "bkmgh3" }],
  ["path", { d: "M13 18H7", key: "bb0bb7" }],
  ["path", { d: "M7 14h.01", key: "1qa3f1" }],
  ["path", { d: "M17 18h.01", key: "1bdyru" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sf = ce("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pc = ce("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wn = ce("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const aa = ce("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lc = ce("Ellipsis", [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ga = ce("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sa = ce("FileClock", [
  ["path", { d: "M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "37hlfg" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["circle", { cx: "8", cy: "16", r: "6", key: "10v15b" }],
  ["path", { d: "M9.5 17.5 8 16.25V14", key: "1o80t2" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jf = ce("GitBranch", [
  ["line", { x1: "6", x2: "6", y1: "3", y2: "15", key: "17qcm7" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M18 9a9 9 0 0 1-9 9", key: "n2h4wq" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bn = ce("GraduationCap", [
  [
    "path",
    {
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
      key: "j76jl0"
    }
  ],
  ["path", { d: "M22 10v6", key: "1lu8f3" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5", key: "1r8lef" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cf = ce("GripVertical", [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xa = ce("Hash", [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ua = ce("History", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ef = ce("Layers", [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nf = ce("LibraryBig", [
  ["rect", { width: "8", height: "18", x: "3", y: "3", rx: "1", key: "oynpb5" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  [
    "path",
    {
      d: "M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z",
      key: "1qboyk"
    }
  ]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qn = ce("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zf = ce("Pin", [
  ["path", { d: "M12 17v5", key: "bb1du9" }],
  [
    "path",
    {
      d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
      key: "1nkz8b"
    }
  ]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _f = ce("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mf = ce("Route", [
  ["circle", { cx: "6", cy: "19", r: "3", key: "1kj8tv" }],
  ["path", { d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15", key: "1d8sl" }],
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const va = ce("SearchX", [
  ["path", { d: "m13.5 8.5-5 5", key: "1cs55j" }],
  ["path", { d: "m8.5 8.5 5 5", key: "a8mexj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pf = ce("Star", [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ca = ce("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tc = ce("TriangleAlert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ur = ce("UserRound", [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lf = ce("UsersRound", [
  ["path", { d: "M18 21a8 8 0 0 0-16 0", key: "3ypg7q" }],
  ["circle", { cx: "10", cy: "8", r: "5", key: "o932ke" }],
  ["path", { d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3", key: "10s06x" }]
]);
var Tf = Object.defineProperty, ya = (i, d) => Tf(i, "name", { value: d, configurable: !0 });
function da(i, d) {
  if (typeof i == "function")
    return i(d);
  i != null && (i.current = d);
}
ya(da, "setRef");
function Rc(...i) {
  return (d) => {
    let u = !1;
    const h = i.map((w) => {
      const v = da(w, d);
      return !u && typeof v == "function" && (u = !0), v;
    });
    if (u)
      return () => {
        for (let w = 0; w < h.length; w++) {
          const v = h[w];
          typeof v == "function" ? v() : da(i[w], null);
        }
      };
  };
}
ya(Rc, "composeRefs");
function Ic(...i) {
  return Q.useCallback(Rc(...i), i);
}
ya(Ic, "useComposedRefs");
var Rf = Object.defineProperty, wt = (i, d) => Rf(i, "name", { value: d, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Oc(i) {
  const d = Q.forwardRef((u, h) => {
    let { children: w, ...v } = u, g = null, b = !1;
    const _ = [];
    pa(w) && typeof lo == "function" && (w = lo(w._payload)), Q.Children.forEach(w, (z) => {
      var G;
      if ($c(z)) {
        b = !0;
        const S = z;
        let P = "child" in S.props ? S.props.child : S.props.children;
        pa(P) && typeof lo == "function" && (P = lo(P._payload)), g = Df(S, P), _.push((G = g == null ? void 0 : g.props) == null ? void 0 : G.children);
      } else
        _.push(z);
    }), g ? g = Q.cloneElement(g, void 0, _) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !b && Q.Children.count(w) === 1 && Q.isValidElement(w) && (g = w)
    );
    const N = g ? Fc(g) : void 0, T = Ic(h, N);
    if (!g) {
      if (w || w === 0)
        throw new Error(
          b ? $f(i) : Ff(i)
        );
      return w;
    }
    const V = Ac(v, g.props ?? {});
    return g.type !== Q.Fragment && (V.ref = h ? T : N), Q.cloneElement(g, V);
  });
  return d.displayName = `${i}.Slot`, d;
}
wt(Oc, "createSlot");
var If = /* @__PURE__ */ Oc("Slot"), Dc = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Of(i) {
  const d = /* @__PURE__ */ wt((u) => "child" in u ? u.children(u.child) : u.children, "Slottable");
  return d.displayName = `${i}.Slottable`, d.__radixId = Dc, d;
}
wt(Of, "createSlottable");
var Df = /* @__PURE__ */ wt((i, d) => {
  if ("child" in i.props) {
    const u = i.props.child;
    return Q.isValidElement(u) ? Q.cloneElement(u, void 0, i.props.children(u.props.children)) : null;
  }
  return Q.isValidElement(d) ? d : null;
}, "getSlottableElementFromSlottable");
function Ac(i, d) {
  const u = { ...d };
  for (const h in d) {
    const w = i[h], v = d[h];
    /^on[A-Z]/.test(h) ? w && v ? u[h] = (...b) => {
      const _ = v(...b);
      return w(...b), _;
    } : w && (u[h] = w) : h === "style" ? u[h] = { ...w, ...v } : h === "className" && (u[h] = [w, v].filter(Boolean).join(" "));
  }
  return { ...i, ...u };
}
wt(Ac, "mergeProps");
function Fc(i) {
  var h, w;
  let d = (h = Object.getOwnPropertyDescriptor(i.props, "ref")) == null ? void 0 : h.get, u = d && "isReactWarning" in d && d.isReactWarning;
  return u ? i.ref : (d = (w = Object.getOwnPropertyDescriptor(i, "ref")) == null ? void 0 : w.get, u = d && "isReactWarning" in d && d.isReactWarning, u ? i.props.ref : i.props.ref || i.ref);
}
wt(Fc, "getElementRef");
function $c(i) {
  return Q.isValidElement(i) && typeof i.type == "function" && "__radixId" in i.type && i.type.__radixId === Dc;
}
wt($c, "isSlottable");
var Af = Symbol.for("react.lazy");
function pa(i) {
  return i != null && typeof i == "object" && "$$typeof" in i && i.$$typeof === Af && "_payload" in i && Uc(i._payload);
}
wt(pa, "isLazyComponent");
function Uc(i) {
  return typeof i == "object" && i !== null && "then" in i;
}
wt(Uc, "isPromiseLike");
var Ff = /* @__PURE__ */ wt((i) => `${i} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), $f = /* @__PURE__ */ wt((i) => `${i} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), lo = uf[" use ".trim().toString()];
function Hc(i) {
  var d, u, h = "";
  if (typeof i == "string" || typeof i == "number") h += i;
  else if (typeof i == "object") if (Array.isArray(i)) {
    var w = i.length;
    for (d = 0; d < w; d++) i[d] && (u = Hc(i[d])) && (h && (h += " "), h += u);
  } else for (u in i) i[u] && (h && (h += " "), h += u);
  return h;
}
function Vc() {
  for (var i, d, u = 0, h = "", w = arguments.length; u < w; u++) (i = arguments[u]) && (d = Hc(i)) && (h && (h += " "), h += d);
  return h;
}
const jc = (i) => typeof i == "boolean" ? `${i}` : i === 0 ? "0" : i, Cc = Vc, Uf = (i, d) => (u) => {
  var h;
  if ((d == null ? void 0 : d.variants) == null) return Cc(i, u == null ? void 0 : u.class, u == null ? void 0 : u.className);
  const { variants: w, defaultVariants: v } = d, g = Object.keys(w).map((N) => {
    const T = u == null ? void 0 : u[N], V = v == null ? void 0 : v[N];
    if (T === null) return null;
    const z = jc(T) || jc(V);
    return w[N][z];
  }), b = u && Object.entries(u).reduce((N, T) => {
    let [V, z] = T;
    return z === void 0 || (N[V] = z), N;
  }, {}), _ = d == null || (h = d.compoundVariants) === null || h === void 0 ? void 0 : h.reduce((N, T) => {
    let { class: V, className: z, ...G } = T;
    return Object.entries(G).every((S) => {
      let [P, R] = S;
      return Array.isArray(R) ? R.includes({
        ...v,
        ...b
      }[P]) : {
        ...v,
        ...b
      }[P] === R;
    }) ? [
      ...N,
      V,
      z
    ] : N;
  }, []);
  return Cc(i, g, _, u == null ? void 0 : u.class, u == null ? void 0 : u.className);
}, wa = "-", Hf = (i) => {
  const d = Bf(i), {
    conflictingClassGroups: u,
    conflictingClassGroupModifiers: h
  } = i;
  return {
    getClassGroupId: (g) => {
      const b = g.split(wa);
      return b[0] === "" && b.length !== 1 && b.shift(), Bc(b, d) || Vf(g);
    },
    getConflictingClassGroupIds: (g, b) => {
      const _ = u[g] || [];
      return b && h[g] ? [..._, ...h[g]] : _;
    }
  };
}, Bc = (i, d) => {
  var g;
  if (i.length === 0)
    return d.classGroupId;
  const u = i[0], h = d.nextPart.get(u), w = h ? Bc(i.slice(1), h) : void 0;
  if (w)
    return w;
  if (d.validators.length === 0)
    return;
  const v = i.join(wa);
  return (g = d.validators.find(({
    validator: b
  }) => b(v))) == null ? void 0 : g.classGroupId;
}, Ec = /^\[(.+)\]$/, Vf = (i) => {
  if (Ec.test(i)) {
    const d = Ec.exec(i)[1], u = d == null ? void 0 : d.substring(0, d.indexOf(":"));
    if (u)
      return "arbitrary.." + u;
  }
}, Bf = (i) => {
  const {
    theme: d,
    prefix: u
  } = i, h = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Qf(Object.entries(i.classGroups), u).forEach(([v, g]) => {
    fa(g, h, v, d);
  }), h;
}, fa = (i, d, u, h) => {
  i.forEach((w) => {
    if (typeof w == "string") {
      const v = w === "" ? d : Nc(d, w);
      v.classGroupId = u;
      return;
    }
    if (typeof w == "function") {
      if (Wf(w)) {
        fa(w(h), d, u, h);
        return;
      }
      d.validators.push({
        validator: w,
        classGroupId: u
      });
      return;
    }
    Object.entries(w).forEach(([v, g]) => {
      fa(g, Nc(d, v), u, h);
    });
  });
}, Nc = (i, d) => {
  let u = i;
  return d.split(wa).forEach((h) => {
    u.nextPart.has(h) || u.nextPart.set(h, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), u = u.nextPart.get(h);
  }), u;
}, Wf = (i) => i.isThemeGetter, Qf = (i, d) => d ? i.map(([u, h]) => {
  const w = h.map((v) => typeof v == "string" ? d + v : typeof v == "object" ? Object.fromEntries(Object.entries(v).map(([g, b]) => [d + g, b])) : v);
  return [u, w];
}) : i, qf = (i) => {
  if (i < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let d = 0, u = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
  const w = (v, g) => {
    u.set(v, g), d++, d > i && (d = 0, h = u, u = /* @__PURE__ */ new Map());
  };
  return {
    get(v) {
      let g = u.get(v);
      if (g !== void 0)
        return g;
      if ((g = h.get(v)) !== void 0)
        return w(v, g), g;
    },
    set(v, g) {
      u.has(v) ? u.set(v, g) : w(v, g);
    }
  };
}, Wc = "!", Kf = (i) => {
  const {
    separator: d,
    experimentalParseClassName: u
  } = i, h = d.length === 1, w = d[0], v = d.length, g = (b) => {
    const _ = [];
    let N = 0, T = 0, V;
    for (let R = 0; R < b.length; R++) {
      let Z = b[R];
      if (N === 0) {
        if (Z === w && (h || b.slice(R, R + v) === d)) {
          _.push(b.slice(T, R)), T = R + v;
          continue;
        }
        if (Z === "/") {
          V = R;
          continue;
        }
      }
      Z === "[" ? N++ : Z === "]" && N--;
    }
    const z = _.length === 0 ? b : b.substring(T), G = z.startsWith(Wc), S = G ? z.substring(1) : z, P = V && V > T ? V - T : void 0;
    return {
      modifiers: _,
      hasImportantModifier: G,
      baseClassName: S,
      maybePostfixModifierPosition: P
    };
  };
  return u ? (b) => u({
    className: b,
    parseClassName: g
  }) : g;
}, Gf = (i) => {
  if (i.length <= 1)
    return i;
  const d = [];
  let u = [];
  return i.forEach((h) => {
    h[0] === "[" ? (d.push(...u.sort(), h), u = []) : u.push(h);
  }), d.push(...u.sort()), d;
}, Yf = (i) => ({
  cache: qf(i.cacheSize),
  parseClassName: Kf(i),
  ...Hf(i)
}), Xf = /\s+/, Zf = (i, d) => {
  const {
    parseClassName: u,
    getClassGroupId: h,
    getConflictingClassGroupIds: w
  } = d, v = [], g = i.trim().split(Xf);
  let b = "";
  for (let _ = g.length - 1; _ >= 0; _ -= 1) {
    const N = g[_], {
      modifiers: T,
      hasImportantModifier: V,
      baseClassName: z,
      maybePostfixModifierPosition: G
    } = u(N);
    let S = !!G, P = h(S ? z.substring(0, G) : z);
    if (!P) {
      if (!S) {
        b = N + (b.length > 0 ? " " + b : b);
        continue;
      }
      if (P = h(z), !P) {
        b = N + (b.length > 0 ? " " + b : b);
        continue;
      }
      S = !1;
    }
    const R = Gf(T).join(":"), Z = V ? R + Wc : R, W = Z + P;
    if (v.includes(W))
      continue;
    v.push(W);
    const $ = w(P, S);
    for (let Y = 0; Y < $.length; ++Y) {
      const oe = $[Y];
      v.push(Z + oe);
    }
    b = N + (b.length > 0 ? " " + b : b);
  }
  return b;
};
function Jf() {
  let i = 0, d, u, h = "";
  for (; i < arguments.length; )
    (d = arguments[i++]) && (u = Qc(d)) && (h && (h += " "), h += u);
  return h;
}
const Qc = (i) => {
  if (typeof i == "string")
    return i;
  let d, u = "";
  for (let h = 0; h < i.length; h++)
    i[h] && (d = Qc(i[h])) && (u && (u += " "), u += d);
  return u;
};
function em(i, ...d) {
  let u, h, w, v = g;
  function g(_) {
    const N = d.reduce((T, V) => V(T), i());
    return u = Yf(N), h = u.cache.get, w = u.cache.set, v = b, b(_);
  }
  function b(_) {
    const N = h(_);
    if (N)
      return N;
    const T = Zf(_, u);
    return w(_, T), T;
  }
  return function() {
    return v(Jf.apply(null, arguments));
  };
}
const ve = (i) => {
  const d = (u) => u[i] || [];
  return d.isThemeGetter = !0, d;
}, qc = /^\[(?:([a-z-]+):)?(.+)\]$/i, tm = /^\d+\/\d+$/, rm = /* @__PURE__ */ new Set(["px", "full", "screen"]), nm = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, lm = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, om = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, im = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, am = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ot = (i) => Yr(i) || rm.has(i) || tm.test(i), ir = (i) => Zr(i, "length", hm), Yr = (i) => !!i && !Number.isNaN(Number(i)), ia = (i) => Zr(i, "number", Yr), Un = (i) => !!i && Number.isInteger(Number(i)), sm = (i) => i.endsWith("%") && Yr(i.slice(0, -1)), ee = (i) => qc.test(i), ar = (i) => nm.test(i), um = /* @__PURE__ */ new Set(["length", "size", "percentage"]), cm = (i) => Zr(i, um, Kc), dm = (i) => Zr(i, "position", Kc), pm = /* @__PURE__ */ new Set(["image", "url"]), fm = (i) => Zr(i, pm, xm), mm = (i) => Zr(i, "", gm), Hn = () => !0, Zr = (i, d, u) => {
  const h = qc.exec(i);
  return h ? h[1] ? typeof d == "string" ? h[1] === d : d.has(h[1]) : u(h[2]) : !1;
}, hm = (i) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  lm.test(i) && !om.test(i)
), Kc = () => !1, gm = (i) => im.test(i), xm = (i) => am.test(i), vm = () => {
  const i = ve("colors"), d = ve("spacing"), u = ve("blur"), h = ve("brightness"), w = ve("borderColor"), v = ve("borderRadius"), g = ve("borderSpacing"), b = ve("borderWidth"), _ = ve("contrast"), N = ve("grayscale"), T = ve("hueRotate"), V = ve("invert"), z = ve("gap"), G = ve("gradientColorStops"), S = ve("gradientColorStopPositions"), P = ve("inset"), R = ve("margin"), Z = ve("opacity"), W = ve("padding"), $ = ve("saturate"), Y = ve("scale"), oe = ve("sepia"), J = ve("skew"), ye = ve("space"), we = ve("translate"), _e = () => ["auto", "contain", "none"], Fe = () => ["auto", "hidden", "clip", "visible", "scroll"], Oe = () => ["auto", ee, d], le = () => [ee, d], $e = () => ["", Ot, ir], Ue = () => ["auto", Yr, ee], et = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Me = () => ["solid", "dashed", "dotted", "double", "none"], he = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], I = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], B = () => ["", "0", ee], D = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], m = () => [Yr, ee];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Hn],
      spacing: [Ot, ir],
      blur: ["none", "", ar, ee],
      brightness: m(),
      borderColor: [i],
      borderRadius: ["none", "", "full", ar, ee],
      borderSpacing: le(),
      borderWidth: $e(),
      contrast: m(),
      grayscale: B(),
      hueRotate: m(),
      invert: B(),
      gap: le(),
      gradientColorStops: [i],
      gradientColorStopPositions: [sm, ir],
      inset: Oe(),
      margin: Oe(),
      opacity: m(),
      padding: le(),
      saturate: m(),
      scale: m(),
      sepia: B(),
      skew: m(),
      space: le(),
      translate: le()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", ee]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [ar]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": D()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": D()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...et(), ee]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: Fe()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": Fe()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": Fe()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: _e()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": _e()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": _e()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [P]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [P]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [P]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [P]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [P]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [P]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [P]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [P]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [P]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", Un, ee]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: Oe()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", ee]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: B()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: B()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", Un, ee]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Hn]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Un, ee]
        }, ee]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": Ue()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": Ue()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [Hn]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Un, ee]
        }, ee]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": Ue()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": Ue()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", ee]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", ee]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [z]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [z]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [z]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...I()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...I(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...I(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [W]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [W]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [W]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [W]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [W]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [W]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [W]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [W]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [W]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [R]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [R]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [R]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [R]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [R]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [R]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [R]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [R]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [R]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [ye]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [ye]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", ee, d]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [ee, d, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [ee, d, "none", "full", "min", "max", "fit", "prose", {
          screen: [ar]
        }, ar]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [ee, d, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [ee, d, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [ee, d, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [ee, d, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", ar, ir]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", ia]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Hn]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", ee]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", Yr, ia]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Ot, ee]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", ee]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", ee]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [i]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [Z]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [i]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [Z]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...Me(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Ot, ir]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Ot, ee]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [i]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: le()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", ee]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", ee]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [Z]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...et(), dm]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", cm]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, fm]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [i]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [S]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [S]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [S]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [G]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [G]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [G]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [v]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [v]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [v]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [v]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [v]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [v]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [v]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [v]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [v]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [v]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [v]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [v]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [v]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [v]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [v]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [b]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [b]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [b]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [b]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [b]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [b]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [b]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [b]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [b]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [Z]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...Me(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [b]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [b]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [Z]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: Me()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [w]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [w]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [w]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [w]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [w]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [w]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [w]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [w]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [w]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [w]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...Me()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Ot, ee]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Ot, ir]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [i]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: $e()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [i]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [Z]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Ot, ir]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [i]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", ar, mm]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Hn]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [Z]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...he(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": he()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [u]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [h]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [_]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", ar, ee]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [N]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [T]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [V]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [$]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [oe]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [u]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [h]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [_]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [N]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [T]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [V]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [Z]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [$]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [oe]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [g]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [g]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [g]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", ee]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: m()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", ee]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: m()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", ee]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [Y]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [Y]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [Y]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [Un, ee]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [we]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [we]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [J]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [J]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", ee]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", i]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", ee]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [i]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": le()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": le()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": le()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": le()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": le()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": le()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": le()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": le()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": le()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": le()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": le()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": le()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": le()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": le()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": le()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": le()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": le()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": le()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", ee]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [i, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [Ot, ir, ia]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [i, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}, ym = /* @__PURE__ */ em(vm);
function jr(...i) {
  return ym(Vc(i));
}
const wm = Uf(
  "dt-inline-flex dt-items-center dt-justify-center dt-whitespace-nowrap dt-rounded-md dt-text-sm dt-font-medium dt-transition-colors focus-visible:dt-outline-none focus-visible:dt-ring-2 focus-visible:dt-ring-ring focus-visible:dt-ring-offset-2 disabled:dt-pointer-events-none disabled:dt-opacity-50",
  {
    variants: {
      variant: {
        default: "dt-bg-primary dt-text-primary-foreground hover:dt-bg-primary/90",
        ghost: "hover:dt-bg-accent hover:dt-text-accent-foreground"
      },
      size: {
        default: "dt-h-10 dt-px-4 dt-py-2",
        sm: "dt-h-9 dt-rounded-md dt-px-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), Gc = Q.forwardRef(
  ({ className: i, variant: d, size: u, asChild: h = !1, ...w }, v) => {
    const g = h ? If : "button";
    return /* @__PURE__ */ s.jsx(g, { className: jr(wm({ variant: d, size: u, className: i })), ref: v, ...w });
  }
);
Gc.displayName = "Button";
const Yc = Q.forwardRef(
  ({ className: i, ...d }, u) => /* @__PURE__ */ s.jsx("div", { className: "dt-relative dt-w-full dt-overflow-auto", children: /* @__PURE__ */ s.jsx("table", { ref: u, className: jr("dt-w-full dt-caption-bottom dt-text-sm", i), ...d }) })
);
Yc.displayName = "Table";
const Xc = Q.forwardRef(({ className: i, ...d }, u) => /* @__PURE__ */ s.jsx("thead", { ref: u, className: jr("[&_tr]:dt-border-b", i), ...d }));
Xc.displayName = "TableHeader";
const Zc = Q.forwardRef(({ className: i, ...d }, u) => /* @__PURE__ */ s.jsx("tbody", { ref: u, className: jr("[&_tr:last-child]:dt-border-0", i), ...d }));
Zc.displayName = "TableBody";
const ma = Q.forwardRef(
  ({ className: i, ...d }, u) => /* @__PURE__ */ s.jsx(
    "tr",
    {
      ref: u,
      className: jr(
        "dt-border-b dt-transition-colors hover:dt-bg-muted/50 data-[state=selected]:dt-bg-muted",
        i
      ),
      ...d
    }
  )
);
ma.displayName = "TableRow";
const Et = Q.forwardRef(({ className: i, ...d }, u) => /* @__PURE__ */ s.jsx(
  "th",
  {
    ref: u,
    className: jr(
      "dt-h-12 dt-px-4 dt-text-left dt-align-middle dt-font-medium dt-text-muted-foreground [&:has([role=checkbox])]:dt-pr-0",
      i
    ),
    ...d
  }
));
Et.displayName = "TableHead";
const Nt = Q.forwardRef(({ className: i, ...d }, u) => /* @__PURE__ */ s.jsx(
  "td",
  {
    ref: u,
    className: jr("dt-p-4 dt-align-middle [&:has([role=checkbox])]:dt-pr-0", i),
    ...d
  }
));
Nt.displayName = "TableCell";
function zc(i) {
  return i ? i.split(" | ").map((d) => d.replace("/", "-")) : ["·"];
}
function km({
  label: i,
  active: d,
  dir: u,
  onClick: h
}) {
  const w = d ? u === 1 ? wf : vf : yf;
  return /* @__PURE__ */ s.jsxs(Gc, { variant: "ghost", size: "sm", onClick: h, className: "dt--ml-3", children: [
    i,
    /* @__PURE__ */ s.jsx(w, { className: `dt-ml-1.5 dt-inline dt-size-3.5${d ? "" : " dt-opacity-40"}` })
  ] });
}
function Jc(i) {
  const { rows: d, sortKey: u, sortDir: h, onSortChange: w, onRowClick: v, onToggleSelect: g, onToggleFavorite: b, allSelected: _, onSelectAll: N, emptyMessage: T, ariaLabel: V, labels: z } = i;
  if (!d.length)
    return /* @__PURE__ */ s.jsx("p", { className: "dt-p-6 dt-text-center dt-text-sm dt-text-muted-foreground", children: T });
  const G = (S, P) => /* @__PURE__ */ s.jsx(km, { label: P, active: u === S, dir: h, onClick: () => w(S) });
  return /* @__PURE__ */ s.jsx("div", { className: "dersler-table-root dt-overflow-hidden dt-rounded-lg dt-border dt-border-border", children: /* @__PURE__ */ s.jsxs(Yc, { "aria-label": V, children: [
    /* @__PURE__ */ s.jsx(Xc, { children: /* @__PURE__ */ s.jsxs(ma, { children: [
      /* @__PURE__ */ s.jsx(Et, { className: "dt-h-9 dt-w-8 dt-p-2", children: /* @__PURE__ */ s.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: _,
          "aria-label": z.selectAll,
          onChange: (S) => N(S.target.checked)
        }
      ) }),
      /* @__PURE__ */ s.jsx(Et, { className: "dt-h-9 dt-w-8 dt-p-2" }),
      /* @__PURE__ */ s.jsx(Et, { className: "dt-h-9 dt-p-2", children: G("crn", z.crn) }),
      /* @__PURE__ */ s.jsx(Et, { className: "dt-h-9 dt-p-2", children: G("code", z.code) }),
      /* @__PURE__ */ s.jsx(Et, { className: "dt-h-9 dt-p-2", children: G("name", z.name) }),
      /* @__PURE__ */ s.jsx(Et, { className: "dt-h-9 dt-p-2", children: G("instructor", z.instructor) }),
      /* @__PURE__ */ s.jsx(Et, { className: "dt-h-9 dt-p-2", children: G("when", z.when) }),
      /* @__PURE__ */ s.jsx(Et, { className: "dt-h-9 dt-p-2", children: z.where }),
      /* @__PURE__ */ s.jsx(Et, { className: "dt-h-9 dt-p-2 dt-text-right", children: G("fill", z.fill) })
    ] }) }),
    /* @__PURE__ */ s.jsx(Zc, { children: d.map((S) => /* @__PURE__ */ s.jsxs(ma, { className: "dt-cursor-pointer", onClick: () => v(S.key), children: [
      /* @__PURE__ */ s.jsx(Nt, { className: "dt-p-2", onClick: (P) => P.stopPropagation(), children: /* @__PURE__ */ s.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: S.selected,
          "aria-label": z.selectSection,
          onChange: (P) => g(S.key, P.target.checked)
        }
      ) }),
      /* @__PURE__ */ s.jsx(Nt, { className: "dt-p-2", onClick: (P) => P.stopPropagation(), children: /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: "dt-text-base dt-leading-none",
          "aria-label": S.favorite ? z.removeFav : z.addFav,
          "aria-pressed": S.favorite,
          onClick: () => b(S.key),
          children: /* @__PURE__ */ s.jsx(Pf, { "aria-hidden": "true", className: "dt-size-4", fill: S.favorite ? "currentColor" : "none" })
        }
      ) }),
      /* @__PURE__ */ s.jsx(Nt, { className: "dt-p-2 dt-font-mono dt-text-muted-foreground", dangerouslySetInnerHTML: { __html: S.crnHTML } }),
      /* @__PURE__ */ s.jsx(Nt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: S.codeHTML } }),
      /* @__PURE__ */ s.jsx(Nt, { className: "dt-p-2", children: /* @__PURE__ */ s.jsxs("div", { className: "dt-course-name", children: [
        /* @__PURE__ */ s.jsx("span", { dangerouslySetInnerHTML: { __html: S.nameHTML } }),
        S.kind && /* @__PURE__ */ s.jsxs("span", { className: `dt-kind-badge ${S.kind}`, title: S.kindHelp, children: [
          S.kind === "extra-exam" ? /* @__PURE__ */ s.jsx(sa, { "aria-hidden": "true" }) : /* @__PURE__ */ s.jsx(Bn, { "aria-hidden": "true" }),
          /* @__PURE__ */ s.jsx("b", { children: S.kindLabel })
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx(Nt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: S.instructorHTML } }),
      /* @__PURE__ */ s.jsx(Nt, { className: "dt-p-2 dt-font-mono dt-text-xs", children: zc(S.when).map((P, R) => /* @__PURE__ */ s.jsx("div", { children: P }, R)) }),
      /* @__PURE__ */ s.jsx(Nt, { className: "dt-p-2 dt-text-xs dt-text-muted-foreground", children: S.where ? zc(S.where).map((P, R) => /* @__PURE__ */ s.jsx("div", { children: P }, R)) : "·" }),
      /* @__PURE__ */ s.jsx(Nt, { className: "dt-p-2 dt-text-right dt-tabular-nums", dangerouslySetInnerHTML: { __html: S.quotaHTML } })
    ] }, S.key)) })
  ] }) });
}
const Sr = (i) => `${String(Math.floor(i / 60)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`;
function ed(i) {
  const d = [...i].sort((v, g) => v.start - g.start || v.end - g.end), u = [], h = d.map((v) => {
    let g = u.findIndex((b) => b <= v.start);
    return g < 0 ? (g = u.length, u.push(v.end)) : u[g] = v.end, { ...v, lane: g, laneCount: 1, conflict: !1 };
  }), w = Math.max(1, u.length);
  return h.map((v) => ({
    ...v,
    laneCount: w,
    conflict: h.some((g) => g.key !== v.key && v.start < g.end && g.start < v.end)
  }));
}
function bm() {
  const i = "(max-width: 600px)", [d, u] = Q.useState(() => window.matchMedia(i).matches);
  return Q.useEffect(() => {
    const h = window.matchMedia(i), w = () => u(h.matches);
    return h.addEventListener("change", w), () => h.removeEventListener("change", w);
  }, []), d;
}
function td({ session: i, compact: d = !1 }) {
  return /* @__PURE__ */ s.jsxs("span", { className: "pp-session-meta", children: [
    /* @__PURE__ */ s.jsxs("span", { children: [
      /* @__PURE__ */ s.jsx(Wn, { "aria-hidden": "true" }),
      Sr(i.start),
      "–",
      Sr(i.end)
    ] }),
    /* @__PURE__ */ s.jsxs("span", { children: [
      /* @__PURE__ */ s.jsx(xa, { "aria-hidden": "true" }),
      i.crn
    ] }),
    !d && i.instructor && /* @__PURE__ */ s.jsxs("span", { children: [
      /* @__PURE__ */ s.jsx(ur, { "aria-hidden": "true" }),
      i.instructor
    ] }),
    !d && i.where && /* @__PURE__ */ s.jsxs("span", { children: [
      /* @__PURE__ */ s.jsx(Qn, { "aria-hidden": "true" }),
      i.where
    ] })
  ] });
}
function Sm({ props: i, visibleDays: d }) {
  const u = d.find((g) => i.sessions.some((b) => b.day === g)) ?? d[0], [h, w] = Q.useState(u);
  Q.useEffect(() => {
    d.includes(h) || w(u);
  }, [h, u, d]);
  const v = ed(i.sessions.filter((g) => g.day === h));
  return /* @__PURE__ */ s.jsxs("div", { className: "pp-agenda", children: [
    /* @__PURE__ */ s.jsx("div", { className: "pp-day-tabs", role: "tablist", "aria-label": i.labels.title, style: { "--pp-days": d.length }, children: d.map((g) => /* @__PURE__ */ s.jsxs("button", { type: "button", role: "tab", "aria-selected": h === g, className: h === g ? "is-active" : "", onClick: () => w(g), children: [
      i.dayLabels[g],
      i.sessions.some((b) => b.day === g) && /* @__PURE__ */ s.jsx("span", { "aria-hidden": "true" })
    ] }, g)) }),
    /* @__PURE__ */ s.jsx("div", { className: "pp-agenda-list", children: v.length ? v.map((g) => /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: `pp-agenda-card${g.conflict ? " is-conflict" : ""}`,
        style: { "--pp-color": g.color },
        onClick: () => i.onOpen(g.rowKey),
        children: [
          /* @__PURE__ */ s.jsxs("span", { className: "pp-agenda-time", children: [
            /* @__PURE__ */ s.jsx("b", { children: Sr(g.start) }),
            /* @__PURE__ */ s.jsx("small", { children: Sr(g.end) })
          ] }),
          /* @__PURE__ */ s.jsxs("span", { className: "pp-agenda-copy", children: [
            /* @__PURE__ */ s.jsxs("strong", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "pp-color-dot" }),
              g.code
            ] }),
            /* @__PURE__ */ s.jsx("span", { className: "pp-agenda-name", children: g.name }),
            /* @__PURE__ */ s.jsx(td, { session: g, compact: !0 }),
            g.instructor && /* @__PURE__ */ s.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ s.jsx(ur, { "aria-hidden": "true" }),
              g.instructor
            ] }),
            g.where && /* @__PURE__ */ s.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ s.jsx(Qn, { "aria-hidden": "true" }),
              g.where
            ] }),
            g.conflict && /* @__PURE__ */ s.jsxs("em", { children: [
              /* @__PURE__ */ s.jsx(Tc, { "aria-hidden": "true" }),
              i.labels.conflict
            ] })
          ] })
        ]
      },
      g.key
    )) : /* @__PURE__ */ s.jsxs("div", { className: "pp-empty-day", children: [
      /* @__PURE__ */ s.jsx(Vn, { "aria-hidden": "true" }),
      /* @__PURE__ */ s.jsx("p", { children: i.labels.emptyDay })
    ] }) })
  ] });
}
function rd(i) {
  const d = bm(), [u, h] = Q.useState(null), [w, v] = Q.useState(null), g = i.sessions.some(($) => $.day >= 5), b = i.showWeekend || g ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4], _ = i.sessions.length > 0, N = Q.useMemo(() => {
    if (!_) return { start: 480, end: 1080 };
    const $ = Math.min(...i.sessions.map((oe) => oe.start)), Y = Math.max(...i.sessions.map((oe) => oe.end));
    return i.showFullDay ? { start: 420, end: 1380 } : { start: Math.min(510, $), end: Math.min(1440, Y + 60) };
  }, [i.sessions, i.showFullDay, _]), T = 34, V = Math.max(1, Math.ceil((N.end - N.start) / 30)), z = V * T, G = /* @__PURE__ */ new Date(), S = (G.getDay() + 6) % 7, P = G.getHours() * 60 + G.getMinutes(), R = (P - N.start) / 30 * T;
  Q.useEffect(() => {
    if (!u) return;
    const $ = () => h(null);
    return window.addEventListener("pointerdown", $, { once: !0 }), window.addEventListener("blur", $, { once: !0 }), () => {
      window.removeEventListener("pointerdown", $), window.removeEventListener("blur", $);
    };
  }, [u]);
  const Z = ($, Y) => {
    $.preventDefault(), $.stopPropagation(), h({ session: Y, x: Math.min($.clientX, window.innerWidth - 232), y: Math.min($.clientY, window.innerHeight - 230) });
  }, W = ($, Y) => {
    const oe = $.getBoundingClientRect(), J = 286, ye = Math.max(10, Math.min(oe.left + oe.width / 2 - J / 2, window.innerWidth - J - 10)), we = oe.top < 190;
    v({ session: Y, x: ye, y: we ? oe.bottom + 9 : oe.top - 9, side: we ? "bottom" : "top" });
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "dersler-table-root program-planner-root", "aria-label": i.labels.title, children: [
    /* @__PURE__ */ s.jsxs("header", { className: "pp-heading", children: [
      /* @__PURE__ */ s.jsx("span", { className: "pp-heading-icon", children: /* @__PURE__ */ s.jsx(Vn, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ s.jsxs("span", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: i.labels.title }),
        /* @__PURE__ */ s.jsxs("small", { children: [
          i.sessions.length,
          " ",
          i.labels.sessions,
          " · ",
          i.sectionCount,
          " ",
          i.labels.sections
        ] })
      ] })
    ] }),
    !_ && !i.untimed.length ? /* @__PURE__ */ s.jsxs("div", { className: "pp-empty", children: [
      /* @__PURE__ */ s.jsx(va, { "aria-hidden": "true" }),
      /* @__PURE__ */ s.jsx("strong", { children: i.labels.empty })
    ] }) : d && !i.forceGrid ? /* @__PURE__ */ s.jsx(Sm, { props: i, visibleDays: b }) : _ ? /* @__PURE__ */ s.jsx("div", { className: "pp-calendar-scroll", children: /* @__PURE__ */ s.jsxs("div", { className: "pp-calendar", style: { "--pp-days": b.length }, children: [
      /* @__PURE__ */ s.jsxs("div", { className: "pp-calendar-head", children: [
        /* @__PURE__ */ s.jsx("span", {}),
        b.map(($) => /* @__PURE__ */ s.jsx("b", { children: i.dayLabels[$] }, $))
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "pp-calendar-body", children: [
        /* @__PURE__ */ s.jsx("div", { className: "pp-time-column", style: { height: z }, children: Array.from({ length: V }, ($, Y) => /* @__PURE__ */ s.jsx("span", { children: Sr(N.start + Y * 30) }, Y)) }),
        b.map(($) => {
          const Y = ed(i.sessions.filter((J) => J.day === $)), oe = i.showNow && $ === S && P >= N.start && P < N.end;
          return /* @__PURE__ */ s.jsxs("div", { className: `pp-day-column${$ >= 5 ? " is-weekend" : ""}`, style: { height: z }, children: [
            oe && /* @__PURE__ */ s.jsx("span", { className: "pp-now", style: { top: R } }),
            Y.map((J) => {
              const ye = (J.start - N.start) / 30 * T, we = Math.max(30, (J.end - J.start) / 30 * T), _e = 100 / J.laneCount, Fe = we < 104;
              return /* @__PURE__ */ s.jsxs(
                "button",
                {
                  type: "button",
                  className: `pp-session${Fe ? " is-short" : ""}${J.conflict ? " is-conflict" : ""}`,
                  style: {
                    top: ye,
                    height: we,
                    left: `calc(${J.lane * _e}% + 3px)`,
                    width: `calc(${_e}% - 6px)`,
                    "--pp-color": J.color,
                    "--pp-foreground": J.foreground
                  },
                  "aria-describedby": (w == null ? void 0 : w.session.key) === J.key ? "pp-course-tooltip" : void 0,
                  onClick: () => i.onOpen(J.rowKey),
                  onContextMenu: (Oe) => Z(Oe, J),
                  onMouseEnter: (Oe) => W(Oe.currentTarget, J),
                  onMouseLeave: () => v(null),
                  onFocus: (Oe) => W(Oe.currentTarget, J),
                  onBlur: () => v(null),
                  children: [
                    /* @__PURE__ */ s.jsx(zf, { className: "pp-pin", "aria-hidden": "true" }),
                    /* @__PURE__ */ s.jsxs("strong", { children: [
                      J.code,
                      ": ",
                      /* @__PURE__ */ s.jsx("span", { children: J.name })
                    ] }),
                    /* @__PURE__ */ s.jsx(td, { session: J, compact: Fe }),
                    J.conflict && /* @__PURE__ */ s.jsxs("span", { className: "pp-conflict", children: [
                      /* @__PURE__ */ s.jsx(Tc, { "aria-hidden": "true" }),
                      i.labels.conflict
                    ] }),
                    /* @__PURE__ */ s.jsx(Lc, { className: "pp-more", "aria-hidden": "true" })
                  ]
                },
                J.key
              );
            })
          ] }, $);
        })
      ] })
    ] }) }) : null,
    !!i.untimed.length && /* @__PURE__ */ s.jsxs("div", { className: "pp-untimed", children: [
      /* @__PURE__ */ s.jsx(Bn, { "aria-hidden": "true" }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: i.untimed.some(($) => $.special) ? i.labels.special : i.labels.unknown }),
        i.untimed.map(($) => /* @__PURE__ */ s.jsxs("span", { children: [
          /* @__PURE__ */ s.jsx("b", { children: $.code }),
          " · CRN ",
          $.crn,
          " — ",
          $.detail
        ] }, $.key))
      ] })
    ] }),
    u && /* @__PURE__ */ s.jsxs("div", { className: "pp-context", role: "menu", "aria-label": `${u.session.code} ${i.labels.actions}`, style: { left: u.x, top: u.y }, onPointerDown: ($) => $.stopPropagation(), children: [
      /* @__PURE__ */ s.jsxs("p", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: u.session.code }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          "CRN ",
          u.session.crn
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        i.onOpen(u.session.rowKey), h(null);
      }, children: [
        /* @__PURE__ */ s.jsx(Vn, {}),
        i.labels.details
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        i.onCopyCrn(u.session.rowKey), h(null);
      }, children: [
        /* @__PURE__ */ s.jsx(aa, {}),
        i.labels.copyCrn
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        i.onOpenObs(u.session.rowKey), h(null);
      }, children: [
        /* @__PURE__ */ s.jsx(ga, {}),
        i.labels.openObs
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", role: "menuitem", className: "is-danger", onClick: () => {
        i.onRemove(u.session.rowKey), h(null);
      }, children: [
        /* @__PURE__ */ s.jsx(ca, {}),
        i.labels.remove
      ] })
    ] }),
    w && /* @__PURE__ */ s.jsxs("div", { id: "pp-course-tooltip", className: "pp-tooltip", role: "tooltip", style: { left: w.x, top: w.y }, "data-side": w.side, children: [
      /* @__PURE__ */ s.jsxs("div", { className: "pp-tooltip-title", children: [
        /* @__PURE__ */ s.jsx("span", { style: { background: w.session.color } }),
        /* @__PURE__ */ s.jsx("strong", { children: w.session.code }),
        /* @__PURE__ */ s.jsxs("b", { children: [
          Sr(w.session.start),
          "–",
          Sr(w.session.end)
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: w.session.name }),
      /* @__PURE__ */ s.jsxs("dl", { children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: /* @__PURE__ */ s.jsx(xa, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ s.jsx("dd", { children: w.session.crn })
        ] }),
        w.session.instructor && /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: /* @__PURE__ */ s.jsx(ur, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ s.jsx("dd", { children: w.session.instructor })
        ] }),
        w.session.where && /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: /* @__PURE__ */ s.jsx(Qn, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ s.jsx("dd", { children: w.session.where })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("small", { children: [
        i.labels.details,
        " · sağ tık: ",
        i.labels.actions
      ] })
    ] })
  ] });
}
function nd({ html: i, empty: d, emptyMessage: u, ariaLabel: h }) {
  const w = Q.useRef(null), v = Q.useRef(null), g = Q.useRef(null), [b, _] = Q.useState(null);
  Q.useLayoutEffect(() => {
    const S = w.current;
    if (!S) return;
    [...S.querySelectorAll("select.dp-grade")].forEach((R, Z) => {
      var Y, oe;
      R.hidden = !0, R.tabIndex = -1;
      const W = document.createElement("button");
      W.type = "button", W.className = `cp-grade-trigger${R.value ? " filled" : ""}`, W.dataset.gradeIndex = String(Z), W.setAttribute("aria-haspopup", "listbox"), W.setAttribute("aria-expanded", "false"), W.setAttribute("aria-label", R.getAttribute("aria-label") || "Not seç");
      const $ = document.createElement("span");
      $.textContent = ((Y = R.selectedOptions[0]) == null ? void 0 : Y.textContent) || ((oe = R.options[0]) == null ? void 0 : oe.textContent) || "—", W.appendChild($), W.insertAdjacentHTML("beforeend", '<svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'), R.insertAdjacentElement("afterend", W);
    });
  }, [i]), Q.useEffect(() => _(null), [i]), Q.useEffect(() => {
    if (!b) return;
    const S = (Z) => {
      var $, Y;
      const W = Z.target;
      ($ = g.current) != null && $.contains(W) || (Y = v.current) != null && Y.contains(W) || _(null);
    }, P = () => _(null);
    window.addEventListener("pointerdown", S);
    const R = window.matchMedia("(min-width: 561px)").matches;
    return R && window.addEventListener("scroll", P, !0), window.addEventListener("resize", P), b.keyboard && requestAnimationFrame(() => {
      var Z, W;
      return (W = (Z = g.current) == null ? void 0 : Z.querySelector('[aria-selected="true"]')) == null ? void 0 : W.focus({ preventScroll: !0 });
    }), () => {
      window.removeEventListener("pointerdown", S), R && window.removeEventListener("scroll", P, !0), window.removeEventListener("resize", P);
    };
  }, [b]);
  const N = (S, P = !1) => {
    var ye, we;
    const R = Number(S.dataset.gradeIndex), Z = (ye = w.current) == null ? void 0 : ye.querySelectorAll("select.dp-grade")[R];
    if (!Z) return;
    const W = S.getBoundingClientRect(), $ = 246, Y = window.innerHeight - W.bottom < $ && W.top > $, oe = Math.min(292, window.innerWidth - 20), J = Math.max(10, Math.min(W.right - oe, window.innerWidth - oe - 10));
    (we = v.current) == null || we.setAttribute("aria-expanded", "false"), v.current = S, S.setAttribute("aria-expanded", "true"), _({
      selectIndex: R,
      options: [...Z.options].map((_e) => ({ value: _e.value, label: _e.textContent || _e.value })),
      value: Z.value,
      label: Z.getAttribute("aria-label") || "Not seç",
      x: J,
      y: Y ? W.top - 7 : W.bottom + 7,
      above: Y,
      keyboard: P
    });
  }, T = (S) => {
    const P = S.target.closest(".cp-grade-trigger");
    if (P) {
      if (S.preventDefault(), P === v.current && b) {
        P.setAttribute("aria-expanded", "false"), _(null);
        return;
      }
      N(P);
    }
  }, V = (S) => {
    var R;
    if (S.key === "Escape" && b) {
      S.preventDefault(), (R = v.current) == null || R.setAttribute("aria-expanded", "false"), _(null);
      return;
    }
    const P = S.target.closest(".cp-grade-trigger");
    !P || !["Enter", " ", "ArrowDown", "ArrowUp"].includes(S.key) || (S.preventDefault(), N(P, !0));
  }, z = (S) => {
    var R, Z, W;
    if (!b) return;
    const P = (R = w.current) == null ? void 0 : R.querySelectorAll("select.dp-grade")[b.selectIndex];
    P && (P.value = S, P.dispatchEvent(new Event("change", { bubbles: !0 })), (Z = v.current) == null || Z.setAttribute("aria-expanded", "false"), (W = v.current) == null || W.focus(), _(null));
  }, G = (S) => {
    var W, $, Y;
    if (S.key === "Escape") {
      S.preventDefault(), (W = v.current) == null || W.setAttribute("aria-expanded", "false"), ($ = v.current) == null || $.focus(), _(null);
      return;
    }
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(S.key)) return;
    S.preventDefault();
    const P = [...S.currentTarget.querySelectorAll('[role="option"]')], R = Math.max(0, P.indexOf(document.activeElement)), Z = S.key === "ArrowDown" || S.key === "ArrowRight" ? 1 : -1;
    (Y = P[(R + Z + P.length) % P.length]) == null || Y.focus();
  };
  return d ? /* @__PURE__ */ s.jsxs("div", { className: "curriculum-plan-root cp-empty", role: "status", children: [
    /* @__PURE__ */ s.jsx(va, { "aria-hidden": "true" }),
    /* @__PURE__ */ s.jsx("strong", { children: u })
  ] }) : /* @__PURE__ */ s.jsxs("section", { className: "curriculum-plan-root", "aria-label": h, onClick: T, onKeyDown: V, children: [
    /* @__PURE__ */ s.jsx("div", { ref: w, className: "cp-semester-grid", dangerouslySetInnerHTML: { __html: i } }),
    b && /* @__PURE__ */ s.jsx(
      "div",
      {
        ref: g,
        className: `cp-grade-menu${b.above ? " above" : ""}`,
        role: "listbox",
        "aria-label": b.label,
        style: { "--cp-menu-x": `${b.x}px`, "--cp-menu-y": `${b.y}px` },
        onKeyDown: G,
        children: b.options.map((S) => /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": S.value === b.value,
            className: S.value ? "" : "is-empty",
            onClick: () => z(S.value),
            children: [
              /* @__PURE__ */ s.jsx("span", { children: S.label }),
              S.value === b.value && /* @__PURE__ */ s.jsx(Sf, { "aria-hidden": "true" })
            ]
          },
          S.value || "empty"
        ))
      }
    )
  ] });
}
function jm() {
  const i = "(max-width: 700px)", [d, u] = Q.useState(() => window.matchMedia(i).matches);
  return Q.useEffect(() => {
    const h = window.matchMedia(i), w = () => u(h.matches);
    return h.addEventListener("change", w), () => h.removeEventListener("change", w);
  }, []), d;
}
function Cm({ message: i }) {
  return /* @__PURE__ */ s.jsxs("div", { className: "ex-empty", children: [
    /* @__PURE__ */ s.jsx(va, { "aria-hidden": "true" }),
    /* @__PURE__ */ s.jsx("strong", { children: i })
  ] });
}
function Em({ props: i }) {
  return /* @__PURE__ */ s.jsxs("div", { className: "ex-table", role: "table", "aria-label": i.ariaLabel, children: [
    /* @__PURE__ */ s.jsxs("div", { className: `ex-head${i.showPlace ? "" : " without-place"}`, role: "row", children: [
      /* @__PURE__ */ s.jsx("span", { role: "columnheader", children: i.labels.course }),
      /* @__PURE__ */ s.jsx("span", { role: "columnheader", children: i.labels.instructor }),
      /* @__PURE__ */ s.jsx("span", { role: "columnheader", children: i.labels.type }),
      i.showPlace && /* @__PURE__ */ s.jsx("span", { role: "columnheader", children: i.labels.place }),
      /* @__PURE__ */ s.jsxs("span", { role: "columnheader", children: [
        i.labels.date,
        " / ",
        i.labels.time
      ] })
    ] }),
    /* @__PURE__ */ s.jsx("div", { role: "rowgroup", children: i.rows.map((d) => /* @__PURE__ */ s.jsxs("div", { className: `ex-row${i.showPlace ? "" : " without-place"}`, role: "row", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "ex-course", role: "cell", children: [
        /* @__PURE__ */ s.jsx("button", { type: "button", onClick: () => i.onOpen(d.code), children: d.code }),
        /* @__PURE__ */ s.jsx("strong", { children: d.name }),
        /* @__PURE__ */ s.jsxs("small", { children: [
          /* @__PURE__ */ s.jsx(xa, { "aria-hidden": "true" }),
          d.crn
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ s.jsx(ur, { "aria-hidden": "true" }),
        d.instructor || "·"
      ] }),
      /* @__PURE__ */ s.jsx("span", { role: "cell", children: /* @__PURE__ */ s.jsx("em", { className: "ex-type", children: d.type }) }),
      i.showPlace && /* @__PURE__ */ s.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ s.jsx(Qn, { "aria-hidden": "true" }),
        d.place || "·"
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "ex-when", role: "cell", children: [
        /* @__PURE__ */ s.jsxs("strong", { children: [
          /* @__PURE__ */ s.jsx(Vn, { "aria-hidden": "true" }),
          d.date
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          /* @__PURE__ */ s.jsx(Wn, { "aria-hidden": "true" }),
          d.day,
          " ",
          d.time
        ] })
      ] })
    ] }, d.key)) })
  ] });
}
function Nm({ props: i }) {
  const d = Q.useMemo(() => {
    const u = [], h = /* @__PURE__ */ new Map();
    return i.rows.forEach((w) => {
      let v = h.get(w.date);
      v || (v = { date: w.date, day: w.day, exams: [] }, h.set(w.date, v), u.push(v)), v.exams.push(w);
    }), u;
  }, [i.rows]);
  return /* @__PURE__ */ s.jsx("div", { className: "ex-agenda", "aria-label": i.ariaLabel, children: d.map((u) => /* @__PURE__ */ s.jsxs("section", { className: "ex-day", children: [
    /* @__PURE__ */ s.jsxs("header", { children: [
      /* @__PURE__ */ s.jsx(Vn, { "aria-hidden": "true" }),
      /* @__PURE__ */ s.jsx("strong", { children: u.date }),
      /* @__PURE__ */ s.jsx("span", { children: u.day })
    ] }),
    /* @__PURE__ */ s.jsx("div", { children: u.exams.map((h) => /* @__PURE__ */ s.jsxs("article", { className: "ex-card", children: [
      /* @__PURE__ */ s.jsxs("span", { className: "ex-card-time", children: [
        /* @__PURE__ */ s.jsx(Wn, { "aria-hidden": "true" }),
        /* @__PURE__ */ s.jsx("b", { children: h.time })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "ex-card-main", children: [
        /* @__PURE__ */ s.jsx("button", { type: "button", onClick: () => i.onOpen(h.code), children: h.code }),
        /* @__PURE__ */ s.jsx("strong", { children: h.name }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          /* @__PURE__ */ s.jsx(Bn, { "aria-hidden": "true" }),
          h.type,
          /* @__PURE__ */ s.jsx("i", { "aria-hidden": "true" }),
          "CRN ",
          h.crn
        ] }),
        h.instructor && /* @__PURE__ */ s.jsxs("span", { children: [
          /* @__PURE__ */ s.jsx(ur, { "aria-hidden": "true" }),
          h.instructor
        ] }),
        i.showPlace && h.place && /* @__PURE__ */ s.jsxs("span", { children: [
          /* @__PURE__ */ s.jsx(Qn, { "aria-hidden": "true" }),
          h.place
        ] })
      ] })
    ] }, h.key)) })
  ] }, u.date)) });
}
function ld(i) {
  const d = jm();
  return /* @__PURE__ */ s.jsx("section", { className: "dersler-table-root exams-list-root", children: i.rows.length ? d ? /* @__PURE__ */ s.jsx(Nm, { props: i }) : /* @__PURE__ */ s.jsx(Em, { props: i }) : /* @__PURE__ */ s.jsx(Cm, { message: i.emptyMessage }) });
}
function od({ items: i, labels: d, onOpen: u, onCopy: h, onOpenObs: w, onRemove: v, onReorder: g }) {
  const [b, _] = Q.useState(null), [N, T] = Q.useState(null);
  if (!i.length) return /* @__PURE__ */ s.jsxs("div", { className: "pcl-empty", children: [
    /* @__PURE__ */ s.jsx(io, { "aria-hidden": "true" }),
    /* @__PURE__ */ s.jsx("strong", { children: d.empty })
  ] });
  const V = (z, G) => {
    z.preventDefault(), N !== null && N !== G && g(N, G), T(null);
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "pcl-list", role: "table", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "pcl-head", role: "row", children: [
      /* @__PURE__ */ s.jsx("span", { role: "columnheader", children: d.course }),
      /* @__PURE__ */ s.jsx("span", { role: "columnheader", children: d.quota })
    ] }),
    i.map((z, G) => /* @__PURE__ */ s.jsxs(
      "article",
      {
        className: `pcl-item${z.full ? " is-full" : ""}`,
        role: "row",
        draggable: !0,
        onDragStart: () => T(G),
        onDragOver: (S) => S.preventDefault(),
        onDrop: (S) => V(S, G),
        onClick: (S) => {
          S.target.closest("button") || u(z.key);
        },
        children: [
          /* @__PURE__ */ s.jsx(Cf, { className: "pcl-grip", "aria-hidden": "true" }),
          /* @__PURE__ */ s.jsxs("div", { className: "pcl-course", role: "cell", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "pcl-title", children: [
              /* @__PURE__ */ s.jsx("strong", { children: z.code }),
              z.badge && /* @__PURE__ */ s.jsx("span", { children: z.badge })
            ] }),
            /* @__PURE__ */ s.jsx("p", { children: z.name }),
            /* @__PURE__ */ s.jsxs("div", { className: "pcl-meta", children: [
              /* @__PURE__ */ s.jsxs("span", { children: [
                /* @__PURE__ */ s.jsx(Wn, { "aria-hidden": "true" }),
                z.when
              ] }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                /* @__PURE__ */ s.jsx(ur, { "aria-hidden": "true" }),
                z.instructor
              ] })
            ] }),
            z.credit && /* @__PURE__ */ s.jsx("small", { children: z.credit })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "pcl-numbers", role: "cell", children: [
            /* @__PURE__ */ s.jsx("b", { children: z.quota }),
            /* @__PURE__ */ s.jsxs("span", { children: [
              "CRN ",
              z.crn
            ] }),
            z.backup && /* @__PURE__ */ s.jsx("em", { children: z.backup })
          ] }),
          /* @__PURE__ */ s.jsx("button", { className: "pcl-remove", type: "button", onClick: () => v(z.key), "aria-label": `${z.code} ${d.remove}`, children: /* @__PURE__ */ s.jsx(ca, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "pcl-menu-wrap", children: [
            /* @__PURE__ */ s.jsxs("button", { className: "pcl-menu-trigger", type: "button", "aria-expanded": b === z.key, "aria-haspopup": "menu", onClick: () => _(b === z.key ? null : z.key), children: [
              /* @__PURE__ */ s.jsx(Lc, { "aria-hidden": "true" }),
              /* @__PURE__ */ s.jsxs("span", { className: "sr-only", children: [
                z.code,
                " ",
                d.actions
              ] })
            ] }),
            b === z.key && /* @__PURE__ */ s.jsxs("div", { className: "pcl-menu", role: "menu", children: [
              /* @__PURE__ */ s.jsxs("button", { role: "menuitem", onClick: () => {
                u(z.key), _(null);
              }, children: [
                /* @__PURE__ */ s.jsx(io, {}),
                d.details
              ] }),
              /* @__PURE__ */ s.jsxs("button", { role: "menuitem", onClick: () => {
                h(z.key, "crn"), _(null);
              }, children: [
                /* @__PURE__ */ s.jsx(aa, {}),
                d.copyCrn
              ] }),
              /* @__PURE__ */ s.jsxs("button", { role: "menuitem", onClick: () => {
                h(z.key, "code"), _(null);
              }, children: [
                /* @__PURE__ */ s.jsx(aa, {}),
                d.copyCode
              ] }),
              z.instructor && /* @__PURE__ */ s.jsxs("button", { role: "menuitem", onClick: () => {
                h(z.key, "instructor"), _(null);
              }, children: [
                /* @__PURE__ */ s.jsx(ur, {}),
                d.copyInstructor
              ] }),
              /* @__PURE__ */ s.jsxs("button", { role: "menuitem", onClick: () => {
                w(z.key), _(null);
              }, children: [
                /* @__PURE__ */ s.jsx(ga, {}),
                d.openObs
              ] }),
              /* @__PURE__ */ s.jsxs("button", { role: "menuitem", "data-act": "remove", className: "is-danger", onClick: () => {
                v(z.key), _(null);
              }, children: [
                /* @__PURE__ */ s.jsx(ca, {}),
                d.remove
              ] })
            ] })
          ] })
        ]
      },
      z.key
    ))
  ] });
}
const zm = { overview: io, sections: Ef, catalog: Nf, history: ua };
function _m({ data: i }) {
  const [d, u] = Q.useState("required"), h = [
    { key: "required", label: i.requiredLabel, icon: jf },
    { key: "unlocks", label: i.unlocksLabel, icon: Mf }
  ], w = (v, g) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(v.key)) return;
    v.preventDefault();
    const b = v.key === "Home" ? 0 : v.key === "End" ? h.length - 1 : (g + (v.key === "ArrowRight" ? 1 : -1) + h.length) % h.length;
    u(h[b].key), requestAnimationFrame(() => {
      var _;
      return (_ = document.getElementById(`cdr-req-tab-${h[b].key}`)) == null ? void 0 : _.focus();
    });
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "cdr-prereq", "aria-label": `${i.requiredLabel} / ${i.unlocksLabel}`, children: [
    /* @__PURE__ */ s.jsx("nav", { className: "cdr-prereq-tabs", role: "tablist", children: h.map((v, g) => {
      const b = v.icon;
      return /* @__PURE__ */ s.jsxs("button", { type: "button", role: "tab", id: `cdr-req-tab-${v.key}`, "aria-controls": `cdr-req-panel-${v.key}`, "aria-selected": d === v.key, tabIndex: d === v.key ? 0 : -1, onClick: () => u(v.key), onKeyDown: (_) => w(_, g), children: [
        /* @__PURE__ */ s.jsx(b, { "aria-hidden": "true" }),
        /* @__PURE__ */ s.jsx("span", { children: v.label }),
        v.key === "unlocks" && /* @__PURE__ */ s.jsx("b", { "data-req-count": !0, children: "…" })
      ] }, v.key);
    }) }),
    /* @__PURE__ */ s.jsxs("div", { className: "cdr-prereq-body", children: [
      /* @__PURE__ */ s.jsx("div", { role: "tabpanel", id: "cdr-req-panel-required", "aria-labelledby": "cdr-req-tab-required", hidden: d !== "required", children: /* @__PURE__ */ s.jsx("div", { className: "d-req-fwd", "data-code": i.code, children: /* @__PURE__ */ s.jsx("p", { className: "empty", children: i.loading }) }) }),
      /* @__PURE__ */ s.jsx("div", { role: "tabpanel", id: "cdr-req-panel-unlocks", "aria-labelledby": "cdr-req-tab-unlocks", hidden: d !== "unlocks", children: /* @__PURE__ */ s.jsx("div", { className: "d-req-by", "data-code": i.code, children: /* @__PURE__ */ s.jsx("p", { className: "empty", children: i.loading }) }) })
    ] })
  ] });
}
function Mm({ history: i }) {
  var _;
  const [d, u] = Q.useState(!1), [h, w] = Q.useState(((_ = i.terms[i.terms.length - 1]) == null ? void 0 : _.slug) || "");
  if (!i.terms.length) return /* @__PURE__ */ s.jsxs("div", { className: "cdr-history-empty", children: [
    /* @__PURE__ */ s.jsx(ua, { "aria-hidden": "true" }),
    /* @__PURE__ */ s.jsx("strong", { children: i.heading }),
    /* @__PURE__ */ s.jsx("p", { children: i.empty })
  ] });
  const v = d ? i.terms : i.terms.slice(-8), g = i.terms.find((N) => N.slug === h) || v[v.length - 1], b = Math.max(1, ...v.map((N) => N.capacity));
  return /* @__PURE__ */ s.jsxs("div", { className: "cdr-history", children: [
    /* @__PURE__ */ s.jsxs("header", { className: "cdr-history-head", children: [
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h4", { children: i.heading }),
        /* @__PURE__ */ s.jsx("p", { children: i.caption })
      ] }),
      /* @__PURE__ */ s.jsxs("span", { children: [
        /* @__PURE__ */ s.jsx(ua, { "aria-hidden": "true" }),
        i.terms.length
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("figure", { className: "cdr-history-figure", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "cdr-history-legend", children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          /* @__PURE__ */ s.jsx("i", { className: "capacity" }),
          i.labels.capacity
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          /* @__PURE__ */ s.jsx("i", { className: "enrolled" }),
          i.labels.enrolled
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "cdr-history-chart", role: "list", "aria-label": i.heading, children: v.map((N) => /* @__PURE__ */ s.jsxs("button", { type: "button", role: "listitem", className: `cdr-history-term${g.slug === N.slug ? " is-active" : ""}${N.fill >= 100 ? " is-full" : ""}`, onMouseEnter: () => w(N.slug), onFocus: () => w(N.slug), onClick: () => w(N.slug), "aria-label": `${N.label}, ${i.labels.capacity} ${N.capacity}, ${i.labels.enrolled} ${N.enrolled}, %${N.fill}`, children: [
        /* @__PURE__ */ s.jsxs("span", { className: "cdr-history-bars", children: [
          /* @__PURE__ */ s.jsx("i", { className: "capacity", style: { height: `${Math.max(7, Math.round(N.capacity / b * 100))}%` } }),
          /* @__PURE__ */ s.jsx("i", { className: "enrolled", style: { height: `${Math.max(N.enrolled ? 7 : 0, Math.round(N.enrolled / b * 100))}%` } })
        ] }),
        /* @__PURE__ */ s.jsx("small", { children: N.shortLabel })
      ] }, N.slug)) }),
      /* @__PURE__ */ s.jsxs("figcaption", { className: "cdr-history-caption", children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          /* @__PURE__ */ s.jsx(bf, { "aria-hidden": "true" }),
          /* @__PURE__ */ s.jsx("b", { children: g.label })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          i.labels.capacity,
          " ",
          /* @__PURE__ */ s.jsx("b", { children: g.capacity })
        ] }),
        /* @__PURE__ */ s.jsxs("span", { children: [
          i.labels.enrolled,
          " ",
          /* @__PURE__ */ s.jsx("b", { children: g.enrolled })
        ] }),
        /* @__PURE__ */ s.jsxs("strong", { children: [
          "%",
          g.fill
        ] })
      ] }),
      i.terms.length > 8 && /* @__PURE__ */ s.jsx("button", { type: "button", className: "cdr-history-toggle", "aria-expanded": d, onClick: () => u(!d), children: d ? i.labels.showRecent : i.labels.showAll })
    ] }),
    /* @__PURE__ */ s.jsxs("details", { className: "cdr-history-records", children: [
      /* @__PURE__ */ s.jsxs("summary", { children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          /* @__PURE__ */ s.jsx(Lf, { "aria-hidden": "true" }),
          i.labels.records
        ] }),
        /* @__PURE__ */ s.jsx("b", { children: i.recordCount }),
        /* @__PURE__ */ s.jsx(Pc, { "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "cdr-history-record-list", children: [...i.terms].reverse().map((N) => /* @__PURE__ */ s.jsxs("section", { children: [
        /* @__PURE__ */ s.jsxs("header", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: N.label }),
          /* @__PURE__ */ s.jsxs("span", { children: [
            N.enrolled,
            " / ",
            N.capacity,
            " · %",
            N.fill
          ] })
        ] }),
        N.rows.map((T, V) => /* @__PURE__ */ s.jsxs("div", { className: "cdr-history-record", children: [
          /* @__PURE__ */ s.jsx("span", { children: T.instructor || "·" }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            i.labels.enrolled,
            " ",
            T.enrolled,
            " · ",
            i.labels.capacity,
            " ",
            T.capacity
          ] }),
          /* @__PURE__ */ s.jsxs("b", { children: [
            "%",
            T.fill
          ] })
        ] }, `${N.slug}-${T.instructor}-${V}`))
      ] }, N.slug)) })
    ] })
  ] });
}
function Pm(i) {
  const [d, u] = Q.useState(i.active), [h, w] = Q.useState(!1), v = (g, b) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(g.key)) return;
    g.preventDefault();
    const _ = g.key === "Home" ? 0 : g.key === "End" ? i.panels.length - 1 : (b + (g.key === "ArrowRight" ? 1 : -1) + i.panels.length) % i.panels.length;
    u(i.panels[_].key), requestAnimationFrame(() => {
      var N;
      return (N = document.getElementById(`d-tab-${i.panels[_].key}`)) == null ? void 0 : N.focus();
    });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "cdr-root", children: [
    /* @__PURE__ */ s.jsxs("header", { className: "cdr-head d-head", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "cdr-title d-title-block", children: [
        /* @__PURE__ */ s.jsxs("h3", { id: "detail-title", children: [
          /* @__PURE__ */ s.jsx("span", { className: "d-code", children: i.code }),
          /* @__PURE__ */ s.jsx("span", { className: "d-name", children: i.name })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "d-meta", children: [
          i.meta.map((g) => /* @__PURE__ */ s.jsx("span", { className: "d-pill", children: g }, g)),
          i.specialKind && /* @__PURE__ */ s.jsxs("span", { className: `cdr-kind ${i.specialKind}`, children: [
            i.specialKind === "extra-exam" ? /* @__PURE__ */ s.jsx(sa, { "aria-hidden": "true" }) : /* @__PURE__ */ s.jsx(Bn, { "aria-hidden": "true" }),
            i.specialLabel
          ] })
        ] })
      ] }),
      i.obsLink && /* @__PURE__ */ s.jsxs("a", { className: "cdr-obs d-obs", href: i.obsLink, target: "_blank", rel: "noopener", children: [
        /* @__PURE__ */ s.jsx(ga, { "aria-hidden": "true" }),
        i.obsLabel
      ] })
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: "cdr-tabs d-tabs", role: "tablist", "aria-label": i.tabLabel, children: i.panels.map((g, b) => {
      const _ = zm[g.key] || io;
      return /* @__PURE__ */ s.jsxs("button", { type: "button", role: "tab", id: `d-tab-${g.key}`, "data-dtab": g.key, "aria-controls": `d-panel-${g.key}`, "aria-selected": d === g.key, tabIndex: d === g.key ? 0 : -1, onClick: () => u(g.key), onKeyDown: (N) => v(N, b), children: [
        /* @__PURE__ */ s.jsx(_, { "aria-hidden": "true" }),
        /* @__PURE__ */ s.jsx("span", { children: g.label }),
        g.count !== void 0 && /* @__PURE__ */ s.jsx("b", { children: g.count })
      ] }, g.key);
    }) }),
    /* @__PURE__ */ s.jsx("div", { className: "cdr-panels d-panels", children: i.panels.map((g) => {
      var b, _, N;
      return /* @__PURE__ */ s.jsx("section", { role: "tabpanel", id: `d-panel-${g.key}`, "aria-labelledby": `d-tab-${g.key}`, "data-dpanel": g.key, hidden: d !== g.key, children: g.key === "history" && i.history ? /* @__PURE__ */ s.jsx(Mm, { history: i.history }) : g.key === "overview" && i.prerequisite ? /* @__PURE__ */ s.jsxs("div", { className: "cdr-overview", children: [
        g.beforeHtml && /* @__PURE__ */ s.jsx("div", { dangerouslySetInnerHTML: { __html: g.beforeHtml } }),
        /* @__PURE__ */ s.jsx(_m, { data: i.prerequisite }),
        g.afterHtml && /* @__PURE__ */ s.jsx("div", { dangerouslySetInnerHTML: { __html: g.afterHtml } })
      ] }) : g.key === "sections" && ((b = i.sections) != null && b.length) ? /* @__PURE__ */ s.jsxs("div", { className: "cdr-sections", children: [
        /* @__PURE__ */ s.jsxs("header", { className: "cdr-section-heading", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("h4", { children: i.sectionHeading }),
            /* @__PURE__ */ s.jsx("p", { children: i.sectionCaption })
          ] }),
          /* @__PURE__ */ s.jsx("span", { children: i.sections.length })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "cdr-section-list", children: i.sections.slice(0, h ? void 0 : 8).map((T) => {
          var V, z, G;
          return /* @__PURE__ */ s.jsxs("article", { className: `cdr-section${T.focus ? " is-focus" : ""}`, "data-crn": T.crn, children: [
            /* @__PURE__ */ s.jsxs("div", { className: "cdr-section-code", children: [
              /* @__PURE__ */ s.jsx("span", { children: "CRN" }),
              /* @__PURE__ */ s.jsx("strong", { children: T.crn })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "cdr-section-body", children: [
              /* @__PURE__ */ s.jsxs("div", { className: "cdr-section-top", children: [
                /* @__PURE__ */ s.jsxs("button", { type: "button", className: "cdr-instructor d-instr-history", "data-name": T.instructors.join(", "), children: [
                  /* @__PURE__ */ s.jsx(ur, { "aria-hidden": "true" }),
                  T.instructors.join(", ") || "·"
                ] }),
                /* @__PURE__ */ s.jsx("span", { children: T.quota })
              ] }),
              T.meta && /* @__PURE__ */ s.jsxs("p", { className: "cdr-section-meta", children: [
                T.special === "extra-exam" ? /* @__PURE__ */ s.jsx(sa, { "aria-hidden": "true" }) : T.special === "graduation" ? /* @__PURE__ */ s.jsx(Bn, { "aria-hidden": "true" }) : /* @__PURE__ */ s.jsx(kf, { "aria-hidden": "true" }),
                T.meta
              ] }),
              !!T.sessions.length && /* @__PURE__ */ s.jsx("div", { className: "cdr-section-times", children: T.sessions.map((S) => /* @__PURE__ */ s.jsxs("span", { children: [
                /* @__PURE__ */ s.jsx(Wn, { "aria-hidden": "true" }),
                S
              ] }, S)) }),
              T.note && /* @__PURE__ */ s.jsx("small", { children: T.note }),
              !!((V = T.rules) != null && V.length) && /* @__PURE__ */ s.jsxs("details", { className: "cdr-rules", children: [
                /* @__PURE__ */ s.jsxs("summary", { children: [
                  (z = i.labels) == null ? void 0 : z.requirements,
                  /* @__PURE__ */ s.jsx(Pc, { "aria-hidden": "true" })
                ] }),
                T.rules.map((S) => /* @__PURE__ */ s.jsxs("p", { children: [
                  /* @__PURE__ */ s.jsx("b", { children: S.label }),
                  S.value
                ] }, S.label))
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("button", { type: "button", className: "cdr-add", "data-add-crn": T.crn, onClick: () => {
              var S;
              return (S = i.onAddCrn) == null ? void 0 : S.call(i, T.crn);
            }, children: [
              /* @__PURE__ */ s.jsx(_f, { "aria-hidden": "true" }),
              (G = i.labels) == null ? void 0 : G.add
            ] })
          ] }, T.crn);
        }) }),
        i.sections.length > 8 && /* @__PURE__ */ s.jsx("button", { type: "button", className: "cdr-more", "aria-expanded": h, onClick: () => w(!h), children: h ? (_ = i.labels) == null ? void 0 : _.showLess : `${i.sections.length - 8} ${(N = i.labels) == null ? void 0 : N.showMore}` })
      ] }) : /* @__PURE__ */ s.jsx("div", { dangerouslySetInnerHTML: { __html: g.html } }) }, g.key);
    }) })
  ] });
}
const Lm = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--sans);font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--mono);font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.dersler-table-root .dt-relative{position:relative}.dersler-table-root .dt--ml-3{margin-left:-.75rem}.dersler-table-root .dt-ml-1\\.5{margin-left:.375rem}.dersler-table-root .dt-inline{display:inline}.dersler-table-root .dt-inline-flex{display:inline-flex}.dersler-table-root .dt-size-3\\.5{width:.875rem;height:.875rem}.dersler-table-root .dt-size-4{width:1rem;height:1rem}.dersler-table-root .dt-h-10{height:2.5rem}.dersler-table-root .dt-h-12{height:3rem}.dersler-table-root .dt-h-9{height:2.25rem}.dersler-table-root .dt-w-8{width:2rem}.dersler-table-root .dt-w-full{width:100%}.dersler-table-root .dt-caption-bottom{caption-side:bottom}.dersler-table-root .dt-cursor-pointer{cursor:pointer}.dersler-table-root .dt-items-center{align-items:center}.dersler-table-root .dt-justify-center{justify-content:center}.dersler-table-root .dt-overflow-auto{overflow:auto}.dersler-table-root .dt-overflow-hidden{overflow:hidden}.dersler-table-root .dt-whitespace-nowrap{white-space:nowrap}.dersler-table-root .dt-rounded-lg{border-radius:var(--radius-card)}.dersler-table-root .dt-rounded-md{border-radius:calc(var(--radius-card) - 2px)}.dersler-table-root .dt-border{border-width:1px}.dersler-table-root .dt-border-b{border-bottom-width:1px}.dersler-table-root .dt-border-border{border-color:var(--hairline)}.dersler-table-root .dt-bg-primary{background-color:var(--acid)}.dersler-table-root .dt-p-2{padding:.5rem}.dersler-table-root .dt-p-4{padding:1rem}.dersler-table-root .dt-p-6{padding:1.5rem}.dersler-table-root .dt-px-3{padding-left:.75rem;padding-right:.75rem}.dersler-table-root .dt-px-4{padding-left:1rem;padding-right:1rem}.dersler-table-root .dt-py-2{padding-top:.5rem;padding-bottom:.5rem}.dersler-table-root .dt-text-left{text-align:left}.dersler-table-root .dt-text-center{text-align:center}.dersler-table-root .dt-text-right{text-align:right}.dersler-table-root .dt-align-middle{vertical-align:middle}.dersler-table-root .dt-font-mono{font-family:var(--mono)}.dersler-table-root .dt-text-base{font-size:1rem;line-height:1.5rem}.dersler-table-root .dt-text-sm{font-size:.875rem;line-height:1.25rem}.dersler-table-root .dt-text-xs{font-size:.75rem;line-height:1rem}.dersler-table-root .dt-font-medium{font-weight:500}.dersler-table-root .dt-tabular-nums{--tw-numeric-spacing: tabular-nums;font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)}.dersler-table-root .dt-leading-none{line-height:1}.dersler-table-root .dt-text-muted-foreground{color:var(--dim)}.dersler-table-root .dt-text-primary-foreground{color:var(--on-accent)}.dersler-table-root .dt-opacity-40{opacity:.4}.dersler-table-root .dt-transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dersler-table-root{font-family:var(--sans);color:var(--fg)}.program-planner-root{--pp-slot: 34px;position:relative;min-width:0}.pp-heading{display:flex;align-items:center;gap:11px;margin:0 0 12px}.pp-heading-icon{display:grid;width:36px;height:36px;place-items:center;flex:0 0 auto;border:1px solid color-mix(in srgb,var(--acid) 34%,var(--line));border-radius:10px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.pp-heading-icon svg{width:18px;height:18px}.pp-heading>span:last-child{display:grid;gap:2px;min-width:0}.pp-heading strong{font-size:14px;letter-spacing:-.01em}.pp-heading small{color:var(--dimmer);font:10px/1.35 var(--mono)}.pp-loading{display:grid;min-height:260px;place-items:center;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2);font:11px/1.4 var(--mono)}.pp-calendar-scroll{max-height:min(69vh,780px);overflow:auto;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);scrollbar-width:thin}.pp-calendar{min-width:760px}.pp-calendar-head,.pp-calendar-body{display:grid;grid-template-columns:62px repeat(var(--pp-days),minmax(130px,1fr))}.pp-calendar-head{position:sticky;top:0;z-index:20;min-height:43px;border-bottom:1px solid var(--hairline-strong);background:var(--panel)}.pp-calendar-head>*{display:grid;place-items:center;border-right:1px solid var(--line)}.pp-calendar-head>span{position:sticky;left:0;z-index:22;background:var(--panel)}.pp-calendar-head b{color:var(--dim);font:700 10px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase}.pp-time-column{position:sticky;left:0;z-index:10;background:var(--panel);box-shadow:1px 0 0 var(--hairline-strong)}.pp-time-column span{display:block;height:var(--pp-slot);padding:5px 9px 0 0;color:var(--dimmer);text-align:right;font:9px/1 var(--mono);transform:translateY(-9px)}.pp-day-column{position:relative;min-width:0;border-right:1px solid var(--line);background-color:color-mix(in srgb,var(--panel) 97%,var(--fg));background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--pp-slot) - 1px),var(--line) calc(var(--pp-slot) - 1px),var(--line) var(--pp-slot))}.pp-day-column.is-weekend{background-color:var(--panel-2)}.pp-session{position:absolute;z-index:2;display:flex;flex-direction:column;gap:5px;overflow:hidden;padding:10px 25px 8px 10px;border:1px solid color-mix(in srgb,var(--pp-foreground) 25%,transparent);border-radius:8px;color:var(--pp-foreground);text-align:left;background:var(--pp-color);box-shadow:0 2px 6px color-mix(in srgb,var(--pp-color) 30%,transparent);cursor:pointer;transition:filter .14s ease,box-shadow .14s ease,transform .14s ease}.pp-session:hover,.pp-session:focus-visible{z-index:6;filter:saturate(1.08) brightness(1.04);box-shadow:0 7px 18px color-mix(in srgb,var(--pp-color) 42%,transparent);transform:translateY(-1px)}.pp-session:focus-visible{outline:3px solid var(--acid);outline-offset:2px}.pp-session.is-conflict{border:2px solid var(--red)}.pp-session.is-short{justify-content:center;padding-block:5px}.pp-session.is-short .pp-session-meta{display:none}.pp-session>strong{display:-webkit-box;overflow:hidden;color:inherit;font:800 11px/1.26 var(--sans);-webkit-box-orient:vertical;-webkit-line-clamp:3}.pp-session>strong span{font-weight:650}.pp-pin,.pp-more{position:absolute;right:7px;width:14px;height:14px;opacity:.75}.pp-pin{top:8px}.pp-more{bottom:7px}.pp-session-meta{display:grid;gap:3px;min-width:0}.pp-session-meta>span,.pp-agenda-detail{display:flex;align-items:center;gap:5px;min-width:0;overflow:hidden;color:inherit;font:9px/1.2 var(--mono);text-overflow:ellipsis;white-space:nowrap}.pp-session-meta svg,.pp-agenda-detail svg{width:11px;height:11px;flex:0 0 auto}.pp-conflict{display:flex;align-items:center;gap:4px;margin-top:auto;font:800 9px/1 var(--mono)}.pp-conflict svg{width:11px;height:11px}.pp-now{position:absolute;z-index:7;right:0;left:0;height:2px;background:var(--acid);pointer-events:none}.pp-now:before{position:absolute;top:-3px;left:-1px;width:8px;height:8px;border-radius:50%;background:var(--acid);content:""}.pp-empty,.pp-empty-day{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2)}.pp-empty svg,.pp-empty-day svg{width:25px;height:25px}.pp-empty strong,.pp-empty-day p{margin:0;font-size:12px}.pp-untimed{display:flex;gap:10px;margin-top:12px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-untimed>svg{width:18px;height:18px;flex:0 0 auto;color:var(--amber)}.pp-untimed>div{display:grid;gap:5px}.pp-untimed strong{font-size:11px}.pp-untimed span{color:var(--dim);font:10px/1.4 var(--mono)}.pp-context{position:fixed;z-index:10010;display:grid;width:224px;overflow:hidden;padding:6px;border:1px solid var(--hairline-strong);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pp-context p{display:grid;gap:2px;margin:0 0 4px;padding:8px 9px;border-bottom:1px solid var(--line)}.pp-context p strong{font-size:12px}.pp-context p span{color:var(--dimmer);font:9px/1 var(--mono)}.pp-context button{display:flex;align-items:center;gap:9px;width:100%;padding:8px 9px;border:0;border-radius:6px;color:var(--fg);text-align:left;background:transparent;font:11px/1.2 var(--sans)}.pp-context button:hover,.pp-context button:focus-visible{background:var(--panel-2)}.pp-context button.is-danger{color:var(--red)}.pp-context button svg{width:14px;height:14px}.pp-agenda{min-width:0}.pp-day-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:12px;padding:4px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-day-tabs button{position:relative;min-width:0;min-height:38px;border:0;border-radius:7px;color:var(--dim);background:transparent;font:700 10px/1 var(--mono)}.pp-day-tabs button.is-active{color:var(--panel);background:var(--fg)}.pp-day-tabs button>span{position:absolute;bottom:5px;left:50%;width:3px;height:3px;border-radius:50%;background:var(--acid)}.pp-agenda-list{display:grid;gap:8px}.pp-agenda-card{--pp-color: var(--cyan);display:grid;grid-template-columns:54px minmax(0,1fr);gap:12px;width:100%;padding:13px;border:1px solid var(--line);border-radius:11px;color:var(--fg);text-align:left;background:var(--panel);box-shadow:inset 4px 0 0 var(--pp-color)}.pp-agenda-card.is-conflict{border-color:var(--red)}.pp-agenda-time{display:grid;align-content:start;gap:3px;font:11px/1 var(--mono)}.pp-agenda-time small{color:var(--dimmer);font-size:9px}.pp-agenda-copy{display:grid;gap:5px;min-width:0}.pp-agenda-copy>strong{display:flex;align-items:center;gap:7px;font-size:13px}.pp-color-dot{width:7px;height:7px;border-radius:50%;background:var(--pp-color)}.pp-agenda-name{color:var(--dim);font-size:12px}.pp-agenda-copy em{display:flex;align-items:center;gap:5px;color:var(--red);font:700 10px/1 var(--mono)}.pp-agenda-copy em svg{width:12px;height:12px}.pp-empty-day{min-height:150px}.curriculum-plan-root{min-width:0;color:var(--fg);font-family:var(--sans)}.dp-semesters.dp-react{display:block}.cp-semester-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;align-items:stretch}.curriculum-plan-root .dp-sem{min-width:0;overflow:hidden;padding:0;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);height:100%}.curriculum-plan-root .dp-sem-head{position:relative;min-height:58px;margin:0;padding:13px 43px 12px 15px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);cursor:pointer}.curriculum-plan-root .dp-sem-head>span:first-child{font-size:15px;font-weight:750;letter-spacing:-.015em}.curriculum-plan-root .dp-sem-head:after{position:absolute;top:50%;right:17px;width:8px;height:8px;margin:-6px 0 0;border-right:1.5px solid var(--dim);border-bottom:1.5px solid var(--dim);content:"";transform:rotate(45deg);transition:transform .16s ease}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head{margin:0;padding:13px 43px 12px 15px;border:0}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head:after{margin-top:-2px;transform:rotate(-45deg)}.curriculum-plan-root .dp-load{color:var(--dim);font:10px/1.25 var(--mono)}.curriculum-plan-root .dp-sem-avg{margin-left:auto;color:var(--acid);font:700 10px/1.25 var(--mono);white-space:nowrap}.curriculum-plan-root .dp-colhead{min-height:31px;margin:0 14px;padding:6px 0;border-bottom:1px solid var(--line);font-size:9px;letter-spacing:.06em}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin:0 14px;padding:0;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent}.curriculum-plan-root .dp-course:last-child,.curriculum-plan-root .dp-elective:last-child{border-bottom:0}.curriculum-plan-root .dp-row,.curriculum-plan-root .dp-colhead{grid-template-columns:32px minmax(0,1fr) 34px 94px 58px;-moz-column-gap:10px;column-gap:10px}.curriculum-plan-root .dp-row{min-height:52px;padding:8px 0}.curriculum-plan-root .dp-repeat-btn,.curriculum-plan-root .dp-repeat-cell{justify-self:center}.curriculum-plan-root .dp-credit{min-width:29px;height:24px;padding:0 5px;border-color:color-mix(in srgb,var(--acid) 28%,var(--line));border-radius:7px;color:var(--acid);background:color-mix(in srgb,var(--acid) 7%,var(--panel));font-size:10px}.curriculum-plan-root .dp-title{display:grid;gap:2px}.curriculum-plan-root .dp-code{width:-moz-fit-content;width:fit-content;color:var(--cyan);font:750 12px/1.25 var(--mono)}.curriculum-plan-root .dp-name{overflow:hidden;color:var(--dim);font-size:11px;line-height:1.3;text-overflow:ellipsis}.curriculum-plan-root .dp-repeat-btn{color:var(--dimmer)}.curriculum-plan-root .dp-repeat-btn svg{display:block}.curriculum-plan-root .dp-repeat-btn.on{color:var(--amber);background:color-mix(in srgb,var(--amber) 8%,transparent)}.curriculum-plan-root .dp-grade-wrap{width:94px;min-height:35px;justify-content:flex-end;border-radius:7px}.curriculum-plan-root .dp-grade{border-radius:5px;font-family:var(--mono)}.curriculum-plan-root .cp-grade-trigger{position:relative;display:inline-flex;align-items:center;justify-content:space-between;gap:7px;min-width:65px;min-height:31px;padding:5px 8px;border:1px solid var(--line);border-radius:7px;color:var(--dim);background:var(--panel);font:700 10px/1 var(--mono);cursor:pointer;transition:border-color .14s ease,background-color .14s ease,color .14s ease}.curriculum-plan-root .dp-sec-btn{width:58px;justify-content:center;text-align:center}.dt-course-name{display:flex;min-width:0;align-items:center;gap:8px}.dt-course-name>span{min-width:0}.dt-kind-badge{display:inline-flex;flex:0 0 auto;align-items:center;gap:5px;min-height:24px;padding:4px 7px;border:1px solid color-mix(in srgb,var(--acid) 42%,var(--line));border-radius:7px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel));font:700 9px/1 var(--sans);white-space:nowrap}.dt-kind-badge svg{width:12px;height:12px}.dt-kind-badge.graduation{border-color:color-mix(in srgb,var(--cyan) 42%,var(--line));color:var(--cyan);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.curriculum-plan-root .cp-grade-trigger:hover,.curriculum-plan-root .cp-grade-trigger[aria-expanded=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel))}.curriculum-plan-root .cp-grade-trigger.filled{border-color:color-mix(in srgb,var(--acid) 58%,var(--line));color:var(--fg)}.curriculum-plan-root .cp-grade-trigger svg{width:13px;height:13px;flex:0 0 auto;transition:transform .14s ease}.curriculum-plan-root .cp-grade-trigger[aria-expanded=true] svg{transform:rotate(180deg)}.cp-grade-menu{position:fixed;z-index:10020;top:var(--cp-menu-y);left:var(--cp-menu-x);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;width:292px;max-width:calc(100vw - 20px);padding:8px;border:1px solid var(--hairline-strong);border-radius:11px;background:var(--panel);box-shadow:var(--shadow-float)}.cp-grade-menu.above{transform:translateY(-100%)}.cp-grade-menu button{position:relative;display:flex;align-items:center;justify-content:center;min-width:0;min-height:34px;padding:6px;border:1px solid transparent;border-radius:7px;color:var(--dim);background:var(--panel-2);font:700 10px/1 var(--mono);cursor:pointer}.cp-grade-menu button:hover,.cp-grade-menu button:focus-visible{border-color:var(--cyan);color:var(--fg);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.cp-grade-menu button[aria-selected=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 12%,var(--panel))}.cp-grade-menu button.is-empty{grid-column:1 / -1;justify-content:flex-start;padding-inline:10px}.cp-grade-menu button svg{position:absolute;top:50%;right:6px;width:12px;height:12px;color:var(--acid);transform:translateY(-50%)}.curriculum-plan-root .dp-grade-clear svg{display:block}.curriculum-plan-root .dp-sec-btn.open{padding:5px 8px;border:1px solid color-mix(in srgb,var(--cyan) 28%,var(--line));border-radius:7px;background:color-mix(in srgb,var(--cyan) 6%,var(--panel));font:650 10px/1 var(--sans);text-decoration:none}.curriculum-plan-root .dp-sec-btn.open:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-sec-btn.closed{font-size:10px}.curriculum-plan-root .dp-secslot{margin:0;padding:10px 0 12px;border-top:1px dashed var(--line)}.curriculum-plan-root .dp-section{min-height:31px}.curriculum-plan-root .dp-actions button{min-height:28px;padding:3px 7px;border:1px solid var(--line);border-radius:6px}.curriculum-plan-root .dp-actions button:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-elective{background:color-mix(in srgb,var(--acid) 3%,transparent)}.curriculum-plan-root .dp-elective-name{color:var(--dim);font-size:11px}.curriculum-plan-root .dp-epick{min-height:31px;border-radius:7px;background:var(--panel)}.cp-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.cp-empty svg{width:24px;height:24px}.cp-empty strong{font-size:12px}.exams-list-root{min-width:0;color:var(--fg);font-family:var(--sans)}.ex-table{overflow:hidden;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-head,.ex-row{display:grid;grid-template-columns:minmax(230px,1.45fr) minmax(145px,.9fr) minmax(105px,.62fr) minmax(170px,1fr) minmax(190px,1.05fr);align-items:center;gap:14px}.ex-head{min-height:36px;padding:8px 15px;color:var(--dimmer);border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);font:750 9px/1 var(--mono);letter-spacing:.055em;text-transform:uppercase}.ex-row{min-height:72px;padding:11px 15px;border-bottom:1px solid var(--line);transition:background-color .14s ease}.ex-row:last-child{border-bottom:0}.ex-row:hover{background:color-mix(in srgb,var(--cyan) 3%,var(--panel))}.ex-row.without-place{grid-template-columns:minmax(230px,1.5fr) minmax(155px,1fr) minmax(115px,.7fr) minmax(200px,1fr)}.ex-course{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:baseline;gap:3px 9px;min-width:0}.ex-course button,.ex-card-main button{width:-moz-fit-content;width:fit-content;padding:0;border:0;color:var(--cyan);background:transparent;font:800 12px/1.25 var(--mono);cursor:pointer}.ex-course button:hover,.ex-course button:focus-visible,.ex-card-main button:hover,.ex-card-main button:focus-visible{text-decoration:underline;text-underline-offset:3px}.ex-course strong{overflow:hidden;font-size:12px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.ex-course small{display:flex;grid-column:1 / -1;align-items:center;gap:4px;color:var(--dimmer);font:9px/1.2 var(--mono)}.ex-course small svg{width:10px;height:10px}.ex-meta{display:flex;align-items:flex-start;gap:6px;min-width:0;color:var(--dim);font-size:11px;line-height:1.35}.ex-meta svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-type{display:inline-flex;padding:5px 7px;border:1px solid color-mix(in srgb,var(--acid) 24%,var(--line));border-radius:6px;color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel));font:650 10px/1.15 var(--sans);font-style:normal}.ex-when{display:grid;gap:5px}.ex-when strong,.ex-when span{display:flex;align-items:center;gap:6px}.ex-when strong{font-size:11px}.ex-when span{color:var(--dim);font:10px/1.2 var(--mono)}.ex-when svg{width:13px;height:13px;color:var(--dimmer)}.ex-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.ex-empty svg{width:25px;height:25px}.ex-empty strong{font-size:12px}.ex-agenda{display:grid;gap:15px}.ex-day{overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-day>header{display:flex;align-items:center;gap:8px;min-height:42px;padding:9px 12px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2)}.ex-day>header svg{width:15px;height:15px;color:var(--acid)}.ex-day>header strong{font:750 11px/1 var(--mono)}.ex-day>header span{margin-left:auto;color:var(--dim);font-size:11px}.ex-card{display:grid;grid-template-columns:74px minmax(0,1fr);gap:12px;padding:13px 12px;border-bottom:1px solid var(--line)}.ex-card:last-child{border-bottom:0}.ex-card-time{display:flex;align-items:flex-start;gap:5px;color:var(--fg);font:700 10px/1.35 var(--mono)}.ex-card-time svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main{display:grid;gap:5px;min-width:0}.ex-card-main>strong{font-size:12px;line-height:1.3}.ex-card-main>span{display:flex;align-items:center;gap:6px;min-width:0;color:var(--dim);font-size:10px;line-height:1.35}.ex-card-main>span svg{width:12px;height:12px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main>span i{width:3px;height:3px;margin-inline:2px;border-radius:50%;background:var(--dimmer)}@media(max-width:900px){.cp-semester-grid{grid-template-columns:1fr}.ex-head,.ex-row{grid-template-columns:minmax(210px,1.45fr) minmax(135px,.85fr) minmax(95px,.62fr) minmax(175px,1fr)}.ex-head>:nth-child(4):not(:last-child),.ex-row>:nth-child(4):not(:last-child){display:none}}@media(max-width:560px){.curriculum-plan-root .dp-sem-head{flex-wrap:nowrap;gap:7px;min-height:48px;padding-block:10px}.curriculum-plan-root .dp-sem-head>span:first-child{width:auto;flex:0 0 auto;font-size:13px}.curriculum-plan-root .dp-load{overflow:hidden;flex:1 1 auto;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-sem-avg{margin-left:auto;font-size:9px}.curriculum-plan-root .dp-colhead{display:none}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin-inline:10px}.curriculum-plan-root .dp-row,.curriculum-plan-root .dp-elective .dp-row{grid-template-columns:34px minmax(0,1fr) auto;gap:4px 8px;min-height:60px;padding:7px 0}.curriculum-plan-root .dp-credit{grid-column:1;grid-row:1 / 3;align-self:center}.curriculum-plan-root .dp-title{display:flex;grid-column:2;grid-row:1;align-items:baseline;gap:6px;overflow:hidden;white-space:nowrap}.curriculum-plan-root .dp-code{flex:0 0 auto;font-size:11px;min-height:28px}.curriculum-plan-root .dp-name{min-width:0;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-repeat-btn,.curriculum-plan-root .dp-repeat-cell{grid-column:3;grid-row:1}.curriculum-plan-root .dp-grade-wrap,.curriculum-plan-root .dp-elective-inputs{grid-column:2;grid-row:2;justify-self:start}.curriculum-plan-root .dp-sec-btn{grid-column:3;grid-row:1 / 3;align-self:center}.curriculum-plan-root .cp-grade-trigger{min-height:34px;padding:5px 7px}.curriculum-plan-root .cp-grade-trigger:after{position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;content:""}.curriculum-plan-root .dp-grade-clear{min-height:32px}.cp-grade-menu,.cp-grade-menu.above{top:auto;right:10px;bottom:max(10px,env(safe-area-inset-bottom));left:10px;grid-template-columns:repeat(5,minmax(0,1fr));width:auto;max-width:none;gap:4px;padding:7px;transform:none}.cp-grade-menu button{min-height:42px;padding:5px 3px;font-size:9px}.cp-grade-menu button.is-empty{min-height:38px}.cp-grade-menu button svg{right:5px;width:11px;height:11px}}@media(max-width:600px){.pp-heading{margin-bottom:10px}.pp-heading-icon{width:32px;height:32px}.pp-day-tabs{overflow-x:auto;grid-template-columns:repeat(var(--pp-days, 5),minmax(48px,1fr))}}@media(prefers-reduced-motion:reduce){.pp-session{transition:none}}.pcl-list{position:relative;display:grid;color:var(--fg);font-family:var(--sans)}.pcl-head{display:grid;grid-template-columns:1fr auto;padding:8px 2px;color:var(--dimmer);border-bottom:1px solid var(--line);font:700 9px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase}.pcl-item{position:relative;display:grid;grid-template-columns:16px minmax(0,1fr) auto 30px 30px;gap:6px;align-items:start;padding:13px 0;border-bottom:1px solid var(--line);cursor:pointer;transition:background-color .14s ease,transform .14s ease}.pcl-item:hover{background:color-mix(in srgb,var(--acid) 4%,transparent)}.pcl-item.is-full{background:color-mix(in srgb,var(--red) 5%,transparent)}.pcl-grip{width:14px;height:14px;margin-top:2px;color:var(--dimmer);cursor:grab}.pcl-course{min-width:0}.pcl-title{display:flex;align-items:center;gap:6px}.pcl-title strong{color:var(--cyan);font:800 11px/1.2 var(--mono)}.pcl-title>span{padding:3px 5px;border:1px solid color-mix(in srgb,var(--acid) 40%,var(--line));border-radius:5px;color:var(--acid);font:700 8px/1 var(--sans)}.pcl-course>p{margin:4px 0 7px;overflow:hidden;color:var(--fg);font-size:11px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.pcl-meta{display:grid;gap:4px;color:var(--dim);font-size:9px}.pcl-meta span{display:flex;align-items:center;gap:5px;min-width:0}.pcl-meta svg{width:11px;height:11px;flex:0 0 auto;color:var(--dimmer)}.pcl-course small{display:block;margin-top:6px;color:var(--acid);font:700 9px/1.2 var(--mono)}.pcl-numbers{display:grid;justify-items:end;gap:5px;font-family:var(--mono)}.pcl-numbers b{font-size:10px;font-variant-numeric:tabular-nums}.pcl-numbers span{color:var(--dimmer);font-size:8px}.pcl-numbers em{color:var(--amber);font-size:8px;font-style:normal}.pcl-remove,.pcl-menu-trigger{display:grid;width:28px;height:28px;place-items:center;padding:0;border:1px solid transparent;border-radius:7px;color:var(--dimmer);background:transparent;cursor:pointer}.pcl-remove{display:grid}.pcl-menu-trigger:hover,.pcl-menu-trigger:focus-visible{border-color:var(--line-hot);color:var(--fg);background:var(--panel-2)}.pcl-menu-trigger svg,.pcl-remove svg{width:14px;height:14px}.pcl-menu-wrap{position:relative}.pcl-menu{position:absolute;z-index:30;top:31px;right:0;display:grid;width:208px;padding:6px;border:1px solid var(--line-hot);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pcl-menu button{display:flex;align-items:center;gap:8px;min-height:34px;padding:7px 9px;border:0;border-radius:6px;color:var(--fg);background:transparent;font:600 10px/1.2 var(--sans);text-align:left;cursor:pointer}.pcl-menu button:hover,.pcl-menu button:focus-visible{background:var(--panel-2)}.pcl-menu button.is-danger{color:var(--red)}.pcl-menu svg{width:13px;height:13px}.pcl-empty{display:grid;min-height:150px;place-items:center;align-content:center;gap:8px;color:var(--dimmer);text-align:center}.pcl-empty svg{width:24px;height:24px}.pcl-empty strong{max-width:25ch;font-size:11px}.cdr-root{display:flex;min-height:0;height:100%;flex-direction:column;color:var(--fg);background:var(--panel);font-family:var(--sans)}.cdr-head{display:flex;min-height:128px;flex:0 0 auto;align-items:flex-start;justify-content:space-between;gap:24px;padding:28px 76px 22px 28px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--acid) 2.5%,var(--panel))}.cdr-title{min-width:0}.cdr-title h3{display:flex;align-items:center;gap:16px;margin:0 0 13px}.cdr-title .d-code{display:inline-flex;min-height:38px;align-items:center;padding:0 11px;border:1px solid var(--line-hot);border-radius:8px;color:var(--cyan);background:var(--panel);font:800 12px/1 var(--mono);white-space:nowrap}.cdr-title .d-name{color:var(--fg);font-family:var(--display);font-size:clamp(21px,3vw,30px);font-weight:750;line-height:1.1;letter-spacing:-.025em}.cdr-title .d-meta{display:flex;flex-wrap:wrap;gap:6px}.cdr-title .d-pill,.cdr-kind{display:inline-flex;min-height:25px;align-items:center;gap:5px;padding:4px 8px;border:1px solid var(--line);border-radius:7px;color:var(--dim);background:var(--panel);font:650 9px/1 var(--sans)}.cdr-kind{border-color:color-mix(in srgb,var(--acid) 44%,var(--line));color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.cdr-kind.graduation{border-color:color-mix(in srgb,var(--cyan) 42%,var(--line));color:var(--cyan);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.cdr-kind svg{width:12px;height:12px}.cdr-obs{display:inline-flex;align-items:center;gap:7px}.cdr-obs svg{width:14px;height:14px;order:-1}.cdr-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;flex:0 0 auto;padding:0 28px;border:0;border-bottom:1px solid var(--line);border-radius:0;background:var(--panel)}.cdr-tabs button{position:relative;display:flex;min-width:0;min-height:52px;align-items:center;justify-content:center;gap:7px;padding:8px;border:0;border-radius:0;color:var(--dim);background:transparent;font:700 11px/1 var(--sans);cursor:pointer}.cdr-tabs button svg{width:13px;height:13px}.cdr-tabs button>span{min-width:0;padding:0;border:0;border-radius:0;color:inherit;background:transparent;font:inherit}.cdr-tabs button b{min-width:19px;padding:3px 5px;border-radius:999px;color:var(--dim);background:var(--panel-2);font:700 8px/1 var(--mono)}.cdr-tabs button:after{position:absolute;right:22%;bottom:-1px;left:22%;height:2px;border-radius:2px 2px 0 0;background:var(--acid);content:"";opacity:0;transform:scaleX(.5);transition:opacity .14s ease,transform .14s ease}.cdr-tabs button:hover{color:var(--fg);background:color-mix(in srgb,var(--acid) 3%,transparent)}.cdr-tabs button[aria-selected=true]{color:var(--fg);background:transparent;box-shadow:none}.cdr-tabs button[aria-selected=true]:after{opacity:1;transform:scaleX(1)}.cdr-tabs button[aria-selected=true] svg{color:var(--acid)}.cdr-panels{min-height:0;flex:1 1 auto;overflow-y:auto;padding:24px 28px 30px;overscroll-behavior:contain;scrollbar-color:var(--line-hot) transparent}.cdr-panels>section>div:not(.cdr-sections){max-width:880px;margin-inline:auto}.cdr-section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:14px;padding-bottom:13px;border-bottom:1px solid var(--line)}.cdr-section-heading h4{margin:0;color:var(--fg);font-family:var(--display);font-size:18px;letter-spacing:-.015em}.cdr-section-heading p{margin:5px 0 0;color:var(--dimmer);font-size:10px}.cdr-section-heading>span{display:grid;width:28px;height:28px;place-items:center;border:1px solid var(--line);border-radius:8px;color:var(--acid);background:var(--panel-2);font:750 10px/1 var(--mono)}.cdr-section-list{display:grid}.cdr-section{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:16px;align-items:start;padding:17px 6px;border-bottom:1px solid var(--line)}.cdr-section:first-child{border-top:1px solid var(--line)}.cdr-section.is-focus{margin-inline:-10px;padding-inline:16px;border-radius:10px;background:color-mix(in srgb,var(--acid) 8%,var(--panel));box-shadow:inset 2px 0 0 var(--acid)}.cdr-section-code{display:grid;gap:4px}.cdr-section-code span{color:var(--dimmer);font:700 8px/1 var(--sans);letter-spacing:.08em}.cdr-section-code strong{color:var(--cyan);font:800 11px/1.2 var(--mono)}.cdr-section-body{display:grid;min-width:0;gap:7px}.cdr-section-top{display:flex;min-width:0;align-items:center;justify-content:space-between;gap:16px}.cdr-instructor{display:flex;min-width:0;align-items:center;gap:6px;padding:0;border:0;color:var(--fg);background:transparent;font:700 11px/1.3 var(--sans);text-align:left;overflow-wrap:anywhere;cursor:pointer}.cdr-instructor:hover,.cdr-instructor:focus-visible{color:var(--cyan);text-decoration:underline;text-underline-offset:3px}.cdr-instructor svg,.cdr-section-meta svg,.cdr-section-times svg{width:12px;height:12px;flex:0 0 auto;color:var(--dimmer)}.cdr-section-top>span{color:var(--dim);font:700 10px/1 var(--mono);white-space:nowrap}.cdr-section-meta{display:flex;align-items:center;gap:6px;margin:0;color:var(--dim);font-size:10px}.cdr-section-times{display:grid;gap:4px;color:var(--dim);font-size:10px}.cdr-section-times span{display:flex;align-items:flex-start;gap:6px}.cdr-section-body>small{color:var(--dimmer);font-size:9px}.cdr-add{display:inline-flex;min-height:34px;align-items:center;gap:6px;padding:7px 10px;border:1px solid color-mix(in srgb,var(--cyan) 44%,var(--line));border-radius:8px;color:var(--cyan);background:color-mix(in srgb,var(--cyan) 6%,var(--panel));font:700 10px/1 var(--sans);cursor:pointer;white-space:nowrap}.cdr-add:hover,.cdr-add:focus-visible{border-color:var(--cyan);background:color-mix(in srgb,var(--cyan) 11%,var(--panel))}.cdr-add svg{width:13px;height:13px}.cdr-rules{margin-top:2px;color:var(--dim);font-size:10px}.cdr-rules summary{display:inline-flex;align-items:center;gap:5px;color:var(--cyan);cursor:pointer}.cdr-rules summary svg{width:12px;height:12px;transition:transform .14s ease}.cdr-rules[open] summary svg{transform:rotate(180deg)}.cdr-rules p{margin:7px 0 0}.cdr-rules p b{margin-right:6px;color:var(--dimmer)}.cdr-more{display:block;min-height:36px;margin:15px auto 0;padding:7px 12px;border:1px solid var(--line-hot);border-radius:8px;color:var(--fg);background:var(--panel);font:700 10px/1 var(--sans);cursor:pointer}.cdr-overview{max-width:880px;margin-inline:auto}.cdr-prereq{margin-block:22px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);overflow:hidden}.cdr-prereq-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;padding:5px;background:color-mix(in srgb,var(--fg) 3%,var(--panel-2))}.cdr-prereq-tabs button{display:flex;min-width:0;min-height:42px;align-items:center;justify-content:center;gap:8px;padding:8px 12px;border:1px solid transparent;border-radius:8px;color:var(--dim);background:transparent;font:700 11px/1.2 var(--sans);cursor:pointer}.cdr-prereq-tabs button:hover{color:var(--fg);background:color-mix(in srgb,var(--fg) 3%,transparent)}.cdr-prereq-tabs button[aria-selected=true]{border-color:var(--line-hot);color:var(--fg);background:var(--panel);box-shadow:0 1px 4px color-mix(in srgb,var(--bg) 32%,transparent)}.cdr-prereq-tabs button[aria-selected=true] svg{color:var(--acid)}.cdr-prereq-tabs svg{width:14px;height:14px;flex:0 0 auto}.cdr-prereq-tabs b{display:grid;min-width:19px;height:19px;place-items:center;border-radius:6px;color:var(--dim);background:var(--panel-2);font:750 8px/1 var(--mono)}.cdr-prereq-body{min-height:98px;padding:18px;border-top:1px solid var(--line);background:var(--panel)}.cdr-prereq-body>div[hidden]{display:none}.cdr-prereq-body .empty{margin:0}.cdr-history{max-width:900px;margin-inline:auto}.cdr-history-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;padding-bottom:14px;border-bottom:1px solid var(--line)}.cdr-history-head h4{margin:0;color:var(--fg);font-family:var(--display);font-size:18px;letter-spacing:-.015em}.cdr-history-head p{margin:5px 0 0;color:var(--dimmer);font-size:10px}.cdr-history-head>span{display:inline-flex;min-height:28px;align-items:center;gap:6px;padding:0 9px;border:1px solid var(--line);border-radius:8px;color:var(--acid);background:var(--panel-2);font:750 10px/1 var(--mono)}.cdr-history-head svg,.cdr-history-caption svg,.cdr-history-records summary svg{width:13px;height:13px}.cdr-history-figure{margin:0;padding:18px 0 22px}.cdr-history-legend{display:flex;justify-content:flex-end;gap:14px;margin-bottom:9px;color:var(--dimmer);font:650 9px/1 var(--sans)}.cdr-history-legend span{display:inline-flex;align-items:center;gap:6px}.cdr-history-legend i{width:11px;height:11px;border-radius:3px;background:var(--cyan)}.cdr-history-legend i.enrolled{border:1px solid color-mix(in srgb,var(--acid) 70%,var(--line));background:repeating-linear-gradient(135deg,var(--acid) 0 2px,transparent 2px 5px)}.cdr-history-chart{display:flex;height:172px;align-items:end;gap:9px;padding:17px 10px 0;border:1px solid var(--line);border-radius:10px;background-color:color-mix(in srgb,var(--panel-2) 64%,var(--panel));background-image:radial-gradient(circle,color-mix(in srgb,var(--dim) 18%,transparent) 1px,transparent 1px);background-size:13px 13px;overflow-x:auto;scrollbar-width:thin}.cdr-history-term{display:grid;min-width:56px;height:100%;flex:1 0 56px;grid-template-rows:minmax(0,1fr) 26px;align-items:end;justify-items:stretch;gap:7px;padding:0;border:0;color:var(--dimmer);background:transparent;cursor:pointer}.cdr-history-bars{display:flex;width:min(100%,52px);height:100%;min-height:10px;align-items:end;justify-self:center;justify-content:center;gap:5px;transition:transform .14s ease}.cdr-history-bars i{display:block;width:19px;min-height:3px;border-radius:5px 5px 1px 1px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 9%,transparent)}.cdr-history-bars i.capacity{background:var(--cyan)}.cdr-history-bars i.enrolled{border:1px solid color-mix(in srgb,var(--acid) 72%,var(--line));background:repeating-linear-gradient(135deg,var(--acid) 0 2px,color-mix(in srgb,var(--acid) 20%,transparent) 2px 5px)}.cdr-history-term.is-full .cdr-history-bars i.enrolled{border-color:var(--red);background:repeating-linear-gradient(135deg,var(--red) 0 2px,color-mix(in srgb,var(--red) 18%,transparent) 2px 5px)}.cdr-history-term small{font:650 9px/1 var(--sans);white-space:nowrap}.cdr-history-term:hover .cdr-history-bars,.cdr-history-term:focus-visible .cdr-history-bars,.cdr-history-term.is-active .cdr-history-bars{transform:translateY(-3px)}.cdr-history-term.is-active .cdr-history-bars i{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 18%,transparent),0 0 0 2px color-mix(in srgb,var(--acid) 18%,transparent)}.cdr-history-term.is-active small{color:var(--fg);font-weight:800}.cdr-history-caption{display:flex;min-height:42px;align-items:center;gap:17px;margin-top:11px;padding:8px 11px;border:1px solid var(--line);border-radius:9px;color:var(--dim);background:var(--panel-2);font-size:10px}.cdr-history-caption span{display:inline-flex;align-items:center;gap:5px}.cdr-history-caption b{color:var(--fg);font-weight:750}.cdr-history-caption>strong{margin-left:auto;color:var(--acid);font:800 14px/1 var(--mono)}.cdr-history-toggle{display:block;margin:13px auto 0;padding:7px 10px;border:0;color:var(--cyan);background:transparent;font:700 10px/1 var(--sans);text-decoration:underline;text-underline-offset:3px;cursor:pointer}.cdr-history-records{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.cdr-history-records>summary{display:grid;min-height:48px;grid-template-columns:minmax(0,1fr) auto 18px;align-items:center;gap:10px;color:var(--fg);cursor:pointer;list-style:none}.cdr-history-records>summary::-webkit-details-marker{display:none}.cdr-history-records>summary span{display:inline-flex;align-items:center;gap:8px;font-weight:750}.cdr-history-records>summary b{display:grid;min-width:24px;height:24px;place-items:center;border-radius:7px;color:var(--dim);background:var(--panel-2);font:750 9px/1 var(--mono)}.cdr-history-records>summary>svg{color:var(--dimmer);transition:transform .14s ease}.cdr-history-records[open]>summary>svg{transform:rotate(180deg)}.cdr-history-record-list{padding:0 0 14px}.cdr-history-record-list>section{padding:14px 0;border-top:1px solid var(--line)}.cdr-history-record-list>section>header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:7px}.cdr-history-record-list>section>header strong{color:var(--fg);font-size:11px}.cdr-history-record-list>section>header span{color:var(--dim);font:700 9px/1 var(--mono)}.cdr-history-record{display:grid;min-height:31px;grid-template-columns:minmax(0,1fr) auto 42px;align-items:center;gap:12px;padding:5px 8px;border-radius:6px;color:var(--dim);font-size:10px}.cdr-history-record:nth-child(2n){background:var(--panel-2)}.cdr-history-record small{color:var(--dimmer)}.cdr-history-record>b{color:var(--acid);font:750 10px/1 var(--mono);text-align:right}.cdr-history-empty{display:grid;min-height:220px;place-content:center;justify-items:center;gap:8px;color:var(--dimmer);text-align:center}.cdr-history-empty svg{width:28px;height:28px;color:var(--acid)}.cdr-history-empty strong{color:var(--fg);font-family:var(--display)}.cdr-history-empty p{max-width:48ch;margin:0;font-size:11px}.pp-tooltip{position:fixed;z-index:10030;width:286px;padding:12px;border:1px solid var(--line-hot);border-radius:11px;color:var(--fg);background:var(--panel);box-shadow:var(--shadow-float);pointer-events:none;transform:translateY(-100%);animation:pp-tooltip-in .13s cubic-bezier(.2,.8,.2,1)}.pp-tooltip[data-side=bottom]{transform:none}.pp-tooltip-title{display:grid;grid-template-columns:8px 1fr auto;align-items:center;gap:7px}.pp-tooltip-title>span{width:8px;height:8px;border-radius:3px}.pp-tooltip-title strong{font:800 11px/1.2 var(--mono)}.pp-tooltip-title b{color:var(--dim);font:700 9px/1 var(--mono)}.pp-tooltip>p{margin:7px 0 9px;font-size:11px;font-weight:700;line-height:1.35}.pp-tooltip dl{display:grid;gap:5px;margin:0}.pp-tooltip dl div{display:grid;grid-template-columns:16px 1fr;align-items:center;color:var(--dim);font-size:10px}.pp-tooltip dt,.pp-tooltip dd{margin:0}.pp-tooltip svg{width:11px;height:11px}.pp-tooltip>small{display:block;margin-top:10px;padding-top:8px;color:var(--dimmer);border-top:1px solid var(--line);font-size:8px}@keyframes pp-tooltip-in{0%{opacity:.2;filter:blur(3px)}to{opacity:1;filter:blur(0)}}@media(max-width:600px){.pcl-item{grid-template-columns:14px minmax(0,1fr) auto 30px;padding-block:12px}.pcl-remove{display:none}.pcl-course>p{white-space:normal}.pcl-meta{grid-template-columns:1fr}.cdr-head{min-height:0;padding:20px 56px 16px 16px}.cdr-title h3{display:grid;gap:8px}.cdr-tabs{position:sticky;top:0;z-index:4;margin-inline:0;padding-inline:6px}.cdr-tabs button{min-height:44px;padding-inline:4px}.cdr-tabs button svg{display:none}.cdr-title .d-name{font-size:18px}.cdr-panels{padding:16px 14px 24px}.cdr-section{grid-template-columns:52px minmax(0,1fr);gap:10px;padding-block:14px}.cdr-section-top{display:grid;gap:6px}.cdr-add{grid-column:2;justify-self:start}.cdr-section.is-focus{margin-inline:-5px;padding-inline:10px}.cdr-history-chart{margin-inline:-14px;padding-inline:14px}.cdr-history-caption{display:grid;grid-template-columns:1fr auto;gap:6px 12px}.cdr-history-caption>strong{grid-column:2;grid-row:1 / span 2;align-self:center}.cdr-history-record-list>section>header{align-items:flex-start}.cdr-history-record{grid-template-columns:minmax(0,1fr) 38px}.cdr-history-record small{grid-column:1;grid-row:2}.cdr-history-record>b{grid-column:2;grid-row:1 / span 2}.pp-tooltip{display:none}}@media print{.program-planner-root .pp-calendar-scroll{max-height:none;overflow:visible;box-shadow:none}.program-planner-root .pp-calendar{min-width:0}.program-planner-root .pp-context{display:none}}.dersler-table-root .hover\\:dt-bg-accent:hover{background-color:var(--panel-2)}.dersler-table-root .hover\\:dt-text-accent-foreground:hover{color:var(--acid)}.dersler-table-root .focus-visible\\:dt-outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.dersler-table-root .focus-visible\\:dt-ring-2:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.dersler-table-root .focus-visible\\:dt-ring-ring:focus-visible{--tw-ring-color: var(--cyan)}.dersler-table-root .focus-visible\\:dt-ring-offset-2:focus-visible{--tw-ring-offset-width: 2px}.dersler-table-root .disabled\\:dt-pointer-events-none:disabled{pointer-events:none}.dersler-table-root .disabled\\:dt-opacity-50:disabled{opacity:.5}.dersler-table-root .data-\\[state\\=selected\\]\\:dt-bg-muted[data-state=selected]{background-color:var(--panel-2)}.dersler-table-root .\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:dt-pr-0:has([role=checkbox]){padding-right:0}.dersler-table-root :is(.\\[\\&_tr\\:last-child\\]\\:dt-border-0 tr:last-child){border-width:0px}.dersler-table-root :is(.\\[\\&_tr\\]\\:dt-border-b tr){border-bottom-width:1px}';
let sr = null, Dt = null, At = null, Ft = null, $t = null, yt = null, oo = null;
function Jr() {
  oo || (oo = document.createElement("style"), oo.textContent = Lm, document.head.appendChild(oo));
}
function Tm(i, d) {
  Jr(), sr = Xr.createRoot(i), sr.render(
    /* @__PURE__ */ s.jsx(Q.StrictMode, { children: /* @__PURE__ */ s.jsx(Jc, { ...d }) })
  );
}
function Rm(i) {
  sr && sr.render(
    /* @__PURE__ */ s.jsx(Q.StrictMode, { children: /* @__PURE__ */ s.jsx(Jc, { ...i }) })
  );
}
function Im() {
  sr == null || sr.unmount(), sr = null;
}
function Om(i, d) {
  Jr(), Dt = Xr.createRoot(i), Dt.render(/* @__PURE__ */ s.jsx(rd, { ...d }));
}
function Dm(i) {
  Dt == null || Dt.render(/* @__PURE__ */ s.jsx(rd, { ...i }));
}
function Am() {
  Dt == null || Dt.unmount(), Dt = null;
}
function Fm(i, d) {
  Jr(), $t = Xr.createRoot(i), $t.render(/* @__PURE__ */ s.jsx(od, { ...d }));
}
function $m(i) {
  $t == null || $t.render(/* @__PURE__ */ s.jsx(od, { ...i }));
}
function Um() {
  $t == null || $t.unmount(), $t = null;
}
function Hm(i, d) {
  Jr(), yt == null || yt.unmount(), yt = Xr.createRoot(i), mf.flushSync(() => yt == null ? void 0 : yt.render(/* @__PURE__ */ s.jsx(Pm, { ...d })));
}
function Vm() {
  yt == null || yt.unmount(), yt = null;
}
function Bm(i, d) {
  Jr(), At = Xr.createRoot(i), At.render(/* @__PURE__ */ s.jsx(nd, { ...d }));
}
function Wm(i) {
  At == null || At.render(/* @__PURE__ */ s.jsx(nd, { ...i }));
}
function Qm() {
  At == null || At.unmount(), At = null;
}
function qm(i, d) {
  Jr(), Ft = Xr.createRoot(i), Ft.render(/* @__PURE__ */ s.jsx(ld, { ...d }));
}
function Km(i) {
  Ft == null || Ft.render(/* @__PURE__ */ s.jsx(ld, { ...i }));
}
function Gm() {
  Ft == null || Ft.unmount(), Ft = null;
}
export {
  Tm as mount,
  Hm as mountCourseDetail,
  Bm as mountCurriculum,
  qm as mountExams,
  Om as mountProgram,
  Fm as mountProgramList,
  Im as unmount,
  Vm as unmountCourseDetail,
  Qm as unmountCurriculum,
  Gm as unmountExams,
  Am as unmountProgram,
  Um as unmountProgramList,
  Rm as update,
  Wm as updateCurriculum,
  Km as updateExams,
  Dm as updateProgram,
  $m as updateProgramList
};
