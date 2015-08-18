var MazePainter = (function(window, MazeGenerator) {
  'use strict';
  
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;

  var mazePainter = {
    
    init: function(canvas, cellColor, frontierColor, wallColor) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');

      this.cellColor = cellColor;
      this.frontierColor = frontierColor;
      this.wallColor = wallColor;

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

        console.log(this.frontierColor);
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
