// shots/01_gente.js — números sobre las cabezas: calle, jefe, crush, mamá, vendedor, Sam, la mesa y el hombre del cero.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, talkAmount, seg, circle, rr, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street, kitchen, house, ground } from '../sets/world.js';
import { liarNum, tick, office, desk, shop, counterTop, living, table } from '../sets/extra.js';
import { TU, MAMA, JEFE, CRUSH, SAM, VENDEDOR, HOMBRE, PERSON } from '../cast.js';

export const wt = (w, info, fb) => (wordTime(w, info.shot.start - 0.05) ?? info.shot.start + fb) - info.shot.start;
const rim = (M, d = [0.3, -1]) => ({ color: M.rim, dir: d });
// figura + su número encima
export function fig(g, o, num) { drawFigure(g, o); if (num != null) { const [hx, hy, hr] = headPos(o); liarNum(g, hx, hy - hr - V(60, 60) * Math.max(0.8, (o.s || 1) * 0.5), num.n, { size: num.size || 40, pop: num.pop || 0, a: num.a ?? 1, color: num.color }); } }
const kcam = (t, dur, z0, z1, x = 0, y = 0) => ({ z: lerp(z0, z1, ease.inOut(t / dur)), x, y });

// s001 — "Sobre la cabeza de cada persona flota un número."
registerShot('s001', { draw(g, t, info) {
  const cam = kcam(t, info.dur, 1.3, 1.4, 0, -40), { GY, M } = street(g, t, cam);
  layer(g, cam, 1, (g) => [[-360, 3, 1], [-200, 1, -1], [-60, 7, 1], [120, 2, -1], [270, 0, 1], [410, 5, -1]].forEach(([dx, n, f], i) => {
    const at = 0.4 + i * 0.3; fig(g, { x: E.W / 2 + dx, y: GY + (i % 2) * 30, s: 1.05, facing: f, outfit: PERSON, pose: breathe(POSES.stand, t, 1, i + 3), expr: 'neutral', rim: rim(M) }, { n, a: ease.out(prog(t, at, at + 0.3)), pop: prog(t, at, at + 0.4) }); }));
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.3 });
} });
// s002 — "Tu jefe: doce."
registerShot('s002', { draw(g, t, info) {
  const cam = kcam(t, info.dur, 1.5, 1.58, 0, -80), { GY, M } = office(g, t, cam), tn = wt('doce.', info, 0.55);
  layer(g, cam, 1, (g) => { fig(g, { x: E.W / 2 - 60, y: GY, s: 1.5, facing: 1, outfit: JEFE, pose: breathe(POSES.crossArms, t), expr: 'smirk', rim: rim(M, [0, -1]) }, { n: 12, a: ease.out(prog(t, tn - 0.2, tn)), pop: prog(t, tn - 0.2, tn + 0.3), size: 52 }); desk(g, E.W / 2 - 40, GY, M); });
  FX.dust(g, t, { count: 25, color: '#cfe0ff', a: 0.25 });
} });
// s003 — "Tu crush: cero."
registerShot('s003', { draw(g, t, info) {
  const cam = kcam(t, info.dur, 1.7, 1.78, 0, -160), { GY, M } = street(g, t, cam), tn = wt('cero.', info, 0.5);
  layer(g, cam, 1, (g) => fig(g, { x: E.W / 2, y: GY, s: 1.5, facing: -1, outfit: CRUSH, pose: breathe(POSES.relaxed, t), expr: t > tn ? 'joy' : 'smile', look: [-0.3, 0], rim: rim(M), blink: (t % 2.9) > 2.8 }, { n: 0, a: ease.out(prog(t, tn - 0.2, tn)), pop: prog(t, tn - 0.2, tn + 0.3), size: 52 }));
  for (let i = 0; i < 4; i++) FX.sparkle(g, E.W / 2 + Math.cos(t * 2 + i * 1.6) * 200, E.H * 0.36 + Math.sin(t * 2 + i) * 60, 16, '#ffd1e6', 0.6 * prog(t, tn, tn + 0.5));
} });
// s004 — "¿Tu mamá? Trescientas cuarenta... y todas por ti."
registerShot('s004', { draw(g, t, info) {
  const cam = kcam(t, info.dur, 1.35, 1.45, -40, -60), { GY, M } = kitchen(g, t, cam, { noJar: true }), t0 = wt('Trescientas', info, 0.6), t1 = wt('cuarenta...', info, 1.7), tp = wt('por', info, 3.4);
  const n = Math.round(340 * ease.out(prog(t, t0, t1 + 0.2)));
  layer(g, cam, 1, (g) => {
    fig(g, { x: E.W / 2 - 200, y: GY, s: 1.55, facing: -1, outfit: MAMA, pose: breathe({ ...POSES.holdFront }, t), expr: 'smile', rim: rim(M, [0.5, -1]) }, { n, a: ease.out(prog(t, 0.1, 0.4)), pop: (t > t0 && t < t1 + 0.2) ? (t * 6) % 1 : 0, color: t > tp ? '#ff9ac8' : null, size: 48 });
    drawFigure(g, { x: E.W / 2 + 260, y: GY, s: 1.45, facing: -1, outfit: TU, pose: breathe(POSES.stand, t, 1, 4), expr: t > tp ? 'sad' : 'surprised', look: [-0.6, -0.4], rim: rim(M, [-0.5, -1]) });
    if (t > tp) glow(g, E.W / 2 - 200, GY - 250, 420, '#ff9ac8', 0.3 * prog(t, tp, tp + 0.6));
  });
  FX.dust(g, t, { count: 35, color: '#ffe2bd', a: 0.35 });
} });
// s007 — "¿Tú? Ahora las ves todas."
registerShot('s007', { draw(g, t, info) {
  blurLayer(g, 14, (g) => street(g, t, { z: 1.6, x: 100, y: -500 })); veil(g, '#120a10', 0.3);
  const M = mood('dusk'), r = V(300, 320) * (1 + 0.04 * t), cx = E.W / 2, cy = E.H * 0.6;
  [[-360, -560, 4], [330, -620, 9], [-420, -180, 1], [400, -260, 23], [-300, 260, 2], [360, 300, 6]].forEach(([dx, dy, n], i) => liarNum(g, cx + dx + Math.sin(t + i) * 10, cy + dy + Math.cos(t * 0.8 + i) * 10, n, { size: 38, a: ease.out(prog(t, 0.2 + i * 0.12, 0.5 + i * 0.12)) * 0.9 }));
  bigFace(g, cx, cy, r, { outfit: TU, expr: 'awe', look: [Math.sin(t * 1.5) * 0.8, -0.3], rimColor: M.rim, rimSide: -1 });
  for (const dx of [-0.32, 0.32]) glow(g, cx + dx * r, cy - r * 0.1, 60, S().ui.gold, 0.4);
} });

