import postcss from 'postcss';
import Parser from './parser';

export default postcss.plugin('postcss-apply', () => (css, result) => {
  const parser = new Parser();
  parser.result = result;

  css.walk(node => {
    if (node.type === 'rule')
      return parser.collect(node);
    if (node.type === 'atrule' && node.name === 'apply')
      return parser.replace(node);
  });
});
