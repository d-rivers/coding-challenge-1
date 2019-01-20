const fs = require('fs');

const Helpers = Object.create({});

Helpers.readfile = (path, encoding) => new Promise((resolve, reject) => {
  fs.readFile(path, encoding, (error, contents) => {
    if (error) return reject(error);
    return resolve(contents);
  });
});

module.exports = Helpers;
