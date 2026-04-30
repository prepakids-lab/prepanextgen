'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/PrepaNextGen',
      icon: 'facebook'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/prepanextgen',
      icon: 'linkedin'
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@prepanextgen',
      icon: 'youtube'
    }
  ];

  const contactInfo = [
    {
      icon: MapPin,
      text: 'Riviera Palmeraie – Cocody – Abidjan, Côte d\'Ivoire'
    },
    {
      icon: Phone,
      text: '+225 07 88 12 44 87 | +225 05 01 19 42 42 | +225 05 54 22 64 11'
    },
    {
      icon: Mail,
      text: 'info@prepanextgen.com'
    }
  ];

  return (
    <footer className="bg-[#0A0F2C] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <Image
                src="/prepanextgen-logo.png"
                alt="PrepaNextGen"
                height={40}
                width={120}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-[#A8B2C8] text-sm leading-relaxed">
              Institut Technologique International pour les élèves de 7 à 18 ans
            </p>
            <p className="text-[#C9A84C] font-medium mt-4">
              "Inspirer chaque enfant à devenir un innovateur"
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {['Programmes', 'Catégories d\'âge', 'Expérience éducative', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(item.toLowerCase().replace(' ', '').replace('\'', ''));
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-[#A8B2C8] hover:text-[#C9A84C] transition-colors text-sm"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-4">Programmes</h3>
            <ul className="space-y-2">
              {['PrepaKid (7-11 ans)', 'FlexiTeen (11-15 ans)', 'NextGen (16-18 ans)', 'Langues', 'VIP', 'Vacances'].map((program) => (
                <li key={program}>
                  <button
                    onClick={() => {
                      const element = document.getElementById('programmes');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-[#A8B2C8] hover:text-[#C9A84C] transition-colors text-sm"
                  >
                    {program}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-3">
                  <info.icon size={16} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                  <span className="text-[#A8B2C8] text-sm">{info.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Social Links and Copyright */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-white text-sm font-medium">Suivez-nous:</span>
              <div className="flex gap-3">
                <motion.a
                  href="https://www.facebook.com/PrepaNextGen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A84C] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/company/prepanextgen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A84C] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://www.youtube.com/@prepanextgen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A84C] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Slogan */}
            <div className="text-[#C9A84C] text-sm text-center italic mb-2">
              Avec PrepaNextGen, chaque élève Imagine. Cultive. Innove.
            </div>

            {/* Copyright */}
            <div className="text-[#A8B2C8] text-sm text-center">
              © {new Date().getFullYear()} PrepaNextGen. Tous droits réservés.
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
