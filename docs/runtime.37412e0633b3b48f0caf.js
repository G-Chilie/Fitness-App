(() => {
  'use strict';
  var e,
    r = {},
    t = {};
  function o(e) {
    var n = t[e];
    if (void 0 !== n) return n.exports;
    var a = (t[e] = { exports: {} });
    return r[e].call(a.exports, a, a.exports, o), a.exports;
  }
  (o.m = r),
    (e = []),
    (o.O = (r, t, n, a) => {
      if (!t) {
        var l = 1 / 0;
        for (p = 0; p < e.length; p++) {
          for (var [t, n, a] = e[p], s = !0, f = 0; f < t.length; f++)
            (!1 & a || l >= a) && Object.keys(o.O).every((e) => o.O[e](t[f]))
              ? t.splice(f--, 1)
              : ((s = !1), a < l && (l = a));
          s && (e.splice(p--, 1), (r = n()));
        }
        return r;
      }
      a = a || 0;
      for (var p = e.length; p > 0 && e[p - 1][2] > a; p--) e[p] = e[p - 1];
      e[p] = [t, n, a];
    }),
    (o.n = (e) => {
      var r = e && e.__esModule ? () => e.default : () => e;
      return o.d(r, { a: r }), r;
    }),
    (o.d = (e, r) => {
      for (var t in r) o.o(r, t) && !o.o(e, t) && Object.defineProperty(e, t, { enumerable: !0, get: r[t] });
    }),
    (o.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)),
    (() => {
      var e = { 666: 0 };
      o.O.j = (r) => 0 === e[r];
      var r = (r, t) => {
          var n,
            a,
            [l, s, f] = t,
            p = 0;
          for (n in s) o.o(s, n) && (o.m[n] = s[n]);
          if (f) var i = f(o);
          for (r && r(t); p < l.length; p++) o.o(e, (a = l[p])) && e[a] && e[a][0](), (e[l[p]] = 0);
          return o.O(i);
        },
        t = (self.webpackChunkbodys_perfect_diet = self.webpackChunkbodys_perfect_diet || []);
      t.forEach(r.bind(null, 0)), (t.push = r.bind(null, t.push.bind(t)));
    })();
})();
