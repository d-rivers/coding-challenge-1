const vorpal = require('vorpal');
const es = require('event-stream');

const Challenge = require('./lib/challenge');

const sf = new Challenge({
  vorpal,
  es,
});

sf.init();