// s011 — "A favor: el vendedor dice precio especial."
function shopScene(g, t, info, o) {
  const cam = { z: o.z, x: o.x ?? 0, y: o.y ?? -100 }, { GY, M } = shop(g, t, cam);
  layer(g, cam, 1, (g) => {
    const vx = E.W / 2 + 200; fig(g, { x: vx, y: GY - 20, s: 1.5, facing: -1, outfit: VENDEDOR, pose: breathe(o.vPose || POSES.point, t), expr: 'smile', rim: rim(M, [0, -1]) }, { n: o.n ?? 57, pop: o.pop || 0, size: 46 });
    counterTop(g, vx, GY, 520, M);
    if (o.sign !== false) { const sx = vx - 380, sy = GY - 620; g.save(); g.translate(sx, sy); g.rotate(-0.05 + 0.02 * Math.sin(t * 2)); rr(g, -170, -60, 340, 120, 14); g.fillStyle = '#d64a33'; g.fill(); text(g, 'PRECIO', 0, -18, { size: 44, color: '#fff3e0', font: FONTS.title, weight: 700 }); text(g, 'ESPECIAL', 0, 30, { size: 44, color: '#ffd47e', font: FONTS.title, weight: 700 }); g.restore(); glow(g, sx, sy, 260, '#ff8a6a', 0.3); }
    if (o.tu) o.tu(g, GY, M);
  });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
}
registerShot('s011', { draw(g, t, info) { shopScene(g, t, info, { z: lerp(1.25, 1.33, t / info.dur), tu: (g, GY, M) => drawFigure(g, { x: E.W / 2 - 330, y: GY + 40, s: 1.55, facing: 1, outfit: TU, pose: breathe(POSES.stand, t), expr: 'thinking', look: [0.6, -0.3], rim: rim(M) }) });
  UI.badge(g, { str: 'A FAVOR', x: E.W / 2 + 160, y: E.H * 0.12, color: '#7ee08a', a: ease.out(prog(t, 0.3, 0.7)) * clamp((info.dur - t) / 0.3) }); } });
