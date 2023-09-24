const fileInput = document.getElementById('fileInput');
const originalCanvas = document.getElementById('originalImage');
const maskCanvas = document.getElementById('maskCanvas');
const originalCtx = originalCanvas.getContext('2d');
const maskCtx = maskCanvas.getContext('2d');
const maskSlider = document.getElementById('maskSlider');
let threshold = 1;

fileInput.addEventListener('change', handleFileUpload);

const isBackgroundPixel = (r, g, b) => {
    return Math.abs(r - g) < threshold && Math.abs(r - b) < threshold && Math.abs(g - b) < threshold;
};

maskSlider.addEventListener('input', function () {
    threshold = this.value / 10;
    redrawMask();
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;
                maskCanvas.width = img.width;
                maskCanvas.height = img.height;

                // Отображаем исходное изображение
                originalCtx.drawImage(img, 0, 0);

                // Создаем маску
                redrawMask();
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}

function redrawMask() {
    // Очистка маски
    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

    // Обработка изображения: отделение фона от изображения
    const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];

        const isBackground = isBackgroundPixel(red, green, blue);

        if (isBackground) {
            pixels[i] = 0;
            pixels[i + 1] = 0;
            pixels[i + 2] = 0;
        } else {
            pixels[i] = 255;
            pixels[i + 1] = 255;
            pixels[i + 2] = 255;
        }
    }

    maskCtx.putImageData(imageData, 0, 0);
}