// thumbs.js — miniaturas horizontales (thumbN) y verticales (shortN).
import { E, registerShot, mood, layer, blurLayer, veil, glow } from '/engine/core.js';
import { drawFigure, POSES, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kitchen, street } from '../sets/world.js';
import { liarNum, table } from '../sets/extra.js';
import { TU, MAMA, HOMBRE, PERSON } from '../cast.js';

const PINK = '#ff9ac8', YEL = '#FFD23F';
const txt = (o = {}) => (E.vertical ? { x: E.W / 2, y: 150, size: o.vs || 190, align: 'center', maxW: E.W * 0.9 } : { x: 80, y: 110, size: o.hs || 190, maxW: E.W * 0.5 });

function one(g) {
  blurLayer(g, 12, (g) => kitchen(g, 1, { z: 1.5, x: 100, y: E.vertical ? -400 : -250 }, { noJar: true })); veil(g, '#120a10', 0.3);
  const cx = E.vertical ? E.W / 2 : E.W * 0.72, cy = E.H * (E.vertical ? 0.66 : 0.68), r = E.vertical ? 330 : 280;
  bigFace(g, cx, cy, r, { outfit: MAMA, expr: 'smile', look: [-0.3, 0.2], rimColor: '#ffcf8f', rimSide: 1 });
  liarNum(g, cx, cy - r - (E.vertical ? 170 : 110), 340, { size: E.vertical ? 120 : 90, color: PINK });
  UI.thumbText(g, ['TU MAMÁ:', { str: '340.', color: PINK }], txt());
}
function two(g) {
  const cam = { z: E.vertical ? 1.5 : 1.25, x: 40, y: E.vertical ? -20 : -120 }, { GY, M } = kitchen(g, 2, cam, { noJar: true, lampDX: 0 });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 - 230, y: GY, s: 1.45, facing: 1, outfit: TU, pose: POSES.sit, expr: 'sad', look: [0.6, -0.4], rim: { color: M.rim, dir: [0.3, -1] }, shadow: false });
    const o = { x: E.W / 2 + 130, y: GY, s: 1.45, facing: -1, outfit: MAMA, pose: POSES.relaxed, expr: 'smile', look: [-0.6, 0.3], rim: { color: M.rim, dir: [0.3, -1] } }; drawFigure(g, o);
    const [hx, hy, hr] = headPos(o); liarNum(g, hx, hy - hr - 80, 341, { size: 56, color: PINK });
    table(g, E.W / 2, GY, 520, [{ x: -150, food: true, steam: true }], { t: 0.4 });
  });
  UI.thumbText(g, ['YA', { str: 'COMÍ.', color: PINK }], txt({ hs: 220, vs: 230 }));
}
function three(g) {
  const cam = { z: E.vertical ? 1.35 : 1.15, x: E.vertical ? 100 : 0, y: E.vertical ? -80 : -170 }, { GY, M } = street(g, 3, cam);
  layer(g, cam, 1, (g) => {
    [[-700, 5], [-540, 18], [-380, 2], [-220, 11], [240, 7], [400, 23], [560, 1], [720, 9]].forEach(([dx, n], i) => { const o = { x: E.W / 2 + dx * (E.vertical ? 0.6 : 1), y: GY + (i % 2) * 30, s: 1.0, facing: dx < 0 ? 1 : -1, outfit: PERSON, pose: POSES.stand, expr: 'neutral', rim: { color: M.rim, dir: [0, -1] }, dim: true }; drawFigure(g, o); const [hx, hy, hr] = headPos(o); liarNum(g, hx, hy - hr - 60, n, { size: 34, a: 0.8 }); });
    const o = { x: E.W / 2 + (E.vertical ? 30 : 0), y: GY - 10, s: 1.45, facing: -1, outfit: HOMBRE, pose: POSES.stand, expr: 'smirk', rim: { color: '#cfe0ff', dir: [0, -1], w: 5 } }; drawFigure(g, o);
    const [hx, hy, hr] = headPos(o); glow(g, hx, hy - hr - 110, 260, '#cfe0ff', 0.4); liarNum(g, hx, hy - hr - 110, 0, { size: 80 });
  });
  UI.thumbText(g, ['SU NÚMERO:', { str: '0.', color: '#cfe0ff' }], E.vertical ? txt({ vs: 170 }) : { x: E.W / 2, y: 60, size: 160, align: 'center', maxW: E.W * 0.85 });
}
for (const [id, fn] of [['1', one], ['2', two], ['3', three]]) { registerShot('thumb' + id, { draw: fn }); registerShot('short' + id, { draw: fn }); }
