/*jslint esversion: 8 */

const Discord = require('discord.js');
const dotenv = require('dotenv').load();
const Enmap = require("enmap");
const fs = require("fs");

const checkStatus = require('./modules/check-status');

const client = new Discord.Client();

const botConfig = {
    "prefix": process.env.BOT_PREFIX,
    "token": process.env.BOT_TOKEN,
    "status-channel": process.env.STATUS_CHANNEL,
    "log-channel": process.env.LOG_CHANNEL,
    "pingURL": process.env.PING_URL,
    "checkName": process.env.CHECK_NAME,
    "checkTime": process.env.CHECK_TIME * 1000
};
client.config = botConfig;

const logger = require("./modules/logger");
client.logger = logger;

client.on('error', console.error);

client.on('ready', () => {
    logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers, while running in ${env}. My prefix is ${botConfig.prefix}`, "ready");
    setInterval(() => {
        checkStatus(client);
    }, botConfig.checkTime);
});


fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    });
  });
  
  client.commands = new Enmap();
  
  fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      let props = require(`./commands/${file}`);
      let commandName = file.split(".")[0];
      console.log(`Attempting to load command ${commandName}`);
      client.commands.set(commandName, props);
    });
  });

  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);   
  });

client.login(botConfig.token);