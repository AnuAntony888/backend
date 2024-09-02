// const mysql = require("mysql");

// // const dbConfig = {
// //   host: 'localhost',
// //   user: 'root',
// //   password: 'kzLVN9bMAX/!Ym1h',
// //   database: 'mydatabase'
// // };

// const dbConfig = {
//   host: 'localhost',

//   user: 'vedahtee_smartbilling',
  // password: "CezmHV6qQ6}H",
//   database: 'vedahtee_smartbilling',

// }
// let connection;

// function handleDisconnect() {
//   connection = mysql.createConnection(dbConfig);

//   connection.connect((err) => {
//     if (err) {
//       console.error("Error connecting to database:", err);
//       setTimeout(handleDisconnect, 2000);
//     } else {
//       console.log("Connected to the database.");
//     }
//   });

//   connection.on("error", (err) => {
//     console.error("Database error:", err);
//     if (err.code === "PROTOCOL_CONNECTION_LOST") {
//       handleDisconnect();
//     } else {
//       throw err;
//     }
//   });
// }

// handleDisconnect();

// module.exports = {
//   query: (sql, params, callback) => {
//     if (connection.state === 'disconnected') {
//       handleDisconnect();
//     }
//     connection.query(sql, params, callback);
//   },
//   getConnection: () => connection,
//   end: (callback) => {
//     if (connection) {
//       connection.end(callback);
//     }
//   }
// };
require('dotenv').config(); // Load environment variables from .env file

const mysql = require('mysql');

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      setTimeout(handleDisconnect, 10000); // Retry after 2 seconds
    } else {
      console.log('Connected to the database.');
    }
  });

  connection.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect
    } else {
      throw err;
    }
  });
}

// Start the connection handling
handleDisconnect();

// Handle termination signals to close the connection gracefully
process.on('SIGINT', () => {
  if (connection) {
    connection.end((err) => {
      if (err) {
        console.error('Error closing the connection:', err);
      } else {
        console.log('Database connection closed.');
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

module.exports = {
  query: (sql, params, callback) => {
    if (!connection || connection._closing) {
      handleDisconnect();
    }
    connection.query(sql, params, callback);
  },
  getConnection: () => connection,
  end: (callback) => {
    if (connection) {
      connection.end(callback);
    }
  },
};
