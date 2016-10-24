var fs        = require('fs');
var XmlStream = require('xml-stream');

var stream = fs.createReadStream('wiki.xml');
var xml = new XmlStream(stream);

// returns a unique array
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

var possibles = {
  '===Noun===': -1,
  '===Verb===': -1,
  '===Adverb===': -1,
  '===Adjective===': -1,
  '===Preposition===': -1,
  '===Numeral===': -1,
  '===Proper noun===': -1,
  '===Pronoun===': -1,
  '===Particle===': -1,
  '===Interjection===': -1,
  '===Determiner===': -1,
  '===Phrase===': -1,
  '===Contraction===': -1,
  '===Conjunction===': -1,
  '===Article===': -1
}

function getMatches(string, regex, index, title) {
  index || (index = 1); // default to the first capturing group
  var matches = {
    word: title.toLowerCase(),
    translations: {}
  };
  var match;
  var finaz = '';
  var tmp = 100000;
  // this shows some words that fails to find translations
  // if(!regex.exec(string)) {
  //     console.log(title);
  // }
  while (match = regex.exec(string)) {

    for (key in possibles) {
      var pos = match.input.indexOf(key);
      if (pos == -1) {
      } else {
        // existe um tipo de traducao

        var diff = match.index - pos;

        if(diff > 0 && diff < tmp) {
          tmp = diff;
          finaz = key;
        }
      }
    }

    var pos = finaz.replace('===', '').replace('===', '').toLowerCase();
    if(matches.translations[pos]) {
      pushe = match[1].replace(/(\[\[|\]\])/g, '');
      matches.translations[pos].push(pushe);
      matches.translations[pos] = uniq(matches.translations[pos]);
    } else {
      pushe = match[1].replace(/(\[\[|\]\])/g, '');
      matches.translations[pos] = [pushe];
    };

  }
  //console.log(matches.word);
  return matches;
}

// check if there are portuguese translations of the word
var trans_exp = /\|pt\|(.*?)(\||\})/g;

// check if the word has audio
var audio_exp = /\{\{audio\|(.*?-us-.*?)\|Audio \(US\)/g;

var count = 0;

xml.on('endElement: page', function(item) {
	var str = item['revision']['text']['$text'];
	if (str != null && str.indexOf('==English==') != -1) {
		if (item['title'].indexOf(":") == -1) {
			//console.log(item['title']);
			var word = getMatches(str, trans_exp, 1, item['title']);
			var match = audio_exp.exec(str);
			try {
				var len = match[1].split("|");	
				var audios = len.filter(function (item) {
					return item.indexOf('-us-') >= 0;
				})
				if (audios.length > 1) {
					sound = audios[1];
				} else if (audios.length == 1) {
					sound= audios[0];
				}
				
				word.sound = sound;
			} catch (err) {
				word.sound = null;
			}
			console.log(JSON.stringify(word));
		}
		
	};

});
