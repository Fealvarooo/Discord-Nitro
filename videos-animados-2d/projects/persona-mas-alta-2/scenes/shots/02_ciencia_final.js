// shots/02_ciencia_final.js — alturas, ley cuadrado-cubo, hipófisis, relojes, congelado, Leo y pantalla final.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { fair, court, bedroom, ground } from '../sets/world.js';
import { TU, LEO, TOMAS, GIANT, TOMAS_S, CAST } from '../cast.js';
import { wt, CANES, tomas, GOLD } from './01_encuentro.js';

const BY = () => E.H * 0.72, PM = () => 330, fs = (m) => (m * PM()) / 230;
const floorLine = (g) => { const c = UI.bpStroke(); seg(g, [[-E.W, BY()], [E.W * 2, BY()]], 3, alpha(c, 0.7)); for (let x = 0; x < E.W; x += 40) seg(g, [[x, BY()], [x - 18, BY() + 18]], 2, alpha(c, 0.35)); };

// tú (2,75) y Tomás (3,10) en plano técnico
function heights(g, t, info, o = {}) {
  UI.blueprint(g); floorLine(g); const gold = S().ui.gold, acc = S().ui.accent;
  const xu = E.W * 0.32, xt = E.W * 0.66, kt = o.grow ?? 1;
  UI.lineFigure(g, { x: xu, y: BY(), s: fs(2.75), color: gold });
  g.save(); g.translate(xt, BY()); g.scale(kt, kt); g.translate(-xt, -BY()); UI.lineFigure(g, { x: xt, y: BY(), s: fs(3.1), color: acc, facing: -1 }); g.restore();
  return { xu, xt, gold, acc };
}
// s004 — "Mide tres metros con diez."
registerShot('s004', { draw(g, t, info) {
  const grow = ease.outBack(prog(t, 0.05, 0.6)), { xu, xt, gold, acc } = heights(g, t, info, { grow });
  UI.dimension(g, t, { x1: xu - 150, y1: BY(), x2: xu - 150, y2: BY() - 2.75 * PM(), str: '2,75 m', color: gold, start: 0 });
  UI.dimension(g, t, { x1: xt + 150, y1: BY(), x2: xt + 150, y2: BY() - 3.1 * PM(), str: '3,10 m', color: acc, start: wt('tres', info, 0.5) - 0.3 });
  text(g, 'TÚ', xu, BY() + 80, { size: 46, color: gold, font: FONTS.ui, weight: 900 }); text(g, 'TOMÁS', xt, BY() + 80, { size: 46, color: acc, font: FONTS.ui, weight: 900, alpha: grow });
} });
// s005 — "Treinta y cinco centímetros más que tú."
registerShot('s005', { draw(g, t, info) {
  const z = lerp(1, 1.7, ease.inOut(prog(t, 0, 1.2))), fy = BY() - 2.95 * PM();
  g.save(); g.translate(E.W / 2, E.H * 0.5); g.scale(z, z); g.translate(-E.W / 2, -fy);
  const { xu, xt, gold, acc } = heights(g, t, info);
  const y1 = BY() - 2.75 * PM(), y2 = BY() - 3.1 * PM(), on = ease.out(prog(t, 0.2, 0.7));
  g.setLineDash([12, 10]); seg(g, [[xu - 120, y1], [xt + 140 * on, y1]], 3, gold); seg(g, [[xu - 120, y2], [xt + 140, y2]], 3, alpha(acc, on)); g.setLineDash([]);
  UI.dimension(g, t, { x1: xt + 130, y1, x2: xt + 130, y2, str: '', color: acc, start: 0.5 });
  g.restore();
  UI.readout(g, { value: '+35 cm', x: E.W / 2, y: E.H * 0.18, align: 'center', color: acc, size: 110, a: ease.outBack(prog(t, wt('Treinta', info, 0.2), wt('Treinta', info, 0.2) + 0.4)) });
} });

