const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'C:\\\\Users\\\\santin\\\\Documents\\\\Hackes Jobs\\\\WebSite\\\\Hackes Jobs Web v2\\\\public\\\\assets\\\\clientes';

const newFiles = [
  'nuevo-cliente-1.png',
  'nuevo-cliente-2.png',
  'nuevo-cliente-3.png',
  'nuevo-cliente-4.png'
];

async function convert() {
  for (const file of newFiles) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', file);
      continue;
    }
    
    const basename = path.basename(file, '.png');
    
    // Generate WebP
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(path.join(dir, `${basename}.webp`));
      
    // Generate AVIF
    await sharp(filePath)
      .avif({ quality: 70 })
      .toFile(path.join(dir, `${basename}.avif`));
      
    console.log(`Converted ${file} to WebP and AVIF.`);
  }
}

convert().catch(console.error);
