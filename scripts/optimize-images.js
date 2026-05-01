const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const OPTIMIZED_DIR = path.join(__dirname, '..', 'images', 'optimized');

// Settings
const GALLERY_MAX_WIDTH = 1200;   // max px for gallery images
const HERO_MAX_WIDTH = 1920;      // max px for hero background
const JPG_QUALITY = 80;
const WEBP_QUALITY = 78;
const HERO_IMAGE = 'DSC00319.jpg';

async function optimizeImages() {
    // Create output directory
    if (!fs.existsSync(OPTIMIZED_DIR)) {
        fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
    }

    const files = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith('DSC') && f.endsWith('.jpg'));
    
    console.log(`\n🍣 PuntoHandroll — Image Optimizer`);
    console.log(`${'─'.repeat(50)}`);
    console.log(`Found ${files.length} images to optimize\n`);

    let totalOriginal = 0;
    let totalOptimized = 0;

    for (const file of files) {
        const inputPath = path.join(IMAGES_DIR, file);
        const baseName = path.parse(file).name;
        const originalSize = fs.statSync(inputPath).size;
        totalOriginal += originalSize;

        const isHero = file === HERO_IMAGE;
        const maxWidth = isHero ? HERO_MAX_WIDTH : GALLERY_MAX_WIDTH;

        // Optimized JPG
        const jpgOutputPath = path.join(OPTIMIZED_DIR, file);
        await sharp(inputPath)
            .resize({ width: maxWidth, withoutEnlargement: true })
            .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
            .toFile(jpgOutputPath);

        // WebP version
        const webpOutputPath = path.join(OPTIMIZED_DIR, `${baseName}.webp`);
        await sharp(inputPath)
            .resize({ width: maxWidth, withoutEnlargement: true })
            .webp({ quality: WEBP_QUALITY })
            .toFile(webpOutputPath);

        const jpgSize = fs.statSync(jpgOutputPath).size;
        const webpSize = fs.statSync(webpOutputPath).size;
        totalOptimized += webpSize;

        const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
        const tag = isHero ? ' [HERO]' : '';

        console.log(`  ${file}${tag}`);
        console.log(`    Original:  ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`    JPG opt:   ${(jpgSize / 1024).toFixed(0)} KB`);
        console.log(`    WebP:      ${(webpSize / 1024).toFixed(0)} KB  (−${savings}%)\n`);
    }

    console.log(`${'─'.repeat(50)}`);
    console.log(`  Total original:  ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
    console.log(`  Total WebP:      ${(totalOptimized / 1024 / 1024).toFixed(1)} MB`);
    console.log(`  Savings:         ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
    console.log(`\n✅ Optimized images saved to: images/optimized/\n`);
}

optimizeImages().catch(err => {
    console.error('Error optimizing images:', err);
    process.exit(1);
});
