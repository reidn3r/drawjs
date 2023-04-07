require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');
const tf = require('@tensorflow/tfjs-node');
const { tfmodePreprocess, RGB2GRAYSCALE } = require('../public/src/preprocessInput');

//Constants:
const size = process.env.IMGSIZE;
// const filtersize = process.env.FILTERSIZE;

const drawPage = async(req, res) => {
    //socketio
    const io = req.app.get('socketio');
    let connections = [];

    //LabelEncoder classes
    const labelEncoderClasses = fs.readFileSync(path.join(__dirname, '..', 'LabelEncoder', 'json_data.json'));
    const classes = JSON.parse(labelEncoderClasses);
    
    //socket.io connection
    io.on('connection', async(socket) => {
        //avoid repeated connections
        connections.push(socket.id);
        if(connections[0] === socket.id){
            io.removeAllListeners('connection');
        }
        console.log(`id ${socket.id} connected`);
        
        //keras model
        const model = await tf.loadLayersModel('file://tf_model/resnet50-255/model.json');
        socket.on('url-emitter', (data) => {
            let pixels = [];
            const buffer = Buffer.from(data.url, "base64");
            Jimp.read(buffer, (err, img) => {
                if(err) console.log(err);
                img.resize(Number(size), Number(size))
                .write('drawjs.png')
                .scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, i) => {
                    let r = img.bitmap.data[i];
                    let g = img.bitmap.data[i + 1];
                    let b = img.bitmap.data[i + 2];

                    let px = RGB2GRAYSCALE(r, g, b);

                    //preprocess input - mode: "tf"
                    px = tfmodePreprocess(px);
                    pixels.push(px);
                })
                
                /*
                    - Dilation:
                        1. get single channel image
                        2. array ->  tensor
                        3. apply convolution
                        4. tensor -> preprocess input
                        5. tensor -> model -> predict
                */

                // const filter = tf.tensor2d([1,1,1,1,0,1,1,1,1], [3,3], 'float32').reshape([3,3,1,1]);
                // let tensor = tf.tensor1d(pixels, 'float32').reshape([size, size, 1]).expandDims(0);
                // tensor = tf.conv2d(tensor, filter, [1, 1], 'same').reshape([1, 64, 64, 1]);
                
                let tensor = tf.tensor1d(pixels, 'float32').reshape([size, size, 1]).expandDims(0);
                let output = model.predict(tensor).argMax(1);
                let prob = model.predict(tensor).arraySync()[0][output.arraySync([0])];
                
                prob < 0.01 ? console.log("indefinido") : console.log('out:', classes[output.arraySync([0])]);

                console.log("probabilidade: ", prob);
                console.log('\n');
                
                //memory management
                tf.dispose(tensor);
                tf.dispose(output);
                tf.dispose(prob);
                pixels = [];

            })
        }) 
    })
    res.render('drawIA');
}

module.exports = drawPage;