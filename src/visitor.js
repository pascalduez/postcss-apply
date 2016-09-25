import balanced from 'balanced-match';
// import postcss from 'postcss';

const RE_PROP_SET = /^(--)([\w-]+)(\s*)([:]?)$/;


export default class Visitor {

  cache = {};
  result = {};
  defaults = { preserve: false };

  constructor(options) {
    this.options = {
      ...this.defaults,
      ...options,
    };
  }

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
    const newRule = rule.clone();
    this.cache[setName] = newRule;

    if (!this.options.preserve) {
      rule.remove();
    }

    if (!parent.nodes.length) {
      parent.remove();
    }
  }

  /**
   * Replace nested `@apply` at-rules declarations.
   */
  resolveNested = () => {
    Object.keys(this.cache).forEach((rule) => {
      this.cache[rule].walkAtRules('apply', (atRule) => {
        this.resolve(atRule);
        atRule.remove();
      });
    });
  }

  /**
   * Replace `@apply` at-rules declarations with provided custom property set.
   * @param {Node} atRule
   */
  resolve = (atRule) => {
    if (atRule.parent.type !== 'rule') {
      atRule.warn(this.result,
        'The @apply rule can only be declared inside Rule type nodes.'
      );

      atRule.remove();
      return;
    }

    if (isDefinition(atRule.parent)) {
      return;
    }

    const param = getParamValue(atRule.params);
    const matches = RE_PROP_SET.exec(param);

    if (!matches) {
      return;
    }

    const setName = matches[2];
    const parent = atRule.parent;

    if (!(setName in this.cache)) {
      atRule.warn(this.result,
        `No custom property set declared for \`${setName}\`.`
      );

      return;
    }

    if (this.options.preserve) {
      parent.insertBefore(atRule, this.cache[setName].nodes);

      return;
    }

    atRule.replaceWith(this.cache[setName].nodes);
  }
}


/**
 * Helper: return whether the rule is a custom property set definition.
 * @param {Object} rule
 * @return {Boolean}
 */
function isDefinition(rule) {
  return (rule.selector && RE_PROP_SET.exec(rule.selector))
    && (rule.parent && rule.parent.selector && rule.parent.selector === ':root');
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
