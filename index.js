import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { IncomingWebhook } from '@slack/webhook';

const app = new Hono();

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

app.use('*', cors());

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.post('/', async (c) => {
  const body = await c.req.json();
  const { command, text } = body;
  const postedUserName = body.user_name;

  if (!/https:\/\/(twitter|x)\.com\/\w+\/status\/\d+/.test(text)) {
    return c.json({
      response_type: 'ephemeral',
      text: 'メッセージ中にTwitterのURLが存在しないため処理を中断します',
    });
  }

  let postChannelId = null;

  try {
    switch (command) {
      case '/koresuki':
        postChannelId = postChannel.safe.channelId;
        await new IncomingWebhook(postChannel.safe.webhookUrl).send({
          text: `${postedUserName} さんから: \n${text}`,
          unfurl_links: true,
          unfurl_media: true,
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
        break;
    }
  } catch (err) {
    return c.json({
      response_type: 'ephemeral',
      text: `投稿に失敗しました\n\`\`\`\n${err}\`\`\``,
    });
  }

  return c.json({
    response_type: 'ephemeral',
    text: `下記の内容 を <#${postChannelId}> に投稿しました\n\`\`\`\n${text}\`\`\``,
  });
});

const port = parseInt(process.env.PORT || '3000', 10);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
