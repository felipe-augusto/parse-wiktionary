var fs = require('fs');

var file = fs.readFileSync('out.txt', 'utf8');

var pre_words = file.split("\n");

// length of the words file
words = [];

var words = pre_words.map(function (item) {
	try {
		item = JSON.parse(item);
		var obj = {};
		obj[item.word] = item;
		return obj;
	} catch (er) {

	}
	
})

//685000

console.log(words.length);