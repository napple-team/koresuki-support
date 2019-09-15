const { IncomingWebhook } = require('@slack/webhook');

const safeWebhookUrl = process.env.SAFE_CHANNEL_WEBHOOK_URL;
const nsfwWebhookUrl = process.env.NSFW_CHANNEL_WEBHOOK_URL;

const nsfwChannelId = 'BNEGY0P3R'

exports.koresuki = (req, res) => {
  (async () => {
    const request = req.body.text;
    const postedUser = req.body.user_id;
    if (!request.match(/https:\/\/twitter\.com\/\w+\/status\/\d+/)) {
      res.status(200).json({
        response_type: 'ephemeral',
        text: 'URLがTwitterと認識できなかったため処理を中断します',
      });
    } else {
      res.status(200).json({
        response_type: 'ephemeral',
        text: `\`${request}\` を <#${nsfwChannelId}> に投稿しました`,
      });
      await new IncomingWebhook(safeWebhookUrl).send({
        text: `<@${postedUser}>さんが <#${nsfwChannelId}> にTwitter URLを投稿しました`,
      });
      await new IncomingWebhook(nsfwWebhookUrl).send({
        text: `<@${postedUser}>さんから: \n${request}`,
      });
    }
  })().then();
};
