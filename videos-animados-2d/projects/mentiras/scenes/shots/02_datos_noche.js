// shots/02_datos_noche.js — planos técnicos (promedio, estudio, regla, moneda, polígrafo), el refrigerador, el congelado y el final.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street, ground } from '../sets/world.js';
import { liarNum, kitchenNight } from '../sets/extra.js';
import { TU, MAMA, CAST } from '../cast.js';
import { wt } from './01_gente.js';

const BY = () => E.H * 0.7;
const bubble = (g, x, y, w, h, a, str = '???', blur = 0) => { g.save(); g.globalAlpha *= a; if (blur) g.filter = `blur(${blur}px)`; rr(g, x - w / 2, y - h / 2, w, h, h / 2); g.fillStyle = 'rgba(240,236,228,.9)'; g.fill(); poly(g, [[x - w * 0.2, y + h / 2 - 2], [x - w * 0.32, y + h / 2 + 18], [x - w * 0.05, y + h / 2 - 2]], 'rgba(240,236,228,.9)'); text(g, str, x, y + 2, { size: h * 0.5, color: '#1a1622', font: FONTS.ui, weight: 900 }); g.filter = 'none'; g.restore(); };

// s005 — "La persona promedio dice una o dos mentiras al día."
registerShot('s005', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, x = E.W / 2 - 160, tn = wt('una', info, 1.3);
  seg(g, [[-E.W, BY()], [E.W * 2, BY()]], 3, alpha(c, 0.6)); UI.lineFigure(g, { x, y: BY(), s: 2.4, color: alpha(c, 0.95), pose: POSES.talk });
  bubble(g, x + 220, BY() - 640, 200, 90, ease.outBack(prog(t, tn, tn + 0.3)), '1'); bubble(g, x + 330, BY() - 800, 200, 90, ease.outBack(prog(t, tn + 0.6, tn + 0.9)), '2');
  text(g, '1–2', E.W / 2, E.H * 0.17, { size: 170, color: ui.gold, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(ui.gold, 0.5), alpha: ease.out(prog(t, tn, tn + 0.4)) });
  text(g, 'MENTIRAS AL DÍA', E.W / 2, E.H * 0.25, { size: 50, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, wt('mentiras', info, 2.3), wt('mentiras', info, 2.3) + 0.3)) });
} });
// s006 — "Lo midió un estudio en 1996."
registerShot('s006', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, ty = wt('1996.', info, 1.2), cx = E.W / 2, cy = E.H * 0.47, k = ease.out(prog(t, 0, 0.4));
  g.save(); g.translate(cx, cy + (1 - k) * 60); g.rotate(-0.04); rr(g, -280, -380, 560, 760, 18); g.fillStyle = '#e8e0cc'; g.fill(); rr(g, -90, -410, 180, 60, 12); g.fillStyle = '#6a6a78'; g.fill();
  text(g, 'ESTUDIO', 0, -290, { size: 60, color: '#1a1622', font: FONTS.title, weight: 700, spacing: 4 }); text(g, 'Diario de mentiras', 0, -230, { size: 30, color: '#5a4a3a', font: FONTS.ui, weight: 800 });
  for (let i = 0; i < 7; i++) { const y = -160 + i * 62; g.fillStyle = 'rgba(60,40,30,.3)'; g.fillRect(-220, y, 300 - (i % 3) * 50, 10); if (t > 0.3 + i * 0.12) { seg(g, [[150, y - 6], [166, y + 10], [196, y - 22]], 6, '#3fb950'); } }
  g.restore();
  const k2 = ease.outBack(prog(t, ty - 0.1, ty + 0.3)); if (k2 > 0) { g.save(); g.translate(cx + 180, cy + 300); g.rotate(-0.12); g.scale(k2, k2); rr(g, -150, -60, 300, 120, 16); g.strokeStyle = ui.accent; g.lineWidth = 8; g.stroke(); text(g, '1996', 0, 4, { size: 80, color: ui.accent, font: FONTS.ui, weight: 900 }); g.restore(); }
} });
// s008 — "Pero hay una regla."  /  s020 — "Pero hay un costo."
function rule(g, t, info, str) {
  const M = mood('void'), GY = ground(); backdrop(g, M.sky); glow(g, E.W / 2, GY - 300, 700, M.rim, 0.12);
  layer(g, { z: 1 + 0.05 * t / info.dur }, 1, (g) => drawFigure(g, { x: E.W / 2, y: GY, s: 2.0, facing: 1, outfit: TU, pose: breathe(POSES.think, t), expr: 'thinking', rim: { color: M.rim, dir: [0, -1] }, dim: true }));
  liarNum(g, E.W / 2 + 10, GY - 520, '?', { size: 44, color: '#cfe0ff', a: 0.7 });
  FX.dust(g, t, { count: 30, color: '#9fb6d8', a: 0.3 }); UI.bigLine(g, t, { str, dur: info.dur, y: E.H * 0.2 });
}
registerShot('s008', { draw(g, t, info) { rule(g, t, info, 'PERO HAY UNA REGLA'); } });
registerShot('s020', { draw(g, t, info) { rule(g, t, info, 'PERO HAY UN COSTO'); } });
// s009 — "Ves cuántas. Nunca cuáles."
registerShot('s009', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, x = E.W / 2, tq = wt('cuántas.', info, 0.4), tc = wt('cuáles.', info, 2.1);
  seg(g, [[-E.W, BY()], [E.W * 2, BY()]], 3, alpha(c, 0.6)); UI.lineFigure(g, { x, y: BY(), s: 2.4, color: alpha(c, 0.95), pose: POSES.talk });
  liarNum(g, x + 8, BY() - 640, 7, { size: 70, pop: prog(t, tq, tq + 0.4), a: ease.out(prog(t, 0, 0.3)) });
  [[-320, -420], [300, -470], [-280, -200], [320, -230]].forEach(([dx, dy], i) => bubble(g, x + dx, BY() + dy, 220, 90, ease.out(prog(t, tc - 0.4 + i * 0.1, tc + i * 0.1)), '???', 5));
  UI.readout(g, { label: 'CUÁNTAS:', value: 'SÍ', x: E.W / 2, y: E.H * 0.13, align: 'center', color: '#7ee08a', a: ease.out(prog(t, tq - 0.1, tq + 0.3)) });
  UI.readout(g, { label: 'CUÁLES:', value: 'NUNCA', x: E.W / 2, y: E.H * 0.2, align: 'center', color: ui.accent, a: ease.out(prog(t, tc - 0.1, tc + 0.3)) });
} });
// s010 — tarjeta de título
registerShot('s010', { draw(g, t, info) {
  const cam = { z: 1.1 - 0.06 * ease.inOut(t / info.dur), y: -40 }, { GY, M } = street(g, t, cam);
  layer(g, cam, 1, (g) => [-380, -220, -60, 120, 280, 430].forEach((dx, i) => { drawFigure(g, { x: E.W / 2 + dx, y: GY + (i % 2) * 30, s: 1.0, facing: i % 2 ? -1 : 1, outfit: i === 2 ? TU : { top: 'none' }, pose: breathe(POSES.stand, t, 1, i), expr: 'neutral', rim: { color: M.rim, dir: [0, -1] } });
    if (i !== 2) liarNum(g, E.W / 2 + dx + 3, GY + (i % 2) * 30 - 300, [4, 11, 0, 2, 9, 1][i], { size: 32, a: 0.9 }); }));
  veil(g, '#0a0614', 0.35);
  UI.titleCard(g, t, { lines: ['¿QUÉ PASARÍA SI VIERAS', 'CUÁNTAS MENTIRAS', 'DICE CADA PERSONA?'], dur: info.dur, y: E.H * 0.26 });
} });
// s017 — "¿Lo raro? Casi nadie detecta mentiras."
registerShot('s017', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui; seg(g, [[-E.W, BY()], [E.W * 2, BY()]], 3, alpha(c, 0.6));
  for (let i = 0; i < 5; i++) { const x = 140 + i * 200; UI.lineFigure(g, { x, y: BY(), s: 1.3, color: alpha(c, 0.9), pose: POSES.think }); const k = ease.outBack(prog(t, 0.3 + i * 0.15, 0.6 + i * 0.15)); if (k > 0) text(g, '?', x + 4, BY() - 380, { size: 90 * k, color: ui.gold, font: FONTS.ui, weight: 900, glow: 12, glowColor: alpha(ui.gold, 0.5) }); }
  text(g, 'CASI NADIE', E.W / 2, E.H * 0.18, { size: 80, color: ui.cream, font: FONTS.title, weight: 700, spacing: 3, alpha: ease.out(prog(t, wt('Casi', info, 1.0), wt('Casi', info, 1.0) + 0.3)) });
  text(g, 'LAS DETECTA', E.W / 2, E.H * 0.24, { size: 80, color: ui.accent, font: FONTS.title, weight: 700, spacing: 3, alpha: ease.out(prog(t, wt('detecta', info, 1.7), wt('detecta', info, 1.7) + 0.3)) });
} });
// s018 — "Acertamos apenas un poco más que tirando una moneda."
registerShot('s018', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), tm = wt('moneda.', info, 2.5), cx = E.W / 2, cy = E.H * 0.3;
  const spin = Math.cos(t * 9), up = Math.sin(clamp(t / 2.2) * Math.PI) * 160;
  g.fillStyle = Math.abs(spin) > 0.1 ? (spin > 0 ? '#ffd47e' : '#c9a23a') : '#8a6a20'; g.beginPath(); g.ellipse(cx, cy - up, 110, 110 * Math.max(0.08, Math.abs(spin)), 0, 0, 7); g.fill(); glow(g, cx, cy - up, 220, ui.gold, 0.3);
  const rows = [['AZAR', 0.5, '50 %', c, tm - 0.2], ['HUMANOS', 0.54, '54 %', ui.gold, 0.3]], x0 = 120, x1 = E.W - 120;
  rows.forEach(([l, v, s, col, at], i) => { const y = E.H * 0.55 + i * 150, p = ease.out(prog(t, at, at + 0.8)); text(g, l, x0, y - 54, { size: 42, color: col, font: FONTS.ui, weight: 900, align: 'left', alpha: clamp(p * 3) });
    rr(g, x0, y - 24, x1 - x0, 48, 24); g.fillStyle = alpha(col, 0.1); g.fill(); if (p > 0) { const w = (x1 - x0) * v * p; rr(g, x0, y - 24, w, 48, 24); g.fillStyle = col; g.fill(); glow(g, x0 + w, y, 70, col, 0.5); }
    text(g, s, x1, y - 54, { size: 48, color: col, font: FONTS.ui, weight: 900, align: 'right', alpha: clamp(p * 3) }); });
} });
// s019 — "¿Y el detector de mentiras? Mide sudor y latidos... no mentiras."
registerShot('s019', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke(), ts = wt('sudor', info, 2.0), tl = wt('latidos...', info, 2.7), tn = wt('no', info, 3.8);
  text(g, 'DETECTOR DE MENTIRAS', E.W / 2, E.H * 0.16, { size: 54, color: ui.cream, font: FONTS.title, weight: 700, spacing: 2, alpha: ease.out(prog(t, 0.2, 0.6)) });
  rr(g, 80, E.H * 0.25, E.W - 160, E.H * 0.42, 24); g.fillStyle = 'rgba(240,236,228,.06)'; g.fill(); g.strokeStyle = alpha(c, 0.5); g.lineWidth = 3; g.stroke();
  const plot = (y0, amp, f, col, at, label) => { const a = ease.out(prog(t, at - 0.2, at + 0.3)); if (a <= 0) return; g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = 4; g.beginPath();
    for (let x = 100; x < E.W - 100; x += 6) { const u = (x - t * 220) * f; const y = y0 + (label === 'LATIDOS' ? Math.pow(Math.max(0, Math.sin(u * 0.06)), 18) * -amp : Math.sin(u * 0.02) * amp * 0.5 + Math.sin(u * 0.051) * amp * 0.3); x === 100 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
    text(g, label, 110, y0 - 70, { size: 34, color: col, font: FONTS.ui, weight: 900, align: 'left' }); g.restore(); };
  plot(E.H * 0.38, 60, 1, ui.gold, ts, 'SUDOR'); plot(E.H * 0.56, 110, 1, ui.accent, tl, 'LATIDOS');
  const k = ease.outBack(prog(t, tn - 0.1, tn + 0.3)); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.78); g.scale(k, k); rr(g, -330, -70, 660, 140, 24); g.fillStyle = alpha(ui.accent, 0.15); g.fill(); g.strokeStyle = ui.accent; g.lineWidth = 6; g.stroke(); text(g, 'NO MIDE MENTIRAS', 0, 4, { size: 58, color: ui.accent, font: FONTS.ui, weight: 900 }); g.restore(); }
} });

