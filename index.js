const mineflayer = require('mineflayer');
const readline = require('readline');
const Vec3 = require('vec3');
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

function walkForward(bot, distance) {
    const mcData = require('minecraft-data')(bot.version);
    const movements = new Movements(bot, mcData);
    
    const dest = bot.entity.position.offset(0, 0, distance);
    bot.pathfinder.setMovements(movements);
    bot.pathfinder.setGoal(new GoalBlock(dest.x, dest.y, dest.z));
  }

bot.once('spawn', () => {
  console.log(`Logged in as ${bot.username} on ${server_address}`);
  walkForward(bot, 5);
  handleConsoleInput(bot);
  bot.setControlState('jump', true)
  bot.setControlState('sneak', true)
});

bot.on('respawn', () => {
    // Walk 5 blocks forward on respawn
    walkForward(bot, 5);
    bot.setControlState('jump', true)
    bot.setControlState('sneak', true)
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
