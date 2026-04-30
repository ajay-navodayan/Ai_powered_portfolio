import { useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Github, Layers, Cpu, Globe } from 'lucide-react'
import './Projects.css'

/**
 * PROJECTS DATA — Edit this to add your own screenshots!
 *
 * screenshots: Array of image paths.
 * Put your actual screenshot files in: frontend/public/screenshots/
 * Then reference them as: '/screenshots/your-image.png'
 *
 * Placeholder images are used until you add real ones.
 */
const PROJECTS = [
  {
    id: 1,
    title: 'Campus Marketplace',
    tagline: 'Buy & Sell within campus — built for students',
    description:
      'A full-stack web platform enabling students to list, browse, and transact campus goods. Features product listing, secure authentication, and a responsive interface optimized for mobile users on campus.',
    screenshots: [
      '/screenshots/campus-1.png',
      '/screenshots/campus-2.png',
      '/screenshots/campus-3.png',
    ],
    tech: ['Flask', 'PostgreSQL', 'HTML', 'CSS', 'JavaScript'],
    type: 'Full Stack',
    icon: <Globe size={18} />,
    color: '#00d4ff',
    github: 'https://github.com/ajay-kumar/campus-marketplace',
    live: null,
    highlights: ['Product listing & search', 'Role-based auth', 'Responsive UI'],
  },
  {
    id: 2,
    title: 'Feedback Management System',
    tagline: 'Live system — 300+ active student users',
    description:
      'A production-deployed feedback platform automating academic feedback collection and analysis. Features real-time visual dashboards, role-based access control, and automated backend processing. Currently live and used by 300+ students.',
    screenshots: [
      '/screenshots/feedback-1.png',
      '/screenshots/feedback-2.png',
      '/screenshots/feedback-3.png',
      '/screenshots/feedback-4.png',
    ],
    tech: ['Flask', 'PostgreSQL', 'HTML', 'CSS', 'JavaScript'],
    type: 'Full Stack · Live',
    icon: <Layers size={18} />,
    color: '#22c55e',
    github: 'https://github.com/ajay-kumar/feedback-system',
    live: '#',
    highlights: ['300+ active users', 'Real-time dashboards', 'Role-based access'],
  },
  {
    id: 3,
    title: 'Disease NER System',
    tagline: 'BioBERT-powered medical entity recognition',
    description:
      'An AI-powered Named Entity Recognition system trained on the NCBI Disease dataset using BioBERT. Detects and highlights disease entities in medical text via a web interface that supports both text input and image uploads for OCR-based analysis.',
    screenshots: [
      '/screenshots/ner-1.png',
      '/screenshots/ner-2.png',
      '/screenshots/ner-3.png',
    ],
    tech: ['Python', 'BioBERT', 'NLP', 'Transformers', 'Flask'],
    type: 'AI / NLP',
    icon: <Cpu size={18} />,
    color: '#a78bfa',
    github: 'https://github.com/ajay-kumar/disease-ner',
    live: null,
    highlights: ['NCBI Disease dataset', 'BioBERT fine-tuned', 'Text + image input'],
  },
]

/* ── Image Slider Component ── */
function ImageSlider({ screenshots, color, title }) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i === 0 ? screenshots.length - 1 : i - 1))
  const next = () => setCurrent(i => (i === screenshots.length - 1 ? 0 : i + 1))

  return (
    <div className="slider">
      {/* Main image */}
      <div className="slider__frame">
        <img
          src={screenshots[current]}
          alt={`${title} screenshot ${current + 1}`}
          className="slider__img"
          onError={e => {
            // Fallback placeholder when screenshot not found
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        {/* Placeholder shown until real screenshots are added */}
        <div
          className="slider__placeholder"
          style={{ '--card-color': color }}
        >
          <div className="placeholder__icon">📸</div>
          <p className="placeholder__text">
            Add screenshot to<br />
            <code>public/screenshots/</code>
          </p>
          <p className="placeholder__num">
            {current + 1} / {screenshots.length}
          </p>
        </div>

        {/* Navigation arrows */}
        {screenshots.length > 1 && (
          <>
            <button className="slider__btn slider__btn--prev" onClick={prev} aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button className="slider__btn slider__btn--next" onClick={next} aria-label="Next">
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Slide count badge */}
        <div className="slider__count">
          {current + 1} / {screenshots.length}
        </div>
      </div>

      {/* Dot indicators */}
      {screenshots.length > 1 && (
        <div className="slider__dots">
          {screenshots.map((_, i) => (
            <button
              key={i}
              className={`dot-btn ${i === current ? 'dot-btn--active' : ''}`}
              style={{ '--card-color': color }}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {screenshots.length > 1 && (
        <div className="slider__thumbs">
          {screenshots.map((src, i) => (
            <button
              key={i}
              className={`thumb ${i === current ? 'thumb--active' : ''}`}
              style={{ '--card-color': color }}
              onClick={() => setCurrent(i)}
            >
              <img
                src={src}
                alt={`Thumb ${i + 1}`}
                onError={e => {
                  e.target.style.display = 'none'
                }}
              />
              <span className="thumb__num">{i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Project Card ── */
function ProjectCard({ project, index }) {
  const isEven = index % 2 === 0

  return (
    <div className={`project-card ${isEven ? '' : 'project-card--reverse'}`}>
      {/* Slider side */}
      <div className="project-card__media">
        <ImageSlider
          screenshots={project.screenshots}
          color={project.color}
          title={project.title}
        />
      </div>

      {/* Info side */}
      <div className="project-card__info">
        {/* Type badge */}
        <div className="project-type" style={{ '--card-color': project.color }}>
          {project.icon}
          {project.type}
        </div>

        <h3 className="project-title">{project.title}</h3>
        <p className="project-tagline" style={{ color: project.color }}>
          {project.tagline}
        </p>
        <p className="project-desc">{project.description}</p>

        {/* Highlights */}
        <ul className="project-highlights">
          {project.highlights.map(h => (
            <li key={h} style={{ '--card-color': project.color }}>
              {h}
            </li>
          ))}
        </ul>

        {/* Tech stack */}
        <div className="project-tech">
          {project.tech.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        {/* Links */}
        <div className="project-links">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              <Github size={15} />
              Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link project-link--live"
              style={{ '--card-color': project.color }}
            >
              <ExternalLink size={15} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main Projects Section ── */
export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-label">Projects</div>
        <h2 className="section-title">Things I've Built</h2>
        <p className="section-sub">
          Real-world applications — from production systems serving hundreds of users
          to AI-powered research tools.
        </p>
        <div className="accent-line" />

        <div className="projects-list">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
