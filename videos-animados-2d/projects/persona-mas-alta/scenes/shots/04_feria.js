// shots/04_feria.js — la feria: Leo se pierde, el entrenador, el congelado, la banca, el rescate, el mensaje y el final (s023–s038).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { fair, fogSet, ground, PXM, PERSON } from '../sets/world.js';
import { TU, LEO, SOMBRA, GIANT, CAST } from '../cast.js';

const wt = (w, info, fb) => (wordTime(w, info.shot.start - 0.05) ?? info.shot.start + fb) - info.shot.start;
const B = 1.1, GSc = B * GIANT;
const rimOf = (M) => ({ color: M.rim, dir: [0.3, -1] });
// gente de la feria (tinta sola) en una fila
function people(g, t, GY, xs, o = {}) { const M = mood('night'); xs.forEach((x, i) => drawFigure(g, { x, y: GY + (o.dy || 0), s: o.s || B, facing: i % 2 ? -1 : 1, outfit: PERSON, pose: o.frozen ? walkPose(i * 1.3) : breathe(o.walk ? walkPose(t * 5 + i) : POSES.stand, t, 1, i + 5), expr: o.expr || 'neutral', look: o.look || [0, 0], rim: rimOf(M), dim: o.dim })); }

// s023 — 3D: feria de noche, entre miles de personas
registerShot('s023', {
  kind: '3d',
  init(T) {
    const M = mood('night'), { THREE } = T;
    const st = T.stage({ mood: 'night', fov: V(36, 54), fog: [16, 60], keyPos: [6, 8, 6], keyIntensity: 2.4, ambient: 1.8 });
    st.add(T.ground(90, 90, '#1e2036', T.tiles('#1e2036', 8, [10, 10])));
    const wheel = new THREE.Group(); wheel.position.set(7, 10, -16);
    const rimM = T.mat('#2a2238'); const bulb = T.basic('#ffd47e'), bulb2 = T.basic('#ff8a6a');
    wheel.add(new THREE.Mesh(new THREE.TorusGeometry(8, 0.12, 8, 64), rimM));
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, sp = T.box(0.08, 8, 0.08, '#2a2238', Math.cos(a) * 4, Math.sin(a) * 4, 0); sp.rotation.z = a - Math.PI / 2; wheel.add(sp); }
    for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; const b = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), i % 2 ? bulb : bulb2); b.position.set(Math.cos(a) * 8, Math.sin(a) * 8, 0.1); wheel.add(b); }
    st.add(wheel, T.box(0.3, 11, 0.3, '#140f1c', 4, 5, -16), T.box(0.3, 11, 0.3, '#140f1c', 10, 5, -16));
    for (const [x, z, c] of [[-8, -8, '#d64a33'], [-3, -10, '#3a6ea5'], [12, -6, '#8a5ad6']]) { st.add(T.box(4, 3, 3, '#2a2036', x, 1.5, z)); const w = T.windowPane(3.2, 1.6, { glowColor: M.practical, cols: 1, rows: 1, power: 1.1 }); w.position.set(x, 1.6, z + 1.52); st.add(w); st.add(T.box(4.4, 0.5, 3.4, c, x, 3.2, z)); }
    st.add(T.crowd3D({ rows: 14, perRow: 46, width: 34, step: 0.9, rise: 0, colors: ['#2a2448', '#332c56', '#3a3260'], seed: 9, z0: -6 }));
    const you = T.figure3D(TU, { rim: M.rim, pose: POSES.stand, s: GIANT }); you.position.set(0, 0, 2); you.rotation.y = -0.4; st.add(you);
    return { stage: st, wheel };
  },
  draw(s, t, info, T) {
    s.wheel.rotation.z = t * 0.12;
    T.dolly(s.stage.camera, t, [[0, { pos: [-2, 7.5, 17], look: [2, 3.5, -5] }], [info.dur, { pos: [3, 4.6, 12], look: [1, 2.8, -2] }]]);
  },
});

