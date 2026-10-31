
import { useState } from 'react';

const RAG_API_URL = 'http://localhost:8000/chat';

function AIAssistant() {
  const [question, setQuestion] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);

  async function handleSubmit(event) {
    event.preventDefault();

    const userQuestion = question.trim();
    if (!userQuestion || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: 'user', text: userQuestion },
    ]);

    setQuestion('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch(RAG_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.detail ||
            result.message ||
            `AI service returned HTTP ${response.status}`
        );
      }

      const answer =
        typeof result.answer === 'string' && result.answer.trim()
          ? result.answer.trim()
          : 'I could not find a verified answer in the campus information.';

      const sources = Array.isArray(result.sources) ? result.sources : [];

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          text: answer,
          category: sources
            .map((source) => source.category)
            .filter(Boolean)
            .filter((value, index, array) => array.indexOf(value) === index)
            .join(', '),
          sources,
          grounded: result.grounded,
        },
      ]);
    } catch (err) {
      console.error('Campus RAG assistant error:', err);

      setError(
        err.message?.includes('Failed to fetch')
          ? 'Unable to connect to the AI service. Make sure FastAPI is running on port 8000.'
          : err.message || 'Unable to get an AI response. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function startNewChat() {
    setMessages([]);
    setQuestion('');
    setError('');
  }

  const suggestions = [
    'How can I download my admission receipt?',
    'Tell me about the departments',
    'Which books are available in the library?',
    'Show me upcoming campus events',
  ];

  return (
    <section
      className={`ai-assistant-page ${darkMode ? 'ai-dark' : 'ai-light'}`}
      style={{
        display: 'flex',
        flex: '1 1 0%',
        width: '100%',
        maxWidth: 'none',
        minWidth: 0,
        height: '100%',
        minHeight: 0,
        margin: 0,
        padding: 0,
        borderRadius: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <aside className="ai-sidebar">
        <div className="ai-brand">
          <div className="ai-brand-logo">C</div>
          <div>
            <strong>Campus Connect</strong>
            <span>AI Assistant</span>
          </div>
        </div>

        <button
          className="ai-new-chat"
          type="button"
          onClick={startNewChat}
        >
          <span>＋</span> New chat
        </button>

        <div className="ai-sidebar-label">YOUR ASSISTANT</div>

        <div className="ai-sidebar-info">
          <span className="ai-status-dot" />
          Campus information assistant
        </div>

        <div className="ai-sidebar-bottom">
          <span className="ai-sidebar-avatar">CC</span>
          <div>
            <strong>Campus Connect</strong>
            <span>Student support</span>
          </div>
        </div>
      </aside>

      <main
        className="ai-main"
        style={{
          flex: '1 1 0%',
          width: 0,
          minWidth: 0,
          maxWidth: 'none',
          height: '100%',
          minHeight: 0,
        }}
      >
        <header className="ai-topbar">
          <div>
            <span className="ai-mobile-brand">CAMPUS CONNECT</span>
            <h2>AI Assistant</h2>
          </div>

          <button
            className="ai-theme-toggle"
            type="button"
            onClick={() => setDarkMode((previous) => !previous)}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
            title={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
          >
            <span>{darkMode ? '☀' : '☾'}</span>
            <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </header>

        <div
          className={`ai-conversation ${
            messages.length ? 'has-messages' : ''
          }`}
        >
          {messages.length === 0 ? (
            <div className="ai-welcome">
              <div className="ai-welcome-logo">C</div>

              <span className="ai-welcome-eyebrow">
                YOUR CAMPUS, CONNECTED
              </span>

              <h1>How can I help you today?</h1>

              <p>
                Ask me about departments, faculty, library, admissions,
                notices and campus services.
              </p>

              <div className="ai-suggestions">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuestion(suggestion)}
                    className="ai-suggestion"
                  >
                    <span>↗</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="ai-message-list">
              {messages.map((message, index) => (
                <div
                  className={`ai-message-row ${
                    message.role === 'user'
                      ? 'from-user'
                      : 'from-assistant'
                  }`}
                  key={`${index}-${message.role}`}
                >
                  {message.role === 'assistant' && (
                    <div className="ai-message-avatar">C</div>
                  )}

                  <div className="ai-message-content">
                    <span className="ai-message-author">
                      {message.role === 'user' ? 'You' : 'Campus Connect'}
                    </span>

                    <div className="ai-message-text">{message.text}</div>

                    {message.category && (
                      <span className="ai-category">
                        Source: {message.category}
                      </span>
                    )}

                    {message.sources?.length > 0 && (
                      <details className="ai-sources">
                        <summary>
                          Retrieved sources ({message.sources.length})
                        </summary>
                        <ul>
                          {message.sources.map((source, sourceIndex) => (
                            <li key={`${source.question || 'source'}-${sourceIndex}`}>
                              {source.question || source.category || 'Campus record'}
                              {source.category ? ` — ${source.category}` : ''}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="ai-message-row from-assistant">
                  <div className="ai-message-avatar">C</div>
                  <div className="ai-loading">
                    <span />
                    <span />
                    <span />
                    <small>Retrieving campus information and generating answer...</small>
                  </div>
                </div>
              )}

              <div className="ai-bottom-space" />
            </div>
          )}
        </div>

        <div className="ai-composer-area">
          {error && (
            <div className="ai-error" role="alert">
              {error}
            </div>
          )}

          <form className="ai-composer" onSubmit={handleSubmit}>
            <textarea
              rows={1}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Campus Connect..."
              aria-label="Message Campus Connect Assistant"
              disabled={loading}
            />

            <button
              className="ai-send-button"
              type="submit"
              disabled={!question.trim() || loading}
              aria-label="Send message"
              title="Send message"
            >
              ↑
            </button>
          </form>

          <p className="ai-composer-note">
            Campus Connect AI can make mistakes. Verify important college
            information.
          </p>
        </div>
      </main>
    </section>
  );
}

export default AIAssistant;
