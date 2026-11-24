import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Safe base directory for local contact inbox persistence
const DATA_DIR = path.resolve(__dirname, 'data');
const INBOX_FILE = path.resolve(DATA_DIR, 'contact-submissions.json');

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  deliveredVia: 'email' | 'inbox';
  createdAt: string;
}

interface GitHubRepoSummary {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  updatedAt: string;
}

interface GitHubSnapshot {
  username: string;
  name: string | null;
  avatarUrl: string | null;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  topRepos: GitHubRepoSummary[];
  syncedAt: string;
  source: 'live' | 'cache' | 'unavailable';
}

// In-memory rate limiter for contact endpoint (per IP)
const contactRateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX_REQUESTS = 5;

// In-memory cache for GitHub API responses
const githubCache = new Map<string, { data: GitHubSnapshot; expiresAt: number }>();
const GITHUB_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function sanitizeText(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  if (email.length > 150 || email.length < 5) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidGitHubUsername(username: string): boolean {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username);
}

async function persistSubmission(entry: ContactSubmission): Promise<void> {
  // Verify resolved path stays strictly inside DATA_DIR
  if (!INBOX_FILE.startsWith(DATA_DIR + path.sep)) {
    throw new Error('Invalid storage path');
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  let existing: ContactSubmission[] = [];
  try {
    const raw = await fs.readFile(INBOX_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      existing = parsed;
    }
  } catch {
    existing = [];
  }
  existing.unshift(entry);
  // Retain latest 200 submissions locally
  const bounded = existing.slice(0, 200);
  await fs.writeFile(INBOX_FILE, JSON.stringify(bounded, null, 2), 'utf8');
}

async function sendResendEmail(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const toEmail = process.env.CONTACT_TO_EMAIL?.trim() || 'utomobongdduff@gmail.com';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [toEmail],
        reply_to: params.email,
        subject: params.subject
          ? `[Portfolio] ${params.subject}`
          : `[Portfolio] Message from ${params.name}`,
        text: `Name: ${params.name}\nEmail: ${params.email}\n\n${params.message}`,
      }),
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchGitHubSnapshot(username: string): Promise<GitHubSnapshot> {
  const cached = githubCache.get(username.toLowerCase());
  if (cached && cached.expiresAt > Date.now()) {
    return { ...cached.data, source: 'cache' };
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'paulduff-portfolio-server',
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    // Hardcoded GitHub API origin only (prevents SSRF)
    const encodedUser = encodeURIComponent(username);
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodedUser}`, {
        headers,
        signal: controller.signal,
      }),
      fetch(
        `https://api.github.com/users/${encodedUser}/repos?sort=updated&per_page=100&type=owner`,
        {
          headers,
          signal: controller.signal,
        }
      ),
    ]);

    if (!userRes.ok) {
      return {
        username,
        name: null,
        avatarUrl: null,
        profileUrl: `https://github.com/${encodedUser}`,
        publicRepos: 0,
        followers: 0,
        totalStars: 0,
        topRepos: [],
        syncedAt: new Date().toISOString(),
        source: 'unavailable',
      };
    }

    const userData = (await userRes.json()) as {
      login?: string;
      name?: string | null;
      avatar_url?: string | null;
      html_url?: string;
      public_repos?: number;
      followers?: number;
    };

    const rawRepos = reposRes.ok
      ? ((await reposRes.json()) as Array<{
          name?: string;
          description?: string | null;
          stargazers_count?: number;
          forks_count?: number;
          language?: string | null;
          html_url?: string;
          updated_at?: string;
          fork?: boolean;
        }>)
      : [];

    const ownRepos = Array.isArray(rawRepos)
      ? rawRepos.filter((r) => !r.fork)
      : [];

    const totalStars = ownRepos.reduce(
      (sum, repo) => sum + (typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0),
      0
    );

    const topRepos: GitHubRepoSummary[] = [...ownRepos]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 4)
      .map((repo) => ({
        name: String(repo.name || ''),
        description: repo.description || null,
        stars: Number(repo.stargazers_count || 0),
        forks: Number(repo.forks_count || 0),
        language: repo.language || null,
        url: String(repo.html_url || `https://github.com/${encodedUser}`),
        updatedAt: String(repo.updated_at || new Date().toISOString()),
      }));

    const snapshot: GitHubSnapshot = {
      username: userData.login || username,
      name: userData.name || null,
      avatarUrl: userData.avatar_url || null,
      profileUrl: userData.html_url || `https://github.com/${encodedUser}`,
      publicRepos: Number(userData.public_repos || 0),
      followers: Number(userData.followers || 0),
      totalStars,
      topRepos,
      syncedAt: new Date().toISOString(),
      source: 'live',
    };

    githubCache.set(username.toLowerCase(), {
      data: snapshot,
      expiresAt: Date.now() + GITHUB_CACHE_TTL_MS,
    });

    return snapshot;
  } catch {
    return {
      username,
      name: null,
      avatarUrl: null,
      profileUrl: `https://github.com/${encodeURIComponent(username)}`,
      publicRepos: 0,
      followers: 0,
      totalStars: 0,
      topRepos: [],
      syncedAt: new Date().toISOString(),
      source: 'unavailable',
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '32kb' }));

  // Healthcheck
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // Live GitHub Metrics Proxy
  app.get('/api/github', async (req: Request, res: Response) => {
    const requested = typeof req.query.username === 'string' ? req.query.username.trim() : '';
    const defaultUser = process.env.GITHUB_USERNAME?.trim() || 'utomobongduff';
    const username = requested || defaultUser;

    if (!isValidGitHubUsername(username)) {
      res.status(400).json({ error: 'Invalid GitHub username format.' });
      return;
    }

    const snapshot = await fetchGitHubSnapshot(username);
    res.json(snapshot);
  });

  // Contact Form Delivery & Persistence
  app.post('/api/contact', async (req: Request, res: Response) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const rateEntry = contactRateMap.get(ip);

    if (rateEntry && rateEntry.resetAt > now) {
      if (rateEntry.count >= RATE_MAX_REQUESTS) {
        res.status(429).json({
          error: 'Too many messages sent recently. Please wait a few minutes before trying again.',
        });
        return;
      }
      rateEntry.count += 1;
    } else {
      contactRateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    }

    // Honeypot check (bots often fill hidden fields)
    const honeypot = sanitizeText(req.body?.website, 100);
    if (honeypot.length > 0) {
      res.status(200).json({ ok: true, deliveredVia: 'inbox' });
      return;
    }

    const name = sanitizeText(req.body?.name, 100);
    const email = sanitizeText(req.body?.email, 150);
    const subject = sanitizeText(req.body?.subject, 150);
    const message = sanitizeText(req.body?.message, 3000);

    if (name.length < 2) {
      res.status(400).json({ error: 'Please enter your name (at least 2 characters).' });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    if (message.length < 10) {
      res.status(400).json({ error: 'Please enter a message of at least 10 characters.' });
      return;
    }

    const emailed = await sendResendEmail({ name, email, subject, message });
    const deliveredVia: 'email' | 'inbox' = emailed ? 'email' : 'inbox';

    const submission: ContactSubmission = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      subject,
      message,
      deliveredVia,
      createdAt: new Date().toISOString(),
    };

    try {
      await persistSubmission(submission);
    } catch {
      // If disk write fails in read-only env, still succeed if email was sent
      if (!emailed) {
        res.status(500).json({ error: 'Unable to store your message right now. Please email directly.' });
        return;
      }
    }

    res.status(201).json({
      ok: true,
      id: submission.id,
      deliveredVia,
      message: emailed
        ? 'Your message has been emailed directly to my inbox.'
        : 'Your message has been saved to my portfolio inbox.',
    });
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
