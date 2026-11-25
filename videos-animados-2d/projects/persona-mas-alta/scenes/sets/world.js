// sets/world.js — escenarios reutilizables del video. Todos anclados a GY (línea del suelo) y CX.
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const ground = () => E.H * V(0.8, 0.68);
export const PXM = (b) => (234 * b) / 1.7;           // píxeles por metro para una escala de persona normal b

const wallFill = (g, c, top = -E.H) => { g.fillStyle = c; g.fillRect(-E.W * 1.5, top, E.W * 4, E.H * 3); };
const floor = (g, GY, M, a = 0.25) => {
  g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.floor, -0.05), shade(M.dark, -0.25)]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
  FX.floorLines(g, GY, GY + 800, `rgba(0,0,0,${a})`, 0.08);
};

// ---------- frasco ----------
export function jar(g, x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -26, -64, 52, 64, 12); g.fillStyle = 'rgba(200,225,255,.30)'; g.fill(); g.strokeStyle = 'rgba(230,240,255,.65)'; g.lineWidth = 3; g.stroke();
  for (const [cx, cy] of [[-10, -14], [10, -18], [-4, -32], [12, -40], [-12, -46]]) { circle(g, cx, cy, 9, '#c98a4a'); circle(g, cx - 2, cy - 2, 2, '#5a3018'); }
  rr(g, -29, -76, 58, 14, 5); g.fillStyle = '#d64a33'; g.fill();
  g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(-18, -56, 5, 40); g.restore();
}

// ---------- cocina (interiorWarm, lámpara colgante) ----------
export function kitchen(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = ground(), CX = E.W / 2;
  const wall = shade(M.wall, -0.32), wallDark = shade(M.wall, -0.6);
  const lampX = CX + (o.lampDX ?? -40), pivotY = GY - 900, len = o.lampLen ?? 432, sw = o.swing || 0;
  const bx = lampX + Math.sin(sw) * len, by = pivotY + Math.cos(sw) * len;
  layer(g, cam, 0.55, (g) => {
    wallFill(g, linGrad(g, 0, GY - 1100, 0, GY, [shade(wall, -0.25), wall, shade(wall, 0.04)]));
    // ventana al atardecer
    FX.windowFrame(g, { x: CX - 560, y: GY - 860, w: 330, h: 470, cols: 2, rows: 2, frame: wallDark, bar: 10 }, (g, x, y, w, h) => {
      const D = mood('dusk'); g.fillStyle = linGrad(g, 0, y, 0, y + h, D.sky); g.fillRect(x, y, w, h);
      FX.sun(g, x + w * 0.6, y + h * 0.72, 34, '#fff3dc', D.key, 4);
      FX.skyline(g, { x: x - 20, y: y + h, w: w + 40, minH: 40, maxH: 150, color: shade(D.wall, -0.5), windowColor: alpha(M.practical, 0.6), lit: 0.2, seed: 4 });
    });
    FX.godRays(g, CX - 400, GY - 640, { count: 6, angle: 0.55, spread: 0.5, len: 1100, color: M.key, a: 0.05, t });
    // alacenas bajas + mesada
    FX.counter(g, { x: CX - 700, y: GY, w: 560, h: 170, color: shade(M.wall, -0.5), top: shade(M.wall, -0.2), doors: 4 });
    // estante alto con frasco
    const sx = CX + 230, sw2 = 270;
    for (const h of [230, 440, 650]) { rr(g, sx, GY - h, sw2, 16, 4); g.fillStyle = wallDark; g.fill(); g.fillStyle = alpha(M.practical, 0.25); g.fillRect(sx, GY - h, sw2, 3); }
    g.fillStyle = wallDark; g.fillRect(sx + 4, GY - 660, 12, 660); g.fillRect(sx + sw2 - 16, GY - 660, 12, 660);
    for (let i = 0; i < 3; i++) { rr(g, sx + 40 + i * 60, GY - 230 - 70, 40, 70, 6); g.fillStyle = shade(M.wall, -0.15 + i * 0.05); g.fill(); }
    for (let i = 0; i < 4; i++) { rr(g, sx + 30 + i * 52, GY - 440 - 52 - (i % 2) * 14, 36, 52 + (i % 2) * 14, 5); g.fillStyle = shade(M.wall, -0.1 - i * 0.04); g.fill(); }
    if (!o.noJar) jar(g, sx + 150, GY - 650, 1.3);
    // techo
    g.fillStyle = shade(wallDark, -0.3); g.fillRect(-E.W * 1.5, pivotY - 1000, E.W * 4, 1000);
  });
  layer(g, cam, 0.9, (g) => { floor(g, GY, M); FX.pool(g, bx, GY + 30, 330, 50, M.practical, 0.28); });
  layer(g, cam, 1, (g) => {
    seg(g, [[lampX, pivotY], [bx, by - 40]], 4, '#0e0b12');
    const ang = -sw; g.save(); g.translate(bx, by); g.rotate(ang);
    FX.lightCone(g, 0, 0, { angle: Math.PI / 2, spread: 0.7, len: 900, color: M.practical, a: 0.16 });
    poly(g, [[-26, -40], [26, -40], [70, 6], [-70, 6]], shade(M.wall, -0.55));
    g.fillStyle = alpha(M.practical, 0.9); g.beginPath(); g.ellipse(0, 6, 70, 10, 0, 0, Math.PI * 2); g.fill();
    g.restore(); glow(g, bx, by + 10, 260, M.practical, 0.55); circle(g, bx, by + 12, 16, '#fff6dc');
  });
  return { GY, CX, M, lamp: [bx, by] };
}

