const gulp = require('gulp');
require('../gulpfile');

function compileDist() {
    const taskInstance = gulp.task('compileLib');
    if (taskInstance === undefined) {
        console.error('no task named compileLib registered');
        return;
    }
    taskInstance.apply(gulp);
}

compileDist();