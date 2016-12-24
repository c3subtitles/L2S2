// @flow
import { Connect } from '../Helper';
import { joinReadRoom, leaveReadRoom, getNextTalk } from '../Actions/rooms';
import { List } from 'immutable';
import { Paper, FontIcon, IconButton } from 'material-ui';
import Dock from 'react-dock';
import Loading from 'react-loader';
import Radium from 'radium';
import React from 'react';
import ReadLines from './ReadLines';
import ReadSettings from './ReadSettings';
import NextTalk from './NextTalk';


function RGBFromRaw(rawColor: string): string {
  const color = rawColor.substr(1);
  let r = color.substr(0, 2);
  let g = color.substr(2, 2);
  let b = color.substr(4, 2);
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
  backgroundColor?: string,
  color?: string,
  gradient?: bool,
  gradientColor?: string,
  lines?: List,
  nextTalk?: Talk,
  params: Object,
  location?: RouterLocation,
  params?: {
    roomId: string,
  }
};

type State = {
  settingsOpen: bool,
};

@Connect(props)
@Radium
export default class ReadInterface extends React.Component {
  static style = {
    wrapper: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      position: 'relative',
      WebkitAlignItems: 'center',
      WebkitFlex: '1 1 0',
      WebkitFlexDirection: 'column',
      WebkitJustifyContent: 'flex-end',
    },
    innerWrapper: {
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      textAlign: 'center',
      WebkitFlex: '1 1 0',
      WebkitFlexDirection: 'column',
      WebkitJustifyContent: 'flex-end',
    },
    line: {
      alignItems: 'center',
      display: 'flex',
      fontSize: 32,
      fontWeight: 'bold',
      minHeight: '4em',
      WebkitAlignItems: 'center',
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
  props: Props;
  state: State = {
    settingsOpen: false,
  };
  componentWillMount() {
    const { roomId } = this.props.params;
    joinReadRoom(Number.parseInt(roomId, 10));
  }
  componentWillUnmount() {
    leaveReadRoom();
  }
  getWrapperStyle(): Object {
    const { backgroundColor, color } = this.props;
    return {
      ...ReadInterface.style.wrapper,
      backgroundColor,
      color,
    };
  }
  getGradientStyle(): Object {
    const { backgroundColor } = this.props;
    const RGBBackground = backgroundColor ? RGBFromRaw(backgroundColor) : '';
    const gradientColor = `rgba(${RGBBackground},1), rgba(${RGBBackground}, 0.5), rgba(${RGBBackground}, 0)`;
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
    const { nextTalk, lines, backgroundColor, color, gradientColor, gradient, params } = this.props;
    if (!lines) {
      return <Loading/>;
    }
    if (lines.size <= 0 && !nextTalk && params) {
      getNextTalk(params.roomId);
    }
    const { settingsOpen } = this.state;
    const style = ReadInterface.style;
    return (
      <Paper style={this.getWrapperStyle()}>
        <div style={style.innerWrapper}>
          {gradient && (<div style={this.getGradientStyle()}/>)}
          {
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
