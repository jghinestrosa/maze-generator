(function(document, MazeGenerator, MazePainter, MazeInteraction) {
  'use strict';

  // DOM Elements
  var canvas = document.getElementById('maze');
  var bGenerate = document.getElementById('bGenerate');
  var bSolve = document.getElementById('bSolve');

  // Initialization variables
  var cellSize = 20;
  var cellColor = '#fff';
  var frontierColor = '#f00';
  var wallColor = '#000';
  var entryColor = '#0f0';
  var exitColor = '#0f0';
  var solutionColor = '#0f0';
  var userSolutionColor = '#00f';

  // Start painting loop
  MazePainter.startPainting();

  bGenerate.addEventListener('click', function() {

    // Initialize modules
    MazeGenerator.init(canvas.width, canvas.height, cellSize);
    MazePainter.init(canvas, cellSize, cellColor, frontierColor, wallColor, entryColor, exitColor, solutionColor, userSolutionColor);
    MazeGenerator.generate();
    MazeGenerator.selectEntry();
    MazeGenerator.selectExit();

    MazeInteraction.init(canvas, cellSize, MazeGenerator.getMaze());
    MazeInteraction.startListeningUserEvents();
  });

  bSolve.addEventListener('click', function() {
    if (MazePainter.isMazePainted()) {
      MazeGenerator.solve();
    }
  });

}(document, MazeGenerator, MazePainter, MazeInteraction));
