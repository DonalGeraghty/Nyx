import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  deleteOpenAIKey,
  getOpenAIKeyStatus,
  saveOpenAIKey,
} from '../services/openaiCredential'

function errorMessage(error) {
  if (error.code === 'invalid_api_key') return 'Enter a valid OpenAI API key.'
  if (error.code === 'openai_key_invalid') {
    return 'OpenAI rejected this key. Check that it is active and has API access.'
  }
  if (error.code === 'openai_rate_limited') {
    return 'OpenAI could not verify the key because it is currently rate limited.'
  }
  if (error.code === 'credential_service_unavailable') {
    return 'Secure key storage is temporarily unavailable. Try again later.'
  }
  return error.message || 'Could not update your OpenAI API key.'
}

function OpenAIKeySettings() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [credential, setCredential] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(!user?.isDemo)
  const [action, setAction] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const handleUnauthorized = (requestError) => {
    if (requestError.status !== 401) return false
    logout()
    navigate('/', { replace: true })
    return true
  }

  useEffect(() => {
    if (user?.isDemo) return undefined

    let active = true
    getOpenAIKeyStatus()
      .then((status) => {
        if (active) setCredential(status)
      })
      .catch((requestError) => {
        if (!active || handleUnauthorized(requestError)) return
        setError(errorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user?.isDemo])

  const handleSave = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    const submittedKey = apiKey.trim()
    if (!submittedKey) {
      setError('Enter your OpenAI API key.')
      return
    }

    setAction('save')
    try {
      const status = await saveOpenAIKey(submittedKey)
      setCredential(status)
      setApiKey('')
      setNotice('Your OpenAI API key is configured.')
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) setError(errorMessage(requestError))
    } finally {
      setAction('')
    }
  }

  const handleRemove = async () => {
    const confirmed = window.confirm(
      'Remove your OpenAI API key? Meal analysis will be unavailable until you add another key.'
    )
    if (!confirmed) return

    setError('')
    setNotice('')
    setAction('delete')
    try {
      await deleteOpenAIKey()
      setCredential({ configured: false })
      setApiKey('')
      setNotice('Your OpenAI API key was removed.')
    } catch (requestError) {
      if (!handleUnauthorized(requestError)) setError(errorMessage(requestError))
    } finally {
      setAction('')
    }
  }

  if (user?.isDemo) {
    return (
      <section className="account-section" aria-labelledby="openai-key-heading">
        <h2 id="openai-key-heading">OpenAI API key</h2>
        <p className="account-section-copy">
          API-key storage is unavailable for the local demo account.
        </p>
      </section>
    )
  }

  const configured = Boolean(credential?.configured)
  const busy = Boolean(action)

  return (
    <section className="account-section" aria-labelledby="openai-key-heading">
      <div className="account-section-heading">
        <div>
          <h2 id="openai-key-heading">OpenAI API key</h2>
          <p className="account-key-status" aria-live="polite">
            {loading
              ? 'Checking status…'
              : configured
                ? `Configured ••••${credential.last_four || ''}`
                : 'Not configured'}
          </p>
        </div>
        {configured && !loading && (
          <button
            type="button"
            className="account-key-remove"
            onClick={handleRemove}
            disabled={busy}
          >
            {action === 'delete' ? 'Removing…' : 'Remove'}
          </button>
        )}
      </div>

      <p className="account-section-copy">
        Your key is verified by OpenAI, encrypted by Janus Gate, and never shown again.{' '}
        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">
          Create an OpenAI API key
        </a>
      </p>

      <form className="account-key-form" onSubmit={handleSave}>
        <label htmlFor="openai-api-key">
          {configured ? 'Replace API key' : 'API key'}
        </label>
        <input
          id="openai-api-key"
          name="openai-api-key"
          type="password"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder="sk-…"
          disabled={busy || loading}
        />
        <button type="submit" disabled={busy || loading || !apiKey.trim()}>
          {action === 'save' ? 'Verifying…' : configured ? 'Replace key' : 'Save key'}
        </button>
      </form>

      {error && <p className="account-key-message account-key-error" role="alert">{error}</p>}
      {notice && <p className="account-key-message account-key-success" role="status">{notice}</p>}
    </section>
  )
}

export default OpenAIKeySettings
