type MilestoneStatus = 'Completed' | 'In progress' | 'Pending';

type Milestone = {
  title: string;
  description: string;
  status: MilestoneStatus;
};

// Update the status and description here as your team completes each stage.
const milestones: Milestone[] = [
  {
    title: 'Topic Assessment Form',
    description: 'Research topic and initial project scope submitted for review.',
    status: 'Completed',
  },
  {
    title: 'Project Charter',
    description: 'Research objectives, scope, team roles, and planned deliverables.',
    status: 'Completed',
  },
  {
    title: 'Project Proposal',
    description: 'Proposal document prepared for the Smart Spectacle research project.',
    status: 'Completed',
  },
  {
    title: 'Proposal Presentation',
    description: 'Present the research problem, proposed solution, and project plan.',
    status: 'Pending',
  },
  {
    title: 'Literature Survey and System Design',
    description: 'Review related work and define the system architecture and component designs.',
    status: 'In progress',
  },
  {
    title: 'Progress Presentation I',
    description: 'Demonstrate the initial implementation and research progress.',
    status: 'Pending',
  },
  {
    title: 'Progress Presentation II',
    description: 'Present integrated components, evaluation progress, and remaining work.',
    status: 'Pending',
  },
  {
    title: 'Individual and Group Final Reports',
    description: 'Complete the individual component reports and the group research report.',
    status: 'Pending',
  },
  {
    title: 'Final Presentation and Viva',
    description: 'Present the completed research project and answer evaluation questions.',
    status: 'Pending',
  },
];

function statusClass(status: MilestoneStatus) {
  return status.toLowerCase().replaceAll(' ', '-');
}

export default function Milestones() {
  return (
    <div className="milestones-section" id="milestones" aria-labelledby="milestones-title">
      <div className="milestones-container">
        <header className="milestones-heading">
          <p className="milestones-eyebrow">PROJECT ROADMAP · R26-IT-134</p>
          <h2 id="milestones-title">Research milestones</h2>
          <p>
            Follow the planned stages of our IoT-based smart spectacle research project.
          </p>
        </header>

        <ol className="milestones-timeline">
          {milestones.map((milestone, index) => (
            <li
              className={`milestone-item milestone-${index % 2 === 0 ? 'left' : 'right'}`}
              key={milestone.title}
            >
              <span className={`milestone-marker milestone-marker-${statusClass(milestone.status)}`} aria-hidden="true">
                {milestone.status === 'Completed' ? '✓' : milestone.status === 'In progress' ? '↻' : '·'}
              </span>
              <article className="milestone-card">
                <div className="milestone-card-meta">
                  <span className="milestone-number">MILESTONE {String(index + 1).padStart(2, '0')}</span>
                  <span className={`milestone-status milestone-status-${statusClass(milestone.status)}`}>
                    {milestone.status}
                  </span>
                </div>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
