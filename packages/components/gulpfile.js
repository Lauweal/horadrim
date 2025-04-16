const path = require("path");
const { Buffer } = require("buffer");
const fs = require("fs");
const through2 = require("through2");
const merge2 = require("merge2");
const gulp = require("gulp");
const gulpTS = require("gulp-typescript");
const gulpBabel = require("gulp-babel");
const file = require("gulp-file");
const sass = require("gulp-sass")(require("sass"));
const replace = require("gulp-replace");
const del = require("del");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const tsConfig = require("./tsconfig.json");
const getBabelConfig = require("./babelfile");

function getAllFiles(dir, type) {
  if (!fs.existsSync(dir)) return [];
  const data = fs.readdirSync(dir);
  return data.reduce((a, b) => {
      const _path = path.join(dir, b);
      const stat = fs.statSync(_path);
      if(stat.isFile()) {
          return a.concat([_path]);
      } else {
          return a.concat(getAllFiles(_path));
      }
  }, []).filter((item) => {
      if(!type) return true;
      return path.extname(item) === type;
  });
}

gulp.task("clean", function () {
  return del(["dist/**/*", "lib/**/*", "es/**/*"]);
});

gulp.task("moveSassToESM", function moveSassFile() {
  return gulp.src(['src/**/*.less'])
    .pipe(gulp.dest('es'));
})

gulp.task('createComponentSassToESM', function createComponentSassToESM() {
  const targetDir = path.join(__dirname, "es");
  const files = getAllFiles(targetDir, ".less");
  return files.map((filepath) => {
    const filename = path.basename(filepath);
    const current = filepath.replace(`/${filename}`, "");
    const filepaths = getAllFiles(current, '.less');
    const code = filepaths.map((item) => path.basename(item)).reduce((a, b) => {
      return a + `import './${b}';\n`;
    }, '');
    return gulp.src(filepath, { read: false })
    .pipe(file('index.js', code))
    .pipe(gulp.dest(current));
  })
});

gulp.task("moveSassToCJS", function moveSassFile() {
  return gulp.src(['src/**/*.less'])
    .pipe(gulp.dest('lib'));
})

gulp.task('createComponentSassToCJS', function createComponentSassToESM() {
  const targetDir = path.join(__dirname, "lib");
  const files = getAllFiles(targetDir, ".less");
  return files.map((filepath) => {
    const filename = path.basename(filepath);
    const current = filepath.replace(`/${filename}`, "");
    const filepaths = getAllFiles(current, '.less');
    const code = filepaths.map((item) => path.basename(item)).reduce((a, b) => {
      return a + `require('./${b}');\n`;
    }, '');
    return gulp.src(filepath, { read: false })
    .pipe(file('index.js', code))
    .pipe(gulp.dest(current));
  })
});


gulp.task("compileTSXForESM", function compileTSXForESM() {
  const tsStream = gulp
    .src([
      "**/*.tsx",
      "**/*.ts",
      "!**/node_modules/**/*.*",
      "!__tests__/**/*.*",
    ])
    .pipe(
      through2.obj(function (chunk, env, cb) {
        let buffers = [];
        if (/index\.(ts|tsx)$/.test(chunk.path)) {
          const styleVarStr = `import "./style/index.js";\n`;
          const styleBuffer = Buffer.from(styleVarStr);
          buffers = [styleBuffer];
        }
        chunk.contents = Buffer.concat([...buffers, chunk.contents]);
        cb(null, chunk);
      })
    )
    .pipe(
      gulpTS({
        ...tsConfig.compilerOptions,
        outDir: "es",
        rootDir: path.join(__dirname, "./src"),
      })
    );
  const jsStream = tsStream.js
    .pipe(gulpBabel(getBabelConfig({ isESM: true })))
    .pipe(replace(/(import\s+)['"]([^'"]+)(\.less)['"]/g, "$1'$2.css'"))
    .pipe(replace(/(require\(['"])([^'"]+)(\.less)(['"]\))/g, "$1$2.css$4"))
    .pipe(gulp.dest("./"));
  const dtsStream = tsStream.dts
    .pipe(replace(/(import\s+)['"]([^'"]+)(\.less)['"]/g, "$1'$2.css'"))
    .pipe(gulp.dest("./"));
  return merge2([jsStream, dtsStream]);
});

gulp.task("compileTSXForCJS", function compileTSXForCJS() {
  const tsStream = gulp
    .src([
      "**/*.tsx",
      "**/*.ts",
      "!**/node_modules/**/*.*",
      "!__tests__/**/*.*",
    ])
    .pipe(
      through2.obj(function (chunk, env, cb) {
        let buffers = [];
        if (/src\/index\.ts/.test(chunk.path)) {
          const styleVarStr = `import "./style/index.js";\n`;
          const styleBuffer = Buffer.from(styleVarStr);
          buffers = [styleBuffer];
        }
        chunk.contents = Buffer.concat([...buffers, chunk.contents]);
        cb(null, chunk);
      })
    )
    .pipe(
      gulpTS({
        ...tsConfig.compilerOptions,
        outDir: path.join(__dirname, "lib"),
        rootDir: path.join(__dirname, "./src"),
      })
    );
  const jsStream = tsStream.js
    .pipe(gulpBabel(getBabelConfig({ isESM: false })))
    .pipe(replace(/(import\s+)['"]([^'"]+)(\.less)['"]/g, "$1'$2.css'"))
    .pipe(replace(/(require\(['"])([^'"]+)(\.less)(['"]\))/g, "$1$2.css$4"))
    .pipe(gulp.dest("./"));
  const dtsStream = tsStream.dts
    .pipe(replace(/(import\s+)['"]([^'"]+)(\.less)['"]/g, "$1'$2.css'"))
    .pipe(gulp.dest("./"));
  return merge2([jsStream, dtsStream]);
});


gulp.task("compileLib", 
  gulp.series([
    'clean',
    gulp.parallel("compileTSXForCJS", "compileTSXForESM"), 
    gulp.parallel('moveSassToESM', 'moveSassToCJS'),
    gulp.parallel('createComponentSassToESM', 'createComponentSassToCJS')
  ])
);