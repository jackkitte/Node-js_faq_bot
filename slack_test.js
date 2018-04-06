'use strict'
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const { WebClient } = require('@slack/client');
const token = process.env.SLACK_ACCESS_TOKEN || "undefined";
const web = new WebClient(token);

app.use(bodyparser.json({
  verify: (req, res, buf, encoding) => {
    req.raw_body = buf;
  }
}));
app.use(bodyparser.urlencoded({ extended: true }));


const server = app.listen(5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.post('/webhook', (req, res) => {
  let text = req.body.text;
  let conversationId = req.body.channel_id;
  if(!/^\d+$/.test(text)) {
    res.send('Error: enter a valid status code, such as 200');
    return;
  }
  let data = {
    response_type: 'in_channel',
    text: '302: Found',
  };
  //console.log(req);
  //res.json(data);
  web.chat.postMessage({ channel: conversationId, text: 'Hello there' })
  .then((res) => {
    console.log('Message sent: ', res.ts);
  }).catch(console.error);
});
