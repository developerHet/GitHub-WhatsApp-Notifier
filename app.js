const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Vonage } = require('@vonage/server-sdk')
const { Text } = require('@vonage/messages/dist/classes/WhatsApp/Text');


const app = express();
app.use(bodyParser.json())

dotenv.config();
const port = process.env.PORT || 3000;

// Set up Nexmo/Vonage API credentials


const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  applicationId: process.env.VONAGE_APPLICATION_ID,
    privateKey: __dirname +"/private.key"
}, 
//{
  //apiHost: process.env.CYCLIC_URL
//}
)



// Set up a webhook endpoint to receive GitHub push notifications
app.post('/webhook', (req, res) => {
  const payload = req.body;
  const repoName = payload.repository.name;
  const branchName = payload.ref.replace('refs/heads/', '');
  const commitMsg = payload.head_commit.message;
  
  // Compose a message to send via WhatsApp
  const message = `New commit in ${repoName}/${branchName}: ${commitMsg}`;
  
  // Use Nexmo/Vonage  to send the message via WhatsApp
  vonage.channel.send(
    {type:'whatsapp',number: process.env.TO_NUMBER},
    {type:'whatsapp',number: process.env.WHATSAPP_NUMBER},
    {
      content: {
        type: 'text',
        text: message
      }},(err) => {
        if(err) {
          console.log(err);
        } else {
          console.log(data);
        }
      }
  );
  
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
