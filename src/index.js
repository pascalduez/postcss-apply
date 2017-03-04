// @flow
import { plugin } from 'postcss';
import Visitor, { type Options } from './visitor';

export default plugin('postcss-apply', (options: Options) => (css: Object, result: Object) => {
  const visitor = new Visitor(options);
  visitor.result = result;

  css.walkRules(visitor.collect);

  visitor.resolveNested();

  css.walkAtRules('apply', visitor.resolve);
});
