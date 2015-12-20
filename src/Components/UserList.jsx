import { Map } from 'immutable';
import { Connect } from '../Helper';
import { Paper } from 'material-ui';
import Radium from 'radium';
import React from 'react';

const props = state => ({
  userInRoom: state.userInRoom,
  canBan: state.user.canBan,
});

@Connect(props)
@Radium
export default class UserList extends React.Component {
  static propTypes = {
    userInRoom: React.PropTypes.instanceOf(Map),
  };
  static style = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      padding: 5,
      width: '15%',
    },
    user: {
      color: 'black',
      padding: 2,
      ':hover': {
        opacity: 0.6,
      },
    },
    title: {
      alignSelf: 'center',
    },
  };
  render() {
    const style = UserList.style;
    const { userInRoom, canBan } = this.props;
    return (
      <Paper style={style.wrapper}>
        <h3 style={style.title}>User</h3>
          {
            userInRoom.sortBy(u => u.username).map(user => (
              <div style={[style.user, { backgroundColor: user.color }, canBan && { cursor: 'pointer' }]} key={user.id}>{user.username}</div>
            )).toArray()
          }
      </Paper>
    );
  }
}
