const projectLinks = [
  { label: 'Research overview', href: '#research' },
  { label: 'Literature survey', href: '#literature' },
  { label: 'Research gap', href: '#research-gap' },
  { label: 'Research components', href: '#components' },
  { label: 'Methodology', href: '#methodology' },
  { label: 'Milestones', href: '#milestones' },
  { label: 'Documents', href: '#documents' },
  { label: 'Slides', href: '#slides' },
  { label: 'About us', href: '#about-us' },
  { label: 'References', href: '#references' },
  { label: 'Contact us', href: '#contact-us' },
];

export default function Footer() {
  return (
    <footer className="project-footer" id="footer">
      <div className="footer-inner">
        <section className="footer-contact" aria-labelledby="footer-title">
          <p className="footer-eyebrow">RESEARCH PROJECT · R26-IT-134</p>
          <h2 id="footer-title">
            Building safer indoor journeys<span>.</span>
          </h2>
          <p className="footer-intro">
            IoT-Based Spectacle for Indoor Navigation and Safety of Visually Impaired
          </p>
          <a className="footer-team-link" href="#about-us">
            Meet the research team <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section className="footer-affiliation" aria-label="Academic affiliation">
          <div className="footer-affiliation-top">
            <div>
              <p className="footer-card-label">ACADEMIC AFFILIATION</p>
              <h3>Sri Lanka Institute of Information Technology</h3>
              <p className="footer-muted">Faculty of Computing · Information Technology</p>
            </div>
            <span className="footer-location">Malabe, Sri Lanka</span>
          </div>

          <div className="footer-mentors">
            <div className="footer-mentor">
              <span>SUPERVISOR</span>
              <strong>Mr. Ravi Supunya</strong>
            </div>
            <div className="footer-mentor">
              <span>CO-SUPERVISOR</span>
              <strong>Prof. Anuradha Jayakody</strong>
            </div>
          </div>
        </section>

        <div className="footer-bottom">
          <nav className="footer-nav" aria-label="Footer navigation">
            {projectLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a
            className="footer-github"
            href="https://github.com/Harithasandaruwan/Indoor-Navigation.git"
            target="_blank"
            rel="noreferrer"
            aria-label="Open the project GitHub repository in a new tab"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.64-1.24-1.64-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.62 1.2 3.26.92.1-.72.39-1.2.71-1.48-2.47-.28-5.06-1.24-5.06-5.5 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.15a10.7 10.7 0 0 1 5.57 0c2.12-1.44 3.06-1.15 3.06-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3.01 0 4.27-2.6 5.21-5.08 5.49.4.35.76 1.02.76 2.06V22c0 .29.2.63.77.53A11.1 11.1 0 0 0 12 .9Z" />
            </svg>
            <span>GitHub repository</span>
            <span aria-hidden="true">↗</span>
          </a>

          <p className="footer-copyright">
            © {new Date().getFullYear()} R26-IT-134 · SLIIT · Academic research project
          </p>
        </div>
      </div>
    </footer>
  );
}
