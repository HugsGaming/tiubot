require('dotenv').config();

const { Client, Intents } = require('discord.js');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});
const prefix = 'tiu!'

client.once('ready', () => {
    console.log('Ready for Use');
});

client.on('messageCreate', (message) => {
    if(message.content.startsWith(prefix)) {
        const [cmd, ...args] = message.content
        .trim()
        .substring(prefix.length)
        .split(/\s+/);
        console.log(cmd, args);

        if(cmd === 'signofthecross') {
            message.channel.send('In the name of filter(), map(), and reduce(). Amen!');
        } else if (cmd === 'react') {
            message.channel.send('React is the best library! Unstar Angular! https://reactjs.org/');
        }
    }
});

client.login(process.env.TOKEN);