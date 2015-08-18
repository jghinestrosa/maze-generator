var MazePainter = (function(window, MazeGenerator) {
  'use strict';
  
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

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

      this.clear(0, 0, canvas.width, canvas.height);
    },

    drawLine: function(xFrom, yFrom, xTo, yTo) {
      this.ctx.beginPath();
      this.ctx.moveTo(xFrom, yFrom);
      this.ctx.lineTo(xTo, yTo);
      this.ctx.stroke();
    },

    startPainting: function() {
      if (MazeGenerator.exposedForPainting.length > 0) {
        var exposed = MazeGenerator.exposedForPainting.shift();
        this.paint(exposed.cellSize, exposed.cellToPaint, exposed.frontier, exposed.walls);
      }

      this.paintEntryExit();
      this.paintSolution();

      window.requestAnimationFrame(this.startPainting.bind(this));
    },

    paint: function(cellSize, cellToPaint, frontier, cellsNotConnected) {

      var xCellToPaint = this.getX(cellToPaint[1], cellSize);
      var yCellToPaint = this.getY(cellToPaint[0], cellSize);

      // Paint a cell from the maze
      this.ctx.fillStyle = this.cellColor;
      this.ctx.fillRect(xCellToPaint, yCellToPaint, cellSize, cellSize);


      // Paint the frontier
      this.ctx.fillStyle = this.frontierColor;
      Object.keys(frontier).forEach(function(key) {
        this.ctx.fillRect(this.getX(frontier[key][1], cellSize), this.getY(frontier[key][0], cellSize), cellSize, cellSize);
      }.bind(this));

      // Paint walls
      this.ctx.strokeStyle = this.wallColor;
      if (cellsNotConnected) {

        cellsNotConnected.forEach(function(cell) {

          // Up
          if (cell[0] < cellToPaint[0]) {
            this.drawLine(xCellToPaint, yCellToPaint, xCellToPaint + cellSize, yCellToPaint);
          }

          // Down
          if (cell[0] > cellToPaint[0]) {
            this.drawLine(xCellToPaint, yCellToPaint + cellSize, xCellToPaint + cellSize, yCellToPaint + cellSize);
          }

          // Left
          if (cell[1] < cellToPaint[1]) {
            this.drawLine(xCellToPaint, yCellToPaint, xCellToPaint, yCellToPaint + cellSize);
          }

          // Right
          if (cell[1] > cellToPaint[1]) {
            this.drawLine(xCellToPaint + cellSize, yCellToPaint, xCellToPaint + cellSize, yCellToPaint + cellSize);
          }

        }.bind(this));

      }

    },

    paintEntryExit: function() {
      if (MazeGenerator.entry && MazeGenerator.exit) {
        this.ctx.fillStyle = this.entryColor;
        this.ctx.fillRect(MazeGenerator.entry[0] * this.cellSize, MazeGenerator.entry[1] * this.cellSize, this.cellSize, this.cellSize);

        this.ctx.fillStyle = this.exitColor;
        this.ctx.fillRect(MazeGenerator.exit[0] * this.cellSize, MazeGenerator.exit[1] * this.cellSize, this.cellSize, this.cellSize);
      }
    },

    paintSolution: function() {
      if (MazeGenerator.solution.length > 0) {
        var cell = MazeGenerator.solution.shift();
        
        this.ctx.fillStyle = this.solutionColor;
        this.ctx.fillRect(cell[0] * this.cellSize, cell[1] * this.cellSize, this.cellSize, this.cellSize);
      }
    },

    clear: function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    getX: function(j, cellSize) {
      return j * cellSize;
    },

    getY: function(i, cellSize) {
      return i * cellSize;
    }
  };

  return mazePainter;


}(window, MazeGenerator));
