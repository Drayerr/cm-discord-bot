const { joinVoiceChannel } = require('@discordjs/voice')

module.exports = function summon(message) {
  message.reply('Comando em manutenção')
  // try {
  //   joinVoiceChannel({
  //     channelId: message.member.voice.channel.id,
  //     guildId: message.guild.id,
  //     adapterCreator: message.guild.voiceAdapterCreator
  //   })

  //   message.reply('Hola muchachos!')
  // } catch (err) {
  //   console.log(err);
  // }
}