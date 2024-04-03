import { relative } from 'path'

const buildEslintCommand = filenames => {
  return `yarn lint --file ${filenames
    .map(filename => relative(process.cwd(), filename))
    .join(' --file ')} --fix`
}

export default {
  '**/*.{ts,tsx}': ['prettier --write', buildEslintCommand],
  '*.md': 'markdownlint -fix',
}
