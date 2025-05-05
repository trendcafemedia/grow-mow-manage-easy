import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Define interface for the WeatherAPI response
interface WeatherAPIForecastDay {
  date: string;
  day: {
    maxtemp_f: number;
    mintemp_f: number;
    condition: {
      code: number;
    };
  };
}

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';
  high: number;
  low: number;
  precipitation: number;
  location: string;
  forecast: Array<{
    day: string;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';
    high: number;
    low: number;
  }>;
}

// Mock data for fallback
const mockWeatherData: WeatherData = {
  temperature: 72,
  condition: 'sunny',
  high: 78,
  low: 65,
  precipitation: 10,
  location: 'New York, NY',
  forecast: [
    { day: 'Wed', condition: 'cloudy', high: 75, low: 61 },
    { day: 'Thu', condition: 'rainy', high: 68, low: 59 },
    { day: 'Fri', condition: 'rainy', high: 66, low: 58 },
    { day: 'Sat', condition: 'cloudy', high: 70, low: 62 },
    { day: 'Sun', condition: 'sunny', high: 76, low: 64 },
  ],
};

const getWeatherIcon = (condition: WeatherData['condition'], className = 'h-5 w-5') => {
  switch (condition) {
    case 'sunny':
      return <Sun className={`${className} text-yellow-500`} />;
    case 'cloudy':
      return <Cloud className={`${className} text-gray-400`} />;
    case 'rainy':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'snowy':
      return <CloudSnow className={`${className} text-blue-200`} />;
    case 'stormy':
      return <CloudLightning className={`${className} text-purple-500`} />;
    case 'windy':
      return <Wind className={`${className} text-gray-500`} />;
    default:
      return <Sun className={`${className} text-yellow-500`} />;
  }
};

// Map WeatherAPI conditions to our condition types
const mapWeatherCondition = (conditionCode: number): WeatherData['condition'] => {
  // WeatherAPI.com condition codes
  if (conditionCode >= 1000 && conditionCode <= 1003) return 'sunny'; // Clear to partly cloudy
  if (conditionCode >= 1004 && conditionCode <= 1030) return 'cloudy'; // Cloudy, mist, fog
  if (conditionCode >= 1063 && conditionCode <= 1171) return 'rainy'; // Rain, drizzle
  if (conditionCode >= 1180 && conditionCode <= 1201) return 'rainy'; // More rain
  if (conditionCode >= 1204 && conditionCode <= 1237) return 'snowy'; // Snow, sleet, ice
  if (conditionCode >= 1240 && conditionCode <= 1246) return 'rainy'; // Showers
  if (conditionCode >= 1273 && conditionCode <= 1282) return 'stormy'; // Thunderstorm
  return 'sunny'; // Default
};

export const WeatherWidget: React.FC<{ location?: string }> = ({ location = 'New York' }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [businessZip, setBusinessZip] = useState<string | null>(null);

  // Fetch business profile data to get zip code
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        // Import supabase dynamically to avoid circular dependencies
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data, error } = await supabase
          .from('business_profiles')
          .select('address')
          .single();
        
        if (error) {
          console.error('Error fetching business profile:', error);
          return;
        }
        
        if (data && data.address) {
          // Try to extract zip code from address (assuming US format with 5-digit zip at end)
          const zipMatch = data.address.match(/\b\d{5}\b(?![\d-])/);
          if (zipMatch) {
            setBusinessZip(zipMatch[0]);
          }
        }
      } catch (err) {
        console.error('Error in business profile fetch:', err);
      }
    };

    fetchBusinessProfile();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      // Determine location to use for weather lookup (prioritize zip code if available)
      const weatherLocation = businessZip || location;
      
      try {
        // Use the WeatherAPI.com API key
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        
        if (!apiKey) {
          console.warn('WeatherWidget: No API key found in environment variables. Using mock data.');
          // If no API key is available, use mock data after a short delay
          setTimeout(() => {
            setWeather({
              ...mockWeatherData,
              location: weatherLocation || mockWeatherData.location
            });
            setLoading(false);
          }, 800);
          return;
        }
        
        // Get current weather and forecast in one request
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(weatherLocation)}&days=5&aqi=no&alerts=no`
        );
        
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Process forecast data
        const forecast = data.forecast.forecastday.map((day: WeatherAPIForecastDay) => {
          return {
            day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
            high: Math.round(day.day.maxtemp_f),
            low: Math.round(day.day.mintemp_f),
            condition: mapWeatherCondition(day.day.condition.code)
          };
        });
        
        // Build weather data object
        const weatherData: WeatherData = {
          temperature: Math.round(data.current.temp_f),
          condition: mapWeatherCondition(data.current.condition.code),
          high: forecast[0].high, // Today's high
          low: forecast[0].low, // Today's low
          precipitation: Math.round(data.current.precip_in * 100), // Convert to percentage
          location: `${data.location.name}, ${data.location.country}`,
          forecast
        };
        
        setWeather(weatherData);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError((err as Error).message);
        toast({
          title: 'Weather data error',
          description: 'Using sample weather data instead.',
          variant: 'destructive',
        });
        
        // Use mock data as fallback
        setWeather({
          ...mockWeatherData,
          location: location || mockWeatherData.location
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, toast, businessZip]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading weather data...</p>
          </div>
        ) : !weather ? (
          <div className="text-center py-6">
            <p className="text-sm text-destructive">Unable to fetch weather data</p>
            <button 
              className="mt-2 text-xs text-primary hover:underline"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex flex-col items-center">
              {getWeatherIcon(weather.condition, 'h-14 w-14')}
              <h3 className="text-3xl font-bold mt-2">{weather.temperature}°F</h3>
              <p className="text-muted-foreground capitalize">{weather.condition}</p>
              <p className="text-sm text-muted-foreground">{weather.location}</p>
              <div className="flex space-x-4 mt-1">
                <span className="text-sm">H: {weather.high}°</span>
                <span className="text-sm">L: {weather.low}°</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Precipitation: {weather.precipitation}%
              </p>
            </div>

            <div className="mt-5 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-3">5-Day Forecast</p>
              <div className="flex justify-between">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="text-xs font-medium">{day.day}</span>
                    {getWeatherIcon(day.condition, 'h-6 w-6 my-1')}
                    <div className="flex flex-col text-xs">
                      <span>{day.high}°</span>
                      <span className="text-muted-foreground">{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
