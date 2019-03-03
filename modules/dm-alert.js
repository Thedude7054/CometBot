/*jshint esversion: 8 */
let env = 'production (environment not specified by user)';
if (process.env.ENV !== null && process.env.ENV.trim() !== ''){
    env = process.env.ENV;
}

module.exports = (options = {}) => {
        const {client, checkName , status, statusCode} = options;
        var dmUsers = process.env.DM_USERS.split(' ');
        console.log(`Users to Ping: ${dmUsers}`);
        dmUsers.forEach(function(id){
            client.users.get(id).createDM();           // ˅ ˅ ˅ ˅ Using process.env.CHECK_NAME because checkName returned undefined this works just as well
            client.users.get(id).send(`**Service:** ${process.env.CHECK_NAME}\n**Status:** ${status}\n**Status Code:** ${statusCode}\n**Environment:** ${env}`);
        });
};