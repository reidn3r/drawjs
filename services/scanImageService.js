const { tfmodePreprocess, RGB2GRAYSCALE } = require('../public/src/preprocessInput');

const scanImageService = (img, idx) => {
    let r = img.bitmap.data[idx];
    let g = img.bitmap.data[idx + 1];
    let b = img.bitmap.data[idx + 2];

    //rgb (3 channels img) -> grayscale (single channel img)
    let px = RGB2GRAYSCALE(r, g, b);

    //preprocess input - mode: "tf"
    return tfmodePreprocess(px);
}

module.exports = scanImageService;