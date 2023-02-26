const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');
const tf = require('@tensorflow/tfjs-node');

const drawPage = async(req, res) => {
    //socketio
    const io = req.app.get('socketio');
    let connections = [];

    //LabelEncoder classes
    const labelEncoderClasses = fs.readFileSync(path.join(__dirname, '..', 'LabelEncoder', 'classes.json'));
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
        const model = await tf.loadLayersModel('file://tf_model/model.json');

        socket.on('url-emitter', (data) => {
            // let pixels = [];
            let rpixels = [];
            let gpixels = [];
            let bpixels = [];
            const buffer = Buffer.from(data.url, "base64");
            Jimp.read(buffer, (err, img) => {
                if(err) console.log(err);
                img.resize(64, 64)
                // .write('drawjs.png')
                .scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, i) => {
                    let r = img.bitmap.data[i]/255.0;
                    rpixels.push(r);
                    
                    let g = img.bitmap.data[i + 1]/255.0;
                    gpixels.push(g);
                    
                    let b = img.bitmap.data[i + 2]/255.0;
                    bpixels.push(b);
                    
                })
                let rtensor = tf.tensor1d(rpixels, 'float32');
                let gtensor = tf.tensor1d(gpixels, 'float32');
                let btensor = tf.tensor1d(bpixels, 'float32');

                let tensor = rtensor.concat(gtensor).concat(btensor).reshape([64, 64, 3]).expandDims(0);

                // let tensor = tf.tensor3d(pixels,[64,64,3], 'float32').expandDims(0);
                // tensor.print();
                let output = model.predict(tensor).argMax(1);
                let prob = model.predict(tensor).arraySync()[0][output.arraySync([0])];
                
                prob < 0.1 ? console.log("indefinido") : console.log('out:', classes[output.arraySync([0])]);

                console.log("probabilidade: ", prob);
                console.log('\n');
                
                //free memory
                tf.dispose(tensor);
                tf.dispose(output);
                tf.dispose(prob);

                tf.dispose(rtensor);
                tf.dispose(gtensor);
                tf.dispose(btensor);

                rpixels = null;
                gpixels = null;
                bpixels = null;
            })
        }) 
    })
    res.render('drawIA');
}

module.exports = drawPage;