// s024 — "Leo desaparece."
registerShot('s024', { draw(g, t, info) {
  const cam = { z: lerp(1.3, 1.36, t / info.dur), x: 0, y: -60 }, { GY, M } = fair(g, t, cam), gone = wt('desaparece.', info, 0.95);
  layer(g, cam, 1, (g) => {
    const lx = E.W / 2 + 120 + t * 60;
    drawFigure(g, { x: lx, y: GY, s: B, facing: 1, outfit: LEO, pose: walkPose(t * 6), expr: 'happy', rim: rimOf(M), alpha: 1 - prog(t, gone - 0.1, gone + 0.3) });
    for (let i = 0; i < 7; i++) { const px = E.W + 260 + i * 120 - t * 520; drawFigure(g, { x: px, y: GY + 6, s: B * (1 + (i % 3) * 0.06), facing: -1, outfit: PERSON, pose: walkPose(t * 5 + i), rim: rimOf(M) }); }
    drawFigure(g, { x: E.W / 2 - 250, y: GY, s: GSc, facing: 1, outfit: TU, pose: breathe(t > gone + 0.3 ? POSES.handsOnHead : POSES.stand, t), expr: t > gone + 0.2 ? 'scared' : 'smile', look: t > gone + 0.2 ? [Math.sin(t * 5), 0.3] : [0.8, 0.5], rim: rimOf(M) });
  });
  blurLayer(g, 10, (g) => people(g, t, GY + 260, [E.W * 0.15, E.W * 0.85], { s: 1.9 }), cam, 1.6);
  FX.dust(g, t, { count: 30, color: '#ffd47e', a: 0.3 });
} });

// celular grande en la mano
function phone(g, t, o) {
  const { x = E.W / 2, y = E.H * 0.47, w = V(320, 440), h = V(600, 820), buzz = 0, draw } = o;
  const [bx, by] = buzz ? [Math.sin(t * 70) * 6 * buzz, Math.cos(t * 61) * 4 * buzz] : [0, 0];
  g.save(); g.translate(x + bx, y + by); g.rotate(-0.06);
  seg(g, [[-w * 0.1, h * 0.45], [-w * 0.3, h * 1.3]], w * 0.5, '#0e0b12'); seg(g, [[-w * 0.15, h * 0.75], [-w * 0.35, h * 1.6]], w * 0.62, TU.color);
  rr(g, -w / 2, -h / 2, w, h, 40); g.fillStyle = '#0a0a10'; g.fill();
  rr(g, -w / 2 + 16, -h / 2 + 16, w - 32, h - 32, 28); g.fillStyle = linGradV(g, -h / 2, h / 2, ['#1a2440', '#0e1426']); g.fill();
  glow(g, 0, 0, w * 1.3, '#7fb0ff', 0.18);
  draw(g, w, h);
  for (const [dx, dy] of [[-w / 2 - 10, -h * 0.05], [-w / 2 - 10, h * 0.12], [w / 2 + 6, h * 0.02]]) { circle(g, dx, dy, 30, '#0e0b12'); }
  seg(g, [[-w / 2 - 20, h * 0.3], [-w / 2 + 40, h * 0.18]], 42, '#0e0b12');
  g.restore();
}
function linGradV(g, y0, y1, c) { const gr = g.createLinearGradient(0, y0, 0, y1); c.forEach((cc, i) => gr.addColorStop(i / (c.length - 1), cc)); return gr; }
const fairBlur = (g, t, x = 0, y = -300) => { blurLayer(g, 16, (g) => fair(g, t, { z: 1.6, x, y })); veil(g, '#060818', 0.35); };

