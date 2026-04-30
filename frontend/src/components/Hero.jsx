import { Github, Linkedin, Mail, Download, ArrowDown } from 'lucide-react'
import './Hero.css'

export default function Hero() {
  return (
    <section id="hero" className="hero section">
      <div className="container hero__grid">
        {/* Left: Text Content */}
        <div className="hero__content">
          {/* Status badge */}
          <div className="hero__status animate-fade-up">
            <span className="status-dot" />
            Available for opportunities in 2026
          </div>

          {/* Main heading */}
          <h1 className="hero__name animate-fade-up delay-1">
            Ajay<br />
            <span className="hero__name--accent">Kumar</span>
          </h1>

          {/* Role */}
          <div className="hero__role animate-fade-up delay-2">
            <span className="role-line" />
            Full Stack Developer &amp; AI Engineer
          </div>

          {/* Bio */}
          <p className="hero__bio animate-fade-up delay-3">
            B.Tech CS student at Sitare University, Lucknow. I build production-ready
            web apps and AI systems — from a feedback platform used by{' '}
            <span className="hero__highlight">300+ students</span> to
            BioBERT-powered NLP tools.
          </p>

          {/* Actions */}
          <div className="hero__actions animate-fade-up delay-4">
            <a href="#projects" className="btn-primary">
              View My Work
              <ArrowDown size={16} />
            </a>
            <a
              href="/Ajay_CV.pdf"
              download
              className="btn-secondary"
            >
              <Download size={15} />
              Resume
            </a>
          </div>

          {/* Social links */}
          <div className="hero__socials animate-fade-up delay-5">
            <a
              href="https://github.com/ajay-kumar"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com/in/ajay-kumar"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:su-23003@sitare.org"
              className="social-link"
              title="Email"
            >
              <Mail size={18} />
            </a>
            <span className="social-divider" />
            <span className="social-text">su-23003@sitare.org</span>
          </div>
        </div>

        {/* Right: Visual Card */}
        <div className="hero__visual animate-fade-up delay-2">
          <div className="hero__card">
            {/* Terminal header */}
            <div className="card__header">
              <div className="card__dots">
                <span className="dot dot--red" />
                <span className="dot dot--yellow" />
                <span className="dot dot--green" />
              </div>
              <span className="card__title">about.json</span>
            </div>
            {/* Code block */}
            <pre className="card__code">
<code>{`{
  "name": "Ajay Kumar",
  "role": "Full Stack Developer",
  "location": "Lucknow, India",
  "education": {
    "degree": "B.Tech CS",
    "university": "Sitare University",
    "graduation": "May 2026"
  },
  "tech": [
    "React", "Flask", "Python",
    "PostgreSQL", "Node.js"
  ],
  "ai_ml": [
    "NLP", "BioBERT", "RAG"
  ],
  "scholarships": 2,
  "openTo": "Full-time 2026"
}`}</code>
            </pre>
          </div>

          {/* Floating badges */}
          <div className="floating-badge badge-1">
            <span>🚀</span> 300+ Active Users
          </div>
          <div className="floating-badge badge-2">
            <span>🎓</span> 2x Scholarship
          </div>
          <div className="floating-badge badge-3">
            <span>🤖</span> AI / NLP
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  )
}
