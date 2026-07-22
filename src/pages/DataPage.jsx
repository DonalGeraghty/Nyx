import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NutritionEntryForm from '../components/NutritionEntryForm'
import { useAuth } from '../context/AuthContext'
import { demoFoodEntries } from '../data/foodEntries'
import {
  createMealEntry,
  deleteMeal,
  listMeals,
  toDisplayEntries,
  updateMealEntry,
} from '../services/nutrition'

const formatDatetime = (datetime) => new Date(datetime).toLocaleString('en-IE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function DataPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [entries, setEntries] = useState(
    user?.isDemo ? [...demoFoodEntries].sort((a, b) => new Date(b.datetime) - new Date(a.datetime)) : []
  )
  const [loading, setLoading] = useState(!user?.isDemo)
  const [deletingId, setDeletingId] = useState('')
  const [editor, setEditor] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.isDemo) return undefined
    let active = true
    listMeals()
      .then((rows) => {
        if (active) setEntries(toDisplayEntries(rows))
      })
      .catch((requestError) => {
        if (!active) return
        if (requestError.status === 401) {
          logout()
          navigate('/', { replace: true })
          return
        }
        setError(requestError.message || 'Could not load food entries.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [user?.isDemo, logout, navigate])

  const handleDelete = async (entry) => {
    const confirmed = window.confirm(`Delete “${entry.food}” from your nutrition log?`)
    if (!confirmed) return

    setDeletingId(entry.id)
    setError('')
    try {
      await deleteMeal(entry.id)
      setEntries((current) => current.filter((row) => row.id !== entry.id))
    } catch (requestError) {
      if (requestError.status === 401) {
        logout()
        navigate('/', { replace: true })
        return
      }
      setError(requestError.message || 'Could not delete this food entry.')
    } finally {
      setDeletingId('')
    }
  }

  const handleSave = async (payload) => {
    setSaving(true)
    setError('')
    try {
      const saved = editor?.id
        ? await updateMealEntry(editor.id, payload)
        : await createMealEntry(payload)
      const displayEntry = toDisplayEntries([saved])[0]
      setEntries((current) => (
        editor?.id
          ? current.map((entry) => (entry.id === displayEntry.id ? displayEntry : entry))
          : [displayEntry, ...current]
      ))
      setEditor(null)
    } catch (requestError) {
      if (requestError.status === 401) {
        logout()
        navigate('/', { replace: true })
        return
      }
      setError(requestError.message || 'Could not save this food entry.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="content-page">
      <div className="content-inner">
        <div className="data-page-heading">
          <div>
            <h1>Data</h1>
            <p>Recent food entries.</p>
          </div>
          {!user?.isDemo && (
            <button type="button" className="data-add-button" onClick={() => setEditor({ mode: 'add' })}>
              Add row
            </button>
          )}
        </div>
        {error && <p className="content-error" role="alert">{error}</p>}
        {editor && (
          <NutritionEntryForm
            key={editor.id || 'new'}
            entry={editor.id ? editor : null}
            busy={saving}
            onCancel={() => setEditor(null)}
            onSave={handleSave}
          />
        )}
        <div className="data-table-wrap">
          <table className="data-table">
            <colgroup>
              <col className="data-col-datetime" />
              <col />
              <col className="data-col-number" />
              <col className="data-col-number" />
              <col className="data-col-action" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Datetime</th>
                <th scope="col">Food</th>
                <th scope="col">Calories</th>
                <th scope="col">Protein</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id || `${entry.datetime}-${entry.food}`}>
                  <td>{formatDatetime(entry.datetime)}</td>
                  <td><span className="data-food" title={entry.food}>{entry.food}</span></td>
                  <td>{entry.calories}</td>
                  <td>{entry.protein} g</td>
                  <td>
                    {user?.isDemo ? (
                      <span className="data-action-unavailable">—</span>
                    ) : (
                      <div className="data-row-actions">
                        <button
                          type="button"
                          className="data-edit-button"
                          onClick={() => setEditor(entry)}
                          disabled={Boolean(deletingId)}
                          aria-label={`Edit ${entry.food}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="data-delete-button"
                          onClick={() => handleDelete(entry)}
                          disabled={deletingId === entry.id}
                          aria-label={`Delete ${entry.food}`}
                        >
                          {deletingId === entry.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && !entries.length && (
                <tr><td colSpan="5">No food entries yet.</td></tr>
              )}
              {loading && (
                <tr><td colSpan="5">Loading food entries…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default DataPage
