#parse_wiktionary

An attempt to parse wiktionary. Only working with the english version (en.wiktionary) right now. We want to parse some good stuff:

- word
- translations and part os speech (pos) - (only working in portuguese)
- sound
- definitions and examples (soon)

## How to make it work

First, go to this url `https://dumps.wikimedia.org/backup-index.html` and download some `enwiktionary` dump. It is something like: `enwiktionary-latest-pages-articles.xml.bz2`.

Extract the bz2 file: `bzip2 -d name-of-dump.xml.bz2`.

Know we can try to parse it doing: `node xmlToTxt.js` or `node xmlToTxt.js > out.txt` (to write the output in out.txt file)

## Suggestion

If you want to check the struct of the xml do: `bzip2 -dc name-of-dump.xml.bz2`
