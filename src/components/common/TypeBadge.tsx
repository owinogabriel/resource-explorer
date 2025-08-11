'use client';

import { cn } from '@/lib/utils/cn';
import { TYPE_COLORS } from '@/lib/utils/constants';

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white',
        TYPE_COLORS[type] || 'bg-gray-400',
        className
      )}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}
