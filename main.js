var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var lineWidth = 5

autoSetCanvasSize(canvas)

lisenToUser(canvas)

var eraserEnabled = false
eraser.onclick = function () {
    eraserEnabled = true
    eraser.classList.add('active')
    pen.classList.remove('active')
}
pen.onclick = function () {
    eraserEnabled = false
    pen.classList.add('active')
    eraser.classList.remove('active')
}
clear.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

download.onclick = function () {
    var compositeOperation = context.globalCompositeOperation
    context.globalCompositeOperation = "destination-over"
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    var imageData = canvas.toDataURL("image/png");
    context.putImageData(context.getImageData(0, 0, canvas.width, canvas.height), 0, 0)
    context.globalCompositeOperation = compositeOperation
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.href = imageData
    a.download = "mypaint"
    a.target = '_blank'
    a.click()
}

black.onclick = function () {
    context.fillStyle = 'black'
    context.strokeStyle = 'black'
    black.classList.add('active')
    red.classList.remove('active')
    green.classList.remove('active')
    blue.classList.remove('active')
}
red.onclick = function () {
    context.fillStyle = 'red'
    context.strokeStyle = 'red'
    red.classList.add('active')
    green.classList.remove('active')
    blue.classList.remove('active')
    black.classList.remove('active')
}
green.onclick = function () {
    context.fillStyle = 'green'
    context.strokeStyle = 'green'
    green.classList.add('active')
    red.classList.remove('active')
    blue.classList.remove('active')
    black.classList.remove('active')
}
blue.onclick = function () {
    context.fillStyle = 'blue'
    context.strokeStyle = 'blue'
    blue.classList.add('active')
    green.classList.remove('active')
    red.classList.remove('active')
    black.classList.remove('active')
}

thin.onclick = function () {
    lineWidth = 5
    thin.classList.add('active')
    thick.classList.remove('active')
}
thick.onclick = function () {
    lineWidth = 10
    thick.classList.add('active')
    thin.classList.remove('active')
}

function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1)
    context.lineWidth = lineWidth;
    context.lineTo(x2, y2)
    context.stroke();
    context.closePath();
}

function drawCricle(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
}

function autoSetCanvasSize(canvas) {
    canvasSize()
    window.onresize = function () {
        canvasSize()
    }

    function canvasSize() {
        var pageWidth = document.documentElement.clientWidth
        var pageHeight = document.documentElement.clientHeight
        canvas.width = pageWidth
        canvas.height = pageHeight
    }
}

function lisenToUser(canvas) {

    var using = false;
    var lastPoint = {
        x: undefined,
        y: undefined
    }
    //特性检测
    if (document.body.ontouchstart === undefined) {
        //非触屏设备
        canvas.onmousedown = function (a) {
            var x = a.clientX
            var y = a.clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                lastPoint = {
                    x: x,
                    y: y
                }
            }
        }
        canvas.onmousemove = function (a) {
            var x = a.clientX
            var y = a.clientY
            if (!using) {
                return
            }
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                var newPoint = {
                    x: x,
                    y: y
                }
                drawCricle(x, y, lineWidth / 2)
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
                lastPoint = newPoint
            }
        }
        canvas.onmouseup = function () {
            using = false
        }
    } else {
        //触屏设备
        canvas.ontouchstart = function (a) {
            var x = a.touches[0].clientX
            var y = a.touches[0].clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                lastPoint = {
                    x: x,
                    y: y
                }
            }
        }
        canvas.ontouchmove = function (a) {
            var x = a.touches[0].clientX
            var y = a.touches[0].clientY
            if (!using) {
                return
            }
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                var newPoint = {
                    x: x,
                    y: y
                }
                drawCricle(x, y, lineWidth / 2)
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
                lastPoint = newPoint
            }
        }
        canvas.ontouchend = function () {
            using = false
        }
    }
}