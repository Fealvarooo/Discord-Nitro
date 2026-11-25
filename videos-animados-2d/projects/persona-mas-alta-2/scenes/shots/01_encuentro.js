// shots/01_encuentro.js — Tomás aparece, su pasado, Leo y el clima, el papel (s001–s003, s006–s014, s022–s024).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, talkAmount, seg, circle, rr, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { fair, fogSet, court, ground, PERSON } from '../sets/world.js';
import { stairs } from '../sets/stairs.js';
import { TU, LEO, TOMAS, GIANT, TOMAS_S } from '../cast.js';

export const wt = (w, info, fb) => (wordTime(w, info.shot.start - 0.05) ?? info.shot.start + fb) - info.shot.start;
export const GOLD = '#f2c21a';
export const CANES = { head: [12, -204], sh: [6, -172], hip: [0, -100], eF: [20, -136], hF: [32, -106], eB: [2, -138], hB: [14, -106], kF: [6, -50], fF: [3, 0], kB: [-6, -50], fB: [-11, 0] };
const rimN = (M) => ({ color: M.rim, dir: [0.3, -1] });
// Tomás con sus dos bastones (y la bufanda dorada si sonríe)
export function tomas(g, o) {
  const { x, y, s, f = -1, pose = CANES, M, expr = 'neutral', talk = 0, scarf = 0, look = [0, 0] } = o, gy = o.gy ?? y;
  for (const h of [pose.hB, pose.hF]) seg(g, [[x + f * h[0] * s, y + h[1] * s], [x + f * (h[0] + 8) * s, gy]], 5 * s, '#1a1420');
  drawFigure(g, { x, y, s, facing: f, outfit: TOMAS, pose, expr, talk, look, rim: { color: M.rim, dir: [-f * 0.4, -1] }, blink: (o.t % 3.7) > 3.6 });
  if (scarf > 0) { const nx = x + f * pose.sh[0] * s, ny = y + pose.sh[1] * s; g.save(); g.globalAlpha *= scarf; seg(g, [[nx - 16 * s, ny - 4 * s], [nx + 16 * s, ny - 4 * s]], 9 * s, GOLD); seg(g, [[nx + f * 8 * s, ny], [nx + f * 12 * s, ny + 34 * s]], 7 * s, GOLD); glow(g, nx, ny, 60 * s, GOLD, 0.35 * scarf); g.restore(); }
}

// s001 — "Una sombra tapa la luna."
registerShot('s001', { draw(g, t, info) {
  const M = mood('storm'), cam = { z: 1.04 + 0.03 * t, y: -60 };
  fogSet(g, t, cam);
  const mx = E.W / 2, my = E.H * 0.3, k = ease.inOut(prog(t, 0.1, 1.5)), s = 4.2;
  glow(g, mx, my, 520, '#dfe6ff', 0.35 * (1 - 0.6 * k)); circle(g, mx, my, 100, '#e8ecff');
  const x = lerp(E.W + 260, mx - 12 * s, k);
  drawFigure(g, { x, y: my + 208 * s, s, facing: -1, outfit: TOMAS, pose: CANES, expr: 'neutral', rim: { color: '#dfe6ff', dir: [0, -1], w: 3 }, shadow: false });
  FX.fog(g, E.H * 0.55, 500, M.sky[2], 0.5); FX.rain(g, t, { count: 90, a: 0.12 });
} });
// s002 — "Tienes que mirar hacia arriba."
registerShot('s002', { draw(g, t, info) {
  blurLayer(g, 14, (g) => fogSet(g, t, { z: 1.5, y: -400 })); veil(g, '#060818', 0.35);
  const M = mood('storm'), r = V(300, 330) * (1 + 0.04 * t);
  bigFace(g, E.W / 2, E.H * V(0.62, 0.58), r, { outfit: TU, expr: t < 0.4 ? 'surprised' : 'awe', look: [0.1, -1], rimColor: M.rim, rimSide: 1 });
} });
// s003 — "Por primera vez en tu vida."  contrapicado: tú y Tomás
registerShot('s003', { draw(g, t, info) {
  const cam = { z: lerp(1.28, 1.2, ease.inOut(t / info.dur)), y: -150, r: 0.02 }, { GY, M } = fogSet(g, t, cam), b = 1.15;
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 - 190, y: GY, s: b * GIANT, facing: 1, outfit: TU, pose: breathe(POSES.stand, t), expr: 'awe', look: [0.6, -1], rim: rimN(M) });
    tomas(g, { x: E.W / 2 + 170, y: GY, s: b * TOMAS_S, M, t, look: [-0.3, 0.5] });
  });
  FX.fog(g, E.H * 0.6, 400, M.sky[2], 0.3); FX.rain(g, t, { count: 90, a: 0.12 });
} });

