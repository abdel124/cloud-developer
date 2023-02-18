import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, /*decode*/ } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
//import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
//import { Jwt } from '../../auth/Jwt'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = 'https://dev-cudawrg18oy0fz8n.us.auth0.com/.well-known/jwks.json'
const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJZvDpg17iz5RmMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1jdWRhd3JnMThveTBmejhuLnVzLmF1dGgwLmNvbTAeFw0yMjEyMzAw
MzIxMjBaFw0zNjA5MDcwMzIxMjBaMCwxKjAoBgNVBAMTIWRldi1jdWRhd3JnMThv
eTBmejhuLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBANVREFhAvpFX7z4URX0+a4i3iIuVusfp06Rp1rUzG8Ure7GsWc/OiDxFzasq
HPnhBWyBjeRdAWECtKSUJ0FNd1v3W58WY5JUT6HLSQipVzzmLZb5Y4pAmZdFfMh4
B5AFAHDkRDSFKW8zg73o6aN0iGxphgtNNp/1HGt1ghxokmLHPx43SbyO2AtYZlUz
OSfKzxhZvKl32vMMPKu3hWosn6nD2Yg9qQtUslNbTrh5F2TeSE6U7Ie4BayCOgQ7
O08ILSQPY98je4Ayp45bYjpMz2Zzz81J3otq6b1+2G3IAb3upRA5+Q5UIHchtR/B
6vVqrQn/QXTVk05AOWgID82jhpECAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUwukp+9ufkcq1fIwrieWc0SMdrcQwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQC30E3D6mXrKt2phwQhOl719jfbQy6mVytBmAwLhPyF
aKY8m7dl9Y2m9XvSHK8Vnbgs0vG8aeGO6ZkKOL7jcVBQbG7bXYDN/9G8EWcyoZeq
i0jUnGFic46Z4QNQD3n/aE3aPFVhlMkyi/VI6RcufisDRpEZxakKWl+Am+c0MFjl
ct2J82itZoIPx4Gt5CReJOVAoHnc5Yhkb32T+S/TPmy8wmAEESufCvD8z5AEgTnK
mmSEnk92OUuGZDtDcijS8i9EOyZbMAwtj/RryDUABYpWzlMSJJOAAv00xZ/40NNe
1v4azHSDfVTYgVnbCaPBBDCL6Goc3HxrAl7ij+ZaAxkw
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.methodArn)

  try {

    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string ): Promise<JwtPayload> {
  const token = getToken(authHeader)
  //const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/

  return verify(token, cert , {algorithms : ['RS256']}) as JwtPayload  
}


function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  //f (!authHeader.toString().toLowerCase().startsWith('bearer '))
  //  throw new Error('Invalid authentication header')

  //const split = authHeader.toString().split(" ")
  //logger.info("1.... ", split[0])
  //logger.info("2.... ", split[1])
  //const token = split[1]
  logger.info("please print token ", authHeader)

  return authHeader
}
