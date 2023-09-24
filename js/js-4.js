// 1 задание
let canvas = document.getElementById('task_4_1');
let ctx = canvas.getContext('2d');

function drawKochSnowflake(x1, y1, x2, y2, depth) {
    if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    } else {
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const thirdX = x1 + deltaX / 3;
        const thirdY = y1 + deltaY / 3;
        const twoThirdsX = x1 + 2 * deltaX / 3;
        const twoThirdsY = y1 + 2 * deltaY / 3;
        const sqrt3 = Math.sqrt(3);

        const tipX = (thirdX + twoThirdsX) / 2 + (thirdY - twoThirdsY) * sqrt3 / 2;
        const tipY = (thirdY + twoThirdsY) / 2 + (twoThirdsX - thirdX) * sqrt3 / 2;

        drawKochSnowflake(x1, y1, thirdX, thirdY, depth - 1);
        drawKochSnowflake(thirdX, thirdY, tipX, tipY, depth - 1);
        drawKochSnowflake(tipX, tipY, twoThirdsX, twoThirdsY, depth - 1);
        drawKochSnowflake(twoThirdsX, twoThirdsY, x2, y2, depth - 1);
    }
}

// Очистить холст
ctx.clearRect(0, 0, canvas.width, canvas.height);

//drawKochSnowflake(startX, startY, endX, endY, depth);

drawKochSnowflake(50, 25, 250, 25, 1);
drawKochSnowflake(50, 100, 250, 100, 2);
drawKochSnowflake(50, 175, 250, 175, 3);
drawKochSnowflake(50, 250, 250, 250, 4);


// 2 задание
canvas = document.getElementById('task_4_2');
ctx = canvas.getContext('2d');
const canvasSize = 300;
canvas.width = canvasSize;
canvas.height = canvasSize;

function drawSierpinski(x1, y1, x2, y2, x3, y3, depth) {
    if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.stroke();
    } else {
        const midX1 = (x1 + x2) / 2;
        const midY1 = (y1 + y2) / 2;
        const midX2 = (x2 + x3) / 2;
        const midY2 = (y2 + y3) / 2;
        const midX3 = (x1 + x3) / 2;
        const midY3 = (y1 + y3) / 2;

        drawSierpinski(x1, y1, midX1, midY1, midX3, midY3, depth - 1);
        drawSierpinski(midX1, midY1, x2, y2, midX2, midY2, depth - 1);
        drawSierpinski(midX3, midY3, midX2, midY2, x3, y3, depth - 1);
    }
}

// Очистить холст
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Рисуем фрактал Серпинского
drawSierpinski(150, 25, 25, 275, 275, 275, 4);


$(function () {
    $("#SierpinskiSlider").on("input", function () {
        let newDepth = parseInt($(this).val());
        $("#SierpinskiValue").text(newDepth);
        canvas = document.getElementById('task_4_2');
        ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSierpinski(150, 25, 25, 275, 275, 275, newDepth);
    });
});

// 3 задание


canvas = document.getElementById('task_4_3');
ctx = canvas.getContext('2d');
const canvasWidth = 600;
const canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

function drawFractalTree(x, y, length, angle, depth) {
    if (depth === 0) return;

    const x2 = x + length * Math.cos(angle);
    const y2 = y - length * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgb(${64 - 255 / depth},${255 / depth},${64 / depth})`;
    ctx.lineWidth = depth;
    ctx.stroke();

    drawFractalTree(x2, y2, length * 0.7, angle - Math.PI / 6, depth - 1);
    drawFractalTree(x2, y2, length * 0.7, angle + Math.PI / 6, depth - 1);
}
// Функция для обновления глубины фрактальных деревьев
function updateDepth(depth) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const centerX = canvasWidth / 2; // Центр для симметричного дерева
    const centerY = canvasHeight;

    // Рисуем симметричное фрактальное дерево
    drawFractalTree(centerX, centerY, 100, Math.PI / 2, depth);

    //$("#depthValue").text(depth);
}

// Инициализация начальной глубины и рисование фрактальных деревьев
let initialDepth = 4;
updateDepth(initialDepth);

$("#treeSlider").on("input", function () {
    let newDepth = parseInt($(this).val());
    canvas = document.getElementById('task_4_3');
    ctx = canvas.getContext('2d');
    $("#treeValue").text(newDepth);
    updateDepth(newDepth);
});

// 4 задание

canvas = document.getElementById('task_4_4');
ctx = canvas.getContext('2d');

function mandelbrot(x, y) {
    let real = x;
    let imaginary = y;
    const maxIterations = 100;
    let iteration = 0;

    while (iteration < maxIterations) {
        const real2 = real * real;
        const imaginary2 = imaginary * imaginary;

        if (real2 + imaginary2 > 4) {
            return iteration;
        }

        imaginary = 2 * real * imaginary + y;
        real = real2 - imaginary2 + x;
        iteration++;
    }

    return maxIterations;
}


let zoom = 100; // Множитель масштаба
let offsetX = 0; // Смещение по X
let offsetY = 0; // Смещение по Y
function drawMandelbrot() {
    for (let x = 0; x < canvasWidth; x++) {
        for (let y = 0; y < canvasHeight; y++) {
            const real = (x - canvasWidth / 2) / zoom + offsetX;
            const imaginary = (y - canvasHeight / 2) / zoom + offsetY;
            const color = mandelbrot(real, imaginary);

            // Преобразование числа итераций в диапазоне 0-1000 в цвет
            const r = (color % 8) * 32;
            const g = (color % 16) * 8;
            const b = (color % 32) * 16;

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

drawMandelbrot();

$("#xSlider").on("input", function () {
    offsetX = parseInt($(this).val()) / 10;
    canvas = document.getElementById('task_4_4');
    ctx = canvas.getContext('2d');

    drawMandelbrot();
});
$("#ySlider").on("input", function () {
    offsetY = parseInt($(this).val()) / 10;
    canvas = document.getElementById('task_4_4');
    ctx = canvas.getContext('2d');

    drawMandelbrot();
});
$("#zoomSlider").on("input", function () {
    zoom = parseInt($(this).val());
    canvas = document.getElementById('task_4_4');
    ctx = canvas.getContext('2d');

    drawMandelbrot();
});