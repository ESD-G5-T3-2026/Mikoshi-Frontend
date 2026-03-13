function DashboardContent({ filteredRows, setSelectedEvent, formatDateTime, getDurationLeft }) {
  return filteredRows.map((row, index) => (
    <article
      className="event-card"
      key={`${row.id}-${row.name}-${row.year}-${index}`}
      role="button"
      tabIndex={0}
      onClick={() => setSelectedEvent(row)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setSelectedEvent(row)
        }
      }}
    >
      <div className="event-card-top">
        <h2>{row.name} {row.year}</h2>
      </div>
      <p>
        <span className="event-datetime">{formatDateTime(row.datetime)}</span> {getDurationLeft(row.datetime)}
      </p>
      <p className="event-description">{row.description}</p>

      <p className="event-status">
        Status: <span className={`status-${row.status.toLowerCase()}`}> {row.status} </span>
      </p>
    </article>
  ))
}

export default DashboardContent
