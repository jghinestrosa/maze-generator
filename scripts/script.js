(function(document, MazeGenerator, MazePainter) {
  'use strict';

  // DOM Elements
  var canvas = document.getElementById('maze');
  var button = document.getElementById('bGenerate');

  // Get callback for painting
  var callback = MazePainter.paint.bind(MazePainter);

  button.addEventListener('click', function() {

    // Initialize modules
    MazeGenerator.init(canvas.width, canvas.height, 20);
    MazePainter.init(canvas, '#fff', '#f00', '#000');
    MazePainter.startPainting();
    MazeGenerator.generate();
  });

}(document, MazeGenerator, MazePainter));
