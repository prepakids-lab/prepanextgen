import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'popular' | 'premium';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
  
  const variants = {
    default: 'bg-[rgba(255,255,255,0.1)] text-white border border-white/20',
    gold: 'bg-[#C9A84C] text-white',
    popular: 'bg-gradient-to-r from-[#E10000] to-[#C00000] text-white',
    premium: 'bg-gradient-to-r from-[#C9A84C] to-[#B0943F] text-white',
  };

  const badgeStyles = `${baseStyles} ${variants[variant]} ${className}`;

  return <span className={badgeStyles}>{children}</span>;
};

export default Badge;
