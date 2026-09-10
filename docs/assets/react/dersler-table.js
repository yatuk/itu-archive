function pf(a, c) {
  for (var u = 0; u < c.length; u++) {
    const f = c[u];
    if (typeof f != "string" && !Array.isArray(f)) {
      for (const g in f)
        if (g !== "default" && !(g in a)) {
          const h = Object.getOwnPropertyDescriptor(f, g);
          h && Object.defineProperty(a, g, h.get ? h : {
            enumerable: !0,
            get: () => f[g]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }));
}
function ff(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var ua = { exports: {} }, Gn = {}, ca = { exports: {} }, le = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jc;
function mf() {
  if (jc) return le;
  jc = 1;
  var a = Symbol.for("react.element"), c = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), f = Symbol.for("react.strict_mode"), g = Symbol.for("react.profiler"), h = Symbol.for("react.provider"), x = Symbol.for("react.context"), j = Symbol.for("react.forward_ref"), N = Symbol.for("react.suspense"), C = Symbol.for("react.memo"), R = Symbol.for("react.lazy"), B = Symbol.iterator;
  function I(v) {
    return v === null || typeof v != "object" ? null : (v = B && v[B] || v["@@iterator"], typeof v == "function" ? v : null);
  }
  var G = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, b = Object.assign, S = {};
  function M(v, z, ne) {
    this.props = v, this.context = z, this.refs = S, this.updater = ne || G;
  }
  M.prototype.isReactComponent = {}, M.prototype.setState = function(v, z) {
    if (typeof v != "object" && typeof v != "function" && v != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, v, z, "setState");
  }, M.prototype.forceUpdate = function(v) {
    this.updater.enqueueForceUpdate(this, v, "forceUpdate");
  };
  function V() {
  }
  V.prototype = M.prototype;
  function q(v, z, ne) {
    this.props = v, this.context = z, this.refs = S, this.updater = ne || G;
  }
  var T = q.prototype = new V();
  T.constructor = q, b(T, M.prototype), T.isPureReactComponent = !0;
  var O = Array.isArray, ee = Object.prototype.hasOwnProperty, Y = { current: null }, ae = { key: !0, ref: !0, __self: !0, __source: !0 };
  function me(v, z, ne) {
    var oe, ue = {}, ce = null, he = null;
    if (z != null) for (oe in z.ref !== void 0 && (he = z.ref), z.key !== void 0 && (ce = "" + z.key), z) ee.call(z, oe) && !ae.hasOwnProperty(oe) && (ue[oe] = z[oe]);
    var pe = arguments.length - 2;
    if (pe === 1) ue.children = ne;
    else if (1 < pe) {
      for (var ke = Array(pe), tt = 0; tt < pe; tt++) ke[tt] = arguments[tt + 2];
      ue.children = ke;
    }
    if (v && v.defaultProps) for (oe in pe = v.defaultProps, pe) ue[oe] === void 0 && (ue[oe] = pe[oe]);
    return { $$typeof: a, type: v, key: ce, ref: he, props: ue, _owner: Y.current };
  }
  function _e(v, z) {
    return { $$typeof: a, type: v.type, key: z, ref: v.ref, props: v.props, _owner: v._owner };
  }
  function Fe(v) {
    return typeof v == "object" && v !== null && v.$$typeof === a;
  }
  function Ie(v) {
    var z = { "=": "=0", ":": "=2" };
    return "$" + v.replace(/[=:]/g, function(ne) {
      return z[ne];
    });
  }
  var ie = /\/+/g;
  function $e(v, z) {
    return typeof v == "object" && v !== null && v.key != null ? Ie("" + v.key) : z.toString(36);
  }
  function He(v, z, ne, oe, ue) {
    var ce = typeof v;
    (ce === "undefined" || ce === "boolean") && (v = null);
    var he = !1;
    if (v === null) he = !0;
    else switch (ce) {
      case "string":
      case "number":
        he = !0;
        break;
      case "object":
        switch (v.$$typeof) {
          case a:
          case c:
            he = !0;
        }
    }
    if (he) return he = v, ue = ue(he), v = oe === "" ? "." + $e(he, 0) : oe, O(ue) ? (ne = "", v != null && (ne = v.replace(ie, "$&/") + "/"), He(ue, z, ne, "", function(tt) {
      return tt;
    })) : ue != null && (Fe(ue) && (ue = _e(ue, ne + (!ue.key || he && he.key === ue.key ? "" : ("" + ue.key).replace(ie, "$&/") + "/") + v)), z.push(ue)), 1;
    if (he = 0, oe = oe === "" ? "." : oe + ":", O(v)) for (var pe = 0; pe < v.length; pe++) {
      ce = v[pe];
      var ke = oe + $e(ce, pe);
      he += He(ce, z, ne, ke, ue);
    }
    else if (ke = I(v), typeof ke == "function") for (v = ke.call(v), pe = 0; !(ce = v.next()).done; ) ce = ce.value, ke = oe + $e(ce, pe++), he += He(ce, z, ne, ke, ue);
    else if (ce === "object") throw z = String(v), Error("Objects are not valid as a React child (found: " + (z === "[object Object]" ? "object with keys {" + Object.keys(v).join(", ") + "}" : z) + "). If you meant to render a collection of children, use an array instead.");
    return he;
  }
  function et(v, z, ne) {
    if (v == null) return v;
    var oe = [], ue = 0;
    return He(v, oe, "", "", function(ce) {
      return z.call(ne, ce, ue++);
    }), oe;
  }
  function Me(v) {
    if (v._status === -1) {
      var z = v._result;
      z = z(), z.then(function(ne) {
        (v._status === 0 || v._status === -1) && (v._status = 1, v._result = ne);
      }, function(ne) {
        (v._status === 0 || v._status === -1) && (v._status = 2, v._result = ne);
      }), v._status === -1 && (v._status = 0, v._result = z);
    }
    if (v._status === 1) return v._result.default;
    throw v._result;
  }
  var xe = { current: null }, D = { transition: null }, K = { ReactCurrentDispatcher: xe, ReactCurrentBatchConfig: D, ReactCurrentOwner: Y };
  function F() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return le.Children = { map: et, forEach: function(v, z, ne) {
    et(v, function() {
      z.apply(this, arguments);
    }, ne);
  }, count: function(v) {
    var z = 0;
    return et(v, function() {
      z++;
    }), z;
  }, toArray: function(v) {
    return et(v, function(z) {
      return z;
    }) || [];
  }, only: function(v) {
    if (!Fe(v)) throw Error("React.Children.only expected to receive a single React element child.");
    return v;
  } }, le.Component = M, le.Fragment = u, le.Profiler = g, le.PureComponent = q, le.StrictMode = f, le.Suspense = N, le.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = K, le.act = F, le.cloneElement = function(v, z, ne) {
    if (v == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + v + ".");
    var oe = b({}, v.props), ue = v.key, ce = v.ref, he = v._owner;
    if (z != null) {
      if (z.ref !== void 0 && (ce = z.ref, he = Y.current), z.key !== void 0 && (ue = "" + z.key), v.type && v.type.defaultProps) var pe = v.type.defaultProps;
      for (ke in z) ee.call(z, ke) && !ae.hasOwnProperty(ke) && (oe[ke] = z[ke] === void 0 && pe !== void 0 ? pe[ke] : z[ke]);
    }
    var ke = arguments.length - 2;
    if (ke === 1) oe.children = ne;
    else if (1 < ke) {
      pe = Array(ke);
      for (var tt = 0; tt < ke; tt++) pe[tt] = arguments[tt + 2];
      oe.children = pe;
    }
    return { $$typeof: a, type: v.type, key: ue, ref: ce, props: oe, _owner: he };
  }, le.createContext = function(v) {
    return v = { $$typeof: x, _currentValue: v, _currentValue2: v, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, v.Provider = { $$typeof: h, _context: v }, v.Consumer = v;
  }, le.createElement = me, le.createFactory = function(v) {
    var z = me.bind(null, v);
    return z.type = v, z;
  }, le.createRef = function() {
    return { current: null };
  }, le.forwardRef = function(v) {
    return { $$typeof: j, render: v };
  }, le.isValidElement = Fe, le.lazy = function(v) {
    return { $$typeof: R, _payload: { _status: -1, _result: v }, _init: Me };
  }, le.memo = function(v, z) {
    return { $$typeof: C, type: v, compare: z === void 0 ? null : z };
  }, le.startTransition = function(v) {
    var z = D.transition;
    D.transition = {};
    try {
      v();
    } finally {
      D.transition = z;
    }
  }, le.unstable_act = F, le.useCallback = function(v, z) {
    return xe.current.useCallback(v, z);
  }, le.useContext = function(v) {
    return xe.current.useContext(v);
  }, le.useDebugValue = function() {
  }, le.useDeferredValue = function(v) {
    return xe.current.useDeferredValue(v);
  }, le.useEffect = function(v, z) {
    return xe.current.useEffect(v, z);
  }, le.useId = function() {
    return xe.current.useId();
  }, le.useImperativeHandle = function(v, z, ne) {
    return xe.current.useImperativeHandle(v, z, ne);
  }, le.useInsertionEffect = function(v, z) {
    return xe.current.useInsertionEffect(v, z);
  }, le.useLayoutEffect = function(v, z) {
    return xe.current.useLayoutEffect(v, z);
  }, le.useMemo = function(v, z) {
    return xe.current.useMemo(v, z);
  }, le.useReducer = function(v, z, ne) {
    return xe.current.useReducer(v, z, ne);
  }, le.useRef = function(v) {
    return xe.current.useRef(v);
  }, le.useState = function(v) {
    return xe.current.useState(v);
  }, le.useSyncExternalStore = function(v, z, ne) {
    return xe.current.useSyncExternalStore(v, z, ne);
  }, le.useTransition = function() {
    return xe.current.useTransition();
  }, le.version = "18.3.1", le;
}
var Sc;
function ja() {
  return Sc || (Sc = 1, ca.exports = mf()), ca.exports;
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
var Cc;
function hf() {
  if (Cc) return Gn;
  Cc = 1;
  var a = ja(), c = Symbol.for("react.element"), u = Symbol.for("react.fragment"), f = Object.prototype.hasOwnProperty, g = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, h = { key: !0, ref: !0, __self: !0, __source: !0 };
  function x(j, N, C) {
    var R, B = {}, I = null, G = null;
    C !== void 0 && (I = "" + C), N.key !== void 0 && (I = "" + N.key), N.ref !== void 0 && (G = N.ref);
    for (R in N) f.call(N, R) && !h.hasOwnProperty(R) && (B[R] = N[R]);
    if (j && j.defaultProps) for (R in N = j.defaultProps, N) B[R] === void 0 && (B[R] = N[R]);
    return { $$typeof: c, type: j, key: I, ref: G, props: B, _owner: g.current };
  }
  return Gn.Fragment = u, Gn.jsx = x, Gn.jsxs = x, Gn;
}
var Nc;
function gf() {
  return Nc || (Nc = 1, ua.exports = hf()), ua.exports;
}
var i = gf(), Q = ja();
const xf = /* @__PURE__ */ ff(Q), vf = /* @__PURE__ */ pf({
  __proto__: null,
  default: xf
}, [Q]);
var co = {}, da = { exports: {} }, Je = {}, pa = { exports: {} }, fa = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ec;
function yf() {
  return Ec || (Ec = 1, (function(a) {
    function c(D, K) {
      var F = D.length;
      D.push(K);
      e: for (; 0 < F; ) {
        var v = F - 1 >>> 1, z = D[v];
        if (0 < g(z, K)) D[v] = K, D[F] = z, F = v;
        else break e;
      }
    }
    function u(D) {
      return D.length === 0 ? null : D[0];
    }
    function f(D) {
      if (D.length === 0) return null;
      var K = D[0], F = D.pop();
      if (F !== K) {
        D[0] = F;
        e: for (var v = 0, z = D.length, ne = z >>> 1; v < ne; ) {
          var oe = 2 * (v + 1) - 1, ue = D[oe], ce = oe + 1, he = D[ce];
          if (0 > g(ue, F)) ce < z && 0 > g(he, ue) ? (D[v] = he, D[ce] = F, v = ce) : (D[v] = ue, D[oe] = F, v = oe);
          else if (ce < z && 0 > g(he, F)) D[v] = he, D[ce] = F, v = ce;
          else break e;
        }
      }
      return K;
    }
    function g(D, K) {
      var F = D.sortIndex - K.sortIndex;
      return F !== 0 ? F : D.id - K.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      a.unstable_now = function() {
        return h.now();
      };
    } else {
      var x = Date, j = x.now();
      a.unstable_now = function() {
        return x.now() - j;
      };
    }
    var N = [], C = [], R = 1, B = null, I = 3, G = !1, b = !1, S = !1, M = typeof setTimeout == "function" ? setTimeout : null, V = typeof clearTimeout == "function" ? clearTimeout : null, q = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function T(D) {
      for (var K = u(C); K !== null; ) {
        if (K.callback === null) f(C);
        else if (K.startTime <= D) f(C), K.sortIndex = K.expirationTime, c(N, K);
        else break;
        K = u(C);
      }
    }
    function O(D) {
      if (S = !1, T(D), !b) if (u(N) !== null) b = !0, Me(ee);
      else {
        var K = u(C);
        K !== null && xe(O, K.startTime - D);
      }
    }
    function ee(D, K) {
      b = !1, S && (S = !1, V(me), me = -1), G = !0;
      var F = I;
      try {
        for (T(K), B = u(N); B !== null && (!(B.expirationTime > K) || D && !Ie()); ) {
          var v = B.callback;
          if (typeof v == "function") {
            B.callback = null, I = B.priorityLevel;
            var z = v(B.expirationTime <= K);
            K = a.unstable_now(), typeof z == "function" ? B.callback = z : B === u(N) && f(N), T(K);
          } else f(N);
          B = u(N);
        }
        if (B !== null) var ne = !0;
        else {
          var oe = u(C);
          oe !== null && xe(O, oe.startTime - K), ne = !1;
        }
        return ne;
      } finally {
        B = null, I = F, G = !1;
      }
    }
    var Y = !1, ae = null, me = -1, _e = 5, Fe = -1;
    function Ie() {
      return !(a.unstable_now() - Fe < _e);
    }
    function ie() {
      if (ae !== null) {
        var D = a.unstable_now();
        Fe = D;
        var K = !0;
        try {
          K = ae(!0, D);
        } finally {
          K ? $e() : (Y = !1, ae = null);
        }
      } else Y = !1;
    }
    var $e;
    if (typeof q == "function") $e = function() {
      q(ie);
    };
    else if (typeof MessageChannel < "u") {
      var He = new MessageChannel(), et = He.port2;
      He.port1.onmessage = ie, $e = function() {
        et.postMessage(null);
      };
    } else $e = function() {
      M(ie, 0);
    };
    function Me(D) {
      ae = D, Y || (Y = !0, $e());
    }
    function xe(D, K) {
      me = M(function() {
        D(a.unstable_now());
      }, K);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(D) {
      D.callback = null;
    }, a.unstable_continueExecution = function() {
      b || G || (b = !0, Me(ee));
    }, a.unstable_forceFrameRate = function(D) {
      0 > D || 125 < D ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : _e = 0 < D ? Math.floor(1e3 / D) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return I;
    }, a.unstable_getFirstCallbackNode = function() {
      return u(N);
    }, a.unstable_next = function(D) {
      switch (I) {
        case 1:
        case 2:
        case 3:
          var K = 3;
          break;
        default:
          K = I;
      }
      var F = I;
      I = K;
      try {
        return D();
      } finally {
        I = F;
      }
    }, a.unstable_pauseExecution = function() {
    }, a.unstable_requestPaint = function() {
    }, a.unstable_runWithPriority = function(D, K) {
      switch (D) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          D = 3;
      }
      var F = I;
      I = D;
      try {
        return K();
      } finally {
        I = F;
      }
    }, a.unstable_scheduleCallback = function(D, K, F) {
      var v = a.unstable_now();
      switch (typeof F == "object" && F !== null ? (F = F.delay, F = typeof F == "number" && 0 < F ? v + F : v) : F = v, D) {
        case 1:
          var z = -1;
          break;
        case 2:
          z = 250;
          break;
        case 5:
          z = 1073741823;
          break;
        case 4:
          z = 1e4;
          break;
        default:
          z = 5e3;
      }
      return z = F + z, D = { id: R++, callback: K, priorityLevel: D, startTime: F, expirationTime: z, sortIndex: -1 }, F > v ? (D.sortIndex = F, c(C, D), u(N) === null && D === u(C) && (S ? (V(me), me = -1) : S = !0, xe(O, F - v))) : (D.sortIndex = z, c(N, D), b || G || (b = !0, Me(ee))), D;
    }, a.unstable_shouldYield = Ie, a.unstable_wrapCallback = function(D) {
      var K = I;
      return function() {
        var F = I;
        I = K;
        try {
          return D.apply(this, arguments);
        } finally {
          I = F;
        }
      };
    };
  })(fa)), fa;
}
var zc;
function wf() {
  return zc || (zc = 1, pa.exports = yf()), pa.exports;
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
var _c;
function kf() {
  if (_c) return Je;
  _c = 1;
  var a = ja(), c = wf();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1; r < arguments.length; r++) t += "&args[]=" + encodeURIComponent(arguments[r]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var f = /* @__PURE__ */ new Set(), g = {};
  function h(e, t) {
    x(e, t), x(e + "Capture", t);
  }
  function x(e, t) {
    for (g[e] = t, e = 0; e < t.length; e++) f.add(t[e]);
  }
  var j = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), N = Object.prototype.hasOwnProperty, C = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, R = {}, B = {};
  function I(e) {
    return N.call(B, e) ? !0 : N.call(R, e) ? !1 : C.test(e) ? B[e] = !0 : (R[e] = !0, !1);
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
  function b(e, t, r, n) {
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
  function S(e, t, r, n, l, o, s) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = n, this.attributeNamespace = l, this.mustUseProperty = r, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = s;
  }
  var M = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    M[e] = new S(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    M[t] = new S(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    M[e] = new S(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    M[e] = new S(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    M[e] = new S(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    M[e] = new S(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    M[e] = new S(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    M[e] = new S(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    M[e] = new S(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var V = /[\-:]([a-z])/g;
  function q(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      V,
      q
    );
    M[t] = new S(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(V, q);
    M[t] = new S(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(V, q);
    M[t] = new S(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    M[e] = new S(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), M.xlinkHref = new S("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    M[e] = new S(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function T(e, t, r, n) {
    var l = M.hasOwnProperty(t) ? M[t] : null;
    (l !== null ? l.type !== 0 : n || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (b(t, r, l, n) && (r = null), n || l === null ? I(t) && (r === null ? e.removeAttribute(t) : e.setAttribute(t, "" + r)) : l.mustUseProperty ? e[l.propertyName] = r === null ? l.type === 3 ? !1 : "" : r : (t = l.attributeName, n = l.attributeNamespace, r === null ? e.removeAttribute(t) : (l = l.type, r = l === 3 || l === 4 && r === !0 ? "" : "" + r, n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r))));
  }
  var O = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ee = Symbol.for("react.element"), Y = Symbol.for("react.portal"), ae = Symbol.for("react.fragment"), me = Symbol.for("react.strict_mode"), _e = Symbol.for("react.profiler"), Fe = Symbol.for("react.provider"), Ie = Symbol.for("react.context"), ie = Symbol.for("react.forward_ref"), $e = Symbol.for("react.suspense"), He = Symbol.for("react.suspense_list"), et = Symbol.for("react.memo"), Me = Symbol.for("react.lazy"), xe = Symbol.for("react.offscreen"), D = Symbol.iterator;
  function K(e) {
    return e === null || typeof e != "object" ? null : (e = D && e[D] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var F = Object.assign, v;
  function z(e) {
    if (v === void 0) try {
      throw Error();
    } catch (r) {
      var t = r.stack.trim().match(/\n( *(at )?)/);
      v = t && t[1] || "";
    }
    return `
` + v + e;
  }
  var ne = !1;
  function oe(e, t) {
    if (!e || ne) return "";
    ne = !0;
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
`), s = l.length - 1, d = o.length - 1; 1 <= s && 0 <= d && l[s] !== o[d]; ) d--;
        for (; 1 <= s && 0 <= d; s--, d--) if (l[s] !== o[d]) {
          if (s !== 1 || d !== 1)
            do
              if (s--, d--, 0 > d || l[s] !== o[d]) {
                var p = `
` + l[s].replace(" at new ", " at ");
                return e.displayName && p.includes("<anonymous>") && (p = p.replace("<anonymous>", e.displayName)), p;
              }
            while (1 <= s && 0 <= d);
          break;
        }
      }
    } finally {
      ne = !1, Error.prepareStackTrace = r;
    }
    return (e = e ? e.displayName || e.name : "") ? z(e) : "";
  }
  function ue(e) {
    switch (e.tag) {
      case 5:
        return z(e.type);
      case 16:
        return z("Lazy");
      case 13:
        return z("Suspense");
      case 19:
        return z("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = oe(e.type, !1), e;
      case 11:
        return e = oe(e.type.render, !1), e;
      case 1:
        return e = oe(e.type, !0), e;
      default:
        return "";
    }
  }
  function ce(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ae:
        return "Fragment";
      case Y:
        return "Portal";
      case _e:
        return "Profiler";
      case me:
        return "StrictMode";
      case $e:
        return "Suspense";
      case He:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Ie:
        return (e.displayName || "Context") + ".Consumer";
      case Fe:
        return (e._context.displayName || "Context") + ".Provider";
      case ie:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case et:
        return t = e.displayName || null, t !== null ? t : ce(e.type) || "Memo";
      case Me:
        t = e._payload, e = e._init;
        try {
          return ce(e(t));
        } catch {
        }
    }
    return null;
  }
  function he(e) {
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
        return ce(t);
      case 8:
        return t === me ? "StrictMode" : "Mode";
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
  function pe(e) {
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
      }, set: function(s) {
        n = "" + s, o.call(this, s);
      } }), Object.defineProperty(e, t, { enumerable: r.enumerable }), { getValue: function() {
        return n;
      }, setValue: function(s) {
        n = "" + s;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function el(e) {
    e._valueTracker || (e._valueTracker = tt(e));
  }
  function _a(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var r = t.getValue(), n = "";
    return e && (n = ke(e) ? e.checked ? "true" : "false" : e.value), e = n, e !== r ? (t.setValue(e), !0) : !1;
  }
  function tl(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function go(e, t) {
    var r = t.checked;
    return F({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: r ?? e._wrapperState.initialChecked });
  }
  function Ma(e, t) {
    var r = t.defaultValue == null ? "" : t.defaultValue, n = t.checked != null ? t.checked : t.defaultChecked;
    r = pe(t.value != null ? t.value : r), e._wrapperState = { initialChecked: n, initialValue: r, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Pa(e, t) {
    t = t.checked, t != null && T(e, "checked", t, !1);
  }
  function xo(e, t) {
    Pa(e, t);
    var r = pe(t.value), n = t.type;
    if (r != null) n === "number" ? (r === 0 && e.value === "" || e.value != r) && (e.value = "" + r) : e.value !== "" + r && (e.value = "" + r);
    else if (n === "submit" || n === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? vo(e, t.type, r) : t.hasOwnProperty("defaultValue") && vo(e, t.type, pe(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function La(e, t, r) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var n = t.type;
      if (!(n !== "submit" && n !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, r || t === e.value || (e.value = t), e.defaultValue = t;
    }
    r = e.name, r !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, r !== "" && (e.name = r);
  }
  function vo(e, t, r) {
    (t !== "number" || tl(e.ownerDocument) !== e) && (r == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + r && (e.defaultValue = "" + r));
  }
  var un = Array.isArray;
  function Rr(e, t, r, n) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < r.length; l++) t["$" + r[l]] = !0;
      for (r = 0; r < e.length; r++) l = t.hasOwnProperty("$" + e[r].value), e[r].selected !== l && (e[r].selected = l), l && n && (e[r].defaultSelected = !0);
    } else {
      for (r = "" + pe(r), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === r) {
          e[l].selected = !0, n && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function yo(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return F({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Ta(e, t) {
    var r = t.value;
    if (r == null) {
      if (r = t.children, t = t.defaultValue, r != null) {
        if (t != null) throw Error(u(92));
        if (un(r)) {
          if (1 < r.length) throw Error(u(93));
          r = r[0];
        }
        t = r;
      }
      t == null && (t = ""), r = t;
    }
    e._wrapperState = { initialValue: pe(r) };
  }
  function Ra(e, t) {
    var r = pe(t.value), n = pe(t.defaultValue);
    r != null && (r = "" + r, r !== e.value && (e.value = r), t.defaultValue == null && e.defaultValue !== r && (e.defaultValue = r)), n != null && (e.defaultValue = "" + n);
  }
  function Da(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Ia(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function wo(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Ia(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var rl, Oa = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, r, n, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, r, n, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (rl = rl || document.createElement("div"), rl.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = rl.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function cn(e, t) {
    if (t) {
      var r = e.firstChild;
      if (r && r === e.lastChild && r.nodeType === 3) {
        r.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var dn = {
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
  }, hd = ["Webkit", "ms", "Moz", "O"];
  Object.keys(dn).forEach(function(e) {
    hd.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), dn[t] = dn[e];
    });
  });
  function Aa(e, t, r) {
    return t == null || typeof t == "boolean" || t === "" ? "" : r || typeof t != "number" || t === 0 || dn.hasOwnProperty(e) && dn[e] ? ("" + t).trim() : t + "px";
  }
  function Fa(e, t) {
    e = e.style;
    for (var r in t) if (t.hasOwnProperty(r)) {
      var n = r.indexOf("--") === 0, l = Aa(r, t[r], n);
      r === "float" && (r = "cssFloat"), n ? e.setProperty(r, l) : e[r] = l;
    }
  }
  var gd = F({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function ko(e, t) {
    if (t) {
      if (gd[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function bo(e, t) {
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
  var jo = null;
  function So(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Co = null, Dr = null, Ir = null;
  function $a(e) {
    if (e = Tn(e)) {
      if (typeof Co != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = Cl(t), Co(e.stateNode, e.type, t));
    }
  }
  function Ha(e) {
    Dr ? Ir ? Ir.push(e) : Ir = [e] : Dr = e;
  }
  function Ua() {
    if (Dr) {
      var e = Dr, t = Ir;
      if (Ir = Dr = null, $a(e), t) for (e = 0; e < t.length; e++) $a(t[e]);
    }
  }
  function Va(e, t) {
    return e(t);
  }
  function Ba() {
  }
  var No = !1;
  function Wa(e, t, r) {
    if (No) return e(t, r);
    No = !0;
    try {
      return Va(e, t, r);
    } finally {
      No = !1, (Dr !== null || Ir !== null) && (Ba(), Ua());
    }
  }
  function pn(e, t) {
    var r = e.stateNode;
    if (r === null) return null;
    var n = Cl(r);
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
  var Eo = !1;
  if (j) try {
    var fn = {};
    Object.defineProperty(fn, "passive", { get: function() {
      Eo = !0;
    } }), window.addEventListener("test", fn, fn), window.removeEventListener("test", fn, fn);
  } catch {
    Eo = !1;
  }
  function xd(e, t, r, n, l, o, s, d, p) {
    var k = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(r, k);
    } catch (_) {
      this.onError(_);
    }
  }
  var mn = !1, nl = null, ll = !1, zo = null, vd = { onError: function(e) {
    mn = !0, nl = e;
  } };
  function yd(e, t, r, n, l, o, s, d, p) {
    mn = !1, nl = null, xd.apply(vd, arguments);
  }
  function wd(e, t, r, n, l, o, s, d, p) {
    if (yd.apply(this, arguments), mn) {
      if (mn) {
        var k = nl;
        mn = !1, nl = null;
      } else throw Error(u(198));
      ll || (ll = !0, zo = k);
    }
  }
  function hr(e) {
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
  function qa(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Qa(e) {
    if (hr(e) !== e) throw Error(u(188));
  }
  function kd(e) {
    var t = e.alternate;
    if (!t) {
      if (t = hr(e), t === null) throw Error(u(188));
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
          if (o === r) return Qa(l), e;
          if (o === n) return Qa(l), t;
          o = o.sibling;
        }
        throw Error(u(188));
      }
      if (r.return !== n.return) r = l, n = o;
      else {
        for (var s = !1, d = l.child; d; ) {
          if (d === r) {
            s = !0, r = l, n = o;
            break;
          }
          if (d === n) {
            s = !0, n = l, r = o;
            break;
          }
          d = d.sibling;
        }
        if (!s) {
          for (d = o.child; d; ) {
            if (d === r) {
              s = !0, r = o, n = l;
              break;
            }
            if (d === n) {
              s = !0, n = o, r = l;
              break;
            }
            d = d.sibling;
          }
          if (!s) throw Error(u(189));
        }
      }
      if (r.alternate !== n) throw Error(u(190));
    }
    if (r.tag !== 3) throw Error(u(188));
    return r.stateNode.current === r ? e : t;
  }
  function Ga(e) {
    return e = kd(e), e !== null ? Ka(e) : null;
  }
  function Ka(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Ka(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Ya = c.unstable_scheduleCallback, Xa = c.unstable_cancelCallback, bd = c.unstable_shouldYield, jd = c.unstable_requestPaint, Ne = c.unstable_now, Sd = c.unstable_getCurrentPriorityLevel, _o = c.unstable_ImmediatePriority, Za = c.unstable_UserBlockingPriority, ol = c.unstable_NormalPriority, Cd = c.unstable_LowPriority, Ja = c.unstable_IdlePriority, il = null, jt = null;
  function Nd(e) {
    if (jt && typeof jt.onCommitFiberRoot == "function") try {
      jt.onCommitFiberRoot(il, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var mt = Math.clz32 ? Math.clz32 : _d, Ed = Math.log, zd = Math.LN2;
  function _d(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Ed(e) / zd | 0) | 0;
  }
  var al = 64, sl = 4194304;
  function hn(e) {
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
  function ul(e, t) {
    var r = e.pendingLanes;
    if (r === 0) return 0;
    var n = 0, l = e.suspendedLanes, o = e.pingedLanes, s = r & 268435455;
    if (s !== 0) {
      var d = s & ~l;
      d !== 0 ? n = hn(d) : (o &= s, o !== 0 && (n = hn(o)));
    } else s = r & ~l, s !== 0 ? n = hn(s) : o !== 0 && (n = hn(o));
    if (n === 0) return 0;
    if (t !== 0 && t !== n && (t & l) === 0 && (l = n & -n, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((n & 4) !== 0 && (n |= r & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= n; 0 < t; ) r = 31 - mt(t), l = 1 << r, n |= e[r], t &= ~l;
    return n;
  }
  function Md(e, t) {
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
  function Pd(e, t) {
    for (var r = e.suspendedLanes, n = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var s = 31 - mt(o), d = 1 << s, p = l[s];
      p === -1 ? ((d & r) === 0 || (d & n) !== 0) && (l[s] = Md(d, t)) : p <= t && (e.expiredLanes |= d), o &= ~d;
    }
  }
  function Mo(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function es() {
    var e = al;
    return al <<= 1, (al & 4194240) === 0 && (al = 64), e;
  }
  function Po(e) {
    for (var t = [], r = 0; 31 > r; r++) t.push(e);
    return t;
  }
  function gn(e, t, r) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - mt(t), e[t] = r;
  }
  function Ld(e, t) {
    var r = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var n = e.eventTimes;
    for (e = e.expirationTimes; 0 < r; ) {
      var l = 31 - mt(r), o = 1 << l;
      t[l] = 0, n[l] = -1, e[l] = -1, r &= ~o;
    }
  }
  function Lo(e, t) {
    var r = e.entangledLanes |= t;
    for (e = e.entanglements; r; ) {
      var n = 31 - mt(r), l = 1 << n;
      l & t | e[n] & t && (e[n] |= t), r &= ~l;
    }
  }
  var fe = 0;
  function ts(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var rs, To, ns, ls, os, Ro = !1, cl = [], qt = null, Qt = null, Gt = null, xn = /* @__PURE__ */ new Map(), vn = /* @__PURE__ */ new Map(), Kt = [], Td = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function is(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        qt = null;
        break;
      case "dragenter":
      case "dragleave":
        Qt = null;
        break;
      case "mouseover":
      case "mouseout":
        Gt = null;
        break;
      case "pointerover":
      case "pointerout":
        xn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        vn.delete(t.pointerId);
    }
  }
  function yn(e, t, r, n, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: r, eventSystemFlags: n, nativeEvent: o, targetContainers: [l] }, t !== null && (t = Tn(t), t !== null && To(t)), e) : (e.eventSystemFlags |= n, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Rd(e, t, r, n, l) {
    switch (t) {
      case "focusin":
        return qt = yn(qt, e, t, r, n, l), !0;
      case "dragenter":
        return Qt = yn(Qt, e, t, r, n, l), !0;
      case "mouseover":
        return Gt = yn(Gt, e, t, r, n, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return xn.set(o, yn(xn.get(o) || null, e, t, r, n, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, vn.set(o, yn(vn.get(o) || null, e, t, r, n, l)), !0;
    }
    return !1;
  }
  function as(e) {
    var t = gr(e.target);
    if (t !== null) {
      var r = hr(t);
      if (r !== null) {
        if (t = r.tag, t === 13) {
          if (t = qa(r), t !== null) {
            e.blockedOn = t, os(e.priority, function() {
              ns(r);
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
  function dl(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var r = Io(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (r === null) {
        r = e.nativeEvent;
        var n = new r.constructor(r.type, r);
        jo = n, r.target.dispatchEvent(n), jo = null;
      } else return t = Tn(r), t !== null && To(t), e.blockedOn = r, !1;
      t.shift();
    }
    return !0;
  }
  function ss(e, t, r) {
    dl(e) && r.delete(t);
  }
  function Dd() {
    Ro = !1, qt !== null && dl(qt) && (qt = null), Qt !== null && dl(Qt) && (Qt = null), Gt !== null && dl(Gt) && (Gt = null), xn.forEach(ss), vn.forEach(ss);
  }
  function wn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Ro || (Ro = !0, c.unstable_scheduleCallback(c.unstable_NormalPriority, Dd)));
  }
  function kn(e) {
    function t(l) {
      return wn(l, e);
    }
    if (0 < cl.length) {
      wn(cl[0], e);
      for (var r = 1; r < cl.length; r++) {
        var n = cl[r];
        n.blockedOn === e && (n.blockedOn = null);
      }
    }
    for (qt !== null && wn(qt, e), Qt !== null && wn(Qt, e), Gt !== null && wn(Gt, e), xn.forEach(t), vn.forEach(t), r = 0; r < Kt.length; r++) n = Kt[r], n.blockedOn === e && (n.blockedOn = null);
    for (; 0 < Kt.length && (r = Kt[0], r.blockedOn === null); ) as(r), r.blockedOn === null && Kt.shift();
  }
  var Or = O.ReactCurrentBatchConfig, pl = !0;
  function Id(e, t, r, n) {
    var l = fe, o = Or.transition;
    Or.transition = null;
    try {
      fe = 1, Do(e, t, r, n);
    } finally {
      fe = l, Or.transition = o;
    }
  }
  function Od(e, t, r, n) {
    var l = fe, o = Or.transition;
    Or.transition = null;
    try {
      fe = 4, Do(e, t, r, n);
    } finally {
      fe = l, Or.transition = o;
    }
  }
  function Do(e, t, r, n) {
    if (pl) {
      var l = Io(e, t, r, n);
      if (l === null) Jo(e, t, n, fl, r), is(e, n);
      else if (Rd(l, e, t, r, n)) n.stopPropagation();
      else if (is(e, n), t & 4 && -1 < Td.indexOf(e)) {
        for (; l !== null; ) {
          var o = Tn(l);
          if (o !== null && rs(o), o = Io(e, t, r, n), o === null && Jo(e, t, n, fl, r), o === l) break;
          l = o;
        }
        l !== null && n.stopPropagation();
      } else Jo(e, t, n, null, r);
    }
  }
  var fl = null;
  function Io(e, t, r, n) {
    if (fl = null, e = So(n), e = gr(e), e !== null) if (t = hr(e), t === null) e = null;
    else if (r = t.tag, r === 13) {
      if (e = qa(t), e !== null) return e;
      e = null;
    } else if (r === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return fl = e, null;
  }
  function us(e) {
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
        switch (Sd()) {
          case _o:
            return 1;
          case Za:
            return 4;
          case ol:
          case Cd:
            return 16;
          case Ja:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Yt = null, Oo = null, ml = null;
  function cs() {
    if (ml) return ml;
    var e, t = Oo, r = t.length, n, l = "value" in Yt ? Yt.value : Yt.textContent, o = l.length;
    for (e = 0; e < r && t[e] === l[e]; e++) ;
    var s = r - e;
    for (n = 1; n <= s && t[r - n] === l[o - n]; n++) ;
    return ml = l.slice(e, 1 < n ? 1 - n : void 0);
  }
  function hl(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function gl() {
    return !0;
  }
  function ds() {
    return !1;
  }
  function rt(e) {
    function t(r, n, l, o, s) {
      this._reactName = r, this._targetInst = l, this.type = n, this.nativeEvent = o, this.target = s, this.currentTarget = null;
      for (var d in e) e.hasOwnProperty(d) && (r = e[d], this[d] = r ? r(o) : o[d]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? gl : ds, this.isPropagationStopped = ds, this;
    }
    return F(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var r = this.nativeEvent;
      r && (r.preventDefault ? r.preventDefault() : typeof r.returnValue != "unknown" && (r.returnValue = !1), this.isDefaultPrevented = gl);
    }, stopPropagation: function() {
      var r = this.nativeEvent;
      r && (r.stopPropagation ? r.stopPropagation() : typeof r.cancelBubble != "unknown" && (r.cancelBubble = !0), this.isPropagationStopped = gl);
    }, persist: function() {
    }, isPersistent: gl }), t;
  }
  var Ar = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Ao = rt(Ar), bn = F({}, Ar, { view: 0, detail: 0 }), Ad = rt(bn), Fo, $o, jn, xl = F({}, bn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Uo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== jn && (jn && e.type === "mousemove" ? (Fo = e.screenX - jn.screenX, $o = e.screenY - jn.screenY) : $o = Fo = 0, jn = e), Fo);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : $o;
  } }), ps = rt(xl), Fd = F({}, xl, { dataTransfer: 0 }), $d = rt(Fd), Hd = F({}, bn, { relatedTarget: 0 }), Ho = rt(Hd), Ud = F({}, Ar, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Vd = rt(Ud), Bd = F({}, Ar, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Wd = rt(Bd), qd = F({}, Ar, { data: 0 }), fs = rt(qd), Qd = {
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
  }, Gd = {
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
  }, Kd = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Yd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Kd[e]) ? !!t[e] : !1;
  }
  function Uo() {
    return Yd;
  }
  var Xd = F({}, bn, { key: function(e) {
    if (e.key) {
      var t = Qd[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = hl(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Gd[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Uo, charCode: function(e) {
    return e.type === "keypress" ? hl(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? hl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Zd = rt(Xd), Jd = F({}, xl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), ms = rt(Jd), ep = F({}, bn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Uo }), tp = rt(ep), rp = F({}, Ar, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), np = rt(rp), lp = F({}, xl, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), op = rt(lp), ip = [9, 13, 27, 32], Vo = j && "CompositionEvent" in window, Sn = null;
  j && "documentMode" in document && (Sn = document.documentMode);
  var ap = j && "TextEvent" in window && !Sn, hs = j && (!Vo || Sn && 8 < Sn && 11 >= Sn), gs = " ", xs = !1;
  function vs(e, t) {
    switch (e) {
      case "keyup":
        return ip.indexOf(t.keyCode) !== -1;
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
  function ys(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Fr = !1;
  function sp(e, t) {
    switch (e) {
      case "compositionend":
        return ys(t);
      case "keypress":
        return t.which !== 32 ? null : (xs = !0, gs);
      case "textInput":
        return e = t.data, e === gs && xs ? null : e;
      default:
        return null;
    }
  }
  function up(e, t) {
    if (Fr) return e === "compositionend" || !Vo && vs(e, t) ? (e = cs(), ml = Oo = Yt = null, Fr = !1, e) : null;
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
        return hs && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var cp = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function ws(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!cp[e.type] : t === "textarea";
  }
  function ks(e, t, r, n) {
    Ha(n), t = bl(t, "onChange"), 0 < t.length && (r = new Ao("onChange", "change", null, r, n), e.push({ event: r, listeners: t }));
  }
  var Cn = null, Nn = null;
  function dp(e) {
    Fs(e, 0);
  }
  function vl(e) {
    var t = Br(e);
    if (_a(t)) return e;
  }
  function pp(e, t) {
    if (e === "change") return t;
  }
  var bs = !1;
  if (j) {
    var Bo;
    if (j) {
      var Wo = "oninput" in document;
      if (!Wo) {
        var js = document.createElement("div");
        js.setAttribute("oninput", "return;"), Wo = typeof js.oninput == "function";
      }
      Bo = Wo;
    } else Bo = !1;
    bs = Bo && (!document.documentMode || 9 < document.documentMode);
  }
  function Ss() {
    Cn && (Cn.detachEvent("onpropertychange", Cs), Nn = Cn = null);
  }
  function Cs(e) {
    if (e.propertyName === "value" && vl(Nn)) {
      var t = [];
      ks(t, Nn, e, So(e)), Wa(dp, t);
    }
  }
  function fp(e, t, r) {
    e === "focusin" ? (Ss(), Cn = t, Nn = r, Cn.attachEvent("onpropertychange", Cs)) : e === "focusout" && Ss();
  }
  function mp(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return vl(Nn);
  }
  function hp(e, t) {
    if (e === "click") return vl(t);
  }
  function gp(e, t) {
    if (e === "input" || e === "change") return vl(t);
  }
  function xp(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ht = typeof Object.is == "function" ? Object.is : xp;
  function En(e, t) {
    if (ht(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var r = Object.keys(e), n = Object.keys(t);
    if (r.length !== n.length) return !1;
    for (n = 0; n < r.length; n++) {
      var l = r[n];
      if (!N.call(t, l) || !ht(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Ns(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Es(e, t) {
    var r = Ns(e);
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
      r = Ns(r);
    }
  }
  function zs(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? zs(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function _s() {
    for (var e = window, t = tl(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var r = typeof t.contentWindow.location.href == "string";
      } catch {
        r = !1;
      }
      if (r) e = t.contentWindow;
      else break;
      t = tl(e.document);
    }
    return t;
  }
  function qo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function vp(e) {
    var t = _s(), r = e.focusedElem, n = e.selectionRange;
    if (t !== r && r && r.ownerDocument && zs(r.ownerDocument.documentElement, r)) {
      if (n !== null && qo(r)) {
        if (t = n.start, e = n.end, e === void 0 && (e = t), "selectionStart" in r) r.selectionStart = t, r.selectionEnd = Math.min(e, r.value.length);
        else if (e = (t = r.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = r.textContent.length, o = Math.min(n.start, l);
          n = n.end === void 0 ? o : Math.min(n.end, l), !e.extend && o > n && (l = n, n = o, o = l), l = Es(r, o);
          var s = Es(
            r,
            n
          );
          l && s && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== s.node || e.focusOffset !== s.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), o > n ? (e.addRange(t), e.extend(s.node, s.offset)) : (t.setEnd(s.node, s.offset), e.addRange(t)));
        }
      }
      for (t = [], e = r; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof r.focus == "function" && r.focus(), r = 0; r < t.length; r++) e = t[r], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var yp = j && "documentMode" in document && 11 >= document.documentMode, $r = null, Qo = null, zn = null, Go = !1;
  function Ms(e, t, r) {
    var n = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
    Go || $r == null || $r !== tl(n) || (n = $r, "selectionStart" in n && qo(n) ? n = { start: n.selectionStart, end: n.selectionEnd } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = { anchorNode: n.anchorNode, anchorOffset: n.anchorOffset, focusNode: n.focusNode, focusOffset: n.focusOffset }), zn && En(zn, n) || (zn = n, n = bl(Qo, "onSelect"), 0 < n.length && (t = new Ao("onSelect", "select", null, t, r), e.push({ event: t, listeners: n }), t.target = $r)));
  }
  function yl(e, t) {
    var r = {};
    return r[e.toLowerCase()] = t.toLowerCase(), r["Webkit" + e] = "webkit" + t, r["Moz" + e] = "moz" + t, r;
  }
  var Hr = { animationend: yl("Animation", "AnimationEnd"), animationiteration: yl("Animation", "AnimationIteration"), animationstart: yl("Animation", "AnimationStart"), transitionend: yl("Transition", "TransitionEnd") }, Ko = {}, Ps = {};
  j && (Ps = document.createElement("div").style, "AnimationEvent" in window || (delete Hr.animationend.animation, delete Hr.animationiteration.animation, delete Hr.animationstart.animation), "TransitionEvent" in window || delete Hr.transitionend.transition);
  function wl(e) {
    if (Ko[e]) return Ko[e];
    if (!Hr[e]) return e;
    var t = Hr[e], r;
    for (r in t) if (t.hasOwnProperty(r) && r in Ps) return Ko[e] = t[r];
    return e;
  }
  var Ls = wl("animationend"), Ts = wl("animationiteration"), Rs = wl("animationstart"), Ds = wl("transitionend"), Is = /* @__PURE__ */ new Map(), Os = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Xt(e, t) {
    Is.set(e, t), h(t, [e]);
  }
  for (var Yo = 0; Yo < Os.length; Yo++) {
    var Xo = Os[Yo], wp = Xo.toLowerCase(), kp = Xo[0].toUpperCase() + Xo.slice(1);
    Xt(wp, "on" + kp);
  }
  Xt(Ls, "onAnimationEnd"), Xt(Ts, "onAnimationIteration"), Xt(Rs, "onAnimationStart"), Xt("dblclick", "onDoubleClick"), Xt("focusin", "onFocus"), Xt("focusout", "onBlur"), Xt(Ds, "onTransitionEnd"), x("onMouseEnter", ["mouseout", "mouseover"]), x("onMouseLeave", ["mouseout", "mouseover"]), x("onPointerEnter", ["pointerout", "pointerover"]), x("onPointerLeave", ["pointerout", "pointerover"]), h("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), h("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), h("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), h("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), h("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), h("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var _n = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), bp = new Set("cancel close invalid load scroll toggle".split(" ").concat(_n));
  function As(e, t, r) {
    var n = e.type || "unknown-event";
    e.currentTarget = r, wd(n, t, void 0, e), e.currentTarget = null;
  }
  function Fs(e, t) {
    t = (t & 4) !== 0;
    for (var r = 0; r < e.length; r++) {
      var n = e[r], l = n.event;
      n = n.listeners;
      e: {
        var o = void 0;
        if (t) for (var s = n.length - 1; 0 <= s; s--) {
          var d = n[s], p = d.instance, k = d.currentTarget;
          if (d = d.listener, p !== o && l.isPropagationStopped()) break e;
          As(l, d, k), o = p;
        }
        else for (s = 0; s < n.length; s++) {
          if (d = n[s], p = d.instance, k = d.currentTarget, d = d.listener, p !== o && l.isPropagationStopped()) break e;
          As(l, d, k), o = p;
        }
      }
    }
    if (ll) throw e = zo, ll = !1, zo = null, e;
  }
  function ve(e, t) {
    var r = t[oi];
    r === void 0 && (r = t[oi] = /* @__PURE__ */ new Set());
    var n = e + "__bubble";
    r.has(n) || ($s(t, e, 2, !1), r.add(n));
  }
  function Zo(e, t, r) {
    var n = 0;
    t && (n |= 4), $s(r, e, n, t);
  }
  var kl = "_reactListening" + Math.random().toString(36).slice(2);
  function Mn(e) {
    if (!e[kl]) {
      e[kl] = !0, f.forEach(function(r) {
        r !== "selectionchange" && (bp.has(r) || Zo(r, !1, e), Zo(r, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[kl] || (t[kl] = !0, Zo("selectionchange", !1, t));
    }
  }
  function $s(e, t, r, n) {
    switch (us(t)) {
      case 1:
        var l = Id;
        break;
      case 4:
        l = Od;
        break;
      default:
        l = Do;
    }
    r = l.bind(null, t, r, e), l = void 0, !Eo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), n ? l !== void 0 ? e.addEventListener(t, r, { capture: !0, passive: l }) : e.addEventListener(t, r, !0) : l !== void 0 ? e.addEventListener(t, r, { passive: l }) : e.addEventListener(t, r, !1);
  }
  function Jo(e, t, r, n, l) {
    var o = n;
    if ((t & 1) === 0 && (t & 2) === 0 && n !== null) e: for (; ; ) {
      if (n === null) return;
      var s = n.tag;
      if (s === 3 || s === 4) {
        var d = n.stateNode.containerInfo;
        if (d === l || d.nodeType === 8 && d.parentNode === l) break;
        if (s === 4) for (s = n.return; s !== null; ) {
          var p = s.tag;
          if ((p === 3 || p === 4) && (p = s.stateNode.containerInfo, p === l || p.nodeType === 8 && p.parentNode === l)) return;
          s = s.return;
        }
        for (; d !== null; ) {
          if (s = gr(d), s === null) return;
          if (p = s.tag, p === 5 || p === 6) {
            n = o = s;
            continue e;
          }
          d = d.parentNode;
        }
      }
      n = n.return;
    }
    Wa(function() {
      var k = o, _ = So(r), P = [];
      e: {
        var E = Is.get(e);
        if (E !== void 0) {
          var A = Ao, H = e;
          switch (e) {
            case "keypress":
              if (hl(r) === 0) break e;
            case "keydown":
            case "keyup":
              A = Zd;
              break;
            case "focusin":
              H = "focus", A = Ho;
              break;
            case "focusout":
              H = "blur", A = Ho;
              break;
            case "beforeblur":
            case "afterblur":
              A = Ho;
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
              A = ps;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              A = $d;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              A = tp;
              break;
            case Ls:
            case Ts:
            case Rs:
              A = Vd;
              break;
            case Ds:
              A = np;
              break;
            case "scroll":
              A = Ad;
              break;
            case "wheel":
              A = op;
              break;
            case "copy":
            case "cut":
            case "paste":
              A = Wd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              A = ms;
          }
          var U = (t & 4) !== 0, Ee = !U && e === "scroll", y = U ? E !== null ? E + "Capture" : null : E;
          U = [];
          for (var m = k, w; m !== null; ) {
            w = m;
            var L = w.stateNode;
            if (w.tag === 5 && L !== null && (w = L, y !== null && (L = pn(m, y), L != null && U.push(Pn(m, L, w)))), Ee) break;
            m = m.return;
          }
          0 < U.length && (E = new A(E, H, null, r, _), P.push({ event: E, listeners: U }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (E = e === "mouseover" || e === "pointerover", A = e === "mouseout" || e === "pointerout", E && r !== jo && (H = r.relatedTarget || r.fromElement) && (gr(H) || H[Mt])) break e;
          if ((A || E) && (E = _.window === _ ? _ : (E = _.ownerDocument) ? E.defaultView || E.parentWindow : window, A ? (H = r.relatedTarget || r.toElement, A = k, H = H ? gr(H) : null, H !== null && (Ee = hr(H), H !== Ee || H.tag !== 5 && H.tag !== 6) && (H = null)) : (A = null, H = k), A !== H)) {
            if (U = ps, L = "onMouseLeave", y = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (U = ms, L = "onPointerLeave", y = "onPointerEnter", m = "pointer"), Ee = A == null ? E : Br(A), w = H == null ? E : Br(H), E = new U(L, m + "leave", A, r, _), E.target = Ee, E.relatedTarget = w, L = null, gr(_) === k && (U = new U(y, m + "enter", H, r, _), U.target = w, U.relatedTarget = Ee, L = U), Ee = L, A && H) t: {
              for (U = A, y = H, m = 0, w = U; w; w = Ur(w)) m++;
              for (w = 0, L = y; L; L = Ur(L)) w++;
              for (; 0 < m - w; ) U = Ur(U), m--;
              for (; 0 < w - m; ) y = Ur(y), w--;
              for (; m--; ) {
                if (U === y || y !== null && U === y.alternate) break t;
                U = Ur(U), y = Ur(y);
              }
              U = null;
            }
            else U = null;
            A !== null && Hs(P, E, A, U, !1), H !== null && Ee !== null && Hs(P, Ee, H, U, !0);
          }
        }
        e: {
          if (E = k ? Br(k) : window, A = E.nodeName && E.nodeName.toLowerCase(), A === "select" || A === "input" && E.type === "file") var W = pp;
          else if (ws(E)) if (bs) W = gp;
          else {
            W = mp;
            var X = fp;
          }
          else (A = E.nodeName) && A.toLowerCase() === "input" && (E.type === "checkbox" || E.type === "radio") && (W = hp);
          if (W && (W = W(e, k))) {
            ks(P, W, r, _);
            break e;
          }
          X && X(e, E, k), e === "focusout" && (X = E._wrapperState) && X.controlled && E.type === "number" && vo(E, "number", E.value);
        }
        switch (X = k ? Br(k) : window, e) {
          case "focusin":
            (ws(X) || X.contentEditable === "true") && ($r = X, Qo = k, zn = null);
            break;
          case "focusout":
            zn = Qo = $r = null;
            break;
          case "mousedown":
            Go = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Go = !1, Ms(P, r, _);
            break;
          case "selectionchange":
            if (yp) break;
          case "keydown":
          case "keyup":
            Ms(P, r, _);
        }
        var Z;
        if (Vo) e: {
          switch (e) {
            case "compositionstart":
              var J = "onCompositionStart";
              break e;
            case "compositionend":
              J = "onCompositionEnd";
              break e;
            case "compositionupdate":
              J = "onCompositionUpdate";
              break e;
          }
          J = void 0;
        }
        else Fr ? vs(e, r) && (J = "onCompositionEnd") : e === "keydown" && r.keyCode === 229 && (J = "onCompositionStart");
        J && (hs && r.locale !== "ko" && (Fr || J !== "onCompositionStart" ? J === "onCompositionEnd" && Fr && (Z = cs()) : (Yt = _, Oo = "value" in Yt ? Yt.value : Yt.textContent, Fr = !0)), X = bl(k, J), 0 < X.length && (J = new fs(J, e, null, r, _), P.push({ event: J, listeners: X }), Z ? J.data = Z : (Z = ys(r), Z !== null && (J.data = Z)))), (Z = ap ? sp(e, r) : up(e, r)) && (k = bl(k, "onBeforeInput"), 0 < k.length && (_ = new fs("onBeforeInput", "beforeinput", null, r, _), P.push({ event: _, listeners: k }), _.data = Z));
      }
      Fs(P, t);
    });
  }
  function Pn(e, t, r) {
    return { instance: e, listener: t, currentTarget: r };
  }
  function bl(e, t) {
    for (var r = t + "Capture", n = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = pn(e, r), o != null && n.unshift(Pn(e, o, l)), o = pn(e, t), o != null && n.push(Pn(e, o, l))), e = e.return;
    }
    return n;
  }
  function Ur(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Hs(e, t, r, n, l) {
    for (var o = t._reactName, s = []; r !== null && r !== n; ) {
      var d = r, p = d.alternate, k = d.stateNode;
      if (p !== null && p === n) break;
      d.tag === 5 && k !== null && (d = k, l ? (p = pn(r, o), p != null && s.unshift(Pn(r, p, d))) : l || (p = pn(r, o), p != null && s.push(Pn(r, p, d)))), r = r.return;
    }
    s.length !== 0 && e.push({ event: t, listeners: s });
  }
  var jp = /\r\n?/g, Sp = /\u0000|\uFFFD/g;
  function Us(e) {
    return (typeof e == "string" ? e : "" + e).replace(jp, `
`).replace(Sp, "");
  }
  function jl(e, t, r) {
    if (t = Us(t), Us(e) !== t && r) throw Error(u(425));
  }
  function Sl() {
  }
  var ei = null, ti = null;
  function ri(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var ni = typeof setTimeout == "function" ? setTimeout : void 0, Cp = typeof clearTimeout == "function" ? clearTimeout : void 0, Vs = typeof Promise == "function" ? Promise : void 0, Np = typeof queueMicrotask == "function" ? queueMicrotask : typeof Vs < "u" ? function(e) {
    return Vs.resolve(null).then(e).catch(Ep);
  } : ni;
  function Ep(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function li(e, t) {
    var r = t, n = 0;
    do {
      var l = r.nextSibling;
      if (e.removeChild(r), l && l.nodeType === 8) if (r = l.data, r === "/$") {
        if (n === 0) {
          e.removeChild(l), kn(t);
          return;
        }
        n--;
      } else r !== "$" && r !== "$?" && r !== "$!" || n++;
      r = l;
    } while (r);
    kn(t);
  }
  function Zt(e) {
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
  function Bs(e) {
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
  var Vr = Math.random().toString(36).slice(2), St = "__reactFiber$" + Vr, Ln = "__reactProps$" + Vr, Mt = "__reactContainer$" + Vr, oi = "__reactEvents$" + Vr, zp = "__reactListeners$" + Vr, _p = "__reactHandles$" + Vr;
  function gr(e) {
    var t = e[St];
    if (t) return t;
    for (var r = e.parentNode; r; ) {
      if (t = r[Mt] || r[St]) {
        if (r = t.alternate, t.child !== null || r !== null && r.child !== null) for (e = Bs(e); e !== null; ) {
          if (r = e[St]) return r;
          e = Bs(e);
        }
        return t;
      }
      e = r, r = e.parentNode;
    }
    return null;
  }
  function Tn(e) {
    return e = e[St] || e[Mt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Br(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(u(33));
  }
  function Cl(e) {
    return e[Ln] || null;
  }
  var ii = [], Wr = -1;
  function Jt(e) {
    return { current: e };
  }
  function ye(e) {
    0 > Wr || (e.current = ii[Wr], ii[Wr] = null, Wr--);
  }
  function ge(e, t) {
    Wr++, ii[Wr] = e.current, e.current = t;
  }
  var er = {}, Ue = Jt(er), Ge = Jt(!1), xr = er;
  function qr(e, t) {
    var r = e.type.contextTypes;
    if (!r) return er;
    var n = e.stateNode;
    if (n && n.__reactInternalMemoizedUnmaskedChildContext === t) return n.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in r) l[o] = t[o];
    return n && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ke(e) {
    return e = e.childContextTypes, e != null;
  }
  function Nl() {
    ye(Ge), ye(Ue);
  }
  function Ws(e, t, r) {
    if (Ue.current !== er) throw Error(u(168));
    ge(Ue, t), ge(Ge, r);
  }
  function qs(e, t, r) {
    var n = e.stateNode;
    if (t = t.childContextTypes, typeof n.getChildContext != "function") return r;
    n = n.getChildContext();
    for (var l in n) if (!(l in t)) throw Error(u(108, he(e) || "Unknown", l));
    return F({}, r, n);
  }
  function El(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || er, xr = Ue.current, ge(Ue, e), ge(Ge, Ge.current), !0;
  }
  function Qs(e, t, r) {
    var n = e.stateNode;
    if (!n) throw Error(u(169));
    r ? (e = qs(e, t, xr), n.__reactInternalMemoizedMergedChildContext = e, ye(Ge), ye(Ue), ge(Ue, e)) : ye(Ge), ge(Ge, r);
  }
  var Pt = null, zl = !1, ai = !1;
  function Gs(e) {
    Pt === null ? Pt = [e] : Pt.push(e);
  }
  function Mp(e) {
    zl = !0, Gs(e);
  }
  function tr() {
    if (!ai && Pt !== null) {
      ai = !0;
      var e = 0, t = fe;
      try {
        var r = Pt;
        for (fe = 1; e < r.length; e++) {
          var n = r[e];
          do
            n = n(!0);
          while (n !== null);
        }
        Pt = null, zl = !1;
      } catch (l) {
        throw Pt !== null && (Pt = Pt.slice(e + 1)), Ya(_o, tr), l;
      } finally {
        fe = t, ai = !1;
      }
    }
    return null;
  }
  var Qr = [], Gr = 0, _l = null, Ml = 0, st = [], ut = 0, vr = null, Lt = 1, Tt = "";
  function yr(e, t) {
    Qr[Gr++] = Ml, Qr[Gr++] = _l, _l = e, Ml = t;
  }
  function Ks(e, t, r) {
    st[ut++] = Lt, st[ut++] = Tt, st[ut++] = vr, vr = e;
    var n = Lt;
    e = Tt;
    var l = 32 - mt(n) - 1;
    n &= ~(1 << l), r += 1;
    var o = 32 - mt(t) + l;
    if (30 < o) {
      var s = l - l % 5;
      o = (n & (1 << s) - 1).toString(32), n >>= s, l -= s, Lt = 1 << 32 - mt(t) + l | r << l | n, Tt = o + e;
    } else Lt = 1 << o | r << l | n, Tt = e;
  }
  function si(e) {
    e.return !== null && (yr(e, 1), Ks(e, 1, 0));
  }
  function ui(e) {
    for (; e === _l; ) _l = Qr[--Gr], Qr[Gr] = null, Ml = Qr[--Gr], Qr[Gr] = null;
    for (; e === vr; ) vr = st[--ut], st[ut] = null, Tt = st[--ut], st[ut] = null, Lt = st[--ut], st[ut] = null;
  }
  var nt = null, lt = null, be = !1, gt = null;
  function Ys(e, t) {
    var r = ft(5, null, null, 0);
    r.elementType = "DELETED", r.stateNode = t, r.return = e, t = e.deletions, t === null ? (e.deletions = [r], e.flags |= 16) : t.push(r);
  }
  function Xs(e, t) {
    switch (e.tag) {
      case 5:
        var r = e.type;
        return t = t.nodeType !== 1 || r.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, nt = e, lt = Zt(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, nt = e, lt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (r = vr !== null ? { id: Lt, overflow: Tt } : null, e.memoizedState = { dehydrated: t, treeContext: r, retryLane: 1073741824 }, r = ft(18, null, null, 0), r.stateNode = t, r.return = e, e.child = r, nt = e, lt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function ci(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function di(e) {
    if (be) {
      var t = lt;
      if (t) {
        var r = t;
        if (!Xs(e, t)) {
          if (ci(e)) throw Error(u(418));
          t = Zt(r.nextSibling);
          var n = nt;
          t && Xs(e, t) ? Ys(n, r) : (e.flags = e.flags & -4097 | 2, be = !1, nt = e);
        }
      } else {
        if (ci(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, be = !1, nt = e;
      }
    }
  }
  function Zs(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    nt = e;
  }
  function Pl(e) {
    if (e !== nt) return !1;
    if (!be) return Zs(e), be = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ri(e.type, e.memoizedProps)), t && (t = lt)) {
      if (ci(e)) throw Js(), Error(u(418));
      for (; t; ) Ys(e, t), t = Zt(t.nextSibling);
    }
    if (Zs(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var r = e.data;
            if (r === "/$") {
              if (t === 0) {
                lt = Zt(e.nextSibling);
                break e;
              }
              t--;
            } else r !== "$" && r !== "$!" && r !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        lt = null;
      }
    } else lt = nt ? Zt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Js() {
    for (var e = lt; e; ) e = Zt(e.nextSibling);
  }
  function Kr() {
    lt = nt = null, be = !1;
  }
  function pi(e) {
    gt === null ? gt = [e] : gt.push(e);
  }
  var Pp = O.ReactCurrentBatchConfig;
  function Rn(e, t, r) {
    if (e = r.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (r._owner) {
        if (r = r._owner, r) {
          if (r.tag !== 1) throw Error(u(309));
          var n = r.stateNode;
        }
        if (!n) throw Error(u(147, e));
        var l = n, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(s) {
          var d = l.refs;
          s === null ? delete d[o] : d[o] = s;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(u(284));
      if (!r._owner) throw Error(u(290, e));
    }
    return e;
  }
  function Ll(e, t) {
    throw e = Object.prototype.toString.call(t), Error(u(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function eu(e) {
    var t = e._init;
    return t(e._payload);
  }
  function tu(e) {
    function t(y, m) {
      if (e) {
        var w = y.deletions;
        w === null ? (y.deletions = [m], y.flags |= 16) : w.push(m);
      }
    }
    function r(y, m) {
      if (!e) return null;
      for (; m !== null; ) t(y, m), m = m.sibling;
      return null;
    }
    function n(y, m) {
      for (y = /* @__PURE__ */ new Map(); m !== null; ) m.key !== null ? y.set(m.key, m) : y.set(m.index, m), m = m.sibling;
      return y;
    }
    function l(y, m) {
      return y = ur(y, m), y.index = 0, y.sibling = null, y;
    }
    function o(y, m, w) {
      return y.index = w, e ? (w = y.alternate, w !== null ? (w = w.index, w < m ? (y.flags |= 2, m) : w) : (y.flags |= 2, m)) : (y.flags |= 1048576, m);
    }
    function s(y) {
      return e && y.alternate === null && (y.flags |= 2), y;
    }
    function d(y, m, w, L) {
      return m === null || m.tag !== 6 ? (m = na(w, y.mode, L), m.return = y, m) : (m = l(m, w), m.return = y, m);
    }
    function p(y, m, w, L) {
      var W = w.type;
      return W === ae ? _(y, m, w.props.children, L, w.key) : m !== null && (m.elementType === W || typeof W == "object" && W !== null && W.$$typeof === Me && eu(W) === m.type) ? (L = l(m, w.props), L.ref = Rn(y, m, w), L.return = y, L) : (L = ro(w.type, w.key, w.props, null, y.mode, L), L.ref = Rn(y, m, w), L.return = y, L);
    }
    function k(y, m, w, L) {
      return m === null || m.tag !== 4 || m.stateNode.containerInfo !== w.containerInfo || m.stateNode.implementation !== w.implementation ? (m = la(w, y.mode, L), m.return = y, m) : (m = l(m, w.children || []), m.return = y, m);
    }
    function _(y, m, w, L, W) {
      return m === null || m.tag !== 7 ? (m = Er(w, y.mode, L, W), m.return = y, m) : (m = l(m, w), m.return = y, m);
    }
    function P(y, m, w) {
      if (typeof m == "string" && m !== "" || typeof m == "number") return m = na("" + m, y.mode, w), m.return = y, m;
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case ee:
            return w = ro(m.type, m.key, m.props, null, y.mode, w), w.ref = Rn(y, null, m), w.return = y, w;
          case Y:
            return m = la(m, y.mode, w), m.return = y, m;
          case Me:
            var L = m._init;
            return P(y, L(m._payload), w);
        }
        if (un(m) || K(m)) return m = Er(m, y.mode, w, null), m.return = y, m;
        Ll(y, m);
      }
      return null;
    }
    function E(y, m, w, L) {
      var W = m !== null ? m.key : null;
      if (typeof w == "string" && w !== "" || typeof w == "number") return W !== null ? null : d(y, m, "" + w, L);
      if (typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case ee:
            return w.key === W ? p(y, m, w, L) : null;
          case Y:
            return w.key === W ? k(y, m, w, L) : null;
          case Me:
            return W = w._init, E(
              y,
              m,
              W(w._payload),
              L
            );
        }
        if (un(w) || K(w)) return W !== null ? null : _(y, m, w, L, null);
        Ll(y, w);
      }
      return null;
    }
    function A(y, m, w, L, W) {
      if (typeof L == "string" && L !== "" || typeof L == "number") return y = y.get(w) || null, d(m, y, "" + L, W);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ee:
            return y = y.get(L.key === null ? w : L.key) || null, p(m, y, L, W);
          case Y:
            return y = y.get(L.key === null ? w : L.key) || null, k(m, y, L, W);
          case Me:
            var X = L._init;
            return A(y, m, w, X(L._payload), W);
        }
        if (un(L) || K(L)) return y = y.get(w) || null, _(m, y, L, W, null);
        Ll(m, L);
      }
      return null;
    }
    function H(y, m, w, L) {
      for (var W = null, X = null, Z = m, J = m = 0, De = null; Z !== null && J < w.length; J++) {
        Z.index > J ? (De = Z, Z = null) : De = Z.sibling;
        var de = E(y, Z, w[J], L);
        if (de === null) {
          Z === null && (Z = De);
          break;
        }
        e && Z && de.alternate === null && t(y, Z), m = o(de, m, J), X === null ? W = de : X.sibling = de, X = de, Z = De;
      }
      if (J === w.length) return r(y, Z), be && yr(y, J), W;
      if (Z === null) {
        for (; J < w.length; J++) Z = P(y, w[J], L), Z !== null && (m = o(Z, m, J), X === null ? W = Z : X.sibling = Z, X = Z);
        return be && yr(y, J), W;
      }
      for (Z = n(y, Z); J < w.length; J++) De = A(Z, y, J, w[J], L), De !== null && (e && De.alternate !== null && Z.delete(De.key === null ? J : De.key), m = o(De, m, J), X === null ? W = De : X.sibling = De, X = De);
      return e && Z.forEach(function(cr) {
        return t(y, cr);
      }), be && yr(y, J), W;
    }
    function U(y, m, w, L) {
      var W = K(w);
      if (typeof W != "function") throw Error(u(150));
      if (w = W.call(w), w == null) throw Error(u(151));
      for (var X = W = null, Z = m, J = m = 0, De = null, de = w.next(); Z !== null && !de.done; J++, de = w.next()) {
        Z.index > J ? (De = Z, Z = null) : De = Z.sibling;
        var cr = E(y, Z, de.value, L);
        if (cr === null) {
          Z === null && (Z = De);
          break;
        }
        e && Z && cr.alternate === null && t(y, Z), m = o(cr, m, J), X === null ? W = cr : X.sibling = cr, X = cr, Z = De;
      }
      if (de.done) return r(
        y,
        Z
      ), be && yr(y, J), W;
      if (Z === null) {
        for (; !de.done; J++, de = w.next()) de = P(y, de.value, L), de !== null && (m = o(de, m, J), X === null ? W = de : X.sibling = de, X = de);
        return be && yr(y, J), W;
      }
      for (Z = n(y, Z); !de.done; J++, de = w.next()) de = A(Z, y, J, de.value, L), de !== null && (e && de.alternate !== null && Z.delete(de.key === null ? J : de.key), m = o(de, m, J), X === null ? W = de : X.sibling = de, X = de);
      return e && Z.forEach(function(df) {
        return t(y, df);
      }), be && yr(y, J), W;
    }
    function Ee(y, m, w, L) {
      if (typeof w == "object" && w !== null && w.type === ae && w.key === null && (w = w.props.children), typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case ee:
            e: {
              for (var W = w.key, X = m; X !== null; ) {
                if (X.key === W) {
                  if (W = w.type, W === ae) {
                    if (X.tag === 7) {
                      r(y, X.sibling), m = l(X, w.props.children), m.return = y, y = m;
                      break e;
                    }
                  } else if (X.elementType === W || typeof W == "object" && W !== null && W.$$typeof === Me && eu(W) === X.type) {
                    r(y, X.sibling), m = l(X, w.props), m.ref = Rn(y, X, w), m.return = y, y = m;
                    break e;
                  }
                  r(y, X);
                  break;
                } else t(y, X);
                X = X.sibling;
              }
              w.type === ae ? (m = Er(w.props.children, y.mode, L, w.key), m.return = y, y = m) : (L = ro(w.type, w.key, w.props, null, y.mode, L), L.ref = Rn(y, m, w), L.return = y, y = L);
            }
            return s(y);
          case Y:
            e: {
              for (X = w.key; m !== null; ) {
                if (m.key === X) if (m.tag === 4 && m.stateNode.containerInfo === w.containerInfo && m.stateNode.implementation === w.implementation) {
                  r(y, m.sibling), m = l(m, w.children || []), m.return = y, y = m;
                  break e;
                } else {
                  r(y, m);
                  break;
                }
                else t(y, m);
                m = m.sibling;
              }
              m = la(w, y.mode, L), m.return = y, y = m;
            }
            return s(y);
          case Me:
            return X = w._init, Ee(y, m, X(w._payload), L);
        }
        if (un(w)) return H(y, m, w, L);
        if (K(w)) return U(y, m, w, L);
        Ll(y, w);
      }
      return typeof w == "string" && w !== "" || typeof w == "number" ? (w = "" + w, m !== null && m.tag === 6 ? (r(y, m.sibling), m = l(m, w), m.return = y, y = m) : (r(y, m), m = na(w, y.mode, L), m.return = y, y = m), s(y)) : r(y, m);
    }
    return Ee;
  }
  var Yr = tu(!0), ru = tu(!1), Tl = Jt(null), Rl = null, Xr = null, fi = null;
  function mi() {
    fi = Xr = Rl = null;
  }
  function hi(e) {
    var t = Tl.current;
    ye(Tl), e._currentValue = t;
  }
  function gi(e, t, r) {
    for (; e !== null; ) {
      var n = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, n !== null && (n.childLanes |= t)) : n !== null && (n.childLanes & t) !== t && (n.childLanes |= t), e === r) break;
      e = e.return;
    }
  }
  function Zr(e, t) {
    Rl = e, fi = Xr = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ye = !0), e.firstContext = null);
  }
  function ct(e) {
    var t = e._currentValue;
    if (fi !== e) if (e = { context: e, memoizedValue: t, next: null }, Xr === null) {
      if (Rl === null) throw Error(u(308));
      Xr = e, Rl.dependencies = { lanes: 0, firstContext: e };
    } else Xr = Xr.next = e;
    return t;
  }
  var wr = null;
  function xi(e) {
    wr === null ? wr = [e] : wr.push(e);
  }
  function nu(e, t, r, n) {
    var l = t.interleaved;
    return l === null ? (r.next = r, xi(t)) : (r.next = l.next, l.next = r), t.interleaved = r, Rt(e, n);
  }
  function Rt(e, t) {
    e.lanes |= t;
    var r = e.alternate;
    for (r !== null && (r.lanes |= t), r = e, e = e.return; e !== null; ) e.childLanes |= t, r = e.alternate, r !== null && (r.childLanes |= t), r = e, e = e.return;
    return r.tag === 3 ? r.stateNode : null;
  }
  var rr = !1;
  function vi(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function lu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Dt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function nr(e, t, r) {
    var n = e.updateQueue;
    if (n === null) return null;
    if (n = n.shared, (se & 2) !== 0) {
      var l = n.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), n.pending = t, Rt(e, r);
    }
    return l = n.interleaved, l === null ? (t.next = t, xi(n)) : (t.next = l.next, l.next = t), n.interleaved = t, Rt(e, r);
  }
  function Dl(e, t, r) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (r & 4194240) !== 0)) {
      var n = t.lanes;
      n &= e.pendingLanes, r |= n, t.lanes = r, Lo(e, r);
    }
  }
  function ou(e, t) {
    var r = e.updateQueue, n = e.alternate;
    if (n !== null && (n = n.updateQueue, r === n)) {
      var l = null, o = null;
      if (r = r.firstBaseUpdate, r !== null) {
        do {
          var s = { eventTime: r.eventTime, lane: r.lane, tag: r.tag, payload: r.payload, callback: r.callback, next: null };
          o === null ? l = o = s : o = o.next = s, r = r.next;
        } while (r !== null);
        o === null ? l = o = t : o = o.next = t;
      } else l = o = t;
      r = { baseState: n.baseState, firstBaseUpdate: l, lastBaseUpdate: o, shared: n.shared, effects: n.effects }, e.updateQueue = r;
      return;
    }
    e = r.lastBaseUpdate, e === null ? r.firstBaseUpdate = t : e.next = t, r.lastBaseUpdate = t;
  }
  function Il(e, t, r, n) {
    var l = e.updateQueue;
    rr = !1;
    var o = l.firstBaseUpdate, s = l.lastBaseUpdate, d = l.shared.pending;
    if (d !== null) {
      l.shared.pending = null;
      var p = d, k = p.next;
      p.next = null, s === null ? o = k : s.next = k, s = p;
      var _ = e.alternate;
      _ !== null && (_ = _.updateQueue, d = _.lastBaseUpdate, d !== s && (d === null ? _.firstBaseUpdate = k : d.next = k, _.lastBaseUpdate = p));
    }
    if (o !== null) {
      var P = l.baseState;
      s = 0, _ = k = p = null, d = o;
      do {
        var E = d.lane, A = d.eventTime;
        if ((n & E) === E) {
          _ !== null && (_ = _.next = {
            eventTime: A,
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          });
          e: {
            var H = e, U = d;
            switch (E = t, A = r, U.tag) {
              case 1:
                if (H = U.payload, typeof H == "function") {
                  P = H.call(A, P, E);
                  break e;
                }
                P = H;
                break e;
              case 3:
                H.flags = H.flags & -65537 | 128;
              case 0:
                if (H = U.payload, E = typeof H == "function" ? H.call(A, P, E) : H, E == null) break e;
                P = F({}, P, E);
                break e;
              case 2:
                rr = !0;
            }
          }
          d.callback !== null && d.lane !== 0 && (e.flags |= 64, E = l.effects, E === null ? l.effects = [d] : E.push(d));
        } else A = { eventTime: A, lane: E, tag: d.tag, payload: d.payload, callback: d.callback, next: null }, _ === null ? (k = _ = A, p = P) : _ = _.next = A, s |= E;
        if (d = d.next, d === null) {
          if (d = l.shared.pending, d === null) break;
          E = d, d = E.next, E.next = null, l.lastBaseUpdate = E, l.shared.pending = null;
        }
      } while (!0);
      if (_ === null && (p = P), l.baseState = p, l.firstBaseUpdate = k, l.lastBaseUpdate = _, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          s |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      jr |= s, e.lanes = s, e.memoizedState = P;
    }
  }
  function iu(e, t, r) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var n = e[t], l = n.callback;
      if (l !== null) {
        if (n.callback = null, n = r, typeof l != "function") throw Error(u(191, l));
        l.call(n);
      }
    }
  }
  var Dn = {}, Ct = Jt(Dn), In = Jt(Dn), On = Jt(Dn);
  function kr(e) {
    if (e === Dn) throw Error(u(174));
    return e;
  }
  function yi(e, t) {
    switch (ge(On, t), ge(In, e), ge(Ct, Dn), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : wo(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = wo(t, e);
    }
    ye(Ct), ge(Ct, t);
  }
  function Jr() {
    ye(Ct), ye(In), ye(On);
  }
  function au(e) {
    kr(On.current);
    var t = kr(Ct.current), r = wo(t, e.type);
    t !== r && (ge(In, e), ge(Ct, r));
  }
  function wi(e) {
    In.current === e && (ye(Ct), ye(In));
  }
  var je = Jt(0);
  function Ol(e) {
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
  var ki = [];
  function bi() {
    for (var e = 0; e < ki.length; e++) ki[e]._workInProgressVersionPrimary = null;
    ki.length = 0;
  }
  var Al = O.ReactCurrentDispatcher, ji = O.ReactCurrentBatchConfig, br = 0, Se = null, Pe = null, Te = null, Fl = !1, An = !1, Fn = 0, Lp = 0;
  function Ve() {
    throw Error(u(321));
  }
  function Si(e, t) {
    if (t === null) return !1;
    for (var r = 0; r < t.length && r < e.length; r++) if (!ht(e[r], t[r])) return !1;
    return !0;
  }
  function Ci(e, t, r, n, l, o) {
    if (br = o, Se = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Al.current = e === null || e.memoizedState === null ? Ip : Op, e = r(n, l), An) {
      o = 0;
      do {
        if (An = !1, Fn = 0, 25 <= o) throw Error(u(301));
        o += 1, Te = Pe = null, t.updateQueue = null, Al.current = Ap, e = r(n, l);
      } while (An);
    }
    if (Al.current = Ul, t = Pe !== null && Pe.next !== null, br = 0, Te = Pe = Se = null, Fl = !1, t) throw Error(u(300));
    return e;
  }
  function Ni() {
    var e = Fn !== 0;
    return Fn = 0, e;
  }
  function Nt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Te === null ? Se.memoizedState = Te = e : Te = Te.next = e, Te;
  }
  function dt() {
    if (Pe === null) {
      var e = Se.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Pe.next;
    var t = Te === null ? Se.memoizedState : Te.next;
    if (t !== null) Te = t, Pe = e;
    else {
      if (e === null) throw Error(u(310));
      Pe = e, e = { memoizedState: Pe.memoizedState, baseState: Pe.baseState, baseQueue: Pe.baseQueue, queue: Pe.queue, next: null }, Te === null ? Se.memoizedState = Te = e : Te = Te.next = e;
    }
    return Te;
  }
  function $n(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Ei(e) {
    var t = dt(), r = t.queue;
    if (r === null) throw Error(u(311));
    r.lastRenderedReducer = e;
    var n = Pe, l = n.baseQueue, o = r.pending;
    if (o !== null) {
      if (l !== null) {
        var s = l.next;
        l.next = o.next, o.next = s;
      }
      n.baseQueue = l = o, r.pending = null;
    }
    if (l !== null) {
      o = l.next, n = n.baseState;
      var d = s = null, p = null, k = o;
      do {
        var _ = k.lane;
        if ((br & _) === _) p !== null && (p = p.next = { lane: 0, action: k.action, hasEagerState: k.hasEagerState, eagerState: k.eagerState, next: null }), n = k.hasEagerState ? k.eagerState : e(n, k.action);
        else {
          var P = {
            lane: _,
            action: k.action,
            hasEagerState: k.hasEagerState,
            eagerState: k.eagerState,
            next: null
          };
          p === null ? (d = p = P, s = n) : p = p.next = P, Se.lanes |= _, jr |= _;
        }
        k = k.next;
      } while (k !== null && k !== o);
      p === null ? s = n : p.next = d, ht(n, t.memoizedState) || (Ye = !0), t.memoizedState = n, t.baseState = s, t.baseQueue = p, r.lastRenderedState = n;
    }
    if (e = r.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, Se.lanes |= o, jr |= o, l = l.next;
      while (l !== e);
    } else l === null && (r.lanes = 0);
    return [t.memoizedState, r.dispatch];
  }
  function zi(e) {
    var t = dt(), r = t.queue;
    if (r === null) throw Error(u(311));
    r.lastRenderedReducer = e;
    var n = r.dispatch, l = r.pending, o = t.memoizedState;
    if (l !== null) {
      r.pending = null;
      var s = l = l.next;
      do
        o = e(o, s.action), s = s.next;
      while (s !== l);
      ht(o, t.memoizedState) || (Ye = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), r.lastRenderedState = o;
    }
    return [o, n];
  }
  function su() {
  }
  function uu(e, t) {
    var r = Se, n = dt(), l = t(), o = !ht(n.memoizedState, l);
    if (o && (n.memoizedState = l, Ye = !0), n = n.queue, _i(pu.bind(null, r, n, e), [e]), n.getSnapshot !== t || o || Te !== null && Te.memoizedState.tag & 1) {
      if (r.flags |= 2048, Hn(9, du.bind(null, r, n, l, t), void 0, null), Re === null) throw Error(u(349));
      (br & 30) !== 0 || cu(r, t, l);
    }
    return l;
  }
  function cu(e, t, r) {
    e.flags |= 16384, e = { getSnapshot: t, value: r }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.stores = [e]) : (r = t.stores, r === null ? t.stores = [e] : r.push(e));
  }
  function du(e, t, r, n) {
    t.value = r, t.getSnapshot = n, fu(t) && mu(e);
  }
  function pu(e, t, r) {
    return r(function() {
      fu(t) && mu(e);
    });
  }
  function fu(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var r = t();
      return !ht(e, r);
    } catch {
      return !0;
    }
  }
  function mu(e) {
    var t = Rt(e, 1);
    t !== null && wt(t, e, 1, -1);
  }
  function hu(e) {
    var t = Nt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: $n, lastRenderedState: e }, t.queue = e, e = e.dispatch = Dp.bind(null, Se, e), [t.memoizedState, e];
  }
  function Hn(e, t, r, n) {
    return e = { tag: e, create: t, destroy: r, deps: n, next: null }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.lastEffect = e.next = e) : (r = t.lastEffect, r === null ? t.lastEffect = e.next = e : (n = r.next, r.next = e, e.next = n, t.lastEffect = e)), e;
  }
  function gu() {
    return dt().memoizedState;
  }
  function $l(e, t, r, n) {
    var l = Nt();
    Se.flags |= e, l.memoizedState = Hn(1 | t, r, void 0, n === void 0 ? null : n);
  }
  function Hl(e, t, r, n) {
    var l = dt();
    n = n === void 0 ? null : n;
    var o = void 0;
    if (Pe !== null) {
      var s = Pe.memoizedState;
      if (o = s.destroy, n !== null && Si(n, s.deps)) {
        l.memoizedState = Hn(t, r, o, n);
        return;
      }
    }
    Se.flags |= e, l.memoizedState = Hn(1 | t, r, o, n);
  }
  function xu(e, t) {
    return $l(8390656, 8, e, t);
  }
  function _i(e, t) {
    return Hl(2048, 8, e, t);
  }
  function vu(e, t) {
    return Hl(4, 2, e, t);
  }
  function yu(e, t) {
    return Hl(4, 4, e, t);
  }
  function wu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function ku(e, t, r) {
    return r = r != null ? r.concat([e]) : null, Hl(4, 4, wu.bind(null, t, e), r);
  }
  function Mi() {
  }
  function bu(e, t) {
    var r = dt();
    t = t === void 0 ? null : t;
    var n = r.memoizedState;
    return n !== null && t !== null && Si(t, n[1]) ? n[0] : (r.memoizedState = [e, t], e);
  }
  function ju(e, t) {
    var r = dt();
    t = t === void 0 ? null : t;
    var n = r.memoizedState;
    return n !== null && t !== null && Si(t, n[1]) ? n[0] : (e = e(), r.memoizedState = [e, t], e);
  }
  function Su(e, t, r) {
    return (br & 21) === 0 ? (e.baseState && (e.baseState = !1, Ye = !0), e.memoizedState = r) : (ht(r, t) || (r = es(), Se.lanes |= r, jr |= r, e.baseState = !0), t);
  }
  function Tp(e, t) {
    var r = fe;
    fe = r !== 0 && 4 > r ? r : 4, e(!0);
    var n = ji.transition;
    ji.transition = {};
    try {
      e(!1), t();
    } finally {
      fe = r, ji.transition = n;
    }
  }
  function Cu() {
    return dt().memoizedState;
  }
  function Rp(e, t, r) {
    var n = ar(e);
    if (r = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null }, Nu(e)) Eu(t, r);
    else if (r = nu(e, t, r, n), r !== null) {
      var l = Qe();
      wt(r, e, n, l), zu(r, t, n);
    }
  }
  function Dp(e, t, r) {
    var n = ar(e), l = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null };
    if (Nu(e)) Eu(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var s = t.lastRenderedState, d = o(s, r);
        if (l.hasEagerState = !0, l.eagerState = d, ht(d, s)) {
          var p = t.interleaved;
          p === null ? (l.next = l, xi(t)) : (l.next = p.next, p.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      r = nu(e, t, l, n), r !== null && (l = Qe(), wt(r, e, n, l), zu(r, t, n));
    }
  }
  function Nu(e) {
    var t = e.alternate;
    return e === Se || t !== null && t === Se;
  }
  function Eu(e, t) {
    An = Fl = !0;
    var r = e.pending;
    r === null ? t.next = t : (t.next = r.next, r.next = t), e.pending = t;
  }
  function zu(e, t, r) {
    if ((r & 4194240) !== 0) {
      var n = t.lanes;
      n &= e.pendingLanes, r |= n, t.lanes = r, Lo(e, r);
    }
  }
  var Ul = { readContext: ct, useCallback: Ve, useContext: Ve, useEffect: Ve, useImperativeHandle: Ve, useInsertionEffect: Ve, useLayoutEffect: Ve, useMemo: Ve, useReducer: Ve, useRef: Ve, useState: Ve, useDebugValue: Ve, useDeferredValue: Ve, useTransition: Ve, useMutableSource: Ve, useSyncExternalStore: Ve, useId: Ve, unstable_isNewReconciler: !1 }, Ip = { readContext: ct, useCallback: function(e, t) {
    return Nt().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: ct, useEffect: xu, useImperativeHandle: function(e, t, r) {
    return r = r != null ? r.concat([e]) : null, $l(
      4194308,
      4,
      wu.bind(null, t, e),
      r
    );
  }, useLayoutEffect: function(e, t) {
    return $l(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return $l(4, 2, e, t);
  }, useMemo: function(e, t) {
    var r = Nt();
    return t = t === void 0 ? null : t, e = e(), r.memoizedState = [e, t], e;
  }, useReducer: function(e, t, r) {
    var n = Nt();
    return t = r !== void 0 ? r(t) : t, n.memoizedState = n.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, n.queue = e, e = e.dispatch = Rp.bind(null, Se, e), [n.memoizedState, e];
  }, useRef: function(e) {
    var t = Nt();
    return e = { current: e }, t.memoizedState = e;
  }, useState: hu, useDebugValue: Mi, useDeferredValue: function(e) {
    return Nt().memoizedState = e;
  }, useTransition: function() {
    var e = hu(!1), t = e[0];
    return e = Tp.bind(null, e[1]), Nt().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, r) {
    var n = Se, l = Nt();
    if (be) {
      if (r === void 0) throw Error(u(407));
      r = r();
    } else {
      if (r = t(), Re === null) throw Error(u(349));
      (br & 30) !== 0 || cu(n, t, r);
    }
    l.memoizedState = r;
    var o = { value: r, getSnapshot: t };
    return l.queue = o, xu(pu.bind(
      null,
      n,
      o,
      e
    ), [e]), n.flags |= 2048, Hn(9, du.bind(null, n, o, r, t), void 0, null), r;
  }, useId: function() {
    var e = Nt(), t = Re.identifierPrefix;
    if (be) {
      var r = Tt, n = Lt;
      r = (n & ~(1 << 32 - mt(n) - 1)).toString(32) + r, t = ":" + t + "R" + r, r = Fn++, 0 < r && (t += "H" + r.toString(32)), t += ":";
    } else r = Lp++, t = ":" + t + "r" + r.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Op = {
    readContext: ct,
    useCallback: bu,
    useContext: ct,
    useEffect: _i,
    useImperativeHandle: ku,
    useInsertionEffect: vu,
    useLayoutEffect: yu,
    useMemo: ju,
    useReducer: Ei,
    useRef: gu,
    useState: function() {
      return Ei($n);
    },
    useDebugValue: Mi,
    useDeferredValue: function(e) {
      var t = dt();
      return Su(t, Pe.memoizedState, e);
    },
    useTransition: function() {
      var e = Ei($n)[0], t = dt().memoizedState;
      return [e, t];
    },
    useMutableSource: su,
    useSyncExternalStore: uu,
    useId: Cu,
    unstable_isNewReconciler: !1
  }, Ap = { readContext: ct, useCallback: bu, useContext: ct, useEffect: _i, useImperativeHandle: ku, useInsertionEffect: vu, useLayoutEffect: yu, useMemo: ju, useReducer: zi, useRef: gu, useState: function() {
    return zi($n);
  }, useDebugValue: Mi, useDeferredValue: function(e) {
    var t = dt();
    return Pe === null ? t.memoizedState = e : Su(t, Pe.memoizedState, e);
  }, useTransition: function() {
    var e = zi($n)[0], t = dt().memoizedState;
    return [e, t];
  }, useMutableSource: su, useSyncExternalStore: uu, useId: Cu, unstable_isNewReconciler: !1 };
  function xt(e, t) {
    if (e && e.defaultProps) {
      t = F({}, t), e = e.defaultProps;
      for (var r in e) t[r] === void 0 && (t[r] = e[r]);
      return t;
    }
    return t;
  }
  function Pi(e, t, r, n) {
    t = e.memoizedState, r = r(n, t), r = r == null ? t : F({}, t, r), e.memoizedState = r, e.lanes === 0 && (e.updateQueue.baseState = r);
  }
  var Vl = { isMounted: function(e) {
    return (e = e._reactInternals) ? hr(e) === e : !1;
  }, enqueueSetState: function(e, t, r) {
    e = e._reactInternals;
    var n = Qe(), l = ar(e), o = Dt(n, l);
    o.payload = t, r != null && (o.callback = r), t = nr(e, o, l), t !== null && (wt(t, e, l, n), Dl(t, e, l));
  }, enqueueReplaceState: function(e, t, r) {
    e = e._reactInternals;
    var n = Qe(), l = ar(e), o = Dt(n, l);
    o.tag = 1, o.payload = t, r != null && (o.callback = r), t = nr(e, o, l), t !== null && (wt(t, e, l, n), Dl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var r = Qe(), n = ar(e), l = Dt(r, n);
    l.tag = 2, t != null && (l.callback = t), t = nr(e, l, n), t !== null && (wt(t, e, n, r), Dl(t, e, n));
  } };
  function _u(e, t, r, n, l, o, s) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(n, o, s) : t.prototype && t.prototype.isPureReactComponent ? !En(r, n) || !En(l, o) : !0;
  }
  function Mu(e, t, r) {
    var n = !1, l = er, o = t.contextType;
    return typeof o == "object" && o !== null ? o = ct(o) : (l = Ke(t) ? xr : Ue.current, n = t.contextTypes, o = (n = n != null) ? qr(e, l) : er), t = new t(r, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Vl, e.stateNode = t, t._reactInternals = e, n && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function Pu(e, t, r, n) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(r, n), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(r, n), t.state !== e && Vl.enqueueReplaceState(t, t.state, null);
  }
  function Li(e, t, r, n) {
    var l = e.stateNode;
    l.props = r, l.state = e.memoizedState, l.refs = {}, vi(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = ct(o) : (o = Ke(t) ? xr : Ue.current, l.context = qr(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (Pi(e, t, o, r), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Vl.enqueueReplaceState(l, l.state, null), Il(e, r, l, n), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function en(e, t) {
    try {
      var r = "", n = t;
      do
        r += ue(n), n = n.return;
      while (n);
      var l = r;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function Ti(e, t, r) {
    return { value: e, source: null, stack: r ?? null, digest: t ?? null };
  }
  function Ri(e, t) {
    try {
      console.error(t.value);
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  var Fp = typeof WeakMap == "function" ? WeakMap : Map;
  function Lu(e, t, r) {
    r = Dt(-1, r), r.tag = 3, r.payload = { element: null };
    var n = t.value;
    return r.callback = function() {
      Yl || (Yl = !0, Ki = n), Ri(e, t);
    }, r;
  }
  function Tu(e, t, r) {
    r = Dt(-1, r), r.tag = 3;
    var n = e.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var l = t.value;
      r.payload = function() {
        return n(l);
      }, r.callback = function() {
        Ri(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (r.callback = function() {
      Ri(e, t), typeof n != "function" && (or === null ? or = /* @__PURE__ */ new Set([this]) : or.add(this));
      var s = t.stack;
      this.componentDidCatch(t.value, { componentStack: s !== null ? s : "" });
    }), r;
  }
  function Ru(e, t, r) {
    var n = e.pingCache;
    if (n === null) {
      n = e.pingCache = new Fp();
      var l = /* @__PURE__ */ new Set();
      n.set(t, l);
    } else l = n.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), n.set(t, l));
    l.has(r) || (l.add(r), e = Jp.bind(null, e, t, r), t.then(e, e));
  }
  function Du(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Iu(e, t, r, n, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, r.flags |= 131072, r.flags &= -52805, r.tag === 1 && (r.alternate === null ? r.tag = 17 : (t = Dt(-1, 1), t.tag = 2, nr(r, t, 1))), r.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var $p = O.ReactCurrentOwner, Ye = !1;
  function qe(e, t, r, n) {
    t.child = e === null ? ru(t, null, r, n) : Yr(t, e.child, r, n);
  }
  function Ou(e, t, r, n, l) {
    r = r.render;
    var o = t.ref;
    return Zr(t, l), n = Ci(e, t, r, n, o, l), r = Ni(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, It(e, t, l)) : (be && r && si(t), t.flags |= 1, qe(e, t, n, l), t.child);
  }
  function Au(e, t, r, n, l) {
    if (e === null) {
      var o = r.type;
      return typeof o == "function" && !ra(o) && o.defaultProps === void 0 && r.compare === null && r.defaultProps === void 0 ? (t.tag = 15, t.type = o, Fu(e, t, o, n, l)) : (e = ro(r.type, null, n, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var s = o.memoizedProps;
      if (r = r.compare, r = r !== null ? r : En, r(s, n) && e.ref === t.ref) return It(e, t, l);
    }
    return t.flags |= 1, e = ur(o, n), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Fu(e, t, r, n, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (En(o, n) && e.ref === t.ref) if (Ye = !1, t.pendingProps = n = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ye = !0);
      else return t.lanes = e.lanes, It(e, t, l);
    }
    return Di(e, t, r, n, l);
  }
  function $u(e, t, r) {
    var n = t.pendingProps, l = n.children, o = e !== null ? e.memoizedState : null;
    if (n.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, ge(rn, ot), ot |= r;
    else {
      if ((r & 1073741824) === 0) return e = o !== null ? o.baseLanes | r : r, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, ge(rn, ot), ot |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, n = o !== null ? o.baseLanes : r, ge(rn, ot), ot |= n;
    }
    else o !== null ? (n = o.baseLanes | r, t.memoizedState = null) : n = r, ge(rn, ot), ot |= n;
    return qe(e, t, l, r), t.child;
  }
  function Hu(e, t) {
    var r = t.ref;
    (e === null && r !== null || e !== null && e.ref !== r) && (t.flags |= 512, t.flags |= 2097152);
  }
  function Di(e, t, r, n, l) {
    var o = Ke(r) ? xr : Ue.current;
    return o = qr(t, o), Zr(t, l), r = Ci(e, t, r, n, o, l), n = Ni(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, It(e, t, l)) : (be && n && si(t), t.flags |= 1, qe(e, t, r, l), t.child);
  }
  function Uu(e, t, r, n, l) {
    if (Ke(r)) {
      var o = !0;
      El(t);
    } else o = !1;
    if (Zr(t, l), t.stateNode === null) Wl(e, t), Mu(t, r, n), Li(t, r, n, l), n = !0;
    else if (e === null) {
      var s = t.stateNode, d = t.memoizedProps;
      s.props = d;
      var p = s.context, k = r.contextType;
      typeof k == "object" && k !== null ? k = ct(k) : (k = Ke(r) ? xr : Ue.current, k = qr(t, k));
      var _ = r.getDerivedStateFromProps, P = typeof _ == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      P || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (d !== n || p !== k) && Pu(t, s, n, k), rr = !1;
      var E = t.memoizedState;
      s.state = E, Il(t, n, s, l), p = t.memoizedState, d !== n || E !== p || Ge.current || rr ? (typeof _ == "function" && (Pi(t, r, _, n), p = t.memoizedState), (d = rr || _u(t, r, d, n, E, p, k)) ? (P || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = n, t.memoizedState = p), s.props = n, s.state = p, s.context = k, n = d) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), n = !1);
    } else {
      s = t.stateNode, lu(e, t), d = t.memoizedProps, k = t.type === t.elementType ? d : xt(t.type, d), s.props = k, P = t.pendingProps, E = s.context, p = r.contextType, typeof p == "object" && p !== null ? p = ct(p) : (p = Ke(r) ? xr : Ue.current, p = qr(t, p));
      var A = r.getDerivedStateFromProps;
      (_ = typeof A == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (d !== P || E !== p) && Pu(t, s, n, p), rr = !1, E = t.memoizedState, s.state = E, Il(t, n, s, l);
      var H = t.memoizedState;
      d !== P || E !== H || Ge.current || rr ? (typeof A == "function" && (Pi(t, r, A, n), H = t.memoizedState), (k = rr || _u(t, r, k, n, E, H, p) || !1) ? (_ || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(n, H, p), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(n, H, p)), typeof s.componentDidUpdate == "function" && (t.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 1024), t.memoizedProps = n, t.memoizedState = H), s.props = n, s.state = H, s.context = p, n = k) : (typeof s.componentDidUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 1024), n = !1);
    }
    return Ii(e, t, r, n, o, l);
  }
  function Ii(e, t, r, n, l, o) {
    Hu(e, t);
    var s = (t.flags & 128) !== 0;
    if (!n && !s) return l && Qs(t, r, !1), It(e, t, o);
    n = t.stateNode, $p.current = t;
    var d = s && typeof r.getDerivedStateFromError != "function" ? null : n.render();
    return t.flags |= 1, e !== null && s ? (t.child = Yr(t, e.child, null, o), t.child = Yr(t, null, d, o)) : qe(e, t, d, o), t.memoizedState = n.state, l && Qs(t, r, !0), t.child;
  }
  function Vu(e) {
    var t = e.stateNode;
    t.pendingContext ? Ws(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Ws(e, t.context, !1), yi(e, t.containerInfo);
  }
  function Bu(e, t, r, n, l) {
    return Kr(), pi(l), t.flags |= 256, qe(e, t, r, n), t.child;
  }
  var Oi = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Ai(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Wu(e, t, r) {
    var n = t.pendingProps, l = je.current, o = !1, s = (t.flags & 128) !== 0, d;
    if ((d = s) || (d = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), d ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), ge(je, l & 1), e === null)
      return di(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (s = n.children, e = n.fallback, o ? (n = t.mode, o = t.child, s = { mode: "hidden", children: s }, (n & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = s) : o = no(s, n, 0, null), e = Er(e, n, r, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = Ai(r), t.memoizedState = Oi, e) : Fi(t, s));
    if (l = e.memoizedState, l !== null && (d = l.dehydrated, d !== null)) return Hp(e, t, s, n, d, l, r);
    if (o) {
      o = n.fallback, s = t.mode, l = e.child, d = l.sibling;
      var p = { mode: "hidden", children: n.children };
      return (s & 1) === 0 && t.child !== l ? (n = t.child, n.childLanes = 0, n.pendingProps = p, t.deletions = null) : (n = ur(l, p), n.subtreeFlags = l.subtreeFlags & 14680064), d !== null ? o = ur(d, o) : (o = Er(o, s, r, null), o.flags |= 2), o.return = t, n.return = t, n.sibling = o, t.child = n, n = o, o = t.child, s = e.child.memoizedState, s = s === null ? Ai(r) : { baseLanes: s.baseLanes | r, cachePool: null, transitions: s.transitions }, o.memoizedState = s, o.childLanes = e.childLanes & ~r, t.memoizedState = Oi, n;
    }
    return o = e.child, e = o.sibling, n = ur(o, { mode: "visible", children: n.children }), (t.mode & 1) === 0 && (n.lanes = r), n.return = t, n.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = n, t.memoizedState = null, n;
  }
  function Fi(e, t) {
    return t = no({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Bl(e, t, r, n) {
    return n !== null && pi(n), Yr(t, e.child, null, r), e = Fi(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Hp(e, t, r, n, l, o, s) {
    if (r)
      return t.flags & 256 ? (t.flags &= -257, n = Ti(Error(u(422))), Bl(e, t, s, n)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = n.fallback, l = t.mode, n = no({ mode: "visible", children: n.children }, l, 0, null), o = Er(o, l, s, null), o.flags |= 2, n.return = t, o.return = t, n.sibling = o, t.child = n, (t.mode & 1) !== 0 && Yr(t, e.child, null, s), t.child.memoizedState = Ai(s), t.memoizedState = Oi, o);
    if ((t.mode & 1) === 0) return Bl(e, t, s, null);
    if (l.data === "$!") {
      if (n = l.nextSibling && l.nextSibling.dataset, n) var d = n.dgst;
      return n = d, o = Error(u(419)), n = Ti(o, n, void 0), Bl(e, t, s, n);
    }
    if (d = (s & e.childLanes) !== 0, Ye || d) {
      if (n = Re, n !== null) {
        switch (s & -s) {
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
        l = (l & (n.suspendedLanes | s)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Rt(e, l), wt(n, e, l, -1));
      }
      return ta(), n = Ti(Error(u(421))), Bl(e, t, s, n);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = ef.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, lt = Zt(l.nextSibling), nt = t, be = !0, gt = null, e !== null && (st[ut++] = Lt, st[ut++] = Tt, st[ut++] = vr, Lt = e.id, Tt = e.overflow, vr = t), t = Fi(t, n.children), t.flags |= 4096, t);
  }
  function qu(e, t, r) {
    e.lanes |= t;
    var n = e.alternate;
    n !== null && (n.lanes |= t), gi(e.return, t, r);
  }
  function $i(e, t, r, n, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: n, tail: r, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = n, o.tail = r, o.tailMode = l);
  }
  function Qu(e, t, r) {
    var n = t.pendingProps, l = n.revealOrder, o = n.tail;
    if (qe(e, t, n.children, r), n = je.current, (n & 2) !== 0) n = n & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && qu(e, r, t);
        else if (e.tag === 19) qu(e, r, t);
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
    if (ge(je, n), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (r = t.child, l = null; r !== null; ) e = r.alternate, e !== null && Ol(e) === null && (l = r), r = r.sibling;
        r = l, r === null ? (l = t.child, t.child = null) : (l = r.sibling, r.sibling = null), $i(t, !1, l, r, o);
        break;
      case "backwards":
        for (r = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Ol(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = r, r = l, l = e;
        }
        $i(t, !0, r, null, o);
        break;
      case "together":
        $i(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Wl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function It(e, t, r) {
    if (e !== null && (t.dependencies = e.dependencies), jr |= t.lanes, (r & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, r = ur(e, e.pendingProps), t.child = r, r.return = t; e.sibling !== null; ) e = e.sibling, r = r.sibling = ur(e, e.pendingProps), r.return = t;
      r.sibling = null;
    }
    return t.child;
  }
  function Up(e, t, r) {
    switch (t.tag) {
      case 3:
        Vu(t), Kr();
        break;
      case 5:
        au(t);
        break;
      case 1:
        Ke(t.type) && El(t);
        break;
      case 4:
        yi(t, t.stateNode.containerInfo);
        break;
      case 10:
        var n = t.type._context, l = t.memoizedProps.value;
        ge(Tl, n._currentValue), n._currentValue = l;
        break;
      case 13:
        if (n = t.memoizedState, n !== null)
          return n.dehydrated !== null ? (ge(je, je.current & 1), t.flags |= 128, null) : (r & t.child.childLanes) !== 0 ? Wu(e, t, r) : (ge(je, je.current & 1), e = It(e, t, r), e !== null ? e.sibling : null);
        ge(je, je.current & 1);
        break;
      case 19:
        if (n = (r & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (n) return Qu(e, t, r);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), ge(je, je.current), n) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, $u(e, t, r);
    }
    return It(e, t, r);
  }
  var Gu, Hi, Ku, Yu;
  Gu = function(e, t) {
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
  }, Hi = function() {
  }, Ku = function(e, t, r, n) {
    var l = e.memoizedProps;
    if (l !== n) {
      e = t.stateNode, kr(Ct.current);
      var o = null;
      switch (r) {
        case "input":
          l = go(e, l), n = go(e, n), o = [];
          break;
        case "select":
          l = F({}, l, { value: void 0 }), n = F({}, n, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = yo(e, l), n = yo(e, n), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof n.onClick == "function" && (e.onclick = Sl);
      }
      ko(r, n);
      var s;
      r = null;
      for (k in l) if (!n.hasOwnProperty(k) && l.hasOwnProperty(k) && l[k] != null) if (k === "style") {
        var d = l[k];
        for (s in d) d.hasOwnProperty(s) && (r || (r = {}), r[s] = "");
      } else k !== "dangerouslySetInnerHTML" && k !== "children" && k !== "suppressContentEditableWarning" && k !== "suppressHydrationWarning" && k !== "autoFocus" && (g.hasOwnProperty(k) ? o || (o = []) : (o = o || []).push(k, null));
      for (k in n) {
        var p = n[k];
        if (d = l != null ? l[k] : void 0, n.hasOwnProperty(k) && p !== d && (p != null || d != null)) if (k === "style") if (d) {
          for (s in d) !d.hasOwnProperty(s) || p && p.hasOwnProperty(s) || (r || (r = {}), r[s] = "");
          for (s in p) p.hasOwnProperty(s) && d[s] !== p[s] && (r || (r = {}), r[s] = p[s]);
        } else r || (o || (o = []), o.push(
          k,
          r
        )), r = p;
        else k === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, d = d ? d.__html : void 0, p != null && d !== p && (o = o || []).push(k, p)) : k === "children" ? typeof p != "string" && typeof p != "number" || (o = o || []).push(k, "" + p) : k !== "suppressContentEditableWarning" && k !== "suppressHydrationWarning" && (g.hasOwnProperty(k) ? (p != null && k === "onScroll" && ve("scroll", e), o || d === p || (o = [])) : (o = o || []).push(k, p));
      }
      r && (o = o || []).push("style", r);
      var k = o;
      (t.updateQueue = k) && (t.flags |= 4);
    }
  }, Yu = function(e, t, r, n) {
    r !== n && (t.flags |= 4);
  };
  function Un(e, t) {
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
  function Vp(e, t, r) {
    var n = t.pendingProps;
    switch (ui(t), t.tag) {
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
        return Ke(t.type) && Nl(), Be(t), null;
      case 3:
        return n = t.stateNode, Jr(), ye(Ge), ye(Ue), bi(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Pl(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, gt !== null && (Zi(gt), gt = null))), Hi(e, t), Be(t), null;
      case 5:
        wi(t);
        var l = kr(On.current);
        if (r = t.type, e !== null && t.stateNode != null) Ku(e, t, r, n, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!n) {
            if (t.stateNode === null) throw Error(u(166));
            return Be(t), null;
          }
          if (e = kr(Ct.current), Pl(t)) {
            n = t.stateNode, r = t.type;
            var o = t.memoizedProps;
            switch (n[St] = t, n[Ln] = o, e = (t.mode & 1) !== 0, r) {
              case "dialog":
                ve("cancel", n), ve("close", n);
                break;
              case "iframe":
              case "object":
              case "embed":
                ve("load", n);
                break;
              case "video":
              case "audio":
                for (l = 0; l < _n.length; l++) ve(_n[l], n);
                break;
              case "source":
                ve("error", n);
                break;
              case "img":
              case "image":
              case "link":
                ve(
                  "error",
                  n
                ), ve("load", n);
                break;
              case "details":
                ve("toggle", n);
                break;
              case "input":
                Ma(n, o), ve("invalid", n);
                break;
              case "select":
                n._wrapperState = { wasMultiple: !!o.multiple }, ve("invalid", n);
                break;
              case "textarea":
                Ta(n, o), ve("invalid", n);
            }
            ko(r, o), l = null;
            for (var s in o) if (o.hasOwnProperty(s)) {
              var d = o[s];
              s === "children" ? typeof d == "string" ? n.textContent !== d && (o.suppressHydrationWarning !== !0 && jl(n.textContent, d, e), l = ["children", d]) : typeof d == "number" && n.textContent !== "" + d && (o.suppressHydrationWarning !== !0 && jl(
                n.textContent,
                d,
                e
              ), l = ["children", "" + d]) : g.hasOwnProperty(s) && d != null && s === "onScroll" && ve("scroll", n);
            }
            switch (r) {
              case "input":
                el(n), La(n, o, !0);
                break;
              case "textarea":
                el(n), Da(n);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (n.onclick = Sl);
            }
            n = l, t.updateQueue = n, n !== null && (t.flags |= 4);
          } else {
            s = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Ia(r)), e === "http://www.w3.org/1999/xhtml" ? r === "script" ? (e = s.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof n.is == "string" ? e = s.createElement(r, { is: n.is }) : (e = s.createElement(r), r === "select" && (s = e, n.multiple ? s.multiple = !0 : n.size && (s.size = n.size))) : e = s.createElementNS(e, r), e[St] = t, e[Ln] = n, Gu(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (s = bo(r, n), r) {
                case "dialog":
                  ve("cancel", e), ve("close", e), l = n;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  ve("load", e), l = n;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < _n.length; l++) ve(_n[l], e);
                  l = n;
                  break;
                case "source":
                  ve("error", e), l = n;
                  break;
                case "img":
                case "image":
                case "link":
                  ve(
                    "error",
                    e
                  ), ve("load", e), l = n;
                  break;
                case "details":
                  ve("toggle", e), l = n;
                  break;
                case "input":
                  Ma(e, n), l = go(e, n), ve("invalid", e);
                  break;
                case "option":
                  l = n;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!n.multiple }, l = F({}, n, { value: void 0 }), ve("invalid", e);
                  break;
                case "textarea":
                  Ta(e, n), l = yo(e, n), ve("invalid", e);
                  break;
                default:
                  l = n;
              }
              ko(r, l), d = l;
              for (o in d) if (d.hasOwnProperty(o)) {
                var p = d[o];
                o === "style" ? Fa(e, p) : o === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, p != null && Oa(e, p)) : o === "children" ? typeof p == "string" ? (r !== "textarea" || p !== "") && cn(e, p) : typeof p == "number" && cn(e, "" + p) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (g.hasOwnProperty(o) ? p != null && o === "onScroll" && ve("scroll", e) : p != null && T(e, o, p, s));
              }
              switch (r) {
                case "input":
                  el(e), La(e, n, !1);
                  break;
                case "textarea":
                  el(e), Da(e);
                  break;
                case "option":
                  n.value != null && e.setAttribute("value", "" + pe(n.value));
                  break;
                case "select":
                  e.multiple = !!n.multiple, o = n.value, o != null ? Rr(e, !!n.multiple, o, !1) : n.defaultValue != null && Rr(
                    e,
                    !!n.multiple,
                    n.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = Sl);
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
        if (e && t.stateNode != null) Yu(e, t, e.memoizedProps, n);
        else {
          if (typeof n != "string" && t.stateNode === null) throw Error(u(166));
          if (r = kr(On.current), kr(Ct.current), Pl(t)) {
            if (n = t.stateNode, r = t.memoizedProps, n[St] = t, (o = n.nodeValue !== r) && (e = nt, e !== null)) switch (e.tag) {
              case 3:
                jl(n.nodeValue, r, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && jl(n.nodeValue, r, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else n = (r.nodeType === 9 ? r : r.ownerDocument).createTextNode(n), n[St] = t, t.stateNode = n;
        }
        return Be(t), null;
      case 13:
        if (ye(je), n = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (be && lt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Js(), Kr(), t.flags |= 98560, o = !1;
          else if (o = Pl(t), n !== null && n.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(u(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(u(317));
              o[St] = t;
            } else Kr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Be(t), o = !1;
          } else gt !== null && (Zi(gt), gt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = r, t) : (n = n !== null, n !== (e !== null && e.memoizedState !== null) && n && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (je.current & 1) !== 0 ? Le === 0 && (Le = 3) : ta())), t.updateQueue !== null && (t.flags |= 4), Be(t), null);
      case 4:
        return Jr(), Hi(e, t), e === null && Mn(t.stateNode.containerInfo), Be(t), null;
      case 10:
        return hi(t.type._context), Be(t), null;
      case 17:
        return Ke(t.type) && Nl(), Be(t), null;
      case 19:
        if (ye(je), o = t.memoizedState, o === null) return Be(t), null;
        if (n = (t.flags & 128) !== 0, s = o.rendering, s === null) if (n) Un(o, !1);
        else {
          if (Le !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (s = Ol(e), s !== null) {
              for (t.flags |= 128, Un(o, !1), n = s.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), t.subtreeFlags = 0, n = r, r = t.child; r !== null; ) o = r, e = n, o.flags &= 14680066, s = o.alternate, s === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = s.childLanes, o.lanes = s.lanes, o.child = s.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = s.memoizedProps, o.memoizedState = s.memoizedState, o.updateQueue = s.updateQueue, o.type = s.type, e = s.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), r = r.sibling;
              return ge(je, je.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && Ne() > nn && (t.flags |= 128, n = !0, Un(o, !1), t.lanes = 4194304);
        }
        else {
          if (!n) if (e = Ol(s), e !== null) {
            if (t.flags |= 128, n = !0, r = e.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), Un(o, !0), o.tail === null && o.tailMode === "hidden" && !s.alternate && !be) return Be(t), null;
          } else 2 * Ne() - o.renderingStartTime > nn && r !== 1073741824 && (t.flags |= 128, n = !0, Un(o, !1), t.lanes = 4194304);
          o.isBackwards ? (s.sibling = t.child, t.child = s) : (r = o.last, r !== null ? r.sibling = s : t.child = s, o.last = s);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Ne(), t.sibling = null, r = je.current, ge(je, n ? r & 1 | 2 : r & 1), t) : (Be(t), null);
      case 22:
      case 23:
        return ea(), n = t.memoizedState !== null, e !== null && e.memoizedState !== null !== n && (t.flags |= 8192), n && (t.mode & 1) !== 0 ? (ot & 1073741824) !== 0 && (Be(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Be(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function Bp(e, t) {
    switch (ui(t), t.tag) {
      case 1:
        return Ke(t.type) && Nl(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Jr(), ye(Ge), ye(Ue), bi(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return wi(t), null;
      case 13:
        if (ye(je), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(u(340));
          Kr();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return ye(je), null;
      case 4:
        return Jr(), null;
      case 10:
        return hi(t.type._context), null;
      case 22:
      case 23:
        return ea(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ql = !1, We = !1, Wp = typeof WeakSet == "function" ? WeakSet : Set, $ = null;
  function tn(e, t) {
    var r = e.ref;
    if (r !== null) if (typeof r == "function") try {
      r(null);
    } catch (n) {
      Ce(e, t, n);
    }
    else r.current = null;
  }
  function Ui(e, t, r) {
    try {
      r();
    } catch (n) {
      Ce(e, t, n);
    }
  }
  var Xu = !1;
  function qp(e, t) {
    if (ei = pl, e = _s(), qo(e)) {
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
          var s = 0, d = -1, p = -1, k = 0, _ = 0, P = e, E = null;
          t: for (; ; ) {
            for (var A; P !== r || l !== 0 && P.nodeType !== 3 || (d = s + l), P !== o || n !== 0 && P.nodeType !== 3 || (p = s + n), P.nodeType === 3 && (s += P.nodeValue.length), (A = P.firstChild) !== null; )
              E = P, P = A;
            for (; ; ) {
              if (P === e) break t;
              if (E === r && ++k === l && (d = s), E === o && ++_ === n && (p = s), (A = P.nextSibling) !== null) break;
              P = E, E = P.parentNode;
            }
            P = A;
          }
          r = d === -1 || p === -1 ? null : { start: d, end: p };
        } else r = null;
      }
      r = r || { start: 0, end: 0 };
    } else r = null;
    for (ti = { focusedElem: e, selectionRange: r }, pl = !1, $ = t; $ !== null; ) if (t = $, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, $ = e;
    else for (; $ !== null; ) {
      t = $;
      try {
        var H = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (H !== null) {
              var U = H.memoizedProps, Ee = H.memoizedState, y = t.stateNode, m = y.getSnapshotBeforeUpdate(t.elementType === t.type ? U : xt(t.type, U), Ee);
              y.__reactInternalSnapshotBeforeUpdate = m;
            }
            break;
          case 3:
            var w = t.stateNode.containerInfo;
            w.nodeType === 1 ? w.textContent = "" : w.nodeType === 9 && w.documentElement && w.removeChild(w.documentElement);
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
        e.return = t.return, $ = e;
        break;
      }
      $ = t.return;
    }
    return H = Xu, Xu = !1, H;
  }
  function Vn(e, t, r) {
    var n = t.updateQueue;
    if (n = n !== null ? n.lastEffect : null, n !== null) {
      var l = n = n.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && Ui(t, r, o);
        }
        l = l.next;
      } while (l !== n);
    }
  }
  function Ql(e, t) {
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
  function Vi(e) {
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
  function Zu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Zu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[St], delete t[Ln], delete t[oi], delete t[zp], delete t[_p])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Ju(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function ec(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Ju(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Bi(e, t, r) {
    var n = e.tag;
    if (n === 5 || n === 6) e = e.stateNode, t ? r.nodeType === 8 ? r.parentNode.insertBefore(e, t) : r.insertBefore(e, t) : (r.nodeType === 8 ? (t = r.parentNode, t.insertBefore(e, r)) : (t = r, t.appendChild(e)), r = r._reactRootContainer, r != null || t.onclick !== null || (t.onclick = Sl));
    else if (n !== 4 && (e = e.child, e !== null)) for (Bi(e, t, r), e = e.sibling; e !== null; ) Bi(e, t, r), e = e.sibling;
  }
  function Wi(e, t, r) {
    var n = e.tag;
    if (n === 5 || n === 6) e = e.stateNode, t ? r.insertBefore(e, t) : r.appendChild(e);
    else if (n !== 4 && (e = e.child, e !== null)) for (Wi(e, t, r), e = e.sibling; e !== null; ) Wi(e, t, r), e = e.sibling;
  }
  var Oe = null, vt = !1;
  function lr(e, t, r) {
    for (r = r.child; r !== null; ) tc(e, t, r), r = r.sibling;
  }
  function tc(e, t, r) {
    if (jt && typeof jt.onCommitFiberUnmount == "function") try {
      jt.onCommitFiberUnmount(il, r);
    } catch {
    }
    switch (r.tag) {
      case 5:
        We || tn(r, t);
      case 6:
        var n = Oe, l = vt;
        Oe = null, lr(e, t, r), Oe = n, vt = l, Oe !== null && (vt ? (e = Oe, r = r.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(r) : e.removeChild(r)) : Oe.removeChild(r.stateNode));
        break;
      case 18:
        Oe !== null && (vt ? (e = Oe, r = r.stateNode, e.nodeType === 8 ? li(e.parentNode, r) : e.nodeType === 1 && li(e, r), kn(e)) : li(Oe, r.stateNode));
        break;
      case 4:
        n = Oe, l = vt, Oe = r.stateNode.containerInfo, vt = !0, lr(e, t, r), Oe = n, vt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!We && (n = r.updateQueue, n !== null && (n = n.lastEffect, n !== null))) {
          l = n = n.next;
          do {
            var o = l, s = o.destroy;
            o = o.tag, s !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && Ui(r, t, s), l = l.next;
          } while (l !== n);
        }
        lr(e, t, r);
        break;
      case 1:
        if (!We && (tn(r, t), n = r.stateNode, typeof n.componentWillUnmount == "function")) try {
          n.props = r.memoizedProps, n.state = r.memoizedState, n.componentWillUnmount();
        } catch (d) {
          Ce(r, t, d);
        }
        lr(e, t, r);
        break;
      case 21:
        lr(e, t, r);
        break;
      case 22:
        r.mode & 1 ? (We = (n = We) || r.memoizedState !== null, lr(e, t, r), We = n) : lr(e, t, r);
        break;
      default:
        lr(e, t, r);
    }
  }
  function rc(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var r = e.stateNode;
      r === null && (r = e.stateNode = new Wp()), t.forEach(function(n) {
        var l = tf.bind(null, e, n);
        r.has(n) || (r.add(n), n.then(l, l));
      });
    }
  }
  function yt(e, t) {
    var r = t.deletions;
    if (r !== null) for (var n = 0; n < r.length; n++) {
      var l = r[n];
      try {
        var o = e, s = t, d = s;
        e: for (; d !== null; ) {
          switch (d.tag) {
            case 5:
              Oe = d.stateNode, vt = !1;
              break e;
            case 3:
              Oe = d.stateNode.containerInfo, vt = !0;
              break e;
            case 4:
              Oe = d.stateNode.containerInfo, vt = !0;
              break e;
          }
          d = d.return;
        }
        if (Oe === null) throw Error(u(160));
        tc(o, s, l), Oe = null, vt = !1;
        var p = l.alternate;
        p !== null && (p.return = null), l.return = null;
      } catch (k) {
        Ce(l, t, k);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) nc(t, e), t = t.sibling;
  }
  function nc(e, t) {
    var r = e.alternate, n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (yt(t, e), Et(e), n & 4) {
          try {
            Vn(3, e, e.return), Ql(3, e);
          } catch (U) {
            Ce(e, e.return, U);
          }
          try {
            Vn(5, e, e.return);
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        break;
      case 1:
        yt(t, e), Et(e), n & 512 && r !== null && tn(r, r.return);
        break;
      case 5:
        if (yt(t, e), Et(e), n & 512 && r !== null && tn(r, r.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            cn(l, "");
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        if (n & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, s = r !== null ? r.memoizedProps : o, d = e.type, p = e.updateQueue;
          if (e.updateQueue = null, p !== null) try {
            d === "input" && o.type === "radio" && o.name != null && Pa(l, o), bo(d, s);
            var k = bo(d, o);
            for (s = 0; s < p.length; s += 2) {
              var _ = p[s], P = p[s + 1];
              _ === "style" ? Fa(l, P) : _ === "dangerouslySetInnerHTML" ? Oa(l, P) : _ === "children" ? cn(l, P) : T(l, _, P, k);
            }
            switch (d) {
              case "input":
                xo(l, o);
                break;
              case "textarea":
                Ra(l, o);
                break;
              case "select":
                var E = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var A = o.value;
                A != null ? Rr(l, !!o.multiple, A, !1) : E !== !!o.multiple && (o.defaultValue != null ? Rr(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : Rr(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[Ln] = o;
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        break;
      case 6:
        if (yt(t, e), Et(e), n & 4) {
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
        if (yt(t, e), Et(e), n & 4 && r !== null && r.memoizedState.isDehydrated) try {
          kn(t.containerInfo);
        } catch (U) {
          Ce(e, e.return, U);
        }
        break;
      case 4:
        yt(t, e), Et(e);
        break;
      case 13:
        yt(t, e), Et(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (Gi = Ne())), n & 4 && rc(e);
        break;
      case 22:
        if (_ = r !== null && r.memoizedState !== null, e.mode & 1 ? (We = (k = We) || _, yt(t, e), We = k) : yt(t, e), Et(e), n & 8192) {
          if (k = e.memoizedState !== null, (e.stateNode.isHidden = k) && !_ && (e.mode & 1) !== 0) for ($ = e, _ = e.child; _ !== null; ) {
            for (P = $ = _; $ !== null; ) {
              switch (E = $, A = E.child, E.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Vn(4, E, E.return);
                  break;
                case 1:
                  tn(E, E.return);
                  var H = E.stateNode;
                  if (typeof H.componentWillUnmount == "function") {
                    n = E, r = E.return;
                    try {
                      t = n, H.props = t.memoizedProps, H.state = t.memoizedState, H.componentWillUnmount();
                    } catch (U) {
                      Ce(n, r, U);
                    }
                  }
                  break;
                case 5:
                  tn(E, E.return);
                  break;
                case 22:
                  if (E.memoizedState !== null) {
                    ic(P);
                    continue;
                  }
              }
              A !== null ? (A.return = E, $ = A) : ic(P);
            }
            _ = _.sibling;
          }
          e: for (_ = null, P = e; ; ) {
            if (P.tag === 5) {
              if (_ === null) {
                _ = P;
                try {
                  l = P.stateNode, k ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (d = P.stateNode, p = P.memoizedProps.style, s = p != null && p.hasOwnProperty("display") ? p.display : null, d.style.display = Aa("display", s));
                } catch (U) {
                  Ce(e, e.return, U);
                }
              }
            } else if (P.tag === 6) {
              if (_ === null) try {
                P.stateNode.nodeValue = k ? "" : P.memoizedProps;
              } catch (U) {
                Ce(e, e.return, U);
              }
            } else if ((P.tag !== 22 && P.tag !== 23 || P.memoizedState === null || P === e) && P.child !== null) {
              P.child.return = P, P = P.child;
              continue;
            }
            if (P === e) break e;
            for (; P.sibling === null; ) {
              if (P.return === null || P.return === e) break e;
              _ === P && (_ = null), P = P.return;
            }
            _ === P && (_ = null), P.sibling.return = P.return, P = P.sibling;
          }
        }
        break;
      case 19:
        yt(t, e), Et(e), n & 4 && rc(e);
        break;
      case 21:
        break;
      default:
        yt(
          t,
          e
        ), Et(e);
    }
  }
  function Et(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var r = e.return; r !== null; ) {
            if (Ju(r)) {
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
            n.flags & 32 && (cn(l, ""), n.flags &= -33);
            var o = ec(e);
            Wi(e, o, l);
            break;
          case 3:
          case 4:
            var s = n.stateNode.containerInfo, d = ec(e);
            Bi(e, d, s);
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
  function Qp(e, t, r) {
    $ = e, lc(e);
  }
  function lc(e, t, r) {
    for (var n = (e.mode & 1) !== 0; $ !== null; ) {
      var l = $, o = l.child;
      if (l.tag === 22 && n) {
        var s = l.memoizedState !== null || ql;
        if (!s) {
          var d = l.alternate, p = d !== null && d.memoizedState !== null || We;
          d = ql;
          var k = We;
          if (ql = s, (We = p) && !k) for ($ = l; $ !== null; ) s = $, p = s.child, s.tag === 22 && s.memoizedState !== null ? ac(l) : p !== null ? (p.return = s, $ = p) : ac(l);
          for (; o !== null; ) $ = o, lc(o), o = o.sibling;
          $ = l, ql = d, We = k;
        }
        oc(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, $ = o) : oc(e);
    }
  }
  function oc(e) {
    for (; $ !== null; ) {
      var t = $;
      if ((t.flags & 8772) !== 0) {
        var r = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              We || Ql(5, t);
              break;
            case 1:
              var n = t.stateNode;
              if (t.flags & 4 && !We) if (r === null) n.componentDidMount();
              else {
                var l = t.elementType === t.type ? r.memoizedProps : xt(t.type, r.memoizedProps);
                n.componentDidUpdate(l, r.memoizedState, n.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && iu(t, o, n);
              break;
            case 3:
              var s = t.updateQueue;
              if (s !== null) {
                if (r = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    r = t.child.stateNode;
                    break;
                  case 1:
                    r = t.child.stateNode;
                }
                iu(t, s, r);
              }
              break;
            case 5:
              var d = t.stateNode;
              if (r === null && t.flags & 4) {
                r = d;
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
                  var _ = k.memoizedState;
                  if (_ !== null) {
                    var P = _.dehydrated;
                    P !== null && kn(P);
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
          We || t.flags & 512 && Vi(t);
        } catch (E) {
          Ce(t, t.return, E);
        }
      }
      if (t === e) {
        $ = null;
        break;
      }
      if (r = t.sibling, r !== null) {
        r.return = t.return, $ = r;
        break;
      }
      $ = t.return;
    }
  }
  function ic(e) {
    for (; $ !== null; ) {
      var t = $;
      if (t === e) {
        $ = null;
        break;
      }
      var r = t.sibling;
      if (r !== null) {
        r.return = t.return, $ = r;
        break;
      }
      $ = t.return;
    }
  }
  function ac(e) {
    for (; $ !== null; ) {
      var t = $;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var r = t.return;
            try {
              Ql(4, t);
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
              Vi(t);
            } catch (p) {
              Ce(t, o, p);
            }
            break;
          case 5:
            var s = t.return;
            try {
              Vi(t);
            } catch (p) {
              Ce(t, s, p);
            }
        }
      } catch (p) {
        Ce(t, t.return, p);
      }
      if (t === e) {
        $ = null;
        break;
      }
      var d = t.sibling;
      if (d !== null) {
        d.return = t.return, $ = d;
        break;
      }
      $ = t.return;
    }
  }
  var Gp = Math.ceil, Gl = O.ReactCurrentDispatcher, qi = O.ReactCurrentOwner, pt = O.ReactCurrentBatchConfig, se = 0, Re = null, ze = null, Ae = 0, ot = 0, rn = Jt(0), Le = 0, Bn = null, jr = 0, Kl = 0, Qi = 0, Wn = null, Xe = null, Gi = 0, nn = 1 / 0, Ot = null, Yl = !1, Ki = null, or = null, Xl = !1, ir = null, Zl = 0, qn = 0, Yi = null, Jl = -1, eo = 0;
  function Qe() {
    return (se & 6) !== 0 ? Ne() : Jl !== -1 ? Jl : Jl = Ne();
  }
  function ar(e) {
    return (e.mode & 1) === 0 ? 1 : (se & 2) !== 0 && Ae !== 0 ? Ae & -Ae : Pp.transition !== null ? (eo === 0 && (eo = es()), eo) : (e = fe, e !== 0 || (e = window.event, e = e === void 0 ? 16 : us(e.type)), e);
  }
  function wt(e, t, r, n) {
    if (50 < qn) throw qn = 0, Yi = null, Error(u(185));
    gn(e, r, n), ((se & 2) === 0 || e !== Re) && (e === Re && ((se & 2) === 0 && (Kl |= r), Le === 4 && sr(e, Ae)), Ze(e, n), r === 1 && se === 0 && (t.mode & 1) === 0 && (nn = Ne() + 500, zl && tr()));
  }
  function Ze(e, t) {
    var r = e.callbackNode;
    Pd(e, t);
    var n = ul(e, e === Re ? Ae : 0);
    if (n === 0) r !== null && Xa(r), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = n & -n, e.callbackPriority !== t) {
      if (r != null && Xa(r), t === 1) e.tag === 0 ? Mp(uc.bind(null, e)) : Gs(uc.bind(null, e)), Np(function() {
        (se & 6) === 0 && tr();
      }), r = null;
      else {
        switch (ts(n)) {
          case 1:
            r = _o;
            break;
          case 4:
            r = Za;
            break;
          case 16:
            r = ol;
            break;
          case 536870912:
            r = Ja;
            break;
          default:
            r = ol;
        }
        r = xc(r, sc.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = r;
    }
  }
  function sc(e, t) {
    if (Jl = -1, eo = 0, (se & 6) !== 0) throw Error(u(327));
    var r = e.callbackNode;
    if (ln() && e.callbackNode !== r) return null;
    var n = ul(e, e === Re ? Ae : 0);
    if (n === 0) return null;
    if ((n & 30) !== 0 || (n & e.expiredLanes) !== 0 || t) t = to(e, n);
    else {
      t = n;
      var l = se;
      se |= 2;
      var o = dc();
      (Re !== e || Ae !== t) && (Ot = null, nn = Ne() + 500, Cr(e, t));
      do
        try {
          Xp();
          break;
        } catch (d) {
          cc(e, d);
        }
      while (!0);
      mi(), Gl.current = o, se = l, ze !== null ? t = 0 : (Re = null, Ae = 0, t = Le);
    }
    if (t !== 0) {
      if (t === 2 && (l = Mo(e), l !== 0 && (n = l, t = Xi(e, l))), t === 1) throw r = Bn, Cr(e, 0), sr(e, n), Ze(e, Ne()), r;
      if (t === 6) sr(e, n);
      else {
        if (l = e.current.alternate, (n & 30) === 0 && !Kp(l) && (t = to(e, n), t === 2 && (o = Mo(e), o !== 0 && (n = o, t = Xi(e, o))), t === 1)) throw r = Bn, Cr(e, 0), sr(e, n), Ze(e, Ne()), r;
        switch (e.finishedWork = l, e.finishedLanes = n, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            Nr(e, Xe, Ot);
            break;
          case 3:
            if (sr(e, n), (n & 130023424) === n && (t = Gi + 500 - Ne(), 10 < t)) {
              if (ul(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & n) !== n) {
                Qe(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = ni(Nr.bind(null, e, Xe, Ot), t);
              break;
            }
            Nr(e, Xe, Ot);
            break;
          case 4:
            if (sr(e, n), (n & 4194240) === n) break;
            for (t = e.eventTimes, l = -1; 0 < n; ) {
              var s = 31 - mt(n);
              o = 1 << s, s = t[s], s > l && (l = s), n &= ~o;
            }
            if (n = l, n = Ne() - n, n = (120 > n ? 120 : 480 > n ? 480 : 1080 > n ? 1080 : 1920 > n ? 1920 : 3e3 > n ? 3e3 : 4320 > n ? 4320 : 1960 * Gp(n / 1960)) - n, 10 < n) {
              e.timeoutHandle = ni(Nr.bind(null, e, Xe, Ot), n);
              break;
            }
            Nr(e, Xe, Ot);
            break;
          case 5:
            Nr(e, Xe, Ot);
            break;
          default:
            throw Error(u(329));
        }
      }
    }
    return Ze(e, Ne()), e.callbackNode === r ? sc.bind(null, e) : null;
  }
  function Xi(e, t) {
    var r = Wn;
    return e.current.memoizedState.isDehydrated && (Cr(e, t).flags |= 256), e = to(e, t), e !== 2 && (t = Xe, Xe = r, t !== null && Zi(t)), e;
  }
  function Zi(e) {
    Xe === null ? Xe = e : Xe.push.apply(Xe, e);
  }
  function Kp(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var r = t.updateQueue;
        if (r !== null && (r = r.stores, r !== null)) for (var n = 0; n < r.length; n++) {
          var l = r[n], o = l.getSnapshot;
          l = l.value;
          try {
            if (!ht(o(), l)) return !1;
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
  function sr(e, t) {
    for (t &= ~Qi, t &= ~Kl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var r = 31 - mt(t), n = 1 << r;
      e[r] = -1, t &= ~n;
    }
  }
  function uc(e) {
    if ((se & 6) !== 0) throw Error(u(327));
    ln();
    var t = ul(e, 0);
    if ((t & 1) === 0) return Ze(e, Ne()), null;
    var r = to(e, t);
    if (e.tag !== 0 && r === 2) {
      var n = Mo(e);
      n !== 0 && (t = n, r = Xi(e, n));
    }
    if (r === 1) throw r = Bn, Cr(e, 0), sr(e, t), Ze(e, Ne()), r;
    if (r === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, Nr(e, Xe, Ot), Ze(e, Ne()), null;
  }
  function Ji(e, t) {
    var r = se;
    se |= 1;
    try {
      return e(t);
    } finally {
      se = r, se === 0 && (nn = Ne() + 500, zl && tr());
    }
  }
  function Sr(e) {
    ir !== null && ir.tag === 0 && (se & 6) === 0 && ln();
    var t = se;
    se |= 1;
    var r = pt.transition, n = fe;
    try {
      if (pt.transition = null, fe = 1, e) return e();
    } finally {
      fe = n, pt.transition = r, se = t, (se & 6) === 0 && tr();
    }
  }
  function ea() {
    ot = rn.current, ye(rn);
  }
  function Cr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var r = e.timeoutHandle;
    if (r !== -1 && (e.timeoutHandle = -1, Cp(r)), ze !== null) for (r = ze.return; r !== null; ) {
      var n = r;
      switch (ui(n), n.tag) {
        case 1:
          n = n.type.childContextTypes, n != null && Nl();
          break;
        case 3:
          Jr(), ye(Ge), ye(Ue), bi();
          break;
        case 5:
          wi(n);
          break;
        case 4:
          Jr();
          break;
        case 13:
          ye(je);
          break;
        case 19:
          ye(je);
          break;
        case 10:
          hi(n.type._context);
          break;
        case 22:
        case 23:
          ea();
      }
      r = r.return;
    }
    if (Re = e, ze = e = ur(e.current, null), Ae = ot = t, Le = 0, Bn = null, Qi = Kl = jr = 0, Xe = Wn = null, wr !== null) {
      for (t = 0; t < wr.length; t++) if (r = wr[t], n = r.interleaved, n !== null) {
        r.interleaved = null;
        var l = n.next, o = r.pending;
        if (o !== null) {
          var s = o.next;
          o.next = l, n.next = s;
        }
        r.pending = n;
      }
      wr = null;
    }
    return e;
  }
  function cc(e, t) {
    do {
      var r = ze;
      try {
        if (mi(), Al.current = Ul, Fl) {
          for (var n = Se.memoizedState; n !== null; ) {
            var l = n.queue;
            l !== null && (l.pending = null), n = n.next;
          }
          Fl = !1;
        }
        if (br = 0, Te = Pe = Se = null, An = !1, Fn = 0, qi.current = null, r === null || r.return === null) {
          Le = 1, Bn = t, ze = null;
          break;
        }
        e: {
          var o = e, s = r.return, d = r, p = t;
          if (t = Ae, d.flags |= 32768, p !== null && typeof p == "object" && typeof p.then == "function") {
            var k = p, _ = d, P = _.tag;
            if ((_.mode & 1) === 0 && (P === 0 || P === 11 || P === 15)) {
              var E = _.alternate;
              E ? (_.updateQueue = E.updateQueue, _.memoizedState = E.memoizedState, _.lanes = E.lanes) : (_.updateQueue = null, _.memoizedState = null);
            }
            var A = Du(s);
            if (A !== null) {
              A.flags &= -257, Iu(A, s, d, o, t), A.mode & 1 && Ru(o, k, t), t = A, p = k;
              var H = t.updateQueue;
              if (H === null) {
                var U = /* @__PURE__ */ new Set();
                U.add(p), t.updateQueue = U;
              } else H.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                Ru(o, k, t), ta();
                break e;
              }
              p = Error(u(426));
            }
          } else if (be && d.mode & 1) {
            var Ee = Du(s);
            if (Ee !== null) {
              (Ee.flags & 65536) === 0 && (Ee.flags |= 256), Iu(Ee, s, d, o, t), pi(en(p, d));
              break e;
            }
          }
          o = p = en(p, d), Le !== 4 && (Le = 2), Wn === null ? Wn = [o] : Wn.push(o), o = s;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var y = Lu(o, p, t);
                ou(o, y);
                break e;
              case 1:
                d = p;
                var m = o.type, w = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof m.getDerivedStateFromError == "function" || w !== null && typeof w.componentDidCatch == "function" && (or === null || !or.has(w)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var L = Tu(o, d, t);
                  ou(o, L);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        fc(r);
      } catch (W) {
        t = W, ze === r && r !== null && (ze = r = r.return);
        continue;
      }
      break;
    } while (!0);
  }
  function dc() {
    var e = Gl.current;
    return Gl.current = Ul, e === null ? Ul : e;
  }
  function ta() {
    (Le === 0 || Le === 3 || Le === 2) && (Le = 4), Re === null || (jr & 268435455) === 0 && (Kl & 268435455) === 0 || sr(Re, Ae);
  }
  function to(e, t) {
    var r = se;
    se |= 2;
    var n = dc();
    (Re !== e || Ae !== t) && (Ot = null, Cr(e, t));
    do
      try {
        Yp();
        break;
      } catch (l) {
        cc(e, l);
      }
    while (!0);
    if (mi(), se = r, Gl.current = n, ze !== null) throw Error(u(261));
    return Re = null, Ae = 0, Le;
  }
  function Yp() {
    for (; ze !== null; ) pc(ze);
  }
  function Xp() {
    for (; ze !== null && !bd(); ) pc(ze);
  }
  function pc(e) {
    var t = gc(e.alternate, e, ot);
    e.memoizedProps = e.pendingProps, t === null ? fc(e) : ze = t, qi.current = null;
  }
  function fc(e) {
    var t = e;
    do {
      var r = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (r = Vp(r, t, ot), r !== null) {
          ze = r;
          return;
        }
      } else {
        if (r = Bp(r, t), r !== null) {
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
  function Nr(e, t, r) {
    var n = fe, l = pt.transition;
    try {
      pt.transition = null, fe = 1, Zp(e, t, r, n);
    } finally {
      pt.transition = l, fe = n;
    }
    return null;
  }
  function Zp(e, t, r, n) {
    do
      ln();
    while (ir !== null);
    if ((se & 6) !== 0) throw Error(u(327));
    r = e.finishedWork;
    var l = e.finishedLanes;
    if (r === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, r === e.current) throw Error(u(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = r.lanes | r.childLanes;
    if (Ld(e, o), e === Re && (ze = Re = null, Ae = 0), (r.subtreeFlags & 2064) === 0 && (r.flags & 2064) === 0 || Xl || (Xl = !0, xc(ol, function() {
      return ln(), null;
    })), o = (r.flags & 15990) !== 0, (r.subtreeFlags & 15990) !== 0 || o) {
      o = pt.transition, pt.transition = null;
      var s = fe;
      fe = 1;
      var d = se;
      se |= 4, qi.current = null, qp(e, r), nc(r, e), vp(ti), pl = !!ei, ti = ei = null, e.current = r, Qp(r), jd(), se = d, fe = s, pt.transition = o;
    } else e.current = r;
    if (Xl && (Xl = !1, ir = e, Zl = l), o = e.pendingLanes, o === 0 && (or = null), Nd(r.stateNode), Ze(e, Ne()), t !== null) for (n = e.onRecoverableError, r = 0; r < t.length; r++) l = t[r], n(l.value, { componentStack: l.stack, digest: l.digest });
    if (Yl) throw Yl = !1, e = Ki, Ki = null, e;
    return (Zl & 1) !== 0 && e.tag !== 0 && ln(), o = e.pendingLanes, (o & 1) !== 0 ? e === Yi ? qn++ : (qn = 0, Yi = e) : qn = 0, tr(), null;
  }
  function ln() {
    if (ir !== null) {
      var e = ts(Zl), t = pt.transition, r = fe;
      try {
        if (pt.transition = null, fe = 16 > e ? 16 : e, ir === null) var n = !1;
        else {
          if (e = ir, ir = null, Zl = 0, (se & 6) !== 0) throw Error(u(331));
          var l = se;
          for (se |= 4, $ = e.current; $ !== null; ) {
            var o = $, s = o.child;
            if (($.flags & 16) !== 0) {
              var d = o.deletions;
              if (d !== null) {
                for (var p = 0; p < d.length; p++) {
                  var k = d[p];
                  for ($ = k; $ !== null; ) {
                    var _ = $;
                    switch (_.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Vn(8, _, o);
                    }
                    var P = _.child;
                    if (P !== null) P.return = _, $ = P;
                    else for (; $ !== null; ) {
                      _ = $;
                      var E = _.sibling, A = _.return;
                      if (Zu(_), _ === k) {
                        $ = null;
                        break;
                      }
                      if (E !== null) {
                        E.return = A, $ = E;
                        break;
                      }
                      $ = A;
                    }
                  }
                }
                var H = o.alternate;
                if (H !== null) {
                  var U = H.child;
                  if (U !== null) {
                    H.child = null;
                    do {
                      var Ee = U.sibling;
                      U.sibling = null, U = Ee;
                    } while (U !== null);
                  }
                }
                $ = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && s !== null) s.return = o, $ = s;
            else e: for (; $ !== null; ) {
              if (o = $, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  Vn(9, o, o.return);
              }
              var y = o.sibling;
              if (y !== null) {
                y.return = o.return, $ = y;
                break e;
              }
              $ = o.return;
            }
          }
          var m = e.current;
          for ($ = m; $ !== null; ) {
            s = $;
            var w = s.child;
            if ((s.subtreeFlags & 2064) !== 0 && w !== null) w.return = s, $ = w;
            else e: for (s = m; $ !== null; ) {
              if (d = $, (d.flags & 2048) !== 0) try {
                switch (d.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ql(9, d);
                }
              } catch (W) {
                Ce(d, d.return, W);
              }
              if (d === s) {
                $ = null;
                break e;
              }
              var L = d.sibling;
              if (L !== null) {
                L.return = d.return, $ = L;
                break e;
              }
              $ = d.return;
            }
          }
          if (se = l, tr(), jt && typeof jt.onPostCommitFiberRoot == "function") try {
            jt.onPostCommitFiberRoot(il, e);
          } catch {
          }
          n = !0;
        }
        return n;
      } finally {
        fe = r, pt.transition = t;
      }
    }
    return !1;
  }
  function mc(e, t, r) {
    t = en(r, t), t = Lu(e, t, 1), e = nr(e, t, 1), t = Qe(), e !== null && (gn(e, 1, t), Ze(e, t));
  }
  function Ce(e, t, r) {
    if (e.tag === 3) mc(e, e, r);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        mc(t, e, r);
        break;
      } else if (t.tag === 1) {
        var n = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof n.componentDidCatch == "function" && (or === null || !or.has(n))) {
          e = en(r, e), e = Tu(t, e, 1), t = nr(t, e, 1), e = Qe(), t !== null && (gn(t, 1, e), Ze(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Jp(e, t, r) {
    var n = e.pingCache;
    n !== null && n.delete(t), t = Qe(), e.pingedLanes |= e.suspendedLanes & r, Re === e && (Ae & r) === r && (Le === 4 || Le === 3 && (Ae & 130023424) === Ae && 500 > Ne() - Gi ? Cr(e, 0) : Qi |= r), Ze(e, t);
  }
  function hc(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = sl, sl <<= 1, (sl & 130023424) === 0 && (sl = 4194304)));
    var r = Qe();
    e = Rt(e, t), e !== null && (gn(e, t, r), Ze(e, r));
  }
  function ef(e) {
    var t = e.memoizedState, r = 0;
    t !== null && (r = t.retryLane), hc(e, r);
  }
  function tf(e, t) {
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
    n !== null && n.delete(t), hc(e, r);
  }
  var gc;
  gc = function(e, t, r) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ge.current) Ye = !0;
    else {
      if ((e.lanes & r) === 0 && (t.flags & 128) === 0) return Ye = !1, Up(e, t, r);
      Ye = (e.flags & 131072) !== 0;
    }
    else Ye = !1, be && (t.flags & 1048576) !== 0 && Ks(t, Ml, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var n = t.type;
        Wl(e, t), e = t.pendingProps;
        var l = qr(t, Ue.current);
        Zr(t, r), l = Ci(null, t, n, e, l, r);
        var o = Ni();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ke(n) ? (o = !0, El(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, vi(t), l.updater = Vl, t.stateNode = l, l._reactInternals = t, Li(t, n, e, r), t = Ii(null, t, n, !0, o, r)) : (t.tag = 0, be && o && si(t), qe(null, t, l, r), t = t.child), t;
      case 16:
        n = t.elementType;
        e: {
          switch (Wl(e, t), e = t.pendingProps, l = n._init, n = l(n._payload), t.type = n, l = t.tag = nf(n), e = xt(n, e), l) {
            case 0:
              t = Di(null, t, n, e, r);
              break e;
            case 1:
              t = Uu(null, t, n, e, r);
              break e;
            case 11:
              t = Ou(null, t, n, e, r);
              break e;
            case 14:
              t = Au(null, t, n, xt(n.type, e), r);
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
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : xt(n, l), Di(e, t, n, l, r);
      case 1:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : xt(n, l), Uu(e, t, n, l, r);
      case 3:
        e: {
          if (Vu(t), e === null) throw Error(u(387));
          n = t.pendingProps, o = t.memoizedState, l = o.element, lu(e, t), Il(t, n, null, r);
          var s = t.memoizedState;
          if (n = s.element, o.isDehydrated) if (o = { element: n, isDehydrated: !1, cache: s.cache, pendingSuspenseBoundaries: s.pendingSuspenseBoundaries, transitions: s.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = en(Error(u(423)), t), t = Bu(e, t, n, r, l);
            break e;
          } else if (n !== l) {
            l = en(Error(u(424)), t), t = Bu(e, t, n, r, l);
            break e;
          } else for (lt = Zt(t.stateNode.containerInfo.firstChild), nt = t, be = !0, gt = null, r = ru(t, null, n, r), t.child = r; r; ) r.flags = r.flags & -3 | 4096, r = r.sibling;
          else {
            if (Kr(), n === l) {
              t = It(e, t, r);
              break e;
            }
            qe(e, t, n, r);
          }
          t = t.child;
        }
        return t;
      case 5:
        return au(t), e === null && di(t), n = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, s = l.children, ri(n, l) ? s = null : o !== null && ri(n, o) && (t.flags |= 32), Hu(e, t), qe(e, t, s, r), t.child;
      case 6:
        return e === null && di(t), null;
      case 13:
        return Wu(e, t, r);
      case 4:
        return yi(t, t.stateNode.containerInfo), n = t.pendingProps, e === null ? t.child = Yr(t, null, n, r) : qe(e, t, n, r), t.child;
      case 11:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : xt(n, l), Ou(e, t, n, l, r);
      case 7:
        return qe(e, t, t.pendingProps, r), t.child;
      case 8:
        return qe(e, t, t.pendingProps.children, r), t.child;
      case 12:
        return qe(e, t, t.pendingProps.children, r), t.child;
      case 10:
        e: {
          if (n = t.type._context, l = t.pendingProps, o = t.memoizedProps, s = l.value, ge(Tl, n._currentValue), n._currentValue = s, o !== null) if (ht(o.value, s)) {
            if (o.children === l.children && !Ge.current) {
              t = It(e, t, r);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var d = o.dependencies;
            if (d !== null) {
              s = o.child;
              for (var p = d.firstContext; p !== null; ) {
                if (p.context === n) {
                  if (o.tag === 1) {
                    p = Dt(-1, r & -r), p.tag = 2;
                    var k = o.updateQueue;
                    if (k !== null) {
                      k = k.shared;
                      var _ = k.pending;
                      _ === null ? p.next = p : (p.next = _.next, _.next = p), k.pending = p;
                    }
                  }
                  o.lanes |= r, p = o.alternate, p !== null && (p.lanes |= r), gi(
                    o.return,
                    r,
                    t
                  ), d.lanes |= r;
                  break;
                }
                p = p.next;
              }
            } else if (o.tag === 10) s = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (s = o.return, s === null) throw Error(u(341));
              s.lanes |= r, d = s.alternate, d !== null && (d.lanes |= r), gi(s, r, t), s = o.sibling;
            } else s = o.child;
            if (s !== null) s.return = o;
            else for (s = o; s !== null; ) {
              if (s === t) {
                s = null;
                break;
              }
              if (o = s.sibling, o !== null) {
                o.return = s.return, s = o;
                break;
              }
              s = s.return;
            }
            o = s;
          }
          qe(e, t, l.children, r), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, n = t.pendingProps.children, Zr(t, r), l = ct(l), n = n(l), t.flags |= 1, qe(e, t, n, r), t.child;
      case 14:
        return n = t.type, l = xt(n, t.pendingProps), l = xt(n.type, l), Au(e, t, n, l, r);
      case 15:
        return Fu(e, t, t.type, t.pendingProps, r);
      case 17:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : xt(n, l), Wl(e, t), t.tag = 1, Ke(n) ? (e = !0, El(t)) : e = !1, Zr(t, r), Mu(t, n, l), Li(t, n, l, r), Ii(null, t, n, !0, e, r);
      case 19:
        return Qu(e, t, r);
      case 22:
        return $u(e, t, r);
    }
    throw Error(u(156, t.tag));
  };
  function xc(e, t) {
    return Ya(e, t);
  }
  function rf(e, t, r, n) {
    this.tag = e, this.key = r, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = n, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ft(e, t, r, n) {
    return new rf(e, t, r, n);
  }
  function ra(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function nf(e) {
    if (typeof e == "function") return ra(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === ie) return 11;
      if (e === et) return 14;
    }
    return 2;
  }
  function ur(e, t) {
    var r = e.alternate;
    return r === null ? (r = ft(e.tag, t, e.key, e.mode), r.elementType = e.elementType, r.type = e.type, r.stateNode = e.stateNode, r.alternate = e, e.alternate = r) : (r.pendingProps = t, r.type = e.type, r.flags = 0, r.subtreeFlags = 0, r.deletions = null), r.flags = e.flags & 14680064, r.childLanes = e.childLanes, r.lanes = e.lanes, r.child = e.child, r.memoizedProps = e.memoizedProps, r.memoizedState = e.memoizedState, r.updateQueue = e.updateQueue, t = e.dependencies, r.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, r.sibling = e.sibling, r.index = e.index, r.ref = e.ref, r;
  }
  function ro(e, t, r, n, l, o) {
    var s = 2;
    if (n = e, typeof e == "function") ra(e) && (s = 1);
    else if (typeof e == "string") s = 5;
    else e: switch (e) {
      case ae:
        return Er(r.children, l, o, t);
      case me:
        s = 8, l |= 8;
        break;
      case _e:
        return e = ft(12, r, t, l | 2), e.elementType = _e, e.lanes = o, e;
      case $e:
        return e = ft(13, r, t, l), e.elementType = $e, e.lanes = o, e;
      case He:
        return e = ft(19, r, t, l), e.elementType = He, e.lanes = o, e;
      case xe:
        return no(r, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Fe:
            s = 10;
            break e;
          case Ie:
            s = 9;
            break e;
          case ie:
            s = 11;
            break e;
          case et:
            s = 14;
            break e;
          case Me:
            s = 16, n = null;
            break e;
        }
        throw Error(u(130, e == null ? e : typeof e, ""));
    }
    return t = ft(s, r, t, l), t.elementType = e, t.type = n, t.lanes = o, t;
  }
  function Er(e, t, r, n) {
    return e = ft(7, e, n, t), e.lanes = r, e;
  }
  function no(e, t, r, n) {
    return e = ft(22, e, n, t), e.elementType = xe, e.lanes = r, e.stateNode = { isHidden: !1 }, e;
  }
  function na(e, t, r) {
    return e = ft(6, e, null, t), e.lanes = r, e;
  }
  function la(e, t, r) {
    return t = ft(4, e.children !== null ? e.children : [], e.key, t), t.lanes = r, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function lf(e, t, r, n, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Po(0), this.expirationTimes = Po(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Po(0), this.identifierPrefix = n, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function oa(e, t, r, n, l, o, s, d, p) {
    return e = new lf(e, t, r, d, p), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = ft(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: n, isDehydrated: r, cache: null, transitions: null, pendingSuspenseBoundaries: null }, vi(o), e;
  }
  function of(e, t, r) {
    var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Y, key: n == null ? null : "" + n, children: e, containerInfo: t, implementation: r };
  }
  function vc(e) {
    if (!e) return er;
    e = e._reactInternals;
    e: {
      if (hr(e) !== e || e.tag !== 1) throw Error(u(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ke(t.type)) {
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
      if (Ke(r)) return qs(e, r, t);
    }
    return t;
  }
  function yc(e, t, r, n, l, o, s, d, p) {
    return e = oa(r, n, !0, e, l, o, s, d, p), e.context = vc(null), r = e.current, n = Qe(), l = ar(r), o = Dt(n, l), o.callback = t ?? null, nr(r, o, l), e.current.lanes = l, gn(e, l, n), Ze(e, n), e;
  }
  function lo(e, t, r, n) {
    var l = t.current, o = Qe(), s = ar(l);
    return r = vc(r), t.context === null ? t.context = r : t.pendingContext = r, t = Dt(o, s), t.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (t.callback = n), e = nr(l, t, s), e !== null && (wt(e, l, s, o), Dl(e, l, s)), s;
  }
  function oo(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function wc(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var r = e.retryLane;
      e.retryLane = r !== 0 && r < t ? r : t;
    }
  }
  function ia(e, t) {
    wc(e, t), (e = e.alternate) && wc(e, t);
  }
  function af() {
    return null;
  }
  var kc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function aa(e) {
    this._internalRoot = e;
  }
  io.prototype.render = aa.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    lo(e, t, null, null);
  }, io.prototype.unmount = aa.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Sr(function() {
        lo(null, e, null, null);
      }), t[Mt] = null;
    }
  };
  function io(e) {
    this._internalRoot = e;
  }
  io.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = ls();
      e = { blockedOn: null, target: e, priority: t };
      for (var r = 0; r < Kt.length && t !== 0 && t < Kt[r].priority; r++) ;
      Kt.splice(r, 0, e), r === 0 && as(e);
    }
  };
  function sa(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function ao(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function bc() {
  }
  function sf(e, t, r, n, l) {
    if (l) {
      if (typeof n == "function") {
        var o = n;
        n = function() {
          var k = oo(s);
          o.call(k);
        };
      }
      var s = yc(t, n, e, 0, null, !1, !1, "", bc);
      return e._reactRootContainer = s, e[Mt] = s.current, Mn(e.nodeType === 8 ? e.parentNode : e), Sr(), s;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof n == "function") {
      var d = n;
      n = function() {
        var k = oo(p);
        d.call(k);
      };
    }
    var p = oa(e, 0, !1, null, null, !1, !1, "", bc);
    return e._reactRootContainer = p, e[Mt] = p.current, Mn(e.nodeType === 8 ? e.parentNode : e), Sr(function() {
      lo(t, p, r, n);
    }), p;
  }
  function so(e, t, r, n, l) {
    var o = r._reactRootContainer;
    if (o) {
      var s = o;
      if (typeof l == "function") {
        var d = l;
        l = function() {
          var p = oo(s);
          d.call(p);
        };
      }
      lo(t, s, e, l);
    } else s = sf(r, t, e, l, n);
    return oo(s);
  }
  rs = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var r = hn(t.pendingLanes);
          r !== 0 && (Lo(t, r | 1), Ze(t, Ne()), (se & 6) === 0 && (nn = Ne() + 500, tr()));
        }
        break;
      case 13:
        Sr(function() {
          var n = Rt(e, 1);
          if (n !== null) {
            var l = Qe();
            wt(n, e, 1, l);
          }
        }), ia(e, 1);
    }
  }, To = function(e) {
    if (e.tag === 13) {
      var t = Rt(e, 134217728);
      if (t !== null) {
        var r = Qe();
        wt(t, e, 134217728, r);
      }
      ia(e, 134217728);
    }
  }, ns = function(e) {
    if (e.tag === 13) {
      var t = ar(e), r = Rt(e, t);
      if (r !== null) {
        var n = Qe();
        wt(r, e, t, n);
      }
      ia(e, t);
    }
  }, ls = function() {
    return fe;
  }, os = function(e, t) {
    var r = fe;
    try {
      return fe = e, t();
    } finally {
      fe = r;
    }
  }, Co = function(e, t, r) {
    switch (t) {
      case "input":
        if (xo(e, r), t = r.name, r.type === "radio" && t != null) {
          for (r = e; r.parentNode; ) r = r.parentNode;
          for (r = r.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < r.length; t++) {
            var n = r[t];
            if (n !== e && n.form === e.form) {
              var l = Cl(n);
              if (!l) throw Error(u(90));
              _a(n), xo(n, l);
            }
          }
        }
        break;
      case "textarea":
        Ra(e, r);
        break;
      case "select":
        t = r.value, t != null && Rr(e, !!r.multiple, t, !1);
    }
  }, Va = Ji, Ba = Sr;
  var uf = { usingClientEntryPoint: !1, Events: [Tn, Br, Cl, Ha, Ua, Ji] }, Qn = { findFiberByHostInstance: gr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, cf = { bundleType: Qn.bundleType, version: Qn.version, rendererPackageName: Qn.rendererPackageName, rendererConfig: Qn.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: O.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Ga(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Qn.findFiberByHostInstance || af, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var uo = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!uo.isDisabled && uo.supportsFiber) try {
      il = uo.inject(cf), jt = uo;
    } catch {
    }
  }
  return Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = uf, Je.createPortal = function(e, t) {
    var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!sa(t)) throw Error(u(200));
    return of(e, t, null, r);
  }, Je.createRoot = function(e, t) {
    if (!sa(e)) throw Error(u(299));
    var r = !1, n = "", l = kc;
    return t != null && (t.unstable_strictMode === !0 && (r = !0), t.identifierPrefix !== void 0 && (n = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = oa(e, 1, !1, null, null, r, !1, n, l), e[Mt] = t.current, Mn(e.nodeType === 8 ? e.parentNode : e), new aa(t);
  }, Je.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = Ga(t), e = e === null ? null : e.stateNode, e;
  }, Je.flushSync = function(e) {
    return Sr(e);
  }, Je.hydrate = function(e, t, r) {
    if (!ao(t)) throw Error(u(200));
    return so(null, e, t, !0, r);
  }, Je.hydrateRoot = function(e, t, r) {
    if (!sa(e)) throw Error(u(405));
    var n = r != null && r.hydratedSources || null, l = !1, o = "", s = kc;
    if (r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (s = r.onRecoverableError)), t = yc(t, null, e, 1, r ?? null, l, !1, o, s), e[Mt] = t.current, Mn(e), n) for (e = 0; e < n.length; e++) r = n[e], l = r._getVersion, l = l(r._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [r, l] : t.mutableSourceEagerHydrationData.push(
      r,
      l
    );
    return new io(t);
  }, Je.render = function(e, t, r) {
    if (!ao(t)) throw Error(u(200));
    return so(null, e, t, !1, r);
  }, Je.unmountComponentAtNode = function(e) {
    if (!ao(e)) throw Error(u(40));
    return e._reactRootContainer ? (Sr(function() {
      so(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Mt] = null;
      });
    }), !0) : !1;
  }, Je.unstable_batchedUpdates = Ji, Je.unstable_renderSubtreeIntoContainer = function(e, t, r, n) {
    if (!ao(r)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return so(e, t, r, !1, n);
  }, Je.version = "18.3.1-next-f1338f8080-20240426", Je;
}
var Mc;
function Ac() {
  if (Mc) return da.exports;
  Mc = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (c) {
        console.error(c);
      }
  }
  return a(), da.exports = kf(), da.exports;
}
var Pc;
function bf() {
  if (Pc) return co;
  Pc = 1;
  var a = Ac();
  return co.createRoot = a.createRoot, co.hydrateRoot = a.hydrateRoot, co;
}
var it = bf(), ho = Ac();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jf = (a) => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Fc = (...a) => a.filter((c, u, f) => !!c && c.trim() !== "" && f.indexOf(c) === u).join(" ").trim();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Sf = {
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
const Cf = Q.forwardRef(
  ({
    color: a = "currentColor",
    size: c = 24,
    strokeWidth: u = 2,
    absoluteStrokeWidth: f,
    className: g = "",
    children: h,
    iconNode: x,
    ...j
  }, N) => Q.createElement(
    "svg",
    {
      ref: N,
      ...Sf,
      width: c,
      height: c,
      stroke: a,
      strokeWidth: f ? Number(u) * 24 / Number(c) : u,
      className: Fc("lucide", g),
      ...j
    },
    [
      ...x.map(([C, R]) => Q.createElement(C, R)),
      ...Array.isArray(h) ? h : [h]
    ]
  )
);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const re = (a, c) => {
  const u = Q.forwardRef(
    ({ className: f, ...g }, h) => Q.createElement(Cf, {
      ref: h,
      iconNode: c,
      className: Fc(`lucide-${jf(a)}`, f),
      ...g
    })
  );
  return u.displayName = `${a}`, u;
};
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nf = re("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ef = re("ArrowUpDown", [
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
const zf = re("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _f = re("BookCheck", [
  [
    "path",
    {
      d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
      key: "k3hazp"
    }
  ],
  ["path", { d: "m9 9.5 2 2 4-4", key: "1dth82" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mo = re("BookOpen", [
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
const Mf = re("Building2", [
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
const Pf = re("CalendarClock", [
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", key: "1osxxc" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M17.5 17.5 16 16.3V14", key: "akvzfd" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const an = re("CalendarDays", [
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
const Lf = re("CalendarRange", [
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
const Tf = re("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $c = re("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rf = re("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Df = re("CircleDashed", [
  ["path", { d: "M10.1 2.182a10 10 0 0 1 3.8 0", key: "5ilxe3" }],
  ["path", { d: "M13.9 21.818a10 10 0 0 1-3.8 0", key: "11zvb9" }],
  ["path", { d: "M17.609 3.721a10 10 0 0 1 2.69 2.7", key: "1iw5b2" }],
  ["path", { d: "M2.182 13.9a10 10 0 0 1 0-3.8", key: "c0bmvh" }],
  ["path", { d: "M20.279 17.609a10 10 0 0 1-2.7 2.69", key: "1ruxm7" }],
  ["path", { d: "M21.818 10.1a10 10 0 0 1 0 3.8", key: "qkgqxc" }],
  ["path", { d: "M3.721 6.391a10 10 0 0 1 2.7-2.69", key: "1mcia2" }],
  ["path", { d: "M6.391 20.279a10 10 0 0 1-2.69-2.7", key: "1fvljs" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const If = re("CircleDot", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zn = re("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ha = re("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Of = re("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hc = re("Ellipsis", [
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
const Sa = re("ExternalLink", [
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
const ga = re("FileClock", [
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
const Af = re("FileJson", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1", key: "1oajmo" }
  ],
  [
    "path",
    { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1", key: "mpwhp6" }
  ]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ff = re("Gauge", [
  ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $f = re("GitBranch", [
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
const Xn = re("GraduationCap", [
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
const Hf = re("GripVertical", [
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
const Ca = re("Hash", [
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
const xa = re("History", [
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
const Uf = re("Layers", [
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
const Vf = re("LibraryBig", [
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
const Jn = re("MapPin", [
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
const Bf = re("Pin", [
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
const Wf = re("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qf = re("Route", [
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
const Na = re("SearchX", [
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
const Qf = re("Star", [
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
const Gf = re("Target", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const va = re("Trash2", [
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
const Uc = re("TriangleAlert", [
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
const mr = re("UserRound", [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kf = re("UsersRound", [
  ["path", { d: "M18 21a8 8 0 0 0-16 0", key: "3ypg7q" }],
  ["circle", { cx: "10", cy: "8", r: "5", key: "o932ke" }],
  ["path", { d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3", key: "10s06x" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yf = re("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
var Xf = Object.defineProperty, Ea = (a, c) => Xf(a, "name", { value: c, configurable: !0 });
function ya(a, c) {
  if (typeof a == "function")
    return a(c);
  a != null && (a.current = c);
}
Ea(ya, "setRef");
function Vc(...a) {
  return (c) => {
    let u = !1;
    const f = a.map((g) => {
      const h = ya(g, c);
      return !u && typeof h == "function" && (u = !0), h;
    });
    if (u)
      return () => {
        for (let g = 0; g < f.length; g++) {
          const h = f[g];
          typeof h == "function" ? h() : ya(a[g], null);
        }
      };
  };
}
Ea(Vc, "composeRefs");
function Bc(...a) {
  return Q.useCallback(Vc(...a), a);
}
Ea(Bc, "useComposedRefs");
var Zf = Object.defineProperty, bt = (a, c) => Zf(a, "name", { value: c, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Wc(a) {
  const c = Q.forwardRef((u, f) => {
    let { children: g, ...h } = u, x = null, j = !1;
    const N = [];
    wa(g) && typeof po == "function" && (g = po(g._payload)), Q.Children.forEach(g, (I) => {
      var G;
      if (Kc(I)) {
        j = !0;
        const b = I;
        let S = "child" in b.props ? b.props.child : b.props.children;
        wa(S) && typeof po == "function" && (S = po(S._payload)), x = tm(b, S), N.push((G = x == null ? void 0 : x.props) == null ? void 0 : G.children);
      } else
        N.push(I);
    }), x ? x = Q.cloneElement(x, void 0, N) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !j && Q.Children.count(g) === 1 && Q.isValidElement(g) && (x = g)
    );
    const C = x ? Gc(x) : void 0, R = Bc(f, C);
    if (!x) {
      if (g || g === 0)
        throw new Error(
          j ? lm(a) : nm(a)
        );
      return g;
    }
    const B = Qc(h, x.props ?? {});
    return x.type !== Q.Fragment && (B.ref = f ? R : C), Q.cloneElement(x, B);
  });
  return c.displayName = `${a}.Slot`, c;
}
bt(Wc, "createSlot");
var Jf = /* @__PURE__ */ Wc("Slot"), qc = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function em(a) {
  const c = /* @__PURE__ */ bt((u) => "child" in u ? u.children(u.child) : u.children, "Slottable");
  return c.displayName = `${a}.Slottable`, c.__radixId = qc, c;
}
bt(em, "createSlottable");
var tm = /* @__PURE__ */ bt((a, c) => {
  if ("child" in a.props) {
    const u = a.props.child;
    return Q.isValidElement(u) ? Q.cloneElement(u, void 0, a.props.children(u.props.children)) : null;
  }
  return Q.isValidElement(c) ? c : null;
}, "getSlottableElementFromSlottable");
function Qc(a, c) {
  const u = { ...c };
  for (const f in c) {
    const g = a[f], h = c[f];
    /^on[A-Z]/.test(f) ? g && h ? u[f] = (...j) => {
      const N = h(...j);
      return g(...j), N;
    } : g && (u[f] = g) : f === "style" ? u[f] = { ...g, ...h } : f === "className" && (u[f] = [g, h].filter(Boolean).join(" "));
  }
  return { ...a, ...u };
}
bt(Qc, "mergeProps");
function Gc(a) {
  var f, g;
  let c = (f = Object.getOwnPropertyDescriptor(a.props, "ref")) == null ? void 0 : f.get, u = c && "isReactWarning" in c && c.isReactWarning;
  return u ? a.ref : (c = (g = Object.getOwnPropertyDescriptor(a, "ref")) == null ? void 0 : g.get, u = c && "isReactWarning" in c && c.isReactWarning, u ? a.props.ref : a.props.ref || a.ref);
}
bt(Gc, "getElementRef");
function Kc(a) {
  return Q.isValidElement(a) && typeof a.type == "function" && "__radixId" in a.type && a.type.__radixId === qc;
}
bt(Kc, "isSlottable");
var rm = Symbol.for("react.lazy");
function wa(a) {
  return a != null && typeof a == "object" && "$$typeof" in a && a.$$typeof === rm && "_payload" in a && Yc(a._payload);
}
bt(wa, "isLazyComponent");
function Yc(a) {
  return typeof a == "object" && a !== null && "then" in a;
}
bt(Yc, "isPromiseLike");
var nm = /* @__PURE__ */ bt((a) => `${a} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), lm = /* @__PURE__ */ bt((a) => `${a} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), po = vf[" use ".trim().toString()];
function Xc(a) {
  var c, u, f = "";
  if (typeof a == "string" || typeof a == "number") f += a;
  else if (typeof a == "object") if (Array.isArray(a)) {
    var g = a.length;
    for (c = 0; c < g; c++) a[c] && (u = Xc(a[c])) && (f && (f += " "), f += u);
  } else for (u in a) a[u] && (f && (f += " "), f += u);
  return f;
}
function Zc() {
  for (var a, c, u = 0, f = "", g = arguments.length; u < g; u++) (a = arguments[u]) && (c = Xc(a)) && (f && (f += " "), f += c);
  return f;
}
const Lc = (a) => typeof a == "boolean" ? `${a}` : a === 0 ? "0" : a, Tc = Zc, om = (a, c) => (u) => {
  var f;
  if ((c == null ? void 0 : c.variants) == null) return Tc(a, u == null ? void 0 : u.class, u == null ? void 0 : u.className);
  const { variants: g, defaultVariants: h } = c, x = Object.keys(g).map((C) => {
    const R = u == null ? void 0 : u[C], B = h == null ? void 0 : h[C];
    if (R === null) return null;
    const I = Lc(R) || Lc(B);
    return g[C][I];
  }), j = u && Object.entries(u).reduce((C, R) => {
    let [B, I] = R;
    return I === void 0 || (C[B] = I), C;
  }, {}), N = c == null || (f = c.compoundVariants) === null || f === void 0 ? void 0 : f.reduce((C, R) => {
    let { class: B, className: I, ...G } = R;
    return Object.entries(G).every((b) => {
      let [S, M] = b;
      return Array.isArray(M) ? M.includes({
        ...h,
        ...j
      }[S]) : {
        ...h,
        ...j
      }[S] === M;
    }) ? [
      ...C,
      B,
      I
    ] : C;
  }, []);
  return Tc(a, x, N, u == null ? void 0 : u.class, u == null ? void 0 : u.className);
}, za = "-", im = (a) => {
  const c = sm(a), {
    conflictingClassGroups: u,
    conflictingClassGroupModifiers: f
  } = a;
  return {
    getClassGroupId: (x) => {
      const j = x.split(za);
      return j[0] === "" && j.length !== 1 && j.shift(), Jc(j, c) || am(x);
    },
    getConflictingClassGroupIds: (x, j) => {
      const N = u[x] || [];
      return j && f[x] ? [...N, ...f[x]] : N;
    }
  };
}, Jc = (a, c) => {
  var x;
  if (a.length === 0)
    return c.classGroupId;
  const u = a[0], f = c.nextPart.get(u), g = f ? Jc(a.slice(1), f) : void 0;
  if (g)
    return g;
  if (c.validators.length === 0)
    return;
  const h = a.join(za);
  return (x = c.validators.find(({
    validator: j
  }) => j(h))) == null ? void 0 : x.classGroupId;
}, Rc = /^\[(.+)\]$/, am = (a) => {
  if (Rc.test(a)) {
    const c = Rc.exec(a)[1], u = c == null ? void 0 : c.substring(0, c.indexOf(":"));
    if (u)
      return "arbitrary.." + u;
  }
}, sm = (a) => {
  const {
    theme: c,
    prefix: u
  } = a, f = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return cm(Object.entries(a.classGroups), u).forEach(([h, x]) => {
    ka(x, f, h, c);
  }), f;
}, ka = (a, c, u, f) => {
  a.forEach((g) => {
    if (typeof g == "string") {
      const h = g === "" ? c : Dc(c, g);
      h.classGroupId = u;
      return;
    }
    if (typeof g == "function") {
      if (um(g)) {
        ka(g(f), c, u, f);
        return;
      }
      c.validators.push({
        validator: g,
        classGroupId: u
      });
      return;
    }
    Object.entries(g).forEach(([h, x]) => {
      ka(x, Dc(c, h), u, f);
    });
  });
}, Dc = (a, c) => {
  let u = a;
  return c.split(za).forEach((f) => {
    u.nextPart.has(f) || u.nextPart.set(f, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), u = u.nextPart.get(f);
  }), u;
}, um = (a) => a.isThemeGetter, cm = (a, c) => c ? a.map(([u, f]) => {
  const g = f.map((h) => typeof h == "string" ? c + h : typeof h == "object" ? Object.fromEntries(Object.entries(h).map(([x, j]) => [c + x, j])) : h);
  return [u, g];
}) : a, dm = (a) => {
  if (a < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let c = 0, u = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
  const g = (h, x) => {
    u.set(h, x), c++, c > a && (c = 0, f = u, u = /* @__PURE__ */ new Map());
  };
  return {
    get(h) {
      let x = u.get(h);
      if (x !== void 0)
        return x;
      if ((x = f.get(h)) !== void 0)
        return g(h, x), x;
    },
    set(h, x) {
      u.has(h) ? u.set(h, x) : g(h, x);
    }
  };
}, ed = "!", pm = (a) => {
  const {
    separator: c,
    experimentalParseClassName: u
  } = a, f = c.length === 1, g = c[0], h = c.length, x = (j) => {
    const N = [];
    let C = 0, R = 0, B;
    for (let M = 0; M < j.length; M++) {
      let V = j[M];
      if (C === 0) {
        if (V === g && (f || j.slice(M, M + h) === c)) {
          N.push(j.slice(R, M)), R = M + h;
          continue;
        }
        if (V === "/") {
          B = M;
          continue;
        }
      }
      V === "[" ? C++ : V === "]" && C--;
    }
    const I = N.length === 0 ? j : j.substring(R), G = I.startsWith(ed), b = G ? I.substring(1) : I, S = B && B > R ? B - R : void 0;
    return {
      modifiers: N,
      hasImportantModifier: G,
      baseClassName: b,
      maybePostfixModifierPosition: S
    };
  };
  return u ? (j) => u({
    className: j,
    parseClassName: x
  }) : x;
}, fm = (a) => {
  if (a.length <= 1)
    return a;
  const c = [];
  let u = [];
  return a.forEach((f) => {
    f[0] === "[" ? (c.push(...u.sort(), f), u = []) : u.push(f);
  }), c.push(...u.sort()), c;
}, mm = (a) => ({
  cache: dm(a.cacheSize),
  parseClassName: pm(a),
  ...im(a)
}), hm = /\s+/, gm = (a, c) => {
  const {
    parseClassName: u,
    getClassGroupId: f,
    getConflictingClassGroupIds: g
  } = c, h = [], x = a.trim().split(hm);
  let j = "";
  for (let N = x.length - 1; N >= 0; N -= 1) {
    const C = x[N], {
      modifiers: R,
      hasImportantModifier: B,
      baseClassName: I,
      maybePostfixModifierPosition: G
    } = u(C);
    let b = !!G, S = f(b ? I.substring(0, G) : I);
    if (!S) {
      if (!b) {
        j = C + (j.length > 0 ? " " + j : j);
        continue;
      }
      if (S = f(I), !S) {
        j = C + (j.length > 0 ? " " + j : j);
        continue;
      }
      b = !1;
    }
    const M = fm(R).join(":"), V = B ? M + ed : M, q = V + S;
    if (h.includes(q))
      continue;
    h.push(q);
    const T = g(S, b);
    for (let O = 0; O < T.length; ++O) {
      const ee = T[O];
      h.push(V + ee);
    }
    j = C + (j.length > 0 ? " " + j : j);
  }
  return j;
};
function xm() {
  let a = 0, c, u, f = "";
  for (; a < arguments.length; )
    (c = arguments[a++]) && (u = td(c)) && (f && (f += " "), f += u);
  return f;
}
const td = (a) => {
  if (typeof a == "string")
    return a;
  let c, u = "";
  for (let f = 0; f < a.length; f++)
    a[f] && (c = td(a[f])) && (u && (u += " "), u += c);
  return u;
};
function vm(a, ...c) {
  let u, f, g, h = x;
  function x(N) {
    const C = c.reduce((R, B) => B(R), a());
    return u = mm(C), f = u.cache.get, g = u.cache.set, h = j, j(N);
  }
  function j(N) {
    const C = f(N);
    if (C)
      return C;
    const R = gm(N, u);
    return g(N, R), R;
  }
  return function() {
    return h(xm.apply(null, arguments));
  };
}
const we = (a) => {
  const c = (u) => u[a] || [];
  return c.isThemeGetter = !0, c;
}, rd = /^\[(?:([a-z-]+):)?(.+)\]$/i, ym = /^\d+\/\d+$/, wm = /* @__PURE__ */ new Set(["px", "full", "screen"]), km = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, bm = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, jm = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Sm = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Cm = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, At = (a) => on(a) || wm.has(a) || ym.test(a), dr = (a) => sn(a, "length", Tm), on = (a) => !!a && !Number.isNaN(Number(a)), ma = (a) => sn(a, "number", on), Kn = (a) => !!a && Number.isInteger(Number(a)), Nm = (a) => a.endsWith("%") && on(a.slice(0, -1)), te = (a) => rd.test(a), pr = (a) => km.test(a), Em = /* @__PURE__ */ new Set(["length", "size", "percentage"]), zm = (a) => sn(a, Em, nd), _m = (a) => sn(a, "position", nd), Mm = /* @__PURE__ */ new Set(["image", "url"]), Pm = (a) => sn(a, Mm, Dm), Lm = (a) => sn(a, "", Rm), Yn = () => !0, sn = (a, c, u) => {
  const f = rd.exec(a);
  return f ? f[1] ? typeof c == "string" ? f[1] === c : c.has(f[1]) : u(f[2]) : !1;
}, Tm = (a) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  bm.test(a) && !jm.test(a)
), nd = () => !1, Rm = (a) => Sm.test(a), Dm = (a) => Cm.test(a), Im = () => {
  const a = we("colors"), c = we("spacing"), u = we("blur"), f = we("brightness"), g = we("borderColor"), h = we("borderRadius"), x = we("borderSpacing"), j = we("borderWidth"), N = we("contrast"), C = we("grayscale"), R = we("hueRotate"), B = we("invert"), I = we("gap"), G = we("gradientColorStops"), b = we("gradientColorStopPositions"), S = we("inset"), M = we("margin"), V = we("opacity"), q = we("padding"), T = we("saturate"), O = we("scale"), ee = we("sepia"), Y = we("skew"), ae = we("space"), me = we("translate"), _e = () => ["auto", "contain", "none"], Fe = () => ["auto", "hidden", "clip", "visible", "scroll"], Ie = () => ["auto", te, c], ie = () => [te, c], $e = () => ["", At, dr], He = () => ["auto", on, te], et = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Me = () => ["solid", "dashed", "dotted", "double", "none"], xe = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], D = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], K = () => ["", "0", te], F = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], v = () => [on, te];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Yn],
      spacing: [At, dr],
      blur: ["none", "", pr, te],
      brightness: v(),
      borderColor: [a],
      borderRadius: ["none", "", "full", pr, te],
      borderSpacing: ie(),
      borderWidth: $e(),
      contrast: v(),
      grayscale: K(),
      hueRotate: v(),
      invert: K(),
      gap: ie(),
      gradientColorStops: [a],
      gradientColorStopPositions: [Nm, dr],
      inset: Ie(),
      margin: Ie(),
      opacity: v(),
      padding: ie(),
      saturate: v(),
      scale: v(),
      sepia: K(),
      skew: v(),
      space: ie(),
      translate: ie()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", te]
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
        columns: [pr]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": F()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": F()
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
        object: [...et(), te]
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
        inset: [S]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [S]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [S]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [S]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [S]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [S]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [S]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [S]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [S]
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
        z: ["auto", Kn, te]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: Ie()
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
        flex: ["1", "auto", "initial", "none", te]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: K()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: K()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", Kn, te]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Yn]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Kn, te]
        }, te]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": He()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": He()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [Yn]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Kn, te]
        }, te]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": He()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": He()
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
        "auto-cols": ["auto", "min", "max", "fr", te]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", te]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [I]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [I]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [I]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...D()]
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
        content: ["normal", ...D(), "baseline"]
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
        "place-content": [...D(), "baseline"]
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
        p: [q]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [q]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [q]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [q]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [q]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [q]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [q]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [q]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [q]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [M]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [M]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [M]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [M]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [M]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [M]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [M]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [M]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [M]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [ae]
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
        "space-y": [ae]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", te, c]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [te, c, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [te, c, "none", "full", "min", "max", "fit", "prose", {
          screen: [pr]
        }, pr]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [te, c, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [te, c, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [te, c, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [te, c, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", pr, dr]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", ma]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Yn]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", te]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", on, ma]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", At, te]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", te]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", te]
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
        placeholder: [a]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [V]
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
        text: [a]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [V]
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
        decoration: ["auto", "from-font", At, dr]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", At, te]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [a]
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
        indent: ie()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", te]
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
        content: ["none", te]
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
        "bg-opacity": [V]
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
        bg: [...et(), _m]
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
        bg: ["auto", "cover", "contain", zm]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Pm]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [a]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [b]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [b]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [b]
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
        rounded: [h]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [h]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [h]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [h]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [h]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [h]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [h]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [h]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [h]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [h]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [h]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [h]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [h]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [h]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [h]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [j]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [j]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [j]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [j]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [j]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [j]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [j]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [j]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [j]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [V]
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
        "divide-x": [j]
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
        "divide-y": [j]
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
        "divide-opacity": [V]
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
        border: [g]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [g]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [g]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [g]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [g]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [g]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [g]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [g]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [g]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [g]
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
        "outline-offset": [At, te]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [At, dr]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [a]
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
        ring: [a]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [V]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [At, dr]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [a]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", pr, Lm]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Yn]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [V]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...xe(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": xe()
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
        brightness: [f]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [N]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", pr, te]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [C]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [R]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [B]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [T]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [ee]
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
        "backdrop-brightness": [f]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [N]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [C]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [R]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [B]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [V]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [T]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [ee]
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
        "border-spacing": [x]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [x]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [x]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", te]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: v()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", te]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: v()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", te]
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
        scale: [O]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [O]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [O]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [Kn, te]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [me]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [me]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [Y]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [Y]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", te]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", a]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", te]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [a]
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
        "scroll-m": ie()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": ie()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": ie()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": ie()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": ie()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": ie()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": ie()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": ie()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": ie()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": ie()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": ie()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": ie()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": ie()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": ie()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": ie()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": ie()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": ie()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": ie()
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
        "will-change": ["auto", "scroll", "contents", "transform", te]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [a, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [At, dr, ma]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [a, "none"]
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
}, Om = /* @__PURE__ */ vm(Im);
function Tr(...a) {
  return Om(Zc(a));
}
const Am = om(
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
), ld = Q.forwardRef(
  ({ className: a, variant: c, size: u, asChild: f = !1, ...g }, h) => {
    const x = f ? Jf : "button";
    return /* @__PURE__ */ i.jsx(x, { className: Tr(Am({ variant: c, size: u, className: a })), ref: h, ...g });
  }
);
ld.displayName = "Button";
const od = Q.forwardRef(
  ({ className: a, ...c }, u) => /* @__PURE__ */ i.jsx("div", { className: "dt-relative dt-w-full dt-overflow-auto", children: /* @__PURE__ */ i.jsx("table", { ref: u, className: Tr("dt-w-full dt-caption-bottom dt-text-sm", a), ...c }) })
);
od.displayName = "Table";
const id = Q.forwardRef(({ className: a, ...c }, u) => /* @__PURE__ */ i.jsx("thead", { ref: u, className: Tr("[&_tr]:dt-border-b", a), ...c }));
id.displayName = "TableHeader";
const ad = Q.forwardRef(({ className: a, ...c }, u) => /* @__PURE__ */ i.jsx("tbody", { ref: u, className: Tr("[&_tr:last-child]:dt-border-0", a), ...c }));
ad.displayName = "TableBody";
const ba = Q.forwardRef(
  ({ className: a, ...c }, u) => /* @__PURE__ */ i.jsx(
    "tr",
    {
      ref: u,
      className: Tr(
        "dt-border-b dt-transition-colors hover:dt-bg-muted/50 data-[state=selected]:dt-bg-muted",
        a
      ),
      ...c
    }
  )
);
ba.displayName = "TableRow";
const zt = Q.forwardRef(({ className: a, ...c }, u) => /* @__PURE__ */ i.jsx(
  "th",
  {
    ref: u,
    className: Tr(
      "dt-h-12 dt-px-4 dt-text-left dt-align-middle dt-font-medium dt-text-muted-foreground [&:has([role=checkbox])]:dt-pr-0",
      a
    ),
    ...c
  }
));
zt.displayName = "TableHead";
const _t = Q.forwardRef(({ className: a, ...c }, u) => /* @__PURE__ */ i.jsx(
  "td",
  {
    ref: u,
    className: Tr("dt-p-4 dt-align-middle [&:has([role=checkbox])]:dt-pr-0", a),
    ...c
  }
));
_t.displayName = "TableCell";
function Ic(a) {
  return a ? a.split(" | ").map((c) => c.replace("/", "-")) : ["·"];
}
function Fm({
  label: a,
  active: c,
  dir: u,
  onClick: f
}) {
  const g = c ? u === 1 ? zf : Nf : Ef;
  return /* @__PURE__ */ i.jsxs(ld, { variant: "ghost", size: "sm", onClick: f, className: "th-sort dt--ml-3", children: [
    a,
    /* @__PURE__ */ i.jsx(g, { className: `dt-ml-1.5 dt-inline dt-size-3.5${c ? "" : " dt-opacity-40"}` })
  ] });
}
function sd(a) {
  const { rows: c, sortKey: u, sortDir: f, onSortChange: g, onRowClick: h, onToggleSelect: x, onToggleFavorite: j, allSelected: N, onSelectAll: C, emptyMessage: R, ariaLabel: B, labels: I } = a;
  if (!c.length)
    return /* @__PURE__ */ i.jsx("p", { className: "dt-p-6 dt-text-center dt-text-sm dt-text-muted-foreground", children: R });
  const G = (b, S) => /* @__PURE__ */ i.jsx(Fm, { label: S, active: u === b, dir: f, onClick: () => g(b) });
  return /* @__PURE__ */ i.jsx("div", { id: "results", className: "dersler-table-root dt-overflow-hidden dt-rounded-lg dt-border dt-border-border", children: /* @__PURE__ */ i.jsxs(od, { "aria-label": B, children: [
    /* @__PURE__ */ i.jsx(id, { children: /* @__PURE__ */ i.jsxs(ba, { children: [
      /* @__PURE__ */ i.jsx(zt, { className: "dt-h-9 dt-w-8 dt-p-2", children: /* @__PURE__ */ i.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: N,
          "aria-label": I.selectAll,
          onChange: (b) => C(b.target.checked)
        }
      ) }),
      /* @__PURE__ */ i.jsx(zt, { className: "dt-h-9 dt-w-8 dt-p-2" }),
      /* @__PURE__ */ i.jsx(zt, { className: "dt-h-9 dt-p-2", "data-sort": "crn", "aria-sort": u === "crn" ? f === 1 ? "ascending" : "descending" : "none", children: G("crn", I.crn) }),
      /* @__PURE__ */ i.jsx(zt, { className: "dt-h-9 dt-p-2", "data-sort": "code", "aria-sort": u === "code" ? f === 1 ? "ascending" : "descending" : "none", children: G("code", I.code) }),
      /* @__PURE__ */ i.jsx(zt, { className: "dt-h-9 dt-p-2", "data-sort": "name", "aria-sort": u === "name" ? f === 1 ? "ascending" : "descending" : "none", children: G("name", I.name) }),
      /* @__PURE__ */ i.jsx(zt, { className: "dt-h-9 dt-p-2", "data-sort": "instructor", "aria-sort": u === "instructor" ? f === 1 ? "ascending" : "descending" : "none", children: G("instructor", I.instructor) }),
      /* @__PURE__ */ i.jsx(zt, { className: "dt-h-9 dt-p-2", "data-sort": "when", "aria-sort": u === "when" ? f === 1 ? "ascending" : "descending" : "none", children: G("when", I.when) }),
      /* @__PURE__ */ i.jsx(zt, { className: "dt-h-9 dt-p-2", children: I.where }),
      /* @__PURE__ */ i.jsx(zt, { className: "dt-h-9 dt-p-2 dt-text-right", "data-sort": "fill", "aria-sort": u === "fill" ? f === 1 ? "ascending" : "descending" : "none", children: G("fill", I.fill) })
    ] }) }),
    /* @__PURE__ */ i.jsx(ad, { id: "rows", children: c.map((b, S) => /* @__PURE__ */ i.jsxs(
      ba,
      {
        className: "dt-cursor-pointer stagger-in",
        style: { animationDelay: `${Math.min(S * 20, 320)}ms` },
        onClick: () => h(b.key),
        children: [
          /* @__PURE__ */ i.jsx(_t, { className: "dt-p-2", onClick: (M) => M.stopPropagation(), children: /* @__PURE__ */ i.jsx(
            "input",
            {
              type: "checkbox",
              className: "dt-size-4",
              checked: b.selected,
              "aria-label": I.selectSection,
              onChange: (M) => x(b.key, M.target.checked)
            }
          ) }),
          /* @__PURE__ */ i.jsx(_t, { className: "dt-p-2", onClick: (M) => M.stopPropagation(), children: /* @__PURE__ */ i.jsx(
            "button",
            {
              type: "button",
              className: "dt-text-base dt-leading-none",
              "aria-label": b.favorite ? I.removeFav : I.addFav,
              "aria-pressed": b.favorite,
              onClick: () => j(b.key),
              children: /* @__PURE__ */ i.jsx(Qf, { "aria-hidden": "true", className: "dt-size-4", fill: b.favorite ? "currentColor" : "none" })
            }
          ) }),
          /* @__PURE__ */ i.jsx(_t, { className: "dt-p-2 dt-font-mono dt-text-muted-foreground", dangerouslySetInnerHTML: { __html: b.crnHTML } }),
          /* @__PURE__ */ i.jsx(_t, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: b.codeHTML } }),
          /* @__PURE__ */ i.jsx(_t, { className: "dt-p-2", children: /* @__PURE__ */ i.jsxs("div", { className: "dt-course-name", children: [
            /* @__PURE__ */ i.jsx("span", { dangerouslySetInnerHTML: { __html: b.nameHTML } }),
            b.kind && /* @__PURE__ */ i.jsxs("span", { className: `dt-kind-badge ${b.kind}`, title: b.kindHelp, children: [
              b.kind === "extra-exam" ? /* @__PURE__ */ i.jsx(ga, { "aria-hidden": "true" }) : /* @__PURE__ */ i.jsx(Xn, { "aria-hidden": "true" }),
              /* @__PURE__ */ i.jsx("b", { children: b.kindLabel })
            ] })
          ] }) }),
          /* @__PURE__ */ i.jsx(_t, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: b.instructorHTML } }),
          /* @__PURE__ */ i.jsx(_t, { className: "dt-p-2 dt-font-mono dt-text-xs", children: Ic(b.when).map((M, V) => /* @__PURE__ */ i.jsx("div", { children: M }, V)) }),
          /* @__PURE__ */ i.jsx(_t, { className: "dt-p-2 dt-text-xs dt-text-muted-foreground", children: b.where ? Ic(b.where).map((M, V) => /* @__PURE__ */ i.jsx("div", { children: M }, V)) : "·" }),
          /* @__PURE__ */ i.jsx(_t, { className: "dt-p-2 dt-text-right dt-tabular-nums quota-main-col", dangerouslySetInnerHTML: { __html: b.quotaHTML } })
        ]
      },
      b.key
    )) })
  ] }) });
}
const Lr = (a) => `${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
function ud(a) {
  const c = [...a].sort((h, x) => h.start - x.start || h.end - x.end), u = [], f = c.map((h) => {
    let x = u.findIndex((j) => j <= h.start);
    return x < 0 ? (x = u.length, u.push(h.end)) : u[x] = h.end, { ...h, lane: x, laneCount: 1, conflict: !1 };
  }), g = Math.max(1, u.length);
  return f.map((h) => ({
    ...h,
    laneCount: g,
    conflict: f.some((x) => x.key !== h.key && h.start < x.end && x.start < h.end)
  }));
}
function $m() {
  const a = "(max-width: 600px)", [c, u] = Q.useState(() => window.matchMedia(a).matches);
  return Q.useEffect(() => {
    const f = window.matchMedia(a), g = () => u(f.matches);
    return f.addEventListener("change", g), () => f.removeEventListener("change", g);
  }, []), c;
}
function cd({ session: a, compact: c = !1 }) {
  return /* @__PURE__ */ i.jsxs("span", { className: "pp-session-meta", children: [
    /* @__PURE__ */ i.jsxs("span", { children: [
      /* @__PURE__ */ i.jsx(Zn, { "aria-hidden": "true" }),
      Lr(a.start),
      "–",
      Lr(a.end)
    ] }),
    /* @__PURE__ */ i.jsxs("span", { children: [
      /* @__PURE__ */ i.jsx(Ca, { "aria-hidden": "true" }),
      a.crn
    ] }),
    !c && a.instructor && /* @__PURE__ */ i.jsxs("span", { children: [
      /* @__PURE__ */ i.jsx(mr, { "aria-hidden": "true" }),
      a.instructor
    ] }),
    !c && a.where && /* @__PURE__ */ i.jsxs("span", { children: [
      /* @__PURE__ */ i.jsx(Jn, { "aria-hidden": "true" }),
      a.where
    ] })
  ] });
}
function Hm({ props: a, visibleDays: c }) {
  const u = c.find((x) => a.sessions.some((j) => j.day === x)) ?? c[0], [f, g] = Q.useState(u);
  Q.useEffect(() => {
    c.includes(f) || g(u);
  }, [f, u, c]);
  const h = ud(a.sessions.filter((x) => x.day === f));
  return /* @__PURE__ */ i.jsxs("div", { className: "pp-agenda", children: [
    /* @__PURE__ */ i.jsx("div", { className: "pp-day-tabs tt-daytabs", role: "tablist", "aria-label": a.labels.title, style: { "--pp-days": c.length }, children: c.map((x) => /* @__PURE__ */ i.jsxs("button", { type: "button", role: "tab", "aria-selected": f === x, className: f === x ? "is-active active tt-daytab" : "tt-daytab", onClick: () => g(x), children: [
      a.dayLabels[x],
      a.sessions.some((j) => j.day === x) && /* @__PURE__ */ i.jsx("span", { "aria-hidden": "true" })
    ] }, x)) }),
    /* @__PURE__ */ i.jsx("div", { className: "pp-agenda-list", children: h.length ? h.map((x) => /* @__PURE__ */ i.jsxs(
      "button",
      {
        type: "button",
        className: `pp-agenda-card p-agenda-session${x.conflict ? " is-conflict" : ""}`,
        style: { "--pp-color": x.color },
        onClick: () => a.onOpen(x.rowKey),
        children: [
          /* @__PURE__ */ i.jsxs("span", { className: "pp-agenda-time", children: [
            /* @__PURE__ */ i.jsx("b", { children: Lr(x.start) }),
            /* @__PURE__ */ i.jsx("small", { children: Lr(x.end) })
          ] }),
          /* @__PURE__ */ i.jsxs("span", { className: "pp-agenda-copy", children: [
            /* @__PURE__ */ i.jsxs("strong", { children: [
              /* @__PURE__ */ i.jsx("span", { className: "pp-color-dot" }),
              x.code
            ] }),
            /* @__PURE__ */ i.jsx("span", { className: "pp-agenda-name", children: x.name }),
            /* @__PURE__ */ i.jsx(cd, { session: x, compact: !0 }),
            x.instructor && /* @__PURE__ */ i.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ i.jsx(mr, { "aria-hidden": "true" }),
              x.instructor
            ] }),
            x.where && /* @__PURE__ */ i.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ i.jsx(Jn, { "aria-hidden": "true" }),
              x.where
            ] }),
            x.conflict && /* @__PURE__ */ i.jsxs("em", { children: [
              /* @__PURE__ */ i.jsx(Uc, { "aria-hidden": "true" }),
              a.labels.conflict
            ] })
          ] })
        ]
      },
      x.key
    )) : /* @__PURE__ */ i.jsxs("div", { className: "pp-empty-day", children: [
      /* @__PURE__ */ i.jsx(an, { "aria-hidden": "true" }),
      /* @__PURE__ */ i.jsx("p", { children: a.labels.emptyDay })
    ] }) })
  ] });
}
function dd(a) {
  const c = $m(), [u, f] = Q.useState(null), [g, h] = Q.useState(null), x = a.sessions.some((T) => T.day >= 5), j = a.showWeekend || x ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4], N = a.sessions.length > 0, C = Q.useMemo(() => {
    if (!N) return { start: 480, end: 1080 };
    const T = Math.min(...a.sessions.map((ee) => ee.start)), O = Math.max(...a.sessions.map((ee) => ee.end));
    return a.showFullDay ? { start: 420, end: 1380 } : { start: Math.min(510, T), end: Math.min(1440, O + 60) };
  }, [a.sessions, a.showFullDay, N]), R = 34, B = Math.max(1, Math.ceil((C.end - C.start) / 30)), I = B * R, G = /* @__PURE__ */ new Date(), b = (G.getDay() + 6) % 7, S = G.getHours() * 60 + G.getMinutes(), M = (S - C.start) / 30 * R;
  Q.useEffect(() => {
    if (!u) return;
    const T = () => f(null);
    return window.addEventListener("pointerdown", T, { once: !0 }), window.addEventListener("blur", T, { once: !0 }), () => {
      window.removeEventListener("pointerdown", T), window.removeEventListener("blur", T);
    };
  }, [u]);
  const V = (T, O) => {
    T.preventDefault(), T.stopPropagation(), f({ session: O, x: Math.min(T.clientX, window.innerWidth - 232), y: Math.min(T.clientY, window.innerHeight - 230) });
  }, q = (T, O) => {
    const ee = T.getBoundingClientRect(), Y = 286, ae = Math.max(10, Math.min(ee.left + ee.width / 2 - Y / 2, window.innerWidth - Y - 10)), me = ee.top < 190;
    h({ session: O, x: ae, y: me ? ee.bottom + 9 : ee.top - 9, side: me ? "bottom" : "top" });
  };
  return /* @__PURE__ */ i.jsxs("section", { className: "dersler-table-root program-planner-root", "aria-label": a.labels.title, children: [
    /* @__PURE__ */ i.jsxs("header", { className: "pp-heading", children: [
      /* @__PURE__ */ i.jsx("span", { className: "pp-heading-icon", children: /* @__PURE__ */ i.jsx(an, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ i.jsxs("span", { children: [
        /* @__PURE__ */ i.jsx("strong", { children: a.labels.title }),
        /* @__PURE__ */ i.jsxs("small", { children: [
          a.sessions.length,
          " ",
          a.labels.sessions,
          " · ",
          a.sectionCount,
          " ",
          a.labels.sections
        ] })
      ] })
    ] }),
    !N && !a.untimed.length ? /* @__PURE__ */ i.jsxs("div", { className: "pp-empty", children: [
      /* @__PURE__ */ i.jsx(Na, { "aria-hidden": "true" }),
      /* @__PURE__ */ i.jsx("strong", { children: a.labels.empty })
    ] }) : c && !a.forceGrid ? /* @__PURE__ */ i.jsx(Hm, { props: a, visibleDays: j }) : N ? /* @__PURE__ */ i.jsx("div", { className: "pp-calendar-scroll", children: /* @__PURE__ */ i.jsxs("div", { className: "pp-calendar", style: { "--pp-days": j.length }, children: [
      /* @__PURE__ */ i.jsxs("div", { className: "pp-calendar-head", children: [
        /* @__PURE__ */ i.jsx("span", {}),
        j.map((T) => /* @__PURE__ */ i.jsx("b", { children: a.dayLabels[T] }, T))
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "pp-calendar-body", children: [
        /* @__PURE__ */ i.jsx("div", { className: "pp-time-column", style: { height: I }, children: Array.from({ length: B }, (T, O) => /* @__PURE__ */ i.jsx("span", { children: Lr(C.start + O * 30) }, O)) }),
        j.map((T) => {
          const O = ud(a.sessions.filter((Y) => Y.day === T)), ee = a.showNow && T === b && S >= C.start && S < C.end;
          return /* @__PURE__ */ i.jsxs("div", { className: `pp-day-column${T >= 5 ? " is-weekend" : ""}`, style: { height: I }, children: [
            ee && /* @__PURE__ */ i.jsx("span", { className: "pp-now", style: { top: M } }),
            O.map((Y) => {
              const ae = (Y.start - C.start) / 30 * R, me = Math.max(30, (Y.end - Y.start) / 30 * R), _e = 100 / Y.laneCount, Fe = me < 104;
              return /* @__PURE__ */ i.jsxs(
                "button",
                {
                  type: "button",
                  className: `pp-session tt-block${Fe ? " is-short" : ""}${Y.conflict ? " is-conflict" : ""}`,
                  style: {
                    top: ae,
                    height: me,
                    left: `calc(${Y.lane * _e}% + 3px)`,
                    width: `calc(${_e}% - 6px)`,
                    "--pp-color": Y.color,
                    "--pp-foreground": Y.foreground
                  },
                  "aria-describedby": (g == null ? void 0 : g.session.key) === Y.key ? "pp-course-tooltip" : void 0,
                  onClick: () => a.onOpen(Y.rowKey),
                  onContextMenu: (Ie) => V(Ie, Y),
                  onMouseEnter: (Ie) => q(Ie.currentTarget, Y),
                  onMouseLeave: () => h(null),
                  onFocus: (Ie) => q(Ie.currentTarget, Y),
                  onBlur: () => h(null),
                  children: [
                    /* @__PURE__ */ i.jsx(Bf, { className: "pp-pin", "aria-hidden": "true" }),
                    /* @__PURE__ */ i.jsxs("strong", { children: [
                      Y.code,
                      ": ",
                      /* @__PURE__ */ i.jsx("span", { children: Y.name })
                    ] }),
                    /* @__PURE__ */ i.jsx(cd, { session: Y, compact: Fe }),
                    Y.conflict && /* @__PURE__ */ i.jsxs("span", { className: "pp-conflict", children: [
                      /* @__PURE__ */ i.jsx(Uc, { "aria-hidden": "true" }),
                      a.labels.conflict
                    ] }),
                    /* @__PURE__ */ i.jsx(Hc, { className: "pp-more", "aria-hidden": "true" })
                  ]
                },
                Y.key
              );
            })
          ] }, T);
        })
      ] })
    ] }) }) : null,
    !!a.untimed.length && /* @__PURE__ */ i.jsxs("div", { className: "pp-untimed", children: [
      /* @__PURE__ */ i.jsx(Xn, { "aria-hidden": "true" }),
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("strong", { children: a.untimed.some((T) => T.special) ? a.labels.special : a.labels.unknown }),
        a.untimed.map((T) => /* @__PURE__ */ i.jsxs("span", { children: [
          /* @__PURE__ */ i.jsx("b", { children: T.code }),
          " · CRN ",
          T.crn,
          " — ",
          T.detail
        ] }, T.key))
      ] })
    ] }),
    u && /* @__PURE__ */ i.jsxs("div", { className: "pp-context tt-context-menu", role: "menu", "aria-label": `${u.session.code} ${a.labels.actions}`, style: { left: u.x, top: u.y }, onPointerDown: (T) => T.stopPropagation(), children: [
      /* @__PURE__ */ i.jsxs("p", { children: [
        /* @__PURE__ */ i.jsx("strong", { children: u.session.code }),
        /* @__PURE__ */ i.jsxs("span", { children: [
          "CRN ",
          u.session.crn
        ] })
      ] }),
      /* @__PURE__ */ i.jsxs("button", { type: "button", role: "menuitem", "data-act": "open", onClick: () => {
        a.onOpen(u.session.rowKey), f(null);
      }, children: [
        /* @__PURE__ */ i.jsx(an, {}),
        a.labels.details
      ] }),
      /* @__PURE__ */ i.jsxs("button", { type: "button", role: "menuitem", "data-act": "copy-crn", onClick: () => {
        a.onCopyCrn(u.session.rowKey), f(null);
      }, children: [
        /* @__PURE__ */ i.jsx(ha, {}),
        a.labels.copyCrn
      ] }),
      /* @__PURE__ */ i.jsxs("button", { type: "button", role: "menuitem", "data-act": "open-obs", onClick: () => {
        a.onOpenObs(u.session.rowKey), f(null);
      }, children: [
        /* @__PURE__ */ i.jsx(Sa, {}),
        a.labels.openObs
      ] }),
      /* @__PURE__ */ i.jsxs("button", { type: "button", role: "menuitem", "data-act": "remove", className: "is-danger", onClick: () => {
        a.onRemove(u.session.rowKey), f(null);
      }, children: [
        /* @__PURE__ */ i.jsx(va, {}),
        a.labels.remove
      ] })
    ] }),
    g && /* @__PURE__ */ i.jsxs("div", { id: "pp-course-tooltip", className: "pp-tooltip", role: "tooltip", style: { left: g.x, top: g.y }, "data-side": g.side, children: [
      /* @__PURE__ */ i.jsxs("div", { className: "pp-tooltip-title", children: [
        /* @__PURE__ */ i.jsx("span", { style: { background: g.session.color } }),
        /* @__PURE__ */ i.jsx("strong", { children: g.session.code }),
        /* @__PURE__ */ i.jsxs("b", { children: [
          Lr(g.session.start),
          "–",
          Lr(g.session.end)
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("p", { children: g.session.name }),
      /* @__PURE__ */ i.jsxs("dl", { children: [
        /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx("dt", { children: /* @__PURE__ */ i.jsx(Ca, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ i.jsx("dd", { children: g.session.crn })
        ] }),
        g.session.instructor && /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx("dt", { children: /* @__PURE__ */ i.jsx(mr, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ i.jsx("dd", { children: g.session.instructor })
        ] }),
        g.session.where && /* @__PURE__ */ i.jsxs("div", { children: [
          /* @__PURE__ */ i.jsx("dt", { children: /* @__PURE__ */ i.jsx(Jn, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ i.jsx("dd", { children: g.session.where })
        ] })
      ] }),
      /* @__PURE__ */ i.jsxs("small", { children: [
        a.labels.details,
        " · sağ tık: ",
        a.labels.actions
      ] })
    ] })
  ] });
}
function pd({ html: a, empty: c, emptyMessage: u, ariaLabel: f }) {
  const g = Q.useRef(null), h = Q.useRef(null), x = Q.useRef(null), [j, N] = Q.useState(null);
  Q.useLayoutEffect(() => {
    const b = g.current;
    if (!b) return;
    [...b.querySelectorAll("select.dp-grade")].forEach((M, V) => {
      var O, ee;
      M.hidden = !0, M.tabIndex = -1;
      const q = document.createElement("button");
      q.type = "button", q.className = `cp-grade-trigger${M.value ? " filled" : ""}`, q.dataset.gradeIndex = String(V), q.setAttribute("aria-haspopup", "listbox"), q.setAttribute("aria-expanded", "false"), q.setAttribute("aria-label", M.getAttribute("aria-label") || "Not seç");
      const T = document.createElement("span");
      T.textContent = ((O = M.selectedOptions[0]) == null ? void 0 : O.textContent) || ((ee = M.options[0]) == null ? void 0 : ee.textContent) || "—", q.appendChild(T), q.insertAdjacentHTML("beforeend", '<svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'), M.insertAdjacentElement("afterend", q);
    });
  }, [a]), Q.useEffect(() => N(null), [a]), Q.useEffect(() => {
    if (!j) return;
    const b = (O) => {
      var Y, ae;
      const ee = O.target;
      (Y = x.current) != null && Y.contains(ee) || (ae = h.current) != null && ae.contains(ee) || N(null);
    }, S = () => N(null);
    window.addEventListener("pointerdown", b);
    const M = window.matchMedia("(min-width: 561px)").matches;
    let V = !1, q = !1;
    const T = requestAnimationFrame(() => {
      M && (window.addEventListener("scroll", S, !0), V = !0), window.addEventListener("resize", S), q = !0;
    });
    return j.keyboard && requestAnimationFrame(() => {
      var O, ee;
      return (ee = (O = x.current) == null ? void 0 : O.querySelector('[aria-selected="true"]')) == null ? void 0 : ee.focus({ preventScroll: !0 });
    }), () => {
      cancelAnimationFrame(T), window.removeEventListener("pointerdown", b), V && window.removeEventListener("scroll", S, !0), q && window.removeEventListener("resize", S);
    };
  }, [j]);
  const C = (b, S = !1) => {
    var ae, me;
    const M = Number(b.dataset.gradeIndex), V = (ae = g.current) == null ? void 0 : ae.querySelectorAll("select.dp-grade")[M];
    if (!V) return;
    const q = b.getBoundingClientRect(), T = 246, O = window.innerHeight - q.bottom < T && q.top > T, ee = Math.min(292, window.innerWidth - 20), Y = Math.max(10, Math.min(q.right - ee, window.innerWidth - ee - 10));
    (me = h.current) == null || me.setAttribute("aria-expanded", "false"), h.current = b, b.setAttribute("aria-expanded", "true"), console.log("[dbg] setMenu called", M), N({
      selectIndex: M,
      options: [...V.options].map((_e) => ({ value: _e.value, label: _e.textContent || _e.value })),
      value: V.value,
      label: V.getAttribute("aria-label") || "Not seç",
      x: Y,
      y: O ? q.top - 7 : q.bottom + 7,
      above: O,
      keyboard: S
    });
  }, R = (b) => {
    const S = b.target.closest(".cp-grade-trigger");
    if (S) {
      if (b.preventDefault(), S === h.current && j) {
        S.setAttribute("aria-expanded", "false"), N(null);
        return;
      }
      C(S);
    }
  }, B = (b) => {
    var M;
    if (b.key === "Escape" && j) {
      b.preventDefault(), (M = h.current) == null || M.setAttribute("aria-expanded", "false"), N(null);
      return;
    }
    const S = b.target.closest(".cp-grade-trigger");
    !S || !["Enter", " ", "ArrowDown", "ArrowUp"].includes(b.key) || (b.preventDefault(), C(S, !0));
  }, I = (b) => {
    var T, O, ee, Y, ae;
    if (!j) return;
    const S = (T = g.current) == null ? void 0 : T.querySelectorAll("select.dp-grade")[j.selectIndex];
    if (!S) return;
    S.value = b, S.dispatchEvent(new Event("change", { bubbles: !0 }));
    const M = ((O = S.selectedOptions[0]) == null ? void 0 : O.textContent) || ((ee = S.options[0]) == null ? void 0 : ee.textContent) || "—", V = h.current, q = V == null ? void 0 : V.querySelector("span");
    q && (q.textContent = M), V == null || V.classList.toggle("filled", !!b), (Y = h.current) == null || Y.setAttribute("aria-expanded", "false"), (ae = h.current) == null || ae.focus(), N(null);
  }, G = (b) => {
    var q, T, O;
    if (b.key === "Escape") {
      b.preventDefault(), (q = h.current) == null || q.setAttribute("aria-expanded", "false"), (T = h.current) == null || T.focus(), N(null);
      return;
    }
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(b.key)) return;
    b.preventDefault();
    const S = [...b.currentTarget.querySelectorAll('[role="option"]')], M = Math.max(0, S.indexOf(document.activeElement)), V = b.key === "ArrowDown" || b.key === "ArrowRight" ? 1 : -1;
    (O = S[(M + V + S.length) % S.length]) == null || O.focus();
  };
  return c ? /* @__PURE__ */ i.jsxs("div", { className: "curriculum-plan-root cp-empty", role: "status", children: [
    /* @__PURE__ */ i.jsx(Na, { "aria-hidden": "true" }),
    /* @__PURE__ */ i.jsx("strong", { children: u })
  ] }) : /* @__PURE__ */ i.jsxs("section", { className: "curriculum-plan-root", "aria-label": f, onClick: R, onKeyDown: B, children: [
    /* @__PURE__ */ i.jsx("div", { ref: g, className: "cp-semester-grid", dangerouslySetInnerHTML: { __html: a } }),
    j && /* @__PURE__ */ i.jsx(
      "div",
      {
        ref: x,
        className: `cp-grade-menu${j.above ? " above" : ""}`,
        role: "listbox",
        "aria-label": j.label,
        style: { "--cp-menu-x": `${j.x}px`, "--cp-menu-y": `${j.y}px` },
        onKeyDown: G,
        children: j.options.map((b) => /* @__PURE__ */ i.jsxs(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": b.value === j.value,
            className: b.value ? "" : "is-empty",
            onClick: () => I(b.value),
            children: [
              /* @__PURE__ */ i.jsx("span", { children: b.label }),
              b.value === j.value && /* @__PURE__ */ i.jsx(Tf, { "aria-hidden": "true" })
            ]
          },
          b.value || "empty"
        ))
      }
    )
  ] });
}
function Um() {
  const a = "(max-width: 700px)", [c, u] = Q.useState(() => window.matchMedia(a).matches);
  return Q.useEffect(() => {
    const f = window.matchMedia(a), g = () => u(f.matches);
    return f.addEventListener("change", g), () => f.removeEventListener("change", g);
  }, []), c;
}
function Vm({ message: a }) {
  return /* @__PURE__ */ i.jsxs("div", { className: "ex-empty", children: [
    /* @__PURE__ */ i.jsx(Na, { "aria-hidden": "true" }),
    /* @__PURE__ */ i.jsx("strong", { children: a })
  ] });
}
function Bm({ props: a }) {
  return /* @__PURE__ */ i.jsxs("div", { className: "ex-table", role: "table", "aria-label": a.ariaLabel, children: [
    /* @__PURE__ */ i.jsxs("div", { className: `ex-head${a.showPlace ? "" : " without-place"}`, role: "row", children: [
      /* @__PURE__ */ i.jsx("span", { role: "columnheader", children: a.labels.course }),
      /* @__PURE__ */ i.jsx("span", { role: "columnheader", children: a.labels.instructor }),
      /* @__PURE__ */ i.jsx("span", { role: "columnheader", children: a.labels.type }),
      a.showPlace && /* @__PURE__ */ i.jsx("span", { role: "columnheader", children: a.labels.place }),
      /* @__PURE__ */ i.jsxs("span", { role: "columnheader", children: [
        a.labels.date,
        " / ",
        a.labels.time
      ] })
    ] }),
    /* @__PURE__ */ i.jsx("div", { role: "rowgroup", children: a.rows.map((c, u) => /* @__PURE__ */ i.jsxs("div", { className: `ex-row stagger-in${a.showPlace ? "" : " without-place"}`, style: { animationDelay: `${Math.min(u * 20, 320)}ms` }, role: "row", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "ex-course", role: "cell", children: [
        /* @__PURE__ */ i.jsx("button", { type: "button", onClick: () => a.onOpen(c.code), children: c.code }),
        /* @__PURE__ */ i.jsx("strong", { children: c.name }),
        /* @__PURE__ */ i.jsxs("small", { children: [
          /* @__PURE__ */ i.jsx(Ca, { "aria-hidden": "true" }),
          c.crn
        ] })
      ] }),
      /* @__PURE__ */ i.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ i.jsx(mr, { "aria-hidden": "true" }),
        c.instructor || "·"
      ] }),
      /* @__PURE__ */ i.jsx("span", { role: "cell", children: /* @__PURE__ */ i.jsx("em", { className: "ex-type", children: c.type }) }),
      a.showPlace && /* @__PURE__ */ i.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ i.jsx(Jn, { "aria-hidden": "true" }),
        c.place || "·"
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "ex-when", role: "cell", children: [
        /* @__PURE__ */ i.jsxs("strong", { children: [
          /* @__PURE__ */ i.jsx(an, { "aria-hidden": "true" }),
          c.date
        ] }),
        /* @__PURE__ */ i.jsxs("span", { children: [
          /* @__PURE__ */ i.jsx(Zn, { "aria-hidden": "true" }),
          c.day,
          " ",
          c.time
        ] })
      ] })
    ] }, c.key)) })
  ] });
}
function Wm({ props: a }) {
  const c = Q.useMemo(() => {
    const u = [], f = /* @__PURE__ */ new Map();
    return a.rows.forEach((g) => {
      let h = f.get(g.date);
      h || (h = { date: g.date, day: g.day, exams: [] }, f.set(g.date, h), u.push(h)), h.exams.push(g);
    }), u;
  }, [a.rows]);
  return /* @__PURE__ */ i.jsx("div", { className: "ex-agenda", "aria-label": a.ariaLabel, children: c.map((u, f) => /* @__PURE__ */ i.jsxs("section", { className: "ex-day stagger-in", style: { animationDelay: `${Math.min(f * 40, 320)}ms` }, children: [
    /* @__PURE__ */ i.jsxs("header", { children: [
      /* @__PURE__ */ i.jsx(an, { "aria-hidden": "true" }),
      /* @__PURE__ */ i.jsx("strong", { children: u.date }),
      /* @__PURE__ */ i.jsx("span", { children: u.day })
    ] }),
    /* @__PURE__ */ i.jsx("div", { children: u.exams.map((g) => /* @__PURE__ */ i.jsxs("article", { className: "ex-card", children: [
      /* @__PURE__ */ i.jsxs("span", { className: "ex-card-time", children: [
        /* @__PURE__ */ i.jsx(Zn, { "aria-hidden": "true" }),
        /* @__PURE__ */ i.jsx("b", { children: g.time })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "ex-card-main", children: [
        /* @__PURE__ */ i.jsx("button", { type: "button", onClick: () => a.onOpen(g.code), children: g.code }),
        /* @__PURE__ */ i.jsx("strong", { children: g.name }),
        /* @__PURE__ */ i.jsxs("span", { children: [
          /* @__PURE__ */ i.jsx(Xn, { "aria-hidden": "true" }),
          g.type,
          /* @__PURE__ */ i.jsx("i", { "aria-hidden": "true" }),
          "CRN ",
          g.crn
        ] }),
        g.instructor && /* @__PURE__ */ i.jsxs("span", { children: [
          /* @__PURE__ */ i.jsx(mr, { "aria-hidden": "true" }),
          g.instructor
        ] }),
        a.showPlace && g.place && /* @__PURE__ */ i.jsxs("span", { children: [
          /* @__PURE__ */ i.jsx(Jn, { "aria-hidden": "true" }),
          g.place
        ] })
      ] })
    ] }, g.key)) })
  ] }, u.date)) });
}
function fd(a) {
  const c = Um();
  return /* @__PURE__ */ i.jsx("section", { className: "dersler-table-root exams-list-root", children: a.rows.length ? c ? /* @__PURE__ */ i.jsx(Wm, { props: a }) : /* @__PURE__ */ i.jsx(Bm, { props: a }) : /* @__PURE__ */ i.jsx(Vm, { message: a.emptyMessage }) });
}
function md({ items: a, labels: c, onOpen: u, onCopy: f, onOpenObs: g, onRemove: h, onReorder: x }) {
  const [j, N] = Q.useState(null), [C, R] = Q.useState(null), [B, I] = Q.useState(null);
  if (!a.length) return /* @__PURE__ */ i.jsxs("div", { className: "pcl-empty empty", children: [
    /* @__PURE__ */ i.jsx(mo, { "aria-hidden": "true" }),
    /* @__PURE__ */ i.jsx("strong", { children: c.empty })
  ] });
  const G = (b, S) => {
    b.preventDefault(), C !== null && C !== S && x(C, S), R(null), I(null);
  };
  return /* @__PURE__ */ i.jsxs("div", { className: "pcl-list", role: "table", onKeyDown: (b) => {
    b.key === "Escape" && N(null);
  }, children: [
    /* @__PURE__ */ i.jsxs("div", { className: "pcl-head p-list-head", role: "row", children: [
      /* @__PURE__ */ i.jsx("span", { role: "columnheader", children: c.course }),
      /* @__PURE__ */ i.jsx("span", { role: "columnheader", children: c.quota })
    ] }),
    a.map((b, S) => /* @__PURE__ */ i.jsxs(
      "article",
      {
        className: `pcl-item p-item stagger-in${b.full ? " is-full" : ""}${C === S ? " is-dragging" : ""}${B === S && C !== null && C !== S ? " is-drop-target" : ""}`,
        style: { animationDelay: `${Math.min(S * 30, 240)}ms` },
        role: "row",
        draggable: !0,
        onDragStart: () => R(S),
        onDragOver: (M) => {
          M.preventDefault(), B !== S && I(S);
        },
        onDragEnd: () => {
          R(null), I(null);
        },
        onDrop: (M) => G(M, S),
        onClick: (M) => {
          M.target.closest("button") || u(b.key);
        },
        children: [
          /* @__PURE__ */ i.jsx(Hf, { className: "pcl-grip", "aria-hidden": "true" }),
          /* @__PURE__ */ i.jsxs("div", { className: "pcl-course", role: "cell", children: [
            /* @__PURE__ */ i.jsxs("div", { className: "pcl-title", children: [
              /* @__PURE__ */ i.jsx("strong", { className: "p-code", children: b.code }),
              /* @__PURE__ */ i.jsx("span", { className: `pcl-status${b.full ? " is-full" : " is-open"}`, children: b.full ? c.full : c.open }),
              b.badge && /* @__PURE__ */ i.jsx("span", { className: "pcl-kind-badge", children: b.badge })
            ] }),
            /* @__PURE__ */ i.jsx("p", { children: b.name }),
            /* @__PURE__ */ i.jsxs("div", { className: "pcl-meta", children: [
              /* @__PURE__ */ i.jsxs("span", { className: "p-when", children: [
                /* @__PURE__ */ i.jsx(Zn, { "aria-hidden": "true" }),
                b.when
              ] }),
              /* @__PURE__ */ i.jsxs("span", { className: "pcl-instructor", children: [
                /* @__PURE__ */ i.jsx("span", { className: "pcl-avatar", children: /* @__PURE__ */ i.jsx(mr, { "aria-hidden": "true" }) }),
                b.instructor
              ] })
            ] }),
            b.credit && /* @__PURE__ */ i.jsx("small", { children: b.credit })
          ] }),
          /* @__PURE__ */ i.jsxs("div", { className: "pcl-numbers p-crn", role: "cell", children: [
            /* @__PURE__ */ i.jsx("b", { children: b.quota }),
            /* @__PURE__ */ i.jsxs("span", { children: [
              "CRN ",
              b.crn
            ] }),
            b.backup && /* @__PURE__ */ i.jsx("em", { children: b.backup })
          ] }),
          /* @__PURE__ */ i.jsx("button", { className: "pcl-remove p-remove", type: "button", onClick: () => h(b.key), "aria-label": `${b.code} ${c.remove}`, children: /* @__PURE__ */ i.jsx(va, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ i.jsxs("div", { className: "pcl-menu-wrap", children: [
            /* @__PURE__ */ i.jsxs("button", { className: "pcl-menu-trigger p-menu", type: "button", "aria-expanded": j === b.key, "aria-haspopup": "menu", onClick: () => N(j === b.key ? null : b.key), children: [
              /* @__PURE__ */ i.jsx(Hc, { "aria-hidden": "true" }),
              /* @__PURE__ */ i.jsxs("span", { className: "sr-only", children: [
                b.code,
                " ",
                c.actions
              ] })
            ] }),
            j === b.key && /* @__PURE__ */ i.jsxs("div", { className: "pcl-menu p-menu-pop", role: "menu", children: [
              /* @__PURE__ */ i.jsxs("button", { role: "menuitem", onClick: () => {
                u(b.key), N(null);
              }, children: [
                /* @__PURE__ */ i.jsx(mo, {}),
                c.details
              ] }),
              /* @__PURE__ */ i.jsxs("button", { role: "menuitem", "data-act": "copy-crn", onClick: () => {
                f(b.key, "crn"), N(null);
              }, children: [
                /* @__PURE__ */ i.jsx(ha, {}),
                c.copyCrn
              ] }),
              /* @__PURE__ */ i.jsxs("button", { role: "menuitem", "data-act": "copy-code", onClick: () => {
                f(b.key, "code"), N(null);
              }, children: [
                /* @__PURE__ */ i.jsx(ha, {}),
                c.copyCode
              ] }),
              b.instructor && /* @__PURE__ */ i.jsxs("button", { role: "menuitem", "data-act": "copy-instructor", onClick: () => {
                f(b.key, "instructor"), N(null);
              }, children: [
                /* @__PURE__ */ i.jsx(mr, {}),
                c.copyInstructor
              ] }),
              /* @__PURE__ */ i.jsxs("button", { role: "menuitem", onClick: () => {
                g(b.key), N(null);
              }, children: [
                /* @__PURE__ */ i.jsx(Sa, {}),
                c.openObs
              ] }),
              /* @__PURE__ */ i.jsxs("button", { role: "menuitem", "data-act": "remove", className: "is-danger", onClick: () => {
                h(b.key), N(null);
              }, children: [
                /* @__PURE__ */ i.jsx(va, {}),
                c.remove
              ] })
            ] })
          ] })
        ]
      },
      b.key
    ))
  ] });
}
const qm = { overview: mo, sections: Uf, catalog: Vf, history: xa };
function Qm({ data: a }) {
  const [c, u] = Q.useState("required"), f = [
    { key: "required", label: a.requiredLabel, icon: $f },
    { key: "unlocks", label: a.unlocksLabel, icon: qf }
  ], g = (h, x) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(h.key)) return;
    h.preventDefault();
    const j = h.key === "Home" ? 0 : h.key === "End" ? f.length - 1 : (x + (h.key === "ArrowRight" ? 1 : -1) + f.length) % f.length;
    u(f[j].key), requestAnimationFrame(() => {
      var N;
      return (N = document.getElementById(`cdr-req-tab-${f[j].key}`)) == null ? void 0 : N.focus();
    });
  };
  return /* @__PURE__ */ i.jsxs("section", { className: "cdr-prereq", "aria-label": `${a.requiredLabel} / ${a.unlocksLabel}`, children: [
    /* @__PURE__ */ i.jsx("nav", { className: "cdr-prereq-tabs", role: "tablist", children: f.map((h, x) => {
      const j = h.icon;
      return /* @__PURE__ */ i.jsxs("button", { type: "button", role: "tab", id: `cdr-req-tab-${h.key}`, "aria-controls": `cdr-req-panel-${h.key}`, "aria-selected": c === h.key, tabIndex: c === h.key ? 0 : -1, onClick: () => u(h.key), onKeyDown: (N) => g(N, x), children: [
        /* @__PURE__ */ i.jsx(j, { "aria-hidden": "true" }),
        /* @__PURE__ */ i.jsx("span", { children: h.label }),
        h.key === "unlocks" && /* @__PURE__ */ i.jsx("b", { "data-req-count": !0, children: "…" })
      ] }, h.key);
    }) }),
    /* @__PURE__ */ i.jsxs("div", { className: "cdr-prereq-body", children: [
      /* @__PURE__ */ i.jsx("div", { role: "tabpanel", id: "cdr-req-panel-required", "aria-labelledby": "cdr-req-tab-required", hidden: c !== "required", children: /* @__PURE__ */ i.jsx("div", { className: "d-req-fwd", "data-code": a.code, children: /* @__PURE__ */ i.jsx("p", { className: "empty", children: a.loading }) }) }),
      /* @__PURE__ */ i.jsx("div", { role: "tabpanel", id: "cdr-req-panel-unlocks", "aria-labelledby": "cdr-req-tab-unlocks", hidden: c !== "unlocks", children: /* @__PURE__ */ i.jsx("div", { className: "d-req-by", "data-code": a.code, children: /* @__PURE__ */ i.jsx("p", { className: "empty", children: a.loading }) }) })
    ] })
  ] });
}
function Gm({ history: a }) {
  var N;
  const [c, u] = Q.useState(!1), [f, g] = Q.useState(((N = a.terms[a.terms.length - 1]) == null ? void 0 : N.slug) || "");
  if (!a.terms.length) return /* @__PURE__ */ i.jsxs("div", { className: "cdr-history-empty", children: [
    /* @__PURE__ */ i.jsx(xa, { "aria-hidden": "true" }),
    /* @__PURE__ */ i.jsx("strong", { children: a.heading }),
    /* @__PURE__ */ i.jsx("p", { children: a.empty })
  ] });
  const h = c ? a.terms : a.terms.slice(-8), x = a.terms.find((C) => C.slug === f) || h[h.length - 1], j = Math.max(1, ...h.map((C) => C.capacity));
  return /* @__PURE__ */ i.jsxs("div", { className: "cdr-history", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "cdr-history-head", children: [
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("h4", { children: a.heading }),
        /* @__PURE__ */ i.jsx("p", { children: a.caption })
      ] }),
      /* @__PURE__ */ i.jsxs("span", { children: [
        /* @__PURE__ */ i.jsx(xa, { "aria-hidden": "true" }),
        a.terms.length
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("figure", { className: "cdr-history-figure", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "cdr-history-legend", children: [
        /* @__PURE__ */ i.jsxs("span", { children: [
          /* @__PURE__ */ i.jsx("i", { className: "capacity" }),
          a.labels.capacity
        ] }),
        /* @__PURE__ */ i.jsxs("span", { children: [
          /* @__PURE__ */ i.jsx("i", { className: "enrolled" }),
          a.labels.enrolled
        ] })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "cdr-history-chart", role: "list", "aria-label": a.heading, children: h.map((C) => /* @__PURE__ */ i.jsxs("button", { type: "button", role: "listitem", className: `cdr-history-term${x.slug === C.slug ? " is-active" : ""}${C.fill >= 100 ? " is-full" : ""}`, onMouseEnter: () => g(C.slug), onFocus: () => g(C.slug), onClick: () => g(C.slug), "aria-label": `${C.label}, ${a.labels.capacity} ${C.capacity}, ${a.labels.enrolled} ${C.enrolled}, %${C.fill}`, children: [
        /* @__PURE__ */ i.jsxs("span", { className: "cdr-history-bars", children: [
          /* @__PURE__ */ i.jsx("i", { className: "capacity", style: { height: `${Math.max(7, Math.round(C.capacity / j * 100))}%` } }),
          /* @__PURE__ */ i.jsx("i", { className: "enrolled", style: { height: `${Math.max(C.enrolled ? 7 : 0, Math.round(C.enrolled / j * 100))}%` } })
        ] }),
        /* @__PURE__ */ i.jsx("small", { children: C.shortLabel })
      ] }, C.slug)) }),
      /* @__PURE__ */ i.jsxs("figcaption", { className: "cdr-history-caption", children: [
        /* @__PURE__ */ i.jsxs("span", { children: [
          /* @__PURE__ */ i.jsx(Lf, { "aria-hidden": "true" }),
          /* @__PURE__ */ i.jsx("b", { children: x.label })
        ] }),
        /* @__PURE__ */ i.jsxs("span", { children: [
          a.labels.capacity,
          " ",
          /* @__PURE__ */ i.jsx("b", { children: x.capacity })
        ] }),
        /* @__PURE__ */ i.jsxs("span", { children: [
          a.labels.enrolled,
          " ",
          /* @__PURE__ */ i.jsx("b", { children: x.enrolled })
        ] }),
        /* @__PURE__ */ i.jsxs("strong", { children: [
          "%",
          x.fill
        ] })
      ] }),
      a.terms.length > 8 && /* @__PURE__ */ i.jsx("button", { type: "button", className: "cdr-history-toggle", "aria-expanded": c, onClick: () => u(!c), children: c ? a.labels.showRecent : a.labels.showAll })
    ] }),
    /* @__PURE__ */ i.jsxs("details", { className: "cdr-history-records d-history-records", children: [
      /* @__PURE__ */ i.jsxs("summary", { children: [
        /* @__PURE__ */ i.jsxs("span", { children: [
          /* @__PURE__ */ i.jsx(Kf, { "aria-hidden": "true" }),
          a.labels.records
        ] }),
        /* @__PURE__ */ i.jsx("b", { children: a.recordCount }),
        /* @__PURE__ */ i.jsx($c, { "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "cdr-history-record-list htable", children: [...a.terms].reverse().map((C) => /* @__PURE__ */ i.jsxs("section", { children: [
        /* @__PURE__ */ i.jsxs("header", { children: [
          /* @__PURE__ */ i.jsx("strong", { children: C.label }),
          /* @__PURE__ */ i.jsxs("span", { children: [
            C.enrolled,
            " / ",
            C.capacity,
            " · %",
            C.fill
          ] })
        ] }),
        C.rows.map((R, B) => /* @__PURE__ */ i.jsxs("div", { className: "cdr-history-record", children: [
          /* @__PURE__ */ i.jsx("span", { children: R.instructor || "·" }),
          /* @__PURE__ */ i.jsxs("small", { children: [
            a.labels.enrolled,
            " ",
            R.enrolled,
            " · ",
            a.labels.capacity,
            " ",
            R.capacity
          ] }),
          /* @__PURE__ */ i.jsxs("b", { children: [
            "%",
            R.fill
          ] })
        ] }, `${C.slug}-${R.instructor}-${B}`))
      ] }, C.slug)) })
    ] })
  ] });
}
function Km(a) {
  const [c, u] = Q.useState(a.active), [f, g] = Q.useState(!1), h = (x, j) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(x.key)) return;
    x.preventDefault();
    const N = x.key === "Home" ? 0 : x.key === "End" ? a.panels.length - 1 : (j + (x.key === "ArrowRight" ? 1 : -1) + a.panels.length) % a.panels.length;
    u(a.panels[N].key), requestAnimationFrame(() => {
      var C;
      return (C = document.getElementById(`d-tab-${a.panels[N].key}`)) == null ? void 0 : C.focus();
    });
  };
  return /* @__PURE__ */ i.jsxs("div", { className: "cdr-root course-reader", children: [
    /* @__PURE__ */ i.jsxs("header", { className: "cdr-head d-head", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "cdr-title d-title-block", children: [
        /* @__PURE__ */ i.jsxs("h3", { id: "detail-title", children: [
          /* @__PURE__ */ i.jsx("span", { className: "d-code", children: a.code }),
          /* @__PURE__ */ i.jsx("span", { className: "d-name", children: a.name })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "d-meta", children: [
          a.meta.map((x) => /* @__PURE__ */ i.jsx("span", { className: "d-pill", children: x }, x)),
          a.specialKind && /* @__PURE__ */ i.jsxs("span", { className: `cdr-kind ${a.specialKind}`, children: [
            a.specialKind === "extra-exam" ? /* @__PURE__ */ i.jsx(ga, { "aria-hidden": "true" }) : /* @__PURE__ */ i.jsx(Xn, { "aria-hidden": "true" }),
            a.specialLabel
          ] })
        ] })
      ] }),
      a.obsLink && /* @__PURE__ */ i.jsxs("a", { className: "cdr-obs d-obs", href: a.obsLink, target: "_blank", rel: "noopener", children: [
        /* @__PURE__ */ i.jsx(Sa, { "aria-hidden": "true" }),
        a.obsLabel
      ] })
    ] }),
    /* @__PURE__ */ i.jsx("nav", { className: "cdr-tabs d-tabs", role: "tablist", "aria-label": a.tabLabel, children: a.panels.map((x, j) => {
      const N = qm[x.key] || mo;
      return /* @__PURE__ */ i.jsxs("button", { type: "button", role: "tab", id: `d-tab-${x.key}`, "data-dtab": x.key, "aria-controls": `d-panel-${x.key}`, "aria-selected": c === x.key, tabIndex: c === x.key ? 0 : -1, onClick: () => u(x.key), onKeyDown: (C) => h(C, j), children: [
        /* @__PURE__ */ i.jsx(N, { "aria-hidden": "true" }),
        /* @__PURE__ */ i.jsx("span", { children: x.label }),
        x.count !== void 0 && /* @__PURE__ */ i.jsx("b", { children: x.count })
      ] }, x.key);
    }) }),
    /* @__PURE__ */ i.jsx("div", { className: "cdr-panels d-panels", children: a.panels.map((x) => {
      var j, N, C;
      return /* @__PURE__ */ i.jsx("section", { role: "tabpanel", id: `d-panel-${x.key}`, "aria-labelledby": `d-tab-${x.key}`, "data-dpanel": x.key, hidden: c !== x.key, children: x.key === "history" && a.history ? /* @__PURE__ */ i.jsx(Gm, { history: a.history }) : x.key === "overview" && a.prerequisite ? /* @__PURE__ */ i.jsxs("div", { className: "cdr-overview", children: [
        x.beforeHtml && /* @__PURE__ */ i.jsx("div", { dangerouslySetInnerHTML: { __html: x.beforeHtml } }),
        /* @__PURE__ */ i.jsx(Qm, { data: a.prerequisite }),
        x.afterHtml && /* @__PURE__ */ i.jsx("div", { dangerouslySetInnerHTML: { __html: x.afterHtml } })
      ] }) : x.key === "sections" && ((j = a.sections) != null && j.length) ? /* @__PURE__ */ i.jsxs("div", { className: "cdr-sections", children: [
        /* @__PURE__ */ i.jsxs("header", { className: "cdr-section-heading", children: [
          /* @__PURE__ */ i.jsxs("div", { children: [
            /* @__PURE__ */ i.jsx("h4", { children: a.sectionHeading }),
            /* @__PURE__ */ i.jsx("p", { children: a.sectionCaption })
          ] }),
          /* @__PURE__ */ i.jsx("span", { children: a.sections.length })
        ] }),
        /* @__PURE__ */ i.jsx("div", { className: "cdr-section-list", children: a.sections.slice(0, f ? void 0 : 8).map((R, B) => {
          var I, G, b;
          return /* @__PURE__ */ i.jsxs("article", { className: `cdr-section d-sec stagger-in${R.focus ? " is-focus" : ""}`, style: { animationDelay: `${Math.min(B * 30, 200)}ms` }, "data-crn": R.crn, children: [
            /* @__PURE__ */ i.jsxs("div", { className: "cdr-section-code", children: [
              /* @__PURE__ */ i.jsx("span", { children: "CRN" }),
              /* @__PURE__ */ i.jsx("strong", { children: R.crn })
            ] }),
            /* @__PURE__ */ i.jsxs("div", { className: "cdr-section-body", children: [
              /* @__PURE__ */ i.jsxs("div", { className: "cdr-section-top", children: [
                /* @__PURE__ */ i.jsxs("button", { type: "button", className: "cdr-instructor d-instr-history", "data-name": R.instructors.join(", "), children: [
                  /* @__PURE__ */ i.jsx(mr, { "aria-hidden": "true" }),
                  R.instructors.join(", ") || "·"
                ] }),
                /* @__PURE__ */ i.jsx("span", { children: R.quota })
              ] }),
              R.meta && /* @__PURE__ */ i.jsxs("p", { className: "cdr-section-meta", children: [
                R.special === "extra-exam" ? /* @__PURE__ */ i.jsx(ga, { "aria-hidden": "true" }) : R.special === "graduation" ? /* @__PURE__ */ i.jsx(Xn, { "aria-hidden": "true" }) : /* @__PURE__ */ i.jsx(Mf, { "aria-hidden": "true" }),
                R.meta
              ] }),
              !!R.sessions.length && /* @__PURE__ */ i.jsx("div", { className: "cdr-section-times d-sec-when", children: R.sessions.map((S) => /* @__PURE__ */ i.jsxs("span", { children: [
                /* @__PURE__ */ i.jsx(Zn, { "aria-hidden": "true" }),
                S
              ] }, S)) }),
              R.note && /* @__PURE__ */ i.jsx("small", { children: R.note }),
              !!((I = R.rules) != null && I.length) && /* @__PURE__ */ i.jsxs("details", { className: "cdr-rules", children: [
                /* @__PURE__ */ i.jsxs("summary", { children: [
                  (G = a.labels) == null ? void 0 : G.requirements,
                  /* @__PURE__ */ i.jsx($c, { "aria-hidden": "true" })
                ] }),
                R.rules.map((S) => /* @__PURE__ */ i.jsxs("p", { children: [
                  /* @__PURE__ */ i.jsx("b", { children: S.label }),
                  S.value
                ] }, S.label))
              ] })
            ] }),
            /* @__PURE__ */ i.jsxs("button", { type: "button", className: "cdr-add", "data-add-crn": R.crn, onClick: () => {
              var S;
              return (S = a.onAddCrn) == null ? void 0 : S.call(a, R.crn);
            }, children: [
              /* @__PURE__ */ i.jsx(Wf, { "aria-hidden": "true" }),
              (b = a.labels) == null ? void 0 : b.add
            ] })
          ] }, R.crn);
        }) }),
        a.sections.length > 8 && /* @__PURE__ */ i.jsx("button", { type: "button", className: "cdr-more", "aria-expanded": f, onClick: () => g(!f), children: f ? (N = a.labels) == null ? void 0 : N.showLess : `${a.sections.length - 8} ${(C = a.labels) == null ? void 0 : C.showMore}` })
      ] }) : /* @__PURE__ */ i.jsx("div", { dangerouslySetInnerHTML: { __html: x.html } }) }, x.key);
    }) })
  ] });
}
function Ym(a) {
  const c = [
    { key: "gpa", label: a.gpaLabel, value: a.gpaValue, hint: a.gpaHint, valueId: "dp-gano", hintId: void 0, Icon: Ff },
    { key: "progress", label: a.progressLabel, value: a.progressValue, hint: a.progressHint, valueId: "dp-progress", hintId: "dp-progress-sub", Icon: _f },
    { key: "target", label: a.targetLabel, value: a.targetValue, hint: "", valueId: "dp-target", hintId: "dp-target-sub", Icon: Gf }
  ];
  return /* @__PURE__ */ i.jsx("div", { className: "gpa-summary-grid", children: c.map(
    ({ key: u, label: f, value: g, hint: h, valueId: x, hintId: j, Icon: N }, C) => /* @__PURE__ */ i.jsxs("article", { className: `gpa-summary-card is-${u} stagger-in`, style: { animationDelay: `${C * 60}ms` }, children: [
      /* @__PURE__ */ i.jsx("span", { className: "gpa-summary-icon", children: /* @__PURE__ */ i.jsx(N, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ i.jsxs("div", { children: [
        /* @__PURE__ */ i.jsx("em", { children: f }),
        /* @__PURE__ */ i.jsx("b", { id: x, children: g }),
        /* @__PURE__ */ i.jsx("small", { id: j, children: h })
      ] })
    ] }, u)
  ) });
}
function Xm({ termLabel: a, chips: c, emptyMessage: u, removeLabel: f, onRemove: g }) {
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx("span", { className: "fc-term", children: a }),
    c.map((h, x) => /* @__PURE__ */ i.jsxs("span", { className: "fc-pill stagger-in", style: { animationDelay: `${Math.min(x * 40, 200)}ms` }, children: [
      h.value !== void 0 ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
        /* @__PURE__ */ i.jsx("span", { className: "fc-label", children: h.label }),
        /* @__PURE__ */ i.jsx("span", { className: "fc-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ i.jsx("span", { className: "fc-value", children: h.value })
      ] }) : /* @__PURE__ */ i.jsx("span", { className: "fc-value", children: h.text }),
      /* @__PURE__ */ i.jsx("button", { type: "button", className: "fc-x", "data-key": h.key, "aria-label": f, title: f, onClick: () => g(h.key), children: /* @__PURE__ */ i.jsx(Yf, { "aria-hidden": "true" }) })
    ] }, h.key)),
    u && /* @__PURE__ */ i.jsx("p", { className: "filter-help", children: u })
  ] });
}
function Zm({ terms: a, labels: c }) {
  return /* @__PURE__ */ i.jsx("div", { className: "tg-grid", children: a.map((u, f) => /* @__PURE__ */ i.jsxs(
    "article",
    {
      className: `tg-card reveal${u.missing ? " is-missing" : ""}`,
      style: { transitionDelay: `${Math.min(f, 12) * 25}ms` },
      children: [
        /* @__PURE__ */ i.jsx("div", { className: "tg-icon", "aria-hidden": "true", children: u.missing ? /* @__PURE__ */ i.jsx(Df, {}) : /* @__PURE__ */ i.jsx(an, {}) }),
        /* @__PURE__ */ i.jsxs("div", { className: "tg-body", children: [
          /* @__PURE__ */ i.jsxs("h3", { children: [
            u.label,
            u.live && /* @__PURE__ */ i.jsx("span", { className: "tg-badge is-live", children: c.live })
          ] }),
          u.missing ? /* @__PURE__ */ i.jsx("p", { className: "tg-meta", children: u.missingReason }) : /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
            /* @__PURE__ */ i.jsx("p", { className: "tg-meta", children: u.meta }),
            u.warn && /* @__PURE__ */ i.jsx("p", { className: "tg-meta is-warn", children: u.warn })
          ] })
        ] }),
        !u.missing && u.csvHref && u.metaHref && /* @__PURE__ */ i.jsxs("div", { className: "tg-links", children: [
          /* @__PURE__ */ i.jsxs("a", { className: "tg-link", href: u.csvHref, download: !0, children: [
            /* @__PURE__ */ i.jsx(Of, { "aria-hidden": "true" }),
            c.csv
          ] }),
          /* @__PURE__ */ i.jsxs("a", { className: "tg-link", href: u.metaHref, children: [
            /* @__PURE__ */ i.jsx(Af, { "aria-hidden": "true" }),
            c.metaJson
          ] })
        ] })
      ]
    },
    u.key
  )) });
}
function Jm({ state: a }) {
  return a === "past" ? /* @__PURE__ */ i.jsx(Rf, { "aria-hidden": "true" }) : a === "now" ? /* @__PURE__ */ i.jsx(If, { "aria-hidden": "true" }) : /* @__PURE__ */ i.jsx(Pf, { "aria-hidden": "true" });
}
function eh({ groups: a }) {
  return /* @__PURE__ */ i.jsx(i.Fragment, { children: a.map((c) => /* @__PURE__ */ i.jsxs("section", { className: "atl-group reveal", children: [
    /* @__PURE__ */ i.jsx("h3", { children: c.title }),
    /* @__PURE__ */ i.jsx("ol", { className: "atl-list", children: c.events.map((u) => /* @__PURE__ */ i.jsxs("li", { className: `atl-row is-${u.state}`, children: [
      /* @__PURE__ */ i.jsx("span", { className: "atl-icon", children: /* @__PURE__ */ i.jsx(Jm, { state: u.state }) }),
      /* @__PURE__ */ i.jsx("span", { className: "atl-title", children: u.title }),
      /* @__PURE__ */ i.jsx("span", { className: "atl-date", children: u.date }),
      /* @__PURE__ */ i.jsx("span", { className: "atl-left", children: u.left })
    ] }, u.key)) })
  ] }, c.key)) });
}
function Oc({ headingClass: a, label: c, chips: u, onSelect: f }) {
  return u.length ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx("h3", { className: a, children: c }),
    /* @__PURE__ */ i.jsx("div", { className: "chips", children: u.map((g, h) => /* @__PURE__ */ i.jsxs("button", { type: "button", className: "chip stagger-in", style: { animationDelay: `${Math.min(h * 30, 240)}ms` }, onClick: () => f(g), children: [
      /* @__PURE__ */ i.jsx("b", { children: g.code || g.name }),
      g.code && /* @__PURE__ */ i.jsx("span", { children: g.name }),
      /* @__PURE__ */ i.jsx("em", { children: g.sub })
    ] }, g.key)) })
  ] }) : null;
}
function th({ mode: a, intro: c, courseSectionLabel: u, instructorSectionLabel: f, courses: g, people: h, emptyMessage: x, onSelect: j }) {
  if (a === "empty") return /* @__PURE__ */ i.jsx("p", { className: "empty", children: x });
  const N = a === "discovery" ? "h-disc" : "mh";
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    c && /* @__PURE__ */ i.jsx("p", { className: "h-intro", children: c }),
    /* @__PURE__ */ i.jsx(Oc, { headingClass: N, label: u, chips: g, onSelect: j }),
    /* @__PURE__ */ i.jsx(Oc, { headingClass: N, label: f, chips: h, onSelect: j })
  ] });
}
function rh({ data: a, labels: c, onOpenCourseDetail: u }) {
  return a ? a.kind === "course" ? /* @__PURE__ */ i.jsxs("article", { className: "hcard reveal", children: [
    /* @__PURE__ */ i.jsxs("h3", { children: [
      a.code,
      " ",
      /* @__PURE__ */ i.jsx("span", { children: a.name })
    ] }),
    /* @__PURE__ */ i.jsxs("p", { className: "meta", children: [
      a.openedText,
      " · ",
      a.seasonsLabel,
      " ",
      a.rhythm,
      /* @__PURE__ */ i.jsx("button", { type: "button", className: "btn-ghost h-detail", onClick: () => u(a.code), children: c.detailButton })
    ] }),
    /* @__PURE__ */ i.jsx("div", { dangerouslySetInnerHTML: { __html: a.trendHTML } }),
    /* @__PURE__ */ i.jsx("div", { className: "tablewrap", children: /* @__PURE__ */ i.jsxs("table", { className: "htable", "aria-label": `${a.code} ${c.colTerm}`, children: [
      /* @__PURE__ */ i.jsx("thead", { children: /* @__PURE__ */ i.jsxs("tr", { children: [
        /* @__PURE__ */ i.jsx("th", { children: c.colTerm }),
        /* @__PURE__ */ i.jsx("th", { children: c.colInstructor }),
        /* @__PURE__ */ i.jsx("th", { children: c.colDay }),
        /* @__PURE__ */ i.jsx("th", { className: "num", children: c.colCap }),
        /* @__PURE__ */ i.jsx("th", { className: "num", children: c.colEnr }),
        /* @__PURE__ */ i.jsx("th", { className: "num quota-legacy-col", children: c.colFill })
      ] }) }),
      /* @__PURE__ */ i.jsx("tbody", { children: a.rows.map((f) => /* @__PURE__ */ i.jsxs("tr", { children: [
        /* @__PURE__ */ i.jsx("td", { children: f.termLabel }),
        /* @__PURE__ */ i.jsx("td", { children: f.instructor || "·" }),
        /* @__PURE__ */ i.jsx("td", { className: "when", children: f.days || "·" }),
        /* @__PURE__ */ i.jsx("td", { className: "num", children: f.cap }),
        /* @__PURE__ */ i.jsx("td", { className: "num", children: f.enr }),
        /* @__PURE__ */ i.jsx("td", { className: "num quota-legacy-col", dangerouslySetInnerHTML: { __html: f.fillHTML } })
      ] }, f.key)) })
    ] }) })
  ] }) : /* @__PURE__ */ i.jsxs("article", { className: "hcard reveal", children: [
    /* @__PURE__ */ i.jsx("h3", { children: a.name }),
    /* @__PURE__ */ i.jsx("p", { className: "meta", children: a.meta }),
    /* @__PURE__ */ i.jsx("div", { className: "tablewrap", children: /* @__PURE__ */ i.jsxs("table", { className: "htable", "aria-label": `${a.name} ${c.colName}`, children: [
      /* @__PURE__ */ i.jsx("thead", { children: /* @__PURE__ */ i.jsxs("tr", { children: [
        /* @__PURE__ */ i.jsx("th", { children: c.colCode }),
        /* @__PURE__ */ i.jsx("th", { children: c.colName }),
        /* @__PURE__ */ i.jsx("th", { className: "num", children: c.colTermCount }),
        /* @__PURE__ */ i.jsx("th", { children: c.colTerms })
      ] }) }),
      /* @__PURE__ */ i.jsx("tbody", { children: a.rows.map((f) => /* @__PURE__ */ i.jsxs("tr", { children: [
        /* @__PURE__ */ i.jsx("td", { children: /* @__PURE__ */ i.jsx("b", { children: f.code }) }),
        /* @__PURE__ */ i.jsx("td", { children: f.name }),
        /* @__PURE__ */ i.jsx("td", { className: "num", children: f.termCount }),
        /* @__PURE__ */ i.jsx("td", { className: "when", children: f.terms })
      ] }, f.code)) })
    ] }) })
  ] }) : null;
}
function nh({ data: a, labels: c, onClose: u, onPanTo: f, onOpenCourseDetail: g }) {
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsxs("div", { className: "pg-detail-head", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        a.code,
        " ",
        /* @__PURE__ */ i.jsx("span", { children: a.name || "" })
      ] }),
      /* @__PURE__ */ i.jsx("button", { type: "button", className: "pg-detail-close", "aria-label": c.closeCourseAria, onClick: u, children: "×" })
    ] }),
    a.prereqTreeHTML ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsx("h4", { children: c.prereqHeading }),
      /* @__PURE__ */ i.jsx("ul", { className: "req-tree", dangerouslySetInnerHTML: { __html: a.prereqTreeHTML } })
    ] }) : /* @__PURE__ */ i.jsx("p", { className: "pg-empty", children: c.noPrereq }),
    a.required.length > 0 && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsxs("h4", { children: [
        c.requiredCourses,
        " (",
        a.required.length,
        ")"
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "pg-chips", children: a.required.map((h, x) => /* @__PURE__ */ i.jsx("button", { className: "pg-chip stagger-in", style: { animationDelay: `${Math.min(x * 30, 180)}ms` }, onClick: () => f(h), children: h }, h)) })
    ] }),
    a.dependents.length > 0 && /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      /* @__PURE__ */ i.jsxs("h4", { children: [
        c.requestedBy,
        " (",
        a.dependents.length,
        ")"
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "pg-chips", children: a.dependents.map((h, x) => /* @__PURE__ */ i.jsx("button", { className: "pg-chip stagger-in", style: { animationDelay: `${Math.min(x * 30, 180)}ms` }, onClick: () => f(h), children: h }, h)) })
    ] }),
    a.source && /* @__PURE__ */ i.jsxs("div", { className: "pg-source", children: [
      /* @__PURE__ */ i.jsx("b", { children: c.sourceVerification }),
      /* @__PURE__ */ i.jsxs("span", { children: [
        a.source.verifiedLabel,
        a.source.verifiedAt ? ` · ${a.source.verifiedAt}` : ""
      ] }),
      /* @__PURE__ */ i.jsx("a", { href: a.source.sourceUrl, target: "_blank", rel: "noopener", children: c.openObsRecord })
    ] }),
    /* @__PURE__ */ i.jsx("button", { type: "button", className: "btn-ghost pg-detail-open", onClick: () => g(a.code), children: c.viewCourseDetail })
  ] });
}
function lh({ data: a, labels: c, onClose: u, onOpenCourseDetail: f, onOpenInCourses: g }) {
  const [h, x] = Q.useState(""), [j, N] = Q.useState("code"), C = Q.useMemo(() => {
    const G = (T) => T.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, ""), b = G(h.trim());
    let S = a.options;
    b && (S = S.filter((T) => G(`${T.code} ${T.name}`).includes(b)));
    const M = (T) => {
      const O = a.status[T];
      return O && O.open && O.cap > 0 ? O.cap - O.enr : -1;
    }, V = {
      code: (T, O) => T.code.localeCompare(O.code),
      name: (T, O) => T.name.localeCompare(O.name, "tr") || T.code.localeCompare(O.code),
      open: (T, O) => {
        var ae, me;
        const ee = (ae = a.status[T.code]) != null && ae.open ? 0 : 1, Y = (me = a.status[O.code]) != null && me.open ? 0 : 1;
        return ee - Y || T.code.localeCompare(O.code);
      },
      cap: (T, O) => M(O.code) - M(T.code) || T.code.localeCompare(O.code)
    };
    S = S.slice().sort(V[j]);
    const q = /* @__PURE__ */ new Map();
    for (const T of S) {
      const O = T.code.split(" ")[0];
      q.has(O) || q.set(O, []), q.get(O).push(T);
    }
    return q;
  }, [a.options, a.status, h, j]), R = Q.useMemo(() => new Set(a.taken), [a.taken]), B = a.options.length > 30, I = Object.values(a.status).filter((G) => G.open).length;
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsxs("div", { className: "pg-detail-head", children: [
      /* @__PURE__ */ i.jsxs("h3", { children: [
        a.name,
        " ",
        /* @__PURE__ */ i.jsx("span", { children: c.electivePool })
      ] }),
      /* @__PURE__ */ i.jsx("button", { type: "button", className: "pg-detail-close", "aria-label": c.closePoolAria, onClick: u, children: "×" })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "pg-pool-head", children: [
      /* @__PURE__ */ i.jsx("input", { type: "search", className: "pg-pool-search", placeholder: c.poolSearchPlaceholder, "aria-label": c.poolSearchAria, value: h, onChange: (G) => x(G.target.value) }),
      /* @__PURE__ */ i.jsxs("select", { className: "pg-pool-sort", "aria-label": c.sortAria, value: j, onChange: (G) => N(G.target.value), children: [
        /* @__PURE__ */ i.jsx("option", { value: "code", children: c.sortByCode }),
        /* @__PURE__ */ i.jsx("option", { value: "name", children: c.sortByName }),
        /* @__PURE__ */ i.jsx("option", { value: "open", children: c.sortOpenFirst }),
        /* @__PURE__ */ i.jsx("option", { value: "cap", children: c.sortSeatsFirst })
      ] })
    ] }),
    /* @__PURE__ */ i.jsxs("p", { className: "pg-pool-status", children: [
      a.options.length,
      " ",
      c.alternativesWord,
      " · ",
      I,
      " ",
      c.openThisTermWord
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "pg-pool-groups", children: [...C].map(([G, b]) => /* @__PURE__ */ i.jsxs("details", { className: "pg-pool-group", open: !B, children: [
      /* @__PURE__ */ i.jsxs("summary", { children: [
        G,
        " ",
        /* @__PURE__ */ i.jsx("span", { children: b.length })
      ] }),
      b.map((S, M) => {
        const V = a.status[S.code], q = R.has(S.code);
        return /* @__PURE__ */ i.jsxs("div", { className: `pg-pool-row stagger-in${q ? " pg-pool-taken" : ""}`, style: { animationDelay: `${Math.min(M * 25, 200)}ms` }, children: [
          /* @__PURE__ */ i.jsxs("div", { className: "pg-pool-name", children: [
            /* @__PURE__ */ i.jsx("b", { children: S.code }),
            /* @__PURE__ */ i.jsx("em", { title: S.name, children: S.name || c.courseNameUnavailable })
          ] }),
          /* @__PURE__ */ i.jsxs("span", { className: "pg-pool-status-badge", children: [
            q && /* @__PURE__ */ i.jsx("span", { className: "taken-mark", children: c.takenMark }),
            V ? V.open ? /* @__PURE__ */ i.jsxs("span", { className: "open", children: [
              "● ",
              c.openBadge,
              " · ",
              V.sectionsCount,
              " ",
              c.branchUnit,
              " · ",
              V.enr,
              "/",
              V.cap || "·"
            ] }) : /* @__PURE__ */ i.jsxs("span", { className: "closed", children: [
              "● ",
              V.last ? `${c.lastOpenedPrefix} ${V.last}` : c.neverOpened
            ] }) : /* @__PURE__ */ i.jsx("span", { className: "loading", children: "…" })
          ] }),
          /* @__PURE__ */ i.jsxs("span", { className: "pg-pool-actions", children: [
            /* @__PURE__ */ i.jsx("button", { "data-act": "detay", "data-code": S.code, onClick: () => f(S.code), children: c.detailButton }),
            /* @__PURE__ */ i.jsx("button", { "data-act": "courses", "data-code": S.code, onClick: () => g(S.code), children: c.openInCourses })
          ] })
        ] }, S.code);
      })
    ] }, G)) })
  ] });
}
function oh({ data: a, labels: c, onClose: u, onPanTo: f, onOpenCourseDetail: g, onOpenInCourses: h }) {
  return a ? a.kind === "course" ? /* @__PURE__ */ i.jsx(nh, { data: a, labels: c, onClose: u, onPanTo: f, onOpenCourseDetail: g }) : /* @__PURE__ */ i.jsx(lh, { data: a, labels: c, onClose: u, onOpenCourseDetail: g, onOpenInCourses: h }) : null;
}
const ih = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--sans);font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--mono);font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.dersler-table-root .dt-relative{position:relative}.dersler-table-root .dt--ml-3{margin-left:-.75rem}.dersler-table-root .dt-ml-1\\.5{margin-left:.375rem}.dersler-table-root .dt-inline{display:inline}.dersler-table-root .dt-inline-flex{display:inline-flex}.dersler-table-root .dt-size-3\\.5{width:.875rem;height:.875rem}.dersler-table-root .dt-size-4{width:1rem;height:1rem}.dersler-table-root .dt-h-10{height:2.5rem}.dersler-table-root .dt-h-12{height:3rem}.dersler-table-root .dt-h-9{height:2.25rem}.dersler-table-root .dt-w-8{width:2rem}.dersler-table-root .dt-w-full{width:100%}.dersler-table-root .dt-caption-bottom{caption-side:bottom}.dersler-table-root .dt-cursor-pointer{cursor:pointer}.dersler-table-root .dt-items-center{align-items:center}.dersler-table-root .dt-justify-center{justify-content:center}.dersler-table-root .dt-overflow-auto{overflow:auto}.dersler-table-root .dt-overflow-hidden{overflow:hidden}.dersler-table-root .dt-whitespace-nowrap{white-space:nowrap}.dersler-table-root .dt-rounded-lg{border-radius:var(--radius-card)}.dersler-table-root .dt-rounded-md{border-radius:calc(var(--radius-card) - 2px)}.dersler-table-root .dt-border{border-width:1px}.dersler-table-root .dt-border-b{border-bottom-width:1px}.dersler-table-root .dt-border-border{border-color:var(--hairline)}.dersler-table-root .dt-bg-primary{background-color:var(--acid)}.dersler-table-root .dt-p-2{padding:.5rem}.dersler-table-root .dt-p-4{padding:1rem}.dersler-table-root .dt-p-6{padding:1.5rem}.dersler-table-root .dt-px-3{padding-left:.75rem;padding-right:.75rem}.dersler-table-root .dt-px-4{padding-left:1rem;padding-right:1rem}.dersler-table-root .dt-py-2{padding-top:.5rem;padding-bottom:.5rem}.dersler-table-root .dt-text-left{text-align:left}.dersler-table-root .dt-text-center{text-align:center}.dersler-table-root .dt-text-right{text-align:right}.dersler-table-root .dt-align-middle{vertical-align:middle}.dersler-table-root .dt-font-mono{font-family:var(--mono)}.dersler-table-root .dt-text-base{font-size:1rem;line-height:1.5rem}.dersler-table-root .dt-text-sm{font-size:.875rem;line-height:1.25rem}.dersler-table-root .dt-text-xs{font-size:.75rem;line-height:1rem}.dersler-table-root .dt-font-medium{font-weight:500}.dersler-table-root .dt-tabular-nums{--tw-numeric-spacing: tabular-nums;font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)}.dersler-table-root .dt-leading-none{line-height:1}.dersler-table-root .dt-text-muted-foreground{color:var(--dim)}.dersler-table-root .dt-text-primary-foreground{color:var(--on-accent)}.dersler-table-root .dt-opacity-40{opacity:.4}.dersler-table-root .dt-transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dersler-table-root{font-family:var(--sans);color:var(--fg)}.program-planner-root{--pp-slot: 34px;position:relative;min-width:0}.pp-heading{display:flex;align-items:center;gap:11px;margin:0 0 12px}.pp-heading-icon{display:grid;width:36px;height:36px;place-items:center;flex:0 0 auto;border:1px solid color-mix(in srgb,var(--acid) 34%,var(--line));border-radius:10px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.pp-heading-icon svg{width:18px;height:18px}.pp-heading>span:last-child{display:grid;gap:2px;min-width:0}.pp-heading strong{font-size:14px;letter-spacing:-.01em}.pp-heading small{color:var(--dimmer);font:10px/1.35 var(--mono)}.pp-loading{display:grid;min-height:260px;place-items:center;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2);font:11px/1.4 var(--mono)}.pp-calendar-scroll{max-height:min(69vh,780px);overflow:auto;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);scrollbar-width:thin}.pp-calendar{min-width:760px}.pp-calendar-head,.pp-calendar-body{display:grid;grid-template-columns:62px repeat(var(--pp-days),minmax(130px,1fr))}.pp-calendar-head{position:sticky;top:0;z-index:20;min-height:43px;border-bottom:1px solid var(--hairline-strong);background:var(--panel)}.pp-calendar-head>*{display:grid;place-items:center;border-right:1px solid var(--line)}.pp-calendar-head>span{position:sticky;left:0;z-index:22;background:var(--panel)}.pp-calendar-head b{color:var(--dim);font:700 10px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase}.pp-time-column{position:sticky;left:0;z-index:10;background:var(--panel);box-shadow:1px 0 0 var(--hairline-strong)}.pp-time-column span{display:block;height:var(--pp-slot);padding:5px 9px 0 0;color:var(--dimmer);text-align:right;font:9px/1 var(--mono);transform:translateY(-9px)}.pp-day-column{position:relative;min-width:0;border-right:1px solid var(--line);background-color:color-mix(in srgb,var(--panel) 97%,var(--fg));background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--pp-slot) - 1px),var(--line) calc(var(--pp-slot) - 1px),var(--line) var(--pp-slot))}.pp-day-column.is-weekend{background-color:var(--panel-2)}.pp-session{position:absolute;z-index:2;display:flex;flex-direction:column;gap:5px;overflow:hidden;padding:10px 25px 8px 10px;border:1px solid color-mix(in srgb,var(--pp-foreground) 25%,transparent);border-radius:8px;color:var(--pp-foreground);text-align:left;background:var(--pp-color);box-shadow:0 2px 6px color-mix(in srgb,var(--pp-color) 30%,transparent);cursor:pointer;transition:filter .14s ease,box-shadow .14s ease,transform .14s ease}.pp-session:hover,.pp-session:focus-visible{z-index:6;filter:saturate(1.08) brightness(1.04);box-shadow:0 7px 18px color-mix(in srgb,var(--pp-color) 42%,transparent);transform:translateY(-1px)}.pp-session:focus-visible{outline:3px solid var(--acid);outline-offset:2px}.pp-session.is-conflict{border:2px solid var(--red)}.pp-session.is-short{justify-content:center;padding-block:5px}.pp-session.is-short .pp-session-meta{display:none}.pp-session>strong{display:-webkit-box;overflow:hidden;color:inherit;font:800 11px/1.26 var(--sans);-webkit-box-orient:vertical;-webkit-line-clamp:3}.pp-session>strong span{font-weight:650}.pp-pin,.pp-more{position:absolute;right:7px;width:14px;height:14px;opacity:.75}.pp-pin{top:8px}.pp-more{bottom:7px}.pp-session-meta{display:grid;gap:3px;min-width:0}.pp-session-meta>span,.pp-agenda-detail{display:flex;align-items:center;gap:5px;min-width:0;overflow:hidden;color:inherit;font:9px/1.2 var(--mono);text-overflow:ellipsis;white-space:nowrap}.pp-session-meta svg,.pp-agenda-detail svg{width:11px;height:11px;flex:0 0 auto}.pp-conflict{display:flex;align-items:center;gap:4px;margin-top:auto;font:800 9px/1 var(--mono)}.pp-conflict svg{width:11px;height:11px}.pp-now{position:absolute;z-index:7;right:0;left:0;height:2px;background:var(--acid);pointer-events:none}.pp-now:before{position:absolute;top:-3px;left:-1px;width:8px;height:8px;border-radius:50%;background:var(--acid);content:""}.pp-empty,.pp-empty-day{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2)}.pp-empty svg,.pp-empty-day svg{width:25px;height:25px}.pp-empty strong,.pp-empty-day p{margin:0;font-size:12px}.pp-untimed{display:flex;gap:10px;margin-top:12px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-untimed>svg{width:18px;height:18px;flex:0 0 auto;color:var(--amber)}.pp-untimed>div{display:grid;gap:5px}.pp-untimed strong{font-size:11px}.pp-untimed span{color:var(--dim);font:10px/1.4 var(--mono)}.pp-context{position:fixed;z-index:10010;display:grid;width:224px;overflow:hidden;padding:6px;border:1px solid var(--hairline-strong);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pp-context p{display:grid;gap:2px;margin:0 0 4px;padding:8px 9px;border-bottom:1px solid var(--line)}.pp-context p strong{font-size:12px}.pp-context p span{color:var(--dimmer);font:9px/1 var(--mono)}.pp-context button{display:flex;align-items:center;gap:9px;width:100%;padding:8px 9px;border:0;border-radius:6px;color:var(--fg);text-align:left;background:transparent;font:11px/1.2 var(--sans)}.pp-context button:hover,.pp-context button:focus-visible{background:var(--panel-2)}.pp-context button.is-danger{color:var(--red)}.pp-context button svg{width:14px;height:14px}.pp-agenda{min-width:0}.pp-day-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:12px;padding:4px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-day-tabs button{position:relative;min-width:0;min-height:38px;border:0;border-radius:7px;color:var(--dim);background:transparent;font:700 10px/1 var(--mono)}.pp-day-tabs button.is-active{color:var(--panel);background:var(--fg)}.pp-day-tabs button>span{position:absolute;bottom:5px;left:50%;width:3px;height:3px;border-radius:50%;background:var(--acid)}.pp-agenda-list{display:grid;gap:8px}.pp-agenda-card{--pp-color: var(--cyan);display:grid;grid-template-columns:54px minmax(0,1fr);gap:12px;width:100%;padding:13px;border:1px solid var(--line);border-radius:11px;color:var(--fg);text-align:left;background:var(--panel);box-shadow:inset 4px 0 0 var(--pp-color)}.pp-agenda-card.is-conflict{border-color:var(--red)}.pp-agenda-time{display:grid;align-content:start;gap:3px;font:11px/1 var(--mono)}.pp-agenda-time small{color:var(--dimmer);font-size:9px}.pp-agenda-copy{display:grid;gap:5px;min-width:0}.pp-agenda-copy>strong{display:flex;align-items:center;gap:7px;font-size:13px}.pp-color-dot{width:7px;height:7px;border-radius:50%;background:var(--pp-color)}.pp-agenda-name{color:var(--dim);font-size:12px}.pp-agenda-copy em{display:flex;align-items:center;gap:5px;color:var(--red);font:700 10px/1 var(--mono)}.pp-agenda-copy em svg{width:12px;height:12px}.pp-empty-day{min-height:150px}.curriculum-plan-root{min-width:0;color:var(--fg);font-family:var(--sans)}.dp-semesters.dp-react{display:block}.cp-semester-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;align-items:stretch}.curriculum-plan-root .dp-sem{min-width:0;overflow:hidden;padding:0;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);height:100%}.curriculum-plan-root .dp-sem-head{position:relative;min-height:58px;margin:0;padding:13px 43px 12px 15px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);cursor:pointer}.curriculum-plan-root .dp-sem-head>span:first-child{font-size:15px;font-weight:750;letter-spacing:-.015em}.curriculum-plan-root .dp-sem-head:after{position:absolute;top:50%;right:17px;width:8px;height:8px;margin:-6px 0 0;border-right:1.5px solid var(--dim);border-bottom:1.5px solid var(--dim);content:"";transform:rotate(45deg);transition:transform .16s ease}@media(prefers-reduced-motion:reduce){.curriculum-plan-root .dp-sem-head:after{transition:none}}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head{margin:0;padding:13px 43px 12px 15px;border:0}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head:after{margin-top:-2px;transform:rotate(-45deg)}.curriculum-plan-root .dp-load{color:var(--dim);font:10px/1.25 var(--mono)}.curriculum-plan-root .dp-sem-avg{margin-left:auto;color:var(--acid);font:700 10px/1.25 var(--mono);white-space:nowrap}.curriculum-plan-root .dp-colhead{min-height:31px;margin:0 14px;padding:6px 0;border-bottom:1px solid var(--line);font-size:9px;letter-spacing:.06em}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin:0 14px;padding:0;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent}.curriculum-plan-root .dp-course:last-child,.curriculum-plan-root .dp-elective:last-child{border-bottom:0}.curriculum-plan-root .dp-row,.curriculum-plan-root .dp-colhead{grid-template-columns:32px minmax(0,1fr) 34px 94px 58px;-moz-column-gap:10px;column-gap:10px}.curriculum-plan-root .dp-row{min-height:52px;padding:8px 0}.curriculum-plan-root .dp-repeat-btn,.curriculum-plan-root .dp-repeat-cell{justify-self:center}.curriculum-plan-root .dp-credit{min-width:29px;height:24px;padding:0 5px;border-color:color-mix(in srgb,var(--acid) 28%,var(--line));border-radius:7px;color:var(--acid);background:color-mix(in srgb,var(--acid) 7%,var(--panel));font-size:10px}.curriculum-plan-root .dp-title{display:grid;gap:2px}.curriculum-plan-root .dp-code{width:-moz-fit-content;width:fit-content;color:var(--cyan);font:750 12px/1.25 var(--mono)}.curriculum-plan-root .dp-name{overflow:hidden;color:var(--dim);font-size:11px;line-height:1.3;text-overflow:ellipsis}.curriculum-plan-root .dp-repeat-btn{color:var(--dimmer)}.curriculum-plan-root .dp-repeat-btn svg{display:block}.curriculum-plan-root .dp-repeat-btn.on{color:var(--amber);background:color-mix(in srgb,var(--amber) 8%,transparent)}.curriculum-plan-root .dp-grade-wrap{width:94px;min-height:35px;justify-content:flex-end;border-radius:7px}.curriculum-plan-root .dp-grade{border-radius:5px;font-family:var(--mono)}.curriculum-plan-root .cp-grade-trigger{position:relative;display:inline-flex;align-items:center;justify-content:space-between;gap:7px;min-width:65px;min-height:31px;padding:5px 8px;border:1px solid var(--line);border-radius:7px;color:var(--dim);background:var(--panel);font:700 10px/1 var(--mono);cursor:pointer;transition:border-color .14s ease,background-color .14s ease,color .14s ease}.curriculum-plan-root .dp-sec-btn{width:58px;justify-content:center;text-align:center}.dt-course-name{display:flex;min-width:0;align-items:center;gap:8px}.dt-course-name>span{min-width:0}.dt-kind-badge{display:inline-flex;flex:0 0 auto;align-items:center;gap:5px;min-height:24px;padding:4px 7px;border:1px solid color-mix(in srgb,var(--acid) 42%,var(--line));border-radius:7px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel));font:700 9px/1 var(--sans);white-space:nowrap}.dt-kind-badge svg{width:12px;height:12px}.dt-kind-badge.graduation{border-color:color-mix(in srgb,var(--cyan) 42%,var(--line));color:var(--cyan);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.curriculum-plan-root .cp-grade-trigger:hover,.curriculum-plan-root .cp-grade-trigger[aria-expanded=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel))}.curriculum-plan-root .cp-grade-trigger.filled{border-color:color-mix(in srgb,var(--acid) 58%,var(--line));color:var(--fg)}.curriculum-plan-root .cp-grade-trigger svg{width:13px;height:13px;flex:0 0 auto;transition:transform .14s ease}.curriculum-plan-root .cp-grade-trigger[aria-expanded=true] svg{transform:rotate(180deg)}@media(prefers-reduced-motion:reduce){.curriculum-plan-root .cp-grade-trigger svg{transition:none}}.cp-grade-menu{position:fixed;z-index:10020;top:var(--cp-menu-y);left:var(--cp-menu-x);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;width:292px;max-width:calc(100vw - 20px);padding:8px;border:1px solid var(--hairline-strong);border-radius:11px;background:var(--panel);box-shadow:var(--shadow-float)}.cp-grade-menu.above{transform:translateY(-100%)}.cp-grade-menu button{position:relative;display:flex;align-items:center;justify-content:center;min-width:0;min-height:34px;padding:6px;border:1px solid transparent;border-radius:7px;color:var(--dim);background:var(--panel-2);font:700 10px/1 var(--mono);cursor:pointer}.cp-grade-menu button:hover,.cp-grade-menu button:focus-visible{border-color:var(--cyan);color:var(--fg);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.cp-grade-menu button[aria-selected=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 12%,var(--panel))}.cp-grade-menu button.is-empty{grid-column:1 / -1;justify-content:flex-start;padding-inline:10px}.cp-grade-menu button svg{position:absolute;top:50%;right:6px;width:12px;height:12px;color:var(--acid);transform:translateY(-50%)}.curriculum-plan-root .dp-grade-clear svg{display:block}.curriculum-plan-root .dp-sec-btn.open{padding:5px 8px;border:1px solid color-mix(in srgb,var(--cyan) 28%,var(--line));border-radius:7px;background:color-mix(in srgb,var(--cyan) 6%,var(--panel));font:650 10px/1 var(--sans);text-decoration:none}.curriculum-plan-root .dp-sec-btn.open:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-sec-btn.closed{font-size:10px}.curriculum-plan-root .dp-secslot{margin:0;padding:10px 0 12px;border-top:1px dashed var(--line)}.curriculum-plan-root .dp-section{min-height:31px}.curriculum-plan-root .dp-actions button{min-height:28px;padding:3px 7px;border:1px solid var(--line);border-radius:6px}.curriculum-plan-root .dp-actions button:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-elective{background:color-mix(in srgb,var(--acid) 3%,transparent)}.curriculum-plan-root .dp-elective-name{color:var(--dim);font-size:11px}.curriculum-plan-root .dp-epick{min-height:31px;border-radius:7px;background:var(--panel)}.cp-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.cp-empty svg{width:24px;height:24px}.cp-empty strong{font-size:12px}.exams-list-root{min-width:0;color:var(--fg);font-family:var(--sans)}.ex-table{overflow:hidden;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-head,.ex-row{display:grid;grid-template-columns:minmax(230px,1.45fr) minmax(145px,.9fr) minmax(105px,.62fr) minmax(170px,1fr) minmax(190px,1.05fr);align-items:center;gap:14px}.ex-head{min-height:36px;padding:8px 15px;color:var(--dimmer);border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);font:750 9px/1 var(--mono);letter-spacing:.055em;text-transform:uppercase}.ex-row{min-height:72px;padding:11px 15px;border-bottom:1px solid var(--line);transition:background-color .14s ease}.ex-row:last-child{border-bottom:0}.ex-row:hover{background:color-mix(in srgb,var(--cyan) 3%,var(--panel))}.ex-row.without-place{grid-template-columns:minmax(230px,1.5fr) minmax(155px,1fr) minmax(115px,.7fr) minmax(200px,1fr)}.ex-course{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:baseline;gap:3px 9px;min-width:0}.ex-course button,.ex-card-main button{width:-moz-fit-content;width:fit-content;padding:0;border:0;color:var(--cyan);background:transparent;font:800 12px/1.25 var(--mono);cursor:pointer}.ex-course button:hover,.ex-course button:focus-visible,.ex-card-main button:hover,.ex-card-main button:focus-visible{text-decoration:underline;text-underline-offset:3px}.ex-course strong{overflow:hidden;font-size:12px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.ex-course small{display:flex;grid-column:1 / -1;align-items:center;gap:4px;color:var(--dimmer);font:9px/1.2 var(--mono)}.ex-course small svg{width:10px;height:10px}.ex-meta{display:flex;align-items:flex-start;gap:6px;min-width:0;color:var(--dim);font-size:11px;line-height:1.35}.ex-meta svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-type{display:inline-flex;padding:5px 7px;border:1px solid color-mix(in srgb,var(--acid) 24%,var(--line));border-radius:6px;color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel));font:650 10px/1.15 var(--sans);font-style:normal}.ex-when{display:grid;gap:5px}.ex-when strong,.ex-when span{display:flex;align-items:center;gap:6px}.ex-when strong{font-size:11px}.ex-when span{color:var(--dim);font:10px/1.2 var(--mono)}.ex-when svg{width:13px;height:13px;color:var(--dimmer)}.ex-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.ex-empty svg{width:25px;height:25px}.ex-empty strong{font-size:12px}.ex-agenda{display:grid;gap:15px}.ex-day{overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-day>header{display:flex;align-items:center;gap:8px;min-height:42px;padding:9px 12px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2)}.ex-day>header svg{width:15px;height:15px;color:var(--acid)}.ex-day>header strong{font:750 11px/1 var(--mono)}.ex-day>header span{margin-left:auto;color:var(--dim);font-size:11px}.ex-card{display:grid;grid-template-columns:74px minmax(0,1fr);gap:12px;padding:13px 12px;border-bottom:1px solid var(--line)}.ex-card:last-child{border-bottom:0}.ex-card-time{display:flex;align-items:flex-start;gap:5px;color:var(--fg);font:700 10px/1.35 var(--mono)}.ex-card-time svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main{display:grid;gap:5px;min-width:0}.ex-card-main>strong{font-size:12px;line-height:1.3}.ex-card-main>span{display:flex;align-items:center;gap:6px;min-width:0;color:var(--dim);font-size:10px;line-height:1.35}.ex-card-main>span svg{width:12px;height:12px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main>span i{width:3px;height:3px;margin-inline:2px;border-radius:50%;background:var(--dimmer)}@media(max-width:900px){.cp-semester-grid{grid-template-columns:1fr}.ex-head,.ex-row{grid-template-columns:minmax(210px,1.45fr) minmax(135px,.85fr) minmax(95px,.62fr) minmax(175px,1fr)}.ex-head>:nth-child(4):not(:last-child),.ex-row>:nth-child(4):not(:last-child){display:none}}@media(max-width:560px){.curriculum-plan-root .dp-sem-head{flex-wrap:nowrap;gap:7px;min-height:48px;padding-block:10px}.curriculum-plan-root .dp-sem-head>span:first-child{width:auto;flex:0 0 auto;font-size:13px}.curriculum-plan-root .dp-load{overflow:hidden;flex:1 1 auto;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-sem-avg{margin-left:auto;font-size:9px}.curriculum-plan-root .dp-colhead{display:none}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin-inline:10px}.curriculum-plan-root .dp-row,.curriculum-plan-root .dp-elective .dp-row{grid-template-columns:34px minmax(0,1fr) auto;gap:4px 8px;min-height:60px;padding:7px 0}.curriculum-plan-root .dp-credit{grid-column:1;grid-row:1 / 3;align-self:center}.curriculum-plan-root .dp-title{display:flex;grid-column:2;grid-row:1;align-items:baseline;gap:6px;overflow:hidden;white-space:nowrap}.curriculum-plan-root .dp-code{flex:0 0 auto;font-size:11px;min-height:28px}.curriculum-plan-root .dp-name{min-width:0;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-repeat-btn,.curriculum-plan-root .dp-repeat-cell{grid-column:3;grid-row:1}.curriculum-plan-root .dp-grade-wrap,.curriculum-plan-root .dp-elective-inputs{grid-column:2;grid-row:2;justify-self:start}.curriculum-plan-root .dp-sec-btn{grid-column:3;grid-row:1 / 3;align-self:center}.curriculum-plan-root .cp-grade-trigger{min-height:34px;padding:5px 7px}.curriculum-plan-root .cp-grade-trigger:after{position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;content:""}.curriculum-plan-root .dp-grade-clear{min-height:32px}.cp-grade-menu,.cp-grade-menu.above{top:auto;right:10px;bottom:max(10px,env(safe-area-inset-bottom));left:10px;grid-template-columns:repeat(5,minmax(0,1fr));width:auto;max-width:none;gap:4px;padding:7px;transform:none}.cp-grade-menu button{min-height:42px;padding:5px 3px;font-size:9px}.cp-grade-menu button.is-empty{min-height:38px}.cp-grade-menu button svg{right:5px;width:11px;height:11px}}@media(max-width:600px){.pp-heading{margin-bottom:10px}.pp-heading-icon{width:32px;height:32px}.pp-day-tabs{overflow-x:auto;grid-template-columns:repeat(var(--pp-days, 5),minmax(48px,1fr))}}@media(prefers-reduced-motion:reduce){.pp-session{transition:none}}.pcl-list{position:relative;display:grid;gap:8px;color:var(--fg);font-family:var(--sans)}.pcl-head{display:grid;grid-template-columns:1fr auto;padding:8px 2px 2px;color:var(--dimmer);font:700 9px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase}.pcl-item{position:relative;display:grid;grid-template-columns:16px minmax(0,1fr) auto 30px 30px;grid-template-areas:none;gap:6px;align-items:start;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel);cursor:pointer;transition:background-color .14s ease,transform .14s ease,border-color .14s ease,box-shadow .14s ease}.pcl-item:hover{border-color:var(--line-hot);box-shadow:0 3px 10px #00000014;transform:translateY(-1px)}.pcl-item.is-full{border-color:color-mix(in srgb,var(--red) 35%,var(--line));background:color-mix(in srgb,var(--red) 4%,var(--panel))}.pcl-item.is-dragging{opacity:.45}.pcl-item.is-drop-target{box-shadow:inset 0 2px 0 0 var(--acid)}.pcl-grip{width:14px;height:14px;margin-top:2px;color:var(--dimmer);cursor:grab}.pcl-item.is-dragging .pcl-grip{cursor:grabbing}@media(prefers-reduced-motion:reduce){.pcl-item{transition:none}}.pcl-course{min-width:0}.pcl-title{display:flex;flex-wrap:wrap;align-items:center;gap:6px}.pcl-title strong{color:var(--cyan);font:800 11px/1.2 var(--mono)}.pcl-status{display:inline-flex;align-items:center;gap:4px;padding:2px 7px 2px 6px;border-radius:999px;font:700 8px/1.4 var(--sans);letter-spacing:.02em;text-transform:uppercase}.pcl-status:before{content:"";width:5px;height:5px;border-radius:50%;background:currentColor}.pcl-status.is-open{color:var(--acid);background:color-mix(in srgb,var(--acid) 12%,transparent)}.pcl-status.is-full{color:var(--red);background:color-mix(in srgb,var(--red) 12%,transparent)}.pcl-kind-badge{padding:3px 5px;border:1px solid color-mix(in srgb,var(--acid) 40%,var(--line));border-radius:5px;color:var(--acid);font:700 8px/1 var(--sans)}.pcl-course>p{margin:4px 0 7px;overflow:hidden;color:var(--fg);font-size:11px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.pcl-meta{display:grid;gap:4px;color:var(--dim);font-size:9px}.pcl-meta span{display:flex;align-items:center;gap:5px;min-width:0}.pcl-meta svg{width:11px;height:11px;flex:0 0 auto;color:var(--dimmer)}.pcl-instructor{gap:6px!important}.pcl-avatar{display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:16px;height:16px;border-radius:50%;background:var(--panel-2)}.pcl-avatar svg{width:9px;height:9px;margin:0}.pcl-course small{display:block;margin-top:6px;color:var(--acid);font:700 9px/1.2 var(--mono)}.pcl-numbers,.pcl-remove{grid-area:auto}.pcl-numbers{display:grid;justify-items:end;gap:5px;font-family:var(--mono)}.pcl-numbers b{font-size:10px;font-variant-numeric:tabular-nums}.pcl-numbers span{color:var(--dimmer);font-size:8px}.pcl-numbers em{color:var(--amber);font-size:8px;font-style:normal}.pcl-remove,.pcl-menu-trigger{display:grid;width:28px;height:28px;place-items:center;padding:0;border:1px solid transparent;border-radius:7px;color:var(--dimmer);background:transparent;cursor:pointer}.pcl-remove{display:grid}.pcl-menu-trigger:hover,.pcl-menu-trigger:focus-visible{border-color:var(--line-hot);color:var(--fg);background:var(--panel-2)}.pcl-menu-trigger svg,.pcl-remove svg{width:14px;height:14px}.pcl-menu-wrap{position:relative}.pcl-menu{position:absolute;z-index:30;top:31px;right:0;display:grid;width:208px;padding:6px;border:1px solid var(--line-hot);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pcl-menu button{display:flex;align-items:center;gap:8px;min-height:34px;padding:7px 9px;border:0;border-radius:6px;color:var(--fg);background:transparent;font:600 10px/1.2 var(--sans);text-align:left;cursor:pointer}.pcl-menu button:hover,.pcl-menu button:focus-visible{background:var(--panel-2)}.pcl-menu button.is-danger{color:var(--red)}.pcl-menu svg{width:13px;height:13px}.pcl-empty{display:grid;min-height:150px;place-items:center;align-content:center;gap:8px;color:var(--dimmer);text-align:center}.pcl-empty svg{width:24px;height:24px}.pcl-empty strong{max-width:25ch;font-size:11px}.cdr-root{display:flex;min-height:0;height:100%;flex-direction:column;color:var(--fg);background:var(--panel);font-family:var(--sans)}.cdr-head{display:flex;min-height:128px;flex:0 0 auto;align-items:flex-start;justify-content:space-between;gap:24px;padding:28px 76px 22px 28px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--acid) 2.5%,var(--panel))}.cdr-title{min-width:0}.cdr-title h3{display:flex;align-items:center;gap:16px;margin:0 0 13px}.cdr-title .d-code{display:inline-flex;min-height:38px;align-items:center;padding:0 11px;border:1px solid var(--line-hot);border-radius:8px;color:var(--cyan);background:var(--panel);font:800 12px/1 var(--mono);white-space:nowrap}.cdr-title .d-name{color:var(--fg);font-family:var(--display);font-size:clamp(21px,3vw,30px);font-weight:750;line-height:1.1;letter-spacing:-.025em}.cdr-title .d-meta{display:flex;flex-wrap:wrap;gap:6px}.cdr-title .d-pill,.cdr-kind{display:inline-flex;min-height:25px;align-items:center;gap:5px;padding:4px 8px;border:1px solid var(--line);border-radius:7px;color:var(--dim);background:var(--panel);font:650 9px/1 var(--sans)}.cdr-kind{border-color:color-mix(in srgb,var(--acid) 44%,var(--line));color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.cdr-kind.graduation{border-color:color-mix(in srgb,var(--cyan) 42%,var(--line));color:var(--cyan);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.cdr-kind svg{width:12px;height:12px}.cdr-obs{display:inline-flex;align-items:center;gap:7px}.cdr-obs svg{width:14px;height:14px;order:-1}.cdr-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;flex:0 0 auto;padding:0 28px;border:0;border-bottom:1px solid var(--line);border-radius:0;background:var(--panel)}.cdr-tabs button{position:relative;display:flex;min-width:0;min-height:52px;align-items:center;justify-content:center;gap:7px;padding:8px;border:0;border-radius:0;color:var(--dim);background:transparent;font:700 11px/1 var(--sans);cursor:pointer}.cdr-tabs button svg{width:13px;height:13px}.cdr-tabs button>span{min-width:0;padding:0;border:0;border-radius:0;color:inherit;background:transparent;font:inherit}.cdr-tabs button b{min-width:19px;padding:3px 5px;border-radius:999px;color:var(--dim);background:var(--panel-2);font:700 8px/1 var(--mono)}.cdr-tabs button:after{position:absolute;right:22%;bottom:-1px;left:22%;height:2px;border-radius:2px 2px 0 0;background:var(--acid);content:"";opacity:0;transform:scaleX(.5);transition:opacity .14s ease,transform .14s ease}@media(prefers-reduced-motion:reduce){.cdr-tabs button:after{transition:none}}.cdr-tabs button:hover{color:var(--fg);background:color-mix(in srgb,var(--acid) 3%,transparent)}.cdr-tabs button[aria-selected=true]{color:var(--fg);background:transparent;box-shadow:none}.cdr-tabs button[aria-selected=true]:after{opacity:1;transform:scaleX(1)}.cdr-tabs button[aria-selected=true] svg{color:var(--acid)}.cdr-panels{min-height:0;flex:1 1 auto;overflow-y:auto;padding:24px 28px 30px;overscroll-behavior:contain;scrollbar-color:var(--line-hot) transparent}.cdr-panels>section>div:not(.cdr-sections){max-width:880px;margin-inline:auto}.cdr-section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:14px;padding-bottom:13px;border-bottom:1px solid var(--line)}.cdr-section-heading h4{margin:0;color:var(--fg);font-family:var(--display);font-size:18px;letter-spacing:-.015em}.cdr-section-heading p{margin:5px 0 0;color:var(--dimmer);font-size:10px}.cdr-section-heading>span{display:grid;width:28px;height:28px;place-items:center;border:1px solid var(--line);border-radius:8px;color:var(--acid);background:var(--panel-2);font:750 10px/1 var(--mono)}.cdr-section-list{display:grid}.cdr-section{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:16px;align-items:start;padding:17px 6px;border-bottom:1px solid var(--line)}.cdr-section:first-child{border-top:1px solid var(--line)}.cdr-section.is-focus{margin-inline:-10px;padding-inline:16px;border-radius:10px;background:color-mix(in srgb,var(--acid) 8%,var(--panel));box-shadow:inset 2px 0 0 var(--acid)}.cdr-section-code{display:grid;gap:4px}.cdr-section-code span{color:var(--dimmer);font:700 8px/1 var(--sans);letter-spacing:.08em}.cdr-section-code strong{color:var(--cyan);font:800 11px/1.2 var(--mono)}.cdr-section-body{display:grid;min-width:0;gap:7px}.cdr-section-top{display:flex;min-width:0;align-items:center;justify-content:space-between;gap:16px}.cdr-instructor{display:flex;min-width:0;align-items:center;gap:6px;padding:0;border:0;color:var(--fg);background:transparent;font:700 11px/1.3 var(--sans);text-align:left;overflow-wrap:anywhere;cursor:pointer}.cdr-instructor:hover,.cdr-instructor:focus-visible{color:var(--cyan);text-decoration:underline;text-underline-offset:3px}.cdr-instructor svg,.cdr-section-meta svg,.cdr-section-times svg{width:12px;height:12px;flex:0 0 auto;color:var(--dimmer)}.cdr-section-top>span{color:var(--dim);font:700 10px/1 var(--mono);white-space:nowrap}.cdr-section-meta{display:flex;align-items:center;gap:6px;margin:0;color:var(--dim);font-size:10px}.cdr-section-times{display:grid;gap:4px;color:var(--dim);font-size:10px}.cdr-section-times span{display:flex;align-items:flex-start;gap:6px}.cdr-section-body>small{color:var(--dimmer);font-size:9px}.cdr-add{display:inline-flex;min-height:34px;align-items:center;gap:6px;padding:7px 10px;border:1px solid color-mix(in srgb,var(--cyan) 44%,var(--line));border-radius:8px;color:var(--cyan);background:color-mix(in srgb,var(--cyan) 6%,var(--panel));font:700 10px/1 var(--sans);cursor:pointer;white-space:nowrap}.cdr-add:hover,.cdr-add:focus-visible{border-color:var(--cyan);background:color-mix(in srgb,var(--cyan) 11%,var(--panel))}.cdr-add svg{width:13px;height:13px}.cdr-rules{margin-top:2px;color:var(--dim);font-size:10px}.cdr-rules summary{display:inline-flex;align-items:center;gap:5px;color:var(--cyan);cursor:pointer}.cdr-rules summary svg{width:12px;height:12px;transition:transform .14s ease}@media(prefers-reduced-motion:reduce){.cdr-rules summary svg{transition:none}}.cdr-rules[open] summary svg{transform:rotate(180deg)}.cdr-rules p{margin:7px 0 0}.cdr-rules p b{margin-right:6px;color:var(--dimmer)}.cdr-more{display:block;min-height:36px;margin:15px auto 0;padding:7px 12px;border:1px solid var(--line-hot);border-radius:8px;color:var(--fg);background:var(--panel);font:700 10px/1 var(--sans);cursor:pointer}.cdr-overview{max-width:880px;margin-inline:auto}.cdr-prereq{margin-block:22px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);overflow:hidden}.cdr-prereq-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;padding:5px;background:color-mix(in srgb,var(--fg) 3%,var(--panel-2))}.cdr-prereq-tabs button{display:flex;min-width:0;min-height:42px;align-items:center;justify-content:center;gap:8px;padding:8px 12px;border:1px solid transparent;border-radius:8px;color:var(--dim);background:transparent;font:700 11px/1.2 var(--sans);cursor:pointer}.cdr-prereq-tabs button:hover{color:var(--fg);background:color-mix(in srgb,var(--fg) 3%,transparent)}.cdr-prereq-tabs button[aria-selected=true]{border-color:var(--line-hot);color:var(--fg);background:var(--panel);box-shadow:0 1px 4px color-mix(in srgb,var(--bg) 32%,transparent)}.cdr-prereq-tabs button[aria-selected=true] svg{color:var(--acid)}.cdr-prereq-tabs svg{width:14px;height:14px;flex:0 0 auto}.cdr-prereq-tabs b{display:grid;min-width:19px;height:19px;place-items:center;border-radius:6px;color:var(--dim);background:var(--panel-2);font:750 8px/1 var(--mono)}.cdr-prereq-body{min-height:98px;padding:18px;border-top:1px solid var(--line);background:var(--panel)}.cdr-prereq-body>div[hidden]{display:none}.cdr-prereq-body .empty{margin:0}.cdr-history{max-width:900px;margin-inline:auto}.cdr-history-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;padding-bottom:14px;border-bottom:1px solid var(--line)}.cdr-history-head h4{margin:0;color:var(--fg);font-family:var(--display);font-size:18px;letter-spacing:-.015em}.cdr-history-head p{margin:5px 0 0;color:var(--dimmer);font-size:10px}.cdr-history-head>span{display:inline-flex;min-height:28px;align-items:center;gap:6px;padding:0 9px;border:1px solid var(--line);border-radius:8px;color:var(--acid);background:var(--panel-2);font:750 10px/1 var(--mono)}.cdr-history-head svg,.cdr-history-caption svg,.cdr-history-records summary svg{width:13px;height:13px}.cdr-history-figure{margin:0;padding:18px 0 22px}.cdr-history-legend{display:flex;justify-content:flex-end;gap:14px;margin-bottom:9px;color:var(--dimmer);font:650 9px/1 var(--sans)}.cdr-history-legend span{display:inline-flex;align-items:center;gap:6px}.cdr-history-legend i{width:11px;height:11px;border-radius:3px;background:var(--cyan)}.cdr-history-legend i.enrolled{background:var(--acid)}.cdr-history-chart{display:flex;height:172px;align-items:end;gap:9px;padding:17px 10px 0;border:1px solid var(--line);border-radius:10px;background-color:color-mix(in srgb,var(--panel-2) 64%,var(--panel));background-image:radial-gradient(circle,color-mix(in srgb,var(--dim) 18%,transparent) 1px,transparent 1px);background-size:13px 13px;overflow-x:auto;scrollbar-width:thin}.cdr-history-term{display:grid;min-width:56px;height:100%;flex:1 0 56px;grid-template-rows:minmax(0,1fr) 26px;align-items:end;justify-items:stretch;gap:7px;padding:0;border:0;color:var(--dimmer);background:transparent;cursor:pointer}.cdr-history-bars{display:flex;width:min(100%,52px);height:100%;min-height:10px;align-items:end;justify-self:center;justify-content:center;gap:5px;transition:transform .14s ease}@media(prefers-reduced-motion:reduce){.cdr-history-bars{transition:none}}.cdr-history-bars i{display:block;width:19px;min-height:3px;border-radius:5px 5px 1px 1px;transition:background-color .16s ease}.cdr-history-bars i.capacity{background:color-mix(in srgb,var(--dimmer) 55%,transparent)}.cdr-history-bars i.enrolled{background:color-mix(in srgb,var(--dimmer) 32%,transparent)}.cdr-history-term:hover .cdr-history-bars i.capacity,.cdr-history-term:focus-visible .cdr-history-bars i.capacity,.cdr-history-term.is-active .cdr-history-bars i.capacity{background:var(--cyan)}.cdr-history-term:hover .cdr-history-bars i.enrolled,.cdr-history-term:focus-visible .cdr-history-bars i.enrolled,.cdr-history-term.is-active .cdr-history-bars i.enrolled{background:var(--acid)}.cdr-history-term.is-full:hover .cdr-history-bars i.enrolled,.cdr-history-term.is-full:focus-visible .cdr-history-bars i.enrolled,.cdr-history-term.is-full.is-active .cdr-history-bars i.enrolled{background:var(--red)}.cdr-history-term small{font:650 9px/1 var(--sans);white-space:nowrap}.cdr-history-term:hover .cdr-history-bars,.cdr-history-term:focus-visible .cdr-history-bars,.cdr-history-term.is-active .cdr-history-bars{transform:translateY(-3px)}.cdr-history-term.is-active .cdr-history-bars i{box-shadow:0 0 0 2px color-mix(in srgb,var(--acid) 22%,transparent)}@media(prefers-reduced-motion:reduce){.cdr-history-bars i{transition:none}}.cdr-history-term.is-active small{color:var(--fg);font-weight:800}.cdr-history-caption{display:flex;min-height:42px;align-items:center;gap:17px;margin-top:11px;padding:8px 11px;border:1px solid var(--line);border-radius:9px;color:var(--dim);background:var(--panel-2);font-size:10px}.cdr-history-caption span{display:inline-flex;align-items:center;gap:5px}.cdr-history-caption b{color:var(--fg);font-weight:750}.cdr-history-caption>strong{margin-left:auto;color:var(--acid);font:800 14px/1 var(--mono)}.cdr-history-toggle{display:block;margin:13px auto 0;padding:7px 10px;border:0;color:var(--cyan);background:transparent;font:700 10px/1 var(--sans);text-decoration:underline;text-underline-offset:3px;cursor:pointer}.cdr-history-records{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.cdr-history-records>summary{display:grid;min-height:48px;grid-template-columns:minmax(0,1fr) auto 18px;align-items:center;gap:10px;color:var(--fg);cursor:pointer;list-style:none}.cdr-history-records>summary::-webkit-details-marker{display:none}.cdr-history-records>summary span{display:inline-flex;align-items:center;gap:8px;font-weight:750}.cdr-history-records>summary b{display:grid;min-width:24px;height:24px;place-items:center;border-radius:7px;color:var(--dim);background:var(--panel-2);font:750 9px/1 var(--mono)}.cdr-history-records>summary>svg{color:var(--dimmer);transition:transform .14s ease}@media(prefers-reduced-motion:reduce){.cdr-history-records>summary>svg{transition:none}}.cdr-history-records[open]>summary>svg{transform:rotate(180deg)}.cdr-history-record-list{padding:0 0 14px}.cdr-history-record-list>section{padding:14px 0;border-top:1px solid var(--line)}.cdr-history-record-list>section>header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:7px}.cdr-history-record-list>section>header strong{color:var(--fg);font-size:11px}.cdr-history-record-list>section>header span{color:var(--dim);font:700 9px/1 var(--mono)}.cdr-history-record{display:grid;min-height:31px;grid-template-columns:minmax(0,1fr) auto 42px;align-items:center;gap:12px;padding:5px 8px;border-radius:6px;color:var(--dim);font-size:10px}.cdr-history-record:nth-child(2n){background:var(--panel-2)}.cdr-history-record small{color:var(--dimmer)}.cdr-history-record>b{color:var(--acid);font:750 10px/1 var(--mono);text-align:right}.cdr-history-empty{display:grid;min-height:220px;place-content:center;justify-items:center;gap:8px;color:var(--dimmer);text-align:center}.cdr-history-empty svg{width:28px;height:28px;color:var(--acid)}.cdr-history-empty strong{color:var(--fg);font-family:var(--display)}.cdr-history-empty p{max-width:48ch;margin:0;font-size:11px}.pp-tooltip{position:fixed;z-index:10030;width:286px;padding:12px;border:1px solid var(--line-hot);border-radius:11px;color:var(--fg);background:var(--panel);box-shadow:var(--shadow-float);pointer-events:none;transform:translateY(-100%);animation:pp-tooltip-in .13s cubic-bezier(.2,.8,.2,1)}.pp-tooltip[data-side=bottom]{transform:none}.pp-tooltip-title{display:grid;grid-template-columns:8px 1fr auto;align-items:center;gap:7px}.pp-tooltip-title>span{width:8px;height:8px;border-radius:3px}.pp-tooltip-title strong{font:800 11px/1.2 var(--mono)}.pp-tooltip-title b{color:var(--dim);font:700 9px/1 var(--mono)}.pp-tooltip>p{margin:7px 0 9px;font-size:11px;font-weight:700;line-height:1.35}.pp-tooltip dl{display:grid;gap:5px;margin:0}.pp-tooltip dl div{display:grid;grid-template-columns:16px 1fr;align-items:center;color:var(--dim);font-size:10px}.pp-tooltip dt,.pp-tooltip dd{margin:0}.pp-tooltip svg{width:11px;height:11px}.pp-tooltip>small{display:block;margin-top:10px;padding-top:8px;color:var(--dimmer);border-top:1px solid var(--line);font-size:8px}@keyframes pp-tooltip-in{0%{opacity:.2;filter:blur(3px)}to{opacity:1;filter:blur(0)}}@media(max-width:600px){.pcl-item{grid-template-columns:14px minmax(0,1fr) auto 44px 44px;padding-block:12px}.pcl-remove,.pcl-menu-trigger{display:grid;width:44px;height:44px}.pcl-course>p{white-space:normal}.pcl-meta{grid-template-columns:1fr}.cdr-head{min-height:0;padding:20px 56px 16px 16px}.cdr-title h3{display:grid;gap:8px}.cdr-tabs{position:sticky;top:0;z-index:4;margin-inline:0;padding-inline:6px}.cdr-tabs button{min-height:44px;padding-inline:4px}.cdr-tabs button svg{display:none}.cdr-title .d-name{font-size:18px}.cdr-panels{padding:16px 14px 24px}.cdr-section{grid-template-columns:52px minmax(0,1fr);gap:10px;padding-block:14px}.cdr-section-top{display:grid;gap:6px}.cdr-add{grid-column:2;justify-self:start}.cdr-section.is-focus{margin-inline:-5px;padding-inline:10px}.cdr-history-chart{margin-inline:-14px;padding-inline:14px}.cdr-history-caption{display:grid;grid-template-columns:1fr auto;gap:6px 12px}.cdr-history-caption>strong{grid-column:2;grid-row:1 / span 2;align-self:center}.cdr-history-record-list>section>header{align-items:flex-start}.cdr-history-record{grid-template-columns:minmax(0,1fr) 38px}.cdr-history-record small{grid-column:1;grid-row:2}.cdr-history-record>b{grid-column:2;grid-row:1 / span 2}.pp-tooltip{display:none}}@media print{.program-planner-root .pp-calendar-scroll{max-height:none;overflow:visible;box-shadow:none}.program-planner-root .pp-calendar{min-width:0}.program-planner-root .pp-context{display:none}}.gpa-summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.gpa-summary-card{position:relative;display:grid;grid-template-columns:38px minmax(0,1fr);gap:11px;align-items:start;min-height:92px;padding:15px;border:1px solid color-mix(in srgb,var(--hairline) 82%,transparent);border-radius:13px;background:linear-gradient(145deg,color-mix(in srgb,var(--panel) 96%,var(--accent) 4%),var(--panel));overflow:hidden}.gpa-summary-card:after{content:"";position:absolute;right:-24px;bottom:-34px;width:88px;height:88px;border-radius:50%;background:color-mix(in srgb,var(--accent) 9%,transparent);pointer-events:none}.gpa-summary-icon{display:grid;place-items:center;width:38px;height:38px;border-radius:11px;color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);border:1px solid color-mix(in srgb,var(--accent) 28%,transparent)}.gpa-summary-icon svg{width:19px;height:19px}.gpa-summary-card>div{display:grid;gap:3px;min-width:0}.gpa-summary-card em{font-style:normal;color:var(--dim);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.gpa-summary-card b{color:var(--fg);font-size:18px;line-height:1.25;overflow-wrap:anywhere}.gpa-summary-card small{color:var(--dimmer);font-size:11px;line-height:1.35}.gpa-summary-card.is-target b{font-size:13px;line-height:1.45}@media(max-width:760px){.gpa-summary-grid{grid-template-columns:1fr}.gpa-summary-card{min-height:76px}}.fc-term{color:var(--fg);font-size:13px;padding-right:8px}.fc-pill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 4px 0 9px;border:1px solid var(--line-hot);border-radius:8px;background:var(--panel);color:var(--dim);font-family:var(--sans);font-size:12px;line-height:1}.fc-divider{width:1px;height:13px;background:var(--hairline-strong)}.fc-value{color:var(--fg);font-weight:700}.fc-x{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dim);cursor:pointer;transition:background-color .14s ease,color .14s ease}.fc-x svg{width:12px;height:12px}.fc-x:hover{color:var(--acid);background:color-mix(in srgb,var(--acid) 10%,transparent)}.fc-x:focus-visible{outline:2px solid var(--cyan);outline-offset:1px}@media(prefers-reduced-motion:reduce){.fc-x{transition:none}}.tg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.tg-card{display:flex;gap:12px;padding:16px;border:1px solid var(--hairline-strong);border-radius:14px;background:var(--panel)}.tg-card.is-missing{border-style:dashed;opacity:.65}.tg-icon{display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:36px;height:36px;border-radius:8px;background:var(--panel-2);color:var(--acid)}.tg-icon svg{width:18px;height:18px}.tg-card.is-missing .tg-icon{color:var(--dimmer)}.tg-body{min-width:0;flex:1 1 auto}.tg-body h3{display:flex;align-items:center;gap:8px;margin:0 0 6px;color:var(--fg);font-size:15px;letter-spacing:-.01em}.tg-badge{padding:2px 7px;border:1px solid var(--line-hot);border-radius:6px;color:var(--dim);font:700 9px/1.4 var(--mono);text-transform:uppercase;letter-spacing:.06em}.tg-badge.is-live{color:var(--on-accent);background:var(--acid-vivid);border-color:var(--acid-vivid)}.tg-meta{margin:0;color:var(--dim);font-size:12px}.tg-meta.is-warn{color:var(--amber)}.tg-links{display:flex;flex-direction:column;gap:6px;flex:0 0 auto;justify-content:center}.tg-link{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--line-hot);border-radius:8px;color:var(--cyan);text-decoration:none;font-size:11px;white-space:nowrap;transition:border-color .14s ease,background-color .14s ease,color .14s ease}.tg-link svg{width:13px;height:13px}.tg-link:hover{border-color:var(--acid);background:var(--panel-2);color:var(--acid)}.tg-link:focus-visible{outline:2px solid var(--cyan);outline-offset:1px}@media(prefers-reduced-motion:reduce){.tg-link{transition:none}}@media(max-width:560px){.tg-card{flex-direction:column}.tg-links{flex-direction:row}}.atl-group{margin:0 0 22px}.atl-group h3{margin:0 0 10px;color:var(--dim);font:700 11px/1.3 var(--mono);text-transform:uppercase;letter-spacing:.1em}.atl-list{display:grid;gap:0;list-style:none;margin:0;padding:0}.atl-row{display:grid;grid-template-columns:22px minmax(0,1fr) auto auto;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid var(--line)}.atl-row:last-child{border-bottom:0}.atl-icon{display:flex;align-items:center;justify-content:center;width:22px;height:22px;color:var(--dimmer)}.atl-icon svg{width:15px;height:15px}.atl-row.is-now .atl-icon{color:var(--amber)}.atl-row.is-upcoming .atl-icon{color:var(--cyan)}.atl-title{min-width:0;color:var(--fg);font-size:13px}.atl-row.is-past .atl-title{color:var(--dimmer)}.atl-date{color:var(--cyan);font:700 11px/1.3 var(--mono)}.atl-row.is-past .atl-date{color:var(--dimmer)}.atl-left{color:var(--dim);font-size:11px;text-align:right}.atl-row.is-now{background:var(--now-bg)}.atl-row.is-now .atl-left{color:var(--amber)}@media(max-width:640px){.atl-row{grid-template-columns:22px 1fr;row-gap:2px}.atl-date,.atl-left{grid-column:2;text-align:left}}.dersler-table-root .hover\\:dt-bg-accent:hover{background-color:var(--panel-2)}.dersler-table-root .hover\\:dt-text-accent-foreground:hover{color:var(--acid)}.dersler-table-root .focus-visible\\:dt-outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.dersler-table-root .focus-visible\\:dt-ring-2:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.dersler-table-root .focus-visible\\:dt-ring-ring:focus-visible{--tw-ring-color: var(--cyan)}.dersler-table-root .focus-visible\\:dt-ring-offset-2:focus-visible{--tw-ring-offset-width: 2px}.dersler-table-root .disabled\\:dt-pointer-events-none:disabled{pointer-events:none}.dersler-table-root .disabled\\:dt-opacity-50:disabled{opacity:.5}.dersler-table-root .data-\\[state\\=selected\\]\\:dt-bg-muted[data-state=selected]{background-color:var(--panel-2)}.dersler-table-root .\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:dt-pr-0:has([role=checkbox]){padding-right:0}.dersler-table-root :is(.\\[\\&_tr\\:last-child\\]\\:dt-border-0 tr:last-child){border-width:0px}.dersler-table-root :is(.\\[\\&_tr\\]\\:dt-border-b tr){border-bottom-width:1px}';
let fr = null, Ut = null, Vt = null, Bt = null, Wt = null, kt = null, zr = null, _r = null, Ft = null, $t = null, Mr = null, Ht = null, Pr = null, fo = null;
function at() {
  fo || (fo = document.createElement("style"), fo.textContent = ih, document.head.appendChild(fo));
}
function ah(a, c) {
  at(), fr = it.createRoot(a), fr.render(
    /* @__PURE__ */ i.jsx(Q.StrictMode, { children: /* @__PURE__ */ i.jsx(sd, { ...c }) })
  );
}
function sh(a) {
  fr && fr.render(
    /* @__PURE__ */ i.jsx(Q.StrictMode, { children: /* @__PURE__ */ i.jsx(sd, { ...a }) })
  );
}
function uh() {
  fr == null || fr.unmount(), fr = null;
}
function ch(a, c) {
  at(), Ut = it.createRoot(a), Ut.render(/* @__PURE__ */ i.jsx(dd, { ...c }));
}
function dh(a) {
  Ut == null || Ut.render(/* @__PURE__ */ i.jsx(dd, { ...a }));
}
function ph() {
  Ut == null || Ut.unmount(), Ut = null;
}
function fh(a, c) {
  at(), Wt = it.createRoot(a), Wt.render(/* @__PURE__ */ i.jsx(md, { ...c }));
}
function mh(a) {
  Wt == null || Wt.render(/* @__PURE__ */ i.jsx(md, { ...a }));
}
function hh() {
  Wt == null || Wt.unmount(), Wt = null;
}
function gh(a, c) {
  at(), kt == null || kt.unmount(), kt = it.createRoot(a), ho.flushSync(() => kt == null ? void 0 : kt.render(/* @__PURE__ */ i.jsx(Km, { ...c })));
}
function xh() {
  kt == null || kt.unmount(), kt = null;
}
function vh(a, c) {
  at(), zr || (zr = it.createRoot(a)), zr.render(/* @__PURE__ */ i.jsx(Ym, { ...c }));
}
function yh() {
  zr == null || zr.unmount(), zr = null;
}
function wh(a, c) {
  at(), Vt = it.createRoot(a), Vt.render(/* @__PURE__ */ i.jsx(pd, { ...c }));
}
function kh(a) {
  Vt == null || Vt.render(/* @__PURE__ */ i.jsx(pd, { ...a }));
}
function bh() {
  Vt == null || Vt.unmount(), Vt = null;
}
function jh(a, c) {
  at(), Bt = it.createRoot(a), Bt.render(/* @__PURE__ */ i.jsx(fd, { ...c }));
}
function Sh(a) {
  Bt == null || Bt.render(/* @__PURE__ */ i.jsx(fd, { ...a }));
}
function Ch() {
  Bt == null || Bt.unmount(), Bt = null;
}
function Nh(a, c) {
  at(), _r || (_r = it.createRoot(a)), _r.render(/* @__PURE__ */ i.jsx(Xm, { ...c }));
}
function Eh() {
  _r == null || _r.unmount(), _r = null;
}
function zh(a, c) {
  at(), Ft || (Ft = it.createRoot(a)), ho.flushSync(() => Ft == null ? void 0 : Ft.render(/* @__PURE__ */ i.jsx(Zm, { ...c })));
}
function _h() {
  Ft == null || Ft.unmount(), Ft = null;
}
function Mh(a, c) {
  at(), $t || ($t = it.createRoot(a)), ho.flushSync(() => $t == null ? void 0 : $t.render(/* @__PURE__ */ i.jsx(eh, { ...c })));
}
function Ph() {
  $t == null || $t.unmount(), $t = null;
}
function Lh(a, c) {
  at(), Mr || (Mr = it.createRoot(a)), Mr.render(/* @__PURE__ */ i.jsx(th, { ...c }));
}
function Th() {
  Mr == null || Mr.unmount(), Mr = null;
}
function Rh(a, c) {
  at(), Ht || (Ht = it.createRoot(a)), ho.flushSync(() => Ht == null ? void 0 : Ht.render(/* @__PURE__ */ i.jsx(rh, { ...c })));
}
function Dh() {
  Ht == null || Ht.unmount(), Ht = null;
}
function Ih(a, c) {
  at(), Pr || (Pr = it.createRoot(a)), Pr.render(/* @__PURE__ */ i.jsx(oh, { ...c }));
}
function Oh() {
  Pr == null || Pr.unmount(), Pr = null;
}
export {
  ah as mount,
  Mh as mountCalendarTimeline,
  Nh as mountChips,
  gh as mountCourseDetail,
  wh as mountCurriculum,
  jh as mountExams,
  vh as mountGpaSummary,
  Rh as mountHistoryDetail,
  Lh as mountHistorySearch,
  Ih as mountPrereqDetail,
  ch as mountProgram,
  fh as mountProgramList,
  zh as mountTermsGrid,
  uh as unmount,
  Ph as unmountCalendarTimeline,
  Eh as unmountChips,
  xh as unmountCourseDetail,
  bh as unmountCurriculum,
  Ch as unmountExams,
  yh as unmountGpaSummary,
  Dh as unmountHistoryDetail,
  Th as unmountHistorySearch,
  Oh as unmountPrereqDetail,
  ph as unmountProgram,
  hh as unmountProgramList,
  _h as unmountTermsGrid,
  sh as update,
  kh as updateCurriculum,
  Sh as updateExams,
  dh as updateProgram,
  mh as updateProgramList
};
