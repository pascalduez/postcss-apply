const RE_PROP_SET = /^(--)([\w-]+)(\s*)([:;]?)$/;

export default class Parser {

  cache = {};
  result = {};

  collect(rule) {
    let matches = RE_PROP_SET.exec(rule.selector);
    let parent = rule.parent;

    if (!matches) {
      return;
    }

    if (parent.selector !== ':root') {
      return rule.warn(
        this.result,
        'Custom properties sets are only allowed on `:root` rules.'
      );
    }

    this.cache[matches[2]] = rule;
    rule.remove();

    if (!parent.nodes.length) {
      parent.remove();
    }
  }

  replace(atRule) {
    let matches = RE_PROP_SET.exec(atRule.params);

    if (!matches) {
      return;
    }

    let setName = matches[2];

    if (setName in this.cache) {
      atRule.replaceWith(this.cache[setName].nodes);
    } else {
      atRule.warn(
        this.result,
        `No custom properties set declared for \`${setName}\`.`
      );
    }
  }
}
