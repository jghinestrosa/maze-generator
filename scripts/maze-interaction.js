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

      if (currentCell === null || !(currentCell[0] === cell[0] && currentCell[1] === cell[1]) && MazeGenerator.areCellsJoined(currentCell, cell)) {
        console.log('a');
        currentCell = cell;
        this.solution.push(cell);
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
