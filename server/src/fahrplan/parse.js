/* @flow */
import '../../../babelHelper';
import 'babel-regenerator-runtime';
import axios from 'axios';
import { redisClient } from '../Services/redis';

export async function isVersionNew(rawFahrplan: { version: string }): Promise<bool> {
  const version = await redisClient.getAsync('fahrplanVersion');
  return version !== rawFahrplan.version;
}

export async function parseFahrplan() {
  const fahrplan = await (axios.get('https://events.ccc.de/congress/2015/Fahrplan/schedule.json')).data.schedule;
  const newVersion = !await isVersionNew(fahrplan);
  if (newVersion) {
    throw 'Same Fahrplan Version';
  }
  

  await redisClient.set('fahrplanVersion', fahrplan.version);
}
