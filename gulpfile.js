/**
 * Gulp Packages
 */

// General
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    runSequence = require('run-sequence');

//css
gulp.task("sass", function() {
    return gulp.src("src/sass/**/**.scss")
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .on('error', function(err) {
            console.error('Error!', err.message); // 显示错误信息
        })
        .pipe($.csso())
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest('src/css'))
        .pipe(reload({ stream: true }));
});
gulp.task("sass:theme", function() {
    return gulp.src("src/sass/themes/**/**.scss")
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .on('error', function(err) {
            console.error('Error!', err.message); // 显示错误信息
        })
        .pipe($.csso())
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest('src/css'))
        .pipe(reload({ stream: true }));
});

gulp.task("nxindex", function() {
    return gulp.src("src/sass/pages/nx-index.scss")
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.autoprefix( {browsers: ['last 2 versions'],  cascade: false}))
        .pipe($.sass())
        .on('error', function(err) {
            console.error('Error!', err.message); // 显示错误信息
        })
        .pipe($.csso())
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest('src/css/pages'))
        .pipe(reload({ stream: true }));
});
gulp.task("nxindexw", function() {
    return gulp.watch('src/sass/**/**.scss', ['nxindex']);
});

// //html
// gulp.task('html', function() {
//     return gulp.src('src/**/*.html') // 指明源文件路径、并进行文件匹配
//         .pipe('dist'); // 输出路径
// });

gulp.task("pack",["pack:list:css" ,"pack:list:js","pack:list:images","pack:list:html","pack:list:font"]);
gulp.task("pack:list:css",function(){

    return gulp.src("src/css/**/**.css")
        .pipe($.plumber()) 
        .pipe($.csso())
        .pipe(gulp.dest('dist/css'));
}); 

gulp.task("pack:list:js",["pack:list:js:debug"],function(){

    return gulp.src(["src/js/**/**","!src/js/bomc.js"])
        .pipe($.plumber()) 
        .pipe(gulp.dest('dist/js'))  ;
});

gulp.task("pack:list:js:debug",function(){

    return gulp.src("src/js/bomc.js")
        .pipe($.plumber()) 
        .pipe($.stripDebug()) 
        .pipe(gulp.dest('dist/js'))  ;
});

gulp.task("pack:list:images",function(){

    return gulp.src(["src/images/**/**","!src/images/index/**/**"]) 
        .pipe(gulp.dest('dist/images'));
});
 
gulp.task("pack:list:font",function(){

    return gulp.src("src/images/font/**/**") 
        .pipe(gulp.dest('dist/images/font'));
});
gulp.task("pack:list:html",function(){ 
    return gulp.src("src/html/**/**.html") 
        .pipe(gulp.dest('dist/html'));
});
gulp.task('dist:clean', function () {
  return gulp.src('dist/*') 
    .pipe(gulp.dest('dist'))
    .pipe(vinylPaths(del));
});


var configs = {
  //修改图片位置
  spritesSource: './src/images/zy/zy/*.*',
  spritesMithConfig: {
    //由于图片最终是要放到七牛上，这里的cssOpts用来当成最终scss文件中的变量名，详情看scss.template.mustache
    cssOpts: 'spriteSrc',

    imgName: 'zysprite.png',
      cssName: '_zysprite.scss',
      cssFormat: 'scss', 
      algorithm: 'binary-tree',
      padding: 8,
      cssVarMap: function(sprite) {
        sprite.name = 'i-' + sprite.name
      }
  },
  spritesOutputPath: 'src/images/zy'
}

//总命令
gulp.task('sprite', function(callback) {
  runSequence(
    'sprite:build', 
    
    callback
  )
});
//创建精灵图
gulp.task('sprite:build', function() {
  var spriteData = gulp.src(configs.spritesSource) // source path of the sprite images
        .pipe($.spritesmith(
            configs.spritesMithConfig
        ));
    spriteData.img.pipe(gulp.dest(configs.spritesOutputPath)); // output path for the sprite
    spriteData.css.pipe(gulp.dest(configs.spritesOutputPath)); // output path for the CSS
})
 



//服务器 
gulp.task('serve', ['sass','pack'],function() {
    browserSync.init({
        port: 9999,
        server: {
            baseDir: './'
        }
    });  
    //   browserSync.reload
    gulp.watch('src/sass/**/**.scss', ['sass','pack:list:css',browserSync.reload]);
    gulp.watch("src/html/**/**.html",['pack:list:html',browserSync.reload]);
    gulp.watch("src/js//**/**", ['pack:list:js',browserSync.reload]);
    gulp.watch("src/images/**/**", ['pack:list:images',browserSync.reload]);
});
