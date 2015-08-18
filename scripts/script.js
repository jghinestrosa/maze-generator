(function(document, MazeGenerator, MazePainter) {
  'use strict';

  // DOM Elements
  var canvas = document.getElementById('maze');
  var button = document.getElementById('bGenerate');

  // Start painting loop
  MazePainter.startPainting();

  button.addEventListener('click', function() {

    // Initialize modules
    MazeGenerator.init(canvas.width, canvas.height, 20);
    MazePainter.init(canvas, 20, '#fff', '#f00', '#000', '#0f0', '#0f0');
    MazeGenerator.generate();
    MazeGenerator.selectEntry();
    MazeGenerator.selectExit();
  });

}(document, MazeGenerator, MazePainter));
