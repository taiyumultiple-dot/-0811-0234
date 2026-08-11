import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CollapsibleSectionProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  defaultExpanded?: boolean;
  variant?: 'light' | 'dark';
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export default function CollapsibleSection({
  title,
  subtitle,
  icon,
  badge,
  defaultExpanded = true,
  variant = 'light',
  children,
  className = '',
  headerClassName = '',
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const isDark = variant === 'dark';

  const containerStyles = isDark
    ? 'bg-[#0D1D38] border border-[#1A3660] text-slate-100 shadow-xl'
    : 'bg-white border-2 border-[#EAD5C3] text-[#3E2723] shadow-sm';

  const headerStyles = isDark
    ? 'bg-[#0D1D38] hover:bg-[#122547] border-b border-[#1A3660]'
    : 'bg-[#FCFAF7] hover:bg-[#FAF5EC] border-b border-[#EAD5C3]';

  const titleStyles = isDark ? 'text-white' : 'text-[#3E2723]';
  const subtitleStyles = isDark ? 'text-slate-400' : 'text-[#7D5C43]';
  const btnTagStyles = isDark
    ? 'text-[#00E699] bg-[#00E699]/10 border border-[#00E699]/30'
    : 'text-[#B4570B] bg-amber-50 border border-amber-200/60';

  const iconBtnStyles = isDark
    ? 'bg-[#081225] border border-[#1A3660] text-[#00E699]'
    : 'bg-white border border-[#E9D6BF] text-[#E65100] shadow-3xs';

  return (
    <div className={`rounded-3xl overflow-hidden transition-all ${containerStyles} ${className}`}>
      {/* Header clickable bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(prev => !prev)}
        className={`w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors cursor-pointer select-none ${headerStyles} ${headerClassName}`}
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          {icon && <div className="shrink-0">{icon}</div>}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-extrabold text-base md:text-lg tracking-tight truncate ${titleStyles}`}>
                {title}
              </h3>
              {badge && <div className="shrink-0">{badge}</div>}
            </div>
            {subtitle && (
              <p className={`text-xs md:text-sm mt-0.5 truncate ${subtitleStyles}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full hidden sm:inline-block ${btnTagStyles}`}>
            {isExpanded ? '點擊收起' : '點擊展開'}
          </span>
          <div className={`p-1.5 rounded-xl ${iconBtnStyles}`}>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Content drawer */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`p-4 md:p-6 ${isDark ? 'bg-[#0D1D38]' : 'bg-white'}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
