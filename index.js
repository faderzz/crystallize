const mineflayer = require('mineflayer');
const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;
const { Markov } = require('markov-strings-db');
require('dotenv').config();

const username = process.env.email;
const password = process.env.password;
const server_address = process.env.server_address;
const mongo_url = process.env.mongo_url;

let chatCollection;

const client = new MongoClient(mongo_url);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db("minecraft").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

db = client.db('minecraft');
chatCollection = db.collection('chat');

const bot = mineflayer.createBot({
  host: server_address,
  username: username,
  password: password,
  version: false,
  auth: 'microsoft'
});

// Function to generate message using markov chains
async function generate() {
  const options = { stateSize: 2, order: 'sequence', maxTries: 100, prng: Math.random };
  const markov = new Markov(options);
  
  // Retrieve all chat messages from MongoDB
  const cursor = chatCollection.find({});
  const docs = await cursor.toArray();

  // Add all chat messages to the Markov model
  markov.addData(docs.map(doc => doc.message));

  // Generate a new message
  const sentence = await markov.generate();

  return sentence.string;
}

// Bot Login
bot.once('spawn', () => {
  console.log(`Logged in as ${bot.username} on ${server_address}`);
  handleConsoleInput(bot);
  bot.chat('/kill');
  bot.setControlState('forward', true);
  bot.setControlState('jump', true);
  bot.setControlState('sneak', true);
});

// Bot Respawn - Anti AFK check
bot.on('respawn', () => {
  bot.setControlState('forward', true);
  bot.setControlState('left', true);
  bot.setControlState('jump', true);
  bot.setControlState('sneak', true);
});

// Bot Chat
bot.on('chat', async (username, message) => {
  if (username !== bot.username) {
    chatCollection.insertOne({ username, message }, (err) => {
      if (err) throw err;
    });

    if (username === 'Rgos' && message === '_logout') {
      console.log('Exiting program and closing database...');
      bot.quit();
      process.exit(0);
    } else if (message === '_kill') {
      bot.chat('/kill');
      console.log('Killed bot');
    } else if (message === '_generate') {
      const sentence = await generate();
      bot.chat(sentence);
      console.log(sentence);
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