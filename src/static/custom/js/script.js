

window.addEventListener('DOMContentLoaded', event => {
    const watermark_form = document.getElementById('formu-watermark');
    const file_input = document.getElementById('file');
    const watermark_input = document.getElementById('watermark');

    watermark_form.addEventListener("submit", (e) => {
        e.preventDefault();
        var file = file_input.files[0];
        const watermark = watermark_input.value;
        var reader = new FileReader();

        reader.onload = function(e) {
            if(!file.type.match('image.*')) {
                alert('File must be an image (jpg, jpeg, png)');
            }
            else{
                var opacity = document.getElementById("opacity").value;
                var img = new Image();
                img.onload = function(){
                    var canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    ctx.font = '48px Arial';
                    ctx.fillStyle = 'rgba(80, 80, 80, ' + opacity + ')';

                    watermarkDraw(ctx, watermark, img.width, img.height);

                    const ext = file.name.match(/\.(jpeg|png|jpg)/)
                    const link = document.createElement('a');
                    link.download = file.name.replace(ext[0], "_watermark.png");
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    });
});


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
    