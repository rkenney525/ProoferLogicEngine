module.exports = function (grunt) {
    // Config
    grunt.initConfig({
        requirejs: {
            compile: {
                options: {
                    baseUrl: ".",
                    mainConfigFile: "dependencies.js",
                    name: "js/init.js",
                    out: "build/proofer.js"
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'build/proofer.css': ['./css/**/*.css']
                }
            }
        },
        nwjs: {
            options: {
                platforms: ['win'],
                buildDir: 'build',
                version: 'v0.12.0'
            },
            //winIco: "TODO.png"
            src: ['./package.json', './proofer.html', './build/**/*']
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-nw-builder');

    // Create targets
    grunt.registerTask('minimize', ['requirejs', 'cssmin']);
    grunt.registerTask('build', ['nwjs']);
    grunt.registerTask('default', ['minimize', 'build']);
};