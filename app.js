const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Nexmo = require('nexmo');


const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

// Set up Nexmo/Vonage API credentials
const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
});

// Set up a webhook endpoint to receive GitHub push notifications
app.post('/webhook', bodyParser.json(), (req, res) => {
  const payload = req.body;
  const repoName = payload.repository.name;
  const branchName = payload.ref.replace('refs/heads/', '');
  const commitMsg = payload.head_commit.message;
  
  // Compose a message to send via WhatsApp
  const message = `New commit in ${repoName}/${branchName}: ${commitMsg}`;
  
  // Use Nexmo/Vonage  to send the message via WhatsApp
  nexmo.channel.send(
    { type: 'whatsapp', number: process.env.YOUR_WHATSAPP_NUMBER },
    { type: 'whatsapp', number: process.env.WHATSAPP_NUMBER_TO_SEND_TO},
    {
      content: {
        type: 'text',
        text: message
      }
    },
    (err, data) => {
      if (err) {
        console.error(`Error sending Nexmo message: ${err}`);
      } else {
        console.log(`Nexmo message sent: ${data.message_uuid}`);
      }
    }
  );
  
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
