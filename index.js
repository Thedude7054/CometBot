const Discord = require('discord.js');
const client = new Discord.Client();
var request = require('request');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
  var status = 'up';
function initialCheck(req, res) {
    request({url : 'https://flydeltavirtual.org', time : true, stream : true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
            client.user.setActivity(`Front Page is UP`, { type: 'WATCHING' })
            .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
            .catch(console.error);
            status = 'up';
            console.log('initialCheck: Up')
        } else {
            client.user.setActivity(`Front Page is DOWN`, { type: 'WATCHING' })
            .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
            .catch(console.error);
            status = 'down';
            console.log('initialCheck: Down')
        }
    })
};
setTimeout(initialCheck, 5000);
function checkStatus(req, res) {
    request({url : 'https://flydeltavirtual.org', time : true, stream : true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
            if (status === 'up') return;
            client.user.setActivity(`Front Page is UP`, { type: 'WATCHING' })
            .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
            .catch(console.error);
            status = 'up';
        } else {
            if (status === 'down') return;
            client.user.setActivity(`Front Page is DOWN`, { type: 'WATCHING' })
            .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
            .catch(console.error);
            status = 'down';
        }
    })
};

setInterval(()=> {
    checkStatus()
    console.log('ticked');
}, 5000);

client.login('NTI4ODU2NjAwMDM1OTgzMzYw.DyXQ_Q.G16Tl0QILldb5045w9IymJYAsy4');