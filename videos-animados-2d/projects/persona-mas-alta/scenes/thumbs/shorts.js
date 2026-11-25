// shorts.js — miniaturas verticales para Shorts (1080×1920). Texto arriba, sujeto al centro, nada en el cuarto inferior.
import { E, registerShot, mood, layer, blurLayer, veil, seg, ring, glow } from '/engine/core.js';
import { drawFigure, POSES, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kitchen, fair, PERSON } from '../sets/world.js';
import { TU, LEO, GIANT } from '../cast.js';

const TXT = { x: E.W / 2, y: 150, size: 170, align: 'center', maxW: 1080 * 0.9 };

registerShot('short1', { draw(g) {
  blurLayer(g, 12, (g) => kitchen(g, 1, { z: 1.6, x: -100, y: -150 }, { swing: 0.3 })); veil(g, '#120a10', 0.3);
  const M = mood('interiorWarm'), cx = E.W / 2, cy = E.H * 0.6, r = 400;
  seg(g, [[cx - 40, 300], [cx + 40, cy - r - 70]], 6, '#0e0b12');
  g.save(); g.translate(cx + 40, cy - r - 40); g.rotate(0.3); g.fillStyle = '#2a1c22'; g.beginPath(); g.moveTo(-50, -60); g.lineTo(50, -60); g.lineTo(130, 12); g.lineTo(-130, 12); g.closePath(); g.fill(); g.fillStyle = '#ffe2a8'; g.beginPath(); g.ellipse(0, 12, 130, 18, 0, 0, 7); g.fill(); g.restore();
  glow(g, cx + 40, cy - r - 20, 460, M.practical, 0.6);
  bigFace(g, cx, cy, r, { outfit: TU, expr: 'smirk', look: [0.2, -0.4], rimColor: M.rim, rimSide: -1 });
  for (let i = 0; i < 3; i++) FX.sparkle(g, cx - 180 + i * 180, cy - r - 30 + (i % 2) * 40, 34, '#ffd47e', 0.9);
  UI.thumbText(g, ['MIDES', '2,75 M.'], { ...TXT, size: 210 });
} });

const BENT = { head: [34, -178], sh: [24, -150], hip: [0, -100], eF: [36, -112], hF: [30, -62], eB: [24, -114], hB: [18, -62], kF: [18, -54], fF: [8, 0], kB: [4, -52], fB: [-12, 0] };
registerShot('short2', { draw(g) {
  blurLayer(g, 10, (g) => fair(g, 2, { z: 1.3, y: -200 })); veil(g, '#060818', 0.4);
  const M = mood('night'), GY = E.H * 0.8, x = E.W / 2 - 40, s = 4.6;
  FX.pool(g, x, GY + 20, 460, 70, '#ff6f61', 0.25);
  drawFigure(g, { x, y: GY, s, facing: 1, outfit: TU, pose: BENT, expr: 'scared', rim: { color: M.rim, dir: [0.3, -1], w: 5 } });
  for (const k of [BENT.kF, BENT.kB]) { const kx = x + k[0] * s, ky = GY + k[1] * s; glow(g, kx, ky, 200, '#ff5a5a', 0.8); ring(g, kx, ky, 60, 9, '#ff8a7a'); }
  UI.thumbText(g, ['TUS RODILLAS', { str: 'NO AGUANTAN.', color: '#ff5a5a' }], { ...TXT, size: 140 });
} });

registerShot('short3', { draw(g) {
  const cam = { z: 1.15, y: -150 }, { GY, M } = fair(g, 3, cam);
  layer(g, cam, 1, (g) => {
    for (let r = 0; r < 2; r++) for (let i = 0; i < 10; i++) { const px = -20 + i * 125 + r * 60; if (Math.abs(px - E.W * 0.33) < 70 || Math.abs(px - E.W * 0.72) < 90) continue;
      drawFigure(g, { x: px, y: GY + r * 70, s: 0.95 + r * 0.1, facing: i % 2 ? 1 : -1, outfit: PERSON, pose: POSES.stand, expr: 'neutral', rim: { color: M.rim, dir: [0, -1] }, dim: true }); }
    drawFigure(g, { x: E.W * 0.33, y: GY - 40, s: 1.05 * GIANT * 1.25, facing: 1, outfit: TU, pose: POSES.phone, prop: { type: 'phone', glow: '#9fd8ff' }, expr: 'worried', look: [1, 0.3], rim: { color: M.rim, dir: [0, -1], w: 5 } });
    drawFigure(g, { x: E.W * 0.72, y: GY + 210, s: 1.8, facing: -1, outfit: LEO, pose: POSES.sad, expr: 'cry', rim: { color: M.practical, dir: [0, -1] } });
    glow(g, E.W * 0.72, GY - 60, 300, LEO.headColor, 0.5);
  });
  UI.thumbText(g, ['¿CONTRATO', { str: 'O LEO?', color: '#FFD23F' }], { ...TXT, size: 190 });
} });