// s025 — "Tu celular suena. El entrenador."
registerShot('s025', { draw(g, t, info) {
  fairBlur(g, t, 200); const te = wt('entrenador.', info, 1.6), ui = S().ui;
  phone(g, t, { buzz: t < info.dur - 0.2 ? 1 : 0, draw: (g, w, h) => {
    text(g, 'Llamada entrante', 0, -h * 0.3, { size: V(26, 34), color: alpha(ui.cream, 0.7), font: FONTS.ui, weight: 800 });
    const k = ease.outBack(prog(t, te - 0.1, te + 0.3)); circle(g, 0, -h * 0.12, 70, '#2a3a60'); circle(g, 0, -h * 0.15, 26, '#9fb6d8'); g.fillStyle = '#9fb6d8'; g.beginPath(); g.ellipse(0, -h * 0.06, 44, 26, 0, Math.PI, 0); g.fill();
    if (k > 0) { g.save(); g.translate(0, h * 0.05); g.scale(k, k); text(g, 'ENTRENADOR', 0, 0, { size: V(44, 56), color: ui.gold, font: FONTS.ui, weight: 900, glow: 14, glowColor: alpha(ui.gold, 0.5) }); g.restore(); }
    for (const [dx, c] of [[-w * 0.22, '#e04a3a'], [w * 0.22, '#3fb950']]) { circle(g, dx, h * 0.32, 46, c); glow(g, dx, h * 0.32, 90, c, 0.3); }
  } });
  FX.rings(g, E.W / 2, E.H * 0.47, t, { count: 3, r0: V(260, 340), r1: V(420, 520), color: '#9fd8ff', a: 0.25 });
} });

// s026 — "Prueba final en diez minutos."
registerShot('s026', { draw(g, t, info) {
  fairBlur(g, t, -200, -400); veil(g, '#050714', 0.4); const ui = S().ui, td = wt('diez', info, 1.0);
  text(g, 'PRUEBA FINAL', E.W / 2, E.H * 0.33, { size: V(56, 66), color: ui.cream, font: FONTS.title, weight: 700, spacing: 4, glow: 20, glowColor: 'rgba(255,120,40,.6)', alpha: ease.out(prog(t, 0.05, 0.4)) });
  const secs = 600 - Math.max(0, Math.floor((t - td - 0.4) * 1.5)), k = ease.outBack(prog(t, td - 0.1, td + 0.3));
  if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.45); g.scale(k, k); text(g, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, 0, 0, { size: V(200, 220), color: ui.accent, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.accent, 0.6) }); g.restore(); }
  FX.rings(g, E.W / 2, E.H * 0.45, t, { count: 2, r0: 200, r1: 480, color: ui.accent, a: 0.2, speed: 1 });
} });

// s027 — "No puedes correr."
registerShot('s027', { draw(g, t, info) {
  const gx = lerp(E.W / 2 - 280, E.W / 2 - 120, t / info.dur), cam = { z: 1.3, x: (gx - E.W / 2) * 0.5, y: -60 }, { GY, M } = fair(g, t, cam);
  layer(g, cam, 1, (g) => {
    people(g, t, GY, [E.W / 2 + 60, E.W / 2 + 240, E.W / 2 + 420, E.W / 2 - 520]);
    const pose = walkPose(t * Math.PI * 2 * 0.7, { run: true }); drawFigure(g, { x: gx, y: GY, s: GSc, facing: 1, outfit: TU, pose, expr: t < 0.8 ? 'determined' : 'worried', rim: rimOf(M) });
    for (const k of [pose.kF, pose.kB]) { const kx = gx + k[0] * GSc, ky = GY + k[1] * GSc; glow(g, kx, ky, 60, S().ui.accent, 0.4 + 0.3 * Math.sin(t * 9)); }
  });
  FX.dust(g, t, { count: 30, color: '#ffd47e', a: 0.3 });
} });
// s028 — "Tus rodillas no aguantan."
const BENT = { head: [34, -178], sh: [24, -150], hip: [0, -100], eF: [36, -112], hF: [30, -62], eB: [24, -114], hB: [18, -62], kF: [18, -54], fF: [8, 0], kB: [4, -52], fB: [-12, 0] };
registerShot('s028', { draw(g, t, info) {
  const hit = 0.3, [sx, sy] = t > hit ? shake(t, 10 * (1 - prog(t, hit, hit + 0.5)), 3) : [0, 0];
  const cam = { z: lerp(1.6, 1.7, t / info.dur), x: -60 + sx, y: 80 + sy }, { GY, M } = fair(g, t, cam), s = 1.3 * GIANT, x = E.W / 2 - 60;
  layer(g, cam, 1, (g) => {
    const pose = breathe(posesAt(t, [[0, POSES.stand], [hit, BENT]]), t * 2.5);
    drawFigure(g, { x, y: GY, s, facing: 1, outfit: TU, pose, expr: t > hit ? 'sad' : 'worried', rim: rimOf(M) });
    if (t > hit) for (const k of [pose.kF, pose.kB]) { const kx = x + k[0] * s, ky = GY + k[1] * s, p = 0.6 + 0.4 * Math.sin((t - hit) * 10); glow(g, kx, ky, 110, S().ui.accent, 0.55 * p); ring(g, kx, ky, 34 + 10 * p, 5, alpha(S().ui.accent, 0.8)); }
  });
  blurLayer(g, 10, (g) => people(g, t, GY + 300, [E.W * 0.05, E.W * 0.95], { s: 2.1 }), cam, 1.6);
} });

