
import { useEffect, useState } from 'react';
import { getFaculty } from '../services/facultyService';

function Faculty() {
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFaculty() {
      try {
        const result = await getFaculty();

        if (result.success && Array.isArray(result.data)) {
          setFacultyMembers(result.data);
        } else {
          setError('Faculty data could not be loaded correctly.');
        }
      } catch (err) {
        setError('Faculty could not be loaded. Please check the backend.');
      } finally {
        setLoading(false);
      }
    }

    loadFaculty();
  }, []);

  if (loading) {
    return <p className="status-message">Loading faculty...</p>;
  }

  if (error) {
    return (
      <p className="status-message error-message" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section className="faculty-page">
      <div className="page-heading">
        <span className="page-eyebrow">PEOPLE AT CAMPUS</span>
        <h1>Faculty Directory</h1>
        <p>Find faculty members and their department information.</p>
      </div>

      {facultyMembers.length === 0 ? (
        <p className="status-message">
          No faculty records are available in the campus database.
        </p>
      ) : (
        <div className="faculty-grid">
          {facultyMembers.map((faculty) => {
            const name =
              typeof faculty.name === 'string'
                ? faculty.name
                : faculty.name?.name || 'Name unavailable';

            const department =
              typeof faculty.department === 'string'
                ? faculty.department
                : faculty.department?.name ||
                  (typeof faculty.departmentId === 'string'
                    ? faculty.departmentId
                    : faculty.departmentId?.name) ||
                  'Not specified';

            const designation =
              typeof faculty.designation === 'string'
                ? faculty.designation
                : faculty.designation?.name || 'Not specified';

            const email =
              typeof faculty.email === 'string'
                ? faculty.email
                : 'Not available';

            const initials = name
              .split(' ')
              .filter((part) => !['Dr.', 'Prof.', 'Mr.', 'Ms.'].includes(part))
              .map((part) => part[0])
              .slice(0, 2)
              .join('');

            return (
              <article
                className="faculty-card"
                key={faculty._id}
              >
                <div className="faculty-avatar">
                  {initials || 'F'}
                </div>

                <h2>{name}</h2>

                <p className="faculty-designation">
                  {designation}
                </p>

                <div className="faculty-details">
                  <p>
                    <strong>Department</strong>
                    <span>{department}</span>
                  </p>

                  <p>
                    <strong>Email</strong>
                    <span>{email}</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Faculty;
