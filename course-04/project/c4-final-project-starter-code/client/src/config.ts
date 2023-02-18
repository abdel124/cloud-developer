// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://qvb2tv5rre.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-cudawrg18oy0fz8n.us.auth0.com',            // Auth0 domain
  clientId: 'xRCc3wETJN7TcblrVZntKqdg5YDCXazk',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
