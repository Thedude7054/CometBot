/*jslint esversion: 6 */
const request = require('request');
const pingURL = process.env.PING_URL;

exports.run = (client, message, args) => {
    request({url : pingURL, time : true, stream : true}, function (error, response, body) {   
        message.channel.send(`**Service:** ${process.env.CHECK_NAME}\n**Status:** ${response.statusCode}\n**Status Code:** ${response.statusCode}\n**Environment:** ${process.env.ENV}`).catch(console.error);
    });
};