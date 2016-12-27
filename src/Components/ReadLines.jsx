// @flow
import { List } from 'immutable';
import Radium from 'radium';
import React from 'react';
// import CSSTransitionGroup from 'react-addons-css-transition-group';

type Props = {
  alwaysUpdate?: bool,
  fontSize: string,
  lines: List<Line>,
  smooth?: bool,
};

type State = {
  margin: number,
}

@Radium
export default class ReadLines extends React.Component {
  state: State = {
    margin: 0,
  };
  timeout: any;
  props: Props;
  static style = {
    line: {
      display: 'flex',
      flexShrink: 0,
      fontWeight: 'bold',
      overflow: 'hidden',
      textAlign: 'left',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
  };
  static defaultProps = {
    fontSize: '38px',
  };
  shouldComponentUpdate(nextProps: Props): bool {
    return nextProps.alwaysUpdate || this.props.lines !== nextProps.lines;
  }
  animate = () => {
    const newMargin = Math.max(this.state.margin - 7, 0);
    this.setState({
      margin: newMargin,
    });
    if (newMargin > 0) {
      this.timeout = setTimeout(this.animate, 5);
    }
  };
  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.smooth) {
      return;
    }
    const addedLines = (nextProps.lines.size - this.props.lines.size) || 1;
    const addedMargin = addedLines * 75;
    clearTimeout(this.timeout);
    this.setState({
      margin: this.state.margin + addedMargin,
    }, () => {
      this.timeout = setTimeout(this.animate, 5);
    });
  }
  render() {
    const style = ReadLines.style;
    const { lines, fontSize } = this.props;
    const { margin } = this.state;
    const lineStyle = {
      ...style.line,
      fontSize,
    };
    return (
      <div style={[style.wrapper, { marginBottom: `-${margin}px` }]}>
        {
          lines.map((l) => (
            <div key={l.hash} style={lineStyle}>
              {l.text}
            </div>
          ))
        }
      </div>
    );
  }
}
