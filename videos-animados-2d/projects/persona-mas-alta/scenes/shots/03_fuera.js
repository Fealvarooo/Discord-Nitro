// shots/03_fuera.js — cancha (3D + 2D), puerta, frente, cama, corazón y calle con Leo (s012–s017, s019–s022).
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, talkAmount, seg, circle, rr, glow, alpha, shade } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { court, house, bedroom, street, ground } from '../sets/world.js';
import { TU, LEO, GIANT } from '../cast.js';

const wt = (w, info, fb) => (wordTime(w, info.shot.start - 0.05) ?? info.shot.start + fb) - info.shot.start;
const PEOPLE = { top: 'none', head: 'none' };

// s012 — 3D: cancha al atardecer, órbita alrededor del gigante y el aro
registerShot('s012', {
  kind: '3d',
  init(T) {
    const M = mood('dusk'), { THREE } = T;
    const st = T.stage({ mood: 'dusk', fov: V(34, 50), fog: [16, 60], keyPos: [-10, 6, -8], keyIntensity: 2.6, ambient: 1.2 });
    st.add(T.ground(80, 80, '#4a3040', T.tiles('#4a3040', 6, [8, 8])));
    for (let i = 0; i < 9; i++) { const b = T.building(5, 8 + (i * 7) % 14, 5, { color: '#2a1f36', win: M.practical, lit: 0.35, seed: i + 2 }); b.position.set(-24 + i * 6, 0, -22 - (i % 3) * 4); st.add(b); }
    for (const x of [-9, 9]) { st.add(T.cyl(0.12, 0.15, 10, '#15101c', x, 5, -7)); const l = T.box(1.8, 0.6, 0.3, '#fff2d6', x, 10, -7); l.material = T.basic('#fff2d6'); st.add(l); }
    for (let x = -14; x <= 14; x += 2) st.add(T.box(0.05, 3, 0.05, '#1a1420', x, 1.5, -6));
    const fence = T.box(28, 3, 0.02, '#1a1420', 0, 1.5, -6); fence.material = T.mat('#1a1420', { transparent: true, opacity: 0.35 }); st.add(fence);
    st.add(T.cyl(0.09, 0.09, 3.9, '#16111c', 2.6, 1.95, 0), T.box(1.0, 0.1, 0.1, '#16111c', 2.1, 3.7, 0));
    const board = T.box(0.06, 1.05, 1.8, '#ece6dc', 1.62, 3.45, 0); st.add(board);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.02, 8, 28), T.mat('#e2622e')); rim.rotation.x = Math.PI / 2; rim.position.set(1.36, 3.05, 0); st.add(rim);
    const net = T.cyl(0.23, 0.15, 0.4, '#f0ece4', 1.36, 2.84, 0); net.material = T.mat('#f0ece4', { transparent: true, opacity: 0.35, wireframe: true }); st.add(net);
    const you = T.figure3D(TU, { rim: M.rim, pose: POSES.stand, s: GIANT }); you.position.set(0.2, 0, 0); st.add(you);
    const kid = T.figure3D(PEOPLE, { rim: M.rim, pose: POSES.stand }); kid.position.set(-1.6, 0, 1.2); kid.rotation.y = -0.6; st.add(kid);
    return { stage: st, you };
  },
  draw(s, t, info, T) {
    s.you.setPose(posesAt(t, [[0, POSES.stand], [2.6, { ...POSES.stand, eF: [16, -215], hF: [28, -262] }]]));
    T.orbit(s.stage.camera, t, { target: [0.6, 1.9, 0], radius: V(7.5, 9.5), height: [1.2, 2.4], from: -1.2, to: -0.3, dur: info.dur });
  },
  overlay(g, t, info) {
    const t3 = wt('tres', info, 2.9);
    UI.readout(g, { label: 'ARO:', value: '3,05 m', x: E.W / 2, y: E.H * V(0.16, 0.2), align: 'center', a: ease.out(prog(t, t3 - 0.1, t3 + 0.3)) });
    UI.badge(g, { str: 'A FAVOR', x: E.W / 2 + V(60, 100), y: E.H * V(0.08, 0.12), a: ease.out(prog(t, 0.6, 1.0)) * clamp((info.dur - t) / 0.3) });
  },
});

