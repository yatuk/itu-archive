function nf(i, c) {
  for (var u = 0; u < c.length; u++) {
    const m = c[u];
    if (typeof m != "string" && !Array.isArray(m)) {
      for (const w in m)
        if (w !== "default" && !(w in i)) {
          const v = Object.getOwnPropertyDescriptor(m, w);
          v && Object.defineProperty(i, w, v.get ? v : {
            enumerable: !0,
            get: () => m[w]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }));
}
function lf(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var ra = { exports: {} }, Un = {}, na = { exports: {} }, re = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gc;
function of() {
  if (gc) return re;
  gc = 1;
  var i = Symbol.for("react.element"), c = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), m = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), v = Symbol.for("react.provider"), g = Symbol.for("react.context"), b = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), _ = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), V = Symbol.iterator;
  function E(h) {
    return h === null || typeof h != "object" ? null : (h = V && h[V] || h["@@iterator"], typeof h == "function" ? h : null);
  }
  var Y = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, j = Object.assign, P = {};
  function R(h, N, te) {
    this.props = h, this.context = N, this.refs = P, this.updater = te || Y;
  }
  R.prototype.isReactComponent = {}, R.prototype.setState = function(h, N) {
    if (typeof h != "object" && typeof h != "function" && h != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, h, N, "setState");
  }, R.prototype.forceUpdate = function(h) {
    this.updater.enqueueForceUpdate(this, h, "forceUpdate");
  };
  function X() {
  }
  X.prototype = R.prototype;
  function W(h, N, te) {
    this.props = h, this.context = N, this.refs = P, this.updater = te || Y;
  }
  var A = W.prototype = new X();
  A.constructor = W, j(A, R.prototype), A.isPureReactComponent = !0;
  var K = Array.isArray, ne = Object.prototype.hasOwnProperty, Z = { current: null }, fe = { key: !0, ref: !0, __self: !0, __source: !0 };
  function we(h, N, te) {
    var le, se = {}, ue = null, me = null;
    if (N != null) for (le in N.ref !== void 0 && (me = N.ref), N.key !== void 0 && (ue = "" + N.key), N) ne.call(N, le) && !fe.hasOwnProperty(le) && (se[le] = N[le]);
    var de = arguments.length - 2;
    if (de === 1) se.children = te;
    else if (1 < de) {
      for (var ke = Array(de), tt = 0; tt < de; tt++) ke[tt] = arguments[tt + 2];
      se.children = ke;
    }
    if (h && h.defaultProps) for (le in de = h.defaultProps, de) se[le] === void 0 && (se[le] = de[le]);
    return { $$typeof: i, type: h, key: ue, ref: me, props: se, _owner: Z.current };
  }
  function _e(h, N) {
    return { $$typeof: i, type: h.type, key: N, ref: h.ref, props: h.props, _owner: h._owner };
  }
  function Fe(h) {
    return typeof h == "object" && h !== null && h.$$typeof === i;
  }
  function Oe(h) {
    var N = { "=": "=0", ":": "=2" };
    return "$" + h.replace(/[=:]/g, function(te) {
      return N[te];
    });
  }
  var oe = /\/+/g;
  function $e(h, N) {
    return typeof h == "object" && h !== null && h.key != null ? Oe("" + h.key) : N.toString(36);
  }
  function Ue(h, N, te, le, se) {
    var ue = typeof h;
    (ue === "undefined" || ue === "boolean") && (h = null);
    var me = !1;
    if (h === null) me = !0;
    else switch (ue) {
      case "string":
      case "number":
        me = !0;
        break;
      case "object":
        switch (h.$$typeof) {
          case i:
          case c:
            me = !0;
        }
    }
    if (me) return me = h, se = se(me), h = le === "" ? "." + $e(me, 0) : le, K(se) ? (te = "", h != null && (te = h.replace(oe, "$&/") + "/"), Ue(se, N, te, "", function(tt) {
      return tt;
    })) : se != null && (Fe(se) && (se = _e(se, te + (!se.key || me && me.key === se.key ? "" : ("" + se.key).replace(oe, "$&/") + "/") + h)), N.push(se)), 1;
    if (me = 0, le = le === "" ? "." : le + ":", K(h)) for (var de = 0; de < h.length; de++) {
      ue = h[de];
      var ke = le + $e(ue, de);
      me += Ue(ue, N, te, ke, se);
    }
    else if (ke = E(h), typeof ke == "function") for (h = ke.call(h), de = 0; !(ue = h.next()).done; ) ue = ue.value, ke = le + $e(ue, de++), me += Ue(ue, N, te, ke, se);
    else if (ue === "object") throw N = String(h), Error("Objects are not valid as a React child (found: " + (N === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : N) + "). If you meant to render a collection of children, use an array instead.");
    return me;
  }
  function et(h, N, te) {
    if (h == null) return h;
    var le = [], se = 0;
    return Ue(h, le, "", "", function(ue) {
      return N.call(te, ue, se++);
    }), le;
  }
  function Me(h) {
    if (h._status === -1) {
      var N = h._result;
      N = N(), N.then(function(te) {
        (h._status === 0 || h._status === -1) && (h._status = 1, h._result = te);
      }, function(te) {
        (h._status === 0 || h._status === -1) && (h._status = 2, h._result = te);
      }), h._status === -1 && (h._status = 0, h._result = N);
    }
    if (h._status === 1) return h._result.default;
    throw h._result;
  }
  var ge = { current: null }, I = { transition: null }, B = { ReactCurrentDispatcher: ge, ReactCurrentBatchConfig: I, ReactCurrentOwner: Z };
  function D() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return re.Children = { map: et, forEach: function(h, N, te) {
    et(h, function() {
      N.apply(this, arguments);
    }, te);
  }, count: function(h) {
    var N = 0;
    return et(h, function() {
      N++;
    }), N;
  }, toArray: function(h) {
    return et(h, function(N) {
      return N;
    }) || [];
  }, only: function(h) {
    if (!Fe(h)) throw Error("React.Children.only expected to receive a single React element child.");
    return h;
  } }, re.Component = R, re.Fragment = u, re.Profiler = w, re.PureComponent = W, re.StrictMode = m, re.Suspense = C, re.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = B, re.act = D, re.cloneElement = function(h, N, te) {
    if (h == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
    var le = j({}, h.props), se = h.key, ue = h.ref, me = h._owner;
    if (N != null) {
      if (N.ref !== void 0 && (ue = N.ref, me = Z.current), N.key !== void 0 && (se = "" + N.key), h.type && h.type.defaultProps) var de = h.type.defaultProps;
      for (ke in N) ne.call(N, ke) && !fe.hasOwnProperty(ke) && (le[ke] = N[ke] === void 0 && de !== void 0 ? de[ke] : N[ke]);
    }
    var ke = arguments.length - 2;
    if (ke === 1) le.children = te;
    else if (1 < ke) {
      de = Array(ke);
      for (var tt = 0; tt < ke; tt++) de[tt] = arguments[tt + 2];
      le.children = de;
    }
    return { $$typeof: i, type: h.type, key: se, ref: ue, props: le, _owner: me };
  }, re.createContext = function(h) {
    return h = { $$typeof: g, _currentValue: h, _currentValue2: h, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, h.Provider = { $$typeof: v, _context: h }, h.Consumer = h;
  }, re.createElement = we, re.createFactory = function(h) {
    var N = we.bind(null, h);
    return N.type = h, N;
  }, re.createRef = function() {
    return { current: null };
  }, re.forwardRef = function(h) {
    return { $$typeof: b, render: h };
  }, re.isValidElement = Fe, re.lazy = function(h) {
    return { $$typeof: T, _payload: { _status: -1, _result: h }, _init: Me };
  }, re.memo = function(h, N) {
    return { $$typeof: _, type: h, compare: N === void 0 ? null : N };
  }, re.startTransition = function(h) {
    var N = I.transition;
    I.transition = {};
    try {
      h();
    } finally {
      I.transition = N;
    }
  }, re.unstable_act = D, re.useCallback = function(h, N) {
    return ge.current.useCallback(h, N);
  }, re.useContext = function(h) {
    return ge.current.useContext(h);
  }, re.useDebugValue = function() {
  }, re.useDeferredValue = function(h) {
    return ge.current.useDeferredValue(h);
  }, re.useEffect = function(h, N) {
    return ge.current.useEffect(h, N);
  }, re.useId = function() {
    return ge.current.useId();
  }, re.useImperativeHandle = function(h, N, te) {
    return ge.current.useImperativeHandle(h, N, te);
  }, re.useInsertionEffect = function(h, N) {
    return ge.current.useInsertionEffect(h, N);
  }, re.useLayoutEffect = function(h, N) {
    return ge.current.useLayoutEffect(h, N);
  }, re.useMemo = function(h, N) {
    return ge.current.useMemo(h, N);
  }, re.useReducer = function(h, N, te) {
    return ge.current.useReducer(h, N, te);
  }, re.useRef = function(h) {
    return ge.current.useRef(h);
  }, re.useState = function(h) {
    return ge.current.useState(h);
  }, re.useSyncExternalStore = function(h, N, te) {
    return ge.current.useSyncExternalStore(h, N, te);
  }, re.useTransition = function() {
    return ge.current.useTransition();
  }, re.version = "18.3.1", re;
}
var xc;
function ga() {
  return xc || (xc = 1, na.exports = of()), na.exports;
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
var vc;
function af() {
  if (vc) return Un;
  vc = 1;
  var i = ga(), c = Symbol.for("react.element"), u = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, w = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, v = { key: !0, ref: !0, __self: !0, __source: !0 };
  function g(b, C, _) {
    var T, V = {}, E = null, Y = null;
    _ !== void 0 && (E = "" + _), C.key !== void 0 && (E = "" + C.key), C.ref !== void 0 && (Y = C.ref);
    for (T in C) m.call(C, T) && !v.hasOwnProperty(T) && (V[T] = C[T]);
    if (b && b.defaultProps) for (T in C = b.defaultProps, C) V[T] === void 0 && (V[T] = C[T]);
    return { $$typeof: c, type: b, key: E, ref: Y, props: V, _owner: w.current };
  }
  return Un.Fragment = u, Un.jsx = g, Un.jsxs = g, Un;
}
var yc;
function sf() {
  return yc || (yc = 1, ra.exports = af()), ra.exports;
}
var a = sf(), Q = ga();
const uf = /* @__PURE__ */ lf(Q), cf = /* @__PURE__ */ nf({
  __proto__: null,
  default: uf
}, [Q]);
var lo = {}, la = { exports: {} }, Je = {}, oa = { exports: {} }, ia = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var wc;
function df() {
  return wc || (wc = 1, (function(i) {
    function c(I, B) {
      var D = I.length;
      I.push(B);
      e: for (; 0 < D; ) {
        var h = D - 1 >>> 1, N = I[h];
        if (0 < w(N, B)) I[h] = B, I[D] = N, D = h;
        else break e;
      }
    }
    function u(I) {
      return I.length === 0 ? null : I[0];
    }
    function m(I) {
      if (I.length === 0) return null;
      var B = I[0], D = I.pop();
      if (D !== B) {
        I[0] = D;
        e: for (var h = 0, N = I.length, te = N >>> 1; h < te; ) {
          var le = 2 * (h + 1) - 1, se = I[le], ue = le + 1, me = I[ue];
          if (0 > w(se, D)) ue < N && 0 > w(me, se) ? (I[h] = me, I[ue] = D, h = ue) : (I[h] = se, I[le] = D, h = le);
          else if (ue < N && 0 > w(me, D)) I[h] = me, I[ue] = D, h = ue;
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
    var C = [], _ = [], T = 1, V = null, E = 3, Y = !1, j = !1, P = !1, R = typeof setTimeout == "function" ? setTimeout : null, X = typeof clearTimeout == "function" ? clearTimeout : null, W = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function A(I) {
      for (var B = u(_); B !== null; ) {
        if (B.callback === null) m(_);
        else if (B.startTime <= I) m(_), B.sortIndex = B.expirationTime, c(C, B);
        else break;
        B = u(_);
      }
    }
    function K(I) {
      if (P = !1, A(I), !j) if (u(C) !== null) j = !0, Me(ne);
      else {
        var B = u(_);
        B !== null && ge(K, B.startTime - I);
      }
    }
    function ne(I, B) {
      j = !1, P && (P = !1, X(we), we = -1), Y = !0;
      var D = E;
      try {
        for (A(B), V = u(C); V !== null && (!(V.expirationTime > B) || I && !Oe()); ) {
          var h = V.callback;
          if (typeof h == "function") {
            V.callback = null, E = V.priorityLevel;
            var N = h(V.expirationTime <= B);
            B = i.unstable_now(), typeof N == "function" ? V.callback = N : V === u(C) && m(C), A(B);
          } else m(C);
          V = u(C);
        }
        if (V !== null) var te = !0;
        else {
          var le = u(_);
          le !== null && ge(K, le.startTime - B), te = !1;
        }
        return te;
      } finally {
        V = null, E = D, Y = !1;
      }
    }
    var Z = !1, fe = null, we = -1, _e = 5, Fe = -1;
    function Oe() {
      return !(i.unstable_now() - Fe < _e);
    }
    function oe() {
      if (fe !== null) {
        var I = i.unstable_now();
        Fe = I;
        var B = !0;
        try {
          B = fe(!0, I);
        } finally {
          B ? $e() : (Z = !1, fe = null);
        }
      } else Z = !1;
    }
    var $e;
    if (typeof W == "function") $e = function() {
      W(oe);
    };
    else if (typeof MessageChannel < "u") {
      var Ue = new MessageChannel(), et = Ue.port2;
      Ue.port1.onmessage = oe, $e = function() {
        et.postMessage(null);
      };
    } else $e = function() {
      R(oe, 0);
    };
    function Me(I) {
      fe = I, Z || (Z = !0, $e());
    }
    function ge(I, B) {
      we = R(function() {
        I(i.unstable_now());
      }, B);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(I) {
      I.callback = null;
    }, i.unstable_continueExecution = function() {
      j || Y || (j = !0, Me(ne));
    }, i.unstable_forceFrameRate = function(I) {
      0 > I || 125 < I ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : _e = 0 < I ? Math.floor(1e3 / I) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return E;
    }, i.unstable_getFirstCallbackNode = function() {
      return u(C);
    }, i.unstable_next = function(I) {
      switch (E) {
        case 1:
        case 2:
        case 3:
          var B = 3;
          break;
        default:
          B = E;
      }
      var D = E;
      E = B;
      try {
        return I();
      } finally {
        E = D;
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
      var D = E;
      E = I;
      try {
        return B();
      } finally {
        E = D;
      }
    }, i.unstable_scheduleCallback = function(I, B, D) {
      var h = i.unstable_now();
      switch (typeof D == "object" && D !== null ? (D = D.delay, D = typeof D == "number" && 0 < D ? h + D : h) : D = h, I) {
        case 1:
          var N = -1;
          break;
        case 2:
          N = 250;
          break;
        case 5:
          N = 1073741823;
          break;
        case 4:
          N = 1e4;
          break;
        default:
          N = 5e3;
      }
      return N = D + N, I = { id: T++, callback: B, priorityLevel: I, startTime: D, expirationTime: N, sortIndex: -1 }, D > h ? (I.sortIndex = D, c(_, I), u(C) === null && I === u(_) && (P ? (X(we), we = -1) : P = !0, ge(K, D - h))) : (I.sortIndex = N, c(C, I), j || Y || (j = !0, Me(ne))), I;
    }, i.unstable_shouldYield = Oe, i.unstable_wrapCallback = function(I) {
      var B = E;
      return function() {
        var D = E;
        E = B;
        try {
          return I.apply(this, arguments);
        } finally {
          E = D;
        }
      };
    };
  })(ia)), ia;
}
var kc;
function pf() {
  return kc || (kc = 1, oa.exports = df()), oa.exports;
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
var bc;
function ff() {
  if (bc) return Je;
  bc = 1;
  var i = ga(), c = pf();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1; r < arguments.length; r++) t += "&args[]=" + encodeURIComponent(arguments[r]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var m = /* @__PURE__ */ new Set(), w = {};
  function v(e, t) {
    g(e, t), g(e + "Capture", t);
  }
  function g(e, t) {
    for (w[e] = t, e = 0; e < t.length; e++) m.add(t[e]);
  }
  var b = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), C = Object.prototype.hasOwnProperty, _ = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, T = {}, V = {};
  function E(e) {
    return C.call(V, e) ? !0 : C.call(T, e) ? !1 : _.test(e) ? V[e] = !0 : (T[e] = !0, !1);
  }
  function Y(e, t, r, n) {
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
  function j(e, t, r, n) {
    if (t === null || typeof t > "u" || Y(e, t, r, n)) return !0;
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
  function P(e, t, r, n, l, o, s) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = n, this.attributeNamespace = l, this.mustUseProperty = r, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = s;
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
  var X = /[\-:]([a-z])/g;
  function W(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      X,
      W
    );
    R[t] = new P(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(X, W);
    R[t] = new P(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(X, W);
    R[t] = new P(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    R[e] = new P(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), R.xlinkHref = new P("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    R[e] = new P(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function A(e, t, r, n) {
    var l = R.hasOwnProperty(t) ? R[t] : null;
    (l !== null ? l.type !== 0 : n || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (j(t, r, l, n) && (r = null), n || l === null ? E(t) && (r === null ? e.removeAttribute(t) : e.setAttribute(t, "" + r)) : l.mustUseProperty ? e[l.propertyName] = r === null ? l.type === 3 ? !1 : "" : r : (t = l.attributeName, n = l.attributeNamespace, r === null ? e.removeAttribute(t) : (l = l.type, r = l === 3 || l === 4 && r === !0 ? "" : "" + r, n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r))));
  }
  var K = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ne = Symbol.for("react.element"), Z = Symbol.for("react.portal"), fe = Symbol.for("react.fragment"), we = Symbol.for("react.strict_mode"), _e = Symbol.for("react.profiler"), Fe = Symbol.for("react.provider"), Oe = Symbol.for("react.context"), oe = Symbol.for("react.forward_ref"), $e = Symbol.for("react.suspense"), Ue = Symbol.for("react.suspense_list"), et = Symbol.for("react.memo"), Me = Symbol.for("react.lazy"), ge = Symbol.for("react.offscreen"), I = Symbol.iterator;
  function B(e) {
    return e === null || typeof e != "object" ? null : (e = I && e[I] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var D = Object.assign, h;
  function N(e) {
    if (h === void 0) try {
      throw Error();
    } catch (r) {
      var t = r.stack.trim().match(/\n( *(at )?)/);
      h = t && t[1] || "";
    }
    return `
` + h + e;
  }
  var te = !1;
  function le(e, t) {
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
      te = !1, Error.prepareStackTrace = r;
    }
    return (e = e ? e.displayName || e.name : "") ? N(e) : "";
  }
  function se(e) {
    switch (e.tag) {
      case 5:
        return N(e.type);
      case 16:
        return N("Lazy");
      case 13:
        return N("Suspense");
      case 19:
        return N("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = le(e.type, !1), e;
      case 11:
        return e = le(e.type.render, !1), e;
      case 1:
        return e = le(e.type, !0), e;
      default:
        return "";
    }
  }
  function ue(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case fe:
        return "Fragment";
      case Z:
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
      case oe:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case et:
        return t = e.displayName || null, t !== null ? t : ue(e.type) || "Memo";
      case Me:
        t = e._payload, e = e._init;
        try {
          return ue(e(t));
        } catch {
        }
    }
    return null;
  }
  function me(e) {
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
        return ue(t);
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
  function Gn(e) {
    e._valueTracker || (e._valueTracker = tt(e));
  }
  function ba(e) {
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
  function so(e, t) {
    var r = t.checked;
    return D({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: r ?? e._wrapperState.initialChecked });
  }
  function ja(e, t) {
    var r = t.defaultValue == null ? "" : t.defaultValue, n = t.checked != null ? t.checked : t.defaultChecked;
    r = de(t.value != null ? t.value : r), e._wrapperState = { initialChecked: n, initialValue: r, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Sa(e, t) {
    t = t.checked, t != null && A(e, "checked", t, !1);
  }
  function uo(e, t) {
    Sa(e, t);
    var r = de(t.value), n = t.type;
    if (r != null) n === "number" ? (r === 0 && e.value === "" || e.value != r) && (e.value = "" + r) : e.value !== "" + r && (e.value = "" + r);
    else if (n === "submit" || n === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? co(e, t.type, r) : t.hasOwnProperty("defaultValue") && co(e, t.type, de(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Ca(e, t, r) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var n = t.type;
      if (!(n !== "submit" && n !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, r || t === e.value || (e.value = t), e.defaultValue = t;
    }
    r = e.name, r !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, r !== "" && (e.name = r);
  }
  function co(e, t, r) {
    (t !== "number" || Kn(e.ownerDocument) !== e) && (r == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + r && (e.defaultValue = "" + r));
  }
  var tn = Array.isArray;
  function zr(e, t, r, n) {
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
  function po(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return D({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Ea(e, t) {
    var r = t.value;
    if (r == null) {
      if (r = t.children, t = t.defaultValue, r != null) {
        if (t != null) throw Error(u(92));
        if (tn(r)) {
          if (1 < r.length) throw Error(u(93));
          r = r[0];
        }
        t = r;
      }
      t == null && (t = ""), r = t;
    }
    e._wrapperState = { initialValue: de(r) };
  }
  function Na(e, t) {
    var r = de(t.value), n = de(t.defaultValue);
    r != null && (r = "" + r, r !== e.value && (e.value = r), t.defaultValue == null && e.defaultValue !== r && (e.defaultValue = r)), n != null && (e.defaultValue = "" + n);
  }
  function za(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function _a(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function fo(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? _a(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Yn, Ma = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, r, n, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, r, n, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Yn = Yn || document.createElement("div"), Yn.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Yn.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function rn(e, t) {
    if (t) {
      var r = e.firstChild;
      if (r && r === e.lastChild && r.nodeType === 3) {
        r.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var nn = {
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
  }, ad = ["Webkit", "ms", "Moz", "O"];
  Object.keys(nn).forEach(function(e) {
    ad.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), nn[t] = nn[e];
    });
  });
  function Pa(e, t, r) {
    return t == null || typeof t == "boolean" || t === "" ? "" : r || typeof t != "number" || t === 0 || nn.hasOwnProperty(e) && nn[e] ? ("" + t).trim() : t + "px";
  }
  function La(e, t) {
    e = e.style;
    for (var r in t) if (t.hasOwnProperty(r)) {
      var n = r.indexOf("--") === 0, l = Pa(r, t[r], n);
      r === "float" && (r = "cssFloat"), n ? e.setProperty(r, l) : e[r] = l;
    }
  }
  var sd = D({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function mo(e, t) {
    if (t) {
      if (sd[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function ho(e, t) {
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
  var go = null;
  function xo(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var vo = null, _r = null, Mr = null;
  function Ta(e) {
    if (e = En(e)) {
      if (typeof vo != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = yl(t), vo(e.stateNode, e.type, t));
    }
  }
  function Ra(e) {
    _r ? Mr ? Mr.push(e) : Mr = [e] : _r = e;
  }
  function Ia() {
    if (_r) {
      var e = _r, t = Mr;
      if (Mr = _r = null, Ta(e), t) for (e = 0; e < t.length; e++) Ta(t[e]);
    }
  }
  function Oa(e, t) {
    return e(t);
  }
  function Da() {
  }
  var yo = !1;
  function Aa(e, t, r) {
    if (yo) return e(t, r);
    yo = !0;
    try {
      return Oa(e, t, r);
    } finally {
      yo = !1, (_r !== null || Mr !== null) && (Da(), Ia());
    }
  }
  function ln(e, t) {
    var r = e.stateNode;
    if (r === null) return null;
    var n = yl(r);
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
  var wo = !1;
  if (b) try {
    var on = {};
    Object.defineProperty(on, "passive", { get: function() {
      wo = !0;
    } }), window.addEventListener("test", on, on), window.removeEventListener("test", on, on);
  } catch {
    wo = !1;
  }
  function ud(e, t, r, n, l, o, s, d, p) {
    var k = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(r, k);
    } catch (z) {
      this.onError(z);
    }
  }
  var an = !1, Xn = null, Zn = !1, ko = null, cd = { onError: function(e) {
    an = !0, Xn = e;
  } };
  function dd(e, t, r, n, l, o, s, d, p) {
    an = !1, Xn = null, ud.apply(cd, arguments);
  }
  function pd(e, t, r, n, l, o, s, d, p) {
    if (dd.apply(this, arguments), an) {
      if (an) {
        var k = Xn;
        an = !1, Xn = null;
      } else throw Error(u(198));
      Zn || (Zn = !0, ko = k);
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
  function Fa(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function $a(e) {
    if (cr(e) !== e) throw Error(u(188));
  }
  function fd(e) {
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
          if (o === r) return $a(l), e;
          if (o === n) return $a(l), t;
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
  function Ua(e) {
    return e = fd(e), e !== null ? Ha(e) : null;
  }
  function Ha(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Ha(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Va = c.unstable_scheduleCallback, Ba = c.unstable_cancelCallback, md = c.unstable_shouldYield, hd = c.unstable_requestPaint, Ee = c.unstable_now, gd = c.unstable_getCurrentPriorityLevel, bo = c.unstable_ImmediatePriority, Wa = c.unstable_UserBlockingPriority, Jn = c.unstable_NormalPriority, xd = c.unstable_LowPriority, Qa = c.unstable_IdlePriority, el = null, kt = null;
  function vd(e) {
    if (kt && typeof kt.onCommitFiberRoot == "function") try {
      kt.onCommitFiberRoot(el, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : kd, yd = Math.log, wd = Math.LN2;
  function kd(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (yd(e) / wd | 0) | 0;
  }
  var tl = 64, rl = 4194304;
  function sn(e) {
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
  function nl(e, t) {
    var r = e.pendingLanes;
    if (r === 0) return 0;
    var n = 0, l = e.suspendedLanes, o = e.pingedLanes, s = r & 268435455;
    if (s !== 0) {
      var d = s & ~l;
      d !== 0 ? n = sn(d) : (o &= s, o !== 0 && (n = sn(o)));
    } else s = r & ~l, s !== 0 ? n = sn(s) : o !== 0 && (n = sn(o));
    if (n === 0) return 0;
    if (t !== 0 && t !== n && (t & l) === 0 && (l = n & -n, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((n & 4) !== 0 && (n |= r & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= n; 0 < t; ) r = 31 - pt(t), l = 1 << r, n |= e[r], t &= ~l;
    return n;
  }
  function bd(e, t) {
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
  function jd(e, t) {
    for (var r = e.suspendedLanes, n = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var s = 31 - pt(o), d = 1 << s, p = l[s];
      p === -1 ? ((d & r) === 0 || (d & n) !== 0) && (l[s] = bd(d, t)) : p <= t && (e.expiredLanes |= d), o &= ~d;
    }
  }
  function jo(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function qa() {
    var e = tl;
    return tl <<= 1, (tl & 4194240) === 0 && (tl = 64), e;
  }
  function So(e) {
    for (var t = [], r = 0; 31 > r; r++) t.push(e);
    return t;
  }
  function un(e, t, r) {
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
  function Co(e, t) {
    var r = e.entangledLanes |= t;
    for (e = e.entanglements; r; ) {
      var n = 31 - pt(r), l = 1 << n;
      l & t | e[n] & t && (e[n] |= t), r &= ~l;
    }
  }
  var pe = 0;
  function Ga(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Ka, Eo, Ya, Xa, Za, No = !1, ll = [], Ut = null, Ht = null, Vt = null, cn = /* @__PURE__ */ new Map(), dn = /* @__PURE__ */ new Map(), Bt = [], Cd = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ja(e, t) {
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
        cn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        dn.delete(t.pointerId);
    }
  }
  function pn(e, t, r, n, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: r, eventSystemFlags: n, nativeEvent: o, targetContainers: [l] }, t !== null && (t = En(t), t !== null && Eo(t)), e) : (e.eventSystemFlags |= n, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Ed(e, t, r, n, l) {
    switch (t) {
      case "focusin":
        return Ut = pn(Ut, e, t, r, n, l), !0;
      case "dragenter":
        return Ht = pn(Ht, e, t, r, n, l), !0;
      case "mouseover":
        return Vt = pn(Vt, e, t, r, n, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return cn.set(o, pn(cn.get(o) || null, e, t, r, n, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, dn.set(o, pn(dn.get(o) || null, e, t, r, n, l)), !0;
    }
    return !1;
  }
  function es(e) {
    var t = dr(e.target);
    if (t !== null) {
      var r = cr(t);
      if (r !== null) {
        if (t = r.tag, t === 13) {
          if (t = Fa(r), t !== null) {
            e.blockedOn = t, Za(e.priority, function() {
              Ya(r);
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
  function ol(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var r = _o(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (r === null) {
        r = e.nativeEvent;
        var n = new r.constructor(r.type, r);
        go = n, r.target.dispatchEvent(n), go = null;
      } else return t = En(r), t !== null && Eo(t), e.blockedOn = r, !1;
      t.shift();
    }
    return !0;
  }
  function ts(e, t, r) {
    ol(e) && r.delete(t);
  }
  function Nd() {
    No = !1, Ut !== null && ol(Ut) && (Ut = null), Ht !== null && ol(Ht) && (Ht = null), Vt !== null && ol(Vt) && (Vt = null), cn.forEach(ts), dn.forEach(ts);
  }
  function fn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, No || (No = !0, c.unstable_scheduleCallback(c.unstable_NormalPriority, Nd)));
  }
  function mn(e) {
    function t(l) {
      return fn(l, e);
    }
    if (0 < ll.length) {
      fn(ll[0], e);
      for (var r = 1; r < ll.length; r++) {
        var n = ll[r];
        n.blockedOn === e && (n.blockedOn = null);
      }
    }
    for (Ut !== null && fn(Ut, e), Ht !== null && fn(Ht, e), Vt !== null && fn(Vt, e), cn.forEach(t), dn.forEach(t), r = 0; r < Bt.length; r++) n = Bt[r], n.blockedOn === e && (n.blockedOn = null);
    for (; 0 < Bt.length && (r = Bt[0], r.blockedOn === null); ) es(r), r.blockedOn === null && Bt.shift();
  }
  var Pr = K.ReactCurrentBatchConfig, il = !0;
  function zd(e, t, r, n) {
    var l = pe, o = Pr.transition;
    Pr.transition = null;
    try {
      pe = 1, zo(e, t, r, n);
    } finally {
      pe = l, Pr.transition = o;
    }
  }
  function _d(e, t, r, n) {
    var l = pe, o = Pr.transition;
    Pr.transition = null;
    try {
      pe = 4, zo(e, t, r, n);
    } finally {
      pe = l, Pr.transition = o;
    }
  }
  function zo(e, t, r, n) {
    if (il) {
      var l = _o(e, t, r, n);
      if (l === null) Qo(e, t, n, al, r), Ja(e, n);
      else if (Ed(l, e, t, r, n)) n.stopPropagation();
      else if (Ja(e, n), t & 4 && -1 < Cd.indexOf(e)) {
        for (; l !== null; ) {
          var o = En(l);
          if (o !== null && Ka(o), o = _o(e, t, r, n), o === null && Qo(e, t, n, al, r), o === l) break;
          l = o;
        }
        l !== null && n.stopPropagation();
      } else Qo(e, t, n, null, r);
    }
  }
  var al = null;
  function _o(e, t, r, n) {
    if (al = null, e = xo(n), e = dr(e), e !== null) if (t = cr(e), t === null) e = null;
    else if (r = t.tag, r === 13) {
      if (e = Fa(t), e !== null) return e;
      e = null;
    } else if (r === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return al = e, null;
  }
  function rs(e) {
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
        switch (gd()) {
          case bo:
            return 1;
          case Wa:
            return 4;
          case Jn:
          case xd:
            return 16;
          case Qa:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Wt = null, Mo = null, sl = null;
  function ns() {
    if (sl) return sl;
    var e, t = Mo, r = t.length, n, l = "value" in Wt ? Wt.value : Wt.textContent, o = l.length;
    for (e = 0; e < r && t[e] === l[e]; e++) ;
    var s = r - e;
    for (n = 1; n <= s && t[r - n] === l[o - n]; n++) ;
    return sl = l.slice(e, 1 < n ? 1 - n : void 0);
  }
  function ul(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function cl() {
    return !0;
  }
  function ls() {
    return !1;
  }
  function rt(e) {
    function t(r, n, l, o, s) {
      this._reactName = r, this._targetInst = l, this.type = n, this.nativeEvent = o, this.target = s, this.currentTarget = null;
      for (var d in e) e.hasOwnProperty(d) && (r = e[d], this[d] = r ? r(o) : o[d]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? cl : ls, this.isPropagationStopped = ls, this;
    }
    return D(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var r = this.nativeEvent;
      r && (r.preventDefault ? r.preventDefault() : typeof r.returnValue != "unknown" && (r.returnValue = !1), this.isDefaultPrevented = cl);
    }, stopPropagation: function() {
      var r = this.nativeEvent;
      r && (r.stopPropagation ? r.stopPropagation() : typeof r.cancelBubble != "unknown" && (r.cancelBubble = !0), this.isPropagationStopped = cl);
    }, persist: function() {
    }, isPersistent: cl }), t;
  }
  var Lr = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Po = rt(Lr), hn = D({}, Lr, { view: 0, detail: 0 }), Md = rt(hn), Lo, To, gn, dl = D({}, hn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Io, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== gn && (gn && e.type === "mousemove" ? (Lo = e.screenX - gn.screenX, To = e.screenY - gn.screenY) : To = Lo = 0, gn = e), Lo);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : To;
  } }), os = rt(dl), Pd = D({}, dl, { dataTransfer: 0 }), Ld = rt(Pd), Td = D({}, hn, { relatedTarget: 0 }), Ro = rt(Td), Rd = D({}, Lr, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Id = rt(Rd), Od = D({}, Lr, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Dd = rt(Od), Ad = D({}, Lr, { data: 0 }), is = rt(Ad), Fd = {
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
  }, $d = {
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
  }, Ud = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Hd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Ud[e]) ? !!t[e] : !1;
  }
  function Io() {
    return Hd;
  }
  var Vd = D({}, hn, { key: function(e) {
    if (e.key) {
      var t = Fd[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = ul(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? $d[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Io, charCode: function(e) {
    return e.type === "keypress" ? ul(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? ul(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Bd = rt(Vd), Wd = D({}, dl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), as = rt(Wd), Qd = D({}, hn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Io }), qd = rt(Qd), Gd = D({}, Lr, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Kd = rt(Gd), Yd = D({}, dl, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Xd = rt(Yd), Zd = [9, 13, 27, 32], Oo = b && "CompositionEvent" in window, xn = null;
  b && "documentMode" in document && (xn = document.documentMode);
  var Jd = b && "TextEvent" in window && !xn, ss = b && (!Oo || xn && 8 < xn && 11 >= xn), us = " ", cs = !1;
  function ds(e, t) {
    switch (e) {
      case "keyup":
        return Zd.indexOf(t.keyCode) !== -1;
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
  function ps(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Tr = !1;
  function ep(e, t) {
    switch (e) {
      case "compositionend":
        return ps(t);
      case "keypress":
        return t.which !== 32 ? null : (cs = !0, us);
      case "textInput":
        return e = t.data, e === us && cs ? null : e;
      default:
        return null;
    }
  }
  function tp(e, t) {
    if (Tr) return e === "compositionend" || !Oo && ds(e, t) ? (e = ns(), sl = Mo = Wt = null, Tr = !1, e) : null;
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
        return ss && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var rp = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function fs(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!rp[e.type] : t === "textarea";
  }
  function ms(e, t, r, n) {
    Ra(n), t = gl(t, "onChange"), 0 < t.length && (r = new Po("onChange", "change", null, r, n), e.push({ event: r, listeners: t }));
  }
  var vn = null, yn = null;
  function np(e) {
    Ls(e, 0);
  }
  function pl(e) {
    var t = Ar(e);
    if (ba(t)) return e;
  }
  function lp(e, t) {
    if (e === "change") return t;
  }
  var hs = !1;
  if (b) {
    var Do;
    if (b) {
      var Ao = "oninput" in document;
      if (!Ao) {
        var gs = document.createElement("div");
        gs.setAttribute("oninput", "return;"), Ao = typeof gs.oninput == "function";
      }
      Do = Ao;
    } else Do = !1;
    hs = Do && (!document.documentMode || 9 < document.documentMode);
  }
  function xs() {
    vn && (vn.detachEvent("onpropertychange", vs), yn = vn = null);
  }
  function vs(e) {
    if (e.propertyName === "value" && pl(yn)) {
      var t = [];
      ms(t, yn, e, xo(e)), Aa(np, t);
    }
  }
  function op(e, t, r) {
    e === "focusin" ? (xs(), vn = t, yn = r, vn.attachEvent("onpropertychange", vs)) : e === "focusout" && xs();
  }
  function ip(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return pl(yn);
  }
  function ap(e, t) {
    if (e === "click") return pl(t);
  }
  function sp(e, t) {
    if (e === "input" || e === "change") return pl(t);
  }
  function up(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ft = typeof Object.is == "function" ? Object.is : up;
  function wn(e, t) {
    if (ft(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var r = Object.keys(e), n = Object.keys(t);
    if (r.length !== n.length) return !1;
    for (n = 0; n < r.length; n++) {
      var l = r[n];
      if (!C.call(t, l) || !ft(e[l], t[l])) return !1;
    }
    return !0;
  }
  function ys(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function ws(e, t) {
    var r = ys(e);
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
      r = ys(r);
    }
  }
  function ks(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? ks(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function bs() {
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
  function Fo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function cp(e) {
    var t = bs(), r = e.focusedElem, n = e.selectionRange;
    if (t !== r && r && r.ownerDocument && ks(r.ownerDocument.documentElement, r)) {
      if (n !== null && Fo(r)) {
        if (t = n.start, e = n.end, e === void 0 && (e = t), "selectionStart" in r) r.selectionStart = t, r.selectionEnd = Math.min(e, r.value.length);
        else if (e = (t = r.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = r.textContent.length, o = Math.min(n.start, l);
          n = n.end === void 0 ? o : Math.min(n.end, l), !e.extend && o > n && (l = n, n = o, o = l), l = ws(r, o);
          var s = ws(
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
  var dp = b && "documentMode" in document && 11 >= document.documentMode, Rr = null, $o = null, kn = null, Uo = !1;
  function js(e, t, r) {
    var n = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
    Uo || Rr == null || Rr !== Kn(n) || (n = Rr, "selectionStart" in n && Fo(n) ? n = { start: n.selectionStart, end: n.selectionEnd } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = { anchorNode: n.anchorNode, anchorOffset: n.anchorOffset, focusNode: n.focusNode, focusOffset: n.focusOffset }), kn && wn(kn, n) || (kn = n, n = gl($o, "onSelect"), 0 < n.length && (t = new Po("onSelect", "select", null, t, r), e.push({ event: t, listeners: n }), t.target = Rr)));
  }
  function fl(e, t) {
    var r = {};
    return r[e.toLowerCase()] = t.toLowerCase(), r["Webkit" + e] = "webkit" + t, r["Moz" + e] = "moz" + t, r;
  }
  var Ir = { animationend: fl("Animation", "AnimationEnd"), animationiteration: fl("Animation", "AnimationIteration"), animationstart: fl("Animation", "AnimationStart"), transitionend: fl("Transition", "TransitionEnd") }, Ho = {}, Ss = {};
  b && (Ss = document.createElement("div").style, "AnimationEvent" in window || (delete Ir.animationend.animation, delete Ir.animationiteration.animation, delete Ir.animationstart.animation), "TransitionEvent" in window || delete Ir.transitionend.transition);
  function ml(e) {
    if (Ho[e]) return Ho[e];
    if (!Ir[e]) return e;
    var t = Ir[e], r;
    for (r in t) if (t.hasOwnProperty(r) && r in Ss) return Ho[e] = t[r];
    return e;
  }
  var Cs = ml("animationend"), Es = ml("animationiteration"), Ns = ml("animationstart"), zs = ml("transitionend"), _s = /* @__PURE__ */ new Map(), Ms = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Qt(e, t) {
    _s.set(e, t), v(t, [e]);
  }
  for (var Vo = 0; Vo < Ms.length; Vo++) {
    var Bo = Ms[Vo], pp = Bo.toLowerCase(), fp = Bo[0].toUpperCase() + Bo.slice(1);
    Qt(pp, "on" + fp);
  }
  Qt(Cs, "onAnimationEnd"), Qt(Es, "onAnimationIteration"), Qt(Ns, "onAnimationStart"), Qt("dblclick", "onDoubleClick"), Qt("focusin", "onFocus"), Qt("focusout", "onBlur"), Qt(zs, "onTransitionEnd"), g("onMouseEnter", ["mouseout", "mouseover"]), g("onMouseLeave", ["mouseout", "mouseover"]), g("onPointerEnter", ["pointerout", "pointerover"]), g("onPointerLeave", ["pointerout", "pointerover"]), v("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), v("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), v("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), v("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), v("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), v("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var bn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mp = new Set("cancel close invalid load scroll toggle".split(" ").concat(bn));
  function Ps(e, t, r) {
    var n = e.type || "unknown-event";
    e.currentTarget = r, pd(n, t, void 0, e), e.currentTarget = null;
  }
  function Ls(e, t) {
    t = (t & 4) !== 0;
    for (var r = 0; r < e.length; r++) {
      var n = e[r], l = n.event;
      n = n.listeners;
      e: {
        var o = void 0;
        if (t) for (var s = n.length - 1; 0 <= s; s--) {
          var d = n[s], p = d.instance, k = d.currentTarget;
          if (d = d.listener, p !== o && l.isPropagationStopped()) break e;
          Ps(l, d, k), o = p;
        }
        else for (s = 0; s < n.length; s++) {
          if (d = n[s], p = d.instance, k = d.currentTarget, d = d.listener, p !== o && l.isPropagationStopped()) break e;
          Ps(l, d, k), o = p;
        }
      }
    }
    if (Zn) throw e = ko, Zn = !1, ko = null, e;
  }
  function xe(e, t) {
    var r = t[Zo];
    r === void 0 && (r = t[Zo] = /* @__PURE__ */ new Set());
    var n = e + "__bubble";
    r.has(n) || (Ts(t, e, 2, !1), r.add(n));
  }
  function Wo(e, t, r) {
    var n = 0;
    t && (n |= 4), Ts(r, e, n, t);
  }
  var hl = "_reactListening" + Math.random().toString(36).slice(2);
  function jn(e) {
    if (!e[hl]) {
      e[hl] = !0, m.forEach(function(r) {
        r !== "selectionchange" && (mp.has(r) || Wo(r, !1, e), Wo(r, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[hl] || (t[hl] = !0, Wo("selectionchange", !1, t));
    }
  }
  function Ts(e, t, r, n) {
    switch (rs(t)) {
      case 1:
        var l = zd;
        break;
      case 4:
        l = _d;
        break;
      default:
        l = zo;
    }
    r = l.bind(null, t, r, e), l = void 0, !wo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), n ? l !== void 0 ? e.addEventListener(t, r, { capture: !0, passive: l }) : e.addEventListener(t, r, !0) : l !== void 0 ? e.addEventListener(t, r, { passive: l }) : e.addEventListener(t, r, !1);
  }
  function Qo(e, t, r, n, l) {
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
          if (s = dr(d), s === null) return;
          if (p = s.tag, p === 5 || p === 6) {
            n = o = s;
            continue e;
          }
          d = d.parentNode;
        }
      }
      n = n.return;
    }
    Aa(function() {
      var k = o, z = xo(r), M = [];
      e: {
        var S = _s.get(e);
        if (S !== void 0) {
          var O = Po, $ = e;
          switch (e) {
            case "keypress":
              if (ul(r) === 0) break e;
            case "keydown":
            case "keyup":
              O = Bd;
              break;
            case "focusin":
              $ = "focus", O = Ro;
              break;
            case "focusout":
              $ = "blur", O = Ro;
              break;
            case "beforeblur":
            case "afterblur":
              O = Ro;
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
              O = os;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              O = Ld;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              O = qd;
              break;
            case Cs:
            case Es:
            case Ns:
              O = Id;
              break;
            case zs:
              O = Kd;
              break;
            case "scroll":
              O = Md;
              break;
            case "wheel":
              O = Xd;
              break;
            case "copy":
            case "cut":
            case "paste":
              O = Dd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              O = as;
          }
          var U = (t & 4) !== 0, Ne = !U && e === "scroll", x = U ? S !== null ? S + "Capture" : null : S;
          U = [];
          for (var f = k, y; f !== null; ) {
            y = f;
            var L = y.stateNode;
            if (y.tag === 5 && L !== null && (y = L, x !== null && (L = ln(f, x), L != null && U.push(Sn(f, L, y)))), Ne) break;
            f = f.return;
          }
          0 < U.length && (S = new O(S, $, null, r, z), M.push({ event: S, listeners: U }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (S = e === "mouseover" || e === "pointerover", O = e === "mouseout" || e === "pointerout", S && r !== go && ($ = r.relatedTarget || r.fromElement) && (dr($) || $[zt])) break e;
          if ((O || S) && (S = z.window === z ? z : (S = z.ownerDocument) ? S.defaultView || S.parentWindow : window, O ? ($ = r.relatedTarget || r.toElement, O = k, $ = $ ? dr($) : null, $ !== null && (Ne = cr($), $ !== Ne || $.tag !== 5 && $.tag !== 6) && ($ = null)) : (O = null, $ = k), O !== $)) {
            if (U = os, L = "onMouseLeave", x = "onMouseEnter", f = "mouse", (e === "pointerout" || e === "pointerover") && (U = as, L = "onPointerLeave", x = "onPointerEnter", f = "pointer"), Ne = O == null ? S : Ar(O), y = $ == null ? S : Ar($), S = new U(L, f + "leave", O, r, z), S.target = Ne, S.relatedTarget = y, L = null, dr(z) === k && (U = new U(x, f + "enter", $, r, z), U.target = y, U.relatedTarget = Ne, L = U), Ne = L, O && $) t: {
              for (U = O, x = $, f = 0, y = U; y; y = Or(y)) f++;
              for (y = 0, L = x; L; L = Or(L)) y++;
              for (; 0 < f - y; ) U = Or(U), f--;
              for (; 0 < y - f; ) x = Or(x), y--;
              for (; f--; ) {
                if (U === x || x !== null && U === x.alternate) break t;
                U = Or(U), x = Or(x);
              }
              U = null;
            }
            else U = null;
            O !== null && Rs(M, S, O, U, !1), $ !== null && Ne !== null && Rs(M, Ne, $, U, !0);
          }
        }
        e: {
          if (S = k ? Ar(k) : window, O = S.nodeName && S.nodeName.toLowerCase(), O === "select" || O === "input" && S.type === "file") var H = lp;
          else if (fs(S)) if (hs) H = sp;
          else {
            H = ip;
            var q = op;
          }
          else (O = S.nodeName) && O.toLowerCase() === "input" && (S.type === "checkbox" || S.type === "radio") && (H = ap);
          if (H && (H = H(e, k))) {
            ms(M, H, r, z);
            break e;
          }
          q && q(e, S, k), e === "focusout" && (q = S._wrapperState) && q.controlled && S.type === "number" && co(S, "number", S.value);
        }
        switch (q = k ? Ar(k) : window, e) {
          case "focusin":
            (fs(q) || q.contentEditable === "true") && (Rr = q, $o = k, kn = null);
            break;
          case "focusout":
            kn = $o = Rr = null;
            break;
          case "mousedown":
            Uo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Uo = !1, js(M, r, z);
            break;
          case "selectionchange":
            if (dp) break;
          case "keydown":
          case "keyup":
            js(M, r, z);
        }
        var G;
        if (Oo) e: {
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
        else Tr ? ds(e, r) && (J = "onCompositionEnd") : e === "keydown" && r.keyCode === 229 && (J = "onCompositionStart");
        J && (ss && r.locale !== "ko" && (Tr || J !== "onCompositionStart" ? J === "onCompositionEnd" && Tr && (G = ns()) : (Wt = z, Mo = "value" in Wt ? Wt.value : Wt.textContent, Tr = !0)), q = gl(k, J), 0 < q.length && (J = new is(J, e, null, r, z), M.push({ event: J, listeners: q }), G ? J.data = G : (G = ps(r), G !== null && (J.data = G)))), (G = Jd ? ep(e, r) : tp(e, r)) && (k = gl(k, "onBeforeInput"), 0 < k.length && (z = new is("onBeforeInput", "beforeinput", null, r, z), M.push({ event: z, listeners: k }), z.data = G));
      }
      Ls(M, t);
    });
  }
  function Sn(e, t, r) {
    return { instance: e, listener: t, currentTarget: r };
  }
  function gl(e, t) {
    for (var r = t + "Capture", n = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = ln(e, r), o != null && n.unshift(Sn(e, o, l)), o = ln(e, t), o != null && n.push(Sn(e, o, l))), e = e.return;
    }
    return n;
  }
  function Or(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Rs(e, t, r, n, l) {
    for (var o = t._reactName, s = []; r !== null && r !== n; ) {
      var d = r, p = d.alternate, k = d.stateNode;
      if (p !== null && p === n) break;
      d.tag === 5 && k !== null && (d = k, l ? (p = ln(r, o), p != null && s.unshift(Sn(r, p, d))) : l || (p = ln(r, o), p != null && s.push(Sn(r, p, d)))), r = r.return;
    }
    s.length !== 0 && e.push({ event: t, listeners: s });
  }
  var hp = /\r\n?/g, gp = /\u0000|\uFFFD/g;
  function Is(e) {
    return (typeof e == "string" ? e : "" + e).replace(hp, `
`).replace(gp, "");
  }
  function xl(e, t, r) {
    if (t = Is(t), Is(e) !== t && r) throw Error(u(425));
  }
  function vl() {
  }
  var qo = null, Go = null;
  function Ko(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Yo = typeof setTimeout == "function" ? setTimeout : void 0, xp = typeof clearTimeout == "function" ? clearTimeout : void 0, Os = typeof Promise == "function" ? Promise : void 0, vp = typeof queueMicrotask == "function" ? queueMicrotask : typeof Os < "u" ? function(e) {
    return Os.resolve(null).then(e).catch(yp);
  } : Yo;
  function yp(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Xo(e, t) {
    var r = t, n = 0;
    do {
      var l = r.nextSibling;
      if (e.removeChild(r), l && l.nodeType === 8) if (r = l.data, r === "/$") {
        if (n === 0) {
          e.removeChild(l), mn(t);
          return;
        }
        n--;
      } else r !== "$" && r !== "$?" && r !== "$!" || n++;
      r = l;
    } while (r);
    mn(t);
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
  function Ds(e) {
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
  var Dr = Math.random().toString(36).slice(2), bt = "__reactFiber$" + Dr, Cn = "__reactProps$" + Dr, zt = "__reactContainer$" + Dr, Zo = "__reactEvents$" + Dr, wp = "__reactListeners$" + Dr, kp = "__reactHandles$" + Dr;
  function dr(e) {
    var t = e[bt];
    if (t) return t;
    for (var r = e.parentNode; r; ) {
      if (t = r[zt] || r[bt]) {
        if (r = t.alternate, t.child !== null || r !== null && r.child !== null) for (e = Ds(e); e !== null; ) {
          if (r = e[bt]) return r;
          e = Ds(e);
        }
        return t;
      }
      e = r, r = e.parentNode;
    }
    return null;
  }
  function En(e) {
    return e = e[bt] || e[zt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Ar(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(u(33));
  }
  function yl(e) {
    return e[Cn] || null;
  }
  var Jo = [], Fr = -1;
  function Gt(e) {
    return { current: e };
  }
  function ve(e) {
    0 > Fr || (e.current = Jo[Fr], Jo[Fr] = null, Fr--);
  }
  function he(e, t) {
    Fr++, Jo[Fr] = e.current, e.current = t;
  }
  var Kt = {}, He = Gt(Kt), Ge = Gt(!1), pr = Kt;
  function $r(e, t) {
    var r = e.type.contextTypes;
    if (!r) return Kt;
    var n = e.stateNode;
    if (n && n.__reactInternalMemoizedUnmaskedChildContext === t) return n.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in r) l[o] = t[o];
    return n && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ke(e) {
    return e = e.childContextTypes, e != null;
  }
  function wl() {
    ve(Ge), ve(He);
  }
  function As(e, t, r) {
    if (He.current !== Kt) throw Error(u(168));
    he(He, t), he(Ge, r);
  }
  function Fs(e, t, r) {
    var n = e.stateNode;
    if (t = t.childContextTypes, typeof n.getChildContext != "function") return r;
    n = n.getChildContext();
    for (var l in n) if (!(l in t)) throw Error(u(108, me(e) || "Unknown", l));
    return D({}, r, n);
  }
  function kl(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Kt, pr = He.current, he(He, e), he(Ge, Ge.current), !0;
  }
  function $s(e, t, r) {
    var n = e.stateNode;
    if (!n) throw Error(u(169));
    r ? (e = Fs(e, t, pr), n.__reactInternalMemoizedMergedChildContext = e, ve(Ge), ve(He), he(He, e)) : ve(Ge), he(Ge, r);
  }
  var _t = null, bl = !1, ei = !1;
  function Us(e) {
    _t === null ? _t = [e] : _t.push(e);
  }
  function bp(e) {
    bl = !0, Us(e);
  }
  function Yt() {
    if (!ei && _t !== null) {
      ei = !0;
      var e = 0, t = pe;
      try {
        var r = _t;
        for (pe = 1; e < r.length; e++) {
          var n = r[e];
          do
            n = n(!0);
          while (n !== null);
        }
        _t = null, bl = !1;
      } catch (l) {
        throw _t !== null && (_t = _t.slice(e + 1)), Va(bo, Yt), l;
      } finally {
        pe = t, ei = !1;
      }
    }
    return null;
  }
  var Ur = [], Hr = 0, jl = null, Sl = 0, it = [], at = 0, fr = null, Mt = 1, Pt = "";
  function mr(e, t) {
    Ur[Hr++] = Sl, Ur[Hr++] = jl, jl = e, Sl = t;
  }
  function Hs(e, t, r) {
    it[at++] = Mt, it[at++] = Pt, it[at++] = fr, fr = e;
    var n = Mt;
    e = Pt;
    var l = 32 - pt(n) - 1;
    n &= ~(1 << l), r += 1;
    var o = 32 - pt(t) + l;
    if (30 < o) {
      var s = l - l % 5;
      o = (n & (1 << s) - 1).toString(32), n >>= s, l -= s, Mt = 1 << 32 - pt(t) + l | r << l | n, Pt = o + e;
    } else Mt = 1 << o | r << l | n, Pt = e;
  }
  function ti(e) {
    e.return !== null && (mr(e, 1), Hs(e, 1, 0));
  }
  function ri(e) {
    for (; e === jl; ) jl = Ur[--Hr], Ur[Hr] = null, Sl = Ur[--Hr], Ur[Hr] = null;
    for (; e === fr; ) fr = it[--at], it[at] = null, Pt = it[--at], it[at] = null, Mt = it[--at], it[at] = null;
  }
  var nt = null, lt = null, be = !1, mt = null;
  function Vs(e, t) {
    var r = dt(5, null, null, 0);
    r.elementType = "DELETED", r.stateNode = t, r.return = e, t = e.deletions, t === null ? (e.deletions = [r], e.flags |= 16) : t.push(r);
  }
  function Bs(e, t) {
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
  function ni(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function li(e) {
    if (be) {
      var t = lt;
      if (t) {
        var r = t;
        if (!Bs(e, t)) {
          if (ni(e)) throw Error(u(418));
          t = qt(r.nextSibling);
          var n = nt;
          t && Bs(e, t) ? Vs(n, r) : (e.flags = e.flags & -4097 | 2, be = !1, nt = e);
        }
      } else {
        if (ni(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, be = !1, nt = e;
      }
    }
  }
  function Ws(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    nt = e;
  }
  function Cl(e) {
    if (e !== nt) return !1;
    if (!be) return Ws(e), be = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Ko(e.type, e.memoizedProps)), t && (t = lt)) {
      if (ni(e)) throw Qs(), Error(u(418));
      for (; t; ) Vs(e, t), t = qt(t.nextSibling);
    }
    if (Ws(e), e.tag === 13) {
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
  function Qs() {
    for (var e = lt; e; ) e = qt(e.nextSibling);
  }
  function Vr() {
    lt = nt = null, be = !1;
  }
  function oi(e) {
    mt === null ? mt = [e] : mt.push(e);
  }
  var jp = K.ReactCurrentBatchConfig;
  function Nn(e, t, r) {
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
  function El(e, t) {
    throw e = Object.prototype.toString.call(t), Error(u(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function qs(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Gs(e) {
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
    function s(x) {
      return e && x.alternate === null && (x.flags |= 2), x;
    }
    function d(x, f, y, L) {
      return f === null || f.tag !== 6 ? (f = Yi(y, x.mode, L), f.return = x, f) : (f = l(f, y), f.return = x, f);
    }
    function p(x, f, y, L) {
      var H = y.type;
      return H === fe ? z(x, f, y.props.children, L, y.key) : f !== null && (f.elementType === H || typeof H == "object" && H !== null && H.$$typeof === Me && qs(H) === f.type) ? (L = l(f, y.props), L.ref = Nn(x, f, y), L.return = x, L) : (L = Yl(y.type, y.key, y.props, null, x.mode, L), L.ref = Nn(x, f, y), L.return = x, L);
    }
    function k(x, f, y, L) {
      return f === null || f.tag !== 4 || f.stateNode.containerInfo !== y.containerInfo || f.stateNode.implementation !== y.implementation ? (f = Xi(y, x.mode, L), f.return = x, f) : (f = l(f, y.children || []), f.return = x, f);
    }
    function z(x, f, y, L, H) {
      return f === null || f.tag !== 7 ? (f = br(y, x.mode, L, H), f.return = x, f) : (f = l(f, y), f.return = x, f);
    }
    function M(x, f, y) {
      if (typeof f == "string" && f !== "" || typeof f == "number") return f = Yi("" + f, x.mode, y), f.return = x, f;
      if (typeof f == "object" && f !== null) {
        switch (f.$$typeof) {
          case ne:
            return y = Yl(f.type, f.key, f.props, null, x.mode, y), y.ref = Nn(x, null, f), y.return = x, y;
          case Z:
            return f = Xi(f, x.mode, y), f.return = x, f;
          case Me:
            var L = f._init;
            return M(x, L(f._payload), y);
        }
        if (tn(f) || B(f)) return f = br(f, x.mode, y, null), f.return = x, f;
        El(x, f);
      }
      return null;
    }
    function S(x, f, y, L) {
      var H = f !== null ? f.key : null;
      if (typeof y == "string" && y !== "" || typeof y == "number") return H !== null ? null : d(x, f, "" + y, L);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case ne:
            return y.key === H ? p(x, f, y, L) : null;
          case Z:
            return y.key === H ? k(x, f, y, L) : null;
          case Me:
            return H = y._init, S(
              x,
              f,
              H(y._payload),
              L
            );
        }
        if (tn(y) || B(y)) return H !== null ? null : z(x, f, y, L, null);
        El(x, y);
      }
      return null;
    }
    function O(x, f, y, L, H) {
      if (typeof L == "string" && L !== "" || typeof L == "number") return x = x.get(y) || null, d(f, x, "" + L, H);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ne:
            return x = x.get(L.key === null ? y : L.key) || null, p(f, x, L, H);
          case Z:
            return x = x.get(L.key === null ? y : L.key) || null, k(f, x, L, H);
          case Me:
            var q = L._init;
            return O(x, f, y, q(L._payload), H);
        }
        if (tn(L) || B(L)) return x = x.get(y) || null, z(f, x, L, H, null);
        El(f, L);
      }
      return null;
    }
    function $(x, f, y, L) {
      for (var H = null, q = null, G = f, J = f = 0, Ie = null; G !== null && J < y.length; J++) {
        G.index > J ? (Ie = G, G = null) : Ie = G.sibling;
        var ce = S(x, G, y[J], L);
        if (ce === null) {
          G === null && (G = Ie);
          break;
        }
        e && G && ce.alternate === null && t(x, G), f = o(ce, f, J), q === null ? H = ce : q.sibling = ce, q = ce, G = Ie;
      }
      if (J === y.length) return r(x, G), be && mr(x, J), H;
      if (G === null) {
        for (; J < y.length; J++) G = M(x, y[J], L), G !== null && (f = o(G, f, J), q === null ? H = G : q.sibling = G, q = G);
        return be && mr(x, J), H;
      }
      for (G = n(x, G); J < y.length; J++) Ie = O(G, x, J, y[J], L), Ie !== null && (e && Ie.alternate !== null && G.delete(Ie.key === null ? J : Ie.key), f = o(Ie, f, J), q === null ? H = Ie : q.sibling = Ie, q = Ie);
      return e && G.forEach(function(or) {
        return t(x, or);
      }), be && mr(x, J), H;
    }
    function U(x, f, y, L) {
      var H = B(y);
      if (typeof H != "function") throw Error(u(150));
      if (y = H.call(y), y == null) throw Error(u(151));
      for (var q = H = null, G = f, J = f = 0, Ie = null, ce = y.next(); G !== null && !ce.done; J++, ce = y.next()) {
        G.index > J ? (Ie = G, G = null) : Ie = G.sibling;
        var or = S(x, G, ce.value, L);
        if (or === null) {
          G === null && (G = Ie);
          break;
        }
        e && G && or.alternate === null && t(x, G), f = o(or, f, J), q === null ? H = or : q.sibling = or, q = or, G = Ie;
      }
      if (ce.done) return r(
        x,
        G
      ), be && mr(x, J), H;
      if (G === null) {
        for (; !ce.done; J++, ce = y.next()) ce = M(x, ce.value, L), ce !== null && (f = o(ce, f, J), q === null ? H = ce : q.sibling = ce, q = ce);
        return be && mr(x, J), H;
      }
      for (G = n(x, G); !ce.done; J++, ce = y.next()) ce = O(G, x, J, ce.value, L), ce !== null && (e && ce.alternate !== null && G.delete(ce.key === null ? J : ce.key), f = o(ce, f, J), q === null ? H = ce : q.sibling = ce, q = ce);
      return e && G.forEach(function(rf) {
        return t(x, rf);
      }), be && mr(x, J), H;
    }
    function Ne(x, f, y, L) {
      if (typeof y == "object" && y !== null && y.type === fe && y.key === null && (y = y.props.children), typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case ne:
            e: {
              for (var H = y.key, q = f; q !== null; ) {
                if (q.key === H) {
                  if (H = y.type, H === fe) {
                    if (q.tag === 7) {
                      r(x, q.sibling), f = l(q, y.props.children), f.return = x, x = f;
                      break e;
                    }
                  } else if (q.elementType === H || typeof H == "object" && H !== null && H.$$typeof === Me && qs(H) === q.type) {
                    r(x, q.sibling), f = l(q, y.props), f.ref = Nn(x, q, y), f.return = x, x = f;
                    break e;
                  }
                  r(x, q);
                  break;
                } else t(x, q);
                q = q.sibling;
              }
              y.type === fe ? (f = br(y.props.children, x.mode, L, y.key), f.return = x, x = f) : (L = Yl(y.type, y.key, y.props, null, x.mode, L), L.ref = Nn(x, f, y), L.return = x, x = L);
            }
            return s(x);
          case Z:
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
              f = Xi(y, x.mode, L), f.return = x, x = f;
            }
            return s(x);
          case Me:
            return q = y._init, Ne(x, f, q(y._payload), L);
        }
        if (tn(y)) return $(x, f, y, L);
        if (B(y)) return U(x, f, y, L);
        El(x, y);
      }
      return typeof y == "string" && y !== "" || typeof y == "number" ? (y = "" + y, f !== null && f.tag === 6 ? (r(x, f.sibling), f = l(f, y), f.return = x, x = f) : (r(x, f), f = Yi(y, x.mode, L), f.return = x, x = f), s(x)) : r(x, f);
    }
    return Ne;
  }
  var Br = Gs(!0), Ks = Gs(!1), Nl = Gt(null), zl = null, Wr = null, ii = null;
  function ai() {
    ii = Wr = zl = null;
  }
  function si(e) {
    var t = Nl.current;
    ve(Nl), e._currentValue = t;
  }
  function ui(e, t, r) {
    for (; e !== null; ) {
      var n = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, n !== null && (n.childLanes |= t)) : n !== null && (n.childLanes & t) !== t && (n.childLanes |= t), e === r) break;
      e = e.return;
    }
  }
  function Qr(e, t) {
    zl = e, ii = Wr = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ye = !0), e.firstContext = null);
  }
  function st(e) {
    var t = e._currentValue;
    if (ii !== e) if (e = { context: e, memoizedValue: t, next: null }, Wr === null) {
      if (zl === null) throw Error(u(308));
      Wr = e, zl.dependencies = { lanes: 0, firstContext: e };
    } else Wr = Wr.next = e;
    return t;
  }
  var hr = null;
  function ci(e) {
    hr === null ? hr = [e] : hr.push(e);
  }
  function Ys(e, t, r, n) {
    var l = t.interleaved;
    return l === null ? (r.next = r, ci(t)) : (r.next = l.next, l.next = r), t.interleaved = r, Lt(e, n);
  }
  function Lt(e, t) {
    e.lanes |= t;
    var r = e.alternate;
    for (r !== null && (r.lanes |= t), r = e, e = e.return; e !== null; ) e.childLanes |= t, r = e.alternate, r !== null && (r.childLanes |= t), r = e, e = e.return;
    return r.tag === 3 ? r.stateNode : null;
  }
  var Xt = !1;
  function di(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Xs(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Tt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Zt(e, t, r) {
    var n = e.updateQueue;
    if (n === null) return null;
    if (n = n.shared, (ae & 2) !== 0) {
      var l = n.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), n.pending = t, Lt(e, r);
    }
    return l = n.interleaved, l === null ? (t.next = t, ci(n)) : (t.next = l.next, l.next = t), n.interleaved = t, Lt(e, r);
  }
  function _l(e, t, r) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (r & 4194240) !== 0)) {
      var n = t.lanes;
      n &= e.pendingLanes, r |= n, t.lanes = r, Co(e, r);
    }
  }
  function Zs(e, t) {
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
  function Ml(e, t, r, n) {
    var l = e.updateQueue;
    Xt = !1;
    var o = l.firstBaseUpdate, s = l.lastBaseUpdate, d = l.shared.pending;
    if (d !== null) {
      l.shared.pending = null;
      var p = d, k = p.next;
      p.next = null, s === null ? o = k : s.next = k, s = p;
      var z = e.alternate;
      z !== null && (z = z.updateQueue, d = z.lastBaseUpdate, d !== s && (d === null ? z.firstBaseUpdate = k : d.next = k, z.lastBaseUpdate = p));
    }
    if (o !== null) {
      var M = l.baseState;
      s = 0, z = k = p = null, d = o;
      do {
        var S = d.lane, O = d.eventTime;
        if ((n & S) === S) {
          z !== null && (z = z.next = {
            eventTime: O,
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          });
          e: {
            var $ = e, U = d;
            switch (S = t, O = r, U.tag) {
              case 1:
                if ($ = U.payload, typeof $ == "function") {
                  M = $.call(O, M, S);
                  break e;
                }
                M = $;
                break e;
              case 3:
                $.flags = $.flags & -65537 | 128;
              case 0:
                if ($ = U.payload, S = typeof $ == "function" ? $.call(O, M, S) : $, S == null) break e;
                M = D({}, M, S);
                break e;
              case 2:
                Xt = !0;
            }
          }
          d.callback !== null && d.lane !== 0 && (e.flags |= 64, S = l.effects, S === null ? l.effects = [d] : S.push(d));
        } else O = { eventTime: O, lane: S, tag: d.tag, payload: d.payload, callback: d.callback, next: null }, z === null ? (k = z = O, p = M) : z = z.next = O, s |= S;
        if (d = d.next, d === null) {
          if (d = l.shared.pending, d === null) break;
          S = d, d = S.next, S.next = null, l.lastBaseUpdate = S, l.shared.pending = null;
        }
      } while (!0);
      if (z === null && (p = M), l.baseState = p, l.firstBaseUpdate = k, l.lastBaseUpdate = z, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          s |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      vr |= s, e.lanes = s, e.memoizedState = M;
    }
  }
  function Js(e, t, r) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var n = e[t], l = n.callback;
      if (l !== null) {
        if (n.callback = null, n = r, typeof l != "function") throw Error(u(191, l));
        l.call(n);
      }
    }
  }
  var zn = {}, jt = Gt(zn), _n = Gt(zn), Mn = Gt(zn);
  function gr(e) {
    if (e === zn) throw Error(u(174));
    return e;
  }
  function pi(e, t) {
    switch (he(Mn, t), he(_n, e), he(jt, zn), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : fo(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = fo(t, e);
    }
    ve(jt), he(jt, t);
  }
  function qr() {
    ve(jt), ve(_n), ve(Mn);
  }
  function eu(e) {
    gr(Mn.current);
    var t = gr(jt.current), r = fo(t, e.type);
    t !== r && (he(_n, e), he(jt, r));
  }
  function fi(e) {
    _n.current === e && (ve(jt), ve(_n));
  }
  var je = Gt(0);
  function Pl(e) {
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
  var mi = [];
  function hi() {
    for (var e = 0; e < mi.length; e++) mi[e]._workInProgressVersionPrimary = null;
    mi.length = 0;
  }
  var Ll = K.ReactCurrentDispatcher, gi = K.ReactCurrentBatchConfig, xr = 0, Se = null, Pe = null, Te = null, Tl = !1, Pn = !1, Ln = 0, Sp = 0;
  function Ve() {
    throw Error(u(321));
  }
  function xi(e, t) {
    if (t === null) return !1;
    for (var r = 0; r < t.length && r < e.length; r++) if (!ft(e[r], t[r])) return !1;
    return !0;
  }
  function vi(e, t, r, n, l, o) {
    if (xr = o, Se = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Ll.current = e === null || e.memoizedState === null ? zp : _p, e = r(n, l), Pn) {
      o = 0;
      do {
        if (Pn = !1, Ln = 0, 25 <= o) throw Error(u(301));
        o += 1, Te = Pe = null, t.updateQueue = null, Ll.current = Mp, e = r(n, l);
      } while (Pn);
    }
    if (Ll.current = Ol, t = Pe !== null && Pe.next !== null, xr = 0, Te = Pe = Se = null, Tl = !1, t) throw Error(u(300));
    return e;
  }
  function yi() {
    var e = Ln !== 0;
    return Ln = 0, e;
  }
  function St() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Te === null ? Se.memoizedState = Te = e : Te = Te.next = e, Te;
  }
  function ut() {
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
  function Tn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function wi(e) {
    var t = ut(), r = t.queue;
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
        var z = k.lane;
        if ((xr & z) === z) p !== null && (p = p.next = { lane: 0, action: k.action, hasEagerState: k.hasEagerState, eagerState: k.eagerState, next: null }), n = k.hasEagerState ? k.eagerState : e(n, k.action);
        else {
          var M = {
            lane: z,
            action: k.action,
            hasEagerState: k.hasEagerState,
            eagerState: k.eagerState,
            next: null
          };
          p === null ? (d = p = M, s = n) : p = p.next = M, Se.lanes |= z, vr |= z;
        }
        k = k.next;
      } while (k !== null && k !== o);
      p === null ? s = n : p.next = d, ft(n, t.memoizedState) || (Ye = !0), t.memoizedState = n, t.baseState = s, t.baseQueue = p, r.lastRenderedState = n;
    }
    if (e = r.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, Se.lanes |= o, vr |= o, l = l.next;
      while (l !== e);
    } else l === null && (r.lanes = 0);
    return [t.memoizedState, r.dispatch];
  }
  function ki(e) {
    var t = ut(), r = t.queue;
    if (r === null) throw Error(u(311));
    r.lastRenderedReducer = e;
    var n = r.dispatch, l = r.pending, o = t.memoizedState;
    if (l !== null) {
      r.pending = null;
      var s = l = l.next;
      do
        o = e(o, s.action), s = s.next;
      while (s !== l);
      ft(o, t.memoizedState) || (Ye = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), r.lastRenderedState = o;
    }
    return [o, n];
  }
  function tu() {
  }
  function ru(e, t) {
    var r = Se, n = ut(), l = t(), o = !ft(n.memoizedState, l);
    if (o && (n.memoizedState = l, Ye = !0), n = n.queue, bi(ou.bind(null, r, n, e), [e]), n.getSnapshot !== t || o || Te !== null && Te.memoizedState.tag & 1) {
      if (r.flags |= 2048, Rn(9, lu.bind(null, r, n, l, t), void 0, null), Re === null) throw Error(u(349));
      (xr & 30) !== 0 || nu(r, t, l);
    }
    return l;
  }
  function nu(e, t, r) {
    e.flags |= 16384, e = { getSnapshot: t, value: r }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.stores = [e]) : (r = t.stores, r === null ? t.stores = [e] : r.push(e));
  }
  function lu(e, t, r, n) {
    t.value = r, t.getSnapshot = n, iu(t) && au(e);
  }
  function ou(e, t, r) {
    return r(function() {
      iu(t) && au(e);
    });
  }
  function iu(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var r = t();
      return !ft(e, r);
    } catch {
      return !0;
    }
  }
  function au(e) {
    var t = Lt(e, 1);
    t !== null && vt(t, e, 1, -1);
  }
  function su(e) {
    var t = St();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Tn, lastRenderedState: e }, t.queue = e, e = e.dispatch = Np.bind(null, Se, e), [t.memoizedState, e];
  }
  function Rn(e, t, r, n) {
    return e = { tag: e, create: t, destroy: r, deps: n, next: null }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.lastEffect = e.next = e) : (r = t.lastEffect, r === null ? t.lastEffect = e.next = e : (n = r.next, r.next = e, e.next = n, t.lastEffect = e)), e;
  }
  function uu() {
    return ut().memoizedState;
  }
  function Rl(e, t, r, n) {
    var l = St();
    Se.flags |= e, l.memoizedState = Rn(1 | t, r, void 0, n === void 0 ? null : n);
  }
  function Il(e, t, r, n) {
    var l = ut();
    n = n === void 0 ? null : n;
    var o = void 0;
    if (Pe !== null) {
      var s = Pe.memoizedState;
      if (o = s.destroy, n !== null && xi(n, s.deps)) {
        l.memoizedState = Rn(t, r, o, n);
        return;
      }
    }
    Se.flags |= e, l.memoizedState = Rn(1 | t, r, o, n);
  }
  function cu(e, t) {
    return Rl(8390656, 8, e, t);
  }
  function bi(e, t) {
    return Il(2048, 8, e, t);
  }
  function du(e, t) {
    return Il(4, 2, e, t);
  }
  function pu(e, t) {
    return Il(4, 4, e, t);
  }
  function fu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function mu(e, t, r) {
    return r = r != null ? r.concat([e]) : null, Il(4, 4, fu.bind(null, t, e), r);
  }
  function ji() {
  }
  function hu(e, t) {
    var r = ut();
    t = t === void 0 ? null : t;
    var n = r.memoizedState;
    return n !== null && t !== null && xi(t, n[1]) ? n[0] : (r.memoizedState = [e, t], e);
  }
  function gu(e, t) {
    var r = ut();
    t = t === void 0 ? null : t;
    var n = r.memoizedState;
    return n !== null && t !== null && xi(t, n[1]) ? n[0] : (e = e(), r.memoizedState = [e, t], e);
  }
  function xu(e, t, r) {
    return (xr & 21) === 0 ? (e.baseState && (e.baseState = !1, Ye = !0), e.memoizedState = r) : (ft(r, t) || (r = qa(), Se.lanes |= r, vr |= r, e.baseState = !0), t);
  }
  function Cp(e, t) {
    var r = pe;
    pe = r !== 0 && 4 > r ? r : 4, e(!0);
    var n = gi.transition;
    gi.transition = {};
    try {
      e(!1), t();
    } finally {
      pe = r, gi.transition = n;
    }
  }
  function vu() {
    return ut().memoizedState;
  }
  function Ep(e, t, r) {
    var n = rr(e);
    if (r = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null }, yu(e)) wu(t, r);
    else if (r = Ys(e, t, r, n), r !== null) {
      var l = qe();
      vt(r, e, n, l), ku(r, t, n);
    }
  }
  function Np(e, t, r) {
    var n = rr(e), l = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null };
    if (yu(e)) wu(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var s = t.lastRenderedState, d = o(s, r);
        if (l.hasEagerState = !0, l.eagerState = d, ft(d, s)) {
          var p = t.interleaved;
          p === null ? (l.next = l, ci(t)) : (l.next = p.next, p.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      r = Ys(e, t, l, n), r !== null && (l = qe(), vt(r, e, n, l), ku(r, t, n));
    }
  }
  function yu(e) {
    var t = e.alternate;
    return e === Se || t !== null && t === Se;
  }
  function wu(e, t) {
    Pn = Tl = !0;
    var r = e.pending;
    r === null ? t.next = t : (t.next = r.next, r.next = t), e.pending = t;
  }
  function ku(e, t, r) {
    if ((r & 4194240) !== 0) {
      var n = t.lanes;
      n &= e.pendingLanes, r |= n, t.lanes = r, Co(e, r);
    }
  }
  var Ol = { readContext: st, useCallback: Ve, useContext: Ve, useEffect: Ve, useImperativeHandle: Ve, useInsertionEffect: Ve, useLayoutEffect: Ve, useMemo: Ve, useReducer: Ve, useRef: Ve, useState: Ve, useDebugValue: Ve, useDeferredValue: Ve, useTransition: Ve, useMutableSource: Ve, useSyncExternalStore: Ve, useId: Ve, unstable_isNewReconciler: !1 }, zp = { readContext: st, useCallback: function(e, t) {
    return St().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: st, useEffect: cu, useImperativeHandle: function(e, t, r) {
    return r = r != null ? r.concat([e]) : null, Rl(
      4194308,
      4,
      fu.bind(null, t, e),
      r
    );
  }, useLayoutEffect: function(e, t) {
    return Rl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Rl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var r = St();
    return t = t === void 0 ? null : t, e = e(), r.memoizedState = [e, t], e;
  }, useReducer: function(e, t, r) {
    var n = St();
    return t = r !== void 0 ? r(t) : t, n.memoizedState = n.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, n.queue = e, e = e.dispatch = Ep.bind(null, Se, e), [n.memoizedState, e];
  }, useRef: function(e) {
    var t = St();
    return e = { current: e }, t.memoizedState = e;
  }, useState: su, useDebugValue: ji, useDeferredValue: function(e) {
    return St().memoizedState = e;
  }, useTransition: function() {
    var e = su(!1), t = e[0];
    return e = Cp.bind(null, e[1]), St().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, r) {
    var n = Se, l = St();
    if (be) {
      if (r === void 0) throw Error(u(407));
      r = r();
    } else {
      if (r = t(), Re === null) throw Error(u(349));
      (xr & 30) !== 0 || nu(n, t, r);
    }
    l.memoizedState = r;
    var o = { value: r, getSnapshot: t };
    return l.queue = o, cu(ou.bind(
      null,
      n,
      o,
      e
    ), [e]), n.flags |= 2048, Rn(9, lu.bind(null, n, o, r, t), void 0, null), r;
  }, useId: function() {
    var e = St(), t = Re.identifierPrefix;
    if (be) {
      var r = Pt, n = Mt;
      r = (n & ~(1 << 32 - pt(n) - 1)).toString(32) + r, t = ":" + t + "R" + r, r = Ln++, 0 < r && (t += "H" + r.toString(32)), t += ":";
    } else r = Sp++, t = ":" + t + "r" + r.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, _p = {
    readContext: st,
    useCallback: hu,
    useContext: st,
    useEffect: bi,
    useImperativeHandle: mu,
    useInsertionEffect: du,
    useLayoutEffect: pu,
    useMemo: gu,
    useReducer: wi,
    useRef: uu,
    useState: function() {
      return wi(Tn);
    },
    useDebugValue: ji,
    useDeferredValue: function(e) {
      var t = ut();
      return xu(t, Pe.memoizedState, e);
    },
    useTransition: function() {
      var e = wi(Tn)[0], t = ut().memoizedState;
      return [e, t];
    },
    useMutableSource: tu,
    useSyncExternalStore: ru,
    useId: vu,
    unstable_isNewReconciler: !1
  }, Mp = { readContext: st, useCallback: hu, useContext: st, useEffect: bi, useImperativeHandle: mu, useInsertionEffect: du, useLayoutEffect: pu, useMemo: gu, useReducer: ki, useRef: uu, useState: function() {
    return ki(Tn);
  }, useDebugValue: ji, useDeferredValue: function(e) {
    var t = ut();
    return Pe === null ? t.memoizedState = e : xu(t, Pe.memoizedState, e);
  }, useTransition: function() {
    var e = ki(Tn)[0], t = ut().memoizedState;
    return [e, t];
  }, useMutableSource: tu, useSyncExternalStore: ru, useId: vu, unstable_isNewReconciler: !1 };
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
  var Dl = { isMounted: function(e) {
    return (e = e._reactInternals) ? cr(e) === e : !1;
  }, enqueueSetState: function(e, t, r) {
    e = e._reactInternals;
    var n = qe(), l = rr(e), o = Tt(n, l);
    o.payload = t, r != null && (o.callback = r), t = Zt(e, o, l), t !== null && (vt(t, e, l, n), _l(t, e, l));
  }, enqueueReplaceState: function(e, t, r) {
    e = e._reactInternals;
    var n = qe(), l = rr(e), o = Tt(n, l);
    o.tag = 1, o.payload = t, r != null && (o.callback = r), t = Zt(e, o, l), t !== null && (vt(t, e, l, n), _l(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var r = qe(), n = rr(e), l = Tt(r, n);
    l.tag = 2, t != null && (l.callback = t), t = Zt(e, l, n), t !== null && (vt(t, e, n, r), _l(t, e, n));
  } };
  function bu(e, t, r, n, l, o, s) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(n, o, s) : t.prototype && t.prototype.isPureReactComponent ? !wn(r, n) || !wn(l, o) : !0;
  }
  function ju(e, t, r) {
    var n = !1, l = Kt, o = t.contextType;
    return typeof o == "object" && o !== null ? o = st(o) : (l = Ke(t) ? pr : He.current, n = t.contextTypes, o = (n = n != null) ? $r(e, l) : Kt), t = new t(r, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Dl, e.stateNode = t, t._reactInternals = e, n && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function Su(e, t, r, n) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(r, n), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(r, n), t.state !== e && Dl.enqueueReplaceState(t, t.state, null);
  }
  function Ci(e, t, r, n) {
    var l = e.stateNode;
    l.props = r, l.state = e.memoizedState, l.refs = {}, di(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = st(o) : (o = Ke(t) ? pr : He.current, l.context = $r(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (Si(e, t, o, r), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Dl.enqueueReplaceState(l, l.state, null), Ml(e, r, l, n), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Gr(e, t) {
    try {
      var r = "", n = t;
      do
        r += se(n), n = n.return;
      while (n);
      var l = r;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function Ei(e, t, r) {
    return { value: e, source: null, stack: r ?? null, digest: t ?? null };
  }
  function Ni(e, t) {
    try {
      console.error(t.value);
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  var Pp = typeof WeakMap == "function" ? WeakMap : Map;
  function Cu(e, t, r) {
    r = Tt(-1, r), r.tag = 3, r.payload = { element: null };
    var n = t.value;
    return r.callback = function() {
      Bl || (Bl = !0, Hi = n), Ni(e, t);
    }, r;
  }
  function Eu(e, t, r) {
    r = Tt(-1, r), r.tag = 3;
    var n = e.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var l = t.value;
      r.payload = function() {
        return n(l);
      }, r.callback = function() {
        Ni(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (r.callback = function() {
      Ni(e, t), typeof n != "function" && (er === null ? er = /* @__PURE__ */ new Set([this]) : er.add(this));
      var s = t.stack;
      this.componentDidCatch(t.value, { componentStack: s !== null ? s : "" });
    }), r;
  }
  function Nu(e, t, r) {
    var n = e.pingCache;
    if (n === null) {
      n = e.pingCache = new Pp();
      var l = /* @__PURE__ */ new Set();
      n.set(t, l);
    } else l = n.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), n.set(t, l));
    l.has(r) || (l.add(r), e = Wp.bind(null, e, t, r), t.then(e, e));
  }
  function zu(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function _u(e, t, r, n, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, r.flags |= 131072, r.flags &= -52805, r.tag === 1 && (r.alternate === null ? r.tag = 17 : (t = Tt(-1, 1), t.tag = 2, Zt(r, t, 1))), r.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Lp = K.ReactCurrentOwner, Ye = !1;
  function Qe(e, t, r, n) {
    t.child = e === null ? Ks(t, null, r, n) : Br(t, e.child, r, n);
  }
  function Mu(e, t, r, n, l) {
    r = r.render;
    var o = t.ref;
    return Qr(t, l), n = vi(e, t, r, n, o, l), r = yi(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (be && r && ti(t), t.flags |= 1, Qe(e, t, n, l), t.child);
  }
  function Pu(e, t, r, n, l) {
    if (e === null) {
      var o = r.type;
      return typeof o == "function" && !Ki(o) && o.defaultProps === void 0 && r.compare === null && r.defaultProps === void 0 ? (t.tag = 15, t.type = o, Lu(e, t, o, n, l)) : (e = Yl(r.type, null, n, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var s = o.memoizedProps;
      if (r = r.compare, r = r !== null ? r : wn, r(s, n) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = lr(o, n), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Lu(e, t, r, n, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (wn(o, n) && e.ref === t.ref) if (Ye = !1, t.pendingProps = n = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ye = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return zi(e, t, r, n, l);
  }
  function Tu(e, t, r) {
    var n = t.pendingProps, l = n.children, o = e !== null ? e.memoizedState : null;
    if (n.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, he(Yr, ot), ot |= r;
    else {
      if ((r & 1073741824) === 0) return e = o !== null ? o.baseLanes | r : r, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, he(Yr, ot), ot |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, n = o !== null ? o.baseLanes : r, he(Yr, ot), ot |= n;
    }
    else o !== null ? (n = o.baseLanes | r, t.memoizedState = null) : n = r, he(Yr, ot), ot |= n;
    return Qe(e, t, l, r), t.child;
  }
  function Ru(e, t) {
    var r = t.ref;
    (e === null && r !== null || e !== null && e.ref !== r) && (t.flags |= 512, t.flags |= 2097152);
  }
  function zi(e, t, r, n, l) {
    var o = Ke(r) ? pr : He.current;
    return o = $r(t, o), Qr(t, l), r = vi(e, t, r, n, o, l), n = yi(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (be && n && ti(t), t.flags |= 1, Qe(e, t, r, l), t.child);
  }
  function Iu(e, t, r, n, l) {
    if (Ke(r)) {
      var o = !0;
      kl(t);
    } else o = !1;
    if (Qr(t, l), t.stateNode === null) Fl(e, t), ju(t, r, n), Ci(t, r, n, l), n = !0;
    else if (e === null) {
      var s = t.stateNode, d = t.memoizedProps;
      s.props = d;
      var p = s.context, k = r.contextType;
      typeof k == "object" && k !== null ? k = st(k) : (k = Ke(r) ? pr : He.current, k = $r(t, k));
      var z = r.getDerivedStateFromProps, M = typeof z == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      M || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (d !== n || p !== k) && Su(t, s, n, k), Xt = !1;
      var S = t.memoizedState;
      s.state = S, Ml(t, n, s, l), p = t.memoizedState, d !== n || S !== p || Ge.current || Xt ? (typeof z == "function" && (Si(t, r, z, n), p = t.memoizedState), (d = Xt || bu(t, r, d, n, S, p, k)) ? (M || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = n, t.memoizedState = p), s.props = n, s.state = p, s.context = k, n = d) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), n = !1);
    } else {
      s = t.stateNode, Xs(e, t), d = t.memoizedProps, k = t.type === t.elementType ? d : ht(t.type, d), s.props = k, M = t.pendingProps, S = s.context, p = r.contextType, typeof p == "object" && p !== null ? p = st(p) : (p = Ke(r) ? pr : He.current, p = $r(t, p));
      var O = r.getDerivedStateFromProps;
      (z = typeof O == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (d !== M || S !== p) && Su(t, s, n, p), Xt = !1, S = t.memoizedState, s.state = S, Ml(t, n, s, l);
      var $ = t.memoizedState;
      d !== M || S !== $ || Ge.current || Xt ? (typeof O == "function" && (Si(t, r, O, n), $ = t.memoizedState), (k = Xt || bu(t, r, k, n, S, $, p) || !1) ? (z || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(n, $, p), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(n, $, p)), typeof s.componentDidUpdate == "function" && (t.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || d === e.memoizedProps && S === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && S === e.memoizedState || (t.flags |= 1024), t.memoizedProps = n, t.memoizedState = $), s.props = n, s.state = $, s.context = p, n = k) : (typeof s.componentDidUpdate != "function" || d === e.memoizedProps && S === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && S === e.memoizedState || (t.flags |= 1024), n = !1);
    }
    return _i(e, t, r, n, o, l);
  }
  function _i(e, t, r, n, l, o) {
    Ru(e, t);
    var s = (t.flags & 128) !== 0;
    if (!n && !s) return l && $s(t, r, !1), Rt(e, t, o);
    n = t.stateNode, Lp.current = t;
    var d = s && typeof r.getDerivedStateFromError != "function" ? null : n.render();
    return t.flags |= 1, e !== null && s ? (t.child = Br(t, e.child, null, o), t.child = Br(t, null, d, o)) : Qe(e, t, d, o), t.memoizedState = n.state, l && $s(t, r, !0), t.child;
  }
  function Ou(e) {
    var t = e.stateNode;
    t.pendingContext ? As(e, t.pendingContext, t.pendingContext !== t.context) : t.context && As(e, t.context, !1), pi(e, t.containerInfo);
  }
  function Du(e, t, r, n, l) {
    return Vr(), oi(l), t.flags |= 256, Qe(e, t, r, n), t.child;
  }
  var Mi = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Pi(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Au(e, t, r) {
    var n = t.pendingProps, l = je.current, o = !1, s = (t.flags & 128) !== 0, d;
    if ((d = s) || (d = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), d ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), he(je, l & 1), e === null)
      return li(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (s = n.children, e = n.fallback, o ? (n = t.mode, o = t.child, s = { mode: "hidden", children: s }, (n & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = s) : o = Xl(s, n, 0, null), e = br(e, n, r, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = Pi(r), t.memoizedState = Mi, e) : Li(t, s));
    if (l = e.memoizedState, l !== null && (d = l.dehydrated, d !== null)) return Tp(e, t, s, n, d, l, r);
    if (o) {
      o = n.fallback, s = t.mode, l = e.child, d = l.sibling;
      var p = { mode: "hidden", children: n.children };
      return (s & 1) === 0 && t.child !== l ? (n = t.child, n.childLanes = 0, n.pendingProps = p, t.deletions = null) : (n = lr(l, p), n.subtreeFlags = l.subtreeFlags & 14680064), d !== null ? o = lr(d, o) : (o = br(o, s, r, null), o.flags |= 2), o.return = t, n.return = t, n.sibling = o, t.child = n, n = o, o = t.child, s = e.child.memoizedState, s = s === null ? Pi(r) : { baseLanes: s.baseLanes | r, cachePool: null, transitions: s.transitions }, o.memoizedState = s, o.childLanes = e.childLanes & ~r, t.memoizedState = Mi, n;
    }
    return o = e.child, e = o.sibling, n = lr(o, { mode: "visible", children: n.children }), (t.mode & 1) === 0 && (n.lanes = r), n.return = t, n.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = n, t.memoizedState = null, n;
  }
  function Li(e, t) {
    return t = Xl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Al(e, t, r, n) {
    return n !== null && oi(n), Br(t, e.child, null, r), e = Li(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Tp(e, t, r, n, l, o, s) {
    if (r)
      return t.flags & 256 ? (t.flags &= -257, n = Ei(Error(u(422))), Al(e, t, s, n)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = n.fallback, l = t.mode, n = Xl({ mode: "visible", children: n.children }, l, 0, null), o = br(o, l, s, null), o.flags |= 2, n.return = t, o.return = t, n.sibling = o, t.child = n, (t.mode & 1) !== 0 && Br(t, e.child, null, s), t.child.memoizedState = Pi(s), t.memoizedState = Mi, o);
    if ((t.mode & 1) === 0) return Al(e, t, s, null);
    if (l.data === "$!") {
      if (n = l.nextSibling && l.nextSibling.dataset, n) var d = n.dgst;
      return n = d, o = Error(u(419)), n = Ei(o, n, void 0), Al(e, t, s, n);
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
        l = (l & (n.suspendedLanes | s)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Lt(e, l), vt(n, e, l, -1));
      }
      return Gi(), n = Ei(Error(u(421))), Al(e, t, s, n);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Qp.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, lt = qt(l.nextSibling), nt = t, be = !0, mt = null, e !== null && (it[at++] = Mt, it[at++] = Pt, it[at++] = fr, Mt = e.id, Pt = e.overflow, fr = t), t = Li(t, n.children), t.flags |= 4096, t);
  }
  function Fu(e, t, r) {
    e.lanes |= t;
    var n = e.alternate;
    n !== null && (n.lanes |= t), ui(e.return, t, r);
  }
  function Ti(e, t, r, n, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: n, tail: r, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = n, o.tail = r, o.tailMode = l);
  }
  function $u(e, t, r) {
    var n = t.pendingProps, l = n.revealOrder, o = n.tail;
    if (Qe(e, t, n.children, r), n = je.current, (n & 2) !== 0) n = n & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Fu(e, r, t);
        else if (e.tag === 19) Fu(e, r, t);
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
    if (he(je, n), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (r = t.child, l = null; r !== null; ) e = r.alternate, e !== null && Pl(e) === null && (l = r), r = r.sibling;
        r = l, r === null ? (l = t.child, t.child = null) : (l = r.sibling, r.sibling = null), Ti(t, !1, l, r, o);
        break;
      case "backwards":
        for (r = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Pl(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = r, r = l, l = e;
        }
        Ti(t, !0, r, null, o);
        break;
      case "together":
        Ti(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Fl(e, t) {
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
  function Rp(e, t, r) {
    switch (t.tag) {
      case 3:
        Ou(t), Vr();
        break;
      case 5:
        eu(t);
        break;
      case 1:
        Ke(t.type) && kl(t);
        break;
      case 4:
        pi(t, t.stateNode.containerInfo);
        break;
      case 10:
        var n = t.type._context, l = t.memoizedProps.value;
        he(Nl, n._currentValue), n._currentValue = l;
        break;
      case 13:
        if (n = t.memoizedState, n !== null)
          return n.dehydrated !== null ? (he(je, je.current & 1), t.flags |= 128, null) : (r & t.child.childLanes) !== 0 ? Au(e, t, r) : (he(je, je.current & 1), e = Rt(e, t, r), e !== null ? e.sibling : null);
        he(je, je.current & 1);
        break;
      case 19:
        if (n = (r & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (n) return $u(e, t, r);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), he(je, je.current), n) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Tu(e, t, r);
    }
    return Rt(e, t, r);
  }
  var Uu, Ri, Hu, Vu;
  Uu = function(e, t) {
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
  }, Ri = function() {
  }, Hu = function(e, t, r, n) {
    var l = e.memoizedProps;
    if (l !== n) {
      e = t.stateNode, gr(jt.current);
      var o = null;
      switch (r) {
        case "input":
          l = so(e, l), n = so(e, n), o = [];
          break;
        case "select":
          l = D({}, l, { value: void 0 }), n = D({}, n, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = po(e, l), n = po(e, n), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof n.onClick == "function" && (e.onclick = vl);
      }
      mo(r, n);
      var s;
      r = null;
      for (k in l) if (!n.hasOwnProperty(k) && l.hasOwnProperty(k) && l[k] != null) if (k === "style") {
        var d = l[k];
        for (s in d) d.hasOwnProperty(s) && (r || (r = {}), r[s] = "");
      } else k !== "dangerouslySetInnerHTML" && k !== "children" && k !== "suppressContentEditableWarning" && k !== "suppressHydrationWarning" && k !== "autoFocus" && (w.hasOwnProperty(k) ? o || (o = []) : (o = o || []).push(k, null));
      for (k in n) {
        var p = n[k];
        if (d = l != null ? l[k] : void 0, n.hasOwnProperty(k) && p !== d && (p != null || d != null)) if (k === "style") if (d) {
          for (s in d) !d.hasOwnProperty(s) || p && p.hasOwnProperty(s) || (r || (r = {}), r[s] = "");
          for (s in p) p.hasOwnProperty(s) && d[s] !== p[s] && (r || (r = {}), r[s] = p[s]);
        } else r || (o || (o = []), o.push(
          k,
          r
        )), r = p;
        else k === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, d = d ? d.__html : void 0, p != null && d !== p && (o = o || []).push(k, p)) : k === "children" ? typeof p != "string" && typeof p != "number" || (o = o || []).push(k, "" + p) : k !== "suppressContentEditableWarning" && k !== "suppressHydrationWarning" && (w.hasOwnProperty(k) ? (p != null && k === "onScroll" && xe("scroll", e), o || d === p || (o = [])) : (o = o || []).push(k, p));
      }
      r && (o = o || []).push("style", r);
      var k = o;
      (t.updateQueue = k) && (t.flags |= 4);
    }
  }, Vu = function(e, t, r, n) {
    r !== n && (t.flags |= 4);
  };
  function In(e, t) {
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
  function Ip(e, t, r) {
    var n = t.pendingProps;
    switch (ri(t), t.tag) {
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
        return Ke(t.type) && wl(), Be(t), null;
      case 3:
        return n = t.stateNode, qr(), ve(Ge), ve(He), hi(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Cl(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (Wi(mt), mt = null))), Ri(e, t), Be(t), null;
      case 5:
        fi(t);
        var l = gr(Mn.current);
        if (r = t.type, e !== null && t.stateNode != null) Hu(e, t, r, n, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!n) {
            if (t.stateNode === null) throw Error(u(166));
            return Be(t), null;
          }
          if (e = gr(jt.current), Cl(t)) {
            n = t.stateNode, r = t.type;
            var o = t.memoizedProps;
            switch (n[bt] = t, n[Cn] = o, e = (t.mode & 1) !== 0, r) {
              case "dialog":
                xe("cancel", n), xe("close", n);
                break;
              case "iframe":
              case "object":
              case "embed":
                xe("load", n);
                break;
              case "video":
              case "audio":
                for (l = 0; l < bn.length; l++) xe(bn[l], n);
                break;
              case "source":
                xe("error", n);
                break;
              case "img":
              case "image":
              case "link":
                xe(
                  "error",
                  n
                ), xe("load", n);
                break;
              case "details":
                xe("toggle", n);
                break;
              case "input":
                ja(n, o), xe("invalid", n);
                break;
              case "select":
                n._wrapperState = { wasMultiple: !!o.multiple }, xe("invalid", n);
                break;
              case "textarea":
                Ea(n, o), xe("invalid", n);
            }
            mo(r, o), l = null;
            for (var s in o) if (o.hasOwnProperty(s)) {
              var d = o[s];
              s === "children" ? typeof d == "string" ? n.textContent !== d && (o.suppressHydrationWarning !== !0 && xl(n.textContent, d, e), l = ["children", d]) : typeof d == "number" && n.textContent !== "" + d && (o.suppressHydrationWarning !== !0 && xl(
                n.textContent,
                d,
                e
              ), l = ["children", "" + d]) : w.hasOwnProperty(s) && d != null && s === "onScroll" && xe("scroll", n);
            }
            switch (r) {
              case "input":
                Gn(n), Ca(n, o, !0);
                break;
              case "textarea":
                Gn(n), za(n);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (n.onclick = vl);
            }
            n = l, t.updateQueue = n, n !== null && (t.flags |= 4);
          } else {
            s = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = _a(r)), e === "http://www.w3.org/1999/xhtml" ? r === "script" ? (e = s.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof n.is == "string" ? e = s.createElement(r, { is: n.is }) : (e = s.createElement(r), r === "select" && (s = e, n.multiple ? s.multiple = !0 : n.size && (s.size = n.size))) : e = s.createElementNS(e, r), e[bt] = t, e[Cn] = n, Uu(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (s = ho(r, n), r) {
                case "dialog":
                  xe("cancel", e), xe("close", e), l = n;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  xe("load", e), l = n;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < bn.length; l++) xe(bn[l], e);
                  l = n;
                  break;
                case "source":
                  xe("error", e), l = n;
                  break;
                case "img":
                case "image":
                case "link":
                  xe(
                    "error",
                    e
                  ), xe("load", e), l = n;
                  break;
                case "details":
                  xe("toggle", e), l = n;
                  break;
                case "input":
                  ja(e, n), l = so(e, n), xe("invalid", e);
                  break;
                case "option":
                  l = n;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!n.multiple }, l = D({}, n, { value: void 0 }), xe("invalid", e);
                  break;
                case "textarea":
                  Ea(e, n), l = po(e, n), xe("invalid", e);
                  break;
                default:
                  l = n;
              }
              mo(r, l), d = l;
              for (o in d) if (d.hasOwnProperty(o)) {
                var p = d[o];
                o === "style" ? La(e, p) : o === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, p != null && Ma(e, p)) : o === "children" ? typeof p == "string" ? (r !== "textarea" || p !== "") && rn(e, p) : typeof p == "number" && rn(e, "" + p) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (w.hasOwnProperty(o) ? p != null && o === "onScroll" && xe("scroll", e) : p != null && A(e, o, p, s));
              }
              switch (r) {
                case "input":
                  Gn(e), Ca(e, n, !1);
                  break;
                case "textarea":
                  Gn(e), za(e);
                  break;
                case "option":
                  n.value != null && e.setAttribute("value", "" + de(n.value));
                  break;
                case "select":
                  e.multiple = !!n.multiple, o = n.value, o != null ? zr(e, !!n.multiple, o, !1) : n.defaultValue != null && zr(
                    e,
                    !!n.multiple,
                    n.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = vl);
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
        if (e && t.stateNode != null) Vu(e, t, e.memoizedProps, n);
        else {
          if (typeof n != "string" && t.stateNode === null) throw Error(u(166));
          if (r = gr(Mn.current), gr(jt.current), Cl(t)) {
            if (n = t.stateNode, r = t.memoizedProps, n[bt] = t, (o = n.nodeValue !== r) && (e = nt, e !== null)) switch (e.tag) {
              case 3:
                xl(n.nodeValue, r, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && xl(n.nodeValue, r, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else n = (r.nodeType === 9 ? r : r.ownerDocument).createTextNode(n), n[bt] = t, t.stateNode = n;
        }
        return Be(t), null;
      case 13:
        if (ve(je), n = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (be && lt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Qs(), Vr(), t.flags |= 98560, o = !1;
          else if (o = Cl(t), n !== null && n.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(u(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(u(317));
              o[bt] = t;
            } else Vr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Be(t), o = !1;
          } else mt !== null && (Wi(mt), mt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = r, t) : (n = n !== null, n !== (e !== null && e.memoizedState !== null) && n && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (je.current & 1) !== 0 ? Le === 0 && (Le = 3) : Gi())), t.updateQueue !== null && (t.flags |= 4), Be(t), null);
      case 4:
        return qr(), Ri(e, t), e === null && jn(t.stateNode.containerInfo), Be(t), null;
      case 10:
        return si(t.type._context), Be(t), null;
      case 17:
        return Ke(t.type) && wl(), Be(t), null;
      case 19:
        if (ve(je), o = t.memoizedState, o === null) return Be(t), null;
        if (n = (t.flags & 128) !== 0, s = o.rendering, s === null) if (n) In(o, !1);
        else {
          if (Le !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (s = Pl(e), s !== null) {
              for (t.flags |= 128, In(o, !1), n = s.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), t.subtreeFlags = 0, n = r, r = t.child; r !== null; ) o = r, e = n, o.flags &= 14680066, s = o.alternate, s === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = s.childLanes, o.lanes = s.lanes, o.child = s.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = s.memoizedProps, o.memoizedState = s.memoizedState, o.updateQueue = s.updateQueue, o.type = s.type, e = s.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), r = r.sibling;
              return he(je, je.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && Ee() > Xr && (t.flags |= 128, n = !0, In(o, !1), t.lanes = 4194304);
        }
        else {
          if (!n) if (e = Pl(s), e !== null) {
            if (t.flags |= 128, n = !0, r = e.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), In(o, !0), o.tail === null && o.tailMode === "hidden" && !s.alternate && !be) return Be(t), null;
          } else 2 * Ee() - o.renderingStartTime > Xr && r !== 1073741824 && (t.flags |= 128, n = !0, In(o, !1), t.lanes = 4194304);
          o.isBackwards ? (s.sibling = t.child, t.child = s) : (r = o.last, r !== null ? r.sibling = s : t.child = s, o.last = s);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Ee(), t.sibling = null, r = je.current, he(je, n ? r & 1 | 2 : r & 1), t) : (Be(t), null);
      case 22:
      case 23:
        return qi(), n = t.memoizedState !== null, e !== null && e.memoizedState !== null !== n && (t.flags |= 8192), n && (t.mode & 1) !== 0 ? (ot & 1073741824) !== 0 && (Be(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Be(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function Op(e, t) {
    switch (ri(t), t.tag) {
      case 1:
        return Ke(t.type) && wl(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return qr(), ve(Ge), ve(He), hi(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return fi(t), null;
      case 13:
        if (ve(je), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(u(340));
          Vr();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return ve(je), null;
      case 4:
        return qr(), null;
      case 10:
        return si(t.type._context), null;
      case 22:
      case 23:
        return qi(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var $l = !1, We = !1, Dp = typeof WeakSet == "function" ? WeakSet : Set, F = null;
  function Kr(e, t) {
    var r = e.ref;
    if (r !== null) if (typeof r == "function") try {
      r(null);
    } catch (n) {
      Ce(e, t, n);
    }
    else r.current = null;
  }
  function Ii(e, t, r) {
    try {
      r();
    } catch (n) {
      Ce(e, t, n);
    }
  }
  var Bu = !1;
  function Ap(e, t) {
    if (qo = il, e = bs(), Fo(e)) {
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
          var s = 0, d = -1, p = -1, k = 0, z = 0, M = e, S = null;
          t: for (; ; ) {
            for (var O; M !== r || l !== 0 && M.nodeType !== 3 || (d = s + l), M !== o || n !== 0 && M.nodeType !== 3 || (p = s + n), M.nodeType === 3 && (s += M.nodeValue.length), (O = M.firstChild) !== null; )
              S = M, M = O;
            for (; ; ) {
              if (M === e) break t;
              if (S === r && ++k === l && (d = s), S === o && ++z === n && (p = s), (O = M.nextSibling) !== null) break;
              M = S, S = M.parentNode;
            }
            M = O;
          }
          r = d === -1 || p === -1 ? null : { start: d, end: p };
        } else r = null;
      }
      r = r || { start: 0, end: 0 };
    } else r = null;
    for (Go = { focusedElem: e, selectionRange: r }, il = !1, F = t; F !== null; ) if (t = F, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, F = e;
    else for (; F !== null; ) {
      t = F;
      try {
        var $ = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if ($ !== null) {
              var U = $.memoizedProps, Ne = $.memoizedState, x = t.stateNode, f = x.getSnapshotBeforeUpdate(t.elementType === t.type ? U : ht(t.type, U), Ne);
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
        e.return = t.return, F = e;
        break;
      }
      F = t.return;
    }
    return $ = Bu, Bu = !1, $;
  }
  function On(e, t, r) {
    var n = t.updateQueue;
    if (n = n !== null ? n.lastEffect : null, n !== null) {
      var l = n = n.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && Ii(t, r, o);
        }
        l = l.next;
      } while (l !== n);
    }
  }
  function Ul(e, t) {
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
  function Oi(e) {
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
  function Wu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Wu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[bt], delete t[Cn], delete t[Zo], delete t[wp], delete t[kp])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Qu(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function qu(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Qu(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Di(e, t, r) {
    var n = e.tag;
    if (n === 5 || n === 6) e = e.stateNode, t ? r.nodeType === 8 ? r.parentNode.insertBefore(e, t) : r.insertBefore(e, t) : (r.nodeType === 8 ? (t = r.parentNode, t.insertBefore(e, r)) : (t = r, t.appendChild(e)), r = r._reactRootContainer, r != null || t.onclick !== null || (t.onclick = vl));
    else if (n !== 4 && (e = e.child, e !== null)) for (Di(e, t, r), e = e.sibling; e !== null; ) Di(e, t, r), e = e.sibling;
  }
  function Ai(e, t, r) {
    var n = e.tag;
    if (n === 5 || n === 6) e = e.stateNode, t ? r.insertBefore(e, t) : r.appendChild(e);
    else if (n !== 4 && (e = e.child, e !== null)) for (Ai(e, t, r), e = e.sibling; e !== null; ) Ai(e, t, r), e = e.sibling;
  }
  var De = null, gt = !1;
  function Jt(e, t, r) {
    for (r = r.child; r !== null; ) Gu(e, t, r), r = r.sibling;
  }
  function Gu(e, t, r) {
    if (kt && typeof kt.onCommitFiberUnmount == "function") try {
      kt.onCommitFiberUnmount(el, r);
    } catch {
    }
    switch (r.tag) {
      case 5:
        We || Kr(r, t);
      case 6:
        var n = De, l = gt;
        De = null, Jt(e, t, r), De = n, gt = l, De !== null && (gt ? (e = De, r = r.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(r) : e.removeChild(r)) : De.removeChild(r.stateNode));
        break;
      case 18:
        De !== null && (gt ? (e = De, r = r.stateNode, e.nodeType === 8 ? Xo(e.parentNode, r) : e.nodeType === 1 && Xo(e, r), mn(e)) : Xo(De, r.stateNode));
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
            var o = l, s = o.destroy;
            o = o.tag, s !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && Ii(r, t, s), l = l.next;
          } while (l !== n);
        }
        Jt(e, t, r);
        break;
      case 1:
        if (!We && (Kr(r, t), n = r.stateNode, typeof n.componentWillUnmount == "function")) try {
          n.props = r.memoizedProps, n.state = r.memoizedState, n.componentWillUnmount();
        } catch (d) {
          Ce(r, t, d);
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
      r === null && (r = e.stateNode = new Dp()), t.forEach(function(n) {
        var l = qp.bind(null, e, n);
        r.has(n) || (r.add(n), n.then(l, l));
      });
    }
  }
  function xt(e, t) {
    var r = t.deletions;
    if (r !== null) for (var n = 0; n < r.length; n++) {
      var l = r[n];
      try {
        var o = e, s = t, d = s;
        e: for (; d !== null; ) {
          switch (d.tag) {
            case 5:
              De = d.stateNode, gt = !1;
              break e;
            case 3:
              De = d.stateNode.containerInfo, gt = !0;
              break e;
            case 4:
              De = d.stateNode.containerInfo, gt = !0;
              break e;
          }
          d = d.return;
        }
        if (De === null) throw Error(u(160));
        Gu(o, s, l), De = null, gt = !1;
        var p = l.alternate;
        p !== null && (p.return = null), l.return = null;
      } catch (k) {
        Ce(l, t, k);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Yu(t, e), t = t.sibling;
  }
  function Yu(e, t) {
    var r = e.alternate, n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (xt(t, e), Ct(e), n & 4) {
          try {
            On(3, e, e.return), Ul(3, e);
          } catch (U) {
            Ce(e, e.return, U);
          }
          try {
            On(5, e, e.return);
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        break;
      case 1:
        xt(t, e), Ct(e), n & 512 && r !== null && Kr(r, r.return);
        break;
      case 5:
        if (xt(t, e), Ct(e), n & 512 && r !== null && Kr(r, r.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            rn(l, "");
          } catch (U) {
            Ce(e, e.return, U);
          }
        }
        if (n & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, s = r !== null ? r.memoizedProps : o, d = e.type, p = e.updateQueue;
          if (e.updateQueue = null, p !== null) try {
            d === "input" && o.type === "radio" && o.name != null && Sa(l, o), ho(d, s);
            var k = ho(d, o);
            for (s = 0; s < p.length; s += 2) {
              var z = p[s], M = p[s + 1];
              z === "style" ? La(l, M) : z === "dangerouslySetInnerHTML" ? Ma(l, M) : z === "children" ? rn(l, M) : A(l, z, M, k);
            }
            switch (d) {
              case "input":
                uo(l, o);
                break;
              case "textarea":
                Na(l, o);
                break;
              case "select":
                var S = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var O = o.value;
                O != null ? zr(l, !!o.multiple, O, !1) : S !== !!o.multiple && (o.defaultValue != null ? zr(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : zr(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[Cn] = o;
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
          mn(t.containerInfo);
        } catch (U) {
          Ce(e, e.return, U);
        }
        break;
      case 4:
        xt(t, e), Ct(e);
        break;
      case 13:
        xt(t, e), Ct(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (Ui = Ee())), n & 4 && Ku(e);
        break;
      case 22:
        if (z = r !== null && r.memoizedState !== null, e.mode & 1 ? (We = (k = We) || z, xt(t, e), We = k) : xt(t, e), Ct(e), n & 8192) {
          if (k = e.memoizedState !== null, (e.stateNode.isHidden = k) && !z && (e.mode & 1) !== 0) for (F = e, z = e.child; z !== null; ) {
            for (M = F = z; F !== null; ) {
              switch (S = F, O = S.child, S.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  On(4, S, S.return);
                  break;
                case 1:
                  Kr(S, S.return);
                  var $ = S.stateNode;
                  if (typeof $.componentWillUnmount == "function") {
                    n = S, r = S.return;
                    try {
                      t = n, $.props = t.memoizedProps, $.state = t.memoizedState, $.componentWillUnmount();
                    } catch (U) {
                      Ce(n, r, U);
                    }
                  }
                  break;
                case 5:
                  Kr(S, S.return);
                  break;
                case 22:
                  if (S.memoizedState !== null) {
                    Ju(M);
                    continue;
                  }
              }
              O !== null ? (O.return = S, F = O) : Ju(M);
            }
            z = z.sibling;
          }
          e: for (z = null, M = e; ; ) {
            if (M.tag === 5) {
              if (z === null) {
                z = M;
                try {
                  l = M.stateNode, k ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (d = M.stateNode, p = M.memoizedProps.style, s = p != null && p.hasOwnProperty("display") ? p.display : null, d.style.display = Pa("display", s));
                } catch (U) {
                  Ce(e, e.return, U);
                }
              }
            } else if (M.tag === 6) {
              if (z === null) try {
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
              z === M && (z = null), M = M.return;
            }
            z === M && (z = null), M.sibling.return = M.return, M = M.sibling;
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
            if (Qu(r)) {
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
            n.flags & 32 && (rn(l, ""), n.flags &= -33);
            var o = qu(e);
            Ai(e, o, l);
            break;
          case 3:
          case 4:
            var s = n.stateNode.containerInfo, d = qu(e);
            Di(e, d, s);
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
  function Fp(e, t, r) {
    F = e, Xu(e);
  }
  function Xu(e, t, r) {
    for (var n = (e.mode & 1) !== 0; F !== null; ) {
      var l = F, o = l.child;
      if (l.tag === 22 && n) {
        var s = l.memoizedState !== null || $l;
        if (!s) {
          var d = l.alternate, p = d !== null && d.memoizedState !== null || We;
          d = $l;
          var k = We;
          if ($l = s, (We = p) && !k) for (F = l; F !== null; ) s = F, p = s.child, s.tag === 22 && s.memoizedState !== null ? ec(l) : p !== null ? (p.return = s, F = p) : ec(l);
          for (; o !== null; ) F = o, Xu(o), o = o.sibling;
          F = l, $l = d, We = k;
        }
        Zu(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, F = o) : Zu(e);
    }
  }
  function Zu(e) {
    for (; F !== null; ) {
      var t = F;
      if ((t.flags & 8772) !== 0) {
        var r = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              We || Ul(5, t);
              break;
            case 1:
              var n = t.stateNode;
              if (t.flags & 4 && !We) if (r === null) n.componentDidMount();
              else {
                var l = t.elementType === t.type ? r.memoizedProps : ht(t.type, r.memoizedProps);
                n.componentDidUpdate(l, r.memoizedState, n.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && Js(t, o, n);
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
                Js(t, s, r);
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
                  var z = k.memoizedState;
                  if (z !== null) {
                    var M = z.dehydrated;
                    M !== null && mn(M);
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
          We || t.flags & 512 && Oi(t);
        } catch (S) {
          Ce(t, t.return, S);
        }
      }
      if (t === e) {
        F = null;
        break;
      }
      if (r = t.sibling, r !== null) {
        r.return = t.return, F = r;
        break;
      }
      F = t.return;
    }
  }
  function Ju(e) {
    for (; F !== null; ) {
      var t = F;
      if (t === e) {
        F = null;
        break;
      }
      var r = t.sibling;
      if (r !== null) {
        r.return = t.return, F = r;
        break;
      }
      F = t.return;
    }
  }
  function ec(e) {
    for (; F !== null; ) {
      var t = F;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var r = t.return;
            try {
              Ul(4, t);
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
              Oi(t);
            } catch (p) {
              Ce(t, o, p);
            }
            break;
          case 5:
            var s = t.return;
            try {
              Oi(t);
            } catch (p) {
              Ce(t, s, p);
            }
        }
      } catch (p) {
        Ce(t, t.return, p);
      }
      if (t === e) {
        F = null;
        break;
      }
      var d = t.sibling;
      if (d !== null) {
        d.return = t.return, F = d;
        break;
      }
      F = t.return;
    }
  }
  var $p = Math.ceil, Hl = K.ReactCurrentDispatcher, Fi = K.ReactCurrentOwner, ct = K.ReactCurrentBatchConfig, ae = 0, Re = null, ze = null, Ae = 0, ot = 0, Yr = Gt(0), Le = 0, Dn = null, vr = 0, Vl = 0, $i = 0, An = null, Xe = null, Ui = 0, Xr = 1 / 0, It = null, Bl = !1, Hi = null, er = null, Wl = !1, tr = null, Ql = 0, Fn = 0, Vi = null, ql = -1, Gl = 0;
  function qe() {
    return (ae & 6) !== 0 ? Ee() : ql !== -1 ? ql : ql = Ee();
  }
  function rr(e) {
    return (e.mode & 1) === 0 ? 1 : (ae & 2) !== 0 && Ae !== 0 ? Ae & -Ae : jp.transition !== null ? (Gl === 0 && (Gl = qa()), Gl) : (e = pe, e !== 0 || (e = window.event, e = e === void 0 ? 16 : rs(e.type)), e);
  }
  function vt(e, t, r, n) {
    if (50 < Fn) throw Fn = 0, Vi = null, Error(u(185));
    un(e, r, n), ((ae & 2) === 0 || e !== Re) && (e === Re && ((ae & 2) === 0 && (Vl |= r), Le === 4 && nr(e, Ae)), Ze(e, n), r === 1 && ae === 0 && (t.mode & 1) === 0 && (Xr = Ee() + 500, bl && Yt()));
  }
  function Ze(e, t) {
    var r = e.callbackNode;
    jd(e, t);
    var n = nl(e, e === Re ? Ae : 0);
    if (n === 0) r !== null && Ba(r), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = n & -n, e.callbackPriority !== t) {
      if (r != null && Ba(r), t === 1) e.tag === 0 ? bp(rc.bind(null, e)) : Us(rc.bind(null, e)), vp(function() {
        (ae & 6) === 0 && Yt();
      }), r = null;
      else {
        switch (Ga(n)) {
          case 1:
            r = bo;
            break;
          case 4:
            r = Wa;
            break;
          case 16:
            r = Jn;
            break;
          case 536870912:
            r = Qa;
            break;
          default:
            r = Jn;
        }
        r = cc(r, tc.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = r;
    }
  }
  function tc(e, t) {
    if (ql = -1, Gl = 0, (ae & 6) !== 0) throw Error(u(327));
    var r = e.callbackNode;
    if (Zr() && e.callbackNode !== r) return null;
    var n = nl(e, e === Re ? Ae : 0);
    if (n === 0) return null;
    if ((n & 30) !== 0 || (n & e.expiredLanes) !== 0 || t) t = Kl(e, n);
    else {
      t = n;
      var l = ae;
      ae |= 2;
      var o = lc();
      (Re !== e || Ae !== t) && (It = null, Xr = Ee() + 500, wr(e, t));
      do
        try {
          Vp();
          break;
        } catch (d) {
          nc(e, d);
        }
      while (!0);
      ai(), Hl.current = o, ae = l, ze !== null ? t = 0 : (Re = null, Ae = 0, t = Le);
    }
    if (t !== 0) {
      if (t === 2 && (l = jo(e), l !== 0 && (n = l, t = Bi(e, l))), t === 1) throw r = Dn, wr(e, 0), nr(e, n), Ze(e, Ee()), r;
      if (t === 6) nr(e, n);
      else {
        if (l = e.current.alternate, (n & 30) === 0 && !Up(l) && (t = Kl(e, n), t === 2 && (o = jo(e), o !== 0 && (n = o, t = Bi(e, o))), t === 1)) throw r = Dn, wr(e, 0), nr(e, n), Ze(e, Ee()), r;
        switch (e.finishedWork = l, e.finishedLanes = n, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            kr(e, Xe, It);
            break;
          case 3:
            if (nr(e, n), (n & 130023424) === n && (t = Ui + 500 - Ee(), 10 < t)) {
              if (nl(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & n) !== n) {
                qe(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Yo(kr.bind(null, e, Xe, It), t);
              break;
            }
            kr(e, Xe, It);
            break;
          case 4:
            if (nr(e, n), (n & 4194240) === n) break;
            for (t = e.eventTimes, l = -1; 0 < n; ) {
              var s = 31 - pt(n);
              o = 1 << s, s = t[s], s > l && (l = s), n &= ~o;
            }
            if (n = l, n = Ee() - n, n = (120 > n ? 120 : 480 > n ? 480 : 1080 > n ? 1080 : 1920 > n ? 1920 : 3e3 > n ? 3e3 : 4320 > n ? 4320 : 1960 * $p(n / 1960)) - n, 10 < n) {
              e.timeoutHandle = Yo(kr.bind(null, e, Xe, It), n);
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
    return Ze(e, Ee()), e.callbackNode === r ? tc.bind(null, e) : null;
  }
  function Bi(e, t) {
    var r = An;
    return e.current.memoizedState.isDehydrated && (wr(e, t).flags |= 256), e = Kl(e, t), e !== 2 && (t = Xe, Xe = r, t !== null && Wi(t)), e;
  }
  function Wi(e) {
    Xe === null ? Xe = e : Xe.push.apply(Xe, e);
  }
  function Up(e) {
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
    for (t &= ~$i, t &= ~Vl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var r = 31 - pt(t), n = 1 << r;
      e[r] = -1, t &= ~n;
    }
  }
  function rc(e) {
    if ((ae & 6) !== 0) throw Error(u(327));
    Zr();
    var t = nl(e, 0);
    if ((t & 1) === 0) return Ze(e, Ee()), null;
    var r = Kl(e, t);
    if (e.tag !== 0 && r === 2) {
      var n = jo(e);
      n !== 0 && (t = n, r = Bi(e, n));
    }
    if (r === 1) throw r = Dn, wr(e, 0), nr(e, t), Ze(e, Ee()), r;
    if (r === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, kr(e, Xe, It), Ze(e, Ee()), null;
  }
  function Qi(e, t) {
    var r = ae;
    ae |= 1;
    try {
      return e(t);
    } finally {
      ae = r, ae === 0 && (Xr = Ee() + 500, bl && Yt());
    }
  }
  function yr(e) {
    tr !== null && tr.tag === 0 && (ae & 6) === 0 && Zr();
    var t = ae;
    ae |= 1;
    var r = ct.transition, n = pe;
    try {
      if (ct.transition = null, pe = 1, e) return e();
    } finally {
      pe = n, ct.transition = r, ae = t, (ae & 6) === 0 && Yt();
    }
  }
  function qi() {
    ot = Yr.current, ve(Yr);
  }
  function wr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var r = e.timeoutHandle;
    if (r !== -1 && (e.timeoutHandle = -1, xp(r)), ze !== null) for (r = ze.return; r !== null; ) {
      var n = r;
      switch (ri(n), n.tag) {
        case 1:
          n = n.type.childContextTypes, n != null && wl();
          break;
        case 3:
          qr(), ve(Ge), ve(He), hi();
          break;
        case 5:
          fi(n);
          break;
        case 4:
          qr();
          break;
        case 13:
          ve(je);
          break;
        case 19:
          ve(je);
          break;
        case 10:
          si(n.type._context);
          break;
        case 22:
        case 23:
          qi();
      }
      r = r.return;
    }
    if (Re = e, ze = e = lr(e.current, null), Ae = ot = t, Le = 0, Dn = null, $i = Vl = vr = 0, Xe = An = null, hr !== null) {
      for (t = 0; t < hr.length; t++) if (r = hr[t], n = r.interleaved, n !== null) {
        r.interleaved = null;
        var l = n.next, o = r.pending;
        if (o !== null) {
          var s = o.next;
          o.next = l, n.next = s;
        }
        r.pending = n;
      }
      hr = null;
    }
    return e;
  }
  function nc(e, t) {
    do {
      var r = ze;
      try {
        if (ai(), Ll.current = Ol, Tl) {
          for (var n = Se.memoizedState; n !== null; ) {
            var l = n.queue;
            l !== null && (l.pending = null), n = n.next;
          }
          Tl = !1;
        }
        if (xr = 0, Te = Pe = Se = null, Pn = !1, Ln = 0, Fi.current = null, r === null || r.return === null) {
          Le = 1, Dn = t, ze = null;
          break;
        }
        e: {
          var o = e, s = r.return, d = r, p = t;
          if (t = Ae, d.flags |= 32768, p !== null && typeof p == "object" && typeof p.then == "function") {
            var k = p, z = d, M = z.tag;
            if ((z.mode & 1) === 0 && (M === 0 || M === 11 || M === 15)) {
              var S = z.alternate;
              S ? (z.updateQueue = S.updateQueue, z.memoizedState = S.memoizedState, z.lanes = S.lanes) : (z.updateQueue = null, z.memoizedState = null);
            }
            var O = zu(s);
            if (O !== null) {
              O.flags &= -257, _u(O, s, d, o, t), O.mode & 1 && Nu(o, k, t), t = O, p = k;
              var $ = t.updateQueue;
              if ($ === null) {
                var U = /* @__PURE__ */ new Set();
                U.add(p), t.updateQueue = U;
              } else $.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                Nu(o, k, t), Gi();
                break e;
              }
              p = Error(u(426));
            }
          } else if (be && d.mode & 1) {
            var Ne = zu(s);
            if (Ne !== null) {
              (Ne.flags & 65536) === 0 && (Ne.flags |= 256), _u(Ne, s, d, o, t), oi(Gr(p, d));
              break e;
            }
          }
          o = p = Gr(p, d), Le !== 4 && (Le = 2), An === null ? An = [o] : An.push(o), o = s;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var x = Cu(o, p, t);
                Zs(o, x);
                break e;
              case 1:
                d = p;
                var f = o.type, y = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof f.getDerivedStateFromError == "function" || y !== null && typeof y.componentDidCatch == "function" && (er === null || !er.has(y)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var L = Eu(o, d, t);
                  Zs(o, L);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        ic(r);
      } catch (H) {
        t = H, ze === r && r !== null && (ze = r = r.return);
        continue;
      }
      break;
    } while (!0);
  }
  function lc() {
    var e = Hl.current;
    return Hl.current = Ol, e === null ? Ol : e;
  }
  function Gi() {
    (Le === 0 || Le === 3 || Le === 2) && (Le = 4), Re === null || (vr & 268435455) === 0 && (Vl & 268435455) === 0 || nr(Re, Ae);
  }
  function Kl(e, t) {
    var r = ae;
    ae |= 2;
    var n = lc();
    (Re !== e || Ae !== t) && (It = null, wr(e, t));
    do
      try {
        Hp();
        break;
      } catch (l) {
        nc(e, l);
      }
    while (!0);
    if (ai(), ae = r, Hl.current = n, ze !== null) throw Error(u(261));
    return Re = null, Ae = 0, Le;
  }
  function Hp() {
    for (; ze !== null; ) oc(ze);
  }
  function Vp() {
    for (; ze !== null && !md(); ) oc(ze);
  }
  function oc(e) {
    var t = uc(e.alternate, e, ot);
    e.memoizedProps = e.pendingProps, t === null ? ic(e) : ze = t, Fi.current = null;
  }
  function ic(e) {
    var t = e;
    do {
      var r = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (r = Ip(r, t, ot), r !== null) {
          ze = r;
          return;
        }
      } else {
        if (r = Op(r, t), r !== null) {
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
      ct.transition = null, pe = 1, Bp(e, t, r, n);
    } finally {
      ct.transition = l, pe = n;
    }
    return null;
  }
  function Bp(e, t, r, n) {
    do
      Zr();
    while (tr !== null);
    if ((ae & 6) !== 0) throw Error(u(327));
    r = e.finishedWork;
    var l = e.finishedLanes;
    if (r === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, r === e.current) throw Error(u(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = r.lanes | r.childLanes;
    if (Sd(e, o), e === Re && (ze = Re = null, Ae = 0), (r.subtreeFlags & 2064) === 0 && (r.flags & 2064) === 0 || Wl || (Wl = !0, cc(Jn, function() {
      return Zr(), null;
    })), o = (r.flags & 15990) !== 0, (r.subtreeFlags & 15990) !== 0 || o) {
      o = ct.transition, ct.transition = null;
      var s = pe;
      pe = 1;
      var d = ae;
      ae |= 4, Fi.current = null, Ap(e, r), Yu(r, e), cp(Go), il = !!qo, Go = qo = null, e.current = r, Fp(r), hd(), ae = d, pe = s, ct.transition = o;
    } else e.current = r;
    if (Wl && (Wl = !1, tr = e, Ql = l), o = e.pendingLanes, o === 0 && (er = null), vd(r.stateNode), Ze(e, Ee()), t !== null) for (n = e.onRecoverableError, r = 0; r < t.length; r++) l = t[r], n(l.value, { componentStack: l.stack, digest: l.digest });
    if (Bl) throw Bl = !1, e = Hi, Hi = null, e;
    return (Ql & 1) !== 0 && e.tag !== 0 && Zr(), o = e.pendingLanes, (o & 1) !== 0 ? e === Vi ? Fn++ : (Fn = 0, Vi = e) : Fn = 0, Yt(), null;
  }
  function Zr() {
    if (tr !== null) {
      var e = Ga(Ql), t = ct.transition, r = pe;
      try {
        if (ct.transition = null, pe = 16 > e ? 16 : e, tr === null) var n = !1;
        else {
          if (e = tr, tr = null, Ql = 0, (ae & 6) !== 0) throw Error(u(331));
          var l = ae;
          for (ae |= 4, F = e.current; F !== null; ) {
            var o = F, s = o.child;
            if ((F.flags & 16) !== 0) {
              var d = o.deletions;
              if (d !== null) {
                for (var p = 0; p < d.length; p++) {
                  var k = d[p];
                  for (F = k; F !== null; ) {
                    var z = F;
                    switch (z.tag) {
                      case 0:
                      case 11:
                      case 15:
                        On(8, z, o);
                    }
                    var M = z.child;
                    if (M !== null) M.return = z, F = M;
                    else for (; F !== null; ) {
                      z = F;
                      var S = z.sibling, O = z.return;
                      if (Wu(z), z === k) {
                        F = null;
                        break;
                      }
                      if (S !== null) {
                        S.return = O, F = S;
                        break;
                      }
                      F = O;
                    }
                  }
                }
                var $ = o.alternate;
                if ($ !== null) {
                  var U = $.child;
                  if (U !== null) {
                    $.child = null;
                    do {
                      var Ne = U.sibling;
                      U.sibling = null, U = Ne;
                    } while (U !== null);
                  }
                }
                F = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && s !== null) s.return = o, F = s;
            else e: for (; F !== null; ) {
              if (o = F, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  On(9, o, o.return);
              }
              var x = o.sibling;
              if (x !== null) {
                x.return = o.return, F = x;
                break e;
              }
              F = o.return;
            }
          }
          var f = e.current;
          for (F = f; F !== null; ) {
            s = F;
            var y = s.child;
            if ((s.subtreeFlags & 2064) !== 0 && y !== null) y.return = s, F = y;
            else e: for (s = f; F !== null; ) {
              if (d = F, (d.flags & 2048) !== 0) try {
                switch (d.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ul(9, d);
                }
              } catch (H) {
                Ce(d, d.return, H);
              }
              if (d === s) {
                F = null;
                break e;
              }
              var L = d.sibling;
              if (L !== null) {
                L.return = d.return, F = L;
                break e;
              }
              F = d.return;
            }
          }
          if (ae = l, Yt(), kt && typeof kt.onPostCommitFiberRoot == "function") try {
            kt.onPostCommitFiberRoot(el, e);
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
  function ac(e, t, r) {
    t = Gr(r, t), t = Cu(e, t, 1), e = Zt(e, t, 1), t = qe(), e !== null && (un(e, 1, t), Ze(e, t));
  }
  function Ce(e, t, r) {
    if (e.tag === 3) ac(e, e, r);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        ac(t, e, r);
        break;
      } else if (t.tag === 1) {
        var n = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof n.componentDidCatch == "function" && (er === null || !er.has(n))) {
          e = Gr(r, e), e = Eu(t, e, 1), t = Zt(t, e, 1), e = qe(), t !== null && (un(t, 1, e), Ze(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Wp(e, t, r) {
    var n = e.pingCache;
    n !== null && n.delete(t), t = qe(), e.pingedLanes |= e.suspendedLanes & r, Re === e && (Ae & r) === r && (Le === 4 || Le === 3 && (Ae & 130023424) === Ae && 500 > Ee() - Ui ? wr(e, 0) : $i |= r), Ze(e, t);
  }
  function sc(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = rl, rl <<= 1, (rl & 130023424) === 0 && (rl = 4194304)));
    var r = qe();
    e = Lt(e, t), e !== null && (un(e, t, r), Ze(e, r));
  }
  function Qp(e) {
    var t = e.memoizedState, r = 0;
    t !== null && (r = t.retryLane), sc(e, r);
  }
  function qp(e, t) {
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
    n !== null && n.delete(t), sc(e, r);
  }
  var uc;
  uc = function(e, t, r) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ge.current) Ye = !0;
    else {
      if ((e.lanes & r) === 0 && (t.flags & 128) === 0) return Ye = !1, Rp(e, t, r);
      Ye = (e.flags & 131072) !== 0;
    }
    else Ye = !1, be && (t.flags & 1048576) !== 0 && Hs(t, Sl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var n = t.type;
        Fl(e, t), e = t.pendingProps;
        var l = $r(t, He.current);
        Qr(t, r), l = vi(null, t, n, e, l, r);
        var o = yi();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ke(n) ? (o = !0, kl(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, di(t), l.updater = Dl, t.stateNode = l, l._reactInternals = t, Ci(t, n, e, r), t = _i(null, t, n, !0, o, r)) : (t.tag = 0, be && o && ti(t), Qe(null, t, l, r), t = t.child), t;
      case 16:
        n = t.elementType;
        e: {
          switch (Fl(e, t), e = t.pendingProps, l = n._init, n = l(n._payload), t.type = n, l = t.tag = Kp(n), e = ht(n, e), l) {
            case 0:
              t = zi(null, t, n, e, r);
              break e;
            case 1:
              t = Iu(null, t, n, e, r);
              break e;
            case 11:
              t = Mu(null, t, n, e, r);
              break e;
            case 14:
              t = Pu(null, t, n, ht(n.type, e), r);
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
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : ht(n, l), zi(e, t, n, l, r);
      case 1:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : ht(n, l), Iu(e, t, n, l, r);
      case 3:
        e: {
          if (Ou(t), e === null) throw Error(u(387));
          n = t.pendingProps, o = t.memoizedState, l = o.element, Xs(e, t), Ml(t, n, null, r);
          var s = t.memoizedState;
          if (n = s.element, o.isDehydrated) if (o = { element: n, isDehydrated: !1, cache: s.cache, pendingSuspenseBoundaries: s.pendingSuspenseBoundaries, transitions: s.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Gr(Error(u(423)), t), t = Du(e, t, n, r, l);
            break e;
          } else if (n !== l) {
            l = Gr(Error(u(424)), t), t = Du(e, t, n, r, l);
            break e;
          } else for (lt = qt(t.stateNode.containerInfo.firstChild), nt = t, be = !0, mt = null, r = Ks(t, null, n, r), t.child = r; r; ) r.flags = r.flags & -3 | 4096, r = r.sibling;
          else {
            if (Vr(), n === l) {
              t = Rt(e, t, r);
              break e;
            }
            Qe(e, t, n, r);
          }
          t = t.child;
        }
        return t;
      case 5:
        return eu(t), e === null && li(t), n = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, s = l.children, Ko(n, l) ? s = null : o !== null && Ko(n, o) && (t.flags |= 32), Ru(e, t), Qe(e, t, s, r), t.child;
      case 6:
        return e === null && li(t), null;
      case 13:
        return Au(e, t, r);
      case 4:
        return pi(t, t.stateNode.containerInfo), n = t.pendingProps, e === null ? t.child = Br(t, null, n, r) : Qe(e, t, n, r), t.child;
      case 11:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : ht(n, l), Mu(e, t, n, l, r);
      case 7:
        return Qe(e, t, t.pendingProps, r), t.child;
      case 8:
        return Qe(e, t, t.pendingProps.children, r), t.child;
      case 12:
        return Qe(e, t, t.pendingProps.children, r), t.child;
      case 10:
        e: {
          if (n = t.type._context, l = t.pendingProps, o = t.memoizedProps, s = l.value, he(Nl, n._currentValue), n._currentValue = s, o !== null) if (ft(o.value, s)) {
            if (o.children === l.children && !Ge.current) {
              t = Rt(e, t, r);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var d = o.dependencies;
            if (d !== null) {
              s = o.child;
              for (var p = d.firstContext; p !== null; ) {
                if (p.context === n) {
                  if (o.tag === 1) {
                    p = Tt(-1, r & -r), p.tag = 2;
                    var k = o.updateQueue;
                    if (k !== null) {
                      k = k.shared;
                      var z = k.pending;
                      z === null ? p.next = p : (p.next = z.next, z.next = p), k.pending = p;
                    }
                  }
                  o.lanes |= r, p = o.alternate, p !== null && (p.lanes |= r), ui(
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
              s.lanes |= r, d = s.alternate, d !== null && (d.lanes |= r), ui(s, r, t), s = o.sibling;
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
          Qe(e, t, l.children, r), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, n = t.pendingProps.children, Qr(t, r), l = st(l), n = n(l), t.flags |= 1, Qe(e, t, n, r), t.child;
      case 14:
        return n = t.type, l = ht(n, t.pendingProps), l = ht(n.type, l), Pu(e, t, n, l, r);
      case 15:
        return Lu(e, t, t.type, t.pendingProps, r);
      case 17:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : ht(n, l), Fl(e, t), t.tag = 1, Ke(n) ? (e = !0, kl(t)) : e = !1, Qr(t, r), ju(t, n, l), Ci(t, n, l, r), _i(null, t, n, !0, e, r);
      case 19:
        return $u(e, t, r);
      case 22:
        return Tu(e, t, r);
    }
    throw Error(u(156, t.tag));
  };
  function cc(e, t) {
    return Va(e, t);
  }
  function Gp(e, t, r, n) {
    this.tag = e, this.key = r, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = n, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function dt(e, t, r, n) {
    return new Gp(e, t, r, n);
  }
  function Ki(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Kp(e) {
    if (typeof e == "function") return Ki(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === oe) return 11;
      if (e === et) return 14;
    }
    return 2;
  }
  function lr(e, t) {
    var r = e.alternate;
    return r === null ? (r = dt(e.tag, t, e.key, e.mode), r.elementType = e.elementType, r.type = e.type, r.stateNode = e.stateNode, r.alternate = e, e.alternate = r) : (r.pendingProps = t, r.type = e.type, r.flags = 0, r.subtreeFlags = 0, r.deletions = null), r.flags = e.flags & 14680064, r.childLanes = e.childLanes, r.lanes = e.lanes, r.child = e.child, r.memoizedProps = e.memoizedProps, r.memoizedState = e.memoizedState, r.updateQueue = e.updateQueue, t = e.dependencies, r.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, r.sibling = e.sibling, r.index = e.index, r.ref = e.ref, r;
  }
  function Yl(e, t, r, n, l, o) {
    var s = 2;
    if (n = e, typeof e == "function") Ki(e) && (s = 1);
    else if (typeof e == "string") s = 5;
    else e: switch (e) {
      case fe:
        return br(r.children, l, o, t);
      case we:
        s = 8, l |= 8;
        break;
      case _e:
        return e = dt(12, r, t, l | 2), e.elementType = _e, e.lanes = o, e;
      case $e:
        return e = dt(13, r, t, l), e.elementType = $e, e.lanes = o, e;
      case Ue:
        return e = dt(19, r, t, l), e.elementType = Ue, e.lanes = o, e;
      case ge:
        return Xl(r, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Fe:
            s = 10;
            break e;
          case Oe:
            s = 9;
            break e;
          case oe:
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
    return t = dt(s, r, t, l), t.elementType = e, t.type = n, t.lanes = o, t;
  }
  function br(e, t, r, n) {
    return e = dt(7, e, n, t), e.lanes = r, e;
  }
  function Xl(e, t, r, n) {
    return e = dt(22, e, n, t), e.elementType = ge, e.lanes = r, e.stateNode = { isHidden: !1 }, e;
  }
  function Yi(e, t, r) {
    return e = dt(6, e, null, t), e.lanes = r, e;
  }
  function Xi(e, t, r) {
    return t = dt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = r, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Yp(e, t, r, n, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = So(0), this.expirationTimes = So(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = So(0), this.identifierPrefix = n, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Zi(e, t, r, n, l, o, s, d, p) {
    return e = new Yp(e, t, r, d, p), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = dt(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: n, isDehydrated: r, cache: null, transitions: null, pendingSuspenseBoundaries: null }, di(o), e;
  }
  function Xp(e, t, r) {
    var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Z, key: n == null ? null : "" + n, children: e, containerInfo: t, implementation: r };
  }
  function dc(e) {
    if (!e) return Kt;
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
      if (Ke(r)) return Fs(e, r, t);
    }
    return t;
  }
  function pc(e, t, r, n, l, o, s, d, p) {
    return e = Zi(r, n, !0, e, l, o, s, d, p), e.context = dc(null), r = e.current, n = qe(), l = rr(r), o = Tt(n, l), o.callback = t ?? null, Zt(r, o, l), e.current.lanes = l, un(e, l, n), Ze(e, n), e;
  }
  function Zl(e, t, r, n) {
    var l = t.current, o = qe(), s = rr(l);
    return r = dc(r), t.context === null ? t.context = r : t.pendingContext = r, t = Tt(o, s), t.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (t.callback = n), e = Zt(l, t, s), e !== null && (vt(e, l, s, o), _l(e, l, s)), s;
  }
  function Jl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function fc(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var r = e.retryLane;
      e.retryLane = r !== 0 && r < t ? r : t;
    }
  }
  function Ji(e, t) {
    fc(e, t), (e = e.alternate) && fc(e, t);
  }
  function Zp() {
    return null;
  }
  var mc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function ea(e) {
    this._internalRoot = e;
  }
  eo.prototype.render = ea.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    Zl(e, t, null, null);
  }, eo.prototype.unmount = ea.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      yr(function() {
        Zl(null, e, null, null);
      }), t[zt] = null;
    }
  };
  function eo(e) {
    this._internalRoot = e;
  }
  eo.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Xa();
      e = { blockedOn: null, target: e, priority: t };
      for (var r = 0; r < Bt.length && t !== 0 && t < Bt[r].priority; r++) ;
      Bt.splice(r, 0, e), r === 0 && es(e);
    }
  };
  function ta(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function to(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function hc() {
  }
  function Jp(e, t, r, n, l) {
    if (l) {
      if (typeof n == "function") {
        var o = n;
        n = function() {
          var k = Jl(s);
          o.call(k);
        };
      }
      var s = pc(t, n, e, 0, null, !1, !1, "", hc);
      return e._reactRootContainer = s, e[zt] = s.current, jn(e.nodeType === 8 ? e.parentNode : e), yr(), s;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof n == "function") {
      var d = n;
      n = function() {
        var k = Jl(p);
        d.call(k);
      };
    }
    var p = Zi(e, 0, !1, null, null, !1, !1, "", hc);
    return e._reactRootContainer = p, e[zt] = p.current, jn(e.nodeType === 8 ? e.parentNode : e), yr(function() {
      Zl(t, p, r, n);
    }), p;
  }
  function ro(e, t, r, n, l) {
    var o = r._reactRootContainer;
    if (o) {
      var s = o;
      if (typeof l == "function") {
        var d = l;
        l = function() {
          var p = Jl(s);
          d.call(p);
        };
      }
      Zl(t, s, e, l);
    } else s = Jp(r, t, e, l, n);
    return Jl(s);
  }
  Ka = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var r = sn(t.pendingLanes);
          r !== 0 && (Co(t, r | 1), Ze(t, Ee()), (ae & 6) === 0 && (Xr = Ee() + 500, Yt()));
        }
        break;
      case 13:
        yr(function() {
          var n = Lt(e, 1);
          if (n !== null) {
            var l = qe();
            vt(n, e, 1, l);
          }
        }), Ji(e, 1);
    }
  }, Eo = function(e) {
    if (e.tag === 13) {
      var t = Lt(e, 134217728);
      if (t !== null) {
        var r = qe();
        vt(t, e, 134217728, r);
      }
      Ji(e, 134217728);
    }
  }, Ya = function(e) {
    if (e.tag === 13) {
      var t = rr(e), r = Lt(e, t);
      if (r !== null) {
        var n = qe();
        vt(r, e, t, n);
      }
      Ji(e, t);
    }
  }, Xa = function() {
    return pe;
  }, Za = function(e, t) {
    var r = pe;
    try {
      return pe = e, t();
    } finally {
      pe = r;
    }
  }, vo = function(e, t, r) {
    switch (t) {
      case "input":
        if (uo(e, r), t = r.name, r.type === "radio" && t != null) {
          for (r = e; r.parentNode; ) r = r.parentNode;
          for (r = r.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < r.length; t++) {
            var n = r[t];
            if (n !== e && n.form === e.form) {
              var l = yl(n);
              if (!l) throw Error(u(90));
              ba(n), uo(n, l);
            }
          }
        }
        break;
      case "textarea":
        Na(e, r);
        break;
      case "select":
        t = r.value, t != null && zr(e, !!r.multiple, t, !1);
    }
  }, Oa = Qi, Da = yr;
  var ef = { usingClientEntryPoint: !1, Events: [En, Ar, yl, Ra, Ia, Qi] }, $n = { findFiberByHostInstance: dr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, tf = { bundleType: $n.bundleType, version: $n.version, rendererPackageName: $n.rendererPackageName, rendererConfig: $n.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: K.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Ua(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: $n.findFiberByHostInstance || Zp, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var no = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!no.isDisabled && no.supportsFiber) try {
      el = no.inject(tf), kt = no;
    } catch {
    }
  }
  return Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ef, Je.createPortal = function(e, t) {
    var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ta(t)) throw Error(u(200));
    return Xp(e, t, null, r);
  }, Je.createRoot = function(e, t) {
    if (!ta(e)) throw Error(u(299));
    var r = !1, n = "", l = mc;
    return t != null && (t.unstable_strictMode === !0 && (r = !0), t.identifierPrefix !== void 0 && (n = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Zi(e, 1, !1, null, null, r, !1, n, l), e[zt] = t.current, jn(e.nodeType === 8 ? e.parentNode : e), new ea(t);
  }, Je.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = Ua(t), e = e === null ? null : e.stateNode, e;
  }, Je.flushSync = function(e) {
    return yr(e);
  }, Je.hydrate = function(e, t, r) {
    if (!to(t)) throw Error(u(200));
    return ro(null, e, t, !0, r);
  }, Je.hydrateRoot = function(e, t, r) {
    if (!ta(e)) throw Error(u(405));
    var n = r != null && r.hydratedSources || null, l = !1, o = "", s = mc;
    if (r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (s = r.onRecoverableError)), t = pc(t, null, e, 1, r ?? null, l, !1, o, s), e[zt] = t.current, jn(e), n) for (e = 0; e < n.length; e++) r = n[e], l = r._getVersion, l = l(r._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [r, l] : t.mutableSourceEagerHydrationData.push(
      r,
      l
    );
    return new eo(t);
  }, Je.render = function(e, t, r) {
    if (!to(t)) throw Error(u(200));
    return ro(null, e, t, !1, r);
  }, Je.unmountComponentAtNode = function(e) {
    if (!to(e)) throw Error(u(40));
    return e._reactRootContainer ? (yr(function() {
      ro(null, null, e, !1, function() {
        e._reactRootContainer = null, e[zt] = null;
      });
    }), !0) : !1;
  }, Je.unstable_batchedUpdates = Qi, Je.unstable_renderSubtreeIntoContainer = function(e, t, r, n) {
    if (!to(r)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return ro(e, t, r, !1, n);
  }, Je.version = "18.3.1-next-f1338f8080-20240426", Je;
}
var jc;
function Mc() {
  if (jc) return la.exports;
  jc = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (c) {
        console.error(c);
      }
  }
  return i(), la.exports = ff(), la.exports;
}
var Sc;
function mf() {
  if (Sc) return lo;
  Sc = 1;
  var i = Mc();
  return lo.createRoot = i.createRoot, lo.hydrateRoot = i.hydrateRoot, lo;
}
var Cr = mf(), hf = Mc();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gf = (i) => i.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Pc = (...i) => i.filter((c, u, m) => !!c && c.trim() !== "" && m.indexOf(c) === u).join(" ").trim();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var xf = {
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
const vf = Q.forwardRef(
  ({
    color: i = "currentColor",
    size: c = 24,
    strokeWidth: u = 2,
    absoluteStrokeWidth: m,
    className: w = "",
    children: v,
    iconNode: g,
    ...b
  }, C) => Q.createElement(
    "svg",
    {
      ref: C,
      ...xf,
      width: c,
      height: c,
      stroke: i,
      strokeWidth: m ? Number(u) * 24 / Number(c) : u,
      className: Pc("lucide", w),
      ...b
    },
    [
      ...g.map(([_, T]) => Q.createElement(_, T)),
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
const ie = (i, c) => {
  const u = Q.forwardRef(
    ({ className: m, ...w }, v) => Q.createElement(vf, {
      ref: v,
      iconNode: c,
      className: Pc(`lucide-${gf(i)}`, m),
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
const yf = ie("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const wf = ie("ArrowUpDown", [
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
const kf = ie("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bf = ie("BookCheck", [
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
const ao = ie("BookOpen", [
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
const jf = ie("Building2", [
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
const Bn = ie("CalendarDays", [
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
const Sf = ie("CalendarRange", [
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
const Cf = ie("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lc = ie("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qn = ie("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sa = ie("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tc = ie("Ellipsis", [
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
const xa = ie("ExternalLink", [
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
const ua = ie("FileClock", [
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
const Ef = ie("Gauge", [
  ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nf = ie("GitBranch", [
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
const Wn = ie("GraduationCap", [
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
const zf = ie("GripVertical", [
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
const va = ie("Hash", [
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
const ca = ie("History", [
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
const _f = ie("Layers", [
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
const Mf = ie("LibraryBig", [
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
const qn = ie("MapPin", [
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
const Pf = ie("Pin", [
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
const Lf = ie("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tf = ie("Route", [
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
const ya = ie("SearchX", [
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
const Rf = ie("Star", [
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
const If = ie("Target", [
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
const da = ie("Trash2", [
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
const Rc = ie("TriangleAlert", [
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
const ur = ie("UserRound", [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Of = ie("UsersRound", [
  ["path", { d: "M18 21a8 8 0 0 0-16 0", key: "3ypg7q" }],
  ["circle", { cx: "10", cy: "8", r: "5", key: "o932ke" }],
  ["path", { d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3", key: "10s06x" }]
]);
var Df = Object.defineProperty, wa = (i, c) => Df(i, "name", { value: c, configurable: !0 });
function pa(i, c) {
  if (typeof i == "function")
    return i(c);
  i != null && (i.current = c);
}
wa(pa, "setRef");
function Ic(...i) {
  return (c) => {
    let u = !1;
    const m = i.map((w) => {
      const v = pa(w, c);
      return !u && typeof v == "function" && (u = !0), v;
    });
    if (u)
      return () => {
        for (let w = 0; w < m.length; w++) {
          const v = m[w];
          typeof v == "function" ? v() : pa(i[w], null);
        }
      };
  };
}
wa(Ic, "composeRefs");
function Oc(...i) {
  return Q.useCallback(Ic(...i), i);
}
wa(Oc, "useComposedRefs");
var Af = Object.defineProperty, wt = (i, c) => Af(i, "name", { value: c, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Dc(i) {
  const c = Q.forwardRef((u, m) => {
    let { children: w, ...v } = u, g = null, b = !1;
    const C = [];
    fa(w) && typeof oo == "function" && (w = oo(w._payload)), Q.Children.forEach(w, (E) => {
      var Y;
      if (Uc(E)) {
        b = !0;
        const j = E;
        let P = "child" in j.props ? j.props.child : j.props.children;
        fa(P) && typeof oo == "function" && (P = oo(P._payload)), g = Uf(j, P), C.push((Y = g == null ? void 0 : g.props) == null ? void 0 : Y.children);
      } else
        C.push(E);
    }), g ? g = Q.cloneElement(g, void 0, C) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !b && Q.Children.count(w) === 1 && Q.isValidElement(w) && (g = w)
    );
    const _ = g ? $c(g) : void 0, T = Oc(m, _);
    if (!g) {
      if (w || w === 0)
        throw new Error(
          b ? Bf(i) : Vf(i)
        );
      return w;
    }
    const V = Fc(v, g.props ?? {});
    return g.type !== Q.Fragment && (V.ref = m ? T : _), Q.cloneElement(g, V);
  });
  return c.displayName = `${i}.Slot`, c;
}
wt(Dc, "createSlot");
var Ff = /* @__PURE__ */ Dc("Slot"), Ac = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function $f(i) {
  const c = /* @__PURE__ */ wt((u) => "child" in u ? u.children(u.child) : u.children, "Slottable");
  return c.displayName = `${i}.Slottable`, c.__radixId = Ac, c;
}
wt($f, "createSlottable");
var Uf = /* @__PURE__ */ wt((i, c) => {
  if ("child" in i.props) {
    const u = i.props.child;
    return Q.isValidElement(u) ? Q.cloneElement(u, void 0, i.props.children(u.props.children)) : null;
  }
  return Q.isValidElement(c) ? c : null;
}, "getSlottableElementFromSlottable");
function Fc(i, c) {
  const u = { ...c };
  for (const m in c) {
    const w = i[m], v = c[m];
    /^on[A-Z]/.test(m) ? w && v ? u[m] = (...b) => {
      const C = v(...b);
      return w(...b), C;
    } : w && (u[m] = w) : m === "style" ? u[m] = { ...w, ...v } : m === "className" && (u[m] = [w, v].filter(Boolean).join(" "));
  }
  return { ...i, ...u };
}
wt(Fc, "mergeProps");
function $c(i) {
  var m, w;
  let c = (m = Object.getOwnPropertyDescriptor(i.props, "ref")) == null ? void 0 : m.get, u = c && "isReactWarning" in c && c.isReactWarning;
  return u ? i.ref : (c = (w = Object.getOwnPropertyDescriptor(i, "ref")) == null ? void 0 : w.get, u = c && "isReactWarning" in c && c.isReactWarning, u ? i.props.ref : i.props.ref || i.ref);
}
wt($c, "getElementRef");
function Uc(i) {
  return Q.isValidElement(i) && typeof i.type == "function" && "__radixId" in i.type && i.type.__radixId === Ac;
}
wt(Uc, "isSlottable");
var Hf = Symbol.for("react.lazy");
function fa(i) {
  return i != null && typeof i == "object" && "$$typeof" in i && i.$$typeof === Hf && "_payload" in i && Hc(i._payload);
}
wt(fa, "isLazyComponent");
function Hc(i) {
  return typeof i == "object" && i !== null && "then" in i;
}
wt(Hc, "isPromiseLike");
var Vf = /* @__PURE__ */ wt((i) => `${i} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Bf = /* @__PURE__ */ wt((i) => `${i} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), oo = cf[" use ".trim().toString()];
function Vc(i) {
  var c, u, m = "";
  if (typeof i == "string" || typeof i == "number") m += i;
  else if (typeof i == "object") if (Array.isArray(i)) {
    var w = i.length;
    for (c = 0; c < w; c++) i[c] && (u = Vc(i[c])) && (m && (m += " "), m += u);
  } else for (u in i) i[u] && (m && (m += " "), m += u);
  return m;
}
function Bc() {
  for (var i, c, u = 0, m = "", w = arguments.length; u < w; u++) (i = arguments[u]) && (c = Vc(i)) && (m && (m += " "), m += c);
  return m;
}
const Cc = (i) => typeof i == "boolean" ? `${i}` : i === 0 ? "0" : i, Ec = Bc, Wf = (i, c) => (u) => {
  var m;
  if ((c == null ? void 0 : c.variants) == null) return Ec(i, u == null ? void 0 : u.class, u == null ? void 0 : u.className);
  const { variants: w, defaultVariants: v } = c, g = Object.keys(w).map((_) => {
    const T = u == null ? void 0 : u[_], V = v == null ? void 0 : v[_];
    if (T === null) return null;
    const E = Cc(T) || Cc(V);
    return w[_][E];
  }), b = u && Object.entries(u).reduce((_, T) => {
    let [V, E] = T;
    return E === void 0 || (_[V] = E), _;
  }, {}), C = c == null || (m = c.compoundVariants) === null || m === void 0 ? void 0 : m.reduce((_, T) => {
    let { class: V, className: E, ...Y } = T;
    return Object.entries(Y).every((j) => {
      let [P, R] = j;
      return Array.isArray(R) ? R.includes({
        ...v,
        ...b
      }[P]) : {
        ...v,
        ...b
      }[P] === R;
    }) ? [
      ..._,
      V,
      E
    ] : _;
  }, []);
  return Ec(i, g, C, u == null ? void 0 : u.class, u == null ? void 0 : u.className);
}, ka = "-", Qf = (i) => {
  const c = Gf(i), {
    conflictingClassGroups: u,
    conflictingClassGroupModifiers: m
  } = i;
  return {
    getClassGroupId: (g) => {
      const b = g.split(ka);
      return b[0] === "" && b.length !== 1 && b.shift(), Wc(b, c) || qf(g);
    },
    getConflictingClassGroupIds: (g, b) => {
      const C = u[g] || [];
      return b && m[g] ? [...C, ...m[g]] : C;
    }
  };
}, Wc = (i, c) => {
  var g;
  if (i.length === 0)
    return c.classGroupId;
  const u = i[0], m = c.nextPart.get(u), w = m ? Wc(i.slice(1), m) : void 0;
  if (w)
    return w;
  if (c.validators.length === 0)
    return;
  const v = i.join(ka);
  return (g = c.validators.find(({
    validator: b
  }) => b(v))) == null ? void 0 : g.classGroupId;
}, Nc = /^\[(.+)\]$/, qf = (i) => {
  if (Nc.test(i)) {
    const c = Nc.exec(i)[1], u = c == null ? void 0 : c.substring(0, c.indexOf(":"));
    if (u)
      return "arbitrary.." + u;
  }
}, Gf = (i) => {
  const {
    theme: c,
    prefix: u
  } = i, m = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Yf(Object.entries(i.classGroups), u).forEach(([v, g]) => {
    ma(g, m, v, c);
  }), m;
}, ma = (i, c, u, m) => {
  i.forEach((w) => {
    if (typeof w == "string") {
      const v = w === "" ? c : zc(c, w);
      v.classGroupId = u;
      return;
    }
    if (typeof w == "function") {
      if (Kf(w)) {
        ma(w(m), c, u, m);
        return;
      }
      c.validators.push({
        validator: w,
        classGroupId: u
      });
      return;
    }
    Object.entries(w).forEach(([v, g]) => {
      ma(g, zc(c, v), u, m);
    });
  });
}, zc = (i, c) => {
  let u = i;
  return c.split(ka).forEach((m) => {
    u.nextPart.has(m) || u.nextPart.set(m, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), u = u.nextPart.get(m);
  }), u;
}, Kf = (i) => i.isThemeGetter, Yf = (i, c) => c ? i.map(([u, m]) => {
  const w = m.map((v) => typeof v == "string" ? c + v : typeof v == "object" ? Object.fromEntries(Object.entries(v).map(([g, b]) => [c + g, b])) : v);
  return [u, w];
}) : i, Xf = (i) => {
  if (i < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let c = 0, u = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
  const w = (v, g) => {
    u.set(v, g), c++, c > i && (c = 0, m = u, u = /* @__PURE__ */ new Map());
  };
  return {
    get(v) {
      let g = u.get(v);
      if (g !== void 0)
        return g;
      if ((g = m.get(v)) !== void 0)
        return w(v, g), g;
    },
    set(v, g) {
      u.has(v) ? u.set(v, g) : w(v, g);
    }
  };
}, Qc = "!", Zf = (i) => {
  const {
    separator: c,
    experimentalParseClassName: u
  } = i, m = c.length === 1, w = c[0], v = c.length, g = (b) => {
    const C = [];
    let _ = 0, T = 0, V;
    for (let R = 0; R < b.length; R++) {
      let X = b[R];
      if (_ === 0) {
        if (X === w && (m || b.slice(R, R + v) === c)) {
          C.push(b.slice(T, R)), T = R + v;
          continue;
        }
        if (X === "/") {
          V = R;
          continue;
        }
      }
      X === "[" ? _++ : X === "]" && _--;
    }
    const E = C.length === 0 ? b : b.substring(T), Y = E.startsWith(Qc), j = Y ? E.substring(1) : E, P = V && V > T ? V - T : void 0;
    return {
      modifiers: C,
      hasImportantModifier: Y,
      baseClassName: j,
      maybePostfixModifierPosition: P
    };
  };
  return u ? (b) => u({
    className: b,
    parseClassName: g
  }) : g;
}, Jf = (i) => {
  if (i.length <= 1)
    return i;
  const c = [];
  let u = [];
  return i.forEach((m) => {
    m[0] === "[" ? (c.push(...u.sort(), m), u = []) : u.push(m);
  }), c.push(...u.sort()), c;
}, em = (i) => ({
  cache: Xf(i.cacheSize),
  parseClassName: Zf(i),
  ...Qf(i)
}), tm = /\s+/, rm = (i, c) => {
  const {
    parseClassName: u,
    getClassGroupId: m,
    getConflictingClassGroupIds: w
  } = c, v = [], g = i.trim().split(tm);
  let b = "";
  for (let C = g.length - 1; C >= 0; C -= 1) {
    const _ = g[C], {
      modifiers: T,
      hasImportantModifier: V,
      baseClassName: E,
      maybePostfixModifierPosition: Y
    } = u(_);
    let j = !!Y, P = m(j ? E.substring(0, Y) : E);
    if (!P) {
      if (!j) {
        b = _ + (b.length > 0 ? " " + b : b);
        continue;
      }
      if (P = m(E), !P) {
        b = _ + (b.length > 0 ? " " + b : b);
        continue;
      }
      j = !1;
    }
    const R = Jf(T).join(":"), X = V ? R + Qc : R, W = X + P;
    if (v.includes(W))
      continue;
    v.push(W);
    const A = w(P, j);
    for (let K = 0; K < A.length; ++K) {
      const ne = A[K];
      v.push(X + ne);
    }
    b = _ + (b.length > 0 ? " " + b : b);
  }
  return b;
};
function nm() {
  let i = 0, c, u, m = "";
  for (; i < arguments.length; )
    (c = arguments[i++]) && (u = qc(c)) && (m && (m += " "), m += u);
  return m;
}
const qc = (i) => {
  if (typeof i == "string")
    return i;
  let c, u = "";
  for (let m = 0; m < i.length; m++)
    i[m] && (c = qc(i[m])) && (u && (u += " "), u += c);
  return u;
};
function lm(i, ...c) {
  let u, m, w, v = g;
  function g(C) {
    const _ = c.reduce((T, V) => V(T), i());
    return u = em(_), m = u.cache.get, w = u.cache.set, v = b, b(C);
  }
  function b(C) {
    const _ = m(C);
    if (_)
      return _;
    const T = rm(C, u);
    return w(C, T), T;
  }
  return function() {
    return v(nm.apply(null, arguments));
  };
}
const ye = (i) => {
  const c = (u) => u[i] || [];
  return c.isThemeGetter = !0, c;
}, Gc = /^\[(?:([a-z-]+):)?(.+)\]$/i, om = /^\d+\/\d+$/, im = /* @__PURE__ */ new Set(["px", "full", "screen"]), am = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, sm = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, um = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, cm = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, dm = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Ot = (i) => Jr(i) || im.has(i) || om.test(i), ir = (i) => en(i, "length", ym), Jr = (i) => !!i && !Number.isNaN(Number(i)), aa = (i) => en(i, "number", Jr), Hn = (i) => !!i && Number.isInteger(Number(i)), pm = (i) => i.endsWith("%") && Jr(i.slice(0, -1)), ee = (i) => Gc.test(i), ar = (i) => am.test(i), fm = /* @__PURE__ */ new Set(["length", "size", "percentage"]), mm = (i) => en(i, fm, Kc), hm = (i) => en(i, "position", Kc), gm = /* @__PURE__ */ new Set(["image", "url"]), xm = (i) => en(i, gm, km), vm = (i) => en(i, "", wm), Vn = () => !0, en = (i, c, u) => {
  const m = Gc.exec(i);
  return m ? m[1] ? typeof c == "string" ? m[1] === c : c.has(m[1]) : u(m[2]) : !1;
}, ym = (i) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  sm.test(i) && !um.test(i)
), Kc = () => !1, wm = (i) => cm.test(i), km = (i) => dm.test(i), bm = () => {
  const i = ye("colors"), c = ye("spacing"), u = ye("blur"), m = ye("brightness"), w = ye("borderColor"), v = ye("borderRadius"), g = ye("borderSpacing"), b = ye("borderWidth"), C = ye("contrast"), _ = ye("grayscale"), T = ye("hueRotate"), V = ye("invert"), E = ye("gap"), Y = ye("gradientColorStops"), j = ye("gradientColorStopPositions"), P = ye("inset"), R = ye("margin"), X = ye("opacity"), W = ye("padding"), A = ye("saturate"), K = ye("scale"), ne = ye("sepia"), Z = ye("skew"), fe = ye("space"), we = ye("translate"), _e = () => ["auto", "contain", "none"], Fe = () => ["auto", "hidden", "clip", "visible", "scroll"], Oe = () => ["auto", ee, c], oe = () => [ee, c], $e = () => ["", Ot, ir], Ue = () => ["auto", Jr, ee], et = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Me = () => ["solid", "dashed", "dotted", "double", "none"], ge = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], I = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], B = () => ["", "0", ee], D = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], h = () => [Jr, ee];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Vn],
      spacing: [Ot, ir],
      blur: ["none", "", ar, ee],
      brightness: h(),
      borderColor: [i],
      borderRadius: ["none", "", "full", ar, ee],
      borderSpacing: oe(),
      borderWidth: $e(),
      contrast: h(),
      grayscale: B(),
      hueRotate: h(),
      invert: B(),
      gap: oe(),
      gradientColorStops: [i],
      gradientColorStopPositions: [pm, ir],
      inset: Oe(),
      margin: Oe(),
      opacity: h(),
      padding: oe(),
      saturate: h(),
      scale: h(),
      sepia: B(),
      skew: h(),
      space: oe(),
      translate: oe()
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
        z: ["auto", Hn, ee]
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
        order: ["first", "last", "none", Hn, ee]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Vn]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Hn, ee]
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
        "grid-rows": [Vn]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Hn, ee]
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
        gap: [E]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [E]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [E]
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
        "space-x": [fe]
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
        "space-y": [fe]
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
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", ee, c]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [ee, c, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [ee, c, "none", "full", "min", "max", "fit", "prose", {
          screen: [ar]
        }, ar]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [ee, c, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [ee, c, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [ee, c, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [ee, c, "auto", "min", "max", "fit"]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", aa]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Vn]
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
        "line-clamp": ["none", Jr, aa]
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
        "placeholder-opacity": [X]
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
        "text-opacity": [X]
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
        indent: oe()
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
        "bg-opacity": [X]
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
        bg: [...et(), hm]
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
        bg: ["auto", "cover", "contain", mm]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, xm]
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
        from: [j]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [j]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [j]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [Y]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [Y]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [Y]
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
        "border-opacity": [X]
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
        "divide-opacity": [X]
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
        "ring-opacity": [X]
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
        shadow: ["", "inner", "none", ar, vm]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Vn]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [X]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...ge(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": ge()
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
        brightness: [m]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [C]
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
        grayscale: [_]
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
        saturate: [A]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [ne]
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
        "backdrop-brightness": [m]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [C]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [_]
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
        "backdrop-opacity": [X]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [A]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [ne]
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
        duration: h()
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
        delay: h()
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
        scale: [K]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [K]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [K]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [Hn, ee]
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
        "skew-x": [Z]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [Z]
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
        "scroll-m": oe()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": oe()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": oe()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": oe()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": oe()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": oe()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": oe()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": oe()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": oe()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": oe()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": oe()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": oe()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": oe()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": oe()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": oe()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": oe()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": oe()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": oe()
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
        stroke: [Ot, ir, aa]
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
}, jm = /* @__PURE__ */ lm(bm);
function Er(...i) {
  return jm(Bc(i));
}
const Sm = Wf(
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
), Yc = Q.forwardRef(
  ({ className: i, variant: c, size: u, asChild: m = !1, ...w }, v) => {
    const g = m ? Ff : "button";
    return /* @__PURE__ */ a.jsx(g, { className: Er(Sm({ variant: c, size: u, className: i })), ref: v, ...w });
  }
);
Yc.displayName = "Button";
const Xc = Q.forwardRef(
  ({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx("div", { className: "dt-relative dt-w-full dt-overflow-auto", children: /* @__PURE__ */ a.jsx("table", { ref: u, className: Er("dt-w-full dt-caption-bottom dt-text-sm", i), ...c }) })
);
Xc.displayName = "Table";
const Zc = Q.forwardRef(({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx("thead", { ref: u, className: Er("[&_tr]:dt-border-b", i), ...c }));
Zc.displayName = "TableHeader";
const Jc = Q.forwardRef(({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx("tbody", { ref: u, className: Er("[&_tr:last-child]:dt-border-0", i), ...c }));
Jc.displayName = "TableBody";
const ha = Q.forwardRef(
  ({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx(
    "tr",
    {
      ref: u,
      className: Er(
        "dt-border-b dt-transition-colors hover:dt-bg-muted/50 data-[state=selected]:dt-bg-muted",
        i
      ),
      ...c
    }
  )
);
ha.displayName = "TableRow";
const Et = Q.forwardRef(({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx(
  "th",
  {
    ref: u,
    className: Er(
      "dt-h-12 dt-px-4 dt-text-left dt-align-middle dt-font-medium dt-text-muted-foreground [&:has([role=checkbox])]:dt-pr-0",
      i
    ),
    ...c
  }
));
Et.displayName = "TableHead";
const Nt = Q.forwardRef(({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx(
  "td",
  {
    ref: u,
    className: Er("dt-p-4 dt-align-middle [&:has([role=checkbox])]:dt-pr-0", i),
    ...c
  }
));
Nt.displayName = "TableCell";
function _c(i) {
  return i ? i.split(" | ").map((c) => c.replace("/", "-")) : ["·"];
}
function Cm({
  label: i,
  active: c,
  dir: u,
  onClick: m
}) {
  const w = c ? u === 1 ? kf : yf : wf;
  return /* @__PURE__ */ a.jsxs(Yc, { variant: "ghost", size: "sm", onClick: m, className: "th-sort dt--ml-3", children: [
    i,
    /* @__PURE__ */ a.jsx(w, { className: `dt-ml-1.5 dt-inline dt-size-3.5${c ? "" : " dt-opacity-40"}` })
  ] });
}
function ed(i) {
  const { rows: c, sortKey: u, sortDir: m, onSortChange: w, onRowClick: v, onToggleSelect: g, onToggleFavorite: b, allSelected: C, onSelectAll: _, emptyMessage: T, ariaLabel: V, labels: E } = i;
  if (!c.length)
    return /* @__PURE__ */ a.jsx("p", { className: "dt-p-6 dt-text-center dt-text-sm dt-text-muted-foreground", children: T });
  const Y = (j, P) => /* @__PURE__ */ a.jsx(Cm, { label: P, active: u === j, dir: m, onClick: () => w(j) });
  return /* @__PURE__ */ a.jsx("div", { id: "results", className: "dersler-table-root dt-overflow-hidden dt-rounded-lg dt-border dt-border-border", children: /* @__PURE__ */ a.jsxs(Xc, { "aria-label": V, children: [
    /* @__PURE__ */ a.jsx(Zc, { children: /* @__PURE__ */ a.jsxs(ha, { children: [
      /* @__PURE__ */ a.jsx(Et, { className: "dt-h-9 dt-w-8 dt-p-2", children: /* @__PURE__ */ a.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: C,
          "aria-label": E.selectAll,
          onChange: (j) => _(j.target.checked)
        }
      ) }),
      /* @__PURE__ */ a.jsx(Et, { className: "dt-h-9 dt-w-8 dt-p-2" }),
      /* @__PURE__ */ a.jsx(Et, { className: "dt-h-9 dt-p-2", "data-sort": "crn", "aria-sort": u === "crn" ? m === 1 ? "ascending" : "descending" : "none", children: Y("crn", E.crn) }),
      /* @__PURE__ */ a.jsx(Et, { className: "dt-h-9 dt-p-2", "data-sort": "code", "aria-sort": u === "code" ? m === 1 ? "ascending" : "descending" : "none", children: Y("code", E.code) }),
      /* @__PURE__ */ a.jsx(Et, { className: "dt-h-9 dt-p-2", "data-sort": "name", "aria-sort": u === "name" ? m === 1 ? "ascending" : "descending" : "none", children: Y("name", E.name) }),
      /* @__PURE__ */ a.jsx(Et, { className: "dt-h-9 dt-p-2", "data-sort": "instructor", "aria-sort": u === "instructor" ? m === 1 ? "ascending" : "descending" : "none", children: Y("instructor", E.instructor) }),
      /* @__PURE__ */ a.jsx(Et, { className: "dt-h-9 dt-p-2", "data-sort": "when", "aria-sort": u === "when" ? m === 1 ? "ascending" : "descending" : "none", children: Y("when", E.when) }),
      /* @__PURE__ */ a.jsx(Et, { className: "dt-h-9 dt-p-2", children: E.where }),
      /* @__PURE__ */ a.jsx(Et, { className: "dt-h-9 dt-p-2 dt-text-right", "data-sort": "fill", "aria-sort": u === "fill" ? m === 1 ? "ascending" : "descending" : "none", children: Y("fill", E.fill) })
    ] }) }),
    /* @__PURE__ */ a.jsx(Jc, { id: "rows", children: c.map((j) => /* @__PURE__ */ a.jsxs(ha, { className: "dt-cursor-pointer", onClick: () => v(j.key), children: [
      /* @__PURE__ */ a.jsx(Nt, { className: "dt-p-2", onClick: (P) => P.stopPropagation(), children: /* @__PURE__ */ a.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: j.selected,
          "aria-label": E.selectSection,
          onChange: (P) => g(j.key, P.target.checked)
        }
      ) }),
      /* @__PURE__ */ a.jsx(Nt, { className: "dt-p-2", onClick: (P) => P.stopPropagation(), children: /* @__PURE__ */ a.jsx(
        "button",
        {
          type: "button",
          className: "dt-text-base dt-leading-none",
          "aria-label": j.favorite ? E.removeFav : E.addFav,
          "aria-pressed": j.favorite,
          onClick: () => b(j.key),
          children: /* @__PURE__ */ a.jsx(Rf, { "aria-hidden": "true", className: "dt-size-4", fill: j.favorite ? "currentColor" : "none" })
        }
      ) }),
      /* @__PURE__ */ a.jsx(Nt, { className: "dt-p-2 dt-font-mono dt-text-muted-foreground", dangerouslySetInnerHTML: { __html: j.crnHTML } }),
      /* @__PURE__ */ a.jsx(Nt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: j.codeHTML } }),
      /* @__PURE__ */ a.jsx(Nt, { className: "dt-p-2", children: /* @__PURE__ */ a.jsxs("div", { className: "dt-course-name", children: [
        /* @__PURE__ */ a.jsx("span", { dangerouslySetInnerHTML: { __html: j.nameHTML } }),
        j.kind && /* @__PURE__ */ a.jsxs("span", { className: `dt-kind-badge ${j.kind}`, title: j.kindHelp, children: [
          j.kind === "extra-exam" ? /* @__PURE__ */ a.jsx(ua, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(Wn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsx("b", { children: j.kindLabel })
        ] })
      ] }) }),
      /* @__PURE__ */ a.jsx(Nt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: j.instructorHTML } }),
      /* @__PURE__ */ a.jsx(Nt, { className: "dt-p-2 dt-font-mono dt-text-xs", children: _c(j.when).map((P, R) => /* @__PURE__ */ a.jsx("div", { children: P }, R)) }),
      /* @__PURE__ */ a.jsx(Nt, { className: "dt-p-2 dt-text-xs dt-text-muted-foreground", children: j.where ? _c(j.where).map((P, R) => /* @__PURE__ */ a.jsx("div", { children: P }, R)) : "·" }),
      /* @__PURE__ */ a.jsx(Nt, { className: "dt-p-2 dt-text-right dt-tabular-nums", dangerouslySetInnerHTML: { __html: j.quotaHTML } })
    ] }, j.key)) })
  ] }) });
}
const Sr = (i) => `${String(Math.floor(i / 60)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`;
function td(i) {
  const c = [...i].sort((v, g) => v.start - g.start || v.end - g.end), u = [], m = c.map((v) => {
    let g = u.findIndex((b) => b <= v.start);
    return g < 0 ? (g = u.length, u.push(v.end)) : u[g] = v.end, { ...v, lane: g, laneCount: 1, conflict: !1 };
  }), w = Math.max(1, u.length);
  return m.map((v) => ({
    ...v,
    laneCount: w,
    conflict: m.some((g) => g.key !== v.key && v.start < g.end && g.start < v.end)
  }));
}
function Em() {
  const i = "(max-width: 600px)", [c, u] = Q.useState(() => window.matchMedia(i).matches);
  return Q.useEffect(() => {
    const m = window.matchMedia(i), w = () => u(m.matches);
    return m.addEventListener("change", w), () => m.removeEventListener("change", w);
  }, []), c;
}
function rd({ session: i, compact: c = !1 }) {
  return /* @__PURE__ */ a.jsxs("span", { className: "pp-session-meta", children: [
    /* @__PURE__ */ a.jsxs("span", { children: [
      /* @__PURE__ */ a.jsx(Qn, { "aria-hidden": "true" }),
      Sr(i.start),
      "–",
      Sr(i.end)
    ] }),
    /* @__PURE__ */ a.jsxs("span", { children: [
      /* @__PURE__ */ a.jsx(va, { "aria-hidden": "true" }),
      i.crn
    ] }),
    !c && i.instructor && /* @__PURE__ */ a.jsxs("span", { children: [
      /* @__PURE__ */ a.jsx(ur, { "aria-hidden": "true" }),
      i.instructor
    ] }),
    !c && i.where && /* @__PURE__ */ a.jsxs("span", { children: [
      /* @__PURE__ */ a.jsx(qn, { "aria-hidden": "true" }),
      i.where
    ] })
  ] });
}
function Nm({ props: i, visibleDays: c }) {
  const u = c.find((g) => i.sessions.some((b) => b.day === g)) ?? c[0], [m, w] = Q.useState(u);
  Q.useEffect(() => {
    c.includes(m) || w(u);
  }, [m, u, c]);
  const v = td(i.sessions.filter((g) => g.day === m));
  return /* @__PURE__ */ a.jsxs("div", { className: "pp-agenda", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pp-day-tabs tt-daytabs", role: "tablist", "aria-label": i.labels.title, style: { "--pp-days": c.length }, children: c.map((g) => /* @__PURE__ */ a.jsxs("button", { type: "button", role: "tab", "aria-selected": m === g, className: m === g ? "is-active active tt-daytab" : "tt-daytab", onClick: () => w(g), children: [
      i.dayLabels[g],
      i.sessions.some((b) => b.day === g) && /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true" })
    ] }, g)) }),
    /* @__PURE__ */ a.jsx("div", { className: "pp-agenda-list", children: v.length ? v.map((g) => /* @__PURE__ */ a.jsxs(
      "button",
      {
        type: "button",
        className: `pp-agenda-card p-agenda-session${g.conflict ? " is-conflict" : ""}`,
        style: { "--pp-color": g.color },
        onClick: () => i.onOpen(g.rowKey),
        children: [
          /* @__PURE__ */ a.jsxs("span", { className: "pp-agenda-time", children: [
            /* @__PURE__ */ a.jsx("b", { children: Sr(g.start) }),
            /* @__PURE__ */ a.jsx("small", { children: Sr(g.end) })
          ] }),
          /* @__PURE__ */ a.jsxs("span", { className: "pp-agenda-copy", children: [
            /* @__PURE__ */ a.jsxs("strong", { children: [
              /* @__PURE__ */ a.jsx("span", { className: "pp-color-dot" }),
              g.code
            ] }),
            /* @__PURE__ */ a.jsx("span", { className: "pp-agenda-name", children: g.name }),
            /* @__PURE__ */ a.jsx(rd, { session: g, compact: !0 }),
            g.instructor && /* @__PURE__ */ a.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ a.jsx(ur, { "aria-hidden": "true" }),
              g.instructor
            ] }),
            g.where && /* @__PURE__ */ a.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ a.jsx(qn, { "aria-hidden": "true" }),
              g.where
            ] }),
            g.conflict && /* @__PURE__ */ a.jsxs("em", { children: [
              /* @__PURE__ */ a.jsx(Rc, { "aria-hidden": "true" }),
              i.labels.conflict
            ] })
          ] })
        ]
      },
      g.key
    )) : /* @__PURE__ */ a.jsxs("div", { className: "pp-empty-day", children: [
      /* @__PURE__ */ a.jsx(Bn, { "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsx("p", { children: i.labels.emptyDay })
    ] }) })
  ] });
}
function nd(i) {
  const c = Em(), [u, m] = Q.useState(null), [w, v] = Q.useState(null), g = i.sessions.some((A) => A.day >= 5), b = i.showWeekend || g ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4], C = i.sessions.length > 0, _ = Q.useMemo(() => {
    if (!C) return { start: 480, end: 1080 };
    const A = Math.min(...i.sessions.map((ne) => ne.start)), K = Math.max(...i.sessions.map((ne) => ne.end));
    return i.showFullDay ? { start: 420, end: 1380 } : { start: Math.min(510, A), end: Math.min(1440, K + 60) };
  }, [i.sessions, i.showFullDay, C]), T = 34, V = Math.max(1, Math.ceil((_.end - _.start) / 30)), E = V * T, Y = /* @__PURE__ */ new Date(), j = (Y.getDay() + 6) % 7, P = Y.getHours() * 60 + Y.getMinutes(), R = (P - _.start) / 30 * T;
  Q.useEffect(() => {
    if (!u) return;
    const A = () => m(null);
    return window.addEventListener("pointerdown", A, { once: !0 }), window.addEventListener("blur", A, { once: !0 }), () => {
      window.removeEventListener("pointerdown", A), window.removeEventListener("blur", A);
    };
  }, [u]);
  const X = (A, K) => {
    A.preventDefault(), A.stopPropagation(), m({ session: K, x: Math.min(A.clientX, window.innerWidth - 232), y: Math.min(A.clientY, window.innerHeight - 230) });
  }, W = (A, K) => {
    const ne = A.getBoundingClientRect(), Z = 286, fe = Math.max(10, Math.min(ne.left + ne.width / 2 - Z / 2, window.innerWidth - Z - 10)), we = ne.top < 190;
    v({ session: K, x: fe, y: we ? ne.bottom + 9 : ne.top - 9, side: we ? "bottom" : "top" });
  };
  return /* @__PURE__ */ a.jsxs("section", { className: "dersler-table-root program-planner-root", "aria-label": i.labels.title, children: [
    /* @__PURE__ */ a.jsxs("header", { className: "pp-heading", children: [
      /* @__PURE__ */ a.jsx("span", { className: "pp-heading-icon", children: /* @__PURE__ */ a.jsx(Bn, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ a.jsxs("span", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: i.labels.title }),
        /* @__PURE__ */ a.jsxs("small", { children: [
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
    !C && !i.untimed.length ? /* @__PURE__ */ a.jsxs("div", { className: "pp-empty", children: [
      /* @__PURE__ */ a.jsx(ya, { "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsx("strong", { children: i.labels.empty })
    ] }) : c && !i.forceGrid ? /* @__PURE__ */ a.jsx(Nm, { props: i, visibleDays: b }) : C ? /* @__PURE__ */ a.jsx("div", { className: "pp-calendar-scroll", children: /* @__PURE__ */ a.jsxs("div", { className: "pp-calendar", style: { "--pp-days": b.length }, children: [
      /* @__PURE__ */ a.jsxs("div", { className: "pp-calendar-head", children: [
        /* @__PURE__ */ a.jsx("span", {}),
        b.map((A) => /* @__PURE__ */ a.jsx("b", { children: i.dayLabels[A] }, A))
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "pp-calendar-body", children: [
        /* @__PURE__ */ a.jsx("div", { className: "pp-time-column", style: { height: E }, children: Array.from({ length: V }, (A, K) => /* @__PURE__ */ a.jsx("span", { children: Sr(_.start + K * 30) }, K)) }),
        b.map((A) => {
          const K = td(i.sessions.filter((Z) => Z.day === A)), ne = i.showNow && A === j && P >= _.start && P < _.end;
          return /* @__PURE__ */ a.jsxs("div", { className: `pp-day-column${A >= 5 ? " is-weekend" : ""}`, style: { height: E }, children: [
            ne && /* @__PURE__ */ a.jsx("span", { className: "pp-now", style: { top: R } }),
            K.map((Z) => {
              const fe = (Z.start - _.start) / 30 * T, we = Math.max(30, (Z.end - Z.start) / 30 * T), _e = 100 / Z.laneCount, Fe = we < 104;
              return /* @__PURE__ */ a.jsxs(
                "button",
                {
                  type: "button",
                  className: `pp-session tt-block${Fe ? " is-short" : ""}${Z.conflict ? " is-conflict" : ""}`,
                  style: {
                    top: fe,
                    height: we,
                    left: `calc(${Z.lane * _e}% + 3px)`,
                    width: `calc(${_e}% - 6px)`,
                    "--pp-color": Z.color,
                    "--pp-foreground": Z.foreground
                  },
                  "aria-describedby": (w == null ? void 0 : w.session.key) === Z.key ? "pp-course-tooltip" : void 0,
                  onClick: () => i.onOpen(Z.rowKey),
                  onContextMenu: (Oe) => X(Oe, Z),
                  onMouseEnter: (Oe) => W(Oe.currentTarget, Z),
                  onMouseLeave: () => v(null),
                  onFocus: (Oe) => W(Oe.currentTarget, Z),
                  onBlur: () => v(null),
                  children: [
                    /* @__PURE__ */ a.jsx(Pf, { className: "pp-pin", "aria-hidden": "true" }),
                    /* @__PURE__ */ a.jsxs("strong", { children: [
                      Z.code,
                      ": ",
                      /* @__PURE__ */ a.jsx("span", { children: Z.name })
                    ] }),
                    /* @__PURE__ */ a.jsx(rd, { session: Z, compact: Fe }),
                    Z.conflict && /* @__PURE__ */ a.jsxs("span", { className: "pp-conflict", children: [
                      /* @__PURE__ */ a.jsx(Rc, { "aria-hidden": "true" }),
                      i.labels.conflict
                    ] }),
                    /* @__PURE__ */ a.jsx(Tc, { className: "pp-more", "aria-hidden": "true" })
                  ]
                },
                Z.key
              );
            })
          ] }, A);
        })
      ] })
    ] }) }) : null,
    !!i.untimed.length && /* @__PURE__ */ a.jsxs("div", { className: "pp-untimed", children: [
      /* @__PURE__ */ a.jsx(Wn, { "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: i.untimed.some((A) => A.special) ? i.labels.special : i.labels.unknown }),
        i.untimed.map((A) => /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("b", { children: A.code }),
          " · CRN ",
          A.crn,
          " — ",
          A.detail
        ] }, A.key))
      ] })
    ] }),
    u && /* @__PURE__ */ a.jsxs("div", { className: "pp-context", role: "menu", "aria-label": `${u.session.code} ${i.labels.actions}`, style: { left: u.x, top: u.y }, onPointerDown: (A) => A.stopPropagation(), children: [
      /* @__PURE__ */ a.jsxs("p", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: u.session.code }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          "CRN ",
          u.session.crn
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        i.onOpen(u.session.rowKey), m(null);
      }, children: [
        /* @__PURE__ */ a.jsx(Bn, {}),
        i.labels.details
      ] }),
      /* @__PURE__ */ a.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        i.onCopyCrn(u.session.rowKey), m(null);
      }, children: [
        /* @__PURE__ */ a.jsx(sa, {}),
        i.labels.copyCrn
      ] }),
      /* @__PURE__ */ a.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        i.onOpenObs(u.session.rowKey), m(null);
      }, children: [
        /* @__PURE__ */ a.jsx(xa, {}),
        i.labels.openObs
      ] }),
      /* @__PURE__ */ a.jsxs("button", { type: "button", role: "menuitem", className: "is-danger", onClick: () => {
        i.onRemove(u.session.rowKey), m(null);
      }, children: [
        /* @__PURE__ */ a.jsx(da, {}),
        i.labels.remove
      ] })
    ] }),
    w && /* @__PURE__ */ a.jsxs("div", { id: "pp-course-tooltip", className: "pp-tooltip", role: "tooltip", style: { left: w.x, top: w.y }, "data-side": w.side, children: [
      /* @__PURE__ */ a.jsxs("div", { className: "pp-tooltip-title", children: [
        /* @__PURE__ */ a.jsx("span", { style: { background: w.session.color } }),
        /* @__PURE__ */ a.jsx("strong", { children: w.session.code }),
        /* @__PURE__ */ a.jsxs("b", { children: [
          Sr(w.session.start),
          "–",
          Sr(w.session.end)
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("p", { children: w.session.name }),
      /* @__PURE__ */ a.jsxs("dl", { children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("dt", { children: /* @__PURE__ */ a.jsx(va, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ a.jsx("dd", { children: w.session.crn })
        ] }),
        w.session.instructor && /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("dt", { children: /* @__PURE__ */ a.jsx(ur, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ a.jsx("dd", { children: w.session.instructor })
        ] }),
        w.session.where && /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("dt", { children: /* @__PURE__ */ a.jsx(qn, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ a.jsx("dd", { children: w.session.where })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("small", { children: [
        i.labels.details,
        " · sağ tık: ",
        i.labels.actions
      ] })
    ] })
  ] });
}
function ld({ html: i, empty: c, emptyMessage: u, ariaLabel: m }) {
  const w = Q.useRef(null), v = Q.useRef(null), g = Q.useRef(null), [b, C] = Q.useState(null);
  Q.useLayoutEffect(() => {
    const j = w.current;
    if (!j) return;
    [...j.querySelectorAll("select.dp-grade")].forEach((R, X) => {
      var K, ne;
      R.hidden = !0, R.tabIndex = -1;
      const W = document.createElement("button");
      W.type = "button", W.className = `cp-grade-trigger${R.value ? " filled" : ""}`, W.dataset.gradeIndex = String(X), W.setAttribute("aria-haspopup", "listbox"), W.setAttribute("aria-expanded", "false"), W.setAttribute("aria-label", R.getAttribute("aria-label") || "Not seç");
      const A = document.createElement("span");
      A.textContent = ((K = R.selectedOptions[0]) == null ? void 0 : K.textContent) || ((ne = R.options[0]) == null ? void 0 : ne.textContent) || "—", W.appendChild(A), W.insertAdjacentHTML("beforeend", '<svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'), R.insertAdjacentElement("afterend", W);
    });
  }, [i]), Q.useEffect(() => C(null), [i]), Q.useEffect(() => {
    if (!b) return;
    const j = (X) => {
      var A, K;
      const W = X.target;
      (A = g.current) != null && A.contains(W) || (K = v.current) != null && K.contains(W) || C(null);
    }, P = () => C(null);
    window.addEventListener("pointerdown", j);
    const R = window.matchMedia("(min-width: 561px)").matches;
    return R && window.addEventListener("scroll", P, !0), window.addEventListener("resize", P), b.keyboard && requestAnimationFrame(() => {
      var X, W;
      return (W = (X = g.current) == null ? void 0 : X.querySelector('[aria-selected="true"]')) == null ? void 0 : W.focus({ preventScroll: !0 });
    }), () => {
      window.removeEventListener("pointerdown", j), R && window.removeEventListener("scroll", P, !0), window.removeEventListener("resize", P);
    };
  }, [b]);
  const _ = (j, P = !1) => {
    var fe, we;
    const R = Number(j.dataset.gradeIndex), X = (fe = w.current) == null ? void 0 : fe.querySelectorAll("select.dp-grade")[R];
    if (!X) return;
    const W = j.getBoundingClientRect(), A = 246, K = window.innerHeight - W.bottom < A && W.top > A, ne = Math.min(292, window.innerWidth - 20), Z = Math.max(10, Math.min(W.right - ne, window.innerWidth - ne - 10));
    (we = v.current) == null || we.setAttribute("aria-expanded", "false"), v.current = j, j.setAttribute("aria-expanded", "true"), C({
      selectIndex: R,
      options: [...X.options].map((_e) => ({ value: _e.value, label: _e.textContent || _e.value })),
      value: X.value,
      label: X.getAttribute("aria-label") || "Not seç",
      x: Z,
      y: K ? W.top - 7 : W.bottom + 7,
      above: K,
      keyboard: P
    });
  }, T = (j) => {
    const P = j.target.closest(".cp-grade-trigger");
    if (P) {
      if (j.preventDefault(), P === v.current && b) {
        P.setAttribute("aria-expanded", "false"), C(null);
        return;
      }
      _(P);
    }
  }, V = (j) => {
    var R;
    if (j.key === "Escape" && b) {
      j.preventDefault(), (R = v.current) == null || R.setAttribute("aria-expanded", "false"), C(null);
      return;
    }
    const P = j.target.closest(".cp-grade-trigger");
    !P || !["Enter", " ", "ArrowDown", "ArrowUp"].includes(j.key) || (j.preventDefault(), _(P, !0));
  }, E = (j) => {
    var A, K, ne, Z, fe;
    if (!b) return;
    const P = (A = w.current) == null ? void 0 : A.querySelectorAll("select.dp-grade")[b.selectIndex];
    if (!P) return;
    P.value = j, P.dispatchEvent(new Event("change", { bubbles: !0 }));
    const R = ((K = P.selectedOptions[0]) == null ? void 0 : K.textContent) || ((ne = P.options[0]) == null ? void 0 : ne.textContent) || "—", X = v.current, W = X == null ? void 0 : X.querySelector("span");
    W && (W.textContent = R), X == null || X.classList.toggle("filled", !!j), (Z = v.current) == null || Z.setAttribute("aria-expanded", "false"), (fe = v.current) == null || fe.focus(), C(null);
  }, Y = (j) => {
    var W, A, K;
    if (j.key === "Escape") {
      j.preventDefault(), (W = v.current) == null || W.setAttribute("aria-expanded", "false"), (A = v.current) == null || A.focus(), C(null);
      return;
    }
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(j.key)) return;
    j.preventDefault();
    const P = [...j.currentTarget.querySelectorAll('[role="option"]')], R = Math.max(0, P.indexOf(document.activeElement)), X = j.key === "ArrowDown" || j.key === "ArrowRight" ? 1 : -1;
    (K = P[(R + X + P.length) % P.length]) == null || K.focus();
  };
  return c ? /* @__PURE__ */ a.jsxs("div", { className: "curriculum-plan-root cp-empty", role: "status", children: [
    /* @__PURE__ */ a.jsx(ya, { "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsx("strong", { children: u })
  ] }) : /* @__PURE__ */ a.jsxs("section", { className: "curriculum-plan-root", "aria-label": m, onClick: T, onKeyDown: V, children: [
    /* @__PURE__ */ a.jsx("div", { ref: w, className: "cp-semester-grid", dangerouslySetInnerHTML: { __html: i } }),
    b && /* @__PURE__ */ a.jsx(
      "div",
      {
        ref: g,
        className: `cp-grade-menu${b.above ? " above" : ""}`,
        role: "listbox",
        "aria-label": b.label,
        style: { "--cp-menu-x": `${b.x}px`, "--cp-menu-y": `${b.y}px` },
        onKeyDown: Y,
        children: b.options.map((j) => /* @__PURE__ */ a.jsxs(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": j.value === b.value,
            className: j.value ? "" : "is-empty",
            onClick: () => E(j.value),
            children: [
              /* @__PURE__ */ a.jsx("span", { children: j.label }),
              j.value === b.value && /* @__PURE__ */ a.jsx(Cf, { "aria-hidden": "true" })
            ]
          },
          j.value || "empty"
        ))
      }
    )
  ] });
}
function zm() {
  const i = "(max-width: 700px)", [c, u] = Q.useState(() => window.matchMedia(i).matches);
  return Q.useEffect(() => {
    const m = window.matchMedia(i), w = () => u(m.matches);
    return m.addEventListener("change", w), () => m.removeEventListener("change", w);
  }, []), c;
}
function _m({ message: i }) {
  return /* @__PURE__ */ a.jsxs("div", { className: "ex-empty", children: [
    /* @__PURE__ */ a.jsx(ya, { "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsx("strong", { children: i })
  ] });
}
function Mm({ props: i }) {
  return /* @__PURE__ */ a.jsxs("div", { className: "ex-table", role: "table", "aria-label": i.ariaLabel, children: [
    /* @__PURE__ */ a.jsxs("div", { className: `ex-head${i.showPlace ? "" : " without-place"}`, role: "row", children: [
      /* @__PURE__ */ a.jsx("span", { role: "columnheader", children: i.labels.course }),
      /* @__PURE__ */ a.jsx("span", { role: "columnheader", children: i.labels.instructor }),
      /* @__PURE__ */ a.jsx("span", { role: "columnheader", children: i.labels.type }),
      i.showPlace && /* @__PURE__ */ a.jsx("span", { role: "columnheader", children: i.labels.place }),
      /* @__PURE__ */ a.jsxs("span", { role: "columnheader", children: [
        i.labels.date,
        " / ",
        i.labels.time
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("div", { role: "rowgroup", children: i.rows.map((c) => /* @__PURE__ */ a.jsxs("div", { className: `ex-row${i.showPlace ? "" : " without-place"}`, role: "row", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "ex-course", role: "cell", children: [
        /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => i.onOpen(c.code), children: c.code }),
        /* @__PURE__ */ a.jsx("strong", { children: c.name }),
        /* @__PURE__ */ a.jsxs("small", { children: [
          /* @__PURE__ */ a.jsx(va, { "aria-hidden": "true" }),
          c.crn
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ a.jsx(ur, { "aria-hidden": "true" }),
        c.instructor || "·"
      ] }),
      /* @__PURE__ */ a.jsx("span", { role: "cell", children: /* @__PURE__ */ a.jsx("em", { className: "ex-type", children: c.type }) }),
      i.showPlace && /* @__PURE__ */ a.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ a.jsx(qn, { "aria-hidden": "true" }),
        c.place || "·"
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "ex-when", role: "cell", children: [
        /* @__PURE__ */ a.jsxs("strong", { children: [
          /* @__PURE__ */ a.jsx(Bn, { "aria-hidden": "true" }),
          c.date
        ] }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(Qn, { "aria-hidden": "true" }),
          c.day,
          " ",
          c.time
        ] })
      ] })
    ] }, c.key)) })
  ] });
}
function Pm({ props: i }) {
  const c = Q.useMemo(() => {
    const u = [], m = /* @__PURE__ */ new Map();
    return i.rows.forEach((w) => {
      let v = m.get(w.date);
      v || (v = { date: w.date, day: w.day, exams: [] }, m.set(w.date, v), u.push(v)), v.exams.push(w);
    }), u;
  }, [i.rows]);
  return /* @__PURE__ */ a.jsx("div", { className: "ex-agenda", "aria-label": i.ariaLabel, children: c.map((u) => /* @__PURE__ */ a.jsxs("section", { className: "ex-day", children: [
    /* @__PURE__ */ a.jsxs("header", { children: [
      /* @__PURE__ */ a.jsx(Bn, { "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsx("strong", { children: u.date }),
      /* @__PURE__ */ a.jsx("span", { children: u.day })
    ] }),
    /* @__PURE__ */ a.jsx("div", { children: u.exams.map((m) => /* @__PURE__ */ a.jsxs("article", { className: "ex-card", children: [
      /* @__PURE__ */ a.jsxs("span", { className: "ex-card-time", children: [
        /* @__PURE__ */ a.jsx(Qn, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsx("b", { children: m.time })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "ex-card-main", children: [
        /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => i.onOpen(m.code), children: m.code }),
        /* @__PURE__ */ a.jsx("strong", { children: m.name }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(Wn, { "aria-hidden": "true" }),
          m.type,
          /* @__PURE__ */ a.jsx("i", { "aria-hidden": "true" }),
          "CRN ",
          m.crn
        ] }),
        m.instructor && /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(ur, { "aria-hidden": "true" }),
          m.instructor
        ] }),
        i.showPlace && m.place && /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(qn, { "aria-hidden": "true" }),
          m.place
        ] })
      ] })
    ] }, m.key)) })
  ] }, u.date)) });
}
function od(i) {
  const c = zm();
  return /* @__PURE__ */ a.jsx("section", { className: "dersler-table-root exams-list-root", children: i.rows.length ? c ? /* @__PURE__ */ a.jsx(Pm, { props: i }) : /* @__PURE__ */ a.jsx(Mm, { props: i }) : /* @__PURE__ */ a.jsx(_m, { message: i.emptyMessage }) });
}
function id({ items: i, labels: c, onOpen: u, onCopy: m, onOpenObs: w, onRemove: v, onReorder: g }) {
  const [b, C] = Q.useState(null), [_, T] = Q.useState(null);
  if (!i.length) return /* @__PURE__ */ a.jsxs("div", { className: "pcl-empty empty", children: [
    /* @__PURE__ */ a.jsx(ao, { "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsx("strong", { children: c.empty })
  ] });
  const V = (E, Y) => {
    E.preventDefault(), _ !== null && _ !== Y && g(_, Y), T(null);
  };
  return /* @__PURE__ */ a.jsxs("div", { className: "pcl-list", role: "table", onKeyDown: (E) => {
    E.key === "Escape" && C(null);
  }, children: [
    /* @__PURE__ */ a.jsxs("div", { className: "pcl-head p-list-head", role: "row", children: [
      /* @__PURE__ */ a.jsx("span", { role: "columnheader", children: c.course }),
      /* @__PURE__ */ a.jsx("span", { role: "columnheader", children: c.quota })
    ] }),
    i.map((E, Y) => /* @__PURE__ */ a.jsxs(
      "article",
      {
        className: `pcl-item p-item${E.full ? " is-full" : ""}`,
        role: "row",
        draggable: !0,
        onDragStart: () => T(Y),
        onDragOver: (j) => j.preventDefault(),
        onDrop: (j) => V(j, Y),
        onClick: (j) => {
          j.target.closest("button") || u(E.key);
        },
        children: [
          /* @__PURE__ */ a.jsx(zf, { className: "pcl-grip", "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsxs("div", { className: "pcl-course", role: "cell", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "pcl-title", children: [
              /* @__PURE__ */ a.jsx("strong", { className: "p-code", children: E.code }),
              E.badge && /* @__PURE__ */ a.jsx("span", { children: E.badge })
            ] }),
            /* @__PURE__ */ a.jsx("p", { children: E.name }),
            /* @__PURE__ */ a.jsxs("div", { className: "pcl-meta", children: [
              /* @__PURE__ */ a.jsxs("span", { className: "p-when", children: [
                /* @__PURE__ */ a.jsx(Qn, { "aria-hidden": "true" }),
                E.when
              ] }),
              /* @__PURE__ */ a.jsxs("span", { children: [
                /* @__PURE__ */ a.jsx(ur, { "aria-hidden": "true" }),
                E.instructor
              ] })
            ] }),
            E.credit && /* @__PURE__ */ a.jsx("small", { children: E.credit })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "pcl-numbers p-crn", role: "cell", children: [
            /* @__PURE__ */ a.jsx("b", { children: E.quota }),
            /* @__PURE__ */ a.jsxs("span", { children: [
              "CRN ",
              E.crn
            ] }),
            E.backup && /* @__PURE__ */ a.jsx("em", { children: E.backup })
          ] }),
          /* @__PURE__ */ a.jsx("button", { className: "pcl-remove p-remove", type: "button", onClick: () => v(E.key), "aria-label": `${E.code} ${c.remove}`, children: /* @__PURE__ */ a.jsx(da, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ a.jsxs("div", { className: "pcl-menu-wrap", children: [
            /* @__PURE__ */ a.jsxs("button", { className: "pcl-menu-trigger p-menu", type: "button", "aria-expanded": b === E.key, "aria-haspopup": "menu", onClick: () => C(b === E.key ? null : E.key), children: [
              /* @__PURE__ */ a.jsx(Tc, { "aria-hidden": "true" }),
              /* @__PURE__ */ a.jsxs("span", { className: "sr-only", children: [
                E.code,
                " ",
                c.actions
              ] })
            ] }),
            b === E.key && /* @__PURE__ */ a.jsxs("div", { className: "pcl-menu p-menu-pop", role: "menu", children: [
              /* @__PURE__ */ a.jsxs("button", { role: "menuitem", onClick: () => {
                u(E.key), C(null);
              }, children: [
                /* @__PURE__ */ a.jsx(ao, {}),
                c.details
              ] }),
              /* @__PURE__ */ a.jsxs("button", { role: "menuitem", "data-act": "copy-crn", onClick: () => {
                m(E.key, "crn"), C(null);
              }, children: [
                /* @__PURE__ */ a.jsx(sa, {}),
                c.copyCrn
              ] }),
              /* @__PURE__ */ a.jsxs("button", { role: "menuitem", "data-act": "copy-code", onClick: () => {
                m(E.key, "code"), C(null);
              }, children: [
                /* @__PURE__ */ a.jsx(sa, {}),
                c.copyCode
              ] }),
              E.instructor && /* @__PURE__ */ a.jsxs("button", { role: "menuitem", "data-act": "copy-instructor", onClick: () => {
                m(E.key, "instructor"), C(null);
              }, children: [
                /* @__PURE__ */ a.jsx(ur, {}),
                c.copyInstructor
              ] }),
              /* @__PURE__ */ a.jsxs("button", { role: "menuitem", onClick: () => {
                w(E.key), C(null);
              }, children: [
                /* @__PURE__ */ a.jsx(xa, {}),
                c.openObs
              ] }),
              /* @__PURE__ */ a.jsxs("button", { role: "menuitem", "data-act": "remove", className: "is-danger", onClick: () => {
                v(E.key), C(null);
              }, children: [
                /* @__PURE__ */ a.jsx(da, {}),
                c.remove
              ] })
            ] })
          ] })
        ]
      },
      E.key
    ))
  ] });
}
const Lm = { overview: ao, sections: _f, catalog: Mf, history: ca };
function Tm({ data: i }) {
  const [c, u] = Q.useState("required"), m = [
    { key: "required", label: i.requiredLabel, icon: Nf },
    { key: "unlocks", label: i.unlocksLabel, icon: Tf }
  ], w = (v, g) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(v.key)) return;
    v.preventDefault();
    const b = v.key === "Home" ? 0 : v.key === "End" ? m.length - 1 : (g + (v.key === "ArrowRight" ? 1 : -1) + m.length) % m.length;
    u(m[b].key), requestAnimationFrame(() => {
      var C;
      return (C = document.getElementById(`cdr-req-tab-${m[b].key}`)) == null ? void 0 : C.focus();
    });
  };
  return /* @__PURE__ */ a.jsxs("section", { className: "cdr-prereq", "aria-label": `${i.requiredLabel} / ${i.unlocksLabel}`, children: [
    /* @__PURE__ */ a.jsx("nav", { className: "cdr-prereq-tabs", role: "tablist", children: m.map((v, g) => {
      const b = v.icon;
      return /* @__PURE__ */ a.jsxs("button", { type: "button", role: "tab", id: `cdr-req-tab-${v.key}`, "aria-controls": `cdr-req-panel-${v.key}`, "aria-selected": c === v.key, tabIndex: c === v.key ? 0 : -1, onClick: () => u(v.key), onKeyDown: (C) => w(C, g), children: [
        /* @__PURE__ */ a.jsx(b, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsx("span", { children: v.label }),
        v.key === "unlocks" && /* @__PURE__ */ a.jsx("b", { "data-req-count": !0, children: "…" })
      ] }, v.key);
    }) }),
    /* @__PURE__ */ a.jsxs("div", { className: "cdr-prereq-body", children: [
      /* @__PURE__ */ a.jsx("div", { role: "tabpanel", id: "cdr-req-panel-required", "aria-labelledby": "cdr-req-tab-required", hidden: c !== "required", children: /* @__PURE__ */ a.jsx("div", { className: "d-req-fwd", "data-code": i.code, children: /* @__PURE__ */ a.jsx("p", { className: "empty", children: i.loading }) }) }),
      /* @__PURE__ */ a.jsx("div", { role: "tabpanel", id: "cdr-req-panel-unlocks", "aria-labelledby": "cdr-req-tab-unlocks", hidden: c !== "unlocks", children: /* @__PURE__ */ a.jsx("div", { className: "d-req-by", "data-code": i.code, children: /* @__PURE__ */ a.jsx("p", { className: "empty", children: i.loading }) }) })
    ] })
  ] });
}
function Rm({ history: i }) {
  var C;
  const [c, u] = Q.useState(!1), [m, w] = Q.useState(((C = i.terms[i.terms.length - 1]) == null ? void 0 : C.slug) || "");
  if (!i.terms.length) return /* @__PURE__ */ a.jsxs("div", { className: "cdr-history-empty", children: [
    /* @__PURE__ */ a.jsx(ca, { "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsx("strong", { children: i.heading }),
    /* @__PURE__ */ a.jsx("p", { children: i.empty })
  ] });
  const v = c ? i.terms : i.terms.slice(-8), g = i.terms.find((_) => _.slug === m) || v[v.length - 1], b = Math.max(1, ...v.map((_) => _.capacity));
  return /* @__PURE__ */ a.jsxs("div", { className: "cdr-history", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "cdr-history-head", children: [
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("h4", { children: i.heading }),
        /* @__PURE__ */ a.jsx("p", { children: i.caption })
      ] }),
      /* @__PURE__ */ a.jsxs("span", { children: [
        /* @__PURE__ */ a.jsx(ca, { "aria-hidden": "true" }),
        i.terms.length
      ] })
    ] }),
    /* @__PURE__ */ a.jsxs("figure", { className: "cdr-history-figure", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "cdr-history-legend", children: [
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("i", { className: "capacity" }),
          i.labels.capacity
        ] }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("i", { className: "enrolled" }),
          i.labels.enrolled
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "cdr-history-chart", role: "list", "aria-label": i.heading, children: v.map((_) => /* @__PURE__ */ a.jsxs("button", { type: "button", role: "listitem", className: `cdr-history-term${g.slug === _.slug ? " is-active" : ""}${_.fill >= 100 ? " is-full" : ""}`, onMouseEnter: () => w(_.slug), onFocus: () => w(_.slug), onClick: () => w(_.slug), "aria-label": `${_.label}, ${i.labels.capacity} ${_.capacity}, ${i.labels.enrolled} ${_.enrolled}, %${_.fill}`, children: [
        /* @__PURE__ */ a.jsxs("span", { className: "cdr-history-bars", children: [
          /* @__PURE__ */ a.jsx("i", { className: "capacity", style: { height: `${Math.max(7, Math.round(_.capacity / b * 100))}%` } }),
          /* @__PURE__ */ a.jsx("i", { className: "enrolled", style: { height: `${Math.max(_.enrolled ? 7 : 0, Math.round(_.enrolled / b * 100))}%` } })
        ] }),
        /* @__PURE__ */ a.jsx("small", { children: _.shortLabel })
      ] }, _.slug)) }),
      /* @__PURE__ */ a.jsxs("figcaption", { className: "cdr-history-caption", children: [
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(Sf, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsx("b", { children: g.label })
        ] }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          i.labels.capacity,
          " ",
          /* @__PURE__ */ a.jsx("b", { children: g.capacity })
        ] }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          i.labels.enrolled,
          " ",
          /* @__PURE__ */ a.jsx("b", { children: g.enrolled })
        ] }),
        /* @__PURE__ */ a.jsxs("strong", { children: [
          "%",
          g.fill
        ] })
      ] }),
      i.terms.length > 8 && /* @__PURE__ */ a.jsx("button", { type: "button", className: "cdr-history-toggle", "aria-expanded": c, onClick: () => u(!c), children: c ? i.labels.showRecent : i.labels.showAll })
    ] }),
    /* @__PURE__ */ a.jsxs("details", { className: "cdr-history-records d-history-records", children: [
      /* @__PURE__ */ a.jsxs("summary", { children: [
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(Of, { "aria-hidden": "true" }),
          i.labels.records
        ] }),
        /* @__PURE__ */ a.jsx("b", { children: i.recordCount }),
        /* @__PURE__ */ a.jsx(Lc, { "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "cdr-history-record-list htable", children: [...i.terms].reverse().map((_) => /* @__PURE__ */ a.jsxs("section", { children: [
        /* @__PURE__ */ a.jsxs("header", { children: [
          /* @__PURE__ */ a.jsx("strong", { children: _.label }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            _.enrolled,
            " / ",
            _.capacity,
            " · %",
            _.fill
          ] })
        ] }),
        _.rows.map((T, V) => /* @__PURE__ */ a.jsxs("div", { className: "cdr-history-record", children: [
          /* @__PURE__ */ a.jsx("span", { children: T.instructor || "·" }),
          /* @__PURE__ */ a.jsxs("small", { children: [
            i.labels.enrolled,
            " ",
            T.enrolled,
            " · ",
            i.labels.capacity,
            " ",
            T.capacity
          ] }),
          /* @__PURE__ */ a.jsxs("b", { children: [
            "%",
            T.fill
          ] })
        ] }, `${_.slug}-${T.instructor}-${V}`))
      ] }, _.slug)) })
    ] })
  ] });
}
function Im(i) {
  const [c, u] = Q.useState(i.active), [m, w] = Q.useState(!1), v = (g, b) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(g.key)) return;
    g.preventDefault();
    const C = g.key === "Home" ? 0 : g.key === "End" ? i.panels.length - 1 : (b + (g.key === "ArrowRight" ? 1 : -1) + i.panels.length) % i.panels.length;
    u(i.panels[C].key), requestAnimationFrame(() => {
      var _;
      return (_ = document.getElementById(`d-tab-${i.panels[C].key}`)) == null ? void 0 : _.focus();
    });
  };
  return /* @__PURE__ */ a.jsxs("div", { className: "cdr-root course-reader", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "cdr-head d-head", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "cdr-title d-title-block", children: [
        /* @__PURE__ */ a.jsxs("h3", { id: "detail-title", children: [
          /* @__PURE__ */ a.jsx("span", { className: "d-code", children: i.code }),
          /* @__PURE__ */ a.jsx("span", { className: "d-name", children: i.name })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "d-meta", children: [
          i.meta.map((g) => /* @__PURE__ */ a.jsx("span", { className: "d-pill", children: g }, g)),
          i.specialKind && /* @__PURE__ */ a.jsxs("span", { className: `cdr-kind ${i.specialKind}`, children: [
            i.specialKind === "extra-exam" ? /* @__PURE__ */ a.jsx(ua, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(Wn, { "aria-hidden": "true" }),
            i.specialLabel
          ] })
        ] })
      ] }),
      i.obsLink && /* @__PURE__ */ a.jsxs("a", { className: "cdr-obs d-obs", href: i.obsLink, target: "_blank", rel: "noopener", children: [
        /* @__PURE__ */ a.jsx(xa, { "aria-hidden": "true" }),
        i.obsLabel
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("nav", { className: "cdr-tabs d-tabs", role: "tablist", "aria-label": i.tabLabel, children: i.panels.map((g, b) => {
      const C = Lm[g.key] || ao;
      return /* @__PURE__ */ a.jsxs("button", { type: "button", role: "tab", id: `d-tab-${g.key}`, "data-dtab": g.key, "aria-controls": `d-panel-${g.key}`, "aria-selected": c === g.key, tabIndex: c === g.key ? 0 : -1, onClick: () => u(g.key), onKeyDown: (_) => v(_, b), children: [
        /* @__PURE__ */ a.jsx(C, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsx("span", { children: g.label }),
        g.count !== void 0 && /* @__PURE__ */ a.jsx("b", { children: g.count })
      ] }, g.key);
    }) }),
    /* @__PURE__ */ a.jsx("div", { className: "cdr-panels d-panels", children: i.panels.map((g) => {
      var b, C, _;
      return /* @__PURE__ */ a.jsx("section", { role: "tabpanel", id: `d-panel-${g.key}`, "aria-labelledby": `d-tab-${g.key}`, "data-dpanel": g.key, hidden: c !== g.key, children: g.key === "history" && i.history ? /* @__PURE__ */ a.jsx(Rm, { history: i.history }) : g.key === "overview" && i.prerequisite ? /* @__PURE__ */ a.jsxs("div", { className: "cdr-overview", children: [
        g.beforeHtml && /* @__PURE__ */ a.jsx("div", { dangerouslySetInnerHTML: { __html: g.beforeHtml } }),
        /* @__PURE__ */ a.jsx(Tm, { data: i.prerequisite }),
        g.afterHtml && /* @__PURE__ */ a.jsx("div", { dangerouslySetInnerHTML: { __html: g.afterHtml } })
      ] }) : g.key === "sections" && ((b = i.sections) != null && b.length) ? /* @__PURE__ */ a.jsxs("div", { className: "cdr-sections", children: [
        /* @__PURE__ */ a.jsxs("header", { className: "cdr-section-heading", children: [
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("h4", { children: i.sectionHeading }),
            /* @__PURE__ */ a.jsx("p", { children: i.sectionCaption })
          ] }),
          /* @__PURE__ */ a.jsx("span", { children: i.sections.length })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "cdr-section-list", children: i.sections.slice(0, m ? void 0 : 8).map((T) => {
          var V, E, Y;
          return /* @__PURE__ */ a.jsxs("article", { className: `cdr-section d-sec${T.focus ? " is-focus" : ""}`, "data-crn": T.crn, children: [
            /* @__PURE__ */ a.jsxs("div", { className: "cdr-section-code", children: [
              /* @__PURE__ */ a.jsx("span", { children: "CRN" }),
              /* @__PURE__ */ a.jsx("strong", { children: T.crn })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "cdr-section-body", children: [
              /* @__PURE__ */ a.jsxs("div", { className: "cdr-section-top", children: [
                /* @__PURE__ */ a.jsxs("button", { type: "button", className: "cdr-instructor d-instr-history", "data-name": T.instructors.join(", "), children: [
                  /* @__PURE__ */ a.jsx(ur, { "aria-hidden": "true" }),
                  T.instructors.join(", ") || "·"
                ] }),
                /* @__PURE__ */ a.jsx("span", { children: T.quota })
              ] }),
              T.meta && /* @__PURE__ */ a.jsxs("p", { className: "cdr-section-meta", children: [
                T.special === "extra-exam" ? /* @__PURE__ */ a.jsx(ua, { "aria-hidden": "true" }) : T.special === "graduation" ? /* @__PURE__ */ a.jsx(Wn, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(jf, { "aria-hidden": "true" }),
                T.meta
              ] }),
              !!T.sessions.length && /* @__PURE__ */ a.jsx("div", { className: "cdr-section-times d-sec-when", children: T.sessions.map((j) => /* @__PURE__ */ a.jsxs("span", { children: [
                /* @__PURE__ */ a.jsx(Qn, { "aria-hidden": "true" }),
                j
              ] }, j)) }),
              T.note && /* @__PURE__ */ a.jsx("small", { children: T.note }),
              !!((V = T.rules) != null && V.length) && /* @__PURE__ */ a.jsxs("details", { className: "cdr-rules", children: [
                /* @__PURE__ */ a.jsxs("summary", { children: [
                  (E = i.labels) == null ? void 0 : E.requirements,
                  /* @__PURE__ */ a.jsx(Lc, { "aria-hidden": "true" })
                ] }),
                T.rules.map((j) => /* @__PURE__ */ a.jsxs("p", { children: [
                  /* @__PURE__ */ a.jsx("b", { children: j.label }),
                  j.value
                ] }, j.label))
              ] })
            ] }),
            /* @__PURE__ */ a.jsxs("button", { type: "button", className: "cdr-add", "data-add-crn": T.crn, onClick: () => {
              var j;
              return (j = i.onAddCrn) == null ? void 0 : j.call(i, T.crn);
            }, children: [
              /* @__PURE__ */ a.jsx(Lf, { "aria-hidden": "true" }),
              (Y = i.labels) == null ? void 0 : Y.add
            ] })
          ] }, T.crn);
        }) }),
        i.sections.length > 8 && /* @__PURE__ */ a.jsx("button", { type: "button", className: "cdr-more", "aria-expanded": m, onClick: () => w(!m), children: m ? (C = i.labels) == null ? void 0 : C.showLess : `${i.sections.length - 8} ${(_ = i.labels) == null ? void 0 : _.showMore}` })
      ] }) : /* @__PURE__ */ a.jsx("div", { dangerouslySetInnerHTML: { __html: g.html } }) }, g.key);
    }) })
  ] });
}
function Om(i) {
  const c = [
    { key: "gpa", label: i.gpaLabel, value: i.gpaValue, hint: i.gpaHint, valueId: "dp-gano", hintId: void 0, Icon: Ef },
    { key: "progress", label: i.progressLabel, value: i.progressValue, hint: i.progressHint, valueId: "dp-progress", hintId: "dp-progress-sub", Icon: bf },
    { key: "target", label: i.targetLabel, value: i.targetValue, hint: "", valueId: "dp-target", hintId: "dp-target-sub", Icon: If }
  ];
  return /* @__PURE__ */ a.jsx("div", { className: "gpa-summary-grid", children: c.map(
    ({ key: u, label: m, value: w, hint: v, valueId: g, hintId: b, Icon: C }) => /* @__PURE__ */ a.jsxs("article", { className: `gpa-summary-card is-${u}`, children: [
      /* @__PURE__ */ a.jsx("span", { className: "gpa-summary-icon", children: /* @__PURE__ */ a.jsx(C, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("em", { children: m }),
        /* @__PURE__ */ a.jsx("b", { id: g, children: w }),
        /* @__PURE__ */ a.jsx("small", { id: b, children: v })
      ] })
    ] }, u)
  ) });
}
const Dm = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--sans);font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--mono);font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.dersler-table-root .dt-relative{position:relative}.dersler-table-root .dt--ml-3{margin-left:-.75rem}.dersler-table-root .dt-ml-1\\.5{margin-left:.375rem}.dersler-table-root .dt-inline{display:inline}.dersler-table-root .dt-inline-flex{display:inline-flex}.dersler-table-root .dt-size-3\\.5{width:.875rem;height:.875rem}.dersler-table-root .dt-size-4{width:1rem;height:1rem}.dersler-table-root .dt-h-10{height:2.5rem}.dersler-table-root .dt-h-12{height:3rem}.dersler-table-root .dt-h-9{height:2.25rem}.dersler-table-root .dt-w-8{width:2rem}.dersler-table-root .dt-w-full{width:100%}.dersler-table-root .dt-caption-bottom{caption-side:bottom}.dersler-table-root .dt-cursor-pointer{cursor:pointer}.dersler-table-root .dt-items-center{align-items:center}.dersler-table-root .dt-justify-center{justify-content:center}.dersler-table-root .dt-overflow-auto{overflow:auto}.dersler-table-root .dt-overflow-hidden{overflow:hidden}.dersler-table-root .dt-whitespace-nowrap{white-space:nowrap}.dersler-table-root .dt-rounded-lg{border-radius:var(--radius-card)}.dersler-table-root .dt-rounded-md{border-radius:calc(var(--radius-card) - 2px)}.dersler-table-root .dt-border{border-width:1px}.dersler-table-root .dt-border-b{border-bottom-width:1px}.dersler-table-root .dt-border-border{border-color:var(--hairline)}.dersler-table-root .dt-bg-primary{background-color:var(--acid)}.dersler-table-root .dt-p-2{padding:.5rem}.dersler-table-root .dt-p-4{padding:1rem}.dersler-table-root .dt-p-6{padding:1.5rem}.dersler-table-root .dt-px-3{padding-left:.75rem;padding-right:.75rem}.dersler-table-root .dt-px-4{padding-left:1rem;padding-right:1rem}.dersler-table-root .dt-py-2{padding-top:.5rem;padding-bottom:.5rem}.dersler-table-root .dt-text-left{text-align:left}.dersler-table-root .dt-text-center{text-align:center}.dersler-table-root .dt-text-right{text-align:right}.dersler-table-root .dt-align-middle{vertical-align:middle}.dersler-table-root .dt-font-mono{font-family:var(--mono)}.dersler-table-root .dt-text-base{font-size:1rem;line-height:1.5rem}.dersler-table-root .dt-text-sm{font-size:.875rem;line-height:1.25rem}.dersler-table-root .dt-text-xs{font-size:.75rem;line-height:1rem}.dersler-table-root .dt-font-medium{font-weight:500}.dersler-table-root .dt-tabular-nums{--tw-numeric-spacing: tabular-nums;font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)}.dersler-table-root .dt-leading-none{line-height:1}.dersler-table-root .dt-text-muted-foreground{color:var(--dim)}.dersler-table-root .dt-text-primary-foreground{color:var(--on-accent)}.dersler-table-root .dt-opacity-40{opacity:.4}.dersler-table-root .dt-transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dersler-table-root{font-family:var(--sans);color:var(--fg)}.program-planner-root{--pp-slot: 34px;position:relative;min-width:0}.pp-heading{display:flex;align-items:center;gap:11px;margin:0 0 12px}.pp-heading-icon{display:grid;width:36px;height:36px;place-items:center;flex:0 0 auto;border:1px solid color-mix(in srgb,var(--acid) 34%,var(--line));border-radius:10px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.pp-heading-icon svg{width:18px;height:18px}.pp-heading>span:last-child{display:grid;gap:2px;min-width:0}.pp-heading strong{font-size:14px;letter-spacing:-.01em}.pp-heading small{color:var(--dimmer);font:10px/1.35 var(--mono)}.pp-loading{display:grid;min-height:260px;place-items:center;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2);font:11px/1.4 var(--mono)}.pp-calendar-scroll{max-height:min(69vh,780px);overflow:auto;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);scrollbar-width:thin}.pp-calendar{min-width:760px}.pp-calendar-head,.pp-calendar-body{display:grid;grid-template-columns:62px repeat(var(--pp-days),minmax(130px,1fr))}.pp-calendar-head{position:sticky;top:0;z-index:20;min-height:43px;border-bottom:1px solid var(--hairline-strong);background:var(--panel)}.pp-calendar-head>*{display:grid;place-items:center;border-right:1px solid var(--line)}.pp-calendar-head>span{position:sticky;left:0;z-index:22;background:var(--panel)}.pp-calendar-head b{color:var(--dim);font:700 10px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase}.pp-time-column{position:sticky;left:0;z-index:10;background:var(--panel);box-shadow:1px 0 0 var(--hairline-strong)}.pp-time-column span{display:block;height:var(--pp-slot);padding:5px 9px 0 0;color:var(--dimmer);text-align:right;font:9px/1 var(--mono);transform:translateY(-9px)}.pp-day-column{position:relative;min-width:0;border-right:1px solid var(--line);background-color:color-mix(in srgb,var(--panel) 97%,var(--fg));background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--pp-slot) - 1px),var(--line) calc(var(--pp-slot) - 1px),var(--line) var(--pp-slot))}.pp-day-column.is-weekend{background-color:var(--panel-2)}.pp-session{position:absolute;z-index:2;display:flex;flex-direction:column;gap:5px;overflow:hidden;padding:10px 25px 8px 10px;border:1px solid color-mix(in srgb,var(--pp-foreground) 25%,transparent);border-radius:8px;color:var(--pp-foreground);text-align:left;background:var(--pp-color);box-shadow:0 2px 6px color-mix(in srgb,var(--pp-color) 30%,transparent);cursor:pointer;transition:filter .14s ease,box-shadow .14s ease,transform .14s ease}.pp-session:hover,.pp-session:focus-visible{z-index:6;filter:saturate(1.08) brightness(1.04);box-shadow:0 7px 18px color-mix(in srgb,var(--pp-color) 42%,transparent);transform:translateY(-1px)}.pp-session:focus-visible{outline:3px solid var(--acid);outline-offset:2px}.pp-session.is-conflict{border:2px solid var(--red)}.pp-session.is-short{justify-content:center;padding-block:5px}.pp-session.is-short .pp-session-meta{display:none}.pp-session>strong{display:-webkit-box;overflow:hidden;color:inherit;font:800 11px/1.26 var(--sans);-webkit-box-orient:vertical;-webkit-line-clamp:3}.pp-session>strong span{font-weight:650}.pp-pin,.pp-more{position:absolute;right:7px;width:14px;height:14px;opacity:.75}.pp-pin{top:8px}.pp-more{bottom:7px}.pp-session-meta{display:grid;gap:3px;min-width:0}.pp-session-meta>span,.pp-agenda-detail{display:flex;align-items:center;gap:5px;min-width:0;overflow:hidden;color:inherit;font:9px/1.2 var(--mono);text-overflow:ellipsis;white-space:nowrap}.pp-session-meta svg,.pp-agenda-detail svg{width:11px;height:11px;flex:0 0 auto}.pp-conflict{display:flex;align-items:center;gap:4px;margin-top:auto;font:800 9px/1 var(--mono)}.pp-conflict svg{width:11px;height:11px}.pp-now{position:absolute;z-index:7;right:0;left:0;height:2px;background:var(--acid);pointer-events:none}.pp-now:before{position:absolute;top:-3px;left:-1px;width:8px;height:8px;border-radius:50%;background:var(--acid);content:""}.pp-empty,.pp-empty-day{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2)}.pp-empty svg,.pp-empty-day svg{width:25px;height:25px}.pp-empty strong,.pp-empty-day p{margin:0;font-size:12px}.pp-untimed{display:flex;gap:10px;margin-top:12px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-untimed>svg{width:18px;height:18px;flex:0 0 auto;color:var(--amber)}.pp-untimed>div{display:grid;gap:5px}.pp-untimed strong{font-size:11px}.pp-untimed span{color:var(--dim);font:10px/1.4 var(--mono)}.pp-context{position:fixed;z-index:10010;display:grid;width:224px;overflow:hidden;padding:6px;border:1px solid var(--hairline-strong);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pp-context p{display:grid;gap:2px;margin:0 0 4px;padding:8px 9px;border-bottom:1px solid var(--line)}.pp-context p strong{font-size:12px}.pp-context p span{color:var(--dimmer);font:9px/1 var(--mono)}.pp-context button{display:flex;align-items:center;gap:9px;width:100%;padding:8px 9px;border:0;border-radius:6px;color:var(--fg);text-align:left;background:transparent;font:11px/1.2 var(--sans)}.pp-context button:hover,.pp-context button:focus-visible{background:var(--panel-2)}.pp-context button.is-danger{color:var(--red)}.pp-context button svg{width:14px;height:14px}.pp-agenda{min-width:0}.pp-day-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:12px;padding:4px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-day-tabs button{position:relative;min-width:0;min-height:38px;border:0;border-radius:7px;color:var(--dim);background:transparent;font:700 10px/1 var(--mono)}.pp-day-tabs button.is-active{color:var(--panel);background:var(--fg)}.pp-day-tabs button>span{position:absolute;bottom:5px;left:50%;width:3px;height:3px;border-radius:50%;background:var(--acid)}.pp-agenda-list{display:grid;gap:8px}.pp-agenda-card{--pp-color: var(--cyan);display:grid;grid-template-columns:54px minmax(0,1fr);gap:12px;width:100%;padding:13px;border:1px solid var(--line);border-radius:11px;color:var(--fg);text-align:left;background:var(--panel);box-shadow:inset 4px 0 0 var(--pp-color)}.pp-agenda-card.is-conflict{border-color:var(--red)}.pp-agenda-time{display:grid;align-content:start;gap:3px;font:11px/1 var(--mono)}.pp-agenda-time small{color:var(--dimmer);font-size:9px}.pp-agenda-copy{display:grid;gap:5px;min-width:0}.pp-agenda-copy>strong{display:flex;align-items:center;gap:7px;font-size:13px}.pp-color-dot{width:7px;height:7px;border-radius:50%;background:var(--pp-color)}.pp-agenda-name{color:var(--dim);font-size:12px}.pp-agenda-copy em{display:flex;align-items:center;gap:5px;color:var(--red);font:700 10px/1 var(--mono)}.pp-agenda-copy em svg{width:12px;height:12px}.pp-empty-day{min-height:150px}.curriculum-plan-root{min-width:0;color:var(--fg);font-family:var(--sans)}.dp-semesters.dp-react{display:block}.cp-semester-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;align-items:stretch}.curriculum-plan-root .dp-sem{min-width:0;overflow:hidden;padding:0;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);height:100%}.curriculum-plan-root .dp-sem-head{position:relative;min-height:58px;margin:0;padding:13px 43px 12px 15px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);cursor:pointer}.curriculum-plan-root .dp-sem-head>span:first-child{font-size:15px;font-weight:750;letter-spacing:-.015em}.curriculum-plan-root .dp-sem-head:after{position:absolute;top:50%;right:17px;width:8px;height:8px;margin:-6px 0 0;border-right:1.5px solid var(--dim);border-bottom:1.5px solid var(--dim);content:"";transform:rotate(45deg);transition:transform .16s ease}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head{margin:0;padding:13px 43px 12px 15px;border:0}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head:after{margin-top:-2px;transform:rotate(-45deg)}.curriculum-plan-root .dp-load{color:var(--dim);font:10px/1.25 var(--mono)}.curriculum-plan-root .dp-sem-avg{margin-left:auto;color:var(--acid);font:700 10px/1.25 var(--mono);white-space:nowrap}.curriculum-plan-root .dp-colhead{min-height:31px;margin:0 14px;padding:6px 0;border-bottom:1px solid var(--line);font-size:9px;letter-spacing:.06em}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin:0 14px;padding:0;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent}.curriculum-plan-root .dp-course:last-child,.curriculum-plan-root .dp-elective:last-child{border-bottom:0}.curriculum-plan-root .dp-row,.curriculum-plan-root .dp-colhead{grid-template-columns:32px minmax(0,1fr) 34px 94px 58px;-moz-column-gap:10px;column-gap:10px}.curriculum-plan-root .dp-row{min-height:52px;padding:8px 0}.curriculum-plan-root .dp-repeat-btn,.curriculum-plan-root .dp-repeat-cell{justify-self:center}.curriculum-plan-root .dp-credit{min-width:29px;height:24px;padding:0 5px;border-color:color-mix(in srgb,var(--acid) 28%,var(--line));border-radius:7px;color:var(--acid);background:color-mix(in srgb,var(--acid) 7%,var(--panel));font-size:10px}.curriculum-plan-root .dp-title{display:grid;gap:2px}.curriculum-plan-root .dp-code{width:-moz-fit-content;width:fit-content;color:var(--cyan);font:750 12px/1.25 var(--mono)}.curriculum-plan-root .dp-name{overflow:hidden;color:var(--dim);font-size:11px;line-height:1.3;text-overflow:ellipsis}.curriculum-plan-root .dp-repeat-btn{color:var(--dimmer)}.curriculum-plan-root .dp-repeat-btn svg{display:block}.curriculum-plan-root .dp-repeat-btn.on{color:var(--amber);background:color-mix(in srgb,var(--amber) 8%,transparent)}.curriculum-plan-root .dp-grade-wrap{width:94px;min-height:35px;justify-content:flex-end;border-radius:7px}.curriculum-plan-root .dp-grade{border-radius:5px;font-family:var(--mono)}.curriculum-plan-root .cp-grade-trigger{position:relative;display:inline-flex;align-items:center;justify-content:space-between;gap:7px;min-width:65px;min-height:31px;padding:5px 8px;border:1px solid var(--line);border-radius:7px;color:var(--dim);background:var(--panel);font:700 10px/1 var(--mono);cursor:pointer;transition:border-color .14s ease,background-color .14s ease,color .14s ease}.curriculum-plan-root .dp-sec-btn{width:58px;justify-content:center;text-align:center}.dt-course-name{display:flex;min-width:0;align-items:center;gap:8px}.dt-course-name>span{min-width:0}.dt-kind-badge{display:inline-flex;flex:0 0 auto;align-items:center;gap:5px;min-height:24px;padding:4px 7px;border:1px solid color-mix(in srgb,var(--acid) 42%,var(--line));border-radius:7px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel));font:700 9px/1 var(--sans);white-space:nowrap}.dt-kind-badge svg{width:12px;height:12px}.dt-kind-badge.graduation{border-color:color-mix(in srgb,var(--cyan) 42%,var(--line));color:var(--cyan);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.curriculum-plan-root .cp-grade-trigger:hover,.curriculum-plan-root .cp-grade-trigger[aria-expanded=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel))}.curriculum-plan-root .cp-grade-trigger.filled{border-color:color-mix(in srgb,var(--acid) 58%,var(--line));color:var(--fg)}.curriculum-plan-root .cp-grade-trigger svg{width:13px;height:13px;flex:0 0 auto;transition:transform .14s ease}.curriculum-plan-root .cp-grade-trigger[aria-expanded=true] svg{transform:rotate(180deg)}.cp-grade-menu{position:fixed;z-index:10020;top:var(--cp-menu-y);left:var(--cp-menu-x);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;width:292px;max-width:calc(100vw - 20px);padding:8px;border:1px solid var(--hairline-strong);border-radius:11px;background:var(--panel);box-shadow:var(--shadow-float)}.cp-grade-menu.above{transform:translateY(-100%)}.cp-grade-menu button{position:relative;display:flex;align-items:center;justify-content:center;min-width:0;min-height:34px;padding:6px;border:1px solid transparent;border-radius:7px;color:var(--dim);background:var(--panel-2);font:700 10px/1 var(--mono);cursor:pointer}.cp-grade-menu button:hover,.cp-grade-menu button:focus-visible{border-color:var(--cyan);color:var(--fg);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.cp-grade-menu button[aria-selected=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 12%,var(--panel))}.cp-grade-menu button.is-empty{grid-column:1 / -1;justify-content:flex-start;padding-inline:10px}.cp-grade-menu button svg{position:absolute;top:50%;right:6px;width:12px;height:12px;color:var(--acid);transform:translateY(-50%)}.curriculum-plan-root .dp-grade-clear svg{display:block}.curriculum-plan-root .dp-sec-btn.open{padding:5px 8px;border:1px solid color-mix(in srgb,var(--cyan) 28%,var(--line));border-radius:7px;background:color-mix(in srgb,var(--cyan) 6%,var(--panel));font:650 10px/1 var(--sans);text-decoration:none}.curriculum-plan-root .dp-sec-btn.open:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-sec-btn.closed{font-size:10px}.curriculum-plan-root .dp-secslot{margin:0;padding:10px 0 12px;border-top:1px dashed var(--line)}.curriculum-plan-root .dp-section{min-height:31px}.curriculum-plan-root .dp-actions button{min-height:28px;padding:3px 7px;border:1px solid var(--line);border-radius:6px}.curriculum-plan-root .dp-actions button:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-elective{background:color-mix(in srgb,var(--acid) 3%,transparent)}.curriculum-plan-root .dp-elective-name{color:var(--dim);font-size:11px}.curriculum-plan-root .dp-epick{min-height:31px;border-radius:7px;background:var(--panel)}.cp-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.cp-empty svg{width:24px;height:24px}.cp-empty strong{font-size:12px}.exams-list-root{min-width:0;color:var(--fg);font-family:var(--sans)}.ex-table{overflow:hidden;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-head,.ex-row{display:grid;grid-template-columns:minmax(230px,1.45fr) minmax(145px,.9fr) minmax(105px,.62fr) minmax(170px,1fr) minmax(190px,1.05fr);align-items:center;gap:14px}.ex-head{min-height:36px;padding:8px 15px;color:var(--dimmer);border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);font:750 9px/1 var(--mono);letter-spacing:.055em;text-transform:uppercase}.ex-row{min-height:72px;padding:11px 15px;border-bottom:1px solid var(--line);transition:background-color .14s ease}.ex-row:last-child{border-bottom:0}.ex-row:hover{background:color-mix(in srgb,var(--cyan) 3%,var(--panel))}.ex-row.without-place{grid-template-columns:minmax(230px,1.5fr) minmax(155px,1fr) minmax(115px,.7fr) minmax(200px,1fr)}.ex-course{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:baseline;gap:3px 9px;min-width:0}.ex-course button,.ex-card-main button{width:-moz-fit-content;width:fit-content;padding:0;border:0;color:var(--cyan);background:transparent;font:800 12px/1.25 var(--mono);cursor:pointer}.ex-course button:hover,.ex-course button:focus-visible,.ex-card-main button:hover,.ex-card-main button:focus-visible{text-decoration:underline;text-underline-offset:3px}.ex-course strong{overflow:hidden;font-size:12px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.ex-course small{display:flex;grid-column:1 / -1;align-items:center;gap:4px;color:var(--dimmer);font:9px/1.2 var(--mono)}.ex-course small svg{width:10px;height:10px}.ex-meta{display:flex;align-items:flex-start;gap:6px;min-width:0;color:var(--dim);font-size:11px;line-height:1.35}.ex-meta svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-type{display:inline-flex;padding:5px 7px;border:1px solid color-mix(in srgb,var(--acid) 24%,var(--line));border-radius:6px;color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel));font:650 10px/1.15 var(--sans);font-style:normal}.ex-when{display:grid;gap:5px}.ex-when strong,.ex-when span{display:flex;align-items:center;gap:6px}.ex-when strong{font-size:11px}.ex-when span{color:var(--dim);font:10px/1.2 var(--mono)}.ex-when svg{width:13px;height:13px;color:var(--dimmer)}.ex-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.ex-empty svg{width:25px;height:25px}.ex-empty strong{font-size:12px}.ex-agenda{display:grid;gap:15px}.ex-day{overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-day>header{display:flex;align-items:center;gap:8px;min-height:42px;padding:9px 12px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2)}.ex-day>header svg{width:15px;height:15px;color:var(--acid)}.ex-day>header strong{font:750 11px/1 var(--mono)}.ex-day>header span{margin-left:auto;color:var(--dim);font-size:11px}.ex-card{display:grid;grid-template-columns:74px minmax(0,1fr);gap:12px;padding:13px 12px;border-bottom:1px solid var(--line)}.ex-card:last-child{border-bottom:0}.ex-card-time{display:flex;align-items:flex-start;gap:5px;color:var(--fg);font:700 10px/1.35 var(--mono)}.ex-card-time svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main{display:grid;gap:5px;min-width:0}.ex-card-main>strong{font-size:12px;line-height:1.3}.ex-card-main>span{display:flex;align-items:center;gap:6px;min-width:0;color:var(--dim);font-size:10px;line-height:1.35}.ex-card-main>span svg{width:12px;height:12px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main>span i{width:3px;height:3px;margin-inline:2px;border-radius:50%;background:var(--dimmer)}@media(max-width:900px){.cp-semester-grid{grid-template-columns:1fr}.ex-head,.ex-row{grid-template-columns:minmax(210px,1.45fr) minmax(135px,.85fr) minmax(95px,.62fr) minmax(175px,1fr)}.ex-head>:nth-child(4):not(:last-child),.ex-row>:nth-child(4):not(:last-child){display:none}}@media(max-width:560px){.curriculum-plan-root .dp-sem-head{flex-wrap:nowrap;gap:7px;min-height:48px;padding-block:10px}.curriculum-plan-root .dp-sem-head>span:first-child{width:auto;flex:0 0 auto;font-size:13px}.curriculum-plan-root .dp-load{overflow:hidden;flex:1 1 auto;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-sem-avg{margin-left:auto;font-size:9px}.curriculum-plan-root .dp-colhead{display:none}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin-inline:10px}.curriculum-plan-root .dp-row,.curriculum-plan-root .dp-elective .dp-row{grid-template-columns:34px minmax(0,1fr) auto;gap:4px 8px;min-height:60px;padding:7px 0}.curriculum-plan-root .dp-credit{grid-column:1;grid-row:1 / 3;align-self:center}.curriculum-plan-root .dp-title{display:flex;grid-column:2;grid-row:1;align-items:baseline;gap:6px;overflow:hidden;white-space:nowrap}.curriculum-plan-root .dp-code{flex:0 0 auto;font-size:11px;min-height:28px}.curriculum-plan-root .dp-name{min-width:0;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-repeat-btn,.curriculum-plan-root .dp-repeat-cell{grid-column:3;grid-row:1}.curriculum-plan-root .dp-grade-wrap,.curriculum-plan-root .dp-elective-inputs{grid-column:2;grid-row:2;justify-self:start}.curriculum-plan-root .dp-sec-btn{grid-column:3;grid-row:1 / 3;align-self:center}.curriculum-plan-root .cp-grade-trigger{min-height:34px;padding:5px 7px}.curriculum-plan-root .cp-grade-trigger:after{position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;content:""}.curriculum-plan-root .dp-grade-clear{min-height:32px}.cp-grade-menu,.cp-grade-menu.above{top:auto;right:10px;bottom:max(10px,env(safe-area-inset-bottom));left:10px;grid-template-columns:repeat(5,minmax(0,1fr));width:auto;max-width:none;gap:4px;padding:7px;transform:none}.cp-grade-menu button{min-height:42px;padding:5px 3px;font-size:9px}.cp-grade-menu button.is-empty{min-height:38px}.cp-grade-menu button svg{right:5px;width:11px;height:11px}}@media(max-width:600px){.pp-heading{margin-bottom:10px}.pp-heading-icon{width:32px;height:32px}.pp-day-tabs{overflow-x:auto;grid-template-columns:repeat(var(--pp-days, 5),minmax(48px,1fr))}}@media(prefers-reduced-motion:reduce){.pp-session{transition:none}}.pcl-list{position:relative;display:grid;color:var(--fg);font-family:var(--sans)}.pcl-head{display:grid;grid-template-columns:1fr auto;padding:8px 2px;color:var(--dimmer);border-bottom:1px solid var(--line);font:700 9px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase}.pcl-item{position:relative;display:grid;grid-template-columns:16px minmax(0,1fr) auto 30px 30px;gap:6px;align-items:start;padding:13px 0;border-bottom:1px solid var(--line);cursor:pointer;transition:background-color .14s ease,transform .14s ease}.pcl-item:hover{background:color-mix(in srgb,var(--acid) 4%,transparent)}.pcl-item.is-full{background:color-mix(in srgb,var(--red) 5%,transparent)}.pcl-grip{width:14px;height:14px;margin-top:2px;color:var(--dimmer);cursor:grab}.pcl-course{min-width:0}.pcl-title{display:flex;align-items:center;gap:6px}.pcl-title strong{color:var(--cyan);font:800 11px/1.2 var(--mono)}.pcl-title>span{padding:3px 5px;border:1px solid color-mix(in srgb,var(--acid) 40%,var(--line));border-radius:5px;color:var(--acid);font:700 8px/1 var(--sans)}.pcl-course>p{margin:4px 0 7px;overflow:hidden;color:var(--fg);font-size:11px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.pcl-meta{display:grid;gap:4px;color:var(--dim);font-size:9px}.pcl-meta span{display:flex;align-items:center;gap:5px;min-width:0}.pcl-meta svg{width:11px;height:11px;flex:0 0 auto;color:var(--dimmer)}.pcl-course small{display:block;margin-top:6px;color:var(--acid);font:700 9px/1.2 var(--mono)}.pcl-numbers{display:grid;justify-items:end;gap:5px;font-family:var(--mono)}.pcl-numbers b{font-size:10px;font-variant-numeric:tabular-nums}.pcl-numbers span{color:var(--dimmer);font-size:8px}.pcl-numbers em{color:var(--amber);font-size:8px;font-style:normal}.pcl-remove,.pcl-menu-trigger{display:grid;width:28px;height:28px;place-items:center;padding:0;border:1px solid transparent;border-radius:7px;color:var(--dimmer);background:transparent;cursor:pointer}.pcl-remove{display:grid}.pcl-menu-trigger:hover,.pcl-menu-trigger:focus-visible{border-color:var(--line-hot);color:var(--fg);background:var(--panel-2)}.pcl-menu-trigger svg,.pcl-remove svg{width:14px;height:14px}.pcl-menu-wrap{position:relative}.pcl-menu{position:absolute;z-index:30;top:31px;right:0;display:grid;width:208px;padding:6px;border:1px solid var(--line-hot);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pcl-menu button{display:flex;align-items:center;gap:8px;min-height:34px;padding:7px 9px;border:0;border-radius:6px;color:var(--fg);background:transparent;font:600 10px/1.2 var(--sans);text-align:left;cursor:pointer}.pcl-menu button:hover,.pcl-menu button:focus-visible{background:var(--panel-2)}.pcl-menu button.is-danger{color:var(--red)}.pcl-menu svg{width:13px;height:13px}.pcl-empty{display:grid;min-height:150px;place-items:center;align-content:center;gap:8px;color:var(--dimmer);text-align:center}.pcl-empty svg{width:24px;height:24px}.pcl-empty strong{max-width:25ch;font-size:11px}.cdr-root{display:flex;min-height:0;height:100%;flex-direction:column;color:var(--fg);background:var(--panel);font-family:var(--sans)}.cdr-head{display:flex;min-height:128px;flex:0 0 auto;align-items:flex-start;justify-content:space-between;gap:24px;padding:28px 76px 22px 28px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--acid) 2.5%,var(--panel))}.cdr-title{min-width:0}.cdr-title h3{display:flex;align-items:center;gap:16px;margin:0 0 13px}.cdr-title .d-code{display:inline-flex;min-height:38px;align-items:center;padding:0 11px;border:1px solid var(--line-hot);border-radius:8px;color:var(--cyan);background:var(--panel);font:800 12px/1 var(--mono);white-space:nowrap}.cdr-title .d-name{color:var(--fg);font-family:var(--display);font-size:clamp(21px,3vw,30px);font-weight:750;line-height:1.1;letter-spacing:-.025em}.cdr-title .d-meta{display:flex;flex-wrap:wrap;gap:6px}.cdr-title .d-pill,.cdr-kind{display:inline-flex;min-height:25px;align-items:center;gap:5px;padding:4px 8px;border:1px solid var(--line);border-radius:7px;color:var(--dim);background:var(--panel);font:650 9px/1 var(--sans)}.cdr-kind{border-color:color-mix(in srgb,var(--acid) 44%,var(--line));color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.cdr-kind.graduation{border-color:color-mix(in srgb,var(--cyan) 42%,var(--line));color:var(--cyan);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.cdr-kind svg{width:12px;height:12px}.cdr-obs{display:inline-flex;align-items:center;gap:7px}.cdr-obs svg{width:14px;height:14px;order:-1}.cdr-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;flex:0 0 auto;padding:0 28px;border:0;border-bottom:1px solid var(--line);border-radius:0;background:var(--panel)}.cdr-tabs button{position:relative;display:flex;min-width:0;min-height:52px;align-items:center;justify-content:center;gap:7px;padding:8px;border:0;border-radius:0;color:var(--dim);background:transparent;font:700 11px/1 var(--sans);cursor:pointer}.cdr-tabs button svg{width:13px;height:13px}.cdr-tabs button>span{min-width:0;padding:0;border:0;border-radius:0;color:inherit;background:transparent;font:inherit}.cdr-tabs button b{min-width:19px;padding:3px 5px;border-radius:999px;color:var(--dim);background:var(--panel-2);font:700 8px/1 var(--mono)}.cdr-tabs button:after{position:absolute;right:22%;bottom:-1px;left:22%;height:2px;border-radius:2px 2px 0 0;background:var(--acid);content:"";opacity:0;transform:scaleX(.5);transition:opacity .14s ease,transform .14s ease}.cdr-tabs button:hover{color:var(--fg);background:color-mix(in srgb,var(--acid) 3%,transparent)}.cdr-tabs button[aria-selected=true]{color:var(--fg);background:transparent;box-shadow:none}.cdr-tabs button[aria-selected=true]:after{opacity:1;transform:scaleX(1)}.cdr-tabs button[aria-selected=true] svg{color:var(--acid)}.cdr-panels{min-height:0;flex:1 1 auto;overflow-y:auto;padding:24px 28px 30px;overscroll-behavior:contain;scrollbar-color:var(--line-hot) transparent}.cdr-panels>section>div:not(.cdr-sections){max-width:880px;margin-inline:auto}.cdr-section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:14px;padding-bottom:13px;border-bottom:1px solid var(--line)}.cdr-section-heading h4{margin:0;color:var(--fg);font-family:var(--display);font-size:18px;letter-spacing:-.015em}.cdr-section-heading p{margin:5px 0 0;color:var(--dimmer);font-size:10px}.cdr-section-heading>span{display:grid;width:28px;height:28px;place-items:center;border:1px solid var(--line);border-radius:8px;color:var(--acid);background:var(--panel-2);font:750 10px/1 var(--mono)}.cdr-section-list{display:grid}.cdr-section{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:16px;align-items:start;padding:17px 6px;border-bottom:1px solid var(--line)}.cdr-section:first-child{border-top:1px solid var(--line)}.cdr-section.is-focus{margin-inline:-10px;padding-inline:16px;border-radius:10px;background:color-mix(in srgb,var(--acid) 8%,var(--panel));box-shadow:inset 2px 0 0 var(--acid)}.cdr-section-code{display:grid;gap:4px}.cdr-section-code span{color:var(--dimmer);font:700 8px/1 var(--sans);letter-spacing:.08em}.cdr-section-code strong{color:var(--cyan);font:800 11px/1.2 var(--mono)}.cdr-section-body{display:grid;min-width:0;gap:7px}.cdr-section-top{display:flex;min-width:0;align-items:center;justify-content:space-between;gap:16px}.cdr-instructor{display:flex;min-width:0;align-items:center;gap:6px;padding:0;border:0;color:var(--fg);background:transparent;font:700 11px/1.3 var(--sans);text-align:left;overflow-wrap:anywhere;cursor:pointer}.cdr-instructor:hover,.cdr-instructor:focus-visible{color:var(--cyan);text-decoration:underline;text-underline-offset:3px}.cdr-instructor svg,.cdr-section-meta svg,.cdr-section-times svg{width:12px;height:12px;flex:0 0 auto;color:var(--dimmer)}.cdr-section-top>span{color:var(--dim);font:700 10px/1 var(--mono);white-space:nowrap}.cdr-section-meta{display:flex;align-items:center;gap:6px;margin:0;color:var(--dim);font-size:10px}.cdr-section-times{display:grid;gap:4px;color:var(--dim);font-size:10px}.cdr-section-times span{display:flex;align-items:flex-start;gap:6px}.cdr-section-body>small{color:var(--dimmer);font-size:9px}.cdr-add{display:inline-flex;min-height:34px;align-items:center;gap:6px;padding:7px 10px;border:1px solid color-mix(in srgb,var(--cyan) 44%,var(--line));border-radius:8px;color:var(--cyan);background:color-mix(in srgb,var(--cyan) 6%,var(--panel));font:700 10px/1 var(--sans);cursor:pointer;white-space:nowrap}.cdr-add:hover,.cdr-add:focus-visible{border-color:var(--cyan);background:color-mix(in srgb,var(--cyan) 11%,var(--panel))}.cdr-add svg{width:13px;height:13px}.cdr-rules{margin-top:2px;color:var(--dim);font-size:10px}.cdr-rules summary{display:inline-flex;align-items:center;gap:5px;color:var(--cyan);cursor:pointer}.cdr-rules summary svg{width:12px;height:12px;transition:transform .14s ease}.cdr-rules[open] summary svg{transform:rotate(180deg)}.cdr-rules p{margin:7px 0 0}.cdr-rules p b{margin-right:6px;color:var(--dimmer)}.cdr-more{display:block;min-height:36px;margin:15px auto 0;padding:7px 12px;border:1px solid var(--line-hot);border-radius:8px;color:var(--fg);background:var(--panel);font:700 10px/1 var(--sans);cursor:pointer}.cdr-overview{max-width:880px;margin-inline:auto}.cdr-prereq{margin-block:22px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);overflow:hidden}.cdr-prereq-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;padding:5px;background:color-mix(in srgb,var(--fg) 3%,var(--panel-2))}.cdr-prereq-tabs button{display:flex;min-width:0;min-height:42px;align-items:center;justify-content:center;gap:8px;padding:8px 12px;border:1px solid transparent;border-radius:8px;color:var(--dim);background:transparent;font:700 11px/1.2 var(--sans);cursor:pointer}.cdr-prereq-tabs button:hover{color:var(--fg);background:color-mix(in srgb,var(--fg) 3%,transparent)}.cdr-prereq-tabs button[aria-selected=true]{border-color:var(--line-hot);color:var(--fg);background:var(--panel);box-shadow:0 1px 4px color-mix(in srgb,var(--bg) 32%,transparent)}.cdr-prereq-tabs button[aria-selected=true] svg{color:var(--acid)}.cdr-prereq-tabs svg{width:14px;height:14px;flex:0 0 auto}.cdr-prereq-tabs b{display:grid;min-width:19px;height:19px;place-items:center;border-radius:6px;color:var(--dim);background:var(--panel-2);font:750 8px/1 var(--mono)}.cdr-prereq-body{min-height:98px;padding:18px;border-top:1px solid var(--line);background:var(--panel)}.cdr-prereq-body>div[hidden]{display:none}.cdr-prereq-body .empty{margin:0}.cdr-history{max-width:900px;margin-inline:auto}.cdr-history-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;padding-bottom:14px;border-bottom:1px solid var(--line)}.cdr-history-head h4{margin:0;color:var(--fg);font-family:var(--display);font-size:18px;letter-spacing:-.015em}.cdr-history-head p{margin:5px 0 0;color:var(--dimmer);font-size:10px}.cdr-history-head>span{display:inline-flex;min-height:28px;align-items:center;gap:6px;padding:0 9px;border:1px solid var(--line);border-radius:8px;color:var(--acid);background:var(--panel-2);font:750 10px/1 var(--mono)}.cdr-history-head svg,.cdr-history-caption svg,.cdr-history-records summary svg{width:13px;height:13px}.cdr-history-figure{margin:0;padding:18px 0 22px}.cdr-history-legend{display:flex;justify-content:flex-end;gap:14px;margin-bottom:9px;color:var(--dimmer);font:650 9px/1 var(--sans)}.cdr-history-legend span{display:inline-flex;align-items:center;gap:6px}.cdr-history-legend i{width:11px;height:11px;border-radius:3px;background:var(--cyan)}.cdr-history-legend i.enrolled{border:1px solid color-mix(in srgb,var(--acid) 70%,var(--line));background:repeating-linear-gradient(135deg,var(--acid) 0 2px,transparent 2px 5px)}.cdr-history-chart{display:flex;height:172px;align-items:end;gap:9px;padding:17px 10px 0;border:1px solid var(--line);border-radius:10px;background-color:color-mix(in srgb,var(--panel-2) 64%,var(--panel));background-image:radial-gradient(circle,color-mix(in srgb,var(--dim) 18%,transparent) 1px,transparent 1px);background-size:13px 13px;overflow-x:auto;scrollbar-width:thin}.cdr-history-term{display:grid;min-width:56px;height:100%;flex:1 0 56px;grid-template-rows:minmax(0,1fr) 26px;align-items:end;justify-items:stretch;gap:7px;padding:0;border:0;color:var(--dimmer);background:transparent;cursor:pointer}.cdr-history-bars{display:flex;width:min(100%,52px);height:100%;min-height:10px;align-items:end;justify-self:center;justify-content:center;gap:5px;transition:transform .14s ease}.cdr-history-bars i{display:block;width:19px;min-height:3px;border-radius:5px 5px 1px 1px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 9%,transparent)}.cdr-history-bars i.capacity{background:var(--cyan)}.cdr-history-bars i.enrolled{border:1px solid color-mix(in srgb,var(--acid) 72%,var(--line));background:repeating-linear-gradient(135deg,var(--acid) 0 2px,color-mix(in srgb,var(--acid) 20%,transparent) 2px 5px)}.cdr-history-term.is-full .cdr-history-bars i.enrolled{border-color:var(--red);background:repeating-linear-gradient(135deg,var(--red) 0 2px,color-mix(in srgb,var(--red) 18%,transparent) 2px 5px)}.cdr-history-term small{font:650 9px/1 var(--sans);white-space:nowrap}.cdr-history-term:hover .cdr-history-bars,.cdr-history-term:focus-visible .cdr-history-bars,.cdr-history-term.is-active .cdr-history-bars{transform:translateY(-3px)}.cdr-history-term.is-active .cdr-history-bars i{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 18%,transparent),0 0 0 2px color-mix(in srgb,var(--acid) 18%,transparent)}.cdr-history-term.is-active small{color:var(--fg);font-weight:800}.cdr-history-caption{display:flex;min-height:42px;align-items:center;gap:17px;margin-top:11px;padding:8px 11px;border:1px solid var(--line);border-radius:9px;color:var(--dim);background:var(--panel-2);font-size:10px}.cdr-history-caption span{display:inline-flex;align-items:center;gap:5px}.cdr-history-caption b{color:var(--fg);font-weight:750}.cdr-history-caption>strong{margin-left:auto;color:var(--acid);font:800 14px/1 var(--mono)}.cdr-history-toggle{display:block;margin:13px auto 0;padding:7px 10px;border:0;color:var(--cyan);background:transparent;font:700 10px/1 var(--sans);text-decoration:underline;text-underline-offset:3px;cursor:pointer}.cdr-history-records{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.cdr-history-records>summary{display:grid;min-height:48px;grid-template-columns:minmax(0,1fr) auto 18px;align-items:center;gap:10px;color:var(--fg);cursor:pointer;list-style:none}.cdr-history-records>summary::-webkit-details-marker{display:none}.cdr-history-records>summary span{display:inline-flex;align-items:center;gap:8px;font-weight:750}.cdr-history-records>summary b{display:grid;min-width:24px;height:24px;place-items:center;border-radius:7px;color:var(--dim);background:var(--panel-2);font:750 9px/1 var(--mono)}.cdr-history-records>summary>svg{color:var(--dimmer);transition:transform .14s ease}.cdr-history-records[open]>summary>svg{transform:rotate(180deg)}.cdr-history-record-list{padding:0 0 14px}.cdr-history-record-list>section{padding:14px 0;border-top:1px solid var(--line)}.cdr-history-record-list>section>header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:7px}.cdr-history-record-list>section>header strong{color:var(--fg);font-size:11px}.cdr-history-record-list>section>header span{color:var(--dim);font:700 9px/1 var(--mono)}.cdr-history-record{display:grid;min-height:31px;grid-template-columns:minmax(0,1fr) auto 42px;align-items:center;gap:12px;padding:5px 8px;border-radius:6px;color:var(--dim);font-size:10px}.cdr-history-record:nth-child(2n){background:var(--panel-2)}.cdr-history-record small{color:var(--dimmer)}.cdr-history-record>b{color:var(--acid);font:750 10px/1 var(--mono);text-align:right}.cdr-history-empty{display:grid;min-height:220px;place-content:center;justify-items:center;gap:8px;color:var(--dimmer);text-align:center}.cdr-history-empty svg{width:28px;height:28px;color:var(--acid)}.cdr-history-empty strong{color:var(--fg);font-family:var(--display)}.cdr-history-empty p{max-width:48ch;margin:0;font-size:11px}.pp-tooltip{position:fixed;z-index:10030;width:286px;padding:12px;border:1px solid var(--line-hot);border-radius:11px;color:var(--fg);background:var(--panel);box-shadow:var(--shadow-float);pointer-events:none;transform:translateY(-100%);animation:pp-tooltip-in .13s cubic-bezier(.2,.8,.2,1)}.pp-tooltip[data-side=bottom]{transform:none}.pp-tooltip-title{display:grid;grid-template-columns:8px 1fr auto;align-items:center;gap:7px}.pp-tooltip-title>span{width:8px;height:8px;border-radius:3px}.pp-tooltip-title strong{font:800 11px/1.2 var(--mono)}.pp-tooltip-title b{color:var(--dim);font:700 9px/1 var(--mono)}.pp-tooltip>p{margin:7px 0 9px;font-size:11px;font-weight:700;line-height:1.35}.pp-tooltip dl{display:grid;gap:5px;margin:0}.pp-tooltip dl div{display:grid;grid-template-columns:16px 1fr;align-items:center;color:var(--dim);font-size:10px}.pp-tooltip dt,.pp-tooltip dd{margin:0}.pp-tooltip svg{width:11px;height:11px}.pp-tooltip>small{display:block;margin-top:10px;padding-top:8px;color:var(--dimmer);border-top:1px solid var(--line);font-size:8px}@keyframes pp-tooltip-in{0%{opacity:.2;filter:blur(3px)}to{opacity:1;filter:blur(0)}}@media(max-width:600px){.pcl-item{grid-template-columns:14px minmax(0,1fr) auto 44px 44px;padding-block:12px}.pcl-remove,.pcl-menu-trigger{display:grid;width:44px;height:44px}.pcl-course>p{white-space:normal}.pcl-meta{grid-template-columns:1fr}.cdr-head{min-height:0;padding:20px 56px 16px 16px}.cdr-title h3{display:grid;gap:8px}.cdr-tabs{position:sticky;top:0;z-index:4;margin-inline:0;padding-inline:6px}.cdr-tabs button{min-height:44px;padding-inline:4px}.cdr-tabs button svg{display:none}.cdr-title .d-name{font-size:18px}.cdr-panels{padding:16px 14px 24px}.cdr-section{grid-template-columns:52px minmax(0,1fr);gap:10px;padding-block:14px}.cdr-section-top{display:grid;gap:6px}.cdr-add{grid-column:2;justify-self:start}.cdr-section.is-focus{margin-inline:-5px;padding-inline:10px}.cdr-history-chart{margin-inline:-14px;padding-inline:14px}.cdr-history-caption{display:grid;grid-template-columns:1fr auto;gap:6px 12px}.cdr-history-caption>strong{grid-column:2;grid-row:1 / span 2;align-self:center}.cdr-history-record-list>section>header{align-items:flex-start}.cdr-history-record{grid-template-columns:minmax(0,1fr) 38px}.cdr-history-record small{grid-column:1;grid-row:2}.cdr-history-record>b{grid-column:2;grid-row:1 / span 2}.pp-tooltip{display:none}}@media print{.program-planner-root .pp-calendar-scroll{max-height:none;overflow:visible;box-shadow:none}.program-planner-root .pp-calendar{min-width:0}.program-planner-root .pp-context{display:none}}.gpa-summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.gpa-summary-card{position:relative;display:grid;grid-template-columns:38px minmax(0,1fr);gap:11px;align-items:start;min-height:92px;padding:15px;border:1px solid color-mix(in srgb,var(--hairline) 82%,transparent);border-radius:13px;background:linear-gradient(145deg,color-mix(in srgb,var(--panel) 96%,var(--accent) 4%),var(--panel));overflow:hidden}.gpa-summary-card:after{content:"";position:absolute;right:-24px;bottom:-34px;width:88px;height:88px;border-radius:50%;background:color-mix(in srgb,var(--accent) 9%,transparent);pointer-events:none}.gpa-summary-icon{display:grid;place-items:center;width:38px;height:38px;border-radius:11px;color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);border:1px solid color-mix(in srgb,var(--accent) 28%,transparent)}.gpa-summary-icon svg{width:19px;height:19px}.gpa-summary-card>div{display:grid;gap:3px;min-width:0}.gpa-summary-card em{font-style:normal;color:var(--dim);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.gpa-summary-card b{color:var(--fg);font-size:18px;line-height:1.25;overflow-wrap:anywhere}.gpa-summary-card small{color:var(--dimmer);font-size:11px;line-height:1.35}.gpa-summary-card.is-target b{font-size:13px;line-height:1.45}@media(max-width:760px){.gpa-summary-grid{grid-template-columns:1fr}.gpa-summary-card{min-height:76px}}.dersler-table-root .hover\\:dt-bg-accent:hover{background-color:var(--panel-2)}.dersler-table-root .hover\\:dt-text-accent-foreground:hover{color:var(--acid)}.dersler-table-root .focus-visible\\:dt-outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.dersler-table-root .focus-visible\\:dt-ring-2:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.dersler-table-root .focus-visible\\:dt-ring-ring:focus-visible{--tw-ring-color: var(--cyan)}.dersler-table-root .focus-visible\\:dt-ring-offset-2:focus-visible{--tw-ring-offset-width: 2px}.dersler-table-root .disabled\\:dt-pointer-events-none:disabled{pointer-events:none}.dersler-table-root .disabled\\:dt-opacity-50:disabled{opacity:.5}.dersler-table-root .data-\\[state\\=selected\\]\\:dt-bg-muted[data-state=selected]{background-color:var(--panel-2)}.dersler-table-root .\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:dt-pr-0:has([role=checkbox]){padding-right:0}.dersler-table-root :is(.\\[\\&_tr\\:last-child\\]\\:dt-border-0 tr:last-child){border-width:0px}.dersler-table-root :is(.\\[\\&_tr\\]\\:dt-border-b tr){border-bottom-width:1px}';
let sr = null, Dt = null, At = null, Ft = null, $t = null, yt = null, jr = null, io = null;
function Nr() {
  io || (io = document.createElement("style"), io.textContent = Dm, document.head.appendChild(io));
}
function Am(i, c) {
  Nr(), sr = Cr.createRoot(i), sr.render(
    /* @__PURE__ */ a.jsx(Q.StrictMode, { children: /* @__PURE__ */ a.jsx(ed, { ...c }) })
  );
}
function Fm(i) {
  sr && sr.render(
    /* @__PURE__ */ a.jsx(Q.StrictMode, { children: /* @__PURE__ */ a.jsx(ed, { ...i }) })
  );
}
function $m() {
  sr == null || sr.unmount(), sr = null;
}
function Um(i, c) {
  Nr(), Dt = Cr.createRoot(i), Dt.render(/* @__PURE__ */ a.jsx(nd, { ...c }));
}
function Hm(i) {
  Dt == null || Dt.render(/* @__PURE__ */ a.jsx(nd, { ...i }));
}
function Vm() {
  Dt == null || Dt.unmount(), Dt = null;
}
function Bm(i, c) {
  Nr(), $t = Cr.createRoot(i), $t.render(/* @__PURE__ */ a.jsx(id, { ...c }));
}
function Wm(i) {
  $t == null || $t.render(/* @__PURE__ */ a.jsx(id, { ...i }));
}
function Qm() {
  $t == null || $t.unmount(), $t = null;
}
function qm(i, c) {
  Nr(), yt == null || yt.unmount(), yt = Cr.createRoot(i), hf.flushSync(() => yt == null ? void 0 : yt.render(/* @__PURE__ */ a.jsx(Im, { ...c })));
}
function Gm() {
  yt == null || yt.unmount(), yt = null;
}
function Km(i, c) {
  Nr(), jr || (jr = Cr.createRoot(i)), jr.render(/* @__PURE__ */ a.jsx(Om, { ...c }));
}
function Ym() {
  jr == null || jr.unmount(), jr = null;
}
function Xm(i, c) {
  Nr(), At = Cr.createRoot(i), At.render(/* @__PURE__ */ a.jsx(ld, { ...c }));
}
function Zm(i) {
  At == null || At.render(/* @__PURE__ */ a.jsx(ld, { ...i }));
}
function Jm() {
  At == null || At.unmount(), At = null;
}
function eh(i, c) {
  Nr(), Ft = Cr.createRoot(i), Ft.render(/* @__PURE__ */ a.jsx(od, { ...c }));
}
function th(i) {
  Ft == null || Ft.render(/* @__PURE__ */ a.jsx(od, { ...i }));
}
function rh() {
  Ft == null || Ft.unmount(), Ft = null;
}
export {
  Am as mount,
  qm as mountCourseDetail,
  Xm as mountCurriculum,
  eh as mountExams,
  Km as mountGpaSummary,
  Um as mountProgram,
  Bm as mountProgramList,
  $m as unmount,
  Gm as unmountCourseDetail,
  Jm as unmountCurriculum,
  rh as unmountExams,
  Ym as unmountGpaSummary,
  Vm as unmountProgram,
  Qm as unmountProgramList,
  Fm as update,
  Zm as updateCurriculum,
  th as updateExams,
  Hm as updateProgram,
  Wm as updateProgramList
};
