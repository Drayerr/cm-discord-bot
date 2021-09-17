const ytdl = require('ytdl-core')
const { joinVoiceChannel } = require('@discordjs/voice')

const queue = new Map()

module.exports = async function play(message, args) {

	try {
		const serverQueue = queue.get(message.guild.id)
		const voiceChannel = message.member.voice.channel

		console.log('args', args);

		if (!args || args.length < 1) {
			return message.reply('Coloca um link aí Cabrón')
		}

		if (!voiceChannel) {
			return message.reply('Entra na call corno')
		}

		console.log('tem voice channel')

		const permissions = voiceChannel.permissionsFor(message.client.user)

		console.log(permissions, permissions.has("CONNECT"), permissions.has("SPEAK"))

		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {

			console.log('não tem permissão')

			return message.channel.send(
				"Me deixa hablar no canal please!"
			)
		}

		const songInfo = await ytdl.getInfo(args[0])
		const song = {
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url
		}

		if (!serverQueue) {
			// Creating the contract for our queue
			const queueContract = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 5,
				playing: true,
			}

			queue.set(message.guild.id, queueContract)
			// Pushing the song to our songs array
			queueContract.songs.push(song)

			//Try to join the voiceChat and save our connection into our object.
			try {
				var connection = await joinVoiceChannel({
					channelId: message.member.voice.channel.id,
					guildId: message.guild.id,
					adapterCreator: message.guild.voiceAdapterCreator
				})
				queueContract.connection = connection
				// Calling the play function to start a song
				playSong(message.guild, queueContract.songs[0])
				// Setting the queue using our contract
			} catch (err) {
				console.log(err);
				// Delete the queue if the bot cant join chat
				queue.delete(message.guild.id)
				return message.channel.send(err)
			}

			
		} else {
			serverQueue.songs.push(song)
			return message.channel.send(`${song.title} vou tocar essa bagaça!`)
		}

		function playSong(guild, song) {
			try {
				const serverQueue = queue.get(guild.id)
				console.log("AAAAAAA", serverQueue);
				// If the playlist is empty, leave chanel and delete queue
				if (!song) {
					serverQueue.voiceChannel.leave()
					queue.delete(guild.id)
					return
				}
			} catch (err) {
				console.log('playSong')
			}
	
			const dispatcher = serverQueue.connection
				.play(ytdl(song.url))
				.on("finish", () => {
					serverQueue.songs.shift()
					playSong(guild, serverQueue.songs[0])
				})
				.on("error", error => console.log(error))
	
			dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
			serverQueue.textChannel.send(`Start playing: **${song.title}**`)
		}


		message.reply(`${voiceChannel}`)

	} catch (err) {
		console.log('err', err)
	}
}