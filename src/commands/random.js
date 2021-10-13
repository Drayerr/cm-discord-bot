module.exports = function random(message) {
  const voiceChannel = message.member.voice.channel

  if (!voiceChannel) {
    return message.reply('Entre em call para executar esse comando.')
  }

  const usernamesMap = voiceChannel.members.mapValues(member => member.user.username).values()

  const usernames = Array.from(usernamesMap)

  const randomNumber = Math.floor(Math.random() * usernames.length)

  return message.reply('Parabéns @' + usernames[randomNumber] + ', vc foi o sorteado.')
}