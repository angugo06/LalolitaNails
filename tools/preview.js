const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { basePath } = require("../site.config");
const root = path.resolve(__dirname, "../dist");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webmanifest": "application/manifest+json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".ico": "image/x-icon", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch { res.writeHead(400); res.end(); return; }
  if (basePath && (pathname === basePath || pathname.startsWith(basePath + "/"))) pathname = pathname.slice(basePath.length) || "/";
  if (pathname.endsWith("/")) pathname += "index.html";
  const file = path.resolve(root, "." + pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  const exists = fs.existsSync(file) && fs.statSync(file).isFile();
  const target = exists ? file : path.join(root, "404.html");
  res.writeHead(exists ? 200 : 404, { "Content-Type": types[path.extname(target)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(target).pipe(res);
}).listen(4174, "127.0.0.1", () => console.log("Preview: http://127.0.0.1:4174" + basePath + "/"));
