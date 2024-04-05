import { PluginKind, declareValuePlugin } from '@stryker-mutator/api/plugin'

export const strykerPlugins = [
  declareValuePlugin(PluginKind.Ignore, 'logger', {
    shouldIgnore(path) {
      if (path.isExpressionStatement()) {
        if (
          path.node.expression.type === 'AssignmentExpression' &&
          path.node.expression.right.callee &&
          path.node.expression.right.callee.name === 'logger'
        ) {
          return "We're not interested in testing the implementation of the pino logger library."
        }

        if (
          path.node.expression.type === 'AwaitExpression' &&
          path.node.expression.argument.callee.property?.id &&
          path.node.expression.argument.callee.property.id.name === 'waitForTransaction'
        ) {
          return "We're not interested in testing the implementation of the logger in the #waitForTransaction method."
        }

        if (
          path.node.expression.callee?.object &&
          path.node.expression.callee.object.property &&
          path.node.expression.callee.object.property.type === 'PrivateName' &&
          path.node.expression.callee.object.property.id.name === 'logger'
        ) {
          return "We're not interested in testing the implementation of the pino logger library."
        }
      }
    },
  }),
]
