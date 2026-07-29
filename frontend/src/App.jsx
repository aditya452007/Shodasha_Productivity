import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import StatsCounter from './components/StatsCounter';
import Features from './components/Features';
import InteractiveDemo from './components/InteractiveDemo';
import AgencyStory from './components/AgencyStory';
import FaqAccordion from './components/FaqAccordion';
import Footer from './components/Footer';
import DownloadModal from './components/DownloadModal';
import BackToTop from './components/BackToTop';

export default function App() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Exact Windows Release URL provided by the user
  const releaseBlobUrl = "https://github.com/aditya452007/Shodasha_Productivity/releases/download/v0.1.6/Shodasha_0.1.0_x64-setup.exe";

  const handleOpenDownload = () => {
    setIsDownloadModalOpen(true);
  };

  const handleCloseDownload = () => {
    setIsDownloadModalOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Fixed Top Navigation Bar */}
      <Navbar onOpenDownload={handleOpenDownload} />

      {/* Main Semantic Content */}
      <main id="main-content" style={{ flex: 1 }}>
        {/* Rotating Hero Carousel */}
        <HeroCarousel onOpenDownload={handleOpenDownload} />

        {/* Animated Performance Stats Counter */}
        <StatsCounter />

        {/* Alternating Left-Right Product Features */}
        <Features />

        {/* Live Interactive App Demo */}
        <InteractiveDemo />

        {/* Shodasha Agency Origin & Evolution Story Section */}
        <AgencyStory />

        {/* FAQ Accordion */}
        <FaqAccordion />
      </main>

      {/* Single-Line Footer */}
      <Footer />

      {/* Windows Release Download Modal */}
      <DownloadModal 
        isOpen={isDownloadModalOpen} 
        onClose={handleCloseDownload} 
        releaseBlobUrl={releaseBlobUrl}
      />

      {/* Floating Back to Top Button & Sticky CTA */}
      <BackToTop onOpenDownload={handleOpenDownload} />

    </div>
  );
}
