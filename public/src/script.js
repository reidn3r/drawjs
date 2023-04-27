document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("screen");
    const context = canvas.getContext('2d', {willReadFrequently: true});

    let socket = io();

    canvas.width = context.canvas.clientWidth;
    canvas.height= context.canvas.clientHeight;

    //line width
    context.lineWidth = 5;
    
    //background color
    context.fillStyle = 'white';

    //stroke color
    // context.strokeStyle = "#fff";

    context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
    
    const cursor = {
        active:false,
        moving:false,
        prevPos: {
            x: null,
            y: null
        },
        pos: {
            x: 0,
            y: 0
        }
    }
    
    //clear the drawing area
    document.addEventListener('keydown', (e) => {
        if(e.keyCode == 32){
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'white';
            context.fillRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
            label.innerHTML = "Label";
            probability.innerHTML = "Probabilidade";
        }
    })

    //define draw line
    const drawLine = (line) => {
        context.beginPath();
        context.moveTo(line.prevPos.x, line.prevPos.y);
        context.lineTo(line.pos.x, line.pos.y);
        context.stroke();
    }

    canvas.onmousedown = (event) => {cursor.active=true};
    canvas.onmouseup = (event) => {cursor.active=false};
    
    canvas.onmousemove = (event) => {
        cursor.pos.x = event.clientX;
        cursor.pos.y = event.clientY;
        cursor.moving = true;
    }

    //draw line function
    const cicle = () => {
        if(cursor.active && cursor.moving && cursor.prevPos){
            drawLine({ pos: cursor.pos, prevPos:cursor.prevPos});
            cursor.moving = false;
        }
        cursor.prevPos = { x: cursor.pos.x, y:cursor.pos.y };
        setTimeout(cicle, 10);
    }
    cicle();

    canvas.addEventListener('click', (e) => {
        let dataUrlTimer = setTimeout(() => {
            const dataUrl = canvas.toDataURL('image/png', 1).replace(/^data:image\/png;base64,/, "");
            socket.emit('url-emitter', {url: dataUrl});
        }, 500);
    })

    /*
        - output refresh
    */
    let label = document.querySelector(".header-label");
    let probability = document.querySelector(".header-probability");
    socket.on('output-data', (data) => {
        label.innerHTML = data.output[1];
        probability.innerHTML = "Probabilidade: " + data.output[0].toFixed(4);
    })
})