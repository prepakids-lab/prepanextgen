'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';

interface ValueItem {
  title: string;
  description: string;
  icon: string;
}

const VisionMissionValues: React.FC = () => {
  const values: ValueItem[] = [
    {
      title: 'VISION',
      description: 'Inspirer chaque enfant et adolescent à devenir un innovateur',
      icon: '👁️'
    },
    {
      title: 'MISSION',
      description: 'Former les élèves à travers des programmes pratiques en technologies, sciences du futur et innovation',
      icon: '🎯'
    },
    {
      title: 'VALEURS',
      description: 'Innovation, apprentissage pratique, créativité, collaboration et passion pour la technologie',
      icon: '💎'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0F2C] to-[#1a1f4e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Section */}
        <motion.div
          className="mb-16 max-w-6xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/prepanextgen-image4.png"
              alt="PrepaNextGen - Notre Identité"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F2C]/20 via-transparent to-transparent rounded-2xl" />
          </div>
        </motion.div>

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Notre Identité
          </h2>
          <p className="text-xl text-[#A8B2C8] max-w-3xl mx-auto">
            Les principes qui guident notre engagement envers chaque élève
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card variant="glass" className="h-full text-center group hover:border-[#C9A84C]/50">
                <div className="relative z-10">
                  <div className="text-5xl mb-6">{value.icon}</div>
                  
                  <h3 className="text-2xl font-serif text-[#C9A84C] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {value.title}
                  </h3>
                  
                  <p className="text-white leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Quote */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <blockquote className="max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl font-serif text-white italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              "Chaque enfant porte en lui le potentiel d'innover. Notre mission est de le révéler."
            </p>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionMissionValues;
