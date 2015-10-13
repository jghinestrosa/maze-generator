var MazeInteraction = (function(MazeGenerator, MazePainter) {
  'user strict';

  var handlerMouseMove;

  var path = [];
  var joinedCells = [];

  var currentCell = null;

  // List of callbacks to call when the maze is solved
  var solutionCallbacks = [];

  function callSolutionCallbacks() {
    solutionCallbacks.forEach(function(callback) {
      callback();
    });
  }

  var mazeInteraction = {

    solution: [],

    init: function(canvas, cellSize, maze) {
      this.canvas = canvas;
      this.cellSize = cellSize;
      this.maze = maze;
      this.solution = [];
      currentCell = null;
      path = [];
      solutionCallbacks = [];
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
        if (MazeGenerator.areTheSameCell(cell, MazeGenerator.entry)) {
          currentCell = cell;
          path.push(cell);
          this.solution.push({cell: cell, clear: false});
        }

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
       
       if (MazeGenerator.areTheSameCell(currentCell, MazeGenerator.exit)) {
         this.solve();
       }

      }
    },

    listenMouseUpEvents: function() {
      this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    },

    handleMouseUp: function() {
      this.canvas.removeEventListener('mousemove', handlerMouseMove);
    },

    calculateCell: function(x, y) {
      var j = Math.floor(x / this.cellSize);
      var i = Math.floor(y / this.cellSize);
      return [i, j];
    },

    onSolved: function(callback) {
      solutionCallbacks.push(callback);
    },

    solve: function() {
      this.handleMouseUp();
      callSolutionCallbacks();
    }
  
  };

  return mazeInteraction;

}(MazeGenerator, MazePainter));
