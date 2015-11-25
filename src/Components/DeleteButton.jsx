import React from 'react';
import { FlatButton } from 'material-ui';

export default class DeleteButton extends React.Component {
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
