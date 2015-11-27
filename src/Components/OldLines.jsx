import _ from 'lodash';
import { Connect } from '../Helper';
import React from 'react';
import Radium from 'radium';

const props = state => ({
  lines: state.lines,
});

@Connect(props)
@Radium
export default class OldLines extends React.Component {
  static propTypes = {
    lines: React.PropTypes.array,
    style: React.PropTypes.object,
  };
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
          _.take(lines, lines.length - 3).map((l, index) => (
            <span key={`${index}`} style={{ color: l.user.color }}>{l.line}</span>
          ))
        }
      </div>
    );
  }
}
