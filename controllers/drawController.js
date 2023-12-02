require('dotenv').config();
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Jimp = require('jimp');
const tf = require('@tensorflow/tfjs-node');

//services
const scanImageService = require('../services/scanImageService');
const findOrCreateSketch = require('../services/findOrCreateSketchService');
const createUserOutput = require('../services/createUserOutputService');

//env variable:
const size = process.env.IMGSIZE;
const convKernel = [[0,1,0],[1,1,1],[0,1,0]];

const drawPage = async(req, res) => {
    //payload
    const cookies = req.cookies.jwt;
    const payload = jwt.verify(cookies, process.env.SECRET);
    const { user_id } = payload;
    
    //LabelEncoder classes
    const labelEncoderClasses = fs.readFileSync(path.join(__dirname, '..', 'LabelEncoder', process.env.CLASSES_PTBR));
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
        //tensorflow model
        const model = await tf.loadLayersModel(process.env.MODEL_PATH);

        socket.on('url-emitter', (data) => {
            let pixels = [];
            const buffer = Buffer.from(data.url, "base64");
            Jimp.read(buffer, async(err, img) => {
                if(err) console.log(err);
                img.resize(Number(size), Number(size))
                .invert() //Black pixels -> white pixels and vice-versa
                .convolute(convKernel) //Dilation

                // .write('drawjs.png')
                .scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, i) => {
                    const px = scanImageService(img, i);
                    pixels.push(px);
                })
                
                let tensor = tf.tensor1d(pixels, 'float32').reshape([1, size, size, 1]);
                let output = model.predict(tensor).argMax(1);
                let prob = model.predict(tensor).arraySync()[0][output.arraySync([0])];
                
                prob < 0.01 ? console.log("indefinido") : console.log('out:', classes[output.arraySync([0])]);

                //output data
                socket.emit('output-data', {output: [prob, classes[output.arraySync([0])]]});
                
                //Save Sketch Data
                let sketch_id = Number(output.arraySync([0]));
                let sketch_label = classes[output.arraySync([0])];
                findOrCreateSketch(sketch_id, sketch_label);

                //Save Output Data
                createUserOutput(user_id, sketch_id, prob);

                //memory management
                tf.dispose(tensor);
                tf.dispose(output);
                tf.dispose(prob);
                pixels = [];
            })
        }) 
    })

    res.render('drawIA', {});
}

module.exports = drawPage;