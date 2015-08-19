'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['dist']
    },

    copy: {
      dist: {
        files: [
          {expand: true, src: ['*.html', 'scripts/*', 'styles/*'], dest: 'dist/'}
        ]
      }
    },

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('build', ['clean:dist', 'copy:dist']);
  grunt.registerTask('deploy', ['gh-pages']);

};
