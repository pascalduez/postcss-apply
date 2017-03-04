// @flow
import balanced from 'balanced-match';

const RE_PROP_SET = /^(--)([\w-]+)(\s*)([:]?)$/;

export type Options = {
  preserve?: boolean,
};

type Node = Object;

type Rule = {
  type: string,
  selector: string,
  selectors: Array<string>,
  nodes: Array<Node>,
  parent: Rule,
  warn: () => void,
  clone: () => Rule,
  remove: () => void,
  insertBefore: () => void,
  replaceWith: () => void,
  walkRules: () => void,
};

type AtRule = {
  params: string,
  walkAtRules: () => void,
} & Rule;


export default class Visitor {

  cache = {};
  result = {};
  options: Options = {};
  defaults: Options = { preserve: false };

  constructor(options: Options) {
    this.options = {
      ...this.defaults,
      ...options,
    };
  }

  /**
   * Collect all `:root` declared property sets and save them.
   */
  collect = (rule: Rule) => {
    const matches: Array<string> = RE_PROP_SET.exec(rule.selector);

    if (!matches) {
      return;
    }

    const setName: string = matches[2];
    const parent: Rule = rule.parent;

    if (parent.selector !== ':root') {
      rule.warn(this.result,
        'Custom property set ignored: not scoped to top-level `:root` ' +
        `(--${setName}` +
        `${parent.type === 'rule' ? ` declared in ${parent.selector}` : ''})`
      );

      if (parent.type === 'root') {
        rule.remove();
      }

      return;
    }

    // Custom property sets override each other wholly,
    // rather than cascading together like colliding style rules do.
    // @see: https://tabatkins.github.io/specs/css-apply-rule/#defining
    const newRule: Rule = rule.clone();
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
    Object.keys(this.cache).forEach((rule: string) => {
      this.cache[rule].walkAtRules('apply', (atRule: AtRule) => {
        this.resolve(atRule);
        atRule.remove();
      });
    });
  }

  /**
   * Replace `@apply` at-rules declarations with provided custom property set.
   */
  resolve = (atRule: AtRule) => {
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

    const param: string = getParamValue(atRule.params);
    const matches: Array<string> = RE_PROP_SET.exec(param);

    if (!matches) {
      return;
    }

    const setName: string = matches[2];
    const parent: Rule = atRule.parent;

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
 */
function isDefinition(rule: Rule): boolean {
  return (!!rule.selector && RE_PROP_SET.exec(rule.selector))
    && (rule.parent && !!rule.parent.selector && rule.parent.selector === ':root');
}


/**
 * Helper: allow parens usage in `@apply` rule declaration.
 * This is for Polymer integration.
 */
function getParamValue(param: string): string {
  return /^\(/.test(param) ? balanced('(', ')', param).body : param;
}