// s015 — "¿Por qué nadie llega a los tres metros?"
registerShot('s015', { draw(g, t, info) {
  const M = mood('void'), GY = ground(), cam = { z: 1 + 0.05 * t / info.dur };
  layer(g, cam, 0.2, (g) => { backdrop(g, M.sky); glow(g, E.W / 2, GY - 400, 700, M.rim, 0.12); });
  layer(g, cam, 1, (g) => { drawFigure(g, { x: E.W / 2 - 160, y: GY, s: GIANT * 1.1, facing: 1, outfit: TU, pose: breathe(POSES.stand, t), expr: 'thinking', rim: { color: M.rim, dir: [0, -1] }, dim: true }); tomas(g, { x: E.W / 2 + 180, y: GY, s: TOMAS_S * 1.1, M, t, scarf: 1 }); });
  seg(g, [[60, GY - 3.0 * (234 * 1.1 / 1.7)], [E.W - 60, GY - 3.0 * (234 * 1.1 / 1.7)]], 3, alpha(S().ui.accent, 0.6));
  text(g, '3 m', E.W - 70, GY - 3.0 * (234 * 1.1 / 1.7) - 30, { size: 40, color: S().ui.accent, font: FONTS.ui, weight: 900, align: 'right' });
  UI.bigLine(g, t, { str: '¿POR QUÉ NADIE LLEGA', dur: info.dur, y: E.H * 0.17 }); UI.bigLine(g, t, { str: 'A LOS 3 METROS?', dur: info.dur, y: E.H * 0.23 });
} });
// s016 — "Por la regla que ya conoces."
registerShot('s016', { draw(g, t, info) {
  UI.blueprint(g); floorLine(g); const c = UI.bpStroke(), acc = S().ui.accent, s = fs(2.75), x = E.W / 2, p = POSES.stand;
  UI.lineFigure(g, { x, y: BY(), s, color: alpha(c, 0.95) });
  for (const kk of [p.kF, p.kB]) { const kx = x + kk[0] * s, ky = BY() + kk[1] * s; ring(g, kx, ky, 26 * (1 + 0.15 * Math.sin(t * 10)), 6, acc); glow(g, kx, ky, 90, acc, 0.5); }
  UI.bigLine(g, t, { str: 'LA REGLA', dur: info.dur + 1, y: E.H * 0.15, color: S().ui.gold });
  text(g, 'EL PESO CRECE MÁS RÁPIDO QUE LOS HUESOS', E.W / 2, E.H * 0.2, { size: 34, color: S().ui.cream, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 0.5, 0.9)) });
} });

