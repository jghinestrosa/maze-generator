var MazeInteraction = (function(MazeGenerator, MazePainter) {
  'user strict';

  var mazeInteraction = {
    init: function(canvas, cellSize, maze) {
      this.canvas = canvas;
      this.cellSize = cellSize;
      this.maze = maze;
    },

    listenClickEvents: function() {
      this.canvas.addEventListener('click', function(e) {
        console.log(e);
        var x = e.clientX - this.canvas.getBoundingClientRect().left;
        var y = e.clientY - this.canvas.getBoundingClientRect().top;

        this.calculateCell(x, y);
      }.bind(this));
    },

    calculateCell: function(x, y) {
      console.log(Math.floor(x / this.cellSize));
      console.log(Math.floor(y / this.cellSize));
    }
  
  };

  return mazeInteraction;

}(MazeGenerator, MazePainter));
