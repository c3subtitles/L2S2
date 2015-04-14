module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: ['tests/test_*.js'],
        port: 9876,
        colors: true,
        autoWatch: false,
        browsers: ['PhantomJS'],
        captureTimeout: 5000,
        singleRun: true,
        backgrount: true
    });
};