// cubos: lado 1 (izquierda) y lado 2 (derecha), en isométrico
function cube(g, cx, cy, a, n, o) {
  const dx = a * 0.5, dy = a * 0.32, c = o.line;
  const F = [[cx - a / 2, cy - a / 2], [cx + a / 2, cy - a / 2], [cx + a / 2, cy + a / 2], [cx - a / 2, cy + a / 2]];
  const top = [F[0], F[1], [F[1][0] + dx, F[1][1] - dy], [F[0][0] + dx, F[0][1] - dy]], side = [F[1], [F[1][0] + dx, F[1][1] - dy], [F[2][0] + dx, F[2][1] - dy], F[2]];
  poly(g, top, alpha(o.fill, 0.15 + 0.5 * o.vol)); poly(g, side, alpha(o.fill, 0.1 + 0.45 * o.vol)); poly(g, F, alpha(o.face, 0.08 + 0.5 * o.area));
  g.strokeStyle = c; g.lineWidth = 3; for (const P of [F, top, side]) { g.beginPath(); P.forEach((q, i) => (i ? g.lineTo(...q) : g.moveTo(...q))); g.closePath(); g.stroke(); }
  if (n > 1) { g.lineWidth = 1.5; g.strokeStyle = alpha(c, 0.7); for (let i = 1; i < n; i++) { const u = i / n; seg(g, [[F[0][0] + a * u, F[0][1]], [F[3][0] + a * u, F[3][1]]], 1.5, alpha(c, 0.7)); seg(g, [[F[0][0], F[0][1] + a * u], [F[1][0], F[1][1] + a * u]], 1.5, alpha(c, 0.7));
    seg(g, [[F[0][0] + a * u, F[0][1]], [F[0][0] + a * u + dx, F[0][1] - dy]], 1.5, alpha(c, 0.6)); seg(g, [[F[1][0] + dx * u, F[1][1] - dy * u], [F[2][0] + dx * u, F[2][1] - dy * u]], 1.5, alpha(c, 0.6)); } }
}
function cubes(g, t, info, phase) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), a = 150, y = E.H * 0.48;
  const td = phase === 1 ? wt('duplica,', info, 0.8) : -1, t4 = phase === 1 ? wt('cuatro', info, 2.2) : -1, t8 = phase === 2 ? wt('ocho.', info, 1.9) : 99;
  const grow = phase === 1 ? ease.outBack(prog(t, td - 0.1, td + 0.5)) : 1;
  cube(g, E.W * 0.24, y + a / 2, a, 1, { line: c, fill: c, face: ui.cream, vol: 0.4, area: 0.4 });
  text(g, '1', E.W * 0.24, y + a + 90, { size: 44, color: c, font: FONTS.ui, weight: 900 });
  if (grow > 0) { g.save(); g.translate(E.W * 0.62, y + a); g.scale(grow, grow); g.translate(-E.W * 0.62, -(y + a)); cube(g, E.W * 0.62, y, a * 2, 2, { line: c, fill: ui.accent, face: ui.cream, vol: phase === 2 ? ease.out(prog(t, t8 - 0.3, t8 + 0.3)) : 0, area: t > t4 || phase === 2 ? 1 : 0 }); g.restore(); }
  const rows = [['ALTURA', '×2', c, phase === 1 ? td : -1], ['HUESOS', '×4', ui.cream, phase === 1 ? t4 : -1], ['PESO', '×8', ui.accent, t8]];
  rows.forEach(([l, v, col, at], i) => { const k = ease.outBack(prog(t, at, at + 0.4)); if (k <= 0) return; const yy = E.H * 0.7 + i * 90;
    text(g, l, E.W * 0.22, yy, { size: 46, color: col, font: FONTS.ui, weight: 900, align: 'left', alpha: clamp(k) }); text(g, v, E.W * 0.78, yy, { size: 60 * k, color: col, font: FONTS.ui, weight: 900, align: 'right', glow: 14, glowColor: alpha(col, 0.5) }); });
}
// s017 — "Si tu altura se duplica, tus huesos son cuatro veces más fuertes."
registerShot('s017', { draw(g, t, info) { cubes(g, t, info, 1); } });
// s018 — "Pero tu peso se multiplica por ocho."
registerShot('s018', { draw(g, t, info) { cubes(g, t, info, 2); } });
// s019 — "Tu esqueleto pierde la carrera."
registerShot('s019', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, x0 = 100, x1 = E.W - 100, tp = wt('pierde', info, 0.85);
  text(g, 'LA CARRERA', E.W / 2, E.H * 0.25, { size: 64, color: ui.gold, font: FONTS.title, weight: 700, spacing: 4, glow: 16, glowColor: alpha(ui.gold, 0.5) });
  seg(g, [[x1, E.H * 0.35], [x1, E.H * 0.62]], 4, alpha(ui.cream, 0.6));
  [['HUESOS', ui.cream, 0.3 + 0.18 * t, E.H * 0.42], ['PESO', ui.accent, Math.min(1, 0.25 + 0.42 * t), E.H * 0.55]].forEach(([l, col, p, y]) => {
    text(g, l, x0, y - 50, { size: 40, color: col, font: FONTS.ui, weight: 900, align: 'left' }); rr(g, x0, y - 22, x1 - x0, 44, 22); g.fillStyle = alpha(col, 0.1); g.fill();
    const w = (x1 - x0) * clamp(p); rr(g, x0, y - 22, w, 44, 22); g.fillStyle = col; g.fill(); glow(g, x0 + w, y, 70, col, 0.5); });
  if (t > tp) text(g, 'PIERDE', E.W / 2, E.H * 0.42 + 90, { size: 56, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tp, tp + 0.3)) });
} });

// cabeza de perfil en plano técnico
function head(g, cx, cy, R, c) { g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, R, -2.6, 1.55); g.stroke(); seg(g, [[cx + R * 0.02, cy + R], [cx - R * 0.15, cy + R * 1.5]], 4, c); seg(g, [[cx - R * 0.5, cy + R * 0.86], [cx - R * 0.5, cy + R * 1.5]], 4, c);
  g.strokeStyle = alpha(c, 0.6); g.lineWidth = 3; g.beginPath(); g.ellipse(cx - R * 0.05, cy - R * 0.2, R * 0.7, R * 0.5, 0, 0, 7); g.stroke(); for (let i = -2; i <= 2; i++) { g.beginPath(); g.arc(cx + i * R * 0.22, cy - R * 0.2, R * 0.22, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } }
