
# You Grow I Mow - Landscaping Business Manager

A kid-friendly landscaping business manager designed to help young entrepreneurs manage their lawn care services.

## Features

- **Dashboard**: View earnings, upcoming jobs, and weather forecasts
- **Customer Management**: Keep track of all your customers and their service history
- **Calendar**: Schedule and manage jobs with upcoming appointments view
- **Inventory**: Track equipment, supplies, and fuel usage
- **Settings**: Configure your business profile and app preferences

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, TanStack Query v5, React Router
- **Backend**: Node 18, Express, TypeScript, Prisma ORM, PostgreSQL (Supabase)
- **Auth**: Supabase email / Google OAuth
- **Payments**: Stripe Checkout
- **Calendar**: Google Calendar API sync
- **Weather**: OpenWeatherMap REST API

## Getting Started

### Development Setup

To run the project in development mode:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at http://localhost:8080

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Main application pages
- `/src/lib` - Utility functions and helpers
- `/src/hooks` - Custom React hooks

## Next Steps

This initial version includes the frontend UI with mock data. To complete the application:

1. Connect to Supabase for authentication and database
2. Implement the Stripe integration for payments
3. Add Google Calendar sync functionality
4. Integrate OpenWeatherMap API for real weather data
5. Set up automated notifications for appointment reminders

## Environment Variables

For the complete application, you'll need to set up the following environment variables:

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
OWM_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALENDAR_ID
NEXT_PUBLIC_BASE_URL
```