// s006 — "Gabardina, sombrero y un bastón en cada mano."  la cámara sube
registerShot('s006', { draw(g, t, info) {
  const GY = ground(), s = 1.3 * TOMAS_S, x = E.W / 2 + 40, up = ease.inOut(prog(t, 0, info.dur));
  const cam = { z: 1.75, x: x - E.W / 2 - 130, y: lerp(GY - 140, GY - 470, up) - E.H / 2 };
  const { M } = fair(g, t, cam);
  layer(g, cam, 1, (g) => {
    tomas(g, { x, y: GY, s, M, t, look: [-0.4, 0.2] });
    const c = S().ui.cream;
    UI.callout(g, t, { at: [x + 20, GY - 120 * s], to: [x - 150, GY - 140 * s], str: 'GABARDINA', color: c, start: wt('Gabardina,', info, 0.15) });
    UI.callout(g, t, { at: [x - 10, GY - 228 * s], to: [x - 140, GY - 262 * s], str: 'SOMBRERO', color: c, start: wt('sombrero', info, 1.0) });
    UI.callout(g, t, { at: [x - 30 * s, GY - 60 * s], to: [x - 160, GY - 20 * s], str: 'BASTÓN ×2', color: S().ui.gold, start: wt('bastón', info, 2.0) });
  });
  FX.dust(g, t, { count: 30, color: '#ffd47e', a: 0.3 });
} });
// s007 — "Te vi levantar a tu hermano", dice.
registerShot('s007', { draw(g, t, info) {
  blurLayer(g, 14, (g) => fair(g, t, { z: 1.6, x: 200, y: -700 })); veil(g, '#060818', 0.3);
  const M = mood('night'), r = V(290, 320) * (1 + 0.03 * t), cx = E.W / 2 + V(60, 0), cy = E.H * V(0.62, 0.57);
  const talk = talkAmount(info.globalT, 14.76, 16.2);
  bigFace(g, cx, cy, r, { outfit: TOMAS, expr: 'neutral', talk, look: [-0.3, 0.4], rimColor: M.rim, rimSide: 1, blink: (t % 3.7) > 3.6 });
  if (talk > 0) FX.rings(g, cx, cy, t, { count: 3, r0: r * 1.1, r1: r * 1.6, color: '#e8f0ff', a: 0.3 });
} });
// s008 — "Yo elegí el contrato."  el contrato viejo
registerShot('s008', { draw(g, t, info) {
  blurLayer(g, 16, (g) => fair(g, t, { z: 1.8, x: -200, y: -500 })); veil(g, '#060818', 0.4);
  const ui = S().ui, k = ease.out(prog(t, 0, 0.6)), cx = E.W / 2, cy = E.H * 0.46 + (1 - k) * 80;
  g.save(); g.translate(cx, cy); g.rotate(-0.08 + 0.02 * Math.sin(t)); const w = 560, h = 720;
  g.fillStyle = '#e8dcc0'; g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2 - 20, -h / 2 + 10); g.lineTo(w / 2, h / 2); g.lineTo(-w / 2 + 14, h / 2 - 8); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(120,90,50,.35)'; g.lineWidth = 2; for (const [a, b] of [[[-w / 2, -60], [w / 2, -100]], [[-w / 2 + 40, 140], [w / 2, 90]], [[-60, -h / 2], [10, h / 2]]]) { g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
  text(g, 'CONTRATO', 0, -h / 2 + 90, { size: 64, color: '#2a1c14', font: FONTS.title, weight: 700, spacing: 4 });
  for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(60,40,30,.35)'; g.fillRect(-w / 2 + 60, -h / 2 + 170 + i * 40, w - 120 - (i % 3) * 60, 10); }
  g.strokeStyle = '#1a2a6a'; g.lineWidth = 5; g.beginPath(); g.moveTo(-120, h / 2 - 110); for (let i = 0; i <= 20; i++) g.lineTo(-120 + i * 12, h / 2 - 110 - Math.sin(i * 1.3) * 22 - (i % 4) * 4); g.stroke();
  text(g, 'TOMÁS', 110, h / 2 - 60, { size: 28, color: '#2a1c14', font: FONTS.ui, weight: 900 });
  g.restore();
  seg(g, [[E.W + 100, E.H * 0.78], [cx + 230, cy + 260]], 90, '#0e0b12'); seg(g, [[E.W + 100, E.H * 0.86], [cx + 320, cy + 330]], 120, shade(TOMAS.color, 0.15));
  glow(g, cx, cy, 600, '#ffd47e', 0.12); FX.rings(g, cx, E.H * 0.12, t, { count: 2, r0: 40, r1: 160, color: '#e8f0ff', a: 0.25 * clamp(talkAmount(info.globalT, 17.22, 18.46) * 3) });
} });
// s009 — "Hace veinte años era el mejor jugador del mundo."  recuerdo dorado
registerShot('s009', { draw(g, t, info) {
  const cam = { z: lerp(1.15, 1.22, t / info.dur), x: 60, y: -60 }, { GY, M, rim } = court(g, t, cam, { mood: 'golden', b: 1.2 });
  const s = 1.2 * TOMAS_S, x = E.W / 2 + 60, jump = Math.max(0, Math.sin(Math.min(t, 1.4) / 1.4 * Math.PI)) * 120;
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x, y: GY - jump, s, facing: 1, outfit: { top: 'jersey', color: GOLD, number: 1, head: 'none' }, pose: posesAt(t, [[0, POSES.ready], [0.4, POSES.cheer]]), expr: 'joy', rim: { color: M.rim, dir: [-0.6, -0.8] }, shadow: jump < 20 });
  });
  blurLayer(g, 8, (g) => FX.crowd(g, t, { x: -60, y: E.H * 0.86, w: E.W + 120, rows: 3, rowH: 60, size: 4, color: '#2a1a1a', cheer: 1, flags: 0.05 }), cam, 1.6);
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,190,90,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  UI.badge(g, { str: 'HACE 20 AÑOS', x: E.W / 2 + V(200, 240), y: E.H * V(0.1, 0.12), a: ease.out(prog(t, 0.2, 0.6)) });
  FX.dust(g, t, { count: 40, color: '#ffe2b0', a: 0.4 });
} });
// s010 — "Hoy no puede subir una escalera."
registerShot('s010', { draw(g, t, info) {
  const cam = { z: lerp(1.3, 1.36, t / info.dur), x: 60, y: -80 }, { GY, M } = stairs(g, t, cam), s = 1.15 * TOMAS_S, x = E.W / 2 - 170;
  const lift = Math.max(0, Math.sin(prog(t, 0.9, 1.9) * Math.PI)) * 0.6;
  layer(g, cam, 1, (g) => tomas(g, { x, y: GY, s, f: 1, M, t, expr: 'sad', look: [0.8, -0.6], pose: { ...CANES, kF: [16, -56 - 20 * lift], fF: [18, -10 - 34 * lift] } }));
  FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.25 });
} });

