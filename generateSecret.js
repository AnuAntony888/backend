const crypto = require('crypto');

// Generate a strong secret key
const secretKey = crypto.randomBytes(64).toString('hex');

// Print the secret key to the console
console.log(secretKey);