// s020 — "Todo empieza en una glándula del tamaño de un guisante: la hipófisis."
registerShot('s020', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), cx = E.W / 2, cy = E.H * 0.42, R = 300, z = lerp(1, 1.12, t / info.dur);
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); head(g, cx, cy, R, c);
  const tg = wt('glándula', info, 0.95), tgu = wt('guisante:', info, 2.4), th = wt('hipófisis.', info, 3.5), px = cx - 10, py = cy + R * 0.28;
  const on = ease.outBack(prog(t, tg, tg + 0.4)), beat = 1 + 0.2 * Math.pow(Math.max(0, Math.sin(t * 7)), 4);
  if (on > 0) { circle(g, px, py, 16 * on * beat, ui.gold); glow(g, px, py, 90, ui.gold, 0.6 * on); }
  g.restore();
  if (t > tgu) { const k = ease.outBack(prog(t, tgu, tgu + 0.4)); circle(g, E.W * 0.22, E.H * 0.76, 22 * k, '#8fd16a'); circle(g, E.W * 0.22 - 7, E.H * 0.76 - 7, 6 * k, 'rgba(255,255,255,.6)'); text(g, 'GUISANTE', E.W * 0.22, E.H * 0.76 + 60, { size: 34, color: '#a8e08a', font: FONTS.ui, weight: 900, alpha: clamp(k) });
    text(g, '=', E.W * 0.42, E.H * 0.76, { size: 60, color: ui.cream, font: FONTS.ui, weight: 900, alpha: clamp(k) }); circle(g, E.W * 0.6, E.H * 0.76, 22 * k, ui.gold); glow(g, E.W * 0.6, E.H * 0.76, 70, ui.gold, 0.5 * k); }
  UI.callout(g, t, { at: [px + 18, py], to: [px + 260, py + 190], str: 'HIPÓFISIS', color: ui.gold, start: th - 0.2, size: 46 });
} });
// s021 — "Si no deja de enviar la orden de crecer, tú no dejas de crecer."
registerShot('s021', { draw(g, t, info) {
  UI.blueprint(g); floorLine(g); const ui = S().ui, c = UI.bpStroke(), x = E.W / 2;
  const m = 2.75 + 0.35 * ease.inOut(prog(t, 0.4, info.dur)), s = fs(m) * 0.82, top = BY() - 230 * s;
  UI.lineFigure(g, { x, y: BY(), s, color: alpha(c, 0.95) });
  const hx = x + 3 * s, hy = BY() - 208 * s; const beat = Math.pow(Math.max(0, Math.sin(t * 6)), 4); circle(g, hx, hy + 6 * s, 8 + 6 * beat, ui.gold); glow(g, hx, hy, 70, ui.gold, 0.4 + 0.4 * beat);
  for (let i = 0; i < 5; i++) { const u = ((t * 0.7 + i / 5) % 1), yy = lerp(hy + 30, BY() - 20, u); poly(g, [[x - 110, yy + 14], [x - 124, yy - 6], [x - 96, yy - 6]], alpha(ui.gold, 0.8 * (1 - u))); }
  text(g, 'CRECE', x - 160, hy + 120, { size: 44, color: ui.gold, font: FONTS.ui, weight: 900, align: 'right', alpha: 0.5 + 0.5 * beat, glow: 14, glowColor: alpha(ui.gold, 0.5) });
  UI.readout(g, { value: m.toFixed(2).replace('.', ',') + ' m', x: x + 140, y: top + 20, align: 'left', color: ui.accent });
} });

