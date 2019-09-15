const { IncomingWebhook } = require('@slack/webhook');

const safeWebhookUrl = process.env.SAFE_CHANNEL_WEBHOOK_URL;
const nsfwWebhookUrl = process.env.NSFW_CHANNEL_WEBHOOK_URL;

const nsfwChannelId = process.env.NSFW_CHANNEL_ID;

exports.koresuki = (req, res) => {
  (async () => {
    const request = req.body.text;
    const postedUserName = req.body.user_name;

    if (!request.match(/https:\/\/twitter\.com\/\w+\/status\/\d+/)) {
      res.status(200).json({
        response_type: 'ephemeral',
        text: 'URLがTwitterと認識できなかったため処理を中断します',
      });
      return;
    }

    res.status(200).json({
      response_type: 'ephemeral',
      text: `\`${request}\` を <#${nsfwChannelId}> に投稿しました`,
    });
    await new IncomingWebhook(safeWebhookUrl).send({
      text: `${postedUserName} さんが <#${nsfwChannelId}> に Twitter URL を投稿しました`,
    });
    await new IncomingWebhook(nsfwWebhookUrl).send({
      text: `${postedUserName} さんから: \n${request}`,
    });
  })().then();
};
