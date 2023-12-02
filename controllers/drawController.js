require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');
const tf = require('@tensorflow/tfjs-node');
const { tfmodePreprocess, RGB2GRAYSCALE } = require('../public/src/preprocessInput');

const SketchInfo = require('../models/sketchinfo');
const UserOutput = require('../models/sketchinfo');
const jwt = require('jsonwebtoken');

//env variable:
const size = process.env.IMGSIZE;
const convKernel = [[0,1,0],[1,1,1],[0,1,0]];

const drawPage = async(req, res) => {
    //global variables
    let prob_output;
    let label_output

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
        console.log(`id ${socket.id} connected`);
        
        //tensorflow model
        const model = await tf.loadLayersModel(process.env.MODEL_PATH);

        socket.on('url-emitter', (data) => {
            let pixels = [];
            const buffer = Buffer.from(data.url, "base64");
            Jimp.read(buffer, async(err, img) => {
                if(err) console.log(err);
                img.resize(Number(size), Number(size))
                .invert()
                    //Black pixels -> white pixels and vice-versa

                .convolute(convKernel)
                    //Dilation

                // .write('drawjs.png')
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
                
                prob < 0.01 ? console.log("indefinido") : console.log('out:', classes[output.arraySync([0])]);

                console.log("probabilidade: ", prob);
                console.log('\n');

                //output data
                socket.emit('output-data', {output: [prob, classes[output.arraySync([0])]]});
                
                //Save Sketch Data
                await SketchInfo.findOrCreate({
                    where:{ id: Number(output.arraySync([0])) },
                    defaults:{
                        label: classes[output.arraySync([0])],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                });

                //Save Output Data
                await UserOutput.create({
                    sketch_id: Number(output.arraySync([0])),
                    probability: prob,
                    user_id: user_id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

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