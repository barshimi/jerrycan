'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeService = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * close service with terminal console
 * @param  {string} msg
 */
const closeService = exports.closeService = msg => {
  _child_process2.default.on('exit', code => {
    if (code === 0) console.log(`Failed to execute : ${msg} | process exited with code ${code}`);
  });
  _child_process2.default.exit(0);
};

// export const spawnCmd = (cmd) => {
//   const spawnCmd = process.spawn(cmd, {shell: true})
//   // handle process error
//   spawnCmd.stderr.on('error', data => {
//     console.error(`Failed to execute : ${cmd}`)
//     process.exit(0)
//   })
//   // on handler success close process
//   spawnCmd.stdout.on('data', data => process.exit(1))
//   // on process exited, console command executation
//   spawnCmd.on('exit', code => {
//     const printMsg = `${code !== 0 ? 'Succeded' : 'Failed'} to execute : ${cmd} | process exited with code ${code}`
//     code !== 0 ? console.log(printMsg) : console.error(printMsg)
//   })
// }