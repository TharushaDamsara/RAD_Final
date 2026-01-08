
import dotenv from 'dotenv';
import path from 'path';

// Load from .env explicitly
const result = dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log('Dotenv parsed:', result.parsed);
console.log('process.env.FRONTEND_URL:', process.env.FRONTEND_URL);
