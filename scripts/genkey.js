import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import jwt from 'jsonwebtoken';
import readlineSync from 'readline-sync';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('Missing JWT_SECRET in .env.local');
    process.exit(1);
}

const name = readlineSync.question('Enter name: ').trim();
if (!name) {
    console.error('Name cannot be empty.');
    process.exit(1);
}

const units = ['minutes', 'hours', 'days', 'weeks', 'months'];
const unitShort = { minutes: 'm', hours: 'h', days: 'd', weeks: 'w', months: '30d' };

const unitIndex = readlineSync.keyInSelect(units, 'Select expiration unit:');
if (unitIndex === -1) {
    console.error('Cancelled.');
    process.exit(1);
}

const unit = units[unitIndex];
const short = unitShort[unit];

let amount = readlineSync.questionInt(`Enter number of ${unit}: `);
if (amount <= 0) {
    console.error('Value must be greater than 0.');
    process.exit(1);
}

const expiresIn = unit === 'months' ? `${30 * amount}d` : `${amount}${short}`;
const payload = { name };

const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

console.log('\nGenerated JWT:');
console.log(token);
