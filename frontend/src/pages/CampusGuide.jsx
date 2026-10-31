
import { useEffect, useState } from 'react';
import { getCampusLocations } from '../services/campusLocationService';
import './CampusGuide.css';

export default function CampusGuide() {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadLocations() {
      setLoading(true);
      setError('');

      try {
        const result = await getCampusLocations({ search });

        if (!active) return;

        const data = Array.isArray(result.data) ? result.data : [];
        setLocations(data);

        setSelectedLocation((current) => {
          if (!current) return null;

          return (
            data.find(
              (item) => item.locationId === current.locationId
            ) || null
          );
        });
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              'Campus locations could not be loaded. Please try again.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadLocations();

    return () => {
      active = false;
    };
  }, [search, retryCount]);

  function getLocationName(location) {
    return (
      location.locationName ||
      location.locationCode ||
      'Unnamed location'
    );
  }

  function getLocationType(location) {
    return location.locationType || 'Campus location';
  }

  function getFacilities(location) {
    if (!location.knownFacilities) return [];

    return Array.isArray(location.knownFacilities)
      ? location.knownFacilities
      : [location.knownFacilities];
  }

  function formatValue(value) {
    if (value == null) return '';

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }

  return (
    <div className="campus-guide-page">
      {/* Header */}
      <header className="campus-guide-header">
        <div>
          <span className="campus-guide-eyebrow">
            CAMPUS CONNECT / EXPLORE
          </span>
          <h1>Campus Guide</h1>
          <p>
            Find campus buildings, facilities and important locations.
          </p>
        </div>

        <span className="campus-guide-badge">
          <span />
          Campus Directory
        </span>
      </header>

      {/* Search */}
      <section className="campus-guide-search">
        <label htmlFor="campus-location-search">
          Search campus locations
        </label>

        <input
          id="campus-location-search"
          type="search"
          placeholder="Search by building, block, facility..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <p>
          Locations are loaded from your campus_locations database collection.
        </p>
      </section>

      {/* Error and retry */}
      {error && (
        <div className="campus-guide-error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main content: locations and details */}
      <section className="campus-guide-layout">
        <div className="campus-location-list-panel">
          <div className="campus-location-list-heading">
            <div>
              <h2>Campus Locations</h2>
              <p>
                {loading
                  ? 'Loading locations...'
                  : `${locations.length} locations found`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="campus-guide-message">
              Loading campus locations...
            </div>
          ) : !error && locations.length === 0 ? (
            <div className="campus-guide-message">
              No locations found. Try a different search.
            </div>
          ) : (
            <div className="campus-location-list">
              {locations.map((location, index) => (
                <button
                  type="button"
                  key={location._id || location.locationId || index}
                  className={`campus-location-card ${
                    selectedLocation?.locationId === location.locationId
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <span className="campus-location-icon">⌖</span>

                  <span className="campus-location-card-copy">
                    <strong>{getLocationName(location)}</strong>
                    <span>{getLocationType(location)}</span>

                    {location.blockName && (
                      <small>{location.blockName}</small>
                    )}
                  </span>

                  <span className="campus-location-arrow">›</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected location details */}
        <div className="campus-location-details-panel">
          {selectedLocation ? (
            <>
              <div className="campus-location-details-icon">⌖</div>

              <span className="campus-guide-eyebrow">
                LOCATION DETAILS
              </span>

              <h2>{getLocationName(selectedLocation)}</h2>

              <span className="campus-location-type">
                {getLocationType(selectedLocation)}
              </span>

              {selectedLocation.locationCode && (
                <p>
                  <strong>Location Code:</strong>{' '}
                  {selectedLocation.locationCode}
                </p>
              )}

              {selectedLocation.blockName && (
                <p>
                  <strong>Block:</strong>{' '}
                  {selectedLocation.blockName}
                </p>
              )}

              {selectedLocation.description && (
                <p>
                  <strong>Description:</strong>{' '}
                  {selectedLocation.description}
                </p>
              )}

              {selectedLocation.relativeLocation && (
                <p>
                  <strong>How to find:</strong>{' '}
                  {formatValue(selectedLocation.relativeLocation)}
                </p>
              )}

              {getFacilities(selectedLocation).length > 0 && (
                <div>
                  <strong>Facilities</strong>
                  <ul>
                    {getFacilities(selectedLocation).map(
                      (facility, index) => (
                        <li key={index}>{formatValue(facility)}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <div className="campus-guide-coordinate-note">
                Interactive map markers and route guidance will require
                verified location coordinates.
              </div>
            </>
          ) : (
            <div className="campus-guide-empty-details">
              <span>⌖</span>
              <h2>Select a location</h2>
              <p>
                Choose a location from the list to see its details.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Small campus map below the main content */}
      <section className="campus-map-section">
        <div className="campus-map-heading">
          <h2>Campus Map</h2>
          <p>
            Galgotias College of Engineering and Technology
          </p>
        </div>

        <div className="campus-map-frame">
          <img
            src="/campus-map.png"
            alt="Galgotias College campus map"
            className="campus-map-image"
            loading="lazy"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="campus-guide-footer">
        Campus Connect <span>·</span> Explore. Discover. Connect.
      </footer>
    </div>
  );
}
