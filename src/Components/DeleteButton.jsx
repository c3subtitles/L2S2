/* @flow */
import React from 'react';
import { FlatButton } from 'material-ui';

type Props = {
  label?: string,
  onClick?: Function,
  style?: Object,
}

export default class DeleteButton extends React.Component<void, Props, void> {
  static propTypes = {
    label: React.PropTypes.string,
    onClick: React.PropTypes.func,
    style: React.PropTypes.object,
  };
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
