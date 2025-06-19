const crypto = require('crypto');

// Generate a strong 32-byte (256-bit) secret
const secret = crypto.randomBytes(32).toString('hex');

console.log('Generated JWT Secret:');
console.log(secret);
console.log('\nCopy this secret and replace it in your .env file under JWT_SECRET=');
