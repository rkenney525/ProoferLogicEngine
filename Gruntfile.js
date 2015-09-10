module.exports = function (grunt) {
  // Config
  grunt.initConfig({
    clean: ['build'],
    preprocess: {
      aggregate: {
        src: 'proofer.html',
        dest: 'build/stage/proofer.html'
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: ".",
          mainConfigFile: "dependencies.js",
          name: "js/proofer.js",
          out: "build/stage/proofer.js"
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'build/stage/proofer.css': ['./css/**/*.css']
        }
      }
    },
    copy: {
      require: {
        flatten: true,
        src: 'js/libs/require.js/require.js',
        dest: 'build/stage/',
        expand: true
      }
    },
    nwjs: {
      options: {
        platforms: ['win'],
        buildDir: 'build',
        version: 'v0.12.0',
        winIco: 'img/proofer-ico-16.png'
      },
      src: ['./package.json', './build/stage/**/*']
    }
  });

  // TODO copy require.js
  // TODO create package.json

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-nw-builder');

  // Create targets
  grunt.registerTask('setup', ['preprocess', 'requirejs', 'cssmin', 'copy']);
  grunt.registerTask('build', ['nwjs']);
  grunt.registerTask('default', ['clean', 'setup', 'build']);
};