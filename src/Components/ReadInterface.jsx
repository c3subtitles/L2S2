/* @flow */
import { Connect } from '../Helper';
import { joinReadRoom, leaveReadRoom } from '../Actions/rooms';
import { List } from 'immutable';
import { Paper, FontIcon, IconButton } from 'material-ui';
import Color from 'color-js';
import Dock from 'react-dock';
import Loading from 'react-loader';
import Radium from 'radium';
import React from 'react';
import ReadLines from './ReadLines';
import ReadSettings from './ReadSettings';

global.Color = Color;

const props = state => ({
  backgroundColor: state.readBackgroundColor,
  color: state.readColor,
  gradient: state.readGradient,
  gradientColor: state.gradientColor,
  lines: state.readLines,
});

type Props = {
  backgroundColor: string,
  color: string,
  gradient: bool,
  gradientColor: string,
  lines: List,
  params: Object,
};

type State = {
  settingsOpen: bool,
};

/*::`*/
@Connect(props)
@Radium
/*::`*/
export default class ReadInterface extends React.Component<void, Props, State> {
  static style = {
    wrapper: {
      WebkitAlignItems: 'center',
      alignItems: 'center',
      display: 'flex',
      WebkitFlex: '1 1 0',
      flex: '1 1 0',
      WebkitFlexDirection: 'column',
      flexDirection: 'column',
      WebkitJustifyContent: 'flex-end',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      position: 'relative',
    },
    innerWrapper: {
      display: 'flex',
      flex: '1 1 0',
      WebkitFlex: '1 1 0',
      WebkitFlexDirection: 'column',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      WebkitJustifyContent: 'flex-end',
    },
    line: {
      WebkitAlignItems: 'center',
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
  static contextTypes = {
    location: React.PropTypes.object,
  };
  state: {
    settingsOpen: false,
  };
  componentWillMount() {
    const { roomId } = this.props.params;
    joinReadRoom(Number.parseInt(roomId));
  }
  componentWillUnmount() {
    leaveReadRoom();
  }
  getWrapperStyle(): Object {
    let { backgroundColor, color } = this.props;
    const { location } = this.context;
    if (location.query.clean != null) {
      backgroundColor = 'black';
      color = 'white';
    }
    return {
      ...ReadInterface.style.wrapper,
      backgroundColor,
      color,
    };
  }
  getGradientStyle(): Object {
    let { gradientColor } = this.props;
    const { location } = this.context;
    if (location.query.clean != null) {
      gradientColor = 'rgba(0,0,0,1),rgba(0,0,0,0.6)';
    }
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
    const { location } = this.context;
    const { settingsOpen } = this.state;
    const style = ReadInterface.style;
    return (
      <Paper style={this.getWrapperStyle()}>
        <div style={style.innerWrapper}>
          {(gradient || location.query.clean != null) && (<div style={this.getGradientStyle()}/>)}
          {
            location.query.clean == null &&
            [
              (
                <Dock dimStyle={style.dim} onVisibleChange={this.handleVisibleChange} isVisible={settingsOpen} position="right">
                  <ReadSettings enableGradient={gradient} backgroundColor={backgroundColor} color={color} gradientColor={gradientColor}/>
                </Dock>
              ),
              (
                <IconButton style={style.settings} onClick={this.openSettings} tooltip="Settings">
                  <FontIcon color={backgroundColor} className="material-icons">settings</FontIcon>
                </IconButton>
              ),
            ]
          }
          <ReadLines lines={lines}/>
        </div>
      </Paper>
    );
  }
}
