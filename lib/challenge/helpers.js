const fs = require('fs');

const Helpers = Object.create({});

Helpers.readstream = path => fs.createReadStream(path);
Helpers.writestream = path => fs.createWriteStream(path);

module.exports = Helpers;
