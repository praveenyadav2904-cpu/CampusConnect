
import { useEffect, useState } from 'react';
import { getDepartments } from '../services/departmentService';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDepartments() {
      try {
        const result = await getDepartments();

        if (result.success && Array.isArray(result.data)) {
          setDepartments(result.data);
        } else {
          setError('Departments data ka format sahi nahi hai.');
        }
      } catch (err) {
        setError('Departments load nahi ho paaye. Backend check karo.');
      } finally {
        setLoading(false);
      }
    }

    loadDepartments();
  }, []);

  if (loading) {
    return <div className="status-message">Loading departments...</div>;
  }

  if (error) {
    return (
      <div className="status-message error-message" role="alert">
        {error}
      </div>
    );
  }

  return (
    <section>
      <div className="page-heading">
        <h1>Departments</h1>
        <p>Explore departments available on your campus.</p>
      </div>

      {departments.length === 0 ? (
        <div className="status-message">No departments found.</div>
      ) : (
        <>
          <p className="department-count">
            Showing {departments.length} department(s)
          </p>

          <div className="department-grid">
            {departments.map((department, index) => (
              <article
                className="department-card"
                key={department._id || department.id || index}
              >
                {department.code && (
                  <span className="department-code">
                    {department.code}
                  </span>
                )}

                <h2>
                  {department.name ||
                    department.departmentName ||
                    department.title ||
                    department.code ||
                    `Department ${index + 1}`}
                </h2>

                {department.description && (
                  <p className="department-description">
                    {department.description}
                  </p>
                )}

                {department.hod && (
                  <div className="department-hod">
                    <strong>Head of Department</strong>
                    <br />
                    {typeof department.hod === 'object'
                      ? department.hod.name || 'Not specified'
                      : department.hod}
                  </div>
                )}

                {department.location && (
                  <div className="department-hod">
                    <strong>Location:</strong> {department.location}
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Departments;
