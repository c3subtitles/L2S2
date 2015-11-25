
import Radium from 'radium';
import React from 'react';
import RoomSelection from './RoomSelection';


@Radium
export default class WriteSelection extends React.Component {
  static contextTypes = {
    transitionTo: React.PropTypes.func,
  };
  handleRoomClick = room => {
    this.context.transitionTo(`/write/${room.id}`);
  };
  render() {
    return (
      <RoomSelection onRoomClick={this.handleRoomClick}/>
    );
  }
}