// s012 — "Sube un número."
registerShot('s012', { draw(g, t, info) { const [n, pop] = tick(t, wt('Sube', info, 0.15), 57, 58); shopScene(g, t, info, { z: lerp(2.0, 2.1, t / info.dur), x: 200, y: -40, n, pop, sign: false }); } });
// s013 — "No compras."
registerShot('s013', { draw(g, t, info) {
  shopScene(g, t, info, { z: 1.2, n: 58, vPose: POSES.reach, tu: (g, GY, M) => drawFigure(g, { x: E.W / 2 - 280 - t * 260, y: GY + 40, s: 1.55, facing: -1, outfit: TU, pose: walkPose(t * 6), expr: 'smirk', look: [0.6, 0], rim: rim(M) }) });
} });

// sala con Sam y el suéter feo
function sweater(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -70, -50, 140, 100, 12); g.fillStyle = '#c9a23a'; g.fill(); g.fillStyle = '#7a3a8a'; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-60 + i * 28, -10); g.lineTo(-46 + i * 28, 10); g.lineTo(-32 + i * 28, -10); g.fill(); } circle(g, 0, -28, 12, '#3fb950'); seg(g, [[-70, -40], [-100, 10]], 22, '#c9a23a'); seg(g, [[70, -40], [100, 10]], 22, '#c9a23a'); g.restore(); }
function samScene(g, t, info, o) {
  const cam = { z: o.z, x: o.x ?? 0, y: o.y ?? -120 }, { GY, M } = living(g, t, cam), sx = E.W / 2 + 170, s = 1.55;
  layer(g, cam, 1, (g) => {
    const pose = breathe({ ...POSES.holdFront, eF: [22, -146], hF: [40, -150], eB: [14, -146], hB: [30, -150] }, t, 1, 3);
    fig(g, { x: sx, y: GY, s, facing: -1, outfit: SAM, pose, expr: 'smile', talk: o.talk || 0, rim: rim(M, [0.5, -1]), blink: (t % 3.3) > 3.2 }, { n: o.n ?? 3, pop: o.pop || 0, size: 46 });
    sweater(g, sx - 36 * s, GY - 150 * s, 1.15);
    if (o.tu !== false) drawFigure(g, { x: E.W / 2 - 230, y: GY, s, facing: 1, outfit: TU, pose: breathe(POSES.stand, t), expr: o.tuExpr || 'happy', look: [0.6, -0.2], rim: rim(M) });
  });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
}
// s014 — "En contra: tu amigo Sam dice me encanta tu regalo."
registerShot('s014', { draw(g, t, info) { samScene(g, t, info, { z: lerp(1.3, 1.38, t / info.dur), talk: talkAmount(info.globalT, 35.78, 37.2) });
  UI.badge(g, { str: 'EN CONTRA', x: E.W / 2 + 180, y: E.H * 0.12, color: S().ui.accent, a: ease.out(prog(t, 0.2, 0.6)) * clamp((info.dur - t) / 0.3) }); } });
