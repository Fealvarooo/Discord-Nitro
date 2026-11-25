// shots/01_casa.js — cocina, frasco, lámpara (s001–s003, s005).
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, rr, glow, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { kitchen, jar, ground } from '../sets/world.js';
import { TU } from '../cast.js';

const GS = 2.0;                                       // escala del gigante en la cocina
const swingAt = (t, t0, amp = 0.55) => (t < t0 ? 0 : amp * Math.exp(-0.9 * (t - t0)) * Math.sin(3.4 * (t - t0)));
const kcam = (t, dur, z0 = 1.28, z1 = 1.36) => ({ z: lerp(z0, z1, ease.inOut(t / dur)), y: -40, x: -60 });

// s001 — "Te golpeas con la lámpara,"
registerShot('s001', { draw(g, t, info) {
  const hit = 0.5, CX = E.W / 2;
  const [sx, sy] = t > hit ? shake(t, 14 * (1 - prog(t, hit, hit + 0.5)), 3) : [0, 0];
  const cam = { ...kcam(t, info.dur), x: -60 + sx, y: -40 + sy };
  const { GY, M } = kitchen(g, t, cam, { swing: swingAt(t, hit) });
  const x = lerp(CX - 330, CX - 46, ease.out(prog(t, 0, hit)));
  layer(g, cam, 1, (g) => {
    const pose = t < hit ? walkPose(t * Math.PI * 2 * 0.9) : posesAt(t, [[hit, POSES.stand], [hit + 0.25, POSES.handsOnHead]]);
    drawFigure(g, { x, y: GY, s: GS, facing: 1, outfit: TU, pose: t > hit ? breathe(pose, t) : pose, expr: t < hit ? 'neutral' : t < hit + 0.6 ? 'shocked' : 'confused', rim: { color: M.rim, dir: [0, -1] }, blink: (t % 3.1) > 3.0 });
    if (t > hit) { const hy = GY - 440; FX.rings(g, x + 6, hy - 40, t - hit, { count: 2, r0: 30, r1: 160, speed: 1.6, color: '#fff3e0', a: 0.5 * (1 - prog(t, hit, hit + 1)) });
      for (let i = 0; i < 3; i++) { const a = (t - hit) * 4 + i * 2.1; FX.sparkle(g, x + 6 + Math.cos(a) * 70, hy - 70 + Math.sin(a) * 18, 14, '#ffd47e', 0.8 * (1 - prog(t, hit + 0.8, hit + 1.5))); } }
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
} });

// mano grande vista de cerca (detalle)
function bigHand(g, hx, hy, s, sleeve, open = true) {
  const ink = '#0e0b12';
  seg(g, [[hx - 30 * s, hy + 40 * s], [hx - 260 * s, hy + 620 * s]], 70 * s, ink);
  seg(g, [[hx - 90 * s, hy + 190 * s], [hx - 300 * s, hy + 700 * s]], 100 * s, sleeve);
  circle(g, hx, hy, 46 * s, ink);
  for (let i = 0; i < 4; i++) { const a = -1.9 + i * 0.28; const L = open ? 92 : 50; seg(g, [[hx, hy], [hx + Math.cos(a) * L * s, hy + Math.sin(a) * L * s]], 17 * s, ink); }
  seg(g, [[hx + 10 * s, hy + 10 * s], [hx + 70 * s, hy - 10 * s]], 18 * s, ink);
}
// s002 — "el frasco del estante más alto."
registerShot('s002', { draw(g, t, info) {
  const GY = ground(), CX = E.W / 2, jx = CX + 380, jy = GY - 650;
  const cam = { z: lerp(2.3, 2.45, t / info.dur), x: 330, y: jy - E.H / 2 - 120 };
  const grab = 1.0, lift = ease.inOut(prog(t, grab + 0.1, info.dur));
  const { M } = kitchen(g, t, cam, { noJar: true, swing: swingAt(t + 2.0, 0.5) });
  layer(g, cam, 1, (g) => {
    const k = ease.out(prog(t, 0.1, grab));
    const hx = lerp(jx - 260, jx + 26, k), hy = lerp(jy + 260, jy - 40, k) - lift * 60;
    jar(g, jx + (t > grab ? (hx - jx - 26) : 0), jy - (t > grab ? lift * 60 : 0), 1.3);
    bigHand(g, hx, hy, 0.55, TU.color, t < grab - 0.1);
    if (t > grab && t < grab + 0.8) FX.rings(g, jx, jy - 40, t - grab, { count: 2, r0: 20, r1: 120, speed: 1.8, color: '#fff3e0', a: 0.5 });
  });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.4, size: 1.6 });
} });

// s003 — "Sólo lo bajas y saludas a la lámpara."
registerShot('s003', { draw(g, t, info) {
  const cam = { z: lerp(1.5, 1.6, ease.inOut(t / info.dur)), x: 0, y: 40 };
  const { GY, M } = kitchen(g, t, cam, { noJar: false, swing: 0.22 * Math.sin(t * 2.2) * Math.exp(-0.15 * t) });
  const CX = E.W / 2, x = E.W / 2 - 120, wave = 2.0;              // "saludas" ≈ 6,2 s
  layer(g, cam, 1, (g) => {
    const pose = breathe(posesAt(t, [[0, { ...POSES.stand, eB: [10, -132], hB: [26, -110] }], [wave, { ...POSES.wave, eB: [10, -132], hB: [26, -110], eF: [28, -200], hF: [36 + Math.sin(t * 9) * 10, -238] }]]), t);
    drawFigure(g, { x, y: GY, s: GS, facing: 1, outfit: TU, pose, expr: t < wave ? 'smile' : 'smirk', look: [0.6, -0.5], rim: { color: M.rim, dir: [0.6, -1] }, blink: (t % 3.1) > 3.0 });
    jar(g, x + 26 * GS, GY - 116 * GS, 1.1);
  });
  blurLayer(g, 10, (g) => { rr(g, E.W - 260, E.H - 520, 200, 420, 30); g.fillStyle = 'rgba(40,24,30,.9)'; g.fill(); }, cam, 1.6);
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
} });

// s005 — "¿Tú?"  primer plano gigante, mirando hacia abajo
registerShot('s005', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.9, x: -60, y: -420 }, { swing: 0.1 * Math.sin(t * 2) })); veil(g, '#120a10', 0.35);
  const M = mood('interiorWarm'), r = V(300, 330) * (1 + 0.04 * t);
  bigFace(g, E.W / 2, E.H * V(0.6, 0.55), r, { outfit: TU, expr: 'smirk', look: [0.1, 0.55], rimColor: M.rim, rimSide: -1 });
} });
