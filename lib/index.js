import postcss from 'postcss';
import Parser from './parser';

export default postcss.plugin('postcss-apply', () => {
  const parser = new Parser();

  return (css, result) => {
    parser.result = result;
    css.walkRules(::parser.collect);
    css.walkAtRules('apply', ::parser.replace);
  };
});
