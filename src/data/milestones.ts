export type Milestone = {
  title: string
  description?: string
  date?: string
  marks?: string
}

// Add confirmed assessment dates and allocated marks here when supplied.
export const milestones: Milestone[] = [
  {
    title: 'Topic assessment',
    description: 'The topic assessment form is available in Documents.',
  },
  {
    title: 'Project proposal',
    description: 'The available individual component proposals are listed in Documents.',
  },
  { title: 'Progress Presentation 1' },
  { title: 'Progress Presentation 2' },
  { title: 'Final assessment' },
  { title: 'Viva' },
]
