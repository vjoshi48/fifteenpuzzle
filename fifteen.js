var gridSize = 4;
    var puzzleCells = createPuzzleGrid();
    var puzzleValues;
    var emptyCellX, emptyCellY;
    var MOVE_LEFT = { dx: -1, dy: 0 };
    var MOVE_RIGHT = { dx: 1, dy: 0 };
    var MOVE_UP = { dx: 0, dy: -1 };
    var MOVE_DOWN = { dx: 0, dy: 1 };
    var currentBackground;

    // Function to create the puzzle grid
    function createPuzzleGrid() {
      var cells = [];
      var table = document.getElementById('puzzleGrid');

      for (var y = 0; y < gridSize; y++) {
        var row = document.createElement('tr');
        table.appendChild(row);
        var rowCells = [];

        cells.push(rowCells);

        for (var x = 0; x < gridSize; x++) {
          var cell = document.createElement('td');
          cell.setAttribute('class', 'puzzle-cell');
          cell.addEventListener('click', function() {
            handleCellClick(this);
          });
          cell.addEventListener('mouseover', function() {
            highlightMovablePiece(this);
          });
          cell.addEventListener('mouseout', function() {
            removeMovableHighlight(this);
          });

          row.appendChild(cell);
          rowCells.push(cell);
        }
      }

      return cells;
    }

    // Function to create initial values for the puzzle
    function createInitialValues() {
      emptyCellX = emptyCellY = gridSize - 1;
      var values = [];
      var i = 1;

      for (var y = 0; y < gridSize; y++) {
        var rowValues = [];
        values.push(rowValues);

        for (var x = 0; x < gridSize; x++) {
          rowValues.push(i);
          i++;
        }
      }

      values[emptyCellY][emptyCellX] = 0;
      return values;
    }

    // Function to draw the puzzle grid
    function drawPuzzle() {
      for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
          var value = puzzleValues[y][x];
          var cell = puzzleCells[y][x];

          // Set cell content and background
          cell.innerHTML = value === 0 ? '' : String(value);
          cell.setAttribute('data-value', String(value));

          if (value === 0) {
            cell.style.backgroundColor = 'white';
            cell.style.backgroundImage = 'none';
          } else {
            cell.style.backgroundColor = '';
            cell.style.backgroundImage = `url('${currentBackground}')`;
          }
        }
      }
    }

    // Function to make a move in the puzzle
    function makeMove(move) {
      var newX = emptyCellX + move.dx;
      var newY = emptyCellY + move.dy;

      if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
        return false;
      }

      var cellValue = puzzleValues[newY][newX];
      puzzleValues[newY][newX] = 0;
      puzzleValues[emptyCellY][emptyCellX] = cellValue;
      emptyCellX = newX;
      emptyCellY = newY;

      return true;
    }

    // Function to shuffle the puzzle pieces
    function shufflePuzzle() {
      var moves = [MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN];
      var iterations = 30;

      for (var i = 0; i < iterations; i++) {
        var randomMove = moves[Math.floor(Math.random() * moves.length)];
        makeMove(randomMove);
      }

      drawPuzzle();
    }

    // Function to check if the puzzle is solved
    function isPuzzleSolved() {
      var expectedValue = 1;

      for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
          if (puzzleValues[y][x] === expectedValue) {
            expectedValue++;
          } else {
            if (x === gridSize - 1 && y === gridSize - 1 && puzzleValues[y][x] === 0) {
              return true;
            }
            return false;
          }
        }
      }

      return true;
    }

    // Function to handle cell click events
    function handleCellClick(clickedCell) {
      var clickedX, clickedY;

      for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
          if (puzzleCells[y][x] === clickedCell) {
            clickedX = x;
            clickedY = y;
            break;
          }
        }
      }

      if ((clickedX === emptyCellX && Math.abs(clickedY - emptyCellY) === 1) ||
        (clickedY === emptyCellY && Math.abs(clickedX - emptyCellX) === 1)
      ) {
        makeMove({ dx: clickedX - emptyCellX, dy: clickedY - emptyCellY });
        drawPuzzle();

        if (isPuzzleSolved()) {
          setTimeout(function () {
            alert('Congratulations! You solved the puzzle!');
            initializePuzzle();
          }, 1000);
        }
      }
    }

    // Function to highlight movable puzzle piece on hover
    function highlightMovablePiece(cell) {
      var cellX, cellY;

      for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
          if (puzzleCells[y][x] === cell) {
            cellX = x;
            cellY = y;
            break;
          }
        }
      }

      if ((cellX === emptyCellX && Math.abs(cellY - emptyCellY) === 1) ||
        (cellY === emptyCellY && Math.abs(cellX - emptyCellX) === 1)
      ) {
        cell.classList.add('movable-piece');
      }
    }

    // Function to remove highlight from movable puzzle piece
    function removeMovableHighlight(cell) {
      cell.classList.remove('movable-piece');
    }

    // Function to change the background image of the puzzle
    function changeBackground() {
      var backgroundSelect = document.getElementById('backgroundSelect');
      currentBackground = backgroundSelect.value;
      drawPuzzle();
    }

    // Function to initialize the puzzle
    function initializePuzzle() {
      var backgroundOptions = ['background1.png', 'background2.png', 'background3.png', 'background4.jpg'];
      currentBackground = backgroundOptions[Math.floor(Math.random() * backgroundOptions.length)];
      puzzleValues = createInitialValues();
      shufflePuzzle();
      drawPuzzle();
    }

    // Initialize the puzzle on page load
    initializePuzzle();