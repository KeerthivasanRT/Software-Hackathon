import React from 'react';

export function Footer() {
  return (
    <footer className="py-4 px-6 bg-white/80 border-t border-[#D6EAF8] text-center text-xs font-semibold text-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
      <div>
        © 2026 <strong className="text-[#005BAC]">Bannari Amman Institute of Technology</strong>. All rights reserved.
      </div>
      <div className="text-slate-500 font-medium">
        BIT Smart Transport Management Portal
      </div>
    </footer>
  );
}
