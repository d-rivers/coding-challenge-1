const fs = require('fs');

const Helpers = Object.create({});

Helpers.readstream = path => fs.createReadStream(path);

module.exports = Helpers;
