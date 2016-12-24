// @flow
import appendPxIfNeeded from 'radium/lib/append-px-if-needed';
import { Style } from 'radium';
import React from 'react';
import UUID from 'uuid-js';
import _ from 'lodash';

function appendUnits(style: Object) {
  _.each(style, (value, key: string) => {
    if (_.isObject(value)) {
      style[key] = appendUnits(value);
    } else {
      style[key] = appendPxIfNeeded(key, value);
    }
  });
  return style;
}

export function CSS(...rules: Array<Object>): Function {
  return function(component) {
    const processedRules = appendUnits(_.reduce(rules, (prev, _rules) => _.merge({}, prev, _rules)));
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
          styleElement = (<Style key={styleId} rules={processedRules}/>);
        } else {
          styleElement = (<Style key={styleId} rules={processedRules} scopeSelector={`#${rid}`}/>);
        }
        return React.createElement(element.type, _.extend({
          key: element.key,
          ref: element.ref,
        }, props, { id: rid }), children, styleElement);
      }
    };
  };
}
