'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface AgeCategory {
  title: string;
  age: string;
  description: string;
  features: string[];
  color: string;
}

const AgeCategories: React.FC = () => {
  const categories: AgeCategory[] = [
    {
      title: 'PrepaKid (7-11 ans)',
      age: '7-11 ans',
      description: 'Éveil & Découverte du numérique',
      features: [
        'Initiation à la technologie',
        'Jeux éducatifs',
        'Créativité digitale',
        'Apprentissage ludique'
      ],
      color: 'from-blue-500/20 to-purple-500/20'
    },
    {
      title: 'FlexiTeen (11-15 ans)',
      age: '11-15 ans',
      description: 'Autonomie & Maîtrise digitale',
      features: [
        'Programmation créative',
        'Projets pratiques',
        'Collaboration',
        'Innovation'
      ],
      color: 'from-green-500/20 to-blue-500/20'
    },
    {
      title: 'NextGen (16-18 ans)',
      age: '16-18 ans',
      description: 'Expertise & Innovation technologique',
      features: [
        'IA et Machine Learning',
        'Développement avancé',
        'Leadership tech',
        'Carrière digitale'
      ],
      color: 'from-red-500/20 to-orange-500/20'
    }
  ];

  return (
    <section id="categories" className="py-20 bg-[#0A0F2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Des parcours adaptés à chaque âge
          </h2>
          <p className="text-xl text-[#A8B2C8] max-w-3xl mx-auto">
            Chaque programme est conçu pour répondre aux besoins spécifiques de chaque tranche d'âge
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card variant="glass" className="h-full group hover:border-[#C9A84C]/50">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="gold">{category.age}</Badge>
                    <div className="text-3xl">
                      {category.title === 'PrepaKid (7-11 ans)' && '🚀'}
                      {category.title === 'FlexiTeen (11-15 ans)' && '💡'}
                      {category.title === 'NextGen (16-18 ans)' && '🎯'}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-serif text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {category.title}
                  </h3>
                  
                  <p className="text-[#C9A84C] font-medium mb-6">
                    {category.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-white/80">
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
      </div>
    </section>
  );
};

export default AgeCategories;
