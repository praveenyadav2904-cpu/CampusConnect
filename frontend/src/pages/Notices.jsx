
import { useEffect, useState } from 'react';
import {
  getNotices,
  createNotice,
  approveNotice,
} from '../services/noticeService';
import './Notices.css';

const initialForm = {
  title: '',
  description: '',
  category: 'Academic',
  priority: 'Normal',
  scope: 'academic',
};

function Notices() {
  const role = sessionStorage.getItem('demoRole');
  const userId = sessionStorage.getItem('demoUserId');

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedNotices, setExpandedNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [approvingId, setApprovingId] = useState('');
  const [form, setForm] = useState(initialForm);

  const canCreate = role === 'faculty' || role === 'admin';

  async function loadNotices() {
    setLoading(true);
    setError('');

    try {
      const result = await getNotices({
        includePending: role === 'admin',
      });

      if (result.success && Array.isArray(result.data)) {
        setNotices(result.data);
      } else {
        setError('Notices data ka format sahi nahi hai.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Notices load nahi ho paaye. Backend aur MongoDB check karo.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotices();
  }, [role]);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handlePublish(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!canCreate) {
      setError('You are not allowed to publish notices.');
      return;
    }

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await createNotice({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        priority: form.priority,
        scope: form.scope,
      });

      if (!result.success) {
        throw new Error(result.message || 'Notice could not be saved.');
      }

      setMessage(result.message || 'Notice saved successfully.');
      setForm(initialForm);
      setShowForm(false);

      await loadNotices();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Notice save nahi hua. Backend check karo.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApprove(noticeId) {
    setError('');
    setMessage('');
    setApprovingId(noticeId);

    try {
      const result = await approveNotice(noticeId);

      if (!result.success) {
        throw new Error(result.message || 'Notice approval failed.');
      }

      setMessage('Official notice approved and published.');
      await loadNotices();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Notice approve nahi hua.'
      );
    } finally {
      setApprovingId('');
    }
  }

  function toggleDescription(id) {
    setExpandedNotices((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  const categories = [
    'All',
    ...new Set(
      notices.map((notice) => notice.category).filter(Boolean)
    ),
  ];

  const filteredNotices = notices.filter((notice) => {
    const searchText = searchTerm.trim().toLowerCase();

    const matchesSearch =
      (notice.title || '').toLowerCase().includes(searchText) ||
      (notice.description || '').toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === 'All' ||
      notice.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <p className="status-message">Loading notices...</p>;
  }

  return (
    <section className="notices-page">
      <div className="page-heading">
        <span className="page-eyebrow">CAMPUS UPDATES</span>
        <h1>Campus Notices</h1>
        <p>Important announcements and campus updates.</p>

        {canCreate && (
          <button
            type="button"
            className="notice-publish-button"
            onClick={() => {
              setShowForm((previous) => !previous);
              setMessage('');
              setError('');
            }}
          >
            {showForm ? 'Cancel' : '+ Create Notice'}
          </button>
        )}
      </div>

      {message && (
        <p className="status-message" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="status-message error-message" role="alert">
          {error}
        </p>
      )}

      {showForm && canCreate && (
        <form className="notice-publish-form" onSubmit={handlePublish}>
          <h2>Create a Notice</h2>

          <label htmlFor="notice-title">Notice Title</label>
          <input
            id="notice-title"
            name="title"
            type="text"
            maxLength={150}
            value={form.title}
            onChange={updateForm}
            placeholder="Enter notice title"
            required
          />

          <label htmlFor="notice-description">Description</label>
          <textarea
            id="notice-description"
            name="description"
            rows={5}
            maxLength={5000}
            value={form.description}
            onChange={updateForm}
            placeholder="Write notice details..."
            required
          />

          <label htmlFor="notice-category">Category</label>
          <select
            id="notice-category"
            name="category"
            value={form.category}
            onChange={updateForm}
          >
            <option value="Academic">Academic</option>
            <option value="Examination">Examination</option>
            <option value="Events">Events</option>
            <option value="General">General</option>
            <option value="Placement">Placement</option>
          </select>

          <label htmlFor="notice-priority">Priority</label>
          <select
            id="notice-priority"
            name="priority"
            value={form.priority}
            onChange={updateForm}
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <label htmlFor="notice-scope">Notice Type</label>
          <select
            id="notice-scope"
            name="scope"
            value={form.scope}
            onChange={updateForm}
          >
            <option value="academic">Academic Notice</option>
            <option value="official">Official College Notice</option>
          </select>

          <button
            type="submit"
            className="notice-publish-button"
            disabled={submitting}
          >
            {submitting
              ? 'Saving...'
              : form.scope === 'official' && role === 'faculty'
                ? 'Submit for Approval'
                : 'Publish Notice'}
          </button>
        </form>
      )}

      {role === 'admin' && (
        <section className="notice-pending-section">
          <h2>Pending Official Notices</h2>

          {notices.filter(
            (notice) => notice.status === 'Pending Approval'
          ).length === 0 ? (
            <p>No notices are waiting for approval.</p>
          ) : (
            notices
              .filter(
                (notice) => notice.status === 'Pending Approval'
              )
              .map((notice) => (
                <article className="notice-card" key={notice._id}>
                  <h3>{notice.title}</h3>
                  <p>{notice.description}</p>

                  <button
                    type="button"
                    className="notice-publish-button"
                    disabled={approvingId === notice._id}
                    onClick={() => handleApprove(notice._id)}
                  >
                    {approvingId === notice._id
                      ? 'Approving...'
                      : 'Approve & Publish'}
                  </button>
                </article>
              ))
          )}
        </section>
      )}

      <div className="notice-filters">
        <input
          type="search"
          className="notice-search"
          placeholder="Search notices..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Search notices"
        />

        <select
          className="notice-category-filter"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          aria-label="Filter notices by category"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'All' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      <p className="notice-results-count">
        Showing {filteredNotices.length} of {notices.length} notices
      </p>

      {filteredNotices.length === 0 ? (
        <p className="status-message">
          No matching notices found. Try another search or category.
        </p>
      ) : (
        <div className="notices-grid">
          {filteredNotices.map((notice, index) => {
            const id = notice._id || index;
            const description = notice.description || '';
            const isExpanded = expandedNotices.includes(id);
            const isLong = description.length > 110;

            return (
              <article className="notice-card" key={id}>
                <div className="notice-card-top">
                  <span className="notice-category">
                    {notice.category || 'General'}
                  </span>

                  {notice.priority && (
                    <span
                      className={`notice-priority notice-priority-${String(
                        notice.priority
                      ).toLowerCase()}`}
                    >
                      {notice.priority}
                    </span>
                  )}
                </div>

                {notice.status === 'Pending Approval' && role === 'admin' && (
                  <p className="notice-pending-label">
                    Pending Admin Approval
                  </p>
                )}

                <h2>{notice.title || 'Untitled Notice'}</h2>

                {description && (
                  <p className="notice-description">
                    {isLong && !isExpanded
                      ? `${description.slice(0, 110).trim()}...`
                      : description}
                  </p>
                )}

                {isLong && (
                  <button
                    type="button"
                    className="notice-read-more"
                    onClick={() => toggleDescription(id)}
                  >
                    {isExpanded ? 'Read less ↑' : 'Read more →'}
                  </button>
                )}

                <div className="notice-card-footer">
                  <span>
                    {notice.publishDate
                      ? `Published ${new Date(
                          notice.publishDate
                        ).toLocaleDateString('en-GB')}`
                      : 'Publication date unavailable'}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Notices;
