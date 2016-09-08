import balanced from 'balanced-match';

const RE_PROP_SET = /^(--)([\w-]+)(\s*)([:]?)$/;


export default class Visitor {

  cache = {};
  result = {};

  /**
   * Collect all `:root` declared property sets and save them.
   * @param {Node} rule
   */
  collect = (rule) => {
    const matches = RE_PROP_SET.exec(rule.selector);

    if (!matches) {
      return;
    }

    const setName = matches[2];
    const parent = rule.parent;

    if (parent.selector !== ':root') {
      rule.warn(this.result,
        'Custom property set ignored: not scoped to top-level `:root` ' +
        `(--${setName}` +
        `${parent.type === 'rule' ? ` declared in ${parent.selector}` : ''})`
      );

      return;
    }

    // Custom property sets override each other wholly,
    // rather than cascading together like colliding style rules do.
    // @see: https://tabatkins.github.io/specs/css-apply-rule/#defining
    this.cache[setName] = rule;

    rule.remove();

    if (!parent.nodes.length) {
      parent.remove();
    }
  }

  /**
   * Replace nested `@apply` at-rules declarations.
   */
  resolveNested = () => {
    Object.keys(this.cache).forEach(rule =>
      this.cache[rule].walkAtRules('apply', this.resolve)
    );
  }

  /**
   * Replace `@apply` at-rules declarations with provided custom property set.
   * @param {Node} atRule
   */
  resolve = (atRule) => {
    const param = getParamValue(atRule.params);
    const matches = RE_PROP_SET.exec(param);

    if (!matches) {
      return;
    }

    const setName = matches[2];

    if (setName in this.cache) {
      atRule.replaceWith(this.cache[setName].nodes);
    } else {
      atRule.warn(this.result,
        `No custom property set declared for \`${setName}\`.`
      );
    }
  }
}


/**
 * Helper: allow parens usage in `@apply` rule declaration.
 * This is for Polymer integration.
 * @param {String} param
 * @return {String}
 */
function getParamValue(param) {
  return /^\(/.test(param) ? balanced('(', ')', param).body : param;
}
