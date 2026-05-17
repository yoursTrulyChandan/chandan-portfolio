import { personal } from '@/config/data';
import { GitFork, Link2, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="relative border-t py-12"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-alt)' }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span
            className="font-mono text-xl font-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            {'<CN />'}
          </span>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-dim)' }}>
            Chandan Nayak — Frontend Developer
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border transition-all hover:scale-110"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            <GitFork size={18} />
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border transition-all hover:scale-110"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            <Link2 size={18} />
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="p-2 rounded-lg border transition-all hover:scale-110"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            <Mail size={18} />
          </a>
        </div>

        <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
          © {new Date().getFullYear()} · Built with Next.js & ♥
        </p>
      </div>
    </footer>
  );
}
