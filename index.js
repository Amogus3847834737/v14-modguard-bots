const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember] });
const config = require("./src/config.js");
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const token = process.env['MTE0NTM0ODU5MzYxNjcwMzUwOA.Gf3J2X.IT3OqjdvUDsIJqqWcSxbh82v3RerT2V3npqgos']

client.commands = new Collection()
client.slashcommands = new Collection()
client.commandaliases = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const log = x => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`) };

//command-handler
const commands = []
readdirSync('./src/commands/normal').forEach(async file => {
  const command = await require(`./src/commands/normal/${file}`);
  if (command) {
    client.commands.set(command.name, command)
    commands.push(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias => {
        client.commandaliases.set(alias, command.name)
      })
    }
  }
})

//slash-command-handler
const slashcommands = [];
readdirSync('./src/commands/slash').forEach(async file => {
  const command = await require(`./src/commands/slash/${file}`);
  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
})

client.on("ready", async () => {
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashcommands },
    );
  } catch (error) {
    console.error(error);
  }
  log(`${client.user.username} Aktif Edildi!`);
})

//event-handler
readdirSync('./src/events').forEach(async file => {
  const event = await require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
})

//nodejs-events
process.on("unhandledRejection", e => {
  console.log(e)
})
process.on("uncaughtException", e => {
  console.log(e)
})
process.on("uncaughtExceptionMonitor", e => {
  console.log(e)
})
//

const express = require("express");
const app = express();

app.listen(process.env.PORT);
app.get("/", (req, res) => {
  return res.sendStatus(200)
})

////////////////////KOMUTLAR////////////////////
////////////////////KOMUTLAR////////////////////
////////////////////KOMUTLAR////////////////////



////////////////////KOMUTLAR////////////////////
////////////////////KOMUTLAR////////////////////
////////////////////KOMUTLAR////////////////////

client.on('guildMemberAdd', member => {
  const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannelId);
  if (!welcomeChannel || welcomeChannel.type !== 'GUILD_TEXT') return;

  const welcomeMessage = config.welcomeMessage.replace('{user}', `<@${member.id}>`);

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Hoş Geldiniz!')
    .setDescription(welcomeMessage);

  welcomeChannel.send({ embeds: [embed] });
});

client.on('guildMemberRemove', member => {
  const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannelId);
  if (!welcomeChannel || welcomeChannel.type !== 'GUILD_TEXT') return;

  const goodbyeMessage = config.goodbyeMessage.replace('{user}', member.user.tag);

  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle('Görüşürüz!')
    .setDescription(goodbyeMessage);

  welcomeChannel.send({ embeds: [embed] });
});


client.login(config.token)
