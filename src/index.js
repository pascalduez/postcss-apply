import { plugin } from 'postcss';
import Visitor from './visitor';

export default plugin('postcss-apply', options => (css, result) => {
  const visitor = new Visitor(options);
  visitor.result = result;

  css.walkRules(visitor.collect);

  visitor.resolveNested();

  css.walkAtRules('apply', visitor.resolve);
});
