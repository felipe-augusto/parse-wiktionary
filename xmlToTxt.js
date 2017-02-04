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
  '===Article===': -1,
  '===Suffix===': -1,
  '===Initialism===': -1,
  '===Proverb===': -1,
  '===Number===': -1,
  '===Abbreviation===' : -1,
  '===Prefix===': -1,
  '===Prepositional phrase===': -1
}

function getMatches(string, regex, index, title) {
  index || (index = 1); // default to the first capturing group
  var matches = {
    word: title.toLowerCase(),
    translations: {}
  };
  var match;
  var finaz = '';
  var tmp = 10000000;
  // this shows some words that fails to find translations
  // if(!regex.exec(string)) {
  //     console.log(title);
  // }
  while (match = regex.exec(string)) {
    tmp = 10000000;
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
// new regex -> (t|t\+)\|pt\|(.*?)(\||\})
// old -> /\|pt\|(.*?)(\||\})/g
var trans_exp = /t\+\|pt\|(.*?)(\||\})/g;

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

		}

		if(word !== undefined && Object.keys(word.translations).length > 0) {
      console.log(JSON.stringify(word));
    }
	};

});

function checkEmptyKeys(word) {
  if(word && Object.keys(word.translations).length) {
    if(word.translations['']) {
      console.log(word);
    }
  }
}

function doTest (word) {
  var test_array = [
  'me',
  'for',
  'know',
  'time',
  'game',
  'know',
  'data',
  'time',
  'an',
  'library',
  'the',
  'change',
  'as',
  'jesus',
  'november'
  ]

  if(word && test_array.includes(word.word)) {
    console.log(JSON.stringify(word)); 
  } 
}


// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        // NOTE: === provides the correct "SameValueZero" comparison needed here.
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}