var MazeGenerator = (function() {
  'use strict';

  var maze = {};
  var frontier = {};

  // In order to avoid Object.keys() to create a new array
  // in mazeGenerator.generate() for each iteration 
  // TODO: Maybe find a better alternative
  var frontierList = [];

  var solutionCallbacks = [];

  function callSolutionCallbacks() {
    solutionCallbacks.forEach(function(callback) {
      callback();
    });
  }

  var mazeGenerator = {

    exposedForPainting: [],

    solution: [],

    init: function(width, height, cellSize) {
      this.cellSize = cellSize;
      this.columns = width / this.cellSize;
      this.rows = height / this.cellSize; 

      this.entry = [];
      this.exit = [];

      this.solution = [];

      this.exposedForPainting = [];

      maze = {};
      frontierList = [];
      frontier = {};
    },

    getAdjacentCells: function(i, j) {
      var adjacentCells = [];

      // Up
      if (i - 1 >= 0) {
        adjacentCells.push([i - 1, j]);
      } 

      // Down
      if (i + 1 < this.rows) {
        adjacentCells.push([i + 1, j]);
      }

      // Left
      if (j - 1 >= 0) {
        adjacentCells.push([i, j - 1]);
      }

      // Right
      if (j + 1 < this.columns) {
        adjacentCells.push([i, j + 1]);
      }

      return adjacentCells;
    },

    addCellToFrontier: function(i, j) {
      var cellString = this.cellToString(i, j);
      frontier[cellString] = [i, j];
      frontierList.push(cellString);
    },

    addAdjacentCellsToFrontier: function(adjacentCells) {
      adjacentCells.forEach(function(cell) {
        var i = cell[0];
        var j = cell[1];

        if (!mazeGenerator.isCellInMaze(i, j) && !mazeGenerator.isCellInFrontier(i, j)) {
          mazeGenerator.addCellToFrontier(i, j);
        }
      });
    },

    addCellToMaze: function(i, j) {
      //maze[this.cellToString(i, j)] = [];
      maze[this.cellToString(i, j)] = {
        children: [],
        parent: null
      };
    },

    getCellFromMaze: function(i, j) {
      return maze[this.cellToString(i, j)];
    },
    
    pickRandomCell: function(cells) {
      return Math.floor((Math.random() * cells.length));
    },

    pickFrontierCell: function() {
      return frontierList[this.pickRandomCell(frontierList)];
    },

    pickInitialCell: function() {
      var column = Math.floor((Math.random() * this.columns));
      var row = Math.floor((Math.random() * this.rows));
      return [row, column];
    },

    cellToString: function(i, j) {
      return i + ', ' + j;
    },

    isCellInMaze: function(i, j) {
      if (maze[this.cellToString(i, j)]) {
        return true;
      }

      return false;
    },

    isCellInFrontier: function(i, j) {
      if (frontier[this.cellToString(i, j)]) {
        return true;
      }

      return false;
    },

    removeFromFrontier: function(key) {
      delete frontier[key];
      frontierList.splice(frontierList.indexOf(key), 1);
    },

    removeCellsNotInMaze: function(cells) {
      var cellsInMaze = [];
      cells.forEach(function(cell) {
        if (mazeGenerator.isCellInMaze(cell[0], cell[1])) {
          cellsInMaze.push(cell);
        }
      }); 

      return cellsInMaze;
    },

    joinTwoCellsFromMaze: function(cellFrom, cellTo) {
      this.getCellFromMaze(cellFrom[0], cellFrom[1]).children.push(cellTo);
      this.getCellFromMaze(cellTo[0], cellTo[1]).parent = cellFrom;
    },

    areCellsJoined: function(cellFrom, cellTo) {
      var joined = false;
      this.getCellFromMaze(cellFrom[0], cellFrom[1]).children.forEach(function(cell) {
        if (cell[0] === cellTo[0] && cell[1] === cellTo[1]) {
          joined = true;
        } 
      });

      if (!joined) {
        this.getCellFromMaze(cellTo[0], cellTo[1]).children.forEach(function(cell) {
          if (cell[0] === cellFrom[0] && cell[1] === cellFrom[1]) {
            joined = true;
          } 
        });
      }


      return joined;
    },

    generate: function() {

      // Pick an initial cell and add it to the maze
      var initialCell = this.pickInitialCell();
      this.addCellToMaze(initialCell[0], initialCell[1]);

      // Get adjacent cells and add them to the frontier
      var adjacentCells = this.getAdjacentCells(initialCell[0], initialCell[1]);
      this.addAdjacentCellsToFrontier(adjacentCells);

      this.exposedForPainting.push({cellSize: this.cellSize, cellToPaint: initialCell, frontier: frontier, walls: null});

      while (frontierList.length !== 0) {

        // Pick a cell from frontier randomly and remove from frontier
        var frontierIndex = this.pickFrontierCell();
        var chosenCellFromFrontier = frontier[frontierIndex];
        this.removeFromFrontier(frontierIndex);
        
        // Get adjacent cells of new cell picked from frontier and select a previous cell from maze
        adjacentCells = this.getAdjacentCells(chosenCellFromFrontier[0], chosenCellFromFrontier[1]);
        var adjacentCellsInMaze = this.removeCellsNotInMaze(adjacentCells);
        var cellFromMaze = adjacentCellsInMaze[this.pickRandomCell(adjacentCellsInMaze)];

        // Add the cell from frontier to the maze, join it to the previous selected cell from maze and add new cells to frontier
        this.addCellToMaze(chosenCellFromFrontier[0], chosenCellFromFrontier[1]);
        this.joinTwoCellsFromMaze(cellFromMaze, chosenCellFromFrontier);
        this.addAdjacentCellsToFrontier(adjacentCells);

        if (adjacentCellsInMaze.length > 1) {
          adjacentCellsInMaze.splice(adjacentCellsInMaze.indexOf(cellFromMaze), 1);
          this.exposedForPainting.push({cellSize: this.cellSize, cellToPaint: chosenCellFromFrontier, frontier: frontier, walls: adjacentCellsInMaze});
        }
        else {
          this.exposedForPainting.push({cellSize: this.cellSize, cellToPaint: chosenCellFromFrontier, frontier: frontier, walls: null});
        }
      }
    },

    getMaze: function() {
      return maze;
    },

    selectEntry: function() {
      this.entry = [Math.floor(Math.random() * this.rows), 0];
    },

    selectExit: function() {
      this.exit = [Math.floor(Math.random() * this.rows), this.columns - 1];
    },

    solve: function() {
      var pathFromEntry = this.reachFirstCell(this.entry[0], this.entry[1]);
      var pathFromExit = this.reachFirstCell(this.exit[0], this.exit[1]);

      this.solution = pathFromEntry.concat(pathFromExit.reverse());

      callSolutionCallbacks();

    },

    reachFirstCell: function(i, j) {
      var path = [];
      var nextCell = [i, j];

      do {
        path.push(nextCell);
        nextCell = this.getCellFromMaze(nextCell[0], nextCell[1]).parent;
      }
      while(nextCell);

      return path;
    },

    areTheSameCell: function(cell1, cell2) {
      return cell1[0] === cell2[0] && cell1[1] === cell2[1];
    },

    onSolved: function(callback) {
      solutionCallbacks.push(callback);
    }

  };

  return mazeGenerator;

}());
