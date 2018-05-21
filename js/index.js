var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var K = 5;

var game = {
  colors: getColors(),
  difficulty: 1,
  board: [],
  score: '00',
  context: null,
  activeColor: null
};

function getColors() {
  var colors = [];

  var buttons = document.getElementsByClassName('buttons')[0];
  buttons.querySelectorAll('button').forEach(function (button) {
    colors.push(button.dataset.color);
  });

  return colors;
}

function chooseColor(button) {
  game.activeColor = button.dataset.color;

  setScore();

  propagateColor(0, 0, game.activeColor);
  drawBoard();

  game.board.squares.forEach(function (row) {
    row.forEach(function (sq) {
      sq.visited = false;
    });
  });
}

function setScore() {
  var score = document.getElementById('score');
  var currentScore = parseInt(score.innerHTML);

  if (currentScore < 10) {
    game.score = '0' + (currentScore + 1);
  } else {
    game.score = currentScore + 1;
  }

  score.innerHTML = game.score;
}

function resetGame() {
  game.board = [];
  game.context = null;
  game.activeColor = null;
  game.score = '00';

  document.getElementById('score').innerHTML = game.score;

  play();
}

function changeDifficulty(select) {
  game.difficulty = parseInt(select.value);

  resetGame();
}

function play() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  game.context = context;

  buildBoard();
}

function buildBoard() {
  var screen = document.getElementById('canvas').getBoundingClientRect();
  var boardSize = game.difficulty * K;
  game.context.canvas.width = screen.width;
  game.context.canvas.height = screen.height;

  var squareSize = game.context.canvas.width / boardSize;

  game.board = new Board(boardSize, squareSize);
  game.board.squares.forEach(function (row, i) {
    for (var j = 0; j < row.length; j++) {
      var square = new Square(i, j, game.board.squareSize, getRandomColor());

      game.board.setSquare(i, j, square);
    }
  });

  drawBoard();
}

function drawBoard() {
  game.board.squares.forEach(function (row) {
    row.forEach(function (sq) {
      sq.visited = false;

      drawSquare(sq.x, sq.y, game.board.squareSize, sq.color);
    });
  });
}

function propagateColor(i, j, newColor) {
  var square = game.board.squares[i][j];
  var surround = game.board.getSurroundingSquares(square.row, square.column);

  square.visited = true;

  surround.forEach(function (sq) {
    if (!sq.visited && sq.color == square.color) {
      propagateColor(sq.row, sq.column, newColor);
    }
  });

  square.color = newColor;
}

function drawSquare(x, y, size, color) {
  game.context.fillStyle = color;
  game.context.fillRect(x, y, size, size);
}

function getRandomColor() {
  return game.colors[Math.floor(Math.random() * game.colors.length)];
}

function toggle(button) {
  button.parentNode.classList.toggle('visible');
}

var Square = function Square(row, col, size, color) {
  _classCallCheck(this, Square);

  this.x = row * size;
  this.y = col * size;
  this.size = size;
  this.color = color;
  this.row = row;
  this.column = col;
};

var Board = function () {
  function Board(boardSize, squareSize) {
    _classCallCheck(this, Board);

    this.boardSize = boardSize;
    this.squareSize = squareSize;

    this.squares = new Array(boardSize);
    for (var i = 0; i < boardSize; i++) {
      this.squares[i] = new Array(boardSize);
    }
  }

  _createClass(Board, [{
    key: 'setSquare',
    value: function setSquare(i, j, square) {
      this.squares[i][j] = square;
    }
  }, {
    key: 'getSurroundingSquares',
    value: function getSurroundingSquares(x, y) {
      var _this = this;

      var surround = [];

      var positions = [];
      positions.push([x - 1, y]); //up
      positions.push([x, y - 1]); //left
      positions.push([x, y + 1]); //right
      positions.push([x + 1, y]); //down

      positions.forEach(function (pos) {
        var isInsideBoard = pos[0] >= 0 && pos[0] < _this.boardSize && pos[1] >= 0 && pos[1] < _this.boardSize;
        if (isInsideBoard) {
          surround.push(_this.squares[pos[0]][pos[1]]);
        }
      });

      return surround;
    }
  }]);

  return Board;
}();

window.onLoad = play();