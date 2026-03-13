function EventDetailsModal({ event, onClose, formatDateTime, getDurationLeft, onUpdateStatus, getInsights }) {
  if (!event) {
    return null
  }

  return (
    <div className="event-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Event details"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <div className="event-modal-header">
          <h2>{event.name} {event.year} ({event.status})</h2>
          <button
            type="button"
            className="event-modal-close"
            onClick={onClose}
            aria-label="Close event details"
          >
            ×
          </button>
        </div>

        <div className="event-modal-content">
          <p><strong>Date & Time:</strong> {formatDateTime(event.datetime)} {getDurationLeft(event.datetime) || 'Ended'}</p>
          <p><strong>Description:</strong></p>
          <div className="event-modal-description-box">{event.description}</div>

          {event.remarks?.trim() && <><p><strong>Remarks:</strong></p><div className="event-modal-description-box">{event.remarks}</div></>}

          <div className="event-modal-actions">
            {event.status === 'Pending' && (
              <>
                <button
                  type="button"
                  className="event-modal-action-btn event-modal-action-complete"
                  onClick={() => onUpdateStatus(event.id, 'Completed')}
                >
                  Complete
                </button>
                <button
                  type="button"
                  className="event-modal-action-btn event-modal-action-active"
                  onClick={() => onUpdateStatus(event.id, 'Active')}
                >
                  Set Active
                </button>
              </>
            )}
            {event.status === 'Active' && (
              <button
                type="button"
                className="event-modal-action-btn event-modal-action-complete"
                onClick={() => onUpdateStatus(event.id, 'Completed')}
              >
                Complete
              </button>
            )}
            <button
                type="button"
                className="event-modal-action-btn event-modal-action-insights"
                onClick={() => getInsights(event.id)}
              >
                Get Insights
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsModal
