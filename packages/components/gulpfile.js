const path = require("path");
const { Buffer } = require("buffer");
const fs = require("fs");
const through2 = require("through2");
const merge2 = require("merge2");
const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const gulpTS = require("gulp-typescript");
const gulpBabel = require("gulp-babel");
const file = require("gulp-file");
const less = require("gulp-less");
const replace = require("gulp-replace");
const del = require("del");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const tsConfig = require("./tsconfig.json");
const getBabelConfig = require("./config");

function getAllFiles(dir, type) {
  if (!fs.existsSync(dir)) return [];
  const data = fs.readdirSync(dir);
  return data.reduce((a, b) => {
    const _path = path.join(dir, b);
    const stat = fs.statSync(_path);
    if (stat.isFile()) {
      return a.concat([_path]);
    } else {
      return a.concat(getAllFiles(_path));
    }
  }, []).filter((item) => {
    if (!type) return true;
    return path.extname(item) === type;
  });
}

gulp.task("clean", function () {
  return del(["lib/**/*", "es/**/*"]);
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
    .pipe(through2.obj(
      function (chunk, env, cb) {
        let buffers = [];
        if (/src\/index\.ts/.test(chunk.path)) {
          const styleCode = `import "./style/index.js";\n`;
          const globalBuffer = Buffer.from(styleCode);
          buffers = [globalBuffer];
        }
        chunk.contents = Buffer.concat([...buffers, chunk.contents]);
        cb(null, chunk);
      }
    ))
    .pipe(
      gulpTS({
        ...tsConfig.compilerOptions,
        outDir: "es",
        rootDir: path.join(__dirname, "./src"),
      })
    );
  const jsStream = tsStream.js
    .pipe(gulpBabel(getBabelConfig({ modules: false })))
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
    .pipe(through2.obj(
      function (chunk, env, cb) {
        let buffers = [];
        if (/src\/index\.ts/.test(chunk.path)) {
          const styleCode = `import "./style/index.js";\n`;
          const globalBuffer = Buffer.from(styleCode);
          buffers = [globalBuffer];
        }
        chunk.contents = Buffer.concat([...buffers, chunk.contents]);
        cb(null, chunk);
      }
    ))
    .pipe(
      gulpTS({
        ...tsConfig.compilerOptions,
        outDir: path.join(__dirname, "lib"),
        rootDir: path.join(__dirname, "./src"),
      })
    );
  const jsStream = tsStream.js
    .pipe(gulpBabel(getBabelConfig({ modules: 'commonjs' })))
    .pipe(replace(/(import\s+)['"]([^'"]+)(\.less)['"]/g, "$1'$2.css'"))
    .pipe(replace(/(require\(['"])([^'"]+)(\.less)(['"]\))/g, "$1$2.css$4"))
    .pipe(gulp.dest("./"));
  const dtsStream = tsStream.dts
    .pipe(replace(/(import\s+)['"]([^'"]+)(\.less)['"]/g, "$1'$2.css'"))
    .pipe(gulp.dest("./"));
  return merge2([jsStream, dtsStream]);
});

gulp.task('compileTSXForDIST', function compileTSXForDIST() {
  const tsStream = gulp.src(['**/*.tsx', '**/*.ts', '!**/node_modules/**/*.*', '!__tests__/**/*.*'])
    .pipe(gulpTS({
      ...tsConfig.compilerOptions,
      outDir: 'dist',
      rootDir: path.join(__dirname, './src')
    }));
  const jsStream = tsStream.js
    .pipe(gulpBabel(getBabelConfig({ commonjs: 'umd' })))
    .pipe(replace(/(import\s+)['"]([^'"]+)(\.less)['"]/g, ''))
    .pipe(replace(/(require\(['"])([^'"]+)(\.less)(['"]\))/g, ''))
    .pipe(concat('horadrim.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
  return jsStream;
})

gulp.task("compileLess", function compileLess() {
  return gulp
    .src("src/style/index.less") // 指定入口文件
    .pipe(less()) // 编译 Less 文件
    .pipe(cleanCSS({ level: 2 })) // 压缩并去重 CSS
    .pipe(concat("horadrim.mini.css")) // 合并为单个文件
    .pipe(gulp.dest("dist")); // 输出到 dist 目录
});


gulp.task("compileLib",
  gulp.series([
    'clean',
    gulp.parallel("compileTSXForCJS", "compileTSXForESM"),
    gulp.parallel('moveSassToESM', 'moveSassToCJS'),
    gulp.parallel('createComponentSassToESM', 'createComponentSassToCJS')
  ])
);

