var board = [];
var turn = 0;

var canvas;
var ctx;

var settings = {
  hidden : true,
  boardSize : 10,
  winningCondition : 3,
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
        op += 0.1;
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
        op -= 0.1;
    }, 10);
}

function showSettings() {
  if (settings.hidden === true) {
    document.getElementById('settings-button').innerHTML = 'hide settings';
    document.getElementById('board-size').value = settings.boardSize;
    document.getElementById('winning-condition').value = settings.winningCondition;
    unfade(document.getElementById('settings'));
    settings.hidden = false;
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
  }
  settings.winningCondition = Math.floor(document.getElementById('winning-condition').value);
  initBoard();
}

function cell(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.figure = 'N';
}

cell.prototype.putX = function() {
  if (this.figure === 'N' && this.figure === 'N') {
    this.figure = 'X';
  }
  this.draw()
  checkIfWin(this, 'X');
};

cell.prototype.putO = function() {
  if (this.figure === 'N' && this.figure === 'N') {
    this.figure = 'O';
  }
  this.draw()
  checkIfWin(this, 'O');
};

cell.prototype.isEmpty = function() {
  if (this.figure === 'N' && this.figure === 'N')
    return true;
  else {
    if (this.figure === 'X') console.log("There is already X in this cell");
    else if (this.figure === 'O') console.log("There is already O in this cell");
    return false;
  }
};

cell.prototype.draw = function() {
  if (this.figure === 'X') {
    drawX(this.posX, this.posY);
  }
  else if(this.figure === 'O') {
    drawO(this.posX, this.posY);
  }
};

function checkIfWin(cell, figure) {
    checkVertical(cell.posX, cell.posY, figure);
    checkHorizontal(cell.posX, cell.posY, figure);
    checkDiagonalA(cell.posX, cell.posY, figure);
    checkDiagonalB(cell.posX, cell.posY, figure);

    console.log("board size: " + settings.boardSize + " | " + "cell size: " + getCellSize());
}

function checkDiagonalA(posX, posY, figure) {
  var condition = 1;
  var leftX = posX, leftY = posY, left = false;
  var rightX = posX, rightY = posY, right = false;

  do {
    if (left === false) {
      if (cellExists(leftX - getCellSize(), leftY - getCellSize()) && getCell(leftX - getCellSize(), leftY - getCellSize()).figure === figure) {
        condition++;
        leftX -= getCellSize();
        leftY -= getCellSize();
      }
      else
        left = true;
    }
    if (right === false) {
      if (cellExists(rightX + getCellSize(), rightY + getCellSize()) && getCell(rightX + getCellSize(), rightY + getCellSize()).figure === figure) {
        condition++;
        rightX += getCellSize();
        rightY += getCellSize();
      }
      else
        right = true;
    }
  } while(left === false || right === false)

  console.log(condition + ("(diagonalA) | winning condition = " + settings.winningCondition));
  if(condition === settings.winningCondition) {
    drawWinningLine(leftX, leftY, rightX + getCellSize(), rightY + getCellSize())
  }
}

function checkDiagonalB(posX, posY, figure) {
  var condition = 1;
  var leftX = posX, leftY = posY, left = false;
  var rightX = posX, rightY = posY, right = false;
  console.log("=========================");
  console.log("clicked: " + posX + ", " + posY);
  do {
    if (left === false) {
      if (cellExists(leftX - getCellSize(), leftY + getCellSize()) && getCell(leftX - getCellSize(), leftY + getCellSize()).figure === figure) {
        leftX -= getCellSize();
        leftY += getCellSize();
        condition++;
        console.log("added diagonalB" + " X: " + leftX + " Y: " + leftY);
      }
      else
        left = true;
    }
    if (right === false) {
      if (cellExists(rightX + getCellSize(), rightY - getCellSize()) && getCell(rightX + getCellSize(), rightY - getCellSize()).figure === figure) {
        rightX += getCellSize();
        rightY -= getCellSize();
        console.log("added diagonalB" + " X: " + rightX + " Y: " + rightY);
        condition++;
      }
      else
        right = true;
    }
  } while(left === false || right === false)

  console.log(condition + ("(diagonalB) | winning condition = " + settings.winningCondition));
  console.log("=========================");
  if(condition === settings.winningCondition) {
    drawWinningLine(leftX, leftY + getCellSize(), rightX + getCellSize(), rightY)
  }
}

