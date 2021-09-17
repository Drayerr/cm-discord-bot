const banana = require("../commands/banana")
const ping = require("../commands/ping")
const play = require("../commands/play")

const prefix = '$'

module.exports = function (message) {
  //verifica se quem escreveu não é um bot
  if (message.author.bot) return
  //verificando se começa com o prefixo
  if (!message.content.startsWith(prefix)) return

  //separa o prefixo do comando
  const commandBody = message.content.slice(prefix.length)
  //separa o comando dos argumentos em um array[]
  const args = commandBody.split(' ')
  //formata o commando para lowercase
  const command = args.shift().toLocaleLowerCase()

  if (command === "ping") {
    ping(message, args)
  }

  if (command === "banana") {
    banana(message)
  }

  if (command === "play") {
    play(message, args)
  }
}