import { useEffect, useState } from 'react'
import './App.css'
const API_URL = 'http://localhost:5000/api/events'
function EventCard({ id, title, topic, date, status, budget, description, onView, onEdit, onDelete }) {
  return (
    <article className="event-card">
      <div className="event-card-main">
        <div>
          <h2>
            <button className="event-title-button" type="button" onClick={onView}>
              {title}
            </button>
          </h2>
          <p>{topic}</p>
          <p>{description}</p>
        </div>
      </div>
      <span className={`status-label status-${status.toLowerCase()}`}>
        <span className="status-dot" aria-hidden="true" />
        {status}
      </span>
      
      <time dateTime={date}>{formatEventDate(date)}</time>
      <span className="event-card-budget">{formatBudget(budget)}</span>
      <div className="event-actions">
        <button className="icon-button view-button" type="button" aria-label={`View ${title}`} onClick={onView}>
          View
        </button>
        <button className="icon-button edit-button" type="button" aria-label={`Edit ${title}`} onClick={onEdit}>
          Edit
        </button>
        <button className="icon-button card-menu" type="button" aria-label={`Delete ${title}`} onClick={() => onDelete(id)}>
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </article>
  )
}
function formatEventDate(dateString) {
  const [year, month, day] = dateString.slice(0, 10).split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(date)
}
function formatBudget(amount) {
  return new Intl.NumberFormat().format(amount)
}

function createEmptyDraft() {
  return {
    title: '',
    topic: '',
    date: '',
    status: 'Planning',
    budget: '',
    description: '',
  }
}

