"use strict";
var S = Object.create;
var w = Object.defineProperty;
var _ = Object.getOwnPropertyDescriptor;
var R = Object.getOwnPropertyNames;
var $ = Object.getPrototypeOf,
    D = Object.prototype.hasOwnProperty;
var F = (o, r, t, s) => {
    if ((r && typeof r == "object") || typeof r == "function") for (let e of R(r)) !D.call(o, e) && e !== t && w(o, e, { get: () => r[e], enumerable: !(s = _(r, e)) || s.enumerable });
    return o;
};
var c = (o, r, t) => ((t = o != null ? S($(o)) : {}), F(r || !o || !o.__esModule ? w(t, "default", { value: o, enumerable: !0 }) : t, o));
var a = c(require("fs")),
    x = c(require("path"));
var E = c(require("https")),
    I = c(require("http")),
    f = require("url"),
    i = c(require("fs"));
function g(o, r = {}) {
    return new Promise((t, s) => {
        let l = (new f.URL(o).protocol === "https:" ? E : I).get(o, r, (n) => {
            if (n.statusCode >= 300 && n.statusCode < 400 && n.headers.location) {
                let d = new f.URL(n.headers.location, o).toString();
                g(d, r).then(t).catch(s);
                return;
            }
            t(n);
        });
        l.on("error", s),
            l.setTimeout(3e4, () => {
                l.destroy(), s(new Error("Request timed out"));
            });
    });
}
async function u(o, r) {
    try {
        let t = i.createWriteStream(r),
            s = await g(o);
        if (s.statusCode !== 200) throw (t.close(), i.unlinkSync(r), new Error(`Failed to download file: ${s.statusCode} ${s.statusMessage}`));
        let e = parseInt(s.headers["content-length"] || "0", 10),
            p = 0;
        return (
            s.on("data", (l) => {
                p += l.length;
                let n = (p / e) * 100;
                process.stdout.write(`Progress: ${Math.round(n)}%\r`);
            }),
            s.pipe(t),
            new Promise((l, n) => {
                t.on("finish", () => {
                    t.close(),
                        console.log(`Download complete!`),
                        l();
                }),
                    t.on("error", (d) => {
                        t.close(), i.unlinkSync(r), n(d);
                    }),
                    s.on("error", (d) => {
                        t.close(), i.unlinkSync(r), n(d);
                    });
            })
        );
    } catch (t) {
        throw (i.existsSync(r) && i.unlinkSync(r), t);
    }
}
var y = c(require("path")),
    m = y.default.resolve("node_modules", ".bin");
var N = "https://github.com/yt-dlp/yt-dlp/releases/latest/download",
    h = { win32: { x64: "yt-dlp.exe", ia32: "yt-dlp_x86.exe" }, linux: { x64: "yt-dlp", armv7l: "yt-dlp_linux_armv7l", aarch64: "yt-dlp_linux_aarch64" }, darwin: { x64: "dlp_macos", arm64: "dlp_macos" } };
function U() {
    let o = process.platform,
        r = process.arch;
    if (!h[o] || !h[o][r]) throw new Error(`No FFmpeg build available for ${o} ${r}`);
    return h[o][r];
}
async function k() {
    let o = U(),
        r = `${N}/${o}`,
        t = x.join(m, o);
    if (a.existsSync(t)) return t;
    console.log("Downloading yt-dlp...", r), a.existsSync(m) || a.mkdirSync(m, { recursive: !0 });
    try {
        await u(r, t), console.log(`yt-dlp downloaded successfully to: ${t}`);
        try {
            a.chmodSync(t, 493);
        } catch (e) {
            console.log("Error while chmod");
        }
        return t;
    } catch (e) {
        throw (console.error(`Download failed: ${e}`), e);
    }
}
k().catch((o) => {
    console.error("Failed to download yt-dlp:", o), process.exit(1);
});
