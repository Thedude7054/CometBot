const Discord = require('discord.js');
const client = new Discord.Client();
var request = require('request');
var dotenv = require('dotenv').load();
var status = '';

const pingURL = process.env.PING_URL;
const botToken = process.env.BOT_TOKEN;
const checkName = process.env.CHECK_NAME;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(()=> {
        checkStatus()
    }, 5000);
});



function checkStatus(req, res) {
    request({url : pingURL, time : true, stream : true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
            console.log("checking UP");
            if (status === 'UP') return;
            alert({ service : checkName, status : 'UP', statusCode : response.statusCode })
            client.user.setActivity(`${checkName} is UP`, { type: 'WATCHING' })
            .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
            .catch(console.error);
            status = 'UP';
        } else {
            console.log("checking DOWN");
            if (status === 'DOWN') return;
            alert({ service : checkName, status : 'DOWN', statusCode : response.statusCode })
            client.user.setActivity(`${checkName} is DOWN`, { type: 'WATCHING' })
            .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
            .catch(console.error);
            status = 'DOWN';
        }
    })
};

async function alert(options = {}) {
    const {checkName , status, statusCode} = options;
    var dmUsers = process.env.DM_USERS.split(' ');
    console.log(`Users Array: ${dmUsers}`);
    dmUsers.forEach(function(id){
        client.users.get(id).createDM();           // Using process.env.CHECK_NAME because checkName returned undefined this works just as well
        client.users.get(id).send(`**Service:** ${process.env.CHECK_NAME}\n**Status:** ${status}\n**Status Code:** ${statusCode}`);
    });
}




client.login(botToken);