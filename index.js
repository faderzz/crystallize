const mineflayer = require('mineflayer');
require('dotenv').config()

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

bot.once('spawn', () => {
  console.log(`Logged in as ${bot.username} on ${server_address}`);
  antiAfk(bot);
});

function antiAfk(bot) {
    setInterval(() => {
      const rand = Math.floor(Math.random() * 10);
      if (rand < 5) {
        bot.setControlState('forward', true);
      } else {
        bot.clearControlStates();
      }
      if (rand === 0) {
        bot.setControlState('jump', true);
        setTimeout(() => {
          bot.setControlState('jump', false);
        }, 500);
      }
    }, 5 * 60 * 1000);
  }
  