
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function StudentCharacter({ variant = 'boy' }) {
  return (
    <div className={`character ${variant}`} aria-hidden="true">
      <div className="character-shadow" />

      <div className="backpack" />

      <div className="character-head">
        <div className="hair-back" />
        <div className="face">
          <span className="eye eye-left" />
          <span className="eye eye-right" />
          <span className="nose" />
          <span className="smile" />
        </div>
        <div className="hair-top" />
        <div className="ear ear-left" />
        <div className="ear ear-right" />
      </div>

      <div className="neck" />

      <div className="arm arm-left">
        <div className="hand" />
      </div>

      <div className="arm arm-right">
        <div className="hand" />
      </div>

      <div className="torso">
        <div className="hood" />
        <div className="shirt" />
        <div className="collar" />
        <div className="pocket" />
        <div className="zipper" />
      </div>

      <div className="book-stack">
        <span />
        <span />
      </div>

      <div className="leg leg-left">
        <div className="shoe" />
      </div>

      <div className="leg leg-right">
        <div className="shoe" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const title = 'Campus Connect';
  const [typed, setTyped] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (!deleting && typed.length < title.length) {
      timeout = setTimeout(
        () => setTyped(title.slice(0, typed.length + 1)),
        130
      );
    } else if (!deleting && typed.length === title.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && typed.length > 0) {
      timeout = setTimeout(
        () => setTyped(title.slice(0, typed.length - 1)),
        65
      );
    } else {
      timeout = setTimeout(() => setDeleting(false), 350);
    }

    return () => clearTimeout(timeout);
  }, [typed, deleting]);

  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <div className="landing-brand">
          <span className="landing-brand-mark">C</span>
          <span>Campus Connect</span>
        </div>

        <button
          className="landing-login-btn"
          onClick={() => navigate('/login')}
        >
          Login <span>→</span>
        </button>
      </nav>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="landing-eyebrow">
            YOUR CAMPUS, CONNECTED
          </span>

          <h1>
            <span className="landing-heading-static">Welcome to</span>
            <span className="landing-typed">
              {typed}
              <i className="landing-cursor">|</i>
            </span>
          </h1>

          <p>
            One place for campus information, academic resources,
            events and student support.
          </p>

          <button
            className="landing-primary-btn"
            onClick={() => navigate('/login')}
          >
            Get Started <span>→</span>
          </button>
        </div>

        <div className="landing-scene">
          <div className="scene-glow" />
          <div className="scene-orbit orbit-one" />
          <div className="scene-orbit orbit-two" />

          <div className="floating-icon cap">✦</div>
          <div className="floating-icon book">▤</div>
          <div className="floating-icon calendar">▦</div>
          <div className="floating-icon people">••</div>

          <div className="students">
            <StudentCharacter variant="boy" />
            <StudentCharacter variant="girl" />
          </div>

          <div className="scene-caption">
            LEARN · CONNECT · GROW
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <span>Campus Connect</span>
        <span>Made for campus life.</span>
      </footer>
    </main>
  );
}
