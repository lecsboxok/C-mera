var mediaStream;

function abrirCamera() {

    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
        .then(function (stream){
            mediaStream = stream;

            const areaVideo = document.getElementById('camera');
            areaVideo.srcObject = stream;
        })
        .catch(function (error) {
            console.error('Erro ao acessar a câmera:', error)
        });
}

function tirarFoto() {

    const areaVideo = document.getElementById('camera');
    const canvas = document.createElement('canvas');
    canvas.width = areaVideo.videoWidth;
    canvas.height = areaVideo.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(areaVideo, 0, 0, canvas.width, canvas.height);

    //CONVERTENDO A IMAGEM PARA O FORMATO base64
    const imageDataURL = canvas.toDataURL();

    //ARMAZENANDO A IMAGEM NO BACKGROUND DA DIV
    const fotoDiv = document.getElementById('foto');
    fotoDiv.style.backgroundImage = `url(${imageDataURL})`;


    const dowloadLink = document.createElement('a');

    dowloadLink.href = imageDataURL;
    dowloadLink.download = 'foto.png'
    dowloadLink.textContent = 'Clique para baixar'
    document.body.appendChild(dowloadLink);

}

function fechar() {
    navigator.mediaDevices.getUserMedia({ video: false });
    const areaVideo = document.getElementById('camera')
    areaVideo.srcObject = null;
    mediaStream = null;
}