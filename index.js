const vorpal = require('vorpal')();
const StratumFive = require('./lib/stratum-five');

const sf = new StratumFive({ vorpal });

sf.init();
