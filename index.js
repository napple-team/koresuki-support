const { IncomingWebhook } = require('@slack/webhook');

const postChannel = {
  safe: {
    webhookUrl: process.env.SAFE_CHANNEL_WEBHOOK_URL,
    channelId: process.env.SAFE_CHANNEL_ID,
  },
  nsfw: {
    webhookUrl: process.env.NSFW_CHANNEL_WEBHOOK_URL,
    channelId: process.env.NSFW_CHANNEL_ID,
  },
};

exports.koresuki = (req, res) => {
  (async () => {
    const { command, text } = req.body;
    const postedUserName = req.body.user_name;

    if (!/https:\/\/twitter\.com\/\w+\/status\/\d+/.test(text)) {
      res.status(200).json({
        response_type: 'ephemeral',
        text: 'メッセージ中にTwitterのURLが存在しないため処理を中断します',
      });
      return;
    }

    let postChannelId = null;

    try {
      switch (command) {
        case '/koresuki':
          postChannelId = postChannel.safe.channelId;
          await new IncomingWebhook(postChannel.safe.webhookUrl).send({
            text: `${postedUserName} さんから: \n${text}`,
          });
          break;

        case '/nsfw':
          postChannelId = postChannel.nsfw.channelId;
          await new IncomingWebhook(postChannel.safe.webhookUrl).send({
            text: `${postedUserName} さんが <#${postChannelId}> に Twitter URL を投稿しました`,
          });
          await new IncomingWebhook(postChannel.nsfw.webhookUrl).send({
            text: `${postedUserName} さんから: \n${text}`,
          });
          break;

        default:
          return;
      }
    } catch (err) {
      res.status(200).json({
        response_type: 'ephemeral',
        text: `投稿に失敗しました\n\`\`\`\n${err}\`\`\``,
      });
      throw err;
    }

    res.status(200).json({
      response_type: 'ephemeral',
      text: `下記の内容 を <#${postChannelId}> に投稿しました\n\`\`\`\n${text}\`\`\``,
    });
  })()
    .then()
    .catch((err) => { throw err; });
};
