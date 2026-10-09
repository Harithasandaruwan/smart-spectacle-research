import { useState } from 'react'

type Milestone = {
  title: string
  description: string
  date?: string
  marks?: string
}

// Add confirmed assessment dates and allocated marks here when supplied.
const milestones: Milestone[] = [
  {
    title: 'Topic assessment',
    description: 'The topic assessment form is available in Documents.',
  },
  {
    title: 'Project proposal',
    description: 'Four individual component proposal documents are available. Assessment details are still to be supplied.',
  },
  {
    title: 'Progress Presentation 1',
    description: 'Presentation details and slides have not been supplied.',
  },
  {
    title: 'Progress Presentation 2',
    description: 'Presentation details and slides have not been supplied.',
  },
  {
    title: 'Final assessment',
    description: 'Assessment details and final documents have not been supplied.',
  },
  {
    title: 'Viva',
    description: 'Viva details have not been supplied.',
  },
]

export default function Milestones() {
  const [selected, setSelected] = useState('all')

  return (
    <section className="milestones-section" id="milestones" aria-labelledby="milestones-title">
      <div className="milestones-container">
        <header className="milestones-heading">
          <p className="milestones-eyebrow">PROJECT ROADMAP · R26-IT-134</p>
          <h2 id="milestones-title">Research milestones</h2>
          <p>
            Browse the project assessments. Dates and allocated marks will be
            added when the official assessment details are available.
          </p>
        </header>

        <div className="milestone-picker">
          <label htmlFor="milestone-select">Choose an assessment</label>
          <select
            id="milestone-select"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
          >
            <option value="all">All assessments</option>
            {milestones.map((milestone, index) => (
              <option value={String(index)} key={milestone.title}>
                {milestone.title}
              </option>
            ))}
          </select>
        </div>

        <ol className="milestones-timeline">
          {milestones.map((milestone, index) => (
            (selected === 'all' || selected === String(index)) && (
              <li
                className={`milestone-item milestone-${index % 2 === 0 ? 'left' : 'right'}`}
                key={milestone.title}
              >
                <span className="milestone-marker" aria-hidden="true">
                  {index + 1}
                </span>
                <article className="milestone-card">
                  <div className="milestone-card-meta">
                    <span className="milestone-number">ASSESSMENT {String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                  <p className="milestone-details">
                    <span>Date: {milestone.date ?? 'To be supplied'}</span>
                    <span>Marks: {milestone.marks ?? 'To be supplied'}</span>
                  </p>
                </article>
              </li>
            )
          ))}
        </ol>
      </div>
    </section>
  )
}
