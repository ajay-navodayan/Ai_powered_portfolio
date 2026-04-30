import { GraduationCap, Award, BookOpen } from 'lucide-react'
import './Education.css'

const COURSES = [
  'Advanced DSA', 'OOP', 'DBMS', 'Web Dev',
  'Deep Learning', 'Machine Learning', 'Search & IR',
  'Artificial Intelligence', 'Operating Systems',
]

const SCHOLARSHIPS = [
  {
    name: '100% B.Tech CS Scholarship',
    org: 'Sitare Foundation',
    period: 'Aug 2023 – Present',
    color: '#00d4ff',
  },
  {
    name: 'Reliance Undergraduate Scholarship',
    org: 'Reliance Foundation',
    period: 'Jan 2024 – Present',
    color: '#f59e0b',
  },
]

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <div className="section-label">Education</div>
        <h2 className="section-title">Academic Background</h2>
        <div className="accent-line" />

        <div className="edu-grid">
          {/* Degree Card */}
          <div className="edu-main">
            <div className="edu-icon">
              <GraduationCap size={24} />
            </div>
            <div className="edu-degree">B.Tech in Computer Science</div>
            <div className="edu-uni">Sitare University (with SRMU)</div>
            <div className="edu-location">Lucknow, Uttar Pradesh, India</div>
            <div className="edu-grad">
              <span className="tag">Graduating May 2026</span>
            </div>

            <div className="edu-divider" />

            <div className="edu-courses-title">
              <BookOpen size={14} />
              Relevant Coursework
            </div>
            <div className="edu-courses">
              {COURSES.map(c => (
                <span key={c} className="tag">{c}</span>
              ))}
            </div>
          </div>

          {/* Scholarships */}
          <div className="edu-side">
            <div className="scholarship-title">
              <Award size={16} />
              Scholarships &amp; Achievements
            </div>
            {SCHOLARSHIPS.map((s, i) => (
              <div
                key={i}
                className="scholarship-card"
                style={{ '--sch-color': s.color }}
              >
                <div className="sch-dot" />
                <div className="sch-info">
                  <div className="sch-name">{s.name}</div>
                  <div className="sch-org">{s.org}</div>
                  <div className="sch-period">{s.period}</div>
                </div>
              </div>
            ))}

            {/* Stats */}
            <div className="edu-stats">
              <div className="edu-stat">
                <div className="stat-num">2</div>
                <div className="stat-label">Scholarships</div>
              </div>
              <div className="edu-stat">
                <div className="stat-num">9</div>
                <div className="stat-label">Core Courses</div>
              </div>
              <div className="edu-stat">
                <div className="stat-num">3+</div>
                <div className="stat-label">Projects Built</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
