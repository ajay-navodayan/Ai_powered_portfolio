import { Briefcase, Calendar, MapPin, CheckCircle } from 'lucide-react'
import './Experience.css'

const EXPERIENCE = [
  {
    role: 'Software Development Intern',
    company: 'NextG Serve Pvt Ltd',
    location: 'New Delhi, India',
    duration: 'May 2025 – Aug 2025',
    type: 'Internship',
    color: '#00d4ff',
    description:
      "Contributed to establishing the company's first web platform as a solo frontend developer, delivering a full responsive SPA from scratch.",
    achievements: [
      'Developed a responsive single-page web application — the company\'s first web platform',
      'Implemented pixel-perfect UI using HTML, CSS, JavaScript with Flexbox and Grid',
      'Configured automated builds via GitHub and deployed to Netlify with custom DNS',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'GitHub', 'Netlify', 'Squarespace'],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-label">Experience</div>
        <h2 className="section-title">Where I've Worked</h2>
        <p className="section-sub">
          Professional internship experience building production web apps.
        </p>
        <div className="accent-line" />

        <div className="experience-list">
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="exp-card" style={{ '--exp-color': exp.color }}>
              {/* Left timeline */}
              <div className="exp-card__timeline">
                <div className="timeline-dot" />
                <div className="timeline-line" />
              </div>

              {/* Content */}
              <div className="exp-card__body">
                {/* Header */}
                <div className="exp-header">
                  <div className="exp-header__left">
                    <span className="exp-type">{exp.type}</span>
                    <h3 className="exp-role">{exp.role}</h3>
                    <div className="exp-company">
                      <Briefcase size={14} />
                      {exp.company}
                    </div>
                  </div>
                  <div className="exp-header__right">
                    <div className="exp-meta">
                      <Calendar size={13} />
                      {exp.duration}
                    </div>
                    <div className="exp-meta">
                      <MapPin size={13} />
                      {exp.location}
                    </div>
                  </div>
                </div>

                <p className="exp-desc">{exp.description}</p>

                {/* Achievements */}
                <ul className="exp-achievements">
                  {exp.achievements.map((a, j) => (
                    <li key={j}>
                      <CheckCircle size={14} className="check-icon" />
                      {a}
                    </li>
                  ))}
                </ul>

                {/* Tech */}
                <div className="exp-tech">
                  {exp.tech.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
