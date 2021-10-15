const ytdl = require("ytdl-core");
const yts = require("yt-search")

const prefix = '$'

module.exports = function play(message) {

	const queue = new Map()

	// Verify prefix, and if author is another bot
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	// Add msg with command to queue of server
	const serverQueue = queue.get(message.guild.id);

	if (message.content.startsWith(`${prefix}play`)) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}skip`)) {
		skip(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${prefix}stop`)) {
		stop(message, serverQueue);
		return;
	} else {
		message.channel.send("You need to enter a valid command!");
	}

	async function execute(message, serverQueue) {
		const args = message.content.split(" ");

		const voiceChannel = message.member.voice.channel;

		// Verify channel of caller and if bot have permitions
		if (!voiceChannel)
			return message.channel.send(
				"You need to be in a voice channel to play music!"
			);
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
			return message.channel.send(
				"I need the permissions to join and speak in your voice channel!"
			);
		}

		const isValidURL = ytdl.validateURL(args[1])
		let song = {}

		if (isValidURL) {
			// Getting information of song from youtube link
			const songInfo = await ytdl.getInfo(args[1]);
			song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url,
			}

		} else {
			args.shift()
			args.push('oficial music audio')
			const newArgs = [...args].join(', ')

			const searchSong = await yts(newArgs)
			song = {
				title: searchSong.all[0].title,
				url: searchSong.all[0].url
			}
		}
	
		console.log(song);

		if (!serverQueue) {
			console.log("não tem server queue");
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 3,
				playing: true
			};

			// Add Guild ID and queueContruct to queue map
			queue.set(message.guild.id, queueContruct);

			// Add song at songs array of queue
			queueContruct.songs.push(song);

			// Joining voice channel
			try {
				var connection = await voiceChannel.join();
				queueContruct.connection = connection;
				play(message.guild, queueContruct.songs[0]);
			} catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		} else {
			serverQueue.songs.push(song);
			return message.channel.send(`${song.title} has been added to the queue!`);
		}
	}

	function skip(message, serverQueue) {
		if (!message.member.voice.channel)
			return message.channel.send(
				"You have to be in a voice channel to stop the music!"
			);
		if (!serverQueue)
			return message.channel.send("There is no song that I could skip!");
		serverQueue.connection.dispatcher.end();
	}

	function stop(message, serverQueue) {
		if (!message.member.voice.channel)
			return message.channel.send(
				"You have to be in a voice channel to stop the music!"
			);

		if (!serverQueue)
			return message.channel.send("There is no song that I could stop!");

		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
	}

	function play(guild, song) {
		const serverQueue = queue.get(guild.id);
		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}

		const dispatcher = serverQueue.connection
			.play(ytdl(song.url))
			.on("finish", () => {
				serverQueue.songs.shift();
				play(guild, serverQueue.songs[0]);
			})
			.on("error", error => console.error(error));
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		serverQueue.textChannel.send(`Start playing: **${song.title}**`);
	}
}