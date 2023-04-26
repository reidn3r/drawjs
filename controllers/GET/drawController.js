require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');
const tf = require('@tensorflow/tfjs-node');
const { tfmodePreprocess, RGB2GRAYSCALE } = require('../../public/src/preprocessInput');

//env variable:
const size = process.env.IMGSIZE;
const convKernel = [[0,1,0],[1,1,1],[0,1,0]];

const drawPage = async(req, res) => {
    
    //LabelEncoder classes
    const labelEncoderClasses = fs.readFileSync(path.join(__dirname, '..', '..', 'LabelEncoder', process.env.CLASSES_PTBR));
    const classes = JSON.parse(labelEncoderClasses);
    
    //socketio
    const io = req.app.get('socketio');
    let connections = [];
    
    //socket.io connection
    io.on('connection', async(socket) => {
        //avoid repeated connections
        connections.push(socket.id);
        if(connections[0] === socket.id){
            io.removeAllListeners('connection');
        }
        console.log(`id ${socket.id} connected`);
        
        //tensorflow model
        const model = await tf.loadLayersModel(process.env.MODEL_PATH);

        socket.on('url-emitter', (data) => {
            let pixels = [];
            const buffer = Buffer.from(data.url, "base64");
            Jimp.read(buffer, (err, img) => {
                if(err) console.log(err);
                img.resize(Number(size), Number(size))
                .invert()
                    //Black pixels -> white pixels and vice-versa

                .convolute(convKernel)
                    //Dilation

                .write('drawjs.png')
                .scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, i) => {
                    let r = img.bitmap.data[i];
                    let g = img.bitmap.data[i + 1];
                    let b = img.bitmap.data[i + 2];

                    //rgb (3 channels img) -> grayscale (single channel img)
                    let px = RGB2GRAYSCALE(r, g, b);

                    //preprocess input - mode: "tf"
                    px = tfmodePreprocess(px);
                    pixels.push(px);
                })
                
                let tensor = tf.tensor1d(pixels, 'float32').reshape([1, size, size, 1]);
                let output = model.predict(tensor).argMax(1);
                let prob = model.predict(tensor).arraySync()[0][output.arraySync([0])];
                
                prob < 0.1 ? console.log("indefinido") : console.log('out:', classes[output.arraySync([0])]);

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