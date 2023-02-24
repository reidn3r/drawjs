require('dotenv').config();
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const app = express();

//socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
let connections = [];

const Jimp = require('jimp');
const PORT = process.env.PORT || 8080;

//tensorflow model
const tf = require('@tensorflow/tfjs-node');

//log requests
app.use(morgan('dev'));

//ejs view-engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/draw', async(req, res)=>{
    //LabelEncoder classes
    const labelEncoderClasses = fs.readFileSync(path.join(__dirname, 'LabelEncoder', 'classes.json'));
    const classes = JSON.parse(labelEncoderClasses);
    
    //Keras model
    const model = await tf.loadLayersModel('file://tf_model/model.json');

    //socket.io connection
    io.on('connection', (socket) => {
        //avoid repeated connections
        connections.push(socket.id);
        if(connections[0] === socket.id){
            io.removeAllListeners('connection');
        }
        console.log(`id ${socket.id} connected`);
        
        socket.on('url-emitter', (data) => {
            let pixels = [];
            const buffer = Buffer.from(data.url, "base64");
            Jimp.read(buffer, (err, img) => {
                if(err) console.log(err);
                img.resize(64, 64)
                // .write('drawjs.png')
                .scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, i) => {
                    let r = img.bitmap.data[i]/255.0;
                    pixels.push(r);
                    
                    let g = img.bitmap.data[i + 1]/255.0;
                    pixels.push(g);
                    
                    let b = img.bitmap.data[i + 2]/255.0;
                    pixels.push(b);
                    
                })
                let tensor = tf.tensor3d(pixels,[64,64,3], 'float32').expandDims(0);
                let output = model.predict(tensor).argMax(1);
                let prob = model.predict(tensor).arraySync()[0][output.arraySync([0])];
                
                prob < 0.5 ? console.log("indefinido") : console.log('out:', classes[output.arraySync([0])]);

                console.log("probabilidade: ", prob);
                console.log('\n');

                //free memory
                tf.dispose(tensor);
                tf.dispose(output);
            })
        }) 
    })
    res.render('drawIA');
})

/*
    1. Login (opcional?)
    2. Principal (Desenho)
    3. Sobre
        - Fala sobre projeto
        - Links para github/insta/linkedin
*/

server.listen(PORT, () => console.log(`running at: http://localhost:${PORT}`));