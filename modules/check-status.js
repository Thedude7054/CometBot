/* jshint esversion: 6 */
const request = require('request');
const alert = require('./dm-alert');
const statusChange = require('./status-change');

const pingURL = process.env.PING_URL;
const checkName = process.env.CHECK_NAME;

let status = null; // defining in global scope

module.exports = (client) => {
    request({url : pingURL, time : true, stream : true}, function (error, response, body) {
    if (!error && response.statusCode === 200) {     
            console.log("checking UP");
            if (status === 'UP') return;
            client.user.setActivity(`${checkName} is UP`, { type: 'WATCHING' })
            .then((presence) => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
            .catch(console.error);
            status = 'UP';
            if (process.env.DM_USERS !== null) {
                alert({ client: client, service : checkName, status : 'UP', statusCode : response.statusCode });
            }
            statusChange({client : client, status : 'UP'});   
        } else {
            console.log("checking DOWN");
            if (status === 'DOWN') return;
            client.user.setActivity(`${checkName} is DOWN`, { type: 'WATCHING' })
            .then((presence) => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
            .catch(console.error);
            status ='DOWN';
            if (process.env.DM_USERS !== null) {
                alert({ client: client, service : checkName, status : 'DOWN', statusCode : response.statusCode });
            }
            statusChange({client : client, status : 'DOWN'});    
        }
    });
};