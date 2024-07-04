const submitButton = document.getElementById('submit');
const fileInput = document.getElementById('file');
const textInput = document.getElementById('watermark');
const positionInput = document.getElementById('position');

submitButton.addEventListener('click', () => {
    console.log('click');
    const file = fileInput.files[0];
    const text = textInput.value;
    const position = positionInput.value;
    //import le fichier dans un canvas
    const reader = new FileReader();
    reader.onload = function(e) {
        //test si le fichier est une image
        if(!file.type.match('image.*')) {
            alert('Le fichier doit être une image');
        }
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            ctx.font = '48px serif';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            switch (position) {
                case 'top-left':
                    ctx.fillText(text, 10, 50);
                    console.log('top-left');
                    break;
                case 'top-right':
                    ctx.fillText(text, img.width - 10 - ctx.measureText(text).width, 50);
                    console.log('top-right');
                    break;
                case 'bottom-left':
                    ctx.fillText(text, 10, img.height - 10);
                    console.log('bottom-left');
                    break;
                case 'bottom-right':
                    ctx.fillText(text, img.width - 10 - ctx.measureText(text).width, img.height - 10);
                    console.log('bottom-right');
                    break;
                case 'center':
                    ctx.textAlign = 'center';
                    ctx.fillText(text, img.width / 2 - ctx.measureText(text).width / 2, img.height / 2);
                    ctx.textAlign = 'start';
                    console.log('center');
                    break;
                case 'all':
                    watermarkDraw(ctx, text, img.width, img.height);
                    console.log('all');
                    break;
                default:
                    watermarkDraw(ctx, text, img.width, img.height);
                    break;
            }
            //download l'image
            const link = document.createElement('a');
            link.download = 'watermark.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
})


function watermarkDraw(ctx, text, width, height) {
    // affiche le texte de partout avec une diagonale de 45°
    ctx.save();
    ctx.rotate(-Math.PI / 4);
    ctx.translate(-width, 0);
    //calcul le nombre de fois que le texte doit être répété / ligne
    const textWidth = ctx.measureText(text).width + 30;
    const textHeight = 48 + 30;
    const iterationsText = Math.ceil(width*2 / textWidth);
    const iterationsHeight = Math.ceil(height*2 / textHeight);
    for (let i = 0; i < iterationsText; i++) {
        for (let j = 0; j < iterationsHeight; j++) {
            ctx.fillText(text, i * textWidth, j * textHeight);
        }
    }
    ctx.restore();
}
    