// s013 — "Lo tocas sin saltar."
registerShot('s013', { draw(g, t, info) {
  const touch = 0.55, cam = { z: lerp(1.12, 1.2, ease.inOut(t / info.dur)), x: 70, y: -80 };
  const { GY, M, rim } = court(g, t, cam, { rimGlow: t > touch ? 0.6 * (1 - prog(t, touch + 0.6, info.dur)) : 0 });
  const s = 1.4 * GIANT, x = E.W / 2 + 140;
  layer(g, cam, 1, (g) => {
    const pose = breathe(posesAt(t, [[0, POSES.stand], [touch, { ...POSES.stand, eF: [16, -215], hF: [28, -262] }]]), t);
    drawFigure(g, { x, y: GY, s, facing: 1, outfit: TU, pose, expr: t < touch ? 'neutral' : 'happy', look: [0.4, -0.8], rim: { color: M.rim, dir: [-0.7, -0.6] } });
    if (t > touch) FX.rings(g, rim[0], rim[1], t - touch, { count: 3, r0: 30, r1: 200, speed: 1.2, color: '#ffe7b8', a: 0.5 * (1 - prog(t, touch, info.dur)) });
    seg(g, [[x - 30, GY + 4], [x + 50, GY + 4]], 3, alpha('#ffe7b8', 0.5 * clamp(t - touch)));
  });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.35 });
  FX.lensStreak(g, E.W * 0.2, E.H * 0.28, E.W * 1.2, '#ffe0b0', 0.16);
} });

// s014 — "En contra, las puertas miden unos dos metros."
registerShot('s014', { draw(g, t, info) {
  const cam = { z: lerp(1.15, 1.22, ease.inOut(t / info.dur)), x: 20, y: -40 };
  const { GY, M, door } = house(g, t, cam);
  const s = 1.4 * GIANT, stop = 1.6, x = lerp(E.W / 2 - 520, E.W / 2 - 80, ease.out(prog(t, 0, stop)));
  layer(g, cam, 1, (g) => {
    const pose = t < stop ? walkPose(t * Math.PI * 2 * 0.8) : breathe(POSES.stand, t);
    drawFigure(g, { x, y: GY, s, facing: 1, outfit: TU, pose, expr: t > stop + 0.5 ? 'worried' : 'neutral', look: t > stop ? [0.6, 0.2] : [1, 0], rim: { color: M.rim, dir: [1, -0.4] } });
    UI.dimension(g, t, { x1: door.x - 46, y1: GY, x2: door.x - 46, y2: GY - door.h, str: '2 m', start: wt('dos', info, 2.2) - 0.4 });
  });
  UI.badge(g, { str: 'EN CONTRA', color: mood('dusk').rim, x: E.W / 2 + V(60, 140), y: E.H * V(0.08, 0.12), a: ease.out(prog(t, 0.3, 0.7)) * clamp((info.dur - t) / 0.3) });
  FX.dust(g, t, { count: 30 });
} });

