const { Vonage } = require('@vonage/server-sdk')
const { Text } = require('@vonage/messages/dist/classes/WhatsApp/Text');
const dotenv = require('dotenv');
dotenv.config();




vonage.messages.send(
    new Text(
      "This is a WhatsApp Message text message sent using the Messages API",
      process.env.TO_NUMBER,
      process.env.WHATSAPP_NUMBER
    )
  )
    .then(resp => console.log(resp.message_uuid))
    .catch(err => console.error(err));