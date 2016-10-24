var fs = require('fs');
var jsonfile = require('jsonfile');

function wikiToJson() {
	var file = 'wiki.json'

	var array = fs.readFileSync('out.txt').toString().split("\n");

	var tmp = [];

	for (var i =0; i < array.length; i++) {
		tmp.push({'word': array[i]});
	}

	jsonfile.writeFile(file, tmp, function (err) {
	  console.error(err)
	});
}

wikiToJson();
