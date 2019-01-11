const Navigation = class Navigation {
  constructor() {
    const t = this;

    t.line = 0;
  }

  validate(input) {
    const t = this;

    return new Promise((resolve, reject) => {
      if (t.line === 0) {
        console.info('validate input for ship position', input);
      } else {
        console.info('validate input for ship instruction', input);
      }

      /*if (error) {
        return reject(new Error());
      }*/

      return resolve({
        valid: true,
      });
    });
  }

  toggle() {
    const t = this;

    if (t.line === 0) {
      t.line = 1;
    } else {
      t.line = 0;
    }
  }

  positioning() {
    return new Promise((resolve, reject) => {
      resolve('positioned');
    });
  }

  instructions() {
    return new Promise((resolve, reject) => {
      resolve('instructed');
    });
  }
};

module.exports = Navigation;
