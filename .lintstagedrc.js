import { relative } from 'path'

const buildEslintCommand = filenames => {
  console.log(
    `yarn lint ${filenames.map(filename => relative(process.cwd(), filename)).join(' ')} --fix`,
  )
  return `yarn lint ${filenames.map(filename => relative(process.cwd(), filename)).join(' ')} --fix`
}

export default {
  '**/*.{ts,tsx}': ['prettier --write', buildEslintCommand],
  '*.md': 'markdownlint -fix',
}
