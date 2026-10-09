import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { milestones } from '../data/milestones'

const domainLinks = [
  { label: 'Literature Survey', href: '#literature' },
  { label: 'Research Gap', href: '#research-gap' },
  { label: 'Research Problem', href: '#research-problem' },
  { label: 'Research Objectives', href: '#research-objectives' },
  { label: 'Methodology', href: '#methodology' },
  { label: 'Technologies Used', href: '#technologies-used' },
]

type NavbarProps = {
  onSelectMilestone: (value: string) => void
}

function Navbar({ onSelectMilestone }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const domainMenu = useRef<HTMLDetailsElement>(null)
  const milestoneMenu = useRef<HTMLDetailsElement>(null)

  const closeMenu = () => {
    setMenuOpen(false)
    if (domainMenu.current) domainMenu.current.open = false
    if (milestoneMenu.current) milestoneMenu.current.open = false
  }

  const closeOnEscape = (event: KeyboardEvent<HTMLDetailsElement>) => {
    if (event.key !== 'Escape') return
    event.currentTarget.open = false
    event.currentTarget.querySelector('summary')?.focus()
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
            className="nav-dropdown"
            ref={domainMenu}
            onKeyDown={closeOnEscape}
          >
            <summary onClick={() => {
              if (!domainMenu.current?.open && milestoneMenu.current) milestoneMenu.current.open = false
            }}>Domain</summary>
            <div className="nav-dropdown-panel">
              {domainLinks.map((link) => (
                <a href={link.href} key={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              ))}
            </div>
          </details>
          <details
            className="nav-dropdown"
            ref={milestoneMenu}
            onKeyDown={closeOnEscape}
          >
            <summary onClick={() => {
              if (!milestoneMenu.current?.open && domainMenu.current) domainMenu.current.open = false
            }}>Milestones</summary>
            <div className="nav-dropdown-panel milestone-links">
              <a href="#milestones" onClick={() => {
                onSelectMilestone('all')
                closeMenu()
              }}>All assessments</a>
              {milestones.map((milestone, index) => (
                <a
                  href="#milestones"
                  key={milestone.title}
                  onClick={() => {
                    onSelectMilestone(String(index))
                    closeMenu()
                  }}
                >
                  <span>{milestone.title}</span>
                  <span className="nav-milestone-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </a>
              ))}
            </div>
          </details>
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
