'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface Program {
  name: string;
  duration: string;
  price: string;
  totalPrice?: string;
  economy?: string;
  badge?: 'popular' | 'premium';
  features: string[];
}

interface ProgramCategory {
  name: string;
  focus: string;
  description: string;
  programs: Program[];
}

const ProgramsPricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('prepakids');

  const categories: Record<string, ProgramCategory> = {
    prepakids: {
      name: 'PrepaKid (7-11 ans)',
      focus: 'Éveil & Découverte',
      description: 'Mon enfant découvre intelligemment le digital et l\'IA',
      programs: [
        {
          name: 'Programme',
          duration: '1 mois',
          price: '69 000 FCFA',
          features: [
            'Initiation Dactylographie',
            'Culture technologique',
            'Initiation Word'
          ]
        },
        {
          name: 'BOOST',
          duration: '3 mois',
          price: '66 335 FCFA/mois',
          totalPrice: '169 150 FCFA total',
          economy: '29 855 FCFA',
          features: [
            'Initiation Dactylographie',
            'Culture technologique',
            'Initiation Word & Excel',
            'Initiation Écriture & Dessin',
            'Initiation Autonomie',
            'Initiation Imagination',
            'Initiation Digital',
            'Anglais Général'
          ]
        },
        {
          name: 'IMPACT',
          duration: '6 mois',
          price: '49 835 FCFA/mois',
          totalPrice: '254 150 FCFA total',
          economy: '44 860 FCFA',
          badge: 'popular',
          features: [
            'Initiation Dactylographie',
            'Culture technologique',
            'Initiation & Intermédiaire Word & Excel',
            'Initiation Écriture & Dessin',
            'Initiation Autonomie & Imagination',
            'Initiation Art oratoire',
            'Initiation Digital',
            'Anglais Général & Technologique',
            'Accès Ateliers interactifs',
            'Accès Événements exclusifs',
            'Accès Jeux technologie'
          ]
        },
        {
          name: 'HUB',
          duration: '10 mois',
          price: '39 900 FCFA/mois',
          totalPrice: '339 150 FCFA total',
          economy: '59 850 FCFA',
          badge: 'premium',
          features: [
            'Initiation & Intermédiaire Dactylographie',
            'Culture technologique',
            'Initiation & Intermédiaire Word & Excel',
            'Initiation & Intermédiaire Écriture & Dessin',
            'Initiation Autonomie & Imagination',
            'Initiation Art oratoire',
            'Initiation Digital & IA',
            'Programmation Scratch',
            'Anglais & Espagnol Général & Technologique',
            'Accès Ateliers interactifs',
            'Accès Orientation scolaire',
            'Accès Événements',
            'Préparation concours tech',
            'Accès Jeux technologie',
            'Et bien d\'autres'
          ]
        }
      ]
    },
    flexiteen: {
      name: 'FlexiTeen (11-15 ans)',
      focus: 'Autonomie & Usage',
      description: 'Mon enfant maîtrise l\'ordinateur, le digital, l\'IA et parle anglais & espagnol',
      programs: [
        {
          name: 'Programme',
          duration: '1 mois',
          price: '79 000 FCFA',
          features: [
            'Initiation Dactylographie',
            'Culture technologique',
            'Initiation Word & Excel',
            'Initiation Digital'
          ]
        },
        {
          name: 'BOOST',
          duration: '3 mois',
          price: '99 000 FCFA/mois',
          totalPrice: '254 150 FCFA total',
          economy: '42 850 FCFA',
          features: [
            'Initiation Dactylographie',
            'Culture technologique',
            'Initiation Word & Excel',
            'Initiation Écriture & Dessin',
            'Initiation Autonomie & Imagination',
            'Initiation Digital',
            'Anglais Général'
          ]
        },
        {
          name: 'IMPACT',
          duration: '6 mois',
          price: '66 500 FCFA/mois',
          totalPrice: '339 150 FCFA total',
          economy: '59 850 FCFA',
          badge: 'popular',
          features: [
            'Initiation Dactylographie',
            'Culture technologique',
            'Initiation & Intermédiaire Word & Excel',
            'Initiation Écriture & Dessin',
            'Initiation Autonomie & Imagination',
            'Initiation Art oratoire',
            'Initiation Digital',
            'Anglais Général & Technologique',
            'Accès Ateliers interactifs',
            'Accès Événements exclusifs',
            'Accès Jeux technologie'
          ]
        },
        {
          name: 'HUB',
          duration: '10 mois',
          price: '49 900 FCFA/mois',
          totalPrice: '424 150 FCFA total',
          economy: '74 850 FCFA',
          badge: 'premium',
          features: [
            'Initiation & Intermédiaire Dactylographie',
            'Culture technologique',
            'Initiation & Intermédiaire Word & Excel',
            'Initiation & Intermédiaire Écriture & Dessin',
            'Initiation Autonomie & Imagination',
            'Initiation Art oratoire',
            'Initiation Digital & IA',
            'Programmation Scratch & Python',
            'Anglais & Espagnol Général & Technologique',
            'Accès Ateliers interactifs',
            'Accès Orientation scolaire',
            'Accès Événements',
            'Préparation concours tech',
            'Accès Jeux technologie',
            'Et bien d\'autres'
          ]
        }
      ]
    },
    nextgen: {
      name: 'NextGen (16-18 ans)',
      focus: 'Expertise & Innovation',
      description: 'Mon enfant devient expert du digital, de l\'IA, parle anglais & espagnol',
      programs: [
        {
          name: 'Programme',
          duration: '1 mois',
          price: '99 000 FCFA',
          features: [
            'Initiation Dactylographie',
            'Culture technologique',
            'Initiation Word & Excel'
          ]
        },
        {
          name: 'BOOST',
          duration: '3 mois',
          price: '133 000 FCFA/mois',
          totalPrice: '339 150 FCFA total',
          economy: '59 850 FCFA',
          features: [
            'Initiation Dactylographie',
            'Culture technologique',
            'Initiation Word & Excel',
            'Initiation Écriture & Dessin',
            'Initiation Autonomie & Imagination',
            'Initiation Digital',
            'Anglais Général'
          ]
        },
        {
          name: 'IMPACT',
          duration: '6 mois',
          price: '83 500 FCFA/mois',
          totalPrice: '424 150 FCFA total',
          economy: '76 850 FCFA',
          badge: 'popular',
          features: [
            'Dactylographie',
            'Culture technologique',
            'Word & Excel',
            'Écriture & Dessin',
            'Art oratoire',
            'Programmation & Robotique',
            'Automatisation',
            'Appareils & Terminaux mobiles',
            'Infographie & Design graphique',
            'Initiation & Intermédiaire Imagination',
            'Initiation & Intermédiaire Digital',
            'Anglais Général & Technologique',
            'Accès Ateliers interactifs',
            'Accès Événements exclusifs',
            'Accès Jeux technologie'
          ]
        },
        {
          name: 'HUB',
          duration: '10 mois',
          price: '59 900 FCFA/mois',
          totalPrice: '509 150 FCFA total',
          economy: '89 850 FCFA',
          badge: 'premium',
          features: [
            'Initiation → Avancé Dactylographie',
            'Initiation → Avancé Culture technologique',
            'Initiation → Avancé Word & Excel',
            'Initiation → Avancé Écriture & Dessin',
            'Initiation → Intermédiaire Programmation & Robotique',
            'Initiation → Intermédiaire Automatisation',
            'Initiation → Avancé Infographie & Design graphique',
            'Autonomie & Imagination',
            'Initiation → Avancé Art oratoire',
            'Initiation → Avancé Digital & IA',
            'Anglais & Espagnol Général & Technologique',
            'Accès Ateliers interactifs avancés',
            'Accès Orientation scolaire',
            'Préparation concours Digital & IA',
            'Accès Jeux technologie',
            'Et bien d\'autres'
          ]
        }
      ]
    },
    langues: {
      name: 'Langues Internationales',
      focus: 'Communication Globale',
      description: 'Maîtrisez les langues avec une approche technologique',
      programs: [
        {
          name: 'Programme',
          duration: '1 mois',
          price: '79 000 FCFA',
          features: [
            '🇬🇧 Anglais Général + Technologie',
            '🇪🇸 Espagnol Général + Technologie',
            '🇨🇳 Mandarin (Chinois) + Technologie'
          ]
        },
        {
          name: 'BOOST',
          duration: '3 mois',
          price: '69 000 FCFA/mois',
          totalPrice: '175 950 FCFA total',
          economy: '31 050 FCFA',
          features: [
            'Expression orale & écrite',
            'Vocabulaire du quotidien',
            'Initiation au digital (IA, outils numériques, coding)',
            'Bases solides en espagnol',
            'Conversation pratique',
            'Compétences digitales modernes'
          ]
        },
        {
          name: 'IMPACT',
          duration: '6 mois',
          price: '59 000 FCFA/mois',
          totalPrice: '300 950 FCFA total',
          economy: '53 050 FCFA',
          badge: 'popular',
          features: [
            'Programme complet bilingue',
            'Culture technologique',
            'Projets internationaux',
            'Certification linguistique'
          ]
        },
        {
          name: 'HUB',
          duration: '10 mois',
          price: '49 000 FCFA/mois',
          totalPrice: '416 500 FCFA total',
          economy: '73 500 FCFA',
          badge: 'premium',
          features: [
            'Maîtrise avancée',
            'Préparation aux examens internationaux',
            'Stage à l\'étranger inclus',
            'Mentorat personnalisé'
          ]
        }
      ]
    },
    vip: {
      name: 'VIP',
      focus: 'Sur mesure',
      description: 'Programme personnalisé selon vos besoins',
      programs: [
        {
          name: 'PREPANEXTGEN VIP',
          duration: 'Sur mesure',
          price: 'Devis personnalisé',
          features: [
            'Dactylographie & Bureautique (Word, Excel, Teams)',
            'Culture technologique & scientifique',
            'Programmation & Automatisation',
            'Découverte des appareils',
            'Infographie & Design graphique',
            'Écriture & Dessin',
            'Visual Mind & Mind Mapping',
            'Anglais général & technologique',
            'Expression orale & Art oratoire',
            'Intelligence artificielle',
            'Cybersécurité & Droit digital & IA',
            'Techniques de lecture rapide',
            'Mémorisation & Imagination',
            'Organisation & Autonomie',
            'Compétitions, concours & prix',
            'Et bien d\'autres activités'
          ]
        }
      ]
    },
    vacances: {
      name: 'Vacances Digitales',
      focus: 'Sessions Juin – Août',
      description: 'Technologie, Digital & IA — des sessions immersives pendant les vacances scolaires',
      programs: [
        {
          name: 'Session A',
          duration: '1 mois',
          price: 'Dès 185 000 FCFA',
          features: [
            '⏰ Lun–Jeu : 9h00 – 16h00',
            '🎮 Vendredi : Jeux digitaux & IA (facultatif)',
            '👦 PrepaKid (7-11 ans) : 185 000 FCFA',
            '🧑 FlexiTeen (11-15 ans) : 195 000 FCFA',
            '🎓 NextGen (16-18 ans) : 225 000 FCFA'
          ]
        },
        {
          name: 'Session B',
          duration: '2 mois',
          price: 'Dès 285 000 FCFA',
          features: [
            '⏰ Lun–Jeu : 9h00 – 16h00',
            '🎮 Vendredi : Jeux digitaux & IA (facultatif)',
            '👦 PrepaKid (7-11 ans) : 285 000 FCFA',
            '🧑 FlexiTeen (11-15 ans) : 295 000 FCFA',
            '🎓 NextGen (16-18 ans) : 325 000 FCFA'
          ]
        },
        {
          name: 'Session C',
          duration: '3 mois complets',
          price: 'Dès 325 000 FCFA',
          features: [
            '⏰ Lun–Jeu : 9h00 – 16h00',
            '🎮 Vendredi : Jeux digitaux & IA (facultatif)',
            '👦 PrepaKid (7-11 ans) : 325 000 FCFA',
            '🧑 FlexiTeen (11-15 ans) : 325 000 FCFA',
            '🎓 NextGen (16-18 ans) : 425 000 FCFA'
          ]
        }
      ]
    }
  };

  const tabs = [
    { id: 'prepakids', label: 'PrepaKid (7-11 ans)' },
    { id: 'flexiteen', label: 'FlexiTeen (11-15 ans)' },
    { id: 'nextgen', label: 'NextGen (16-18 ans)' },
    { id: 'langues', label: 'Langues' },
    { id: 'vip', label: 'VIP' },
    { id: 'vacances', label: 'Vacances' }
  ];

  const currentCategory = categories[activeTab];

  return (
    <section id="programmes" className="py-20 bg-gradient-to-b from-[#0A0F2C] to-[#1a1f4e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Programmes & Tarifs
          </h2>
          <p className="text-xl text-[#A8B2C8] max-w-3xl mx-auto">
            Choisissez le programme adapté aux besoins de votre enfant
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#E10000] text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Category Description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-serif text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {currentCategory.name}: <span className="text-[#C9A84C]">{currentCategory.focus}</span>
            </h3>
            <p className="text-lg text-[#A8B2C8]">{currentCategory.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Programs Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`programs-${activeTab}`}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentCategory.programs.map((program, index) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="glass" className={`h-full relative ${program.badge ? 'border-2' : ''} ${
                  program.badge === 'popular' ? 'border-[#E10000]' : 
                  program.badge === 'premium' ? 'border-[#C9A84C]' : ''
                }`}>
                  {program.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge variant={program.badge === 'popular' ? 'popular' : 'premium'}>
                        {program.badge === 'popular' ? 'POPULAIRE' : 'PREMIUM'}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-serif text-white mb-2">{program.name}</h4>
                    <p className="text-[#A8B2C8] mb-4">{program.duration}</p>
                    <div className="text-3xl font-bold text-[#C9A84C] mb-2">{program.price}</div>
                    {program.totalPrice && (
                      <p className="text-sm text-[#A8B2C8] mb-2">{program.totalPrice}</p>
                    )}
                    {program.economy && (
                      <div className="inline-block bg-green-500/20 border border-green-400/40 rounded-full px-4 py-1 mt-1">
                        <p className="text-sm font-bold text-green-400">🎉 Économie : {program.economy}</p>
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-white/80 text-sm">
                        <div className="w-2 h-2 bg-[#C9A84C] rounded-full mr-2 mt-1 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button variant="primary" className="w-full" onClick={() => {
                    const event = new CustomEvent('openAdmissionModal', {
                      detail: {
                        programCategory: currentCategory.name,
                        programType: program.name
                      }
                    });
                    window.dispatchEvent(event);
                  }}>
                    Demande d'admission
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProgramsPricing;
