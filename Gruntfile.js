module.exports = function (grunt) {
  var requireConfig = function (optimize) {
    return {
      options: {
        baseUrl: '.',
        mainConfigFile: 'dependencies.js',
        name: 'js/proofer.js',
        out: 'build/stage/proofer.js',
        optimize: (optimize) ? 'uglify' : 'none'
      }
    };
  };

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
      prod: requireConfig(true),
      dev: requireConfig(false)
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

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-nw-builder');

  // Create targets
  grunt.registerTask('setup-prod', ['preprocess', 'requirejs:prod', 'cssmin', 'copy']);
  grunt.registerTask('setup-dev', ['preprocess', 'requirejs:dev', 'cssmin', 'copy']);

  grunt.registerTask('build-prod', ['clean', 'setup-prod', 'nwjs']);
  grunt.registerTask('build-dev', ['clean', 'setup-dev', 'nwjs']);

  grunt.registerTask('default', ['build-prod']);
};