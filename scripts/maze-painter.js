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
      this.drawCell(xCellToPaint, yCellToPaint, cellSize, cellSize, this.cellColor);

      // Paint the frontier
      //this.ctx.fillStyle = this.frontierColor;
      //Object.keys(frontier).forEach(function(key) {
        //this.ctx.fillRect(this.getX(frontier[key][1], cellSize), this.getY(frontier[key][0], cellSize), cellSize, cellSize);
      //}.bind(this));

      // Paint walls
      if (cellsNotConnected) {

        cellsNotConnected.forEach(function(cell) {

          // Up
          if (cell[0] < cellToPaint[0]) {
            this.drawLine(xCellToPaint, yCellToPaint, xCellToPaint + cellSize, yCellToPaint, this.wallColor);
          }

          // Down
          if (cell[0] > cellToPaint[0]) {
            this.drawLine(xCellToPaint, yCellToPaint + cellSize, xCellToPaint + cellSize, yCellToPaint + cellSize, this.wallColor);
          }

          // Left
          if (cell[1] < cellToPaint[1]) {
            this.drawLine(xCellToPaint, yCellToPaint, xCellToPaint, yCellToPaint + cellSize, this.wallColor);
          }

          // Right
          if (cell[1] > cellToPaint[1]) {
            this.drawLine(xCellToPaint + cellSize, yCellToPaint, xCellToPaint + cellSize, yCellToPaint + cellSize, this.wallColor);
          }

        }.bind(this));

      }

    },

    paintEntryExit: function() {
      if (MazeGenerator.entry && MazeGenerator.exit) {
        this.drawCell(MazeGenerator.entry[0] * this.cellSize, MazeGenerator.entry[1] * this.cellSize, this.cellSize, this.cellSize, this.entryColor);
        this.drawCell(MazeGenerator.exit[0] * this.cellSize, MazeGenerator.exit[1] * this.cellSize, this.cellSize, this.cellSize, this.entryColor);
      }
    },

    paintSolution: function() {
      if (MazeGenerator.solution.length > 0) {
        var cell = MazeGenerator.solution.shift();
        this.drawCell(cell[1] * this.cellSize, cell[0] * this.cellSize, this.cellSize, this.cellSize, this.solutionColor);
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