function EventCalendar({ events, onViewEvent }) {
  const [displayMonth, setDisplayMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from(
    { length: firstWeekday + daysInMonth },
    (_, index) => index - firstWeekday + 1,
  )

  function getDateKey(day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function shiftMonth(amount) {
    setDisplayMonth(new Date(year, month + amount, 1))
  }

  return (
    <section className="calendar-view" aria-label="Event calendar">
      <div className="calendar-controls">
        <h2>{new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(displayMonth)}</h2>
        <div>
          <button type="button" onClick={() => setDisplayMonth(new Date())}>Today</button>
          <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">Previous</button>
          <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">Next</button>
        </div>
      </div>
      <div className="calendar-grid" role="grid" aria-label="Monthly events">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((weekday) => (
          <div className="calendar-weekday" role="columnheader" key={weekday}>{weekday}</div>
        ))}
        {days.map((day, index) => {
          if (day < 1) {
            return <div className="calendar-day calendar-day-empty" role="gridcell" key={`empty-${index}`} />
          }

          const dateKey = getDateKey(day)
          const dayEvents = events.filter((event) => event.date.slice(0, 10) === dateKey)

          return (
            <div className="calendar-day" role="gridcell" key={dateKey}>
              <span className="calendar-day-number">{day}</span>
              <div className="calendar-day-events">
                {dayEvents.map((event) => (
                  <button
                    className="calendar-event"
                    type="button"
                    key={event._id || event.id}
                    onClick={() => onViewEvent(event)}
                    title={event.title}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function App() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('event-planner-theme') || 'light')
  const [query, setQuery] = useState('')
  const [activeView, setActiveView] = useState('events')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [draftEvent, setDraftEvent] = useState(createEmptyDraft)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('event-planner-theme', theme)
  }, [theme])

  useEffect(() => {
  async function loadEvents() {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Could not load events.')
      setEvents(await response.json())
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setIsLoading(false)
    }
  }

  loadEvents()
}, [])

  useEffect(() => {
    if (!selectedEvent) return

    function closeOnEscape(event) {
      if (event.key === 'Escape') setSelectedEvent(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedEvent])

  async function deleteEvent(eventId) {
  setError('')
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Could not delete event.')
    }

    setEvents((currentEvents) =>
      currentEvents.filter((event) => (event._id || event.id) !== eventId),
    )
  } catch (deleteError) {
    setError(deleteError.message)
  }
}

  function resetEventForm() {
    setDraftEvent(createEmptyDraft())
    setEditingEventId(null)
    setIsFormOpen(false)
  }

  function openNewEventForm() {
    setError('')
    setDraftEvent(createEmptyDraft())
    setEditingEventId(null)
    setIsFormOpen(true)
  }

  function startEditingEvent(event) {
    setError('')
    setDraftEvent({
      title: event.title,
      topic: event.topic,
      date: event.date.slice(0, 10),
      status: event.status,
      budget: String(event.budget),
      description: event.description || '',
    })
    setEditingEventId(event._id || event.id)
    setIsFormOpen(true)
  }

  async function saveEvent(event) {
  event.preventDefault()
  setError('')

  const eventData = {
    ...draftEvent,
    budget: Number(draftEvent.budget),
  }

  try {
    const isEditing = editingEventId !== null
    const response = await fetch(
      isEditing ? `${API_URL}/${editingEventId}` : API_URL,
      {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      },
    )
    const savedEvent = await response.json()

    if (!response.ok) {
      throw new Error(savedEvent.message || `Could not ${isEditing ? 'update' : 'create'} event.`)
    }

    setEvents((currentEvents) =>
      isEditing
        ? currentEvents.map((currentEvent) =>
            (currentEvent._id || currentEvent.id) === editingEventId
              ? savedEvent
              : currentEvent,
          )
        : [...currentEvents, savedEvent],
    )
    setQuery('')
    resetEventForm()
  } catch (saveError) {
    setError(saveError.message)
  }
}
  const filteredEvents = events.filter((event) =>
    `${event.title} ${event.topic} ${event.status} ${event.description}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Gather events home">
          <span className="brand-mark">G</span>
          <span>Gather</span>
        </a>

        <nav className="primary-nav" aria-label="Main navigation">
          <button className={`nav-item ${activeView === 'events' ? 'active' : ''}`} type="button" onClick={() => setActiveView('events')}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2"/><path d="M5 1v4M11 1v4M2 7h12"/></svg>
            Events
            <span className="nav-count">{events.length}</span>
          </button>
          <button className={`nav-item ${activeView === 'calendar' ? 'active' : ''}`} type="button" onClick={() => setActiveView('calendar')}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2"/><path d="M5 1v4M11 1v4M2 7h12"/></svg>
            Calendar
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className="theme-button"
            type="button"
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              {theme === 'light'
                ? <><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M12.95 3.05l-1.42 1.42M4.47 11.53l-1.42 1.42"/></>
                : <path d="M13.2 10.3A6 6 0 0 1 5.7 2.8a6 6 0 1 0 7.5 7.5Z"/>}
            </svg>
            {theme === 'light' ? 'Light' : 'Dark'}
          </button>
          <button className="profile-button" type="button" aria-label="Open account menu">
            <span className="avatar">AR</span>
            <span className="profile-name">
              <strong>Alex Rivera</strong>
              <small>Personal</small>
            </span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="breadcrumb">Workspace / {activeView === 'events' ? 'Events' : 'Calendar'}</p>
            <h1>{activeView === 'events' ? 'Events' : 'Calendar'}</h1>
          </div>
          <button className="primary-button" type="button" onClick={openNewEventForm}
            >
            <span aria-hidden="true">+</span>
            New event
          </button>
        </header>
                  {isFormOpen && (
            <form className="event-form" onSubmit={saveEvent}>
              <h2>{editingEventId ? 'Edit event' : 'New event'}</h2>

              <label>
                Title
                <input
                  type="text"
                  required
                  value={draftEvent.title}
                  onChange={(event) =>
                    setDraftEvent((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
              Topic
                <input
                  type="text"
                  required
                  value={draftEvent.topic}
                  onChange={(event) =>
                    setDraftEvent((current) => ({
                      ...current,
                      topic: event.target.value,
                    }))
                  }
                />
            </label>
            <label>
              Status
              <select
                value={draftEvent.status}
                onChange={(event) =>
                  setDraftEvent((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
              >
                <option value="Planning">Planning</option>
                <option value="Confirmed">Confirmed</option>
              </select>
            </label>
            <label>
              Description
              <textarea
                rows="2"
                value={draftEvent.description}
                onChange={(event) =>
                  setDraftEvent((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Date
              <input
                type="date"
                required
                value={draftEvent.date}
                onChange={(event) =>
                  setDraftEvent((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Budget
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={draftEvent.budget}
                onChange={(event) =>
                  setDraftEvent((current) => ({
                    ...current,
                    budget: event.target.value,
                  }))
                }
              />
            </label>
            <button type="submit">{editingEventId ? 'Save changes' : 'Add event'}</button>
              <button
                    type="button"
                    onClick={resetEventForm}
                  >
                    Cancel
            </button>
            </form>
)}
          {error && <p role="alert">{error}</p>}
        {activeView === 'events' ? (
          <>
            <section className="toolbar" id="events" aria-label="Event controls">
              <label className="search-field">
                <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>
                <span className="sr-only">Search events</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search events"
                />
              </label>
              <button className="filter-button" type="button">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3h12M4 8h8M6 13h4"/></svg>
                Filter
              </button>
            </section>

            <section className="event-table" aria-label="Event list">
              <div className="table-heading">
                <span>Event</span>
                <span>Status</span>
                <span>Date</span>
                <span>Budget</span>
                <span aria-hidden="true" />
              </div>
              {isLoading ? (
                <div className="empty-state">
                  <p>Loading events...</p>
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className="event-list">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event._id || event.id}
                      id={event._id || event.id}
                      title={event.title}
                      topic={event.topic}
                      date={event.date}
                      status={event.status}
                      budget={event.budget}
                      description={event.description}
                      onView={() => setSelectedEvent(event)}
                      onEdit={() => startEditingEvent(event)}
                      onDelete={deleteEvent}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h2>No matching events</h2>
                  <p>Try a different search.</p>
                </div>
              )}
            </section>
          </>
        ) : isLoading ? (
          <div className="empty-state"><p>Loading events...</p></div>
        ) : (
          <EventCalendar events={events} onViewEvent={setSelectedEvent} />
        )}

        {selectedEvent && (
          <div
            className="dialog-backdrop"
            onClick={() => setSelectedEvent(null)}
          >
            <section
              className="event-details-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="event-details-title"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="event-details-header">
                <h2 id="event-details-title">{selectedEvent.title}</h2>
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Close event details"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </button>
              </header>
              <dl className="event-details-list">
                <dt>Topic</dt><dd>{selectedEvent.topic}</dd>
                <dt>Description</dt><dd>{selectedEvent.description || 'No description'}</dd>
                <dt>Status</dt><dd>{selectedEvent.status}</dd>
                <dt>Date</dt><dd>{formatEventDate(selectedEvent.date)}</dd>
                <dt>Budget</dt><dd>{formatBudget(selectedEvent.budget)}</dd>
              </dl>
            </section>
          </div>
        )}

        <footer className="page-footer">
          <span>{activeView === 'events' ? filteredEvents.length : events.length} events</span>
          <span>Updated just now</span>
        </footer>
      </main>
    </div>
  )
}

export default App
