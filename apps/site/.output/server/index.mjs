globalThis.__nitro_main__ = import.meta.url;
import { H3Core, HTTPError, NodeResponse, composeMiddleware, defineHandler, defineLazyEventHandler, serve, toEventHandler } from "./_libs/h3+rou3+srvx.mjs";
import { createMatcherFromFind, headers, memoizeRouteRulesMatcher } from "./_libs/h3.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/polyfills/fast-response.mjs
if (globalThis.Response !== NodeResponse) globalThis.Response = NodeResponse;
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/_libs/hookable.mjs
function e$1(t, n, r, i) {
	for (let a = r; a < t.length; a += 1) try {
		let r = i ? i.run(() => t[a](...n)) : t[a](...n);
		if (r && typeof r.then == `function`) return Promise.resolve(r).then(() => e$1(t, n, a + 1, i));
	} catch (e) {
		return Promise.reject(e);
	}
}
var t$1 = class {
	_hooks;
	constructor() {
		this._hooks = {};
	}
	hook(e, t) {
		return !e || typeof t != `function` ? () => {} : (this._hooks[e] = this._hooks[e] || [], this._hooks[e].push(t), () => {
			t &&= (this.removeHook(e, t), void 0);
		});
	}
	removeHook(e, t) {
		let n = this._hooks[e];
		if (n) {
			let r = n.indexOf(t);
			r !== -1 && n.splice(r, 1), n.length === 0 && (this._hooks[e] = void 0);
		}
	}
	callHook(t, ...n) {
		let r = this._hooks[t];
		if (r && r.length !== 0) return e$1(r.slice(), n, 0);
	}
};
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/_libs/ufo.mjs
String.fromCharCode;
var e = /%2f/gi;
function t(e = ``) {
	try {
		return decodeURIComponent(`` + e);
	} catch {
		return `` + e;
	}
}
function n(n) {
	return t(n.replace(e, `%252F`));
}
var r = /\/$|\/\?|\/#/;
var i = /^\.?\//;
function a(e = ``, t) {
	return t ? r.test(e) : e.endsWith(`/`);
}
function o(e = ``, t) {
	if (!t) return (a(e) ? e.slice(0, -1) : e) || `/`;
	if (!a(e, !0)) return e || `/`;
	let n = e, r = ``, i = e.indexOf(`#`);
	i !== -1 && (n = e.slice(0, i), r = e.slice(i));
	let [o, ...s] = n.split(`?`);
	return ((o.endsWith(`/`) ? o.slice(0, -1) : o) || `/`) + (s.length > 0 ? `?${s.join(`?`)}` : ``) + r;
}
function s(e = ``, t) {
	if (!t) return e.endsWith(`/`) ? e : e + `/`;
	if (a(e, !0)) return e || `/`;
	let n = e, r = ``, i = e.indexOf(`#`);
	if (i !== -1 && (n = e.slice(0, i), r = e.slice(i), !n)) return r;
	let [o, ...s] = n.split(`?`);
	return o + `/` + (s.length > 0 ? `?${s.join(`?`)}` : ``) + r;
}
function c(e = ``) {
	return e.startsWith(`/`);
}
function l(e = ``) {
	return c(e) ? e : `/` + e;
}
function u(e) {
	return e && e !== `/`;
}
function d(e, ...t) {
	let n = e || ``;
	for (let e of t.filter((e) => u(e))) if (n) {
		let t = e.replace(i, ``);
		n = s(n) + t;
	} else n = e;
	return n;
}
// #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"684d-LZzsDXPkl1anwPY2ZMLICXcfAwo\"",
		"mtime": "2026-11-11T20:46:35.914Z",
		"size": 26701,
		"path": "../public/apple-touch-icon.png"
	},
	"/assets/_-DHN1N9lX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4061d-dpL8sb0FwnTnAJvFF9pURfCV0So\"",
		"mtime": "2026-11-11T20:46:35.038Z",
		"size": 263709,
		"path": "../public/assets/_-DHN1N9lX.js"
	},
	"/assets/_-Dcj_rxLA.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14096-RNFIjrhLzaHqd/1qhqRV69jkYLY\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 82070,
		"path": "../public/assets/_-Dcj_rxLA.css"
	},
	"/assets/_-VlyGg3gK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26bbb-wYdXU2s6z6j9zel60Wuo/yEeg9U\"",
		"mtime": "2026-11-11T20:46:35.038Z",
		"size": 158651,
		"path": "../public/assets/_-VlyGg3gK.js"
	},
	"/assets/__vite-browser-external-BDfy7Drd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67-wmLuHcfUF7a0QHK6hMQS/KbaMo8\"",
		"mtime": "2026-11-11T20:46:35.038Z",
		"size": 103,
		"path": "../public/assets/__vite-browser-external-BDfy7Drd.js"
	},
	"/assets/accordion.mdx_macro_id_src_2Flib_2Fsource-CNY8qt0Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"644d-PX365Lqa+gSdQrdxs0xqke/7zwo\"",
		"mtime": "2026-11-11T20:46:35.038Z",
		"size": 25677,
		"path": "../public/assets/accordion.mdx_macro_id_src_2Flib_2Fsource-CNY8qt0Q.js"
	},
	"/assets/alert.mdx_macro_id_src_2Flib_2Fsource-B8ckc57U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3247-noGhq89pMZnqMxutAKCF1uP0sgE\"",
		"mtime": "2026-11-11T20:46:35.038Z",
		"size": 12871,
		"path": "../public/assets/alert.mdx_macro_id_src_2Flib_2Fsource-B8ckc57U.js"
	},
	"/assets/algolia-gRndbTnN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30e-KFibjp4DGnmd1ypbyjSeMmXSqTI\"",
		"mtime": "2026-11-11T20:46:35.038Z",
		"size": 782,
		"path": "../public/assets/algolia-gRndbTnN.js"
	},
	"/assets/app-DuDcm_1e.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"15c30-eaxGY0HNXEsDhdwFyW6duBr8Z3I\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 89136,
		"path": "../public/assets/app-DuDcm_1e.css"
	},
	"/assets/app-bar.mdx_macro_id_src_2Flib_2Fsource--TPeLkoK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2fb3-HxrcGH0IF3HHpy6Ro7b9ZTwhCMo\"",
		"mtime": "2026-11-11T20:46:35.038Z",
		"size": 12211,
		"path": "../public/assets/app-bar.mdx_macro_id_src_2Flib_2Fsource--TPeLkoK.js"
	},
	"/assets/aspect-ratio.mdx_macro_id_src_2Flib_2Fsource-Bv41QZcK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"710f-hP5NZBeoKIOAmrq8hNhey7egCVk\"",
		"mtime": "2026-11-11T20:46:35.038Z",
		"size": 28943,
		"path": "../public/assets/aspect-ratio.mdx_macro_id_src_2Flib_2Fsource-Bv41QZcK.js"
	},
	"/assets/authentication.mdx_macro_id_src_2Flib_2Fsource-Cg6slS0k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f06e-y4ZDR4QKej8lBTpX5GzDh59Svck\"",
		"mtime": "2026-11-11T20:46:35.038Z",
		"size": 61550,
		"path": "../public/assets/authentication.mdx_macro_id_src_2Flib_2Fsource-Cg6slS0k.js"
	},
	"/assets/autocomplete.mdx_macro_id_src_2Flib_2Fsource-BGpWZn9j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f85-qFiQ3+sRICZm1isS0ScpREHgRHE\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 32645,
		"path": "../public/assets/autocomplete.mdx_macro_id_src_2Flib_2Fsource-BGpWZn9j.js"
	},
	"/assets/avatar.mdx_macro_id_src_2Flib_2Fsource-GwOlGgtz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3a81-qOvnwHBzfUnhewVsO3iy3V5It84\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 14977,
		"path": "../public/assets/avatar.mdx_macro_id_src_2Flib_2Fsource-GwOlGgtz.js"
	},
	"/assets/backdrop.mdx_macro_id_src_2Flib_2Fsource-WN86V0oY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2825-JvS4f1dIhzH8AZBvk0GAH5+PCO8\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 10277,
		"path": "../public/assets/backdrop.mdx_macro_id_src_2Flib_2Fsource-WN86V0oY.js"
	},
	"/assets/background.mdx_macro_id_src_2Flib_2Fsource-yDkDb7zY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34c8-zkfMzDy/aPdV9j5rAD5cgFubeQg\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 13512,
		"path": "../public/assets/background.mdx_macro_id_src_2Flib_2Fsource-yDkDb7zY.js"
	},
	"/assets/badge.mdx_macro_id_src_2Flib_2Fsource-CygyVCjQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ca0-3B81ODU5RLIA7OIYhFStWIZpDRo\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 19616,
		"path": "../public/assets/badge.mdx_macro_id_src_2Flib_2Fsource-CygyVCjQ.js"
	},
	"/assets/bottom-navigation-CzpJFkV3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ca-5l4VejqpO1yyTFsYiUwZ4iQI/XU\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 1226,
		"path": "../public/assets/bottom-navigation-CzpJFkV3.js"
	},
	"/assets/bottom-navigation-gYaTPEfS.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"993-UJj9AuPR9gzQLRUdSA+vyGx6Bmw\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 2451,
		"path": "../public/assets/bottom-navigation-gYaTPEfS.css"
	},
	"/assets/bottom-navigation.mdx_macro_id_src_2Flib_2Fsource-B34KnT2h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"328a-e9Q8/DNQEVxkLpms2i7h10sfYbw\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 12938,
		"path": "../public/assets/bottom-navigation.mdx_macro_id_src_2Flib_2Fsource-B34KnT2h.js"
	},
	"/assets/breadcrumbs.mdx_macro_id_src_2Flib_2Fsource-Bhl8UNAd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e67-qpwXR0qmEiTIYBt1d2jQNXTr3hA\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 7783,
		"path": "../public/assets/breadcrumbs.mdx_macro_id_src_2Flib_2Fsource-Bhl8UNAd.js"
	},
	"/assets/breakpoints.mdx_macro_id_src_2Flib_2Fsource-CdZw0KjG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"433e-IFw206LhVY9D4LuR6E3UFLtXtpw\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 17214,
		"path": "../public/assets/breakpoints.mdx_macro_id_src_2Flib_2Fsource-CdZw0KjG.js"
	},
	"/assets/button-group.mdx_macro_id_src_2Flib_2Fsource-COZlGXjP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7e16-ESb5b2tPYTzAck72r3MdlrQ7ork\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 32278,
		"path": "../public/assets/button-group.mdx_macro_id_src_2Flib_2Fsource-COZlGXjP.js"
	},
	"/assets/button.mdx_macro_id_src_2Flib_2Fsource-B7ugr017.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d857-hV1Av5OdzryUcPYyE2E4OwtSZGY\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 55383,
		"path": "../public/assets/button.mdx_macro_id_src_2Flib_2Fsource-B7ugr017.js"
	},
	"/assets/card.mdx_macro_id_src_2Flib_2Fsource-ymzOCrOR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a00-VOmY/M9zB4CS3e8O18XqyPvn47A\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 27136,
		"path": "../public/assets/card.mdx_macro_id_src_2Flib_2Fsource-ymzOCrOR.js"
	},
	"/assets/carousel.mdx_macro_id_src_2Flib_2Fsource-B43arBH9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75e4-wtCytf8m4R9weLf25NMWQ8F47d4\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 30180,
		"path": "../public/assets/carousel.mdx_macro_id_src_2Flib_2Fsource-B43arBH9.js"
	},
	"/assets/casing-DS73apSf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5f7-DMcDIFSCvovhONtjJL+TpTjisI4\"",
		"mtime": "2026-11-11T20:46:35.039Z",
		"size": 1527,
		"path": "../public/assets/casing-DS73apSf.js"
	},
	"/assets/checkbox.mdx_macro_id_src_2Flib_2Fsource-Daep2sKI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f14-ATNju2ZLPusI9B4QvqSLeL290+s\"",
		"mtime": "2026-11-11T20:46:35.040Z",
		"size": 12052,
		"path": "../public/assets/checkbox.mdx_macro_id_src_2Flib_2Fsource-Daep2sKI.js"
	},
	"/assets/collapsable-sidebar.mdx_macro_id_src_2Flib_2Fsource-RvviYX0g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e21-BEuB+byFDwVLnXN7GtoQshpTmN0\"",
		"mtime": "2026-11-11T20:46:35.040Z",
		"size": 11809,
		"path": "../public/assets/collapsable-sidebar.mdx_macro_id_src_2Flib_2Fsource-RvviYX0g.js"
	},
	"/assets/color-picker.mdx_macro_id_src_2Flib_2Fsource-Blfr8XF4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8475-q99f2ZXSR/jmuE9u/LMo74As0MA\"",
		"mtime": "2026-11-11T20:46:35.040Z",
		"size": 33909,
		"path": "../public/assets/color-picker.mdx_macro_id_src_2Flib_2Fsource-Blfr8XF4.js"
	},
	"/assets/colors.mdx_macro_id_src_2Flib_2Fsource-Ci9UTyHS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"717e-Bwh4MnbmN53uVR7LleGNb+y/TkI\"",
		"mtime": "2026-11-11T20:46:35.040Z",
		"size": 29054,
		"path": "../public/assets/colors.mdx_macro_id_src_2Flib_2Fsource-Ci9UTyHS.js"
	},
	"/assets/command.mdx_macro_id_src_2Flib_2Fsource-Cw0NXA7N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9291-d4ho5uva6Zg2skPQ0Fd+Ys1eqMk\"",
		"mtime": "2026-11-11T20:46:35.040Z",
		"size": 37521,
		"path": "../public/assets/command.mdx_macro_id_src_2Flib_2Fsource-Cw0NXA7N.js"
	},
	"/assets/components.mdx_macro_id_src_2Flib_2Fsource-D9ShKqMD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"78f3-8UYmTb6rs8KNkvk7jxyPTFZ0GxI\"",
		"mtime": "2026-11-11T20:46:35.040Z",
		"size": 30963,
		"path": "../public/assets/components.mdx_macro_id_src_2Flib_2Fsource-D9ShKqMD.js"
	},
	"/assets/container.mdx_macro_id_src_2Flib_2Fsource-YrXd-IGH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2067-9TGi5sw4kESBUzx+P3m6lc9JbK8\"",
		"mtime": "2026-11-11T20:46:35.040Z",
		"size": 8295,
		"path": "../public/assets/container.mdx_macro_id_src_2Flib_2Fsource-YrXd-IGH.js"
	},
	"/assets/context-menu.mdx_macro_id_src_2Flib_2Fsource-BVmrWKej.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db5b-AoWZFwkvOZ9h+iwZ3n+3HjGZikU\"",
		"mtime": "2026-11-11T20:46:35.041Z",
		"size": 56155,
		"path": "../public/assets/context-menu.mdx_macro_id_src_2Flib_2Fsource-BVmrWKej.js"
	},
	"/assets/contributing.mdx_macro_id_src_2Flib_2Fsource-BUka_NK0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7486-Ti98Xv2qD2LsIdbSKOTfh+Q2Qw0\"",
		"mtime": "2026-11-11T20:46:35.041Z",
		"size": 29830,
		"path": "../public/assets/contributing.mdx_macro_id_src_2Flib_2Fsource-BUka_NK0.js"
	},
	"/assets/create-project.mdx_macro_id_src_2Flib_2Fsource-DZC9kNKE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"873a-m1PdBO4FB5DlZ5wb4m7jY7gVEWU\"",
		"mtime": "2026-11-11T20:46:35.041Z",
		"size": 34618,
		"path": "../public/assets/create-project.mdx_macro_id_src_2Flib_2Fsource-DZC9kNKE.js"
	},
	"/assets/date-picker.mdx_macro_id_src_2Flib_2Fsource-DbFKcDWY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d66b-luSdkpfD+j5EPxdenYMsEGAPbPg\"",
		"mtime": "2026-11-11T20:46:35.041Z",
		"size": 54891,
		"path": "../public/assets/date-picker.mdx_macro_id_src_2Flib_2Fsource-DbFKcDWY.js"
	},
	"/assets/dialog.mdx_macro_id_src_2Flib_2Fsource-CHIyuyPe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"325b-6zOtOxT3RFHtSmVO5rd4wNEZn0M\"",
		"mtime": "2026-11-11T20:46:35.041Z",
		"size": 12891,
		"path": "../public/assets/dialog.mdx_macro_id_src_2Flib_2Fsource-CHIyuyPe.js"
	},
	"/assets/dist-DUI9TJPX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11a4d-kzdBQSkCMcc06Xl7bCSzk8ERg6s\"",
		"mtime": "2026-11-11T20:46:35.042Z",
		"size": 72269,
		"path": "../public/assets/dist-DUI9TJPX.js"
	},
	"/assets/doc-examples-C-fbCs2l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29d6-gah7r4c2gTMW7m+81+IypMphz8E\"",
		"mtime": "2026-11-11T20:46:35.042Z",
		"size": 10710,
		"path": "../public/assets/doc-examples-C-fbCs2l.js"
	},
	"/assets/drawer-BIuwoD4h.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"4be0-VYX0VTwW+w+1fz/874VLv60HZb8\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 19424,
		"path": "../public/assets/drawer-BIuwoD4h.css"
	},
	"/assets/drawer-X6B_tHq3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"43ad-qn5PWRKHO0F6Kfg70I9xFw/H8+0\"",
		"mtime": "2026-11-11T20:46:35.042Z",
		"size": 17325,
		"path": "../public/assets/drawer-X6B_tHq3.js"
	},
	"/assets/drawer.mdx_macro_id_src_2Flib_2Fsource-9oxyk6AS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29a9-pUxENb3hujKEw2iYkUpOASbo/eQ\"",
		"mtime": "2026-11-11T20:46:35.042Z",
		"size": 10665,
		"path": "../public/assets/drawer.mdx_macro_id_src_2Flib_2Fsource-9oxyk6AS.js"
	},
	"/assets/dropdown-menu.mdx_macro_id_src_2Flib_2Fsource-vxVdeWJ-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75c8-JgV3QxK0gSCIQ7TblFdNGZXsRmk\"",
		"mtime": "2026-11-11T20:46:35.042Z",
		"size": 30152,
		"path": "../public/assets/dropdown-menu.mdx_macro_id_src_2Flib_2Fsource-vxVdeWJ-.js"
	},
	"/assets/empty-state.mdx_macro_id_src_2Flib_2Fsource-BYJrWxqQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"425d-GOQXw0ufByyAxYk+CFPGpgls06s\"",
		"mtime": "2026-11-11T20:46:35.042Z",
		"size": 16989,
		"path": "../public/assets/empty-state.mdx_macro_id_src_2Flib_2Fsource-BYJrWxqQ.js"
	},
	"/assets/fetch-C2jcOjol.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"265-Uxesxz17LLwMFWPlPc9nnyDdWoY\"",
		"mtime": "2026-11-11T20:46:35.042Z",
		"size": 613,
		"path": "../public/assets/fetch-C2jcOjol.js"
	},
	"/assets/fetch-pHvU8hPv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32-x0B360Z/94bLE03yiQfXdWJvdK8\"",
		"mtime": "2026-11-11T20:46:35.042Z",
		"size": 50,
		"path": "../public/assets/fetch-pHvU8hPv.js"
	},
	"/assets/file-upload.mdx_macro_id_src_2Flib_2Fsource-cal8jVxd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"edb7-hC2g3DOyPzJyYH/6w/yEBISkTPE\"",
		"mtime": "2026-11-11T20:46:35.042Z",
		"size": 60855,
		"path": "../public/assets/file-upload.mdx_macro_id_src_2Flib_2Fsource-cal8jVxd.js"
	},
	"/assets/form-field.mdx_macro_id_src_2Flib_2Fsource-D2EWdVp7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29c4-jtxkUVlXAfPO9wlRgwYX2QO6Klc\"",
		"mtime": "2026-11-11T20:46:35.042Z",
		"size": 10692,
		"path": "../public/assets/form-field.mdx_macro_id_src_2Flib_2Fsource-D2EWdVp7.js"
	},
	"/assets/getting-started.mdx_macro_id_src_2Flib_2Fsource-DVegomk0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9486-ytAfbU3LUKNleIRAbrny/tnM2BM\"",
		"mtime": "2026-11-11T20:46:35.043Z",
		"size": 38022,
		"path": "../public/assets/getting-started.mdx_macro_id_src_2Flib_2Fsource-DVegomk0.js"
	},
	"/assets/heading-CoknPNmd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3186-Z5BdZE9GLCQFv8IuRUzO6vJWU0Y\"",
		"mtime": "2026-11-11T20:46:35.043Z",
		"size": 12678,
		"path": "../public/assets/heading-CoknPNmd.js"
	},
	"/assets/heading-CyRgju5e.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"46da-+uU3uI96IcknlGohyU0mcJ7p9t8\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 18138,
		"path": "../public/assets/heading-CyRgju5e.css"
	},
	"/assets/heading.mdx_macro_id_src_2Flib_2Fsource-B5yrQXNS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"234d-TCoIoJcsiFcYT8fWko/WrqR9On0\"",
		"mtime": "2026-11-11T20:46:35.043Z",
		"size": 9037,
		"path": "../public/assets/heading.mdx_macro_id_src_2Flib_2Fsource-B5yrQXNS.js"
	},
	"/assets/hero.mdx_macro_id_src_2Flib_2Fsource-o_UzIgMT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16912-toRcw6CNpWhDYNbHElgT0eZmpyg\"",
		"mtime": "2026-11-11T20:46:35.043Z",
		"size": 92434,
		"path": "../public/assets/hero.mdx_macro_id_src_2Flib_2Fsource-o_UzIgMT.js"
	},
	"/assets/home-BdU3KGYG.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"281c-VFlhSSbcnXqlvhihSqlXnX5HtjE\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 10268,
		"path": "../public/assets/home-BdU3KGYG.css"
	},
	"/assets/image.mdx_macro_id_src_2Flib_2Fsource-DYai_zi7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11ffd-Gv48UIF1HMzsBewRE1g3wYLYZoA\"",
		"mtime": "2026-11-11T20:46:35.043Z",
		"size": 73725,
		"path": "../public/assets/image.mdx_macro_id_src_2Flib_2Fsource-DYai_zi7.js"
	},
	"/assets/index-DOSXIbJ5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"35bf5-hL3o18aivuRW4rbBjdMZmj2IRa0\"",
		"mtime": "2026-11-11T20:46:35.037Z",
		"size": 220149,
		"path": "../public/assets/index-DOSXIbJ5.js"
	},
	"/assets/index.mdx_macro_id_src_2Flib_2Fsource-BSTNZmJj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"962e-a7aRODQkq9zftEYjLomiqlxcfc4\"",
		"mtime": "2026-11-11T20:46:35.043Z",
		"size": 38446,
		"path": "../public/assets/index.mdx_macro_id_src_2Flib_2Fsource-BSTNZmJj.js"
	},
	"/assets/index.mdx_macro_id_src_2Flib_2Fsource-DBAKwWGe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5eb4-tLcIaMGStdJ56RkSoiVuFAG6hww\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 24244,
		"path": "../public/assets/index.mdx_macro_id_src_2Flib_2Fsource-DBAKwWGe.js"
	},
	"/assets/input-group.mdx_macro_id_src_2Flib_2Fsource-D20J8es1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2beb-Xv9Mli2EKWDK6Wz7eZHz4ERpUcA\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 11243,
		"path": "../public/assets/input-group.mdx_macro_id_src_2Flib_2Fsource-D20J8es1.js"
	},
	"/assets/jsx-runtime-LKYXHABd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b3-HOwC6Y62J+Kbh1JiVMzqqzyqESI\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 435,
		"path": "../public/assets/jsx-runtime-LKYXHABd.js"
	},
	"/assets/label.mdx_macro_id_src_2Flib_2Fsource-DOaiXTsv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21f8-0b+Iw3t3n/aRY4fYOipExUrf4mQ\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 8696,
		"path": "../public/assets/label.mdx_macro_id_src_2Flib_2Fsource-DOaiXTsv.js"
	},
	"/assets/link.mdx_macro_id_src_2Flib_2Fsource-CowbfPmM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"236b-c0cwm0RerGJtw2Qn4yKHKaKBfbo\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 9067,
		"path": "../public/assets/link.mdx_macro_id_src_2Flib_2Fsource-CowbfPmM.js"
	},
	"/assets/mixedbread-DPsc5_Iv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"695-t9oBBZbmYDk912YUf8i+RPZSEPI\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 1685,
		"path": "../public/assets/mixedbread-DPsc5_Iv.js"
	},
	"/assets/notification.mdx_macro_id_src_2Flib_2Fsource-WkjG7pwZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6d73-tbHnrZ+LVuCMiH8DtVaVxELSoUs\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 28019,
		"path": "../public/assets/notification.mdx_macro_id_src_2Flib_2Fsource-WkjG7pwZ.js"
	},
	"/assets/number-input.mdx_macro_id_src_2Flib_2Fsource-BySPgz6a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31a8-Vyett5HBPi8R2YAAndXCrmZzMLE\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 12712,
		"path": "../public/assets/number-input.mdx_macro_id_src_2Flib_2Fsource-BySPgz6a.js"
	},
	"/assets/observability.md_macro_id_src_2Flib_2Fsource-DtDrd2zO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ace-JWgAMFqP5Xf/Wa0aELAkOuIorek\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 27342,
		"path": "../public/assets/observability.md_macro_id_src_2Flib_2Fsource-DtDrd2zO.js"
	},
	"/assets/orama-cloud-Du5BIb8I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4be-VDvg3QvD8/61oVP56KmHtTyo6fU\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 1214,
		"path": "../public/assets/orama-cloud-Du5BIb8I.js"
	},
	"/assets/orama-cloud-legacy-ZXaH0UAC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"485-quJgnpiQdoQE0ps0UgJ/BeOTjLo\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 1157,
		"path": "../public/assets/orama-cloud-legacy-ZXaH0UAC.js"
	},
	"/assets/orama-static-GMCqRdiL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13ecd-KoMOGy2tC+U5HuB4BqeWibtoLFY\"",
		"mtime": "2026-11-11T20:46:35.044Z",
		"size": 81613,
		"path": "../public/assets/orama-static-GMCqRdiL.js"
	},
	"/assets/page-layout.mdx_macro_id_src_2Flib_2Fsource-d52WopPM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"332b-wdGBnJzPQl/BSyh6+kgnXUD8/4I\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 13099,
		"path": "../public/assets/page-layout.mdx_macro_id_src_2Flib_2Fsource-d52WopPM.js"
	},
	"/assets/pagination.mdx_macro_id_src_2Flib_2Fsource-KeAH0QRN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ab6-UNe9UTZwN8/jpf/j3BHJ7Z4hZbI\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 27318,
		"path": "../public/assets/pagination.mdx_macro_id_src_2Flib_2Fsource-KeAH0QRN.js"
	},
	"/assets/paper.mdx_macro_id_src_2Flib_2Fsource-CifHOA6v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"432e-PaqJbvZax4ZMHuABRI2dnFWHnGI\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 17198,
		"path": "../public/assets/paper.mdx_macro_id_src_2Flib_2Fsource-CifHOA6v.js"
	},
	"/assets/parse-CsgDThRb-2_xqSTAW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"144c8-+lDoRh/QHUiMi58mI4ShhWdNtf4\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 83144,
		"path": "../public/assets/parse-CsgDThRb-2_xqSTAW.js"
	},
	"/assets/popout.mdx_macro_id_src_2Flib_2Fsource-DLKOI_WQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39c9-0PhRxAYrJdnK5A2qIpt3/uvdiKc\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 14793,
		"path": "../public/assets/popout.mdx_macro_id_src_2Flib_2Fsource-DLKOI_WQ.js"
	},
	"/assets/popover.mdx_macro_id_src_2Flib_2Fsource-BJTIILyl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"538a-LE8inhEcmBeLaWxy0fxBsag3cZo\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 21386,
		"path": "../public/assets/popover.mdx_macro_id_src_2Flib_2Fsource-BJTIILyl.js"
	},
	"/assets/portal.mdx_macro_id_src_2Flib_2Fsource-BLo6Wd9e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c4b-pbfeanDUCIMnH6zjzO9t+1tiE9c\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 15435,
		"path": "../public/assets/portal.mdx_macro_id_src_2Flib_2Fsource-BLo6Wd9e.js"
	},
	"/assets/preload-helper-7y9sWmk5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"64f-yh0aRmUlT4DpaqJVwZmtRmUV2h8\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 1615,
		"path": "../public/assets/preload-helper-7y9sWmk5.js"
	},
	"/assets/preview.mdx_macro_id_src_2Flib_2Fsource-EwEu1uyd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5626-qusPIk9jZ5NoEIRUJk9Zsl6G628\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 22054,
		"path": "../public/assets/preview.mdx_macro_id_src_2Flib_2Fsource-EwEu1uyd.js"
	},
	"/assets/production-release.md_macro_id_src_2Flib_2Fsource-Br9R3gZx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cc6-5JmQ+8bwtftJ8OWpkTdqvjFj9fg\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 36038,
		"path": "../public/assets/production-release.md_macro_id_src_2Flib_2Fsource-Br9R3gZx.js"
	},
	"/assets/progress.mdx_macro_id_src_2Flib_2Fsource-BwQnxgdT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"479c-nx3o+RTZXNG+M/s20VcgdHe3Kkk\"",
		"mtime": "2026-11-11T20:46:35.045Z",
		"size": 18332,
		"path": "../public/assets/progress.mdx_macro_id_src_2Flib_2Fsource-BwQnxgdT.js"
	},
	"/assets/radio-group.mdx_macro_id_src_2Flib_2Fsource-Cf1h8KKC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"438d-Y5ZBbx62jAalgnEXC9BVhhan8gs\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 17293,
		"path": "../public/assets/radio-group.mdx_macro_id_src_2Flib_2Fsource-Cf1h8KKC.js"
	},
	"/assets/rating.mdx_macro_id_src_2Flib_2Fsource-D_ZLO7xQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d0a-3/CvpLVZimXYVb5hJs03gJiQHBQ\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 19722,
		"path": "../public/assets/rating.mdx_macro_id_src_2Flib_2Fsource-D_ZLO7xQ.js"
	},
	"/assets/react-DlmbjZJV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ec4-B26+hJCYL1yZEhM3hlCgMpV5imY\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 7876,
		"path": "../public/assets/react-DlmbjZJV.js"
	},
	"/assets/react-dom-1flDk5uq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f39-gBpR7yLSYw1FhosAu8zojDQ/1j4\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 3897,
		"path": "../public/assets/react-dom-1flDk5uq.js"
	},
	"/assets/remove-undefined-C_sjLeQT-CP3jfHCp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"153-/xuMTasBzyK1ptDGVevF+TvwRZk\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 339,
		"path": "../public/assets/remove-undefined-C_sjLeQT-CP3jfHCp.js"
	},
	"/assets/resizable-panels.mdx_macro_id_src_2Flib_2Fsource-CodTwlzH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c12-jNMcYJJjXl/lhce7hQbqyC8kgoQ\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 31762,
		"path": "../public/assets/resizable-panels.mdx_macro_id_src_2Flib_2Fsource-CodTwlzH.js"
	},
	"/assets/rolldown-runtime-XKyaHtl9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d6-O6HZFG2UmBdwOn6kqbWB0vaNqS8\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 726,
		"path": "../public/assets/rolldown-runtime-XKyaHtl9.js"
	},
	"/assets/routes-xKWz3uiO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5cc1-qrJzhtEMoq9ZsKStfl2j0julsxI\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 23745,
		"path": "../public/assets/routes-xKWz3uiO.js"
	},
	"/assets/scope-context-BWzRIaDm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"457-D3MNF52kD6j1Iq8+4uI85SWcmxY\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 1111,
		"path": "../public/assets/scope-context-BWzRIaDm.js"
	},
	"/assets/scroll-area.mdx_macro_id_src_2Flib_2Fsource-yFSU6cO0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e70-PXTFu4V5/MvD+2Shr1lI4SO28JY\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 15984,
		"path": "../public/assets/scroll-area.mdx_macro_id_src_2Flib_2Fsource-yFSU6cO0.js"
	},
	"/assets/scroll-lock.mdx_macro_id_src_2Flib_2Fsource-B2hN6OMI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e24-UCmkxCItnMxcJXAcSMEA1MqXkQ8\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 7716,
		"path": "../public/assets/scroll-lock.mdx_macro_id_src_2Flib_2Fsource-B2hN6OMI.js"
	},
	"/assets/search-default-_CF0s2k-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"795b-04r7wXjGqCZd24WrQnKQ4QjNCj0\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 31067,
		"path": "../public/assets/search-default-_CF0s2k-.js"
	},
	"/assets/section-bYDzNqqd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b14-pYXgYxi6pXPMDmNGrbuj8F45oio\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 19220,
		"path": "../public/assets/section-bYDzNqqd.js"
	},
	"/assets/section-jtt8j1HW.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"ba5-5Or1KL1rdEeQNqTLZ5Xu0a1w4SE\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 2981,
		"path": "../public/assets/section-jtt8j1HW.css"
	},
	"/assets/section-stack.mdx_macro_id_src_2Flib_2Fsource-D70mtu2c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2120-nQ96cAKHaG1eOWLD7jidKpvwWyU\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 8480,
		"path": "../public/assets/section-stack.mdx_macro_id_src_2Flib_2Fsource-D70mtu2c.js"
	},
	"/assets/section.mdx_macro_id_src_2Flib_2Fsource-DJzYUhUh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a93-1GrW1wNTo0yYVVMIpiRXW9PP1G4\"",
		"mtime": "2026-11-11T20:46:35.046Z",
		"size": 10899,
		"path": "../public/assets/section.mdx_macro_id_src_2Flib_2Fsource-DJzYUhUh.js"
	},
	"/assets/select.mdx_macro_id_src_2Flib_2Fsource-DuyyT9Ax.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c930-lE+7kpxCfbQyvuClIY8Xz8mnYeE\"",
		"mtime": "2026-11-11T20:46:35.047Z",
		"size": 51504,
		"path": "../public/assets/select.mdx_macro_id_src_2Flib_2Fsource-DuyyT9Ax.js"
	},
	"/assets/separator.mdx_macro_id_src_2Flib_2Fsource-COkaBICh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b86-hu1/lFmC01FKUjjPIMPqTGOrlPE\"",
		"mtime": "2026-11-11T20:46:35.047Z",
		"size": 23430,
		"path": "../public/assets/separator.mdx_macro_id_src_2Flib_2Fsource-COkaBICh.js"
	},
	"/assets/server.browser-Kej9oXXm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"74-8yZbY0hUTei6RKjgNphAl0kIHbM\"",
		"mtime": "2026-11-11T20:46:35.047Z",
		"size": 116,
		"path": "../public/assets/server.browser-Kej9oXXm.js"
	},
	"/assets/server.edge-Brm7O1mM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c28-ikaUS6JZfcpYB/yRQQ4Q3Bkl+vM\"",
		"mtime": "2026-11-11T20:46:35.047Z",
		"size": 207912,
		"path": "../public/assets/server.edge-Brm7O1mM.js"
	},
	"/assets/sidebar.mdx_macro_id_src_2Flib_2Fsource-FPoIvUN7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1de4-YLrrxvSajQqFTqoBp7I1ugBt1o0\"",
		"mtime": "2026-11-11T20:46:35.047Z",
		"size": 7652,
		"path": "../public/assets/sidebar.mdx_macro_id_src_2Flib_2Fsource-FPoIvUN7.js"
	},
	"/assets/skeleton.mdx_macro_id_src_2Flib_2Fsource-DjieLUAV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39a8-l9xJuLxyP8LdBsVOHP2U92afKKA\"",
		"mtime": "2026-11-11T20:46:35.047Z",
		"size": 14760,
		"path": "../public/assets/skeleton.mdx_macro_id_src_2Flib_2Fsource-DjieLUAV.js"
	},
	"/assets/slider.mdx_macro_id_src_2Flib_2Fsource-DfgqV2-V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"64f2-IeXMxtQJRCx7WDHB+qIhjCh0S4s\"",
		"mtime": "2026-11-11T20:46:35.047Z",
		"size": 25842,
		"path": "../public/assets/slider.mdx_macro_id_src_2Flib_2Fsource-DfgqV2-V.js"
	},
	"/assets/stack.mdx_macro_id_src_2Flib_2Fsource-u3jL93WF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"314d-pr5XSZKrREOqzqoy5YV46fxux58\"",
		"mtime": "2026-11-11T20:46:35.047Z",
		"size": 12621,
		"path": "../public/assets/stack.mdx_macro_id_src_2Flib_2Fsource-u3jL93WF.js"
	},
	"/assets/stepper.mdx_macro_id_src_2Flib_2Fsource-Dwxvazhh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6eaa-3FImsPg2c5QvXhRA3lF7LTAHAMA\"",
		"mtime": "2026-11-11T20:46:35.048Z",
		"size": 28330,
		"path": "../public/assets/stepper.mdx_macro_id_src_2Flib_2Fsource-Dwxvazhh.js"
	},
	"/assets/switch.mdx_macro_id_src_2Flib_2Fsource-ChVnVcjT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a76-y+poEzWii62u5CITyVg/mSCxFj4\"",
		"mtime": "2026-11-11T20:46:35.048Z",
		"size": 10870,
		"path": "../public/assets/switch.mdx_macro_id_src_2Flib_2Fsource-ChVnVcjT.js"
	},
	"/assets/tabs.mdx_macro_id_src_2Flib_2Fsource-Do4RWL8j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58bf-ZYOV1mQs8QSfZXL88VU2ArWeVAg\"",
		"mtime": "2026-11-11T20:46:35.048Z",
		"size": 22719,
		"path": "../public/assets/tabs.mdx_macro_id_src_2Flib_2Fsource-Do4RWL8j.js"
	},
	"/assets/testing.mdx_macro_id_src_2Flib_2Fsource-B0RzFtiy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"770c-rBV0oRtctCPEEwXHQj9ybUChqyg\"",
		"mtime": "2026-11-11T20:46:35.048Z",
		"size": 30476,
		"path": "../public/assets/testing.mdx_macro_id_src_2Flib_2Fsource-B0RzFtiy.js"
	},
	"/assets/text-area-input.mdx_macro_id_src_2Flib_2Fsource-Czin32sm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"254b-hiE5SQyzutNsg9VNNMJtZ3OcdlQ\"",
		"mtime": "2026-11-11T20:46:35.048Z",
		"size": 9547,
		"path": "../public/assets/text-area-input.mdx_macro_id_src_2Flib_2Fsource-Czin32sm.js"
	},
	"/assets/text-editor.mdx_macro_id_src_2Flib_2Fsource-jZ6JrsDS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6309-la9pKE9xcHLyMeXq5DGQvtPcj6g\"",
		"mtime": "2026-11-11T20:46:35.048Z",
		"size": 25353,
		"path": "../public/assets/text-editor.mdx_macro_id_src_2Flib_2Fsource-jZ6JrsDS.js"
	},
	"/assets/text-input.mdx_macro_id_src_2Flib_2Fsource-DiFjpA74.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a49-paagrJA/8FZsvTbu6r07Er4LWbc\"",
		"mtime": "2026-11-11T20:46:35.048Z",
		"size": 10825,
		"path": "../public/assets/text-input.mdx_macro_id_src_2Flib_2Fsource-DiFjpA74.js"
	},
	"/assets/text.mdx_macro_id_src_2Flib_2Fsource-ClVVNnY7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23ff-MZrdUhHrOVoNmceu8Twwkh9W2Ro\"",
		"mtime": "2026-11-11T20:46:35.048Z",
		"size": 9215,
		"path": "../public/assets/text.mdx_macro_id_src_2Flib_2Fsource-ClVVNnY7.js"
	},
	"/assets/theme-DLIraU-v.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"4fef-FiwREHAbx3fyfdbWNweDmdJ+7wY\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 20463,
		"path": "../public/assets/theme-DLIraU-v.css"
	},
	"/assets/theme-GypOmdrd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c80-JH5mEJpBxbuqGHRUycbnZPvnUPM\"",
		"mtime": "2026-11-11T20:46:35.048Z",
		"size": 19584,
		"path": "../public/assets/theme-GypOmdrd.js"
	},
	"/assets/theme-provider.mdx_macro_id_src_2Flib_2Fsource-BE-JsPE_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f66-foLlnufCWwKD2sneYb/IB0FC6PE\"",
		"mtime": "2026-11-11T20:46:35.048Z",
		"size": 40806,
		"path": "../public/assets/theme-provider.mdx_macro_id_src_2Flib_2Fsource-BE-JsPE_.js"
	},
	"/assets/time-picker.mdx_macro_id_src_2Flib_2Fsource-uqvfGWki.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11dac-euGkTvCN8iC36tlvtWNUUu3bckI\"",
		"mtime": "2026-11-11T20:46:35.049Z",
		"size": 73132,
		"path": "../public/assets/time-picker.mdx_macro_id_src_2Flib_2Fsource-uqvfGWki.js"
	},
	"/assets/toggle-group.mdx_macro_id_src_2Flib_2Fsource-CGVF81TP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fdd5-anECDTWVvAuLQCJGfTrpfN3Vc3M\"",
		"mtime": "2026-11-11T20:46:35.049Z",
		"size": 64981,
		"path": "../public/assets/toggle-group.mdx_macro_id_src_2Flib_2Fsource-CGVF81TP.js"
	},
	"/assets/token-input.mdx_macro_id_src_2Flib_2Fsource-Xh8Jfz5X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ac80-4GKAkrE/rc7T1Q/+3ioZ32S6iLk\"",
		"mtime": "2026-11-11T20:46:35.049Z",
		"size": 44160,
		"path": "../public/assets/token-input.mdx_macro_id_src_2Flib_2Fsource-Xh8Jfz5X.js"
	},
	"/assets/tokens.mdx_macro_id_src_2Flib_2Fsource-DZzmgiJx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"93ad-GWDwPeKSiOuzE3vguFbERQhlSck\"",
		"mtime": "2026-11-11T20:46:35.049Z",
		"size": 37805,
		"path": "../public/assets/tokens.mdx_macro_id_src_2Flib_2Fsource-DZzmgiJx.js"
	},
	"/assets/tooltip-CxcxPJCF.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14510-8kB3fEUheS7bvTtUWGzMLAuqoOg\"",
		"mtime": "2026-11-11T20:46:35.051Z",
		"size": 83216,
		"path": "../public/assets/tooltip-CxcxPJCF.css"
	},
	"/assets/tooltip-GfYiajaU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"184ef-VNIlWeMRbbr92I2NZPve+88oX6M\"",
		"mtime": "2026-11-11T20:46:35.049Z",
		"size": 99567,
		"path": "../public/assets/tooltip-GfYiajaU.js"
	},
	"/assets/tooltip.mdx_macro_id_src_2Flib_2Fsource-1Fl9_7zv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4908-ulGpfPChaviZSYDQ+WSQsip8WzU\"",
		"mtime": "2026-11-11T20:46:35.049Z",
		"size": 18696,
		"path": "../public/assets/tooltip.mdx_macro_id_src_2Flib_2Fsource-1Fl9_7zv.js"
	},
	"/assets/transition.mdx_macro_id_src_2Flib_2Fsource-DN4VHx3n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3230-vdn3rwZjb/w0INoT4c88hJe0uA0\"",
		"mtime": "2026-11-11T20:46:35.049Z",
		"size": 12848,
		"path": "../public/assets/transition.mdx_macro_id_src_2Flib_2Fsource-DN4VHx3n.js"
	},
	"/assets/tree-view.mdx_macro_id_src_2Flib_2Fsource-DDzo5TGA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5327-/ihtd9ChXmn5TKPuy+aEVLOBKUM\"",
		"mtime": "2026-11-11T20:46:35.049Z",
		"size": 21287,
		"path": "../public/assets/tree-view.mdx_macro_id_src_2Flib_2Fsource-DDzo5TGA.js"
	},
	"/assets/typography.mdx_macro_id_src_2Flib_2Fsource-md432xlZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b598-YMgQHqXQvRiOhvIAgkooR65LnLQ\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 46488,
		"path": "../public/assets/typography.mdx_macro_id_src_2Flib_2Fsource-md432xlZ.js"
	},
	"/assets/url-BF81yL4m-Cs729U5G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12f-lH8Y4BFHhHZchY36jZrlwIwG6kg\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 303,
		"path": "../public/assets/url-BF81yL4m-Cs729U5G.js"
	},
	"/assets/use-search-eSAjMJVB-niOJiWdf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"691-7jPsQIhmbqkyZVsbtO+046KkAWY\"",
		"mtime": "2026-11-11T20:46:35.050Z",
		"size": 1681,
		"path": "../public/assets/use-search-eSAjMJVB-niOJiWdf.js"
	},
	"/favicon-16x16.png": {
		"type": "image/png",
		"etag": "\"2c8-RO72wkaRZD/NqQ64mn3TG+zEl5I\"",
		"mtime": "2026-11-11T20:46:35.913Z",
		"size": 712,
		"path": "../public/favicon-16x16.png"
	},
	"/favicon-32x32.png": {
		"type": "image/png",
		"etag": "\"6c1-IzgJr6SqJy2LHEGIeF/6xwlArPY\"",
		"mtime": "2026-11-11T20:46:35.913Z",
		"size": 1729,
		"path": "../public/favicon-32x32.png"
	},
	"/favicon-96x96.png": {
		"type": "image/png",
		"etag": "\"2e33-DcGlACBbJOGy9iPmaCGj6qMUjsI\"",
		"mtime": "2026-11-11T20:46:35.913Z",
		"size": 11827,
		"path": "../public/favicon-96x96.png"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"3aee-BI7U+qGyD6xVdkDxJLQjV9pr7m8\"",
		"mtime": "2026-11-11T20:46:35.914Z",
		"size": 15086,
		"path": "../public/favicon.ico"
	},
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"1467f4-L+CC8EuLsIXsLroUXa+cG7qPwcM\"",
		"mtime": "2026-11-11T20:46:35.916Z",
		"size": 1337332,
		"path": "../public/favicon.svg"
	},
	"/site.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"1b1-BjytjE6Z32j4GhVzJU8zyh3pDII\"",
		"mtime": "2026-11-11T20:46:35.914Z",
		"size": 433,
		"path": "../public/site.webmanifest"
	},
	"/web-app-manifest-192x192.png": {
		"type": "image/png",
		"etag": "\"6307-SjvmV5dv2NqqnFHol5ObMLkTkJk\"",
		"mtime": "2026-11-11T20:46:35.914Z",
		"size": 25351,
		"path": "../public/web-app-manifest-192x192.png"
	},
	"/web-app-manifest-512x512.png": {
		"type": "image/png",
		"etag": "\"1ee9e-sjf6bVI7MWKtmLQXE62bjq0ePcw\"",
		"mtime": "2026-11-11T20:46:35.914Z",
		"size": 126622,
		"path": "../public/web-app-manifest-512x512.png"
	}
};
// #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path)).catch((error) => {
		if (error?.code !== "ENOENT") throw error;
	});
}
// #nitro/virtual/public-assets
var publicAssetBases = { "/assets/": { "maxAge": 31536e3 } };
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
function hasAsset(id = "") {
	return !!(public_assets_data_default[id] || public_assets_data_default[id + ".gz"] || public_assets_data_default[id + ".br"] || public_assets_data_default[id + ".zst"]);
}
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var noCacheHeaders = { "cache-control": "no-store" };
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	const path = l(o(event.url.pathname));
	let id = path.includes("%") ? n(path) : path;
	if (!hasAsset(id) && !hasAsset(d(id, "index.html")) && !isPublicAssetURL(id)) return;
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((entry) => {
		const [name, ...parameters] = entry.split(";");
		const quality = parameters.map((parameter) => parameter.trim().split("=")).find(([key]) => key.toLowerCase() === "q")?.[1];
		const weight = quality === void 0 ? 1 : Number.parseFloat(quality);
		return {
			ext: EncodingMap[name.trim().toLowerCase()],
			weight: Number.isNaN(weight) ? 1 : weight
		};
	}).filter((entry) => entry.ext && entry.weight > 0).sort((a, b) => b.weight - a.weight || (a.ext < b.ext ? -1 : a.ext > b.ext ? 1 : 0)).map((entry) => entry.ext), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, d(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) throw new HTTPError({
			status: 404,
			headers: noCacheHeaders
		});
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	const data = readAsset(id);
	return typeof data?.then === "function" ? data.then((resolved) => assertAssetData(resolved)) : assertAssetData(data);
});
function assertAssetData(data) {
	if (data === null || data === void 0) throw new HTTPError({
		status: 404,
		headers: noCacheHeaders
	});
	return data;
}
// #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = {
		route: "/assets/**",
		rank: 0,
		rules: [{
			name: "headers",
			route: "/assets/**",
			handler: headers,
			options: { "cache-control": "public, max-age=31536000, immutable" }
		}]
	};
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1);
		let s = p.split("/");
		let l = s.length;
		let _w;
		if (l > 1) {
			if (s[1] === "assets") r.push(l > 2 ? {
				data: $0,
				params: {
					"0": _w = p.slice(8),
					_: _w
				}
			} : {
				data: $0,
				params: {}
			});
		}
		return r.reverse();
	};
})();
var _lazy_f983faeac977da33 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_f983faeac977da33
	};
	return ((_m, p) => {
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1);
		const w = p.slice(1);
		return {
			data,
			params: w ? {
				"0": w,
				_: w
			} : {}
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/error/utils.mjs
function createErrorHeaders(error, event, unhandled) {
	const headers = new Headers(unhandled ? {} : error.headers);
	const errHeaders = event.res?.errHeaders;
	if (errHeaders) for (const [name, value] of errHeaders) if (name === "set-cookie") headers.append(name, value);
	else headers.set(name, value);
	return headers;
}
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = createErrorHeaders(error, event, unhandled);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
// #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
// #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => {
		event.context.routeRules = getRouteRules(event.req.method, event.url.pathname).routeRules;
		if (event.req.method === "HEAD") {
			const route = findRoute("HEAD", event.url.pathname);
			return route?.data.method ? route : findRoute("GET", event.url.pathname);
		}
		return findRoute(event.req.method, event.url.pathname);
	};
	h3App["~middleware"].push(createRouteRulesMiddleware());
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~middleware"].push(createCacheRuleMiddleware());
	return h3App;
}
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new t$1();
}
function getRouteRules(method, pathname) {
	return matchRouteRules(method, pathname);
}
function createRouteRulesMiddleware() {
	const middleware = (event, next) => {
		const { rules, cache } = resolveRouteRuleChains(event.req.method, event.url.pathname);
		if (cache) event[kCacheRule] = cache;
		return rules ? rules(event, next) : next();
	};
	return markUntraced(middleware);
}
function createCacheRuleMiddleware() {
	const middleware = (event, next) => {
		const cache = event[kCacheRule];
		return cache ? cache(event, next) : next();
	};
	return markUntraced(middleware);
}
var _matchRouteRules;
function matchRouteRules(method, pathname) {
	return (_matchRouteRules ??= memoizeRouteRulesMatcher(createMatcherFromFind(findRouteRules)))(method, pathname);
}
var kCacheRule = /* @__PURE__ */ Symbol("nitro.cacheRule");
var _routeRuleChains = /* @__PURE__ */ new WeakMap();
function resolveRouteRuleChains(method, pathname) {
	const { matchedRules, routeRuleMiddleware } = matchRouteRules(method, pathname);
	if (routeRuleMiddleware.length === 0) return {};
	let chains = _routeRuleChains.get(routeRuleMiddleware);
	if (!chains) {
		const hasCache = !!matchedRules.cache?.handler;
		const rules = hasCache ? routeRuleMiddleware.slice(0, -1) : routeRuleMiddleware;
		chains = {
			rules: rules.length > 0 ? composeMiddleware(rules) : void 0,
			cache: hasCache ? routeRuleMiddleware.at(-1) : void 0
		};
		_routeRuleChains.set(routeRuleMiddleware, chains);
	}
	return chains;
}
function markUntraced(middleware) {
	middleware.__traced__ = true;
	return middleware;
}
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
// #nitro/virtual/server-entry
var serverEntryOptions = {};
// #nitro/virtual/tracing
var tracingSrvxPlugins = [];
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/serve.mjs
function resolveServeOptions(opts) {
	const { port, hostname, tls, ...entryOptions } = serverEntryOptions;
	const env = globalThis.process?.env || {};
	const _parsedPort = Number.parseInt(env.NITRO_PORT ?? env.PORT ?? "");
	const cert = env.NITRO_SSL_CERT;
	const key = env.NITRO_SSL_KEY;
	const socketPath = env.NITRO_UNIX_SOCKET;
	const resolved = {
		...entryOptions,
		port: Number.isNaN(_parsedPort) ? port ?? 3e3 : _parsedPort,
		hostname: env.NITRO_HOST || env.HOST || hostname,
		tls: cert && key ? {
			cert,
			key
		} : tls,
		...opts,
		plugins: [...tracingSrvxPlugins, ...opts.plugins || []]
	};
	for (const runtime of [
		"node",
		"bun",
		"deno"
	]) if (entryOptions[runtime] && opts[runtime]) resolved[runtime] = {
		...entryOptions[runtime],
		...opts[runtime]
	};
	if (socketPath) {
		resolved.node = {
			...resolved.node,
			path: socketPath
		};
		resolved.bun = {
			...resolved.bun,
			unix: socketPath
		};
		resolved.deno = {
			...resolved.deno,
			path: socketPath
		};
	}
	return resolved;
}
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/shutdown.mjs
function setupCloseHooks(server) {
	const closeServer = server.close.bind(server);
	let closeHooks;
	server.close = (closeActiveConnections) => closeServer(closeActiveConnections).finally(() => closeHooks ??= callCloseHooks());
}
async function callCloseHooks() {
	try {
		await useNitroHooks().callHook("close");
	} catch (error) {
		console.error("[nitro] Error while calling `close` hooks:", error);
	}
}
// ../../node_modules/.bun/nitro@3.0.261103-rc/node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var nitroApp = useNitroApp();
var server = serve(resolveServeOptions({ fetch: nitroApp.fetch }));
server.ready().catch((error) => {
	console.error("[nitro] Failed to start server:", error);
	process.exit(1);
});
setupCloseHooks(server);
trapUnhandledErrors();
var node_server_default = {};
export { node_server_default as default };
