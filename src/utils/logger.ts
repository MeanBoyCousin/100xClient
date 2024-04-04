const logger = {
  failure: (msg: string) => console.error('\x1b[31m✖\x1b[0m', msg),
  message: (msg: string) => console.log('\x1b[33m→\x1b[0m', msg),
  success: (msg: string) => console.log('\x1b[32m✔\x1b[0m', msg),
}

export default logger
