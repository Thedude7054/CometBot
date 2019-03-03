const request = require('request');
const pingURL = process.env.PING_URL;

exports.run = (client, message, args) => {
    
    request({url : pingURL, time : true, stream : true}, function (error, response, body) {
        function getStatus(status) {
            if (response.statusCode === 200){
                return 'UP';
            } else {
                return 'DOWN';
            }
        }
        message.channel.send(`**Service:** ${process.env.CHECK_NAME}\n**Status:** ${getStatus(response.statusCode)}\n**Status Code:** ${response.statusCode}\n**Environment:** ${process.env.ENV}`).catch(console.error);

    });
};