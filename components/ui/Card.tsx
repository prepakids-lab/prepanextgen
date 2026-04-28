'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gold';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
}) => {
  const baseStyles = 'rounded-lg p-6 transition-all duration-300';
  
  const variants = {
    default: 'bg-white text-[#0A0F2C] shadow-lg',
    glass: 'bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-white/10 text-white',
    gold: 'bg-gradient-to-br from-[#C9A84C] to-[#B0943F] text-white shadow-lg',
  };

  const cardStyles = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <motion.div
      className={cardStyles}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
