import Visitor from './visitor';
import { name } from '../package.json';

function creator(options) {
  return {
    postcssPlugin: name,
    Once: (root, { result }) => {
      const visitor = new Visitor(options);
      visitor.result = result;

      visitor.prepend();

      root.walkRules(visitor.collect);

      visitor.resolveNested();

      root.walkAtRules('apply', visitor.resolve);
    },
  };
}

creator.postcss = true;

export default creator;
