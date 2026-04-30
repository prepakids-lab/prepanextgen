'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AgeCategories from '../components/AgeCategories';
import ProgramsPricing from '../components/ProgramsPricing';
import EducationalExperience from '../components/EducationalExperience';
import VisionMissionValues from '../components/VisionMissionValues';
import Footer from '../components/Footer';
import AdmissionForm from '../components/AdmissionForm';
import WhatsAppButton from '../components/WhatsAppButton';
import Image from 'next/image';

export default function Home() {
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [preselectedProgram, setPreselectedProgram] = useState<{ category: string; type: string } | null>(null);

  const openAdmissionModal = () => setIsAdmissionModalOpen(true);
  const closeAdmissionModal = () => {
    setIsAdmissionModalOpen(false);
    setPreselectedProgram(null);
  };

  useEffect(() => {
    const handleOpenAdmissionModal = (event: CustomEvent) => {
      setPreselectedProgram(event.detail);
      openAdmissionModal();
    };

    window.addEventListener('openAdmissionModal', handleOpenAdmissionModal as EventListener);
    return () => {
      window.removeEventListener('openAdmissionModal', handleOpenAdmissionModal as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F2C]">
      <Header />

      <main>
        <Hero />
        
        {/* Premium Description Section */}
        <section className="py-20 bg-gradient-to-b from-[#0A0F2C] to-[#1a1f4e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-white leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Technologique, Digital, IA, Recherche & E-Business au Service des Élèves de 7 à 18 ans
                </motion.h2>
                
                <motion.div 
                  className="space-y-4 text-[#A8B2C8] text-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <p>
                    <span className="text-[#C9A84C] font-semibold">PrepaNextGen</span> est la plateforme d'incubation technologique pour les élèves de 7 à 18 ans. Sécurisée, complète et innovante, elle combine un environnement éducatif exceptionnel avec un tableau de bord personnalisé pour chaque parent et son enfant.
                  </p>
                  
                  <p>
                    Chaque élève maîtrise les <span className="text-white font-medium">technologies digitales</span>, l'<span className="text-white font-medium">intelligence artificielle</span>, les <span className="text-white font-medium">sciences du futur</span>, le <span className="text-white font-medium">marketing digital</span>, la <span className="text-white font-medium">fintech</span>, les <span className="text-white font-medium">jeux électroniques</span> et l'<span className="text-white font-medium">art oratoire</span>, tout en apprenant trois langues internationales : <span className="text-[#C9A84C] font-medium">Anglais, Espagnol et Mandarin</span>.
                  </p>
                  
                  <p>
                    Nos élèves échangent avec des jeunes du monde entier, s'immergeant dans une culture d'innovation globale. Chers parents, offrez à votre enfant l'opportunité de devenir un véritable leader technologique.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-gradient-to-r from-[#C9A84C]/20 to-transparent p-6 rounded-xl border border-[#C9A84C]/30"
                >
                  <p className="text-white font-medium text-lg italic">
                    "À PrepaNextGen, pratique, autonomie et innovation font partie de l'ADN de chaque élève. Nous formons les grands esprits de demain."
                  </p>
                </motion.div>
              </motion.div>
              
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative h-full"
              >
                <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <video
                    src="/prepanextgen-video8.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C]/30 via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section className="py-16 bg-gradient-to-b from-[#0A0F2C] to-[#1a1f4e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Découvrez Notre Univers
              </h2>
              <p className="text-[#A8B2C8] text-lg max-w-2xl mx-auto">
                Explorez les moments qui définissent l'excellence éducative chez PrepaNextGen
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { src: '/prepanextgen-image1.png', alt: 'PrepaNextGen - Image 1', delay: 0.1, type: 'image' },
                { src: '/prepanextgen-image2.png', alt: 'PrepaNextGen - Image 2', delay: 0.2, type: 'image' },
                { src: '/prepanextgen-enfant.mp4', alt: 'PrepaNextGen - Moment 3', delay: 0.3, type: 'video' },
                { src: '/prepanextgen-videotop.mp4', alt: 'PrepaNextGen - Moment 4', delay: 0.4, type: 'video' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  className="relative group overflow-hidden rounded-xl shadow-2xl hover:shadow-[#C9A84C]/30 transition-all duration-300"
                >
                  <div className="relative h-64 md:h-80">
                    {item.type === 'video' ? (
                      <video
                        src={item.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium">
                        Moment PrepaNextGen {index + 1}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <AgeCategories />
        <ProgramsPricing />
        <EducationalExperience />
        <VisionMissionValues />
        
        {/* Admission Section */}
        <section id="admission" className="py-20 bg-gradient-to-b from-[#0A0F2C] to-[#1a1f4e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/prepanextgen-image0.png"
                  alt="PrepaNextGen - Admission Gauche"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F2C]/50 to-transparent" />
              </motion.div>

              {/* Center Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Prêt à commencer l'aventure ?
                </h2>
                <p className="text-xl text-[#A8B2C8] mb-8 max-w-2xl mx-auto">
                  Rejoignez notre communauté d'apprenants et donnez à votre enfant les meilleures opportunités pour réussir dans le monde numérique.
                </p>
                <button
                  onClick={openAdmissionModal}
                  className="bg-[#E10000] hover:bg-[#C00000] text-white font-medium px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Demande d'admission
                </button>
              </motion.div>

              {/* Right Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/prepannxtgen-image7.png"
                  alt="PrepaNextGen - Admission Droite"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#0A0F2C]/50 to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Admission Modal */}
      <AdmissionForm
        isOpen={isAdmissionModalOpen}
        onClose={closeAdmissionModal}
        preselectedProgram={preselectedProgram}
      />

      <WhatsAppButton />
    </div>
  );
}
