import { components } from './project'

type MemberProfile = {
  photo: string
  linkedin: string
  isLeader: boolean
}

const memberProfiles: Record<string, MemberProfile> = {
  IT22074690: {
    photo: '/images/team/sandaruwan.png',
    linkedin: '',
    isLeader: false,
  },
  IT22063014: {
    photo: '/images/team/aqeel.jpg',
    linkedin: '',
    isLeader: false,
  },
  IT22153418: {
    photo: '/images/team/lakshika.jpg',
    linkedin: '',
    isLeader: false,
  },
  IT22234384: {
    photo: '/images/team/tharindu.jpg',
    linkedin: '',
    isLeader: false,
  },
}

export const teamMembers = components.map((component) => ({
  ...component,
  ...memberProfiles[component.studentId],
}))

export const supervisors = [
  {
    name: 'Mr. Ravi Supunya',
    role: 'Supervisor',
    photo: '/images/team/ravi-supunya.jpg',
    linkedin: 'https://lk.linkedin.com/in/ravi-supunya-2b2774ab',
  },
  {
    name: 'Prof. Anuradha Jayakody',
    role: 'Co-supervisor',
    photo: '/images/team/anuradha-jayakody.jpg',
    linkedin: '',
  },
]