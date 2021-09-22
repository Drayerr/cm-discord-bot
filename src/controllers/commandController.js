const ping = require("../commands/ping")
const onCallMembers = require("../commands/onCallMembers")
const play = require("../commands/play")
const summon = require("../commands/summon")
const leave = require("../commands/leave")
const random = require("../commands/random")

const prefix = '$'

module.exports = function (message) {
  console.log('recebeu a msg');
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
  if (command === "play") {
    play(message, args)
  }
  if (command === "oncall") {
    onCallMembers(message)
  }
  if (command === "summon") {
    summon(message)
  }
  if (command === "leave") {
    leave(message)
  }
  if (command === "random") {
    random(message)
  }
}