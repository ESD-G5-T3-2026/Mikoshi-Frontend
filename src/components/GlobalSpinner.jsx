import './GlobalSpinner.css'

function GlobalSpinner() {
  return (
    <div className="global-spinner-overlay" role="status" aria-live="polite" aria-label="Loading">
      <div className="global-spinner" />
    </div>
  )
}

export default GlobalSpinner
