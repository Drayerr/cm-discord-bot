
module.exports = function summon(message) {
  try {
    const voiceChannel = message.member.voice.channel

    if (!voiceChannel) {
      return message.reply("Só entro se vc entrar primeiro.")
    }

    voiceChannel.join();

    return message.reply("Hola muchachos!")
  } catch (err) {
    console.log(err);
    return message.channel.send(err);
  }
}