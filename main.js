var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var lineWidth = 5;
var eraserEnabled = false;
var imageDataFragment;
var canvasHistory = [];
var step = -1;

autoSetCanvasSize(canvas);

listenToUser(canvas);

toggle.onclick = function(e) {
  if (e.target.matches(".open")) {
    toggleClose.classList.add("show");
    toggleOpen.classList.remove("show");
    tools.style.display = "none";
  } else {
    toggleClose.classList.remove("show");
    toggleOpen.classList.add("show");
    tools.style.display = "block";
  }
};

eraser.onclick = function() {
  eraserEnabled = true;
  eraser.classList.add("active");
  pen.classList.remove("active");
};
pen.onclick = function() {
  eraserEnabled = false;
  pen.classList.add("active");
  eraser.classList.remove("active");
};
clear.onclick = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvasHistory = [];
  step = -1;
  back.classList.remove("active");
  go.classList.remove("active");
};
download.onclick = function() {
  var compositeOperation = context.globalCompositeOperation;
  context.globalCompositeOperation = "destination-over";
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  var imageData = canvas.toDataURL("image/png");
  context.putImageData(
    context.getImageData(0, 0, canvas.width, canvas.height),
    0,
    0
  );
  context.globalCompositeOperation = compositeOperation;
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.href = imageData;
  a.download = "myPaint";
  a.target = "_blank";
  a.click();
};

black.onclick = function() {
  context.fillStyle = "black";
  context.strokeStyle = "black";
  black.classList.add("active");
  red.classList.remove("active");
  green.classList.remove("active");
  blue.classList.remove("active");
};
red.onclick = function() {
  context.fillStyle = "red";
  context.strokeStyle = "red";
  red.classList.add("active");
  green.classList.remove("active");
  blue.classList.remove("active");
  black.classList.remove("active");
};
green.onclick = function() {
  context.fillStyle = "green";
  context.strokeStyle = "green";
  green.classList.add("active");
  red.classList.remove("active");
  blue.classList.remove("active");
  black.classList.remove("active");
};
blue.onclick = function() {
  context.fillStyle = "blue";
  context.strokeStyle = "blue";
  blue.classList.add("active");
  green.classList.remove("active");
  red.classList.remove("active");
  black.classList.remove("active");
};
currentColor.onclick = function(e) {
  context.fillStyle = e.target.value;
  context.strokeStyle = e.target.value;
  blue.classList.remove("active");
  green.classList.remove("active");
  red.classList.remove("active");
  black.classList.remove("active");
};
currentColor.onchange = function(e) {
  context.fillStyle = e.target.value;
  context.strokeStyle = e.target.value;
  switch (e.target.value) {
    case "#000000":
      black.classList.add("active");
      break;
    case "#ff0000":
      red.classList.add("active");
      break;
    case "#008000":
      green.classList.add("active");
      break;
    case "#0000ff":
      blue.classList.add("active");
      break;
  }
};
range.onchange = function(e) {
  lineWidth = e.target.value * 1;
};

back.onclick = function() {
  if (step >= 0) {
    step -= 1;
    context.clearRect(0, 0, canvas.width, canvas.height);
    let canvasPic = new Image();
    canvasPic.src = canvasHistory[step];
    canvasPic.addEventListener("load", () => {
      context.drawImage(canvasPic, 0, 0);
    });
    go.classList.add("active");
    if (step < 0) {
      back.classList.remove("active");
    }
  }
};
go.onclick = function() {
  if (step < canvasHistory.length - 1) {
    step += 1;
    let canvasPic = new Image();
    canvasPic.src = canvasHistory[step];
    canvasPic.addEventListener("load", () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(canvasPic, 0, 0);
    });
    back.classList.add("active");
    if (step === canvasHistory.length - 1) {
      go.classList.remove("active");
    }
  }
};

function autoSetCanvasSize(canvas) {
  canvasSize();
  window.onresize = function() {
    canvasSize();
  };
}

function canvasSize() {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineWidth = lineWidth;
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function drawCircle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function listenToUser(canvas) {
  var using = false;
  var lastPoint = {
    x: undefined,
    y: undefined
  };
  //特性检测
  if (document.body.ontouchstart === undefined) {
    //非触屏设备
    canvas.onmousedown = function(a) {
      var x = a.clientX;
      var y = a.clientY;
      using = true;
      if (eraserEnabled) {
        clearRect(x, y);
      } else {
        lastPoint = {
          x: x,
          y: y
        };
      }
    };
    canvas.onmousemove = function(a) {
      var x = a.clientX;
      var y = a.clientY;
      if (!using) {
        return;
      }
      if (eraserEnabled) {
        clearRect(x, y);
      } else {
        var newPoint = {
          x: x,
          y: y
        };
        drawCircle(x, y, lineWidth / 2);
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };
    canvas.onmouseup = function() {
      using = false;
      saveFragment();
    };
  } else {
    //触屏设备
    canvas.ontouchstart = function(a) {
      var x = a.touches[0].clientX;
      var y = a.touches[0].clientY;
      using = true;
      if (eraserEnabled) {
        clearRect(x, y);
      } else {
        lastPoint = {
          x: x,
          y: y
        };
      }
    };
    canvas.ontouchmove = function(a) {
      var x = a.touches[0].clientX;
      var y = a.touches[0].clientY;
      if (!using) {
        return;
      }
      if (eraserEnabled) {
        clearRect(x, y);
      } else {
        var newPoint = {
          x: x,
          y: y
        };
        drawCircle(x, y, lineWidth / 2);
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };
    canvas.ontouchend = function() {
      using = false;
      saveFragment();
    };
  }
}

function clearRect(x, y) {
  context.clearRect(x - lineWidth / 2, y - lineWidth / 2, lineWidth, lineWidth);
}

function saveFragment() {
  step += 1;
  if (step < canvasHistory.length) {
    canvasHistory.length = step;
  }
  canvasHistory.push(canvas.toDataURL());
  back.classList.add("active");
  go.classList.remove("active");
}

document.body.addEventListener(
  "touchmove",
  function(e) {
    e.preventDefault();
  },
  { passive: false }
);
