const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'C:\\\\Users\\\\santin\\\\Documents\\\\Hackes Jobs\\\\WebSite\\\\Hackes Jobs Web v2\\\\docs\\\\Logo Hackes jobs';

const files = [
  'HJ PNG_Mesa de trabajo 1.png'
];

async function processImage(filename) {
  try {
    const inputPath = path.join(inputDir, filename);
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const colAlphaSum = new Array(info.width).fill(0);
    
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const idx = (info.width * y + x) * info.channels;
        colAlphaSum[x] += data[idx + 3];
      }
    }

    let startX = -1;
    for (let x = 0; x < info.width; x++) {
      if (colAlphaSum[x] > 0) {
        startX = x;
        break;
      }
    }

    let endX = startX;
    let gapCount = 0;
    for (let x = startX; x < info.width; x++) {
      if (colAlphaSum[x] === 0) {
        gapCount++;
        if (gapCount > 20) {
          endX = x - gapCount;
          break;
        }
      } else {
        endX = x;
        gapCount = 0;
      }
    }

    const cropWidth = endX - startX + 1;
    console.log(`Processing ${filename}. startX: ${startX}, width: ${cropWidth}, height: ${info.height}`);

    // Manually extract pixels to avoid Sharp's extract boundary issues
    const extractedData = Buffer.alloc(cropWidth * info.height * info.channels);
    for (let y = 0; y < info.height; y++) {
      const srcOffset = (y * info.width + startX) * info.channels;
      const dstOffset = y * cropWidth * info.channels;
      data.copy(extractedData, dstOffset, srcOffset, srcOffset + cropWidth * info.channels);
    }
    
    let symbolBuffer = await sharp(extractedData, { raw: { width: cropWidth, height: info.height, channels: info.channels } })
      .trim()
      .png()
      .toBuffer();
      
    const symbolInfo = await sharp(symbolBuffer).metadata();
    
    // Create square canvas
    const maxSize = Math.max(symbolInfo.width, symbolInfo.height);
    const padding = Math.ceil(maxSize * 0.15); // 15% padding
    const finalSize = maxSize + padding * 2;
    
    const publicDir = 'C:\\\\Users\\\\santin\\\\Documents\\\\Hackes Jobs\\\\WebSite\\\\Hackes Jobs Web v2\\\\public';
    const appDir = 'C:\\\\Users\\\\santin\\\\Documents\\\\Hackes Jobs\\\\WebSite\\\\Hackes Jobs Web v2\\\\src\\\\app';
    
    const iconPath = path.join(appDir, 'icon.png');
    const appleIconPath = path.join(appDir, 'apple-icon.png');
    
    const finalImage = sharp({
      create: {
        width: finalSize,
        height: finalSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([{ input: symbolBuffer, gravity: 'center' }])
    .png();
    
    await finalImage.toFile(iconPath);
    console.log(`-> Successfully generated src/app/icon.png`);

    const finalAppleImage = sharp({
      create: {
        width: finalSize,
        height: finalSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 } 
      }
    })
    .composite([{ input: symbolBuffer, gravity: 'center' }])
    .png();

    await finalAppleImage.toFile(appleIconPath);
    console.log(`-> Successfully generated src/app/apple-icon.png`);

  } catch (err) {
    console.error(`Error processing ${filename}:`, err);
  }
}

processImage(files[0]);
