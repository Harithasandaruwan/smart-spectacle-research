import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { milestones } from '../data/milestones'

gsap.registerPlugin(ScrollTrigger)

type MilestonesProps = {
  selected: string
  onSelect: (value: string) => void
}

export default function Milestones({ selected, onSelect }: MilestonesProps) {
  const timelineRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline || selected !== 'all' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = Array.from(timeline.querySelectorAll<HTMLElement>('.milestone-item'))
    const context = gsap.context(() => {
      timeline.classList.add('milestones-motion')

      ScrollTrigger.create({
        trigger: timeline,
        start: 'top 65%',
        end: 'bottom 60%',
        onUpdate: ({ progress }) => timeline.style.setProperty('--timeline-progress', String(progress)),
      })

      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 82%',
          onEnter: () => item.classList.add('is-visible'),
          onEnterBack: () => item.classList.add('is-visible'),
        })
      })

      // Keep cards visible when arriving through a deep link or browser scroll restoration.
      items.forEach((item) => {
        if (item.getBoundingClientRect().top < window.innerHeight * 0.82) {
          item.classList.add('is-visible')
        }
      })
    }, timeline)

    return () => {
      context.revert()
      timeline.classList.remove('milestones-motion')
      timeline.style.removeProperty('--timeline-progress')
      items.forEach((item) => item.classList.remove('is-visible'))
    }
  }, [selected])

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
            onChange={(event) => onSelect(event.target.value)}
          >
            <option value="all">All assessments</option>
            {milestones.map((milestone, index) => (
              <option value={String(index)} key={milestone.title}>
                {milestone.title}
              </option>
            ))}
          </select>
        </div>

        <ol className="milestones-timeline" ref={timelineRef}>
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
