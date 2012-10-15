
// duster.js  
// Watch directory of dust.js templates and automatically compile them
// by Dan McGrady http://dmix.ca

var src_path = "./static/items/"; // directory of dust templates are stored with .dust file extension
var public_path = "./static/items/"; // directory where the compiled .js files should be saved to

var fs = require('fs');                                                                        
var dust = require('dustjs-linkedin');
// var watcher = require('watch-tree').watchTree(src_path, {'sample-rate': 30}); // polls folder every 30ms

console.log('got here');

//watcher.on('fileModified', function(path, stats) {
console.log('and here');
path = "./static/items/itemView.dust";
  fs.readFile(path, 'ascii', function (err, data) {
    if (err) throw err;
	
	console.log('read ' + path);
	
    var filename = path.split("/").reverse()[0].replace(".dust","");
    var filepath = public_path + filename + ".js";
    var compiled = dust.compile(data, filename);

    fs.writeFile(filepath, compiled, function (err) {
      if (err) throw err;
      console.log('Saved ' + filepath);
    });
  });
// });