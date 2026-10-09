import { useRef, useState } from 'react'

const domainLinks = [
  { label: 'Literature Survey', href: '#literature' },
  { label: 'Research Gap', href: '#research-gap' },
  { label: 'Research Problem', href: '#research-problem' },
  { label: 'Research Objectives', href: '#research-objectives' },
  { label: 'Methodology', href: '#methodology' },
  { label: 'Technologies Used', href: '#technologies-used' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const domainMenu = useRef<HTMLDetailsElement>(null)

  const closeMenu = () => {
    setMenuOpen(false)
    if (domainMenu.current) domainMenu.current.open = false
  }

  return (
    <header className="site-header">
      <nav className="container navigation" aria-label="Main navigation">
        <a className="brand" href="#home" onClick={closeMenu}>
          Smart Spectacle
          <span>R26-IT-134</span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-controls="main-nav-links"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close menu' : 'Menu'}
        </button>

        <div id="main-nav-links" className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <details
            className="domain-menu"
            ref={domainMenu}
            onKeyDown={(event) => {
              if (event.key === 'Escape') domainMenu.current?.removeAttribute('open')
            }}
          >
            <summary>Domain</summary>
            <div className="domain-links">
              {domainLinks.map((link) => (
                <a href={link.href} key={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              ))}
            </div>
          </details>
          <a href="#milestones" onClick={closeMenu}>Milestones</a>
          <a href="#documents" onClick={closeMenu}>Documents</a>
          <a href="#slides" onClick={closeMenu}>Slides of Past Presentations</a>
          <a href="#about-us" onClick={closeMenu}>About Us</a>
          <a href="#contact-us" onClick={closeMenu}>Contact Us</a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
