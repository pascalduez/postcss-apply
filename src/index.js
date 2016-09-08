import { plugin } from 'postcss';
import Visitor from './visitor';

export default plugin('postcss-apply', () => (css, result) => {
  const visitor = new Visitor();
  visitor.result = result;

  css.walkRules(visitor.collect);

  visitor.resolveNested();

  css.walkAtRules('apply', visitor.resolve);
});
