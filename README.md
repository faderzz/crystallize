
# Crystallize
A Minecraft chatbot that can generate messages using Markov chains.

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Rename `.env.example` to `.env` and add your Minecraft's Microsoft account email, password, server address, and MongoDB URL in the following format:

    ```email=YOUR_EMAIL```
    ```password=YOUR_PASSWORD```
    ```server_address=YOUR_SERVER_ADDRESS```
    ```mongo_url=YOUR_MONGO_URL```

4. Start the program with `node index.js`

## Usage

The bot will join the specified Minecraft server and start listening to chat messages. When the bot receives a message that matches a specific command, it will perform a certain action:

- `_kill`: Kills the bot
- `_generate`: Generates a new message using Markov chains based on the chat messages stored in the MongoDB database
- `_logout`: Exits the program and closes the database

You can also type messages in the console, and the bot will send them to the server.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
