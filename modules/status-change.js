/*jslint esversion: 6 */

module.exports = (options = {}) => {
  const {client , status} = options;
  const description = function (status) {
    if (status === "DOWN") {
      return `The status of ${process.env.CHECK_NAME} has changed to ${status}, developers have been alerted and are furiously typing away to fix the issue.`;
    } else if (status === "UP") {
      return `The status of ${process.env.CHECK_NAME} has changed to ${status}, and the site is functioning properly.`;
    }
  };
  console.log(process.env.STATUSPAGE_URL);
  client.channels.get(process.env.STATUS_CHANNEL).send({embed: {
      color: process.env.EMBED_COLOR,
      title: `${process.env.CHECK_NAME} is now ${status}`,
      url: process.env.STATUSPAGE_URL,
      author: {
        name: client.user.username,
        icon_url: process.env.ICON_URL
      },
      description: description(status),
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "©"
      }
    }
  });
};