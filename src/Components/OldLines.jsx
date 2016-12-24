// @flow
import { List } from 'immutable';
import { Connect } from '../Helper';
import React from 'react';
import Radium from 'radium';

const props = state => ({
  lines: state.lines,
});

type Props = {
  lines: List,
  style: ?Object,
};

/*::`*/
@Connect(props)
@Radium
/*::`*/
export default class OldLines extends React.Component {
  props: Props;
  static style = {
    background: 'linear-gradient(rgba(255,255,255,1), rgba(255,255,255,0.7), transparent)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: '3px',
    top: 0,
  };
  render() {
    const { lines, style } = this.props;
    return (
      <div style={[style, { position: 'relative', flex: '1 1 0' }]}>
        <div style={OldLines.style}/>
        {
          lines.take(lines.size - 3).map((l, index) => {
            const color = (l.user && l.user.color) || l.color;
            return (
              <span key={`${index}`} style={{ color }}>{l.line}</span>
            );
          })
        }
      </div>
    );
  }
}