// s015 — "Tu frente lo sabe."  la frente choca con el marco
registerShot('s015', { draw(g, t, info) {
  const hit = 0.28, [sx, sy] = t > hit ? shake(t, 22 * (1 - prog(t, hit, hit + 0.6)), 4) : [0, 0];
  g.save(); g.translate(sx, sy);
  blurLayer(g, 12, (g) => house(g, t, { z: 1.8, x: 260, y: -520 })); veil(g, '#120a10', 0.35);
  const M = mood('interiorWarm'), r = V(300, 330), cy0 = E.H * V(0.6, 0.56);
  const up = t < hit ? ease.in(prog(t, 0, hit)) : 1 - 0.35 * ease.out(prog(t, hit, hit + 0.5));
  const cy = cy0 - 70 * up, ly = cy0 - r * 1.02 - 70;
  bigFace(g, E.W / 2, cy, r, { outfit: TU, expr: t < hit ? 'neutral' : t < hit + 0.5 ? 'shocked' : 'sad', look: [0, -0.3], rimColor: M.rim, rimSide: 1, tilt: t > hit ? -0.05 : 0 });
  g.fillStyle = shade(M.wall, -0.72); g.fillRect(-E.W, -E.H, E.W * 3, ly + E.H); g.fillStyle = alpha(M.practical, 0.35); g.fillRect(-E.W, ly - 6, E.W * 3, 6);
  if (t > hit) { FX.rings(g, E.W / 2, ly + 30, t - hit, { count: 3, r0: 40, r1: 300, speed: 1.4, color: '#fff3e0', a: 0.6 * (1 - prog(t, hit, hit + 1)) });
    for (let i = 0; i < 4; i++) { const a = (t - hit) * 3 + i * 1.57; FX.sparkle(g, E.W / 2 + Math.cos(a) * r * 0.8, ly + 70 + Math.sin(a) * 30, 22, '#ffd47e', 0.9); } }
  g.restore();
} });

// s016 — "Las camas suelen medir un metro noventa."
registerShot('s016', { draw(g, t, info) {
  const cam = { z: lerp(1.45, 1.55, ease.inOut(t / info.dur)), x: -40, y: 170 };
  const { GY, M, m, bed } = bedroom(g, t, cam);
  const s = 1.15 * GIANT, hipX = bed.x + 70 + 108 * s;
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: hipX, y: bed.top - 12 + 100 * s, s, facing: 1, rot: -Math.PI / 2, outfit: TU, pose: POSES.lie, expr: 'worried', look: [0.6, -0.4], rim: { color: M.rim, dir: [0, -1] }, blink: (t % 3.3) > 3.2 });
    rr(g, bed.x + 140, bed.top - 30, hipX - bed.x - 70, 44, 14); g.fillStyle = '#5a6aac'; g.fill();
    UI.dimension(g, t, { x1: bed.x, y1: bed.top - 150, x2: bed.x + bed.len, y2: bed.top - 150, str: '1,90 m', color: mood('dusk').rim, start: wt('metro', info, 1.7) - 0.5 });
  });
  FX.dust(g, t, { count: 30, color: '#c9d4ff', a: 0.3 });
} });

// s017 — "¿El problema?"
registerShot('s017', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.8, x: 60, y: -200 })); veil(g, '#060818', 0.4);
  const M = mood('night'), r = V(300, 330) * (1 + 0.04 * t);
  bigFace(g, E.W / 2, E.H * V(0.6, 0.55), r, { outfit: TU, expr: 'worried', look: [-0.3, -0.2], rimColor: M.rim, rimSide: 1, blink: (t % 2.9) > 2.8 });
} });

// s019 — "Y la gente mira."
registerShot('s019', { draw(g, t, info) {
  const gx = lerp(E.W / 2 - 260, E.W / 2 + 60, t / info.dur), cam = { z: 1.35, x: (gx - E.W / 2) * 0.6, y: 60 };
  const { GY, M } = street(g, t, cam), rim = { color: M.rim, dir: [0.5, -1] };
  layer(g, cam, 1, (g) => {
    [[-330, 1], [-200, 1], [260, -1], [400, -1]].forEach(([dx, f], i) => { const px = E.W / 2 + dx, turn = prog(t, 0.2 + i * 0.12, 0.6 + i * 0.12);
      drawFigure(g, { x: px, y: GY, s: 1, facing: turn > 0.5 ? Math.sign(gx - px) || f : f, outfit: PEOPLE, pose: breathe(POSES.stand, t, 1, i + 3), expr: turn > 0.5 ? 'surprised' : 'neutral', look: [Math.sign(gx - px) * 0.3, -0.9 * turn], rim }); });
    drawFigure(g, { x: gx, y: GY, s: GIANT, facing: 1, outfit: TU, pose: walkPose(t * Math.PI * 2 * 0.8), expr: 'neutral', rim });
  });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.3 });
} });

