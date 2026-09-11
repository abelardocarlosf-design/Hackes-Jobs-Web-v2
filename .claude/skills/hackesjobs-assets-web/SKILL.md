---
name: hackesjobs-assets-web
description: Procesa el material audiovisual de hackesjobs.com.mx — toma los videos y fotos descargados a mano, los recomprime, genera posters multi-resolución, actualiza el manifiesto tipado que consume el hero y deja registro de procedencia. Usa esta skill SIEMPRE que Abelardo quiera cambiar el video o la foto del hero, refrescar los visuales de la web, o pregunte qué material necesita descargar y de dónde. Triggers — 'cambiar el video del hero', 'poner un video en la web', 'actualizar las imágenes del sitio', 'qué fotos necesito', 'de dónde bajo el video', 'procesar los assets', 'optimizar las imágenes de la web', 'el hero se ve vacío', 'agregar material visual'.
---

# Pipeline de assets de la web

El hero de `hackesjobs.com.mx` está construido para verse **completo sin un solo
byte de video**: el fondo es el motor de evaluación en SVG
(`src/components/brand/EvaluationEngine.tsx`), que pesa ~0 bytes de red.

El video es una **capa opcional de ambiente** que se enciende soltando archivos
en una carpeta y corriendo un comando. No hay que tocar código para activarlo.

## El ciclo completo

```
1. Descargar el material  →  media-src/hero/     (gitignored)
2. npm run assets:hero
3. Revisar el resultado   →  npm run build && npm start
4. Commitear public/assets/hero/ + src/data/hero-media.ts
```

El paso 2 genera:

| Salida | Qué es |
|---|---|
| `public/assets/hero/hero-poster-{960,1440,1920,2560}.{avif,webp}` | Poster responsive, sólo en los anchos que la fuente realmente permite |
| `public/assets/hero/hero-poster.jpg` | Respaldo para navegadores sin AVIF ni WebP |
| `public/assets/hero/hero-{720,1080}.{mp4,webm}` | El loop recomprimido, sin audio |
| `src/data/hero-media.ts` | Manifiesto tipado que consume `HeroVideoLayer` |
| `docs/assets-licencias.md` | Registro de procedencia por archivo |

## Requisitos

- **`npm install`** hecho (el script usa `sharp`, que es devDependency).
- **`ffmpeg` en el PATH** para la parte de video:
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt-get install -y ffmpeg`

Sin `ffmpeg` el script **no falla**: genera los posters, escribe el manifiesto,
deja el registro de licencias y avisa de qué video quedó sin comprimir. Sin
material en la carpeta tampoco falla — sale en 0 y el hero se sirve sólo con el
motor SVG, que es un estado correcto y no un error.

## Qué material descargar

Fuente recomendada: **Pexels** (licencia de uso comercial libre, sin atribución
obligatoria). Nombrar los archivos exactamente así — el script los busca por
nombre.

### `hero-humano.mp4` — la capa humana del hero (elegir 1)

| Video | Por qué |
|---|---|
| [Business People in a Meeting](https://www.pexels.com/video/business-people-in-a-meeting-8853423/) | Reunión de trabajo real, no sonrisas a cámara |
| [Team Meeting](https://www.pexels.com/video/team-meeting-7147921/) | Equipo multicultural, oficina moderna |
| [Office Team Having a Meeting](https://www.pexels.com/video/office-team-having-a-meeting-8033854/) | Buen encuadre lateral, funciona bien atenuado |

### `cdmx-1.mp4`, `cdmx-2.mp4` — Ciudad de México (elegir 1–2)

| Video | Por qué |
|---|---|
| [Aerial View of Mexico City Skyline Skyscrapers](https://www.pexels.com/video/aerial-view-of-mexico-city-skyline-skyscrapers-30772328/) | Reforma y distrito financiero — la toma más reconocible |
| [Timelapse of Reforma Avenue at Night](https://www.pexels.com/video/timelapse-of-reforma-avenue-at-night-in-mexico-city-31875399/) | Nocturna; se ve cara en duotono |
| [Aerial View of Mexico City's Skyline at Day](https://www.pexels.com/video/aerial-view-of-mexico-city-s-skyline-at-day-31014956/) | Diurna limpia |
| [Skyscrapers in Mexico City](https://www.pexels.com/video/skyscrapers-in-mexico-city-12943393/) | Alternativa de dron diurno |

### `retrato-1.mp4` — retrato editorial (opcional)

- [Business Woman Smiling Looking Outside the Window](https://www.pexels.com/video/business-woman-smiling-and-looking-outside-the-window-8124132/)
- [Close-up Portrait of a Woman in Natural Light](https://www.pexels.com/video/close-up-portrait-of-a-woman-in-natural-light-29104912/)

### Especificaciones al descargar

- **Full HD (1920×1080)**. La 4K no aporta nada aquí y el script la baja igual.
- **4–8 segundos** que corten limpio. El script hace el loop, pero ayuda que la
  toma no tenga un movimiento de cámara que "salte" al reiniciar.
- **Sin texto en pantalla y sin logotipos legibles.**
- **Sin caras identificables en primer plano** en el material de oficina. Esto
  es una agencia de reclutamiento: personas de stock como ambiente está bien,
  pero no pueden leerse como candidatos reales colocados por la agencia.

### Qué NO descargar

Volcanes, arcadas coloniales, edificios históricos o "equipo feliz chocando las
manos". Nada de eso entra en el diseño: el sitio dejó de comunicar como agencia
regional precisamente para dejar de usar ese tipo de imagen.

## Presupuesto de peso

El script avisa si algún archivo supera **2.5 MB**. Ocho segundos a 1080p en VP9
con CRF 34 caen entre 700 KB y 1.2 MB. Si algo sale muy por encima, el clip es
demasiado largo o tiene demasiado movimiento: recórtalo.

## Cómo se comporta el video en el sitio

`src/components/brand/HeroVideoLayer.tsx` no reproduce nada a la ligera. El
`<video>` no lleva `autoPlay` —en Chrome anula `preload="none"` y descarga el
archivo igual— y se arranca desde un efecto sólo si:

1. el visitante no pidió `prefers-reduced-motion`,
2. no tiene activado el ahorro de datos,
3. no está en una red 2G,
4. la pantalla mide 768 px o más.

Además se pausa al salir de vista y con la pestaña oculta. En modo claro se
atenúa por CSS (`:root.light .hero-video`), nunca ramificando el JSX por tema —
`next-themes` devuelve `undefined` en servidor y eso rompería la hidratación.

## Apagar el video

Borrar `public/assets/hero/` y volver a poner `poster: null, video: null` en
`src/data/hero-media.ts`. El hero vuelve al motor SVG solo, que es su estado por
defecto y se ve terminado.

## Registro de licencias

`docs/assets-licencias.md` se regenera en cada pasada con una fila por archivo y
la nota `[PENDIENTE]`. **Rellénala a mano** con la URL de origen, el autor y la
licencia. Pexels no exige atribución, pero un cliente corporativo sí puede pedir
que demuestres la procedencia de lo que publicas.
