'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Badge from './ui/Badge';

const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F2C] via-[#1a1f4e] to-[#0A0F2C]" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[
          { width: 250, height: 200, left: '10%',  top: '15%',  dx: 30,  dy: -20, duration: 14 },
          { width: 180, height: 320, left: '70%',  top: '5%',   dx: -40, dy: 35,  duration: 18 },
          { width: 300, height: 150, left: '35%',  top: '60%',  dx: 20,  dy: -30, duration: 12 },
          { width: 220, height: 260, left: '80%',  top: '40%',  dx: -25, dy: 15,  duration: 16 },
          { width: 160, height: 190, left: '55%',  top: '75%',  dx: 35,  dy: -10, duration: 20 },
          { width: 280, height: 240, left: '5%',   top: '50%',  dx: -15, dy: 40,  duration: 15 },
        ].map((blob, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: blob.width,
              height: blob.height,
              left: blob.left,
              top: blob.top,
            }}
            animate={{
              x: [0, blob.dx],
              y: [0, blob.dy],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <video
                src="/prepanextgen-imagedigital.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C]/20 via-transparent to-transparent rounded-2xl" />
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="order-2 lg:order-2 text-center lg:text-left"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6">
                Institut Technologique International
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Chaque élève doit être
              <span className="text-[#C9A84C]"> innovateur</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-[#A8B2C8] mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              La plateforme d'incubation Technologique, Digitale & IA pour les élèves de 7 à 18 ans du monde entier
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('programmes')}
              >
                Programme
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('admission')}
              >
                Admission
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start items-center text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#C9A84C]">122+</div>
                <div className="text-sm md:text-base text-[#A8B2C8]">Élèves formés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#C9A84C]">4</div>
                <div className="text-sm md:text-base text-[#A8B2C8]">Départements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#C9A84C]">12</div>
                <div className="text-sm md:text-base text-[#A8B2C8]">International</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
