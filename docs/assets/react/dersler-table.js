function Jp(i, d) {
  for (var s = 0; s < d.length; s++) {
    const g = d[s];
    if (typeof g != "string" && !Array.isArray(g)) {
      for (const h in g)
        if (h !== "default" && !(h in i)) {
          const w = Object.getOwnPropertyDescriptor(g, h);
          w && Object.defineProperty(i, h, w.get ? w : {
            enumerable: !0,
            get: () => g[h]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }));
}
function ef(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var ea = { exports: {} }, Ur = {}, ta = { exports: {} }, ne = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pc;
function tf() {
  if (pc) return ne;
  pc = 1;
  var i = Symbol.for("react.element"), d = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), h = Symbol.for("react.profiler"), w = Symbol.for("react.provider"), k = Symbol.for("react.context"), S = Symbol.for("react.forward_ref"), M = Symbol.for("react.suspense"), D = Symbol.for("react.memo"), $ = Symbol.for("react.lazy"), W = Symbol.iterator;
  function N(m) {
    return m === null || typeof m != "object" ? null : (m = W && m[W] || m["@@iterator"], typeof m == "function" ? m : null);
  }
  var q = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, E = Object.assign, _ = {};
  function L(m, j, te) {
    this.props = m, this.context = j, this.refs = _, this.updater = te || q;
  }
  L.prototype.isReactComponent = {}, L.prototype.setState = function(m, j) {
    if (typeof m != "object" && typeof m != "function" && m != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, m, j, "setState");
  }, L.prototype.forceUpdate = function(m) {
    this.updater.enqueueForceUpdate(this, m, "forceUpdate");
  };
  function Z() {
  }
  Z.prototype = L.prototype;
  function B(m, j, te) {
    this.props = m, this.context = j, this.refs = _, this.updater = te || q;
  }
  var F = B.prototype = new Z();
  F.constructor = B, E(F, L.prototype), F.isPureReactComponent = !0;
  var Y = Array.isArray, oe = Object.prototype.hasOwnProperty, J = { current: null }, ye = { key: !0, ref: !0, __self: !0, __source: !0 };
  function xe(m, j, te) {
    var re, ae = {}, se = null, pe = null;
    if (j != null) for (re in j.ref !== void 0 && (pe = j.ref), j.key !== void 0 && (se = "" + j.key), j) oe.call(j, re) && !ye.hasOwnProperty(re) && (ae[re] = j[re]);
    var ce = arguments.length - 2;
    if (ce === 1) ae.children = te;
    else if (1 < ce) {
      for (var we = Array(ce), tt = 0; tt < ce; tt++) we[tt] = arguments[tt + 2];
      ae.children = we;
    }
    if (m && m.defaultProps) for (re in ce = m.defaultProps, ce) ae[re] === void 0 && (ae[re] = ce[re]);
    return { $$typeof: i, type: m, key: se, ref: pe, props: ae, _owner: J.current };
  }
  function _e(m, j) {
    return { $$typeof: i, type: m.type, key: j, ref: m.ref, props: m.props, _owner: m._owner };
  }
  function Fe(m) {
    return typeof m == "object" && m !== null && m.$$typeof === i;
  }
  function Ie(m) {
    var j = { "=": "=0", ":": "=2" };
    return "$" + m.replace(/[=:]/g, function(te) {
      return j[te];
    });
  }
  var le = /\/+/g;
  function Ue(m, j) {
    return typeof m == "object" && m !== null && m.key != null ? Ie("" + m.key) : j.toString(36);
  }
  function Ve(m, j, te, re, ae) {
    var se = typeof m;
    (se === "undefined" || se === "boolean") && (m = null);
    var pe = !1;
    if (m === null) pe = !0;
    else switch (se) {
      case "string":
      case "number":
        pe = !0;
        break;
      case "object":
        switch (m.$$typeof) {
          case i:
          case d:
            pe = !0;
        }
    }
    if (pe) return pe = m, ae = ae(pe), m = re === "" ? "." + Ue(pe, 0) : re, Y(ae) ? (te = "", m != null && (te = m.replace(le, "$&/") + "/"), Ve(ae, j, te, "", function(tt) {
      return tt;
    })) : ae != null && (Fe(ae) && (ae = _e(ae, te + (!ae.key || pe && pe.key === ae.key ? "" : ("" + ae.key).replace(le, "$&/") + "/") + m)), j.push(ae)), 1;
    if (pe = 0, re = re === "" ? "." : re + ":", Y(m)) for (var ce = 0; ce < m.length; ce++) {
      se = m[ce];
      var we = re + Ue(se, ce);
      pe += Ve(se, j, te, we, ae);
    }
    else if (we = N(m), typeof we == "function") for (m = we.call(m), ce = 0; !(se = m.next()).done; ) se = se.value, we = re + Ue(se, ce++), pe += Ve(se, j, te, we, ae);
    else if (se === "object") throw j = String(m), Error("Objects are not valid as a React child (found: " + (j === "[object Object]" ? "object with keys {" + Object.keys(m).join(", ") + "}" : j) + "). If you meant to render a collection of children, use an array instead.");
    return pe;
  }
  function et(m, j, te) {
    if (m == null) return m;
    var re = [], ae = 0;
    return Ve(m, re, "", "", function(se) {
      return j.call(te, se, ae++);
    }), re;
  }
  function Pe(m) {
    if (m._status === -1) {
      var j = m._result;
      j = j(), j.then(function(te) {
        (m._status === 0 || m._status === -1) && (m._status = 1, m._result = te);
      }, function(te) {
        (m._status === 0 || m._status === -1) && (m._status = 2, m._result = te);
      }), m._status === -1 && (m._status = 0, m._result = j);
    }
    if (m._status === 1) return m._result.default;
    throw m._result;
  }
  var me = { current: null }, T = { transition: null }, H = { ReactCurrentDispatcher: me, ReactCurrentBatchConfig: T, ReactCurrentOwner: J };
  function O() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ne.Children = { map: et, forEach: function(m, j, te) {
    et(m, function() {
      j.apply(this, arguments);
    }, te);
  }, count: function(m) {
    var j = 0;
    return et(m, function() {
      j++;
    }), j;
  }, toArray: function(m) {
    return et(m, function(j) {
      return j;
    }) || [];
  }, only: function(m) {
    if (!Fe(m)) throw Error("React.Children.only expected to receive a single React element child.");
    return m;
  } }, ne.Component = L, ne.Fragment = s, ne.Profiler = h, ne.PureComponent = B, ne.StrictMode = g, ne.Suspense = M, ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = H, ne.act = O, ne.cloneElement = function(m, j, te) {
    if (m == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + m + ".");
    var re = E({}, m.props), ae = m.key, se = m.ref, pe = m._owner;
    if (j != null) {
      if (j.ref !== void 0 && (se = j.ref, pe = J.current), j.key !== void 0 && (ae = "" + j.key), m.type && m.type.defaultProps) var ce = m.type.defaultProps;
      for (we in j) oe.call(j, we) && !ye.hasOwnProperty(we) && (re[we] = j[we] === void 0 && ce !== void 0 ? ce[we] : j[we]);
    }
    var we = arguments.length - 2;
    if (we === 1) re.children = te;
    else if (1 < we) {
      ce = Array(we);
      for (var tt = 0; tt < we; tt++) ce[tt] = arguments[tt + 2];
      re.children = ce;
    }
    return { $$typeof: i, type: m.type, key: ae, ref: se, props: re, _owner: pe };
  }, ne.createContext = function(m) {
    return m = { $$typeof: k, _currentValue: m, _currentValue2: m, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, m.Provider = { $$typeof: w, _context: m }, m.Consumer = m;
  }, ne.createElement = xe, ne.createFactory = function(m) {
    var j = xe.bind(null, m);
    return j.type = m, j;
  }, ne.createRef = function() {
    return { current: null };
  }, ne.forwardRef = function(m) {
    return { $$typeof: S, render: m };
  }, ne.isValidElement = Fe, ne.lazy = function(m) {
    return { $$typeof: $, _payload: { _status: -1, _result: m }, _init: Pe };
  }, ne.memo = function(m, j) {
    return { $$typeof: D, type: m, compare: j === void 0 ? null : j };
  }, ne.startTransition = function(m) {
    var j = T.transition;
    T.transition = {};
    try {
      m();
    } finally {
      T.transition = j;
    }
  }, ne.unstable_act = O, ne.useCallback = function(m, j) {
    return me.current.useCallback(m, j);
  }, ne.useContext = function(m) {
    return me.current.useContext(m);
  }, ne.useDebugValue = function() {
  }, ne.useDeferredValue = function(m) {
    return me.current.useDeferredValue(m);
  }, ne.useEffect = function(m, j) {
    return me.current.useEffect(m, j);
  }, ne.useId = function() {
    return me.current.useId();
  }, ne.useImperativeHandle = function(m, j, te) {
    return me.current.useImperativeHandle(m, j, te);
  }, ne.useInsertionEffect = function(m, j) {
    return me.current.useInsertionEffect(m, j);
  }, ne.useLayoutEffect = function(m, j) {
    return me.current.useLayoutEffect(m, j);
  }, ne.useMemo = function(m, j) {
    return me.current.useMemo(m, j);
  }, ne.useReducer = function(m, j, te) {
    return me.current.useReducer(m, j, te);
  }, ne.useRef = function(m) {
    return me.current.useRef(m);
  }, ne.useState = function(m) {
    return me.current.useState(m);
  }, ne.useSyncExternalStore = function(m, j, te) {
    return me.current.useSyncExternalStore(m, j, te);
  }, ne.useTransition = function() {
    return me.current.useTransition();
  }, ne.version = "18.3.1", ne;
}
var fc;
function pa() {
  return fc || (fc = 1, ta.exports = tf()), ta.exports;
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
var mc;
function nf() {
  if (mc) return Ur;
  mc = 1;
  var i = pa(), d = Symbol.for("react.element"), s = Symbol.for("react.fragment"), g = Object.prototype.hasOwnProperty, h = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, w = { key: !0, ref: !0, __self: !0, __source: !0 };
  function k(S, M, D) {
    var $, W = {}, N = null, q = null;
    D !== void 0 && (N = "" + D), M.key !== void 0 && (N = "" + M.key), M.ref !== void 0 && (q = M.ref);
    for ($ in M) g.call(M, $) && !w.hasOwnProperty($) && (W[$] = M[$]);
    if (S && S.defaultProps) for ($ in M = S.defaultProps, M) W[$] === void 0 && (W[$] = M[$]);
    return { $$typeof: d, type: S, key: N, ref: q, props: W, _owner: h.current };
  }
  return Ur.Fragment = s, Ur.jsx = k, Ur.jsxs = k, Ur;
}
var hc;
function rf() {
  return hc || (hc = 1, ea.exports = nf()), ea.exports;
}
var u = rf(), G = pa();
const lf = /* @__PURE__ */ ef(G), of = /* @__PURE__ */ Jp({
  __proto__: null,
  default: lf
}, [G]);
var to = {}, na = { exports: {} }, Je = {}, ra = { exports: {} }, la = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gc;
function af() {
  return gc || (gc = 1, (function(i) {
    function d(T, H) {
      var O = T.length;
      T.push(H);
      e: for (; 0 < O; ) {
        var m = O - 1 >>> 1, j = T[m];
        if (0 < h(j, H)) T[m] = H, T[O] = j, O = m;
        else break e;
      }
    }
    function s(T) {
      return T.length === 0 ? null : T[0];
    }
    function g(T) {
      if (T.length === 0) return null;
      var H = T[0], O = T.pop();
      if (O !== H) {
        T[0] = O;
        e: for (var m = 0, j = T.length, te = j >>> 1; m < te; ) {
          var re = 2 * (m + 1) - 1, ae = T[re], se = re + 1, pe = T[se];
          if (0 > h(ae, O)) se < j && 0 > h(pe, ae) ? (T[m] = pe, T[se] = O, m = se) : (T[m] = ae, T[re] = O, m = re);
          else if (se < j && 0 > h(pe, O)) T[m] = pe, T[se] = O, m = se;
          else break e;
        }
      }
      return H;
    }
    function h(T, H) {
      var O = T.sortIndex - H.sortIndex;
      return O !== 0 ? O : T.id - H.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var w = performance;
      i.unstable_now = function() {
        return w.now();
      };
    } else {
      var k = Date, S = k.now();
      i.unstable_now = function() {
        return k.now() - S;
      };
    }
    var M = [], D = [], $ = 1, W = null, N = 3, q = !1, E = !1, _ = !1, L = typeof setTimeout == "function" ? setTimeout : null, Z = typeof clearTimeout == "function" ? clearTimeout : null, B = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function F(T) {
      for (var H = s(D); H !== null; ) {
        if (H.callback === null) g(D);
        else if (H.startTime <= T) g(D), H.sortIndex = H.expirationTime, d(M, H);
        else break;
        H = s(D);
      }
    }
    function Y(T) {
      if (_ = !1, F(T), !E) if (s(M) !== null) E = !0, Pe(oe);
      else {
        var H = s(D);
        H !== null && me(Y, H.startTime - T);
      }
    }
    function oe(T, H) {
      E = !1, _ && (_ = !1, Z(xe), xe = -1), q = !0;
      var O = N;
      try {
        for (F(H), W = s(M); W !== null && (!(W.expirationTime > H) || T && !Ie()); ) {
          var m = W.callback;
          if (typeof m == "function") {
            W.callback = null, N = W.priorityLevel;
            var j = m(W.expirationTime <= H);
            H = i.unstable_now(), typeof j == "function" ? W.callback = j : W === s(M) && g(M), F(H);
          } else g(M);
          W = s(M);
        }
        if (W !== null) var te = !0;
        else {
          var re = s(D);
          re !== null && me(Y, re.startTime - H), te = !1;
        }
        return te;
      } finally {
        W = null, N = O, q = !1;
      }
    }
    var J = !1, ye = null, xe = -1, _e = 5, Fe = -1;
    function Ie() {
      return !(i.unstable_now() - Fe < _e);
    }
    function le() {
      if (ye !== null) {
        var T = i.unstable_now();
        Fe = T;
        var H = !0;
        try {
          H = ye(!0, T);
        } finally {
          H ? Ue() : (J = !1, ye = null);
        }
      } else J = !1;
    }
    var Ue;
    if (typeof B == "function") Ue = function() {
      B(le);
    };
    else if (typeof MessageChannel < "u") {
      var Ve = new MessageChannel(), et = Ve.port2;
      Ve.port1.onmessage = le, Ue = function() {
        et.postMessage(null);
      };
    } else Ue = function() {
      L(le, 0);
    };
    function Pe(T) {
      ye = T, J || (J = !0, Ue());
    }
    function me(T, H) {
      xe = L(function() {
        T(i.unstable_now());
      }, H);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(T) {
      T.callback = null;
    }, i.unstable_continueExecution = function() {
      E || q || (E = !0, Pe(oe));
    }, i.unstable_forceFrameRate = function(T) {
      0 > T || 125 < T ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : _e = 0 < T ? Math.floor(1e3 / T) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return N;
    }, i.unstable_getFirstCallbackNode = function() {
      return s(M);
    }, i.unstable_next = function(T) {
      switch (N) {
        case 1:
        case 2:
        case 3:
          var H = 3;
          break;
        default:
          H = N;
      }
      var O = N;
      N = H;
      try {
        return T();
      } finally {
        N = O;
      }
    }, i.unstable_pauseExecution = function() {
    }, i.unstable_requestPaint = function() {
    }, i.unstable_runWithPriority = function(T, H) {
      switch (T) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          T = 3;
      }
      var O = N;
      N = T;
      try {
        return H();
      } finally {
        N = O;
      }
    }, i.unstable_scheduleCallback = function(T, H, O) {
      var m = i.unstable_now();
      switch (typeof O == "object" && O !== null ? (O = O.delay, O = typeof O == "number" && 0 < O ? m + O : m) : O = m, T) {
        case 1:
          var j = -1;
          break;
        case 2:
          j = 250;
          break;
        case 5:
          j = 1073741823;
          break;
        case 4:
          j = 1e4;
          break;
        default:
          j = 5e3;
      }
      return j = O + j, T = { id: $++, callback: H, priorityLevel: T, startTime: O, expirationTime: j, sortIndex: -1 }, O > m ? (T.sortIndex = O, d(D, T), s(M) === null && T === s(D) && (_ ? (Z(xe), xe = -1) : _ = !0, me(Y, O - m))) : (T.sortIndex = j, d(M, T), E || q || (E = !0, Pe(oe))), T;
    }, i.unstable_shouldYield = Ie, i.unstable_wrapCallback = function(T) {
      var H = N;
      return function() {
        var O = N;
        N = H;
        try {
          return T.apply(this, arguments);
        } finally {
          N = O;
        }
      };
    };
  })(la)), la;
}
var vc;
function sf() {
  return vc || (vc = 1, ra.exports = af()), ra.exports;
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
var yc;
function uf() {
  if (yc) return Je;
  yc = 1;
  var i = pa(), d = sf();
  function s(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var g = /* @__PURE__ */ new Set(), h = {};
  function w(e, t) {
    k(e, t), k(e + "Capture", t);
  }
  function k(e, t) {
    for (h[e] = t, e = 0; e < t.length; e++) g.add(t[e]);
  }
  var S = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), M = Object.prototype.hasOwnProperty, D = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, $ = {}, W = {};
  function N(e) {
    return M.call(W, e) ? !0 : M.call($, e) ? !1 : D.test(e) ? W[e] = !0 : ($[e] = !0, !1);
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
  function E(e, t, n, r) {
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
  function _(e, t, n, r, l, o, a) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = a;
  }
  var L = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    L[e] = new _(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    L[t] = new _(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    L[e] = new _(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    L[e] = new _(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    L[e] = new _(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    L[e] = new _(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    L[e] = new _(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    L[e] = new _(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    L[e] = new _(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var Z = /[\-:]([a-z])/g;
  function B(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      Z,
      B
    );
    L[t] = new _(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(Z, B);
    L[t] = new _(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(Z, B);
    L[t] = new _(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    L[e] = new _(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), L.xlinkHref = new _("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    L[e] = new _(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function F(e, t, n, r) {
    var l = L.hasOwnProperty(t) ? L[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (E(t, n, l, r) && (n = null), r || l === null ? N(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var Y = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, oe = Symbol.for("react.element"), J = Symbol.for("react.portal"), ye = Symbol.for("react.fragment"), xe = Symbol.for("react.strict_mode"), _e = Symbol.for("react.profiler"), Fe = Symbol.for("react.provider"), Ie = Symbol.for("react.context"), le = Symbol.for("react.forward_ref"), Ue = Symbol.for("react.suspense"), Ve = Symbol.for("react.suspense_list"), et = Symbol.for("react.memo"), Pe = Symbol.for("react.lazy"), me = Symbol.for("react.offscreen"), T = Symbol.iterator;
  function H(e) {
    return e === null || typeof e != "object" ? null : (e = T && e[T] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var O = Object.assign, m;
  function j(e) {
    if (m === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      m = t && t[1] || "";
    }
    return `
` + m + e;
  }
  var te = !1;
  function re(e, t) {
    if (!e || te) return "";
    te = !0;
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
        } catch (x) {
          var r = x;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (x) {
          r = x;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (x) {
          r = x;
        }
        e();
      }
    } catch (x) {
      if (x && r && typeof x.stack == "string") {
        for (var l = x.stack.split(`
`), o = r.stack.split(`
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
      te = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? j(e) : "";
  }
  function ae(e) {
    switch (e.tag) {
      case 5:
        return j(e.type);
      case 16:
        return j("Lazy");
      case 13:
        return j("Suspense");
      case 19:
        return j("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = re(e.type, !1), e;
      case 11:
        return e = re(e.type.render, !1), e;
      case 1:
        return e = re(e.type, !0), e;
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
      case xe:
        return "StrictMode";
      case Ue:
        return "Suspense";
      case Ve:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Ie:
        return (e.displayName || "Context") + ".Consumer";
      case Fe:
        return (e._context.displayName || "Context") + ".Provider";
      case le:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case et:
        return t = e.displayName || null, t !== null ? t : se(e.type) || "Memo";
      case Pe:
        t = e._payload, e = e._init;
        try {
          return se(e(t));
        } catch {
        }
    }
    return null;
  }
  function pe(e) {
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
        return t === xe ? "StrictMode" : "Mode";
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
  function ce(e) {
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
  function we(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function tt(e) {
    var t = we(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var l = n.get, o = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(a) {
        r = "" + a, o.call(this, a);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(a) {
        r = "" + a;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function Wr(e) {
    e._valueTracker || (e._valueTracker = tt(e));
  }
  function ya(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = we(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Qr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function io(e, t) {
    var n = t.checked;
    return O({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function xa(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = ce(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function wa(e, t) {
    t = t.checked, t != null && F(e, "checked", t, !1);
  }
  function ao(e, t) {
    wa(e, t);
    var n = ce(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? so(e, t.type, n) : t.hasOwnProperty("defaultValue") && so(e, t.type, ce(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function ka(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function so(e, t, n) {
    (t !== "number" || Qr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var tr = Array.isArray;
  function En(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + ce(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function uo(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(s(91));
    return O({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Sa(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(s(92));
        if (tr(n)) {
          if (1 < n.length) throw Error(s(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: ce(n) };
  }
  function ba(e, t) {
    var n = ce(t.value), r = ce(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function ja(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Ca(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function co(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Ca(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Kr, Ea = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Kr = Kr || document.createElement("div"), Kr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Kr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function nr(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var rr = {
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
  }, rd = ["Webkit", "ms", "Moz", "O"];
  Object.keys(rr).forEach(function(e) {
    rd.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), rr[t] = rr[e];
    });
  });
  function Na(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || rr.hasOwnProperty(e) && rr[e] ? ("" + t).trim() : t + "px";
  }
  function za(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = Na(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var ld = O({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function po(e, t) {
    if (t) {
      if (ld[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(s(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(s(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(s(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(s(62));
    }
  }
  function fo(e, t) {
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
  var mo = null;
  function ho(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var go = null, Nn = null, zn = null;
  function _a(e) {
    if (e = Cr(e)) {
      if (typeof go != "function") throw Error(s(280));
      var t = e.stateNode;
      t && (t = gl(t), go(e.stateNode, e.type, t));
    }
  }
  function Pa(e) {
    Nn ? zn ? zn.push(e) : zn = [e] : Nn = e;
  }
  function Ma() {
    if (Nn) {
      var e = Nn, t = zn;
      if (zn = Nn = null, _a(e), t) for (e = 0; e < t.length; e++) _a(t[e]);
    }
  }
  function La(e, t) {
    return e(t);
  }
  function Ta() {
  }
  var vo = !1;
  function Ra(e, t, n) {
    if (vo) return e(t, n);
    vo = !0;
    try {
      return La(e, t, n);
    } finally {
      vo = !1, (Nn !== null || zn !== null) && (Ta(), Ma());
    }
  }
  function lr(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = gl(n);
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
  var yo = !1;
  if (S) try {
    var or = {};
    Object.defineProperty(or, "passive", { get: function() {
      yo = !0;
    } }), window.addEventListener("test", or, or), window.removeEventListener("test", or, or);
  } catch {
    yo = !1;
  }
  function od(e, t, n, r, l, o, a, c, p) {
    var x = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, x);
    } catch (C) {
      this.onError(C);
    }
  }
  var ir = !1, Gr = null, Yr = !1, xo = null, id = { onError: function(e) {
    ir = !0, Gr = e;
  } };
  function ad(e, t, n, r, l, o, a, c, p) {
    ir = !1, Gr = null, od.apply(id, arguments);
  }
  function sd(e, t, n, r, l, o, a, c, p) {
    if (ad.apply(this, arguments), ir) {
      if (ir) {
        var x = Gr;
        ir = !1, Gr = null;
      } else throw Error(s(198));
      Yr || (Yr = !0, xo = x);
    }
  }
  function cn(e) {
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
  function Oa(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Ia(e) {
    if (cn(e) !== e) throw Error(s(188));
  }
  function ud(e) {
    var t = e.alternate;
    if (!t) {
      if (t = cn(e), t === null) throw Error(s(188));
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
          if (o === n) return Ia(l), e;
          if (o === r) return Ia(l), t;
          o = o.sibling;
        }
        throw Error(s(188));
      }
      if (n.return !== r.return) n = l, r = o;
      else {
        for (var a = !1, c = l.child; c; ) {
          if (c === n) {
            a = !0, n = l, r = o;
            break;
          }
          if (c === r) {
            a = !0, r = l, n = o;
            break;
          }
          c = c.sibling;
        }
        if (!a) {
          for (c = o.child; c; ) {
            if (c === n) {
              a = !0, n = o, r = l;
              break;
            }
            if (c === r) {
              a = !0, r = o, n = l;
              break;
            }
            c = c.sibling;
          }
          if (!a) throw Error(s(189));
        }
      }
      if (n.alternate !== r) throw Error(s(190));
    }
    if (n.tag !== 3) throw Error(s(188));
    return n.stateNode.current === n ? e : t;
  }
  function Da(e) {
    return e = ud(e), e !== null ? Aa(e) : null;
  }
  function Aa(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Aa(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Fa = d.unstable_scheduleCallback, Ua = d.unstable_cancelCallback, cd = d.unstable_shouldYield, dd = d.unstable_requestPaint, Ee = d.unstable_now, pd = d.unstable_getCurrentPriorityLevel, wo = d.unstable_ImmediatePriority, Va = d.unstable_UserBlockingPriority, Xr = d.unstable_NormalPriority, fd = d.unstable_LowPriority, $a = d.unstable_IdlePriority, qr = null, kt = null;
  function md(e) {
    if (kt && typeof kt.onCommitFiberRoot == "function") try {
      kt.onCommitFiberRoot(qr, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var pt = Math.clz32 ? Math.clz32 : vd, hd = Math.log, gd = Math.LN2;
  function vd(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (hd(e) / gd | 0) | 0;
  }
  var Zr = 64, Jr = 4194304;
  function ar(e) {
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
  function el(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, a = n & 268435455;
    if (a !== 0) {
      var c = a & ~l;
      c !== 0 ? r = ar(c) : (o &= a, o !== 0 && (r = ar(o)));
    } else a = n & ~l, a !== 0 ? r = ar(a) : o !== 0 && (r = ar(o));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - pt(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function yd(e, t) {
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
  function xd(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var a = 31 - pt(o), c = 1 << a, p = l[a];
      p === -1 ? ((c & n) === 0 || (c & r) !== 0) && (l[a] = yd(c, t)) : p <= t && (e.expiredLanes |= c), o &= ~c;
    }
  }
  function ko(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Ha() {
    var e = Zr;
    return Zr <<= 1, (Zr & 4194240) === 0 && (Zr = 64), e;
  }
  function So(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function sr(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - pt(t), e[t] = n;
  }
  function wd(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - pt(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function bo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - pt(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var de = 0;
  function Ba(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Wa, jo, Qa, Ka, Ga, Co = !1, tl = [], Vt = null, $t = null, Ht = null, ur = /* @__PURE__ */ new Map(), cr = /* @__PURE__ */ new Map(), Bt = [], kd = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Ya(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Vt = null;
        break;
      case "dragenter":
      case "dragleave":
        $t = null;
        break;
      case "mouseover":
      case "mouseout":
        Ht = null;
        break;
      case "pointerover":
      case "pointerout":
        ur.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        cr.delete(t.pointerId);
    }
  }
  function dr(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = Cr(t), t !== null && jo(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Sd(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Vt = dr(Vt, e, t, n, r, l), !0;
      case "dragenter":
        return $t = dr($t, e, t, n, r, l), !0;
      case "mouseover":
        return Ht = dr(Ht, e, t, n, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return ur.set(o, dr(ur.get(o) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, cr.set(o, dr(cr.get(o) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function Xa(e) {
    var t = dn(e.target);
    if (t !== null) {
      var n = cn(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = Oa(n), t !== null) {
            e.blockedOn = t, Ga(e.priority, function() {
              Qa(n);
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
  function nl(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = No(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        mo = r, n.target.dispatchEvent(r), mo = null;
      } else return t = Cr(n), t !== null && jo(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function qa(e, t, n) {
    nl(e) && n.delete(t);
  }
  function bd() {
    Co = !1, Vt !== null && nl(Vt) && (Vt = null), $t !== null && nl($t) && ($t = null), Ht !== null && nl(Ht) && (Ht = null), ur.forEach(qa), cr.forEach(qa);
  }
  function pr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Co || (Co = !0, d.unstable_scheduleCallback(d.unstable_NormalPriority, bd)));
  }
  function fr(e) {
    function t(l) {
      return pr(l, e);
    }
    if (0 < tl.length) {
      pr(tl[0], e);
      for (var n = 1; n < tl.length; n++) {
        var r = tl[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Vt !== null && pr(Vt, e), $t !== null && pr($t, e), Ht !== null && pr(Ht, e), ur.forEach(t), cr.forEach(t), n = 0; n < Bt.length; n++) r = Bt[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Bt.length && (n = Bt[0], n.blockedOn === null); ) Xa(n), n.blockedOn === null && Bt.shift();
  }
  var _n = Y.ReactCurrentBatchConfig, rl = !0;
  function jd(e, t, n, r) {
    var l = de, o = _n.transition;
    _n.transition = null;
    try {
      de = 1, Eo(e, t, n, r);
    } finally {
      de = l, _n.transition = o;
    }
  }
  function Cd(e, t, n, r) {
    var l = de, o = _n.transition;
    _n.transition = null;
    try {
      de = 4, Eo(e, t, n, r);
    } finally {
      de = l, _n.transition = o;
    }
  }
  function Eo(e, t, n, r) {
    if (rl) {
      var l = No(e, t, n, r);
      if (l === null) Bo(e, t, r, ll, n), Ya(e, r);
      else if (Sd(l, e, t, n, r)) r.stopPropagation();
      else if (Ya(e, r), t & 4 && -1 < kd.indexOf(e)) {
        for (; l !== null; ) {
          var o = Cr(l);
          if (o !== null && Wa(o), o = No(e, t, n, r), o === null && Bo(e, t, r, ll, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else Bo(e, t, r, null, n);
    }
  }
  var ll = null;
  function No(e, t, n, r) {
    if (ll = null, e = ho(r), e = dn(e), e !== null) if (t = cn(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = Oa(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return ll = e, null;
  }
  function Za(e) {
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
        switch (pd()) {
          case wo:
            return 1;
          case Va:
            return 4;
          case Xr:
          case fd:
            return 16;
          case $a:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Wt = null, zo = null, ol = null;
  function Ja() {
    if (ol) return ol;
    var e, t = zo, n = t.length, r, l = "value" in Wt ? Wt.value : Wt.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var a = n - e;
    for (r = 1; r <= a && t[n - r] === l[o - r]; r++) ;
    return ol = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function il(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function al() {
    return !0;
  }
  function es() {
    return !1;
  }
  function nt(e) {
    function t(n, r, l, o, a) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = a, this.currentTarget = null;
      for (var c in e) e.hasOwnProperty(c) && (n = e[c], this[c] = n ? n(o) : o[c]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? al : es, this.isPropagationStopped = es, this;
    }
    return O(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = al);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = al);
    }, persist: function() {
    }, isPersistent: al }), t;
  }
  var Pn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, _o = nt(Pn), mr = O({}, Pn, { view: 0, detail: 0 }), Ed = nt(mr), Po, Mo, hr, sl = O({}, mr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: To, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== hr && (hr && e.type === "mousemove" ? (Po = e.screenX - hr.screenX, Mo = e.screenY - hr.screenY) : Mo = Po = 0, hr = e), Po);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : Mo;
  } }), ts = nt(sl), Nd = O({}, sl, { dataTransfer: 0 }), zd = nt(Nd), _d = O({}, mr, { relatedTarget: 0 }), Lo = nt(_d), Pd = O({}, Pn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Md = nt(Pd), Ld = O({}, Pn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Td = nt(Ld), Rd = O({}, Pn, { data: 0 }), ns = nt(Rd), Od = {
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
  }, Id = {
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
  }, Dd = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ad(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Dd[e]) ? !!t[e] : !1;
  }
  function To() {
    return Ad;
  }
  var Fd = O({}, mr, { key: function(e) {
    if (e.key) {
      var t = Od[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = il(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Id[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: To, charCode: function(e) {
    return e.type === "keypress" ? il(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? il(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Ud = nt(Fd), Vd = O({}, sl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), rs = nt(Vd), $d = O({}, mr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: To }), Hd = nt($d), Bd = O({}, Pn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Wd = nt(Bd), Qd = O({}, sl, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Kd = nt(Qd), Gd = [9, 13, 27, 32], Ro = S && "CompositionEvent" in window, gr = null;
  S && "documentMode" in document && (gr = document.documentMode);
  var Yd = S && "TextEvent" in window && !gr, ls = S && (!Ro || gr && 8 < gr && 11 >= gr), os = " ", is = !1;
  function as(e, t) {
    switch (e) {
      case "keyup":
        return Gd.indexOf(t.keyCode) !== -1;
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
  function ss(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Mn = !1;
  function Xd(e, t) {
    switch (e) {
      case "compositionend":
        return ss(t);
      case "keypress":
        return t.which !== 32 ? null : (is = !0, os);
      case "textInput":
        return e = t.data, e === os && is ? null : e;
      default:
        return null;
    }
  }
  function qd(e, t) {
    if (Mn) return e === "compositionend" || !Ro && as(e, t) ? (e = Ja(), ol = zo = Wt = null, Mn = !1, e) : null;
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
        return ls && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Zd = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function us(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Zd[e.type] : t === "textarea";
  }
  function cs(e, t, n, r) {
    Pa(r), t = fl(t, "onChange"), 0 < t.length && (n = new _o("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var vr = null, yr = null;
  function Jd(e) {
    zs(e, 0);
  }
  function ul(e) {
    var t = In(e);
    if (ya(t)) return e;
  }
  function ep(e, t) {
    if (e === "change") return t;
  }
  var ds = !1;
  if (S) {
    var Oo;
    if (S) {
      var Io = "oninput" in document;
      if (!Io) {
        var ps = document.createElement("div");
        ps.setAttribute("oninput", "return;"), Io = typeof ps.oninput == "function";
      }
      Oo = Io;
    } else Oo = !1;
    ds = Oo && (!document.documentMode || 9 < document.documentMode);
  }
  function fs() {
    vr && (vr.detachEvent("onpropertychange", ms), yr = vr = null);
  }
  function ms(e) {
    if (e.propertyName === "value" && ul(yr)) {
      var t = [];
      cs(t, yr, e, ho(e)), Ra(Jd, t);
    }
  }
  function tp(e, t, n) {
    e === "focusin" ? (fs(), vr = t, yr = n, vr.attachEvent("onpropertychange", ms)) : e === "focusout" && fs();
  }
  function np(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return ul(yr);
  }
  function rp(e, t) {
    if (e === "click") return ul(t);
  }
  function lp(e, t) {
    if (e === "input" || e === "change") return ul(t);
  }
  function op(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ft = typeof Object.is == "function" ? Object.is : op;
  function xr(e, t) {
    if (ft(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!M.call(t, l) || !ft(e[l], t[l])) return !1;
    }
    return !0;
  }
  function hs(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function gs(e, t) {
    var n = hs(e);
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
      n = hs(n);
    }
  }
  function vs(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? vs(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ys() {
    for (var e = window, t = Qr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Qr(e.document);
    }
    return t;
  }
  function Do(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function ip(e) {
    var t = ys(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && vs(n.ownerDocument.documentElement, n)) {
      if (r !== null && Do(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = gs(n, o);
          var a = gs(
            n,
            r
          );
          l && a && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== a.node || e.focusOffset !== a.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), o > r ? (e.addRange(t), e.extend(a.node, a.offset)) : (t.setEnd(a.node, a.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var ap = S && "documentMode" in document && 11 >= document.documentMode, Ln = null, Ao = null, wr = null, Fo = !1;
  function xs(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Fo || Ln == null || Ln !== Qr(r) || (r = Ln, "selectionStart" in r && Do(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), wr && xr(wr, r) || (wr = r, r = fl(Ao, "onSelect"), 0 < r.length && (t = new _o("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = Ln)));
  }
  function cl(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Tn = { animationend: cl("Animation", "AnimationEnd"), animationiteration: cl("Animation", "AnimationIteration"), animationstart: cl("Animation", "AnimationStart"), transitionend: cl("Transition", "TransitionEnd") }, Uo = {}, ws = {};
  S && (ws = document.createElement("div").style, "AnimationEvent" in window || (delete Tn.animationend.animation, delete Tn.animationiteration.animation, delete Tn.animationstart.animation), "TransitionEvent" in window || delete Tn.transitionend.transition);
  function dl(e) {
    if (Uo[e]) return Uo[e];
    if (!Tn[e]) return e;
    var t = Tn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in ws) return Uo[e] = t[n];
    return e;
  }
  var ks = dl("animationend"), Ss = dl("animationiteration"), bs = dl("animationstart"), js = dl("transitionend"), Cs = /* @__PURE__ */ new Map(), Es = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Qt(e, t) {
    Cs.set(e, t), w(t, [e]);
  }
  for (var Vo = 0; Vo < Es.length; Vo++) {
    var $o = Es[Vo], sp = $o.toLowerCase(), up = $o[0].toUpperCase() + $o.slice(1);
    Qt(sp, "on" + up);
  }
  Qt(ks, "onAnimationEnd"), Qt(Ss, "onAnimationIteration"), Qt(bs, "onAnimationStart"), Qt("dblclick", "onDoubleClick"), Qt("focusin", "onFocus"), Qt("focusout", "onBlur"), Qt(js, "onTransitionEnd"), k("onMouseEnter", ["mouseout", "mouseover"]), k("onMouseLeave", ["mouseout", "mouseover"]), k("onPointerEnter", ["pointerout", "pointerover"]), k("onPointerLeave", ["pointerout", "pointerover"]), w("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), w("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), w("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), w("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), w("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), w("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var kr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), cp = new Set("cancel close invalid load scroll toggle".split(" ").concat(kr));
  function Ns(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, sd(r, t, void 0, e), e.currentTarget = null;
  }
  function zs(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var a = r.length - 1; 0 <= a; a--) {
          var c = r[a], p = c.instance, x = c.currentTarget;
          if (c = c.listener, p !== o && l.isPropagationStopped()) break e;
          Ns(l, c, x), o = p;
        }
        else for (a = 0; a < r.length; a++) {
          if (c = r[a], p = c.instance, x = c.currentTarget, c = c.listener, p !== o && l.isPropagationStopped()) break e;
          Ns(l, c, x), o = p;
        }
      }
    }
    if (Yr) throw e = xo, Yr = !1, xo = null, e;
  }
  function he(e, t) {
    var n = t[Xo];
    n === void 0 && (n = t[Xo] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (_s(t, e, 2, !1), n.add(r));
  }
  function Ho(e, t, n) {
    var r = 0;
    t && (r |= 4), _s(n, e, r, t);
  }
  var pl = "_reactListening" + Math.random().toString(36).slice(2);
  function Sr(e) {
    if (!e[pl]) {
      e[pl] = !0, g.forEach(function(n) {
        n !== "selectionchange" && (cp.has(n) || Ho(n, !1, e), Ho(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[pl] || (t[pl] = !0, Ho("selectionchange", !1, t));
    }
  }
  function _s(e, t, n, r) {
    switch (Za(t)) {
      case 1:
        var l = jd;
        break;
      case 4:
        l = Cd;
        break;
      default:
        l = Eo;
    }
    n = l.bind(null, t, n, e), l = void 0, !yo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Bo(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var a = r.tag;
      if (a === 3 || a === 4) {
        var c = r.stateNode.containerInfo;
        if (c === l || c.nodeType === 8 && c.parentNode === l) break;
        if (a === 4) for (a = r.return; a !== null; ) {
          var p = a.tag;
          if ((p === 3 || p === 4) && (p = a.stateNode.containerInfo, p === l || p.nodeType === 8 && p.parentNode === l)) return;
          a = a.return;
        }
        for (; c !== null; ) {
          if (a = dn(c), a === null) return;
          if (p = a.tag, p === 5 || p === 6) {
            r = o = a;
            continue e;
          }
          c = c.parentNode;
        }
      }
      r = r.return;
    }
    Ra(function() {
      var x = o, C = ho(n), z = [];
      e: {
        var b = Cs.get(e);
        if (b !== void 0) {
          var R = _o, A = e;
          switch (e) {
            case "keypress":
              if (il(n) === 0) break e;
            case "keydown":
            case "keyup":
              R = Ud;
              break;
            case "focusin":
              A = "focus", R = Lo;
              break;
            case "focusout":
              A = "blur", R = Lo;
              break;
            case "beforeblur":
            case "afterblur":
              R = Lo;
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
              R = ts;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              R = zd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              R = Hd;
              break;
            case ks:
            case Ss:
            case bs:
              R = Md;
              break;
            case js:
              R = Wd;
              break;
            case "scroll":
              R = Ed;
              break;
            case "wheel":
              R = Kd;
              break;
            case "copy":
            case "cut":
            case "paste":
              R = Td;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              R = rs;
          }
          var U = (t & 4) !== 0, Ne = !U && e === "scroll", v = U ? b !== null ? b + "Capture" : null : b;
          U = [];
          for (var f = x, y; f !== null; ) {
            y = f;
            var P = y.stateNode;
            if (y.tag === 5 && P !== null && (y = P, v !== null && (P = lr(f, v), P != null && U.push(br(f, P, y)))), Ne) break;
            f = f.return;
          }
          0 < U.length && (b = new R(b, A, null, n, C), z.push({ event: b, listeners: U }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (b = e === "mouseover" || e === "pointerover", R = e === "mouseout" || e === "pointerout", b && n !== mo && (A = n.relatedTarget || n.fromElement) && (dn(A) || A[zt])) break e;
          if ((R || b) && (b = C.window === C ? C : (b = C.ownerDocument) ? b.defaultView || b.parentWindow : window, R ? (A = n.relatedTarget || n.toElement, R = x, A = A ? dn(A) : null, A !== null && (Ne = cn(A), A !== Ne || A.tag !== 5 && A.tag !== 6) && (A = null)) : (R = null, A = x), R !== A)) {
            if (U = ts, P = "onMouseLeave", v = "onMouseEnter", f = "mouse", (e === "pointerout" || e === "pointerover") && (U = rs, P = "onPointerLeave", v = "onPointerEnter", f = "pointer"), Ne = R == null ? b : In(R), y = A == null ? b : In(A), b = new U(P, f + "leave", R, n, C), b.target = Ne, b.relatedTarget = y, P = null, dn(C) === x && (U = new U(v, f + "enter", A, n, C), U.target = y, U.relatedTarget = Ne, P = U), Ne = P, R && A) t: {
              for (U = R, v = A, f = 0, y = U; y; y = Rn(y)) f++;
              for (y = 0, P = v; P; P = Rn(P)) y++;
              for (; 0 < f - y; ) U = Rn(U), f--;
              for (; 0 < y - f; ) v = Rn(v), y--;
              for (; f--; ) {
                if (U === v || v !== null && U === v.alternate) break t;
                U = Rn(U), v = Rn(v);
              }
              U = null;
            }
            else U = null;
            R !== null && Ps(z, b, R, U, !1), A !== null && Ne !== null && Ps(z, Ne, A, U, !0);
          }
        }
        e: {
          if (b = x ? In(x) : window, R = b.nodeName && b.nodeName.toLowerCase(), R === "select" || R === "input" && b.type === "file") var V = ep;
          else if (us(b)) if (ds) V = lp;
          else {
            V = np;
            var Q = tp;
          }
          else (R = b.nodeName) && R.toLowerCase() === "input" && (b.type === "checkbox" || b.type === "radio") && (V = rp);
          if (V && (V = V(e, x))) {
            cs(z, V, n, C);
            break e;
          }
          Q && Q(e, b, x), e === "focusout" && (Q = b._wrapperState) && Q.controlled && b.type === "number" && so(b, "number", b.value);
        }
        switch (Q = x ? In(x) : window, e) {
          case "focusin":
            (us(Q) || Q.contentEditable === "true") && (Ln = Q, Ao = x, wr = null);
            break;
          case "focusout":
            wr = Ao = Ln = null;
            break;
          case "mousedown":
            Fo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Fo = !1, xs(z, n, C);
            break;
          case "selectionchange":
            if (ap) break;
          case "keydown":
          case "keyup":
            xs(z, n, C);
        }
        var K;
        if (Ro) e: {
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
        else Mn ? as(e, n) && (X = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (X = "onCompositionStart");
        X && (ls && n.locale !== "ko" && (Mn || X !== "onCompositionStart" ? X === "onCompositionEnd" && Mn && (K = Ja()) : (Wt = C, zo = "value" in Wt ? Wt.value : Wt.textContent, Mn = !0)), Q = fl(x, X), 0 < Q.length && (X = new ns(X, e, null, n, C), z.push({ event: X, listeners: Q }), K ? X.data = K : (K = ss(n), K !== null && (X.data = K)))), (K = Yd ? Xd(e, n) : qd(e, n)) && (x = fl(x, "onBeforeInput"), 0 < x.length && (C = new ns("onBeforeInput", "beforeinput", null, n, C), z.push({ event: C, listeners: x }), C.data = K));
      }
      zs(z, t);
    });
  }
  function br(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function fl(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = lr(e, n), o != null && r.unshift(br(e, o, l)), o = lr(e, t), o != null && r.push(br(e, o, l))), e = e.return;
    }
    return r;
  }
  function Rn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Ps(e, t, n, r, l) {
    for (var o = t._reactName, a = []; n !== null && n !== r; ) {
      var c = n, p = c.alternate, x = c.stateNode;
      if (p !== null && p === r) break;
      c.tag === 5 && x !== null && (c = x, l ? (p = lr(n, o), p != null && a.unshift(br(n, p, c))) : l || (p = lr(n, o), p != null && a.push(br(n, p, c)))), n = n.return;
    }
    a.length !== 0 && e.push({ event: t, listeners: a });
  }
  var dp = /\r\n?/g, pp = /\u0000|\uFFFD/g;
  function Ms(e) {
    return (typeof e == "string" ? e : "" + e).replace(dp, `
`).replace(pp, "");
  }
  function ml(e, t, n) {
    if (t = Ms(t), Ms(e) !== t && n) throw Error(s(425));
  }
  function hl() {
  }
  var Wo = null, Qo = null;
  function Ko(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Go = typeof setTimeout == "function" ? setTimeout : void 0, fp = typeof clearTimeout == "function" ? clearTimeout : void 0, Ls = typeof Promise == "function" ? Promise : void 0, mp = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ls < "u" ? function(e) {
    return Ls.resolve(null).then(e).catch(hp);
  } : Go;
  function hp(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Yo(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), fr(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    fr(t);
  }
  function Kt(e) {
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
  function Ts(e) {
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
  var On = Math.random().toString(36).slice(2), St = "__reactFiber$" + On, jr = "__reactProps$" + On, zt = "__reactContainer$" + On, Xo = "__reactEvents$" + On, gp = "__reactListeners$" + On, vp = "__reactHandles$" + On;
  function dn(e) {
    var t = e[St];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[zt] || n[St]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = Ts(e); e !== null; ) {
          if (n = e[St]) return n;
          e = Ts(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Cr(e) {
    return e = e[St] || e[zt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function In(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(s(33));
  }
  function gl(e) {
    return e[jr] || null;
  }
  var qo = [], Dn = -1;
  function Gt(e) {
    return { current: e };
  }
  function ge(e) {
    0 > Dn || (e.current = qo[Dn], qo[Dn] = null, Dn--);
  }
  function fe(e, t) {
    Dn++, qo[Dn] = e.current, e.current = t;
  }
  var Yt = {}, $e = Gt(Yt), Ge = Gt(!1), pn = Yt;
  function An(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Yt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in n) l[o] = t[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ye(e) {
    return e = e.childContextTypes, e != null;
  }
  function vl() {
    ge(Ge), ge($e);
  }
  function Rs(e, t, n) {
    if ($e.current !== Yt) throw Error(s(168));
    fe($e, t), fe(Ge, n);
  }
  function Os(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(s(108, pe(e) || "Unknown", l));
    return O({}, n, r);
  }
  function yl(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Yt, pn = $e.current, fe($e, e), fe(Ge, Ge.current), !0;
  }
  function Is(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(s(169));
    n ? (e = Os(e, t, pn), r.__reactInternalMemoizedMergedChildContext = e, ge(Ge), ge($e), fe($e, e)) : ge(Ge), fe(Ge, n);
  }
  var _t = null, xl = !1, Zo = !1;
  function Ds(e) {
    _t === null ? _t = [e] : _t.push(e);
  }
  function yp(e) {
    xl = !0, Ds(e);
  }
  function Xt() {
    if (!Zo && _t !== null) {
      Zo = !0;
      var e = 0, t = de;
      try {
        var n = _t;
        for (de = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        _t = null, xl = !1;
      } catch (l) {
        throw _t !== null && (_t = _t.slice(e + 1)), Fa(wo, Xt), l;
      } finally {
        de = t, Zo = !1;
      }
    }
    return null;
  }
  var Fn = [], Un = 0, wl = null, kl = 0, it = [], at = 0, fn = null, Pt = 1, Mt = "";
  function mn(e, t) {
    Fn[Un++] = kl, Fn[Un++] = wl, wl = e, kl = t;
  }
  function As(e, t, n) {
    it[at++] = Pt, it[at++] = Mt, it[at++] = fn, fn = e;
    var r = Pt;
    e = Mt;
    var l = 32 - pt(r) - 1;
    r &= ~(1 << l), n += 1;
    var o = 32 - pt(t) + l;
    if (30 < o) {
      var a = l - l % 5;
      o = (r & (1 << a) - 1).toString(32), r >>= a, l -= a, Pt = 1 << 32 - pt(t) + l | n << l | r, Mt = o + e;
    } else Pt = 1 << o | n << l | r, Mt = e;
  }
  function Jo(e) {
    e.return !== null && (mn(e, 1), As(e, 1, 0));
  }
  function ei(e) {
    for (; e === wl; ) wl = Fn[--Un], Fn[Un] = null, kl = Fn[--Un], Fn[Un] = null;
    for (; e === fn; ) fn = it[--at], it[at] = null, Mt = it[--at], it[at] = null, Pt = it[--at], it[at] = null;
  }
  var rt = null, lt = null, ke = !1, mt = null;
  function Fs(e, t) {
    var n = dt(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Us(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, rt = e, lt = Kt(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, rt = e, lt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = fn !== null ? { id: Pt, overflow: Mt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = dt(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, rt = e, lt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function ti(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function ni(e) {
    if (ke) {
      var t = lt;
      if (t) {
        var n = t;
        if (!Us(e, t)) {
          if (ti(e)) throw Error(s(418));
          t = Kt(n.nextSibling);
          var r = rt;
          t && Us(e, t) ? Fs(r, n) : (e.flags = e.flags & -4097 | 2, ke = !1, rt = e);
        }
      } else {
        if (ti(e)) throw Error(s(418));
        e.flags = e.flags & -4097 | 2, ke = !1, rt = e;
      }
    }
  }
  function Vs(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    rt = e;
  }
  function Sl(e) {
    if (e !== rt) return !1;
    if (!ke) return Vs(e), ke = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Ko(e.type, e.memoizedProps)), t && (t = lt)) {
      if (ti(e)) throw $s(), Error(s(418));
      for (; t; ) Fs(e, t), t = Kt(t.nextSibling);
    }
    if (Vs(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                lt = Kt(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        lt = null;
      }
    } else lt = rt ? Kt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function $s() {
    for (var e = lt; e; ) e = Kt(e.nextSibling);
  }
  function Vn() {
    lt = rt = null, ke = !1;
  }
  function ri(e) {
    mt === null ? mt = [e] : mt.push(e);
  }
  var xp = Y.ReactCurrentBatchConfig;
  function Er(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(s(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(s(147, e));
        var l = r, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(a) {
          var c = l.refs;
          a === null ? delete c[o] : c[o] = a;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(s(284));
      if (!n._owner) throw Error(s(290, e));
    }
    return e;
  }
  function bl(e, t) {
    throw e = Object.prototype.toString.call(t), Error(s(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Hs(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Bs(e) {
    function t(v, f) {
      if (e) {
        var y = v.deletions;
        y === null ? (v.deletions = [f], v.flags |= 16) : y.push(f);
      }
    }
    function n(v, f) {
      if (!e) return null;
      for (; f !== null; ) t(v, f), f = f.sibling;
      return null;
    }
    function r(v, f) {
      for (v = /* @__PURE__ */ new Map(); f !== null; ) f.key !== null ? v.set(f.key, f) : v.set(f.index, f), f = f.sibling;
      return v;
    }
    function l(v, f) {
      return v = ln(v, f), v.index = 0, v.sibling = null, v;
    }
    function o(v, f, y) {
      return v.index = y, e ? (y = v.alternate, y !== null ? (y = y.index, y < f ? (v.flags |= 2, f) : y) : (v.flags |= 2, f)) : (v.flags |= 1048576, f);
    }
    function a(v) {
      return e && v.alternate === null && (v.flags |= 2), v;
    }
    function c(v, f, y, P) {
      return f === null || f.tag !== 6 ? (f = Gi(y, v.mode, P), f.return = v, f) : (f = l(f, y), f.return = v, f);
    }
    function p(v, f, y, P) {
      var V = y.type;
      return V === ye ? C(v, f, y.props.children, P, y.key) : f !== null && (f.elementType === V || typeof V == "object" && V !== null && V.$$typeof === Pe && Hs(V) === f.type) ? (P = l(f, y.props), P.ref = Er(v, f, y), P.return = v, P) : (P = Kl(y.type, y.key, y.props, null, v.mode, P), P.ref = Er(v, f, y), P.return = v, P);
    }
    function x(v, f, y, P) {
      return f === null || f.tag !== 4 || f.stateNode.containerInfo !== y.containerInfo || f.stateNode.implementation !== y.implementation ? (f = Yi(y, v.mode, P), f.return = v, f) : (f = l(f, y.children || []), f.return = v, f);
    }
    function C(v, f, y, P, V) {
      return f === null || f.tag !== 7 ? (f = Sn(y, v.mode, P, V), f.return = v, f) : (f = l(f, y), f.return = v, f);
    }
    function z(v, f, y) {
      if (typeof f == "string" && f !== "" || typeof f == "number") return f = Gi("" + f, v.mode, y), f.return = v, f;
      if (typeof f == "object" && f !== null) {
        switch (f.$$typeof) {
          case oe:
            return y = Kl(f.type, f.key, f.props, null, v.mode, y), y.ref = Er(v, null, f), y.return = v, y;
          case J:
            return f = Yi(f, v.mode, y), f.return = v, f;
          case Pe:
            var P = f._init;
            return z(v, P(f._payload), y);
        }
        if (tr(f) || H(f)) return f = Sn(f, v.mode, y, null), f.return = v, f;
        bl(v, f);
      }
      return null;
    }
    function b(v, f, y, P) {
      var V = f !== null ? f.key : null;
      if (typeof y == "string" && y !== "" || typeof y == "number") return V !== null ? null : c(v, f, "" + y, P);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case oe:
            return y.key === V ? p(v, f, y, P) : null;
          case J:
            return y.key === V ? x(v, f, y, P) : null;
          case Pe:
            return V = y._init, b(
              v,
              f,
              V(y._payload),
              P
            );
        }
        if (tr(y) || H(y)) return V !== null ? null : C(v, f, y, P, null);
        bl(v, y);
      }
      return null;
    }
    function R(v, f, y, P, V) {
      if (typeof P == "string" && P !== "" || typeof P == "number") return v = v.get(y) || null, c(f, v, "" + P, V);
      if (typeof P == "object" && P !== null) {
        switch (P.$$typeof) {
          case oe:
            return v = v.get(P.key === null ? y : P.key) || null, p(f, v, P, V);
          case J:
            return v = v.get(P.key === null ? y : P.key) || null, x(f, v, P, V);
          case Pe:
            var Q = P._init;
            return R(v, f, y, Q(P._payload), V);
        }
        if (tr(P) || H(P)) return v = v.get(y) || null, C(f, v, P, V, null);
        bl(f, P);
      }
      return null;
    }
    function A(v, f, y, P) {
      for (var V = null, Q = null, K = f, X = f = 0, Oe = null; K !== null && X < y.length; X++) {
        K.index > X ? (Oe = K, K = null) : Oe = K.sibling;
        var ue = b(v, K, y[X], P);
        if (ue === null) {
          K === null && (K = Oe);
          break;
        }
        e && K && ue.alternate === null && t(v, K), f = o(ue, f, X), Q === null ? V = ue : Q.sibling = ue, Q = ue, K = Oe;
      }
      if (X === y.length) return n(v, K), ke && mn(v, X), V;
      if (K === null) {
        for (; X < y.length; X++) K = z(v, y[X], P), K !== null && (f = o(K, f, X), Q === null ? V = K : Q.sibling = K, Q = K);
        return ke && mn(v, X), V;
      }
      for (K = r(v, K); X < y.length; X++) Oe = R(K, v, X, y[X], P), Oe !== null && (e && Oe.alternate !== null && K.delete(Oe.key === null ? X : Oe.key), f = o(Oe, f, X), Q === null ? V = Oe : Q.sibling = Oe, Q = Oe);
      return e && K.forEach(function(on) {
        return t(v, on);
      }), ke && mn(v, X), V;
    }
    function U(v, f, y, P) {
      var V = H(y);
      if (typeof V != "function") throw Error(s(150));
      if (y = V.call(y), y == null) throw Error(s(151));
      for (var Q = V = null, K = f, X = f = 0, Oe = null, ue = y.next(); K !== null && !ue.done; X++, ue = y.next()) {
        K.index > X ? (Oe = K, K = null) : Oe = K.sibling;
        var on = b(v, K, ue.value, P);
        if (on === null) {
          K === null && (K = Oe);
          break;
        }
        e && K && on.alternate === null && t(v, K), f = o(on, f, X), Q === null ? V = on : Q.sibling = on, Q = on, K = Oe;
      }
      if (ue.done) return n(
        v,
        K
      ), ke && mn(v, X), V;
      if (K === null) {
        for (; !ue.done; X++, ue = y.next()) ue = z(v, ue.value, P), ue !== null && (f = o(ue, f, X), Q === null ? V = ue : Q.sibling = ue, Q = ue);
        return ke && mn(v, X), V;
      }
      for (K = r(v, K); !ue.done; X++, ue = y.next()) ue = R(K, v, X, ue.value, P), ue !== null && (e && ue.alternate !== null && K.delete(ue.key === null ? X : ue.key), f = o(ue, f, X), Q === null ? V = ue : Q.sibling = ue, Q = ue);
      return e && K.forEach(function(Zp) {
        return t(v, Zp);
      }), ke && mn(v, X), V;
    }
    function Ne(v, f, y, P) {
      if (typeof y == "object" && y !== null && y.type === ye && y.key === null && (y = y.props.children), typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case oe:
            e: {
              for (var V = y.key, Q = f; Q !== null; ) {
                if (Q.key === V) {
                  if (V = y.type, V === ye) {
                    if (Q.tag === 7) {
                      n(v, Q.sibling), f = l(Q, y.props.children), f.return = v, v = f;
                      break e;
                    }
                  } else if (Q.elementType === V || typeof V == "object" && V !== null && V.$$typeof === Pe && Hs(V) === Q.type) {
                    n(v, Q.sibling), f = l(Q, y.props), f.ref = Er(v, Q, y), f.return = v, v = f;
                    break e;
                  }
                  n(v, Q);
                  break;
                } else t(v, Q);
                Q = Q.sibling;
              }
              y.type === ye ? (f = Sn(y.props.children, v.mode, P, y.key), f.return = v, v = f) : (P = Kl(y.type, y.key, y.props, null, v.mode, P), P.ref = Er(v, f, y), P.return = v, v = P);
            }
            return a(v);
          case J:
            e: {
              for (Q = y.key; f !== null; ) {
                if (f.key === Q) if (f.tag === 4 && f.stateNode.containerInfo === y.containerInfo && f.stateNode.implementation === y.implementation) {
                  n(v, f.sibling), f = l(f, y.children || []), f.return = v, v = f;
                  break e;
                } else {
                  n(v, f);
                  break;
                }
                else t(v, f);
                f = f.sibling;
              }
              f = Yi(y, v.mode, P), f.return = v, v = f;
            }
            return a(v);
          case Pe:
            return Q = y._init, Ne(v, f, Q(y._payload), P);
        }
        if (tr(y)) return A(v, f, y, P);
        if (H(y)) return U(v, f, y, P);
        bl(v, y);
      }
      return typeof y == "string" && y !== "" || typeof y == "number" ? (y = "" + y, f !== null && f.tag === 6 ? (n(v, f.sibling), f = l(f, y), f.return = v, v = f) : (n(v, f), f = Gi(y, v.mode, P), f.return = v, v = f), a(v)) : n(v, f);
    }
    return Ne;
  }
  var $n = Bs(!0), Ws = Bs(!1), jl = Gt(null), Cl = null, Hn = null, li = null;
  function oi() {
    li = Hn = Cl = null;
  }
  function ii(e) {
    var t = jl.current;
    ge(jl), e._currentValue = t;
  }
  function ai(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Bn(e, t) {
    Cl = e, li = Hn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Xe = !0), e.firstContext = null);
  }
  function st(e) {
    var t = e._currentValue;
    if (li !== e) if (e = { context: e, memoizedValue: t, next: null }, Hn === null) {
      if (Cl === null) throw Error(s(308));
      Hn = e, Cl.dependencies = { lanes: 0, firstContext: e };
    } else Hn = Hn.next = e;
    return t;
  }
  var hn = null;
  function si(e) {
    hn === null ? hn = [e] : hn.push(e);
  }
  function Qs(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, si(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Lt(e, r);
  }
  function Lt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var qt = !1;
  function ui(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Ks(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Tt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Zt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (ie & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Lt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, si(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Lt(e, n);
  }
  function El(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, bo(e, n);
    }
  }
  function Gs(e, t) {
    var n = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
      var l = null, o = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var a = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          o === null ? l = o = a : o = o.next = a, n = n.next;
        } while (n !== null);
        o === null ? l = o = t : o = o.next = t;
      } else l = o = t;
      n = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: o, shared: r.shared, effects: r.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function Nl(e, t, n, r) {
    var l = e.updateQueue;
    qt = !1;
    var o = l.firstBaseUpdate, a = l.lastBaseUpdate, c = l.shared.pending;
    if (c !== null) {
      l.shared.pending = null;
      var p = c, x = p.next;
      p.next = null, a === null ? o = x : a.next = x, a = p;
      var C = e.alternate;
      C !== null && (C = C.updateQueue, c = C.lastBaseUpdate, c !== a && (c === null ? C.firstBaseUpdate = x : c.next = x, C.lastBaseUpdate = p));
    }
    if (o !== null) {
      var z = l.baseState;
      a = 0, C = x = p = null, c = o;
      do {
        var b = c.lane, R = c.eventTime;
        if ((r & b) === b) {
          C !== null && (C = C.next = {
            eventTime: R,
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null
          });
          e: {
            var A = e, U = c;
            switch (b = t, R = n, U.tag) {
              case 1:
                if (A = U.payload, typeof A == "function") {
                  z = A.call(R, z, b);
                  break e;
                }
                z = A;
                break e;
              case 3:
                A.flags = A.flags & -65537 | 128;
              case 0:
                if (A = U.payload, b = typeof A == "function" ? A.call(R, z, b) : A, b == null) break e;
                z = O({}, z, b);
                break e;
              case 2:
                qt = !0;
            }
          }
          c.callback !== null && c.lane !== 0 && (e.flags |= 64, b = l.effects, b === null ? l.effects = [c] : b.push(c));
        } else R = { eventTime: R, lane: b, tag: c.tag, payload: c.payload, callback: c.callback, next: null }, C === null ? (x = C = R, p = z) : C = C.next = R, a |= b;
        if (c = c.next, c === null) {
          if (c = l.shared.pending, c === null) break;
          b = c, c = b.next, b.next = null, l.lastBaseUpdate = b, l.shared.pending = null;
        }
      } while (!0);
      if (C === null && (p = z), l.baseState = p, l.firstBaseUpdate = x, l.lastBaseUpdate = C, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          a |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      yn |= a, e.lanes = a, e.memoizedState = z;
    }
  }
  function Ys(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(s(191, l));
        l.call(r);
      }
    }
  }
  var Nr = {}, bt = Gt(Nr), zr = Gt(Nr), _r = Gt(Nr);
  function gn(e) {
    if (e === Nr) throw Error(s(174));
    return e;
  }
  function ci(e, t) {
    switch (fe(_r, t), fe(zr, e), fe(bt, Nr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : co(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = co(t, e);
    }
    ge(bt), fe(bt, t);
  }
  function Wn() {
    ge(bt), ge(zr), ge(_r);
  }
  function Xs(e) {
    gn(_r.current);
    var t = gn(bt.current), n = co(t, e.type);
    t !== n && (fe(zr, e), fe(bt, n));
  }
  function di(e) {
    zr.current === e && (ge(bt), ge(zr));
  }
  var Se = Gt(0);
  function zl(e) {
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
  var pi = [];
  function fi() {
    for (var e = 0; e < pi.length; e++) pi[e]._workInProgressVersionPrimary = null;
    pi.length = 0;
  }
  var _l = Y.ReactCurrentDispatcher, mi = Y.ReactCurrentBatchConfig, vn = 0, be = null, Me = null, Te = null, Pl = !1, Pr = !1, Mr = 0, wp = 0;
  function He() {
    throw Error(s(321));
  }
  function hi(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ft(e[n], t[n])) return !1;
    return !0;
  }
  function gi(e, t, n, r, l, o) {
    if (vn = o, be = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, _l.current = e === null || e.memoizedState === null ? jp : Cp, e = n(r, l), Pr) {
      o = 0;
      do {
        if (Pr = !1, Mr = 0, 25 <= o) throw Error(s(301));
        o += 1, Te = Me = null, t.updateQueue = null, _l.current = Ep, e = n(r, l);
      } while (Pr);
    }
    if (_l.current = Tl, t = Me !== null && Me.next !== null, vn = 0, Te = Me = be = null, Pl = !1, t) throw Error(s(300));
    return e;
  }
  function vi() {
    var e = Mr !== 0;
    return Mr = 0, e;
  }
  function jt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Te === null ? be.memoizedState = Te = e : Te = Te.next = e, Te;
  }
  function ut() {
    if (Me === null) {
      var e = be.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Me.next;
    var t = Te === null ? be.memoizedState : Te.next;
    if (t !== null) Te = t, Me = e;
    else {
      if (e === null) throw Error(s(310));
      Me = e, e = { memoizedState: Me.memoizedState, baseState: Me.baseState, baseQueue: Me.baseQueue, queue: Me.queue, next: null }, Te === null ? be.memoizedState = Te = e : Te = Te.next = e;
    }
    return Te;
  }
  function Lr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function yi(e) {
    var t = ut(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = Me, l = r.baseQueue, o = n.pending;
    if (o !== null) {
      if (l !== null) {
        var a = l.next;
        l.next = o.next, o.next = a;
      }
      r.baseQueue = l = o, n.pending = null;
    }
    if (l !== null) {
      o = l.next, r = r.baseState;
      var c = a = null, p = null, x = o;
      do {
        var C = x.lane;
        if ((vn & C) === C) p !== null && (p = p.next = { lane: 0, action: x.action, hasEagerState: x.hasEagerState, eagerState: x.eagerState, next: null }), r = x.hasEagerState ? x.eagerState : e(r, x.action);
        else {
          var z = {
            lane: C,
            action: x.action,
            hasEagerState: x.hasEagerState,
            eagerState: x.eagerState,
            next: null
          };
          p === null ? (c = p = z, a = r) : p = p.next = z, be.lanes |= C, yn |= C;
        }
        x = x.next;
      } while (x !== null && x !== o);
      p === null ? a = r : p.next = c, ft(r, t.memoizedState) || (Xe = !0), t.memoizedState = r, t.baseState = a, t.baseQueue = p, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, be.lanes |= o, yn |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function xi(e) {
    var t = ut(), n = t.queue;
    if (n === null) throw Error(s(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, o = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var a = l = l.next;
      do
        o = e(o, a.action), a = a.next;
      while (a !== l);
      ft(o, t.memoizedState) || (Xe = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
    }
    return [o, r];
  }
  function qs() {
  }
  function Zs(e, t) {
    var n = be, r = ut(), l = t(), o = !ft(r.memoizedState, l);
    if (o && (r.memoizedState = l, Xe = !0), r = r.queue, wi(tu.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || Te !== null && Te.memoizedState.tag & 1) {
      if (n.flags |= 2048, Tr(9, eu.bind(null, n, r, l, t), void 0, null), Re === null) throw Error(s(349));
      (vn & 30) !== 0 || Js(n, t, l);
    }
    return l;
  }
  function Js(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = be.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, be.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function eu(e, t, n, r) {
    t.value = n, t.getSnapshot = r, nu(t) && ru(e);
  }
  function tu(e, t, n) {
    return n(function() {
      nu(t) && ru(e);
    });
  }
  function nu(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ft(e, n);
    } catch {
      return !0;
    }
  }
  function ru(e) {
    var t = Lt(e, 1);
    t !== null && yt(t, e, 1, -1);
  }
  function lu(e) {
    var t = jt();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Lr, lastRenderedState: e }, t.queue = e, e = e.dispatch = bp.bind(null, be, e), [t.memoizedState, e];
  }
  function Tr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = be.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, be.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function ou() {
    return ut().memoizedState;
  }
  function Ml(e, t, n, r) {
    var l = jt();
    be.flags |= e, l.memoizedState = Tr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function Ll(e, t, n, r) {
    var l = ut();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (Me !== null) {
      var a = Me.memoizedState;
      if (o = a.destroy, r !== null && hi(r, a.deps)) {
        l.memoizedState = Tr(t, n, o, r);
        return;
      }
    }
    be.flags |= e, l.memoizedState = Tr(1 | t, n, o, r);
  }
  function iu(e, t) {
    return Ml(8390656, 8, e, t);
  }
  function wi(e, t) {
    return Ll(2048, 8, e, t);
  }
  function au(e, t) {
    return Ll(4, 2, e, t);
  }
  function su(e, t) {
    return Ll(4, 4, e, t);
  }
  function uu(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function cu(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Ll(4, 4, uu.bind(null, t, e), n);
  }
  function ki() {
  }
  function du(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && hi(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function pu(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && hi(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function fu(e, t, n) {
    return (vn & 21) === 0 ? (e.baseState && (e.baseState = !1, Xe = !0), e.memoizedState = n) : (ft(n, t) || (n = Ha(), be.lanes |= n, yn |= n, e.baseState = !0), t);
  }
  function kp(e, t) {
    var n = de;
    de = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = mi.transition;
    mi.transition = {};
    try {
      e(!1), t();
    } finally {
      de = n, mi.transition = r;
    }
  }
  function mu() {
    return ut().memoizedState;
  }
  function Sp(e, t, n) {
    var r = nn(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, hu(e)) gu(t, n);
    else if (n = Qs(e, t, n, r), n !== null) {
      var l = Ke();
      yt(n, e, r, l), vu(n, t, r);
    }
  }
  function bp(e, t, n) {
    var r = nn(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (hu(e)) gu(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var a = t.lastRenderedState, c = o(a, n);
        if (l.hasEagerState = !0, l.eagerState = c, ft(c, a)) {
          var p = t.interleaved;
          p === null ? (l.next = l, si(t)) : (l.next = p.next, p.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = Qs(e, t, l, r), n !== null && (l = Ke(), yt(n, e, r, l), vu(n, t, r));
    }
  }
  function hu(e) {
    var t = e.alternate;
    return e === be || t !== null && t === be;
  }
  function gu(e, t) {
    Pr = Pl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function vu(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, bo(e, n);
    }
  }
  var Tl = { readContext: st, useCallback: He, useContext: He, useEffect: He, useImperativeHandle: He, useInsertionEffect: He, useLayoutEffect: He, useMemo: He, useReducer: He, useRef: He, useState: He, useDebugValue: He, useDeferredValue: He, useTransition: He, useMutableSource: He, useSyncExternalStore: He, useId: He, unstable_isNewReconciler: !1 }, jp = { readContext: st, useCallback: function(e, t) {
    return jt().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: st, useEffect: iu, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, Ml(
      4194308,
      4,
      uu.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return Ml(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return Ml(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = jt();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = jt();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Sp.bind(null, be, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = jt();
    return e = { current: e }, t.memoizedState = e;
  }, useState: lu, useDebugValue: ki, useDeferredValue: function(e) {
    return jt().memoizedState = e;
  }, useTransition: function() {
    var e = lu(!1), t = e[0];
    return e = kp.bind(null, e[1]), jt().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = be, l = jt();
    if (ke) {
      if (n === void 0) throw Error(s(407));
      n = n();
    } else {
      if (n = t(), Re === null) throw Error(s(349));
      (vn & 30) !== 0 || Js(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, iu(tu.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, Tr(9, eu.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = jt(), t = Re.identifierPrefix;
    if (ke) {
      var n = Mt, r = Pt;
      n = (r & ~(1 << 32 - pt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Mr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = wp++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Cp = {
    readContext: st,
    useCallback: du,
    useContext: st,
    useEffect: wi,
    useImperativeHandle: cu,
    useInsertionEffect: au,
    useLayoutEffect: su,
    useMemo: pu,
    useReducer: yi,
    useRef: ou,
    useState: function() {
      return yi(Lr);
    },
    useDebugValue: ki,
    useDeferredValue: function(e) {
      var t = ut();
      return fu(t, Me.memoizedState, e);
    },
    useTransition: function() {
      var e = yi(Lr)[0], t = ut().memoizedState;
      return [e, t];
    },
    useMutableSource: qs,
    useSyncExternalStore: Zs,
    useId: mu,
    unstable_isNewReconciler: !1
  }, Ep = { readContext: st, useCallback: du, useContext: st, useEffect: wi, useImperativeHandle: cu, useInsertionEffect: au, useLayoutEffect: su, useMemo: pu, useReducer: xi, useRef: ou, useState: function() {
    return xi(Lr);
  }, useDebugValue: ki, useDeferredValue: function(e) {
    var t = ut();
    return Me === null ? t.memoizedState = e : fu(t, Me.memoizedState, e);
  }, useTransition: function() {
    var e = xi(Lr)[0], t = ut().memoizedState;
    return [e, t];
  }, useMutableSource: qs, useSyncExternalStore: Zs, useId: mu, unstable_isNewReconciler: !1 };
  function ht(e, t) {
    if (e && e.defaultProps) {
      t = O({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function Si(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : O({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Rl = { isMounted: function(e) {
    return (e = e._reactInternals) ? cn(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = nn(e), o = Tt(r, l);
    o.payload = t, n != null && (o.callback = n), t = Zt(e, o, l), t !== null && (yt(t, e, l, r), El(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = nn(e), o = Tt(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Zt(e, o, l), t !== null && (yt(t, e, l, r), El(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Ke(), r = nn(e), l = Tt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Zt(e, l, r), t !== null && (yt(t, e, r, n), El(t, e, r));
  } };
  function yu(e, t, n, r, l, o, a) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, a) : t.prototype && t.prototype.isPureReactComponent ? !xr(n, r) || !xr(l, o) : !0;
  }
  function xu(e, t, n) {
    var r = !1, l = Yt, o = t.contextType;
    return typeof o == "object" && o !== null ? o = st(o) : (l = Ye(t) ? pn : $e.current, r = t.contextTypes, o = (r = r != null) ? An(e, l) : Yt), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = Rl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function wu(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Rl.enqueueReplaceState(t, t.state, null);
  }
  function bi(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, ui(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = st(o) : (o = Ye(t) ? pn : $e.current, l.context = An(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (Si(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && Rl.enqueueReplaceState(l, l.state, null), Nl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Qn(e, t) {
    try {
      var n = "", r = t;
      do
        n += ae(r), r = r.return;
      while (r);
      var l = n;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function ji(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function Ci(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Np = typeof WeakMap == "function" ? WeakMap : Map;
  function ku(e, t, n) {
    n = Tt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Vl || (Vl = !0, Ui = r), Ci(e, t);
    }, n;
  }
  function Su(e, t, n) {
    n = Tt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        Ci(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      Ci(e, t), typeof r != "function" && (en === null ? en = /* @__PURE__ */ new Set([this]) : en.add(this));
      var a = t.stack;
      this.componentDidCatch(t.value, { componentStack: a !== null ? a : "" });
    }), n;
  }
  function bu(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Np();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = Vp.bind(null, e, t, n), t.then(e, e));
  }
  function ju(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Cu(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Tt(-1, 1), t.tag = 2, Zt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var zp = Y.ReactCurrentOwner, Xe = !1;
  function Qe(e, t, n, r) {
    t.child = e === null ? Ws(t, null, n, r) : $n(t, e.child, n, r);
  }
  function Eu(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return Bn(t, l), r = gi(e, t, n, r, o, l), n = vi(), e !== null && !Xe ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ke && n && Jo(t), t.flags |= 1, Qe(e, t, r, l), t.child);
  }
  function Nu(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !Ki(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, zu(e, t, o, r, l)) : (e = Kl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var a = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : xr, n(a, r) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = ln(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function zu(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (xr(o, r) && e.ref === t.ref) if (Xe = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Xe = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return Ei(e, t, n, r, l);
  }
  function _u(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, fe(Gn, ot), ot |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, fe(Gn, ot), ot |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, fe(Gn, ot), ot |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, fe(Gn, ot), ot |= r;
    return Qe(e, t, l, n), t.child;
  }
  function Pu(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function Ei(e, t, n, r, l) {
    var o = Ye(n) ? pn : $e.current;
    return o = An(t, o), Bn(t, l), n = gi(e, t, n, r, o, l), r = vi(), e !== null && !Xe ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ke && r && Jo(t), t.flags |= 1, Qe(e, t, n, l), t.child);
  }
  function Mu(e, t, n, r, l) {
    if (Ye(n)) {
      var o = !0;
      yl(t);
    } else o = !1;
    if (Bn(t, l), t.stateNode === null) Il(e, t), xu(t, n, r), bi(t, n, r, l), r = !0;
    else if (e === null) {
      var a = t.stateNode, c = t.memoizedProps;
      a.props = c;
      var p = a.context, x = n.contextType;
      typeof x == "object" && x !== null ? x = st(x) : (x = Ye(n) ? pn : $e.current, x = An(t, x));
      var C = n.getDerivedStateFromProps, z = typeof C == "function" || typeof a.getSnapshotBeforeUpdate == "function";
      z || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (c !== r || p !== x) && wu(t, a, r, x), qt = !1;
      var b = t.memoizedState;
      a.state = b, Nl(t, r, a, l), p = t.memoizedState, c !== r || b !== p || Ge.current || qt ? (typeof C == "function" && (Si(t, n, C, r), p = t.memoizedState), (c = qt || yu(t, n, c, r, b, p, x)) ? (z || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = x, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      a = t.stateNode, Ks(e, t), c = t.memoizedProps, x = t.type === t.elementType ? c : ht(t.type, c), a.props = x, z = t.pendingProps, b = a.context, p = n.contextType, typeof p == "object" && p !== null ? p = st(p) : (p = Ye(n) ? pn : $e.current, p = An(t, p));
      var R = n.getDerivedStateFromProps;
      (C = typeof R == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (c !== z || b !== p) && wu(t, a, r, p), qt = !1, b = t.memoizedState, a.state = b, Nl(t, r, a, l);
      var A = t.memoizedState;
      c !== z || b !== A || Ge.current || qt ? (typeof R == "function" && (Si(t, n, R, r), A = t.memoizedState), (x = qt || yu(t, n, x, r, b, A, p) || !1) ? (C || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, A, p), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, A, p)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || c === e.memoizedProps && b === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && b === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = A), a.props = r, a.state = A, a.context = p, r = x) : (typeof a.componentDidUpdate != "function" || c === e.memoizedProps && b === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && b === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return Ni(e, t, n, r, o, l);
  }
  function Ni(e, t, n, r, l, o) {
    Pu(e, t);
    var a = (t.flags & 128) !== 0;
    if (!r && !a) return l && Is(t, n, !1), Rt(e, t, o);
    r = t.stateNode, zp.current = t;
    var c = a && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && a ? (t.child = $n(t, e.child, null, o), t.child = $n(t, null, c, o)) : Qe(e, t, c, o), t.memoizedState = r.state, l && Is(t, n, !0), t.child;
  }
  function Lu(e) {
    var t = e.stateNode;
    t.pendingContext ? Rs(e, t.pendingContext, t.pendingContext !== t.context) : t.context && Rs(e, t.context, !1), ci(e, t.containerInfo);
  }
  function Tu(e, t, n, r, l) {
    return Vn(), ri(l), t.flags |= 256, Qe(e, t, n, r), t.child;
  }
  var zi = { dehydrated: null, treeContext: null, retryLane: 0 };
  function _i(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Ru(e, t, n) {
    var r = t.pendingProps, l = Se.current, o = !1, a = (t.flags & 128) !== 0, c;
    if ((c = a) || (c = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), c ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), fe(Se, l & 1), e === null)
      return ni(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (a = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, a = { mode: "hidden", children: a }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = a) : o = Gl(a, r, 0, null), e = Sn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = _i(n), t.memoizedState = zi, e) : Pi(t, a));
    if (l = e.memoizedState, l !== null && (c = l.dehydrated, c !== null)) return _p(e, t, a, r, c, l, n);
    if (o) {
      o = r.fallback, a = t.mode, l = e.child, c = l.sibling;
      var p = { mode: "hidden", children: r.children };
      return (a & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = p, t.deletions = null) : (r = ln(l, p), r.subtreeFlags = l.subtreeFlags & 14680064), c !== null ? o = ln(c, o) : (o = Sn(o, a, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, a = e.child.memoizedState, a = a === null ? _i(n) : { baseLanes: a.baseLanes | n, cachePool: null, transitions: a.transitions }, o.memoizedState = a, o.childLanes = e.childLanes & ~n, t.memoizedState = zi, r;
    }
    return o = e.child, e = o.sibling, r = ln(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function Pi(e, t) {
    return t = Gl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function Ol(e, t, n, r) {
    return r !== null && ri(r), $n(t, e.child, null, n), e = Pi(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function _p(e, t, n, r, l, o, a) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = ji(Error(s(422))), Ol(e, t, a, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = Gl({ mode: "visible", children: r.children }, l, 0, null), o = Sn(o, l, a, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && $n(t, e.child, null, a), t.child.memoizedState = _i(a), t.memoizedState = zi, o);
    if ((t.mode & 1) === 0) return Ol(e, t, a, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var c = r.dgst;
      return r = c, o = Error(s(419)), r = ji(o, r, void 0), Ol(e, t, a, r);
    }
    if (c = (a & e.childLanes) !== 0, Xe || c) {
      if (r = Re, r !== null) {
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
        l = (l & (r.suspendedLanes | a)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Lt(e, l), yt(r, e, l, -1));
      }
      return Qi(), r = ji(Error(s(421))), Ol(e, t, a, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = $p.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, lt = Kt(l.nextSibling), rt = t, ke = !0, mt = null, e !== null && (it[at++] = Pt, it[at++] = Mt, it[at++] = fn, Pt = e.id, Mt = e.overflow, fn = t), t = Pi(t, r.children), t.flags |= 4096, t);
  }
  function Ou(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), ai(e.return, t, n);
  }
  function Mi(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function Iu(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (Qe(e, t, r.children, n), r = Se.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Ou(e, n, t);
        else if (e.tag === 19) Ou(e, n, t);
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
    if (fe(Se, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && zl(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), Mi(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && zl(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        Mi(t, !0, n, null, o);
        break;
      case "together":
        Mi(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Il(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Rt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), yn |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, n = ln(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = ln(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Pp(e, t, n) {
    switch (t.tag) {
      case 3:
        Lu(t), Vn();
        break;
      case 5:
        Xs(t);
        break;
      case 1:
        Ye(t.type) && yl(t);
        break;
      case 4:
        ci(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        fe(jl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (fe(Se, Se.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Ru(e, t, n) : (fe(Se, Se.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        fe(Se, Se.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return Iu(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), fe(Se, Se.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, _u(e, t, n);
    }
    return Rt(e, t, n);
  }
  var Du, Li, Au, Fu;
  Du = function(e, t) {
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
  }, Li = function() {
  }, Au = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, gn(bt.current);
      var o = null;
      switch (n) {
        case "input":
          l = io(e, l), r = io(e, r), o = [];
          break;
        case "select":
          l = O({}, l, { value: void 0 }), r = O({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = uo(e, l), r = uo(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = hl);
      }
      po(n, r);
      var a;
      n = null;
      for (x in l) if (!r.hasOwnProperty(x) && l.hasOwnProperty(x) && l[x] != null) if (x === "style") {
        var c = l[x];
        for (a in c) c.hasOwnProperty(a) && (n || (n = {}), n[a] = "");
      } else x !== "dangerouslySetInnerHTML" && x !== "children" && x !== "suppressContentEditableWarning" && x !== "suppressHydrationWarning" && x !== "autoFocus" && (h.hasOwnProperty(x) ? o || (o = []) : (o = o || []).push(x, null));
      for (x in r) {
        var p = r[x];
        if (c = l != null ? l[x] : void 0, r.hasOwnProperty(x) && p !== c && (p != null || c != null)) if (x === "style") if (c) {
          for (a in c) !c.hasOwnProperty(a) || p && p.hasOwnProperty(a) || (n || (n = {}), n[a] = "");
          for (a in p) p.hasOwnProperty(a) && c[a] !== p[a] && (n || (n = {}), n[a] = p[a]);
        } else n || (o || (o = []), o.push(
          x,
          n
        )), n = p;
        else x === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, c = c ? c.__html : void 0, p != null && c !== p && (o = o || []).push(x, p)) : x === "children" ? typeof p != "string" && typeof p != "number" || (o = o || []).push(x, "" + p) : x !== "suppressContentEditableWarning" && x !== "suppressHydrationWarning" && (h.hasOwnProperty(x) ? (p != null && x === "onScroll" && he("scroll", e), o || c === p || (o = [])) : (o = o || []).push(x, p));
      }
      n && (o = o || []).push("style", n);
      var x = o;
      (t.updateQueue = x) && (t.flags |= 4);
    }
  }, Fu = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function Rr(e, t) {
    if (!ke) switch (e.tailMode) {
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
  function Be(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function Mp(e, t, n) {
    var r = t.pendingProps;
    switch (ei(t), t.tag) {
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
        return Ye(t.type) && vl(), Be(t), null;
      case 3:
        return r = t.stateNode, Wn(), ge(Ge), ge($e), fi(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (Sl(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, mt !== null && (Hi(mt), mt = null))), Li(e, t), Be(t), null;
      case 5:
        di(t);
        var l = gn(_r.current);
        if (n = t.type, e !== null && t.stateNode != null) Au(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(s(166));
            return Be(t), null;
          }
          if (e = gn(bt.current), Sl(t)) {
            r = t.stateNode, n = t.type;
            var o = t.memoizedProps;
            switch (r[St] = t, r[jr] = o, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                he("cancel", r), he("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                he("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < kr.length; l++) he(kr[l], r);
                break;
              case "source":
                he("error", r);
                break;
              case "img":
              case "image":
              case "link":
                he(
                  "error",
                  r
                ), he("load", r);
                break;
              case "details":
                he("toggle", r);
                break;
              case "input":
                xa(r, o), he("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, he("invalid", r);
                break;
              case "textarea":
                Sa(r, o), he("invalid", r);
            }
            po(n, o), l = null;
            for (var a in o) if (o.hasOwnProperty(a)) {
              var c = o[a];
              a === "children" ? typeof c == "string" ? r.textContent !== c && (o.suppressHydrationWarning !== !0 && ml(r.textContent, c, e), l = ["children", c]) : typeof c == "number" && r.textContent !== "" + c && (o.suppressHydrationWarning !== !0 && ml(
                r.textContent,
                c,
                e
              ), l = ["children", "" + c]) : h.hasOwnProperty(a) && c != null && a === "onScroll" && he("scroll", r);
            }
            switch (n) {
              case "input":
                Wr(r), ka(r, o, !0);
                break;
              case "textarea":
                Wr(r), ja(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = hl);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            a = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Ca(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = a.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = a.createElement(n, { is: r.is }) : (e = a.createElement(n), n === "select" && (a = e, r.multiple ? a.multiple = !0 : r.size && (a.size = r.size))) : e = a.createElementNS(e, n), e[St] = t, e[jr] = r, Du(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (a = fo(n, r), n) {
                case "dialog":
                  he("cancel", e), he("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  he("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < kr.length; l++) he(kr[l], e);
                  l = r;
                  break;
                case "source":
                  he("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  he(
                    "error",
                    e
                  ), he("load", e), l = r;
                  break;
                case "details":
                  he("toggle", e), l = r;
                  break;
                case "input":
                  xa(e, r), l = io(e, r), he("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = O({}, r, { value: void 0 }), he("invalid", e);
                  break;
                case "textarea":
                  Sa(e, r), l = uo(e, r), he("invalid", e);
                  break;
                default:
                  l = r;
              }
              po(n, l), c = l;
              for (o in c) if (c.hasOwnProperty(o)) {
                var p = c[o];
                o === "style" ? za(e, p) : o === "dangerouslySetInnerHTML" ? (p = p ? p.__html : void 0, p != null && Ea(e, p)) : o === "children" ? typeof p == "string" ? (n !== "textarea" || p !== "") && nr(e, p) : typeof p == "number" && nr(e, "" + p) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (h.hasOwnProperty(o) ? p != null && o === "onScroll" && he("scroll", e) : p != null && F(e, o, p, a));
              }
              switch (n) {
                case "input":
                  Wr(e), ka(e, r, !1);
                  break;
                case "textarea":
                  Wr(e), ja(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + ce(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? En(e, !!r.multiple, o, !1) : r.defaultValue != null && En(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = hl);
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
        return Be(t), null;
      case 6:
        if (e && t.stateNode != null) Fu(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(s(166));
          if (n = gn(_r.current), gn(bt.current), Sl(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[St] = t, (o = r.nodeValue !== n) && (e = rt, e !== null)) switch (e.tag) {
              case 3:
                ml(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && ml(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[St] = t, t.stateNode = r;
        }
        return Be(t), null;
      case 13:
        if (ge(Se), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ke && lt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) $s(), Vn(), t.flags |= 98560, o = !1;
          else if (o = Sl(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(s(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(s(317));
              o[St] = t;
            } else Vn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Be(t), o = !1;
          } else mt !== null && (Hi(mt), mt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Se.current & 1) !== 0 ? Le === 0 && (Le = 3) : Qi())), t.updateQueue !== null && (t.flags |= 4), Be(t), null);
      case 4:
        return Wn(), Li(e, t), e === null && Sr(t.stateNode.containerInfo), Be(t), null;
      case 10:
        return ii(t.type._context), Be(t), null;
      case 17:
        return Ye(t.type) && vl(), Be(t), null;
      case 19:
        if (ge(Se), o = t.memoizedState, o === null) return Be(t), null;
        if (r = (t.flags & 128) !== 0, a = o.rendering, a === null) if (r) Rr(o, !1);
        else {
          if (Le !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (a = zl(e), a !== null) {
              for (t.flags |= 128, Rr(o, !1), r = a.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, a = o.alternate, a === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = a.childLanes, o.lanes = a.lanes, o.child = a.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = a.memoizedProps, o.memoizedState = a.memoizedState, o.updateQueue = a.updateQueue, o.type = a.type, e = a.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return fe(Se, Se.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && Ee() > Yn && (t.flags |= 128, r = !0, Rr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = zl(a), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), Rr(o, !0), o.tail === null && o.tailMode === "hidden" && !a.alternate && !ke) return Be(t), null;
          } else 2 * Ee() - o.renderingStartTime > Yn && n !== 1073741824 && (t.flags |= 128, r = !0, Rr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (a.sibling = t.child, t.child = a) : (n = o.last, n !== null ? n.sibling = a : t.child = a, o.last = a);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Ee(), t.sibling = null, n = Se.current, fe(Se, r ? n & 1 | 2 : n & 1), t) : (Be(t), null);
      case 22:
      case 23:
        return Wi(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (ot & 1073741824) !== 0 && (Be(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Be(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function Lp(e, t) {
    switch (ei(t), t.tag) {
      case 1:
        return Ye(t.type) && vl(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Wn(), ge(Ge), ge($e), fi(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return di(t), null;
      case 13:
        if (ge(Se), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(s(340));
          Vn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return ge(Se), null;
      case 4:
        return Wn(), null;
      case 10:
        return ii(t.type._context), null;
      case 22:
      case 23:
        return Wi(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Dl = !1, We = !1, Tp = typeof WeakSet == "function" ? WeakSet : Set, I = null;
  function Kn(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      je(e, t, r);
    }
    else n.current = null;
  }
  function Ti(e, t, n) {
    try {
      n();
    } catch (r) {
      je(e, t, r);
    }
  }
  var Uu = !1;
  function Rp(e, t) {
    if (Wo = rl, e = ys(), Do(e)) {
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
          var a = 0, c = -1, p = -1, x = 0, C = 0, z = e, b = null;
          t: for (; ; ) {
            for (var R; z !== n || l !== 0 && z.nodeType !== 3 || (c = a + l), z !== o || r !== 0 && z.nodeType !== 3 || (p = a + r), z.nodeType === 3 && (a += z.nodeValue.length), (R = z.firstChild) !== null; )
              b = z, z = R;
            for (; ; ) {
              if (z === e) break t;
              if (b === n && ++x === l && (c = a), b === o && ++C === r && (p = a), (R = z.nextSibling) !== null) break;
              z = b, b = z.parentNode;
            }
            z = R;
          }
          n = c === -1 || p === -1 ? null : { start: c, end: p };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Qo = { focusedElem: e, selectionRange: n }, rl = !1, I = t; I !== null; ) if (t = I, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, I = e;
    else for (; I !== null; ) {
      t = I;
      try {
        var A = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (A !== null) {
              var U = A.memoizedProps, Ne = A.memoizedState, v = t.stateNode, f = v.getSnapshotBeforeUpdate(t.elementType === t.type ? U : ht(t.type, U), Ne);
              v.__reactInternalSnapshotBeforeUpdate = f;
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
            throw Error(s(163));
        }
      } catch (P) {
        je(t, t.return, P);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, I = e;
        break;
      }
      I = t.return;
    }
    return A = Uu, Uu = !1, A;
  }
  function Or(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && Ti(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function Al(e, t) {
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
  function Ri(e) {
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
  function Vu(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Vu(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[St], delete t[jr], delete t[Xo], delete t[gp], delete t[vp])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function $u(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Hu(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || $u(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Oi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = hl));
    else if (r !== 4 && (e = e.child, e !== null)) for (Oi(e, t, n), e = e.sibling; e !== null; ) Oi(e, t, n), e = e.sibling;
  }
  function Ii(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (Ii(e, t, n), e = e.sibling; e !== null; ) Ii(e, t, n), e = e.sibling;
  }
  var De = null, gt = !1;
  function Jt(e, t, n) {
    for (n = n.child; n !== null; ) Bu(e, t, n), n = n.sibling;
  }
  function Bu(e, t, n) {
    if (kt && typeof kt.onCommitFiberUnmount == "function") try {
      kt.onCommitFiberUnmount(qr, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        We || Kn(n, t);
      case 6:
        var r = De, l = gt;
        De = null, Jt(e, t, n), De = r, gt = l, De !== null && (gt ? (e = De, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : De.removeChild(n.stateNode));
        break;
      case 18:
        De !== null && (gt ? (e = De, n = n.stateNode, e.nodeType === 8 ? Yo(e.parentNode, n) : e.nodeType === 1 && Yo(e, n), fr(e)) : Yo(De, n.stateNode));
        break;
      case 4:
        r = De, l = gt, De = n.stateNode.containerInfo, gt = !0, Jt(e, t, n), De = r, gt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!We && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, a = o.destroy;
            o = o.tag, a !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && Ti(n, t, a), l = l.next;
          } while (l !== r);
        }
        Jt(e, t, n);
        break;
      case 1:
        if (!We && (Kn(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (c) {
          je(n, t, c);
        }
        Jt(e, t, n);
        break;
      case 21:
        Jt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (We = (r = We) || n.memoizedState !== null, Jt(e, t, n), We = r) : Jt(e, t, n);
        break;
      default:
        Jt(e, t, n);
    }
  }
  function Wu(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new Tp()), t.forEach(function(r) {
        var l = Hp.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function vt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
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
        if (De === null) throw Error(s(160));
        Bu(o, a, l), De = null, gt = !1;
        var p = l.alternate;
        p !== null && (p.return = null), l.return = null;
      } catch (x) {
        je(l, t, x);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Qu(t, e), t = t.sibling;
  }
  function Qu(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (vt(t, e), Ct(e), r & 4) {
          try {
            Or(3, e, e.return), Al(3, e);
          } catch (U) {
            je(e, e.return, U);
          }
          try {
            Or(5, e, e.return);
          } catch (U) {
            je(e, e.return, U);
          }
        }
        break;
      case 1:
        vt(t, e), Ct(e), r & 512 && n !== null && Kn(n, n.return);
        break;
      case 5:
        if (vt(t, e), Ct(e), r & 512 && n !== null && Kn(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            nr(l, "");
          } catch (U) {
            je(e, e.return, U);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, a = n !== null ? n.memoizedProps : o, c = e.type, p = e.updateQueue;
          if (e.updateQueue = null, p !== null) try {
            c === "input" && o.type === "radio" && o.name != null && wa(l, o), fo(c, a);
            var x = fo(c, o);
            for (a = 0; a < p.length; a += 2) {
              var C = p[a], z = p[a + 1];
              C === "style" ? za(l, z) : C === "dangerouslySetInnerHTML" ? Ea(l, z) : C === "children" ? nr(l, z) : F(l, C, z, x);
            }
            switch (c) {
              case "input":
                ao(l, o);
                break;
              case "textarea":
                ba(l, o);
                break;
              case "select":
                var b = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var R = o.value;
                R != null ? En(l, !!o.multiple, R, !1) : b !== !!o.multiple && (o.defaultValue != null ? En(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : En(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[jr] = o;
          } catch (U) {
            je(e, e.return, U);
          }
        }
        break;
      case 6:
        if (vt(t, e), Ct(e), r & 4) {
          if (e.stateNode === null) throw Error(s(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (U) {
            je(e, e.return, U);
          }
        }
        break;
      case 3:
        if (vt(t, e), Ct(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          fr(t.containerInfo);
        } catch (U) {
          je(e, e.return, U);
        }
        break;
      case 4:
        vt(t, e), Ct(e);
        break;
      case 13:
        vt(t, e), Ct(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (Fi = Ee())), r & 4 && Wu(e);
        break;
      case 22:
        if (C = n !== null && n.memoizedState !== null, e.mode & 1 ? (We = (x = We) || C, vt(t, e), We = x) : vt(t, e), Ct(e), r & 8192) {
          if (x = e.memoizedState !== null, (e.stateNode.isHidden = x) && !C && (e.mode & 1) !== 0) for (I = e, C = e.child; C !== null; ) {
            for (z = I = C; I !== null; ) {
              switch (b = I, R = b.child, b.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Or(4, b, b.return);
                  break;
                case 1:
                  Kn(b, b.return);
                  var A = b.stateNode;
                  if (typeof A.componentWillUnmount == "function") {
                    r = b, n = b.return;
                    try {
                      t = r, A.props = t.memoizedProps, A.state = t.memoizedState, A.componentWillUnmount();
                    } catch (U) {
                      je(r, n, U);
                    }
                  }
                  break;
                case 5:
                  Kn(b, b.return);
                  break;
                case 22:
                  if (b.memoizedState !== null) {
                    Yu(z);
                    continue;
                  }
              }
              R !== null ? (R.return = b, I = R) : Yu(z);
            }
            C = C.sibling;
          }
          e: for (C = null, z = e; ; ) {
            if (z.tag === 5) {
              if (C === null) {
                C = z;
                try {
                  l = z.stateNode, x ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (c = z.stateNode, p = z.memoizedProps.style, a = p != null && p.hasOwnProperty("display") ? p.display : null, c.style.display = Na("display", a));
                } catch (U) {
                  je(e, e.return, U);
                }
              }
            } else if (z.tag === 6) {
              if (C === null) try {
                z.stateNode.nodeValue = x ? "" : z.memoizedProps;
              } catch (U) {
                je(e, e.return, U);
              }
            } else if ((z.tag !== 22 && z.tag !== 23 || z.memoizedState === null || z === e) && z.child !== null) {
              z.child.return = z, z = z.child;
              continue;
            }
            if (z === e) break e;
            for (; z.sibling === null; ) {
              if (z.return === null || z.return === e) break e;
              C === z && (C = null), z = z.return;
            }
            C === z && (C = null), z.sibling.return = z.return, z = z.sibling;
          }
        }
        break;
      case 19:
        vt(t, e), Ct(e), r & 4 && Wu(e);
        break;
      case 21:
        break;
      default:
        vt(
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
          for (var n = e.return; n !== null; ) {
            if ($u(n)) {
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
            r.flags & 32 && (nr(l, ""), r.flags &= -33);
            var o = Hu(e);
            Ii(e, o, l);
            break;
          case 3:
          case 4:
            var a = r.stateNode.containerInfo, c = Hu(e);
            Oi(e, c, a);
            break;
          default:
            throw Error(s(161));
        }
      } catch (p) {
        je(e, e.return, p);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Op(e, t, n) {
    I = e, Ku(e);
  }
  function Ku(e, t, n) {
    for (var r = (e.mode & 1) !== 0; I !== null; ) {
      var l = I, o = l.child;
      if (l.tag === 22 && r) {
        var a = l.memoizedState !== null || Dl;
        if (!a) {
          var c = l.alternate, p = c !== null && c.memoizedState !== null || We;
          c = Dl;
          var x = We;
          if (Dl = a, (We = p) && !x) for (I = l; I !== null; ) a = I, p = a.child, a.tag === 22 && a.memoizedState !== null ? Xu(l) : p !== null ? (p.return = a, I = p) : Xu(l);
          for (; o !== null; ) I = o, Ku(o), o = o.sibling;
          I = l, Dl = c, We = x;
        }
        Gu(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, I = o) : Gu(e);
    }
  }
  function Gu(e) {
    for (; I !== null; ) {
      var t = I;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              We || Al(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !We) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : ht(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && Ys(t, o, r);
              break;
            case 3:
              var a = t.updateQueue;
              if (a !== null) {
                if (n = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    n = t.child.stateNode;
                    break;
                  case 1:
                    n = t.child.stateNode;
                }
                Ys(t, a, n);
              }
              break;
            case 5:
              var c = t.stateNode;
              if (n === null && t.flags & 4) {
                n = c;
                var p = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    p.autoFocus && n.focus();
                    break;
                  case "img":
                    p.src && (n.src = p.src);
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
                var x = t.alternate;
                if (x !== null) {
                  var C = x.memoizedState;
                  if (C !== null) {
                    var z = C.dehydrated;
                    z !== null && fr(z);
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
          We || t.flags & 512 && Ri(t);
        } catch (b) {
          je(t, t.return, b);
        }
      }
      if (t === e) {
        I = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, I = n;
        break;
      }
      I = t.return;
    }
  }
  function Yu(e) {
    for (; I !== null; ) {
      var t = I;
      if (t === e) {
        I = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, I = n;
        break;
      }
      I = t.return;
    }
  }
  function Xu(e) {
    for (; I !== null; ) {
      var t = I;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              Al(4, t);
            } catch (p) {
              je(t, n, p);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (p) {
                je(t, l, p);
              }
            }
            var o = t.return;
            try {
              Ri(t);
            } catch (p) {
              je(t, o, p);
            }
            break;
          case 5:
            var a = t.return;
            try {
              Ri(t);
            } catch (p) {
              je(t, a, p);
            }
        }
      } catch (p) {
        je(t, t.return, p);
      }
      if (t === e) {
        I = null;
        break;
      }
      var c = t.sibling;
      if (c !== null) {
        c.return = t.return, I = c;
        break;
      }
      I = t.return;
    }
  }
  var Ip = Math.ceil, Fl = Y.ReactCurrentDispatcher, Di = Y.ReactCurrentOwner, ct = Y.ReactCurrentBatchConfig, ie = 0, Re = null, ze = null, Ae = 0, ot = 0, Gn = Gt(0), Le = 0, Ir = null, yn = 0, Ul = 0, Ai = 0, Dr = null, qe = null, Fi = 0, Yn = 1 / 0, Ot = null, Vl = !1, Ui = null, en = null, $l = !1, tn = null, Hl = 0, Ar = 0, Vi = null, Bl = -1, Wl = 0;
  function Ke() {
    return (ie & 6) !== 0 ? Ee() : Bl !== -1 ? Bl : Bl = Ee();
  }
  function nn(e) {
    return (e.mode & 1) === 0 ? 1 : (ie & 2) !== 0 && Ae !== 0 ? Ae & -Ae : xp.transition !== null ? (Wl === 0 && (Wl = Ha()), Wl) : (e = de, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Za(e.type)), e);
  }
  function yt(e, t, n, r) {
    if (50 < Ar) throw Ar = 0, Vi = null, Error(s(185));
    sr(e, n, r), ((ie & 2) === 0 || e !== Re) && (e === Re && ((ie & 2) === 0 && (Ul |= n), Le === 4 && rn(e, Ae)), Ze(e, r), n === 1 && ie === 0 && (t.mode & 1) === 0 && (Yn = Ee() + 500, xl && Xt()));
  }
  function Ze(e, t) {
    var n = e.callbackNode;
    xd(e, t);
    var r = el(e, e === Re ? Ae : 0);
    if (r === 0) n !== null && Ua(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && Ua(n), t === 1) e.tag === 0 ? yp(Zu.bind(null, e)) : Ds(Zu.bind(null, e)), mp(function() {
        (ie & 6) === 0 && Xt();
      }), n = null;
      else {
        switch (Ba(r)) {
          case 1:
            n = wo;
            break;
          case 4:
            n = Va;
            break;
          case 16:
            n = Xr;
            break;
          case 536870912:
            n = $a;
            break;
          default:
            n = Xr;
        }
        n = ic(n, qu.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function qu(e, t) {
    if (Bl = -1, Wl = 0, (ie & 6) !== 0) throw Error(s(327));
    var n = e.callbackNode;
    if (Xn() && e.callbackNode !== n) return null;
    var r = el(e, e === Re ? Ae : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Ql(e, r);
    else {
      t = r;
      var l = ie;
      ie |= 2;
      var o = ec();
      (Re !== e || Ae !== t) && (Ot = null, Yn = Ee() + 500, wn(e, t));
      do
        try {
          Fp();
          break;
        } catch (c) {
          Ju(e, c);
        }
      while (!0);
      oi(), Fl.current = o, ie = l, ze !== null ? t = 0 : (Re = null, Ae = 0, t = Le);
    }
    if (t !== 0) {
      if (t === 2 && (l = ko(e), l !== 0 && (r = l, t = $i(e, l))), t === 1) throw n = Ir, wn(e, 0), rn(e, r), Ze(e, Ee()), n;
      if (t === 6) rn(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !Dp(l) && (t = Ql(e, r), t === 2 && (o = ko(e), o !== 0 && (r = o, t = $i(e, o))), t === 1)) throw n = Ir, wn(e, 0), rn(e, r), Ze(e, Ee()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            kn(e, qe, Ot);
            break;
          case 3:
            if (rn(e, r), (r & 130023424) === r && (t = Fi + 500 - Ee(), 10 < t)) {
              if (el(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                Ke(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Go(kn.bind(null, e, qe, Ot), t);
              break;
            }
            kn(e, qe, Ot);
            break;
          case 4:
            if (rn(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var a = 31 - pt(r);
              o = 1 << a, a = t[a], a > l && (l = a), r &= ~o;
            }
            if (r = l, r = Ee() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Ip(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Go(kn.bind(null, e, qe, Ot), r);
              break;
            }
            kn(e, qe, Ot);
            break;
          case 5:
            kn(e, qe, Ot);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return Ze(e, Ee()), e.callbackNode === n ? qu.bind(null, e) : null;
  }
  function $i(e, t) {
    var n = Dr;
    return e.current.memoizedState.isDehydrated && (wn(e, t).flags |= 256), e = Ql(e, t), e !== 2 && (t = qe, qe = n, t !== null && Hi(t)), e;
  }
  function Hi(e) {
    qe === null ? qe = e : qe.push.apply(qe, e);
  }
  function Dp(e) {
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
  function rn(e, t) {
    for (t &= ~Ai, t &= ~Ul, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - pt(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Zu(e) {
    if ((ie & 6) !== 0) throw Error(s(327));
    Xn();
    var t = el(e, 0);
    if ((t & 1) === 0) return Ze(e, Ee()), null;
    var n = Ql(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = ko(e);
      r !== 0 && (t = r, n = $i(e, r));
    }
    if (n === 1) throw n = Ir, wn(e, 0), rn(e, t), Ze(e, Ee()), n;
    if (n === 6) throw Error(s(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, kn(e, qe, Ot), Ze(e, Ee()), null;
  }
  function Bi(e, t) {
    var n = ie;
    ie |= 1;
    try {
      return e(t);
    } finally {
      ie = n, ie === 0 && (Yn = Ee() + 500, xl && Xt());
    }
  }
  function xn(e) {
    tn !== null && tn.tag === 0 && (ie & 6) === 0 && Xn();
    var t = ie;
    ie |= 1;
    var n = ct.transition, r = de;
    try {
      if (ct.transition = null, de = 1, e) return e();
    } finally {
      de = r, ct.transition = n, ie = t, (ie & 6) === 0 && Xt();
    }
  }
  function Wi() {
    ot = Gn.current, ge(Gn);
  }
  function wn(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, fp(n)), ze !== null) for (n = ze.return; n !== null; ) {
      var r = n;
      switch (ei(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && vl();
          break;
        case 3:
          Wn(), ge(Ge), ge($e), fi();
          break;
        case 5:
          di(r);
          break;
        case 4:
          Wn();
          break;
        case 13:
          ge(Se);
          break;
        case 19:
          ge(Se);
          break;
        case 10:
          ii(r.type._context);
          break;
        case 22:
        case 23:
          Wi();
      }
      n = n.return;
    }
    if (Re = e, ze = e = ln(e.current, null), Ae = ot = t, Le = 0, Ir = null, Ai = Ul = yn = 0, qe = Dr = null, hn !== null) {
      for (t = 0; t < hn.length; t++) if (n = hn[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, o = n.pending;
        if (o !== null) {
          var a = o.next;
          o.next = l, r.next = a;
        }
        n.pending = r;
      }
      hn = null;
    }
    return e;
  }
  function Ju(e, t) {
    do {
      var n = ze;
      try {
        if (oi(), _l.current = Tl, Pl) {
          for (var r = be.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          Pl = !1;
        }
        if (vn = 0, Te = Me = be = null, Pr = !1, Mr = 0, Di.current = null, n === null || n.return === null) {
          Le = 1, Ir = t, ze = null;
          break;
        }
        e: {
          var o = e, a = n.return, c = n, p = t;
          if (t = Ae, c.flags |= 32768, p !== null && typeof p == "object" && typeof p.then == "function") {
            var x = p, C = c, z = C.tag;
            if ((C.mode & 1) === 0 && (z === 0 || z === 11 || z === 15)) {
              var b = C.alternate;
              b ? (C.updateQueue = b.updateQueue, C.memoizedState = b.memoizedState, C.lanes = b.lanes) : (C.updateQueue = null, C.memoizedState = null);
            }
            var R = ju(a);
            if (R !== null) {
              R.flags &= -257, Cu(R, a, c, o, t), R.mode & 1 && bu(o, x, t), t = R, p = x;
              var A = t.updateQueue;
              if (A === null) {
                var U = /* @__PURE__ */ new Set();
                U.add(p), t.updateQueue = U;
              } else A.add(p);
              break e;
            } else {
              if ((t & 1) === 0) {
                bu(o, x, t), Qi();
                break e;
              }
              p = Error(s(426));
            }
          } else if (ke && c.mode & 1) {
            var Ne = ju(a);
            if (Ne !== null) {
              (Ne.flags & 65536) === 0 && (Ne.flags |= 256), Cu(Ne, a, c, o, t), ri(Qn(p, c));
              break e;
            }
          }
          o = p = Qn(p, c), Le !== 4 && (Le = 2), Dr === null ? Dr = [o] : Dr.push(o), o = a;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var v = ku(o, p, t);
                Gs(o, v);
                break e;
              case 1:
                c = p;
                var f = o.type, y = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof f.getDerivedStateFromError == "function" || y !== null && typeof y.componentDidCatch == "function" && (en === null || !en.has(y)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var P = Su(o, c, t);
                  Gs(o, P);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        nc(n);
      } catch (V) {
        t = V, ze === n && n !== null && (ze = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function ec() {
    var e = Fl.current;
    return Fl.current = Tl, e === null ? Tl : e;
  }
  function Qi() {
    (Le === 0 || Le === 3 || Le === 2) && (Le = 4), Re === null || (yn & 268435455) === 0 && (Ul & 268435455) === 0 || rn(Re, Ae);
  }
  function Ql(e, t) {
    var n = ie;
    ie |= 2;
    var r = ec();
    (Re !== e || Ae !== t) && (Ot = null, wn(e, t));
    do
      try {
        Ap();
        break;
      } catch (l) {
        Ju(e, l);
      }
    while (!0);
    if (oi(), ie = n, Fl.current = r, ze !== null) throw Error(s(261));
    return Re = null, Ae = 0, Le;
  }
  function Ap() {
    for (; ze !== null; ) tc(ze);
  }
  function Fp() {
    for (; ze !== null && !cd(); ) tc(ze);
  }
  function tc(e) {
    var t = oc(e.alternate, e, ot);
    e.memoizedProps = e.pendingProps, t === null ? nc(e) : ze = t, Di.current = null;
  }
  function nc(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Mp(n, t, ot), n !== null) {
          ze = n;
          return;
        }
      } else {
        if (n = Lp(n, t), n !== null) {
          n.flags &= 32767, ze = n;
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
  function kn(e, t, n) {
    var r = de, l = ct.transition;
    try {
      ct.transition = null, de = 1, Up(e, t, n, r);
    } finally {
      ct.transition = l, de = r;
    }
    return null;
  }
  function Up(e, t, n, r) {
    do
      Xn();
    while (tn !== null);
    if ((ie & 6) !== 0) throw Error(s(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(s(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (wd(e, o), e === Re && (ze = Re = null, Ae = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || $l || ($l = !0, ic(Xr, function() {
      return Xn(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = ct.transition, ct.transition = null;
      var a = de;
      de = 1;
      var c = ie;
      ie |= 4, Di.current = null, Rp(e, n), Qu(n, e), ip(Qo), rl = !!Wo, Qo = Wo = null, e.current = n, Op(n), dd(), ie = c, de = a, ct.transition = o;
    } else e.current = n;
    if ($l && ($l = !1, tn = e, Hl = l), o = e.pendingLanes, o === 0 && (en = null), md(n.stateNode), Ze(e, Ee()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Vl) throw Vl = !1, e = Ui, Ui = null, e;
    return (Hl & 1) !== 0 && e.tag !== 0 && Xn(), o = e.pendingLanes, (o & 1) !== 0 ? e === Vi ? Ar++ : (Ar = 0, Vi = e) : Ar = 0, Xt(), null;
  }
  function Xn() {
    if (tn !== null) {
      var e = Ba(Hl), t = ct.transition, n = de;
      try {
        if (ct.transition = null, de = 16 > e ? 16 : e, tn === null) var r = !1;
        else {
          if (e = tn, tn = null, Hl = 0, (ie & 6) !== 0) throw Error(s(331));
          var l = ie;
          for (ie |= 4, I = e.current; I !== null; ) {
            var o = I, a = o.child;
            if ((I.flags & 16) !== 0) {
              var c = o.deletions;
              if (c !== null) {
                for (var p = 0; p < c.length; p++) {
                  var x = c[p];
                  for (I = x; I !== null; ) {
                    var C = I;
                    switch (C.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Or(8, C, o);
                    }
                    var z = C.child;
                    if (z !== null) z.return = C, I = z;
                    else for (; I !== null; ) {
                      C = I;
                      var b = C.sibling, R = C.return;
                      if (Vu(C), C === x) {
                        I = null;
                        break;
                      }
                      if (b !== null) {
                        b.return = R, I = b;
                        break;
                      }
                      I = R;
                    }
                  }
                }
                var A = o.alternate;
                if (A !== null) {
                  var U = A.child;
                  if (U !== null) {
                    A.child = null;
                    do {
                      var Ne = U.sibling;
                      U.sibling = null, U = Ne;
                    } while (U !== null);
                  }
                }
                I = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && a !== null) a.return = o, I = a;
            else e: for (; I !== null; ) {
              if (o = I, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  Or(9, o, o.return);
              }
              var v = o.sibling;
              if (v !== null) {
                v.return = o.return, I = v;
                break e;
              }
              I = o.return;
            }
          }
          var f = e.current;
          for (I = f; I !== null; ) {
            a = I;
            var y = a.child;
            if ((a.subtreeFlags & 2064) !== 0 && y !== null) y.return = a, I = y;
            else e: for (a = f; I !== null; ) {
              if (c = I, (c.flags & 2048) !== 0) try {
                switch (c.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Al(9, c);
                }
              } catch (V) {
                je(c, c.return, V);
              }
              if (c === a) {
                I = null;
                break e;
              }
              var P = c.sibling;
              if (P !== null) {
                P.return = c.return, I = P;
                break e;
              }
              I = c.return;
            }
          }
          if (ie = l, Xt(), kt && typeof kt.onPostCommitFiberRoot == "function") try {
            kt.onPostCommitFiberRoot(qr, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        de = n, ct.transition = t;
      }
    }
    return !1;
  }
  function rc(e, t, n) {
    t = Qn(n, t), t = ku(e, t, 1), e = Zt(e, t, 1), t = Ke(), e !== null && (sr(e, 1, t), Ze(e, t));
  }
  function je(e, t, n) {
    if (e.tag === 3) rc(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        rc(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (en === null || !en.has(r))) {
          e = Qn(n, e), e = Su(t, e, 1), t = Zt(t, e, 1), e = Ke(), t !== null && (sr(t, 1, e), Ze(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Vp(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Ke(), e.pingedLanes |= e.suspendedLanes & n, Re === e && (Ae & n) === n && (Le === 4 || Le === 3 && (Ae & 130023424) === Ae && 500 > Ee() - Fi ? wn(e, 0) : Ai |= n), Ze(e, t);
  }
  function lc(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Jr, Jr <<= 1, (Jr & 130023424) === 0 && (Jr = 4194304)));
    var n = Ke();
    e = Lt(e, t), e !== null && (sr(e, t, n), Ze(e, n));
  }
  function $p(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), lc(e, n);
  }
  function Hp(e, t) {
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
    r !== null && r.delete(t), lc(e, n);
  }
  var oc;
  oc = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ge.current) Xe = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Xe = !1, Pp(e, t, n);
      Xe = (e.flags & 131072) !== 0;
    }
    else Xe = !1, ke && (t.flags & 1048576) !== 0 && As(t, kl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        Il(e, t), e = t.pendingProps;
        var l = An(t, $e.current);
        Bn(t, n), l = gi(null, t, r, e, l, n);
        var o = vi();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ye(r) ? (o = !0, yl(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, ui(t), l.updater = Rl, t.stateNode = l, l._reactInternals = t, bi(t, r, e, n), t = Ni(null, t, r, !0, o, n)) : (t.tag = 0, ke && o && Jo(t), Qe(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (Il(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Wp(r), e = ht(r, e), l) {
            case 0:
              t = Ei(null, t, r, e, n);
              break e;
            case 1:
              t = Mu(null, t, r, e, n);
              break e;
            case 11:
              t = Eu(null, t, r, e, n);
              break e;
            case 14:
              t = Nu(null, t, r, ht(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), Ei(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), Mu(e, t, r, l, n);
      case 3:
        e: {
          if (Lu(t), e === null) throw Error(s(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, Ks(e, t), Nl(t, r, null, n);
          var a = t.memoizedState;
          if (r = a.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: a.cache, pendingSuspenseBoundaries: a.pendingSuspenseBoundaries, transitions: a.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Qn(Error(s(423)), t), t = Tu(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Qn(Error(s(424)), t), t = Tu(e, t, r, n, l);
            break e;
          } else for (lt = Kt(t.stateNode.containerInfo.firstChild), rt = t, ke = !0, mt = null, n = Ws(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Vn(), r === l) {
              t = Rt(e, t, n);
              break e;
            }
            Qe(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Xs(t), e === null && ni(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, a = l.children, Ko(r, l) ? a = null : o !== null && Ko(r, o) && (t.flags |= 32), Pu(e, t), Qe(e, t, a, n), t.child;
      case 6:
        return e === null && ni(t), null;
      case 13:
        return Ru(e, t, n);
      case 4:
        return ci(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = $n(t, null, r, n) : Qe(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), Eu(e, t, r, l, n);
      case 7:
        return Qe(e, t, t.pendingProps, n), t.child;
      case 8:
        return Qe(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return Qe(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, a = l.value, fe(jl, r._currentValue), r._currentValue = a, o !== null) if (ft(o.value, a)) {
            if (o.children === l.children && !Ge.current) {
              t = Rt(e, t, n);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var c = o.dependencies;
            if (c !== null) {
              a = o.child;
              for (var p = c.firstContext; p !== null; ) {
                if (p.context === r) {
                  if (o.tag === 1) {
                    p = Tt(-1, n & -n), p.tag = 2;
                    var x = o.updateQueue;
                    if (x !== null) {
                      x = x.shared;
                      var C = x.pending;
                      C === null ? p.next = p : (p.next = C.next, C.next = p), x.pending = p;
                    }
                  }
                  o.lanes |= n, p = o.alternate, p !== null && (p.lanes |= n), ai(
                    o.return,
                    n,
                    t
                  ), c.lanes |= n;
                  break;
                }
                p = p.next;
              }
            } else if (o.tag === 10) a = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (a = o.return, a === null) throw Error(s(341));
              a.lanes |= n, c = a.alternate, c !== null && (c.lanes |= n), ai(a, n, t), a = o.sibling;
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
          Qe(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, Bn(t, n), l = st(l), r = r(l), t.flags |= 1, Qe(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = ht(r, t.pendingProps), l = ht(r.type, l), Nu(e, t, r, l, n);
      case 15:
        return zu(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : ht(r, l), Il(e, t), t.tag = 1, Ye(r) ? (e = !0, yl(t)) : e = !1, Bn(t, n), xu(t, r, l), bi(t, r, l, n), Ni(null, t, r, !0, e, n);
      case 19:
        return Iu(e, t, n);
      case 22:
        return _u(e, t, n);
    }
    throw Error(s(156, t.tag));
  };
  function ic(e, t) {
    return Fa(e, t);
  }
  function Bp(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function dt(e, t, n, r) {
    return new Bp(e, t, n, r);
  }
  function Ki(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Wp(e) {
    if (typeof e == "function") return Ki(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === le) return 11;
      if (e === et) return 14;
    }
    return 2;
  }
  function ln(e, t) {
    var n = e.alternate;
    return n === null ? (n = dt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Kl(e, t, n, r, l, o) {
    var a = 2;
    if (r = e, typeof e == "function") Ki(e) && (a = 1);
    else if (typeof e == "string") a = 5;
    else e: switch (e) {
      case ye:
        return Sn(n.children, l, o, t);
      case xe:
        a = 8, l |= 8;
        break;
      case _e:
        return e = dt(12, n, t, l | 2), e.elementType = _e, e.lanes = o, e;
      case Ue:
        return e = dt(13, n, t, l), e.elementType = Ue, e.lanes = o, e;
      case Ve:
        return e = dt(19, n, t, l), e.elementType = Ve, e.lanes = o, e;
      case me:
        return Gl(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Fe:
            a = 10;
            break e;
          case Ie:
            a = 9;
            break e;
          case le:
            a = 11;
            break e;
          case et:
            a = 14;
            break e;
          case Pe:
            a = 16, r = null;
            break e;
        }
        throw Error(s(130, e == null ? e : typeof e, ""));
    }
    return t = dt(a, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
  }
  function Sn(e, t, n, r) {
    return e = dt(7, e, r, t), e.lanes = n, e;
  }
  function Gl(e, t, n, r) {
    return e = dt(22, e, r, t), e.elementType = me, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Gi(e, t, n) {
    return e = dt(6, e, null, t), e.lanes = n, e;
  }
  function Yi(e, t, n) {
    return t = dt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Qp(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = So(0), this.expirationTimes = So(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = So(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Xi(e, t, n, r, l, o, a, c, p) {
    return e = new Qp(e, t, n, c, p), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = dt(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, ui(o), e;
  }
  function Kp(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: J, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function ac(e) {
    if (!e) return Yt;
    e = e._reactInternals;
    e: {
      if (cn(e) !== e || e.tag !== 1) throw Error(s(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ye(t.type)) {
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
      if (Ye(n)) return Os(e, n, t);
    }
    return t;
  }
  function sc(e, t, n, r, l, o, a, c, p) {
    return e = Xi(n, r, !0, e, l, o, a, c, p), e.context = ac(null), n = e.current, r = Ke(), l = nn(n), o = Tt(r, l), o.callback = t ?? null, Zt(n, o, l), e.current.lanes = l, sr(e, l, r), Ze(e, r), e;
  }
  function Yl(e, t, n, r) {
    var l = t.current, o = Ke(), a = nn(l);
    return n = ac(n), t.context === null ? t.context = n : t.pendingContext = n, t = Tt(o, a), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Zt(l, t, a), e !== null && (yt(e, l, a, o), El(e, l, a)), a;
  }
  function Xl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function uc(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function qi(e, t) {
    uc(e, t), (e = e.alternate) && uc(e, t);
  }
  function Gp() {
    return null;
  }
  var cc = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Zi(e) {
    this._internalRoot = e;
  }
  ql.prototype.render = Zi.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    Yl(e, t, null, null);
  }, ql.prototype.unmount = Zi.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      xn(function() {
        Yl(null, e, null, null);
      }), t[zt] = null;
    }
  };
  function ql(e) {
    this._internalRoot = e;
  }
  ql.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Ka();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Bt.length && t !== 0 && t < Bt[n].priority; n++) ;
      Bt.splice(n, 0, e), n === 0 && Xa(e);
    }
  };
  function Ji(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Zl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function dc() {
  }
  function Yp(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var x = Xl(a);
          o.call(x);
        };
      }
      var a = sc(t, r, e, 0, null, !1, !1, "", dc);
      return e._reactRootContainer = a, e[zt] = a.current, Sr(e.nodeType === 8 ? e.parentNode : e), xn(), a;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var c = r;
      r = function() {
        var x = Xl(p);
        c.call(x);
      };
    }
    var p = Xi(e, 0, !1, null, null, !1, !1, "", dc);
    return e._reactRootContainer = p, e[zt] = p.current, Sr(e.nodeType === 8 ? e.parentNode : e), xn(function() {
      Yl(t, p, n, r);
    }), p;
  }
  function Jl(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var a = o;
      if (typeof l == "function") {
        var c = l;
        l = function() {
          var p = Xl(a);
          c.call(p);
        };
      }
      Yl(t, a, e, l);
    } else a = Yp(n, t, e, l, r);
    return Xl(a);
  }
  Wa = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = ar(t.pendingLanes);
          n !== 0 && (bo(t, n | 1), Ze(t, Ee()), (ie & 6) === 0 && (Yn = Ee() + 500, Xt()));
        }
        break;
      case 13:
        xn(function() {
          var r = Lt(e, 1);
          if (r !== null) {
            var l = Ke();
            yt(r, e, 1, l);
          }
        }), qi(e, 1);
    }
  }, jo = function(e) {
    if (e.tag === 13) {
      var t = Lt(e, 134217728);
      if (t !== null) {
        var n = Ke();
        yt(t, e, 134217728, n);
      }
      qi(e, 134217728);
    }
  }, Qa = function(e) {
    if (e.tag === 13) {
      var t = nn(e), n = Lt(e, t);
      if (n !== null) {
        var r = Ke();
        yt(n, e, t, r);
      }
      qi(e, t);
    }
  }, Ka = function() {
    return de;
  }, Ga = function(e, t) {
    var n = de;
    try {
      return de = e, t();
    } finally {
      de = n;
    }
  }, go = function(e, t, n) {
    switch (t) {
      case "input":
        if (ao(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = gl(r);
              if (!l) throw Error(s(90));
              ya(r), ao(r, l);
            }
          }
        }
        break;
      case "textarea":
        ba(e, n);
        break;
      case "select":
        t = n.value, t != null && En(e, !!n.multiple, t, !1);
    }
  }, La = Bi, Ta = xn;
  var Xp = { usingClientEntryPoint: !1, Events: [Cr, In, gl, Pa, Ma, Bi] }, Fr = { findFiberByHostInstance: dn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, qp = { bundleType: Fr.bundleType, version: Fr.version, rendererPackageName: Fr.rendererPackageName, rendererConfig: Fr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Y.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Da(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Fr.findFiberByHostInstance || Gp, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var eo = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!eo.isDisabled && eo.supportsFiber) try {
      qr = eo.inject(qp), kt = eo;
    } catch {
    }
  }
  return Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Xp, Je.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Ji(t)) throw Error(s(200));
    return Kp(e, t, null, n);
  }, Je.createRoot = function(e, t) {
    if (!Ji(e)) throw Error(s(299));
    var n = !1, r = "", l = cc;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Xi(e, 1, !1, null, null, n, !1, r, l), e[zt] = t.current, Sr(e.nodeType === 8 ? e.parentNode : e), new Zi(t);
  }, Je.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = Da(t), e = e === null ? null : e.stateNode, e;
  }, Je.flushSync = function(e) {
    return xn(e);
  }, Je.hydrate = function(e, t, n) {
    if (!Zl(t)) throw Error(s(200));
    return Jl(null, e, t, !0, n);
  }, Je.hydrateRoot = function(e, t, n) {
    if (!Ji(e)) throw Error(s(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", a = cc;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (a = n.onRecoverableError)), t = sc(t, null, e, 1, n ?? null, l, !1, o, a), e[zt] = t.current, Sr(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new ql(t);
  }, Je.render = function(e, t, n) {
    if (!Zl(t)) throw Error(s(200));
    return Jl(null, e, t, !1, n);
  }, Je.unmountComponentAtNode = function(e) {
    if (!Zl(e)) throw Error(s(40));
    return e._reactRootContainer ? (xn(function() {
      Jl(null, null, e, !1, function() {
        e._reactRootContainer = null, e[zt] = null;
      });
    }), !0) : !1;
  }, Je.unstable_batchedUpdates = Bi, Je.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Zl(n)) throw Error(s(200));
    if (e == null || e._reactInternals === void 0) throw Error(s(38));
    return Jl(e, t, n, !1, r);
  }, Je.version = "18.3.1-next-f1338f8080-20240426", Je;
}
var xc;
function Ec() {
  if (xc) return na.exports;
  xc = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (d) {
        console.error(d);
      }
  }
  return i(), na.exports = uf(), na.exports;
}
var wc;
function cf() {
  if (wc) return to;
  wc = 1;
  var i = Ec();
  return to.createRoot = i.createRoot, to.hydrateRoot = i.hydrateRoot, to;
}
var Zn = cf(), df = Ec();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pf = (i) => i.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Nc = (...i) => i.filter((d, s, g) => !!d && d.trim() !== "" && g.indexOf(d) === s).join(" ").trim();
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var ff = {
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
const mf = G.forwardRef(
  ({
    color: i = "currentColor",
    size: d = 24,
    strokeWidth: s = 2,
    absoluteStrokeWidth: g,
    className: h = "",
    children: w,
    iconNode: k,
    ...S
  }, M) => G.createElement(
    "svg",
    {
      ref: M,
      ...ff,
      width: d,
      height: d,
      stroke: i,
      strokeWidth: g ? Number(s) * 24 / Number(d) : s,
      className: Nc("lucide", h),
      ...S
    },
    [
      ...k.map(([D, $]) => G.createElement(D, $)),
      ...Array.isArray(w) ? w : [w]
    ]
  )
);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ce = (i, d) => {
  const s = G.forwardRef(
    ({ className: g, ...h }, w) => G.createElement(mf, {
      ref: w,
      iconNode: d,
      className: Nc(`lucide-${pf(i)}`, g),
      ...h
    })
  );
  return s.displayName = `${i}`, s;
};
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hf = Ce("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gf = Ce("ArrowUpDown", [
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
const vf = Ce("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lo = Ce("BookOpen", [
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
const Hr = Ce("CalendarDays", [
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
const yf = Ce("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const oo = Ce("Clock3", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16.5 12", key: "1aq6pp" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ia = Ce("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const zc = Ce("Ellipsis", [
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
const fa = Ce("ExternalLink", [
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
const _c = Ce("GraduationCap", [
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
const xf = Ce("GripVertical", [
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
const ma = Ce("Hash", [
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
const wf = Ce("History", [
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
const kf = Ce("Layers", [
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
const Sf = Ce("LibraryBig", [
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
const Br = Ce("MapPin", [
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
const bf = Ce("Pin", [
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
const ha = Ce("SearchX", [
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
const aa = Ce("Trash2", [
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
const Pc = Ce("TriangleAlert", [
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
const jn = Ce("UserRound", [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
]);
var jf = Object.defineProperty, ga = (i, d) => jf(i, "name", { value: d, configurable: !0 });
function sa(i, d) {
  if (typeof i == "function")
    return i(d);
  i != null && (i.current = d);
}
ga(sa, "setRef");
function Mc(...i) {
  return (d) => {
    let s = !1;
    const g = i.map((h) => {
      const w = sa(h, d);
      return !s && typeof w == "function" && (s = !0), w;
    });
    if (s)
      return () => {
        for (let h = 0; h < g.length; h++) {
          const w = g[h];
          typeof w == "function" ? w() : sa(i[h], null);
        }
      };
  };
}
ga(Mc, "composeRefs");
function Lc(...i) {
  return G.useCallback(Mc(...i), i);
}
ga(Lc, "useComposedRefs");
var Cf = Object.defineProperty, wt = (i, d) => Cf(i, "name", { value: d, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Tc(i) {
  const d = G.forwardRef((s, g) => {
    let { children: h, ...w } = s, k = null, S = !1;
    const M = [];
    ua(h) && typeof no == "function" && (h = no(h._payload)), G.Children.forEach(h, (N) => {
      var q;
      if (Dc(N)) {
        S = !0;
        const E = N;
        let _ = "child" in E.props ? E.props.child : E.props.children;
        ua(_) && typeof no == "function" && (_ = no(_._payload)), k = zf(E, _), M.push((q = k == null ? void 0 : k.props) == null ? void 0 : q.children);
      } else
        M.push(N);
    }), k ? k = G.cloneElement(k, void 0, M) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !S && G.Children.count(h) === 1 && G.isValidElement(h) && (k = h)
    );
    const D = k ? Ic(k) : void 0, $ = Lc(g, D);
    if (!k) {
      if (h || h === 0)
        throw new Error(
          S ? Mf(i) : Pf(i)
        );
      return h;
    }
    const W = Oc(w, k.props ?? {});
    return k.type !== G.Fragment && (W.ref = g ? $ : D), G.cloneElement(k, W);
  });
  return d.displayName = `${i}.Slot`, d;
}
wt(Tc, "createSlot");
var Ef = /* @__PURE__ */ Tc("Slot"), Rc = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Nf(i) {
  const d = /* @__PURE__ */ wt((s) => "child" in s ? s.children(s.child) : s.children, "Slottable");
  return d.displayName = `${i}.Slottable`, d.__radixId = Rc, d;
}
wt(Nf, "createSlottable");
var zf = /* @__PURE__ */ wt((i, d) => {
  if ("child" in i.props) {
    const s = i.props.child;
    return G.isValidElement(s) ? G.cloneElement(s, void 0, i.props.children(s.props.children)) : null;
  }
  return G.isValidElement(d) ? d : null;
}, "getSlottableElementFromSlottable");
function Oc(i, d) {
  const s = { ...d };
  for (const g in d) {
    const h = i[g], w = d[g];
    /^on[A-Z]/.test(g) ? h && w ? s[g] = (...S) => {
      const M = w(...S);
      return h(...S), M;
    } : h && (s[g] = h) : g === "style" ? s[g] = { ...h, ...w } : g === "className" && (s[g] = [h, w].filter(Boolean).join(" "));
  }
  return { ...i, ...s };
}
wt(Oc, "mergeProps");
function Ic(i) {
  var g, h;
  let d = (g = Object.getOwnPropertyDescriptor(i.props, "ref")) == null ? void 0 : g.get, s = d && "isReactWarning" in d && d.isReactWarning;
  return s ? i.ref : (d = (h = Object.getOwnPropertyDescriptor(i, "ref")) == null ? void 0 : h.get, s = d && "isReactWarning" in d && d.isReactWarning, s ? i.props.ref : i.props.ref || i.ref);
}
wt(Ic, "getElementRef");
function Dc(i) {
  return G.isValidElement(i) && typeof i.type == "function" && "__radixId" in i.type && i.type.__radixId === Rc;
}
wt(Dc, "isSlottable");
var _f = Symbol.for("react.lazy");
function ua(i) {
  return i != null && typeof i == "object" && "$$typeof" in i && i.$$typeof === _f && "_payload" in i && Ac(i._payload);
}
wt(ua, "isLazyComponent");
function Ac(i) {
  return typeof i == "object" && i !== null && "then" in i;
}
wt(Ac, "isPromiseLike");
var Pf = /* @__PURE__ */ wt((i) => `${i} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Mf = /* @__PURE__ */ wt((i) => `${i} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), no = of[" use ".trim().toString()];
function Fc(i) {
  var d, s, g = "";
  if (typeof i == "string" || typeof i == "number") g += i;
  else if (typeof i == "object") if (Array.isArray(i)) {
    var h = i.length;
    for (d = 0; d < h; d++) i[d] && (s = Fc(i[d])) && (g && (g += " "), g += s);
  } else for (s in i) i[s] && (g && (g += " "), g += s);
  return g;
}
function Uc() {
  for (var i, d, s = 0, g = "", h = arguments.length; s < h; s++) (i = arguments[s]) && (d = Fc(i)) && (g && (g += " "), g += d);
  return g;
}
const kc = (i) => typeof i == "boolean" ? `${i}` : i === 0 ? "0" : i, Sc = Uc, Lf = (i, d) => (s) => {
  var g;
  if ((d == null ? void 0 : d.variants) == null) return Sc(i, s == null ? void 0 : s.class, s == null ? void 0 : s.className);
  const { variants: h, defaultVariants: w } = d, k = Object.keys(h).map((D) => {
    const $ = s == null ? void 0 : s[D], W = w == null ? void 0 : w[D];
    if ($ === null) return null;
    const N = kc($) || kc(W);
    return h[D][N];
  }), S = s && Object.entries(s).reduce((D, $) => {
    let [W, N] = $;
    return N === void 0 || (D[W] = N), D;
  }, {}), M = d == null || (g = d.compoundVariants) === null || g === void 0 ? void 0 : g.reduce((D, $) => {
    let { class: W, className: N, ...q } = $;
    return Object.entries(q).every((E) => {
      let [_, L] = E;
      return Array.isArray(L) ? L.includes({
        ...w,
        ...S
      }[_]) : {
        ...w,
        ...S
      }[_] === L;
    }) ? [
      ...D,
      W,
      N
    ] : D;
  }, []);
  return Sc(i, k, M, s == null ? void 0 : s.class, s == null ? void 0 : s.className);
}, va = "-", Tf = (i) => {
  const d = Of(i), {
    conflictingClassGroups: s,
    conflictingClassGroupModifiers: g
  } = i;
  return {
    getClassGroupId: (k) => {
      const S = k.split(va);
      return S[0] === "" && S.length !== 1 && S.shift(), Vc(S, d) || Rf(k);
    },
    getConflictingClassGroupIds: (k, S) => {
      const M = s[k] || [];
      return S && g[k] ? [...M, ...g[k]] : M;
    }
  };
}, Vc = (i, d) => {
  var k;
  if (i.length === 0)
    return d.classGroupId;
  const s = i[0], g = d.nextPart.get(s), h = g ? Vc(i.slice(1), g) : void 0;
  if (h)
    return h;
  if (d.validators.length === 0)
    return;
  const w = i.join(va);
  return (k = d.validators.find(({
    validator: S
  }) => S(w))) == null ? void 0 : k.classGroupId;
}, bc = /^\[(.+)\]$/, Rf = (i) => {
  if (bc.test(i)) {
    const d = bc.exec(i)[1], s = d == null ? void 0 : d.substring(0, d.indexOf(":"));
    if (s)
      return "arbitrary.." + s;
  }
}, Of = (i) => {
  const {
    theme: d,
    prefix: s
  } = i, g = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Df(Object.entries(i.classGroups), s).forEach(([w, k]) => {
    ca(k, g, w, d);
  }), g;
}, ca = (i, d, s, g) => {
  i.forEach((h) => {
    if (typeof h == "string") {
      const w = h === "" ? d : jc(d, h);
      w.classGroupId = s;
      return;
    }
    if (typeof h == "function") {
      if (If(h)) {
        ca(h(g), d, s, g);
        return;
      }
      d.validators.push({
        validator: h,
        classGroupId: s
      });
      return;
    }
    Object.entries(h).forEach(([w, k]) => {
      ca(k, jc(d, w), s, g);
    });
  });
}, jc = (i, d) => {
  let s = i;
  return d.split(va).forEach((g) => {
    s.nextPart.has(g) || s.nextPart.set(g, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), s = s.nextPart.get(g);
  }), s;
}, If = (i) => i.isThemeGetter, Df = (i, d) => d ? i.map(([s, g]) => {
  const h = g.map((w) => typeof w == "string" ? d + w : typeof w == "object" ? Object.fromEntries(Object.entries(w).map(([k, S]) => [d + k, S])) : w);
  return [s, h];
}) : i, Af = (i) => {
  if (i < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let d = 0, s = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map();
  const h = (w, k) => {
    s.set(w, k), d++, d > i && (d = 0, g = s, s = /* @__PURE__ */ new Map());
  };
  return {
    get(w) {
      let k = s.get(w);
      if (k !== void 0)
        return k;
      if ((k = g.get(w)) !== void 0)
        return h(w, k), k;
    },
    set(w, k) {
      s.has(w) ? s.set(w, k) : h(w, k);
    }
  };
}, $c = "!", Ff = (i) => {
  const {
    separator: d,
    experimentalParseClassName: s
  } = i, g = d.length === 1, h = d[0], w = d.length, k = (S) => {
    const M = [];
    let D = 0, $ = 0, W;
    for (let L = 0; L < S.length; L++) {
      let Z = S[L];
      if (D === 0) {
        if (Z === h && (g || S.slice(L, L + w) === d)) {
          M.push(S.slice($, L)), $ = L + w;
          continue;
        }
        if (Z === "/") {
          W = L;
          continue;
        }
      }
      Z === "[" ? D++ : Z === "]" && D--;
    }
    const N = M.length === 0 ? S : S.substring($), q = N.startsWith($c), E = q ? N.substring(1) : N, _ = W && W > $ ? W - $ : void 0;
    return {
      modifiers: M,
      hasImportantModifier: q,
      baseClassName: E,
      maybePostfixModifierPosition: _
    };
  };
  return s ? (S) => s({
    className: S,
    parseClassName: k
  }) : k;
}, Uf = (i) => {
  if (i.length <= 1)
    return i;
  const d = [];
  let s = [];
  return i.forEach((g) => {
    g[0] === "[" ? (d.push(...s.sort(), g), s = []) : s.push(g);
  }), d.push(...s.sort()), d;
}, Vf = (i) => ({
  cache: Af(i.cacheSize),
  parseClassName: Ff(i),
  ...Tf(i)
}), $f = /\s+/, Hf = (i, d) => {
  const {
    parseClassName: s,
    getClassGroupId: g,
    getConflictingClassGroupIds: h
  } = d, w = [], k = i.trim().split($f);
  let S = "";
  for (let M = k.length - 1; M >= 0; M -= 1) {
    const D = k[M], {
      modifiers: $,
      hasImportantModifier: W,
      baseClassName: N,
      maybePostfixModifierPosition: q
    } = s(D);
    let E = !!q, _ = g(E ? N.substring(0, q) : N);
    if (!_) {
      if (!E) {
        S = D + (S.length > 0 ? " " + S : S);
        continue;
      }
      if (_ = g(N), !_) {
        S = D + (S.length > 0 ? " " + S : S);
        continue;
      }
      E = !1;
    }
    const L = Uf($).join(":"), Z = W ? L + $c : L, B = Z + _;
    if (w.includes(B))
      continue;
    w.push(B);
    const F = h(_, E);
    for (let Y = 0; Y < F.length; ++Y) {
      const oe = F[Y];
      w.push(Z + oe);
    }
    S = D + (S.length > 0 ? " " + S : S);
  }
  return S;
};
function Bf() {
  let i = 0, d, s, g = "";
  for (; i < arguments.length; )
    (d = arguments[i++]) && (s = Hc(d)) && (g && (g += " "), g += s);
  return g;
}
const Hc = (i) => {
  if (typeof i == "string")
    return i;
  let d, s = "";
  for (let g = 0; g < i.length; g++)
    i[g] && (d = Hc(i[g])) && (s && (s += " "), s += d);
  return s;
};
function Wf(i, ...d) {
  let s, g, h, w = k;
  function k(M) {
    const D = d.reduce(($, W) => W($), i());
    return s = Vf(D), g = s.cache.get, h = s.cache.set, w = S, S(M);
  }
  function S(M) {
    const D = g(M);
    if (D)
      return D;
    const $ = Hf(M, s);
    return h(M, $), $;
  }
  return function() {
    return w(Bf.apply(null, arguments));
  };
}
const ve = (i) => {
  const d = (s) => s[i] || [];
  return d.isThemeGetter = !0, d;
}, Bc = /^\[(?:([a-z-]+):)?(.+)\]$/i, Qf = /^\d+\/\d+$/, Kf = /* @__PURE__ */ new Set(["px", "full", "screen"]), Gf = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Yf = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Xf = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, qf = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Zf = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, It = (i) => qn(i) || Kf.has(i) || Qf.test(i), an = (i) => Jn(i, "length", im), qn = (i) => !!i && !Number.isNaN(Number(i)), oa = (i) => Jn(i, "number", qn), Vr = (i) => !!i && Number.isInteger(Number(i)), Jf = (i) => i.endsWith("%") && qn(i.slice(0, -1)), ee = (i) => Bc.test(i), sn = (i) => Gf.test(i), em = /* @__PURE__ */ new Set(["length", "size", "percentage"]), tm = (i) => Jn(i, em, Wc), nm = (i) => Jn(i, "position", Wc), rm = /* @__PURE__ */ new Set(["image", "url"]), lm = (i) => Jn(i, rm, sm), om = (i) => Jn(i, "", am), $r = () => !0, Jn = (i, d, s) => {
  const g = Bc.exec(i);
  return g ? g[1] ? typeof d == "string" ? g[1] === d : d.has(g[1]) : s(g[2]) : !1;
}, im = (i) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Yf.test(i) && !Xf.test(i)
), Wc = () => !1, am = (i) => qf.test(i), sm = (i) => Zf.test(i), um = () => {
  const i = ve("colors"), d = ve("spacing"), s = ve("blur"), g = ve("brightness"), h = ve("borderColor"), w = ve("borderRadius"), k = ve("borderSpacing"), S = ve("borderWidth"), M = ve("contrast"), D = ve("grayscale"), $ = ve("hueRotate"), W = ve("invert"), N = ve("gap"), q = ve("gradientColorStops"), E = ve("gradientColorStopPositions"), _ = ve("inset"), L = ve("margin"), Z = ve("opacity"), B = ve("padding"), F = ve("saturate"), Y = ve("scale"), oe = ve("sepia"), J = ve("skew"), ye = ve("space"), xe = ve("translate"), _e = () => ["auto", "contain", "none"], Fe = () => ["auto", "hidden", "clip", "visible", "scroll"], Ie = () => ["auto", ee, d], le = () => [ee, d], Ue = () => ["", It, an], Ve = () => ["auto", qn, ee], et = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], Pe = () => ["solid", "dashed", "dotted", "double", "none"], me = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], T = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], H = () => ["", "0", ee], O = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], m = () => [qn, ee];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [$r],
      spacing: [It, an],
      blur: ["none", "", sn, ee],
      brightness: m(),
      borderColor: [i],
      borderRadius: ["none", "", "full", sn, ee],
      borderSpacing: le(),
      borderWidth: Ue(),
      contrast: m(),
      grayscale: H(),
      hueRotate: m(),
      invert: H(),
      gap: le(),
      gradientColorStops: [i],
      gradientColorStopPositions: [Jf, an],
      inset: Ie(),
      margin: Ie(),
      opacity: m(),
      padding: le(),
      saturate: m(),
      scale: m(),
      sepia: H(),
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
        columns: [sn]
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
        inset: [_]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [_]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [_]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [_]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [_]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [_]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [_]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [_]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [_]
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
        z: ["auto", Vr, ee]
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
        flex: ["1", "auto", "initial", "none", ee]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: H()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: H()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", Vr, ee]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [$r]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", Vr, ee]
        }, ee]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": Ve()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": Ve()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [$r]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [Vr, ee]
        }, ee]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": Ve()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": Ve()
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
        gap: [N]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [N]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [N]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...T()]
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
        content: ["normal", ...T(), "baseline"]
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
        "place-content": [...T(), "baseline"]
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
        p: [B]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [B]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [B]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [B]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [B]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [B]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [B]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [B]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [B]
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
          screen: [sn]
        }, sn]
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
        text: ["base", sn, an]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", oa]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [$r]
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
        "line-clamp": ["none", qn, oa]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", It, ee]
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
        decoration: [...Pe(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", It, an]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", It, ee]
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
        bg: [...et(), nm]
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
        bg: ["auto", "cover", "contain", tm]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, lm]
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
        from: [E]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [E]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [E]
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
        rounded: [w]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [w]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [w]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [w]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [w]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [w]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [w]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [w]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [w]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [w]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [w]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [w]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [w]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [w]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [w]
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
        "border-opacity": [Z]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...Pe(), "hidden"]
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
        "divide-opacity": [Z]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: Pe()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [h]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [h]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [h]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [h]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [h]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [h]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [h]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [h]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [h]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [h]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...Pe()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [It, ee]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [It, an]
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
        ring: Ue()
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
        "ring-offset": [It, an]
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
        shadow: ["", "inner", "none", sn, om]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [$r]
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
        "mix-blend": [...me(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": me()
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
        contrast: [M]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", sn, ee]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [D]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [$]
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
        saturate: [F]
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
        "backdrop-contrast": [M]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [D]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [$]
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
        "backdrop-opacity": [Z]
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
        rotate: [Vr, ee]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [xe]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [xe]
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
        stroke: [It, an, oa]
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
}, cm = /* @__PURE__ */ Wf(um);
function Cn(...i) {
  return cm(Uc(i));
}
const dm = Lf(
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
), Qc = G.forwardRef(
  ({ className: i, variant: d, size: s, asChild: g = !1, ...h }, w) => {
    const k = g ? Ef : "button";
    return /* @__PURE__ */ u.jsx(k, { className: Cn(dm({ variant: d, size: s, className: i })), ref: w, ...h });
  }
);
Qc.displayName = "Button";
const Kc = G.forwardRef(
  ({ className: i, ...d }, s) => /* @__PURE__ */ u.jsx("div", { className: "dt-relative dt-w-full dt-overflow-auto", children: /* @__PURE__ */ u.jsx("table", { ref: s, className: Cn("dt-w-full dt-caption-bottom dt-text-sm", i), ...d }) })
);
Kc.displayName = "Table";
const Gc = G.forwardRef(({ className: i, ...d }, s) => /* @__PURE__ */ u.jsx("thead", { ref: s, className: Cn("[&_tr]:dt-border-b", i), ...d }));
Gc.displayName = "TableHeader";
const Yc = G.forwardRef(({ className: i, ...d }, s) => /* @__PURE__ */ u.jsx("tbody", { ref: s, className: Cn("[&_tr:last-child]:dt-border-0", i), ...d }));
Yc.displayName = "TableBody";
const da = G.forwardRef(
  ({ className: i, ...d }, s) => /* @__PURE__ */ u.jsx(
    "tr",
    {
      ref: s,
      className: Cn(
        "dt-border-b dt-transition-colors hover:dt-bg-muted/50 data-[state=selected]:dt-bg-muted",
        i
      ),
      ...d
    }
  )
);
da.displayName = "TableRow";
const Et = G.forwardRef(({ className: i, ...d }, s) => /* @__PURE__ */ u.jsx(
  "th",
  {
    ref: s,
    className: Cn(
      "dt-h-12 dt-px-4 dt-text-left dt-align-middle dt-font-medium dt-text-muted-foreground [&:has([role=checkbox])]:dt-pr-0",
      i
    ),
    ...d
  }
));
Et.displayName = "TableHead";
const Nt = G.forwardRef(({ className: i, ...d }, s) => /* @__PURE__ */ u.jsx(
  "td",
  {
    ref: s,
    className: Cn("dt-p-4 dt-align-middle [&:has([role=checkbox])]:dt-pr-0", i),
    ...d
  }
));
Nt.displayName = "TableCell";
function Cc(i) {
  return i ? i.split(" | ").map((d) => d.replace("/", "-")) : ["·"];
}
function pm({
  label: i,
  active: d,
  dir: s,
  onClick: g
}) {
  const h = d ? s === 1 ? vf : hf : gf;
  return /* @__PURE__ */ u.jsxs(Qc, { variant: "ghost", size: "sm", onClick: g, className: "dt--ml-3", children: [
    i,
    /* @__PURE__ */ u.jsx(h, { className: `dt-ml-1.5 dt-inline dt-size-3.5${d ? "" : " dt-opacity-40"}` })
  ] });
}
function Xc(i) {
  const { rows: d, sortKey: s, sortDir: g, onSortChange: h, onRowClick: w, onToggleSelect: k, onToggleFavorite: S, allSelected: M, onSelectAll: D, emptyMessage: $, ariaLabel: W, labels: N } = i;
  if (!d.length)
    return /* @__PURE__ */ u.jsx("p", { className: "dt-p-6 dt-text-center dt-text-sm dt-text-muted-foreground", children: $ });
  const q = (E, _) => /* @__PURE__ */ u.jsx(pm, { label: _, active: s === E, dir: g, onClick: () => h(E) });
  return /* @__PURE__ */ u.jsx("div", { className: "dersler-table-root dt-overflow-hidden dt-rounded-lg dt-border dt-border-border", children: /* @__PURE__ */ u.jsxs(Kc, { "aria-label": W, children: [
    /* @__PURE__ */ u.jsx(Gc, { children: /* @__PURE__ */ u.jsxs(da, { children: [
      /* @__PURE__ */ u.jsx(Et, { className: "dt-h-9 dt-w-8 dt-p-2", children: /* @__PURE__ */ u.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: M,
          "aria-label": N.selectAll,
          onChange: (E) => D(E.target.checked)
        }
      ) }),
      /* @__PURE__ */ u.jsx(Et, { className: "dt-h-9 dt-w-8 dt-p-2" }),
      /* @__PURE__ */ u.jsx(Et, { className: "dt-h-9 dt-p-2", children: q("crn", N.crn) }),
      /* @__PURE__ */ u.jsx(Et, { className: "dt-h-9 dt-p-2", children: q("code", N.code) }),
      /* @__PURE__ */ u.jsx(Et, { className: "dt-h-9 dt-p-2", children: q("name", N.name) }),
      /* @__PURE__ */ u.jsx(Et, { className: "dt-h-9 dt-p-2", children: q("instructor", N.instructor) }),
      /* @__PURE__ */ u.jsx(Et, { className: "dt-h-9 dt-p-2", children: q("when", N.when) }),
      /* @__PURE__ */ u.jsx(Et, { className: "dt-h-9 dt-p-2", children: N.where }),
      /* @__PURE__ */ u.jsx(Et, { className: "dt-h-9 dt-p-2 dt-text-right", children: q("fill", N.fill) })
    ] }) }),
    /* @__PURE__ */ u.jsx(Yc, { children: d.map((E) => /* @__PURE__ */ u.jsxs(da, { className: "dt-cursor-pointer", onClick: () => w(E.key), children: [
      /* @__PURE__ */ u.jsx(Nt, { className: "dt-p-2", onClick: (_) => _.stopPropagation(), children: /* @__PURE__ */ u.jsx(
        "input",
        {
          type: "checkbox",
          className: "dt-size-4",
          checked: E.selected,
          "aria-label": N.selectSection,
          onChange: (_) => k(E.key, _.target.checked)
        }
      ) }),
      /* @__PURE__ */ u.jsx(Nt, { className: "dt-p-2", onClick: (_) => _.stopPropagation(), children: /* @__PURE__ */ u.jsx(
        "button",
        {
          type: "button",
          className: "dt-text-base dt-leading-none",
          "aria-label": E.favorite ? N.removeFav : N.addFav,
          "aria-pressed": E.favorite,
          onClick: () => S(E.key),
          children: E.favorite ? "★" : "☆"
        }
      ) }),
      /* @__PURE__ */ u.jsx(Nt, { className: "dt-p-2 dt-font-mono dt-text-muted-foreground", dangerouslySetInnerHTML: { __html: E.crnHTML } }),
      /* @__PURE__ */ u.jsx(Nt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: E.codeHTML } }),
      /* @__PURE__ */ u.jsx(Nt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: E.nameHTML } }),
      /* @__PURE__ */ u.jsx(Nt, { className: "dt-p-2", dangerouslySetInnerHTML: { __html: E.instructorHTML } }),
      /* @__PURE__ */ u.jsx(Nt, { className: "dt-p-2 dt-font-mono dt-text-xs", children: Cc(E.when).map((_, L) => /* @__PURE__ */ u.jsx("div", { children: _ }, L)) }),
      /* @__PURE__ */ u.jsx(Nt, { className: "dt-p-2 dt-text-xs dt-text-muted-foreground", children: E.where ? Cc(E.where).map((_, L) => /* @__PURE__ */ u.jsx("div", { children: _ }, L)) : "·" }),
      /* @__PURE__ */ u.jsx(Nt, { className: "dt-p-2 dt-text-right dt-tabular-nums", dangerouslySetInnerHTML: { __html: E.quotaHTML } })
    ] }, E.key)) })
  ] }) });
}
const bn = (i) => `${String(Math.floor(i / 60)).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}`;
function qc(i) {
  const d = [...i].sort((w, k) => w.start - k.start || w.end - k.end), s = [], g = d.map((w) => {
    let k = s.findIndex((S) => S <= w.start);
    return k < 0 ? (k = s.length, s.push(w.end)) : s[k] = w.end, { ...w, lane: k, laneCount: 1, conflict: !1 };
  }), h = Math.max(1, s.length);
  return g.map((w) => ({
    ...w,
    laneCount: h,
    conflict: g.some((k) => k.key !== w.key && w.start < k.end && k.start < w.end)
  }));
}
function fm() {
  const i = "(max-width: 600px)", [d, s] = G.useState(() => window.matchMedia(i).matches);
  return G.useEffect(() => {
    const g = window.matchMedia(i), h = () => s(g.matches);
    return g.addEventListener("change", h), () => g.removeEventListener("change", h);
  }, []), d;
}
function Zc({ session: i, compact: d = !1 }) {
  return /* @__PURE__ */ u.jsxs("span", { className: "pp-session-meta", children: [
    /* @__PURE__ */ u.jsxs("span", { children: [
      /* @__PURE__ */ u.jsx(oo, { "aria-hidden": "true" }),
      bn(i.start),
      "–",
      bn(i.end)
    ] }),
    /* @__PURE__ */ u.jsxs("span", { children: [
      /* @__PURE__ */ u.jsx(ma, { "aria-hidden": "true" }),
      i.crn
    ] }),
    !d && i.instructor && /* @__PURE__ */ u.jsxs("span", { children: [
      /* @__PURE__ */ u.jsx(jn, { "aria-hidden": "true" }),
      i.instructor
    ] }),
    !d && i.where && /* @__PURE__ */ u.jsxs("span", { children: [
      /* @__PURE__ */ u.jsx(Br, { "aria-hidden": "true" }),
      i.where
    ] })
  ] });
}
function mm({ props: i, visibleDays: d }) {
  const s = d.find((k) => i.sessions.some((S) => S.day === k)) ?? d[0], [g, h] = G.useState(s);
  G.useEffect(() => {
    d.includes(g) || h(s);
  }, [g, s, d]);
  const w = qc(i.sessions.filter((k) => k.day === g));
  return /* @__PURE__ */ u.jsxs("div", { className: "pp-agenda", children: [
    /* @__PURE__ */ u.jsx("div", { className: "pp-day-tabs", role: "tablist", "aria-label": i.labels.title, style: { "--pp-days": d.length }, children: d.map((k) => /* @__PURE__ */ u.jsxs("button", { type: "button", role: "tab", "aria-selected": g === k, className: g === k ? "is-active" : "", onClick: () => h(k), children: [
      i.dayLabels[k],
      i.sessions.some((S) => S.day === k) && /* @__PURE__ */ u.jsx("span", { "aria-hidden": "true" })
    ] }, k)) }),
    /* @__PURE__ */ u.jsx("div", { className: "pp-agenda-list", children: w.length ? w.map((k) => /* @__PURE__ */ u.jsxs(
      "button",
      {
        type: "button",
        className: `pp-agenda-card${k.conflict ? " is-conflict" : ""}`,
        style: { "--pp-color": k.color },
        onClick: () => i.onOpen(k.rowKey),
        children: [
          /* @__PURE__ */ u.jsxs("span", { className: "pp-agenda-time", children: [
            /* @__PURE__ */ u.jsx("b", { children: bn(k.start) }),
            /* @__PURE__ */ u.jsx("small", { children: bn(k.end) })
          ] }),
          /* @__PURE__ */ u.jsxs("span", { className: "pp-agenda-copy", children: [
            /* @__PURE__ */ u.jsxs("strong", { children: [
              /* @__PURE__ */ u.jsx("span", { className: "pp-color-dot" }),
              k.code
            ] }),
            /* @__PURE__ */ u.jsx("span", { className: "pp-agenda-name", children: k.name }),
            /* @__PURE__ */ u.jsx(Zc, { session: k, compact: !0 }),
            k.instructor && /* @__PURE__ */ u.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ u.jsx(jn, { "aria-hidden": "true" }),
              k.instructor
            ] }),
            k.where && /* @__PURE__ */ u.jsxs("span", { className: "pp-agenda-detail", children: [
              /* @__PURE__ */ u.jsx(Br, { "aria-hidden": "true" }),
              k.where
            ] }),
            k.conflict && /* @__PURE__ */ u.jsxs("em", { children: [
              /* @__PURE__ */ u.jsx(Pc, { "aria-hidden": "true" }),
              i.labels.conflict
            ] })
          ] })
        ]
      },
      k.key
    )) : /* @__PURE__ */ u.jsxs("div", { className: "pp-empty-day", children: [
      /* @__PURE__ */ u.jsx(Hr, { "aria-hidden": "true" }),
      /* @__PURE__ */ u.jsx("p", { children: i.labels.emptyDay })
    ] }) })
  ] });
}
function Jc(i) {
  const d = fm(), [s, g] = G.useState(null), [h, w] = G.useState(null), k = i.sessions.some((F) => F.day >= 5), S = i.showWeekend || k ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4], M = i.sessions.length > 0, D = G.useMemo(() => {
    if (!M) return { start: 480, end: 1080 };
    const F = Math.min(...i.sessions.map((oe) => oe.start)), Y = Math.max(...i.sessions.map((oe) => oe.end));
    return i.showFullDay ? { start: 420, end: 1380 } : { start: Math.min(510, F), end: Math.min(1440, Y + 60) };
  }, [i.sessions, i.showFullDay, M]), $ = 34, W = Math.max(1, Math.ceil((D.end - D.start) / 30)), N = W * $, q = /* @__PURE__ */ new Date(), E = (q.getDay() + 6) % 7, _ = q.getHours() * 60 + q.getMinutes(), L = (_ - D.start) / 30 * $;
  G.useEffect(() => {
    if (!s) return;
    const F = () => g(null);
    return window.addEventListener("pointerdown", F, { once: !0 }), window.addEventListener("blur", F, { once: !0 }), () => {
      window.removeEventListener("pointerdown", F), window.removeEventListener("blur", F);
    };
  }, [s]);
  const Z = (F, Y) => {
    F.preventDefault(), F.stopPropagation(), g({ session: Y, x: Math.min(F.clientX, window.innerWidth - 232), y: Math.min(F.clientY, window.innerHeight - 230) });
  }, B = (F, Y) => {
    const oe = F.getBoundingClientRect(), J = 286, ye = Math.max(10, Math.min(oe.left + oe.width / 2 - J / 2, window.innerWidth - J - 10)), xe = oe.top < 190;
    w({ session: Y, x: ye, y: xe ? oe.bottom + 9 : oe.top - 9, side: xe ? "bottom" : "top" });
  };
  return /* @__PURE__ */ u.jsxs("section", { className: "dersler-table-root program-planner-root", "aria-label": i.labels.title, children: [
    /* @__PURE__ */ u.jsxs("header", { className: "pp-heading", children: [
      /* @__PURE__ */ u.jsx("span", { className: "pp-heading-icon", children: /* @__PURE__ */ u.jsx(Hr, { "aria-hidden": "true" }) }),
      /* @__PURE__ */ u.jsxs("span", { children: [
        /* @__PURE__ */ u.jsx("strong", { children: i.labels.title }),
        /* @__PURE__ */ u.jsxs("small", { children: [
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
    !M && !i.untimed.length ? /* @__PURE__ */ u.jsxs("div", { className: "pp-empty", children: [
      /* @__PURE__ */ u.jsx(ha, { "aria-hidden": "true" }),
      /* @__PURE__ */ u.jsx("strong", { children: i.labels.empty })
    ] }) : d && !i.forceGrid ? /* @__PURE__ */ u.jsx(mm, { props: i, visibleDays: S }) : M ? /* @__PURE__ */ u.jsx("div", { className: "pp-calendar-scroll", children: /* @__PURE__ */ u.jsxs("div", { className: "pp-calendar", style: { "--pp-days": S.length }, children: [
      /* @__PURE__ */ u.jsxs("div", { className: "pp-calendar-head", children: [
        /* @__PURE__ */ u.jsx("span", {}),
        S.map((F) => /* @__PURE__ */ u.jsx("b", { children: i.dayLabels[F] }, F))
      ] }),
      /* @__PURE__ */ u.jsxs("div", { className: "pp-calendar-body", children: [
        /* @__PURE__ */ u.jsx("div", { className: "pp-time-column", style: { height: N }, children: Array.from({ length: W }, (F, Y) => /* @__PURE__ */ u.jsx("span", { children: bn(D.start + Y * 30) }, Y)) }),
        S.map((F) => {
          const Y = qc(i.sessions.filter((J) => J.day === F)), oe = i.showNow && F === E && _ >= D.start && _ < D.end;
          return /* @__PURE__ */ u.jsxs("div", { className: `pp-day-column${F >= 5 ? " is-weekend" : ""}`, style: { height: N }, children: [
            oe && /* @__PURE__ */ u.jsx("span", { className: "pp-now", style: { top: L } }),
            Y.map((J) => {
              const ye = (J.start - D.start) / 30 * $, xe = Math.max(30, (J.end - J.start) / 30 * $), _e = 100 / J.laneCount, Fe = xe < 104;
              return /* @__PURE__ */ u.jsxs(
                "button",
                {
                  type: "button",
                  className: `pp-session${Fe ? " is-short" : ""}${J.conflict ? " is-conflict" : ""}`,
                  style: {
                    top: ye,
                    height: xe,
                    left: `calc(${J.lane * _e}% + 3px)`,
                    width: `calc(${_e}% - 6px)`,
                    "--pp-color": J.color,
                    "--pp-foreground": J.foreground
                  },
                  "aria-describedby": (h == null ? void 0 : h.session.key) === J.key ? "pp-course-tooltip" : void 0,
                  onClick: () => i.onOpen(J.rowKey),
                  onContextMenu: (Ie) => Z(Ie, J),
                  onMouseEnter: (Ie) => B(Ie.currentTarget, J),
                  onMouseLeave: () => w(null),
                  onFocus: (Ie) => B(Ie.currentTarget, J),
                  onBlur: () => w(null),
                  children: [
                    /* @__PURE__ */ u.jsx(bf, { className: "pp-pin", "aria-hidden": "true" }),
                    /* @__PURE__ */ u.jsxs("strong", { children: [
                      J.code,
                      ": ",
                      /* @__PURE__ */ u.jsx("span", { children: J.name })
                    ] }),
                    /* @__PURE__ */ u.jsx(Zc, { session: J, compact: Fe }),
                    J.conflict && /* @__PURE__ */ u.jsxs("span", { className: "pp-conflict", children: [
                      /* @__PURE__ */ u.jsx(Pc, { "aria-hidden": "true" }),
                      i.labels.conflict
                    ] }),
                    /* @__PURE__ */ u.jsx(zc, { className: "pp-more", "aria-hidden": "true" })
                  ]
                },
                J.key
              );
            })
          ] }, F);
        })
      ] })
    ] }) }) : null,
    !!i.untimed.length && /* @__PURE__ */ u.jsxs("div", { className: "pp-untimed", children: [
      /* @__PURE__ */ u.jsx(_c, { "aria-hidden": "true" }),
      /* @__PURE__ */ u.jsxs("div", { children: [
        /* @__PURE__ */ u.jsx("strong", { children: i.untimed.some((F) => F.special) ? i.labels.special : i.labels.unknown }),
        i.untimed.map((F) => /* @__PURE__ */ u.jsxs("span", { children: [
          /* @__PURE__ */ u.jsx("b", { children: F.code }),
          " · CRN ",
          F.crn,
          " — ",
          F.detail
        ] }, F.key))
      ] })
    ] }),
    s && /* @__PURE__ */ u.jsxs("div", { className: "pp-context", role: "menu", "aria-label": `${s.session.code} ${i.labels.actions}`, style: { left: s.x, top: s.y }, onPointerDown: (F) => F.stopPropagation(), children: [
      /* @__PURE__ */ u.jsxs("p", { children: [
        /* @__PURE__ */ u.jsx("strong", { children: s.session.code }),
        /* @__PURE__ */ u.jsxs("span", { children: [
          "CRN ",
          s.session.crn
        ] })
      ] }),
      /* @__PURE__ */ u.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        i.onOpen(s.session.rowKey), g(null);
      }, children: [
        /* @__PURE__ */ u.jsx(Hr, {}),
        i.labels.details
      ] }),
      /* @__PURE__ */ u.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        i.onCopyCrn(s.session.rowKey), g(null);
      }, children: [
        /* @__PURE__ */ u.jsx(ia, {}),
        i.labels.copyCrn
      ] }),
      /* @__PURE__ */ u.jsxs("button", { type: "button", role: "menuitem", onClick: () => {
        i.onOpenObs(s.session.rowKey), g(null);
      }, children: [
        /* @__PURE__ */ u.jsx(fa, {}),
        i.labels.openObs
      ] }),
      /* @__PURE__ */ u.jsxs("button", { type: "button", role: "menuitem", className: "is-danger", onClick: () => {
        i.onRemove(s.session.rowKey), g(null);
      }, children: [
        /* @__PURE__ */ u.jsx(aa, {}),
        i.labels.remove
      ] })
    ] }),
    h && /* @__PURE__ */ u.jsxs("div", { id: "pp-course-tooltip", className: "pp-tooltip", role: "tooltip", style: { left: h.x, top: h.y }, "data-side": h.side, children: [
      /* @__PURE__ */ u.jsxs("div", { className: "pp-tooltip-title", children: [
        /* @__PURE__ */ u.jsx("span", { style: { background: h.session.color } }),
        /* @__PURE__ */ u.jsx("strong", { children: h.session.code }),
        /* @__PURE__ */ u.jsxs("b", { children: [
          bn(h.session.start),
          "–",
          bn(h.session.end)
        ] })
      ] }),
      /* @__PURE__ */ u.jsx("p", { children: h.session.name }),
      /* @__PURE__ */ u.jsxs("dl", { children: [
        /* @__PURE__ */ u.jsxs("div", { children: [
          /* @__PURE__ */ u.jsx("dt", { children: /* @__PURE__ */ u.jsx(ma, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ u.jsx("dd", { children: h.session.crn })
        ] }),
        h.session.instructor && /* @__PURE__ */ u.jsxs("div", { children: [
          /* @__PURE__ */ u.jsx("dt", { children: /* @__PURE__ */ u.jsx(jn, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ u.jsx("dd", { children: h.session.instructor })
        ] }),
        h.session.where && /* @__PURE__ */ u.jsxs("div", { children: [
          /* @__PURE__ */ u.jsx("dt", { children: /* @__PURE__ */ u.jsx(Br, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ u.jsx("dd", { children: h.session.where })
        ] })
      ] }),
      /* @__PURE__ */ u.jsxs("small", { children: [
        i.labels.details,
        " · sağ tık: ",
        i.labels.actions
      ] })
    ] })
  ] });
}
function ed({ html: i, empty: d, emptyMessage: s, ariaLabel: g }) {
  const h = G.useRef(null), w = G.useRef(null), k = G.useRef(null), [S, M] = G.useState(null);
  G.useLayoutEffect(() => {
    const E = h.current;
    if (!E) return;
    [...E.querySelectorAll("select.dp-grade")].forEach((L, Z) => {
      var Y, oe;
      L.hidden = !0, L.tabIndex = -1;
      const B = document.createElement("button");
      B.type = "button", B.className = `cp-grade-trigger${L.value ? " filled" : ""}`, B.dataset.gradeIndex = String(Z), B.setAttribute("aria-haspopup", "listbox"), B.setAttribute("aria-expanded", "false"), B.setAttribute("aria-label", L.getAttribute("aria-label") || "Not seç");
      const F = document.createElement("span");
      F.textContent = ((Y = L.selectedOptions[0]) == null ? void 0 : Y.textContent) || ((oe = L.options[0]) == null ? void 0 : oe.textContent) || "—", B.appendChild(F), B.insertAdjacentHTML("beforeend", '<svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'), L.insertAdjacentElement("afterend", B);
    });
  }, [i]), G.useEffect(() => M(null), [i]), G.useEffect(() => {
    if (!S) return;
    const E = (Z) => {
      var F, Y;
      const B = Z.target;
      (F = k.current) != null && F.contains(B) || (Y = w.current) != null && Y.contains(B) || M(null);
    }, _ = () => M(null);
    window.addEventListener("pointerdown", E);
    const L = window.matchMedia("(min-width: 561px)").matches;
    return L && window.addEventListener("scroll", _, !0), window.addEventListener("resize", _), S.keyboard && requestAnimationFrame(() => {
      var Z, B;
      return (B = (Z = k.current) == null ? void 0 : Z.querySelector('[aria-selected="true"]')) == null ? void 0 : B.focus({ preventScroll: !0 });
    }), () => {
      window.removeEventListener("pointerdown", E), L && window.removeEventListener("scroll", _, !0), window.removeEventListener("resize", _);
    };
  }, [S]);
  const D = (E, _ = !1) => {
    var ye, xe;
    const L = Number(E.dataset.gradeIndex), Z = (ye = h.current) == null ? void 0 : ye.querySelectorAll("select.dp-grade")[L];
    if (!Z) return;
    const B = E.getBoundingClientRect(), F = 246, Y = window.innerHeight - B.bottom < F && B.top > F, oe = Math.min(292, window.innerWidth - 20), J = Math.max(10, Math.min(B.right - oe, window.innerWidth - oe - 10));
    (xe = w.current) == null || xe.setAttribute("aria-expanded", "false"), w.current = E, E.setAttribute("aria-expanded", "true"), M({
      selectIndex: L,
      options: [...Z.options].map((_e) => ({ value: _e.value, label: _e.textContent || _e.value })),
      value: Z.value,
      label: Z.getAttribute("aria-label") || "Not seç",
      x: J,
      y: Y ? B.top - 7 : B.bottom + 7,
      above: Y,
      keyboard: _
    });
  }, $ = (E) => {
    const _ = E.target.closest(".cp-grade-trigger");
    if (_) {
      if (E.preventDefault(), _ === w.current && S) {
        _.setAttribute("aria-expanded", "false"), M(null);
        return;
      }
      D(_);
    }
  }, W = (E) => {
    var L;
    if (E.key === "Escape" && S) {
      E.preventDefault(), (L = w.current) == null || L.setAttribute("aria-expanded", "false"), M(null);
      return;
    }
    const _ = E.target.closest(".cp-grade-trigger");
    !_ || !["Enter", " ", "ArrowDown", "ArrowUp"].includes(E.key) || (E.preventDefault(), D(_, !0));
  }, N = (E) => {
    var L, Z, B;
    if (!S) return;
    const _ = (L = h.current) == null ? void 0 : L.querySelectorAll("select.dp-grade")[S.selectIndex];
    _ && (_.value = E, _.dispatchEvent(new Event("change", { bubbles: !0 })), (Z = w.current) == null || Z.setAttribute("aria-expanded", "false"), (B = w.current) == null || B.focus(), M(null));
  }, q = (E) => {
    var B, F, Y;
    if (E.key === "Escape") {
      E.preventDefault(), (B = w.current) == null || B.setAttribute("aria-expanded", "false"), (F = w.current) == null || F.focus(), M(null);
      return;
    }
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(E.key)) return;
    E.preventDefault();
    const _ = [...E.currentTarget.querySelectorAll('[role="option"]')], L = Math.max(0, _.indexOf(document.activeElement)), Z = E.key === "ArrowDown" || E.key === "ArrowRight" ? 1 : -1;
    (Y = _[(L + Z + _.length) % _.length]) == null || Y.focus();
  };
  return d ? /* @__PURE__ */ u.jsxs("div", { className: "curriculum-plan-root cp-empty", role: "status", children: [
    /* @__PURE__ */ u.jsx(ha, { "aria-hidden": "true" }),
    /* @__PURE__ */ u.jsx("strong", { children: s })
  ] }) : /* @__PURE__ */ u.jsxs("section", { className: "curriculum-plan-root", "aria-label": g, onClick: $, onKeyDown: W, children: [
    /* @__PURE__ */ u.jsx("div", { ref: h, className: "cp-semester-grid", dangerouslySetInnerHTML: { __html: i } }),
    S && /* @__PURE__ */ u.jsx(
      "div",
      {
        ref: k,
        className: `cp-grade-menu${S.above ? " above" : ""}`,
        role: "listbox",
        "aria-label": S.label,
        style: { "--cp-menu-x": `${S.x}px`, "--cp-menu-y": `${S.y}px` },
        onKeyDown: q,
        children: S.options.map((E) => /* @__PURE__ */ u.jsxs(
          "button",
          {
            type: "button",
            role: "option",
            "aria-selected": E.value === S.value,
            className: E.value ? "" : "is-empty",
            onClick: () => N(E.value),
            children: [
              /* @__PURE__ */ u.jsx("span", { children: E.label }),
              E.value === S.value && /* @__PURE__ */ u.jsx(yf, { "aria-hidden": "true" })
            ]
          },
          E.value || "empty"
        ))
      }
    )
  ] });
}
function hm() {
  const i = "(max-width: 700px)", [d, s] = G.useState(() => window.matchMedia(i).matches);
  return G.useEffect(() => {
    const g = window.matchMedia(i), h = () => s(g.matches);
    return g.addEventListener("change", h), () => g.removeEventListener("change", h);
  }, []), d;
}
function gm({ message: i }) {
  return /* @__PURE__ */ u.jsxs("div", { className: "ex-empty", children: [
    /* @__PURE__ */ u.jsx(ha, { "aria-hidden": "true" }),
    /* @__PURE__ */ u.jsx("strong", { children: i })
  ] });
}
function vm({ props: i }) {
  return /* @__PURE__ */ u.jsxs("div", { className: "ex-table", role: "table", "aria-label": i.ariaLabel, children: [
    /* @__PURE__ */ u.jsxs("div", { className: `ex-head${i.showPlace ? "" : " without-place"}`, role: "row", children: [
      /* @__PURE__ */ u.jsx("span", { role: "columnheader", children: i.labels.course }),
      /* @__PURE__ */ u.jsx("span", { role: "columnheader", children: i.labels.instructor }),
      /* @__PURE__ */ u.jsx("span", { role: "columnheader", children: i.labels.type }),
      i.showPlace && /* @__PURE__ */ u.jsx("span", { role: "columnheader", children: i.labels.place }),
      /* @__PURE__ */ u.jsxs("span", { role: "columnheader", children: [
        i.labels.date,
        " / ",
        i.labels.time
      ] })
    ] }),
    /* @__PURE__ */ u.jsx("div", { role: "rowgroup", children: i.rows.map((d) => /* @__PURE__ */ u.jsxs("div", { className: `ex-row${i.showPlace ? "" : " without-place"}`, role: "row", children: [
      /* @__PURE__ */ u.jsxs("div", { className: "ex-course", role: "cell", children: [
        /* @__PURE__ */ u.jsx("button", { type: "button", onClick: () => i.onOpen(d.code), children: d.code }),
        /* @__PURE__ */ u.jsx("strong", { children: d.name }),
        /* @__PURE__ */ u.jsxs("small", { children: [
          /* @__PURE__ */ u.jsx(ma, { "aria-hidden": "true" }),
          d.crn
        ] })
      ] }),
      /* @__PURE__ */ u.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ u.jsx(jn, { "aria-hidden": "true" }),
        d.instructor || "·"
      ] }),
      /* @__PURE__ */ u.jsx("span", { role: "cell", children: /* @__PURE__ */ u.jsx("em", { className: "ex-type", children: d.type }) }),
      i.showPlace && /* @__PURE__ */ u.jsxs("span", { className: "ex-meta", role: "cell", children: [
        /* @__PURE__ */ u.jsx(Br, { "aria-hidden": "true" }),
        d.place || "·"
      ] }),
      /* @__PURE__ */ u.jsxs("div", { className: "ex-when", role: "cell", children: [
        /* @__PURE__ */ u.jsxs("strong", { children: [
          /* @__PURE__ */ u.jsx(Hr, { "aria-hidden": "true" }),
          d.date
        ] }),
        /* @__PURE__ */ u.jsxs("span", { children: [
          /* @__PURE__ */ u.jsx(oo, { "aria-hidden": "true" }),
          d.day,
          " ",
          d.time
        ] })
      ] })
    ] }, d.key)) })
  ] });
}
function ym({ props: i }) {
  const d = G.useMemo(() => {
    const s = [], g = /* @__PURE__ */ new Map();
    return i.rows.forEach((h) => {
      let w = g.get(h.date);
      w || (w = { date: h.date, day: h.day, exams: [] }, g.set(h.date, w), s.push(w)), w.exams.push(h);
    }), s;
  }, [i.rows]);
  return /* @__PURE__ */ u.jsx("div", { className: "ex-agenda", "aria-label": i.ariaLabel, children: d.map((s) => /* @__PURE__ */ u.jsxs("section", { className: "ex-day", children: [
    /* @__PURE__ */ u.jsxs("header", { children: [
      /* @__PURE__ */ u.jsx(Hr, { "aria-hidden": "true" }),
      /* @__PURE__ */ u.jsx("strong", { children: s.date }),
      /* @__PURE__ */ u.jsx("span", { children: s.day })
    ] }),
    /* @__PURE__ */ u.jsx("div", { children: s.exams.map((g) => /* @__PURE__ */ u.jsxs("article", { className: "ex-card", children: [
      /* @__PURE__ */ u.jsxs("span", { className: "ex-card-time", children: [
        /* @__PURE__ */ u.jsx(oo, { "aria-hidden": "true" }),
        /* @__PURE__ */ u.jsx("b", { children: g.time })
      ] }),
      /* @__PURE__ */ u.jsxs("div", { className: "ex-card-main", children: [
        /* @__PURE__ */ u.jsx("button", { type: "button", onClick: () => i.onOpen(g.code), children: g.code }),
        /* @__PURE__ */ u.jsx("strong", { children: g.name }),
        /* @__PURE__ */ u.jsxs("span", { children: [
          /* @__PURE__ */ u.jsx(_c, { "aria-hidden": "true" }),
          g.type,
          /* @__PURE__ */ u.jsx("i", { "aria-hidden": "true" }),
          "CRN ",
          g.crn
        ] }),
        g.instructor && /* @__PURE__ */ u.jsxs("span", { children: [
          /* @__PURE__ */ u.jsx(jn, { "aria-hidden": "true" }),
          g.instructor
        ] }),
        i.showPlace && g.place && /* @__PURE__ */ u.jsxs("span", { children: [
          /* @__PURE__ */ u.jsx(Br, { "aria-hidden": "true" }),
          g.place
        ] })
      ] })
    ] }, g.key)) })
  ] }, s.date)) });
}
function td(i) {
  const d = hm();
  return /* @__PURE__ */ u.jsx("section", { className: "dersler-table-root exams-list-root", children: i.rows.length ? d ? /* @__PURE__ */ u.jsx(ym, { props: i }) : /* @__PURE__ */ u.jsx(vm, { props: i }) : /* @__PURE__ */ u.jsx(gm, { message: i.emptyMessage }) });
}
function nd({ items: i, labels: d, onOpen: s, onCopy: g, onOpenObs: h, onRemove: w, onReorder: k }) {
  const [S, M] = G.useState(null), [D, $] = G.useState(null);
  if (!i.length) return /* @__PURE__ */ u.jsxs("div", { className: "pcl-empty", children: [
    /* @__PURE__ */ u.jsx(lo, { "aria-hidden": "true" }),
    /* @__PURE__ */ u.jsx("strong", { children: d.empty })
  ] });
  const W = (N, q) => {
    N.preventDefault(), D !== null && D !== q && k(D, q), $(null);
  };
  return /* @__PURE__ */ u.jsxs("div", { className: "pcl-list", role: "table", children: [
    /* @__PURE__ */ u.jsxs("div", { className: "pcl-head", role: "row", children: [
      /* @__PURE__ */ u.jsx("span", { role: "columnheader", children: d.course }),
      /* @__PURE__ */ u.jsx("span", { role: "columnheader", children: d.quota })
    ] }),
    i.map((N, q) => /* @__PURE__ */ u.jsxs(
      "article",
      {
        className: `pcl-item${N.full ? " is-full" : ""}`,
        role: "row",
        draggable: !0,
        onDragStart: () => $(q),
        onDragOver: (E) => E.preventDefault(),
        onDrop: (E) => W(E, q),
        onClick: (E) => {
          E.target.closest("button") || s(N.key);
        },
        children: [
          /* @__PURE__ */ u.jsx(xf, { className: "pcl-grip", "aria-hidden": "true" }),
          /* @__PURE__ */ u.jsxs("div", { className: "pcl-course", role: "cell", children: [
            /* @__PURE__ */ u.jsxs("div", { className: "pcl-title", children: [
              /* @__PURE__ */ u.jsx("strong", { children: N.code }),
              N.badge && /* @__PURE__ */ u.jsx("span", { children: N.badge })
            ] }),
            /* @__PURE__ */ u.jsx("p", { children: N.name }),
            /* @__PURE__ */ u.jsxs("div", { className: "pcl-meta", children: [
              /* @__PURE__ */ u.jsxs("span", { children: [
                /* @__PURE__ */ u.jsx(oo, { "aria-hidden": "true" }),
                N.when
              ] }),
              /* @__PURE__ */ u.jsxs("span", { children: [
                /* @__PURE__ */ u.jsx(jn, { "aria-hidden": "true" }),
                N.instructor
              ] })
            ] }),
            N.credit && /* @__PURE__ */ u.jsx("small", { children: N.credit })
          ] }),
          /* @__PURE__ */ u.jsxs("div", { className: "pcl-numbers", role: "cell", children: [
            /* @__PURE__ */ u.jsx("b", { children: N.quota }),
            /* @__PURE__ */ u.jsxs("span", { children: [
              "CRN ",
              N.crn
            ] }),
            N.backup && /* @__PURE__ */ u.jsx("em", { children: N.backup })
          ] }),
          /* @__PURE__ */ u.jsx("button", { className: "pcl-remove", type: "button", onClick: () => w(N.key), "aria-label": `${N.code} ${d.remove}`, children: /* @__PURE__ */ u.jsx(aa, { "aria-hidden": "true" }) }),
          /* @__PURE__ */ u.jsxs("div", { className: "pcl-menu-wrap", children: [
            /* @__PURE__ */ u.jsxs("button", { className: "pcl-menu-trigger", type: "button", "aria-expanded": S === N.key, "aria-haspopup": "menu", onClick: () => M(S === N.key ? null : N.key), children: [
              /* @__PURE__ */ u.jsx(zc, { "aria-hidden": "true" }),
              /* @__PURE__ */ u.jsxs("span", { className: "sr-only", children: [
                N.code,
                " ",
                d.actions
              ] })
            ] }),
            S === N.key && /* @__PURE__ */ u.jsxs("div", { className: "pcl-menu", role: "menu", children: [
              /* @__PURE__ */ u.jsxs("button", { role: "menuitem", onClick: () => {
                s(N.key), M(null);
              }, children: [
                /* @__PURE__ */ u.jsx(lo, {}),
                d.details
              ] }),
              /* @__PURE__ */ u.jsxs("button", { role: "menuitem", onClick: () => {
                g(N.key, "crn"), M(null);
              }, children: [
                /* @__PURE__ */ u.jsx(ia, {}),
                d.copyCrn
              ] }),
              /* @__PURE__ */ u.jsxs("button", { role: "menuitem", onClick: () => {
                g(N.key, "code"), M(null);
              }, children: [
                /* @__PURE__ */ u.jsx(ia, {}),
                d.copyCode
              ] }),
              N.instructor && /* @__PURE__ */ u.jsxs("button", { role: "menuitem", onClick: () => {
                g(N.key, "instructor"), M(null);
              }, children: [
                /* @__PURE__ */ u.jsx(jn, {}),
                d.copyInstructor
              ] }),
              /* @__PURE__ */ u.jsxs("button", { role: "menuitem", onClick: () => {
                h(N.key), M(null);
              }, children: [
                /* @__PURE__ */ u.jsx(fa, {}),
                d.openObs
              ] }),
              /* @__PURE__ */ u.jsxs("button", { role: "menuitem", "data-act": "remove", className: "is-danger", onClick: () => {
                w(N.key), M(null);
              }, children: [
                /* @__PURE__ */ u.jsx(aa, {}),
                d.remove
              ] })
            ] })
          ] })
        ]
      },
      N.key
    ))
  ] });
}
const xm = { overview: lo, sections: kf, catalog: Sf, history: wf };
function wm(i) {
  const [d, s] = G.useState(i.active), g = (h, w) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(h.key)) return;
    h.preventDefault();
    const k = h.key === "Home" ? 0 : h.key === "End" ? i.panels.length - 1 : (w + (h.key === "ArrowRight" ? 1 : -1) + i.panels.length) % i.panels.length;
    s(i.panels[k].key), requestAnimationFrame(() => {
      var S;
      return (S = document.getElementById(`d-tab-${i.panels[k].key}`)) == null ? void 0 : S.focus();
    });
  };
  return /* @__PURE__ */ u.jsxs("div", { className: "cdr-root", children: [
    /* @__PURE__ */ u.jsxs("header", { className: "cdr-head d-head", children: [
      /* @__PURE__ */ u.jsxs("div", { className: "cdr-title d-title-block", children: [
        /* @__PURE__ */ u.jsxs("h3", { id: "detail-title", children: [
          /* @__PURE__ */ u.jsx("span", { className: "d-code", children: i.code }),
          /* @__PURE__ */ u.jsx("span", { className: "d-name", children: i.name })
        ] }),
        /* @__PURE__ */ u.jsx("div", { className: "d-meta", children: i.meta.map((h) => /* @__PURE__ */ u.jsx("span", { className: "d-pill", children: h }, h)) })
      ] }),
      i.obsLink && /* @__PURE__ */ u.jsxs("a", { className: "cdr-obs d-obs", href: i.obsLink, target: "_blank", rel: "noopener", children: [
        /* @__PURE__ */ u.jsx(fa, { "aria-hidden": "true" }),
        i.obsLabel
      ] })
    ] }),
    /* @__PURE__ */ u.jsx("nav", { className: "cdr-tabs d-tabs", role: "tablist", "aria-label": i.tabLabel, children: i.panels.map((h, w) => {
      const k = xm[h.key] || lo;
      return /* @__PURE__ */ u.jsxs("button", { type: "button", role: "tab", id: `d-tab-${h.key}`, "data-dtab": h.key, "aria-controls": `d-panel-${h.key}`, "aria-selected": d === h.key, tabIndex: d === h.key ? 0 : -1, onClick: () => s(h.key), onKeyDown: (S) => g(S, w), children: [
        /* @__PURE__ */ u.jsx(k, { "aria-hidden": "true" }),
        /* @__PURE__ */ u.jsx("span", { children: h.label }),
        h.count !== void 0 && /* @__PURE__ */ u.jsx("b", { children: h.count })
      ] }, h.key);
    }) }),
    /* @__PURE__ */ u.jsx("div", { className: "cdr-panels d-panels", children: i.panels.map((h) => /* @__PURE__ */ u.jsx("section", { role: "tabpanel", id: `d-panel-${h.key}`, "aria-labelledby": `d-tab-${h.key}`, "data-dpanel": h.key, hidden: d !== h.key, dangerouslySetInnerHTML: { __html: h.html } }, h.key)) })
  ] });
}
const km = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:var(--sans);font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--mono);font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.dersler-table-root .dt-relative{position:relative}.dersler-table-root .dt--ml-3{margin-left:-.75rem}.dersler-table-root .dt-ml-1\\.5{margin-left:.375rem}.dersler-table-root .dt-inline{display:inline}.dersler-table-root .dt-inline-flex{display:inline-flex}.dersler-table-root .dt-size-3\\.5{width:.875rem;height:.875rem}.dersler-table-root .dt-size-4{width:1rem;height:1rem}.dersler-table-root .dt-h-10{height:2.5rem}.dersler-table-root .dt-h-12{height:3rem}.dersler-table-root .dt-h-9{height:2.25rem}.dersler-table-root .dt-w-8{width:2rem}.dersler-table-root .dt-w-full{width:100%}.dersler-table-root .dt-caption-bottom{caption-side:bottom}.dersler-table-root .dt-cursor-pointer{cursor:pointer}.dersler-table-root .dt-items-center{align-items:center}.dersler-table-root .dt-justify-center{justify-content:center}.dersler-table-root .dt-overflow-auto{overflow:auto}.dersler-table-root .dt-overflow-hidden{overflow:hidden}.dersler-table-root .dt-whitespace-nowrap{white-space:nowrap}.dersler-table-root .dt-rounded-lg{border-radius:var(--radius-card)}.dersler-table-root .dt-rounded-md{border-radius:calc(var(--radius-card) - 2px)}.dersler-table-root .dt-border{border-width:1px}.dersler-table-root .dt-border-b{border-bottom-width:1px}.dersler-table-root .dt-border-border{border-color:var(--hairline)}.dersler-table-root .dt-bg-primary{background-color:var(--acid)}.dersler-table-root .dt-p-2{padding:.5rem}.dersler-table-root .dt-p-4{padding:1rem}.dersler-table-root .dt-p-6{padding:1.5rem}.dersler-table-root .dt-px-3{padding-left:.75rem;padding-right:.75rem}.dersler-table-root .dt-px-4{padding-left:1rem;padding-right:1rem}.dersler-table-root .dt-py-2{padding-top:.5rem;padding-bottom:.5rem}.dersler-table-root .dt-text-left{text-align:left}.dersler-table-root .dt-text-center{text-align:center}.dersler-table-root .dt-text-right{text-align:right}.dersler-table-root .dt-align-middle{vertical-align:middle}.dersler-table-root .dt-font-mono{font-family:var(--mono)}.dersler-table-root .dt-text-base{font-size:1rem;line-height:1.5rem}.dersler-table-root .dt-text-sm{font-size:.875rem;line-height:1.25rem}.dersler-table-root .dt-text-xs{font-size:.75rem;line-height:1rem}.dersler-table-root .dt-font-medium{font-weight:500}.dersler-table-root .dt-tabular-nums{--tw-numeric-spacing: tabular-nums;font-variant-numeric:var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)}.dersler-table-root .dt-leading-none{line-height:1}.dersler-table-root .dt-text-muted-foreground{color:var(--dim)}.dersler-table-root .dt-text-primary-foreground{color:var(--on-accent)}.dersler-table-root .dt-opacity-40{opacity:.4}.dersler-table-root .dt-transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.dersler-table-root{font-family:var(--sans);color:var(--fg)}.program-planner-root{--pp-slot: 34px;position:relative;min-width:0}.pp-heading{display:flex;align-items:center;gap:11px;margin:0 0 12px}.pp-heading-icon{display:grid;width:36px;height:36px;place-items:center;flex:0 0 auto;border:1px solid color-mix(in srgb,var(--acid) 34%,var(--line));border-radius:10px;color:var(--acid);background:color-mix(in srgb,var(--acid) 8%,var(--panel))}.pp-heading-icon svg{width:18px;height:18px}.pp-heading>span:last-child{display:grid;gap:2px;min-width:0}.pp-heading strong{font-size:14px;letter-spacing:-.01em}.pp-heading small{color:var(--dimmer);font:10px/1.35 var(--mono)}.pp-loading{display:grid;min-height:260px;place-items:center;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2);font:11px/1.4 var(--mono)}.pp-calendar-scroll{max-height:min(69vh,780px);overflow:auto;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card);scrollbar-width:thin}.pp-calendar{min-width:760px}.pp-calendar-head,.pp-calendar-body{display:grid;grid-template-columns:62px repeat(var(--pp-days),minmax(130px,1fr))}.pp-calendar-head{position:sticky;top:0;z-index:20;min-height:43px;border-bottom:1px solid var(--hairline-strong);background:var(--panel)}.pp-calendar-head>*{display:grid;place-items:center;border-right:1px solid var(--line)}.pp-calendar-head>span{position:sticky;left:0;z-index:22;background:var(--panel)}.pp-calendar-head b{color:var(--dim);font:700 10px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase}.pp-time-column{position:sticky;left:0;z-index:10;background:var(--panel);box-shadow:1px 0 0 var(--hairline-strong)}.pp-time-column span{display:block;height:var(--pp-slot);padding:5px 9px 0 0;color:var(--dimmer);text-align:right;font:9px/1 var(--mono);transform:translateY(-9px)}.pp-day-column{position:relative;min-width:0;border-right:1px solid var(--line);background-color:color-mix(in srgb,var(--panel) 97%,var(--fg));background-image:repeating-linear-gradient(to bottom,transparent 0,transparent calc(var(--pp-slot) - 1px),var(--line) calc(var(--pp-slot) - 1px),var(--line) var(--pp-slot))}.pp-day-column.is-weekend{background-color:var(--panel-2)}.pp-session{position:absolute;z-index:2;display:flex;flex-direction:column;gap:5px;overflow:hidden;padding:10px 25px 8px 10px;border:1px solid color-mix(in srgb,var(--pp-foreground) 25%,transparent);border-radius:8px;color:var(--pp-foreground);text-align:left;background:var(--pp-color);box-shadow:0 2px 6px color-mix(in srgb,var(--pp-color) 30%,transparent);cursor:pointer;transition:filter .14s ease,box-shadow .14s ease,transform .14s ease}.pp-session:hover,.pp-session:focus-visible{z-index:6;filter:saturate(1.08) brightness(1.04);box-shadow:0 7px 18px color-mix(in srgb,var(--pp-color) 42%,transparent);transform:translateY(-1px)}.pp-session:focus-visible{outline:3px solid var(--acid);outline-offset:2px}.pp-session.is-conflict{border:2px solid var(--red)}.pp-session.is-short{justify-content:center;padding-block:5px}.pp-session.is-short .pp-session-meta{display:none}.pp-session>strong{display:-webkit-box;overflow:hidden;color:inherit;font:800 11px/1.26 var(--sans);-webkit-box-orient:vertical;-webkit-line-clamp:3}.pp-session>strong span{font-weight:650}.pp-pin,.pp-more{position:absolute;right:7px;width:14px;height:14px;opacity:.75}.pp-pin{top:8px}.pp-more{bottom:7px}.pp-session-meta{display:grid;gap:3px;min-width:0}.pp-session-meta>span,.pp-agenda-detail{display:flex;align-items:center;gap:5px;min-width:0;overflow:hidden;color:inherit;font:9px/1.2 var(--mono);text-overflow:ellipsis;white-space:nowrap}.pp-session-meta svg,.pp-agenda-detail svg{width:11px;height:11px;flex:0 0 auto}.pp-conflict{display:flex;align-items:center;gap:4px;margin-top:auto;font:800 9px/1 var(--mono)}.pp-conflict svg{width:11px;height:11px}.pp-now{position:absolute;z-index:7;right:0;left:0;height:2px;background:var(--acid);pointer-events:none}.pp-now:before{position:absolute;top:-3px;left:-1px;width:8px;height:8px;border-radius:50%;background:var(--acid);content:""}.pp-empty,.pp-empty-day{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:12px;background:var(--panel-2)}.pp-empty svg,.pp-empty-day svg{width:25px;height:25px}.pp-empty strong,.pp-empty-day p{margin:0;font-size:12px}.pp-untimed{display:flex;gap:10px;margin-top:12px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-untimed>svg{width:18px;height:18px;flex:0 0 auto;color:var(--amber)}.pp-untimed>div{display:grid;gap:5px}.pp-untimed strong{font-size:11px}.pp-untimed span{color:var(--dim);font:10px/1.4 var(--mono)}.pp-context{position:fixed;z-index:10010;display:grid;width:224px;overflow:hidden;padding:6px;border:1px solid var(--hairline-strong);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pp-context p{display:grid;gap:2px;margin:0 0 4px;padding:8px 9px;border-bottom:1px solid var(--line)}.pp-context p strong{font-size:12px}.pp-context p span{color:var(--dimmer);font:9px/1 var(--mono)}.pp-context button{display:flex;align-items:center;gap:9px;width:100%;padding:8px 9px;border:0;border-radius:6px;color:var(--fg);text-align:left;background:transparent;font:11px/1.2 var(--sans)}.pp-context button:hover,.pp-context button:focus-visible{background:var(--panel-2)}.pp-context button.is-danger{color:var(--red)}.pp-context button svg{width:14px;height:14px}.pp-agenda{min-width:0}.pp-day-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:12px;padding:4px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.pp-day-tabs button{position:relative;min-width:0;min-height:38px;border:0;border-radius:7px;color:var(--dim);background:transparent;font:700 10px/1 var(--mono)}.pp-day-tabs button.is-active{color:var(--panel);background:var(--fg)}.pp-day-tabs button>span{position:absolute;bottom:5px;left:50%;width:3px;height:3px;border-radius:50%;background:var(--acid)}.pp-agenda-list{display:grid;gap:8px}.pp-agenda-card{--pp-color: var(--cyan);display:grid;grid-template-columns:54px minmax(0,1fr);gap:12px;width:100%;padding:13px;border:1px solid var(--line);border-radius:11px;color:var(--fg);text-align:left;background:var(--panel);box-shadow:inset 4px 0 0 var(--pp-color)}.pp-agenda-card.is-conflict{border-color:var(--red)}.pp-agenda-time{display:grid;align-content:start;gap:3px;font:11px/1 var(--mono)}.pp-agenda-time small{color:var(--dimmer);font-size:9px}.pp-agenda-copy{display:grid;gap:5px;min-width:0}.pp-agenda-copy>strong{display:flex;align-items:center;gap:7px;font-size:13px}.pp-color-dot{width:7px;height:7px;border-radius:50%;background:var(--pp-color)}.pp-agenda-name{color:var(--dim);font-size:12px}.pp-agenda-copy em{display:flex;align-items:center;gap:5px;color:var(--red);font:700 10px/1 var(--mono)}.pp-agenda-copy em svg{width:12px;height:12px}.pp-empty-day{min-height:150px}.curriculum-plan-root{min-width:0;color:var(--fg);font-family:var(--sans)}.dp-semesters.dp-react{display:block}.cp-semester-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;align-items:start}.curriculum-plan-root .dp-sem{min-width:0;overflow:hidden;padding:0;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card)}.curriculum-plan-root .dp-sem-head{position:relative;min-height:58px;margin:0;padding:13px 43px 12px 15px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);cursor:pointer}.curriculum-plan-root .dp-sem-head>span:first-child{font-size:15px;font-weight:750;letter-spacing:-.015em}.curriculum-plan-root .dp-sem-head:after{position:absolute;top:50%;right:17px;width:8px;height:8px;margin:-6px 0 0;border-right:1.5px solid var(--dim);border-bottom:1.5px solid var(--dim);content:"";transform:rotate(45deg);transition:transform .16s ease}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head{margin:0;padding:13px 43px 12px 15px;border:0}.curriculum-plan-root .dp-sem:not([open]) .dp-sem-head:after{margin-top:-2px;transform:rotate(-45deg)}.curriculum-plan-root .dp-load{color:var(--dim);font:10px/1.25 var(--mono)}.curriculum-plan-root .dp-sem-avg{margin-left:auto;color:var(--acid);font:700 10px/1.25 var(--mono);white-space:nowrap}.curriculum-plan-root .dp-colhead{min-height:31px;margin:0 14px;padding:6px 0;border-bottom:1px solid var(--line);font-size:9px;letter-spacing:.06em}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin:0 14px;padding:0;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent}.curriculum-plan-root .dp-course:last-child,.curriculum-plan-root .dp-elective:last-child{border-bottom:0}.curriculum-plan-root .dp-row{min-height:52px;padding:8px 0}.curriculum-plan-root .dp-credit{min-width:29px;height:24px;padding:0 5px;border-color:color-mix(in srgb,var(--acid) 28%,var(--line));border-radius:7px;color:var(--acid);background:color-mix(in srgb,var(--acid) 7%,var(--panel));font-size:10px}.curriculum-plan-root .dp-title{display:grid;gap:2px}.curriculum-plan-root .dp-code{width:-moz-fit-content;width:fit-content;color:var(--cyan);font:750 12px/1.25 var(--mono)}.curriculum-plan-root .dp-name{overflow:hidden;color:var(--dim);font-size:11px;line-height:1.3;text-overflow:ellipsis}.curriculum-plan-root .dp-repeat-btn{color:var(--dimmer)}.curriculum-plan-root .dp-repeat-btn svg{display:block}.curriculum-plan-root .dp-repeat-btn.on{color:var(--amber);background:color-mix(in srgb,var(--amber) 8%,transparent)}.curriculum-plan-root .dp-grade-wrap{border-radius:7px}.curriculum-plan-root .dp-grade{border-radius:5px;font-family:var(--mono)}.curriculum-plan-root .cp-grade-trigger{position:relative;display:inline-flex;align-items:center;justify-content:space-between;gap:7px;min-width:65px;min-height:31px;padding:5px 8px;border:1px solid var(--line);border-radius:7px;color:var(--dim);background:var(--panel);font:700 10px/1 var(--mono);cursor:pointer;transition:border-color .14s ease,background-color .14s ease,color .14s ease}.curriculum-plan-root .cp-grade-trigger:hover,.curriculum-plan-root .cp-grade-trigger[aria-expanded=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel))}.curriculum-plan-root .cp-grade-trigger.filled{border-color:color-mix(in srgb,var(--acid) 58%,var(--line));color:var(--fg)}.curriculum-plan-root .cp-grade-trigger svg{width:13px;height:13px;flex:0 0 auto;transition:transform .14s ease}.curriculum-plan-root .cp-grade-trigger[aria-expanded=true] svg{transform:rotate(180deg)}.cp-grade-menu{position:fixed;z-index:10020;top:var(--cp-menu-y);left:var(--cp-menu-x);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;width:292px;max-width:calc(100vw - 20px);padding:8px;border:1px solid var(--hairline-strong);border-radius:11px;background:var(--panel);box-shadow:var(--shadow-float)}.cp-grade-menu.above{transform:translateY(-100%)}.cp-grade-menu button{position:relative;display:flex;align-items:center;justify-content:center;min-width:0;min-height:34px;padding:6px;border:1px solid transparent;border-radius:7px;color:var(--dim);background:var(--panel-2);font:700 10px/1 var(--mono);cursor:pointer}.cp-grade-menu button:hover,.cp-grade-menu button:focus-visible{border-color:var(--cyan);color:var(--fg);background:color-mix(in srgb,var(--cyan) 7%,var(--panel))}.cp-grade-menu button[aria-selected=true]{border-color:var(--acid);color:var(--fg);background:color-mix(in srgb,var(--acid) 12%,var(--panel))}.cp-grade-menu button.is-empty{grid-column:1 / -1;justify-content:flex-start;padding-inline:10px}.cp-grade-menu button svg{position:absolute;top:50%;right:6px;width:12px;height:12px;color:var(--acid);transform:translateY(-50%)}.curriculum-plan-root .dp-grade-clear svg{display:block}.curriculum-plan-root .dp-sec-btn.open{padding:5px 8px;border:1px solid color-mix(in srgb,var(--cyan) 28%,var(--line));border-radius:7px;background:color-mix(in srgb,var(--cyan) 6%,var(--panel));font:650 10px/1 var(--sans);text-decoration:none}.curriculum-plan-root .dp-sec-btn.open:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-sec-btn.closed{font-size:10px}.curriculum-plan-root .dp-secslot{margin:0;padding:10px 0 12px;border-top:1px dashed var(--line)}.curriculum-plan-root .dp-section{min-height:31px}.curriculum-plan-root .dp-actions button{min-height:28px;padding:3px 7px;border:1px solid var(--line);border-radius:6px}.curriculum-plan-root .dp-actions button:hover{border-color:var(--cyan);text-decoration:none}.curriculum-plan-root .dp-elective{background:color-mix(in srgb,var(--acid) 3%,transparent)}.curriculum-plan-root .dp-elective-name{color:var(--dim);font-size:11px}.curriculum-plan-root .dp-epick{min-height:31px;border-radius:7px;background:var(--panel)}.cp-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.cp-empty svg{width:24px;height:24px}.cp-empty strong{font-size:12px}.exams-list-root{min-width:0;color:var(--fg);font-family:var(--sans)}.ex-table{overflow:hidden;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-head,.ex-row{display:grid;grid-template-columns:minmax(230px,1.45fr) minmax(145px,.9fr) minmax(105px,.62fr) minmax(170px,1fr) minmax(190px,1.05fr);align-items:center;gap:14px}.ex-head{min-height:36px;padding:8px 15px;color:var(--dimmer);border-bottom:1px solid var(--hairline-strong);background:var(--panel-2);font:750 9px/1 var(--mono);letter-spacing:.055em;text-transform:uppercase}.ex-row{min-height:72px;padding:11px 15px;border-bottom:1px solid var(--line);transition:background-color .14s ease}.ex-row:last-child{border-bottom:0}.ex-row:hover{background:color-mix(in srgb,var(--cyan) 3%,var(--panel))}.ex-row.without-place{grid-template-columns:minmax(230px,1.5fr) minmax(155px,1fr) minmax(115px,.7fr) minmax(200px,1fr)}.ex-course{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:baseline;gap:3px 9px;min-width:0}.ex-course button,.ex-card-main button{width:-moz-fit-content;width:fit-content;padding:0;border:0;color:var(--cyan);background:transparent;font:800 12px/1.25 var(--mono);cursor:pointer}.ex-course button:hover,.ex-course button:focus-visible,.ex-card-main button:hover,.ex-card-main button:focus-visible{text-decoration:underline;text-underline-offset:3px}.ex-course strong{overflow:hidden;font-size:12px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.ex-course small{display:flex;grid-column:1 / -1;align-items:center;gap:4px;color:var(--dimmer);font:9px/1.2 var(--mono)}.ex-course small svg{width:10px;height:10px}.ex-meta{display:flex;align-items:flex-start;gap:6px;min-width:0;color:var(--dim);font-size:11px;line-height:1.35}.ex-meta svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-type{display:inline-flex;padding:5px 7px;border:1px solid color-mix(in srgb,var(--acid) 24%,var(--line));border-radius:6px;color:var(--fg);background:color-mix(in srgb,var(--acid) 6%,var(--panel));font:650 10px/1.15 var(--sans);font-style:normal}.ex-when{display:grid;gap:5px}.ex-when strong,.ex-when span{display:flex;align-items:center;gap:6px}.ex-when strong{font-size:11px}.ex-when span{color:var(--dim);font:10px/1.2 var(--mono)}.ex-when svg{width:13px;height:13px;color:var(--dimmer)}.ex-empty{display:grid;min-height:190px;place-items:center;align-content:center;gap:9px;color:var(--dimmer);border:1px dashed var(--line);border-radius:13px;background:var(--panel-2)}.ex-empty svg{width:25px;height:25px}.ex-empty strong{font-size:12px}.ex-agenda{display:grid;gap:15px}.ex-day{overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--panel);box-shadow:var(--shadow-card)}.ex-day>header{display:flex;align-items:center;gap:8px;min-height:42px;padding:9px 12px;border-bottom:1px solid var(--hairline-strong);background:var(--panel-2)}.ex-day>header svg{width:15px;height:15px;color:var(--acid)}.ex-day>header strong{font:750 11px/1 var(--mono)}.ex-day>header span{margin-left:auto;color:var(--dim);font-size:11px}.ex-card{display:grid;grid-template-columns:74px minmax(0,1fr);gap:12px;padding:13px 12px;border-bottom:1px solid var(--line)}.ex-card:last-child{border-bottom:0}.ex-card-time{display:flex;align-items:flex-start;gap:5px;color:var(--fg);font:700 10px/1.35 var(--mono)}.ex-card-time svg{width:13px;height:13px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main{display:grid;gap:5px;min-width:0}.ex-card-main>strong{font-size:12px;line-height:1.3}.ex-card-main>span{display:flex;align-items:center;gap:6px;min-width:0;color:var(--dim);font-size:10px;line-height:1.35}.ex-card-main>span svg{width:12px;height:12px;flex:0 0 auto;color:var(--dimmer)}.ex-card-main>span i{width:3px;height:3px;margin-inline:2px;border-radius:50%;background:var(--dimmer)}@media(max-width:900px){.cp-semester-grid{grid-template-columns:1fr}.ex-head,.ex-row{grid-template-columns:minmax(210px,1.45fr) minmax(135px,.85fr) minmax(95px,.62fr) minmax(175px,1fr)}.ex-head>:nth-child(4):not(:last-child),.ex-row>:nth-child(4):not(:last-child){display:none}}@media(max-width:560px){.curriculum-plan-root .dp-sem-head{flex-wrap:nowrap;gap:7px;min-height:48px;padding-block:10px}.curriculum-plan-root .dp-sem-head>span:first-child{width:auto;flex:0 0 auto;font-size:13px}.curriculum-plan-root .dp-load{overflow:hidden;flex:1 1 auto;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-sem-avg{margin-left:auto;font-size:9px}.curriculum-plan-root .dp-colhead{display:none}.curriculum-plan-root .dp-course,.curriculum-plan-root .dp-elective{margin-inline:10px}.curriculum-plan-root .dp-row,.curriculum-plan-root .dp-elective .dp-row{grid-template-columns:34px minmax(0,1fr) auto;gap:4px 8px;min-height:60px;padding:7px 0}.curriculum-plan-root .dp-credit{grid-column:1;grid-row:1 / 3;align-self:center}.curriculum-plan-root .dp-title{display:flex;grid-column:2;grid-row:1;align-items:baseline;gap:6px;overflow:hidden;white-space:nowrap}.curriculum-plan-root .dp-code{flex:0 0 auto;font-size:11px;min-height:28px}.curriculum-plan-root .dp-name{min-width:0;font-size:10px;text-overflow:ellipsis;white-space:nowrap}.curriculum-plan-root .dp-repeat-btn,.curriculum-plan-root .dp-repeat-cell{grid-column:3;grid-row:1}.curriculum-plan-root .dp-grade-wrap,.curriculum-plan-root .dp-elective-inputs{grid-column:2;grid-row:2;justify-self:start}.curriculum-plan-root .dp-sec-btn{grid-column:3;grid-row:1 / 3;align-self:center}.curriculum-plan-root .cp-grade-trigger{min-height:34px;padding:5px 7px}.curriculum-plan-root .cp-grade-trigger:after{position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;content:""}.curriculum-plan-root .dp-grade-clear{min-height:32px}.cp-grade-menu,.cp-grade-menu.above{top:auto;right:10px;bottom:max(10px,env(safe-area-inset-bottom));left:10px;grid-template-columns:repeat(5,minmax(0,1fr));width:auto;max-width:none;gap:4px;padding:7px;transform:none}.cp-grade-menu button{min-height:42px;padding:5px 3px;font-size:9px}.cp-grade-menu button.is-empty{min-height:38px}.cp-grade-menu button svg{right:5px;width:11px;height:11px}}@media(max-width:600px){.pp-heading{margin-bottom:10px}.pp-heading-icon{width:32px;height:32px}.pp-day-tabs{overflow-x:auto;grid-template-columns:repeat(var(--pp-days, 5),minmax(48px,1fr))}}@media(prefers-reduced-motion:reduce){.pp-session{transition:none}}.pcl-list{position:relative;display:grid;color:var(--fg);font-family:var(--sans)}.pcl-head{display:grid;grid-template-columns:1fr auto;padding:8px 2px;color:var(--dimmer);border-bottom:1px solid var(--line);font:700 9px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase}.pcl-item{position:relative;display:grid;grid-template-columns:16px minmax(0,1fr) auto 30px 30px;gap:6px;align-items:start;padding:13px 0;border-bottom:1px solid var(--line);cursor:pointer;transition:background-color .14s ease,transform .14s ease}.pcl-item:hover{background:color-mix(in srgb,var(--acid) 4%,transparent)}.pcl-item.is-full{background:color-mix(in srgb,var(--red) 5%,transparent)}.pcl-grip{width:14px;height:14px;margin-top:2px;color:var(--dimmer);cursor:grab}.pcl-course{min-width:0}.pcl-title{display:flex;align-items:center;gap:6px}.pcl-title strong{color:var(--cyan);font:800 11px/1.2 var(--mono)}.pcl-title>span{padding:3px 5px;border:1px solid color-mix(in srgb,var(--acid) 40%,var(--line));border-radius:5px;color:var(--acid);font:700 8px/1 var(--sans)}.pcl-course>p{margin:4px 0 7px;overflow:hidden;color:var(--fg);font-size:11px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}.pcl-meta{display:grid;gap:4px;color:var(--dim);font-size:9px}.pcl-meta span{display:flex;align-items:center;gap:5px;min-width:0}.pcl-meta svg{width:11px;height:11px;flex:0 0 auto;color:var(--dimmer)}.pcl-course small{display:block;margin-top:6px;color:var(--acid);font:700 9px/1.2 var(--mono)}.pcl-numbers{display:grid;justify-items:end;gap:5px;font-family:var(--mono)}.pcl-numbers b{font-size:10px;font-variant-numeric:tabular-nums}.pcl-numbers span{color:var(--dimmer);font-size:8px}.pcl-numbers em{color:var(--amber);font-size:8px;font-style:normal}.pcl-remove,.pcl-menu-trigger{display:grid;width:28px;height:28px;place-items:center;padding:0;border:1px solid transparent;border-radius:7px;color:var(--dimmer);background:transparent;cursor:pointer}.pcl-remove{display:grid}.pcl-menu-trigger:hover,.pcl-menu-trigger:focus-visible{border-color:var(--line-hot);color:var(--fg);background:var(--panel-2)}.pcl-menu-trigger svg,.pcl-remove svg{width:14px;height:14px}.pcl-menu-wrap{position:relative}.pcl-menu{position:absolute;z-index:30;top:31px;right:0;display:grid;width:208px;padding:6px;border:1px solid var(--line-hot);border-radius:10px;background:var(--panel);box-shadow:var(--shadow-float)}.pcl-menu button{display:flex;align-items:center;gap:8px;min-height:34px;padding:7px 9px;border:0;border-radius:6px;color:var(--fg);background:transparent;font:600 10px/1.2 var(--sans);text-align:left;cursor:pointer}.pcl-menu button:hover,.pcl-menu button:focus-visible{background:var(--panel-2)}.pcl-menu button.is-danger{color:var(--red)}.pcl-menu svg{width:13px;height:13px}.pcl-empty{display:grid;min-height:150px;place-items:center;align-content:center;gap:8px;color:var(--dimmer);text-align:center}.pcl-empty svg{width:24px;height:24px}.pcl-empty strong{max-width:25ch;font-size:11px}.cdr-root{display:flex;min-height:0;height:100%;flex-direction:column;color:var(--fg);font-family:var(--sans)}.cdr-head{flex:0 0 auto}.cdr-obs{display:inline-flex;align-items:center;gap:7px}.cdr-obs svg{width:14px;height:14px;order:-1}.cdr-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;padding:5px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2)}.cdr-tabs button{display:flex;min-width:0;min-height:37px;align-items:center;justify-content:center;gap:6px;padding:7px 8px;border:0;border-radius:7px;color:var(--dim);background:transparent;font:700 10px/1 var(--sans);cursor:pointer}.cdr-tabs button svg{width:13px;height:13px}.cdr-tabs button>span{min-width:0;padding:0;border:0;border-radius:0;color:inherit;background:transparent;font:inherit}.cdr-tabs button b{min-width:18px;padding:3px 5px;border-radius:999px;background:color-mix(in srgb,var(--fg) 7%,transparent);font:700 8px/1 var(--mono)}.cdr-tabs button[aria-selected=true]{color:var(--on-accent);background:var(--acid-vivid);box-shadow:0 5px 16px color-mix(in srgb,var(--acid) 20%,transparent)}.cdr-panels{min-height:0;flex:1 1 auto;overflow-y:auto;overscroll-behavior:contain;scrollbar-color:var(--line-hot) transparent}.pp-tooltip{position:fixed;z-index:10030;width:286px;padding:12px;border:1px solid var(--line-hot);border-radius:11px;color:var(--fg);background:var(--panel);box-shadow:var(--shadow-float);pointer-events:none;transform:translateY(-100%);animation:pp-tooltip-in .13s cubic-bezier(.2,.8,.2,1)}.pp-tooltip[data-side=bottom]{transform:none}.pp-tooltip-title{display:grid;grid-template-columns:8px 1fr auto;align-items:center;gap:7px}.pp-tooltip-title>span{width:8px;height:8px;border-radius:3px}.pp-tooltip-title strong{font:800 11px/1.2 var(--mono)}.pp-tooltip-title b{color:var(--dim);font:700 9px/1 var(--mono)}.pp-tooltip>p{margin:7px 0 9px;font-size:11px;font-weight:700;line-height:1.35}.pp-tooltip dl{display:grid;gap:5px;margin:0}.pp-tooltip dl div{display:grid;grid-template-columns:16px 1fr;align-items:center;color:var(--dim);font-size:10px}.pp-tooltip dt,.pp-tooltip dd{margin:0}.pp-tooltip svg{width:11px;height:11px}.pp-tooltip>small{display:block;margin-top:10px;padding-top:8px;color:var(--dimmer);border-top:1px solid var(--line);font-size:8px}@keyframes pp-tooltip-in{0%{opacity:.2;filter:blur(3px)}to{opacity:1;filter:blur(0)}}@media(max-width:600px){.pcl-item{grid-template-columns:14px minmax(0,1fr) auto 30px;padding-block:12px}.pcl-remove{display:none}.pcl-course>p{white-space:normal}.pcl-meta{grid-template-columns:1fr}.cdr-tabs{position:sticky;top:0;z-index:4;margin-inline:-2px}.cdr-tabs button{min-height:44px;padding-inline:4px}.cdr-tabs button svg{display:none}.cdr-title .d-name{font-size:18px}.pp-tooltip{display:none}}@media print{.program-planner-root .pp-calendar-scroll{max-height:none;overflow:visible;box-shadow:none}.program-planner-root .pp-calendar{min-width:0}.program-planner-root .pp-context{display:none}}.dersler-table-root .hover\\:dt-bg-accent:hover{background-color:var(--panel-2)}.dersler-table-root .hover\\:dt-text-accent-foreground:hover{color:var(--acid)}.dersler-table-root .focus-visible\\:dt-outline-none:focus-visible{outline:2px solid transparent;outline-offset:2px}.dersler-table-root .focus-visible\\:dt-ring-2:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.dersler-table-root .focus-visible\\:dt-ring-ring:focus-visible{--tw-ring-color: var(--cyan)}.dersler-table-root .focus-visible\\:dt-ring-offset-2:focus-visible{--tw-ring-offset-width: 2px}.dersler-table-root .disabled\\:dt-pointer-events-none:disabled{pointer-events:none}.dersler-table-root .disabled\\:dt-opacity-50:disabled{opacity:.5}.dersler-table-root .data-\\[state\\=selected\\]\\:dt-bg-muted[data-state=selected]{background-color:var(--panel-2)}.dersler-table-root .\\[\\&\\:has\\(\\[role\\=checkbox\\]\\)\\]\\:dt-pr-0:has([role=checkbox]){padding-right:0}.dersler-table-root :is(.\\[\\&_tr\\:last-child\\]\\:dt-border-0 tr:last-child){border-width:0px}.dersler-table-root :is(.\\[\\&_tr\\]\\:dt-border-b tr){border-bottom-width:1px}';
let un = null, Dt = null, At = null, Ft = null, Ut = null, xt = null, ro = null;
function er() {
  ro || (ro = document.createElement("style"), ro.textContent = km, document.head.appendChild(ro));
}
function Sm(i, d) {
  er(), un = Zn.createRoot(i), un.render(
    /* @__PURE__ */ u.jsx(G.StrictMode, { children: /* @__PURE__ */ u.jsx(Xc, { ...d }) })
  );
}
function bm(i) {
  un && un.render(
    /* @__PURE__ */ u.jsx(G.StrictMode, { children: /* @__PURE__ */ u.jsx(Xc, { ...i }) })
  );
}
function jm() {
  un == null || un.unmount(), un = null;
}
function Cm(i, d) {
  er(), Dt = Zn.createRoot(i), Dt.render(/* @__PURE__ */ u.jsx(Jc, { ...d }));
}
function Em(i) {
  Dt == null || Dt.render(/* @__PURE__ */ u.jsx(Jc, { ...i }));
}
function Nm() {
  Dt == null || Dt.unmount(), Dt = null;
}
function zm(i, d) {
  er(), Ut = Zn.createRoot(i), Ut.render(/* @__PURE__ */ u.jsx(nd, { ...d }));
}
function _m(i) {
  Ut == null || Ut.render(/* @__PURE__ */ u.jsx(nd, { ...i }));
}
function Pm() {
  Ut == null || Ut.unmount(), Ut = null;
}
function Mm(i, d) {
  er(), xt == null || xt.unmount(), xt = Zn.createRoot(i), df.flushSync(() => xt == null ? void 0 : xt.render(/* @__PURE__ */ u.jsx(wm, { ...d })));
}
function Lm() {
  xt == null || xt.unmount(), xt = null;
}
function Tm(i, d) {
  er(), At = Zn.createRoot(i), At.render(/* @__PURE__ */ u.jsx(ed, { ...d }));
}
function Rm(i) {
  At == null || At.render(/* @__PURE__ */ u.jsx(ed, { ...i }));
}
function Om() {
  At == null || At.unmount(), At = null;
}
function Im(i, d) {
  er(), Ft = Zn.createRoot(i), Ft.render(/* @__PURE__ */ u.jsx(td, { ...d }));
}
function Dm(i) {
  Ft == null || Ft.render(/* @__PURE__ */ u.jsx(td, { ...i }));
}
function Am() {
  Ft == null || Ft.unmount(), Ft = null;
}
export {
  Sm as mount,
  Mm as mountCourseDetail,
  Tm as mountCurriculum,
  Im as mountExams,
  Cm as mountProgram,
  zm as mountProgramList,
  jm as unmount,
  Lm as unmountCourseDetail,
  Om as unmountCurriculum,
  Am as unmountExams,
  Nm as unmountProgram,
  Pm as unmountProgramList,
  bm as update,
  Rm as updateCurriculum,
  Dm as updateExams,
  Em as updateProgram,
  _m as updateProgramList
};
