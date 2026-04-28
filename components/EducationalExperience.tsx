'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';

interface ExperienceCard {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

const EducationalExperience: React.FC = () => {
  const experiences: ExperienceCard[] = [
    {
      icon: '🛠️',
      title: 'Ateliers interactifs',
      description: 'Apprendre en faisant',
      features: [
        'Projets pratiques',
        'Apprentissage par l\'action',
        'Collaboration d\'équipe'
      ]
    },
    {
      icon: '💻',
      title: 'Projets technologiques',
      description: 'Coder, créer, innover',
      features: [
        'Développement web',
        'Applications mobiles',
        'Intelligence artificielle'
      ]
    },
    {
      icon: '🏆',
      title: 'Concours d\'innovation',
      description: 'Se dépasser et briller',
      features: [
        'Compétitions nationales',
        'Défis techniques',
        'Reconnaissance du talent'
      ]
    },
    {
      icon: '🎓',
      title: 'Événements éducatifs',
      description: 'Networking dès le plus jeune âge',
      features: [
        'Conférences d\'experts',
        'Rencontres avec des professionnels',
        'Visites d\'entreprises'
      ]
    },
    {
      icon: '🧭',
      title: 'Orientation académique',
      description: 'Tracer son chemin vers l\'excellence',
      features: [
        'Conseil personnalisé',
        'Préparation aux études supérieures',
        'Carrières technologiques'
      ]
    }
  ];

  return (
    <section className="py-20 bg-[#0A0F2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Une expérience éducative unique
          </h2>
          <p className="text-xl text-[#A8B2C8] max-w-3xl mx-auto">
            Au-delà des cours, nous offrons un écosystème complet pour le développement de votre enfant
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={index === 3 ? 'lg:col-start-2' : ''}
            >
              <Card variant="glass" className="h-full group hover:border-[#C9A84C]/50">
                <div className="relative z-10">
                  <div className="text-5xl mb-4 text-center">{experience.icon}</div>
                  
                  <h3 className="text-2xl font-serif text-white mb-2 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {experience.title}
                  </h3>
                  
                  <p className="text-[#C9A84C] font-medium mb-6 text-center">
                    {experience.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {experience.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-white/80 text-sm">
                        <div className="w-2 h-2 bg-[#C9A84C] rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-lg text-white mb-6">
            Rejoignez notre communauté d'apprenants passionnés
          </p>
          <div className="inline-flex items-center gap-4 text-[#C9A84C]">
            <div className="text-3xl font-bold">122+</div>
            <div className="text-white/80">Élèves déjà formés</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationalExperience;
