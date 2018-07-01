var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

autoSetCanvasSize(canvas)

lisenToMouse(canvas)

var eraserEnabled = false
eraser.onclick = function () {
    eraserEnabled = true
    actions.className = 'actions x '
}
brush.onclick = function () {
    eraserEnabled = false
    actions.className = 'actions'
}

function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1)
    context.lineWidth = 5;
    context.lineTo(x2, y2)
    context.stroke();
    context.closePath();
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
function lisenToMouse(canvas) {
    var using = false;
    var lastPoint = {
        x: undefined,
        y: undefined
    }
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
        if (!using) { return }
        if (eraserEnabled) {
            context.clearRect(x - 5, y - 5, 10, 10)
        } else {
            var newPoint = { x: x, y: y }
            drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
            lastPoint = newPoint

        }
    }
    canvas.onmouseup = function (z) {
        using = false
    }
}