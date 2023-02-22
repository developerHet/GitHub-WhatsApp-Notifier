const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const { Vonage } = require('@vonage/server-sdk')
const { Text } = require('@vonage/messages/dist/classes/WhatsApp/Text');
const jwt = require("jsonwebtoken");
const sha256 = require('js-sha256');


const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


const port = process.env.PORT || 3000;

// Set up Nexmo/Vonage API credentials


const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  applicationId: process.env.VONAGE_APPLICATION_ID,
    privateKey: __dirname +"/private.key"
}
);



// Set up a webhook endpoint to receive GitHub push notifications
app.get('/webhook', (req, res) => {
  // const payload = req.body;
  // const repoName = payload.repository.name;
  // const branchName = payload.ref.replace('refs/heads/', '');
  // const commitMsg = payload.head_commit.message;
  
  // Compose a message to send via WhatsApp
  //const message = `New commit in ${repoName}/${branchName}: ${commitMsg}`;
  
  // Use Nexmo/Vonage  to send the message via WhatsApp
  vonage.messages.send(
    new Text(
      "Hello",
      process.env.TO_NUMBER,
      process.env.WHATSAPP_NUMBER
    )
  )
    .then(resp => console.log(resp.message_uuid))
    .catch(err => console.error(err));
  
  res.status(200).send('OK');
});

app
    .route('/webhooks/inbound-message')    
    .post(handleInboundMessage);

function handleInboundMessage(request, response){
  const payload = Object.assign(request.query, request.body)
  let token = request.headers.authorization.split(" ")[1]
  try{
      var decoded = jwt.verify(token, VONAGE_API_SIGNATURE_SECRET, {algorithms:['HS256']});
      if(sha256(JSON.stringify(payload))!=decoded["payload_hash"]){
          console.log("tampering detected");
          response.status(401).send();
      }
      else{
          console.log("Success");
          response.status(204).send();
      }
  }
  catch(err){
      console.log('Bad token detected')
      response.status(401).send()
  }
}

app.post('/webhooks/message-status', (req, res) => {
  console.log(req.body);
  res.status(200).end();
});

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
