import { SignJWT } from 'jose'

// Just log in as user 1
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const jwtPayload = {
    sub: '1',
    iat: Math.floor(Date.now() / 1000),
  }

  const jwt = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30days')
    .sign(new TextEncoder().encode(must(config.zero.authSecret)))

  setCookie(event, 'jwt', jwt, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  })

  return 'ok'
})

function must<T>(val: T) {
  if (!val) {
    throw new Error('Expected value to be defined')
  }
  return val
}
