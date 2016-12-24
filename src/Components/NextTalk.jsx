// @flow
import React from 'react';
import Radium from 'radium';

type Props = {
  talk?: Talk,
};

@Radium
export default class NextTalk extends React.Component {
  props: Props;
  static style = {
    wrapper: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      fontSize: '5em',
      justifyContent: 'space-around',
      WebkitAlignItems: 'center',
      WebkitFlex: '1 1 0',
      WebkitFlexDirection: 'column',
      WebkitJustifyContent: 'space-around',
    },
  };
  render() {
    const style = NextTalk.style;
    const { talk } = this.props;
    if (!talk) {
      return null;
    }
    return (
      <div style={style.wrapper}>
        <div>Next Talk</div>
        <div>{talk.title}</div>
        <div>{talk.date.format('DD.MM HH:mm')}</div>
      </div>
    );
  }
}
