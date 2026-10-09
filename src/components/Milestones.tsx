import { useState } from 'react'

type Milestone = {
  title: string
  description?: string
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
    description: 'The available individual component proposals are listed in Documents.',
  },
  {
    title: 'Progress Presentation 1',
  },
  {
    title: 'Progress Presentation 2',
  },
  {
    title: 'Final assessment',
  },
  {
    title: 'Viva',
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
            Browse the project assessments. The assessment schedule and
            allocated marks will be added when officially confirmed.
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
                  {milestone.description && <p>{milestone.description}</p>}
                  {(milestone.date || milestone.marks) && (
                    <p className="milestone-details">
                      {milestone.date && <span>Date: {milestone.date}</span>}
                      {milestone.marks && <span>Marks: {milestone.marks}</span>}
                    </p>
                  )}
                </article>
              </li>
            )
          ))}
        </ol>
      </div>
    </section>
  )
}
