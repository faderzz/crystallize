const mineflayer = require('mineflayer');
const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');
const Vec3 = require('vec3');
require('dotenv').config();

const username = process.env.email;
const password = process.env.password;
const server_address = process.env.server_address;

const db = new sqlite3.Database('chat_messages.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chat_messages database.');
  db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Created messages table if it did not exist.');
    });
});

const bot = mineflayer.createBot({
  host: server_address,
  username: username,
  password: password,
  version: false,
  auth: 'microsoft'
});

bot.once('spawn', () => {
  console.log(`Logged in as ${bot.username} on ${server_address}`);
  handleConsoleInput(bot);
});

bot.on('chat', (username, message) => {
  if (username === bot.username) {
    // Ignore messages sent by the bot itself
    return;
  }
  console.log(`${username}: ${message}`);
  saveChatMessageToDatabase(username, message);
});

bot.on('death', () => {
  console.log('Bot died.');
  bot.setControlState('jump', true);
  bot.respawn();
});

bot.on('respawn', () => {
  console.log('Bot respawned.');
  bot.setControlState('forward', true);
});

function handleConsoleInput(bot) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (input) => {
    if (input === '_logout') {
      console.log('Logging out...');
      db.close((err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Closed the chat_messages database.');
        bot.quit();
      });
    } else {
      bot.chat(input);
    }
  });
}

function saveChatMessageToDatabase(username, message) {
  db.run(`INSERT INTO messages (username, message) VALUES (?, ?)`, [username, message], (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log(`Saved chat message from ${username} to the database.`);
  });
}