// ---------- cancha de básquet (dusk) ----------
export function court(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = ground(), CX = E.W / 2, b = o.b ?? 1.4, m = PXM(b);
  const hx = CX + (o.hoopDX ?? 230), rimY = GY - 3.05 * m;
  layer(g, cam, 0.15, (g) => {
    backdrop(g, M.sky, [-E.W, -E.H * 1.5, E.W * 3, E.H * 4]);
    FX.sun(g, CX - 260, GY - 520, 70, '#fff3dc', M.key, 5);
    FX.clouds(g, { y: GY - 1300, h: 240, color: '#ffe2c4', a: 0.12, seed: 6 });
  });
  layer(g, cam, 0.35, (g) => FX.skyline(g, { x: -E.W, y: GY - 260, w: E.W * 3, minH: 120, maxH: 620, color: mix(M.sky[0], '#100b18', 0.6), windowColor: alpha(M.practical, 0.6), lit: 0.18, seed: 12 }));
  layer(g, cam, 0.6, (g) => {
    // reflectores
    for (const x of [CX - 520, CX + 640]) { seg(g, [[x, GY - 60], [x, GY - 1050]], 14, '#120d18'); rr(g, x - 70, GY - 1110, 140, 60, 8); g.fillStyle = '#1a1420'; g.fill(); for (let i = 0; i < 4; i++) { circle(g, x - 48 + i * 32, GY - 1080, 12, '#fff4dc'); glow(g, x - 48 + i * 32, GY - 1080, 120, '#ffe7b8', 0.4); } }
    // reja
    g.fillStyle = 'rgba(14,10,20,.55)'; g.fillRect(-E.W, GY - 380, E.W * 3, 380);
    g.strokeStyle = 'rgba(255,220,180,.10)'; g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 34) { g.beginPath(); g.moveTo(x, GY - 380); g.lineTo(x + 190, GY); g.stroke(); g.beginPath(); g.moveTo(x + 190, GY - 380); g.lineTo(x, GY); g.stroke(); }
    seg(g, [[-E.W, GY - 380], [E.W * 2, GY - 380]], 6, '#140f1a');
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, ['#5a3a46', '#2a1c26']); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
    g.strokeStyle = 'rgba(255,236,210,.35)'; g.lineWidth = 5; g.beginPath(); g.ellipse(hx - 120, GY + 120, 420, 90, 0, Math.PI * 0.5, Math.PI * 1.5); g.stroke();
    g.beginPath(); g.moveTo(-E.W, GY + 40); g.lineTo(E.W * 2, GY + 40); g.stroke();
    FX.pool(g, CX, GY + 60, 600, 90, M.practical, 0.2);
  });
  // aro (plano de personajes)
  layer(g, cam, 1, (g) => {
    const poleX = hx + 150; seg(g, [[poleX, GY], [poleX, rimY - 110], [hx + 40, rimY - 110]], 16, '#16111c');
    rr(g, hx + 20, rimY - 190, 26, 200, 4); g.fillStyle = '#e8e2d8'; g.fill(); g.strokeStyle = '#d64a33'; g.lineWidth = 4; g.strokeRect(hx + 22, rimY - 80, 22, 60);
    seg(g, [[hx + 20, rimY], [hx - 70, rimY]], 7, '#e2622e'); g.strokeStyle = 'rgba(240,236,228,.75)'; g.lineWidth = 2;
    for (let i = 0; i <= 5; i++) { const x0 = hx - 70 + i * 18, x1 = hx - 58 + i * 12; g.beginPath(); g.moveTo(x0, rimY); g.lineTo(x1, rimY + 70); g.stroke(); }
    if (o.rimGlow) glow(g, hx - 25, rimY, 160, '#ffd47e', o.rimGlow);
  });
  return { GY, CX, M, m, rim: [hx - 25, rimY] };
}

