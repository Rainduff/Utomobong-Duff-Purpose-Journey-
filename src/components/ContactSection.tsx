import { useState, RefObject } from 'react';
import { Copy, Check, Send, Phone, MapPin, Award, AlertCircle, ExternalLink } from 'lucide-react';
import { PERSONAL_INFO, PITCH_DAY_CERTIFICATE_PDF } from '../data/portfolioData';

interface ContactSectionProps {
  nameInputRef: RefObject<HTMLInputElement | null>;
}

export default function ContactSection({ nameInputRef }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [serverNote, setServerNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setStatus('error');
        setErrorMsg(payload.error || 'Could not deliver your message. Please try again.');
        return;
      }

      setServerNote(payload.message || 'Your message has been delivered.');
      setStatus('sent');
    } catch {
      setStatus('error');
      setErrorMsg('Network error while sending message. Please email directly.');
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-b border-zinc-100 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left info column (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                Get In Touch
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
                Let&apos;s build and tell meaningful stories.
              </h2>
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed">
              Open to AI/ML engineering roles, predictive maintenance &amp; NLP research collaborations, technical instruction, and creative media direction.
            </p>

            {/* Email quick copy */}
            <div className="pt-2">
              <div className="text-xs font-mono text-zinc-400 mb-1.5">Direct Email</div>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="text-sm font-semibold text-zinc-900 hover:underline"
                >
                  {PERSONAL_INFO.email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {copied && (
                <span className="text-xs text-emerald-600 font-medium">Copied to clipboard</span>
              )}
            </div>

            {/* Phone, Location & Certificate */}
            <div className="pt-4 border-t border-zinc-100 space-y-3 text-sm text-zinc-600">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                <span className="font-mono text-xs tabular-nums">
                  {PERSONAL_INFO.phones.join(' · ')}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  {PERSONAL_INFO.address}
                </span>
              </div>
              <a
                href={PITCH_DAY_CERTIFICATE_PDF}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-zinc-800 hover:text-zinc-950 pt-1"
              >
                <Award className="w-4 h-4 text-zinc-500" />
                <span>Pitch Day 39th Edition Certificate</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </div>
          </div>

          {/* Right form column (7 cols) */}
          <div
            data-tour-id="tour-contact"
            className="md:col-span-7 bg-zinc-50/70 p-6 sm:p-8 rounded-2xl border border-zinc-200/80"
          >
            {status === 'sent' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">Message Received</h3>
                <p className="text-sm text-zinc-600 max-w-sm mx-auto">
                  {serverNote} I&apos;ll follow up with you at{' '}
                  <span className="font-medium text-zinc-900">{email}</span>.
                </p>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setMessage('');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      ref={nameInputRef}
                      type="text"
                      required
                      minLength={2}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    minLength={10}
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share details about your AI project, research collaboration, or media production..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all resize-none"
                  />
                </div>

                {status === 'error' && errorMsg && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 rounded-lg transition-colors shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
