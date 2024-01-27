var asciidoctor = require('asciidoctor.js')();
require('asciidoctor-docbook.js')();
const uuidv4 = require('uuid/v4');
let select = require('xpath.js')
  , dom = require('xmldom').DOMParser;
const fs = require('fs');

//parse the adoc to xml
const parse = () => {
  const options = {
    attributes: { backend: 'docbook5', doctype: 'article' },
    standalone: true
  };
  var docbook = asciidoctor.convertFile('journal.adoc', options)
}

const clearEntries = () => {
  const options = { fileMustExist: true };
  const db = require('better-sqlite3')('journal.db', options);

  const clear = db
    .prepare('delete from time_entry;')
    .run();
}
const insertEntries = (entry) => {
  const options = { fileMustExist: true };
  const db = require('better-sqlite3')('journal.db', options);

  const insert = db
    .prepare('insert into time_entry (id, start_time, end_time) values (@id, @start_time, @end_time)')
    .run(entry);
}

//read the xml into an array of entry objects
const parseXml = () => {
  //hack: reading whole file syncronously into memory isn't optimal, but probably fine for a bit
  const xml = fs.readFileSync('journal.xml').toString();
  const doc = new dom({ localtor: {} }).parseFromString(xml)
  const nodes = select(doc, "//*[local-name(.)='term' and namespace-uri(.)='http://docbook.org/ns/docbook']")
  for (let i = 0; i < nodes.length; i++) {
    const timeEntryText = nodes[i].firstChild.data;
    const times = timeEntryText.split(' to ');
    const entry = {
      id: uuidv4(),
      start_time: times[0].trim(),
      end_time: times[1].trim(),
      journal: 'adoc text'
    };
    insertEntries(entry)
  }
}

parse();
clearEntries();
parseXml();
