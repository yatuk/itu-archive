function df(i, c) {
  for (var u = 0; u < c.length; u++) {
    const p = c[u];
    if (typeof p != "string" && !Array.isArray(p)) {
      for (const v in p)
        if (v !== "default" && !(v in i)) {
          const g = Object.getOwnPropertyDescriptor(p, v);
          g && Object.defineProperty(i, v, g.get ? g : {
            enumerable: !0,
            get: () => p[v]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }));
}
function pf(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var sa = { exports: {} }, Qn = {}, ua = { exports: {} }, le = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var bc;
function ff() {
  if (bc) return le;
  bc = 1;
  var i = Symbol.for("react.element"), c = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), p = Symbol.for("react.strict_mode"), v = Symbol.for("react.profiler"), g = Symbol.for("react.provider"), x = Symbol.for("react.context"), j = Symbol.for("react.forward_ref"), S = Symbol.for("react.suspense"), N = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), V = Symbol.iterator;
  function I(h) {
    return h === null || typeof h != "object" ? null : (h = V && h[V] || h["@@iterator"], typeof h == "function" ? h : null);
  }
  var J = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, b = Object.assign, C = {};
  function L(h, z, ne) {
    this.props = h, this.context = z, this.refs = C, this.updater = ne || J;
  }
  L.prototype.isReactComponent = {}, L.prototype.setState = function(h, z) {
    if (typeof h != "object" && typeof h != "function" && h != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, h, z, "setState");
  }, L.prototype.forceUpdate = function(h) {
    this.updater.enqueueForceUpdate(this, h, "forceUpdate");
  };
  function X() {
  }
  X.prototype = L.prototype;
  function K(h, z, ne) {
    this.props = h, this.context = z, this.refs = C, this.updater = ne || J;
  }
  var F = K.prototype = new X();
  F.constructor = K, b(F, L.prototype), F.isPureReactComponent = !0;
  var q = Array.isArray, ee = Object.prototype.hasOwnProperty, Y = { current: null }, de = { key: !0, ref: !0, __self: !0, __source: !0 };
  function we(h, z, ne) {
    var oe, se = {}, ue = null, me = null;
    if (z != null) for (oe in z.ref !== void 0 && (me = z.ref), z.key !== void 0 && (ue = "" + z.key), z) ee.call(z, oe) && !de.hasOwnProperty(oe) && (se[oe] = z[oe]);
    var pe = arguments.length - 2;
    if (pe === 1) se.children = ne;
    else if (1 < pe) {
      for (var ke = Array(pe), tt = 0; tt < pe; tt++) ke[tt] = arguments[tt + 2];
      se.children = ke;
    }
    if (h && h.defaultProps) for (oe in pe = h.defaultProps, pe) se[oe] === void 0 && (se[oe] = pe[oe]);
    return { $$typeof: i, type: h, key: ue, ref: me, props: se, _owner: Y.current };
  }
  function _e(h, z) {
    return { $$typeof: i, type: h.type, key: z, ref: h.ref, props: h.props, _owner: h._owner };
  }
  function Fe(h) {
    return typeof h == "object" && h !== null && h.$$typeof === i;
  }
  function De(h) {
    var z = { "=": "=0", ":": "=2" };
    return "$" + h.replace(/[=:]/g, function(ne) {
      return z[ne];
    });
  }
  var ie = /\/+/g;
  function $e(h, z) {
    return typeof h == "object" && h !== null && h.key != null ? De("" + h.key) : z.toString(36);
  }
  function He(h, z, ne, oe, se) {
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
    if (me) return me = h, se = se(me), h = oe === "" ? "." + $e(me, 0) : oe, q(se) ? (ne = "", h != null && (ne = h.replace(ie, "$&/") + "/"), He(se, z, ne, "", function(tt) {
      return tt;
    })) : se != null && (Fe(se) && (se = _e(se, ne + (!se.key || me && me.key === se.key ? "" : ("" + se.key).replace(ie, "$&/") + "/") + h)), z.push(se)), 1;
    if (me = 0, oe = oe === "" ? "." : oe + ":", q(h)) for (var pe = 0; pe < h.length; pe++) {
      ue = h[pe];
      var ke = oe + $e(ue, pe);
      me += He(ue, z, ne, ke, se);
    }
    else if (ke = I(h), typeof ke == "function") for (h = ke.call(h), pe = 0; !(ue = h.next()).done; ) ue = ue.value, ke = oe + $e(ue, pe++), me += He(ue, z, ne, ke, se);
    else if (ue === "object") throw z = String(h), Error("Objects are not valid as a React child (found: " + (z === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : z) + "). If you meant to render a collection of children, use an array instead.");
    return me;
  }
  function et(h, z, ne) {
    if (h == null) return h;
    var oe = [], se = 0;
    return He(h, oe, "", "", function(ue) {
      return z.call(ne, ue, se++);
    }), oe;
  }
  function Me(h) {
    if (h._status === -1) {
      var z = h._result;
      z = z(), z.then(function(ne) {
        (h._status === 0 || h._status === -1) && (h._status = 1, h._result = ne);
      }, function(ne) {
        (h._status === 0 || h._status === -1) && (h._status = 2, h._result = ne);
      }), h._status === -1 && (h._status = 0, h._result = z);
    }
    if (h._status === 1) return h._result.default;
    throw h._result;
  }
  var ge = { current: null }, R = { transition: null }, B = { ReactCurrentDispatcher: ge, ReactCurrentBatchConfig: R, ReactCurrentOwner: Y };
  function O() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return le.Children = { map: et, forEach: function(h, z, ne) {
    et(h, function() {
      z.apply(this, arguments);
    }, ne);
  }, count: function(h) {
    var z = 0;
    return et(h, function() {
      z++;
    }), z;
  }, toArray: function(h) {
    return et(h, function(z) {
      return z;
    }) || [];
  }, only: function(h) {
    if (!Fe(h)) throw Error("React.Children.only expected to receive a single React element child.");
    return h;
  } }, le.Component = L, le.Fragment = u, le.Profiler = v, le.PureComponent = K, le.StrictMode = p, le.Suspense = S, le.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = B, le.act = O, le.cloneElement = function(h, z, ne) {
    if (h == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
    var oe = b({}, h.props), se = h.key, ue = h.ref, me = h._owner;
    if (z != null) {
      if (z.ref !== void 0 && (ue = z.ref, me = Y.current), z.key !== void 0 && (se = "" + z.key), h.type && h.type.defaultProps) var pe = h.type.defaultProps;
      for (ke in z) ee.call(z, ke) && !de.hasOwnProperty(ke) && (oe[ke] = z[ke] === void 0 && pe !== void 0 ? pe[ke] : z[ke]);
    }
    var ke = arguments.length - 2;
    if (ke === 1) oe.children = ne;
    else if (1 < ke) {
      pe = Array(ke);
      for (var tt = 0; tt < ke; tt++) pe[tt] = arguments[tt + 2];
      oe.children = pe;
    }
    return { $$typeof: i, type: h.type, key: se, ref: ue, props: oe, _owner: me };
  }, le.createContext = function(h) {
    return h = { $$typeof: x, _currentValue: h, _currentValue2: h, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, h.Provider = { $$typeof: g, _context: h }, h.Consumer = h;
  }, le.createElement = we, le.createFactory = function(h) {
    var z = we.bind(null, h);
    return z.type = h, z;
  }, le.createRef = function() {
    return { current: null };
  }, le.forwardRef = function(h) {
    return { $$typeof: j, render: h };
  }, le.isValidElement = Fe, le.lazy = function(h) {
    return { $$typeof: T, _payload: { _status: -1, _result: h }, _init: Me };
  }, le.memo = function(h, z) {
    return { $$typeof: N, type: h, compare: z === void 0 ? null : z };
  }, le.startTransition = function(h) {
    var z = R.transition;
    R.transition = {};
    try {
      h();
    } finally {
      R.transition = z;
    }
  }, le.unstable_act = O, le.useCallback = function(h, z) {
    return ge.current.useCallback(h, z);
  }, le.useContext = function(h) {
    return ge.current.useContext(h);
  }, le.useDebugValue = function() {
  }, le.useDeferredValue = function(h) {
    return ge.current.useDeferredValue(h);
  }, le.useEffect = function(h, z) {
    return ge.current.useEffect(h, z);
  }, le.useId = function() {
    return ge.current.useId();
  }, le.useImperativeHandle = function(h, z, ne) {
    return ge.current.useImperativeHandle(h, z, ne);
  }, le.useInsertionEffect = function(h, z) {
    return ge.current.useInsertionEffect(h, z);
  }, le.useLayoutEffect = function(h, z) {
    return ge.current.useLayoutEffect(h, z);
  }, le.useMemo = function(h, z) {
    return ge.current.useMemo(h, z);
  }, le.useReducer = function(h, z, ne) {
    return ge.current.useReducer(h, z, ne);
  }, le.useRef = function(h) {
    return ge.current.useRef(h);
  }, le.useState = function(h) {
    return ge.current.useState(h);
  }, le.useSyncExternalStore = function(h, z, ne) {
    return ge.current.useSyncExternalStore(h, z, ne);
  }, le.useTransition = function() {
    return ge.current.useTransition();
  }, le.version = "18.3.1", le;
}
var jc;
function ba() {
  return jc || (jc = 1, ua.exports = ff()), ua.exports;
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
var Sc;
function mf() {
  if (Sc) return Qn;
  Sc = 1;
  var i = ba(), c = Symbol.for("react.element"), u = Symbol.for("react.fragment"), p = Object.prototype.hasOwnProperty, v = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, g = { key: !0, ref: !0, __self: !0, __source: !0 };
  function x(j, S, N) {
    var T, V = {}, I = null, J = null;
    N !== void 0 && (I = "" + N), S.key !== void 0 && (I = "" + S.key), S.ref !== void 0 && (J = S.ref);
    for (T in S) p.call(S, T) && !g.hasOwnProperty(T) && (V[T] = S[T]);
    if (j && j.defaultProps) for (T in S = j.defaultProps, S) V[T] === void 0 && (V[T] = S[T]);
    return { $$typeof: c, type: j, key: I, ref: J, props: V, _owner: v.current };
  }
  return Qn.Fragment = u, Qn.jsx = x, Qn.jsxs = x, Qn;
}
var Cc;
function hf() {
  return Cc || (Cc = 1, sa.exports = mf()), sa.exports;
}
var a = hf(), W = ba();
const gf = /* @__PURE__ */ pf(W), xf = /* @__PURE__ */ df({
  __proto__: null,
  default: gf
}, [W]);
var uo = {}, ca = { exports: {} }, Je = {}, da = { exports: {} }, pa = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Nc;
function vf() {
  return Nc || (Nc = 1, (function(i) {
    function c(R, B) {
      var O = R.length;
      R.push(B);
      e: for (; 0 < O; ) {
        var h = O - 1 >>> 1, z = R[h];
        if (0 < v(z, B)) R[h] = B, R[O] = z, O = h;
        else break e;
      }
    }
    function u(R) {
      return R.length === 0 ? null : R[0];
    }
    function p(R) {
      if (R.length === 0) return null;
      var B = R[0], O = R.pop();
      if (O !== B) {
        R[0] = O;
        e: for (var h = 0, z = R.length, ne = z >>> 1; h < ne; ) {
          var oe = 2 * (h + 1) - 1, se = R[oe], ue = oe + 1, me = R[ue];
          if (0 > v(se, O)) ue < z && 0 > v(me, se) ? (R[h] = me, R[ue] = O, h = ue) : (R[h] = se, R[oe] = O, h = oe);
          else if (ue < z && 0 > v(me, O)) R[h] = me, R[ue] = O, h = ue;
          else break e;
        }
      }
      return B;
    }
    function v(R, B) {
      var O = R.sortIndex - B.sortIndex;
      return O !== 0 ? O : R.id - B.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var g = performance;
      i.unstable_now = function() {
        return g.now();
      };
    } else {
      var x = Date, j = x.now();
      i.unstable_now = function() {
        return x.now() - j;
      };
    }
    var S = [], N = [], T = 1, V = null, I = 3, J = !1, b = !1, C = !1, L = typeof setTimeout == "function" ? setTimeout : null, X = typeof clearTimeout == "function" ? clearTimeout : null, K = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function F(R) {
      for (var B = u(N); B !== null; ) {
        if (B.callback === null) p(N);
        else if (B.startTime <= R) p(N), B.sortIndex = B.expirationTime, c(S, B);
        else break;
        B = u(N);
      }
    }
    function q(R) {
      if (C = !1, F(R), !b) if (u(S) !== null) b = !0, Me(ee);
      else {
        var B = u(N);
        B !== null && ge(q, B.startTime - R);
      }
    }
    function ee(R, B) {
      b = !1, C && (C = !1, X(we), we = -1), J = !0;
      var O = I;
      try {
        for (F(B), V = u(S); V !== null && (!(V.expirationTime > B) || R && !De()); ) {
          var h = V.callback;
          if (typeof h == "function") {
            V.callback = null, I = V.priorityLevel;
            var z = h(V.expirationTime <= B);
            B = i.unstable_now(), typeof z == "function" ? V.callback = z : V === u(S) && p(S), F(B);
          } else p(S);
          V = u(S);
        }
        if (V !== null) var ne = !0;
        else {
          var oe = u(N);
          oe !== null && ge(q, oe.startTime - B), ne = !1;
        }
        return ne;
      } finally {
        V = null, I = O, J = !1;
      }
    }
    var Y = !1, de = null, we = -1, _e = 5, Fe = -1;
    function De() {
      return !(i.unstable_now() - Fe < _e);
    }
    function ie() {
      if (de !== null) {
        var R = i.unstable_now();
        Fe = R;
        var B = !0;
        try {
          B = de(!0, R);
        } finally {
          B ? $e() : (Y = !1, de = null);
        }
      } else Y = !1;
    }
    var $e;
    if (typeof K == "function") $e = function() {
      K(ie);
    };
    else if (typeof MessageChannel < "u") {
      var He = new MessageChannel(), et = He.port2;
      He.port1.onmessage = ie, $e = function() {
        et.postMessage(null);
      };
    } else $e = function() {
      L(ie, 0);
    };
    function Me(R) {
      de = R, Y || (Y = !0, $e());
    }
    function ge(R, B) {
      we = L(function() {
        R(i.unstable_now());
      }, B);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(R) {
      R.callback = null;
    }, i.unstable_continueExecution = function() {
      b || J || (b = !0, Me(ee));
    }, i.unstable_forceFrameRate = function(R) {
      0 > R || 125 < R ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : _e = 0 < R ? Math.floor(1e3 / R) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return I;
    }, i.unstable_getFirstCallbackNode = function() {
      return u(S);
    }, i.unstable_next = function(R) {
      switch (I) {
        case 1:
        case 2:
        case 3:
          var B = 3;
          break;
        default:
          B = I;
      }
      var O = I;
      I = B;
      try {
        return R();
      } finally {
        I = O;
      }
    }, i.unstable_pauseExecution = function() {
    }, i.unstable_requestPaint = function() {
    }, i.unstable_runWithPriority = function(R, B) {
      switch (R) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          R = 3;
      }
      var O = I;
      I = R;
      try {
        return B();
      } finally {
        I = O;
      }
    }, i.unstable_scheduleCallback = function(R, B, O) {
      var h = i.unstable_now();
      switch (typeof O == "object" && O !== null ? (O = O.delay, O = typeof O == "number" && 0 < O ? h + O : h) : O = h, R) {
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
      return z = O + z, R = { id: T++, callback: B, priorityLevel: R, startTime: O, expirationTime: z, sortIndex: -1 }, O > h ? (R.sortIndex = O, c(N, R), u(S) === null && R === u(N) && (C ? (X(we), we = -1) : C = !0, ge(q, O - h))) : (R.sortIndex = z, c(S, R), b || J || (b = !0, Me(ee))), R;
    }, i.unstable_shouldYield = De, i.unstable_wrapCallback = function(R) {
      var B = I;
      return function() {
        var O = I;
        I = B;
        try {
          return R.apply(this, arguments);
        } finally {
          I = O;
        }
      };
    };
  })(pa)), pa;
}
var Ec;
function yf() {
  return Ec || (Ec = 1, da.exports = vf()), da.exports;
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
var zc;
function wf() {
  if (zc) return Je;
  zc = 1;
  var i = ba(), c = yf();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1; r < arguments.length; r++) t += "&args[]=" + encodeURIComponent(arguments[r]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var p = /* @__PURE__ */ new Set(), v = {};
  function g(e, t) {
    x(e, t), x(e + "Capture", t);
  }
  function x(e, t) {
    for (v[e] = t, e = 0; e < t.length; e++) p.add(t[e]);
  }
  var j = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), S = Object.prototype.hasOwnProperty, N = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, T = {}, V = {};
  function I(e) {
    return S.call(V, e) ? !0 : S.call(T, e) ? !1 : N.test(e) ? V[e] = !0 : (T[e] = !0, !1);
  }
  function J(e, t, r, n) {
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
    if (t === null || typeof t > "u" || J(e, t, r, n)) return !0;
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
  function C(e, t, r, n, l, o, s) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = n, this.attributeNamespace = l, this.mustUseProperty = r, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = s;
  }
  var L = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    L[e] = new C(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    L[t] = new C(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    L[e] = new C(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    L[e] = new C(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    L[e] = new C(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    L[e] = new C(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    L[e] = new C(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    L[e] = new C(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    L[e] = new C(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var X = /[\-:]([a-z])/g;
  function K(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      X,
      K
    );
    L[t] = new C(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(X, K);
    L[t] = new C(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(X, K);
    L[t] = new C(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    L[e] = new C(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), L.xlinkHref = new C("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    L[e] = new C(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function F(e, t, r, n) {
    var l = L.hasOwnProperty(t) ? L[t] : null;
    (l !== null ? l.type !== 0 : n || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (b(t, r, l, n) && (r = null), n || l === null ? I(t) && (r === null ? e.removeAttribute(t) : e.setAttribute(t, "" + r)) : l.mustUseProperty ? e[l.propertyName] = r === null ? l.type === 3 ? !1 : "" : r : (t = l.attributeName, n = l.attributeNamespace, r === null ? e.removeAttribute(t) : (l = l.type, r = l === 3 || l === 4 && r === !0 ? "" : "" + r, n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r))));
  }
  var q = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ee = Symbol.for("react.element"), Y = Symbol.for("react.portal"), de = Symbol.for("react.fragment"), we = Symbol.for("react.strict_mode"), _e = Symbol.for("react.profiler"), Fe = Symbol.for("react.provider"), De = Symbol.for("react.context"), ie = Symbol.for("react.forward_ref"), $e = Symbol.for("react.suspense"), He = Symbol.for("react.suspense_list"), et = Symbol.for("react.memo"), Me = Symbol.for("react.lazy"), ge = Symbol.for("react.offscreen"), R = Symbol.iterator;
  function B(e) {
    return e === null || typeof e != "object" ? null : (e = R && e[R] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var O = Object.assign, h;
  function z(e) {
    if (h === void 0) try {
      throw Error();
    } catch (r) {
      var t = r.stack.trim().match(/\n( *(at )?)/);
      h = t && t[1] || "";
    }
    return `
` + h + e;
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
                var f = `
` + l[s].replace(" at new ", " at ");
                return e.displayName && f.includes("<anonymous>") && (f = f.replace("<anonymous>", e.displayName)), f;
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
  function se(e) {
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
  function ue(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case de:
        return "Fragment";
      case Y:
        return "Portal";
      case _e:
        return "Profiler";
      case we:
        return "StrictMode";
      case $e:
        return "Suspense";
      case He:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case De:
        return (e.displayName || "Context") + ".Consumer";
      case Fe:
        return (e._context.displayName || "Context") + ".Provider";
      case ie:
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
  function Jn(e) {
    e._valueTracker || (e._valueTracker = tt(e));
  }
  function za(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var r = t.getValue(), n = "";
    return e && (n = ke(e) ? e.checked ? "true" : "false" : e.value), e = n, e !== r ? (t.setValue(e), !0) : !1;
  }
  function el(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function ho(e, t) {
    var r = t.checked;
    return O({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: r ?? e._wrapperState.initialChecked });
  }
  function _a(e, t) {
    var r = t.defaultValue == null ? "" : t.defaultValue, n = t.checked != null ? t.checked : t.defaultChecked;
    r = pe(t.value != null ? t.value : r), e._wrapperState = { initialChecked: n, initialValue: r, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Ma(e, t) {
    t = t.checked, t != null && F(e, "checked", t, !1);
  }
  function go(e, t) {
    Ma(e, t);
    var r = pe(t.value), n = t.type;
    if (r != null) n === "number" ? (r === 0 && e.value === "" || e.value != r) && (e.value = "" + r) : e.value !== "" + r && (e.value = "" + r);
    else if (n === "submit" || n === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? xo(e, t.type, r) : t.hasOwnProperty("defaultValue") && xo(e, t.type, pe(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Pa(e, t, r) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var n = t.type;
      if (!(n !== "submit" && n !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, r || t === e.value || (e.value = t), e.defaultValue = t;
    }
    r = e.name, r !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, r !== "" && (e.name = r);
  }
  function xo(e, t, r) {
    (t !== "number" || el(e.ownerDocument) !== e) && (r == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + r && (e.defaultValue = "" + r));
  }
  var sn = Array.isArray;
  function Tr(e, t, r, n) {
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
  function vo(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return O({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function La(e, t) {
    var r = t.value;
    if (r == null) {
      if (r = t.children, t = t.defaultValue, r != null) {
        if (t != null) throw Error(u(92));
        if (sn(r)) {
          if (1 < r.length) throw Error(u(93));
          r = r[0];
        }
        t = r;
      }
      t == null && (t = ""), r = t;
    }
    e._wrapperState = { initialValue: pe(r) };
  }
  function Ta(e, t) {
    var r = pe(t.value), n = pe(t.defaultValue);
    r != null && (r = "" + r, r !== e.value && (e.value = r), t.defaultValue == null && e.defaultValue !== r && (e.defaultValue = r)), n != null && (e.defaultValue = "" + n);
  }
  function Ra(e) {
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
  function yo(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Ia(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var tl, Da = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, r, n, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, r, n, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (tl = tl || document.createElement("div"), tl.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = tl.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function un(e, t) {
    if (t) {
      var r = e.firstChild;
      if (r && r === e.lastChild && r.nodeType === 3) {
        r.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var cn = {
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
  }, md = ["Webkit", "ms", "Moz", "O"];
  Object.keys(cn).forEach(function(e) {
    md.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), cn[t] = cn[e];
    });
  });
  function Oa(e, t, r) {
    return t == null || typeof t == "boolean" || t === "" ? "" : r || typeof t != "number" || t === 0 || cn.hasOwnProperty(e) && cn[e] ? ("" + t).trim() : t + "px";
  }
  function Aa(e, t) {
    e = e.style;
    for (var r in t) if (t.hasOwnProperty(r)) {
      var n = r.indexOf("--") === 0, l = Oa(r, t[r], n);
      r === "float" && (r = "cssFloat"), n ? e.setProperty(r, l) : e[r] = l;
    }
  }
  var hd = O({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function wo(e, t) {
    if (t) {
      if (hd[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function ko(e, t) {
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
  var bo = null;
  function jo(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var So = null, Rr = null, Ir = null;
  function Fa(e) {
    if (e = Ln(e)) {
      if (typeof So != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = Sl(t), So(e.stateNode, e.type, t));
    }
  }
  function $a(e) {
    Rr ? Ir ? Ir.push(e) : Ir = [e] : Rr = e;
  }
  function Ha() {
    if (Rr) {
      var e = Rr, t = Ir;
      if (Ir = Rr = null, Fa(e), t) for (e = 0; e < t.length; e++) Fa(t[e]);
    }
  }
  function Ua(e, t) {
    return e(t);
  }
  function Va() {
  }
  var Co = !1;
  function Ba(e, t, r) {
    if (Co) return e(t, r);
    Co = !0;
    try {
      return Ua(e, t, r);
    } finally {
      Co = !1, (Rr !== null || Ir !== null) && (Va(), Ha());
    }
  }
  function dn(e, t) {
    var r = e.stateNode;
    if (r === null) return null;
    var n = Sl(r);
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
  var No = !1;
  if (j) try {
    var pn = {};
    Object.defineProperty(pn, "passive", { get: function() {
      No = !0;
    } }), window.addEventListener("test", pn, pn), window.removeEventListener("test", pn, pn);
  } catch {
    No = !1;
  }
  function gd(e, t, r, n, l, o, s, d, f) {
    var k = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(r, k);
    } catch (_) {
      this.onError(_);
    }
  }
  var fn = !1, rl = null, nl = !1, Eo = null, xd = { onError: function(e) {
    fn = !0, rl = e;
  } };
  function vd(e, t, r, n, l, o, s, d, f) {
    fn = !1, rl = null, gd.apply(xd, arguments);
  }
  function yd(e, t, r, n, l, o, s, d, f) {
    if (vd.apply(this, arguments), fn) {
      if (fn) {
        var k = rl;
        fn = !1, rl = null;
      } else throw Error(u(198));
      nl || (nl = !0, Eo = k);
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
  function Wa(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function qa(e) {
    if (hr(e) !== e) throw Error(u(188));
  }
  function wd(e) {
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
          if (o === r) return qa(l), e;
          if (o === n) return qa(l), t;
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
  function Qa(e) {
    return e = wd(e), e !== null ? Ga(e) : null;
  }
  function Ga(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Ga(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Ka = c.unstable_scheduleCallback, Ya = c.unstable_cancelCallback, kd = c.unstable_shouldYield, bd = c.unstable_requestPaint, Ne = c.unstable_now, jd = c.unstable_getCurrentPriorityLevel, zo = c.unstable_ImmediatePriority, Xa = c.unstable_UserBlockingPriority, ll = c.unstable_NormalPriority, Sd = c.unstable_LowPriority, Za = c.unstable_IdlePriority, ol = null, jt = null;
  function Cd(e) {
    if (jt && typeof jt.onCommitFiberRoot == "function") try {
      jt.onCommitFiberRoot(ol, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var mt = Math.clz32 ? Math.clz32 : zd, Nd = Math.log, Ed = Math.LN2;
  function zd(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Nd(e) / Ed | 0) | 0;
  }
  var il = 64, al = 4194304;
  function mn(e) {
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
  function sl(e, t) {
    var r = e.pendingLanes;
    if (r === 0) return 0;
    var n = 0, l = e.suspendedLanes, o = e.pingedLanes, s = r & 268435455;
    if (s !== 0) {
      var d = s & ~l;
      d !== 0 ? n = mn(d) : (o &= s, o !== 0 && (n = mn(o)));
    } else s = r & ~l, s !== 0 ? n = mn(s) : o !== 0 && (n = mn(o));
    if (n === 0) return 0;
    if (t !== 0 && t !== n && (t & l) === 0 && (l = n & -n, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((n & 4) !== 0 && (n |= r & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= n; 0 < t; ) r = 31 - mt(t), l = 1 << r, n |= e[r], t &= ~l;
    return n;
  }
  function _d(e, t) {
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
  function Md(e, t) {
    for (var r = e.suspendedLanes, n = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var s = 31 - mt(o), d = 1 << s, f = l[s];
      f === -1 ? ((d & r) === 0 || (d & n) !== 0) && (l[s] = _d(d, t)) : f <= t && (e.expiredLanes |= d), o &= ~d;
    }
  }
  function _o(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Ja() {
    var e = il;
    return il <<= 1, (il & 4194240) === 0 && (il = 64), e;
  }
  function Mo(e) {
    for (var t = [], r = 0; 31 > r; r++) t.push(e);
    return t;
  }
  function hn(e, t, r) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - mt(t), e[t] = r;
  }
  function Pd(e, t) {
    var r = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var n = e.eventTimes;
    for (e = e.expirationTimes; 0 < r; ) {
      var l = 31 - mt(r), o = 1 << l;
      t[l] = 0, n[l] = -1, e[l] = -1, r &= ~o;
    }
  }
  function Po(e, t) {
    var r = e.entangledLanes |= t;
    for (e = e.entanglements; r; ) {
      var n = 31 - mt(r), l = 1 << n;
      l & t | e[n] & t && (e[n] |= t), r &= ~l;
    }
  }
  var fe = 0;
  function es(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var ts, Lo, rs, ns, ls, To = !1, ul = [], qt = null, Qt = null, Gt = null, gn = /* @__PURE__ */ new Map(), xn = /* @__PURE__ */ new Map(), Kt = [], Ld = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function os(e, t) {
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
        gn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        xn.delete(t.pointerId);
    }
  }
  function vn(e, t, r, n, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: r, eventSystemFlags: n, nativeEvent: o, targetContainers: [l] }, t !== null && (t = Ln(t), t !== null && Lo(t)), e) : (e.eventSystemFlags |= n, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Td(e, t, r, n, l) {
    switch (t) {
      case "focusin":
        return qt = vn(qt, e, t, r, n, l), !0;
      case "dragenter":
        return Qt = vn(Qt, e, t, r, n, l), !0;
      case "mouseover":
        return Gt = vn(Gt, e, t, r, n, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return gn.set(o, vn(gn.get(o) || null, e, t, r, n, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, xn.set(o, vn(xn.get(o) || null, e, t, r, n, l)), !0;
    }
    return !1;
  }
  function is(e) {
    var t = gr(e.target);
    if (t !== null) {
      var r = hr(t);
      if (r !== null) {
        if (t = r.tag, t === 13) {
          if (t = Wa(r), t !== null) {
            e.blockedOn = t, ls(e.priority, function() {
              rs(r);
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
  function cl(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var r = Io(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (r === null) {
        r = e.nativeEvent;
        var n = new r.constructor(r.type, r);
        bo = n, r.target.dispatchEvent(n), bo = null;
      } else return t = Ln(r), t !== null && Lo(t), e.blockedOn = r, !1;
      t.shift();
    }
    return !0;
  }
  function as(e, t, r) {
    cl(e) && r.delete(t);
  }
  function Rd() {
    To = !1, qt !== null && cl(qt) && (qt = null), Qt !== null && cl(Qt) && (Qt = null), Gt !== null && cl(Gt) && (Gt = null), gn.forEach(as), xn.forEach(as);
  }
  function yn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, To || (To = !0, c.unstable_scheduleCallback(c.unstable_NormalPriority, Rd)));
  }
  function wn(e) {
    function t(l) {
      return yn(l, e);
    }
    if (0 < ul.length) {
      yn(ul[0], e);
      for (var r = 1; r < ul.length; r++) {
        var n = ul[r];
        n.blockedOn === e && (n.blockedOn = null);
      }
    }
    for (qt !== null && yn(qt, e), Qt !== null && yn(Qt, e), Gt !== null && yn(Gt, e), gn.forEach(t), xn.forEach(t), r = 0; r < Kt.length; r++) n = Kt[r], n.blockedOn === e && (n.blockedOn = null);
    for (; 0 < Kt.length && (r = Kt[0], r.blockedOn === null); ) is(r), r.blockedOn === null && Kt.shift();
  }
  var Dr = q.ReactCurrentBatchConfig, dl = !0;
  function Id(e, t, r, n) {
    var l = fe, o = Dr.transition;
    Dr.transition = null;
    try {
      fe = 1, Ro(e, t, r, n);
    } finally {
      fe = l, Dr.transition = o;
    }
  }
  function Dd(e, t, r, n) {
    var l = fe, o = Dr.transition;
    Dr.transition = null;
    try {
      fe = 4, Ro(e, t, r, n);
    } finally {
      fe = l, Dr.transition = o;
    }
  }
  function Ro(e, t, r, n) {
    if (dl) {
      var l = Io(e, t, r, n);
      if (l === null) Zo(e, t, n, pl, r), os(e, n);
      else if (Td(l, e, t, r, n)) n.stopPropagation();
      else if (os(e, n), t & 4 && -1 < Ld.indexOf(e)) {
        for (; l !== null; ) {
          var o = Ln(l);
          if (o !== null && ts(o), o = Io(e, t, r, n), o === null && Zo(e, t, n, pl, r), o === l) break;
          l = o;
        }
        l !== null && n.stopPropagation();
      } else Zo(e, t, n, null, r);
    }
  }
  var pl = null;
  function Io(e, t, r, n) {
    if (pl = null, e = jo(n), e = gr(e), e !== null) if (t = hr(e), t === null) e = null;
    else if (r = t.tag, r === 13) {
      if (e = Wa(t), e !== null) return e;
      e = null;
    } else if (r === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return pl = e, null;
  }
  function ss(e) {
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
        switch (jd()) {
          case zo:
            return 1;
          case Xa:
            return 4;
          case ll:
          case Sd:
            return 16;
          case Za:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Yt = null, Do = null, fl = null;
  function us() {
    if (fl) return fl;
    var e, t = Do, r = t.length, n, l = "value" in Yt ? Yt.value : Yt.textContent, o = l.length;
    for (e = 0; e < r && t[e] === l[e]; e++) ;
    var s = r - e;
    for (n = 1; n <= s && t[r - n] === l[o - n]; n++) ;
    return fl = l.slice(e, 1 < n ? 1 - n : void 0);
  }
  function ml(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function hl() {
    return !0;
  }
  function cs() {
    return !1;
  }
  function rt(e) {
    function t(r, n, l, o, s) {
      this._reactName = r, this._targetInst = l, this.type = n, this.nativeEvent = o, this.target = s, this.currentTarget = null;
      for (var d in e) e.hasOwnProperty(d) && (r = e[d], this[d] = r ? r(o) : o[d]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? hl : cs, this.isPropagationStopped = cs, this;
    }
    return O(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var r = this.nativeEvent;
      r && (r.preventDefault ? r.preventDefault() : typeof r.returnValue != "unknown" && (r.returnValue = !1), this.isDefaultPrevented = hl);
    }, stopPropagation: function() {
      var r = this.nativeEvent;
      r && (r.stopPropagation ? r.stopPropagation() : typeof r.cancelBubble != "unknown" && (r.cancelBubble = !0), this.isPropagationStopped = hl);
    }, persist: function() {
    }, isPersistent: hl }), t;
  }
  var Or = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Oo = rt(Or), kn = O({}, Or, { view: 0, detail: 0 }), Od = rt(kn), Ao, Fo, bn, gl = O({}, kn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Ho, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== bn && (bn && e.type === "mousemove" ? (Ao = e.screenX - bn.screenX, Fo = e.screenY - bn.screenY) : Fo = Ao = 0, bn = e), Ao);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : Fo;
  } }), ds = rt(gl), Ad = O({}, gl, { dataTransfer: 0 }), Fd = rt(Ad), $d = O({}, kn, { relatedTarget: 0 }), $o = rt($d), Hd = O({}, Or, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Ud = rt(Hd), Vd = O({}, Or, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Bd = rt(Vd), Wd = O({}, Or, { data: 0 }), ps = rt(Wd), qd = {
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
  }, Qd = {
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
  }, Gd = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Kd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Gd[e]) ? !!t[e] : !1;
  }
  function Ho() {
    return Kd;
  }
  var Yd = O({}, kn, { key: function(e) {
    if (e.key) {
      var t = qd[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = ml(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Qd[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Ho, charCode: function(e) {
    return e.type === "keypress" ? ml(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? ml(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Xd = rt(Yd), Zd = O({}, gl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), fs = rt(Zd), Jd = O({}, kn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Ho }), ep = rt(Jd), tp = O({}, Or, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), rp = rt(tp), np = O({}, gl, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), lp = rt(np), op = [9, 13, 27, 32], Uo = j && "CompositionEvent" in window, jn = null;
  j && "documentMode" in document && (jn = document.documentMode);
  var ip = j && "TextEvent" in window && !jn, ms = j && (!Uo || jn && 8 < jn && 11 >= jn), hs = " ", gs = !1;
  function xs(e, t) {
    switch (e) {
      case "keyup":
        return op.indexOf(t.keyCode) !== -1;
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
  function vs(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ar = !1;
  function ap(e, t) {
    switch (e) {
      case "compositionend":
        return vs(t);
      case "keypress":
        return t.which !== 32 ? null : (gs = !0, hs);
      case "textInput":
        return e = t.data, e === hs && gs ? null : e;
      default:
        return null;
    }
  }
  function sp(e, t) {
    if (Ar) return e === "compositionend" || !Uo && xs(e, t) ? (e = us(), fl = Do = Yt = null, Ar = !1, e) : null;
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
        return ms && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var up = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function ys(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!up[e.type] : t === "textarea";
  }
  function ws(e, t, r, n) {
    $a(n), t = kl(t, "onChange"), 0 < t.length && (r = new Oo("onChange", "change", null, r, n), e.push({ event: r, listeners: t }));
  }
  var Sn = null, Cn = null;
  function cp(e) {
    As(e, 0);
  }
  function xl(e) {
    var t = Vr(e);
    if (za(t)) return e;
  }
  function dp(e, t) {
    if (e === "change") return t;
  }
  var ks = !1;
  if (j) {
    var Vo;
    if (j) {
      var Bo = "oninput" in document;
      if (!Bo) {
        var bs = document.createElement("div");
        bs.setAttribute("oninput", "return;"), Bo = typeof bs.oninput == "function";
      }
      Vo = Bo;
    } else Vo = !1;
    ks = Vo && (!document.documentMode || 9 < document.documentMode);
  }
  function js() {
    Sn && (Sn.detachEvent("onpropertychange", Ss), Cn = Sn = null);
  }
  function Ss(e) {
    if (e.propertyName === "value" && xl(Cn)) {
      var t = [];
      ws(t, Cn, e, jo(e)), Ba(cp, t);
    }
  }
  function pp(e, t, r) {
    e === "focusin" ? (js(), Sn = t, Cn = r, Sn.attachEvent("onpropertychange", Ss)) : e === "focusout" && js();
  }
  function fp(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return xl(Cn);
  }
  function mp(e, t) {
    if (e === "click") return xl(t);
  }
  function hp(e, t) {
    if (e === "input" || e === "change") return xl(t);
  }
  function gp(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ht = typeof Object.is == "function" ? Object.is : gp;
  function Nn(e, t) {
    if (ht(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var r = Object.keys(e), n = Object.keys(t);
    if (r.length !== n.length) return !1;
    for (n = 0; n < r.length; n++) {
      var l = r[n];
      if (!S.call(t, l) || !ht(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Cs(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Ns(e, t) {
    var r = Cs(e);
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
      r = Cs(r);
    }
  }
  function Es(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Es(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function zs() {
    for (var e = window, t = el(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var r = typeof t.contentWindow.location.href == "string";
      } catch {
        r = !1;
      }
      if (r) e = t.contentWindow;
      else break;
      t = el(e.document);
    }
    return t;
  }
  function Wo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function xp(e) {
    var t = zs(), r = e.focusedElem, n = e.selectionRange;
    if (t !== r && r && r.ownerDocument && Es(r.ownerDocument.documentElement, r)) {
      if (n !== null && Wo(r)) {
        if (t = n.start, e = n.end, e === void 0 && (e = t), "selectionStart" in r) r.selectionStart = t, r.selectionEnd = Math.min(e, r.value.length);
        else if (e = (t = r.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = r.textContent.length, o = Math.min(n.start, l);
          n = n.end === void 0 ? o : Math.min(n.end, l), !e.extend && o > n && (l = n, n = o, o = l), l = Ns(r, o);
          var s = Ns(
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
  var vp = j && "documentMode" in document && 11 >= document.documentMode, Fr = null, qo = null, En = null, Qo = !1;
  function _s(e, t, r) {
    var n = r.window === r ? r.document : r.nodeType === 9 ? r : r.ownerDocument;
    Qo || Fr == null || Fr !== el(n) || (n = Fr, "selectionStart" in n && Wo(n) ? n = { start: n.selectionStart, end: n.selectionEnd } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = { anchorNode: n.anchorNode, anchorOffset: n.anchorOffset, focusNode: n.focusNode, focusOffset: n.focusOffset }), En && Nn(En, n) || (En = n, n = kl(qo, "onSelect"), 0 < n.length && (t = new Oo("onSelect", "select", null, t, r), e.push({ event: t, listeners: n }), t.target = Fr)));
  }
  function vl(e, t) {
    var r = {};
    return r[e.toLowerCase()] = t.toLowerCase(), r["Webkit" + e] = "webkit" + t, r["Moz" + e] = "moz" + t, r;
  }
  var $r = { animationend: vl("Animation", "AnimationEnd"), animationiteration: vl("Animation", "AnimationIteration"), animationstart: vl("Animation", "AnimationStart"), transitionend: vl("Transition", "TransitionEnd") }, Go = {}, Ms = {};
  j && (Ms = document.createElement("div").style, "AnimationEvent" in window || (delete $r.animationend.animation, delete $r.animationiteration.animation, delete $r.animationstart.animation), "TransitionEvent" in window || delete $r.transitionend.transition);
  function yl(e) {
    if (Go[e]) return Go[e];
    if (!$r[e]) return e;
    var t = $r[e], r;
    for (r in t) if (t.hasOwnProperty(r) && r in Ms) return Go[e] = t[r];
    return e;
  }
  var Ps = yl("animationend"), Ls = yl("animationiteration"), Ts = yl("animationstart"), Rs = yl("transitionend"), Is = /* @__PURE__ */ new Map(), Ds = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Xt(e, t) {
    Is.set(e, t), g(t, [e]);
  }
  for (var Ko = 0; Ko < Ds.length; Ko++) {
    var Yo = Ds[Ko], yp = Yo.toLowerCase(), wp = Yo[0].toUpperCase() + Yo.slice(1);
    Xt(yp, "on" + wp);
  }
  Xt(Ps, "onAnimationEnd"), Xt(Ls, "onAnimationIteration"), Xt(Ts, "onAnimationStart"), Xt("dblclick", "onDoubleClick"), Xt("focusin", "onFocus"), Xt("focusout", "onBlur"), Xt(Rs, "onTransitionEnd"), x("onMouseEnter", ["mouseout", "mouseover"]), x("onMouseLeave", ["mouseout", "mouseover"]), x("onPointerEnter", ["pointerout", "pointerover"]), x("onPointerLeave", ["pointerout", "pointerover"]), g("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), g("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), g("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), g("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), g("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), g("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var zn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), kp = new Set("cancel close invalid load scroll toggle".split(" ").concat(zn));
  function Os(e, t, r) {
    var n = e.type || "unknown-event";
    e.currentTarget = r, yd(n, t, void 0, e), e.currentTarget = null;
  }
  function As(e, t) {
    t = (t & 4) !== 0;
    for (var r = 0; r < e.length; r++) {
      var n = e[r], l = n.event;
      n = n.listeners;
      e: {
        var o = void 0;
        if (t) for (var s = n.length - 1; 0 <= s; s--) {
          var d = n[s], f = d.instance, k = d.currentTarget;
          if (d = d.listener, f !== o && l.isPropagationStopped()) break e;
          Os(l, d, k), o = f;
        }
        else for (s = 0; s < n.length; s++) {
          if (d = n[s], f = d.instance, k = d.currentTarget, d = d.listener, f !== o && l.isPropagationStopped()) break e;
          Os(l, d, k), o = f;
        }
      }
    }
    if (nl) throw e = Eo, nl = !1, Eo = null, e;
  }
  function xe(e, t) {
    var r = t[li];
    r === void 0 && (r = t[li] = /* @__PURE__ */ new Set());
    var n = e + "__bubble";
    r.has(n) || (Fs(t, e, 2, !1), r.add(n));
  }
  function Xo(e, t, r) {
    var n = 0;
    t && (n |= 4), Fs(r, e, n, t);
  }
  var wl = "_reactListening" + Math.random().toString(36).slice(2);
  function _n(e) {
    if (!e[wl]) {
      e[wl] = !0, p.forEach(function(r) {
        r !== "selectionchange" && (kp.has(r) || Xo(r, !1, e), Xo(r, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[wl] || (t[wl] = !0, Xo("selectionchange", !1, t));
    }
  }
  function Fs(e, t, r, n) {
    switch (ss(t)) {
      case 1:
        var l = Id;
        break;
      case 4:
        l = Dd;
        break;
      default:
        l = Ro;
    }
    r = l.bind(null, t, r, e), l = void 0, !No || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), n ? l !== void 0 ? e.addEventListener(t, r, { capture: !0, passive: l }) : e.addEventListener(t, r, !0) : l !== void 0 ? e.addEventListener(t, r, { passive: l }) : e.addEventListener(t, r, !1);
  }
  function Zo(e, t, r, n, l) {
    var o = n;
    if ((t & 1) === 0 && (t & 2) === 0 && n !== null) e: for (; ; ) {
      if (n === null) return;
      var s = n.tag;
      if (s === 3 || s === 4) {
        var d = n.stateNode.containerInfo;
        if (d === l || d.nodeType === 8 && d.parentNode === l) break;
        if (s === 4) for (s = n.return; s !== null; ) {
          var f = s.tag;
          if ((f === 3 || f === 4) && (f = s.stateNode.containerInfo, f === l || f.nodeType === 8 && f.parentNode === l)) return;
          s = s.return;
        }
        for (; d !== null; ) {
          if (s = gr(d), s === null) return;
          if (f = s.tag, f === 5 || f === 6) {
            n = o = s;
            continue e;
          }
          d = d.parentNode;
        }
      }
      n = n.return;
    }
    Ba(function() {
      var k = o, _ = jo(r), M = [];
      e: {
        var E = Is.get(e);
        if (E !== void 0) {
          var D = Oo, $ = e;
          switch (e) {
            case "keypress":
              if (ml(r) === 0) break e;
            case "keydown":
            case "keyup":
              D = Xd;
              break;
            case "focusin":
              $ = "focus", D = $o;
              break;
            case "focusout":
              $ = "blur", D = $o;
              break;
            case "beforeblur":
            case "afterblur":
              D = $o;
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
              D = ds;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              D = Fd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              D = ep;
              break;
            case Ps:
            case Ls:
            case Ts:
              D = Ud;
              break;
            case Rs:
              D = rp;
              break;
            case "scroll":
              D = Od;
              break;
            case "wheel":
              D = lp;
              break;
            case "copy":
            case "cut":
            case "paste":
              D = Bd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              D = fs;
          }
          var H = (t & 4) !== 0, Ee = !H && e === "scroll", y = H ? E !== null ? E + "Capture" : null : E;
          H = [];
          for (var m = k, w; m !== null; ) {
            w = m;
            var P = w.stateNode;
            if (w.tag === 5 && P !== null && (w = P, y !== null && (P = dn(m, y), P != null && H.push(Mn(m, P, w)))), Ee) break;
            m = m.return;
          }
          0 < H.length && (E = new D(E, $, null, r, _), M.push({ event: E, listeners: H }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (E = e === "mouseover" || e === "pointerover", D = e === "mouseout" || e === "pointerout", E && r !== bo && ($ = r.relatedTarget || r.fromElement) && (gr($) || $[Mt])) break e;
          if ((D || E) && (E = _.window === _ ? _ : (E = _.ownerDocument) ? E.defaultView || E.parentWindow : window, D ? ($ = r.relatedTarget || r.toElement, D = k, $ = $ ? gr($) : null, $ !== null && (Ee = hr($), $ !== Ee || $.tag !== 5 && $.tag !== 6) && ($ = null)) : (D = null, $ = k), D !== $)) {
            if (H = ds, P = "onMouseLeave", y = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (H = fs, P = "onPointerLeave", y = "onPointerEnter", m = "pointer"), Ee = D == null ? E : Vr(D), w = $ == null ? E : Vr($), E = new H(P, m + "leave", D, r, _), E.target = Ee, E.relatedTarget = w, P = null, gr(_) === k && (H = new H(y, m + "enter", $, r, _), H.target = w, H.relatedTarget = Ee, P = H), Ee = P, D && $) t: {
              for (H = D, y = $, m = 0, w = H; w; w = Hr(w)) m++;
              for (w = 0, P = y; P; P = Hr(P)) w++;
              for (; 0 < m - w; ) H = Hr(H), m--;
              for (; 0 < w - m; ) y = Hr(y), w--;
              for (; m--; ) {
                if (H === y || y !== null && H === y.alternate) break t;
                H = Hr(H), y = Hr(y);
              }
              H = null;
            }
            else H = null;
            D !== null && $s(M, E, D, H, !1), $ !== null && Ee !== null && $s(M, Ee, $, H, !0);
          }
        }
        e: {
          if (E = k ? Vr(k) : window, D = E.nodeName && E.nodeName.toLowerCase(), D === "select" || D === "input" && E.type === "file") var U = dp;
          else if (ys(E)) if (ks) U = hp;
          else {
            U = fp;
            var Q = pp;
          }
          else (D = E.nodeName) && D.toLowerCase() === "input" && (E.type === "checkbox" || E.type === "radio") && (U = mp);
          if (U && (U = U(e, k))) {
            ws(M, U, r, _);
            break e;
          }
          Q && Q(e, E, k), e === "focusout" && (Q = E._wrapperState) && Q.controlled && E.type === "number" && xo(E, "number", E.value);
        }
        switch (Q = k ? Vr(k) : window, e) {
          case "focusin":
            (ys(Q) || Q.contentEditable === "true") && (Fr = Q, qo = k, En = null);
            break;
          case "focusout":
            En = qo = Fr = null;
            break;
          case "mousedown":
            Qo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Qo = !1, _s(M, r, _);
            break;
          case "selectionchange":
            if (vp) break;
          case "keydown":
          case "keyup":
            _s(M, r, _);
        }
        var G;
        if (Uo) e: {
          switch (e) {
            case "compositionstart":
              var Z = "onCompositionStart";
              break e;
            case "compositionend":
              Z = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Z = "onCompositionUpdate";
              break e;
          }
          Z = void 0;
        }
        else Ar ? xs(e, r) && (Z = "onCompositionEnd") : e === "keydown" && r.keyCode === 229 && (Z = "onCompositionStart");
        Z && (ms && r.locale !== "ko" && (Ar || Z !== "onCompositionStart" ? Z === "onCompositionEnd" && Ar && (G = us()) : (Yt = _, Do = "value" in Yt ? Yt.value : Yt.textContent, Ar = !0)), Q = kl(k, Z), 0 < Q.length && (Z = new ps(Z, e, null, r, _), M.push({ event: Z, listeners: Q }), G ? Z.data = G : (G = vs(r), G !== null && (Z.data = G)))), (G = ip ? ap(e, r) : sp(e, r)) && (k = kl(k, "onBeforeInput"), 0 < k.length && (_ = new ps("onBeforeInput", "beforeinput", null, r, _), M.push({ event: _, listeners: k }), _.data = G));
      }
      As(M, t);
    });
  }
  function Mn(e, t, r) {
    return { instance: e, listener: t, currentTarget: r };
  }
  function kl(e, t) {
    for (var r = t + "Capture", n = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = dn(e, r), o != null && n.unshift(Mn(e, o, l)), o = dn(e, t), o != null && n.push(Mn(e, o, l))), e = e.return;
    }
    return n;
  }
  function Hr(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function $s(e, t, r, n, l) {
    for (var o = t._reactName, s = []; r !== null && r !== n; ) {
      var d = r, f = d.alternate, k = d.stateNode;
      if (f !== null && f === n) break;
      d.tag === 5 && k !== null && (d = k, l ? (f = dn(r, o), f != null && s.unshift(Mn(r, f, d))) : l || (f = dn(r, o), f != null && s.push(Mn(r, f, d)))), r = r.return;
    }
    s.length !== 0 && e.push({ event: t, listeners: s });
  }
  var bp = /\r\n?/g, jp = /\u0000|\uFFFD/g;
  function Hs(e) {
    return (typeof e == "string" ? e : "" + e).replace(bp, `
`).replace(jp, "");
  }
  function bl(e, t, r) {
    if (t = Hs(t), Hs(e) !== t && r) throw Error(u(425));
  }
  function jl() {
  }
  var Jo = null, ei = null;
  function ti(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var ri = typeof setTimeout == "function" ? setTimeout : void 0, Sp = typeof clearTimeout == "function" ? clearTimeout : void 0, Us = typeof Promise == "function" ? Promise : void 0, Cp = typeof queueMicrotask == "function" ? queueMicrotask : typeof Us < "u" ? function(e) {
    return Us.resolve(null).then(e).catch(Np);
  } : ri;
  function Np(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function ni(e, t) {
    var r = t, n = 0;
    do {
      var l = r.nextSibling;
      if (e.removeChild(r), l && l.nodeType === 8) if (r = l.data, r === "/$") {
        if (n === 0) {
          e.removeChild(l), wn(t);
          return;
        }
        n--;
      } else r !== "$" && r !== "$?" && r !== "$!" || n++;
      r = l;
    } while (r);
    wn(t);
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
  function Vs(e) {
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
  var Ur = Math.random().toString(36).slice(2), St = "__reactFiber$" + Ur, Pn = "__reactProps$" + Ur, Mt = "__reactContainer$" + Ur, li = "__reactEvents$" + Ur, Ep = "__reactListeners$" + Ur, zp = "__reactHandles$" + Ur;
  function gr(e) {
    var t = e[St];
    if (t) return t;
    for (var r = e.parentNode; r; ) {
      if (t = r[Mt] || r[St]) {
        if (r = t.alternate, t.child !== null || r !== null && r.child !== null) for (e = Vs(e); e !== null; ) {
          if (r = e[St]) return r;
          e = Vs(e);
        }
        return t;
      }
      e = r, r = e.parentNode;
    }
    return null;
  }
  function Ln(e) {
    return e = e[St] || e[Mt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Vr(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(u(33));
  }
  function Sl(e) {
    return e[Pn] || null;
  }
  var oi = [], Br = -1;
  function Jt(e) {
    return { current: e };
  }
  function ve(e) {
    0 > Br || (e.current = oi[Br], oi[Br] = null, Br--);
  }
  function he(e, t) {
    Br++, oi[Br] = e.current, e.current = t;
  }
  var er = {}, Ue = Jt(er), Ge = Jt(!1), xr = er;
  function Wr(e, t) {
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
  function Cl() {
    ve(Ge), ve(Ue);
  }
  function Bs(e, t, r) {
    if (Ue.current !== er) throw Error(u(168));
    he(Ue, t), he(Ge, r);
  }
  function Ws(e, t, r) {
    var n = e.stateNode;
    if (t = t.childContextTypes, typeof n.getChildContext != "function") return r;
    n = n.getChildContext();
    for (var l in n) if (!(l in t)) throw Error(u(108, me(e) || "Unknown", l));
    return O({}, r, n);
  }
  function Nl(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || er, xr = Ue.current, he(Ue, e), he(Ge, Ge.current), !0;
  }
  function qs(e, t, r) {
    var n = e.stateNode;
    if (!n) throw Error(u(169));
    r ? (e = Ws(e, t, xr), n.__reactInternalMemoizedMergedChildContext = e, ve(Ge), ve(Ue), he(Ue, e)) : ve(Ge), he(Ge, r);
  }
  var Pt = null, El = !1, ii = !1;
  function Qs(e) {
    Pt === null ? Pt = [e] : Pt.push(e);
  }
  function _p(e) {
    El = !0, Qs(e);
  }
  function tr() {
    if (!ii && Pt !== null) {
      ii = !0;
      var e = 0, t = fe;
      try {
        var r = Pt;
        for (fe = 1; e < r.length; e++) {
          var n = r[e];
          do
            n = n(!0);
          while (n !== null);
        }
        Pt = null, El = !1;
      } catch (l) {
        throw Pt !== null && (Pt = Pt.slice(e + 1)), Ka(zo, tr), l;
      } finally {
        fe = t, ii = !1;
      }
    }
    return null;
  }
  var qr = [], Qr = 0, zl = null, _l = 0, it = [], at = 0, vr = null, Lt = 1, Tt = "";
  function yr(e, t) {
    qr[Qr++] = _l, qr[Qr++] = zl, zl = e, _l = t;
  }
  function Gs(e, t, r) {
    it[at++] = Lt, it[at++] = Tt, it[at++] = vr, vr = e;
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
  function ai(e) {
    e.return !== null && (yr(e, 1), Gs(e, 1, 0));
  }
  function si(e) {
    for (; e === zl; ) zl = qr[--Qr], qr[Qr] = null, _l = qr[--Qr], qr[Qr] = null;
    for (; e === vr; ) vr = it[--at], it[at] = null, Tt = it[--at], it[at] = null, Lt = it[--at], it[at] = null;
  }
  var nt = null, lt = null, be = !1, gt = null;
  function Ks(e, t) {
    var r = dt(5, null, null, 0);
    r.elementType = "DELETED", r.stateNode = t, r.return = e, t = e.deletions, t === null ? (e.deletions = [r], e.flags |= 16) : t.push(r);
  }
  function Ys(e, t) {
    switch (e.tag) {
      case 5:
        var r = e.type;
        return t = t.nodeType !== 1 || r.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, nt = e, lt = Zt(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, nt = e, lt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (r = vr !== null ? { id: Lt, overflow: Tt } : null, e.memoizedState = { dehydrated: t, treeContext: r, retryLane: 1073741824 }, r = dt(18, null, null, 0), r.stateNode = t, r.return = e, e.child = r, nt = e, lt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function ui(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function ci(e) {
    if (be) {
      var t = lt;
      if (t) {
        var r = t;
        if (!Ys(e, t)) {
          if (ui(e)) throw Error(u(418));
          t = Zt(r.nextSibling);
          var n = nt;
          t && Ys(e, t) ? Ks(n, r) : (e.flags = e.flags & -4097 | 2, be = !1, nt = e);
        }
      } else {
        if (ui(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, be = !1, nt = e;
      }
    }
  }
  function Xs(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    nt = e;
  }
  function Ml(e) {
    if (e !== nt) return !1;
    if (!be) return Xs(e), be = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ti(e.type, e.memoizedProps)), t && (t = lt)) {
      if (ui(e)) throw Zs(), Error(u(418));
      for (; t; ) Ks(e, t), t = Zt(t.nextSibling);
    }
    if (Xs(e), e.tag === 13) {
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
  function Zs() {
    for (var e = lt; e; ) e = Zt(e.nextSibling);
  }
  function Gr() {
    lt = nt = null, be = !1;
  }
  function di(e) {
    gt === null ? gt = [e] : gt.push(e);
  }
  var Mp = q.ReactCurrentBatchConfig;
  function Tn(e, t, r) {
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
  function Pl(e, t) {
    throw e = Object.prototype.toString.call(t), Error(u(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Js(e) {
    var t = e._init;
    return t(e._payload);
  }
  function eu(e) {
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
    function d(y, m, w, P) {
      return m === null || m.tag !== 6 ? (m = ra(w, y.mode, P), m.return = y, m) : (m = l(m, w), m.return = y, m);
    }
    function f(y, m, w, P) {
      var U = w.type;
      return U === de ? _(y, m, w.props.children, P, w.key) : m !== null && (m.elementType === U || typeof U == "object" && U !== null && U.$$typeof === Me && Js(U) === m.type) ? (P = l(m, w.props), P.ref = Tn(y, m, w), P.return = y, P) : (P = to(w.type, w.key, w.props, null, y.mode, P), P.ref = Tn(y, m, w), P.return = y, P);
    }
    function k(y, m, w, P) {
      return m === null || m.tag !== 4 || m.stateNode.containerInfo !== w.containerInfo || m.stateNode.implementation !== w.implementation ? (m = na(w, y.mode, P), m.return = y, m) : (m = l(m, w.children || []), m.return = y, m);
    }
    function _(y, m, w, P, U) {
      return m === null || m.tag !== 7 ? (m = Er(w, y.mode, P, U), m.return = y, m) : (m = l(m, w), m.return = y, m);
    }
    function M(y, m, w) {
      if (typeof m == "string" && m !== "" || typeof m == "number") return m = ra("" + m, y.mode, w), m.return = y, m;
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case ee:
            return w = to(m.type, m.key, m.props, null, y.mode, w), w.ref = Tn(y, null, m), w.return = y, w;
          case Y:
            return m = na(m, y.mode, w), m.return = y, m;
          case Me:
            var P = m._init;
            return M(y, P(m._payload), w);
        }
        if (sn(m) || B(m)) return m = Er(m, y.mode, w, null), m.return = y, m;
        Pl(y, m);
      }
      return null;
    }
    function E(y, m, w, P) {
      var U = m !== null ? m.key : null;
      if (typeof w == "string" && w !== "" || typeof w == "number") return U !== null ? null : d(y, m, "" + w, P);
      if (typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case ee:
            return w.key === U ? f(y, m, w, P) : null;
          case Y:
            return w.key === U ? k(y, m, w, P) : null;
          case Me:
            return U = w._init, E(
              y,
              m,
              U(w._payload),
              P
            );
        }
        if (sn(w) || B(w)) return U !== null ? null : _(y, m, w, P, null);
        Pl(y, w);
      }
      return null;
    }
    function D(y, m, w, P, U) {
      if (typeof P == "string" && P !== "" || typeof P == "number") return y = y.get(w) || null, d(m, y, "" + P, U);
      if (typeof P == "object" && P !== null) {
        switch (P.$$typeof) {
          case ee:
            return y = y.get(P.key === null ? w : P.key) || null, f(m, y, P, U);
          case Y:
            return y = y.get(P.key === null ? w : P.key) || null, k(m, y, P, U);
          case Me:
            var Q = P._init;
            return D(y, m, w, Q(P._payload), U);
        }
        if (sn(P) || B(P)) return y = y.get(w) || null, _(m, y, P, U, null);
        Pl(m, P);
      }
      return null;
    }
    function $(y, m, w, P) {
      for (var U = null, Q = null, G = m, Z = m = 0, Ie = null; G !== null && Z < w.length; Z++) {
        G.index > Z ? (Ie = G, G = null) : Ie = G.sibling;
        var ce = E(y, G, w[Z], P);
        if (ce === null) {
          G === null && (G = Ie);
          break;
        }
        e && G && ce.alternate === null && t(y, G), m = o(ce, m, Z), Q === null ? U = ce : Q.sibling = ce, Q = ce, G = Ie;
      }
      if (Z === w.length) return r(y, G), be && yr(y, Z), U;
      if (G === null) {
        for (; Z < w.length; Z++) G = M(y, w[Z], P), G !== null && (m = o(G, m, Z), Q === null ? U = G : Q.sibling = G, Q = G);
        return be && yr(y, Z), U;
      }
      for (G = n(y, G); Z < w.length; Z++) Ie = D(G, y, Z, w[Z], P), Ie !== null && (e && Ie.alternate !== null && G.delete(Ie.key === null ? Z : Ie.key), m = o(Ie, m, Z), Q === null ? U = Ie : Q.sibling = Ie, Q = Ie);
      return e && G.forEach(function(cr) {
        return t(y, cr);
      }), be && yr(y, Z), U;
    }
    function H(y, m, w, P) {
      var U = B(w);
      if (typeof U != "function") throw Error(u(150));
      if (w = U.call(w), w == null) throw Error(u(151));
      for (var Q = U = null, G = m, Z = m = 0, Ie = null, ce = w.next(); G !== null && !ce.done; Z++, ce = w.next()) {
        G.index > Z ? (Ie = G, G = null) : Ie = G.sibling;
        var cr = E(y, G, ce.value, P);
        if (cr === null) {
          G === null && (G = Ie);
          break;
        }
        e && G && cr.alternate === null && t(y, G), m = o(cr, m, Z), Q === null ? U = cr : Q.sibling = cr, Q = cr, G = Ie;
      }
      if (ce.done) return r(
        y,
        G
      ), be && yr(y, Z), U;
      if (G === null) {
        for (; !ce.done; Z++, ce = w.next()) ce = M(y, ce.value, P), ce !== null && (m = o(ce, m, Z), Q === null ? U = ce : Q.sibling = ce, Q = ce);
        return be && yr(y, Z), U;
      }
      for (G = n(y, G); !ce.done; Z++, ce = w.next()) ce = D(G, y, Z, ce.value, P), ce !== null && (e && ce.alternate !== null && G.delete(ce.key === null ? Z : ce.key), m = o(ce, m, Z), Q === null ? U = ce : Q.sibling = ce, Q = ce);
      return e && G.forEach(function(cf) {
        return t(y, cf);
      }), be && yr(y, Z), U;
    }
    function Ee(y, m, w, P) {
      if (typeof w == "object" && w !== null && w.type === de && w.key === null && (w = w.props.children), typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case ee:
            e: {
              for (var U = w.key, Q = m; Q !== null; ) {
                if (Q.key === U) {
                  if (U = w.type, U === de) {
                    if (Q.tag === 7) {
                      r(y, Q.sibling), m = l(Q, w.props.children), m.return = y, y = m;
                      break e;
                    }
                  } else if (Q.elementType === U || typeof U == "object" && U !== null && U.$$typeof === Me && Js(U) === Q.type) {
                    r(y, Q.sibling), m = l(Q, w.props), m.ref = Tn(y, Q, w), m.return = y, y = m;
                    break e;
                  }
                  r(y, Q);
                  break;
                } else t(y, Q);
                Q = Q.sibling;
              }
              w.type === de ? (m = Er(w.props.children, y.mode, P, w.key), m.return = y, y = m) : (P = to(w.type, w.key, w.props, null, y.mode, P), P.ref = Tn(y, m, w), P.return = y, y = P);
            }
            return s(y);
          case Y:
            e: {
              for (Q = w.key; m !== null; ) {
                if (m.key === Q) if (m.tag === 4 && m.stateNode.containerInfo === w.containerInfo && m.stateNode.implementation === w.implementation) {
                  r(y, m.sibling), m = l(m, w.children || []), m.return = y, y = m;
                  break e;
                } else {
                  r(y, m);
                  break;
                }
                else t(y, m);
                m = m.sibling;
              }
              m = na(w, y.mode, P), m.return = y, y = m;
            }
            return s(y);
          case Me:
            return Q = w._init, Ee(y, m, Q(w._payload), P);
        }
        if (sn(w)) return $(y, m, w, P);
        if (B(w)) return H(y, m, w, P);
        Pl(y, w);
      }
      return typeof w == "string" && w !== "" || typeof w == "number" ? (w = "" + w, m !== null && m.tag === 6 ? (r(y, m.sibling), m = l(m, w), m.return = y, y = m) : (r(y, m), m = ra(w, y.mode, P), m.return = y, y = m), s(y)) : r(y, m);
    }
    return Ee;
  }
  var Kr = eu(!0), tu = eu(!1), Ll = Jt(null), Tl = null, Yr = null, pi = null;
  function fi() {
    pi = Yr = Tl = null;
  }
  function mi(e) {
    var t = Ll.current;
    ve(Ll), e._currentValue = t;
  }
  function hi(e, t, r) {
    for (; e !== null; ) {
      var n = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, n !== null && (n.childLanes |= t)) : n !== null && (n.childLanes & t) !== t && (n.childLanes |= t), e === r) break;
      e = e.return;
    }
  }
  function Xr(e, t) {
    Tl = e, pi = Yr = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ye = !0), e.firstContext = null);
  }
  function st(e) {
    var t = e._currentValue;
    if (pi !== e) if (e = { context: e, memoizedValue: t, next: null }, Yr === null) {
      if (Tl === null) throw Error(u(308));
      Yr = e, Tl.dependencies = { lanes: 0, firstContext: e };
    } else Yr = Yr.next = e;
    return t;
  }
  var wr = null;
  function gi(e) {
    wr === null ? wr = [e] : wr.push(e);
  }
  function ru(e, t, r, n) {
    var l = t.interleaved;
    return l === null ? (r.next = r, gi(t)) : (r.next = l.next, l.next = r), t.interleaved = r, Rt(e, n);
  }
  function Rt(e, t) {
    e.lanes |= t;
    var r = e.alternate;
    for (r !== null && (r.lanes |= t), r = e, e = e.return; e !== null; ) e.childLanes |= t, r = e.alternate, r !== null && (r.childLanes |= t), r = e, e = e.return;
    return r.tag === 3 ? r.stateNode : null;
  }
  var rr = !1;
  function xi(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function nu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function It(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function nr(e, t, r) {
    var n = e.updateQueue;
    if (n === null) return null;
    if (n = n.shared, (ae & 2) !== 0) {
      var l = n.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), n.pending = t, Rt(e, r);
    }
    return l = n.interleaved, l === null ? (t.next = t, gi(n)) : (t.next = l.next, l.next = t), n.interleaved = t, Rt(e, r);
  }
  function Rl(e, t, r) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (r & 4194240) !== 0)) {
      var n = t.lanes;
      n &= e.pendingLanes, r |= n, t.lanes = r, Po(e, r);
    }
  }
  function lu(e, t) {
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
      var f = d, k = f.next;
      f.next = null, s === null ? o = k : s.next = k, s = f;
      var _ = e.alternate;
      _ !== null && (_ = _.updateQueue, d = _.lastBaseUpdate, d !== s && (d === null ? _.firstBaseUpdate = k : d.next = k, _.lastBaseUpdate = f));
    }
    if (o !== null) {
      var M = l.baseState;
      s = 0, _ = k = f = null, d = o;
      do {
        var E = d.lane, D = d.eventTime;
        if ((n & E) === E) {
          _ !== null && (_ = _.next = {
            eventTime: D,
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          });
          e: {
            var $ = e, H = d;
            switch (E = t, D = r, H.tag) {
              case 1:
                if ($ = H.payload, typeof $ == "function") {
                  M = $.call(D, M, E);
                  break e;
                }
                M = $;
                break e;
              case 3:
                $.flags = $.flags & -65537 | 128;
              case 0:
                if ($ = H.payload, E = typeof $ == "function" ? $.call(D, M, E) : $, E == null) break e;
                M = O({}, M, E);
                break e;
              case 2:
                rr = !0;
            }
          }
          d.callback !== null && d.lane !== 0 && (e.flags |= 64, E = l.effects, E === null ? l.effects = [d] : E.push(d));
        } else D = { eventTime: D, lane: E, tag: d.tag, payload: d.payload, callback: d.callback, next: null }, _ === null ? (k = _ = D, f = M) : _ = _.next = D, s |= E;
        if (d = d.next, d === null) {
          if (d = l.shared.pending, d === null) break;
          E = d, d = E.next, E.next = null, l.lastBaseUpdate = E, l.shared.pending = null;
        }
      } while (!0);
      if (_ === null && (f = M), l.baseState = f, l.firstBaseUpdate = k, l.lastBaseUpdate = _, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          s |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      jr |= s, e.lanes = s, e.memoizedState = M;
    }
  }
  function ou(e, t, r) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var n = e[t], l = n.callback;
      if (l !== null) {
        if (n.callback = null, n = r, typeof l != "function") throw Error(u(191, l));
        l.call(n);
      }
    }
  }
  var Rn = {}, Ct = Jt(Rn), In = Jt(Rn), Dn = Jt(Rn);
  function kr(e) {
    if (e === Rn) throw Error(u(174));
    return e;
  }
  function vi(e, t) {
    switch (he(Dn, t), he(In, e), he(Ct, Rn), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : yo(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = yo(t, e);
    }
    ve(Ct), he(Ct, t);
  }
  function Zr() {
    ve(Ct), ve(In), ve(Dn);
  }
  function iu(e) {
    kr(Dn.current);
    var t = kr(Ct.current), r = yo(t, e.type);
    t !== r && (he(In, e), he(Ct, r));
  }
  function yi(e) {
    In.current === e && (ve(Ct), ve(In));
  }
  var je = Jt(0);
  function Dl(e) {
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
  var wi = [];
  function ki() {
    for (var e = 0; e < wi.length; e++) wi[e]._workInProgressVersionPrimary = null;
    wi.length = 0;
  }
  var Ol = q.ReactCurrentDispatcher, bi = q.ReactCurrentBatchConfig, br = 0, Se = null, Pe = null, Te = null, Al = !1, On = !1, An = 0, Pp = 0;
  function Ve() {
    throw Error(u(321));
  }
  function ji(e, t) {
    if (t === null) return !1;
    for (var r = 0; r < t.length && r < e.length; r++) if (!ht(e[r], t[r])) return !1;
    return !0;
  }
  function Si(e, t, r, n, l, o) {
    if (br = o, Se = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, Ol.current = e === null || e.memoizedState === null ? Ip : Dp, e = r(n, l), On) {
      o = 0;
      do {
        if (On = !1, An = 0, 25 <= o) throw Error(u(301));
        o += 1, Te = Pe = null, t.updateQueue = null, Ol.current = Op, e = r(n, l);
      } while (On);
    }
    if (Ol.current = Hl, t = Pe !== null && Pe.next !== null, br = 0, Te = Pe = Se = null, Al = !1, t) throw Error(u(300));
    return e;
  }
  function Ci() {
    var e = An !== 0;
    return An = 0, e;
  }
  function Nt() {
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
  function Fn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Ni(e) {
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
      var d = s = null, f = null, k = o;
      do {
        var _ = k.lane;
        if ((br & _) === _) f !== null && (f = f.next = { lane: 0, action: k.action, hasEagerState: k.hasEagerState, eagerState: k.eagerState, next: null }), n = k.hasEagerState ? k.eagerState : e(n, k.action);
        else {
          var M = {
            lane: _,
            action: k.action,
            hasEagerState: k.hasEagerState,
            eagerState: k.eagerState,
            next: null
          };
          f === null ? (d = f = M, s = n) : f = f.next = M, Se.lanes |= _, jr |= _;
        }
        k = k.next;
      } while (k !== null && k !== o);
      f === null ? s = n : f.next = d, ht(n, t.memoizedState) || (Ye = !0), t.memoizedState = n, t.baseState = s, t.baseQueue = f, r.lastRenderedState = n;
    }
    if (e = r.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, Se.lanes |= o, jr |= o, l = l.next;
      while (l !== e);
    } else l === null && (r.lanes = 0);
    return [t.memoizedState, r.dispatch];
  }
  function Ei(e) {
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
      ht(o, t.memoizedState) || (Ye = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), r.lastRenderedState = o;
    }
    return [o, n];
  }
  function au() {
  }
  function su(e, t) {
    var r = Se, n = ut(), l = t(), o = !ht(n.memoizedState, l);
    if (o && (n.memoizedState = l, Ye = !0), n = n.queue, zi(du.bind(null, r, n, e), [e]), n.getSnapshot !== t || o || Te !== null && Te.memoizedState.tag & 1) {
      if (r.flags |= 2048, $n(9, cu.bind(null, r, n, l, t), void 0, null), Re === null) throw Error(u(349));
      (br & 30) !== 0 || uu(r, t, l);
    }
    return l;
  }
  function uu(e, t, r) {
    e.flags |= 16384, e = { getSnapshot: t, value: r }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.stores = [e]) : (r = t.stores, r === null ? t.stores = [e] : r.push(e));
  }
  function cu(e, t, r, n) {
    t.value = r, t.getSnapshot = n, pu(t) && fu(e);
  }
  function du(e, t, r) {
    return r(function() {
      pu(t) && fu(e);
    });
  }
  function pu(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var r = t();
      return !ht(e, r);
    } catch {
      return !0;
    }
  }
  function fu(e) {
    var t = Rt(e, 1);
    t !== null && wt(t, e, 1, -1);
  }
  function mu(e) {
    var t = Nt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Fn, lastRenderedState: e }, t.queue = e, e = e.dispatch = Rp.bind(null, Se, e), [t.memoizedState, e];
  }
  function $n(e, t, r, n) {
    return e = { tag: e, create: t, destroy: r, deps: n, next: null }, t = Se.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Se.updateQueue = t, t.lastEffect = e.next = e) : (r = t.lastEffect, r === null ? t.lastEffect = e.next = e : (n = r.next, r.next = e, e.next = n, t.lastEffect = e)), e;
  }
  function hu() {
    return ut().memoizedState;
  }
  function Fl(e, t, r, n) {
    var l = Nt();
    Se.flags |= e, l.memoizedState = $n(1 | t, r, void 0, n === void 0 ? null : n);
  }
  function $l(e, t, r, n) {
    var l = ut();
    n = n === void 0 ? null : n;
    var o = void 0;
    if (Pe !== null) {
      var s = Pe.memoizedState;
      if (o = s.destroy, n !== null && ji(n, s.deps)) {
        l.memoizedState = $n(t, r, o, n);
        return;
      }
    }
    Se.flags |= e, l.memoizedState = $n(1 | t, r, o, n);
  }
  function gu(e, t) {
    return Fl(8390656, 8, e, t);
  }
  function zi(e, t) {
    return $l(2048, 8, e, t);
  }
  function xu(e, t) {
    return $l(4, 2, e, t);
  }
  function vu(e, t) {
    return $l(4, 4, e, t);
  }
  function yu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function wu(e, t, r) {
    return r = r != null ? r.concat([e]) : null, $l(4, 4, yu.bind(null, t, e), r);
  }
  function _i() {
  }
  function ku(e, t) {
    var r = ut();
    t = t === void 0 ? null : t;
    var n = r.memoizedState;
    return n !== null && t !== null && ji(t, n[1]) ? n[0] : (r.memoizedState = [e, t], e);
  }
  function bu(e, t) {
    var r = ut();
    t = t === void 0 ? null : t;
    var n = r.memoizedState;
    return n !== null && t !== null && ji(t, n[1]) ? n[0] : (e = e(), r.memoizedState = [e, t], e);
  }
  function ju(e, t, r) {
    return (br & 21) === 0 ? (e.baseState && (e.baseState = !1, Ye = !0), e.memoizedState = r) : (ht(r, t) || (r = Ja(), Se.lanes |= r, jr |= r, e.baseState = !0), t);
  }
  function Lp(e, t) {
    var r = fe;
    fe = r !== 0 && 4 > r ? r : 4, e(!0);
    var n = bi.transition;
    bi.transition = {};
    try {
      e(!1), t();
    } finally {
      fe = r, bi.transition = n;
    }
  }
  function Su() {
    return ut().memoizedState;
  }
  function Tp(e, t, r) {
    var n = ar(e);
    if (r = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null }, Cu(e)) Nu(t, r);
    else if (r = ru(e, t, r, n), r !== null) {
      var l = Qe();
      wt(r, e, n, l), Eu(r, t, n);
    }
  }
  function Rp(e, t, r) {
    var n = ar(e), l = { lane: n, action: r, hasEagerState: !1, eagerState: null, next: null };
    if (Cu(e)) Nu(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var s = t.lastRenderedState, d = o(s, r);
        if (l.hasEagerState = !0, l.eagerState = d, ht(d, s)) {
          var f = t.interleaved;
          f === null ? (l.next = l, gi(t)) : (l.next = f.next, f.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      r = ru(e, t, l, n), r !== null && (l = Qe(), wt(r, e, n, l), Eu(r, t, n));
    }
  }
  function Cu(e) {
    var t = e.alternate;
    return e === Se || t !== null && t === Se;
  }
  function Nu(e, t) {
    On = Al = !0;
    var r = e.pending;
    r === null ? t.next = t : (t.next = r.next, r.next = t), e.pending = t;
  }
  function Eu(e, t, r) {
    if ((r & 4194240) !== 0) {
      var n = t.lanes;
      n &= e.pendingLanes, r |= n, t.lanes = r, Po(e, r);
    }
  }
  var Hl = { readContext: st, useCallback: Ve, useContext: Ve, useEffect: Ve, useImperativeHandle: Ve, useInsertionEffect: Ve, useLayoutEffect: Ve, useMemo: Ve, useReducer: Ve, useRef: Ve, useState: Ve, useDebugValue: Ve, useDeferredValue: Ve, useTransition: Ve, useMutableSource: Ve, useSyncExternalStore: Ve, useId: Ve, unstable_isNewReconciler: !1 }, Ip = { readContext: st, useCallback: function(e, t) {
    return Nt().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: st, useEffect: gu, useImperativeHandle: function(e, t, r) {
    return r = r != null ? r.concat([e]) : null, Fl(
      4194308,
      4,
      yu.bind(null, t, e),
      r
    );
  }, useLayoutEffect: function(e, t) {
    return Fl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Fl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var r = Nt();
    return t = t === void 0 ? null : t, e = e(), r.memoizedState = [e, t], e;
  }, useReducer: function(e, t, r) {
    var n = Nt();
    return t = r !== void 0 ? r(t) : t, n.memoizedState = n.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, n.queue = e, e = e.dispatch = Tp.bind(null, Se, e), [n.memoizedState, e];
  }, useRef: function(e) {
    var t = Nt();
    return e = { current: e }, t.memoizedState = e;
  }, useState: mu, useDebugValue: _i, useDeferredValue: function(e) {
    return Nt().memoizedState = e;
  }, useTransition: function() {
    var e = mu(!1), t = e[0];
    return e = Lp.bind(null, e[1]), Nt().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, r) {
    var n = Se, l = Nt();
    if (be) {
      if (r === void 0) throw Error(u(407));
      r = r();
    } else {
      if (r = t(), Re === null) throw Error(u(349));
      (br & 30) !== 0 || uu(n, t, r);
    }
    l.memoizedState = r;
    var o = { value: r, getSnapshot: t };
    return l.queue = o, gu(du.bind(
      null,
      n,
      o,
      e
    ), [e]), n.flags |= 2048, $n(9, cu.bind(null, n, o, r, t), void 0, null), r;
  }, useId: function() {
    var e = Nt(), t = Re.identifierPrefix;
    if (be) {
      var r = Tt, n = Lt;
      r = (n & ~(1 << 32 - mt(n) - 1)).toString(32) + r, t = ":" + t + "R" + r, r = An++, 0 < r && (t += "H" + r.toString(32)), t += ":";
    } else r = Pp++, t = ":" + t + "r" + r.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Dp = {
    readContext: st,
    useCallback: ku,
    useContext: st,
    useEffect: zi,
    useImperativeHandle: wu,
    useInsertionEffect: xu,
    useLayoutEffect: vu,
    useMemo: bu,
    useReducer: Ni,
    useRef: hu,
    useState: function() {
      return Ni(Fn);
    },
    useDebugValue: _i,
    useDeferredValue: function(e) {
      var t = ut();
      return ju(t, Pe.memoizedState, e);
    },
    useTransition: function() {
      var e = Ni(Fn)[0], t = ut().memoizedState;
      return [e, t];
    },
    useMutableSource: au,
    useSyncExternalStore: su,
    useId: Su,
    unstable_isNewReconciler: !1
  }, Op = { readContext: st, useCallback: ku, useContext: st, useEffect: zi, useImperativeHandle: wu, useInsertionEffect: xu, useLayoutEffect: vu, useMemo: bu, useReducer: Ei, useRef: hu, useState: function() {
    return Ei(Fn);
  }, useDebugValue: _i, useDeferredValue: function(e) {
    var t = ut();
    return Pe === null ? t.memoizedState = e : ju(t, Pe.memoizedState, e);
  }, useTransition: function() {
    var e = Ei(Fn)[0], t = ut().memoizedState;
    return [e, t];
  }, useMutableSource: au, useSyncExternalStore: su, useId: Su, unstable_isNewReconciler: !1 };
  function xt(e, t) {
    if (e && e.defaultProps) {
      t = O({}, t), e = e.defaultProps;
      for (var r in e) t[r] === void 0 && (t[r] = e[r]);
      return t;
    }
    return t;
  }
  function Mi(e, t, r, n) {
    t = e.memoizedState, r = r(n, t), r = r == null ? t : O({}, t, r), e.memoizedState = r, e.lanes === 0 && (e.updateQueue.baseState = r);
  }
  var Ul = { isMounted: function(e) {
    return (e = e._reactInternals) ? hr(e) === e : !1;
  }, enqueueSetState: function(e, t, r) {
    e = e._reactInternals;
    var n = Qe(), l = ar(e), o = It(n, l);
    o.payload = t, r != null && (o.callback = r), t = nr(e, o, l), t !== null && (wt(t, e, l, n), Rl(t, e, l));
  }, enqueueReplaceState: function(e, t, r) {
    e = e._reactInternals;
    var n = Qe(), l = ar(e), o = It(n, l);
    o.tag = 1, o.payload = t, r != null && (o.callback = r), t = nr(e, o, l), t !== null && (wt(t, e, l, n), Rl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var r = Qe(), n = ar(e), l = It(r, n);
    l.tag = 2, t != null && (l.callback = t), t = nr(e, l, n), t !== null && (wt(t, e, n, r), Rl(t, e, n));
  } };
  function zu(e, t, r, n, l, o, s) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(n, o, s) : t.prototype && t.prototype.isPureReactComponent ? !Nn(r, n) || !Nn(l, o) : !0;
  }
  function _u(e, t, r) {
    var n = !1, l = er, o = t.contextType;
    return typeof o == "object" && o !== null ? o = st(o) : (l = Ke(t) ? xr : Ue.current, n = t.contextTypes, o = (n = n != null) ? Wr(e, l) : er), t = new t(r, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Ul, e.stateNode = t, t._reactInternals = e, n && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function Mu(e, t, r, n) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(r, n), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(r, n), t.state !== e && Ul.enqueueReplaceState(t, t.state, null);
  }
  function Pi(e, t, r, n) {
    var l = e.stateNode;
    l.props = r, l.state = e.memoizedState, l.refs = {}, xi(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = st(o) : (o = Ke(t) ? xr : Ue.current, l.context = Wr(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (Mi(e, t, o, r), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Ul.enqueueReplaceState(l, l.state, null), Il(e, r, l, n), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Jr(e, t) {
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
  function Li(e, t, r) {
    return { value: e, source: null, stack: r ?? null, digest: t ?? null };
  }
  function Ti(e, t) {
    try {
      console.error(t.value);
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  var Ap = typeof WeakMap == "function" ? WeakMap : Map;
  function Pu(e, t, r) {
    r = It(-1, r), r.tag = 3, r.payload = { element: null };
    var n = t.value;
    return r.callback = function() {
      Kl || (Kl = !0, Gi = n), Ti(e, t);
    }, r;
  }
  function Lu(e, t, r) {
    r = It(-1, r), r.tag = 3;
    var n = e.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var l = t.value;
      r.payload = function() {
        return n(l);
      }, r.callback = function() {
        Ti(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (r.callback = function() {
      Ti(e, t), typeof n != "function" && (or === null ? or = /* @__PURE__ */ new Set([this]) : or.add(this));
      var s = t.stack;
      this.componentDidCatch(t.value, { componentStack: s !== null ? s : "" });
    }), r;
  }
  function Tu(e, t, r) {
    var n = e.pingCache;
    if (n === null) {
      n = e.pingCache = new Ap();
      var l = /* @__PURE__ */ new Set();
      n.set(t, l);
    } else l = n.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), n.set(t, l));
    l.has(r) || (l.add(r), e = Zp.bind(null, e, t, r), t.then(e, e));
  }
  function Ru(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Iu(e, t, r, n, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, r.flags |= 131072, r.flags &= -52805, r.tag === 1 && (r.alternate === null ? r.tag = 17 : (t = It(-1, 1), t.tag = 2, nr(r, t, 1))), r.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Fp = q.ReactCurrentOwner, Ye = !1;
  function qe(e, t, r, n) {
    t.child = e === null ? tu(t, null, r, n) : Kr(t, e.child, r, n);
  }
  function Du(e, t, r, n, l) {
    r = r.render;
    var o = t.ref;
    return Xr(t, l), n = Si(e, t, r, n, o, l), r = Ci(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Dt(e, t, l)) : (be && r && ai(t), t.flags |= 1, qe(e, t, n, l), t.child);
  }
  function Ou(e, t, r, n, l) {
    if (e === null) {
      var o = r.type;
      return typeof o == "function" && !ta(o) && o.defaultProps === void 0 && r.compare === null && r.defaultProps === void 0 ? (t.tag = 15, t.type = o, Au(e, t, o, n, l)) : (e = to(r.type, null, n, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var s = o.memoizedProps;
      if (r = r.compare, r = r !== null ? r : Nn, r(s, n) && e.ref === t.ref) return Dt(e, t, l);
    }
    return t.flags |= 1, e = ur(o, n), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Au(e, t, r, n, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (Nn(o, n) && e.ref === t.ref) if (Ye = !1, t.pendingProps = n = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ye = !0);
      else return t.lanes = e.lanes, Dt(e, t, l);
    }
    return Ri(e, t, r, n, l);
  }
  function Fu(e, t, r) {
    var n = t.pendingProps, l = n.children, o = e !== null ? e.memoizedState : null;
    if (n.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, he(tn, ot), ot |= r;
    else {
      if ((r & 1073741824) === 0) return e = o !== null ? o.baseLanes | r : r, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, he(tn, ot), ot |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, n = o !== null ? o.baseLanes : r, he(tn, ot), ot |= n;
    }
    else o !== null ? (n = o.baseLanes | r, t.memoizedState = null) : n = r, he(tn, ot), ot |= n;
    return qe(e, t, l, r), t.child;
  }
  function $u(e, t) {
    var r = t.ref;
    (e === null && r !== null || e !== null && e.ref !== r) && (t.flags |= 512, t.flags |= 2097152);
  }
  function Ri(e, t, r, n, l) {
    var o = Ke(r) ? xr : Ue.current;
    return o = Wr(t, o), Xr(t, l), r = Si(e, t, r, n, o, l), n = Ci(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Dt(e, t, l)) : (be && n && ai(t), t.flags |= 1, qe(e, t, r, l), t.child);
  }
  function Hu(e, t, r, n, l) {
    if (Ke(r)) {
      var o = !0;
      Nl(t);
    } else o = !1;
    if (Xr(t, l), t.stateNode === null) Bl(e, t), _u(t, r, n), Pi(t, r, n, l), n = !0;
    else if (e === null) {
      var s = t.stateNode, d = t.memoizedProps;
      s.props = d;
      var f = s.context, k = r.contextType;
      typeof k == "object" && k !== null ? k = st(k) : (k = Ke(r) ? xr : Ue.current, k = Wr(t, k));
      var _ = r.getDerivedStateFromProps, M = typeof _ == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      M || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (d !== n || f !== k) && Mu(t, s, n, k), rr = !1;
      var E = t.memoizedState;
      s.state = E, Il(t, n, s, l), f = t.memoizedState, d !== n || E !== f || Ge.current || rr ? (typeof _ == "function" && (Mi(t, r, _, n), f = t.memoizedState), (d = rr || zu(t, r, d, n, E, f, k)) ? (M || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = n, t.memoizedState = f), s.props = n, s.state = f, s.context = k, n = d) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), n = !1);
    } else {
      s = t.stateNode, nu(e, t), d = t.memoizedProps, k = t.type === t.elementType ? d : xt(t.type, d), s.props = k, M = t.pendingProps, E = s.context, f = r.contextType, typeof f == "object" && f !== null ? f = st(f) : (f = Ke(r) ? xr : Ue.current, f = Wr(t, f));
      var D = r.getDerivedStateFromProps;
      (_ = typeof D == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (d !== M || E !== f) && Mu(t, s, n, f), rr = !1, E = t.memoizedState, s.state = E, Il(t, n, s, l);
      var $ = t.memoizedState;
      d !== M || E !== $ || Ge.current || rr ? (typeof D == "function" && (Mi(t, r, D, n), $ = t.memoizedState), (k = rr || zu(t, r, k, n, E, $, f) || !1) ? (_ || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(n, $, f), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(n, $, f)), typeof s.componentDidUpdate == "function" && (t.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 1024), t.memoizedProps = n, t.memoizedState = $), s.props = n, s.state = $, s.context = f, n = k) : (typeof s.componentDidUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && E === e.memoizedState || (t.flags |= 1024), n = !1);
    }
    return Ii(e, t, r, n, o, l);
  }
  function Ii(e, t, r, n, l, o) {
    $u(e, t);
    var s = (t.flags & 128) !== 0;
    if (!n && !s) return l && qs(t, r, !1), Dt(e, t, o);
    n = t.stateNode, Fp.current = t;
    var d = s && typeof r.getDerivedStateFromError != "function" ? null : n.render();
    return t.flags |= 1, e !== null && s ? (t.child = Kr(t, e.child, null, o), t.child = Kr(t, null, d, o)) : qe(e, t, d, o), t.memoizedState = n.state, l && qs(t, r, !0), t.child;
  }
  function Uu(e) {
    var t = e.stateNode;
    t.pendingContext ? Bs(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Bs(e, t.context, !1), vi(e, t.containerInfo);
  }
  function Vu(e, t, r, n, l) {
    return Gr(), di(l), t.flags |= 256, qe(e, t, r, n), t.child;
  }
  var Di = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Oi(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Bu(e, t, r) {
    var n = t.pendingProps, l = je.current, o = !1, s = (t.flags & 128) !== 0, d;
    if ((d = s) || (d = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), d ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), he(je, l & 1), e === null)
      return ci(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (s = n.children, e = n.fallback, o ? (n = t.mode, o = t.child, s = { mode: "hidden", children: s }, (n & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = s) : o = ro(s, n, 0, null), e = Er(e, n, r, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = Oi(r), t.memoizedState = Di, e) : Ai(t, s));
    if (l = e.memoizedState, l !== null && (d = l.dehydrated, d !== null)) return $p(e, t, s, n, d, l, r);
    if (o) {
      o = n.fallback, s = t.mode, l = e.child, d = l.sibling;
      var f = { mode: "hidden", children: n.children };
      return (s & 1) === 0 && t.child !== l ? (n = t.child, n.childLanes = 0, n.pendingProps = f, t.deletions = null) : (n = ur(l, f), n.subtreeFlags = l.subtreeFlags & 14680064), d !== null ? o = ur(d, o) : (o = Er(o, s, r, null), o.flags |= 2), o.return = t, n.return = t, n.sibling = o, t.child = n, n = o, o = t.child, s = e.child.memoizedState, s = s === null ? Oi(r) : { baseLanes: s.baseLanes | r, cachePool: null, transitions: s.transitions }, o.memoizedState = s, o.childLanes = e.childLanes & ~r, t.memoizedState = Di, n;
    }
    return o = e.child, e = o.sibling, n = ur(o, { mode: "visible", children: n.children }), (t.mode & 1) === 0 && (n.lanes = r), n.return = t, n.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = n, t.memoizedState = null, n;
  }
  function Ai(e, t) {
    return t = ro({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Vl(e, t, r, n) {
    return n !== null && di(n), Kr(t, e.child, null, r), e = Ai(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function $p(e, t, r, n, l, o, s) {
    if (r)
      return t.flags & 256 ? (t.flags &= -257, n = Li(Error(u(422))), Vl(e, t, s, n)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = n.fallback, l = t.mode, n = ro({ mode: "visible", children: n.children }, l, 0, null), o = Er(o, l, s, null), o.flags |= 2, n.return = t, o.return = t, n.sibling = o, t.child = n, (t.mode & 1) !== 0 && Kr(t, e.child, null, s), t.child.memoizedState = Oi(s), t.memoizedState = Di, o);
    if ((t.mode & 1) === 0) return Vl(e, t, s, null);
    if (l.data === "$!") {
      if (n = l.nextSibling && l.nextSibling.dataset, n) var d = n.dgst;
      return n = d, o = Error(u(419)), n = Li(o, n, void 0), Vl(e, t, s, n);
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
      return ea(), n = Li(Error(u(421))), Vl(e, t, s, n);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Jp.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, lt = Zt(l.nextSibling), nt = t, be = !0, gt = null, e !== null && (it[at++] = Lt, it[at++] = Tt, it[at++] = vr, Lt = e.id, Tt = e.overflow, vr = t), t = Ai(t, n.children), t.flags |= 4096, t);
  }
  function Wu(e, t, r) {
    e.lanes |= t;
    var n = e.alternate;
    n !== null && (n.lanes |= t), hi(e.return, t, r);
  }
  function Fi(e, t, r, n, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: n, tail: r, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = n, o.tail = r, o.tailMode = l);
  }
  function qu(e, t, r) {
    var n = t.pendingProps, l = n.revealOrder, o = n.tail;
    if (qe(e, t, n.children, r), n = je.current, (n & 2) !== 0) n = n & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Wu(e, r, t);
        else if (e.tag === 19) Wu(e, r, t);
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
        for (r = t.child, l = null; r !== null; ) e = r.alternate, e !== null && Dl(e) === null && (l = r), r = r.sibling;
        r = l, r === null ? (l = t.child, t.child = null) : (l = r.sibling, r.sibling = null), Fi(t, !1, l, r, o);
        break;
      case "backwards":
        for (r = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && Dl(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = r, r = l, l = e;
        }
        Fi(t, !0, r, null, o);
        break;
      case "together":
        Fi(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Bl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Dt(e, t, r) {
    if (e !== null && (t.dependencies = e.dependencies), jr |= t.lanes, (r & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, r = ur(e, e.pendingProps), t.child = r, r.return = t; e.sibling !== null; ) e = e.sibling, r = r.sibling = ur(e, e.pendingProps), r.return = t;
      r.sibling = null;
    }
    return t.child;
  }
  function Hp(e, t, r) {
    switch (t.tag) {
      case 3:
        Uu(t), Gr();
        break;
      case 5:
        iu(t);
        break;
      case 1:
        Ke(t.type) && Nl(t);
        break;
      case 4:
        vi(t, t.stateNode.containerInfo);
        break;
      case 10:
        var n = t.type._context, l = t.memoizedProps.value;
        he(Ll, n._currentValue), n._currentValue = l;
        break;
      case 13:
        if (n = t.memoizedState, n !== null)
          return n.dehydrated !== null ? (he(je, je.current & 1), t.flags |= 128, null) : (r & t.child.childLanes) !== 0 ? Bu(e, t, r) : (he(je, je.current & 1), e = Dt(e, t, r), e !== null ? e.sibling : null);
        he(je, je.current & 1);
        break;
      case 19:
        if (n = (r & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (n) return qu(e, t, r);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), he(je, je.current), n) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, Fu(e, t, r);
    }
    return Dt(e, t, r);
  }
  var Qu, $i, Gu, Ku;
  Qu = function(e, t) {
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
  }, $i = function() {
  }, Gu = function(e, t, r, n) {
    var l = e.memoizedProps;
    if (l !== n) {
      e = t.stateNode, kr(Ct.current);
      var o = null;
      switch (r) {
        case "input":
          l = ho(e, l), n = ho(e, n), o = [];
          break;
        case "select":
          l = O({}, l, { value: void 0 }), n = O({}, n, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = vo(e, l), n = vo(e, n), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof n.onClick == "function" && (e.onclick = jl);
      }
      wo(r, n);
      var s;
      r = null;
      for (k in l) if (!n.hasOwnProperty(k) && l.hasOwnProperty(k) && l[k] != null) if (k === "style") {
        var d = l[k];
        for (s in d) d.hasOwnProperty(s) && (r || (r = {}), r[s] = "");
      } else k !== "dangerouslySetInnerHTML" && k !== "children" && k !== "suppressContentEditableWarning" && k !== "suppressHydrationWarning" && k !== "autoFocus" && (v.hasOwnProperty(k) ? o || (o = []) : (o = o || []).push(k, null));
      for (k in n) {
        var f = n[k];
        if (d = l != null ? l[k] : void 0, n.hasOwnProperty(k) && f !== d && (f != null || d != null)) if (k === "style") if (d) {
          for (s in d) !d.hasOwnProperty(s) || f && f.hasOwnProperty(s) || (r || (r = {}), r[s] = "");
          for (s in f) f.hasOwnProperty(s) && d[s] !== f[s] && (r || (r = {}), r[s] = f[s]);
        } else r || (o || (o = []), o.push(
          k,
          r
        )), r = f;
        else k === "dangerouslySetInnerHTML" ? (f = f ? f.__html : void 0, d = d ? d.__html : void 0, f != null && d !== f && (o = o || []).push(k, f)) : k === "children" ? typeof f != "string" && typeof f != "number" || (o = o || []).push(k, "" + f) : k !== "suppressContentEditableWarning" && k !== "suppressHydrationWarning" && (v.hasOwnProperty(k) ? (f != null && k === "onScroll" && xe("scroll", e), o || d === f || (o = [])) : (o = o || []).push(k, f));
      }
      r && (o = o || []).push("style", r);
      var k = o;
      (t.updateQueue = k) && (t.flags |= 4);
    }
  }, Ku = function(e, t, r, n) {
    r !== n && (t.flags |= 4);
  };
  function Hn(e, t) {
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
  function Up(e, t, r) {
    var n = t.pendingProps;
    switch (si(t), t.tag) {
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
        return Ke(t.type) && Cl(), Be(t), null;
      case 3:
        return n = t.stateNode, Zr(), ve(Ge), ve(Ue), ki(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Ml(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, gt !== null && (Xi(gt), gt = null))), $i(e, t), Be(t), null;
      case 5:
        yi(t);
        var l = kr(Dn.current);
        if (r = t.type, e !== null && t.stateNode != null) Gu(e, t, r, n, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!n) {
            if (t.stateNode === null) throw Error(u(166));
            return Be(t), null;
          }
          if (e = kr(Ct.current), Ml(t)) {
            n = t.stateNode, r = t.type;
            var o = t.memoizedProps;
            switch (n[St] = t, n[Pn] = o, e = (t.mode & 1) !== 0, r) {
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
                for (l = 0; l < zn.length; l++) xe(zn[l], n);
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
                _a(n, o), xe("invalid", n);
                break;
              case "select":
                n._wrapperState = { wasMultiple: !!o.multiple }, xe("invalid", n);
                break;
              case "textarea":
                La(n, o), xe("invalid", n);
            }
            wo(r, o), l = null;
            for (var s in o) if (o.hasOwnProperty(s)) {
              var d = o[s];
              s === "children" ? typeof d == "string" ? n.textContent !== d && (o.suppressHydrationWarning !== !0 && bl(n.textContent, d, e), l = ["children", d]) : typeof d == "number" && n.textContent !== "" + d && (o.suppressHydrationWarning !== !0 && bl(
                n.textContent,
                d,
                e
              ), l = ["children", "" + d]) : v.hasOwnProperty(s) && d != null && s === "onScroll" && xe("scroll", n);
            }
            switch (r) {
              case "input":
                Jn(n), Pa(n, o, !0);
                break;
              case "textarea":
                Jn(n), Ra(n);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (n.onclick = jl);
            }
            n = l, t.updateQueue = n, n !== null && (t.flags |= 4);
          } else {
            s = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Ia(r)), e === "http://www.w3.org/1999/xhtml" ? r === "script" ? (e = s.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof n.is == "string" ? e = s.createElement(r, { is: n.is }) : (e = s.createElement(r), r === "select" && (s = e, n.multiple ? s.multiple = !0 : n.size && (s.size = n.size))) : e = s.createElementNS(e, r), e[St] = t, e[Pn] = n, Qu(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (s = ko(r, n), r) {
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
                  for (l = 0; l < zn.length; l++) xe(zn[l], e);
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
                  _a(e, n), l = ho(e, n), xe("invalid", e);
                  break;
                case "option":
                  l = n;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!n.multiple }, l = O({}, n, { value: void 0 }), xe("invalid", e);
                  break;
                case "textarea":
                  La(e, n), l = vo(e, n), xe("invalid", e);
                  break;
                default:
                  l = n;
              }
              wo(r, l), d = l;
              for (o in d) if (d.hasOwnProperty(o)) {
                var f = d[o];
                o === "style" ? Aa(e, f) : o === "dangerouslySetInnerHTML" ? (f = f ? f.__html : void 0, f != null && Da(e, f)) : o === "children" ? typeof f == "string" ? (r !== "textarea" || f !== "") && un(e, f) : typeof f == "number" && un(e, "" + f) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (v.hasOwnProperty(o) ? f != null && o === "onScroll" && xe("scroll", e) : f != null && F(e, o, f, s));
              }
              switch (r) {
                case "input":
                  Jn(e), Pa(e, n, !1);
                  break;
                case "textarea":
                  Jn(e), Ra(e);
                  break;
                case "option":
                  n.value != null && e.setAttribute("value", "" + pe(n.value));
                  break;
                case "select":
                  e.multiple = !!n.multiple, o = n.value, o != null ? Tr(e, !!n.multiple, o, !1) : n.defaultValue != null && Tr(
                    e,
                    !!n.multiple,
                    n.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = jl);
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
        if (e && t.stateNode != null) Ku(e, t, e.memoizedProps, n);
        else {
          if (typeof n != "string" && t.stateNode === null) throw Error(u(166));
          if (r = kr(Dn.current), kr(Ct.current), Ml(t)) {
            if (n = t.stateNode, r = t.memoizedProps, n[St] = t, (o = n.nodeValue !== r) && (e = nt, e !== null)) switch (e.tag) {
              case 3:
                bl(n.nodeValue, r, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && bl(n.nodeValue, r, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else n = (r.nodeType === 9 ? r : r.ownerDocument).createTextNode(n), n[St] = t, t.stateNode = n;
        }
        return Be(t), null;
      case 13:
        if (ve(je), n = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (be && lt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Zs(), Gr(), t.flags |= 98560, o = !1;
          else if (o = Ml(t), n !== null && n.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(u(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(u(317));
              o[St] = t;
            } else Gr(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Be(t), o = !1;
          } else gt !== null && (Xi(gt), gt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = r, t) : (n = n !== null, n !== (e !== null && e.memoizedState !== null) && n && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (je.current & 1) !== 0 ? Le === 0 && (Le = 3) : ea())), t.updateQueue !== null && (t.flags |= 4), Be(t), null);
      case 4:
        return Zr(), $i(e, t), e === null && _n(t.stateNode.containerInfo), Be(t), null;
      case 10:
        return mi(t.type._context), Be(t), null;
      case 17:
        return Ke(t.type) && Cl(), Be(t), null;
      case 19:
        if (ve(je), o = t.memoizedState, o === null) return Be(t), null;
        if (n = (t.flags & 128) !== 0, s = o.rendering, s === null) if (n) Hn(o, !1);
        else {
          if (Le !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (s = Dl(e), s !== null) {
              for (t.flags |= 128, Hn(o, !1), n = s.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), t.subtreeFlags = 0, n = r, r = t.child; r !== null; ) o = r, e = n, o.flags &= 14680066, s = o.alternate, s === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = s.childLanes, o.lanes = s.lanes, o.child = s.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = s.memoizedProps, o.memoizedState = s.memoizedState, o.updateQueue = s.updateQueue, o.type = s.type, e = s.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), r = r.sibling;
              return he(je, je.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && Ne() > rn && (t.flags |= 128, n = !0, Hn(o, !1), t.lanes = 4194304);
        }
        else {
          if (!n) if (e = Dl(s), e !== null) {
            if (t.flags |= 128, n = !0, r = e.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), Hn(o, !0), o.tail === null && o.tailMode === "hidden" && !s.alternate && !be) return Be(t), null;
          } else 2 * Ne() - o.renderingStartTime > rn && r !== 1073741824 && (t.flags |= 128, n = !0, Hn(o, !1), t.lanes = 4194304);
          o.isBackwards ? (s.sibling = t.child, t.child = s) : (r = o.last, r !== null ? r.sibling = s : t.child = s, o.last = s);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Ne(), t.sibling = null, r = je.current, he(je, n ? r & 1 | 2 : r & 1), t) : (Be(t), null);
      case 22:
      case 23:
        return Ji(), n = t.memoizedState !== null, e !== null && e.memoizedState !== null !== n && (t.flags |= 8192), n && (t.mode & 1) !== 0 ? (ot & 1073741824) !== 0 && (Be(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Be(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function Vp(e, t) {
    switch (si(t), t.tag) {
      case 1:
        return Ke(t.type) && Cl(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Zr(), ve(Ge), ve(Ue), ki(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return yi(t), null;
      case 13:
        if (ve(je), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(u(340));
          Gr();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return ve(je), null;
      case 4:
        return Zr(), null;
      case 10:
        return mi(t.type._context), null;
      case 22:
      case 23:
        return Ji(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Wl = !1, We = !1, Bp = typeof WeakSet == "function" ? WeakSet : Set, A = null;
  function en(e, t) {
    var r = e.ref;
    if (r !== null) if (typeof r == "function") try {
      r(null);
    } catch (n) {
      Ce(e, t, n);
    }
    else r.current = null;
  }
  function Hi(e, t, r) {
    try {
      r();
    } catch (n) {
      Ce(e, t, n);
    }
  }
  var Yu = !1;
  function Wp(e, t) {
    if (Jo = dl, e = zs(), Wo(e)) {
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
          var s = 0, d = -1, f = -1, k = 0, _ = 0, M = e, E = null;
          t: for (; ; ) {
            for (var D; M !== r || l !== 0 && M.nodeType !== 3 || (d = s + l), M !== o || n !== 0 && M.nodeType !== 3 || (f = s + n), M.nodeType === 3 && (s += M.nodeValue.length), (D = M.firstChild) !== null; )
              E = M, M = D;
            for (; ; ) {
              if (M === e) break t;
              if (E === r && ++k === l && (d = s), E === o && ++_ === n && (f = s), (D = M.nextSibling) !== null) break;
              M = E, E = M.parentNode;
            }
            M = D;
          }
          r = d === -1 || f === -1 ? null : { start: d, end: f };
        } else r = null;
      }
      r = r || { start: 0, end: 0 };
    } else r = null;
    for (ei = { focusedElem: e, selectionRange: r }, dl = !1, A = t; A !== null; ) if (t = A, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, A = e;
    else for (; A !== null; ) {
      t = A;
      try {
        var $ = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if ($ !== null) {
              var H = $.memoizedProps, Ee = $.memoizedState, y = t.stateNode, m = y.getSnapshotBeforeUpdate(t.elementType === t.type ? H : xt(t.type, H), Ee);
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
      } catch (P) {
        Ce(t, t.return, P);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, A = e;
        break;
      }
      A = t.return;
    }
    return $ = Yu, Yu = !1, $;
  }
  function Un(e, t, r) {
    var n = t.updateQueue;
    if (n = n !== null ? n.lastEffect : null, n !== null) {
      var l = n = n.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && Hi(t, r, o);
        }
        l = l.next;
      } while (l !== n);
    }
  }
  function ql(e, t) {
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
  function Ui(e) {
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
  function Xu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Xu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[St], delete t[Pn], delete t[li], delete t[Ep], delete t[zp])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Zu(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Ju(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Zu(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Vi(e, t, r) {
    var n = e.tag;
    if (n === 5 || n === 6) e = e.stateNode, t ? r.nodeType === 8 ? r.parentNode.insertBefore(e, t) : r.insertBefore(e, t) : (r.nodeType === 8 ? (t = r.parentNode, t.insertBefore(e, r)) : (t = r, t.appendChild(e)), r = r._reactRootContainer, r != null || t.onclick !== null || (t.onclick = jl));
    else if (n !== 4 && (e = e.child, e !== null)) for (Vi(e, t, r), e = e.sibling; e !== null; ) Vi(e, t, r), e = e.sibling;
  }
  function Bi(e, t, r) {
    var n = e.tag;
    if (n === 5 || n === 6) e = e.stateNode, t ? r.insertBefore(e, t) : r.appendChild(e);
    else if (n !== 4 && (e = e.child, e !== null)) for (Bi(e, t, r), e = e.sibling; e !== null; ) Bi(e, t, r), e = e.sibling;
  }
  var Oe = null, vt = !1;
  function lr(e, t, r) {
    for (r = r.child; r !== null; ) ec(e, t, r), r = r.sibling;
  }
  function ec(e, t, r) {
    if (jt && typeof jt.onCommitFiberUnmount == "function") try {
      jt.onCommitFiberUnmount(ol, r);
    } catch {
    }
    switch (r.tag) {
      case 5:
        We || en(r, t);
      case 6:
        var n = Oe, l = vt;
        Oe = null, lr(e, t, r), Oe = n, vt = l, Oe !== null && (vt ? (e = Oe, r = r.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(r) : e.removeChild(r)) : Oe.removeChild(r.stateNode));
        break;
      case 18:
        Oe !== null && (vt ? (e = Oe, r = r.stateNode, e.nodeType === 8 ? ni(e.parentNode, r) : e.nodeType === 1 && ni(e, r), wn(e)) : ni(Oe, r.stateNode));
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
            o = o.tag, s !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && Hi(r, t, s), l = l.next;
          } while (l !== n);
        }
        lr(e, t, r);
        break;
      case 1:
        if (!We && (en(r, t), n = r.stateNode, typeof n.componentWillUnmount == "function")) try {
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
  function tc(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var r = e.stateNode;
      r === null && (r = e.stateNode = new Bp()), t.forEach(function(n) {
        var l = ef.bind(null, e, n);
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
        ec(o, s, l), Oe = null, vt = !1;
        var f = l.alternate;
        f !== null && (f.return = null), l.return = null;
      } catch (k) {
        Ce(l, t, k);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) rc(t, e), t = t.sibling;
  }
  function rc(e, t) {
    var r = e.alternate, n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (yt(t, e), Et(e), n & 4) {
          try {
            Un(3, e, e.return), ql(3, e);
          } catch (H) {
            Ce(e, e.return, H);
          }
          try {
            Un(5, e, e.return);
          } catch (H) {
            Ce(e, e.return, H);
          }
        }
        break;
      case 1:
        yt(t, e), Et(e), n & 512 && r !== null && en(r, r.return);
        break;
      case 5:
        if (yt(t, e), Et(e), n & 512 && r !== null && en(r, r.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            un(l, "");
          } catch (H) {
            Ce(e, e.return, H);
          }
        }
        if (n & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, s = r !== null ? r.memoizedProps : o, d = e.type, f = e.updateQueue;
          if (e.updateQueue = null, f !== null) try {
            d === "input" && o.type === "radio" && o.name != null && Ma(l, o), ko(d, s);
            var k = ko(d, o);
            for (s = 0; s < f.length; s += 2) {
              var _ = f[s], M = f[s + 1];
              _ === "style" ? Aa(l, M) : _ === "dangerouslySetInnerHTML" ? Da(l, M) : _ === "children" ? un(l, M) : F(l, _, M, k);
            }
            switch (d) {
              case "input":
                go(l, o);
                break;
              case "textarea":
                Ta(l, o);
                break;
              case "select":
                var E = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var D = o.value;
                D != null ? Tr(l, !!o.multiple, D, !1) : E !== !!o.multiple && (o.defaultValue != null ? Tr(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : Tr(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[Pn] = o;
          } catch (H) {
            Ce(e, e.return, H);
          }
        }
        break;
      case 6:
        if (yt(t, e), Et(e), n & 4) {
          if (e.stateNode === null) throw Error(u(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (H) {
            Ce(e, e.return, H);
          }
        }
        break;
      case 3:
        if (yt(t, e), Et(e), n & 4 && r !== null && r.memoizedState.isDehydrated) try {
          wn(t.containerInfo);
        } catch (H) {
          Ce(e, e.return, H);
        }
        break;
      case 4:
        yt(t, e), Et(e);
        break;
      case 13:
        yt(t, e), Et(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (Qi = Ne())), n & 4 && tc(e);
        break;
      case 22:
        if (_ = r !== null && r.memoizedState !== null, e.mode & 1 ? (We = (k = We) || _, yt(t, e), We = k) : yt(t, e), Et(e), n & 8192) {
          if (k = e.memoizedState !== null, (e.stateNode.isHidden = k) && !_ && (e.mode & 1) !== 0) for (A = e, _ = e.child; _ !== null; ) {
            for (M = A = _; A !== null; ) {
              switch (E = A, D = E.child, E.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Un(4, E, E.return);
                  break;
                case 1:
                  en(E, E.return);
                  var $ = E.stateNode;
                  if (typeof $.componentWillUnmount == "function") {
                    n = E, r = E.return;
                    try {
                      t = n, $.props = t.memoizedProps, $.state = t.memoizedState, $.componentWillUnmount();
                    } catch (H) {
                      Ce(n, r, H);
                    }
                  }
                  break;
                case 5:
                  en(E, E.return);
                  break;
                case 22:
                  if (E.memoizedState !== null) {
                    oc(M);
                    continue;
                  }
              }
              D !== null ? (D.return = E, A = D) : oc(M);
            }
            _ = _.sibling;
          }
          e: for (_ = null, M = e; ; ) {
            if (M.tag === 5) {
              if (_ === null) {
                _ = M;
                try {
                  l = M.stateNode, k ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (d = M.stateNode, f = M.memoizedProps.style, s = f != null && f.hasOwnProperty("display") ? f.display : null, d.style.display = Oa("display", s));
                } catch (H) {
                  Ce(e, e.return, H);
                }
              }
            } else if (M.tag === 6) {
              if (_ === null) try {
                M.stateNode.nodeValue = k ? "" : M.memoizedProps;
              } catch (H) {
                Ce(e, e.return, H);
              }
            } else if ((M.tag !== 22 && M.tag !== 23 || M.memoizedState === null || M === e) && M.child !== null) {
              M.child.return = M, M = M.child;
              continue;
            }
            if (M === e) break e;
            for (; M.sibling === null; ) {
              if (M.return === null || M.return === e) break e;
              _ === M && (_ = null), M = M.return;
            }
            _ === M && (_ = null), M.sibling.return = M.return, M = M.sibling;
          }
        }
        break;
      case 19:
        yt(t, e), Et(e), n & 4 && tc(e);
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
            if (Zu(r)) {
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
            n.flags & 32 && (un(l, ""), n.flags &= -33);
            var o = Ju(e);
            Bi(e, o, l);
            break;
          case 3:
          case 4:
            var s = n.stateNode.containerInfo, d = Ju(e);
            Vi(e, d, s);
            break;
          default:
            throw Error(u(161));
        }
      } catch (f) {
        Ce(e, e.return, f);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function qp(e, t, r) {
    A = e, nc(e);
  }
  function nc(e, t, r) {
    for (var n = (e.mode & 1) !== 0; A !== null; ) {
      var l = A, o = l.child;
      if (l.tag === 22 && n) {
        var s = l.memoizedState !== null || Wl;
        if (!s) {
          var d = l.alternate, f = d !== null && d.memoizedState !== null || We;
          d = Wl;
          var k = We;
          if (Wl = s, (We = f) && !k) for (A = l; A !== null; ) s = A, f = s.child, s.tag === 22 && s.memoizedState !== null ? ic(l) : f !== null ? (f.return = s, A = f) : ic(l);
          for (; o !== null; ) A = o, nc(o), o = o.sibling;
          A = l, Wl = d, We = k;
        }
        lc(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, A = o) : lc(e);
    }
  }
  function lc(e) {
    for (; A !== null; ) {
      var t = A;
      if ((t.flags & 8772) !== 0) {
        var r = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              We || ql(5, t);
              break;
            case 1:
              var n = t.stateNode;
              if (t.flags & 4 && !We) if (r === null) n.componentDidMount();
              else {
                var l = t.elementType === t.type ? r.memoizedProps : xt(t.type, r.memoizedProps);
                n.componentDidUpdate(l, r.memoizedState, n.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && ou(t, o, n);
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
                ou(t, s, r);
              }
              break;
            case 5:
              var d = t.stateNode;
              if (r === null && t.flags & 4) {
                r = d;
                var f = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    f.autoFocus && r.focus();
                    break;
                  case "img":
                    f.src && (r.src = f.src);
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
                    var M = _.dehydrated;
                    M !== null && wn(M);
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
          We || t.flags & 512 && Ui(t);
        } catch (E) {
          Ce(t, t.return, E);
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
  function oc(e) {
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
  function ic(e) {
    for (; A !== null; ) {
      var t = A;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var r = t.return;
            try {
              ql(4, t);
            } catch (f) {
              Ce(t, r, f);
            }
            break;
          case 1:
            var n = t.stateNode;
            if (typeof n.componentDidMount == "function") {
              var l = t.return;
              try {
                n.componentDidMount();
              } catch (f) {
                Ce(t, l, f);
              }
            }
            var o = t.return;
            try {
              Ui(t);
            } catch (f) {
              Ce(t, o, f);
            }
            break;
          case 5:
            var s = t.return;
            try {
              Ui(t);
            } catch (f) {
              Ce(t, s, f);
            }
        }
      } catch (f) {
        Ce(t, t.return, f);
      }
      if (t === e) {
        A = null;
        break;
      }
      var d = t.sibling;
      if (d !== null) {
        d.return = t.return, A = d;
        break;
      }
      A = t.return;
    }
  }
  var Qp = Math.ceil, Ql = q.ReactCurrentDispatcher, Wi = q.ReactCurrentOwner, ct = q.ReactCurrentBatchConfig, ae = 0, Re = null, ze = null, Ae = 0, ot = 0, tn = Jt(0), Le = 0, Vn = null, jr = 0, Gl = 0, qi = 0, Bn = null, Xe = null, Qi = 0, rn = 1 / 0, Ot = null, Kl = !1, Gi = null, or = null, Yl = !1, ir = null, Xl = 0, Wn = 0, Ki = null, Zl = -1, Jl = 0;
  function Qe() {
    return (ae & 6) !== 0 ? Ne() : Zl !== -1 ? Zl : Zl = Ne();
  }
  function ar(e) {
    return (e.mode & 1) === 0 ? 1 : (ae & 2) !== 0 && Ae !== 0 ? Ae & -Ae : Mp.transition !== null ? (Jl === 0 && (Jl = Ja()), Jl) : (e = fe, e !== 0 || (e = window.event, e = e === void 0 ? 16 : ss(e.type)), e);
  }
  function wt(e, t, r, n) {
    if (50 < Wn) throw Wn = 0, Ki = null, Error(u(185));
    hn(e, r, n), ((ae & 2) === 0 || e !== Re) && (e === Re && ((ae & 2) === 0 && (Gl |= r), Le === 4 && sr(e, Ae)), Ze(e, n), r === 1 && ae === 0 && (t.mode & 1) === 0 && (rn = Ne() + 500, El && tr()));
  }
  function Ze(e, t) {
    var r = e.callbackNode;
    Md(e, t);
    var n = sl(e, e === Re ? Ae : 0);
    if (n === 0) r !== null && Ya(r), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = n & -n, e.callbackPriority !== t) {
      if (r != null && Ya(r), t === 1) e.tag === 0 ? _p(sc.bind(null, e)) : Qs(sc.bind(null, e)), Cp(function() {
        (ae & 6) === 0 && tr();
      }), r = null;
      else {
        switch (es(n)) {
          case 1:
            r = zo;
            break;
          case 4:
            r = Xa;
            break;
          case 16:
            r = ll;
            break;
          case 536870912:
            r = Za;
            break;
          default:
            r = ll;
        }
        r = gc(r, ac.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = r;
    }
  }
  function ac(e, t) {
    if (Zl = -1, Jl = 0, (ae & 6) !== 0) throw Error(u(327));
    var r = e.callbackNode;
    if (nn() && e.callbackNode !== r) return null;
    var n = sl(e, e === Re ? Ae : 0);
    if (n === 0) return null;
    if ((n & 30) !== 0 || (n & e.expiredLanes) !== 0 || t) t = eo(e, n);
    else {
      t = n;
      var l = ae;
      ae |= 2;
      var o = cc();
      (Re !== e || Ae !== t) && (Ot = null, rn = Ne() + 500, Cr(e, t));
      do
        try {
          Yp();
          break;
        } catch (d) {
          uc(e, d);
        }
      while (!0);
      fi(), Ql.current = o, ae = l, ze !== null ? t = 0 : (Re = null, Ae = 0, t = Le);
    }
    if (t !== 0) {
      if (t === 2 && (l = _o(e), l !== 0 && (n = l, t = Yi(e, l))), t === 1) throw r = Vn, Cr(e, 0), sr(e, n), Ze(e, Ne()), r;
      if (t === 6) sr(e, n);
      else {
        if (l = e.current.alternate, (n & 30) === 0 && !Gp(l) && (t = eo(e, n), t === 2 && (o = _o(e), o !== 0 && (n = o, t = Yi(e, o))), t === 1)) throw r = Vn, Cr(e, 0), sr(e, n), Ze(e, Ne()), r;
        switch (e.finishedWork = l, e.finishedLanes = n, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            Nr(e, Xe, Ot);
            break;
          case 3:
            if (sr(e, n), (n & 130023424) === n && (t = Qi + 500 - Ne(), 10 < t)) {
              if (sl(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & n) !== n) {
                Qe(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = ri(Nr.bind(null, e, Xe, Ot), t);
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
            if (n = l, n = Ne() - n, n = (120 > n ? 120 : 480 > n ? 480 : 1080 > n ? 1080 : 1920 > n ? 1920 : 3e3 > n ? 3e3 : 4320 > n ? 4320 : 1960 * Qp(n / 1960)) - n, 10 < n) {
              e.timeoutHandle = ri(Nr.bind(null, e, Xe, Ot), n);
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
    return Ze(e, Ne()), e.callbackNode === r ? ac.bind(null, e) : null;
  }
  function Yi(e, t) {
    var r = Bn;
    return e.current.memoizedState.isDehydrated && (Cr(e, t).flags |= 256), e = eo(e, t), e !== 2 && (t = Xe, Xe = r, t !== null && Xi(t)), e;
  }
  function Xi(e) {
    Xe === null ? Xe = e : Xe.push.apply(Xe, e);
  }
  function Gp(e) {
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
    for (t &= ~qi, t &= ~Gl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var r = 31 - mt(t), n = 1 << r;
      e[r] = -1, t &= ~n;
    }
  }
  function sc(e) {
    if ((ae & 6) !== 0) throw Error(u(327));
    nn();
    var t = sl(e, 0);
    if ((t & 1) === 0) return Ze(e, Ne()), null;
    var r = eo(e, t);
    if (e.tag !== 0 && r === 2) {
      var n = _o(e);
      n !== 0 && (t = n, r = Yi(e, n));
    }
    if (r === 1) throw r = Vn, Cr(e, 0), sr(e, t), Ze(e, Ne()), r;
    if (r === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, Nr(e, Xe, Ot), Ze(e, Ne()), null;
  }
  function Zi(e, t) {
    var r = ae;
    ae |= 1;
    try {
      return e(t);
    } finally {
      ae = r, ae === 0 && (rn = Ne() + 500, El && tr());
    }
  }
  function Sr(e) {
    ir !== null && ir.tag === 0 && (ae & 6) === 0 && nn();
    var t = ae;
    ae |= 1;
    var r = ct.transition, n = fe;
    try {
      if (ct.transition = null, fe = 1, e) return e();
    } finally {
      fe = n, ct.transition = r, ae = t, (ae & 6) === 0 && tr();
    }
  }
  function Ji() {
    ot = tn.current, ve(tn);
  }
  function Cr(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var r = e.timeoutHandle;
    if (r !== -1 && (e.timeoutHandle = -1, Sp(r)), ze !== null) for (r = ze.return; r !== null; ) {
      var n = r;
      switch (si(n), n.tag) {
        case 1:
          n = n.type.childContextTypes, n != null && Cl();
          break;
        case 3:
          Zr(), ve(Ge), ve(Ue), ki();
          break;
        case 5:
          yi(n);
          break;
        case 4:
          Zr();
          break;
        case 13:
          ve(je);
          break;
        case 19:
          ve(je);
          break;
        case 10:
          mi(n.type._context);
          break;
        case 22:
        case 23:
          Ji();
      }
      r = r.return;
    }
    if (Re = e, ze = e = ur(e.current, null), Ae = ot = t, Le = 0, Vn = null, qi = Gl = jr = 0, Xe = Bn = null, wr !== null) {
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
  function uc(e, t) {
    do {
      var r = ze;
      try {
        if (fi(), Ol.current = Hl, Al) {
          for (var n = Se.memoizedState; n !== null; ) {
            var l = n.queue;
            l !== null && (l.pending = null), n = n.next;
          }
          Al = !1;
        }
        if (br = 0, Te = Pe = Se = null, On = !1, An = 0, Wi.current = null, r === null || r.return === null) {
          Le = 1, Vn = t, ze = null;
          break;
        }
        e: {
          var o = e, s = r.return, d = r, f = t;
          if (t = Ae, d.flags |= 32768, f !== null && typeof f == "object" && typeof f.then == "function") {
            var k = f, _ = d, M = _.tag;
            if ((_.mode & 1) === 0 && (M === 0 || M === 11 || M === 15)) {
              var E = _.alternate;
              E ? (_.updateQueue = E.updateQueue, _.memoizedState = E.memoizedState, _.lanes = E.lanes) : (_.updateQueue = null, _.memoizedState = null);
            }
            var D = Ru(s);
            if (D !== null) {
              D.flags &= -257, Iu(D, s, d, o, t), D.mode & 1 && Tu(o, k, t), t = D, f = k;
              var $ = t.updateQueue;
              if ($ === null) {
                var H = /* @__PURE__ */ new Set();
                H.add(f), t.updateQueue = H;
              } else $.add(f);
              break e;
            } else {
              if ((t & 1) === 0) {
                Tu(o, k, t), ea();
                break e;
              }
              f = Error(u(426));
            }
          } else if (be && d.mode & 1) {
            var Ee = Ru(s);
            if (Ee !== null) {
              (Ee.flags & 65536) === 0 && (Ee.flags |= 256), Iu(Ee, s, d, o, t), di(Jr(f, d));
              break e;
            }
          }
          o = f = Jr(f, d), Le !== 4 && (Le = 2), Bn === null ? Bn = [o] : Bn.push(o), o = s;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var y = Pu(o, f, t);
                lu(o, y);
                break e;
              case 1:
                d = f;
                var m = o.type, w = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof m.getDerivedStateFromError == "function" || w !== null && typeof w.componentDidCatch == "function" && (or === null || !or.has(w)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var P = Lu(o, d, t);
                  lu(o, P);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        pc(r);
      } catch (U) {
        t = U, ze === r && r !== null && (ze = r = r.return);
        continue;
      }
      break;
    } while (!0);
  }
  function cc() {
    var e = Ql.current;
    return Ql.current = Hl, e === null ? Hl : e;
  }
  function ea() {
    (Le === 0 || Le === 3 || Le === 2) && (Le = 4), Re === null || (jr & 268435455) === 0 && (Gl & 268435455) === 0 || sr(Re, Ae);
  }
  function eo(e, t) {
    var r = ae;
    ae |= 2;
    var n = cc();
    (Re !== e || Ae !== t) && (Ot = null, Cr(e, t));
    do
      try {
        Kp();
        break;
      } catch (l) {
        uc(e, l);
      }
    while (!0);
    if (fi(), ae = r, Ql.current = n, ze !== null) throw Error(u(261));
    return Re = null, Ae = 0, Le;
  }
  function Kp() {
    for (; ze !== null; ) dc(ze);
  }
  function Yp() {
    for (; ze !== null && !kd(); ) dc(ze);
  }
  function dc(e) {
    var t = hc(e.alternate, e, ot);
    e.memoizedProps = e.pendingProps, t === null ? pc(e) : ze = t, Wi.current = null;
  }
  function pc(e) {
    var t = e;
    do {
      var r = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (r = Up(r, t, ot), r !== null) {
          ze = r;
          return;
        }
      } else {
        if (r = Vp(r, t), r !== null) {
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
    var n = fe, l = ct.transition;
    try {
      ct.transition = null, fe = 1, Xp(e, t, r, n);
    } finally {
      ct.transition = l, fe = n;
    }
    return null;
  }
  function Xp(e, t, r, n) {
    do
      nn();
    while (ir !== null);
    if ((ae & 6) !== 0) throw Error(u(327));
    r = e.finishedWork;
    var l = e.finishedLanes;
    if (r === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, r === e.current) throw Error(u(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = r.lanes | r.childLanes;
    if (Pd(e, o), e === Re && (ze = Re = null, Ae = 0), (r.subtreeFlags & 2064) === 0 && (r.flags & 2064) === 0 || Yl || (Yl = !0, gc(ll, function() {
      return nn(), null;
    })), o = (r.flags & 15990) !== 0, (r.subtreeFlags & 15990) !== 0 || o) {
      o = ct.transition, ct.transition = null;
      var s = fe;
      fe = 1;
      var d = ae;
      ae |= 4, Wi.current = null, Wp(e, r), rc(r, e), xp(ei), dl = !!Jo, ei = Jo = null, e.current = r, qp(r), bd(), ae = d, fe = s, ct.transition = o;
    } else e.current = r;
    if (Yl && (Yl = !1, ir = e, Xl = l), o = e.pendingLanes, o === 0 && (or = null), Cd(r.stateNode), Ze(e, Ne()), t !== null) for (n = e.onRecoverableError, r = 0; r < t.length; r++) l = t[r], n(l.value, { componentStack: l.stack, digest: l.digest });
    if (Kl) throw Kl = !1, e = Gi, Gi = null, e;
    return (Xl & 1) !== 0 && e.tag !== 0 && nn(), o = e.pendingLanes, (o & 1) !== 0 ? e === Ki ? Wn++ : (Wn = 0, Ki = e) : Wn = 0, tr(), null;
  }
  function nn() {
    if (ir !== null) {
      var e = es(Xl), t = ct.transition, r = fe;
      try {
        if (ct.transition = null, fe = 16 > e ? 16 : e, ir === null) var n = !1;
        else {
          if (e = ir, ir = null, Xl = 0, (ae & 6) !== 0) throw Error(u(331));
          var l = ae;
          for (ae |= 4, A = e.current; A !== null; ) {
            var o = A, s = o.child;
            if ((A.flags & 16) !== 0) {
              var d = o.deletions;
              if (d !== null) {
                for (var f = 0; f < d.length; f++) {
                  var k = d[f];
                  for (A = k; A !== null; ) {
                    var _ = A;
                    switch (_.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Un(8, _, o);
                    }
                    var M = _.child;
                    if (M !== null) M.return = _, A = M;
                    else for (; A !== null; ) {
                      _ = A;
                      var E = _.sibling, D = _.return;
                      if (Xu(_), _ === k) {
                        A = null;
                        break;
                      }
                      if (E !== null) {
                        E.return = D, A = E;
                        break;
                      }
                      A = D;
                    }
                  }
                }
                var $ = o.alternate;
                if ($ !== null) {
                  var H = $.child;
                  if (H !== null) {
                    $.child = null;
                    do {
                      var Ee = H.sibling;
                      H.sibling = null, H = Ee;
                    } while (H !== null);
                  }
                }
                A = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && s !== null) s.return = o, A = s;
            else e: for (; A !== null; ) {
              if (o = A, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  Un(9, o, o.return);
              }
              var y = o.sibling;
              if (y !== null) {
                y.return = o.return, A = y;
                break e;
              }
              A = o.return;
            }
          }
          var m = e.current;
          for (A = m; A !== null; ) {
            s = A;
            var w = s.child;
            if ((s.subtreeFlags & 2064) !== 0 && w !== null) w.return = s, A = w;
            else e: for (s = m; A !== null; ) {
              if (d = A, (d.flags & 2048) !== 0) try {
                switch (d.tag) {
                  case 0:
                  case 11:
                  case 15:
                    ql(9, d);
                }
              } catch (U) {
                Ce(d, d.return, U);
              }
              if (d === s) {
                A = null;
                break e;
              }
              var P = d.sibling;
              if (P !== null) {
                P.return = d.return, A = P;
                break e;
              }
              A = d.return;
            }
          }
          if (ae = l, tr(), jt && typeof jt.onPostCommitFiberRoot == "function") try {
            jt.onPostCommitFiberRoot(ol, e);
          } catch {
          }
          n = !0;
        }
        return n;
      } finally {
        fe = r, ct.transition = t;
      }
    }
    return !1;
  }
  function fc(e, t, r) {
    t = Jr(r, t), t = Pu(e, t, 1), e = nr(e, t, 1), t = Qe(), e !== null && (hn(e, 1, t), Ze(e, t));
  }
  function Ce(e, t, r) {
    if (e.tag === 3) fc(e, e, r);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        fc(t, e, r);
        break;
      } else if (t.tag === 1) {
        var n = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof n.componentDidCatch == "function" && (or === null || !or.has(n))) {
          e = Jr(r, e), e = Lu(t, e, 1), t = nr(t, e, 1), e = Qe(), t !== null && (hn(t, 1, e), Ze(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Zp(e, t, r) {
    var n = e.pingCache;
    n !== null && n.delete(t), t = Qe(), e.pingedLanes |= e.suspendedLanes & r, Re === e && (Ae & r) === r && (Le === 4 || Le === 3 && (Ae & 130023424) === Ae && 500 > Ne() - Qi ? Cr(e, 0) : qi |= r), Ze(e, t);
  }
  function mc(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = al, al <<= 1, (al & 130023424) === 0 && (al = 4194304)));
    var r = Qe();
    e = Rt(e, t), e !== null && (hn(e, t, r), Ze(e, r));
  }
  function Jp(e) {
    var t = e.memoizedState, r = 0;
    t !== null && (r = t.retryLane), mc(e, r);
  }
  function ef(e, t) {
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
    n !== null && n.delete(t), mc(e, r);
  }
  var hc;
  hc = function(e, t, r) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ge.current) Ye = !0;
    else {
      if ((e.lanes & r) === 0 && (t.flags & 128) === 0) return Ye = !1, Hp(e, t, r);
      Ye = (e.flags & 131072) !== 0;
    }
    else Ye = !1, be && (t.flags & 1048576) !== 0 && Gs(t, _l, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var n = t.type;
        Bl(e, t), e = t.pendingProps;
        var l = Wr(t, Ue.current);
        Xr(t, r), l = Si(null, t, n, e, l, r);
        var o = Ci();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ke(n) ? (o = !0, Nl(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, xi(t), l.updater = Ul, t.stateNode = l, l._reactInternals = t, Pi(t, n, e, r), t = Ii(null, t, n, !0, o, r)) : (t.tag = 0, be && o && ai(t), qe(null, t, l, r), t = t.child), t;
      case 16:
        n = t.elementType;
        e: {
          switch (Bl(e, t), e = t.pendingProps, l = n._init, n = l(n._payload), t.type = n, l = t.tag = rf(n), e = xt(n, e), l) {
            case 0:
              t = Ri(null, t, n, e, r);
              break e;
            case 1:
              t = Hu(null, t, n, e, r);
              break e;
            case 11:
              t = Du(null, t, n, e, r);
              break e;
            case 14:
              t = Ou(null, t, n, xt(n.type, e), r);
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
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : xt(n, l), Ri(e, t, n, l, r);
      case 1:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : xt(n, l), Hu(e, t, n, l, r);
      case 3:
        e: {
          if (Uu(t), e === null) throw Error(u(387));
          n = t.pendingProps, o = t.memoizedState, l = o.element, nu(e, t), Il(t, n, null, r);
          var s = t.memoizedState;
          if (n = s.element, o.isDehydrated) if (o = { element: n, isDehydrated: !1, cache: s.cache, pendingSuspenseBoundaries: s.pendingSuspenseBoundaries, transitions: s.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Jr(Error(u(423)), t), t = Vu(e, t, n, r, l);
            break e;
          } else if (n !== l) {
            l = Jr(Error(u(424)), t), t = Vu(e, t, n, r, l);
            break e;
          } else for (lt = Zt(t.stateNode.containerInfo.firstChild), nt = t, be = !0, gt = null, r = tu(t, null, n, r), t.child = r; r; ) r.flags = r.flags & -3 | 4096, r = r.sibling;
          else {
            if (Gr(), n === l) {
              t = Dt(e, t, r);
              break e;
            }
            qe(e, t, n, r);
          }
          t = t.child;
        }
        return t;
      case 5:
        return iu(t), e === null && ci(t), n = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, s = l.children, ti(n, l) ? s = null : o !== null && ti(n, o) && (t.flags |= 32), $u(e, t), qe(e, t, s, r), t.child;
      case 6:
        return e === null && ci(t), null;
      case 13:
        return Bu(e, t, r);
      case 4:
        return vi(t, t.stateNode.containerInfo), n = t.pendingProps, e === null ? t.child = Kr(t, null, n, r) : qe(e, t, n, r), t.child;
      case 11:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : xt(n, l), Du(e, t, n, l, r);
      case 7:
        return qe(e, t, t.pendingProps, r), t.child;
      case 8:
        return qe(e, t, t.pendingProps.children, r), t.child;
      case 12:
        return qe(e, t, t.pendingProps.children, r), t.child;
      case 10:
        e: {
          if (n = t.type._context, l = t.pendingProps, o = t.memoizedProps, s = l.value, he(Ll, n._currentValue), n._currentValue = s, o !== null) if (ht(o.value, s)) {
            if (o.children === l.children && !Ge.current) {
              t = Dt(e, t, r);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var d = o.dependencies;
            if (d !== null) {
              s = o.child;
              for (var f = d.firstContext; f !== null; ) {
                if (f.context === n) {
                  if (o.tag === 1) {
                    f = It(-1, r & -r), f.tag = 2;
                    var k = o.updateQueue;
                    if (k !== null) {
                      k = k.shared;
                      var _ = k.pending;
                      _ === null ? f.next = f : (f.next = _.next, _.next = f), k.pending = f;
                    }
                  }
                  o.lanes |= r, f = o.alternate, f !== null && (f.lanes |= r), hi(
                    o.return,
                    r,
                    t
                  ), d.lanes |= r;
                  break;
                }
                f = f.next;
              }
            } else if (o.tag === 10) s = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (s = o.return, s === null) throw Error(u(341));
              s.lanes |= r, d = s.alternate, d !== null && (d.lanes |= r), hi(s, r, t), s = o.sibling;
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
        return l = t.type, n = t.pendingProps.children, Xr(t, r), l = st(l), n = n(l), t.flags |= 1, qe(e, t, n, r), t.child;
      case 14:
        return n = t.type, l = xt(n, t.pendingProps), l = xt(n.type, l), Ou(e, t, n, l, r);
      case 15:
        return Au(e, t, t.type, t.pendingProps, r);
      case 17:
        return n = t.type, l = t.pendingProps, l = t.elementType === n ? l : xt(n, l), Bl(e, t), t.tag = 1, Ke(n) ? (e = !0, Nl(t)) : e = !1, Xr(t, r), _u(t, n, l), Pi(t, n, l, r), Ii(null, t, n, !0, e, r);
      case 19:
        return qu(e, t, r);
      case 22:
        return Fu(e, t, r);
    }
    throw Error(u(156, t.tag));
  };
  function gc(e, t) {
    return Ka(e, t);
  }
  function tf(e, t, r, n) {
    this.tag = e, this.key = r, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = n, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function dt(e, t, r, n) {
    return new tf(e, t, r, n);
  }
  function ta(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function rf(e) {
    if (typeof e == "function") return ta(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === ie) return 11;
      if (e === et) return 14;
    }
    return 2;
  }
  function ur(e, t) {
    var r = e.alternate;
    return r === null ? (r = dt(e.tag, t, e.key, e.mode), r.elementType = e.elementType, r.type = e.type, r.stateNode = e.stateNode, r.alternate = e, e.alternate = r) : (r.pendingProps = t, r.type = e.type, r.flags = 0, r.subtreeFlags = 0, r.deletions = null), r.flags = e.flags & 14680064, r.childLanes = e.childLanes, r.lanes = e.lanes, r.child = e.child, r.memoizedProps = e.memoizedProps, r.memoizedState = e.memoizedState, r.updateQueue = e.updateQueue, t = e.dependencies, r.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, r.sibling = e.sibling, r.index = e.index, r.ref = e.ref, r;
  }
  function to(e, t, r, n, l, o) {
    var s = 2;
    if (n = e, typeof e == "function") ta(e) && (s = 1);
    else if (typeof e == "string") s = 5;
    else e: switch (e) {
      case de:
        return Er(r.children, l, o, t);
      case we:
        s = 8, l |= 8;
        break;
      case _e:
        return e = dt(12, r, t, l | 2), e.elementType = _e, e.lanes = o, e;
      case $e:
        return e = dt(13, r, t, l), e.elementType = $e, e.lanes = o, e;
      case He:
        return e = dt(19, r, t, l), e.elementType = He, e.lanes = o, e;
      case ge:
        return ro(r, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Fe:
            s = 10;
            break e;
          case De:
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
    return t = dt(s, r, t, l), t.elementType = e, t.type = n, t.lanes = o, t;
  }
  function Er(e, t, r, n) {
    return e = dt(7, e, n, t), e.lanes = r, e;
  }
  function ro(e, t, r, n) {
    return e = dt(22, e, n, t), e.elementType = ge, e.lanes = r, e.stateNode = { isHidden: !1 }, e;
  }
  function ra(e, t, r) {
    return e = dt(6, e, null, t), e.lanes = r, e;
  }
  function na(e, t, r) {
    return t = dt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = r, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function nf(e, t, r, n, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Mo(0), this.expirationTimes = Mo(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Mo(0), this.identifierPrefix = n, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function la(e, t, r, n, l, o, s, d, f) {
    return e = new nf(e, t, r, d, f), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = dt(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: n, isDehydrated: r, cache: null, transitions: null, pendingSuspenseBoundaries: null }, xi(o), e;
  }
  function lf(e, t, r) {
    var n = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Y, key: n == null ? null : "" + n, children: e, containerInfo: t, implementation: r };
  }
  function xc(e) {
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
      if (Ke(r)) return Ws(e, r, t);
    }
    return t;
  }
  function vc(e, t, r, n, l, o, s, d, f) {
    return e = la(r, n, !0, e, l, o, s, d, f), e.context = xc(null), r = e.current, n = Qe(), l = ar(r), o = It(n, l), o.callback = t ?? null, nr(r, o, l), e.current.lanes = l, hn(e, l, n), Ze(e, n), e;
  }
  function no(e, t, r, n) {
    var l = t.current, o = Qe(), s = ar(l);
    return r = xc(r), t.context === null ? t.context = r : t.pendingContext = r, t = It(o, s), t.payload = { element: e }, n = n === void 0 ? null : n, n !== null && (t.callback = n), e = nr(l, t, s), e !== null && (wt(e, l, s, o), Rl(e, l, s)), s;
  }
  function lo(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function yc(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var r = e.retryLane;
      e.retryLane = r !== 0 && r < t ? r : t;
    }
  }
  function oa(e, t) {
    yc(e, t), (e = e.alternate) && yc(e, t);
  }
  function of() {
    return null;
  }
  var wc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function ia(e) {
    this._internalRoot = e;
  }
  oo.prototype.render = ia.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    no(e, t, null, null);
  }, oo.prototype.unmount = ia.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Sr(function() {
        no(null, e, null, null);
      }), t[Mt] = null;
    }
  };
  function oo(e) {
    this._internalRoot = e;
  }
  oo.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = ns();
      e = { blockedOn: null, target: e, priority: t };
      for (var r = 0; r < Kt.length && t !== 0 && t < Kt[r].priority; r++) ;
      Kt.splice(r, 0, e), r === 0 && is(e);
    }
  };
  function aa(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function io(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function kc() {
  }
  function af(e, t, r, n, l) {
    if (l) {
      if (typeof n == "function") {
        var o = n;
        n = function() {
          var k = lo(s);
          o.call(k);
        };
      }
      var s = vc(t, n, e, 0, null, !1, !1, "", kc);
      return e._reactRootContainer = s, e[Mt] = s.current, _n(e.nodeType === 8 ? e.parentNode : e), Sr(), s;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof n == "function") {
      var d = n;
      n = function() {
        var k = lo(f);
        d.call(k);
      };
    }
    var f = la(e, 0, !1, null, null, !1, !1, "", kc);
    return e._reactRootContainer = f, e[Mt] = f.current, _n(e.nodeType === 8 ? e.parentNode : e), Sr(function() {
      no(t, f, r, n);
    }), f;
  }
  function ao(e, t, r, n, l) {
    var o = r._reactRootContainer;
    if (o) {
      var s = o;
      if (typeof l == "function") {
        var d = l;
        l = function() {
          var f = lo(s);
          d.call(f);
        };
      }
      no(t, s, e, l);
    } else s = af(r, t, e, l, n);
    return lo(s);
  }
  ts = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var r = mn(t.pendingLanes);
          r !== 0 && (Po(t, r | 1), Ze(t, Ne()), (ae & 6) === 0 && (rn = Ne() + 500, tr()));
        }
        break;
      case 13:
        Sr(function() {
          var n = Rt(e, 1);
          if (n !== null) {
            var l = Qe();
            wt(n, e, 1, l);
          }
        }), oa(e, 1);
    }
  }, Lo = function(e) {
    if (e.tag === 13) {
      var t = Rt(e, 134217728);
      if (t !== null) {
        var r = Qe();
        wt(t, e, 134217728, r);
      }
      oa(e, 134217728);
    }
  }, rs = function(e) {
    if (e.tag === 13) {
      var t = ar(e), r = Rt(e, t);
      if (r !== null) {
        var n = Qe();
        wt(r, e, t, n);
      }
      oa(e, t);
    }
  }, ns = function() {
    return fe;
  }, ls = function(e, t) {
    var r = fe;
    try {
      return fe = e, t();
    } finally {
      fe = r;
    }
  }, So = function(e, t, r) {
    switch (t) {
      case "input":
        if (go(e, r), t = r.name, r.type === "radio" && t != null) {
          for (r = e; r.parentNode; ) r = r.parentNode;
          for (r = r.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < r.length; t++) {
            var n = r[t];
            if (n !== e && n.form === e.form) {
              var l = Sl(n);
              if (!l) throw Error(u(90));
              za(n), go(n, l);
            }
          }
        }
        break;
      case "textarea":
        Ta(e, r);
        break;
      case "select":
        t = r.value, t != null && Tr(e, !!r.multiple, t, !1);
    }
  }, Ua = Zi, Va = Sr;
  var sf = { usingClientEntryPoint: !1, Events: [Ln, Vr, Sl, $a, Ha, Zi] }, qn = { findFiberByHostInstance: gr, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, uf = { bundleType: qn.bundleType, version: qn.version, rendererPackageName: qn.rendererPackageName, rendererConfig: qn.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: q.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Qa(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: qn.findFiberByHostInstance || of, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var so = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!so.isDisabled && so.supportsFiber) try {
      ol = so.inject(uf), jt = so;
    } catch {
    }
  }
  return Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sf, Je.createPortal = function(e, t) {
    var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!aa(t)) throw Error(u(200));
    return lf(e, t, null, r);
  }, Je.createRoot = function(e, t) {
    if (!aa(e)) throw Error(u(299));
    var r = !1, n = "", l = wc;
    return t != null && (t.unstable_strictMode === !0 && (r = !0), t.identifierPrefix !== void 0 && (n = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = la(e, 1, !1, null, null, r, !1, n, l), e[Mt] = t.current, _n(e.nodeType === 8 ? e.parentNode : e), new ia(t);
  }, Je.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = Qa(t), e = e === null ? null : e.stateNode, e;
  }, Je.flushSync = function(e) {
    return Sr(e);
  }, Je.hydrate = function(e, t, r) {
    if (!io(t)) throw Error(u(200));
    return ao(null, e, t, !0, r);
  }, Je.hydrateRoot = function(e, t, r) {
    if (!aa(e)) throw Error(u(405));
    var n = r != null && r.hydratedSources || null, l = !1, o = "", s = wc;
    if (r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (s = r.onRecoverableError)), t = vc(t, null, e, 1, r ?? null, l, !1, o, s), e[Mt] = t.current, _n(e), n) for (e = 0; e < n.length; e++) r = n[e], l = r._getVersion, l = l(r._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [r, l] : t.mutableSourceEagerHydrationData.push(
      r,
      l
    );
    return new oo(t);
  }, Je.render = function(e, t, r) {
    if (!io(t)) throw Error(u(200));
    return ao(null, e, t, !1, r);
  }, Je.unmountComponentAtNode = function(e) {
    if (!io(e)) throw Error(u(40));
    return e._reactRootContainer ? (Sr(function() {
      ao(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Mt] = null;
      });
    }), !0) : !1;
  }, Je.unstable_batchedUpdates = Zi, Je.unstable_renderSubtreeIntoContainer = function(e, t, r, n) {
    if (!io(r)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return ao(e, t, r, !1, n);
  }, Je.version = "18.3.1-next-f1338f8080-20240426", Je;
}
var _c;
function Oc() {
  if (_c) return ca.exports;
  _c = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (c) {
        console.error(c);
      }
  }
  return i(), ca.exports = wf(), ca.exports;
}
var Mc;
function kf() {
  if (Mc) return uo;
  Mc = 1;
  var i = Oc();
  return uo.createRoot = i.createRoot, uo.hydrateRoot = i.hydrateRoot, uo;
}
var pt = kf(), mo = Oc();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bf = (i) => i.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Ac = (...i) => i.filter((c, u, p) => !!c && c.trim() !== "" && p.indexOf(c) === u).join(" ").trim();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var jf = {
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
const Sf = W.forwardRef(
  ({
    color: i = "currentColor",
    size: c = 24,
    strokeWidth: u = 2,
    absoluteStrokeWidth: p,
    className: v = "",
    children: g,
    iconNode: x,
    ...j
  }, S) => W.createElement(
    "svg",
    {
      ref: S,
      ...jf,
      width: c,
      height: c,
      stroke: i,
      strokeWidth: p ? Number(u) * 24 / Number(c) : u,
      className: Ac("lucide", v),
      ...j
    },
    [
      ...x.map(([N, T]) => W.createElement(N, T)),
      ...Array.isArray(g) ? g : [g]
    ]
  )
);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const re = (i, c) => {
  const u = W.forwardRef(
    ({ className: p, ...v }, g) => W.createElement(Sf, {
      ref: g,
      iconNode: c,
      className: Ac(`lucide-${bf(i)}`, p),
      ...v
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
const Cf = re("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nf = re("ArrowUpDown", [
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
const Ef = re("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zf = re("BookCheck", [
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
const fo = re("BookOpen", [
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
const _f = re("Building2", [
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
const Mf = re("CalendarClock", [
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
const on = re("CalendarDays", [
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
const Pf = re("CalendarRange", [
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
const Lf = re("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fc = re("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tf = re("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rf = re("CircleDashed", [
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
const Xn = re("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ma = re("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Df = re("Download", [
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
const $c = re("Ellipsis", [
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
const ja = re("ExternalLink", [
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
const ha = re("FileClock", [
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
const Of = re("FileJson", [
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
const Af = re("Gauge", [
  ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ff = re("GitBranch", [
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
const Yn = re("GraduationCap", [
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
const $f = re("GripVertical", [
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
const Sa = re("Hash", [
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
const ga = re("History", [
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
const Hf = re("Layers", [
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
const Uf = re("LibraryBig", [
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
const Zn = re("MapPin", [
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
const Vf = re("Pin", [
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
const Bf = re("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wf = re("Route", [
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
const Ca = re("SearchX", [
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
const qf = re("Star", [
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
const Qf = re("Target", [
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
const xa = re("Trash2", [
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
const Hc = re("TriangleAlert", [
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
const Gf = re("UsersRound", [
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
const Kf = re("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
var Yf = Object.defineProperty, Na = (i, c) => Yf(i, "name", { value: c, configurable: !0 });
function va(i, c) {
  if (typeof i == "function")
    return i(c);
  i != null && (i.current = c);
}
Na(va, "setRef");
function Uc(...i) {
  return (c) => {
    let u = !1;
    const p = i.map((v) => {
      const g = va(v, c);
      return !u && typeof g == "function" && (u = !0), g;
    });
    if (u)
      return () => {
        for (let v = 0; v < p.length; v++) {
          const g = p[v];
          typeof g == "function" ? g() : va(i[v], null);
        }
      };
  };
}
Na(Uc, "composeRefs");
function Vc(...i) {
  return W.useCallback(Uc(...i), i);
}
Na(Vc, "useComposedRefs");
var Xf = Object.defineProperty, bt = (i, c) => Xf(i, "name", { value: c, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Bc(i) {
  const c = W.forwardRef((u, p) => {
    let { children: v, ...g } = u, x = null, j = !1;
    const S = [];
    ya(v) && typeof co == "function" && (v = co(v._payload)), W.Children.forEach(v, (I) => {
      var J;
      if (Gc(I)) {
        j = !0;
        const b = I;
        let C = "child" in b.props ? b.props.child : b.props.children;
        ya(C) && typeof co == "function" && (C = co(C._payload)), x = em(b, C), S.push((J = x == null ? void 0 : x.props) == null ? void 0 : J.children);
      } else
        S.push(I);
    }), x ? x = W.cloneElement(x, void 0, S) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !j && W.Children.count(v) === 1 && W.isValidElement(v) && (x = v)
    );
    const N = x ? Qc(x) : void 0, T = Vc(p, N);
    if (!x) {
      if (v || v === 0)
        throw new Error(
          j ? nm(i) : rm(i)
        );
      return v;
    }
    const V = qc(g, x.props ?? {});
    return x.type !== W.Fragment && (V.ref = p ? T : N), W.cloneElement(x, V);
  });
  return c.displayName = `${i}.Slot`, c;
}
bt(Bc, "createSlot");
var Zf = /* @__PURE__ */ Bc("Slot"), Wc = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Jf(i) {
  const c = /* @__PURE__ */ bt((u) => "child" in u ? u.children(u.child) : u.children, "Slottable");
  return c.displayName = `${i}.Slottable`, c.__radixId = Wc, c;
}
bt(Jf, "createSlottable");
var em = /* @__PURE__ */ bt((i, c) => {
  if ("child" in i.props) {
    const u = i.props.child;
    return W.isValidElement(u) ? W.cloneElement(u, void 0, i.props.children(u.props.children)) : null;
  }
  return W.isValidElement(c) ? c : null;
}, "getSlottableElementFromSlottable");
function qc(i, c) {
  const u = { ...c };
  for (const p in c) {
    const v = i[p], g = c[p];
    /^on[A-Z]/.test(p) ? v && g ? u[p] = (...j) => {
      const S = g(...j);
      return v(...j), S;
    } : v && (u[p] = v) : p === "style" ? u[p] = { ...v, ...g } : p === "className" && (u[p] = [v, g].filter(Boolean).join(" "));
  }
  return { ...i, ...u };
}
bt(qc, "mergeProps");
function Qc(i) {
  var p, v;
  let c = (p = Object.getOwnPropertyDescriptor(i.props, "ref")) == null ? void 0 : p.get, u = c && "isReactWarning" in c && c.isReactWarning;
  return u ? i.ref : (c = (v = Object.getOwnPropertyDescriptor(i, "ref")) == null ? void 0 : v.get, u = c && "isReactWarning" in c && c.isReactWarning, u ? i.props.ref : i.props.ref || i.ref);
}
bt(Qc, "getElementRef");
function Gc(i) {
  return W.isValidElement(i) && typeof i.type == "function" && "__radixId" in i.type && i.type.__radixId === Wc;
}
bt(Gc, "isSlottable");
var tm = Symbol.for("react.lazy");
function ya(i) {
  return i != null && typeof i == "object" && "$$typeof" in i && i.$$typeof === tm && "_payload" in i && Kc(i._payload);
}
bt(ya, "isLazyComponent");
function Kc(i) {
  return typeof i == "object" && i !== null && "then" in i;
}
bt(Kc, "isPromiseLike");
var rm = /* @__PURE__ */ bt((i) => `${i} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), nm = /* @__PURE__ */ bt((i) => `${i} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), co = xf[" use ".trim().toString()];
function Yc(i) {
  var c, u, p = "";
  if (typeof i == "string" || typeof i == "number") p += i;
  else if (typeof i == "object") if (Array.isArray(i)) {
    var v = i.length;
    for (c = 0; c < v; c++) i[c] && (u = Yc(i[c])) && (p && (p += " "), p += u);
  } else for (u in i) i[u] && (p && (p += " "), p += u);
  return p;
}
function Xc() {
  for (var i, c, u = 0, p = "", v = arguments.length; u < v; u++) (i = arguments[u]) && (c = Yc(i)) && (p && (p += " "), p += c);
  return p;
}
const Pc = (i) => typeof i == "boolean" ? `${i}` : i === 0 ? "0" : i, Lc = Xc, lm = (i, c) => (u) => {
  var p;
  if ((c == null ? void 0 : c.variants) == null) return Lc(i, u == null ? void 0 : u.class, u == null ? void 0 : u.className);
  const { variants: v, defaultVariants: g } = c, x = Object.keys(v).map((N) => {
    const T = u == null ? void 0 : u[N], V = g == null ? void 0 : g[N];
    if (T === null) return null;
    const I = Pc(T) || Pc(V);
    return v[N][I];
  }), j = u && Object.entries(u).reduce((N, T) => {
    let [V, I] = T;
    return I === void 0 || (N[V] = I), N;
  }, {}), S = c == null || (p = c.compoundVariants) === null || p === void 0 ? void 0 : p.reduce((N, T) => {
    let { class: V, className: I, ...J } = T;
    return Object.entries(J).every((b) => {
      let [C, L] = b;
      return Array.isArray(L) ? L.includes({
        ...g,
        ...j
      }[C]) : {
        ...g,
        ...j
      }[C] === L;
    }) ? [
      ...N,
      V,
      I
    ] : N;
  }, []);
  return Lc(i, x, S, u == null ? void 0 : u.class, u == null ? void 0 : u.className);
}, Ea = "-", om = (i) => {
  const c = am(i), {
    conflictingClassGroups: u,
    conflictingClassGroupModifiers: p
  } = i;
  return {
    getClassGroupId: (x) => {
      const j = x.split(Ea);
      return j[0] === "" && j.length !== 1 && j.shift(), Zc(j, c) || im(x);
    },
    getConflictingClassGroupIds: (x, j) => {
      const S = u[x] || [];
      return j && p[x] ? [...S, ...p[x]] : S;
    }
  };
}, Zc = (i, c) => {
  var x;
  if (i.length === 0)
    return c.classGroupId;
  const u = i[0], p = c.nextPart.get(u), v = p ? Zc(i.slice(1), p) : void 0;
  if (v)
    return v;
  if (c.validators.length === 0)
    return;
  const g = i.join(Ea);
  return (x = c.validators.find(({
    validator: j
  }) => j(g))) == null ? void 0 : x.classGroupId;
}, Tc = /^\[(.+)\]$/, im = (i) => {
  if (Tc.test(i)) {
    const c = Tc.exec(i)[1], u = c == null ? void 0 : c.substring(0, c.indexOf(":"));
    if (u)
      return "arbitrary.." + u;
  }
}, am = (i) => {
  const {
    theme: c,
    prefix: u
  } = i, p = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return um(Object.entries(i.classGroups), u).forEach(([g, x]) => {
    wa(x, p, g, c);
  }), p;
}, wa = (i, c, u, p) => {
  i.forEach((v) => {
    if (typeof v == "string") {
      const g = v === "" ? c : Rc(c, v);
      g.classGroupId = u;
      return;
    }
    if (typeof v == "function") {
      if (sm(v)) {
        wa(v(p), c, u, p);
        return;
      }
      c.validators.push({
        validator: v,
        classGroupId: u
      });
      return;
    }
    Object.entries(v).forEach(([g, x]) => {
      wa(x, Rc(c, g), u, p);
    });
  });
}, Rc = (i, c) => {
  let u = i;
  return c.split(Ea).forEach((p) => {
    u.nextPart.has(p) || u.nextPart.set(p, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), u = u.nextPart.get(p);
  }), u;
}, sm = (i) => i.isThemeGetter, um = (i, c) => c ? i.map(([u, p]) => {
  const v = p.map((g) => typeof g == "string" ? c + g : typeof g == "object" ? Object.fromEntries(Object.entries(g).map(([x, j]) => [c + x, j])) : g);
  return [u, v];
}) : i, cm = (i) => {
  if (i < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let c = 0, u = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  const v = (g, x) => {
    u.set(g, x), c++, c > i && (c = 0, p = u, u = /* @__PURE__ */ new Map());
  };
  return {
    get(g) {
      let x = u.get(g);
      if (x !== void 0)
        return x;
      if ((x = p.get(g)) !== void 0)
        return v(g, x), x;
    },
    set(g, x) {
      u.has(g) ? u.set(g, x) : v(g, x);
    }
  };
}, Jc = "!", dm = (i) => {
  const {
    separator: c,
    experimentalParseClassName: u
  } = i, p = c.length === 1, v = c[0], g = c.length, x = (j) => {
    const S = [];
    let N = 0, T = 0, V;
    for (let L = 0; L < j.length; L++) {
      let X = j[L];
      if (N === 0) {
        if (X === v && (p || j.slice(L, L + g) === c)) {
          S.push(j.slice(T, L)), T = L + g;
          continue;
        }
        if (X === "/") {
          V = L;
          continue;
        }
      }
      X === "[" ? N++ : X === "]" && N--;
    }
    const I = S.length === 0 ? j : j.substring(T), J = I.startsWith(Jc), b = J ? I.substring(1) : I, C = V && V > T ? V - T : void 0;
    return {
      modifiers: S,
      hasImportantModifier: J,
      baseClassName: b,
      maybePostfixModifierPosition: C
    };
  };
  return u ? (j) => u({
    className: j,
    parseClassName: x
  }) : x;
}, pm = (i) => {
  if (i.length <= 1)
    return i;
  const c = [];
  let u = [];
  return i.forEach((p) => {
    p[0] === "[" ? (c.push(...u.sort(), p), u = []) : u.push(p);
  }), c.push(...u.sort()), c;
}, fm = (i) => ({
  cache: cm(i.cacheSize),
  parseClassName: dm(i),
  ...om(i)
}), mm = /\s+/, hm = (i, c) => {
  const {
    parseClassName: u,
    getClassGroupId: p,
    getConflictingClassGroupIds: v
  } = c, g = [], x = i.trim().split(mm);
  let j = "";
  for (let S = x.length - 1; S >= 0; S -= 1) {
    const N = x[S], {
      modifiers: T,
      hasImportantModifier: V,
      baseClassName: I,
      maybePostfixModifierPosition: J
    } = u(N);
    let b = !!J, C = p(b ? I.substring(0, J) : I);
    if (!C) {
      if (!b) {
        j = N + (j.length > 0 ? " " + j : j);
        continue;
      }
      if (C = p(I), !C) {
        j = N + (j.length > 0 ? " " + j : j);
        continue;
      }
      b = !1;
    }
    const L = pm(T).join(":"), X = V ? L + Jc : L, K = X + C;
    if (g.includes(K))
      continue;
    g.push(K);
    const F = v(C, b);
    for (let q = 0; q < F.length; ++q) {
      const ee = F[q];
      g.push(X + ee);
    }
    j = N + (j.length > 0 ? " " + j : j);
  }
  return j;
};
function gm() {
  let i = 0, c, u, p = "";
  for (; i < arguments.length; )
    (c = arguments[i++]) && (u = ed(c)) && (p && (p += " "), p += u);
  return p;
}
const ed = (i) => {
  if (typeof i == "string")
    return i;
  let c, u = "";
  for (let p = 0; p < i.length; p++)
    i[p] && (c = ed(i[p])) && (u && (u += " "), u += c);
  return u;
};
function xm(i, ...c) {
  let u, p, v, g = x;
  function x(S) {
    const N = c.reduce((T, V) => V(T), i());
    return u = fm(N), p = u.cache.get, v = u.cache.set, g = j, j(S);
  }
  function j(S) {
    const N = p(S);
    if (N)
      return N;
    const T = hm(S, u);
    return v(S, T), T;
  }
  return function() {
    return g(gm.apply(null, arguments));
  };
}
const ye = (i) => {
  const c = (u) => u[i] || [];
  return c.isThemeGetter = !0, c;
}, td = /^\[(?:([a-z-]+):)?(.+)\]$/i, vm = /^\d+\/\d+$/, ym = /* @__PURE__ */ new Set(["px", "full", "screen"]), wm = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, km = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, bm = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, jm = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Sm = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, At = (i) => ln(i) || ym.has(i) || vm.test(i), dr = (i) => an(i, "length", Lm), ln = (i) => !!i && !Number.isNaN(Number(i)), fa = (i) => an(i, "number", ln), Gn = (i) => !!i && Number.isInteger(Number(i)), Cm = (i) => i.endsWith("%") && ln(i.slice(0, -1)), te = (i) => td.test(i), pr = (i) => wm.test(i), Nm = /* @__PURE__ */ new Set(["length", "size", "percentage"]), Em = (i) => an(i, Nm, rd), zm = (i) => an(i, "position", rd), _m = /* @__PURE__ */ new Set(["image", "url"]), Mm = (i) => an(i, _m, Rm), Pm = (i) => an(i, "", Tm), Kn = () => !0, an = (i, c, u) => {
  const p = td.exec(i);
  return p ? p[1] ? typeof c == "string" ? p[1] === c : c.has(p[1]) : u(p[2]) : !1;
}, Lm = (i) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  km.test(i) && !bm.test(i)
), rd = () => !1, Tm = (i) => jm.test(i), Rm = (i) => Sm.test(i), Im = () => {
  const i = ye("colors"), c = ye("spacing"), u = ye("blur"), p = ye("brightness"), v = ye("borderColor"), g = ye("borderRadius"), x = ye("borderSpacing"), j = ye("borderWidth"), S = ye("contrast"), N = ye("grayscale"), T = ye("hueRotate"), V = ye("invert"), I = ye("gap"), J = ye("gradientColorStops"), b = ye("gradientColorStopPositions"), C = ye("inset"), L = ye("margin"), X = ye("opacity"), K = ye("padding"), F = ye("saturate"), q = ye("scale"), ee = ye("sepia"), Y = ye("skew"), de = ye("space"), we = ye("translate"), _e = () => ["auto", "contain", "none"], Fe = () => ["auto", "hidden", "clip", "visible", "scroll"], De = () => ["auto", te, c], ie = () => [te, c], $e = () => ["", At, dr], He = () => ["auto", ln, te], et = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Me = () => ["solid", "dashed", "dotted", "double", "none"], ge = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], R = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], B = () => ["", "0", te], O = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], h = () => [ln, te];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Kn],
      spacing: [At, dr],
      blur: ["none", "", pr, te],
      brightness: h(),
      borderColor: [i],
      borderRadius: ["none", "", "full", pr, te],
      borderSpacing: ie(),
      borderWidth: $e(),
      contrast: h(),
      grayscale: B(),
      hueRotate: h(),
      invert: B(),
      gap: ie(),
      gradientColorStops: [i],
      gradientColorStopPositions: [Cm, dr],
      inset: De(),
      margin: De(),
      opacity: h(),
      padding: ie(),
      saturate: h(),
      scale: h(),
      sepia: B(),
      skew: h(),
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
        "break-after": O()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": O()
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
        inset: [C]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [C]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [C]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [C]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [C]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [C]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [C]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [C]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [C]
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
        z: ["auto", Gn, te]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: De()
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
        order: ["first", "last", "none", Gn, te]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Kn]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Gn, te]
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
        "grid-rows": [Kn]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Gn, te]
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
        justify: ["normal", ...R()]
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
        content: ["normal", ...R(), "baseline"]
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
        "place-content": [...R(), "baseline"]
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
        p: [K]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [K]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [K]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [K]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [K]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [K]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [K]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [K]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [K]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [L]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [L]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [L]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [L]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [L]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [L]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [L]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [L]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [L]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [de]
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
        "space-y": [de]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", fa]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Kn]
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
        "line-clamp": ["none", ln, fa]
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
        bg: [...et(), zm]
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
        bg: ["auto", "cover", "contain", Em]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, Mm]
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
        rounded: [g]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [g]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [g]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [g]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [g]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [g]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [g]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [g]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [g]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [g]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [g]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [g]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [g]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [g]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [g]
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
        border: [v]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [v]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [v]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [v]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [v]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [v]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [v]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [v]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [v]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [v]
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
        "ring-offset": [At, dr]
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
        shadow: ["", "inner", "none", pr, Pm]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Kn]
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
        brightness: [p]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [S]
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
        saturate: [F]
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
        "backdrop-brightness": [p]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [S]
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
        "backdrop-opacity": [X]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [F]
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
        duration: h()
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
        delay: h()
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
        scale: [q]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [q]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [q]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [Gn, te]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", te]
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
        fill: [i, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [At, dr, fa]
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
}, Dm = /* @__PURE__ */ xm(Im);
function Lr(...i) {
  return Dm(Xc(i));
}
const Om = lm(
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
), nd = W.forwardRef(
  ({ className: i, variant: c, size: u, asChild: p = !1, ...v }, g) => {
    const x = p ? Zf : "button";
    return /* @__PURE__ */ a.jsx(x, { className: Lr(Om({ variant: c, size: u, className: i })), ref: g, ...v });
  }
);
nd.displayName = "Button";
const ld = W.forwardRef(
  ({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx("div", { className: "dt-relative dt-w-full dt-overflow-auto", children: /* @__PURE__ */ a.jsx("table", { ref: u, className: Lr("dt-w-full dt-caption-bottom dt-text-sm", i), ...c }) })
);
ld.displayName = "Table";
const od = W.forwardRef(({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx("thead", { ref: u, className: Lr("[&_tr]:dt-border-b", i), ...c }));
od.displayName = "TableHeader";
const id = W.forwardRef(({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx("tbody", { ref: u, className: Lr("[&_tr:last-child]:dt-border-0", i), ...c }));
id.displayName = "TableBody";
const ka = W.forwardRef(
  ({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx(
    "tr",
    {
      ref: u,
      className: Lr(
        "dt-border-b dt-transition-colors hover:dt-bg-muted/50 data-[state=selected]:dt-bg-muted",
        i
      ),
      ...c
    }
  )
);
ka.displayName = "TableRow";
const zt = W.forwardRef(({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx(
  "th",
  {
    ref: u,
    className: Lr(
      "dt-h-12 dt-px-4 dt-text-left dt-align-middle dt-font-medium dt-text-muted-foreground [&:has([role=checkbox])]:dt-pr-0",
      i
    ),
    ...c
  }
));
zt.displayName = "TableHead";
const _t = W.forwardRef(({ className: i, ...c }, u) => /* @__PURE__ */ a.jsx(
  "td",
  {
    ref: u,
    className: Lr("dt-p-4 dt-align-middle [&:has([role=checkbox])]:dt-pr-0", i),
    ...c
  }
));
_t.displayName = "TableCell";
function Ic(i) {
  return i ? i.split(" | ").map((c) => c.replace("/", "-")) : ["·"];
}
function Am({
  label: i,
  active: c,
  dir: u,
  onClick: p
}) {
  const v = c ? u === 1 ? Ef : Cf : Nf;
  return /* @__PURE__ */ a.jsxs(nd, { variant: "ghost", size: "sm", onClick: p, className: "th-sort dt--ml-3", children: [
    i,
    /* @__PURE__ */ a.jsx(v, { className: `dt-ml-1.5 dt-inline dt-size-3.5${c ? "" : " dt-opacity-40"}` })
  ] });
}
function ad(i) {
  const { rows: c, sortKey: u, sortDir: p, onSortChange: v, onRowClick: g, onToggleSelect: x, onToggleFavorite: j, allSelected: S, onSelectAll: N, emptyMessage: T, ariaLabel: V, labels: I } = i;
  if (!c.length)
    return /* @__PURE__ */ a.jsx("p", { className: "dt-p-6 dt-text-center dt-text-sm dt-text-muted-foreground", children: T });
  const J = (b, C) => /* @__PURE__ */ a.jsx(Am, { label: C, active: u === b, dir: p, onClick: () => v(b) });
  return /* @__PURE__ */ a.jsx("div", { id: "results", className: "dersler-table-root dt-overflow-hidden dt-rounded-lg dt-border dt-border-border", children: /* @__PURE__ */ a.jsxs(ld, { "aria-label": V, children: [
    /* @__PURE__ */ a.jsx(od, { children: /* @__PURE__ */ a.jsxs(ka, { children: [
      /* @__PURE__ */ a.jsx(zt, { className: "dt-h-9 dt-w-8 dt-p-2", children: /* @__PURE__ */ a.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: S,
          "aria-label": I.selectAll,
          onChange: (b) => N(b.target.checked)
        }
      ) }),
      /* @__PURE__ */ a.jsx(zt, { className: "dt-h-9 dt-w-8 dt-p-2" }),
      /* @__PURE__ */ a.jsx(zt, { className: "dt-h-9 dt-p-2", "data-sort": "crn", "aria-sort": u === "crn" ? p === 1 ? "ascending" : "descending" : "none", children: J("crn", I.crn) }),
      /* @__PURE__ */ a.jsx(zt, { className: "dt-h-9 dt-p-2", "data-sort": "code", "aria-sort": u === "code" ? p === 1 ? "ascending" : "descending" : "none", children: J("code", I.code) }),
      /* @__PURE__ */ a.jsx(zt, { className: "dt-h-9 dt-p-2", "data-sort": "name", "aria-sort": u === "name" ? p === 1 ? "ascending" : "descending" : "none", children: J("name", I.name) }),
      /* @__PURE__ */ a.jsx(zt, { className: "dt-h-9 dt-p-2", "data-sort": "instructor", "aria-sort": u === "instructor" ? p === 1 ? "ascending" : "descending" : "none", children: J("instructor", I.instructor) }),
      /* @__PURE__ */ a.jsx(zt, { className: "dt-h-9 dt-p-2", "data-sort": "when", "aria-sort": u === "when" ? p === 1 ? "ascending" : "descending" : "none", children: J("when", I.when) }),
      /* @__PURE__ */ a.jsx(zt, { className: "dt-h-9 dt-p-2", children: I.where }),
      /* @__PURE__ */ a.jsx(zt, { className: "dt-h-9 dt-p-2 dt-text-right", "data-sort": "fill", "aria-sort": u === "fill" ? p === 1 ? "ascending" : "descending" : "none", children: J("fill", I.fill) })
    ] }) }),
    /* @__PURE__ */ a.jsx(id, { id: "rows", children: c.map((b) => /* @__PURE__ */ a.jsxs(ka, { className: "dt-cursor-pointer", onClick: () => g(b.key), children: [
      /* @__PURE__ */ a.jsx(_t, { className: "dt-p-2", onClick: (C) => C.stopPropagation(), children: /* @__PURE__ */ a.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: b.selected,
          "aria-label": I.selectSection,
          onChange: (C) => x(b.key, C.target.checked)
        }
      ) }),
      /* @__PURE__ */ a.jsx(_t, { className: "dt-p-2", onClick: (C) => C.stopPropagation(), children: /* @__PURE__ */ a.jsx(
        "button",
        {
          type: "button",
          className: "dt-text-base dt-leading-none",
          "aria-label": b.favorite ? I.removeFav : I.addFav,
          "aria-pressed": b.favorite,
          onClick: () => j(b.key),
          children: /* @__PURE__ */ a.jsx(qf, { "aria-hidden": "true", className: "dt-size-4", fill: b.favorite ? "currentColor" : "none" })
        }
      ) }),
      /* @__PURE__ */ a.jsx(_t, { className: "dt-p-2 dt-font-mono dt-text-muted-foreground", dangerouslySetInnerHTML: { __html: b.crnHTML } }),
      /* @__PURE__ */ a.jsx(_t, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: b.codeHTML } }),
      /* @__PURE__ */ a.jsx(_t, { className: "dt-p-2", children: /* @__PURE__ */ a.jsxs("div", { className: "dt-course-name", children: [
        /* @__PURE__ */ a.jsx("span", { dangerouslySetInnerHTML: { __html: b.nameHTML } }),
        b.kind && /* @__PURE__ */ a.jsxs("span", { className: `dt-kind-badge ${b.kind}`, title: b.kindHelp, children: [
          b.kind === "extra-exam" ? /* @__PURE__ */ a.jsx(ha, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(Yn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsx("b", { children: b.kindLabel })
        ] })
      ] }) }),
      /* @__PURE__ */ a.jsx(_t, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: b.instructorHTML } }),
      /* @__PURE__ */ a.jsx(_t, { className: "dt-p-2 dt-font-mono dt-text-xs", children: Ic(b.when).map((C, L) => /* @__PURE__ */ a.jsx("div", { children: C }, L)) }),
      /* @__PURE__ */ a.jsx(_t, { className: "dt-p-2 dt-text-xs dt-text-muted-foreground", children: b.where ? Ic(b.where).map((C, L) => /* @__PURE__ */ a.jsx("div", { children: C }, L)) : "·" }),
      /* @__PURE__ */ a.jsx(_t, { className: "dt-p-2 dt-text-right dt-tabular-nums quota-main-col", dangerouslySetInnerHTML: { __html: b.quotaHTML } })
    ] }, b.key)) })
  ] }) });
}
const Pr = (i) => `${String(Math.floor(i / 60)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`;
function sd(i) {
  const c = [...i].sort((g, x) => g.start - x.start || g.end - x.end), u = [], p = c.map((g) => {
    let x = u.findIndex((j) => j <= g.start);
    return x < 0 ? (x = u.length, u.push(g.end)) : u[x] = g.end, { ...g, lane: x, laneCount: 1, conflict: !1 };
  }), v = Math.max(1, u.length);
  return p.map((g) => ({
    ...g,
    laneCount: v,
    conflict: p.some((x) => x.key !== g.key && g.start < x.end && x.start < g.end)
  }));
}
function Fm() {
  const i = "(max-width: 600px)", [c, u] = W.useState(() => window.matchMedia(i).matches);
  return W.useEffect(() => {
    const p = window.matchMedia(i), v = () => u(p.matches);
    return p.addEventListener("change", v), () => p.removeEventListener("change", v);
  }, []), c;
}
function ud({ session: i, compact: c = !1 }) {
  return /* @__PURE__ */ a.jsxs("span", { className: "pp-session-meta", children: [
    /* @__PURE__ */ a.jsxs("span", { children: [
      /* @__PURE__ */ a.jsx(Xn, { "aria-hidden": "true" }),
      Pr(i.start),
      "–",
      Pr(i.end)
    ] }),
    /* @__PURE__ */ a.jsxs("span", { children: [
      /* @__PURE__ */ a.jsx(Sa, { "aria-hidden": "true" }),
      i.crn
    ] }),
    !c && i.instructor && /* @__PURE__ */ a.jsxs("span", { children: [
      /* @__PURE__ */ a.jsx(mr, { "aria-hidden": "true" }),
      i.instructor
    ] }),
    !c && i.where && /* @__PURE__ */ a.jsxs("span", { children: [
      /* @__PURE__ */ a.jsx(Zn, { "aria-hidden": "true" }),
      i.where
    ] })
  ] });
}
function $m({ props: i, visibleDays: c }) {
  const u = c.find((x) => i.sessions.some((j) => j.day === x)) ?? c[0], [p, v] = W.useState(u);
  W.useEffect(() => {
    c.includes(p) || v(u);
  }, [p, u, c]);
  const g = sd(i.sessions.filter((x) => x.day === p));
  return /* @__PURE__ */ a.jsxs("div", { className: "pp-agenda", children: [
    /* @__PURE__ */ a.jsx("div", { className: "pp-day-tabs tt-daytabs", role: "tablist", "aria-label": i.labels.title, style: { "--pp-days": c.length }, children: c.map((x) => /* @__PURE__ */ a.jsxs("button", { type: "button", role: "tab", "aria-selected": p === x, className: p === x ? "is-active active tt-daytab" : "tt-daytab", onClick: () => v(x), children: [
      i.dayLabels[x],
      i.sessions.some((j) => j.day === x) && /* @__PURE__ */ a.jsx("span", { "aria-hidden": "true" })
    ] }, x)) }),
    /* @__PURE__ */ a.jsx("div", { className: "pp-agenda-list", children: g.length ? g.map((x) => /* @__PURE__ */ a.jsxs(
      "button",
      {
        type: "button",
        className: `pp-agenda-card p-agenda-session${x.conflict ? " is-conflict" : ""}`,
        style: { "--pp-color": x.color },
        onClick: () => i.onOpen(x.rowKey),
        children: [
          /* @__PURE__ */ a.jsxs("span", { className: "pp-agenda-time", children: [
            /* @__PURE__ */ a.jsx("b", { children: Pr(x.start) }),
            /* @__PURE__ */ a.jsx("small", { children: Pr(x.end) })
          ] }),
          /* @__PURE__ */ a.jsxs("span", { className: "pp-agenda-copy", children: [
            /* @__PURE__ */ a.jsxs("strong", { children: [
              /* @__PURE__ */ a.jsx("span", { className: "pp-color-dot" }),
              x.code
            ] }),
            /* @__PURE__ */ a.jsx("span", { className: "pp-agenda-name", children: x.name }),
            /* @__PURE__ */ a.jsx(ud, { session: x, compact: !0 }),
            x.instructor && /* @__PURE__ */ a.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ a.jsx(mr, { "aria-hidden": "true" }),
              x.instructor
            ] }),
            x.where && /* @__PURE__ */ a.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ a.jsx(Zn, { "aria-hidden": "true" }),
              x.where
            ] }),
            x.conflict && /* @__PURE__ */ a.jsxs("em", { children: [
              /* @__PURE__ */ a.jsx(Hc, { "aria-hidden": "true" }),
              i.labels.conflict
            ] })
          ] })
        ]
      },
      x.key
    )) : /* @__PURE__ */ a.jsxs("div", { className: "pp-empty-day", children: [
      /* @__PURE__ */ a.jsx(on, { "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsx("p", { children: i.labels.emptyDay })
    ] }) })
  ] });
}
function cd(i) {
  const c = Fm(), [u, p] = W.useState(null), [v, g] = W.useState(null), x = i.sessions.some((F) => F.day >= 5), j = i.showWeekend || x ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4], S = i.sessions.length > 0, N = W.useMemo(() => {
    if (!S) return { start: 480, end: 1080 };
    const F = Math.min(...i.sessions.map((ee) => ee.start)), q = Math.max(...i.sessions.map((ee) => ee.end));
    return i.showFullDay ? { start: 420, end: 1380 } : { start: Math.min(510, F), end: Math.min(1440, q + 60) };
  }, [i.sessions, i.showFullDay, S]), T = 34, V = Math.max(1, Math.ceil((N.end - N.start) / 30)), I = V * T, J = /* @__PURE__ */ new Date(), b = (J.getDay() + 6) % 7, C = J.getHours() * 60 + J.getMinutes(), L = (C - N.start) / 30 * T;
  W.useEffect(() => {
    if (!u) return;
    const F = () => p(null);
    return window.addEventListener("pointerdown", F, { once: !0 }), window.addEventListener("blur", F, { once: !0 }), () => {
      window.removeEventListener("pointerdown", F), window.removeEventListener("blur", F);
    };
  }, [u]);
  const X = (F, q) => {
    F.preventDefault(), F.stopPropagation(), p({ session: q, x: Math.min(F.clientX, window.innerWidth - 232), y: Math.min(F.clientY, window.innerHeight - 230) });
  }, K = (F, q) => {
    const ee = F.getBoundingClientRect(), Y = 286, de = Math.max(10, Math.min(ee.left + ee.width / 2 - Y / 2, window.innerWidth - Y - 10)), we = ee.top < 190;
    g({ session: q, x: de, y: we ? ee.bottom + 9 : ee.top - 9, side: we ? "bottom" : "top" });
  };
  return /* @__PURE__ */ a.jsxs("section", { className: "dersler-table-root program-planner-root", "aria-label": i.labels.title, children: [
    /* @__PURE__ */ a.jsxs("header", { className: "pp-heading", children: [
      /* @__PURE__ */ a.jsx("span", { className: "pp-heading-icon", children: /* @__PURE__ */ a.jsx(on, { "aria-hidden": "true" }) }),
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
    !S && !i.untimed.length ? /* @__PURE__ */ a.jsxs("div", { className: "pp-empty", children: [
      /* @__PURE__ */ a.jsx(Ca, { "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsx("strong", { children: i.labels.empty })
    ] }) : c && !i.forceGrid ? /* @__PURE__ */ a.jsx($m, { props: i, visibleDays: j }) : S ? /* @__PURE__ */ a.jsx("div", { className: "pp-calendar-scroll", children: /* @__PURE__ */ a.jsxs("div", { className: "pp-calendar", style: { "--pp-days": j.length }, children: [
      /* @__PURE__ */ a.jsxs("div", { className: "pp-calendar-head", children: [
        /* @__PURE__ */ a.jsx("span", {}),
        j.map((F) => /* @__PURE__ */ a.jsx("b", { children: i.dayLabels[F] }, F))
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "pp-calendar-body", children: [
        /* @__PURE__ */ a.jsx("div", { className: "pp-time-column", style: { height: I }, children: Array.from({ length: V }, (F, q) => /* @__PURE__ */ a.jsx("span", { children: Pr(N.start + q * 30) }, q)) }),
        j.map((F) => {
          const q = sd(i.sessions.filter((Y) => Y.day === F)), ee = i.showNow && F === b && C >= N.start && C < N.end;
          return /* @__PURE__ */ a.jsxs("div", { className: `pp-day-column${F >= 5 ? " is-weekend" : ""}`, style: { height: I }, children: [
            ee && /* @__PURE__ */ a.jsx("span", { className: "pp-now", style: { top: L } }),
            q.map((Y) => {
              const de = (Y.start - N.start) / 30 * T, we = Math.max(30, (Y.end - Y.start) / 30 * T), _e = 100 / Y.laneCount, Fe = we < 104;
              return /* @__PURE__ */ a.jsxs(
                "button",
                {
                  type: "button",
                  className: `pp-session tt-block${Fe ? " is-short" : ""}${Y.conflict ? " is-conflict" : ""}`,
                  style: {
                    top: de,
                    height: we,
                    left: `calc(${Y.lane * _e}% + 3px)`,
                    width: `calc(${_e}% - 6px)`,
                    "--pp-color": Y.color,
                    "--pp-foreground": Y.foreground
                  },
                  "aria-describedby": (v == null ? void 0 : v.session.key) === Y.key ? "pp-course-tooltip" : void 0,
                  onClick: () => i.onOpen(Y.rowKey),
                  onContextMenu: (De) => X(De, Y),
                  onMouseEnter: (De) => K(De.currentTarget, Y),
                  onMouseLeave: () => g(null),
                  onFocus: (De) => K(De.currentTarget, Y),
                  onBlur: () => g(null),
                  children: [
                    /* @__PURE__ */ a.jsx(Vf, { className: "pp-pin", "aria-hidden": "true" }),
                    /* @__PURE__ */ a.jsxs("strong", { children: [
                      Y.code,
                      ": ",
                      /* @__PURE__ */ a.jsx("span", { children: Y.name })
                    ] }),
                    /* @__PURE__ */ a.jsx(ud, { session: Y, compact: Fe }),
                    Y.conflict && /* @__PURE__ */ a.jsxs("span", { className: "pp-conflict", children: [
                      /* @__PURE__ */ a.jsx(Hc, { "aria-hidden": "true" }),
                      i.labels.conflict
                    ] }),
                    /* @__PURE__ */ a.jsx($c, { className: "pp-more", "aria-hidden": "true" })
                  ]
                },
                Y.key
              );
            })
          ] }, F);
        })
      ] })
    ] }) }) : null,
    !!i.untimed.length && /* @__PURE__ */ a.jsxs("div", { className: "pp-untimed", children: [
      /* @__PURE__ */ a.jsx(Yn, { "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: i.untimed.some((F) => F.special) ? i.labels.special : i.labels.unknown }),
        i.untimed.map((F) => /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx("b", { children: F.code }),
          " · CRN ",
          F.crn,
          " — ",
          F.detail
        ] }, F.key))
      ] })
    ] }),
    u && /* @__PURE__ */ a.jsxs("div", { className: "pp-context tt-context-menu", role: "menu", "aria-label": `${u.session.code} ${i.labels.actions}`, style: { left: u.x, top: u.y }, onPointerDown: (F) => F.stopPropagation(), children: [
      /* @__PURE__ */ a.jsxs("p", { children: [
        /* @__PURE__ */ a.jsx("strong", { children: u.session.code }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          "CRN ",
          u.session.crn
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("button", { type: "button", role: "menuitem", "data-act": "open", onClick: () => {
        i.onOpen(u.session.rowKey), p(null);
      }, children: [
        /* @__PURE__ */ a.jsx(on, {}),
        i.labels.details
      ] }),
      /* @__PURE__ */ a.jsxs("button", { type: "button", role: "menuitem", "data-act": "copy-crn", onClick: () => {
        i.onCopyCrn(u.session.rowKey), p(null);
      }, children: [
        /* @__PURE__ */ a.jsx(ma, {}),
        i.labels.copyCrn
      ] }),
      /* @__PURE__ */ a.jsxs("button", { type: "button", role: "menuitem", "data-act": "open-obs", onClick: () => {
        i.onOpenObs(u.session.rowKey), p(null);
      }, children: [
        /* @__PURE__ */ a.jsx(ja, {}),
        i.labels.openObs
      ] }),
      /* @__PURE__ */ a.jsxs("button", { type: "button", role: "menuitem", "data-act": "remove", className: "is-danger", onClick: () => {
        i.onRemove(u.session.rowKey), p(null);
      }, children: [
        /* @__PURE__ */ a.jsx(xa, {}),
        i.labels.remove
      ] })
    ] }),
    v && /* @__PURE__ */ a.jsxs("div", { id: "pp-course-tooltip", className: "pp-tooltip", role: "tooltip", style: { left: v.x, top: v.y }, "data-side": v.side, children: [
      /* @__PURE__ */ a.jsxs("div", { className: "pp-tooltip-title", children: [
        /* @__PURE__ */ a.jsx("span", { style: { background: v.session.color } }),
        /* @__PURE__ */ a.jsx("strong", { children: v.session.code }),
        /* @__PURE__ */ a.jsxs("b", { children: [
          Pr(v.session.start),
          "–",
          Pr(v.session.end)
        ] })
      ] }),
      /* @__PURE__ */ a.jsx("p", { children: v.session.name }),
      /* @__PURE__ */ a.jsxs("dl", { children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("dt", { children: /* @__PURE__ */ a.jsx(Sa, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ a.jsx("dd", { children: v.session.crn })
        ] }),
        v.session.instructor && /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("dt", { children: /* @__PURE__ */ a.jsx(mr, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ a.jsx("dd", { children: v.session.instructor })
        ] }),
        v.session.where && /* @__PURE__ */ a.jsxs("div", { children: [
          /* @__PURE__ */ a.jsx("dt", { children: /* @__PURE__ */ a.jsx(Zn, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ a.jsx("dd", { children: v.session.where })
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
function dd({ html: i, empty: c, emptyMessage: u, ariaLabel: p }) {
  const v = W.useRef(null), g = W.useRef(null), x = W.useRef(null), [j, S] = W.useState(null);
  W.useLayoutEffect(() => {
    const b = v.current;
    if (!b) return;
    [...b.querySelectorAll("select.dp-grade")].forEach((L, X) => {
      var q, ee;
      L.hidden = !0, L.tabIndex = -1;
      const K = document.createElement("button");
      K.type = "button", K.className = `cp-grade-trigger${L.value ? " filled" : ""}`, K.dataset.gradeIndex = String(X), K.setAttribute("aria-haspopup", "listbox"), K.setAttribute("aria-expanded", "false"), K.setAttribute("aria-label", L.getAttribute("aria-label") || "Not seç");
      const F = document.createElement("span");
      F.textContent = ((q = L.selectedOptions[0]) == null ? void 0 : q.textContent) || ((ee = L.options[0]) == null ? void 0 : ee.textContent) || "—", K.appendChild(F), K.insertAdjacentHTML("beforeend", '<svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'), L.insertAdjacentElement("afterend", K);
    });
  }, [i]), W.useEffect(() => S(null), [i]), W.useEffect(() => {
    if (!j) return;
    const b = (q) => {
      var Y, de;
      const ee = q.target;
      (Y = x.current) != null && Y.contains(ee) || (de = g.current) != null && de.contains(ee) || S(null);
    }, C = () => S(null);
    window.addEventListener("pointerdown", b);
    const L = window.matchMedia("(min-width: 561px)").matches;
    let X = !1, K = !1;
    const F = requestAnimationFrame(() => {
      L && (window.addEventListener("scroll", C, !0), X = !0), window.addEventListener("resize", C), K = !0;
    });
    return j.keyboard && requestAnimationFrame(() => {
      var q, ee;
      return (ee = (q = x.current) == null ? void 0 : q.querySelector('[aria-selected="true"]')) == null ? void 0 : ee.focus({ preventScroll: !0 });
    }), () => {
      cancelAnimationFrame(F), window.removeEventListener("pointerdown", b), X && window.removeEventListener("scroll", C, !0), K && window.removeEventListener("resize", C);
    };
  }, [j]);
  const N = (b, C = !1) => {
    var de, we;
    const L = Number(b.dataset.gradeIndex), X = (de = v.current) == null ? void 0 : de.querySelectorAll("select.dp-grade")[L];
    if (!X) return;
    const K = b.getBoundingClientRect(), F = 246, q = window.innerHeight - K.bottom < F && K.top > F, ee = Math.min(292, window.innerWidth - 20), Y = Math.max(10, Math.min(K.right - ee, window.innerWidth - ee - 10));
    (we = g.current) == null || we.setAttribute("aria-expanded", "false"), g.current = b, b.setAttribute("aria-expanded", "true"), console.log("[dbg] setMenu called", L), S({
      selectIndex: L,
      options: [...X.options].map((_e) => ({ value: _e.value, label: _e.textContent || _e.value })),
      value: X.value,
      label: X.getAttribute("aria-label") || "Not seç",
      x: Y,
      y: q ? K.top - 7 : K.bottom + 7,
      above: q,
      keyboard: C
    });
  }, T = (b) => {
    const C = b.target.closest(".cp-grade-trigger");
    if (C) {
      if (b.preventDefault(), C === g.current && j) {
        C.setAttribute("aria-expanded", "false"), S(null);
        return;
      }
      N(C);
    }
  }, V = (b) => {
    var L;
    if (b.key === "Escape" && j) {
      b.preventDefault(), (L = g.current) == null || L.setAttribute("aria-expanded", "false"), S(null);
      return;
    }
    const C = b.target.closest(".cp-grade-trigger");
    !C || !["Enter", " ", "ArrowDown", "ArrowUp"].includes(b.key) || (b.preventDefault(), N(C, !0));
  }, I = (b) => {
    var F, q, ee, Y, de;
    if (!j) return;
    const C = (F = v.current) == null ? void 0 : F.querySelectorAll("select.dp-grade")[j.selectIndex];
    if (!C) return;
    C.value = b, C.dispatchEvent(new Event("change", { bubbles: !0 }));
    const L = ((q = C.selectedOptions[0]) == null ? void 0 : q.textContent) || ((ee = C.options[0]) == null ? void 0 : ee.textContent) || "—", X = g.current, K = X == null ? void 0 : X.querySelector("span");
    K && (K.textContent = L), X == null || X.classList.toggle("filled", !!b), (Y = g.current) == null || Y.setAttribute("aria-expanded", "false"), (de = g.current) == null || de.focus(), S(null);
  }, J = (b) => {
    var K, F, q;
    if (b.key === "Escape") {
      b.preventDefault(), (K = g.current) == null || K.setAttribute("aria-expanded", "false"), (F = g.current) == null || F.focus(), S(null);
      return;
    }
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(b.key)) return;
    b.preventDefault();
    const C = [...b.currentTarget.querySelectorAll('[role="option"]')], L = Math.max(0, C.indexOf(document.activeElement)), X = b.key === "ArrowDown" || b.key === "ArrowRight" ? 1 : -1;
    (q = C[(L + X + C.length) % C.length]) == null || q.focus();
  };
  return c ? /* @__PURE__ */ a.jsxs("div", { className: "curriculum-plan-root cp-empty", role: "status", children: [
    /* @__PURE__ */ a.jsx(Ca, { "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsx("strong", { children: u })
  ] }) : /* @__PURE__ */ a.jsxs("section", { className: "curriculum-plan-root", "aria-label": p, onClick: T, onKeyDown: V, children: [
    /* @__PURE__ */ a.jsx("div", { ref: v, className: "cp-semester-grid", dangerouslySetInnerHTML: { __html: i } }),
    j && /* @__PURE__ */ a.jsx(
      "div",
      {
        ref: x,
        className: `cp-grade-menu${j.above ? " above" : ""}`,
        role: "listbox",
        "aria-label": j.label,
        style: { "--cp-menu-x": `${j.x}px`, "--cp-menu-y": `${j.y}px` },
        onKeyDown: J,
        children: j.options.map((b) => /* @__PURE__ */ a.jsxs(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": b.value === j.value,
            className: b.value ? "" : "is-empty",
            onClick: () => I(b.value),
            children: [
              /* @__PURE__ */ a.jsx("span", { children: b.label }),
              b.value === j.value && /* @__PURE__ */ a.jsx(Lf, { "aria-hidden": "true" })
            ]
          },
          b.value || "empty"
        ))
      }
    )
  ] });
}
function Hm() {
  const i = "(max-width: 700px)", [c, u] = W.useState(() => window.matchMedia(i).matches);
  return W.useEffect(() => {
    const p = window.matchMedia(i), v = () => u(p.matches);
    return p.addEventListener("change", v), () => p.removeEventListener("change", v);
  }, []), c;
}
function Um({ message: i }) {
  return /* @__PURE__ */ a.jsxs("div", { className: "ex-empty", children: [
    /* @__PURE__ */ a.jsx(Ca, { "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsx("strong", { children: i })
  ] });
}
function Vm({ props: i }) {
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
          /* @__PURE__ */ a.jsx(Sa, { "aria-hidden": "true" }),
          c.crn
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ a.jsx(mr, { "aria-hidden": "true" }),
        c.instructor || "·"
      ] }),
      /* @__PURE__ */ a.jsx("span", { role: "cell", children: /* @__PURE__ */ a.jsx("em", { className: "ex-type", children: c.type }) }),
      i.showPlace && /* @__PURE__ */ a.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ a.jsx(Zn, { "aria-hidden": "true" }),
        c.place || "·"
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "ex-when", role: "cell", children: [
        /* @__PURE__ */ a.jsxs("strong", { children: [
          /* @__PURE__ */ a.jsx(on, { "aria-hidden": "true" }),
          c.date
        ] }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(Xn, { "aria-hidden": "true" }),
          c.day,
          " ",
          c.time
        ] })
      ] })
    ] }, c.key)) })
  ] });
}
function Bm({ props: i }) {
  const c = W.useMemo(() => {
    const u = [], p = /* @__PURE__ */ new Map();
    return i.rows.forEach((v) => {
      let g = p.get(v.date);
      g || (g = { date: v.date, day: v.day, exams: [] }, p.set(v.date, g), u.push(g)), g.exams.push(v);
    }), u;
  }, [i.rows]);
  return /* @__PURE__ */ a.jsx("div", { className: "ex-agenda", "aria-label": i.ariaLabel, children: c.map((u) => /* @__PURE__ */ a.jsxs("section", { className: "ex-day", children: [
    /* @__PURE__ */ a.jsxs("header", { children: [
      /* @__PURE__ */ a.jsx(on, { "aria-hidden": "true" }),
      /* @__PURE__ */ a.jsx("strong", { children: u.date }),
      /* @__PURE__ */ a.jsx("span", { children: u.day })
    ] }),
    /* @__PURE__ */ a.jsx("div", { children: u.exams.map((p) => /* @__PURE__ */ a.jsxs("article", { className: "ex-card", children: [
      /* @__PURE__ */ a.jsxs("span", { className: "ex-card-time", children: [
        /* @__PURE__ */ a.jsx(Xn, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsx("b", { children: p.time })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "ex-card-main", children: [
        /* @__PURE__ */ a.jsx("button", { type: "button", onClick: () => i.onOpen(p.code), children: p.code }),
        /* @__PURE__ */ a.jsx("strong", { children: p.name }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(Yn, { "aria-hidden": "true" }),
          p.type,
          /* @__PURE__ */ a.jsx("i", { "aria-hidden": "true" }),
          "CRN ",
          p.crn
        ] }),
        p.instructor && /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(mr, { "aria-hidden": "true" }),
          p.instructor
        ] }),
        i.showPlace && p.place && /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(Zn, { "aria-hidden": "true" }),
          p.place
        ] })
      ] })
    ] }, p.key)) })
  ] }, u.date)) });
}
function pd(i) {
  const c = Hm();
  return /* @__PURE__ */ a.jsx("section", { className: "dersler-table-root exams-list-root", children: i.rows.length ? c ? /* @__PURE__ */ a.jsx(Bm, { props: i }) : /* @__PURE__ */ a.jsx(Vm, { props: i }) : /* @__PURE__ */ a.jsx(Um, { message: i.emptyMessage }) });
}
function fd({ items: i, labels: c, onOpen: u, onCopy: p, onOpenObs: v, onRemove: g, onReorder: x }) {
  const [j, S] = W.useState(null), [N, T] = W.useState(null), [V, I] = W.useState(null);
  if (!i.length) return /* @__PURE__ */ a.jsxs("div", { className: "pcl-empty empty", children: [
    /* @__PURE__ */ a.jsx(fo, { "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsx("strong", { children: c.empty })
  ] });
  const J = (b, C) => {
    b.preventDefault(), N !== null && N !== C && x(N, C), T(null), I(null);
  };
  return /* @__PURE__ */ a.jsxs("div", { className: "pcl-list", role: "table", onKeyDown: (b) => {
    b.key === "Escape" && S(null);
  }, children: [
    /* @__PURE__ */ a.jsxs("div", { className: "pcl-head p-list-head", role: "row", children: [
      /* @__PURE__ */ a.jsx("span", { role: "columnheader", children: c.course }),
      /* @__PURE__ */ a.jsx("span", { role: "columnheader", children: c.quota })
    ] }),
    i.map((b, C) => /* @__PURE__ */ a.jsxs(
      "article",
      {
        className: `pcl-item p-item${b.full ? " is-full" : ""}${N === C ? " is-dragging" : ""}${V === C && N !== null && N !== C ? " is-drop-target" : ""}`,
        role: "row",
        draggable: !0,
        onDragStart: () => T(C),
        onDragOver: (L) => {
          L.preventDefault(), V !== C && I(C);
        },
        onDragEnd: () => {
          T(null), I(null);
        },
        onDrop: (L) => J(L, C),
        onClick: (L) => {
          L.target.closest("button") || u(b.key);
        },
        children: [
          /* @__PURE__ */ a.jsx($f, { className: "pcl-grip", "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsxs("div", { className: "pcl-course", role: "cell", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "pcl-title", children: [
              /* @__PURE__ */ a.jsx("strong", { className: "p-code", children: b.code }),
              b.badge && /* @__PURE__ */ a.jsx("span", { children: b.badge })
            ] }),
            /* @__PURE__ */ a.jsx("p", { children: b.name }),
            /* @__PURE__ */ a.jsxs("div", { className: "pcl-meta", children: [
              /* @__PURE__ */ a.jsxs("span", { className: "p-when", children: [
                /* @__PURE__ */ a.jsx(Xn, { "aria-hidden": "true" }),
                b.when
              ] }),
              /* @__PURE__ */ a.jsxs("span", { children: [
                /* @__PURE__ */ a.jsx(mr, { "aria-hidden": "true" }),
                b.instructor
              ] })
            ] }),
            b.credit && /* @__PURE__ */ a.jsx("small", { children: b.credit })
          ] }),
          /* @__PURE__ */ a.jsxs("div", { className: "pcl-numbers p-crn", role: "cell", children: [
            /* @__PURE__ */ a.jsx("b", { children: b.quota }),
            /* @__PURE__ */ a.jsxs("span", { children: [
              "CRN ",
              b.crn
            ] }),
            b.backup && /* @__PURE__ */ a.jsx("em", { children: b.backup })
          ] }),
          /* @__PURE__ */ a.jsx("button", { className: "pcl-remove p-remove", type: "button", onClick: () => g(b.key), "aria-label": `${b.code} ${c.remove}`, children: /* @__PURE__ */ a.jsx(xa, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ a.jsxs("div", { className: "pcl-menu-wrap", children: [
            /* @__PURE__ */ a.jsxs("button", { className: "pcl-menu-trigger p-menu", type: "button", "aria-expanded": j === b.key, "aria-haspopup": "menu", onClick: () => S(j === b.key ? null : b.key), children: [
              /* @__PURE__ */ a.jsx($c, { "aria-hidden": "true" }),
              /* @__PURE__ */ a.jsxs("span", { className: "sr-only", children: [
                b.code,
                " ",
                c.actions
              ] })
            ] }),
            j === b.key && /* @__PURE__ */ a.jsxs("div", { className: "pcl-menu p-menu-pop", role: "menu", children: [
              /* @__PURE__ */ a.jsxs("button", { role: "menuitem", onClick: () => {
                u(b.key), S(null);
              }, children: [
                /* @__PURE__ */ a.jsx(fo, {}),
                c.details
              ] }),
              /* @__PURE__ */ a.jsxs("button", { role: "menuitem", "data-act": "copy-crn", onClick: () => {
                p(b.key, "crn"), S(null);
              }, children: [
                /* @__PURE__ */ a.jsx(ma, {}),
                c.copyCrn
              ] }),
              /* @__PURE__ */ a.jsxs("button", { role: "menuitem", "data-act": "copy-code", onClick: () => {
                p(b.key, "code"), S(null);
              }, children: [
                /* @__PURE__ */ a.jsx(ma, {}),
                c.copyCode
              ] }),
              b.instructor && /* @__PURE__ */ a.jsxs("button", { role: "menuitem", "data-act": "copy-instructor", onClick: () => {
                p(b.key, "instructor"), S(null);
              }, children: [
                /* @__PURE__ */ a.jsx(mr, {}),
                c.copyInstructor
              ] }),
              /* @__PURE__ */ a.jsxs("button", { role: "menuitem", onClick: () => {
                v(b.key), S(null);
              }, children: [
                /* @__PURE__ */ a.jsx(ja, {}),
                c.openObs
              ] }),
              /* @__PURE__ */ a.jsxs("button", { role: "menuitem", "data-act": "remove", className: "is-danger", onClick: () => {
                g(b.key), S(null);
              }, children: [
                /* @__PURE__ */ a.jsx(xa, {}),
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
const Wm = { overview: fo, sections: Hf, catalog: Uf, history: ga };
function qm({ data: i }) {
  const [c, u] = W.useState("required"), p = [
    { key: "required", label: i.requiredLabel, icon: Ff },
    { key: "unlocks", label: i.unlocksLabel, icon: Wf }
  ], v = (g, x) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(g.key)) return;
    g.preventDefault();
    const j = g.key === "Home" ? 0 : g.key === "End" ? p.length - 1 : (x + (g.key === "ArrowRight" ? 1 : -1) + p.length) % p.length;
    u(p[j].key), requestAnimationFrame(() => {
      var S;
      return (S = document.getElementById(`cdr-req-tab-${p[j].key}`)) == null ? void 0 : S.focus();
    });
  };
  return /* @__PURE__ */ a.jsxs("section", { className: "cdr-prereq", "aria-label": `${i.requiredLabel} / ${i.unlocksLabel}`, children: [
    /* @__PURE__ */ a.jsx("nav", { className: "cdr-prereq-tabs", role: "tablist", children: p.map((g, x) => {
      const j = g.icon;
      return /* @__PURE__ */ a.jsxs("button", { type: "button", role: "tab", id: `cdr-req-tab-${g.key}`, "aria-controls": `cdr-req-panel-${g.key}`, "aria-selected": c === g.key, tabIndex: c === g.key ? 0 : -1, onClick: () => u(g.key), onKeyDown: (S) => v(S, x), children: [
        /* @__PURE__ */ a.jsx(j, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsx("span", { children: g.label }),
        g.key === "unlocks" && /* @__PURE__ */ a.jsx("b", { "data-req-count": !0, children: "…" })
      ] }, g.key);
    }) }),
    /* @__PURE__ */ a.jsxs("div", { className: "cdr-prereq-body", children: [
      /* @__PURE__ */ a.jsx("div", { role: "tabpanel", id: "cdr-req-panel-required", "aria-labelledby": "cdr-req-tab-required", hidden: c !== "required", children: /* @__PURE__ */ a.jsx("div", { className: "d-req-fwd", "data-code": i.code, children: /* @__PURE__ */ a.jsx("p", { className: "empty", children: i.loading }) }) }),
      /* @__PURE__ */ a.jsx("div", { role: "tabpanel", id: "cdr-req-panel-unlocks", "aria-labelledby": "cdr-req-tab-unlocks", hidden: c !== "unlocks", children: /* @__PURE__ */ a.jsx("div", { className: "d-req-by", "data-code": i.code, children: /* @__PURE__ */ a.jsx("p", { className: "empty", children: i.loading }) }) })
    ] })
  ] });
}
function Qm({ history: i }) {
  var S;
  const [c, u] = W.useState(!1), [p, v] = W.useState(((S = i.terms[i.terms.length - 1]) == null ? void 0 : S.slug) || "");
  if (!i.terms.length) return /* @__PURE__ */ a.jsxs("div", { className: "cdr-history-empty", children: [
    /* @__PURE__ */ a.jsx(ga, { "aria-hidden": "true" }),
    /* @__PURE__ */ a.jsx("strong", { children: i.heading }),
    /* @__PURE__ */ a.jsx("p", { children: i.empty })
  ] });
  const g = c ? i.terms : i.terms.slice(-8), x = i.terms.find((N) => N.slug === p) || g[g.length - 1], j = Math.max(1, ...g.map((N) => N.capacity));
  return /* @__PURE__ */ a.jsxs("div", { className: "cdr-history", children: [
    /* @__PURE__ */ a.jsxs("header", { className: "cdr-history-head", children: [
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("h4", { children: i.heading }),
        /* @__PURE__ */ a.jsx("p", { children: i.caption })
      ] }),
      /* @__PURE__ */ a.jsxs("span", { children: [
        /* @__PURE__ */ a.jsx(ga, { "aria-hidden": "true" }),
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
      /* @__PURE__ */ a.jsx("div", { className: "cdr-history-chart", role: "list", "aria-label": i.heading, children: g.map((N) => /* @__PURE__ */ a.jsxs("button", { type: "button", role: "listitem", className: `cdr-history-term${x.slug === N.slug ? " is-active" : ""}${N.fill >= 100 ? " is-full" : ""}`, onMouseEnter: () => v(N.slug), onFocus: () => v(N.slug), onClick: () => v(N.slug), "aria-label": `${N.label}, ${i.labels.capacity} ${N.capacity}, ${i.labels.enrolled} ${N.enrolled}, %${N.fill}`, children: [
        /* @__PURE__ */ a.jsxs("span", { className: "cdr-history-bars", children: [
          /* @__PURE__ */ a.jsx("i", { className: "capacity", style: { height: `${Math.max(7, Math.round(N.capacity / j * 100))}%` } }),
          /* @__PURE__ */ a.jsx("i", { className: "enrolled", style: { height: `${Math.max(N.enrolled ? 7 : 0, Math.round(N.enrolled / j * 100))}%` } })
        ] }),
        /* @__PURE__ */ a.jsx("small", { children: N.shortLabel })
      ] }, N.slug)) }),
      /* @__PURE__ */ a.jsxs("figcaption", { className: "cdr-history-caption", children: [
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(Pf, { "aria-hidden": "true" }),
          /* @__PURE__ */ a.jsx("b", { children: x.label })
        ] }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          i.labels.capacity,
          " ",
          /* @__PURE__ */ a.jsx("b", { children: x.capacity })
        ] }),
        /* @__PURE__ */ a.jsxs("span", { children: [
          i.labels.enrolled,
          " ",
          /* @__PURE__ */ a.jsx("b", { children: x.enrolled })
        ] }),
        /* @__PURE__ */ a.jsxs("strong", { children: [
          "%",
          x.fill
        ] })
      ] }),
      i.terms.length > 8 && /* @__PURE__ */ a.jsx("button", { type: "button", className: "cdr-history-toggle", "aria-expanded": c, onClick: () => u(!c), children: c ? i.labels.showRecent : i.labels.showAll })
    ] }),
    /* @__PURE__ */ a.jsxs("details", { className: "cdr-history-records d-history-records", children: [
      /* @__PURE__ */ a.jsxs("summary", { children: [
        /* @__PURE__ */ a.jsxs("span", { children: [
          /* @__PURE__ */ a.jsx(Gf, { "aria-hidden": "true" }),
          i.labels.records
        ] }),
        /* @__PURE__ */ a.jsx("b", { children: i.recordCount }),
        /* @__PURE__ */ a.jsx(Fc, { "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "cdr-history-record-list htable", children: [...i.terms].reverse().map((N) => /* @__PURE__ */ a.jsxs("section", { children: [
        /* @__PURE__ */ a.jsxs("header", { children: [
          /* @__PURE__ */ a.jsx("strong", { children: N.label }),
          /* @__PURE__ */ a.jsxs("span", { children: [
            N.enrolled,
            " / ",
            N.capacity,
            " · %",
            N.fill
          ] })
        ] }),
        N.rows.map((T, V) => /* @__PURE__ */ a.jsxs("div", { className: "cdr-history-record", children: [
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
        ] }, `${N.slug}-${T.instructor}-${V}`))
      ] }, N.slug)) })
    ] })
  ] });
}
function Gm(i) {
  const [c, u] = W.useState(i.active), [p, v] = W.useState(!1), g = (x, j) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(x.key)) return;
    x.preventDefault();
    const S = x.key === "Home" ? 0 : x.key === "End" ? i.panels.length - 1 : (j + (x.key === "ArrowRight" ? 1 : -1) + i.panels.length) % i.panels.length;
    u(i.panels[S].key), requestAnimationFrame(() => {
      var N;
      return (N = document.getElementById(`d-tab-${i.panels[S].key}`)) == null ? void 0 : N.focus();
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
          i.meta.map((x) => /* @__PURE__ */ a.jsx("span", { className: "d-pill", children: x }, x)),
          i.specialKind && /* @__PURE__ */ a.jsxs("span", { className: `cdr-kind ${i.specialKind}`, children: [
            i.specialKind === "extra-exam" ? /* @__PURE__ */ a.jsx(ha, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(Yn, { "aria-hidden": "true" }),
            i.specialLabel
          ] })
        ] })
      ] }),
      i.obsLink && /* @__PURE__ */ a.jsxs("a", { className: "cdr-obs d-obs", href: i.obsLink, target: "_blank", rel: "noopener", children: [
        /* @__PURE__ */ a.jsx(ja, { "aria-hidden": "true" }),
        i.obsLabel
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("nav", { className: "cdr-tabs d-tabs", role: "tablist", "aria-label": i.tabLabel, children: i.panels.map((x, j) => {
      const S = Wm[x.key] || fo;
      return /* @__PURE__ */ a.jsxs("button", { type: "button", role: "tab", id: `d-tab-${x.key}`, "data-dtab": x.key, "aria-controls": `d-panel-${x.key}`, "aria-selected": c === x.key, tabIndex: c === x.key ? 0 : -1, onClick: () => u(x.key), onKeyDown: (N) => g(N, j), children: [
        /* @__PURE__ */ a.jsx(S, { "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsx("span", { children: x.label }),
        x.count !== void 0 && /* @__PURE__ */ a.jsx("b", { children: x.count })
      ] }, x.key);
    }) }),
    /* @__PURE__ */ a.jsx("div", { className: "cdr-panels d-panels", children: i.panels.map((x) => {
      var j, S, N;
      return /* @__PURE__ */ a.jsx("section", { role: "tabpanel", id: `d-panel-${x.key}`, "aria-labelledby": `d-tab-${x.key}`, "data-dpanel": x.key, hidden: c !== x.key, children: x.key === "history" && i.history ? /* @__PURE__ */ a.jsx(Qm, { history: i.history }) : x.key === "overview" && i.prerequisite ? /* @__PURE__ */ a.jsxs("div", { className: "cdr-overview", children: [
        x.beforeHtml && /* @__PURE__ */ a.jsx("div", { dangerouslySetInnerHTML: { __html: x.beforeHtml } }),
        /* @__PURE__ */ a.jsx(qm, { data: i.prerequisite }),
        x.afterHtml && /* @__PURE__ */ a.jsx("div", { dangerouslySetInnerHTML: { __html: x.afterHtml } })
      ] }) : x.key === "sections" && ((j = i.sections) != null && j.length) ? /* @__PURE__ */ a.jsxs("div", { className: "cdr-sections", children: [
        /* @__PURE__ */ a.jsxs("header", { className: "cdr-section-heading", children: [
          /* @__PURE__ */ a.jsxs("div", { children: [
            /* @__PURE__ */ a.jsx("h4", { children: i.sectionHeading }),
            /* @__PURE__ */ a.jsx("p", { children: i.sectionCaption })
          ] }),
          /* @__PURE__ */ a.jsx("span", { children: i.sections.length })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: "cdr-section-list", children: i.sections.slice(0, p ? void 0 : 8).map((T) => {
          var V, I, J;
          return /* @__PURE__ */ a.jsxs("article", { className: `cdr-section d-sec${T.focus ? " is-focus" : ""}`, "data-crn": T.crn, children: [
            /* @__PURE__ */ a.jsxs("div", { className: "cdr-section-code", children: [
              /* @__PURE__ */ a.jsx("span", { children: "CRN" }),
              /* @__PURE__ */ a.jsx("strong", { children: T.crn })
            ] }),
            /* @__PURE__ */ a.jsxs("div", { className: "cdr-section-body", children: [
              /* @__PURE__ */ a.jsxs("div", { className: "cdr-section-top", children: [
                /* @__PURE__ */ a.jsxs("button", { type: "button", className: "cdr-instructor d-instr-history", "data-name": T.instructors.join(", "), children: [
                  /* @__PURE__ */ a.jsx(mr, { "aria-hidden": "true" }),
                  T.instructors.join(", ") || "·"
                ] }),
                /* @__PURE__ */ a.jsx("span", { children: T.quota })
              ] }),
              T.meta && /* @__PURE__ */ a.jsxs("p", { className: "cdr-section-meta", children: [
                T.special === "extra-exam" ? /* @__PURE__ */ a.jsx(ha, { "aria-hidden": "true" }) : T.special === "graduation" ? /* @__PURE__ */ a.jsx(Yn, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(_f, { "aria-hidden": "true" }),
                T.meta
              ] }),
              !!T.sessions.length && /* @__PURE__ */ a.jsx("div", { className: "cdr-section-times d-sec-when", children: T.sessions.map((b) => /* @__PURE__ */ a.jsxs("span", { children: [
                /* @__PURE__ */ a.jsx(Xn, { "aria-hidden": "true" }),
                b
              ] }, b)) }),
              T.note && /* @__PURE__ */ a.jsx("small", { children: T.note }),
              !!((V = T.rules) != null && V.length) && /* @__PURE__ */ a.jsxs("details", { className: "cdr-rules", children: [
                /* @__PURE__ */ a.jsxs("summary", { children: [
                  (I = i.labels) == null ? void 0 : I.requirements,
                  /* @__PURE__ */ a.jsx(Fc, { "aria-hidden": "true" })
                ] }),
                T.rules.map((b) => /* @__PURE__ */ a.jsxs("p", { children: [
                  /* @__PURE__ */ a.jsx("b", { children: b.label }),
                  b.value
                ] }, b.label))
              ] })
            ] }),
            /* @__PURE__ */ a.jsxs("button", { type: "button", className: "cdr-add", "data-add-crn": T.crn, onClick: () => {
              var b;
              return (b = i.onAddCrn) == null ? void 0 : b.call(i, T.crn);
            }, children: [
              /* @__PURE__ */ a.jsx(Bf, { "aria-hidden": "true" }),
              (J = i.labels) == null ? void 0 : J.add
            ] })
          ] }, T.crn);
        }) }),
        i.sections.length > 8 && /* @__PURE__ */ a.jsx("button", { type: "button", className: "cdr-more", "aria-expanded": p, onClick: () => v(!p), children: p ? (S = i.labels) == null ? void 0 : S.showLess : `${i.sections.length - 8} ${(N = i.labels) == null ? void 0 : N.showMore}` })
      ] }) : /* @__PURE__ */ a.jsx("div", { dangerouslySetInnerHTML: { __html: x.html } }) }, x.key);
    }) })
  ] });
}
function Km(i) {
  const c = [
    { key: "gpa", label: i.gpaLabel, value: i.gpaValue, hint: i.gpaHint, valueId: "dp-gano", hintId: void 0, Icon: Af },
    { key: "progress", label: i.progressLabel, value: i.progressValue, hint: i.progressHint, valueId: "dp-progress", hintId: "dp-progress-sub", Icon: zf },
    { key: "target", label: i.targetLabel, value: i.targetValue, hint: "", valueId: "dp-target", hintId: "dp-target-sub", Icon: Qf }
  ];
  return /* @__PURE__ */ a.jsx("div", { className: "gpa-summary-grid", children: c.map(
    ({ key: u, label: p, value: v, hint: g, valueId: x, hintId: j, Icon: S }) => /* @__PURE__ */ a.jsxs("article", { className: `gpa-summary-card is-${u}`, children: [
      /* @__PURE__ */ a.jsx("span", { className: "gpa-summary-icon", children: /* @__PURE__ */ a.jsx(S, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ a.jsxs("div", { children: [
        /* @__PURE__ */ a.jsx("em", { children: p }),
        /* @__PURE__ */ a.jsx("b", { id: x, children: v }),
        /* @__PURE__ */ a.jsx("small", { id: j, children: g })
      ] })
    ] }, u)
  ) });
}
function Ym({ termLabel: i, chips: c, emptyMessage: u, removeLabel: p, onRemove: v }) {
  return /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
    /* @__PURE__ */ a.jsx("span", { className: "fc-term", children: i }),
    c.map((g) => /* @__PURE__ */ a.jsxs("span", { className: "fc-pill", children: [
      g.value !== void 0 ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
        /* @__PURE__ */ a.jsx("span", { className: "fc-label", children: g.label }),
        /* @__PURE__ */ a.jsx("span", { className: "fc-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ a.jsx("span", { className: "fc-value", children: g.value })
      ] }) : /* @__PURE__ */ a.jsx("span", { className: "fc-value", children: g.text }),
      /* @__PURE__ */ a.jsx("button", { type: "button", className: "fc-x", "data-key": g.key, "aria-label": p, title: p, onClick: () => v(g.key), children: /* @__PURE__ */ a.jsx(Kf, { "aria-hidden": "true" }) })
    ] }, g.key)),
    u && /* @__PURE__ */ a.jsx("p", { className: "filter-help", children: u })
  ] });
}
function Xm({ terms: i, labels: c }) {
  return /* @__PURE__ */ a.jsx("div", { className: "tg-grid", children: i.map((u, p) => /* @__PURE__ */ a.jsxs(
    "article",
    {
      className: `tg-card reveal${u.missing ? " is-missing" : ""}`,
      style: { transitionDelay: `${Math.min(p, 12) * 25}ms` },
      children: [
        /* @__PURE__ */ a.jsx("div", { className: "tg-icon", "aria-hidden": "true", children: u.missing ? /* @__PURE__ */ a.jsx(Rf, {}) : /* @__PURE__ */ a.jsx(on, {}) }),
        /* @__PURE__ */ a.jsxs("div", { className: "tg-body", children: [
          /* @__PURE__ */ a.jsxs("h3", { children: [
            u.label,
            u.live && /* @__PURE__ */ a.jsx("span", { className: "tg-badge is-live", children: c.live })
          ] }),
          u.missing ? /* @__PURE__ */ a.jsx("p", { className: "tg-meta", children: u.missingReason }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
            /* @__PURE__ */ a.jsx("p", { className: "tg-meta", children: u.meta }),
            u.warn && /* @__PURE__ */ a.jsx("p", { className: "tg-meta is-warn", children: u.warn })
          ] })
        ] }),
        !u.missing && u.csvHref && u.metaHref && /* @__PURE__ */ a.jsxs("div", { className: "tg-links", children: [
          /* @__PURE__ */ a.jsxs("a", { className: "tg-link", href: u.csvHref, download: !0, children: [
            /* @__PURE__ */ a.jsx(Df, { "aria-hidden": "true" }),
            c.csv
          ] }),
          /* @__PURE__ */ a.jsxs("a", { className: "tg-link", href: u.metaHref, children: [
            /* @__PURE__ */ a.jsx(Of, { "aria-hidden": "true" }),
            c.metaJson
          ] })
        ] })
      ]
    },
    u.key
  )) });
}
function Zm({ state: i }) {
  return i === "past" ? /* @__PURE__ */ a.jsx(Tf, { "aria-hidden": "true" }) : i === "now" ? /* @__PURE__ */ a.jsx(If, { "aria-hidden": "true" }) : /* @__PURE__ */ a.jsx(Mf, { "aria-hidden": "true" });
}
function Jm({ groups: i }) {
  return /* @__PURE__ */ a.jsx(a.Fragment, { children: i.map((c) => /* @__PURE__ */ a.jsxs("section", { className: "atl-group reveal", children: [
    /* @__PURE__ */ a.jsx("h3", { children: c.title }),
    /* @__PURE__ */ a.jsx("ol", { className: "atl-list", children: c.events.map((u) => /* @__PURE__ */ a.jsxs("li", { className: `atl-row is-${u.state}`, children: [
      /* @__PURE__ */ a.jsx("span", { className: "atl-icon", children: /* @__PURE__ */ a.jsx(Zm, { state: u.state }) }),
      /* @__PURE__ */ a.jsx("span", { className: "atl-title", children: u.title }),
      /* @__PURE__ */ a.jsx("span", { className: "atl-date", children: u.date }),
      /* @__PURE__ */ a.jsx("span", { className: "atl-left", children: u.left })
    ] }, u.key)) })
  ] }, c.key)) });
}
function Dc({ headingClass: i, label: c, chips: u, onSelect: p }) {
  return u.length ? /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
    /* @__PURE__ */ a.jsx("h3", { className: i, children: c }),
    /* @__PURE__ */ a.jsx("div", { className: "chips", children: u.map((v) => /* @__PURE__ */ a.jsxs("button", { type: "button", className: "chip", onClick: () => p(v), children: [
      /* @__PURE__ */ a.jsx("b", { children: v.code || v.name }),
      v.code && /* @__PURE__ */ a.jsx("span", { children: v.name }),
      /* @__PURE__ */ a.jsx("em", { children: v.sub })
    ] }, v.key)) })
  ] }) : null;
}
function eh({ mode: i, intro: c, courseSectionLabel: u, instructorSectionLabel: p, courses: v, people: g, emptyMessage: x, onSelect: j }) {
  if (i === "empty") return /* @__PURE__ */ a.jsx("p", { className: "empty", children: x });
  const S = i === "discovery" ? "h-disc" : "mh";
  return /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
    c && /* @__PURE__ */ a.jsx("p", { className: "h-intro", children: c }),
    /* @__PURE__ */ a.jsx(Dc, { headingClass: S, label: u, chips: v, onSelect: j }),
    /* @__PURE__ */ a.jsx(Dc, { headingClass: S, label: p, chips: g, onSelect: j })
  ] });
}
function th({ data: i, labels: c, onOpenCourseDetail: u }) {
  return i ? i.kind === "course" ? /* @__PURE__ */ a.jsxs("article", { className: "hcard reveal", children: [
    /* @__PURE__ */ a.jsxs("h3", { children: [
      i.code,
      " ",
      /* @__PURE__ */ a.jsx("span", { children: i.name })
    ] }),
    /* @__PURE__ */ a.jsxs("p", { className: "meta", children: [
      i.openedText,
      " · ",
      i.seasonsLabel,
      " ",
      i.rhythm,
      /* @__PURE__ */ a.jsx("button", { type: "button", className: "btn-ghost h-detail", onClick: () => u(i.code), children: c.detailButton })
    ] }),
    /* @__PURE__ */ a.jsx("div", { dangerouslySetInnerHTML: { __html: i.trendHTML } }),
    /* @__PURE__ */ a.jsx("div", { className: "tablewrap", children: /* @__PURE__ */ a.jsxs("table", { className: "htable", "aria-label": `${i.code} ${c.colTerm}`, children: [
      /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
        /* @__PURE__ */ a.jsx("th", { children: c.colTerm }),
        /* @__PURE__ */ a.jsx("th", { children: c.colInstructor }),
        /* @__PURE__ */ a.jsx("th", { children: c.colDay }),
        /* @__PURE__ */ a.jsx("th", { className: "num", children: c.colCap }),
        /* @__PURE__ */ a.jsx("th", { className: "num", children: c.colEnr }),
        /* @__PURE__ */ a.jsx("th", { className: "num quota-legacy-col", children: c.colFill })
      ] }) }),
      /* @__PURE__ */ a.jsx("tbody", { children: i.rows.map((p) => /* @__PURE__ */ a.jsxs("tr", { children: [
        /* @__PURE__ */ a.jsx("td", { children: p.termLabel }),
        /* @__PURE__ */ a.jsx("td", { children: p.instructor || "·" }),
        /* @__PURE__ */ a.jsx("td", { className: "when", children: p.days || "·" }),
        /* @__PURE__ */ a.jsx("td", { className: "num", children: p.cap }),
        /* @__PURE__ */ a.jsx("td", { className: "num", children: p.enr }),
        /* @__PURE__ */ a.jsx("td", { className: "num quota-legacy-col", dangerouslySetInnerHTML: { __html: p.fillHTML } })
      ] }, p.key)) })
    ] }) })
  ] }) : /* @__PURE__ */ a.jsxs("article", { className: "hcard reveal", children: [
    /* @__PURE__ */ a.jsx("h3", { children: i.name }),
    /* @__PURE__ */ a.jsx("p", { className: "meta", children: i.meta }),
    /* @__PURE__ */ a.jsx("div", { className: "tablewrap", children: /* @__PURE__ */ a.jsxs("table", { className: "htable", "aria-label": `${i.name} ${c.colName}`, children: [
      /* @__PURE__ */ a.jsx("thead", { children: /* @__PURE__ */ a.jsxs("tr", { children: [
        /* @__PURE__ */ a.jsx("th", { children: c.colCode }),
        /* @__PURE__ */ a.jsx("th", { children: c.colName }),
        /* @__PURE__ */ a.jsx("th", { className: "num", children: c.colTermCount }),
        /* @__PURE__ */ a.jsx("th", { children: c.colTerms })
      ] }) }),
      /* @__PURE__ */ a.jsx("tbody", { children: i.rows.map((p) => /* @__PURE__ */ a.jsxs("tr", { children: [
        /* @__PURE__ */ a.jsx("td", { children: /* @__PURE__ */ a.jsx("b", { children: p.code }) }),
        /* @__PURE__ */ a.jsx("td", { children: p.name }),
        /* @__PURE__ */ a.jsx("td", { className: "num", children: p.termCount }),
        /* @__PURE__ */ a.jsx("td", { className: "when", children: p.terms })
      ] }, p.code)) })
    ] }) })
  ] }) : null;
}
const rh = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--sans);font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--mono);font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.dersler-table-root .dt-relative{position:relative}.dersler-table-root .dt--ml-3{margin-left:-.75rem}.dersler-table-root .dt-ml-1\\.5{margin-left:.375rem}.dersler-table-root .dt-inline{display:inline}.dersler-table-root .dt-inline-flex{display:inline-flex}.dersler-table-root .dt-size-3\\.5{width:.875rem;height:.875rem}.dersler-table-root .dt-size-4{width:1rem;height:1rem}.dersler-table-root .dt-h-10{height:2.5rem}.dersler-table-root .dt-h-12{height:3rem}.dersler-table-root .dt-h-9{height:2.25rem}.dersler-table-root .dt-w-8{width:2rem}.dersler-table-root .dt-w-full{width:100%}.dersler-table-root .dt-caption-bottom{caption-side:bottom}.dersler-table-root .dt-cursor-pointer{cursor:pointer}.dersler-table-root .dt-items-center{align-items:center}.dersler-table-root .dt-justify-center{justify-content:center}.dersler-table-root .dt-overflow-auto{overflow:auto}.dersler-table-root .dt-overflow-hidden{overflow:hidden}.dersler-table-root .dt-whitespace-nowrap{white-space:nowrap}.dersler-table-root .dt-rounded-lg{border-radius:var(--radius-card)}.dersler-table-root .dt-rounded-md{border-radius:calc(var(--radius-card) - 2px)}.dersler-table-root .dt-border{border-width:1px}.dersler-table-root .dt-border-b{border-bottom-width:1px}.dersler-table-root .dt-border-border{border-color:var(--hairline)}.dersler-table-root .dt-bg-primary{background-color:var(--acid)}.dersler-table-root .dt-p-2{padding:.5rem}.dersler-table-root .dt-p-4{padding:1rem}.dersler-table-root .dt-p-6{padding:1.5rem}.dersler-table-root .dt-px-3{padding-left:.75rem;padding-right:.75rem}.dersler-table-root .dt-px-4{padding-left:1rem;padding-right:1rem}.dersler-table-root .dt-py-2{padding-top:.5rem;padding-bottom:.5rem}.dersler-table-root .dt-text-left{text-align:left}.dersler-table-root .dt-text-center{text-align:center}.dersler-table-root .dt-text-right{text-align:right}.dersler-table-root .dt-align-middle{vertical-align:middle}.dersler-table-root .dt-font-mono{font-family:var(--mono)}.dersler-table-root .dt-text-base{font-size:1rem;line-height:1.5rem}.dersler-table-root .dt-text-sm{font-size:.875rem;line-height:1.25rem}.dersler-table-root .dt-text-xs{font-size:.75rem;line-height:1rem}.dersler-table-root .dt-font-medium{font-weight:500}.dersler-table-root .dt-tabular-nums{--tw-numeric-spacing: tabular-nums;font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)}.dersler-table-root .dt-leading-none{line-height:1}.dersler-table-root .dt-text-muted-foreground{color:var(--dim)}.dersler-table-root .dt-text-primary-foreground{color:var(--on-accent)}.dersler-table-root .dt-opacity-40{opacity:.4}.dersler-table-root .dt-transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dersler-table-root{font-family:var(--sans);color:var(--fg)}.program-planner-root{--pp-slot: 34px;position:relative;min-width:0}.pp-heading{display:flex;align-items:center;gap:11px;margin:0 0 12px}.pp-heading-icon{display:grid;width:36px;height:36px;place-items:center;flex:0 0 auto;border:1px solid color-mix(in srgb,var(--acid) 34%,var(--line));border-radius:10px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.pp-heading-icon svg{width:18px;height:18px}.pp-heading>span:last-child{display:grid;gap:2px;min-width:0}.pp-heading strong{font-size:14px;letter-spacing:-.01em}.pp-heading small{color:var(--dimmer);font:10px/1.35 var(--mono)}.pp-loading{display:grid;min-height:260px;place-items:center;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2);font:11px/1.4 var(--mono)}.pp-calendar-scroll{max-height:min(69vh,780px);overflow:auto;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);scrollbar-width:thin}.pp-calendar{min-width:760px}.pp-calendar-head,.pp-calendar-body{display:grid;grid-template-columns:62px repeat(var(--pp-days),minmax(130px,1fr))}.pp-calendar-head{position:sticky;top:0;z-index:20;min-height:43px;border-bottom:1px solid var(--hairline-strong);background:var(--panel)}.pp-calendar-head>*{display:grid;place-items:center;border-right:1px solid var(--line)}.pp-calendar-head>span{position:sticky;left:0;z-index:22;background:var(--panel)}.pp-calendar-head b{color:var(--dim);font:700 10px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase}.pp-time-column{position:sticky;left:0;z-index:10;background:var(--panel);box-shadow:1px 0 0 var(--hairline-strong)}.pp-time-column span{display:block;height:var(--pp-slot);padding:5px 9px 0 0;color:var(--dimmer);text-align:right;font:9px/1 var(--mono);transform:translateY(-9px)}.pp-day-column{position:relative;min-width:0;border-right:1px solid var(--line);background-color:color-mix(in srgb,var(--panel) 97%,var(--fg));background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--pp-slot) - 1px),var(--line) calc(var(--pp-slot) - 1px),var(--line) var(--pp-slot))}.pp-day-column.is-weekend{background-color:var(--panel-2)}.pp-session{position:absolute;z-index:2;display:flex;flex-direction:column;gap:5px;overflow:hidden;padding:10px 25px 8px 10px;border:1px solid color-mix(in srgb,var(--pp-foreground) 25%,transparent);border-radius:8px;color:var(--pp-foreground);text-align:left;background:var(--pp-color);box-shadow:0 2px 6px color-mix(in srgb,var(--pp-color) 30%,transparent);cursor:pointer;transition:filter .14s ease,box-shadow .14s ease,transform .14s ease}.pp-session:hover,.pp-session:focus-visible{z-index:6;filter:saturate(1.08) brightness(1.04);box-shadow:0 7px 18px color-mix(in srgb,var(--pp-color) 42%,transparent);transform:translateY(-1px)}.pp-session:focus-visible{outline:3px solid var(--acid);outline-offset:2px}.pp-session.is-conflict{border:2px solid var(--red)}.pp-session.is-short{justify-content:center;padding-block:5px}.pp-session.is-short .pp-session-meta{display:none}.pp-session>strong{display:-webkit-box;overflow:hidden;color:inherit;font:800 11px/1.26 var(--sans);-webkit-box-orient:vertical;-webkit-line-clamp:3}.pp-session>strong span{font-weight:650}.pp-pin,.pp-more{position:absolute;right:7px;width:14px;height:14px;opacity:.75}.pp-pin{top:8px}.pp-more{bottom:7px}.pp-session-meta{display:grid;gap:3px;min-width:0}.pp-session-meta>span,.pp-agenda-detail{display:flex;align-items:center;gap:5px;min-width:0;overflow:hidden;color:inherit;font:9px/1.2 var(--mono);text-overflow:ellipsis;white-space:nowrap}.pp-session-meta svg,.pp-agenda-detail svg{width:11px;height:11px;flex:0 0 auto}.pp-conflict{display:flex;align-items:center;gap:4px;margin-top:auto;font:800 9px/1 var(--mono)}.pp-conflict svg{width:11px;height:11px}.pp-now{position:absolute;z-index:7;right:0;left:0;height:2px;background:var(--acid);pointer-events:none}.pp-now:before{position:absolute;top:-3px;left:-1px;width:8px;height:8px;border-radius:50%;background:var(--acid);content:""}.pp-empty,.pp-empty-day{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2)}.pp-empty svg,.pp-empty-day svg{width:25px;height:25px}.pp-empty strong,.pp-empty-day p{margin:0;font-size:12px}.pp-untimed{display:flex;gap:10px;margin-top:12px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-untimed>svg{width:18px;height:18px;flex:0 0 auto;color:var(--amber)}.pp-untimed>div{display:grid;gap:5px}.pp-untimed strong{font-size:11px}.pp-untimed span{color:var(--dim);font:10px/1.4 var(--mono)}.pp-context{position:fixed;z-index:10010;display:grid;width:224px;overflow:hidden;padding:6px;border:1px solid var(--hairline-strong);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pp-context p{display:grid;gap:2px;margin:0 0 4px;padding:8px 9px;border-bottom:1px solid var(--line)}.pp-context p strong{font-size:12px}.pp-context p span{color:var(--dimmer);font:9px/1 var(--mono)}.pp-context button{display:flex;align-items:center;gap:9px;width:100%;padding:8px 9px;border:0;border-radius:6px;color:var(--fg);text-align:left;background:transparent;font:11px/1.2 var(--sans)}.pp-context button:hover,.pp-context button:focus-visible{background:var(--panel-2)}.pp-context button.is-danger{color:var(--red)}.pp-context button svg{width:14px;height:14px}.pp-agenda{min-width:0}.pp-day-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:12px;padding:4px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-day-tabs button{position:relative;min-width:0;min-height:38px;border:0;border-radius:7px;color:var(--dim);background:transparent;font:700 10px/1 var(--mono)}.pp-day-tabs button.is-active{color:var(--panel);background:var(--fg)}.pp-day-tabs button>span{position:absolute;bottom:5px;left:50%;width:3px;height:3px;border-radius:50%;background:var(--acid)}.pp-agenda-list{display:grid;gap:8px}.pp-agenda-card{--pp-color: var(--cyan);display:grid;grid-template-columns:54px minmax(0,1fr);gap:12px;width:100%;padding:13px;border:1px solid var(--line);border-radius:11px;color:var(--fg);text-align:left;background:var(--panel);box-shadow:inset 4px 0 0 var(--pp-color)}.pp-agenda-card.is-conflict{border-color:var(--red)}.pp-agenda-time{display:grid;align-content:start;gap:3px;font:11px/1 var(--mono)}.pp-agenda-time small{color:var(--dimmer);font-size:9px}.pp-agenda-copy{display:grid;gap:5px;min-width:0}.pp-agenda-copy>strong{display:flex;align-items:center;gap:7px;font-size:13px}.pp-color-dot{width:7px;height:7px;border-radius:50%;background:var(--pp-color)}.pp-agenda-name{color:var(--dim);font-size:12px}.pp-agenda-copy em{display:flex;align-items:center;gap:5px;color:var(--red);font:700 10px/1 var(--mono)}.pp-agenda-copy em svg{width:12px;height:12px}.pp-empty-day{min-height:150px}.curriculum-plan-root{min-width:0;color:var(--fg);font-family:var(--sans)}.dp-semesters.dp-react{display:block}.cp-semester-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;align-items:stretch}.curriculum-plan-root .dp-sem{min-width:0;overflow:hidden;padding:0;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);height:100%}.curriculum-plan-root .dp-sem-head{position:relative;min-height:58px;margin:0;padding:13px 43px 12px 15px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);cursor:pointer}.curriculum-plan-root .dp-sem-head>span:first-child{font-size:15px;font-weight:750;letter-spacing:-.015em}.curriculum-plan-root .dp-sem-head:after{position:absolute;top:50%;right:17px;width:8px;height:8px;margin:-6px 0 0;border-right:1.5px solid var(--dim);border-bottom:1.5px solid var(--dim);content:"";transform:rotate(45deg);transition:transform .16s ease}@media(prefers-reduced-motion:reduce){.curriculum-plan-root .dp-sem-head:after{transition:none}}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head{margin:0;padding:13px 43px 12px 15px;border:0}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head:after{margin-top:-2px;transform:rotate(-45deg)}.curriculum-plan-root .dp-load{color:var(--dim);font:10px/1.25 var(--mono)}.curriculum-plan-root .dp-sem-avg{margin-left:auto;color:var(--acid);font:700 10px/1.25 var(--mono);white-space:nowrap}.curriculum-plan-root .dp-colhead{min-height:31px;margin:0 14px;padding:6px 0;border-bottom:1px solid var(--line);font-size:9px;letter-spacing:.06em}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin:0 14px;padding:0;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent}.curriculum-plan-root .dp-course:last-child,.curriculum-plan-root .dp-elective:last-child{border-bottom:0}.curriculum-plan-root .dp-row,.curriculum-plan-root .dp-colhead{grid-template-columns:32px minmax(0,1fr) 34px 94px 58px;-moz-column-gap:10px;column-gap:10px}.curriculum-plan-root .dp-row{min-height:52px;padding:8px 0}.curriculum-plan-root .dp-repeat-btn,.curriculum-plan-root .dp-repeat-cell{justify-self:center}.curriculum-plan-root .dp-credit{min-width:29px;height:24px;padding:0 5px;border-color:color-mix(in srgb,var(--acid) 28%,var(--line));border-radius:7px;color:var(--acid);background:color-mix(in srgb,var(--acid) 7%,var(--panel));font-size:10px}.curriculum-plan-root .dp-title{display:grid;gap:2px}.curriculum-plan-root .dp-code{width:-moz-fit-content;width:fit-content;color:var(--cyan);font:750 12px/1.25 var(--mono)}.curriculum-plan-root .dp-name{overflow:hidden;color:var(--dim);font-size:11px;line-height:1.3;text-overflow:ellipsis}.curriculum-plan-root .dp-repeat-btn{color:var(--dimmer)}.curriculum-plan-root .dp-repeat-btn svg{display:block}.curriculum-plan-root .dp-repeat-btn.on{color:var(--amber);background:color-mix(in srgb,var(--amber) 8%,transparent)}.curriculum-plan-root .dp-grade-wrap{width:94px;min-height:35px;justify-content:flex-end;border-radius:7px}.curriculum-plan-root .dp-grade{border-radius:5px;font-family:var(--mono)}.curriculum-plan-root .cp-grade-trigger{position:relative;display:inline-flex;align-items:center;justify-content:space-between;gap:7px;min-width:65px;min-height:31px;padding:5px 8px;border:1px solid var(--line);border-radius:7px;color:var(--dim);background:var(--panel);font:700 10px/1 var(--mono);cursor:pointer;transition:border-color .14s ease,background-color .14s ease,color .14s ease}.curriculum-plan-root .dp-sec-btn{width:58px;justify-content:center;text-align:center}.dt-course-name{display:flex;min-width:0;align-items:center;gap:8px}.dt-course-name>span{min-width:0}.dt-kind-badge{display:inline-flex;flex:0 0 auto;align-items:center;gap:5px;min-height:24px;padding:4px 7px;border:1px solid color-mix(in srgb,var(--acid) 42%,var(--line));border-radius:7px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel));font:700 9px/1 var(--sans);white-space:nowrap}.dt-kind-badge svg{width:12px;height:12px}.dt-kind-badge.graduation{border-color:color-mix(in srgb,var(--cyan) 42%,var(--line));color:var(--cyan);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.curriculum-plan-root .cp-grade-trigger:hover,.curriculum-plan-root .cp-grade-trigger[aria-expanded=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel))}.curriculum-plan-root .cp-grade-trigger.filled{border-color:color-mix(in srgb,var(--acid) 58%,var(--line));color:var(--fg)}.curriculum-plan-root .cp-grade-trigger svg{width:13px;height:13px;flex:0 0 auto;transition:transform .14s ease}.curriculum-plan-root .cp-grade-trigger[aria-expanded=true] svg{transform:rotate(180deg)}@media(prefers-reduced-motion:reduce){.curriculum-plan-root .cp-grade-trigger svg{transition:none}}.cp-grade-menu{position:fixed;z-index:10020;top:var(--cp-menu-y);left:var(--cp-menu-x);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;width:292px;max-width:calc(100vw - 20px);padding:8px;border:1px solid var(--hairline-strong);border-radius:11px;background:var(--panel);box-shadow:var(--shadow-float)}.cp-grade-menu.above{transform:translateY(-100%)}.cp-grade-menu button{position:relative;display:flex;align-items:center;justify-content:center;min-width:0;min-height:34px;padding:6px;border:1px solid transparent;border-radius:7px;color:var(--dim);background:var(--panel-2);font:700 10px/1 var(--mono);cursor:pointer}.cp-grade-menu button:hover,.cp-grade-menu button:focus-visible{border-color:var(--cyan);color:var(--fg);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.cp-grade-menu button[aria-selected=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 12%,var(--panel))}.cp-grade-menu button.is-empty{grid-column:1 / -1;justify-content:flex-start;padding-inline:10px}.cp-grade-menu button svg{position:absolute;top:50%;right:6px;width:12px;height:12px;color:var(--acid);transform:translateY(-50%)}.curriculum-plan-root .dp-grade-clear svg{display:block}.curriculum-plan-root .dp-sec-btn.open{padding:5px 8px;border:1px solid color-mix(in srgb,var(--cyan) 28%,var(--line));border-radius:7px;background:color-mix(in srgb,var(--cyan) 6%,var(--panel));font:650 10px/1 var(--sans);text-decoration:none}.curriculum-plan-root .dp-sec-btn.open:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-sec-btn.closed{font-size:10px}.curriculum-plan-root .dp-secslot{margin:0;padding:10px 0 12px;border-top:1px dashed var(--line)}.curriculum-plan-root .dp-section{min-height:31px}.curriculum-plan-root .dp-actions button{min-height:28px;padding:3px 7px;border:1px solid var(--line);border-radius:6px}.curriculum-plan-root .dp-actions button:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-elective{background:color-mix(in srgb,var(--acid) 3%,transparent)}.curriculum-plan-root .dp-elective-name{color:var(--dim);font-size:11px}.curriculum-plan-root .dp-epick{min-height:31px;border-radius:7px;background:var(--panel)}.cp-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.cp-empty svg{width:24px;height:24px}.cp-empty strong{font-size:12px}.exams-list-root{min-width:0;color:var(--fg);font-family:var(--sans)}.ex-table{overflow:hidden;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-head,.ex-row{display:grid;grid-template-columns:minmax(230px,1.45fr) minmax(145px,.9fr) minmax(105px,.62fr) minmax(170px,1fr) minmax(190px,1.05fr);align-items:center;gap:14px}.ex-head{min-height:36px;padding:8px 15px;color:var(--dimmer);border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);font:750 9px/1 var(--mono);letter-spacing:.055em;text-transform:uppercase}.ex-row{min-height:72px;padding:11px 15px;border-bottom:1px solid var(--line);transition:background-color .14s ease}.ex-row:last-child{border-bottom:0}.ex-row:hover{background:color-mix(in srgb,var(--cyan) 3%,var(--panel))}.ex-row.without-place{grid-template-columns:minmax(230px,1.5fr) minmax(155px,1fr) minmax(115px,.7fr) minmax(200px,1fr)}.ex-course{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:baseline;gap:3px 9px;min-width:0}.ex-course button,.ex-card-main button{width:-moz-fit-content;width:fit-content;padding:0;border:0;color:var(--cyan);background:transparent;font:800 12px/1.25 var(--mono);cursor:pointer}.ex-course button:hover,.ex-course button:focus-visible,.ex-card-main button:hover,.ex-card-main button:focus-visible{text-decoration:underline;text-underline-offset:3px}.ex-course strong{overflow:hidden;font-size:12px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.ex-course small{display:flex;grid-column:1 / -1;align-items:center;gap:4px;color:var(--dimmer);font:9px/1.2 var(--mono)}.ex-course small svg{width:10px;height:10px}.ex-meta{display:flex;align-items:flex-start;gap:6px;min-width:0;color:var(--dim);font-size:11px;line-height:1.35}.ex-meta svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-type{display:inline-flex;padding:5px 7px;border:1px solid color-mix(in srgb,var(--acid) 24%,var(--line));border-radius:6px;color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel));font:650 10px/1.15 var(--sans);font-style:normal}.ex-when{display:grid;gap:5px}.ex-when strong,.ex-when span{display:flex;align-items:center;gap:6px}.ex-when strong{font-size:11px}.ex-when span{color:var(--dim);font:10px/1.2 var(--mono)}.ex-when svg{width:13px;height:13px;color:var(--dimmer)}.ex-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.ex-empty svg{width:25px;height:25px}.ex-empty strong{font-size:12px}.ex-agenda{display:grid;gap:15px}.ex-day{overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-day>header{display:flex;align-items:center;gap:8px;min-height:42px;padding:9px 12px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2)}.ex-day>header svg{width:15px;height:15px;color:var(--acid)}.ex-day>header strong{font:750 11px/1 var(--mono)}.ex-day>header span{margin-left:auto;color:var(--dim);font-size:11px}.ex-card{display:grid;grid-template-columns:74px minmax(0,1fr);gap:12px;padding:13px 12px;border-bottom:1px solid var(--line)}.ex-card:last-child{border-bottom:0}.ex-card-time{display:flex;align-items:flex-start;gap:5px;color:var(--fg);font:700 10px/1.35 var(--mono)}.ex-card-time svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main{display:grid;gap:5px;min-width:0}.ex-card-main>strong{font-size:12px;line-height:1.3}.ex-card-main>span{display:flex;align-items:center;gap:6px;min-width:0;color:var(--dim);font-size:10px;line-height:1.35}.ex-card-main>span svg{width:12px;height:12px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main>span i{width:3px;height:3px;margin-inline:2px;border-radius:50%;background:var(--dimmer)}@media(max-width:900px){.cp-semester-grid{grid-template-columns:1fr}.ex-head,.ex-row{grid-template-columns:minmax(210px,1.45fr) minmax(135px,.85fr) minmax(95px,.62fr) minmax(175px,1fr)}.ex-head>:nth-child(4):not(:last-child),.ex-row>:nth-child(4):not(:last-child){display:none}}@media(max-width:560px){.curriculum-plan-root .dp-sem-head{flex-wrap:nowrap;gap:7px;min-height:48px;padding-block:10px}.curriculum-plan-root .dp-sem-head>span:first-child{width:auto;flex:0 0 auto;font-size:13px}.curriculum-plan-root .dp-load{overflow:hidden;flex:1 1 auto;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-sem-avg{margin-left:auto;font-size:9px}.curriculum-plan-root .dp-colhead{display:none}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin-inline:10px}.curriculum-plan-root .dp-row,.curriculum-plan-root .dp-elective .dp-row{grid-template-columns:34px minmax(0,1fr) auto;gap:4px 8px;min-height:60px;padding:7px 0}.curriculum-plan-root .dp-credit{grid-column:1;grid-row:1 / 3;align-self:center}.curriculum-plan-root .dp-title{display:flex;grid-column:2;grid-row:1;align-items:baseline;gap:6px;overflow:hidden;white-space:nowrap}.curriculum-plan-root .dp-code{flex:0 0 auto;font-size:11px;min-height:28px}.curriculum-plan-root .dp-name{min-width:0;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-repeat-btn,.curriculum-plan-root .dp-repeat-cell{grid-column:3;grid-row:1}.curriculum-plan-root .dp-grade-wrap,.curriculum-plan-root .dp-elective-inputs{grid-column:2;grid-row:2;justify-self:start}.curriculum-plan-root .dp-sec-btn{grid-column:3;grid-row:1 / 3;align-self:center}.curriculum-plan-root .cp-grade-trigger{min-height:34px;padding:5px 7px}.curriculum-plan-root .cp-grade-trigger:after{position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;content:""}.curriculum-plan-root .dp-grade-clear{min-height:32px}.cp-grade-menu,.cp-grade-menu.above{top:auto;right:10px;bottom:max(10px,env(safe-area-inset-bottom));left:10px;grid-template-columns:repeat(5,minmax(0,1fr));width:auto;max-width:none;gap:4px;padding:7px;transform:none}.cp-grade-menu button{min-height:42px;padding:5px 3px;font-size:9px}.cp-grade-menu button.is-empty{min-height:38px}.cp-grade-menu button svg{right:5px;width:11px;height:11px}}@media(max-width:600px){.pp-heading{margin-bottom:10px}.pp-heading-icon{width:32px;height:32px}.pp-day-tabs{overflow-x:auto;grid-template-columns:repeat(var(--pp-days, 5),minmax(48px,1fr))}}@media(prefers-reduced-motion:reduce){.pp-session{transition:none}}.pcl-list{position:relative;display:grid;color:var(--fg);font-family:var(--sans)}.pcl-head{display:grid;grid-template-columns:1fr auto;padding:8px 2px;color:var(--dimmer);border-bottom:1px solid var(--line);font:700 9px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase}.pcl-item{position:relative;display:grid;grid-template-columns:16px minmax(0,1fr) auto 30px 30px;gap:6px;align-items:start;padding:13px 0;border-bottom:1px solid var(--line);cursor:pointer;transition:background-color .14s ease,transform .14s ease}.pcl-item:hover{background:color-mix(in srgb,var(--acid) 4%,transparent)}.pcl-item.is-full{background:color-mix(in srgb,var(--red) 5%,transparent)}.pcl-item.is-dragging{opacity:.45}.pcl-item.is-drop-target{box-shadow:inset 0 2px 0 0 var(--acid)}.pcl-grip{width:14px;height:14px;margin-top:2px;color:var(--dimmer);cursor:grab}.pcl-item.is-dragging .pcl-grip{cursor:grabbing}@media(prefers-reduced-motion:reduce){.pcl-item{transition:none}}.pcl-course{min-width:0}.pcl-title{display:flex;align-items:center;gap:6px}.pcl-title strong{color:var(--cyan);font:800 11px/1.2 var(--mono)}.pcl-title>span{padding:3px 5px;border:1px solid color-mix(in srgb,var(--acid) 40%,var(--line));border-radius:5px;color:var(--acid);font:700 8px/1 var(--sans)}.pcl-course>p{margin:4px 0 7px;overflow:hidden;color:var(--fg);font-size:11px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.pcl-meta{display:grid;gap:4px;color:var(--dim);font-size:9px}.pcl-meta span{display:flex;align-items:center;gap:5px;min-width:0}.pcl-meta svg{width:11px;height:11px;flex:0 0 auto;color:var(--dimmer)}.pcl-course small{display:block;margin-top:6px;color:var(--acid);font:700 9px/1.2 var(--mono)}.pcl-numbers{display:grid;justify-items:end;gap:5px;font-family:var(--mono)}.pcl-numbers b{font-size:10px;font-variant-numeric:tabular-nums}.pcl-numbers span{color:var(--dimmer);font-size:8px}.pcl-numbers em{color:var(--amber);font-size:8px;font-style:normal}.pcl-remove,.pcl-menu-trigger{display:grid;width:28px;height:28px;place-items:center;padding:0;border:1px solid transparent;border-radius:7px;color:var(--dimmer);background:transparent;cursor:pointer}.pcl-remove{display:grid}.pcl-menu-trigger:hover,.pcl-menu-trigger:focus-visible{border-color:var(--line-hot);color:var(--fg);background:var(--panel-2)}.pcl-menu-trigger svg,.pcl-remove svg{width:14px;height:14px}.pcl-menu-wrap{position:relative}.pcl-menu{position:absolute;z-index:30;top:31px;right:0;display:grid;width:208px;padding:6px;border:1px solid var(--line-hot);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pcl-menu button{display:flex;align-items:center;gap:8px;min-height:34px;padding:7px 9px;border:0;border-radius:6px;color:var(--fg);background:transparent;font:600 10px/1.2 var(--sans);text-align:left;cursor:pointer}.pcl-menu button:hover,.pcl-menu button:focus-visible{background:var(--panel-2)}.pcl-menu button.is-danger{color:var(--red)}.pcl-menu svg{width:13px;height:13px}.pcl-empty{display:grid;min-height:150px;place-items:center;align-content:center;gap:8px;color:var(--dimmer);text-align:center}.pcl-empty svg{width:24px;height:24px}.pcl-empty strong{max-width:25ch;font-size:11px}.cdr-root{display:flex;min-height:0;height:100%;flex-direction:column;color:var(--fg);background:var(--panel);font-family:var(--sans)}.cdr-head{display:flex;min-height:128px;flex:0 0 auto;align-items:flex-start;justify-content:space-between;gap:24px;padding:28px 76px 22px 28px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--acid) 2.5%,var(--panel))}.cdr-title{min-width:0}.cdr-title h3{display:flex;align-items:center;gap:16px;margin:0 0 13px}.cdr-title .d-code{display:inline-flex;min-height:38px;align-items:center;padding:0 11px;border:1px solid var(--line-hot);border-radius:8px;color:var(--cyan);background:var(--panel);font:800 12px/1 var(--mono);white-space:nowrap}.cdr-title .d-name{color:var(--fg);font-family:var(--display);font-size:clamp(21px,3vw,30px);font-weight:750;line-height:1.1;letter-spacing:-.025em}.cdr-title .d-meta{display:flex;flex-wrap:wrap;gap:6px}.cdr-title .d-pill,.cdr-kind{display:inline-flex;min-height:25px;align-items:center;gap:5px;padding:4px 8px;border:1px solid var(--line);border-radius:7px;color:var(--dim);background:var(--panel);font:650 9px/1 var(--sans)}.cdr-kind{border-color:color-mix(in srgb,var(--acid) 44%,var(--line));color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.cdr-kind.graduation{border-color:color-mix(in srgb,var(--cyan) 42%,var(--line));color:var(--cyan);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.cdr-kind svg{width:12px;height:12px}.cdr-obs{display:inline-flex;align-items:center;gap:7px}.cdr-obs svg{width:14px;height:14px;order:-1}.cdr-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;flex:0 0 auto;padding:0 28px;border:0;border-bottom:1px solid var(--line);border-radius:0;background:var(--panel)}.cdr-tabs button{position:relative;display:flex;min-width:0;min-height:52px;align-items:center;justify-content:center;gap:7px;padding:8px;border:0;border-radius:0;color:var(--dim);background:transparent;font:700 11px/1 var(--sans);cursor:pointer}.cdr-tabs button svg{width:13px;height:13px}.cdr-tabs button>span{min-width:0;padding:0;border:0;border-radius:0;color:inherit;background:transparent;font:inherit}.cdr-tabs button b{min-width:19px;padding:3px 5px;border-radius:999px;color:var(--dim);background:var(--panel-2);font:700 8px/1 var(--mono)}.cdr-tabs button:after{position:absolute;right:22%;bottom:-1px;left:22%;height:2px;border-radius:2px 2px 0 0;background:var(--acid);content:"";opacity:0;transform:scaleX(.5);transition:opacity .14s ease,transform .14s ease}@media(prefers-reduced-motion:reduce){.cdr-tabs button:after{transition:none}}.cdr-tabs button:hover{color:var(--fg);background:color-mix(in srgb,var(--acid) 3%,transparent)}.cdr-tabs button[aria-selected=true]{color:var(--fg);background:transparent;box-shadow:none}.cdr-tabs button[aria-selected=true]:after{opacity:1;transform:scaleX(1)}.cdr-tabs button[aria-selected=true] svg{color:var(--acid)}.cdr-panels{min-height:0;flex:1 1 auto;overflow-y:auto;padding:24px 28px 30px;overscroll-behavior:contain;scrollbar-color:var(--line-hot) transparent}.cdr-panels>section>div:not(.cdr-sections){max-width:880px;margin-inline:auto}.cdr-section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:14px;padding-bottom:13px;border-bottom:1px solid var(--line)}.cdr-section-heading h4{margin:0;color:var(--fg);font-family:var(--display);font-size:18px;letter-spacing:-.015em}.cdr-section-heading p{margin:5px 0 0;color:var(--dimmer);font-size:10px}.cdr-section-heading>span{display:grid;width:28px;height:28px;place-items:center;border:1px solid var(--line);border-radius:8px;color:var(--acid);background:var(--panel-2);font:750 10px/1 var(--mono)}.cdr-section-list{display:grid}.cdr-section{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:16px;align-items:start;padding:17px 6px;border-bottom:1px solid var(--line)}.cdr-section:first-child{border-top:1px solid var(--line)}.cdr-section.is-focus{margin-inline:-10px;padding-inline:16px;border-radius:10px;background:color-mix(in srgb,var(--acid) 8%,var(--panel));box-shadow:inset 2px 0 0 var(--acid)}.cdr-section-code{display:grid;gap:4px}.cdr-section-code span{color:var(--dimmer);font:700 8px/1 var(--sans);letter-spacing:.08em}.cdr-section-code strong{color:var(--cyan);font:800 11px/1.2 var(--mono)}.cdr-section-body{display:grid;min-width:0;gap:7px}.cdr-section-top{display:flex;min-width:0;align-items:center;justify-content:space-between;gap:16px}.cdr-instructor{display:flex;min-width:0;align-items:center;gap:6px;padding:0;border:0;color:var(--fg);background:transparent;font:700 11px/1.3 var(--sans);text-align:left;overflow-wrap:anywhere;cursor:pointer}.cdr-instructor:hover,.cdr-instructor:focus-visible{color:var(--cyan);text-decoration:underline;text-underline-offset:3px}.cdr-instructor svg,.cdr-section-meta svg,.cdr-section-times svg{width:12px;height:12px;flex:0 0 auto;color:var(--dimmer)}.cdr-section-top>span{color:var(--dim);font:700 10px/1 var(--mono);white-space:nowrap}.cdr-section-meta{display:flex;align-items:center;gap:6px;margin:0;color:var(--dim);font-size:10px}.cdr-section-times{display:grid;gap:4px;color:var(--dim);font-size:10px}.cdr-section-times span{display:flex;align-items:flex-start;gap:6px}.cdr-section-body>small{color:var(--dimmer);font-size:9px}.cdr-add{display:inline-flex;min-height:34px;align-items:center;gap:6px;padding:7px 10px;border:1px solid color-mix(in srgb,var(--cyan) 44%,var(--line));border-radius:8px;color:var(--cyan);background:color-mix(in srgb,var(--cyan) 6%,var(--panel));font:700 10px/1 var(--sans);cursor:pointer;white-space:nowrap}.cdr-add:hover,.cdr-add:focus-visible{border-color:var(--cyan);background:color-mix(in srgb,var(--cyan) 11%,var(--panel))}.cdr-add svg{width:13px;height:13px}.cdr-rules{margin-top:2px;color:var(--dim);font-size:10px}.cdr-rules summary{display:inline-flex;align-items:center;gap:5px;color:var(--cyan);cursor:pointer}.cdr-rules summary svg{width:12px;height:12px;transition:transform .14s ease}@media(prefers-reduced-motion:reduce){.cdr-rules summary svg{transition:none}}.cdr-rules[open] summary svg{transform:rotate(180deg)}.cdr-rules p{margin:7px 0 0}.cdr-rules p b{margin-right:6px;color:var(--dimmer)}.cdr-more{display:block;min-height:36px;margin:15px auto 0;padding:7px 12px;border:1px solid var(--line-hot);border-radius:8px;color:var(--fg);background:var(--panel);font:700 10px/1 var(--sans);cursor:pointer}.cdr-overview{max-width:880px;margin-inline:auto}.cdr-prereq{margin-block:22px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);overflow:hidden}.cdr-prereq-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;padding:5px;background:color-mix(in srgb,var(--fg) 3%,var(--panel-2))}.cdr-prereq-tabs button{display:flex;min-width:0;min-height:42px;align-items:center;justify-content:center;gap:8px;padding:8px 12px;border:1px solid transparent;border-radius:8px;color:var(--dim);background:transparent;font:700 11px/1.2 var(--sans);cursor:pointer}.cdr-prereq-tabs button:hover{color:var(--fg);background:color-mix(in srgb,var(--fg) 3%,transparent)}.cdr-prereq-tabs button[aria-selected=true]{border-color:var(--line-hot);color:var(--fg);background:var(--panel);box-shadow:0 1px 4px color-mix(in srgb,var(--bg) 32%,transparent)}.cdr-prereq-tabs button[aria-selected=true] svg{color:var(--acid)}.cdr-prereq-tabs svg{width:14px;height:14px;flex:0 0 auto}.cdr-prereq-tabs b{display:grid;min-width:19px;height:19px;place-items:center;border-radius:6px;color:var(--dim);background:var(--panel-2);font:750 8px/1 var(--mono)}.cdr-prereq-body{min-height:98px;padding:18px;border-top:1px solid var(--line);background:var(--panel)}.cdr-prereq-body>div[hidden]{display:none}.cdr-prereq-body .empty{margin:0}.cdr-history{max-width:900px;margin-inline:auto}.cdr-history-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;padding-bottom:14px;border-bottom:1px solid var(--line)}.cdr-history-head h4{margin:0;color:var(--fg);font-family:var(--display);font-size:18px;letter-spacing:-.015em}.cdr-history-head p{margin:5px 0 0;color:var(--dimmer);font-size:10px}.cdr-history-head>span{display:inline-flex;min-height:28px;align-items:center;gap:6px;padding:0 9px;border:1px solid var(--line);border-radius:8px;color:var(--acid);background:var(--panel-2);font:750 10px/1 var(--mono)}.cdr-history-head svg,.cdr-history-caption svg,.cdr-history-records summary svg{width:13px;height:13px}.cdr-history-figure{margin:0;padding:18px 0 22px}.cdr-history-legend{display:flex;justify-content:flex-end;gap:14px;margin-bottom:9px;color:var(--dimmer);font:650 9px/1 var(--sans)}.cdr-history-legend span{display:inline-flex;align-items:center;gap:6px}.cdr-history-legend i{width:11px;height:11px;border-radius:3px;background:var(--cyan)}.cdr-history-legend i.enrolled{border:1px solid color-mix(in srgb,var(--acid) 70%,var(--line));background:repeating-linear-gradient(135deg,var(--acid) 0 2px,transparent 2px 5px)}.cdr-history-chart{display:flex;height:172px;align-items:end;gap:9px;padding:17px 10px 0;border:1px solid var(--line);border-radius:10px;background-color:color-mix(in srgb,var(--panel-2) 64%,var(--panel));background-image:radial-gradient(circle,color-mix(in srgb,var(--dim) 18%,transparent) 1px,transparent 1px);background-size:13px 13px;overflow-x:auto;scrollbar-width:thin}.cdr-history-term{display:grid;min-width:56px;height:100%;flex:1 0 56px;grid-template-rows:minmax(0,1fr) 26px;align-items:end;justify-items:stretch;gap:7px;padding:0;border:0;color:var(--dimmer);background:transparent;cursor:pointer}.cdr-history-bars{display:flex;width:min(100%,52px);height:100%;min-height:10px;align-items:end;justify-self:center;justify-content:center;gap:5px;transition:transform .14s ease}@media(prefers-reduced-motion:reduce){.cdr-history-bars{transition:none}}.cdr-history-bars i{display:block;width:19px;min-height:3px;border-radius:5px 5px 1px 1px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 9%,transparent)}.cdr-history-bars i.capacity{background:var(--cyan)}.cdr-history-bars i.enrolled{border:1px solid color-mix(in srgb,var(--acid) 72%,var(--line));background:repeating-linear-gradient(135deg,var(--acid) 0 2px,color-mix(in srgb,var(--acid) 20%,transparent) 2px 5px)}.cdr-history-term.is-full .cdr-history-bars i.enrolled{border-color:var(--red);background:repeating-linear-gradient(135deg,var(--red) 0 2px,color-mix(in srgb,var(--red) 18%,transparent) 2px 5px)}.cdr-history-term small{font:650 9px/1 var(--sans);white-space:nowrap}.cdr-history-term:hover .cdr-history-bars,.cdr-history-term:focus-visible .cdr-history-bars,.cdr-history-term.is-active .cdr-history-bars{transform:translateY(-3px)}.cdr-history-term.is-active .cdr-history-bars i{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--fg) 18%,transparent),0 0 0 2px color-mix(in srgb,var(--acid) 18%,transparent)}.cdr-history-term.is-active small{color:var(--fg);font-weight:800}.cdr-history-caption{display:flex;min-height:42px;align-items:center;gap:17px;margin-top:11px;padding:8px 11px;border:1px solid var(--line);border-radius:9px;color:var(--dim);background:var(--panel-2);font-size:10px}.cdr-history-caption span{display:inline-flex;align-items:center;gap:5px}.cdr-history-caption b{color:var(--fg);font-weight:750}.cdr-history-caption>strong{margin-left:auto;color:var(--acid);font:800 14px/1 var(--mono)}.cdr-history-toggle{display:block;margin:13px auto 0;padding:7px 10px;border:0;color:var(--cyan);background:transparent;font:700 10px/1 var(--sans);text-decoration:underline;text-underline-offset:3px;cursor:pointer}.cdr-history-records{border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.cdr-history-records>summary{display:grid;min-height:48px;grid-template-columns:minmax(0,1fr) auto 18px;align-items:center;gap:10px;color:var(--fg);cursor:pointer;list-style:none}.cdr-history-records>summary::-webkit-details-marker{display:none}.cdr-history-records>summary span{display:inline-flex;align-items:center;gap:8px;font-weight:750}.cdr-history-records>summary b{display:grid;min-width:24px;height:24px;place-items:center;border-radius:7px;color:var(--dim);background:var(--panel-2);font:750 9px/1 var(--mono)}.cdr-history-records>summary>svg{color:var(--dimmer);transition:transform .14s ease}@media(prefers-reduced-motion:reduce){.cdr-history-records>summary>svg{transition:none}}.cdr-history-records[open]>summary>svg{transform:rotate(180deg)}.cdr-history-record-list{padding:0 0 14px}.cdr-history-record-list>section{padding:14px 0;border-top:1px solid var(--line)}.cdr-history-record-list>section>header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:7px}.cdr-history-record-list>section>header strong{color:var(--fg);font-size:11px}.cdr-history-record-list>section>header span{color:var(--dim);font:700 9px/1 var(--mono)}.cdr-history-record{display:grid;min-height:31px;grid-template-columns:minmax(0,1fr) auto 42px;align-items:center;gap:12px;padding:5px 8px;border-radius:6px;color:var(--dim);font-size:10px}.cdr-history-record:nth-child(2n){background:var(--panel-2)}.cdr-history-record small{color:var(--dimmer)}.cdr-history-record>b{color:var(--acid);font:750 10px/1 var(--mono);text-align:right}.cdr-history-empty{display:grid;min-height:220px;place-content:center;justify-items:center;gap:8px;color:var(--dimmer);text-align:center}.cdr-history-empty svg{width:28px;height:28px;color:var(--acid)}.cdr-history-empty strong{color:var(--fg);font-family:var(--display)}.cdr-history-empty p{max-width:48ch;margin:0;font-size:11px}.pp-tooltip{position:fixed;z-index:10030;width:286px;padding:12px;border:1px solid var(--line-hot);border-radius:11px;color:var(--fg);background:var(--panel);box-shadow:var(--shadow-float);pointer-events:none;transform:translateY(-100%);animation:pp-tooltip-in .13s cubic-bezier(.2,.8,.2,1)}.pp-tooltip[data-side=bottom]{transform:none}.pp-tooltip-title{display:grid;grid-template-columns:8px 1fr auto;align-items:center;gap:7px}.pp-tooltip-title>span{width:8px;height:8px;border-radius:3px}.pp-tooltip-title strong{font:800 11px/1.2 var(--mono)}.pp-tooltip-title b{color:var(--dim);font:700 9px/1 var(--mono)}.pp-tooltip>p{margin:7px 0 9px;font-size:11px;font-weight:700;line-height:1.35}.pp-tooltip dl{display:grid;gap:5px;margin:0}.pp-tooltip dl div{display:grid;grid-template-columns:16px 1fr;align-items:center;color:var(--dim);font-size:10px}.pp-tooltip dt,.pp-tooltip dd{margin:0}.pp-tooltip svg{width:11px;height:11px}.pp-tooltip>small{display:block;margin-top:10px;padding-top:8px;color:var(--dimmer);border-top:1px solid var(--line);font-size:8px}@keyframes pp-tooltip-in{0%{opacity:.2;filter:blur(3px)}to{opacity:1;filter:blur(0)}}@media(max-width:600px){.pcl-item{grid-template-columns:14px minmax(0,1fr) auto 44px 44px;padding-block:12px}.pcl-remove,.pcl-menu-trigger{display:grid;width:44px;height:44px}.pcl-course>p{white-space:normal}.pcl-meta{grid-template-columns:1fr}.cdr-head{min-height:0;padding:20px 56px 16px 16px}.cdr-title h3{display:grid;gap:8px}.cdr-tabs{position:sticky;top:0;z-index:4;margin-inline:0;padding-inline:6px}.cdr-tabs button{min-height:44px;padding-inline:4px}.cdr-tabs button svg{display:none}.cdr-title .d-name{font-size:18px}.cdr-panels{padding:16px 14px 24px}.cdr-section{grid-template-columns:52px minmax(0,1fr);gap:10px;padding-block:14px}.cdr-section-top{display:grid;gap:6px}.cdr-add{grid-column:2;justify-self:start}.cdr-section.is-focus{margin-inline:-5px;padding-inline:10px}.cdr-history-chart{margin-inline:-14px;padding-inline:14px}.cdr-history-caption{display:grid;grid-template-columns:1fr auto;gap:6px 12px}.cdr-history-caption>strong{grid-column:2;grid-row:1 / span 2;align-self:center}.cdr-history-record-list>section>header{align-items:flex-start}.cdr-history-record{grid-template-columns:minmax(0,1fr) 38px}.cdr-history-record small{grid-column:1;grid-row:2}.cdr-history-record>b{grid-column:2;grid-row:1 / span 2}.pp-tooltip{display:none}}@media print{.program-planner-root .pp-calendar-scroll{max-height:none;overflow:visible;box-shadow:none}.program-planner-root .pp-calendar{min-width:0}.program-planner-root .pp-context{display:none}}.gpa-summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.gpa-summary-card{position:relative;display:grid;grid-template-columns:38px minmax(0,1fr);gap:11px;align-items:start;min-height:92px;padding:15px;border:1px solid color-mix(in srgb,var(--hairline) 82%,transparent);border-radius:13px;background:linear-gradient(145deg,color-mix(in srgb,var(--panel) 96%,var(--accent) 4%),var(--panel));overflow:hidden}.gpa-summary-card:after{content:"";position:absolute;right:-24px;bottom:-34px;width:88px;height:88px;border-radius:50%;background:color-mix(in srgb,var(--accent) 9%,transparent);pointer-events:none}.gpa-summary-icon{display:grid;place-items:center;width:38px;height:38px;border-radius:11px;color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);border:1px solid color-mix(in srgb,var(--accent) 28%,transparent)}.gpa-summary-icon svg{width:19px;height:19px}.gpa-summary-card>div{display:grid;gap:3px;min-width:0}.gpa-summary-card em{font-style:normal;color:var(--dim);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.gpa-summary-card b{color:var(--fg);font-size:18px;line-height:1.25;overflow-wrap:anywhere}.gpa-summary-card small{color:var(--dimmer);font-size:11px;line-height:1.35}.gpa-summary-card.is-target b{font-size:13px;line-height:1.45}@media(max-width:760px){.gpa-summary-grid{grid-template-columns:1fr}.gpa-summary-card{min-height:76px}}.fc-term{color:var(--fg);font-size:13px;padding-right:8px}.fc-pill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 4px 0 9px;border:1px solid var(--line-hot);border-radius:8px;background:var(--panel);color:var(--dim);font-family:var(--sans);font-size:12px;line-height:1}.fc-divider{width:1px;height:13px;background:var(--hairline-strong)}.fc-value{color:var(--fg);font-weight:700}.fc-x{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dim);cursor:pointer;transition:background-color .14s ease,color .14s ease}.fc-x svg{width:12px;height:12px}.fc-x:hover{color:var(--acid);background:color-mix(in srgb,var(--acid) 10%,transparent)}.fc-x:focus-visible{outline:2px solid var(--cyan);outline-offset:1px}@media(prefers-reduced-motion:reduce){.fc-x{transition:none}}.tg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.tg-card{display:flex;gap:12px;padding:16px;border:1px solid var(--hairline-strong);border-radius:14px;background:var(--panel)}.tg-card.is-missing{border-style:dashed;opacity:.65}.tg-icon{display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:36px;height:36px;border-radius:8px;background:var(--panel-2);color:var(--acid)}.tg-icon svg{width:18px;height:18px}.tg-card.is-missing .tg-icon{color:var(--dimmer)}.tg-body{min-width:0;flex:1 1 auto}.tg-body h3{display:flex;align-items:center;gap:8px;margin:0 0 6px;color:var(--fg);font-size:15px;letter-spacing:-.01em}.tg-badge{padding:2px 7px;border:1px solid var(--line-hot);border-radius:6px;color:var(--dim);font:700 9px/1.4 var(--mono);text-transform:uppercase;letter-spacing:.06em}.tg-badge.is-live{color:var(--on-accent);background:var(--acid-vivid);border-color:var(--acid-vivid)}.tg-meta{margin:0;color:var(--dim);font-size:12px}.tg-meta.is-warn{color:var(--amber)}.tg-links{display:flex;flex-direction:column;gap:6px;flex:0 0 auto;justify-content:center}.tg-link{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--line-hot);border-radius:8px;color:var(--cyan);text-decoration:none;font-size:11px;white-space:nowrap;transition:border-color .14s ease,background-color .14s ease,color .14s ease}.tg-link svg{width:13px;height:13px}.tg-link:hover{border-color:var(--acid);background:var(--panel-2);color:var(--acid)}.tg-link:focus-visible{outline:2px solid var(--cyan);outline-offset:1px}@media(prefers-reduced-motion:reduce){.tg-link{transition:none}}@media(max-width:560px){.tg-card{flex-direction:column}.tg-links{flex-direction:row}}.atl-group{margin:0 0 22px}.atl-group h3{margin:0 0 10px;color:var(--dim);font:700 11px/1.3 var(--mono);text-transform:uppercase;letter-spacing:.1em}.atl-list{display:grid;gap:0;list-style:none;margin:0;padding:0}.atl-row{display:grid;grid-template-columns:22px minmax(0,1fr) auto auto;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid var(--line)}.atl-row:last-child{border-bottom:0}.atl-icon{display:flex;align-items:center;justify-content:center;width:22px;height:22px;color:var(--dimmer)}.atl-icon svg{width:15px;height:15px}.atl-row.is-now .atl-icon{color:var(--amber)}.atl-row.is-upcoming .atl-icon{color:var(--cyan)}.atl-title{min-width:0;color:var(--fg);font-size:13px}.atl-row.is-past .atl-title{color:var(--dimmer)}.atl-date{color:var(--cyan);font:700 11px/1.3 var(--mono)}.atl-row.is-past .atl-date{color:var(--dimmer)}.atl-left{color:var(--dim);font-size:11px;text-align:right}.atl-row.is-now{background:var(--now-bg)}.atl-row.is-now .atl-left{color:var(--amber)}@media(max-width:640px){.atl-row{grid-template-columns:22px 1fr;row-gap:2px}.atl-date,.atl-left{grid-column:2;text-align:left}}.dersler-table-root .hover\\:dt-bg-accent:hover{background-color:var(--panel-2)}.dersler-table-root .hover\\:dt-text-accent-foreground:hover{color:var(--acid)}.dersler-table-root .focus-visible\\:dt-outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.dersler-table-root .focus-visible\\:dt-ring-2:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.dersler-table-root .focus-visible\\:dt-ring-ring:focus-visible{--tw-ring-color: var(--cyan)}.dersler-table-root .focus-visible\\:dt-ring-offset-2:focus-visible{--tw-ring-offset-width: 2px}.dersler-table-root .disabled\\:dt-pointer-events-none:disabled{pointer-events:none}.dersler-table-root .disabled\\:dt-opacity-50:disabled{opacity:.5}.dersler-table-root .data-\\[state\\=selected\\]\\:dt-bg-muted[data-state=selected]{background-color:var(--panel-2)}.dersler-table-root .\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:dt-pr-0:has([role=checkbox]){padding-right:0}.dersler-table-root :is(.\\[\\&_tr\\:last-child\\]\\:dt-border-0 tr:last-child){border-width:0px}.dersler-table-root :is(.\\[\\&_tr\\]\\:dt-border-b tr){border-bottom-width:1px}';
let fr = null, Ut = null, Vt = null, Bt = null, Wt = null, kt = null, zr = null, _r = null, Ft = null, $t = null, Mr = null, Ht = null, po = null;
function ft() {
  po || (po = document.createElement("style"), po.textContent = rh, document.head.appendChild(po));
}
function nh(i, c) {
  ft(), fr = pt.createRoot(i), fr.render(
    /* @__PURE__ */ a.jsx(W.StrictMode, { children: /* @__PURE__ */ a.jsx(ad, { ...c }) })
  );
}
function lh(i) {
  fr && fr.render(
    /* @__PURE__ */ a.jsx(W.StrictMode, { children: /* @__PURE__ */ a.jsx(ad, { ...i }) })
  );
}
function oh() {
  fr == null || fr.unmount(), fr = null;
}
function ih(i, c) {
  ft(), Ut = pt.createRoot(i), Ut.render(/* @__PURE__ */ a.jsx(cd, { ...c }));
}
function ah(i) {
  Ut == null || Ut.render(/* @__PURE__ */ a.jsx(cd, { ...i }));
}
function sh() {
  Ut == null || Ut.unmount(), Ut = null;
}
function uh(i, c) {
  ft(), Wt = pt.createRoot(i), Wt.render(/* @__PURE__ */ a.jsx(fd, { ...c }));
}
function ch(i) {
  Wt == null || Wt.render(/* @__PURE__ */ a.jsx(fd, { ...i }));
}
function dh() {
  Wt == null || Wt.unmount(), Wt = null;
}
function ph(i, c) {
  ft(), kt == null || kt.unmount(), kt = pt.createRoot(i), mo.flushSync(() => kt == null ? void 0 : kt.render(/* @__PURE__ */ a.jsx(Gm, { ...c })));
}
function fh() {
  kt == null || kt.unmount(), kt = null;
}
function mh(i, c) {
  ft(), zr || (zr = pt.createRoot(i)), zr.render(/* @__PURE__ */ a.jsx(Km, { ...c }));
}
function hh() {
  zr == null || zr.unmount(), zr = null;
}
function gh(i, c) {
  ft(), Vt = pt.createRoot(i), Vt.render(/* @__PURE__ */ a.jsx(dd, { ...c }));
}
function xh(i) {
  Vt == null || Vt.render(/* @__PURE__ */ a.jsx(dd, { ...i }));
}
function vh() {
  Vt == null || Vt.unmount(), Vt = null;
}
function yh(i, c) {
  ft(), Bt = pt.createRoot(i), Bt.render(/* @__PURE__ */ a.jsx(pd, { ...c }));
}
function wh(i) {
  Bt == null || Bt.render(/* @__PURE__ */ a.jsx(pd, { ...i }));
}
function kh() {
  Bt == null || Bt.unmount(), Bt = null;
}
function bh(i, c) {
  ft(), _r || (_r = pt.createRoot(i)), _r.render(/* @__PURE__ */ a.jsx(Ym, { ...c }));
}
function jh() {
  _r == null || _r.unmount(), _r = null;
}
function Sh(i, c) {
  ft(), Ft || (Ft = pt.createRoot(i)), mo.flushSync(() => Ft == null ? void 0 : Ft.render(/* @__PURE__ */ a.jsx(Xm, { ...c })));
}
function Ch() {
  Ft == null || Ft.unmount(), Ft = null;
}
function Nh(i, c) {
  ft(), $t || ($t = pt.createRoot(i)), mo.flushSync(() => $t == null ? void 0 : $t.render(/* @__PURE__ */ a.jsx(Jm, { ...c })));
}
function Eh() {
  $t == null || $t.unmount(), $t = null;
}
function zh(i, c) {
  ft(), Mr || (Mr = pt.createRoot(i)), Mr.render(/* @__PURE__ */ a.jsx(eh, { ...c }));
}
function _h() {
  Mr == null || Mr.unmount(), Mr = null;
}
function Mh(i, c) {
  ft(), Ht || (Ht = pt.createRoot(i)), mo.flushSync(() => Ht == null ? void 0 : Ht.render(/* @__PURE__ */ a.jsx(th, { ...c })));
}
function Ph() {
  Ht == null || Ht.unmount(), Ht = null;
}
export {
  nh as mount,
  Nh as mountCalendarTimeline,
  bh as mountChips,
  ph as mountCourseDetail,
  gh as mountCurriculum,
  yh as mountExams,
  mh as mountGpaSummary,
  Mh as mountHistoryDetail,
  zh as mountHistorySearch,
  ih as mountProgram,
  uh as mountProgramList,
  Sh as mountTermsGrid,
  oh as unmount,
  Eh as unmountCalendarTimeline,
  jh as unmountChips,
  fh as unmountCourseDetail,
  vh as unmountCurriculum,
  kh as unmountExams,
  hh as unmountGpaSummary,
  Ph as unmountHistoryDetail,
  _h as unmountHistorySearch,
  sh as unmountProgram,
  dh as unmountProgramList,
  Ch as unmountTermsGrid,
  lh as update,
  xh as updateCurriculum,
  wh as updateExams,
  ah as updateProgram,
  ch as updateProgramList
};
