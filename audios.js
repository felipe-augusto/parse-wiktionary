var fs = require('fs');

var file = fs.readFileSync('out.txt', 'utf8');

var words = file.split("\n");

var request = require('request').defaults({ encoding: null });;

function getAudio(url, cb) {
	request('https://commons.wikimedia.org/w/api.php?action=query&titles=File:' + url + '&prop=videoinfo&viprop=derivatives&format=json', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var data = JSON.parse(body);
	    for (key in data.query.pages) {
	    	try {
	    		var url = data.query.pages[key].videoinfo[0].derivatives[0].src;
	    	} catch (err) {
	    		return;
	    	}
	    	request(url, function (err, resp, audio) {
	    		data = "data:" + resp.headers["content-type"] + ";base64," + new Buffer(audio).toString('base64');
	        	cb(data);
	    	})
	    };
	  } else {
	  	console.log('erro');
	  }
	})
}


var count = 0;
var have_audio = words.map(function (item){
	try {
		item = JSON.parse(item);
	} catch (er) {

	}
	if (item.sound) {
		getAudio(item.sound, function (base) {
			item.sound = base;
			console.log(JSON.stringify(item));
		})
	} else {
		//console.log(JSON.stringify(item));
	};
})

// getAudio(JSON.parse(have_audio[500]).sound, function (base) {
// 	have_audio[500] = JSON.parse(have_audio[500]);
// 	have_audio[500].sound = base;
// 	console.log(have_audio[500]);
// });