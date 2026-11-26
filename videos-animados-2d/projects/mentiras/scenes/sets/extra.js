// sets/extra.js — número flotante, oficina, tienda, sala, cocina de noche con refrigerador, mesa.
import { E, V, S, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, text, FONTS, ease, prog, clamp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { ground, jar } from './world.js';

// número de mentiras flotando sobre una cabeza: n puede ser número o texto; pop 0..1 = rebote al subir
export function liarNum(g, x, y, n, o = {}) {
  const { size = 46, a = 1, pop = 0, color } = o, str = String(n), col = color || (n === 0 ? '#cfe0ff' : S().ui.gold);
  const sc = 1 + 0.35 * Math.sin(clamp(pop) * Math.PI), w = Math.max(size * 1.4, size * 0.62 * str.length + size * 0.8), h = size * 1.25;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(sc, sc);
  glow(g, 0, 0, w * 1.1, col, 0.35); rr(g, -w / 2, -h / 2, w, h, h / 2); g.fillStyle = 'rgba(12,10,22,.78)'; g.fill(); g.strokeStyle = alpha(col, 0.9); g.lineWidth = 3; g.stroke();
  poly(g, [[-8, h / 2 - 1], [8, h / 2 - 1], [0, h / 2 + 10]], alpha(col, 0.9));
  text(g, str, 0, 2, { size, color: col, font: FONTS.ui, weight: 900, glow: 14, glowColor: alpha(col, 0.7) });
  g.restore();
}
// valor que sube de a en un instante t0 (devuelve [valor, pop])
export const tick = (t, t0, a, b, dur = 0.35) => [t < t0 ? a : b, t >= t0 ? prog(t, t0, t0 + dur) : 0];

export function office(g, t, cam) {
  const M = mood('interiorCool'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 1300, 0, GY, [shade(M.wall, -0.5), shade(M.wall, -0.2)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, E.H * 3);
    FX.windowFrame(g, { x: CX - 470, y: GY - 1000, w: 940, h: 560, cols: 4, rows: 1, frame: shade(M.wall, -0.7), bar: 12 }, (g, x, y, w, h) => {
      const N = mood('night'); g.fillStyle = linGrad(g, 0, y, 0, y + h, N.sky); g.fillRect(x, y, w, h);
      FX.skyline(g, { x, y: y + h, w, minH: 120, maxH: 420, color: '#0e1230', windowColor: alpha(N.practical, 0.8), lit: 0.3, seed: 14 }); });
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, 0.05), M.dark]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2); });
  return { GY, CX, M };
}
export function desk(g, x, GY, M) {
  g.fillStyle = shade(M.wall, -0.65); g.fillRect(x - 260, GY - 170, 520, 26); g.fillRect(x - 240, GY - 150, 24, 150); g.fillRect(x + 216, GY - 150, 24, 150);
  rr(g, x + 40, GY - 330, 190, 130, 8); g.fillStyle = '#0c0c14'; g.fill(); rr(g, x + 50, GY - 320, 170, 110, 4); g.fillStyle = '#2a4a70'; g.fill(); glow(g, x + 135, GY - 265, 200, '#9fd8ff', 0.3); g.fillStyle = '#0c0c14'; g.fillRect(x + 125, GY - 200, 20, 30);
}

export function shop(g, t, cam) {
  const M = mood('interiorWarm'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.55, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 1300, 0, GY, [shade(M.wall, -0.55), shade(M.wall, -0.25)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, E.H * 3);
    for (let r = 0; r < 4; r++) { const y = GY - 300 - r * 190; g.fillStyle = shade(M.wall, -0.65); g.fillRect(-E.W, y, E.W * 3, 16);
      for (let i = 0; i < 26; i++) { const x = -E.W + 40 + i * 120; rr(g, x, y - 110 + (i % 3) * 14, 80, 110 - (i % 3) * 14, 6); g.fillStyle = ['#d64a33', '#3a6ea5', '#f2c21a', '#8a5ad6', '#3fb950'][(i + r) % 5]; g.fill(); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, y - 30, 80, 30); } }
    for (const x of [CX - 300, CX + 300]) { seg(g, [[x, GY - 1300], [x, GY - 1140]], 3, '#120d18'); rr(g, x - 50, GY - 1150, 100, 36, 12); g.fillStyle = '#2a1c22'; g.fill(); glow(g, x, GY - 1110, 300, M.practical, 0.45); FX.lightCone(g, x, GY - 1110, { angle: Math.PI / 2, spread: 0.6, len: 1100, color: M.practical, a: 0.08 }); }
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, 0.05), M.dark]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2); FX.floorLines(g, GY, GY + 700); });
  return { GY, CX, M };
}
export function counterTop(g, x, GY, w, M) { g.fillStyle = shade(M.wall, -0.6); g.fillRect(x - w / 2, GY - 190, w, 190); g.fillStyle = shade(M.wall, -0.3); g.fillRect(x - w / 2 - 10, GY - 200, w + 20, 16); g.fillStyle = alpha(M.practical, 0.25); g.fillRect(x - w / 2 - 10, GY - 200, w + 20, 3); }

