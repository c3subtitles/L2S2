/* eslint no-unused-vars: 0 */
import { isUnitlessNumber } from 'react/lib/CSSProperty';
import { Style } from 'radium';
import React from 'react';
import UUID from 'uuid-js';

function appendUnits(style) {
  _.each(style, (value, key) => {
    if (_.isObject(value)) {
      style[key] = appendUnits(value);
    } else if (!isUnitlessNumber[key]) {
      const number = Number.parseInt(value);
      if (number == value && Number.isInteger(number)) {
        style[key] = `${value}px`;
      }
    }
  });
  return style;
}

export default function(...rules) {
  return function(component) {
    rules = appendUnits(_.reduce(rules, (prev, rules) => _.merge({}, prev, rules)));
    return class CSS extends component {
      static displayName = component.displayName || component.name
      render() {
        const element = super.render();
        if (element === null) {
          return null;
        }
        let { id } = element.props;
        id = id || `s${UUID.create()}`;
        const styleId = UUID.create();
        let styleElement;
        if (component._globalCSS) {
          styleElement = (<Style key={styleId} rules={rules}/>);
        } else {
          styleElement = (<Style key={styleId} rules={rules} scopeSelector={`#${id}`}/>);
        }
        const { children, ...props } = element.props;
        return React.createElement(element.type, _.extend({
          key: element.key,
          ref: element.ref,
        }, props, { id }), children, styleElement);
      }
    };
  };
}
