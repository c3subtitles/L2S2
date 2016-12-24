// @flow
import React from 'react';
import { FlatButton } from 'material-ui';

type Props = {
  label?: string,
  onClick?: Function,
  style?: Object,
}

export default class DeleteButton extends React.Component {
  props: Props;
  static style = {
    color: '#ff0000',
  };
  render() {
    const { label, onClick, style } = this.props;
    return (
      <FlatButton label={label} onClick={onClick} style={{ ...DeleteButton.style, ...style }}/>
    );
  }
}
