module.exports = function leave(message) {
    // Busca as usuários (member) que estão na sala que o usuário que digitou o comando está logado.
    // Mapeia os ids dos usuários que estão logados
    // Comparar se algum usuário mapeado tem o mesmo id do bot (arr.some)
    // Se sim, leave

    const botId = message.client.user.id
    const voiceChannel = message.member.voice.channel

    if (!voiceChannel) {
        return message.reply('Sair de onde meu Pajé? Tá loko?!')
    }

    const mappedUserList = voiceChannel.members.mapValues(member => member.user.id).values()
    const userList = Array.from(mappedUserList)

    if (!userList.some(userId => userId === botId)) {
        return message.reply('Vc deve estar no mesmo canal de voz que eu.')
    }

    voiceChannel.leave()
}