// s015 — "Sube uno."
registerShot('s015', { draw(g, t, info) { const [n, pop] = tick(t, wt('Sube', info, 0.18), 3, 4); samScene(g, t, info, { z: 2.0, x: 170, y: -40, n, pop, tu: false }); } });
// s016 — "Auch."
registerShot('s016', { draw(g, t, info) {
  const [sx, sy] = shake(t, 10 * (1 - prog(t, 0, 0.5)), 3); g.save(); g.translate(sx, sy);
  blurLayer(g, 14, (g) => living(g, t, { z: 1.6, x: -200, y: -500 })); veil(g, '#120a10', 0.3);
  bigFace(g, E.W / 2, E.H * 0.6, V(300, 320) * (1 + 0.03 * t), { outfit: TU, expr: 'worried', look: [0.4, 0.2], rimColor: mood('interiorWarm').rim, rimSide: -1 }); g.restore();
} });

// s021 — "Ya no puedes creerle a nadie."
registerShot('s021', { draw(g, t, info) {
  const cam = { z: lerp(1.25, 1.35, t / info.dur), y: -60, r: 0.015 * Math.sin(t) }, { GY, M } = street(g, t, cam);
  layer(g, cam, 1, (g) => {
    [[-400, 14, 1], [-260, 6, 1], [-120, 31, -1], [180, 9, -1], [320, 22, 1], [450, 3, -1]].forEach(([dx, n, f], i) => fig(g, { x: E.W / 2 + dx, y: GY + (i % 2) * 40, s: 1.0, facing: f, outfit: PERSON, pose: breathe(POSES.stand, t, 1, i), expr: 'smirk', rim: rim(M) }, { n, color: '#ff6f61', size: 36, pop: ((t * 0.8 + i * 0.2) % 1) * 0.3 }));
    drawFigure(g, { x: E.W / 2 + 30, y: GY + 60, s: 1.4, facing: Math.sin(t * 2.2) > 0 ? 1 : -1, outfit: TU, pose: breathe(POSES.crossArms, t), expr: 'nervous', look: [Math.sin(t * 2.2), 0], rim: rim(M) });
  });
  veil(g, '#3a0a14', 0.15);
} });
// s022 — "Ni siquiera a ella."
registerShot('s022', { draw(g, t, info) {
  const cam = { z: lerp(1.35, 1.45, t / info.dur), x: 120, y: -80 }, { GY, M, door } = house(g, t, cam);
  layer(g, cam, 1, (g) => fig(g, { x: door.x + door.w / 2, y: GY, s: 1.4, facing: -1, outfit: MAMA, pose: breathe(POSES.relaxed, t), expr: 'smile', rim: { color: M.practical, dir: [0, -1], w: 5 }, dim: true }, { n: 340, size: 46, color: '#ff9ac8' }));
} });
// mesa de la cocina (s023, s033, s035)
function dinner(g, t, info, o) {
  const cam = { z: o.z, x: o.x ?? 0, y: o.y ?? -40 }, { GY, M } = kitchen(g, t, cam, { noJar: true, lampDX: 0 }), s = 1.45, tx = E.W / 2;
  layer(g, cam, 1, (g) => {
    const sitT = { ...POSES.sit }; const ux = tx - 230, mx = tx + 230;
    drawFigure(g, { x: ux, y: GY, s, facing: 1, outfit: TU, pose: breathe(sitT, t), expr: o.tuExpr || 'smile', look: o.tuLook || [0.6, 0], rim: rim(M), shadow: false });
    if (o.mamaSit) fig(g, { x: mx, y: GY, s, facing: -1, outfit: MAMA, pose: breathe(sitT, t, 1, 3), expr: o.mExpr || 'smile', look: [-0.6, 0], rim: rim(M), shadow: false }, o.num);
    else fig(g, { x: tx + 120, y: GY, s, facing: -1, outfit: MAMA, pose: breathe(posesAt(t, [[0, POSES.holdFront], [0.9, POSES.relaxed]]), t, 1, 3), expr: 'smile', look: [-0.6, 0.3], rim: rim(M) }, o.num);
    table(g, tx, GY, 520, o.plates, { t });
  });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
}
// s023 — "Tu mamá siempre dice lo mismo."
registerShot('s023', { draw(g, t, info) { dinner(g, t, info, { z: lerp(1.3, 1.36, t / info.dur), plates: [{ x: -150, food: true, steam: true }], num: { n: 340, size: 44 } }); } });
// s024 — "Ya comí."
registerShot('s024', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.7, x: 150, y: -420 }, { noJar: true })); veil(g, '#120a10', 0.3);
  const r = V(300, 320) * (1 + 0.03 * t), talk = talkAmount(info.globalT, 57.66, 58.3);
  bigFace(g, E.W / 2, E.H * 0.6, r, { outfit: MAMA, expr: 'smile', talk, look: [-0.3, 0.2], rimColor: mood('interiorWarm').rim, rimSide: 1, blink: (t % 2.9) > 2.8 });
} });
// s025 — "Y el número sube."
registerShot('s025', { draw(g, t, info) {
  blurLayer(g, 16, (g) => kitchen(g, t, { z: 1.8, x: 150, y: -300 }, { noJar: true })); veil(g, '#120a10', 0.35);
  const [n, pop] = tick(t, wt('sube.', info, 0.7), 340, 341, 0.5);
  circle(g, E.W / 2, E.H * 0.95, 360, '#0e0b12'); g.save(); g.translate(E.W / 2, E.H * 0.95 - 330); FX.rings(g, 0, 0, t, { count: 0 }); g.restore();
  liarNum(g, E.W / 2, E.H * 0.42, n, { size: 150, pop, color: '#ff9ac8' });
  if (pop > 0) FX.rings(g, E.W / 2, E.H * 0.42, t, { count: 2, r0: 160, r1: 360, color: '#ff9ac8', a: 0.4 * (1 - pop) });
} });
// s032 — "Cocinas dos platos."
registerShot('s032', { draw(g, t, info) {
  const cam = { z: lerp(1.5, 1.58, t / info.dur), x: -260, y: -60 }, { GY, M } = kitchen(g, t, cam, { noJar: true }), cx = E.W / 2 - 330;
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: cx + 160, y: GY, s: 1.5, facing: -1, outfit: TU, pose: breathe({ ...POSES.holdFront, hF: [40, -150 + Math.sin(t * 8) * 6] }, t), expr: 'determined', look: [-0.4, 0.5], rim: rim(M) });
    rr(g, cx - 130, GY - 200, 150, 30, 6); g.fillStyle = '#1a1420'; g.fill(); seg(g, [[cx + 20, GY - 190], [cx + 90, GY - 205]], 10, '#1a1420'); glow(g, cx - 55, GY - 175, 120, '#ff8a3a', 0.4);
    for (const [dx, k] of [[-240, 0], [-110, 1]]) { g.fillStyle = '#f2ece4'; g.beginPath(); g.ellipse(cx + dx + 40, GY - 214, 46, 11, 0, 0, 7); g.fill(); g.fillStyle = '#d9853a'; g.beginPath(); g.ellipse(cx + dx + 40, GY - 220, 28, 8, 0, Math.PI, 0); g.fill();
      for (let i = 0; i < 3; i++) { const ph = t * 1.2 + i + k; g.strokeStyle = `rgba(255,255,255,${0.3 * (1 - (ph % 1))})`; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + dx + 28 + i * 12, GY - 232); g.quadraticCurveTo(cx + dx + 18 + i * 12, GY - 262 - (ph % 1) * 30, cx + dx + 32 + i * 12, GY - 300 - (ph % 1) * 30); g.stroke(); } }
  });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });
