// @flow
import React from 'react';
import RoomsService from 'Service/Rooms';
import { Button } from 'react-toolbox';
import { observer } from 'mobx-react';


@observer
export default class Home extends React.PureComponent {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };
  navigate(id: number) {
    this.context.router.transitionTo(`/${id}`);
  }
  render() {
    const rooms = RoomsService.rooms;
    return (
      <div>
        {
          rooms.map(r => (
            <Button onClick={this.navigate.bind(this, r.id)} raised label={r.name}/>
          )).toArray()
        }
      </div>
    );
  }
}
