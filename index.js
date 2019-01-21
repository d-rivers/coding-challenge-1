const vorpal = require('vorpal')();
const Challenge = require('./lib/challenge');

const sf = new Challenge({ vorpal });

sf.init();
