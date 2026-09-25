import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceDir = path.join(root, 'assets', 'images', 'source');
const outputDir = path.join(root, 'assets', 'images', 'optimized');
const widths = [480, 768, 1200, 1600, 1920];
const supported = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

await fs.mkdir(sourceDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (supported.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

function cleanName(filePath) {
  const ext = path.extname(filePath);
  return path.basename(filePath, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function bytesSaved(original, optimized) {
  if (!original || !optimized) return 0;
  return Math.max(0, (1 - optimized / original) * 100);
}

const files = await walk(sourceDir);
const manifest = {
  generatedAt: new Date().toISOString(),
  settings: {
    widths,
    webpQuality: 82,
    avifQuality: 50,
    withoutEnlargement: true,
    metadataPolicy: 'stripped except orientation applied through auto-rotate'
  },
  images: []
};

for (const inputPath of files) {
  const rel = path.relative(sourceDir, inputPath).replaceAll(path.sep, '/');
  const originalStat = await fs.stat(inputPath);
  const probe = sharp(inputPath, { failOn: 'none' }).rotate();
  const metadata = await probe.metadata();
  const sourceWidth = metadata.width || 0;
  const sourceHeight = metadata.height || 0;
  const base = cleanName(inputPath) || 'image';
  const candidateWidths = widths.filter((width) => !sourceWidth || width <= sourceWidth);

  if (sourceWidth && !candidateWidths.includes(sourceWidth) && sourceWidth < widths[0]) {
    candidateWidths.push(sourceWidth);
  }

  if (!candidateWidths.length && sourceWidth) candidateWidths.push(sourceWidth);

  const entry = {
    source: rel,
    original: {
      bytes: originalStat.size,
      width: sourceWidth,
      height: sourceHeight,
      format: metadata.format || path.extname(inputPath).slice(1)
    },
    outputs: []
  };

  for (const width of [...new Set(candidateWidths)].sort((a, b) => a - b)) {
    const common = sharp(inputPath, { failOn: 'none' })
      .rotate()
      .resize({ width, withoutEnlargement: true, fit: 'inside' });

    const webpName = `${base}-${width}w.webp`;
    const webpPath = path.join(outputDir, webpName);
    await common.clone().webp({ quality: 82, effort: 6, smartSubsample: true }).toFile(webpPath);
    const webpStat = await fs.stat(webpPath);
    entry.outputs.push({
      format: 'webp',
      width,
      file: `/assets/images/optimized/${webpName}`,
      bytes: webpStat.size,
      savingsPercent: Number(bytesSaved(originalStat.size, webpStat.size).toFixed(1))
    });

    const avifName = `${base}-${width}w.avif`;
    const avifPath = path.join(outputDir, avifName);
    await common.clone().avif({ quality: 50, effort: 6, chromaSubsampling: '4:4:4' }).toFile(avifPath);
    const avifStat = await fs.stat(avifPath);
    entry.outputs.push({
      format: 'avif',
      width,
      file: `/assets/images/optimized/${avifName}`,
      bytes: avifStat.size,
      savingsPercent: Number(bytesSaved(originalStat.size, avifStat.size).toFixed(1))
    });
  }

  manifest.images.push(entry);
}

await fs.writeFile(
  path.join(outputDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n',
  'utf8'
);

if (!manifest.images.length) {
  console.log('No source images found. Pipeline is ready; add files to assets/images/source/.');
} else {
  for (const image of manifest.images) {
    console.log(`\n${image.source} — original ${(image.original.bytes / 1024).toFixed(1)} KB`);
    for (const output of image.outputs) {
      console.log(`  ${output.format.toUpperCase()} ${output.width}w: ${(output.bytes / 1024).toFixed(1)} KB (${output.savingsPercent}% smaller)`);
    }
  }
  console.log(`\nOptimized ${manifest.images.length} source image(s).`);
}
