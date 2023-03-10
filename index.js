const mineflayer = require('mineflayer');
const readline = require('readline');
const MongoClient = require('mongodb').MongoClient;
const Markov = require('markov-generator');
require('dotenv').config();

const username = process.env.email;
const password = process.env.password;
const server_address = process.env.server_address;
const mongo_url = process.env.mongo_url;

let chatCollection;

const client = new MongoClient(mongo_url);

filtered_words = ['join', 'shop', 'store', 'buy', 'sell', 'kit', 'giveaway', 'kits', '_kill', '_ignore', 'discord', 'website', 'vote']

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

// Store all chat messages from collection as an array
async function getChat() {
  const cursor = chatCollection.find({}).project({message: 1, _id: 0});
  const docs = await cursor.toArray();
  // Remove {message: } from each object
  for (i = 0; i < docs.length; i++) {
    docs[i] = docs[i].message;
  }
  return docs;
}

// Function to generate message using markov chains
async function generate() {

  const options = { stateSize: 2, maxTries: 100, input: await getChat() };
  const markov = new Markov(options);
  
  // Retrieve all chat messages from MongoDB
  const cursor = chatCollection.find({});
  const docs = await cursor.toArray();

  // Generate a new message
  const sentence = markov.makeChain();

  return sentence;
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
    const containsBannedWord = filtered_words.some(word => message.toLowerCase().includes(word.toLowerCase()));
    if (containsBannedWord) {
      console.log(`Message from ${username} was not added to the database: it contained a banned word.`);
      return;
    }
    
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
    } else if (message === '_generate' || message === '_gen') {
      const sentence = await generate();
      bot.chat(": " + sentence);
      console.log(sentence);
    } else if (message.startsWith('_ignore ') && username === 'Rgos') {
      const targetUsername = message.split(' ')[1];
      bot.chat(`/ignore ${targetUsername}`);
      console.log(`Ignoring ${targetUsername}`);
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

// Generate every 20 seconds
setInterval(async () => {
  const sentence = await generate();
  bot.chat("> " + sentence);
  console.log(sentence);
}, 20000);