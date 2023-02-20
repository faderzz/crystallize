const mineflayer = require('mineflayer');
const readline = require('readline');
const Vec3 = require('vec3');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const username = process.env.email;
const password = process.env.password;
const server_address = process.env.server_address;

const bot = mineflayer.createBot({
  host: server_address,
  username: username,
  password: password,
  version: false,
  auth: 'microsoft'
});

const db = new sqlite3.Database('chatlog.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the chatlog database.');
    db.run('CREATE TABLE IF NOT EXISTS chatlog (timestamp INTEGER, username TEXT, message TEXT)');
  }
});

bot.once('spawn', () => {
  console.log(`Logged in as ${bot.username} on ${server_address}`);
  handleConsoleInput(bot);
  bot.setControlState('forward', true)
  bot.setControlState('jump', true)
  bot.setControlState('sneak', true)
});

bot.on('respawn', () => {
  bot.setControlState('forward', true)
  bot.setControlState('jump', true)
  bot.setControlState('sneak', true)
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  db.run('INSERT INTO chatlog (timestamp, username, message) VALUES (?, ?, ?)', [Date.now(), username, message], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Saved chat message from ${username}: ${message}`);
    }
  });
});

function handleConsoleInput(bot) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (input) => {
    bot.chat(input);
  });
}
