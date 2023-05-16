
# Crystallize
A Minecraft chatbot that can generate messages using Markov chains.
Made for 0b0t.org

<img width="769" alt="image" src="https://github.com/faderzz/crystallize/assets/58748338/1f90fab0-f29a-4d79-b897-7b1640d40436">


## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Rename `.env.example` to `.env` and add your Minecraft's Microsoft account email, password, server address, and MongoDB URL in the following format:

    ```
    email=YOUR_EMAIL
    password=YOUR_PASSWORD
    server_address=YOUR_SERVER_ADDRESS
    mongo_url=YOUR_MONGO_URL
    ```

4. Start the program with `node index.js`

## Usage

The bot will join the specified Minecraft server and start listening to chat messages. When the bot receives a message that matches a specific command, it will perform a certain action:

- `_kill`: Kills the bot
- `_generate`: Generates a new message using Markov chains based on the chat messages stored in the MongoDB database
- `_logout`: Exits the program and closes the database

You can also type messages in the console, and the bot will send them to the server.

## Roadmap

 - [x] ~~Implement commands~~
 - [x] ~~Implement anti-afk.~~
 - [x] ~~Implement Microsoft Auth~~
 - [x] ~~Implement working Markov Chain generation~~
 - [x] ~~Implement MongoDB support~~
 - [x] ~~Implement auto-generation~~
 - [ ] Completely rewrite the bot.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
