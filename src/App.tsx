import './index.css'

const components = [
  {
    number: '01',
    title: 'Smart Spectacle Hardware',
    member: 'Sandaruwan U D H',
    studentId: 'IT22074690',
    description:
      'Designing a wearable spectacle platform that integrates a camera, distance sensor, and IMU with edge processing and audio feedback.',
    features: [
      'Wearable hardware design',
      'Multi-sensor integration',
      'Sensor data acquisition',
      'Audio feedback support',
    ],
    document: '/documents/proposal-sandaruwan.pdf',
  },
  {
    number: '02',
    title: 'Hybrid Indoor Positioning',
    member: 'Aqeel N M',
    studentId: 'IT22063014',
    description:
      'Combining visual landmark recognition and IMU-based movement tracking to support indoor positioning without continuous internet access.',
    features: [
      'Visual landmark recognition',
      'IMU-based movement tracking',
      'Sensor fusion for positioning',
      'Offline navigation support',
    ],
    document: '/documents/proposal-aqeel.pdf',
  },
  {
    number: '03',
    title: 'Security & Remote Guardian System',
    member: 'Lakshika V G P',
    studentId: 'IT22153418',
    description:
      'Developing a guardian application with contextual monitoring and emergency alerts using information from the smart spectacle system.',
    features: [
      'Fall and inactivity detection',
      'SOS emergency support',
      'Context-aware guardian monitoring',
      'Safe-zone alerts',
    ],
    document: '/documents/proposal-lakshika.pdf',
  },
  {
    number: '04',
    title: 'Vision-Based Danger Detection',
    member: 'Tharindu R M J',
    studentId: 'IT22234384',
    description:
      'Developing a lightweight computer vision model to identify indoor obstacles and hazards using images captured by the spectacle camera.',
    features: [
      'Indoor hazard dataset preparation',
      'Lightweight object detection',
      'Edge model deployment',
      'Obstacle information for audio alerts',
    ],
    document: '/documents/proposal-tharindu.pdf',
  },
]

