#!/usr/bin/env node
/**
 * Pipeline del material audiovisual del hero.
 *
 *   npm run assets:hero
 *
 * Entrada:  media-src/hero/   (gitignored — ahí van los archivos descargados)
 * Salida:   public/assets/hero/       posters y videos servibles
 *           src/data/hero-media.ts    manifiesto tipado que consume el hero
 *           docs/assets-licencias.md  registro de procedencia
 *
 * Es deliberadamente tolerante: si no hay material, o no hay ffmpeg, o no hay
 * sharp, hace todo lo que sí puede y termina en 0. El hero está construido para
 * verse completo sin un solo byte de video, así que este script nunca debe ser
 * un bloqueo para desplegar.
 *
 * Se mantiene aparte de `process-brand-assets.js` a propósito: aquél reescribe
 * `public/assets/brand-manifest.json`, del que depende `EmpresaLogo.tsx`, y un
 * fallo de codificación de video no puede dejar ese archivo a medias.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'media-src', 'hero');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'hero');
const MANIFEST_TS = path.join(ROOT, 'src', 'data', 'hero-media.ts');
const LICENSES_MD = path.join(ROOT, 'docs', 'assets-licencias.md');

const POSTER_WIDTHS = [960, 1440, 1920, 2560];
const VIDEO_HEIGHTS = [720, 1080];

/** Un loop de hero por encima de esto se nota en la barra de carga. */
const BUDGET_BYTES = 2.5 * 1024 * 1024;

const VIDEO_RE = /\.(mp4|mov|webm|m4v)$/i;
const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;

const log = (...a) => console.log(' ', ...a);
const warn = (...a) => console.warn(' ⚠', ...a);

/* ─── Detección de herramientas ──────────────────────────────────────── */

function hasBinary(bin) {
  // spawnSync y no `which`: funciona igual en Windows.
  const r = spawnSync(bin, ['-version'], { stdio: 'ignore' });
  return !r.error && r.status === 0;
}

function loadSharp() {
  try {
    return require('sharp');
  } catch {
    return null;
  }
}

/* ─── Utilidades ─────────────────────────────────────────────────────── */

/** Escribe a un temporal y renombra: un fallo a medias no corrompe la salida. */
function atomic(target, run) {
  const tmp = `${target}.tmp-${process.pid}`;
  try {
    run(tmp);
    fs.renameSync(tmp, target);
    return true;
  } catch (err) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    throw err;
  }
}

function ffprobeDuration(file) {
  const r = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'csv=p=0',
    file,
  ], { encoding: 'utf8' });
  const n = parseFloat((r.stdout || '').trim());
  return Number.isFinite(n) ? n : 0;
}

function mb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/* ─── Posters ────────────────────────────────────────────────────────── */

