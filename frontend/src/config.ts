// backend's apiGateway endpoint

const apiId = 'he2cy2yrsk'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'danthe42.eu.auth0.com',            			// Auth0 domain
  clientId: 'dNwAWqwP8WvF4FH8cVCcrSMpfnon1ck7',         		// Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
