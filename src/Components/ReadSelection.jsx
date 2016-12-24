// @flow
import Radium from 'radium';
import React from 'react';
import RoomSelection from './RoomSelection';


@Radium
export default class ReadSelection extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };
  handleRoomClick = room => {
    this.context.router.transitionTo(`/${room.id}`);
  };
  render() {
    return (
      <RoomSelection onRoomClick={this.handleRoomClick}/>
    );
  }
}
