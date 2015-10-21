(function(document, MazeGenerator, MazePainter, MazeInteraction) {
  'use strict';

  // DOM Elements
  var canvasMaze = document.getElementById('maze');
  var canvasSolution = document.getElementById('mouse-handler');
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
    MazeGenerator.init(canvasMaze.width, canvasMaze.height, cellSize);
    MazeGenerator.generate();

    MazeGenerator.onSolved(function() {
      MazeInteraction.stopListeningUserEvents();
    });

    MazeInteraction.init(canvasSolution, cellSize, MazeGenerator.getMaze());
    MazeInteraction.onSolved(function() {

      MazeInteraction.stopListeningUserEvents();

      // TODO: Temporary callback
      alert('Solved!');
    });

    MazePainter.init(canvasMaze, canvasSolution, cellSize, cellColor, frontierColor, wallColor, entryColor, exitColor, solutionColor, userSolutionColor);

    MazePainter.onMazePainted(function() {
      MazeGenerator.selectEntry();
      MazeGenerator.selectExit();
      MazeInteraction.startListeningUserEvents();
    });

  });

  bSolve.addEventListener('click', function() {
    if (MazePainter.isMazePainted()) {
      MazeGenerator.solve();
    }
  });

}(document, MazeGenerator, MazePainter, MazeInteraction));
