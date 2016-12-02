/* @flow */
import { ObserveMount } from './ObserveMount';
import shallowequal from 'shallowequal';
import _ from 'lodash';

function pureRender({ state, props }) {
  return function(component: any) {
    class PureRender extends component {
      static displayName = component.displayName || component.name;
      shouldComponentUpdate(nextProps, nextState) {
        let ownUpdate = false;
        if (props !== false) {
          ownUpdate = !shallowequal(this.props, nextProps);
        }
        if (state !== false) {
          ownUpdate = ownUpdate || !shallowequal(this.state, nextState, (a, b, key) => {
            if (key === '_radiumStyleState') {
              return _.isEqual(a, b);
            }
            return undefined;
          });
        }
        if (ownUpdate) {
          return true;
        }
        return super.shouldComponentUpdate ? super.shouldComponentUpdate(nextProps, nextState) : false;
      }
      render() {
        return super.render();
      }
    }
    return ObserveMount(PureRender);
  };
}

export function PureRender(optionsOrComponent: Object|Function): Function {
  if (_.isFunction(optionsOrComponent)) {
    return pureRender({})(optionsOrComponent);
  }
  return pureRender(optionsOrComponent);
}
