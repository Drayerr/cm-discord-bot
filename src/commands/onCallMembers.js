module.exports = function onCallMembers(message) {
  const voiceChannel = message.member.voice.channel

  const usernamesMap = voiceChannel.members.mapValues(member => member.user.username).values()

  const usernames = Array.from(usernamesMap)

  const st = [...usernames].join(',\n- ')

  message.reply(`Otakus fedidos na call: \n- ${st}`)
}