let mediaStream;
const aparecerCam = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const contexto = canvas.getContext("2d");
const tempCanvas = document.createElement('canvas');
const tempContexto = tempCanvas.getContext('2d');
let fotoArmazenada = null;

function abrirCamera() {
    if (aparecerCam.style.display === "none") {
        aparecerCam.style.display = "block";
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                mediaStream = stream;
                const areaVideo = document.getElementById('camera');
                areaVideo.srcObject = stream;
            })
            .catch(function (error) {
                console.error('Erro ao acessar a câmera:', error);
            });
    } else {
        aparecerCam.style.display = "none";
    }
}

function tirarFoto() {
    const areaVideo = document.getElementById('camera');

    // Cria um novo canvas temporário para armazenar a foto

    tempCanvas.width = areaVideo.videoWidth;
    tempCanvas.height = areaVideo.videoHeight;
    tempContexto.drawImage(areaVideo, 0, 0, tempCanvas.width, tempCanvas.height);

    // Desenha a foto no canvas principal
    contexto.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

    //ARMAZENA A IMAGEM SEPARADAMENTE
    fotoArmazenada = new Image();
    fotoArmazenada.src = tempCanvas.toDataURL();
}

function baixar() {
    const canvas = document.getElementById('canvas');
    const dataURL = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'desenho.png';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function fechar() {
    navigator.mediaDevices.getUserMedia({ video: false });
    const areaVideo = document.getElementById('camera')
    areaVideo.srcObject = null;
    mediaStream = null;

    if(aparecerCam.style.display === "none") {
        aparecerCam.style.display = "block"
    } else {
        aparecerCam.style.display = "none"
    }
}

let desenhando = false; // variável que vai indentificar se estamos desenhando
let corSelecionada = "#000000";
const seletorDeCores = document.getElementById("seletorDeCores");
const botaoBorracha = document.getElementById("botaoBorracha");
const botaoPreencherFundo = document.getElementById("botaoPreencherFundo"); // Novo botão para preencher o fundo
let modoBorracha = false;
let formas = [];


document.getElementById("botaoPreencher").addEventListener("click", function () {
        // Preenche a última forma desenhada com a cor selecionada
        if (formas.length > 0) {
            contexto.fillStyle = corSelecionada;
            contexto.fill();
        }
    });

botaoBorracha.addEventListener("click", function () {
    modoBorracha = !modoBorracha; // Alterna entre modo de borracha e modo de desenho]
    if (modoBorracha) {
        contexto.lineWidth = 20; // Defina o tamanho desejado (por exemplo, 10)
        botaoBorracha.style.backgroundColor = "#828282"
    } else {
        contexto.lineWidth = 1; // Restaure o tamanho da linha ao desenhar
        botaoBorracha.style.backgroundColor = ""
    }
});


canvas.addEventListener("mousedown", function(event){
    //vamos usar o método addEventListener para ouvir nosso mouse, ele irá indentificar quando clicarmos
    desenhando = true; // desenho se torna verdade
    contexto.beginPath(); //a variável contexto junto com o metódo beginPath() indica que algo novo será criado
    contexto.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop); //nesse método, vamos dixer como o contexto irá funcionar,o clientX vai fornecer as coordenadas horizontais do mouse e o offsetLeft irá converter esse valor em pixel (px), a mesma coisa acontece comclientY na vertical.
})

canvas.addEventListener("mousemove", function(event){
    //função que indentifica quando movemos o mouse
    if(desenhando) {
        if (modoBorracha) {
            contexto.fillStyle = "#ffffff";
            contexto.strokeStyle = "#ffffff";
        } else {
            contexto.fillStyle = corSelecionada;
            contexto.strokeStyle = corSelecionada;
        }
        //esse if vai indentificar se estamos clicando quando movemos o mouse
        contexto.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        // o lineTo vai juntar as coordenadas e indentificar a linha que estamos traçando enquanto clicamos e movemos o mouse
        contexto.stroke();
        //traça a linha
    }
})

canvas.addEventListener("mouseup", function(event){
    // essa função indentifica quando não estamos mais clicando no mouse
    desenhando = false;
    if (modoBorracha) {
        contexto.fillStyle = "#ffffff";
        contexto.strokeStyle = "#ffffff";
    } else {
        contexto.fillStyle = corSelecionada;
        contexto.strokeStyle = corSelecionada;
        formas.push(contexto); // Armazena o caminho desenhado
    }
})

document.getElementById("seletorDeCores").addEventListener("input", function () {
    corSelecionada = this.value;
});

seletorDeCores.addEventListener("input", function () {
    contexto.fillStyle = seletorDeCores.value; // Define a cor de preenchimento para a cor selecionada
    contexto.strokeStyle = seletorDeCores.value; // Define a cor da linha para a cor selecionada
});

botaoPreencherFundo.addEventListener("click", function () {
    contexto.fillStyle = corSelecionada;
    contexto.fillRect(0, 0, canvas.width, canvas.height);
});

