(function(document, MazeGenerator, MazePainter, MazeInteraction) {
  'use strict';

  // DOM Elements
  var canvas = document.getElementById('maze');
  var bGenerate = document.getElementById('bGenerate');
  var bSolve = document.getElementById('bSolve');

  // Start painting loop
  MazePainter.startPainting();

  bGenerate.addEventListener('click', function() {

    // Initialize modules
    MazeGenerator.init(canvas.width, canvas.height, 20);
    MazePainter.init(canvas, 20, '#fff', '#f00', '#000', '#0f0', '#0f0', '#00f');
    MazeGenerator.generate();
    MazeGenerator.selectEntry();
    MazeGenerator.selectExit();

    MazeInteraction.init(canvas, 20, MazeGenerator.getMaze());
    MazeInteraction.startListeningUserEvents();
  });

  bSolve.addEventListener('click', function() {
    if (MazePainter.isMazePainted()) {
      MazeGenerator.solve();
    }
  });

}(document, MazeGenerator, MazePainter, MazeInteraction));
