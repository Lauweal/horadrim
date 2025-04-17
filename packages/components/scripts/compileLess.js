const gulp = require('gulp');
require('../gulpfile');

function compileDist() {
    const taskInstance = gulp.task('compileLess');
    if (taskInstance === undefined) {
        console.error('no task named compileLib registered');
        return;
    }
    taskInstance.apply(gulp);
}

compileDist();