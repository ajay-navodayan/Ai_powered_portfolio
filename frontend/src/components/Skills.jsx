import './Skills.css'

const SKILL_GROUPS = [
  {
    category: 'Languages',
    emoji: '💻',
    color: '#00d4ff',
    skills: ['Python', 'JavaScript', 'Java', 'HTML5', 'CSS3'],
  },
  {
    category: 'Frontend',
    emoji: '🎨',
    color: '#38bdf8',
    skills: ['React.js', 'Bootstrap', 'Flexbox', 'Grid', 'Responsive Design'],
  },
  {
    category: 'Backend',
    emoji: '⚙️',
    color: '#22c55e',
    skills: ['Flask', 'Node.js', 'Express.js', 'REST APIs', 'SQLAlchemy'],
  },
  {
    category: 'Database',
    emoji: '🗄️',
    color: '#f59e0b',
    skills: ['PostgreSQL', 'MongoDB', 'SQL', 'Database Design'],
  },
  {
    category: 'AI / ML',
    emoji: '🤖',
    color: '#a78bfa',
    skills: ['BioBERT', 'NLP', 'Transformers', 'NumPy', 'Pandas', 'Deep Learning'],
  },
  {
    category: 'Tools & DevOps',
    emoji: '🛠️',
    color: '#fb7185',
    skills: ['Git', 'GitHub', 'Netlify', 'Gunicorn', 'Linux', 'DNS Config'],
  },
]

/* Proficiency bar for visual flair */
const PROFICIENCY = {
  Python: 90, JavaScript: 85, React: 80, Flask: 85,
  PostgreSQL: 75, HTML5: 90, CSS3: 85, 'Node.js': 72,
  'Express.js': 68, NLP: 70, BioBERT: 65,
}

function SkillCard({ group }) {
  return (
    <div className="skill-card" style={{ '--skill-color': group.color }}>
      <div className="skill-card__header">
        <span className="skill-card__emoji">{group.emoji}</span>
        <h3 className="skill-card__title">{group.category}</h3>
        <div className="skill-card__line" />
      </div>
      <ul className="skill-list">
        {group.skills.map(skill => (
          <li key={skill} className="skill-item">
            <span className="skill-name">{skill}</span>
            {PROFICIENCY[skill] && (
              <div className="skill-bar">
                <div
                  className="skill-bar__fill"
                  style={{ width: `${PROFICIENCY[skill]}%` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-label">Skills</div>
        <h2 className="section-title">Technical Arsenal</h2>
        <p className="section-sub">
          Full stack from database to UI — with a growing focus on AI and machine learning.
        </p>
        <div className="accent-line" />

        <div className="skills-grid">
          {SKILL_GROUPS.map(group => (
            <SkillCard key={group.category} group={group} />
          ))}
        </div>
      </div>
    </section>
  )
}
