import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const sendSMS = async (phone, message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });

    console.log("SMS Sent");
  } catch (error) {
    console.log("SMS Error:", error);
  }
};

export default sendSMS;