function checkHorizontal(posX, posY, figure) {
  var condition = 1;
  var leftX = posX, left = false;
  var rightX = posX, right = false;

  do {
    if (left === false) {
      if (cellExists(leftX - getCellSize(), posY) && getCell(leftX - getCellSize(), posY).figure === figure) {
        condition++;
        leftX -= getCellSize();
      }
      else
        left = true;
    }
    if (right === false) {
      if (cellExists(rightX + getCellSize(), posY) && getCell(rightX + getCellSize(), posY).figure === figure) {
        condition++;
        rightX += getCellSize();
      }
      else
        right = true;
    }
  } while(left === false || right === false)

  console.log(condition + ("(horizontal) | winning condition = " + settings.winningCondition));
  if(condition === settings.winningCondition) {
    drawWinningLine(leftX, posY + getCellSize() / 2, rightX + getCellSize(), posY + getCellSize() / 2)
  }
}

function checkVertical(posX, posY, figure) {
  var condition = 1;
  var upY = posY, up = false;
  var downY = posY, down = false;

  do {
    if (up === false) {
      if (cellExists(posX, upY - getCellSize()) && getCell(posX, upY - getCellSize()).figure === figure) {
        condition++;
        upY -= getCellSize();
      }
      else
        up = true;
    }
    if (down === false) {
      if (cellExists(posX, downY + getCellSize()) && getCell(posX, downY + getCellSize()).figure === figure) {
        condition++;
        downY += getCellSize();
      }
      else
        down = true;
    }

  } while(up === false || down === false)

  console.log(condition + ("(vertical) | winning condition = " + settings.winningCondition));
  if(condition === settings.winningCondition) {
    drawWinningLine(posX + getCellSize() / 2, upY, posX + getCellSize() / 2, downY + getCellSize())
  }
}

function drawWinningLine(posX1, posY1, posX2, posY2) {
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(posX1, posY1);
  ctx.lineTo(posX2, posY2);
  ctx.stroke();
}

function drawX(posX, posY) {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#555";
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
  ctx.strokeStyle = "#555";
  ctx.beginPath();
  ctx.arc(Math.floor((posX + getCellSize() / 2)), Math.floor(posY + getCellSize() / 2), (getCellSize() / 2) - 100 / settings.boardSize, 0, 2 * Math.PI)
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#333";
}

function cellExists(posX, posY) {
  if (posX >= 0 && posX <= (canvas.width - 1) && posY >= 0 && posY <= (canvas.height - 1)) {
    console.log("cell " + posX + ", " + posY + "exists");
    return true;
  }
  else {
    console.log("cell " + posX + ", " + posY + "doesnt exists");
    return false;
  }
}

function getCell(posX, posY) {
  if (cellExists(posX, posY)) {
    var boardIndex = ((Math.floor(posY / getCellSize()) * settings.boardSize)) + (Math.floor(posX / getCellSize()));

    return board[boardIndex];
  }
  else {
    return new cell(null, null);
  }
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

  console.log("------------------------------");
  for (var i = 0; i < settings.boardSize * settings.boardSize; i++) {
    if (currentCol == settings.boardSize && i > 0) {
      currentRow++;
      currentCol = 0;
    }

    board[i] = new cell(currentCol * getCellSize(), currentRow * getCellSize());
    currentCol++;
    console.log("Cell " + i + " X: " + board[i].posX + " Y: " + board[i].posY);
  }
  console.log("------------------------------");
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
