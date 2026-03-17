import sharp from 'sharp';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'public', 'icons');
const sourceImage = 'C:/Users/Admin/Downloads/unnamed.png';

async function generate() {
  // Read source image
  const { data, info } = await sharp(sourceImage)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log(`Source: ${info.width}x${info.height}`);

  // Extract the white icon shape, recolor to #007aff, transparent background
  const blueOnTransparent = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    const brightness = (r + g + b) / 3;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const saturation = maxC > 0 ? (maxC - minC) / maxC : 0;

    if (brightness > 200 && saturation < 0.15 && a > 128) {
      // White icon pixel → make it #007aff
      blueOnTransparent[i] = 0;
      blueOnTransparent[i + 1] = 122;
      blueOnTransparent[i + 2] = 255;
      blueOnTransparent[i + 3] = 255;
    } else {
      // Background/gradient pixel → transparent
      blueOnTransparent[i] = 0;
      blueOnTransparent[i + 1] = 0;
      blueOnTransparent[i + 2] = 0;
      blueOnTransparent[i + 3] = 0;
    }
  }

  const blueIcon = await sharp(blueOnTransparent, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer();

  // --- All icons use blue icon on transparent background ---

  for (const { name, size } of [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
  ]) {
    const png = await sharp(blueIcon)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toBuffer();
    writeFileSync(join(iconsDir, name), png);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Apple touch icon: blue icon on transparent
  const applePng = await sharp(blueIcon)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toBuffer();
  writeFileSync(join(iconsDir, 'apple-touch-icon.png'), applePng);
  // iOS also requests these at the root level
  writeFileSync(join(iconsDir, '..', 'apple-touch-icon.png'), applePng);
  writeFileSync(join(iconsDir, '..', 'apple-touch-icon-precomposed.png'), applePng);
  console.log('Generated apple-touch-icon.png (180x180) + root copies');

  // Maskable icon: needs safe zone padding (inner 80%), transparent bg
  const maskableInner = Math.round(512 * 0.55);
  const maskablePadding = Math.round((512 - maskableInner) / 2);
  const innerResized = await sharp(blueIcon)
    .resize(maskableInner, maskableInner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const maskable = await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite([{ input: innerResized, gravity: 'center' }])
    .png()
    .toBuffer();
  writeFileSync(join(iconsDir, 'icon-512-maskable.png'), maskable);
  console.log('Generated icon-512-maskable.png (512x512)');

  // Favicon.ico
  const favicon32 = await sharp(blueIcon)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toBuffer();
  writeFileSync(join(iconsDir, '..', 'favicon.ico'), favicon32);
  console.log('Generated favicon.ico');

  // SVG favicon: blue icon on transparent background
  const svgIcon = await sharp(blueIcon)
    .resize(128, 128, { fit: 'cover' })
    .png()
    .toBuffer();
  const svgBase64 = svgIcon.toString('base64');
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <image width="128" height="128" href="data:image/png;base64,${svgBase64}"/>
</svg>`;
  writeFileSync(join(iconsDir, '..', 'favicon.svg'), svgFavicon);
  console.log('Generated favicon.svg (blue on transparent)');

  console.log('\nDone!');
}

generate().catch(console.error);
