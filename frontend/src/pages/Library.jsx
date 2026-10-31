
import { useEffect, useState } from 'react';
import { getLibraryBooks } from '../services/libraryService';

function Library() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBooks() {
      try {
        const result = await getLibraryBooks();

        if (result.success && Array.isArray(result.data)) {
          setBooks(result.data);
        } else {
          setError('Library data could not be loaded correctly.');
        }
      } catch (err) {
        setError('Library books could not be loaded. Please check the backend.');
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  const searchText = searchTerm.trim().toLowerCase();

  const filteredBooks = books.filter((book) => {
    const title = typeof book.title === 'string' ? book.title : '';
    const author = typeof book.author === 'string' ? book.author : '';
    const category = typeof book.category === 'string' ? book.category : '';

    return (
      title.toLowerCase().includes(searchText) ||
      author.toLowerCase().includes(searchText) ||
      category.toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return <p className="status-message">Loading library books...</p>;
  }

  if (error) {
    return (
      <p className="status-message error-message" role="alert">
        {error}
      </p>
    );
  }

  return (
    <section className="library-page">
      <div className="page-heading">
        <span className="page-eyebrow">CAMPUS RESOURCES</span>
        <h1>Library</h1>
        <p>Explore books listed in the campus library database.</p>
      </div>

      {books.some((book) => book.isDemo === true) && (
        <p className="placement-demo-label" role="note">
          DEMO DATA — NOT AN OFFICIAL LIBRARY CATALOGUE
        </p>
      )}

      <div className="placement-search-wrapper">
        <input
          className="placement-search"
          type="search"
          placeholder="Search by book, author or category..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Search library books"
        />
      </div>

      {filteredBooks.length === 0 ? (
        <p className="status-message">
          No matching books found in the library database.
        </p>
      ) : (
        <div className="library-grid">
          {filteredBooks.map((book) => (
            <article className="library-card" key={book._id}>
              <span className="resource-category">
                {book.category || 'Uncategorized'}
              </span>

              <h2>{book.title || 'Title unavailable'}</h2>
              <p>
                <strong>Author:</strong> {book.author || 'Not specified'}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn || 'Not specified'}
              </p>
              <p>
                <strong>Availability:</strong>{' '}
                {book.availability || 'Not specified'}
              </p>

              {book.isDemo === true && (
                <p className="placement-demo-label">
                  Demo book — not an official catalogue entry.
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Library;
