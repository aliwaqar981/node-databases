/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */

const Redis = require('ioredis');
const CoinAPI = require('../CoinAPI');

class RedisBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.client = null;
  }

  async connect() {
    this.client = new Redis(7379);
    return this.client;
  }

  async disconnect() {
    this.client.disconnect();
  }

  async insert() {
    const response = await this.coinAPI.fetch();
    const values = [];

    response.data.forEach((element) => {
      values.push(element);
    });

    return this.client.zadd(
      'maxcoin:values',
      1,
      'one',
      2,
      'dos',
      4,
      'quatro',
      3,
      'three'
    );
    // return this.client.zadd('maxcoin:values', values);
  }

  async getMax() {
    return this.client.zrange(
      'maxcoin:values',
      -1,
      -1,
      'WITHSCORES',
      (elements) => {
        console.log('Respo>>>>:', elements);
      }
    );
  }

  async max() {
    console.log('Connection to Redis');
    console.time('redis-connect');
    const client = this.connect();

    if (client) {
      console.info('Successfull connected to Redis');
    } else {
      throw new Error('Connecting to Redis Failed');
    }
    console.timeEnd('redis-connect');

    console.info('Inserting into Redis');
    console.time('redis-insert');
    const insertedResults = await this.insert();
    console.timeEnd('redis-insert');

    console.info(`Inserted ${insertedResults} documents into Redis`);

    console.info('Querying from Redis');
    console.time('redis-find');
    const result = await this.getMax();
    console.timeEnd('redis-find');
    console.info(`Results: ${result}`);

    console.log('DisConnecting to Redis');
    console.time('redis-disconnect');
    await this.disconnect();
    console.timeEnd('redis-disconnect');

    return result;
  }
}

module.exports = RedisBackend;
