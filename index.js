/*jshint esversion: 6 */

const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const dotenv = require('dotenv').load();
const logger = require("./modules/Logger");
const Sentry = require('@sentry/node');

if(process.env.SENTRY_ENABLED === 'true') {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.ENV,
    });
    Sentry.configureScope((scope) => {
      scope.setTag("node_version", process.version);
    });
    logger.log("Sentry Enabled");
}

const pingURL = process.env.PING_URL;
const botToken = process.env.BOT_TOKEN;
const checkName = process.env.CHECK_NAME;

let status = null;

function checkStatus(req, res) {
    request({url : pingURL, time : true, stream : true}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
            console.log("checking UP");
            if (status === 'UP') { return; }
            alert({ service : checkName, status : 'UP', statusCode : response.statusCode });
            client.user.setActivity(`${checkName} is UP`, { type: 'WATCHING' })
            .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
            .catch(console.error);
            status = 'UP';
        } else {
            console.log("checking DOWN");
            if (status === 'DOWN') { return; }
            alert({ service : checkName, status : 'DOWN', statusCode : response.statusCode });
            client.user.setActivity(`${checkName} is DOWN`, { type: 'WATCHING' })
            .then((presence) => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
            .catch(console.error);
            status = 'DOWN';
        }
    });
}

function alert(options = {}) {
    const {checkName , status, statusCode} = options;
    var dmUsers = process.env.DM_USERS.split(' ');
    console.log(`Users to Ping: ${dmUsers}`);
    dmUsers.forEach(function(id){
        client.users.get(id).createDM();           // Using process.env.CHECK_NAME because checkName returned undefined this works just as well
        client.users.get(id).send(`**Service:** ${process.env.CHECK_NAME}\n**Status:** ${status}\n**Status Code:** ${statusCode}\n**Environment:** ${process.env.ENV}`);
    });
}

process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    Sentry.captureException(errorMsg);
    logger.fatal(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });
  process.on(("unhandledRejection"), err => {
    logger.error(`Unhandled rejection: ${err}`);
  });

  client.on('ready', () => {
    logger.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers, while running in ${process.env.ENV}`, "ready");
    setInterval(() => {
        checkStatus();
    }, 5000);
});

client.login(botToken);