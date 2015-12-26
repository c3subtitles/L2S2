/* @flow */
/* $FlowFixMe */
import 'imports?this=>window&define=>false!../../primusClient';
import axios from 'axios';
import moment from 'moment';

function convertTalk(talk: RawTalk): Talk {
  return {
    ...talk,
    date: moment(talk.date),
    duration: moment.duration(talk.duration),
  };
}

/* $FlowFixMe */
const config = require(CONFIGPATH).default;
export const primus = global.Primus.connect(config.primusLocation);

export async function joinReadRoom(roomId) {
  primus.emit('join', roomId);
  const joinInformation = await axios.get(`/api/rooms/${roomId}/joinRead`);
  return joinInformation.data.lines;
}

export function leaveReadRoom(roomId) {
  primus.emit('leave', roomId);
}

export async function nextTalk(roomId) {
  const talk = (await axios.get(`/api/nextTalk/${roomId}`)).data;
  return convertTalk(talk);
}
