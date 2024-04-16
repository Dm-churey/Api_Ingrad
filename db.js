const {Pool} = require('pg')
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "123456",
    port: 5432,
    database: "ingrad_transport"
})

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log('Time:', res.rows[0]);
//   pool.end();
// });

module.exports = pool