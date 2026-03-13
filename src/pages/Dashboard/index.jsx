import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CreateEventModal from './components/CreateEventModal'
import DashboardContent from './components/DashboardContent'
import EventDetailsModal from './components/EventDetailsModal'
import { createEvent, getEvents, updateEventStatus } from '../../services/eventApi'
import { showToast } from '../../store/toast'
import './Dashboard.css'

const GET_EVENTS_REQUEST = 'events/GET_EVENTS_REQUEST'
const GET_EVENTS_SUCCESS = 'events/GET_EVENTS_SUCCESS'
const GET_EVENTS_FAILURE = 'events/GET_EVENTS_FAILURE'
const CREATE_EVENT_REQUEST = 'events/CREATE_EVENT_REQUEST'
const CREATE_EVENT_SUCCESS = 'events/CREATE_EVENT_SUCCESS'
const CREATE_EVENT_FAILURE = 'events/CREATE_EVENT_FAILURE'
const UPDATE_EVENT_STATUS_REQUEST = 'events/UPDATE_EVENT_STATUS_REQUEST'
const UPDATE_EVENT_STATUS_SUCCESS = 'events/UPDATE_EVENT_STATUS_SUCCESS'
const UPDATE_EVENT_STATUS_FAILURE = 'events/UPDATE_EVENT_STATUS_FAILURE'
const UPDATE_EVENT_DETAILS_REQUEST = 'events/UPDATE_EVENT_DETAILS_REQUEST'
const UPDATE_EVENT_DETAILS_SUCCESS = 'events/UPDATE_EVENT_DETAILS_SUCCESS'
const UPDATE_EVENT_DETAILS_FAILURE = 'events/UPDATE_EVENT_DETAILS_FAILURE'

const initialCreateEventForm = {
  event_name: '',
  event_year: '',
  event_date: '',
  event_type: '',
  event_status: 'Pending',
  event_desc: '',
  remarks: '',
}

function DashboardPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createEventForm, setCreateEventForm] = useState(initialCreateEventForm)
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
        type: eventRow?.event_type || '',
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

      dispatch({ type: GET_EVENTS_REQUEST })

      try {
        const eventData = await getEvents(user.club_id)
        const rawEvents = Array.isArray(eventData)
          ? eventData
          : Array.isArray(eventData?.data)
            ? eventData.data
            : []

        setRows(rawEvents.map(mapEventRow))
        dispatch({ type: GET_EVENTS_SUCCESS })
      } catch {
        setRows([])
        dispatch({ type: GET_EVENTS_FAILURE })
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

  const handleOpenCreateModal = () => {
    setCreateEventForm(initialCreateEventForm)
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleCreateEventChange = (event) => {
    const { name, value } = event.target

    setCreateEventForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }))
  }

  const handleCreateEventSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      event_name: createEventForm.event_name.trim(),
      event_year: Number(createEventForm.event_year),
      event_date: createEventForm.event_date,
      event_type: createEventForm.event_type.trim(),
      event_status: createEventForm.event_status,
      event_desc: createEventForm.event_desc.trim(),
      remarks: createEventForm.remarks.trim(),
      run_by_club: user?.club_id,
    }

    dispatch({ type: CREATE_EVENT_REQUEST })

    try {
      const responseData = await createEvent(payload)
      const createdEvent = responseData?.data || responseData?.event || responseData

      setRows((previousRows) => [
        {
          id: createdEvent?.id ?? createdEvent?.event_id ?? Date.now(),
          name: createdEvent?.event_name ?? payload.event_name,
          year: createdEvent?.event_year ?? payload.event_year,
          datetime: createdEvent?.event_date ? `${createdEvent.event_date} 00:00` : `${payload.event_date} 00:00`,
          type: createdEvent?.event_type ?? payload.event_type,
          description: createdEvent?.event_desc ?? payload.event_desc,
          status: createdEvent?.event_status ?? payload.event_status,
          remarks: createdEvent?.remarks ?? payload.remarks,
        },
        ...previousRows,
      ])

      dispatch({ type: CREATE_EVENT_SUCCESS })
      dispatch(showToast('Event created successfully.', 'success'))
      setCreateEventForm(initialCreateEventForm)
      setIsCreateModalOpen(false)
    } catch {
      dispatch({ type: CREATE_EVENT_FAILURE })
      dispatch(showToast('Failed to create event.', 'error'))
    }
  }

  const handleUpdateEventStatus = async (eventId, nextStatus) => {
    const currentEvent = rows.find((row) => row.id === eventId)
    if (!currentEvent) {
      return
    }

    setSelectedEvent(null)

    const payload = {
      event_id: eventId,
      event_name: currentEvent.name,
      event_year: Number(currentEvent.year),
      event_date: currentEvent.datetime ? currentEvent.datetime.split(' ')[0] : '',
      event_type: currentEvent.type,
      event_desc: currentEvent.description,
      event_status: nextStatus,
      remarks: currentEvent.remarks,
      run_by_club: user?.club_id,
    }

    dispatch({ type: UPDATE_EVENT_STATUS_REQUEST })

    try {
      await updateEventStatus({Event: payload})

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

      dispatch({ type: UPDATE_EVENT_STATUS_SUCCESS })
      dispatch(showToast(`Event status updated to ${nextStatus}.`, 'success'))
    } catch {
      dispatch({ type: UPDATE_EVENT_STATUS_FAILURE })
      dispatch(showToast('Failed to update event status.', 'error'))
    }
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

  const handleUpdateEventDetails = async (eventId, nextValues) => {
    const currentEvent = rows.find((row) => row.id === eventId)
    if (!currentEvent) {
      return false
    }

    const payload = {
      event_id: eventId,
      event_name: nextValues.event_name.trim(),
      event_year: Number(nextValues.event_year),
      event_date: nextValues.event_date,
      event_type: nextValues.event_type.trim(),
      event_desc: nextValues.event_desc.trim(),
      event_status: currentEvent.status,
      remarks: nextValues.remarks.trim(),
      run_by_club: user?.club_id,
    }

    dispatch({ type: UPDATE_EVENT_DETAILS_REQUEST })

    try {
      await updateEventStatus({ Event: payload })

      setRows((previousRows) =>
        previousRows.map((row) =>
          row.id === eventId
            ? {
                ...row,
                name: payload.event_name,
                year: payload.event_year,
                datetime: `${payload.event_date} 00:00`,
                description: payload.event_desc,
                remarks: payload.remarks,
                type: payload.event_type,
              }
            : row,
        ),
      )

      setSelectedEvent((previousEvent) =>
        previousEvent && previousEvent.id === eventId
          ? {
              ...previousEvent,
              name: payload.event_name,
              year: payload.event_year,
              datetime: `${payload.event_date} 00:00`,
              description: payload.event_desc,
              remarks: payload.remarks,
              type: payload.event_type,
            }
          : previousEvent,
      )

      dispatch({ type: UPDATE_EVENT_DETAILS_SUCCESS })
      dispatch(showToast('Event updated successfully.', 'success'))
      setSelectedEvent(null)
      return true
    } catch {
      dispatch({ type: UPDATE_EVENT_DETAILS_FAILURE })
      dispatch(showToast('Failed to update event.', 'error'))
      return false
    }
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
        <div className="dashboard-header-row">
          <h1>View Events</h1>
          <button
            type="button"
            className="dashboard-add-button"
            aria-label="Add event"
            onClick={handleOpenCreateModal}
          >
            <span className="dashboard-add-button-icon">+</span>
          </button>
        </div>

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
          onUpdateEvent={handleUpdateEventDetails}
        />

        <CreateEventModal
          key={isCreateModalOpen ? 'create-event-modal-open' : 'create-event-modal-closed'}
          isOpen={isCreateModalOpen}
          form={createEventForm}
          onClose={handleCloseCreateModal}
          onChange={handleCreateEventChange}
          onSubmit={handleCreateEventSubmit}
        />
      </section>
    </main>
  )
}

export default DashboardPage
