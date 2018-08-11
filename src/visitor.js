// @flow
/* eslint-disable no-param-reassign */

import balanced from 'balanced-match';
import postcss from 'postcss';
import { kebabify, isPlainObject } from './utils';

const RE_PROP_SET = /^(--)([\w-]+)(\s*)([:]?)$/;

export type Options = {
  preserve?: boolean,
  sets?: {
    [key: string]: {
      [key: string]: string,
    },
  },
};

type Node = Object;
type Decl = Object;
type Result = Object;

type Rule = {
  type: string,
  selector: string,
  selectors: Array<string>,
  nodes: Array<Node>,
  parent: Rule,
  raws: Object,
  last: boolean,
  warn: (result: Result, text: string, opts?: Object) => void,
  clone: () => Rule,
  remove: () => void,
  append: () => void,
  prepend: (children: Node | Array<Node> | Object | string) => void,
  insertBefore: (node: Node, add: Node | Array<Node> | Object | string) => void,
  replaceWith: (nodes: Array<Node>) => void,
  walkDecls: (rule: Decl) => void,
};

type AtRule = {
  params: string,
} & Rule;

export default class Visitor {
  cache = {};

  result = {};

  options: Options = {};

  defaults: Options = {
    preserve: false,
    sets: {},
  };

  constructor(options: Options) {
    this.options = {
      ...this.defaults,
      ...options,
    };
  }

  /**
   * Prepend JS defined sets into the cache before parsing.
   * This means CSS defined sets will overrides them if they share the same name.
   */
  prepend = () => {
    const { sets } = this.options;

    // $FlowFixMe
    Object.keys(sets).forEach((setName: string) => {
      const newRule: Rule = postcss.rule({ selector: `--${setName}` });

      // $FlowFixMe
      const set = sets[setName];

      if (typeof set === 'string') {
        newRule.prepend(set);
      } else if (isPlainObject(set)) {
        Object.entries(set).forEach(([prop, value]) => {
          newRule.prepend(postcss.decl({ prop: kebabify(prop), value }));
        });
      } else {
        throw new Error(
          `Unrecognized set type \`${typeof set}\`, must be an object or string.`
        );
      }

      this.cache[setName] = newRule;
    });
  };

  /**
   * Collect all `:root` declared property sets and save them.
   */
  collect = (rule: Rule) => {
    const matches = RE_PROP_SET.exec(rule.selector);

    if (!matches) {
      return;
    }

    const setName: string = matches[2];
    const { parent }: Rule = rule;

    if (parent.selector !== ':root') {
      rule.warn(
        this.result,
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
      removeCommentBefore(rule);
      safeRemoveRule(rule);
    }

    if (!parent.nodes.length) {
      parent.remove();
    }
  };

  /**
   * Replace nested `@apply` at-rules declarations.
   */
  resolveNested = () => {
    Object.keys(this.cache).forEach((rule: string) => {
      this.cache[rule].walkAtRules('apply', (atRule: AtRule) => {
        this.resolve(atRule);

        // @TODO honor `preserve` option.
        atRule.remove();
      });
    });
  };

  /**
   * Replace `@apply` at-rules declarations with provided custom property set.
   */
  resolve = (atRule: AtRule) => {
    let ancestor: Rule = atRule.parent;

    while (ancestor && ancestor.type !== 'rule') {
      ancestor = ancestor.parent;
    }

    if (!ancestor) {
      atRule.warn(
        this.result,
        'The @apply rule can only be declared inside Rule type nodes.'
      );

      atRule.remove();
      return;
    }

    if (isDefinition(atRule.parent)) {
      return;
    }

    const param: string = getParamValue(atRule.params);
    const matches = RE_PROP_SET.exec(param);

    if (!matches) {
      return;
    }

    const setName: string = matches[2];
    const { parent }: Rule = atRule;

    if (!(setName in this.cache)) {
      atRule.warn(
        this.result,
        `No custom property set declared for \`${setName}\`.`
      );

      return;
    }

    const newRule = this.cache[setName].clone();
    cleanIndent(newRule);

    if (this.options.preserve) {
      parent.insertBefore(atRule, newRule.nodes);

      return;
    }

    atRule.replaceWith(newRule.nodes);
  };
}

/**
 * Helper: return whether the rule is a custom property set definition.
 */
function isDefinition(rule: Rule): boolean {
  return (
    !!rule.selector &&
    !!RE_PROP_SET.exec(rule.selector) &&
    (rule.parent && !!rule.parent.selector && rule.parent.selector === ':root')
  );
}

/**
 * Helper: allow parens usage in `@apply` AtRule declaration.
 * This is for Polymer integration.
 */
function getParamValue(param: string): string {
  return /^\(/.test(param) ? balanced('(', ')', param).body : param;
}

/**
 * Helper: remove excessive declarations indentation.
 */
function cleanIndent(rule: Rule) {
  rule.walkDecls((decl: Decl) => {
    if (typeof decl.raws.before === 'string') {
      decl.raws.before = decl.raws.before.replace(/[^\S\n\r]{2,}/, '  ');
    }
  });
}

/**
 * Helper: correctly handle property sets removal and semi-colons.
 * @See: postcss/postcss#1014
 */
function safeRemoveRule(rule: Rule) {
  if (rule === rule.parent.last && rule.raws.ownSemicolon) {
    rule.parent.raws.semicolon = true;
  }

  rule.remove();
}

/**
 * Helper: remove immediate preceding comments.
 */
function removeCommentBefore(node: Node) {
  const previousNode = node.prev();

  if (previousNode && previousNode.type === 'comment') {
    previousNode.remove();
  }
}
