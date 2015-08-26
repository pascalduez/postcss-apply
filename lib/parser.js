const RE_PROP_SET = /^(--)([\w-]+)(\s*)([:;]?)$/;

export default class Parser {
  constructor() {
    this._cache = {};
    this._result = {};
  }

  set result(res) {
    this._result = res;
  }

  collect(rule) {
    let matches = RE_PROP_SET.exec(rule.selector);
    let parent = rule.parent;

    if (!matches || !parent.selector === ':root') {
      return;
    }

    this._cache[matches[2]] = rule;
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

    if (setName in this._cache) {
      atRule.replaceWith(this._cache[setName].nodes);
    } else {
      atRule.warn(
        this._result,
        `No custom properties set declared for \`${setName}\``
      );
    }
  }
}
