/* eslint-disable */
/**
 * Hacke's Jobs · Brand assets pipeline
 *
 * Reads source assets from `docs/{tecnologia, lOGOS Clientes, Imagenes Toluca}` and
 * emits optimized variants to `public/assets/{tech, clientes, toluca}` in WebP + AVIF,
 * with slug filenames and (for hero photos) responsive sizes for srcset.
 *
 * Run: node scripts/process-brand-assets.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'docs');
const OUT = path.join(ROOT, 'public', 'assets');

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/\.(png|jpe?g|webp|avif|svg)$/i, '')
    .replace(/\.svg$/i, '')
    .replace(/[_,]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-color|-logo|-colors/g, '')
    .replace(/^-|-$/g, '')
    .trim();

// ─── TECH LOGOS ─────────────────────────────────────────────────────
// Preserve transparency, max 320px wide (logos rarely need more), optimize.
const TECH_RENAMES = {
  'Anthropic_logo': 'anthropic',
  'claude - color': 'claude',
  'gemini-color': 'gemini',
  'Google_Antigravity_Logo.svg': 'google-antigravity',
  'n8n-color': 'n8n',
  'Nextjs-logo - LOGO': 'nextjs',
  'OpenAI-Logo': 'openai',
  'pincode-color': 'pinecone',
  'PostgreSQL-color': 'postgresql',
  'Stripe_Logo,_revised_2016.svg': 'stripe'
};

async function processTechLogos() {
  const srcDir = path.join(SRC, 'tecnologia');
  const outDir = path.join(OUT, 'tech');
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
  const manifest = [];

  for (const file of files) {
    const baseName = file.replace(/\.(png|jpe?g|webp)$/i, '');
    const slug = TECH_RENAMES[baseName] || slugify(file);
    const srcPath = path.join(srcDir, file);

    await sharp(srcPath)
      .resize({ width: 320, withoutEnlargement: true })
      .webp({ quality: 92 })
      .toFile(path.join(outDir, `${slug}.webp`));

    await sharp(srcPath)
      .resize({ width: 320, withoutEnlargement: true })
      .avif({ quality: 80 })
      .toFile(path.join(outDir, `${slug}.avif`));

    // Also keep an optimized PNG fallback (some browsers / email clients)
    await sharp(srcPath)
      .resize({ width: 320, withoutEnlargement: true })
      .png({ compressionLevel: 9, quality: 90 })
      .toFile(path.join(outDir, `${slug}.png`));

    manifest.push({ slug, original: file });
  }
  return manifest;
}

// ─── CLIENT LOGOS ───────────────────────────────────────────────────
// Some are PNG with transparency, some are JPG with white bg.
// Output uniform 240px wide PNG/WebP/AVIF — the React component renders them
// inside white cards on dark bg, so white-bg JPGs blend seamlessly.
const CLIENT_RENAMES = {
  'aura academy -  colors': 'aura-academy',
  'goncalves de mexico - logo': 'goncalves',
  'prisma industrial - logo': 'prisma-industrial',
  'racarsa - colors': 'racarsa'
};

async function processClientLogos() {
  const srcDir = path.join(SRC, 'lOGOS Clientes');
  const outDir = path.join(OUT, 'clientes');
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
  const manifest = [];

  for (const file of files) {
    const baseName = file.replace(/\.(png|jpe?g|webp)$/i, '');
    const slug = CLIENT_RENAMES[baseName] || slugify(file);
    const srcPath = path.join(srcDir, file);

    // Detect alpha to know which need a white card backdrop in the UI
    const meta = await sharp(srcPath).metadata();
    const hasAlpha = !!meta.hasAlpha && meta.format !== 'jpeg' && meta.format !== 'jpg';

    await sharp(srcPath)
      .resize({ width: 240, withoutEnlargement: true })
      .webp({ quality: 92 })
      .toFile(path.join(outDir, `${slug}.webp`));

    await sharp(srcPath)
      .resize({ width: 240, withoutEnlargement: true })
      .avif({ quality: 80 })
      .toFile(path.join(outDir, `${slug}.avif`));

    await sharp(srcPath)
      .resize({ width: 240, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(path.join(outDir, `${slug}.png`));

    manifest.push({ slug, original: file, hasAlpha, format: meta.format });
  }
  return manifest;
}

// ─── HERO PHOTOS (Toluca) ───────────────────────────────────────────
// Generate responsive sizes for srcset: 640, 1280, 1920 wide.
// Strip metadata. Apply slight quality compression — these are decorative.
const TOLUCA_RENAMES = {
  'Nevado de toluca': 'nevado-1',
  'Toluca Nevado': 'nevado-2',
  'Portales ': 'portales-1',
  'Portales toluca': 'portales-2'
};

const HERO_WIDTHS = [640, 1280, 1920];

async function processHeroPhotos() {
  const srcDir = path.join(SRC, 'Imagenes Toluca');
  const outDir = path.join(OUT, 'toluca');
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
  const manifest = [];

  for (const file of files) {
    const baseName = file.replace(/\.(png|jpe?g|webp)$/i, '');
    const slug = TOLUCA_RENAMES[baseName] || slugify(file);
    const srcPath = path.join(srcDir, file);
    const sizes = {};

    for (const w of HERO_WIDTHS) {
      await sharp(srcPath)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(outDir, `${slug}-${w}.webp`));

      await sharp(srcPath)
        .resize({ width: w, withoutEnlargement: true })
        .avif({ quality: 60 })
        .toFile(path.join(outDir, `${slug}-${w}.avif`));

      sizes[w] = { webp: `${slug}-${w}.webp`, avif: `${slug}-${w}.avif` };
    }
    manifest.push({ slug, original: file, sizes });
  }
  return manifest;
}

// ─── MAIN ───────────────────────────────────────────────────────────
(async () => {
  console.log('━━━ Hacke\'s Jobs · Brand assets pipeline ━━━\n');

  console.log('› Processing tech logos…');
  const tech = await processTechLogos();
  console.log(`  ${tech.length} tech logos → public/assets/tech/`);

  console.log('\n› Processing client logos…');
  const clientes = await processClientLogos();
  console.log(`  ${clientes.length} client logos → public/assets/clientes/`);
  for (const c of clientes) {
    console.log(`    · ${c.slug.padEnd(22)} alpha:${c.hasAlpha ? 'YES' : 'NO (white bg)'}`);
  }

  console.log('\n› Processing hero photos (Toluca) at 640/1280/1920…');
  const toluca = await processHeroPhotos();
  console.log(`  ${toluca.length} photos × 3 widths × 2 formats = ${toluca.length * 6} variants → public/assets/toluca/`);

  // Write manifest for the React components to consume
  const manifestPath = path.join(OUT, 'brand-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ tech, clientes, toluca }, null, 2));
  console.log(`\n› Manifest written: public/assets/brand-manifest.json`);

  console.log('\nDone.');
})().catch(err => { console.error(err); process.exit(1); });
