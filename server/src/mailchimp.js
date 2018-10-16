/**************************************************************************
 * IMPORTS
 ***************************************************************************/

// NPM
import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";

/**************************************************************************
 * SUBSCRIBE EMAIL ADDRESS TO MAILCHIMP
 ***************************************************************************/

// Load environment variables
dotenv.config();

// TODO: Verify email is right
// TODO: Trigger message when email added
// TODO: Trigger message when email were already added previously
// TODO: Return any error sent by Mailchimp
exports.handler = async function(event) {
  const bodyParams = querystring.parse(event.body);

  // Only allow POST method
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Only accept valid email
  const re = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/;

  if (!re.test(bodyParams.email)) {
    return {
      statusCode: 400,
      body: "This is not a valid email"
    };
  }

  // Add valid email to the Mailchimp list
  try {
    await axios.post(
      "https://us19.api.mailchimp.com/3.0/lists/00f5d5e482/members/",
      { email_address: bodyParams.email, status: "subscribed" },
      {
        auth: { username: "anystring", password: process.env.MAILCHIMP_API_KEY }
      }
    );
  } catch (error) {
    // return {};
  }

  return {
    statusCode: 200,
    body: "You are now subscribed to the newsletter."
  };
};
