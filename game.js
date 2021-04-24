//Объявление переменных 
//Присваиваем переменной canvas элемент страницы с id myCanvas
let canvas = document.getElementById("myCanvas");
//Объявляем переменную ctx для хранения 2D визуализации контекста
let ctx = canvas.getContext("2d");
//Радиус шарика в px
let ballRadius = 10;
//Координаты появления шарика
//canvas.width ширина холста игры
//canvas.height высота холста игры
let x = canvas.width / 2;
let y = canvas.height - 30;
//Шаг движения шарика по осям x, y
let dx = 2;
let dy = -2;
//Высота ракетки для отбивания шарика
let paddleHeight = 10;
//Ширина ракетки для отбивания шарика
let paddleWidth = 75;
//Координаты по оси x ракетки при начале игры
let paddleX = (canvas.width - paddleWidth) / 2;
//Переменная логического типа, rightPressed = false кнопка в право не нажатая 
let rightPressed = false;
//Переменная логического типа, leftPressed = false кнопка в лево не нажатая
let leftPressed = false;
//Количество рядов кирпичей
let brickRowCount = 5;
//Количество столбцов кирпичей
let brickColumnCount = 3;
//Ширина кирпичика
let brickWidth = 75;
//Высота кирпичика
let brickHeight = 20;
//Отступы кирпичей между собой
let brickPadding = 10;
//Отступ кирпичей с верху
let brickOffsetTop = 30;
//Отступ кирпичей с левого края
let brickOffsetLeft = 30;
//Начальное значение баллов
let score = 0;
//Создаем пустой массив для кирпичей
let bricks = [];
//В цикле рисуем кирпичики
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}
//Слушатели событий 
//Если клавиша нажата сработает функция keyDownHandler()
document.addEventListener("keydown", keyDownHandler, false);
//Если клавиша отпущенна сработает функция keyUpHandler()
document.addEventListener("keyup", keyUpHandler, false);
//Если будет использованная мышка 
document.addEventListener("mousemove", mouseMoveHandler, false);
//Функция реагирует на события при нажатии на кнопки вправо влево
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}
//Функция реагирует на события при отпускании кнопки вправо или влево
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
//Функция реагирует на события при движении мышки
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}
//Функция реагирует на столкновение шарика и кирпичика
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("Ты Победил !!!");
                        document.location.reload();
                        clearInterval(interval); // Для бравзера Chrome
                    }
                }
            }
        }
    }
}
//Функция рисует шарик красного цвета
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}
//Функция рисует ракетку синего цвета
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}
//Функция рисует кирпичики
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "green";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//Функция рисует значение баллов
function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Баллы: " + score, 8, 20);
}
//Функция рисует движение шарика
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            alert("Конец ИГРЫ !!!");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
}
//Запускаем выполнение функции draw (рисует движение шарика, ракетку, кирпичи, счет) каждые 10 милисекунд
let interval = setInterval(draw, 10);