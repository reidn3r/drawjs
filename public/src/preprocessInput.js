const tfmodePreprocess = (x) => {
    /*
        mode: "tf"
        Input: Pixel value between 0 and 255
        Output: Centered pixel value between -1 and 1
    */

    x/=127.5;
    x -=1;
    return x;
}

const RGB2GRAYSCALE = (R, G, B) => {
    /*
        Converts rgb pixel to grayscale

        Input: R, G, B image channels
        Output: Grayscale channel (1 channel)    
    */
    let x = 0.299*R + 0.587*G + 0.114*B;
    return x;
}

module.exports = { tfmodePreprocess, RGB2GRAYSCALE };