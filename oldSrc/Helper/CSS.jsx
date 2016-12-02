// @flow
/* eslint no-unused-vars: 0 */

import _ from 'lodash';
import appendPxIfNeeded from 'radium/lib/append-px-if-needed';
import { Style } from 'radium';
import React from 'react';
import UUID from 'uuid-js';
import warning from 'warning';

function addChildrenToComponent(component: any, newChildren: any, newProps: Object, before: bool = false): React.Element<any> {
  const { children, ...props } = component.props;
  return React.createElement(component.type, {
    key: component.key,
    ref: component.ref,
    ...props,
    ...newProps,
  }, before ? newChildren : children, before ? children : newChildren);
}

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
    const reducedRules = appendUnits(_.reduce(rules, (prev, r) => _.merge({}, prev, r)));
    return class CSS extends component {
      static displayName = component.displayName || component.name;
      render() {
        const element = super.render();
        if (element === null) {
          return null;
        }
        if (_.isEmpty(reducedRules)) {
          return element;
        }
        warning(!element.type.canWorkWithCSS || !_.isString(element.type), '@CSS braucht ein primitiven Typ (div, span...) oder SmbFrame als äußeren wrapper');
        let { id } = element.props;
        id = id || `s${UUID.create().toString()}`;
        const styleId = UUID.create().toString();
        let styleElement;
        if (component._globalCSS) {
          styleElement = (<Style key={styleId} rules={reducedRules}/>);
        } else {
          styleElement = (<Style key={styleId} rules={reducedRules} scopeSelector={`#${id}`}/>);
        }
        return addChildrenToComponent(element, styleElement, { id });
      }
    };
  };
}
