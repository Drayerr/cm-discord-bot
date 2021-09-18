
module.exports = function summon(message) {
  try {
    const voiceChannel  = message.member.voice.channel
    
    voiceChannel.join();

    return message.reply("Hola muchachos!")
  } catch (err) {
    console.log(err);
    return message.channel.send(err);
  }
}