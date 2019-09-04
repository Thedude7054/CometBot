/*jslint esversion: 6 */
const request = require('request');
const pingURL = process.env.PING_URL;

exports.run = (client, message, args) => {
    request({url : pingURL, time : true, stream : true}, function (error, response, body) {   
        let status;
        if (!error && response.statusCode === 200) {
            status = "UP";
        } else {
            status = "DOWN";
        }
        message.channel.send({embed: {
            color: process.env.EMBED_COLOR,
            title: `${process.env.CHECK_NAME} is ${status}`,
            url: process.env.STATUSPAGE_URL,
            author: {
              name: client.user.username,
              icon_url: process.env.ICON_URL
            },
       
            fields: [
                {
                    name: 'Service:',
                    value: process.env.CHECK_NAME,
                },
                {
                    name: 'Response Time:',
                    value: `${response.elapsedTime}ms`,
                },
                {
                    name: 'Status Code:',
                    value: response.statusCode,
                    inline: true,
                }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "©"
            }
          }
        });

    });
};