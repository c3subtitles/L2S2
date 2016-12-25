// @flow
import { List } from 'immutable';
import Radium from 'radium';
import React from 'react';
// import CSSTransitionGroup from 'react-addons-css-transition-group';

type Props = {
  alwaysUpdate?: bool,
  fontSize: string,
  lines: List<Line>,
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
      // alignSelf: 'center',
      display: 'flex',
      fontWeight: 'bold',
      // marginBottom: '0.2em',
      // marginTop: '0.2em',
      overflow: 'hidden',
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
  };
  static defaultProps = {
    fontSize: '38px',
  };
  shouldComponentUpdate(nextProps: Props): bool {
    return nextProps.alwaysUpdate || this.props.lines !== nextProps.lines;
  }
  animate = () => {
    const newMargin = Math.max(this.state.margin - 6, 0);
    this.setState({
      margin: newMargin,
    });
    if (newMargin > 0) {
      this.timeout = setTimeout(this.animate, 10);
    }
  };
  componentWillReceiveProps(nextProps: Props) {
    const addedLines = nextProps.lines.size - this.props.lines.size;
    const addedMargin = addedLines * 92;
    clearTimeout(this.timeout);
    this.setState({
      margin: this.state.margin + addedMargin,
    }, () => {
      this.timeout = setTimeout(this.animate, 10);
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
