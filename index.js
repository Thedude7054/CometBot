/*jshint esversion: 6 */

const Discord = require('discord.js');
const request = require('request');
const dotenv = require('dotenv').load();
const Enmap = require("enmap");
const fs = require("fs");

const statusChange = require('./events/site-status-change');

const client = new Discord.Client();

const botConfig = {
    "prefix": process.env.PREFIX,
    "token": process.env.BOT_TOKEN,
    "status-channel": process.env.STATUS_CHANNEL,
    "log-channel": process.env.LOG_CHANNEL,
    "pingURL": process.env.PING_URL,
    "checkName": process.env.CHECK_NAME,
    "checkTime": process.env.CHECK_TIME * 1000
}
client.config = botConfig;

const checkStatus = require('./modules/checkStatus');
const alert = require('./modules/alert');

client.on('error', console.error);

// const pingURL = process.env.PING_URL;
// const checkName = process.env.CHECK_NAME;
// const checkTime = process.env.CHECK_TIME * 1000;

let status = null; // defining in global scope
const logger = require("./modules/Logger");


// function alert(options = {}) {
//     const {checkName , status, statusCode} = options;
//     var dmUsers = process.env.DM_USERS.split(' ');
//     console.log(`Users to Ping: ${dmUsers}`);
//     dmUsers.forEach(function(id){
//         client.users.get(id).createDM();           // ˅ ˅ ˅ ˅ Using process.env.CHECK_NAME because checkName returned undefined this works just as well
//         client.users.get(id).send(`**Service:** ${process.env.CHECK_NAME}\n**Status:** ${status}\n**Status Code:** ${statusCode}\n**Environment:** ${env}`);
//     });
// }

// function checkStatus(req, res) {
//     request({url : pingURL, time : true, stream : true}, function (error, response, body) {
//     if (!error && response.statusCode === 200) {
//             console.log("checking UP");
//             if (status === 'UP') { return; }
//             alert({ service : checkName, status : 'UP', statusCode : response.statusCode });
//             statusChange({client : client, status : 'UP'})
//             client.user.setActivity(`${checkName} is UP`, { type: 'WATCHING' })
//             .then((presence) => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
//             .catch(console.error);
//             status = 'UP';
//         } else {
//             console.log("checking DOWN");
//             if (status === 'DOWN') { return; }
//             alert({ service : checkName, status : 'DOWN', statusCode : response.statusCode });
//             statusChange({client : client, status : 'DOWN'})
//             client.user.setActivity(`${checkName} is DOWN`, { type: 'WATCHING' })
//             .then((presence) => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
//             .catch(console.error);
//             status = 'DOWN';
//         }
//     });
// }

// process.on("uncaughtException", (err) => {
//     const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
//     client.logger.error(`Uncaught Exception: ${errorMsg}`);
//   });

//   process.on("unhandledRejection", err => {
//     client.logger.error(`Unhandled rejection: ${err}`);
    
//   });


let env = 'production (environment not specified by user)';
client.on('ready', () => {
    if (process.env.ENV !== null && process.env.ENV.trim() !== ''){
        env = process.env.ENV;
    }
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


client.login(botConfig.token);