// s033 — "Hoy comemos juntos."
registerShot('s033', { draw(g, t, info) { dinner(g, t, info, { z: lerp(1.3, 1.24, ease.inOut(t / info.dur)), mamaSit: true, mExpr: 'surprised', plates: [{ x: -150, food: true, steam: true }, { x: 150, food: true, steam: true }], num: { n: 341, size: 44, color: '#ff9ac8' } }); } });
// s034 — "Ella abre la boca. Ya com... Se detiene."
registerShot('s034', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.7, x: 150, y: -420 }, { noJar: true })); veil(g, '#120a10', 0.28);
  const r = V(300, 320) * (1 + 0.03 * t), talk = talkAmount(info.globalT, 79.46, 80.2), stop = wt('Se', info, 2.75);
  bigFace(g, E.W / 2, E.H * 0.6, r, { outfit: MAMA, expr: t < stop ? 'neutral' : 'sad', talk: t < stop ? talk : 0, look: [-0.4, 0.1], rimColor: mood('interiorWarm').rim, rimSide: 1, blink: (t % 2.9) > 2.8 });
} });
// s035 — "El número... no sube. Por primera vez."
registerShot('s035', { draw(g, t, info) {
  const tp = wt('primera', info, 3.7), warm = prog(t, tp - 0.2, tp + 0.6);
  dinner(g, t, info, { z: lerp(1.55, 1.7, ease.inOut(t / info.dur)), x: 140, y: -160, mamaSit: true, mExpr: warm > 0.5 ? 'happy' : 'neutral', tuExpr: warm > 0.5 ? 'happy' : 'smile', plates: [{ x: -150, food: true }, { x: 150, food: true }],
    num: { n: 341, size: 48, color: warm > 0.5 ? '#ffd47e' : '#ff9ac8', pop: Math.sin(t * 3) * 0.04 } });
  if (warm > 0) { glow(g, E.W / 2 + 200, E.H * 0.35, 500, '#ffd47e', 0.25 * warm); for (let i = 0; i < 4; i++) FX.sparkle(g, E.W / 2 + 100 + i * 70, E.H * 0.3 + Math.sin(t * 2 + i) * 40, 16, '#ffd47e', 0.7 * warm); }
} });

