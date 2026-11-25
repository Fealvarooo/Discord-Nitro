# Parte 2: ¿Qué pasaría si conocieras a alguien más alto que tú?

**Grabar como:** `que_pasaria_si_conocieras_a_alguien_mas_alto_que_tu.mp3` (de ese nombre salen los títulos).
**Guion para alinear:** `guiones/parte_2_guion.txt`. Al pasarlo junto con la voz, los subtítulos salen exactos.
**Duración estimada:** ~1:40 (236 palabras, mismo ritmo que la parte 1).
**Formato:** 9:16, 1080p, subtítulos, música generada + efectos, estilo `dusk` (igual que la parte 1).

## Reparto (mismos colores que la parte 1)
| id | papel | ropa | color |
|---|---|---|---|
| TU | tú, el gigante (2,75 m) | conjunto deportivo | morado `#8a5ad6` |
| LEO | hermanito | niño, gorra roja | rojo `#d64a33` |
| TOMÁS | el hombre de 3,10 m (la silueta del final de la parte 1) | gabardina + sombrero + lentes, 2 bastones | gris oscuro, se rompe con una bufanda dorada `#f2c21a` cuando sonríe |
| DOCTORA | aparece solo en el papel / plano técnico | bata blanca + lentes | blanco |

## Lugares (casi todos ya existen en `persona-mas-alta/scenes/sets/world.js`)
- **fair** (noche): continúa justo donde terminó la parte 1.
- **fog** (storm): la llegada de Tomás tapando la luna.
- **blueprint**: alturas 2,75 vs 3,10, ley cuadrado-cubo, hipófisis.
- **stairs** (nuevo, interiorCool): Tomás frente a una escalera que no puede subir (recuerdo).
- **court** (dusk): flashback, Tomás joven y campeón; luego la cancha de mañana.
- **bedroom** (noche): final, Leo y tú, el papel en la mesa.

## Plan de tomas (≈ 36 tomas)
| parte | líneas | tomas clave |
|---|---|---|
| Gancho | sombra tapa la luna, mirar hacia arriba | contrapicado: la luna se apaga; primer plano tuyo mirando arriba por primera vez (sorpresa) |
| Tomás | 3,10 m, 35 cm más | plano técnico: tú 2,75 junto a Tomás 3,10, cota y "+35 cm" |
| Diálogo | "Te vi levantar…" / "Yo elegí el contrato." | primer plano de Tomás (único que mueve la boca), anillos de voz |
| Pasado | campeón hace 20 años / escalera | flashback en la cancha (tono dorado, trofeo) → corte frío a la escalera |
| Ternura | Leo y el clima / "Nublado, pequeño." | Leo mira hacia arriba a Tomás; Tomás sonríe por primera vez (aparece la bufanda) |
| Ciencia | por qué nadie llega a 3 m | "¿ES REAL TODO ESTO?" → cubo que se duplica: huesos ×4, peso ×8, barras; esqueleto que "pierde la carrera" |
| Hipófisis | glándula del tamaño de un guisante | plano técnico de la cabeza: punto dorado que late y envía flechas "CRECE" |
| El papel | dirección, doctora | detalle: papel en la mano gigante, nombre "DRA." |
| Dilema | mañana a las nueve (×2) | dos relojes 9:00 lado a lado: CANCHA / DOCTORA → congelado |
| Cierre | Leo toma tu mano | dormitorio de noche, la mano de Leo en tu dedo; primer plano de Leo preguntando |
| Final | pregunta + suscripción | pantalla final con TU, LEO y TOMÁS; insignia PARTE 3 |

## Datos que salen en pantalla (verificados)
- Récord histórico: 2,72 m (Robert Wadlow). Tú: 2,75 m. Tomás: 3,10 m (ficción).
- Ley cuadrado-cubo: altura ×2 → resistencia de los huesos ×4 (área), peso ×8 (volumen).
- La hormona del crecimiento la produce la hipófisis, una glándula del tamaño de un guisante en la base del cerebro.

## Cuando llegue la voz
1. `python tools/new_project.py --name persona-mas-alta-2 --voice "<voz>" --script guiones/parte_2_guion.txt --aspect 9:16 --resolution 1080p --title "¿Qué pasaría si conocieras a alguien más alto que tú?" --captions`
2. `python tools/transcribe.py --project projects/persona-mas-alta-2 --script projects/persona-mas-alta-2/input/script.txt --lang es --model small`
3. Copiar `cast.js` y `sets/world.js` de la parte 1, ajustar tiempos en `shots.json` y construir las tomas nuevas.