// ---------- pasillo con puerta de 2 m (interiorWarm) ----------
export function house(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), GY = ground(), CX = E.W / 2, b = o.b ?? 1.4, m = PXM(b);
  const dx = CX + (o.doorDX ?? 170), dw = 0.9 * m, dh = 2.0 * m;
  layer(g, cam, 0.6, (g) => {
    wallFill(g, linGrad(g, 0, GY - 1200, 0, GY, [shade(M.wall, -0.55), shade(M.wall, -0.3), shade(M.wall, -0.22)]));
    g.fillStyle = shade(M.wall, -0.5); g.fillRect(-E.W * 1.5, GY - 70, E.W * 4, 70);
    for (const x of [CX - 520, CX - 250]) { rr(g, x, GY - 720, 150, 190, 6); g.fillStyle = shade(M.wall, -0.6); g.fill(); rr(g, x + 14, GY - 706, 122, 162, 4); g.fillStyle = mix(M.sky[0], M.wall, 0.5); g.fill(); }
    rr(g, CX - 370, GY - 900, 22, 40, 6); g.fillStyle = '#fff0d0'; g.fill(); glow(g, CX - 359, GY - 880, 220, M.practical, 0.45);
  });
  layer(g, cam, 0.9, (g) => { floor(g, GY, M); FX.pool(g, dx + dw / 2, GY + 30, 320, 46, M.practical, 0.35); });
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, GY - dh, 0, GY, [shade(M.practical, -0.1), shade(M.practical, -0.45)]); g.fillRect(dx, GY - dh, dw, dh);
    glow(g, dx + dw / 2, GY - dh * 0.6, dh * 0.8, M.practical, 0.35);
    g.fillStyle = shade(M.wall, -0.7); g.fillRect(dx - 16, GY - dh - 18, dw + 32, 20); g.fillRect(dx - 16, GY - dh, 16, dh); g.fillRect(dx + dw, GY - dh, 16, dh);
    poly(g, [[dx, GY - dh], [dx + dw * 0.35, GY - dh + 30], [dx + dw * 0.35, GY - 6], [dx, GY]], shade(M.wall, -0.75));
    FX.lightCone(g, dx + dw / 2, GY - dh, { angle: Math.PI * 0.62, spread: 0.6, len: 700, color: M.practical, a: 0.08 });
  });
  return { GY, CX, M, m, door: { x: dx, w: dw, h: dh } };
}

