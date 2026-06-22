// Logo download helpers — SVG straight from /public, PNG rasterized
// client-side at a chosen pixel scale (transparent background preserved).

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Read intrinsic size from the SVG's viewBox (falls back to width/height).
function svgSize(svgText) {
  const vb = svgText.match(/viewBox\s*=\s*["']([\d.\s-]+)["']/i);
  if (vb) {
    const p = vb[1].trim().split(/\s+/).map(Number);
    if (p.length === 4 && p[2] > 0 && p[3] > 0) return { width: p[2], height: p[3] };
  }
  const w = svgText.match(/width\s*=\s*["']([\d.]+)/i);
  const h = svgText.match(/height\s*=\s*["']([\d.]+)/i);
  return { width: w ? +w[1] : 600, height: h ? +h[1] : 200 };
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function downloadSvg(src, filename) {
  const res = await fetch(src);
  const text = await res.text();
  triggerDownload(new Blob([text], { type: "image/svg+xml" }), filename);
}

export async function downloadPng(src, filename, scale = 2) {
  const res = await fetch(src);
  const svgText = await res.text();
  const { width, height } = svgSize(svgText);
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    await new Promise((resolve) =>
      canvas.toBlob((b) => {
        if (b) triggerDownload(b, filename);
        resolve();
      }, "image/png")
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
