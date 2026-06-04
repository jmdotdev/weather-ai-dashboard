# Weather AI Dashboard

A modern, responsive weather dashboard built with React + Vite + TypeScript and Tailwind CSS. The app uses the Weather AI API (https://api.weather-ai.co/v1) for forecasts and an OpenStreetMap Nominatim geocoding service for place search.

Live demo: (add your deployed URL here)

## Why Nominatim (OpenStreetMap)
- The Weather API provides weather forecasts for coordinates (lat/lon) but it doesn't provide a place search UI.
- I added Nominatim (`https://nominatim.openstreetmap.org/search`) to convert typed place names into coordinates and human-readable `display_name` values used by the UI and when saving favorites.
- Nominatim is free, simple, and well-suited for client-side geocoding when you need decent place names without a paid geocoding service.

## Weather AI endpoints used
- `GET /v1/forecast` — primary forecast endpoint used to fetch `current`, `hourly`, and `daily` data for specific coordinates.
- `GET /v1/weather-geo` — IP-based endpoint used on app mount to detect the user's approximate location and display a detected-location banner. 

Note: Requests to the Weather AI API require an API key. Set `VITE_WEATHER_API_KEY` in your `.env` file when running locally.

## Features
- Place search with debounced autocomplete (Nominatim)
- IP-based geo detection fallback (`/v1/weather-geo`) on first load
- Current weather card 
- Hourly SVG temperature chart
- 7-day forecast grid
- Saveable favorites (persisted to `localStorage`) with dedupe by name or coordinates
- Unit toggle (°C / °F)

## Tech stack
- Vite + React + TypeScript
- Tailwind CSS for styling
- axios for HTTP requests

## Local setup
1. Clone the repository and install dependencies:

```bash
git clone https://github.com/jmdotdev/weather-ai-dashboard.git
cd weather-dashboard
npm install
```

2. Add your Weather AI API key in a `.env` file at the project root 
```
VITE_WEATHER_API_KEY=your_api_key
```

3. Run the dev server:

```bash
npm run dev
```

## Deployment
- Ensure the `VITE_WEATHER_API_KEY` environment variable is configured in vercel.
