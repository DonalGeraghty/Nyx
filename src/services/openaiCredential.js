import { API_ENDPOINTS, authFetch } from '../config/api'

export class CredentialApiError extends Error {
  constructor(message, status, code) {
    super(message)
    this.name = 'CredentialApiError'
    this.status = status
    this.code = code
  }
}

async function credentialRequest(options) {
  const response = await authFetch(API_ENDPOINTS.OPENAI_KEY, options)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new CredentialApiError(
      data.message || data.error || 'OpenAI key request failed',
      response.status,
      data.error
    )
  }

  return data
}

export async function getOpenAIKeyStatus() {
  const data = await credentialRequest({ method: 'GET' })
  return data.credential || { configured: false }
}

export async function saveOpenAIKey(apiKey) {
  const data = await credentialRequest({
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  })
  return data.credential
}

export async function deleteOpenAIKey() {
  await credentialRequest({ method: 'DELETE' })
}