async function buildPosters(sharp, srcImage) {
  const meta = await sharp(srcImage).metadata();

  // El bug que traía `process-brand-assets.js`: con `withoutEnlargement: true`
  // cualquier ancho mayor que el original es un no-op y aun así se escribía el
  // archivo, de modo que el `-1920` salía byte-idéntico al `-1280`. Aquí los
  // anchos se filtran contra el ancho real y el manifiesto sólo anuncia los
  // que existen.
  const widths = POSTER_WIDTHS.filter((w) => w <= meta.width);
  if (widths.length === 0) widths.push(meta.width);

  const skipped = POSTER_WIDTHS.filter((w) => !widths.includes(w));
  if (skipped.length) {
    warn(
      `el poster mide ${meta.width}px: se omiten los anchos ${skipped.join(', ')}. ` +
      'Baja el clip en Full HD o mayor si los necesitas.'
    );
  }

  const avif = {};
  const webp = {};

  for (const w of widths) {
    const nameAvif = `hero-poster-${w}.avif`;
    const nameWebp = `hero-poster-${w}.webp`;
    await sharp(srcImage).resize({ width: w, withoutEnlargement: true }).avif({ quality: 58 })
      .toFile(path.join(OUT_DIR, nameAvif));
    await sharp(srcImage).resize({ width: w, withoutEnlargement: true }).webp({ quality: 76 })
      .toFile(path.join(OUT_DIR, nameWebp));
    avif[w] = `/assets/hero/${nameAvif}`;
    webp[w] = `/assets/hero/${nameWebp}`;
  }

  // JPEG de último recurso para navegadores sin AVIF ni WebP.
  const fallbackW = widths[widths.length - 1];
  await sharp(srcImage).resize({ width: fallbackW, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(OUT_DIR, 'hero-poster.jpg'));

  const outMeta = await sharp(path.join(OUT_DIR, 'hero-poster.jpg')).metadata();
  log(`posters: ${widths.join(', ')} px en avif + webp, más el jpg de respaldo`);

  return {
    avif,
    webp,
    fallback: '/assets/hero/hero-poster.jpg',
    width: outMeta.width,
    height: outMeta.height,
  };
}

/* ─── Video ──────────────────────────────────────────────────────────── */

function encode(srcVideo, height, kind) {
  const name = kind === 'webm' ? `hero-${height}.webm` : `hero-${height}.mp4`;
  const target = path.join(OUT_DIR, name);

  // Sin audio (`-an`) siempre: es un loop decorativo y muted, el audio sería
  // peso muerto puro. `scale` a altura par para no romper yuv420p.
  const common = ['-y', '-i', srcVideo, '-an', '-vf', `scale=-2:${height}`];

  const args = kind === 'webm'
    ? [...common, '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0', '-row-mt', '1', '-deadline', 'good']
    : [...common, '-c:v', 'libx264', '-profile:v', 'high', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];

  let ok = false;
  atomic(target, (tmp) => {
    const tmpNamed = `${tmp}.${kind === 'webm' ? 'webm' : 'mp4'}`;
    const r = spawnSync('ffmpeg', [...args, tmpNamed], { stdio: 'ignore' });
    if (r.status !== 0) throw new Error(`ffmpeg falló para ${name}`);
    fs.renameSync(tmpNamed, tmp);
    ok = true;
  });

  if (!ok) return null;

  const bytes = fs.statSync(target).size;
  const flag = bytes > BUDGET_BYTES ? ' ← por encima del presupuesto' : '';
  log(`${name}: ${mb(bytes)}${flag}`);
  if (bytes > BUDGET_BYTES) {
    warn(`${name} supera los ${mb(BUDGET_BYTES)}. Recorta el clip a 6–8 s o baja la resolución.`);
  }

  return {
    src: `/assets/hero/${name}`,
    type: kind === 'webm' ? 'video/webm; codecs="vp9"' : 'video/mp4; codecs="avc1.640028"',
    width: height === 1080 ? 1920 : 1280,
    bytes,
  };
}

/* ─── Manifiesto ─────────────────────────────────────────────────────── */

function writeManifest({ poster, video }) {
  const header = fs.readFileSync(MANIFEST_TS, 'utf8').split('export const heroMedia')[0];

  const body =
    `export const heroMedia: HeroMedia = ${JSON.stringify({ poster, video }, null, 2)
      .split('\n')
      .map((l, i) => (i === 0 ? l : l))
      .join('\n')};\n\n` +
    '/** Constante de build: con `video: null` el `<video>` ni siquiera se empaqueta. */\n' +
    'export const hasHeroVideo = heroMedia.video !== null;\n';

  fs.writeFileSync(MANIFEST_TS, header + body);
  log(`manifiesto: src/data/hero-media.ts (video: ${video ? 'sí' : 'null'})`);
}

function writeLicenses(entries) {
  const lines = [
    '# Procedencia de los assets',
    '',
    '> Generado por `npm run assets:hero`. Para una agencia que factura a',
    '> corporativos, poder demostrar de dónde salió cada imagen no es opcional.',
    '',
    `Última actualización: ${new Date().toISOString().slice(0, 10)}`,
    '',
    '| Archivo de origen | Bytes | Fuente / autor / licencia |',
    '|---|---|---|',
    ...entries.map((e) => `| \`${e.file}\` | ${mb(e.bytes)} | ${e.note} |`),
    '',
    'Si un archivo dice `[PENDIENTE]`, anota a mano la URL de origen, el autor y',
    'la licencia. Pexels y Unsplash permiten uso comercial sin atribución',
    'obligatoria, pero el registro tiene que existir de todos modos.',
    '',
  ];
  fs.mkdirSync(path.dirname(LICENSES_MD), { recursive: true });
  fs.writeFileSync(LICENSES_MD, lines.join('\n'));
  log('licencias: docs/assets-licencias.md');
}

/* ─── Main ───────────────────────────────────────────────────────────── */

(async () => {
  console.log("\n━━━ Hacke's Jobs · pipeline del hero ━━━\n");

  if (!fs.existsSync(SRC_DIR)) {
    fs.mkdirSync(SRC_DIR, { recursive: true });
    log(`creado ${path.relative(ROOT, SRC_DIR)}/`);
    log('Deja ahí el material descargado y vuelve a ejecutar. Nada que hacer por ahora.');
    process.exit(0);
  }

  const files = fs.readdirSync(SRC_DIR).filter((f) => !f.startsWith('.'));
  const videoFile = files.filter((f) => VIDEO_RE.test(f)).sort()[0];
  const explicitPoster = files.find((f) => /^poster\./i.test(f));
  const anyImage = files.filter((f) => IMAGE_RE.test(f)).sort()[0];

  if (!videoFile && !anyImage) {
    log(`${path.relative(ROOT, SRC_DIR)}/ está vacío. El hero se sirve sólo con el motor SVG.`);
    log('Eso es un estado correcto, no un error.');
    process.exit(0);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const sharp = loadSharp();
  const ffmpeg = hasBinary('ffmpeg');

  if (!sharp) warn('sharp no está instalado — ejecuta `npm install`. Sin posters en esta pasada.');
  if (!ffmpeg) {
    warn('ffmpeg no está en el PATH. Instálalo con:');
    warn('  macOS  → brew install ffmpeg');
    warn('  Ubuntu → sudo apt-get install -y ffmpeg');
  }

  /* Poster */
  let poster = null;
  let posterSource = explicitPoster ? path.join(SRC_DIR, explicitPoster) : null;

  if (!posterSource && videoFile && ffmpeg) {
    // Fotograma al 35% del clip: el arranque suele traer el fundido de entrada.
    const src = path.join(SRC_DIR, videoFile);
    const t = Math.max(0.1, ffprobeDuration(src) * 0.35);
    const frame = path.join(OUT_DIR, '.frame.png');
    const r = spawnSync('ffmpeg', ['-y', '-ss', String(t), '-i', src, '-frames:v', '1', frame], { stdio: 'ignore' });
    if (r.status === 0) {
      posterSource = frame;
      log(`poster extraído del clip en t=${t.toFixed(1)}s`);
    }
  }
  if (!posterSource && anyImage) posterSource = path.join(SRC_DIR, anyImage);

  if (posterSource && sharp) {
    poster = await buildPosters(sharp, posterSource);
  } else if (posterSource) {
    warn('hay imagen de origen pero no sharp: no se generaron posters.');
  }

  const frameTmp = path.join(OUT_DIR, '.frame.png');
  if (fs.existsSync(frameTmp)) fs.unlinkSync(frameTmp);

  /* Video */
  let video = null;
  if (videoFile) {
    const src = path.join(SRC_DIR, videoFile);

    if (ffmpeg) {
      const sources = [];
      for (const h of VIDEO_HEIGHTS) {
        for (const kind of ['webm', 'mp4']) {
          try {
            const s = encode(src, h, kind);
            if (s) sources.push(s);
          } catch (err) {
            warn(err.message);
          }
        }
      }
      if (sources.length) {
        // El navegador elige la primera <source> que sabe reproducir: webm
        // primero (pesa menos), y dentro de cada formato, la menor antes.
        video = {
          sources: sources.map(({ bytes, ...s }) => s),
          durationSec: Math.round(ffprobeDuration(src) * 10) / 10,
          bytes: Math.max(...sources.map((s) => s.bytes)),
        };
      }
    } else {
      // Sin ffmpeg se copia tal cual: mejor un hero con video pesado que un
      // script que falla. El aviso deja claro que esto no es lo deseable.
      const target = path.join(OUT_DIR, 'hero-source.mp4');
      fs.copyFileSync(src, target);
      const bytes = fs.statSync(target).size;
      warn(`${videoFile} copiado sin recomprimir (${mb(bytes)}). Instala ffmpeg y repite.`);
      video = {
        sources: [{ src: '/assets/hero/hero-source.mp4', type: 'video/mp4', width: 1920 }],
        durationSec: 0,
        bytes,
      };
    }
  }

  writeManifest({ poster, video });
  writeLicenses(
    files.map((f) => ({
      file: f,
      bytes: fs.statSync(path.join(SRC_DIR, f)).size,
      note: '[PENDIENTE] anota URL de origen, autor y licencia',
    }))
  );

  console.log('\n  Listo.\n');
})().catch((err) => {
  console.error('\n  Error inesperado:', err.message, '\n');
  process.exit(1);
});