// calle, plano medio con Leo
function leoScene(g, t, info, o) {
  const cam = { z: o.z ?? 1.3, x: o.cx ?? 0, y: o.cy ?? -10 };
  const { GY, M } = street(g, t, cam), b = 1.4, rim = { color: M.rim, dir: [0.4, -1] };
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: o.gx, y: GY, s: b * GIANT, facing: o.gf, outfit: TU, pose: breathe(o.gPose || POSES.stand, t), expr: o.gExpr || 'smile', look: o.gLook || [0.6, 0.6], rim, blink: (t % 3.1) > 3.0 });
    drawFigure(g, { x: o.lx, y: GY, s: b, facing: o.lf, outfit: LEO, pose: breathe(o.lPose || POSES.stand, t, 1, 4), expr: o.lExpr || 'happy', look: o.lLook || [0.3, -1], rim, blink: (t % 2.7) > 2.6 });
  });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.3 });
}
// s020 — "¿Tu hermanito Leo? No."
registerShot('s020', { draw(g, t, info) {
  const no = wt('No.', info, 1.2), shakeHead = t > no ? Math.sin((t - no) * 14) : 0;
  leoScene(g, t, info, { z: lerp(1.25, 1.32, t / info.dur), gx: E.W / 2 + 140, gf: -1, lx: E.W / 2 - 170, lf: 1,
    lPose: posesAt(t, [[0, POSES.stand], [0.25, POSES.wave]]), lExpr: t > no ? 'smile' : 'happy', lLook: t > no ? [shakeHead, -0.6] : [0.4, -1], gLook: [-0.6, 0.7] });
  if (t < 0.6) FX.rings(g, E.W / 2 - 170, ground() - 200, t, { count: 2, r0: 20, r1: 120, color: '#fff3e0', a: 0.4 });
} });
// s021 — "Él pregunta siempre lo mismo."  de la mano, Leo mira hacia arriba
registerShot('s021', { draw(g, t, info) {
  const gx = E.W / 2 - 40, s = 1.4 * GIANT;
  leoScene(g, t, info, { z: lerp(1.35, 1.25, ease.inOut(t / info.dur)), cy: 40, gx, gf: 1, lx: gx + 13 * s + 22 * 1.008 + 6, lf: -1,
    lPose: { ...POSES.pointUp, eF: [16, -196], hF: [22, -244] }, lLook: [-0.3, -1], lExpr: 'happy', gLook: [0.5, 0.8], gExpr: 'smile' });
} });
// s022 — "¿Cómo está el clima allá arriba?"  Leo pregunta (primer plano, mueve la boca)
registerShot('s022', { draw(g, t, info) {
  blurLayer(g, 14, (g) => street(g, t, { z: 1.7, x: -200, y: -500 })); veil(g, '#120a10', 0.3);
  const M = mood('dusk'), r = V(290, 320) * (1 + 0.03 * t), cx = E.W / 2 + V(80, 0), cy = E.H * V(0.62, 0.57);
  const talk = talkAmount(info.globalT, 54.42, 55.8);
  bigFace(g, cx, cy, r, { outfit: LEO, expr: 'happy', talk, look: [0.2, -0.9], rimColor: M.rim, rimSide: -1, blink: (t % 2.9) > 2.8 });
  if (talk > 0) FX.rings(g, cx, cy, t, { count: 3, r0: r * 1.1, r1: r * 1.6, color: '#fff3e0', a: 0.35 });
} });
