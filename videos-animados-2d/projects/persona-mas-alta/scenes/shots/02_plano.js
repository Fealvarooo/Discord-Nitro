// shots/02_plano.js — planos técnicos: alturas, récord, rodillas, peso, corazón, la regla y el título.
import { E, V, S, registerShot, mood, layer, backdrop, ease, prog, clamp, lerp, wordTime, seg, circle, ring, rr, poly, glow, alpha, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { ground } from '../sets/world.js';
import { TU, GIANT } from '../cast.js';

const BY = () => E.H * V(0.8, 0.72), PM = () => V(250, 356);          // suelo y píxeles por metro del plano
const fs = (m) => (m * PM()) / 230;                                    // escala de lineFigure para una altura en metros
const wt = (w, info, fb) => (wordTime(w, info.shot.start - 0.05) ?? info.shot.start + fb) - info.shot.start;
const floorLine = (g) => { const c = UI.bpStroke(); seg(g, [[-E.W, BY()], [E.W * 2, BY()]], 3, alpha(c, 0.7)); for (let x = 0; x < E.W; x += 40) seg(g, [[x, BY()], [x - 18, BY() + 18]], 2, alpha(c, 0.35)); };
function heightLine(g, t, x, m, str, color, start) { UI.dimension(g, t, { x1: x, y1: BY(), x2: x, y2: BY() - m * PM(), str, color, start }); }

// s004 — "La persona promedio mide alrededor de un metro setenta."
registerShot('s004', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(); floorLine(g);
  const k = ease.outBack(prog(t, 0.1, 0.7)), x = E.W * 0.55;
  g.save(); g.translate(x, BY()); g.scale(k, k); g.translate(-x, -BY()); UI.lineFigure(g, { x, y: BY(), s: fs(1.7), color: alpha(c, 0.95) }); g.restore();
  heightLine(g, t, x - V(170, 200), 1.7, '1,70 m', S().ui.cream, wt('metro', info, 2.2) - 0.3);
  text(g, 'PERSONA PROMEDIO', x, BY() + V(70, 90), { size: V(34, 40), color: alpha(c, 0.9), font: FONTS.ui, weight: 900, spacing: 2, alpha: ease.out(prog(t, 0.5, 1)) });
} });

// tú (gigante) junto a la persona promedio
function pair(g, t, info, o = {}) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold; floorLine(g);
  const xn = E.W * V(0.36, 0.3), xg = E.W * V(0.6, 0.68), kg = o.grow ?? 1;
  UI.lineFigure(g, { x: xn, y: BY(), s: fs(1.7), color: alpha(c, 0.75) });
  g.save(); g.translate(xg, BY()); g.scale(kg, kg); g.translate(-xg, -BY()); UI.lineFigure(g, { x: xg, y: BY(), s: fs(2.75), color: gold }); g.restore();
  if (kg > 0.9) glow(g, xg, BY() - 2.75 * PM() + 40, 160, gold, 0.18 * kg);
  return { xn, xg };
}
// s006 — "Dos metros setenta y cinco."
registerShot('s006', { draw(g, t, info) {
  const t0 = wt('Dos', info, 0.2), grow = ease.outBack(prog(t, t0, t0 + 0.7));
  const { xn, xg } = pair(g, t, info, { grow });
  heightLine(g, t, xn - V(140, 130), 1.7, '1,70 m', alpha(S().ui.cream, 0.7), 0);
  heightLine(g, t, xg + V(170, 150), 2.75, '2,75 m', S().ui.gold, wt('cinco', info, 1.4) - 0.5);
  text(g, 'TÚ', xg, BY() + V(70, 90), { size: V(44, 52), color: S().ui.gold, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(S().ui.gold, 0.6), alpha: ease.out(prog(t, t0 + 0.3, t0 + 0.7)) });
} });
// s007 — "Más que el récord histórico. Dos metros setenta y dos."  acercamiento a las cabezas
registerShot('s007', { draw(g, t, info) {
  const z = lerp(1, V(1.8, 1.7), ease.inOut(prog(t, 0.2, 1.6))), gold = S().ui.gold, acc = S().ui.accent;
  const fx = E.W * V(0.6, 0.68), fy = BY() - 2.73 * PM();
  g.save(); g.translate(E.W / 2, E.H * 0.45); g.scale(z, z); g.translate(-fx, -fy);
  const { xg } = pair(g, t, info);
  const ry = BY() - 2.72 * PM(), on = ease.out(prog(t, wt('récord', info, 0.7) - 0.1, wt('récord', info, 0.7) + 0.5));
  g.setLineDash([14, 10]); seg(g, [[xg - 360 * on, ry], [xg + 360 * on, ry]], 3 / z * 1.6, acc); g.setLineDash([]);
  g.restore();
  const tR = wt('Dos', info, 2.1);
  UI.readout(g, { label: 'RÉCORD:', value: '2,72 m', x: E.W / 2, y: E.H * V(0.14, 0.13), align: 'center', color: acc, a: on });
  UI.readout(g, { label: 'TÚ:', value: '2,75 m', x: E.W / 2, y: E.H * V(0.22, 0.19), align: 'center', color: gold, a: ease.out(prog(t, 0.4, 0.8)) });
  if (t > tR) UI.badge(g, { str: '+3 cm', a: ease.out(prog(t, tR, tR + 0.4)), color: gold });
} });

