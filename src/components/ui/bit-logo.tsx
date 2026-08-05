import React from 'react';

interface BitLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export function BitLogo({ className = '', size = 'md', variant = 'dark' }: BitLogoProps) {
  const sizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8 text-[10px] sm:text-xs',
    md: 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-xs sm:text-sm',
    lg: 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-sm sm:text-base md:text-lg'
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 min-w-0 ${className}`}>
      {/* BIT Emblem Seal */}
      <div className={`${sizes[size]} rounded-2xl flex items-center justify-center font-extrabold tracking-tighter shadow-md shrink-0 border border-white/20 transition-all ${
        variant === 'light' 
          ? 'bg-white text-[#005BAC]' 
          : 'bg-gradient-to-br from-[#005BAC] to-[#1976D2] text-white'
      }`}>
        <span>BIT</span>
      </div>

      <div className="flex flex-col min-w-0 overflow-hidden">
        <span className={`font-extrabold tracking-tight leading-tight truncate text-[11px] sm:text-xs md:text-sm transition-all ${variant === 'light' ? 'text-white' : 'text-[#1E293B]'}`}>
          BANNARI AMMAN
        </span>
        <span className={`text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-wider uppercase truncate transition-all ${variant === 'light' ? 'text-sky-200' : 'text-[#005BAC]'}`}>
          Institute of Technology
        </span>
      </div>
    </div>
  );
}
