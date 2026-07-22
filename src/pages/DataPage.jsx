import React from 'react'
import { useAuth } from '../context/AuthContext'
import { demoFoodEntries } from '../data/foodEntries'

const formatDatetime = (datetime) => new Date(datetime).toLocaleString('en-IE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function DataPage() {
  const { user } = useAuth()
  const entries = user?.isDemo
    ? [...demoFoodEntries].sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
    : []

  return (
    <main className="content-page">
      <div className="content-inner">
        <h1>Data</h1>
        <p>Recent food entries.</p>
        <div className="data-table-wrap">
          <table className="data-table">
            <colgroup>
              <col className="data-col-datetime" />
              <col />
              <col className="data-col-number" />
              <col className="data-col-number" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Datetime</th>
                <th scope="col">Food</th>
                <th scope="col">Calories</th>
                <th scope="col">Protein</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={`${entry.datetime}-${entry.food}`}>
                  <td>{formatDatetime(entry.datetime)}</td>
                  <td>
                    <span className="data-food" title={entry.food}>{entry.food}</span>
                  </td>
                  <td>{entry.calories}</td>
                  <td>{entry.protein} g</td>
                </tr>
              ))}
              {!entries.length && (
                <tr>
                  <td colSpan="4">No food entries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default DataPage