// s029 — CONGELADO: "El contrato o tu hermano cuelgas."
registerShot('s029', { draw(g, t, info) {
  const cam = { z: 1.32 + 0.03 * t, r: -0.02 + 0.008 * t, y: -60 }, { GY, M } = fair(g, 1.0, cam), ui = S().ui, tc = wt('cuelgas.', info, 2.15);
  layer(g, cam, 1, (g) => {
    people(g, 0, GY, [E.W / 2 - 440, E.W / 2 - 290, E.W / 2 + 280, E.W / 2 + 430], { frozen: true });
    const look = t < 1.2 ? [-1, -0.1] : t < tc ? [1, -0.1] : [0.6, 0.3];
    drawFigure(g, { x: E.W / 2, y: GY, s: GSc, facing: t < 1.2 ? -1 : 1, outfit: TU, pose: breathe(POSES.phone, t), prop: { type: 'phone', glow: t < tc ? '#9fd8ff' : '#1a1a24' }, expr: t < tc ? 'worried' : 'determined', look, rim: rimOf(M) });
  });
  FX.drops(g, t, { count: 50, color: '#d8e4ff', rMax: 9, drift: 3 });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  const yI = E.H * V(0.3, 0.27), xl = E.W * 0.24, xr = E.W * 0.76, off = 1 - prog(t, tc, tc + 0.4);
  const a1 = ease.out(prog(t, 0.1, 0.5)), a2 = ease.out(prog(t, 1.0, 1.4));
  // contrato (celular)
  g.save(); g.globalAlpha *= a1 * (0.35 + 0.65 * off); rr(g, xl - 46, yI - 80, 92, 160, 16); g.fillStyle = '#0a0a10'; g.fill(); rr(g, xl - 36, yI - 70, 72, 140, 10); g.fillStyle = off > 0.5 ? '#2a4a80' : '#141420'; g.fill(); if (off > 0.5) glow(g, xl, yI, 160, '#9fd8ff', 0.35 * off); g.restore();
  text(g, 'CONTRATO', xl, yI + 130, { size: V(36, 42), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2, alpha: a1 * (0.35 + 0.65 * off) });
  if (t > tc) { const k = ease.out(prog(t, tc, tc + 0.3)); seg(g, [[xl - 70, yI - 70], [xl - 70 + 140 * k, yI + 70 * (2 * k - 1)]], 8, ui.accent); }
  // Leo (gorra roja)
  g.save(); g.globalAlpha *= a2; circle(g, xr, yI + 10, 44, '#0e0b12'); g.fillStyle = LEO.headColor; g.beginPath(); g.arc(xr, yI, 46, Math.PI, 0); g.fill(); rr(g, xr, yI - 8, 70, 14, 7); g.fill(); glow(g, xr, yI, 180 + 60 * (1 - off), LEO.headColor, 0.35 + 0.3 * (1 - off)); g.restore();
  text(g, 'LEO', xr, yI + 130, { size: V(40, 46), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: a2, glow: 14, glowColor: alpha(ui.gold, 0.5) });
  FX.rings(g, E.W / 2, E.H * 0.45, t, { count: 3, r0: 120, r1: 520, speed: 0.35, color: '#e8f0ff', a: 0.3 });
} });

