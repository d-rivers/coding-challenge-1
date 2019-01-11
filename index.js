const vorpal = require('vorpal')();

const action = (command, callback) => {
  vorpal.activeCommand.log(command);
  callback();
};

vorpal
  .mode('navigation')
  .description('Enter the user into navigation mode.')
  .delimiter('navigation:')
  .action(action);

vorpal
  .delimiter('StratumFive$')
  .show();
