# You Grow I Mow - Landscaping Business Manager

A kid-friendly landscaping business manager designed to help young entrepreneurs manage their lawn care services.

## Features

- **Dashboard**: View earnings, upcoming jobs, and weather forecasts
- **Customer Management**: Keep track of all your customers and their service history
- **Calendar**: Schedule and manage jobs with upcoming appointments view
- **Inventory**: Track equipment, supplies, and fuel usage
- **Map**: View customers on a map with color-coded status indicators
- **Settings**: Configure your business profile and app preferences

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, TanStack Query v5, React Router
- **Backend**: Supabase Edge Functions
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase email / Google OAuth
- **Payments**: Stripe Checkout
- **Calendar**: Google Calendar API sync
- **Weather**: OpenWeatherMap REST API
- **Maps**: Google Maps & Places APIs
- **Push Notifications**: Expo Push Notification Service

## Getting Started

### Development Setup

To run the project in development mode:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at http://localhost:5173

## Running Supabase Locally with Docker

You can run a local Supabase instance with Docker for development:

1. Install Docker Desktop and ensure it's running
2. Install Supabase CLI: `npm install -g supabase`
3. Start local Supabase: `supabase start`
4. Get local database URL: `supabase status`

The local Supabase Studio will be available at http://localhost:54323

To connect your app to the local Supabase instance, update the Supabase URL and anon key in your environment variables.

## Google Maps Setup & Billing

This application uses several Google APIs:

1. **Google Maps JavaScript API**: For the customer map
2. **Google Places API**: For address autocomplete
3. **Google Directions API**: For driving distance and ETA calculations

To set up Google Maps:

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Maps JavaScript API, Places API, and Directions API
3. Create an API key with the appropriate restrictions
4. Add the API key to your environment variables

**Important Billing Information**:
- Google Maps APIs require a billing account
- A free tier is available that includes:
  - 200 daily Maps JavaScript API loads
  - 5,000 monthly Places API requests
  - 5,000 monthly Directions API requests
- Set up billing alerts to avoid unexpected charges

## Authentication Setup

For authentication to work properly, you need to configure the following in your Supabase project:

1. Set the Site URL to: `https://grow-mow-manage-easy.vercel.app`
2. Add the following Redirect URLs:
   - `https://grow-mow-manage-easy.vercel.app/auth/callback`
   - `http://localhost:5173/auth/callback` (for local development)

This ensures proper authentication flow in both development and production environments.

## iOS Build with Capacitor

To build for iOS with Capacitor:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/ios

# Initialize Capacitor
npx cap init YouGrowIMow io.yougrowi.mow

# Build the web app
npm run build

# Add iOS platform
npx cap add ios

# Open in Xcode
npx cap open ios
```

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Main application pages
- `/src/lib` - Utility functions and helpers
- `/src/hooks` - Custom React hooks
- `/src/utils` - Helper functions
- `/supabase/functions` - Supabase Edge Functions

## Deployment

- **Frontend**: Vercel
- **Backend/Database**: Supabase
- **Edge Functions**: Supabase Edge Functions

## Environment Variables

For the production application, you'll need to set up the following environment variables:

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
OPENWEATHERMAP_API_KEY
GOOGLE_PLACES_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
BASE_URL
NEXT_PUBLIC_BASE_URL
```
