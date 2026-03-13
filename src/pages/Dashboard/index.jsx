import { useState } from 'react'
import DashboardContent from './components/DashboardContent'
import EventDetailsModal from './components/EventDetailsModal'
import './Dashboard.css'

function DashboardPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const [rows, setRows] = useState([
    {
      id: 1,
      name: 'Wears Hats',
      year: 2026,
      datetime: '2026-02-14 14:30',
      description: 'Come down to wear some hats again ',
      status: 'Active',
      remarks: 'test',
    },
    {
      id: 2,
      name: 'Wears Hats',
      year: 2025,
      datetime: '2025-11-03 09:00',
      description: 'Come down to wear some hats',
      status: 'Completed',
      remarks: 'test',
    },
    {
      id: 3,
      name: 'Take out hats',
      year: 2026,
      datetime: '2026-06-20 17:45',
      description: 'We dont like hats',
      status: 'Active',
      remarks: 'test',
    },
    {
      id: 4,
      name: 'Drop Hats',
      year: 2026,
      datetime: '2026-08-01 11:15',
      description: 'We put hats on floor',
      status: 'Pending',
    },
  ])

  const statusOptions = ['All', 'Active', 'Pending', 'Completed']

  const sortedRows = [...rows].sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year
    }

    const timeA = new Date(a.datetime.replace(' ', 'T')).getTime()
    const timeB = new Date(b.datetime.replace(' ', 'T')).getTime()
    return timeB - timeA
  })

  const filteredRows =
    selectedStatus === 'All'
      ? sortedRows
      : sortedRows.filter((row) => row.status === selectedStatus)

  const handleStatusSelect = (status) => {
    setSelectedStatus(status)
    setIsFilterOpen(false)
  }

  const handleUpdateEventStatus = (eventId, nextStatus) => {
    setRows((previousRows) =>
      previousRows.map((row) =>
        row.id === eventId
          ? {
              ...row,
              status: nextStatus,
            }
          : row,
      ),
    )

    setSelectedEvent((previousEvent) =>
      previousEvent && previousEvent.id === eventId
        ? {
            ...previousEvent,
            status: nextStatus,
          }
        : previousEvent,
    )
  }

  const handleGetInsights = (eventId) => {
    const mockInsights = [
      'High expected turnout based on similar events.',
      'Consider adding more volunteers for smoother flow.',
      'Promote this event 3-5 days earlier to boost attendance.',
      'Most likely to perform best in late afternoon slots.',
    ]

    const selectedInsight = mockInsights[eventId % mockInsights.length]

    setRows((previousRows) =>
      previousRows.map((row) =>
        row.id === eventId
          ? {
              ...row,
              remarks: selectedInsight,
            }
          : row,
      ),
    )

    setSelectedEvent((previousEvent) =>
      previousEvent && previousEvent.id === eventId
        ? {
            ...previousEvent,
            remarks: selectedInsight,
          }
        : previousEvent,
    )
  }

  const formatDateTime = (rawDateTime) => {
    const [datePart, timePart] = rawDateTime.split(' ')
    const [, month, day] = datePart.split('-').map(Number)
    const [hour24, minute] = timePart.split(':').map(Number)

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const period = hour24 >= 12 ? 'PM' : 'AM'
    const hour12 = hour24 % 12 || 12

    return `${day} ${months[month - 1]} ${hour12}:${String(minute).padStart(2, '0')} ${period}`
  }

  const getDurationLeft = (rawDateTime) => {
    const eventDate = new Date(rawDateTime.replace(' ', 'T'))
    const now = new Date()

    const diffMs = eventDate.getTime() - now.getTime()
    const dayMs = 1000 * 60 * 60 * 24

    if (diffMs < 0) {
      return ''
    }
    if (diffMs < dayMs) {
      return '(today)'
    }

    const diffDays = diffMs / dayMs

    if (diffDays < 30) {
      const days = Math.ceil(diffDays)
      return `(${days} day${days === 1 ? '' : 's'})`
    }

    const months = Math.ceil(diffDays / 30)
    return `(${months} month${months === 1 ? '' : 's'})`
  }


  return (
    <main className="dashboard-page">
      <section className="dashboard-card" aria-label="Dashboard">
        <h1>View Events</h1>

        <div className="dashboard-table-toolbar">
          <div className="dashboard-filter-menu">
            <button
              type="button"
              className="dashboard-filter-button"
              onClick={() => setIsFilterOpen((previous) => !previous)}
              aria-haspopup="menu"
              aria-expanded={isFilterOpen}
            >
              Filter by status: {selectedStatus} ▾
            </button>

            {isFilterOpen && (
              <div className="dashboard-filter-dropdown" role="menu" aria-label="Filter by status">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={status === selectedStatus ? 'active' : ''}
                    role="menuitem"
                    onClick={() => handleStatusSelect(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="event-grid" aria-label="Event records">
          <DashboardContent
            filteredRows={filteredRows}
            setSelectedEvent={setSelectedEvent}
            formatDateTime={formatDateTime}
            getDurationLeft={getDurationLeft}
          />
        </div>

        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          formatDateTime={formatDateTime}
          getDurationLeft={getDurationLeft}
          onUpdateStatus={handleUpdateEventStatus}
          getInsights={handleGetInsights}
        />
      </section>
    </main>
  )
}

export default DashboardPage