const researchSteps = [
  {
    title: 'Understand the problem',
    description:
      'Review existing research and identify indoor navigation and safety requirements.',
  },
  {
    title: 'Develop the components',
    description:
      'Design the wearable hardware, hazard detection, positioning, and guardian modules.',
  },
  {
    title: 'Integrate the system',
    description:
      'Connect sensor inputs, local processing, audio guidance, and guardian communication.',
  },
  {
    title: 'Evaluate the prototype',
    description:
      'Measure detection performance, positioning error, response time, and usability in controlled conditions.',
  },
]

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <nav className="container navigation" aria-label="Main navigation">
          <a className="brand" href="#home">
            Smart Spectacle
            <span>R26-IT-134</span>
          </a>

          <div className="nav-links">
            <a href="#research">Research</a>
            <a href="#components">Components</a>
            <a href="#methodology">Methodology</a>
            <a href="#downloads">Downloads</a>
            <a href="#team">Team</a>
          </div>
        </nav>
      </header>

      <main id="main">
        <section id="home" className="hero">
          <div className="container">
            <p className="eyebrow">SLIIT · Research Project · R26-IT-134</p>

            <h1>
              IoT-Based Spectacle for Indoor Navigation and Safety of
              Visually Impaired
            </h1>

            <p className="hero-description">
              Exploring how wearable sensors, computer vision, and edge
              processing can support safer and more independent indoor
              navigation for visually impaired people.
            </p>

            <div className="button-group">
              <a className="button primary" href="#research">
                Explore our research
              </a>
              <a className="button secondary" href="#downloads">
                View proposals
              </a>
            </div>

            <div className="hero-facts">
              <div>
                <strong>04</strong>
                <span>Research components</span>
              </div>
              <div>
                <strong>IoT + AI</strong>
                <span>Proposed approach</span>
              </div>
              <div>
                <strong>AIMS</strong>
                <span>Research group</span>
              </div>
            </div>
          </div>
        </section>

        <section id="research" className="section">
          <div className="container">
            <p className="eyebrow">Research overview</p>
            <h2>Supporting safer indoor mobility</h2>
            <p className="section-intro">
              Our proposed system brings together wearable sensing, indoor
              positioning, hazard detection, and guardian support.
            </p>

            <div className="grid three-columns">
              <article className="card">
                <h3>The problem</h3>
                <p>
                  Indoor environments contain obstacles, stairs, and moving
                  hazards. Visually impaired people need timely information
                  about their surroundings and support for finding their way.
                </p>
              </article>

              <article className="card">
                <h3>The research focus</h3>
                <p>
                  We investigate how multiple sensors and local processing
                  can improve contextual awareness while reducing dependence
                  on continuous internet connectivity for local assistance.
                </p>
              </article>

              <article className="card">
                <h3>The proposed solution</h3>
                <p>
                  A smart spectacle platform that combines camera, distance,
                  and motion information to support indoor guidance, audio
                  warnings, and connected guardian monitoring.
                </p>
              </article>
            </div>

            <div className="notice">
              <strong>Main objective</strong>
              <p>
                Develop and evaluate an assistive smart spectacle system
                that supports safe and independent indoor navigation for
                visually impaired individuals.
              </p>
            </div>
          </div>
        </section>

        <section id="components" className="section section-muted">
          <div className="container">
            <p className="eyebrow">Individual contributions</p>
            <h2>Four connected research components</h2>
            <p className="section-intro">
              Each member develops a component of the proposed integrated
              system.
            </p>

            <div className="grid two-columns">
              {components.map((component) => (
                <article className="card" key={component.studentId}>
                  <span className="component-number">
                    {component.number}
                  </span>
                  <h3>{component.title}</h3>
                  <p>{component.description}</p>

                  <ul>
                    {component.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>

                  <div className="card-footer">
                    <p>
                      <strong>{component.member}</strong>
                      <br />
                      {component.studentId}
                    </p>
                    <a href={component.document} download>
                      Download proposal <span className="sr-only">
                        for {component.member}
                      </span>
                      <span aria-hidden="true"> →</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="methodology" className="section">
          <div className="container">
            <p className="eyebrow">Proposed methodology</p>
            <h2>From research to prototype evaluation</h2>
            <p className="section-intro">
              The project follows a design science approach with iterative
              development and experimental evaluation.
            </p>

            <ol className="methodology-list">
              {researchSteps.map((step) => (
                <li className="card" key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>

            <div className="notice">
              <strong>Local assistance and remote communication</strong>
              <p>
                Core navigation and hazard processing are intended to run
                locally. Remote guardian updates and cloud synchronization
                require an available communication connection.
              </p>
            </div>
          </div>
        </section>

        <section id="downloads" className="section section-muted">
          <div className="container">
            <p className="eyebrow">Research documents</p>
            <h2>Proposals and project information</h2>
            <p className="section-intro">
              Download the topic assessment form and individual component
              proposals.
            </p>

            <div className="download-list">
              <a
                className="download-item"
                href="/documents/topic-assessment.pdf"
                download
              >
                <span>
                  <strong>Topic Assessment Form</strong>
                  <small>Project overview · R26-IT-134</small>
                </span>
                <span className="file-badge">PDF ↓</span>
              </a>

              {components.map((component) => (
                <a
                  className="download-item"
                  href={component.document}
                  download
                  key={component.studentId}
                >
                  <span>
                    <strong>{component.title}</strong>
                    <small>
                      {component.member} · {component.studentId}
                    </small>
                  </span>
                  <span className="file-badge">PDF ↓</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="section">
          <div className="container">
            <p className="eyebrow">Our team</p>
            <h2>The researchers behind the project</h2>
            <p className="section-intro">
              B.Sc. (Hons) in Information Technology, specializing in
              Information Technology · Sri Lanka Institute of Information
              Technology.
            </p>

            <div className="grid two-columns">
              {components.map((component) => (
                <article className="card" key={component.studentId}>
                  <p className="eyebrow">{component.studentId}</p>
                  <h3>{component.member}</h3>
                  <p>{component.title}</p>
                </article>
              ))}
            </div>

            <div className="supervisors">
              <div>
                <p className="eyebrow">Supervisor</p>
                <h3>Mr. Ravi Supunya</h3>
              </div>
              <div>
                <p className="eyebrow">Co-supervisor</p>
                <h3>Prof. Anuradha Jayakody</h3>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <strong>Smart Spectacle · R26-IT-134</strong>
          <p>
            IoT-Based Spectacle for Indoor Navigation and Safety of
            Visually Impaired
          </p>
          <p>
            Research proposal website. Features described are proposed
            capabilities; performance results will be added after evaluation.
          </p>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </>
  )
}

export default App