// ---------- dormitorio de noche (luna) ----------
export function bedroom(g, t, cam, o = {}) {
  const M = mood('night'), GY = ground(), CX = E.W / 2, b = o.b ?? 1.15, m = PXM(b);
  const bx = CX - 0.95 * m - 120, bl = 1.9 * m, top = GY - 0.5 * m;
  layer(g, cam, 0.55, (g) => {
    wallFill(g, linGrad(g, 0, GY - 1200, 0, GY, [shade(M.wall, -0.5), shade(M.wall, -0.15)]));
    FX.windowFrame(g, { x: CX - 120, y: GY - 980, w: 360, h: 420, cols: 2, rows: 2, frame: shade(M.wall, -0.7), bar: 10 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h); FX.stars(g, t, { area: [x, y, w, h], count: 40, seed: 3 }); FX.moon(g, x + w * 0.66, y + h * 0.3, 34);
      FX.skyline(g, { x, y: y + h, w, minH: 30, maxH: 140, color: '#0b0d1e', windowColor: alpha(M.practical, 0.7), lit: 0.2, seed: 9 });
    });
    FX.godRays(g, CX + 60, GY - 780, { count: 6, angle: Math.PI * 0.62, spread: 0.45, len: 1100, color: M.key, a: 0.06, t });
  });
  layer(g, cam, 0.9, (g) => { floor(g, GY, M, 0.3); FX.pool(g, CX - 40, GY + 60, 420, 60, M.key, 0.12); });
  layer(g, cam, 1, (g) => {
    rr(g, bx - 24, top - 0.55 * m, 30, 0.55 * m + (GY - top), 8); g.fillStyle = shade(M.wall, -0.65); g.fill();
    g.fillStyle = shade(M.wall, -0.6); g.fillRect(bx, top + 40, bl, GY - top - 40); g.fillRect(bx + bl - 20, top, 20, GY - top);
    rr(g, bx, top, bl, 46, 10); g.fillStyle = '#4a5a9a'; g.fill(); g.fillStyle = alpha('#c9d4ff', 0.25); g.fillRect(bx, top, bl, 6);
    rr(g, bx + 10, top - 34, 120, 40, 18); g.fillStyle = '#d8dcf0'; g.fill();
  });
  return { GY, CX, M, m, bed: { x: bx, len: bl, top } };
}

// ---------- calle al atardecer ----------
export function street(g, t, cam, o = {}) {
  const M = mood('dusk'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.15, (g) => { backdrop(g, M.sky, [-E.W, -E.H * 1.5, E.W * 3, E.H * 4]); FX.sun(g, CX + 200, GY - 1050, 60, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.45, (g) => {
    let x = -E.W * 1.2, i = 0; while (x < E.W * 2.2) { const w = 380 + (i % 3) * 90, h = 900 + ((i * 7) % 5) * 120;
      FX.facade(g, { x, y: GY - h, w, h, color: shade(M.wall, -0.25 - (i % 2) * 0.1), win: M.practical, dark: shade(M.wall, -0.6), cols: 3, rows: 6, lit: 0.45, seed: 3 + i }); x += w + 10; i++; }
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, 0.05), shade(M.dark, -0.2)]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
    seg(g, [[-E.W * 1.5, GY + 4], [E.W * 2.5, GY + 4]], 6, shade(M.floor, 0.25));
    for (let k = -2; k <= 3; k++) { FX.lampPost(g, CX + k * 560, GY, 520, { light: M.practical }); FX.pool(g, CX + k * 560 + 34, GY + 30, 220, 36, M.practical, 0.3); }
  });
  return { GY, CX, M };
}