// la feria con los tres (s011, s014)
function trio(g, t, o) {
  const cam = { z: o.z ?? 1.15, x: o.cx ?? 0, y: o.cy ?? -120 }, { GY, M } = fair(g, t, cam), b = o.b ?? 1.15;
  layer(g, cam, 1, (g) => {
    if (!o.noTu) drawFigure(g, { x: E.W / 2 - 280, y: GY, s: b * GIANT, facing: 1, outfit: TU, pose: breathe(POSES.stand, t), expr: o.tuExpr || 'smile', look: [0.6, 0.3], rim: rimN(M) });
    drawFigure(g, { x: o.lx ?? E.W / 2 - 50, y: GY, s: b, facing: 1, outfit: LEO, pose: breathe(o.leoPose || POSES.stand, t, 1, 4), expr: o.leoExpr || 'happy', look: [0.6, -1], rim: rimN(M), blink: (t % 2.7) > 2.6 });
    tomas(g, { x: o.tx ?? E.W / 2 + 220, y: GY, s: b * TOMAS_S, M, t, pose: o.tPose || CANES, expr: o.tExpr || 'neutral', talk: o.talk || 0, scarf: o.scarf || 0, look: o.tLook || [-0.4, 0.6] });
  });
  FX.dust(g, t, { count: 30, color: '#ffd47e', a: 0.3 });
  return { GY, M };
}
// s011 — "Leo le pregunta lo de siempre."
registerShot('s011', { draw(g, t, info) { trio(g, t, { z: lerp(1.12, 1.2, t / info.dur), leoPose: posesAt(t, [[0, POSES.stand], [0.6, POSES.pointUp]]) }); } });
// s012 — "¿Cómo está el clima allá arriba?"  Leo pregunta
registerShot('s012', { draw(g, t, info) {
  blurLayer(g, 14, (g) => fair(g, t, { z: 1.6, x: -200, y: -500 })); veil(g, '#060818', 0.25);
  const M = mood('night'), r = V(290, 320) * (1 + 0.03 * t), cx = E.W / 2 - V(60, 0), cy = E.H * V(0.62, 0.58);
  const talk = talkAmount(info.globalT, 27.0, 28.12);
  bigFace(g, cx, cy, r, { outfit: LEO, expr: 'happy', talk, look: [0.4, -0.9], rimColor: M.practical, rimSide: 1, blink: (t % 2.9) > 2.8 });
  if (talk > 0) FX.rings(g, cx, cy, t, { count: 3, r0: r * 1.1, r1: r * 1.6, color: '#fff3e0', a: 0.35 });
} });
// s013 — "Él sonríe por primera vez."
registerShot('s013', { draw(g, t, info) {
  blurLayer(g, 14, (g) => fair(g, t, { z: 1.6, x: 260, y: -700 })); veil(g, '#060818', 0.3);
  const M = mood('night'), r = V(290, 320) * (1 + 0.04 * t), cx = E.W / 2 + V(60, 0), cy = E.H * V(0.62, 0.57), ts = wt('sonríe', info, 0.8);
  const sc = ease.out(prog(t, ts, ts + 0.8));
  g.save(); g.globalAlpha *= sc; rr(g, cx - r * 0.75, cy + r * 0.86, r * 1.5, r * 0.22, r * 0.1); g.fillStyle = GOLD; g.fill(); glow(g, cx, cy + r * 0.95, r * 1.2, GOLD, 0.35); g.restore();
  bigFace(g, cx, cy, r, { outfit: TOMAS, expr: t < ts ? 'neutral' : 'smile', look: [-0.3, 0.6], rimColor: t < ts ? M.rim : '#ffd47e', rimSide: -1, blink: (t % 3.7) > 3.6 });
  FX.dust(g, t, { count: 40, color: '#ffd47e', a: 0.3 * sc });
} });
// s014 — "Nublado, pequeño."  Tomás se inclina hacia Leo
registerShot('s014', { draw(g, t, info) {
  const BOW = { ...CANES, head: [34, -190], sh: [20, -164] };
  trio(g, t, { z: lerp(1.45, 1.52, t / info.dur), cx: 80, cy: -40, noTu: true, lx: E.W / 2 - 60, tx: E.W / 2 + 200, tPose: posesAt(t, [[0, CANES], [0.3, BOW]]), tExpr: 'smile', scarf: 1, talk: talkAmount(info.globalT, 31.04, 32.14), leoExpr: 'joy' });
} });

