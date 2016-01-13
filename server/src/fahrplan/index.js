/* @flow */
import _ from 'lodash';
import '../../../babelHelper';
import 'babel-regenerator-runtime';
import { List } from 'immutable';
import { redisClient } from '../Services/redis';
import axios from 'axios';
import moment from 'moment';

export async function isVersionNew(rawFahrplan: { version: string }): Promise<bool> {
  const version = await redisClient.getAsync('fahrplanVersion');
  return version !== rawFahrplan.version;
}

function convertTalk(talk: RawTalk): Talk {
  return {
    ...talk,
    date: moment(talk.date),
    duration: moment.duration(talk.duration),
  };
}

function convertTalkList(talkList: Array<RawTalk>): Array<Talk> {
  return talkList.map(t => convertTalk(t));
}


let room1: List<Talk> = List();
let room2: List<Talk> = List();

export async function parseFahrplan(): Promise {
  const fahrplan = (await axios.get('https://events.ccc.de/congress/2015/Fahrplan/schedule.json')).data.schedule;
  const newVersion = !(await isVersionNew(fahrplan));
  if (newVersion) {
    throw 'Same Fahrplan Version';
  }
  fahrplan.conference.days.forEach(day => {

    _.each(day.rooms, (talks, room) => {
      if (room === 'Hall 1') {
        talks.forEach(talk => {
          room1 = room1.push(convertTalk(talk));
        });
      }
      if (room === 'Hall 2') {
        talks.forEach(talk => {
          room2 = room2.push(convertTalk(talk));
        });
      }
    });
  });

  room1 = room1.sortBy(t => t.date);
  room2 = room2.sortBy(t => t.date);
  await Promise.all([
    redisClient.set('room1', JSON.stringify(room1.toArray())),
    redisClient.set('room2', JSON.stringify(room2.toArray())),
  ]);

  await redisClient.set('fahrplanVersion', fahrplan.version);
}

export async function getFahrplan(): Promise {
  const rawRoom1 = await redisClient.getAsync('room1');
  const rawRoom2 = await redisClient.getAsync('room2');
  if (!rawRoom1 || !rawRoom2) {
    await parseFahrplan();
    return;
  }
  room1 = List(convertTalkList(JSON.parse(rawRoom1)));
  room2 = List(convertTalkList(JSON.parse(rawRoom2)));
}

function getCurrentTalkIndex(talks): number {
  const currentDate = new Date();
  return talks.findIndex(t => currentDate >= t.date && currentDate <= t.date.clone().add(t.duration));
}

export async function currentTalk(roomId: number|string): Promise<?Talk> {
  let talks = roomId == 1 ? room1 : room2;
  if (talks.size <= 0) {
    await getFahrplan();
    talks = roomId == 1 ? room1 : room2;
  }
  const talkIndex = getCurrentTalkIndex(talks);
  if (talkIndex !== -1) {
    return talks.get(talkIndex);
  }
}

export async function nextTalk(roomId: number): Promise {
  let talks = roomId == 1 ? room1 : room2;
  if (talks.size <= 0) {
    await getFahrplan();
    talks = roomId == 1 ? room1 : room2;
  }
  const talkIndex = getCurrentTalkIndex(talks) + 1;
  if (talkIndex < talks.size) {
    return talks.get(talkIndex);
  }
}
