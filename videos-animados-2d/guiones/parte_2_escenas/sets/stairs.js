// sets/stairs.js — escalera de edificio (interiorCool): la escalera que Tomás ya no puede subir.
import { E, V, mood, layer, linGrad, shade, alpha, glow, seg } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { ground } from './world.js';
export function stairs(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = ground(), CX = E.W / 2, steps = o.steps ?? 12, sw = 90, sh = 46;
  layer(g, cam, 0.6, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 1400, 0, GY, [shade(M.wall, -0.6), shade(M.wall, -0.25)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, E.H * 3);
    g.fillStyle = '#e8f0ff'; g.fillRect(CX + 260, GY - 1250, 60, 14); glow(g, CX + 290, GY - 1240, 360, M.practical, 0.35);
    FX.lightCone(g, CX + 290, GY - 1236, { angle: Math.PI / 2, spread: 0.6, len: 1300, color: M.practical, a: 0.08 });
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, 0.05), M.dark]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2); });
  layer(g, cam, 1, (g) => {
    const x0 = CX - 40;
    for (let i = 0; i < steps; i++) { const x = x0 + i * sw, y = GY - (i + 1) * sh; g.fillStyle = shade(M.wall, -0.45 + (i % 2) * 0.04); g.fillRect(x, y, E.W * 2, sh + 2); g.fillStyle = alpha(M.practical, 0.18); g.fillRect(x, y, E.W * 2, 3); }
    seg(g, [[x0 - 10, GY - 120], [x0 + steps * sw, GY - 120 - steps * sh]], 6, shade(M.wall, 0.2));
  });
  return { GY, CX, M, first: [x0Of(CX), GY] };
}
const x0Of = (CX) => CX - 40;
