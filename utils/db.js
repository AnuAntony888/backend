
const mysql = require('mysql');

const dbConfig = {
  host: 'localhost', // Use 'localhost' if IPv6 is not configured
  user: 'root',   // Update with your MySQL username
  password: 'kzLVN9bMAX/!Ym1h', // Update with your MySQL password
  database: 'mydatabase' // Update with your database name
};
let connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      setTimeout(handleDisconnect, 2000); // Retry after 2 seconds
    }
  });

  connection.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect on connection lost error
    } else {
      throw err; // Other errors
    }
  });
}

handleDisconnect();

module.exports = connection;