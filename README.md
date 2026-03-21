# Nova Net - Next.js Website

A professional Next.js website for Nova Net exterior cleaning services, featuring a Mapbox integration and Supabase database management.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 🗺️ Interactive Mapbox map showing completed jobs
- 💾 Supabase database for clients and jobs management
- 📱 Fully responsive mobile-first design
- ⚡ Next.js 14 with App Router
- 🎯 TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project
- A Mapbox access token (already included in the code)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
   - Add your Resend email credentials:
   ```
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_TO=info@yourdomain.com
   ```

3. Set up Supabase database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase-schema.sql` to create the necessary tables

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
novanet/
├── app/
│   ├── api/
│   │   └── getJobs/        # API route for fetching jobs
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Hero.tsx            # Hero section
│   ├── Services.tsx        # Services section
│   ├── Results.tsx         # Results/portfolio section
│   ├── About.tsx           # About section
│   ├── Reviews.tsx         # Reviews section
│   ├── Zones.tsx           # Service zones
│   ├── Process.tsx         # Process steps
│   ├── Contact.tsx         # Contact form
│   ├── MapBox.tsx          # Mapbox map component
│   ├── MapLegend.tsx       # Map legend
│   └── Footer.tsx          # Footer
├── lib/
│   └── supabase.ts         # Supabase client and managers
├── types/
│   └── markers.ts          # TypeScript types for markers
└── supabase-schema.sql     # Database schema

```

## Database Schema

### Clients Table
- `id` (UUID, Primary Key)
- `name` (TEXT, Required)
- `address` (TEXT, Required)
- `phone` (TEXT, Optional)
- `email` (TEXT, Optional)
- `current_job_id` (UUID, Foreign Key to jobs)
- `number_of_jobs` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Jobs Table
- `id` (UUID, Primary Key)
- `client_id` (UUID, Foreign Key to clients)
- `job_type` (TEXT, Required)
- `status` (TEXT, Default: 'pending')
- `location` (JSONB, [longitude, latitude])
- `review` (TEXT, Optional)
- `rating` (INTEGER, 1-5, Optional)
- `description` (TEXT, Optional)
- `scheduled_date` (TIMESTAMP, Optional)
- `completed_date` (TIMESTAMP, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Supabase Manager

The `lib/supabase.ts` file exports two managers:

### `clientManager`
- `getAllClients()` - Get all clients
- `getClientById(id)` - Get a single client
- `createClient(client)` - Create a new client
- `updateClient(id, updates)` - Update a client
- `deleteClient(id)` - Delete a client
- `incrementJobCount(clientId)` - Increment job count

### `jobManager`
- `getAllJobs()` - Get all jobs
- `getJobsByClientId(clientId)` - Get jobs for a client
- `getCompletedJobs()` - Get completed jobs (for map)
- `getJobById(id)` - Get a single job
- `createJob(job)` - Create a new job
- `updateJob(id, updates)` - Update a job
- `deleteJob(id)` - Delete a job

## Mapbox Integration

The map displays completed jobs as markers. When a marker is clicked, it shows:
- Job type
- Status
- Review (if available)
- Rating

## Building for Production

```bash
npm run build
npm start
```

## License

Private project for Nova Net.
