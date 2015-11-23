
import React from 'react';
import { Permission, Connect } from '../Helper';

const props = state => ({
  rooms: state.rooms,
});

@Permission('canCreateRoom', 'canDeleteRoom')
@Connect(props)
export default class RoomManagement extends React.Component {
  static propTypes = {
    rooms: React.PropTypes.arrayOf(React.PropTypes.object),
    user: React.PropTypes.object,
  };
  static style = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
  };
  render() {
    const { rooms } = this.props;
    const style = RoomManagement.style;
    return (
      <div style={style.wrapper}>
        {
          rooms.map(room => <div>{room.name}</div>)
        }
      </div>
    );
  }
}