// ---------- feria de noche ----------
export function wheel(g, x, y, R, t, M) {
  const rot = t * 0.12;
  seg(g, [[x - R * 0.55, y + R * 1.25], [x, y], [x + R * 0.55, y + R * 1.25]], 14, '#140f1c');
  ring(g, x, y, R, 10, '#2a2238'); ring(g, x, y, R * 0.92, 4, '#2a2238');
  for (let i = 0; i < 16; i++) { const a = rot + (i / 16) * Math.PI * 2; seg(g, [[x, y], [x + Math.cos(a) * R, y + Math.sin(a) * R]], 3, '#2a2238'); }
  const cols = ['#ffd47e', '#ff8a6a', '#9fe0ff', '#ffd47e'];
  for (let i = 0; i < 48; i++) { const a = rot + (i / 48) * Math.PI * 2, px = x + Math.cos(a) * R, py = y + Math.sin(a) * R; const on = 0.55 + 0.45 * Math.sin(t * 3 + i * 0.7); circle(g, px, py, 5, alpha(cols[i % 4], on)); glow(g, px, py, 26, cols[i % 4], 0.35 * on); }
  for (let i = 0; i < 12; i++) { const a = rot + (i / 12) * Math.PI * 2, px = x + Math.cos(a) * R, py = y + Math.sin(a) * R; rr(g, px - 22, py + 6, 44, 34, 8); g.fillStyle = '#3a2a4a'; g.fill(); g.fillStyle = alpha(M.practical, 0.7); g.fillRect(px - 14, py + 12, 28, 10); }
  circle(g, x, y, 22, '#3a2a4a'); glow(g, x, y, 120, '#ffd47e', 0.3);
}
export function bulbs(g, x0, x1, y, sag, t, seed = 1) {
  const r = rng(seed); g.strokeStyle = '#120d18'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y); g.quadraticCurveTo((x0 + x1) / 2, y + sag * 2, x1, y); g.stroke();
  const n = Math.round(Math.abs(x1 - x0) / 46); const cols = ['#ffd47e', '#ff8a6a', '#9fe0ff', '#c9a0ff'];
  for (let i = 1; i < n; i++) { const u = i / n, px = x0 + (x1 - x0) * u, py = y + sag * 4 * u * (1 - u) + 6; const c = cols[Math.floor(r() * 4)], on = 0.7 + 0.3 * Math.sin(t * 2.5 + i); circle(g, px, py, 5, alpha(c, on)); glow(g, px, py, 30, c, 0.4 * on); }
}
export function stall(g, x, GY, w, h, c, M) {
  g.fillStyle = shade(M.wall, -0.4); g.fillRect(x, GY - h, w, h);
  g.fillStyle = linGrad(g, 0, GY - h + 60, 0, GY - 80, [M.practical, shade(M.practical, -0.5)]); g.fillRect(x + 16, GY - h + 70, w - 32, h - 160);
  for (let k = 0, xx = x - 10; xx < x + w + 10; xx += 40, k++) { g.fillStyle = k % 2 ? '#f0e6d8' : c; g.fillRect(xx, GY - h - 10, 40, 60); g.beginPath(); g.arc(xx + 20, GY - h + 50, 20, 0, Math.PI); g.fill(); }
  glow(g, x + w / 2, GY - h / 2, w * 0.8, M.practical, 0.3);
}
export function fair(g, t, cam, o = {}) {
  const M = mood('night'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky, [-E.W, -E.H * 1.5, E.W * 3, E.H * 4]); FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, GY], count: 220, seed: 7 }); FX.moon(g, CX - 330, GY - 1200, 40); });
  layer(g, cam, 0.3, (g) => FX.skyline(g, { x: -E.W, y: GY - 200, w: E.W * 3, minH: 60, maxH: 320, color: '#0c0e22', windowColor: alpha(M.practical, 0.5), lit: 0.15, seed: 31 }));
  layer(g, cam, 0.45, (g) => { wheel(g, CX + (o.wheelDX ?? 230), GY - 760, 460, t, M); });
  layer(g, cam, 0.65, (g) => {
    stall(g, CX - 700, GY, 330, 330, '#d64a33', M); stall(g, CX - 260, GY, 300, 300, '#3a6ea5', M); stall(g, CX + 420, GY, 320, 320, '#8a5ad6', M);
    bulbs(g, -E.W * 0.6, CX, GY - 560, 60, t, 2); bulbs(g, CX, E.W * 1.6, GY - 600, 70, t, 5);
    FX.crowd(g, t, { x: -E.W, y: GY - 120, w: E.W * 3, rows: 5, rowH: 24, size: 2.2, color: '#1a1630', seed: 3, wave: 0 });
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, 0.12), shade(M.dark, -0.2)]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
    FX.pool(g, CX - 200, GY + 40, 500, 80, M.practical, 0.25); FX.pool(g, CX + 300, GY + 50, 400, 60, '#ff8a6a', 0.15);
  });
  return { GY, CX, M };
}
// silueta de gente normal (tinta sola) para multitudes de primer plano
export const PERSON = { top: 'none', head: 'none' };

// ---------- niebla fría ----------
export function fogSet(g, t, cam) {
  const M = mood('storm'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.15, (g) => { backdrop(g, M.sky, [-E.W, -E.H * 1.5, E.W * 3, E.H * 4]); FX.moon(g, CX + 160, GY - 1150, 70, '#dfe6ff'); });
  layer(g, cam, 0.4, (g) => { wheel(g, CX - 380, GY - 620, 360, t * 0.5, M); veil(g, M.sky[1], 0.55); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, 0.1), M.dark]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2); });
  return { GY, CX, M };
}
function veil(g, c, a) { g.save(); g.fillStyle = alpha(c, a); g.fillRect(-E.W * 2, -E.H * 2, E.W * 5, E.H * 5); g.restore(); }
