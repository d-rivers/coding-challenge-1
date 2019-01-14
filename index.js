const StratumFive = require('./lib/stratum-five');

const sf = new StratumFive({ grid: { boundaries: [50, 50] } });

sf.init();
