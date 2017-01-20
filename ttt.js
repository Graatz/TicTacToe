var board = [];
var turn = 0;

var canvas;
var ctx;

var settings = {
  hidden : true,
  boardSize : 10,
  winningCondition : 3,
  xColor : "#555",
  oColor : "#555"
};

function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function showSettings() {
  if (settings.hidden === true) {
    document.getElementById('settings-button').innerHTML = 'hide settings';
    settings.hidden = false;

    document.getElementById('board-size').value = settings.boardSize;
    document.getElementById('winning-condition').value = settings.winningCondition;
    document.getElementById('x-color').value = settings.xColor;
    document.getElementById('o-color').value = settings.oColor;
    document.getElementById('x-color').style.color = settings.xColor;
    document.getElementById('o-color').style.color = settings.oColor;

    unfade(document.getElementById('settings'));
  }
  else if (settings.hidden === false) {
    document.getElementById('settings-button').innerHTML = 'show settings';
    fade(document.getElementById('settings'));
    settings.hidden = true;
  }
}

function applySettings() {
  if (settings.boardSize != document.getElementById('board-size').value) {
    settings.boardSize = document.getElementById('board-size').value;
    initBoard();
  }

  settings.winningCondition = document.getElementById('winning-condition').value;
  settings.xColor = document.getElementById('x-color').value;
  settings.oColor = document.getElementById('o-color').value;

  document.getElementById('x-color').style.color = settings.xColor;
  document.getElementById('o-color').style.color = settings.oColor;
}

function setBoardSize() {
  var newSize = Math.floor(document.getElementById("board-size").value);
  if (newSize <= 20 && newSize >= 3) {
    document.getElementById("error-message").innerHTML = "";
    cellSize = Math.floor(canvas.width / newSize);
    initBoard();
  } else {
    console.log(newSize);
    if (newSize > 20)
      document.getElementById("error-message").innerHTML = "Maximum board size is 20";
    else if (newSize < 3)
      document.getElementById("error-message").innerHTML = "Minimum board size is 3";
    else if (newSize === undefined || newSize === null)
      document.getElementById("error-message").innerHTML = "Type board size";
  }
}

function cell(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.x = false;
  this.o = false;
}

cell.prototype.putX = function() {
  if (this.x === false && this.o === false) {
    this.x = true;
  }
  this.draw()
  checkIfWin(this);
};

cell.prototype.putO = function() {
  if (this.x === false && this.o === false) {
    this.o = true;
  }
  this.draw()
};

cell.prototype.isEmpty = function() {
  if (this.x === false && this.o === false)
    return true;
  else {
    if (this.x === true) console.log("There is already X in this cell");
    else if (this.o === true) console.log("There is already O in this cell");
    return false;
  }
};

cell.prototype.draw = function() {
  if (this.x === true) {
    drawX(this.posX, this.posY);
  }
  else if(this.o === true) {
    drawO(this.posX, this.posY);
  }
};

function checkIfWin(cell) {
    checkVertical(cell.posX, cell.posY);
    //checkHorizontal(cell.posX, cell.posY);
    //checkDiagonal(cell.posX, cell.posY);
}

function checkDiagonal(posX, posY) {
  var condition = 0;
  do {
    if (getCell(posX - getCellSize(), posY - getCellSize()).x === true) {
      posX -= getCellSize();
      posY -= getCellSize();
    }
    else break;
  } while (true)

  do {
    if (getCell(posX, posY).x === true) {
      condition++;
      posX += getCellSize();
      posY += getCellSize();
    }
    else break;
  } while (true);

  if(condition === settings.winningCondition)
    console.log("winner!");
}

function checkHorizontal(posX, posY) {
  var condition = 0;
  do {
    if (getCell(posX - getCellSize(), posY).x === true)
      posX -= getCellSize();
    else break;
  } while (true)

  do {
    if (getCell(posX, posY).x === true) {
      condition++;
      posX += getCellSize();
    }
    else break;
  } while (true);

  if(condition === settings.winningCondition)
    console.log("winner!");
}

function checkVertical(posX, posY) {
  var condition = 1;
  var upY = posY, up = false;
  var downY = posY, down = false;

  do {
    if (up === false)
      upY -= getCellSize();
    if (down === false)
      downY += getCellSize();

    if (cellExists(posX, upY)) {
      if(getCell(posX, upY).x === true)
        condition++;
      else
        up = true;
    } else up = true;

    if (cellExists(posX, downY)) {
      if(getCell(posX, downY).x === true)
        condition++;
      else
        down = true;
    } else down = true;

  } while(up === false || down === false)

  console.log(condition);
  if(condition === settings.winningCondition)
    console.log("winner!");
}

function cellExists(posX, posY) {
  if (getCell(posX, posY) != null)
    return true;
  else {
    return false;
  }
}

function drawX(posX, posY) {
  ctx.lineWidth = 3;
  ctx.strokeStyle = settings.xColor;
  ctx.beginPath();
  ctx.moveTo(posX + 100 / settings.boardSize, posY + 100 / settings.boardSize);
  ctx.lineTo(posX + getCellSize() - 100 / settings.boardSize, posY + getCellSize() - 100 / settings.boardSize)
  ctx.moveTo(posX + getCellSize() - 100 / settings.boardSize, posY + 100 / settings.boardSize);
  ctx.lineTo(posX + 100 / settings.boardSize, posY + getCellSize() - 100 / settings.boardSize)
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#333";
}

function drawO(posX, posY) {
  ctx.lineWidth = 3;
  ctx.strokeStyle = settings.oColor;
  ctx.beginPath();
  ctx.arc(Math.floor((posX + getCellSize() / 2)), Math.floor(posY + getCellSize() / 2), (getCellSize() / 2) - 100 / settings.boardSize, 0, 2 * Math.PI)
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#333";
}

function getCell(posX, posY) {
  var boardIndex = ((Math.floor(posY / getCellSize()) * settings.boardSize)) + (Math.floor(posX / getCellSize()));
  return board[boardIndex];
}

function getboardDimension() {
  var dimension = canvas.width / getCellSize();

  return Math.floor(dimension);
}

function getCellSize() {
  return Math.floor(canvas.width / settings.boardSize);
}

function initCanvas() {
  canvas = document.createElement("canvas");
  canvas.width = canvas.height = 600;
  ctx = canvas.getContext("2d");
  document.getElementById("canvas-container").appendChild(canvas);
  canvas.addEventListener("mousedown", putFigure);
  initBoard();
}

function initBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var currentRow = 0;
  var currentCol = 0;

  for (var i = 0; i < settings.boardSize * settings.boardSize; i++) {
    if (currentCol == settings.boardSize && i > 0) {
      currentRow++;
      currentCol = 0;
    }

    board[i] = new cell(currentCol * getCellSize(), currentRow * getCellSize());
    currentCol++;
  }

  drawBoard();
}

function putFigure(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;

    if (turn === 1){
      if (getCell(x, y).isEmpty()) {
        getCell(x, y).putX();
        turn ^= 1;
      }
    } else if (turn === 0) {
      if (getCell(x, y).isEmpty()) {
        getCell(x, y).putO();
        turn ^= 1;
      }
    }
}

function drawBoard() {
  ctx.strokeStyle = "#333";

  for (var i = 0; i < settings.boardSize; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * getCellSize());
    ctx.lineTo(settings.boardSize * getCellSize(), i * getCellSize());
    ctx.moveTo(i * getCellSize(), 0);
    ctx.lineTo(i * getCellSize(), settings.boardSize * getCellSize());
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(canvas.width, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.stroke();
}
