
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Cloud, CloudRain, Sun } from "lucide-react";

interface WeatherDay {
  date: string;
  condition: "sunny" | "cloudy" | "rain" | "partlyCloudy";
  temperature: number;
  precipitation: number;
}

interface WeatherForecastProps {
  forecast?: WeatherDay[];
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  // Mock data - would be replaced with real API data from OpenWeatherMap
  const mockForecast: WeatherDay[] = [
    {
      date: "Today",
      condition: "sunny",
      temperature: 78,
      precipitation: 0
    },
    {
      date: "Tomorrow",
      condition: "partlyCloudy",
      temperature: 72,
      precipitation: 20
    },
    {
      date: "Wed",
      condition: "rain",
      temperature: 68,
      precipitation: 80
    }
  ];

  const weatherData = forecast || mockForecast;

  // Helper functions to get weather icons
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-400" />;
      case "rain":
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case "partlyCloudy":
        return (
          <div className="relative">
            <Sun className="w-8 h-8 text-yellow-400" />
            <Cloud className="w-6 h-6 text-gray-400 absolute -top-1 -right-1" />
          </div>
        );
      default:
        return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          3-Day Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {weatherData.map((day, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/30"
            >
              <div className="font-medium mb-2">{day.date}</div>
              <div className="my-2">{getWeatherIcon(day.condition)}</div>
              <div className="text-xl font-bold">{day.temperature}°F</div>
              {day.precipitation > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {day.precipitation}% rain
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
