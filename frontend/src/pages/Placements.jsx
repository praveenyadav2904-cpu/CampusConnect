
import { useEffect, useState } from 'react';
import { getPlacements } from '../services/placementService';

function Placements() {
  const [placements, setPlacements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPlacements() {
      try {
        const result = await getPlacements();

        if (result.success && Array.isArray(result.data)) {
          setPlacements(result.data);
        } else {
          setError('Placement data could not be loaded correctly.');
        }
      } catch (err) {
        setError('Placements could not be loaded. Please check the backend.');
      } finally {
        setLoading(false);
      }
    }

    loadPlacements();
  }, []);

  const searchText = searchTerm.trim().toLowerCase();

  const filteredPlacements = placements.filter((job) => {
    const company =
      typeof job.company === 'string' ? job.company : '';
    const role = typeof job.role === 'string' ? job.role : '';
    const eligibility =
      typeof job.eligibility === 'string' ? job.eligibility : '';

    return (
      company.toLowerCase().includes(searchText) ||
      role.toLowerCase().includes(searchText) ||
      eligibility.toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return <p className="status-message">Loading placements...</p>;
  }

  if (error) {
    return (
      <p className="status-message error-message" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section className="placements-page">
      <div className="page-heading">
        <span className="page-eyebrow">CAREER SERVICES</span>
        <h1>Placements &amp; Opportunities</h1>
        <p>Explore placement information available in the campus database.</p>
      </div>

      {placements.some((job) => job.isDemo === true) && (
        <p className="placement-demo-label" role="note">
          DEMO DATA — NOT OFFICIAL PLACEMENT INFORMATION
        </p>
      )}

      <div className="placement-summary">
        <div>
          <span>Listed Opportunities</span>
          <strong>{placements.length}</strong>
        </div>
        <div>
          <span>Currently Open</span>
          <strong>
            {placements.filter((job) => job.status === 'Open').length}
          </strong>
        </div>
      </div>

      <div className="placement-search-wrapper">
        <input
          className="placement-search"
          type="search"
          placeholder="Search company, role or eligibility..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Search placement opportunities"
        />
      </div>

      {filteredPlacements.length === 0 ? (
        <p className="status-message">
          No matching placement opportunities found.
        </p>
      ) : (
        <div className="placements-grid">
          {filteredPlacements.map((job) => (
            <article className="placement-card" key={job._id}>
              <div className="placement-card-top">
                <span className="placement-company-icon">
                  {typeof job.company === 'string'
                    ? job.company.charAt(0)
                    : '?'}
                </span>
                <span className="placement-status">
                  {job.status || 'Status unavailable'}
                </span>
              </div>

              <h2>{job.role || 'Role not specified'}</h2>
              <p className="placement-company">
                {job.company || 'Company not specified'}
              </p>

              <div className="placement-package">
                <span>Package</span>
                <strong>{job.package || 'Not specified'}</strong>
              </div>

              <div className="placement-details">
                <p>
                  <strong>Eligibility:</strong>{' '}
                  {job.eligibility || 'Not specified'}
                </p>
                <p>
                  <strong>Opportunity:</strong>{' '}
                  {job.type || 'Not specified'}
                </p>
                <p>
                  <strong>Deadline:</strong>{' '}
                  {job.deadline
                    ? new Date(`${job.deadline}T12:00:00`).toLocaleDateString(
                        'en-GB'
                      )
                    : 'Not specified'}
                </p>
              </div>

              {job.isDemo === true && (
                <p className="placement-demo-label">
                  Demo opportunity — not an official job listing.
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Placements;
