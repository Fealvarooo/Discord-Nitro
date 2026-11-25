// thumbs.js — miniaturas de la parte 2: horizontales (thumbN, 1920×1080) y verticales (shortN, 1080×1920).
import { E, registerShot, mood, layer, blurLayer, veil, backdrop, circle, ring, seg, glow } from '/engine/core.js';
import { drawFigure, POSES, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { fair } from '../sets/world.js';
import { stairs } from '../sets/stairs.js';
import { TU, TOMAS, GIANT, TOMAS_S } from '../cast.js';
import { tomas, CANES, GOLD } from '../shots/01_encuentro.js';

const RED = '#ff5a5a', YEL = '#FFD23F';
const txt = (lines, o = {}) => (E.vertical ? { x: E.W / 2, y: 150, size: o.vs || 190, align: 'center', maxW: E.W * 0.9 } : { x: 80, y: 110, size: o.hs || 200, maxW: E.W * 0.5 });

// 1 — primer plano: Tomás, sonrisa leve, bufanda dorada
function one(g) {
  blurLayer(g, 12, (g) => fair(g, 1, { z: 1.5, y: E.vertical ? -500 : -300, x: 200 })); veil(g, '#060818', 0.3);
  const M = mood('night'), cx = E.vertical ? E.W / 2 : E.W * 0.73, cy = E.H * (E.vertical ? 0.62 : 0.7), r = E.vertical ? 380 : 310;
  bigFace(g, cx, cy, r, { outfit: TOMAS, expr: 'smirk', look: [-0.4, 0.3], rimColor: '#ffd47e', rimSide: -1 });
  seg(g, [[cx - r * 0.75, cy + r * 1.0], [cx + r * 0.75, cy + r * 1.0]], r * 0.2, GOLD); seg(g, [[cx + r * 0.3, cy + r * 1.05], [cx + r * 0.4, cy + r * 1.6]], r * 0.16, GOLD); glow(g, cx, cy + r, r * 1.4, GOLD, 0.35);
  UI.thumbText(g, ['ÉL MIDE', '3,10 M.'], txt());
}
// 2 — Tomás con bastones al pie de la escalera
function two(g) {
  const cam = { z: E.vertical ? 1.4 : 1.3, x: E.vertical ? 60 : 120, y: E.vertical ? 80 : -110 }, { GY, M } = stairs(g, 2, cam);
  layer(g, cam, 1, (g) => tomas(g, { x: E.W / 2 - (E.vertical ? 150 : 120), y: GY, s: (E.vertical ? 1.25 : 1.15) * TOMAS_S, f: 1, M, t: 0, expr: 'sad', look: [0.8, -0.6] }));
  UI.thumbText(g, ['20 AÑOS', { str: 'DESPUÉS.', color: RED }], txt([], { vs: 200 }));
}
// 3 — dilema: tú entre dos relojes 9:00
function clockIcon(g, x, y, r, col) { circle(g, x, y, r, 'rgba(10,14,26,.9)'); ring(g, x, y, r, 8, col); seg(g, [[x, y], [x - r * 0.5, y]], 12, col); seg(g, [[x, y], [x, y - r * 0.75]], 8, col); glow(g, x, y, r * 1.8, col, 0.35); }
function three(g) {
  const M = mood('void'), GY = E.H * (E.vertical ? 0.82 : 0.95); backdrop(g, M.sky); glow(g, E.W / 2, GY - 400, 700, M.rim, 0.18);
  drawFigure(g, { x: E.W / 2, y: GY, s: E.vertical ? 1.6 * GIANT * 0.9 : 2.5, facing: 1, outfit: TU, pose: POSES.handsOnHead, expr: 'nervous', look: [0, -0.3], rim: { color: M.rim, dir: [0, -1], w: 5 } });
  const y = E.H * (E.vertical ? 0.42 : 0.55), dx = E.vertical ? 330 : 520, r = E.vertical ? 120 : 140;
  clockIcon(g, E.W / 2 - dx, y, r, YEL); clockIcon(g, E.W / 2 + dx, y, r, RED);
  UI.thumbText(g, ['¿CANCHA', { str: 'O CUERPO?', color: YEL }], E.vertical ? txt() : { x: E.W / 2, y: 60, size: 170, align: 'center', maxW: E.W * 0.85 });
}
for (const [id, fn] of [['1', one], ['2', two], ['3', three]]) { registerShot('thumb' + id, { draw: fn }); registerShot('short' + id, { draw: fn }); }
