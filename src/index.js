require('dotenv').config()
const { Client, Intents } = require('discord.js')
const GetCommand = require('./controllers/commandController')

const token = process.env.BOT_TOKEN

try {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

  client.on("message", GetCommand)

  client.once('ready', () => {
    console.log('Ready!');
  });
  client.once('reconnecting', () => {
    console.log('Reconnecting!');
  });
  client.once('disconnect', () => {
    console.log('Disconnect!');
  });
  
  client.login(token)
  
  module.exports = client

} catch(err) {
  console.log(err);
}