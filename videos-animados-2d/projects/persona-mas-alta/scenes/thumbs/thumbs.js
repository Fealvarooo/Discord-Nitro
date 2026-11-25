// thumbs.js — 3 miniaturas 1280×720 (lógico 1920×1080).
import { E, registerShot, mood, layer, blurLayer, veil, seg, ring, glow, alpha } from '/engine/core.js';
import { drawFigure, POSES, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kitchen, fair, ground, PERSON } from '../sets/world.js';
import { TU, LEO, GIANT } from '../cast.js';

// 1 — primer plano + prueba: la cara pícara del gigante chocando con la lámpara
registerShot('thumb1', { draw(g) {
  blurLayer(g, 12, (g) => kitchen(g, 1, { z: 1.5, x: -300, y: -150 }, { swing: 0.3 })); veil(g, '#120a10', 0.35);
  const M = mood('interiorWarm'), cx = E.W * 0.7, cy = E.H * 0.6, r = 360;
  // lámpara golpeando la cabeza
  seg(g, [[cx - 120, -50], [cx - 60, cy - r - 70]], 6, '#0e0b12');
  g.save(); g.translate(cx - 60, cy - r - 40); g.rotate(0.35); g.fillStyle = '#2a1c22'; g.beginPath(); g.moveTo(-40, -50); g.lineTo(40, -50); g.lineTo(110, 10); g.lineTo(-110, 10); g.closePath(); g.fill(); g.fillStyle = '#ffe2a8'; g.beginPath(); g.ellipse(0, 10, 110, 16, 0, 0, 7); g.fill(); g.restore();
  glow(g, cx - 60, cy - r - 20, 380, M.practical, 0.6);
  bigFace(g, cx, cy, r, { outfit: TU, expr: 'smirk', look: [-0.4, -0.3], rimColor: M.rim, rimSide: -1 });
  for (let i = 0; i < 3; i++) FX.sparkle(g, cx - 200 + i * 150, cy - r - 40 + (i % 2) * 30, 30, '#ffd47e', 0.9);
  UI.thumbText(g, ['MIDES', '2,75 M.'], { x: 90, y: 120, size: 200 });
} });

// 2 — acción: cuerpo entero, rodillas al rojo vivo
const BENT = { head: [34, -178], sh: [24, -150], hip: [0, -100], eF: [36, -112], hF: [30, -62], eB: [24, -114], hB: [18, -62], kF: [18, -54], fF: [8, 0], kB: [4, -52], fB: [-12, 0] };
registerShot('thumb2', { draw(g) {
  blurLayer(g, 10, (g) => fair(g, 2, { z: 1.2, y: -150 })); veil(g, '#060818', 0.4);
  const M = mood('night'), GY = E.H * 0.97, x = E.W * 0.7, s = 3.7;
  FX.pool(g, x, GY + 20, 420, 60, '#ff6f61', 0.25);
  drawFigure(g, { x, y: GY, s, facing: 1, outfit: TU, pose: BENT, expr: 'scared', rim: { color: M.rim, dir: [0.3, -1], w: 5 } });
  for (const k of [BENT.kF, BENT.kB]) { const kx = x + k[0] * s, ky = GY + k[1] * s; glow(g, kx, ky, 170, '#ff5a5a', 0.8); ring(g, kx, ky, 52, 8, '#ff8a7a'); }
  UI.thumbText(g, ['TUS RODILLAS', { str: 'NO AGUANTAN.', color: '#ff5a5a' }], { x: 80, y: 110, size: 150, maxW: E.W * 0.55 });
} });

// 3 — escena abierta + dilema: el gigante sobre la multitud, una gorra roja lejos
registerShot('thumb3', { draw(g) {
  const cam = { z: 1.05, y: -40 }, { GY, M } = fair(g, 3, cam);
  layer(g, cam, 1, (g) => {
    for (let r = 0; r < 2; r++) for (let i = 0; i < 16; i++) { const px = 40 + i * 125 + r * 60; if (Math.abs(px - E.W * 0.42) < 80) continue;
      drawFigure(g, { x: px, y: GY + r * 60, s: 0.9 + r * 0.1, facing: i % 2 ? 1 : -1, outfit: PERSON, pose: POSES.stand, expr: 'neutral', rim: { color: M.rim, dir: [0, -1] }, dim: true }); }
    drawFigure(g, { x: E.W * 0.25, y: GY - 60, s: 0.95 * GIANT * 1.2, facing: 1, outfit: TU, pose: POSES.phone, prop: { type: 'phone', glow: '#9fd8ff' }, expr: 'worried', look: [1, 0.3], rim: { color: M.rim, dir: [0, -1], w: 5 } });
    drawFigure(g, { x: E.W * 0.78, y: GY + 190, s: 1.7, facing: -1, outfit: LEO, pose: POSES.sad, expr: 'cry', rim: { color: M.practical, dir: [0, -1] } });
    glow(g, E.W * 0.78, GY - 70, 300, LEO.headColor, 0.5);
  });
  UI.thumbText(g, ['¿CONTRATO', { str: 'O LEO?', color: '#FFD23F' }], { x: E.W / 2, y: 70, size: 180, align: 'center', maxW: E.W * 0.8 });
} });
