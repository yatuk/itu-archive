function Bp(a, c) {
  for (var s = 0; s < c.length; s++) {
    const g = c[s];
    if (typeof g != "string" && !Array.isArray(g)) {
      for (const w in g)
        if (w !== "default" && !(w in a)) {
          const x = Object.getOwnPropertyDescriptor(g, w);
          x && Object.defineProperty(a, w, x.get ? x : {
            enumerable: !0,
            get: () => g[w]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }));
}
function Wp(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Xi = { exports: {} }, Or = {}, Zi = { exports: {} }, te = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var oc;
function Qp() {
  if (oc) return te;
  oc = 1;
  var a = Symbol.for("react.element"), c = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), x = Symbol.for("react.provider"), k = Symbol.for("react.context"), S = Symbol.for("react.forward_ref"), L = Symbol.for("react.suspense"), V = Symbol.for("react.memo"), G = Symbol.for("react.lazy"), H = Symbol.iterator;
  function D(m) {
    return m === null || typeof m != "object" ? null : (m = H && m[H] || m["@@iterator"], typeof m == "function" ? m : null);
  }
  var q = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, N = Object.assign, z = {};
  function C(m, b, J) {
    this.props = m, this.context = b, this.refs = z, this.updater = J || q;
  }
  C.prototype.isReactComponent = {}, C.prototype.setState = function(m, b) {
    if (typeof m != "object" && typeof m != "function" && m != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, m, b, "setState");
  }, C.prototype.forceUpdate = function(m) {
    this.updater.enqueueForceUpdate(this, m, "forceUpdate");
  };
  function B() {
  }
  B.prototype = C.prototype;
  function U(m, b, J) {
    this.props = m, this.context = b, this.refs = z, this.updater = J || q;
  }
  var W = U.prototype = new B();
  W.constructor = U, N(W, C.prototype), W.isPureReactComponent = !0;
  var ee = Array.isArray, pe = Object.prototype.hasOwnProperty, xe = { current: null }, we = { key: !0, ref: !0, __self: !0, __source: !0 };
  function je(m, b, J) {
    var ne, oe = {}, ie = null, ce = null;
    if (b != null) for (ne in b.ref !== void 0 && (ce = b.ref), b.key !== void 0 && (ie = "" + b.key), b) pe.call(b, ne) && !we.hasOwnProperty(ne) && (oe[ne] = b[ne]);
    var se = arguments.length - 2;
    if (se === 1) oe.children = J;
    else if (1 < se) {
      for (var ve = Array(se), et = 0; et < se; et++) ve[et] = arguments[et + 2];
      oe.children = ve;
    }
    if (m && m.defaultProps) for (ne in se = m.defaultProps, se) oe[ne] === void 0 && (oe[ne] = se[ne]);
    return { $$typeof: a, type: m, key: ie, ref: ce, props: oe, _owner: xe.current };
  }
  function De(m, b) {
    return { $$typeof: a, type: m.type, key: b, ref: m.ref, props: m.props, _owner: m._owner };
  }
  function qe(m) {
    return typeof m == "object" && m !== null && m.$$typeof === a;
  }
  function dt(m) {
    var b = { "=": "=0", ":": "=2" };
    return "$" + m.replace(/[=:]/g, function(J) {
      return b[J];
    });
  }
  var re = /\/+/g;
  function Ae(m, b) {
    return typeof m == "object" && m !== null && m.key != null ? dt("" + m.key) : b.toString(36);
  }
  function Fe(m, b, J, ne, oe) {
    var ie = typeof m;
    (ie === "undefined" || ie === "boolean") && (m = null);
    var ce = !1;
    if (m === null) ce = !0;
    else switch (ie) {
      case "string":
      case "number":
        ce = !0;
        break;
      case "object":
        switch (m.$$typeof) {
          case a:
          case c:
            ce = !0;
        }
    }
    if (ce) return ce = m, oe = oe(ce), m = ne === "" ? "." + Ae(ce, 0) : ne, ee(oe) ? (J = "", m != null && (J = m.replace(re, "$&/") + "/"), Fe(oe, b, J, "", function(et) {
      return et;
    })) : oe != null && (qe(oe) && (oe = De(oe, J + (!oe.key || ce && ce.key === oe.key ? "" : ("" + oe.key).replace(re, "$&/") + "/") + m)), b.push(oe)), 1;
    if (ce = 0, ne = ne === "" ? "." : ne + ":", ee(m)) for (var se = 0; se < m.length; se++) {
      ie = m[se];
      var ve = ne + Ae(ie, se);
      ce += Fe(ie, b, J, ve, oe);
    }
    else if (ve = D(m), typeof ve == "function") for (m = ve.call(m), se = 0; !(ie = m.next()).done; ) ie = ie.value, ve = ne + Ae(ie, se++), ce += Fe(ie, b, J, ve, oe);
    else if (ie === "object") throw b = String(m), Error("Objects are not valid as a React child (found: " + (b === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
    return ce;
  }
  function Je(m, b, J) {
    if (m == null) return m;
    var ne = [], oe = 0;
    return Fe(m, ne, "", "", function(ie) {
      return b.call(J, ie, oe++);
    }), ne;
  }
  function Ne(m) {
    if (m._status === -1) {
      var b = m._result;
      b = b(), b.then(function(J) {
        (m._status === 0 || m._status === -1) && (m._status = 1, m._result = J);
      }, function(J) {
        (m._status === 0 || m._status === -1) && (m._status = 2, m._result = J);
      }), m._status === -1 && (m._status = 0, m._result = b);
    }
    if (m._status === 1) return m._result.default;
    throw m._result;
  }
  var fe = { current: null }, M = { transition: null }, $ = { ReactCurrentDispatcher: fe, ReactCurrentBatchConfig: M, ReactCurrentOwner: xe };
  function T() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return te.Children = { map: Je, forEach: function(m, b, J) {
    Je(m, function() {
      b.apply(this, arguments);
    }, J);
  }, count: function(m) {
    var b = 0;
    return Je(m, function() {
      b++;
    }), b;
  }, toArray: function(m) {
    return Je(m, function(b) {
      return b;
    }) || [];
  }, only: function(m) {
    if (!qe(m)) throw Error("React.Children.only expected to receive a single React element child.");
    return m;
  } }, te.Component = C, te.Fragment = s, te.Profiler = w, te.PureComponent = U, te.StrictMode = g, te.Suspense = L, te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = $, te.act = T, te.cloneElement = function(m, b, J) {
    if (m == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + m + ".");
    var ne = N({}, m.props), oe = m.key, ie = m.ref, ce = m._owner;
    if (b != null) {
      if (b.ref !== void 0 && (ie = b.ref, ce = xe.current), b.key !== void 0 && (oe = "" + b.key), m.type && m.type.defaultProps) var se = m.type.defaultProps;
      for (ve in b) pe.call(b, ve) && !we.hasOwnProperty(ve) && (ne[ve] = b[ve] === void 0 && se !== void 0 ? se[ve] : b[ve]);
    }
    var ve = arguments.length - 2;
    if (ve === 1) ne.children = J;
    else if (1 < ve) {
      se = Array(ve);
      for (var et = 0; et < ve; et++) se[et] = arguments[et + 2];
      ne.children = se;
    }
    return { $$typeof: a, type: m.type, key: oe, ref: ie, props: ne, _owner: ce };
  }, te.createContext = function(m) {
    return m = { $$typeof: k, _currentValue: m, _currentValue2: m, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, m.Provider = { $$typeof: x, _context: m }, m.Consumer = m;
  }, te.createElement = je, te.createFactory = function(m) {
    var b = je.bind(null, m);
    return b.type = m, b;
  }, te.createRef = function() {
    return { current: null };
  }, te.forwardRef = function(m) {
    return { $$typeof: S, render: m };
  }, te.isValidElement = qe, te.lazy = function(m) {
    return { $$typeof: G, _payload: { _status: -1, _result: m }, _init: Ne };
  }, te.memo = function(m, b) {
    return { $$typeof: V, type: m, compare: b === void 0 ? null : b };
  }, te.startTransition = function(m) {
    var b = M.transition;
    M.transition = {};
    try {
      m();
    } finally {
      M.transition = b;
    }
  }, te.unstable_act = T, te.useCallback = function(m, b) {
    return fe.current.useCallback(m, b);
  }, te.useContext = function(m) {
    return fe.current.useContext(m);
  }, te.useDebugValue = function() {
  }, te.useDeferredValue = function(m) {
    return fe.current.useDeferredValue(m);
  }, te.useEffect = function(m, b) {
    return fe.current.useEffect(m, b);
  }, te.useId = function() {
    return fe.current.useId();
  }, te.useImperativeHandle = function(m, b, J) {
    return fe.current.useImperativeHandle(m, b, J);
  }, te.useInsertionEffect = function(m, b) {
    return fe.current.useInsertionEffect(m, b);
  }, te.useLayoutEffect = function(m, b) {
    return fe.current.useLayoutEffect(m, b);
  }, te.useMemo = function(m, b) {
    return fe.current.useMemo(m, b);
  }, te.useReducer = function(m, b, J) {
    return fe.current.useReducer(m, b, J);
  }, te.useRef = function(m) {
    return fe.current.useRef(m);
  }, te.useState = function(m) {
    return fe.current.useState(m);
  }, te.useSyncExternalStore = function(m, b, J) {
    return fe.current.useSyncExternalStore(m, b, J);
  }, te.useTransition = function() {
    return fe.current.useTransition();
  }, te.version = "18.3.1", te;
}
var ic;
function ia() {
  return ic || (ic = 1, Zi.exports = Qp()), Zi.exports;
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
var ac;
function Kp() {
  if (ac) return Or;
  ac = 1;
  var a = ia(), c = Symbol.for("react.element"), s = Symbol.for("react.fragment"), g = Object.prototype.hasOwnProperty, w = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, x = { key: !0, ref: !0, __self: !0, __source: !0 };
  function k(S, L, V) {
    var G, H = {}, D = null, q = null;
    V !== void 0 && (D = "" + V), L.key !== void 0 && (D = "" + L.key), L.ref !== void 0 && (q = L.ref);
    for (G in L) g.call(L, G) && !x.hasOwnProperty(G) && (H[G] = L[G]);
    if (S && S.defaultProps) for (G in L = S.defaultProps, L) H[G] === void 0 && (H[G] = L[G]);
    return { $$typeof: c, type: S, key: D, ref: q, props: H, _owner: w.current };
  }
  return Or.Fragment = s, Or.jsx = k, Or.jsxs = k, Or;
}
var sc;
function Gp() {
  return sc || (sc = 1, Xi.exports = Kp()), Xi.exports;
}
var f = Gp(), X = ia();
const Yp = /* @__PURE__ */ Wp(X), Xp = /* @__PURE__ */ Bp({
  __proto__: null,
  default: Yp
}, [X]);
var Yl = {}, qi = { exports: {} }, Ze = {}, Ji = { exports: {} }, ea = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var uc;
function Zp() {
  return uc || (uc = 1, (function(a) {
    function c(M, $) {
      var T = M.length;
      M.push($);
      e: for (; 0 < T; ) {
        var m = T - 1 >>> 1, b = M[m];
        if (0 < w(b, $)) M[m] = $, M[T] = b, T = m;
        else break e;
      }
    }
    function s(M) {
      return M.length === 0 ? null : M[0];
    }
    function g(M) {
      if (M.length === 0) return null;
      var $ = M[0], T = M.pop();
      if (T !== $) {
        M[0] = T;
        e: for (var m = 0, b = M.length, J = b >>> 1; m < J; ) {
          var ne = 2 * (m + 1) - 1, oe = M[ne], ie = ne + 1, ce = M[ie];
          if (0 > w(oe, T)) ie < b && 0 > w(ce, oe) ? (M[m] = ce, M[ie] = T, m = ie) : (M[m] = oe, M[ne] = T, m = ne);
          else if (ie < b && 0 > w(ce, T)) M[m] = ce, M[ie] = T, m = ie;
          else break e;
        }
      }
      return $;
    }
    function w(M, $) {
      var T = M.sortIndex - $.sortIndex;
      return T !== 0 ? T : M.id - $.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var x = performance;
      a.unstable_now = function() {
        return x.now();
      };
    } else {
      var k = Date, S = k.now();
      a.unstable_now = function() {
        return k.now() - S;
      };
    }
    var L = [], V = [], G = 1, H = null, D = 3, q = !1, N = !1, z = !1, C = typeof setTimeout == "function" ? setTimeout : null, B = typeof clearTimeout == "function" ? clearTimeout : null, U = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function W(M) {
      for (var $ = s(V); $ !== null; ) {
        if ($.callback === null) g(V);
        else if ($.startTime <= M) g(V), $.sortIndex = $.expirationTime, c(L, $);
        else break;
        $ = s(V);
      }
    }
    function ee(M) {
      if (z = !1, W(M), !N) if (s(L) !== null) N = !0, Ne(pe);
      else {
        var $ = s(V);
        $ !== null && fe(ee, $.startTime - M);
      }
    }
    function pe(M, $) {
      N = !1, z && (z = !1, B(je), je = -1), q = !0;
      var T = D;
      try {
        for (W($), H = s(L); H !== null && (!(H.expirationTime > $) || M && !dt()); ) {
          var m = H.callback;
          if (typeof m == "function") {
            H.callback = null, D = H.priorityLevel;
            var b = m(H.expirationTime <= $);
            $ = a.unstable_now(), typeof b == "function" ? H.callback = b : H === s(L) && g(L), W($);
          } else g(L);
          H = s(L);
        }
        if (H !== null) var J = !0;
        else {
          var ne = s(V);
          ne !== null && fe(ee, ne.startTime - $), J = !1;
        }
        return J;
      } finally {
        H = null, D = T, q = !1;
      }
    }
    var xe = !1, we = null, je = -1, De = 5, qe = -1;
    function dt() {
      return !(a.unstable_now() - qe < De);
    }
    function re() {
      if (we !== null) {
        var M = a.unstable_now();
        qe = M;
        var $ = !0;
        try {
          $ = we(!0, M);
        } finally {
          $ ? Ae() : (xe = !1, we = null);
        }
      } else xe = !1;
    }
    var Ae;
    if (typeof U == "function") Ae = function() {
      U(re);
    };
    else if (typeof MessageChannel < "u") {
      var Fe = new MessageChannel(), Je = Fe.port2;
      Fe.port1.onmessage = re, Ae = function() {
        Je.postMessage(null);
      };
    } else Ae = function() {
      C(re, 0);
    };
    function Ne(M) {
      we = M, xe || (xe = !0, Ae());
    }
    function fe(M, $) {
      je = C(function() {
        M(a.unstable_now());
      }, $);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(M) {
      M.callback = null;
    }, a.unstable_continueExecution = function() {
      N || q || (N = !0, Ne(pe));
    }, a.unstable_forceFrameRate = function(M) {
      0 > M || 125 < M ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : De = 0 < M ? Math.floor(1e3 / M) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return D;
    }, a.unstable_getFirstCallbackNode = function() {
      return s(L);
    }, a.unstable_next = function(M) {
      switch (D) {
        case 1:
        case 2:
        case 3:
          var $ = 3;
          break;
        default:
          $ = D;
      }
      var T = D;
      D = $;
      try {
        return M();
      } finally {
        D = T;
      }
    }, a.unstable_pauseExecution = function() {
    }, a.unstable_requestPaint = function() {
    }, a.unstable_runWithPriority = function(M, $) {
      switch (M) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          M = 3;
      }
      var T = D;
      D = M;
      try {
        return $();
      } finally {
        D = T;
      }
    }, a.unstable_scheduleCallback = function(M, $, T) {
      var m = a.unstable_now();
      switch (typeof T == "object" && T !== null ? (T = T.delay, T = typeof T == "number" && 0 < T ? m + T : m) : T = m, M) {
        case 1:
          var b = -1;
          break;
        case 2:
          b = 250;
          break;
        case 5:
          b = 1073741823;
          break;
        case 4:
          b = 1e4;
          break;
        default:
          b = 5e3;
      }
      return b = T + b, M = { id: G++, callback: $, priorityLevel: M, startTime: T, expirationTime: b, sortIndex: -1 }, T > m ? (M.sortIndex = T, c(V, M), s(L) === null && M === s(V) && (z ? (B(je), je = -1) : z = !0, fe(ee, T - m))) : (M.sortIndex = b, c(L, M), N || q || (N = !0, Ne(pe))), M;
    }, a.unstable_shouldYield = dt, a.unstable_wrapCallback = function(M) {
      var $ = D;
      return function() {
        var T = D;
        D = $;
        try {
          return M.apply(this, arguments);
        } finally {
          D = T;
        }
      };
    };
  })(ea)), ea;
}
var cc;
function qp() {
  return cc || (cc = 1, Ji.exports = Zp()), Ji.exports;
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
var dc;
function Jp() {
  if (dc) return Ze;
  dc = 1;
  var a = ia(), c = qp();
  function s(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var g = /* @__PURE__ */ new Set(), w = {};
  function x(e, t) {
    k(e, t), k(e + "Capture", t);
  }
  function k(e, t) {
    for (w[e] = t, e = 0; e < t.length; e++) g.add(t[e]);
  }
  var S = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), L = Object.prototype.hasOwnProperty, V = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, G = {}, H = {};
  function D(e) {
    return L.call(H, e) ? !0 : L.call(G, e) ? !1 : V.test(e) ? H[e] = !0 : (G[e] = !0, !1);
  }
  function q(e, t, n, r) {
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
  function N(e, t, n, r) {
    if (t === null || typeof t > "u" || q(e, t, n, r)) return !0;
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
  function z(e, t, n, r, l, o, i) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = i;
  }
  var C = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    C[e] = new z(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    C[t] = new z(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    C[e] = new z(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    C[e] = new z(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    C[e] = new z(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    C[e] = new z(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    C[e] = new z(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    C[e] = new z(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    C[e] = new z(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var B = /[\-:]([a-z])/g;
  function U(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      B,
      U
    );
    C[t] = new z(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(B, U);
    C[t] = new z(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(B, U);
    C[t] = new z(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    C[e] = new z(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), C.xlinkHref = new z("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    C[e] = new z(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function W(e, t, n, r) {
    var l = C.hasOwnProperty(t) ? C[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (N(t, n, l, r) && (n = null), r || l === null ? D(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ee = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, pe = Symbol.for("react.element"), xe = Symbol.for("react.portal"), we = Symbol.for("react.fragment"), je = Symbol.for("react.strict_mode"), De = Symbol.for("react.profiler"), qe = Symbol.for("react.provider"), dt = Symbol.for("react.context"), re = Symbol.for("react.forward_ref"), Ae = Symbol.for("react.suspense"), Fe = Symbol.for("react.suspense_list"), Je = Symbol.for("react.memo"), Ne = Symbol.for("react.lazy"), fe = Symbol.for("react.offscreen"), M = Symbol.iterator;
  function $(e) {
    return e === null || typeof e != "object" ? null : (e = M && e[M] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var T = Object.assign, m;
  function b(e) {
    if (m === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      m = t && t[1] || "";
    }
    return `
` + m + e;
  }
  var J = !1;
  function ne(e, t) {
    if (!e || J) return "";
    J = !0;
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
        } catch (y) {
          var r = y;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (y) {
          r = y;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (y) {
          r = y;
        }
        e();
      }
    } catch (y) {
      if (y && r && typeof y.stack == "string") {
        for (var l = y.stack.split(`
`), o = r.stack.split(`
`), i = l.length - 1, u = o.length - 1; 1 <= i && 0 <= u && l[i] !== o[u]; ) u--;
        for (; 1 <= i && 0 <= u; i--, u--) if (l[i] !== o[u]) {
          if (i !== 1 || u !== 1)
            do
              if (i--, u--, 0 > u || l[i] !== o[u]) {
                var d = `
` + l[i].replace(" at new ", " at ");
                return e.displayName && d.includes("<anonymous>") && (d = d.replace("<anonymous>", e.displayName)), d;
              }
            while (1 <= i && 0 <= u);
          break;
        }
      }
    } finally {
      J = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? b(e) : "";
  }
  function oe(e) {
    switch (e.tag) {
      case 5:
        return b(e.type);
      case 16:
        return b("Lazy");
      case 13:
        return b("Suspense");
      case 19:
        return b("SuspenseList");
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
  function ie(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case we:
        return "Fragment";
      case xe:
        return "Portal";
      case De:
        return "Profiler";
      case je:
        return "StrictMode";
      case Ae:
        return "Suspense";
      case Fe:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case dt:
        return (e.displayName || "Context") + ".Consumer";
      case qe:
        return (e._context.displayName || "Context") + ".Provider";
      case re:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Je:
        return t = e.displayName || null, t !== null ? t : ie(e.type) || "Memo";
      case Ne:
        t = e._payload, e = e._init;
        try {
          return ie(e(t));
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
        return ie(t);
      case 8:
        return t === je ? "StrictMode" : "Mode";
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
  function ve(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function et(e) {
    var t = ve(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function Fr(e) {
    e._valueTracker || (e._valueTracker = et(e));
  }
  function da(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = ve(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Ur(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function no(e, t) {
    var n = t.checked;
    return T({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function pa(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = se(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function fa(e, t) {
    t = t.checked, t != null && W(e, "checked", t, !1);
  }
  function ro(e, t) {
    fa(e, t);
    var n = se(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? lo(e, t.type, n) : t.hasOwnProperty("defaultValue") && lo(e, t.type, se(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function ma(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function lo(e, t, n) {
    (t !== "number" || Ur(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Xn = Array.isArray;
  function Cn(e, t, n, r) {
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
  function oo(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(s(91));
    return T({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function ha(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(s(92));
        if (Xn(n)) {
          if (1 < n.length) throw Error(s(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: se(n) };
  }
  function ga(e, t) {
    var n = se(t.value), r = se(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function va(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function ya(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function io(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? ya(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Vr, xa = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Vr = Vr || document.createElement("div"), Vr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Vr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Zn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var qn = {
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
  }, Gc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(qn).forEach(function(e) {
    Gc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), qn[t] = qn[e];
    });
  });
  function wa(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || qn.hasOwnProperty(e) && qn[e] ? ("" + t).trim() : t + "px";
  }
  function ka(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = wa(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Yc = T({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function ao(e, t) {
    if (t) {
      if (Yc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(s(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(s(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(s(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(s(62));
    }
  }
  function so(e, t) {
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
  var uo = null;
  function co(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var po = null, En = null, bn = null;
  function Sa(e) {
    if (e = wr(e)) {
      if (typeof po != "function") throw Error(s(280));
      var t = e.stateNode;
      t && (t = cl(t), po(e.stateNode, e.type, t));
    }
  }
  function Ca(e) {
    En ? bn ? bn.push(e) : bn = [e] : En = e;
  }
  function Ea() {
    if (En) {
      var e = En, t = bn;
      if (bn = En = null, Sa(e), t) for (e = 0; e < t.length; e++) Sa(t[e]);
    }
  }
  function ba(e, t) {
    return e(t);
  }
  function ja() {
  }
  var fo = !1;
  function _a(e, t, n) {
    if (fo) return e(t, n);
    fo = !0;
    try {
      return ba(e, t, n);
    } finally {
      fo = !1, (En !== null || bn !== null) && (ja(), Ea());
    }
  }
  function Jn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = cl(n);
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
  var mo = !1;
  if (S) try {
    var er = {};
    Object.defineProperty(er, "passive", { get: function() {
      mo = !0;
    } }), window.addEventListener("test", er, er), window.removeEventListener("test", er, er);
  } catch {
    mo = !1;
  }
  function Xc(e, t, n, r, l, o, i, u, d) {
    var y = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, y);
    } catch (j) {
      this.onError(j);
    }
  }
  var tr = !1, $r = null, Hr = !1, ho = null, Zc = { onError: function(e) {
    tr = !0, $r = e;
  } };
  function qc(e, t, n, r, l, o, i, u, d) {
    tr = !1, $r = null, Xc.apply(Zc, arguments);
  }
  function Jc(e, t, n, r, l, o, i, u, d) {
    if (qc.apply(this, arguments), tr) {
      if (tr) {
        var y = $r;
        tr = !1, $r = null;
      } else throw Error(s(198));
      Hr || (Hr = !0, ho = y);
    }
  }
  function sn(e) {
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
  function Na(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function za(e) {
    if (sn(e) !== e) throw Error(s(188));
  }
  function ed(e) {
    var t = e.alternate;
    if (!t) {
      if (t = sn(e), t === null) throw Error(s(188));
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
          if (o === n) return za(l), e;
          if (o === r) return za(l), t;
          o = o.sibling;
        }
        throw Error(s(188));
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
          if (!i) throw Error(s(189));
        }
      }
      if (n.alternate !== r) throw Error(s(190));
    }
    if (n.tag !== 3) throw Error(s(188));
    return n.stateNode.current === n ? e : t;
  }
  function Pa(e) {
    return e = ed(e), e !== null ? Ma(e) : null;
  }
  function Ma(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Ma(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var La = c.unstable_scheduleCallback, Ra = c.unstable_cancelCallback, td = c.unstable_shouldYield, nd = c.unstable_requestPaint, Ee = c.unstable_now, rd = c.unstable_getCurrentPriorityLevel, go = c.unstable_ImmediatePriority, Ta = c.unstable_UserBlockingPriority, Br = c.unstable_NormalPriority, ld = c.unstable_LowPriority, Oa = c.unstable_IdlePriority, Wr = null, wt = null;
  function od(e) {
    if (wt && typeof wt.onCommitFiberRoot == "function") try {
      wt.onCommitFiberRoot(Wr, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : sd, id = Math.log, ad = Math.LN2;
  function sd(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (id(e) / ad | 0) | 0;
  }
  var Qr = 64, Kr = 4194304;
  function nr(e) {
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
  function Gr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, i = n & 268435455;
    if (i !== 0) {
      var u = i & ~l;
      u !== 0 ? r = nr(u) : (o &= i, o !== 0 && (r = nr(o)));
    } else i = n & ~l, i !== 0 ? r = nr(i) : o !== 0 && (r = nr(o));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - pt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function ud(e, t) {
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
  function cd(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - pt(o), u = 1 << i, d = l[i];
      d === -1 ? ((u & n) === 0 || (u & r) !== 0) && (l[i] = ud(u, t)) : d <= t && (e.expiredLanes |= u), o &= ~u;
    }
  }
  function vo(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Ia() {
    var e = Qr;
    return Qr <<= 1, (Qr & 4194240) === 0 && (Qr = 64), e;
  }
  function yo(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function rr(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - pt(t), e[t] = n;
  }
  function dd(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - pt(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function xo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - pt(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var ue = 0;
  function Da(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Aa, wo, Fa, Ua, Va, ko = !1, Yr = [], Ft = null, Ut = null, Vt = null, lr = /* @__PURE__ */ new Map(), or = /* @__PURE__ */ new Map(), $t = [], pd = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function $a(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Ft = null;
        break;
      case "dragenter":
      case "dragleave":
        Ut = null;
        break;
      case "mouseover":
      case "mouseout":
        Vt = null;
        break;
      case "pointerover":
      case "pointerout":
        lr.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        or.delete(t.pointerId);
    }
  }
  function ir(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = wr(t), t !== null && wo(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function fd(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Ft = ir(Ft, e, t, n, r, l), !0;
      case "dragenter":
        return Ut = ir(Ut, e, t, n, r, l), !0;
      case "mouseover":
        return Vt = ir(Vt, e, t, n, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return lr.set(o, ir(lr.get(o) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, or.set(o, ir(or.get(o) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function Ha(e) {
    var t = un(e.target);
    if (t !== null) {
      var n = sn(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = Na(n), t !== null) {
            e.blockedOn = t, Va(e.priority, function() {
              Fa(n);
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
  function Xr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Co(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        uo = r, n.target.dispatchEvent(r), uo = null;
      } else return t = wr(n), t !== null && wo(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Ba(e, t, n) {
    Xr(e) && n.delete(t);
  }
  function md() {
    ko = !1, Ft !== null && Xr(Ft) && (Ft = null), Ut !== null && Xr(Ut) && (Ut = null), Vt !== null && Xr(Vt) && (Vt = null), lr.forEach(Ba), or.forEach(Ba);
  }
  function ar(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ko || (ko = !0, c.unstable_scheduleCallback(c.unstable_NormalPriority, md)));
  }
  function sr(e) {
    function t(l) {
      return ar(l, e);
    }
    if (0 < Yr.length) {
      ar(Yr[0], e);
      for (var n = 1; n < Yr.length; n++) {
        var r = Yr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Ft !== null && ar(Ft, e), Ut !== null && ar(Ut, e), Vt !== null && ar(Vt, e), lr.forEach(t), or.forEach(t), n = 0; n < $t.length; n++) r = $t[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < $t.length && (n = $t[0], n.blockedOn === null); ) Ha(n), n.blockedOn === null && $t.shift();
  }
  var jn = ee.ReactCurrentBatchConfig, Zr = !0;
  function hd(e, t, n, r) {
    var l = ue, o = jn.transition;
    jn.transition = null;
    try {
      ue = 1, So(e, t, n, r);
    } finally {
      ue = l, jn.transition = o;
    }
  }
  function gd(e, t, n, r) {
    var l = ue, o = jn.transition;
    jn.transition = null;
    try {
      ue = 4, So(e, t, n, r);
    } finally {
      ue = l, jn.transition = o;
    }
  }
  function So(e, t, n, r) {
    if (Zr) {
      var l = Co(e, t, n, r);
      if (l === null) Uo(e, t, r, qr, n), $a(e, r);
      else if (fd(l, e, t, n, r)) r.stopPropagation();
      else if ($a(e, r), t & 4 && -1 < pd.indexOf(e)) {
        for (; l !== null; ) {
          var o = wr(l);
          if (o !== null && Aa(o), o = Co(e, t, n, r), o === null && Uo(e, t, r, qr, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else Uo(e, t, r, null, n);
    }
  }
  var qr = null;
  function Co(e, t, n, r) {
    if (qr = null, e = co(r), e = un(e), e !== null) if (t = sn(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = Na(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return qr = e, null;
  }
  function Wa(e) {
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
        switch (rd()) {
          case go:
            return 1;
          case Ta:
            return 4;
          case Br:
          case ld:
            return 16;
          case Oa:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ht = null, Eo = null, Jr = null;
  function Qa() {
    if (Jr) return Jr;
    var e, t = Eo, n = t.length, r, l = "value" in Ht ? Ht.value : Ht.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
    return Jr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function el(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function tl() {
    return !0;
  }
  function Ka() {
    return !1;
  }
  function tt(e) {
    function t(n, r, l, o, i) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
      for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(o) : o[u]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? tl : Ka, this.isPropagationStopped = Ka, this;
    }
    return T(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = tl);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = tl);
    }, persist: function() {
    }, isPersistent: tl }), t;
  }
  var _n = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, bo = tt(_n), ur = T({}, _n, { view: 0, detail: 0 }), vd = tt(ur), jo, _o, cr, nl = T({}, ur, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== cr && (cr && e.type === "mousemove" ? (jo = e.screenX - cr.screenX, _o = e.screenY - cr.screenY) : _o = jo = 0, cr = e), jo);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : _o;
  } }), Ga = tt(nl), yd = T({}, nl, { dataTransfer: 0 }), xd = tt(yd), wd = T({}, ur, { relatedTarget: 0 }), No = tt(wd), kd = T({}, _n, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Sd = tt(kd), Cd = T({}, _n, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Ed = tt(Cd), bd = T({}, _n, { data: 0 }), Ya = tt(bd), jd = {
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
  }, _d = {
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
  }, Nd = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function zd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Nd[e]) ? !!t[e] : !1;
  }
  function zo() {
    return zd;
  }
  var Pd = T({}, ur, { key: function(e) {
    if (e.key) {
      var t = jd[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = el(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? _d[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zo, charCode: function(e) {
    return e.type === "keypress" ? el(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? el(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Md = tt(Pd), Ld = T({}, nl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Xa = tt(Ld), Rd = T({}, ur, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zo }), Td = tt(Rd), Od = T({}, _n, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Id = tt(Od), Dd = T({}, nl, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ad = tt(Dd), Fd = [9, 13, 27, 32], Po = S && "CompositionEvent" in window, dr = null;
  S && "documentMode" in document && (dr = document.documentMode);
  var Ud = S && "TextEvent" in window && !dr, Za = S && (!Po || dr && 8 < dr && 11 >= dr), qa = " ", Ja = !1;
  function es(e, t) {
    switch (e) {
      case "keyup":
        return Fd.indexOf(t.keyCode) !== -1;
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
  function ts(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Nn = !1;
  function Vd(e, t) {
    switch (e) {
      case "compositionend":
        return ts(t);
      case "keypress":
        return t.which !== 32 ? null : (Ja = !0, qa);
      case "textInput":
        return e = t.data, e === qa && Ja ? null : e;
      default:
        return null;
    }
  }
  function $d(e, t) {
    if (Nn) return e === "compositionend" || !Po && es(e, t) ? (e = Qa(), Jr = Eo = Ht = null, Nn = !1, e) : null;
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
        return Za && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Hd = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function ns(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Hd[e.type] : t === "textarea";
  }
  function rs(e, t, n, r) {
    Ca(r), t = al(t, "onChange"), 0 < t.length && (n = new bo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var pr = null, fr = null;
  function Bd(e) {
    ks(e, 0);
  }
  function rl(e) {
    var t = Rn(e);
    if (da(t)) return e;
  }
  function Wd(e, t) {
    if (e === "change") return t;
  }
  var ls = !1;
  if (S) {
    var Mo;
    if (S) {
      var Lo = "oninput" in document;
      if (!Lo) {
        var os = document.createElement("div");
        os.setAttribute("oninput", "return;"), Lo = typeof os.oninput == "function";
      }
      Mo = Lo;
    } else Mo = !1;
    ls = Mo && (!document.documentMode || 9 < document.documentMode);
  }
  function is() {
    pr && (pr.detachEvent("onpropertychange", as), fr = pr = null);
  }
  function as(e) {
    if (e.propertyName === "value" && rl(fr)) {
      var t = [];
      rs(t, fr, e, co(e)), _a(Bd, t);
    }
  }
  function Qd(e, t, n) {
    e === "focusin" ? (is(), pr = t, fr = n, pr.attachEvent("onpropertychange", as)) : e === "focusout" && is();
  }
  function Kd(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return rl(fr);
  }
  function Gd(e, t) {
    if (e === "click") return rl(t);
  }
  function Yd(e, t) {
    if (e === "input" || e === "change") return rl(t);
  }
  function Xd(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ft = typeof Object.is == "function" ? Object.is : Xd;
  function mr(e, t) {
    if (ft(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!L.call(t, l) || !ft(e[l], t[l])) return !1;
    }
    return !0;
  }
  function ss(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function us(e, t) {
    var n = ss(e);
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
      n = ss(n);
    }
  }
  function cs(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? cs(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ds() {
    for (var e = window, t = Ur(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Ur(e.document);
    }
    return t;
  }
  function Ro(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Zd(e) {
    var t = ds(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && cs(n.ownerDocument.documentElement, n)) {
      if (r !== null && Ro(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = us(n, o);
          var i = us(
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
  var qd = S && "documentMode" in document && 11 >= document.documentMode, zn = null, To = null, hr = null, Oo = !1;
  function ps(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Oo || zn == null || zn !== Ur(r) || (r = zn, "selectionStart" in r && Ro(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), hr && mr(hr, r) || (hr = r, r = al(To, "onSelect"), 0 < r.length && (t = new bo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = zn)));
  }
  function ll(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Pn = { animationend: ll("Animation", "AnimationEnd"), animationiteration: ll("Animation", "AnimationIteration"), animationstart: ll("Animation", "AnimationStart"), transitionend: ll("Transition", "TransitionEnd") }, Io = {}, fs = {};
  S && (fs = document.createElement("div").style, "AnimationEvent" in window || (delete Pn.animationend.animation, delete Pn.animationiteration.animation, delete Pn.animationstart.animation), "TransitionEvent" in window || delete Pn.transitionend.transition);
  function ol(e) {
    if (Io[e]) return Io[e];
    if (!Pn[e]) return e;
    var t = Pn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in fs) return Io[e] = t[n];
    return e;
  }
  var ms = ol("animationend"), hs = ol("animationiteration"), gs = ol("animationstart"), vs = ol("transitionend"), ys = /* @__PURE__ */ new Map(), xs = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Bt(e, t) {
    ys.set(e, t), x(t, [e]);
  }
  for (var Do = 0; Do < xs.length; Do++) {
    var Ao = xs[Do], Jd = Ao.toLowerCase(), ep = Ao[0].toUpperCase() + Ao.slice(1);
    Bt(Jd, "on" + ep);
  }
  Bt(ms, "onAnimationEnd"), Bt(hs, "onAnimationIteration"), Bt(gs, "onAnimationStart"), Bt("dblclick", "onDoubleClick"), Bt("focusin", "onFocus"), Bt("focusout", "onBlur"), Bt(vs, "onTransitionEnd"), k("onMouseEnter", ["mouseout", "mouseover"]), k("onMouseLeave", ["mouseout", "mouseover"]), k("onPointerEnter", ["pointerout", "pointerover"]), k("onPointerLeave", ["pointerout", "pointerover"]), x("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), x("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), x("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), x("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), x("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), x("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var gr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), tp = new Set("cancel close invalid load scroll toggle".split(" ").concat(gr));
  function ws(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, Jc(r, t, void 0, e), e.currentTarget = null;
  }
  function ks(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var u = r[i], d = u.instance, y = u.currentTarget;
          if (u = u.listener, d !== o && l.isPropagationStopped()) break e;
          ws(l, u, y), o = d;
        }
        else for (i = 0; i < r.length; i++) {
          if (u = r[i], d = u.instance, y = u.currentTarget, u = u.listener, d !== o && l.isPropagationStopped()) break e;
          ws(l, u, y), o = d;
        }
      }
    }
    if (Hr) throw e = ho, Hr = !1, ho = null, e;
  }
  function me(e, t) {
    var n = t[Qo];
    n === void 0 && (n = t[Qo] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (Ss(t, e, 2, !1), n.add(r));
  }
  function Fo(e, t, n) {
    var r = 0;
    t && (r |= 4), Ss(n, e, r, t);
  }
  var il = "_reactListening" + Math.random().toString(36).slice(2);
  function vr(e) {
    if (!e[il]) {
      e[il] = !0, g.forEach(function(n) {
        n !== "selectionchange" && (tp.has(n) || Fo(n, !1, e), Fo(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[il] || (t[il] = !0, Fo("selectionchange", !1, t));
    }
  }
  function Ss(e, t, n, r) {
    switch (Wa(t)) {
      case 1:
        var l = hd;
        break;
      case 4:
        l = gd;
        break;
      default:
        l = So;
    }
    n = l.bind(null, t, n, e), l = void 0, !mo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Uo(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var i = r.tag;
      if (i === 3 || i === 4) {
        var u = r.stateNode.containerInfo;
        if (u === l || u.nodeType === 8 && u.parentNode === l) break;
        if (i === 4) for (i = r.return; i !== null; ) {
          var d = i.tag;
          if ((d === 3 || d === 4) && (d = i.stateNode.containerInfo, d === l || d.nodeType === 8 && d.parentNode === l)) return;
          i = i.return;
        }
        for (; u !== null; ) {
          if (i = un(u), i === null) return;
          if (d = i.tag, d === 5 || d === 6) {
            r = o = i;
            continue e;
          }
          u = u.parentNode;
        }
      }
      r = r.return;
    }
    _a(function() {
      var y = o, j = co(n), _ = [];
      e: {
        var E = ys.get(e);
        if (E !== void 0) {
          var R = bo, I = e;
          switch (e) {
            case "keypress":
              if (el(n) === 0) break e;
            case "keydown":
            case "keyup":
              R = Md;
              break;
            case "focusin":
              I = "focus", R = No;
              break;
            case "focusout":
              I = "blur", R = No;
              break;
            case "beforeblur":
            case "afterblur":
              R = No;
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
              R = Ga;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              R = xd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              R = Td;
              break;
            case ms:
            case hs:
            case gs:
              R = Sd;
              break;
            case vs:
              R = Id;
              break;
            case "scroll":
              R = vd;
              break;
            case "wheel":
              R = Ad;
              break;
            case "copy":
            case "cut":
            case "paste":
              R = Ed;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              R = Xa;
          }
          var A = (t & 4) !== 0, be = !A && e === "scroll", h = A ? E !== null ? E + "Capture" : null : E;
          A = [];
          for (var p = y, v; p !== null; ) {
            v = p;
            var P = v.stateNode;
            if (v.tag === 5 && P !== null && (v = P, h !== null && (P = Jn(p, h), P != null && A.push(yr(p, P, v)))), be) break;
            p = p.return;
          }
          0 < A.length && (E = new R(E, I, null, n, j), _.push({ event: E, listeners: A }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (E = e === "mouseover" || e === "pointerover", R = e === "mouseout" || e === "pointerout", E && n !== uo && (I = n.relatedTarget || n.fromElement) && (un(I) || I[_t])) break e;
          if ((R || E) && (E = j.window === j ? j : (E = j.ownerDocument) ? E.defaultView || E.parentWindow : window, R ? (I = n.relatedTarget || n.toElement, R = y, I = I ? un(I) : null, I !== null && (be = sn(I), I !== be || I.tag !== 5 && I.tag !== 6) && (I = null)) : (R = null, I = y), R !== I)) {
            if (A = Ga, P = "onMouseLeave", h = "onMouseEnter", p = "mouse", (e === "pointerout" || e === "pointerover") && (A = Xa, P = "onPointerLeave", h = "onPointerEnter", p = "pointer"), be = R == null ? E : Rn(R), v = I == null ? E : Rn(I), E = new A(P, p + "leave", R, n, j), E.target = be, E.relatedTarget = v, P = null, un(j) === y && (A = new A(h, p + "enter", I, n, j), A.target = v, A.relatedTarget = be, P = A), be = P, R && I) t: {
              for (A = R, h = I, p = 0, v = A; v; v = Mn(v)) p++;
              for (v = 0, P = h; P; P = Mn(P)) v++;
              for (; 0 < p - v; ) A = Mn(A), p--;
              for (; 0 < v - p; ) h = Mn(h), v--;
              for (; p--; ) {
                if (A === h || h !== null && A === h.alternate) break t;
                A = Mn(A), h = Mn(h);
              }
              A = null;
            }
            else A = null;
            R !== null && Cs(_, E, R, A, !1), I !== null && be !== null && Cs(_, be, I, A, !0);
          }
        }
        e: {
          if (E = y ? Rn(y) : window, R = E.nodeName && E.nodeName.toLowerCase(), R === "select" || R === "input" && E.type === "file") var F = Wd;
          else if (ns(E)) if (ls) F = Yd;
          else {
            F = Kd;
            var Q = Qd;
          }
          else (R = E.nodeName) && R.toLowerCase() === "input" && (E.type === "checkbox" || E.type === "radio") && (F = Gd);
          if (F && (F = F(e, y))) {
            rs(_, F, n, j);
            break e;
          }
          Q && Q(e, E, y), e === "focusout" && (Q = E._wrapperState) && Q.controlled && E.type === "number" && lo(E, "number", E.value);
        }
        switch (Q = y ? Rn(y) : window, e) {
          case "focusin":
            (ns(Q) || Q.contentEditable === "true") && (zn = Q, To = y, hr = null);
            break;
          case "focusout":
            hr = To = zn = null;
            break;
          case "mousedown":
            Oo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Oo = !1, ps(_, n, j);
            break;
          case "selectionchange":
            if (qd) break;
          case "keydown":
          case "keyup":
            ps(_, n, j);
        }
        var K;
        if (Po) e: {
          switch (e) {
            case "compositionstart":
              var Y = "onCompositionStart";
              break e;
            case "compositionend":
              Y = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Y = "onCompositionUpdate";
              break e;
          }
          Y = void 0;
        }
        else Nn ? es(e, n) && (Y = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Y = "onCompositionStart");
        Y && (Za && n.locale !== "ko" && (Nn || Y !== "onCompositionStart" ? Y === "onCompositionEnd" && Nn && (K = Qa()) : (Ht = j, Eo = "value" in Ht ? Ht.value : Ht.textContent, Nn = !0)), Q = al(y, Y), 0 < Q.length && (Y = new Ya(Y, e, null, n, j), _.push({ event: Y, listeners: Q }), K ? Y.data = K : (K = ts(n), K !== null && (Y.data = K)))), (K = Ud ? Vd(e, n) : $d(e, n)) && (y = al(y, "onBeforeInput"), 0 < y.length && (j = new Ya("onBeforeInput", "beforeinput", null, n, j), _.push({ event: j, listeners: y }), j.data = K));
      }
      ks(_, t);
    });
  }
  function yr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function al(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Jn(e, n), o != null && r.unshift(yr(e, o, l)), o = Jn(e, t), o != null && r.push(yr(e, o, l))), e = e.return;
    }
    return r;
  }
  function Mn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Cs(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var u = n, d = u.alternate, y = u.stateNode;
      if (d !== null && d === r) break;
      u.tag === 5 && y !== null && (u = y, l ? (d = Jn(n, o), d != null && i.unshift(yr(n, d, u))) : l || (d = Jn(n, o), d != null && i.push(yr(n, d, u)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var np = /\r\n?/g, rp = /\u0000|\uFFFD/g;
  function Es(e) {
    return (typeof e == "string" ? e : "" + e).replace(np, `
`).replace(rp, "");
  }
  function sl(e, t, n) {
    if (t = Es(t), Es(e) !== t && n) throw Error(s(425));
  }
  function ul() {
  }
  var Vo = null, $o = null;
  function Ho(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Bo = typeof setTimeout == "function" ? setTimeout : void 0, lp = typeof clearTimeout == "function" ? clearTimeout : void 0, bs = typeof Promise == "function" ? Promise : void 0, op = typeof queueMicrotask == "function" ? queueMicrotask : typeof bs < "u" ? function(e) {
    return bs.resolve(null).then(e).catch(ip);
  } : Bo;
  function ip(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Wo(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), sr(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    sr(t);
  }
  function Wt(e) {
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
  function js(e) {
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
  var Ln = Math.random().toString(36).slice(2), kt = "__reactFiber$" + Ln, xr = "__reactProps$" + Ln, _t = "__reactContainer$" + Ln, Qo = "__reactEvents$" + Ln, ap = "__reactListeners$" + Ln, sp = "__reactHandles$" + Ln;
  function un(e) {
    var t = e[kt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[_t] || n[kt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = js(e); e !== null; ) {
          if (n = e[kt]) return n;
          e = js(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function wr(e) {
    return e = e[kt] || e[_t], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Rn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function cl(e) {
    return e[xr] || null;
  }
  var Ko = [], Tn = -1;
  function Qt(e) {
    return { current: e };
  }
  function he(e) {
    0 > Tn || (e.current = Ko[Tn], Ko[Tn] = null, Tn--);
  }
  function de(e, t) {
    Tn++, Ko[Tn] = e.current, e.current = t;
  }
  var Kt = {}, Ue = Qt(Kt), Qe = Qt(!1), cn = Kt;
  function On(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Kt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in n) l[o] = t[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ke(e) {
    return e = e.childContextTypes, e != null;
  }
  function dl() {
    he(Qe), he(Ue);
  }
  function _s(e, t, n) {
    if (Ue.current !== Kt) throw Error(s(168));
    de(Ue, t), de(Qe, n);
  }
  function Ns(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(s(108, ce(e) || "Unknown", l));
    return T({}, n, r);
  }
  function pl(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Kt, cn = Ue.current, de(Ue, e), de(Qe, Qe.current), !0;
  }
  function zs(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(s(169));
    n ? (e = Ns(e, t, cn), r.__reactInternalMemoizedMergedChildContext = e, he(Qe), he(Ue), de(Ue, e)) : he(Qe), de(Qe, n);
  }
  var Nt = null, fl = !1, Go = !1;
  function Ps(e) {
    Nt === null ? Nt = [e] : Nt.push(e);
  }
  function up(e) {
    fl = !0, Ps(e);
  }
  function Gt() {
    if (!Go && Nt !== null) {
      Go = !0;
      var e = 0, t = ue;
      try {
        var n = Nt;
        for (ue = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Nt = null, fl = !1;
      } catch (l) {
        throw Nt !== null && (Nt = Nt.slice(e + 1)), La(go, Gt), l;
      } finally {
        ue = t, Go = !1;
      }
    }
    return null;
  }
  var In = [], Dn = 0, ml = null, hl = 0, ot = [], it = 0, dn = null, zt = 1, Pt = "";
  function pn(e, t) {
    In[Dn++] = hl, In[Dn++] = ml, ml = e, hl = t;
  }
  function Ms(e, t, n) {
    ot[it++] = zt, ot[it++] = Pt, ot[it++] = dn, dn = e;
    var r = zt;
    e = Pt;
    var l = 32 - pt(r) - 1;
    r &= ~(1 << l), n += 1;
    var o = 32 - pt(t) + l;
    if (30 < o) {
      var i = l - l % 5;
      o = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, zt = 1 << 32 - pt(t) + l | n << l | r, Pt = o + e;
    } else zt = 1 << o | n << l | r, Pt = e;
  }
  function Yo(e) {
    e.return !== null && (pn(e, 1), Ms(e, 1, 0));
  }
  function Xo(e) {
    for (; e === ml; ) ml = In[--Dn], In[Dn] = null, hl = In[--Dn], In[Dn] = null;
    for (; e === dn; ) dn = ot[--it], ot[it] = null, Pt = ot[--it], ot[it] = null, zt = ot[--it], ot[it] = null;
  }
  var nt = null, rt = null, ye = !1, mt = null;
  function Ls(e, t) {
    var n = ct(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Rs(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, nt = e, rt = Wt(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, nt = e, rt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = dn !== null ? { id: zt, overflow: Pt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = ct(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, nt = e, rt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Zo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function qo(e) {
    if (ye) {
      var t = rt;
      if (t) {
        var n = t;
        if (!Rs(e, t)) {
          if (Zo(e)) throw Error(s(418));
          t = Wt(n.nextSibling);
          var r = nt;
          t && Rs(e, t) ? Ls(r, n) : (e.flags = e.flags & -4097 | 2, ye = !1, nt = e);
        }
      } else {
        if (Zo(e)) throw Error(s(418));
        e.flags = e.flags & -4097 | 2, ye = !1, nt = e;
      }
    }
  }
  function Ts(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    nt = e;
  }
  function gl(e) {
    if (e !== nt) return !1;
    if (!ye) return Ts(e), ye = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Ho(e.type, e.memoizedProps)), t && (t = rt)) {
      if (Zo(e)) throw Os(), Error(s(418));
      for (; t; ) Ls(e, t), t = Wt(t.nextSibling);
    }
    if (Ts(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                rt = Wt(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        rt = null;
      }
    } else rt = nt ? Wt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Os() {
    for (var e = rt; e; ) e = Wt(e.nextSibling);
  }
  function An() {
    rt = nt = null, ye = !1;
  }
  function Jo(e) {
    mt === null ? mt = [e] : mt.push(e);
  }
  var cp = ee.ReactCurrentBatchConfig;
  function kr(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(s(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(s(147, e));
        var l = r, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
          var u = l.refs;
          i === null ? delete u[o] : u[o] = i;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(s(284));
      if (!n._owner) throw Error(s(290, e));
    }
    return e;
  }
  function vl(e, t) {
    throw e = Object.prototype.toString.call(t), Error(s(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Is(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Ds(e) {
    function t(h, p) {
      if (e) {
        var v = h.deletions;
        v === null ? (h.deletions = [p], h.flags |= 16) : v.push(p);
      }
    }
    function n(h, p) {
      if (!e) return null;
      for (; p !== null; ) t(h, p), p = p.sibling;
      return null;
    }
    function r(h, p) {
      for (h = /* @__PURE__ */ new Map(); p !== null; ) p.key !== null ? h.set(p.key, p) : h.set(p.index, p), p = p.sibling;
      return h;
    }
    function l(h, p) {
      return h = nn(h, p), h.index = 0, h.sibling = null, h;
    }
    function o(h, p, v) {
      return h.index = v, e ? (v = h.alternate, v !== null ? (v = v.index, v < p ? (h.flags |= 2, p) : v) : (h.flags |= 2, p)) : (h.flags |= 1048576, p);
    }
    function i(h) {
      return e && h.alternate === null && (h.flags |= 2), h;
    }
    function u(h, p, v, P) {
      return p === null || p.tag !== 6 ? (p = Bi(v, h.mode, P), p.return = h, p) : (p = l(p, v), p.return = h, p);
    }
    function d(h, p, v, P) {
      var F = v.type;
      return F === we ? j(h, p, v.props.children, P, v.key) : p !== null && (p.elementType === F || typeof F == "object" && F !== null && F.$$typeof === Ne && Is(F) === p.type) ? (P = l(p, v.props), P.ref = kr(h, p, v), P.return = h, P) : (P = Vl(v.type, v.key, v.props, null, h.mode, P), P.ref = kr(h, p, v), P.return = h, P);
    }
    function y(h, p, v, P) {
      return p === null || p.tag !== 4 || p.stateNode.containerInfo !== v.containerInfo || p.stateNode.implementation !== v.implementation ? (p = Wi(v, h.mode, P), p.return = h, p) : (p = l(p, v.children || []), p.return = h, p);
    }
    function j(h, p, v, P, F) {
      return p === null || p.tag !== 7 ? (p = wn(v, h.mode, P, F), p.return = h, p) : (p = l(p, v), p.return = h, p);
    }
    function _(h, p, v) {
      if (typeof p == "string" && p !== "" || typeof p == "number") return p = Bi("" + p, h.mode, v), p.return = h, p;
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case pe:
            return v = Vl(p.type, p.key, p.props, null, h.mode, v), v.ref = kr(h, null, p), v.return = h, v;
          case xe:
            return p = Wi(p, h.mode, v), p.return = h, p;
          case Ne:
            var P = p._init;
            return _(h, P(p._payload), v);
        }
        if (Xn(p) || $(p)) return p = wn(p, h.mode, v, null), p.return = h, p;
        vl(h, p);
      }
      return null;
    }
    function E(h, p, v, P) {
      var F = p !== null ? p.key : null;
      if (typeof v == "string" && v !== "" || typeof v == "number") return F !== null ? null : u(h, p, "" + v, P);
      if (typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case pe:
            return v.key === F ? d(h, p, v, P) : null;
          case xe:
            return v.key === F ? y(h, p, v, P) : null;
          case Ne:
            return F = v._init, E(
              h,
              p,
              F(v._payload),
              P
            );
        }
        if (Xn(v) || $(v)) return F !== null ? null : j(h, p, v, P, null);
        vl(h, v);
      }
      return null;
    }
    function R(h, p, v, P, F) {
      if (typeof P == "string" && P !== "" || typeof P == "number") return h = h.get(v) || null, u(p, h, "" + P, F);
      if (typeof P == "object" && P !== null) {
        switch (P.$$typeof) {
          case pe:
            return h = h.get(P.key === null ? v : P.key) || null, d(p, h, P, F);
          case xe:
            return h = h.get(P.key === null ? v : P.key) || null, y(p, h, P, F);
          case Ne:
            var Q = P._init;
            return R(h, p, v, Q(P._payload), F);
        }
        if (Xn(P) || $(P)) return h = h.get(v) || null, j(p, h, P, F, null);
        vl(p, P);
      }
      return null;
    }
    function I(h, p, v, P) {
      for (var F = null, Q = null, K = p, Y = p = 0, Re = null; K !== null && Y < v.length; Y++) {
        K.index > Y ? (Re = K, K = null) : Re = K.sibling;
        var ae = E(h, K, v[Y], P);
        if (ae === null) {
          K === null && (K = Re);
          break;
        }
        e && K && ae.alternate === null && t(h, K), p = o(ae, p, Y), Q === null ? F = ae : Q.sibling = ae, Q = ae, K = Re;
      }
      if (Y === v.length) return n(h, K), ye && pn(h, Y), F;
      if (K === null) {
        for (; Y < v.length; Y++) K = _(h, v[Y], P), K !== null && (p = o(K, p, Y), Q === null ? F = K : Q.sibling = K, Q = K);
        return ye && pn(h, Y), F;
      }
      for (K = r(h, K); Y < v.length; Y++) Re = R(K, h, Y, v[Y], P), Re !== null && (e && Re.alternate !== null && K.delete(Re.key === null ? Y : Re.key), p = o(Re, p, Y), Q === null ? F = Re : Q.sibling = Re, Q = Re);
      return e && K.forEach(function(rn) {
        return t(h, rn);
      }), ye && pn(h, Y), F;
    }
    function A(h, p, v, P) {
      var F = $(v);
      if (typeof F != "function") throw Error(s(150));
      if (v = F.call(v), v == null) throw Error(s(151));
      for (var Q = F = null, K = p, Y = p = 0, Re = null, ae = v.next(); K !== null && !ae.done; Y++, ae = v.next()) {
        K.index > Y ? (Re = K, K = null) : Re = K.sibling;
        var rn = E(h, K, ae.value, P);
        if (rn === null) {
          K === null && (K = Re);
          break;
        }
        e && K && rn.alternate === null && t(h, K), p = o(rn, p, Y), Q === null ? F = rn : Q.sibling = rn, Q = rn, K = Re;
      }
      if (ae.done) return n(
        h,
        K
      ), ye && pn(h, Y), F;
      if (K === null) {
        for (; !ae.done; Y++, ae = v.next()) ae = _(h, ae.value, P), ae !== null && (p = o(ae, p, Y), Q === null ? F = ae : Q.sibling = ae, Q = ae);
        return ye && pn(h, Y), F;
      }
      for (K = r(h, K); !ae.done; Y++, ae = v.next()) ae = R(K, h, Y, ae.value, P), ae !== null && (e && ae.alternate !== null && K.delete(ae.key === null ? Y : ae.key), p = o(ae, p, Y), Q === null ? F = ae : Q.sibling = ae, Q = ae);
      return e && K.forEach(function(Hp) {
        return t(h, Hp);
      }), ye && pn(h, Y), F;
    }
    function be(h, p, v, P) {
      if (typeof v == "object" && v !== null && v.type === we && v.key === null && (v = v.props.children), typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case pe:
            e: {
              for (var F = v.key, Q = p; Q !== null; ) {
                if (Q.key === F) {
                  if (F = v.type, F === we) {
                    if (Q.tag === 7) {
                      n(h, Q.sibling), p = l(Q, v.props.children), p.return = h, h = p;
                      break e;
                    }
                  } else if (Q.elementType === F || typeof F == "object" && F !== null && F.$$typeof === Ne && Is(F) === Q.type) {
                    n(h, Q.sibling), p = l(Q, v.props), p.ref = kr(h, Q, v), p.return = h, h = p;
                    break e;
                  }
                  n(h, Q);
                  break;
                } else t(h, Q);
                Q = Q.sibling;
              }
              v.type === we ? (p = wn(v.props.children, h.mode, P, v.key), p.return = h, h = p) : (P = Vl(v.type, v.key, v.props, null, h.mode, P), P.ref = kr(h, p, v), P.return = h, h = P);
            }
            return i(h);
          case xe:
            e: {
              for (Q = v.key; p !== null; ) {
                if (p.key === Q) if (p.tag === 4 && p.stateNode.containerInfo === v.containerInfo && p.stateNode.implementation === v.implementation) {
                  n(h, p.sibling), p = l(p, v.children || []), p.return = h, h = p;
                  break e;
                } else {
                  n(h, p);
                  break;
                }
                else t(h, p);
                p = p.sibling;
              }
              p = Wi(v, h.mode, P), p.return = h, h = p;
            }
            return i(h);
          case Ne:
            return Q = v._init, be(h, p, Q(v._payload), P);
        }
        if (Xn(v)) return I(h, p, v, P);
        if ($(v)) return A(h, p, v, P);
        vl(h, v);
      }
      return typeof v == "string" && v !== "" || typeof v == "number" ? (v = "" + v, p !== null && p.tag === 6 ? (n(h, p.sibling), p = l(p, v), p.return = h, h = p) : (n(h, p), p = Bi(v, h.mode, P), p.return = h, h = p), i(h)) : n(h, p);
    }
    return be;
  }
  var Fn = Ds(!0), As = Ds(!1), yl = Qt(null), xl = null, Un = null, ei = null;
  function ti() {
    ei = Un = xl = null;
  }
  function ni(e) {
    var t = yl.current;
    he(yl), e._currentValue = t;
  }
  function ri(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Vn(e, t) {
    xl = e, ei = Un = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ge = !0), e.firstContext = null);
  }
  function at(e) {
    var t = e._currentValue;
    if (ei !== e) if (e = { context: e, memoizedValue: t, next: null }, Un === null) {
      if (xl === null) throw Error(s(308));
      Un = e, xl.dependencies = { lanes: 0, firstContext: e };
    } else Un = Un.next = e;
    return t;
  }
  var fn = null;
  function li(e) {
    fn === null ? fn = [e] : fn.push(e);
  }
  function Fs(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, li(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Mt(e, r);
  }
  function Mt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Yt = !1;
  function oi(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Us(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Lt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Xt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (le & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Mt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, li(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Mt(e, n);
  }
  function wl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, xo(e, n);
    }
  }
  function Vs(e, t) {
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
  function kl(e, t, n, r) {
    var l = e.updateQueue;
    Yt = !1;
    var o = l.firstBaseUpdate, i = l.lastBaseUpdate, u = l.shared.pending;
    if (u !== null) {
      l.shared.pending = null;
      var d = u, y = d.next;
      d.next = null, i === null ? o = y : i.next = y, i = d;
      var j = e.alternate;
      j !== null && (j = j.updateQueue, u = j.lastBaseUpdate, u !== i && (u === null ? j.firstBaseUpdate = y : u.next = y, j.lastBaseUpdate = d));
    }
    if (o !== null) {
      var _ = l.baseState;
      i = 0, j = y = d = null, u = o;
      do {
        var E = u.lane, R = u.eventTime;
        if ((r & E) === E) {
          j !== null && (j = j.next = {
            eventTime: R,
            lane: 0,
            tag: u.tag,
            payload: u.payload,
            callback: u.callback,
            next: null
          });
          e: {
            var I = e, A = u;
            switch (E = t, R = n, A.tag) {
              case 1:
                if (I = A.payload, typeof I == "function") {
                  _ = I.call(R, _, E);
                  break e;
                }
                _ = I;
                break e;
              case 3:
                I.flags = I.flags & -65537 | 128;
              case 0:
                if (I = A.payload, E = typeof I == "function" ? I.call(R, _, E) : I, E == null) break e;
                _ = T({}, _, E);
                break e;
              case 2:
                Yt = !0;
            }
          }
          u.callback !== null && u.lane !== 0 && (e.flags |= 64, E = l.effects, E === null ? l.effects = [u] : E.push(u));
        } else R = { eventTime: R, lane: E, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, j === null ? (y = j = R, d = _) : j = j.next = R, i |= E;
        if (u = u.next, u === null) {
          if (u = l.shared.pending, u === null) break;
          E = u, u = E.next, E.next = null, l.lastBaseUpdate = E, l.shared.pending = null;
        }
      } while (!0);
      if (j === null && (d = _), l.baseState = d, l.firstBaseUpdate = y, l.lastBaseUpdate = j, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      gn |= i, e.lanes = i, e.memoizedState = _;
    }
  }
  function $s(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(s(191, l));
        l.call(r);
      }
    }
  }
  var Sr = {}, St = Qt(Sr), Cr = Qt(Sr), Er = Qt(Sr);
  function mn(e) {
    if (e === Sr) throw Error(s(174));
    return e;
  }
  function ii(e, t) {
    switch (de(Er, t), de(Cr, e), de(St, Sr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : io(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = io(t, e);
    }
    he(St), de(St, t);
  }
  function $n() {
    he(St), he(Cr), he(Er);
  }
  function Hs(e) {
    mn(Er.current);
    var t = mn(St.current), n = io(t, e.type);
    t !== n && (de(Cr, e), de(St, n));
  }
  function ai(e) {
    Cr.current === e && (he(St), he(Cr));
  }
  var ke = Qt(0);
  function Sl(e) {
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
  var si = [];
  function ui() {
    for (var e = 0; e < si.length; e++) si[e]._workInProgressVersionPrimary = null;
    si.length = 0;
  }
  var Cl = ee.ReactCurrentDispatcher, ci = ee.ReactCurrentBatchConfig, hn = 0, Se = null, ze = null, Me = null, El = !1, br = !1, jr = 0, dp = 0;
  function Ve() {
    throw Error(s(321));
  }
  function di(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ft(e[n], t[n])) return !1;
    return !0;
  }
  function pi(e, t, n, r, l, o) {
    if (hn = o, Se = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Cl.current = e === null || e.memoizedState === null ? hp : gp, e = n(r, l), br) {
      o = 0;
      do {
        if (br = !1, jr = 0, 25 <= o) throw Error(s(301));
        o += 1, Me = ze = null, t.updateQueue = null, Cl.current = vp, e = n(r, l);
      } while (br);
    }
    if (Cl.current = _l, t = ze !== null && ze.next !== null, hn = 0, Me = ze = Se = null, El = !1, t) throw Error(s(300));
    return e;
  }
  function fi() {
    var e = jr !== 0;
    return jr = 0, e;
  }
  function Ct() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Me === null ? Se.memoizedState = Me = e : Me = Me.next = e, Me;
  }
  function st() {
    if (ze === null) {
      var e = Se.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = ze.next;
    var t = Me === null ? Se.memoizedState : Me.next;
    if (t !== null) Me = t, ze = e;
    else {
      if (e === null) throw Error(s(310));
      ze = e, e = { memoizedState: ze.memoizedState, baseState: ze.baseState, baseQueue: ze.baseQueue, queue: ze.queue, next: null }, Me === null ? Se.memoizedState = Me = e : Me = Me.next = e;
    }
    return Me;
  }
  function _r(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function mi(e) {
    var t = st(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = ze, l = r.baseQueue, o = n.pending;
    if (o !== null) {
      if (l !== null) {
        var i = l.next;
        l.next = o.next, o.next = i;
      }
      r.baseQueue = l = o, n.pending = null;
    }
    if (l !== null) {
      o = l.next, r = r.baseState;
      var u = i = null, d = null, y = o;
      do {
        var j = y.lane;
        if ((hn & j) === j) d !== null && (d = d.next = { lane: 0, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null }), r = y.hasEagerState ? y.eagerState : e(r, y.action);
        else {
          var _ = {
            lane: j,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          };
          d === null ? (u = d = _, i = r) : d = d.next = _, Se.lanes |= j, gn |= j;
        }
        y = y.next;
      } while (y !== null && y !== o);
      d === null ? i = r : d.next = u, ft(r, t.memoizedState) || (Ge = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = d, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, Se.lanes |= o, gn |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function hi(e) {
    var t = st(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, o = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var i = l = l.next;
      do
        o = e(o, i.action), i = i.next;
      while (i !== l);
      ft(o, t.memoizedState) || (Ge = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
    }
    return [o, r];
  }
  function Bs() {
  }
  function Ws(e, t) {
    var n = Se, r = st(), l = t(), o = !ft(r.memoizedState, l);
    if (o && (r.memoizedState = l, Ge = !0), r = r.queue, gi(Gs.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || Me !== null && Me.memoizedState.tag & 1) {
      if (n.flags |= 2048, Nr(9, Ks.bind(null, n, r, l, t), void 0, null), Le === null) throw Error(s(349));
      (hn & 30) !== 0 || Qs(n, t, l);
    }
    return l;
  }
  function Qs(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ks(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Ys(t) && Xs(e);
  }
  function Gs(e, t, n) {
    return n(function() {
      Ys(t) && Xs(e);
    });
  }
  function Ys(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ft(e, n);
    } catch {
      return !0;
    }
  }
  function Xs(e) {
    var t = Mt(e, 1);
    t !== null && yt(t, e, 1, -1);
  }
  function Zs(e) {
    var t = Ct();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: _r, lastRenderedState: e }, t.queue = e, e = e.dispatch = mp.bind(null, Se, e), [t.memoizedState, e];
  }
  function Nr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function qs() {
    return st().memoizedState;
  }
  function bl(e, t, n, r) {
    var l = Ct();
    Se.flags |= e, l.memoizedState = Nr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function jl(e, t, n, r) {
    var l = st();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (ze !== null) {
      var i = ze.memoizedState;
      if (o = i.destroy, r !== null && di(r, i.deps)) {
        l.memoizedState = Nr(t, n, o, r);
        return;
      }
    }
    Se.flags |= e, l.memoizedState = Nr(1 | t, n, o, r);
  }
  function Js(e, t) {
    return bl(8390656, 8, e, t);
  }
  function gi(e, t) {
    return jl(2048, 8, e, t);
  }
  function eu(e, t) {
    return jl(4, 2, e, t);
  }
  function tu(e, t) {
    return jl(4, 4, e, t);
  }
  function nu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function ru(e, t, n) {
    return n = n != null ? n.concat([e]) : null, jl(4, 4, nu.bind(null, t, e), n);
  }
  function vi() {
  }
  function lu(e, t) {
    var n = st();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && di(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function ou(e, t) {
    var n = st();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && di(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function iu(e, t, n) {
    return (hn & 21) === 0 ? (e.baseState && (e.baseState = !1, Ge = !0), e.memoizedState = n) : (ft(n, t) || (n = Ia(), Se.lanes |= n, gn |= n, e.baseState = !0), t);
  }
  function pp(e, t) {
    var n = ue;
    ue = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = ci.transition;
    ci.transition = {};
    try {
      e(!1), t();
    } finally {
      ue = n, ci.transition = r;
    }
  }
  function au() {
    return st().memoizedState;
  }
  function fp(e, t, n) {
    var r = en(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, su(e)) uu(t, n);
    else if (n = Fs(e, t, n, r), n !== null) {
      var l = We();
      yt(n, e, r, l), cu(n, t, r);
    }
  }
  function mp(e, t, n) {
    var r = en(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (su(e)) uu(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, u = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = u, ft(u, i)) {
          var d = t.interleaved;
          d === null ? (l.next = l, li(t)) : (l.next = d.next, d.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = Fs(e, t, l, r), n !== null && (l = We(), yt(n, e, r, l), cu(n, t, r));
    }
  }
  function su(e) {
    var t = e.alternate;
    return e === Se || t !== null && t === Se;
  }
  function uu(e, t) {
    br = El = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function cu(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, xo(e, n);
    }
  }
  var _l = { readContext: at, useCallback: Ve, useContext: Ve, useEffect: Ve, useImperativeHandle: Ve, useInsertionEffect: Ve, useLayoutEffect: Ve, useMemo: Ve, useReducer: Ve, useRef: Ve, useState: Ve, useDebugValue: Ve, useDeferredValue: Ve, useTransition: Ve, useMutableSource: Ve, useSyncExternalStore: Ve, useId: Ve, unstable_isNewReconciler: !1 }, hp = { readContext: at, useCallback: function(e, t) {
    return Ct().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: at, useEffect: Js, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, bl(
      4194308,
      4,
      nu.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return bl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return bl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = Ct();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = Ct();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = fp.bind(null, Se, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = Ct();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Zs, useDebugValue: vi, useDeferredValue: function(e) {
    return Ct().memoizedState = e;
  }, useTransition: function() {
    var e = Zs(!1), t = e[0];
    return e = pp.bind(null, e[1]), Ct().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Se, l = Ct();
    if (ye) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else {
      if (n = t(), Le === null) throw Error(s(349));
      (hn & 30) !== 0 || Qs(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, Js(Gs.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, Nr(9, Ks.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = Ct(), t = Le.identifierPrefix;
    if (ye) {
      var n = Pt, r = zt;
      n = (r & ~(1 << 32 - pt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = jr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = dp++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, gp = {
    readContext: at,
    useCallback: lu,
    useContext: at,
    useEffect: gi,
    useImperativeHandle: ru,
    useInsertionEffect: eu,
    useLayoutEffect: tu,
    useMemo: ou,
    useReducer: mi,
    useRef: qs,
    useState: function() {
      return mi(_r);
    },
    useDebugValue: vi,
    useDeferredValue: function(e) {
      var t = st();
      return iu(t, ze.memoizedState, e);
    },
    useTransition: function() {
      var e = mi(_r)[0], t = st().memoizedState;
      return [e, t];
    },
    useMutableSource: Bs,
    useSyncExternalStore: Ws,
    useId: au,
    unstable_isNewReconciler: !1
  }, vp = { readContext: at, useCallback: lu, useContext: at, useEffect: gi, useImperativeHandle: ru, useInsertionEffect: eu, useLayoutEffect: tu, useMemo: ou, useReducer: hi, useRef: qs, useState: function() {
    return hi(_r);
  }, useDebugValue: vi, useDeferredValue: function(e) {
    var t = st();
    return ze === null ? t.memoizedState = e : iu(t, ze.memoizedState, e);
  }, useTransition: function() {
    var e = hi(_r)[0], t = st().memoizedState;
    return [e, t];
  }, useMutableSource: Bs, useSyncExternalStore: Ws, useId: au, unstable_isNewReconciler: !1 };
  function ht(e, t) {
    if (e && e.defaultProps) {
      t = T({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function yi(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : T({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Nl = { isMounted: function(e) {
    return (e = e._reactInternals) ? sn(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = We(), l = en(e), o = Lt(r, l);
    o.payload = t, n != null && (o.callback = n), t = Xt(e, o, l), t !== null && (yt(t, e, l, r), wl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = We(), l = en(e), o = Lt(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Xt(e, o, l), t !== null && (yt(t, e, l, r), wl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = We(), r = en(e), l = Lt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Xt(e, l, r), t !== null && (yt(t, e, r, n), wl(t, e, r));
  } };
  function du(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !mr(n, r) || !mr(l, o) : !0;
  }
  function pu(e, t, n) {
    var r = !1, l = Kt, o = t.contextType;
    return typeof o == "object" && o !== null ? o = at(o) : (l = Ke(t) ? cn : Ue.current, r = t.contextTypes, o = (r = r != null) ? On(e, l) : Kt), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Nl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function fu(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Nl.enqueueReplaceState(t, t.state, null);
  }
  function xi(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, oi(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = at(o) : (o = Ke(t) ? cn : Ue.current, l.context = On(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (yi(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Nl.enqueueReplaceState(l, l.state, null), kl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Hn(e, t) {
    try {
      var n = "", r = t;
      do
        n += oe(r), r = r.return;
      while (r);
      var l = n;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function wi(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ki(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var yp = typeof WeakMap == "function" ? WeakMap : Map;
  function mu(e, t, n) {
    n = Lt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Ol || (Ol = !0, Ii = r), ki(e, t);
    }, n;
  }
  function hu(e, t, n) {
    n = Lt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        ki(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      ki(e, t), typeof r != "function" && (qt === null ? qt = /* @__PURE__ */ new Set([this]) : qt.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function gu(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new yp();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = Lp.bind(null, e, t, n), t.then(e, e));
  }
  function vu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function yu(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Lt(-1, 1), t.tag = 2, Xt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var xp = ee.ReactCurrentOwner, Ge = !1;
  function Be(e, t, n, r) {
    t.child = e === null ? As(t, null, n, r) : Fn(t, e.child, n, r);
  }
  function xu(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return Vn(t, l), r = pi(e, t, n, r, o, l), n = fi(), e !== null && !Ge ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ye && n && Yo(t), t.flags |= 1, Be(e, t, r, l), t.child);
  }
  function wu(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !Hi(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, ku(e, t, o, r, l)) : (e = Vl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : mr, n(i, r) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = nn(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ku(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (mr(o, r) && e.ref === t.ref) if (Ge = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ge = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return Si(e, t, n, r, l);
  }
  function Su(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, de(Wn, lt), lt |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, de(Wn, lt), lt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, de(Wn, lt), lt |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, de(Wn, lt), lt |= r;
    return Be(e, t, l, n), t.child;
  }
  function Cu(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function Si(e, t, n, r, l) {
    var o = Ke(n) ? cn : Ue.current;
    return o = On(t, o), Vn(t, l), n = pi(e, t, n, r, o, l), r = fi(), e !== null && !Ge ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ye && r && Yo(t), t.flags |= 1, Be(e, t, n, l), t.child);
  }
  function Eu(e, t, n, r, l) {
    if (Ke(n)) {
      var o = !0;
      pl(t);
    } else o = !1;
    if (Vn(t, l), t.stateNode === null) Pl(e, t), pu(t, n, r), xi(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, u = t.memoizedProps;
      i.props = u;
      var d = i.context, y = n.contextType;
      typeof y == "object" && y !== null ? y = at(y) : (y = Ke(n) ? cn : Ue.current, y = On(t, y));
      var j = n.getDerivedStateFromProps, _ = typeof j == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      _ || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== r || d !== y) && fu(t, i, r, y), Yt = !1;
      var E = t.memoizedState;
      i.state = E, kl(t, r, i, l), d = t.memoizedState, u !== r || E !== d || Qe.current || Yt ? (typeof j == "function" && (yi(t, n, j, r), d = t.memoizedState), (u = Yt || du(t, n, u, r, E, d, y)) ? (_ || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = d), i.props = r, i.state = d, i.context = y, r = u) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, Us(e, t), u = t.memoizedProps, y = t.type === t.elementType ? u : ht(t.type, u), i.props = y, _ = t.pendingProps, E = i.context, d = n.contextType, typeof d == "object" && d !== null ? d = at(d) : (d = Ke(n) ? cn : Ue.current, d = On(t, d));
      var R = n.getDerivedStateFromProps;
      (j = typeof R == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (u !== _ || E !== d) && fu(t, i, r, d), Yt = !1, E = t.memoizedState, i.state = E, kl(t, r, i, l);
      var I = t.memoizedState;
      u !== _ || E !== I || Qe.current || Yt ? (typeof R == "function" && (yi(t, n, R, r), I = t.memoizedState), (y = Yt || du(t, n, y, r, E, I, d) || !1) ? (j || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, I, d), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, I, d)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && E === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && E === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = I), i.props = r, i.state = I, i.context = d, r = y) : (typeof i.componentDidUpdate != "function" || u === e.memoizedProps && E === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && E === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return Ci(e, t, n, r, o, l);
  }
  function Ci(e, t, n, r, l, o) {
    Cu(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && zs(t, n, !1), Rt(e, t, o);
    r = t.stateNode, xp.current = t;
    var u = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = Fn(t, e.child, null, o), t.child = Fn(t, null, u, o)) : Be(e, t, u, o), t.memoizedState = r.state, l && zs(t, n, !0), t.child;
  }
  function bu(e) {
    var t = e.stateNode;
    t.pendingContext ? _s(e, t.pendingContext, t.pendingContext !== t.context) : t.context && _s(e, t.context, !1), ii(e, t.containerInfo);
  }
  function ju(e, t, n, r, l) {
    return An(), Jo(l), t.flags |= 256, Be(e, t, n, r), t.child;
  }
  var Ei = { dehydrated: null, treeContext: null, retryLane: 0 };
  function bi(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function _u(e, t, n) {
    var r = t.pendingProps, l = ke.current, o = !1, i = (t.flags & 128) !== 0, u;
    if ((u = i) || (u = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), u ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), de(ke, l & 1), e === null)
      return qo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = $l(i, r, 0, null), e = wn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = bi(n), t.memoizedState = Ei, e) : ji(t, i));
    if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return wp(e, t, i, r, u, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, u = l.sibling;
      var d = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = d, t.deletions = null) : (r = nn(l, d), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? o = nn(u, o) : (o = wn(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? bi(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = Ei, r;
    }
    return o = e.child, e = o.sibling, r = nn(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ji(e, t) {
    return t = $l({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function zl(e, t, n, r) {
    return r !== null && Jo(r), Fn(t, e.child, null, n), e = ji(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function wp(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = wi(Error(s(422))), zl(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = $l({ mode: "visible", children: r.children }, l, 0, null), o = wn(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && Fn(t, e.child, null, i), t.child.memoizedState = bi(i), t.memoizedState = Ei, o);
    if ((t.mode & 1) === 0) return zl(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
      return r = u, o = Error(s(419)), r = wi(o, r, void 0), zl(e, t, i, r);
    }
    if (u = (i & e.childLanes) !== 0, Ge || u) {
      if (r = Le, r !== null) {
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
        l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Mt(e, l), yt(r, e, l, -1));
      }
      return $i(), r = wi(Error(s(421))), zl(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Rp.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, rt = Wt(l.nextSibling), nt = t, ye = !0, mt = null, e !== null && (ot[it++] = zt, ot[it++] = Pt, ot[it++] = dn, zt = e.id, Pt = e.overflow, dn = t), t = ji(t, r.children), t.flags |= 4096, t);
  }
  function Nu(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), ri(e.return, t, n);
  }
  function _i(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function zu(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (Be(e, t, r.children, n), r = ke.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Nu(e, n, t);
        else if (e.tag === 19) Nu(e, n, t);
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
    if (de(ke, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && Sl(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), _i(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Sl(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        _i(t, !0, n, null, o);
        break;
      case "together":
        _i(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Pl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Rt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), gn |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, n = nn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = nn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function kp(e, t, n) {
    switch (t.tag) {
      case 3:
        bu(t), An();
        break;
      case 5:
        Hs(t);
        break;
      case 1:
        Ke(t.type) && pl(t);
        break;
      case 4:
        ii(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        de(yl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (de(ke, ke.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? _u(e, t, n) : (de(ke, ke.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        de(ke, ke.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return zu(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), de(ke, ke.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Su(e, t, n);
    }
    return Rt(e, t, n);
  }
  var Pu, Ni, Mu, Lu;
  Pu = function(e, t) {
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
  }, Ni = function() {
  }, Mu = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, mn(St.current);
      var o = null;
      switch (n) {
        case "input":
          l = no(e, l), r = no(e, r), o = [];
          break;
        case "select":
          l = T({}, l, { value: void 0 }), r = T({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = oo(e, l), r = oo(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = ul);
      }
      ao(n, r);
      var i;
      n = null;
      for (y in l) if (!r.hasOwnProperty(y) && l.hasOwnProperty(y) && l[y] != null) if (y === "style") {
        var u = l[y];
        for (i in u) u.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else y !== "dangerouslySetInnerHTML" && y !== "children" && y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (w.hasOwnProperty(y) ? o || (o = []) : (o = o || []).push(y, null));
      for (y in r) {
        var d = r[y];
        if (u = l != null ? l[y] : void 0, r.hasOwnProperty(y) && d !== u && (d != null || u != null)) if (y === "style") if (u) {
          for (i in u) !u.hasOwnProperty(i) || d && d.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in d) d.hasOwnProperty(i) && u[i] !== d[i] && (n || (n = {}), n[i] = d[i]);
        } else n || (o || (o = []), o.push(
          y,
          n
        )), n = d;
        else y === "dangerouslySetInnerHTML" ? (d = d ? d.__html : void 0, u = u ? u.__html : void 0, d != null && u !== d && (o = o || []).push(y, d)) : y === "children" ? typeof d != "string" && typeof d != "number" || (o = o || []).push(y, "" + d) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && (w.hasOwnProperty(y) ? (d != null && y === "onScroll" && me("scroll", e), o || u === d || (o = [])) : (o = o || []).push(y, d));
      }
      n && (o = o || []).push("style", n);
      var y = o;
      (t.updateQueue = y) && (t.flags |= 4);
    }
  }, Lu = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function zr(e, t) {
    if (!ye) switch (e.tailMode) {
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
  function $e(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function Sp(e, t, n) {
    var r = t.pendingProps;
    switch (Xo(t), t.tag) {
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
        return $e(t), null;
      case 1:
        return Ke(t.type) && dl(), $e(t), null;
      case 3:
        return r = t.stateNode, $n(), he(Qe), he(Ue), ui(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (gl(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (Fi(mt), mt = null))), Ni(e, t), $e(t), null;
      case 5:
        ai(t);
        var l = mn(Er.current);
        if (n = t.type, e !== null && t.stateNode != null) Mu(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(s(166));
            return $e(t), null;
          }
          if (e = mn(St.current), gl(t)) {
            r = t.stateNode, n = t.type;
            var o = t.memoizedProps;
            switch (r[kt] = t, r[xr] = o, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                me("cancel", r), me("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                me("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < gr.length; l++) me(gr[l], r);
                break;
              case "source":
                me("error", r);
                break;
              case "img":
              case "image":
              case "link":
                me(
                  "error",
                  r
                ), me("load", r);
                break;
              case "details":
                me("toggle", r);
                break;
              case "input":
                pa(r, o), me("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, me("invalid", r);
                break;
              case "textarea":
                ha(r, o), me("invalid", r);
            }
            ao(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var u = o[i];
              i === "children" ? typeof u == "string" ? r.textContent !== u && (o.suppressHydrationWarning !== !0 && sl(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (o.suppressHydrationWarning !== !0 && sl(
                r.textContent,
                u,
                e
              ), l = ["children", "" + u]) : w.hasOwnProperty(i) && u != null && i === "onScroll" && me("scroll", r);
            }
            switch (n) {
              case "input":
                Fr(r), ma(r, o, !0);
                break;
              case "textarea":
                Fr(r), va(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = ul);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = ya(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[kt] = t, e[xr] = r, Pu(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = so(n, r), n) {
                case "dialog":
                  me("cancel", e), me("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  me("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < gr.length; l++) me(gr[l], e);
                  l = r;
                  break;
                case "source":
                  me("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  me(
                    "error",
                    e
                  ), me("load", e), l = r;
                  break;
                case "details":
                  me("toggle", e), l = r;
                  break;
                case "input":
                  pa(e, r), l = no(e, r), me("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = T({}, r, { value: void 0 }), me("invalid", e);
                  break;
                case "textarea":
                  ha(e, r), l = oo(e, r), me("invalid", e);
                  break;
                default:
                  l = r;
              }
              ao(n, l), u = l;
              for (o in u) if (u.hasOwnProperty(o)) {
                var d = u[o];
                o === "style" ? ka(e, d) : o === "dangerouslySetInnerHTML" ? (d = d ? d.__html : void 0, d != null && xa(e, d)) : o === "children" ? typeof d == "string" ? (n !== "textarea" || d !== "") && Zn(e, d) : typeof d == "number" && Zn(e, "" + d) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (w.hasOwnProperty(o) ? d != null && o === "onScroll" && me("scroll", e) : d != null && W(e, o, d, i));
              }
              switch (n) {
                case "input":
                  Fr(e), ma(e, r, !1);
                  break;
                case "textarea":
                  Fr(e), va(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + se(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? Cn(e, !!r.multiple, o, !1) : r.defaultValue != null && Cn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = ul);
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
        return $e(t), null;
      case 6:
        if (e && t.stateNode != null) Lu(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(s(166));
          if (n = mn(Er.current), mn(St.current), gl(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[kt] = t, (o = r.nodeValue !== n) && (e = nt, e !== null)) switch (e.tag) {
              case 3:
                sl(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && sl(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[kt] = t, t.stateNode = r;
        }
        return $e(t), null;
      case 13:
        if (he(ke), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ye && rt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Os(), An(), t.flags |= 98560, o = !1;
          else if (o = gl(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(s(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(s(317));
              o[kt] = t;
            } else An(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            $e(t), o = !1;
          } else mt !== null && (Fi(mt), mt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ke.current & 1) !== 0 ? Pe === 0 && (Pe = 3) : $i())), t.updateQueue !== null && (t.flags |= 4), $e(t), null);
      case 4:
        return $n(), Ni(e, t), e === null && vr(t.stateNode.containerInfo), $e(t), null;
      case 10:
        return ni(t.type._context), $e(t), null;
      case 17:
        return Ke(t.type) && dl(), $e(t), null;
      case 19:
        if (he(ke), o = t.memoizedState, o === null) return $e(t), null;
        if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) zr(o, !1);
        else {
          if (Pe !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (i = Sl(e), i !== null) {
              for (t.flags |= 128, zr(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return de(ke, ke.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && Ee() > Qn && (t.flags |= 128, r = !0, zr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = Sl(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), zr(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !ye) return $e(t), null;
          } else 2 * Ee() - o.renderingStartTime > Qn && n !== 1073741824 && (t.flags |= 128, r = !0, zr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Ee(), t.sibling = null, n = ke.current, de(ke, r ? n & 1 | 2 : n & 1), t) : ($e(t), null);
      case 22:
      case 23:
        return Vi(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (lt & 1073741824) !== 0 && ($e(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : $e(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function Cp(e, t) {
    switch (Xo(t), t.tag) {
      case 1:
        return Ke(t.type) && dl(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return $n(), he(Qe), he(Ue), ui(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return ai(t), null;
      case 13:
        if (he(ke), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(s(340));
          An();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return he(ke), null;
      case 4:
        return $n(), null;
      case 10:
        return ni(t.type._context), null;
      case 22:
      case 23:
        return Vi(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ml = !1, He = !1, Ep = typeof WeakSet == "function" ? WeakSet : Set, O = null;
  function Bn(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Ce(e, t, r);
    }
    else n.current = null;
  }
  function zi(e, t, n) {
    try {
      n();
    } catch (r) {
      Ce(e, t, r);
    }
  }
  var Ru = !1;
  function bp(e, t) {
    if (Vo = Zr, e = ds(), Ro(e)) {
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
          var i = 0, u = -1, d = -1, y = 0, j = 0, _ = e, E = null;
          t: for (; ; ) {
            for (var R; _ !== n || l !== 0 && _.nodeType !== 3 || (u = i + l), _ !== o || r !== 0 && _.nodeType !== 3 || (d = i + r), _.nodeType === 3 && (i += _.nodeValue.length), (R = _.firstChild) !== null; )
              E = _, _ = R;
            for (; ; ) {
              if (_ === e) break t;
              if (E === n && ++y === l && (u = i), E === o && ++j === r && (d = i), (R = _.nextSibling) !== null) break;
              _ = E, E = _.parentNode;
            }
            _ = R;
          }
          n = u === -1 || d === -1 ? null : { start: u, end: d };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for ($o = { focusedElem: e, selectionRange: n }, Zr = !1, O = t; O !== null; ) if (t = O, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, O = e;
    else for (; O !== null; ) {
      t = O;
      try {
        var I = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (I !== null) {
              var A = I.memoizedProps, be = I.memoizedState, h = t.stateNode, p = h.getSnapshotBeforeUpdate(t.elementType === t.type ? A : ht(t.type, A), be);
              h.__reactInternalSnapshotBeforeUpdate = p;
            }
            break;
          case 3:
            var v = t.stateNode.containerInfo;
            v.nodeType === 1 ? v.textContent = "" : v.nodeType === 9 && v.documentElement && v.removeChild(v.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(s(163));
        }
      } catch (P) {
        Ce(t, t.return, P);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, O = e;
        break;
      }
      O = t.return;
    }
    return I = Ru, Ru = !1, I;
  }
  function Pr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && zi(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Ll(e, t) {
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
  function Pi(e) {
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
  function Tu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Tu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[kt], delete t[xr], delete t[Qo], delete t[ap], delete t[sp])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Ou(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Iu(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Ou(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Mi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = ul));
    else if (r !== 4 && (e = e.child, e !== null)) for (Mi(e, t, n), e = e.sibling; e !== null; ) Mi(e, t, n), e = e.sibling;
  }
  function Li(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (Li(e, t, n), e = e.sibling; e !== null; ) Li(e, t, n), e = e.sibling;
  }
  var Te = null, gt = !1;
  function Zt(e, t, n) {
    for (n = n.child; n !== null; ) Du(e, t, n), n = n.sibling;
  }
  function Du(e, t, n) {
    if (wt && typeof wt.onCommitFiberUnmount == "function") try {
      wt.onCommitFiberUnmount(Wr, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        He || Bn(n, t);
      case 6:
        var r = Te, l = gt;
        Te = null, Zt(e, t, n), Te = r, gt = l, Te !== null && (gt ? (e = Te, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Te.removeChild(n.stateNode));
        break;
      case 18:
        Te !== null && (gt ? (e = Te, n = n.stateNode, e.nodeType === 8 ? Wo(e.parentNode, n) : e.nodeType === 1 && Wo(e, n), sr(e)) : Wo(Te, n.stateNode));
        break;
      case 4:
        r = Te, l = gt, Te = n.stateNode.containerInfo, gt = !0, Zt(e, t, n), Te = r, gt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!He && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, i = o.destroy;
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && zi(n, t, i), l = l.next;
          } while (l !== r);
        }
        Zt(e, t, n);
        break;
      case 1:
        if (!He && (Bn(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (u) {
          Ce(n, t, u);
        }
        Zt(e, t, n);
        break;
      case 21:
        Zt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (He = (r = He) || n.memoizedState !== null, Zt(e, t, n), He = r) : Zt(e, t, n);
        break;
      default:
        Zt(e, t, n);
    }
  }
  function Au(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new Ep()), t.forEach(function(r) {
        var l = Tp.bind(null, e, r);
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
              Te = u.stateNode, gt = !1;
              break e;
            case 3:
              Te = u.stateNode.containerInfo, gt = !0;
              break e;
            case 4:
              Te = u.stateNode.containerInfo, gt = !0;
              break e;
          }
          u = u.return;
        }
        if (Te === null) throw Error(s(160));
        Du(o, i, l), Te = null, gt = !1;
        var d = l.alternate;
        d !== null && (d.return = null), l.return = null;
      } catch (y) {
        Ce(l, t, y);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Fu(t, e), t = t.sibling;
  }
  function Fu(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (vt(t, e), Et(e), r & 4) {
          try {
            Pr(3, e, e.return), Ll(3, e);
          } catch (A) {
            Ce(e, e.return, A);
          }
          try {
            Pr(5, e, e.return);
          } catch (A) {
            Ce(e, e.return, A);
          }
        }
        break;
      case 1:
        vt(t, e), Et(e), r & 512 && n !== null && Bn(n, n.return);
        break;
      case 5:
        if (vt(t, e), Et(e), r & 512 && n !== null && Bn(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Zn(l, "");
          } catch (A) {
            Ce(e, e.return, A);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, u = e.type, d = e.updateQueue;
          if (e.updateQueue = null, d !== null) try {
            u === "input" && o.type === "radio" && o.name != null && fa(l, o), so(u, i);
            var y = so(u, o);
            for (i = 0; i < d.length; i += 2) {
              var j = d[i], _ = d[i + 1];
              j === "style" ? ka(l, _) : j === "dangerouslySetInnerHTML" ? xa(l, _) : j === "children" ? Zn(l, _) : W(l, j, _, y);
            }
            switch (u) {
              case "input":
                ro(l, o);
                break;
              case "textarea":
                ga(l, o);
                break;
              case "select":
                var E = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var R = o.value;
                R != null ? Cn(l, !!o.multiple, R, !1) : E !== !!o.multiple && (o.defaultValue != null ? Cn(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : Cn(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[xr] = o;
          } catch (A) {
            Ce(e, e.return, A);
          }
        }
        break;
      case 6:
        if (vt(t, e), Et(e), r & 4) {
          if (e.stateNode === null) throw Error(s(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (A) {
            Ce(e, e.return, A);
          }
        }
        break;
      case 3:
        if (vt(t, e), Et(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          sr(t.containerInfo);
        } catch (A) {
          Ce(e, e.return, A);
        }
        break;
      case 4:
        vt(t, e), Et(e);
        break;
      case 13:
        vt(t, e), Et(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (Oi = Ee())), r & 4 && Au(e);
        break;
      case 22:
        if (j = n !== null && n.memoizedState !== null, e.mode & 1 ? (He = (y = He) || j, vt(t, e), He = y) : vt(t, e), Et(e), r & 8192) {
          if (y = e.memoizedState !== null, (e.stateNode.isHidden = y) && !j && (e.mode & 1) !== 0) for (O = e, j = e.child; j !== null; ) {
            for (_ = O = j; O !== null; ) {
              switch (E = O, R = E.child, E.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Pr(4, E, E.return);
                  break;
                case 1:
                  Bn(E, E.return);
                  var I = E.stateNode;
                  if (typeof I.componentWillUnmount == "function") {
                    r = E, n = E.return;
                    try {
                      t = r, I.props = t.memoizedProps, I.state = t.memoizedState, I.componentWillUnmount();
                    } catch (A) {
                      Ce(r, n, A);
                    }
                  }
                  break;
                case 5:
                  Bn(E, E.return);
                  break;
                case 22:
                  if (E.memoizedState !== null) {
                    $u(_);
                    continue;
                  }
              }
              R !== null ? (R.return = E, O = R) : $u(_);
            }
            j = j.sibling;
          }
          e: for (j = null, _ = e; ; ) {
            if (_.tag === 5) {
              if (j === null) {
                j = _;
                try {
                  l = _.stateNode, y ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (u = _.stateNode, d = _.memoizedProps.style, i = d != null && d.hasOwnProperty("display") ? d.display : null, u.style.display = wa("display", i));
                } catch (A) {
                  Ce(e, e.return, A);
                }
              }
            } else if (_.tag === 6) {
              if (j === null) try {
                _.stateNode.nodeValue = y ? "" : _.memoizedProps;
              } catch (A) {
                Ce(e, e.return, A);
              }
            } else if ((_.tag !== 22 && _.tag !== 23 || _.memoizedState === null || _ === e) && _.child !== null) {
              _.child.return = _, _ = _.child;
              continue;
            }
            if (_ === e) break e;
            for (; _.sibling === null; ) {
              if (_.return === null || _.return === e) break e;
              j === _ && (j = null), _ = _.return;
            }
            j === _ && (j = null), _.sibling.return = _.return, _ = _.sibling;
          }
        }
        break;
      case 19:
        vt(t, e), Et(e), r & 4 && Au(e);
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
            if (Ou(n)) {
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
            r.flags & 32 && (Zn(l, ""), r.flags &= -33);
            var o = Iu(e);
            Li(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, u = Iu(e);
            Mi(e, u, i);
            break;
          default:
            throw Error(s(161));
        }
      } catch (d) {
        Ce(e, e.return, d);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function jp(e, t, n) {
    O = e, Uu(e);
  }
  function Uu(e, t, n) {
    for (var r = (e.mode & 1) !== 0; O !== null; ) {
      var l = O, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || Ml;
        if (!i) {
          var u = l.alternate, d = u !== null && u.memoizedState !== null || He;
          u = Ml;
          var y = He;
          if (Ml = i, (He = d) && !y) for (O = l; O !== null; ) i = O, d = i.child, i.tag === 22 && i.memoizedState !== null ? Hu(l) : d !== null ? (d.return = i, O = d) : Hu(l);
          for (; o !== null; ) O = o, Uu(o), o = o.sibling;
          O = l, Ml = u, He = y;
        }
        Vu(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, O = o) : Vu(e);
    }
  }
  function Vu(e) {
    for (; O !== null; ) {
      var t = O;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              He || Ll(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !He) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : ht(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && $s(t, o, r);
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
                $s(t, i, n);
              }
              break;
            case 5:
              var u = t.stateNode;
              if (n === null && t.flags & 4) {
                n = u;
                var d = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    d.autoFocus && n.focus();
                    break;
                  case "img":
                    d.src && (n.src = d.src);
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
                var y = t.alternate;
                if (y !== null) {
                  var j = y.memoizedState;
                  if (j !== null) {
                    var _ = j.dehydrated;
                    _ !== null && sr(_);
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
          He || t.flags & 512 && Pi(t);
        } catch (E) {
          Ce(t, t.return, E);
        }
      }
      if (t === e) {
        O = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, O = n;
        break;
      }
      O = t.return;
    }
  }
  function $u(e) {
    for (; O !== null; ) {
      var t = O;
      if (t === e) {
        O = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, O = n;
        break;
      }
      O = t.return;
    }
  }
  function Hu(e) {
    for (; O !== null; ) {
      var t = O;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Ll(4, t);
            } catch (d) {
              Ce(t, n, d);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (d) {
                Ce(t, l, d);
              }
            }
            var o = t.return;
            try {
              Pi(t);
            } catch (d) {
              Ce(t, o, d);
            }
            break;
          case 5:
            var i = t.return;
            try {
              Pi(t);
            } catch (d) {
              Ce(t, i, d);
            }
        }
      } catch (d) {
        Ce(t, t.return, d);
      }
      if (t === e) {
        O = null;
        break;
      }
      var u = t.sibling;
      if (u !== null) {
        u.return = t.return, O = u;
        break;
      }
      O = t.return;
    }
  }
  var _p = Math.ceil, Rl = ee.ReactCurrentDispatcher, Ri = ee.ReactCurrentOwner, ut = ee.ReactCurrentBatchConfig, le = 0, Le = null, _e = null, Oe = 0, lt = 0, Wn = Qt(0), Pe = 0, Mr = null, gn = 0, Tl = 0, Ti = 0, Lr = null, Ye = null, Oi = 0, Qn = 1 / 0, Tt = null, Ol = !1, Ii = null, qt = null, Il = !1, Jt = null, Dl = 0, Rr = 0, Di = null, Al = -1, Fl = 0;
  function We() {
    return (le & 6) !== 0 ? Ee() : Al !== -1 ? Al : Al = Ee();
  }
  function en(e) {
    return (e.mode & 1) === 0 ? 1 : (le & 2) !== 0 && Oe !== 0 ? Oe & -Oe : cp.transition !== null ? (Fl === 0 && (Fl = Ia()), Fl) : (e = ue, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Wa(e.type)), e);
  }
  function yt(e, t, n, r) {
    if (50 < Rr) throw Rr = 0, Di = null, Error(s(185));
    rr(e, n, r), ((le & 2) === 0 || e !== Le) && (e === Le && ((le & 2) === 0 && (Tl |= n), Pe === 4 && tn(e, Oe)), Xe(e, r), n === 1 && le === 0 && (t.mode & 1) === 0 && (Qn = Ee() + 500, fl && Gt()));
  }
  function Xe(e, t) {
    var n = e.callbackNode;
    cd(e, t);
    var r = Gr(e, e === Le ? Oe : 0);
    if (r === 0) n !== null && Ra(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && Ra(n), t === 1) e.tag === 0 ? up(Wu.bind(null, e)) : Ps(Wu.bind(null, e)), op(function() {
        (le & 6) === 0 && Gt();
      }), n = null;
      else {
        switch (Da(r)) {
          case 1:
            n = go;
            break;
          case 4:
            n = Ta;
            break;
          case 16:
            n = Br;
            break;
          case 536870912:
            n = Oa;
            break;
          default:
            n = Br;
        }
        n = Ju(n, Bu.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Bu(e, t) {
    if (Al = -1, Fl = 0, (le & 6) !== 0) throw Error(s(327));
    var n = e.callbackNode;
    if (Kn() && e.callbackNode !== n) return null;
    var r = Gr(e, e === Le ? Oe : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ul(e, r);
    else {
      t = r;
      var l = le;
      le |= 2;
      var o = Ku();
      (Le !== e || Oe !== t) && (Tt = null, Qn = Ee() + 500, yn(e, t));
      do
        try {
          Pp();
          break;
        } catch (u) {
          Qu(e, u);
        }
      while (!0);
      ti(), Rl.current = o, le = l, _e !== null ? t = 0 : (Le = null, Oe = 0, t = Pe);
    }
    if (t !== 0) {
      if (t === 2 && (l = vo(e), l !== 0 && (r = l, t = Ai(e, l))), t === 1) throw n = Mr, yn(e, 0), tn(e, r), Xe(e, Ee()), n;
      if (t === 6) tn(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !Np(l) && (t = Ul(e, r), t === 2 && (o = vo(e), o !== 0 && (r = o, t = Ai(e, o))), t === 1)) throw n = Mr, yn(e, 0), tn(e, r), Xe(e, Ee()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            xn(e, Ye, Tt);
            break;
          case 3:
            if (tn(e, r), (r & 130023424) === r && (t = Oi + 500 - Ee(), 10 < t)) {
              if (Gr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                We(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Bo(xn.bind(null, e, Ye, Tt), t);
              break;
            }
            xn(e, Ye, Tt);
            break;
          case 4:
            if (tn(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var i = 31 - pt(r);
              o = 1 << i, i = t[i], i > l && (l = i), r &= ~o;
            }
            if (r = l, r = Ee() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * _p(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Bo(xn.bind(null, e, Ye, Tt), r);
              break;
            }
            xn(e, Ye, Tt);
            break;
          case 5:
            xn(e, Ye, Tt);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return Xe(e, Ee()), e.callbackNode === n ? Bu.bind(null, e) : null;
  }
  function Ai(e, t) {
    var n = Lr;
    return e.current.memoizedState.isDehydrated && (yn(e, t).flags |= 256), e = Ul(e, t), e !== 2 && (t = Ye, Ye = n, t !== null && Fi(t)), e;
  }
  function Fi(e) {
    Ye === null ? Ye = e : Ye.push.apply(Ye, e);
  }
  function Np(e) {
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
  function tn(e, t) {
    for (t &= ~Ti, t &= ~Tl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - pt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Wu(e) {
    if ((le & 6) !== 0) throw Error(s(327));
    Kn();
    var t = Gr(e, 0);
    if ((t & 1) === 0) return Xe(e, Ee()), null;
    var n = Ul(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = vo(e);
      r !== 0 && (t = r, n = Ai(e, r));
    }
    if (n === 1) throw n = Mr, yn(e, 0), tn(e, t), Xe(e, Ee()), n;
    if (n === 6) throw Error(s(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, xn(e, Ye, Tt), Xe(e, Ee()), null;
  }
  function Ui(e, t) {
    var n = le;
    le |= 1;
    try {
      return e(t);
    } finally {
      le = n, le === 0 && (Qn = Ee() + 500, fl && Gt());
    }
  }
  function vn(e) {
    Jt !== null && Jt.tag === 0 && (le & 6) === 0 && Kn();
    var t = le;
    le |= 1;
    var n = ut.transition, r = ue;
    try {
      if (ut.transition = null, ue = 1, e) return e();
    } finally {
      ue = r, ut.transition = n, le = t, (le & 6) === 0 && Gt();
    }
  }
  function Vi() {
    lt = Wn.current, he(Wn);
  }
  function yn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, lp(n)), _e !== null) for (n = _e.return; n !== null; ) {
      var r = n;
      switch (Xo(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && dl();
          break;
        case 3:
          $n(), he(Qe), he(Ue), ui();
          break;
        case 5:
          ai(r);
          break;
        case 4:
          $n();
          break;
        case 13:
          he(ke);
          break;
        case 19:
          he(ke);
          break;
        case 10:
          ni(r.type._context);
          break;
        case 22:
        case 23:
          Vi();
      }
      n = n.return;
    }
    if (Le = e, _e = e = nn(e.current, null), Oe = lt = t, Pe = 0, Mr = null, Ti = Tl = gn = 0, Ye = Lr = null, fn !== null) {
      for (t = 0; t < fn.length; t++) if (n = fn[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, o = n.pending;
        if (o !== null) {
          var i = o.next;
          o.next = l, r.next = i;
        }
        n.pending = r;
      }
      fn = null;
    }
    return e;
  }
  function Qu(e, t) {
    do {
      var n = _e;
      try {
        if (ti(), Cl.current = _l, El) {
          for (var r = Se.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          El = !1;
        }
        if (hn = 0, Me = ze = Se = null, br = !1, jr = 0, Ri.current = null, n === null || n.return === null) {
          Pe = 1, Mr = t, _e = null;
          break;
        }
        e: {
          var o = e, i = n.return, u = n, d = t;
          if (t = Oe, u.flags |= 32768, d !== null && typeof d == "object" && typeof d.then == "function") {
            var y = d, j = u, _ = j.tag;
            if ((j.mode & 1) === 0 && (_ === 0 || _ === 11 || _ === 15)) {
              var E = j.alternate;
              E ? (j.updateQueue = E.updateQueue, j.memoizedState = E.memoizedState, j.lanes = E.lanes) : (j.updateQueue = null, j.memoizedState = null);
            }
            var R = vu(i);
            if (R !== null) {
              R.flags &= -257, yu(R, i, u, o, t), R.mode & 1 && gu(o, y, t), t = R, d = y;
              var I = t.updateQueue;
              if (I === null) {
                var A = /* @__PURE__ */ new Set();
                A.add(d), t.updateQueue = A;
              } else I.add(d);
              break e;
            } else {
              if ((t & 1) === 0) {
                gu(o, y, t), $i();
                break e;
              }
              d = Error(s(426));
            }
          } else if (ye && u.mode & 1) {
            var be = vu(i);
            if (be !== null) {
              (be.flags & 65536) === 0 && (be.flags |= 256), yu(be, i, u, o, t), Jo(Hn(d, u));
              break e;
            }
          }
          o = d = Hn(d, u), Pe !== 4 && (Pe = 2), Lr === null ? Lr = [o] : Lr.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var h = mu(o, d, t);
                Vs(o, h);
                break e;
              case 1:
                u = d;
                var p = o.type, v = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof p.getDerivedStateFromError == "function" || v !== null && typeof v.componentDidCatch == "function" && (qt === null || !qt.has(v)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var P = hu(o, u, t);
                  Vs(o, P);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        Yu(n);
      } catch (F) {
        t = F, _e === n && n !== null && (_e = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Ku() {
    var e = Rl.current;
    return Rl.current = _l, e === null ? _l : e;
  }
  function $i() {
    (Pe === 0 || Pe === 3 || Pe === 2) && (Pe = 4), Le === null || (gn & 268435455) === 0 && (Tl & 268435455) === 0 || tn(Le, Oe);
  }
  function Ul(e, t) {
    var n = le;
    le |= 2;
    var r = Ku();
    (Le !== e || Oe !== t) && (Tt = null, yn(e, t));
    do
      try {
        zp();
        break;
      } catch (l) {
        Qu(e, l);
      }
    while (!0);
    if (ti(), le = n, Rl.current = r, _e !== null) throw Error(s(261));
    return Le = null, Oe = 0, Pe;
  }
  function zp() {
    for (; _e !== null; ) Gu(_e);
  }
  function Pp() {
    for (; _e !== null && !td(); ) Gu(_e);
  }
  function Gu(e) {
    var t = qu(e.alternate, e, lt);
    e.memoizedProps = e.pendingProps, t === null ? Yu(e) : _e = t, Ri.current = null;
  }
  function Yu(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Sp(n, t, lt), n !== null) {
          _e = n;
          return;
        }
      } else {
        if (n = Cp(n, t), n !== null) {
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
  function xn(e, t, n) {
    var r = ue, l = ut.transition;
    try {
      ut.transition = null, ue = 1, Mp(e, t, n, r);
    } finally {
      ut.transition = l, ue = r;
    }
    return null;
  }
  function Mp(e, t, n, r) {
    do
      Kn();
    while (Jt !== null);
    if ((le & 6) !== 0) throw Error(s(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(s(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (dd(e, o), e === Le && (_e = Le = null, Oe = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Il || (Il = !0, Ju(Br, function() {
      return Kn(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = ut.transition, ut.transition = null;
      var i = ue;
      ue = 1;
      var u = le;
      le |= 4, Ri.current = null, bp(e, n), Fu(n, e), Zd($o), Zr = !!Vo, $o = Vo = null, e.current = n, jp(n), nd(), le = u, ue = i, ut.transition = o;
    } else e.current = n;
    if (Il && (Il = !1, Jt = e, Dl = l), o = e.pendingLanes, o === 0 && (qt = null), od(n.stateNode), Xe(e, Ee()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Ol) throw Ol = !1, e = Ii, Ii = null, e;
    return (Dl & 1) !== 0 && e.tag !== 0 && Kn(), o = e.pendingLanes, (o & 1) !== 0 ? e === Di ? Rr++ : (Rr = 0, Di = e) : Rr = 0, Gt(), null;
  }
  function Kn() {
    if (Jt !== null) {
      var e = Da(Dl), t = ut.transition, n = ue;
      try {
        if (ut.transition = null, ue = 16 > e ? 16 : e, Jt === null) var r = !1;
        else {
          if (e = Jt, Jt = null, Dl = 0, (le & 6) !== 0) throw Error(s(331));
          var l = le;
          for (le |= 4, O = e.current; O !== null; ) {
            var o = O, i = o.child;
            if ((O.flags & 16) !== 0) {
              var u = o.deletions;
              if (u !== null) {
                for (var d = 0; d < u.length; d++) {
                  var y = u[d];
                  for (O = y; O !== null; ) {
                    var j = O;
                    switch (j.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Pr(8, j, o);
                    }
                    var _ = j.child;
                    if (_ !== null) _.return = j, O = _;
                    else for (; O !== null; ) {
                      j = O;
                      var E = j.sibling, R = j.return;
                      if (Tu(j), j === y) {
                        O = null;
                        break;
                      }
                      if (E !== null) {
                        E.return = R, O = E;
                        break;
                      }
                      O = R;
                    }
                  }
                }
                var I = o.alternate;
                if (I !== null) {
                  var A = I.child;
                  if (A !== null) {
                    I.child = null;
                    do {
                      var be = A.sibling;
                      A.sibling = null, A = be;
                    } while (A !== null);
                  }
                }
                O = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && i !== null) i.return = o, O = i;
            else e: for (; O !== null; ) {
              if (o = O, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  Pr(9, o, o.return);
              }
              var h = o.sibling;
              if (h !== null) {
                h.return = o.return, O = h;
                break e;
              }
              O = o.return;
            }
          }
          var p = e.current;
          for (O = p; O !== null; ) {
            i = O;
            var v = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && v !== null) v.return = i, O = v;
            else e: for (i = p; O !== null; ) {
              if (u = O, (u.flags & 2048) !== 0) try {
                switch (u.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ll(9, u);
                }
              } catch (F) {
                Ce(u, u.return, F);
              }
              if (u === i) {
                O = null;
                break e;
              }
              var P = u.sibling;
              if (P !== null) {
                P.return = u.return, O = P;
                break e;
              }
              O = u.return;
            }
          }
          if (le = l, Gt(), wt && typeof wt.onPostCommitFiberRoot == "function") try {
            wt.onPostCommitFiberRoot(Wr, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        ue = n, ut.transition = t;
      }
    }
    return !1;
  }
  function Xu(e, t, n) {
    t = Hn(n, t), t = mu(e, t, 1), e = Xt(e, t, 1), t = We(), e !== null && (rr(e, 1, t), Xe(e, t));
  }
  function Ce(e, t, n) {
    if (e.tag === 3) Xu(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Xu(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (qt === null || !qt.has(r))) {
          e = Hn(n, e), e = hu(t, e, 1), t = Xt(t, e, 1), e = We(), t !== null && (rr(t, 1, e), Xe(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Lp(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = We(), e.pingedLanes |= e.suspendedLanes & n, Le === e && (Oe & n) === n && (Pe === 4 || Pe === 3 && (Oe & 130023424) === Oe && 500 > Ee() - Oi ? yn(e, 0) : Ti |= n), Xe(e, t);
  }
  function Zu(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Kr, Kr <<= 1, (Kr & 130023424) === 0 && (Kr = 4194304)));
    var n = We();
    e = Mt(e, t), e !== null && (rr(e, t, n), Xe(e, n));
  }
  function Rp(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Zu(e, n);
  }
  function Tp(e, t) {
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
    r !== null && r.delete(t), Zu(e, n);
  }
  var qu;
  qu = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Qe.current) Ge = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Ge = !1, kp(e, t, n);
      Ge = (e.flags & 131072) !== 0;
    }
    else Ge = !1, ye && (t.flags & 1048576) !== 0 && Ms(t, hl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Pl(e, t), e = t.pendingProps;
        var l = On(t, Ue.current);
        Vn(t, n), l = pi(null, t, r, e, l, n);
        var o = fi();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ke(r) ? (o = !0, pl(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, oi(t), l.updater = Nl, t.stateNode = l, l._reactInternals = t, xi(t, r, e, n), t = Ci(null, t, r, !0, o, n)) : (t.tag = 0, ye && o && Yo(t), Be(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Pl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Ip(r), e = ht(r, e), l) {
            case 0:
              t = Si(null, t, r, e, n);
              break e;
            case 1:
              t = Eu(null, t, r, e, n);
              break e;
            case 11:
              t = xu(null, t, r, e, n);
              break e;
            case 14:
              t = wu(null, t, r, ht(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), Si(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), Eu(e, t, r, l, n);
      case 3:
        e: {
          if (bu(t), e === null) throw Error(s(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, Us(e, t), kl(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Hn(Error(s(423)), t), t = ju(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Hn(Error(s(424)), t), t = ju(e, t, r, n, l);
            break e;
          } else for (rt = Wt(t.stateNode.containerInfo.firstChild), nt = t, ye = !0, mt = null, n = As(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (An(), r === l) {
              t = Rt(e, t, n);
              break e;
            }
            Be(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Hs(t), e === null && qo(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, Ho(r, l) ? i = null : o !== null && Ho(r, o) && (t.flags |= 32), Cu(e, t), Be(e, t, i, n), t.child;
      case 6:
        return e === null && qo(t), null;
      case 13:
        return _u(e, t, n);
      case 4:
        return ii(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Fn(t, null, r, n) : Be(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), xu(e, t, r, l, n);
      case 7:
        return Be(e, t, t.pendingProps, n), t.child;
      case 8:
        return Be(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Be(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, de(yl, r._currentValue), r._currentValue = i, o !== null) if (ft(o.value, i)) {
            if (o.children === l.children && !Qe.current) {
              t = Rt(e, t, n);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var u = o.dependencies;
            if (u !== null) {
              i = o.child;
              for (var d = u.firstContext; d !== null; ) {
                if (d.context === r) {
                  if (o.tag === 1) {
                    d = Lt(-1, n & -n), d.tag = 2;
                    var y = o.updateQueue;
                    if (y !== null) {
                      y = y.shared;
                      var j = y.pending;
                      j === null ? d.next = d : (d.next = j.next, j.next = d), y.pending = d;
                    }
                  }
                  o.lanes |= n, d = o.alternate, d !== null && (d.lanes |= n), ri(
                    o.return,
                    n,
                    t
                  ), u.lanes |= n;
                  break;
                }
                d = d.next;
              }
            } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (i = o.return, i === null) throw Error(s(341));
              i.lanes |= n, u = i.alternate, u !== null && (u.lanes |= n), ri(i, n, t), i = o.sibling;
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
        return l = t.type, r = t.pendingProps.children, Vn(t, n), l = at(l), r = r(l), t.flags |= 1, Be(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = ht(r, t.pendingProps), l = ht(r.type, l), wu(e, t, r, l, n);
      case 15:
        return ku(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), Pl(e, t), t.tag = 1, Ke(r) ? (e = !0, pl(t)) : e = !1, Vn(t, n), pu(t, r, l), xi(t, r, l, n), Ci(null, t, r, !0, e, n);
      case 19:
        return zu(e, t, n);
      case 22:
        return Su(e, t, n);
    }
    throw Error(s(156, t.tag));
  };
  function Ju(e, t) {
    return La(e, t);
  }
  function Op(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ct(e, t, n, r) {
    return new Op(e, t, n, r);
  }
  function Hi(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Ip(e) {
    if (typeof e == "function") return Hi(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === re) return 11;
      if (e === Je) return 14;
    }
    return 2;
  }
  function nn(e, t) {
    var n = e.alternate;
    return n === null ? (n = ct(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Vl(e, t, n, r, l, o) {
    var i = 2;
    if (r = e, typeof e == "function") Hi(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case we:
        return wn(n.children, l, o, t);
      case je:
        i = 8, l |= 8;
        break;
      case De:
        return e = ct(12, n, t, l | 2), e.elementType = De, e.lanes = o, e;
      case Ae:
        return e = ct(13, n, t, l), e.elementType = Ae, e.lanes = o, e;
      case Fe:
        return e = ct(19, n, t, l), e.elementType = Fe, e.lanes = o, e;
      case fe:
        return $l(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case qe:
            i = 10;
            break e;
          case dt:
            i = 9;
            break e;
          case re:
            i = 11;
            break e;
          case Je:
            i = 14;
            break e;
          case Ne:
            i = 16, r = null;
            break e;
        }
        throw Error(s(130, e == null ? e : typeof e, ""));
    }
    return t = ct(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
  }
  function wn(e, t, n, r) {
    return e = ct(7, e, r, t), e.lanes = n, e;
  }
  function $l(e, t, n, r) {
    return e = ct(22, e, r, t), e.elementType = fe, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Bi(e, t, n) {
    return e = ct(6, e, null, t), e.lanes = n, e;
  }
  function Wi(e, t, n) {
    return t = ct(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Dp(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = yo(0), this.expirationTimes = yo(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = yo(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Qi(e, t, n, r, l, o, i, u, d) {
    return e = new Dp(e, t, n, u, d), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = ct(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, oi(o), e;
  }
  function Ap(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: xe, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function ec(e) {
    if (!e) return Kt;
    e = e._reactInternals;
    e: {
      if (sn(e) !== e || e.tag !== 1) throw Error(s(170));
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
      throw Error(s(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Ke(n)) return Ns(e, n, t);
    }
    return t;
  }
  function tc(e, t, n, r, l, o, i, u, d) {
    return e = Qi(n, r, !0, e, l, o, i, u, d), e.context = ec(null), n = e.current, r = We(), l = en(n), o = Lt(r, l), o.callback = t ?? null, Xt(n, o, l), e.current.lanes = l, rr(e, l, r), Xe(e, r), e;
  }
  function Hl(e, t, n, r) {
    var l = t.current, o = We(), i = en(l);
    return n = ec(n), t.context === null ? t.context = n : t.pendingContext = n, t = Lt(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Xt(l, t, i), e !== null && (yt(e, l, i, o), wl(e, l, i)), i;
  }
  function Bl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function nc(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Ki(e, t) {
    nc(e, t), (e = e.alternate) && nc(e, t);
  }
  function Fp() {
    return null;
  }
  var rc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Gi(e) {
    this._internalRoot = e;
  }
  Wl.prototype.render = Gi.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    Hl(e, t, null, null);
  }, Wl.prototype.unmount = Gi.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      vn(function() {
        Hl(null, e, null, null);
      }), t[_t] = null;
    }
  };
  function Wl(e) {
    this._internalRoot = e;
  }
  Wl.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ua();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < $t.length && t !== 0 && t < $t[n].priority; n++) ;
      $t.splice(n, 0, e), n === 0 && Ha(e);
    }
  };
  function Yi(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Ql(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function lc() {
  }
  function Up(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var y = Bl(i);
          o.call(y);
        };
      }
      var i = tc(t, r, e, 0, null, !1, !1, "", lc);
      return e._reactRootContainer = i, e[_t] = i.current, vr(e.nodeType === 8 ? e.parentNode : e), vn(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var u = r;
      r = function() {
        var y = Bl(d);
        u.call(y);
      };
    }
    var d = Qi(e, 0, !1, null, null, !1, !1, "", lc);
    return e._reactRootContainer = d, e[_t] = d.current, vr(e.nodeType === 8 ? e.parentNode : e), vn(function() {
      Hl(t, d, n, r);
    }), d;
  }
  function Kl(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var u = l;
        l = function() {
          var d = Bl(i);
          u.call(d);
        };
      }
      Hl(t, i, e, l);
    } else i = Up(n, t, e, l, r);
    return Bl(i);
  }
  Aa = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = nr(t.pendingLanes);
          n !== 0 && (xo(t, n | 1), Xe(t, Ee()), (le & 6) === 0 && (Qn = Ee() + 500, Gt()));
        }
        break;
      case 13:
        vn(function() {
          var r = Mt(e, 1);
          if (r !== null) {
            var l = We();
            yt(r, e, 1, l);
          }
        }), Ki(e, 1);
    }
  }, wo = function(e) {
    if (e.tag === 13) {
      var t = Mt(e, 134217728);
      if (t !== null) {
        var n = We();
        yt(t, e, 134217728, n);
      }
      Ki(e, 134217728);
    }
  }, Fa = function(e) {
    if (e.tag === 13) {
      var t = en(e), n = Mt(e, t);
      if (n !== null) {
        var r = We();
        yt(n, e, t, r);
      }
      Ki(e, t);
    }
  }, Ua = function() {
    return ue;
  }, Va = function(e, t) {
    var n = ue;
    try {
      return ue = e, t();
    } finally {
      ue = n;
    }
  }, po = function(e, t, n) {
    switch (t) {
      case "input":
        if (ro(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = cl(r);
              if (!l) throw Error(s(90));
              da(r), ro(r, l);
            }
          }
        }
        break;
      case "textarea":
        ga(e, n);
        break;
      case "select":
        t = n.value, t != null && Cn(e, !!n.multiple, t, !1);
    }
  }, ba = Ui, ja = vn;
  var Vp = { usingClientEntryPoint: !1, Events: [wr, Rn, cl, Ca, Ea, Ui] }, Tr = { findFiberByHostInstance: un, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, $p = { bundleType: Tr.bundleType, version: Tr.version, rendererPackageName: Tr.rendererPackageName, rendererConfig: Tr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ee.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Pa(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Tr.findFiberByHostInstance || Fp, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Gl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Gl.isDisabled && Gl.supportsFiber) try {
      Wr = Gl.inject($p), wt = Gl;
    } catch {
    }
  }
  return Ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Vp, Ze.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Yi(t)) throw Error(s(200));
    return Ap(e, t, null, n);
  }, Ze.createRoot = function(e, t) {
    if (!Yi(e)) throw Error(s(299));
    var n = !1, r = "", l = rc;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Qi(e, 1, !1, null, null, n, !1, r, l), e[_t] = t.current, vr(e.nodeType === 8 ? e.parentNode : e), new Gi(t);
  }, Ze.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = Pa(t), e = e === null ? null : e.stateNode, e;
  }, Ze.flushSync = function(e) {
    return vn(e);
  }, Ze.hydrate = function(e, t, n) {
    if (!Ql(t)) throw Error(s(200));
    return Kl(null, e, t, !0, n);
  }, Ze.hydrateRoot = function(e, t, n) {
    if (!Yi(e)) throw Error(s(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = rc;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = tc(t, null, e, 1, n ?? null, l, !1, o, i), e[_t] = t.current, vr(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Wl(t);
  }, Ze.render = function(e, t, n) {
    if (!Ql(t)) throw Error(s(200));
    return Kl(null, e, t, !1, n);
  }, Ze.unmountComponentAtNode = function(e) {
    if (!Ql(e)) throw Error(s(40));
    return e._reactRootContainer ? (vn(function() {
      Kl(null, null, e, !1, function() {
        e._reactRootContainer = null, e[_t] = null;
      });
    }), !0) : !1;
  }, Ze.unstable_batchedUpdates = Ui, Ze.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Ql(n)) throw Error(s(200));
    if (e == null || e._reactInternals === void 0) throw Error(s(38));
    return Kl(e, t, n, !1, r);
  }, Ze.version = "18.3.1-next-f1338f8080-20240426", Ze;
}
var pc;
function ef() {
  if (pc) return qi.exports;
  pc = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (c) {
        console.error(c);
      }
  }
  return a(), qi.exports = Jp(), qi.exports;
}
var fc;
function tf() {
  if (fc) return Yl;
  fc = 1;
  var a = ef();
  return Yl.createRoot = a.createRoot, Yl.hydrateRoot = a.hydrateRoot, Yl;
}
var ql = tf();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nf = (a) => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), xc = (...a) => a.filter((c, s, g) => !!c && c.trim() !== "" && g.indexOf(c) === s).join(" ").trim();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var rf = {
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
const lf = X.forwardRef(
  ({
    color: a = "currentColor",
    size: c = 24,
    strokeWidth: s = 2,
    absoluteStrokeWidth: g,
    className: w = "",
    children: x,
    iconNode: k,
    ...S
  }, L) => X.createElement(
    "svg",
    {
      ref: L,
      ...rf,
      width: c,
      height: c,
      stroke: a,
      strokeWidth: g ? Number(s) * 24 / Number(c) : s,
      className: xc("lucide", w),
      ...S
    },
    [
      ...k.map(([V, G]) => X.createElement(V, G)),
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
const Ie = (a, c) => {
  const s = X.forwardRef(
    ({ className: g, ...w }, x) => X.createElement(lf, {
      ref: x,
      iconNode: c,
      className: xc(`lucide-${nf(a)}`, g),
      ...w
    })
  );
  return s.displayName = `${a}`, s;
};
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const of = Ie("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const af = Ie("ArrowUpDown", [
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
const sf = Ie("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ar = Ie("CalendarDays", [
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
const uf = Ie("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const aa = Ie("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cf = Ie("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const df = Ie("Ellipsis", [
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
const pf = Ie("ExternalLink", [
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
const wc = Ie("GraduationCap", [
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
const kc = Ie("Hash", [
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
const Jl = Ie("MapPin", [
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
const ff = Ie("Pin", [
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
const sa = Ie("SearchX", [
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
const mf = Ie("Trash2", [
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
const Sc = Ie("TriangleAlert", [
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
const eo = Ie("UserRound", [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
]);
var hf = Object.defineProperty, ua = (a, c) => hf(a, "name", { value: c, configurable: !0 });
function na(a, c) {
  if (typeof a == "function")
    return a(c);
  a != null && (a.current = c);
}
ua(na, "setRef");
function Cc(...a) {
  return (c) => {
    let s = !1;
    const g = a.map((w) => {
      const x = na(w, c);
      return !s && typeof x == "function" && (s = !0), x;
    });
    if (s)
      return () => {
        for (let w = 0; w < g.length; w++) {
          const x = g[w];
          typeof x == "function" ? x() : na(a[w], null);
        }
      };
  };
}
ua(Cc, "composeRefs");
function Ec(...a) {
  return X.useCallback(Cc(...a), a);
}
ua(Ec, "useComposedRefs");
var gf = Object.defineProperty, xt = (a, c) => gf(a, "name", { value: c, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function bc(a) {
  const c = X.forwardRef((s, g) => {
    let { children: w, ...x } = s, k = null, S = !1;
    const L = [];
    ra(w) && typeof Xl == "function" && (w = Xl(w._payload)), X.Children.forEach(w, (D) => {
      var q;
      if (zc(D)) {
        S = !0;
        const N = D;
        let z = "child" in N.props ? N.props.child : N.props.children;
        ra(z) && typeof Xl == "function" && (z = Xl(z._payload)), k = xf(N, z), L.push((q = k == null ? void 0 : k.props) == null ? void 0 : q.children);
      } else
        L.push(D);
    }), k ? k = X.cloneElement(k, void 0, L) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !S && X.Children.count(w) === 1 && X.isValidElement(w) && (k = w)
    );
    const V = k ? Nc(k) : void 0, G = Ec(g, V);
    if (!k) {
      if (w || w === 0)
        throw new Error(
          S ? Sf(a) : kf(a)
        );
      return w;
    }
    const H = _c(x, k.props ?? {});
    return k.type !== X.Fragment && (H.ref = g ? G : V), X.cloneElement(k, H);
  });
  return c.displayName = `${a}.Slot`, c;
}
xt(bc, "createSlot");
var vf = /* @__PURE__ */ bc("Slot"), jc = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function yf(a) {
  const c = /* @__PURE__ */ xt((s) => "child" in s ? s.children(s.child) : s.children, "Slottable");
  return c.displayName = `${a}.Slottable`, c.__radixId = jc, c;
}
xt(yf, "createSlottable");
var xf = /* @__PURE__ */ xt((a, c) => {
  if ("child" in a.props) {
    const s = a.props.child;
    return X.isValidElement(s) ? X.cloneElement(s, void 0, a.props.children(s.props.children)) : null;
  }
  return X.isValidElement(c) ? c : null;
}, "getSlottableElementFromSlottable");
function _c(a, c) {
  const s = { ...c };
  for (const g in c) {
    const w = a[g], x = c[g];
    /^on[A-Z]/.test(g) ? w && x ? s[g] = (...S) => {
      const L = x(...S);
      return w(...S), L;
    } : w && (s[g] = w) : g === "style" ? s[g] = { ...w, ...x } : g === "className" && (s[g] = [w, x].filter(Boolean).join(" "));
  }
  return { ...a, ...s };
}
xt(_c, "mergeProps");
function Nc(a) {
  var g, w;
  let c = (g = Object.getOwnPropertyDescriptor(a.props, "ref")) == null ? void 0 : g.get, s = c && "isReactWarning" in c && c.isReactWarning;
  return s ? a.ref : (c = (w = Object.getOwnPropertyDescriptor(a, "ref")) == null ? void 0 : w.get, s = c && "isReactWarning" in c && c.isReactWarning, s ? a.props.ref : a.props.ref || a.ref);
}
xt(Nc, "getElementRef");
function zc(a) {
  return X.isValidElement(a) && typeof a.type == "function" && "__radixId" in a.type && a.type.__radixId === jc;
}
xt(zc, "isSlottable");
var wf = Symbol.for("react.lazy");
function ra(a) {
  return a != null && typeof a == "object" && "$$typeof" in a && a.$$typeof === wf && "_payload" in a && Pc(a._payload);
}
xt(ra, "isLazyComponent");
function Pc(a) {
  return typeof a == "object" && a !== null && "then" in a;
}
xt(Pc, "isPromiseLike");
var kf = /* @__PURE__ */ xt((a) => `${a} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Sf = /* @__PURE__ */ xt((a) => `${a} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Xl = Xp[" use ".trim().toString()];
function Mc(a) {
  var c, s, g = "";
  if (typeof a == "string" || typeof a == "number") g += a;
  else if (typeof a == "object") if (Array.isArray(a)) {
    var w = a.length;
    for (c = 0; c < w; c++) a[c] && (s = Mc(a[c])) && (g && (g += " "), g += s);
  } else for (s in a) a[s] && (g && (g += " "), g += s);
  return g;
}
function Lc() {
  for (var a, c, s = 0, g = "", w = arguments.length; s < w; s++) (a = arguments[s]) && (c = Mc(a)) && (g && (g += " "), g += c);
  return g;
}
const mc = (a) => typeof a == "boolean" ? `${a}` : a === 0 ? "0" : a, hc = Lc, Cf = (a, c) => (s) => {
  var g;
  if ((c == null ? void 0 : c.variants) == null) return hc(a, s == null ? void 0 : s.class, s == null ? void 0 : s.className);
  const { variants: w, defaultVariants: x } = c, k = Object.keys(w).map((V) => {
    const G = s == null ? void 0 : s[V], H = x == null ? void 0 : x[V];
    if (G === null) return null;
    const D = mc(G) || mc(H);
    return w[V][D];
  }), S = s && Object.entries(s).reduce((V, G) => {
    let [H, D] = G;
    return D === void 0 || (V[H] = D), V;
  }, {}), L = c == null || (g = c.compoundVariants) === null || g === void 0 ? void 0 : g.reduce((V, G) => {
    let { class: H, className: D, ...q } = G;
    return Object.entries(q).every((N) => {
      let [z, C] = N;
      return Array.isArray(C) ? C.includes({
        ...x,
        ...S
      }[z]) : {
        ...x,
        ...S
      }[z] === C;
    }) ? [
      ...V,
      H,
      D
    ] : V;
  }, []);
  return hc(a, k, L, s == null ? void 0 : s.class, s == null ? void 0 : s.className);
}, ca = "-", Ef = (a) => {
  const c = jf(a), {
    conflictingClassGroups: s,
    conflictingClassGroupModifiers: g
  } = a;
  return {
    getClassGroupId: (k) => {
      const S = k.split(ca);
      return S[0] === "" && S.length !== 1 && S.shift(), Rc(S, c) || bf(k);
    },
    getConflictingClassGroupIds: (k, S) => {
      const L = s[k] || [];
      return S && g[k] ? [...L, ...g[k]] : L;
    }
  };
}, Rc = (a, c) => {
  var k;
  if (a.length === 0)
    return c.classGroupId;
  const s = a[0], g = c.nextPart.get(s), w = g ? Rc(a.slice(1), g) : void 0;
  if (w)
    return w;
  if (c.validators.length === 0)
    return;
  const x = a.join(ca);
  return (k = c.validators.find(({
    validator: S
  }) => S(x))) == null ? void 0 : k.classGroupId;
}, gc = /^\[(.+)\]$/, bf = (a) => {
  if (gc.test(a)) {
    const c = gc.exec(a)[1], s = c == null ? void 0 : c.substring(0, c.indexOf(":"));
    if (s)
      return "arbitrary.." + s;
  }
}, jf = (a) => {
  const {
    theme: c,
    prefix: s
  } = a, g = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Nf(Object.entries(a.classGroups), s).forEach(([x, k]) => {
    la(k, g, x, c);
  }), g;
}, la = (a, c, s, g) => {
  a.forEach((w) => {
    if (typeof w == "string") {
      const x = w === "" ? c : vc(c, w);
      x.classGroupId = s;
      return;
    }
    if (typeof w == "function") {
      if (_f(w)) {
        la(w(g), c, s, g);
        return;
      }
      c.validators.push({
        validator: w,
        classGroupId: s
      });
      return;
    }
    Object.entries(w).forEach(([x, k]) => {
      la(k, vc(c, x), s, g);
    });
  });
}, vc = (a, c) => {
  let s = a;
  return c.split(ca).forEach((g) => {
    s.nextPart.has(g) || s.nextPart.set(g, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), s = s.nextPart.get(g);
  }), s;
}, _f = (a) => a.isThemeGetter, Nf = (a, c) => c ? a.map(([s, g]) => {
  const w = g.map((x) => typeof x == "string" ? c + x : typeof x == "object" ? Object.fromEntries(Object.entries(x).map(([k, S]) => [c + k, S])) : x);
  return [s, w];
}) : a, zf = (a) => {
  if (a < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let c = 0, s = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map();
  const w = (x, k) => {
    s.set(x, k), c++, c > a && (c = 0, g = s, s = /* @__PURE__ */ new Map());
  };
  return {
    get(x) {
      let k = s.get(x);
      if (k !== void 0)
        return k;
      if ((k = g.get(x)) !== void 0)
        return w(x, k), k;
    },
    set(x, k) {
      s.has(x) ? s.set(x, k) : w(x, k);
    }
  };
}, Tc = "!", Pf = (a) => {
  const {
    separator: c,
    experimentalParseClassName: s
  } = a, g = c.length === 1, w = c[0], x = c.length, k = (S) => {
    const L = [];
    let V = 0, G = 0, H;
    for (let C = 0; C < S.length; C++) {
      let B = S[C];
      if (V === 0) {
        if (B === w && (g || S.slice(C, C + x) === c)) {
          L.push(S.slice(G, C)), G = C + x;
          continue;
        }
        if (B === "/") {
          H = C;
          continue;
        }
      }
      B === "[" ? V++ : B === "]" && V--;
    }
    const D = L.length === 0 ? S : S.substring(G), q = D.startsWith(Tc), N = q ? D.substring(1) : D, z = H && H > G ? H - G : void 0;
    return {
      modifiers: L,
      hasImportantModifier: q,
      baseClassName: N,
      maybePostfixModifierPosition: z
    };
  };
  return s ? (S) => s({
    className: S,
    parseClassName: k
  }) : k;
}, Mf = (a) => {
  if (a.length <= 1)
    return a;
  const c = [];
  let s = [];
  return a.forEach((g) => {
    g[0] === "[" ? (c.push(...s.sort(), g), s = []) : s.push(g);
  }), c.push(...s.sort()), c;
}, Lf = (a) => ({
  cache: zf(a.cacheSize),
  parseClassName: Pf(a),
  ...Ef(a)
}), Rf = /\s+/, Tf = (a, c) => {
  const {
    parseClassName: s,
    getClassGroupId: g,
    getConflictingClassGroupIds: w
  } = c, x = [], k = a.trim().split(Rf);
  let S = "";
  for (let L = k.length - 1; L >= 0; L -= 1) {
    const V = k[L], {
      modifiers: G,
      hasImportantModifier: H,
      baseClassName: D,
      maybePostfixModifierPosition: q
    } = s(V);
    let N = !!q, z = g(N ? D.substring(0, q) : D);
    if (!z) {
      if (!N) {
        S = V + (S.length > 0 ? " " + S : S);
        continue;
      }
      if (z = g(D), !z) {
        S = V + (S.length > 0 ? " " + S : S);
        continue;
      }
      N = !1;
    }
    const C = Mf(G).join(":"), B = H ? C + Tc : C, U = B + z;
    if (x.includes(U))
      continue;
    x.push(U);
    const W = w(z, N);
    for (let ee = 0; ee < W.length; ++ee) {
      const pe = W[ee];
      x.push(B + pe);
    }
    S = V + (S.length > 0 ? " " + S : S);
  }
  return S;
};
function Of() {
  let a = 0, c, s, g = "";
  for (; a < arguments.length; )
    (c = arguments[a++]) && (s = Oc(c)) && (g && (g += " "), g += s);
  return g;
}
const Oc = (a) => {
  if (typeof a == "string")
    return a;
  let c, s = "";
  for (let g = 0; g < a.length; g++)
    a[g] && (c = Oc(a[g])) && (s && (s += " "), s += c);
  return s;
};
function If(a, ...c) {
  let s, g, w, x = k;
  function k(L) {
    const V = c.reduce((G, H) => H(G), a());
    return s = Lf(V), g = s.cache.get, w = s.cache.set, x = S, S(L);
  }
  function S(L) {
    const V = g(L);
    if (V)
      return V;
    const G = Tf(L, s);
    return w(L, G), G;
  }
  return function() {
    return x(Of.apply(null, arguments));
  };
}
const ge = (a) => {
  const c = (s) => s[a] || [];
  return c.isThemeGetter = !0, c;
}, Ic = /^\[(?:([a-z-]+):)?(.+)\]$/i, Df = /^\d+\/\d+$/, Af = /* @__PURE__ */ new Set(["px", "full", "screen"]), Ff = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Uf = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Vf = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, $f = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Hf = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ot = (a) => Gn(a) || Af.has(a) || Df.test(a), ln = (a) => Yn(a, "length", Zf), Gn = (a) => !!a && !Number.isNaN(Number(a)), ta = (a) => Yn(a, "number", Gn), Ir = (a) => !!a && Number.isInteger(Number(a)), Bf = (a) => a.endsWith("%") && Gn(a.slice(0, -1)), Z = (a) => Ic.test(a), on = (a) => Ff.test(a), Wf = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Qf = (a) => Yn(a, Wf, Dc), Kf = (a) => Yn(a, "position", Dc), Gf = /* @__PURE__ */ new Set(["image", "url"]), Yf = (a) => Yn(a, Gf, Jf), Xf = (a) => Yn(a, "", qf), Dr = () => !0, Yn = (a, c, s) => {
  const g = Ic.exec(a);
  return g ? g[1] ? typeof c == "string" ? g[1] === c : c.has(g[1]) : s(g[2]) : !1;
}, Zf = (a) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Uf.test(a) && !Vf.test(a)
), Dc = () => !1, qf = (a) => $f.test(a), Jf = (a) => Hf.test(a), em = () => {
  const a = ge("colors"), c = ge("spacing"), s = ge("blur"), g = ge("brightness"), w = ge("borderColor"), x = ge("borderRadius"), k = ge("borderSpacing"), S = ge("borderWidth"), L = ge("contrast"), V = ge("grayscale"), G = ge("hueRotate"), H = ge("invert"), D = ge("gap"), q = ge("gradientColorStops"), N = ge("gradientColorStopPositions"), z = ge("inset"), C = ge("margin"), B = ge("opacity"), U = ge("padding"), W = ge("saturate"), ee = ge("scale"), pe = ge("sepia"), xe = ge("skew"), we = ge("space"), je = ge("translate"), De = () => ["auto", "contain", "none"], qe = () => ["auto", "hidden", "clip", "visible", "scroll"], dt = () => ["auto", Z, c], re = () => [Z, c], Ae = () => ["", Ot, ln], Fe = () => ["auto", Gn, Z], Je = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Ne = () => ["solid", "dashed", "dotted", "double", "none"], fe = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], M = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], $ = () => ["", "0", Z], T = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], m = () => [Gn, Z];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Dr],
      spacing: [Ot, ln],
      blur: ["none", "", on, Z],
      brightness: m(),
      borderColor: [a],
      borderRadius: ["none", "", "full", on, Z],
      borderSpacing: re(),
      borderWidth: Ae(),
      contrast: m(),
      grayscale: $(),
      hueRotate: m(),
      invert: $(),
      gap: re(),
      gradientColorStops: [a],
      gradientColorStopPositions: [Bf, ln],
      inset: dt(),
      margin: dt(),
      opacity: m(),
      padding: re(),
      saturate: m(),
      scale: m(),
      sepia: $(),
      skew: m(),
      space: re(),
      translate: re()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", Z]
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
        columns: [on]
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
        object: [...Je(), Z]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: qe()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": qe()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": qe()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: De()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": De()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": De()
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
        inset: [z]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [z]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [z]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [z]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [z]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [z]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [z]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [z]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [z]
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
        z: ["auto", Ir, Z]
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
        flex: ["1", "auto", "initial", "none", Z]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: $()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: $()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", Ir, Z]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Dr]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Ir, Z]
        }, Z]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": Fe()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": Fe()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [Dr]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Ir, Z]
        }, Z]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": Fe()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": Fe()
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
        "auto-cols": ["auto", "min", "max", "fr", Z]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", Z]
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
        justify: ["normal", ...M()]
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
        content: ["normal", ...M(), "baseline"]
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
        "place-content": [...M(), "baseline"]
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
        p: [U]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [U]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [U]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [U]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [U]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [U]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [U]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [U]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [U]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [C]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [C]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [C]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [C]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [C]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [C]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [C]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [C]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [C]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [we]
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
        "space-y": [we]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", Z, c]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [Z, c, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [Z, c, "none", "full", "min", "max", "fit", "prose", {
          screen: [on]
        }, on]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [Z, c, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [Z, c, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [Z, c, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [Z, c, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", on, ln]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", ta]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Dr]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", Z]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", Gn, ta]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", Ot, Z]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", Z]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", Z]
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
        "placeholder-opacity": [B]
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
        "text-opacity": [B]
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
        decoration: [...Ne(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", Ot, ln]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", Ot, Z]
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
        indent: re()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", Z]
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
        content: ["none", Z]
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
        "bg-opacity": [B]
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
        bg: [...Je(), Kf]
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
        bg: ["auto", "cover", "contain", Qf]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Yf]
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
        from: [N]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [N]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [N]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [q]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [q]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [q]
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
        border: [S]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [S]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [S]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [S]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [S]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [S]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [S]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [S]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [S]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [B]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...Ne(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [S]
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
        "divide-y": [S]
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
        "divide-opacity": [B]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: Ne()
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
        outline: ["", ...Ne()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [Ot, Z]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [Ot, ln]
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
        ring: Ae()
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
        "ring-opacity": [B]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [Ot, ln]
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
        shadow: ["", "inner", "none", on, Xf]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Dr]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [B]
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
        blur: [s]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [g]
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
        "drop-shadow": ["", "none", on, Z]
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
        "hue-rotate": [G]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [H]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [W]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [pe]
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
        "backdrop-brightness": [g]
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
        "backdrop-hue-rotate": [G]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [H]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [B]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [W]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [pe]
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
        "border-spacing": [k]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [k]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [k]
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
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", Z]
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
        ease: ["linear", "in", "out", "in-out", Z]
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
        animate: ["none", "spin", "ping", "pulse", "bounce", Z]
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
        scale: [ee]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [ee]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [ee]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [Ir, Z]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [je]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [je]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [xe]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [xe]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", Z]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", Z]
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
        "scroll-m": re()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": re()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": re()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": re()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": re()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": re()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": re()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": re()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": re()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": re()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": re()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": re()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": re()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": re()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": re()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": re()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": re()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": re()
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
        "will-change": ["auto", "scroll", "contents", "transform", Z]
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
        stroke: [Ot, ln, ta]
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
}, tm = /* @__PURE__ */ If(em);
function Sn(...a) {
  return tm(Lc(a));
}
const nm = Cf(
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
), Ac = X.forwardRef(
  ({ className: a, variant: c, size: s, asChild: g = !1, ...w }, x) => {
    const k = g ? vf : "button";
    return /* @__PURE__ */ f.jsx(k, { className: Sn(nm({ variant: c, size: s, className: a })), ref: x, ...w });
  }
);
Ac.displayName = "Button";
const Fc = X.forwardRef(
  ({ className: a, ...c }, s) => /* @__PURE__ */ f.jsx("div", { className: "dt-relative dt-w-full dt-overflow-auto", children: /* @__PURE__ */ f.jsx("table", { ref: s, className: Sn("dt-w-full dt-caption-bottom dt-text-sm", a), ...c }) })
);
Fc.displayName = "Table";
const Uc = X.forwardRef(({ className: a, ...c }, s) => /* @__PURE__ */ f.jsx("thead", { ref: s, className: Sn("[&_tr]:dt-border-b", a), ...c }));
Uc.displayName = "TableHeader";
const Vc = X.forwardRef(({ className: a, ...c }, s) => /* @__PURE__ */ f.jsx("tbody", { ref: s, className: Sn("[&_tr:last-child]:dt-border-0", a), ...c }));
Vc.displayName = "TableBody";
const oa = X.forwardRef(
  ({ className: a, ...c }, s) => /* @__PURE__ */ f.jsx(
    "tr",
    {
      ref: s,
      className: Sn(
        "dt-border-b dt-transition-colors hover:dt-bg-muted/50 data-[state=selected]:dt-bg-muted",
        a
      ),
      ...c
    }
  )
);
oa.displayName = "TableRow";
const bt = X.forwardRef(({ className: a, ...c }, s) => /* @__PURE__ */ f.jsx(
  "th",
  {
    ref: s,
    className: Sn(
      "dt-h-12 dt-px-4 dt-text-left dt-align-middle dt-font-medium dt-text-muted-foreground [&:has([role=checkbox])]:dt-pr-0",
      a
    ),
    ...c
  }
));
bt.displayName = "TableHead";
const jt = X.forwardRef(({ className: a, ...c }, s) => /* @__PURE__ */ f.jsx(
  "td",
  {
    ref: s,
    className: Sn("dt-p-4 dt-align-middle [&:has([role=checkbox])]:dt-pr-0", a),
    ...c
  }
));
jt.displayName = "TableCell";
function yc(a) {
  return a ? a.split(" | ").map((c) => c.replace("/", "-")) : ["·"];
}
function rm({
  label: a,
  active: c,
  dir: s,
  onClick: g
}) {
  const w = c ? s === 1 ? sf : of : af;
  return /* @__PURE__ */ f.jsxs(Ac, { variant: "ghost", size: "sm", onClick: g, className: "dt--ml-3", children: [
    a,
    /* @__PURE__ */ f.jsx(w, { className: `dt-ml-1.5 dt-inline dt-size-3.5${c ? "" : " dt-opacity-40"}` })
  ] });
}
function $c(a) {
  const { rows: c, sortKey: s, sortDir: g, onSortChange: w, onRowClick: x, onToggleSelect: k, onToggleFavorite: S, allSelected: L, onSelectAll: V, emptyMessage: G, ariaLabel: H, labels: D } = a;
  if (!c.length)
    return /* @__PURE__ */ f.jsx("p", { className: "dt-p-6 dt-text-center dt-text-sm dt-text-muted-foreground", children: G });
  const q = (N, z) => /* @__PURE__ */ f.jsx(rm, { label: z, active: s === N, dir: g, onClick: () => w(N) });
  return /* @__PURE__ */ f.jsx("div", { className: "dersler-table-root dt-overflow-hidden dt-rounded-lg dt-border dt-border-border", children: /* @__PURE__ */ f.jsxs(Fc, { "aria-label": H, children: [
    /* @__PURE__ */ f.jsx(Uc, { children: /* @__PURE__ */ f.jsxs(oa, { children: [
      /* @__PURE__ */ f.jsx(bt, { className: "dt-h-9 dt-w-8 dt-p-2", children: /* @__PURE__ */ f.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: L,
          "aria-label": D.selectAll,
          onChange: (N) => V(N.target.checked)
        }
      ) }),
      /* @__PURE__ */ f.jsx(bt, { className: "dt-h-9 dt-w-8 dt-p-2" }),
      /* @__PURE__ */ f.jsx(bt, { className: "dt-h-9 dt-p-2", children: q("crn", D.crn) }),
      /* @__PURE__ */ f.jsx(bt, { className: "dt-h-9 dt-p-2", children: q("code", D.code) }),
      /* @__PURE__ */ f.jsx(bt, { className: "dt-h-9 dt-p-2", children: q("name", D.name) }),
      /* @__PURE__ */ f.jsx(bt, { className: "dt-h-9 dt-p-2", children: q("instructor", D.instructor) }),
      /* @__PURE__ */ f.jsx(bt, { className: "dt-h-9 dt-p-2", children: q("when", D.when) }),
      /* @__PURE__ */ f.jsx(bt, { className: "dt-h-9 dt-p-2", children: D.where }),
      /* @__PURE__ */ f.jsx(bt, { className: "dt-h-9 dt-p-2 dt-text-right", children: q("fill", D.fill) })
    ] }) }),
    /* @__PURE__ */ f.jsx(Vc, { children: c.map((N) => /* @__PURE__ */ f.jsxs(oa, { className: "dt-cursor-pointer", onClick: () => x(N.key), children: [
      /* @__PURE__ */ f.jsx(jt, { className: "dt-p-2", onClick: (z) => z.stopPropagation(), children: /* @__PURE__ */ f.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: N.selected,
          "aria-label": D.selectSection,
          onChange: (z) => k(N.key, z.target.checked)
        }
      ) }),
      /* @__PURE__ */ f.jsx(jt, { className: "dt-p-2", onClick: (z) => z.stopPropagation(), children: /* @__PURE__ */ f.jsx(
        "button",
        {
          type: "button",
          className: "dt-text-base dt-leading-none",
          "aria-label": N.favorite ? D.removeFav : D.addFav,
          "aria-pressed": N.favorite,
          onClick: () => S(N.key),
          children: N.favorite ? "★" : "☆"
        }
      ) }),
      /* @__PURE__ */ f.jsx(jt, { className: "dt-p-2 dt-font-mono dt-text-muted-foreground", dangerouslySetInnerHTML: { __html: N.crnHTML } }),
      /* @__PURE__ */ f.jsx(jt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: N.codeHTML } }),
      /* @__PURE__ */ f.jsx(jt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: N.nameHTML } }),
      /* @__PURE__ */ f.jsx(jt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: N.instructorHTML } }),
      /* @__PURE__ */ f.jsx(jt, { className: "dt-p-2 dt-font-mono dt-text-xs", children: yc(N.when).map((z, C) => /* @__PURE__ */ f.jsx("div", { children: z }, C)) }),
      /* @__PURE__ */ f.jsx(jt, { className: "dt-p-2 dt-text-xs dt-text-muted-foreground", children: N.where ? yc(N.where).map((z, C) => /* @__PURE__ */ f.jsx("div", { children: z }, C)) : "·" }),
      /* @__PURE__ */ f.jsx(jt, { className: "dt-p-2 dt-text-right dt-tabular-nums", dangerouslySetInnerHTML: { __html: N.quotaHTML } })
    ] }, N.key)) })
  ] }) });
}
const kn = (a) => `${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
function Hc(a) {
  const c = [...a].sort((x, k) => x.start - k.start || x.end - k.end), s = [], g = c.map((x) => {
    let k = s.findIndex((S) => S <= x.start);
    return k < 0 ? (k = s.length, s.push(x.end)) : s[k] = x.end, { ...x, lane: k, laneCount: 1, conflict: !1 };
  }), w = Math.max(1, s.length);
  return g.map((x) => ({
    ...x,
    laneCount: w,
    conflict: g.some((k) => k.key !== x.key && x.start < k.end && k.start < x.end)
  }));
}
function lm() {
  const a = "(max-width: 600px)", [c, s] = X.useState(() => window.matchMedia(a).matches);
  return X.useEffect(() => {
    const g = window.matchMedia(a), w = () => s(g.matches);
    return g.addEventListener("change", w), () => g.removeEventListener("change", w);
  }, []), c;
}
function Bc({ session: a, compact: c = !1 }) {
  return /* @__PURE__ */ f.jsxs("span", { className: "pp-session-meta", children: [
    /* @__PURE__ */ f.jsxs("span", { children: [
      /* @__PURE__ */ f.jsx(aa, { "aria-hidden": "true" }),
      kn(a.start),
      "–",
      kn(a.end)
    ] }),
    /* @__PURE__ */ f.jsxs("span", { children: [
      /* @__PURE__ */ f.jsx(kc, { "aria-hidden": "true" }),
      a.crn
    ] }),
    !c && a.instructor && /* @__PURE__ */ f.jsxs("span", { children: [
      /* @__PURE__ */ f.jsx(eo, { "aria-hidden": "true" }),
      a.instructor
    ] }),
    !c && a.where && /* @__PURE__ */ f.jsxs("span", { children: [
      /* @__PURE__ */ f.jsx(Jl, { "aria-hidden": "true" }),
      a.where
    ] })
  ] });
}
function om({ props: a, visibleDays: c }) {
  const s = c.find((k) => a.sessions.some((S) => S.day === k)) ?? c[0], [g, w] = X.useState(s);
  X.useEffect(() => {
    c.includes(g) || w(s);
  }, [g, s, c]);
  const x = Hc(a.sessions.filter((k) => k.day === g));
  return /* @__PURE__ */ f.jsxs("div", { className: "pp-agenda", children: [
    /* @__PURE__ */ f.jsx("div", { className: "pp-day-tabs", role: "tablist", "aria-label": a.labels.title, style: { "--pp-days": c.length }, children: c.map((k) => /* @__PURE__ */ f.jsxs("button", { type: "button", role: "tab", "aria-selected": g === k, className: g === k ? "is-active" : "", onClick: () => w(k), children: [
      a.dayLabels[k],
      a.sessions.some((S) => S.day === k) && /* @__PURE__ */ f.jsx("span", { "aria-hidden": "true" })
    ] }, k)) }),
    /* @__PURE__ */ f.jsx("div", { className: "pp-agenda-list", children: x.length ? x.map((k) => /* @__PURE__ */ f.jsxs(
      "button",
      {
        type: "button",
        className: `pp-agenda-card${k.conflict ? " is-conflict" : ""}`,
        style: { "--pp-color": k.color },
        onClick: () => a.onOpen(k.rowKey),
        children: [
          /* @__PURE__ */ f.jsxs("span", { className: "pp-agenda-time", children: [
            /* @__PURE__ */ f.jsx("b", { children: kn(k.start) }),
            /* @__PURE__ */ f.jsx("small", { children: kn(k.end) })
          ] }),
          /* @__PURE__ */ f.jsxs("span", { className: "pp-agenda-copy", children: [
            /* @__PURE__ */ f.jsxs("strong", { children: [
              /* @__PURE__ */ f.jsx("span", { className: "pp-color-dot" }),
              k.code
            ] }),
            /* @__PURE__ */ f.jsx("span", { className: "pp-agenda-name", children: k.name }),
            /* @__PURE__ */ f.jsx(Bc, { session: k, compact: !0 }),
            k.instructor && /* @__PURE__ */ f.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ f.jsx(eo, { "aria-hidden": "true" }),
              k.instructor
            ] }),
            k.where && /* @__PURE__ */ f.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ f.jsx(Jl, { "aria-hidden": "true" }),
              k.where
            ] }),
            k.conflict && /* @__PURE__ */ f.jsxs("em", { children: [
              /* @__PURE__ */ f.jsx(Sc, { "aria-hidden": "true" }),
              a.labels.conflict
            ] })
          ] })
        ]
      },
      k.key
    )) : /* @__PURE__ */ f.jsxs("div", { className: "pp-empty-day", children: [
      /* @__PURE__ */ f.jsx(Ar, { "aria-hidden": "true" }),
      /* @__PURE__ */ f.jsx("p", { children: a.labels.emptyDay })
    ] }) })
  ] });
}
function Wc(a) {
  const c = lm(), [s, g] = X.useState(null), w = a.sessions.some((C) => C.day >= 5), x = a.showWeekend || w ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4], k = a.sessions.length > 0, S = X.useMemo(() => {
    if (!k) return { start: 480, end: 1080 };
    const C = Math.min(...a.sessions.map((U) => U.start)), B = Math.max(...a.sessions.map((U) => U.end));
    return a.showFullDay ? { start: 420, end: 1380 } : { start: Math.max(0, C - 60), end: Math.min(1440, B + 60) };
  }, [a.sessions, a.showFullDay, k]), L = 34, V = Math.max(1, Math.ceil((S.end - S.start) / 30)), G = V * L, H = /* @__PURE__ */ new Date(), D = (H.getDay() + 6) % 7, q = H.getHours() * 60 + H.getMinutes(), N = (q - S.start) / 30 * L;
  X.useEffect(() => {
    if (!s) return;
    const C = () => g(null);
    return window.addEventListener("pointerdown", C, { once: !0 }), window.addEventListener("blur", C, { once: !0 }), () => {
      window.removeEventListener("pointerdown", C), window.removeEventListener("blur", C);
    };
  }, [s]);
  const z = (C, B) => {
    C.preventDefault(), C.stopPropagation(), g({ session: B, x: Math.min(C.clientX, window.innerWidth - 232), y: Math.min(C.clientY, window.innerHeight - 230) });
  };
  return /* @__PURE__ */ f.jsxs("section", { className: "dersler-table-root program-planner-root", "aria-label": a.labels.title, children: [
    /* @__PURE__ */ f.jsxs("header", { className: "pp-heading", children: [
      /* @__PURE__ */ f.jsx("span", { className: "pp-heading-icon", children: /* @__PURE__ */ f.jsx(Ar, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ f.jsxs("span", { children: [
        /* @__PURE__ */ f.jsx("strong", { children: a.labels.title }),
        /* @__PURE__ */ f.jsxs("small", { children: [
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
    !k && !a.untimed.length ? /* @__PURE__ */ f.jsxs("div", { className: "pp-empty", children: [
      /* @__PURE__ */ f.jsx(sa, { "aria-hidden": "true" }),
      /* @__PURE__ */ f.jsx("strong", { children: a.labels.empty })
    ] }) : c && !a.forceGrid ? /* @__PURE__ */ f.jsx(om, { props: a, visibleDays: x }) : k ? /* @__PURE__ */ f.jsx("div", { className: "pp-calendar-scroll", children: /* @__PURE__ */ f.jsxs("div", { className: "pp-calendar", style: { "--pp-days": x.length }, children: [
      /* @__PURE__ */ f.jsxs("div", { className: "pp-calendar-head", children: [
        /* @__PURE__ */ f.jsx("span", {}),
        x.map((C) => /* @__PURE__ */ f.jsx("b", { children: a.dayLabels[C] }, C))
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "pp-calendar-body", children: [
        /* @__PURE__ */ f.jsx("div", { className: "pp-time-column", style: { height: G }, children: Array.from({ length: V }, (C, B) => /* @__PURE__ */ f.jsx("span", { children: kn(S.start + B * 30) }, B)) }),
        x.map((C) => {
          const B = Hc(a.sessions.filter((W) => W.day === C)), U = a.showNow && C === D && q >= S.start && q < S.end;
          return /* @__PURE__ */ f.jsxs("div", { className: `pp-day-column${C >= 5 ? " is-weekend" : ""}`, style: { height: G }, children: [
            U && /* @__PURE__ */ f.jsx("span", { className: "pp-now", style: { top: N } }),
            B.map((W) => {
              const ee = (W.start - S.start) / 30 * L, pe = Math.max(30, (W.end - W.start) / 30 * L), xe = 100 / W.laneCount, we = pe < 104;
              return /* @__PURE__ */ f.jsxs(
                "button",
                {
                  type: "button",
                  className: `pp-session${we ? " is-short" : ""}${W.conflict ? " is-conflict" : ""}`,
                  style: {
                    top: ee,
                    height: pe,
                    left: `calc(${W.lane * xe}% + 3px)`,
                    width: `calc(${xe}% - 6px)`,
                    "--pp-color": W.color,
                    "--pp-foreground": W.foreground
                  },
                  title: `${W.code} · ${W.name} · ${kn(W.start)}–${kn(W.end)} · CRN ${W.crn}`,
                  onClick: () => a.onOpen(W.rowKey),
                  onContextMenu: (je) => z(je, W),
                  children: [
                    /* @__PURE__ */ f.jsx(ff, { className: "pp-pin", "aria-hidden": "true" }),
                    /* @__PURE__ */ f.jsxs("strong", { children: [
                      W.code,
                      ": ",
                      /* @__PURE__ */ f.jsx("span", { children: W.name })
                    ] }),
                    /* @__PURE__ */ f.jsx(Bc, { session: W, compact: we }),
                    W.conflict && /* @__PURE__ */ f.jsxs("span", { className: "pp-conflict", children: [
                      /* @__PURE__ */ f.jsx(Sc, { "aria-hidden": "true" }),
                      a.labels.conflict
                    ] }),
                    /* @__PURE__ */ f.jsx(df, { className: "pp-more", "aria-hidden": "true" })
                  ]
                },
                W.key
              );
            })
          ] }, C);
        })
      ] })
    ] }) }) : null,
    !!a.untimed.length && /* @__PURE__ */ f.jsxs("div", { className: "pp-untimed", children: [
      /* @__PURE__ */ f.jsx(wc, { "aria-hidden": "true" }),
      /* @__PURE__ */ f.jsxs("div", { children: [
        /* @__PURE__ */ f.jsx("strong", { children: a.untimed.some((C) => C.special) ? a.labels.special : a.labels.unknown }),
        a.untimed.map((C) => /* @__PURE__ */ f.jsxs("span", { children: [
          /* @__PURE__ */ f.jsx("b", { children: C.code }),
          " · CRN ",
          C.crn,
          " — ",
          C.detail
        ] }, C.key))
      ] })
    ] }),
    s && /* @__PURE__ */ f.jsxs("div", { className: "pp-context", role: "menu", "aria-label": `${s.session.code} ${a.labels.actions}`, style: { left: s.x, top: s.y }, onPointerDown: (C) => C.stopPropagation(), children: [
      /* @__PURE__ */ f.jsxs("p", { children: [
        /* @__PURE__ */ f.jsx("strong", { children: s.session.code }),
        /* @__PURE__ */ f.jsxs("span", { children: [
          "CRN ",
          s.session.crn
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        a.onOpen(s.session.rowKey), g(null);
      }, children: [
        /* @__PURE__ */ f.jsx(Ar, {}),
        a.labels.details
      ] }),
      /* @__PURE__ */ f.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        a.onCopyCrn(s.session.rowKey), g(null);
      }, children: [
        /* @__PURE__ */ f.jsx(cf, {}),
        a.labels.copyCrn
      ] }),
      /* @__PURE__ */ f.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        a.onOpenObs(s.session.rowKey), g(null);
      }, children: [
        /* @__PURE__ */ f.jsx(pf, {}),
        a.labels.openObs
      ] }),
      /* @__PURE__ */ f.jsxs("button", { type: "button", role: "menuitem", className: "is-danger", onClick: () => {
        a.onRemove(s.session.rowKey), g(null);
      }, children: [
        /* @__PURE__ */ f.jsx(mf, {}),
        a.labels.remove
      ] })
    ] })
  ] });
}
function Qc({ html: a, empty: c, emptyMessage: s, ariaLabel: g }) {
  const w = X.useRef(null), x = X.useRef(null), k = X.useRef(null), [S, L] = X.useState(null);
  X.useLayoutEffect(() => {
    const N = w.current;
    if (!N) return;
    [...N.querySelectorAll("select.dp-grade")].forEach((C, B) => {
      var ee, pe;
      C.hidden = !0, C.tabIndex = -1;
      const U = document.createElement("button");
      U.type = "button", U.className = `cp-grade-trigger${C.value ? " filled" : ""}`, U.dataset.gradeIndex = String(B), U.setAttribute("aria-haspopup", "listbox"), U.setAttribute("aria-expanded", "false"), U.setAttribute("aria-label", C.getAttribute("aria-label") || "Not seç");
      const W = document.createElement("span");
      W.textContent = ((ee = C.selectedOptions[0]) == null ? void 0 : ee.textContent) || ((pe = C.options[0]) == null ? void 0 : pe.textContent) || "—", U.appendChild(W), U.insertAdjacentHTML("beforeend", '<svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'), C.insertAdjacentElement("afterend", U);
    });
  }, [a]), X.useEffect(() => L(null), [a]), X.useEffect(() => {
    if (!S) return;
    const N = (B) => {
      var W, ee;
      const U = B.target;
      (W = k.current) != null && W.contains(U) || (ee = x.current) != null && ee.contains(U) || L(null);
    }, z = () => L(null);
    window.addEventListener("pointerdown", N);
    const C = window.matchMedia("(min-width: 561px)").matches;
    return C && window.addEventListener("scroll", z, !0), window.addEventListener("resize", z), S.keyboard && requestAnimationFrame(() => {
      var B, U;
      return (U = (B = k.current) == null ? void 0 : B.querySelector('[aria-selected="true"]')) == null ? void 0 : U.focus({ preventScroll: !0 });
    }), () => {
      window.removeEventListener("pointerdown", N), C && window.removeEventListener("scroll", z, !0), window.removeEventListener("resize", z);
    };
  }, [S]);
  const V = (N, z = !1) => {
    var we, je;
    const C = Number(N.dataset.gradeIndex), B = (we = w.current) == null ? void 0 : we.querySelectorAll("select.dp-grade")[C];
    if (!B) return;
    const U = N.getBoundingClientRect(), W = 246, ee = window.innerHeight - U.bottom < W && U.top > W, pe = Math.min(292, window.innerWidth - 20), xe = Math.max(10, Math.min(U.right - pe, window.innerWidth - pe - 10));
    (je = x.current) == null || je.setAttribute("aria-expanded", "false"), x.current = N, N.setAttribute("aria-expanded", "true"), L({
      selectIndex: C,
      options: [...B.options].map((De) => ({ value: De.value, label: De.textContent || De.value })),
      value: B.value,
      label: B.getAttribute("aria-label") || "Not seç",
      x: xe,
      y: ee ? U.top - 7 : U.bottom + 7,
      above: ee,
      keyboard: z
    });
  }, G = (N) => {
    const z = N.target.closest(".cp-grade-trigger");
    if (z) {
      if (N.preventDefault(), z === x.current && S) {
        z.setAttribute("aria-expanded", "false"), L(null);
        return;
      }
      V(z);
    }
  }, H = (N) => {
    var C;
    if (N.key === "Escape" && S) {
      N.preventDefault(), (C = x.current) == null || C.setAttribute("aria-expanded", "false"), L(null);
      return;
    }
    const z = N.target.closest(".cp-grade-trigger");
    !z || !["Enter", " ", "ArrowDown", "ArrowUp"].includes(N.key) || (N.preventDefault(), V(z, !0));
  }, D = (N) => {
    var C, B, U;
    if (!S) return;
    const z = (C = w.current) == null ? void 0 : C.querySelectorAll("select.dp-grade")[S.selectIndex];
    z && (z.value = N, z.dispatchEvent(new Event("change", { bubbles: !0 })), (B = x.current) == null || B.setAttribute("aria-expanded", "false"), (U = x.current) == null || U.focus(), L(null));
  }, q = (N) => {
    var U, W, ee;
    if (N.key === "Escape") {
      N.preventDefault(), (U = x.current) == null || U.setAttribute("aria-expanded", "false"), (W = x.current) == null || W.focus(), L(null);
      return;
    }
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(N.key)) return;
    N.preventDefault();
    const z = [...N.currentTarget.querySelectorAll('[role="option"]')], C = Math.max(0, z.indexOf(document.activeElement)), B = N.key === "ArrowDown" || N.key === "ArrowRight" ? 1 : -1;
    (ee = z[(C + B + z.length) % z.length]) == null || ee.focus();
  };
  return c ? /* @__PURE__ */ f.jsxs("div", { className: "curriculum-plan-root cp-empty", role: "status", children: [
    /* @__PURE__ */ f.jsx(sa, { "aria-hidden": "true" }),
    /* @__PURE__ */ f.jsx("strong", { children: s })
  ] }) : /* @__PURE__ */ f.jsxs("section", { className: "curriculum-plan-root", "aria-label": g, onClick: G, onKeyDown: H, children: [
    /* @__PURE__ */ f.jsx("div", { ref: w, className: "cp-semester-grid", dangerouslySetInnerHTML: { __html: a } }),
    S && /* @__PURE__ */ f.jsx(
      "div",
      {
        ref: k,
        className: `cp-grade-menu${S.above ? " above" : ""}`,
        role: "listbox",
        "aria-label": S.label,
        style: { "--cp-menu-x": `${S.x}px`, "--cp-menu-y": `${S.y}px` },
        onKeyDown: q,
        children: S.options.map((N) => /* @__PURE__ */ f.jsxs(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": N.value === S.value,
            className: N.value ? "" : "is-empty",
            onClick: () => D(N.value),
            children: [
              /* @__PURE__ */ f.jsx("span", { children: N.label }),
              N.value === S.value && /* @__PURE__ */ f.jsx(uf, { "aria-hidden": "true" })
            ]
          },
          N.value || "empty"
        ))
      }
    )
  ] });
}
function im() {
  const a = "(max-width: 700px)", [c, s] = X.useState(() => window.matchMedia(a).matches);
  return X.useEffect(() => {
    const g = window.matchMedia(a), w = () => s(g.matches);
    return g.addEventListener("change", w), () => g.removeEventListener("change", w);
  }, []), c;
}
function am({ message: a }) {
  return /* @__PURE__ */ f.jsxs("div", { className: "ex-empty", children: [
    /* @__PURE__ */ f.jsx(sa, { "aria-hidden": "true" }),
    /* @__PURE__ */ f.jsx("strong", { children: a })
  ] });
}
function sm({ props: a }) {
  return /* @__PURE__ */ f.jsxs("div", { className: "ex-table", role: "table", "aria-label": a.ariaLabel, children: [
    /* @__PURE__ */ f.jsxs("div", { className: `ex-head${a.showPlace ? "" : " without-place"}`, role: "row", children: [
      /* @__PURE__ */ f.jsx("span", { role: "columnheader", children: a.labels.course }),
      /* @__PURE__ */ f.jsx("span", { role: "columnheader", children: a.labels.instructor }),
      /* @__PURE__ */ f.jsx("span", { role: "columnheader", children: a.labels.type }),
      a.showPlace && /* @__PURE__ */ f.jsx("span", { role: "columnheader", children: a.labels.place }),
      /* @__PURE__ */ f.jsxs("span", { role: "columnheader", children: [
        a.labels.date,
        " / ",
        a.labels.time
      ] })
    ] }),
    /* @__PURE__ */ f.jsx("div", { role: "rowgroup", children: a.rows.map((c) => /* @__PURE__ */ f.jsxs("div", { className: `ex-row${a.showPlace ? "" : " without-place"}`, role: "row", children: [
      /* @__PURE__ */ f.jsxs("div", { className: "ex-course", role: "cell", children: [
        /* @__PURE__ */ f.jsx("button", { type: "button", onClick: () => a.onOpen(c.code), children: c.code }),
        /* @__PURE__ */ f.jsx("strong", { children: c.name }),
        /* @__PURE__ */ f.jsxs("small", { children: [
          /* @__PURE__ */ f.jsx(kc, { "aria-hidden": "true" }),
          c.crn
        ] })
      ] }),
      /* @__PURE__ */ f.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ f.jsx(eo, { "aria-hidden": "true" }),
        c.instructor || "·"
      ] }),
      /* @__PURE__ */ f.jsx("span", { role: "cell", children: /* @__PURE__ */ f.jsx("em", { className: "ex-type", children: c.type }) }),
      a.showPlace && /* @__PURE__ */ f.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ f.jsx(Jl, { "aria-hidden": "true" }),
        c.place || "·"
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "ex-when", role: "cell", children: [
        /* @__PURE__ */ f.jsxs("strong", { children: [
          /* @__PURE__ */ f.jsx(Ar, { "aria-hidden": "true" }),
          c.date
        ] }),
        /* @__PURE__ */ f.jsxs("span", { children: [
          /* @__PURE__ */ f.jsx(aa, { "aria-hidden": "true" }),
          c.day,
          " ",
          c.time
        ] })
      ] })
    ] }, c.key)) })
  ] });
}
function um({ props: a }) {
  const c = X.useMemo(() => {
    const s = [], g = /* @__PURE__ */ new Map();
    return a.rows.forEach((w) => {
      let x = g.get(w.date);
      x || (x = { date: w.date, day: w.day, exams: [] }, g.set(w.date, x), s.push(x)), x.exams.push(w);
    }), s;
  }, [a.rows]);
  return /* @__PURE__ */ f.jsx("div", { className: "ex-agenda", "aria-label": a.ariaLabel, children: c.map((s) => /* @__PURE__ */ f.jsxs("section", { className: "ex-day", children: [
    /* @__PURE__ */ f.jsxs("header", { children: [
      /* @__PURE__ */ f.jsx(Ar, { "aria-hidden": "true" }),
      /* @__PURE__ */ f.jsx("strong", { children: s.date }),
      /* @__PURE__ */ f.jsx("span", { children: s.day })
    ] }),
    /* @__PURE__ */ f.jsx("div", { children: s.exams.map((g) => /* @__PURE__ */ f.jsxs("article", { className: "ex-card", children: [
      /* @__PURE__ */ f.jsxs("span", { className: "ex-card-time", children: [
        /* @__PURE__ */ f.jsx(aa, { "aria-hidden": "true" }),
        /* @__PURE__ */ f.jsx("b", { children: g.time })
      ] }),
      /* @__PURE__ */ f.jsxs("div", { className: "ex-card-main", children: [
        /* @__PURE__ */ f.jsx("button", { type: "button", onClick: () => a.onOpen(g.code), children: g.code }),
        /* @__PURE__ */ f.jsx("strong", { children: g.name }),
        /* @__PURE__ */ f.jsxs("span", { children: [
          /* @__PURE__ */ f.jsx(wc, { "aria-hidden": "true" }),
          g.type,
          /* @__PURE__ */ f.jsx("i", { "aria-hidden": "true" }),
          "CRN ",
          g.crn
        ] }),
        g.instructor && /* @__PURE__ */ f.jsxs("span", { children: [
          /* @__PURE__ */ f.jsx(eo, { "aria-hidden": "true" }),
          g.instructor
        ] }),
        a.showPlace && g.place && /* @__PURE__ */ f.jsxs("span", { children: [
          /* @__PURE__ */ f.jsx(Jl, { "aria-hidden": "true" }),
          g.place
        ] })
      ] })
    ] }, g.key)) })
  ] }, s.date)) });
}
function Kc(a) {
  const c = im();
  return /* @__PURE__ */ f.jsx("section", { className: "dersler-table-root exams-list-root", children: a.rows.length ? c ? /* @__PURE__ */ f.jsx(um, { props: a }) : /* @__PURE__ */ f.jsx(sm, { props: a }) : /* @__PURE__ */ f.jsx(am, { message: a.emptyMessage }) });
}
const cm = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--sans);font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--mono);font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.dersler-table-root .dt-relative{position:relative}.dersler-table-root .dt--ml-3{margin-left:-.75rem}.dersler-table-root .dt-ml-1\\.5{margin-left:.375rem}.dersler-table-root .dt-inline{display:inline}.dersler-table-root .dt-inline-flex{display:inline-flex}.dersler-table-root .dt-size-3\\.5{width:.875rem;height:.875rem}.dersler-table-root .dt-size-4{width:1rem;height:1rem}.dersler-table-root .dt-h-10{height:2.5rem}.dersler-table-root .dt-h-12{height:3rem}.dersler-table-root .dt-h-9{height:2.25rem}.dersler-table-root .dt-w-8{width:2rem}.dersler-table-root .dt-w-full{width:100%}.dersler-table-root .dt-caption-bottom{caption-side:bottom}.dersler-table-root .dt-cursor-pointer{cursor:pointer}.dersler-table-root .dt-items-center{align-items:center}.dersler-table-root .dt-justify-center{justify-content:center}.dersler-table-root .dt-overflow-auto{overflow:auto}.dersler-table-root .dt-overflow-hidden{overflow:hidden}.dersler-table-root .dt-whitespace-nowrap{white-space:nowrap}.dersler-table-root .dt-rounded-lg{border-radius:var(--radius-card)}.dersler-table-root .dt-rounded-md{border-radius:calc(var(--radius-card) - 2px)}.dersler-table-root .dt-border{border-width:1px}.dersler-table-root .dt-border-b{border-bottom-width:1px}.dersler-table-root .dt-border-border{border-color:var(--hairline)}.dersler-table-root .dt-bg-primary{background-color:var(--acid)}.dersler-table-root .dt-p-2{padding:.5rem}.dersler-table-root .dt-p-4{padding:1rem}.dersler-table-root .dt-p-6{padding:1.5rem}.dersler-table-root .dt-px-3{padding-left:.75rem;padding-right:.75rem}.dersler-table-root .dt-px-4{padding-left:1rem;padding-right:1rem}.dersler-table-root .dt-py-2{padding-top:.5rem;padding-bottom:.5rem}.dersler-table-root .dt-text-left{text-align:left}.dersler-table-root .dt-text-center{text-align:center}.dersler-table-root .dt-text-right{text-align:right}.dersler-table-root .dt-align-middle{vertical-align:middle}.dersler-table-root .dt-font-mono{font-family:var(--mono)}.dersler-table-root .dt-text-base{font-size:1rem;line-height:1.5rem}.dersler-table-root .dt-text-sm{font-size:.875rem;line-height:1.25rem}.dersler-table-root .dt-text-xs{font-size:.75rem;line-height:1rem}.dersler-table-root .dt-font-medium{font-weight:500}.dersler-table-root .dt-tabular-nums{--tw-numeric-spacing: tabular-nums;font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)}.dersler-table-root .dt-leading-none{line-height:1}.dersler-table-root .dt-text-muted-foreground{color:var(--dim)}.dersler-table-root .dt-text-primary-foreground{color:var(--on-accent)}.dersler-table-root .dt-opacity-40{opacity:.4}.dersler-table-root .dt-transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dersler-table-root{font-family:var(--sans);color:var(--fg)}.program-planner-root{--pp-slot: 34px;position:relative;min-width:0}.pp-heading{display:flex;align-items:center;gap:11px;margin:0 0 12px}.pp-heading-icon{display:grid;width:36px;height:36px;place-items:center;flex:0 0 auto;border:1px solid color-mix(in srgb,var(--acid) 34%,var(--line));border-radius:10px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.pp-heading-icon svg{width:18px;height:18px}.pp-heading>span:last-child{display:grid;gap:2px;min-width:0}.pp-heading strong{font-size:14px;letter-spacing:-.01em}.pp-heading small{color:var(--dimmer);font:10px/1.35 var(--mono)}.pp-loading{display:grid;min-height:260px;place-items:center;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2);font:11px/1.4 var(--mono)}.pp-calendar-scroll{max-height:min(69vh,780px);overflow:auto;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);scrollbar-width:thin}.pp-calendar{min-width:760px}.pp-calendar-head,.pp-calendar-body{display:grid;grid-template-columns:62px repeat(var(--pp-days),minmax(130px,1fr))}.pp-calendar-head{position:sticky;top:0;z-index:20;min-height:43px;border-bottom:1px solid var(--hairline-strong);background:var(--panel)}.pp-calendar-head>*{display:grid;place-items:center;border-right:1px solid var(--line)}.pp-calendar-head>span{position:sticky;left:0;z-index:22;background:var(--panel)}.pp-calendar-head b{color:var(--dim);font:700 10px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase}.pp-time-column{position:sticky;left:0;z-index:10;background:var(--panel);box-shadow:1px 0 0 var(--hairline-strong)}.pp-time-column span{display:block;height:var(--pp-slot);padding:5px 9px 0 0;color:var(--dimmer);text-align:right;font:9px/1 var(--mono);transform:translateY(-9px)}.pp-day-column{position:relative;min-width:0;border-right:1px solid var(--line);background-color:color-mix(in srgb,var(--panel) 97%,var(--fg));background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--pp-slot) - 1px),var(--line) calc(var(--pp-slot) - 1px),var(--line) var(--pp-slot))}.pp-day-column.is-weekend{background-color:var(--panel-2)}.pp-session{position:absolute;z-index:2;display:flex;flex-direction:column;gap:5px;overflow:hidden;padding:10px 25px 8px 10px;border:1px solid color-mix(in srgb,var(--pp-foreground) 25%,transparent);border-radius:8px;color:var(--pp-foreground);text-align:left;background:var(--pp-color);box-shadow:0 2px 6px color-mix(in srgb,var(--pp-color) 30%,transparent);cursor:pointer;transition:filter .14s ease,box-shadow .14s ease,transform .14s ease}.pp-session:hover,.pp-session:focus-visible{z-index:6;filter:saturate(1.08) brightness(1.04);box-shadow:0 7px 18px color-mix(in srgb,var(--pp-color) 42%,transparent);transform:translateY(-1px)}.pp-session:focus-visible{outline:3px solid var(--acid);outline-offset:2px}.pp-session.is-conflict{border:2px solid var(--red)}.pp-session.is-short{justify-content:center;padding-block:5px}.pp-session.is-short .pp-session-meta{display:none}.pp-session>strong{display:-webkit-box;overflow:hidden;color:inherit;font:800 11px/1.26 var(--sans);-webkit-box-orient:vertical;-webkit-line-clamp:3}.pp-session>strong span{font-weight:650}.pp-pin,.pp-more{position:absolute;right:7px;width:14px;height:14px;opacity:.75}.pp-pin{top:8px}.pp-more{bottom:7px}.pp-session-meta{display:grid;gap:3px;min-width:0}.pp-session-meta>span,.pp-agenda-detail{display:flex;align-items:center;gap:5px;min-width:0;overflow:hidden;color:inherit;font:9px/1.2 var(--mono);text-overflow:ellipsis;white-space:nowrap}.pp-session-meta svg,.pp-agenda-detail svg{width:11px;height:11px;flex:0 0 auto}.pp-conflict{display:flex;align-items:center;gap:4px;margin-top:auto;font:800 9px/1 var(--mono)}.pp-conflict svg{width:11px;height:11px}.pp-now{position:absolute;z-index:7;right:0;left:0;height:2px;background:var(--acid);pointer-events:none}.pp-now:before{position:absolute;top:-3px;left:-1px;width:8px;height:8px;border-radius:50%;background:var(--acid);content:""}.pp-empty,.pp-empty-day{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2)}.pp-empty svg,.pp-empty-day svg{width:25px;height:25px}.pp-empty strong,.pp-empty-day p{margin:0;font-size:12px}.pp-untimed{display:flex;gap:10px;margin-top:12px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-untimed>svg{width:18px;height:18px;flex:0 0 auto;color:var(--amber)}.pp-untimed>div{display:grid;gap:5px}.pp-untimed strong{font-size:11px}.pp-untimed span{color:var(--dim);font:10px/1.4 var(--mono)}.pp-context{position:fixed;z-index:10010;display:grid;width:224px;overflow:hidden;padding:6px;border:1px solid var(--hairline-strong);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pp-context p{display:grid;gap:2px;margin:0 0 4px;padding:8px 9px;border-bottom:1px solid var(--line)}.pp-context p strong{font-size:12px}.pp-context p span{color:var(--dimmer);font:9px/1 var(--mono)}.pp-context button{display:flex;align-items:center;gap:9px;width:100%;padding:8px 9px;border:0;border-radius:6px;color:var(--fg);text-align:left;background:transparent;font:11px/1.2 var(--sans)}.pp-context button:hover,.pp-context button:focus-visible{background:var(--panel-2)}.pp-context button.is-danger{color:var(--red)}.pp-context button svg{width:14px;height:14px}.pp-agenda{min-width:0}.pp-day-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:12px;padding:4px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-day-tabs button{position:relative;min-width:0;min-height:38px;border:0;border-radius:7px;color:var(--dim);background:transparent;font:700 10px/1 var(--mono)}.pp-day-tabs button.is-active{color:var(--panel);background:var(--fg)}.pp-day-tabs button>span{position:absolute;bottom:5px;left:50%;width:3px;height:3px;border-radius:50%;background:var(--acid)}.pp-agenda-list{display:grid;gap:8px}.pp-agenda-card{--pp-color: var(--cyan);display:grid;grid-template-columns:54px minmax(0,1fr);gap:12px;width:100%;padding:13px;border:1px solid var(--line);border-radius:11px;color:var(--fg);text-align:left;background:var(--panel);box-shadow:inset 4px 0 0 var(--pp-color)}.pp-agenda-card.is-conflict{border-color:var(--red)}.pp-agenda-time{display:grid;align-content:start;gap:3px;font:11px/1 var(--mono)}.pp-agenda-time small{color:var(--dimmer);font-size:9px}.pp-agenda-copy{display:grid;gap:5px;min-width:0}.pp-agenda-copy>strong{display:flex;align-items:center;gap:7px;font-size:13px}.pp-color-dot{width:7px;height:7px;border-radius:50%;background:var(--pp-color)}.pp-agenda-name{color:var(--dim);font-size:12px}.pp-agenda-copy em{display:flex;align-items:center;gap:5px;color:var(--red);font:700 10px/1 var(--mono)}.pp-agenda-copy em svg{width:12px;height:12px}.pp-empty-day{min-height:150px}.curriculum-plan-root{min-width:0;color:var(--fg);font-family:var(--sans)}.dp-semesters.dp-react{display:block}.cp-semester-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;align-items:start}.curriculum-plan-root .dp-sem{min-width:0;overflow:hidden;padding:0;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card)}.curriculum-plan-root .dp-sem-head{position:relative;min-height:58px;margin:0;padding:13px 43px 12px 15px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);cursor:pointer}.curriculum-plan-root .dp-sem-head>span:first-child{font-size:15px;font-weight:750;letter-spacing:-.015em}.curriculum-plan-root .dp-sem-head:after{position:absolute;top:50%;right:17px;width:8px;height:8px;margin:-6px 0 0;border-right:1.5px solid var(--dim);border-bottom:1.5px solid var(--dim);content:"";transform:rotate(45deg);transition:transform .16s ease}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head{margin:0;padding:13px 43px 12px 15px;border:0}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head:after{margin-top:-2px;transform:rotate(-45deg)}.curriculum-plan-root .dp-load{color:var(--dim);font:10px/1.25 var(--mono)}.curriculum-plan-root .dp-sem-avg{margin-left:auto;color:var(--acid);font:700 10px/1.25 var(--mono);white-space:nowrap}.curriculum-plan-root .dp-colhead{min-height:31px;margin:0 14px;padding:6px 0;border-bottom:1px solid var(--line);font-size:9px;letter-spacing:.06em}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin:0 14px;padding:0;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent}.curriculum-plan-root .dp-course:last-child,.curriculum-plan-root .dp-elective:last-child{border-bottom:0}.curriculum-plan-root .dp-row{min-height:52px;padding:8px 0}.curriculum-plan-root .dp-credit{min-width:29px;height:24px;padding:0 5px;border-color:color-mix(in srgb,var(--acid) 28%,var(--line));border-radius:7px;color:var(--acid);background:color-mix(in srgb,var(--acid) 7%,var(--panel));font-size:10px}.curriculum-plan-root .dp-title{display:grid;gap:2px}.curriculum-plan-root .dp-code{width:-moz-fit-content;width:fit-content;color:var(--cyan);font:750 12px/1.25 var(--mono)}.curriculum-plan-root .dp-name{overflow:hidden;color:var(--dim);font-size:11px;line-height:1.3;text-overflow:ellipsis}.curriculum-plan-root .dp-repeat-btn{color:var(--dimmer)}.curriculum-plan-root .dp-repeat-btn svg{display:block}.curriculum-plan-root .dp-repeat-btn.on{color:var(--amber);background:color-mix(in srgb,var(--amber) 8%,transparent)}.curriculum-plan-root .dp-grade-wrap{border-radius:7px}.curriculum-plan-root .dp-grade{border-radius:5px;font-family:var(--mono)}.curriculum-plan-root .cp-grade-trigger{position:relative;display:inline-flex;align-items:center;justify-content:space-between;gap:7px;min-width:65px;min-height:31px;padding:5px 8px;border:1px solid var(--line);border-radius:7px;color:var(--dim);background:var(--panel);font:700 10px/1 var(--mono);cursor:pointer;transition:border-color .14s ease,background-color .14s ease,color .14s ease}.curriculum-plan-root .cp-grade-trigger:hover,.curriculum-plan-root .cp-grade-trigger[aria-expanded=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel))}.curriculum-plan-root .cp-grade-trigger.filled{border-color:color-mix(in srgb,var(--acid) 58%,var(--line));color:var(--fg)}.curriculum-plan-root .cp-grade-trigger svg{width:13px;height:13px;flex:0 0 auto;transition:transform .14s ease}.curriculum-plan-root .cp-grade-trigger[aria-expanded=true] svg{transform:rotate(180deg)}.cp-grade-menu{position:fixed;z-index:10020;top:var(--cp-menu-y);left:var(--cp-menu-x);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;width:292px;max-width:calc(100vw - 20px);padding:8px;border:1px solid var(--hairline-strong);border-radius:11px;background:var(--panel);box-shadow:var(--shadow-float)}.cp-grade-menu.above{transform:translateY(-100%)}.cp-grade-menu button{position:relative;display:flex;align-items:center;justify-content:center;min-width:0;min-height:34px;padding:6px;border:1px solid transparent;border-radius:7px;color:var(--dim);background:var(--panel-2);font:700 10px/1 var(--mono);cursor:pointer}.cp-grade-menu button:hover,.cp-grade-menu button:focus-visible{border-color:var(--cyan);color:var(--fg);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.cp-grade-menu button[aria-selected=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 12%,var(--panel))}.cp-grade-menu button.is-empty{grid-column:1 / -1;justify-content:flex-start;padding-inline:10px}.cp-grade-menu button svg{position:absolute;top:50%;right:6px;width:12px;height:12px;color:var(--acid);transform:translateY(-50%)}.curriculum-plan-root .dp-grade-clear svg{display:block}.curriculum-plan-root .dp-sec-btn.open{padding:5px 8px;border:1px solid color-mix(in srgb,var(--cyan) 28%,var(--line));border-radius:7px;background:color-mix(in srgb,var(--cyan) 6%,var(--panel));font:650 10px/1 var(--sans);text-decoration:none}.curriculum-plan-root .dp-sec-btn.open:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-sec-btn.closed{font-size:10px}.curriculum-plan-root .dp-secslot{margin:0;padding:10px 0 12px;border-top:1px dashed var(--line)}.curriculum-plan-root .dp-section{min-height:31px}.curriculum-plan-root .dp-actions button{min-height:28px;padding:3px 7px;border:1px solid var(--line);border-radius:6px}.curriculum-plan-root .dp-actions button:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-elective{background:color-mix(in srgb,var(--acid) 3%,transparent)}.curriculum-plan-root .dp-elective-name{color:var(--dim);font-size:11px}.curriculum-plan-root .dp-epick{min-height:31px;border-radius:7px;background:var(--panel)}.cp-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.cp-empty svg{width:24px;height:24px}.cp-empty strong{font-size:12px}.exams-list-root{min-width:0;color:var(--fg);font-family:var(--sans)}.ex-table{overflow:hidden;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-head,.ex-row{display:grid;grid-template-columns:minmax(230px,1.45fr) minmax(145px,.9fr) minmax(105px,.62fr) minmax(170px,1fr) minmax(190px,1.05fr);align-items:center;gap:14px}.ex-head{min-height:36px;padding:8px 15px;color:var(--dimmer);border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);font:750 9px/1 var(--mono);letter-spacing:.055em;text-transform:uppercase}.ex-row{min-height:72px;padding:11px 15px;border-bottom:1px solid var(--line);transition:background-color .14s ease}.ex-row:last-child{border-bottom:0}.ex-row:hover{background:color-mix(in srgb,var(--cyan) 3%,var(--panel))}.ex-row.without-place{grid-template-columns:minmax(230px,1.5fr) minmax(155px,1fr) minmax(115px,.7fr) minmax(200px,1fr)}.ex-course{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:baseline;gap:3px 9px;min-width:0}.ex-course button,.ex-card-main button{width:-moz-fit-content;width:fit-content;padding:0;border:0;color:var(--cyan);background:transparent;font:800 12px/1.25 var(--mono);cursor:pointer}.ex-course button:hover,.ex-course button:focus-visible,.ex-card-main button:hover,.ex-card-main button:focus-visible{text-decoration:underline;text-underline-offset:3px}.ex-course strong{overflow:hidden;font-size:12px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.ex-course small{display:flex;grid-column:1 / -1;align-items:center;gap:4px;color:var(--dimmer);font:9px/1.2 var(--mono)}.ex-course small svg{width:10px;height:10px}.ex-meta{display:flex;align-items:flex-start;gap:6px;min-width:0;color:var(--dim);font-size:11px;line-height:1.35}.ex-meta svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-type{display:inline-flex;padding:5px 7px;border:1px solid color-mix(in srgb,var(--acid) 24%,var(--line));border-radius:6px;color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel));font:650 10px/1.15 var(--sans);font-style:normal}.ex-when{display:grid;gap:5px}.ex-when strong,.ex-when span{display:flex;align-items:center;gap:6px}.ex-when strong{font-size:11px}.ex-when span{color:var(--dim);font:10px/1.2 var(--mono)}.ex-when svg{width:13px;height:13px;color:var(--dimmer)}.ex-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.ex-empty svg{width:25px;height:25px}.ex-empty strong{font-size:12px}.ex-agenda{display:grid;gap:15px}.ex-day{overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-day>header{display:flex;align-items:center;gap:8px;min-height:42px;padding:9px 12px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2)}.ex-day>header svg{width:15px;height:15px;color:var(--acid)}.ex-day>header strong{font:750 11px/1 var(--mono)}.ex-day>header span{margin-left:auto;color:var(--dim);font-size:11px}.ex-card{display:grid;grid-template-columns:74px minmax(0,1fr);gap:12px;padding:13px 12px;border-bottom:1px solid var(--line)}.ex-card:last-child{border-bottom:0}.ex-card-time{display:flex;align-items:flex-start;gap:5px;color:var(--fg);font:700 10px/1.35 var(--mono)}.ex-card-time svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main{display:grid;gap:5px;min-width:0}.ex-card-main>strong{font-size:12px;line-height:1.3}.ex-card-main>span{display:flex;align-items:center;gap:6px;min-width:0;color:var(--dim);font-size:10px;line-height:1.35}.ex-card-main>span svg{width:12px;height:12px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main>span i{width:3px;height:3px;margin-inline:2px;border-radius:50%;background:var(--dimmer)}@media(max-width:900px){.cp-semester-grid{grid-template-columns:1fr}.ex-head,.ex-row{grid-template-columns:minmax(210px,1.45fr) minmax(135px,.85fr) minmax(95px,.62fr) minmax(175px,1fr)}.ex-head>:nth-child(4):not(:last-child),.ex-row>:nth-child(4):not(:last-child){display:none}}@media(max-width:560px){.curriculum-plan-root .dp-sem-head{flex-wrap:nowrap;gap:7px;min-height:48px;padding-block:10px}.curriculum-plan-root .dp-sem-head>span:first-child{width:auto;flex:0 0 auto;font-size:13px}.curriculum-plan-root .dp-load{overflow:hidden;flex:1 1 auto;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-sem-avg{margin-left:auto;font-size:9px}.curriculum-plan-root .dp-colhead{display:none}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin-inline:10px}.curriculum-plan-root .dp-row,.curriculum-plan-root .dp-elective .dp-row{grid-template-columns:34px minmax(0,1fr) auto;gap:4px 8px;min-height:60px;padding:7px 0}.curriculum-plan-root .dp-credit{grid-column:1;grid-row:1 / 3;align-self:center}.curriculum-plan-root .dp-title{display:flex;grid-column:2;grid-row:1;align-items:baseline;gap:6px;overflow:hidden;white-space:nowrap}.curriculum-plan-root .dp-code{flex:0 0 auto;font-size:11px;min-height:28px}.curriculum-plan-root .dp-name{min-width:0;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-repeat-btn,.curriculum-plan-root .dp-repeat-cell{grid-column:3;grid-row:1}.curriculum-plan-root .dp-grade-wrap,.curriculum-plan-root .dp-elective-inputs{grid-column:2;grid-row:2;justify-self:start}.curriculum-plan-root .dp-sec-btn{grid-column:3;grid-row:1 / 3;align-self:center}.curriculum-plan-root .cp-grade-trigger{min-height:34px;padding:5px 7px}.curriculum-plan-root .cp-grade-trigger:after{position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;content:""}.curriculum-plan-root .dp-grade-clear{min-height:32px}.cp-grade-menu,.cp-grade-menu.above{top:auto;right:10px;bottom:max(10px,env(safe-area-inset-bottom));left:10px;grid-template-columns:repeat(5,minmax(0,1fr));width:auto;max-width:none;gap:4px;padding:7px;transform:none}.cp-grade-menu button{min-height:42px;padding:5px 3px;font-size:9px}.cp-grade-menu button.is-empty{min-height:38px}.cp-grade-menu button svg{right:5px;width:11px;height:11px}}@media(max-width:600px){.pp-heading{margin-bottom:10px}.pp-heading-icon{width:32px;height:32px}.pp-day-tabs{overflow-x:auto;grid-template-columns:repeat(var(--pp-days, 5),minmax(48px,1fr))}}@media(prefers-reduced-motion:reduce){.pp-session{transition:none}}@media print{.program-planner-root .pp-calendar-scroll{max-height:none;overflow:visible;box-shadow:none}.program-planner-root .pp-calendar{min-width:0}.program-planner-root .pp-context{display:none}}.dersler-table-root .hover\\:dt-bg-accent:hover{background-color:var(--panel-2)}.dersler-table-root .hover\\:dt-text-accent-foreground:hover{color:var(--acid)}.dersler-table-root .focus-visible\\:dt-outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.dersler-table-root .focus-visible\\:dt-ring-2:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.dersler-table-root .focus-visible\\:dt-ring-ring:focus-visible{--tw-ring-color: var(--cyan)}.dersler-table-root .focus-visible\\:dt-ring-offset-2:focus-visible{--tw-ring-offset-width: 2px}.dersler-table-root .disabled\\:dt-pointer-events-none:disabled{pointer-events:none}.dersler-table-root .disabled\\:dt-opacity-50:disabled{opacity:.5}.dersler-table-root .data-\\[state\\=selected\\]\\:dt-bg-muted[data-state=selected]{background-color:var(--panel-2)}.dersler-table-root .\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:dt-pr-0:has([role=checkbox]){padding-right:0}.dersler-table-root :is(.\\[\\&_tr\\:last-child\\]\\:dt-border-0 tr:last-child){border-width:0px}.dersler-table-root :is(.\\[\\&_tr\\]\\:dt-border-b tr){border-bottom-width:1px}';
let an = null, It = null, Dt = null, At = null, Zl = null;
function to() {
  Zl || (Zl = document.createElement("style"), Zl.textContent = cm, document.head.appendChild(Zl));
}
function dm(a, c) {
  to(), an = ql.createRoot(a), an.render(
    /* @__PURE__ */ f.jsx(X.StrictMode, { children: /* @__PURE__ */ f.jsx($c, { ...c }) })
  );
}
function pm(a) {
  an && an.render(
    /* @__PURE__ */ f.jsx(X.StrictMode, { children: /* @__PURE__ */ f.jsx($c, { ...a }) })
  );
}
function fm() {
  an == null || an.unmount(), an = null;
}
function mm(a, c) {
  to(), It = ql.createRoot(a), It.render(/* @__PURE__ */ f.jsx(Wc, { ...c }));
}
function hm(a) {
  It == null || It.render(/* @__PURE__ */ f.jsx(Wc, { ...a }));
}
function gm() {
  It == null || It.unmount(), It = null;
}
function vm(a, c) {
  to(), Dt = ql.createRoot(a), Dt.render(/* @__PURE__ */ f.jsx(Qc, { ...c }));
}
function ym(a) {
  Dt == null || Dt.render(/* @__PURE__ */ f.jsx(Qc, { ...a }));
}
function xm() {
  Dt == null || Dt.unmount(), Dt = null;
}
function wm(a, c) {
  to(), At = ql.createRoot(a), At.render(/* @__PURE__ */ f.jsx(Kc, { ...c }));
}
function km(a) {
  At == null || At.render(/* @__PURE__ */ f.jsx(Kc, { ...a }));
}
function Sm() {
  At == null || At.unmount(), At = null;
}
export {
  dm as mount,
  vm as mountCurriculum,
  wm as mountExams,
  mm as mountProgram,
  fm as unmount,
  xm as unmountCurriculum,
  Sm as unmountExams,
  gm as unmountProgram,
  pm as update,
  ym as updateCurriculum,
  km as updateExams,
  hm as updateProgram
};
