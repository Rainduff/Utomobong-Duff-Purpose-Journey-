import { useState, useRef } from 'react';
import { MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectGallery from './components/ProjectGallery';
import ProjectLightbox from './components/ProjectLightbox';
import ExperienceTimeline from './components/ExperienceTimeline';
import ResumeSection from './components/ResumeSection';
import WritingNotes from './components/WritingNotes';
import ArticleDrawer from './components/ArticleDrawer';
import ContactSection from './components/ContactSection';
import SpotlightTour from './components/SpotlightTour';
import Footer from './components/Footer';
import { Project, ArticleNote } from './types/portfolio';
import { PROJECTS } from './data/portfolioData';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeArticle, setActiveArticle] = useState<ArticleNote | null>(null);
  const [tourOpen, setTourOpen] = useState(false);
  const contactNameRef = useRef<HTMLInputElement>(null);

  const handleNavigateContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
    window.setTimeout(() => {
      contactNameRef.current?.focus({ preventScroll: true });
    }, 400);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
        {/* Top Navigation */}
        <Navbar onNavigateContact={handleNavigateContact} />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <Hero onStartTour={() => setTourOpen(true)} />

          {/* Selected Projects Gallery */}
          <ProjectGallery onSelectProject={(p) => setSelectedProject(p)} />

          {/* Experience & Career Chronology */}
          <ExperienceTimeline />

          {/* Dedicated Resume Section with Role Presets & Downloadable PDF */}
          <ResumeSection />

          {/* Writing & Engineering Notes */}
          <WritingNotes onSelectArticle={(article) => setActiveArticle(article)} />

          {/* Contact Section */}
          <ContactSection nameInputRef={contactNameRef} />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive Project Lightbox Modal */}
        <ProjectLightbox
          project={selectedProject}
          allProjects={PROJECTS}
          onClose={() => setSelectedProject(null)}
          onSelectProject={(p) => setSelectedProject(p)}
        />

        {/* Full Engineering Essay Reader Drawer */}
        <ArticleDrawer
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />

        {/* Interactive Portfolio Tour Overlay */}
        <SpotlightTour
          isOpen={tourOpen}
          onClose={() => setTourOpen(false)}
        />
      </div>
    </MotionConfig>
  );
}