// s036 — "Al día siguiente ves a un hombre."
registerShot('s036', { draw(g, t, info) {
  const cam = kcam(t, info.dur, 1.25, 1.4, 120, -60), { GY, M } = street(g, t, cam);
  layer(g, cam, 1, (g) => {
    [[-380, 5, 1], [-230, 18, -1], [40, 2, 1], [420, 11, -1]].forEach(([dx, n, f], i) => fig(g, { x: E.W / 2 + dx, y: GY + (i % 2) * 40, s: 1.0, facing: f, outfit: PERSON, pose: walkPose(t * 4 + i), rim: rim(M) }, { n, size: 34 }));
    fig(g, { x: E.W / 2 + 230, y: GY - 10, s: 1.15, facing: -1, outfit: HOMBRE, pose: breathe(POSES.stand, t), expr: 'neutral', rim: { color: '#cfe0ff', dir: [0, -1] } }, { n: '?', size: 34, color: '#cfe0ff', a: 0.4 });
  });
} });
// s037 — "Su número: cero."
registerShot('s037', { draw(g, t, info) {
  const cam = { z: lerp(2.2, 2.35, t / info.dur), x: 230, y: 40 }, { GY, M } = street(g, t, cam), tn = wt('cero.', info, 1.0);
  layer(g, cam, 1, (g) => fig(g, { x: E.W / 2 + 230, y: GY - 10, s: 1.15, facing: -1, outfit: HOMBRE, pose: breathe(POSES.stand, t), expr: 'neutral', rim: { color: '#cfe0ff', dir: [0, -1] } }, { n: t < tn ? '?' : 0, size: 40, color: '#cfe0ff', pop: prog(t, tn, tn + 0.4) }));
  veil(g, '#0a1430', 0.2 * prog(t, tn, tn + 0.5));
} });
// s038 — "Y te está mirando."
registerShot('s038', { draw(g, t, info) {
  blurLayer(g, 14, (g) => street(g, t, { z: 1.7, x: 200, y: -500 })); veil(g, '#060818', 0.45);
  bigFace(g, E.W / 2, E.H * 0.58, V(310, 330) * (1 + 0.05 * t), { outfit: HOMBRE, expr: 'smirk', look: [0, 0], rimColor: '#cfe0ff', rimSide: 1 });
  liarNum(g, E.W / 2, E.H * 0.2, 0, { size: 60, color: '#cfe0ff' });
} });
