'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  href,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full';
  
  const variants = {
    primary: 'bg-[#E10000] text-white hover:bg-[#C00000] shadow-lg hover:shadow-xl',
    secondary: 'bg-[#C9A84C] text-white hover:bg-[#B0943F] shadow-lg hover:shadow-xl',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-[#0A0F2C] hover:shadow-xl',
    gold: 'bg-[#C9A84C] text-white hover:bg-[#B0943F] shadow-lg hover:shadow-xl',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const MotionComponent = motion.button;

  if (href) {
    return (
      <motion.a
        href={href}
        className={buttonStyles}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <MotionComponent
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </MotionComponent>
  );
};

export default Button;