export function living(g, t, cam) {
  const M = mood('interiorWarm'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.55, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 1300, 0, GY, [shade(M.wall, -0.5), shade(M.wall, -0.2)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, E.H * 3);
    FX.windowFrame(g, { x: CX - 520, y: GY - 900, w: 340, h: 440, cols: 2, rows: 2, frame: shade(M.wall, -0.7), bar: 10 }, (g, x, y, w, h) => { const D = mood('dusk'); g.fillStyle = linGrad(g, 0, y, 0, y + h, D.sky); g.fillRect(x, y, w, h); FX.sun(g, x + w * 0.5, y + h * 0.75, 30, '#fff3dc', D.key, 4); });
    rr(g, CX + 280, GY - 760, 26, 46, 8); g.fillStyle = '#fff0d0'; g.fill(); glow(g, CX + 293, GY - 740, 300, M.practical, 0.5); seg(g, [[CX + 293, GY - 714], [CX + 293, GY - 200]], 6, '#16101a'); poly(g, [[CX + 240, GY - 760], [CX + 346, GY - 760], [CX + 320, GY - 830], [CX + 266, GY - 830]], '#3a2a30');
    rr(g, CX - 500, GY - 300, 760, 200, 40); g.fillStyle = shade(M.wall, -0.55); g.fill(); rr(g, CX - 520, GY - 140, 800, 140, 30); g.fillStyle = shade(M.wall, -0.45); g.fill();
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, 0.05), M.dark]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2); FX.pool(g, CX + 293, GY + 40, 380, 60, M.practical, 0.25); });
  return { GY, CX, M };
}

// refrigerador: open 0..1 (puerta), luz interior
export function fridge(g, x, GY, open, M, inner) {
  const w = 300, h = 720, top = GY - h;
  rr(g, x, top, w, h, 18); g.fillStyle = '#2a2e40'; g.fill();
  if (open > 0) { rr(g, x + 14, top + 14, w - 28, h - 28, 10); g.fillStyle = linGrad(g, 0, top, 0, GY, ['#f4f8ff', '#cfe0ff']); g.fill();
    for (let i = 1; i < 4; i++) { g.fillStyle = 'rgba(160,180,210,.8)'; g.fillRect(x + 14, top + i * 170, w - 28, 6); } inner?.(g, x, top, w, h);
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, x, 0, x - 900, 0, [alpha('#dfe9ff', 0.35 * open), alpha('#dfe9ff', 0)]); g.beginPath(); g.moveTo(x, top); g.lineTo(x - 900, top - 300); g.lineTo(x - 900, GY + 500); g.lineTo(x, GY); g.closePath(); g.fill(); g.restore();
    glow(g, x + w / 2, top + h / 2, 700, '#dfe9ff', 0.35 * open); }
  const dw = w * (1 - open * 0.92); rr(g, x - (open > 0 ? 0 : 0), top, Math.max(18, dw), h, 18); g.fillStyle = shade('#3a3f58', -0.2 * open); g.fill(); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x + 4, top + 4, Math.max(8, dw - 8), 12);
  seg(g, [[x + Math.max(18, dw) - 26, top + 220], [x + Math.max(18, dw) - 26, top + 340]], 8, '#9aa2b8');
  return { top, w, h };
}
export function kitchenNight(g, t, cam, o = {}) {
  const M = mood('night'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.55, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 1300, 0, GY, [shade(M.wall, -0.6), shade(M.wall, -0.3)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, E.H * 3);
    FX.windowFrame(g, { x: CX - 520, y: GY - 900, w: 300, h: 380, cols: 2, rows: 2, frame: shade(M.wall, -0.8), bar: 10 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h); FX.moon(g, x + w * 0.6, y + h * 0.3, 26); FX.stars(g, t, { area: [x, y, w, h], count: 20, seed: 4 }); });
    FX.godRays(g, CX - 370, GY - 700, { count: 5, angle: 0.7, spread: 0.4, len: 900, color: M.key, a: 0.05, t });
    FX.counter(g, { x: CX - 700, y: GY, w: 640, h: 170, color: shade(M.wall, -0.55), top: shade(M.wall, -0.3), doors: 4 });
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, 0.05), M.dark]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2); FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.3)'); });
  let fr = null; layer(g, cam, 1, (g) => { fr = fridge(g, CX + 80, GY, o.open ?? 0, M, o.inner); });
  return { GY, CX, M, fridge: fr };
}
// mesa con platos (plates: [{x, food:bool}])
export function table(g, x, GY, w, plates = [], o = {}) {
  const top = GY - 170, c = o.color || '#2a1a20';
  rr(g, x - w / 2, top - 14, w, 18, 8); g.fillStyle = c; g.fill(); g.fillStyle = 'rgba(255,210,150,.3)'; g.fillRect(x - w / 2 + 6, top - 14, w - 12, 3);
  for (const dx of [-w / 2 + 30, w / 2 - 30]) seg(g, [[x + dx, top], [x + dx, GY]], 12, c);
  for (const p of plates) { g.fillStyle = '#f2ece4'; g.beginPath(); g.ellipse(x + p.x, top - 18, 58, 13, 0, 0, 7); g.fill(); if (p.food) { g.fillStyle = '#d9853a'; g.beginPath(); g.ellipse(x + p.x, top - 24, 36, 10, 0, Math.PI, 0); g.fill(); circle(g, x + p.x + 14, top - 28, 8, '#5aa04a'); }
    if (p.steam) for (let i = 0; i < 3; i++) { const ph = (o.t || 0) * 1.2 + i; g.strokeStyle = `rgba(255,255,255,${0.25 * (1 - (ph % 1))})`; g.lineWidth = 3; g.beginPath(); g.moveTo(x + p.x - 14 + i * 14, top - 40); g.quadraticCurveTo(x + p.x - 24 + i * 14, top - 70 - (ph % 1) * 40, x + p.x - 10 + i * 14, top - 110 - (ph % 1) * 40); g.stroke(); } }
  return { top };
}
