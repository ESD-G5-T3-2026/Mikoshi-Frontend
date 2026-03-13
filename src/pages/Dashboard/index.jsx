import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DashboardContent from './components/DashboardContent'
import EventDetailsModal from './components/EventDetailsModal'
import { getEvents } from '../../services/eventApi'
import { showToast } from '../../store/toast'
import './Dashboard.css'

function DashboardPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [rows, setRows] = useState([])

  useEffect(() => {
    const normalizeDateTime = (value) => {
      if (!value) {
        return ''
      }

      if (typeof value === 'string') {
        const trimmedValue = value.trim()

        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(trimmedValue)) {
          return trimmedValue.slice(0, 16)
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
          return `${trimmedValue} 00:00`
        }

        if (trimmedValue.includes('T')) {
          return trimmedValue.replace('T', ' ').slice(0, 16)
        }
      }

      const parsedDate = new Date(value)
      if (Number.isNaN(parsedDate.getTime())) {
        return ''
      }

      const year = parsedDate.getFullYear()
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
      const day = String(parsedDate.getDate()).padStart(2, '0')
      const hour = String(parsedDate.getHours()).padStart(2, '0')
      const minute = String(parsedDate.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day} ${hour}:${minute}`
    }

    const normalizeStatus = (value) => {
      if (!value || typeof value !== 'string') {
        return 'Pending'
      }

      const lowered = value.toLowerCase()
      if (lowered === 'active') {
        return 'Active'
      }
      if (lowered === 'completed') {
        return 'Completed'
      }
      if (lowered === 'pending') {
        return 'Pending'
      }
      return 'Pending'
    }

    const mapEventRow = (eventRow, index) => {
      const datetime = normalizeDateTime(
        eventRow?.event_date
      )
      const parsedDate = datetime ? new Date(datetime.replace(' ', 'T')) : null
      const derivedYear =
        eventRow?.event_year || (parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.getFullYear() : null)

      return {
        id: eventRow?.id ?? eventRow?.event_id ?? index,
        name: eventRow?.event_name|| 'Untitled Event',
        year: derivedYear || new Date().getFullYear(),
        datetime,
        description: eventRow?.event_desc  || '',
        status: normalizeStatus(eventRow?.event_status),
        remarks: eventRow?.remarks || '',
      }
    }

    const loadEvents = async () => {
      if (!user?.club_id) {
        setRows([])
        return
      }

      try {
        const eventData = await getEvents(user.club_id)
        const rawEvents = Array.isArray(eventData)
          ? eventData
          : Array.isArray(eventData?.data)
            ? eventData.data
            : []

        setRows(rawEvents.map(mapEventRow))
      } catch {
        setRows([])
        dispatch(showToast('Failed to load events.', 'error'))
      }
    }

    loadEvents()
  }, [dispatch, user?.club_id])

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
    if (!rawDateTime) {
      return '-'
    }

    const [datePart, timePart] = rawDateTime.split(' ')
    if (!datePart || !timePart) {
      return rawDateTime
    }

    const [, month, day] = datePart.split('-').map(Number)
    const [hour24, minute] = timePart.split(':').map(Number)

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const period = hour24 >= 12 ? 'PM' : 'AM'
    const hour12 = hour24 % 12 || 12

    return `${day} ${months[month - 1]} ${hour12}:${String(minute).padStart(2, '0')} ${period}`
  }

  const getDurationLeft = (rawDateTime) => {
    if (!rawDateTime) {
      return ''
    }

    const eventDate = new Date(rawDateTime.replace(' ', 'T'))
    if (Number.isNaN(eventDate.getTime())) {
      return ''
    }

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
