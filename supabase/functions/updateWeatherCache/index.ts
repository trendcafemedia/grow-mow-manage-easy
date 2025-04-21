
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const openWeatherMapApiKey = Deno.env.get("OPENWEATHERMAP_API_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openWeatherMapApiKey) {
      throw new Error("OpenWeatherMap API key not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Fetch business profile to get address
    const { data: businessProfile, error: profileError } = await supabase
      .from("business_profiles")
      .select("*")
      .single();

    if (profileError) throw profileError;
    if (!businessProfile) throw new Error("Business profile not found");
    if (!businessProfile.address) throw new Error("Business address not configured");

    // Geocode the address to get coordinates
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(businessProfile.address)}&limit=1&appid=${openWeatherMapApiKey}`;
    const geocodeResponse = await fetch(geocodeUrl);
    
    if (!geocodeResponse.ok) {
      throw new Error(`Geocoding failed: ${geocodeResponse.status} ${geocodeResponse.statusText}`);
    }
    
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData || geocodeData.length === 0) {
      throw new Error("Could not geocode the business address");
    }
    
    const { lat, lon } = geocodeData[0];
    
    // Fetch 5 day / 3 hour forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${openWeatherMapApiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error(`Weather forecast failed: ${forecastResponse.status} ${forecastResponse.statusText}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    // Process forecast data to simplify it (first 3 days)
    const processedForecast = processWeatherData(forecastData);
    
    // Update the business profile with the new weather data
    const { error: updateError } = await supabase
      .from("business_profiles")
      .update({
        weather_cache: processedForecast,
        updated_at: new Date().toISOString()
      })
      .eq("id", businessProfile.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Weather cache updated successfully",
        updated: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  } catch (error) {
    console.error("Error in updateWeatherCache function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
});

function processWeatherData(forecastData: any) {
  if (!forecastData || !forecastData.list || !forecastData.list.length) {
    return null;
  }
  
  // Group forecasts by day
  const dailyForecasts = new Map();
  const today = new Date();
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);
  
  for (const forecast of forecastData.list) {
    const date = new Date(forecast.dt * 1000);
    
    // Only include forecasts for the next 3 days
    if (date > threeDaysLater) continue;
    
    const dateString = date.toISOString().split('T')[0];
    
    if (!dailyForecasts.has(dateString)) {
      dailyForecasts.set(dateString, {
        date: dateString,
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        forecasts: []
      });
    }
    
    dailyForecasts.get(dateString).forecasts.push({
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temp: Math.round(forecast.main.temp),
      feels_like: Math.round(forecast.main.feels_like),
      weather: forecast.weather[0].main,
      description: forecast.weather[0].description,
      icon: forecast.weather[0].icon,
      wind_speed: Math.round(forecast.wind.speed),
      precipitation: forecast.rain ? Math.round(forecast.rain['3h'] * 100) / 100 : 0,
      humidity: forecast.main.humidity,
      dt: forecast.dt
    });
  }
  
  // Convert to array and add daily summary
  const result = Array.from(dailyForecasts.values()).map(day => {
    const temps = day.forecasts.map((f: any) => f.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    
    // Check for precipitation in any forecast for the day
    const hasRain = day.forecasts.some((f: any) => 
      f.weather.toLowerCase().includes('rain') || 
      f.description.toLowerCase().includes('rain') ||
      f.precipitation > 0
    );
    
    // Get most common weather condition
    const weatherCounts = day.forecasts.reduce((acc: any, f: any) => {
      acc[f.weather] = (acc[f.weather] || 0) + 1;
      return acc;
    }, {});
    
    const primaryWeather = Object.entries(weatherCounts)
      .sort((a: any, b: any) => b[1] - a[1])[0][0];
    
    // Get a representative icon for the day (mid-day if available)
    const midDayForecast = day.forecasts.find((f: any) => 
      f.time.includes('12 PM') || f.time.includes('1 PM')
    ) || day.forecasts[Math.floor(day.forecasts.length / 2)];
    
    return {
      ...day,
      min_temp: minTemp,
      max_temp: maxTemp,
      has_rain: hasRain,
      primary_weather: primaryWeather,
      icon: midDayForecast.icon
    };
  });
  
  return {
    updated: new Date().toISOString(),
    location: forecastData.city?.name || 'Unknown',
    country: forecastData.city?.country || 'Unknown',
    days: result
  };
}
