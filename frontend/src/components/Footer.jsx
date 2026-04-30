import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__logo">
          <span className="logo-bracket">&lt;</span>AK<span className="logo-bracket">/&gt;</span>
        </div>
        <p className="footer__copy">
          © {new Date().getFullYear()} Ajay Kumar · Built with React + Flask · Powered by RAG AI
        </p>
        <div className="footer__links">
          <a href="#hero">Top</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  )
}