// el refrigerador de noche (s026, s027, s031)
const fridgeInner = (note) => (g, x, top, w, h) => { const y = top + 2 * 170 - 6; g.fillStyle = '#f2ece4'; g.beginPath(); g.ellipse(x + w / 2, y, 90, 18, 0, 0, 7); g.fill(); g.fillStyle = '#d9853a'; g.beginPath(); g.ellipse(x + w / 2, y - 8, 56, 14, 0, Math.PI, 0); g.fill(); circle(g, x + w / 2 + 20, y - 14, 10, '#5aa04a');
  if (note) { g.save(); g.translate(x + w / 2 + 40, y - 90); g.rotate(0.08); rr(g, -60, -40, 120, 80, 4); g.fillStyle = '#ffe680'; g.fill(); text(g, 'PARA TI', 0, -8, { size: 22, color: '#1a1622', font: FONTS.ui, weight: 900 }); text(g, '♥', 0, 20, { size: 24, color: '#d64a33', font: FONTS.ui, weight: 900 }); g.restore(); } };
function fridgeScene(g, t, o) {
  const cam = { z: o.z, x: o.x ?? 0, y: o.y ?? -60 }, { GY, M, fridge } = kitchenNight(g, t, cam, { open: o.open, inner: fridgeInner(o.note) });
  if (o.tu !== false) layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - 90, y: GY, s: 1.6, facing: 1, outfit: TU, pose: breathe(o.pose || POSES.reach, t), expr: o.expr || 'neutral', look: [0.8, 0], rim: { color: '#dfe9ff', dir: [1, -0.3], w: 5 * Math.max(0.2, o.open) } }));
  FX.dust(g, t, { count: 30, color: '#dfe9ff', a: 0.25 * (0.3 + o.open) });
}
// s026 — "Una noche abres el refrigerador."
registerShot('s026', { draw(g, t, info) { fridgeScene(g, t, { z: lerp(1.3, 1.4, t / info.dur), open: ease.inOut(prog(t, 0.4, 1.4)), expr: 'neutral' }); } });
// s027 — "Solo hay comida para uno. Para ti."
registerShot('s027', { draw(g, t, info) { fridgeScene(g, t, { z: lerp(2.6, 2.8, t / info.dur), x: 230, y: -60, open: 1, note: t > wt('Para', info, 1.8) - 0.2, tu: false }); } });
// s031 — "Cierras el refrigerador."
registerShot('s031', { draw(g, t, info) { fridgeScene(g, t, { z: lerp(1.4, 1.34, t / info.dur), open: 1 - ease.inOut(prog(t, 0.2, 0.7)), expr: 'determined', pose: POSES.stand }); } });
// s028 — "Su plato... nunca se ensucia."
registerShot('s028', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchenNight(g, t, { z: 1.6, x: -300, y: -200 }, { open: 0.6 })); veil(g, '#060818', 0.3);
  const ui = S().ui, y = E.H * 0.46, tn = wt('nunca', info, 0.7);
  seg(g, [[120, y + 230], [E.W - 120, y + 230]], 12, '#5a6070'); for (let i = 0; i < 9; i++) seg(g, [[160 + i * 100, y + 230], [160 + i * 100, y + 60]], 5, '#5a6070');
  const plate = (x, dirty) => { g.save(); g.translate(x, y); g.rotate(dirty ? -0.06 : 0.06); g.fillStyle = '#f2ece4'; g.beginPath(); g.ellipse(0, 0, 60, 220, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(160,150,140,.5)'; g.lineWidth = 4; g.beginPath(); g.ellipse(0, 0, 40, 160, 0, 0, 7); g.stroke();
    if (dirty) for (const [dx, dy, r] of [[-10, -60, 22], [14, 30, 16], [-6, 110, 12]]) circle(g, dx, dy, r, 'rgba(160,90,40,.6)'); g.restore(); };
  plate(E.W * 0.32, true); plate(E.W * 0.66, false);
  if (t > tn) { glow(g, E.W * 0.66, y, 280, '#ffffff', 0.3 * prog(t, tn, tn + 0.5)); for (let i = 0; i < 3; i++) FX.sparkle(g, E.W * 0.66 + (i - 1) * 40, y - 150 + i * 120, 26, '#ffffff', 0.9); }
  text(g, 'TU PLATO', E.W * 0.32, y + 300, { size: 40, color: ui.cream, font: FONTS.ui, weight: 900 }); text(g, 'SU PLATO', E.W * 0.66, y + 300, { size: 40, color: '#ff9ac8', font: FONTS.ui, weight: 900 });
} });
// s029 — "Podrías enfrentarla. Decirle mentirosa."
registerShot('s029', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchenNight(g, t, { z: 1.7, x: 200, y: -400 }, { open: 0.4 })); veil(g, '#060818', 0.3);
  const tm = wt('mentirosa.', info, 2.1), r = V(300, 320) * (1 + 0.04 * t), [sx, sy] = t > tm ? shake(t, 6, 6) : [0, 0];
  bigFace(g, E.W / 2, E.H * 0.62, r, { outfit: TU, expr: t < tm + 0.6 ? 'angry' : 'sad', look: [0.3, 0], rimColor: '#dfe9ff', rimSide: 1 });
  const k = ease.outBack(prog(t, tm - 0.1, tm + 0.25)) * (1 - prog(t, tm + 0.8, info.dur)); if (k > 0) { g.save(); g.translate(E.W / 2 + sx, E.H * 0.2 + sy); g.scale(k, k); rr(g, -280, -70, 560, 140, 70); g.fillStyle = alpha(S().ui.accent, 0.9); g.fill(); text(g, '¡MENTIROSA!', 0, 4, { size: 66, color: '#fff3e0', font: FONTS.title, weight: 700 }); g.restore(); }
} });
// s030 — CONGELADO: "La verdad... o tu mamá."
registerShot('s030', { draw(g, t, info) {
  const M = mood('void'), GY = ground(), ui = S().ui, tm = wt('mamá.', info, 1.45); backdrop(g, M.sky); glow(g, E.W / 2, GY - 400, 700, M.rim, 0.15);
  drawFigure(g, { x: E.W / 2, y: GY, s: 1.9, facing: t < tm ? -1 : 1, outfit: TU, pose: breathe(POSES.stand, t * 0.3), expr: 'worried', look: t < tm ? [-1, -0.3] : [1, -0.3], rim: { color: M.rim, dir: [0, -1] } });
  const y = E.H * 0.27, a1 = ease.outBack(prog(t, 0.1, 0.5)), a2 = ease.outBack(prog(t, tm - 0.1, tm + 0.3));
  liarNum(g, E.W * 0.25, y, 341, { size: 60, a: clamp(a1), color: '#ff9ac8' }); text(g, 'LA VERDAD', E.W * 0.25, y + 120, { size: 44, color: ui.cream, font: FONTS.ui, weight: 900, alpha: clamp(a1) });
  if (a2 > 0) { drawFigure(g, { x: E.W * 0.76, y: y + 60, s: 0.75, facing: -1, outfit: MAMA, pose: POSES.relaxed, expr: 'smile', rim: { color: '#ff9ac8', dir: [0, -1] }, alpha: clamp(a2), shadow: false }); glow(g, E.W * 0.76, y - 30, 200, '#ff9ac8', 0.35 * a2);
    text(g, 'TU MAMÁ', E.W * 0.76, y + 120, { size: 44, color: '#ff9ac8', font: FONTS.ui, weight: 900, alpha: clamp(a2) }); }
  FX.drops(g, t, { count: 50, color: '#d8e4ff', rMax: 9, drift: 3 });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  FX.rings(g, E.W / 2, E.H * 0.5, t, { count: 3, r0: 120, r1: 520, speed: 0.35, color: '#e8f0ff', a: 0.3 });
} });
// s039 — pantalla final
registerShot('s039', { draw(g, t, info) {
  UI.endScreen(g, t, { question: '¿Y tú qué harías con este poder?', subscribe: 'Suscríbete', cast: CAST });
  const tc = wt('Cuéntanos', info, 2.2), tp = wt('Parte', info, 8.7);
  text(g, '¿Cuál es el número de tu mejor amigo?', E.W / 2, 450, { size: 38, color: alpha(S().ui.cream, 0.9), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, tc - 0.2, tc + 0.3)) });
  if (t > tp - 0.2) UI.badge(g, { str: 'PARTE 2', x: E.W / 2 + 180, y: 1000, a: ease.out(prog(t, tp - 0.2, tp + 0.3)), size: 56 });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.35 });
} });
