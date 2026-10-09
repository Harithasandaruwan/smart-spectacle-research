import { useState } from 'react'
import { teamMembers, supervisors } from '../data/team'

function LinkedInIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.447 2H3.553A1.552 1.552 0 0 0 2 3.553v16.894A1.552 1.552 0 0 0 3.553 22h16.894A1.552 1.552 0 0 0 22 20.447V3.553A1.552 1.552 0 0 0 20.447 2ZM8.065 19H5.104V9.452h2.961V19ZM6.584 8.148a1.716 1.716 0 1 1 0-3.432 1.716 1.716 0 0 1 0 3.432ZM19 19h-2.959v-4.644c0-1.107-.02-2.531-1.543-2.531-1.544 0-1.78 1.206-1.78 2.451V19H9.759V9.452H12.6v1.305h.04c.395-.75 1.36-1.542 2.799-1.542 2.995 0 3.561 1.972 3.561 4.537V19Z" />
    </svg>
  )
}

type ProfilePhotoProps = {
  src: string
  name: string
  className: string
}

function ProfilePhoto({
  src,
  name,
  className,
}: ProfilePhotoProps) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    const initials = name
      .replace(/^(Mr\.|Ms\.|Dr\.|Prof\.)\s*/i, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')

    return (
      <div
        className={`${className} profile-photo-fallback`}
        role="img"
        aria-label={`Photo unavailable for ${name}`}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={`Portrait of ${name}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

type LinkedInLinkProps = {
  url: string
  name: string
}

function LinkedInLink({ url, name }: LinkedInLinkProps) {
  if (!url) {
    return null
  }

  return (
    <a
      className="linkedin-link"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name}'s LinkedIn profile (opens in a new tab)`}
      title={`${name} on LinkedIn`}
    >
      <LinkedInIcon />
    </a>
  )
}

function Team() {
  return (
    <section
      id="about-us"
      className="section"
      aria-labelledby="team-heading"
    >
      <div className="container">
        <div className="team-section-heading">
          <p className="eyebrow">Our researchers</p>
          <h2 id="team-heading">About us</h2>

          <p>
            B.Sc. (Hons) in Information Technology, specializing in
            Information Technology · Sri Lanka Institute of
            Information Technology.
          </p>
        </div>

        <div className="team-profile-grid">
          {teamMembers.map((member) => (
            <article
              className={`team-profile-card${
                member.isLeader ? ' team-profile-leader' : ''
              }`}
              key={member.studentId}
            >
              {member.isLeader && (
                <span className="team-leader-badge">
                  Group leader
                </span>
              )}

              <ProfilePhoto
                src={member.photo}
                name={member.member}
                className="team-profile-photo"
              />

              <div className="team-profile-details">
                <div className="profile-name-row">
                  <h3>{member.member}</h3>

                  <LinkedInLink
                    url={member.linkedin}
                    name={member.member}
                  />
                </div>

                <p className="team-student-id">
                  {member.studentId}
                </p>

                <p className="team-component-title">
                  {member.title}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="team-section-heading supervisor-heading">
          <p className="eyebrow">Academic guidance</p>
          <h2 id="supervisors-heading">Supervisors</h2>
        </div>

        <div
          className="supervisor-profile-grid"
          role="group"
          aria-labelledby="supervisors-heading"
        >
          {supervisors.map((supervisor) => (
            <article
              className="supervisor-profile-card"
              key={supervisor.name}
            >
              <ProfilePhoto
                src={supervisor.photo}
                name={supervisor.name}
                className="supervisor-profile-photo"
              />

              <div className="supervisor-profile-details">
                <h3>{supervisor.name}</h3>
                <p>{supervisor.role}</p>
              </div>

              <LinkedInLink
                url={supervisor.linkedin}
                name={supervisor.name}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
