var gulp = require('gulp');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var spawn = require('child_process').spawn;
var kill = require('tree-kill');
var sass = require('gulp-sass');


/**
 * Will look for .scss|sass files inside the node_modules folder
 */

 var sassAliases = {};

function npmModule(url, file, done) {
  // check if the path was already found and cached
  if(sassAliases[url]) {
    return done({ file:sassAliases[url] });
  }

  // get module name
  var modName =ulr.split('/')[0];

  // look for modules installed through npm
  try {
    var newPath = path.relative('./css', require.resolve(modName));
    sassAliases[url] = newPath; // cache this request
    return done({ file:newPath });
  } catch(e) {
    // if your module could not be found, just return the original url
    sassAliases[url] = url;
    return done({ file:url });
  }
}


gulp.task('fonts',function() {
  return gulp.src('node_modules/materialize-css/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});



gulp.task('materialize-js',function() {
  return gulp.src('node_modules/materialize-css/bin/*.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', ['fonts','materialize-js'], function () {
  return gulp.src('public/sass/common.scss',{cwd: __dirname + '/src/'})
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});


/**
 *  Build admin application
 */

gulp.task('build-admin',['sass'], function () {
  var target = gulp.src('./src/admin/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['public/**/*.js', 'public/**/*.css', 'admin/**/*.js', 'admin/**/*.css'], {read: false, cwd: __dirname + '/src/'});

  var css = gulp.src(['css/**/*.css'], {read: false, cwd: __dirname + '/dist/'});
  var js = gulp.src(['js/**/*.js'], {read: false, cwd: __dirname + '/dist/'});
 
  return target
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
    .pipe(inject(sources))
    .pipe(inject(js, {name: 'ext-js'}))
    .pipe(inject(css))
    .pipe(gulp.dest('./dist/admin'));
});
 
gulp.task('build-public',['sass'], function () {
  var target = gulp.src('./src/public/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['public/**/*.js', 'public/**/*.css'], {read: false, cwd: __dirname + '/src/'});

  var css = gulp.src(['css/**/*.css'], {read: false, cwd: __dirname + '/dist/'});
  var js = gulp.src(['js/**/*.js'], {read: false, cwd: __dirname + '/dist/'});
 
  return target
  	.pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower'}))
  	.pipe(inject(sources))
    .pipe(inject(js, {name: 'ext-js'}))
    .pipe(inject(css))
    .pipe(gulp.dest('./dist'));
});


gulp.task('build', ['build-public','build-admin'] , function() {

});



function launchServer(cb, startCb) {
	var cp = spawn('npm', ['start'] ) ;
  cp.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);

    // if output contains started string, then call startCb
    if (startCb && data.indexOf('Server started') >= 0) {
      startCb(cp);
    }
  });
  cp.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  cp.on('close', (code) => {
    console.log(`npm start exited with code ${code}`);
    if(code === null || code === 0) {
      cb();
    } else {
      cb(`npm start exited with code ${code}`);
    }
  });

  return cp;

}

gulp.task('serve',['build'], function(cb) {

  var child = {};
  child.process = launchServer(cb);

	gulp.watch('./src/public/**/*',['build']);

	gulp.watch('./src/app/**/*',function() {
		child.process.kill('SIGTERM');
		// child.process.on('exit',function() {
	  // child.process = launchServer(cb);	
		// });
 			
	})

});


// test the api
gulp.task('test.api', function(cb) {

  var cucumber = require('gulp-cucumber');
  
  // launch the server and wait for it to statrt before launching tests
  launchServer(cb, function(server) {
      gulp.src('test/app/e2e/features/**/*.feature')
        .pipe(cucumber({
        'steps': 'test/app/e2e/steps/**/*.js',
        'format': 'summary'
        }))
        .on('error', function(error) {
          console.log('!!!!!Error ' + error);
          console.log('Error: stopping server ' + server.pid);
          kill(server.pid, 'SIGTERM', ( err ) => {
            throw error;  
          });
          
        })
        .once('end', function(status) {
          console.log('End : stopping server');
          kill(server.pid, 'SIGTERM', ( err ) => {
            process.exit();  
          });
        });
    });
  });


