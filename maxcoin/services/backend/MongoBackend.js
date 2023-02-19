/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const { MongoClient } = require('mongodb');
const CoinAPI = require('../CoinAPI');

class MongoBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.mongoURL = 'mongodb://localhost:37017/maxcoin';
    this.client = null;
    this.collection = null;
  }

  async connect() {
    const client = new MongoClient(this.mongoURL);
    try {
      // Connect the client to the server (optional starting in v4.7)
      this.client = await client.connect();
      // Establish and verify connection
      this.collection = client.db('maxcoin').collection('users');
      console.log('Connected successfully to server');
    } finally {
      // Ensures that the client will close when you finish/error
      console.log('DisConnecting to MongoDB');
      console.time('mongodb-disconnect');
      // await client.close();
      console.timeEnd('mongodb-disconnect');
    }
  }

  async disconnect() {
    if (this.client) {
      return this.client.close();
    }
    return false;
  }

  async insert() {
    const response = await this.coinAPI.fetch();
    const documents = [];

    response.data.forEach((element) => {
      documents.push(element);
    });

    return this.collection.insertMany(documents);
  }

  async getMax() {
    return this.collection.findOne({}, { sort: { id: 1 } });
  }

  async max() {
    console.log('Connection to MongoDB');
    console.time('mongodb-connect');
    await this.connect();
    console.timeEnd('mongodb-connect');

    console.info('Inserting into MongoDB');
    console.time('mongodb-insert');
    const insertedResults = await this.insert();
    console.timeEnd('mongodb-insert');
    console.info(
      `Inserted ${insertedResults.insertedCount} documents into MongoDB`
    );

    console.info('Querying from MongoDB');
    console.time('mongodb-query');
    const doc = await this.getMax();
    console.timeEnd('mongodb-query');
    console.info(`Doc: ${doc}`);

    console.log('DisConnecting to MongoDB');
    console.time('mongodb-disconnect');
    await this.disconnect();
    console.timeEnd('mongodb-disconnect');

    return {
      name: `${doc.first_name} ${doc.last_name}`,
      id: doc.id,
    };
  }
}

module.exports = MongoBackend;
