const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
// const db = knex({
//   client: 'pg',
//   version: '7.2',
//   connection: {
//     host: '127.0.0.1',
//     user: 'postgres',
//     password: 'greatcjiano91',
//     database: 'smart-brain'
//   }
// });

module.exports = db;