// s008 — "Pero hay una regla."
registerShot('s008', { draw(g, t, info) {
  const M = mood('void'), GY = ground(), cam = { z: 1 + 0.05 * t / info.dur };
  layer(g, cam, 0.2, (g) => { backdrop(g, M.sky); glow(g, E.W / 2, GY - 300, 700, M.rim, 0.12); });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2, y: GY, s: V(1.9, 2.1), facing: 1, outfit: TU, pose: breathe(POSES.crossArms, t), expr: 'determined', rim: { color: M.rim, dir: [0, -1] }, dim: true }));
  FX.dust(g, t, { count: 30, color: '#9fb6d8', a: 0.3 });
  UI.bigLine(g, t, { str: 'PERO HAY UNA REGLA', dur: info.dur, y: E.H * V(0.22, 0.2) });
} });

// s009 — "Tu cuerpo creció. Tus rodillas, no."
registerShot('s009', { draw(g, t, info) {
  UI.blueprint(g); floorLine(g); const c = UI.bpStroke(), acc = S().ui.accent;
  const tg = wt('cuerpo', info, 0.2), tk = wt('rodillas', info, 1.7);
  const m = lerp(1.7, 2.75, ease.inOut(prog(t, tg, tg + 1.1))), s = fs(m), x = E.W / 2;
  UI.lineFigure(g, { x, y: BY(), s, color: alpha(c, 0.95) });
  const p = POSES.stand;
  for (const kk of [p.kF, p.kB]) { const kx = x + kk[0] * s, ky = BY() + kk[1] * s; const pulse = t > tk ? 1 + 0.15 * Math.sin((t - tk) * 10) : 1;
    ring(g, kx, ky, 26 * pulse, 6, t > tk ? acc : alpha(c, 0.9)); if (t > tk) glow(g, kx, ky, 90, acc, 0.5); }
  const kx = x + p.kF[0] * s, ky = BY() + p.kF[1] * s;
  UI.callout(g, t, { at: [kx + 30, ky], to: [kx + V(260, 220), ky - 140], str: 'RODILLAS', color: acc, start: tk });
  UI.callout(g, t, { at: [x + 30, BY() - m * PM() * 0.6], to: [x + V(260, 220), BY() - m * PM() * 0.75], str: 'CUERPO', color: S().ui.gold, start: tg + 0.2 });
  if (t > tk + 0.7) text(g, 'MISMO TAMAÑO', kx - V(0, 30), ky + V(110, 130), { size: V(30, 36), color: acc, font: FONTS.ui, weight: 900, spacing: 2, alpha: ease.out(prog(t, tk + 0.7, tk + 1.1)), align: 'center' });
} });

// s010 — "Tu peso crece más rápido que tus huesos."
registerShot('s010', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, c = UI.bpStroke();
  const rows = [{ l: 'ALTURA', v: 1.62, s: '×1,6', col: c, at: 0.1 }, { l: 'HUESOS', v: 2.62, s: '×2,6', col: ui.cream, at: wt('huesos', info, 2.3) - 0.3 }, { l: 'PESO', v: 4.25, s: '×4,3', col: ui.accent, at: wt('peso', info, 0.3) }];
  text(g, 'SI MIDES 1,6 VECES MÁS', E.W / 2, E.H * V(0.2, 0.26), { size: V(44, 50), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 2, glow: 14, glowColor: alpha(ui.gold, 0.5), alpha: ease.out(prog(t, 0, 0.4)) });
  const x0 = V(380, 120), x1 = E.W - V(320, 120), y0 = E.H * V(0.38, 0.38), gap = V(160, 200);
  rows.forEach((r, i) => { const y = y0 + i * gap, p = ease.out(prog(t, r.at, r.at + 0.9)), w = (x1 - x0) * (r.v / 4.6) * p;
    text(g, r.l, x0, y - V(50, 58), { size: V(36, 42), color: r.col, font: FONTS.ui, weight: 900, align: 'left', spacing: 2, alpha: clamp(p * 3) });
    rr(g, x0, y - 24, x1 - x0, 48, 24); g.fillStyle = alpha(r.col, 0.08); g.fill();
    if (p > 0) { rr(g, x0, y - 24, Math.max(48, w), 48, 24); g.fillStyle = r.col; g.fill(); glow(g, x0 + w, y, 70, r.col, 0.5); }
    text(g, r.s, x1, y - V(50, 58), { size: V(44, 52), color: r.col, font: FONTS.ui, weight: 900, align: 'right', alpha: clamp(p * 3), glow: 12, glowColor: alpha(r.col, 0.5) }); });
} });

