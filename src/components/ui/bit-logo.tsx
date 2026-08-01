import React from 'react';

interface BitLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export function BitLogo({ className = '', size = 'md', variant = 'dark' }: BitLogoProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* BIT Emblem Seal */}
      <div className={`${sizes[size]} rounded-2xl flex items-center justify-center font-extrabold tracking-tighter shadow-md shrink-0 border border-white/20 ${
        variant === 'light' 
          ? 'bg-white text-[#005BAC]' 
          : 'bg-gradient-to-br from-[#005BAC] to-[#1976D2] text-white'
      }`}>
        <span>BIT</span>
      </div>

      <div className="flex flex-col">
        <span className={`font-extrabold tracking-tight leading-tight ${variant === 'light' ? 'text-white' : 'text-[#1E293B]'}`}>
          BANNARI AMMAN
        </span>
        <span className={`text-[10px] font-bold tracking-wider uppercase ${variant === 'light' ? 'text-sky-200' : 'text-[#005BAC]'}`}>
          Institute of Technology
        </span>
      </div>
    </div>
  );
}
