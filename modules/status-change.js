/*jslint esversion: 6 */

module.exports = (options = {}) => {
    const {client , status} = options;
    client.channels.get(process.env.STATUS_CHANNEL).send({embed: {
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: `${process.env.CHECK_NAME} is now ${status}`,
        url: process.env.STATUSPAGE_URL,
        description: `The status of ${process.env.CHECK_NAME} has changed to ${status}, developers have been alerted and are furiously typing away to fix the issue.`,
        // fields: [{
        //     name: "Fields",
        //     value: "They can have different fields with small headlines."
        //   },
        //   {
        //     name: "Masked links",
        //     value: "You can put [masked links](http://google.com) inside of rich embeds."
        //   },
        //   {
        //     name: "Markdown",
        //     value: "You can put all the *usual* **__Markdown__** inside of them."
        //   }
        // ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©"
        }
      }
    });
  };