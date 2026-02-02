# Koresuki Support

## About

Slack に これすき な URL を投稿したいときに これすき なチャンネルを開かずとも、 Slash コマンド `/koresuki` や `/nsfw` を通して Twitter/X の URL を送信すれば対応するチャンネルに投稿してくれるやつ。

## Requirements

- Node.js 24+
- Slack アプリの登録と Incoming Webhook の設定

## Setup

### 環境変数

| 変数名 | 説明 |
|--------|------|
| `SAFE_CHANNEL_WEBHOOK_URL` | `/koresuki` 用チャンネルの Webhook URL |
| `SAFE_CHANNEL_ID` | `/koresuki` 用チャンネルの ID |
| `NSFW_CHANNEL_WEBHOOK_URL` | `/nsfw` 用チャンネルの Webhook URL |
| `NSFW_CHANNEL_ID` | `/nsfw` 用チャンネルの ID |
| `PORT` | サーバーのポート番号（デフォルト: 3000） |

### ローカル実行

```bash
npm install
npm start
```

### Docker

```bash
# ビルド
docker build -t koresuki-support .

# 実行
docker run -p 3000:3000 \
  -e SAFE_CHANNEL_WEBHOOK_URL=... \
  -e SAFE_CHANNEL_ID=... \
  -e NSFW_CHANNEL_WEBHOOK_URL=... \
  -e NSFW_CHANNEL_ID=... \
  koresuki-support
```

GitHub Container Registry からもイメージを取得できます:

```bash
docker pull ghcr.io/windyakin/koresuki-support:master
```

## License

- [MIT License](LICENSE)

## Author

- windyakin ([@MITLicense](https://twitter.com/MITLicense))
