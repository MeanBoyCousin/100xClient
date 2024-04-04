const logger = {
  failure: (msg: string) => console.error(`❗ `, msg),
  message: (msg: string) => console.log(`\x1b[33m⟶\x1b[0m  `, msg),
  success: (msg: string) => console.log(`✨ `, msg),
  waiting: (msg: string) => console.log(`⌛ `, msg),
}

export default logger
