import { PluginKind, declareValuePlugin } from '@stryker-mutator/api/plugin'

export const strykerPlugins = [
  declareValuePlugin(PluginKind.Ignore, 'logger', {
    shouldIgnore(path) {
      if (
        path.isExpressionStatement() &&
        path.node.expression.type === 'AwaitExpression' &&
        path.node.expression.argument.callee.property?.id &&
        path.node.expression.argument.callee.property.id.name === 'waitForTransaction'
      ) {
        return "We're not interested in testing the implementation of the logger.waiting utility in the #waitForTransaction method."
      }

      if (
        path.isExpressionStatement() &&
        path.node.expression.type === 'CallExpression' &&
        path.node.expression.callee.type === 'MemberExpression' &&
        path.node.expression.callee.object.type === 'Identifier' &&
        path.node.expression.callee.object.name === 'logger'
      ) {
        return "We're not interested in testing the implementation of the logger utility."
      }
    },
  }),
]
