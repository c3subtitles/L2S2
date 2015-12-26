/* @flow */
import { Connect } from '../Helper';
import { joinReadRoom, leaveReadRoom, getNextTalk } from '../Actions/rooms';
import { List } from 'immutable';
import { Paper, FontIcon, IconButton } from 'material-ui';
import Color from 'color-js';
import Dock from 'react-dock';
import Loading from 'react-loader';
import Radium from 'radium';
import React from 'react';
import ReadLines from './ReadLines';
import ReadSettings from './ReadSettings';
import NextTalk from './NextTalk';


global.Color = Color;

function RGBFromRaw(rawColor: string): string {
  rawColor = rawColor.substr(1);
  let r = rawColor.substr(0, 2);
  let g = rawColor.substr(2, 2);
  let b = rawColor.substr(4, 2);
  r = Number.parseInt(r, 16);
  g = Number.parseInt(g, 16);
  b = Number.parseInt(b, 16);
  return `${r},${g},${b}`;
}

const props = state => ({
  backgroundColor: state.readBackgroundColor,
  color: state.readColor,
  gradient: state.readGradient,
  gradientColor: state.gradientColor,
  lines: state.readLines,
  nextTalk: state.nextTalk,
});

type Props = {
  backgroundColor: string,
  color: string,
  gradient: bool,
  lines: List,
  nextTalk: Talk,
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
    const { location } = this.context;
    const { backgroundColor } = this.props;
    const RGBBackground = RGBFromRaw(backgroundColor);
    let gradientColor = `rgba(${RGBBackground},1), rgba(${RGBBackground}, 0.5), rgba(${RGBBackground}, 0)`;
    if (location.query.clean != null) {
      gradientColor = 'rgba(0,0,0,1),rgba(0,0,0,0.5), rgba(0,0,0,0)';
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
    const { nextTalk, lines, backgroundColor, color, gradientColor, gradient } = this.props;
    if (!lines) {
      return <Loading/>;
    }
    if (lines.size <= 0 && !nextTalk) {
      getNextTalk();
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
                <Dock key="Dock" dimStyle={style.dim} onVisibleChange={this.handleVisibleChange} isVisible={settingsOpen} position="right">
                  <ReadSettings enableGradient={gradient} backgroundColor={backgroundColor} color={color} gradientColor={gradientColor}/>
                </Dock>
              ),
              (
                <IconButton key="Settings" style={style.settings} onClick={this.openSettings} tooltip="Settings">
                  <FontIcon color={backgroundColor} className="material-icons">settings</FontIcon>
                </IconButton>
              ),
            ]
          }
          {lines.size <= 0 && (
            <NextTalk talk={nextTalk}/>
          )}
          {lines.size > 0 && (
            <ReadLines lines={lines.map(l => l.text)}/>
          )}
        </div>
      </Paper>
    );
  }
}
