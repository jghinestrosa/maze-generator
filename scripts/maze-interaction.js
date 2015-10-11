var MazeInteraction = (function(MazeGenerator, MazePainter) {
  'user strict';

  var handlerMouseMove;

  var path = [];
  var joinedCells = [];

  var currentCell = null;

  var mazeInteraction = {

    solution: [],

    init: function(canvas, cellSize, maze) {
      this.canvas = canvas;
      this.cellSize = cellSize;
      this.maze = maze;
    },

    startListeningUserEvents: function() {
      this.listenMouseDownEvents();
      this.listenMouseUpEvents();
    },

    listenMouseDownEvents: function() {
      this.canvas.addEventListener('mousedown', this.handleMouseDownEvents.bind(this));
    },

    handleMouseDownEvents: function(e) {
      var x = e.clientX - this.canvas.getBoundingClientRect().left;
      var y = e.clientY - this.canvas.getBoundingClientRect().top;
      this.calculateCell(x, y);
      this.listenMouseMoveEvents();
    },

    listenMouseMoveEvents: function() {
      handlerMouseMove = this.handleMouseMoveEvents.bind(this);
      this.canvas.addEventListener('mousemove', handlerMouseMove);
    },

    handleMouseMoveEvents: function(e) {
      var x = e.clientX - this.canvas.getBoundingClientRect().left;
      var y = e.clientY - this.canvas.getBoundingClientRect().top;
      var cell = this.calculateCell(x, y);

      if (currentCell === null) {
        currentCell = cell;
        path.push(cell);
        this.solution.push({cell: cell, clear: false});
        return;
      }

      if (!MazeGenerator.areTheSameCell(currentCell, cell)) {
       if (path.length > 1 && MazeGenerator.areTheSameCell(cell, path[path.length - 2])) {
         this.solution.push({cell: currentCell, clear: true});
         currentCell = cell;
         path.pop();
         return;
       }
      
       if (MazeGenerator.areCellsJoined(currentCell, cell)) {
         currentCell = cell;
         path.push(cell);
         this.solution.push({cell: cell, clear: false});
       }

      }
    },

    listenMouseUpEvents: function() {
      this.canvas.addEventListener('mouseup', function() {
        this.canvas.removeEventListener('mousemove', handlerMouseMove);
      }.bind(this));
    },

    calculateCell: function(x, y) {
      var j = Math.floor(x / this.cellSize);
      var i = Math.floor(y / this.cellSize);
      return [i, j];
    }
  
  };

  return mazeInteraction;

}(MazeGenerator, MazePainter));
