'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import Button from './ui/Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0F2C]/95 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center">
                <Image
                  src="/prepanextgen-logo.png"
                  alt="PrepaNextGen"
                  height={40}
                  width={120}
                  className="h-10 w-auto mr-3"
                />
                <span className="text-white font-serif text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  PrepaNextGen
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Programmes', 'Contact'].map((item, index) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-white hover:text-[#C9A84C] transition-colors font-medium"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {item}
                </motion.button>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button variant="outline" size="sm">
                  Connexion
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button variant="primary" size="sm" onClick={() => {
                  window.dispatchEvent(new CustomEvent('openAdmissionModal', { detail: null }));
                }}>
                  Demande d'admission
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-[#0A0F2C]/95 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {['Programmes', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left text-white hover:text-[#C9A84C] transition-colors font-medium py-2"
                >
                  {item}
                </button>
              ))}
              <div className="pt-4 space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  Connexion
                </Button>
                <Button variant="primary" size="sm" className="w-full" onClick={() => {
                  window.dispatchEvent(new CustomEvent('openAdmissionModal', { detail: null }));
                  setIsMobileMenuOpen(false);
                }}>
                  Demande d'admission
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.header>
    </>
  );
};

export default Header;
