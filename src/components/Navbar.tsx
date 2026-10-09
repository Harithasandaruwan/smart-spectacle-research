function Navbar() {
  return (
    <header className="site-header">
      <nav className="container navigation" aria-label="Main navigation">
        <a className="brand" href="#home">
          Smart Spectacle
          <span>R26-IT-134</span>
        </a>

        <div className="nav-links">
          <a href="#research">Research Overview</a>
          <a href="#literature">Literature Survey</a>
          <a href="#research-gap">Research Gap</a>
          <a href="#components">Research Components</a>
          <a href="#methodology">Methodology</a>
          <a href="#downloads">Downloads</a>
          <a href="#team">Team</a>
          <a href="#references">References</a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
