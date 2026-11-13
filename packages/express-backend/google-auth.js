import { OAuth2Client } from "google-auth-library";

// Asks Google to check the login token. Throws if the token is fake, expired, or for another app.
async function verifyGoogleToken(idToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  // without this check the library would accept tokens made for any app
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not set");
  }

  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  return ticket.getPayload();
}

export default { verifyGoogleToken };
