var mkdirp = require('mkdirp'),
    readdirp = require('readdirp'),
    path = require('path'),
    current_directory = path.normalize(process.cwd());

// function: create structure
// --------------------------
// Reads through a directory, creates the necessary folders in public/, and
// feeds back a list of files that need to be compiled organized by extension

module.exports = function(custom_options, cb){

  // format negate pattern
  var ignores = []
  custom_options.ignore_files.forEach(function(pattern){
    ignores.push("!" + pattern.toString().replace(/\//g, ""))
  });

  readdirp({ root: path.join(current_directory, custom_options.folder), directoryFilter: ignores, fileFilter: ignores }, function(err, res){

    // create public (if not already made)
    mkdirp.sync(path.join(current_directory, 'public'));

    // create sub directories needed
    res.directories.forEach(function(dir){
      mkdirp.sync(path.join('public', dir.path));
    });

    // get and sort the files
    var files = {}
    res.files.forEach(function(file){ // loop through files in /assets
      custom_options.file_types.forEach(function(type){ // get files that match the project's file types
        if (file.path.match(new RegExp('\.' + type + '$'))){
          if (typeof files[type] === 'undefined') { files[type] = []; }
          files[type].push(file.path);
        }
      });
    });

    // hit the callback and pass the organized files object back
    cb(files);
  });
}