// s022 — "Por eso te buscó. Te da un papel con una dirección."
registerShot('s022', { draw(g, t, info) {
  const cam = { z: lerp(1.3, 1.36, t / info.dur), x: 20, y: -130 }, { GY, M } = fair(g, t, cam), b = 1.2;
  const tx = E.W / 2 + 200, ux = E.W / 2 - 200, give = ease.inOut(prog(t, wt('papel', info, 1.6) - 0.6, wt('papel', info, 1.6) + 0.4));
  layer(g, cam, 1, (g) => {
    const ts = b * TOMAS_S, us = b * GIANT, reachT = { ...CANES, eF: [30, -150], hF: [62, -160] }, reachU = { ...POSES.stand, eF: [30, -140], hF: [56, -150] };
    tomas(g, { x: tx, y: GY, s: ts, M, t, pose: posesAt(t, [[0, CANES], [0.6, reachT]]), scarf: 1, look: [-0.6, 0.3] });
    drawFigure(g, { x: ux, y: GY, s: us, facing: 1, outfit: TU, pose: breathe(posesAt(t, [[0.6, POSES.stand], [1.2, reachU]]), t), expr: 'thinking', look: [0.8, 0.2], rim: rimN(M) });
    const px = lerp(tx - 62 * ts * Math.min(1, t / 0.6), ux + 56 * us, give), py = lerp(GY - 160 * ts, GY - 150 * us, give);
    g.save(); g.translate(px, py); g.rotate(-0.2); rr(g, -26, -18, 52, 36, 4); g.fillStyle = '#efe6d0'; g.fill(); g.restore(); glow(g, px, py, 80, '#ffe7b8', 0.4);
  });
  FX.dust(g, t, { count: 30, color: '#ffd47e', a: 0.3 });
} });
// s023 — "Una doctora que puede detener tu crecimiento."  el papel en tu mano
registerShot('s023', { draw(g, t, info) {
  blurLayer(g, 16, (g) => fair(g, t, { z: 1.7, x: 100, y: -400 })); veil(g, '#060818', 0.4);
  const ui = S().ui, cx = E.W / 2, cy = E.H * 0.44, td = wt('doctora', info, 0.6);
  seg(g, [[cx - 120, cy + 300], [-200, E.H + 200]], 120, '#0e0b12'); seg(g, [[cx - 220, cy + 480], [-260, E.H + 300]], 160, TU.color);
  g.save(); g.translate(cx, cy); g.rotate(0.05); rr(g, -300, -200, 600, 400, 12); g.fillStyle = '#efe6d0'; g.fill();
  text(g, 'DRA. VEGA', 0, -100, { size: 72, color: '#1a1622', font: FONTS.title, weight: 700, spacing: 3 });
  text(g, 'Endocrinóloga', 0, -30, { size: 36, color: '#5a4a3a', font: FONTS.ui, weight: 800 });
  text(g, 'Calle Luna 27', 0, 60, { size: 40, color: '#1a1622', font: FONTS.ui, weight: 900 });
  g.restore();
  circle(g, cx - 260, cy + 160, 60, '#0e0b12'); circle(g, cx + 250, cy + 150, 50, '#0e0b12');
  if (t > td) glow(g, cx, cy - 100, 420, ui.gold, 0.25 * ease.out(prog(t, td, td + 0.5)));
  UI.readout(g, { label: 'PUEDE', value: 'DETENER TU CRECIMIENTO', x: E.W / 2, y: E.H * 0.72, align: 'center', size: 48, a: ease.out(prog(t, wt('detener', info, 1.7) - 0.1, wt('detener', info, 1.7) + 0.3)) });
} });
// celular grande en la mano (igual que en la parte 1)
function linGradV(g, y0, y1, c) { const gr = g.createLinearGradient(0, y0, 0, y1); c.forEach((cc, i) => gr.addColorStop(i / (c.length - 1), cc)); return gr; }
export function phone(g, t, o) {
  const { x = E.W / 2, y = E.H * 0.47, w = 440, h = 820, buzz = 0, draw } = o;
  const [bx, by] = buzz ? [Math.sin(t * 70) * 6 * buzz, Math.cos(t * 61) * 4 * buzz] : [0, 0];
  g.save(); g.translate(x + bx, y + by); g.rotate(-0.06);
  seg(g, [[-w * 0.1, h * 0.45], [-w * 0.3, h * 1.3]], w * 0.5, '#0e0b12'); seg(g, [[-w * 0.15, h * 0.75], [-w * 0.35, h * 1.6]], w * 0.62, TU.color);
  rr(g, -w / 2, -h / 2, w, h, 40); g.fillStyle = '#0a0a10'; g.fill();
  rr(g, -w / 2 + 16, -h / 2 + 16, w - 32, h - 32, 28); g.fillStyle = linGradV(g, -h / 2, h / 2, ['#1a2440', '#0e1426']); g.fill();
  glow(g, 0, 0, w * 1.3, '#7fb0ff', 0.18); draw(g, w, h);
  for (const [dx, dy] of [[-w / 2 - 10, -h * 0.05], [-w / 2 - 10, h * 0.12], [w / 2 + 6, h * 0.02]]) circle(g, dx, dy, 30, '#0e0b12');
  g.restore();
}
// s024 — "Pero el entrenador te dio otra oportunidad."
registerShot('s024', { draw(g, t, info) {
  blurLayer(g, 16, (g) => fair(g, t, { z: 1.6, x: -100, y: -300 })); veil(g, '#060818', 0.35); const ui = S().ui;
  phone(g, t, { buzz: t > 0.2 && t < 0.8 ? 1 : 0, draw: (g, w, h) => {
    text(g, 'ENTRENADOR', 0, -h * 0.32, { size: 46, color: ui.gold, font: FONTS.ui, weight: 900, glow: 12, glowColor: alpha(ui.gold, 0.5) });
    const k = ease.outBack(prog(t, 0.4, 0.8)); if (k > 0) { g.save(); g.translate(0, -h * 0.1); g.scale(k, k); rr(g, -w * 0.4, -70, w * 0.8, 140, 28); g.fillStyle = 'rgba(240,236,228,.92)'; g.fill();
      text(g, 'Otra oportunidad.', 0, -22, { size: 34, color: '#1a1622', font: FONTS.ui, weight: 900 }); text(g, 'Última prueba.', 0, 24, { size: 32, color: '#5a5466', font: FONTS.ui, weight: 800 }); g.restore(); }
  } });
} });
