/*jslint esversion: 6 */
let env = 'production (environment not specified by user)';
if (process.env.ENV !== null && process.env.ENV.trim() !== ''){
    env = process.env.ENV;
}

module.exports = (options = {}) => {
    const {client, checkName , status, statusCode, elapsedTime} = options;
    var dmUsers = process.env.DM_USERS.split(' ');
    console.log(`Users to Ping: ${dmUsers}`);
    dmUsers.forEach(function(id){
        client.fetchUser(id)
        .then(function(user) {
            user.createDM();
            client.users.get(id).send({embed: {
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
                        value: `${process.env.CHECK_NAME}`, // No idea why checkName on its own doesn't work.
                    },
                    {
                        name: 'Status:',
                        value: `${status}`,
                    },
                    {
                        name: 'Response Time:',
                        value: `${elapsedTime}ms`,
                    },
                    {
                        name: 'Status Code:',
                        value: `${statusCode}`
                    },
                    {
                        name: 'Environment:',
                        value: `${env}`
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
  });
};  