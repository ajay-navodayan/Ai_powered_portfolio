import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Chatbot from './components/Chatbot'
import Footer from './components/Footer'

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      {/* Floating AI Chat Button + Window */}
      <Chatbot isOpen={chatOpen} setIsOpen={setChatOpen} />
    </div>
  )
}
