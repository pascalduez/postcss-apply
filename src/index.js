/* eslint-disable consistent-return */

import { plugin } from 'postcss';
import Visitor from './visitor';

export default plugin('postcss-apply', () => (css, result) => {
  const visitor = new Visitor();
  visitor.result = result;

  css.walk(node => {
    if (node.type === 'rule') {
      return visitor.collect(node);
    }
    if (node.type === 'atrule' && node.name === 'apply') {
      return visitor.replace(node);
    }
  });
});
