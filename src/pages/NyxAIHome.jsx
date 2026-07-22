import React from 'react'
import { Link } from 'react-router-dom'

function NyxAIHome() {
  return (
    <main className="hub-page nyxai-home">
      <div className="hub-inner">
        <header className="hub-header">
          <h1 className="hub-title">NyxAI</h1>
          <p className="hub-sub">Named for Nyx, the Greek goddess of night.</p>
        </header>

        <p className="hub-body">Review your profile and account settings below.</p>

        <ul className="nyxai-home-grid" aria-label="Account options">
          <li>
            <Link to="/account" className="nyxai-home-card">
              <span className="nyxai-home-card-title">Account</span>
              <span className="nyxai-home-card-blurb">Profile and settings.</span>
            </Link>
          </li>
        </ul>
      </div>
    </main>
  )
}

export default NyxAIHome
