
const admissionSteps = [
  {
    number: '01',
    title: 'Check Eligibility',
    description:
      'Review the eligibility criteria for your preferred course and programme.',
  },
  {
    number: '02',
    title: 'Prepare Documents',
    description:
      'Keep your academic certificates, identity proof and photographs ready.',
  },
  {
    number: '03',
    title: 'Submit Application',
    description:
      'Complete the application form and provide the required information.',
  },
  {
    number: '04',
    title: 'Track Admission Status',
    description:
      'Check application updates and follow instructions from the admission office.',
  },
];

const requiredDocuments = [
  'Class 10 marksheet and certificate',
  'Class 12 marksheet (if applicable)',
  'Transfer or migration certificate (if required)',
  'Identity proof',
  'Recent passport-size photographs',
  'Entrance examination scorecard (if applicable)',
];

function Admission() {
  return (
    <section className="admission-page">
      <div className="page-heading">
        <span className="page-eyebrow">STUDENT SERVICES</span>
        <h1>Admission Guide</h1>
        <p>
          Understand the admission process and prepare for your application.
        </p>
      </div>

      <div className="admission-intro">
        <div>
          <span className="admission-label">YOUR NEXT STEP</span>
          <h2>Start your admission journey</h2>
          <p>
            Follow these general steps to prepare your application.
            Confirm course-specific requirements with your college.
          </p>
        </div>
        <div className="admission-icon">🎓</div>
      </div>

      <h2 className="admission-section-title">Admission Process</h2>

      <div className="admission-steps">
        {admissionSteps.map((step) => (
          <article className="admission-step" key={step.number}>
            <span className="admission-step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>

      <div className="admission-documents">
        <h2>Documents Checklist</h2>
        <p>Use this checklist to prepare your documents.</p>

        <ul>
          {requiredDocuments.map((document) => (
            <li key={document}>
              <span className="admission-check">✓</span>
              {document}
            </li>
          ))}
        </ul>

        <p className="admission-note">
          Note: This is a general checklist. Requirements and deadlines
          vary by course and institution.
        </p>
      </div>
    </section>
  );
}

export default Admission;
