const ytdl = require('ytdl-core')
const { joinVoiceChannel } = require('@discordjs/voice')

const queue = new Map()

module.exports = async function play(messageCreate, args) {

	

	try {
		const serverQueue = queue.get(messageCreate.guild.id)
		const voiceChannel = messageCreate.member.voice.channel

		console.log('args', args);

		if (!args || args.length < 1) {
			return messageCreate.reply('Coloca um link aí Cabrón')
		}

		if (!voiceChannel) {
			return messageCreate.reply('Entra na call corno')
		}

		console.log('tem voice channel')

		const permissions = voiceChannel.permissionsFor(messageCreate.client.user)

		console.log(permissions, permissions.has("CONNECT"), permissions.has("SPEAK"))

		if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {

			console.log('não tem permissão')

			return messageCreate.channel.send(
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
				textChannel: messageCreate.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 5,
				playing: true,
			}

			queue.set(messageCreate.guild.id, queueContract)
			// Pushing the song to our songs array
			queueContract.songs.push(song)

			//Try to join the voiceChat and save our connection into our object.
			try {
				var connection = await joinVoiceChannel({
					channelId: messageCreate.member.voice.channel.id,
					guildId: messageCreate.guild.id,
					adapterCreator: messageCreate.guild.voiceAdapterCreator
				})
				queueContract.connection = connection
				// Calling the play function to start a song
				playSong(messageCreate.guild, queueContract.songs[0])
				// Setting the queue using our contract
			} catch (err) {
				console.log(err);
				// Delete the queue if the bot cant join chat
				queue.delete(messageCreate.guild.id)
				return messageCreate.channel.send(err)
			}

			
		} else {
			serverQueue.songs.push(song)
			return messageCreate.channel.send(`${song.title} vou tocar essa bagaça!`)
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


		messageCreate.reply(`${voiceChannel}`)

	} catch (err) {
		console.log('err', err)
	}
}