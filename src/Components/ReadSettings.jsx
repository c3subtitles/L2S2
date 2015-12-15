import React from 'react';
import { Connect } from '../Helper';
import Radium from 'radium';
import { changeReadColor } from '../Actions/rooms';
import { Toggle } from 'material-ui';

const props = state => ({
  ...state,
});

type Props = {
  backgroundColor?: string,
  color?: string,
  enableGradient?: bool,
};

@Connect(props)
@Radium
export default class ReadSettings extends React.Component<void, Props, {}> {
  static style = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: 10,
    },
    line: {
      display: 'flex',
      alignItems: 'center',
    },
    label: {
      flex: '1 1 0',
    },
  };
  handleBgChange = (e) => {
    clearTimeout(this.colorChangeTimeout);
    this.colorChangeTimeout = setTimeout(changeReadColor.bind(null, {
      backgroundColor: e.target.value,
    }), 100);
  };
  handleColorChange = (e) => {
    clearTimeout(this.colorChangeTimeout);
    this.colorChangeTimeout = setTimeout(changeReadColor.bind(null, {
      color: e.target.value,
    }), 100);
  };
  handleGradient = (e, toggled) => {
    changeReadColor({
      enableGradient: toggled,
    });
  };
  render() {
    const { backgroundColor, color, enableGradient } = this.props;
    const style = ReadSettings.style;
    const wrapperStyle = {
      backgroundColor,
      color,
    };
    return (
      <div style={[style.wrapper, wrapperStyle]}>
        <h2>Interface Settings</h2>
        <div style={style.line}>
          <span style={style.label}>Background Color</span>
          <input type="color" onChange={this.handleBgChange} defaultValue={backgroundColor}/>
        </div>
        <div style={style.line}>
          <span style={style.label}>Color</span>
          <input type="color" onChange={this.handleColorChange} defaultValue={color}/>
        </div>
        <div style={style.line}>
          <span style={style.label}>Gradient</span>
          <Toggle style={{ width: 'initial' }} defaultToggled={enableGradient} onToggle={this.handleGradient}/>
        </div>
      </div>
    );
  }
}
