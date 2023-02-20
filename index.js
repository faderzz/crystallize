const mineflayer = require('mineflayer');
const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const username = process.env.email;
const password = process.env.password;
const server_address = process.env.server_address;
const mongo_url = process.env.mongo_url;

let chatCollection;

MongoClient.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  const db = client.db('minecraft');
  chatCollection = db.collection('chat');
});

const bot = mineflayer.createBot({
  host: server_address,
  username: username,
  password: password,
  version: false,
  auth: 'microsoft'
});

// Bot Login

bot.once('spawn', () => {
  console.log(`Logged in as ${bot.username} on ${server_address}`);
  handleConsoleInput(bot);
  bot.setControlState('forward', true)
  bot.setControlState('jump', true)
  bot.setControlState('sneak', true)
});

// Bot Respawn - Anti AFK check
bot.on('respawn', () => {
  bot.setControlState('forward', true)
  bot.setControlState('jump', true)
  bot.setControlState('sneak', true)
});

// Bot Chat
bot.on('chat', (username, message) => {
    if (username !== bot.username) {
      chatCollection.insertOne({ username, message, timestamp: new Date() }, (err) => {
        if (err) throw err;
      });
      if (username === 'Rgos' && message === '_logout') {
        console.log('Exiting program and closing database...');
        chatCollection = null;
        bot.quit();
        process.exit(0);
      } else if (message === '_count' && username === 'Rgos') {
        chatCollection.countDocuments((err, count) => {
          if (err) throw err;
          bot.chat(`There are ${count} chat entries.`);
        });
      }
    }
  });

// Console chat input
function handleConsoleInput(bot) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (input) => {
    bot.chat(input);
  });
}
