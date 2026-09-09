function zf(u, p) {
  for (var s = 0; s < p.length; s++) {
    const v = p[s];
    if (typeof v != "string" && !Array.isArray(v)) {
      for (const y in v)
        if (y !== "default" && !(y in u)) {
          const S = Object.getOwnPropertyDescriptor(v, y);
          S && Object.defineProperty(u, y, S.get ? S : {
            enumerable: !0,
            get: () => v[y]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(u, Symbol.toStringTag, { value: "Module" }));
}
function Nf(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
}
var Vi = { exports: {} }, Rr = {}, $i = { exports: {} }, Y = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ka;
function Pf() {
  if (Ka) return Y;
  Ka = 1;
  var u = Symbol.for("react.element"), p = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), v = Symbol.for("react.strict_mode"), y = Symbol.for("react.profiler"), S = Symbol.for("react.provider"), z = Symbol.for("react.context"), _ = Symbol.for("react.forward_ref"), O = Symbol.for("react.suspense"), B = Symbol.for("react.memo"), Q = Symbol.for("react.lazy"), W = Symbol.iterator;
  function D(f) {
    return f === null || typeof f != "object" ? null : (f = W && f[W] || f["@@iterator"], typeof f == "function" ? f : null);
  }
  var J = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, U = Object.assign, j = {};
  function F(f, k, K) {
    this.props = f, this.context = k, this.refs = j, this.updater = K || J;
  }
  F.prototype.isReactComponent = {}, F.prototype.setState = function(f, k) {
    if (typeof f != "object" && typeof f != "function" && f != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, f, k, "setState");
  }, F.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function ie() {
  }
  ie.prototype = F.prototype;
  function ge(f, k, K) {
    this.props = f, this.context = k, this.refs = j, this.updater = K || J;
  }
  var Re = ge.prototype = new ie();
  Re.constructor = ge, U(Re, F.prototype), Re.isPureReactComponent = !0;
  var pe = Array.isArray, Oe = Object.prototype.hasOwnProperty, ze = { current: null }, Le = { key: !0, ref: !0, __self: !0, __source: !0 };
  function $e(f, k, K) {
    var X, ee = {}, te = null, ue = null;
    if (k != null) for (X in k.ref !== void 0 && (ue = k.ref), k.key !== void 0 && (te = "" + k.key), k) Oe.call(k, X) && !Le.hasOwnProperty(X) && (ee[X] = k[X]);
    var re = arguments.length - 2;
    if (re === 1) ee.children = K;
    else if (1 < re) {
      for (var me = Array(re), Je = 0; Je < re; Je++) me[Je] = arguments[Je + 2];
      ee.children = me;
    }
    if (f && f.defaultProps) for (X in re = f.defaultProps, re) ee[X] === void 0 && (ee[X] = re[X]);
    return { $$typeof: u, type: f, key: te, ref: ue, props: ee, _owner: ze.current };
  }
  function rt(f, k) {
    return { $$typeof: u, type: f.type, key: k, ref: f.ref, props: f.props, _owner: f._owner };
  }
  function Xe(f) {
    return typeof f == "object" && f !== null && f.$$typeof === u;
  }
  function ct(f) {
    var k = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function(K) {
      return k[K];
    });
  }
  var Z = /\/+/g;
  function Ie(f, k) {
    return typeof f == "object" && f !== null && f.key != null ? ct("" + f.key) : k.toString(36);
  }
  function De(f, k, K, X, ee) {
    var te = typeof f;
    (te === "undefined" || te === "boolean") && (f = null);
    var ue = !1;
    if (f === null) ue = !0;
    else switch (te) {
      case "string":
      case "number":
        ue = !0;
        break;
      case "object":
        switch (f.$$typeof) {
          case u:
          case p:
            ue = !0;
        }
    }
    if (ue) return ue = f, ee = ee(ue), f = X === "" ? "." + Ie(ue, 0) : X, pe(ee) ? (K = "", f != null && (K = f.replace(Z, "$&/") + "/"), De(ee, k, K, "", function(Je) {
      return Je;
    })) : ee != null && (Xe(ee) && (ee = rt(ee, K + (!ee.key || ue && ue.key === ee.key ? "" : ("" + ee.key).replace(Z, "$&/") + "/") + f)), k.push(ee)), 1;
    if (ue = 0, X = X === "" ? "." : X + ":", pe(f)) for (var re = 0; re < f.length; re++) {
      te = f[re];
      var me = X + Ie(te, re);
      ue += De(te, k, K, me, ee);
    }
    else if (me = D(f), typeof me == "function") for (f = me.call(f), re = 0; !(te = f.next()).done; ) te = te.value, me = X + Ie(te, re++), ue += De(te, k, K, me, ee);
    else if (te === "object") throw k = String(f), Error("Objects are not valid as a React child (found: " + (k === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : k) + "). If you meant to render a collection of children, use an array instead.");
    return ue;
  }
  function Ze(f, k, K) {
    if (f == null) return f;
    var X = [], ee = 0;
    return De(f, X, "", "", function(te) {
      return k.call(K, te, ee++);
    }), X;
  }
  function Ee(f) {
    if (f._status === -1) {
      var k = f._result;
      k = k(), k.then(function(K) {
        (f._status === 0 || f._status === -1) && (f._status = 1, f._result = K);
      }, function(K) {
        (f._status === 0 || f._status === -1) && (f._status = 2, f._result = K);
      }), f._status === -1 && (f._status = 0, f._result = k);
    }
    if (f._status === 1) return f._result.default;
    throw f._result;
  }
  var ae = { current: null }, N = { transition: null }, A = { ReactCurrentDispatcher: ae, ReactCurrentBatchConfig: N, ReactCurrentOwner: ze };
  function T() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Y.Children = { map: Ze, forEach: function(f, k, K) {
    Ze(f, function() {
      k.apply(this, arguments);
    }, K);
  }, count: function(f) {
    var k = 0;
    return Ze(f, function() {
      k++;
    }), k;
  }, toArray: function(f) {
    return Ze(f, function(k) {
      return k;
    }) || [];
  }, only: function(f) {
    if (!Xe(f)) throw Error("React.Children.only expected to receive a single React element child.");
    return f;
  } }, Y.Component = F, Y.Fragment = s, Y.Profiler = y, Y.PureComponent = ge, Y.StrictMode = v, Y.Suspense = O, Y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = A, Y.act = T, Y.cloneElement = function(f, k, K) {
    if (f == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + f + ".");
    var X = U({}, f.props), ee = f.key, te = f.ref, ue = f._owner;
    if (k != null) {
      if (k.ref !== void 0 && (te = k.ref, ue = ze.current), k.key !== void 0 && (ee = "" + k.key), f.type && f.type.defaultProps) var re = f.type.defaultProps;
      for (me in k) Oe.call(k, me) && !Le.hasOwnProperty(me) && (X[me] = k[me] === void 0 && re !== void 0 ? re[me] : k[me]);
    }
    var me = arguments.length - 2;
    if (me === 1) X.children = K;
    else if (1 < me) {
      re = Array(me);
      for (var Je = 0; Je < me; Je++) re[Je] = arguments[Je + 2];
      X.children = re;
    }
    return { $$typeof: u, type: f.type, key: ee, ref: te, props: X, _owner: ue };
  }, Y.createContext = function(f) {
    return f = { $$typeof: z, _currentValue: f, _currentValue2: f, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, f.Provider = { $$typeof: S, _context: f }, f.Consumer = f;
  }, Y.createElement = $e, Y.createFactory = function(f) {
    var k = $e.bind(null, f);
    return k.type = f, k;
  }, Y.createRef = function() {
    return { current: null };
  }, Y.forwardRef = function(f) {
    return { $$typeof: _, render: f };
  }, Y.isValidElement = Xe, Y.lazy = function(f) {
    return { $$typeof: Q, _payload: { _status: -1, _result: f }, _init: Ee };
  }, Y.memo = function(f, k) {
    return { $$typeof: B, type: f, compare: k === void 0 ? null : k };
  }, Y.startTransition = function(f) {
    var k = N.transition;
    N.transition = {};
    try {
      f();
    } finally {
      N.transition = k;
    }
  }, Y.unstable_act = T, Y.useCallback = function(f, k) {
    return ae.current.useCallback(f, k);
  }, Y.useContext = function(f) {
    return ae.current.useContext(f);
  }, Y.useDebugValue = function() {
  }, Y.useDeferredValue = function(f) {
    return ae.current.useDeferredValue(f);
  }, Y.useEffect = function(f, k) {
    return ae.current.useEffect(f, k);
  }, Y.useId = function() {
    return ae.current.useId();
  }, Y.useImperativeHandle = function(f, k, K) {
    return ae.current.useImperativeHandle(f, k, K);
  }, Y.useInsertionEffect = function(f, k) {
    return ae.current.useInsertionEffect(f, k);
  }, Y.useLayoutEffect = function(f, k) {
    return ae.current.useLayoutEffect(f, k);
  }, Y.useMemo = function(f, k) {
    return ae.current.useMemo(f, k);
  }, Y.useReducer = function(f, k, K) {
    return ae.current.useReducer(f, k, K);
  }, Y.useRef = function(f) {
    return ae.current.useRef(f);
  }, Y.useState = function(f) {
    return ae.current.useState(f);
  }, Y.useSyncExternalStore = function(f, k, K) {
    return ae.current.useSyncExternalStore(f, k, K);
  }, Y.useTransition = function() {
    return ae.current.useTransition();
  }, Y.version = "18.3.1", Y;
}
var Ya;
function Xi() {
  return Ya || (Ya = 1, $i.exports = Pf()), $i.exports;
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
var Xa;
function Tf() {
  if (Xa) return Rr;
  Xa = 1;
  var u = Xi(), p = Symbol.for("react.element"), s = Symbol.for("react.fragment"), v = Object.prototype.hasOwnProperty, y = u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, S = { key: !0, ref: !0, __self: !0, __source: !0 };
  function z(_, O, B) {
    var Q, W = {}, D = null, J = null;
    B !== void 0 && (D = "" + B), O.key !== void 0 && (D = "" + O.key), O.ref !== void 0 && (J = O.ref);
    for (Q in O) v.call(O, Q) && !S.hasOwnProperty(Q) && (W[Q] = O[Q]);
    if (_ && _.defaultProps) for (Q in O = _.defaultProps, O) W[Q] === void 0 && (W[Q] = O[Q]);
    return { $$typeof: p, type: _, key: D, ref: J, props: W, _owner: y.current };
  }
  return Rr.Fragment = s, Rr.jsx = z, Rr.jsxs = z, Rr;
}
var Za;
function Rf() {
  return Za || (Za = 1, Vi.exports = Tf()), Vi.exports;
}
var b = Rf(), oe = Xi();
const Lf = /* @__PURE__ */ Nf(oe), jf = /* @__PURE__ */ zf({
  __proto__: null,
  default: Lf
}, [oe]);
var Hl = {}, Bi = { exports: {} }, Ye = {}, Hi = { exports: {} }, Wi = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ja;
function Mf() {
  return Ja || (Ja = 1, (function(u) {
    function p(N, A) {
      var T = N.length;
      N.push(A);
      e: for (; 0 < T; ) {
        var f = T - 1 >>> 1, k = N[f];
        if (0 < y(k, A)) N[f] = A, N[T] = k, T = f;
        else break e;
      }
    }
    function s(N) {
      return N.length === 0 ? null : N[0];
    }
    function v(N) {
      if (N.length === 0) return null;
      var A = N[0], T = N.pop();
      if (T !== A) {
        N[0] = T;
        e: for (var f = 0, k = N.length, K = k >>> 1; f < K; ) {
          var X = 2 * (f + 1) - 1, ee = N[X], te = X + 1, ue = N[te];
          if (0 > y(ee, T)) te < k && 0 > y(ue, ee) ? (N[f] = ue, N[te] = T, f = te) : (N[f] = ee, N[X] = T, f = X);
          else if (te < k && 0 > y(ue, T)) N[f] = ue, N[te] = T, f = te;
          else break e;
        }
      }
      return A;
    }
    function y(N, A) {
      var T = N.sortIndex - A.sortIndex;
      return T !== 0 ? T : N.id - A.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var S = performance;
      u.unstable_now = function() {
        return S.now();
      };
    } else {
      var z = Date, _ = z.now();
      u.unstable_now = function() {
        return z.now() - _;
      };
    }
    var O = [], B = [], Q = 1, W = null, D = 3, J = !1, U = !1, j = !1, F = typeof setTimeout == "function" ? setTimeout : null, ie = typeof clearTimeout == "function" ? clearTimeout : null, ge = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Re(N) {
      for (var A = s(B); A !== null; ) {
        if (A.callback === null) v(B);
        else if (A.startTime <= N) v(B), A.sortIndex = A.expirationTime, p(O, A);
        else break;
        A = s(B);
      }
    }
    function pe(N) {
      if (j = !1, Re(N), !U) if (s(O) !== null) U = !0, Ee(Oe);
      else {
        var A = s(B);
        A !== null && ae(pe, A.startTime - N);
      }
    }
    function Oe(N, A) {
      U = !1, j && (j = !1, ie($e), $e = -1), J = !0;
      var T = D;
      try {
        for (Re(A), W = s(O); W !== null && (!(W.expirationTime > A) || N && !ct()); ) {
          var f = W.callback;
          if (typeof f == "function") {
            W.callback = null, D = W.priorityLevel;
            var k = f(W.expirationTime <= A);
            A = u.unstable_now(), typeof k == "function" ? W.callback = k : W === s(O) && v(O), Re(A);
          } else v(O);
          W = s(O);
        }
        if (W !== null) var K = !0;
        else {
          var X = s(B);
          X !== null && ae(pe, X.startTime - A), K = !1;
        }
        return K;
      } finally {
        W = null, D = T, J = !1;
      }
    }
    var ze = !1, Le = null, $e = -1, rt = 5, Xe = -1;
    function ct() {
      return !(u.unstable_now() - Xe < rt);
    }
    function Z() {
      if (Le !== null) {
        var N = u.unstable_now();
        Xe = N;
        var A = !0;
        try {
          A = Le(!0, N);
        } finally {
          A ? Ie() : (ze = !1, Le = null);
        }
      } else ze = !1;
    }
    var Ie;
    if (typeof ge == "function") Ie = function() {
      ge(Z);
    };
    else if (typeof MessageChannel < "u") {
      var De = new MessageChannel(), Ze = De.port2;
      De.port1.onmessage = Z, Ie = function() {
        Ze.postMessage(null);
      };
    } else Ie = function() {
      F(Z, 0);
    };
    function Ee(N) {
      Le = N, ze || (ze = !0, Ie());
    }
    function ae(N, A) {
      $e = F(function() {
        N(u.unstable_now());
      }, A);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(N) {
      N.callback = null;
    }, u.unstable_continueExecution = function() {
      U || J || (U = !0, Ee(Oe));
    }, u.unstable_forceFrameRate = function(N) {
      0 > N || 125 < N ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : rt = 0 < N ? Math.floor(1e3 / N) : 5;
    }, u.unstable_getCurrentPriorityLevel = function() {
      return D;
    }, u.unstable_getFirstCallbackNode = function() {
      return s(O);
    }, u.unstable_next = function(N) {
      switch (D) {
        case 1:
        case 2:
        case 3:
          var A = 3;
          break;
        default:
          A = D;
      }
      var T = D;
      D = A;
      try {
        return N();
      } finally {
        D = T;
      }
    }, u.unstable_pauseExecution = function() {
    }, u.unstable_requestPaint = function() {
    }, u.unstable_runWithPriority = function(N, A) {
      switch (N) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          N = 3;
      }
      var T = D;
      D = N;
      try {
        return A();
      } finally {
        D = T;
      }
    }, u.unstable_scheduleCallback = function(N, A, T) {
      var f = u.unstable_now();
      switch (typeof T == "object" && T !== null ? (T = T.delay, T = typeof T == "number" && 0 < T ? f + T : f) : T = f, N) {
        case 1:
          var k = -1;
          break;
        case 2:
          k = 250;
          break;
        case 5:
          k = 1073741823;
          break;
        case 4:
          k = 1e4;
          break;
        default:
          k = 5e3;
      }
      return k = T + k, N = { id: Q++, callback: A, priorityLevel: N, startTime: T, expirationTime: k, sortIndex: -1 }, T > f ? (N.sortIndex = T, p(B, N), s(O) === null && N === s(B) && (j ? (ie($e), $e = -1) : j = !0, ae(pe, T - f))) : (N.sortIndex = k, p(O, N), U || J || (U = !0, Ee(Oe))), N;
    }, u.unstable_shouldYield = ct, u.unstable_wrapCallback = function(N) {
      var A = D;
      return function() {
        var T = D;
        D = A;
        try {
          return N.apply(this, arguments);
        } finally {
          D = T;
        }
      };
    };
  })(Wi)), Wi;
}
var qa;
function Of() {
  return qa || (qa = 1, Hi.exports = Mf()), Hi.exports;
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
var ec;
function If() {
  if (ec) return Ye;
  ec = 1;
  var u = Xi(), p = Of();
  function s(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var v = /* @__PURE__ */ new Set(), y = {};
  function S(e, t) {
    z(e, t), z(e + "Capture", t);
  }
  function z(e, t) {
    for (y[e] = t, e = 0; e < t.length; e++) v.add(t[e]);
  }
  var _ = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), O = Object.prototype.hasOwnProperty, B = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, Q = {}, W = {};
  function D(e) {
    return O.call(W, e) ? !0 : O.call(Q, e) ? !1 : B.test(e) ? W[e] = !0 : (Q[e] = !0, !1);
  }
  function J(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function U(e, t, n, r) {
    if (t === null || typeof t > "u" || J(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null) switch (n.type) {
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
  function j(e, t, n, r, l, o, i) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = i;
  }
  var F = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    F[e] = new j(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    F[t] = new j(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    F[e] = new j(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    F[e] = new j(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    F[e] = new j(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    F[e] = new j(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    F[e] = new j(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    F[e] = new j(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    F[e] = new j(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var ie = /[\-:]([a-z])/g;
  function ge(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      ie,
      ge
    );
    F[t] = new j(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(ie, ge);
    F[t] = new j(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(ie, ge);
    F[t] = new j(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    F[e] = new j(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), F.xlinkHref = new j("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    F[e] = new j(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Re(e, t, n, r) {
    var l = F.hasOwnProperty(t) ? F[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (U(t, n, l, r) && (n = null), r || l === null ? D(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var pe = u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Oe = Symbol.for("react.element"), ze = Symbol.for("react.portal"), Le = Symbol.for("react.fragment"), $e = Symbol.for("react.strict_mode"), rt = Symbol.for("react.profiler"), Xe = Symbol.for("react.provider"), ct = Symbol.for("react.context"), Z = Symbol.for("react.forward_ref"), Ie = Symbol.for("react.suspense"), De = Symbol.for("react.suspense_list"), Ze = Symbol.for("react.memo"), Ee = Symbol.for("react.lazy"), ae = Symbol.for("react.offscreen"), N = Symbol.iterator;
  function A(e) {
    return e === null || typeof e != "object" ? null : (e = N && e[N] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var T = Object.assign, f;
  function k(e) {
    if (f === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      f = t && t[1] || "";
    }
    return `
` + f + e;
  }
  var K = !1;
  function X(e, t) {
    if (!e || K) return "";
    K = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t) if (t = function() {
        throw Error();
      }, Object.defineProperty(t.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(t, []);
        } catch (g) {
          var r = g;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (g) {
          r = g;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (g) {
          r = g;
        }
        e();
      }
    } catch (g) {
      if (g && r && typeof g.stack == "string") {
        for (var l = g.stack.split(`
`), o = r.stack.split(`
`), i = l.length - 1, a = o.length - 1; 1 <= i && 0 <= a && l[i] !== o[a]; ) a--;
        for (; 1 <= i && 0 <= a; i--, a--) if (l[i] !== o[a]) {
          if (i !== 1 || a !== 1)
            do
              if (i--, a--, 0 > a || l[i] !== o[a]) {
                var c = `
` + l[i].replace(" at new ", " at ");
                return e.displayName && c.includes("<anonymous>") && (c = c.replace("<anonymous>", e.displayName)), c;
              }
            while (1 <= i && 0 <= a);
          break;
        }
      }
    } finally {
      K = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? k(e) : "";
  }
  function ee(e) {
    switch (e.tag) {
      case 5:
        return k(e.type);
      case 16:
        return k("Lazy");
      case 13:
        return k("Suspense");
      case 19:
        return k("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = X(e.type, !1), e;
      case 11:
        return e = X(e.type.render, !1), e;
      case 1:
        return e = X(e.type, !0), e;
      default:
        return "";
    }
  }
  function te(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case Le:
        return "Fragment";
      case ze:
        return "Portal";
      case rt:
        return "Profiler";
      case $e:
        return "StrictMode";
      case Ie:
        return "Suspense";
      case De:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case ct:
        return (e.displayName || "Context") + ".Consumer";
      case Xe:
        return (e._context.displayName || "Context") + ".Provider";
      case Z:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Ze:
        return t = e.displayName || null, t !== null ? t : te(e.type) || "Memo";
      case Ee:
        t = e._payload, e = e._init;
        try {
          return te(e(t));
        } catch {
        }
    }
    return null;
  }
  function ue(e) {
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
        return te(t);
      case 8:
        return t === $e ? "StrictMode" : "Mode";
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
  function re(e) {
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
  function me(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Je(e) {
    var t = me(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var l = n.get, o = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(i) {
        r = "" + i, o.call(this, i);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(i) {
        r = "" + i;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function Mr(e) {
    e._valueTracker || (e._valueTracker = Je(e));
  }
  function eu(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = me(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Or(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function bl(e, t) {
    var n = t.checked;
    return T({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function tu(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = re(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function nu(e, t) {
    t = t.checked, t != null && Re(e, "checked", t, !1);
  }
  function Gl(e, t) {
    nu(e, t);
    var n = re(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Kl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Kl(e, t.type, re(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function ru(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Kl(e, t, n) {
    (t !== "number" || Or(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Qn = Array.isArray;
  function yn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + re(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Yl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(s(91));
    return T({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function lu(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(s(92));
        if (Qn(n)) {
          if (1 < n.length) throw Error(s(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: re(n) };
  }
  function ou(e, t) {
    var n = re(t.value), r = re(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function iu(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function uu(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Xl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? uu(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Ir, su = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Ir = Ir || document.createElement("div"), Ir.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Ir.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function bn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Gn = {
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
  }, Tc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Gn).forEach(function(e) {
    Tc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Gn[t] = Gn[e];
    });
  });
  function au(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Gn.hasOwnProperty(e) && Gn[e] ? ("" + t).trim() : t + "px";
  }
  function cu(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = au(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Rc = T({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Zl(e, t) {
    if (t) {
      if (Rc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(s(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(s(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(s(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(s(62));
    }
  }
  function Jl(e, t) {
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
  var ql = null;
  function eo(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var to = null, wn = null, kn = null;
  function du(e) {
    if (e = hr(e)) {
      if (typeof to != "function") throw Error(s(280));
      var t = e.stateNode;
      t && (t = ll(t), to(e.stateNode, e.type, t));
    }
  }
  function fu(e) {
    wn ? kn ? kn.push(e) : kn = [e] : wn = e;
  }
  function pu() {
    if (wn) {
      var e = wn, t = kn;
      if (kn = wn = null, du(e), t) for (e = 0; e < t.length; e++) du(t[e]);
    }
  }
  function mu(e, t) {
    return e(t);
  }
  function hu() {
  }
  var no = !1;
  function gu(e, t, n) {
    if (no) return e(t, n);
    no = !0;
    try {
      return mu(e, t, n);
    } finally {
      no = !1, (wn !== null || kn !== null) && (hu(), pu());
    }
  }
  function Kn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = ll(n);
    if (r === null) return null;
    n = r[t];
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
        (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(s(231, t, typeof n));
    return n;
  }
  var ro = !1;
  if (_) try {
    var Yn = {};
    Object.defineProperty(Yn, "passive", { get: function() {
      ro = !0;
    } }), window.addEventListener("test", Yn, Yn), window.removeEventListener("test", Yn, Yn);
  } catch {
    ro = !1;
  }
  function Lc(e, t, n, r, l, o, i, a, c) {
    var g = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, g);
    } catch (x) {
      this.onError(x);
    }
  }
  var Xn = !1, Dr = null, Fr = !1, lo = null, jc = { onError: function(e) {
    Xn = !0, Dr = e;
  } };
  function Mc(e, t, n, r, l, o, i, a, c) {
    Xn = !1, Dr = null, Lc.apply(jc, arguments);
  }
  function Oc(e, t, n, r, l, o, i, a, c) {
    if (Mc.apply(this, arguments), Xn) {
      if (Xn) {
        var g = Dr;
        Xn = !1, Dr = null;
      } else throw Error(s(198));
      Fr || (Fr = !0, lo = g);
    }
  }
  function rn(e) {
    var t = e, n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (n = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function vu(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function yu(e) {
    if (rn(e) !== e) throw Error(s(188));
  }
  function Ic(e) {
    var t = e.alternate;
    if (!t) {
      if (t = rn(e), t === null) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
      var l = n.return;
      if (l === null) break;
      var o = l.alternate;
      if (o === null) {
        if (r = l.return, r !== null) {
          n = r;
          continue;
        }
        break;
      }
      if (l.child === o.child) {
        for (o = l.child; o; ) {
          if (o === n) return yu(l), e;
          if (o === r) return yu(l), t;
          o = o.sibling;
        }
        throw Error(s(188));
      }
      if (n.return !== r.return) n = l, r = o;
      else {
        for (var i = !1, a = l.child; a; ) {
          if (a === n) {
            i = !0, n = l, r = o;
            break;
          }
          if (a === r) {
            i = !0, r = l, n = o;
            break;
          }
          a = a.sibling;
        }
        if (!i) {
          for (a = o.child; a; ) {
            if (a === n) {
              i = !0, n = o, r = l;
              break;
            }
            if (a === r) {
              i = !0, r = o, n = l;
              break;
            }
            a = a.sibling;
          }
          if (!i) throw Error(s(189));
        }
      }
      if (n.alternate !== r) throw Error(s(190));
    }
    if (n.tag !== 3) throw Error(s(188));
    return n.stateNode.current === n ? e : t;
  }
  function wu(e) {
    return e = Ic(e), e !== null ? ku(e) : null;
  }
  function ku(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = ku(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var xu = p.unstable_scheduleCallback, Su = p.unstable_cancelCallback, Dc = p.unstable_shouldYield, Fc = p.unstable_requestPaint, ke = p.unstable_now, Ac = p.unstable_getCurrentPriorityLevel, oo = p.unstable_ImmediatePriority, Eu = p.unstable_UserBlockingPriority, Ar = p.unstable_NormalPriority, Uc = p.unstable_LowPriority, Cu = p.unstable_IdlePriority, Ur = null, wt = null;
  function Vc(e) {
    if (wt && typeof wt.onCommitFiberRoot == "function") try {
      wt.onCommitFiberRoot(Ur, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var dt = Math.clz32 ? Math.clz32 : Hc, $c = Math.log, Bc = Math.LN2;
  function Hc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - ($c(e) / Bc | 0) | 0;
  }
  var Vr = 64, $r = 4194304;
  function Zn(e) {
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
  function Br(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, i = n & 268435455;
    if (i !== 0) {
      var a = i & ~l;
      a !== 0 ? r = Zn(a) : (o &= i, o !== 0 && (r = Zn(o)));
    } else i = n & ~l, i !== 0 ? r = Zn(i) : o !== 0 && (r = Zn(o));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - dt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function Wc(e, t) {
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
  function Qc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - dt(o), a = 1 << i, c = l[i];
      c === -1 ? ((a & n) === 0 || (a & r) !== 0) && (l[i] = Wc(a, t)) : c <= t && (e.expiredLanes |= a), o &= ~a;
    }
  }
  function io(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function _u() {
    var e = Vr;
    return Vr <<= 1, (Vr & 4194240) === 0 && (Vr = 64), e;
  }
  function uo(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Jn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - dt(t), e[t] = n;
  }
  function bc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - dt(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function so(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - dt(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var le = 0;
  function zu(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Nu, ao, Pu, Tu, Ru, co = !1, Hr = [], It = null, Dt = null, Ft = null, qn = /* @__PURE__ */ new Map(), er = /* @__PURE__ */ new Map(), At = [], Gc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Lu(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        It = null;
        break;
      case "dragenter":
      case "dragleave":
        Dt = null;
        break;
      case "mouseover":
      case "mouseout":
        Ft = null;
        break;
      case "pointerover":
      case "pointerout":
        qn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        er.delete(t.pointerId);
    }
  }
  function tr(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = hr(t), t !== null && ao(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Kc(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return It = tr(It, e, t, n, r, l), !0;
      case "dragenter":
        return Dt = tr(Dt, e, t, n, r, l), !0;
      case "mouseover":
        return Ft = tr(Ft, e, t, n, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return qn.set(o, tr(qn.get(o) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, er.set(o, tr(er.get(o) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function ju(e) {
    var t = ln(e.target);
    if (t !== null) {
      var n = rn(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = vu(n), t !== null) {
            e.blockedOn = t, Ru(e.priority, function() {
              Pu(n);
            });
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Wr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = po(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        ql = r, n.target.dispatchEvent(r), ql = null;
      } else return t = hr(n), t !== null && ao(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Mu(e, t, n) {
    Wr(e) && n.delete(t);
  }
  function Yc() {
    co = !1, It !== null && Wr(It) && (It = null), Dt !== null && Wr(Dt) && (Dt = null), Ft !== null && Wr(Ft) && (Ft = null), qn.forEach(Mu), er.forEach(Mu);
  }
  function nr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, co || (co = !0, p.unstable_scheduleCallback(p.unstable_NormalPriority, Yc)));
  }
  function rr(e) {
    function t(l) {
      return nr(l, e);
    }
    if (0 < Hr.length) {
      nr(Hr[0], e);
      for (var n = 1; n < Hr.length; n++) {
        var r = Hr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (It !== null && nr(It, e), Dt !== null && nr(Dt, e), Ft !== null && nr(Ft, e), qn.forEach(t), er.forEach(t), n = 0; n < At.length; n++) r = At[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < At.length && (n = At[0], n.blockedOn === null); ) ju(n), n.blockedOn === null && At.shift();
  }
  var xn = pe.ReactCurrentBatchConfig, Qr = !0;
  function Xc(e, t, n, r) {
    var l = le, o = xn.transition;
    xn.transition = null;
    try {
      le = 1, fo(e, t, n, r);
    } finally {
      le = l, xn.transition = o;
    }
  }
  function Zc(e, t, n, r) {
    var l = le, o = xn.transition;
    xn.transition = null;
    try {
      le = 4, fo(e, t, n, r);
    } finally {
      le = l, xn.transition = o;
    }
  }
  function fo(e, t, n, r) {
    if (Qr) {
      var l = po(e, t, n, r);
      if (l === null) Ro(e, t, r, br, n), Lu(e, r);
      else if (Kc(l, e, t, n, r)) r.stopPropagation();
      else if (Lu(e, r), t & 4 && -1 < Gc.indexOf(e)) {
        for (; l !== null; ) {
          var o = hr(l);
          if (o !== null && Nu(o), o = po(e, t, n, r), o === null && Ro(e, t, r, br, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else Ro(e, t, r, null, n);
    }
  }
  var br = null;
  function po(e, t, n, r) {
    if (br = null, e = eo(r), e = ln(e), e !== null) if (t = rn(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = vu(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return br = e, null;
  }
  function Ou(e) {
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
        switch (Ac()) {
          case oo:
            return 1;
          case Eu:
            return 4;
          case Ar:
          case Uc:
            return 16;
          case Cu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ut = null, mo = null, Gr = null;
  function Iu() {
    if (Gr) return Gr;
    var e, t = mo, n = t.length, r, l = "value" in Ut ? Ut.value : Ut.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
    return Gr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Kr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Yr() {
    return !0;
  }
  function Du() {
    return !1;
  }
  function qe(e) {
    function t(n, r, l, o, i) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
      for (var a in e) e.hasOwnProperty(a) && (n = e[a], this[a] = n ? n(o) : o[a]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Yr : Du, this.isPropagationStopped = Du, this;
    }
    return T(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Yr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Yr);
    }, persist: function() {
    }, isPersistent: Yr }), t;
  }
  var Sn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, ho = qe(Sn), lr = T({}, Sn, { view: 0, detail: 0 }), Jc = qe(lr), go, vo, or, Xr = T({}, lr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: wo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== or && (or && e.type === "mousemove" ? (go = e.screenX - or.screenX, vo = e.screenY - or.screenY) : vo = go = 0, or = e), go);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : vo;
  } }), Fu = qe(Xr), qc = T({}, Xr, { dataTransfer: 0 }), ed = qe(qc), td = T({}, lr, { relatedTarget: 0 }), yo = qe(td), nd = T({}, Sn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), rd = qe(nd), ld = T({}, Sn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), od = qe(ld), id = T({}, Sn, { data: 0 }), Au = qe(id), ud = {
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
  }, sd = {
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
  }, ad = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function cd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = ad[e]) ? !!t[e] : !1;
  }
  function wo() {
    return cd;
  }
  var dd = T({}, lr, { key: function(e) {
    if (e.key) {
      var t = ud[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Kr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? sd[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: wo, charCode: function(e) {
    return e.type === "keypress" ? Kr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Kr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), fd = qe(dd), pd = T({}, Xr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Uu = qe(pd), md = T({}, lr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: wo }), hd = qe(md), gd = T({}, Sn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), vd = qe(gd), yd = T({}, Xr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), wd = qe(yd), kd = [9, 13, 27, 32], ko = _ && "CompositionEvent" in window, ir = null;
  _ && "documentMode" in document && (ir = document.documentMode);
  var xd = _ && "TextEvent" in window && !ir, Vu = _ && (!ko || ir && 8 < ir && 11 >= ir), $u = " ", Bu = !1;
  function Hu(e, t) {
    switch (e) {
      case "keyup":
        return kd.indexOf(t.keyCode) !== -1;
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
  function Wu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var En = !1;
  function Sd(e, t) {
    switch (e) {
      case "compositionend":
        return Wu(t);
      case "keypress":
        return t.which !== 32 ? null : (Bu = !0, $u);
      case "textInput":
        return e = t.data, e === $u && Bu ? null : e;
      default:
        return null;
    }
  }
  function Ed(e, t) {
    if (En) return e === "compositionend" || !ko && Hu(e, t) ? (e = Iu(), Gr = mo = Ut = null, En = !1, e) : null;
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
        return Vu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Cd = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Qu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Cd[e.type] : t === "textarea";
  }
  function bu(e, t, n, r) {
    fu(r), t = tl(t, "onChange"), 0 < t.length && (n = new ho("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var ur = null, sr = null;
  function _d(e) {
    cs(e, 0);
  }
  function Zr(e) {
    var t = Pn(e);
    if (eu(t)) return e;
  }
  function zd(e, t) {
    if (e === "change") return t;
  }
  var Gu = !1;
  if (_) {
    var xo;
    if (_) {
      var So = "oninput" in document;
      if (!So) {
        var Ku = document.createElement("div");
        Ku.setAttribute("oninput", "return;"), So = typeof Ku.oninput == "function";
      }
      xo = So;
    } else xo = !1;
    Gu = xo && (!document.documentMode || 9 < document.documentMode);
  }
  function Yu() {
    ur && (ur.detachEvent("onpropertychange", Xu), sr = ur = null);
  }
  function Xu(e) {
    if (e.propertyName === "value" && Zr(sr)) {
      var t = [];
      bu(t, sr, e, eo(e)), gu(_d, t);
    }
  }
  function Nd(e, t, n) {
    e === "focusin" ? (Yu(), ur = t, sr = n, ur.attachEvent("onpropertychange", Xu)) : e === "focusout" && Yu();
  }
  function Pd(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Zr(sr);
  }
  function Td(e, t) {
    if (e === "click") return Zr(t);
  }
  function Rd(e, t) {
    if (e === "input" || e === "change") return Zr(t);
  }
  function Ld(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ft = typeof Object.is == "function" ? Object.is : Ld;
  function ar(e, t) {
    if (ft(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!O.call(t, l) || !ft(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Zu(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Ju(e, t) {
    var n = Zu(e);
    e = 0;
    for (var r; n; ) {
      if (n.nodeType === 3) {
        if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
        e = r;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = Zu(n);
    }
  }
  function qu(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? qu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function es() {
    for (var e = window, t = Or(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Or(e.document);
    }
    return t;
  }
  function Eo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function jd(e) {
    var t = es(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && qu(n.ownerDocument.documentElement, n)) {
      if (r !== null && Eo(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = Ju(n, o);
          var i = Ju(
            n,
            r
          );
          l && i && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== i.node || e.focusOffset !== i.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), o > r ? (e.addRange(t), e.extend(i.node, i.offset)) : (t.setEnd(i.node, i.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var Md = _ && "documentMode" in document && 11 >= document.documentMode, Cn = null, Co = null, cr = null, _o = !1;
  function ts(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    _o || Cn == null || Cn !== Or(r) || (r = Cn, "selectionStart" in r && Eo(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), cr && ar(cr, r) || (cr = r, r = tl(Co, "onSelect"), 0 < r.length && (t = new ho("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Cn)));
  }
  function Jr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var _n = { animationend: Jr("Animation", "AnimationEnd"), animationiteration: Jr("Animation", "AnimationIteration"), animationstart: Jr("Animation", "AnimationStart"), transitionend: Jr("Transition", "TransitionEnd") }, zo = {}, ns = {};
  _ && (ns = document.createElement("div").style, "AnimationEvent" in window || (delete _n.animationend.animation, delete _n.animationiteration.animation, delete _n.animationstart.animation), "TransitionEvent" in window || delete _n.transitionend.transition);
  function qr(e) {
    if (zo[e]) return zo[e];
    if (!_n[e]) return e;
    var t = _n[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in ns) return zo[e] = t[n];
    return e;
  }
  var rs = qr("animationend"), ls = qr("animationiteration"), os = qr("animationstart"), is = qr("transitionend"), us = /* @__PURE__ */ new Map(), ss = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Vt(e, t) {
    us.set(e, t), S(t, [e]);
  }
  for (var No = 0; No < ss.length; No++) {
    var Po = ss[No], Od = Po.toLowerCase(), Id = Po[0].toUpperCase() + Po.slice(1);
    Vt(Od, "on" + Id);
  }
  Vt(rs, "onAnimationEnd"), Vt(ls, "onAnimationIteration"), Vt(os, "onAnimationStart"), Vt("dblclick", "onDoubleClick"), Vt("focusin", "onFocus"), Vt("focusout", "onBlur"), Vt(is, "onTransitionEnd"), z("onMouseEnter", ["mouseout", "mouseover"]), z("onMouseLeave", ["mouseout", "mouseover"]), z("onPointerEnter", ["pointerout", "pointerover"]), z("onPointerLeave", ["pointerout", "pointerover"]), S("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), S("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), S("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), S("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), S("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), S("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var dr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Dd = new Set("cancel close invalid load scroll toggle".split(" ").concat(dr));
  function as(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, Oc(r, t, void 0, e), e.currentTarget = null;
  }
  function cs(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var a = r[i], c = a.instance, g = a.currentTarget;
          if (a = a.listener, c !== o && l.isPropagationStopped()) break e;
          as(l, a, g), o = c;
        }
        else for (i = 0; i < r.length; i++) {
          if (a = r[i], c = a.instance, g = a.currentTarget, a = a.listener, c !== o && l.isPropagationStopped()) break e;
          as(l, a, g), o = c;
        }
      }
    }
    if (Fr) throw e = lo, Fr = !1, lo = null, e;
  }
  function ce(e, t) {
    var n = t[Do];
    n === void 0 && (n = t[Do] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (ds(t, e, 2, !1), n.add(r));
  }
  function To(e, t, n) {
    var r = 0;
    t && (r |= 4), ds(n, e, r, t);
  }
  var el = "_reactListening" + Math.random().toString(36).slice(2);
  function fr(e) {
    if (!e[el]) {
      e[el] = !0, v.forEach(function(n) {
        n !== "selectionchange" && (Dd.has(n) || To(n, !1, e), To(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[el] || (t[el] = !0, To("selectionchange", !1, t));
    }
  }
  function ds(e, t, n, r) {
    switch (Ou(t)) {
      case 1:
        var l = Xc;
        break;
      case 4:
        l = Zc;
        break;
      default:
        l = fo;
    }
    n = l.bind(null, t, n, e), l = void 0, !ro || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Ro(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var i = r.tag;
      if (i === 3 || i === 4) {
        var a = r.stateNode.containerInfo;
        if (a === l || a.nodeType === 8 && a.parentNode === l) break;
        if (i === 4) for (i = r.return; i !== null; ) {
          var c = i.tag;
          if ((c === 3 || c === 4) && (c = i.stateNode.containerInfo, c === l || c.nodeType === 8 && c.parentNode === l)) return;
          i = i.return;
        }
        for (; a !== null; ) {
          if (i = ln(a), i === null) return;
          if (c = i.tag, c === 5 || c === 6) {
            r = o = i;
            continue e;
          }
          a = a.parentNode;
        }
      }
      r = r.return;
    }
    gu(function() {
      var g = o, x = eo(n), E = [];
      e: {
        var w = us.get(e);
        if (w !== void 0) {
          var P = ho, L = e;
          switch (e) {
            case "keypress":
              if (Kr(n) === 0) break e;
            case "keydown":
            case "keyup":
              P = fd;
              break;
            case "focusin":
              L = "focus", P = yo;
              break;
            case "focusout":
              L = "blur", P = yo;
              break;
            case "beforeblur":
            case "afterblur":
              P = yo;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              P = Fu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              P = ed;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              P = hd;
              break;
            case rs:
            case ls:
            case os:
              P = rd;
              break;
            case is:
              P = vd;
              break;
            case "scroll":
              P = Jc;
              break;
            case "wheel":
              P = wd;
              break;
            case "copy":
            case "cut":
            case "paste":
              P = od;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              P = Uu;
          }
          var M = (t & 4) !== 0, xe = !M && e === "scroll", m = M ? w !== null ? w + "Capture" : null : w;
          M = [];
          for (var d = g, h; d !== null; ) {
            h = d;
            var C = h.stateNode;
            if (h.tag === 5 && C !== null && (h = C, m !== null && (C = Kn(d, m), C != null && M.push(pr(d, C, h)))), xe) break;
            d = d.return;
          }
          0 < M.length && (w = new P(w, L, null, n, x), E.push({ event: w, listeners: M }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (w = e === "mouseover" || e === "pointerover", P = e === "mouseout" || e === "pointerout", w && n !== ql && (L = n.relatedTarget || n.fromElement) && (ln(L) || L[zt])) break e;
          if ((P || w) && (w = x.window === x ? x : (w = x.ownerDocument) ? w.defaultView || w.parentWindow : window, P ? (L = n.relatedTarget || n.toElement, P = g, L = L ? ln(L) : null, L !== null && (xe = rn(L), L !== xe || L.tag !== 5 && L.tag !== 6) && (L = null)) : (P = null, L = g), P !== L)) {
            if (M = Fu, C = "onMouseLeave", m = "onMouseEnter", d = "mouse", (e === "pointerout" || e === "pointerover") && (M = Uu, C = "onPointerLeave", m = "onPointerEnter", d = "pointer"), xe = P == null ? w : Pn(P), h = L == null ? w : Pn(L), w = new M(C, d + "leave", P, n, x), w.target = xe, w.relatedTarget = h, C = null, ln(x) === g && (M = new M(m, d + "enter", L, n, x), M.target = h, M.relatedTarget = xe, C = M), xe = C, P && L) t: {
              for (M = P, m = L, d = 0, h = M; h; h = zn(h)) d++;
              for (h = 0, C = m; C; C = zn(C)) h++;
              for (; 0 < d - h; ) M = zn(M), d--;
              for (; 0 < h - d; ) m = zn(m), h--;
              for (; d--; ) {
                if (M === m || m !== null && M === m.alternate) break t;
                M = zn(M), m = zn(m);
              }
              M = null;
            }
            else M = null;
            P !== null && fs(E, w, P, M, !1), L !== null && xe !== null && fs(E, xe, L, M, !0);
          }
        }
        e: {
          if (w = g ? Pn(g) : window, P = w.nodeName && w.nodeName.toLowerCase(), P === "select" || P === "input" && w.type === "file") var I = zd;
          else if (Qu(w)) if (Gu) I = Rd;
          else {
            I = Pd;
            var V = Nd;
          }
          else (P = w.nodeName) && P.toLowerCase() === "input" && (w.type === "checkbox" || w.type === "radio") && (I = Td);
          if (I && (I = I(e, g))) {
            bu(E, I, n, x);
            break e;
          }
          V && V(e, w, g), e === "focusout" && (V = w._wrapperState) && V.controlled && w.type === "number" && Kl(w, "number", w.value);
        }
        switch (V = g ? Pn(g) : window, e) {
          case "focusin":
            (Qu(V) || V.contentEditable === "true") && (Cn = V, Co = g, cr = null);
            break;
          case "focusout":
            cr = Co = Cn = null;
            break;
          case "mousedown":
            _o = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            _o = !1, ts(E, n, x);
            break;
          case "selectionchange":
            if (Md) break;
          case "keydown":
          case "keyup":
            ts(E, n, x);
        }
        var $;
        if (ko) e: {
          switch (e) {
            case "compositionstart":
              var H = "onCompositionStart";
              break e;
            case "compositionend":
              H = "onCompositionEnd";
              break e;
            case "compositionupdate":
              H = "onCompositionUpdate";
              break e;
          }
          H = void 0;
        }
        else En ? Hu(e, n) && (H = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (H = "onCompositionStart");
        H && (Vu && n.locale !== "ko" && (En || H !== "onCompositionStart" ? H === "onCompositionEnd" && En && ($ = Iu()) : (Ut = x, mo = "value" in Ut ? Ut.value : Ut.textContent, En = !0)), V = tl(g, H), 0 < V.length && (H = new Au(H, e, null, n, x), E.push({ event: H, listeners: V }), $ ? H.data = $ : ($ = Wu(n), $ !== null && (H.data = $)))), ($ = xd ? Sd(e, n) : Ed(e, n)) && (g = tl(g, "onBeforeInput"), 0 < g.length && (x = new Au("onBeforeInput", "beforeinput", null, n, x), E.push({ event: x, listeners: g }), x.data = $));
      }
      cs(E, t);
    });
  }
  function pr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function tl(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Kn(e, n), o != null && r.unshift(pr(e, o, l)), o = Kn(e, t), o != null && r.push(pr(e, o, l))), e = e.return;
    }
    return r;
  }
  function zn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function fs(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var a = n, c = a.alternate, g = a.stateNode;
      if (c !== null && c === r) break;
      a.tag === 5 && g !== null && (a = g, l ? (c = Kn(n, o), c != null && i.unshift(pr(n, c, a))) : l || (c = Kn(n, o), c != null && i.push(pr(n, c, a)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var Fd = /\r\n?/g, Ad = /\u0000|\uFFFD/g;
  function ps(e) {
    return (typeof e == "string" ? e : "" + e).replace(Fd, `
`).replace(Ad, "");
  }
  function nl(e, t, n) {
    if (t = ps(t), ps(e) !== t && n) throw Error(s(425));
  }
  function rl() {
  }
  var Lo = null, jo = null;
  function Mo(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Oo = typeof setTimeout == "function" ? setTimeout : void 0, Ud = typeof clearTimeout == "function" ? clearTimeout : void 0, ms = typeof Promise == "function" ? Promise : void 0, Vd = typeof queueMicrotask == "function" ? queueMicrotask : typeof ms < "u" ? function(e) {
    return ms.resolve(null).then(e).catch($d);
  } : Oo;
  function $d(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Io(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), rr(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    rr(t);
  }
  function $t(e) {
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
  function hs(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (t === 0) return e;
          t--;
        } else n === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Nn = Math.random().toString(36).slice(2), kt = "__reactFiber$" + Nn, mr = "__reactProps$" + Nn, zt = "__reactContainer$" + Nn, Do = "__reactEvents$" + Nn, Bd = "__reactListeners$" + Nn, Hd = "__reactHandles$" + Nn;
  function ln(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[zt] || n[kt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = hs(e); e !== null; ) {
          if (n = e[kt]) return n;
          e = hs(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function hr(e) {
    return e = e[kt] || e[zt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Pn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function ll(e) {
    return e[mr] || null;
  }
  var Fo = [], Tn = -1;
  function Bt(e) {
    return { current: e };
  }
  function de(e) {
    0 > Tn || (e.current = Fo[Tn], Fo[Tn] = null, Tn--);
  }
  function se(e, t) {
    Tn++, Fo[Tn] = e.current, e.current = t;
  }
  var Ht = {}, Fe = Bt(Ht), We = Bt(!1), on = Ht;
  function Rn(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Ht;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in n) l[o] = t[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Qe(e) {
    return e = e.childContextTypes, e != null;
  }
  function ol() {
    de(We), de(Fe);
  }
  function gs(e, t, n) {
    if (Fe.current !== Ht) throw Error(s(168));
    se(Fe, t), se(We, n);
  }
  function vs(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(s(108, ue(e) || "Unknown", l));
    return T({}, n, r);
  }
  function il(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ht, on = Fe.current, se(Fe, e), se(We, We.current), !0;
  }
  function ys(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(s(169));
    n ? (e = vs(e, t, on), r.__reactInternalMemoizedMergedChildContext = e, de(We), de(Fe), se(Fe, e)) : de(We), se(We, n);
  }
  var Nt = null, ul = !1, Ao = !1;
  function ws(e) {
    Nt === null ? Nt = [e] : Nt.push(e);
  }
  function Wd(e) {
    ul = !0, ws(e);
  }
  function Wt() {
    if (!Ao && Nt !== null) {
      Ao = !0;
      var e = 0, t = le;
      try {
        var n = Nt;
        for (le = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Nt = null, ul = !1;
      } catch (l) {
        throw Nt !== null && (Nt = Nt.slice(e + 1)), xu(oo, Wt), l;
      } finally {
        le = t, Ao = !1;
      }
    }
    return null;
  }
  var Ln = [], jn = 0, sl = null, al = 0, lt = [], ot = 0, un = null, Pt = 1, Tt = "";
  function sn(e, t) {
    Ln[jn++] = al, Ln[jn++] = sl, sl = e, al = t;
  }
  function ks(e, t, n) {
    lt[ot++] = Pt, lt[ot++] = Tt, lt[ot++] = un, un = e;
    var r = Pt;
    e = Tt;
    var l = 32 - dt(r) - 1;
    r &= ~(1 << l), n += 1;
    var o = 32 - dt(t) + l;
    if (30 < o) {
      var i = l - l % 5;
      o = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, Pt = 1 << 32 - dt(t) + l | n << l | r, Tt = o + e;
    } else Pt = 1 << o | n << l | r, Tt = e;
  }
  function Uo(e) {
    e.return !== null && (sn(e, 1), ks(e, 1, 0));
  }
  function Vo(e) {
    for (; e === sl; ) sl = Ln[--jn], Ln[jn] = null, al = Ln[--jn], Ln[jn] = null;
    for (; e === un; ) un = lt[--ot], lt[ot] = null, Tt = lt[--ot], lt[ot] = null, Pt = lt[--ot], lt[ot] = null;
  }
  var et = null, tt = null, he = !1, pt = null;
  function xs(e, t) {
    var n = at(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Ss(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, et = e, tt = $t(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, et = e, tt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = un !== null ? { id: Pt, overflow: Tt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = at(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, et = e, tt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function $o(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Bo(e) {
    if (he) {
      var t = tt;
      if (t) {
        var n = t;
        if (!Ss(e, t)) {
          if ($o(e)) throw Error(s(418));
          t = $t(n.nextSibling);
          var r = et;
          t && Ss(e, t) ? xs(r, n) : (e.flags = e.flags & -4097 | 2, he = !1, et = e);
        }
      } else {
        if ($o(e)) throw Error(s(418));
        e.flags = e.flags & -4097 | 2, he = !1, et = e;
      }
    }
  }
  function Es(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    et = e;
  }
  function cl(e) {
    if (e !== et) return !1;
    if (!he) return Es(e), he = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Mo(e.type, e.memoizedProps)), t && (t = tt)) {
      if ($o(e)) throw Cs(), Error(s(418));
      for (; t; ) xs(e, t), t = $t(t.nextSibling);
    }
    if (Es(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                tt = $t(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        tt = null;
      }
    } else tt = et ? $t(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Cs() {
    for (var e = tt; e; ) e = $t(e.nextSibling);
  }
  function Mn() {
    tt = et = null, he = !1;
  }
  function Ho(e) {
    pt === null ? pt = [e] : pt.push(e);
  }
  var Qd = pe.ReactCurrentBatchConfig;
  function gr(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(s(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(s(147, e));
        var l = r, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
          var a = l.refs;
          i === null ? delete a[o] : a[o] = i;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(s(284));
      if (!n._owner) throw Error(s(290, e));
    }
    return e;
  }
  function dl(e, t) {
    throw e = Object.prototype.toString.call(t), Error(s(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function _s(e) {
    var t = e._init;
    return t(e._payload);
  }
  function zs(e) {
    function t(m, d) {
      if (e) {
        var h = m.deletions;
        h === null ? (m.deletions = [d], m.flags |= 16) : h.push(d);
      }
    }
    function n(m, d) {
      if (!e) return null;
      for (; d !== null; ) t(m, d), d = d.sibling;
      return null;
    }
    function r(m, d) {
      for (m = /* @__PURE__ */ new Map(); d !== null; ) d.key !== null ? m.set(d.key, d) : m.set(d.index, d), d = d.sibling;
      return m;
    }
    function l(m, d) {
      return m = Jt(m, d), m.index = 0, m.sibling = null, m;
    }
    function o(m, d, h) {
      return m.index = h, e ? (h = m.alternate, h !== null ? (h = h.index, h < d ? (m.flags |= 2, d) : h) : (m.flags |= 2, d)) : (m.flags |= 1048576, d);
    }
    function i(m) {
      return e && m.alternate === null && (m.flags |= 2), m;
    }
    function a(m, d, h, C) {
      return d === null || d.tag !== 6 ? (d = Oi(h, m.mode, C), d.return = m, d) : (d = l(d, h), d.return = m, d);
    }
    function c(m, d, h, C) {
      var I = h.type;
      return I === Le ? x(m, d, h.props.children, C, h.key) : d !== null && (d.elementType === I || typeof I == "object" && I !== null && I.$$typeof === Ee && _s(I) === d.type) ? (C = l(d, h.props), C.ref = gr(m, d, h), C.return = m, C) : (C = Il(h.type, h.key, h.props, null, m.mode, C), C.ref = gr(m, d, h), C.return = m, C);
    }
    function g(m, d, h, C) {
      return d === null || d.tag !== 4 || d.stateNode.containerInfo !== h.containerInfo || d.stateNode.implementation !== h.implementation ? (d = Ii(h, m.mode, C), d.return = m, d) : (d = l(d, h.children || []), d.return = m, d);
    }
    function x(m, d, h, C, I) {
      return d === null || d.tag !== 7 ? (d = gn(h, m.mode, C, I), d.return = m, d) : (d = l(d, h), d.return = m, d);
    }
    function E(m, d, h) {
      if (typeof d == "string" && d !== "" || typeof d == "number") return d = Oi("" + d, m.mode, h), d.return = m, d;
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case Oe:
            return h = Il(d.type, d.key, d.props, null, m.mode, h), h.ref = gr(m, null, d), h.return = m, h;
          case ze:
            return d = Ii(d, m.mode, h), d.return = m, d;
          case Ee:
            var C = d._init;
            return E(m, C(d._payload), h);
        }
        if (Qn(d) || A(d)) return d = gn(d, m.mode, h, null), d.return = m, d;
        dl(m, d);
      }
      return null;
    }
    function w(m, d, h, C) {
      var I = d !== null ? d.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number") return I !== null ? null : a(m, d, "" + h, C);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Oe:
            return h.key === I ? c(m, d, h, C) : null;
          case ze:
            return h.key === I ? g(m, d, h, C) : null;
          case Ee:
            return I = h._init, w(
              m,
              d,
              I(h._payload),
              C
            );
        }
        if (Qn(h) || A(h)) return I !== null ? null : x(m, d, h, C, null);
        dl(m, h);
      }
      return null;
    }
    function P(m, d, h, C, I) {
      if (typeof C == "string" && C !== "" || typeof C == "number") return m = m.get(h) || null, a(d, m, "" + C, I);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case Oe:
            return m = m.get(C.key === null ? h : C.key) || null, c(d, m, C, I);
          case ze:
            return m = m.get(C.key === null ? h : C.key) || null, g(d, m, C, I);
          case Ee:
            var V = C._init;
            return P(m, d, h, V(C._payload), I);
        }
        if (Qn(C) || A(C)) return m = m.get(h) || null, x(d, m, C, I, null);
        dl(d, C);
      }
      return null;
    }
    function L(m, d, h, C) {
      for (var I = null, V = null, $ = d, H = d = 0, Te = null; $ !== null && H < h.length; H++) {
        $.index > H ? (Te = $, $ = null) : Te = $.sibling;
        var ne = w(m, $, h[H], C);
        if (ne === null) {
          $ === null && ($ = Te);
          break;
        }
        e && $ && ne.alternate === null && t(m, $), d = o(ne, d, H), V === null ? I = ne : V.sibling = ne, V = ne, $ = Te;
      }
      if (H === h.length) return n(m, $), he && sn(m, H), I;
      if ($ === null) {
        for (; H < h.length; H++) $ = E(m, h[H], C), $ !== null && (d = o($, d, H), V === null ? I = $ : V.sibling = $, V = $);
        return he && sn(m, H), I;
      }
      for ($ = r(m, $); H < h.length; H++) Te = P($, m, H, h[H], C), Te !== null && (e && Te.alternate !== null && $.delete(Te.key === null ? H : Te.key), d = o(Te, d, H), V === null ? I = Te : V.sibling = Te, V = Te);
      return e && $.forEach(function(qt) {
        return t(m, qt);
      }), he && sn(m, H), I;
    }
    function M(m, d, h, C) {
      var I = A(h);
      if (typeof I != "function") throw Error(s(150));
      if (h = I.call(h), h == null) throw Error(s(151));
      for (var V = I = null, $ = d, H = d = 0, Te = null, ne = h.next(); $ !== null && !ne.done; H++, ne = h.next()) {
        $.index > H ? (Te = $, $ = null) : Te = $.sibling;
        var qt = w(m, $, ne.value, C);
        if (qt === null) {
          $ === null && ($ = Te);
          break;
        }
        e && $ && qt.alternate === null && t(m, $), d = o(qt, d, H), V === null ? I = qt : V.sibling = qt, V = qt, $ = Te;
      }
      if (ne.done) return n(
        m,
        $
      ), he && sn(m, H), I;
      if ($ === null) {
        for (; !ne.done; H++, ne = h.next()) ne = E(m, ne.value, C), ne !== null && (d = o(ne, d, H), V === null ? I = ne : V.sibling = ne, V = ne);
        return he && sn(m, H), I;
      }
      for ($ = r(m, $); !ne.done; H++, ne = h.next()) ne = P($, m, H, ne.value, C), ne !== null && (e && ne.alternate !== null && $.delete(ne.key === null ? H : ne.key), d = o(ne, d, H), V === null ? I = ne : V.sibling = ne, V = ne);
      return e && $.forEach(function(_f) {
        return t(m, _f);
      }), he && sn(m, H), I;
    }
    function xe(m, d, h, C) {
      if (typeof h == "object" && h !== null && h.type === Le && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Oe:
            e: {
              for (var I = h.key, V = d; V !== null; ) {
                if (V.key === I) {
                  if (I = h.type, I === Le) {
                    if (V.tag === 7) {
                      n(m, V.sibling), d = l(V, h.props.children), d.return = m, m = d;
                      break e;
                    }
                  } else if (V.elementType === I || typeof I == "object" && I !== null && I.$$typeof === Ee && _s(I) === V.type) {
                    n(m, V.sibling), d = l(V, h.props), d.ref = gr(m, V, h), d.return = m, m = d;
                    break e;
                  }
                  n(m, V);
                  break;
                } else t(m, V);
                V = V.sibling;
              }
              h.type === Le ? (d = gn(h.props.children, m.mode, C, h.key), d.return = m, m = d) : (C = Il(h.type, h.key, h.props, null, m.mode, C), C.ref = gr(m, d, h), C.return = m, m = C);
            }
            return i(m);
          case ze:
            e: {
              for (V = h.key; d !== null; ) {
                if (d.key === V) if (d.tag === 4 && d.stateNode.containerInfo === h.containerInfo && d.stateNode.implementation === h.implementation) {
                  n(m, d.sibling), d = l(d, h.children || []), d.return = m, m = d;
                  break e;
                } else {
                  n(m, d);
                  break;
                }
                else t(m, d);
                d = d.sibling;
              }
              d = Ii(h, m.mode, C), d.return = m, m = d;
            }
            return i(m);
          case Ee:
            return V = h._init, xe(m, d, V(h._payload), C);
        }
        if (Qn(h)) return L(m, d, h, C);
        if (A(h)) return M(m, d, h, C);
        dl(m, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" ? (h = "" + h, d !== null && d.tag === 6 ? (n(m, d.sibling), d = l(d, h), d.return = m, m = d) : (n(m, d), d = Oi(h, m.mode, C), d.return = m, m = d), i(m)) : n(m, d);
    }
    return xe;
  }
  var On = zs(!0), Ns = zs(!1), fl = Bt(null), pl = null, In = null, Wo = null;
  function Qo() {
    Wo = In = pl = null;
  }
  function bo(e) {
    var t = fl.current;
    de(fl), e._currentValue = t;
  }
  function Go(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Dn(e, t) {
    pl = e, Wo = In = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (be = !0), e.firstContext = null);
  }
  function it(e) {
    var t = e._currentValue;
    if (Wo !== e) if (e = { context: e, memoizedValue: t, next: null }, In === null) {
      if (pl === null) throw Error(s(308));
      In = e, pl.dependencies = { lanes: 0, firstContext: e };
    } else In = In.next = e;
    return t;
  }
  var an = null;
  function Ko(e) {
    an === null ? an = [e] : an.push(e);
  }
  function Ps(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Ko(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Rt(e, r);
  }
  function Rt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Qt = !1;
  function Yo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Ts(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Lt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function bt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (q & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Rt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Ko(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Rt(e, n);
  }
  function ml(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, so(e, n);
    }
  }
  function Rs(e, t) {
    var n = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
      var l = null, o = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var i = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          o === null ? l = o = i : o = o.next = i, n = n.next;
        } while (n !== null);
        o === null ? l = o = t : o = o.next = t;
      } else l = o = t;
      n = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: o, shared: r.shared, effects: r.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function hl(e, t, n, r) {
    var l = e.updateQueue;
    Qt = !1;
    var o = l.firstBaseUpdate, i = l.lastBaseUpdate, a = l.shared.pending;
    if (a !== null) {
      l.shared.pending = null;
      var c = a, g = c.next;
      c.next = null, i === null ? o = g : i.next = g, i = c;
      var x = e.alternate;
      x !== null && (x = x.updateQueue, a = x.lastBaseUpdate, a !== i && (a === null ? x.firstBaseUpdate = g : a.next = g, x.lastBaseUpdate = c));
    }
    if (o !== null) {
      var E = l.baseState;
      i = 0, x = g = c = null, a = o;
      do {
        var w = a.lane, P = a.eventTime;
        if ((r & w) === w) {
          x !== null && (x = x.next = {
            eventTime: P,
            lane: 0,
            tag: a.tag,
            payload: a.payload,
            callback: a.callback,
            next: null
          });
          e: {
            var L = e, M = a;
            switch (w = t, P = n, M.tag) {
              case 1:
                if (L = M.payload, typeof L == "function") {
                  E = L.call(P, E, w);
                  break e;
                }
                E = L;
                break e;
              case 3:
                L.flags = L.flags & -65537 | 128;
              case 0:
                if (L = M.payload, w = typeof L == "function" ? L.call(P, E, w) : L, w == null) break e;
                E = T({}, E, w);
                break e;
              case 2:
                Qt = !0;
            }
          }
          a.callback !== null && a.lane !== 0 && (e.flags |= 64, w = l.effects, w === null ? l.effects = [a] : w.push(a));
        } else P = { eventTime: P, lane: w, tag: a.tag, payload: a.payload, callback: a.callback, next: null }, x === null ? (g = x = P, c = E) : x = x.next = P, i |= w;
        if (a = a.next, a === null) {
          if (a = l.shared.pending, a === null) break;
          w = a, a = w.next, w.next = null, l.lastBaseUpdate = w, l.shared.pending = null;
        }
      } while (!0);
      if (x === null && (c = E), l.baseState = c, l.firstBaseUpdate = g, l.lastBaseUpdate = x, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      fn |= i, e.lanes = i, e.memoizedState = E;
    }
  }
  function Ls(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(s(191, l));
        l.call(r);
      }
    }
  }
  var vr = {}, xt = Bt(vr), yr = Bt(vr), wr = Bt(vr);
  function cn(e) {
    if (e === vr) throw Error(s(174));
    return e;
  }
  function Xo(e, t) {
    switch (se(wr, t), se(yr, e), se(xt, vr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Xl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Xl(t, e);
    }
    de(xt), se(xt, t);
  }
  function Fn() {
    de(xt), de(yr), de(wr);
  }
  function js(e) {
    cn(wr.current);
    var t = cn(xt.current), n = Xl(t, e.type);
    t !== n && (se(yr, e), se(xt, n));
  }
  function Zo(e) {
    yr.current === e && (de(xt), de(yr));
  }
  var ve = Bt(0);
  function gl(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
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
  var Jo = [];
  function qo() {
    for (var e = 0; e < Jo.length; e++) Jo[e]._workInProgressVersionPrimary = null;
    Jo.length = 0;
  }
  var vl = pe.ReactCurrentDispatcher, ei = pe.ReactCurrentBatchConfig, dn = 0, ye = null, Ce = null, Ne = null, yl = !1, kr = !1, xr = 0, bd = 0;
  function Ae() {
    throw Error(s(321));
  }
  function ti(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ft(e[n], t[n])) return !1;
    return !0;
  }
  function ni(e, t, n, r, l, o) {
    if (dn = o, ye = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, vl.current = e === null || e.memoizedState === null ? Xd : Zd, e = n(r, l), kr) {
      o = 0;
      do {
        if (kr = !1, xr = 0, 25 <= o) throw Error(s(301));
        o += 1, Ne = Ce = null, t.updateQueue = null, vl.current = Jd, e = n(r, l);
      } while (kr);
    }
    if (vl.current = xl, t = Ce !== null && Ce.next !== null, dn = 0, Ne = Ce = ye = null, yl = !1, t) throw Error(s(300));
    return e;
  }
  function ri() {
    var e = xr !== 0;
    return xr = 0, e;
  }
  function St() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Ne === null ? ye.memoizedState = Ne = e : Ne = Ne.next = e, Ne;
  }
  function ut() {
    if (Ce === null) {
      var e = ye.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ce.next;
    var t = Ne === null ? ye.memoizedState : Ne.next;
    if (t !== null) Ne = t, Ce = e;
    else {
      if (e === null) throw Error(s(310));
      Ce = e, e = { memoizedState: Ce.memoizedState, baseState: Ce.baseState, baseQueue: Ce.baseQueue, queue: Ce.queue, next: null }, Ne === null ? ye.memoizedState = Ne = e : Ne = Ne.next = e;
    }
    return Ne;
  }
  function Sr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function li(e) {
    var t = ut(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = Ce, l = r.baseQueue, o = n.pending;
    if (o !== null) {
      if (l !== null) {
        var i = l.next;
        l.next = o.next, o.next = i;
      }
      r.baseQueue = l = o, n.pending = null;
    }
    if (l !== null) {
      o = l.next, r = r.baseState;
      var a = i = null, c = null, g = o;
      do {
        var x = g.lane;
        if ((dn & x) === x) c !== null && (c = c.next = { lane: 0, action: g.action, hasEagerState: g.hasEagerState, eagerState: g.eagerState, next: null }), r = g.hasEagerState ? g.eagerState : e(r, g.action);
        else {
          var E = {
            lane: x,
            action: g.action,
            hasEagerState: g.hasEagerState,
            eagerState: g.eagerState,
            next: null
          };
          c === null ? (a = c = E, i = r) : c = c.next = E, ye.lanes |= x, fn |= x;
        }
        g = g.next;
      } while (g !== null && g !== o);
      c === null ? i = r : c.next = a, ft(r, t.memoizedState) || (be = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = c, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, ye.lanes |= o, fn |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function oi(e) {
    var t = ut(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, o = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var i = l = l.next;
      do
        o = e(o, i.action), i = i.next;
      while (i !== l);
      ft(o, t.memoizedState) || (be = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
    }
    return [o, r];
  }
  function Ms() {
  }
  function Os(e, t) {
    var n = ye, r = ut(), l = t(), o = !ft(r.memoizedState, l);
    if (o && (r.memoizedState = l, be = !0), r = r.queue, ii(Fs.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || Ne !== null && Ne.memoizedState.tag & 1) {
      if (n.flags |= 2048, Er(9, Ds.bind(null, n, r, l, t), void 0, null), Pe === null) throw Error(s(349));
      (dn & 30) !== 0 || Is(n, t, l);
    }
    return l;
  }
  function Is(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = ye.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, ye.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ds(e, t, n, r) {
    t.value = n, t.getSnapshot = r, As(t) && Us(e);
  }
  function Fs(e, t, n) {
    return n(function() {
      As(t) && Us(e);
    });
  }
  function As(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ft(e, n);
    } catch {
      return !0;
    }
  }
  function Us(e) {
    var t = Rt(e, 1);
    t !== null && vt(t, e, 1, -1);
  }
  function Vs(e) {
    var t = St();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Sr, lastRenderedState: e }, t.queue = e, e = e.dispatch = Yd.bind(null, ye, e), [t.memoizedState, e];
  }
  function Er(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = ye.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, ye.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function $s() {
    return ut().memoizedState;
  }
  function wl(e, t, n, r) {
    var l = St();
    ye.flags |= e, l.memoizedState = Er(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function kl(e, t, n, r) {
    var l = ut();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (Ce !== null) {
      var i = Ce.memoizedState;
      if (o = i.destroy, r !== null && ti(r, i.deps)) {
        l.memoizedState = Er(t, n, o, r);
        return;
      }
    }
    ye.flags |= e, l.memoizedState = Er(1 | t, n, o, r);
  }
  function Bs(e, t) {
    return wl(8390656, 8, e, t);
  }
  function ii(e, t) {
    return kl(2048, 8, e, t);
  }
  function Hs(e, t) {
    return kl(4, 2, e, t);
  }
  function Ws(e, t) {
    return kl(4, 4, e, t);
  }
  function Qs(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function bs(e, t, n) {
    return n = n != null ? n.concat([e]) : null, kl(4, 4, Qs.bind(null, t, e), n);
  }
  function ui() {
  }
  function Gs(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && ti(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Ks(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && ti(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Ys(e, t, n) {
    return (dn & 21) === 0 ? (e.baseState && (e.baseState = !1, be = !0), e.memoizedState = n) : (ft(n, t) || (n = _u(), ye.lanes |= n, fn |= n, e.baseState = !0), t);
  }
  function Gd(e, t) {
    var n = le;
    le = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = ei.transition;
    ei.transition = {};
    try {
      e(!1), t();
    } finally {
      le = n, ei.transition = r;
    }
  }
  function Xs() {
    return ut().memoizedState;
  }
  function Kd(e, t, n) {
    var r = Xt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Zs(e)) Js(t, n);
    else if (n = Ps(e, t, n, r), n !== null) {
      var l = He();
      vt(n, e, r, l), qs(n, t, r);
    }
  }
  function Yd(e, t, n) {
    var r = Xt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Zs(e)) Js(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, a = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = a, ft(a, i)) {
          var c = t.interleaved;
          c === null ? (l.next = l, Ko(t)) : (l.next = c.next, c.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = Ps(e, t, l, r), n !== null && (l = He(), vt(n, e, r, l), qs(n, t, r));
    }
  }
  function Zs(e) {
    var t = e.alternate;
    return e === ye || t !== null && t === ye;
  }
  function Js(e, t) {
    kr = yl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function qs(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, so(e, n);
    }
  }
  var xl = { readContext: it, useCallback: Ae, useContext: Ae, useEffect: Ae, useImperativeHandle: Ae, useInsertionEffect: Ae, useLayoutEffect: Ae, useMemo: Ae, useReducer: Ae, useRef: Ae, useState: Ae, useDebugValue: Ae, useDeferredValue: Ae, useTransition: Ae, useMutableSource: Ae, useSyncExternalStore: Ae, useId: Ae, unstable_isNewReconciler: !1 }, Xd = { readContext: it, useCallback: function(e, t) {
    return St().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: it, useEffect: Bs, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, wl(
      4194308,
      4,
      Qs.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return wl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return wl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = St();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = St();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Kd.bind(null, ye, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = St();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Vs, useDebugValue: ui, useDeferredValue: function(e) {
    return St().memoizedState = e;
  }, useTransition: function() {
    var e = Vs(!1), t = e[0];
    return e = Gd.bind(null, e[1]), St().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = ye, l = St();
    if (he) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else {
      if (n = t(), Pe === null) throw Error(s(349));
      (dn & 30) !== 0 || Is(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, Bs(Fs.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, Er(9, Ds.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = St(), t = Pe.identifierPrefix;
    if (he) {
      var n = Tt, r = Pt;
      n = (r & ~(1 << 32 - dt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = xr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = bd++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Zd = {
    readContext: it,
    useCallback: Gs,
    useContext: it,
    useEffect: ii,
    useImperativeHandle: bs,
    useInsertionEffect: Hs,
    useLayoutEffect: Ws,
    useMemo: Ks,
    useReducer: li,
    useRef: $s,
    useState: function() {
      return li(Sr);
    },
    useDebugValue: ui,
    useDeferredValue: function(e) {
      var t = ut();
      return Ys(t, Ce.memoizedState, e);
    },
    useTransition: function() {
      var e = li(Sr)[0], t = ut().memoizedState;
      return [e, t];
    },
    useMutableSource: Ms,
    useSyncExternalStore: Os,
    useId: Xs,
    unstable_isNewReconciler: !1
  }, Jd = { readContext: it, useCallback: Gs, useContext: it, useEffect: ii, useImperativeHandle: bs, useInsertionEffect: Hs, useLayoutEffect: Ws, useMemo: Ks, useReducer: oi, useRef: $s, useState: function() {
    return oi(Sr);
  }, useDebugValue: ui, useDeferredValue: function(e) {
    var t = ut();
    return Ce === null ? t.memoizedState = e : Ys(t, Ce.memoizedState, e);
  }, useTransition: function() {
    var e = oi(Sr)[0], t = ut().memoizedState;
    return [e, t];
  }, useMutableSource: Ms, useSyncExternalStore: Os, useId: Xs, unstable_isNewReconciler: !1 };
  function mt(e, t) {
    if (e && e.defaultProps) {
      t = T({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function si(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : T({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Sl = { isMounted: function(e) {
    return (e = e._reactInternals) ? rn(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = He(), l = Xt(e), o = Lt(r, l);
    o.payload = t, n != null && (o.callback = n), t = bt(e, o, l), t !== null && (vt(t, e, l, r), ml(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = He(), l = Xt(e), o = Lt(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = bt(e, o, l), t !== null && (vt(t, e, l, r), ml(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = He(), r = Xt(e), l = Lt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = bt(e, l, r), t !== null && (vt(t, e, r, n), ml(t, e, r));
  } };
  function ea(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !ar(n, r) || !ar(l, o) : !0;
  }
  function ta(e, t, n) {
    var r = !1, l = Ht, o = t.contextType;
    return typeof o == "object" && o !== null ? o = it(o) : (l = Qe(t) ? on : Fe.current, r = t.contextTypes, o = (r = r != null) ? Rn(e, l) : Ht), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Sl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function na(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Sl.enqueueReplaceState(t, t.state, null);
  }
  function ai(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Yo(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = it(o) : (o = Qe(t) ? on : Fe.current, l.context = Rn(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (si(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Sl.enqueueReplaceState(l, l.state, null), hl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function An(e, t) {
    try {
      var n = "", r = t;
      do
        n += ee(r), r = r.return;
      while (r);
      var l = n;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function ci(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function di(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var qd = typeof WeakMap == "function" ? WeakMap : Map;
  function ra(e, t, n) {
    n = Lt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Tl || (Tl = !0, zi = r), di(e, t);
    }, n;
  }
  function la(e, t, n) {
    n = Lt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        di(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      di(e, t), typeof r != "function" && (Kt === null ? Kt = /* @__PURE__ */ new Set([this]) : Kt.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function oa(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new qd();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = mf.bind(null, e, t, n), t.then(e, e));
  }
  function ia(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function ua(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Lt(-1, 1), t.tag = 2, bt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var ef = pe.ReactCurrentOwner, be = !1;
  function Be(e, t, n, r) {
    t.child = e === null ? Ns(t, null, n, r) : On(t, e.child, n, r);
  }
  function sa(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return Dn(t, l), r = ni(e, t, n, r, o, l), n = ri(), e !== null && !be ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, jt(e, t, l)) : (he && n && Uo(t), t.flags |= 1, Be(e, t, r, l), t.child);
  }
  function aa(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !Mi(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, ca(e, t, o, r, l)) : (e = Il(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : ar, n(i, r) && e.ref === t.ref) return jt(e, t, l);
    }
    return t.flags |= 1, e = Jt(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ca(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (ar(o, r) && e.ref === t.ref) if (be = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (be = !0);
      else return t.lanes = e.lanes, jt(e, t, l);
    }
    return fi(e, t, n, r, l);
  }
  function da(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, se(Vn, nt), nt |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, se(Vn, nt), nt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, se(Vn, nt), nt |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, se(Vn, nt), nt |= r;
    return Be(e, t, l, n), t.child;
  }
  function fa(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function fi(e, t, n, r, l) {
    var o = Qe(n) ? on : Fe.current;
    return o = Rn(t, o), Dn(t, l), n = ni(e, t, n, r, o, l), r = ri(), e !== null && !be ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, jt(e, t, l)) : (he && r && Uo(t), t.flags |= 1, Be(e, t, n, l), t.child);
  }
  function pa(e, t, n, r, l) {
    if (Qe(n)) {
      var o = !0;
      il(t);
    } else o = !1;
    if (Dn(t, l), t.stateNode === null) Cl(e, t), ta(t, n, r), ai(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, a = t.memoizedProps;
      i.props = a;
      var c = i.context, g = n.contextType;
      typeof g == "object" && g !== null ? g = it(g) : (g = Qe(n) ? on : Fe.current, g = Rn(t, g));
      var x = n.getDerivedStateFromProps, E = typeof x == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      E || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (a !== r || c !== g) && na(t, i, r, g), Qt = !1;
      var w = t.memoizedState;
      i.state = w, hl(t, r, i, l), c = t.memoizedState, a !== r || w !== c || We.current || Qt ? (typeof x == "function" && (si(t, n, x, r), c = t.memoizedState), (a = Qt || ea(t, n, a, r, w, c, g)) ? (E || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = c), i.props = r, i.state = c, i.context = g, r = a) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, Ts(e, t), a = t.memoizedProps, g = t.type === t.elementType ? a : mt(t.type, a), i.props = g, E = t.pendingProps, w = i.context, c = n.contextType, typeof c == "object" && c !== null ? c = it(c) : (c = Qe(n) ? on : Fe.current, c = Rn(t, c));
      var P = n.getDerivedStateFromProps;
      (x = typeof P == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (a !== E || w !== c) && na(t, i, r, c), Qt = !1, w = t.memoizedState, i.state = w, hl(t, r, i, l);
      var L = t.memoizedState;
      a !== E || w !== L || We.current || Qt ? (typeof P == "function" && (si(t, n, P, r), L = t.memoizedState), (g = Qt || ea(t, n, g, r, w, L, c) || !1) ? (x || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, L, c), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, L, c)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || a === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || a === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = L), i.props = r, i.state = L, i.context = c, r = g) : (typeof i.componentDidUpdate != "function" || a === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || a === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return pi(e, t, n, r, o, l);
  }
  function pi(e, t, n, r, l, o) {
    fa(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && ys(t, n, !1), jt(e, t, o);
    r = t.stateNode, ef.current = t;
    var a = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = On(t, e.child, null, o), t.child = On(t, null, a, o)) : Be(e, t, a, o), t.memoizedState = r.state, l && ys(t, n, !0), t.child;
  }
  function ma(e) {
    var t = e.stateNode;
    t.pendingContext ? gs(e, t.pendingContext, t.pendingContext !== t.context) : t.context && gs(e, t.context, !1), Xo(e, t.containerInfo);
  }
  function ha(e, t, n, r, l) {
    return Mn(), Ho(l), t.flags |= 256, Be(e, t, n, r), t.child;
  }
  var mi = { dehydrated: null, treeContext: null, retryLane: 0 };
  function hi(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function ga(e, t, n) {
    var r = t.pendingProps, l = ve.current, o = !1, i = (t.flags & 128) !== 0, a;
    if ((a = i) || (a = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), a ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), se(ve, l & 1), e === null)
      return Bo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = Dl(i, r, 0, null), e = gn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = hi(n), t.memoizedState = mi, e) : gi(t, i));
    if (l = e.memoizedState, l !== null && (a = l.dehydrated, a !== null)) return tf(e, t, i, r, a, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, a = l.sibling;
      var c = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = c, t.deletions = null) : (r = Jt(l, c), r.subtreeFlags = l.subtreeFlags & 14680064), a !== null ? o = Jt(a, o) : (o = gn(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? hi(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = mi, r;
    }
    return o = e.child, e = o.sibling, r = Jt(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function gi(e, t) {
    return t = Dl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function El(e, t, n, r) {
    return r !== null && Ho(r), On(t, e.child, null, n), e = gi(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function tf(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = ci(Error(s(422))), El(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = Dl({ mode: "visible", children: r.children }, l, 0, null), o = gn(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && On(t, e.child, null, i), t.child.memoizedState = hi(i), t.memoizedState = mi, o);
    if ((t.mode & 1) === 0) return El(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var a = r.dgst;
      return r = a, o = Error(s(419)), r = ci(o, r, void 0), El(e, t, i, r);
    }
    if (a = (i & e.childLanes) !== 0, be || a) {
      if (r = Pe, r !== null) {
        switch (i & -i) {
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
        l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Rt(e, l), vt(r, e, l, -1));
      }
      return ji(), r = ci(Error(s(421))), El(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = hf.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, tt = $t(l.nextSibling), et = t, he = !0, pt = null, e !== null && (lt[ot++] = Pt, lt[ot++] = Tt, lt[ot++] = un, Pt = e.id, Tt = e.overflow, un = t), t = gi(t, r.children), t.flags |= 4096, t);
  }
  function va(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Go(e.return, t, n);
  }
  function vi(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function ya(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (Be(e, t, r.children, n), r = ve.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && va(e, n, t);
        else if (e.tag === 19) va(e, n, t);
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
      r &= 1;
    }
    if (se(ve, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && gl(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), vi(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && gl(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        vi(t, !0, n, null, o);
        break;
      case "together":
        vi(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Cl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function jt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), fn |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, n = Jt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Jt(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function nf(e, t, n) {
    switch (t.tag) {
      case 3:
        ma(t), Mn();
        break;
      case 5:
        js(t);
        break;
      case 1:
        Qe(t.type) && il(t);
        break;
      case 4:
        Xo(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        se(fl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (se(ve, ve.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? ga(e, t, n) : (se(ve, ve.current & 1), e = jt(e, t, n), e !== null ? e.sibling : null);
        se(ve, ve.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return ya(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), se(ve, ve.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, da(e, t, n);
    }
    return jt(e, t, n);
  }
  var wa, yi, ka, xa;
  wa = function(e, t) {
    for (var n = t.child; n !== null; ) {
      if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
      else if (n.tag !== 4 && n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === t) return;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
  }, yi = function() {
  }, ka = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, cn(xt.current);
      var o = null;
      switch (n) {
        case "input":
          l = bl(e, l), r = bl(e, r), o = [];
          break;
        case "select":
          l = T({}, l, { value: void 0 }), r = T({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = Yl(e, l), r = Yl(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = rl);
      }
      Zl(n, r);
      var i;
      n = null;
      for (g in l) if (!r.hasOwnProperty(g) && l.hasOwnProperty(g) && l[g] != null) if (g === "style") {
        var a = l[g];
        for (i in a) a.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else g !== "dangerouslySetInnerHTML" && g !== "children" && g !== "suppressContentEditableWarning" && g !== "suppressHydrationWarning" && g !== "autoFocus" && (y.hasOwnProperty(g) ? o || (o = []) : (o = o || []).push(g, null));
      for (g in r) {
        var c = r[g];
        if (a = l != null ? l[g] : void 0, r.hasOwnProperty(g) && c !== a && (c != null || a != null)) if (g === "style") if (a) {
          for (i in a) !a.hasOwnProperty(i) || c && c.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in c) c.hasOwnProperty(i) && a[i] !== c[i] && (n || (n = {}), n[i] = c[i]);
        } else n || (o || (o = []), o.push(
          g,
          n
        )), n = c;
        else g === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, a = a ? a.__html : void 0, c != null && a !== c && (o = o || []).push(g, c)) : g === "children" ? typeof c != "string" && typeof c != "number" || (o = o || []).push(g, "" + c) : g !== "suppressContentEditableWarning" && g !== "suppressHydrationWarning" && (y.hasOwnProperty(g) ? (c != null && g === "onScroll" && ce("scroll", e), o || a === c || (o = [])) : (o = o || []).push(g, c));
      }
      n && (o = o || []).push("style", n);
      var g = o;
      (t.updateQueue = g) && (t.flags |= 4);
    }
  }, xa = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function Cr(e, t) {
    if (!he) switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
        n === null ? e.tail = null : n.sibling = null;
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
        r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
    }
  }
  function Ue(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function rf(e, t, n) {
    var r = t.pendingProps;
    switch (Vo(t), t.tag) {
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
        return Ue(t), null;
      case 1:
        return Qe(t.type) && ol(), Ue(t), null;
      case 3:
        return r = t.stateNode, Fn(), de(We), de(Fe), qo(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (cl(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, pt !== null && (Ti(pt), pt = null))), yi(e, t), Ue(t), null;
      case 5:
        Zo(t);
        var l = cn(wr.current);
        if (n = t.type, e !== null && t.stateNode != null) ka(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(s(166));
            return Ue(t), null;
          }
          if (e = cn(xt.current), cl(t)) {
            r = t.stateNode, n = t.type;
            var o = t.memoizedProps;
            switch (r[kt] = t, r[mr] = o, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                ce("cancel", r), ce("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                ce("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < dr.length; l++) ce(dr[l], r);
                break;
              case "source":
                ce("error", r);
                break;
              case "img":
              case "image":
              case "link":
                ce(
                  "error",
                  r
                ), ce("load", r);
                break;
              case "details":
                ce("toggle", r);
                break;
              case "input":
                tu(r, o), ce("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, ce("invalid", r);
                break;
              case "textarea":
                lu(r, o), ce("invalid", r);
            }
            Zl(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var a = o[i];
              i === "children" ? typeof a == "string" ? r.textContent !== a && (o.suppressHydrationWarning !== !0 && nl(r.textContent, a, e), l = ["children", a]) : typeof a == "number" && r.textContent !== "" + a && (o.suppressHydrationWarning !== !0 && nl(
                r.textContent,
                a,
                e
              ), l = ["children", "" + a]) : y.hasOwnProperty(i) && a != null && i === "onScroll" && ce("scroll", r);
            }
            switch (n) {
              case "input":
                Mr(r), ru(r, o, !0);
                break;
              case "textarea":
                Mr(r), iu(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = rl);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = uu(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[kt] = t, e[mr] = r, wa(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = Jl(n, r), n) {
                case "dialog":
                  ce("cancel", e), ce("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  ce("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < dr.length; l++) ce(dr[l], e);
                  l = r;
                  break;
                case "source":
                  ce("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  ce(
                    "error",
                    e
                  ), ce("load", e), l = r;
                  break;
                case "details":
                  ce("toggle", e), l = r;
                  break;
                case "input":
                  tu(e, r), l = bl(e, r), ce("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = T({}, r, { value: void 0 }), ce("invalid", e);
                  break;
                case "textarea":
                  lu(e, r), l = Yl(e, r), ce("invalid", e);
                  break;
                default:
                  l = r;
              }
              Zl(n, l), a = l;
              for (o in a) if (a.hasOwnProperty(o)) {
                var c = a[o];
                o === "style" ? cu(e, c) : o === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && su(e, c)) : o === "children" ? typeof c == "string" ? (n !== "textarea" || c !== "") && bn(e, c) : typeof c == "number" && bn(e, "" + c) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (y.hasOwnProperty(o) ? c != null && o === "onScroll" && ce("scroll", e) : c != null && Re(e, o, c, i));
              }
              switch (n) {
                case "input":
                  Mr(e), ru(e, r, !1);
                  break;
                case "textarea":
                  Mr(e), iu(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + re(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? yn(e, !!r.multiple, o, !1) : r.defaultValue != null && yn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = rl);
              }
              switch (n) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
            }
            r && (t.flags |= 4);
          }
          t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
        }
        return Ue(t), null;
      case 6:
        if (e && t.stateNode != null) xa(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(s(166));
          if (n = cn(wr.current), cn(xt.current), cl(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[kt] = t, (o = r.nodeValue !== n) && (e = et, e !== null)) switch (e.tag) {
              case 3:
                nl(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && nl(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[kt] = t, t.stateNode = r;
        }
        return Ue(t), null;
      case 13:
        if (de(ve), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (he && tt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Cs(), Mn(), t.flags |= 98560, o = !1;
          else if (o = cl(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(s(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(s(317));
              o[kt] = t;
            } else Mn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ue(t), o = !1;
          } else pt !== null && (Ti(pt), pt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ve.current & 1) !== 0 ? _e === 0 && (_e = 3) : ji())), t.updateQueue !== null && (t.flags |= 4), Ue(t), null);
      case 4:
        return Fn(), yi(e, t), e === null && fr(t.stateNode.containerInfo), Ue(t), null;
      case 10:
        return bo(t.type._context), Ue(t), null;
      case 17:
        return Qe(t.type) && ol(), Ue(t), null;
      case 19:
        if (de(ve), o = t.memoizedState, o === null) return Ue(t), null;
        if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) Cr(o, !1);
        else {
          if (_e !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (i = gl(e), i !== null) {
              for (t.flags |= 128, Cr(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return se(ve, ve.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && ke() > $n && (t.flags |= 128, r = !0, Cr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = gl(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), Cr(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !he) return Ue(t), null;
          } else 2 * ke() - o.renderingStartTime > $n && n !== 1073741824 && (t.flags |= 128, r = !0, Cr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = ke(), t.sibling = null, n = ve.current, se(ve, r ? n & 1 | 2 : n & 1), t) : (Ue(t), null);
      case 22:
      case 23:
        return Li(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (nt & 1073741824) !== 0 && (Ue(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ue(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function lf(e, t) {
    switch (Vo(t), t.tag) {
      case 1:
        return Qe(t.type) && ol(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Fn(), de(We), de(Fe), qo(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Zo(t), null;
      case 13:
        if (de(ve), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(s(340));
          Mn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return de(ve), null;
      case 4:
        return Fn(), null;
      case 10:
        return bo(t.type._context), null;
      case 22:
      case 23:
        return Li(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var _l = !1, Ve = !1, of = typeof WeakSet == "function" ? WeakSet : Set, R = null;
  function Un(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      we(e, t, r);
    }
    else n.current = null;
  }
  function wi(e, t, n) {
    try {
      n();
    } catch (r) {
      we(e, t, r);
    }
  }
  var Sa = !1;
  function uf(e, t) {
    if (Lo = Qr, e = es(), Eo(e)) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        n = (n = e.ownerDocument) && n.defaultView || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset, o = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, o.nodeType;
          } catch {
            n = null;
            break e;
          }
          var i = 0, a = -1, c = -1, g = 0, x = 0, E = e, w = null;
          t: for (; ; ) {
            for (var P; E !== n || l !== 0 && E.nodeType !== 3 || (a = i + l), E !== o || r !== 0 && E.nodeType !== 3 || (c = i + r), E.nodeType === 3 && (i += E.nodeValue.length), (P = E.firstChild) !== null; )
              w = E, E = P;
            for (; ; ) {
              if (E === e) break t;
              if (w === n && ++g === l && (a = i), w === o && ++x === r && (c = i), (P = E.nextSibling) !== null) break;
              E = w, w = E.parentNode;
            }
            E = P;
          }
          n = a === -1 || c === -1 ? null : { start: a, end: c };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (jo = { focusedElem: e, selectionRange: n }, Qr = !1, R = t; R !== null; ) if (t = R, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, R = e;
    else for (; R !== null; ) {
      t = R;
      try {
        var L = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (L !== null) {
              var M = L.memoizedProps, xe = L.memoizedState, m = t.stateNode, d = m.getSnapshotBeforeUpdate(t.elementType === t.type ? M : mt(t.type, M), xe);
              m.__reactInternalSnapshotBeforeUpdate = d;
            }
            break;
          case 3:
            var h = t.stateNode.containerInfo;
            h.nodeType === 1 ? h.textContent = "" : h.nodeType === 9 && h.documentElement && h.removeChild(h.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(s(163));
        }
      } catch (C) {
        we(t, t.return, C);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, R = e;
        break;
      }
      R = t.return;
    }
    return L = Sa, Sa = !1, L;
  }
  function _r(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && wi(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function zl(e, t) {
    if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
      var n = t = t.next;
      do {
        if ((n.tag & e) === e) {
          var r = n.create;
          n.destroy = r();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function ki(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      switch (e.tag) {
        case 5:
          e = n;
          break;
        default:
          e = n;
      }
      typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function Ea(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Ea(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[kt], delete t[mr], delete t[Do], delete t[Bd], delete t[Hd])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Ca(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function _a(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Ca(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function xi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = rl));
    else if (r !== 4 && (e = e.child, e !== null)) for (xi(e, t, n), e = e.sibling; e !== null; ) xi(e, t, n), e = e.sibling;
  }
  function Si(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (Si(e, t, n), e = e.sibling; e !== null; ) Si(e, t, n), e = e.sibling;
  }
  var je = null, ht = !1;
  function Gt(e, t, n) {
    for (n = n.child; n !== null; ) za(e, t, n), n = n.sibling;
  }
  function za(e, t, n) {
    if (wt && typeof wt.onCommitFiberUnmount == "function") try {
      wt.onCommitFiberUnmount(Ur, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Ve || Un(n, t);
      case 6:
        var r = je, l = ht;
        je = null, Gt(e, t, n), je = r, ht = l, je !== null && (ht ? (e = je, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : je.removeChild(n.stateNode));
        break;
      case 18:
        je !== null && (ht ? (e = je, n = n.stateNode, e.nodeType === 8 ? Io(e.parentNode, n) : e.nodeType === 1 && Io(e, n), rr(e)) : Io(je, n.stateNode));
        break;
      case 4:
        r = je, l = ht, je = n.stateNode.containerInfo, ht = !0, Gt(e, t, n), je = r, ht = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Ve && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, i = o.destroy;
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && wi(n, t, i), l = l.next;
          } while (l !== r);
        }
        Gt(e, t, n);
        break;
      case 1:
        if (!Ve && (Un(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (a) {
          we(n, t, a);
        }
        Gt(e, t, n);
        break;
      case 21:
        Gt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Ve = (r = Ve) || n.memoizedState !== null, Gt(e, t, n), Ve = r) : Gt(e, t, n);
        break;
      default:
        Gt(e, t, n);
    }
  }
  function Na(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new of()), t.forEach(function(r) {
        var l = gf.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function gt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var o = e, i = t, a = i;
        e: for (; a !== null; ) {
          switch (a.tag) {
            case 5:
              je = a.stateNode, ht = !1;
              break e;
            case 3:
              je = a.stateNode.containerInfo, ht = !0;
              break e;
            case 4:
              je = a.stateNode.containerInfo, ht = !0;
              break e;
          }
          a = a.return;
        }
        if (je === null) throw Error(s(160));
        za(o, i, l), je = null, ht = !1;
        var c = l.alternate;
        c !== null && (c.return = null), l.return = null;
      } catch (g) {
        we(l, t, g);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Pa(t, e), t = t.sibling;
  }
  function Pa(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (gt(t, e), Et(e), r & 4) {
          try {
            _r(3, e, e.return), zl(3, e);
          } catch (M) {
            we(e, e.return, M);
          }
          try {
            _r(5, e, e.return);
          } catch (M) {
            we(e, e.return, M);
          }
        }
        break;
      case 1:
        gt(t, e), Et(e), r & 512 && n !== null && Un(n, n.return);
        break;
      case 5:
        if (gt(t, e), Et(e), r & 512 && n !== null && Un(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            bn(l, "");
          } catch (M) {
            we(e, e.return, M);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, a = e.type, c = e.updateQueue;
          if (e.updateQueue = null, c !== null) try {
            a === "input" && o.type === "radio" && o.name != null && nu(l, o), Jl(a, i);
            var g = Jl(a, o);
            for (i = 0; i < c.length; i += 2) {
              var x = c[i], E = c[i + 1];
              x === "style" ? cu(l, E) : x === "dangerouslySetInnerHTML" ? su(l, E) : x === "children" ? bn(l, E) : Re(l, x, E, g);
            }
            switch (a) {
              case "input":
                Gl(l, o);
                break;
              case "textarea":
                ou(l, o);
                break;
              case "select":
                var w = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var P = o.value;
                P != null ? yn(l, !!o.multiple, P, !1) : w !== !!o.multiple && (o.defaultValue != null ? yn(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : yn(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[mr] = o;
          } catch (M) {
            we(e, e.return, M);
          }
        }
        break;
      case 6:
        if (gt(t, e), Et(e), r & 4) {
          if (e.stateNode === null) throw Error(s(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (M) {
            we(e, e.return, M);
          }
        }
        break;
      case 3:
        if (gt(t, e), Et(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          rr(t.containerInfo);
        } catch (M) {
          we(e, e.return, M);
        }
        break;
      case 4:
        gt(t, e), Et(e);
        break;
      case 13:
        gt(t, e), Et(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (_i = ke())), r & 4 && Na(e);
        break;
      case 22:
        if (x = n !== null && n.memoizedState !== null, e.mode & 1 ? (Ve = (g = Ve) || x, gt(t, e), Ve = g) : gt(t, e), Et(e), r & 8192) {
          if (g = e.memoizedState !== null, (e.stateNode.isHidden = g) && !x && (e.mode & 1) !== 0) for (R = e, x = e.child; x !== null; ) {
            for (E = R = x; R !== null; ) {
              switch (w = R, P = w.child, w.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  _r(4, w, w.return);
                  break;
                case 1:
                  Un(w, w.return);
                  var L = w.stateNode;
                  if (typeof L.componentWillUnmount == "function") {
                    r = w, n = w.return;
                    try {
                      t = r, L.props = t.memoizedProps, L.state = t.memoizedState, L.componentWillUnmount();
                    } catch (M) {
                      we(r, n, M);
                    }
                  }
                  break;
                case 5:
                  Un(w, w.return);
                  break;
                case 22:
                  if (w.memoizedState !== null) {
                    La(E);
                    continue;
                  }
              }
              P !== null ? (P.return = w, R = P) : La(E);
            }
            x = x.sibling;
          }
          e: for (x = null, E = e; ; ) {
            if (E.tag === 5) {
              if (x === null) {
                x = E;
                try {
                  l = E.stateNode, g ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (a = E.stateNode, c = E.memoizedProps.style, i = c != null && c.hasOwnProperty("display") ? c.display : null, a.style.display = au("display", i));
                } catch (M) {
                  we(e, e.return, M);
                }
              }
            } else if (E.tag === 6) {
              if (x === null) try {
                E.stateNode.nodeValue = g ? "" : E.memoizedProps;
              } catch (M) {
                we(e, e.return, M);
              }
            } else if ((E.tag !== 22 && E.tag !== 23 || E.memoizedState === null || E === e) && E.child !== null) {
              E.child.return = E, E = E.child;
              continue;
            }
            if (E === e) break e;
            for (; E.sibling === null; ) {
              if (E.return === null || E.return === e) break e;
              x === E && (x = null), E = E.return;
            }
            x === E && (x = null), E.sibling.return = E.return, E = E.sibling;
          }
        }
        break;
      case 19:
        gt(t, e), Et(e), r & 4 && Na(e);
        break;
      case 21:
        break;
      default:
        gt(
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
          for (var n = e.return; n !== null; ) {
            if (Ca(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(s(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (bn(l, ""), r.flags &= -33);
            var o = _a(e);
            Si(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, a = _a(e);
            xi(e, a, i);
            break;
          default:
            throw Error(s(161));
        }
      } catch (c) {
        we(e, e.return, c);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function sf(e, t, n) {
    R = e, Ta(e);
  }
  function Ta(e, t, n) {
    for (var r = (e.mode & 1) !== 0; R !== null; ) {
      var l = R, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || _l;
        if (!i) {
          var a = l.alternate, c = a !== null && a.memoizedState !== null || Ve;
          a = _l;
          var g = Ve;
          if (_l = i, (Ve = c) && !g) for (R = l; R !== null; ) i = R, c = i.child, i.tag === 22 && i.memoizedState !== null ? ja(l) : c !== null ? (c.return = i, R = c) : ja(l);
          for (; o !== null; ) R = o, Ta(o), o = o.sibling;
          R = l, _l = a, Ve = g;
        }
        Ra(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, R = o) : Ra(e);
    }
  }
  function Ra(e) {
    for (; R !== null; ) {
      var t = R;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Ve || zl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Ve) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : mt(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && Ls(t, o, r);
              break;
            case 3:
              var i = t.updateQueue;
              if (i !== null) {
                if (n = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    n = t.child.stateNode;
                    break;
                  case 1:
                    n = t.child.stateNode;
                }
                Ls(t, i, n);
              }
              break;
            case 5:
              var a = t.stateNode;
              if (n === null && t.flags & 4) {
                n = a;
                var c = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    c.autoFocus && n.focus();
                    break;
                  case "img":
                    c.src && (n.src = c.src);
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
                var g = t.alternate;
                if (g !== null) {
                  var x = g.memoizedState;
                  if (x !== null) {
                    var E = x.dehydrated;
                    E !== null && rr(E);
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
              throw Error(s(163));
          }
          Ve || t.flags & 512 && ki(t);
        } catch (w) {
          we(t, t.return, w);
        }
      }
      if (t === e) {
        R = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, R = n;
        break;
      }
      R = t.return;
    }
  }
  function La(e) {
    for (; R !== null; ) {
      var t = R;
      if (t === e) {
        R = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, R = n;
        break;
      }
      R = t.return;
    }
  }
  function ja(e) {
    for (; R !== null; ) {
      var t = R;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              zl(4, t);
            } catch (c) {
              we(t, n, c);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (c) {
                we(t, l, c);
              }
            }
            var o = t.return;
            try {
              ki(t);
            } catch (c) {
              we(t, o, c);
            }
            break;
          case 5:
            var i = t.return;
            try {
              ki(t);
            } catch (c) {
              we(t, i, c);
            }
        }
      } catch (c) {
        we(t, t.return, c);
      }
      if (t === e) {
        R = null;
        break;
      }
      var a = t.sibling;
      if (a !== null) {
        a.return = t.return, R = a;
        break;
      }
      R = t.return;
    }
  }
  var af = Math.ceil, Nl = pe.ReactCurrentDispatcher, Ei = pe.ReactCurrentOwner, st = pe.ReactCurrentBatchConfig, q = 0, Pe = null, Se = null, Me = 0, nt = 0, Vn = Bt(0), _e = 0, zr = null, fn = 0, Pl = 0, Ci = 0, Nr = null, Ge = null, _i = 0, $n = 1 / 0, Mt = null, Tl = !1, zi = null, Kt = null, Rl = !1, Yt = null, Ll = 0, Pr = 0, Ni = null, jl = -1, Ml = 0;
  function He() {
    return (q & 6) !== 0 ? ke() : jl !== -1 ? jl : jl = ke();
  }
  function Xt(e) {
    return (e.mode & 1) === 0 ? 1 : (q & 2) !== 0 && Me !== 0 ? Me & -Me : Qd.transition !== null ? (Ml === 0 && (Ml = _u()), Ml) : (e = le, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Ou(e.type)), e);
  }
  function vt(e, t, n, r) {
    if (50 < Pr) throw Pr = 0, Ni = null, Error(s(185));
    Jn(e, n, r), ((q & 2) === 0 || e !== Pe) && (e === Pe && ((q & 2) === 0 && (Pl |= n), _e === 4 && Zt(e, Me)), Ke(e, r), n === 1 && q === 0 && (t.mode & 1) === 0 && ($n = ke() + 500, ul && Wt()));
  }
  function Ke(e, t) {
    var n = e.callbackNode;
    Qc(e, t);
    var r = Br(e, e === Pe ? Me : 0);
    if (r === 0) n !== null && Su(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && Su(n), t === 1) e.tag === 0 ? Wd(Oa.bind(null, e)) : ws(Oa.bind(null, e)), Vd(function() {
        (q & 6) === 0 && Wt();
      }), n = null;
      else {
        switch (zu(r)) {
          case 1:
            n = oo;
            break;
          case 4:
            n = Eu;
            break;
          case 16:
            n = Ar;
            break;
          case 536870912:
            n = Cu;
            break;
          default:
            n = Ar;
        }
        n = Ba(n, Ma.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Ma(e, t) {
    if (jl = -1, Ml = 0, (q & 6) !== 0) throw Error(s(327));
    var n = e.callbackNode;
    if (Bn() && e.callbackNode !== n) return null;
    var r = Br(e, e === Pe ? Me : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ol(e, r);
    else {
      t = r;
      var l = q;
      q |= 2;
      var o = Da();
      (Pe !== e || Me !== t) && (Mt = null, $n = ke() + 500, mn(e, t));
      do
        try {
          ff();
          break;
        } catch (a) {
          Ia(e, a);
        }
      while (!0);
      Qo(), Nl.current = o, q = l, Se !== null ? t = 0 : (Pe = null, Me = 0, t = _e);
    }
    if (t !== 0) {
      if (t === 2 && (l = io(e), l !== 0 && (r = l, t = Pi(e, l))), t === 1) throw n = zr, mn(e, 0), Zt(e, r), Ke(e, ke()), n;
      if (t === 6) Zt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !cf(l) && (t = Ol(e, r), t === 2 && (o = io(e), o !== 0 && (r = o, t = Pi(e, o))), t === 1)) throw n = zr, mn(e, 0), Zt(e, r), Ke(e, ke()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            hn(e, Ge, Mt);
            break;
          case 3:
            if (Zt(e, r), (r & 130023424) === r && (t = _i + 500 - ke(), 10 < t)) {
              if (Br(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                He(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Oo(hn.bind(null, e, Ge, Mt), t);
              break;
            }
            hn(e, Ge, Mt);
            break;
          case 4:
            if (Zt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var i = 31 - dt(r);
              o = 1 << i, i = t[i], i > l && (l = i), r &= ~o;
            }
            if (r = l, r = ke() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * af(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Oo(hn.bind(null, e, Ge, Mt), r);
              break;
            }
            hn(e, Ge, Mt);
            break;
          case 5:
            hn(e, Ge, Mt);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return Ke(e, ke()), e.callbackNode === n ? Ma.bind(null, e) : null;
  }
  function Pi(e, t) {
    var n = Nr;
    return e.current.memoizedState.isDehydrated && (mn(e, t).flags |= 256), e = Ol(e, t), e !== 2 && (t = Ge, Ge = n, t !== null && Ti(t)), e;
  }
  function Ti(e) {
    Ge === null ? Ge = e : Ge.push.apply(Ge, e);
  }
  function cf(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], o = l.getSnapshot;
          l = l.value;
          try {
            if (!ft(o(), l)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
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
  function Zt(e, t) {
    for (t &= ~Ci, t &= ~Pl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - dt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Oa(e) {
    if ((q & 6) !== 0) throw Error(s(327));
    Bn();
    var t = Br(e, 0);
    if ((t & 1) === 0) return Ke(e, ke()), null;
    var n = Ol(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = io(e);
      r !== 0 && (t = r, n = Pi(e, r));
    }
    if (n === 1) throw n = zr, mn(e, 0), Zt(e, t), Ke(e, ke()), n;
    if (n === 6) throw Error(s(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, hn(e, Ge, Mt), Ke(e, ke()), null;
  }
  function Ri(e, t) {
    var n = q;
    q |= 1;
    try {
      return e(t);
    } finally {
      q = n, q === 0 && ($n = ke() + 500, ul && Wt());
    }
  }
  function pn(e) {
    Yt !== null && Yt.tag === 0 && (q & 6) === 0 && Bn();
    var t = q;
    q |= 1;
    var n = st.transition, r = le;
    try {
      if (st.transition = null, le = 1, e) return e();
    } finally {
      le = r, st.transition = n, q = t, (q & 6) === 0 && Wt();
    }
  }
  function Li() {
    nt = Vn.current, de(Vn);
  }
  function mn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Ud(n)), Se !== null) for (n = Se.return; n !== null; ) {
      var r = n;
      switch (Vo(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && ol();
          break;
        case 3:
          Fn(), de(We), de(Fe), qo();
          break;
        case 5:
          Zo(r);
          break;
        case 4:
          Fn();
          break;
        case 13:
          de(ve);
          break;
        case 19:
          de(ve);
          break;
        case 10:
          bo(r.type._context);
          break;
        case 22:
        case 23:
          Li();
      }
      n = n.return;
    }
    if (Pe = e, Se = e = Jt(e.current, null), Me = nt = t, _e = 0, zr = null, Ci = Pl = fn = 0, Ge = Nr = null, an !== null) {
      for (t = 0; t < an.length; t++) if (n = an[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, o = n.pending;
        if (o !== null) {
          var i = o.next;
          o.next = l, r.next = i;
        }
        n.pending = r;
      }
      an = null;
    }
    return e;
  }
  function Ia(e, t) {
    do {
      var n = Se;
      try {
        if (Qo(), vl.current = xl, yl) {
          for (var r = ye.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          yl = !1;
        }
        if (dn = 0, Ne = Ce = ye = null, kr = !1, xr = 0, Ei.current = null, n === null || n.return === null) {
          _e = 1, zr = t, Se = null;
          break;
        }
        e: {
          var o = e, i = n.return, a = n, c = t;
          if (t = Me, a.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
            var g = c, x = a, E = x.tag;
            if ((x.mode & 1) === 0 && (E === 0 || E === 11 || E === 15)) {
              var w = x.alternate;
              w ? (x.updateQueue = w.updateQueue, x.memoizedState = w.memoizedState, x.lanes = w.lanes) : (x.updateQueue = null, x.memoizedState = null);
            }
            var P = ia(i);
            if (P !== null) {
              P.flags &= -257, ua(P, i, a, o, t), P.mode & 1 && oa(o, g, t), t = P, c = g;
              var L = t.updateQueue;
              if (L === null) {
                var M = /* @__PURE__ */ new Set();
                M.add(c), t.updateQueue = M;
              } else L.add(c);
              break e;
            } else {
              if ((t & 1) === 0) {
                oa(o, g, t), ji();
                break e;
              }
              c = Error(s(426));
            }
          } else if (he && a.mode & 1) {
            var xe = ia(i);
            if (xe !== null) {
              (xe.flags & 65536) === 0 && (xe.flags |= 256), ua(xe, i, a, o, t), Ho(An(c, a));
              break e;
            }
          }
          o = c = An(c, a), _e !== 4 && (_e = 2), Nr === null ? Nr = [o] : Nr.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var m = ra(o, c, t);
                Rs(o, m);
                break e;
              case 1:
                a = c;
                var d = o.type, h = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof d.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (Kt === null || !Kt.has(h)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var C = la(o, a, t);
                  Rs(o, C);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        Aa(n);
      } catch (I) {
        t = I, Se === n && n !== null && (Se = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Da() {
    var e = Nl.current;
    return Nl.current = xl, e === null ? xl : e;
  }
  function ji() {
    (_e === 0 || _e === 3 || _e === 2) && (_e = 4), Pe === null || (fn & 268435455) === 0 && (Pl & 268435455) === 0 || Zt(Pe, Me);
  }
  function Ol(e, t) {
    var n = q;
    q |= 2;
    var r = Da();
    (Pe !== e || Me !== t) && (Mt = null, mn(e, t));
    do
      try {
        df();
        break;
      } catch (l) {
        Ia(e, l);
      }
    while (!0);
    if (Qo(), q = n, Nl.current = r, Se !== null) throw Error(s(261));
    return Pe = null, Me = 0, _e;
  }
  function df() {
    for (; Se !== null; ) Fa(Se);
  }
  function ff() {
    for (; Se !== null && !Dc(); ) Fa(Se);
  }
  function Fa(e) {
    var t = $a(e.alternate, e, nt);
    e.memoizedProps = e.pendingProps, t === null ? Aa(e) : Se = t, Ei.current = null;
  }
  function Aa(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = rf(n, t, nt), n !== null) {
          Se = n;
          return;
        }
      } else {
        if (n = lf(n, t), n !== null) {
          n.flags &= 32767, Se = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          _e = 6, Se = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Se = t;
        return;
      }
      Se = t = e;
    } while (t !== null);
    _e === 0 && (_e = 5);
  }
  function hn(e, t, n) {
    var r = le, l = st.transition;
    try {
      st.transition = null, le = 1, pf(e, t, n, r);
    } finally {
      st.transition = l, le = r;
    }
    return null;
  }
  function pf(e, t, n, r) {
    do
      Bn();
    while (Yt !== null);
    if ((q & 6) !== 0) throw Error(s(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(s(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (bc(e, o), e === Pe && (Se = Pe = null, Me = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Rl || (Rl = !0, Ba(Ar, function() {
      return Bn(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = st.transition, st.transition = null;
      var i = le;
      le = 1;
      var a = q;
      q |= 4, Ei.current = null, uf(e, n), Pa(n, e), jd(jo), Qr = !!Lo, jo = Lo = null, e.current = n, sf(n), Fc(), q = a, le = i, st.transition = o;
    } else e.current = n;
    if (Rl && (Rl = !1, Yt = e, Ll = l), o = e.pendingLanes, o === 0 && (Kt = null), Vc(n.stateNode), Ke(e, ke()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Tl) throw Tl = !1, e = zi, zi = null, e;
    return (Ll & 1) !== 0 && e.tag !== 0 && Bn(), o = e.pendingLanes, (o & 1) !== 0 ? e === Ni ? Pr++ : (Pr = 0, Ni = e) : Pr = 0, Wt(), null;
  }
  function Bn() {
    if (Yt !== null) {
      var e = zu(Ll), t = st.transition, n = le;
      try {
        if (st.transition = null, le = 16 > e ? 16 : e, Yt === null) var r = !1;
        else {
          if (e = Yt, Yt = null, Ll = 0, (q & 6) !== 0) throw Error(s(331));
          var l = q;
          for (q |= 4, R = e.current; R !== null; ) {
            var o = R, i = o.child;
            if ((R.flags & 16) !== 0) {
              var a = o.deletions;
              if (a !== null) {
                for (var c = 0; c < a.length; c++) {
                  var g = a[c];
                  for (R = g; R !== null; ) {
                    var x = R;
                    switch (x.tag) {
                      case 0:
                      case 11:
                      case 15:
                        _r(8, x, o);
                    }
                    var E = x.child;
                    if (E !== null) E.return = x, R = E;
                    else for (; R !== null; ) {
                      x = R;
                      var w = x.sibling, P = x.return;
                      if (Ea(x), x === g) {
                        R = null;
                        break;
                      }
                      if (w !== null) {
                        w.return = P, R = w;
                        break;
                      }
                      R = P;
                    }
                  }
                }
                var L = o.alternate;
                if (L !== null) {
                  var M = L.child;
                  if (M !== null) {
                    L.child = null;
                    do {
                      var xe = M.sibling;
                      M.sibling = null, M = xe;
                    } while (M !== null);
                  }
                }
                R = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && i !== null) i.return = o, R = i;
            else e: for (; R !== null; ) {
              if (o = R, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  _r(9, o, o.return);
              }
              var m = o.sibling;
              if (m !== null) {
                m.return = o.return, R = m;
                break e;
              }
              R = o.return;
            }
          }
          var d = e.current;
          for (R = d; R !== null; ) {
            i = R;
            var h = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && h !== null) h.return = i, R = h;
            else e: for (i = d; R !== null; ) {
              if (a = R, (a.flags & 2048) !== 0) try {
                switch (a.tag) {
                  case 0:
                  case 11:
                  case 15:
                    zl(9, a);
                }
              } catch (I) {
                we(a, a.return, I);
              }
              if (a === i) {
                R = null;
                break e;
              }
              var C = a.sibling;
              if (C !== null) {
                C.return = a.return, R = C;
                break e;
              }
              R = a.return;
            }
          }
          if (q = l, Wt(), wt && typeof wt.onPostCommitFiberRoot == "function") try {
            wt.onPostCommitFiberRoot(Ur, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        le = n, st.transition = t;
      }
    }
    return !1;
  }
  function Ua(e, t, n) {
    t = An(n, t), t = ra(e, t, 1), e = bt(e, t, 1), t = He(), e !== null && (Jn(e, 1, t), Ke(e, t));
  }
  function we(e, t, n) {
    if (e.tag === 3) Ua(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Ua(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Kt === null || !Kt.has(r))) {
          e = An(n, e), e = la(t, e, 1), t = bt(t, e, 1), e = He(), t !== null && (Jn(t, 1, e), Ke(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function mf(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = He(), e.pingedLanes |= e.suspendedLanes & n, Pe === e && (Me & n) === n && (_e === 4 || _e === 3 && (Me & 130023424) === Me && 500 > ke() - _i ? mn(e, 0) : Ci |= n), Ke(e, t);
  }
  function Va(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = $r, $r <<= 1, ($r & 130023424) === 0 && ($r = 4194304)));
    var n = He();
    e = Rt(e, t), e !== null && (Jn(e, t, n), Ke(e, n));
  }
  function hf(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Va(e, n);
  }
  function gf(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode, l = e.memoizedState;
        l !== null && (n = l.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(s(314));
    }
    r !== null && r.delete(t), Va(e, n);
  }
  var $a;
  $a = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || We.current) be = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return be = !1, nf(e, t, n);
      be = (e.flags & 131072) !== 0;
    }
    else be = !1, he && (t.flags & 1048576) !== 0 && ks(t, al, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Cl(e, t), e = t.pendingProps;
        var l = Rn(t, Fe.current);
        Dn(t, n), l = ni(null, t, r, e, l, n);
        var o = ri();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Qe(r) ? (o = !0, il(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Yo(t), l.updater = Sl, t.stateNode = l, l._reactInternals = t, ai(t, r, e, n), t = pi(null, t, r, !0, o, n)) : (t.tag = 0, he && o && Uo(t), Be(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Cl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = yf(r), e = mt(r, e), l) {
            case 0:
              t = fi(null, t, r, e, n);
              break e;
            case 1:
              t = pa(null, t, r, e, n);
              break e;
            case 11:
              t = sa(null, t, r, e, n);
              break e;
            case 14:
              t = aa(null, t, r, mt(r.type, e), n);
              break e;
          }
          throw Error(s(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : mt(r, l), fi(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : mt(r, l), pa(e, t, r, l, n);
      case 3:
        e: {
          if (ma(t), e === null) throw Error(s(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, Ts(e, t), hl(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = An(Error(s(423)), t), t = ha(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = An(Error(s(424)), t), t = ha(e, t, r, n, l);
            break e;
          } else for (tt = $t(t.stateNode.containerInfo.firstChild), et = t, he = !0, pt = null, n = Ns(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Mn(), r === l) {
              t = jt(e, t, n);
              break e;
            }
            Be(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return js(t), e === null && Bo(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, Mo(r, l) ? i = null : o !== null && Mo(r, o) && (t.flags |= 32), fa(e, t), Be(e, t, i, n), t.child;
      case 6:
        return e === null && Bo(t), null;
      case 13:
        return ga(e, t, n);
      case 4:
        return Xo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = On(t, null, r, n) : Be(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : mt(r, l), sa(e, t, r, l, n);
      case 7:
        return Be(e, t, t.pendingProps, n), t.child;
      case 8:
        return Be(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Be(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, se(fl, r._currentValue), r._currentValue = i, o !== null) if (ft(o.value, i)) {
            if (o.children === l.children && !We.current) {
              t = jt(e, t, n);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var a = o.dependencies;
            if (a !== null) {
              i = o.child;
              for (var c = a.firstContext; c !== null; ) {
                if (c.context === r) {
                  if (o.tag === 1) {
                    c = Lt(-1, n & -n), c.tag = 2;
                    var g = o.updateQueue;
                    if (g !== null) {
                      g = g.shared;
                      var x = g.pending;
                      x === null ? c.next = c : (c.next = x.next, x.next = c), g.pending = c;
                    }
                  }
                  o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Go(
                    o.return,
                    n,
                    t
                  ), a.lanes |= n;
                  break;
                }
                c = c.next;
              }
            } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (i = o.return, i === null) throw Error(s(341));
              i.lanes |= n, a = i.alternate, a !== null && (a.lanes |= n), Go(i, n, t), i = o.sibling;
            } else i = o.child;
            if (i !== null) i.return = o;
            else for (i = o; i !== null; ) {
              if (i === t) {
                i = null;
                break;
              }
              if (o = i.sibling, o !== null) {
                o.return = i.return, i = o;
                break;
              }
              i = i.return;
            }
            o = i;
          }
          Be(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, Dn(t, n), l = it(l), r = r(l), t.flags |= 1, Be(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = mt(r, t.pendingProps), l = mt(r.type, l), aa(e, t, r, l, n);
      case 15:
        return ca(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : mt(r, l), Cl(e, t), t.tag = 1, Qe(r) ? (e = !0, il(t)) : e = !1, Dn(t, n), ta(t, r, l), ai(t, r, l, n), pi(null, t, r, !0, e, n);
      case 19:
        return ya(e, t, n);
      case 22:
        return da(e, t, n);
    }
    throw Error(s(156, t.tag));
  };
  function Ba(e, t) {
    return xu(e, t);
  }
  function vf(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function at(e, t, n, r) {
    return new vf(e, t, n, r);
  }
  function Mi(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function yf(e) {
    if (typeof e == "function") return Mi(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === Z) return 11;
      if (e === Ze) return 14;
    }
    return 2;
  }
  function Jt(e, t) {
    var n = e.alternate;
    return n === null ? (n = at(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Il(e, t, n, r, l, o) {
    var i = 2;
    if (r = e, typeof e == "function") Mi(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case Le:
        return gn(n.children, l, o, t);
      case $e:
        i = 8, l |= 8;
        break;
      case rt:
        return e = at(12, n, t, l | 2), e.elementType = rt, e.lanes = o, e;
      case Ie:
        return e = at(13, n, t, l), e.elementType = Ie, e.lanes = o, e;
      case De:
        return e = at(19, n, t, l), e.elementType = De, e.lanes = o, e;
      case ae:
        return Dl(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Xe:
            i = 10;
            break e;
          case ct:
            i = 9;
            break e;
          case Z:
            i = 11;
            break e;
          case Ze:
            i = 14;
            break e;
          case Ee:
            i = 16, r = null;
            break e;
        }
        throw Error(s(130, e == null ? e : typeof e, ""));
    }
    return t = at(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
  }
  function gn(e, t, n, r) {
    return e = at(7, e, r, t), e.lanes = n, e;
  }
  function Dl(e, t, n, r) {
    return e = at(22, e, r, t), e.elementType = ae, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Oi(e, t, n) {
    return e = at(6, e, null, t), e.lanes = n, e;
  }
  function Ii(e, t, n) {
    return t = at(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function wf(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = uo(0), this.expirationTimes = uo(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = uo(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Di(e, t, n, r, l, o, i, a, c) {
    return e = new wf(e, t, n, a, c), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = at(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Yo(o), e;
  }
  function kf(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ze, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Ha(e) {
    if (!e) return Ht;
    e = e._reactInternals;
    e: {
      if (rn(e) !== e || e.tag !== 1) throw Error(s(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Qe(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(s(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Qe(n)) return vs(e, n, t);
    }
    return t;
  }
  function Wa(e, t, n, r, l, o, i, a, c) {
    return e = Di(n, r, !0, e, l, o, i, a, c), e.context = Ha(null), n = e.current, r = He(), l = Xt(n), o = Lt(r, l), o.callback = t ?? null, bt(n, o, l), e.current.lanes = l, Jn(e, l, r), Ke(e, r), e;
  }
  function Fl(e, t, n, r) {
    var l = t.current, o = He(), i = Xt(l);
    return n = Ha(n), t.context === null ? t.context = n : t.pendingContext = n, t = Lt(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = bt(l, t, i), e !== null && (vt(e, l, i, o), ml(e, l, i)), i;
  }
  function Al(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Qa(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Fi(e, t) {
    Qa(e, t), (e = e.alternate) && Qa(e, t);
  }
  function xf() {
    return null;
  }
  var ba = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Ai(e) {
    this._internalRoot = e;
  }
  Ul.prototype.render = Ai.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    Fl(e, t, null, null);
  }, Ul.prototype.unmount = Ai.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      pn(function() {
        Fl(null, e, null, null);
      }), t[zt] = null;
    }
  };
  function Ul(e) {
    this._internalRoot = e;
  }
  Ul.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Tu();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < At.length && t !== 0 && t < At[n].priority; n++) ;
      At.splice(n, 0, e), n === 0 && ju(e);
    }
  };
  function Ui(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Vl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Ga() {
  }
  function Sf(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var g = Al(i);
          o.call(g);
        };
      }
      var i = Wa(t, r, e, 0, null, !1, !1, "", Ga);
      return e._reactRootContainer = i, e[zt] = i.current, fr(e.nodeType === 8 ? e.parentNode : e), pn(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var a = r;
      r = function() {
        var g = Al(c);
        a.call(g);
      };
    }
    var c = Di(e, 0, !1, null, null, !1, !1, "", Ga);
    return e._reactRootContainer = c, e[zt] = c.current, fr(e.nodeType === 8 ? e.parentNode : e), pn(function() {
      Fl(t, c, n, r);
    }), c;
  }
  function $l(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var a = l;
        l = function() {
          var c = Al(i);
          a.call(c);
        };
      }
      Fl(t, i, e, l);
    } else i = Sf(n, t, e, l, r);
    return Al(i);
  }
  Nu = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Zn(t.pendingLanes);
          n !== 0 && (so(t, n | 1), Ke(t, ke()), (q & 6) === 0 && ($n = ke() + 500, Wt()));
        }
        break;
      case 13:
        pn(function() {
          var r = Rt(e, 1);
          if (r !== null) {
            var l = He();
            vt(r, e, 1, l);
          }
        }), Fi(e, 1);
    }
  }, ao = function(e) {
    if (e.tag === 13) {
      var t = Rt(e, 134217728);
      if (t !== null) {
        var n = He();
        vt(t, e, 134217728, n);
      }
      Fi(e, 134217728);
    }
  }, Pu = function(e) {
    if (e.tag === 13) {
      var t = Xt(e), n = Rt(e, t);
      if (n !== null) {
        var r = He();
        vt(n, e, t, r);
      }
      Fi(e, t);
    }
  }, Tu = function() {
    return le;
  }, Ru = function(e, t) {
    var n = le;
    try {
      return le = e, t();
    } finally {
      le = n;
    }
  }, to = function(e, t, n) {
    switch (t) {
      case "input":
        if (Gl(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = ll(r);
              if (!l) throw Error(s(90));
              eu(r), Gl(r, l);
            }
          }
        }
        break;
      case "textarea":
        ou(e, n);
        break;
      case "select":
        t = n.value, t != null && yn(e, !!n.multiple, t, !1);
    }
  }, mu = Ri, hu = pn;
  var Ef = { usingClientEntryPoint: !1, Events: [hr, Pn, ll, fu, pu, Ri] }, Tr = { findFiberByHostInstance: ln, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Cf = { bundleType: Tr.bundleType, version: Tr.version, rendererPackageName: Tr.rendererPackageName, rendererConfig: Tr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: pe.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = wu(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Tr.findFiberByHostInstance || xf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Bl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Bl.isDisabled && Bl.supportsFiber) try {
      Ur = Bl.inject(Cf), wt = Bl;
    } catch {
    }
  }
  return Ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ef, Ye.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Ui(t)) throw Error(s(200));
    return kf(e, t, null, n);
  }, Ye.createRoot = function(e, t) {
    if (!Ui(e)) throw Error(s(299));
    var n = !1, r = "", l = ba;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Di(e, 1, !1, null, null, n, !1, r, l), e[zt] = t.current, fr(e.nodeType === 8 ? e.parentNode : e), new Ai(t);
  }, Ye.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = wu(t), e = e === null ? null : e.stateNode, e;
  }, Ye.flushSync = function(e) {
    return pn(e);
  }, Ye.hydrate = function(e, t, n) {
    if (!Vl(t)) throw Error(s(200));
    return $l(null, e, t, !0, n);
  }, Ye.hydrateRoot = function(e, t, n) {
    if (!Ui(e)) throw Error(s(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = ba;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = Wa(t, null, e, 1, n ?? null, l, !1, o, i), e[zt] = t.current, fr(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Ul(t);
  }, Ye.render = function(e, t, n) {
    if (!Vl(t)) throw Error(s(200));
    return $l(null, e, t, !1, n);
  }, Ye.unmountComponentAtNode = function(e) {
    if (!Vl(e)) throw Error(s(40));
    return e._reactRootContainer ? (pn(function() {
      $l(null, null, e, !1, function() {
        e._reactRootContainer = null, e[zt] = null;
      });
    }), !0) : !1;
  }, Ye.unstable_batchedUpdates = Ri, Ye.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Vl(n)) throw Error(s(200));
    if (e == null || e._reactInternals === void 0) throw Error(s(38));
    return $l(e, t, n, !1, r);
  }, Ye.version = "18.3.1-next-f1338f8080-20240426", Ye;
}
var tc;
function Df() {
  if (tc) return Bi.exports;
  tc = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (p) {
        console.error(p);
      }
  }
  return u(), Bi.exports = If(), Bi.exports;
}
var nc;
function Ff() {
  if (nc) return Hl;
  nc = 1;
  var u = Df();
  return Hl.createRoot = u.createRoot, Hl.hydrateRoot = u.hydrateRoot, Hl;
}
var Af = Ff();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Uf = (u) => u.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), sc = (...u) => u.filter((p, s, v) => !!p && p.trim() !== "" && v.indexOf(p) === s).join(" ").trim();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Vf = {
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
const $f = oe.forwardRef(
  ({
    color: u = "currentColor",
    size: p = 24,
    strokeWidth: s = 2,
    absoluteStrokeWidth: v,
    className: y = "",
    children: S,
    iconNode: z,
    ..._
  }, O) => oe.createElement(
    "svg",
    {
      ref: O,
      ...Vf,
      width: p,
      height: p,
      stroke: u,
      strokeWidth: v ? Number(s) * 24 / Number(p) : s,
      className: sc("lucide", y),
      ..._
    },
    [
      ...z.map(([B, Q]) => oe.createElement(B, Q)),
      ...Array.isArray(S) ? S : [S]
    ]
  )
);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zi = (u, p) => {
  const s = oe.forwardRef(
    ({ className: v, ...y }, S) => oe.createElement($f, {
      ref: S,
      iconNode: p,
      className: sc(`lucide-${Uf(u)}`, v),
      ...y
    })
  );
  return s.displayName = `${u}`, s;
};
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bf = Zi("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hf = Zi("ArrowUpDown", [
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
const Wf = Zi("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
var Qf = Object.defineProperty, Ji = (u, p) => Qf(u, "name", { value: p, configurable: !0 });
function bi(u, p) {
  if (typeof u == "function")
    return u(p);
  u != null && (u.current = p);
}
Ji(bi, "setRef");
function ac(...u) {
  return (p) => {
    let s = !1;
    const v = u.map((y) => {
      const S = bi(y, p);
      return !s && typeof S == "function" && (s = !0), S;
    });
    if (s)
      return () => {
        for (let y = 0; y < v.length; y++) {
          const S = v[y];
          typeof S == "function" ? S() : bi(u[y], null);
        }
      };
  };
}
Ji(ac, "composeRefs");
function cc(...u) {
  return oe.useCallback(ac(...u), u);
}
Ji(cc, "useComposedRefs");
var bf = Object.defineProperty, yt = (u, p) => bf(u, "name", { value: p, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function dc(u) {
  const p = oe.forwardRef((s, v) => {
    let { children: y, ...S } = s, z = null, _ = !1;
    const O = [];
    Gi(y) && typeof Wl == "function" && (y = Wl(y._payload)), oe.Children.forEach(y, (D) => {
      var J;
      if (hc(D)) {
        _ = !0;
        const U = D;
        let j = "child" in U.props ? U.props.child : U.props.children;
        Gi(j) && typeof Wl == "function" && (j = Wl(j._payload)), z = Yf(U, j), O.push((J = z == null ? void 0 : z.props) == null ? void 0 : J.children);
      } else
        O.push(D);
    }), z ? z = oe.cloneElement(z, void 0, O) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !_ && oe.Children.count(y) === 1 && oe.isValidElement(y) && (z = y)
    );
    const B = z ? mc(z) : void 0, Q = cc(v, B);
    if (!z) {
      if (y || y === 0)
        throw new Error(
          _ ? Jf(u) : Zf(u)
        );
      return y;
    }
    const W = pc(S, z.props ?? {});
    return z.type !== oe.Fragment && (W.ref = v ? Q : B), oe.cloneElement(z, W);
  });
  return p.displayName = `${u}.Slot`, p;
}
yt(dc, "createSlot");
var Gf = /* @__PURE__ */ dc("Slot"), fc = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Kf(u) {
  const p = /* @__PURE__ */ yt((s) => "child" in s ? s.children(s.child) : s.children, "Slottable");
  return p.displayName = `${u}.Slottable`, p.__radixId = fc, p;
}
yt(Kf, "createSlottable");
var Yf = /* @__PURE__ */ yt((u, p) => {
  if ("child" in u.props) {
    const s = u.props.child;
    return oe.isValidElement(s) ? oe.cloneElement(s, void 0, u.props.children(s.props.children)) : null;
  }
  return oe.isValidElement(p) ? p : null;
}, "getSlottableElementFromSlottable");
function pc(u, p) {
  const s = { ...p };
  for (const v in p) {
    const y = u[v], S = p[v];
    /^on[A-Z]/.test(v) ? y && S ? s[v] = (..._) => {
      const O = S(..._);
      return y(..._), O;
    } : y && (s[v] = y) : v === "style" ? s[v] = { ...y, ...S } : v === "className" && (s[v] = [y, S].filter(Boolean).join(" "));
  }
  return { ...u, ...s };
}
yt(pc, "mergeProps");
function mc(u) {
  var v, y;
  let p = (v = Object.getOwnPropertyDescriptor(u.props, "ref")) == null ? void 0 : v.get, s = p && "isReactWarning" in p && p.isReactWarning;
  return s ? u.ref : (p = (y = Object.getOwnPropertyDescriptor(u, "ref")) == null ? void 0 : y.get, s = p && "isReactWarning" in p && p.isReactWarning, s ? u.props.ref : u.props.ref || u.ref);
}
yt(mc, "getElementRef");
function hc(u) {
  return oe.isValidElement(u) && typeof u.type == "function" && "__radixId" in u.type && u.type.__radixId === fc;
}
yt(hc, "isSlottable");
var Xf = Symbol.for("react.lazy");
function Gi(u) {
  return u != null && typeof u == "object" && "$$typeof" in u && u.$$typeof === Xf && "_payload" in u && gc(u._payload);
}
yt(Gi, "isLazyComponent");
function gc(u) {
  return typeof u == "object" && u !== null && "then" in u;
}
yt(gc, "isPromiseLike");
var Zf = /* @__PURE__ */ yt((u) => `${u} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Jf = /* @__PURE__ */ yt((u) => `${u} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Wl = jf[" use ".trim().toString()];
function vc(u) {
  var p, s, v = "";
  if (typeof u == "string" || typeof u == "number") v += u;
  else if (typeof u == "object") if (Array.isArray(u)) {
    var y = u.length;
    for (p = 0; p < y; p++) u[p] && (s = vc(u[p])) && (v && (v += " "), v += s);
  } else for (s in u) u[s] && (v && (v += " "), v += s);
  return v;
}
function yc() {
  for (var u, p, s = 0, v = "", y = arguments.length; s < y; s++) (u = arguments[s]) && (p = vc(u)) && (v && (v += " "), v += p);
  return v;
}
const rc = (u) => typeof u == "boolean" ? `${u}` : u === 0 ? "0" : u, lc = yc, qf = (u, p) => (s) => {
  var v;
  if ((p == null ? void 0 : p.variants) == null) return lc(u, s == null ? void 0 : s.class, s == null ? void 0 : s.className);
  const { variants: y, defaultVariants: S } = p, z = Object.keys(y).map((B) => {
    const Q = s == null ? void 0 : s[B], W = S == null ? void 0 : S[B];
    if (Q === null) return null;
    const D = rc(Q) || rc(W);
    return y[B][D];
  }), _ = s && Object.entries(s).reduce((B, Q) => {
    let [W, D] = Q;
    return D === void 0 || (B[W] = D), B;
  }, {}), O = p == null || (v = p.compoundVariants) === null || v === void 0 ? void 0 : v.reduce((B, Q) => {
    let { class: W, className: D, ...J } = Q;
    return Object.entries(J).every((U) => {
      let [j, F] = U;
      return Array.isArray(F) ? F.includes({
        ...S,
        ..._
      }[j]) : {
        ...S,
        ..._
      }[j] === F;
    }) ? [
      ...B,
      W,
      D
    ] : B;
  }, []);
  return lc(u, z, O, s == null ? void 0 : s.class, s == null ? void 0 : s.className);
}, qi = "-", ep = (u) => {
  const p = np(u), {
    conflictingClassGroups: s,
    conflictingClassGroupModifiers: v
  } = u;
  return {
    getClassGroupId: (z) => {
      const _ = z.split(qi);
      return _[0] === "" && _.length !== 1 && _.shift(), wc(_, p) || tp(z);
    },
    getConflictingClassGroupIds: (z, _) => {
      const O = s[z] || [];
      return _ && v[z] ? [...O, ...v[z]] : O;
    }
  };
}, wc = (u, p) => {
  var z;
  if (u.length === 0)
    return p.classGroupId;
  const s = u[0], v = p.nextPart.get(s), y = v ? wc(u.slice(1), v) : void 0;
  if (y)
    return y;
  if (p.validators.length === 0)
    return;
  const S = u.join(qi);
  return (z = p.validators.find(({
    validator: _
  }) => _(S))) == null ? void 0 : z.classGroupId;
}, oc = /^\[(.+)\]$/, tp = (u) => {
  if (oc.test(u)) {
    const p = oc.exec(u)[1], s = p == null ? void 0 : p.substring(0, p.indexOf(":"));
    if (s)
      return "arbitrary.." + s;
  }
}, np = (u) => {
  const {
    theme: p,
    prefix: s
  } = u, v = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return lp(Object.entries(u.classGroups), s).forEach(([S, z]) => {
    Ki(z, v, S, p);
  }), v;
}, Ki = (u, p, s, v) => {
  u.forEach((y) => {
    if (typeof y == "string") {
      const S = y === "" ? p : ic(p, y);
      S.classGroupId = s;
      return;
    }
    if (typeof y == "function") {
      if (rp(y)) {
        Ki(y(v), p, s, v);
        return;
      }
      p.validators.push({
        validator: y,
        classGroupId: s
      });
      return;
    }
    Object.entries(y).forEach(([S, z]) => {
      Ki(z, ic(p, S), s, v);
    });
  });
}, ic = (u, p) => {
  let s = u;
  return p.split(qi).forEach((v) => {
    s.nextPart.has(v) || s.nextPart.set(v, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), s = s.nextPart.get(v);
  }), s;
}, rp = (u) => u.isThemeGetter, lp = (u, p) => p ? u.map(([s, v]) => {
  const y = v.map((S) => typeof S == "string" ? p + S : typeof S == "object" ? Object.fromEntries(Object.entries(S).map(([z, _]) => [p + z, _])) : S);
  return [s, y];
}) : u, op = (u) => {
  if (u < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let p = 0, s = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
  const y = (S, z) => {
    s.set(S, z), p++, p > u && (p = 0, v = s, s = /* @__PURE__ */ new Map());
  };
  return {
    get(S) {
      let z = s.get(S);
      if (z !== void 0)
        return z;
      if ((z = v.get(S)) !== void 0)
        return y(S, z), z;
    },
    set(S, z) {
      s.has(S) ? s.set(S, z) : y(S, z);
    }
  };
}, kc = "!", ip = (u) => {
  const {
    separator: p,
    experimentalParseClassName: s
  } = u, v = p.length === 1, y = p[0], S = p.length, z = (_) => {
    const O = [];
    let B = 0, Q = 0, W;
    for (let F = 0; F < _.length; F++) {
      let ie = _[F];
      if (B === 0) {
        if (ie === y && (v || _.slice(F, F + S) === p)) {
          O.push(_.slice(Q, F)), Q = F + S;
          continue;
        }
        if (ie === "/") {
          W = F;
          continue;
        }
      }
      ie === "[" ? B++ : ie === "]" && B--;
    }
    const D = O.length === 0 ? _ : _.substring(Q), J = D.startsWith(kc), U = J ? D.substring(1) : D, j = W && W > Q ? W - Q : void 0;
    return {
      modifiers: O,
      hasImportantModifier: J,
      baseClassName: U,
      maybePostfixModifierPosition: j
    };
  };
  return s ? (_) => s({
    className: _,
    parseClassName: z
  }) : z;
}, up = (u) => {
  if (u.length <= 1)
    return u;
  const p = [];
  let s = [];
  return u.forEach((v) => {
    v[0] === "[" ? (p.push(...s.sort(), v), s = []) : s.push(v);
  }), p.push(...s.sort()), p;
}, sp = (u) => ({
  cache: op(u.cacheSize),
  parseClassName: ip(u),
  ...ep(u)
}), ap = /\s+/, cp = (u, p) => {
  const {
    parseClassName: s,
    getClassGroupId: v,
    getConflictingClassGroupIds: y
  } = p, S = [], z = u.trim().split(ap);
  let _ = "";
  for (let O = z.length - 1; O >= 0; O -= 1) {
    const B = z[O], {
      modifiers: Q,
      hasImportantModifier: W,
      baseClassName: D,
      maybePostfixModifierPosition: J
    } = s(B);
    let U = !!J, j = v(U ? D.substring(0, J) : D);
    if (!j) {
      if (!U) {
        _ = B + (_.length > 0 ? " " + _ : _);
        continue;
      }
      if (j = v(D), !j) {
        _ = B + (_.length > 0 ? " " + _ : _);
        continue;
      }
      U = !1;
    }
    const F = up(Q).join(":"), ie = W ? F + kc : F, ge = ie + j;
    if (S.includes(ge))
      continue;
    S.push(ge);
    const Re = y(j, U);
    for (let pe = 0; pe < Re.length; ++pe) {
      const Oe = Re[pe];
      S.push(ie + Oe);
    }
    _ = B + (_.length > 0 ? " " + _ : _);
  }
  return _;
};
function dp() {
  let u = 0, p, s, v = "";
  for (; u < arguments.length; )
    (p = arguments[u++]) && (s = xc(p)) && (v && (v += " "), v += s);
  return v;
}
const xc = (u) => {
  if (typeof u == "string")
    return u;
  let p, s = "";
  for (let v = 0; v < u.length; v++)
    u[v] && (p = xc(u[v])) && (s && (s += " "), s += p);
  return s;
};
function fp(u, ...p) {
  let s, v, y, S = z;
  function z(O) {
    const B = p.reduce((Q, W) => W(Q), u());
    return s = sp(B), v = s.cache.get, y = s.cache.set, S = _, _(O);
  }
  function _(O) {
    const B = v(O);
    if (B)
      return B;
    const Q = cp(O, s);
    return y(O, Q), Q;
  }
  return function() {
    return S(dp.apply(null, arguments));
  };
}
const fe = (u) => {
  const p = (s) => s[u] || [];
  return p.isThemeGetter = !0, p;
}, Sc = /^\[(?:([a-z-]+):)?(.+)\]$/i, pp = /^\d+\/\d+$/, mp = /* @__PURE__ */ new Set(["px", "full", "screen"]), hp = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, gp = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, vp = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, yp = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, wp = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ot = (u) => Hn(u) || mp.has(u) || pp.test(u), en = (u) => Wn(u, "length", Np), Hn = (u) => !!u && !Number.isNaN(Number(u)), Qi = (u) => Wn(u, "number", Hn), Lr = (u) => !!u && Number.isInteger(Number(u)), kp = (u) => u.endsWith("%") && Hn(u.slice(0, -1)), G = (u) => Sc.test(u), tn = (u) => hp.test(u), xp = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Sp = (u) => Wn(u, xp, Ec), Ep = (u) => Wn(u, "position", Ec), Cp = /* @__PURE__ */ new Set(["image", "url"]), _p = (u) => Wn(u, Cp, Tp), zp = (u) => Wn(u, "", Pp), jr = () => !0, Wn = (u, p, s) => {
  const v = Sc.exec(u);
  return v ? v[1] ? typeof p == "string" ? v[1] === p : p.has(v[1]) : s(v[2]) : !1;
}, Np = (u) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  gp.test(u) && !vp.test(u)
), Ec = () => !1, Pp = (u) => yp.test(u), Tp = (u) => wp.test(u), Rp = () => {
  const u = fe("colors"), p = fe("spacing"), s = fe("blur"), v = fe("brightness"), y = fe("borderColor"), S = fe("borderRadius"), z = fe("borderSpacing"), _ = fe("borderWidth"), O = fe("contrast"), B = fe("grayscale"), Q = fe("hueRotate"), W = fe("invert"), D = fe("gap"), J = fe("gradientColorStops"), U = fe("gradientColorStopPositions"), j = fe("inset"), F = fe("margin"), ie = fe("opacity"), ge = fe("padding"), Re = fe("saturate"), pe = fe("scale"), Oe = fe("sepia"), ze = fe("skew"), Le = fe("space"), $e = fe("translate"), rt = () => ["auto", "contain", "none"], Xe = () => ["auto", "hidden", "clip", "visible", "scroll"], ct = () => ["auto", G, p], Z = () => [G, p], Ie = () => ["", Ot, en], De = () => ["auto", Hn, G], Ze = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Ee = () => ["solid", "dashed", "dotted", "double", "none"], ae = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], N = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], A = () => ["", "0", G], T = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], f = () => [Hn, G];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [jr],
      spacing: [Ot, en],
      blur: ["none", "", tn, G],
      brightness: f(),
      borderColor: [u],
      borderRadius: ["none", "", "full", tn, G],
      borderSpacing: Z(),
      borderWidth: Ie(),
      contrast: f(),
      grayscale: A(),
      hueRotate: f(),
      invert: A(),
      gap: Z(),
      gradientColorStops: [u],
      gradientColorStopPositions: [kp, en],
      inset: ct(),
      margin: ct(),
      opacity: f(),
      padding: Z(),
      saturate: f(),
      scale: f(),
      sepia: A(),
      skew: f(),
      space: Z(),
      translate: Z()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", G]
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
        columns: [tn]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": T()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": T()
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
        object: [...Ze(), G]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: Xe()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": Xe()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": Xe()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: rt()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": rt()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": rt()
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
        inset: [j]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [j]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [j]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [j]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [j]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [j]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [j]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [j]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [j]
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
        z: ["auto", Lr, G]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: ct()
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
        flex: ["1", "auto", "initial", "none", G]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: A()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: A()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", Lr, G]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [jr]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Lr, G]
        }, G]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": De()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": De()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [jr]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Lr, G]
        }, G]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": De()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": De()
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
        "auto-cols": ["auto", "min", "max", "fr", G]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", G]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [D]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [D]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [D]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...N()]
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
        content: ["normal", ...N(), "baseline"]
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
        "place-content": [...N(), "baseline"]
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
        p: [ge]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [ge]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [ge]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [ge]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [ge]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [ge]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [ge]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [ge]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [ge]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [F]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [F]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [F]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [F]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [F]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [F]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [F]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [F]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [F]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [Le]
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
        "space-y": [Le]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", G, p]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [G, p, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [G, p, "none", "full", "min", "max", "fit", "prose", {
          screen: [tn]
        }, tn]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [G, p, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [G, p, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [G, p, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [G, p, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", tn, en]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Qi]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [jr]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", G]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", Hn, Qi]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Ot, G]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", G]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", G]
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
        placeholder: [u]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [ie]
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
        text: [u]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [ie]
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
        decoration: [...Ee(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Ot, en]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Ot, G]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [u]
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
        indent: Z()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", G]
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
        content: ["none", G]
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
        "bg-opacity": [ie]
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
        bg: [...Ze(), Ep]
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
        bg: ["auto", "cover", "contain", Sp]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, _p]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [u]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [U]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [U]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [U]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [J]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [J]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [J]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [S]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [S]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [S]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [S]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [S]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [S]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [S]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [S]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [S]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [S]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [S]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [S]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [S]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [S]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [S]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [_]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [_]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [_]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [_]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [_]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [_]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [_]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [_]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [_]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [ie]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...Ee(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [_]
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
        "divide-y": [_]
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
        "divide-opacity": [ie]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: Ee()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [y]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [y]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [y]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [y]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [y]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [y]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [y]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [y]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [y]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [y]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...Ee()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Ot, G]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Ot, en]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [u]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: Ie()
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
        ring: [u]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [ie]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Ot, en]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [u]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", tn, zp]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [jr]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [ie]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...ae(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": ae()
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
        blur: [s]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [v]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [O]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", tn, G]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [B]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [Q]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [W]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [Re]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [Oe]
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
        "backdrop-blur": [s]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [v]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [O]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [B]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [Q]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [W]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [ie]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [Re]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [Oe]
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
        "border-spacing": [z]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [z]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [z]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", G]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: f()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", G]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: f()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", G]
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
        scale: [pe]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [pe]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [pe]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [Lr, G]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [$e]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [$e]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [ze]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [ze]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", G]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", u]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", G]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [u]
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
        "scroll-m": Z()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": Z()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": Z()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": Z()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": Z()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": Z()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": Z()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": Z()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": Z()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": Z()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": Z()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": Z()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": Z()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": Z()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": Z()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": Z()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": Z()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": Z()
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
        "will-change": ["auto", "scroll", "contents", "transform", G]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [u, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [Ot, en, Qi]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [u, "none"]
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
}, Lp = /* @__PURE__ */ fp(Rp);
function vn(...u) {
  return Lp(yc(u));
}
const jp = qf(
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
), Cc = oe.forwardRef(
  ({ className: u, variant: p, size: s, asChild: v = !1, ...y }, S) => {
    const z = v ? Gf : "button";
    return /* @__PURE__ */ b.jsx(z, { className: vn(jp({ variant: p, size: s, className: u })), ref: S, ...y });
  }
);
Cc.displayName = "Button";
const _c = oe.forwardRef(
  ({ className: u, ...p }, s) => /* @__PURE__ */ b.jsx("div", { className: "dt-relative dt-w-full dt-overflow-auto", children: /* @__PURE__ */ b.jsx("table", { ref: s, className: vn("dt-w-full dt-caption-bottom dt-text-sm", u), ...p }) })
);
_c.displayName = "Table";
const zc = oe.forwardRef(({ className: u, ...p }, s) => /* @__PURE__ */ b.jsx("thead", { ref: s, className: vn("[&_tr]:dt-border-b", u), ...p }));
zc.displayName = "TableHeader";
const Nc = oe.forwardRef(({ className: u, ...p }, s) => /* @__PURE__ */ b.jsx("tbody", { ref: s, className: vn("[&_tr:last-child]:dt-border-0", u), ...p }));
Nc.displayName = "TableBody";
const Yi = oe.forwardRef(
  ({ className: u, ...p }, s) => /* @__PURE__ */ b.jsx(
    "tr",
    {
      ref: s,
      className: vn(
        "dt-border-b dt-transition-colors hover:dt-bg-muted/50 data-[state=selected]:dt-bg-muted",
        u
      ),
      ...p
    }
  )
);
Yi.displayName = "TableRow";
const Ct = oe.forwardRef(({ className: u, ...p }, s) => /* @__PURE__ */ b.jsx(
  "th",
  {
    ref: s,
    className: vn(
      "dt-h-12 dt-px-4 dt-text-left dt-align-middle dt-font-medium dt-text-muted-foreground [&:has([role=checkbox])]:dt-pr-0",
      u
    ),
    ...p
  }
));
Ct.displayName = "TableHead";
const _t = oe.forwardRef(({ className: u, ...p }, s) => /* @__PURE__ */ b.jsx(
  "td",
  {
    ref: s,
    className: vn("dt-p-4 dt-align-middle [&:has([role=checkbox])]:dt-pr-0", u),
    ...p
  }
));
_t.displayName = "TableCell";
function uc(u) {
  return u ? u.split(" | ").map((p) => p.replace("/", "-")) : ["·"];
}
function Mp({
  label: u,
  active: p,
  dir: s,
  onClick: v
}) {
  const y = p ? s === 1 ? Wf : Bf : Hf;
  return /* @__PURE__ */ b.jsxs(Cc, { variant: "ghost", size: "sm", onClick: v, className: "dt--ml-3", children: [
    u,
    /* @__PURE__ */ b.jsx(y, { className: `dt-ml-1.5 dt-inline dt-size-3.5${p ? "" : " dt-opacity-40"}` })
  ] });
}
function Pc(u) {
  const { rows: p, sortKey: s, sortDir: v, onSortChange: y, onRowClick: S, onToggleSelect: z, onToggleFavorite: _, allSelected: O, onSelectAll: B, emptyMessage: Q, ariaLabel: W, labels: D } = u;
  if (!p.length)
    return /* @__PURE__ */ b.jsx("p", { className: "dt-p-6 dt-text-center dt-text-sm dt-text-muted-foreground", children: Q });
  const J = (U, j) => /* @__PURE__ */ b.jsx(Mp, { label: j, active: s === U, dir: v, onClick: () => y(U) });
  return /* @__PURE__ */ b.jsx("div", { className: "dersler-table-root dt-overflow-hidden dt-rounded-lg dt-border dt-border-border", children: /* @__PURE__ */ b.jsxs(_c, { "aria-label": W, children: [
    /* @__PURE__ */ b.jsx(zc, { children: /* @__PURE__ */ b.jsxs(Yi, { children: [
      /* @__PURE__ */ b.jsx(Ct, { className: "dt-h-9 dt-w-8 dt-p-2", children: /* @__PURE__ */ b.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: O,
          "aria-label": D.selectAll,
          onChange: (U) => B(U.target.checked)
        }
      ) }),
      /* @__PURE__ */ b.jsx(Ct, { className: "dt-h-9 dt-w-8 dt-p-2" }),
      /* @__PURE__ */ b.jsx(Ct, { className: "dt-h-9 dt-p-2", children: J("crn", D.crn) }),
      /* @__PURE__ */ b.jsx(Ct, { className: "dt-h-9 dt-p-2", children: J("code", D.code) }),
      /* @__PURE__ */ b.jsx(Ct, { className: "dt-h-9 dt-p-2", children: J("name", D.name) }),
      /* @__PURE__ */ b.jsx(Ct, { className: "dt-h-9 dt-p-2", children: J("instructor", D.instructor) }),
      /* @__PURE__ */ b.jsx(Ct, { className: "dt-h-9 dt-p-2", children: J("when", D.when) }),
      /* @__PURE__ */ b.jsx(Ct, { className: "dt-h-9 dt-p-2", children: D.where }),
      /* @__PURE__ */ b.jsx(Ct, { className: "dt-h-9 dt-p-2 dt-text-right", children: J("fill", D.fill) })
    ] }) }),
    /* @__PURE__ */ b.jsx(Nc, { children: p.map((U) => /* @__PURE__ */ b.jsxs(Yi, { className: "dt-cursor-pointer", onClick: () => S(U.key), children: [
      /* @__PURE__ */ b.jsx(_t, { className: "dt-p-2", onClick: (j) => j.stopPropagation(), children: /* @__PURE__ */ b.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: U.selected,
          "aria-label": D.selectSection,
          onChange: (j) => z(U.key, j.target.checked)
        }
      ) }),
      /* @__PURE__ */ b.jsx(_t, { className: "dt-p-2", onClick: (j) => j.stopPropagation(), children: /* @__PURE__ */ b.jsx(
        "button",
        {
          type: "button",
          className: "dt-text-base dt-leading-none",
          "aria-label": U.favorite ? D.removeFav : D.addFav,
          "aria-pressed": U.favorite,
          onClick: () => _(U.key),
          children: U.favorite ? "★" : "☆"
        }
      ) }),
      /* @__PURE__ */ b.jsx(_t, { className: "dt-p-2 dt-font-mono dt-text-muted-foreground", dangerouslySetInnerHTML: { __html: U.crnHTML } }),
      /* @__PURE__ */ b.jsx(_t, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: U.codeHTML } }),
      /* @__PURE__ */ b.jsx(_t, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: U.nameHTML } }),
      /* @__PURE__ */ b.jsx(_t, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: U.instructorHTML } }),
      /* @__PURE__ */ b.jsx(_t, { className: "dt-p-2 dt-font-mono dt-text-xs", children: uc(U.when).map((j, F) => /* @__PURE__ */ b.jsx("div", { children: j }, F)) }),
      /* @__PURE__ */ b.jsx(_t, { className: "dt-p-2 dt-text-xs dt-text-muted-foreground", children: U.where ? uc(U.where).map((j, F) => /* @__PURE__ */ b.jsx("div", { children: j }, F)) : "·" }),
      /* @__PURE__ */ b.jsx(_t, { className: "dt-p-2 dt-text-right dt-tabular-nums", dangerouslySetInnerHTML: { __html: U.quotaHTML } })
    ] }, U.key)) })
  ] }) });
}
const Op = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--sans);font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--mono);font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.dersler-table-root .dt-relative{position:relative}.dersler-table-root .dt--ml-3{margin-left:-.75rem}.dersler-table-root .dt-ml-1\\.5{margin-left:.375rem}.dersler-table-root .dt-inline{display:inline}.dersler-table-root .dt-inline-flex{display:inline-flex}.dersler-table-root .dt-size-3\\.5{width:.875rem;height:.875rem}.dersler-table-root .dt-size-4{width:1rem;height:1rem}.dersler-table-root .dt-h-10{height:2.5rem}.dersler-table-root .dt-h-12{height:3rem}.dersler-table-root .dt-h-9{height:2.25rem}.dersler-table-root .dt-w-8{width:2rem}.dersler-table-root .dt-w-full{width:100%}.dersler-table-root .dt-caption-bottom{caption-side:bottom}.dersler-table-root .dt-cursor-pointer{cursor:pointer}.dersler-table-root .dt-items-center{align-items:center}.dersler-table-root .dt-justify-center{justify-content:center}.dersler-table-root .dt-overflow-auto{overflow:auto}.dersler-table-root .dt-overflow-hidden{overflow:hidden}.dersler-table-root .dt-whitespace-nowrap{white-space:nowrap}.dersler-table-root .dt-rounded-lg{border-radius:var(--radius-card)}.dersler-table-root .dt-rounded-md{border-radius:calc(var(--radius-card) - 2px)}.dersler-table-root .dt-border{border-width:1px}.dersler-table-root .dt-border-b{border-bottom-width:1px}.dersler-table-root .dt-border-border{border-color:var(--hairline)}.dersler-table-root .dt-bg-primary{background-color:var(--acid)}.dersler-table-root .dt-p-2{padding:.5rem}.dersler-table-root .dt-p-4{padding:1rem}.dersler-table-root .dt-p-6{padding:1.5rem}.dersler-table-root .dt-px-3{padding-left:.75rem;padding-right:.75rem}.dersler-table-root .dt-px-4{padding-left:1rem;padding-right:1rem}.dersler-table-root .dt-py-2{padding-top:.5rem;padding-bottom:.5rem}.dersler-table-root .dt-text-left{text-align:left}.dersler-table-root .dt-text-center{text-align:center}.dersler-table-root .dt-text-right{text-align:right}.dersler-table-root .dt-align-middle{vertical-align:middle}.dersler-table-root .dt-font-mono{font-family:var(--mono)}.dersler-table-root .dt-text-base{font-size:1rem;line-height:1.5rem}.dersler-table-root .dt-text-sm{font-size:.875rem;line-height:1.25rem}.dersler-table-root .dt-text-xs{font-size:.75rem;line-height:1rem}.dersler-table-root .dt-font-medium{font-weight:500}.dersler-table-root .dt-tabular-nums{--tw-numeric-spacing: tabular-nums;font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)}.dersler-table-root .dt-leading-none{line-height:1}.dersler-table-root .dt-text-muted-foreground{color:var(--dim)}.dersler-table-root .dt-text-primary-foreground{color:var(--on-accent)}.dersler-table-root .dt-opacity-40{opacity:.4}.dersler-table-root .dt-transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dersler-table-root{font-family:var(--sans);color:var(--fg)}.dersler-table-root .hover\\:dt-bg-accent:hover{background-color:var(--panel-2)}.dersler-table-root .hover\\:dt-text-accent-foreground:hover{color:var(--acid)}.dersler-table-root .focus-visible\\:dt-outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.dersler-table-root .focus-visible\\:dt-ring-2:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.dersler-table-root .focus-visible\\:dt-ring-ring:focus-visible{--tw-ring-color: var(--cyan)}.dersler-table-root .focus-visible\\:dt-ring-offset-2:focus-visible{--tw-ring-offset-width: 2px}.dersler-table-root .disabled\\:dt-pointer-events-none:disabled{pointer-events:none}.dersler-table-root .disabled\\:dt-opacity-50:disabled{opacity:.5}.dersler-table-root .data-\\[state\\=selected\\]\\:dt-bg-muted[data-state=selected]{background-color:var(--panel-2)}.dersler-table-root .\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:dt-pr-0:has([role=checkbox]){padding-right:0}.dersler-table-root :is(.\\[\\&_tr\\:last-child\\]\\:dt-border-0 tr:last-child){border-width:0px}.dersler-table-root :is(.\\[\\&_tr\\]\\:dt-border-b tr){border-bottom-width:1px}';
let nn = null, Ql = null;
function Ip() {
  Ql || (Ql = document.createElement("style"), Ql.textContent = Op, document.head.appendChild(Ql));
}
function Dp(u, p) {
  Ip(), nn = Af.createRoot(u), nn.render(
    /* @__PURE__ */ b.jsx(oe.StrictMode, { children: /* @__PURE__ */ b.jsx(Pc, { ...p }) })
  );
}
function Fp(u) {
  nn && nn.render(
    /* @__PURE__ */ b.jsx(oe.StrictMode, { children: /* @__PURE__ */ b.jsx(Pc, { ...u }) })
  );
}
function Ap() {
  nn == null || nn.unmount(), nn = null;
}
export {
  Dp as mount,
  Ap as unmount,
  Fp as update
};
