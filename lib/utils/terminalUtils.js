
/**
 * close service with terminal console
 * @param  {string} msg
 */
// export const closeService = (msg) => {
//   throw new Error(`Failed to execute : ${msg}`)
//   // process.on('exit', code => {
//   //   if (code === 0) console.log(`Failed to execute : ${msg} | process exited with code ${code}`)
//   // })
//   // process.exit(0)
// }

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
"use strict";