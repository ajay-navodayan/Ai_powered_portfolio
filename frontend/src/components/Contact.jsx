import { Mail, Linkedin, Github, Phone, MapPin, Send } from 'lucide-react'
import './Contact.css'

const CONTACT_ITEMS = [
  {
    icon: <Mail size={18} />,
    label: 'Email',
    value: 'su-23003@sitare.org',
    href: 'mailto:su-23003@sitare.org',
    color: '#00d4ff',
  },
  {
    icon: <Phone size={18} />,
    label: 'Phone',
    value: '+91 9798867386',
    href: 'tel:+919798867386',
    color: '#22c55e',
  },
  {
    icon: <Linkedin size={18} />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/ajay-kumar',
    href: 'https://linkedin.com/in/ajay-kumar',
    color: '#38bdf8',
  },
  {
    icon: <Github size={18} />,
    label: 'GitHub',
    value: 'github.com/ajay-kumar',
    href: 'https://github.com/ajay-kumar',
    color: '#a78bfa',
  },
  {
    icon: <MapPin size={18} />,
    label: 'Location',
    value: 'Lucknow, India',
    href: null,
    color: '#fb7185',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-label">Contact</div>
        <h2 className="section-title">Let's Build Something</h2>
        <p className="section-sub">
          Available for full-time opportunities throughout 2026. Open to roles in
          full-stack development, AI engineering, or software development.
        </p>
        <div className="accent-line" />

        <div className="contact-grid">
          {/* Left: CTA */}
          <div className="contact-cta">
            <h3 className="cta-heading">
              Open to Opportunities
              <span className="cta-dot" />
            </h3>
            <p className="cta-text">
              Whether you have a role in mind, a project to build, or just want to
              connect — my inbox is always open. I'll get back to you within 24 hours.
            </p>
            <a
              href="mailto:su-23003@sitare.org"
              className="cta-btn"
            >
              <Send size={16} />
              Send Email
            </a>

            <div className="cta-availability">
              <span className="avail-dot" />
              Available for roles starting 2026
            </div>
          </div>

          {/* Right: Contact links */}
          <div className="contact-links">
            {CONTACT_ITEMS.map((item, i) => (
              <div key={i} className="contact-item" style={{ '--c-color': item.color }}>
                <div className="contact-item__icon">{item.icon}</div>
                <div className="contact-item__info">
                  <div className="contact-item__label">{item.label}</div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="contact-item__value"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="contact-item__value contact-item__value--plain">
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