// s011 — tarjeta de título sobre la ciudad al atardecer
registerShot('s011', { draw(g, t, info) {
  const M = mood('dusk'), GY = ground(), cam = { z: 1.08 - 0.06 * ease.inOut(t / info.dur), y: 10 * t };
  layer(g, cam, 0.15, (g) => { backdrop(g, M.sky, [-E.W, -E.H, E.W * 3, E.H * 3]); FX.sun(g, E.W / 2, GY - V(260, 380), V(90, 110), '#fff3dc', M.key, 5); FX.godRays(g, E.W / 2, GY - V(260, 380), { count: 14, angle: -Math.PI / 2, spread: Math.PI * 1.6, len: 1800, a: 0.06, t }); });
  layer(g, cam, 0.5, (g) => FX.skyline(g, { x: -300, y: GY - 120, w: E.W + 600, minH: 120, maxH: V(300, 520), color: '#2a1f36', windowColor: alpha(M.practical, 0.8), seed: 21 }));
  layer(g, cam, 0.85, (g) => { g.fillStyle = '#16111e'; g.fillRect(-E.W, GY, E.W * 3, E.H); });
  layer(g, cam, 1, (g) => {
    const b = V(0.8, 0.95), rim = { color: M.rim, dir: [0, -1] };
    drawFigure(g, { x: E.W / 2 - V(40, 30), y: GY, s: b * GIANT, facing: 1, outfit: TU, pose: breathe(POSES.relaxed, t), expr: 'smile', rim });
    [[-260, 1], [-150, 1], [170, -1], [280, -1]].forEach(([dx, f], i) => drawFigure(g, { x: E.W / 2 + dx * V(1.3, 1), y: GY, s: b, facing: f, outfit: { top: 'none' }, pose: breathe(POSES.stand, t, 1, i + 2), expr: 'surprised', look: [f * 0.3, -0.9], rim }));
  });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.4 });
  UI.titleCard(g, t, { lines: ['¿QUÉ PASARÍA SI FUERAS', 'LA PERSONA', 'MÁS ALTA DEL MUNDO?'], dur: info.dur, y: E.H * V(0.3, 0.24) });
} });

// s018 — "Tu corazón empuja sangre mucho más arriba."
function heart(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.moveTo(x, y + r * 0.9); g.bezierCurveTo(x - r * 1.4, y - r * 0.1, x - r * 0.7, y - r * 1.1, x, y - r * 0.4); g.bezierCurveTo(x + r * 0.7, y - r * 1.1, x + r * 1.4, y - r * 0.1, x, y + r * 0.9); g.fill(); }
registerShot('s018', { draw(g, t, info) {
  UI.blueprint(g); floorLine(g); const c = UI.bpStroke(), acc = S().ui.accent, gold = S().ui.gold;
  const s = fs(2.75), x = E.W * V(0.45, 0.42), p = POSES.stand;
  UI.lineFigure(g, { x, y: BY(), s, color: alpha(c, 0.9) });
  const hx = x + 4 * s, hy = BY() - 160 * s, headY = BY() + p.head[1] * s;
  const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 1.2)), 6), tb = wt('sangre', info, 1.0);
  heart(g, hx, hy, 26 * (1 + 0.25 * beat), acc); glow(g, hx, hy, 120, acc, 0.35 + 0.4 * beat);
  const pr = ease.inOut(prog(t, tb, tb + 1.2));
  g.setLineDash([10, 10]); seg(g, [[hx, hy - 30], [hx, lerp(hy - 30, headY + 30, pr)]], 4, alpha(acc, 0.8)); g.setLineDash([]);
  for (let i = 0; i < 4; i++) { const u = ((t - tb) * 0.6 + i / 4) % 1; if (t > tb + 0.3) { const yy = lerp(hy - 30, headY + 30, u * pr); circle(g, hx, yy, 7, acc); glow(g, hx, yy, 30, acc, 0.6); } }
  if (pr > 0.9) poly(g, [[hx, headY + 10], [hx - 16, headY + 36], [hx + 16, headY + 36]], acc);
  UI.callout(g, t, { at: [hx + 30, hy], to: [hx + V(300, 240), hy + 60], str: 'CORAZÓN', color: acc, start: wt('corazón', info, 0.3) });
  if (pr > 0.5) text(g, 'MÁS ARRIBA', hx + V(40, 40), (hy + headY) / 2 - 40, { size: V(34, 40), color: gold, font: FONTS.ui, weight: 900, align: 'left', alpha: clamp((pr - 0.5) * 3), glow: 12, glowColor: alpha(gold, 0.5), spacing: 2 });
} });
