import { cn } from '@/lib/utils';

interface Props {
  name: string;
  color?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function TechBadge({ name, color, size = 'sm', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-mono font-medium border',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
      style={{
        background: color ? `${color}15` : 'rgba(0,212,255,0.08)',
        color: color ?? 'var(--color-primary)',
        borderColor: color ? `${color}40` : 'rgba(0,212,255,0.25)',
      }}
    >
      {name}
    </span>
  );
}
