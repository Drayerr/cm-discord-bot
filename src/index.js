const { Client, Intents } = require('discord.js')
require('dotenv').config()
const token = process.env.BOT_TOKEN

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

const prefix = '$'

client.on("message", function(message) {
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
    message.reply(`Pong! ${args}`)
  }
})

client.login(token)