// relojes
function bigClock(g, x, y, r, t, col, label, a) {
  if (a <= 0) return; g.save(); g.globalAlpha *= clamp(a); g.translate(x, y); g.scale(0.7 + 0.3 * a, 0.7 + 0.3 * a);
  circle(g, 0, 0, r, 'rgba(10,14,26,.85)'); ring(g, 0, 0, r, 8, col); glow(g, 0, 0, r * 1.6, col, 0.25);
  for (let i = 0; i < 12; i++) { const an = (i * Math.PI) / 6; seg(g, [[Math.cos(an) * r * 0.82, Math.sin(an) * r * 0.82], [Math.cos(an) * r * 0.92, Math.sin(an) * r * 0.92]], 5, alpha(col, 0.8)); }
  seg(g, [[0, 0], [-r * 0.5, 0]], 12, col); seg(g, [[0, 0], [0, -r * 0.75]], 8, col); circle(g, 0, 0, 12, col);
  text(g, '9:00', 0, r + 70, { size: 80, color: col, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(col, 0.5) });
  text(g, label, 0, -r - 50, { size: 50, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore();
}
const courtBlur = (g, t) => { blurLayer(g, 16, (g) => court(g, t, { z: 1.4, y: -300 })); veil(g, '#050714', 0.55); };
// s025 — "Mañana a las nueve."
registerShot('s025', { draw(g, t, info) { courtBlur(g, t); bigClock(g, E.W / 2, E.H * 0.42, 200, t, S().ui.gold, 'CANCHA', ease.outBack(prog(t, 0.1, 0.5))); text(g, 'MAÑANA', E.W / 2, E.H * 0.15, { size: 60, color: S().ui.cream, font: FONTS.title, weight: 700, spacing: 4, alpha: ease.out(prog(t, 0, 0.4)) }); } });
// s026 — "La cita con la doctora también es mañana a las nueve."
registerShot('s026', { draw(g, t, info) {
  courtBlur(g, t); veil(g, '#050714', 0.2); const td = wt('doctora', info, 0.85), tn = wt('nueve.', info, 2.7), pulse = t > tn ? 1 + 0.06 * Math.sin((t - tn) * 12) : 1;
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(pulse, pulse); g.translate(-E.W / 2, -E.H / 2);
  bigClock(g, E.W / 2, E.H * 0.27, 150, t, S().ui.gold, 'CANCHA', 1); bigClock(g, E.W / 2, E.H * 0.63, 150, t, S().ui.accent, 'DOCTORA', ease.outBack(prog(t, td - 0.1, td + 0.4)));
  g.restore();
} });
// s027 — CONGELADO: "Otra vez: la cancha o tu cuerpo."
registerShot('s027', { draw(g, t, info) {
  const M = mood('void'), GY = ground(), ui = S().ui, tc = wt('cancha', info, 1.3), tb = wt('cuerpo.', info, 2.4);
  backdrop(g, M.sky); glow(g, E.W / 2, GY - 400, 700, M.rim, 0.15);
  drawFigure(g, { x: E.W / 2, y: GY, s: 1.25 * GIANT, facing: t < tb ? -1 : 1, outfit: TU, pose: breathe(POSES.stand, t * 0.3), expr: 'worried', look: t < tb ? [-1, -0.3] : [1, -0.3], rim: { color: M.rim, dir: [0, -1] } });
  const y = E.H * 0.26, a1 = ease.outBack(prog(t, tc - 0.1, tc + 0.3)), a2 = ease.outBack(prog(t, tb - 0.1, tb + 0.3));
  if (a1 > 0) { g.save(); g.globalAlpha *= clamp(a1); const x = E.W * 0.24; seg(g, [[x - 60, y + 30], [x + 60, y + 30]], 8, '#e2622e'); for (let i = 0; i < 5; i++) seg(g, [[x - 54 + i * 27, y + 30], [x - 40 + i * 20, y + 100]], 2, '#f0ece4'); rr(g, x - 90, y - 100, 180, 120, 6); g.strokeStyle = '#f0ece4'; g.lineWidth = 5; g.stroke(); glow(g, x, y, 200, ui.gold, 0.35); g.restore();
    text(g, 'LA CANCHA', E.W * 0.24, y + 170, { size: 44, color: ui.gold, font: FONTS.ui, weight: 900, alpha: clamp(a1) }); }
  if (a2 > 0) { UI.lineFigure(g, { x: E.W * 0.76, y: y + 110, s: 0.95, color: alpha(ui.accent, clamp(a2)) }); glow(g, E.W * 0.76, y, 200, ui.accent, 0.3 * a2);
    text(g, 'TU CUERPO', E.W * 0.76, y + 170, { size: 44, color: ui.accent, font: FONTS.ui, weight: 900, alpha: clamp(a2) }); }
  FX.drops(g, t, { count: 50, color: '#d8e4ff', rMax: 9, drift: 3 });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  FX.rings(g, E.W / 2, E.H * 0.5, t, { count: 3, r0: 120, r1: 520, speed: 0.35, color: '#e8f0ff', a: 0.3 });
} });

// s028 — "Leo te toma la mano."
registerShot('s028', { draw(g, t, info) {
  blurLayer(g, 16, (g) => bedroom(g, t, { z: 1.6, x: 0, y: -100 })); veil(g, '#060818', 0.3);
  const cx = E.W / 2, cy = E.H * 0.5, grab = 0.7, k = ease.out(prog(t, 0, grab));
  seg(g, [[cx - 60, cy], [-300, cy + 300]], 130, '#0e0b12'); seg(g, [[cx - 260, cy + 120], [-400, cy + 400]], 180, TU.color); circle(g, cx - 40, cy + 10, 90, '#0e0b12');
  seg(g, [[cx, cy - 20], [cx + 190, cy - 40]], 42, '#0e0b12'); glow(g, cx + 160, cy - 40, 200, '#c9d4ff', 0.25);
  const lx = lerp(E.W + 200, cx + 170, k), ly = cy - 30;
  seg(g, [[lx + 40, ly + 20], [E.W + 300, ly + 200]], 46, '#0e0b12'); circle(g, lx + 20, ly, 40, '#0e0b12');
  for (let i = 0; i < 4; i++) seg(g, [[lx, ly - 20 + i * 12], [lx - (t > grab ? 34 : 50), ly - 40 + i * 18 + (t > grab ? 30 : 0)]], 13, '#0e0b12');
  seg(g, [[lx + 5, ly + 25], [lx - 30, ly + 50]], 13, '#0e0b12');
  g.strokeStyle = '#a9b8ff'; g.lineWidth = 3; g.beginPath(); g.arc(lx + 20, ly, 42, Math.PI * 1.1, Math.PI * 1.8); g.stroke();
  if (t > grab) FX.rings(g, cx + 150, cy - 40, t - grab, { count: 2, r0: 30, r1: 160, color: '#fff3e0', a: 0.4 * (1 - prog(t, grab, grab + 1.2)) });
} });
// s029 — "No te pregunta por el clima."
registerShot('s029', { draw(g, t, info) {
  const cam = { z: lerp(1.5, 1.56, t / info.dur), x: -40, y: 140 }, { GY, M, bed } = bedroom(g, t, cam), b = 1.15;
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: bed.x + 90, y: bed.top + 72 * b * 0.72, s: b, facing: 1, outfit: LEO, pose: breathe(POSES.sit, t, 1, 4), expr: 'sad', look: [0.6, -1], rim: { color: M.rim, dir: [0.4, -1] }, shadow: false, blink: (t % 2.7) > 2.6 });
    drawFigure(g, { x: bed.x + bed.len - 50, y: bed.top + 72 * b * GIANT, s: b * GIANT, facing: -1, outfit: TU, pose: breathe(POSES.sit, t), expr: 'sad', look: [-0.6, 0.6], rim: { color: M.rim, dir: [0.4, -1] }, shadow: false });
  });
  FX.dust(g, t, { count: 30, color: '#c9d4ff', a: 0.3 });
} });
// s030 — "Te pregunta si vas a dejar de crecer."
registerShot('s030', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.8, x: 100, y: -200 })); veil(g, '#060818', 0.35);
  const M = mood('night'), r = V(290, 320) * (1 + 0.04 * t);
  bigFace(g, E.W / 2, E.H * V(0.62, 0.58), r, { outfit: LEO, expr: 'worried', look: [0.3, -0.8], rimColor: M.rim, rimSide: 1, blink: (t % 2.9) > 2.8 });
} });
// s031 — pantalla final
registerShot('s031', { draw(g, t, info) {
  UI.endScreen(g, t, { question: '¿Y tú qué elegirías?', subscribe: 'Suscríbete', cast: CAST });
  const tq = wt('¿Seguir', info, 2.0), tp = wt('parte', info, 9.3);
  text(g, '¿Seguir creciendo o quedarte como estás?', E.W / 2, 450, { size: 40, color: alpha(S().ui.cream, 0.9), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tq - 0.2, tq + 0.3)) });
  if (t > tp - 0.2) UI.badge(g, { str: 'PARTE 3', x: E.W / 2 + 180, y: 1000, a: ease.out(prog(t, tp - 0.2, tp + 0.3)), size: 56 });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.35 });
} });
