

import { isUnitlessNumber } from 'react/lib/CSSProperty';
import { Style } from 'radium';
import React from 'react';
import UUID from 'uuid-js';
import _ from 'lodash';

function appendUnits(style) {
  _.each(style, (value, key) => {
    if (_.isObject(value)) {
      style[key] = appendUnits(value);
    } else if (!isUnitlessNumber[key]) {
      const number = parseInt(value);
      if (number == value && Number.isInteger(number)) {
        style[key] = `${value}px`;
      }
    }
  });
  return style;
}

export default function(...rules): Function {
  return function(component) {
    rules = appendUnits(_.reduce(rules, (prev, rules) => _.merge({}, prev, rules)));
    return class CSS extends component {
      static displayName = component.displayName || component.name;
      render() {
        const element = super.render();
        if (element === null) {
          return null;
        }
        const { id, children, ...props } = element.props;
        const rid = id || `s${UUID.create()}`;
        const styleId = UUID.create();
        let styleElement;
        if (component._globalCSS) {
          styleElement = (<Style key={styleId} rules={rules}/>);
        } else {
          styleElement = (<Style key={styleId} rules={rules} scopeSelector={`#${rid}`}/>);
        }
        return React.createElement(element.type, _.extend({
          key: element.key,
          ref: element.ref,
        }, props, { id: rid }), children, styleElement);
      }
    };
  };
}
