require('dotenv').config();
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');

const { Client, Intents, MessageEmbed, Permissions, ClientVoiceManager } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');


const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS], });
const prefix = 'tiu!'

const queue = new Map();

client.once('ready', () => {
    console.log('Ready for Use');
});

client.on('messageCreate', async (message) => {
    if(message.author.bot) {
        return;
    }
    if(message.content.startsWith(prefix)) {
        const [cmd, ...args] = message.content
        .trim()
        .substring(prefix.length)
        .split(/\s+/);
        console.log(cmd, args);

        const serverQueue = queue.get(message.guild.id);

        if(cmd === 'signofthecross') {
            return message.reply('In the name of filter(), map(), and reduce(). Amen!');
        } else if (cmd === 'react') {
            return message.reply('React is the best library! Unstar Angular! https://reactjs.org/');
        } else if (cmd === 'haskell') {
            return message.reply(
            `Our Haskell, who art in binary, 
            hallowed be thy type system,
            thy monoids come,
            thy will be done,
            on VSCode as it is in emacs
            Give us this day our daily recursion
            and forgive us our side effects and infinite loops
            and lead us not into imperative languages,
            but deliver us from mutation,
            for thine is the type-system and the monoids
            and the pure functions, forever. Amen`);
        } else if (cmd === 'help') {
            const embed = new MessageEmbed({
                title: 'Help Message'
            })
            message.channel.send({embeds: [embed]});
        } else if (cmd === 'introduce') {

        } else if (cmd === 'ask') {
            if(message.content.toLowerCase().includes('python')) {
                message.reply('No! Python is shit');
            }
        } else if (cmd === 'prayer') {
            message.reply(`I believe in sir Tiu, the father, creator of statistics and code.
            He was conceived by the power of Python, born with C# with the
            Passion and Practicality of the subject. He suffered on the incompetence
            of his disciples, was stressed and was drained by the evil Fat Yoshi.
            But he never gave up, he rose through the ruins of their incompetence.
            He is sited on his throne and will judge our codes through the end of
            the semester.I believe in Elmo, the holy church of Tiu, the communion of
            his knowledge stored in his stomach, the forgiveness of bad code, the spread
            of his words and image, and life everlasting, Amen.`)
        } else if(cmd === 'play') {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channelId,
                guildId: message.guildId,
                adapterCreator: message.guild.voiceAdapterCreator
            });
            const player = createAudioPlayer();
            const resource = createAudioResource('./Communism.mp3');
            player.play(resource);
            connection.subscribe(player);
        }
        
    }

    // if(message.author.id === '337885599069372416') {
    //     message.delete();
    //     console.log('Miguel is Gay!');
    // }
});

async function execute(message, args, serverQueue) {
    const voiceChannel = message.member.voice.channel;
    if(!voiceChannel) {
        return message.reply(`I can't play you if you are outside.`);
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.reply(`Give me perms, my childrend!`);
    }

    const songInfo = await ytdl.getInfo(args[0]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if(!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            const connection = await message.member;
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (err) {
            console.error(err);
            queue.delete(message.guild.id);
            return message.reply(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.reply(`${song.title} has been added to the queue!`);
    }

}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if(!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
    .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs.songs[0]);
    }).on("error", err => console.error(err));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing **${song.title}**`);
}

client.login(process.env.TOKEN);