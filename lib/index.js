import postcss from 'postcss';
import Parser from './parser';

export default postcss.plugin('postcss-apply', () => (css, result) => {
  const parser = new Parser();
  parser.result = result;

  css.walkRules(::parser.collect);
  css.walkAtRules('apply', ::parser.replace);
});
