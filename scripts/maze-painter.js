var MazePainter = (function(window, MazeGenerator) {
  'use strict';
  
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  var paintingMaze = false;
  var mazePainted = false;

  var mazePainter = {
    
    init: function(canvas, cellSize, cellColor, frontierColor, wallColor, entryColor, exitColor, solutionColor) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');

      this.cellSize = cellSize;

      this.cellColor = cellColor;
      this.frontierColor = frontierColor;
      this.wallColor = wallColor;

      this.entryColor = entryColor;
      this.exitColor = exitColor;

      this.solutionColor = solutionColor;

      paintingMaze = false;
      mazePainted = false;

      this.clear(0, 0, canvas.width, canvas.height);
    },

    isMazePainted: function() {
      return mazePainted;
    },

    drawLine: function(xFrom, yFrom, xTo, yTo, color) {
      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(xFrom, yFrom);
      this.ctx.lineTo(xTo, yTo);
      this.ctx.stroke();
    },

    drawCell: function(x, y, width, height, color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, height);
    },

    startPainting: function() {
      this.paintMazeGeneration();
      this.paintEntryExit();
      this.paintSolution(MazeGenerator.solution);
      this.paintSolution(MazeInteraction.solution);

      window.requestAnimationFrame(this.startPainting.bind(this));
    },

    paintMazeGeneration: function() {

      if (MazeGenerator.exposedForPainting.length > 0) {
        paintingMaze = true;

        // Paint 4 cells each animation frame iteration to
        // increase the speed of generation
        for (var i = 0; i < 4; i++) {
          var exposed = MazeGenerator.exposedForPainting.shift();
          this.paintGeneratedCell(exposed);
        }
      }
      else {
        if (paintingMaze) {
          mazePainted = true;
        }
      }
    },

    paintGeneratedCell: function(cellInfo) {
      if (cellInfo) {

        // Calculate x and y
        var xCellToPaint = this.getX(cellInfo.cellToPaint[1]);
        var yCellToPaint = this.getY(cellInfo.cellToPaint[0]);

        // Paint a cell from the maze
        this.drawCell(xCellToPaint, yCellToPaint, this.cellSize, this.cellSize, this.cellColor);

        // Paint walls surrounding this cell
        if (cellInfo.walls) {
          this.paintWalls(cellInfo.cellToPaint[0], cellInfo.cellToPaint[1], xCellToPaint, yCellToPaint, cellInfo.walls);
        }
      }
    },
    
    paintWalls: function(i, j, x, y, cellsNotConnected) {
      cellsNotConnected.forEach(function(cell) {

        // Up
        if (cell[0] < i) {
          this.drawLine(x, y, x + this.cellSize, y, this.wallColor);
        }

        // Down
        if (cell[0] > i) {
          this.drawLine(x, y + this.cellSize, x + this.cellSize, y + this.cellSize, this.wallColor);
        }

        // Left
        if (cell[1] < j) {
          this.drawLine(x, y, x, y + this.cellSize, this.wallColor);
        }

        // Right
        if (cell[1] > j) {
          this.drawLine(x + this.cellSize, y, x + this.cellSize, y + this.cellSize, this.wallColor);
        }

      }.bind(this));

    },

    paintEntryExit: function() {
      if (MazeGenerator.entry && MazeGenerator.exit) {
        this.drawCell(this.getX(MazeGenerator.entry[1]), this.getY(MazeGenerator.entry[0]), this.cellSize, this.cellSize, this.entryColor);
        this.drawCell(this.getX(MazeGenerator.exit[1]), this.getY(MazeGenerator.exit[0]), this.cellSize, this.cellSize, this.entryColor);
      }
    },

    paintSolution: function(solution) {
      if (solution.length > 0) {
        console.log(solution);
        var cell = solution.shift();
        console.log(cell);
        this.drawCell(this.getX(cell[1]), this.getY(cell[0]), this.cellSize, this.cellSize, this.solutionColor);
      }
    },

    clear: function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    getX: function(j) {
      return j * this.cellSize;
    },

    getY: function(i) {
      return i * this.cellSize;
    }
  };

  return mazePainter;


}(window, MazeGenerator));