// banca de la feria
function bench(g, x, GY, s) { const h = 0.45 * PXM(B); rr(g, x - 150 * s, GY - h - 14, 300 * s, 18, 6); g.fillStyle = '#2a2036'; g.fill(); for (const dx of [-120, 120]) seg(g, [[x + dx * s, GY - h], [x + dx * s, GY]], 10, '#1a1424'); return h; }
// s030 — "Te subes a una banca."
registerShot('s030', { draw(g, t, info) {
  const cam = { z: lerp(1.35, 1.28, t / info.dur), x: -20, y: -110 }, { GY, M } = fair(g, t, cam), x = E.W / 2 - 40;
  layer(g, cam, 1, (g) => {
    const h = bench(g, x, GY, 1), up = ease.inOut(prog(t, 0.35, 0.95));
    const step = { ...POSES.stand, kF: [20, -80], fF: [24, -36] };
    drawFigure(g, { x: x + 10, y: GY - h * up, s: GSc, facing: 1, outfit: TU, pose: breathe(posesAt(t, [[0, POSES.stand], [0.3, step], [0.95, POSES.stand]]), t), expr: 'determined', look: [0.4, -0.2], rim: rimOf(M), shadow: up < 0.5 });
    people(g, t, GY + 40, [E.W / 2 - 380, E.W / 2 + 300, E.W / 2 + 440]);
  });
} });
// s031 — "Tus ojos quedan a casi tres metros."
registerShot('s031', { draw(g, t, info) {
  const cam = { z: lerp(1.2, 1.12, ease.inOut(t / info.dur)), x: -20, y: -150 }, { GY, M } = fair(g, t, cam), x = E.W / 2 - 40;
  layer(g, cam, 1, (g) => {
    const h = bench(g, x, GY, 1);
    drawFigure(g, { x: x + 10, y: GY - h, s: GSc, facing: 1, outfit: TU, pose: breathe(POSES.stand, t), expr: 'determined', look: [Math.sin(t * 1.6), 0.2], rim: rimOf(M), shadow: false });
    const eyeY = GY - h - 210 * GSc;
    people(g, t, GY + 40, [E.W / 2 - 420, E.W / 2 - 270, E.W / 2 + 230, E.W / 2 + 380]);
    UI.dimension(g, t, { x1: x - 170, y1: GY, x2: x - 170, y2: eyeY, str: '≈ 3 m', start: wt('tres', info, 1.3) - 0.5 });
    g.setLineDash([8, 10]); seg(g, [[x - 180, eyeY], [x + 40, eyeY]], 2, alpha(S().ui.gold, 0.6 * prog(t, 1, 1.5))); g.setLineDash([]);
  });
} });
// s032 — "Una gorra roja llorando."
registerShot('s032', { draw(g, t, info) {
  const z = lerp(1.3, 2.3, ease.inOut(prog(t, 0.1, info.dur))), cx = E.W / 2 + 40, cy = E.H * 0.56 + 280 - 150;
  blurLayer(g, 10, (g) => fair(g, t, { z: 1.2, y: -500 })); veil(g, '#060818', 0.45);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-cx, -cy);
  const M = mood('night'), GY = E.H * 0.56;
  FX.pool(g, cx, GY + 130, 260, 70, M.practical, 0.35); FX.lightCone(g, cx, GY - 900, { angle: Math.PI / 2, spread: 0.3, len: 1100, color: M.practical, a: 0.1 });
  for (let r = 0; r < 3; r++) { const y = GY + r * 140, s = 0.9 + r * 0.15;
    for (let i = -4; i <= 4; i++) { const x = cx + i * 130 + (r % 2) * 60; if (r === 2 && i === 0) { drawFigure(g, { x: cx, y, s, facing: 1, outfit: LEO, pose: breathe(POSES.sad, t * 3), expr: 'cry', look: [0.2, -1], rim: { color: M.practical, dir: [0, -1] } }); continue; }
      drawFigure(g, { x, y, s, facing: i < 0 ? 1 : -1, outfit: PERSON, pose: breathe(POSES.stand, t, 1, r * 9 + i), expr: 'neutral', look: [0, 0.3], rim: rimOf(M), dim: true }); } }
  g.restore();
  FX.rings(g, E.W / 2, E.H * 0.45, t, { count: 2, r0: 120, r1: 300, color: '#ffd47e', a: 0.25 * prog(t, 0.6, 1.2) });
} });
// s033 — "Lo levantas."
registerShot('s033', { draw(g, t, info) {
  const cam = { z: lerp(1.35, 1.42, t / info.dur), x: 0, y: -170 }, { GY, M } = fair(g, t, cam), s = 1.2 * GIANT, x = E.W / 2 - 80;
  const k = ease.inOut(prog(t, 0.15, 0.9));
  layer(g, cam, 1, (g) => {
    const pose = breathe(posesAt(t, [[0, { ...POSES.reach, eF: [40, -110], hF: [70, -70] }], [0.2, { ...POSES.reach, eF: [40, -110], hF: [70, -70] }], [0.9, POSES.cheer]]), t);
    drawFigure(g, { x, y: GY, s, facing: 1, outfit: TU, pose, expr: 'determined', look: [0.4, -0.3 - k], rim: rimOf(M) });
    const lx = lerp(x + 100 * s, x + 20 * s, k), ly = lerp(GY, GY - 190 * s, k);
    drawFigure(g, { x: lx, y: ly, s: 1.2, facing: -1, outfit: LEO, pose: posesAt(t, [[0, POSES.sad], [0.7, POSES.cheer]]), expr: t < 0.6 ? 'cry' : 'surprised', look: [-0.2, 0.4], rim: rimOf(M), shadow: k < 0.2 });
    people(g, t, GY + 50, [E.W / 2 - 420, E.W / 2 + 330]);
  });
  FX.dust(g, t, { count: 30, color: '#ffd47e', a: 0.35 });
} });
// s034 — "¿Cómo está el clima allá arriba?"  Leo arriba, entre lágrimas y sonrisa
registerShot('s034', { draw(g, t, info) {
  blurLayer(g, 14, (g) => fair(g, t, { z: 1.6, x: 260, y: -700 })); veil(g, '#060818', 0.25);
  const M = mood('night'), r = V(290, 320) * (1 + 0.03 * t), cx = E.W / 2 - V(60, 0), cy = E.H * V(0.6, 0.55);
  const talk = talkAmount(info.globalT, 80.14, 81.58);
  bigFace(g, cx, cy, r, { outfit: LEO, expr: t < 0.9 ? 'cry' : 'joy', talk, look: [0.3, 0.5], rimColor: M.practical, rimSide: 1, blink: (t % 2.9) > 2.8 });
  if (talk > 0) FX.rings(g, cx, cy, t, { count: 3, r0: r * 1.1, r1: r * 1.6, color: '#fff3e0', a: 0.35 });
  FX.dust(g, t, { count: 40, color: '#ffd47e', a: 0.4 });
} });
// s035 — "Despejado, Leo."  siluetas frente a la rueda
registerShot('s035', { draw(g, t, info) {
  const cam = { z: lerp(1.5, 1.3, ease.inOut(t / info.dur)), x: 0, y: -260 }, { GY, M } = fair(g, t, cam, { wheelDX: 0 }), x = E.W / 2, s = GIANT;
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x, y: GY, s, facing: 1, outfit: TU, pose: breathe({ ...POSES.stand, eF: [18, -160], hF: [12, -186], eB: [-14, -160], hB: [-10, -186] }, t), expr: 'smile', look: [0, -0.6], rim: rimOf(M) });
    drawFigure(g, { x: x + 4 * s, y: GY - 174 * s + 72 * 0.72 - 6, s: 1, facing: 1, outfit: LEO, pose: { ...POSES.sit, eF: [22, -170], hF: [32, -208], eB: [-16, -170], hB: [-26, -208] }, expr: 'joy', look: [0.2, -0.6], rim: rimOf(M), shadow: false });
    people(g, t, GY + 60, [E.W / 2 - 400, E.W / 2 - 250, E.W / 2 + 260, E.W / 2 + 420], { expr: 'smile', look: [0, -0.8] });
  });
  FX.dust(g, t, { count: 40, color: '#ffd47e', a: 0.35 });
} });
// s036 — "Ahora sí, llega un mensaje."
registerShot('s036', { draw(g, t, info) {
  fairBlur(g, t, -100); const ui = S().ui, tm = wt('mensaje.', info, 1.6);
  phone(g, t, { buzz: t > 0.3 && t < 0.9 ? 1 : 0, draw: (g, w, h) => {
    text(g, '21:47', 0, -h * 0.3, { size: V(60, 80), color: alpha(ui.cream, 0.85), font: FONTS.ui, weight: 800 });
    const k = ease.outBack(prog(t, 0.3, 0.7)); if (k > 0) { g.save(); g.translate(0, -h * 0.08); g.scale(k, k); rr(g, -w * 0.42, -60, w * 0.84, 120, 24); g.fillStyle = 'rgba(240,236,228,.92)'; g.fill();
      text(g, 'Nuevo mensaje', -w * 0.36, -22, { size: V(24, 30), color: '#1a1622', font: FONTS.ui, weight: 900, align: 'left' }); text(g, 'Número desconocido', -w * 0.36, 20, { size: V(20, 26), color: '#5a5466', font: FONTS.ui, weight: 800, align: 'left' }); g.restore(); }
    if (t > tm) { for (let i = -1; i <= 1; i++) circle(g, i * 30, h * 0.12, 9 * (0.6 + 0.4 * Math.abs(Math.sin(t * 5 + i))), alpha(ui.cream, 0.8)); }
  } });
} });
// s037 — "Alguien más alto que tú te está buscando."
registerShot('s037', { draw(g, t, info) {
  const cam = { z: lerp(1.05, 1.18, ease.inOut(t / info.dur)), x: 0, y: -200 }, { GY, M } = fogSet(g, t, cam);
  const flash = wt('buscando.', info, 2.7);
  layer(g, cam, 0.75, (g) => {
    drawFigure(g, { x: E.W / 2 + 110, y: GY, s: GIANT * 1.3, facing: -1, outfit: SOMBRA, pose: breathe(POSES.stand, t), expr: 'neutral', rim: { color: M.rim, dir: [0.3, -1], w: 3 }, alpha: ease.inOut(prog(t, 0.3, 1.6)) });
    FX.fog(g, GY - 500, 400, M.sky[2], 0.45); FX.fog(g, GY - 150, 300, M.sky[2], 0.55);
  });
  if (t > flash && t < flash + 0.25) veil(g, '#dfe6ff', 0.25 * (1 - prog(t, flash, flash + 0.25)));
  blurLayer(g, 6, (g) => drawFigure(g, { x: E.W * 0.12, y: E.H * 1.02, s: GIANT * 1.6, facing: 1, outfit: TU, pose: POSES.stand, expr: 'scared', rim: { color: M.rim, dir: [1, -0.3] } }), cam, 1.5);
  FX.rain(g, t, { count: 120, a: 0.15 });
} });

// s038 — pantalla final
registerShot('s038', { draw(g, t, info) {
  UI.endScreen(g, t, { question: '¿Y tú qué harías con esa altura?', subscribe: 'Suscríbete', cast: CAST });
  const tp = wt('parte', info, 9.0);
  if (t > 2.3) text(g, '¿Qué alcanzarías primero?', E.W / 2, V(400, 720), { size: V(40, 46), color: alpha(S().ui.cream, 0.85), font: FONTS.ui, weight: 800, alpha: ease.out(prog(t, 2.3, 2.8)) });
  if (t > tp - 0.2) UI.badge(g, { str: 'PARTE 2', x: E.W / 2 + V(150, 180), y: V(560, 1000), a: ease.out(prog(t, tp - 0.2, tp + 0.3)), size: V(46, 56) });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.35 });
} });
