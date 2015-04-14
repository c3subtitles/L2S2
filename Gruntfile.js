module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        stripBanners: {
          block: true
        },
        separator: ';',
        sourceMap: true
      },
      dist: {
        src: ['public/js/beamer.js', 'public/js/read.js', 'public/js/write.js'],
        dest: 'public/js/ls2s.min.js'
      }
    },
    jasmine: {
      src: 'tests/test_*.js',
      options: {
        specs: 'tests/specs/spec_*.js',
        vendor: ['jQuery'],
        styles: [''],
        version: '1.11.1',
        outfile: 'reports/SpecRunner.html'
      }
    },
    jshint: {
      all: ['public/js/*.js'],
      beforeconcat: ['<%= concat.dist.src %>'],
      afterconcat: ['<%= concat.dist.dest %>'],
      options: {
        jshintrc: true
      }
    },
    karma: {
      unit: {
        // c.f. https://karma-runner.github.io/0.12/config/files.html
        // e.g. https://github.com/karma-runner/grunt-karma/issues/33#issuecomment-24886609
        configFile: 'karma.conf.js'
      }
    },
    less: {
      options: {
        compress: true,
        strictImports: true,
        strictMath: true,
        strictUnits: true,
        sourceMap: true,
      },
      files: {
        'public/css/beamer.css': 'public/css/beamer.less',
        'public/css/read.css': 'public/css/read.less',
        'public/css/write.css': 'public/css/write.less',
      }
    },
    lesslint: {
      options: {
        csslint: {
          'known-properties': true
        },
        less: {
          paths: ['']
        }
      },
      src: ['public/css/*.less']
    },
    uglify: {
      options: {
        // c.f. http://jshint.com/docs/options/
        // e.g. https://gist.github.com/connor/1597131#file-jshintrc-js
        mangle: true,
        compress: true,
        beautify: true,
        preserveComments: 'some'
      },
      build: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'js/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-lesslint');

  // Default tasks
  grunt.registerTask('default', ['less', 'concat', 'uglify']);
  grunt.registerTask('lint', ['jshint', 'lesslint']);
  grunt.registerTask('test', ['karma:unit', 'jasmine']);
};
