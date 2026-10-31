
import { useEffect, useState } from 'react';
import { getEvents } from '../services/eventService';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        const result = await getEvents();

        if (result.success && Array.isArray(result.data)) {
          setEvents(result.data);
        } else {
          setError('Events data could not be loaded correctly.');
        }
      } catch (err) {
        setError('Events could not be loaded. Please check the backend.');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return <p className="status-message">Loading events...</p>;
  }

  if (error) {
    return (
      <p className="status-message error-message" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section className="events-page">
      <div className="page-heading">
        <span className="page-eyebrow">CAMPUS ACTIVITIES</span>
        <h1>Campus Events</h1>
        <p>Discover activities and events happening on campus.</p>
      </div>

      {events.length === 0 ? (
        <p className="status-message">
          No events are available in the campus database.
        </p>
      ) : (
        <div className="events-grid">
          {events.map((event) => {
            const eventDate = event.date
              ? new Date(event.date)
              : event.startDate
                ? new Date(event.startDate)
                : null;

            const validDate =
              eventDate && !Number.isNaN(eventDate.getTime());

            return (
              <article
                className="event-card"
                key={event._id}
              >
                <div className="event-card-top">
                  <span className="event-category">
                    {event.category || 'General'}
                  </span>

                  {event.status && (
                    <span className="event-status">
                      {event.status}
                    </span>
                  )}
                </div>

                <h2>{event.title || 'Untitled Event'}</h2>

                {event.description && (
                  <p className="event-description">
                    {event.description}
                  </p>
                )}

                <div className="event-details">
                  {validDate && (
                    <p>
                      <strong>Date:</strong>{' '}
                      {eventDate.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}

                  {(event.time || event.startTime) && (
                    <p>
                      <strong>Time:</strong>{' '}
                      {event.time || event.startTime}
                    </p>
                  )}

                  {typeof event.venue === 'string'
  ? event.venue
  : typeof event.location === 'string'
    ? event.location
    : event.location?.name || event.venue?.name || '' && (
                    <p>
                      <strong>Venue:</strong>{' '}
                      {event.venue || event.location}
                    </p>
                  )}

                  {event.organizer?.name && (
                    <p>
                      <strong>Organizer:</strong>{' '}
                      {event.organizer.name}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Events;
