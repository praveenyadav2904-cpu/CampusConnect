
import { useEffect, useState } from 'react';
import {
  submitComplaint,
  getComplaints,
} from '../services/complaintService';

function Complaints() {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [description, setDescription] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  // MongoDB se saved complaints load karo
  async function loadComplaints() {
    try {
      const result = await getComplaints();

      if (result.success && Array.isArray(result.data)) {
        setComplaints(result.data);
      } else {
        setMessage('Could not load complaints from the database.');
      }
    } catch (error) {
      setMessage('Could not load complaints. Please check the backend.');
      console.error('Failed to load complaints:', error);
    } finally {
      setLoadingComplaints(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (!subject.trim() || !description.trim()) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const result = await submitComplaint({
        subject: subject.trim(),
        category,
        description: description.trim(),
      });

      if (!result.success || !result.data) {
        setMessage('Complaint could not be submitted. Please try again.');
        return;
      }

      setSubject('');
      setCategory('Infrastructure');
      setDescription('');
      setMessage('Complaint submitted and saved successfully.');

      // Database se updated list dobara load karo
      await loadComplaints();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Complaint could not be submitted. Please check the backend.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="complaints-page">
      <div className="page-heading">
        <span className="page-eyebrow">STUDENT SUPPORT</span>
        <h1>Complaints & Feedback</h1>
        <p>Submit an issue for the relevant team to review.</p>
      </div>

      <div className="complaints-form-card">
        <h2>Submit a Complaint</h2>
        <p>Describe your concern so the relevant team can review it.</p>

        <form onSubmit={handleSubmit} className="complaint-form">
          <label htmlFor="complaint-subject">Subject *</label>
          <input
            id="complaint-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Enter complaint subject"
            maxLength={100}
            required
          />

          <label htmlFor="complaint-category">Category *</label>
          <select
            id="complaint-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Infrastructure</option>
            <option>Library</option>
            <option>Hostel</option>
            <option>Transport</option>
            <option>Academic</option>
            <option>Other</option>
          </select>

          <label htmlFor="complaint-description">Description *</label>
          <textarea
            id="complaint-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Explain the issue..."
            rows={4}
            maxLength={1000}
            required
          />

          <button
            type="submit"
            className="complaint-submit-button"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>

          {message && (
            <p className="complaint-message" role="status">
              {message}
            </p>
          )}
        </form>
      </div>

      <h2 className="complaints-section-title">Recent Complaints</h2>

      {loadingComplaints ? (
        <p className="status-message">Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p className="status-message">
          No complaints are available in the campus database.
        </p>
      ) : (
        <div className="complaints-list">
          {complaints.map((complaint) => (
            <article className="complaint-card" key={complaint._id}>
              <div className="complaint-card-header">
                <span className="complaint-category">
                  {complaint.category || 'Other'}
                </span>

                <span
                  className={`complaint-status complaint-status-${String(
                    complaint.status || 'Submitted'
                  )
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                >
                  {complaint.status || 'Submitted'}
                </span>
              </div>

              <h3>{complaint.subject}</h3>
              <p>{complaint.description}</p>

              <div className="complaint-date">
                Submitted:{' '}
                {complaint.createdAt
                  ? new Date(complaint.createdAt).toLocaleDateString('en-GB')
                  : 'Date unavailable'}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Complaints;
