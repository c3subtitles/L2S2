// @flow
import React from 'react';
import axios from 'axios';
import Talk from './Talk';

type Props = {
  params: {
    id: string,
  },
}

type State = {
  nextTalk?: Object,
}

export default class Read extends React.PureComponent {
  props: Props;
  state: State = {};
  componentWillMount() {
    this.fetchNextTalk();
  }
  async fetchNextTalk() {
    const { params: { id } } = this.props;
    const nextTalk = (await axios.get(`/api/nextTalk/${id}`)).data;
    this.setState({
      nextTalk,
    });
  }
  render() {
    const { nextTalk } = this.state;
    return (
      <div>
        <Talk talk={nextTalk}/>
      </div>
    );
  }
}
