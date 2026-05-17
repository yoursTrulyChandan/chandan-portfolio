'use client';
import { useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Mail, Phone, MapPin, GitFork, Link2, Send, CheckCircle } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import MagneticButton from '@/components/ui/MagneticButton';
import { personal } from '@/config/data';

const socials = [
  { icon: GitFork, label: 'GitHub', href: personal.github, color: '#e2e8f0' },
  { icon: Link2, label: 'LinkedIn', href: personal.linkedin, color: '#0ea5e9' },
  { icon: Mail, label: 'Email', href: `mailto:${personal.email}`, color: '#00d4ff' },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${formState.name}`);
    const body = encodeURIComponent(`Hi Chandan,\n\n${formState.message}\n\nFrom: ${formState.name}\nEmail: ${formState.email}`);
    window.open(`mailto:${personal.email}?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: 'var(--color-bg-alt)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,212,255,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's Build Something"
          subtitle="Open to full-time roles, freelance projects, and interesting collaborations."
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid lg:grid-cols-2 gap-10 max-w-4xl mx-auto"
        >
          {/* Left — info */}
          <motion.div variants={item} className="space-y-6">
            {/* Status */}
            <div
              className="flex items-center gap-3 p-4 rounded-2xl border"
              style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}
            >
              <span className="w-3 h-3 rounded-full bg-success animate-pulse-slow" />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                  Open to Work
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
                  Currently at Molecule Ventures · Available for select opportunities
                </p>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
                { icon: Phone, label: 'Phone', value: personal.phone, href: `tel:${personal.phone}` },
                { icon: MapPin, label: 'Location', value: personal.location, href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <motion.div
                  key={label}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  >
                    <Icon size={16} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium hover:underline"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Socials */}
            <div>
              <p className="text-xs mb-3 font-mono" style={{ color: 'var(--color-text-dim)' }}>FIND ME ON</p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, label, href, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={label !== 'Email' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium"
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <Icon size={16} style={{ color }} />
                    {label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Download CV placeholder */}
            <MagneticButton
              variant="outline"
              href={`mailto:${personal.email}?subject=CV Request`}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 24px' }}
            >
              Request Resume
            </MagneticButton>
          </motion.div>

          {/* Right — form */}
          <motion.div variants={item}>
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl space-y-5"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 0 40px rgba(0,212,255,0.04)',
              }}
            >
              {(['name', 'email'] as const).map((field) => (
                <div key={field} className="relative">
                  <motion.label
                    htmlFor={field}
                    animate={{
                      top: focused === field || formState[field] ? '-10px' : '14px',
                      fontSize: focused === field || formState[field] ? '11px' : '14px',
                      color: focused === field ? 'var(--color-primary)' : 'var(--color-text-dim)',
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-4 pointer-events-none z-10 font-medium capitalize"
                    style={{ transformOrigin: 'left' }}
                  >
                    {field}
                  </motion.label>
                  <input
                    id={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    value={formState[field]}
                    onChange={e => setFormState(p => ({ ...p, [field]: e.target.value }))}
                    onFocus={() => setFocused(field)}
                    onBlur={() => setFocused(null)}
                    className="w-full pt-6 pb-3 px-4 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'var(--color-surface-alt)',
                      border: `1px solid ${focused === field ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      color: 'var(--color-text)',
                      boxShadow: focused === field ? '0 0 0 3px rgba(0,212,255,0.08)' : 'none',
                    }}
                  />
                </div>
              ))}

              <div className="relative">
                <motion.label
                  htmlFor="message"
                  animate={{
                    top: focused === 'message' || formState.message ? '-10px' : '14px',
                    fontSize: focused === 'message' || formState.message ? '11px' : '14px',
                    color: focused === 'message' ? 'var(--color-primary)' : 'var(--color-text-dim)',
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-4 pointer-events-none z-10 font-medium"
                >
                  Message
                </motion.label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={e => setFormState(p => ({ ...p, message: e.target.value }))}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  className="w-full pt-6 pb-3 px-4 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{
                    background: 'var(--color-surface-alt)',
                    border: `1px solid ${focused === 'message' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    color: 'var(--color-text)',
                    boxShadow: focused === 'message' ? '0 0 0 3px rgba(0,212,255,0.08)' : 'none',
                  }}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: submitted
                    ? 'rgba(16,185,129,0.15)'
                    : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  color: submitted ? 'var(--color-success)' : '#fff',
                  border: submitted ? '1px solid rgba(16,185,129,0.3)' : 'none',
                  boxShadow: submitted ? 'none' : '0 0 24px rgba(0,212,255,0.3)',
                }}
              >
                {submitted ? (
                  <><CheckCircle size={16} /> Message sent!</>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
