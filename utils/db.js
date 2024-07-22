
const mysql = require("mysql");

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'kzLVN9bMAX/!Ym1h',
  database: 'mydatabase'
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to database:", err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("Connected to the database.");
    }
  });

  connection.on("error", (err) => {
    console.error("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = {
  query: (sql, params, callback) => {
    if (connection.state === 'disconnected') {
      handleDisconnect();
    }
    connection.query(sql, params, callback);
  },
  getConnection: () => connection
};
