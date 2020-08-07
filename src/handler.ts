declare global {
  const FEEDBACK: KVNamespace
}

import cookie from 'cookie'
import { v4 as uuidv4 } from 'uuid'

const cookieKey = 'smiley-session'

const respond = async (request: Request): Promise<Response> => {
  const url: URL = new URL(request.url)
  let smiley: string | number | null = url.searchParams.get('feedback')

  if (!url || !smiley) return new Response('Error', { status: 500 })

  const respondingTo = url.searchParams.get('url')

  const cookieHeader = request.headers.get('cookie')
  const cookies = cookieHeader ? cookie.parse(cookieHeader) : {}
  let setCookie

  let sessionId = cookies[cookieKey]
  if (!sessionId) {
    sessionId = uuidv4()
    setCookie = `${cookieKey}=${sessionId}; Max-Age=${
      60 * 60 * 24 * 7
    }; HttpOnly`
  }

  const key = `feedback:${respondingTo}:${sessionId}`
  const existing = await FEEDBACK.get(key)
  if (existing) return new Response('Already responded', { status: 200 })

  smiley = Number(smiley)
  if (isNaN(smiley) || smiley < 1 || smiley > 4) {
    return new Response('feedback param must be between 1 and 4', {
      status: 500,
    })
  }

  await FEEDBACK.put(key, smiley.toString())

  return new Response('Thanks for your feedback!', {
    headers: setCookie ? { 'Set-cookie': setCookie } : {},
  })
}

const responses = async (request: Request): Promise<Response> => {
  try {
    const url: URL = new URL(request.url)
    if (!url) return new Response('Error', { status: 500 })
    const respondingTo = url.searchParams.get('url')

    const prefix = `feedback:${respondingTo}:`
    const { keys } = await FEEDBACK.list({ prefix })
    const scores: { [key: string]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 }

    const keyLookups = keys.map(
      ({ name }) =>
        new Promise(async (resolve) => {
          try {
            const value = await FEEDBACK.get(name)
            if (!value) return resolve()
            const valueStr = value.toString()
            if (scores[valueStr] === undefined) return resolve()
            scores[valueStr] = scores[valueStr] + 1
            return resolve()
          } catch (err) {
            console.log(err)
          }
        }),
    )

    await Promise.all(keyLookups)
    const body = [respondingTo, 'scores:']
    const scoresString = Object.keys(scores).map(
      (score) => `${score}: ${scores[score]}`,
    )
    return new Response(body.concat(...scoresString).join('\n'))
  } catch (err) {
    return new Response(err.toString())
  }
}

export async function handleRequest(request: Request): Promise<Response> {
  const url: URL = new URL(request.url)

  if (url.pathname === '/respond') {
    return respond(request)
  }

  if (url.pathname.startsWith('/responses')) {
    return responses(request)
  }

  return new Response(`help text here`)
}
