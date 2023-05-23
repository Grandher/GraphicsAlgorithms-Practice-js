//Класс цвета
class color {
    constructor(r, g, b, a) {
        this.r = r != null ? r : Math.floor(Math.random() * 256);
        this.g = g != null ? g : Math.floor(Math.random() * 256);
        this.b = b != null ? b : Math.floor(Math.random() * 256);
        this.a = a != null ? a : 255;
    }
}

//1 задание
let canvas_2_1 = document.getElementById('task_2_1');
let ctx = canvas_2_1.getContext('2d');
let canvasWidth = canvas_2_1.width;
let canvasHeight = canvas_2_1.height;
let canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

//Функция закрашивания одного пикселя
function drawPixel(x, y, color) {
    let index = (x + y * canvasWidth) * 4;

    canvasData.data[index + 0] = color.r;
    canvasData.data[index + 1] = color.g;
    canvasData.data[index + 2] = color.b;
    canvasData.data[index + 3] = color.a;
}
//Обновление холста
function updateCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}
/* Алгоритм Брезенхэма
function drawLine(x1, y1, x2, y2, color) {
    let y = y1;
    let diry = (y2 - y1) > 0 ? 1 : -1;
    let error = 0;
    let delerr = (Math.abs(y2 - y1) + 1) / (Math.abs(x2 - x1) + 1);
    if (x2 > x1) {
        for (let i = x1; i < x2; i++) {
            drawPixel(i, y, color);
            error += delerr;
            if (error >= 1) {
                y += diry;
                error -= 1;
            }
        }
    } else {
        for (let i = x1; i > x2; i--) {
            drawPixel(i, y, color);
            error += delerr;
            if (error >= 1) {
                y += diry;
                error -= 1;
            }
        }
    }
}*/

//Улучшенный алгоритм Брезенхэма
function BresenhamLine(x0, y0, x1, y1, color) {
    var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0); // Проверяем рост отрезка по оси икс и по оси игрек
    // Отражаем линию по диагонали, если угол наклона слишком большой
    if (steep) {
        x0 = [y0, y0 = x0][0]; // Перетасовка координат
        x1 = [y1, y1 = x1][0];
    }
    // Если линия растёт не слева направо, то меняем начало и конец отрезка местами
    if (x0 > x1) {
        x0 = [x1, x1 = x0][0]; // Перетасовка координат
        y0 = [y1, y1 = y0][0];
    }
    let dx = x1 - x0;
    let dy = Math.abs(y1 - y0);
    let error = dx / 2; // Здесь используется оптимизация с умножением на dx, чтобы избавиться от лишних дробей
    let ystep = (y0 < y1) ? 1 : -1; // Выбираем направление роста координаты y
    let y = y0;
    let points = [];
    for (let x = x0; x <= x1; x++) {
        let tx = steep ? y : x;
        let ty = steep ? x : y;
        let index = (tx + ty * canvasWidth) * 4;
        if (canvasData.data[index + 0] == color.r
            && canvasData.data[index + 1] == color.g
            && canvasData.data[index + 2] == color.b
            && canvasData.data[index + 3] == color.a) {
            points.push([tx, ty]); //Добавляем все точки пересечения с ребром фигуры
        }

        drawPixel(tx, ty, color);
        error -= dy;
        if (error < 0) {
            y += ystep;
            error += dx;
        }
    }
    return points;
}

//Рисование линий
let red = new color(255, 0, 0, 255);
let blue = new color(0, 0, 192, 255);
let purple = new color(192, 128, 192, 255);
BresenhamLine(25, 25, 250, 75, red);
BresenhamLine(25, 75, 175, 200, blue);
BresenhamLine(270, 240, 20, 260, purple);
updateCanvas();

//3 задание
let canvas_2_3 = document.getElementById('task_2_3');
ctx = canvas_2_3.getContext('2d');

canvasWidth = canvas_2_3.width;
canvasHeight = canvas_2_3.height;
canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
//Рисование прямоугольника
function drawRect(x1, y1, x2, y2, color) {
    for (let i = x1; i < x2; i++) {
        for (let j = y1; j < y2; j++) {
            drawPixel(i, j, color);
        }
    }
}

drawRect(25, 25, 150, 150, red);
drawRect(200, 75, 300, 275, blue);
drawRect(350, 25, 550, 200, purple);
updateCanvas();

//4 задание
let canvas_2_4 = document.getElementById('task_2_4');
ctx = canvas_2_4.getContext('2d');

canvasWidth = canvas_2_4.width;
canvasHeight = canvas_2_4.height;
canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

//Рисование фигуры 4 линиями
function drawFigure(x1, y1, x2, y2, x3, y3, x4, y4, color, fill) {
    BresenhamLine(x1, y1, x2, y2, color);
    let tmparr1 = BresenhamLine(x2, y2, x3, y3, color);
    let tmparr2 = BresenhamLine(x3, y3, x4, y4, color);
    let tmparr3 = BresenhamLine(x4, y4, x1, y1, color);
    let points = [].concat(tmparr1, tmparr2, tmparr3);


    if (fill) {
        //console.clear();
        //console.log('###Заливка фигуры###');
        //Если fill=true вызывается функция заливки фигуры
        fillFigure(Math.min(x1, x2, x3, x4), Math.min(y1, y2, y3, y4), Math.max(x1, x2, x3, x4), Math.max(y1, y2, y3, y4), color, points);
    }
}

drawFigure(25, 25, 150, 50, 250, 250, 50, 225, red);
drawFigure(225, 35, 250, 150, 350, 25, 375, 225, blue);
drawFigure(400, 25, 550, 50, 550, 250, 450, 225, purple);

drawFigure(25, 325, 150, 350, 250, 550, 50, 525, red, true);
drawFigure(225, 335, 250, 450, 350, 325, 375, 525, blue, true);
drawFigure(400, 325, 550, 350, 550, 550, 450, 525, purple, true);
updateCanvas();

//Заливка фигуры линиями
function fillFigure(x1, y1, x2, y2, color, border_points) {
    //console.log('Граничные точки: ', border_points);
    for (let i = y1; i <= y2; i++) { //Проходим по высоте фигуры
        let points = []; //Массив граничных точек для линии
        for (let j = x1; j <= x2; j++) {
            let index = (j + i * canvasWidth) * 4;
            if (canvasData.data[index + 0] == color.r
                && canvasData.data[index + 1] == color.g
                && canvasData.data[index + 2] == color.b
                && canvasData.data[index + 3] == color.a) {
                points.push(j); //Добавляем все точки пересечения с ребром фигуры
            }
        }
        for (let j = 0; j < border_points.length; j++) {
            if (border_points[j][1] == i) {
                points.splice(points.indexOf(border_points[j][0]), 1);
            }
        }
        if (points.length > 2 && points.length % 2 != 0) {
            //Если их больше двух стираем все точки идущие подряд
            const s = new Set();
            for (let k = 1; k < points.length + 1; k++) {
                if (points[k] == points[k - 1] + 1) {
                    s.add(points[k - 1]);
                }
            }
            points = points.filter(e => !s.has(e));
        }

        if (points.length % 2 == 0) {
            //Если их осталось чётное количество закрашиваем области
            for (let k = 0; k < points.length; k += 2) {
                for (let j = points[k]; j < points[k + 1]; j++) {
                    drawPixel(j, i, color);
                }
            }
        }


    }

}
