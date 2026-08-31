# Mohammad Golam Sarowar — Portfolio Website

A modern, full-featured portfolio website for Mohammad Golam Sarowar — Network Engineer & Researcher. This professional portfolio showcases core IP networking experience, research work (IoT, AI/ML, Federated Learning, distributed systems), certifications, awards, and provides an intuitive admin panel for content management.

## 🌟 Features

### Public-Facing Features
- **Dynamic Portfolio Pages**: Beautiful, responsive pages showcasing:
  - Industry & research experience (ISP core networking + academic/research work)
  - Education history
  - Publications (academic, conference, non-academic, work in progress)
  - Skills, courses & professional certifications (CCNA, MTCRE, MTCNA, etc.)
  - Awards & achievements
  - Volunteering activities
  - Scholarly activities
  - Contact form with email notifications

### Admin Panel
- **Secure Authentication**: Protected admin dashboard with role-based access
- **Content Management System**: Easy-to-use interface for managing all portfolio content
- **Media Management**: Upload and manage images, PDFs, and conference materials
- **Real-time Updates**: Content changes reflect immediately with automatic cache revalidation
- **CRUD Operations**: Create, read, update, and delete all portfolio sections

### Technical Features
- **Server-Side Rendering**: Optimized performance with Next.js Server Components
- **Database Integration**: Powered by Supabase for scalable data management
- **File Storage**: Secure file uploads with Supabase Storage
- **Email Integration**: Contact form submissions via Resend API
- **SEO Optimized**: Meta tags, OpenGraph/Twitter cards, `sitemap.xml`, `robots.txt`
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Self-hosted fonts**: Inter & Playfair Display via `@fontsource`, no external font-CDN dependency at build or runtime

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Email Service**: Resend API

### Development
- **Language**: TypeScript (strict mode, zero `ignoreBuildErrors`)
- **Linting**: ESLint 9 (flat config, `eslint-config-next`)
- **Package Manager**: npm
- **Deployment**: Vercel (or any Next.js-compatible host)

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js 18+ installed
- npm package manager
- A Supabase project (for database and storage) — **use a dedicated project for this client**, do not reuse another client's project
- Resend API key (for email functionality)
- Git (for version control)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory (see `.env.local` already present for this deployment, or start fresh). Only 3 variables are needed — this is the complete list the app reads from `process.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are **required** — the app throws at startup if they're missing (see `lib/supabase/*.ts`), so it can never silently fall back to a different Supabase project. `RESEND_API_KEY` is required only for the contact form to send email.

Optionally, set `NEXT_PUBLIC_SITE_URL=https://your-production-domain.com` to control the canonical URL used in SEO metadata, `sitemap.xml`, and `robots.txt` (`app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`) — it defaults to a placeholder domain if unset.

### 3. Database Setup

1. Create a Supabase project (dedicated to this client)
2. Run the SQL scripts in the `scripts/` directory in order:
   - `001_create_tables.sql` — creates all core tables
   - `003_create_storage_bucket.sql` — sets up file storage
   - `006_fix_rls_policies.sql` — configures Row Level Security
   - `007` through `013` — incremental migrations (certification/award images, conference publication fields, academic PDF + citation count)
   - `014_seed_new_client_data.sql` — seeds Mohammad Golam Sarowar's profile data (see `SEED_DATA_GUIDE.md`)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

### 6. Lint

```bash
npm run lint
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel routes
│   ├── api/                # API routes
│   ├── auth/                # Authentication pages
│   └── [pages]/             # Public-facing pages
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   └── [feature]/            # Feature-specific components
├── lib/                     # Utility functions
│   └── supabase/            # Supabase client configuration
├── scripts/                 # Database migration + seed scripts
├── public/                  # Static assets (incl. CV PDF)
└── proxy.ts                 # Next.js proxy middleware
```

## 🔐 Authentication

The admin panel is protected by Supabase Authentication. To access:

1. Navigate to `/auth/login`
2. Use your admin credentials
3. All admin routes are automatically protected

## 📝 Content Management

All content can be managed through the admin panel at `/admin`. See `SEED_DATA_GUIDE.md` for a full map of what lives where, and how to seed or update it. The system supports:

- **Publications**: Academic papers, conference presentations, work in progress
- **Education**: Academic degrees and certifications
- **Experience**: Industry and research positions
- **Skills**: Categorized skills with proficiency levels
- **Awards**: Professional and academic recognitions
- **Certifications**: Professional certifications with credentials
- **Volunteering**: Community service activities
- **Scholarly Activities**: Academic service and contributions

## 🚢 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Environment Variables for Production

Ensure all environment variables from `.env.local` are added to your hosting provider's project settings.

## 🔧 Key Features Implementation

### Cache Management
- Dynamic rendering enabled for real-time content updates
- Automatic cache revalidation on content changes
- Optimized for production performance

### File Uploads
- Image uploads for conference materials and certifications
- PDF uploads for academic papers
- Secure file storage with Supabase

### Email Notifications
- Contact form submissions sent via Resend to mohammad.sarowar06@gmail.com

## 📚 Documentation

- **Data Seeding Guide**: See `SEED_DATA_GUIDE.md`
- **Authentication Setup**: See `AUTHENTICATION_FIX.md`
- **Email Configuration**: See `EMAIL_SETUP.md`
- **Database Schema**: Check SQL scripts in `scripts/` directory

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

**Built for Mohammad Golam Sarowar**
