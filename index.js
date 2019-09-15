const URI = require('url');

exports.koresuki = (req, res) => {
  (async () => {
    const request = req.body.text;
    if (!request.match(/https:\/\/twitter\.com\/\w+\/status\/\d+/)) {
      res.status(200).json({
        response_type: 'ephemeral',
        text: 'URLがTwitterと認識できなかったため処理を中断します',
      });
    } else {
      res.status(200).json({
        response_type: 'ephemeral',
        text: `\`${request}\` を <#BNEGY0P3R> に投稿しました`,
      });
    }
  })().then();
};
