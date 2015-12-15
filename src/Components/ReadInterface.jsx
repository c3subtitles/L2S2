import { Connect } from '../Helper';
import { joinReadRoom, leaveReadRoom } from '../Actions/rooms';
import { List } from 'immutable';
import { Paper, FontIcon, IconButton } from 'material-ui';
import Color from 'color-js';
import Dock from 'react-dock';
import Loading from 'react-loader';
import Radium from 'radium';
import React from 'react';
import ReadSettings from './ReadSettings';

global.Color = Color;

const props = state => ({
  backgroundColor: state.readBackgroundColor,
  color: state.readColor,
  gradient: state.readGradient,
  gradientColor: state.gradientColor,
  lines: state.readLines,
});

@Connect(props)
@Radium
export default class ReadInterface extends React.Component {
  static propTypes = {
    backgroundColor: React.PropTypes.string,
    color: React.PropTypes.string,
    gradient: React.PropTypes.bool,
    gradientColor: React.PropTypes.string,
    lines: React.PropTypes.instanceOf(List),
    params: React.PropTypes.object,
  };
  static style = {
    wrapper: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      position: 'relative',
    },
    line: {
      alignItems: 'center',
      display: 'flex',
      fontSize: 32,
      fontWeight: 'bold',
      minHeight: '4em',
    },
    gradient: {
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    settings: {
      filter: 'invert(100%)',
      position: 'absolute',
      right: 5,
      top: 5,
    },
    dim: {
      background: 'none',
    },
  };
  state: {
    settingsOpen: false,
  };
  componentWillMount() {
    const { roomId } = this.props.params;
    joinReadRoom(roomId);
  }
  componentWillUnmount() {
    leaveReadRoom();
  }
  getWrapperStyle() {
    const { backgroundColor, color } = this.props;
    return {
      ...ReadInterface.style.wrapper,
      backgroundColor,
      color,
    };
  }
  getGradientStyle() {
    const { gradientColor } = this.props;
    return {
      ...ReadInterface.style.gradient,
      background: `linear-gradient(${gradientColor}, transparent)`,
    };
  }
  openSettings = () => {
    this.setState({
      settingsOpen: true,
    });
  };
  handleVisibleChange = () => {
    this.setState({
      settingsOpen: false,
    });
  };
  render() {
    const { lines, backgroundColor, color, gradientColor, gradient } = this.props;
    if (!lines) {
      return <Loading/>;
    }
    const { settingsOpen } = this.state;
    const style = ReadInterface.style;
    return (
      <Paper style={this.getWrapperStyle()}>
        {gradient && (<div style={this.getGradientStyle()}/>)}
        <Dock dimStyle={style.dim} onVisibleChange={this.handleVisibleChange} isVisible={settingsOpen} position="right">
          <ReadSettings enableGradient={gradient} backgroundColor={backgroundColor} color={color} gradientColor={gradientColor}/>
        </Dock>
        <IconButton style={style.settings} onClick={this.openSettings} tooltip="Settings">
          <FontIcon color={backgroundColor} className="material-icons">settings</FontIcon>
        </IconButton>
        {
          lines.map((l, i) => (
            <div style={style.line} key={i}>
              {l}
            </div>
          ))
        }
      </Paper>
    );
  }
}
