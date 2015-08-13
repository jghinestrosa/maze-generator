var MazeGenerator = (function() {

  var frontier = {};
  var frontierList = [];
  var maze = {};

  mazeGenerator = {

    cellSize: 40,

    init: function(width, height) {
      this.columns = width / cellSize;
      this.rows = height / cellSize; 
    },

    getAdjacentCells: function(i, j) {
      var adjacentCells = [];

      // Up
      if (i - 1 >= 0) {
        //if (!isCellInMaze(i - 1, j)) {
          //adjacentCells.push(this.cellToString(i - 1, j));
          adjacentCells.push([i - 1, j]);
        //}
      } 

      // Down
      if (i + 1 < this.rows) {
        //if (!isCellInMaze(i + 1, j)) {
          //adjacentCells.push(this.cellToString(i + 1, j));
          adjacentCells.push([i + 1, j]);
        //}
      }

      // Left
      if (j - 1 >= 0) {
        //if (!isCellInMaze(i, j - 1)) {
          //adjacentCells.push(this.cellToString(i, j - 1));
          adjacentCells.push([i, j - 1]);
        //}
      }

      // Right
      if (j + 1 < this.columns) {
        //if (!isCellInMaze(i, j + 1)) {
          //adjacentCells.push(this.cellToString(i, j + 1));
          adjacentCells.push([i, j + 1]);
        //}
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
      //maze.push(this.cellToString(i, j));
      maze[this.cellToString(i, j)] = [];
    },

    getCellFromMaze: function(i, j) {
      return maze[this.cellToString(i, j)];
    },
    
    pickRandomCell: function(cells) {
      return Math.floor((Math.random() * cells.length));
    },

    pickFrontierCell: function() {
      //return Math.floor((Math.random() * frontierList.length));
      //return frontierList[Math.floor((Math.random() * frontierList.length))];
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
      //return maze[this.cellToString(i, j)];
      if (maze[this.cellToString(i, j)]) {
        return true;
      }

      return false;
    },

    isCellInFrontier: function(i, j) {
      //return frontierList[this.cellToString(i, j)];
      if (frontier[this.cellToString(i, j)]) {
        return true;
      }

      return false;
    },

    removeFromFrontier: function(key) {
      //var cellString = this.cellToString(i, j);
      delete frontier[key];
      frontierList.splice(frontierList.indexOf(key), 1);
    },

    removeCellsNotInMaze: function(cells) {
      var cellsInMaze = [];
      cells.forEach(function(cell) {
        if (isCellInMaze(cell[0], cell[1])) {
          cellsInMaze.push(cell);
        }
      }); 

      return cellsInMaze;
    },

    joinTwoCellsFromMaze: function(cellFrom, cellTo) {
      this.getCellFromMaze(cellFrom[i], cellFrom[j]).push(cellTo);
    },

    generate: function() {

      // Pick an initial cell and add it to the maze
      var initialCell = this.pickInitialCell();
      this.addCellToMaze(initialCell[0], initialCell[1]);

      // Get adjacent cells and add them to the frontier
      var adjacentCells = this.getAdjacentCells(initialCell[0], initialCell[1]);
      this.addAdjacentCellsToFrontier(adjacentCells);

      while (frontierList.length !== 0) {

        // Pick a cell from frontier randomly and remove from frontier
        var frontierIndex = this.pickFrontierCell();
        var chosenCellFromFrontier = frontier[frontierIndex];
        this.removeFromFrontier(frontierIndex);
        
        // Get adjacent cells of new cell picked from frontier and join it to a previous cell from maze
        adjacentCells = this.getAdjacentCells(chosenCellFromFrontier[0], chosenCellFromFrontier[1]);
        var adjacentCellsInMaze = removeCellsNotInMaze(adjacentCells);
        var cellFromMaze = this.pickRandomCell(adjacentCellsInMaze);
        this.joinTwoCellsFromMaze(cellFromMaze, chosenCellFromFrontier);

        // Add the cell from frontier to the maze and add new cells to frontier
        this.addCellToMaze(chosenCellFromFrontier[0], chosenCellFromFrontier[1]);
        this.addAdjacentCellsToFrontier(adjacentCells);
      }

    }

  };

}());
