function Df(s, f) {
  for (var a = 0; a < f.length; a++) {
    const v = f[a];
    if (typeof v != "string" && !Array.isArray(v)) {
      for (const k in v)
        if (k !== "default" && !(k in s)) {
          const x = Object.getOwnPropertyDescriptor(v, k);
          x && Object.defineProperty(s, k, x.get ? x : {
            enumerable: !0,
            get: () => v[k]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(s, Symbol.toStringTag, { value: "Module" }));
}
function Ff(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var Hi = { exports: {} }, Lr = {}, Bi = { exports: {} }, Z = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Zu;
function Af() {
  if (Zu) return Z;
  Zu = 1;
  var s = Symbol.for("react.element"), f = Symbol.for("react.portal"), a = Symbol.for("react.fragment"), v = Symbol.for("react.strict_mode"), k = Symbol.for("react.profiler"), x = Symbol.for("react.provider"), w = Symbol.for("react.context"), N = Symbol.for("react.forward_ref"), L = Symbol.for("react.suspense"), V = Symbol.for("react.memo"), W = Symbol.for("react.lazy"), B = Symbol.iterator;
  function D(p) {
    return p === null || typeof p != "object" ? null : (p = B && p[B] || p["@@iterator"], typeof p == "function" ? p : null);
  }
  var X = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, U = Object.assign, b = {};
  function z(p, C, Y) {
    this.props = p, this.context = C, this.refs = b, this.updater = Y || X;
  }
  z.prototype.isReactComponent = {}, z.prototype.setState = function(p, C) {
    if (typeof p != "object" && typeof p != "function" && p != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, p, C, "setState");
  }, z.prototype.forceUpdate = function(p) {
    this.updater.enqueueForceUpdate(this, p, "forceUpdate");
  };
  function J() {
  }
  J.prototype = z.prototype;
  function ie(p, C, Y) {
    this.props = p, this.context = C, this.refs = b, this.updater = Y || X;
  }
  var K = ie.prototype = new J();
  K.constructor = ie, U(K, z.prototype), K.isPureReactComponent = !0;
  var ue = Array.isArray, Ne = Object.prototype.hasOwnProperty, ke = { current: null }, Ee = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Le(p, C, Y) {
    var q, re = {}, le = null, ce = null;
    if (C != null) for (q in C.ref !== void 0 && (ce = C.ref), C.key !== void 0 && (le = "" + C.key), C) Ne.call(C, q) && !Ee.hasOwnProperty(q) && (re[q] = C[q]);
    var se = arguments.length - 2;
    if (se === 1) re.children = Y;
    else if (1 < se) {
      for (var ge = Array(se), Je = 0; Je < se; Je++) ge[Je] = arguments[Je + 2];
      re.children = ge;
    }
    if (p && p.defaultProps) for (q in se = p.defaultProps, se) re[q] === void 0 && (re[q] = se[q]);
    return { $$typeof: s, type: p, key: le, ref: ce, props: re, _owner: ke.current };
  }
  function lt(p, C) {
    return { $$typeof: s, type: p.type, key: C, ref: p.ref, props: p.props, _owner: p._owner };
  }
  function Ze(p) {
    return typeof p == "object" && p !== null && p.$$typeof === s;
  }
  function dt(p) {
    var C = { "=": "=0", ":": "=2" };
    return "$" + p.replace(/[=:]/g, function(Y) {
      return C[Y];
    });
  }
  var ee = /\/+/g;
  function Ie(p, C) {
    return typeof p == "object" && p !== null && p.key != null ? dt("" + p.key) : C.toString(36);
  }
  function De(p, C, Y, q, re) {
    var le = typeof p;
    (le === "undefined" || le === "boolean") && (p = null);
    var ce = !1;
    if (p === null) ce = !0;
    else switch (le) {
      case "string":
      case "number":
        ce = !0;
        break;
      case "object":
        switch (p.$$typeof) {
          case s:
          case f:
            ce = !0;
        }
    }
    if (ce) return ce = p, re = re(ce), p = q === "" ? "." + Ie(ce, 0) : q, ue(re) ? (Y = "", p != null && (Y = p.replace(ee, "$&/") + "/"), De(re, C, Y, "", function(Je) {
      return Je;
    })) : re != null && (Ze(re) && (re = lt(re, Y + (!re.key || ce && ce.key === re.key ? "" : ("" + re.key).replace(ee, "$&/") + "/") + p)), C.push(re)), 1;
    if (ce = 0, q = q === "" ? "." : q + ":", ue(p)) for (var se = 0; se < p.length; se++) {
      le = p[se];
      var ge = q + Ie(le, se);
      ce += De(le, C, Y, ge, re);
    }
    else if (ge = D(p), typeof ge == "function") for (p = ge.call(p), se = 0; !(le = p.next()).done; ) le = le.value, ge = q + Ie(le, se++), ce += De(le, C, Y, ge, re);
    else if (le === "object") throw C = String(p), Error("Objects are not valid as a React child (found: " + (C === "[object Object]" ? "object with keys {" + Object.keys(p).join(", ") + "}" : C) + "). If you meant to render a collection of children, use an array instead.");
    return ce;
  }
  function qe(p, C, Y) {
    if (p == null) return p;
    var q = [], re = 0;
    return De(p, q, "", "", function(le) {
      return C.call(Y, le, re++);
    }), q;
  }
  function ze(p) {
    if (p._status === -1) {
      var C = p._result;
      C = C(), C.then(function(Y) {
        (p._status === 0 || p._status === -1) && (p._status = 1, p._result = Y);
      }, function(Y) {
        (p._status === 0 || p._status === -1) && (p._status = 2, p._result = Y);
      }), p._status === -1 && (p._status = 0, p._result = C);
    }
    if (p._status === 1) return p._result.default;
    throw p._result;
  }
  var fe = { current: null }, P = { transition: null }, A = { ReactCurrentDispatcher: fe, ReactCurrentBatchConfig: P, ReactCurrentOwner: ke };
  function R() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Z.Children = { map: qe, forEach: function(p, C, Y) {
    qe(p, function() {
      C.apply(this, arguments);
    }, Y);
  }, count: function(p) {
    var C = 0;
    return qe(p, function() {
      C++;
    }), C;
  }, toArray: function(p) {
    return qe(p, function(C) {
      return C;
    }) || [];
  }, only: function(p) {
    if (!Ze(p)) throw Error("React.Children.only expected to receive a single React element child.");
    return p;
  } }, Z.Component = z, Z.Fragment = a, Z.Profiler = k, Z.PureComponent = ie, Z.StrictMode = v, Z.Suspense = L, Z.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = A, Z.act = R, Z.cloneElement = function(p, C, Y) {
    if (p == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + p + ".");
    var q = U({}, p.props), re = p.key, le = p.ref, ce = p._owner;
    if (C != null) {
      if (C.ref !== void 0 && (le = C.ref, ce = ke.current), C.key !== void 0 && (re = "" + C.key), p.type && p.type.defaultProps) var se = p.type.defaultProps;
      for (ge in C) Ne.call(C, ge) && !Ee.hasOwnProperty(ge) && (q[ge] = C[ge] === void 0 && se !== void 0 ? se[ge] : C[ge]);
    }
    var ge = arguments.length - 2;
    if (ge === 1) q.children = Y;
    else if (1 < ge) {
      se = Array(ge);
      for (var Je = 0; Je < ge; Je++) se[Je] = arguments[Je + 2];
      q.children = se;
    }
    return { $$typeof: s, type: p.type, key: re, ref: le, props: q, _owner: ce };
  }, Z.createContext = function(p) {
    return p = { $$typeof: w, _currentValue: p, _currentValue2: p, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, p.Provider = { $$typeof: x, _context: p }, p.Consumer = p;
  }, Z.createElement = Le, Z.createFactory = function(p) {
    var C = Le.bind(null, p);
    return C.type = p, C;
  }, Z.createRef = function() {
    return { current: null };
  }, Z.forwardRef = function(p) {
    return { $$typeof: N, render: p };
  }, Z.isValidElement = Ze, Z.lazy = function(p) {
    return { $$typeof: W, _payload: { _status: -1, _result: p }, _init: ze };
  }, Z.memo = function(p, C) {
    return { $$typeof: V, type: p, compare: C === void 0 ? null : C };
  }, Z.startTransition = function(p) {
    var C = P.transition;
    P.transition = {};
    try {
      p();
    } finally {
      P.transition = C;
    }
  }, Z.unstable_act = R, Z.useCallback = function(p, C) {
    return fe.current.useCallback(p, C);
  }, Z.useContext = function(p) {
    return fe.current.useContext(p);
  }, Z.useDebugValue = function() {
  }, Z.useDeferredValue = function(p) {
    return fe.current.useDeferredValue(p);
  }, Z.useEffect = function(p, C) {
    return fe.current.useEffect(p, C);
  }, Z.useId = function() {
    return fe.current.useId();
  }, Z.useImperativeHandle = function(p, C, Y) {
    return fe.current.useImperativeHandle(p, C, Y);
  }, Z.useInsertionEffect = function(p, C) {
    return fe.current.useInsertionEffect(p, C);
  }, Z.useLayoutEffect = function(p, C) {
    return fe.current.useLayoutEffect(p, C);
  }, Z.useMemo = function(p, C) {
    return fe.current.useMemo(p, C);
  }, Z.useReducer = function(p, C, Y) {
    return fe.current.useReducer(p, C, Y);
  }, Z.useRef = function(p) {
    return fe.current.useRef(p);
  }, Z.useState = function(p) {
    return fe.current.useState(p);
  }, Z.useSyncExternalStore = function(p, C, Y) {
    return fe.current.useSyncExternalStore(p, C, Y);
  }, Z.useTransition = function() {
    return fe.current.useTransition();
  }, Z.version = "18.3.1", Z;
}
var qu;
function es() {
  return qu || (qu = 1, Bi.exports = Af()), Bi.exports;
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
var Ju;
function Uf() {
  if (Ju) return Lr;
  Ju = 1;
  var s = es(), f = Symbol.for("react.element"), a = Symbol.for("react.fragment"), v = Object.prototype.hasOwnProperty, k = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, x = { key: !0, ref: !0, __self: !0, __source: !0 };
  function w(N, L, V) {
    var W, B = {}, D = null, X = null;
    V !== void 0 && (D = "" + V), L.key !== void 0 && (D = "" + L.key), L.ref !== void 0 && (X = L.ref);
    for (W in L) v.call(L, W) && !x.hasOwnProperty(W) && (B[W] = L[W]);
    if (N && N.defaultProps) for (W in L = N.defaultProps, L) B[W] === void 0 && (B[W] = L[W]);
    return { $$typeof: f, type: N, key: D, ref: X, props: B, _owner: k.current };
  }
  return Lr.Fragment = a, Lr.jsx = w, Lr.jsxs = w, Lr;
}
var ec;
function Vf() {
  return ec || (ec = 1, Hi.exports = Uf()), Hi.exports;
}
var y = Vf(), te = es();
const $f = /* @__PURE__ */ Ff(te), Hf = /* @__PURE__ */ Df({
  __proto__: null,
  default: $f
}, [te]);
var Ql = {}, Wi = { exports: {} }, Xe = {}, Qi = { exports: {} }, Gi = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var tc;
function Bf() {
  return tc || (tc = 1, (function(s) {
    function f(P, A) {
      var R = P.length;
      P.push(A);
      e: for (; 0 < R; ) {
        var p = R - 1 >>> 1, C = P[p];
        if (0 < k(C, A)) P[p] = A, P[R] = C, R = p;
        else break e;
      }
    }
    function a(P) {
      return P.length === 0 ? null : P[0];
    }
    function v(P) {
      if (P.length === 0) return null;
      var A = P[0], R = P.pop();
      if (R !== A) {
        P[0] = R;
        e: for (var p = 0, C = P.length, Y = C >>> 1; p < Y; ) {
          var q = 2 * (p + 1) - 1, re = P[q], le = q + 1, ce = P[le];
          if (0 > k(re, R)) le < C && 0 > k(ce, re) ? (P[p] = ce, P[le] = R, p = le) : (P[p] = re, P[q] = R, p = q);
          else if (le < C && 0 > k(ce, R)) P[p] = ce, P[le] = R, p = le;
          else break e;
        }
      }
      return A;
    }
    function k(P, A) {
      var R = P.sortIndex - A.sortIndex;
      return R !== 0 ? R : P.id - A.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var x = performance;
      s.unstable_now = function() {
        return x.now();
      };
    } else {
      var w = Date, N = w.now();
      s.unstable_now = function() {
        return w.now() - N;
      };
    }
    var L = [], V = [], W = 1, B = null, D = 3, X = !1, U = !1, b = !1, z = typeof setTimeout == "function" ? setTimeout : null, J = typeof clearTimeout == "function" ? clearTimeout : null, ie = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function K(P) {
      for (var A = a(V); A !== null; ) {
        if (A.callback === null) v(V);
        else if (A.startTime <= P) v(V), A.sortIndex = A.expirationTime, f(L, A);
        else break;
        A = a(V);
      }
    }
    function ue(P) {
      if (b = !1, K(P), !U) if (a(L) !== null) U = !0, ze(Ne);
      else {
        var A = a(V);
        A !== null && fe(ue, A.startTime - P);
      }
    }
    function Ne(P, A) {
      U = !1, b && (b = !1, J(Le), Le = -1), X = !0;
      var R = D;
      try {
        for (K(A), B = a(L); B !== null && (!(B.expirationTime > A) || P && !dt()); ) {
          var p = B.callback;
          if (typeof p == "function") {
            B.callback = null, D = B.priorityLevel;
            var C = p(B.expirationTime <= A);
            A = s.unstable_now(), typeof C == "function" ? B.callback = C : B === a(L) && v(L), K(A);
          } else v(L);
          B = a(L);
        }
        if (B !== null) var Y = !0;
        else {
          var q = a(V);
          q !== null && fe(ue, q.startTime - A), Y = !1;
        }
        return Y;
      } finally {
        B = null, D = R, X = !1;
      }
    }
    var ke = !1, Ee = null, Le = -1, lt = 5, Ze = -1;
    function dt() {
      return !(s.unstable_now() - Ze < lt);
    }
    function ee() {
      if (Ee !== null) {
        var P = s.unstable_now();
        Ze = P;
        var A = !0;
        try {
          A = Ee(!0, P);
        } finally {
          A ? Ie() : (ke = !1, Ee = null);
        }
      } else ke = !1;
    }
    var Ie;
    if (typeof ie == "function") Ie = function() {
      ie(ee);
    };
    else if (typeof MessageChannel < "u") {
      var De = new MessageChannel(), qe = De.port2;
      De.port1.onmessage = ee, Ie = function() {
        qe.postMessage(null);
      };
    } else Ie = function() {
      z(ee, 0);
    };
    function ze(P) {
      Ee = P, ke || (ke = !0, Ie());
    }
    function fe(P, A) {
      Le = z(function() {
        P(s.unstable_now());
      }, A);
    }
    s.unstable_IdlePriority = 5, s.unstable_ImmediatePriority = 1, s.unstable_LowPriority = 4, s.unstable_NormalPriority = 3, s.unstable_Profiling = null, s.unstable_UserBlockingPriority = 2, s.unstable_cancelCallback = function(P) {
      P.callback = null;
    }, s.unstable_continueExecution = function() {
      U || X || (U = !0, ze(Ne));
    }, s.unstable_forceFrameRate = function(P) {
      0 > P || 125 < P ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : lt = 0 < P ? Math.floor(1e3 / P) : 5;
    }, s.unstable_getCurrentPriorityLevel = function() {
      return D;
    }, s.unstable_getFirstCallbackNode = function() {
      return a(L);
    }, s.unstable_next = function(P) {
      switch (D) {
        case 1:
        case 2:
        case 3:
          var A = 3;
          break;
        default:
          A = D;
      }
      var R = D;
      D = A;
      try {
        return P();
      } finally {
        D = R;
      }
    }, s.unstable_pauseExecution = function() {
    }, s.unstable_requestPaint = function() {
    }, s.unstable_runWithPriority = function(P, A) {
      switch (P) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          P = 3;
      }
      var R = D;
      D = P;
      try {
        return A();
      } finally {
        D = R;
      }
    }, s.unstable_scheduleCallback = function(P, A, R) {
      var p = s.unstable_now();
      switch (typeof R == "object" && R !== null ? (R = R.delay, R = typeof R == "number" && 0 < R ? p + R : p) : R = p, P) {
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
      return C = R + C, P = { id: W++, callback: A, priorityLevel: P, startTime: R, expirationTime: C, sortIndex: -1 }, R > p ? (P.sortIndex = R, f(V, P), a(L) === null && P === a(V) && (b ? (J(Le), Le = -1) : b = !0, fe(ue, R - p))) : (P.sortIndex = C, f(L, P), U || X || (U = !0, ze(Ne))), P;
    }, s.unstable_shouldYield = dt, s.unstable_wrapCallback = function(P) {
      var A = D;
      return function() {
        var R = D;
        D = A;
        try {
          return P.apply(this, arguments);
        } finally {
          D = R;
        }
      };
    };
  })(Gi)), Gi;
}
var nc;
function Wf() {
  return nc || (nc = 1, Qi.exports = Bf()), Qi.exports;
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
var rc;
function Qf() {
  if (rc) return Xe;
  rc = 1;
  var s = es(), f = Wf();
  function a(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var v = /* @__PURE__ */ new Set(), k = {};
  function x(e, t) {
    w(e, t), w(e + "Capture", t);
  }
  function w(e, t) {
    for (k[e] = t, e = 0; e < t.length; e++) v.add(t[e]);
  }
  var N = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), L = Object.prototype.hasOwnProperty, V = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, W = {}, B = {};
  function D(e) {
    return L.call(B, e) ? !0 : L.call(W, e) ? !1 : V.test(e) ? B[e] = !0 : (W[e] = !0, !1);
  }
  function X(e, t, n, r) {
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
    if (t === null || typeof t > "u" || X(e, t, n, r)) return !0;
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
  function b(e, t, n, r, l, o, i) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = i;
  }
  var z = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    z[e] = new b(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    z[t] = new b(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    z[e] = new b(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    z[e] = new b(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    z[e] = new b(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    z[e] = new b(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    z[e] = new b(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    z[e] = new b(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    z[e] = new b(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var J = /[\-:]([a-z])/g;
  function ie(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      J,
      ie
    );
    z[t] = new b(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(J, ie);
    z[t] = new b(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(J, ie);
    z[t] = new b(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    z[e] = new b(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), z.xlinkHref = new b("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    z[e] = new b(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function K(e, t, n, r) {
    var l = z.hasOwnProperty(t) ? z[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (U(t, n, l, r) && (n = null), r || l === null ? D(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ue = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Ne = Symbol.for("react.element"), ke = Symbol.for("react.portal"), Ee = Symbol.for("react.fragment"), Le = Symbol.for("react.strict_mode"), lt = Symbol.for("react.profiler"), Ze = Symbol.for("react.provider"), dt = Symbol.for("react.context"), ee = Symbol.for("react.forward_ref"), Ie = Symbol.for("react.suspense"), De = Symbol.for("react.suspense_list"), qe = Symbol.for("react.memo"), ze = Symbol.for("react.lazy"), fe = Symbol.for("react.offscreen"), P = Symbol.iterator;
  function A(e) {
    return e === null || typeof e != "object" ? null : (e = P && e[P] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var R = Object.assign, p;
  function C(e) {
    if (p === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      p = t && t[1] || "";
    }
    return `
` + p + e;
  }
  var Y = !1;
  function q(e, t) {
    if (!e || Y) return "";
    Y = !0;
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
`), i = l.length - 1, u = o.length - 1; 1 <= i && 0 <= u && l[i] !== o[u]; ) u--;
        for (; 1 <= i && 0 <= u; i--, u--) if (l[i] !== o[u]) {
          if (i !== 1 || u !== 1)
            do
              if (i--, u--, 0 > u || l[i] !== o[u]) {
                var c = `
` + l[i].replace(" at new ", " at ");
                return e.displayName && c.includes("<anonymous>") && (c = c.replace("<anonymous>", e.displayName)), c;
              }
            while (1 <= i && 0 <= u);
          break;
        }
      }
    } finally {
      Y = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? C(e) : "";
  }
  function re(e) {
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
        return e = q(e.type, !1), e;
      case 11:
        return e = q(e.type.render, !1), e;
      case 1:
        return e = q(e.type, !0), e;
      default:
        return "";
    }
  }
  function le(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case Ee:
        return "Fragment";
      case ke:
        return "Portal";
      case lt:
        return "Profiler";
      case Le:
        return "StrictMode";
      case Ie:
        return "Suspense";
      case De:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case dt:
        return (e.displayName || "Context") + ".Consumer";
      case Ze:
        return (e._context.displayName || "Context") + ".Provider";
      case ee:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case qe:
        return t = e.displayName || null, t !== null ? t : le(e.type) || "Memo";
      case ze:
        t = e._payload, e = e._init;
        try {
          return le(e(t));
        } catch {
        }
    }
    return null;
  }
  function ce(e) {
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
        return le(t);
      case 8:
        return t === Le ? "StrictMode" : "Mode";
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
  function se(e) {
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
  function ge(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Je(e) {
    var t = ge(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function Ir(e) {
    e._valueTracker || (e._valueTracker = Je(e));
  }
  function rs(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = ge(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Dr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Yl(e, t) {
    var n = t.checked;
    return R({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function ls(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = se(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function os(e, t) {
    t = t.checked, t != null && K(e, "checked", t, !1);
  }
  function Xl(e, t) {
    os(e, t);
    var n = se(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Zl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Zl(e, t.type, se(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function is(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Zl(e, t, n) {
    (t !== "number" || Dr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Kn = Array.isArray;
  function kn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + se(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function ql(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(a(91));
    return R({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function ss(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(a(92));
        if (Kn(n)) {
          if (1 < n.length) throw Error(a(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: se(n) };
  }
  function as(e, t) {
    var n = se(t.value), r = se(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function us(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function cs(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Jl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? cs(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Fr, ds = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Fr = Fr || document.createElement("div"), Fr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Fr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Yn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Xn = {
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
  }, Uc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Xn).forEach(function(e) {
    Uc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Xn[t] = Xn[e];
    });
  });
  function fs(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Xn.hasOwnProperty(e) && Xn[e] ? ("" + t).trim() : t + "px";
  }
  function ps(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = fs(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Vc = R({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function eo(e, t) {
    if (t) {
      if (Vc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(a(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(a(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(a(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(a(62));
    }
  }
  function to(e, t) {
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
  var no = null;
  function ro(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var lo = null, Sn = null, Cn = null;
  function ms(e) {
    if (e = yr(e)) {
      if (typeof lo != "function") throw Error(a(280));
      var t = e.stateNode;
      t && (t = sl(t), lo(e.stateNode, e.type, t));
    }
  }
  function hs(e) {
    Sn ? Cn ? Cn.push(e) : Cn = [e] : Sn = e;
  }
  function gs() {
    if (Sn) {
      var e = Sn, t = Cn;
      if (Cn = Sn = null, ms(e), t) for (e = 0; e < t.length; e++) ms(t[e]);
    }
  }
  function vs(e, t) {
    return e(t);
  }
  function ys() {
  }
  var oo = !1;
  function ws(e, t, n) {
    if (oo) return e(t, n);
    oo = !0;
    try {
      return vs(e, t, n);
    } finally {
      oo = !1, (Sn !== null || Cn !== null) && (ys(), gs());
    }
  }
  function Zn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = sl(n);
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
    if (n && typeof n != "function") throw Error(a(231, t, typeof n));
    return n;
  }
  var io = !1;
  if (N) try {
    var qn = {};
    Object.defineProperty(qn, "passive", { get: function() {
      io = !0;
    } }), window.addEventListener("test", qn, qn), window.removeEventListener("test", qn, qn);
  } catch {
    io = !1;
  }
  function $c(e, t, n, r, l, o, i, u, c) {
    var g = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, g);
    } catch (E) {
      this.onError(E);
    }
  }
  var Jn = !1, Ar = null, Ur = !1, so = null, Hc = { onError: function(e) {
    Jn = !0, Ar = e;
  } };
  function Bc(e, t, n, r, l, o, i, u, c) {
    Jn = !1, Ar = null, $c.apply(Hc, arguments);
  }
  function Wc(e, t, n, r, l, o, i, u, c) {
    if (Bc.apply(this, arguments), Jn) {
      if (Jn) {
        var g = Ar;
        Jn = !1, Ar = null;
      } else throw Error(a(198));
      Ur || (Ur = !0, so = g);
    }
  }
  function on(e) {
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
  function xs(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function ks(e) {
    if (on(e) !== e) throw Error(a(188));
  }
  function Qc(e) {
    var t = e.alternate;
    if (!t) {
      if (t = on(e), t === null) throw Error(a(188));
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
          if (o === n) return ks(l), e;
          if (o === r) return ks(l), t;
          o = o.sibling;
        }
        throw Error(a(188));
      }
      if (n.return !== r.return) n = l, r = o;
      else {
        for (var i = !1, u = l.child; u; ) {
          if (u === n) {
            i = !0, n = l, r = o;
            break;
          }
          if (u === r) {
            i = !0, r = l, n = o;
            break;
          }
          u = u.sibling;
        }
        if (!i) {
          for (u = o.child; u; ) {
            if (u === n) {
              i = !0, n = o, r = l;
              break;
            }
            if (u === r) {
              i = !0, r = o, n = l;
              break;
            }
            u = u.sibling;
          }
          if (!i) throw Error(a(189));
        }
      }
      if (n.alternate !== r) throw Error(a(190));
    }
    if (n.tag !== 3) throw Error(a(188));
    return n.stateNode.current === n ? e : t;
  }
  function Ss(e) {
    return e = Qc(e), e !== null ? Cs(e) : null;
  }
  function Cs(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Cs(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Es = f.unstable_scheduleCallback, _s = f.unstable_cancelCallback, Gc = f.unstable_shouldYield, Kc = f.unstable_requestPaint, Se = f.unstable_now, Yc = f.unstable_getCurrentPriorityLevel, ao = f.unstable_ImmediatePriority, Ns = f.unstable_UserBlockingPriority, Vr = f.unstable_NormalPriority, Xc = f.unstable_LowPriority, zs = f.unstable_IdlePriority, $r = null, xt = null;
  function Zc(e) {
    if (xt && typeof xt.onCommitFiberRoot == "function") try {
      xt.onCommitFiberRoot($r, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var ft = Math.clz32 ? Math.clz32 : ed, qc = Math.log, Jc = Math.LN2;
  function ed(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (qc(e) / Jc | 0) | 0;
  }
  var Hr = 64, Br = 4194304;
  function er(e) {
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
  function Wr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, i = n & 268435455;
    if (i !== 0) {
      var u = i & ~l;
      u !== 0 ? r = er(u) : (o &= i, o !== 0 && (r = er(o)));
    } else i = n & ~l, i !== 0 ? r = er(i) : o !== 0 && (r = er(o));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - ft(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function td(e, t) {
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
  function nd(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - ft(o), u = 1 << i, c = l[i];
      c === -1 ? ((u & n) === 0 || (u & r) !== 0) && (l[i] = td(u, t)) : c <= t && (e.expiredLanes |= u), o &= ~u;
    }
  }
  function uo(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function js() {
    var e = Hr;
    return Hr <<= 1, (Hr & 4194240) === 0 && (Hr = 64), e;
  }
  function co(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function tr(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - ft(t), e[t] = n;
  }
  function rd(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - ft(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function fo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - ft(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var ae = 0;
  function Ps(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Ts, po, Rs, Ms, Ls, mo = !1, Qr = [], Dt = null, Ft = null, At = null, nr = /* @__PURE__ */ new Map(), rr = /* @__PURE__ */ new Map(), Ut = [], ld = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function bs(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Dt = null;
        break;
      case "dragenter":
      case "dragleave":
        Ft = null;
        break;
      case "mouseover":
      case "mouseout":
        At = null;
        break;
      case "pointerover":
      case "pointerout":
        nr.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        rr.delete(t.pointerId);
    }
  }
  function lr(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = yr(t), t !== null && po(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function od(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Dt = lr(Dt, e, t, n, r, l), !0;
      case "dragenter":
        return Ft = lr(Ft, e, t, n, r, l), !0;
      case "mouseover":
        return At = lr(At, e, t, n, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return nr.set(o, lr(nr.get(o) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, rr.set(o, lr(rr.get(o) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function Os(e) {
    var t = sn(e.target);
    if (t !== null) {
      var n = on(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = xs(n), t !== null) {
            e.blockedOn = t, Ls(e.priority, function() {
              Rs(n);
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
  function Gr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = go(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        no = r, n.target.dispatchEvent(r), no = null;
      } else return t = yr(n), t !== null && po(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Is(e, t, n) {
    Gr(e) && n.delete(t);
  }
  function id() {
    mo = !1, Dt !== null && Gr(Dt) && (Dt = null), Ft !== null && Gr(Ft) && (Ft = null), At !== null && Gr(At) && (At = null), nr.forEach(Is), rr.forEach(Is);
  }
  function or(e, t) {
    e.blockedOn === t && (e.blockedOn = null, mo || (mo = !0, f.unstable_scheduleCallback(f.unstable_NormalPriority, id)));
  }
  function ir(e) {
    function t(l) {
      return or(l, e);
    }
    if (0 < Qr.length) {
      or(Qr[0], e);
      for (var n = 1; n < Qr.length; n++) {
        var r = Qr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Dt !== null && or(Dt, e), Ft !== null && or(Ft, e), At !== null && or(At, e), nr.forEach(t), rr.forEach(t), n = 0; n < Ut.length; n++) r = Ut[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Ut.length && (n = Ut[0], n.blockedOn === null); ) Os(n), n.blockedOn === null && Ut.shift();
  }
  var En = ue.ReactCurrentBatchConfig, Kr = !0;
  function sd(e, t, n, r) {
    var l = ae, o = En.transition;
    En.transition = null;
    try {
      ae = 1, ho(e, t, n, r);
    } finally {
      ae = l, En.transition = o;
    }
  }
  function ad(e, t, n, r) {
    var l = ae, o = En.transition;
    En.transition = null;
    try {
      ae = 4, ho(e, t, n, r);
    } finally {
      ae = l, En.transition = o;
    }
  }
  function ho(e, t, n, r) {
    if (Kr) {
      var l = go(e, t, n, r);
      if (l === null) Lo(e, t, r, Yr, n), bs(e, r);
      else if (od(l, e, t, n, r)) r.stopPropagation();
      else if (bs(e, r), t & 4 && -1 < ld.indexOf(e)) {
        for (; l !== null; ) {
          var o = yr(l);
          if (o !== null && Ts(o), o = go(e, t, n, r), o === null && Lo(e, t, r, Yr, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else Lo(e, t, r, null, n);
    }
  }
  var Yr = null;
  function go(e, t, n, r) {
    if (Yr = null, e = ro(r), e = sn(e), e !== null) if (t = on(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = xs(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Yr = e, null;
  }
  function Ds(e) {
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
        switch (Yc()) {
          case ao:
            return 1;
          case Ns:
            return 4;
          case Vr:
          case Xc:
            return 16;
          case zs:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Vt = null, vo = null, Xr = null;
  function Fs() {
    if (Xr) return Xr;
    var e, t = vo, n = t.length, r, l = "value" in Vt ? Vt.value : Vt.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
    return Xr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Zr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function qr() {
    return !0;
  }
  function As() {
    return !1;
  }
  function et(e) {
    function t(n, r, l, o, i) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
      for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(o) : o[u]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? qr : As, this.isPropagationStopped = As, this;
    }
    return R(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = qr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = qr);
    }, persist: function() {
    }, isPersistent: qr }), t;
  }
  var _n = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, yo = et(_n), sr = R({}, _n, { view: 0, detail: 0 }), ud = et(sr), wo, xo, ar, Jr = R({}, sr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: So, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== ar && (ar && e.type === "mousemove" ? (wo = e.screenX - ar.screenX, xo = e.screenY - ar.screenY) : xo = wo = 0, ar = e), wo);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : xo;
  } }), Us = et(Jr), cd = R({}, Jr, { dataTransfer: 0 }), dd = et(cd), fd = R({}, sr, { relatedTarget: 0 }), ko = et(fd), pd = R({}, _n, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), md = et(pd), hd = R({}, _n, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), gd = et(hd), vd = R({}, _n, { data: 0 }), Vs = et(vd), yd = {
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
  }, wd = {
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
  }, xd = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function kd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = xd[e]) ? !!t[e] : !1;
  }
  function So() {
    return kd;
  }
  var Sd = R({}, sr, { key: function(e) {
    if (e.key) {
      var t = yd[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Zr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? wd[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: So, charCode: function(e) {
    return e.type === "keypress" ? Zr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Zr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Cd = et(Sd), Ed = R({}, Jr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), $s = et(Ed), _d = R({}, sr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: So }), Nd = et(_d), zd = R({}, _n, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), jd = et(zd), Pd = R({}, Jr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Td = et(Pd), Rd = [9, 13, 27, 32], Co = N && "CompositionEvent" in window, ur = null;
  N && "documentMode" in document && (ur = document.documentMode);
  var Md = N && "TextEvent" in window && !ur, Hs = N && (!Co || ur && 8 < ur && 11 >= ur), Bs = " ", Ws = !1;
  function Qs(e, t) {
    switch (e) {
      case "keyup":
        return Rd.indexOf(t.keyCode) !== -1;
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
  function Gs(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Nn = !1;
  function Ld(e, t) {
    switch (e) {
      case "compositionend":
        return Gs(t);
      case "keypress":
        return t.which !== 32 ? null : (Ws = !0, Bs);
      case "textInput":
        return e = t.data, e === Bs && Ws ? null : e;
      default:
        return null;
    }
  }
  function bd(e, t) {
    if (Nn) return e === "compositionend" || !Co && Qs(e, t) ? (e = Fs(), Xr = vo = Vt = null, Nn = !1, e) : null;
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
        return Hs && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Od = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Ks(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Od[e.type] : t === "textarea";
  }
  function Ys(e, t, n, r) {
    hs(r), t = ll(t, "onChange"), 0 < t.length && (n = new yo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var cr = null, dr = null;
  function Id(e) {
    pa(e, 0);
  }
  function el(e) {
    var t = Rn(e);
    if (rs(t)) return e;
  }
  function Dd(e, t) {
    if (e === "change") return t;
  }
  var Xs = !1;
  if (N) {
    var Eo;
    if (N) {
      var _o = "oninput" in document;
      if (!_o) {
        var Zs = document.createElement("div");
        Zs.setAttribute("oninput", "return;"), _o = typeof Zs.oninput == "function";
      }
      Eo = _o;
    } else Eo = !1;
    Xs = Eo && (!document.documentMode || 9 < document.documentMode);
  }
  function qs() {
    cr && (cr.detachEvent("onpropertychange", Js), dr = cr = null);
  }
  function Js(e) {
    if (e.propertyName === "value" && el(dr)) {
      var t = [];
      Ys(t, dr, e, ro(e)), ws(Id, t);
    }
  }
  function Fd(e, t, n) {
    e === "focusin" ? (qs(), cr = t, dr = n, cr.attachEvent("onpropertychange", Js)) : e === "focusout" && qs();
  }
  function Ad(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return el(dr);
  }
  function Ud(e, t) {
    if (e === "click") return el(t);
  }
  function Vd(e, t) {
    if (e === "input" || e === "change") return el(t);
  }
  function $d(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var pt = typeof Object.is == "function" ? Object.is : $d;
  function fr(e, t) {
    if (pt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!L.call(t, l) || !pt(e[l], t[l])) return !1;
    }
    return !0;
  }
  function ea(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function ta(e, t) {
    var n = ea(e);
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
      n = ea(n);
    }
  }
  function na(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? na(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ra() {
    for (var e = window, t = Dr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Dr(e.document);
    }
    return t;
  }
  function No(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Hd(e) {
    var t = ra(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && na(n.ownerDocument.documentElement, n)) {
      if (r !== null && No(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = ta(n, o);
          var i = ta(
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
  var Bd = N && "documentMode" in document && 11 >= document.documentMode, zn = null, zo = null, pr = null, jo = !1;
  function la(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    jo || zn == null || zn !== Dr(r) || (r = zn, "selectionStart" in r && No(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), pr && fr(pr, r) || (pr = r, r = ll(zo, "onSelect"), 0 < r.length && (t = new yo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = zn)));
  }
  function tl(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var jn = { animationend: tl("Animation", "AnimationEnd"), animationiteration: tl("Animation", "AnimationIteration"), animationstart: tl("Animation", "AnimationStart"), transitionend: tl("Transition", "TransitionEnd") }, Po = {}, oa = {};
  N && (oa = document.createElement("div").style, "AnimationEvent" in window || (delete jn.animationend.animation, delete jn.animationiteration.animation, delete jn.animationstart.animation), "TransitionEvent" in window || delete jn.transitionend.transition);
  function nl(e) {
    if (Po[e]) return Po[e];
    if (!jn[e]) return e;
    var t = jn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in oa) return Po[e] = t[n];
    return e;
  }
  var ia = nl("animationend"), sa = nl("animationiteration"), aa = nl("animationstart"), ua = nl("transitionend"), ca = /* @__PURE__ */ new Map(), da = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function $t(e, t) {
    ca.set(e, t), x(t, [e]);
  }
  for (var To = 0; To < da.length; To++) {
    var Ro = da[To], Wd = Ro.toLowerCase(), Qd = Ro[0].toUpperCase() + Ro.slice(1);
    $t(Wd, "on" + Qd);
  }
  $t(ia, "onAnimationEnd"), $t(sa, "onAnimationIteration"), $t(aa, "onAnimationStart"), $t("dblclick", "onDoubleClick"), $t("focusin", "onFocus"), $t("focusout", "onBlur"), $t(ua, "onTransitionEnd"), w("onMouseEnter", ["mouseout", "mouseover"]), w("onMouseLeave", ["mouseout", "mouseover"]), w("onPointerEnter", ["pointerout", "pointerover"]), w("onPointerLeave", ["pointerout", "pointerover"]), x("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), x("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), x("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), x("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), x("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), x("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var mr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Gd = new Set("cancel close invalid load scroll toggle".split(" ").concat(mr));
  function fa(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, Wc(r, t, void 0, e), e.currentTarget = null;
  }
  function pa(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var u = r[i], c = u.instance, g = u.currentTarget;
          if (u = u.listener, c !== o && l.isPropagationStopped()) break e;
          fa(l, u, g), o = c;
        }
        else for (i = 0; i < r.length; i++) {
          if (u = r[i], c = u.instance, g = u.currentTarget, u = u.listener, c !== o && l.isPropagationStopped()) break e;
          fa(l, u, g), o = c;
        }
      }
    }
    if (Ur) throw e = so, Ur = !1, so = null, e;
  }
  function pe(e, t) {
    var n = t[Ao];
    n === void 0 && (n = t[Ao] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (ma(t, e, 2, !1), n.add(r));
  }
  function Mo(e, t, n) {
    var r = 0;
    t && (r |= 4), ma(n, e, r, t);
  }
  var rl = "_reactListening" + Math.random().toString(36).slice(2);
  function hr(e) {
    if (!e[rl]) {
      e[rl] = !0, v.forEach(function(n) {
        n !== "selectionchange" && (Gd.has(n) || Mo(n, !1, e), Mo(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[rl] || (t[rl] = !0, Mo("selectionchange", !1, t));
    }
  }
  function ma(e, t, n, r) {
    switch (Ds(t)) {
      case 1:
        var l = sd;
        break;
      case 4:
        l = ad;
        break;
      default:
        l = ho;
    }
    n = l.bind(null, t, n, e), l = void 0, !io || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Lo(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var i = r.tag;
      if (i === 3 || i === 4) {
        var u = r.stateNode.containerInfo;
        if (u === l || u.nodeType === 8 && u.parentNode === l) break;
        if (i === 4) for (i = r.return; i !== null; ) {
          var c = i.tag;
          if ((c === 3 || c === 4) && (c = i.stateNode.containerInfo, c === l || c.nodeType === 8 && c.parentNode === l)) return;
          i = i.return;
        }
        for (; u !== null; ) {
          if (i = sn(u), i === null) return;
          if (c = i.tag, c === 5 || c === 6) {
            r = o = i;
            continue e;
          }
          u = u.parentNode;
        }
      }
      r = r.return;
    }
    ws(function() {
      var g = o, E = ro(n), _ = [];
      e: {
        var S = ca.get(e);
        if (S !== void 0) {
          var T = yo, O = e;
          switch (e) {
            case "keypress":
              if (Zr(n) === 0) break e;
            case "keydown":
            case "keyup":
              T = Cd;
              break;
            case "focusin":
              O = "focus", T = ko;
              break;
            case "focusout":
              O = "blur", T = ko;
              break;
            case "beforeblur":
            case "afterblur":
              T = ko;
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
              T = Us;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              T = dd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              T = Nd;
              break;
            case ia:
            case sa:
            case aa:
              T = md;
              break;
            case ua:
              T = jd;
              break;
            case "scroll":
              T = ud;
              break;
            case "wheel":
              T = Td;
              break;
            case "copy":
            case "cut":
            case "paste":
              T = gd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              T = $s;
          }
          var I = (t & 4) !== 0, Ce = !I && e === "scroll", m = I ? S !== null ? S + "Capture" : null : S;
          I = [];
          for (var d = g, h; d !== null; ) {
            h = d;
            var j = h.stateNode;
            if (h.tag === 5 && j !== null && (h = j, m !== null && (j = Zn(d, m), j != null && I.push(gr(d, j, h)))), Ce) break;
            d = d.return;
          }
          0 < I.length && (S = new T(S, O, null, n, E), _.push({ event: S, listeners: I }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (S = e === "mouseover" || e === "pointerover", T = e === "mouseout" || e === "pointerout", S && n !== no && (O = n.relatedTarget || n.fromElement) && (sn(O) || O[zt])) break e;
          if ((T || S) && (S = E.window === E ? E : (S = E.ownerDocument) ? S.defaultView || S.parentWindow : window, T ? (O = n.relatedTarget || n.toElement, T = g, O = O ? sn(O) : null, O !== null && (Ce = on(O), O !== Ce || O.tag !== 5 && O.tag !== 6) && (O = null)) : (T = null, O = g), T !== O)) {
            if (I = Us, j = "onMouseLeave", m = "onMouseEnter", d = "mouse", (e === "pointerout" || e === "pointerover") && (I = $s, j = "onPointerLeave", m = "onPointerEnter", d = "pointer"), Ce = T == null ? S : Rn(T), h = O == null ? S : Rn(O), S = new I(j, d + "leave", T, n, E), S.target = Ce, S.relatedTarget = h, j = null, sn(E) === g && (I = new I(m, d + "enter", O, n, E), I.target = h, I.relatedTarget = Ce, j = I), Ce = j, T && O) t: {
              for (I = T, m = O, d = 0, h = I; h; h = Pn(h)) d++;
              for (h = 0, j = m; j; j = Pn(j)) h++;
              for (; 0 < d - h; ) I = Pn(I), d--;
              for (; 0 < h - d; ) m = Pn(m), h--;
              for (; d--; ) {
                if (I === m || m !== null && I === m.alternate) break t;
                I = Pn(I), m = Pn(m);
              }
              I = null;
            }
            else I = null;
            T !== null && ha(_, S, T, I, !1), O !== null && Ce !== null && ha(_, Ce, O, I, !0);
          }
        }
        e: {
          if (S = g ? Rn(g) : window, T = S.nodeName && S.nodeName.toLowerCase(), T === "select" || T === "input" && S.type === "file") var F = Dd;
          else if (Ks(S)) if (Xs) F = Vd;
          else {
            F = Ad;
            var $ = Fd;
          }
          else (T = S.nodeName) && T.toLowerCase() === "input" && (S.type === "checkbox" || S.type === "radio") && (F = Ud);
          if (F && (F = F(e, g))) {
            Ys(_, F, n, E);
            break e;
          }
          $ && $(e, S, g), e === "focusout" && ($ = S._wrapperState) && $.controlled && S.type === "number" && Zl(S, "number", S.value);
        }
        switch ($ = g ? Rn(g) : window, e) {
          case "focusin":
            (Ks($) || $.contentEditable === "true") && (zn = $, zo = g, pr = null);
            break;
          case "focusout":
            pr = zo = zn = null;
            break;
          case "mousedown":
            jo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            jo = !1, la(_, n, E);
            break;
          case "selectionchange":
            if (Bd) break;
          case "keydown":
          case "keyup":
            la(_, n, E);
        }
        var H;
        if (Co) e: {
          switch (e) {
            case "compositionstart":
              var Q = "onCompositionStart";
              break e;
            case "compositionend":
              Q = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Q = "onCompositionUpdate";
              break e;
          }
          Q = void 0;
        }
        else Nn ? Qs(e, n) && (Q = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Q = "onCompositionStart");
        Q && (Hs && n.locale !== "ko" && (Nn || Q !== "onCompositionStart" ? Q === "onCompositionEnd" && Nn && (H = Fs()) : (Vt = E, vo = "value" in Vt ? Vt.value : Vt.textContent, Nn = !0)), $ = ll(g, Q), 0 < $.length && (Q = new Vs(Q, e, null, n, E), _.push({ event: Q, listeners: $ }), H ? Q.data = H : (H = Gs(n), H !== null && (Q.data = H)))), (H = Md ? Ld(e, n) : bd(e, n)) && (g = ll(g, "onBeforeInput"), 0 < g.length && (E = new Vs("onBeforeInput", "beforeinput", null, n, E), _.push({ event: E, listeners: g }), E.data = H));
      }
      pa(_, t);
    });
  }
  function gr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function ll(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Zn(e, n), o != null && r.unshift(gr(e, o, l)), o = Zn(e, t), o != null && r.push(gr(e, o, l))), e = e.return;
    }
    return r;
  }
  function Pn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function ha(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var u = n, c = u.alternate, g = u.stateNode;
      if (c !== null && c === r) break;
      u.tag === 5 && g !== null && (u = g, l ? (c = Zn(n, o), c != null && i.unshift(gr(n, c, u))) : l || (c = Zn(n, o), c != null && i.push(gr(n, c, u)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var Kd = /\r\n?/g, Yd = /\u0000|\uFFFD/g;
  function ga(e) {
    return (typeof e == "string" ? e : "" + e).replace(Kd, `
`).replace(Yd, "");
  }
  function ol(e, t, n) {
    if (t = ga(t), ga(e) !== t && n) throw Error(a(425));
  }
  function il() {
  }
  var bo = null, Oo = null;
  function Io(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Do = typeof setTimeout == "function" ? setTimeout : void 0, Xd = typeof clearTimeout == "function" ? clearTimeout : void 0, va = typeof Promise == "function" ? Promise : void 0, Zd = typeof queueMicrotask == "function" ? queueMicrotask : typeof va < "u" ? function(e) {
    return va.resolve(null).then(e).catch(qd);
  } : Do;
  function qd(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Fo(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), ir(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    ir(t);
  }
  function Ht(e) {
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
  function ya(e) {
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
  var Tn = Math.random().toString(36).slice(2), kt = "__reactFiber$" + Tn, vr = "__reactProps$" + Tn, zt = "__reactContainer$" + Tn, Ao = "__reactEvents$" + Tn, Jd = "__reactListeners$" + Tn, ef = "__reactHandles$" + Tn;
  function sn(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[zt] || n[kt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = ya(e); e !== null; ) {
          if (n = e[kt]) return n;
          e = ya(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function yr(e) {
    return e = e[kt] || e[zt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Rn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(a(33));
  }
  function sl(e) {
    return e[vr] || null;
  }
  var Uo = [], Mn = -1;
  function Bt(e) {
    return { current: e };
  }
  function me(e) {
    0 > Mn || (e.current = Uo[Mn], Uo[Mn] = null, Mn--);
  }
  function de(e, t) {
    Mn++, Uo[Mn] = e.current, e.current = t;
  }
  var Wt = {}, Fe = Bt(Wt), We = Bt(!1), an = Wt;
  function Ln(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Wt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in n) l[o] = t[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Qe(e) {
    return e = e.childContextTypes, e != null;
  }
  function al() {
    me(We), me(Fe);
  }
  function wa(e, t, n) {
    if (Fe.current !== Wt) throw Error(a(168));
    de(Fe, t), de(We, n);
  }
  function xa(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(a(108, ce(e) || "Unknown", l));
    return R({}, n, r);
  }
  function ul(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Wt, an = Fe.current, de(Fe, e), de(We, We.current), !0;
  }
  function ka(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(a(169));
    n ? (e = xa(e, t, an), r.__reactInternalMemoizedMergedChildContext = e, me(We), me(Fe), de(Fe, e)) : me(We), de(We, n);
  }
  var jt = null, cl = !1, Vo = !1;
  function Sa(e) {
    jt === null ? jt = [e] : jt.push(e);
  }
  function tf(e) {
    cl = !0, Sa(e);
  }
  function Qt() {
    if (!Vo && jt !== null) {
      Vo = !0;
      var e = 0, t = ae;
      try {
        var n = jt;
        for (ae = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        jt = null, cl = !1;
      } catch (l) {
        throw jt !== null && (jt = jt.slice(e + 1)), Es(ao, Qt), l;
      } finally {
        ae = t, Vo = !1;
      }
    }
    return null;
  }
  var bn = [], On = 0, dl = null, fl = 0, ot = [], it = 0, un = null, Pt = 1, Tt = "";
  function cn(e, t) {
    bn[On++] = fl, bn[On++] = dl, dl = e, fl = t;
  }
  function Ca(e, t, n) {
    ot[it++] = Pt, ot[it++] = Tt, ot[it++] = un, un = e;
    var r = Pt;
    e = Tt;
    var l = 32 - ft(r) - 1;
    r &= ~(1 << l), n += 1;
    var o = 32 - ft(t) + l;
    if (30 < o) {
      var i = l - l % 5;
      o = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, Pt = 1 << 32 - ft(t) + l | n << l | r, Tt = o + e;
    } else Pt = 1 << o | n << l | r, Tt = e;
  }
  function $o(e) {
    e.return !== null && (cn(e, 1), Ca(e, 1, 0));
  }
  function Ho(e) {
    for (; e === dl; ) dl = bn[--On], bn[On] = null, fl = bn[--On], bn[On] = null;
    for (; e === un; ) un = ot[--it], ot[it] = null, Tt = ot[--it], ot[it] = null, Pt = ot[--it], ot[it] = null;
  }
  var tt = null, nt = null, ve = !1, mt = null;
  function Ea(e, t) {
    var n = ct(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function _a(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, tt = e, nt = Ht(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, tt = e, nt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = un !== null ? { id: Pt, overflow: Tt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = ct(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, tt = e, nt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Bo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Wo(e) {
    if (ve) {
      var t = nt;
      if (t) {
        var n = t;
        if (!_a(e, t)) {
          if (Bo(e)) throw Error(a(418));
          t = Ht(n.nextSibling);
          var r = tt;
          t && _a(e, t) ? Ea(r, n) : (e.flags = e.flags & -4097 | 2, ve = !1, tt = e);
        }
      } else {
        if (Bo(e)) throw Error(a(418));
        e.flags = e.flags & -4097 | 2, ve = !1, tt = e;
      }
    }
  }
  function Na(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    tt = e;
  }
  function pl(e) {
    if (e !== tt) return !1;
    if (!ve) return Na(e), ve = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Io(e.type, e.memoizedProps)), t && (t = nt)) {
      if (Bo(e)) throw za(), Error(a(418));
      for (; t; ) Ea(e, t), t = Ht(t.nextSibling);
    }
    if (Na(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(a(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                nt = Ht(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        nt = null;
      }
    } else nt = tt ? Ht(e.stateNode.nextSibling) : null;
    return !0;
  }
  function za() {
    for (var e = nt; e; ) e = Ht(e.nextSibling);
  }
  function In() {
    nt = tt = null, ve = !1;
  }
  function Qo(e) {
    mt === null ? mt = [e] : mt.push(e);
  }
  var nf = ue.ReactCurrentBatchConfig;
  function wr(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(a(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(a(147, e));
        var l = r, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
          var u = l.refs;
          i === null ? delete u[o] : u[o] = i;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(a(284));
      if (!n._owner) throw Error(a(290, e));
    }
    return e;
  }
  function ml(e, t) {
    throw e = Object.prototype.toString.call(t), Error(a(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function ja(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Pa(e) {
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
      return m = en(m, d), m.index = 0, m.sibling = null, m;
    }
    function o(m, d, h) {
      return m.index = h, e ? (h = m.alternate, h !== null ? (h = h.index, h < d ? (m.flags |= 2, d) : h) : (m.flags |= 2, d)) : (m.flags |= 1048576, d);
    }
    function i(m) {
      return e && m.alternate === null && (m.flags |= 2), m;
    }
    function u(m, d, h, j) {
      return d === null || d.tag !== 6 ? (d = Di(h, m.mode, j), d.return = m, d) : (d = l(d, h), d.return = m, d);
    }
    function c(m, d, h, j) {
      var F = h.type;
      return F === Ee ? E(m, d, h.props.children, j, h.key) : d !== null && (d.elementType === F || typeof F == "object" && F !== null && F.$$typeof === ze && ja(F) === d.type) ? (j = l(d, h.props), j.ref = wr(m, d, h), j.return = m, j) : (j = Fl(h.type, h.key, h.props, null, m.mode, j), j.ref = wr(m, d, h), j.return = m, j);
    }
    function g(m, d, h, j) {
      return d === null || d.tag !== 4 || d.stateNode.containerInfo !== h.containerInfo || d.stateNode.implementation !== h.implementation ? (d = Fi(h, m.mode, j), d.return = m, d) : (d = l(d, h.children || []), d.return = m, d);
    }
    function E(m, d, h, j, F) {
      return d === null || d.tag !== 7 ? (d = yn(h, m.mode, j, F), d.return = m, d) : (d = l(d, h), d.return = m, d);
    }
    function _(m, d, h) {
      if (typeof d == "string" && d !== "" || typeof d == "number") return d = Di("" + d, m.mode, h), d.return = m, d;
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case Ne:
            return h = Fl(d.type, d.key, d.props, null, m.mode, h), h.ref = wr(m, null, d), h.return = m, h;
          case ke:
            return d = Fi(d, m.mode, h), d.return = m, d;
          case ze:
            var j = d._init;
            return _(m, j(d._payload), h);
        }
        if (Kn(d) || A(d)) return d = yn(d, m.mode, h, null), d.return = m, d;
        ml(m, d);
      }
      return null;
    }
    function S(m, d, h, j) {
      var F = d !== null ? d.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number") return F !== null ? null : u(m, d, "" + h, j);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Ne:
            return h.key === F ? c(m, d, h, j) : null;
          case ke:
            return h.key === F ? g(m, d, h, j) : null;
          case ze:
            return F = h._init, S(
              m,
              d,
              F(h._payload),
              j
            );
        }
        if (Kn(h) || A(h)) return F !== null ? null : E(m, d, h, j, null);
        ml(m, h);
      }
      return null;
    }
    function T(m, d, h, j, F) {
      if (typeof j == "string" && j !== "" || typeof j == "number") return m = m.get(h) || null, u(d, m, "" + j, F);
      if (typeof j == "object" && j !== null) {
        switch (j.$$typeof) {
          case Ne:
            return m = m.get(j.key === null ? h : j.key) || null, c(d, m, j, F);
          case ke:
            return m = m.get(j.key === null ? h : j.key) || null, g(d, m, j, F);
          case ze:
            var $ = j._init;
            return T(m, d, h, $(j._payload), F);
        }
        if (Kn(j) || A(j)) return m = m.get(h) || null, E(d, m, j, F, null);
        ml(d, j);
      }
      return null;
    }
    function O(m, d, h, j) {
      for (var F = null, $ = null, H = d, Q = d = 0, Me = null; H !== null && Q < h.length; Q++) {
        H.index > Q ? (Me = H, H = null) : Me = H.sibling;
        var oe = S(m, H, h[Q], j);
        if (oe === null) {
          H === null && (H = Me);
          break;
        }
        e && H && oe.alternate === null && t(m, H), d = o(oe, d, Q), $ === null ? F = oe : $.sibling = oe, $ = oe, H = Me;
      }
      if (Q === h.length) return n(m, H), ve && cn(m, Q), F;
      if (H === null) {
        for (; Q < h.length; Q++) H = _(m, h[Q], j), H !== null && (d = o(H, d, Q), $ === null ? F = H : $.sibling = H, $ = H);
        return ve && cn(m, Q), F;
      }
      for (H = r(m, H); Q < h.length; Q++) Me = T(H, m, Q, h[Q], j), Me !== null && (e && Me.alternate !== null && H.delete(Me.key === null ? Q : Me.key), d = o(Me, d, Q), $ === null ? F = Me : $.sibling = Me, $ = Me);
      return e && H.forEach(function(tn) {
        return t(m, tn);
      }), ve && cn(m, Q), F;
    }
    function I(m, d, h, j) {
      var F = A(h);
      if (typeof F != "function") throw Error(a(150));
      if (h = F.call(h), h == null) throw Error(a(151));
      for (var $ = F = null, H = d, Q = d = 0, Me = null, oe = h.next(); H !== null && !oe.done; Q++, oe = h.next()) {
        H.index > Q ? (Me = H, H = null) : Me = H.sibling;
        var tn = S(m, H, oe.value, j);
        if (tn === null) {
          H === null && (H = Me);
          break;
        }
        e && H && tn.alternate === null && t(m, H), d = o(tn, d, Q), $ === null ? F = tn : $.sibling = tn, $ = tn, H = Me;
      }
      if (oe.done) return n(
        m,
        H
      ), ve && cn(m, Q), F;
      if (H === null) {
        for (; !oe.done; Q++, oe = h.next()) oe = _(m, oe.value, j), oe !== null && (d = o(oe, d, Q), $ === null ? F = oe : $.sibling = oe, $ = oe);
        return ve && cn(m, Q), F;
      }
      for (H = r(m, H); !oe.done; Q++, oe = h.next()) oe = T(H, m, Q, oe.value, j), oe !== null && (e && oe.alternate !== null && H.delete(oe.key === null ? Q : oe.key), d = o(oe, d, Q), $ === null ? F = oe : $.sibling = oe, $ = oe);
      return e && H.forEach(function(If) {
        return t(m, If);
      }), ve && cn(m, Q), F;
    }
    function Ce(m, d, h, j) {
      if (typeof h == "object" && h !== null && h.type === Ee && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case Ne:
            e: {
              for (var F = h.key, $ = d; $ !== null; ) {
                if ($.key === F) {
                  if (F = h.type, F === Ee) {
                    if ($.tag === 7) {
                      n(m, $.sibling), d = l($, h.props.children), d.return = m, m = d;
                      break e;
                    }
                  } else if ($.elementType === F || typeof F == "object" && F !== null && F.$$typeof === ze && ja(F) === $.type) {
                    n(m, $.sibling), d = l($, h.props), d.ref = wr(m, $, h), d.return = m, m = d;
                    break e;
                  }
                  n(m, $);
                  break;
                } else t(m, $);
                $ = $.sibling;
              }
              h.type === Ee ? (d = yn(h.props.children, m.mode, j, h.key), d.return = m, m = d) : (j = Fl(h.type, h.key, h.props, null, m.mode, j), j.ref = wr(m, d, h), j.return = m, m = j);
            }
            return i(m);
          case ke:
            e: {
              for ($ = h.key; d !== null; ) {
                if (d.key === $) if (d.tag === 4 && d.stateNode.containerInfo === h.containerInfo && d.stateNode.implementation === h.implementation) {
                  n(m, d.sibling), d = l(d, h.children || []), d.return = m, m = d;
                  break e;
                } else {
                  n(m, d);
                  break;
                }
                else t(m, d);
                d = d.sibling;
              }
              d = Fi(h, m.mode, j), d.return = m, m = d;
            }
            return i(m);
          case ze:
            return $ = h._init, Ce(m, d, $(h._payload), j);
        }
        if (Kn(h)) return O(m, d, h, j);
        if (A(h)) return I(m, d, h, j);
        ml(m, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" ? (h = "" + h, d !== null && d.tag === 6 ? (n(m, d.sibling), d = l(d, h), d.return = m, m = d) : (n(m, d), d = Di(h, m.mode, j), d.return = m, m = d), i(m)) : n(m, d);
    }
    return Ce;
  }
  var Dn = Pa(!0), Ta = Pa(!1), hl = Bt(null), gl = null, Fn = null, Go = null;
  function Ko() {
    Go = Fn = gl = null;
  }
  function Yo(e) {
    var t = hl.current;
    me(hl), e._currentValue = t;
  }
  function Xo(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function An(e, t) {
    gl = e, Go = Fn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ge = !0), e.firstContext = null);
  }
  function st(e) {
    var t = e._currentValue;
    if (Go !== e) if (e = { context: e, memoizedValue: t, next: null }, Fn === null) {
      if (gl === null) throw Error(a(308));
      Fn = e, gl.dependencies = { lanes: 0, firstContext: e };
    } else Fn = Fn.next = e;
    return t;
  }
  var dn = null;
  function Zo(e) {
    dn === null ? dn = [e] : dn.push(e);
  }
  function Ra(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Zo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Rt(e, r);
  }
  function Rt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Gt = !1;
  function qo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Ma(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Mt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Kt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (ne & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Rt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Zo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Rt(e, n);
  }
  function vl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, fo(e, n);
    }
  }
  function La(e, t) {
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
  function yl(e, t, n, r) {
    var l = e.updateQueue;
    Gt = !1;
    var o = l.firstBaseUpdate, i = l.lastBaseUpdate, u = l.shared.pending;
    if (u !== null) {
      l.shared.pending = null;
      var c = u, g = c.next;
      c.next = null, i === null ? o = g : i.next = g, i = c;
      var E = e.alternate;
      E !== null && (E = E.updateQueue, u = E.lastBaseUpdate, u !== i && (u === null ? E.firstBaseUpdate = g : u.next = g, E.lastBaseUpdate = c));
    }
    if (o !== null) {
      var _ = l.baseState;
      i = 0, E = g = c = null, u = o;
      do {
        var S = u.lane, T = u.eventTime;
        if ((r & S) === S) {
          E !== null && (E = E.next = {
            eventTime: T,
            lane: 0,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null
          });
          e: {
            var O = e, I = u;
            switch (S = t, T = n, I.tag) {
              case 1:
                if (O = I.payload, typeof O == "function") {
                  _ = O.call(T, _, S);
                  break e;
                }
                _ = O;
                break e;
              case 3:
                O.flags = O.flags & -65537 | 128;
              case 0:
                if (O = I.payload, S = typeof O == "function" ? O.call(T, _, S) : O, S == null) break e;
                _ = R({}, _, S);
                break e;
              case 2:
                Gt = !0;
            }
          }
          u.callback !== null && u.lane !== 0 && (e.flags |= 64, S = l.effects, S === null ? l.effects = [u] : S.push(u));
        } else T = { eventTime: T, lane: S, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, E === null ? (g = E = T, c = _) : E = E.next = T, i |= S;
        if (u = u.next, u === null) {
          if (u = l.shared.pending, u === null) break;
          S = u, u = S.next, S.next = null, l.lastBaseUpdate = S, l.shared.pending = null;
        }
      } while (!0);
      if (E === null && (c = _), l.baseState = c, l.firstBaseUpdate = g, l.lastBaseUpdate = E, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      mn |= i, e.lanes = i, e.memoizedState = _;
    }
  }
  function ba(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(a(191, l));
        l.call(r);
      }
    }
  }
  var xr = {}, St = Bt(xr), kr = Bt(xr), Sr = Bt(xr);
  function fn(e) {
    if (e === xr) throw Error(a(174));
    return e;
  }
  function Jo(e, t) {
    switch (de(Sr, t), de(kr, e), de(St, xr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Jl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Jl(t, e);
    }
    me(St), de(St, t);
  }
  function Un() {
    me(St), me(kr), me(Sr);
  }
  function Oa(e) {
    fn(Sr.current);
    var t = fn(St.current), n = Jl(t, e.type);
    t !== n && (de(kr, e), de(St, n));
  }
  function ei(e) {
    kr.current === e && (me(St), me(kr));
  }
  var ye = Bt(0);
  function wl(e) {
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
  var ti = [];
  function ni() {
    for (var e = 0; e < ti.length; e++) ti[e]._workInProgressVersionPrimary = null;
    ti.length = 0;
  }
  var xl = ue.ReactCurrentDispatcher, ri = ue.ReactCurrentBatchConfig, pn = 0, we = null, je = null, Te = null, kl = !1, Cr = !1, Er = 0, rf = 0;
  function Ae() {
    throw Error(a(321));
  }
  function li(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!pt(e[n], t[n])) return !1;
    return !0;
  }
  function oi(e, t, n, r, l, o) {
    if (pn = o, we = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, xl.current = e === null || e.memoizedState === null ? af : uf, e = n(r, l), Cr) {
      o = 0;
      do {
        if (Cr = !1, Er = 0, 25 <= o) throw Error(a(301));
        o += 1, Te = je = null, t.updateQueue = null, xl.current = cf, e = n(r, l);
      } while (Cr);
    }
    if (xl.current = El, t = je !== null && je.next !== null, pn = 0, Te = je = we = null, kl = !1, t) throw Error(a(300));
    return e;
  }
  function ii() {
    var e = Er !== 0;
    return Er = 0, e;
  }
  function Ct() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Te === null ? we.memoizedState = Te = e : Te = Te.next = e, Te;
  }
  function at() {
    if (je === null) {
      var e = we.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = je.next;
    var t = Te === null ? we.memoizedState : Te.next;
    if (t !== null) Te = t, je = e;
    else {
      if (e === null) throw Error(a(310));
      je = e, e = { memoizedState: je.memoizedState, baseState: je.baseState, baseQueue: je.baseQueue, queue: je.queue, next: null }, Te === null ? we.memoizedState = Te = e : Te = Te.next = e;
    }
    return Te;
  }
  function _r(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function si(e) {
    var t = at(), n = t.queue;
    if (n === null) throw Error(a(311));
    n.lastRenderedReducer = e;
    var r = je, l = r.baseQueue, o = n.pending;
    if (o !== null) {
      if (l !== null) {
        var i = l.next;
        l.next = o.next, o.next = i;
      }
      r.baseQueue = l = o, n.pending = null;
    }
    if (l !== null) {
      o = l.next, r = r.baseState;
      var u = i = null, c = null, g = o;
      do {
        var E = g.lane;
        if ((pn & E) === E) c !== null && (c = c.next = { lane: 0, action: g.action, hasEagerState: g.hasEagerState, eagerState: g.eagerState, next: null }), r = g.hasEagerState ? g.eagerState : e(r, g.action);
        else {
          var _ = {
            lane: E,
            action: g.action,
            hasEagerState: g.hasEagerState,
            eagerState: g.eagerState,
            next: null
          };
          c === null ? (u = c = _, i = r) : c = c.next = _, we.lanes |= E, mn |= E;
        }
        g = g.next;
      } while (g !== null && g !== o);
      c === null ? i = r : c.next = u, pt(r, t.memoizedState) || (Ge = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = c, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, we.lanes |= o, mn |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function ai(e) {
    var t = at(), n = t.queue;
    if (n === null) throw Error(a(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, o = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var i = l = l.next;
      do
        o = e(o, i.action), i = i.next;
      while (i !== l);
      pt(o, t.memoizedState) || (Ge = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
    }
    return [o, r];
  }
  function Ia() {
  }
  function Da(e, t) {
    var n = we, r = at(), l = t(), o = !pt(r.memoizedState, l);
    if (o && (r.memoizedState = l, Ge = !0), r = r.queue, ui(Ua.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || Te !== null && Te.memoizedState.tag & 1) {
      if (n.flags |= 2048, Nr(9, Aa.bind(null, n, r, l, t), void 0, null), Re === null) throw Error(a(349));
      (pn & 30) !== 0 || Fa(n, t, l);
    }
    return l;
  }
  function Fa(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = we.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, we.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Aa(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Va(t) && $a(e);
  }
  function Ua(e, t, n) {
    return n(function() {
      Va(t) && $a(e);
    });
  }
  function Va(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !pt(e, n);
    } catch {
      return !0;
    }
  }
  function $a(e) {
    var t = Rt(e, 1);
    t !== null && yt(t, e, 1, -1);
  }
  function Ha(e) {
    var t = Ct();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: _r, lastRenderedState: e }, t.queue = e, e = e.dispatch = sf.bind(null, we, e), [t.memoizedState, e];
  }
  function Nr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = we.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, we.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Ba() {
    return at().memoizedState;
  }
  function Sl(e, t, n, r) {
    var l = Ct();
    we.flags |= e, l.memoizedState = Nr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function Cl(e, t, n, r) {
    var l = at();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (je !== null) {
      var i = je.memoizedState;
      if (o = i.destroy, r !== null && li(r, i.deps)) {
        l.memoizedState = Nr(t, n, o, r);
        return;
      }
    }
    we.flags |= e, l.memoizedState = Nr(1 | t, n, o, r);
  }
  function Wa(e, t) {
    return Sl(8390656, 8, e, t);
  }
  function ui(e, t) {
    return Cl(2048, 8, e, t);
  }
  function Qa(e, t) {
    return Cl(4, 2, e, t);
  }
  function Ga(e, t) {
    return Cl(4, 4, e, t);
  }
  function Ka(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Ya(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Cl(4, 4, Ka.bind(null, t, e), n);
  }
  function ci() {
  }
  function Xa(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && li(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Za(e, t) {
    var n = at();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && li(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function qa(e, t, n) {
    return (pn & 21) === 0 ? (e.baseState && (e.baseState = !1, Ge = !0), e.memoizedState = n) : (pt(n, t) || (n = js(), we.lanes |= n, mn |= n, e.baseState = !0), t);
  }
  function lf(e, t) {
    var n = ae;
    ae = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = ri.transition;
    ri.transition = {};
    try {
      e(!1), t();
    } finally {
      ae = n, ri.transition = r;
    }
  }
  function Ja() {
    return at().memoizedState;
  }
  function of(e, t, n) {
    var r = qt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, eu(e)) tu(t, n);
    else if (n = Ra(e, t, n, r), n !== null) {
      var l = Be();
      yt(n, e, r, l), nu(n, t, r);
    }
  }
  function sf(e, t, n) {
    var r = qt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (eu(e)) tu(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, u = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = u, pt(u, i)) {
          var c = t.interleaved;
          c === null ? (l.next = l, Zo(t)) : (l.next = c.next, c.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = Ra(e, t, l, r), n !== null && (l = Be(), yt(n, e, r, l), nu(n, t, r));
    }
  }
  function eu(e) {
    var t = e.alternate;
    return e === we || t !== null && t === we;
  }
  function tu(e, t) {
    Cr = kl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function nu(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, fo(e, n);
    }
  }
  var El = { readContext: st, useCallback: Ae, useContext: Ae, useEffect: Ae, useImperativeHandle: Ae, useInsertionEffect: Ae, useLayoutEffect: Ae, useMemo: Ae, useReducer: Ae, useRef: Ae, useState: Ae, useDebugValue: Ae, useDeferredValue: Ae, useTransition: Ae, useMutableSource: Ae, useSyncExternalStore: Ae, useId: Ae, unstable_isNewReconciler: !1 }, af = { readContext: st, useCallback: function(e, t) {
    return Ct().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: st, useEffect: Wa, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Sl(
      4194308,
      4,
      Ka.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return Sl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Sl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = Ct();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = Ct();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = of.bind(null, we, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Ct();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Ha, useDebugValue: ci, useDeferredValue: function(e) {
    return Ct().memoizedState = e;
  }, useTransition: function() {
    var e = Ha(!1), t = e[0];
    return e = lf.bind(null, e[1]), Ct().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = we, l = Ct();
    if (ve) {
      if (n === void 0) throw Error(a(407));
      n = n();
    } else {
      if (n = t(), Re === null) throw Error(a(349));
      (pn & 30) !== 0 || Fa(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, Wa(Ua.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, Nr(9, Aa.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = Ct(), t = Re.identifierPrefix;
    if (ve) {
      var n = Tt, r = Pt;
      n = (r & ~(1 << 32 - ft(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Er++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = rf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, uf = {
    readContext: st,
    useCallback: Xa,
    useContext: st,
    useEffect: ui,
    useImperativeHandle: Ya,
    useInsertionEffect: Qa,
    useLayoutEffect: Ga,
    useMemo: Za,
    useReducer: si,
    useRef: Ba,
    useState: function() {
      return si(_r);
    },
    useDebugValue: ci,
    useDeferredValue: function(e) {
      var t = at();
      return qa(t, je.memoizedState, e);
    },
    useTransition: function() {
      var e = si(_r)[0], t = at().memoizedState;
      return [e, t];
    },
    useMutableSource: Ia,
    useSyncExternalStore: Da,
    useId: Ja,
    unstable_isNewReconciler: !1
  }, cf = { readContext: st, useCallback: Xa, useContext: st, useEffect: ui, useImperativeHandle: Ya, useInsertionEffect: Qa, useLayoutEffect: Ga, useMemo: Za, useReducer: ai, useRef: Ba, useState: function() {
    return ai(_r);
  }, useDebugValue: ci, useDeferredValue: function(e) {
    var t = at();
    return je === null ? t.memoizedState = e : qa(t, je.memoizedState, e);
  }, useTransition: function() {
    var e = ai(_r)[0], t = at().memoizedState;
    return [e, t];
  }, useMutableSource: Ia, useSyncExternalStore: Da, useId: Ja, unstable_isNewReconciler: !1 };
  function ht(e, t) {
    if (e && e.defaultProps) {
      t = R({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function di(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : R({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var _l = { isMounted: function(e) {
    return (e = e._reactInternals) ? on(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = Be(), l = qt(e), o = Mt(r, l);
    o.payload = t, n != null && (o.callback = n), t = Kt(e, o, l), t !== null && (yt(t, e, l, r), vl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Be(), l = qt(e), o = Mt(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Kt(e, o, l), t !== null && (yt(t, e, l, r), vl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Be(), r = qt(e), l = Mt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Kt(e, l, r), t !== null && (yt(t, e, r, n), vl(t, e, r));
  } };
  function ru(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !fr(n, r) || !fr(l, o) : !0;
  }
  function lu(e, t, n) {
    var r = !1, l = Wt, o = t.contextType;
    return typeof o == "object" && o !== null ? o = st(o) : (l = Qe(t) ? an : Fe.current, r = t.contextTypes, o = (r = r != null) ? Ln(e, l) : Wt), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = _l, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function ou(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && _l.enqueueReplaceState(t, t.state, null);
  }
  function fi(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, qo(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = st(o) : (o = Qe(t) ? an : Fe.current, l.context = Ln(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (di(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && _l.enqueueReplaceState(l, l.state, null), yl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Vn(e, t) {
    try {
      var n = "", r = t;
      do
        n += re(r), r = r.return;
      while (r);
      var l = n;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function pi(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function mi(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var df = typeof WeakMap == "function" ? WeakMap : Map;
  function iu(e, t, n) {
    n = Mt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Ml || (Ml = !0, Pi = r), mi(e, t);
    }, n;
  }
  function su(e, t, n) {
    n = Mt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        mi(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      mi(e, t), typeof r != "function" && (Xt === null ? Xt = /* @__PURE__ */ new Set([this]) : Xt.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function au(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new df();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = _f.bind(null, e, t, n), t.then(e, e));
  }
  function uu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function cu(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Mt(-1, 1), t.tag = 2, Kt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var ff = ue.ReactCurrentOwner, Ge = !1;
  function He(e, t, n, r) {
    t.child = e === null ? Ta(t, null, n, r) : Dn(t, e.child, n, r);
  }
  function du(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return An(t, l), r = oi(e, t, n, r, o, l), n = ii(), e !== null && !Ge ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Lt(e, t, l)) : (ve && n && $o(t), t.flags |= 1, He(e, t, r, l), t.child);
  }
  function fu(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !Ii(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, pu(e, t, o, r, l)) : (e = Fl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : fr, n(i, r) && e.ref === t.ref) return Lt(e, t, l);
    }
    return t.flags |= 1, e = en(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function pu(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (fr(o, r) && e.ref === t.ref) if (Ge = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ge = !0);
      else return t.lanes = e.lanes, Lt(e, t, l);
    }
    return hi(e, t, n, r, l);
  }
  function mu(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, de(Hn, rt), rt |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, de(Hn, rt), rt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, de(Hn, rt), rt |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, de(Hn, rt), rt |= r;
    return He(e, t, l, n), t.child;
  }
  function hu(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function hi(e, t, n, r, l) {
    var o = Qe(n) ? an : Fe.current;
    return o = Ln(t, o), An(t, l), n = oi(e, t, n, r, o, l), r = ii(), e !== null && !Ge ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Lt(e, t, l)) : (ve && r && $o(t), t.flags |= 1, He(e, t, n, l), t.child);
  }
  function gu(e, t, n, r, l) {
    if (Qe(n)) {
      var o = !0;
      ul(t);
    } else o = !1;
    if (An(t, l), t.stateNode === null) zl(e, t), lu(t, n, r), fi(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, u = t.memoizedProps;
      i.props = u;
      var c = i.context, g = n.contextType;
      typeof g == "object" && g !== null ? g = st(g) : (g = Qe(n) ? an : Fe.current, g = Ln(t, g));
      var E = n.getDerivedStateFromProps, _ = typeof E == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      _ || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== r || c !== g) && ou(t, i, r, g), Gt = !1;
      var S = t.memoizedState;
      i.state = S, yl(t, r, i, l), c = t.memoizedState, u !== r || S !== c || We.current || Gt ? (typeof E == "function" && (di(t, n, E, r), c = t.memoizedState), (u = Gt || ru(t, n, u, r, S, c, g)) ? (_ || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = c), i.props = r, i.state = c, i.context = g, r = u) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, Ma(e, t), u = t.memoizedProps, g = t.type === t.elementType ? u : ht(t.type, u), i.props = g, _ = t.pendingProps, S = i.context, c = n.contextType, typeof c == "object" && c !== null ? c = st(c) : (c = Qe(n) ? an : Fe.current, c = Ln(t, c));
      var T = n.getDerivedStateFromProps;
      (E = typeof T == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== _ || S !== c) && ou(t, i, r, c), Gt = !1, S = t.memoizedState, i.state = S, yl(t, r, i, l);
      var O = t.memoizedState;
      u !== _ || S !== O || We.current || Gt ? (typeof T == "function" && (di(t, n, T, r), O = t.memoizedState), (g = Gt || ru(t, n, g, r, S, O, c) || !1) ? (E || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, O, c), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, O, c)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && S === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && S === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = O), i.props = r, i.state = O, i.context = c, r = g) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && S === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && S === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return gi(e, t, n, r, o, l);
  }
  function gi(e, t, n, r, l, o) {
    hu(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && ka(t, n, !1), Lt(e, t, o);
    r = t.stateNode, ff.current = t;
    var u = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = Dn(t, e.child, null, o), t.child = Dn(t, null, u, o)) : He(e, t, u, o), t.memoizedState = r.state, l && ka(t, n, !0), t.child;
  }
  function vu(e) {
    var t = e.stateNode;
    t.pendingContext ? wa(e, t.pendingContext, t.pendingContext !== t.context) : t.context && wa(e, t.context, !1), Jo(e, t.containerInfo);
  }
  function yu(e, t, n, r, l) {
    return In(), Qo(l), t.flags |= 256, He(e, t, n, r), t.child;
  }
  var vi = { dehydrated: null, treeContext: null, retryLane: 0 };
  function yi(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function wu(e, t, n) {
    var r = t.pendingProps, l = ye.current, o = !1, i = (t.flags & 128) !== 0, u;
    if ((u = i) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), de(ye, l & 1), e === null)
      return Wo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = Al(i, r, 0, null), e = yn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = yi(n), t.memoizedState = vi, e) : wi(t, i));
    if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return pf(e, t, i, r, u, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, u = l.sibling;
      var c = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = c, t.deletions = null) : (r = en(l, c), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? o = en(u, o) : (o = yn(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? yi(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = vi, r;
    }
    return o = e.child, e = o.sibling, r = en(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function wi(e, t) {
    return t = Al({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Nl(e, t, n, r) {
    return r !== null && Qo(r), Dn(t, e.child, null, n), e = wi(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function pf(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = pi(Error(a(422))), Nl(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = Al({ mode: "visible", children: r.children }, l, 0, null), o = yn(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && Dn(t, e.child, null, i), t.child.memoizedState = yi(i), t.memoizedState = vi, o);
    if ((t.mode & 1) === 0) return Nl(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
      return r = u, o = Error(a(419)), r = pi(o, r, void 0), Nl(e, t, i, r);
    }
    if (u = (i & e.childLanes) !== 0, Ge || u) {
      if (r = Re, r !== null) {
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
        l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Rt(e, l), yt(r, e, l, -1));
      }
      return Oi(), r = pi(Error(a(421))), Nl(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Nf.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, nt = Ht(l.nextSibling), tt = t, ve = !0, mt = null, e !== null && (ot[it++] = Pt, ot[it++] = Tt, ot[it++] = un, Pt = e.id, Tt = e.overflow, un = t), t = wi(t, r.children), t.flags |= 4096, t);
  }
  function xu(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Xo(e.return, t, n);
  }
  function xi(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function ku(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (He(e, t, r.children, n), r = ye.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && xu(e, n, t);
        else if (e.tag === 19) xu(e, n, t);
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
    if (de(ye, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && wl(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), xi(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && wl(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        xi(t, !0, n, null, o);
        break;
      case "together":
        xi(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function zl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Lt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), mn |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(a(153));
    if (t.child !== null) {
      for (e = t.child, n = en(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = en(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function mf(e, t, n) {
    switch (t.tag) {
      case 3:
        vu(t), In();
        break;
      case 5:
        Oa(t);
        break;
      case 1:
        Qe(t.type) && ul(t);
        break;
      case 4:
        Jo(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        de(hl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (de(ye, ye.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? wu(e, t, n) : (de(ye, ye.current & 1), e = Lt(e, t, n), e !== null ? e.sibling : null);
        de(ye, ye.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return ku(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), de(ye, ye.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, mu(e, t, n);
    }
    return Lt(e, t, n);
  }
  var Su, ki, Cu, Eu;
  Su = function(e, t) {
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
  }, ki = function() {
  }, Cu = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, fn(St.current);
      var o = null;
      switch (n) {
        case "input":
          l = Yl(e, l), r = Yl(e, r), o = [];
          break;
        case "select":
          l = R({}, l, { value: void 0 }), r = R({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = ql(e, l), r = ql(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = il);
      }
      eo(n, r);
      var i;
      n = null;
      for (g in l) if (!r.hasOwnProperty(g) && l.hasOwnProperty(g) && l[g] != null) if (g === "style") {
        var u = l[g];
        for (i in u) u.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else g !== "dangerouslySetInnerHTML" && g !== "children" && g !== "suppressContentEditableWarning" && g !== "suppressHydrationWarning" && g !== "autoFocus" && (k.hasOwnProperty(g) ? o || (o = []) : (o = o || []).push(g, null));
      for (g in r) {
        var c = r[g];
        if (u = l != null ? l[g] : void 0, r.hasOwnProperty(g) && c !== u && (c != null || u != null)) if (g === "style") if (u) {
          for (i in u) !u.hasOwnProperty(i) || c && c.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in c) c.hasOwnProperty(i) && u[i] !== c[i] && (n || (n = {}), n[i] = c[i]);
        } else n || (o || (o = []), o.push(
          g,
          n
        )), n = c;
        else g === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, u = u ? u.__html : void 0, c != null && u !== c && (o = o || []).push(g, c)) : g === "children" ? typeof c != "string" && typeof c != "number" || (o = o || []).push(g, "" + c) : g !== "suppressContentEditableWarning" && g !== "suppressHydrationWarning" && (k.hasOwnProperty(g) ? (c != null && g === "onScroll" && pe("scroll", e), o || u === c || (o = [])) : (o = o || []).push(g, c));
      }
      n && (o = o || []).push("style", n);
      var g = o;
      (t.updateQueue = g) && (t.flags |= 4);
    }
  }, Eu = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function zr(e, t) {
    if (!ve) switch (e.tailMode) {
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
  function hf(e, t, n) {
    var r = t.pendingProps;
    switch (Ho(t), t.tag) {
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
        return Qe(t.type) && al(), Ue(t), null;
      case 3:
        return r = t.stateNode, Un(), me(We), me(Fe), ni(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (pl(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (Mi(mt), mt = null))), ki(e, t), Ue(t), null;
      case 5:
        ei(t);
        var l = fn(Sr.current);
        if (n = t.type, e !== null && t.stateNode != null) Cu(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(a(166));
            return Ue(t), null;
          }
          if (e = fn(St.current), pl(t)) {
            r = t.stateNode, n = t.type;
            var o = t.memoizedProps;
            switch (r[kt] = t, r[vr] = o, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                pe("cancel", r), pe("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                pe("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < mr.length; l++) pe(mr[l], r);
                break;
              case "source":
                pe("error", r);
                break;
              case "img":
              case "image":
              case "link":
                pe(
                  "error",
                  r
                ), pe("load", r);
                break;
              case "details":
                pe("toggle", r);
                break;
              case "input":
                ls(r, o), pe("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, pe("invalid", r);
                break;
              case "textarea":
                ss(r, o), pe("invalid", r);
            }
            eo(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var u = o[i];
              i === "children" ? typeof u == "string" ? r.textContent !== u && (o.suppressHydrationWarning !== !0 && ol(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (o.suppressHydrationWarning !== !0 && ol(
                r.textContent,
                u,
                e
              ), l = ["children", "" + u]) : k.hasOwnProperty(i) && u != null && i === "onScroll" && pe("scroll", r);
            }
            switch (n) {
              case "input":
                Ir(r), is(r, o, !0);
                break;
              case "textarea":
                Ir(r), us(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = il);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = cs(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[kt] = t, e[vr] = r, Su(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = to(n, r), n) {
                case "dialog":
                  pe("cancel", e), pe("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  pe("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < mr.length; l++) pe(mr[l], e);
                  l = r;
                  break;
                case "source":
                  pe("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  pe(
                    "error",
                    e
                  ), pe("load", e), l = r;
                  break;
                case "details":
                  pe("toggle", e), l = r;
                  break;
                case "input":
                  ls(e, r), l = Yl(e, r), pe("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = R({}, r, { value: void 0 }), pe("invalid", e);
                  break;
                case "textarea":
                  ss(e, r), l = ql(e, r), pe("invalid", e);
                  break;
                default:
                  l = r;
              }
              eo(n, l), u = l;
              for (o in u) if (u.hasOwnProperty(o)) {
                var c = u[o];
                o === "style" ? ps(e, c) : o === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && ds(e, c)) : o === "children" ? typeof c == "string" ? (n !== "textarea" || c !== "") && Yn(e, c) : typeof c == "number" && Yn(e, "" + c) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (k.hasOwnProperty(o) ? c != null && o === "onScroll" && pe("scroll", e) : c != null && K(e, o, c, i));
              }
              switch (n) {
                case "input":
                  Ir(e), is(e, r, !1);
                  break;
                case "textarea":
                  Ir(e), us(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + se(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? kn(e, !!r.multiple, o, !1) : r.defaultValue != null && kn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = il);
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
        if (e && t.stateNode != null) Eu(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(a(166));
          if (n = fn(Sr.current), fn(St.current), pl(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[kt] = t, (o = r.nodeValue !== n) && (e = tt, e !== null)) switch (e.tag) {
              case 3:
                ol(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && ol(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[kt] = t, t.stateNode = r;
        }
        return Ue(t), null;
      case 13:
        if (me(ye), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ve && nt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) za(), In(), t.flags |= 98560, o = !1;
          else if (o = pl(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(a(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(a(317));
              o[kt] = t;
            } else In(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ue(t), o = !1;
          } else mt !== null && (Mi(mt), mt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ye.current & 1) !== 0 ? Pe === 0 && (Pe = 3) : Oi())), t.updateQueue !== null && (t.flags |= 4), Ue(t), null);
      case 4:
        return Un(), ki(e, t), e === null && hr(t.stateNode.containerInfo), Ue(t), null;
      case 10:
        return Yo(t.type._context), Ue(t), null;
      case 17:
        return Qe(t.type) && al(), Ue(t), null;
      case 19:
        if (me(ye), o = t.memoizedState, o === null) return Ue(t), null;
        if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) zr(o, !1);
        else {
          if (Pe !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (i = wl(e), i !== null) {
              for (t.flags |= 128, zr(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return de(ye, ye.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && Se() > Bn && (t.flags |= 128, r = !0, zr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = wl(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), zr(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !ve) return Ue(t), null;
          } else 2 * Se() - o.renderingStartTime > Bn && n !== 1073741824 && (t.flags |= 128, r = !0, zr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Se(), t.sibling = null, n = ye.current, de(ye, r ? n & 1 | 2 : n & 1), t) : (Ue(t), null);
      case 22:
      case 23:
        return bi(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (rt & 1073741824) !== 0 && (Ue(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ue(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(a(156, t.tag));
  }
  function gf(e, t) {
    switch (Ho(t), t.tag) {
      case 1:
        return Qe(t.type) && al(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Un(), me(We), me(Fe), ni(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return ei(t), null;
      case 13:
        if (me(ye), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(a(340));
          In();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return me(ye), null;
      case 4:
        return Un(), null;
      case 10:
        return Yo(t.type._context), null;
      case 22:
      case 23:
        return bi(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var jl = !1, Ve = !1, vf = typeof WeakSet == "function" ? WeakSet : Set, M = null;
  function $n(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      xe(e, t, r);
    }
    else n.current = null;
  }
  function Si(e, t, n) {
    try {
      n();
    } catch (r) {
      xe(e, t, r);
    }
  }
  var _u = !1;
  function yf(e, t) {
    if (bo = Kr, e = ra(), No(e)) {
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
          var i = 0, u = -1, c = -1, g = 0, E = 0, _ = e, S = null;
          t: for (; ; ) {
            for (var T; _ !== n || l !== 0 && _.nodeType !== 3 || (u = i + l), _ !== o || r !== 0 && _.nodeType !== 3 || (c = i + r), _.nodeType === 3 && (i += _.nodeValue.length), (T = _.firstChild) !== null; )
              S = _, _ = T;
            for (; ; ) {
              if (_ === e) break t;
              if (S === n && ++g === l && (u = i), S === o && ++E === r && (c = i), (T = _.nextSibling) !== null) break;
              _ = S, S = _.parentNode;
            }
            _ = T;
          }
          n = u === -1 || c === -1 ? null : { start: u, end: c };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Oo = { focusedElem: e, selectionRange: n }, Kr = !1, M = t; M !== null; ) if (t = M, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, M = e;
    else for (; M !== null; ) {
      t = M;
      try {
        var O = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (O !== null) {
              var I = O.memoizedProps, Ce = O.memoizedState, m = t.stateNode, d = m.getSnapshotBeforeUpdate(t.elementType === t.type ? I : ht(t.type, I), Ce);
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
            throw Error(a(163));
        }
      } catch (j) {
        xe(t, t.return, j);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, M = e;
        break;
      }
      M = t.return;
    }
    return O = _u, _u = !1, O;
  }
  function jr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && Si(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Pl(e, t) {
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
  function Ci(e) {
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
  function Nu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Nu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[kt], delete t[vr], delete t[Ao], delete t[Jd], delete t[ef])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function zu(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function ju(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || zu(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Ei(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = il));
    else if (r !== 4 && (e = e.child, e !== null)) for (Ei(e, t, n), e = e.sibling; e !== null; ) Ei(e, t, n), e = e.sibling;
  }
  function _i(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (_i(e, t, n), e = e.sibling; e !== null; ) _i(e, t, n), e = e.sibling;
  }
  var be = null, gt = !1;
  function Yt(e, t, n) {
    for (n = n.child; n !== null; ) Pu(e, t, n), n = n.sibling;
  }
  function Pu(e, t, n) {
    if (xt && typeof xt.onCommitFiberUnmount == "function") try {
      xt.onCommitFiberUnmount($r, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Ve || $n(n, t);
      case 6:
        var r = be, l = gt;
        be = null, Yt(e, t, n), be = r, gt = l, be !== null && (gt ? (e = be, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : be.removeChild(n.stateNode));
        break;
      case 18:
        be !== null && (gt ? (e = be, n = n.stateNode, e.nodeType === 8 ? Fo(e.parentNode, n) : e.nodeType === 1 && Fo(e, n), ir(e)) : Fo(be, n.stateNode));
        break;
      case 4:
        r = be, l = gt, be = n.stateNode.containerInfo, gt = !0, Yt(e, t, n), be = r, gt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Ve && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, i = o.destroy;
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && Si(n, t, i), l = l.next;
          } while (l !== r);
        }
        Yt(e, t, n);
        break;
      case 1:
        if (!Ve && ($n(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (u) {
          xe(n, t, u);
        }
        Yt(e, t, n);
        break;
      case 21:
        Yt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Ve = (r = Ve) || n.memoizedState !== null, Yt(e, t, n), Ve = r) : Yt(e, t, n);
        break;
      default:
        Yt(e, t, n);
    }
  }
  function Tu(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new vf()), t.forEach(function(r) {
        var l = zf.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function vt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var o = e, i = t, u = i;
        e: for (; u !== null; ) {
          switch (u.tag) {
            case 5:
              be = u.stateNode, gt = !1;
              break e;
            case 3:
              be = u.stateNode.containerInfo, gt = !0;
              break e;
            case 4:
              be = u.stateNode.containerInfo, gt = !0;
              break e;
          }
          u = u.return;
        }
        if (be === null) throw Error(a(160));
        Pu(o, i, l), be = null, gt = !1;
        var c = l.alternate;
        c !== null && (c.return = null), l.return = null;
      } catch (g) {
        xe(l, t, g);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Ru(t, e), t = t.sibling;
  }
  function Ru(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (vt(t, e), Et(e), r & 4) {
          try {
            jr(3, e, e.return), Pl(3, e);
          } catch (I) {
            xe(e, e.return, I);
          }
          try {
            jr(5, e, e.return);
          } catch (I) {
            xe(e, e.return, I);
          }
        }
        break;
      case 1:
        vt(t, e), Et(e), r & 512 && n !== null && $n(n, n.return);
        break;
      case 5:
        if (vt(t, e), Et(e), r & 512 && n !== null && $n(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Yn(l, "");
          } catch (I) {
            xe(e, e.return, I);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, u = e.type, c = e.updateQueue;
          if (e.updateQueue = null, c !== null) try {
            u === "input" && o.type === "radio" && o.name != null && os(l, o), to(u, i);
            var g = to(u, o);
            for (i = 0; i < c.length; i += 2) {
              var E = c[i], _ = c[i + 1];
              E === "style" ? ps(l, _) : E === "dangerouslySetInnerHTML" ? ds(l, _) : E === "children" ? Yn(l, _) : K(l, E, _, g);
            }
            switch (u) {
              case "input":
                Xl(l, o);
                break;
              case "textarea":
                as(l, o);
                break;
              case "select":
                var S = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var T = o.value;
                T != null ? kn(l, !!o.multiple, T, !1) : S !== !!o.multiple && (o.defaultValue != null ? kn(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : kn(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[vr] = o;
          } catch (I) {
            xe(e, e.return, I);
          }
        }
        break;
      case 6:
        if (vt(t, e), Et(e), r & 4) {
          if (e.stateNode === null) throw Error(a(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (I) {
            xe(e, e.return, I);
          }
        }
        break;
      case 3:
        if (vt(t, e), Et(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          ir(t.containerInfo);
        } catch (I) {
          xe(e, e.return, I);
        }
        break;
      case 4:
        vt(t, e), Et(e);
        break;
      case 13:
        vt(t, e), Et(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (ji = Se())), r & 4 && Tu(e);
        break;
      case 22:
        if (E = n !== null && n.memoizedState !== null, e.mode & 1 ? (Ve = (g = Ve) || E, vt(t, e), Ve = g) : vt(t, e), Et(e), r & 8192) {
          if (g = e.memoizedState !== null, (e.stateNode.isHidden = g) && !E && (e.mode & 1) !== 0) for (M = e, E = e.child; E !== null; ) {
            for (_ = M = E; M !== null; ) {
              switch (S = M, T = S.child, S.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  jr(4, S, S.return);
                  break;
                case 1:
                  $n(S, S.return);
                  var O = S.stateNode;
                  if (typeof O.componentWillUnmount == "function") {
                    r = S, n = S.return;
                    try {
                      t = r, O.props = t.memoizedProps, O.state = t.memoizedState, O.componentWillUnmount();
                    } catch (I) {
                      xe(r, n, I);
                    }
                  }
                  break;
                case 5:
                  $n(S, S.return);
                  break;
                case 22:
                  if (S.memoizedState !== null) {
                    bu(_);
                    continue;
                  }
              }
              T !== null ? (T.return = S, M = T) : bu(_);
            }
            E = E.sibling;
          }
          e: for (E = null, _ = e; ; ) {
            if (_.tag === 5) {
              if (E === null) {
                E = _;
                try {
                  l = _.stateNode, g ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (u = _.stateNode, c = _.memoizedProps.style, i = c != null && c.hasOwnProperty("display") ? c.display : null, u.style.display = fs("display", i));
                } catch (I) {
                  xe(e, e.return, I);
                }
              }
            } else if (_.tag === 6) {
              if (E === null) try {
                _.stateNode.nodeValue = g ? "" : _.memoizedProps;
              } catch (I) {
                xe(e, e.return, I);
              }
            } else if ((_.tag !== 22 && _.tag !== 23 || _.memoizedState === null || _ === e) && _.child !== null) {
              _.child.return = _, _ = _.child;
              continue;
            }
            if (_ === e) break e;
            for (; _.sibling === null; ) {
              if (_.return === null || _.return === e) break e;
              E === _ && (E = null), _ = _.return;
            }
            E === _ && (E = null), _.sibling.return = _.return, _ = _.sibling;
          }
        }
        break;
      case 19:
        vt(t, e), Et(e), r & 4 && Tu(e);
        break;
      case 21:
        break;
      default:
        vt(
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
            if (zu(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(a(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (Yn(l, ""), r.flags &= -33);
            var o = ju(e);
            _i(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, u = ju(e);
            Ei(e, u, i);
            break;
          default:
            throw Error(a(161));
        }
      } catch (c) {
        xe(e, e.return, c);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function wf(e, t, n) {
    M = e, Mu(e);
  }
  function Mu(e, t, n) {
    for (var r = (e.mode & 1) !== 0; M !== null; ) {
      var l = M, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || jl;
        if (!i) {
          var u = l.alternate, c = u !== null && u.memoizedState !== null || Ve;
          u = jl;
          var g = Ve;
          if (jl = i, (Ve = c) && !g) for (M = l; M !== null; ) i = M, c = i.child, i.tag === 22 && i.memoizedState !== null ? Ou(l) : c !== null ? (c.return = i, M = c) : Ou(l);
          for (; o !== null; ) M = o, Mu(o), o = o.sibling;
          M = l, jl = u, Ve = g;
        }
        Lu(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, M = o) : Lu(e);
    }
  }
  function Lu(e) {
    for (; M !== null; ) {
      var t = M;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Ve || Pl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Ve) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : ht(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && ba(t, o, r);
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
                ba(t, i, n);
              }
              break;
            case 5:
              var u = t.stateNode;
              if (n === null && t.flags & 4) {
                n = u;
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
                  var E = g.memoizedState;
                  if (E !== null) {
                    var _ = E.dehydrated;
                    _ !== null && ir(_);
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
              throw Error(a(163));
          }
          Ve || t.flags & 512 && Ci(t);
        } catch (S) {
          xe(t, t.return, S);
        }
      }
      if (t === e) {
        M = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, M = n;
        break;
      }
      M = t.return;
    }
  }
  function bu(e) {
    for (; M !== null; ) {
      var t = M;
      if (t === e) {
        M = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, M = n;
        break;
      }
      M = t.return;
    }
  }
  function Ou(e) {
    for (; M !== null; ) {
      var t = M;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Pl(4, t);
            } catch (c) {
              xe(t, n, c);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (c) {
                xe(t, l, c);
              }
            }
            var o = t.return;
            try {
              Ci(t);
            } catch (c) {
              xe(t, o, c);
            }
            break;
          case 5:
            var i = t.return;
            try {
              Ci(t);
            } catch (c) {
              xe(t, i, c);
            }
        }
      } catch (c) {
        xe(t, t.return, c);
      }
      if (t === e) {
        M = null;
        break;
      }
      var u = t.sibling;
      if (u !== null) {
        u.return = t.return, M = u;
        break;
      }
      M = t.return;
    }
  }
  var xf = Math.ceil, Tl = ue.ReactCurrentDispatcher, Ni = ue.ReactCurrentOwner, ut = ue.ReactCurrentBatchConfig, ne = 0, Re = null, _e = null, Oe = 0, rt = 0, Hn = Bt(0), Pe = 0, Pr = null, mn = 0, Rl = 0, zi = 0, Tr = null, Ke = null, ji = 0, Bn = 1 / 0, bt = null, Ml = !1, Pi = null, Xt = null, Ll = !1, Zt = null, bl = 0, Rr = 0, Ti = null, Ol = -1, Il = 0;
  function Be() {
    return (ne & 6) !== 0 ? Se() : Ol !== -1 ? Ol : Ol = Se();
  }
  function qt(e) {
    return (e.mode & 1) === 0 ? 1 : (ne & 2) !== 0 && Oe !== 0 ? Oe & -Oe : nf.transition !== null ? (Il === 0 && (Il = js()), Il) : (e = ae, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Ds(e.type)), e);
  }
  function yt(e, t, n, r) {
    if (50 < Rr) throw Rr = 0, Ti = null, Error(a(185));
    tr(e, n, r), ((ne & 2) === 0 || e !== Re) && (e === Re && ((ne & 2) === 0 && (Rl |= n), Pe === 4 && Jt(e, Oe)), Ye(e, r), n === 1 && ne === 0 && (t.mode & 1) === 0 && (Bn = Se() + 500, cl && Qt()));
  }
  function Ye(e, t) {
    var n = e.callbackNode;
    nd(e, t);
    var r = Wr(e, e === Re ? Oe : 0);
    if (r === 0) n !== null && _s(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && _s(n), t === 1) e.tag === 0 ? tf(Du.bind(null, e)) : Sa(Du.bind(null, e)), Zd(function() {
        (ne & 6) === 0 && Qt();
      }), n = null;
      else {
        switch (Ps(r)) {
          case 1:
            n = ao;
            break;
          case 4:
            n = Ns;
            break;
          case 16:
            n = Vr;
            break;
          case 536870912:
            n = zs;
            break;
          default:
            n = Vr;
        }
        n = Wu(n, Iu.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Iu(e, t) {
    if (Ol = -1, Il = 0, (ne & 6) !== 0) throw Error(a(327));
    var n = e.callbackNode;
    if (Wn() && e.callbackNode !== n) return null;
    var r = Wr(e, e === Re ? Oe : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Dl(e, r);
    else {
      t = r;
      var l = ne;
      ne |= 2;
      var o = Au();
      (Re !== e || Oe !== t) && (bt = null, Bn = Se() + 500, gn(e, t));
      do
        try {
          Cf();
          break;
        } catch (u) {
          Fu(e, u);
        }
      while (!0);
      Ko(), Tl.current = o, ne = l, _e !== null ? t = 0 : (Re = null, Oe = 0, t = Pe);
    }
    if (t !== 0) {
      if (t === 2 && (l = uo(e), l !== 0 && (r = l, t = Ri(e, l))), t === 1) throw n = Pr, gn(e, 0), Jt(e, r), Ye(e, Se()), n;
      if (t === 6) Jt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !kf(l) && (t = Dl(e, r), t === 2 && (o = uo(e), o !== 0 && (r = o, t = Ri(e, o))), t === 1)) throw n = Pr, gn(e, 0), Jt(e, r), Ye(e, Se()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(a(345));
          case 2:
            vn(e, Ke, bt);
            break;
          case 3:
            if (Jt(e, r), (r & 130023424) === r && (t = ji + 500 - Se(), 10 < t)) {
              if (Wr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                Be(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Do(vn.bind(null, e, Ke, bt), t);
              break;
            }
            vn(e, Ke, bt);
            break;
          case 4:
            if (Jt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var i = 31 - ft(r);
              o = 1 << i, i = t[i], i > l && (l = i), r &= ~o;
            }
            if (r = l, r = Se() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * xf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Do(vn.bind(null, e, Ke, bt), r);
              break;
            }
            vn(e, Ke, bt);
            break;
          case 5:
            vn(e, Ke, bt);
            break;
          default:
            throw Error(a(329));
        }
      }
    }
    return Ye(e, Se()), e.callbackNode === n ? Iu.bind(null, e) : null;
  }
  function Ri(e, t) {
    var n = Tr;
    return e.current.memoizedState.isDehydrated && (gn(e, t).flags |= 256), e = Dl(e, t), e !== 2 && (t = Ke, Ke = n, t !== null && Mi(t)), e;
  }
  function Mi(e) {
    Ke === null ? Ke = e : Ke.push.apply(Ke, e);
  }
  function kf(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], o = l.getSnapshot;
          l = l.value;
          try {
            if (!pt(o(), l)) return !1;
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
  function Jt(e, t) {
    for (t &= ~zi, t &= ~Rl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - ft(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Du(e) {
    if ((ne & 6) !== 0) throw Error(a(327));
    Wn();
    var t = Wr(e, 0);
    if ((t & 1) === 0) return Ye(e, Se()), null;
    var n = Dl(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = uo(e);
      r !== 0 && (t = r, n = Ri(e, r));
    }
    if (n === 1) throw n = Pr, gn(e, 0), Jt(e, t), Ye(e, Se()), n;
    if (n === 6) throw Error(a(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, vn(e, Ke, bt), Ye(e, Se()), null;
  }
  function Li(e, t) {
    var n = ne;
    ne |= 1;
    try {
      return e(t);
    } finally {
      ne = n, ne === 0 && (Bn = Se() + 500, cl && Qt());
    }
  }
  function hn(e) {
    Zt !== null && Zt.tag === 0 && (ne & 6) === 0 && Wn();
    var t = ne;
    ne |= 1;
    var n = ut.transition, r = ae;
    try {
      if (ut.transition = null, ae = 1, e) return e();
    } finally {
      ae = r, ut.transition = n, ne = t, (ne & 6) === 0 && Qt();
    }
  }
  function bi() {
    rt = Hn.current, me(Hn);
  }
  function gn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Xd(n)), _e !== null) for (n = _e.return; n !== null; ) {
      var r = n;
      switch (Ho(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && al();
          break;
        case 3:
          Un(), me(We), me(Fe), ni();
          break;
        case 5:
          ei(r);
          break;
        case 4:
          Un();
          break;
        case 13:
          me(ye);
          break;
        case 19:
          me(ye);
          break;
        case 10:
          Yo(r.type._context);
          break;
        case 22:
        case 23:
          bi();
      }
      n = n.return;
    }
    if (Re = e, _e = e = en(e.current, null), Oe = rt = t, Pe = 0, Pr = null, zi = Rl = mn = 0, Ke = Tr = null, dn !== null) {
      for (t = 0; t < dn.length; t++) if (n = dn[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, o = n.pending;
        if (o !== null) {
          var i = o.next;
          o.next = l, r.next = i;
        }
        n.pending = r;
      }
      dn = null;
    }
    return e;
  }
  function Fu(e, t) {
    do {
      var n = _e;
      try {
        if (Ko(), xl.current = El, kl) {
          for (var r = we.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          kl = !1;
        }
        if (pn = 0, Te = je = we = null, Cr = !1, Er = 0, Ni.current = null, n === null || n.return === null) {
          Pe = 1, Pr = t, _e = null;
          break;
        }
        e: {
          var o = e, i = n.return, u = n, c = t;
          if (t = Oe, u.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
            var g = c, E = u, _ = E.tag;
            if ((E.mode & 1) === 0 && (_ === 0 || _ === 11 || _ === 15)) {
              var S = E.alternate;
              S ? (E.updateQueue = S.updateQueue, E.memoizedState = S.memoizedState, E.lanes = S.lanes) : (E.updateQueue = null, E.memoizedState = null);
            }
            var T = uu(i);
            if (T !== null) {
              T.flags &= -257, cu(T, i, u, o, t), T.mode & 1 && au(o, g, t), t = T, c = g;
              var O = t.updateQueue;
              if (O === null) {
                var I = /* @__PURE__ */ new Set();
                I.add(c), t.updateQueue = I;
              } else O.add(c);
              break e;
            } else {
              if ((t & 1) === 0) {
                au(o, g, t), Oi();
                break e;
              }
              c = Error(a(426));
            }
          } else if (ve && u.mode & 1) {
            var Ce = uu(i);
            if (Ce !== null) {
              (Ce.flags & 65536) === 0 && (Ce.flags |= 256), cu(Ce, i, u, o, t), Qo(Vn(c, u));
              break e;
            }
          }
          o = c = Vn(c, u), Pe !== 4 && (Pe = 2), Tr === null ? Tr = [o] : Tr.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var m = iu(o, c, t);
                La(o, m);
                break e;
              case 1:
                u = c;
                var d = o.type, h = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof d.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (Xt === null || !Xt.has(h)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var j = su(o, u, t);
                  La(o, j);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        Vu(n);
      } catch (F) {
        t = F, _e === n && n !== null && (_e = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Au() {
    var e = Tl.current;
    return Tl.current = El, e === null ? El : e;
  }
  function Oi() {
    (Pe === 0 || Pe === 3 || Pe === 2) && (Pe = 4), Re === null || (mn & 268435455) === 0 && (Rl & 268435455) === 0 || Jt(Re, Oe);
  }
  function Dl(e, t) {
    var n = ne;
    ne |= 2;
    var r = Au();
    (Re !== e || Oe !== t) && (bt = null, gn(e, t));
    do
      try {
        Sf();
        break;
      } catch (l) {
        Fu(e, l);
      }
    while (!0);
    if (Ko(), ne = n, Tl.current = r, _e !== null) throw Error(a(261));
    return Re = null, Oe = 0, Pe;
  }
  function Sf() {
    for (; _e !== null; ) Uu(_e);
  }
  function Cf() {
    for (; _e !== null && !Gc(); ) Uu(_e);
  }
  function Uu(e) {
    var t = Bu(e.alternate, e, rt);
    e.memoizedProps = e.pendingProps, t === null ? Vu(e) : _e = t, Ni.current = null;
  }
  function Vu(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = hf(n, t, rt), n !== null) {
          _e = n;
          return;
        }
      } else {
        if (n = gf(n, t), n !== null) {
          n.flags &= 32767, _e = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Pe = 6, _e = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        _e = t;
        return;
      }
      _e = t = e;
    } while (t !== null);
    Pe === 0 && (Pe = 5);
  }
  function vn(e, t, n) {
    var r = ae, l = ut.transition;
    try {
      ut.transition = null, ae = 1, Ef(e, t, n, r);
    } finally {
      ut.transition = l, ae = r;
    }
    return null;
  }
  function Ef(e, t, n, r) {
    do
      Wn();
    while (Zt !== null);
    if ((ne & 6) !== 0) throw Error(a(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(a(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (rd(e, o), e === Re && (_e = Re = null, Oe = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Ll || (Ll = !0, Wu(Vr, function() {
      return Wn(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = ut.transition, ut.transition = null;
      var i = ae;
      ae = 1;
      var u = ne;
      ne |= 4, Ni.current = null, yf(e, n), Ru(n, e), Hd(Oo), Kr = !!bo, Oo = bo = null, e.current = n, wf(n), Kc(), ne = u, ae = i, ut.transition = o;
    } else e.current = n;
    if (Ll && (Ll = !1, Zt = e, bl = l), o = e.pendingLanes, o === 0 && (Xt = null), Zc(n.stateNode), Ye(e, Se()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Ml) throw Ml = !1, e = Pi, Pi = null, e;
    return (bl & 1) !== 0 && e.tag !== 0 && Wn(), o = e.pendingLanes, (o & 1) !== 0 ? e === Ti ? Rr++ : (Rr = 0, Ti = e) : Rr = 0, Qt(), null;
  }
  function Wn() {
    if (Zt !== null) {
      var e = Ps(bl), t = ut.transition, n = ae;
      try {
        if (ut.transition = null, ae = 16 > e ? 16 : e, Zt === null) var r = !1;
        else {
          if (e = Zt, Zt = null, bl = 0, (ne & 6) !== 0) throw Error(a(331));
          var l = ne;
          for (ne |= 4, M = e.current; M !== null; ) {
            var o = M, i = o.child;
            if ((M.flags & 16) !== 0) {
              var u = o.deletions;
              if (u !== null) {
                for (var c = 0; c < u.length; c++) {
                  var g = u[c];
                  for (M = g; M !== null; ) {
                    var E = M;
                    switch (E.tag) {
                      case 0:
                      case 11:
                      case 15:
                        jr(8, E, o);
                    }
                    var _ = E.child;
                    if (_ !== null) _.return = E, M = _;
                    else for (; M !== null; ) {
                      E = M;
                      var S = E.sibling, T = E.return;
                      if (Nu(E), E === g) {
                        M = null;
                        break;
                      }
                      if (S !== null) {
                        S.return = T, M = S;
                        break;
                      }
                      M = T;
                    }
                  }
                }
                var O = o.alternate;
                if (O !== null) {
                  var I = O.child;
                  if (I !== null) {
                    O.child = null;
                    do {
                      var Ce = I.sibling;
                      I.sibling = null, I = Ce;
                    } while (I !== null);
                  }
                }
                M = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && i !== null) i.return = o, M = i;
            else e: for (; M !== null; ) {
              if (o = M, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  jr(9, o, o.return);
              }
              var m = o.sibling;
              if (m !== null) {
                m.return = o.return, M = m;
                break e;
              }
              M = o.return;
            }
          }
          var d = e.current;
          for (M = d; M !== null; ) {
            i = M;
            var h = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && h !== null) h.return = i, M = h;
            else e: for (i = d; M !== null; ) {
              if (u = M, (u.flags & 2048) !== 0) try {
                switch (u.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Pl(9, u);
                }
              } catch (F) {
                xe(u, u.return, F);
              }
              if (u === i) {
                M = null;
                break e;
              }
              var j = u.sibling;
              if (j !== null) {
                j.return = u.return, M = j;
                break e;
              }
              M = u.return;
            }
          }
          if (ne = l, Qt(), xt && typeof xt.onPostCommitFiberRoot == "function") try {
            xt.onPostCommitFiberRoot($r, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        ae = n, ut.transition = t;
      }
    }
    return !1;
  }
  function $u(e, t, n) {
    t = Vn(n, t), t = iu(e, t, 1), e = Kt(e, t, 1), t = Be(), e !== null && (tr(e, 1, t), Ye(e, t));
  }
  function xe(e, t, n) {
    if (e.tag === 3) $u(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        $u(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Xt === null || !Xt.has(r))) {
          e = Vn(n, e), e = su(t, e, 1), t = Kt(t, e, 1), e = Be(), t !== null && (tr(t, 1, e), Ye(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function _f(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Be(), e.pingedLanes |= e.suspendedLanes & n, Re === e && (Oe & n) === n && (Pe === 4 || Pe === 3 && (Oe & 130023424) === Oe && 500 > Se() - ji ? gn(e, 0) : zi |= n), Ye(e, t);
  }
  function Hu(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Br, Br <<= 1, (Br & 130023424) === 0 && (Br = 4194304)));
    var n = Be();
    e = Rt(e, t), e !== null && (tr(e, t, n), Ye(e, n));
  }
  function Nf(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Hu(e, n);
  }
  function zf(e, t) {
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
        throw Error(a(314));
    }
    r !== null && r.delete(t), Hu(e, n);
  }
  var Bu;
  Bu = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || We.current) Ge = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Ge = !1, mf(e, t, n);
      Ge = (e.flags & 131072) !== 0;
    }
    else Ge = !1, ve && (t.flags & 1048576) !== 0 && Ca(t, fl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        zl(e, t), e = t.pendingProps;
        var l = Ln(t, Fe.current);
        An(t, n), l = oi(null, t, r, e, l, n);
        var o = ii();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Qe(r) ? (o = !0, ul(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, qo(t), l.updater = _l, t.stateNode = l, l._reactInternals = t, fi(t, r, e, n), t = gi(null, t, r, !0, o, n)) : (t.tag = 0, ve && o && $o(t), He(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (zl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Pf(r), e = ht(r, e), l) {
            case 0:
              t = hi(null, t, r, e, n);
              break e;
            case 1:
              t = gu(null, t, r, e, n);
              break e;
            case 11:
              t = du(null, t, r, e, n);
              break e;
            case 14:
              t = fu(null, t, r, ht(r.type, e), n);
              break e;
          }
          throw Error(a(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), hi(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), gu(e, t, r, l, n);
      case 3:
        e: {
          if (vu(t), e === null) throw Error(a(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, Ma(e, t), yl(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Vn(Error(a(423)), t), t = yu(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Vn(Error(a(424)), t), t = yu(e, t, r, n, l);
            break e;
          } else for (nt = Ht(t.stateNode.containerInfo.firstChild), tt = t, ve = !0, mt = null, n = Ta(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (In(), r === l) {
              t = Lt(e, t, n);
              break e;
            }
            He(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Oa(t), e === null && Wo(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, Io(r, l) ? i = null : o !== null && Io(r, o) && (t.flags |= 32), hu(e, t), He(e, t, i, n), t.child;
      case 6:
        return e === null && Wo(t), null;
      case 13:
        return wu(e, t, n);
      case 4:
        return Jo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Dn(t, null, r, n) : He(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), du(e, t, r, l, n);
      case 7:
        return He(e, t, t.pendingProps, n), t.child;
      case 8:
        return He(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return He(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, de(hl, r._currentValue), r._currentValue = i, o !== null) if (pt(o.value, i)) {
            if (o.children === l.children && !We.current) {
              t = Lt(e, t, n);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var u = o.dependencies;
            if (u !== null) {
              i = o.child;
              for (var c = u.firstContext; c !== null; ) {
                if (c.context === r) {
                  if (o.tag === 1) {
                    c = Mt(-1, n & -n), c.tag = 2;
                    var g = o.updateQueue;
                    if (g !== null) {
                      g = g.shared;
                      var E = g.pending;
                      E === null ? c.next = c : (c.next = E.next, E.next = c), g.pending = c;
                    }
                  }
                  o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Xo(
                    o.return,
                    n,
                    t
                  ), u.lanes |= n;
                  break;
                }
                c = c.next;
              }
            } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (i = o.return, i === null) throw Error(a(341));
              i.lanes |= n, u = i.alternate, u !== null && (u.lanes |= n), Xo(i, n, t), i = o.sibling;
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
          He(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, An(t, n), l = st(l), r = r(l), t.flags |= 1, He(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = ht(r, t.pendingProps), l = ht(r.type, l), fu(e, t, r, l, n);
      case 15:
        return pu(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), zl(e, t), t.tag = 1, Qe(r) ? (e = !0, ul(t)) : e = !1, An(t, n), lu(t, r, l), fi(t, r, l, n), gi(null, t, r, !0, e, n);
      case 19:
        return ku(e, t, n);
      case 22:
        return mu(e, t, n);
    }
    throw Error(a(156, t.tag));
  };
  function Wu(e, t) {
    return Es(e, t);
  }
  function jf(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ct(e, t, n, r) {
    return new jf(e, t, n, r);
  }
  function Ii(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Pf(e) {
    if (typeof e == "function") return Ii(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === ee) return 11;
      if (e === qe) return 14;
    }
    return 2;
  }
  function en(e, t) {
    var n = e.alternate;
    return n === null ? (n = ct(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Fl(e, t, n, r, l, o) {
    var i = 2;
    if (r = e, typeof e == "function") Ii(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case Ee:
        return yn(n.children, l, o, t);
      case Le:
        i = 8, l |= 8;
        break;
      case lt:
        return e = ct(12, n, t, l | 2), e.elementType = lt, e.lanes = o, e;
      case Ie:
        return e = ct(13, n, t, l), e.elementType = Ie, e.lanes = o, e;
      case De:
        return e = ct(19, n, t, l), e.elementType = De, e.lanes = o, e;
      case fe:
        return Al(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Ze:
            i = 10;
            break e;
          case dt:
            i = 9;
            break e;
          case ee:
            i = 11;
            break e;
          case qe:
            i = 14;
            break e;
          case ze:
            i = 16, r = null;
            break e;
        }
        throw Error(a(130, e == null ? e : typeof e, ""));
    }
    return t = ct(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
  }
  function yn(e, t, n, r) {
    return e = ct(7, e, r, t), e.lanes = n, e;
  }
  function Al(e, t, n, r) {
    return e = ct(22, e, r, t), e.elementType = fe, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Di(e, t, n) {
    return e = ct(6, e, null, t), e.lanes = n, e;
  }
  function Fi(e, t, n) {
    return t = ct(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Tf(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = co(0), this.expirationTimes = co(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = co(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Ai(e, t, n, r, l, o, i, u, c) {
    return e = new Tf(e, t, n, u, c), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = ct(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, qo(o), e;
  }
  function Rf(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ke, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Qu(e) {
    if (!e) return Wt;
    e = e._reactInternals;
    e: {
      if (on(e) !== e || e.tag !== 1) throw Error(a(170));
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
      throw Error(a(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Qe(n)) return xa(e, n, t);
    }
    return t;
  }
  function Gu(e, t, n, r, l, o, i, u, c) {
    return e = Ai(n, r, !0, e, l, o, i, u, c), e.context = Qu(null), n = e.current, r = Be(), l = qt(n), o = Mt(r, l), o.callback = t ?? null, Kt(n, o, l), e.current.lanes = l, tr(e, l, r), Ye(e, r), e;
  }
  function Ul(e, t, n, r) {
    var l = t.current, o = Be(), i = qt(l);
    return n = Qu(n), t.context === null ? t.context = n : t.pendingContext = n, t = Mt(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Kt(l, t, i), e !== null && (yt(e, l, i, o), vl(e, l, i)), i;
  }
  function Vl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Ku(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Ui(e, t) {
    Ku(e, t), (e = e.alternate) && Ku(e, t);
  }
  function Mf() {
    return null;
  }
  var Yu = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Vi(e) {
    this._internalRoot = e;
  }
  $l.prototype.render = Vi.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(a(409));
    Ul(e, t, null, null);
  }, $l.prototype.unmount = Vi.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      hn(function() {
        Ul(null, e, null, null);
      }), t[zt] = null;
    }
  };
  function $l(e) {
    this._internalRoot = e;
  }
  $l.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ms();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ut.length && t !== 0 && t < Ut[n].priority; n++) ;
      Ut.splice(n, 0, e), n === 0 && Os(e);
    }
  };
  function $i(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Hl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Xu() {
  }
  function Lf(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var g = Vl(i);
          o.call(g);
        };
      }
      var i = Gu(t, r, e, 0, null, !1, !1, "", Xu);
      return e._reactRootContainer = i, e[zt] = i.current, hr(e.nodeType === 8 ? e.parentNode : e), hn(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var u = r;
      r = function() {
        var g = Vl(c);
        u.call(g);
      };
    }
    var c = Ai(e, 0, !1, null, null, !1, !1, "", Xu);
    return e._reactRootContainer = c, e[zt] = c.current, hr(e.nodeType === 8 ? e.parentNode : e), hn(function() {
      Ul(t, c, n, r);
    }), c;
  }
  function Bl(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var u = l;
        l = function() {
          var c = Vl(i);
          u.call(c);
        };
      }
      Ul(t, i, e, l);
    } else i = Lf(n, t, e, l, r);
    return Vl(i);
  }
  Ts = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = er(t.pendingLanes);
          n !== 0 && (fo(t, n | 1), Ye(t, Se()), (ne & 6) === 0 && (Bn = Se() + 500, Qt()));
        }
        break;
      case 13:
        hn(function() {
          var r = Rt(e, 1);
          if (r !== null) {
            var l = Be();
            yt(r, e, 1, l);
          }
        }), Ui(e, 1);
    }
  }, po = function(e) {
    if (e.tag === 13) {
      var t = Rt(e, 134217728);
      if (t !== null) {
        var n = Be();
        yt(t, e, 134217728, n);
      }
      Ui(e, 134217728);
    }
  }, Rs = function(e) {
    if (e.tag === 13) {
      var t = qt(e), n = Rt(e, t);
      if (n !== null) {
        var r = Be();
        yt(n, e, t, r);
      }
      Ui(e, t);
    }
  }, Ms = function() {
    return ae;
  }, Ls = function(e, t) {
    var n = ae;
    try {
      return ae = e, t();
    } finally {
      ae = n;
    }
  }, lo = function(e, t, n) {
    switch (t) {
      case "input":
        if (Xl(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = sl(r);
              if (!l) throw Error(a(90));
              rs(r), Xl(r, l);
            }
          }
        }
        break;
      case "textarea":
        as(e, n);
        break;
      case "select":
        t = n.value, t != null && kn(e, !!n.multiple, t, !1);
    }
  }, vs = Li, ys = hn;
  var bf = { usingClientEntryPoint: !1, Events: [yr, Rn, sl, hs, gs, Li] }, Mr = { findFiberByHostInstance: sn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Of = { bundleType: Mr.bundleType, version: Mr.version, rendererPackageName: Mr.rendererPackageName, rendererConfig: Mr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ue.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Ss(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Mr.findFiberByHostInstance || Mf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Wl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Wl.isDisabled && Wl.supportsFiber) try {
      $r = Wl.inject(Of), xt = Wl;
    } catch {
    }
  }
  return Xe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = bf, Xe.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!$i(t)) throw Error(a(200));
    return Rf(e, t, null, n);
  }, Xe.createRoot = function(e, t) {
    if (!$i(e)) throw Error(a(299));
    var n = !1, r = "", l = Yu;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Ai(e, 1, !1, null, null, n, !1, r, l), e[zt] = t.current, hr(e.nodeType === 8 ? e.parentNode : e), new Vi(t);
  }, Xe.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(a(188)) : (e = Object.keys(e).join(","), Error(a(268, e)));
    return e = Ss(t), e = e === null ? null : e.stateNode, e;
  }, Xe.flushSync = function(e) {
    return hn(e);
  }, Xe.hydrate = function(e, t, n) {
    if (!Hl(t)) throw Error(a(200));
    return Bl(null, e, t, !0, n);
  }, Xe.hydrateRoot = function(e, t, n) {
    if (!$i(e)) throw Error(a(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = Yu;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = Gu(t, null, e, 1, n ?? null, l, !1, o, i), e[zt] = t.current, hr(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new $l(t);
  }, Xe.render = function(e, t, n) {
    if (!Hl(t)) throw Error(a(200));
    return Bl(null, e, t, !1, n);
  }, Xe.unmountComponentAtNode = function(e) {
    if (!Hl(e)) throw Error(a(40));
    return e._reactRootContainer ? (hn(function() {
      Bl(null, null, e, !1, function() {
        e._reactRootContainer = null, e[zt] = null;
      });
    }), !0) : !1;
  }, Xe.unstable_batchedUpdates = Li, Xe.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Hl(n)) throw Error(a(200));
    if (e == null || e._reactInternals === void 0) throw Error(a(38));
    return Bl(e, t, n, !1, r);
  }, Xe.version = "18.3.1-next-f1338f8080-20240426", Xe;
}
var lc;
function Gf() {
  if (lc) return Wi.exports;
  lc = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (f) {
        console.error(f);
      }
  }
  return s(), Wi.exports = Qf(), Wi.exports;
}
var oc;
function Kf() {
  if (oc) return Ql;
  oc = 1;
  var s = Gf();
  return Ql.createRoot = s.createRoot, Ql.hydrateRoot = s.hydrateRoot, Ql;
}
var dc = Kf();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yf = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), fc = (...s) => s.filter((f, a, v) => !!f && f.trim() !== "" && v.indexOf(f) === a).join(" ").trim();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Xf = {
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
const Zf = te.forwardRef(
  ({
    color: s = "currentColor",
    size: f = 24,
    strokeWidth: a = 2,
    absoluteStrokeWidth: v,
    className: k = "",
    children: x,
    iconNode: w,
    ...N
  }, L) => te.createElement(
    "svg",
    {
      ref: L,
      ...Xf,
      width: f,
      height: f,
      stroke: s,
      strokeWidth: v ? Number(a) * 24 / Number(f) : a,
      className: fc("lucide", k),
      ...N
    },
    [
      ...w.map(([V, W]) => te.createElement(V, W)),
      ...Array.isArray(x) ? x : [x]
    ]
  )
);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const $e = (s, f) => {
  const a = te.forwardRef(
    ({ className: v, ...k }, x) => te.createElement(Zf, {
      ref: x,
      iconNode: f,
      className: fc(`lucide-${Yf(s)}`, v),
      ...k
    })
  );
  return a.displayName = `${s}`, a;
};
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qf = $e("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jf = $e("ArrowUpDown", [
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
const ep = $e("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yi = $e("CalendarDays", [
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
const tp = $e("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const np = $e("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rp = $e("Ellipsis", [
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
const lp = $e("ExternalLink", [
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
const op = $e("GraduationCap", [
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
const ip = $e("Hash", [
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
const pc = $e("MapPin", [
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
const sp = $e("Pin", [
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
const ap = $e("SearchX", [
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
const up = $e("Trash2", [
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
const mc = $e("TriangleAlert", [
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
const hc = $e("UserRound", [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
]);
var cp = Object.defineProperty, ts = (s, f) => cp(s, "name", { value: f, configurable: !0 });
function Xi(s, f) {
  if (typeof s == "function")
    return s(f);
  s != null && (s.current = f);
}
ts(Xi, "setRef");
function gc(...s) {
  return (f) => {
    let a = !1;
    const v = s.map((k) => {
      const x = Xi(k, f);
      return !a && typeof x == "function" && (a = !0), x;
    });
    if (a)
      return () => {
        for (let k = 0; k < v.length; k++) {
          const x = v[k];
          typeof x == "function" ? x() : Xi(s[k], null);
        }
      };
  };
}
ts(gc, "composeRefs");
function vc(...s) {
  return te.useCallback(gc(...s), s);
}
ts(vc, "useComposedRefs");
var dp = Object.defineProperty, wt = (s, f) => dp(s, "name", { value: f, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function yc(s) {
  const f = te.forwardRef((a, v) => {
    let { children: k, ...x } = a, w = null, N = !1;
    const L = [];
    Zi(k) && typeof Gl == "function" && (k = Gl(k._payload)), te.Children.forEach(k, (D) => {
      var X;
      if (Sc(D)) {
        N = !0;
        const U = D;
        let b = "child" in U.props ? U.props.child : U.props.children;
        Zi(b) && typeof Gl == "function" && (b = Gl(b._payload)), w = mp(U, b), L.push((X = w == null ? void 0 : w.props) == null ? void 0 : X.children);
      } else
        L.push(D);
    }), w ? w = te.cloneElement(w, void 0, L) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !N && te.Children.count(k) === 1 && te.isValidElement(k) && (w = k)
    );
    const V = w ? kc(w) : void 0, W = vc(v, V);
    if (!w) {
      if (k || k === 0)
        throw new Error(
          N ? vp(s) : gp(s)
        );
      return k;
    }
    const B = xc(x, w.props ?? {});
    return w.type !== te.Fragment && (B.ref = v ? W : V), te.cloneElement(w, B);
  });
  return f.displayName = `${s}.Slot`, f;
}
wt(yc, "createSlot");
var fp = /* @__PURE__ */ yc("Slot"), wc = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function pp(s) {
  const f = /* @__PURE__ */ wt((a) => "child" in a ? a.children(a.child) : a.children, "Slottable");
  return f.displayName = `${s}.Slottable`, f.__radixId = wc, f;
}
wt(pp, "createSlottable");
var mp = /* @__PURE__ */ wt((s, f) => {
  if ("child" in s.props) {
    const a = s.props.child;
    return te.isValidElement(a) ? te.cloneElement(a, void 0, s.props.children(a.props.children)) : null;
  }
  return te.isValidElement(f) ? f : null;
}, "getSlottableElementFromSlottable");
function xc(s, f) {
  const a = { ...f };
  for (const v in f) {
    const k = s[v], x = f[v];
    /^on[A-Z]/.test(v) ? k && x ? a[v] = (...N) => {
      const L = x(...N);
      return k(...N), L;
    } : k && (a[v] = k) : v === "style" ? a[v] = { ...k, ...x } : v === "className" && (a[v] = [k, x].filter(Boolean).join(" "));
  }
  return { ...s, ...a };
}
wt(xc, "mergeProps");
function kc(s) {
  var v, k;
  let f = (v = Object.getOwnPropertyDescriptor(s.props, "ref")) == null ? void 0 : v.get, a = f && "isReactWarning" in f && f.isReactWarning;
  return a ? s.ref : (f = (k = Object.getOwnPropertyDescriptor(s, "ref")) == null ? void 0 : k.get, a = f && "isReactWarning" in f && f.isReactWarning, a ? s.props.ref : s.props.ref || s.ref);
}
wt(kc, "getElementRef");
function Sc(s) {
  return te.isValidElement(s) && typeof s.type == "function" && "__radixId" in s.type && s.type.__radixId === wc;
}
wt(Sc, "isSlottable");
var hp = Symbol.for("react.lazy");
function Zi(s) {
  return s != null && typeof s == "object" && "$$typeof" in s && s.$$typeof === hp && "_payload" in s && Cc(s._payload);
}
wt(Zi, "isLazyComponent");
function Cc(s) {
  return typeof s == "object" && s !== null && "then" in s;
}
wt(Cc, "isPromiseLike");
var gp = /* @__PURE__ */ wt((s) => `${s} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), vp = /* @__PURE__ */ wt((s) => `${s} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Gl = Hf[" use ".trim().toString()];
function Ec(s) {
  var f, a, v = "";
  if (typeof s == "string" || typeof s == "number") v += s;
  else if (typeof s == "object") if (Array.isArray(s)) {
    var k = s.length;
    for (f = 0; f < k; f++) s[f] && (a = Ec(s[f])) && (v && (v += " "), v += a);
  } else for (a in s) s[a] && (v && (v += " "), v += a);
  return v;
}
function _c() {
  for (var s, f, a = 0, v = "", k = arguments.length; a < k; a++) (s = arguments[a]) && (f = Ec(s)) && (v && (v += " "), v += f);
  return v;
}
const ic = (s) => typeof s == "boolean" ? `${s}` : s === 0 ? "0" : s, sc = _c, yp = (s, f) => (a) => {
  var v;
  if ((f == null ? void 0 : f.variants) == null) return sc(s, a == null ? void 0 : a.class, a == null ? void 0 : a.className);
  const { variants: k, defaultVariants: x } = f, w = Object.keys(k).map((V) => {
    const W = a == null ? void 0 : a[V], B = x == null ? void 0 : x[V];
    if (W === null) return null;
    const D = ic(W) || ic(B);
    return k[V][D];
  }), N = a && Object.entries(a).reduce((V, W) => {
    let [B, D] = W;
    return D === void 0 || (V[B] = D), V;
  }, {}), L = f == null || (v = f.compoundVariants) === null || v === void 0 ? void 0 : v.reduce((V, W) => {
    let { class: B, className: D, ...X } = W;
    return Object.entries(X).every((U) => {
      let [b, z] = U;
      return Array.isArray(z) ? z.includes({
        ...x,
        ...N
      }[b]) : {
        ...x,
        ...N
      }[b] === z;
    }) ? [
      ...V,
      B,
      D
    ] : V;
  }, []);
  return sc(s, w, L, a == null ? void 0 : a.class, a == null ? void 0 : a.className);
}, ns = "-", wp = (s) => {
  const f = kp(s), {
    conflictingClassGroups: a,
    conflictingClassGroupModifiers: v
  } = s;
  return {
    getClassGroupId: (w) => {
      const N = w.split(ns);
      return N[0] === "" && N.length !== 1 && N.shift(), Nc(N, f) || xp(w);
    },
    getConflictingClassGroupIds: (w, N) => {
      const L = a[w] || [];
      return N && v[w] ? [...L, ...v[w]] : L;
    }
  };
}, Nc = (s, f) => {
  var w;
  if (s.length === 0)
    return f.classGroupId;
  const a = s[0], v = f.nextPart.get(a), k = v ? Nc(s.slice(1), v) : void 0;
  if (k)
    return k;
  if (f.validators.length === 0)
    return;
  const x = s.join(ns);
  return (w = f.validators.find(({
    validator: N
  }) => N(x))) == null ? void 0 : w.classGroupId;
}, ac = /^\[(.+)\]$/, xp = (s) => {
  if (ac.test(s)) {
    const f = ac.exec(s)[1], a = f == null ? void 0 : f.substring(0, f.indexOf(":"));
    if (a)
      return "arbitrary.." + a;
  }
}, kp = (s) => {
  const {
    theme: f,
    prefix: a
  } = s, v = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Cp(Object.entries(s.classGroups), a).forEach(([x, w]) => {
    qi(w, v, x, f);
  }), v;
}, qi = (s, f, a, v) => {
  s.forEach((k) => {
    if (typeof k == "string") {
      const x = k === "" ? f : uc(f, k);
      x.classGroupId = a;
      return;
    }
    if (typeof k == "function") {
      if (Sp(k)) {
        qi(k(v), f, a, v);
        return;
      }
      f.validators.push({
        validator: k,
        classGroupId: a
      });
      return;
    }
    Object.entries(k).forEach(([x, w]) => {
      qi(w, uc(f, x), a, v);
    });
  });
}, uc = (s, f) => {
  let a = s;
  return f.split(ns).forEach((v) => {
    a.nextPart.has(v) || a.nextPart.set(v, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), a = a.nextPart.get(v);
  }), a;
}, Sp = (s) => s.isThemeGetter, Cp = (s, f) => f ? s.map(([a, v]) => {
  const k = v.map((x) => typeof x == "string" ? f + x : typeof x == "object" ? Object.fromEntries(Object.entries(x).map(([w, N]) => [f + w, N])) : x);
  return [a, k];
}) : s, Ep = (s) => {
  if (s < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let f = 0, a = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
  const k = (x, w) => {
    a.set(x, w), f++, f > s && (f = 0, v = a, a = /* @__PURE__ */ new Map());
  };
  return {
    get(x) {
      let w = a.get(x);
      if (w !== void 0)
        return w;
      if ((w = v.get(x)) !== void 0)
        return k(x, w), w;
    },
    set(x, w) {
      a.has(x) ? a.set(x, w) : k(x, w);
    }
  };
}, zc = "!", _p = (s) => {
  const {
    separator: f,
    experimentalParseClassName: a
  } = s, v = f.length === 1, k = f[0], x = f.length, w = (N) => {
    const L = [];
    let V = 0, W = 0, B;
    for (let z = 0; z < N.length; z++) {
      let J = N[z];
      if (V === 0) {
        if (J === k && (v || N.slice(z, z + x) === f)) {
          L.push(N.slice(W, z)), W = z + x;
          continue;
        }
        if (J === "/") {
          B = z;
          continue;
        }
      }
      J === "[" ? V++ : J === "]" && V--;
    }
    const D = L.length === 0 ? N : N.substring(W), X = D.startsWith(zc), U = X ? D.substring(1) : D, b = B && B > W ? B - W : void 0;
    return {
      modifiers: L,
      hasImportantModifier: X,
      baseClassName: U,
      maybePostfixModifierPosition: b
    };
  };
  return a ? (N) => a({
    className: N,
    parseClassName: w
  }) : w;
}, Np = (s) => {
  if (s.length <= 1)
    return s;
  const f = [];
  let a = [];
  return s.forEach((v) => {
    v[0] === "[" ? (f.push(...a.sort(), v), a = []) : a.push(v);
  }), f.push(...a.sort()), f;
}, zp = (s) => ({
  cache: Ep(s.cacheSize),
  parseClassName: _p(s),
  ...wp(s)
}), jp = /\s+/, Pp = (s, f) => {
  const {
    parseClassName: a,
    getClassGroupId: v,
    getConflictingClassGroupIds: k
  } = f, x = [], w = s.trim().split(jp);
  let N = "";
  for (let L = w.length - 1; L >= 0; L -= 1) {
    const V = w[L], {
      modifiers: W,
      hasImportantModifier: B,
      baseClassName: D,
      maybePostfixModifierPosition: X
    } = a(V);
    let U = !!X, b = v(U ? D.substring(0, X) : D);
    if (!b) {
      if (!U) {
        N = V + (N.length > 0 ? " " + N : N);
        continue;
      }
      if (b = v(D), !b) {
        N = V + (N.length > 0 ? " " + N : N);
        continue;
      }
      U = !1;
    }
    const z = Np(W).join(":"), J = B ? z + zc : z, ie = J + b;
    if (x.includes(ie))
      continue;
    x.push(ie);
    const K = k(b, U);
    for (let ue = 0; ue < K.length; ++ue) {
      const Ne = K[ue];
      x.push(J + Ne);
    }
    N = V + (N.length > 0 ? " " + N : N);
  }
  return N;
};
function Tp() {
  let s = 0, f, a, v = "";
  for (; s < arguments.length; )
    (f = arguments[s++]) && (a = jc(f)) && (v && (v += " "), v += a);
  return v;
}
const jc = (s) => {
  if (typeof s == "string")
    return s;
  let f, a = "";
  for (let v = 0; v < s.length; v++)
    s[v] && (f = jc(s[v])) && (a && (a += " "), a += f);
  return a;
};
function Rp(s, ...f) {
  let a, v, k, x = w;
  function w(L) {
    const V = f.reduce((W, B) => B(W), s());
    return a = zp(V), v = a.cache.get, k = a.cache.set, x = N, N(L);
  }
  function N(L) {
    const V = v(L);
    if (V)
      return V;
    const W = Pp(L, a);
    return k(L, W), W;
  }
  return function() {
    return x(Tp.apply(null, arguments));
  };
}
const he = (s) => {
  const f = (a) => a[s] || [];
  return f.isThemeGetter = !0, f;
}, Pc = /^\[(?:([a-z-]+):)?(.+)\]$/i, Mp = /^\d+\/\d+$/, Lp = /* @__PURE__ */ new Set(["px", "full", "screen"]), bp = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Op = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Ip = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Dp = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Fp = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ot = (s) => Qn(s) || Lp.has(s) || Mp.test(s), nn = (s) => Gn(s, "length", Qp), Qn = (s) => !!s && !Number.isNaN(Number(s)), Ki = (s) => Gn(s, "number", Qn), br = (s) => !!s && Number.isInteger(Number(s)), Ap = (s) => s.endsWith("%") && Qn(s.slice(0, -1)), G = (s) => Pc.test(s), rn = (s) => bp.test(s), Up = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Vp = (s) => Gn(s, Up, Tc), $p = (s) => Gn(s, "position", Tc), Hp = /* @__PURE__ */ new Set(["image", "url"]), Bp = (s) => Gn(s, Hp, Kp), Wp = (s) => Gn(s, "", Gp), Or = () => !0, Gn = (s, f, a) => {
  const v = Pc.exec(s);
  return v ? v[1] ? typeof f == "string" ? v[1] === f : f.has(v[1]) : a(v[2]) : !1;
}, Qp = (s) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Op.test(s) && !Ip.test(s)
), Tc = () => !1, Gp = (s) => Dp.test(s), Kp = (s) => Fp.test(s), Yp = () => {
  const s = he("colors"), f = he("spacing"), a = he("blur"), v = he("brightness"), k = he("borderColor"), x = he("borderRadius"), w = he("borderSpacing"), N = he("borderWidth"), L = he("contrast"), V = he("grayscale"), W = he("hueRotate"), B = he("invert"), D = he("gap"), X = he("gradientColorStops"), U = he("gradientColorStopPositions"), b = he("inset"), z = he("margin"), J = he("opacity"), ie = he("padding"), K = he("saturate"), ue = he("scale"), Ne = he("sepia"), ke = he("skew"), Ee = he("space"), Le = he("translate"), lt = () => ["auto", "contain", "none"], Ze = () => ["auto", "hidden", "clip", "visible", "scroll"], dt = () => ["auto", G, f], ee = () => [G, f], Ie = () => ["", Ot, nn], De = () => ["auto", Qn, G], qe = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], ze = () => ["solid", "dashed", "dotted", "double", "none"], fe = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], P = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], A = () => ["", "0", G], R = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], p = () => [Qn, G];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Or],
      spacing: [Ot, nn],
      blur: ["none", "", rn, G],
      brightness: p(),
      borderColor: [s],
      borderRadius: ["none", "", "full", rn, G],
      borderSpacing: ee(),
      borderWidth: Ie(),
      contrast: p(),
      grayscale: A(),
      hueRotate: p(),
      invert: A(),
      gap: ee(),
      gradientColorStops: [s],
      gradientColorStopPositions: [Ap, nn],
      inset: dt(),
      margin: dt(),
      opacity: p(),
      padding: ee(),
      saturate: p(),
      scale: p(),
      sepia: A(),
      skew: p(),
      space: ee(),
      translate: ee()
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
        columns: [rn]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": R()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": R()
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
        object: [...qe(), G]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: Ze()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": Ze()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": Ze()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: lt()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": lt()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": lt()
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
        inset: [b]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [b]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [b]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [b]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [b]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [b]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [b]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [b]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [b]
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
        z: ["auto", br, G]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: dt()
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
        order: ["first", "last", "none", br, G]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Or]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", br, G]
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
        "grid-rows": [Or]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [br, G]
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
        justify: ["normal", ...P()]
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
        content: ["normal", ...P(), "baseline"]
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
        "place-content": [...P(), "baseline"]
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
        p: [ie]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [ie]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [ie]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [ie]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [ie]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [ie]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [ie]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [ie]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [ie]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [z]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [z]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [z]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [z]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [z]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [z]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [z]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [z]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [z]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [Ee]
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
        "space-y": [Ee]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", G, f]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [G, f, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [G, f, "none", "full", "min", "max", "fit", "prose", {
          screen: [rn]
        }, rn]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [G, f, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [G, f, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [G, f, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [G, f, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", rn, nn]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", Ki]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Or]
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
        "line-clamp": ["none", Qn, Ki]
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
        placeholder: [s]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [J]
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
        text: [s]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [J]
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
        decoration: [...ze(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Ot, nn]
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
        decoration: [s]
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
        indent: ee()
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
        "bg-opacity": [J]
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
        bg: [...qe(), $p]
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
        bg: ["auto", "cover", "contain", Vp]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Bp]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [s]
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
        from: [X]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [X]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [X]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [x]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [x]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [x]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [x]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [x]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [x]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [x]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [x]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [x]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [x]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [x]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [x]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [x]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [x]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [x]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [N]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [N]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [N]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [N]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [N]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [N]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [N]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [N]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [N]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [J]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...ze(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [N]
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
        "divide-y": [N]
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
        "divide-opacity": [J]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: ze()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [k]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [k]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [k]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [k]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [k]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [k]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [k]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [k]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [k]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [k]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...ze()]
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
        outline: [Ot, nn]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [s]
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
        ring: [s]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [J]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Ot, nn]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [s]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", rn, Wp]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Or]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [J]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...fe(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": fe()
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
        blur: [a]
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
        contrast: [L]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", rn, G]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [V]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [W]
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
        saturate: [K]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [Ne]
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
        "backdrop-blur": [a]
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
        "backdrop-contrast": [L]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [V]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [W]
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
        "backdrop-opacity": [J]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [K]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [Ne]
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
        "border-spacing": [w]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [w]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [w]
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
        duration: p()
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
        delay: p()
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
        scale: [ue]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [ue]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [ue]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [br, G]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [Le]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [Le]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [ke]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [ke]
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
        accent: ["auto", s]
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
        caret: [s]
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
        "scroll-m": ee()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": ee()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": ee()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": ee()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": ee()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": ee()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": ee()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": ee()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": ee()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": ee()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": ee()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": ee()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": ee()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": ee()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": ee()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": ee()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": ee()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": ee()
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
        fill: [s, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [Ot, nn, Ki]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [s, "none"]
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
}, Xp = /* @__PURE__ */ Rp(Yp);
function xn(...s) {
  return Xp(_c(s));
}
const Zp = yp(
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
), Rc = te.forwardRef(
  ({ className: s, variant: f, size: a, asChild: v = !1, ...k }, x) => {
    const w = v ? fp : "button";
    return /* @__PURE__ */ y.jsx(w, { className: xn(Zp({ variant: f, size: a, className: s })), ref: x, ...k });
  }
);
Rc.displayName = "Button";
const Mc = te.forwardRef(
  ({ className: s, ...f }, a) => /* @__PURE__ */ y.jsx("div", { className: "dt-relative dt-w-full dt-overflow-auto", children: /* @__PURE__ */ y.jsx("table", { ref: a, className: xn("dt-w-full dt-caption-bottom dt-text-sm", s), ...f }) })
);
Mc.displayName = "Table";
const Lc = te.forwardRef(({ className: s, ...f }, a) => /* @__PURE__ */ y.jsx("thead", { ref: a, className: xn("[&_tr]:dt-border-b", s), ...f }));
Lc.displayName = "TableHeader";
const bc = te.forwardRef(({ className: s, ...f }, a) => /* @__PURE__ */ y.jsx("tbody", { ref: a, className: xn("[&_tr:last-child]:dt-border-0", s), ...f }));
bc.displayName = "TableBody";
const Ji = te.forwardRef(
  ({ className: s, ...f }, a) => /* @__PURE__ */ y.jsx(
    "tr",
    {
      ref: a,
      className: xn(
        "dt-border-b dt-transition-colors hover:dt-bg-muted/50 data-[state=selected]:dt-bg-muted",
        s
      ),
      ...f
    }
  )
);
Ji.displayName = "TableRow";
const _t = te.forwardRef(({ className: s, ...f }, a) => /* @__PURE__ */ y.jsx(
  "th",
  {
    ref: a,
    className: xn(
      "dt-h-12 dt-px-4 dt-text-left dt-align-middle dt-font-medium dt-text-muted-foreground [&:has([role=checkbox])]:dt-pr-0",
      s
    ),
    ...f
  }
));
_t.displayName = "TableHead";
const Nt = te.forwardRef(({ className: s, ...f }, a) => /* @__PURE__ */ y.jsx(
  "td",
  {
    ref: a,
    className: xn("dt-p-4 dt-align-middle [&:has([role=checkbox])]:dt-pr-0", s),
    ...f
  }
));
Nt.displayName = "TableCell";
function cc(s) {
  return s ? s.split(" | ").map((f) => f.replace("/", "-")) : ["·"];
}
function qp({
  label: s,
  active: f,
  dir: a,
  onClick: v
}) {
  const k = f ? a === 1 ? ep : qf : Jf;
  return /* @__PURE__ */ y.jsxs(Rc, { variant: "ghost", size: "sm", onClick: v, className: "dt--ml-3", children: [
    s,
    /* @__PURE__ */ y.jsx(k, { className: `dt-ml-1.5 dt-inline dt-size-3.5${f ? "" : " dt-opacity-40"}` })
  ] });
}
function Oc(s) {
  const { rows: f, sortKey: a, sortDir: v, onSortChange: k, onRowClick: x, onToggleSelect: w, onToggleFavorite: N, allSelected: L, onSelectAll: V, emptyMessage: W, ariaLabel: B, labels: D } = s;
  if (!f.length)
    return /* @__PURE__ */ y.jsx("p", { className: "dt-p-6 dt-text-center dt-text-sm dt-text-muted-foreground", children: W });
  const X = (U, b) => /* @__PURE__ */ y.jsx(qp, { label: b, active: a === U, dir: v, onClick: () => k(U) });
  return /* @__PURE__ */ y.jsx("div", { className: "dersler-table-root dt-overflow-hidden dt-rounded-lg dt-border dt-border-border", children: /* @__PURE__ */ y.jsxs(Mc, { "aria-label": B, children: [
    /* @__PURE__ */ y.jsx(Lc, { children: /* @__PURE__ */ y.jsxs(Ji, { children: [
      /* @__PURE__ */ y.jsx(_t, { className: "dt-h-9 dt-w-8 dt-p-2", children: /* @__PURE__ */ y.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: L,
          "aria-label": D.selectAll,
          onChange: (U) => V(U.target.checked)
        }
      ) }),
      /* @__PURE__ */ y.jsx(_t, { className: "dt-h-9 dt-w-8 dt-p-2" }),
      /* @__PURE__ */ y.jsx(_t, { className: "dt-h-9 dt-p-2", children: X("crn", D.crn) }),
      /* @__PURE__ */ y.jsx(_t, { className: "dt-h-9 dt-p-2", children: X("code", D.code) }),
      /* @__PURE__ */ y.jsx(_t, { className: "dt-h-9 dt-p-2", children: X("name", D.name) }),
      /* @__PURE__ */ y.jsx(_t, { className: "dt-h-9 dt-p-2", children: X("instructor", D.instructor) }),
      /* @__PURE__ */ y.jsx(_t, { className: "dt-h-9 dt-p-2", children: X("when", D.when) }),
      /* @__PURE__ */ y.jsx(_t, { className: "dt-h-9 dt-p-2", children: D.where }),
      /* @__PURE__ */ y.jsx(_t, { className: "dt-h-9 dt-p-2 dt-text-right", children: X("fill", D.fill) })
    ] }) }),
    /* @__PURE__ */ y.jsx(bc, { children: f.map((U) => /* @__PURE__ */ y.jsxs(Ji, { className: "dt-cursor-pointer", onClick: () => x(U.key), children: [
      /* @__PURE__ */ y.jsx(Nt, { className: "dt-p-2", onClick: (b) => b.stopPropagation(), children: /* @__PURE__ */ y.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: U.selected,
          "aria-label": D.selectSection,
          onChange: (b) => w(U.key, b.target.checked)
        }
      ) }),
      /* @__PURE__ */ y.jsx(Nt, { className: "dt-p-2", onClick: (b) => b.stopPropagation(), children: /* @__PURE__ */ y.jsx(
        "button",
        {
          type: "button",
          className: "dt-text-base dt-leading-none",
          "aria-label": U.favorite ? D.removeFav : D.addFav,
          "aria-pressed": U.favorite,
          onClick: () => N(U.key),
          children: U.favorite ? "★" : "☆"
        }
      ) }),
      /* @__PURE__ */ y.jsx(Nt, { className: "dt-p-2 dt-font-mono dt-text-muted-foreground", dangerouslySetInnerHTML: { __html: U.crnHTML } }),
      /* @__PURE__ */ y.jsx(Nt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: U.codeHTML } }),
      /* @__PURE__ */ y.jsx(Nt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: U.nameHTML } }),
      /* @__PURE__ */ y.jsx(Nt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: U.instructorHTML } }),
      /* @__PURE__ */ y.jsx(Nt, { className: "dt-p-2 dt-font-mono dt-text-xs", children: cc(U.when).map((b, z) => /* @__PURE__ */ y.jsx("div", { children: b }, z)) }),
      /* @__PURE__ */ y.jsx(Nt, { className: "dt-p-2 dt-text-xs dt-text-muted-foreground", children: U.where ? cc(U.where).map((b, z) => /* @__PURE__ */ y.jsx("div", { children: b }, z)) : "·" }),
      /* @__PURE__ */ y.jsx(Nt, { className: "dt-p-2 dt-text-right dt-tabular-nums", dangerouslySetInnerHTML: { __html: U.quotaHTML } })
    ] }, U.key)) })
  ] }) });
}
const wn = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
function Ic(s) {
  const f = [...s].sort((x, w) => x.start - w.start || x.end - w.end), a = [], v = f.map((x) => {
    let w = a.findIndex((N) => N <= x.start);
    return w < 0 ? (w = a.length, a.push(x.end)) : a[w] = x.end, { ...x, lane: w, laneCount: 1, conflict: !1 };
  }), k = Math.max(1, a.length);
  return v.map((x) => ({
    ...x,
    laneCount: k,
    conflict: v.some((w) => w.key !== x.key && x.start < w.end && w.start < x.end)
  }));
}
function Jp() {
  const s = "(max-width: 600px)", [f, a] = te.useState(() => window.matchMedia(s).matches);
  return te.useEffect(() => {
    const v = window.matchMedia(s), k = () => a(v.matches);
    return v.addEventListener("change", k), () => v.removeEventListener("change", k);
  }, []), f;
}
function Dc({ session: s, compact: f = !1 }) {
  return /* @__PURE__ */ y.jsxs("span", { className: "pp-session-meta", children: [
    /* @__PURE__ */ y.jsxs("span", { children: [
      /* @__PURE__ */ y.jsx(tp, { "aria-hidden": "true" }),
      wn(s.start),
      "–",
      wn(s.end)
    ] }),
    /* @__PURE__ */ y.jsxs("span", { children: [
      /* @__PURE__ */ y.jsx(ip, { "aria-hidden": "true" }),
      s.crn
    ] }),
    !f && s.instructor && /* @__PURE__ */ y.jsxs("span", { children: [
      /* @__PURE__ */ y.jsx(hc, { "aria-hidden": "true" }),
      s.instructor
    ] }),
    !f && s.where && /* @__PURE__ */ y.jsxs("span", { children: [
      /* @__PURE__ */ y.jsx(pc, { "aria-hidden": "true" }),
      s.where
    ] })
  ] });
}
function em({ props: s, visibleDays: f }) {
  const a = f.find((w) => s.sessions.some((N) => N.day === w)) ?? f[0], [v, k] = te.useState(a);
  te.useEffect(() => {
    f.includes(v) || k(a);
  }, [v, a, f]);
  const x = Ic(s.sessions.filter((w) => w.day === v));
  return /* @__PURE__ */ y.jsxs("div", { className: "pp-agenda", children: [
    /* @__PURE__ */ y.jsx("div", { className: "pp-day-tabs", role: "tablist", "aria-label": s.labels.title, style: { "--pp-days": f.length }, children: f.map((w) => /* @__PURE__ */ y.jsxs("button", { type: "button", role: "tab", "aria-selected": v === w, className: v === w ? "is-active" : "", onClick: () => k(w), children: [
      s.dayLabels[w],
      s.sessions.some((N) => N.day === w) && /* @__PURE__ */ y.jsx("span", { "aria-hidden": "true" })
    ] }, w)) }),
    /* @__PURE__ */ y.jsx("div", { className: "pp-agenda-list", children: x.length ? x.map((w) => /* @__PURE__ */ y.jsxs(
      "button",
      {
        type: "button",
        className: `pp-agenda-card${w.conflict ? " is-conflict" : ""}`,
        style: { "--pp-color": w.color },
        onClick: () => s.onOpen(w.rowKey),
        children: [
          /* @__PURE__ */ y.jsxs("span", { className: "pp-agenda-time", children: [
            /* @__PURE__ */ y.jsx("b", { children: wn(w.start) }),
            /* @__PURE__ */ y.jsx("small", { children: wn(w.end) })
          ] }),
          /* @__PURE__ */ y.jsxs("span", { className: "pp-agenda-copy", children: [
            /* @__PURE__ */ y.jsxs("strong", { children: [
              /* @__PURE__ */ y.jsx("span", { className: "pp-color-dot" }),
              w.code
            ] }),
            /* @__PURE__ */ y.jsx("span", { className: "pp-agenda-name", children: w.name }),
            /* @__PURE__ */ y.jsx(Dc, { session: w, compact: !0 }),
            w.instructor && /* @__PURE__ */ y.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ y.jsx(hc, { "aria-hidden": "true" }),
              w.instructor
            ] }),
            w.where && /* @__PURE__ */ y.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ y.jsx(pc, { "aria-hidden": "true" }),
              w.where
            ] }),
            w.conflict && /* @__PURE__ */ y.jsxs("em", { children: [
              /* @__PURE__ */ y.jsx(mc, { "aria-hidden": "true" }),
              s.labels.conflict
            ] })
          ] })
        ]
      },
      w.key
    )) : /* @__PURE__ */ y.jsxs("div", { className: "pp-empty-day", children: [
      /* @__PURE__ */ y.jsx(Yi, { "aria-hidden": "true" }),
      /* @__PURE__ */ y.jsx("p", { children: s.labels.emptyDay })
    ] }) })
  ] });
}
function Fc(s) {
  const f = Jp(), [a, v] = te.useState(null), k = s.sessions.some((z) => z.day >= 5), x = s.showWeekend || k ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4], w = s.sessions.length > 0, N = te.useMemo(() => {
    if (!w) return { start: 480, end: 1080 };
    const z = Math.min(...s.sessions.map((ie) => ie.start)), J = Math.max(...s.sessions.map((ie) => ie.end));
    return s.showFullDay ? { start: 420, end: 1380 } : { start: Math.max(0, z - 60), end: Math.min(1440, J + 60) };
  }, [s.sessions, s.showFullDay, w]), L = 34, V = Math.max(1, Math.ceil((N.end - N.start) / 30)), W = V * L, B = /* @__PURE__ */ new Date(), D = (B.getDay() + 6) % 7, X = B.getHours() * 60 + B.getMinutes(), U = (X - N.start) / 30 * L;
  te.useEffect(() => {
    if (!a) return;
    const z = () => v(null);
    return window.addEventListener("pointerdown", z, { once: !0 }), window.addEventListener("blur", z, { once: !0 }), () => {
      window.removeEventListener("pointerdown", z), window.removeEventListener("blur", z);
    };
  }, [a]);
  const b = (z, J) => {
    z.preventDefault(), z.stopPropagation(), v({ session: J, x: Math.min(z.clientX, window.innerWidth - 232), y: Math.min(z.clientY, window.innerHeight - 230) });
  };
  return /* @__PURE__ */ y.jsxs("section", { className: "dersler-table-root program-planner-root", "aria-label": s.labels.title, children: [
    /* @__PURE__ */ y.jsxs("header", { className: "pp-heading", children: [
      /* @__PURE__ */ y.jsx("span", { className: "pp-heading-icon", children: /* @__PURE__ */ y.jsx(Yi, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ y.jsxs("span", { children: [
        /* @__PURE__ */ y.jsx("strong", { children: s.labels.title }),
        /* @__PURE__ */ y.jsxs("small", { children: [
          s.sessions.length,
          " ",
          s.labels.sessions,
          " · ",
          s.sectionCount,
          " ",
          s.labels.sections
        ] })
      ] })
    ] }),
    !w && !s.untimed.length ? /* @__PURE__ */ y.jsxs("div", { className: "pp-empty", children: [
      /* @__PURE__ */ y.jsx(ap, { "aria-hidden": "true" }),
      /* @__PURE__ */ y.jsx("strong", { children: s.labels.empty })
    ] }) : f && !s.forceGrid ? /* @__PURE__ */ y.jsx(em, { props: s, visibleDays: x }) : w ? /* @__PURE__ */ y.jsx("div", { className: "pp-calendar-scroll", children: /* @__PURE__ */ y.jsxs("div", { className: "pp-calendar", style: { "--pp-days": x.length }, children: [
      /* @__PURE__ */ y.jsxs("div", { className: "pp-calendar-head", children: [
        /* @__PURE__ */ y.jsx("span", {}),
        x.map((z) => /* @__PURE__ */ y.jsx("b", { children: s.dayLabels[z] }, z))
      ] }),
      /* @__PURE__ */ y.jsxs("div", { className: "pp-calendar-body", children: [
        /* @__PURE__ */ y.jsx("div", { className: "pp-time-column", style: { height: W }, children: Array.from({ length: V }, (z, J) => /* @__PURE__ */ y.jsx("span", { children: wn(N.start + J * 30) }, J)) }),
        x.map((z) => {
          const J = Ic(s.sessions.filter((K) => K.day === z)), ie = s.showNow && z === D && X >= N.start && X < N.end;
          return /* @__PURE__ */ y.jsxs("div", { className: `pp-day-column${z >= 5 ? " is-weekend" : ""}`, style: { height: W }, children: [
            ie && /* @__PURE__ */ y.jsx("span", { className: "pp-now", style: { top: U } }),
            J.map((K) => {
              const ue = (K.start - N.start) / 30 * L, Ne = Math.max(30, (K.end - K.start) / 30 * L), ke = 100 / K.laneCount, Ee = Ne < 104;
              return /* @__PURE__ */ y.jsxs(
                "button",
                {
                  type: "button",
                  className: `pp-session${Ee ? " is-short" : ""}${K.conflict ? " is-conflict" : ""}`,
                  style: {
                    top: ue,
                    height: Ne,
                    left: `calc(${K.lane * ke}% + 3px)`,
                    width: `calc(${ke}% - 6px)`,
                    "--pp-color": K.color,
                    "--pp-foreground": K.foreground
                  },
                  title: `${K.code} · ${K.name} · ${wn(K.start)}–${wn(K.end)} · CRN ${K.crn}`,
                  onClick: () => s.onOpen(K.rowKey),
                  onContextMenu: (Le) => b(Le, K),
                  children: [
                    /* @__PURE__ */ y.jsx(sp, { className: "pp-pin", "aria-hidden": "true" }),
                    /* @__PURE__ */ y.jsxs("strong", { children: [
                      K.code,
                      ": ",
                      /* @__PURE__ */ y.jsx("span", { children: K.name })
                    ] }),
                    /* @__PURE__ */ y.jsx(Dc, { session: K, compact: Ee }),
                    K.conflict && /* @__PURE__ */ y.jsxs("span", { className: "pp-conflict", children: [
                      /* @__PURE__ */ y.jsx(mc, { "aria-hidden": "true" }),
                      s.labels.conflict
                    ] }),
                    /* @__PURE__ */ y.jsx(rp, { className: "pp-more", "aria-hidden": "true" })
                  ]
                },
                K.key
              );
            })
          ] }, z);
        })
      ] })
    ] }) }) : null,
    !!s.untimed.length && /* @__PURE__ */ y.jsxs("div", { className: "pp-untimed", children: [
      /* @__PURE__ */ y.jsx(op, { "aria-hidden": "true" }),
      /* @__PURE__ */ y.jsxs("div", { children: [
        /* @__PURE__ */ y.jsx("strong", { children: s.untimed.some((z) => z.special) ? s.labels.special : s.labels.unknown }),
        s.untimed.map((z) => /* @__PURE__ */ y.jsxs("span", { children: [
          /* @__PURE__ */ y.jsx("b", { children: z.code }),
          " · CRN ",
          z.crn,
          " — ",
          z.detail
        ] }, z.key))
      ] })
    ] }),
    a && /* @__PURE__ */ y.jsxs("div", { className: "pp-context", role: "menu", "aria-label": `${a.session.code} ${s.labels.actions}`, style: { left: a.x, top: a.y }, onPointerDown: (z) => z.stopPropagation(), children: [
      /* @__PURE__ */ y.jsxs("p", { children: [
        /* @__PURE__ */ y.jsx("strong", { children: a.session.code }),
        /* @__PURE__ */ y.jsxs("span", { children: [
          "CRN ",
          a.session.crn
        ] })
      ] }),
      /* @__PURE__ */ y.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        s.onOpen(a.session.rowKey), v(null);
      }, children: [
        /* @__PURE__ */ y.jsx(Yi, {}),
        s.labels.details
      ] }),
      /* @__PURE__ */ y.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        s.onCopyCrn(a.session.rowKey), v(null);
      }, children: [
        /* @__PURE__ */ y.jsx(np, {}),
        s.labels.copyCrn
      ] }),
      /* @__PURE__ */ y.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        s.onOpenObs(a.session.rowKey), v(null);
      }, children: [
        /* @__PURE__ */ y.jsx(lp, {}),
        s.labels.openObs
      ] }),
      /* @__PURE__ */ y.jsxs("button", { type: "button", role: "menuitem", className: "is-danger", onClick: () => {
        s.onRemove(a.session.rowKey), v(null);
      }, children: [
        /* @__PURE__ */ y.jsx(up, {}),
        s.labels.remove
      ] })
    ] })
  ] });
}
const tm = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--sans);font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--mono);font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.dersler-table-root .dt-relative{position:relative}.dersler-table-root .dt--ml-3{margin-left:-.75rem}.dersler-table-root .dt-ml-1\\.5{margin-left:.375rem}.dersler-table-root .dt-inline{display:inline}.dersler-table-root .dt-inline-flex{display:inline-flex}.dersler-table-root .dt-size-3\\.5{width:.875rem;height:.875rem}.dersler-table-root .dt-size-4{width:1rem;height:1rem}.dersler-table-root .dt-h-10{height:2.5rem}.dersler-table-root .dt-h-12{height:3rem}.dersler-table-root .dt-h-9{height:2.25rem}.dersler-table-root .dt-w-8{width:2rem}.dersler-table-root .dt-w-full{width:100%}.dersler-table-root .dt-caption-bottom{caption-side:bottom}.dersler-table-root .dt-cursor-pointer{cursor:pointer}.dersler-table-root .dt-items-center{align-items:center}.dersler-table-root .dt-justify-center{justify-content:center}.dersler-table-root .dt-overflow-auto{overflow:auto}.dersler-table-root .dt-overflow-hidden{overflow:hidden}.dersler-table-root .dt-whitespace-nowrap{white-space:nowrap}.dersler-table-root .dt-rounded-lg{border-radius:var(--radius-card)}.dersler-table-root .dt-rounded-md{border-radius:calc(var(--radius-card) - 2px)}.dersler-table-root .dt-border{border-width:1px}.dersler-table-root .dt-border-b{border-bottom-width:1px}.dersler-table-root .dt-border-border{border-color:var(--hairline)}.dersler-table-root .dt-bg-primary{background-color:var(--acid)}.dersler-table-root .dt-p-2{padding:.5rem}.dersler-table-root .dt-p-4{padding:1rem}.dersler-table-root .dt-p-6{padding:1.5rem}.dersler-table-root .dt-px-3{padding-left:.75rem;padding-right:.75rem}.dersler-table-root .dt-px-4{padding-left:1rem;padding-right:1rem}.dersler-table-root .dt-py-2{padding-top:.5rem;padding-bottom:.5rem}.dersler-table-root .dt-text-left{text-align:left}.dersler-table-root .dt-text-center{text-align:center}.dersler-table-root .dt-text-right{text-align:right}.dersler-table-root .dt-align-middle{vertical-align:middle}.dersler-table-root .dt-font-mono{font-family:var(--mono)}.dersler-table-root .dt-text-base{font-size:1rem;line-height:1.5rem}.dersler-table-root .dt-text-sm{font-size:.875rem;line-height:1.25rem}.dersler-table-root .dt-text-xs{font-size:.75rem;line-height:1rem}.dersler-table-root .dt-font-medium{font-weight:500}.dersler-table-root .dt-tabular-nums{--tw-numeric-spacing: tabular-nums;font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)}.dersler-table-root .dt-leading-none{line-height:1}.dersler-table-root .dt-text-muted-foreground{color:var(--dim)}.dersler-table-root .dt-text-primary-foreground{color:var(--on-accent)}.dersler-table-root .dt-opacity-40{opacity:.4}.dersler-table-root .dt-transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dersler-table-root{font-family:var(--sans);color:var(--fg)}.program-planner-root{--pp-slot: 34px;position:relative;min-width:0}.pp-heading{display:flex;align-items:center;gap:11px;margin:0 0 12px}.pp-heading-icon{display:grid;width:36px;height:36px;place-items:center;flex:0 0 auto;border:1px solid color-mix(in srgb,var(--acid) 34%,var(--line));border-radius:10px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.pp-heading-icon svg{width:18px;height:18px}.pp-heading>span:last-child{display:grid;gap:2px;min-width:0}.pp-heading strong{font-size:14px;letter-spacing:-.01em}.pp-heading small{color:var(--dimmer);font:10px/1.35 var(--mono)}.pp-loading{display:grid;min-height:260px;place-items:center;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2);font:11px/1.4 var(--mono)}.pp-calendar-scroll{max-height:min(69vh,780px);overflow:auto;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);scrollbar-width:thin}.pp-calendar{min-width:760px}.pp-calendar-head,.pp-calendar-body{display:grid;grid-template-columns:62px repeat(var(--pp-days),minmax(130px,1fr))}.pp-calendar-head{position:sticky;top:0;z-index:20;min-height:43px;border-bottom:1px solid var(--hairline-strong);background:var(--panel)}.pp-calendar-head>*{display:grid;place-items:center;border-right:1px solid var(--line)}.pp-calendar-head>span{position:sticky;left:0;z-index:22;background:var(--panel)}.pp-calendar-head b{color:var(--dim);font:700 10px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase}.pp-time-column{position:sticky;left:0;z-index:10;background:var(--panel);box-shadow:1px 0 0 var(--hairline-strong)}.pp-time-column span{display:block;height:var(--pp-slot);padding:5px 9px 0 0;color:var(--dimmer);text-align:right;font:9px/1 var(--mono);transform:translateY(-9px)}.pp-day-column{position:relative;min-width:0;border-right:1px solid var(--line);background-color:color-mix(in srgb,var(--panel) 97%,var(--fg));background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--pp-slot) - 1px),var(--line) calc(var(--pp-slot) - 1px),var(--line) var(--pp-slot))}.pp-day-column.is-weekend{background-color:var(--panel-2)}.pp-session{position:absolute;z-index:2;display:flex;flex-direction:column;gap:5px;overflow:hidden;padding:10px 25px 8px 10px;border:1px solid color-mix(in srgb,var(--pp-foreground) 25%,transparent);border-radius:8px;color:var(--pp-foreground);text-align:left;background:var(--pp-color);box-shadow:0 2px 6px color-mix(in srgb,var(--pp-color) 30%,transparent);cursor:pointer;transition:filter .14s ease,box-shadow .14s ease,transform .14s ease}.pp-session:hover,.pp-session:focus-visible{z-index:6;filter:saturate(1.08) brightness(1.04);box-shadow:0 7px 18px color-mix(in srgb,var(--pp-color) 42%,transparent);transform:translateY(-1px)}.pp-session:focus-visible{outline:3px solid var(--acid);outline-offset:2px}.pp-session.is-conflict{border:2px solid var(--red)}.pp-session.is-short{justify-content:center;padding-block:5px}.pp-session.is-short .pp-session-meta{display:none}.pp-session>strong{display:-webkit-box;overflow:hidden;color:inherit;font:800 11px/1.26 var(--sans);-webkit-box-orient:vertical;-webkit-line-clamp:3}.pp-session>strong span{font-weight:650}.pp-pin,.pp-more{position:absolute;right:7px;width:14px;height:14px;opacity:.75}.pp-pin{top:8px}.pp-more{bottom:7px}.pp-session-meta{display:grid;gap:3px;min-width:0}.pp-session-meta>span,.pp-agenda-detail{display:flex;align-items:center;gap:5px;min-width:0;overflow:hidden;color:inherit;font:9px/1.2 var(--mono);text-overflow:ellipsis;white-space:nowrap}.pp-session-meta svg,.pp-agenda-detail svg{width:11px;height:11px;flex:0 0 auto}.pp-conflict{display:flex;align-items:center;gap:4px;margin-top:auto;font:800 9px/1 var(--mono)}.pp-conflict svg{width:11px;height:11px}.pp-now{position:absolute;z-index:7;right:0;left:0;height:2px;background:var(--acid);pointer-events:none}.pp-now:before{position:absolute;top:-3px;left:-1px;width:8px;height:8px;border-radius:50%;background:var(--acid);content:""}.pp-empty,.pp-empty-day{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2)}.pp-empty svg,.pp-empty-day svg{width:25px;height:25px}.pp-empty strong,.pp-empty-day p{margin:0;font-size:12px}.pp-untimed{display:flex;gap:10px;margin-top:12px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-untimed>svg{width:18px;height:18px;flex:0 0 auto;color:var(--amber)}.pp-untimed>div{display:grid;gap:5px}.pp-untimed strong{font-size:11px}.pp-untimed span{color:var(--dim);font:10px/1.4 var(--mono)}.pp-context{position:fixed;z-index:10010;display:grid;width:224px;overflow:hidden;padding:6px;border:1px solid var(--hairline-strong);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pp-context p{display:grid;gap:2px;margin:0 0 4px;padding:8px 9px;border-bottom:1px solid var(--line)}.pp-context p strong{font-size:12px}.pp-context p span{color:var(--dimmer);font:9px/1 var(--mono)}.pp-context button{display:flex;align-items:center;gap:9px;width:100%;padding:8px 9px;border:0;border-radius:6px;color:var(--fg);text-align:left;background:transparent;font:11px/1.2 var(--sans)}.pp-context button:hover,.pp-context button:focus-visible{background:var(--panel-2)}.pp-context button.is-danger{color:var(--red)}.pp-context button svg{width:14px;height:14px}.pp-agenda{min-width:0}.pp-day-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:12px;padding:4px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-day-tabs button{position:relative;min-width:0;min-height:38px;border:0;border-radius:7px;color:var(--dim);background:transparent;font:700 10px/1 var(--mono)}.pp-day-tabs button.is-active{color:var(--panel);background:var(--fg)}.pp-day-tabs button>span{position:absolute;bottom:5px;left:50%;width:3px;height:3px;border-radius:50%;background:var(--acid)}.pp-agenda-list{display:grid;gap:8px}.pp-agenda-card{--pp-color: var(--cyan);display:grid;grid-template-columns:54px minmax(0,1fr);gap:12px;width:100%;padding:13px;border:1px solid var(--line);border-radius:11px;color:var(--fg);text-align:left;background:var(--panel);box-shadow:inset 4px 0 0 var(--pp-color)}.pp-agenda-card.is-conflict{border-color:var(--red)}.pp-agenda-time{display:grid;align-content:start;gap:3px;font:11px/1 var(--mono)}.pp-agenda-time small{color:var(--dimmer);font-size:9px}.pp-agenda-copy{display:grid;gap:5px;min-width:0}.pp-agenda-copy>strong{display:flex;align-items:center;gap:7px;font-size:13px}.pp-color-dot{width:7px;height:7px;border-radius:50%;background:var(--pp-color)}.pp-agenda-name{color:var(--dim);font-size:12px}.pp-agenda-copy em{display:flex;align-items:center;gap:5px;color:var(--red);font:700 10px/1 var(--mono)}.pp-agenda-copy em svg{width:12px;height:12px}.pp-empty-day{min-height:150px}@media(max-width:600px){.pp-heading{margin-bottom:10px}.pp-heading-icon{width:32px;height:32px}.pp-day-tabs{overflow-x:auto;grid-template-columns:repeat(var(--pp-days, 5),minmax(48px,1fr))}}@media(prefers-reduced-motion:reduce){.pp-session{transition:none}}@media print{.program-planner-root .pp-calendar-scroll{max-height:none;overflow:visible;box-shadow:none}.program-planner-root .pp-calendar{min-width:0}.program-planner-root .pp-context{display:none}}.dersler-table-root .hover\\:dt-bg-accent:hover{background-color:var(--panel-2)}.dersler-table-root .hover\\:dt-text-accent-foreground:hover{color:var(--acid)}.dersler-table-root .focus-visible\\:dt-outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.dersler-table-root .focus-visible\\:dt-ring-2:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.dersler-table-root .focus-visible\\:dt-ring-ring:focus-visible{--tw-ring-color: var(--cyan)}.dersler-table-root .focus-visible\\:dt-ring-offset-2:focus-visible{--tw-ring-offset-width: 2px}.dersler-table-root .disabled\\:dt-pointer-events-none:disabled{pointer-events:none}.dersler-table-root .disabled\\:dt-opacity-50:disabled{opacity:.5}.dersler-table-root .data-\\[state\\=selected\\]\\:dt-bg-muted[data-state=selected]{background-color:var(--panel-2)}.dersler-table-root .\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:dt-pr-0:has([role=checkbox]){padding-right:0}.dersler-table-root :is(.\\[\\&_tr\\:last-child\\]\\:dt-border-0 tr:last-child){border-width:0px}.dersler-table-root :is(.\\[\\&_tr\\]\\:dt-border-b tr){border-bottom-width:1px}';
let ln = null, It = null, Kl = null;
function Ac() {
  Kl || (Kl = document.createElement("style"), Kl.textContent = tm, document.head.appendChild(Kl));
}
function nm(s, f) {
  Ac(), ln = dc.createRoot(s), ln.render(
    /* @__PURE__ */ y.jsx(te.StrictMode, { children: /* @__PURE__ */ y.jsx(Oc, { ...f }) })
  );
}
function rm(s) {
  ln && ln.render(
    /* @__PURE__ */ y.jsx(te.StrictMode, { children: /* @__PURE__ */ y.jsx(Oc, { ...s }) })
  );
}
function lm() {
  ln == null || ln.unmount(), ln = null;
}
function om(s, f) {
  Ac(), It = dc.createRoot(s), It.render(/* @__PURE__ */ y.jsx(Fc, { ...f }));
}
function im(s) {
  It == null || It.render(/* @__PURE__ */ y.jsx(Fc, { ...s }));
}
function sm() {
  It == null || It.unmount(), It = null;
}
export {
  nm as mount,
  om as mountProgram,
  lm as unmount,
  sm as unmountProgram,
  rm as update,
  im as updateProgram
};
